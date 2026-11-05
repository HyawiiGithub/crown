/**
 * Validates every scenario's data and runs its simulation forward.
 *
 * Run with: npx tsx scripts/smoke.ts [years]
 */
import { readFileSync } from "node:fs";
import { SCENARIOS } from "../src/data/scenarios";
import { COUNTRY_BY_NUMERIC, TERRITORY_OWNER, UNCLAIMED_FEATURES, NAMED_FEATURES } from "../src/data/countries";
import { HISTORY } from "../src/data/history";
import { buildWorld } from "../src/sim/bootstrap";
import { SimEngine } from "../src/sim/engine";

const YEARS = Number(process.argv[2] ?? 10);
let failures = 0;
const fail = (msg: string) => {
  console.error(`  FAIL ${msg}`);
  failures++;
};

const topo = JSON.parse(readFileSync("public/geo/countries-50m.json", "utf8"));
const features: { id?: string | number; properties?: { name?: string } }[] = topo.objects.countries.geometries;
for (const f of features) {
  const id = f.id === undefined || f.id === null ? "" : String(f.id).padStart(3, "0");
  const name = f.properties?.name ?? "";
  if (!id) {
    if (!NAMED_FEATURES[name] && !TERRITORY_OWNER[name]) fail(`map feature "${name}" has no owner mapping`);
  } else if (!COUNTRY_BY_NUMERIC[id] && !TERRITORY_OWNER[id] && !UNCLAIMED_FEATURES.has(id) && id !== "732" && id !== "036") {
    fail(`map feature ${id} "${name}" is not joined to any country`);
  }
}

for (const scenario of SCENARIOS) {
  const t0 = Date.now();
  const world = buildWorld(scenario, `Smoke ${scenario.id}`, `test:${scenario.id}`, Date.now());
  const build = Date.now() - t0;
  const history = HISTORY[scenario.year];

  const seen = new Set<string>();
  for (const p of history.polities) {
    if (seen.has(p.id)) fail(`${scenario.id}: duplicate polity ${p.id}`);
    seen.add(p.id);
    if (!p.hos) fail(`${scenario.id}: ${p.id} has no head of state`);
    if (p.overlord && !history.polities.some((x) => x.id === p.overlord)) fail(`${scenario.id}: ${p.id} overlord ${p.overlord} missing`);
  }
  const claims = new Map<string, string>();
  for (const p of history.polities) {
    for (const land of p.lands) {
      if (claims.has(land)) fail(`${scenario.id}: ${land} claimed by ${claims.get(land)} and ${p.id}`);
      claims.set(land, p.id);
    }
  }
  for (const r of history.regions) if (!seen.has(r.owner)) fail(`${scenario.id}: region ${r.id} owner ${r.owner} missing`);
  for (const iso of Object.keys(COUNTRY_BY_NUMERIC)) {
    if (!world.control[iso]) fail(`${scenario.id}: land ${COUNTRY_BY_NUMERIC[iso].iso3} (${COUNTRY_BY_NUMERIC[iso].name}) belongs to nobody`);
    else if (!world.countries[world.control[iso]]) fail(`${scenario.id}: land ${iso} controller ${world.control[iso]} does not exist`);
  }

  const engine = new SimEngine(world);
  const usa0 = { ...world.countries.USA?.economy };
  const line = (c: typeof world.countries[string]) =>
    `${c.id.padEnd(4)} GDP ${(c.economy.gdp / 1e9).toFixed(1).padStart(8)}B  gr ${(c.economy.gdpGrowth * 100).toFixed(1).padStart(5)}%  inf ${(c.economy.monetary.inflation * 100).toFixed(1).padStart(5)}%  u ${(c.economy.labour.unemployment * 100).toFixed(1).padStart(4)}%  r ${(c.economy.monetary.policyRate * 100).toFixed(1).padStart(4)}%  y ${(c.economy.macro.bondYield * 100).toFixed(1).padStart(4)}%  debt ${(c.economy.fiscal.debtToGdp * 100).toFixed(0).padStart(3)}%  def ${(c.economy.fiscal.budgetBalanceRatio * 100).toFixed(1).padStart(5)}%  appr ${c.executive.approval.toFixed(0).padStart(2)}`;
  const t1 = Date.now();
  const majors = ["USA", "GBR", "DEU", "CHN", "JPN", "IND", "BRA", "RUS", "USS"].filter((m) => world.countries[m]).slice(0, 5);
  console.log(`\n${scenario.id} ${scenario.name}: ${Object.keys(world.countries).length} polities, ${Object.keys(world.companies).length} firms, ${Object.keys(world.wars).length} wars, ${Object.keys(world.treaties).length} treaties, world GDP ${(world.globals.globalGdp / 1e12).toFixed(2)}T [build ${build}ms]`);
  for (const m of majors) console.log("  start " + line(world.countries[m]));
  for (let y = 0; y < YEARS; y++) {
    engine.advanceDays(365);
    if (y === 0 || y === YEARS - 1) for (const m of majors) if (world.countries[m] && !world.countries[m].annexedBy) console.log(`  y${y + 1}    ` + line(world.countries[m]));
  }
  const elapsed = Date.now() - t1;
  console.log(`  ${YEARS}y in ${elapsed}ms (${(YEARS * 365000 / elapsed).toFixed(0)} days/s). wars ${Object.values(world.wars).filter((w) => !w.endedAt).length}, events ${world.events.length}, oil ${world.markets.commodityPrices.oil.toFixed(1)}, world GDP ${(world.globals.globalGdp / 1e12).toFixed(2)}T inf ${(world.globals.globalInflation * 100).toFixed(1)}%`);

  const biggest = Object.values(world.countries).filter((c) => !c.annexedBy).sort((a, b) => b.economy.gdp - a.economy.gdp).slice(0, 4);
  console.log(`  largest: ${biggest.map((c) => `${c.id} ${(c.economy.gdp / 1e12).toFixed(2)}T`).join(", ")}; infl max ${Object.values(world.countries).reduce((m, c) => (c.economy.monetary.inflation > m.v ? { v: c.economy.monetary.inflation, id: c.id } : m), { v: -1, id: "" }).id}; approval ${(Object.values(world.countries).reduce((a, c) => a + c.executive.approval, 0) / Object.keys(world.countries).length).toFixed(0)}`);

  // Accounts identity, and a NaN sweep through everything the engine writes.
  for (const c of Object.values(world.countries)) {
    if (c.annexedBy) continue;
    const a = c.economy.accounts;
    const residual = Math.abs(a.consumption + a.investment + a.government + a.exports - a.imports - c.economy.gdp) / c.economy.gdp;
    if (residual > 0.02) fail(`${c.id}: national accounts off by ${(residual * 100).toFixed(1)}%`);
    const shares = c.economy.sectors.reduce((s, x) => s + x.share, 0);
    if (Math.abs(shares - 1) > 0.01) fail(`${c.id}: sector shares sum to ${shares.toFixed(3)}`);
    if (c.legislature) for (const ch of c.legislature.chambers) {
      const sum = c.parties.reduce((s, p) => s + (p.seats[ch.id] ?? 0), 0);
      if (Math.abs(sum - ch.seats) > Math.max(2, ch.seats * 0.02)) fail(`${c.id}/${ch.id}: seats ${sum} of ${ch.seats}`);
    }
  }
  let nan = 0;
  const sweep = (node: unknown, path: string, depth: number) => {
    if (depth > 8 || nan > 10) return;
    if (typeof node === "number") {
      if (!Number.isFinite(node)) {
        fail(`${scenario.id} non-finite at ${path}`);
        nan++;
      }
    } else if (Array.isArray(node)) {
      if (node.length < 600) node.forEach((v, i) => sweep(v, `${path}[${i}]`, depth + 1));
    } else if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node as Record<string, unknown>)) sweep(v, `${path}.${k}`, depth + 1);
    }
  };
  sweep(world.countries, "countries", 0);
  sweep(world.companies, "companies", 0);
  sweep(world.markets, "markets", 0);
  void usa0;
  const size = JSON.stringify(world).length;
  console.log(`  save size ${(size / 1e6).toFixed(2)} MB`);
}

console.log(`\n${failures === 0 ? "ALL SCENARIOS PASS" : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
