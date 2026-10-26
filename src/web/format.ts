/** Formatting helpers shared across every panel. Numbers in a world simulation
 *  span roughly forty orders of magnitude, so almost all of them are formatted
 *  through `credits` or `pct` rather than by hand at the call site. */

export function credits(v: number | undefined | null): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "--";
  const a = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (a >= 1e15) return `${sign}${(a / 1e15).toFixed(2)}Q`;
  if (a >= 1e12) return `${sign}${(a / 1e12).toFixed(a / 1e12 >= 100 ? 0 : 2)}T`;
  if (a >= 1e9) return `${sign}${(a / 1e9).toFixed(a / 1e9 >= 100 ? 0 : 1)}B`;
  if (a >= 1e6) return `${sign}${(a / 1e6).toFixed(a / 1e6 >= 100 ? 0 : 1)}M`;
  if (a >= 1e3) return `${sign}${(a / 1e3).toFixed(1)}K`;
  return `${sign}${a.toFixed(0)}`;
}

export function money(v: number | undefined | null, dp = 2): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "--";
  return v.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

export function pct(v: number | undefined | null, dp = 1): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "--";
  return `${(v * 100).toFixed(dp)}%`;
}

export function signedPct(v: number | undefined | null, dp = 2): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "--";
  return `${v >= 0 ? "+" : ""}${(v * 100).toFixed(dp)}%`;
}

export function people(v: number | undefined | null): string {
  if (!Number.isFinite(v as number)) return "--";
  return Math.round(v as number).toLocaleString("en-US");
}

export function pct0(v: number | undefined | null): string {
  if (!Number.isFinite(v as number)) return "--";
  return `${Math.round((v as number) * 100)}%`;
}

export const DAY = 86400;
export const YEAR = 365 * DAY;

/**
 * Sim seconds -> a calendar date, using the world's own start date.
 * Every date in the UI goes through here so 1900 shows 1900 dates.
 */
export function simDate(start: { year: number; month: number; day: number }, t: number): string {
  const ms = Date.UTC(start.year, start.month - 1, start.day) + t * 1000;
  const d = new Date(ms);
  return d.toISOString().slice(0, 10);
}

export function simDateTime(start: { year: number; month: number; day: number }, t: number): string {
  const ms = Date.UTC(start.year, start.month - 1, start.day) + t * 1000;
  const d = new Date(ms);
  return d.toISOString().slice(0, 16).replace("T", " ");
}

export function relative(_start: { year: number; month: number; day: number }, t: number): string {
  const years = t / YEAR;
  if (years < 1) return `${Math.floor(t / DAY)} days`;
  if (years < 100) return `${years.toFixed(1)} years`;
  return `${Math.round(years)} years`;
}

export function ago(at: number): string {
  const s = Math.floor((Date.now() - at) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function deltaClass(v: number): string {
  return v > 0.0005 ? "pos" : v < -0.0005 ? "neg" : "dim";
}

export const GOVERNMENT_LABELS: Record<string, string> = {
  "absolute-monarchy": "Absolute monarchy",
  "constitutional-monarchy": "Constitutional monarchy",
  "parliamentary-republic": "Parliamentary republic",
  "semi-presidential-republic": "Semi-presidential republic",
  "presidential-republic": "Presidential republic",
  "one-party-state": "One-party state",
  "military-junta": "Military junta",
  "monarchy-absolute-colonial": "Colonial administration",
  "federal-republic": "Federal republic",
  theocracy: "Theocracy",
  confederation: "Confederation",
  protectorate: "Protectorate",
  "mandate-colony": "Mandate",
  dependency: "Dependency",
  "occupied-territory": "Occupied territory",
  "breakaway-state": "Breakaway state",
};

export const SECTOR_ORDER = [
  "agriculture", "mining", "manufacturing", "energy", "utilities", "construction",
  "transport", "retail", "finance", "real-estate", "telecom", "technology",
  "healthcare", "education", "defence", "tourism", "media",
] as const;

export const POLICY_LABELS: Record<string, string> = {
  economy: "Economy", tax: "Taxation", welfare: "Welfare", health: "Health",
  education: "Education", environment: "Environment", defence: "Defence",
  immigration: "Immigration", "foreign-policy": "Foreign Policy", justice: "Justice",
  technology: "Technology", housing: "Housing", energy: "Energy",
  transport: "Transport", agriculture: "Agriculture", labour: "Labour",
};