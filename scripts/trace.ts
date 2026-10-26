import { getScenario } from "../src/data/scenarios";
import { buildWorld } from "../src/sim/bootstrap";
import { SimEngine } from "../src/sim/engine";
import { YEAR } from "../src/web/format";

const scenario = getScenario(process.argv[2] ?? "1900");
const world = buildWorld(scenario, "Trace", `trace:${scenario.id}`, Date.now());
const engine = new SimEngine(world);

const watch = [
  "economy.gdp", "economy.fiscal.revenue", "economy.fiscal.expenditure", "economy.fiscal.debt",
  "economy.fiscal.treasury", "economy.trade.exports", "economy.trade.imports",
  "economy.reserves", "economy.netForeignAssets", "economy.labour.unemployment",
  "economy.monetary.inflation", "economy.monetary.policyRate", "economy.corruption", "economy.inequality",
];

const read = (o: unknown, p: string): unknown => {
  let cur: unknown = o;
  for (const k of p.split(".")) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[k];
  }
  return cur;
};

const perTick = YEAR / 180;
for (let i = 1; i <= 180; i++) {
  engine.tick(perTick / world.daysPerSecond);
  for (const c of Object.values(world.countries)) {
    for (const p of watch) {
      const v = read(c, p);
      if (c.id === process.env.WATCH && i <= 3) {
    console.log(`tick ${i} ${c.id} gdp=${(c.economy.gdp/1e9).toFixed(0)}B rev=${(c.economy.fiscal.revenue/1e9).toFixed(0)}B disc=${(c.economy.fiscal.expenditure/1e9).toFixed(0)}B svc=${(c.economy.fiscal.debtService/1e9).toFixed(0)}B debt/GDP=${(c.economy.fiscal.debtToGdp*100).toFixed(0)}% bal=${(c.economy.fiscal.budgetBalanceRatio*100).toFixed(1)}% policies eco=${c.policies.economy} tax=${c.policies.tax} def=${c.policies.defence} wel=${c.policies.welfare}`);
  }
  if (typeof v === "number" && !Number.isFinite(v)) {
        console.log(`tick ${i}: ${c.id} ${p} = ${v}`);
        console.log(JSON.stringify({
          gdp: c.economy.gdp,
          rev: c.economy.fiscal.revenue,
          exp: c.economy.fiscal.expenditure,
          debt: c.economy.fiscal.debt,
          treasury: c.economy.fiscal.treasury,
          taxIncome: c.economy.fiscal.taxIncome,
          rent: c.economy.fiscal.resourceRent,
          tariffs: c.economy.fiscal.tariffs,
          imports: c.economy.trade.imports,
          growth: c.economy.gdpGrowth,
          unemployment: c.economy.labour.unemployment,
          inflation: c.economy.monetary.inflation,
          policyRate: c.economy.monetary.policyRate,
          corruption: c.economy.corruption,
          inequality: c.economy.inequality,
          balance: c.economy.fiscal.budgetBalanceRatio,
        }, null, 2));
        process.exit(1);
      }
    }
  }
}
console.log("clean");