import type {
  Bloc,
  Character,
  CharacterRole,
  CharacterStats,
  Committee,
  Company,
  Country,
  Court,
  EconomyState,
  ExecutiveBranch,
  Exchange,
  FiscalState,
  GovernmentType,
  LabourState,
  Legislature,
  LegislatureChamberConfig,
  MilitaryState,
  MonetaryState,
  Party,
  PolicyArea,
  Scenario,
  SectorState,
  TradeState,
  Treaty,
  War,
  World,
} from "../shared/types";
import { SECTOR_IDS } from "../shared/types";
import { ALL_ISO3, COUNTRY_BY_ISO3, GOVERNMENT_TITLES, colourForCountry } from "../data/countries";
import { ARCHETYPES, COMMODITY_BASE, EXCHANGES, SECTORS, type Archetype } from "../data/economy";
import { companiesForYear } from "../data/companies";
import { TREATIES_BY_YEAR, WARS_BY_YEAR } from "../data/wars";
import { ERA_1900, ERA_1930, ERA_1950, type EraDefinition, type HistoricalPolity } from "../data/eras";
import { Rng, clamp, clamp01 } from "./rng";

/**
 * Which historical era supplies territorial control for a given year.
 * There is deliberately no entry for 1990 and later: those years use the modern
 * country set directly, so the eras table stops at the last political upheaval.
 */
export function eraForYear(year: number): EraDefinition | undefined {
  if (year >= 1990) return undefined;
  if (year < 1930) return ERA_1900;
  if (year < 1950) return ERA_1930;
  return ERA_1950;
}

const M = 1e6; // a million

// ===========================================================================
// Archetype assignment
// ===========================================================================

/** Explicit assignments where the generic heuristic would get it wrong. */
const ARCHETYPE_OVERRIDES: Record<string, string> = {
  SAU: "oilstate", ARE: "oilstate", KWT: "oilstate", QAT: "oilstate", BHR: "oilstate",
  IRQ: "oilstate", IRN: "oilstate", IRQ2: "oilstate", OMN: "oilstate",
  NGA: "resource", DZA: "resource", AGO: "resource", VNM: "resource", SDN: "resource",
  KAZ: "resource", AZE: "resource", RUS: "resource", NOR: "resource", GAB: "resource",
  TKM: "resource", MNG: "resource", BOL: "resource", CHL: "resource", PER: "resource",
  ZMB: "resource", ZWE: "resource", GHA: "resource", GIN: "resource", MLI: "resource",
  NER: "resource", BFA: "resource", TCD: "resource", GUY: "resource", MOZ: "resource",
  LUX: "taxhaven", SGP: "taxhaven", HKG: "taxhaven", IRL: "taxhaven", PAN: "taxhaven",
  CYP: "taxhaven", BMU: "taxhaven", JEY: "taxhaven", IMN: "taxhaven", GIB: "taxhaven",
  CYM: "taxhaven", VGB: "taxhaven", TTO: "taxhaven", MUS: "taxhaven", MHL: "taxhaven",
  MCO: "sanctuary", SMR: "sanctuary", VAT: "sanctuary", LIE: "sanctuary", AND: "sanctuary",
  SMR2: "sanctuary", BRB: "sanctuary",
  PRK: "command", ERI: "command", VNM2: "command", CUB: "command", LAO: "command",
  MMR: "command", KOR2: "command", AFG: "command",
  CHN: "planned", USSR: "planned", USS: "planned", ALB: "planned", BGR: "planned",
  CUB2: "planned", HUN: "planned", POL2: "planned", ROU: "planned", VNM3: "planned",
  KOR3: "planned", PRK2: "planned", BLN: "planned", LAO2: "planned", MMR2: "planned",
  DEU2: "industrial", GBR: "postindustrial", USA: "postindustrial", JPN: "postindustrial",
  SMR3: "sanctuary", SGP2: "sanctuary",
  IND: "mixed", CHN2: "industrial", BRA: "mixed", ZAF: "mixed", MEX: "mixed",
  ARG: "mixed", IDN: "mixed", TUR: "mixed", THA: "mixed", MYS: "mixed", PHL: "mixed",
  EGY: "mixed", PAK: "mixed", BGD: "mixed", UKR: "mixed", NGA2: "mixed",
  SWZ: "autarkic", PRK3: "command", TKM2: "autarkic",
};

/** Chambers by government type. This is what makes the politics UI correct. */
function chambersFor(gov: GovernmentType, population: number): LegislatureChamberConfig[] {
  const scale = Math.max(1, Math.round(population / 12));
  const seat = (n: number) => Math.max(8, Math.min(650, Math.round(n * scale)));

  const unicameral = (n: number, name = "National Assembly"): LegislatureChamberConfig[] => [
    { id: "chamber-1", name, kind: "unicameral", seats: n, districtSeats: 0, prSeats: n, districtThreshold: 0, moneyBills: true, vetoOverride: false, termDays: 1460, election: "pr-list", confirmsAppointments: false },
  ];

  switch (gov) {
    case "one-party-state":
    case "military-junta":
      return [
        { id: "chamber-1", name: "Supreme People's Assembly", kind: "unicameral", seats: seat(20), districtSeats: 0, prSeats: seat(20), districtThreshold: 0, moneyBills: true, vetoOverride: true, termDays: 2920, election: "none", confirmsAppointments: false },
      ];
    case "absolute-monarchy":
    case "monarchy-absolute-colonial":
    case "theocracy":
      // A crown has no legislature, but every state runs *some* council, and a
      // game where the player cannot legislate is not a political simulation.
      return unicameral(Math.max(24, seat(9)), "Royal Council");
    case "constitutional-monarchy":
      return [
        { id: "commons", name: "House of Commons", kind: "lower", seats: seat(6), districtSeats: Math.round(seat(6) * 0.62), prSeats: Math.round(seat(6) * 0.38), districtThreshold: 0.13, moneyBills: true, vetoOverride: false, termDays: 1460, election: "fptp", confirmsAppointments: false },
        { id: "lords", name: "House of Lords", kind: "upper", seats: Math.max(40, Math.round(seat(3))), districtSeats: 0, prSeats: Math.max(40, Math.round(seat(3))), districtThreshold: 0, moneyBills: false, vetoOverride: false, termDays: 3650, election: "none", confirmsAppointments: true },
      ];
    case "presidential-republic":
    case "federal-republic":
      return [
        { id: "chamber-1", name: "Chamber of Deputies", kind: "lower", seats: seat(7), districtSeats: Math.round(seat(7) * 0.55), prSeats: Math.round(seat(7) * 0.45), districtThreshold: 0.1, moneyBills: true, vetoOverride: false, termDays: 1095, election: "mixed-member-proportional", confirmsAppointments: false },
        { id: "chamber-2", name: "Senate", kind: "upper", seats: Math.max(30, seat(2)), districtSeats: 0, prSeats: Math.max(30, seat(2)), districtThreshold: 0, moneyBills: false, vetoOverride: false, termDays: 1825, election: "pr-list", confirmsAppointments: true },
      ];
    case "semi-presidential-republic":
      return [
        { id: "chamber-1", name: "National Assembly", kind: "lower", seats: seat(8), districtSeats: Math.round(seat(8) * 0.5), prSeats: Math.round(seat(8) * 0.5), districtThreshold: 0.12, moneyBills: true, vetoOverride: true, termDays: 1460, election: "mixed-member-proportional", confirmsAppointments: false },
        { id: "chamber-2", name: "Senate", kind: "upper", seats: Math.max(40, seat(2.5)), districtSeats: 0, prSeats: Math.max(40, seat(2.5)), districtThreshold: 0, moneyBills: false, vetoOverride: false, termDays: 1825, election: "pr-list", confirmsAppointments: true },
      ];
    case "parliamentary-republic":
      return [
        { id: "chamber-1", name: "National Assembly", kind: "lower", seats: seat(9), districtSeats: Math.round(seat(9) * 0.6), prSeats: Math.round(seat(9) * 0.4), districtThreshold: 0.14, moneyBills: true, vetoOverride: false, termDays: 1460, election: "mixed-member-proportional", confirmsAppointments: false },
        { id: "chamber-2", name: "Senate", kind: "upper", seats: Math.max(30, seat(2)), districtSeats: 0, prSeats: Math.max(30, seat(2)), districtThreshold: 0, moneyBills: false, vetoOverride: false, termDays: 1825, election: "pr-list", confirmsAppointments: true },
      ];
    case "confederation":
      return [
        { id: "council", name: "Council of States", kind: "unicameral", seats: 46, districtSeats: 0, prSeats: 46, districtThreshold: 0, moneyBills: true, vetoOverride: true, termDays: 1461, election: "pr-list", confirmsAppointments: true },
      ];
    case "dependency":
    case "protectorate":
    case "mandate-colony":
    case "occupied-territory":
      return unicameral(Math.max(20, seat(6)), "Legislative Council");
    case "breakaway-state":
      return [
        { id: "chamber-1", name: "Assembly", kind: "lower", seats: seat(7), districtSeats: Math.round(seat(7) * 0.7), prSeats: Math.round(seat(7) * 0.3), districtThreshold: 0.12, moneyBills: true, vetoOverride: false, termDays: 1460, election: "fptp", confirmsAppointments: false },
      ];
    default:
      return unicameral(seat(7));
  }
}

const MINISTRIES: PolicyArea[] = ["economy", "tax", "welfare", "health", "education", "environment", "defence", "immigration", "foreign-policy", "justice", "technology", "housing", "energy", "transport", "agriculture", "labour"];

const MINISTER_TITLES: Record<PolicyArea, string> = {
  economy: "Minister of the Economy",
  tax: "Minister for Taxation",
  welfare: "Minister for Social Welfare",
  health: "Minister of Health",
  education: "Minister of Education",
  environment: "Minister of the Environment",
  defence: "Minister of Defence",
  immigration: "Minister for Immigration",
  "foreign-policy": "Foreign Secretary",
  justice: "Minister of Justice",
  technology: "Minister for Technology",
  housing: "Minister for Housing",
  energy: "Minister of Energy",
  transport: "Minister of Transport",
  agriculture: "Minister of Agriculture",
  labour: "Minister of Labour",
};

// ===========================================================================
// Names
// ===========================================================================

const FIRST_NAMES = "Adrian Ahmed Alejandro Amina Anders Andre Anika Antoine Arjun Aung Ayesha Bao Beatriz Bilal Bruno Camila Carlos Chen Chiara Dalia Danila Diego Dmitri Elena Emeka Emil Erik Esther Fatima Felix Fiona Gabriel Ganesh Giulia Hana Hassan Hector Hiro Ines Ingrid Isabel Ivan Jacek Jamal Javier Jing Joanna Jonas Jorge Juan Julia Kai Karim Katya Kenji Khalid Kirsten Klaus Larissa Lars Leila Liam Lina Lucas Madhav Magnus Malik Mara Marco Marta Mateo Mei Mikhail Mingir Mira Nadia Naledi Nia Nikolai Nuno Olga Omar Oscar Pablo Petra Priya Quentin Rafael Raisa Rashid Renata Ricardo Rina Rosa Ruben Saman Samira Sanne Sara Satoshi Sebastian Selin Sergei Shiori Silas Simone Sofia Soren Tariq Teresa Thiago Tomas Ursula Vera Viktor Wei Wiktoria Xiomara Yasmin Yuki Yusuf Zainab Zara Zoe".split(" ");

const LAST_NAMES: Record<string, string[]> = {
  GBR: ["Ashford", "Whitcombe", "Ravensworth", "Halloway", "Pemberton", "Kingsley", "Bramwell", "Fairfax", "Ellingham", "Thorne"],
  FRA: ["Lefevre", "Beauclair", "Roussel", "Marchand", "Vaillancourt", "Dubreuil", "Chevalier", "Aubertin", "Noailles"],
  DEU: ["Brandt", "Hoffmann", "Kessler", "Reinhardt", "Vogel", "Wirth", "Steinbach", "Lindemann"],
  ITA: ["Ferrante", "Baldini", "Orsini", "Marchetti", "Vespucci", "Roccella", "Salvatori"],
  ESP: ["Iglesias", "Mendoza", "Carrasco", "Alcantara", "Vidal", "Sarmiento", "Quintana"],
  USA: ["Whitaker", "Callahan", "Reyes", "Donnelly", "Brennan", "Ashford", "Vaughn", "Prescott"],
  RUS: ["Volkov", "Sokolov", "Zhirkov", "Morozov", "Rostov", "Belinsky", "Dragunov"],
  CHN: ["Chen", "Wang", "Zhang", "Liu", "Zhao", "Huang", "Sun", "Zhou", "Wu", "Lin"],
  JPN: ["Tanaka", "Yamamoto", "Sato", "Nakamura", "Kobayashi", "Watanabe", "Fujita"],
  IND: ["Sharma", "Verma", "Nair", "Iyer", "Reddy", "Chatterjee", "Bose"],
  default: ["Almeida", "Nowak", "Kovac", "Haddad", "Osei", "Mensah", "Nasser", "Petrov", "Kim", "Berg"],
};

function nameFor(country: string, rnd: Rng): string {
  const first = rnd.pick(FIRST_NAMES);
  const lasts = LAST_NAMES[country] ?? LAST_NAMES.default;
  return `${first} ${rnd.pick(lasts)}`;
}

function statsFor(rnd: Rng, ideology: number, competenceBias = 0): CharacterStats {
  return {
    competence: Math.round(clamp(rnd.normal() * 26 + competenceBias + 8, -100, 100)),
    charisma: Math.round(clamp(rnd.normal() * 26, -100, 100)),
    integrity: Math.round(clamp(rnd.normal() * 30, -100, 100)),
    ambition: Math.round(clamp(rnd.normal() * 28, -100, 100)),
    ideology: Math.round(clamp(ideology + rnd.normal() * 18, -100, 100)),
    popularity: Math.round(clamp(rnd.normal() * 22 + 42, 0, 100)),
    experience: Math.round(clamp(rnd.normal() * 24 + 52, 0, 100)),
    militancy: Math.round(clamp(rnd.normal() * 30, -100, 100)),
  };
}

// ===========================================================================
// Economy construction
// ===========================================================================

function buildEconomy(
  archetype: Archetype,
  populationM: number,
  gdpPerCapita: number,
  rnd: Rng,
  era?: EraDefinition,
): EconomyState {
  const persons = populationM * M;
  const gdp = persons * gdpPerCapita;
  const productivityScale = clamp(gdpPerCapita / 60000, 0.2, 1.15);

  const sectors: SectorState[] = SECTOR_IDS.filter((id) => (archetype.mix[id] ?? 0) > 0).map((id) => {
    const p = SECTORS[id];
    return {
      id,
      share: archetype.mix[id] ?? 0.01,
      growth: p.growth * (0.65 + productivityScale * 0.7) * rnd.float(0.82, 1.2),
      productivity: clamp(p.growth * 100 * (0.6 + productivityScale) * 40 + rnd.float(-12, 18), 8, 140),
      employment: Math.round(persons * 0.42 * (archetype.mix[id] ?? 0.01) * p.labourIntensity * 1.6),
      stateSubsidy: archetype.stateOwnership * rnd.float(0.4, 1.4),
      stateOwnership: archetype.stateOwnership,
    };
  });

  const totalShare = sectors.reduce((a, s) => a + s.share, 0) || 1;
  for (const s of sectors) s.share /= totalShare;

  const taxRate = archetype.stateOwnership > 0.6 ? 0.42 : archetype.stateOwnership > 0.25 ? 0.3 : 0.24;
  const revenue = gdp * taxRate;
  const expenditure = revenue * rnd.float(0.96, 1.06);
  // A single draw for the leverage ratio; the debt stock is derived from it so
  // the two can never disagree on the first tick.
  const openingDebtToGdp = archetype.stateOwnership > 0.6 ? rnd.float(0.1, 0.5) : rnd.float(0.15, 1.05);

  const fiscal: FiscalState = {
    revenue,
    taxIncome: revenue * 0.52,
    corporateTax: revenue * 0.16,
    vat: revenue * 0.18,
    tariffs: revenue * 0.06,
    resourceRent: revenue * (archetype.mix.mining ?? 0) * 1.6,
    expenditure,
    military: expenditure * rnd.float(0.08, 0.28),
    welfare: expenditure * rnd.float(0.14, 0.34),
    infrastructure: expenditure * rnd.float(0.06, 0.16),
    education: expenditure * rnd.float(0.04, 0.14),
    healthcare: expenditure * rnd.float(0.04, 0.12),
    administration: expenditure * rnd.float(0.05, 0.14),
    debtService: expenditure * rnd.float(0.02, 0.12),
    debt: gdp * openingDebtToGdp,
    debtToGdp: openingDebtToGdp,
    creditRating: rnd.float(0.1, 0.95),
    budgetBalanceRatio: 0,
    treasury: gdp * rnd.float(0.01, 0.08),
  };
  fiscal.debtService = fiscal.debt * (era?.era === "1900" ? 0.03 : 0.05);

  const monetary: MonetaryState = {
    policyRate: era ? (era.era === "1900" ? 0.03 : era.era === "1930" ? 0.055 : 0.04) : rnd.float(0.005, 0.06),
    moneySupply: 1,
    inflation: era ? (era.era === "1930" ? -0.012 : era.era === "1950" ? 0.06 : 0.025) : rnd.float(0.01, 0.05),
    reserveRatio: rnd.float(0.04, 0.14),
    centralBankRate: rnd.float(0.01, 0.08),
    exchangeRateVsUsd: 1,
    currencyConfidence: rnd.float(0.4, 0.95),
  };

  const labour: LabourState = {
    unemployment: archetype.unemployment * rnd.float(0.7, 1.5),
    participation: rnd.float(0.5, 0.78),
    unionisation: archetype.unionisation,
    medianWage: gdpPerCapita * rnd.float(0.62, 0.86),
    wageGrowth: rnd.float(0.005, 0.05),
    strikeRisk: rnd.float(0.02, 0.16),
    satisfaction: rnd.float(0.42, 0.78),
  };

  const openness = archetype.openness * rnd.float(0.85, 1.15);
  const trade: TradeState = {
    exports: gdp * openness * rnd.float(0.85, 1.1),
    imports: gdp * openness * rnd.float(0.85, 1.1),
    tradeBalance: 0,
    exportPartners: [],
    importPartners: [],
    tradeOpenness: openness * 100,
    tariffRate: rnd.float(0.02, 0.14),
    flows: {},
  };
  trade.tradeBalance = trade.exports - trade.imports;

  return {
    gdp,
    gdpPerCapita,
    gdpGrowth: rnd.float(0.005, 0.045),
    nominalGrowth: 0,
    population: persons,
    productivity: clamp(archetype.productivity * 100 * rnd.float(0.85, 1.2), 12, 100),
    debtRatingScore: clamp(fiscal.creditRating * 100, 5, 99),
    fiscal,
    monetary,
    labour,
    trade,
    sectors,
    history: [],
    corruption: clamp(archetype.corruption * rnd.float(0.8, 1.25), 0.02, 0.9),
    inequality: clamp(rnd.float(0.24, 0.52) + (archetype.corruption - 0.25) * 0.3, 0.15, 0.72),
    netForeignAssets: gdp * rnd.float(-0.5, 0.4),
    reserves: gdp * rnd.float(0.02, 0.18),
    rd: gdp * archetype.rd,
  };
}

// ===========================================================================
// Military, parties, legislature
// ===========================================================================

function buildMilitary(gov: GovernmentType, gdp: number, rnd: Rng, nukes = 0): MilitaryState {
  const budget = gdp * (gov === "theocracy" || gov === "military-junta" ? rnd.float(0.1, 0.22) : rnd.float(0.012, 0.055));
  const active = Math.round(gdp / 12000);
  const branch = (n: number): { active: number; quality: number } => ({
    active: Math.round(active * n),
    quality: clamp(rnd.float(28, 92), 5, 100),
  });
  return {
    activeDuty: active,
    reserves: Math.round(active * rnd.float(0.8, 3.2)),
    spend: budget,
    readiness: clamp(rnd.float(40, 88), 10, 100),
    doctrine: gov === "one-party-state" || gov === "military-junta" ? rnd.float(-40, 30) : rnd.float(-30, 55),
    nuclearArsenal: nukes,
    branches: {
      army: branch(0.6),
      navy: branch(0.16),
      "air-force": branch(0.16),
      marines: branch(0.03),
      space: branch(0.01),
      cyber: branch(0.02),
      nuclear: { active: nukes, quality: nukes > 0 ? clamp(rnd.float(60, 98), 10, 100) : 0 },
    },
    morale: rnd.float(45, 88),
    veterans: Math.round(active * rnd.float(0.2, 0.9)),
    conscription: rnd.chance(0.4),
    burden: budget / gdp,
  };
}

const PARTY_COLOURS = ["#c0392b", "#2980b9", "#27ae60", "#8e44ad", "#d68910", "#16a085", "#2c3e50", "#e74c3c", "#7f8c8d", "#f39c12", "#1abc9c", "#9b59b6"];

function buildParties(country: string, gov: GovernmentType, ideology: number, rnd: Rng, chambers: LegislatureChamberConfig[], oneRuling: string): Party[] {
  if (gov === "one-party-state" || gov === "military-junta") {
    return [
      {
        id: `${country}-party-ruling`,
        country,
        name: gov === "military-junta" ? "National Unity Council" : "The Ruling Party",
        abbreviation: gov === "military-junta" ? "NUC" : "RP",
        ideology: clamp(ideology, -100, 100),
        cohesion: rnd.float(70, 96),
        popularity: rnd.float(55, 88),
        color: "#c0392b",
        seats: Object.fromEntries(chambers.map((c) => [c.id, c.seats])),
        treasury: 1e10,
        memberCount: Math.round(rnd.float(2e5, 8e5)),
        status: "ruling",
        platform: Object.fromEntries(MINISTRIES.map((m) => [m, clamp(ideology + rnd.normal() * 12, -100, 100)])) as Record<PolicyArea, number>,
        founded: 0,
      },
    ];
  }

  const count = clamp(Math.round(rnd.float(2.4, 6.6)), 2, 7);
  const names = partyNamesFor(country, count, rnd);
  const parties: Party[] = [];
  const spread = 74;

  for (let i = 0; i < count; i++) {
    const id = `${country}-party-${i}`;
    const t = i === 0 ? 0 : rnd.normal() * 0.5;
    const idg = clamp(ideology + t * spread, -100, 100);
    const seats: Record<string, number> = {};
    let first = true;
    for (const c of chambers) {
      const total = c.seats;
      // The largest party gets a plurality; the rest split the remainder.
      let share: number;
      if (first) {
        share = clamp(0.3 + rnd.float(0.04, 0.26), 0.18, 0.55);
      } else {
        const remaining = 1 - parties.reduce((a, p) => a + (p.seats[c.id] ?? 0) / total, 0);
        share = remaining * (0.2 + rnd.float(0, 0.55));
      }
      seats[c.id] = Math.max(0, Math.round(total * Math.max(0, share)));
      if (seats[c.id] > 0) first = false;
    }
    parties.push({
      id,
      country,
      name: names[i].name,
      abbreviation: names[i].abbreviation,
      ideology: Math.round(idg),
      cohesion: rnd.float(42, 92),
      popularity: clamp(100 / count + rnd.normal() * 14, 2, 92),
      color: PARTY_COLOURS[i % PARTY_COLOURS.length],
      seats,
      treasury: 4e8 + rnd.float(0, 3e9),
      memberCount: Math.round(rnd.float(5e4, 9e5)),
      status: "outside",
      platform: Object.fromEntries(MINISTRIES.map((m) => [m, clamp(idg + rnd.normal() * 22, -100, 100)])) as Record<PolicyArea, number>,
      founded: 0,
    });
  }

  // Normalise so seats sum exactly to the chamber size.
  for (const c of chambers) {
    const total = parties.reduce((a, p) => a + (p.seats[c.id] ?? 0), 0);
    if (total === 0) continue;
    const scale = c.seats / total;
    let assigned = 0;
    for (const p of parties) {
      p.seats[c.id] = Math.floor((p.seats[c.id] ?? 0) * scale);
      assigned += p.seats[c.id];
    }
    parties[0].seats[c.id] += c.seats - assigned;
  }

  // Government = the parties that together hold a majority in the money chamber.
  const money = chambers.find((c) => c.moneyBills) ?? chambers[0];
  const govIds: string[] = [];
  const ordered = [...parties].sort((a, b) => (b.seats[money.id] ?? 0) - (a.seats[money.id] ?? 0));
  for (const p of ordered) {
    if (govIds.length === 0) {
      govIds.push(p.id);
    } else if (govIds.reduce((a, id) => a + (parties.find((x) => x.id === id)?.seats[money.id] ?? 0), 0) + (p.seats[money.id] ?? 0) <= c_majority(money.seats)) {
      govIds.push(p.id);
    }
  }
  for (const p of parties) p.status = govIds.includes(p.id) ? "government" : "outside";
  const govParty = parties.find((p) => p.id === govIds[0]);
  if (govParty) govParty.name = govParty.name || oneRuling;
  return parties;
}

const c_majority = (seats: number) => Math.floor(seats / 2);

/**
 * Party names.
 *
 * Major powers get their real parties so a player in 2026 recognises the
 * Conservative Party. Everyone else gets a plausible name built from a local
 * colour word plus a generic movement, which reads far better than "Party 3".
 */
const PARTY_NAMES_GLOBAL = "Democratic Alliance,National Union,Reform Movement,Progressive Front,Popular Party,Social Democrats,Liberals,Peoples Front,Unity Party,Civic List,Green League,Labour Party,Freedom Party,Justice Party,Patriotic Union,Moderates,New Order,Popular Front,Republican Union,Renewal Party,Citizens Alliance,Workers Front,Progressives,National Front,Order and Security".split(",");

const PARTY_NAME_POOL: Record<string, { name: string; abbreviation: string }[]> = {
  GBR: [{ name: "The Conservative Party", abbreviation: "CON" }, { name: "The Labour Party", abbreviation: "LAB" }, { name: "The Liberal Democrats", abbreviation: "LD" }, { name: "Reform UK", abbreviation: "REF" }, { name: "The Greens", abbreviation: "GRN" }],
  USA: [{ name: "Democratic Party", abbreviation: "DEM" }, { name: "Republican Party", abbreviation: "REP" }, { name: "Libertarian Party", abbreviation: "LPT" }, { name: "Green Party", abbreviation: "GRN" }],
  FRA: [{ name: "Renaissance", abbreviation: "REN" }, { name: "Les Republicains", abbreviation: "LR" }, { name: "Rassemblement National", abbreviation: "RN" }, { name: "France Insoumise", abbreviation: "FI" }, { name: "Les Ecologistes", abbreviation: "ECO" }],
  DEU: [{ name: "CDU", abbreviation: "CDU" }, { name: "SPD", abbreviation: "SPD" }, { name: "AfD", abbreviation: "AFD" }, { name: "Die Linke", abbreviation: "LIN" }, { name: "Greens", abbreviation: "GRU" }],
  ITA: [{ name: "Democratic Party", abbreviation: "PD" }, { name: "Forza Italia", abbreviation: "FI" }, { name: "Five Star Movement", abbreviation: "M5S" }, { name: "Lega", abbreviation: "LG" }, { name: "Brothers of Italy", abbreviation: "FDI" }],
  CHN: [{ name: "Communist Party of China", abbreviation: "CPC" }, { name: "China Democratic League", abbreviation: "CDL" }, { name: "China Peasants and Workers Democratic Party", abbreviation: "CPWDP" }, { name: "China National Democratic Construction Association", abbreviation: "CNDCA" }, { name: "Jiusan Society", abbreviation: "JS" }],
  RUS: [{ name: "United Russia", abbreviation: "UR" }, { name: "Communist Party of the Russian Federation", abbreviation: "CPRF" }, { name: "A Just Russia", abbreviation: "AJR" }, { name: "Liberal Democratic Party of Russia", abbreviation: "LDPR" }, { name: "New Right", abbreviation: "NR" }],
  JPN: [{ name: "Liberal Democratic Party", abbreviation: "LDP" }, { name: "Democratic Party for the People", abbreviation: "DPJ" }, { name: "Komeito", abbreviation: "KMT" }, { name: "Japan Restoration Party", abbreviation: "JRP" }, { name: "Social Democratic Party", abbreviation: "SDP" }],
  IND: [{ name: "Indian National Congress", abbreviation: "INC" }, { name: "Bharatiya Janata Party", abbreviation: "BJP" }, { name: "Aam Aadmi Party", abbreviation: "AAP" }, { name: "Samajwadi Party", abbreviation: "SP" }, { name: "Bahujan Samaj Party", abbreviation: "BSP" }],
};

const COLOUR_WORDS = "National,Popular,Democratic,Republican,Labour,Liberal,Conservative,Socialist,Progressive,Radical,Civic,People's,Unity,Freedom,Renewal,Green,Blue,Red,Workers,Federal,Independent".split(",");

function partyNamesFor(country: string, count: number, rnd: Rng): { name: string; abbreviation: string }[] {
  const real = PARTY_NAME_POOL[country];
  const out: { name: string; abbreviation: string }[] = [];
  const used = new Set<string>();
  let gi = rnd.int(0, PARTY_NAMES_GLOBAL.length - 1);

  for (let i = 0; i < count; i++) {
    if (real && real[i]) {
      out.push(real[i]);
      used.add(real[i].name);
      continue;
    }
    // Build a distinct name: try a colour word plus a movement, then fall back
    // to the global pool with a numeric suffix if that is taken.
    let name = "";
    for (let attempt = 0; attempt < 8 && !name; attempt++) {
      const adjective = rnd.pick(COLOUR_WORDS);
      const movement = rnd.pick(PARTY_NAMES_GLOBAL);
      name = `${adjective} ${movement}`;
      if (used.has(name)) name = "";
    }
    if (!name) {
      do {
        name = PARTY_NAMES_GLOBAL[gi % PARTY_NAMES_GLOBAL.length];
        gi++;
      } while (used.has(name));
    }
    used.add(name);
    out.push({ name, abbreviation: abbreviationFor(name) });
  }
  return out;
}

function abbreviationFor(name: string): string {
  const words = name.replace(/[^A-Za-z\s]/g, "").split(/\s+/).filter(Boolean);
  if (!words.length) return "PR";
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.slice(0, 3).map((w) => w[0].toUpperCase()).join("");
}

function buildCommittees(chambers: LegislatureChamberConfig[], rnd: Rng): Committee[] {
  const out: Committee[] = [];
  const defs: [string, PolicyArea[]][] = [
    ["Ways and Means", ["tax", "economy"]],
    ["Budget", ["economy", "tax", "labour"]],
    ["Foreign Affairs", ["foreign-policy"]],
    ["Defence", ["defence"]],
    ["Judiciary", ["justice"]],
    ["Health", ["health"]],
    ["Education", ["education"]],
    ["Environment", ["environment", "agriculture"]],
    ["Energy and Climate", ["energy", "environment"]],
    ["Transport and Infrastructure", ["transport", "housing"]],
    ["Home Affairs", ["immigration"]],
    ["Technology", ["technology"]],
    ["Welfare", ["welfare", "housing"]],
    ["Agriculture", ["agriculture"]],
  ];
  for (const [name, jurisdiction] of defs) {
    out.push({
      id: `committee-${name.toLowerCase().replace(/[^a-z]+/g, "-")}`,
      name,
      chamberId: chambers[0]?.id ?? "chamber-1",
      jurisdiction,
      power: rnd.float(25, 85),
      memberIds: [],
    });
  }
  return out;
}

// ===========================================================================
// Country construction
// ===========================================================================

/**
 * Historical revaluation.
 *
 * The country table is calibrated to 2026. A scenario in 1900 needs every
 * economy restated, or the "age of empires" starts with a trillion-dollar
 * American economy and nothing feels historical.
 *
 * Two multipliers are applied, both anchored on real historical aggregates:
 *   - `gdpFactor`: real GDP per capita relative to 2026, country-specific
 *   - `popFactor`: real population relative to 2026
 *
 * The GDP multiplier is income-dependent. Poor countries in 1900 were poor
 * relative to their own present as well as to the world average, so a single
 * global factor would flatter them; the exponent rises with income, which
 * reproduces the fact that today's rich countries were proportionally richer
 * in 1900 than today's poor ones. It is calibrated against known 1900 values
 * (United States ~0.06, United Kingdom ~0.09, India ~0.31, Nigeria ~0.37).
 */
interface EraValuation {
  gdpPerCapita: number;
  population: number;
}

const ERA_VALUATION: Record<number, EraValuation> = {
  1900: { gdpPerCapita: 0.11, population: 0.2 },
  1914: { gdpPerCapita: 0.13, population: 0.22 },
  1930: { gdpPerCapita: 0.19, population: 0.26 },
  1950: { gdpPerCapita: 0.31, population: 0.31 },
  1990: { gdpPerCapita: 0.69, population: 0.66 },
  2010: { gdpPerCapita: 0.96, population: 0.86 },
  2020: { gdpPerCapita: 1.0, population: 0.97 },
  2026: { gdpPerCapita: 1.0, population: 1.0 },
};

function valuationFor(year: number): EraValuation {
  if (ERA_VALUATION[year]) return ERA_VALUATION[year];
  const keys = Object.keys(ERA_VALUATION).map(Number).sort((a, b) => a - b);
  const below = keys.filter((k) => k <= year).pop() ?? 2026;
  return ERA_VALUATION[below];
}

function restateForYear(gdpPerCapita: number, year: number): { gdpPerCapita: number; population: number } {
  const v = valuationFor(year);
  if (v.gdpPerCapita >= 0.999 && v.population >= 0.999) return { gdpPerCapita, population: 1 };
  // Income norm: 0 for the poorest state in the dataset, 1 for the richest.
  const incomeNorm = clamp01((gdpPerCapita - 500) / (60000 - 500));
  const exponent = 0.5 + 0.9 * incomeNorm;
  return {
    gdpPerCapita: gdpPerCapita * Math.pow(v.gdpPerCapita, exponent),
    population: v.population,
  };
}

export function buildWorld(scenario: Scenario, name: string, id: string, now: number): World {
  const rnd = new Rng(scenario.params.seed);
  const era = eraForYear(scenario.year);
  const world: World = {
    id,
    name,
    scenarioId: scenario.id,
    seed: scenario.params.seed,
    t: 0,
    epoch: scenario.epoch,
    startDate: scenario.startDate,
    daysPerSecond: scenario.daysPerSecond,
    paused: false,
    speed: 1,
    params: { ...scenario.params },
    countries: {},
    parties: {},
    characters: {},
    companies: {},
    exchanges: {},
    markets: {
      exchanges: [],
      sentiment: scenario.overrides.global?.riskAppetite && scenario.overrides.global.riskAppetite > 55 ? "bullish" : scenario.overrides.global?.riskAppetite && scenario.overrides.global.riskAppetite < 35 ? "bearish" : "neutral",
      riskAppetite: scenario.overrides.global?.riskAppetite ?? 50,
      creditSpreads: scenario.year <= 1930 ? 0.02 : 0.012,
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
  };

  // ---- 1. Base countries, then the era rewrites who controls what ----------
  const polityById = new Map<string, HistoricalPolity>();
  if (era) for (const p of era.polities) polityById.set(p.id, p);

  const patch = scenario.overrides.countries ?? {};
  const built: Country[] = [];
  const pendingCharacters: Character[] = [];

  for (const iso3 of ALL_ISO3) {
    const row = COUNTRY_BY_ISO3[iso3];
    if (!row) continue;
    const p = patch[iso3] ?? {};
    if (p.exists === false) continue;

    const numeric = row[0];
    const controller = era ? era.control[numeric] : undefined;

    // If an era polity other than this country controls its land, it is not an
    // independent state in that year. We still build it (so it renders on the
    // map as an occupied or colonial possession) but it is not playable.
    const isColony = Boolean(controller) && controller !== iso3;

    const country = buildCountry(iso3, row, rnd, {
      government: p.government ?? (controller && controller === iso3 ? polityById.get(iso3)?.government : undefined),
      name: p.name,
      formalName: p.formalName,
      ideology: p.ideology ?? (controller === iso3 ? polityById.get(iso3)?.ideology : undefined),
      bloc: p.bloc ?? (controller === iso3 ? polityById.get(iso3)?.bloc : undefined),
      archetype: ARCHETYPE_OVERRIDES[iso3],
      scen: scenario,
      era,
      polity: controller === iso3 ? polityById.get(iso3) : undefined,
      econOverrides: p.economyMultipliers,
      econSet: p.economySet,
      military: p.military,
      isColony,
      colour: p.colour,
      dependencies: p.dependencies,
    }, pendingCharacters);

    if (isColony && controller) country.overlord = controller;
    built.push(country);
  }

  // ---- 2. Eras introduce polities the modern map does not have -------------
  if (era) {
    for (const pol of era.polities) {
      // Only add polities that are actually exercising control somewhere.
      const controlsSomething = Object.values(era.control).some((c) => c === pol.id);
      if (!controlsSomething) continue;
      if (built.some((c) => c.id === pol.id)) continue;
      built.push(buildHistoricalPolityCountry(pol, rnd, scenario, era, pendingCharacters));
    }
  }

  for (const c of built) {
    world.countries[c.id] = c;
    for (const p of c.parties) world.parties[p.id] = p;
  }
  for (const ch of pendingCharacters) world.characters[ch.id] = ch;

  // ---- 3. Relationships ----------------------------------------------------
  wireRelations(world, rnd);
  wireDependencies(world, era);
  buildTradeNetwork(world, rnd);

  // ---- 4. Corporations -----------------------------------------------------
  for (const ex of EXCHANGES) {
    if (!world.countries[ex.country]) continue;
    const e: Exchange = {
      id: ex.id,
      name: ex.name,
      country: ex.country,
      index: 1000,
      indexYearAgo: 1000,
      listings: [],
      volatility: clamp(rnd.float(6, 34), 2, 80),
      breadth: rnd.float(35, 85),
      marketCap: 0,
      currency: ex.currency as Exchange["currency"],
    };
    world.exchanges[e.id] = e;
    world.markets.exchanges.push(e);
  }

  for (const seed of companiesForYear(scenario.year)) {
    if (!world.countries[seed.country] && !world.customCountries[seed.country]) {
      // A company in a state that does not exist in this scenario is skipped,
      // except where it is a dependency's business which we keep as-is.
      if (!isKnownCountry(seed.country)) continue;
    }
    const co = materialiseCompany(seed, world, rnd, scenario);
    world.companies[co.id] = co;
    if (co.listed && co.exchangeId && world.exchanges[co.exchangeId]) {
      world.exchanges[co.exchangeId].listings.push(co.id);
      world.exchanges[co.exchangeId].marketCap += co.valuation;
    }
  }

  // ---- 5. Wars, treaties --------------------------------------------------
  for (const w of WARS_BY_YEAR[scenario.year] ?? []) {
    const war: War = {
      id: `war-${w.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: w.name,
      startedAt: w.startedAt,
      phase: w.phase,
      belligerents: w.belligerents,
      cause: w.cause,
      fronts: w.fronts.map((f, i) => ({ ...f, id: `front-${i}`, contestedOutput: 0, openedAt: 0, attritionRate: 0.0004 })),
      exhaustion: w.exhaustion ?? {},
      casualties: w.casualties ?? {},
      materiel: {},
      warGoal: w.warGoal ?? "",
      publicSupport: Object.fromEntries(Object.keys(w.belligerents).map((k) => [k, rnd.float(35, 78)])),
    };
    world.wars[war.id] = war;
    for (const b of Object.keys(war.belligerents)) {
      if (world.countries[b]) world.countries[b].wars.push(war.id);
    }
  }

  for (const t of TREATIES_BY_YEAR[scenario.year] ?? []) {
    const parties = t.parties.filter((p) => world.countries[p] || polityById.has(p));
    if (parties.length < 2) continue;
    const tr: Treaty = {
      id: `treaty-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: t.name,
      kind: t.kind,
      parties,
      signedAt: -86400,
      terms: t.terms,
      tradeBonus: t.tradeBonus ?? 0,
      favourability: Object.fromEntries(parties.map((p) => [p, rnd.float(10, 60)])),
      active: true,
    };
    world.treaties[tr.id] = tr;
    if (tr.kind === "alliance" || tr.kind === "defensive-pact" || tr.kind === "entente") {
      for (const a of parties) {
        for (const b of parties) {
          if (a === b) continue;
          const ca = world.countries[a];
          if (!ca) continue;
          ca.relations[b] = clamp((ca.relations[b] ?? 0) + 42, -100, 100);
          if (!ca.alliances.includes(b)) ca.alliances.push(b);
        }
      }
    }
  }

  // ---- 6. Aggregates -------------------------------------------------------
  recomputeGlobals(world);
  pushEvent(world, { kind: "system", severity: "notice", title: `World "${name}" created`, body: `Scenario ${scenario.name} (${scenario.year}) with ${Object.keys(world.countries).length} polities and ${Object.keys(world.companies).length} corporations.`, tags: ["system"] });

  return world;
}

function isKnownCountry(iso3: string): boolean {
  return Boolean(COUNTRY_BY_ISO3[iso3]);
}

interface BuildCountryOpts {
  government?: GovernmentType;
  name?: string;
  formalName?: string;
  ideology?: number;
  bloc?: Bloc;
  archetype?: string;
  scen: Scenario;
  era?: EraDefinition;
  polity?: HistoricalPolity;
  econOverrides?: Partial<{ gdp: number; gdpPerCapita: number; population: number }>;
  econSet?: Partial<{ gdp: number; gdpPerCapita: number; population: number; unemployment: number; inflation: number; productivity: number; corruption: number; debtToGdp: number; policyRate: number; debt: number; reserves: number }>;
  military?: Partial<MilitaryState> & { activeDuty?: number; spend?: number; doctrine?: number; nukes?: number };
  isColony?: boolean;
  colour?: string;
  dependencies?: Record<string, "colony" | "protectorate" | "mandate" | "dominion" | "occupation">;
}

export function buildCountry(iso3: string, row: readonly (string | number)[], rnd: Rng, o: BuildCountryOpts, out: Character[]): Country {
  const rawPop = (o.econSet?.population ?? row[8]) as number;
  const rawGdpPc = (o.econSet?.gdpPerCapita ?? row[9]) as number;
  // Restate the 2026 calibration into this scenario's year, unless the scenario
  // or era has supplied explicit figures (historical polities always do).
  const stated = o.polity ? { gdpPerCapita: rawGdpPc, population: 1 } : restateForYear(rawGdpPc, o.scen.year);
  const populationM = o.econSet?.population ?? Math.max(0.0005, rawPop * stated.population);
  const gdpPc = o.econSet?.gdpPerCapita ?? stated.gdpPerCapita;
  const archeId = o.archetype ?? pickArchetype(iso3, gdpPc, o.government ?? (row[7] as GovernmentType));
  const archetype = ARCHETYPES[archeId] ?? ARCHETYPES.mixed;

  let economy = buildEconomy(archetype, populationM, gdpPc, rnd, o.era);
  if (o.econSet) {
    if (o.econSet.gdpPerCapita !== undefined) economy.gdpPerCapita = o.econSet.gdpPerCapita;
    if (o.econSet.gdp !== undefined) economy.gdp = o.econSet.gdp;
    else economy.gdp = economy.population * economy.gdpPerCapita;
    if (o.econSet.unemployment !== undefined) economy.labour.unemployment = o.econSet.unemployment;
    if (o.econSet.inflation !== undefined) economy.monetary.inflation = o.econSet.inflation;
    if (o.econSet.productivity !== undefined) economy.productivity = o.econSet.productivity;
    if (o.econSet.corruption !== undefined) economy.corruption = o.econSet.corruption;
    if (o.econSet.debtToGdp !== undefined) {
      economy.fiscal.debtToGdp = o.econSet.debtToGdp;
      economy.fiscal.debt = economy.gdp * o.econSet.debtToGdp;
    }
    if (o.econSet.policyRate !== undefined) economy.monetary.policyRate = o.econSet.policyRate;
    if (o.econSet.debt !== undefined) economy.fiscal.debt = o.econSet.debt;
    if (o.econSet.reserves !== undefined) economy.reserves = o.econSet.reserves;
  }
  economy.gdpPerCapita = economy.gdp / economy.population;

  const gov: GovernmentType = o.isColony ? "dependency" : o.government ?? (row[7] as GovernmentType);
  const titles = GOVERNMENT_TITLES[gov] ?? GOVERNMENT_TITLES['parliamentary-republic'];
  const chambers = chambersFor(gov, populationM);
  const ideology = o.ideology ?? (row[10] as number);
  const parties = buildParties(iso3, gov, ideology, rnd, chambers, o.polity?.name ?? "Ruling Party");

  const characters: Character[] = out;
  const local: Character[] = [];
  const pushChar = (role: CharacterRole, name: string, partyId?: string, competence = 0): Character => {
    const c: Character = {
      id: `ch-${iso3}-${local.length}`,
      name,
      country: iso3,
      role,
      partyId,
      stats: statsFor(rnd, ideology, competence),
      historical: Boolean(o.polity && role === "head-of-state"),
      createdAt: 0,
    };
    local.push(c);
    characters.push(c);
    return c;
  };

  const hos = pushChar("head-of-state", o.polity?.leader ?? nameFor(iso3, rnd), parties[0]?.id, o.polity ? 30 : 0);
  const hog = pushChar(o.polity?.leaderTitle ? "head-of-government" : titles.hog.toLowerCase().includes("president") ? "head-of-state" : "head-of-government", o.polity?.leader ?? nameFor(iso3, rnd), parties[0]?.id, o.polity ? 26 : 0);

  const executive: ExecutiveBranch = {
    headOfStateId: hos.id,
    headOfStateTitle: o.polity?.leaderTitle ?? titles.hos,
    headOfGovernmentId: hog.id,
    headOfGovernmentTitle: titles.hog,
    ministers: MINISTRIES.map((area) => ({ id: area, title: MINISTER_TITLES[area], partyId: parties[0]?.id })),
    coalition: parties.filter((p) => p.status === "government").map((p) => p.id),
    approval: clamp(rnd.float(28, 72), 5, 95),
    confidence: rnd.float(45, 85),
    emergencyPowers: false,
  };

  const legislature: Legislature | undefined =
    gov === "one-party-state" || gov === "absolute-monarchy" || gov === "theocracy"
      ? { chambers, membership: Object.fromEntries(chambers.map((c) => [c.id, []])), committees: buildCommittees(chambers, rnd), session: 1, activeBills: [] }
      : { chambers, membership: Object.fromEntries(chambers.map((c) => [c.id, []])), committees: buildCommittees(chambers, rnd), session: 1, activeBills: [] };

  const courts: Court[] = [
    { id: `court-${iso3}-supreme`, name: gov === "one-party-state" ? "People's Supreme Court" : "Supreme Court", ideology: clamp(ideology * 0.3 + rnd.normal() * 20, -100, 100), judges: [], docket: [] },
  ];

  let military = buildMilitary(gov, economy.gdp, rnd, o.military?.nukes ?? 0);
  if (o.military) military = { ...military, ...o.military } as MilitaryState;

  const country: Country = {
    id: iso3,
    iso2: row[2] as string,
    isoNumeric: row[0] as string,
    name: o.name ?? (o.polity?.name ?? (row[3] as string)),
    formalName: o.formalName ?? o.polity?.formalName,
    demonym: (row[4] as string) || iso3,
    continent: row[5] as Country["continent"],
    region: row[6] as Country["region"],
    mapColor: o.colour ?? o.polity?.colour ?? colourForCountry(iso3),
    government: gov,
    headOfStateTitle: executive.headOfStateTitle,
    headOfGovernmentTitle: executive.headOfGovernmentTitle,
    legislature,
    executive,
    parties,
    courts,
    referendums: [],
    elections: [],
    military,
    economy,
    relations: {},
    alliances: [],
    wars: [],
    dependencies: o.dependencies ?? {},
    ideology,
    bloc: o.bloc ?? (row[11] as Bloc),
    cohesion: rnd.float(48, 94),
    unrestRisk: clamp(0.01 + archetype.corruption * 0.05, 0.005, 0.09),
    unrest: [],
    flagEmoji: flagEmoji(iso3),
    nukes: o.military?.nukes ?? 0,
    sanctions: [],
    policies: Object.fromEntries(MINISTRIES.map((m) => [m, clamp(ideology + rnd.normal() * 10, -100, 100)])) as Record<PolicyArea, number>,
  };

  if (o.polity) {
    // Historical polities carry real figures for their own year, which may be a
    // completely different scale from the 2026 baseline the economy was built
    // from. Capture the old GDP first -- rescaleEconomy needs it as the divisor.
    const targetGdp = o.polity.population * M * o.polity.gdpPerCapita;
    country.economy.population = o.polity.population * M;
    country.economy.gdpPerCapita = o.polity.gdpPerCapita;
    country.economy.gdp = targetGdp;
    country.economy = rescaleEconomy(country.economy, targetGdp, o.scen);
  }

  // Court judges.
  for (let i = 0; i < rnd.int(5, 11); i++) {
    const j = pushChar("judge", nameFor(iso3, rnd));
    j.stats.ideology = Math.round(clamp(courts[0].ideology + rnd.normal() * 16, -100, 100));
    courts[0].judges.push(j.id);
  }
  // Party leaders.
  for (const p of parties) {
    const l = pushChar("party-leader", nameFor(iso3, rnd), p.id, 10);
    p.leaderId = l.id;
  }
  // Ministers.
  for (const m of executive.ministers) {
    m.characterId = pushChar("minister", nameFor(iso3, rnd), m.partyId ?? parties[0]?.id).id;
  }
  // Central banker.
  pushChar("central-banker", nameFor(iso3, rnd));

  return country;
}

function rescaleEconomy(e: EconomyState, newGdp: number, scenario: Scenario): EconomyState {
  const k = newGdp / (e.gdp || 1);
  e.gdp = newGdp;
  e.gdpPerCapita = e.gdp / e.population;
  e.fiscal.revenue *= k;
  e.fiscal.expenditure *= k;
  e.fiscal.taxIncome *= k;
  e.fiscal.corporateTax *= k;
  e.fiscal.vat *= k;
  e.fiscal.tariffs *= k;
  e.fiscal.resourceRent *= k;
  e.fiscal.military *= k;
  e.fiscal.welfare *= k;
  e.fiscal.infrastructure *= k;
  e.fiscal.education *= k;
  e.fiscal.healthcare *= k;
  e.fiscal.administration *= k;
  e.fiscal.treasury *= k;
  e.fiscal.debt *= k;
  e.fiscal.debtToGdp = e.fiscal.debt / newGdp;
  e.trade.exports *= k;
  e.trade.imports *= k;
  e.rd *= k;
  e.reserves *= k;
  e.netForeignAssets *= k;
  void scenario;
  return e;
}

function buildHistoricalPolityCountry(pol: HistoricalPolity, rnd: Rng, scenario: Scenario, era: EraDefinition, out: Character[]): Country {
  const numeric = findNumericForPolity(pol, era);
  const pseudoRow: (string | number)[] = [numeric, pol.id, pol.id.slice(0, 2), pol.name, pol.name, "Europe", "europe", pol.government, pol.population, pol.gdpPerCapita, pol.ideology, pol.bloc];
  const c = buildCountry(pol.id, pseudoRow, rnd, {
    government: pol.government,
    name: pol.name,
    formalName: pol.formalName,
    ideology: pol.ideology,
    bloc: pol.bloc,
    scen: scenario,
    era,
    polity: pol,
    colour: pol.colour,
  }, out);
  c.dependencies = {};
  return c;
}

function findNumericForPolity(pol: HistoricalPolity, era: EraDefinition): string {
  const match = Object.entries(era.control).find(([, controller]) => controller === pol.id);
  return match ? match[0] : "001";
}

function pickArchetype(iso3: string, gdpPc: number, gov: GovernmentType): string {
  if (ARCHETYPE_OVERRIDES[iso3]) return ARCHETYPE_OVERRIDES[iso3];
  if (gov === "one-party-state" && gdpPc < 8000) return "planned";
  if (gov === "military-junta") return "command";
  if (gov === "theocracy") return "command";
  if (gdpPc > 42000) return "postindustrial";
  if (gdpPc > 22000) return "service";
  if (gdpPc > 9000) return "mixed";
  if (gdpPc > 3200) return "industrial";
  return "agrarian";
}

const FLAG_EMOJI: Record<string, string> = {
  USA: "🇺🇸", GBR: "🇬🇧", FRA: "🇫🇷", DEU: "🇩🇪", ITA: "🇮🇹", ESP: "🇪🇸", RUS: "🇷🇺", CHN: "🇨🇳", JPN: "🇯🇵",
  IND: "🇮🇳", BRA: "🇧🇷", CAN: "🇨🇦", AUS: "🇦🇺", MEX: "🇲🇽", ZAF: "🇿🇦", SAU: "🇸🇦", TUR: "🇹🇷",
  KOR: "🇰🇷", IDN: "🇮🇩", NGA: "🇳🇬", EGY: "🇪🇬", PAK: "🇵🇰", BGD: "🇧🇩", VNM: "🇻🇳", THA: "🇹🇭",
  KOR2: "🇰🇷", POL: "🇵🇱", UKR: "🇺🇦", SWE: "🇸🇪", NOR: "🇳🇴", FIN: "🇫🇮", DNK: "🇩🇰", NLD: "🇳🇱",
  BEL: "🇧🇪", CHE: "🇨🇭", AUT: "🇦🇹", PRT: "🇵🇹", GRC: "🇬🇷", ROU: "🇷🇴", HUN: "🇭🇺", CZE: "🇨🇿",
  SWZ: "🇸🇿", IRL: "🇮🇪", LUX: "🇱🇺", ISR: "🇮🇱", IRN: "🇮🇷", IRQ: "🇮🇶", ARE: "🇦🇪", QAT: "🇶🇦",
  KWT: "🇰🇼", OMN: "🇴🇲", BHR: "🇧🇭", LBN: "🇱🇧", SYR: "🇸🇾", YEM: "🇾🇪", JOR: "🇯🇴", MAR: "🇲🇦",
};
function flagEmoji(iso3: string): string {
  if (FLAG_EMOJI[iso3]) return FLAG_EMOJI[iso3];
  const row = COUNTRY_BY_ISO3[iso3];
  if (!row) return "🏳️";
  const iso2 = row[2] as string;
  if (iso2.length !== 2 || !/^[A-Z]{2}$/.test(iso2)) return "🏳️";
  return String.fromCodePoint(...[...iso2].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

export { rescaleEconomy, chambersFor, pickArchetype };

// ===========================================================================
// Wiring
// ===========================================================================

function wireRelations(world: World, rnd: Rng): void {
  const ids = Object.keys(world.countries);
  const blocBase: Record<string, number> = {
    nato: 40, "european-union": 32, csto: 30, "warsaw-pact": 25, brics: 24, asean: 30,
    oic: 26, au: 24, "non-aligned": 14, mercosur: 28, usmca: 34, none: 0,
    "gulf-cooperation-council": 30, sco: 24, "european-echelon": 18, comecon: 26, "allies": 30, "entente": 22,
    "soviet-bloc": 18, "british-empire": 20, "central-powers": -34,
  };

  for (const a of ids) {
    const ca = world.countries[a];
    for (const b of ids) {
      if (a === b) continue;
      const cb = world.countries[b];
      let base = 0;
      if (ca.bloc === cb.bloc) base += (blocBase[ca.bloc] ?? 20) * 0.7;
      else base -= 14;

      // Geography matters more than ideology in practice.
      if (ca.region === cb.region) base += 12;
      if (ca.continent === cb.continent && ca.region !== cb.region) base += 4;
      const dc = Math.abs(latOf(a) - latOf(b));
      const dl = Math.abs(lonOf(a) - lonOf(b));
      if (dc < 22 && dl < 34) base += 18;

      // Shared borders create friction as well as familiarity.
      if (sharesBorder(a, b)) base -= 10;

      // Ideological distance.
      base -= (Math.abs(ca.ideology - cb.ideology) / 100) * 22;
      // Power asymmetry: small states near large ones are wary.
      const ratio = cb.economy.gdp / ca.economy.gdp;
      if (ratio > 40 && ca.region === cb.region) base -= 8;

      ca.relations[b] = Math.round(clamp(base + rnd.normal() * 16, -100, 100));
    }
  }
}

const CENTROIDS: Record<string, [number, number]> = {
  USA: [39, -98], CAN: [57, -106], MEX: [23, -102], BRA: [-10, -55], ARG: [-35, -64],
  CHL: [-33, -71], COL: [4, -73], PER: [-10, -76], VEN: [7, -66], BOL: [-17, -64], URY: [-33, -56], ECU: [-2, -78],
  GBR: [54, -2], IRL: [53, -8], FRA: [47, 2], DEU: [51, 10], NLD: [52, 5], BEL: [51, 4], LUX: [50, 6],
  CHE: [47, 8], AUT: [48, 14], ITA: [43, 13], ESP: [40, -4], PRT: [40, -8], GRC: [39, 22],
  POL: [52, 19], CZE: [50, 15], SVK: [49, 19], HUN: [47, 20], ROU: [46, 25], BGR: [43, 25],
  SRB: [44, 21], HRV: [45, 17], SVN: [46, 15], BIH: [44, 18], MNE: [43, 19], MKD: [42, 22], ALB: [41, 20],
  FIN: [64, 26], SWE: [62, 15], NOR: [61, 9], DNK: [56, 10], ISL: [65, -18], EST: [59, 26], LVA: [57, 25],
  LTU: [56, 24], BLR: [53, 28], UKR: [49, 32], RUS: [61, 90], KAZ: [48, 68], UZB: [41, 64],
  TUR: [39, 35], SYR: [35, 38], IRQ: [33, 43], IRN: [32, 53], AFG: [34, 66], PAK: [30, 70],
  IND: [22, 79], BGD: [24, 90], NPL: [28, 84], LKA: [7, 81], MMR: [21, 96], THA: [15, 101],
  LAO: [18, 105], KHM: [13, 105], VNM: [16, 107], CHN: [35, 104], MNG: [47, 105], KOR: [37, 128],
  JPN: [36, 138], TWN: [24, 121], PHL: [13, 122], IDN: [-2, 118], MYS: [4, 102], SGP: [1, 104],
  SAU: [24, 45], ARE: [24, 54], QAT: [25, 51], KWT: [29, 47], BHR: [26, 50], OMN: [21, 57],
  YEM: [15, 47], JOR: [31, 36], LBN: [34, 36], ISR: [31, 35], EGY: [27, 30], LBY: [27, 17],
  ZAF: [-29, 24], NGA: [9, 8], ETH: [9, 40], KEN: [0, 38], TZA: [-6, 35], COD: [-3, 24],
  DZA: [28, 3], MAR: [32, -6], AGO: [-12, 18], SDN: [15, 30], SOM: [5, 46], UGA: [1, 32],
  AUS: [-25, 134], NZL: [-41, 174], PNG: [-6, 144],
  CUB: [22, -80], RUS2: [61, 90], USS: [61, 90], YUG: [45, 20], OTT: [39, 35],
};
function latOf(iso3: string): number {
  return CENTROIDS[iso3]?.[0] ?? 0;
}
function lonOf(iso3: string): number {
  return CENTROIDS[iso3]?.[1] ?? 0;
}

const BORDER_GROUPS: string[][] = [
  ["USA", "CAN", "MEX"], ["CAN", "GRL"], ["MEX", "GTM", "BLZ"], ["GTM", "BLZ", "HND", "SLV", "NIC", "CRI"],
  ["HND", "NIC"], ["NIC", "CRI", "PAN"], ["PAN", "COL", "CRI"], ["COL", "VEN", "BRA", "PER", "ECU"],
  ["BRA", "PER", "BOL", "PRY", "URY", "ARG", "VEN", "GUY", "SUR", "GUF"], ["BOL", "PRY", "ARG", "CHL"],
  ["ARG", "CHL"], ["CHL", "PER"], ["PRY", "BOL"],
  ["GBR", "IRL"], ["FRA", "ESP", "ITA", "DEU", "BEL", "CHE", "AUT", "LUX", "NLD", "MCO"],
  ["ESP", "PRT", "AND", "MAR"], ["FRA", "DEU", "CHE", "ITA", "BEL", "LUX", "MON"],
  ["ITA", "AUT", "SMR", "VAT", "SVN"], ["AUT", "SVN", "HUN", "CZE", "ITA", "DEU", "SVK"],
  ["DEU", "POL", "CZE", "AUT", "CHE", "NED", "LUX", "BEL", "FRA"],
  ["POL", "RUS", "BLR", "UKR", "LTU", "SVK", "CZE", "DEU", "LVA"],
  ["UKR", "RUS", "BLR", "ROU", "MDA", "HUN", "SVK", "POL"],
  ["ROU", "BGR", "SRB", "HUN", "UKR", "MDA"], ["BGR", "GRC", "TUR", "SRB", "ROU", "ALB", "MKD"],
  ["GRC", "ALB", "MKD", "BGR", "TUR"], ["SRB", "BIH", "HRV", "MNE", "KOS", "MKD", "ALB", "ROU", "BGR"],
  ["HRV", "BIH", "MNE", "HUN"], ["SVN", "AUT", "ITA", "HRV", "HUN"],
  ["LTU", "LVA", "BLR", "RUS", "POL"], ["LVA", "EST", "RUS", "BLR"], ["EST", "RUS", "LVA"],
  ["SWE", "NOR", "FIN"], ["FIN", "RUS", "SWE", "NOR", "EST"], ["DNK", "DEU", "SWE", "NOR", "GBR"],
  ["GBR", "FRA", "NLD", "BEL", "DNK"], ["NOR", "RUS", "FIN", "SWE"],
  ["TUR", "SYR", "IRQ", "IRN", "BGR", "GRC", "ARM", "AZE", "GEO"],
  ["ARM", "AZE", "TUR", "IRN", "GEO", "RUS"], ["AZE", "RUS", "GEO", "ARM", "IRN", "TUR"],
  ["GEO", "RUS", "AZE", "ARM", "TUR"], ["IRN", "IRQ", "TUR", "ARM", "AZE", "AFG", "PAK", "TKM"],
  ["IRQ", "SYR", "JOR", "IRN", "SAU", "KWT", "TUR"], ["SYR", "JOR", "ISR", "LBN", "IRQ", "TUR"],
  ["ISR", "JOR", "SYR", "EGY", "LBN", "PSE"], ["LBN", "SYR", "ISR"], ["JOR", "ISR", "SYR", "SAU", "IRQ", "EGY"],
  ["SAU", "JOR", "IRQ", "KWT", "QAT", "ARE", "OMN", "YEM"], ["ARE", "OMN", "SAU"],
  ["KWT", "IRQ", "SAU"], ["QAT", "SAU"], ["OMN", "ARE", "SAU", "YEM"], ["YEM", "SAU", "OMN"],
  ["EGY", "ISR", "PSE", "JOR", "SDN", "LBY"], ["SDN", "EGY", "LBY", "TCD", "ERI", "ETH"],
  ["LBY", "TCD", "NER", "DZA", "TUN", "EGY", "SDN"], ["DZA", "TUN", "LBY", "NER", "MLI", "MRT"],
  ["TUN", "DZA", "LYA"], ["NER", "MLI", "BFA", "TCD", "NGA", "BEN", "NGA"],
  ["MLI", "SEN", "GMB", "GUI", "CIV", "GIN", "NER", "BFA"], ["SEN", "GMB", "MRT", "MLI", "GIN"],
  ["CIV", "GHA", "BFA", "MLI", "GIN", "LBR", "SEN"], ["GHA", "TGO", "BEN", "BFA", "CIV"],
  ["BEN", "NGA", "TGO", "NGA"], ["NGA", "CMR", "TCD", "NER", "BEN"], ["CMR", "TCD", "CAF", "COD", "GAB", "GNQ"],
  ["COD", "UGA", "RWA", "BDI", "TZA", "ZMB", "AGO", "COG"], ["UGA", "KEN", "SSD", "COD", "TZA"],
  ["KEN", "ETH", "SSD", "TZA", "UGA", "SOM"], ["ETH", "ERI", "DJI", "SOM", "KEN", "SDN"],
  ["TZA", "KEN", "MWI", "MOZ", "ZMB", "RWA", "BDI", "UGA"], ["MOZ", "ZMB", "MWI", "ZWE", "SWZ", "ZAF"],
  ["ZAF", "MOZ", "ZWE", "SWZ", "LSO", "NAM"], ["AGO", "COD", "ZMB", "NAM"], ["COG", "GAB", "CMR", "CAF", "COD", "AGO"],
  ["ZMB", "COD", "AGO"], ["ZWE", "MOZ", "ZAF", "BWA"], ["BWA", "NAM", "ZAF", "ZMB"],
  ["LSO", "ZAF"], ["SWZ", "MOZ", "ZAF"],
  ["RUS", "CHN", "MNG", "KAZ", "KGZ", "TJK", "AFG", "PRK", "ARE"], ["CHN", "PRK", "RUS", "MNG", "AFG", "PAK", "IND", "MMR", "LAO", "VNM"],
  ["PRK", "KOR", "CHN"], ["KOR", "JPN"], ["IND", "PAK", "CHN", "NPL", "BGD", "MMR"],
  ["PAK", "AFG", "IND", "IRN", "CHN"], ["NPL", "IND", "CHN"],
  ["MMR", "THA", "LAO", "CHN", "IND", "BGD"], ["THA", "LAO", "KHM", "MMR", "MYS"],
  ["LAO", "VNM", "KHM", "THA", "CHN"], ["VNM", "KHM", "LAO", "CHN"], ["KHM", "THA", "VNM", "LAO"],
  ["MYS", "IDN", "BRN", "THA", "SGP"], ["IDN", "TLS", "MYS", "PNG"], ["BRN", "MYS"],
  ["PHL", "JPN", "TWN"], ["PNG", "IDN"],
  ["SAU", "YEM", "OMN"], ["GHA", "TGO"],
];
const BORDER_SET = new Set<string>();
for (const g of BORDER_GROUPS) {
  for (let i = 0; i < g.length; i++) {
    for (let j = i + 1; j < g.length; j++) BORDER_SET.add(`${g[i]}|${g[j]}`);
  }
}
function sharesBorder(a: string, b: string): boolean {
  return BORDER_SET.has(`${a}|${b}`) || BORDER_SET.has(`${b}|${a}`);
}

function wireDependencies(world: World, era: EraDefinition | undefined): void {
  if (era) {
    for (const [polId, deps] of Object.entries(era.dependencies)) {
      const overlord = world.countries[polId];
      if (!overlord) continue;
      for (const [depId, type] of Object.entries(deps)) {
        const dep = world.countries[depId];
        if (!dep) continue;
        dep.overlord = polId;
        dep.government =
          type === "dominion" ? "constitutional-monarchy"
          : type === "occupation" ? "occupied-territory"
          : type === "protectorate" ? "protectorate"
          : type === "mandate" ? "mandate-colony"
          : "dependency";
        // A possession pays tribute rather than running its own fiscal policy,
        // but it still has an economy worth watching in the panel.
        dep.economy.fiscal.expenditure = dep.economy.fiscal.revenue * 0.7;
        overlord.dependencies[depId] = type;
      }
    }
  }
  for (const c of Object.values(world.countries)) {
    if (c.overlord) c.bloc = world.countries[c.overlord]?.bloc ?? c.bloc;
  }
}

function buildTradeNetwork(world: World, rnd: Rng): void {
  const ids = Object.keys(world.countries).filter((id) => !world.countries[id].overlord);
  // Gravity model: distance decays, size multiplies, relations damp hostility.
  for (const a of ids) {
    const ca = world.countries[a];
    const openA = ca.economy.trade.tradeOpenness / 100;
    let total = 0;
    const partners: { id: string; volume: number }[] = [];
    for (const b of ids) {
      if (a === b) continue;
      const cb = world.countries[b];
      if (cb.overlord === a || ca.overlord === b) continue;
      const openB = cb.economy.trade.tradeOpenness / 100;
      if (openA < 0.02 && openB < 0.02) continue;

      const dl = Math.abs(latOf(a) - latOf(b));
      const dist = Math.max(1, Math.sqrt(dl * dl + (lonOf(a) - lonOf(b)) ** 2));
      const rel = ca.relations[b] ?? 0;
      const gravity = (ca.economy.gdp * cb.economy.gdp) / (dist ** 1.5);
      const volume = gravity * openA * openB * (0.4 + (rel + 100) / 200) * 1e-9 * rnd.float(0.7, 1.3);
      if (volume <= 0) continue;
      partners.push({ id: b, volume });
      total += volume;
      ca.economy.trade.flows[b] = volume;
      cb.economy.trade.flows[a] = (cb.economy.trade.flows[a] ?? 0) + volume;
    }
    partners.sort((x, y) => y.volume - x.volume);
    ca.economy.trade.exportPartners = partners.slice(0, 12).map((p) => p.id);
    ca.economy.trade.importPartners = partners.slice(0, 12).map((p) => p.id);
    if (total > 0) {
      const target = ca.economy.trade.exports;
      const k = target / total;
      ca.economy.trade.exports = total * k;
      ca.economy.trade.imports = total * k * rnd.float(0.9, 1.1);
      ca.economy.trade.tradeBalance = ca.economy.trade.exports - ca.economy.trade.imports;
      for (const p of partners) ca.economy.trade.flows[p.id] = p.volume * k;
    }
  }
}

function materialiseCompany(seed: import("../shared/types").CompanySeed, world: World, rnd: Rng, scenario: Scenario): Company {
  const marginBase = SECTORS[seed.sector].margin;
  const margin = marginBase * rnd.float(0.6, 1.5);
  const profit = seed.revenue * margin;
  const foundedYear = seed.foundedYear ?? scenario.year - 20;
  const age = Math.max(0, scenario.year - foundedYear);
  // Younger, high-tech firms trade at a higher multiple than mature industrials.
  const multiple = clamp(0.9 + age * 0.012 + (SECTORS[seed.sector].techIntensity - 0.3) * 3.4 - marginBase * 6, 0.35, 14);
  const valuation = seed.revenue * multiple + profit * multiple * 0.5;
  const exchangeId = seed.listed ? seed.exchange ?? defaultExchange(world, seed.country) : undefined;

  return {
    id: `co-${slug(seed.name)}`,
    name: seed.name,
    country: seed.country,
    sector: seed.sector,
    tier: seed.tier ?? (valuation > 1e12 ? "mega-cap" : valuation > 3e11 ? "large" : valuation > 5e10 ? "mid-cap" : "small"),
    valuation,
    revenue: seed.revenue,
    costs: seed.revenue - profit,
    profit,
    employees: seed.employees,
    debt: seed.revenue * rnd.float(0.05, 0.65),
    stateOwnership: seed.stateOwnership ?? 0,
    brandValue: seed.brandValue ?? valuation * rnd.float(0.05, 0.4),
    sharePrice: 100,
    sharePriceYearAgo: 100,
    board: [],
    shareholders: buildShareholders(seed, world, rnd),
    ownershipFloat: 1 - (seed.stateOwnership ?? 0),
    listed: Boolean(seed.listed),
    exchangeId,
    founded: -age * 365 * 86400,
    researchLevel: clamp((seed.rd ?? 0) / Math.max(1, seed.revenue) * 120 + rnd.float(0, 0.2), 0, 1),
    unionisation: rnd.float(0.05, 0.55),
    rd: seed.rd ?? seed.revenue * rnd.float(0.005, 0.05),
    environmentalScore: rnd.float(-40, 70),
    lobbyingPower: clamp((Math.log10(Math.max(10, valuation)) - 8) * 22 + rnd.float(-14, 22), 0, 100),
    dailyVolume: 0,
  };
}

function buildShareholders(seed: import("../shared/types").CompanySeed, world: World, rnd: Rng): import("../shared/types").Shareholder[] {
  const out: import("../shared/types").Shareholder[] = [];
  const so = seed.stateOwnership ?? 0;
  if (so > 0.01) out.push({ kind: "state", name: "State of " + (world.countries[seed.country]?.name ?? seed.country), stake: so, votingPower: so });
  const rest = 1 - so;
  const kinds: [string, number][] = [
    ["founder", 0.06],
    ["pension-fund", 0.1],
    ["retail", 0.06],
    ["bank", 0.06],
    ["insurance", 0.05],
    ["sovereign-wealth", 0.08],
    ["hedge-fund", 0.04],
    ["foreign", 0.06],
    ["retail2", 0.05],
  ];
  let left = rest;
  for (const [kind, share] of kinds) {
    if (left <= 0.005) break;
    const s = Math.min(left, Math.max(0.005, rest * share * rnd.float(0.3, 1.5)));
    out.push({ kind, name: SHAREHOLDER_NAMES[kind] ?? kind, stake: s, votingPower: s * rnd.float(0.6, 1) });
    left -= s;
  }
  if (left > 0.005) out.push({ kind: "retail", name: "Public float", stake: left, votingPower: left * 0.4 });
  return out;
}

const SHAREHOLDER_NAMES: Record<string, string> = {
  founder: "Founder and family",
  "pension-fund": "National Pension Reserve",
  retail: "Retail investors",
  bank: "Institutional banks",
  insurance: "Insurance companies",
  "sovereign-wealth": "Sovereign Wealth Fund",
  "hedge-fund": "Activist hedge funds",
  foreign: "Foreign strategic holders",
  retail2: "Employee share ownership",
};

function defaultExchange(world: World, country: string): string | undefined {
  const ex = Object.values(world.exchanges).find((e) => e.country === country);
  return ex?.id;
}

export function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function recomputeGlobals(world: World): void {
  let gdp = 0;
  let pop = 0;
  let inflWeighted = 0;
  let happyWeighted = 0;
  let conflict = 0;
  for (const c of Object.values(world.countries)) {
    if (c.overlord) continue;
    gdp += c.economy.gdp;
    pop += c.economy.population;
    inflWeighted += c.economy.monetary.inflation * c.economy.gdp;
    happyWeighted += (c.economy.labour.satisfaction * 0.5 + c.executive.approval * 0.5) * c.economy.gdp;
  }
  const wars = Object.values(world.wars);
  for (const w of wars) {
    let strength = 0;
    for (const b of Object.keys(w.belligerents)) {
      const c = world.countries[b];
      if (c) strength += c.military.activeDuty;
    }
    conflict += strength;
  }
  world.globals.globalGdp = gdp;
  world.globals.globalPopulation = pop;
  world.globals.globalInflation = gdp > 0 ? inflWeighted / gdp : 0;
  world.globals.worldHappiness = gdp > 0 ? happyWeighted / gdp : 0;
  world.globals.worldConflictIndex = Math.min(100, (conflict / Math.max(1e5, pop / 300)) * 100);

  // Cold war index: inverse relations between the two largest opposing blocs.
  const us = world.countries.USA;
  const ru = world.countries.RUS ?? world.countries.USS;
  if (us && ru) {
    const rel = us.relations[ru.id] ?? 0;
    const mil = clamp(Math.abs(us.military.readiness - 30) + Math.abs(ru.military.readiness - 30), 0, 140);
    world.globals.coldWarIndex = clamp((50 - rel) * 1.4 + mil * 0.3, 0, 100);
  }
}

export function pushEvent(
  world: World,
  e: { kind: import("../shared/types").WorldEvent["kind"]; severity: import("../shared/types").WorldEvent["severity"]; title: string; body: string; country?: string; actors?: string[]; byUserId?: string; tags?: string[] },
): import("../shared/types").WorldEvent {
  const ev: import("../shared/types").WorldEvent = {
    id: `ev-${world.events.length}-${Math.round(world.t)}`,
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
  if (world.events.length > 4000) world.events.splice(0, world.events.length - 4000);
  world.ticker.unshift({ t: world.t, text: e.title, kind: e.kind, country: e.country });
  if (world.ticker.length > 200) world.ticker.length = 200;
  return ev;
}