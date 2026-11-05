/** Prints how the Ukraine front moves. Run with: npx tsx scripts/front.ts */
import { getScenario } from "../src/data/scenarios";
import { buildWorld } from "../src/sim/bootstrap";
import { SimEngine } from "../src/sim/engine";
import { frontOccupation } from "../src/sim/occupation";

const w = buildWorld(getScenario("2026"), "t", "t", 0);
w.paused = false;
const e = new SimEngine(w);
const war = w.wars["war-russo-ukrainian-war"];
for (let y = 0; y <= 6; y++) {
  const o = war.endedAt ? null : frontOccupation(war, war.fronts[0], w.countries);
  console.log(`year ${y}: ${o ? `${o.holderName} holds ${(o.share * 100).toFixed(1)}% of ${o.territory}` : `ended (${war.outcome})`}; exhaustion RUS ${war.exhaustion.RUS?.toFixed(0)} UKR ${war.exhaustion.UKR?.toFixed(0)}; UKR growth ${(w.countries.UKR.economy.gdpGrowth * 100).toFixed(1)}%`);
  e.advanceDays(365);
}
for (const x of Object.values(w.wars)) for (const f of x.fronts) { const o = frontOccupation(x, f, w.countries); console.log(x.name, x.endedAt ? "(ended)" : "", o ? `${o.holderName} ${(o.share*100).toFixed(0)}% of ${o.territory}` : "no occupation"); }
for (const y of ["1900","1914","1930","1950","1990","2010","2020"]) { const a = buildWorld(getScenario(y), "t", "t", 0); for (const x of Object.values(a.wars)) for (const f of x.fronts) { const o = frontOccupation(x, f, a.countries); console.log(y, x.name, o ? `${o.holderName} ${(o.share*100).toFixed(0)}% of ${o.territory}` : "no occupation"); } }
