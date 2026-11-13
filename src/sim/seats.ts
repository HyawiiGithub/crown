import type { World } from "../shared/types";

/**
 * Every country a human holds in this world.
 *
 * Singleplayer writes the one country being played to `playerCountry`. Online
 * play keeps a country per member in `seats` instead and leaves `playerCountry`
 * unset, so the engine asks these helpers rather than comparing against
 * `playerCountry`: a seated country is run by its member, not by the AI that
 * runs everyone else.
 */
export function playerCountries(world: World): string[] {
  const held = new Set<string>();
  if (world.playerCountry) held.add(world.playerCountry);
  for (const iso of Object.values(world.seats ?? {})) if (iso) held.add(iso);
  return [...held];
}

export function isPlayerCountry(world: World, country: string): boolean {
  if (world.playerCountry === country) return true;
  const seats = world.seats;
  if (!seats) return false;
  for (const iso of Object.values(seats)) if (iso === country) return true;
  return false;
}
