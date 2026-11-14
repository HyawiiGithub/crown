import type { Country, World } from "../shared/types";
import { pushEvent } from "./bootstrap";
import { cede } from "./collapse";
import { chokepointById, setChokepoint } from "./chokepoints";
import type { Scripted } from "./scripted";

/**
 * History arcs too large to sit in the scenario table.
 *
 * The Soviet dissolution and the present-day flashpoints each need several steps,
 * cross-references into the collapse and chokepoint machinery, and room to say
 * something. Keeping them here means `scripted.ts` stays a timetable and this
 * file stays a chronicle.
 */

function nudge(w: World, iso: string, patch: (c: Country) => void): void {
  const c = w.countries[iso];
  if (c) patch(c);
}

/** Give a republic that has just left the union a plausible independent politics. */
function independents(w: World, lands: string[]): void {
  for (const land of lands) {
    const neo = w.countries[land];
    if (!neo) continue;
    neo.overlord = undefined;
    neo.annexedBy = undefined;
    neo.government = "parliamentary-republic";
    neo.ideology = 0;
    neo.cohesion = 68;
    neo.executive.approval = 57;
    neo.executive.emergencyPowers = false;
  }
}

function leave(w: World, land: string, title: string, body: string): void {
  const uss = w.countries.USS;
  if (!uss || !(uss.lands ?? []).includes(land)) return;
  if (!cede(w, uss, land)) return;
  independents(w, [land]);
  pushEvent(w, { kind: "political", severity: "catastrophic", country: "USS", title, body, tags: ["collapse", "soviet", "independence"] });
}

/** 1990: the union comes apart on its real calendar, unless a player holds it. */
const SOVIET_1990: Scripted[] = [
  {
    day: 69,
    actors: ["USS"],
    run: (w) => {
      const uss = w.countries.USS;
      if (!uss) return;
      uss.crisis ??= { stage: "unrest", tension: 0.26, since: w.t, lost: [], measures: [], lastEventAt: 0 };
      uss.cohesion = Math.max(20, uss.cohesion - 4);
      pushEvent(w, {
        kind: "political",
        severity: "major",
        country: "USS",
        title: "Lithuania declares independence",
        body: "The Supreme Council in Vilnius repudiates the 1940 annexation. Moscow calls it illegal; the Baltic question is now open.",
        tags: ["collapse", "soviet", "independence"],
      });
    },
  },
  {
    day: 90,
    actors: ["USS"],
    run: (w) => {
      nudge(w, "USS", (uss) => {
        uss.crisis ??= { stage: "unrest", tension: 0.34, since: w.t, lost: [], measures: [], lastEventAt: 0 };
        uss.crisis.tension = Math.min(0.95, uss.crisis.tension + 0.08);
        uss.cohesion = Math.max(18, uss.cohesion - 4);
      });
      pushEvent(w, {
        kind: "political",
        severity: "major",
        country: "USS",
        title: "Estonia and Latvia move to secede",
        body: "Both republics edge toward independence, and the miners of the Donbas are on strike over pay the treasury does not have.",
        tags: ["collapse", "soviet", "independence"],
      });
    },
  },
  {
    day: 231,
    actors: ["USS"],
    run: (w) => {
      nudge(w, "USS", (uss) => {
        uss.crisis ??= { stage: "armed", tension: 0.5, since: w.t, lost: [], measures: [], lastEventAt: 0 };
        uss.crisis.stage = "armed";
        uss.crisis.tension = Math.min(0.96, uss.crisis.tension + 0.18);
        uss.cohesion = Math.max(15, uss.cohesion - 10);
        uss.economy.macro.shock -= 0.03;
      });
      pushEvent(w, {
        kind: "political",
        severity: "catastrophic",
        country: "USS",
        title: "The August coup",
        body: "The State Committee on the State of Emergency takes the airwaves and detains the President. Tanks are on the Garden Ring; the republics are watching.",
        tags: ["collapse", "soviet", "coup"],
      });
    },
  },
  {
    day: 240,
    actors: ["USS"],
    run: (w) => {
      nudge(w, "USS", (uss) => {
        uss.crisis ??= { stage: "secession", tension: 0.6, since: w.t, lost: [], measures: [], lastEventAt: 0 };
        uss.crisis.stage = "secession";
        uss.crisis.tension = Math.min(0.97, uss.crisis.tension + 0.08);
        uss.executive.approval = Math.max(5, uss.executive.approval - 12);
      });
      pushEvent(w, {
        kind: "political",
        severity: "major",
        country: "USS",
        title: "The coup collapses",
        body: "The putsch fails in three days. The party's authority does not survive it, and every republic now reads the centre as optional.",
        tags: ["collapse", "soviet", "coup"],
      });
    },
  },
  {
    day: 341,
    actors: ["USS"],
    run: (w) => {
      const uss = w.countries.USS;
      if (!uss) return;
      for (const land of ["EST", "LVA", "LTU", "GEO", "ARM", "MDA", "UKR", "BLR", "KAZ", "UZB", "TKM", "KGZ", "TJK", "AZE"]) {
        leave(w, land, "", "");
      }
      uss.name = "Russia";
      uss.formalName = "Russian Federation";
      uss.government = "federal-republic";
      uss.ideology = 10;
      uss.cohesion = 52;
      uss.crisis = undefined;
      delete w.countries.USS;
      uss.id = "RUS";
      w.countries.RUS = uss;
      for (const iso of Object.keys(w.control)) if (w.control[iso] === "USS") w.control[iso] = "RUS";
      for (const k of Object.keys(w.seats ?? {})) if (w.seats![k] === "USS") w.seats![k] = "RUS";
      pushEvent(w, {
        kind: "political",
        severity: "catastrophic",
        country: "RUS",
        title: "The Soviet Union ceases to exist",
        body: "At Belovezha the three Slavic republics declare the union dissolved. The red flag comes down over the Kremlin, and Russia takes the Soviet seat in the world's councils.",
        tags: ["collapse", "soviet", "dissolution"],
      });
    },
  },
];

/** Present-day flashpoints: the lanes and chokepoints the news is always about. */
const FLAVOUR_2026: Scripted[] = [
  {
    day: 45,
    actors: ["YEM"],
    run: (w) => {
      const lane = chokepointById(w, "bab");
      if (lane) setChokepoint(w, lane, "closed", lane.owner, "Militias on the Yemeni coast begin stopping and boarding merchant shipping.");
    },
  },
  {
    day: 120,
    actors: ["CHN"],
    run: (w) => {
      const lane = chokepointById(w, "taiwan");
      if (lane) setChokepoint(w, lane, "threatened", lane.owner, "Large-scale exercises close the approaches and insurers reprice the whole lane.");
    },
  },
  {
    day: 180,
    actors: [],
    run: (w) => {
      pushEvent(w, {
        kind: "economic",
        severity: "major",
        title: "A tariff war breaks out between the largest economies",
        body: "Retaliation follows retaliation. Supply chains that were being shortened are now being redrawn again, and the cost lands on consumers.",
        tags: ["trade", "diplomacy"],
      });
      const big = Object.values(w.countries).filter((c) => c.economy.gdp > 1e12 && !c.annexedBy);
      for (const c of big) c.economy.macro.shock -= 0.012;
    },
  },
  {
    day: 240,
    actors: ["PAN"],
    run: (w) => {
      const lane = chokepointById(w, "panama");
      if (lane) setChokepoint(w, lane, "closed", lane.owner, "A record drought leaves the canal short of water, and the daily transit slots are cut to a trickle.");
    },
  },
  {
    day: 300,
    actors: [],
    run: (w) => {
      pushEvent(w, {
        kind: "economic",
        severity: "notice",
        title: "Freight rates spike across the Pacific",
        body: "Two closures and a reflagging crisis later, container spot rates double in a quarter. Importers in Europe and East Asia absorb it.",
        tags: ["trade"],
      });
      for (const c of Object.values(w.countries)) if (!c.annexedBy && c.economy.gdpPerCapita > 20000) c.economy.monetary.inflation += 0.004;
    },
  },
];

export const FLAVOUR_SCRIPTS: Record<string, Scripted[]> = {
  "1990": SOVIET_1990,
  "2026": FLAVOUR_2026,
};
