import type { Country, Front } from "../shared/types";

export type Terrain = Front["terrain"];

/** Ground a country fights on: its own geography, not a guess made at the border. */
const TABLE: Record<string, Terrain> = {
  DEU: "plains", FRA: "plains", POL: "plains", RUS: "forest", UKR: "plains", BLR: "forest",
  GBR: "plains", ESP: "mountain", ITA: "mountain", CHE: "mountain", AUT: "mountain",
  NOR: "forest", SWE: "forest", FIN: "forest", CAN: "forest", USA: "plains", MEX: "desert",
  BRA: "forest", ARG: "plains", CHL: "mountain", PER: "mountain", COL: "forest",
  CHN: "plains", JPN: "mountain", IND: "plains", PAK: "desert", IRN: "desert",
  IRQ: "desert", SAU: "desert", EGY: "desert", LBY: "desert", DZA: "desert",
  MAR: "desert", TUR: "mountain", GRC: "mountain", BGR: "plains", ROU: "plains",
  HUN: "plains", CZE: "plains", NLD: "plains", BEL: "plains", DNK: "plains",
  ETH: "mountain", KEN: "plains", NGA: "forest", ZAF: "plains", AUS: "desert",
  IDN: "forest", VNM: "forest", THA: "forest", KOR: "mountain", PRK: "mountain",
};

export function terrainOf(c: Country): Terrain {
  const known = TABLE[c.id];
  if (known) return known;
  const lat = Math.abs(c.lat ?? 30);
  if (lat > 55) return "forest";
  if (lat < 24) return "desert";
  return "plains";
}
