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
  crashProbability: 0.0007,
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
      "New Year's Day 1900. European empires hold most of the planet and Britain alone administers a quarter of humanity. The gold standard ties the world's money together, Boer commandos are besieging British garrisons in South Africa, and the Boxers are gathering in northern China. Every empire on this map believes it will last.",
    epoch: 0,
    startDate: { year: 1900, month: 1, day: 1 },
    daysPerSecond: 1,
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
    tagline: "The Archduke is dead. It is June, and nobody in the counting houses believes a war is coming.",
    description:
      "28 June 1914. Archduke Franz Ferdinand has just been shot in Sarajevo. In a month Austria-Hungary will declare war on Serbia, and the alliance system will pull in Russia, Germany, France and Britain within days, unless you stop it. The gold standard and the longest era of globalisation yet are about to end.",
    epoch: 0,
    startDate: { year: 1914, month: 6, day: 28 },
    daysPerSecond: 1,
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
    params: g({ seed: 19140628, growthSmoothing: 0.05, marketVolatility: 3.4, crashProbability: 0.0012, debtInterestBase: 0.045, inflationTarget: 0.015, warDamage: 0.00085, eventRate: 1.3, fiscalMultiplier: 1.9, debtInterestRisk: 0.12, bankruptcyThreshold: 0.9 }),
    overrides: { global: { commodityPrices: { gold: 18.6, oil: 0.9, wheat: 0.42, copper: 3.2 }, riskAppetite: 34 } },
    tags: ["total-war", "empire", "mobilisation", "gold-standard"],
  },

  // ============================================================== 1930 =====
  {
    id: "1930",
    year: 1930,
    name: "The Interwar Years",
    tagline: "Wall Street crashed four months ago. Nobody yet knows how far this goes.",
    description:
      "March 1930. Wall Street crashed in October and most governments think the slump will be short. Germany's Grand Coalition is about to fall, Stalin is collectivising the Soviet countryside, and the gold standard forces countries to tighten into the downturn. The League of Nations still exists, and its mandates cover the Middle East.",
    epoch: 0,
    startDate: { year: 1930, month: 3, day: 1 },
    daysPerSecond: 1,
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
    params: g({ seed: 19300301, growthSmoothing: 0.06, marketVolatility: 2.6, crashProbability: 0.001, debtInterestBase: 0.055, inflationTarget: 0.0, debtInterestRisk: 0.11, bankruptcyThreshold: 0.95, warDamage: 0.0007, eventRate: 1.2 }),
    overrides: { global: { commodityPrices: { gold: 20.7, oil: 0.27, wheat: 0.44, copper: 1.4, coal: 0.15 }, riskAppetite: 28 } },
    tags: ["great-depression", "mass-suffrage", "mandates", "art-deco"],
  },

  // ============================================================== 1950 =====
  {
    id: "1950",
    year: 1950,
    name: "The Early Cold War",
    tagline: "Germany exists twice, China has just gone red, and the Soviets have the bomb.",
    description:
      "New Year's Day 1950. NATO is nine months old, Marshall Plan money is rebuilding Western Europe, Mao has just taken China, and the Soviet Union tested its first bomb in August. Britain still rations food and still rules much of Africa. Korea will explode in June, and the great post-war boom is about to begin.",
    epoch: 0,
    startDate: { year: 1950, month: 1, day: 1 },
    daysPerSecond: 1,
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
    tags: ["cold-war", "reconstruction", "decolonisation", "nato"],
  },

  // ============================================================== 1990 =====
  {
    id: "1990",
    year: 1990,
    name: "The Unipolar Moment",
    tagline: "Saddam has taken Kuwait. Germany reunifies next month. The Soviet Union is coming apart.",
    description:
      "2 September 1990. Iraq occupied Kuwait a month ago and a US-led coalition is massing in Saudi Arabia. Germany reunifies on 3 October. The Soviet Union still exists but its republics are declaring sovereignty one by one. Japan's bubble has just burst, and inflation is high across the West.",
    epoch: 0,
    startDate: { year: 1990, month: 9, day: 2 },
    daysPerSecond: 1,
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
    tags: ["end-of-cold-war", "gulf-crisis", "reunification", "globalisation"],
  },

  // ============================================================== 2010 =====
  {
    id: "2010",
    year: 2010,
    name: "After the Crash",
    tagline: "The banks have been bailed out. Now the markets are looking at the governments.",
    description:
      "New Year's Day 2010, fifteen months after Lehman Brothers. Unemployment is near 10% across the West, rates are at the floor, and China is leading the recovery with a giant stimulus. Greece has just admitted its deficit is far larger than reported, and the euro zone has no plan for what happens next.",
    epoch: 0,
    startDate: { year: 2010, month: 1, day: 1 },
    daysPerSecond: 1,
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
    tags: ["great-recession", "euro-crisis", "sovereign-debt", "china-rising"],
  },

  // ============================================================== 2020 =====
  {
    id: "2020",
    year: 2020,
    name: "The Pandemic",
    tagline: "Every projection says the same thing. None of them are believed.",
    description:
      "11 March 2020. The WHO has just declared a pandemic. Markets are in free fall, travel is stopping, and within weeks a third of humanity will be locked down. Global GDP is heading for its worst fall since the 1930s. Central banks and treasuries are about to respond on a wartime scale.",
    epoch: 0,
    startDate: { year: 2020, month: 3, day: 11 },
    daysPerSecond: 1,
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
    params: g({ seed: 20200311, growthSmoothing: 0.04, marketVolatility: 3.2, crashProbability: 0.0012, debtInterestBase: 0.008, inflationTarget: 0.005, fiscalMultiplier: 2.1, eventRate: 1.2, crisisProbability: 0.003, corporateWeight: 0.55 }),
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
      "New Year's Day 2026. Tariffs are back, the war in Ukraine grinds on, US-China technology rivalry has hardened, European defence budgets are climbing, debt is high almost everywhere, and an AI boom is carrying the stock market. You start from here. Nothing after this point is written down.",
    epoch: 0,
    startDate: { year: 2026, month: 1, day: 1 },
    daysPerSecond: 1,
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
    overrides: { global: { commodityPrices: { gold: 4300, oil: 62, wheat: 210, copper: 11000, silver: 70 }, riskAppetite: 58 } },
    tags: ["great-power", "sanctions", "ai", "debt"],
  },
];

export const SCENARIOS_BY_ID: Record<string, Scenario> = Object.fromEntries(SCENARIOS.map((s) => [s.id, s]));

export function getScenario(id: string): Scenario {
  const s = SCENARIOS_BY_ID[id];
  if (!s) throw new Error(`Unknown scenario "${id}". Known: ${SCENARIOS.map((x) => x.id).join(", ")}`);
  return s;
}