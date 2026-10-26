-- CROWN: multi-provider accounts.
-- `users` stays the account record; an account may have one or more identities
-- (Google, email/password, Discord). Password material lives only here and is
-- never selected into the public user shape.

CREATE TABLE IF NOT EXISTS auth_identities (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider      TEXT NOT NULL,
  provider_id   TEXT NOT NULL,
  email         TEXT,
  password_hash TEXT,
  password_salt TEXT,
  iterations    INTEGER,
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_auth_identity ON auth_identities(provider, provider_id);
CREATE INDEX IF NOT EXISTS idx_auth_user ON auth_identities(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_email ON auth_identities(email);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user_expiry ON sessions(user_id, expires_at);
