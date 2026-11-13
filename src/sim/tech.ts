import type { Country, World } from "../shared/types";
import { clamp } from "./rng";

/**
 * Research.
 *
 * The science line of the budget buys progress, and progress is not free: each
 * level costs more than the last. Army and logistics research decide how well
 * equipped a division is; industrial research lifts productivity.
 */

export type TechField = "army" | "logistics" | "industry";

export function techOf(c: Country) {
  return (c.tech ??= { army: 0, logistics: 0, industry: 0, points: 0, focus: "industry" as TechField });
}

export function costOf(level: number): number {
  return 40 * (level + 1);
}

export function stepResearch(world: World): void {
  const rate = world.params.researchSpeed ?? 1;
  for (const c of Object.values(world.countries)) {
    if (c.annexedBy || c.overlord) continue;
    const t = techOf(c);
    const share = Math.max(0, c.economy.budget.science);
    // A science line of 2% of GDP is roughly 2 points a week.
    t.points += share * 100 * rate;
    const level = t[t.focus];
    if (t.points >= costOf(level)) {
      t.points -= costOf(level);
      t[t.focus] = clamp(level + 1, 0, 12);
    }
  }
}

/** How much better equipped a division is for what the state has researched. */
export function equipmentBonus(c: Country): number {
  const t = c.tech;
  if (!t) return 1;
  return 1 + t.army * 0.1 + t.logistics * 0.05 + t.industry * 0.015;
}
