import type { SimulationParams, Scenario } from "../shared/types";

/**
 * Engine-wide defaults. A scenario overrides only what it needs to; the
 * developer menu exposes every one of these live.
 */
export const DEFAULT_PARAMS: SimulationParams = {
  tickMs: 2000,
  growthSmoothing: 0.08,
  growthBias: 1,
  okunSensitivity: 0.42,
  phillipsSensitivity: 0.35,
  inflationTarget: 0.02,
  policyRateSmoothing: 0.15,
  wagePush: 0.45,
  fiscalMultiplier: 1.4,
  debtInterestBase: 0.018,
  debtInterestRisk: 0.06,
  bankruptcyThreshold: 1.15,
  marketBeta: 22,
  marketVolatility: 0.9,
  crashProbability: 0.0009,
  tradeElasticity: 1.6,
  warDamage: 0.00042,
  crisisProbability: 0.0026,
  electionChaos: 0.1,
  corruptionDrag: 0.24,
  inequalityDrag: 0.18,
  sanctionBite: 0.55,
  corporateWeight: 0.42,
  whipStrength: 0.86,
  corruptionRate: 0.00016,
  eventRate: 1,
  seed: 20260101,
};

const params = (over: Partial<SimulationParams>): SimulationParams => ({ ...DEFAULT_PARAMS, ...over });

// ---------------------------------------------------------------------------
// Type stacks. All of these resolve to fonts already on the machine, so the
// site makes zero external requests and still reads as a different design for
// every era. This is the single biggest lever against a generic look.
// ---------------------------------------------------------------------------

const OLDSTYLE = "'Iowan Old Style','Palatino Linotype',Palatino,'Book Antiqua',Georgia,serif";
const TRANSITIONAL = "'Times New Roman',Times,'Liberation Serif',serif";
const GEOMETRIC = "Futura,'Avenir Next','Century Gothic','URW Gothic','Trebuchet MS',sans-serif";
const GROTESQUE = "'Helvetica Neue',Helvetica,Arial,'Liberation Sans',sans-serif";
const CONDENSED = "'Haettenschweiler','Arial Narrow','Arial Narrow Bold','Liberation Sans Narrow',Impact,sans-serif";
const MONO = "'SF Mono','JetBrains Mono',Menlo,Consolas,'Liberation Mono',monospace";
const SANS = "'Inter','Segoe UI',system-ui,'Helvetica Neue',Arial,sans-serif";

// ---------------------------------------------------------------------------

const g = (over: Partial<SimulationParams>) => params(over);

export const SCENARIOS: Scenario[] = [
  // ============================================================== 1900 =====
  {
    id: "1900",
    year: 1900,
    name: "The Age of Empires",
    tagline: "Victoria reigns. The sun never sets, and every capital is a ledger.",
    description:
      "The world is at the height of European imperialism. Four empires cover a third of the planet, Britain alone administers a quarter of humanity, and the money is on the London and New York exchanges. There is no League of Nations and no international law worth the paper it is printed on. Everything here can be lost, and roughly eighty years from now, everything here will be.",
    epoch: 0,
    startDate: { year: 1900, month: 1, day: 1 },
    daysPerSecond: 0.06,
    theme: {
      tokens: {
        "--bg": "#f3ede0",
        "--bg-raised": "#fbf7ee",
        "--bg-sunken": "#e7dfcd",
        "--ink": "#1c1815",
        "--ink-muted": "#5f564a",
        "--rule": "#c9bda4",
        "--accent": "#8a1c1c",
        "--accent-2": "#9a7b28",
        "--positive": "#2f5d3a",
        "--negative": "#8a1c1c",
        "--shadow": "0 1px 0 #c9bda4, 0 2px 6px rgba(60,45,20,.10)",
      },
      fontDisplay: OLDSTYLE,
      fontBody: OLDSTYLE,
      fontMono: MONO,
      ocean: "#e5e0d2",
      unclaimed: "#ddd5c2",
      stroke: "#a99b7f",
      texture: "vellum",
      masthead: "THE CROWN LEDGER",
    },
    params: g({ seed: 19000101, growthSmoothing: 0.1, marketVolatility: 1.5, crashProbability: 0.0022, debtInterestBase: 0.03, inflationTarget: 0.005, eventRate: 0.7, whipStrength: 0.9, corporateWeight: 0.22, corruptionRate: 0.00026 }),
    overrides: { global: { commodityPrices: { gold: 18.6, oil: 0.9, wheat: 0.42, copper: 3.2, coal: 0.5, "iron-ore": 0.22 }, riskAppetite: 52 } },
    tags: ["imperial", "pre-suffrage", "gold-standard", "gunboat-diplomacy"],
  },

  // ============================================================== 1914 =====
  {
    id: "1914",
    year: 1914,
    name: "The War to End All Wars",
    tagline: "The guns are already loaded. It is July, and nobody in the counting houses believes a word of it.",
    description:
      "Europe is one assassination deep into a general war. Mobilisation timetables have made diplomacy meaningless, colonial subjects are being told to fight for empires they have never seen, and the economic system that will break the war is the same one that built the rail networks it will be fought over. The Triple Entente and the Triple Alliance are both about to discover what they actually promised.",
    epoch: 0,
    startDate: { year: 1914, month: 6, day: 28 },
    daysPerSecond: 0.07,
    theme: {
      tokens: {
        "--bg": "#d9cfb8",
        "--bg-raised": "#ece4d2",
        "--bg-sunken": "#c3b79c",
        "--ink": "#241f18",
        "--ink-muted": "#6b5f4b",
        "--rule": "#9d9078",
        "--accent": "#8d3b1f",
        "--accent-2": "#4a5548",
        "--positive": "#4a6b48",
        "--negative": "#8d3b1f",
        "--shadow": "0 2px 0 rgba(60,45,25,.18)",
      },
      fontDisplay: CONDENSED,
      fontBody: TRANSITIONAL,
      fontMono: MONO,
      ocean: "#cdc4ac",
      unclaimed: "#c8bfa6",
      stroke: "#8c7f66",
      texture: "newsprint",
      masthead: "THE WAR EDITION",
    },
    params: g({ seed: 19140628, growthSmoothing: 0.05, marketVolatility: 3.4, crashProbability: 0.007, debtInterestBase: 0.045, inflationTarget: 0.015, warDamage: 0.00085, eventRate: 2.2, fiscalMultiplier: 1.9, debtInterestRisk: 0.12, bankruptcyThreshold: 0.9 }),
    overrides: { global: { commodityPrices: { gold: 18.6, oil: 0.9, wheat: 0.42, copper: 3.2 }, riskAppetite: 34 } },
    tags: ["total-war", "empire", "mobilisation", "gold-standard"],
  },

  // ============================================================== 1930 =====
  {
    id: "1930",
    year: 1930,
    name: "The Interwar Years",
    tagline: "Four empires gone in four years. The money is on the floor and nobody has picked it up.",
    description:
      "The Dow is recovering from a crash that killed a generation of savers, reparations are still draining Germany, and the political centre has emptied out across Europe. Mass suffrage is new, the franchise has doubled, and the parties that will exploit it are assembling. The League of Nations exists. Its mandates are already being called spoils.",
    epoch: 0,
    startDate: { year: 1930, month: 3, day: 1 },
    daysPerSecond: 0.07,
    theme: {
      tokens: {
        "--bg": "#14181c",
        "--bg-raised": "#1d2329",
        "--bg-sunken": "#0d1013",
        "--ink": "#f0e6d2",
        "--ink-muted": "#9aa3ab",
        "--rule": "#3a444d",
        "--accent": "#d4af5c",
        "--accent-2": "#4fb3a8",
        "--positive": "#4fb3a8",
        "--negative": "#e0654f",
        "--shadow": "0 0 0 1px rgba(212,175,92,.28)",
      },
      fontDisplay: GEOMETRIC,
      fontBody: TRANSITIONAL,
      fontMono: MONO,
      ocean: "#101418",
      unclaimed: "#232a31",
      stroke: "#4b5862",
      texture: "blueprint",
      masthead: "CROWN QUARTERLY",
    },
    params: g({ seed: 19300301, growthSmoothing: 0.06, marketVolatility: 2.6, crashProbability: 0.005, debtInterestBase: 0.055, inflationTarget: 0.0, debtInterestRisk: 0.11, bankruptcyThreshold: 0.95, warDamage: 0.0007, eventRate: 1.6 }),
    overrides: { global: { commodityPrices: { gold: 20.7, oil: 0.27, wheat: 0.44, copper: 1.4, coal: 0.15 }, riskAppetite: 28 } },
    tags: ["great-depression", "mass-suffrage", "mandates", "art-deco"],
  },

  // ============================================================== 1950 =====
  {
    id: "1950",
    year: 1950,
    name: "The Early Cold War",
    tagline: "Europe is split, Germany exists twice, and the money is on a barrow.",
    description:
      "Britain is broke and rationing ends this year. The Marshall Plan is about to be announced, the NATO treaty is signed, and the Korean peninsula has become a shooting gallery. Every economy here is either rebuilding or mobilising, and the strange feature of the era is that peace and preparation cost almost the same.",
    epoch: 0,
    startDate: { year: 1950, month: 1, day: 1 },
    daysPerSecond: 0.08,
    theme: {
      tokens: {
        "--bg": "#e6e8e4",
        "--bg-raised": "#f4f5f2",
        "--bg-sunken": "#d3d6d1",
        "--ink": "#20262b",
        "--ink-muted": "#5d666d",
        "--rule": "#a8b0aa",
        "--accent": "#9b2c22",
        "--accent-2": "#2c4b6f",
        "--positive": "#3d6b46",
        "--negative": "#9b2c22",
        "--shadow": "0 1px 2px rgba(20,30,40,.10)",
      },
      fontDisplay: GROTESQUE,
      fontBody: GROTESQUE,
      fontMono: MONO,
      ocean: "#d8dcd8",
      unclaimed: "#dfe2de",
      stroke: "#9aa29c",
      texture: "paper",
      masthead: "CROWN BUREAU",
    },
    params: g({ seed: 19500101, growthSmoothing: 0.09, marketVolatility: 1.3, crashProbability: 0.0018, debtInterestBase: 0.035, inflationTarget: 0.015, corporateWeight: 0.3, eventRate: 1.3, fiscalMultiplier: 1.6, corruptionRate: 0.0002 }),
    overrides: { global: { commodityPrices: { gold: 35, oil: 2.9, wheat: 1.2, copper: 4.1, coal: 3.4 }, riskAppetite: 41 } },
    tags: ["reconstruction", "bipolar", "marshall-plan", "nato"],
  },

  // ============================================================== 1990 =====
  {
    id: "1990",
    year: 1990,
    name: "The Unipolar Moment",
    tagline: "There is one superpower left and it knows exactly what that means.",
    description:
      "Berlin is about to come down and the Soviet Union has five years left on the clock. The American consumer boom is unstoppable, Japan is about to buy the price of Paris, and the European Community is a customs union that has not yet discovered the single currency. There is no precedent for what happens next, which is generally how it starts.",
    epoch: 0,
    startDate: { year: 1990, month: 9, day: 2 },
    daysPerSecond: 0.09,
    theme: {
      tokens: {
        "--bg": "#0b1220",
        "--bg-raised": "#141e30",
        "--bg-sunken": "#070d18",
        "--ink": "#e8f0ff",
        "--ink-muted": "#8ba0bf",
        "--rule": "#24344d",
        "--accent": "#39c5d8",
        "--accent-2": "#7b6bff",
        "--positive": "#3ddc97",
        "--negative": "#ff6b6b",
        "--shadow": "0 0 24px rgba(57,197,216,.14)",
      },
      fontDisplay: GEOMETRIC,
      fontBody: SANS,
      fontMono: MONO,
      ocean: "#080f1c",
      unclaimed: "#16202f",
      stroke: "#2b3f5c",
      texture: "scan",
      masthead: "CROWN NETWORK",
    },
    params: g({ seed: 19900902, growthSmoothing: 0.1, marketVolatility: 1.1, crashProbability: 0.0012, debtInterestBase: 0.065, inflationTarget: 0.03, eventRate: 1.1, corporateWeight: 0.6, tradeElasticity: 1.9 }),
    overrides: { global: { commodityPrices: { gold: 380, oil: 24, wheat: 4.6, copper: 2.7 }, riskAppetite: 66 } },
    tags: ["unipolar", "deregulation", "globalisation", "yugoslavia"],
  },

  // ============================================================== 2010 =====
  {
    id: "2010",
    year: 2010,
    name: "After the Crash",
    tagline: "The banks are still being bailed out. The voters have noticed.",
    description:
      "Eight years after Lehman, sovereign spreads are the new thing everyone watches, the euro crisis has made the single currency a liability as well as a project, and a generation of twenty-somethings has decided that the system is not for them. Governments everywhere are running out of money faster than they can spend it, which is exactly when the populists start winning.",
    epoch: 0,
    startDate: { year: 2010, month: 1, day: 1 },
    daysPerSecond: 0.1,
    theme: {
      tokens: {
        "--bg": "#f7f8fa",
        "--bg-raised": "#ffffff",
        "--bg-sunken": "#eceef2",
        "--ink": "#151a21",
        "--ink-muted": "#606b78",
        "--rule": "#dfe3ea",
        "--accent": "#2563eb",
        "--accent-2": "#e11d48",
        "--positive": "#0f9d58",
        "--negative": "#e11d48",
        "--shadow": "0 1px 3px rgba(20,30,50,.08)",
      },
      fontDisplay: GROTESQUE,
      fontBody: SANS,
      fontMono: MONO,
      ocean: "#eef2f7",
      unclaimed: "#e6eaf0",
      stroke: "#c9d2de",
      texture: "paper",
      masthead: "CROWN TERMINAL",
    },
    params: g({ seed: 20100101, growthSmoothing: 0.11, marketVolatility: 1.25, crashProbability: 0.0026, debtInterestBase: 0.028, inflationTarget: 0.02, eventRate: 1.2, corruptionDrag: 0.26 }),
    overrides: { global: { commodityPrices: { gold: 1420, oil: 79, wheat: 12, copper: 83 }, riskAppetite: 44 } },
    tags: ["sovereign-debt", "eurozone", "occupy", "social-media"],
  },

  // ============================================================== 2020 =====
  {
    id: "2020",
    year: 2020,
    name: "The Pandemic",
    tagline: "Every projection says the same thing. None of them are believed.",
    description:
      "Global GDP is on track for the worst fall since the 1930s, central banks have cut to the floor, and fiscal deficits everywhere are larger than they were in the 1940s. Supply chains have snapped, unemployment claims are measured in tens of millions, and every government in the world is trying to buy the same semiconductors.",
    epoch: 0,
    startDate: { year: 2020, month: 3, day: 11 },
    daysPerSecond: 0.1,
    theme: {
      tokens: {
        "--bg": "#071018",
        "--bg-raised": "#0d1a24",
        "--bg-sunken": "#040a10",
        "--ink": "#dff1f7",
        "--ink-muted": "#6e8b9b",
        "--rule": "#17303f",
        "--accent": "#2dd4bf",
        "--accent-2": "#f472b6",
        "--positive": "#34d399",
        "--negative": "#fb7185",
        "--shadow": "0 0 20px rgba(45,212,191,.10)",
      },
      fontDisplay: SANS,
      fontBody: SANS,
      fontMono: MONO,
      ocean: "#050d15",
      unclaimed: "#0c1c26",
      stroke: "#1b3a4b",
      texture: "scan",
      masthead: "CROWN CRISIS DESK",
    },
    params: g({ seed: 20200311, growthSmoothing: 0.04, growthBias: -0.55, marketVolatility: 3.2, crashProbability: 0.009, debtInterestBase: 0.008, inflationTarget: 0.005, fiscalMultiplier: 2.1, eventRate: 2.6, crisisProbability: 0.008, corporateWeight: 0.55 }),
    overrides: { global: { commodityPrices: { gold: 1900, oil: 24, wheat: 8, copper: 62 }, riskAppetite: 12 } },
    tags: ["covid", "lockdown", "unprecedented-stimulus", "supply-shock"],
  },

  // ============================================================== 2026 =====
  {
    id: "2026",
    year: 2026,
    name: "Present Day",
    tagline: "Trade blocs, sovereign debt, and a war nobody wants to fund.",
    description:
      "The world as it actually is: a US-China technology boundary that has hardened into an export-control wall, European defence budgets doubling on a security argument, fiscal space exhausted almost everywhere, and a stock market priced for perfection. You start from here. Nothing after this point is written down.",
    epoch: 0,
    startDate: { year: 2026, month: 1, day: 1 },
    daysPerSecond: 0.12,
    theme: {
      tokens: {
        "--bg": "#09090b",
        "--bg-raised": "#131318",
        "--bg-sunken": "#050507",
        "--ink": "#ededf0",
        "--ink-muted": "#8b8b96",
        "--rule": "#232329",
        "--accent": "#f5f5f5",
        "--accent-2": "#a78bfa",
        "--positive": "#4ade80",
        "--negative": "#f87171",
        "--shadow": "0 0 0 1px #232329",
      },
      fontDisplay: GROTESQUE,
      fontBody: SANS,
      fontMono: MONO,
      ocean: "#060608",
      unclaimed: "#15151a",
      stroke: "#2a2a32",
      texture: "paper",
      masthead: "CROWN",
    },
    params: g({ seed: 20260101 }),
    overrides: { global: { commodityPrices: { gold: 2450, oil: 78, wheat: 240, copper: 9500 }, riskAppetite: 58 } },
    tags: ["great-power", "sanctions", "ai", "debt"],
  },
];

export const SCENARIOS_BY_ID: Record<string, Scenario> = Object.fromEntries(SCENARIOS.map((s) => [s.id, s]));

export function getScenario(id: string): Scenario {
  const s = SCENARIOS_BY_ID[id];
  if (!s) throw new Error(`Unknown scenario "${id}". Known: ${SCENARIOS.map((x) => x.id).join(", ")}`);
  return s;
}