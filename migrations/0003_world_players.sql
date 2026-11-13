-- ---------------------------------------------------------------------------
-- How many players a world seats is a property of that world, not a constant
-- in the join route. Existing worlds keep the old limit of eight.
-- ---------------------------------------------------------------------------
ALTER TABLE worlds ADD COLUMN max_players INTEGER NOT NULL DEFAULT 8;

-- A member holds at most one nation, and a nation is held by one member. Clear
-- any duplicates left from the days when joining recorded no seat, so the index
-- below can be created on a populated database.
UPDATE world_members
   SET plays_country = NULL
 WHERE plays_country IS NOT NULL
   AND rowid NOT IN (
     SELECT MIN(rowid) FROM world_members
      WHERE plays_country IS NOT NULL
      GROUP BY world_id, plays_country
   );

CREATE UNIQUE INDEX IF NOT EXISTS idx_members_country
  ON world_members(world_id, plays_country)
  WHERE plays_country IS NOT NULL;
