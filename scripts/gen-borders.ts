import { readFileSync, writeFileSync } from "node:fs";
import { neighbors } from "topojson-client";
import { COUNTRY_BY_NUMERIC, NAMED_FEATURES } from "../src/data/countries";

const R = "./";
const topo = JSON.parse(readFileSync(R + "public/geo/countries-50m.json", "utf8"));
const geoms = topo.objects.countries.geometries as { id?: string | number; properties?: { name?: string } }[];
const iso = (g: (typeof geoms)[number]) => {
  const id = g.id === undefined || g.id === null || g.id === "" ? "" : String(g.id).padStart(3, "0");
  return id ? COUNTRY_BY_NUMERIC[id]?.iso3 : NAMED_FEATURES[g.properties?.name ?? ""];
};
const adj = neighbors(geoms as never);
const map = new Map<string, Set<string>>();
geoms.forEach((g, i) => {
  const a = iso(g);
  if (!a) return;
  for (const j of adj[i]) {
    const b = iso(geoms[j]);
    if (!b || b === a) continue;
    if (!map.has(a)) map.set(a, new Set());
    map.get(a)!.add(b);
  }
});
const lines = [...map.entries()].sort((x, y) => x[0].localeCompare(y[0])).map(([k, v]) => `${k}:${[...v].sort().join(",")}`);
writeFileSync(R + "src/data/borders.ts", `/** Land borders between modern territories, generated from the map geometry. */\nconst RAW = \`\n${lines.join("\n")}\n\`;\n\nexport const LAND_BORDERS: Record<string, Set<string>> = Object.fromEntries(\n  RAW.trim().split("\\n").map((line) => {\n    const [k, v] = line.split(":");\n    return [k, new Set(v.split(","))];\n  }),\n);\n`);
console.log(lines.length, "territories;", "RUS:", [...(map.get("RUS") ?? [])].join(","), "| GBR:", [...(map.get("GBR") ?? [])].join(","), "| CUB:", [...(map.get("CUB") ?? [])].join(","));
