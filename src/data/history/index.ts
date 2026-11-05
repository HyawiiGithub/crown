import { SCENARIO_1900 } from "./y1900";
import { SCENARIO_1914 } from "./y1914";
import { SCENARIO_1930 } from "./y1930";
import { SCENARIO_1950 } from "./y1950";
import { SCENARIO_1990, SCENARIO_2010, SCENARIO_2020, SCENARIO_2026 } from "./modern";
import type { HistoricalScenario } from "./types";

export * from "./types";
export { POLITICS } from "./politics";

export const HISTORY: Record<number, HistoricalScenario> = {
  1900: SCENARIO_1900, 1914: SCENARIO_1914, 1930: SCENARIO_1930, 1950: SCENARIO_1950,
  1990: SCENARIO_1990, 2010: SCENARIO_2010, 2020: SCENARIO_2020, 2026: SCENARIO_2026,
};

/** Era-wide starting conditions. `frontierPc` is the richest large economy's income in period dollars. */
export interface EraSettings {
  frontierPc: number;
  frontierGrowth: number;
  revenueShare: number;
  debt: number;
  rate: number;
  inflation: number;
  unemployment: number;
  openness: number;
  regime: "gold" | "float";
  target: number;
  credit: number;
  /** Departmental split of non-interest spending. */
  split: { defence: number; welfare: number; health: number; education: number; infrastructure: number; science: number; administration: number; subsidies: number };
  /** Weight applied to each modern sector's weight in the mix. */
  sectorWeights: Partial<Record<string, number>>;
  popGrowth: { rich: number; poor: number };
}

const EARLY = { agriculture: 2.6, mining: 1.3, manufacturing: 1.3, technology: 0.01, telecom: 0.05, media: 0.1, tourism: 0.05, healthcare: 0.2, finance: 0.35, education: 0.25, "real-estate": 0.6, retail: 1.1, energy: 0.25, utilities: 0.3 };

export const ERA: Record<number, EraSettings> = {
  1900: { frontierPc: 270, frontierGrowth: 0.014, revenueShare: 0.09, debt: 0.45, rate: 0.035, inflation: 0.012, unemployment: 0.05, openness: 0.35, regime: "gold", target: 0, credit: 0.5, split: { defence: 0.34, welfare: 0.05, health: 0.02, education: 0.1, infrastructure: 0.15, science: 0.005, administration: 0.3, subsidies: 0.035 }, sectorWeights: EARLY, popGrowth: { rich: 0.011, poor: 0.008 } },
  1914: { frontierPc: 370, frontierGrowth: 0.015, revenueShare: 0.1, debt: 0.4, rate: 0.04, inflation: 0.015, unemployment: 0.05, openness: 0.38, regime: "gold", target: 0, credit: 0.55, split: { defence: 0.42, welfare: 0.07, health: 0.02, education: 0.1, infrastructure: 0.12, science: 0.005, administration: 0.24, subsidies: 0.035 }, sectorWeights: { ...EARLY, agriculture: 2.2, technology: 0.02, telecom: 0.08 }, popGrowth: { rich: 0.01, poor: 0.009 } },
  1930: { frontierPc: 750, frontierGrowth: 0.016, revenueShare: 0.14, debt: 0.7, rate: 0.045, inflation: -0.03, unemployment: 0.09, openness: 0.3, regime: "gold", target: 0, credit: 0.65, split: { defence: 0.2, welfare: 0.15, health: 0.04, education: 0.13, infrastructure: 0.16, science: 0.01, administration: 0.24, subsidies: 0.06 }, sectorWeights: { ...EARLY, agriculture: 1.8, technology: 0.05, telecom: 0.2, media: 0.3, energy: 0.5, utilities: 0.5, finance: 0.6, healthcare: 0.35 }, popGrowth: { rich: 0.007, poor: 0.012 } },
  1950: { frontierPc: 2000, frontierGrowth: 0.024, revenueShare: 0.22, debt: 0.7, rate: 0.02, inflation: 0.03, unemployment: 0.045, openness: 0.22, regime: "float", target: 0.02, credit: 0.4, split: { defence: 0.26, welfare: 0.2, health: 0.07, education: 0.12, infrastructure: 0.13, science: 0.02, administration: 0.14, subsidies: 0.06 }, sectorWeights: { agriculture: 1.5, manufacturing: 1.4, mining: 1.1, technology: 0.1, telecom: 0.4, media: 0.5, tourism: 0.25, healthcare: 0.5, finance: 0.7, education: 0.6, energy: 0.8 }, popGrowth: { rich: 0.012, poor: 0.019 } },
  1990: { frontierPc: 24000, frontierGrowth: 0.02, revenueShare: 0.3, debt: 0.45, rate: 0.075, inflation: 0.055, unemployment: 0.065, openness: 0.4, regime: "float", target: 0.03, credit: 0.75, split: { defence: 0.12, welfare: 0.34, health: 0.13, education: 0.13, infrastructure: 0.09, science: 0.025, administration: 0.12, subsidies: 0.045 }, sectorWeights: { manufacturing: 1.3, technology: 0.4, telecom: 0.7, media: 0.8, healthcare: 0.8 }, popGrowth: { rich: 0.006, poor: 0.024 } },
  2010: { frontierPc: 48000, frontierGrowth: 0.016, revenueShare: 0.32, debt: 0.55, rate: 0.015, inflation: 0.022, unemployment: 0.085, openness: 0.55, regime: "float", target: 0.02, credit: 0.9, split: { defence: 0.08, welfare: 0.37, health: 0.17, education: 0.13, infrastructure: 0.08, science: 0.03, administration: 0.11, subsidies: 0.04 }, sectorWeights: { technology: 0.8 }, popGrowth: { rich: 0.004, poor: 0.022 } },
  2020: { frontierPc: 64000, frontierGrowth: 0.015, revenueShare: 0.33, debt: 0.65, rate: 0.01, inflation: 0.02, unemployment: 0.05, openness: 0.5, regime: "float", target: 0.02, credit: 1, split: { defence: 0.07, welfare: 0.37, health: 0.19, education: 0.12, infrastructure: 0.08, science: 0.03, administration: 0.11, subsidies: 0.03 }, sectorWeights: {}, popGrowth: { rich: 0.003, poor: 0.02 } },
  2026: { frontierPc: 90000, frontierGrowth: 0.017, revenueShare: 0.33, debt: 0.7, rate: 0.04, inflation: 0.03, unemployment: 0.05, openness: 0.5, regime: "float", target: 0.02, credit: 1, split: { defence: 0.085, welfare: 0.36, health: 0.19, education: 0.12, infrastructure: 0.08, science: 0.03, administration: 0.105, subsidies: 0.03 }, sectorWeights: { technology: 1.15 }, popGrowth: { rich: 0.003, poor: 0.018 } },
};

/** Debt/GDP, policy rate, inflation, unemployment, real growth at the start date. Rounded public estimates. */
type MacroSeed = [number, number, number, number, number];

export const MACRO_SEEDS: Record<number, Record<string, MacroSeed>> = {
  1900: { USA: [0.1, 0.05, 0.03, 0.05, 0.03], GBR: [0.47, 0.04, 0.03, 0.025, 0.02], FRA: [0.9, 0.03, 0.02, 0.04, 0.02], DEU: [0.35, 0.05, 0.03, 0.02, 0.03], RUS: [0.55, 0.055, 0.03, 0.05, 0.03], JPN: [0.25, 0.08, 0.05, 0.04, 0.02], ITA: [1, 0.05, 0.01, 0.05, 0.02], AUT: [0.65, 0.045, 0.02, 0.04, 0.025], OTT: [0.9, 0.08, 0.02, 0.05, 0.01], CHN: [0.1, 0.1, 0.02, 0.1, 0.005] },
  1914: { USA: [0.03, 0.05, 0.01, 0.08, 0.01], GBR: [0.27, 0.03, 0.01, 0.03, 0.01], FRA: [0.65, 0.035, 0.02, 0.03, 0.02], DEU: [0.5, 0.04, 0.02, 0.03, 0.02], RUS: [0.47, 0.06, 0.03, 0.05, 0.035], AUT: [0.6, 0.05, 0.02, 0.04, 0.02], ITA: [0.75, 0.055, 0.02, 0.06, 0.015], JPN: [0.6, 0.07, 0.02, 0.04, 0.02], OTT: [0.8, 0.08, 0.03, 0.06, 0.005] },
  1930: { USA: [0.17, 0.035, -0.03, 0.087, -0.05], GBR: [1.7, 0.035, -0.04, 0.11, -0.01], FRA: [1, 0.035, 0, 0.03, 0.01], DEU: [0.25, 0.05, -0.04, 0.15, -0.02], USS: [0.1, 0.06, 0.1, 0.03, 0.07], JPN: [0.45, 0.055, -0.1, 0.05, -0.01], ITA: [0.9, 0.055, -0.04, 0.08, -0.01], CAN: [0.5, 0.045, -0.03, 0.09, -0.04], ARG: [0.3, 0.06, -0.03, 0.08, -0.04], AUS: [0.65, 0.055, -0.05, 0.14, -0.05], CHN: [0.1, 0.1, 0.02, 0.1, 0.01] },
  1950: { USA: [0.94, 0.0175, 0.01, 0.052, 0.087], GBR: [2, 0.02, 0.03, 0.015, 0.035], FRA: [0.3, 0.025, 0.1, 0.02, 0.07], DEU: [0.2, 0.04, -0.06, 0.08, 0.1], JPN: [0.15, 0.05, 0.2, 0.02, 0.1], ITA: [0.3, 0.04, 0, 0.09, 0.07], USS: [0.15, 0.04, -0.05, 0.01, 0.1], CHN: [0.05, 0.06, 0.3, 0.1, 0.1], IND: [0.3, 0.03, 0.03, 0.05, 0.02], CAN: [0.8, 0.02, 0.03, 0.035, 0.05], ARG: [0.35, 0.06, 0.25, 0.03, 0], BRA: [0.2, 0.08, 0.1, 0.05, 0.06] },
  1990: { USA: [0.55, 0.08, 0.054, 0.056, 0.019], GBR: [0.27, 0.14, 0.095, 0.069, 0.007], FRA: [0.35, 0.095, 0.034, 0.09, 0.029], DEU: [0.4, 0.08, 0.027, 0.06, 0.05], ITA: [0.95, 0.12, 0.065, 0.1, 0.02], ESP: [0.43, 0.145, 0.067, 0.16, 0.038], JPN: [0.63, 0.06, 0.03, 0.021, 0.049], CAN: [0.72, 0.125, 0.048, 0.081, 0.002], USS: [0.2, 0.05, 0.05, 0.01, -0.02], CHN: [0.1, 0.09, 0.03, 0.025, 0.039], IND: [0.75, 0.1, 0.09, 0.06, 0.055], BRA: [0.4, 1.5, 15, 0.045, -0.04], ARG: [0.6, 1, 13, 0.07, -0.02], MEX: [0.45, 0.35, 0.27, 0.03, 0.05], KOR: [0.15, 0.1, 0.086, 0.025, 0.09], SAU: [0.4, 0.08, 0.02, 0.05, 0.08], IRQ: [1.2, 0.1, 0.5, 0.1, -0.5] },
  2010: { USA: [0.95, 0.0025, 0.016, 0.098, 0.027], GBR: [0.75, 0.005, 0.033, 0.079, 0.019], FRA: [0.85, 0.01, 0.015, 0.093, 0.019], DEU: [0.82, 0.01, 0.011, 0.07, 0.042], ITA: [1.19, 0.01, 0.015, 0.084, 0.017], ESP: [0.6, 0.01, 0.018, 0.2, 0], GRC: [1.47, 0.01, 0.047, 0.13, -0.055], PRT: [1, 0.01, 0.014, 0.11, 0.017], IRL: [0.85, 0.01, -0.016, 0.14, 0.018], JPN: [2.07, 0.001, -0.007, 0.051, 0.041], CAN: [0.85, 0.0075, 0.018, 0.081, 0.031], CHN: [0.33, 0.0531, 0.033, 0.041, 0.106], IND: [0.67, 0.05, 0.1, 0.08, 0.085], RUS: [0.11, 0.0775, 0.069, 0.074, 0.045], BRA: [0.63, 0.0875, 0.05, 0.08, 0.075], MEX: [0.42, 0.045, 0.042, 0.053, 0.05], KOR: [0.3, 0.02, 0.03, 0.037, 0.068], AUS: [0.2, 0.0375, 0.028, 0.052, 0.024], TUR: [0.4, 0.065, 0.086, 0.11, 0.084], ZAF: [0.35, 0.07, 0.043, 0.25, 0.03], SAU: [0.08, 0.02, 0.038, 0.055, 0.05], IDN: [0.25, 0.065, 0.051, 0.07, 0.062] },
  2020: { USA: [1.08, 0.0025, 0.012, 0.08, -0.028], GBR: [0.85, 0.001, 0.009, 0.046, -0.1], FRA: [0.98, 0, 0.005, 0.08, -0.08], DEU: [0.6, 0, 0.004, 0.038, -0.04], ITA: [1.34, 0, 0.001, 0.092, -0.09], ESP: [0.95, 0, 0, 0.155, -0.11], JPN: [2.36, -0.001, 0, 0.028, -0.042], CAN: [0.88, 0.0075, 0.007, 0.095, -0.05], CHN: [0.57, 0.0385, 0.03, 0.052, 0.022], IND: [0.74, 0.0515, 0.06, 0.08, -0.06], RUS: [0.14, 0.06, 0.03, 0.058, -0.027], BRA: [0.76, 0.0375, 0.033, 0.135, -0.033], MEX: [0.45, 0.065, 0.034, 0.044, -0.082], KOR: [0.42, 0.0125, 0.005, 0.039, -0.007], AUS: [0.45, 0.005, 0.009, 0.065, -0.002], TUR: [0.33, 0.1075, 0.12, 0.13, 0.019], ZAF: [0.62, 0.0525, 0.033, 0.29, -0.06], SAU: [0.23, 0.0175, 0.034, 0.075, -0.04], ARG: [0.9, 0.38, 0.42, 0.115, -0.1], IDN: [0.3, 0.045, 0.02, 0.06, -0.02] },
  2026: { USA: [1.24, 0.0375, 0.029, 0.044, 0.02], GBR: [1.03, 0.0375, 0.034, 0.05, 0.013], FRA: [1.15, 0.02, 0.01, 0.077, 0.008], DEU: [0.65, 0.02, 0.022, 0.038, 0.009], ITA: [1.37, 0.02, 0.012, 0.06, 0.007], ESP: [1.01, 0.02, 0.028, 0.104, 0.021], JPN: [2.35, 0.0075, 0.025, 0.026, 0.008], CAN: [1.1, 0.0225, 0.022, 0.066, 0.012], CHN: [0.68, 0.03, 0, 0.051, 0.046], IND: [0.82, 0.0525, 0.02, 0.05, 0.065], RUS: [0.2, 0.16, 0.06, 0.022, 0.008], UKR: [1.05, 0.155, 0.08, 0.12, 0.02], BRA: [0.92, 0.15, 0.045, 0.054, 0.018], MEX: [0.55, 0.07, 0.037, 0.027, 0.012], KOR: [0.53, 0.025, 0.021, 0.028, 0.018], AUS: [0.5, 0.036, 0.03, 0.043, 0.021], TUR: [0.25, 0.38, 0.31, 0.085, 0.034], ZAF: [0.78, 0.0675, 0.035, 0.32, 0.015], SAU: [0.32, 0.045, 0.021, 0.035, 0.044], ARG: [0.8, 0.29, 0.31, 0.07, 0.04], IDN: [0.41, 0.0475, 0.025, 0.048, 0.05], ISR: [0.7, 0.0425, 0.025, 0.03, 0.033], IRN: [0.35, 0.23, 0.45, 0.09, 0], VEN: [1.5, 0.6, 2, 0.08, 0.04] },
};

/** Active-duty forces in thousands where a round number is well known, and warheads. */
export const MILITARY_SEEDS: Record<number, Record<string, { active?: number; nukes?: number }>> = {
  1900: { DEU: { active: 600 }, RUS: { active: 1100 }, FRA: { active: 620 }, GBR: { active: 430 }, AUT: { active: 360 }, ITA: { active: 260 }, USA: { active: 125 }, JPN: { active: 150 }, OTT: { active: 200 } },
  1914: { DEU: { active: 880 }, RUS: { active: 1350 }, FRA: { active: 910 }, GBR: { active: 390 }, AUT: { active: 450 }, ITA: { active: 300 }, USA: { active: 100 }, JPN: { active: 300 }, OTT: { active: 210 }, SRB: { active: 200 } },
  1930: { USS: { active: 560 }, FRA: { active: 500 }, GBR: { active: 340 }, ITA: { active: 300 }, JPN: { active: 270 }, POL: { active: 270 }, USA: { active: 250 }, DEU: { active: 100 }, CHN: { active: 2000 } },
  1950: { USA: { active: 1460, nukes: 299 }, USS: { active: 4300, nukes: 5 }, CHN: { active: 5000 }, GBR: { active: 680 }, FRA: { active: 590 }, TWN: { active: 500 }, PRK: { active: 135 }, KOR: { active: 98 } },
  1990: { USS: { active: 3400, nukes: 37000 }, USA: { active: 2050, nukes: 21400 }, CHN: { active: 3030, nukes: 230 }, IND: { active: 1260 }, IRQ: { active: 1000 }, PRK: { active: 1100 }, KOR: { active: 750 }, GBR: { active: 300, nukes: 350 }, FRA: { active: 550, nukes: 500 }, DEU: { active: 470 }, ISR: { active: 140, nukes: 60 }, ZAF: { active: 70, nukes: 6 }, TUR: { active: 650 }, IRN: { active: 500 }, VNM: { active: 1000 }, SYR: { active: 400 }, SAU: { active: 150 } },
  2010: { CHN: { active: 2285, nukes: 240 }, USA: { active: 1560, nukes: 9400 }, IND: { active: 1325, nukes: 80 }, RUS: { active: 1030, nukes: 12000 }, PRK: { active: 1100 }, KOR: { active: 655 }, PAK: { active: 620, nukes: 80 }, IRN: { active: 520 }, TUR: { active: 510 }, GBR: { active: 190, nukes: 225 }, FRA: { active: 240, nukes: 300 }, ISR: { active: 180, nukes: 80 }, DEU: { active: 250 } },
  2020: { CHN: { active: 2035, nukes: 320 }, IND: { active: 1450, nukes: 150 }, USA: { active: 1390, nukes: 5800 }, RUS: { active: 900, nukes: 6375 }, PRK: { active: 1280, nukes: 30 }, PAK: { active: 650, nukes: 160 }, KOR: { active: 600 }, IRN: { active: 610 }, TUR: { active: 355 }, GBR: { active: 150, nukes: 215 }, FRA: { active: 200, nukes: 290 }, ISR: { active: 170, nukes: 90 }, DEU: { active: 180 } },
  2026: { CHN: { active: 2035, nukes: 600 }, IND: { active: 1475, nukes: 180 }, USA: { active: 1320, nukes: 5177 }, RUS: { active: 1500, nukes: 5459 }, UKR: { active: 900 }, PRK: { active: 1320, nukes: 50 }, PAK: { active: 660, nukes: 170 }, IRN: { active: 610 }, KOR: { active: 500 }, TUR: { active: 355 }, GBR: { active: 140, nukes: 225 }, FRA: { active: 200, nukes: 290 }, ISR: { active: 170, nukes: 90 }, DEU: { active: 180 } },
};

/** Structural trade balance as a share of GDP for well-known surplus and deficit economies. */
export const TRADE_BALANCE: Record<string, number> = {
  USA: -0.03, GBR: -0.02, CHN: 0.03, DEU: 0.05, JPN: 0.01, KOR: 0.04, TWN: 0.1, NLD: 0.07, CHE: 0.08, NOR: 0.1, SAU: 0.1, ARE: 0.12, RUS: 0.06, SGP: 0.15, QAT: 0.2, KWT: 0.2, IRL: 0.1, IND: -0.03, TUR: -0.03, BRA: 0, AUS: 0.01, CAN: -0.01,
};
