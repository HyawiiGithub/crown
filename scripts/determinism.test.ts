/**
 * Determinism guard for the simulation.
 *
 *   npx tsx scripts/determinism.test.ts   (or: npm run test:sim)
 *
 * Two things are enforced:
 *   1. Nothing under src/sim may call Math.random. Every random draw has to come
 *      from the seeded Rng, or a world cannot be replayed from its seed.
 *   2. Two worlds built from the same scenario and seed are identical after the
 *      same span of simulated days, with Math.random trapped so a call made at
 *      runtime fails here even if it is spelled indirectly.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { getScenario } from "../src/data/scenarios";
import { buildWorld } from "../src/sim/bootstrap";
import { SimEngine } from "../src/sim/engine";

let failures = 0;
const check = (name: string, ok: boolean, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
  if (!ok) failures += 1;
};

const files: string[] = [];
const walk = (dir: string) => {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (path.endsWith(".ts")) files.push(path);
  }
};
walk("src/sim");

const offenders = files.flatMap((file) =>
  readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((line, i) => ({ file, line: i + 1, text: line }))
    .filter((l) => l.text.includes("Math.random")),
);
check(
  "nothing under src/sim calls Math.random",
  offenders.length === 0,
  offenders.map((o) => `${o.file}:${o.line}`).join(", ") || `${files.length} files scanned`,
);

/** Wall-clock stamps are not simulation state, so they are dropped before comparing. */
const WALL_CLOCK = new Set([
  "at", "updatedAt", "createdAt", "firedAt", "lastFiredAt", "lastCampaignAt",
  "lastSeenAt", "registeredAt", "introducedAt", "expiresAt", "joinedAt",
]);
const stable = (value: unknown): string =>
  JSON.stringify(value, (key, v) => {
    if (WALL_CLOCK.has(key)) return undefined;
    if (typeof v === "number" && v > 1e14) return 0;
    return v;
  });

const NOW = 1_700_000_000_000;
const DAYS = 60;

function run(seedWorld: number) {
  const scenario = getScenario("1900");
  const world = buildWorld(scenario, "determinism", "1900:determinism", NOW);
  world.seed = seedWorld;
  const engine = new SimEngine(world);
  const trap = Math.random;
  Math.random = () => {
    throw new Error("Math.random was called by the simulation");
  };
  try {
    engine.advanceDays(DAYS);
  } finally {
    Math.random = trap;
  }
  return {
    world: stable(world),
    rng: engine.rngState,
    t: world.t,
    gdp: world.globals.globalGdp,
    events: world.events.length,
  };
}

const base = getScenario("1900").params.seed;
try {
  const a = run(base);
  const b = run(base);
  check("the simulation advances the simulated days", a.t >= DAYS * 86400, `t=${a.t} events=${a.events}`);
  check("the same seed replays the same world", a.world === b.world, `${a.world.length} chars compared`);
  check("the same seed leaves the RNG in the same state", a.rng === b.rng, `${a.rng} vs ${b.rng}`);

  const other = run(base + 1);
  check("a different seed produces a different world", other.world !== a.world, `gdp ${a.gdp} vs ${other.gdp}`);
} catch (err) {
  check("the simulation runs without Math.random", false, err instanceof Error ? err.message : String(err));
}

console.log(failures === 0 ? "\nDETERMINISM OK" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
