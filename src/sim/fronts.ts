import type { Country, World } from "../shared/types";
import { pushEvent } from "./bootstrap";
import { clamp, type Rng } from "./rng";

/**
 * Ground moves.
 *
 * A front's `control` is the share of the disputed land each side holds, and it
 * used to sit wherever it was set until a peace conference read it. Now it is
 * pressed every day by the men, equipment, morale and orders both sides bring to
 * it: breakthroughs happen, offensives stall in mountains, and the map line
 * crawls forward the way a real one does.
 */

function pressOf(c: Country | undefined): number {
  if (!c) return 0;
  const m = c.military;
  const quality = clamp((m.branches?.army?.quality ?? 50) / 100, 0.2, 1.1);
  const men = m.activeDuty * quality * clamp(m.morale / 100, 0.25, 1.1) * clamp(m.readiness / 100, 0.25, 1.1);
  return Math.max(1, men);
}

const STANCE: Record<string, number> = { offensive: 1.4, balanced: 1, defensive: 0.65 };

function terrainOf(front: World["wars"][string]["fronts"][number]): number {
  switch (front.terrain) {
    case "mountain":
      return 0.38;
    case "urban":
    case "urban-core":
      return 0.5;
    case "forest":
    case "coastal":
      return 0.75;
    case "desert":
      return 0.85;
    default:
      return 1;
  }
}

export function stepFronts(w: World, rnd: Rng): void {
  for (const war of Object.values(w.wars)) {
    if (war.endedAt) continue;
    for (const front of war.fronts) {
      const [a, b] = front.belligerents;
      const ca = w.countries[a];
      const cb = w.countries[b];
      if (!ca || !cb) continue;
      const ra = war.rebels?.[a];
      const rb = war.rebels?.[b];
      const sa = ra ? Math.max(1, ra.strength) * 1e5 : pressOf(ca);
      const sb = rb ? Math.max(1, rb.strength) * 1e5 : pressOf(cb);
      const ordersA = STANCE[war.stance?.[a] ?? "balanced"] ?? 1;
      const ordersB = STANCE[war.stance?.[b] ?? "balanced"] ?? 1;
      const ratio = (sa * ordersA + 1) / (sb * ordersB + 1);
      const push = clamp(Math.log(ratio) * 1.1, -2.2, 2.2) * terrainOf(front) * (0.6 + rnd.float(0, 0.8));
      const before = front.control;
      front.control = clamp(front.control + push, -50, 100);
      const bucket = Math.trunc(front.control / 10);
      if (bucket === Math.trunc(before / 10) || bucket === front.lastBucket) continue;
      front.lastBucket = bucket;
      const forward = push > 0 ? ca : cb;
      const back = push > 0 ? cb : ca;
      const held = Math.round(Math.abs(front.control));
      pushEvent(w, {
        kind: "military",
        severity: held > 40 ? "major" : "notice",
        country: forward.id,
        title: `${front.name}: ${forward.name} gains ground`,
        body: `${forward.name} presses ${back.name} back and now holds about ${held}% of the disputed ground on this front.`,
        actors: [forward.id, back.id],
        tags: ["war", "front"],
      });
    }
  }
}
