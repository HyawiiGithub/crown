import type {
  BudgetPlan,
  Character,
  CharacterRole,
  Company,
  Country,
  EconomyState,
  Exchange,
  GovernmentType,
  HouseholdGroup,
  Legislature,
  LegislatureChamberConfig,
  MilitaryState,
  Party,
  PolicyArea,
  Scenario,
  SectorId,
  SectorState,
  TaxPolicy,
  Treaty,
  War,
  World,
} from "../shared/types";
import { SECTOR_IDS } from "../shared/types";
import { COUNTRY_BY_ISO3, EXTRA_LANDS, GOVERNMENT_TITLES, NAMED_FEATURES, TERRITORY_OWNER, COUNTRIES, colourForCountry } from "../data/countries";
import { ARCHETYPES, COMMODITY_BASE, EXCHANGES, SECTORS } from "../data/economy";
import { companiesForYear } from "../data/companies";
import { FRONT_GEO, TREATIES_BY_YEAR, WARS_BY_YEAR } from "../data/wars";
import { ERA, HISTORY, MACRO_SEEDS, MILITARY_SEEDS, POLITICS, TRADE_BALANCE, type EraSettings, type PolitySeed } from "../data/history";
import { Rng, clamp, clamp01 } from "./rng";

const MINISTRIES: PolicyArea[] = ["economy", "tax", "welfare", "health", "education", "environment", "defence", "immigration", "foreign-policy", "justice", "technology", "housing", "energy", "transport", "agriculture", "labour"];

const MINISTER_TITLES: Record<PolicyArea, string> = {
  economy: "Finance Minister", tax: "Minister for Taxation", welfare: "Minister for Social Welfare", health: "Minister of Health",
  education: "Minister of Education", environment: "Minister of the Environment", defence: "Minister of Defence", immigration: "Minister for Immigration",
  "foreign-policy": "Foreign Minister", justice: "Minister of Justice", technology: "Minister for Technology", housing: "Minister for Housing",
  energy: "Minister of Energy", transport: "Minister of Transport", agriculture: "Minister of Agriculture", labour: "Minister of Labour",
};

const DEMOCRATIC: GovernmentType[] = ["constitutional-monarchy", "parliamentary-republic", "semi-presidential-republic", "presidential-republic", "federal-republic"];
const DECREE: GovernmentType[] = ["absolute-monarchy", "one-party-state", "military-junta", "theocracy", "occupied-territory", "monarchy-absolute-colonial", "dependency", "protectorate", "mandate-colony"];

/** Governments that can hold competitive national elections. */
export function isDemocratic(gov: GovernmentType): boolean {
  return DEMOCRATIC.includes(gov);
}

/** Governments whose leader can change the law by decree. */
export function rulesByDecree(gov: GovernmentType): boolean {
  return DECREE.includes(gov);
}

/** Headline budget deficit at the scenario date, fraction of GDP. */
const OPENING_DEFICIT: Record<number, Record<string, number>> = {
  1950: { USA: 0.01, GBR: -0.03 },
  1990: { USA: 0.04, ITA: 0.11, JPN: -0.02, DEU: 0.02, FRA: 0.02, GBR: 0, USS: 0.06 },
  2010: { USA: 0.11, GBR: 0.1, JPN: 0.08, FRA: 0.07, GRC: 0.15, ESP: 0.1, IRL: 0.14, PRT: 0.1, ITA: 0.05, DEU: 0.04, CHN: 0.02, IND: 0.08, RUS: 0.04, BRA: 0.03 },
  2020: { USA: 0.06, GBR: 0.03, JPN: 0.03, FRA: 0.03, ITA: 0.02, DEU: -0.01, CHN: 0.05, IND: 0.07 },
  2026: { USA: 0.06, GBR: 0.045, JPN: 0.025, FRA: 0.055, ITA: 0.03, DEU: 0.025, CHN: 0.07, IND: 0.08, BRA: 0.08, RUS: 0.03, UKR: 0.2 },
};

/** The next US presidential election after each scenario's start. */
const US_PRESIDENTIAL: Record<number, number> = { 1900: 1900, 1914: 1916, 1930: 1932, 1950: 1952, 1990: 1992, 2010: 2012, 2020: 2020, 2026: 2028 };

const CURRENCY: Record<string, string> = {
  USA: "USD", GBR: "GBP", FRA: "FRF", DEU: "DEM", JPN: "JPY", CHN: "CNY", RUS: "RUB", USS: "SUR", IND: "INR", BRA: "BRL", CAN: "CAD", AUS: "AUD", MEX: "MXN", KOR: "KRW", ITA: "ITL", ESP: "ESP", ARG: "ARS", CHE: "CHF", ZAF: "ZAR", TUR: "TRY", SAU: "SAR", IDN: "IDR", SWE: "SEK", NOR: "NOK", DNK: "DKK", NLD: "NLG", OTT: "TRL", AUT: "ATK",
};

const EURO_2010 = new Set("AUT BEL CYP FIN FRA DEU GRC IRL ITA LUX MLT NLD PRT SVK SVN ESP".split(" "));
const EURO_2026 = new Set([...EURO_2010, "EST", "LVA", "LTU", "HRV"]);
const INDEPENDENT_CB = new Set("USA GBR DEU JPN CHE CAN AUS NZL SWE NOR DNK KOR CHL ISR MEX BRA IND ZAF POL CZE HUN".split(" "));

/** Resource exporters, once oil became the prize. */
const OIL_STATES = new Set("SAU ARE KWT QAT BHR OMN IRQ IRN".split(" "));
const RESOURCE_STATES = new Set("RUS NGA DZA AGO VEN KAZ AZE NOR GAB TKM MNG BOL CHL PER ZMB ZWE LBY GNQ COG TTO BRN".split(" "));

/** Who rules each map feature in a given scenario. Claims first, then long-standing owners. */
export function resolveControl(polities: PolitySeed[]): Record<string, string> {
  const claimedBy = new Map<string, string>();
  for (const p of polities) for (const land of p.lands) claimedBy.set(land, p.id);
  const ABSORBED: Record<string, string> = { ERI: "ETH", SSD: "SDN", HKG: "CHN", PRI: "USA", PAN: "COL", TLS: "IDN", XKX: "SRB" };

  const landOwner = (land: string, depth = 0): string | undefined => {
    const direct = claimedBy.get(land);
    if (direct) return direct;
    if (depth > 3) return undefined;
    const fallback = ABSORBED[land] ?? TERRITORY_OWNER[land];
    return fallback ? landOwner(fallback, depth + 1) : undefined;
  };

  const control: Record<string, string> = {};
  for (const c of COUNTRIES) {
    const owner = landOwner(c.iso3);
    if (owner) control[c.numeric] = owner;
  }
  for (const key of Object.keys(TERRITORY_OWNER)) {
    if (/^\d{3}$/.test(key)) {
      const owner = landOwner(TERRITORY_OWNER[key]);
      if (owner) control[key] = owner;
    }
  }
  for (const [name, land] of Object.entries(NAMED_FEATURES)) {
    const owner = landOwner(land);
    if (owner) control[name] = owner;
  }
  control["Siachen Glacier"] = landOwner("IND") ?? "";
  control["Indian Ocean Ter."] = landOwner("AUS") ?? "";
  control["732"] = landOwner("ESH") ?? "";
  return control;
}

// ===========================================================================
// Figures
// ===========================================================================

const YEAR_INDEX: Record<number, number> = { 1990: 0, 2010: 1, 2020: 2, 2026: 3 };

/** Rough share of a territory's 1990 population present in an earlier year. */
function earlyPopFactor(year: number, region: string): number {
  const t: Record<number, Record<string, number>> = {
    1900: { africa: 0.2, americas: 0.22, asia: 0.28, europe: 0.6, "middle-east": 0.18, oceania: 0.25 },
    1914: { africa: 0.23, americas: 0.28, asia: 0.31, europe: 0.66, "middle-east": 0.2, oceania: 0.3 },
    1930: { africa: 0.26, americas: 0.34, asia: 0.36, europe: 0.72, "middle-east": 0.22, oceania: 0.36 },
    1950: { africa: 0.36, americas: 0.47, asia: 0.46, europe: 0.78, "middle-east": 0.32, oceania: 0.5 },
  };
  return t[year]?.[region] ?? 1;
}

function landFigures(land: string, year: number): { pop: number; gdp: number } {
  const idx = YEAR_INDEX[year];
  const row = COUNTRY_BY_ISO3[land];
  const extra = EXTRA_LANDS[land];
  if (idx !== undefined) {
    if (row) return { pop: row.pop[idx], gdp: row.gdp[idx] };
    if (extra) return { pop: extra.pop[idx], gdp: extra.gdp[idx] };
    return { pop: 0, gdp: 0 };
  }
  const pop = (row?.pop[0] ?? extra?.pop[0] ?? 0) * earlyPopFactor(year, row?.region ?? "europe");
  const incomeBase = ERA[year].frontierPc * 0.12;
  return { pop, gdp: (pop * incomeBase) / 1000 };
}

function polityFigures(p: PolitySeed, year: number): { pop: number; gdp: number } {
  let pop = p.popM;
  let gdp = p.gdpB;
  if (pop === undefined || gdp === undefined) {
    let lp = 0;
    let lg = 0;
    for (const land of p.lands) {
      const f = landFigures(land, year);
      lp += f.pop;
      lg += f.gdp;
    }
    pop ??= lp;
    gdp ??= lg;
  }
  return { pop: Math.max(0.001, pop), gdp: Math.max(0.0005, gdp) };
}

function polityGeo(p: PolitySeed, world: { regions: { owner: string; ring: [number, number][] }[] }): { lat: number; lon: number } {
  for (const land of p.lands) {
    const r = COUNTRY_BY_ISO3[land] ?? EXTRA_LANDS[land];
    if (r) return { lat: r.lat, lon: r.lon };
  }
  const reg = world.regions.find((x) => x.owner === p.id);
  if (reg) {
    const lon = reg.ring.reduce((a, q) => a + q[0], 0) / reg.ring.length;
    const lat = reg.ring.reduce((a, q) => a + q[1], 0) / reg.ring.length;
    return { lat, lon };
  }
  return { lat: 0, lon: 0 };
}

// ===========================================================================
// Economy construction
// ===========================================================================

function pickArchetype(iso: string, norm: number, gov: GovernmentType, year: number): string {
  if (year >= 1950 && OIL_STATES.has(iso)) return "oilstate";
  if (year >= 1950 && RESOURCE_STATES.has(iso)) return "resource";
  if (["LUX", "SGP", "HKG", "IRL", "CYP", "PAN", "MUS"].includes(iso) && year >= 1990) return "taxhaven";
  if (["MCO", "SMR", "VAT", "LIE", "AND", "BRB"].includes(iso)) return "sanctuary";
  if (gov === "one-party-state" && norm < 0.35 && year >= 1930) return year >= 1990 ? "command" : "planned";
  if (gov === "one-party-state") return "planned";
  if (norm > 0.72) return year < 1950 ? "industrial" : year < 1990 ? "industrial" : "postindustrial";
  if (norm > 0.45) return year < 1950 ? "industrial" : "service";
  if (norm > 0.18) return year < 1950 ? "mixed" : "mixed";
  if (norm > 0.08) return year < 1950 ? "agrarian" : "industrial";
  return "agrarian";
}

const CONCENTRATION: Record<SectorId, number> = {
  agriculture: 0.05, mining: 0.45, manufacturing: 0.3, energy: 0.55, utilities: 0.7, construction: 0.12, transport: 0.35, retail: 0.2, finance: 0.45, "real-estate": 0.08, telecom: 0.75, technology: 0.6, healthcare: 0.3, education: 0.1, defence: 0.7, tourism: 0.1, media: 0.4,
};

function buildSectors(archetype: { mix: Partial<Record<SectorId, number>>; stateOwnership: number }, era: EraSettings, gdp: number, labour: number, rnd: Rng): SectorState[] {
  const weights: Record<string, number> = {};
  for (const id of SECTOR_IDS) {
    const base = archetype.mix[id] ?? 0.004;
    weights[id] = base * (era.sectorWeights[id] ?? 1) * rnd.float(0.9, 1.1);
  }
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const rawJobs: Record<string, number> = {};
  let jobWeight = 0;
  for (const id of SECTOR_IDS) {
    const share = weights[id] / total;
    rawJobs[id] = share * SECTORS[id].labourIntensity;
    jobWeight += rawJobs[id];
  }
  return SECTOR_IDS.map((id): SectorState => {
    const share = weights[id] / total;
    const output = gdp * share;
    const employment = Math.round((labour * rawJobs[id]) / jobWeight);
    const p = SECTORS[id];
    return {
      id,
      share,
      growth: p.growth * 0.6,
      productivity: employment > 0 ? output / employment : 0,
      employment,
      stateSubsidy: 0,
      stateOwnership: id === "utilities" || id === "education" ? Math.max(archetype.stateOwnership, 0.4) : archetype.stateOwnership,
      output,
      quantity: output,
      capacity: output * 1.02,
      price: 1,
      wage: employment > 0 ? (output * 0.58) / employment : 0,
      margin: p.margin,
      concentration: CONCENTRATION[id],
      regulation: 0.3,
    };
  });
}

const HOUSEHOLD_LABELS: Record<HouseholdGroup["id"], string> = { working: "Working households", middle: "Middle class", wealthy: "Wealthy households" };

export function incomeShares(g: number): Record<HouseholdGroup["id"], number> {
  const working = clamp(0.3 - (g - 0.35) * 0.55, 0.06, 0.38);
  const wealthy = clamp(0.28 + (g - 0.35) * 0.95, 0.15, 0.72);
  return { working, middle: Math.max(0.1, 1 - working - wealthy), wealthy };
}

function buildHouseholds(gini: number, gdpPc: number): HouseholdGroup[] {
  const shares = incomeShares(gini);
  const pops: Record<HouseholdGroup["id"], number> = { working: 0.5, middle: 0.4, wealthy: 0.1 };
  const savings: Record<HouseholdGroup["id"], number> = { working: 0.02, middle: 0.1, wealthy: 0.3 };
  return (["working", "middle", "wealthy"] as const).map((id): HouseholdGroup => {
    const income = (gdpPc * 0.7 * shares[id]) / pops[id];
    return { id, label: HOUSEHOLD_LABELS[id], popShare: pops[id], incomeShare: shares[id], income, realIncome: income, costOfLiving: 1, savingsRate: savings[id], satisfaction: 0.55 };
  });
}

/** Income the current tax rates raise, in the same terms the engine uses each week. */
export function taxCollected(tax: TaxPolicy, nominal: number, consumption: number, imports: number, resourceOutput: number, corruption: number): { income: number; payroll: number; corporate: number; vat: number; tariff: number; royalty: number } {
  const labour = nominal * 0.55;
  const profit = nominal * 0.28;
  const compliance = (rate: number) => clamp(1 - corruption * 0.5 - Math.max(0, rate - 0.45) * 0.7, 0.2, 1);
  return {
    income: tax.income * labour * 0.8 * compliance(tax.income),
    payroll: tax.payroll * labour * compliance(tax.payroll),
    corporate: tax.corporate * profit * 0.75 * compliance(tax.corporate),
    vat: tax.vat * consumption * 0.8 * compliance(tax.vat),
    tariff: tax.tariff * imports * 0.85,
    royalty: tax.royalty * resourceOutput,
  };
}

function buildEconomy(iso: string, p: PolitySeed, year: number, era: EraSettings, popM: number, gdpB: number, rnd: Rng): EconomyState {
  const population = popM * 1e6;
  const gdp = gdpB * 1e9;
  const gdpPc = gdp / population;
  const norm = clamp(gdpPc / era.frontierPc, 0.005, 1.6);
  const seed = MACRO_SEEDS[year]?.[iso];
  const archetype = ARCHETYPES[pickArchetype(iso, norm, p.government, year)] ?? ARCHETYPES.mixed;

  const dependent = Boolean(p.overlord);
  const participation = clamp(0.42 + norm * 0.12 + (year >= 1990 ? 0.04 : 0), 0.38, 0.62);
  const unemployment = seed ? seed[3] : clamp(era.unemployment * (norm < 0.2 ? 1.2 : 1) * rnd.float(0.8, 1.2), 0.015, 0.25);
  const labourForce = population * participation;
  const employed = labourForce * (1 - unemployment);

  const sectors = buildSectors(archetype, era, gdp, employed, rnd);
  const corruption = clamp((1 - Math.min(1, norm)) * 0.55 + rnd.float(-0.08, 0.08) + (dependent ? 0.1 : 0), 0.04, 0.85);
  const inequality = clamp(0.32 + (1 - Math.min(1, norm)) * 0.14 + (year < 1950 ? 0.1 : 0) + (p.government === "one-party-state" ? -0.06 : 0) + rnd.float(-0.04, 0.04), 0.22, 0.72);

  // Government size: rich states tax more; colonies and small monarchies far less.
  const revenueShare = clamp(era.revenueShare * (0.55 + 0.75 * Math.sqrt(Math.min(1, norm))) * (dependent ? 0.55 : 1) * (archetype.stateOwnership > 0.6 ? 1.25 : 1), 0.03, 0.55);
  const debtShare = seed ? seed[0] : clamp(era.debt * (0.5 + 0.8 * Math.min(1, norm)) * rnd.float(0.7, 1.3) * (dependent ? 0.4 : 1), 0.02, 2);
  const inflation = seed ? seed[2] : era.inflation + rnd.float(-0.008, 0.012) + (norm < 0.2 && year >= 1950 ? 0.03 : 0);
  const rate = seed ? seed[1] : Math.max(0, era.rate + (norm < 0.25 ? 0.03 : 0) + rnd.float(-0.005, 0.005));
  const growth = seed ? seed[4] : era.frontierGrowth + (1 - Math.min(1, norm)) * 0.012 + rnd.float(-0.01, 0.01);

  const openness = clamp(era.openness * (archetype.openness / 0.5) * (popM > 200 ? 0.6 : popM < 5 ? 1.5 : 1) * rnd.float(0.9, 1.1), 0.04, 1.6);
  const structuralTradeBalance = year >= 1950 ? TRADE_BALANCE[iso] ?? (norm < 0.2 ? -0.03 : 0) : 0;
  const exports = (gdp * (openness + structuralTradeBalance)) / 2;
  const imports = (gdp * (openness - structuralTradeBalance)) / 2;

  // National accounts at start.
  const interest = debtShare * gdp * (rate * 0.4 + era.rate * 0.6 + (norm < 0.25 ? 0.015 : 0));
  const openingDeficit = dependent ? 0 : OPENING_DEFICIT[year]?.[iso] ?? (year >= 2010 ? 0.03 : year >= 1950 ? 0.015 : 0.005);
  const spendNonInterest = Math.max(gdp * 0.025, revenueShare * gdp - interest + gdp * openingDeficit);
  const budgetSplit = { ...era.split };
  if (p.government === "one-party-state" || p.government === "military-junta") { budgetSplit.defence *= 1.6; budgetSplit.welfare *= 0.8; }
  if (dependent) { budgetSplit.defence *= 0.5; budgetSplit.administration *= 1.5; }
  const splitTotal = Object.values(budgetSplit).reduce((a, b) => a + b, 0);
  const budget = Object.fromEntries(Object.entries(budgetSplit).map(([k, v]) => [k, ((v / splitTotal) * spendNonInterest) / gdp])) as unknown as BudgetPlan;

  const government = gdp * (budget.defence + budget.health + budget.education + budget.infrastructure + budget.science + budget.administration);
  const investment = gdp * clamp(0.14 + norm * 0.06 + growth * 1.2 + (p.government === "one-party-state" ? 0.08 : 0), 0.06, 0.42);
  const consumption = Math.max(gdp * 0.3, gdp - investment - government - exports + imports);

  // Rate structure by era, then scaled so the tax system raises the intended revenue.
  const baseTax: TaxPolicy = year < 1930
    ? { income: 0.02, corporate: 0.02, vat: 0.07, payroll: 0, tariff: 0.2, royalty: 0.1 }
    : year < 1990
    ? { income: year < 1950 ? 0.06 : 0.16, corporate: year < 1950 ? 0.1 : 0.32, vat: 0.07, payroll: year < 1950 ? 0.01 : 0.05, tariff: 0.15, royalty: 0.15 }
    : { income: 0.2, corporate: 0.24, vat: 0.14, payroll: 0.11, tariff: year === 1990 ? 0.08 : 0.04, royalty: 0.2 };
  const resourceOutput = sectors.filter((s) => s.id === "mining").reduce((a, s) => a + s.output, 0);
  const raised = taxCollected(baseTax, gdp, consumption, imports, resourceOutput, corruption);
  const totalRaised = Object.values(raised).reduce((a, b) => a + b, 0);
  const k = clamp((revenueShare * gdp) / Math.max(1, totalRaised), 0.15, 2.4);
  const tax: TaxPolicy = {
    income: clamp(baseTax.income * k, 0, 0.7),
    corporate: clamp(baseTax.corporate * k, 0, 0.6),
    vat: clamp(baseTax.vat * k, 0, 0.3),
    payroll: clamp(baseTax.payroll * k, 0, 0.35),
    tariff: clamp(baseTax.tariff * (k * 0.5 + 0.5), 0, 0.6),
    royalty: clamp(baseTax.royalty * k, 0, 0.7),
  };

  const regime = year < 1950 ? (year === 1930 && ["USS"].includes(iso) ? "command" : "gold")
    : year >= 2010 && (year >= 2026 ? EURO_2026 : EURO_2010).has(iso) ? "union"
    : archetype.stateOwnership > 0.75 ? "command"
    : OIL_STATES.has(iso) || ["HKG", "PAN", "ECU", "SLV", "BHS", "BRB"].includes(iso) ? "peg"
    : year === 1950 && iso !== "USA" ? "peg"
    : "float";

  const debtCost = rate * 0.4 + era.rate * 0.6 + (norm < 0.25 ? 0.015 : 0);

  return {
    gdp,
    gdpPerCapita: gdpPc,
    gdpGrowth: growth,
    nominalGrowth: (1 + growth) * (1 + inflation) - 1,
    population,
    productivity: clamp(norm * 80, 4, 100),
    debtRatingScore: clamp(80 - debtShare * 22 - corruption * 40, 3, 99),
    fiscal: {
      revenue: revenueShare * gdp, taxIncome: raised.income * k, corporateTax: raised.corporate * k, vat: raised.vat * k, tariffs: raised.tariff * k, resourceRent: raised.royalty * k,
      expenditure: spendNonInterest + interest, military: budget.defence * gdp, welfare: budget.welfare * gdp, infrastructure: budget.infrastructure * gdp, education: budget.education * gdp, healthcare: budget.health * gdp, administration: budget.administration * gdp, debtService: interest,
      debt: debtShare * gdp, debtToGdp: debtShare, creditRating: clamp(0.82 - debtShare * 0.2 - corruption * 0.5, 0.05, 0.98), budgetBalanceRatio: (revenueShare * gdp - spendNonInterest - interest) / gdp, treasury: gdp * 0.02,
    },
    monetary: { policyRate: rate, moneySupply: 1, inflation, reserveRatio: 0.08, centralBankRate: rate, exchangeRateVsUsd: 1, currencyConfidence: clamp(70 - inflation * 200 - corruption * 25, 5, 95) },
    labour: { unemployment, participation, unionisation: clamp(archetype.unionisation * (year < 1930 ? 0.3 : year < 1990 ? 1.1 : 0.7), 0.02, 0.9), medianWage: gdpPc * 0.74, wageGrowth: growth + inflation, strikeRisk: 0.05, satisfaction: 0.55 },
    trade: { exports, imports, tradeBalance: exports - imports, exportPartners: [], importPartners: [], tradeOpenness: openness * 100, tariffRate: tax.tariff, flows: {} },
    sectors,
    history: [],
    corruption,
    inequality,
    netForeignAssets: gdp * (structuralTradeBalance * 4 + rnd.float(-0.1, 0.1)),
    reserves: gdp * clamp(0.04 + Math.abs(structuralTradeBalance) * (structuralTradeBalance > 0 ? 3 : 0) + rnd.float(0, 0.04), 0.01, 0.6),
    rd: gdp * budget.science * 2,
    macro: {
      potential: gdp * (1 - clamp(growth < 0 ? growth : 0, -0.1, 0)),
      realGdp: gdp,
      priceLevel: 1,
      outputGap: clamp(growth < 0 ? growth : 0, -0.1, 0),
      capital: gdp * clamp(1.6 + norm, 1.2, 3.2),
      tfpGrowth: 0,
      potentialGrowth: 0,
      expectedInflation: clamp(inflation, -0.03, 1),
      nairu: clamp(unemployment - (growth < 0 ? 0.015 : 0), 0.015, 0.28),
      consumerConfidence: 50,
      businessConfidence: 50,
      neutralRate: 0.01,
      bondYield: Math.max(rate, era.rate) + 0.01,
      riskPremium: 0.01,
      debtCost,
      credit: era.credit * clamp(0.4 + norm, 0.3, 1.7),
      npl: 0.03,
      housePrice: 100,
      currentAccount: exports - imports,
      realExchange: 0,
      openness,
      structuralTradeBalance,
      deficitAnchor: (spendNonInterest + interest - revenueShare * gdp) / gdp,
      shock: 0,
      shockDecay: 1,
      minimumWage: year < 1950 ? 0 : clamp(0.3 + rnd.float(0, 0.2), 0, 0.6),
      popGrowth: era.popGrowth.poor + (era.popGrowth.rich - era.popGrowth.poor) * Math.min(1, norm),
      baseBudget: { ...budget },
      realHistory: [],
      priceHistory: [],
    },
    tax,
    budget,
    centralBank: {
      independent: year >= 1990 ? INDEPENDENT_CB.has(iso) || (year >= 2010 && (year >= 2026 ? EURO_2026 : EURO_2010).has(iso)) : ["USA", "GBR", "DEU", "CHE"].includes(iso) && year >= 1914,
      regime: regime as EconomyState["centralBank"]["regime"],
      target: era.target,
      credibility: clamp(0.85 - corruption * 0.8 - Math.max(0, inflation - 0.1), 0.05, 0.95),
      qe: year === 2020 ? 0.15 : year === 2026 ? 0.2 : year === 2010 ? 0.1 : 0,
      printing: 0,
      currency: regime === "union" ? "EUR" : CURRENCY[iso] ?? "LCU",
    },
    accounts: { consumption, investment, government, exports, imports },
    households: buildHouseholds(inequality, gdpPc),
  };
}

function buildMilitary(iso: string, gov: GovernmentType, year: number, popM: number, gdp: number, budgetShare: number, rnd: Rng): MilitaryState {
  const seed = MILITARY_SEEDS[year]?.[iso];
  const active = seed?.active ? seed.active * 1000 : Math.round(popM * 1e6 * (gov === "one-party-state" || gov === "military-junta" ? 0.008 : 0.0045));
  const nukes = seed?.nukes ?? 0;
  const q = () => clamp(rnd.float(30, 80), 5, 100);
  const b = (n: number) => ({ active: Math.round(active * n), quality: q() });
  return {
    activeDuty: active,
    reserves: Math.round(active * rnd.float(0.8, 2.5)),
    spend: gdp * budgetShare,
    readiness: clamp(rnd.float(45, 85), 10, 100),
    doctrine: rnd.float(-30, 30),
    nuclearArsenal: nukes,
    branches: { army: b(0.68), navy: b(0.14), "air-force": b(year < 1930 ? 0 : 0.14), marines: b(0.02), space: b(year < 1990 ? 0 : 0.003), cyber: b(year < 2010 ? 0 : 0.005), nuclear: { active: nukes, quality: nukes ? clamp(rnd.float(60, 95), 10, 100) : 0 } },
    morale: rnd.float(50, 85),
    veterans: Math.round(active * rnd.float(0.2, 0.9)),
    conscription: year < 1990 ? true : rnd.chance(0.35),
    burden: budgetShare,
  };
}

// ===========================================================================
// Politics construction
// ===========================================================================

function chamberFor(p: PolitySeed, popM: number, detail: (typeof POLITICS)[number][string] | undefined, democratic: boolean): LegislatureChamberConfig | undefined {
  const dependent = Boolean(p.overlord);
  const seats = detail?.seats ?? clamp(Math.round(40 + Math.sqrt(popM) * 28), 30, 650);
  if (!democratic && !detail?.chamber) return undefined;
  if (dependent && !detail?.chamber && p.status !== "dominion") return undefined;
  return {
    id: "chamber-1",
    name: detail?.chamber ?? (p.government === "one-party-state" ? "People's Assembly" : "National Parliament"),
    kind: "lower",
    seats,
    districtSeats: seats,
    prSeats: 0,
    districtThreshold: 0,
    moneyBills: true,
    vetoOverride: false,
    termDays: Math.round((detail?.termYears ?? 4) * 365),
    election: democratic ? "fptp" : "none",
    confirmsAppointments: false,
  };
}

function hsl(colour: string, dl: number): string {
  const m = /hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/.exec(colour);
  if (!m) return colour;
  return `hsl(${m[1]} ${Math.max(14, Number(m[2]) - 10)}% ${clamp(Number(m[3]) + dl, 18, 82)}%)`;
}

/**
 * Colours players recognise from period maps, by scenario year. These win over
 * the modern defaults below, so 1900 reads like a 1900 atlas: British pink,
 * French blue, Habsburg yellow, Qing ochre, Weimar grey. Dependencies are tinted
 * from their overlord's colour afterwards, which is what gives an empire its
 * family of shades.
 */
const PERIOD_COLOURS: Record<number, Record<string, string>> = {
  1900: {
    GBR: "hsl(345 58% 54%)", FRA: "hsl(216 52% 48%)", DEU: "hsl(28 14% 44%)", RUS: "hsl(128 30% 38%)",
    AUT: "hsl(44 58% 56%)", OTT: "hsl(168 30% 36%)", ITA: "hsl(96 30% 44%)", ESP: "hsl(33 62% 50%)",
    PRT: "hsl(148 42% 36%)", NLD: "hsl(24 78% 52%)", BEL: "hsl(50 52% 44%)", USA: "hsl(212 48% 54%)",
    JPN: "hsl(352 56% 56%)", CHN: "hsl(42 68% 56%)", KOR: "hsl(222 24% 50%)", THA: "hsl(18 58% 46%)",
    IRN: "hsl(46 38% 46%)", AFG: "hsl(96 22% 40%)", ETH: "hsl(122 38% 34%)", MAR: "hsl(6 48% 44%)",
    SAR: "hsl(22 48% 40%)", OFS: "hsl(34 52% 54%)", MEX: "hsl(126 34% 38%)", BRA: "hsl(146 44% 40%)",
    ARG: "hsl(202 56% 58%)", CHL: "hsl(352 40% 48%)", PER: "hsl(348 36% 46%)", GRC: "hsl(196 44% 48%)",
    ROU: "hsl(36 44% 46%)", BGR: "hsl(88 26% 40%)", SRB: "hsl(348 44% 42%)", SWE: "hsl(206 40% 50%)",
    DNK: "hsl(354 42% 48%)", CHE: "hsl(0 40% 46%)", NPL: "hsl(355 46% 50%)", BTN: "hsl(28 38% 48%)",
  },
  1914: {
    GBR: "hsl(345 58% 54%)", FRA: "hsl(216 52% 48%)", DEU: "hsl(28 14% 44%)", RUS: "hsl(128 30% 38%)",
    AUT: "hsl(44 58% 56%)", OTT: "hsl(168 30% 36%)", ITA: "hsl(96 30% 44%)", ESP: "hsl(33 62% 50%)",
    PRT: "hsl(148 42% 36%)", NLD: "hsl(24 78% 52%)", BEL: "hsl(50 52% 44%)", USA: "hsl(212 48% 54%)",
    JPN: "hsl(352 56% 56%)", CHN: "hsl(42 64% 54%)", THA: "hsl(18 58% 46%)", IRN: "hsl(46 38% 46%)",
    AFG: "hsl(96 22% 40%)", ETH: "hsl(122 38% 34%)", MAR: "hsl(6 48% 44%)", SAU: "hsl(150 40% 34%)",
    NOR: "hsl(206 46% 54%)", SWE: "hsl(206 34% 50%)", DNK: "hsl(354 42% 48%)", CHE: "hsl(0 40% 46%)",
    TIB: "hsl(30 42% 54%)", MNG: "hsl(50 42% 46%)", SRB: "hsl(348 44% 42%)", ROU: "hsl(36 44% 46%)",
    BGR: "hsl(88 26% 40%)", GRC: "hsl(196 44% 48%)", ALB: "hsl(8 40% 40%)", MEX: "hsl(126 34% 38%)",
    BRA: "hsl(146 44% 40%)", ARG: "hsl(202 56% 58%)", CHL: "hsl(352 40% 48%)", NPL: "hsl(355 46% 50%)",
  },
  1930: {
    GBR: "hsl(345 56% 56%)", FRA: "hsl(216 50% 50%)", DEU: "hsl(28 10% 46%)", USS: "hsl(0 60% 40%)",
    ITA: "hsl(96 26% 44%)", AUT: "hsl(44 52% 52%)", HUN: "hsl(34 44% 46%)", CSK: "hsl(238 32% 46%)",
    POL: "hsl(345 42% 46%)", YUG: "hsl(202 28% 44%)", TUR: "hsl(354 44% 46%)", ESP: "hsl(33 58% 48%)",
    PRT: "hsl(148 40% 34%)", NLD: "hsl(24 74% 50%)", BEL: "hsl(50 50% 44%)", USA: "hsl(212 46% 54%)",
    JPN: "hsl(352 56% 56%)", CHN: "hsl(46 58% 52%)", SAU: "hsl(150 42% 34%)", IRN: "hsl(42 40% 46%)",
    AFG: "hsl(96 22% 40%)", ETH: "hsl(122 38% 34%)", EGY: "hsl(50 48% 54%)", IRQ: "hsl(45 52% 46%)",
    LEV: "hsl(210 40% 46%)", PLM: "hsl(190 34% 48%)", FIN: "hsl(206 40% 52%)", NOR: "hsl(206 34% 50%)",
    SWE: "hsl(206 30% 48%)", DNK: "hsl(354 42% 48%)", IRL: "hsl(140 44% 42%)", TIB: "hsl(30 42% 54%)",
    MNG: "hsl(50 42% 46%)", ROU: "hsl(36 44% 46%)", BGR: "hsl(88 26% 40%)", GRC: "hsl(196 44% 48%)",
    MEX: "hsl(126 34% 38%)", BRA: "hsl(146 44% 40%)", ARG: "hsl(202 56% 58%)", CHL: "hsl(352 40% 48%)",
  },
};

function eraColour(id: string, year: number): string | undefined {
  return PERIOD_COLOURS[year]?.[id] ?? POLITY_COLOURS[id];
}

/** Colours players recognise from period maps. */
const POLITY_COLOURS: Record<string, string> = {
  GBR: "hsl(350 62% 52%)", FRA: "hsl(218 58% 48%)", DEU: "hsl(30 18% 42%)", DDR: "hsl(4 48% 40%)", RUS: "hsl(135 32% 40%)", USS: "hsl(0 72% 42%)", AUT: "hsl(42 50% 50%)", OTT: "hsl(165 36% 34%)", ITA: "hsl(95 34% 42%)", USA: "hsl(208 54% 52%)", JPN: "hsl(355 54% 60%)", CHN: "hsl(358 72% 50%)", ESP: "hsl(28 66% 46%)", PRT: "hsl(150 44% 36%)", NLD: "hsl(24 80% 52%)", BEL: "hsl(52 56% 42%)", YUG: "hsl(204 30% 46%)", CSK: "hsl(250 30% 50%)", POL: "hsl(340 42% 62%)",
};

function buildParties(p: PolitySeed, democratic: boolean, chamber: LegislatureChamberConfig | undefined, year: number, rnd: Rng): Party[] {
  const detail = POLITICS[year]?.[p.id];
  const platform = (ideology: number): Record<PolicyArea, number> => Object.fromEntries(MINISTRIES.map((m) => [m, clamp(ideology + rnd.normal() * 12, -100, 100)])) as Record<PolicyArea, number>;
  const make = (i: number, name: string, abbr: string, ideology: number, colour: string, seats: number, ruling: boolean): Party => ({
    id: `${p.id}-party-${i}`,
    country: p.id,
    name,
    abbreviation: abbr,
    ideology,
    cohesion: rnd.float(55, 92),
    popularity: 30,
    color: colour,
    seats: chamber ? { [chamber.id]: seats } : {},
    treasury: 0,
    memberCount: 0,
    status: ruling ? (democratic ? "government" : "ruling") : "outside",
    platform: platform(ideology),
    founded: 0,
  });

  if (detail?.parties.length) {
    const seats = chamber?.seats ?? detail.parties.reduce((a, x) => a + x.seats, 0);
    const total = detail.parties.reduce((a, x) => a + x.seats, 0) || 1;
    const list = detail.parties.map((x, i) => {
      const party = make(i, x.name, x.abbr, x.ideology, x.colour, Math.round((x.seats / total) * seats), x.ruling);
      party.popularity = (x.seats / total) * 100;
      return party;
    });
    return list;
  }

  const rulingName = p.rulingParty;
  if (!democratic) {
    const label = rulingName ?? (p.government === "absolute-monarchy" ? "Royal Court" : p.government === "military-junta" ? "Armed Forces" : p.government === "theocracy" ? "Clerical Establishment" : p.overlord ? "Colonial Administration" : "Ruling Establishment");
    const party = make(0, label, abbr(label), p.ideology, "#7f1d1d", chamber?.seats ?? 0, true);
    party.popularity = 60;
    return [party];
  }
  const seats = chamber?.seats ?? 100;
  const gov = Math.round(seats * rnd.float(0.5, 0.64));
  const governing = make(0, rulingName ?? "Governing Bloc", abbr(rulingName ?? "Governing Bloc"), p.ideology, "#2563eb", gov, true);
  const opposition = make(1, "Opposition Bloc", "OPP", clamp(p.ideology + (p.ideology >= 0 ? -28 : 28), -100, 100), "#c0392b", seats - gov, false);
  governing.popularity = (gov / seats) * 100;
  opposition.popularity = 100 - governing.popularity;
  return [governing, opposition];
}

function abbr(name: string): string {
  const words = name.replace(/[^A-Za-z\s]/g, "").split(/\s+/).filter((w) => w.length > 2 || /^[A-Z]+$/.test(w));
  if (!words.length) return "GOV";
  if (words.length === 1) return words[0].slice(0, 4).toUpperCase();
  return words.slice(0, 4).map((w) => w[0].toUpperCase()).join("");
}

function statsFor(rnd: Rng, ideology: number, boost = 0) {
  return {
    competence: Math.round(clamp(rnd.normal() * 20 + 25 + boost, -100, 100)),
    charisma: Math.round(clamp(rnd.normal() * 24 + 15 + boost, -100, 100)),
    integrity: Math.round(clamp(rnd.normal() * 28, -100, 100)),
    ambition: Math.round(clamp(rnd.normal() * 24 + 30, -100, 100)),
    ideology: Math.round(clamp(ideology + rnd.normal() * 8, -100, 100)),
    popularity: Math.round(clamp(rnd.normal() * 18 + 48, 0, 100)),
    experience: Math.round(clamp(rnd.normal() * 18 + 62, 0, 100)),
    militancy: Math.round(clamp(rnd.normal() * 24, -100, 100)),
  };
}

/** A polity spawned from the developer console, using the scenario's era settings. */
export function spawnPolity(world: World, id: string, name: string): { country: Country; characters: Character[] } {
  const scenarioYear = world.startDate.year;
  const seed: PolitySeed = { id, name, government: "parliamentary-republic", ideology: 0, bloc: "none", popM: 10, gdpB: (10 * ERA[scenarioYear].frontierPc * 0.4) / 1000, hos: "Interim President", hog: "Interim Prime Minister", lands: [] };
  const chars: Character[] = [];
  const scenario = { year: scenarioYear, startDate: world.startDate } as Scenario;
  return { country: buildCountry(seed, scenario, ERA[scenarioYear], new Rng(world.seed ^ id.length), chars, world), characters: chars };
}

function buildCountry(p: PolitySeed, scenario: Scenario, era: EraSettings, rnd: Rng, chars: Character[], world: World): Country {
  const year = scenario.year;
  const { pop, gdp } = polityFigures(p, year);
  const economy = buildEconomy(p.id, p, year, era, pop, gdp, rnd);
  const democratic = isDemocratic(p.government) && !p.overlord;
  const dominionDemocracy = p.status === "dominion" && isDemocratic(p.government);
  const detail = POLITICS[year]?.[p.id];
  const chamber = chamberFor(p, pop, detail, democratic || dominionDemocracy);
  const parties = buildParties(p, democratic || dominionDemocracy, chamber, year, rnd);
  const rulingParty = parties.find((x) => x.status !== "outside") ?? parties[0];
  const titles = GOVERNMENT_TITLES[p.government] ?? GOVERNMENT_TITLES["parliamentary-republic"];

  const addChar = (role: CharacterRole, name: string, partyId?: string, boost = 12): Character => {
    const c: Character = { id: `ch-${p.id}-${chars.length}`, name, country: p.id, role, partyId, stats: statsFor(rnd, p.ideology, boost), historical: true, createdAt: 0 };
    chars.push(c);
    return c;
  };

  const hos = addChar("head-of-state", p.hos || "Vacant", rulingParty?.id, 18);
  const presidential = !p.hog && (p.government === "presidential-republic" || p.government === "federal-republic" || p.government === "confederation");
  const hog = p.hog ? addChar("head-of-government", p.hog, rulingParty?.id, 16) : presidential ? hos : undefined;
  if (rulingParty) rulingParty.leaderId = (hog ?? hos).id;

  const ministers = MINISTRIES.map((area) => ({ id: area, title: MINISTER_TITLES[area], partyId: rulingParty?.id, characterId: undefined as string | undefined }));
  const cab = detail?.cabinet;
  const seat = (area: PolicyArea, name?: string) => {
    if (!name) return;
    const m = ministers.find((x) => x.id === area);
    if (m) m.characterId = addChar("minister", name, rulingParty?.id, 10).id;
  };
  seat("economy", cab?.economy);
  seat("foreign-policy", cab?.foreign);
  seat("defence", cab?.defence);
  if (cab?.centralBank) addChar("central-banker", cab.centralBank, undefined, 18);

  const legislature: Legislature | undefined = chamber
    ? { chambers: [chamber], membership: { [chamber.id]: [] }, committees: [], session: 1, activeBills: [] }
    : undefined;

  const military = buildMilitary(p.id, p.government, year, pop, gdp * 1e9, economy.budget.defence, rnd);
  const geo = polityGeo(p, world);
  const base = COUNTRY_BY_ISO3[p.id];
  const colour = eraColour(p.id, scenario.year) ?? colourForCountry(p.id);
  const term = (detail?.termYears ?? 4) * 365;
  const nextYear = detail?.nextElectionYear;
  const startMs = Date.UTC(scenario.startDate.year, scenario.startDate.month - 1, scenario.startDate.day);
  const nextElectionAt = !(democratic || dominionDemocracy)
    ? undefined
    : nextYear && Date.UTC(nextYear, 10, 5) > startMs
    ? (Date.UTC(nextYear, 10, 5) - startMs) / 1000
    : rnd.float(0.15, 1) * term * 86400;
  const directExecutive = presidential && (democratic || dominionDemocracy);
  const usVote = p.id === "USA" ? US_PRESIDENTIAL[year] : undefined;
  const nextPresidentialAt = !directExecutive ? undefined : usVote ? (Date.UTC(usVote, 10, 5) - startMs) / 1000 : rnd.float(0.2, 1) * 1825 * 86400;

  return {
    id: p.id,
    iso2: base?.iso2 ?? "",
    isoNumeric: base?.numeric ?? "",
    name: p.name,
    demonym: p.name,
    continent: base?.continent ?? "Europe",
    region: base?.region ?? regionFromLands(p.lands),
    mapColor: colour,
    government: p.government,
    headOfStateTitle: p.hosTitle ?? titles.hos,
    headOfGovernmentTitle: p.hogTitle ?? titles.hog,
    legislature,
    executive: {
      headOfStateId: hos.id,
      headOfStateTitle: p.hosTitle ?? titles.hos,
      headOfGovernmentId: hog?.id,
      headOfGovernmentTitle: p.hogTitle ?? titles.hog,
      ministers,
      coalition: parties.filter((x) => x.status !== "outside").map((x) => x.id),
      approval: clamp(rnd.float(38, 62), 5, 95),
      confidence: 60,
      emergencyPowers: false,
    },
    parties,
    courts: [],
    referendums: [],
    elections: [],
    military,
    economy,
    relations: {},
    alliances: [],
    wars: [],
    dependencies: {},
    overlord: p.overlord,
    ideology: p.ideology,
    bloc: p.bloc,
    cohesion: rnd.float(50, 90),
    unrestRisk: 0.02,
    unrest: [],
    flagEmoji: "",
    nukes: military.nuclearArsenal ?? 0,
    sanctions: [],
    policies: Object.fromEntries(MINISTRIES.map((m) => [m, clamp(p.ideology + rnd.normal() * 10, -100, 100)])) as Record<PolicyArea, number>,
    lands: p.lands,
    lat: geo.lat,
    lon: geo.lon,
    nextElectionAt,
    electionTermDays: term,
    nextPresidentialAt,
    tradeBarriers: {},
    rulingPartyName: p.rulingParty,
  };
}

function regionFromLands(lands: string[]): Country["region"] {
  for (const l of lands) if (COUNTRY_BY_ISO3[l]) return COUNTRY_BY_ISO3[l].region;
  return "europe";
}

// ===========================================================================
// The world
// ===========================================================================

const REBEL_NAMES: Record<string, string> = {
  PHL_REB: "First Philippine Republic", COL_REB: "Liberal Rebels", MEX_REB: "Constitutionalists", CHN_REB: "Anti-Chiang Coalition", LBY_REB: "Senussi Resistance", MLY_REB: "Malayan National Liberation Army", AFG_REB: "Afghan Insurgents", LBR_REB: "National Patriotic Front", ETH_REB: "Eritrean and Tigrayan Fronts", IRQ_REB: "Iraqi Insurgents", SOM_REB: "Al-Shabaab", SYR_REB: "Syrian Opposition", YEM_REB: "Houthi Movement", SDN_REB: "Rapid Support Forces", MMR_REB: "Resistance Forces",
};

const SCENARIO_SHOCKS: Record<number, (iso: string) => { shock: number; decay: number } | null> = {
  1930: (iso) => (["USA", "DEU", "CAN", "AUS", "ARG", "BRA", "POL", "AUT", "CSK", "CHL"].includes(iso) ? { shock: -0.14, decay: 0.3 } : iso === "USS" ? null : { shock: -0.05, decay: 0.35 }),
  2010: (iso) => (["GRC", "ESP", "PRT", "IRL", "ITA"].includes(iso) ? { shock: -0.03, decay: 0.6 } : null),
  2020: () => ({ shock: -0.1, decay: 1.6 }),
};

export function buildWorld(scenario: Scenario, name: string, id: string, now: number, playerCountry?: string): World {
  const rnd = new Rng(scenario.params.seed);
  const year = scenario.year;
  const era = ERA[year];
  const history = HISTORY[year];
  if (!history || !era) throw new Error(`No historical data for ${year}`);

  const world: World = {
    id,
    name,
    scenarioId: scenario.id,
    seed: scenario.params.seed,
    t: 0,
    epoch: scenario.epoch,
    startDate: scenario.startDate,
    daysPerSecond: scenario.daysPerSecond,
    paused: true,
    speed: 1,
    params: { ...scenario.params },
    countries: {},
    parties: {},
    characters: {},
    companies: {},
    exchanges: {},
    markets: {
      exchanges: [],
      sentiment: "neutral",
      riskAppetite: scenario.overrides.global?.riskAppetite ?? 50,
      creditSpreads: year <= 1930 ? 0.02 : 0.012,
      commodityPrices: { ...COMMODITY_BASE, ...scenario.overrides.global?.commodityPrices },
    },
    wars: {},
    treaties: {},
    sanctions: {},
    bills: {},
    events: [],
    ticker: [],
    globals: { globalGdp: 0, globalPopulation: 0, globalInflation: 0, worldHappiness: 55, worldConflictIndex: 0, coldWarIndex: 0 },
    directives: [],
    scenarioOverrides: JSON.parse(JSON.stringify(scenario.overrides)) as Scenario["overrides"],
    customCountries: {},
    createdAt: now,
    updatedAt: now,
    version: 1,
    playerCountry,
    control: resolveControl(history.polities),
    regions: history.regions.map((r) => ({ ...r })),
    commodityMarkets: {},
    dayCount: 0,
  };

  // ---- polities -----------------------------------------------------------
  const chars: Character[] = [];
  for (const p of history.polities) {
    const c = buildCountry(p, scenario, era, rnd, chars, world);
    const shock = SCENARIO_SHOCKS[year]?.(p.id);
    if (shock) {
      c.economy.macro.shock = shock.shock;
      c.economy.macro.shockDecay = shock.decay;
    }
    world.countries[c.id] = c;
    for (const party of c.parties) world.parties[party.id] = party;
  }
  for (const c of chars) world.characters[c.id] = c;

  // Dependencies get a tint of their overlord's colour.
  for (const p of history.polities) {
    if (!p.overlord) continue;
    const overlord = world.countries[p.overlord];
    const c = world.countries[p.id];
    if (!overlord || !c) continue;
    overlord.dependencies[p.id] = p.status ?? "colony";
    const lighten = p.status === "dominion" ? 8 : p.status === "occupation" ? -8 : 14;
    c.mapColor = hsl(overlord.mapColor, lighten);
    if (p.status !== "dominion" && p.status !== "occupation") c.bloc = overlord.bloc;
  }

  wireRelations(world, rnd);
  buildTradeNetwork(world, rnd);

  // ---- exchanges and corporations ----------------------------------------
  const exchangeAnchors: Record<string, string[]> = { nyse: ["USA"], nasdaq: ["USA"], lse: ["GBR"], euronext: ["FRA", "NLD"], dax: ["DEU"], nikkei: ["JPN"], sse: ["CHN"], twse: ["TWN"], hkg: ["HKG", "CHN"], krx: ["KOR"], nse: ["IND", "RAJ"], b3: ["BRA"], tsx: ["CAN"], asx: ["AUS", "AUC"], jse: ["ZAF", "CPC"], bmv: ["MEX"], sgx: ["SGP"], tadawul: ["SAU"], moex: ["RUS", "USS"], idx: ["IDN"], set: ["THA"] };
  const opened: Record<string, number> = { nyse: 1817, nasdaq: 1971, lse: 1801, euronext: 1826, dax: 1885, nikkei: 1878, sse: 1990, twse: 1961, hkg: 1891, krx: 1956, nse: 1875, b3: 1890, tsx: 1861, asx: 1871, jse: 1887, bmv: 1894, sgx: 1973, tadawul: 2007, moex: 1995, idx: 1977, set: 1975 };
  for (const ex of EXCHANGES) {
    if ((opened[ex.id] ?? 0) > year) continue;
    const home = (exchangeAnchors[ex.id] ?? [ex.country]).find((c) => world.countries[c]);
    if (!home) continue;
    const e: Exchange = { id: ex.id, name: ex.name, country: home, index: 1000, indexYearAgo: 1000, listings: [], volatility: clamp(rnd.float(10, 28), 2, 80), breadth: 50, marketCap: 0, currency: ex.currency as Exchange["currency"] };
    world.exchanges[e.id] = e;
    world.markets.exchanges.push(e);
  }

  for (const seed of companiesForYear(year)) {
    if (!world.countries[seed.country]) continue;
    const co = materialiseCompany(seed, world, rnd, scenario);
    world.companies[co.id] = co;
    if (co.listed && co.exchangeId && world.exchanges[co.exchangeId]) {
      world.exchanges[co.exchangeId].listings.push(co.id);
      world.exchanges[co.exchangeId].marketCap += co.valuation;
    } else if (co.listed && !co.exchangeId) {
      co.listed = false;
    }
  }

  // ---- commodity markets ---------------------------------------------------
  for (const [k, price] of Object.entries(world.markets.commodityPrices)) {
    world.commodityMarkets[k] = { supply: 1, demand: 1, trend: price, inventory: 0.25 };
  }

  // ---- wars and treaties --------------------------------------------------
  for (const w of WARS_BY_YEAR[year] ?? []) {
    const rebels: NonNullable<War["rebels"]> = {};
    const belligerents: Record<string, string[]> = {};
    for (const [b, allies] of Object.entries(w.belligerents)) {
      const present = allies.filter((x) => world.countries[x]);
      if (REBEL_NAMES[b]) {
        const host = world.countries[b.split("_")[0]];
        rebels[b] = { id: b, name: b === "LBY_REB" && year >= 2000 ? "Libyan National Army" : REBEL_NAMES[b], strength: Math.round((host?.military.activeDuty ?? 30000) * rnd.float(0.25, 0.7)) };
        belligerents[b] = present;
      } else if (world.countries[b]) {
        belligerents[b] = present;
      }
    }
    if (Object.keys(belligerents).length < 2) continue;
    const war: War = {
      id: `war-${slug(w.name)}`,
      name: w.name,
      startedAt: w.startedAt,
      phase: w.phase,
      belligerents,
      cause: w.cause,
      fronts: w.fronts.map((f, i) => ({ ...f, ...FRONT_GEO[w.name], id: `front-${i}`, contestedOutput: 0, openedAt: 0, attritionRate: 0.0004 })),
      // Copies: the seed tables must not carry one game's losses into the next.
      exhaustion: { ...w.exhaustion },
      casualties: { ...w.casualties },
      materiel: {},
      warGoal: w.warGoal ?? "",
      publicSupport: Object.fromEntries(Object.keys(belligerents).map((k) => [k, rnd.float(40, 70)])),
      rebels,
    };
    world.wars[war.id] = war;
    for (const [b, allies] of Object.entries(belligerents)) {
      world.countries[b]?.wars.push(war.id);
      for (const a of allies) if (!world.countries[a]?.wars.includes(war.id)) world.countries[a]?.wars.push(war.id);
    }
  }

  for (const t of TREATIES_BY_YEAR[year] ?? []) {
    const parties = t.parties.filter((p) => world.countries[p]);
    if (parties.length < 2) continue;
    const tr: Treaty = { id: `treaty-${slug(t.name)}`, name: t.name, kind: t.kind, parties, signedAt: -86400, terms: t.terms, tradeBonus: t.tradeBonus ?? 0, favourability: Object.fromEntries(parties.map((p) => [p, rnd.float(20, 60)])), active: true };
    world.treaties[tr.id] = tr;
    const military = t.kind === "alliance" || t.kind === "defensive-pact" || t.kind === "entente";
    for (const a of parties) {
      for (const b of parties) {
        if (a === b) continue;
        const ca = world.countries[a];
        ca.relations[b] = clamp((ca.relations[b] ?? 0) + (military ? 42 : 14), -100, 100);
        if (military && !ca.alliances.includes(b)) ca.alliances.push(b);
      }
    }
  }

  recomputeGlobals(world);
  pushEvent(world, { kind: "system", severity: "notice", title: `${scenario.name}: ${scenario.startDate.year}`, body: `${Object.keys(world.countries).length} polities and ${Object.keys(world.companies).length} corporations.`, tags: ["system"] });
  return world;
}

function wireRelations(world: World, rnd: Rng): void {
  const ids = Object.keys(world.countries);
  for (const a of ids) {
    const ca = world.countries[a];
    for (const b of ids) {
      if (a === b) continue;
      const cb = world.countries[b];
      let base = 0;
      if (ca.bloc === cb.bloc && ca.bloc !== "none" && ca.bloc !== "non-aligned") base += 28;
      else if (ca.bloc !== "none" && cb.bloc !== "none" && ca.bloc !== "non-aligned" && cb.bloc !== "non-aligned") base -= 12;
      if (ca.region === cb.region) base += 6;
      if (ca.overlord === b || cb.overlord === a || (ca.overlord && ca.overlord === cb.overlord)) base += 30;
      const dist = Math.hypot((ca.lat ?? 0) - (cb.lat ?? 0), (ca.lon ?? 0) - (cb.lon ?? 0));
      if (dist < 12) base -= 6;
      base -= (Math.abs(ca.ideology - cb.ideology) / 100) * 26;
      ca.relations[b] = Math.round(clamp(base + rnd.normal() * 8, -100, 100));
    }
  }
}

/** Gravity model. Keeps each country's twelve largest partners so saves stay small. */
function buildTradeNetwork(world: World, rnd: Rng): void {
  const ids = Object.keys(world.countries);
  for (const a of ids) {
    const ca = world.countries[a];
    const candidates: { id: string; v: number }[] = [];
    for (const b of ids) {
      if (a === b) continue;
      const cb = world.countries[b];
      const dist = Math.max(4, Math.hypot((ca.lat ?? 0) - (cb.lat ?? 0), (ca.lon ?? 0) - (cb.lon ?? 0)));
      const colonial = ca.overlord === b || cb.overlord === a ? 12 : ca.overlord && ca.overlord === cb.overlord ? 4 : 1;
      const rel = 0.5 + ((ca.relations[b] ?? 0) + 100) / 200;
      candidates.push({ id: b, v: (cb.economy.gdp * colonial * rel * rnd.float(0.8, 1.2)) / dist ** 1.5 });
    }
    candidates.sort((x, y) => y.v - x.v);
    const top = candidates.slice(0, 12);
    const total = top.reduce((s, x) => s + x.v, 0) || 1;
    const trade = ca.economy.trade;
    const volume = trade.exports + trade.imports;
    for (const x of top) trade.flows[x.id] = (x.v / total) * volume;
    trade.exportPartners = top.map((x) => x.id);
    trade.importPartners = top.map((x) => x.id);
  }
}

function materialiseCompany(seed: import("../shared/types").CompanySeed, world: World, rnd: Rng, scenario: Scenario): Company {
  const profile = SECTORS[seed.sector];
  const country = world.countries[seed.country];
  const margin = profile.margin * rnd.float(0.7, 1.3);
  const debt = seed.revenue * rnd.float(0.1, 0.6);
  const interest = debt * (country.economy.macro.bondYield + 0.01);
  const netIncome = (seed.revenue * margin - interest) * (1 - country.economy.tax.corporate);
  const pe = clamp(1 / Math.max(0.03, country.economy.macro.bondYield + 0.035) + profile.techIntensity * 18, 6, 45);
  const valuation = Math.max(seed.revenue * 0.15, netIncome * pe);
  const sectorOutput = country.economy.sectors.find((s) => s.id === seed.sector)?.output ?? seed.revenue;
  const exchangeId = seed.listed ? (seed.exchange && world.exchanges[seed.exchange] ? seed.exchange : Object.values(world.exchanges).find((e) => e.country === seed.country)?.id) : undefined;
  const startPrice = clamp(valuation / 1e7, 4, 400);
  return {
    id: `co-${slug(seed.name)}`,
    name: seed.name,
    country: seed.country,
    sector: seed.sector,
    tier: valuation > 1e12 ? "mega-cap" : valuation > 2e11 ? "large" : valuation > 2e10 ? "mid-cap" : "small",
    valuation,
    revenue: seed.revenue,
    costs: seed.revenue * (1 - margin),
    profit: seed.revenue * margin,
    employees: seed.employees,
    debt,
    stateOwnership: seed.stateOwnership ?? 0,
    brandValue: valuation * 0.15,
    sharePrice: startPrice,
    sharePriceYearAgo: startPrice,
    board: [],
    shareholders: [],
    ownershipFloat: 1 - (seed.stateOwnership ?? 0),
    listed: Boolean(exchangeId),
    exchangeId,
    founded: ((seed.foundedYear ?? scenario.year - 10) - scenario.year) * 365 * 86400,
    researchLevel: clamp(profile.techIntensity * rnd.float(0.5, 1), 0, 1),
    unionisation: rnd.float(0.05, 0.5),
    rd: seed.revenue * profile.techIntensity * 0.08,
    environmentalScore: rnd.float(-40, 60),
    lobbyingPower: clamp((Math.log10(Math.max(10, valuation)) - 7) * 16, 0, 100),
    dailyVolume: 0,
    shares: valuation / startPrice,
    netIncome,
    marketShare: clamp(seed.revenue / Math.max(1, sectorOutput), 0, 1),
    pe,
    playerShares: 0,
  };
}

export function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function recomputeGlobals(world: World): void {
  let gdp = 0;
  let pop = 0;
  let infl = 0;
  let happy = 0;
  let active = 0;
  for (const c of Object.values(world.countries)) {
    if (c.annexedBy) continue;
    gdp += c.economy.gdp;
    pop += c.economy.population;
    infl += clamp(c.economy.monetary.inflation, -0.5, 1) * c.economy.gdp;
    happy += (c.economy.labour.satisfaction * 100 * 0.5 + c.executive.approval * 0.5) * c.economy.gdp;
  }
  for (const w of Object.values(world.wars)) if (!w.endedAt) active += Object.keys(w.belligerents).length;
  world.globals.globalGdp = gdp;
  world.globals.globalPopulation = pop;
  world.globals.globalInflation = gdp > 0 ? infl / gdp : 0;
  world.globals.worldHappiness = gdp > 0 ? happy / gdp : 0;
  world.globals.worldConflictIndex = clamp01(active / 30) * 100;
  const us = world.countries.USA;
  const rival = world.countries.USS ?? world.countries.RUS ?? world.countries.CHN;
  if (us && rival) world.globals.coldWarIndex = clamp(50 - (us.relations[rival.id] ?? 0), 0, 100);
}

export function pushEvent(
  world: World,
  e: { kind: import("../shared/types").WorldEvent["kind"]; severity: import("../shared/types").WorldEvent["severity"]; title: string; body: string; country?: string; actors?: string[]; byUserId?: string; tags?: string[] },
): import("../shared/types").WorldEvent {
  const ev: import("../shared/types").WorldEvent = {
    id: `ev-${world.dayCount}-${world.events.length}-${Math.round(world.t)}`,
    t: world.t,
    at: Date.now(),
    country: e.country,
    kind: e.kind,
    severity: e.severity,
    title: e.title,
    body: e.body,
    actors: e.actors ?? (e.country ? [e.country] : []),
    byUserId: e.byUserId,
    tags: e.tags ?? [],
  };
  world.events.push(ev);
  if (world.events.length > 600) world.events.splice(0, world.events.length - 600);
  world.ticker.unshift({ t: world.t, text: e.title, kind: e.kind, country: e.country });
  if (world.ticker.length > 120) world.ticker.length = 120;
  return ev;
}
