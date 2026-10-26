/**
 * Deterministic RNG.
 *
 * Every world carries a seed. The Durable Object holds one RNG stream that is
 * advanced by the tick loop and never by request handling, so two clients
 * observing the same world always see the same numbers. Dev actions that need
 * randomness take their own stream, seeded from the world seed plus the action,
 * so replaying a log reproduces the result.
 */
export class Rng {
  private s: number;

  constructor(seed: number) {
    this.s = (seed >>> 0) || 0x9e3779b9;
  }

  /** xorshift32. Fast, adequate, and identical on every JS engine. */
  next(): number {
    let x = this.s;
    x ^= x << 13;
    x >>>= 0;
    x ^= x >> 17;
    x ^= x << 5;
    x >>>= 0;
    this.s = x;
    return x / 0x100000000;
  }

  /** Uniform in [min, max). */
  float(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Uniform integer in [min, max]. */
  int(min: number, max: number): number {
    return Math.floor(this.float(min, max + 1));
  }

  /** True with probability p. */
  chance(p: number): boolean {
    return this.next() < p;
  }

  /** Approximately normal, mean 0 sd 1. */
  normal(): number {
    // Irwin-Hall approximation: 12 uniforms - 6.
    let s = 0;
    for (let i = 0; i < 12; i++) s += this.next();
    return s - 6;
  }

  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }

  /** Weighted pick. Weights need not sum to 1. */
  weighted<T>(arr: readonly T[], weight: (item: T) => number): T {
    let total = 0;
    for (const it of arr) total += Math.max(0, weight(it));
    if (total <= 0) return this.pick(arr);
    let r = this.next() * total;
    for (const it of arr) {
      r -= Math.max(0, weight(it));
      if (r <= 0) return it;
    }
    return arr[arr.length - 1];
  }

  shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /** Derive an independent stream. Same inputs always give the same stream. */
  fork(salt: string): Rng {
    let h = 2166136261 ^ this.s;
    for (let i = 0; i < salt.length; i++) {
      h ^= salt.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return new Rng(h >>> 0);
  }

  get state(): number {
    return this.s;
  }

  set state(v: number) {
    this.s = v >>> 0;
  }
}

/** Deterministic 32-bit hash of a string, used for seeds derived from ids. */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v);
export const clamp01 = (v: number): number => clamp(v, 0, 1);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const approach = (current: number, target: number, rate: number): number => current + (target - current) * clamp01(rate);

/** Smooth 0..1 weighting curve, `centre` in 0..1, `sharpness` higher = narrower. */
export const bell = (v: number, centre: number, sharpness: number): number => Math.exp(-((v - centre) ** 2) * sharpness);

export const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
export const mean = (xs: readonly number[]): number => (xs.length ? sum(xs) / xs.length : 0);

/** Weighted mean. */
export function weightedMean(xs: readonly number[], ws: readonly number[]): number {
  let num = 0;
  let den = 0;
  for (let i = 0; i < xs.length; i++) {
    num += xs[i] * ws[i];
    den += ws[i];
  }
  return den === 0 ? 0 : num / den;
}