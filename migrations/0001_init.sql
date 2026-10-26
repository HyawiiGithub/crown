-- CROWN schema.
-- D1 holds everything that must survive a Durable Object restart, plus the
-- account system. Live world state lives in the Durable Object and is
-- checkpointed into `world_snapshots` on a timer.

-- ---------------------------------------------------------------------------
-- Accounts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id                TEXT PRIMARY KEY,
  platform          TEXT NOT NULL DEFAULT 'discord',
  platform_id       TEXT NOT NULL,
  username          TEXT NOT NULL,
  global_name       TEXT NOT NULL DEFAULT '',
  avatar            TEXT NOT NULL DEFAULT '',
  email             TEXT,
  staff_role        TEXT NOT NULL DEFAULT 'player',
  capabilities_json TEXT NOT NULL DEFAULT '[]',
  plays_country     TEXT,
  plays_character_id TEXT,
  plays_company_id  TEXT,
  leads_party_id    TEXT,
  created_at        INTEGER NOT NULL,
  last_seen_at      INTEGER NOT NULL,
  banned_until      INTEGER,
  ban_reason        TEXT,
  muted_until       INTEGER,
  staff_notes       TEXT,
  flagged           INTEGER NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_platform ON users(platform, platform_id);
CREATE INDEX IF NOT EXISTS idx_users_staff ON users(staff_role);

-- ---------------------------------------------------------------------------
-- Sessions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  ip         TEXT,
  user_agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);

-- ---------------------------------------------------------------------------
-- Worlds
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS worlds (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  scenario_id TEXT NOT NULL,
  owner_id    TEXT REFERENCES users(id),
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL,
  is_public   INTEGER NOT NULL DEFAULT 1,
  archived    INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_worlds_scenario ON worlds(scenario_id);
CREATE INDEX IF NOT EXISTS idx_worlds_updated ON worlds(updated_at DESC);

CREATE TABLE IF NOT EXISTS world_members (
  world_id          TEXT NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  user_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plays_country     TEXT,
  plays_character_id TEXT,
  plays_company_id  TEXT,
  joined_at         INTEGER NOT NULL,
  PRIMARY KEY (world_id, user_id)
);

-- Checkpoints written by the Durable Object.
CREATE TABLE IF NOT EXISTS world_snapshots (
  id         TEXT PRIMARY KEY,
  world_id   TEXT NOT NULL,
  at         INTEGER NOT NULL,
  sim_t      INTEGER NOT NULL,
  version    INTEGER NOT NULL,
  payload    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_snapshots_world ON world_snapshots(world_id, at DESC);

-- ---------------------------------------------------------------------------
-- Scenarios authored by developers at runtime. Seeded rows for the eight
-- built-in scenarios live in the same table, so the scenario picker reads one
-- source of truth and a dev can edit a built-in without a redeploy.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scenarios (
  id          TEXT PRIMARY KEY,
  year        INTEGER NOT NULL,
  name        TEXT NOT NULL,
  tagline     TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  theme_json  TEXT NOT NULL DEFAULT '{}',
  params_json TEXT NOT NULL DEFAULT '{}',
  overrides_json TEXT NOT NULL DEFAULT '{}',
  builtin     INTEGER NOT NULL DEFAULT 0,
  author_id   TEXT REFERENCES users(id),
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);

-- ---------------------------------------------------------------------------
-- Corporate registry: the durable record of companies a player founded and the
-- BOD / shareholder ledger that the in-world Company object is derived from.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS companies (
  id          TEXT PRIMARY KEY,
  world_id    TEXT NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  country     TEXT NOT NULL,
  sector      TEXT NOT NULL,
  founded_by  TEXT REFERENCES users(id),
  banned      INTEGER NOT NULL DEFAULT 0,
  ban_reason  TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_companies_world ON companies(world_id);

CREATE TABLE IF NOT EXISTS board_members (
  id         TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  character_id TEXT,
  user_id    TEXT REFERENCES users(id),
  seat       TEXT NOT NULL DEFAULT 'director',
  voting_weight REAL NOT NULL DEFAULT 1,
  appointed_at INTEGER NOT NULL,
  resigned_at  INTEGER
);
CREATE INDEX IF NOT EXISTS idx_board_company ON board_members(company_id);

CREATE TABLE IF NOT EXISTS shareholdings (
  id         TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  holder_kind TEXT NOT NULL,
  holder_id  TEXT,
  user_id    TEXT REFERENCES users(id),
  stake      REAL NOT NULL,
  acquired_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_holdings_company ON shareholdings(company_id);

-- ---------------------------------------------------------------------------
-- Moderation + audit. Every developer action lands here.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
  id         TEXT PRIMARY KEY,
  at         INTEGER NOT NULL,
  user_id    TEXT NOT NULL,
  username   TEXT NOT NULL,
  action     TEXT NOT NULL,
  target     TEXT NOT NULL DEFAULT '',
  before_json TEXT,
  after_json  TEXT,
  reason     TEXT,
  ip         TEXT
);
CREATE INDEX IF NOT EXISTS idx_audit_at ON audit_log(at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);

CREATE TABLE IF NOT EXISTS bans (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  platform_id TEXT NOT NULL,
  kind       TEXT NOT NULL,
  reason     TEXT NOT NULL DEFAULT '',
  until      INTEGER,
  issued_by  TEXT NOT NULL,
  issued_at  INTEGER NOT NULL,
  revoked_at INTEGER,
  revoked_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_bans_platform ON bans(platform_id, revoked_at);

CREATE TABLE IF NOT EXISTS chat_messages (
  id         TEXT PRIMARY KEY,
  world_id   TEXT NOT NULL,
  user_id    TEXT NOT NULL,
  username   TEXT NOT NULL,
  avatar     TEXT NOT NULL DEFAULT '',
  channel    TEXT NOT NULL DEFAULT 'global',
  country    TEXT,
  text       TEXT NOT NULL,
  at         INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_chat_world ON chat_messages(world_id, at DESC);

-- Rate limiting counters for the developer API surface.
CREATE TABLE IF NOT EXISTS rate_limits (
  bucket  TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count   INTEGER NOT NULL,
  PRIMARY KEY (bucket, window_start)
);