import { create } from "zustand";
import type {
  Bill,
  Character,
  ChatMessage,
  Company,
  Country,
  MarketState,
  OnlineUser,
  Party,
  Scenario,
  TickerEntry,
  User,
  War,
  World,
  WorldEvent,
} from "../shared/types";

// ===========================================================================
// Catalogue (static, loaded once)
// ===========================================================================

export interface Bootstrap {
  scenarios: (Pick<Scenario, "id" | "year" | "name" | "tagline" | "description" | "theme" | "startDate" | "daysPerSecond" | "tags"> & { id: string })[];
  countries: { id: string; iso2: string; isoNumeric: string; name: string; demonym: string; continent: string; region: string; government: string; population: number; gdpPerCapita: number; ideology: number; bloc: string }[];
  sectors: Record<string, { id: string; label: string; blurb: string; growth: number; cyclicality: number; commodityExposure: number; techIntensity: number; sanctionExposure: number; margin: number; capitalIntensity: number; labourIntensity: number }>;
  defaultParams: Record<string, number>;
  capabilities: string[];
  capabilityLabels: Record<string, { label: string; group: string; description: string }>;
}

export interface WorldSummary {
  id: string;
  name: string;
  scenario_id: string;
  updated_at: number;
  created_at: number;
  members: number;
  siblings: number;
}

type ConnectionState = "idle" | "connecting" | "live" | "closed" | "error";

/** What a server patch carries. Everything is optional; absent keys are kept. */
export interface PatchPayload {
  countries?: Country[] | Record<string, Country>;
  parties?: Party[] | Record<string, Party>;
  companies?: Company[] | Record<string, Company>;
  characters?: Character[] | Record<string, Character>;
  bills?: Bill[] | Record<string, Bill>;
  markets?: MarketState;
  wars?: War[] | Record<string, War>;
  events?: WorldEvent[];
  ticker?: TickerEntry[];
  t?: number;
  version?: number;
  paused?: boolean;
  speed?: number;
  globals?: World["globals"];
}

interface Store {
  // auth
  user: User | null;
  bootstrap: Bootstrap | null;
  health: { google: boolean; discord: boolean; password: boolean; env: string; portraits?: boolean } | null;

  // lobby
  worlds: WorldSummary[];

  // world
  worldId: string | null;
  scenario: Bootstrap["scenarios"][number] | null;
  countries: Record<string, Country>;
  parties: Record<string, Party>;
  characters: Record<string, Character>;
  companies: Record<string, Company>;
  bills: Record<string, Bill>;
  markets: MarketState | null;
  wars: War[];
  events: WorldEvent[];
  ticker: TickerEntry[];
  chat: ChatMessage[];
  online: OnlineUser[];
  simTime: number;
  version: number;
  paused: boolean;
  speed: number;
  globals: World["globals"] | null;
  connection: ConnectionState;

  // ui
  selected: string | null;
  layer: string;
  leftTab: string;
  rightTab: string;
  devOpen: boolean;
  devSection: string;
  notice: { text: string; kind: "ok" | "err" } | null;
  fullWorld: World | null;

  // actions
  set: (p: Partial<Store>) => void;
  loadBootstrap: () => Promise<void>;
  refreshSelf: () => Promise<void>;
  loadWorlds: () => Promise<void>;
  enterWorld: (id: string) => Promise<void>;
  leaveWorld: () => void;
  applyPatch: (p: PatchPayload) => void;
  toast: (text: string, kind?: "ok" | "err") => void;
}

const initial = {
  user: null as User | null,
  bootstrap: null as Bootstrap | null,
  health: null as { google: boolean; discord: boolean; password: boolean; env: string; portraits?: boolean } | null,
  worlds: [] as WorldSummary[],
  worldId: null as string | null,
  scenario: null as Store["scenario"],
  countries: {} as Record<string, Country>,
  parties: {} as Record<string, Party>,
  characters: {} as Record<string, Character>,
  companies: {} as Record<string, Company>,
  bills: {} as Record<string, Bill>,
  markets: null as MarketState | null,
  wars: [] as War[],
  events: [] as WorldEvent[],
  ticker: [] as TickerEntry[],
  chat: [] as ChatMessage[],
  online: [] as OnlineUser[],
  simTime: 0,
  version: 0,
  paused: false,
  speed: 1,
  globals: null as World["globals"] | null,
  connection: "idle" as ConnectionState,
  selected: null as string | null,
  layer: "political",
  leftTab: "ticker",
  rightTab: "country",
  devOpen: false,
  devSection: "console",
  notice: null as { text: string; kind: "ok" | "err" } | null,
  fullWorld: null as World | null,
};

export const useStore = create<Store>((set) => ({
  ...initial,
  set: (p) => set(p),
  toast: (text, kind = "ok") => {
    set({ notice: { text, kind } });
    setTimeout(() => set({ notice: null }), 4200);
  },
  loadBootstrap: async () => {
    const [b, h] = await Promise.all([api<Bootstrap>("/api/bootstrap"), api<{ google: boolean; discord: boolean; password: boolean; env: string; portraits?: boolean }>("/api/health")]);
    set({ bootstrap: b, health: h });
  },
  refreshSelf: async () => {
    const r = await api<{ user: User | null }>("/api/auth/me");
    set({ user: r.user });
  },
  loadWorlds: async () => {
    const r = await api<{ worlds: WorldSummary[] }>("/api/worlds");
    set({ worlds: r.worlds ?? [] });
  },
  enterWorld: async (id) => {
    set({ ...initial, bootstrap: useStore.getState().bootstrap, user: useStore.getState().user, worldId: id, connection: "connecting" });
    const snap = await api<{ world: World; users: OnlineUser[]; chat: ChatMessage[] }>(`/api/worlds/${encodeURIComponent(id)}/snapshot`);
    const s = useStore.getState();
    s.applyPatch({ ...snap.world, countries: Object.values(snap.world.countries), wars: Object.values(snap.world.wars) } as unknown as PatchPayload);
    set({ fullWorld: snap.world, online: snap.users ?? [], chat: snap.chat ?? [] });
    const scen = s.bootstrap?.scenarios.find((x) => x.id === snap.world.scenarioId);
    if (scen) set({ scenario: scen });
    connect(id, set, getStateSafe());
  },
  leaveWorld: () => {
    socket?.close();
    socket = null;
    set({ ...initial, bootstrap: useStore.getState().bootstrap, user: useStore.getState().user });
  },
  applyPatch: (p: PatchPayload) =>
    set(() => {
      const cur = useStore.getState();
      const countries: Record<string, Country> = { ...cur.countries };
      if (Array.isArray(p.countries)) for (const c of p.countries) countries[c.id] = { ...(countries[c.id] ?? {}), ...c };
      else if (p.countries) Object.assign(countries, p.countries);
      const parties: Record<string, Party> = { ...cur.parties };
      if (Array.isArray(p.parties)) for (const x of p.parties) parties[x.id] = x;
      else if (p.parties) Object.assign(parties, p.parties);
      const companies: Record<string, Company> = { ...cur.companies };
      if (Array.isArray(p.companies)) for (const x of p.companies) companies[x.id] = x;
      else if (p.companies) Object.assign(companies, p.companies);
      const characters: Record<string, Character> = { ...cur.characters };
      if (Array.isArray(p.characters)) for (const x of p.characters) characters[x.id] = x;
      else if (p.characters) Object.assign(characters, p.characters);
      const bills: Record<string, Bill> = { ...cur.bills };
      if (Array.isArray(p.bills)) for (const x of p.bills) bills[x.id] = x;
      else if (p.bills) Object.assign(bills, p.bills);
      return {
        countries,
        parties,
        companies,
        characters,
        bills,
        markets: (p.markets as MarketState) ?? cur.markets,
        wars: Array.isArray(p.wars) ? p.wars : p.wars ? Object.values(p.wars) : cur.wars,
        events: (p.events as WorldEvent[]) ?? cur.events,
        ticker: (p.ticker as TickerEntry[]) ?? cur.ticker,
        simTime: typeof p.t === "number" ? p.t : cur.simTime,
        version: typeof p.version === "number" ? p.version : cur.version,
        paused: typeof p.paused === "boolean" ? p.paused : cur.paused,
        speed: typeof p.speed === "number" ? p.speed : cur.speed,
        globals: (p.globals as World["globals"]) ?? cur.globals,
      };
    }),
}));

function getStateSafe() {
  return useStore.getState();
}

// ===========================================================================
// WebSocket
// ===========================================================================

let socket: WebSocket | null = null;
let reconnectTimer: number | null = null;
let reconnectDelay = 1000;

function connect(worldId: string, set: (p: Partial<Store>) => void, store: Store): void {
  socket?.close();
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  const u = store.user;
  const qs = new URLSearchParams({
    userId: u?.id ?? "anon",
    username: u?.username ?? "guest",
    avatar: u?.avatar ?? "",
    staffRole: u?.staffRole ?? "player",
    country: u?.playsCountry ?? "",
  });
  const ws = new WebSocket(`${proto}//${location.host}/api/worlds/${encodeURIComponent(worldId)}/ws?${qs}`);
  socket = ws;
  set({ connection: "connecting" });

  ws.onopen = () => {
    reconnectDelay = 1000;
    set({ connection: "live" });
  };

  ws.onmessage = (ev) => {
    let msg: Record<string, unknown>;
    try {
      msg = JSON.parse(String(ev.data));
    } catch {
      return;
    }
    const st = useStore.getState();
    switch (msg.type) {
      case "snapshot": {
        const w = msg.world as World;
        st.applyPatch({ ...w, countries: Object.values(w.countries), wars: Object.values(w.wars) } as unknown as PatchPayload);
        set({ fullWorld: w, online: (msg.users as OnlineUser[]) ?? [] });
        break;
      }
      case "patch":
        st.applyPatch(msg as never);
        break;
      case "event":
        set({ events: [...st.events, msg.event as WorldEvent].slice(-300) });
        break;
      case "ticker":
        set({ ticker: [msg.entry as TickerEntry, ...st.ticker].slice(0, 80) });
        break;
      case "presence":
        set({ online: (msg.users as OnlineUser[]) ?? [] });
        break;
      case "chat":
        set({ chat: [...st.chat, msg.message as ChatMessage].slice(-300) });
        break;
      case "error":
        st.toast(String(msg.message), "err");
        break;
    }
  };

  ws.onclose = () => {
    set({ connection: "closed" });
    if (reconnectTimer) window.clearTimeout(reconnectTimer);
    reconnectTimer = window.setTimeout(() => connect(worldId, set, useStore.getState()), reconnectDelay);
    reconnectDelay = Math.min(15_000, reconnectDelay * 1.7);
  };

  ws.onerror = () => set({ connection: "error" });
}

export function sendChat(text: string, channel: ChatMessage["channel"] = "global"): void {
  const u = useStore.getState().user;
  socket?.send(
    JSON.stringify({
      type: "chat",
      chat: { text, channel, country: u?.playsCountry },
    }),
  );
}

// ===========================================================================
// API client
// ===========================================================================

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
    credentials: "same-origin",
  });
  const text = await res.text();
  const body = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    throw new ApiError((body as { error?: string })?.error ?? `${res.status} ${res.statusText}`, res.status);
  }
  return body as T;
}

export async function playerAction(worldId: string, body: Record<string, unknown>): Promise<{ ok: boolean; message: string; data?: unknown }> {
  return api(`/api/worlds/${encodeURIComponent(worldId)}/action`, { method: "POST", body: JSON.stringify(body) });
}

export async function devOp(worldId: string, body: Record<string, unknown>): Promise<{ ok: boolean; message: string; data?: unknown }> {
  return api(`/api/worlds/${encodeURIComponent(worldId)}/dev`, { method: "POST", body: JSON.stringify(body) });
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