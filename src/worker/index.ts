import { Hono } from "hono";
import type { Context } from "hono";
import type { Capability, StaffRole, User } from "../shared/types";
import { SCENARIOS, getScenario } from "../data/scenarios";
import { COUNTRY_ROWS } from "../data/countries";
import { ALL_ISO3 } from "../data/countries";
import { SECTORS } from "../data/economy";
import { WARS_BY_YEAR, TREATIES_BY_YEAR } from "../data/wars";
import { ERAS } from "../data/eras";
import { DEFAULT_PARAMS } from "../data/scenarios";
import {
  type Env,
  audit,
  checkBan,
  clearCookie,
  createSession,
  destroySession,
  checkLoginRate,
  cleanUsername,
  discordAuthorizeUrl,
  exchangeCode,
  exchangeGoogleCode,
  fetchGoogleProfile,
  isEmail,
  normalizeEmail,
  recordLoginAttempt,
  fetchGuilds,
  fetchProfile,
  googleAuthorizeUrl,
  loginWithPassword,
  parseUser,
  registerWithPassword,
  resolveSession,
  sessionCookie,
  setCapabilities,
  upsertOAuthUser,
  upsertUser,
  verifyState,
} from "./auth";
import { ALL_CAPABILITIES, CAPABILITY_LABELS, AuthError, capabilitiesFor, has, isDev, isStaff, requireCapability } from "./capabilities";


export type AppEnv = { Bindings: Env; Variables: { user: User | null } };

const app = new Hono<AppEnv>();

// ===========================================================================
// Middleware
// ===========================================================================

app.use("/api/*", async (c, next) => {
  const token = getCookie(c, c.env.SESSION_COOKIE);
  c.set("user", token ? await resolveSession(c.env, token) : null);
  await next();
});

function getCookie(c: Context<AppEnv>, name: string): string | null {
  const raw = c.req.header("cookie");
  if (!raw) return null;
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}

app.onError((err, c) => {
  if (err instanceof AuthError) return c.json({ error: err.message }, err.status as 400);
  console.error("unhandled", err);
  return c.json({ error: "Internal error", detail: String(err) }, 500);
});

function me(c: { get: (k: "user") => User | null }): User {
  const u = c.get("user");
  if (!u) throw new AuthError("Sign in to continue", 401);
  return u;
}

// ===========================================================================
// Health + bootstrap data
// ===========================================================================

app.get("/api/health", (c) =>
  c.json({
    ok: true,
    service: "crown",
    env: c.env.ENVIRONMENT,
    google: Boolean(c.env.GOOGLE_CLIENT_ID && c.env.GOOGLE_CLIENT_SECRET),
    discord: Boolean(c.env.DISCORD_CLIENT_ID && c.env.DISCORD_CLIENT_SECRET),
    password: true,
    portraits: Boolean(c.env.AI),
    time: Date.now(),
  }),
);

app.get("/api/auth/config", (c) =>
  c.json({
    google: Boolean(c.env.GOOGLE_CLIENT_ID && c.env.GOOGLE_CLIENT_SECRET),
    discord: Boolean(c.env.DISCORD_CLIENT_ID && c.env.DISCORD_CLIENT_SECRET),
    password: true,
    env: c.env.ENVIRONMENT,
  }),
);

/**
 * The static catalogue the client needs before it has a world: scenarios, the
 * country list, sector definitions, the tunables the dev sliders bind to, and
 * the capability table. One request, cached at the edge.
 */
app.get("/api/bootstrap", (c) => {
  const etag = `W/"boot-${SCENARIOS.length}-${COUNTRY_ROWS.length}"`;
  if (c.req.header("if-none-match") === etag) return c.body(null, 304);
  return c.json(
    {
      scenarios: SCENARIOS.map((s) => ({
        id: s.id,
        year: s.year,
        name: s.name,
        tagline: s.tagline,
        description: s.description,
        theme: s.theme,
        startDate: s.startDate,
        daysPerSecond: s.daysPerSecond,
        tags: s.tags,
      })),
      countries: COUNTRY_ROWS.filter((r) => Number(r[8]) > 0).map((r) => ({
        id: r[1],
        iso2: r[2],
        isoNumeric: r[0],
        name: r[3],
        demonym: r[4],
        continent: r[5],
        region: r[6],
        government: r[7],
        population: r[8],
        gdpPerCapita: r[9],
        ideology: r[10],
        bloc: r[11],
      })),
      sectors: SECTORS,
      defaultParams: DEFAULT_PARAMS,
      capabilities: ALL_CAPABILITIES,
      capabilityLabels: CAPABILITY_LABELS,
      eras: Object.keys(ERAS),
      warsByYear: Object.fromEntries(Object.entries(WARS_BY_YEAR).map(([y, w]) => [y, w.map((x) => ({ name: x.name, phase: x.phase, belligerents: x.belligerents }))])),
      treatiesByYear: Object.fromEntries(Object.entries(TREATIES_BY_YEAR).map(([y, t]) => [y, t.map((x) => ({ name: x.name, kind: x.kind, parties: x.parties }))])),
    },
    { headers: { etag } },
  );
});

// ===========================================================================
// Auth
// ===========================================================================

app.get("/api/auth/discord", async (c) => {
  const returnTo = c.req.query("returnTo") ?? "/lobby";
  const nonce = crypto.randomUUID();
  const url = await discordAuthorizeUrl(c.env, nonce, returnTo);
  return c.redirect(url);
});

app.get("/api/auth/discord/callback", async (c) => {
  const state = c.req.query("state");
  const code = c.req.query("code");
  if (!state || !code) return c.redirect(`/?error=${encodeURIComponent("Missing state or code")}`);

  let returnTo = "/lobby";
  try {
    const verified = await verifyState(c.env, state);
    returnTo = verified.returnTo;
  } catch (err) {
    return c.redirect(`/?error=${encodeURIComponent(err instanceof Error ? err.message : "Bad state")}`);
  }

  try {
    const accessToken = await exchangeCode(c.env, code);
    const profile = await fetchProfile(accessToken);

    const existingBan = await checkBan(c.env, profile.id);
    if (existingBan && existingBan.until > Date.now()) {
      return c.redirect(`/?error=${encodeURIComponent(`Suspended: ${existingBan.reason}`)}`);
    }

    const user = await upsertUser(c.env, profile);
    await fetchGuilds(accessToken).catch(() => undefined);

    const ip = c.req.header("cf-connecting-ip") ?? undefined;
    const { token } = await createSession(c.env, user, ip, c.req.header("user-agent") ?? undefined);
    await audit(c.env, { userId: user.id, username: user.username, action: "auth.login", target: user.id, ip });

    c.header("set-cookie", sessionCookie(c.env, token, 60 * 60 * 24 * 30));
    return c.redirect(returnTo);
  } catch (err) {
    return c.redirect(`/?error=${encodeURIComponent(err instanceof Error ? err.message : "Login failed")}`);
  }
});

app.get("/api/auth/google", async (c) => {
  const returnTo = c.req.query("returnTo") ?? "/lobby";
  const nonce = crypto.randomUUID();
  try {
    const url = await googleAuthorizeUrl(c.env, nonce, returnTo);
    return c.redirect(url);
  } catch (err) {
    return c.redirect(`/?error=${encodeURIComponent(err instanceof Error ? err.message : "Google sign-in unavailable")}`);
  }
});

app.get("/api/auth/google/callback", async (c) => {
  const state = c.req.query("state");
  const code = c.req.query("code");
  if (!state || !code) return c.redirect(`/?error=${encodeURIComponent("Google sign-in was cancelled")}`);

  let returnTo = "/lobby";
  try {
    const verified = await verifyState(c.env, state);
    returnTo = verified.returnTo;
  } catch (err) {
    return c.redirect(`/?error=${encodeURIComponent(err instanceof Error ? err.message : "Bad state")}`);
  }

  try {
    const accessToken = await exchangeGoogleCode(c.env, code);
    const profile = await fetchGoogleProfile(accessToken);
    const email = profile.email_verified === true && profile.email ? normalizeEmail(profile.email) : undefined;
    const existingBan = await checkBan(c.env, profile.sub);
    if (existingBan && existingBan.until > Date.now()) {
      return c.redirect(`/?error=${encodeURIComponent(`Suspended: ${existingBan.reason}`)}`);
    }

    const fallbackName = email?.split("@")[0] ?? "Citizen";
    const user = await upsertOAuthUser(c.env, {
      provider: "google",
      providerId: profile.sub,
      username: cleanUsername(profile.name ?? fallbackName),
      globalName: cleanUsername(profile.name ?? fallbackName),
      avatar: profile.picture ?? "",
      email,
    });

    const ip = c.req.header("cf-connecting-ip") ?? undefined;
    const { token } = await createSession(c.env, user, ip, c.req.header("user-agent") ?? undefined);
    await audit(c.env, { userId: user.id, username: user.username, action: "auth.login.google", target: user.id, ip });

    c.header("set-cookie", sessionCookie(c.env, token, 60 * 60 * 24 * 30));
    return c.redirect(returnTo);
  } catch (err) {
    return c.redirect(`/?error=${encodeURIComponent(err instanceof Error ? err.message : "Google sign-in failed")}`);
  }
});

app.post("/api/auth/register", async (c) => {
  const ip = c.req.header("cf-connecting-ip") ?? "local";
  if ((await checkLoginRate(c.env, `register:${ip}`)) >= 8) {
    throw new AuthError("Too many sign-up attempts. Try again in a minute.", 429);
  }
  const body = (await c.req.json().catch(() => ({}))) as { email?: string; password?: string; username?: string };
  const email = normalizeEmail(String(body.email ?? ""));
  const password = String(body.password ?? "");
  const username = String(body.username ?? "").trim();
  if (!isEmail(email)) throw new AuthError("Enter a valid email address", 400);
  if (username.length < 3) throw new AuthError("Choose a username of at least 3 characters", 400);
  if (password.length < 10) throw new AuthError("Password must be at least 10 characters", 400);

  await recordLoginAttempt(c.env, `register:${ip}`);
  const user = await registerWithPassword(c.env, email, password, username);
  const { token } = await createSession(c.env, user, c.req.header("cf-connecting-ip") ?? undefined, c.req.header("user-agent") ?? undefined);
  await audit(c.env, { userId: user.id, username: user.username, action: "auth.register", target: user.id, ip });
  c.header("set-cookie", sessionCookie(c.env, token, 60 * 60 * 24 * 30));
  return c.json({ user });
});

app.post("/api/auth/login", async (c) => {
  const ip = c.req.header("cf-connecting-ip") ?? "local";
  const body = (await c.req.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = normalizeEmail(String(body.email ?? ""));
  const password = String(body.password ?? "");
  if (!isEmail(email) || !password) throw new AuthError("Email or password is incorrect", 401);
  if ((await checkLoginRate(c.env, `login:ip:${ip}`)) >= 20 || (await checkLoginRate(c.env, `login:email:${email}`)) >= 8) {
    throw new AuthError("Too many attempts. Try again in a minute.", 429);
  }

  try {
    const user = await loginWithPassword(c.env, email, password);
    const { token } = await createSession(c.env, user, c.req.header("cf-connecting-ip") ?? undefined, c.req.header("user-agent") ?? undefined);
    await audit(c.env, { userId: user.id, username: user.username, action: "auth.login.password", target: user.id, ip });
    c.header("set-cookie", sessionCookie(c.env, token, 60 * 60 * 24 * 30));
    return c.json({ user });
  } catch (err) {
    await recordLoginAttempt(c.env, `login:ip:${ip}`);
    await recordLoginAttempt(c.env, `login:email:${email}`);
    throw err;
  }
});

app.get("/api/auth/me", (c) => {
  const u = c.get("user");
  if (!u) return c.json({ user: null });
  return c.json({ user: u });
});

app.post("/api/auth/logout", async (c) => {
  const token = getCookie(c, c.env.SESSION_COOKIE);
  if (token) {
    const u = c.get("user");
    await destroySession(c.env, token);
    if (u) await audit(c.env, { userId: u.id, username: u.username, action: "auth.logout", target: u.id });
  }
  return c.json({ ok: true }, { headers: { "set-cookie": clearCookie(c.env) } });
});

// ===========================================================================
// Portraits
// ===========================================================================

function cleanPortraitText(value: string | undefined, fallback: string, max = 80): string {
  const clean = String(value ?? "")
    .replace(/[^\p{L}\p{N} .'\-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
  return clean || fallback;
}

function seedFrom(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % 2_147_483_647;
}

function base64Bytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/**
 * Synthetic official portraits. Generated once, then served from KV forever.
 * The client falls back to a monogram when this returns 204 (no AI binding).
 */
app.get("/api/portrait", async (c) => {
  const name = cleanPortraitText(c.req.query("name"), "A politician");
  const country = cleanPortraitText(c.req.query("country"), "the world");
  const role = cleanPortraitText(c.req.query("role"), "politician", 40);
  const year = Math.min(2100, Math.max(1850, Number(c.req.query("year")) || 2026));
  const seed = seedFrom(`${name}|${country}|${role}|${year}`);
  const key = `portrait:v2:${seed}:${year}`;

  const cached = await c.env.KV.get(key, "arrayBuffer").catch(() => null);
  if (cached) {
    return new Response(cached, {
      headers: { "content-type": "image/png", "cache-control": "public, max-age=31536000, immutable", "x-crown-portrait": "cached" },
    });
  }

  if (!c.env.AI) return c.body(null, 204);

  const ip = c.req.header("cf-connecting-ip") ?? "local";
  const rateKey = `portrait:rate:${ip}:${Math.floor(Date.now() / 60_000)}`;
  const used = Number((await c.env.KV.get(rateKey).catch(() => null)) ?? 0);
  if (used >= 12) return c.body(null, 429);
  await c.env.KV.put(rateKey, String(used + 1), { expirationTtl: 120 }).catch(() => undefined);

  const era =
    year < 1930
      ? "sepia-toned 1920s archival studio photograph, soft vignette, formal dress"
      : year < 1960
        ? "black and white 1950s press photograph, hard flash, formal suit"
        : year < 1990
          ? "1980s colour film photograph, subtle grain, formal suit"
          : "modern high-resolution official portrait photograph, 85mm lens, soft key light, shallow depth of field, dark neutral background";

  const prompt = [
    `Photorealistic ${era}.`,
    `Fictional ${role.replace(/-/g, " ")} named ${name} from ${country}, age ${44 + (seed % 27)}.`,
    "Composed, intelligent expression, looking slightly off camera, head and shoulders, centred.",
    "No text, no watermark, no flags, no medals, not a real person.",
  ].join(" ");

  try {
    const result = (await c.env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
      prompt,
      steps: 4,
      width: 512,
      height: 640,
      seed,
    })) as { image?: string } | Uint8Array;
    const bytes =
      result instanceof Uint8Array
        ? result
        : typeof result?.image === "string"
          ? base64Bytes(result.image)
          : null;
    if (!bytes?.length) return c.body(null, 204);
    await c.env.KV.put(key, bytes, { expirationTtl: 60 * 60 * 24 * 60 }).catch(() => undefined);
    return new Response(bytes, {
      headers: { "content-type": "image/png", "cache-control": "public, max-age=31536000, immutable", "x-crown-portrait": "generated" },
    });
  } catch (err) {
    console.error("portrait generation failed", err);
    return c.body(null, 204);
  }
});

// ===========================================================================
// Worlds
// ===========================================================================

const simStub = (c: { env: Env }, worldId: string) => c.env.SIM.get(c.env.SIM.idFromName(worldId));

app.get("/api/worlds", async (c) => {
  const u = c.get("user");
  const rows = await c.env.DB.prepare(
    `SELECT w.id, w.name, w.scenario_id, w.updated_at, w.created_at, w.is_public, w.owner_id,
            (SELECT COUNT(*) FROM world_members m WHERE m.world_id = w.id) AS members,
            (SELECT COUNT(*) FROM worlds w2 WHERE w2.scenario_id = w.scenario_id AND w2.archived = 0) AS siblings
       FROM worlds w WHERE w.archived = 0 ORDER BY w.updated_at DESC LIMIT 100`,
  ).all<Record<string, unknown>>();
  return c.json({ worlds: rows.results, isStaff: u ? isStaff(u.staffRole) : false });
});

app.post("/api/worlds", async (c) => {
  const u = me(c);
  requireCapability(u, "world.create");
  const body = (await c.req.json()) as { scenarioId?: string; name?: string; description?: string };
  const scenarioId = body.scenarioId ?? "2026";
  const scenario = getScenario(scenarioId);
  const id = `${scenarioId}:${crypto.randomUUID().slice(0, 8)}`;
  const name = (body.name ?? `${scenario.name} ${new Date().toISOString().slice(0, 10)}`).slice(0, 80);

  const stub = simStub(c, id);
  await stub.fetch("https://do/init?worldId=" + encodeURIComponent(id) + "&name=" + encodeURIComponent(name));

  await c.env.DB.prepare(
    `INSERT INTO worlds (id, name, scenario_id, owner_id, created_at, updated_at, is_public, description) VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
  ).bind(id, name, scenarioId, u.id, Date.now(), Date.now(), (body.description ?? "").slice(0, 500)).run();
  await c.env.DB.prepare(`INSERT OR REPLACE INTO world_members (world_id, user_id, joined_at) VALUES (?, ?, ?)`).bind(id, u.id, Date.now()).run();
  await audit(c.env, { userId: u.id, username: u.username, action: "world.create", target: id, after: { scenarioId, name } });

  return c.json({ ok: true, id, name, scenarioId });
});

app.get("/api/worlds/:id", async (c) => {
  const id = c.req.param("id");
  const row = await c.env.DB.prepare(`SELECT * FROM worlds WHERE id = ?`).bind(id).first<Record<string, unknown>>();
  if (!row) return c.json({ error: "No such world" }, 404);
  const stub = simStub(c, id);
  const stats = await stub.fetch("https://do/stats").then((r) => r.json());
  return c.json({ world: parseWorldRow(row), stats });
});

app.delete("/api/worlds/:id", async (c) => {
  const u = me(c);
  requireCapability(u, "world.delete");
  const id = c.req.param("id");
  const before = await c.env.DB.prepare(`SELECT * FROM worlds WHERE id = ?`).bind(id).first<Record<string, unknown>>();
  await c.env.DB.prepare(`UPDATE worlds SET archived = 1 WHERE id = ?`).bind(id).run();
  await audit(c.env, { userId: u.id, username: u.username, action: "world.delete", target: id, before, reason: c.req.query("reason") ?? undefined });
  return c.json({ ok: true });
});

function parseWorldRow(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    name: String(row.name),
    scenarioId: String(row.scenario_id),
    ownerId: row.owner_id ? String(row.owner_id) : null,
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
    isPublic: Boolean(row.is_public),
    archived: Boolean(row.archived),
    description: String(row.description ?? ""),
  };
}

// ===========================================================================
// Live world data
// ===========================================================================

app.get("/api/worlds/:id/snapshot", async (c) => {
  const id = c.req.param("id");
  const stub = simStub(c, id);
  const res = await stub.fetch("https://do/snapshot");
  return c.json(await res.json());
});

app.get("/api/worlds/:id/patch", async (c) => {
  const id = c.req.param("id");
  const stub = simStub(c, id);
  const res = await stub.fetch("https://do/patch");
  return c.json(await res.json());
});

app.get("/api/worlds/:id/stats", async (c) => {
  const id = c.req.param("id");
  const stub = simStub(c, id);
  return c.json(await stub.fetch("https://do/stats").then((r) => r.json()));
});

/** WebSocket upgrade URL for the client. */
app.get("/api/worlds/:id/socket-url", (c) => {
  const u = c.get("user");
  const id = c.req.param("id");
  const q = new URLSearchParams({
    userId: u?.id ?? "anon",
    username: u?.username ?? "guest",
    avatar: u?.avatar ?? "",
    staffRole: u?.staffRole ?? "player",
    country: u?.playsCountry ?? "",
  });
  return c.json({ url: `/api/worlds/${encodeURIComponent(id)}/ws?${q}` });
});

app.get("/api/worlds/:id/ws", async (c) => {
  const id = c.req.param("id");
  const stub = simStub(c, id);
  return stub.fetch(new Request(`https://do/join?${new URL(c.req.url).searchParams}`, { headers: c.req.raw.headers }));
});

// ===========================================================================
// Player actions (capability-checked here, enforced again in the DO)
// ===========================================================================

app.post("/api/worlds/:id/action", async (c) => {
  const u = me(c);
  const id = c.req.param("id");
  const body = (await c.req.json()) as Record<string, unknown>;
  const type = String(body.type ?? "");

  const NEEDED: Record<string, Capability> = {
    "claim-country": "world.play",
    vote: "politics.vote",
    "introduce-bill": "politics.legislate",
    "set-policy": "politics.legislate",
    trade: "economy.trade",
    "raise-referendum": "politics.legislate",
    "found-company": "company.create",
    "create-politician": "world.play",
    "join-party": "politics.campaign",
    "found-party": "politics.campaign",
    "run-for-office": "politics.campaign",
    campaign: "politics.campaign",
    "appoint-minister": "politics.appoint",
    "chat-history": "world.play",
  };
  const cap = NEEDED[type];
  if (cap) requireCapability(u, cap);

  const stub = simStub(c, id);
  const res = await stub.fetch("https://do/action", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...body, userId: u.id, username: u.username }),
  });
  return c.json(await res.json());
});

// ===========================================================================
// Developer API
// ===========================================================================

app.post("/api/worlds/:id/dev", async (c) => {
  const u = me(c);
  requireCapability(u, "dev.worldedit");
  const id = c.req.param("id");
  const body = (await c.req.json()) as Record<string, unknown>;
  const op = String(body.op ?? "");

  const NEEDED: Record<string, Capability> = {
    speed: "dev.directives",
    pause: "dev.directives",
    resume: "dev.directives",
    "fast-forward": "dev.directives",
    "set-param": "dev.worldedit",
    "reset-params": "dev.worldedit",
    "set-stat": "economy.set-stat",
    grant: "economy.grant",
    mint: "economy.grant",
    console: "dev.console",
    "add-directive": "dev.directives",
    "remove-directive": "dev.directives",
    "toggle-directive": "dev.directives",
    "add-rule": "rules.manage",
    "remove-rule": "rules.manage",
    "toggle-rule": "rules.manage",
    "declare-war": "diplomacy.war",
    "end-war": "diplomacy.war",
    annex: "diplomacy.war",
    treaty: "diplomacy.treaty",
    sanction: "diplomacy.sanction",
    "lift-sanction": "diplomacy.sanction",
    "force-election": "politics.override",
    "raise-referendum": "politics.override",
    "form-party": "politics.override",
    "delete-party": "politics.override",
    "remove-leader": "politics.appoint",
    "create-character": "character.create",
    "delete-character": "character.delete",
    "ban-character": "character.ban",
    "ban-party": "politics.override",
    "delete-company": "company.delete",
    "ban-company": "company.ban",
    "remove-country": "dev.worldedit",
    "restore-country": "dev.worldedit",
    "patch-scenario": "scenario.edit",
    "reset-world": "dev.worldedit",
    "set-market": "economy.set-stat",
    kick: "moderation.kick",
  };
  const cap = NEEDED[op];
  if (cap) requireCapability(u, cap);

  const stub = simStub(c, id);
  const res = await stub.fetch("https://do/dev", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...body, actor: { id: u.id, username: u.username } }),
  });
  const out = (await res.json()) as { ok: boolean; message: string };

  await audit(c.env, {
    userId: u.id,
    username: u.username,
    action: `dev.${op}`,
    target: String(body.id ?? body.country ?? body.name ?? id),
    after: body.value !== undefined ? { value: body.value } : undefined,
    reason: body.reason ? String(body.reason) : undefined,
    ip: c.req.header("cf-connecting-ip") ?? undefined,
  });

  return c.json(out);
});

// ===========================================================================
// Scenarios (built-in + developer-authored)
// ===========================================================================

app.get("/api/scenarios", async (c) => {
  const rows = await c.env.DB.prepare(`SELECT id FROM scenarios WHERE builtin = 1`).all<{ id: string }>();
  const custom = await c.env.DB.prepare(`SELECT * FROM scenarios WHERE builtin = 0 ORDER BY updated_at DESC LIMIT 50`).all<Record<string, unknown>>();
  void rows;
  return c.json({
    builtin: SCENARIOS.map((s) => ({ id: s.id, year: s.year, name: s.name, tagline: s.tagline, builtin: true })),
    custom: custom.results.map((r) => ({
      id: String(r.id),
      year: Number(r.year),
      name: String(r.name),
      tagline: String(r.tagline),
      description: String(r.description),
      builtin: false,
      updatedAt: Number(r.updated_at),
    })),
  });
});

app.post("/api/scenarios", async (c) => {
  const u = me(c);
  requireCapability(u, "scenario.create");
  const body = (await c.req.json()) as Partial<{ id: string; year: number; name: string; tagline: string; description: string; params: unknown; overrides: unknown; theme: unknown }>;
  if (!body.name || !body.year) return c.json({ error: "name and year are required" }, 400);
  const id = body.id ?? `custom-${Date.now().toString(36)}`;
  await c.env.DB.prepare(
    `INSERT OR REPLACE INTO scenarios (id, year, name, tagline, description, theme_json, params_json, overrides_json, builtin, author_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`,
  ).bind(id, body.year, body.name, body.tagline ?? "", body.description ?? "", JSON.stringify(body.theme ?? {}), JSON.stringify(body.params ?? {}), JSON.stringify(body.overrides ?? {}), u.id, Date.now(), Date.now()).run();
  await audit(c.env, { userId: u.id, username: u.username, action: "scenario.create", target: id });
  return c.json({ ok: true, id });
});

app.delete("/api/scenarios/:id", async (c) => {
  const u = me(c);
  requireCapability(u, "scenario.delete");
  const id = c.req.param("id");
  const before = await c.env.DB.prepare(`SELECT * FROM scenarios WHERE id = ? AND builtin = 0`).bind(id).first();
  if (!before) return c.json({ error: "Cannot delete a built-in scenario" }, 400);
  await c.env.DB.prepare(`DELETE FROM scenarios WHERE id = ?`).bind(id).run();
  await audit(c.env, { userId: u.id, username: u.username, action: "scenario.delete", target: id, before });
  return c.json({ ok: true });
});

/** The parameter descriptor table the dev sliders render from. */
app.get("/api/dev/params", (c) => {
  const u = c.get("user");
  if (!u || !isDev(u.staffRole)) return c.json({ error: "Forbidden" }, 403);
  return c.json({ defaults: DEFAULT_PARAMS, descriptors: PARAM_DESCRIPTORS });
});

const PARAM_DESCRIPTORS = [
  { key: "tickMs", label: "Tick interval (ms)", group: "core", min: 200, max: 10000, step: 100, description: "How often the world advances. Lower is more live but more CPU." },
  { key: "growthSmoothing", label: "Growth smoothing", group: "core", min: 0.01, max: 0.5, step: 0.01, description: "How fast a country's growth rate converges to its target." },
  { key: "growthBias", label: "Global growth bias", group: "core", min: -1, max: 2, step: 0.05, description: "Master multiplier on all growth. Below 1 shrinks the whole world." },
  { key: "eventRate", label: "Event density", group: "core", min: 0, max: 5, step: 0.1, description: "Scales the frequency of wars, crises and unrest." },
  { key: "seed", label: "RNG seed", group: "core", min: 1, max: 2 ** 31, step: 1, description: "Changing this reshuffles every random draw in the world." },

  { key: "okunSensitivity", label: "Okun sensitivity", group: "economy", min: 0, max: 2, step: 0.05, description: "How sharply unemployment responds to an output gap." },
  { key: "phillipsSensitivity", label: "Phillips sensitivity", group: "economy", min: 0, max: 2, step: 0.05, description: "How tightly inflation tracks labour-market slack." },
  { key: "inflationTarget", label: "Inflation target", group: "economy", min: -0.05, max: 0.2, step: 0.005, description: "The rate central banks steer towards." },
  { key: "wagePush", label: "Wage push", group: "economy", min: 0, max: 2, step: 0.05, description: "How aggressively wages chase prices." },
  { key: "fiscalMultiplier", label: "Fiscal multiplier", group: "economy", min: 0, max: 4, step: 0.1, description: "Output response to a change in the budget balance." },
  { key: "corruptionDrag", label: "Corruption drag", group: "economy", min: 0, max: 2, step: 0.05, description: "Cost of corruption to annual growth." },
  { key: "inequalityDrag", label: "Inequality drag", group: "economy", min: 0, max: 2, step: 0.05, description: "Cost of inequality to consumption." },
  { key: "tradeElasticity", label: "Trade elasticity", group: "economy", min: 0, max: 5, step: 0.1, description: "How strongly trade volume follows the global cycle." },
  { key: "corporateWeight", label: "Corporate weight", group: "economy", min: 0, max: 1, step: 0.05, description: "How much the corporate sector drives GDP." },
  { key: "sanctionBite", label: "Sanction bite", group: "economy", min: 0, max: 3, step: 0.05, description: "Economic damage sanctions actually do." },

  { key: "debtInterestBase", label: "Base interest rate", group: "finance", min: 0, max: 0.2, step: 0.001, description: "The risk-free rate on sovereign debt." },
  { key: "debtInterestRisk", label: "Risk premium", group: "finance", min: 0, max: 0.5, step: 0.005, description: "How fast borrowing costs rise with debt." },
  { key: "bankruptcyThreshold", label: "Default threshold (debt/GDP)", group: "finance", min: 0.5, max: 3, step: 0.05, description: "Debt ratio at which a credit crisis can fire." },
  { key: "marketBeta", label: "Market beta to growth", group: "finance", min: 0, max: 80, step: 1, description: "How strongly equities track GDP growth." },
  { key: "marketVolatility", label: "Market volatility", group: "finance", min: 0, max: 8, step: 0.1, description: "Random daily swing in share prices." },
  { key: "crashProbability", label: "Crash probability (per day)", group: "finance", min: 0, max: 0.05, step: 0.0005, description: "Chance of a global market crash each in-game day." },
  { key: "policyRateSmoothing", label: "Rate smoothing", group: "finance", min: 0.01, max: 1, step: 0.01, description: "How slowly the central bank moves its policy rate." },

  { key: "whipStrength", label: "Party whip strength", group: "politics", min: 0, max: 1, step: 0.02, description: "How reliably members vote with their party." },
  { key: "electionChaos", label: "Election chaos", group: "politics", min: 0, max: 1, step: 0.05, description: "Recounts, judicial challenges and seat redistribution." },
  { key: "corruptionRate", label: "Corruption accrual", group: "politics", min: 0, max: 0.001, step: 0.00002, description: "How fast corruption grows with state size." },

  { key: "warDamage", label: "War damage", group: "military", min: 0, max: 0.01, step: 0.00005, description: "Attrition per active front per tick." },
  { key: "crisisProbability", label: "Crisis probability", group: "events", min: 0, max: 0.05, step: 0.0005, description: "Baseline chance of a systemic crisis each in-game day." },
] as const;

// ===========================================================================
// Moderation + staff
// ===========================================================================

app.get("/api/staff/users", async (c) => {
  const u = me(c);
  if (!isStaff(u.staffRole)) return c.json({ error: "Forbidden" }, 403);
  const q = c.req.query("q") ?? "";
  const rows = await c.env.DB.prepare(
    `SELECT * FROM users WHERE (? = '' OR username LIKE ? OR platform_id = ?) ORDER BY last_seen_at DESC LIMIT 100`,
  ).bind(q, `%${q}%`, q).all<Record<string, unknown>>();
  return c.json({ users: rows.results.map(parseUser) });
});

app.post("/api/staff/users/:id/role", async (c) => {
  const u = me(c);
  if (!isDev(u.staffRole)) return c.json({ error: "Forbidden" }, 403);
  const targetId = c.req.param("id");
  const body = (await c.req.json()) as { role?: StaffRole; capabilities?: Capability[]; reason?: string };
  if (!body.role) return c.json({ error: "role required" }, 400);
  const before = await c.env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(targetId).first<Record<string, unknown>>();
  if (!before) return c.json({ error: "No such user" }, 404);
  const updated = await setCapabilities(c.env, targetId, body.role, body.capabilities ?? []);
  await audit(c.env, { userId: u.id, username: u.username, action: "staff.role", target: targetId, before: parseUser(before), after: updated, reason: body.reason });
  return c.json({ ok: true, user: updated });
});

app.post("/api/staff/users/:id/sanction", async (c) => {
  const u = me(c);
  if (!isStaff(u.staffRole)) return c.json({ error: "Forbidden" }, 403);
  const targetId = c.req.param("id");
  const body = (await c.req.json()) as { kind?: "ban" | "kick" | "mute"; reason?: string; durationHours?: number };
  const kind = body.kind ?? "ban";
  const cap: Capability = kind === "ban" ? "moderation.ban" : kind === "mute" ? "moderation.mute" : "moderation.kick";
  requireCapability(u, cap);

  const target = await c.env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(targetId).first<Record<string, unknown>>();
  if (!target) return c.json({ error: "No such user" }, 404);
  const tu = parseUser(target);

  if (kind === "ban") {
    const until = body.durationHours ? Date.now() + body.durationHours * 3600_000 : null;
    await c.env.DB.prepare(`UPDATE users SET banned_until = ?, ban_reason = ? WHERE id = ?`).bind(until, body.reason ?? "", targetId).run();
    await c.env.DB.prepare(`INSERT INTO bans (id, user_id, platform_id, kind, reason, until, issued_by, issued_at) VALUES (?, ?, ?, 'ban', ?, ?, ?, ?)`)
      .bind(`ban_${Date.now()}`, targetId, tu.platformId, body.reason ?? "", until, u.id, Date.now()).run();
    await c.env.DB.prepare(`DELETE FROM sessions WHERE user_id = ?`).bind(targetId).run();
  } else if (kind === "mute") {
    const until = body.durationHours ? Date.now() + body.durationHours * 3600_000 : null;
    await c.env.DB.prepare(`UPDATE users SET muted_until = ? WHERE id = ?`).bind(until, targetId).run();
    await c.env.DB.prepare(`INSERT INTO bans (id, user_id, platform_id, kind, reason, until, issued_by, issued_at) VALUES (?, ?, ?, 'mute', ?, ?, ?, ?)`)
      .bind(`mute_${Date.now()}`, targetId, tu.platformId, body.reason ?? "", until, u.id, Date.now()).run();
  }

  // A kick needs the running world to drop the sockets.
  if (kind === "kick") {
    for (const w of (await c.env.DB.prepare(`SELECT id FROM worlds WHERE archived = 0`).all<{ id: string }>()).results) {
      await simStub(c, w.id)
        .fetch("https://do/dev", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ op: "kick", userId: targetId, username: tu.username, reason: body.reason ?? "" }),
        })
        .catch(() => undefined);
    }
  }

  await audit(c.env, { userId: u.id, username: u.username, action: `moderation.${kind}`, target: targetId, reason: body.reason, before: tu });
  return c.json({ ok: true });
});

app.get("/api/staff/audit", async (c) => {
  const u = me(c);
  if (!isStaff(u.staffRole)) return c.json({ error: "Forbidden" }, 403);
  const limit = Math.min(500, Number(c.req.query("limit") ?? 100));
  const rows = await c.env.DB.prepare(`SELECT * FROM audit_log ORDER BY at DESC LIMIT ?`).bind(limit).all();
  return c.json({ entries: rows.results });
});

app.get("/api/staff/online", async (c) => {
  const u = me(c);
  if (!isStaff(u.staffRole)) return c.json({ error: "Forbidden" }, 403);
  const worlds = await c.env.DB.prepare(`SELECT id FROM worlds WHERE archived = 0`).all<{ id: string }>();
  const out: Record<string, unknown>[] = [];
  for (const w of worlds.results) {
    const stats = await simStub(c, w.id).fetch("https://do/stats").then((r) => r.json()).catch(() => null);
    if (stats && typeof stats === "object" && (stats as { subscribers?: number }).subscribers) out.push({ worldId: w.id, ...(stats as object) });
  }
  return c.json({ worlds: out });
});

// ===========================================================================
// Static assets (when not deploying the frontend to Pages)
// ===========================================================================

app.all("*", async (c) => {
  if (c.req.path.startsWith("/api/")) return c.json({ error: "Not found" }, 404);

  return c.env.ASSETS.fetch(c.req.raw);
});


// Keep tree-shaking honest about the re-exports the UI relies on.
export default app;

// Durable Object entrypoint export — wrangler.toml declares class_name = "SimObject",
// so Wrangler requires a class named SimObject to be exported from this file.
export { SimObject } from "./sim/SimObject";

// Keep tree-shaking honest about the re-exports the UI relies on.
export { capabilitiesFor, has, ALL_CAPABILITIES, CAPABILITY_LABELS };
export type { Env };
export const COUNTRY_IDS = ALL_ISO3;

