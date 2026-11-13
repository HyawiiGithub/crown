import type { CustomRule, World, WorldDirective, WorldEvent } from "../shared/types";
import { pushEvent, recomputeGlobals } from "./bootstrap";
import { Rng, clamp } from "./rng";
import { SECONDS_PER_YEAR, stepAnnualEconomy, stepEconomy } from "./step-economy";
import { stepPolitics } from "./step-politics";
import { stepCollapse } from "./collapse";
import { stepDiplomacy, stepWars } from "./step-world";
import { stepScripted } from "./scripted";
import { applyDirectives } from "./rules";

/**
 * The clock.
 *
 * The world advances in whole simulated days, however fast it is running:
 *   daily    war, scripted history
 *   weekly   economy, politics, diplomacy, trade
 *   annually budgets, AI fiscal policy, 1-year market baselines
 * A tick therefore produces the same world at any speed. Dev directives run last
 * so that "pin USA GDP to 50 trillion" sticks.
 */

export interface TickOutcome {
  dt: number;
  events: WorldEvent[];
  version: number;
}

const DAY = 86400;
const HISTORY_EVERY_DAYS = 30;

export class SimEngine {
  private rng: Rng;
  /** Fraction of a sim day carried over between ticks. */
  private carry = 0;

  constructor(private world: World, rngState?: number) {
    this.rng = new Rng(world.seed);
    if (rngState !== undefined) this.rng.state = rngState;
    if (world.dayCount === undefined) world.dayCount = Math.floor(world.t / DAY);
    // Charts start from the opening position, not a month in.
    if (world.t === 0 && Object.values(world.countries).every((c) => !c.economy.history.length)) recordHistory(world);
  }

  get rngState(): number {
    return this.rng.state;
  }

  set rngState(v: number) {
    this.rng.state = v;
  }

  /** Advance by wall-clock seconds, honouring the world's speed. */
  tick(dtRealSeconds: number): TickOutcome {
    const w = this.world;
    const before = w.events.length;
    if (!w.paused && dtRealSeconds > 0) {
      // A backgrounded tab does not fast-forward the world by an hour.
      const real = clamp(dtRealSeconds, 0, 2);
      this.carry += real * w.daysPerSecond * w.speed;
      const days = Math.floor(this.carry);
      if (days > 0) {
        this.carry -= days;
        this.advanceDays(days);
      }
    }
    return { dt: dtRealSeconds, events: w.events.slice(before), version: w.version };
  }

  /** Advance exactly this many simulated days. */
  advanceDays(days: number): void {
    const w = this.world;
    for (let i = 0; i < days; i++) {
      w.t += DAY;
      w.dayCount++;
      stepWars(w, this.rng, DAY);
      stepScripted(w);
      if (w.dayCount % 7 === 0) {
        stepEconomy(w, this.rng);
        stepPolitics(w, this.rng);
        stepCollapse(w, this.rng);
        stepDiplomacy(w, this.rng, 7 * DAY);
        applyDirectives(w, 7 * DAY);
        recomputeGlobals(w);
      }
      if (w.dayCount % HISTORY_EVERY_DAYS === 0) recordHistory(w);
      if (w.dayCount % 365 === 0) stepAnnualEconomy(w);
    }
    w.updatedAt = Date.now();
    w.version++;
  }
}

/** Monthly history for charts, at most 40 years per country. */
function recordHistory(w: World): void {
  for (const c of Object.values(w.countries)) {
    if (c.annexedBy) continue;
    const e = c.economy;
    const ex = w.markets.exchanges.find((x) => x.country === c.id);
    e.history.push({
      t: w.t,
      gdp: e.gdp,
      gdpGrowth: e.gdpGrowth,
      inflation: e.monetary.inflation,
      unemployment: e.labour.unemployment,
      debtToGdp: e.fiscal.debtToGdp,
      stockIndex: ex?.index ?? 0,
      gdpPerCapita: e.gdpPerCapita,
      population: e.population,
      policyRate: e.monetary.policyRate,
      bondYield: e.macro.bondYield,
      budgetBalance: e.fiscal.budgetBalanceRatio,
      tradeBalance: e.trade.tradeBalance / Math.max(1, e.gdp),
      exchangeRate: e.monetary.exchangeRateVsUsd,
      medianWage: e.labour.medianWage,
      approval: c.executive.approval,
      militarySpend: e.fiscal.military,
    });
    if (e.history.length > 480) e.history.splice(0, e.history.length - 480);
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
  const rule: CustomRule = { ...r, id: r.id ?? `rule-${count}-${Math.round(w.t)}`, fired: 0, log: [], createdAt: Date.now() };
  addDirective(w, { kind: "custom-rule", rule, enabled: true, note: rule.name, createdBy: r.createdBy } as never);
  return rule;
}

export function setSpeed(w: World, speed: number, paused?: boolean): DevResult {
  w.speed = clamp(speed, 0, 60);
  if (paused !== undefined) w.paused = paused;
  pushEvent(w, { kind: "system", severity: "info", title: w.paused ? "World paused" : "World resumed", body: `Speed set to ${w.speed}x.`, tags: ["system"] });
  return { ok: true, message: `Speed ${w.speed}x, ${w.paused ? "paused" : "running"}` };
}

export function fastForward(_w: World, engine: SimEngine, simSeconds: number): DevResult {
  const days = clamp(Math.ceil(simSeconds / DAY), 1, 365 * 20);
  engine.advanceDays(days);
  return { ok: true, message: `Advanced ${days} in-game days` };
}

export { SECONDS_PER_YEAR, DAY };
export type { CustomRule };
