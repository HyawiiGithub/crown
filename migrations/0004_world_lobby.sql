-- A world created as a lobby holds its clock until the host starts it.
-- starts_at is the epoch millisecond the countdown ends; lobby marks a world
-- that was created to be filled by players first. Worlds created before this
-- migration have lobby = 0 and keep running as they did.
ALTER TABLE worlds ADD COLUMN starts_at INTEGER;
ALTER TABLE worlds ADD COLUMN lobby INTEGER NOT NULL DEFAULT 0;
