import type { Bill, BillVote, Character, Country, Election, PolicyArea, World } from "../shared/types";
import { pushEvent } from "./bootstrap";
import { applyCandidateResults, ensureCandidates, stepPlayerPolitics } from "./politics-players";
import { Rng, approach, clamp, clamp01 } from "./rng";
import { SECONDS_PER_YEAR } from "./step-economy";

/**
 * Politics.
 *
 * The design rule here: a country has seat *counts* from the moment it is
 * created, but individual legislators are only materialised for countries a
 * player is actually playing. One hundred and ninety-seven full national
 * legislatures would be tens of thousands of characters, and a Durable Object
 * would fall over. Votes in countries without a roster still resolve, using the
 * same whip-and-deviation model, so the outcome distribution is identical.
 */

const ROSTER_CAP = 220;

export function ensureRoster(world: World, countryId: string, rnd: Rng): void {
  const c = world.countries[countryId];
  if (!c?.legislature) return;
  if (c.legislature.membership.__rostered) return;

  let total = 0;
  for (const ch of c.legislature.chambers) total += Math.min(ROSTER_CAP, ch.seats);

  for (const chamber of c.legislature.chambers) {
    const ids: string[] = [];
    const target = Math.min(ROSTER_CAP, chamber.seats);
    const parties = c.parties.filter((p) => (p.seats[chamber.id] ?? 0) > 0 || p.status === "government");
    if (!parties.length) {
      c.legislature.membership[chamber.id] = [];
      continue;
    }
    // Allocate seats to parties in proportion to their recorded seat counts.
    const alloc = parties.map((p) => ({ p, seats: p.seats[chamber.id] ?? 0 }));
    const sum = alloc.reduce((a, x) => a + x.seats, 0) || 1;
    for (const a of alloc) {
      const n = Math.round((a.seats / sum) * target);
      for (let i = 0; i < n; i++) {
        const id = `ch-${c.id}-${chamber.id}-${i}`;
        if (world.characters[id]) continue;
        const ideology = clamp(a.p.ideology + rnd.normal() * 18, -100, 100);
        const ch: Character = {
          id,
          name: nextName(world, c.id, rnd),
          country: c.id,
          role: "legislator",
          partyId: a.p.id,
          stats: {
            competence: Math.round(rnd.normal() * 28 + 10),
            charisma: Math.round(rnd.normal() * 26),
            integrity: Math.round(rnd.normal() * 30),
            ambition: Math.round(rnd.normal() * 28),
            ideology: Math.round(ideology),
            popularity: Math.round(rnd.normal() * 22 + 46),
            experience: Math.round(rnd.normal() * 24 + 46),
            militancy: Math.round(rnd.normal() * 28),
          },
          chamberId: chamber.id,
          createdAt: 0,
        };
        world.characters[id] = ch;
        ids.push(id);
      }
    }
    c.legislature.membership[chamber.id] = ids;
  }
  (c.legislature.membership as Record<string, unknown>).__rostered = true;
}

let nameCounter = 0;
function nextName(world: World, countryId: string, rnd: Rng): string {
  nameCounter++;
  const c = world.countries[countryId];
  return `${c?.demonym ?? countryId} MP ${nameCounter}`;
  void rnd;
}

// ===========================================================================
// Bills
// ===========================================================================

export function introduceBill(world: World, countryId: string, draft: Omit<Bill, "id" | "country" | "votes" | "tallies" | "introducedAt" | "expiresAt" | "status">, byUserId?: string): Bill | null {
  const c = world.countries[countryId];
  if (!c?.legislature) return null;
  const id = `bill-${c.id}-${world.events.length}-${Math.round(world.t)}`;
  const bill: Bill = {
    ...draft,
    id,
    country: countryId,
    status: "introduced",
    votes: [],
    tallies: {},
    introducedAt: world.t,
    expiresAt: world.t + 200 * 86400,
  };
  c.legislature.activeBills.push(id);
  world.bills[id] = bill;
  pushEvent(world, {
    kind: "political",
    severity: "info",
    country: countryId,
    title: `${c.name}: ${bill.title} introduced`,
    body: bill.summary,
    byUserId,
    tags: ["legislation"],
  });
  return bill;
}

function stepBills(world: World, rnd: Rng, dt: number): void {
  for (const c of Object.values(world.countries)) {
    if (!c.legislature) continue;
    if (!c.legislature.activeBills.length) continue;

    for (const billId of [...c.legislature.activeBills]) {
      const bill = findBill(world, c, billId);
      if (!bill) {
        c.legislature.activeBills.splice(c.legislature.activeBills.indexOf(billId), 1);
        continue;
      }

      if (world.t > bill.expiresAt) {
        bill.status = "expired";
        c.legislature.activeBills.splice(c.legislature.activeBills.indexOf(billId), 1);
        pushEvent(world, { kind: "political", severity: "notice", country: c.id, title: `${c.name}: ${bill.title} lapsed`, body: "The bill expired without passage.", tags: ["legislation"] });
        continue;
      }

      // Progression through the chamber pipeline.
      const passage = dt / (SECONDS_PER_YEAR * 0.12);

      if (bill.status === "introduced" && rnd.chance(passage)) {
        bill.status = "in-committee";
      } else if (bill.status === "in-committee") {
        bill.publicOpinion = approach(bill.publicOpinion, publicOpinionFor(c, bill), 0.1 * passage + 0.0004);
        if (rnd.chance(passage * 1.6)) {
          bill.status = "passed-first";
          const first = bill.chamberId;
          bill.tallies[first] = tallyChamber(world, c, bill, first, rnd);
        }
      } else if (bill.status === "passed-first") {
        const nextChamber = c.legislature.chambers.find((ch) => ch.id !== bill.chamberId && bill.passageChambers.includes(ch.id));
        if (!nextChamber) {
          bill.status = "awaiting-signature";
        } else if (rnd.chance(passage * 1.2)) {
          const t = tallyChamber(world, c, bill, nextChamber.id, rnd);
          bill.tallies[nextChamber.id] = t;
          const seats = nextChamber.seats;
          if (t.aye > seats * 0.5) {
            bill.status = "awaiting-signature";
          } else {
            bill.status = "rejected";
            c.legislature.activeBills.splice(c.legislature.activeBills.indexOf(billId), 1);
            pushEvent(world, { kind: "political", severity: "notice", country: c.id, title: `${c.name}: ${bill.title} defeated in the ${nextChamber.name}`, body: `${t.aye} for, ${t.nay} against, ${t.abstain} abstaining.`, tags: ["legislation"] });
          }
        }
      } else if (bill.status === "awaiting-signature") {
        if (rnd.chance(passage * 1.8)) {
          bill.status = "enacted";
          bill.enactedAt = world.t;
          c.legislature.activeBills.splice(c.legislature.activeBills.indexOf(billId), 1);
          applyBill(c, bill);
          pushEvent(world, {
            kind: "legal",
            severity: "major",
            country: c.id,
            title: `${c.name}: ${bill.title} enacted`,
            body: `Signed into law after clearing ${Object.keys(bill.tallies).join(" and ")}.`,
            tags: ["legislation", "enacted"],
          });
          // A popular law raises approval, an unpopular one lowers it.
          const swing = (bill.publicOpinion - 50) / 50;
          c.executive.approval = clamp(c.executive.approval + swing * 18 + (bill.sponsorPartyId && c.executive.coalition.includes(bill.sponsorPartyId) ? 3 : -2), 0, 100);
        }
      }
    }
  }
}

function tallyChamber(world: World, c: Country, bill: Bill, chamberId: string, rnd: Rng): { aye: number; nay: number; abstain: number; absent: number } {
  const chamber = c.legislature?.chambers.find((x) => x.id === chamberId);
  const seats = chamber?.seats ?? 1;
  const government = new Set(c.executive.coalition);
  let aye = 0;
  let nay = 0;
  let abstain = 0;
  let absent = 0;

  for (const p of c.parties) {
    const pSeats = p.seats[chamberId] ?? 0;
    if (!pSeats) continue;
    // How aligned this party's members are with the bill.
    const inGov = government.has(p.id);
    const sponsorAligned = p.id === bill.sponsorPartyId;
    const ideologicalFit = 1 - Math.abs(p.ideology - c.ideology) / 200;
    const coalitionMatch = inGov ? bill.whipStrength * p.cohesion * (sponsorAligned ? 1 : 0.72) : (1 - bill.whipStrength * 0.6) * p.cohesion * 0.4;
    const support = clamp(coalitionMatch * ideologicalFit + (sponsorAligned ? 0.2 : 0) + (bill.publicOpinion - 50) / 260 + rnd.normal() * 0.05, 0, 0.98);
    let a = Math.round(pSeats * support);
    let n = Math.round(pSeats * (1 - support) * 0.86);
    let ab = pSeats - a - n;
    if (ab < 0) {
      ab = 0;
      n = pSeats - a;
    }
    // Turnout: absent members cost the bill more than they cost the opposition.
    const turnout = clamp(0.82 + bill.publicOpinion / 400 - p.cohesion / 900 + rnd.normal() * 0.03, 0.4, 0.99);
    const absentCount = Math.round(pSeats * (1 - turnout));
    n = Math.max(0, n - Math.round(absentCount * 0.5));
    ab += Math.round(absentCount * 0.5);
    aye += a;
    nay += n;
    abstain += Math.max(0, ab);
    absent += Math.round(absentCount * 0.0);
  }

  void world;
  return { aye: Math.min(aye, seats), nay: Math.min(nay, seats), abstain: Math.min(abstain, seats), absent };
}

function publicOpinionFor(c: Country, bill: Bill): number {
  // Public opinion is driven by material self-interest first and ideology second.
  const cost = bill.cost / Math.max(1, c.economy.gdp);
  let base = 52 + (c.economy.labour.satisfaction - 0.5) * 40 + c.economy.labour.unemployment * -60;
  const sponsor = c.parties.find((p) => p.id === bill.sponsorPartyId);
  if (sponsor) base += (sponsor.popularity - 30) * 0.24;
  if (bill.effects.labour?.unemployment) base -= bill.effects.labour.unemployment * 400;
  if (bill.effects.labour?.medianWage) base += bill.effects.labour.medianWage * 1e-9;
  base -= cost * 900;
  base += (bill.effects.approval ?? 0) * 0.8;
  return clamp(base, 2, 98);
}

function applyBill(c: Country, bill: Bill): void {
  const fx = bill.effects;
  if (fx.fiscal) Object.assign(c.economy.fiscal, fx.fiscal);
  if (fx.economy) {
    c.economy.corruption = clamp01(c.economy.corruption + (fx.economy.corruption ?? 0));
    c.economy.inequality = clamp01(c.economy.inequality + (fx.economy.inequality ?? 0));
    c.economy.rd = Math.max(0, c.economy.rd + (fx.economy.rd ?? 0));
    c.economy.netForeignAssets += fx.economy.netForeignAssets ?? 0;
    c.economy.reserves += fx.economy.reserves ?? 0;
  }
  if (fx.labour) {
    if (fx.labour.unemployment !== undefined) c.economy.labour.unemployment = clamp01(c.economy.labour.unemployment + fx.labour.unemployment);
    if (fx.labour.unionisation !== undefined) c.economy.labour.unionisation = clamp01(c.economy.labour.unionisation + fx.labour.unionisation);
    if (fx.labour.medianWage !== undefined) c.economy.labour.medianWage = Math.max(100, c.economy.labour.medianWage + fx.labour.medianWage);
  }
  if (fx.sectorGrowth) {
    for (const s of c.economy.sectors) {
      const d = fx.sectorGrowth[s.id];
      if (d) s.growth = clamp(s.growth + d, -0.2, 0.4);
    }
  }
  if (fx.cohesion) {
    for (const p of c.parties) {
      if (fx.cohesion[p.id] !== undefined) p.cohesion = clamp(p.cohesion + fx.cohesion[p.id], 0, 100);
    }
  }
  if (fx.clamp) {
    for (const [path, bounds] of Object.entries(fx.clamp)) {
      if (!bounds) continue;
      const v = path === "inflation" ? c.economy.monetary.inflation
        : path === "unemployment" ? c.economy.labour.unemployment
        : path === "corruption" ? c.economy.corruption
        : path === "inequality" ? c.economy.inequality
        : path === "debtToGdp" ? c.economy.fiscal.debtToGdp
        : NaN;
      if (Number.isFinite(v)) {
        const nv = clamp(v, bounds.min ?? -Infinity, bounds.max ?? Infinity);
        if (path === "inflation") c.economy.monetary.inflation = nv;
        if (path === "unemployment") c.economy.labour.unemployment = nv;
        if (path === "corruption") c.economy.corruption = nv;
        if (path === "inequality") c.economy.inequality = nv;
        if (path === "debtToGdp") c.economy.fiscal.debtToGdp = nv;
      }
    }
  }
  for (const id of Object.keys(c.policies)) {
    const area = id as PolicyArea;
    const lever = fx.sectorGrowth ? Object.entries(fx.sectorGrowth).find(([sid]) => policyToSector(area) === sid)?.[1] : undefined;
    if (lever) c.policies[area] = clamp(c.policies[area] + lever * 400, -100, 100);
  }
}

function findBill(world: World, c: Country, id: string): Bill | null {
  const b = world.bills[id];
  if (!b || b.country !== c.id) return null;
  return b;
}

function policyToSector(area: PolicyArea): string {
  const map: Record<PolicyArea, string> = {
    economy: "manufacturing", tax: "manufacturing", welfare: "healthcare", health: "healthcare",
    education: "education", environment: "agriculture", defence: "defence", immigration: "economy",
    "foreign-policy": "defence", justice: "finance", technology: "technology", housing: "real-estate",
    energy: "energy", transport: "transport", agriculture: "agriculture", labour: "manufacturing",
  };
  return map[area] ?? "economy";
}

// ===========================================================================
// Parties, government, elections
// ===========================================================================

function stepParties(world: World, rnd: Rng, dt: number): void {
  for (const c of Object.values(world.countries)) {
    const satisfaction = c.economy.labour.satisfaction;
    const anger = clamp01(1 - satisfaction);
    for (const p of c.parties) {
      const chamber = c.legislature?.chambers[0];
      const govt = c.executive.coalition.includes(p.id);

      // Cohesion erodes without a leader and recovers with one.
      const leader = p.leaderId ? world.characters[p.leaderId] : undefined;
      const target = leader ? clamp(45 + leader.stats.competence * 0.3 + leader.stats.charisma * 0.2, 20, 95) : 38;
      p.cohesion = approach(p.cohesion, target, 0.02 * (dt / SECONDS_PER_YEAR) * 12 + 0.00002);

      // Popularity is a stock that chases approval, unemployment and scandal.
      const targetPop = clamp(
        (govt ? 34 : 20) + c.executive.approval * 0.35 * (govt ? 1 : -0.7) + anger * 42 * (govt ? -0.6 : 1) + rnd.normal() * 3,
        0.5,
        97,
      );
      p.popularity = approach(p.popularity, targetPop, 0.015 * (dt / SECONDS_PER_YEAR) * 12 + 0.00003);

      // Factions: unpopular governments splinter, popular ones absorb.
      if (govt && p.cohesion < 34 && rnd.chance(0.00004 * world.params.eventRate * (dt / 86400))) {
        c.unrestRisk = Math.min(0.4, c.unrestRisk + 0.01);
        c.executive.confidence = clamp(c.executive.confidence - 8, 0, 100);
      }
      if (chamber) p.treasury = Math.max(0, p.treasury + (p.popularity / 100) * c.economy.gdp * 0.0000016 * (dt / SECONDS_PER_YEAR) * 12);
      p.seats[chamber?.id ?? "chamber-1"] = p.seats[chamber?.id ?? "chamber-1"] ?? 0;
    }

    // Coalition arithmetic: a government that cannot command a majority is on
    // probation, and if it cannot find a partner it falls.
    const money = c.legislature?.chambers.find((ch) => ch.moneyBills) ?? c.legislature?.chambers[0];
    if (money) {
      const total = Object.values(c.parties).reduce((a, p) => a + (p.seats[money.id] ?? 0), 0) || 1;
      const govSeats = c.parties.reduce((a, p) => a + (c.executive.coalition.includes(p.id) ? p.seats[money.id] ?? 0 : 0), 0);
      c.executive.confidence = approach(c.executive.confidence, clamp((govSeats / total) * 100, 0, 100), 0.02 * (dt / SECONDS_PER_YEAR) * 12 + 0.00004);
      c.executive.approval = approach(
        c.executive.approval,
        clamp(18 + c.executive.confidence * 0.42 + c.economy.gdpGrowth * 700 - c.economy.labour.unemployment * 90 + (1 - c.economy.monetary.inflation) * 30, 0, 100),
        0.02 * (dt / SECONDS_PER_YEAR) * 12 + 0.00005,
      );
    }
  }
}

function stepElections(world: World, rnd: Rng, dt: number): void {
  for (const c of Object.values(world.countries)) {
    const lg = c.legislature;
    if (!lg) continue;

    // Schedule the next election for each chamber if none is pending.
    for (const chamber of lg.chambers) {
      if (chamber.election === "none") continue;
      const pending = c.elections.some((e) => e.chamberId === chamber.id && e.status !== "complete");
      if (pending) continue;
      if (!rnd.chance((dt / SECONDS_PER_YEAR) / (chamber.termDays / 365))) continue;

      const districtCount = clamp(Math.round(Math.log10(Math.max(10, c.economy.population)) * 34), 6, 180);
      const populationWeights: number[] = [];
      for (let i = 0; i < districtCount; i++) populationWeights.push(1 / districtCount);
      const scheduled: Election = {
        id: `elec-${c.id}-${chamber.id}-${Math.round(world.t)}`,
        country: c.id,
        chamberId: chamber.id,
        kind: chamber.election,
        office: "chamber",
        scheduledAt: world.t,
        endsAt: world.t + 40 * 86400,
        status: "campaign",
        votes: {},
        turnout: {},
        districtCount,
        districtPopulations: populationWeights,
        projection: {},
        enthusiasm: clamp(40 + rnd.normal() * 15 + c.economy.labour.unemployment * 60, 10, 98),
        districtNames: Array.from({ length: districtCount }, (_, i) => `${c.name} ${chamber.name} District ${i + 1}`),
        candidates: [],
      };
      c.elections.push(scheduled);
      ensureCandidates(world, c, scheduled);
    }

    for (const el of c.elections) {
      if (el.status === "complete") continue;
      const chamber = lg.chambers.find((ch) => ch.id === el.chamberId);
      if (!chamber) continue;
      if ((el.office ?? "chamber") === "chamber") ensureCandidates(world, c, el);

      // Turnout responds to enthusiasm, anger, and how bad things are.
      const turnout = clamp01((el.enthusiasm / 100) * (0.55 + (1 - c.economy.labour.unemployment) * 0.5) * (0.8 + c.executive.approval / 400));

      // Count a slice of the districts per tick.
      const perTick = clamp(Math.ceil(el.districtCount / 22), 1, el.districtCount);
      for (let n = 0; n < perTick; n++) {
        const d = Math.floor(rnd.next() * el.districtCount);
        if (el.votes[String(d)] !== undefined) continue;
        const votes: Record<string, number> = {};
        for (const p of c.parties) {
          const base = Math.max(0.01, p.popularity);
          votes[p.id] = base * Math.exp(rnd.normal() * 0.32);
        }
        el.votes[String(d)] = votes;
        el.turnout[String(d)] = clamp01(turnout * rnd.float(0.7, 1.05));
      }

      const counted = Object.keys(el.votes).length;
      const projection: Record<string, number> = {};
      for (const p of c.parties) projection[p.id] = 0;

      const ssmToSmd = chamber.election === "single-member-transferable";
      const useDistrict = ssmToSmd || chamber.districtSeats > 0;

      if (useDistrict) {
        for (const votes of Object.values(el.votes)) {
          const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
          if (!sorted.length) continue;
          // A district threshold can exclude minor parties, producing tactical voting.
          const total = sorted.reduce((a, [, v]) => a + v, 0);
          const valid = chamber.districtThreshold > 0 ? sorted.filter(([, v]) => v / total >= chamber.districtThreshold) : sorted;
          const winner = (valid[0] ?? sorted[0])[0];
          projection[winner] = (projection[winner] ?? 0) + 1;
        }
        if (chamber.prSeats > 0) {
          // Top-up list seats by national vote share.
          const nationalTotals: Record<string, number> = {};
          let grand = 0;
          for (const votes of Object.values(el.votes)) {
            for (const [pid, v] of Object.entries(votes)) {
              nationalTotals[pid] = (nationalTotals[pid] ?? 0) + v;
              grand += v;
            }
          }
          const awarded: Record<string, number> = {};
          for (const [pid, v] of Object.entries(nationalTotals)) awarded[pid] = Math.round((v / grand) * chamber.prSeats);
          for (const [pid, n] of Object.entries(awarded)) projection[pid] = (projection[pid] ?? 0) + n;
        }
      } else {
        // Pure proportional: convert votes directly.
        const totals: Record<string, number> = {};
        let grand = 0;
        for (const votes of Object.values(el.votes)) {
          for (const [pid, v] of Object.entries(votes)) {
            totals[pid] = (totals[pid] ?? 0) + v;
            grand += v;
          }
        }
        let assigned = 0;
        const ordered = Object.entries(totals).sort((a, b) => b[1] - a[1]);
        ordered.forEach(([pid, v], i) => {
          const n = i === ordered.length - 1 ? chamber.seats - assigned : Math.round((v / grand) * chamber.seats);
          projection[pid] = n;
          assigned += n;
        });
      }

      el.projection = projection;
      if (counted >= el.districtCount || world.t > el.endsAt) {
        finaliseElection(world, c, el, chamber.id, projection, rnd);
      }
    }
  }
}

function finaliseElection(world: World, c: Country, el: Election, chamberId: string, seats: Record<string, number>, rnd: Rng): void {
  const lg = c.legislature;
  if (!lg) return;
  // Chaos parameter: recounts, judicial challenges, disproportionality shocks.
  const chaos = world.params.electionChaos;
  const adjusted: Record<string, number> = {};
  for (const [pid, n] of Object.entries(seats)) {
    adjusted[pid] = Math.max(0, Math.round(n * (1 + rnd.normal() * chaos * 0.25)));
  }

  // A well-run player campaign pulls real seats across the line rather than
  // leaving the result entirely to the party's national vote.
  for (const cand of el.candidates ?? []) {
    if (!cand.isPlayer || !cand.partyId) continue;
    const bonus = clamp(Math.round((cand.support - 14) / 17), 0, 5);
    if (bonus > 0) adjusted[cand.partyId] = (adjusted[cand.partyId] ?? 0) + bonus;
  }

  const total = Object.values(adjusted).reduce((a, b) => a + b, 0);
  adjusted[lg.chambers.find((ch) => ch.id === chamberId)?.id ?? "chamber-1"] = 0;
  const diff = lg.chambers.find((ch) => ch.id === chamberId)?.seats ?? total;
  const sorted = Object.entries(adjusted).sort((a, b) => b[1] - a[1]);
  if (sorted[0]) adjusted[sorted[0][0]] += diff - total;

  for (const p of c.parties) p.seats[chamberId] = adjusted[p.id] ?? 0;

  // Rebuild the government from the new arithmetic.
  const totalSeats = lg.chambers.find((ch) => ch.id === chamberId)?.seats ?? 1;
  const ordered = [...c.parties].sort((a, b) => (b.seats[chamberId] ?? 0) - (a.seats[chamberId] ?? 0));
  const coalition: string[] = [];
  let seatsInCoalition = 0;
  for (const p of ordered) {
    if (coalition.length === 0) {
      coalition.push(p.id);
      seatsInCoalition += p.seats[chamberId] ?? 0;
    } else if (seatsInCoalition < totalSeats / 2) {
      coalition.push(p.id);
      seatsInCoalition += p.seats[chamberId] ?? 0;
    }
  }
  c.executive.coalition = coalition;
  for (const p of c.parties) p.status = coalition.includes(p.id) ? "government" : "outside";
  if (ordered[0] && ordered[0].seats[chamberId]) {
    ordered[0].status = "government";
    c.executive.approval = clamp(c.executive.approval - 8, 0, 100);
  }

  const record = c.elections.find((e) => e.id === el.id);
  if (record) record.status = "complete";
  el.status = "complete";
  applyCandidateResults(world, c, el, chamberId, rnd);

  const winnerName = ordered[0]?.name ?? "no one";
  pushEvent(world, {
    kind: "political",
    severity: "major",
    country: c.id,
    title: `${c.name}: ${winnerName} wins the ${lg.chambers.find((ch) => ch.id === chamberId)?.name ?? "chamber"}`,
    body: `Final seats: ${Object.entries(adjusted).filter(([, n]) => n > 0).map(([pid, n]) => `${world.parties[pid]?.abbreviation ?? pid} ${n}`).join(", ")}.`,
    tags: ["election"],
  });

  // Coalition partners give the government a confidence bonus.
  c.executive.confidence = clamp(c.executive.confidence + (coalition.length > 1 ? 12 : -4), 0, 100);
}

// ===========================================================================
// Courts, referendums, unrest
// ===========================================================================

function stepCourtsAndRest(world: World, rnd: Rng, dt: number): void {
  for (const c of Object.values(world.countries)) {
    // Unrest: a lottery whose odds are the visible failures of the state.
    const failure =
      c.economy.labour.unemployment * 2.4 +
      c.economy.monetary.inflation * 1.6 +
      c.economy.corruption * 1.2 +
      (1 - c.cohesion / 100) * 0.8 +
      (1 - c.economy.labour.satisfaction) * 1.4 +
      Math.max(0, 0.6 - c.economy.fiscal.budgetBalanceRatio) * 0.9;
    c.unrestRisk = clamp01(0.006 + failure * 0.012);

    for (const u of c.unrest) {
      u.intensity = clamp(u.intensity + (1 - u.intensity * 0.02) * rnd.normal() * 0.1 * (dt / 86400) - 0.0006 * (dt / 86400), 0, 100);
      if (u.intensity <= 1) {
        u.endedAt = world.t;
      }
      u.fatalities += rnd.chance(0.02 * u.intensity / 100) ? Math.round(rnd.float(1, 30)) : 0;
    }
    c.unrest = c.unrest.filter((u) => !u.endedAt || world.t - u.endedAt < SECONDS_PER_YEAR * 0.05);

    if (rnd.chance(c.unrestRisk * 0.0016 * world.params.eventRate * (dt / 86400) * 60)) {
      const kind = pickUnrest(rnd, failure);
      c.unrest.push({ id: `unrest-${c.id}-${world.events.length}`, kind, intensity: rnd.float(15, 65), startedAt: world.t, fatalities: 0 });
      pushEvent(world, {
        kind: "social",
        severity: kind === "coup" || kind === "rebellion" ? "catastrophic" : kind === "terror-attack" ? "catastrophic" : "major",
        country: c.id,
        title: `${c.name}: ${UNREST_LABEL[kind]}`,
        body: unrestBody(kind, c),
        tags: ["unrest", kind],
      });
      if (kind === "coup" && rnd.chance(0.45)) {
        c.government = "military-junta";
        c.executive.approval = clamp(c.executive.approval - 30, 0, 100);
        for (const p of c.parties) p.status = "outside";
        c.executive.coalition = [];
      }
    }

    // Referendums close on schedule.
    for (const r of c.referendums) {
      if (r.status === "open" && world.t > r.closesAt) {
        const yesChance = clamp01(0.3 + (c.executive.approval - 45) / 140);
        const pass = rnd.chance(yesChance);
        r.status = pass ? "passed" : "rejected";
        pushEvent(world, {
          kind: "political",
          severity: "major",
          country: c.id,
          title: `${c.name}: referendum ${pass ? "carries" : "fails"}`,
          body: `${r.question} -- ${pass ? "approved" : "rejected"} on ${(r.turnout * 100).toFixed(1)}% turnout.`,
          tags: ["referendum"],
        });
        if (pass) c.executive.approval = clamp(c.executive.approval + 6, 0, 100);
        else c.executive.approval = clamp(c.executive.approval - 4, 0, 100);
      }
    }
    c.referendums = c.referendums.filter((r) => !r.status || r.status === "scheduled" || world.t - r.at < SECONDS_PER_YEAR * 2);
  }
}

const UNREST_LABEL: Record<string, string> = {
  protest: "mass protest",
  riot: "rioting",
  strike: "general strike",
  rebellion: "armed rebellion",
  coup: "coup d'etat",
  "terror-attack": "terrorist attack",
  separatism: "separatist rising",
  famine: "famine",
  pandemic: "epidemic",
  blackout: "national blackout",
  "hyperinflation-spirit": "run on the currency",
};

function unrestBody(kind: string, c: { name: string; economy: { labour: { unemployment: number }; monetary: { inflation: number } } }): string {
  switch (kind) {
    case "strike": return `Unemployment at ${(c.economy.labour.unemployment * 100).toFixed(1)}% has pushed unions into a general stoppage.`;
    case "riot": return "Food and fuel queues have turned violent across several cities.";
    case "famine": return `A crop failure and ${(c.economy.labour.unemployment * 100).toFixed(0)}% unemployment have combined into a food emergency.`;
    case "hyperinflation-spirit": return `With inflation at ${(c.economy.monetary.inflation * 100).toFixed(0)}%, households are withdrawing savings and exchanging currency for goods.`;
    case "coup": return "The armed forces have moved against the government.";
    default: return "Public order has broken down and the government is struggling to respond.";
  }
}

function pickUnrest(rnd: Rng, failure: number): "protest" | "riot" | "strike" | "rebellion" | "coup" | "terror-attack" | "separatism" | "famine" | "pandemic" | "blackout" | "hyperinflation-spirit" {
  if (failure > 2.2) return rnd.weighted(["coup", "rebellion", "riot", "strike"] as const, (k) => (k === "coup" ? 1 : k === "strike" ? 3 : 2));
  if (failure > 1.4) return rnd.weighted(["strike", "riot", "protest", "separatism"] as const, (k) => (k === "strike" ? 3 : 2));
  return rnd.weighted(["protest", "blackout", "pandemic", "terror-attack", "separatism"] as const, () => 1);
}

export function stepPolitics(world: World, rnd: Rng, dt: number): void {
  stepParties(world, rnd, dt);
  stepBills(world, rnd, dt);
  stepElections(world, rnd, dt);
  stepPlayerPolitics(world, rnd);
  stepCourtsAndRest(world, rnd, dt);
}

export { } ;
export type { BillVote };