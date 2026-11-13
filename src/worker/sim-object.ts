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
  WorldEvent,
} from "../shared/types";
import { getScenario } from "../data/scenarios";
import { buildWorld } from "../sim/bootstrap";
import { SimEngine } from "../sim/engine";
import { introduceBill } from "../sim/step-politics";
import {
  appointMinister,
  campaign,
  characterForUserInCountry,
  createPolitician,
  foundParty,
  joinParty,
  runForOffice,
  type CampaignKind,
} from "../sim/politics-players";
import type { Capability, StaffRole } from "../shared/types";
import { runDevOp } from "../sim/dev-ops";
import { runCommand } from "../sim/commands";
import { ACTION_CAPABILITIES, capabilitiesFor } from "./capabilities";
import { pushEvent, recomputeGlobals } from "../sim/bootstrap";
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
    // Bind the object to one world, once. A later request naming a different
    // world is refused rather than served, so an object can never act as another.
    const bound = await this.bindWorld(url);
    if (!bound) return json({ error: "This object serves a different world" }, 409);
    this.bootId = bound;
    const self = this.ctx;

    switch (url.pathname) {
      case "/init":
        return json(await this.init(url));
      case "/start":
        return json(await this.start(request));
      case "/snapshot":
        return json(await this.snapshot());
      case "/patch":
        return json(await this.patch());
      case "/join":
        return this.handleWebSocket(request);
      case "/action":
        return this.action(request);
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

  /**
   * The world id is the name this object was addressed by (`idFromName`).
   * `ctx.id.toString()` is only a hash of it and cannot identify a scenario.
   */
  private bootId: string | null = null;

  /**
   * Epoch ms the clock resumes. 0 means running, Infinity means a lobby that no
   * host has started yet. The tick loop reads it; nothing else advances time.
   */
  private holdUntil = 0;

  /**
   * The world this object serves.
   *
   * The first request to name a world stamps it into durable storage; from then
   * on that stamp wins, so a caller cannot address one object while naming a
   * different world. `ctx.id` alone is a hash in this runtime, so storage is the
   * only authoritative record.
   */
  private async bindWorld(url: URL): Promise<string | null> {
    const wanted = url.searchParams.get("worldId");
    const stored = await this.ctx.storage.get<string>("worldId");
    if (stored && wanted && stored !== wanted) return null;
    if (!stored && wanted) await this.ctx.storage.put("worldId", wanted);
    return stored ?? wanted ?? this.ctx.id.name ?? this.ctx.id.toString();
  }

  private worldId(): string {
    return this.bootId ?? this.ctx.id.name ?? this.ctx.id.toString();
  }
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
    // A world created as a lobby holds its clock until its host starts it, and a
    // countdown holds it until it runs out. Worlds from before the lobby existed
    // (lobby = 0, no start time) keep running exactly as they did.
    const gate = await this.env.DB
      .prepare(`SELECT lobby, starts_at FROM worlds WHERE id = ?`)
      .bind(id)
      .first<{ lobby: number; starts_at: number | null }>()
      .catch(() => null);
    if (!gate) this.holdUntil = 0;
    else if (gate.starts_at) this.holdUntil = gate.starts_at > Date.now() ? Number(gate.starts_at) : 0;
    else this.holdUntil = gate.lobby ? Infinity : 0;
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
    const id = url.searchParams.get("worldId") ?? this.worldId();
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
    // The lobby and its countdown hold the clock: no tick until it is released.
    if (this.holdUntil && Date.now() < this.holdUntil) return;
    if (this.holdUntil) {
      this.holdUntil = 0;
      this.world.paused = false;
      pushEvent(this.world, { kind: "system", severity: "notice", title: `${this.world.name}: the clock starts`, body: "The host started the world.", tags: ["system", "start"] });
    }
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
    await this.load(this.worldId());
    return this.buildPatch();
  }

  private async snapshot(): Promise<{ world: World; users: OnlineUser[]; chat: ChatMessage[] }> {
    await this.load(this.worldId());
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


    void this.load(this.worldId()).then(() => {
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

  /** Hibernation-API entry point for a frame from a subscriber. */
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    const raw = typeof message === "string" ? message : new TextDecoder().decode(message);
    await this.onMessage(ws, raw);
  }

  /** Hibernation-API entry point for a dropped subscriber. */
  async webSocketClose(ws: WebSocket): Promise<void> {
    this.subs.delete(ws);
    this.broadcast(JSON.stringify({ type: "presence", users: this.onlineUsers() }));
  }

  async webSocketError(ws: WebSocket): Promise<void> {
    this.subs.delete(ws);
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

  private async action(request: Request): Promise<Response> {
    const body = (await request.json()) as { type: string; userId?: string; [k: string]: unknown };
    const worldId = this.worldId();
    const userId = String(body.userId ?? "").trim();
    if (!userId) return json({ ok: false, message: "Sign in before acting in a world" }, 401);

    // The Worker checks the roster before forwarding anything. The object checks
    // it again because it is the thing that owns the world: a caller that
    // reaches it another way still cannot act in a world it never joined, and a
    // failed check refuses rather than allows.
    let member: { staff_role: string; capabilities_json: string | null } | null;
    try {
      member = await this.env.DB.prepare(
        `SELECT u.staff_role, u.capabilities_json FROM world_members m JOIN users u ON u.id = m.user_id WHERE m.world_id = ? AND m.user_id = ?`,
      )
        .bind(worldId, userId)
        .first<{ staff_role: string; capabilities_json: string | null }>();
    } catch (err) {
      console.error("roster check failed", err);
      return json({ ok: false, message: "The world is unavailable" }, 503);
    }
    if (!member) return json({ ok: false, message: "Join this world before acting in it" }, 403);

    let extra: Capability[] = [];
    try {
      extra = JSON.parse(String(member.capabilities_json ?? "[]")) as Capability[];
    } catch {
      extra = [];
    }
    const caps = capabilitiesFor(String(member.staff_role ?? "player") as StaffRole, extra);
    return json(await this.applyAction(body, caps));
  }

  /**
   * The country this member holds here, or null if they have not taken one.
   *
   * The world keeps its own record of seats so a command never has to trust a
   * country sent by the client; a reservation made at join is adopted on the
   * member's first action.
   */
  private async seatFor(worldId: string, userId: string, w: World): Promise<string | null> {
    w.seats ??= {};
    const known = w.seats[userId];
    if (known && w.countries[known]) return known;
    const row = await this.env.DB.prepare(`SELECT plays_country FROM world_members WHERE world_id = ? AND user_id = ?`)
      .bind(worldId, userId)
      .first<{ plays_country: string | null }>()
      .catch(() => null);
    const reserved = row?.plays_country ?? null;
    if (!reserved || !w.countries[reserved]) return null;
    w.seats[userId] = reserved;
    return reserved;
  }

  /**
   * The country a country-naming action applies to.
   *
   * The seat is authoritative: an action naming another country is refused, and
   * one naming none takes the seat. Naming a nation another member holds is
   * refused with that hold named, so a reservation cannot be used by proxy.
   */
  private actAs(w: World, seat: string | null, asked: unknown): { country?: string; refusal?: string } {
    const named = String(asked ?? "").trim().toUpperCase();
    if (!named) {
      return seat ? { country: seat } : { refusal: "Claim a country before acting for one" };
    }
    if (seat && named === seat) return { country: seat };
    if (Object.values(w.seats ?? {}).includes(named)) return { refusal: `${named} is held by another member` };
    return { refusal: seat ? `You can only act for the country you hold (${seat})` : "Claim a country before acting for one" };
  }

  private async applyAction(body: { type: string; userId?: string; [k: string]: unknown }, caps: Capability[]): Promise<{ ok: boolean; message: string; data?: unknown }> {
    await this.load(this.worldId());
    const w = this.world!;
    // One table for both the named actions and the world commands they can reach.
    const needed = ACTION_CAPABILITIES[body.type];
    if (!needed) return { ok: false, message: `Unknown action "${body.type}"` };
    if (!caps.includes(needed)) return { ok: false, message: `Missing capability: ${needed}` };
    const actor = String(body.userId ?? "");
    const seat = await this.seatFor(this.worldId(), actor, w);

    try {
      switch (body.type) {
        case "claim-country": {
          const iso3 = String(body.country ?? "");
          const c = w.countries[iso3];
          if (!c) return { ok: false, message: "No such country" };
          if (c.annexedBy) return { ok: false, message: `${c.name} no longer exists` };
          if (c.overlord) return { ok: false, message: `${c.name} is a possession of ${w.countries[c.overlord]?.name ?? c.overlord}` };
          if (!c.legislature && !w.companies) return { ok: false, message: "Nothing to run here" };
          // One seat per nation: the reservation taken at join is what refuses
          // everyone else, and a claim moves the claimant's own seat here.
          const userId = String(body.userId ?? "");
          let holder: { user_id: string } | null;
          try {
            holder = await this.env.DB.prepare(`SELECT user_id FROM world_members WHERE world_id = ? AND plays_country = ?`)
              .bind(this.worldId(), iso3)
              .first<{ user_id: string }>();
          } catch {
            return { ok: false, message: "Could not check who holds that country" };
          }
          if (holder && holder.user_id !== userId) return { ok: false, message: `${c.name} is already played by another member` };
          if (!holder) {
            try {
              await this.env.DB.prepare(`UPDATE world_members SET plays_country = ? WHERE world_id = ? AND user_id = ?`)
                .bind(iso3, this.worldId(), userId)
                .run();
            } catch (err) {
              if (/UNIQUE constraint failed/i.test(String(err))) return { ok: false, message: `${c.name} is already played by another member` };
              return { ok: false, message: "Could not reserve that country" };
            }
          }
          pushEvent(w, { kind: "political", severity: "info", country: iso3, title: `${body.username ?? "A player"} takes the reins in ${c.name}`, body: `The government of ${c.name} is now in human hands.`, byUserId: body.userId, tags: ["player"] });
          w.seats ??= {};
          w.seats[userId] = iso3;
          return { ok: true, message: `You now govern ${c.name}` };
        }
        case "vote": {
          const billId = String(body.billId ?? "");
          const bill = w.bills[billId];
          if (!bill) return { ok: false, message: "That bill no longer exists" };
          if (bill.status !== "introduced" && bill.status !== "in-committee") {
            return { ok: false, message: "That bill is no longer open to votes" };
          }
          if (body.country !== undefined && String(body.country) !== bill.country) {
            return { ok: false, message: "That is another country's bill" };
          }
          // The seat is the sender's character in the bill's country. A caller
          // cannot name a seat: whatever legislatorId and partyId arrive are
          // ignored, so one member cannot vote as another legislator or twice.
          const voter = characterForUserInCountry(w, actor, bill.country);
          if (!voter) return { ok: false, message: "You hold no seat in that country" };
          const choice = String(body.choice ?? "");
          if (choice !== "aye" && choice !== "nay" && choice !== "abstain" && choice !== "present") {
            return { ok: false, message: "Vote aye, nay, abstain or present" };
          }
          if (bill.votes.some((v) => v.legislatorId === voter.id)) {
            return { ok: false, message: `${voter.name} has already voted on this bill` };
          }
          bill.votes.push({ legislatorId: voter.id, partyId: voter.partyId ?? "", choice });
          return { ok: true, message: `Vote recorded for ${voter.name}` };
        }
        case "introduce-bill": {
          const target = this.actAs(w, seat, body.country);
          if (target.refusal) return { ok: false, message: target.refusal };
          const c = w.countries[target.country!];
          if (!c?.legislature) return { ok: false, message: "No legislature there" };
          const chamber = c.legislature.chambers[0];
          // The sponsor and their party are politicians of the country the bill
          // sits in: a member files under their own character, or a name from this
          // country, never a foreign one.
          const askedSponsor = String(body.sponsorId ?? "").trim();
          const sponsor = askedSponsor ? w.characters[askedSponsor] : characterForUserInCountry(w, actor, c.id);
          if (askedSponsor && (!sponsor || sponsor.country !== c.id)) {
            return { ok: false, message: `That sponsor is not a politician in ${c.name}` };
          }
          const askedParty = String(body.sponsorPartyId ?? "").trim();
          if (askedParty && !c.parties.some((p) => p.id === askedParty)) {
            return { ok: false, message: `That party is not registered in ${c.name}` };
          }
          // The sponsor's own party is the only party the bill can carry: an
          // independent sponsor files with none, and a named party that the
          // sponsor does not sit in is refused rather than recorded.
          const sponsorPartyId = sponsor?.partyId ?? "";
          if (askedParty && askedParty !== sponsorPartyId) {
            return { ok: false, message: sponsor ? `${sponsor.name} does not sit in that party` : "Name a sponsor to file under a party" };
          }
          const bill = introduceBill(
            w,
            c.id,
            {
              title: String(body.title ?? "Untitled Bill"),
              summary: String(body.summary ?? ""),
              body: String(body.body ?? ""),
              category: (body.category as "money" | "ordinary" | "constitutional" | "emergency") ?? "ordinary",
              sponsorId: sponsor?.id ?? "",
              sponsorPartyId,
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
          if (!seat) return { ok: false, message: "Claim a country before changing its policy" };
          const held = w.countries[seat];
          if (!held) return { ok: false, message: "That country is not in this world" };
          if (body.country !== undefined && String(body.country) !== seat) return { ok: false, message: "You can only act for the country you hold" };
          const area = String(body.area ?? "") as keyof typeof held.policies;
          if (!(area in held.policies)) return { ok: false, message: "Unknown policy area" };
          held.policies[area] = clamp(Number(body.value ?? 0), -100, 100);
          return { ok: true, message: `${seat}: ${area} policy set to ${held.policies[area]}` };
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
          const target = this.actAs(w, seat, body.country);
          if (target.refusal) return { ok: false, message: target.refusal };
          const c = w.countries[target.country!];
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
          const target = this.actAs(w, seat, body.country);
          if (target.refusal) return { ok: false, message: target.refusal };
          const c = w.countries[target.country!];
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
          const target = this.actAs(w, seat, body.country);
          if (target.refusal) return { ok: false, message: target.refusal };
          const home = w.countries[target.country!];
          if (!home) return { ok: false, message: "No such country" };
          const askedParty = body.partyId ? String(body.partyId).trim() : "";
          const party = askedParty ? home.parties.find((p) => p.id === askedParty) : undefined;
          if (askedParty && !party) {
            return { ok: false, message: `That party is not registered in ${home.name}` };
          }
          const out = createPolitician(w, {
            userId,
            username: String(body.username ?? "Citizen"),
            name: String(body.name ?? ""),
            country: home.id,
            partyId: party?.id,
          }, this.rng!);
          return { ok: out.ok, message: out.message, data: out.character ? { characterId: out.character.id } : undefined };
        }
        case "join-party": {
          const out = joinParty(w, String(body.userId ?? ""), String(body.partyId ?? ""));
          return { ok: out.ok, message: out.message };
        }
        case "found-party": {
          const out = foundParty(w, String(body.userId ?? ""), String(body.name ?? ""), String(body.abbreviation ?? ""), this.rng!);
          return { ok: out.ok, message: out.message };
        }
        case "run-for-office": {
          const office = String(body.office ?? "") as ElectionOffice;
          const allowed: ElectionOffice[] = ["chamber", "head-of-state", "head-of-government", "party-leader"];
          if (!allowed.includes(office)) return { ok: false, message: "Choose an office to contest" };
          const target = this.actAs(w, seat, body.country);
          if (target.refusal) return { ok: false, message: target.refusal };
          const out = runForOffice(w, {
            userId: String(body.userId ?? ""),
            country: target.country!,
            office,
            chamberId: body.chamberId ? String(body.chamberId) : undefined,
            partyId: body.partyId ? String(body.partyId) : undefined,
          }, this.rng!);
          return { ok: out.ok, message: out.message, data: out.electionId ? { electionId: out.electionId } : undefined };
        }
        case "campaign": {
          const kind = String(body.kind ?? "rally") as CampaignKind;
          if (!["rally", "ads", "ground", "debate"].includes(kind)) return { ok: false, message: "Unknown campaign activity" };
          const out = campaign(w, String(body.userId ?? ""), String(body.electionId ?? ""), kind, this.rng!);
          return { ok: out.ok, message: out.message, data: out.delta === undefined ? undefined : { delta: out.delta } };
        }
        case "appoint-minister": {
          const target = this.actAs(w, seat, body.country);
          if (target.refusal) return { ok: false, message: target.refusal };
          return appointMinister(w, String(body.userId ?? ""), target.country!, String(body.area ?? "") as never, String(body.characterId ?? ""));
        }
        case "chat-history":
          return { ok: true, message: "ok", data: this.chat };
        default: {
          // Everything else is a world command, and it acts on the country
          // this member holds. The shared clock is not a player lever.
          if (body.type === "advance" || body.type === "set-speed") {
            return { ok: false, message: "Only a developer can move a world's clock" };
          }
          if (!this.engine || !this.rng) return { ok: false, message: "The world is not running yet" };
          return runCommand(w, this.engine, this.rng, body, seat ?? undefined);
        }
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
    await this.load(this.worldId());
    const w = this.world!;
    const actor = body.actor ?? { id: "system", username: "system" };

    try {
      const result = await runDevOp(w, this.engine!, this.rng!, body, actor);
      if (result.replaced) {
        this.world = result.replaced;
        this.engine = new SimEngine(result.replaced);
        this.rng = new Rng(result.replaced.seed);
        await this.checkpoint();
        this.broadcast(JSON.stringify({ type: "snapshot", world: result.replaced, users: this.onlineUsers() }));
      }
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      pushEvent(w, { kind: "system", severity: "major", title: "Developer operation failed", body: msg, byUserId: actor.id, tags: ["dev", "error"] });
      return { ok: false, message: msg };
    }
  }

  // =========================================================================
  // Persistence
  // =========================================================================

  /** Release the clock at a host's chosen moment. 0 means start now. */
  private async start(request: Request): Promise<{ ok: boolean; startsAt: number }> {
    await this.load(this.worldId());
    const body = (await request.json().catch(() => ({}))) as { startsAt?: number };
    const asked = Number(body.startsAt ?? 0);
    this.holdUntil = Number.isFinite(asked) && asked > Date.now() ? asked : 0;
    if (this.world && this.holdUntil === 0) this.world.paused = false;
    return { ok: true, startsAt: this.holdUntil };
  }

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

