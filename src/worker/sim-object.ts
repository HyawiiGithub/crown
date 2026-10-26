import type {
  Bill,
  Character,
  ChatMessage,
  Company,
  Country,
  ElectionOffice,

  MarketState,
  OnlineUser,
  Party,
  Scenario,
  TickerEntry,

  War,
  World,
  WorldDirective,
  WorldEvent,
} from "../shared/types";
import { getScenario } from "../data/scenarios";
import { buildWorld } from "../sim/bootstrap";
import { SimEngine, addDirective, addRule, fastForward, setSpeed } from "../sim/engine";
import { ensureRoster, introduceBill } from "../sim/step-politics";
import {
  appointMinister,
  campaign,
  createPolitician,
  foundParty,
  joinParty,
  runForOffice,
  type CampaignKind,
} from "../sim/politics-players";
import { annex, declareWar, imposeSanction, liftSanction, signTreaty } from "../sim/step-world";
import { executeCustomScript } from "../sim/rules";
import { pushEvent, recomputeGlobals } from "../sim/bootstrap";
import { getNum, setNum } from "../sim/paths";
import { Rng, clamp } from "../sim/rng";

/**
 * SimObject: one Durable Object per world.
 *
 * This is the only Cloudflare primitive that can hold a live, mutable,
 * continuously-advancing object in memory, which is exactly what a real-time
 * world simulation needs. The Worker API never touches simulation state
 * directly; it sends messages here.
 *
 * Responsibilities:
 *   - own the World object and the RNG stream
 *   - run the tick loop on an alarm
 *   - broadcast patches to subscribed WebSockets
 *   - apply every player and developer action
 *   - checkpoint to D1 on an interval
 */

const TICK_MS = 2000;
const PATCH_MS = 1000;
const CHECKPOINT_MS = 60_000;
const CHAT_HISTORY = 300;

export interface SimObjectEnv {
  DB: D1Database;
  KV: KVNamespace;
}

interface Subscriber {
  socket: WebSocket;
  userId: string;
  username: string;
  avatar: string;
  staffRole: string;
  country?: string;
  lastSeen: number;
}

interface PersistedWorld {
  world: World;
  rng: number;
}

export class SimObject {
  private world: World | null = null;
  private engine: SimEngine | null = null;
  private rng: Rng | null = null;
  private ctx: DurableObjectState;
  private env: SimObjectEnv;
  private timers: number[] = [];
  private subs = new Map<WebSocket, Subscriber>();
  private chat: ChatMessage[] = [];
  private dirtySince = 0;

  constructor(ctx: DurableObjectState, env: SimObjectEnv) {
    this.ctx = ctx;
    this.env = env;
  }

  // =========================================================================
  // Lifecycle
  // =========================================================================

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const self = this.ctx;

    switch (url.pathname) {
      case "/init":
        return json(await this.init(url));
      case "/snapshot":
        return json(await this.snapshot());
      case "/patch":
        return json(await this.patch());
      case "/join":
        return this.handleWebSocket(request);
      case "/action":
        return json(await this.action(request));
      case "/dev":
        return json(await this.dev(request));
      case "/checkpoint":
        return json(await this.checkpoint());
      case "/stats":
        return json(this.stats());
      default:
        return json({ error: "not found" }, 404);
    }
    void self;
  }

  /** (Re)start the tick loop. Safe to call repeatedly. */
  private ensureRunning(): void {
    if (!this.world) return;
    for (const t of this.timers) clearInterval(t);
    this.timers = [];
    const tick = () => {
      void this.doTick();
    };
    this.timers.push(setInterval(tick, TICK_MS));
    this.timers.push(setInterval(() => void this.doPatch(), PATCH_MS));
    this.timers.push(setInterval(() => void this.checkpoint(), CHECKPOINT_MS));
    this.timers.push(setInterval(() => this.pruneSubscribers(), 15_000));
  }

  // =========================================================================
  // Boot
  // =========================================================================

  private async load(id: string): Promise<void> {
    if (this.world) return;

    const existing = await this.loadCheckpoint(id);
    if (existing) {
      this.world = existing.world;
      this.rng = new Rng(existing.rng);
    } else {
      const scenarioId = id.split(":")[0] || "2026";
      const scenario = getScenario(scenarioId);
      const world = buildWorld(scenario, `${scenario.name} (new)`, id, Date.now());
      this.world = world;
      this.rng = new Rng(scenario.params.seed);
      await this.saveWorldMeta(world, scenario);
    }

    this.engine = new SimEngine(this.world);
    if (!this.world.ticker.length) recomputeGlobals(this.world);
    this.ensureRunning();
  }

  private async loadCheckpoint(id: string): Promise<PersistedWorld | null> {
    try {
      const row = await this.env.DB
        .prepare(`SELECT payload FROM world_snapshots WHERE world_id = ? ORDER BY at DESC LIMIT 1`)
        .bind(id)
        .first<{ payload: string }>();
      if (!row?.payload) return null;
      const parsed = JSON.parse(row.payload) as PersistedWorld;
      if (!parsed?.world?.countries) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  private async saveWorldMeta(world: World, scenario: Scenario): Promise<void> {
    await this.env.DB
      .prepare(`INSERT OR IGNORE INTO worlds (id, name, scenario_id, created_at, updated_at, is_public, description) VALUES (?, ?, ?, ?, ?, 1, ?)`)
      .bind(world.id, world.name, scenario.id, Date.now(), Date.now(), scenario.tagline)
      .run();
  }

  private async init(url: URL): Promise<InitResult> {
    const id = url.searchParams.get("worldId") ?? this.ctx.id.toString();
    const name = url.searchParams.get("name");
    await this.load(id);
    const w = this.world!;
    if (name && name !== w.name) {
      w.name = name;
      await this.env.DB.prepare(`UPDATE worlds SET name = ?, updated_at = ? WHERE id = ?`).bind(name, Date.now(), id).run();
    }
    return { ok: true, worldId: w.id, scenarioId: w.scenarioId, version: w.version, t: w.t };
  }

  // =========================================================================
  // Tick
  // =========================================================================

  private async doTick(): Promise<void> {
    if (!this.engine || !this.world) return;
    try {
      this.engine.tick(TICK_MS / 1000);
      this.dirtySince = Date.now();
      await this.pruneWorld();
    } catch (err) {
      console.error("tick failed", err);
      // A failed tick must never kill the loop. Log, pause, and let a developer
      // intervene from the console rather than spinning.
      if (this.world) this.world.paused = true;
    }
  }

  /**
   * The DO has a memory ceiling. Rather than let a long-running world OOM, we
   * shed the cheapest and least important state first and keep the economy.
   */
  private async pruneWorld(): Promise<void> {
    const w = this.world;
    if (!w) return;
    if (w.events.length > 4000) w.events.splice(0, w.events.length - 4000);
    if (w.ticker.length > 200) w.ticker.length = 200;
    if (w.markets.sentiment && w.ticker.length > 200) w.ticker.length = 200;
    for (const c of Object.values(w.countries)) {
      if (c.economy.history.length > 1200) c.economy.history.splice(0, c.economy.history.length - 1200);
      if (c.referendums.length > 20) c.referendums.splice(0, c.referendums.length - 20);
      if (c.elections.length > 20) c.elections.splice(0, c.elections.length - 20);
    }
    if (this.chat.length > CHAT_HISTORY) this.chat.splice(0, this.chat.length - CHAT_HISTORY);
  }

  private async doPatch(): Promise<void> {
    if (!this.world) return;
    if (Date.now() - this.dirtySince < 400) return;
    if (this.subs.size === 0) return;
    const patch = await this.buildPatch();
    const msg = JSON.stringify({ type: "patch", ...patch });
    this.broadcast(msg);
    this.broadcast(JSON.stringify({ type: "presence", users: this.onlineUsers() }));
  }

  private async buildPatch(): Promise<PatchPayload> {
    const w = this.world!;
    const countries = Object.values(w.countries).map(stripCountry);
    return {
      countries,
      parties: Object.values(w.parties),
      companies: Object.values(w.companies).map(stripCompany),
      events: w.events.slice(-60),
      ticker: w.ticker.slice(0, 40),
      markets: w.markets as MarketState,
      wars: Object.values(w.wars),
      characters: Object.values(w.characters).filter((c) => c.userId).slice(0, 400),
      t: w.t,
      version: w.version,
      paused: w.paused,
      speed: w.speed,
      startDate: w.startDate,
      globals: w.globals,
      bills: Object.values(w.bills).slice(-80),
    };
  }

  private async patch(): Promise<PatchPayload> {
    await this.load(this.ctx.id.toString());
    return this.buildPatch();
  }

  private async snapshot(): Promise<{ world: World; users: OnlineUser[]; chat: ChatMessage[] }> {
    await this.load(this.ctx.id.toString());
    return { world: this.world!, users: this.onlineUsers(), chat: this.chat };
  }

  // =========================================================================
  // WebSockets
  // =========================================================================

  private handleWebSocket(request: Request): Response {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId") ?? "anon";
    const username = url.searchParams.get("username") ?? "guest";
    const avatar = url.searchParams.get("avatar") ?? "";
    const staffRole = url.searchParams.get("staffRole") ?? "player";
    const country = url.searchParams.get("country") ?? undefined;

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    this.ctx.acceptWebSocket(server);
    this.subs.set(server, { socket: server, userId, username, avatar, staffRole, country, lastSeen: Date.now() });

    server.addEventListener("message", (ev) => void this.onMessage(server, String(ev.data)));
    server.addEventListener("close", () => {
      this.subs.delete(server);
      this.broadcast(JSON.stringify({ type: "presence", users: this.onlineUsers() }));
    });
    server.addEventListener("error", () => this.subs.delete(server));

    void this.load(this.ctx.id.toString()).then(() => {
      try {
        server.send(JSON.stringify({ type: "snapshot", world: this.world, users: this.onlineUsers() }));
        this.broadcast(JSON.stringify({ type: "presence", users: this.onlineUsers() }));
      } catch {
        /* socket already gone */
      }
    });

    void client;
    return new Response(null, { status: 101, webSocket: client });
  }

  private async onMessage(ws: WebSocket, raw: string): Promise<void> {
    const sub = this.subs.get(ws);
    if (!sub) return;
    sub.lastSeen = Date.now();
    let msg: ClientMessage;
    try {
      msg = JSON.parse(raw) as ClientMessage;
    } catch {
      return;
    }
    if (msg.type === "ping") {
      ws.send(JSON.stringify({ type: "pong", t: Date.now() }));
    } else if (msg.type === "chat" && msg.chat) {
      const chat: ChatMessage = {
        ...msg.chat,
        id: `m_${Date.now()}_${sub.userId}`,
        userId: sub.userId,
        username: sub.username,
        avatar: sub.avatar,
        at: Date.now(),
      };
      this.chat.push(chat);
      if (this.chat.length > CHAT_HISTORY) this.chat.shift();
      this.broadcast(JSON.stringify({ type: "chat", message: chat }));
    }
  }

  private broadcast(raw: string): void {
    for (const [ws] of this.subs) {
      try {
        ws.send(raw);
      } catch {
        this.subs.delete(ws);
      }
    }
  }

  private pruneSubscribers(): void {
    const cutoff = Date.now() - 120_000;
    for (const [ws, s] of this.subs) {
      if (s.lastSeen < cutoff) {
        try {
          ws.close();
        } catch {
          /* already closed */
        }
        this.subs.delete(ws);
      }
    }
  }

  private onlineUsers(): OnlineUser[] {
    const seen = new Map<string, OnlineUser>();
    for (const s of this.subs.values()) {
      seen.set(s.userId, {
        id: s.userId,
        username: s.username,
        avatar: s.avatar,
        staffRole: s.staffRole as OnlineUser["staffRole"],
        playsCountry: s.country,
        lastSeenAt: s.lastSeen,
      });
    }
    return [...seen.values()];
  }

  // =========================================================================
  // Player actions
  // =========================================================================

  private async action(request: Request): Promise<{ ok: boolean; message: string; data?: unknown }> {
    const body = (await request.json()) as { type: string; userId?: string; [k: string]: unknown };
    await this.load(this.ctx.id.toString());
    const w = this.world!;

    try {
      switch (body.type) {
        case "claim-country": {
          const iso3 = String(body.country ?? "");
          const c = w.countries[iso3];
          if (!c) return { ok: false, message: "No such country" };
          if (c.annexedBy) return { ok: false, message: `${c.name} no longer exists` };
          if (c.overlord) return { ok: false, message: `${c.name} is a possession of ${w.countries[c.overlord]?.name ?? c.overlord}` };
          if (!c.legislature && !w.companies) return { ok: false, message: "Nothing to run here" };
          ensureRoster(w, iso3, this.rng!);
          pushEvent(w, { kind: "political", severity: "info", country: iso3, title: `${body.username ?? "A player"} takes the reins in ${c.name}`, body: `The government of ${c.name} is now in human hands.`, byUserId: body.userId, tags: ["player"] });
          return { ok: true, message: `You now govern ${c.name}` };
        }
        case "vote": {
          const billId = String(body.billId ?? "");
          const bill = w.bills[billId];
          if (!bill) return { ok: false, message: "That bill no longer exists" };
          if (bill.country !== body.country) return { ok: false, message: "That is another country's bill" };
          bill.votes.push({ legislatorId: String(body.legislatorId ?? ""), partyId: String(body.partyId ?? ""), choice: body.choice as "aye" | "nay" });
          return { ok: true, message: "Vote recorded" };
        }
        case "introduce-bill": {
          const c = w.countries[String(body.country ?? "")];
          if (!c?.legislature) return { ok: false, message: "No legislature there" };
          const chamber = c.legislature.chambers[0];
          const bill = introduceBill(
            w,
            c.id,
            {
              title: String(body.title ?? "Untitled Bill"),
              summary: String(body.summary ?? ""),
              body: String(body.body ?? ""),
              category: (body.category as "money" | "ordinary" | "constitutional" | "emergency") ?? "ordinary",
              sponsorId: String(body.sponsorId ?? ""),
              sponsorPartyId: String(body.sponsorPartyId ?? ""),
              chamberId: chamber.id,
              passageChambers: c.legislature.chambers.map((x) => x.id),
              effects: (body.effects as never) ?? {},
              cost: Number(body.cost ?? 0),
              whipStrength: Number(body.whipStrength ?? w.params.whipStrength),
              publicOpinion: Number(body.publicOpinion ?? 50),
              isEmergency: body.isEmergency === true,
            },
            body.userId,
          );
          return bill ? { ok: true, message: "Bill introduced" } : { ok: false, message: "Could not introduce" };
        }
        case "set-policy": {
          const c = w.countries[String(body.country ?? "")];
          const area = String(body.area ?? "") as keyof typeof c.policies;
          if (!c || !(area in c.policies)) return { ok: false, message: "Unknown policy area" };
          c.policies[area] = clamp(Number(body.value ?? 0), -100, 100);
          return { ok: true, message: `${area} policy set to ${c.policies[area]}` };
        }
        case "trade": {
          const co = w.companies[String(body.companyId ?? "")];
          if (!co || !co.listed) return { ok: false, message: "That company is not listed" };
          if (co.banned) return { ok: false, message: "That company is banned from trading" };
          const shares = Math.max(0, Math.floor(Number(body.shares ?? 0)));
          const side = body.side === "sell" ? "sell" : "buy";
          const out = executeTrade(w, co, side, shares, String(body.userId ?? "anon"));
          return { ok: out.ok, message: out.message };
        }
        case "raise-referendum": {
          const c = w.countries[String(body.country ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          c.referendums.push({
            id: `ref-${c.id}-${Math.round(w.t)}`,
            country: c.id,
            question: String(body.question ?? "Should the government continue?"),
            calledBy: c.executive.headOfGovernmentId ?? "",
            at: w.t,
            closesAt: w.t + 45 * 86400,
            options: [
              { id: "yes", label: "Yes", yes: 0 },
              { id: "no", label: "No", yes: 0 },
            ],
            status: "open",
            turnout: 0.6,
          });
          pushEvent(w, { kind: "political", severity: "major", country: c.id, title: `${c.name} calls a referendum`, body: String(body.question ?? ""), byUserId: body.userId, tags: ["referendum"] });
          return { ok: true, message: "Referendum called" };
        }
        case "found-company": {
          const c = w.countries[String(body.country ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          const name = String(body.name ?? "New Venture");
          const id = `co-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.round(w.t)}`;
          const revenue = Math.max(1e6, Number(body.revenue ?? 1e8));
          const company: Company = {
            id,
            name,
            country: c.id,
            sector: (body.sector as Company["sector"]) ?? "manufacturing",
            tier: "small",
            valuation: revenue * 3,
            revenue,
            costs: revenue * 0.9,
            profit: revenue * 0.1,
            employees: Math.max(1, Number(body.employees ?? 100)),
            debt: revenue * 0.2,
            stateOwnership: 0,
            brandValue: revenue * 0.2,
            sharePrice: 100,
            sharePriceYearAgo: 100,
            board: [],
            shareholders: [{ kind: "founder", name: String(body.username ?? body.userId ?? "Founder"), stake: 0.7, votingPower: 0.7 }],
            ownershipFloat: 0.3,
            listed: Boolean(body.listed),
            exchangeId: w.markets.exchanges.find((e) => e.country === c.id)?.id,
            founded: w.t,
            researchLevel: 0.1,
            unionisation: 0.1,
            rd: revenue * 0.02,
            environmentalScore: 0,
            lobbyingPower: 5,
            dailyVolume: 0,
          };
          w.companies[id] = company;
          if (company.listed && company.exchangeId && w.exchanges[company.exchangeId]) w.exchanges[company.exchangeId].listings.push(id);
          pushEvent(w, { kind: "corporate", severity: "major", country: c.id, title: `${name} incorporated in ${c.name}`, body: `A new ${company.sector} company with ${company.employees.toLocaleString()} staff.`, byUserId: body.userId, tags: ["corporate"] });
          return { ok: true, message: `${name} founded`, data: { companyId: id } };
        }
        case "create-politician": {
          const userId = String(body.userId ?? "");
          if (!userId) return { ok: false, message: "Sign in first" };
          const out = createPolitician(w, {
            userId,
            username: String(body.username ?? "Citizen"),
            name: String(body.name ?? ""),
            country: String(body.country ?? ""),
            partyId: body.partyId ? String(body.partyId) : undefined,
          });
          return { ok: out.ok, message: out.message, data: out.character ? { characterId: out.character.id } : undefined };
        }
        case "join-party": {
          const out = joinParty(w, String(body.userId ?? ""), String(body.partyId ?? ""));
          return { ok: out.ok, message: out.message };
        }
        case "found-party": {
          const out = foundParty(w, String(body.userId ?? ""), String(body.name ?? ""), String(body.abbreviation ?? ""));
          return { ok: out.ok, message: out.message };
        }
        case "run-for-office": {
          const office = String(body.office ?? "") as ElectionOffice;
          const allowed: ElectionOffice[] = ["chamber", "head-of-state", "head-of-government", "party-leader"];
          if (!allowed.includes(office)) return { ok: false, message: "Choose an office to contest" };
          const out = runForOffice(w, {
            userId: String(body.userId ?? ""),
            country: String(body.country ?? ""),
            office,
            chamberId: body.chamberId ? String(body.chamberId) : undefined,
            partyId: body.partyId ? String(body.partyId) : undefined,
          });
          return { ok: out.ok, message: out.message, data: out.electionId ? { electionId: out.electionId } : undefined };
        }
        case "campaign": {
          const kind = String(body.kind ?? "rally") as CampaignKind;
          if (!["rally", "ads", "ground", "debate"].includes(kind)) return { ok: false, message: "Unknown campaign activity" };
          const out = campaign(w, String(body.userId ?? ""), String(body.electionId ?? ""), kind);
          return { ok: out.ok, message: out.message, data: out.delta === undefined ? undefined : { delta: out.delta } };
        }
        case "appoint-minister":
          return appointMinister(
            w,
            String(body.userId ?? ""),
            String(body.country ?? ""),
            String(body.area ?? "") as never,
            String(body.characterId ?? ""),
          );
        case "chat-history":
          return { ok: true, message: "ok", data: this.chat };
        default:
          return { ok: false, message: `Unknown action "${body.type}"` };
      }
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : "Action failed" };
    }
  }

  // =========================================================================
  // Developer operations
  // =========================================================================

  private async dev(request: Request): Promise<{ ok: boolean; message: string; data?: unknown }> {
    const body = (await request.json()) as { op: string; actor?: { id: string; username: string }; [k: string]: unknown };
    await this.load(this.ctx.id.toString());
    const w = this.world!;
    const actor = body.actor ?? { id: "system", username: "system" };

    try {
      switch (body.op) {
        // ---- time control ----
        case "speed":
          return setSpeed(w, Number(body.speed ?? 1), body.paused === undefined ? undefined : Boolean(body.paused));
        case "pause":
          return setSpeed(w, w.speed, true);
        case "resume":
          return setSpeed(w, w.speed || 1, false);
        case "fast-forward": {
          const days = Number(body.days ?? 30);
          return fastForward(w, this.engine!, days * 86400);
        }

        // ---- parameters ----
        case "set-param": {
          const key = String(body.key ?? "");
          if (!(key in w.params)) return { ok: false, message: `Unknown parameter "${key}"` };
          const before = getNum(w.params, key);
          if (!setNum(w.params, key, Number(body.value))) return { ok: false, message: `Could not set ${key}` };
          pushEvent(w, { kind: "system", severity: "notice", title: `Parameter ${key} changed`, body: `${before} -> ${body.value} by ${actor.username}`, byUserId: actor.id, tags: ["dev", "params"] });
          return { ok: true, message: `${key} = ${body.value}` };
        }
        case "reset-params": {
          const s = getScenario(w.scenarioId);
          w.params = { ...s.params };
          pushEvent(w, { kind: "system", severity: "notice", title: "Parameters reset", body: `Restored scenario defaults by ${actor.username}`, byUserId: actor.id, tags: ["dev"] });
          return { ok: true, message: "Parameters reset to scenario defaults" };
        }

        // ---- direct stat edits ----
        case "set-stat": {
          const scope = String(body.scope ?? "country");
          const id = String(body.id ?? "");
          const path = String(body.path ?? "");
          const target =
            scope === "country" ? w.countries[id] ?? w.customCountries[id]
            : scope === "company" ? w.companies[id]
            : scope === "global" ? w
            : w.markets;
          if (!target) return { ok: false, message: `No ${scope} "${id}"` };
          const before = getNum(target, path);
          if (!Number.isFinite(before)) return { ok: false, message: `Path "${path}" does not resolve to a number` };
          if (!setNum(target, path, Number(body.value))) return { ok: false, message: "Write refused" };
          pushEvent(w, { kind: "system", severity: "major", country: scope === "country" ? id : undefined, title: `${actor.username} edited ${id}`, body: `${path}: ${before} -> ${body.value}`, byUserId: actor.id, tags: ["dev", "stat"] });
          return { ok: true, message: `${id}.${path} = ${body.value}`, data: { before, after: Number(body.value) } };
        }
        case "inspect": {
          const scope = String(body.scope ?? "country");
          const id = String(body.id ?? "");
          const target =
            scope === "company" ? w.companies[id]
            : scope === "global" ? w
            : scope === "market" ? w.markets
            : w.countries[id] ?? w.customCountries[id];
          if (!target) return { ok: false, message: `No ${scope} "${id}"` };
          return { ok: true, message: "ok", data: target };
        }

        // ---- money ----
        case "grant": {
          const c = w.countries[String(body.id ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          const amount = Number(body.amount ?? 0);
          const where = String(body.where ?? "treasury");
          if (where === "treasury") c.economy.fiscal.treasury += amount;
          else if (where === "gdp") {
            c.economy.gdp += amount;
            c.economy.gdpPerCapita = c.economy.gdp / c.economy.population;
          } else if (where === "reserves") c.economy.reserves += amount;
          else if (where === "debt") c.economy.fiscal.debt += amount;
          else c.economy.fiscal.treasury += amount;
          pushEvent(w, { kind: "economic", severity: "major", country: c.id, title: `${actor.username} adjusted ${c.name}'s books`, body: `${where} ${amount >= 0 ? "+" : ""}${amount.toLocaleString()} credits.`, byUserId: actor.id, tags: ["dev", "money"] });
          return { ok: true, message: `${amount >= 0 ? "+" : ""}${amount.toLocaleString()} credits to ${c.name} (${where})` };
        }
        case "mint": {
          const c = w.countries[String(body.id ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          c.economy.fiscal.treasury += Math.abs(Number(body.amount ?? 0));
          c.economy.monetary.moneySupply = clamp(c.economy.monetary.moneySupply + 0.02, 0.05, 40);
          return { ok: true, message: `Minted ${Number(body.amount ?? 0).toLocaleString()} credits in ${c.name}` };
        }

        // ---- entity lifecycle ----
        case "delete-company": {
          const co = w.companies[String(body.id ?? "")];
          if (!co) return { ok: false, message: "No such company" };
          delete w.companies[co.id];
          for (const ex of w.markets.exchanges) ex.listings = ex.listings.filter((x) => x !== co.id);
          pushEvent(w, { kind: "corporate", severity: "major", country: co.country, title: `${co.name} dissolved`, body: `Removed by ${actor.username}. ${co.employees.toLocaleString()} jobs affected.`, byUserId: actor.id, tags: ["dev", "company"] });
          return { ok: true, message: `${co.name} dissolved` };
        }
        case "ban-company": {
          const co = w.companies[String(body.id ?? "")];
          if (!co) return { ok: false, message: "No such company" };
          co.banned = Boolean(body.banned ?? true);
          co.bannedReason = String(body.reason ?? "Banned by staff");
          if (co.banned) {
            co.listed = false;
            for (const ex of w.markets.exchanges) ex.listings = ex.listings.filter((x) => x !== co.id);
          }
          pushEvent(w, { kind: "corporate", severity: "major", country: co.country, title: `${co.name} ${co.banned ? "banned" : "reinstated"}`, body: co.bannedReason, byUserId: actor.id, tags: ["dev", "company"] });
          return { ok: true, message: co.banned ? `${co.name} banned` : `${co.name} reinstated` };
        }
        case "delete-character": {
          const ch = w.characters[String(body.id ?? "")];
          if (!ch) return { ok: false, message: "No such character" };
          ch.removedAt = w.t;
          const c = w.countries[ch.country];
          if (c) {
            if (c.executive.headOfStateId === ch.id) c.executive.headOfStateId = undefined;
            if (c.executive.headOfGovernmentId === ch.id) c.executive.headOfGovernmentId = undefined;
            if (c?.legislature) for (const list of Object.values(c.legislature.membership)) {
              const i = list.indexOf(ch.id);
              if (i >= 0) list.splice(i, 1);
            }
            for (const p of c.parties) if (p.leaderId === ch.id) p.leaderId = undefined;
          }
          pushEvent(w, { kind: "political", severity: "major", country: ch.country, title: `${ch.name} removed from office`, body: `Removed by ${actor.username}. ${body.reason ?? ""}`, byUserId: actor.id, tags: ["dev", "character"] });
          return { ok: true, message: `${ch.name} removed` };
        }
        case "ban-character": {
          const ch = w.characters[String(body.id ?? "")];
          if (!ch) return { ok: false, message: "No such character" };
          ch.banned = Boolean(body.banned ?? true);
          if (ch.banned) ch.removedAt = w.t;
          else ch.removedAt = undefined;
          return { ok: true, message: ch.banned ? `${ch.name} banned` : `${ch.name} unbanned` };
        }
        case "create-character": {
          const c = w.countries[String(body.country ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          const id = `ch-${c.id}-dev-${Math.round(w.t)}`;
          const ch: Character = {
            id,
            name: String(body.name ?? "New Figure"),
            country: c.id,
            role: (body.role as Character["role"]) ?? "minister",
            partyId: body.partyId ? String(body.partyId) : undefined,
            stats: {
              competence: Number(body.competence ?? 50),
              charisma: Number(body.charisma ?? 50),
              integrity: Number(body.integrity ?? 50),
              ambition: Number(body.ambition ?? 50),
              ideology: Number(body.ideology ?? c.ideology),
              popularity: Number(body.popularity ?? 50),
              experience: Number(body.experience ?? 50),
              militancy: Number(body.militancy ?? 0),
            },
            createdAt: w.t,
          };
          w.characters[id] = ch;
          if (body.asHeadOfGovernment) c.executive.headOfGovernmentId = id;
          if (body.asHeadOfState) c.executive.headOfStateId = id;
          if (body.asMinister) {
            const m = c.executive.ministers.find((x) => x.id === String(body.area ?? "economy"));
            if (m) m.characterId = id;
          }
          return { ok: true, message: `${ch.name} created`, data: { id } };
        }
        case "ban-party": {
          const p = w.parties[String(body.id ?? "")];
          if (!p) return { ok: false, message: "No such party" };
          p.banned = Boolean(body.banned ?? true);
          if (p.banned) {
            p.status = "outside";
            c_government(w, p.country, p.id, false);
          }
          return { ok: true, message: p.banned ? `${p.name} banned` : `${p.name} unbanned` };
        }
        case "remove-leader": {
          const c = w.countries[String(body.id ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          if (body.which === "head-of-state") c.executive.headOfStateId = undefined;
          else if (body.which === "head-of-government") c.executive.headOfGovernmentId = undefined;
          else {
            const m = c.executive.ministers.find((x) => x.id === String(body.area ?? ""));
            if (m) m.characterId = undefined;
          }
          return { ok: true, message: `${body.which ?? "leader"} removed` };
        }
        case "remove-country": {
          const c = w.countries[String(body.id ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          c.annexedBy = String(body.by ?? "INT");
          c.banned = Boolean(body.banned ?? true);
          c.dependencies = {};
          recomputeGlobals(w);
          pushEvent(w, { kind: "political", severity: "catastrophic", country: c.id, title: `${c.name} ceases to exist`, body: `Abolished by ${actor.username}. ${body.reason ?? ""}`, byUserId: actor.id, tags: ["dev", "country"] });
          return { ok: true, message: `${c.name} abolished` };
        }
        case "restore-country": {
          const c = w.countries[String(body.id ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          c.annexedBy = undefined;
          c.banned = false;
          recomputeGlobals(w);
          return { ok: true, message: `${c.name} restored` };
        }

        // ---- world events ----
        case "declare-war": {
          const war = declareWar(w, String(body.attacker ?? ""), String(body.defender ?? ""), String(body.cause ?? "Dev intervention"), actor.id);
          return war ? { ok: true, message: war.name } : { ok: false, message: "Could not declare war" };
        }
        case "end-war": {
          const war = w.wars[String(body.id ?? "")];
          if (!war) return { ok: false, message: "No such war" };
          war.endedAt = w.t;
          war.outcome = "white-peace";
          for (const b of Object.keys(war.belligerents)) {
            const c = w.countries[b];
            if (c) c.wars = c.wars.filter((x) => x !== war.id);
          }
          pushEvent(w, { kind: "military", severity: "major", title: `${war.name} ended by order`, body: `${actor.username} imposed a ceasefire.`, byUserId: actor.id, tags: ["dev", "war"] });
          return { ok: true, message: `${war.name} ended` };
        }
        case "annex": {
          annex(w, String(body.annexer ?? ""), String(body.target ?? ""), String(body.cause ?? "Dev intervention"), actor.id);
          return { ok: true, message: "Annexed" };
        }
        case "treaty": {
          const t = signTreaty(w, (body.kind as never) ?? "alliance", (body.parties as string[]) ?? [], (body.terms as string[]) ?? [], this.rng!, Number(body.tradeBonus ?? 0), actor.id);
          return t ? { ok: true, message: t.name } : { ok: false, message: "Treaty could not be signed" };
        }
        case "sanction": {
          const s = imposeSanction(w, String(body.by ?? ""), String(body.on ?? ""), (body.kind as never) ?? "financial", this.rng!, actor.id);
          return s ? { ok: true, message: "Sanctions imposed" } : { ok: false, message: "Could not impose sanctions" };
        }
        case "lift-sanction":
          liftSanction(w, String(body.id ?? ""), actor.id);
          return { ok: true, message: "Sanctions lifted" };
        case "force-election": {
          const c = w.countries[String(body.country ?? "")];
          if (!c?.legislature) return { ok: false, message: "No legislature" };
          const chamber = c.legislature.chambers.find((x) => x.id === body.chamberId) ?? c.legislature.chambers[0];
          if (!chamber || chamber.election === "none") return { ok: false, message: "This country does not hold elections" };
          for (const e of c.elections) if (e.status !== "complete") e.status = "complete";
          c.elections.push({
            id: `elec-${c.id}-forced-${Math.round(w.t)}`,
            country: c.id,
            chamberId: chamber.id,
            kind: chamber.election,
            scheduledAt: w.t,
            endsAt: w.t + 20 * 86400,
            status: "campaign",
            votes: {},
            turnout: {},
            districtCount: 60,
            districtPopulations: Array.from({ length: 60 }, () => 1 / 60),
            projection: {},
            enthusiasm: 70,
            districtNames: Array.from({ length: 60 }, (_, i) => `Extraordinary Constituency ${i + 1}`),
          });
          pushEvent(w, { kind: "political", severity: "major", country: c.id, title: `${c.name} calls an extraordinary election`, body: `Called by ${actor.username}.`, byUserId: actor.id, tags: ["dev", "election"] });
          return { ok: true, message: "Election forced" };
        }
        case "raise-referendum": {
          const c = w.countries[String(body.country ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          c.referendums.push({
            id: `ref-${c.id}-dev-${Math.round(w.t)}`,
            country: c.id,
            question: String(body.question ?? "Shall the current government continue?"),
            calledBy: actor.id,
            at: w.t,
            closesAt: w.t + 30 * 86400,
            options: [{ id: "yes", label: "Yes", yes: 0 }, { id: "no", label: "No", yes: 0 }],
            status: "open",
            turnout: 0.6,
          });
          return { ok: true, message: "Referendum called" };
        }
        case "form-party": {
          const c = w.countries[String(body.country ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          const id = `${c.id}-party-dev-${Math.round(w.t)}`;
          const p: Party = {
            id,
            country: c.id,
            name: String(body.name ?? "New Movement"),
            abbreviation: String(body.abbreviation ?? "NM"),
            ideology: Number(body.ideology ?? 0),
            cohesion: 70,
            popularity: Number(body.popularity ?? 12),
            color: String(body.color ?? "#8e44ad"),
            seats: {},
            treasury: 1e8,
            memberCount: 1000,
            status: "outside",
            platform: Object.fromEntries(["economy", "tax", "welfare", "health", "education", "environment", "defence", "immigration", "foreign-policy", "justice", "technology", "housing", "energy", "transport", "agriculture", "labour"].map((k) => [k, Number(body.ideology ?? 0)])) as never,
            founded: w.t,
          };
          c.parties.push(p);
          w.parties[id] = p;
          pushEvent(w, { kind: "political", severity: "major", country: c.id, title: `${p.name} founded in ${c.name}`, body: `A new party with ${p.ideology < 0 ? "left" : "right"} leanings. Created by ${actor.username}.`, byUserId: actor.id, tags: ["dev", "party"] });
          return { ok: true, message: `${p.name} founded`, data: { id } };
        }
        case "delete-party": {
          const p = w.parties[String(body.id ?? "")];
          if (!p) return { ok: false, message: "No such party" };
          const c = w.countries[p.country];
          if (c) c.parties = c.parties.filter((x) => x.id !== p.id);
          delete w.parties[p.id];
          return { ok: true, message: `${p.name} dissolved` };
        }

        // ---- directives and rules ----
        case "add-directive": {
          const d = addDirective(w, body.directive as Omit<WorldDirective, "id" | "createdAt">);
          return { ok: true, message: "Directive added", data: d };
        }
        case "remove-directive": {
          const before = w.directives.length;
          w.directives = w.directives.filter((d) => d.id !== String(body.id ?? ""));
          return { ok: true, message: before === w.directives.length ? "No such directive" : "Directive removed" };
        }
        case "toggle-directive": {
          const d = w.directives.find((x) => x.id === String(body.id ?? ""));
          if (!d) return { ok: false, message: "No such directive" };
          d.enabled = Boolean(body.enabled);
          return { ok: true, message: `Directive ${d.enabled ? "enabled" : "disabled"}` };
        }
        case "add-rule": {
          const r = addRule(w, body.rule as never);
          pushEvent(w, { kind: "system", severity: "notice", title: `Rule installed: ${r.name}`, body: `Authored by ${actor.username}.`, byUserId: actor.id, tags: ["dev", "rule"] });
          return { ok: true, message: `Rule "${r.name}" installed`, data: r };
        }
        case "remove-rule": {
          const before = w.directives.length;
          w.directives = w.directives.filter((d) => !(d.kind === "custom-rule" && d.rule.id === String(body.id ?? "")));
          return { ok: true, message: before === w.directives.length ? "No such rule" : "Rule removed" };
        }
        case "toggle-rule": {
          const d = w.directives.find((x): x is Extract<WorldDirective, { kind: "custom-rule" }> => x.kind === "custom-rule" && x.rule.id === String(body.id ?? ""));
          if (!d) return { ok: false, message: "No such rule" };
          d.rule.enabled = Boolean(body.enabled);
          d.enabled = d.rule.enabled;
          return { ok: true, message: `Rule ${d.rule.enabled ? "enabled" : "disabled"}` };
        }
        case "console": {
          const out = executeCustomScript(w, String(body.code ?? ""));
          pushEvent(w, { kind: "system", severity: "info", title: "Console command", body: String(body.code ?? ""), byUserId: actor.id, tags: ["dev", "console"] });
          return { ok: true, message: out ?? "No output", data: { result: out } };
        }

        // ---- scenario editing ----
        case "patch-scenario": {
          const path = String(body.path ?? "");
          const patch = body.patch as Record<string, unknown> | undefined;
          if (!path || !patch) return { ok: false, message: "Need a path and a patch object" };
          const before = getNum(w.scenarioOverrides as unknown, path);
          deepAssign(w.scenarioOverrides as unknown, path, patch);
          pushEvent(w, { kind: "system", severity: "major", title: `Scenario data edited`, body: `${path} patched by ${actor.username}.`, byUserId: actor.id, tags: ["dev", "scenario"] });
          return { ok: true, message: `Patched ${path}`, data: { before } };
        }
        case "reset-world": {
          const scenario = getScenario(w.scenarioId);
          const fresh = buildWorld(scenario, w.name, w.id, Date.now());
          this.world = fresh;
          this.engine = new SimEngine(fresh);
          this.rng = new Rng(scenario.params.seed);
          recomputeGlobals(fresh);
          pushEvent(fresh, { kind: "system", severity: "major", title: "World reset", body: `Rebuilt from the ${scenario.name} scenario by ${actor.username}.`, byUserId: actor.id, tags: ["dev", "reset"] });
          await this.checkpoint();
          this.broadcast(JSON.stringify({ type: "snapshot", world: fresh, users: this.onlineUsers() }));
          return { ok: true, message: "World rebuilt from scenario" };
        }

        // ---- global data ----
        case "set-market": {
          const path = String(body.path ?? "");
          const before = getNum(w.markets, path);
          if (!setNum(w.markets, path, Number(body.value))) return { ok: false, message: "Write refused" };
          return { ok: true, message: `${path}: ${before} -> ${body.value}` };
        }
        case "kick": {
          // Kick a specific user off their sockets in this world.
          const target = String(body.userId ?? "");
          let n = 0;
          for (const [ws, s] of this.subs) {
            if (s.userId === target) {
              try {
                ws.send(JSON.stringify({ type: "error", message: String(body.reason ?? "Removed by staff") }));
                ws.close();
              } catch {
                /* already gone */
              }
              this.subs.delete(ws);
              n++;
            }
          }
          pushEvent(w, { kind: "system", severity: "notice", title: `${actor.username} kicked a player`, body: `${body.username ?? target} removed (${n} connection${n === 1 ? "" : "s"}). ${body.reason ?? ""}`, byUserId: actor.id, tags: ["moderation"] });
          return { ok: true, message: `Kicked ${body.username ?? target} (${n} connection${n === 1 ? "" : "s"})` };
        }

        default:
          return { ok: false, message: `Unknown op "${body.op}"` };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      pushEvent(w, { kind: "system", severity: "major", title: "Developer operation failed", body: msg, byUserId: actor.id, tags: ["dev", "error"] });
      return { ok: false, message: msg };
    }
  }

  // =========================================================================
  // Persistence
  // =========================================================================

  private async checkpoint(): Promise<{ ok: boolean; bytes: number }> {
    if (!this.world || !this.rng) return { ok: false, bytes: 0 };
    const payload: PersistedWorld = { world: this.world, rng: this.rng.state };
    const serialised = JSON.stringify(payload);
    await this.env.DB
      .prepare(`INSERT INTO world_snapshots (id, world_id, at, sim_t, version, payload) VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(`snap_${this.world.id}_${Date.now()}`, this.world.id, Date.now(), Math.round(this.world.t), this.world.version, serialised)
      .run()
      .catch((e) => console.error("checkpoint failed", e));

    // Keep only the last few snapshots; a world archive does not need 400 of them.
    await this.env.DB
      .prepare(`DELETE FROM world_snapshots WHERE world_id = ? AND id NOT IN (SELECT id FROM world_snapshots WHERE world_id = ? ORDER BY at DESC LIMIT 8)`)
      .bind(this.world.id, this.world.id)
      .run()
      .catch(() => undefined);

    await this.env.DB.prepare(`UPDATE worlds SET updated_at = ? WHERE id = ?`).bind(Date.now(), this.world.id).run().catch(() => undefined);
    return { ok: true, bytes: serialised.length };
  }

  private stats(): SimStats {
    const w = this.world;
    if (!w) return { loaded: false };
    return {
      loaded: true,
      id: w.id,
      scenarioId: w.scenarioId,
      t: w.t,
      version: w.version,
      paused: w.paused,
      speed: w.speed,
      countries: Object.keys(w.countries).length,
      companies: Object.keys(w.companies).length,
      characters: Object.keys(w.characters).length,
      parties: Object.keys(w.parties).length,
      wars: Object.values(w.wars).filter((x) => !x.endedAt).length,
      bills: Object.keys(w.bills).length,
      events: w.events.length,
      subscribers: this.subs.size,
      directives: w.directives.length,
      rules: w.directives.filter((d) => d.kind === "custom-rule").length,
    };
  }

  // Hibernation handler. Workers may evict an idle DO; this is the only chance to
  // persist before that happens, so we always checkpoint on the way out.
  async alarm(): Promise<void> {
    await this.checkpoint();
  }
}

// ===========================================================================
// Helpers
// ===========================================================================

function c_government(w: World, country: string, partyId: string, member: boolean): void {
  const c = w.countries[country];
  if (!c) return;
  if (member) {
    if (!c.executive.coalition.includes(partyId)) c.executive.coalition.push(partyId);
  } else {
    c.executive.coalition = c.executive.coalition.filter((x) => x !== partyId);
  }
}

function deepAssign(target: unknown, path: string, value: unknown): void {
  const parts = path.split(".");
  let cur = target as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== "object" || cur[parts[i]] === null) cur[parts[i]] = {};
    cur = cur[parts[i]] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

/** Trim a country before it goes over the wire. */
function stripCountry(c: Country): Country {
  if (!c.legislature) return c;
  return {
    ...c,
    legislature: {
      ...c.legislature,
      membership: {},
    },
    relations: c.relations,
  };
}

function stripCompany(c: Company): Company {
  return { ...c, shareholders: c.shareholders.slice(0, 12) };
}

/**
 * Order execution for the market. Companies price themselves every tick; a
 * player order moves the share price by a slippage term proportional to the
 * order's size relative to the company, which is what stops one rich account
 * from minting the entire index.
 */
function executeTrade(w: World, co: Company, side: "buy" | "sell", shares: number, userId: string): { ok: boolean; message: string } {
  if (shares <= 0) return { ok: false, message: "Enter a positive number of shares" };
  const value = shares * co.sharePrice;
  const impact = clamp(value / Math.max(1, co.valuation) * 6, 0.0005, 0.35);
  const slip = 1 + impact * (side === "buy" ? 1 : -1);
  const fill = co.sharePrice * slip;

  if (side === "sell") {
    if (co.ownershipFloat * co.valuation < value) return { ok: false, message: "Not enough float in the market" };
    co.ownershipFloat = clamp(co.ownershipFloat - (value / Math.max(1, co.valuation)), 0.02, 1);
    co.sharePrice = Math.max(0.05, co.sharePrice * (1 - impact * 0.8));
    pushEvent(w, { kind: "corporate", severity: "info", country: co.country, title: `${shares.toLocaleString()} ${co.name} shares sold`, body: `Filled near ${fill.toFixed(2)}.`, tags: ["market"] });
    return { ok: true, message: `Sold ${shares.toLocaleString()} at ~${fill.toFixed(2)}` };
  }

  // Buying mints the shares from the float and dilutes existing holders.
  if (co.ownershipFloat < value / Math.max(1, co.valuation)) return { ok: false, message: "Not enough shares in the float" };
  co.ownershipFloat = clamp(co.ownershipFloat - value / Math.max(1, co.valuation), 0.02, 1);
  co.sharePrice = Math.min(co.sharePrice * 4, co.sharePrice * (1 + impact * 0.8));
  co.dailyVolume += shares;
  const holder = co.shareholders.find((s) => s.kind === "founder" && s.name === userId);
  if (holder) holder.stake = Math.min(0.9, holder.stake + value / Math.max(1, co.valuation));
  pushEvent(w, { kind: "corporate", severity: "info", country: co.country, title: `${shares.toLocaleString()} ${co.name} shares bought`, body: `Filled near ${fill.toFixed(2)}.`, tags: ["market"] });
  return { ok: true, message: `Bought ${shares.toLocaleString()} at ~${fill.toFixed(2)}` };
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
}

// ===========================================================================
// Local type aliases so this file does not need the Workers global types at
// every call site.
// ===========================================================================

interface ClientMessage {
  type: string;
  chat?: Omit<ChatMessage, "id" | "userId" | "username" | "avatar" | "at">;
}

type InitResult = { ok: boolean; worldId: string; scenarioId: string; version: number; t: number };
interface PatchPayload {
  countries: Country[];
  parties: Party[];
  companies: Company[];
  events: WorldEvent[];
  ticker: TickerEntry[];
  markets: MarketState;
  wars: War[];
  characters: Character[];
  bills: Bill[];
  t: number;
  version: number;
  paused: boolean;
  speed: number;
  startDate: { year: number; month: number; day: number };
  globals: World["globals"];
}
interface SimStats {
  loaded: boolean;
  id?: string;
  scenarioId?: string;
  t?: number;
  version?: number;
  paused?: boolean;
  speed?: number;
  countries?: number;
  companies?: number;
  characters?: number;
  parties?: number;
  wars?: number;
  bills?: number;
  events?: number;
  subscribers?: number;
  directives?: number;
  rules?: number;
}

