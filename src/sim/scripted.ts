import type { World } from "../shared/types";
import { pushEvent } from "./bootstrap";
import { annex, declareWar, joinWar } from "./step-world";

/**
 * History on rails, for events the scenario's whole premise rests on. Each fires
 * once on its real date, unless the player governs one of the states involved, in
 * which case that decision belongs to the player.
 */

interface Scripted {
  /** Days after the scenario start. */
  day: number;
  /** Polities whose agency this event would take away from a player. */
  actors: string[];
  run: (w: World) => void;
}

const SCRIPTS: Record<string, Scripted[]> = {
  "1914": [
    { day: 30, actors: ["AUT", "SRB"], run: (w) => { declareWar(w, "AUT", "SRB", "The Austro-Hungarian ultimatum after the assassination at Sarajevo is rejected."); } },
    { day: 34, actors: ["DEU", "RUS"], run: (w) => { if (!warBetween(w, "AUT", "SRB")) return; const war = declareWar(w, "DEU", "RUS", "Russia mobilises in support of Serbia, and Germany answers."); if (war) { joinWar(w, war.id, "AUT", "DEU"); joinWar(w, war.id, "SRB", "RUS"); } } },
    { day: 36, actors: ["DEU", "FRA"], run: (w) => { const war = warBetween(w, "DEU", "RUS"); if (war) joinWar(w, war, "FRA", "RUS"); } },
    { day: 37, actors: ["GBR", "DEU"], run: (w) => { const war = warBetween(w, "DEU", "RUS"); if (war) { joinWar(w, war, "BEL", "RUS"); joinWar(w, war, "GBR", "RUS"); joinWar(w, war, "CAN", "RUS"); joinWar(w, war, "AUS", "RUS"); joinWar(w, war, "NZL", "RUS"); joinWar(w, war, "ZAF", "RUS"); joinWar(w, war, "RAJ", "RUS"); } } },
    { day: 124, actors: ["OTT"], run: (w) => { const war = warBetween(w, "DEU", "RUS"); if (war) joinWar(w, war, "OTT", "DEU"); } },
  ],
  "1950": [
    { day: 175, actors: ["PRK", "KOR"], run: (w) => { const war = declareWar(w, "PRK", "KOR", "North Korean forces cross the 38th parallel to reunify the peninsula."); if (war) joinWar(w, war.id, "USA", "KOR"); } },
    { day: 280, actors: ["CHN"], run: (w) => { const war = warBetween(w, "PRK", "KOR"); if (war) joinWar(w, war, "CHN", "PRK"); } },
  ],
  "1990": [
    { day: 31, actors: ["DEU", "DDR"], run: (w) => { annex(w, "DEU", "DDR", "German reunification: the five eastern states accede to the Federal Republic."); } },
    {
      day: 136, actors: ["USA", "IRQ"], run: (w) => {
        pushEvent(w, { kind: "military", severity: "catastrophic", country: "IRQ", title: "Operation Desert Storm begins", body: "UN Resolution 678 has expired. The coalition air campaign against Iraq opens.", actors: ["USA", "IRQ"], tags: ["war"] });
        const gulf = w.wars["war-gulf-crisis"];
        if (gulf) gulf.fronts[0].control = Math.min(gulf.fronts[0].control, 30);
      },
    },
  ],
  "2010": [
    {
      day: 123, actors: ["GRC"], run: (w) => {
        const g = w.countries.GRC;
        if (!g) return;
        g.economy.macro.shock -= 0.05;
        pushEvent(w, { kind: "economic", severity: "major", country: "GRC", title: "Greece accepts a 110 billion euro bailout", body: "The euro zone and the IMF step in as Greek yields become unpayable. Deep austerity is the price.", tags: ["crisis", "debt"] });
      },
    },
  ],
  "2020": [
    {
      day: 20, actors: [], run: (w) => {
        pushEvent(w, { kind: "economic", severity: "major", title: "Lockdowns spread across the world economy", body: "A third of humanity is under some form of lockdown. Central banks and treasuries respond at wartime scale.", tags: ["crisis", "pandemic"] });
      },
    },
  ],
};

const fired = new WeakMap<World, Set<string>>();

function warBetween(w: World, a: string, b: string): string | undefined {
  return Object.values(w.wars).find((x) => !x.endedAt && x.belligerents[a] && x.belligerents[b])?.id;
}

export function stepScripted(w: World): void {
  const list = SCRIPTS[w.scenarioId];
  if (!list) return;
  let seen = fired.get(w);
  if (!seen) {
    seen = new Set();
    fired.set(w, seen);
  }
  list.forEach((s, i) => {
    if (s.day !== w.dayCount) return;
    const key = `${w.scenarioId}-${i}`;
    if (seen.has(key)) return;
    seen.add(key);
    if (w.playerCountry && s.actors.includes(w.playerCountry)) return;
    s.run(w);
  });
}
