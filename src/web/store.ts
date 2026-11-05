import { create } from "zustand";
import type {
  Bill,
  Character,
  Company,
  Country,
  MapRegion,
  MarketState,
  Sanction,
  Scenario,
  TickerEntry,
  Treaty,
  User,
  War,
  World,
  WorldDirective,
  WorldEvent,
} from "../shared/types";
import { SCENARIOS, DEFAULT_PARAMS } from "../data/scenarios";
import { COUNTRIES } from "../data/countries";
import { SECTORS } from "../data/economy";
import type { SaveMeta } from "./sim.worker";

// ===========================================================================
// Catalogue. Singleplayer needs nothing from the server except the account, so
// it is built right here and the game keeps working if the API is unreachable.
// ===========================================================================

export interface Bootstrap {
  scenarios: Pick<Scenario, "id" | "year" | "name" | "tagline" | "description" | "theme" | "startDate" | "daysPerSecond" | "tags">[];
  countries: { id: string; iso2: string; isoNumeric: string; name: string; continent: string; region: string; government: string; population: number; gdpPerCapita: number; ideology: number; bloc: string }[];
  sectors: typeof SECTORS;
  defaultParams: Record<string, number>;
}

const LOCAL_BOOTSTRAP: Bootstrap = {
  scenarios: SCENARIOS.map((s) => ({ id: s.id, year: s.year, name: s.name, tagline: s.tagline, description: s.description, theme: s.theme, startDate: s.startDate, daysPerSecond: s.daysPerSecond, tags: s.tags })),
  countries: COUNTRIES.map((r) => ({ id: r.iso3, iso2: r.iso2, isoNumeric: r.numeric, name: r.name, continent: r.continent, region: r.region, government: r.government, population: r.pop[3], gdpPerCapita: (r.gdp[3] * 1e9) / (r.pop[3] * 1e6), ideology: r.ideology, bloc: r.bloc })),
  sectors: SECTORS,
  defaultParams: DEFAULT_PARAMS as unknown as Record<string, number>,
};

export interface PolityPreview {
  id: string;
  name: string;
  government: string;
  overlord?: string;
  gdp: number;
  population: number;
  leader: string;
  leaderTitle: string;
  region: string;
  wars: number;
  debt: number;
  growth: number;
}

type ConnectionState = "idle" | "connecting" | "live" | "closed" | "error";

interface PatchPayload {
  countries?: Country[];
  companies?: Company[];
  characters?: Record<string, Character>;
  bills?: Bill[];
  markets?: MarketState;
  wars?: War[];
  treaties?: Treaty[];
  sanctions?: Sanction[];
  events?: WorldEvent[];
  ticker?: TickerEntry[];
  control?: Record<string, string>;
  regions?: MapRegion[];
  t?: number;
  version?: number;
  paused?: boolean;
  speed?: number;
  playerCountry?: string;
  directives?: WorldDirective[];
  params?: Record<string, number>;
  globals?: World["globals"];
}

interface Store {
  user: User | null;
  bootstrap: Bootstrap;
  health: { google: boolean; discord: boolean; password: boolean; env: string; portraits?: boolean } | null;
  saves: SaveMeta[];

  worldId: string | null;
  scenario: Bootstrap["scenarios"][number] | null;
  countries: Record<string, Country>;
  characters: Record<string, Character>;
  companies: Record<string, Company>;
  bills: Record<string, Bill>;
  markets: MarketState | null;
  wars: War[];
  treaties: Treaty[];
  sanctions: Sanction[];
  events: WorldEvent[];
  ticker: TickerEntry[];
  control: Record<string, string>;
  regions: MapRegion[];
  simTime: number;
  version: number;
  paused: boolean;
  speed: number;
  globals: World["globals"] | null;
  connection: ConnectionState;
  playerCountry: string | null;
  params: Record<string, number>;
  directives: WorldDirective[];

  selected: string | null;
  layer: string;
  leftTab: string;
  rightTab: string;
  devOpen: boolean;
  /** War the peace screen is open for. */
  peaceWar: string | null;
  /** Country whose land is being marked on the map right now. */
  peaceDrawing: string | null;
  peaceDrawn: { ring: [number, number][]; share: number; territory: string } | null;
  notice: { text: string; kind: "ok" | "err" } | null;

  set: (p: Partial<Store>) => void;
  loadBootstrap: () => Promise<void>;
  refreshSelf: () => Promise<void>;
  refreshSaves: () => Promise<void>;
  startGame: (scenarioId: string, country: string, name?: string) => Promise<void>;
  loadGame: (saveId: string) => Promise<void>;
  leaveWorld: () => Promise<void>;
  toast: (text: string, kind?: "ok" | "err") => void;
}

const worldInitial = {
  worldId: null as string | null,
  scenario: null as Store["scenario"],
  countries: {} as Record<string, Country>,
  characters: {} as Record<string, Character>,
  companies: {} as Record<string, Company>,
  bills: {} as Record<string, Bill>,
  markets: null as MarketState | null,
  wars: [] as War[],
  treaties: [] as Treaty[],
  sanctions: [] as Sanction[],
  events: [] as WorldEvent[],
  ticker: [] as TickerEntry[],
  control: {} as Record<string, string>,
  regions: [] as MapRegion[],
  simTime: 0,
  version: 0,
  paused: true,
  speed: 1,
  globals: null as World["globals"] | null,
  connection: "idle" as ConnectionState,
  playerCountry: null as string | null,
  params: {} as Record<string, number>,
  directives: [] as WorldDirective[],
  selected: null as string | null,
  layer: "political",
  leftTab: "ticker",
  rightTab: "government",
  devOpen: false,
  peaceWar: null as string | null,
  peaceDrawing: null as string | null,
  peaceDrawn: null as { ring: [number, number][]; share: number; territory: string } | null,
};

let noticeTimer: ReturnType<typeof setTimeout> | null = null;

export const useStore = create<Store>((set, get) => ({
  ...worldInitial,
  user: null,
  bootstrap: LOCAL_BOOTSTRAP,
  health: null,
  saves: [],
  notice: null,
  set: (p) => set(p),
  toast: (text, kind = "ok") => {
    if (noticeTimer) clearTimeout(noticeTimer);
    set({ notice: { text, kind } });
    noticeTimer = setTimeout(() => set({ notice: null }), 4200);
  },
  loadBootstrap: async () => {
    const health = await api<NonNullable<Store["health"]>>("/api/health");
    set({ health });
  },
  refreshSelf: async () => {
    const r = await api<{ user: User | null }>("/api/auth/me");
    set({ user: r.user });
    await call({ kind: "scope", scope: r.user?.id ?? "local" });
  },
  refreshSaves: async () => {
    const r = await call<{ saves: SaveMeta[] }>({ kind: "list-saves" });
    set({ saves: r.saves ?? [] });
  },
  startGame: async (scenarioId, country, name) => {
    set({ ...worldInitial, connection: "connecting" });
    const r = await call<{ ok: boolean; message?: string; world: World }>({ kind: "new-game", scenarioId, country, name });
    if (!r.ok) throw new Error(r.message ?? "Could not start the game");
    adoptWorld(r.world);
  },
  loadGame: async (saveId) => {
    set({ ...worldInitial, connection: "connecting" });
    const r = await call<{ ok: boolean; message?: string; world: World }>({ kind: "load", saveId });
    if (!r.ok) {
      set({ connection: "idle" });
      throw new Error(r.message ?? "Could not load the save");
    }
    adoptWorld(r.world);
  },
  leaveWorld: async () => {
    await call({ kind: "leave" });
    set({ ...worldInitial });
    await get().refreshSaves();
  },
}));

function adoptWorld(w: World): void {
  const scenario = useStore.getState().bootstrap.scenarios.find((s) => s.id === w.scenarioId) ?? null;
  useStore.setState({
    worldId: w.id,
    scenario,
    connection: "live",
    countries: w.countries,
    characters: w.characters,
    companies: w.companies,
    bills: w.bills,
    markets: w.markets,
    wars: Object.values(w.wars),
    treaties: Object.values(w.treaties).filter((t) => t.active),
    sanctions: Object.values(w.sanctions),
    events: w.events.slice(-40),
    ticker: w.ticker.slice(0, 60),
    control: w.control,
    regions: w.regions,
    simTime: w.t,
    version: w.version,
    paused: w.paused,
    speed: w.speed,
    globals: w.globals,
    playerCountry: w.playerCountry ?? null,
    selected: w.playerCountry ?? null,
    params: w.params as unknown as Record<string, number>,
    directives: w.directives,
  });
}

function applyPatch(p: PatchPayload): void {
  const cur = useStore.getState();
  const countries: Record<string, Country> = {};
  for (const c of p.countries ?? []) {
    const prev = cur.countries[c.id];
    countries[c.id] = { ...c, relations: c.relations ?? prev?.relations ?? {}, economy: c.economy.history.length ? c.economy : { ...c.economy, history: prev?.economy.history ?? [] } };
  }
  const companies: Record<string, Company> = {};
  for (const c of p.companies ?? []) companies[c.id] = c;
  const bills: Record<string, Bill> = {};
  for (const b of p.bills ?? []) bills[b.id] = b;
  useStore.setState({
    countries: p.countries ? countries : cur.countries,
    companies: p.companies ? companies : cur.companies,
    characters: p.characters ?? cur.characters,
    bills: p.bills ? bills : cur.bills,
    markets: p.markets ?? cur.markets,
    wars: p.wars ?? cur.wars,
    treaties: p.treaties ?? cur.treaties,
    sanctions: p.sanctions ?? cur.sanctions,
    events: p.events ?? cur.events,
    ticker: p.ticker ?? cur.ticker,
    control: p.control ?? cur.control,
    regions: p.regions ?? cur.regions,
    simTime: p.t ?? cur.simTime,
    version: p.version ?? cur.version,
    paused: p.paused ?? cur.paused,
    speed: p.speed ?? cur.speed,
    globals: p.globals ?? cur.globals,
    playerCountry: p.playerCountry ?? cur.playerCountry,
    params: p.params ?? cur.params,
    directives: p.directives ?? cur.directives,
  });
}

// ===========================================================================
// The simulation worker
// ===========================================================================

let worker: Worker | null = null;
let nextId = 1;
const pending = new Map<number, (v: unknown) => void>();

function ensureWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL("./sim.worker.ts", import.meta.url), { type: "module" });
  worker.onmessage = (ev: MessageEvent<Record<string, unknown>>) => {
    const m = ev.data;
    switch (m.type) {
      case "reply": {
        const done = pending.get(m.id as number);
        pending.delete(m.id as number);
        done?.(m.result);
        break;
      }
      case "patch":
        applyPatch(m as PatchPayload);
        break;
      case "snapshot":
        adoptWorld(m.world as World);
        break;
      case "saved":
        if (!(m.auto as boolean)) useStore.getState().toast("Game saved");
        break;
      case "error":
        useStore.getState().toast(`Simulation paused: ${String(m.message)}`, "err");
        break;
    }
  };
  worker.onerror = (e) => {
    useStore.setState({ connection: "error" });
    useStore.getState().toast(`Simulation worker failed: ${e.message}`, "err");
  };
  return worker;
}

export function call<T = { ok: boolean; message: string }>(msg: Record<string, unknown>): Promise<T> {
  const w = ensureWorker();
  const id = nextId++;
  return new Promise<T>((resolve) => {
    pending.set(id, resolve as (v: unknown) => void);
    w.postMessage({ ...msg, id });
  });
}

export async function previewScenario(scenarioId: string): Promise<PolityPreview[]> {
  const r = await call<{ polities: PolityPreview[] }>({ kind: "preview", scenarioId });
  return r.polities ?? [];
}

export function focusCountry(country: string | null): void {
  void call({ kind: "focus", country });
}

/** Send a player command to the simulation. The first argument is kept so dev tools can share a signature. */
export async function playerAction(_worldId: string, body: Record<string, unknown>): Promise<{ ok: boolean; message: string; data?: unknown }> {
  return call({ kind: "command", body });
}

export async function act(body: Record<string, unknown>): Promise<{ ok: boolean; message: string; data?: unknown }> {
  const r = await call<{ ok: boolean; message: string; data?: unknown }>({ kind: "command", body });
  useStore.getState().toast(r.message, r.ok ? "ok" : "err");
  return r;
}

export async function devOp(_worldId: string, body: Record<string, unknown>): Promise<{ ok: boolean; message: string; data?: unknown }> {
  return call({ kind: "dev", body, username: useStore.getState().user?.username });
}

// ===========================================================================
// Accounts stay on the server.
// ===========================================================================

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { ...init, headers: { "content-type": "application/json", ...(init?.headers ?? {}) }, credentials: "same-origin" });
  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    throw new ApiError(`The server sent an unexpected response (${res.status}).`, res.status);
  }
  if (!res.ok) throw new ApiError((body as { error?: string })?.error ?? `${res.status} ${res.statusText}`, res.status);
  return body as T;
}

export function can(user: User | null, cap: string): boolean {
  return Boolean(user?.capabilities?.includes(cap as never));
}

export function isDevUser(u: User | null): boolean {
  return u?.staffRole === "developer" || u?.staffRole === "owner";
}

export function isStaffUser(u: User | null): boolean {
  return isDevUser(u) || u?.staffRole === "moderator";
}
