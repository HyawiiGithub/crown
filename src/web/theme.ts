import type { ScenarioTheme } from "../shared/types";

/**
 * Scenario theming.
 *
 * A scenario's theme is a bag of CSS custom properties plus a map palette. We
 * write them onto <html> once when the scenario is entered and never touch the
 * DOM again, so every component reads the current era purely through inherited
 * custom properties. That is what stops the UI from looking the same in 1900 and
 * 2026 while sharing a single component tree.
 */

export interface Theme {
  id: string;
  tokens: Record<string, string>;
  fontDisplay: string;
  fontBody: string;
  fontMono: string;
  ocean: string;
  unclaimed: string;
  stroke: string;
  texture: "paper" | "blueprint" | "scan" | "vellum" | "newsprint";
  masthead: string;
}

/** Fallback theme used before a scenario is chosen. */
export const DEFAULT_THEME: Theme = {
  id: "2026",
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
  fontDisplay: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontBody: "Inter, 'Segoe UI', system-ui, sans-serif",
  fontMono: "'SF Mono', Menlo, Consolas, monospace",
  ocean: "#060608",
  unclaimed: "#15151a",
  stroke: "#2a2a32",
  texture: "paper",
  masthead: "CROWN",
};

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  for (const [k, v] of Object.entries(theme.tokens)) root.style.setProperty(k, v);
  root.style.setProperty("--ocean", theme.ocean);
  root.style.setProperty("--unclaimed", theme.unclaimed);
  root.style.setProperty("--mapstroke", theme.stroke);
  root.style.setProperty("--font-display", theme.fontDisplay);
  root.style.setProperty("--font-body", theme.fontBody);
  root.style.setProperty("--font-mono", theme.fontMono);
  root.dataset.scenario = theme.id;
  root.dataset.texture = theme.texture;
}

export function themeFromScenario(theme: ScenarioTheme, id: string): Theme {
  return {
    id,
    tokens: theme.tokens,
    fontDisplay: theme.fontDisplay,
    fontBody: theme.fontBody,
    fontMono: theme.fontMono ?? "'SF Mono', Menlo, Consolas, monospace",
    ocean: theme.ocean,
    unclaimed: theme.unclaimed,
    stroke: theme.stroke,
    texture: theme.texture,
    masthead: theme.masthead,
  };
}

// ===========================================================================
// Choropleth scales. One per "what are we colouring by" question.
// ===========================================================================

export type ScaleId = "political" | "gdp" | "gdpPc" | "growth" | "inflation" | "unemployment" | "debt" | "approval" | "war" | "relations" | "bloc" | "ideology";

/** Perceptually-ordered ramps, sampled at 0..1. */
const RAMPS: Record<string, string[]> = {
  viridis: ["#440154", "#414487", "#2a788e", "#22a884", "#7ad151", "#fde725"],
  magma: ["#000004", "#3b0f70", "#8c2981", "#de4968", "#fe9f6d", "#fcfdbf"],
  blues: ["#0d1b2a", "#1b3a5c", "#2e6da4", "#5b9bd5", "#9dc3e6", "#deebf7"],
  reds: ["#2b0a0a", "#7f1d1d", "#b91c1c", "#dc2626", "#f87171", "#fecaca"],
  neutral: ["#2a2a32", "#3f3f4a", "#565663", "#6f6f7d", "#8b8b96", "#a8a8b3"],
};

export function sampleRamp(name: string, t: number): string {
  const stops = RAMPS[name] ?? RAMPS.viridis;
  const x = Math.max(0, Math.min(0.9999, t)) * (stops.length - 1);
  const i = Math.floor(x);
  return mixHex(stops[i], stops[i + 1] ?? stops[i], x - i);
}

function mixHex(a: string, b: string, t: number): string {
  const pa = parseHex(a);
  const pb = parseHex(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`;
}

function parseHex(h: string): [number, number, number] {
  const s = h.replace("#", "");
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}

export interface ScaleRow {
  gdp: number;
  gdpPc: number;
  growth: number;
  inflation: number;
  unemployment: number;
  debt: number;
  approval: number;
  ideology: number;
  bloc: string;
  color?: string;
}

export interface LegendStop {
  value: string;
  color: string;
}

/**
 * Build a choropleth function for a given scale. Returns the fill for a country
 * plus the legend, so the map and its legend can never disagree.
 */
export function makeScale(id: ScaleId, countries: ScaleRow[], opts: { target?: string } = {}): {
  fill: (v: ScaleRow) => string;
  legend: LegendStop[];
  ramp: string;
  kind: "ramp" | "categorical";
  categories?: { id: string; color: string; label: string }[];
} {
  const target = opts.target;
  const rows = countries.filter((c) => (target ? c.bloc === target : true));
  const values = rows.map((c) => scaleValue(id, c)).filter((v) => Number.isFinite(v)) as number[];
  const sorted = [...values].sort((a, b) => a - b);
  const q = (p: number) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(p * (sorted.length - 1))))] ?? 0;

  if (id === "political") {
    return { fill: (v) => v.color ?? "var(--unclaimed)", legend: [], ramp: "categorical", kind: "categorical" };
  }

  if (id === "bloc" || id === "ideology") {
    const cats = new Map<string, string>();
    for (const c of rows) {
      const key = id === "bloc" ? c.bloc : ideoBucket(c.ideology);
      if (!cats.has(key)) cats.set(key, sampleRamp("viridis", cats.size / 9));
    }
    const list = [...cats.entries()].map(([k, color]) => ({ id: k, color, label: k }));
    return { fill: (v) => cats.get(id === "bloc" ? v.bloc : ideoBucket(v.ideology)) ?? "var(--unclaimed)", legend: [], categories: list, ramp: "categorical", kind: "categorical" };
  }

  if (id === "war") {
    return { fill: () => "#7f1d1d", legend: [], ramp: "categorical", kind: "categorical", categories: [{ id: "war", color: "#7f1d1d", label: "At war" }] };
  }

  if (id === "relations") {
    return { fill: (v) => v.color ?? "var(--unclaimed)", legend: [], ramp: "categorical", kind: "categorical" };
  }

  const ramp = id === "inflation" || id === "debt" || id === "unemployment" ? "reds" : id === "approval" ? "blues" : id === "growth" ? "magma" : "viridis";
  const lo = q(0.02);
  const hi = q(0.98);
  const span = hi - lo || 1;

  const legend: LegendStop[] = [];
  for (let i = 0; i <= 5; i++) {
    const t = i / 5;
    legend.push({ value: fmtLegend(id, lo + span * t), color: sampleRamp(ramp, t) });
  }

  return {
    fill: (v) => sampleRamp(ramp, (scaleValue(id, v) - lo) / span),
    legend,
    ramp,
    kind: "ramp",
  };
}

export function ideoBucket(v: number): string {
  if (v < -60) return "Far left";
  if (v < -25) return "Left";
  if (v < -8) return "Centre-left";
  if (v <= 8) return "Centre";
  if (v <= 25) return "Centre-right";
  if (v <= 60) return "Right";
  return "Far right";
}

function scaleValue(id: ScaleId, c: ScaleRow): number {
  switch (id) {
    case "gdp": return c.gdp;
    case "gdpPc": return c.gdpPc;
    case "growth": return c.growth;
    case "inflation": return c.inflation;
    case "unemployment": return c.unemployment;
    case "debt": return c.debt;
    case "approval": return c.approval;
    case "ideology": return c.ideology;
    default: return 0;
  }
}

function fmtLegend(id: ScaleId, v: number): string {
  switch (id) {
    case "gdp": return compactMoney(v);
    case "gdpPc": return compactMoney(v);
    case "growth":
    case "inflation":
    case "unemployment": return `${(v * 100).toFixed(1)}%`;
    case "debt": return `${Math.round(v * 100)}%`;
    case "approval": return `${Math.round(v)}`;
    default: return String(Math.round(v));
  }
}

export function compactMoney(v: number): string {
  const a = Math.abs(v);
  if (!Number.isFinite(v)) return "-";
  if (a >= 1e15) return `${(v / 1e15).toFixed(2)} quadrillion`;
  if (a >= 1e12) return `${(v / 1e12).toFixed(2)} trillion`;
  if (a >= 1e9) return `${(v / 1e9).toFixed(1)}bn`;
  if (a >= 1e6) return `${(v / 1e6).toFixed(1)}m`;
  if (a >= 1e3) return `${(v / 1e3).toFixed(1)}k`;
  return v.toFixed(0);
}