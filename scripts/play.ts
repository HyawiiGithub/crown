/**
 * Plays the commands through the engine and checks that policy actually moves the
 * economy in the direction textbook macro says it should.
 *
 * Run with: npx tsx scripts/play.ts
 */
import { getScenario } from "../src/data/scenarios";
import { buildWorld } from "../src/sim/bootstrap";
import { SimEngine } from "../src/sim/engine";
import { runCommand } from "../src/sim/commands";
import { runDevOp } from "../src/sim/dev-ops";
import { Rng } from "../src/sim/rng";
import { frontOccupation } from "../src/sim/occupation";

let failures = 0;
const check = (name: string, ok: boolean, detail = "") => {
  console.log(`${ok ? "  ok  " : " FAIL "} ${name} ${detail}`);
  if (!ok) failures++;
};

function game(scenario: string, country: string) {
  const world = buildWorld(getScenario(scenario), "test", `t-${scenario}`, Date.now(), country);
  world.paused = false;
  const engine = new SimEngine(world);
  const rng = new Rng(7);
  return { world, engine, rng, c: world.countries[country], cmd: (b: Record<string, unknown>) => runCommand(world, engine, rng, b) };
}

const pc = (v: number) => `${(v * 100).toFixed(1)}%`;

// A tax hike narrows the deficit relative to the same world left alone.
{
  const a = game("2026", "CHN");
  const b = game("2026", "CHN");
  b.cmd({ type: "apply-policy", tax: { income: Math.min(0.7, b.c.economy.tax.income + 0.08), vat: Math.min(0.3, b.c.economy.tax.vat + 0.05) } });
  a.engine.advanceDays(365);
  b.engine.advanceDays(365);
  check("decree: tax rise improves the budget", b.c.economy.fiscal.budgetBalanceRatio > a.c.economy.fiscal.budgetBalanceRatio + 0.01, `${pc(a.c.economy.fiscal.budgetBalanceRatio)} vs ${pc(b.c.economy.fiscal.budgetBalanceRatio)}`);
  check("tax rise cools demand", b.c.economy.macro.outputGap <= a.c.economy.macro.outputGap + 0.005, `gap ${pc(a.c.economy.macro.outputGap)} vs ${pc(b.c.economy.macro.outputGap)}`);
}

// Printing money destroys credibility and raises inflation.
{
  const a = game("2026", "CHN");
  const b = game("2026", "CHN");
  b.c.economy.budget.welfare += 0.1;
  a.c.economy.budget.welfare += 0.1;
  const r = b.cmd({ type: "set-printing", value: 1 });
  check("printing order accepted by a non-independent bank", r.ok, r.message);
  a.engine.advanceDays(365 * 3);
  b.engine.advanceDays(365 * 3);
  check("printing money raises inflation", b.c.economy.monetary.inflation > a.c.economy.monetary.inflation + 0.02, `${pc(a.c.economy.monetary.inflation)} vs ${pc(b.c.economy.monetary.inflation)}`);
  check("printing money destroys credibility", b.c.economy.centralBank.credibility < a.c.economy.centralBank.credibility, `${a.c.economy.centralBank.credibility.toFixed(2)} vs ${b.c.economy.centralBank.credibility.toFixed(2)}`);
}

// Higher rates slow an economy.
{
  const a = game("2026", "CHN");
  const b = game("2026", "CHN");
  b.cmd({ type: "set-rate", value: 0.15 });
  a.world.playerCountry = "USA";
  b.engine.advanceDays(365);
  a.engine.advanceDays(365);
  check("high interest rates open a negative output gap", b.c.economy.macro.outputGap < a.c.economy.macro.outputGap - 0.005, `${pc(a.c.economy.macro.outputGap)} vs ${pc(b.c.economy.macro.outputGap)}`);
}

// Independent central banks refuse orders; union members cannot print.
{
  const g = game("2026", "USA");
  check("independent bank refuses a rate order", !g.cmd({ type: "set-rate", value: 0 }).ok);
  const de = game("2026", "ITA");
  check("euro member cannot print money", !de.cmd({ type: "set-printing", value: 1 }).ok);
}

// Democracies legislate; the vote can be seen, and it applies only after passing.
{
  const g = game("2026", "GBR");
  const before = g.c.economy.tax.income;
  const r = g.cmd({ type: "apply-policy", tax: { income: before + 0.01 } });
  check("bill goes to parliament", r.ok && /House of Commons/.test(r.message), r.message);
  check("nothing changes before the vote", g.c.economy.tax.income === before);
  g.engine.advanceDays(30);
  const bill = Object.values(g.world.bills)[0];
  check("the majority government passes its bill", bill?.status === "enacted", `${bill?.status} ${JSON.stringify(bill?.tallies)}`);
  check("the rate changes after the vote", Math.abs(g.c.economy.tax.income - before - 0.01) < 1e-9);
}

// US midterms do not remove the president; the 2028 vote can.
{
  const g = game("2026", "GBR");
  const us = g.c && g.world.countries.USA;
  const president = us.executive.headOfStateId;
  g.engine.advanceDays(365 + 60);
  check("midterms leave the president in place", us.executive.headOfStateId === president, g.world.characters[us.executive.headOfStateId ?? ""]?.name);
  check("the House was re-elected in 2026", (us.nextElectionAt ?? 0) > 365 * 86400);
  check("presidential election still ahead in 2027", (us.nextPresidentialAt ?? 0) > g.world.t);
}

// History on rails: the July Crisis cascades, unless the player holds the trigger.
{
  const g = game("1914", "USA");
  g.engine.advanceDays(45);
  const war = Object.values(g.world.wars).find((w) => w.belligerents.AUT && w.belligerents.SRB);
  check("1914: Austria-Hungary declares war on Serbia", Boolean(war));
  const big = Object.values(g.world.wars).find((w) => w.belligerents.DEU && w.belligerents.RUS);
  check("1914: the great powers are drawn in", Boolean(big?.belligerents.FRA && big?.belligerents.GBR), Object.keys(big?.belligerents ?? {}).join(" "));
  const p = game("1914", "AUT");
  p.engine.advanceDays(45);
  check("1914: playing Austria-Hungary, the decision is yours", !Object.values(p.world.wars).some((w) => w.belligerents.AUT && w.belligerents.SRB));
}

{
  const g = game("1990", "USA");
  g.engine.advanceDays(40);
  check("1990: Germany reunifies on schedule", Boolean(g.world.countries.DDR.annexedBy) && g.world.regions[0].owner === "DEU");
  const de = g.world.countries.DEU;
  check("reunification adds East Germany's economy", de.economy.gdp > 1.85e12, `$${(de.economy.gdp / 1e12).toFixed(2)}T`);
}

// War, peace, sanctions, trade.
{
  const g = game("2026", "POL");
  const w = g.cmd({ type: "declare-war", target: "BLR", cause: "test" });
  check("war can be declared", w.ok, w.message);
  g.engine.advanceDays(60);
  const war = Object.values(g.world.wars).find((x) => x.belligerents.POL);
  check("war appears and bleeds", Boolean(war) && (war?.casualties.POL ?? 0) > 0, `${Math.round(war?.casualties.POL ?? 0)} casualties`);
  check("cannot attack a treaty ally", !g.cmd({ type: "declare-war", target: "DEU" }).ok);
  const t = g.cmd({ type: "trade-barrier", partner: "CHN", value: 1 });
  check("embargo accepted", t.ok && g.c.tradeBarriers?.CHN === 1, t.message);
  const s = g.cmd({ type: "sanction", target: "RUS" });
  check("sanctions accepted", s.ok, s.message);
  const peace = g.cmd({ type: "seek-peace", war: war?.id, force: true });
  check("peace can be made", peace.ok && !g.c.wars.includes(war?.id ?? ""), peace.message);
}

// Companies are inside the economy.
{
  const g = game("2026", "USA");
  const apple = g.world.companies["co-apple"];
  const debtBefore = g.c.economy.fiscal.debt;
  const r = g.cmd({ type: "nationalise", company: "co-apple" });
  check("nationalisation costs compensation", r.ok && g.c.economy.fiscal.debt > debtBefore, r.message);
  check("nationalised firm leaves the exchange", !apple.listed);
  check("other countries' firms are out of reach", !g.cmd({ type: "nationalise", company: "co-toyota" }).ok);
}

// Peace deals move land, people and money.
{
  const g = game("2026", "RUS");
  const ua = g.world.countries.UKR;
  const ring: [number, number][] = [[36, 50], [41, 50], [41, 45], [33, 45]];
  const war = Object.values(g.world.wars).find((w) => w.belligerents.UKR)!;
  const greedy = g.cmd({ type: "propose-peace", war: war.id, enemy: "UKR", annexOccupied: true, occupiedRing: ring, reparations: 0.3 });
  check("greedy terms are refused", !greedy.ok, greedy.message);
  const gdp = ua.economy.gdp;
  const rusGdp = g.c.economy.gdp;
  const regions = g.world.regions.length;
  const deal = g.cmd({ type: "propose-peace", war: war.id, enemy: "UKR", annexOccupied: true, occupiedRing: ring });
  check("annexing what you hold is accepted", deal.ok, deal.message);
  check("the land changes hands on the map", g.world.regions.length === regions + 1 && g.world.regions[regions].owner === "RUS");
  check("the loser shrinks and the winner grows", ua.economy.gdp < gdp * 0.85 && g.c.economy.gdp > rusGdp, `${(ua.economy.gdp / 1e9).toFixed(0)}B`);
  check("the war ends for both", Boolean(war.endedAt) && !ua.wars.includes(war.id) && !g.c.wars.includes(war.id));
  check("no occupation line is left behind", frontOccupation(war, war.fronts[0], g.world.countries) === null);
  g.engine.advanceDays(120);
  check("the economy runs on after a transfer", Number.isFinite(ua.economy.gdp) && ua.economy.gdp > 0);

  const u = game("2026", "UKR");
  const w2 = Object.values(u.world.wars).find((w) => w.belligerents.RUS)!;
  check("the side losing ground cannot just walk away", !u.cmd({ type: "propose-peace", war: w2.id, enemy: "RUS" }).ok);
  const ceded = u.cmd({ type: "propose-peace", war: w2.id, enemy: "RUS", cede: true, cededRing: ring, reparations: -0.05 });
  check("giving up land and paying buys peace", ceded.ok, ceded.message);
}

// A saved game continues identically.
{
  const g = game("2026", "USA");
  g.engine.advanceDays(100);
  const copy = JSON.parse(JSON.stringify(g.world));
  const resumed = new SimEngine(copy, g.engine.rngState);
  g.engine.advanceDays(100);
  resumed.advanceDays(100);
  check("save and resume is deterministic", copy.countries.USA.economy.gdp === g.world.countries.USA.economy.gdp, `${copy.countries.USA.economy.gdp} / ${g.world.countries.USA.economy.gdp}`);
}

// Developer operations run locally.
{
  const g = game("2026", "USA");
  const actor = { id: "t", username: "tester" };
  const ops: Record<string, unknown>[] = [
    { op: "set-stat", scope: "country", id: "USA", path: "economy.gdp", value: 5e13 },
    { op: "grant", id: "USA", amount: 1e9, where: "treasury" },
    { op: "declare-war", attacker: "FRA", defender: "ESP", cause: "test" },
    { op: "force-election", country: "GBR" },
    { op: "console", code: "country(USA).economy.gdp" },
    { op: "inspect", scope: "country", id: "USA" },
    { op: "fast-forward", days: 14 },
  ];
  for (const op of ops) {
    const r = await runDevOp(g.world, g.engine, g.rng, op as { op: string }, actor);
    check(`dev op ${op.op}`, r.ok, r.message.slice(0, 70));
  }
  const reset = await runDevOp(g.world, g.engine, g.rng, { op: "reset-world" }, actor);
  check("dev op reset-world returns a fresh world", Boolean(reset.replaced?.playerCountry === "USA"));
}

console.log(failures ? `\n${failures} FAILED` : "\nALL PLAY CHECKS PASS");
process.exit(failures ? 1 : 0);
