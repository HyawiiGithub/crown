import type { Chokepoint, Country, World } from "../shared/types";
import { pushEvent } from "./bootstrap";
import { clamp, type Rng } from "./rng";
import { isPlayerCountry } from "./seats";

/**
 * The narrow water the world's trade is squeezed through.
 *
 * A canal or a strait is not a border: it is a toll booth with a fleet behind it.
 * Whoever holds one can threaten to close it, and when it closes the shock runs
 * through every open economy that ships through it — never through the owner,
 * who collects the tolls and the leverage. The lane a world inherits depends on
 * its era, so a 1900 world has the British at Suez and the Ottomans at the
 * Bosphorus, while 2026 has Cairo and Ankara.
 */

interface Seed {
  id: string;
  name: string;
  water: string;
  /** Present-day sovereign. */
  owner: string;
  /** Earlier holders, tried in order, for scenarios where `owner` did not exist yet. */
  before?: string[];
  /** Share of world seaborne trade, 0..1. */
  share: number;
  /** What it is the only way through for. */
  note: string;
}

const SEEDS: Seed[] = [
  { id: "malacca", name: "Strait of Malacca", water: "Indian Ocean · South China Sea", owner: "MYS", before: ["GBR", "IDN"], share: 0.29, note: "the shortest sea lane from the Gulf to East Asia" },
  { id: "hormuz", name: "Strait of Hormuz", water: "Persian Gulf · Gulf of Oman", owner: "IRN", share: 0.21, note: "the only sea exit for Gulf crude" },
  { id: "suez", name: "Suez Canal", water: "Red Sea · Mediterranean", owner: "EGY", before: ["GBR", "OTT"], share: 0.12, note: "Europe's shortcut to Asia" },
  { id: "taiwan", name: "Taiwan Strait", water: "East China Sea · Philippine Sea", owner: "CHN", before: ["JPN"], share: 0.11, note: "the busiest lane for containers and semiconductors" },
  { id: "bab", name: "Bab el-Mandeb", water: "Red Sea · Gulf of Aden", owner: "YEM", before: ["GBR", "EGY"], share: 0.09, note: "the gate at the south end of the Red Sea" },
  { id: "gibraltar", name: "Strait of Gibraltar", water: "Atlantic · Mediterranean", owner: "GBR", before: ["ESP"], share: 0.06, note: "the Mediterranean's only western door" },
  { id: "panama", name: "Panama Canal", water: "Atlantic · Pacific", owner: "PAN", before: ["COL", "USA"], share: 0.05, note: "the isthmus shortcut between the oceans" },
  { id: "bosphorus", name: "Bosphorus", water: "Black Sea · Mediterranean", owner: "TUR", before: ["OTT", "RUS"], share: 0.04, note: "the Black Sea's only warm-water exit" },
  { id: "danish", name: "Danish Straits", water: "Baltic · North Sea", owner: "DNK", share: 0.03, note: "the Baltic's gate to the open ocean" },
];

/** Seed a world's chokepoints the first time anyone looks at them. */
export function ensureChokepoints(w: World): Record<string, Chokepoint> {
  if (w.chokepoints) return w.chokepoints;
  const made: Record<string, Chokepoint> = {};
  for (const s of SEEDS) {
    const owner = [s.owner, ...(s.before ?? [])].find((iso) => w.countries[iso]) ?? "";
    made[s.id] = { id: s.id, name: s.name, water: s.water, owner, share: s.share, note: s.note, status: "open", changedAt: w.t };
  }
  w.chokepoints = made;
  return made;
}

export function chokepointById(w: World, id: string): Chokepoint | undefined {
  return ensureChokepoints(w)[id];
}

/** Open, rich, import-heavy economies feel a closed lane hardest. */
function exposure(c: Country): number {
  const openness = clamp(c.economy.gdpPerCapita / 45000, 0.3, 1.2);
  const size = clamp(Math.log10(Math.max(1e9, c.economy.gdp)) / 13, 0.35, 1);
  return clamp(openness * size, 0.2, 1.15);
}

/** Move a lane between open, threatened and closed, and write the history of it. */
export function setChokepoint(w: World, p: Chokepoint, status: Chokepoint["status"], by: string, why: string): void {
  if (p.status === status) return;
  p.status = status;
  p.changedAt = w.t;
  p.by = by;
  const who = w.countries[by]?.name ?? "A local authority";
  if (status === "closed") {
    pushEvent(w, {
      kind: "economic",
      severity: "catastrophic",
      country: by,
      title: `${who} closes the ${p.name}`,
      body: `${why} ${Math.round(p.share * 100)}% of world trade now takes the long way round.`,
      tags: ["trade", "chokepoint"],
    });
    for (const c of Object.values(w.countries)) {
      if (c.id === by || c.annexedBy || c.economy.gdp < 2e11) continue;
      c.relations[by] = clamp((c.relations[by] ?? 0) - 14, -100, 100);
    }
  } else if (status === "threatened") {
    pushEvent(w, {
      kind: "diplomatic",
      severity: "major",
      country: by,
      title: `${who} threatens to close the ${p.name}`,
      body: `${why} Insurers and freight rates react before a single ship is stopped.`,
      tags: ["trade", "chokepoint"],
    });
    for (const c of Object.values(w.countries)) {
      if (c.id === by || c.annexedBy || c.economy.gdp < 2e11) continue;
      c.relations[by] = clamp((c.relations[by] ?? 0) - 6, -100, 100);
    }
  } else {
    pushEvent(w, {
      kind: "economic",
      severity: "major",
      country: by,
      title: `The ${p.name} reopens`,
      body: `${why} Shipping resumes through the lane.`,
      tags: ["trade", "chokepoint"],
    });
  }
}

/**
 * Weekly: a closed lane taxes every open economy, pays the owner a toll, and an
 * AI owner rattles the cage when it is at war or cornered.
 */
export function stepChokepoints(w: World, rnd: Rng): void {
  const points = ensureChokepoints(w);
  for (const p of Object.values(points)) {
    const owner = p.owner ? w.countries[p.owner] : undefined;
    if (p.status === "closed") {
      for (const c of Object.values(w.countries)) {
        if (c.annexedBy || c.id === p.owner) continue;
        c.economy.macro.shock = clamp(c.economy.macro.shock - p.share * exposure(c) * 0.002, -0.4, 0.15);
      }
      if (owner) owner.economy.fiscal.revenue += owner.economy.gdp * p.share * 0.00004;
      const daysClosed = (w.t - p.changedAt) / 86400;
      if (daysClosed > 540 && rnd.chance(0.25)) {
        setChokepoint(w, p, "open", p.owner, "The blockade has outlived its purpose and the owner lifts it under pressure.");
      }
      continue;
    }
    if (p.status === "threatened" && rnd.chance(0.12)) {
      setChokepoint(w, p, "closed", p.by ?? p.owner, "The threat was carried out.");
      continue;
    }
    if (p.status !== "open" || !p.owner || !owner) continue;
    if (isPlayerCountry(w, p.owner)) continue;
    const atWar = (owner.wars?.length ?? 0) > 0;
    const cornered = owner.executive.approval < 30;
    if (rnd.chance(atWar ? 0.004 : cornered ? 0.0015 : 0.0002)) {
      const why = atWar
        ? `${owner.name} is at war and moves to shut the lane its enemies depend on.`
        : `${owner.name}'s government is under pressure at home and reaches for leverage abroad.`;
      setChokepoint(w, p, "threatened", p.owner, why);
    }
  }
}
