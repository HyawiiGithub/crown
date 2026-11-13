import type { Country, CrisisState, World } from "../shared/types";
import { COUNTRY_BY_ISO3 } from "../data/countries";
import { pushEvent } from "./bootstrap";
import { clamp, clamp01, type Rng } from "./rng";

/**
 * State collapse.
 *
 * A large, multi-ethnic state under fiscal and military strain does not fall in a
 * single tick: pressure builds, the streets fill, armed groups take districts, the
 * outlying republics leave, and only then does the union dissolve. The player can
 * spend money, legitimacy or concessions at any stage to pull it back.
 */

const COLOURS = ["#9b4a4a", "#3f6f8f", "#7d5a9c", "#4f7a4a", "#a9762f", "#5c6470"];

/** How close a state is to breaking, 0..1. */
function strainOf(c: Country): number {
  const debt = c.economy.fiscal.debt / Math.max(1, c.economy.gdp);
  const inflation = c.economy.monetary.inflation;
  const unemployment = c.economy.labour.unemployment;
  const unrest = c.unrest.filter((u) => !u.endedAt).length;
  // Empires are harder to hold than city-states: every land past the fourth adds strain.
  const size = Math.min(0.12, Math.max(0, (c.lands?.length ?? 1) - 4) * 0.018);
  return clamp01(
    (1 - clamp(c.cohesion, 0, 100) / 100) * 0.42 +
      Math.max(0, debt - 0.55) * 0.35 +
      Math.max(0, inflation - 0.12) * 0.9 +
      Math.max(0, unemployment - 0.12) * 0.5 +
      Math.max(0, -c.economy.gdpGrowth - 0.02) * 4 +
      unrest * 0.06 +
      size,
  );
}

export function stepCollapse(world: World, rnd: Rng): void {
  for (const c of Object.values(world.countries)) {
    if (c.annexedBy || c.overlord) continue;
    if ((c.lands?.length ?? 0) < 3) continue;
    const strain = strainOf(c);
    if (!c.crisis && strain < 0.6) continue;
    const crisis = (c.crisis ??= { stage: "pressure", tension: 0, since: world.t, lost: [], measures: [], lastEventAt: 0 });
    crisis.tension = clamp01(crisis.tension + (strain - 0.5) * 0.07 + rnd.normal() * 0.003);
    if (crisis.tension < 0.03) {
      delete c.crisis;
      continue;
    }
    advance(world, c, crisis);
  }
}

function advance(world: World, c: Country, crisis: CrisisState): void {
  const t = crisis.tension;
  if (t >= 0.2 && crisis.stage === "pressure") {
    crisis.stage = "unrest";
    note(world, c, crisis, "major", `${c.name}: reform pressure`, "Students and workers are on the streets in the capital. The government calls for calm and promises a commission.");
    addUnrest(c, world, "protest", 30);
  }
  if (t >= 0.45 && crisis.stage === "unrest") {
    crisis.stage = "armed";
    note(world, c, crisis, "catastrophic", `${c.name}: armed rebellion`, "Armed groups have taken control of outlying districts. Garrisons are defecting in the provinces.");
    addUnrest(c, world, "rebellion", 62);
    c.unrestRisk = clamp01(c.unrestRisk + 0.12);
  }
  if (t >= 0.72 && crisis.stage === "armed") {
    crisis.stage = "secession";
    const land = pickLand(c);
    if (land && cede(world, c, land)) {
      note(world, c, crisis, "catastrophic", `${c.name}: a republic declares independence`, `The government of ${COUNTRY_BY_ISO3[land]?.name ?? land} has declared independence and its militias control the territory.`);
    }
  }
  if (t >= 0.95 && crisis.stage === "secession") {
    crisis.stage = "dissolved";
    for (const land of [...(c.lands ?? [])].slice(1)) cede(world, c, land);
    note(world, c, crisis, "catastrophic", `${c.name} dissolves`, "The union is dissolved. What remains of the central government controls the capital region and little else.");
  }
}
function note(world: World, c: Country, crisis: CrisisState, severity: "major" | "catastrophic", title: string, body: string): void {
  crisis.lastEventAt = world.t;
  pushEvent(world, { kind: "political", severity, country: c.id, title, body, tags: ["collapse", "crisis"] });
}

function addUnrest(c: Country, world: World, kind: "protest" | "riot" | "rebellion" | "separatism", intensity: number): void {
  if (c.unrest.filter((u) => !u.endedAt).length >= 4) return;
  c.unrest.push({ id: `unrest-${c.id}-collapse-${world.dayCount}-${c.unrest.length}`, kind, intensity, startedAt: world.t, fatalities: 0 });
}

/** The outlying land most likely to leave: the last one, never the core. */
function pickLand(c: Country): string | undefined {
  const lands = c.lands ?? [];
  for (let i = lands.length - 1; i > 0; i -= 1) if (COUNTRY_BY_ISO3[lands[i]]) return lands[i];
  return undefined;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/** Break a land away as its own state, carrying its share of the parent's economy. */
export function cede(world: World, parent: Country, land: string): boolean {
  const meta = COUNTRY_BY_ISO3[land];
  const lands = parent.lands ?? [];
  if (!meta || lands.length <= 1 || !lands.includes(land)) return false;
  let id = land;
  for (let n = 2; world.countries[id]; n += 1) id = `${land}${n}`;
  const share = 1 / lands.length;
  const clone = JSON.parse(JSON.stringify(parent)) as Country;
  clone.id = id as Country["id"];
  clone.name = meta.name;
  clone.formalName = undefined;
  clone.iso2 = meta.iso2;
  clone.isoNumeric = meta.numeric;
  clone.mapColor = COLOURS[Math.abs(hash(id)) % COLOURS.length];
  clone.lands = [land];
  clone.overlord = undefined;
  clone.annexedBy = undefined;
  clone.occupiedBy = undefined;
  clone.dependencies = {};
  clone.alliances = [];
  clone.wars = [];
  clone.crisis = undefined;
  clone.unrest = [];
  clone.unrestRisk = 0.06;
  clone.cohesion = 62;
  clone.executive.approval = 58;
  clone.economy.gdp = parent.economy.gdp * share;
  clone.economy.population = Math.max(0.5, parent.economy.population * share);
  clone.economy.gdpPerCapita = clone.economy.gdp / clone.economy.population;
  clone.economy.fiscal.debt = parent.economy.fiscal.debt * share * 0.5;
  clone.military.activeDuty = Math.max(1000, parent.military.activeDuty * share);
  world.countries[id] = clone;
  world.customCountries[id] = clone;
  world.control[meta.numeric] = id;
  parent.lands = lands.filter((l) => l !== land);
  parent.economy.gdp = Math.max(1, parent.economy.gdp - clone.economy.gdp);
  parent.economy.population = Math.max(0.5, parent.economy.population - clone.economy.population);
  parent.economy.gdpPerCapita = parent.economy.gdp / parent.economy.population;
  parent.crisis?.lost.push(land);
  return true;
}
/** A player's answer to the crisis. Each costs something real. */
export function answerCrisis(world: World, c: Country, measure: string): { ok: boolean; message: string } {
  const crisis = c.crisis;
  if (!crisis) return { ok: false, message: "There is no crisis to answer." };
  const gdp = Math.max(1, c.economy.gdp);
  let said = "";
  if (measure === "reform") {
    crisis.tension = clamp01(crisis.tension - 0.16);
    c.cohesion = clamp(c.cohesion + 7, 0, 100);
    c.executive.approval = clamp(c.executive.approval - 8, 0, 100);
    said = "Reform programme announced: the union loosens and the street quietens.";
  } else if (measure === "crackdown") {
    c.economy.fiscal.debt += gdp * 0.004;
    crisis.tension = clamp01(crisis.tension - 0.22);
    c.cohesion = clamp(c.cohesion - 4, 0, 100);
    c.executive.approval = clamp(c.executive.approval - 7, 0, 100);
    addUnrest(c, world, "riot", 40);
    said = "Security forces clear the streets. It works, for now.";
  } else if (measure === "subsidies") {
    c.economy.fiscal.debt += gdp * 0.01;
    crisis.tension = clamp01(crisis.tension - 0.13);
    c.executive.approval = clamp(c.executive.approval + 5, 0, 100);
    c.cohesion = clamp(c.cohesion + 3, 0, 100);
    said = "Emergency subsidies paid out of borrowed money.";
  } else if (measure === "concede") {
    const land = pickLand(c);
    if (!land || !cede(world, c, land)) return { ok: false, message: "There is nothing left to concede." };
    crisis.tension = clamp01(crisis.tension - 0.4);
    said = `${COUNTRY_BY_ISO3[land]?.name ?? land} is allowed to leave. The rest holds.`;
  } else {
    return { ok: false, message: "Unknown measure." };
  }
  crisis.measures.push(measure);
  pushEvent(world, { kind: "political", severity: "notice", country: c.id, title: `${c.name}: the government answers`, body: said, tags: ["collapse", "crisis"] });
  if (crisis.tension < 0.05) {
    pushEvent(world, { kind: "political", severity: "major", country: c.id, title: `${c.name}: the crisis passes`, body: "The pressure has come off. The union survives, for now.", tags: ["collapse", "crisis"] });
    delete c.crisis;
  }
  return { ok: true, message: said };
}
