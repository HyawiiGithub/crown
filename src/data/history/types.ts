import type { Bloc, GovernmentType } from "../../shared/types";

export type DependencyStatus = "colony" | "protectorate" | "mandate" | "dominion" | "occupation" | "territory";

/** One polity as it stood at a scenario's start date. */
export interface PolitySeed {
  id: string;
  name: string;
  government: GovernmentType;
  ideology: number;
  bloc: Bloc;
  /** Millions. Undefined means "sum the lands". */
  popM?: number;
  /** Billions of current USD of the period. Undefined means "estimate from the lands". */
  gdpB?: number;
  hosTitle?: string;
  hos: string;
  hogTitle?: string;
  hog?: string;
  /** Modern ISO3 territories this polity holds outright. */
  lands: string[];
  overlord?: string;
  status?: DependencyStatus;
  rulingParty?: string;
}

/**
 * A piece of ground inside modern borders that belonged to someone else at the
 * time, for example Alsace-Lorraine. Rings are rough lon/lat outlines; the map
 * clips each one to the modern polygons listed in `hosts`, so only the internal
 * edge has to be drawn.
 */
export interface RegionSeed {
  id: string;
  name: string;
  owner: string;
  hosts: string[];
  ring: [number, number][];
}

const GOV: Record<string, GovernmentType> = {
  AM: "absolute-monarchy", CM: "constitutional-monarchy", PR: "parliamentary-republic", SP: "semi-presidential-republic",
  PRES: "presidential-republic", OP: "one-party-state", MJ: "military-junta", FR: "federal-republic", TH: "theocracy",
  CONF: "confederation", PROT: "protectorate", MAND: "mandate-colony", DEP: "dependency", OCC: "occupied-territory", BRK: "breakaway-state",
};

function person(field: string): { title?: string; name: string } {
  const i = field.indexOf(":");
  return i < 0 ? { name: field } : { title: field.slice(0, i), name: field.slice(i + 1) };
}

/**
 * Parses one table.
 *   ID|Name|GOV|ideology|bloc|popM|gdpB|Title:Head of state|Title:Head of government|LANDS|overlord:status|Ruling party
 * Trailing fields may be left out. `LANDS` defaults to the polity's own id; "-"
 * means it holds no whole modern territory, only regions.
 */
export function table(raw: string): PolitySeed[] {
  return raw.trim().split("\n").filter((l) => l.trim() && !l.startsWith("#")).map((line) => {
    const f = line.split("|").map((x) => x.trim());
    const hos = person(f[7] ?? "");
    const hog = f[8] && f[8] !== "-" ? person(f[8]) : undefined;
    const [overlord, statusRaw] = (f[10] ?? "").split(":");
    return {
      id: f[0],
      name: f[1],
      government: GOV[f[2]] ?? "dependency",
      ideology: Number(f[3] || 0),
      bloc: (f[4] || "none") as Bloc,
      popM: f[5] ? Number(f[5]) : undefined,
      gdpB: f[6] ? Number(f[6]) : undefined,
      hosTitle: hos.title,
      hos: hos.name,
      hogTitle: hog?.title,
      hog: hog?.name,
      lands: !f[9] ? [f[0]] : f[9] === "-" ? [] : f[9].split(/\s+/),
      overlord: overlord || undefined,
      status: (statusRaw || undefined) as DependencyStatus | undefined,
      rulingParty: f[11] || undefined,
    };
  });
}

export interface HistoricalScenario {
  year: number;
  polities: PolitySeed[];
  regions: RegionSeed[];
}
