import type { Commodity, SectorId } from "../shared/types";

/**
 * Sector archetypes. A country is assigned an archetype (see ARCHETYPES below)
 * and the archetype decides the starting sector mix, so 1900 Britain really does
 * start with a large agricultural sector and 2026 Taiwan starts with a
 * semiconductor-weighted one, without hand-authoring 197 x 17 numbers.
 */

export interface SectorProfile {
  id: SectorId;
  label: string;
  /** Short description shown in the sector panel. */
  blurb: string;
  /** Annual labour productivity growth, baseline. */
  growth: number;
  /** Capital intensity: how much investment growth needs. */
  capitalIntensity: number;
  /** Share of employment per unit of output. Higher = more jobs per credit. */
  labourIntensity: number;
  /** 0..1, how exposed this sector is to a global recession. */
  cyclicality: number;
  /** 0..1, how exposed to commodity prices. */
  commodityExposure: number;
  /** 0..1, how much a university / R&D budget lifts this sector. */
  techIntensity: number;
  /** 0..1, exposure to sanctions and export controls. */
  sanctionExposure: number;
  /** Typical margin, fraction of revenue. */
  margin: number;
}

export const SECTORS: Record<SectorId, SectorProfile> = {
  agriculture: { id: "agriculture", label: "Agriculture & Fishing", blurb: "Crops, livestock and fisheries. Low productivity, high weather risk, politically explosive when it fails.", growth: 0.011, capitalIntensity: 0.25, labourIntensity: 2.4, cyclicality: 0.08, commodityExposure: 0.45, techIntensity: 0.05, sanctionExposure: 0.05, margin: 0.09 },
  mining: { id: "mining", label: "Mining & Extraction", blurb: "Iron, copper, coal, oil and gas extraction. Enormous rents, enormous environmental cost, rents attract war.", growth: 0.014, capitalIntensity: 0.7, labourIntensity: 0.4, cyclicality: 0.35, commodityExposure: 0.95, techIntensity: 0.12, sanctionExposure: 0.2, margin: 0.31 },
  manufacturing: { id: "manufacturing", label: "Manufacturing", blurb: "Factories, assembly and heavy industry. The classic industrial ladder: labour arbitrage then automation.", growth: 0.026, capitalIntensity: 0.55, labourIntensity: 1.1, cyclicality: 0.62, commodityExposure: 0.3, techIntensity: 0.35, sanctionExposure: 0.35, margin: 0.12 },
  energy: { id: "energy", label: "Energy & Utilities", blurb: "Power generation, grids, refining. Natural monopoly, regulated returns, huge capex.", growth: 0.017, capitalIntensity: 0.85, labourIntensity: 0.5, cyclicality: 0.3, commodityExposure: 0.8, techIntensity: 0.2, sanctionExposure: 0.3, margin: 0.18 },
  utilities: { id: "utilities", label: "Water & Gas Utilities", blurb: "Essential services with regulated tariffs.", growth: 0.021, capitalIntensity: 0.6, labourIntensity: 0.7, cyclicality: 0.1, commodityExposure: 0.2, techIntensity: 0.1, sanctionExposure: 0.05, margin: 0.22 },
  construction: { id: "construction", label: "Construction & Real Estate", blurb: "Buildings, infrastructure, housing. Boom-and-bust on a seven to ten year cycle.", growth: 0.031, capitalIntensity: 0.5, labourIntensity: 1.3, cyclicality: 0.9, commodityExposure: 0.25, techIntensity: 0.08, sanctionExposure: 0.05, margin: 0.11 },
  transport: { id: "transport", label: "Transport & Logistics", blurb: "Rail, road, shipping, aviation. Strategic, and chokepoints are how you strangle an economy.", growth: 0.028, capitalIntensity: 0.75, labourIntensity: 0.8, cyclicality: 0.7, commodityExposure: 0.35, techIntensity: 0.15, sanctionExposure: 0.25, margin: 0.14 },
  retail: { id: "retail", label: "Retail & Consumer", blurb: "Shops, e-commerce, consumer goods. Where consumer confidence becomes or destroys GDP.", growth: 0.029, capitalIntensity: 0.2, labourIntensity: 1.9, cyclicality: 0.55, commodityExposure: 0.2, techIntensity: 0.12, sanctionExposure: 0.05, margin: 0.1 },
  finance: { id: "finance", label: "Finance & Insurance", blurb: "Banks, insurers, asset managers. Leverage turns this sector into the fastest way to crash an economy.", growth: 0.033, capitalIntensity: 0.4, labourIntensity: 0.9, cyclicality: 0.85, commodityExposure: 0.1, techIntensity: 0.4, sanctionExposure: 0.4, margin: 0.26 },
  "real-estate": { id: "real-estate", label: "Real Estate", blurb: "Property markets. Self-reinforcing until it is not.", growth: 0.03, capitalIntensity: 0.65, labourIntensity: 0.6, cyclicality: 0.88, commodityExposure: 0.15, techIntensity: 0.1, sanctionExposure: 0.05, margin: 0.19 },
  telecom: { id: "telecom", label: "Telecommunications", blurb: "Networks and carriers. Winner-take-most, and a sovereignty issue.", growth: 0.038, capitalIntensity: 0.7, labourIntensity: 0.5, cyclicality: 0.25, commodityExposure: 0.05, techIntensity: 0.7, sanctionExposure: 0.35, margin: 0.24 },
  technology: { id: "technology", label: "Technology & Software", blurb: "Semiconductors, software, platforms. The productivity engine, and the export-control battlefield.", growth: 0.072, capitalIntensity: 0.45, labourIntensity: 0.35, cyclicality: 0.6, commodityExposure: 0.1, techIntensity: 0.95, sanctionExposure: 0.85, margin: 0.29 },
  healthcare: { id: "healthcare", label: "Healthcare & Pharma", blurb: "Hospitals, medicine, biotech. Politically defended spending, reliable growth.", growth: 0.043, capitalIntensity: 0.5, labourIntensity: 1.1, cyclicality: 0.15, commodityExposure: 0.15, techIntensity: 0.65, sanctionExposure: 0.25, margin: 0.21 },
  education: { id: "education", label: "Education & Research", blurb: "Schools, universities, public research. The multiplier that shows up thirty years late.", growth: 0.036, capitalIntensity: 0.35, labourIntensity: 1.4, cyclicality: 0.08, commodityExposure: 0.05, techIntensity: 0.85, sanctionExposure: 0.05, margin: 0.15 },
  defence: { id: "defence", label: "Defence Industry", blurb: "Arms, munitions, aerospace. Political economy: a private sector fed entirely by the state.", growth: 0.024, capitalIntensity: 0.6, labourIntensity: 0.7, cyclicality: 0.15, commodityExposure: 0.3, techIntensity: 0.55, sanctionExposure: 0.1, margin: 0.16 },
  tourism: { id: "tourism", label: "Tourism & Hospitality", blurb: "Hotels, airlines, leisure. Collapses instantly in a pandemic or a war, rebounds just as fast.", growth: 0.035, capitalIntensity: 0.35, labourIntensity: 1.7, cyclicality: 0.75, commodityExposure: 0.2, techIntensity: 0.08, sanctionExposure: 0.3, margin: 0.14 },
  media: { id: "media", label: "Media & Publishing", blurb: "Broadcast, press, streaming. Soft power, and a lever for whoever owns the narrative.", growth: 0.03, capitalIntensity: 0.3, labourIntensity: 0.9, cyclicality: 0.45, commodityExposure: 0.05, techIntensity: 0.5, sanctionExposure: 0.2, margin: 0.18 },
};

/**
 * Country archetypes. Each archetype gives a base sector mix (fractions sum to 1)
 * plus modifiers. Countries pick an archetype in a scenario; the archetype
 * scales with the country's real GDP per capita so a poor country with an
 * "industrial" mix still starts poor, just with the wrong mix.
 */
export interface Archetype {
  id: string;
  label: string;
  /** sector id -> share of output. Must sum to ~1. */
  mix: Partial<Record<SectorId, number>>;
  /** Multiplier on the country's real productivity. */
  productivity: number;
  /** Typical R&D share of GDP. */
  rd: number;
  /** Typical corruption. */
  corruption: number;
  /** Typical unionisation. */
  unionisation: number;
  /** Typical trade openness. */
  openness: number;
  /** Typical state share of the economy. */
  stateOwnership: number;
  /** Typical unemployment. */
  unemployment: number;
}

export const ARCHETYPES: Record<string, Archetype> = {
  agrarian: { id: "agrarian", label: "Agrarian", mix: { agriculture: 0.52, mining: 0.07, manufacturing: 0.11, construction: 0.06, transport: 0.04, retail: 0.09, education: 0.03, healthcare: 0.02, defence: 0.02, energy: 0.02, utilities: 0.02 }, productivity: 0.28, rd: 0.0012, corruption: 0.42, unionisation: 0.16, openness: 0.18, stateOwnership: 0.16, unemployment: 0.07 },
  resource: { id: "resource", label: "Resource State", mix: { mining: 0.46, energy: 0.14, agriculture: 0.08, manufacturing: 0.07, construction: 0.05, transport: 0.05, retail: 0.06, utilities: 0.03, defence: 0.03, healthcare: 0.02, education: 0.01 }, productivity: 0.42, rd: 0.0018, corruption: 0.48, unionisation: 0.2, openness: 0.32, stateOwnership: 0.52, unemployment: 0.09 },
  industrial: { id: "industrial", label: "Industrial", mix: { manufacturing: 0.31, mining: 0.09, agriculture: 0.06, energy: 0.08, utilities: 0.05, construction: 0.09, transport: 0.1, retail: 0.09, finance: 0.06, technology: 0.04, healthcare: 0.02, education: 0.01 }, productivity: 0.56, rd: 0.008, corruption: 0.3, unionisation: 0.5, openness: 0.48, stateOwnership: 0.24, unemployment: 0.06 },
  mixed: { id: "mixed", label: "Mixed Economy", mix: { manufacturing: 0.18, agriculture: 0.08, mining: 0.06, energy: 0.07, utilities: 0.05, construction: 0.11, transport: 0.1, retail: 0.13, finance: 0.11, "real-estate": 0.05, telecom: 0.02, technology: 0.02, healthcare: 0.01, education: 0.01 }, productivity: 0.62, rd: 0.012, corruption: 0.24, unionisation: 0.36, openness: 0.55, stateOwnership: 0.2, unemployment: 0.05 },
  service: { id: "service", label: "Advanced Services", mix: { finance: 0.19, retail: 0.13, technology: 0.13, healthcare: 0.11, education: 0.08, "real-estate": 0.1, tourism: 0.06, telecom: 0.05, media: 0.04, manufacturing: 0.05, energy: 0.03, utilities: 0.03 }, productivity: 0.82, rd: 0.028, corruption: 0.16, unionisation: 0.3, openness: 0.62, stateOwnership: 0.13, unemployment: 0.045 },
  postindustrial: { id: "postindustrial", label: "Post-Industrial", mix: { finance: 0.22, technology: 0.17, healthcare: 0.13, "real-estate": 0.11, education: 0.09, retail: 0.09, telecom: 0.06, media: 0.05, tourism: 0.04, manufacturing: 0.04 }, productivity: 0.95, rd: 0.042, corruption: 0.13, unionisation: 0.26, openness: 0.68, stateOwnership: 0.11, unemployment: 0.04 },
  planned: { id: "planned", label: "Centrally Planned", mix: { manufacturing: 0.4, mining: 0.13, agriculture: 0.14, energy: 0.12, construction: 0.09, transport: 0.07, utilities: 0.03, defence: 0.02 }, productivity: 0.48, rd: 0.014, corruption: 0.22, unionisation: 0.72, openness: 0.12, stateOwnership: 0.86, unemployment: 0.05 },
  command: { id: "command", label: "Command Economy", mix: { manufacturing: 0.34, mining: 0.11, agriculture: 0.2, energy: 0.1, construction: 0.1, transport: 0.06, defence: 0.06, utilities: 0.03 }, productivity: 0.36, rd: 0.009, corruption: 0.55, unionisation: 0.8, openness: 0.07, stateOwnership: 0.94, unemployment: 0.06 },
  oilstate: { id: "oilstate", label: "Oil State", mix: { mining: 0.38, energy: 0.2, construction: 0.11, transport: 0.06, utilities: 0.05, manufacturing: 0.05, retail: 0.06, healthcare: 0.04, education: 0.03, agriculture: 0.02 }, productivity: 0.5, rd: 0.004, corruption: 0.44, unionisation: 0.26, openness: 0.34, stateOwnership: 0.6, unemployment: 0.06 },
  taxhaven: { id: "taxhaven", label: "Financial Centre", mix: { finance: 0.34, "real-estate": 0.16, retail: 0.09, tourism: 0.12, technology: 0.08, telecom: 0.06, media: 0.04, healthcare: 0.03, education: 0.02, manufacturing: 0.03, utilities: 0.03 }, productivity: 0.9, rd: 0.008, corruption: 0.18, unionisation: 0.12, openness: 0.94, stateOwnership: 0.05, unemployment: 0.035 },
  autarkic: { id: "autarkic", label: "Autarkic", mix: { agriculture: 0.34, manufacturing: 0.24, mining: 0.1, energy: 0.1, utilities: 0.05, construction: 0.08, transport: 0.05, defence: 0.04 }, productivity: 0.33, rd: 0.003, corruption: 0.46, unionisation: 0.34, openness: 0.06, stateOwnership: 0.78, unemployment: 0.05 },
  sanctuary: { id: "sanctuary", label: "Tax Haven / Microstate", mix: { finance: 0.3, tourism: 0.2, retail: 0.14, "real-estate": 0.12, transport: 0.08, utilities: 0.05, technology: 0.05, healthcare: 0.03, education: 0.02, media: 0.01 }, productivity: 0.72, rd: 0.006, corruption: 0.2, unionisation: 0.18, openness: 0.88, stateOwnership: 0.08, unemployment: 0.04 },
};

/** Commodity base prices at the 2026 reference. Scenarios scale these. */
export const COMMODITY_BASE: Record<Commodity, number> = {
  oil: 78,
  gold: 2450,
  wheat: 240,
  copper: 9500,
  "natural-gas": 3.4,
  coffee: 4200,
  "iron-ore": 108,
  coal: 132,
  aluminium: 2600,
  lithium: 13500,
  uranium: 92,
  silver: 31,
};

export const COMMODITY_LABELS: Record<Commodity, string> = {
  oil: "Crude Oil",
  gold: "Gold",
  wheat: "Wheat",
  copper: "Copper",
  "natural-gas": "Natural Gas",
  coffee: "Coffee",
  "iron-ore": "Iron Ore",
  coal: "Thermal Coal",
  aluminium: "Aluminium",
  lithium: "Lithium",
  uranium: "Uranium",
  silver: "Silver",
};

/** Which exchange sits in which country, used for the market panel. */
export const EXCHANGES = [
  { id: "nyse", name: "New York Stock Exchange", country: "USA", currency: "USD" as const },
  { id: "nasdaq", name: "NASDAQ", country: "USA", currency: "USD" as const },
  { id: "lse", name: "London Stock Exchange", country: "GBR", currency: "GBP" as const },
  { id: "euronext", name: "Euronext", country: "FRA", currency: "EUR" as const },
  { id: "dax", name: "Deutsche Börse", country: "DEU", currency: "EUR" as const },
  { id: "nikkei", name: "Nikkei 225", country: "JPN", currency: "JPY" as const },
  { id: "sse", name: "Shanghai Stock Exchange", country: "CHN", currency: "CNY" as const },
  { id: "twse", name: "Taiwan Stock Exchange", country: "TWN", currency: "TWD" },
  { id: "hkg", name: "Hong Kong Stock Exchange", country: "HKG", currency: "HKD" },
  { id: "krx", name: "Korea Exchange", country: "KOR", currency: "KRW" },
  { id: "nse", name: "National Stock Exchange of India", country: "IND", currency: "INR" as const },
  { id: "b3", name: "B3 / Brasil Bolsa Balcão", country: "BRA", currency: "BRL" as const },
  { id: "tsx", name: "Toronto Stock Exchange", country: "CAN", currency: "CAD" as const },
  { id: "asx", name: "Australian Securities Exchange", country: "AUS", currency: "AUD" as const },
  { id: "jse", name: "Johannesburg Stock Exchange", country: "ZAF", currency: "ZAR" as const },
  { id: "bmv", name: "Bolsa Mexicana de Valores", country: "MEX", currency: "MXN" as const },
  { id: "sgx", name: "Singapore Exchange", country: "SGP", currency: "SGD" },
  { id: "tadawul", name: "Tadawul", country: "SAU", currency: "SAR" as const },
  { id: "moex", name: "Moscow Exchange", country: "RUS", currency: "RUB" as const },
  { id: "idx", name: "Indonesia Stock Exchange", country: "IDN", currency: "IDR" },
  { id: "set", name: "Stock Exchange of Thailand", country: "THA", currency: "THB" },
];