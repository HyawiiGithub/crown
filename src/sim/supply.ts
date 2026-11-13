import type { Country, World } from "../shared/types";
import { clamp } from "./rng";

/**
 * Sea supply.
 *
 * A beachhead that does not command the sea is a prison: without naval parity the
 * troops ashore cannot be reinforced, and the front drifts back towards the water.
 */

const naval = (c: Country) => c.military.branches.navy.active * (c.military.branches.navy.quality / 100);

export function stepSupply(world: World): void {
  for (const war of Object.values(world.wars)) {
    for (const front of war.fronts) {
      if (!front.overseas) continue;
      const [attackerId, defenderId] = front.belligerents;
      const a = world.countries[attackerId];
      const d = world.countries[defenderId];
      if (!a || !d) continue;
      const mine = naval(a);
      const theirs = naval(d);
      const edge = mine / Math.max(1, mine + theirs);
      // Parity holds the line; a weaker fleet loses the beachhead slowly, a stronger one digs in.
      front.control = clamp(front.control + (edge - 0.5) * 0.8, -50, 50);
    }
  }
}
