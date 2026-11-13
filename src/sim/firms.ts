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

const NAMES = ["Atlas", "Meridian", "Crescent", "Northfield", "Vanguard", "Kestrel", "Pioneer", "Sunrise", "Highland", "Riverton", "Bastion", "Larkfield", "Ostrava", "Cobalt", "Ellsworth"];

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
  const base = opts.name ?? `${NAMES[Math.floor(rnd.float(0, NAMES.length)) % NAMES.length]} ${SECTORS[sector].label}`;
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
  for (const c of Object.values(world.countries)) {
    if (c.annexedBy || c.overlord) continue;
    const count = Object.values(world.companies).filter((co) => co.country === c.id).length;
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
