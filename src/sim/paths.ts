/**
 * Dotted-path read/write against arbitrary sim objects.
 *
 * This is the spine of the developer menu: every stat you can bind a slider to,
 * every path a `set-stat` directive can pin, every condition a custom rule can
 * test, is a string like `economy.fiscal.debtToGdp` or `military.readiness`.
 * Keeping the accessor in one place means the dev UI, the rule engine and the
 * admin API cannot drift apart.
 */

const MISSING = Symbol("missing");

export function getPath(root: unknown, path: string): unknown {
  if (!path) return MISSING;
  let cur: unknown = root;
  for (const key of path.split(".")) {
    if (cur === null || cur === undefined) return MISSING;
    if (typeof cur !== "object") return MISSING;
    const bag = cur as Record<string, unknown>;
    if (!(key in bag)) return MISSING;
    cur = bag[key];
  }
  return cur ?? MISSING;
}

export function hasPath(root: unknown, path: string): boolean {
  return getPath(root, path) !== MISSING;
}

/**
 * Write a value at a dotted path. Returns the previous value, or MISSING if the
 * path did not resolve. Creates intermediate objects only if the parent exists,
 * so a typo in a dev directive fails loudly instead of silently building junk.
 */
export function setPath(root: unknown, path: string, value: unknown): unknown {
  const parts = path.split(".");
  const prev = getPath(root, path);
  if (prev === MISSING) return MISSING;
  let cur = root as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    cur = cur[parts[i]] as Record<string, unknown>;
    if (cur === null || cur === undefined || typeof cur !== "object") return MISSING;
  }
  cur[parts[parts.length - 1]] = value;
  return prev;
}

/** Numeric convenience. Returns NaN if the path is missing or not numeric. */
export function getNum(root: unknown, path: string): number {
  const v = getPath(root, path);
  if (v === MISSING || v === undefined || v === null) return NaN;
  if (typeof v === "number") return v;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

/** Numeric write. Refuses NaN so a bad dev input cannot poison a world. */
export function setNum(root: unknown, path: string, value: number): boolean {
  if (!Number.isFinite(value)) return false;
  return setPath(root, path, value) !== MISSING;
}

/** Numeric write relative to the current value, guarding overflow. */
export function addNum(root: unknown, path: string, delta: number): number {
  const cur = getNum(root, path);
  if (!Number.isFinite(cur)) return NaN;
  const next = cur + delta;
  if (!Number.isFinite(next)) return cur;
  setNum(root, path, next);
  return next;
}

/** Paths that a dev is never allowed to write, whatever their capability. */
export const PROTECTED_PATHS = new Set<string>([
  "id",
  "iso3",
  "isoNumeric",
  "version",
  "createdAt",
  "annexedBy",
  "overlord",
]);

export function isProtected(path: string): boolean {
  return PROTECTED_PATHS.has(path) || path.startsWith("__");
}

/** First differing path between two objects, for the audit log. */
export function diffPath(a: unknown, b: unknown, prefix = ""): string | null {
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return a === b ? null : prefix || "value";
  }
  const ka = a as Record<string, unknown>;
  const kb = b as Record<string, unknown>;
  for (const k of Object.keys(kb)) {
    const p = prefix ? `${prefix}.${k}` : k;
    const d = diffPath(ka[k], kb[k], p);
    if (d) return d;
  }
  return null;
}

/**
 * Deep clone that is safe on the plain-JSON structures the sim uses.
 * structuredClone exists in Workers, but keeping this local means the engine can
 * be unit tested in plain Node without a Workers shim.
 */
export function clone<T>(v: T): T {
  if (v === null || typeof v !== "object") return v;
  if (Array.isArray(v)) return v.map((x) => clone(x)) as unknown as T;
  const out: Record<string, unknown> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    out[k] = clone(val);
  }
  return out as T;
}

/** Structured deep merge used when applying scenario patches. */
export function mergeDeep<T>(base: T, patch: unknown): T {
  if (patch === null || patch === undefined) return base;
  if (typeof base !== "object" || base === null || Array.isArray(base)) {
    return patch as T;
  }
  if (typeof patch !== "object" || Array.isArray(patch)) return patch as T;
  const out = base as Record<string, unknown>;
  for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
    if (v === undefined) continue;
    if (v !== null && typeof v === "object" && !Array.isArray(v) && typeof out[k] === "object" && out[k] !== null && !Array.isArray(out[k])) {
      out[k] = mergeDeep(out[k], v);
    } else {
      out[k] = clone(v);
    }
  }
  return out as T;
}