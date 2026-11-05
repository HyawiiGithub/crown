import type { Country, Front, War } from "../shared/types";

export interface Occupation {
  /** Who holds the ground: a country id or an insurgency id. */
  holder: string;
  holderName: string;
  /** The polity whose land is held. */
  territory: string;
  /** Share of that land, 0..1. */
  share: number;
}

/**
 * Turns a front's control number into ground. Between two states, control is the
 * share of the loser's land the winner holds. Against an insurgency, the state's
 * control runs from all (100) through half (0) to almost none (-100) of the country.
 */
export function frontOccupation(war: War, front: Front, countries: Record<string, Country>): Occupation | null {
  if (front.theatre === "none") return null;
  const [a, b] = front.belligerents;
  const rebelA = war.rebels?.[a];
  const rebelB = war.rebels?.[b];

  if (rebelA || rebelB) {
    const rebel = rebelA ?? rebelB!;
    const state = rebelA ? b : a;
    const stateControl = rebelA ? -front.control : front.control;
    const host = rebel.id.split("_")[0];
    const territory = front.theatre ?? (countries[host] ? host : state);
    if (!countries[territory]) return null;
    return { holder: rebel.id, holderName: rebel.name, territory, share: (100 - stateControl) / 200 };
  }

  const holder = front.control >= 0 ? a : b;
  const loser = front.control >= 0 ? b : a;
  const territory = front.theatre ?? loser;
  const land = countries[territory];
  const holderCountry = countries[holder];
  if (!land || !holderCountry) return null;
  // Winning on ground that is already yours or your colony's occupies nothing.
  if (territory === holder || land.overlord === holder || (war.belligerents[holder] ?? []).includes(territory)) return null;
  return { holder, holderName: holderCountry.name, territory, share: Math.abs(front.control) / 100 };
}

/** Share of a country's land held by enemies in the wars still being fought. */
export function occupiedShare(c: Country, wars: War[], countries: Record<string, Country>): number {
  let total = 0;
  for (const w of wars) {
    if (w.endedAt) continue;
    for (const f of w.fronts) {
      const o = frontOccupation(w, f, countries);
      if (o && o.territory === c.id) total = Math.max(total, o.share);
    }
  }
  return total;
}

export interface PeaceStanding {
  /** Share of the enemy's land you hold, and the front it sits on. */
  mine: number;
  mineFront: number;
  /** Share of your land the enemy holds, and the front it sits on. */
  theirs: number;
  theirsFront: number;
  /** How much the enemy will concede; negative means they expect concessions from you. */
  leverage: number;
}

export function peaceStanding(war: War, me: string, enemy: string, countries: Record<string, Country>): PeaceStanding {
  let mine = 0;
  let mineFront = -1;
  let theirs = 0;
  let theirsFront = -1;
  war.fronts.forEach((f, i) => {
    const o = frontOccupation(war, f, countries);
    if (!o) return;
    const owner = countries[o.territory];
    if (o.holder === me && (o.territory === enemy || owner?.overlord === enemy) && o.share > mine) {
      mine = o.share;
      mineFront = i;
    }
    if (o.holder === enemy && (o.territory === me || owner?.overlord === me) && o.share > theirs) {
      theirs = o.share;
      theirsFront = i;
    }
  });
  const myTired = war.exhaustion[me] ?? 0;
  const theirTired = war.exhaustion[enemy] ?? 0;
  const leverage = mine * 110 - theirs * 110 + (theirTired - myTired) * 0.6 + (theirTired > 75 ? 15 : 0) - (myTired > 75 ? 15 : 0);
  return { mine, mineFront, theirs, theirsFront, leverage };
}

export interface PeaceTerms {
  annexOccupied?: boolean;
  annexWhole?: boolean;
  cede?: boolean;
  /** Share of the enemy's land you drew on the map. */
  drawnShare?: number;
  /** Fraction of the enemy's GDP they pay you; negative means you pay them. */
  reparations?: number;
}

/** What the terms ask of the enemy, on the same scale as leverage. */
export function peaceCost(terms: PeaceTerms, standing: PeaceStanding): number {
  let cost = 0;
  if (terms.annexWhole) cost += 100;
  else {
    if (terms.annexOccupied) cost += standing.mine * 100;
    if (terms.drawnShare) cost += terms.drawnShare * 100;
  }
  if (terms.cede) cost -= standing.theirs * 100;
  cost += (terms.reparations ?? 0) * 200;
  return cost;
}

export function peaceAccepted(terms: PeaceTerms, standing: PeaceStanding): boolean {
  return peaceCost(terms, standing) <= standing.leverage + 3;
}
