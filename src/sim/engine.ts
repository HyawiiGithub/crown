import type { CustomRule, World, WorldDirective, WorldEvent } from "../shared/types";
import { pushEvent, recomputeGlobals } from "./bootstrap";
import { Rng, approach, clamp, clamp01 } from "./rng";
import { stepEconomy, stepMarkets, SECONDS_PER_YEAR } from "./step-economy";
import { stepPolitics } from "./step-politics";
import { stepDiplomacy, stepWars } from "./step-world";
import { applyDirectives } from "./rules";

/**
 * The tick orchestrator.
 *
 * Order matters and is deliberate:
 *   1. advance the clock
 *   2. economy (macro, fiscal, monetary, sectors)
 *   3. markets and corporations
 *   4. politics (parties, bills, elections, unrest)
 *   5. diplomacy and war
 *   6. recompute global aggregates
 *   7. dev directives and rules run LAST and win
 *
 * Step 7 running last is what makes "pin USA GDP to 50 trillion" actually stick
 * rather than being quietly overwritten on the next macro pass.
 */

export interface TickOutcome {
  dt: number;
  events: WorldEvent[];
  version: number;
}

const HISTORY_INTERVAL = 3 * 86400; // one rolling point per in-game three days
const CRASH_BANDS = ["crash", "bearish", "neutral", "bullish", "euphoric"] as const;

export class SimEngine {
  private rng: Rng;
  private lastHistoryAt = 0;

  constructor(private world: World) {
    this.rng = new Rng(world.seed);
  }

  get rngState(): number {
    return this.rng.state;
  }

  set rngState(v: number) {
    this.rng.state = v;
  }

  /** Run one simulation step of `dtRealSeconds` of wall clock. */
  tick(dtRealSeconds: number): TickOutcome {
    const w = this.world;
    const eventsBefore = w.events.length;

    if (!w.paused && dtRealSeconds > 0) {
      // Clamp so a backgrounded tab or a long GC pause cannot fast-forward the
      // world by an hour. The lost time is deliberately not caught up.
      const dt = clamp(dtRealSeconds, 0, 30);
      const simSeconds = dt * w.daysPerSecond * w.speed;

      w.t += simSeconds;
      w.params.seed = w.params.seed; // seed stays fixed for reproducibility

      stepEconomy(w, this.rng, simSeconds);
      stepMarkets(w, this.rng, simSeconds);
      stepPolitics(w, this.rng, simSeconds);
      stepDiplomacy(w, this.rng, simSeconds);
      stepWars(w, this.rng, simSeconds);

      recomputeGlobals(w);
      recordHistory(w, this.lastHistoryAt, simSeconds, (t) => (this.lastHistoryAt = t));
      stepHistoryRollovers(w, this.rng);
      applyDirectives(w, simSeconds);
      recomputeGlobals(w);
      w.updatedAt = Date.now();
      w.version++;
    }

    return { dt: dtRealSeconds, events: w.events.slice(eventsBefore), version: w.version };
  }
}

/**
 * Rolling economic history. One point per ~3 in-game days is enough resolution
 * for every chart in the UI while keeping the array bounded at a few thousand.
 */
function recordHistory(w: World, lastAt: number, simSeconds: number, setLast: (t: number) => void): void {
  if (w.t - lastAt < HISTORY_INTERVAL) return;
  setLast(w.t);
  const big = Object.entries(w.countries)
    .filter(([, c]) => !c.overlord && !c.annexedBy && !c.banned)
    .sort((a, b) => b[1].economy.gdp - a[1].economy.gdp)
    .slice(0, 60);
  const ex = w.markets.exchanges[0];
  const index = ex ? ex.index : 1000;
  for (const [, c] of big) {
    c.economy.history.push({
      t: w.t,
      gdp: c.economy.gdp,
      gdpGrowth: c.economy.gdpGrowth,
      inflation: c.economy.monetary.inflation,
      unemployment: c.economy.labour.unemployment,
      debtToGdp: c.economy.fiscal.debtToGdp,
      stockIndex: index,
    });
    if (c.economy.history.length > 2000) c.economy.history.splice(0, c.economy.history.length - 2000);
  }
  void simSeconds;
}

const DAY = 86400;

/**
 * Monthly-ish housekeeping: exchange history, leader tenures, interest
 * accrual on the sovereign scorecard, and the annual corporate filings.
 */
function stepHistoryRollovers(w: World, rnd: Rng): void {
  const dayIndex = Math.floor(w.t / DAY);

  // Exchange one-year baselines, once a simulated year.
  if (dayIndex % 365 === 0 && dayIndex > 0) {
    for (const ex of w.markets.exchanges) ex.indexYearAgo = ex.index;
    for (const co of Object.values(w.companies)) co.sharePriceYearAgo = co.sharePrice;
    for (const c of Object.values(w.countries)) {
      c.executive.termEndsAt = (c.executive.termEndsAt ?? w.t) + 365 * DAY;
      c.economy.reserves += c.economy.trade.tradeBalance * 0.02;
    }
  }

  // Companies reprice their state ownership drift and delist stragglers.
  if (dayIndex % 30 === 0) {
    for (const co of Object.values(w.companies)) {
      if (co.insolvent) continue;
      co.dailyVolume = Math.round(Math.abs(co.sharePrice * co.valuation / 1e6) * rnd.float(0.4, 1.6));
    }
  }

  // Legacy war fatigue decays once the fighting stops.
  if (dayIndex % 7 === 0) {
    for (const c of Object.values(w.countries)) {
      c.unrest = c.unrest.filter((u) => !u.endedAt || w.t - u.endedAt < DAY * 30);
      if (!c.unrest.length) c.unrestRisk = clamp01(c.unrestRisk * 0.94);
      c.cohesion = approach(c.cohesion, 96, 0.004);
    }
  }

  // Prune characters that were removed long ago and belong to nobody.
  if (dayIndex % 30 === 0 && dayIndex > 30) {
    const cutoff = w.t - 180 * DAY;
    let removed = 0;
    for (const [id, ch] of Object.entries(w.characters)) {
      if (ch.removedAt && ch.removedAt < cutoff && !ch.userId) {
        delete w.characters[id];
        removed++;
      }
    }
    if (removed > 200) void rnd;
  }
}

// ===========================================================================
// Developer console operations
// ===========================================================================

export interface DevResult {
  ok: boolean;
  message: string;
}

export function addDirective(w: World, d: Omit<WorldDirective, "id" | "createdAt"> & { id?: string }): WorldDirective {
  const directive = { ...d, id: d.id ?? `dir-${w.directives.length}-${Math.round(w.t)}`, createdAt: Date.now() } as WorldDirective;
  w.directives.push(directive);
  return directive;
}

export function addRule(w: World, r: Omit<CustomRule, "id" | "fired" | "log" | "createdAt"> & { id?: string }): CustomRule {
  const count = w.directives.filter((d) => d.kind === "custom-rule").length;
  const rule: CustomRule = {
    ...r,
    id: r.id ?? `rule-${count}-${Math.round(w.t)}`,
    fired: 0,
    log: [],
    createdAt: Date.now(),
  };
  // Rules live alongside directives so there is one ordered list to evaluate.
  addDirective(w, { kind: "custom-rule", rule, enabled: true, note: rule.name, createdBy: r.createdBy } as never);
  return rule;
}

/** Pause, resume and speed control for the Developer Menu. */
export function setSpeed(w: World, speed: number, paused?: boolean): DevResult {
  w.speed = clamp(speed, 0, 20);
  if (paused !== undefined) w.paused = paused;
  pushEvent(w, {
    kind: "system",
    severity: "info",
    title: paused ? "World paused" : "World resumed",
    body: `Speed set to ${w.speed}x.`,
    tags: ["system"],
  });
  return { ok: true, message: `Speed ${w.speed}x, ${w.paused ? "paused" : "running"}` };
}

/** Advance the world by a fixed amount of simulated time, immediately. */
export function fastForward(w: World, engine: SimEngine, simSeconds: number): DevResult {
  const steps = clamp(Math.ceil(simSeconds / 30), 1, 600);
  const per = simSeconds / steps;
  for (let i = 0; i < steps; i++) engine.tick(per / w.daysPerSecond);
  return { ok: true, message: `Advanced ${(simSeconds / DAY).toFixed(1)} in-game days in ${steps} steps` };
}

export { SECONDS_PER_YEAR, CRASH_BANDS, DAY };
export type { CustomRule };