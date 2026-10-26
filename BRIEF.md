# CROWN: brief

**What it is:** A persistent, real-time world political and economic simulation where every country is playable and every office is contestable.
**For:** Players who want to build a political career from citizen to head of government, and developers who want to run and tune a living world.
**Success:** A new player signs in with Google or email, founds a politician, wins a seat, and sees the economy, map and world wire react to their choices in real time.

## Scope (v1)

- **Screens:** sign-in, lobby (8 scenario worlds), world map, country/economy/markets/wars panels, elections and campaign screen, live chat and world wire, developer control room.
- **Core features**
  - Google OAuth 2.0 and email + password accounts on Cloudflare D1, server-side sessions.
  - Create a politician in any country; join or found a party.
  - Run for any chamber seat, head of state, head of government, or party leadership; campaign with rallies, ads, ground game and debates.
  - Elections resolve live on the simulation clock; winners take real offices and seats.
  - Full economic simulation already in the engine: GDP, inflation, unemployment, debt, trade, markets, companies, banks, commodities, war and sanctions.
  - Realistic presentation: country flags, AI-generated official portraits for leaders and candidates, live map layers, scenario-specific art direction.
  - Persistent Durable Object world ticking every 2 seconds, checkpointed to D1; shared live chat and world events.
  - Staff roles and a developer control room with audit logging.
- **Not in v1:** payments, mobile apps, email verification/delivery, real-money markets, user-uploaded images, subnational offices (governor/mayor), voice.

## Design

- Existing CROWN direction: dark, editorial, data-dense, restrained. Eight scenario themes (1900 engraved ledger through 2026 clinical dashboard).
- New: official-portrait photography for political characters and real flags; no cartoon avatars in political contexts. Fallback is a monogram when an image is unavailable.
- Desktop-first responsive web; WCAG 2.2 AA targets on contrast, focus and keyboard use.

## Stack

- **Framework:** React 19 + Vite (already built); Hono API on Cloudflare Workers.
- **Styling:** plain modern CSS with scenario CSS custom properties (already built).
- **Components:** hand-built primitives (no component library) to keep the existing visual language.
- **Backend:** Cloudflare Workers + Durable Objects (live world) + D1 (accounts, worlds, snapshots, audit) + KV (session/portrait cache).
- **Auth:** custom in-Worker auth: Google OAuth 2.0 authorization code flow, PBKDF2-SHA256 email/password, HttpOnly session cookies. Chosen over Better Auth to keep the existing D1 schema and Worker routing.
- **Images:** Cloudflare Workers AI (FLUX) portraits, cached in KV, with deterministic fallbacks; flagcdn for flags.
- **Hosting:** Cloudflare Workers with static assets, custom domain `crowngamestudios.com`.
- **Billing:** none.

## Content and integrations

- Eight built-in scenarios already in the repo, with historical borders, parties, companies and wars.
- Google Cloud OAuth client (web) for sign-in.
- Optional Discord OAuth remains available but is no longer required.

## Constraints and risks

- The domain's nameservers must already point at Cloudflare for a Workers custom domain to attach.
- Google OAuth requires a client ID/secret the owner creates; the site must still work with email/password if Google is absent.
- AI portrait generation has cold-start latency; cache and graceful fallbacks are required.
- Production publishing and custom-domain attachment require the owner's Cloudflare account (already authenticated in this workspace).

## Assumptions (please check)

- The game is fictional; generated portraits are synthetic and not real people.
- Email/password launches without email verification; verification can be added once an email sender is configured.
- Players may hold one politician per world; one account can play many worlds.
- The existing simulation/economy code is retained and extended, not replaced.
