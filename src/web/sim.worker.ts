/// <reference lib="webworker" />
import type { Company, Country, World } from "../shared/types";
import { getScenario } from "../data/scenarios";
import { buildWorld } from "../sim/bootstrap";
import { SimEngine } from "../sim/engine";
import { runCommand } from "../sim/commands";
import { runDevOp } from "../sim/dev-ops";
import { Rng } from "../sim/rng";

/**
 * The singleplayer game runs here, off the main thread: the world, the clock and
 * every command. The page only ever receives trimmed copies to draw.
 */

export interface SaveMeta {
  id: string;
  name: string;
  scenarioId: string;
  country?: string;
  countryName?: string;
  t: number;
  startDate: World["startDate"];
  updatedAt: number;
}

const ctx = self as unknown as DedicatedWorkerGlobalScope;

let world: World | null = null;
let engine: SimEngine | null = null;
let rng: Rng | null = null;
let focus: string | null = null;
let lastVersion = -1;
let lastPatchAt = 0;
let lastTickAt = 0;
let lastAutosave = 0;
let dirtyFocus = false;
let timer: ReturnType<typeof setInterval> | null = null;

const PATCH_MS = 300;
const AUTOSAVE_MS = 60_000;

// ===========================================================================
// Patches
// ===========================================================================

function stripCountry(c: Country, full: boolean): Country {
  const e = c.economy;
  return {
    ...c,
    relations: full ? c.relations : (undefined as never),
    economy: {
      ...e,
      history: full ? e.history : [],
      macro: { ...e.macro, realHistory: [], priceHistory: [] },
    },
  };
}

function stripCompany(c: Company): Company {
  return c;
}

function buildPatch(): Record<string, unknown> {
  const w = world!;
  const wars = Object.values(w.wars);
  return {
    type: "patch",
    countries: Object.values(w.countries).map((c) => stripCountry(c, c.id === focus || c.id === w.playerCountry)),
    companies: Object.values(w.companies).map(stripCompany),
    wars,
    treaties: Object.values(w.treaties).filter((t) => t.active),
    sanctions: Object.values(w.sanctions),
    bills: Object.values(w.bills).slice(-60),
    characters: w.characters,
    markets: w.markets,
    ticker: w.ticker.slice(0, 60),
    events: w.events.slice(-40),
    control: w.control,
    regions: w.regions,
    t: w.t,
    version: w.version,
    paused: w.paused,
    speed: w.speed,
    globals: w.globals,
    playerCountry: w.playerCountry,
    directives: w.directives,
    params: w.params,
  };
}

function sendPatch(): void {
  if (!world) return;
  ctx.postMessage(buildPatch());
  lastVersion = world.version;
  lastPatchAt = performance.now();
  dirtyFocus = false;
}

// ===========================================================================
// Clock
// ===========================================================================

function startLoop(): void {
  if (timer) clearInterval(timer);
  lastTickAt = performance.now();
  lastAutosave = performance.now();
  timer = setInterval(() => {
    if (!world || !engine) return;
    const now = performance.now();
    const dt = (now - lastTickAt) / 1000;
    lastTickAt = now;
    try {
      engine.tick(dt);
    } catch (err) {
      world.paused = true;
      ctx.postMessage({ type: "error", message: err instanceof Error ? err.message : String(err) });
    }
    if ((world.version !== lastVersion || dirtyFocus) && now - lastPatchAt >= PATCH_MS) sendPatch();
    if (!world.paused && now - lastAutosave >= AUTOSAVE_MS) {
      lastAutosave = now;
      void saveGame("autosave").then((meta) => ctx.postMessage({ type: "saved", meta, auto: true }));
    }
  }, 40);
}

function adopt(w: World, rngState?: number): void {
  world = w;
  engine = new SimEngine(w, rngState);
  rng = new Rng((rngState ?? w.seed) ^ 0x5bd1e995);
  focus = w.playerCountry ?? null;
  startLoop();
}

// ===========================================================================
// Saves live in this browser, in IndexedDB.
// ===========================================================================

const DB_NAME = "crown-singleplayer";
const STORE = "saves";
const META = "meta";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => {
      r.result.createObjectStore(STORE);
      r.result.createObjectStore(META);
    };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

function reqDone<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

let saveScope = "local";

async function saveGame(slot: string): Promise<SaveMeta> {
  const w = world!;
  const id = `${saveScope}:${w.id}:${slot}`;
  const meta: SaveMeta = {
    id,
    name: slot === "autosave" ? `${w.name} (autosave)` : w.name,
    scenarioId: w.scenarioId,
    country: w.playerCountry,
    countryName: w.playerCountry ? w.countries[w.playerCountry]?.name : undefined,
    t: w.t,
    startDate: w.startDate,
    updatedAt: Date.now(),
  };
  const payload = JSON.stringify({ world: w, rng: engine!.rngState });
  const db = await openDb();
  const tx = db.transaction([STORE, META], "readwrite");
  tx.objectStore(STORE).put(payload, id);
  tx.objectStore(META).put(meta, id);
  await txDone(tx);
  db.close();
  return meta;
}

async function listSaves(): Promise<SaveMeta[]> {
  const db = await openDb();
  const metas = await reqDone(db.transaction(META).objectStore(META).getAll() as IDBRequest<SaveMeta[]>);
  db.close();
  return metas.filter((m) => m.id.startsWith(`${saveScope}:`)).sort((a, b) => b.updatedAt - a.updatedAt);
}

async function loadSave(id: string): Promise<boolean> {
  const db = await openDb();
  const raw = await reqDone(db.transaction(STORE).objectStore(STORE).get(id) as IDBRequest<string | undefined>);
  db.close();
  if (!raw) return false;
  const parsed = JSON.parse(raw) as { world: World; rng: number };
  parsed.world.paused = true;
  adopt(parsed.world, parsed.rng);
  return true;
}

async function deleteSave(id: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction([STORE, META], "readwrite");
  tx.objectStore(STORE).delete(id);
  tx.objectStore(META).delete(id);
  await txDone(tx);
  db.close();
}

// ===========================================================================
// Messages
// ===========================================================================

ctx.onmessage = async (ev: MessageEvent<{ id: number; kind: string; [k: string]: unknown }>) => {
  const msg = ev.data;
  const reply = (result: unknown) => ctx.postMessage({ type: "reply", id: msg.id, result });
  try {
    switch (msg.kind) {
      case "scope":
        saveScope = String(msg.scope ?? "local");
        return reply({ ok: true });
      case "new-game": {
        const scenario = getScenario(String(msg.scenarioId));
        const id = `${scenario.id}-${Date.now().toString(36)}`;
        const w = buildWorld(scenario, String(msg.name || `${scenario.name}`), id, Date.now(), msg.country ? String(msg.country) : undefined);
        adopt(w);
        return reply({ ok: true, world: w });
      }
      case "preview": {
        // A throwaway build so the setup screen can list a scenario's real polities.
        const scenario = getScenario(String(msg.scenarioId));
        const w = buildWorld(scenario, "preview", "preview", Date.now());
        const rows = Object.values(w.countries).map((c) => ({
          id: c.id, name: c.name, government: c.government, overlord: c.overlord, gdp: c.economy.gdp, population: c.economy.population, leader: w.characters[c.executive.headOfGovernmentId ?? c.executive.headOfStateId ?? ""]?.name ?? "",
          leaderTitle: c.executive.headOfGovernmentId ? c.executive.headOfGovernmentTitle : c.executive.headOfStateTitle, region: c.region, wars: c.wars.length, debt: c.economy.fiscal.debtToGdp, growth: c.economy.gdpGrowth,
        }));
        return reply({ ok: true, polities: rows });
      }
      case "load": {
        const ok = await loadSave(String(msg.saveId));
        return reply(ok ? { ok: true, world } : { ok: false, message: "That save could not be found." });
      }
      case "list-saves":
        return reply({ ok: true, saves: await listSaves() });
      case "delete-save":
        await deleteSave(String(msg.saveId));
        return reply({ ok: true });
      case "save": {
        if (!world) return reply({ ok: false, message: "No game running." });
        const meta = await saveGame(String(msg.slot ?? "manual"));
        return reply({ ok: true, meta, message: "Game saved in this browser." });
      }
      case "export": {
        if (!world || !engine) return reply({ ok: false, message: "No game running." });
        return reply({ ok: true, payload: JSON.stringify({ world, rng: engine.rngState }) });
      }
      case "import": {
        const parsed = JSON.parse(String(msg.payload)) as { world: World; rng: number };
        if (!parsed?.world?.countries) return reply({ ok: false, message: "That is not a CROWN save file." });
        parsed.world.paused = true;
        adopt(parsed.world, parsed.rng);
        return reply({ ok: true, world });
      }
      case "leave": {
        if (world) await saveGame("autosave");
        if (timer) clearInterval(timer);
        timer = null;
        world = null;
        engine = null;
        return reply({ ok: true });
      }
      case "focus":
        focus = msg.country ? String(msg.country) : null;
        dirtyFocus = true;
        return reply({ ok: true });
      case "command": {
        if (!world || !engine || !rng) return reply({ ok: false, message: "No game running." });
        const out = runCommand(world, engine, rng, msg.body as Record<string, unknown>);
        world.version++;
        sendPatch();
        return reply(out);
      }
      case "dev": {
        if (!world || !engine || !rng) return reply({ ok: false, message: "No game running." });
        const out = await runDevOp(world, engine, rng, msg.body as { op: string }, { id: "local", username: String(msg.username ?? "developer") });
        if (out.replaced) adopt(out.replaced);
        world!.version++;
        ctx.postMessage({ type: "snapshot", world });
        const { replaced: _omit, ...rest } = out;
        void _omit;
        return reply(rest);
      }
      default:
        return reply({ ok: false, message: `Unknown message ${msg.kind}` });
    }
  } catch (err) {
    return reply({ ok: false, message: err instanceof Error ? err.message : String(err) });
  }
};
