/**
 * Smoke test: build every scenario, tick it forward a simulated year, and assert
 * that the numbers stay finite and the invariants hold.
 *
 * Run with: npx tsx scripts/smoke.ts
 */
import { SCENARIOS } from "../src/data/scenarios";
import { buildWorld } from "../src/sim/bootstrap";
import { SimEngine } from "../src/sim/engine";
import { SECTORS } from "../src/data/economy";
import { YEAR } from "../src/web/format";

let failures = 0;
const fail = (msg: string) => {
  console.error(`  FAIL ${msg}`);
  failures++;
};

function assertFinite(label: string, v: number) {
  if (!Number.isFinite(v)) fail(`${label} is ${v}`);
}

for (const scenario of SCENARIOS) {
  const t0 = Date.now();
  const world = buildWorld(scenario, `Smoke ${scenario.id}`, `test:${scenario.id}`, Date.now());
  const build = Date.now() - t0;

  const countries = Object.keys(world.countries);
  const independents = countries.filter((c) => !world.countries[c].overlord && !world.countries[c].annexedBy);
  const companies = Object.keys(world.companies);
  const exchanges = Object.keys(world.exchanges);

  console.log(
    `\n${scenario.id}  ${scenario.name}\n` +
    `  polities ${countries.length} (${independents.length} sovereign)  companies ${companies.length}  exchanges ${exchanges.length}  ` +
    `treaties ${Object.keys(world.treaties).length}  wars ${Object.keys(world.wars).length}  parties ${Object.keys(world.parties).length}  ` +
    `characters ${Object.keys(world.characters).length}  [build ${build}ms]`,
  );

  // --- structural invariants ---
  for (const c of Object.values(world.countries)) {
    assertFinite(`${c.id} gdp`, c.economy.gdp);
    assertFinite(`${c.id} gdpPerCapita`, c.economy.gdpPerCapita);
    if (c.economy.gdp <= 0) fail(`${c.id} has non-positive GDP`);
    if (c.economy.gdpPerCapita <= 0) fail(`${c.id} has non-positive GDP per capita`);
    const share = c.economy.sectors.reduce((a, s) => a + s.share, 0);
    if (Math.abs(share - 1) > 0.02) fail(`${c.id} sector shares sum to ${share.toFixed(3)}`);
    for (const s of c.economy.sectors) {
      if (!SECTORS[s.id]) fail(`${c.id} has unknown sector "${s.id}"`);
      if (s.employment < 0) fail(`${c.id}/${s.id} has negative employment`);
    }
    if (c.legislature) {
      for (const ch of c.legislature.chambers) {
        const seats = c.parties.reduce((a, p) => a + (p.seats[ch.id] ?? 0), 0);
        if (ch.seats > 0 && seats !== ch.seats) fail(`${c.id}/${ch.id} seats sum to ${seats}, expected ${ch.seats}`);
        for (const p of c.parties) if (p.seats[ch.id] && p.seats[ch.id] < 0) fail(`${c.id}/${p.id} negative seats`);
      }
    }
  }
  for (const co of Object.values(world.companies)) {
    assertFinite(`${co.name} valuation`, co.valuation);
    if (co.employees < 0) fail(`${co.name} negative employees`);
    const held = co.shareholders.reduce((a, s) => a + s.stake, 0);
    if (held > 1.05) fail(`${co.name} shareholder stakes sum to ${held.toFixed(2)}`);
  }

  // --- run a simulated year ---
  const engine = new SimEngine(world);
  const t1 = Date.now();
  const steps = 180; // 180 ticks x (YEAR/180) seconds
  const perTick = YEAR / steps;
  for (let i = 0; i < steps; i++) engine.tick(perTick / world.daysPerSecond);
  const elapsed = Date.now() - t1;

  assertFinite("world global GDP", world.globals.globalGdp);
  assertFinite("world inflation", world.globals.globalInflation);
  if (world.globals.globalGdp <= 0) fail("global GDP collapsed to zero");
  if (world.globals.globalInflation < -1) fail("global inflation below -100%");

  // NaN sweep across the whole object graph.
  let nanPaths = 0;
  const sweep = (node: unknown, path: string, depth: number) => {
    if (depth > 7 || nanPaths > 12) return;
    if (typeof node === "number") {
      if (!Number.isFinite(node)) {
        console.error(`  FAIL NaN at ${scenario.id} ${path}`);
        nanPaths++;
      }
      return;
    }
    if (Array.isArray(node)) {
      if (node.length > 400) return;
      for (let i = 0; i < node.length; i++) sweep(node[i], `${path}[${i}]`, depth + 1);
      return;
    }
    if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
        if (k === "rings") continue;
        sweep(v, `${path}.${k}`, depth + 1);
      }
    }
  };
  sweep(world.countries, "countries", 0);
  sweep(world.companies, "companies", 0);
  sweep(world.wars, "wars", 0);
  sweep(world.markets, "markets", 0);

  const globalGrowth = () => {
    let num = 0, den = 0;
    for (const c of Object.values(world.countries)) { if (c.annexedBy || c.overlord) continue; num += c.economy.gdpGrowth * c.economy.gdp; den += c.economy.gdp; }
    return den > 0 ? num / den : 0;
  };
  const us = world.countries.USA;
  const chn = world.countries.CHN;
  console.log(
    `  after 1 year (${elapsed}ms): world GDP ${(world.globals.globalGdp / 1e12).toFixed(1)}T  ` +
    `growth ${(globalGrowth() * 100).toFixed(2)}%  inflation ${(world.globals.globalInflation * 100).toFixed(2)}%  ` +
    `events ${world.events.length}`,
  );
  if (us) console.log(`    USA  GDP ${(us.economy.gdp / 1e12).toFixed(2)}T  growth ${(us.economy.gdpGrowth * 100).toFixed(2)}%  infl ${(us.economy.monetary.inflation * 100).toFixed(2)}%  u ${(us.economy.labour.unemployment * 100).toFixed(2)}%  debt ${(us.economy.fiscal.debtToGdp * 100).toFixed(0)}%`);
  if (chn) console.log(`    CHN  GDP ${(chn.economy.gdp / 1e12).toFixed(2)}T  growth ${(chn.economy.gdpGrowth * 100).toFixed(2)}%  infl ${(chn.economy.monetary.inflation * 100).toFixed(2)}%`);
  for (const e of world.events.slice(-3)) console.log(`    · [${e.kind}] ${e.title}`);
}

console.log(`\n${failures === 0 ? "ALL SCENARIOS PASS" : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);