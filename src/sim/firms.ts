import type { Company, SectorId, World } from "../shared/types";
import { SECTORS } from "../data/economy";
import { materialiseCompany } from "./bootstrap";
import { clamp01, type Rng } from "./rng";

/**
 * The firm economy.
 *
 * Companies are not all planted by the scenario: where the local conditions are
 * right, the population starts small ones on its own. The treasury can sponsor a
 * firm too, paying for a stake and getting a say in what it produces.
 */

/** What each industry buys from upstream, as a share of its revenue. */
export const SUPPLY: Partial<Record<SectorId, { input: SectorId; ratio: number }[]>> = {
  manufacturing: [{ input: "mining", ratio: 0.3 }, { input: "agriculture", ratio: 0.15 }, { input: "energy", ratio: 0.1 }],
  construction: [{ input: "mining", ratio: 0.3 }, { input: "manufacturing", ratio: 0.15 }],
  energy: [{ input: "mining", ratio: 0.5 }],
  utilities: [{ input: "energy", ratio: 0.3 }, { input: "manufacturing", ratio: 0.05 }],
  transport: [{ input: "energy", ratio: 0.25 }, { input: "manufacturing", ratio: 0.1 }],
  retail: [{ input: "manufacturing", ratio: 0.4 }, { input: "agriculture", ratio: 0.2 }, { input: "transport", ratio: 0.05 }],
  technology: [{ input: "manufacturing", ratio: 0.25 }],
  healthcare: [{ input: "manufacturing", ratio: 0.1 }],
  media: [{ input: "manufacturing", ratio: 0.05 }],
  defence: [{ input: "mining", ratio: 0.2 }, { input: "manufacturing", ratio: 0.2 }],
  telecom: [{ input: "manufacturing", ratio: 0.15 }],
  tourism: [{ input: "transport", ratio: 0.1 }],
};

const PREFIX: Record<string, string[]> = {
  early: ["Bessemer", "Whitworth", "Arkwright", "Lowell", "Hanseatic", "Lombard", "Corn Exchange"],
  victorian: ["North Western", "Imperial", "Consolidated", "Midland", "Clyde", "Victoria", "Union"],
  interwar: ["Vulcan", "Atlas", "Reichs", "Societe Generale", "United", "Meridian", "Continental"],
  postwar: ["National", "Federated", "General", "Associated", "Central", "Continental"],
  modern: ["Atlas", "Meridian", "Crescent", "Northfield", "Vanguard", "Kestrel", "Pioneer", "Highland", "Riverton", "Bastion"],
};

const SUFFIX: Partial<Record<SectorId, string>> = {
  mining: "Collieries", manufacturing: "Ironworks", retail: "Traders", transport: "Shipping",
  finance: "Bank", energy: "Power", utilities: "Gas & Water", construction: "Builders",
  agriculture: "Estates", technology: "Electric", media: "Press", defence: "Armaments",
  healthcare: "Chemicals", tourism: "Hotels", telecom: "Telegraph", "real-estate": "Properties",
  education: "Institute",
};

function eraOf(year: number): string {
  if (year < 1860) return "early";
  if (year < 1914) return "victorian";
  if (year < 1945) return "interwar";
  if (year < 1980) return "postwar";
  return "modern";
}

/** Companies grouped by home country, so a weekly pass is O(firms), not O(firms x countries). */
export function indexCompanies(world: World): Map<string, Company[]> {
  const out = new Map<string, Company[]>();
  for (const co of Object.values(world.companies)) {
    const list = out.get(co.country);
    if (list) list.push(co);
    else out.set(co.country, [co]);
  }
  return out;
}

/** Create one company in a country, optionally state-owned. */
export function foundCompany(
  world: World,
  countryId: string,
  sector: SectorId,
  rnd: Rng,
  opts: { stateShare?: number; revenue?: number; name?: string } = {},
): Company | null {
  const c = world.countries[countryId];
  if (!c || !SECTORS[sector]) return null;
  const pool = PREFIX[eraOf(world.startDate.year)] ?? PREFIX.modern;
  const base = opts.name ?? `${pool[Math.floor(rnd.float(0, pool.length)) % pool.length]} ${SUFFIX[sector] ?? SECTORS[sector].label}`;
  let name = base;
  for (let n = 2; Object.values(world.companies).some((co) => co.name === name); n += 1) name = `${base} ${n}`;
  const co = materialiseCompany(
    {
      name,
      country: c.id,
      sector,
      revenue: opts.revenue ?? Math.max(1e6, c.economy.gdp * 0.0008),
      employees: Math.max(50, Math.round(c.economy.population * 200)),
      stateOwnership: opts.stateShare ?? 0,
      listed: false,
      foundedYear: world.startDate.year,
    },
    world,
    rnd,
    { year: world.startDate.year },
  );
  co.founded = world.t;
  world.companies[co.id] = co;
  return co;
}

/** Small companies the population starts on its own, where conditions allow. */
export function stepFoundings(world: World, rnd: Rng): void {
  const rate = clamp01(world.params.firmFormation ?? 0.03);
  const byCountry = indexCompanies(world);
  for (const c of Object.values(world.countries)) {
    if (c.annexedBy || c.overlord) continue;
    const count = byCountry.get(c.id)?.length ?? 0;
    if (count >= 30) continue;
    const unemployment = c.economy.labour.unemployment;
    // New firms appear where there is growth and spare labour, not in a slump.
    const conditions = clamp01(0.45 + c.economy.gdpGrowth * 6 - Math.max(0, unemployment - 0.06) * 3);
    if (!rnd.chance(rate * conditions * (world.params.eventRate ?? 1))) continue;
    const slack = c.economy.sectors.filter((s) => s.id !== "defence" && s.capacity > s.output);
    if (!slack.length) continue;
    const pick = rnd.weighted(slack, (s) => Math.max(0.05, s.capacity - s.output));
    foundCompany(world, c.id, pick.id, rnd);
  }
}
