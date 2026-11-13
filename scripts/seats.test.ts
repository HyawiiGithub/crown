/**
 * Two members' seats are both run as player countries.
 *
 *   npx tsx scripts/seats.test.ts   (runs as part of: npm run test:sim)
 *
 * Online play keeps one country per member in `world.seats` and leaves
 * `playerCountry` empty, so heuristics that compared against `playerCountry`
 * alone steered a member's country the way the AI steers everyone else: the
 * annual AI set its budget, and its central bank ignored the rate its government
 * chose. Each check below seats two members and compares them with a third,
 * unseated country.
 */
import { getScenario } from "../src/data/scenarios";
import { buildWorld } from "../src/sim/bootstrap";
import { SimEngine } from "../src/sim/engine";
import { isPlayerCountry, playerCountries } from "../src/sim/seats";
import { stepAnnualEconomy } from "../src/sim/step-economy";

let failures = 0;
const check = (name: string, ok: boolean, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
  if (!ok) failures += 1;
};

const NOW = 1_700_000_000_000;
const SEATS = { "user-bel": "BEL", "user-esp": "ESP" } as const;
const build = (name: string, playerCountry?: string) =>
  buildWorld(getScenario("1900"), name, `1900:${name}`, NOW, playerCountry);

const world = build("seats");
world.seats = { ...SEATS };
delete world.playerCountry;
check("a seat counts as a player country", isPlayerCountry(world, "BEL") && isPlayerCountry(world, "ESP"), playerCountries(world).join(","));
check("an unseated country does not", !isPlayerCountry(world, "FRA"), playerCountries(world).join(","));
check("every seat is listed", playerCountries(world).sort().join(",") === "BEL,ESP", playerCountries(world).join(","));

// The annual AI fiscal pass looks for a deficit far outside what a government
// would tolerate. Both seats have one, so both would be adjusted if they were
// run as NPCs.
const SEATED = ["BEL", "ESP"] as const;
const CONTROL = "FRA";
for (const iso of [...SEATED, CONTROL]) {
  const e = world.countries[iso]!.economy;
  e.budget.defence = 0.05;
  e.fiscal.budgetBalanceRatio = -0.5;
}
stepAnnualEconomy(world);
const defence = (w: typeof world, iso: string) => w.countries[iso]!.economy.budget.defence;
check(
  "a seated country keeps the budget its member set",
  SEATED.every((iso) => defence(world, iso) === 0.05),
  SEATED.map((iso) => `${iso} ${defence(world, iso).toFixed(4)}`).join(", "),
);
check(
  "an unseated country still has its budget set by the AI",
  defence(world, CONTROL) !== 0.05,
  `${CONTROL} ${defence(world, CONTROL).toFixed(4)}`,
);

// A government-set rate: a seated country's central bank follows the rate its
// member chose; an NPC's bank keeps setting its own.
const banks = build("banks");
banks.seats = { ...SEATS };
delete banks.playerCountry;
for (const iso of [...SEATED, CONTROL]) {
  const e = banks.countries[iso]!.economy;
  e.centralBank.independent = false;
  e.centralBank.regime = "float";
  e.monetary.centralBankRate = 0.15;
}
const startRate = (iso: string) => banks.countries[iso]!.economy.monetary.policyRate;
const before = new Map([...SEATED, CONTROL].map((iso) => [iso, startRate(iso)]));
new SimEngine(banks).advanceDays(300);
const rate = (iso: string) => banks.countries[iso]!.economy.monetary.policyRate;
check(
  "both seats' banks hold the rate their governments chose",
  SEATED.every((iso) => rate(iso) > 0.12),
  SEATED.map((iso) => `${iso} ${(rate(iso) * 100).toFixed(2)}% from ${((before.get(iso) ?? 0) * 100).toFixed(2)}%`).join(", "),
);
check("the unseated country's bank still sets its own", rate(CONTROL) < 0.12, `${CONTROL} ${(rate(CONTROL) * 100).toFixed(2)}%`);

// Singleplayer has no seats and must keep its own country.
const solo = build("solo", "FRA");
for (const iso of ["FRA", "BEL"]) {
  const e = solo.countries[iso]!.economy;
  e.budget.defence = 0.05;
  e.fiscal.budgetBalanceRatio = -0.5;
}
stepAnnualEconomy(solo);
check("singleplayer's country is still the one it plays", isPlayerCountry(solo, "FRA") && !isPlayerCountry(solo, "BEL"));
check(
  "singleplayer's budget is left alone, the NPC's is not",
  defence(solo, "FRA") === 0.05 && defence(solo, "BEL") !== 0.05,
  `FRA ${defence(solo, "FRA").toFixed(4)}, BEL ${defence(solo, "BEL").toFixed(4)}`,
);

console.log(failures === 0 ? "\nSEATS OK" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
