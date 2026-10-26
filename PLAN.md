# CROWN: build plan

Stack is fixed by the brief: React 19 + Vite, Hono on Cloudflare Workers, Durable Objects for the live world, D1 for accounts and durable game data, KV for session/portrait caches, Cloudflare Workers AI for portraits, custom domain `crowngamestudios.com`.

## Architecture

```
Browser (React/Vite SPA)
  │  same-origin fetch + WebSocket
  ▼
Cloudflare Worker (Hono)
  ├─ /api/auth/*        Google OAuth, email/password, Discord (optional), sessions
  ├─ /api/worlds/*      world CRUD, actions, dev ops, live WebSocket
  ├─ /api/portrait      Workers AI portrait + KV cache
  └─ static assets      ./dist SPA fallback
        │
        ▼
Durable Object "SimObject" (one per world)     D1 "crown"
  ├─ world state in memory, 2s tick            ├─ users / auth_identities / sessions
  ├─ politics + economy + war engine           ├─ worlds / world_members / snapshots
  ├─ WebSocket fan-out                         ├─ companies / board / shareholdings
  └─ 60s checkpoint to D1                      ├─ scenarios / audit / bans / chat
                                               └─ rate_limits
```

## Data model (new in migration 0002)

| Table | Columns | Access |
|---|---|---|
| `auth_identities` | id, user_id, provider (`google`/`password`/`discord`), provider_id, email, password_hash, password_salt, iterations, created_at, updated_at | Worker only; unique (provider, provider_id) |
| `users` (existing) | one row per account; `platform` becomes the primary provider; `staff_role`, capabilities, play bindings | Worker read/write; never returned with secrets |
| `sessions` (existing) | hashed token, user, expiry | Worker only |
| `rate_limits` (existing) | bucket + window_start + count | Worker only |
| `world_members` (existing) | world/user/character binding | Worker writes; world members read |

Game state remains in the Durable Object checkpointed to `world_snapshots`. Player politicians live in `world.characters` with `userId`, plus `funds`/`influence` and office fields.

## Permissions

- **Player:** play worlds, create one politician per world, join/found a party, run and campaign, cast legislative votes for their own seat, trade, invest, found companies, chat.
- **Moderator:** player + warn/mute.
- **Developer:** + world/scenario editing, rules, console, audit read.
- **Owner:** all capabilities. First account whose email is in `BOOTSTRAP_ADMIN_EMAILS` becomes owner.
- Ownership checks in the Durable Object: only the owning user may campaign for or act as their character; only the head of government may appoint ministers.

## API additions

| Route | Purpose |
|---|---|
| `GET /api/auth/config` | which providers are configured |
| `POST /api/auth/register` | email + password + username; creates account and session |
| `POST /api/auth/login` | email + password; rate limited per IP/email |
| `GET /api/auth/google` / `/callback` | Google OAuth 2.0 code flow with signed state |
| `GET /api/portrait` | cached synthetic portrait (name, role, country, year) |
| `POST /api/worlds/:id/action` | new actions: `create-politician`, `run-for-office`, `campaign`, `join-party`, `found-party`, `appoint-minister` |

## Screens

1. Sign-in (Google, email/password, register, optional Discord).
2. Lobby (scenario worlds + live worlds, flags and portraits).
3. World shell: map, wire, rankings, wars, chat; country economy/state/legislature/military/trade tabs.
4. **Politics tab (new):** your politician, party, funds, upcoming elections, run buttons, campaign actions, live support bars and results.
5. Developer control room (existing).

## Tasks (build order)

- [ ] **1. Migration 0002** — auth identities + indexes. Verify: `wrangler d1 migrations apply crown --local`.
- [ ] **2. Password + account repository** — PBKDF2-SHA256, salt, constant-time verify, email normalize, user upsert, owner bootstrap. Verify: unit tests.
- [ ] **3. Google OAuth** — authorize/callback, state, token exchange, userinfo, error paths. Verify: unit tests with mocked fetch + local callback simulation.
- [ ] **4. Auth routes + rate limits** — config/register/login/logout/me, login throttle per IP+email, cookies. Verify: local HTTP requests.
- [ ] **5. Login UI** — tabs, validation, errors, Google button, provider-aware gate. Verify: local browser.
- [ ] **6. Politics types** — candidate/office fields on Election/Character; no `any`. Verify: typecheck.
- [ ] **7. Politician lifecycle** — create, join/found party, one per user per world, party treasury and funds. Verify: unit test + action smoke.
- [ ] **8. Elections** — seed candidate fields, executive and party-leadership elections, run-for-office for every chamber/office. Verify: deterministic election test.
- [ ] **9. Campaigning + resolution** — rally/ads/ground/debate with cooldown and spend; support affects seats and executive offices; winners seated and appointed. Verify: simulation test across a full election.
- [ ] **10. Politics UI** — country politics tab, candidate cards, countdown, campaign buttons, results, own-office badge. Verify: browser click-through.
- [ ] **11. Realistic visuals** — flag component, AI portrait endpoint with KV cache, portrait fallbacks, leader/candidate portraits, lobby polish. Verify: image responses + visual check.
- [ ] **12. Patch/snapshot plumbing** — political NPC characters and elections reach clients; avoid oversized patches. Verify: WebSocket smoke.
- [ ] **13. Dev/deploy config** — production vars, custom domain route, AI binding, wrangler scripts, docs. Verify: `wrangler deploy --dry-run`.
- [ ] **14. Security review** — auth sessions, CSRF, OAuth state, rate limits, action authorization, XSS in chat/names, portrait prompt abuse, secrets. Fix findings.
- [ ] **15. Tests** — Vitest unit suite (auth crypto, election maths, permissions) + build + local smoke. Verify: `npm test`, `npm run typecheck`, `npm run build`.
- [ ] **16. Ship** — create D1/KV, apply migrations, set secrets, deploy, attach `crowngamestudios.com`, verify with browser on production. Verify: health, login, world, portrait, election.
