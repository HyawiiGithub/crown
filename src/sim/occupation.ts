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
