/**
 * CROWN shared type system.
 *
 * Everything in here is used by three consumers that must never disagree:
 *   - src/sim     the simulation engine (runs inside the Durable Object)
 *   - src/worker  the API, auth and permissions
 *   - src/web     the React UI
 *
 * Money is always stored in **minor units of a single abstract accounting unit**
 * called "credits" (integers). Scenario exchange rates convert credits to the
 * display currency so a 1900 world can show pounds, francs and yen without the
 * engine caring. See `ExchangeRate` below.
 */

// ===========================================================================
// Primitives
// ===========================================================================

/** Integer credits. 100 credits = 1 display-currency major unit. */
export type Credits = number;
/** 0..100 */
export type Percent = number;
/** Signed index points. */
export type Index = number;
/** Seconds since world epoch. */
export type SimSeconds = number;

export type Iso3 = string;
export type Iso2 = string;
/** ISO 3166-1 numeric, used to join country -> world-atlas topojson geometry. */
export type IsoNumeric = string;

export type EntityId = string;

// ===========================================================================
// Geography & polities
// ===========================================================================

export type Region =
  | "africa"
  | "americas"
  | "asia"
  | "europe"
  | "middle-east"
  | "oceania";

export type Continent =
  | "Africa"
  | "Asia"
  | "Europe"
  | "North America"
  | "South America"
  | "Oceania"
  | "Antarctica";

/**
 * How the executive is chosen and how much power it holds.
 * This drives the whole political UI: which chambers exist, who can veto,
 * whether there is a prime minister or a president, and whether the player can
 * even run for office.
 */
export type GovernmentType =
  | "absolute-monarchy"
  | "constitutional-monarchy"
  | "parliamentary-republic"
  | "semi-presidential-republic"
  | "presidential-republic"
  | "one-party-state"
  | "military-junta"
  | "monarchy-absolute-colonial"
  | "federal-republic"
  | "theocracy"
  | "confederation"
  | "protectorate"
  | "mandate-colony"
  | "dependency"
  | "occupied-territory"
  | "breakaway-state";

/** Which chamber(s) exist and what they can do. */
export interface LegislatureChamberConfig {
  id: string;
  name: string;
  /** "lower" | "upper" */
  kind: "lower" | "upper" | "unicameral";
  seats: number;
  /** Seats won by single-member geographic districts. */
  districtSeats: number;
  /** Seats won by proportional representation. */
  prSeats: number;
  /** Minimum share of votes for a seat, as a fraction. 0 = pure PR (list). */
  districtThreshold: number;
  /** Whether this chamber can originate money bills. */
  moneyBills: boolean;
  /** Whether this chamber can override a veto (and by how much margin). */
  vetoOverride: boolean;
  /** Term length in days of in-game time. */
  termDays: number;
  /** Election style for the chamber. */
  election: ElectionSystem;
  /** Only an upper chamber may confirm appointments / ratify treaties. */
  confirmsAppointments: boolean;
}

export type ElectionSystem =
  | "fptp"
  | "pr-list"
  | "mixed-member-proportional"
  | "proportional"
  | "first-past-two"
  | "single-member-transferable"
  | "indirect"
  | "legislative"
  | "none";

/** The 1D political axis used for coalition maths and public sentiment. */
export type Ideology =
  | "far-left"
  | "left"
  | "centre-left"
  | "centrist"
  | "centre-right"
  | "right"
  | "far-right";

export type Bloc =
  | "none"
  | "nato"
  | "european-union"
  | "european-echelon"
  | "csto"
  | "warsaw-pact"
  | "comecon"
  | "asean"
  | "au"
  | "mercosur"
  | "usmca"
  | "brics"
  | "sco"
  | "oic"
  | "gulf-cooperation-council"
  | "african-union"
  | "latin-american"
  | "british-empire"
  | "entente"
  | "central-powers"
  | "allies"
  | "soviet-bloc"
  | "non-aligned";

export type CurrencyCode =
  | "USD"
  | "GBP"
  | "EUR"
  | "JPY"
  | "CNY"
  | "RUB"
  | "CHF"
  | "INR"
  | "CAD"
  | "AUD"
  | "BRL"
  | "MXN"
  | "KRW"
  | "TRY"
  | "ZAR"
  | "SAR"
  | "AED"
  | "SEK"
  | "NOK"
  | "PLN"
  | "FRF"
  | "DEM"
  | "ITL"
  | "ESP"
  | "JPY-1930"
  | "CNH"
  | "GBP-1900"
  | "XAU"
  | "PTB"
  | "INR-1900"
  | "CNY-1950"
  | "RUB-1990"
  | "UAH"
  | "PLZ"
  | "CSK"
  | "TRL"
  | "VEF"
  | "MMK"
  | "GEL"
  | "AMD"
  | "AZN"
  | "KZT"
  | "TWD"
  | "HKD"
  | "KRW"
  | "SGD"
  | "IDR"
  | "THB"
  | "PHP"
  | "MYR"
  | "ILS"
  | "QAR"
  | "EGP"
  | "NGN"
  | "ARS"
  | "CLP"
  | "COP"
  | "PEN"
  | "TZS"
  | "ETB";

// ===========================================================================
// Economy
// ===========================================================================

export type SectorId =
  | "agriculture"
  | "mining"
  | "manufacturing"
  | "energy"
  | "utilities"
  | "construction"
  | "transport"
  | "retail"
  | "finance"
  | "real-estate"
  | "telecom"
  | "technology"
  | "healthcare"
  | "education"
  | "defence"
  | "tourism"
  | "media";

export const SECTOR_IDS: SectorId[] = [
  "agriculture",
  "mining",
  "manufacturing",
  "energy",
  "utilities",
  "construction",
  "transport",
  "retail",
  "finance",
  "real-estate",
  "telecom",
  "technology",
  "healthcare",
  "education",
  "defence",
  "tourism",
  "media",
];

export type MarketMood = "crash" | "bearish" | "neutral" | "bullish" | "euphoric";

export interface SectorState {
  id: SectorId;
  /** Share of national output, fraction 0..1. */
  share: number;
  /** Annual growth rate, fraction. e.g. 0.031 = 3.1% */
  growth: number;
  /** 0..100 productivity index. */
  productivity: number;
  /** Jobs employed by this sector. */
  employment: number;
  /** Extra modifier the state or a company can apply. */
  stateSubsidy: number;
  stateOwnership: number;
}

export interface FiscalState {
  /** Annual revenue across all streams. */
  revenue: number;
  taxIncome: number;
  corporateTax: number;
  vat: number;
  tariffs: number;
  resourceRent: number;
  /** Annual spending. */
  expenditure: number;
  military: number;
  welfare: number;
  infrastructure: number;
  education: number;
  healthcare: number;
  administration: number;
  debtService: number;
  /** Cumulative sovereign debt, credits. */
  debt: number;
  /** Net debt / GDP. */
  debtToGdp: number;
  /** Headroom before the market loses confidence, -1..1. */
  creditRating: number;
  /** 0..1 */
  budgetBalanceRatio: number;
  /** Funds the state can actually spend without issuing debt. */
  treasury: number;
}

export interface MonetaryState {
  policyRate: number;
  /** 0..1, money supply as multiple of base. */
  moneySupply: number;
  /** Annual inflation rate. */
  inflation: number;
  reserveRatio: number;
  centralBankRate: number;
  exchangeRateVsUsd: number;
  /** 0..100 confidence in the currency. */
  currencyConfidence: number;
}

export interface LabourState {
  /** 0..1 */
  unemployment: number;
  /** 0..1 */
  participation: number;
  /** 0..1 */
  unionisation: number;
  /** Average annual wage in credits. */
  medianWage: number;
  /** Wage change over the last year, fraction. */
  wageGrowth: number;
  /** 0..1 strike probability this month. */
  strikeRisk: number;
  /** 0..1 satisfaction, feeds approval. */
  satisfaction: number;
}

export interface TradeState {
  /** Credits of exports per year. */
  exports: number;
  imports: number;
  tradeBalance: number;
  /** Country ISO3 codes. */
  exportPartners: string[];
  importPartners: string[];
  /** 0..100 */
  tradeOpenness: number;
  /** Tariff rate on imports, fraction. */
  tariffRate: number;
  /** Country ISO3 -> annual bilateral trade volume in credits. */
  flows: Record<string, number>;
}

export interface EconomyState {
  gdp: number;
  gdpPerCapita: number;
  /** Annual real GDP growth, fraction. */
  gdpGrowth: number;
  /** Annual nominal growth including inflation. */
  nominalGrowth: number;
  population: number;
  /** 0..100 */
  productivity: number;
  /** 0..100 */
  debtRatingScore: number;
  fiscal: FiscalState;
  monetary: MonetaryState;
  labour: LabourState;
  trade: TradeState;
  sectors: SectorState[];
  /** Rolling annual history. */
  history: EconomyHistoryPoint[];
  /** 0..1 corruption, feeds unrest. */
  corruption: number;
  /** 0..1 inequality (gini-ish). */
  inequality: number;
  /** Net foreign assets, credits. */
  netForeignAssets: number;
  /** Stock of foreign reserves. */
  reserves: number;
  /** Annual research & development spending. */
  rd: number;
}

export interface EconomyHistoryPoint {
  /** Sim time in seconds. */
  t: number;
  gdp: number;
  gdpGrowth: number;
  inflation: number;
  unemployment: number;
  debtToGdp: number;
  /** Index of the main national stock exchange, 1000 at scenario start. */
  stockIndex: number;
}

// ===========================================================================
// People, parties, legislature
// ===========================================================================

export type CharacterRole =
  | "head-of-state"
  | "head-of-government"
  | "minister"
  | "legislator"
  | "committee-chair"
  | "judge"
  | "party-leader"
  | "general"
  | "admiral"
  | "central-banker"
  | "business-leader"
  | "board-member"
  | "shareholder"
  | "journalist"
  | "activist";

export type IdeologicalStrength = 0 | 1 | 2 | 3 | 4 | 5;

export interface CharacterStats {
  /** -100..100 */
  competence: number;
  /** -100..100 */
  charisma: number;
  /** -100..100 */
  integrity: number;
  /** -100..100 */
  ambition: number;
  /** -100..100 */
  ideology: number;
  /** 0..100 */
  popularity: number;
  /** 0..100 */
  experience: number;
  /** -100..100, higher = more radical */
  militancy: number;
}

export type PoliticalOffice =
  | "citizen"
  | "party-member"
  | "legislator"
  | "minister"
  | "judge"
  | "party-leader"
  | "head-of-state"
  | "head-of-government";

export interface Character {
  id: EntityId;
  name: string;
  /** Country ISO3 that this character acts for. */
  country: Iso3;
  role: CharacterRole;
  /** Party id, if any. */
  partyId?: EntityId;
  stats: CharacterStats;
  /** Character is user-controlled. */
  userId?: string;
  /** Current political office, for player-facing status. */
  office?: PoliticalOffice;
  /** Spendable campaign cash, credits. */
  funds?: number;
  /** 0..100 political influence in their party. */
  influence?: number;
  /** Set when a player or an admin has banned this character. */
  banned?: boolean;
  /** Real-world figure, used for scenario fidelity. */
  historical?: boolean;
  bio?: string;
  /** Seat in the legislature, chamber id. */
  chamberId?: string;
  districtId?: string;
  createdAt: SimSeconds;
  removedAt?: SimSeconds;
}

export interface Party {
  id: EntityId;
  country: Iso3;
  name: string;
  abbreviation: string;
  /** -100..100 */
  ideology: number;
  /** 0..100 */
  cohesion: number;
  /** 0..100 */
  popularity: number;
  color: string;
  leaderId?: EntityId;
  /** Seats by chamber id. */
  seats: Record<string, number>;
  treasury: number;
  memberCount: number;
  /** Government/opposition/official opposition/outside. */
  status: "government" | "opposition" | "official-opposition" | "outside" | "ruling";
  banned?: boolean;
  /** Party's declared positions per policy area. */
  platform: Record<PolicyArea, number>;
  founded: SimSeconds;
}

export type PolicyArea =
  | "economy"
  | "tax"
  | "welfare"
  | "health"
  | "education"
  | "environment"
  | "defence"
  | "immigration"
  | "foreign-policy"
  | "justice"
  | "technology"
  | "housing"
  | "energy"
  | "transport"
  | "agriculture"
  | "labour";

export interface Committee {
  id: EntityId;
  name: string;
  chamberId: string;
  /** Jurisdiction areas this committee can legislate in. */
  jurisdiction: PolicyArea[];
  chairId?: EntityId;
  memberIds: EntityId[];
  /** Committee's 0..100 influence over its jurisdiction. */
  power: number;
}

export type BillStatus =
  | "drafted"
  | "introduced"
  | "in-committee"
  | "passed-first"
  | "passed-both"
  | "awaiting-signature"
  | "enacted"
  | "vetoed"
  | "rejected"
  | "expired"
  | "overridden";

export type BillCategory = "money" | "ordinary" | "constitutional" | "emergency";

export interface BillEffect {
  /** Additive annual change to any economy path. */
  economy?: Partial<
    Pick<
      EconomyState,
      "corruption" | "inequality" | "rd" | "netForeignAssets" | "reserves"
    >
  >;
  /** Multiplicative deltas to fiscal lines. */
  fiscal?: Partial<FiscalState>;
  /** Annual deltas, absolute credits, to sectors by index. */
  sectorGrowth?: Record<string, number>;
  /** Labour effects. */
  labour?: Partial<Pick<LabourState, "unemployment" | "unionisation" | "medianWage">>;
  /** Approval delta at passage. */
  approval?: number;
  /** Party cohesion deltas by party id. */
  cohesion?: Record<string, number>;
  /** Hard clamps. */
  clamp?: Record<string, { min?: number; max?: number }>;
}

export interface BillVote {
  legislatorId: EntityId;
  partyId: EntityId;
  choice: "aye" | "nay" | "abstain" | "absent" | "present";
}

export interface Bill {
  id: EntityId;
  country: Iso3;
  title: string;
  summary: string;
  body: string;
  category: BillCategory;
  status: BillStatus;
  sponsorId: EntityId;
  sponsorPartyId: EntityId;
  chamberId: string;
  /** Chambers that must pass it. */
  passageChambers: string[];
  votes: BillVote[];
  /** Roll-call tallies by chamber. */
  tallies: Record<string, { aye: number; nay: number; abstain: number; absent: number }>;
  effects: BillEffect;
  cost: Credits;
  introducedAt: SimSeconds;
  expiresAt: SimSeconds;
  enactedAt?: SimSeconds;
  /** Votes the sponsor can rally. */
  whipStrength: number;
  publicOpinion: number;
  isEmergency?: boolean;
}

export interface Legislature {
  chambers: LegislatureChamberConfig[];
  /** Chamber id -> legislator ids. */
  membership: Record<string, EntityId[]>;
  committees: Committee[];
  /** Current legislative session number. */
  session: number;
  /** Ids of bills currently in this legislature. */
  activeBills: EntityId[];
}

export interface ExecutiveBranch {
  /** Head of state, e.g. monarch or president. */
  headOfStateId?: EntityId;
  headOfStateTitle: string;
  headOfGovernmentId?: EntityId;
  headOfGovernmentTitle: string;
  ministers: {
    /** PolicyArea */
    id: PolicyArea;
    title: string;
    characterId?: EntityId;
    partyId?: EntityId;
  }[];
  /** Ids of parties in the governing coalition. */
  coalition: EntityId[];
  /** 0..100 */
  approval: number;
  /** 0..100 how long the government has lasted, drives confidence. */
  confidence: number;
  nextConfidenceVoteAt?: SimSeconds;
  termEndsAt?: SimSeconds;
  emergencyPowers: boolean;
}

export interface Court {
  id: EntityId;
  name: string;
  /** -100..100 how much the court leans liberal vs populist. */
  ideology: number;
  judges: EntityId[];
  /** Pending cases. */
  docket: CourtCase[];
}

export interface CourtCase {
  id: EntityId;
  title: string;
  against: string;
  plaintiff: string;
  filedAt: SimSeconds;
  heardAt?: SimSeconds;
  ruling?: "upheld" | "struck-down" | "dismissed" | "pending";
  /** Bill id this case challenges. */
  billId?: EntityId;
}

export interface Referendum {
  id: EntityId;
  country: Iso3;
  question: string;
  calledBy: EntityId;
  at: SimSeconds;
  closesAt: SimSeconds;
  options: { id: string; label: string; yes: number }[];
  status: "scheduled" | "open" | "passed" | "rejected";
  turnout: number;
}

export type ElectionOffice = "chamber" | "head-of-state" | "head-of-government" | "party-leader";

export interface ElectionCandidate {
  id: EntityId;
  characterId?: EntityId;
  userId?: string;
  name: string;
  partyId?: EntityId;
  /** 0..100 national support. */
  support: number;
  /** Campaign cash available to this candidate. */
  funds: number;
  /** 0..100, decays between campaigns. */
  momentum: number;
  registeredAt: SimSeconds;
  lastCampaignAt?: SimSeconds;
  isPlayer?: boolean;
}

export interface Election {
  id: EntityId;
  country: Iso3;
  chamberId: string;
  kind: ElectionSystem;
  /** What is actually being elected. Defaults to the chamber for old saves. */
  office?: ElectionOffice;
  /** Party leadership contests use this. */
  partyId?: EntityId;
  candidates?: ElectionCandidate[];
  winnerId?: EntityId;
  result?: { characterId?: EntityId; name: string; partyId?: EntityId; support: number }[];
  scheduledAt: SimSeconds;
  startedAt?: SimSeconds;
  endsAt: SimSeconds;
  status: "scheduled" | "campaign" | "running" | "counting" | "complete";
  /** District id -> party id -> votes. */
  votes: Record<string, Record<string, number>>;
  /** Turnout by district. */
  turnout: Record<string, number>;
  /** Number of electoral districts. */
  districtCount: number;
  /** Districts are allocated across the country by population share. */
  districtPopulations: number[];
  /** Projected seat count by party once complete. */
  projection: Record<string, number>;
  /** 0..100, affects turnout. */
  enthusiasm: number;
  /** Districts actually filled in. */
  districtNames: string[];
}

// ===========================================================================
// Military, war, diplomacy
// ===========================================================================

export type MilitaryBranch =
  | "army"
  | "navy"
  | "air-force"
  | "marines"
  | "space"
  | "cyber"
  | "nuclear";

export interface MilitaryState {
  activeDuty: number;
  reserves: number;
  /** Annual military spend, credits. */
  spend: number;
  /** 0..100 readiness. */
  readiness: number;
  /** -100..100 doctrine, defensive vs aggressive. */
  doctrine: number;
  nuclearArsenal?: number;
  branches: Record<MilitaryBranch, { active: number; quality: number }>;
  /** 0..100 morale. */
  morale: number;
  veterans: number;
  conscription: boolean;
  /** 0..1, proportion of GDP. */
  burden: number;
}

export type WarPhase =
  | "cold"
  | "tension"
  | "crisis"
  | "mobilised"
  | "war"
  | "protracted"
  | "attrition"
  | "stalemate"
  | "negotiations"
  | "ended";

export interface Front {
  id: EntityId;
  name: string;
  /** ISO3 codes contesting this front. */
  belligerents: string[];
  /** 0..100, -50 = defender holds, 50 = attacker holds. */
  control: number;
  /** Territory held by attacker, credits of output at risk. */
  contestedOutput: number;
  openedAt: SimSeconds;
  terrain: "plains" | "urban" | "mountain" | "desert" | "forest" | "coastal" | "urban-core";
  attritionRate: number;
}

export interface War {
  id: EntityId;
  name: string;
  startedAt: SimSeconds;
  endedAt?: SimSeconds;
  phase: WarPhase;
  /** ISO3 -> ISO3 allies of that belligerent. */
  belligerents: Record<string, string[]>;
  cause: string;
  fronts: Front[];
  /** ISO3 -> war exhaustion 0..100. */
  exhaustion: Record<string, number>;
  casualties: Record<string, number>;
  /** ISO3 -> captured equipment value. */
  materiel: Record<string, number>;
  warGoal: string;
  /** 0..100 public support for the war, by country. */
  publicSupport: Record<string, number>;
  /** Set when a white peace or victory has been agreed. */
  outcome?: "victory" | "defeat" | "white-peace" | "annihilation";
  /** Which side won. */
  victor?: string;
  terms?: WarTerms;
}

export interface WarTerms {
  /** Territory ISO3 keys handed over. */
  cedeTerritory: Record<string, string[]>;
  /** Credits of reparations. */
  reparations: Record<string, number>;
  /** Disarmament of branches. */
  disarm: Record<string, MilitaryBranch[]>;
  /** Free-trade or alliance clauses. */
  clauses: string[];
}

export interface Treaty {
  id: EntityId;
  name: string;
  kind:
    | "alliance"
    | "non-aggression"
    | "trade"
    | "entente"
    | "peace"
    | "defensive-pact"
    | "access"
    | "customs-union"
    | "lend-lease";
  parties: string[];
  signedAt: SimSeconds;
  expiresAt?: SimSeconds;
  terms: string[];
  /** Trade the treaty generates, credits/year. */
  tradeBonus: number;
  /** -100..100 how much each party values it. */
  favourability: Record<string, number>;
  /** Set false when a party exits. */
  active: boolean;
}

export interface Sanction {
  id: EntityId;
  imposedBy: string[];
  on: string;
  at: SimSeconds;
  kind: "embargo" | "financial" | "technology" | "travel" | "asset-freeze" | "oil";
  scope: number;
  duration: SimSeconds;
  until: SimSeconds;
  /** Annual GDP cost to the target, credits. */
  costToTarget: number;
  costToImposer: number;
  /** 0..100 target's counter-measure intensity. */
  evasion: number;
}

// ===========================================================================
// Corporations & markets
// ===========================================================================

export type CompanyTier =
  | "small"
  | "mid-cap"
  | "large"
  | "mega-cap"
  | "systemic"
  | "state-owned"
  | "monopoly";

export interface Company {
  id: EntityId;
  name: string;
  country: Iso3;
  sector: SectorId;
  tier: CompanyTier;
  /** Market capitalisation in credits. */
  valuation: number;
  revenue: number;
  costs: number;
  profit: number;
  employees: number;
  debt: number;
  /** 0..1 fraction of shares held by the state. */
  stateOwnership: number;
  /** 0..100 */
  brandValue: number;
  /** Current share price in credits. */
  sharePrice: number;
  /** Share price 1 year ago, for 1y returns. */
  sharePriceYearAgo: number;
  /** Board of directors. */
  board: EntityId[];
  boardChairId?: EntityId;
  /** Largest shareholders. */
  shareholders: Shareholder[];
  /** 0..1, used for dilution when issuing shares. */
  ownershipFloat: number;
  listed: boolean;
  exchangeId?: EntityId;
  founded: SimSeconds;
  /** Sector specific modifiers. */
  researchLevel: number;
  /** Banned: cannot trade, hire, or receive investment. */
  banned?: boolean;
  bannedReason?: string;
  /** Set when the company is insolvent and delisted. */
  insolvent?: boolean;
  /** Unionisation of workforce 0..1. */
  unionisation: number;
  /** Annual R&D spend, credits. */
  rd: number;
  /** Environmental score -100..100. */
  environmentalScore: number;
  /** Political influence score, feeds lobbying. */
  lobbyingPower: number;
  /** CEO character id. */
  ceoId?: EntityId;
  /** Number of stock trades in the last sim-day. */
  dailyVolume: number;
}

export interface Shareholder {
  characterId?: EntityId;
  /** "state", "bank", "pension-fund", "retail", "founder", "foreign" */
  kind: string;
  name: string;
  /** Fraction of shares, 0..1 */
  stake: number;
  /** Votes actually exercised against management. */
  votingPower: number;
}

export interface Exchange {
  id: EntityId;
  name: string;
  country: Iso3;
  /** Index level, 1000 at scenario start. */
  index: number;
  indexYearAgo: number;
  listings: EntityId[];
  /** 0..100 volatility. */
  volatility: number;
  /** 0..100 */
  breadth: number;
  marketCap: number;
  currency: CurrencyCode;
}

export interface MarketState {
  exchanges: Exchange[];
  /** Global risk appetite 0..100. */
  sentiment: MarketMood;
  riskAppetite: number;
  creditSpreads: number;
  commodityPrices: Record<Commodity, number>;
  lastCrashAt?: SimSeconds;
}

export type Commodity =
  | "oil"
  | "gold"
  | "wheat"
  | "copper"
  | "natural-gas"
  | "coffee"
  | "iron-ore"
  | "coal"
  | "aluminium"
  | "lithium"
  | "uranium"
  | "silver";

// ===========================================================================
// Country (assembled)
// ===========================================================================

export interface Country {
  id: Iso3;
  iso2: Iso2;
  isoNumeric: IsoNumeric;
  name: string;
  /** Historical / formal name if different, e.g. "German Empire". */
  formalName?: string;
  demonym: string;
  continent: Continent;
  region: Region;
  /** Colour on the map when neutral. */
  mapColor: string;
  government: GovernmentType;
  /** Head of state title for this government type. */
  headOfStateTitle: string;
  headOfGovernmentTitle: string;
  legislature?: Legislature;
  executive: ExecutiveBranch;
  parties: Party[];
  courts: Court[];
  referendums: Referendum[];
  elections: Election[];
  military: MilitaryState;
  economy: EconomyState;
  /** Relations -100..100. */
  relations: Record<Iso3, number>;
  alliances: string[];
  wars: string[];
  /** Colonies / dependencies: ISO3 -> type. */
  dependencies: Record<Iso3, "colony" | "protectorate" | "mandate" | "dominion" | "occupation" | "territory">;
  /** Country this one is a dependency of. */
  overlord?: Iso3;
  ideology: number;
  bloc: Bloc;
  /** 0..100 national cohesion; low = separatism. */
  cohesion: number;
  /** 0..1, chance of unrest. */
  unrestRisk: number;
  /** Ongoing unrest events. */
  unrest: UnrestEvent[];
  /** Population in millions. */
  flagEmoji: string;
  /** Occupier, if any. */
  occupiedBy?: Iso3;
  /** Nuclear weapons count. */
  nukes: number;
  /** Sanctions imposed on this country. */
  sanctions: string[];
  /** Corporate HQ country. */
  /** Policy levers the current government has set. */
  policies: Record<PolicyArea, number>;
  /** Set when the state has been abolished by conquest/annexation. */
  annexedBy?: Iso3;
  banned?: boolean;
}

export interface UnrestEvent {
  id: EntityId;
  kind:
    | "protest"
    | "riot"
    | "strike"
    | "rebellion"
    | "coup"
    | "terror-attack"
    | "separatism"
    | "famine"
    | "pandemic"
    | "blackout"
    | "hyperinflation-spirit";
  intensity: number;
  startedAt: SimSeconds;
  endedAt?: SimSeconds;
  region?: string;
  fatalities: number;
}

// ===========================================================================
// World
// ===========================================================================

export interface ScenarioOverrides {
  /** ISO3 -> partial country patches applied on top of the base dataset. */
  countries?: Record<string, Partial<CountryPatch>>;
  /** Companies present in this scenario. */
  companies?: CompanySeed[];
  /** Wars already underway at scenario start. */
  wars?: WarSeed[];
  treaties?: TreatySeed[];
  sanctions?: SanctionSeed[];
  /** Global starting state. */
  global?: {
    commodityPrices?: Partial<Record<Commodity, number>>;
    riskAppetite?: number;
  };
}

export interface CountryPatch {
  name?: string;
  formalName?: string;
  government?: GovernmentType;
  exists?: boolean;
  annexedBy?: Iso3;
  overlord?: Iso3;
  dependencies?: Record<Iso3, "colony" | "protectorate" | "mandate" | "dominion" | "occupation">;
  ideology?: number;
  bloc?: Bloc;
  /** Multipliers applied to the base economy. */
  economyMultipliers?: Partial<{
    gdp: number;
    gdpPerCapita: number;
    population: number;
    unemployment: number;
    inflation: number;
    productivity: number;
    corruption: number;
    debtToGdp: number;
    rd: number;
  }>;
  /** Absolute overrides. */
  economySet?: Partial<{
    gdp: number;
    gdpPerCapita: number;
    population: number;
    unemployment: number;
    inflation: number;
    productivity: number;
    corruption: number;
    debtToGdp: number;
    policyRate: number;
    debt: number;
    reserves: number;
  }>;
  leaders?: LeaderSeed[];
  parties?: { name: string; abbreviation: string; ideology: number; seats: Record<string, number>; color: string }[];
  legislature?: LegislatureSeed;
  military?: Partial<MilitaryState> & { activeDuty?: number; spend?: number; doctrine?: number; nukes?: number };
  relations?: Record<string, number>;
  alliances?: string[];
  /** Two-letter display currency. */
  currency?: CurrencyCode;
  headOfStateTitle?: string;
  headOfGovernmentTitle?: string;
  colour?: string;
}

export interface LeaderSeed {
  name: string;
  role: CharacterRole;
  party?: string;
  stats?: Partial<CharacterStats>;
  /** Only spawn if a scenario year is at or after this. */
  until?: number;
}

export interface LegislatureSeed {
  chambers: LegislatureChamberConfig[];
}

export interface CompanySeed {
  name: string;
  country: Iso3;
  sector: SectorId;
  /** Revenue in credits at start. Used to derive valuation. */
  revenue: number;
  employees: number;
  tier?: CompanyTier;
  founder?: string;
  /** Fraction of shares the state holds. */
  stateOwnership?: number;
  listed?: boolean;
  exchange?: string;
  foundedYear?: number;
  brandValue?: number;
  rd?: number;
}

export interface WarSeed {
  name: string;
  startedAt: SimSeconds;
  phase: WarPhase;
  belligerents: Record<string, string[]>;
  cause: string;
  fronts: { name: string; belligerents: string[]; control: number; terrain: Front["terrain"] }[];
  exhaustion?: Record<string, number>;
  casualties?: Record<string, number>;
  warGoal?: string;
}

export interface TreatySeed {
  name: string;
  kind: Treaty["kind"];
  parties: string[];
  terms: string[];
  tradeBonus?: number;
}

export interface SanctionSeed {
  imposedBy: string[];
  on: string;
  kind: Sanction["kind"];
  scope?: number;
  durationDays?: number;
}

export interface ScenarioTheme {
  /** CSS custom properties applied to <html data-scenario="id"> */
  tokens: Record<string, string>;
  /** Font family stack. */
  fontDisplay: string;
  fontBody: string;
  fontMono: string;
  /** Map paper / ocean colour. */
  ocean: string;
  /** Land colour when unclaimed. */
  unclaimed: string;
  /** Graticule + coastline. */
  stroke: string;
  /** Backdrop texture: "paper" | "blueprint" | "scan" | "vellum" | "newsprint" */
  texture: "paper" | "blueprint" | "scan" | "vellum" | "newsprint";
  /** Decorative label for the top bar. */
  masthead: string;
}

export interface Scenario {
  id: string;
  year: number;
  name: string;
  tagline: string;
  description: string;
  /** Starting sim time (seconds since world epoch). */
  epoch: number;
  theme: ScenarioTheme;
  /** Calendar at scenario start. */
  startDate: { year: number; month: number; day: number };
  /** How many in-game days per real second. Real-time continuous. */
  daysPerSecond: number;
  /** Global engine parameter overrides. */
  params: SimulationParams;
  overrides: ScenarioOverrides;
  /** Which countries are playable / exist. Absent list means all in the era. */
  tags: string[];
  /** Unlock requirements. */
  minAccountAgeDays?: number;
}

/**
 * All the knobs the developer menu exposes. Every one of these is live-editable
 * from the Dev Console at runtime.
 */
export interface SimulationParams {
  /** Real seconds per simulation tick. */
  tickMs: number;
  /** How much a country's real growth compounds toward the target. */
  growthSmoothing: number;
  /** Global multiplier on all growth. */
  growthBias: number;
  /** Okun's law sensitivity of unemployment to output gap. */
  okunSensitivity: number;
  /** Phillips curve sensitivity of inflation to unemployment. */
  phillipsSensitivity: number;
  /** Central bank reaction function gain. */
  inflationTarget: number;
  policyRateSmoothing: number;
  /** Wage -> inflation pass-through. */
  wagePush: number;
  /** Fiscal multiplier. */
  fiscalMultiplier: number;
  /** Debt interest rate as a function of risk. */
  debtInterestBase: number;
  debtInterestRisk: number;
  /** Bankruptcy threshold, debt/GDP. */
  bankruptcyThreshold: number;
  /** Stock market beta to GDP growth. */
  marketBeta: number;
  marketVolatility: number;
  crashProbability: number;
  /** Trade elasticity. */
  tradeElasticity: number;
  /** War damage per front per tick. */
  warDamage: number;
  /** Base monthly chance of a crisis given bad conditions. */
  crisisProbability: number;
  /** Base chance an election goes to a runoff / recount. */
  electionChaos: number;
  /** Corruption's drag on growth. */
  corruptionDrag: number;
  /** Inequality's drag on consumption. */
  inequalityDrag: number;
  /** Sanctions bite. */
  sanctionBite: number;
  /** Corporate profit -> GDP weight. */
  corporateWeight: number;
  /** How strongly parties follow their whip. */
  whipStrength: number;
  /** Corruption accrual per tick from state size. */
  corruptionRate: number;
  /** Event density multiplier. */
  eventRate: number;
  /** RNG seed. */
  seed: number;
}

export interface World {
  id: EntityId;
  name: string;
  scenarioId: string;
  seed: number;
  /** Seconds of simulated time since world epoch. */
  t: number;
  /** Absolute sim-time of the scenario epoch. */
  epoch: number;
  startDate: { year: number; month: number; day: number };
  daysPerSecond: number;
  paused: boolean;
  /** 0..1 applied to global growth, editable by devs. */
  speed: number;
  params: SimulationParams;
  countries: Record<Iso3, Country>;
  parties: Record<EntityId, Party>;
  characters: Record<EntityId, Character>;
  companies: Record<EntityId, Company>;
  exchanges: Record<EntityId, Exchange>;
  markets: MarketState;
  wars: Record<EntityId, War>;
  treaties: Record<EntityId, Treaty>;
  sanctions: Record<EntityId, Sanction>;
  bills: Record<EntityId, Bill>;
  events: WorldEvent[];
  /** Rolling ticker. */
  ticker: TickerEntry[];
  /** Global indices. */
  globals: {
    globalGdp: number;
    globalPopulation: number;
    globalInflation: number;
    /** 0..100 */
    worldHappiness: number;
    /** Weighted count of active wars. */
    worldConflictIndex: number;
    /** 0..100 superpower tension between the top blocs. */
    coldWarIndex: number;
  };
  /** Live dev-menu overrides, applied every tick on top of the sim. */
  directives: WorldDirective[];
  /** Scenario override objects, editable by devs at runtime. */
  scenarioOverrides: ScenarioOverrides;
  /** Countries created at runtime by devs that are not in the base dataset. */
  customCountries: Record<string, Country>;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export interface WorldEvent {
  id: EntityId;
  t: SimSeconds;
  /** Epoch seconds when it happened (for sorting across worlds). */
  at: number;
  country?: Iso3;
  kind:
    | "economic"
    | "political"
    | "military"
    | "diplomatic"
    | "corporate"
    | "social"
    | "legal"
    | "crisis"
    | "system";
  severity: "info" | "notice" | "major" | "catastrophic";
  title: string;
  body: string;
  /** ISO3s affected. */
  actors: string[];
  /** User who caused it, if any. */
  byUserId?: string;
  tags: string[];
}

export interface TickerEntry {
  t: SimSeconds;
  text: string;
  kind: WorldEvent["kind"];
  country?: Iso3;
}

/**
 * A live dev directive. These are re-applied on every tick *after* the sim runs,
 * so a dev can pin a value forever ("USA GDP = 50e12") until they remove it.
 */
export type WorldDirective =
  | {
      id: EntityId;
      kind: "set-stat";
      target: "country" | "company" | "market" | "global";
      targetId: string;
      path: string;
      value: number;
      /** 0..1 blend per tick, 1 = hard set. */
      blend: number;
      enabled: boolean;
      note: string;
      createdBy: string;
      createdAt: number;
    }
  | {
      id: EntityId;
      kind: "freeze";
      target: "country" | "company" | "global";
      targetId: string;
      path: string;
      /** Captured when the freeze is created; re-applied every tick. */
      frozenValue?: number;
      enabled: boolean;
      note: string;
      createdBy: string;
      createdAt: number;
    }
  | {
      id: EntityId;
      kind: "trigger";
      /** A rule evaluated every tick. */
      when: string;
      then: string;
      enabled: boolean;
      note: string;
      createdBy: string;
      createdAt: number;
      /** Times fired. */
      fired: number;
      lastFiredAt?: number;
    }
  | {
      id: EntityId;
      kind: "custom-rule";
      /** Declarative rule object. */
      rule: CustomRule;
      enabled: boolean;
      note: string;
      createdBy: string;
      createdAt: number;
      fired: number;
      lastFiredAt?: number;
    };

/** Declarative rules the dev menu can author without writing code. */
export interface CustomRule {
  id: EntityId;
  name: string;
  /** When true the rule stops being evaluated. */
  enabled: boolean;
  priority: number;
  trigger: {
    /** "always" | "interval" | "on-event" | "threshold" | "random" */
    type: "always" | "interval" | "threshold" | "random" | "on-event";
    /** Seconds between evaluations for interval rules. */
    intervalSeconds?: number;
    /** Probability per evaluation for random rules. */
    probability?: number;
    /** Event kind for on-event rules. */
    eventKind?: WorldEvent["kind"];
    conditions: RuleCondition[];
  };
  actions: RuleAction[];
  /** How many times it may fire; -1 = unlimited. */
  maxFires: number;
  fired: number;
  /** Milliseconds of cooldown after firing. */
  cooldownMs: number;
  lastFiredAt?: number;
  log: { t: number; message: string }[];
  createdBy: string;
  createdAt: number;
}

export type RuleCondition = {
  id: string;
  scope: "country" | "company" | "war" | "global" | "any-country";
  /** All conditions must hold (AND). */
  target?: string;
  path: string;
  op:
    | "<"
    | "<="
    | ">"
    | ">="
    | "=="
    | "!="
    | "between"
    | "contains"
    | "exists";
  value: number | string | [number, number];
  /** For 'any-country' scope. */
  aggregate?: "any" | "all" | "avg" | "count";
};

export type RuleAction =
  | {
      id: string;
      type: "set";
      scope: "country" | "company" | "global" | "market";
      target?: string;
      path: string;
      value: number;
    }
  | {
      id: string;
      type: "multiply";
      scope: "country" | "company" | "global" | "market";
      target?: string;
      path: string;
      value: number;
    }
  | { id: string; type: "spawn-war"; attacker: string; defender: string; name?: string }
  | { id: string; type: "end-war"; warId: string }
  | { id: string; type: "annex"; annexer: string; target: string }
  | { id: string; type: "grant-money"; target: string; amount: number }
  | { id: string; type: "ban-entity"; entityType: "country" | "company" | "character" | "party"; entityId: string; reason: string }
  | { id: string; type: "unban-entity"; entityType: "country" | "company" | "character" | "party"; entityId: string }
  | { id: string; type: "kill-character"; characterId: string; cause: string }
  | { id: string; type: "fire-minister"; country: string; area: PolicyArea }
  | { id: string; type: "force-election"; country: string; chamberId?: string }
  | { id: string; type: "raise-referendum"; country: string; question: string }
  | { id: string; type: "impose-sanction"; by: string; on: string; kind: Sanction["kind"] }
  | { id: string; type: "log"; message: string }
  | { id: string; type: "custom-script"; /** Small DSL expression evaluated against the sim. */ expression: string };

// ===========================================================================
// Players, roles, permissions
// ===========================================================================

export type Platform = "discord" | "google" | "password";

export type StaffRole = "player" | "moderator" | "developer" | "owner";

/** Granular capability set. Everything in the dev menu maps to one of these. */
export type Capability =
  | "world.play"
  | "world.create"
  | "world.delete"
  | "economy.trade"
  | "economy.invest"
  | "economy.ledger"
  | "economy.grant"
  | "economy.set-stat"
  | "company.create"
  | "company.delete"
  | "company.ban"
  | "company.manage"
  | "politics.vote"
  | "politics.legislate"
  | "politics.campaign"
  | "politics.appoint"
  | "politics.override"
  | "diplomacy.treaty"
  | "diplomacy.war"
  | "diplomacy.sanction"
  | "military.command"
  | "character.create"
  | "character.delete"
  | "character.ban"
  | "scenario.create"
  | "scenario.edit"
  | "scenario.delete"
  | "rules.manage"
  | "dev.console"
  | "dev.worldedit"
  | "dev.directives"
  | "moderation.ban"
  | "moderation.kick"
  | "moderation.mute"
  | "moderation.warn"
  | "admin.impersonate"
  | "admin.webhook";

export interface User {
  id: string;
  platform: Platform;
  platformId: string;
  username: string;
  globalName: string;
  avatar: string;
  email?: string;
  staffRole: StaffRole;
  capabilities: Capability[];
  /** ISO3 the player controls as a state. */
  playsCountry?: Iso3;
  /** Entity id of the character the player controls. */
  playsCharacterId?: EntityId;
  /** Company the player controls. */
  playsCompanyId?: EntityId;
  /** Party the player founded/controls. */
  leadsPartyId?: EntityId;
  createdAt: number;
  lastSeenAt: number;
  /** Moderation. */
  bannedUntil?: number;
  banReason?: string;
  mutedUntil?: number;
  /** Free-form notes set by staff. */
  staffNotes?: string;
  /** Per-user stat overrides a dev has pinned. */
  flagged: boolean;
}

export interface Session {
  id: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
  ip?: string;
  userAgent?: string;
}

// ===========================================================================
// Audit
// ===========================================================================

export interface AuditEntry {
  id: EntityId;
  at: number;
  userId: string;
  username: string;
  action: string;
  target: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
  ip?: string;
}

// ===========================================================================
// Realtime channel payloads
// ===========================================================================

export type ServerMessage =
  | { type: "snapshot"; world: World; users: OnlineUser[] }
  | { type: "patch"; countries: Country[]; parties: Party[]; companies: Company[]; events: WorldEvent[]; ticker: TickerEntry[]; markets: MarketState; wars: War[]; characters: Character[] }
  | { type: "event"; event: WorldEvent }
  | { type: "ticker"; entry: TickerEntry }
  | { type: "presence"; users: OnlineUser[] }
  | { type: "pong"; t: number }
  | { type: "error"; message: string }
  | { type: "chat"; message: ChatMessage };

export interface OnlineUser {
  id: string;
  username: string;
  avatar: string;
  staffRole: StaffRole;
  playsCountry?: Iso3;
  playsCharacterId?: EntityId;
  playsCompanyId?: EntityId;
  lastSeenAt: number;
}

export interface ChatMessage {
  id: EntityId;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  channel: "global" | "country" | "dev" | "ticker";
  at: number;
  /** ISO3 the message is scoped to. */
  country?: Iso3;
}

export interface ClientMessage {
  type: "subscribe" | "ping" | "presence";
  country?: Iso3;
  chat?: ChatMessage;
}

// ===========================================================================
// Simulation tuning / diff types used by the dev UI
// ===========================================================================

export interface ParamDescriptor {
  key: keyof SimulationParams;
  label: string;
  group: "core" | "economy" | "finance" | "politics" | "military" | "events";
  min: number;
  max: number;
  step: number;
  description: string;
}

export interface StatDescriptor {
  path: string;
  label: string;
  group: string;
  min?: number;
  max?: number;
  unit?: "credits" | "%" | "ratio" | "count" | "index";
}