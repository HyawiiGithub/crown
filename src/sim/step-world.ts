import type { Country, Sanction, Treaty, War, World } from "../shared/types";
import { pushEvent } from "./bootstrap";
import { frontOccupation } from "./occupation";
import { Rng, approach, clamp, clamp01 } from "./rng";
import { SECONDS_PER_YEAR } from "./step-economy";

/**
 * Diplomacy, war, sanctions and annexation.
 *
 * Relations are an emergent property rather than a stored opinion: they drift
 * toward what the two states are actually doing to each other, and they decay
 * toward a baseline set by bloc and geography. That means a war endangers the
 * whole relationship afterwards, which is the part players notice.
 */

export function stepDiplomacy(world: World, rnd: Rng, dt: number): void {
  const ids = Object.keys(world.countries).filter((id) => !world.countries[id].overlord && !world.countries[id].annexedBy);
  const warSet = new Set<string>();
  for (const w of Object.values(world.wars)) {
    if (w.endedAt) continue;
    for (const b of Object.keys(w.belligerents)) for (const a of Object.keys(w.belligerents)) if (a !== b) warSet.add(`${a}|${b}`);
  }

  for (const a of ids) {
    const ca = world.countries[a];
    // Only drift toward the strongest handful of relationships each tick, both
    // for correctness and because touching 197^2 pairs every two seconds is
    // more work than it is worth.
    const neighbours = [...ca.economy.trade.exportPartners, ...ca.alliances].slice(0, 24).map((b) => ({ b }));

    for (const { b } of neighbours) {
      if (b === a || !world.countries[b]) continue;
      const cb = world.countries[b];
      let drift = 0;

      // Allies and enemies are sticky.
      if (ca.alliances.includes(b)) drift += 0.5;
      if (warSet.has(`${a}|${b}`)) drift -= 4;
      if (ca.bloc === cb.bloc) drift += 0.4;
      if (ca.bloc !== cb.bloc && ca.bloc !== "none" && cb.bloc !== "none") drift -= 0.15;

      // Trade pulls towards, embargo pushes away.
      const flow = ca.economy.trade.flows[b] ?? 0;
      if (flow > 0) drift += clamp(flow / Math.max(1, ca.economy.trade.exports) * 2.2, 0, 1.4);
      if (cb.sanctions.some((id) => world.sanctions[id]?.imposedBy.includes(a))) drift -= 2.4;

      // Ideology and power.
      drift -= (Math.abs(ca.ideology - cb.ideology) / 100) * 0.16;
      const ratio = cb.economy.gdp / Math.max(1, ca.economy.gdp);
      if (ratio > 60) drift -= 0.3;
      if (ratio < 0.02) drift += 0.2;

      // Creeping memory.
      drift += rnd.normal() * 0.08;

      ca.relations[b] = clamp((ca.relations[b] ?? 0) + drift * (dt / SECONDS_PER_YEAR) * 3, -100, 100);
    }

    // Unilateral embargoes form when relations are bad enough and power aligns.
    if (!ca.overlord && a !== world.playerCountry && rnd.chance(0.0000005 * world.params.eventRate * (dt / 86400) * 60)) {
      const target = Object.entries(ca.relations)
        .filter(([b]) => !ca.alliances.includes(b) && b !== world.playerCountry)
        .sort((x, y) => x[1] - y[1])[0];
      if (target && target[1] < -55) {
        imposeSanction(world, a, target[0], "financial", rnd);
      }
    }

    // Alliance offers to states we like and who do not already have one.
    if (a !== world.playerCountry && !ca.alliances.length && rnd.chance(0.0000005 * world.params.eventRate * (dt / 86400) * 60)) {
      const friend = Object.entries(ca.relations).sort((x, y) => y[1] - x[1])[0];
      if (friend && friend[1] > 70) {
        signTreaty(world, "alliance", [a, friend[0]], ["Mutual defence"], rnd, ca.economy.gdp * 0.002);
      }
    }
  }

  // Treaty drift and expiry.
  for (const t of Object.values(world.treaties)) {
    if (!t.active) continue;
    if (t.expiresAt && world.t > t.expiresAt) {
      t.active = false;
      pushEvent(world, { kind: "diplomatic", severity: "notice", title: `${t.name} has lapsed`, body: "The treaty reached the end of its term without renewal.", actors: t.parties, tags: ["treaty"] });
    }
    for (const p of t.parties) {
      const c = world.countries[p];
      if (!c) continue;
      const others = t.parties.filter((x) => x !== p);
      const avg = others.length ? others.reduce((a, o) => a + (c.relations[o] ?? 0), 0) / others.length : 0;
      t.favourability[p] = approach(t.favourability[p] ?? 0, clamp(avg, -100, 100), 0.01 * (dt / SECONDS_PER_YEAR) * 12 + 0.00004);
      // An alliance whose value has collapsed gets abandoned.
      if ((t.kind === "alliance" || t.kind === "defensive-pact") && (t.favourability[p] ?? 0) < -60 && rnd.chance(0.0002 * (dt / 86400))) {
        exitTreaty(world, t, p);
      }
    }
  }

  // Sanction evasion: pressure decays if the target resists.
  for (const s of Object.values(world.sanctions)) {
    if (world.t > s.until) {
      liftSanction(world, s.id);
      continue;
    }
    s.evasion = clamp01(s.evasion + 0.0008 * (dt / SECONDS_PER_YEAR) * 12 + 0.00001);
  }
}

// ===========================================================================
// War
// ===========================================================================

export function stepWars(world: World, rnd: Rng, dt: number): void {
  for (const war of Object.values(world.wars)) {
    if (war.endedAt) continue;
    const P = world.params;

    // Total war strength per belligerent, including allies.
    const strength: Record<string, number> = {};
    for (const b of Object.keys(war.belligerents)) {
      const c = world.countries[b];
      const allies = war.belligerents[b] ?? [];
      const rebels = war.rebels?.[b];
      if (rebels) {
        strength[b] = rebels.strength + allies.reduce((a, al) => a + (world.countries[al]?.military.activeDuty ?? 0) * 0.2, 0);
        continue;
      }
      if (!c) continue;
      const allyPower = allies.reduce((a, al) => a + (world.countries[al]?.military.activeDuty ?? 0) * (world.countries[al]?.military.readiness ?? 0) / 100, 0);
      // Money per soldier matters as well as numbers, so the defence budget moves the front.
      const perSoldier = c.economy.fiscal.military / Math.max(1, c.military.activeDuty);
      const worldPc = world.globals.globalGdp / Math.max(1, world.globals.globalPopulation);
      const equipment = clamp(Math.pow(perSoldier / Math.max(1e-6, worldPc * 4), 0.25), 0.55, 1.8);
      const own = c.military.activeDuty * (0.4 + c.military.readiness / 100) * (c.military.morale / 100) * equipment;
      strength[b] = own + allyPower * 0.8;
    }

    for (const front of war.fronts) {
      const sides = front.belligerents.map((b) => strength[b] ?? 0);
      const totalStrength = sides.reduce((a, b) => a + b, 0);
      if (totalStrength <= 0) {
        front.control = approach(front.control, 0, 0.01);
        continue;
      }
      const attacker = sides[0] ?? 0;
      const defender = sides[1] ?? 0;

      // Terrain matters more than raw numbers, which is how a small country
      // holds a mountain front against a much larger neighbour.
      const terrainDefence: Record<string, number> = {
        mountain: 2.1, urban: 1.5, "urban-core": 1.4, forest: 1.3, coastal: 1.05, plains: 0.85, desert: 0.95,
      };
      const mult = terrainDefence[front.terrain] ?? 1;
      const ratio = attacker / Math.max(1, defender * mult);

      // Attrition: both sides bleed, faster when the front is hot.
      const intensity = clamp(Math.log2(ratio + 1) / 3, 0, 2);
      const attacking = front.belligerents.some((b) => war.stance?.[b] === "offensive");
      const casualtyRate = P.warDamage * intensity * (dt / 86400) * 0.6 * (attacking ? 1.5 : 1);
      for (const b of front.belligerents) {
        const c = world.countries[b];
        const rebels = war.rebels?.[b];
        if (!c && !rebels) continue;
        const force = c ? c.military.activeDuty + c.military.reserves * 0.1 : rebels!.strength;
        war.casualties[b] = (war.casualties[b] ?? 0) + force * casualtyRate;
        if (c) {
          c.military.morale = clamp(c.military.morale - casualtyRate * 120, 0, 100);
          c.military.readiness = clamp(c.military.readiness - casualtyRate * 90, 0, 100);
          c.military.activeDuty = Math.max(100, c.military.activeDuty - force * casualtyRate * 0.3);
        }
        war.exhaustion[b] = clamp((war.exhaustion[b] ?? 0) + casualtyRate * 90, 0, 100);
        war.publicSupport[b] = clamp((war.publicSupport[b] ?? 50) - casualtyRate * 120, 0, 100);
      }

      // Movement.
      // Fronts grind. Even a clear edge takes years, faster on open ground and with orders to attack.
      const stanceOf = (b: string) => war.stance?.[b] ?? "balanced";
      const advancing = ratio >= 1 ? front.belligerents[0] : front.belligerents[1];
      const holding = ratio >= 1 ? front.belligerents[1] : front.belligerents[0];
      const orders = (stanceOf(advancing) === "offensive" ? 1.8 : stanceOf(advancing) === "defensive" ? 0.25 : 1) * (stanceOf(holding) === "defensive" ? 0.5 : stanceOf(holding) === "offensive" ? 1.3 : 1);
      // Peer wars creep a few percent a year; a giant against a minnow breaks through.
      const edge = Math.log(Math.max(0.001, ratio)) * 0.5;
      const breakthrough = Math.sign(edge) * (Math.abs(edge) + Math.max(0, Math.abs(edge) - 1) ** 2);
      const pace = clamp(breakthrough, -8, 8) * orders * (dt / (SECONDS_PER_YEAR * 20));
      const wobble = rnd.normal() * 0.05 * Math.sqrt(dt / 86400);
      front.control = clamp(front.control + pace * 100 + wobble, -100, 100);
      announceFront(world, war, front);

      const owner = world.countries[front.belligerents[1]];
      if (owner) {
        const exposure = Math.min(1, Math.abs(front.control) / 100);
        front.contestedOutput = owner.economy.gdp * exposure * 0.22;
      }
    }

    // Mobilisation and phase.
    const avgExhaustion = Object.keys(war.belligerents).length
      ? Object.keys(war.belligerents).reduce((a, b) => a + (war.exhaustion[b] ?? 0), 0) / Object.keys(war.belligerents).length
      : 0;
    const decidedFronts = war.fronts.filter((f) => Math.abs(f.control) > 85);
    war.phase = nextPhase(war, avgExhaustion, decidedFronts.length);

    if (avgExhaustion > 82 || war.fronts.every((f) => Math.abs(f.control) > 96)) {
      concludeWar(world, war, rnd);
    }
  }

  // Clean up finished wars so the war panel stays readable.
  for (const [id, w] of Object.entries(world.wars)) {
    // A war that ended on a ceasefire line stays on the books while the line is on the map.
    const frozen = w.endedAt && w.fronts.some((f) => (frontOccupation(w, f, world.countries)?.share ?? 0) > 0.02);
    if (w.endedAt && !frozen && world.t - w.endedAt > SECONDS_PER_YEAR * 3) delete world.wars[id];
  }
}

/** Put big moves of the line on the wire, in 5% steps. */
function announceFront(world: World, war: War, front: War["fronts"][number]): void {
  const o = frontOccupation(war, front, world.countries);
  if (!o) return;
  const bucket = Math.floor((o.share * 100) / 5);
  if (front.lastBucket === undefined) {
    front.lastBucket = bucket;
    return;
  }
  if (bucket === front.lastBucket) return;
  const advancing = bucket > front.lastBucket;
  front.lastBucket = bucket;
  const land = world.countries[o.territory];
  pushEvent(world, { kind: "military", severity: "notice", country: o.territory, title: `${o.holderName} ${advancing ? "advances" : "falls back"}: now holds ${bucket * 5}% of ${land.name}`, body: `The line moves on the ${front.name} front.`, tags: ["war", "front"] });
}

function nextPhase(war: War, exhaustion: number, decided: number): War["phase"] {
  const elapsed = 0;
  void elapsed;
  if (decided >= war.fronts.length) return "negotiations";
  if (exhaustion > 72) return "stalemate";
  if (exhaustion > 45) return "attrition";
  if (war.fronts.length > 2) return "protracted";
  return "war";
}

/** Hand over part of a country: the ground on the map, its people and its output. */
export function transferLand(world: World, from: string, to: string, share: number, ring: [number, number][], name: string): void {
  const a = world.countries[from];
  const b = world.countries[to];
  if (!a || !b || share <= 0 || ring.length < 3) return;
  const part = clamp(share, 0, 0.98);
  const moved = a.economy.gdp * part;
  const pop = a.economy.population * part;
  const shrink = 1 - part;
  const grow = 1 + moved / Math.max(1, b.economy.gdp);
  const scale = (c: Country, k: number) => {
    const e = c.economy;
    const m = e.macro;
    m.potential *= k;
    m.realGdp *= k;
    m.capital *= k;
    m.realHistory = m.realHistory.map((v) => v * k);
    e.gdp *= k;
    for (const s of e.sectors) {
      s.quantity *= k;
      s.capacity *= k;
      s.output *= k;
    }
  };
  scale(a, shrink);
  scale(b, grow);
  a.economy.population = Math.max(1000, a.economy.population - pop);
  b.economy.population += pop;
  a.economy.gdpPerCapita = a.economy.gdp / a.economy.population;
  b.economy.gdpPerCapita = b.economy.gdp / b.economy.population;
  world.regions.push({ id: `ceded-${from}-${to}-${world.dayCount}-${world.regions.length}`, name, owner: to, hosts: a.lands ?? [from], ring });
}

/** Bring a state into an existing war on a side. */
export function joinWar(world: World, warId: string, joiner: string, side: string): void {
  const war = world.wars[warId];
  const c = world.countries[joiner];
  // Nobody drags the player into a war; that stays the player's decision.
  if (!war || !c || war.endedAt || war.belligerents[joiner] || joiner === world.playerCountry) return;
  war.belligerents[joiner] = [];
  war.exhaustion[joiner] = 2;
  war.publicSupport[joiner] = 62;
  if (!c.wars.includes(warId)) c.wars.push(warId);
  const opposed = Object.keys(war.belligerents).filter((b) => b !== joiner && b !== side && !areAllied(world, b, side));
  for (const o of opposed) {
    c.relations[o] = clamp((c.relations[o] ?? 0) - 50, -100, 100);
    if (world.countries[o]) world.countries[o].relations[joiner] = clamp((world.countries[o].relations[joiner] ?? 0) - 50, -100, 100);
  }
  war.fronts.push({ id: `${warId}-f${war.fronts.length}`, name: `${c.name} Front`, belligerents: [joiner, opposed[0] ?? war.fronts[0].belligerents[1]], control: 0, contestedOutput: 0, openedAt: world.t, terrain: "plains", attritionRate: 0.0004 });
  pushEvent(world, { kind: "military", severity: "catastrophic", country: joiner, title: `${c.name} enters the ${war.name}`, body: `${c.name} joins the fighting alongside ${world.countries[side]?.name ?? side}.`, actors: [joiner, side], tags: ["war"] });
}

function areAllied(world: World, a: string, b: string): boolean {
  return Boolean(world.countries[a]?.alliances.includes(b));
}

export function declareWar(world: World, attacker: string, defender: string, cause: string, byUserId?: string): War | null {
  const a = world.countries[attacker];
  const d = world.countries[defender];
  if (!a || !d || attacker === defender) return null;
  if (a.wars.some((id) => world.wars[id]?.belligerents[defender])) return null;

  const id = `war-${Object.keys(world.wars).length}-${Math.round(world.t)}`;
  const war: War = {
    id,
    name: `${a.name} - ${d.name} War`,
    startedAt: world.t,
    phase: "mobilised",
    belligerents: { [attacker]: [] as string[], [defender]: [] as string[] },
    cause,
    fronts: [{ id: `${id}-f0`, name: `${a.name} - ${d.name} Front`, belligerents: [attacker, defender], control: 0, contestedOutput: 0, openedAt: world.t, terrain: "plains", attritionRate: 0.0004 }],
    exhaustion: { [attacker]: 4, [defender]: 4 },
    casualties: {},
    materiel: {},
    warGoal: cause,
    publicSupport: { [attacker]: 62, [defender]: 70 },
  };
  world.wars[id] = war;
  a.wars.push(id);
  d.wars.push(id);
  a.relations[defender] = clamp((a.relations[defender] ?? 0) - 70, -100, 100);
  d.relations[attacker] = clamp((d.relations[attacker] ?? 0) - 70, -100, 100);

  // Guarantee clauses: the defender's treaty partners come to its aid. The player's
  // own country is left to decide for itself.
  for (const t of Object.values(world.treaties)) {
    if (!t.active || (t.kind !== "alliance" && t.kind !== "defensive-pact")) continue;
    if (!t.parties.includes(defender) || t.parties.includes(attacker)) continue;
    for (const p of t.parties) {
      if (p === defender || p === world.playerCountry || !world.countries[p] || war.belligerents[p]) continue;
      joinWar(world, id, p, defender);
    }
  }

  pushEvent(world, {
    kind: "military",
    severity: "catastrophic",
    country: attacker,
    title: `${a.name} declares war on ${d.name}`,
    body: cause,
    actors: [attacker, defender],
    byUserId,
    tags: ["war"],
  });
  return war;
}

function concludeWar(world: World, war: War, rnd: Rng): void {
  const sides = Object.keys(war.belligerents);
  const score: Record<string, number> = {};
  void rnd;
  for (const s of sides) {
    const own = war.fronts.reduce((acc, f) => acc + (f.belligerents[0] === s ? f.control : -f.control), 0) / Math.max(1, war.fronts.length);
    score[s] = own - (war.exhaustion[s] ?? 0) / 2;
  }
  const ordered = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const winner = ordered[0]?.[0];
  const loser = ordered[ordered.length - 1]?.[0];
  if (!winner || !loser) return;

  const margin = score[winner] - score[loser];
  war.endedAt = world.t;
  war.outcome = margin > 45 ? "victory" : margin < -10 ? "defeat" : "white-peace";
  war.victor = margin > 45 ? winner : undefined;

  const wc = world.countries[winner];
  const lc = world.countries[loser];
  const terms: string[] = [];

  // Conquest needs the ground. Short of that, the war ends on the line it reached.
  const heldOfLoser = Math.max(0, ...war.fronts.map((f) => {
    const o = frontOccupation(war, f, world.countries);
    return o && o.territory === loser && o.holder === winner ? o.share : 0;
  }));
  if (heldOfLoser >= 0.8 && wc && lc && lc.id !== world.playerCountry) {
    annex(world, winner, loser, "Territorial concession at the end of the war");
    terms.push(`${lc?.name} is annexed in its entirety`);
  } else if (wc && lc) {
    // War reparations.
    const pay = lc.economy.gdp * clamp(0.02 + margin / 900, 0.01, 0.24);
    lc.economy.fiscal.debt += pay;
    wc.economy.reserves += pay * 0.4;
    terms.push(`${lc.name} pays ${(pay / 1e9).toFixed(1)}bn in reparations`);
  }

  // Exhaustion collapses after the guns stop.
  for (const s of sides) {
    const c = world.countries[s];
    if (!c) continue;
    c.wars = c.wars.filter((id) => id !== war.id);
    c.relations[winner] = clamp((c.relations[winner] ?? 0) + 18, -100, 100);
    c.military.morale = clamp(c.military.morale + 12, 0, 100);
    c.economy.monetary.inflation = clamp(c.economy.monetary.inflation + (c.unrestRisk ?? 0) * 0.02, -0.2, 0.9);
    if (c.unrestRisk > 0.05) {
      c.unrest.push({ id: `unrest-${c.id}-postwar-${world.events.length}`, kind: "rebellion", intensity: clamp((c.unrestRisk - 0.05) * 200, 10, 80), startedAt: world.t, fatalities: 0 });
    }
  }

  pushEvent(world, {
    kind: "military",
    severity: "major",
    title: `${war.name} ends`,
    body: `${war.outcome === "victory" ? `Decisive victory for ${world.countries[winner]?.name ?? winner}.` : war.outcome === "white-peace" ? "A white peace. Everyone retreats to where they started." : `${world.countries[loser]?.name ?? loser} capitulates.`} ${terms.join(". ")}.`,
    actors: sides,
    tags: ["war", "peace"],
  });
}

export function annex(world: World, annexer: string, target: string, cause: string, byUserId?: string): void {
  const a = world.countries[annexer];
  const t = world.countries[target];
  if (!a || !t || a.id === t.id || t.annexedBy) return;

  const growBy = t.economy.gdp / Math.max(1, a.economy.gdp);
  a.economy.gdp += t.economy.gdp;
  a.economy.population += t.economy.population;
  a.economy.fiscal.debt += t.economy.fiscal.debt;
  a.economy.reserves += t.economy.reserves;
  a.economy.gdpPerCapita = a.economy.gdp / a.economy.population;
  a.economy.macro.potential *= 1 + growBy;
  a.economy.macro.realGdp *= 1 + growBy;
  a.economy.macro.capital *= 1 + growBy;
  a.economy.macro.realHistory = a.economy.macro.realHistory.map((v) => v * (1 + growBy));
  for (const s of a.economy.sectors) { s.quantity *= 1 + growBy; s.capacity *= 1 + growBy; }
  for (const k of Object.keys(world.control)) if (world.control[k] === target) world.control[k] = annexer;
  for (const r of world.regions) if (r.owner === target) r.owner = annexer;
  a.military.activeDuty += t.military.activeDuty;
  a.military.spend += t.military.spend;
  for (const [k, v] of Object.entries(t.economy.trade.flows)) a.economy.trade.flows[k] = (a.economy.trade.flows[k] ?? 0) + v;
  for (const co of Object.values(world.companies)) {
    if (co.country === target) {
      co.country = annexer;
      const x = world.exchanges[co.exchangeId ?? ""];
      if (x) {
        x.listings = x.listings.filter((id) => id !== co.id);
        x.listings.push(co.id);
      }
    }
  }
  for (const ch of Object.values(world.characters)) {
    if (ch.country === target) ch.removedAt = world.t;
  }
  for (const p of t.parties) {
    p.status = "outside";
    delete world.parties[p.id];
  }

  for (const wid of t.wars) {
    const w = world.wars[wid];
    if (w && !w.endedAt && Object.keys(w.belligerents).filter((b) => b !== target).length < 2) w.endedAt = world.t;
  }
  t.wars = [];
  t.annexedBy = annexer;

  pushEvent(world, {
    kind: "political",
    severity: "catastrophic",
    country: annexer,
    title: `${a.name} annexes ${t.name}`,
    body: cause,
    actors: [annexer, target],
    byUserId,
    tags: ["annexation"],
  });
}

// ===========================================================================
// Treaties and sanctions
// ===========================================================================

export function signTreaty(world: World, kind: Treaty["kind"], parties: string[], terms: string[], rnd: Rng, tradeBonus = 0, byUserId?: string): Treaty | null {
  const valid = parties.filter((p) => world.countries[p] && !world.countries[p].annexedBy);
  if (valid.length < 2) return null;
  const id = `treaty-${Object.keys(world.treaties).length}-${Math.round(world.t)}`;
  const t: Treaty = {
    id,
    name: `${kindLabel(kind)}: ${valid.map((p) => world.countries[p].name).join(" / ")}`,
    kind,
    parties: valid,
    signedAt: world.t,
    terms,
    tradeBonus: tradeBonus || (kind === "trade" || kind === "customs-union" ? 1e10 : 0),
    favourability: Object.fromEntries(valid.map((p) => [p, rnd.float(10, 60)])),
    active: true,
  };
  world.treaties[id] = t;
  if (kind === "alliance" || kind === "defensive-pact" || kind === "entente") {
    for (const a of valid) {
      for (const b of valid) {
        if (a === b) continue;
        const c = world.countries[a];
        c.relations[b] = clamp((c.relations[b] ?? 0) + 34, -100, 100);
        if (!c.alliances.includes(b)) c.alliances.push(b);
      }
    }
  }
  if (kind === "trade" || kind === "customs-union") {
    for (const a of valid) {
      const c = world.countries[a];
      for (const b of valid) {
        if (a === b) continue;
        c.economy.trade.flows[b] = (c.economy.trade.flows[b] ?? 0) + tradeBonus / valid.length;
        c.economy.trade.tradeOpenness = clamp(c.economy.trade.tradeOpenness + 4, 0, 96);
      }
    }
  }
  pushEvent(world, {
    kind: "diplomatic",
    severity: "major",
    title: `${t.name} signed`,
    body: terms.join(". "),
    actors: valid,
    byUserId,
    tags: ["treaty"],
  });
  return t;
}

export function exitTreaty(world: World, t: Treaty, party: string, byUserId?: string): void {
  t.parties = t.parties.filter((p) => p !== party);
  if (t.parties.length < 2) t.active = false;
  const c = world.countries[party];
  if (c) {
    for (const p of t.parties) {
      c.relations[p] = clamp((c.relations[p] ?? 0) - 30, -100, 100);
      c.alliances = c.alliances.filter((x) => x !== p);
    }
  }
  pushEvent(world, {
    kind: "diplomatic",
    severity: "major",
    title: `${world.countries[party]?.name ?? party} withdraws from ${t.name}`,
    body: "The agreement is torn up.",
    actors: [party, ...t.parties],
    byUserId,
    tags: ["treaty"],
  });
}

function kindLabel(kind: Treaty["kind"]): string {
  return { alliance: "Alliance", "non-aggression": "Non-aggression Pact", trade: "Trade Agreement", entente: "Entente", peace: "Peace Treaty", "defensive-pact": "Defensive Pact", access: "Access Agreement", "customs-union": "Customs Union", "lend-lease": "Lend-Lease Agreement" }[kind];
}

export function imposeSanction(world: World, by: string, target: string, kind: Sanction["kind"], rnd: Rng, byUserId?: string): Sanction | null {
  const b = world.countries[by];
  const t = world.countries[target];
  if (!b || !t) return null;
  const existing = t.sanctions.find((id) => world.sanctions[id]?.imposedBy.includes(by));
  if (existing) return world.sanctions[existing];

  const id = `sanction-${Object.keys(world.sanctions).length}-${Math.round(world.t)}`;
  const power = Math.sqrt(b.economy.gdp / Math.max(1, t.economy.gdp));
  const scope = clamp(Math.round(24 + power * 22 + rnd.float(-8, 14)), 8, 92);
  const bite = (kind === "embargo" || kind === "technology" || kind === "oil" ? 1.5 : 1) * scope;
  const s: Sanction = {
    id,
    imposedBy: [by],
    on: target,
    at: world.t,
    kind,
    scope,
    duration: SECONDS_PER_YEAR * rnd.float(0.6, 3),
    until: world.t + SECONDS_PER_YEAR * rnd.float(0.6, 3),
    costToTarget: t.economy.gdp * bite * 0.004,
    costToImposer: b.economy.gdp * bite * 0.0006,
    evasion: rnd.float(0.05, 0.45),
  };
  s.until = world.t + s.duration;
  world.sanctions[id] = s;
  t.sanctions.push(id);
  b.relations[target] = clamp((b.relations[target] ?? 0) - 45, -100, 100);
  pushEvent(world, {
    kind: "diplomatic",
    severity: "major",
    country: target,
    title: `${b.name} imposes ${kind} sanctions on ${t.name}`,
    body: `Coverage ${scope}%. Estimated annual cost to the target: ${(s.costToTarget / 1e9).toFixed(1)}bn.`,
    actors: [by, target],
    byUserId,
    tags: ["sanctions"],
  });
  return s;
}

export function liftSanction(world: World, id: string, byUserId?: string): void {
  const s = world.sanctions[id];
  if (!s) return;
  const t = world.countries[s.on];
  if (t) {
    t.sanctions = t.sanctions.filter((x) => x !== id);
    for (const b of s.imposedBy) {
      const bc = world.countries[b];
      if (bc) bc.relations[s.on] = clamp((bc.relations[s.on] ?? 0) + 22, -100, 100);
    }
    pushEvent(world, { kind: "diplomatic", severity: "notice", country: s.on, title: `Sanctions on ${t.name} lifted`, body: "The measures have been withdrawn.", byUserId, tags: ["sanctions"] });
  }
  delete world.sanctions[id];
}

/** Countries that are at war, for the map overlay. */
export function warsByCountry(world: World): Record<string, { warId: string; role: "attacker" | "defender"; control: number }[]> {
  const out: Record<string, { warId: string; role: "attacker" | "defender"; control: number }[]> = {};
  for (const w of Object.values(world.wars)) {
    if (w.endedAt) continue;
    for (const f of w.fronts) {
      for (let i = 0; i < f.belligerents.length; i++) {
        const iso3 = f.belligerents[i];
        (out[iso3] ??= []).push({ warId: w.id, role: i === 0 ? "attacker" : "defender", control: f.control });
      }
    }
  }
  return out;
}

export type { Country };