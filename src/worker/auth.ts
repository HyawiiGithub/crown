import type { Capability, Platform, StaffRole, User } from "../shared/types";
import { AuthError, capabilitiesFor } from "./capabilities";

/**
 * Accounts, sessions and the D1 repositories behind them.
 *
 * Supported identities:
 *   - Google OAuth 2.0 (OpenID Connect authorization code flow)
 *   - email + password (PBKDF2-SHA256, server-side only)
 *   - Discord OAuth 2.0 (kept for existing accounts and optional sign-in)
 *
 * One `users` row can have several identities. Sessions are opaque random ids,
 * stored hashed in D1 and mirrored in KV for the fast path. The cookie is
 * HttpOnly + SameSite=Lax + Secure in production.
 */

const DISCORD_AUTHORIZE = "https://discord.com/oauth2/authorize";
const DISCORD_TOKEN = "https://discord.com/api/v10/oauth2/token";
const DISCORD_ME = "https://discord.com/api/v10/users/@me";
const DISCORD_GUILDS = "https://discord.com/api/v10/users/@me/guilds";

const GOOGLE_AUTHORIZE = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO = "https://openidconnect.googleapis.com/v1/userinfo";

export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const STATE_TTL_SECONDS = 600;
const PBKDF2_ITERATIONS = 210_000;
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 200;

export interface Env {
  DB: D1Database;
  KV: KVNamespace;
  SIM: DurableObjectNamespace;
  ASSETS: Fetcher;
  AI?: { run: (model: string, input: Record<string, unknown>) => Promise<unknown> };
  ENVIRONMENT: string;
  PUBLIC_ORIGIN: string;
  SESSION_COOKIE: string;
  DISCORD_CLIENT_ID?: string;
  DISCORD_CLIENT_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  SESSION_SECRET?: string;
  BOOTSTRAP_ADMIN_DISCORD_IDS?: string;
  BOOTSTRAP_ADMIN_EMAILS?: string;
}

export interface DiscordProfile {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
  email?: string | null;
}

export interface AccountProfile {
  provider: Platform;
  providerId: string;
  username: string;
  globalName: string;
  avatar: string;
  email?: string;
}

export interface PasswordIdentity {
  userId: string;
  email: string;
  hash: string;
  salt: string;
  iterations: number;
}

// ===========================================================================
// Encoding helpers
// ===========================================================================

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (const b of arr) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(value: string): Uint8Array {
  const bin = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function randomString(len = 32): string {
  const buf = new Uint8Array(len);
  crypto.getRandomValues(buf);
  return b64url(buf);
}

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return b64url(buf);
}

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return b64url(sig);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

export function cleanUsername(name: string): string {
  const cleaned = name.replace(/[\u0000-\u001f\u007f<>]/g, "").trim().slice(0, 32);
  return cleaned || "Citizen";
}

// ===========================================================================
// Passwords
// ===========================================================================

async function derivePassword(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, key, 256);
  return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string; iterations: number }> {
  if (password.length < PASSWORD_MIN_LENGTH) throw new AuthError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`, 400);
  if (password.length > PASSWORD_MAX_LENGTH) throw new AuthError("Password is too long", 400);
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const derived = await derivePassword(password, salt, PBKDF2_ITERATIONS);
  return { hash: b64url(derived), salt: b64url(salt), iterations: PBKDF2_ITERATIONS };
}

export async function verifyPassword(password: string, identity: Pick<PasswordIdentity, "hash" | "salt" | "iterations">): Promise<boolean> {
  if (!identity.hash || !identity.salt || !identity.iterations) return false;
  const derived = await derivePassword(password, fromB64url(identity.salt), identity.iterations);
  return constantTimeEqual(b64url(derived), identity.hash);
}

// ===========================================================================
// OAuth state
// ===========================================================================

export async function makeState(env: Env, nonce: string, returnTo: string): Promise<string> {
  const payload = JSON.stringify({ n: nonce, r: returnTo, exp: Math.floor(Date.now() / 1000) + STATE_TTL_SECONDS });
  const enc = b64url(new TextEncoder().encode(payload));
  const sig = await hmac(env.SESSION_SECRET || "crown-dev-secret", enc);
  return `${enc}.${sig}`;
}

export async function verifyState(env: Env, state: string): Promise<{ nonce: string; returnTo: string }> {
  const [enc, sig] = state.split(".");
  if (!enc || !sig) throw new AuthError("Malformed OAuth state", 400);
  const expected = await hmac(env.SESSION_SECRET || "crown-dev-secret", enc);
  if (!constantTimeEqual(expected, sig)) throw new AuthError("OAuth state signature mismatch", 400);
  const payload = JSON.parse(atob(enc.replace(/-/g, "+").replace(/_/g, "/"))) as { n: string; r: string; exp: number };
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new AuthError("OAuth state expired", 400);
  if (!payload.r.startsWith("/") || payload.r.startsWith("//")) payload.r = "/";
  return { nonce: payload.n, returnTo: payload.r };
}

// ===========================================================================
// Google
// ===========================================================================

export function googleRedirectUri(env: Env): string {
  return `${env.PUBLIC_ORIGIN.replace(/\/$/, "")}/api/auth/google/callback`;
}

export async function googleAuthorizeUrl(env: Env, nonce: string, returnTo: string): Promise<string> {
  if (!env.GOOGLE_CLIENT_ID) throw new AuthError("GOOGLE_CLIENT_ID is not configured", 500);
  const state = await makeState(env, nonce, returnTo);
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: googleRedirectUri(env),
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
    include_granted_scopes: "true",
  });
  return `${GOOGLE_AUTHORIZE}?${params}`;
}

export async function exchangeGoogleCode(env: Env, code: string): Promise<string> {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) throw new AuthError("Google credentials are not configured", 500);
  const res = await fetch(GOOGLE_TOKEN, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: googleRedirectUri(env),
    }),
  });
  if (!res.ok) throw new AuthError(`Google token exchange failed: ${res.status}`, 502);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new AuthError("Google returned no access token", 502);
  return json.access_token;
}

export interface GoogleProfile {
  sub: string;
  name?: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
}

export async function fetchGoogleProfile(accessToken: string): Promise<GoogleProfile> {
  const res = await fetch(GOOGLE_USERINFO, { headers: { authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new AuthError(`Google profile fetch failed: ${res.status}`, 502);
  const p = (await res.json()) as GoogleProfile;
  if (!p.sub) throw new AuthError("Google profile has no subject", 502);
  return p;
}

// ===========================================================================
// Discord
// ===========================================================================

export function discordAvatarUrl(id: string, avatar: string | null | undefined): string {
  if (!avatar) return `https://cdn.discordapp.com/embed/avatars/${discordIndex(id)}.png`;
  const ext = avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${id}/${avatar}.${ext}?size=128`;
}

function discordIndex(id: string): number {
  try {
    let n = Number(BigInt(`0x${id}`) % 6n);
    if (n < 0) n += 6;
    return n;
  } catch {
    return 0;
  }
}

export function discordRedirectUri(env: Env): string {
  return `${env.PUBLIC_ORIGIN.replace(/\/$/, "")}/api/auth/discord/callback`;
}

export async function discordAuthorizeUrl(env: Env, nonce: string, returnTo: string): Promise<string> {
  if (!env.DISCORD_CLIENT_ID) throw new AuthError("DISCORD_CLIENT_ID is not configured", 500);
  const state = await makeState(env, nonce, returnTo);
  const params = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    redirect_uri: discordRedirectUri(env),
    response_type: "code",
    scope: "identify email guilds",
    state,
    prompt: "consent",
  });
  return `${DISCORD_AUTHORIZE}?${params}`;
}

export async function exchangeCode(env: Env, code: string): Promise<string> {
  if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) throw new AuthError("Discord credentials are not configured", 500);
  const res = await fetch(DISCORD_TOKEN, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: discordRedirectUri(env),
    }),
  });
  if (!res.ok) throw new AuthError(`Discord token exchange failed: ${res.status}`, 502);
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

export async function fetchProfile(accessToken: string): Promise<DiscordProfile> {
  const res = await fetch(DISCORD_ME, { headers: { authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new AuthError(`Discord profile fetch failed: ${res.status}`, 502);
  return (await res.json()) as DiscordProfile;
}

export async function fetchGuilds(accessToken: string): Promise<{ id: string; name: string; owner: boolean }[]> {
  const res = await fetch(DISCORD_GUILDS, { headers: { authorization: `Bearer ${accessToken}` } });
  if (!res.ok) return [];
  return (await res.json()) as { id: string; name: string; owner: boolean }[];
}

// ===========================================================================
// Users
// ===========================================================================

export function parseUser(row: Record<string, unknown>): User {
  let caps: Capability[] = [];
  try {
    caps = JSON.parse(String(row.capabilities_json ?? "[]")) as Capability[];
  } catch {
    caps = [];
  }
  const platform = String(row.platform ?? "password") as Platform;
  const platformId = String(row.platform_id ?? row.id ?? "");
  const rawAvatar = String(row.avatar ?? "");
  return {
    id: String(row.id),
    platform,
    platformId,
    username: String(row.username),
    globalName: String(row.global_name ?? row.username),
    avatar: platform === "discord" && !rawAvatar.startsWith("http") ? discordAvatarUrl(platformId, rawAvatar || null) : rawAvatar,
    email: row.email ? String(row.email) : undefined,
    staffRole: String(row.staff_role ?? "player") as StaffRole,
    capabilities: caps,
    playsCountry: row.plays_country ? String(row.plays_country) : undefined,
    playsCharacterId: row.plays_character_id ? String(row.plays_character_id) : undefined,
    playsCompanyId: row.plays_company_id ? String(row.plays_company_id) : undefined,
    leadsPartyId: row.leads_party_id ? String(row.leads_party_id) : undefined,
    createdAt: Number(row.created_at ?? 0),
    lastSeenAt: Number(row.last_seen_at ?? 0),
    bannedUntil: row.banned_until ? Number(row.banned_until) : undefined,
    banReason: row.ban_reason ? String(row.ban_reason) : undefined,
    mutedUntil: row.muted_until ? Number(row.muted_until) : undefined,
    staffNotes: row.staff_notes ? String(row.staff_notes) : undefined,
    flagged: Boolean(row.flagged),
  };
}

function bootstrapOwner(env: Env, email: string | undefined, discordId?: string): boolean {
  const emails = new Set(
    (env.BOOTSTRAP_ADMIN_EMAILS ?? "")
      .split(",")
      .map((s) => normalizeEmail(s))
      .filter(Boolean),
  );
  const discord = new Set((env.BOOTSTRAP_ADMIN_DISCORD_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean));
  return (email ? emails.has(normalizeEmail(email)) : false) || (discordId ? discord.has(discordId) : false);
}

async function rowById(env: Env, id: string): Promise<Record<string, unknown> | null> {
  return env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(id).first<Record<string, unknown>>();
}

async function cacheUser(env: Env, user: User): Promise<void> {
  await env.KV.put(`user:${user.id}`, JSON.stringify(user), { expirationTtl: 3600 }).catch(() => undefined);
}

async function createAccount(env: Env, profile: AccountProfile): Promise<User> {
  const now = Date.now();
  const id = `u_${crypto.randomUUID()}`;
  const email = profile.email ? normalizeEmail(profile.email) : undefined;
  const role: StaffRole = bootstrapOwner(env, email, profile.provider === "discord" ? profile.providerId : undefined) ? "owner" : "player";
  const caps = capabilitiesFor(role);
  await env.DB.prepare(
    `INSERT INTO users (id, platform, platform_id, username, global_name, avatar, email, staff_role, capabilities_json, created_at, last_seen_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, profile.provider, profile.providerId, profile.username, profile.globalName, profile.avatar, email ?? null, role, JSON.stringify(caps), now, now)
    .run();
  const user: User = {
    id,
    platform: profile.provider,
    platformId: profile.providerId,
    username: profile.username,
    globalName: profile.globalName,
    avatar: profile.avatar,
    email,
    staffRole: role,
    capabilities: caps,
    createdAt: now,
    lastSeenAt: now,
    flagged: false,
  };
  await cacheUser(env, user);
  return user;
}

export async function upsertOAuthUser(env: Env, profile: AccountProfile): Promise<User> {
  const now = Date.now();
  const email = profile.email ? normalizeEmail(profile.email) : undefined;
  const existingIdentity = await env.DB.prepare(
    `SELECT user_id FROM auth_identities WHERE provider = ? AND provider_id = ? LIMIT 1`,
  )
    .bind(profile.provider, profile.providerId)
    .first<{ user_id: string }>();

  let userId = existingIdentity?.user_id;

  // Link an OAuth sign-in to an existing account when the verified email matches.
  if (!userId && email) {
    const byEmail = await env.DB.prepare(
      `SELECT user_id FROM auth_identities WHERE email = ? ORDER BY CASE provider WHEN 'password' THEN 0 ELSE 1 END LIMIT 1`,
    )
      .bind(email)
      .first<{ user_id: string }>();
    if (byEmail) userId = byEmail.user_id;
  }

  // Accounts created before auth_identities existed still live in users.
  if (!userId) {
    const legacy = await env.DB.prepare(
      `SELECT id FROM users WHERE platform = ? AND platform_id = ? LIMIT 1`,
    )
      .bind(profile.provider, profile.providerId)
      .first<{ id: string }>();
    if (legacy) userId = legacy.id;
  }

  if (userId) {
    const row = await rowById(env, userId);
    if (!row) throw new AuthError("Account no longer exists", 401);
    await env.DB.prepare(
      `UPDATE users SET username = COALESCE(NULLIF(?, ''), username), global_name = COALESCE(NULLIF(?, ''), global_name),
         avatar = COALESCE(NULLIF(?, ''), avatar), email = COALESCE(?, email), last_seen_at = ? WHERE id = ?`,
    )
      .bind(profile.username, profile.globalName, profile.avatar, email ?? null, now, userId)
      .run();
    if (!existingIdentity) {
      await env.DB.prepare(
        `INSERT INTO auth_identities (id, user_id, provider, provider_id, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(`ai_${crypto.randomUUID()}`, userId, profile.provider, profile.providerId, email ?? null, now, now)
        .run();
    }
    const fresh = await rowById(env, userId);
    const user = parseUser(fresh!);
    await cacheUser(env, user);
    return user;
  }

  const user = await createAccount(env, { ...profile, email });
  await env.DB.prepare(
    `INSERT INTO auth_identities (id, user_id, provider, provider_id, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(`ai_${crypto.randomUUID()}`, user.id, profile.provider, profile.providerId, email ?? null, now, now)
    .run();
  return user;
}

/** Legacy Discord entry point, kept so existing callers do not change. */
export async function upsertUser(env: Env, profile: DiscordProfile): Promise<User> {
  return upsertOAuthUser(env, {
    provider: "discord",
    providerId: profile.id,
    username: cleanUsername(profile.username),
    globalName: cleanUsername(profile.global_name ?? profile.username),
    avatar: profile.avatar ?? "",
    email: profile.email ?? undefined,
  });
}

// ===========================================================================
// Email + password accounts
// ===========================================================================

export async function findPasswordIdentity(env: Env, email: string): Promise<PasswordIdentity | null> {
  const row = await env.DB.prepare(
    `SELECT user_id, email, password_hash, password_salt, iterations
       FROM auth_identities WHERE provider = 'password' AND email = ? LIMIT 1`,
  )
    .bind(normalizeEmail(email))
    .first<Record<string, unknown>>();
  if (!row?.password_hash || !row?.password_salt) return null;
  return {
    userId: String(row.user_id),
    email: String(row.email),
    hash: String(row.password_hash),
    salt: String(row.password_salt),
    iterations: Number(row.iterations ?? PBKDF2_ITERATIONS),
  };
}

export async function registerWithPassword(env: Env, rawEmail: string, password: string, rawUsername: string): Promise<User> {
  const email = normalizeEmail(rawEmail);
  if (!isEmail(email)) throw new AuthError("Enter a valid email address", 400);
  const trimmedUsername = rawUsername.replace(/[\u0000-\u001f\u007f<>]/g, "").trim();
  if (trimmedUsername.length < 3) throw new AuthError("Choose a username of at least 3 characters", 400);
  const username = cleanUsername(rawUsername);
  if (await findPasswordIdentity(env, email)) throw new AuthError("An account with that email already exists", 409);

  const now = Date.now();
  const role: StaffRole = bootstrapOwner(env, email) ? "owner" : "player";
  const caps = capabilitiesFor(role);
  const id = `u_${crypto.randomUUID()}`;
  const { hash, salt, iterations } = await hashPassword(password);

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO users (id, platform, platform_id, username, global_name, avatar, email, staff_role, capabilities_json, created_at, last_seen_at)
       VALUES (?, 'password', ?, ?, ?, '', ?, ?, ?, ?, ?)`,
    ).bind(id, email, username, username, email, role, JSON.stringify(caps), now, now),
    env.DB.prepare(
      `INSERT INTO auth_identities (id, user_id, provider, provider_id, email, password_hash, password_salt, iterations, created_at, updated_at)
       VALUES (?, ?, 'password', ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(`ai_${crypto.randomUUID()}`, id, email, email, hash, salt, iterations, now, now),
  ]);

  const user: User = {
    id,
    platform: "password",
    platformId: email,
    username,
    globalName: username,
    avatar: "",
    email,
    staffRole: role,
    capabilities: caps,
    createdAt: now,
    lastSeenAt: now,
    flagged: false,
  };
  await cacheUser(env, user);
  return user;
}

export async function loginWithPassword(env: Env, rawEmail: string, password: string): Promise<User> {
  const email = normalizeEmail(rawEmail);
  if (!isEmail(email) || !password || password.length > PASSWORD_MAX_LENGTH) throw new AuthError("Email or password is incorrect", 401);
  const identity = await findPasswordIdentity(env, email);
  if (!identity) {
    // Keep the timing profile roughly constant for unknown accounts without
    // letting an over-long password trip validation and leak timing.
    const fakeSalt = new Uint8Array(16);
    crypto.getRandomValues(fakeSalt);
    await derivePassword(password.slice(0, PASSWORD_MAX_LENGTH), fakeSalt, PBKDF2_ITERATIONS);
    throw new AuthError("Email or password is incorrect", 401);
  }
  if (!(await verifyPassword(password, identity))) throw new AuthError("Email or password is incorrect", 401);
  const row = await rowById(env, identity.userId);
  if (!row) throw new AuthError("Email or password is incorrect", 401);
  await env.DB.prepare(`UPDATE users SET last_seen_at = ? WHERE id = ?`).bind(Date.now(), identity.userId).run();
  const user = parseUser(row);
  if (user.bannedUntil && user.bannedUntil > Date.now()) throw new AuthError(`Suspended: ${user.banReason ?? "contact staff"}`, 403);
  await cacheUser(env, user);
  return user;
}

export async function setCapabilities(env: Env, userId: string, role: StaffRole, extra: Capability[]): Promise<User> {
  const caps = capabilitiesFor(role, extra);
  await env.DB.prepare(`UPDATE users SET staff_role = ?, capabilities_json = ? WHERE id = ?`).bind(role, JSON.stringify(caps), userId).run();
  const row = await rowById(env, userId);
  const u = parseUser(row!);
  await cacheUser(env, u);
  return u;
}

// ===========================================================================
// Sessions
// ===========================================================================

export async function createSession(env: Env, user: User, ip?: string, userAgent?: string): Promise<{ token: string; expiresAt: number }> {
  const token = randomString(32);
  const hash = await sha256(token);
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_SECONDS * 1000;
  await env.DB.prepare(`INSERT INTO sessions (id, user_id, created_at, expires_at, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?)`)
    .bind(hash, user.id, now, expiresAt, ip ?? null, userAgent ?? null)
    .run();
  await env.KV.put(`session:${hash}`, JSON.stringify({ userId: user.id, expiresAt }), { expirationTtl: SESSION_TTL_SECONDS }).catch(() => undefined);
  return { token, expiresAt };
}

export async function resolveSession(env: Env, token: string): Promise<User | null> {
  if (!token) return null;
  const hash = await sha256(token);
  const cached = (await env.KV.get(`session:${hash}`, "json").catch(() => null)) as { userId: string; expiresAt: number } | null;
  const userRow = cached?.userId
    ? await env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(cached.userId).first<Record<string, unknown>>().catch(() => null)
    : null;
  if (!userRow) {
    const s = await env.DB.prepare(`SELECT user_id, expires_at FROM sessions WHERE id = ?`).bind(hash).first<{ user_id: string; expires_at: number }>().catch(() => null);
    if (!s || s.expires_at < Date.now()) return null;
    const r = await env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(s.user_id).first<Record<string, unknown>>();
    if (!r) return null;
    return parseUser(r);
  }
  const user = parseUser(userRow);
  if (user.bannedUntil && user.bannedUntil > Date.now()) return null;
  return user;
}

export async function destroySession(env: Env, token: string): Promise<void> {
  const hash = await sha256(token);
  await env.DB.prepare(`DELETE FROM sessions WHERE id = ?`).bind(hash).run();
  await env.KV.delete(`session:${hash}`).catch(() => undefined);
}

// ===========================================================================
// Moderation helpers
// ===========================================================================

export async function audit(
  env: Env,
  entry: { userId: string; username: string; action: string; target?: string; before?: unknown; after?: unknown; reason?: string; ip?: string },
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO audit_log (id, at, user_id, username, action, target, before_json, after_json, reason, ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    `a_${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
    Date.now(),
    entry.userId,
    entry.username,
    entry.action,
    entry.target ?? "",
    entry.before === undefined ? null : JSON.stringify(entry.before),
    entry.after === undefined ? null : JSON.stringify(entry.after),
    entry.reason ?? null,
    entry.ip ?? null,
  ).run();
}

export async function checkBan(env: Env, platformId: string): Promise<{ reason: string; until: number } | null> {
  const row = await env.DB.prepare(
    `SELECT reason, until FROM bans WHERE platform_id = ? AND revoked_at IS NULL AND (until IS NULL OR until > ?) ORDER BY issued_at DESC LIMIT 1`,
  )
    .bind(platformId, Date.now())
    .first<{ reason: string; until: number | null }>();
  if (!row) return null;
  return { reason: row.reason ?? "", until: row.until ?? Number.MAX_SAFE_INTEGER };
}

export async function checkLoginRate(env: Env, bucket: string): Promise<number> {
  const windowStart = Math.floor(Date.now() / 60_000);
  const row = await env.DB.prepare(`SELECT count FROM rate_limits WHERE bucket = ? AND window_start = ?`)
    .bind(bucket, windowStart)
    .first<{ count: number }>();
  return row?.count ?? 0;
}

export async function recordLoginAttempt(env: Env, bucket: string): Promise<void> {
  const windowStart = Math.floor(Date.now() / 60_000);
  await env.DB.prepare(
    `INSERT INTO rate_limits (bucket, window_start, count) VALUES (?, ?, 1)
     ON CONFLICT(bucket, window_start) DO UPDATE SET count = count + 1`,
  )
    .bind(bucket, windowStart)
    .run();
  await env.DB.prepare(`DELETE FROM rate_limits WHERE window_start < ?`).bind(windowStart - 60).run().catch(() => undefined);
}

export function sessionCookie(env: Env, token: string, maxAge: number): string {
  const secure = env.ENVIRONMENT === "production" ? " Secure;" : "";
  return `${env.SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function clearCookie(env: Env): string {
  return `${env.SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
