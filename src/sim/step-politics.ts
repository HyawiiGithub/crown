import type { Bill, Character, Country, PolicyPatch, Region, SectorId, World } from "../shared/types";
import { isDemocratic, pushEvent, rulesByDecree } from "./bootstrap";
import { Rng, approach, clamp, clamp01 } from "./rng";
import { SECONDS_PER_YEAR } from "./step-economy";

/**
 * Politics, stepped once per simulated week.
 *
 * Approval follows what households actually feel: real incomes, jobs and prices.
 * Democracies vote on a real calendar, governments form from the seat arithmetic,
 * and losing power means a new leader. Autocracies hold on until they cannot.
 */

const WEEK = 7 * 86400;

// Successors are fictional, since history diverges the moment play starts. Names
// come from the region so a future French premier is not called Mikhail Ashford.
const NAME_POOL: Record<Region, { first: string[]; last: string[] }> = {
  europe: { first: "Anna Marco Elena Jan Sofia Lukas Clara Pierre Ingrid Tomas Maria Henrik Lucia Pavel Claire Stefan".split(" "), last: "Novak Keller Moreau Rossi Lindqvist Kowalski Berg Dubois Weber Costa Hansen Fischer Laurent Marin Vogel Popescu".split(" ") },
  americas: { first: "Maria Carlos John Ana Luis Sarah Diego Laura Miguel James Camila Robert Elena Daniel Isabel Andres".split(" "), last: "Silva Garcia Johnson Rodriguez Martinez Santos Walker Herrera Campbell Torres Morales Clarke Vargas Reyes Mendes Ortega".split(" ") },
  asia: { first: "Wei Mei Hiro Yuki Arjun Priya Min Linh Budi Siti Ravi Ananya Jun Hana Tuan Dewi".split(" "), last: "Chen Tanaka Sharma Nguyen Kim Wang Singh Sato Lee Rao Liu Park Suzuki Tran Patel Lin".split(" ") },
  "middle-east": { first: "Omar Layla Hassan Fatima Yusuf Amira Karim Noor Tariq Zainab Samir Dalia Ali Rania Faisal Mona".split(" "), last: "Haddad Rahman Al-Sayed Khalil Nasser Aziz Farah Mansour Saleh Darwish Hamdan Karimi Yilmaz Demir Rashid Amin".split(" ") },
  africa: { first: "Amina Kwame Fatou Emeka Zanele Moussa Aisha Thabo Grace Ibrahim Wanjiru Samuel Nia Abdou Thandi Joseph".split(" "), last: "Okafor Diallo Mensah Ndlovu Kamau Traore Osei Abebe Sow Banda Keita Mwangi Toure Nkosi Adeyemi Moyo".split(" ") },
  oceania: { first: "Jack Olivia Tama Mere Liam Grace Sione Emma Noah Ana Ethan Lani Finn Ruby Kai Tui".split(" "), last: "Smith Taylor Tui Wilson Brown Fonua Walker Ngata Campbell Tamati Young Thompson Vaka Reid Clark Hale".split(" ") },
};

function newLeaderName(c: Country, rnd: Rng): string {
  const pool = NAME_POOL[c.region] ?? NAME_POOL.europe;
  return `${rnd.pick(pool.first)} ${rnd.pick(pool.last)}`;
}

function newLeader(world: World, c: Country, partyId: string | undefined, rnd: Rng): Character {
  const id = `ch-${c.id}-gen-${world.dayCount}-${Math.round(rnd.next() * 1e6)}`;
  const party = c.parties.find((p) => p.id === partyId);
  const ch: Character = {
    id,
    name: newLeaderName(c, rnd),
    country: c.id,
    role: "head-of-government",
    partyId,
    stats: {
      competence: Math.round(rnd.normal() * 20 + 22),
      charisma: Math.round(rnd.normal() * 22 + 18),
      integrity: Math.round(rnd.normal() * 28),
      ambition: Math.round(rnd.normal() * 22 + 30),
      ideology: Math.round(clamp((party?.ideology ?? c.ideology) + rnd.normal() * 8, -100, 100)),
      popularity: Math.round(clamp(rnd.normal() * 16 + 52, 0, 100)),
      experience: Math.round(clamp(rnd.normal() * 18 + 55, 0, 100)),
      militancy: Math.round(rnd.normal() * 22),
    },
    createdAt: world.t,
  };
  world.characters[id] = ch;
  return ch;
}

// ===========================================================================
// Legislation
// ===========================================================================

export function ensureRoster(): void {
  // Individual legislators are not simulated; every seat is counted by party.
}

export function introduceBill(world: World, countryId: string, draft: Omit<Bill, "id" | "country" | "votes" | "tallies" | "introducedAt" | "expiresAt" | "status">, byUserId?: string): Bill | null {
  const c = world.countries[countryId];
  if (!c?.legislature) return null;
  const id = `bill-${c.id}-${world.dayCount}-${Object.keys(world.bills).length}`;
  const bill: Bill = { ...draft, id, country: countryId, status: "introduced", votes: [], tallies: {}, introducedAt: world.t, expiresAt: world.t + 45 * 86400 };
  c.legislature.activeBills.push(id);
  world.bills[id] = bill;
  pushEvent(world, { kind: "political", severity: "info", country: countryId, title: `${c.name}: ${bill.title} introduced`, body: bill.summary, byUserId, tags: ["legislation"] });
  return bill;
}

/** How an MP group votes depends on loyalty to the government, ideology and the bill's popularity. */
function partySupport(c: Country, bill: Bill, partyIdeology: number, inGovernment: boolean, cohesion: number): number {
  const leftness = billLeanings(bill.policy);
  const fit = 1 - Math.min(1, Math.abs(partyIdeology - leftness) / 110);
  const opinion = (bill.publicOpinion - 50) / 200;
  if (inGovernment) return clamp(0.72 + (cohesion / 100) * bill.whipStrength * 0.26 + (fit - 0.5) * 0.3 + opinion, 0.2, 1);
  return clamp(0.05 + fit * 0.3 + opinion - (cohesion / 100) * 0.1 + (c.executive.approval - 50) / 400, 0, 0.75);
}

/** Where a policy package sits politically: tax-and-spend scores left, cuts score right. */
function billLeanings(p?: PolicyPatch): number {
  if (!p) return 0;
  let score = 0;
  if (p.tax?.income !== undefined) score += 0;
  if (p.minimumWage !== undefined) score -= 15;
  if (p.budget?.welfare !== undefined) score -= 10;
  if (p.budget?.defence !== undefined) score += 12;
  if (p.sector?.regulation !== undefined) score -= 8;
  if (p.sector?.stateOwnership !== undefined) score -= 20;
  return clamp(score, -60, 60);
}

function stepBills(world: World, rnd: Rng): void {
  for (const billId of Object.keys(world.bills)) {
    const bill = world.bills[billId];
    if (bill.status === "enacted" || bill.status === "rejected" || bill.status === "expired") continue;
    const c = world.countries[bill.country];
    if (!c?.legislature) {
      bill.status = "expired";
      continue;
    }
    const days = (world.t - bill.introducedAt) / 86400;
    if (days < 21) {
      bill.status = days < 7 ? "introduced" : "in-committee";
      continue;
    }
    const chamber = c.legislature.chambers.find((x) => x.id === bill.chamberId) ?? c.legislature.chambers[0];
    let aye = 0;
    let nay = 0;
    let abstain = 0;
    for (const p of c.parties) {
      const seats = p.seats[chamber.id] ?? 0;
      if (!seats) continue;
      const support = clamp01(partySupport(c, bill, p.ideology, c.executive.coalition.includes(p.id), p.cohesion) + rnd.normal() * 0.05);
      const a = Math.round(seats * support);
      const ab = Math.round((seats - a) * 0.08);
      aye += a;
      abstain += ab;
      nay += seats - a - ab;
    }
    bill.tallies[chamber.id] = { aye, nay, abstain, absent: 0 };
    c.legislature.activeBills = c.legislature.activeBills.filter((x) => x !== bill.id);
    if (aye > nay) {
      bill.status = "enacted";
      bill.enactedAt = world.t;
      if (bill.policy) applyPolicy(c, bill.policy);
      c.executive.approval = clamp(c.executive.approval + (bill.publicOpinion - 50) * 0.08, 0, 100);
      pushEvent(world, { kind: "legal", severity: "notice", country: c.id, title: `${c.name}: ${bill.title} passes ${aye}-${nay}`, body: bill.summary, tags: ["legislation", "enacted"] });
    } else {
      bill.status = "rejected";
      c.executive.confidence = clamp(c.executive.confidence - 6, 0, 100);
      pushEvent(world, { kind: "political", severity: "major", country: c.id, title: `${c.name}: ${bill.title} defeated ${aye}-${nay}`, body: `The ${chamber.name} rejects the government's package.`, tags: ["legislation"] });
    }
  }

  // Keep the bill archive bounded.
  const finished = Object.values(world.bills).filter((b) => b.status === "enacted" || b.status === "rejected" || b.status === "expired");
  if (finished.length > 120) {
    finished.sort((a, b) => a.introducedAt - b.introducedAt);
    for (const b of finished.slice(0, finished.length - 120)) delete world.bills[b.id];
  }
}

export function applyPolicy(c: Country, p: PolicyPatch): void {
  const e = c.economy;
  if (p.tax) Object.assign(e.tax, p.tax);
  if (p.budget) Object.assign(e.budget, p.budget);
  if (p.minimumWage !== undefined) e.macro.minimumWage = clamp(p.minimumWage, 0, 1);
  if (p.centralBankIndependent !== undefined) e.centralBank.independent = p.centralBankIndependent;
  if (p.sector) {
    const s = e.sectors.find((x) => x.id === (p.sector as { id: SectorId }).id);
    if (s) {
      if (p.sector.subsidy !== undefined) s.stateSubsidy = clamp(p.sector.subsidy, 0, 0.5);
      if (p.sector.regulation !== undefined) s.regulation = clamp01(p.sector.regulation);
      if (p.sector.stateOwnership !== undefined) s.stateOwnership = clamp01(p.sector.stateOwnership);
    }
  }
}

/** Whether a change needs the legislature, for the UI and for the command layer. */
export function needsLegislature(c: Country): boolean {
  return !rulesByDecree(c.government) && Boolean(c.legislature) && !c.executive.emergencyPowers;
}

// ===========================================================================
// Approval, parties, elections
// ===========================================================================

function stepApproval(c: Country, rnd: Rng): void {
  const e = c.economy;
  const m = e.macro;
  const dt = WEEK / SECONDS_PER_YEAR;
  const target = clamp(
    46 +
      (e.labour.satisfaction - 0.55) * 70 +
      m.outputGap * 120 -
      Math.max(0, e.labour.unemployment - m.nairu) * 110 -
      Math.max(0, e.monetary.inflation - 0.04) * 70 +
      clamp(e.gdpGrowth, -0.1, 0.1) * 80 -
      e.corruption * 8 -
      (c.wars.length ? 4 : 0) -
      (m.defaulted ? 12 : 0),
    2,
    96,
  );
  // Repression props up authoritarian numbers; they are less honest and less sensitive.
  const blended = isDemocratic(c.government) ? target : clamp(target * 0.5 + 34, 12, 95);
  c.executive.approval = clamp(approach(c.executive.approval, blended, 1.6 * dt) + rnd.normal() * 0.45, 0, 100);
  const stable = 60 - c.unrest.length * 6 + (c.executive.approval - 50) * 0.5;
  c.executive.confidence = approach(c.executive.confidence, clamp(stable, 3, 97), 1.2 * dt);
  c.cohesion = approach(c.cohesion, clamp(70 - e.inequality * 40 + (c.executive.approval - 50) * 0.3, 8, 98), 0.2 * dt);
}

function stepParties(c: Country, rnd: Rng): void {
  const dt = WEEK / SECONDS_PER_YEAR;
  const money = c.legislature?.chambers[0];
  const ruling = c.parties.filter((p) => c.executive.coalition.includes(p.id));
  const opposition = c.parties.filter((p) => !c.executive.coalition.includes(p.id));
  if (!ruling.length || !opposition.length || !isDemocratic(c.government)) return;
  const totalSeats = money ? c.parties.reduce((a, p) => a + (p.seats[money.id] ?? 0), 0) || 1 : 1;
  const rulingBase = ruling.reduce((a, p) => a + (money ? p.seats[money.id] ?? 0 : 1), 0) / (money ? totalSeats : ruling.length);
  // Governments win roughly as many votes as their approval allows.
  const rulingVote = clamp(c.executive.approval * 0.85 + 9, 8, 74);
  for (const p of ruling) {
    const seatShare = money ? (p.seats[money.id] ?? 0) / totalSeats / Math.max(0.05, rulingBase) : 1 / ruling.length;
    p.popularity = approach(p.popularity, rulingVote * seatShare, 2 * dt) + rnd.normal() * 0.2;
  }
  const oppTotal = opposition.reduce((a, p) => a + (money ? p.seats[money.id] ?? 0 : 1), 0) || 1;
  for (const p of opposition) {
    const seatShare = money ? (p.seats[money.id] ?? 0) / oppTotal : 1 / opposition.length;
    const floor = 100 - rulingVote;
    p.popularity = approach(p.popularity, Math.max(0.5, floor * Math.max(0.03, seatShare)), 2 * dt) + rnd.normal() * 0.2;
  }
  for (const p of c.parties) p.popularity = clamp(p.popularity, 0.2, 90);
}

function holdElection(world: World, c: Country, rnd: Rng): void {
  const chamber = c.legislature?.chambers[0];
  c.nextElectionAt = world.t + (c.electionTermDays ?? 1460) * 86400;
  if (!chamber) return;

  const chaos = world.params.electionChaos;
  const raw = c.parties.map((p) => ({ p, vote: Math.max(0.1, p.popularity * Math.exp(rnd.normal() * (0.1 + chaos * 0.6))) }));
  const voteTotal = raw.reduce((a, x) => a + x.vote, 0);
  for (const x of raw) x.vote = (x.vote / voteTotal) * 100;
  // Winner-takes-more: first-past-the-post rewards the largest party.
  const fptp = chamber.election === "fptp";
  const weighted = raw.map((x) => ({ ...x, weight: fptp ? Math.pow(x.vote, 1.25) : x.vote }));
  const weightTotal = weighted.reduce((a, x) => a + x.weight, 0);
  let assigned = 0;
  const seats = weighted.map((x) => {
    const n = Math.floor((x.weight / weightTotal) * chamber.seats);
    assigned += n;
    return { p: x.p, n, vote: x.vote, rem: (x.weight / weightTotal) * chamber.seats - n };
  });
  seats.sort((a, b) => b.rem - a.rem);
  for (let i = 0; assigned < chamber.seats; i++, assigned++) seats[i % seats.length].n++;
  for (const s of seats) {
    s.p.seats[chamber.id] = s.n;
    s.p.popularity = s.vote;
  }

  // Form a government: the largest party plus its nearest ideological partners.
  const ordered = [...seats].sort((a, b) => b.n - a.n);
  const lead = ordered[0];
  const coalition = [lead.p.id];
  let held = lead.n;
  const partners = ordered.slice(1).sort((a, b) => Math.abs(a.p.ideology - lead.p.ideology) - Math.abs(b.p.ideology - lead.p.ideology));
  for (const s of partners) {
    if (held > chamber.seats / 2) break;
    coalition.push(s.p.id);
    held += s.n;
  }
  const summary = ordered.filter((s) => s.n > 0).slice(0, 5).map((s) => `${s.p.abbreviation} ${s.n}`).join(", ");
  const notable = isNotable(world, c);

  // A directly elected president is not removed by a legislative election: the
  // government simply loses or gains its majority.
  if (c.nextPresidentialAt !== undefined) {
    if (notable) pushEvent(world, { kind: "political", severity: "notice", country: c.id, title: `${c.name}: legislative elections`, body: `The ${chamber.name} is now ${summary}.`, tags: ["election"] });
    return;
  }

  const wasGoverning = c.executive.coalition.includes(lead.p.id);
  const previousLeadParty = c.executive.coalition[0];
  c.executive.coalition = coalition;
  for (const p of c.parties) p.status = coalition.includes(p.id) ? "government" : "outside";

  if (previousLeadParty !== lead.p.id) {
    const leader = installLeader(world, c, lead.p.id, rnd);
    if (notable) pushEvent(world, { kind: "political", severity: "major", country: c.id, title: `${c.name}: ${leader.name} wins power for ${lead.p.name}`, body: `The ${chamber.name} is now ${summary}.`, tags: ["election"] });
  } else if (notable) {
    pushEvent(world, { kind: "political", severity: "major", country: c.id, title: `${c.name}: ${lead.p.name} ${wasGoverning ? "holds on" : "wins"} at the election`, body: `The ${chamber.name} is now ${summary}.`, tags: ["election"] });
  }
}

function isNotable(world: World, c: Country): boolean {
  return c.id === world.playerCountry || c.economy.gdp / Math.max(1, world.globals.globalGdp) > 0.006;
}

function installLeader(world: World, c: Country, partyId: string, rnd: Rng): Character {
  const party = c.parties.find((p) => p.id === partyId);
  const existing = party?.leaderId ? world.characters[party.leaderId] : undefined;
  const leader = existing && !existing.removedAt ? existing : newLeader(world, c, partyId, rnd);
  if (party) party.leaderId = leader.id;
  const presidentRuns = c.nextPresidentialAt !== undefined || c.executive.headOfGovernmentId === c.executive.headOfStateId;
  c.executive.headOfGovernmentId = leader.id;
  if (presidentRuns) c.executive.headOfStateId = leader.id;
  c.ideology = clamp(approach(c.ideology, party?.ideology ?? c.ideology, 0.6), -100, 100);
  c.executive.approval = clamp(52 + rnd.normal() * 4, 0, 100);
  return leader;
}

/** A head-to-head vote for the presidency, decided by approval. */
function holdPresidentialElection(world: World, c: Country, rnd: Rng): void {
  c.nextPresidentialAt = world.t + 4 * 365 * 86400;
  const incumbentParty = c.parties.find((p) => c.executive.coalition.includes(p.id));
  const challenger = [...c.parties].filter((p) => !c.executive.coalition.includes(p.id)).sort((a, b) => b.popularity - a.popularity)[0];
  if (!incumbentParty || !challenger) return;
  const vote = clamp(c.executive.approval * 0.8 + 11 + rnd.normal() * (2 + world.params.electionChaos * 15), 15, 85);
  const current = c.executive.headOfStateId ? world.characters[c.executive.headOfStateId] : undefined;
  const notable = isNotable(world, c);
  if (vote >= 50) {
    if (notable) pushEvent(world, { kind: "political", severity: "major", country: c.id, title: `${c.name}: ${current?.name ?? "the president"} is re-elected`, body: `${incumbentParty.name} holds the presidency with ${vote.toFixed(1)}% of the vote.`, tags: ["election"] });
    return;
  }
  c.executive.coalition = [challenger.id];
  for (const p of c.parties) p.status = p.id === challenger.id ? "government" : "outside";
  challenger.leaderId = undefined;
  const leader = installLeader(world, c, challenger.id, rnd);
  if (notable) pushEvent(world, { kind: "political", severity: "major", country: c.id, title: `${c.name}: ${leader.name} wins the presidency`, body: `${challenger.name} defeats ${current?.name ?? "the incumbent"}, taking ${(100 - vote).toFixed(1)}% of the vote.`, tags: ["election"] });
}

function stepUnrest(world: World, c: Country, rnd: Rng): void {
  const e = c.economy;
  const dt = WEEK / SECONDS_PER_YEAR;
  const failure = clamp01((55 - c.executive.approval) / 55) * 0.5 + e.labour.unemployment * 1.2 + Math.min(1, Math.max(0, e.monetary.inflation - 0.1)) * 0.7 + e.labour.strikeRisk * 0.5 + (1 - c.cohesion / 100) * 0.25;
  c.unrestRisk = clamp01(0.005 + failure * 0.1);

  for (const u of c.unrest) {
    u.intensity = clamp(u.intensity + (failure - 0.45) * 40 * dt + rnd.normal() * 2, 0, 100);
    if (u.intensity < 5) u.endedAt = world.t;
    if (rnd.chance(u.intensity * 0.002)) u.fatalities += Math.round(rnd.float(1, u.intensity));
  }
  c.unrest = c.unrest.filter((u) => !u.endedAt || world.t - u.endedAt < 60 * 86400);

  if (rnd.chance(c.unrestRisk * dt * 2.2 * world.params.eventRate) && c.unrest.filter((u) => !u.endedAt).length < 3) {
    const severe = failure > 0.75;
    const kind = severe
      ? rnd.weighted(["riot", "strike", "rebellion", "coup"] as const, (k) => (k === "coup" ? (isDemocratic(c.government) ? 0.2 : 1.2) : k === "rebellion" ? 1 : 2.5))
      : rnd.weighted(["protest", "strike", "riot"] as const, (k) => (k === "protest" ? 4 : 2));
    c.unrest.push({ id: `unrest-${c.id}-${world.dayCount}`, kind, intensity: rnd.float(15, 55), startedAt: world.t, fatalities: 0 });
    const label: Record<string, string> = { protest: "mass protests", riot: "rioting", strike: "a general strike", rebellion: "armed rebellion", coup: "an attempted coup" };
    const majorState = e.gdp / Math.max(1, world.globals.globalGdp) > 0.003 || c.id === world.playerCountry;
    if (majorState || kind === "coup" || kind === "rebellion") {
      pushEvent(world, { kind: "social", severity: kind === "coup" || kind === "rebellion" ? "catastrophic" : "major", country: c.id, title: `${c.name}: ${label[kind]}`, body: unrestBody(kind, c), tags: ["unrest", kind] });
    }
    e.macro.shock -= kind === "coup" ? 0.02 : kind === "rebellion" ? 0.02 : 0.004;
    if (kind === "coup" && rnd.chance(0.35 + (50 - c.executive.approval) * 0.008)) successfulCoup(world, c, rnd);
  }
}

function successfulCoup(world: World, c: Country, rnd: Rng): void {
  const general = newLeader(world, c, undefined, rnd);
  general.role = "head-of-state";
  const old = c.executive.headOfStateId ? world.characters[c.executive.headOfStateId] : undefined;
  if (old) old.removedAt = world.t;
  c.nextPresidentialAt = undefined;
  c.executive.headOfStateId = general.id;
  c.executive.headOfGovernmentId = general.id;
  c.executive.headOfStateTitle = "Head of the Junta";
  c.headOfStateTitle = "Head of the Junta";
  c.government = "military-junta";
  c.executive.coalition = [];
  c.executive.approval = clamp(c.executive.approval + 10, 0, 100);
  c.nextElectionAt = undefined;
  pushEvent(world, { kind: "political", severity: "catastrophic", country: c.id, title: `Coup in ${c.name}`, body: `General ${general.name} has seized power${old ? ` from ${old.name}` : ""}. Parliament is suspended.`, tags: ["unrest", "coup"] });
}

function unrestBody(kind: string, c: Country): string {
  const e = c.economy;
  switch (kind) {
    case "strike": return `Unions walk out with wages lagging prices and unemployment at ${(e.labour.unemployment * 100).toFixed(1)}%.`;
    case "riot": return `Anger at inflation of ${(e.monetary.inflation * 100).toFixed(1)}% has turned violent in the cities.`;
    case "coup": return "Units of the armed forces have moved against the government.";
    case "rebellion": return "Armed groups have taken control of outlying districts.";
    default: return `Crowds are out against a government with ${c.executive.approval.toFixed(0)}% approval.`;
  }
}

export function stepPolitics(world: World, rnd: Rng): void {
  stepBills(world, rnd);
  for (const c of Object.values(world.countries)) {
    if (c.annexedBy) continue;
    stepApproval(c, rnd);
    if (c.overlord) continue;
    stepParties(c, rnd);
    if (c.nextElectionAt !== undefined && world.t >= c.nextElectionAt && isDemocratic(c.government)) holdElection(world, c, rnd);
    if (c.nextPresidentialAt !== undefined && world.t >= c.nextPresidentialAt && isDemocratic(c.government)) holdPresidentialElection(world, c, rnd);
    stepUnrest(world, c, rnd);
  }
}
