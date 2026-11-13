import type { World } from "../shared/types";
import { clamp } from "./rng";

/**
 * Manpower is not a constant. An army grows toward what the budget can carry and
 * what the population can spare, and shrinks when either falls away.
 */
export function stepMobilisation(world: World): void {
  for (const c of Object.values(world.countries)) {
    if (c.annexedBy) continue;
    const population = Math.max(1, c.economy.population);
    const gdpPc = c.economy.gdp / population;
    const budget = c.military.spend || c.economy.fiscal.military;
    if (!(budget > 0)) continue;
    const atWar = c.wars.some((id) => {
      const w = world.wars[id];
      return w && !w.endedAt;
    });
    // Peacetime keeps a cadre; a war opens the manpower tap, conscription wider still.
    const share = atWar ? (c.military.conscription ? 0.06 : 0.035) : c.military.conscription ? 0.02 : 0.009;
    const cap = population * share;
    const affordable = budget / Math.max(1, gdpPc * 0.85);
    const current = Math.max(1, c.military.activeDuty);
    // Peacetime armies grow slowly; a war is what lets them approach the manpower cap.
    const ceiling = atWar ? cap : Math.min(cap, current * 1.6);
    const target = clamp(Math.min(affordable, ceiling), 500, cap);
    // Peacetime recruitment tracks population growth; mobilisation is far faster.
    const rate = target > current ? (atWar ? 0.0025 : 0.0004) : 0.001;
    const next = clamp(current + (target - current) * rate, 500, cap);
    const ratio = next / current;
    c.military.activeDuty = next;
    // Branches follow the army, keeping their own share.
    for (const b of Object.values(c.military.branches)) if (b.active > 0) b.active = Math.max(0, Math.round(b.active * ratio));
    c.military.reserves = Math.max(c.military.reserves, Math.round(next * (c.military.conscription ? 0.6 : 0.3)));
  }
}
