import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoNaturalEarth1, geoGraticule10, geoPath, type GeoPath, type GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { Country, Front, MapRegion, War } from "../../shared/types";
import { COUNTRY_BY_ISO3, TERRITORY_OWNER } from "../../data/countries";
import { frontOccupation } from "../../sim/occupation";
import { useStore } from "../store";
import { makeScale, sampleRamp, type ScaleId, type Theme } from "../theme";

/**
 * The world map.
 *
 * Natural Earth geometry is vendored in /geo/countries-50m.json, so there is no
 * tile server and no API key. Every polygon is painted by whoever controls it in
 * the current scenario (`control`), and sub-national historical territory such as
 * Alsace-Lorraine is drawn from `regions`, clipped to the modern polygons it sits
 * inside. A German Empire or a Soviet Union is simply many polygons with one owner.
 */

export type MapLayer = "political" | "gdp" | "gdpPc" | "growth" | "inflation" | "unemployment" | "debt" | "approval" | "ideology" | "bloc" | "war" | "relations";

interface MapProps {
  countries: Record<string, Country>;
  control: Record<string, string>;
  regions: MapRegion[];
  wars: War[];
  layer: MapLayer;
  selected?: string;
  player?: string;
  onSelect?: (id: string) => void;
  focus?: { iso3: string; relations?: Record<string, number> } | null;
  theme: Theme;
}

interface RawFeature {
  id?: string | number;
  properties?: Record<string, unknown>;
  geometry?: unknown;
}

interface Drawn {
  key: string;
  numeric: string;
  name: string;
  path: string;
  centroid: [number, number];
  area: number;
  /** Polity to use when `control` has no mapping for `key` (historical basemaps). */
  fallback: string;
  /** A fallback outline: it fills a gap, so it must not draw a modern border. */
  soft?: boolean;
  /** Every polygon's centroid in screen space, so a name can sit on the whole land. */
  parts: { x: number; y: number; area: number }[];
  /** The largest single landmass. */
  main: { x: number; y: number; w: number; h: number; area: number };
}

const WORLD_URL = "/geo/countries-50m.json";
let rawCache: RawFeature[] | null = null;

/** Scenarios whose map comes from the historical basemap instead of modern borders. */
const HISTORICAL_SCENARIOS = new Set(["1900", "1914", "1930"]);

/**
 * Where a polity's name belongs, when its largest polygon is not its heartland.
 * Without this the Ottoman Empire is labelled in the Arabian desert and the
 * British Empire in whichever colony happens to be biggest.
 */
const LABEL_ANCHORS: Record<string, [number, number]> = {
  GBR: [-0.13, 51.5], FRA: [2.35, 48.86], DEU: [13.4, 52.52], AUT: [16.37, 48.21],
  OTT: [33.0, 39.5], TUR: [32.86, 39.93], RUS: [30.3, 59.94], USS: [37.6, 55.75],
  ESP: [-3.7, 40.42], PRT: [-9.14, 38.72], NLD: [4.9, 52.37], BEL: [4.35, 50.85],
  ITA: [12.5, 41.9], DNK: [12.57, 55.68], SWE: [18.07, 59.33], NOR: [10.75, 59.91],
  USA: [-77.04, 38.9], CHN: [116.4, 39.9], JPN: [139.7, 35.7], RAJ: [77.2, 28.6],
  EGY: [31.2, 30.0], EGP: [31.2, 30.0], MAR: [-6.8, 34.0], ALG: [3.06, 36.75],
  IRN: [51.4, 35.7], SAU: [46.7, 24.7], ETH: [38.75, 9.0], SUD: [32.5, 15.6],
  AOF: [-17.45, 14.7], AEF: [15.3, -4.3], NIG: [7.5, 9.0], BWF: [-1.0, 7.0],
  GWA: [9.7, 4.05], GEA: [39.28, -6.8], EIS: [38.9, 15.3], PAF: [13.2, -8.8],
  BEA: [36.8, -1.3], RHO: [31.05, -17.8], CPC: [18.4, -33.9], ZAF: [28.2, -25.7],
  SAR: [28.2, -25.7], OFS: [26.2, -29.1], COD: [15.3, -4.3], MDG: [47.5, -18.9],
  IDC: [105.8, 21.0], DEI: [106.8, -6.2], KOR: [127.0, 37.5], THA: [100.5, 13.75],
};
const historicalCache = new Map<string, RawFeature[] | null>();

async function loadHistorical(id: string): Promise<RawFeature[] | null> {
  if (!HISTORICAL_SCENARIOS.has(id)) return null;
  if (historicalCache.has(id)) return historicalCache.get(id) ?? null;
  try {
    const res = await fetch(`/geo/historical-${id}.json`);
    if (!res.ok) throw new Error(String(res.status));
    const fc = (await res.json()) as { features?: RawFeature[] };
    const features = fc.features ?? [];
    historicalCache.set(id, features.length ? features : null);
    return features.length ? features : null;
  } catch {
    historicalCache.set(id, null);
    return null;
  }
}

async function loadFeatures(): Promise<RawFeature[]> {
  if (rawCache) return rawCache;
  const res = await fetch(WORLD_URL);
  if (!res.ok) throw new Error(`Map geometry unavailable (${res.status})`);
  const topo = (await res.json()) as Topology;
  const fc = feature(topo, topo.objects.countries as never) as unknown as { features: RawFeature[] };
  rawCache = fc.features;
  return rawCache;
}

/** Land keys used by `control`: ISO numeric where there is one, the feature name where there is not. */
function featureKey(f: RawFeature): string {
  const id = f.id === undefined || f.id === null || f.id === "" ? "" : String(f.id).padStart(3, "0");
  return id || String(f.properties?.name ?? "");
}

export function WorldMap({ countries, control, regions, wars, layer, selected, player, onSelect, focus, theme }: MapProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1000, h: 600 });
  const [raw, setRaw] = useState<RawFeature[] | null>(rawCache);
  const [historical, setHistorical] = useState<RawFeature[] | null>(null);
  const historicalActive = HISTORICAL_SCENARIOS.has(theme.id);
  const [failed, setFailed] = useState(false);
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const [hover, setHover] = useState<{ x: number; y: number; id: string; place: string } | null>(null);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number; moved: boolean } | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.max(320, r.width), h: Math.max(320, r.height) });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let alive = true;
    loadFeatures().then((f) => alive && setRaw(f)).catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    setHistorical(null);
    if (!historicalActive) return;
    loadHistorical(theme.id).then((f) => alive && setHistorical(f));
    return () => {
      alive = false;
    };
  }, [historicalActive, theme.id]);

  // ---- geometry, one projection for everything ----------------------------
  const projection = useMemo(() => geoNaturalEarth1().fitExtent([[6, 6], [size.w - 6, size.h - 6]], { type: "Sphere" } as never), [size.w, size.h]);
  const pathGen = useMemo<GeoPath>(() => geoPath(projection), [projection]);

  const drawn = useMemo<Drawn[]>(() => {
    const source = historical ?? raw;
    if (!source) return [];
    const historicalSource = historical !== null;
    const out: Drawn[] = [];
    for (const f of source) {
      const key = historicalSource ? String(f.properties?.h ?? "") : featureKey(f);
      if (!historicalSource && key === "010") continue;
      if (!key) continue;
      const d = pathGen(f as never);
      if (!d) continue;
      const poly = largestPolygon(f, pathGen);
      const shape = (poly ? { type: "Polygon", coordinates: poly } : f) as never;
      const [cx, cy] = pathGen.centroid(shape);
      const [[x0, y0], [x1, y1]] = pathGen.bounds(shape);
      const name = historicalSource ? String(f.properties?.n ?? key) : String(f.properties?.name ?? key);
      const fallback = historicalSource ? String(f.properties?.p ?? "") : "";
      const parts = polygonsOf(f)
        .map((coords) => {
          const shapePart = { type: "Polygon", coordinates: coords } as never;
          const [px, py] = pathGen.centroid(shapePart);
          return { x: px, y: py, area: pathGen.area(shapePart) };
        })
        .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y) && p.area > 0);
      out.push({ key, numeric: key, name, path: d, centroid: pathGen.centroid(f as never) as [number, number], area: pathGen.area(f as never), fallback, soft: historicalSource && Boolean((f.properties as Record<string, unknown> | undefined)?.f), parts, main: { x: cx, y: cy, w: x1 - x0, h: y1 - y0, area: pathGen.area(shape) } });
    }
    return out;
  }, [raw, historical, pathGen]);

  // The historical basemap is the only land layer, so anywhere the source draws
  // nothing used to show the paper through as a hole. Paint every modern land in
  // its scenario owner's colour underneath: the historical polygons still draw
  // their own borders on top, and a missing polygon can no longer leave a gap.
  const base = useMemo(() => {
    if (!historical || !raw) return [];
    return raw.map((f) => ({ key: featureKey(f), path: pathGen(f as never) ?? "" })).filter((b) => b.path);
  }, [historical, raw, pathGen]);

  const graticule = useMemo(() => pathGen(geoGraticule10()) ?? "", [pathGen]);
  const sphere = useMemo(() => pathGen({ type: "Sphere" } as never) ?? "", [pathGen]);

  const regionPaths = useMemo(
    () =>
      regions
        // A historical basemap carries its own borders, so only land handed over
        // by a peace deal is painted on top of it.
        .filter((r) => !historical || r.id.startsWith("ceded-"))
        .map((r) => {
        const pts = r.ring.map((p) => projection(p)).filter(Boolean) as [number, number][];
        return { ...r, d: `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L")}Z`, cx: pts.reduce((a, p) => a + p[0], 0) / pts.length, cy: pts.reduce((a, p) => a + p[1], 0) / pts.length };
      }),
    [regions, projection, historical],
  );

  // The hosts of a region are modern ISO3 codes; find their polygons to clip against.
  const hostPaths = useMemo(() => {
    const byIso = new Map<string, string[]>();
    for (const c of drawn) byIso.set(c.key, [...(byIso.get(c.key) ?? []), c.path]);
    return byIso;
  }, [drawn]);

  // ---- frontlines ---------------------------------------------------------
  // Sampled once per pair of states; the line then only slides along the axis.
  // The cache belongs to one projection: a resize must never reuse old coordinates.
  const frontCache = useMemo(() => new Map<string, FrontGeometry | null>(), [raw, projection]);

  const fronts = useMemo(() => {
    if (!raw) return [];
    const out: { key: string; hosts: string[]; area: string; line: string; holderName: string; territory: string; holder: string; share: number; ended: boolean }[] = [];
    for (const w of wars) {
      w.fronts.forEach((f, i) => {
        const o = frontOccupation(w, f, countries);
        if (!o || o.share < 0.004) return;
        const cacheKey = `${o.holder}>${o.territory}>${f.axis?.join(",") ?? ""}`;
        let geo = frontCache.get(cacheKey);
        if (geo === undefined) {
          geo = buildFrontGeometry(raw, control, o.territory, o.holder, f.axis, projection, pathGen);
          frontCache.set(cacheKey, geo);
        }
        if (!geo) return;
        const shape = frontShape(geo, o.share, cacheKey);
        frontRings.set(`${w.id}:${i}`, shape.points.map((p) => projection.invert?.(p)).filter(Boolean) as [number, number][]);
        out.push({ key: `${w.id}-${i}`.replace(/[^a-zA-Z0-9-]/g, "-"), hosts: geo.hosts, area: shape.area, line: shape.line, holderName: o.holderName, territory: o.territory, holder: o.holder, share: o.share, ended: Boolean(w.endedAt) });
      });
    }
    return out;
  }, [raw, wars, countries, control, projection, pathGen, frontCache]);

  // ---- layer colours ------------------------------------------------------
  const atWar = useMemo(() => {
    const s = new Set<string>();
    for (const w of wars) {
      if (w.endedAt) continue;
      for (const [b, allies] of Object.entries(w.belligerents)) {
        s.add(b);
        for (const a of allies) s.add(a);
      }
    }
    return s;
  }, [wars]);

  const scale = useMemo(() => {
    const rows = Object.values(countries)
      .filter((c) => !c.annexedBy)
      .map((c) => ({ gdp: c.economy.gdp, gdpPc: c.economy.gdpPerCapita, growth: c.economy.gdpGrowth, inflation: c.economy.monetary.inflation, unemployment: c.economy.labour.unemployment, debt: c.economy.fiscal.debtToGdp, approval: c.executive.approval, ideology: c.ideology, bloc: c.bloc }));
    return makeScale(layer as ScaleId, rows);
  }, [countries, layer]);

  const fills = useMemo(() => {
    const m = new Map<string, string>();
    for (const [id, c] of Object.entries(countries)) {
      if (layer === "war") m.set(id, atWar.has(id) ? "#b91c1c" : theme.unclaimed);
      else if (layer === "political") m.set(id, c.mapColor);
      else if (layer === "relations" && focus?.relations) {
        const rel = id === focus.iso3 ? undefined : focus.relations[id];
        m.set(id, rel === undefined ? theme.unclaimed : sampleRamp("magma", (rel + 100) / 200));
      } else {
        m.set(id, scale.fill({ gdp: c.economy.gdp, gdpPc: c.economy.gdpPerCapita, growth: c.economy.gdpGrowth, inflation: c.economy.monetary.inflation, unemployment: c.economy.labour.unemployment, debt: c.economy.fiscal.debtToGdp, approval: c.executive.approval, ideology: c.ideology, bloc: c.bloc }));
      }
    }
    return m;
  }, [countries, layer, scale, theme, atWar, focus]);

  /** Who owns a polygon now. Historical basemaps know their day-one polity, and
   *  follow `control` afterwards so annexations and peace deals recolour them. */
  /** Who held each modern land on day one. A historical polygon keeps its own
   *  polity until the land under it actually changes hands, so modern borders
   *  never leak into a 1900 map. */
  const dayOne = useMemo(() => {
    const claimed = new Map<string, string>();
    for (const c of Object.values(countries)) for (const land of c.lands ?? []) if (!claimed.has(land)) claimed.set(land, c.id);
    const owner = (land: string, depth = 0): string | undefined => {
      const direct = claimed.get(land);
      if (direct) return direct;
      if (depth > 3) return undefined;
      const next = TERRITORY_OWNER[land];
      return next ? owner(next, depth + 1) : undefined;
    };
    const m = new Map<string, string>();
    for (const iso3 of Object.keys(COUNTRY_BY_ISO3)) {
      const numeric = COUNTRY_BY_ISO3[iso3]?.numeric;
      const held = owner(iso3);
      if (numeric && held) m.set(numeric, held);
    }
    return m;
  }, [countries]);

  /** Who owns a polygon now. Historical basemaps already know their day-one
   *  polity, so `control` only takes over where the land has changed hands. */
  const ownerOf = useCallback(
    (f: Drawn): string => {
      const now = control[f.key];
      if (!historical) return now || f.key;
      const start = dayOne.get(f.key);
      if (!now || (start && now === start)) return f.fallback || now || "";
      return now;
    },
    [control, historical, dayOne],
  );

  // ---- labels: the centre of each polity's own land ------------------------
  const labels = useMemo(() => {
    const shapes = new Map<string, { x: number; y: number; area: number }[]>();
    for (const f of drawn) {
      const id = ownerOf(f);
      // Overseas territories do not carry the owner's name: no "Denmark" on Greenland.
      if (!id || (!historical && TERRITORY_OWNER[f.key])) continue;
      const list = shapes.get(id) ?? [];
      list.push(...f.parts);
      shapes.set(id, list);
    }
    return [...shapes.entries()]
      .map(([id, list]) => {
        // Centre the name on the nation's own land, weighted by area, rather than on
        // one polygon: an empire's largest polygon can be a colony or a desert. When
        // a capital is known, stay near it so overseas land cannot drag the name off
        // the country it belongs to.
        const anchor = LABEL_ANCHORS[id];
        const home = anchor ? projection(anchor) : null;
        // Only the home region counts. A wide radius let Greenland answer for
        // Copenhagen, so the name fell back to a possession instead of the capital.
        const radius = Math.max(28, size.w * 0.06);
        const near = home ? list.filter((p) => Math.hypot(p.x - home[0], p.y - home[1]) < radius) : [];
        const pool = near.length ? near : list;
        // With a capital, centre on the largest landmass near it. Averaging every
        // part would let a distant island pull the name off the country (Denmark
        // ended up labelled on Greenland).
        const total = pool.reduce((a, p) => a + p.area, 0) || 1;
        // Take the land nearest the capital, not the biggest one in its neighbourhood:
        // the Ottoman Empire's largest nearby province is the Levant, which put its
        // name in the Middle East instead of Anatolia. If the source draws no land
        // near the capital at all (Denmark's peninsula is missing from the 1900 file),
        // name it at the capital rather than on a distant possession.
        const dist = (p: { x: number; y: number }) => (home ? Math.hypot(p.x - home[0], p.y - home[1]) : 0);
        // Ignore specks: a small island can sit closer to the capital than the
        // mainland and pull the name offshore (the Ottomans landed on Cyprus).
        const biggest = near.reduce((a, p) => Math.max(a, p.area), 0);
        const major = near.filter((p) => p.area >= biggest * 0.2);
        const candidates = major.length ? major : near;
        const anchorPart = candidates.length ? candidates.reduce((a, p) => (dist(p) < dist(a) ? p : a), candidates[0]) : null;
        const x = anchorPart ? anchorPart.x : home ? home[0] : pool.reduce((a, p) => a + p.x * p.area, 0) / total;
        const y = anchorPart ? anchorPart.y : home ? home[1] : pool.reduce((a, p) => a + p.y * p.area, 0) / total;
        const spread = Math.sqrt(total);
        return { id, x, y, w: Math.min(180, spread * 1.7), h: Math.min(90, spread), area: total };
      })
      // Sovereign states get their names before their colonies do, so an empire
      // is never crowded off the map by "Anglo-Egyptian Sudan" sitting next to it.
      .sort((a, b) => {
        const depA = countries[a.id]?.overlord ? 1 : 0;
        const depB = countries[b.id]?.overlord ? 1 : 0;
        if (depA !== depB) return depA - depB;
        return b.area - a.area;
      });
  }, [drawn, ownerOf, historical, projection, countries, size.w]);

  // Fit each name inside its land at this zoom, biggest countries first, and never overlap.
  const placedLabels = useMemo(() => {
    const k = transform.k;
    const taken: { x0: number; y0: number; x1: number; y1: number }[] = [];
    const out: { id: string; name: string; x: number; y: number; font: number }[] = [];
    for (const l of labels) {
      const name = countries[l.id]?.name;
      if (!name) continue;
      const font = Math.min(13, (l.w * k * 0.92) / (name.length * 0.56), l.h * k * 0.7);
      if (font < 8) continue;
      const halfW = (font * name.length * 0.56) / 2 / k + 1 / k;
      const halfH = (font * 0.65) / k;
      // A crowded neighbourhood should not cost a country its name: try nudging up
      // and down at the first spot, then fall back to the largest landmass before
      // dropping the label entirely.
      const spots = [
        { x: l.x, y: l.y },
        { x: l.altX, y: l.altY },
      ];
      let placed = false;
      for (const spot of spots) {
        if (placed) break;
        for (const dy of [0, halfH * 2.6, -halfH * 2.6]) {
          const box = { x0: spot.x - halfW, y0: spot.y + dy - halfH, x1: spot.x + halfW, y1: spot.y + dy + halfH };
          if (taken.some((t) => box.x0 < t.x1 && box.x1 > t.x0 && box.y0 < t.y1 && box.y1 > t.y0)) continue;
          taken.push(box);
          out.push({ id: l.id, name, x: spot.x, y: spot.y + dy, font });
          placed = true;
          break;
        }
      }
    }
    return out;
  }, [labels, countries, transform.k]);

  // ---- interaction --------------------------------------------------------
  const applyZoom = useCallback((factor: number, cx: number, cy: number) => {
    setTransform((t) => {
      const k = Math.max(1, Math.min(40, t.k * factor));
      const up = k / t.k;
      return k === 1 ? { k: 1, x: 0, y: 0 } : { k, x: cx - (cx - t.x) * up, y: cy - (cy - t.y) * up };
    });
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      applyZoom(e.deltaY < 0 ? 1.2 : 1 / 1.2, e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [applyZoom]);

  const fingers = useRef(new Map<number, { x: number; y: number }>());
  const pinchGap = useRef(0);

  const drawingFor = useStore((s) => s.peaceDrawing);
  const [draft, setDraft] = useState<[number, number][]>([]);
  const mapPoint = (e: React.PointerEvent): [number, number] => {
    const rect = wrapRef.current!.getBoundingClientRect();
    return [(e.clientX - rect.left - transform.x) / transform.k, (e.clientY - rect.top - transform.y) / transform.k];
  };
  const finishDrawing = () => {
    const territory = useStore.getState().peaceDrawing;
    const pts = draft;
    setDraft([]);
    if (!territory) return;
    const store = useStore.getState();
    const share = raw && pts.length > 2 ? ringShare(raw, control, territory, pts, pathGen) : 0;
    if (share < 0.002) {
      store.toast("That outline doesn't cover their land. Try again.", "err");
      return;
    }
    const stride = Math.max(1, Math.floor(pts.length / 80));
    const ring = pts.filter((_, i) => i % stride === 0).map((p) => projection.invert?.(p)).filter(Boolean) as [number, number][];
    store.set({ peaceDrawing: null, peaceDrawn: { ring, share, territory } });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (drawingFor) {
      setDraft([mapPoint(e)]);
      return;
    }
    fingers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (fingers.current.size === 2) {
      const [a, b] = [...fingers.current.values()];
      pinchGap.current = Math.hypot(a.x - b.x, a.y - b.y);
      if (drag.current) drag.current.moved = true;
      return;
    }
    drag.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (drawingFor) {
      if (e.buttons !== 0 && draft.length) setDraft((d) => [...d, mapPoint(e)]);
      return;
    }
    if (fingers.current.has(e.pointerId)) fingers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (fingers.current.size >= 2) {
      const [a, b] = [...fingers.current.values()];
      const gap = Math.hypot(a.x - b.x, a.y - b.y);
      const rect = wrapRef.current?.getBoundingClientRect();
      if (rect && pinchGap.current > 0 && gap > 0) applyZoom(gap / pinchGap.current, (a.x + b.x) / 2 - rect.left, (a.y + b.y) / 2 - rect.top);
      pinchGap.current = gap;
      return;
    }
    if (!drag.current || e.buttons === 0) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 6) drag.current.moved = true;
    if (drag.current.moved) setTransform((t) => ({ ...t, x: drag.current!.tx + dx, y: drag.current!.ty + dy }));
  };
  const endDrag = (e: React.PointerEvent) => {
    if (drawingFor) {
      if (draft.length) finishDrawing();
      return;
    }
    fingers.current.delete(e.pointerId);
    if (fingers.current.size === 1) {
      // Carry on panning with the finger that stayed down, without a jump.
      const [rest] = [...fingers.current.values()];
      setTransform((t) => {
        drag.current = { x: rest.x, y: rest.y, tx: t.x, ty: t.y, moved: true };
        return t;
      });
      return;
    }
    window.setTimeout(() => {
      if (!fingers.current.size) drag.current = null;
    }, 0);
  };
  const pick = (id: string) => {
    if (!drag.current?.moved) onSelect?.(id);
  };
  const track = (e: React.MouseEvent, id: string, place: string) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (rect) setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top, id, place });
  };

  const hovered = hover ? countries[hover.id] : undefined;
  const strokeWidth = 0.5;

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0, touchAction: "none" }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag} onPointerLeave={() => setHover(null)}>
      <svg className="map" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
        <rect width={size.w} height={size.h} fill={theme.ocean} />
        <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
          <path d={sphere} className="map__sphere" />
          <path className="map__graticule" d={graticule} strokeWidth={0.4} />
          {historical &&
            base.map((b, i) => {
              const id = control[b.key];
              const c = id ? countries[id] : undefined;
              return <path key={`base-${b.key}-${i}`} d={b.path} fill={c ? fills.get(id) ?? theme.unclaimed : theme.unclaimed} stroke="none" style={{ pointerEvents: "none" }} />;
            })}
          {drawn.map((f, i) => {
            const id = ownerOf(f);
            const c = id ? countries[id] : undefined;
            if (!id || !c) return <path key={`${f.key}-${i}`} d={f.path} fill={theme.unclaimed} stroke={theme.stroke} strokeWidth={strokeWidth} opacity={0.5} />;
            return (
              <path
                key={`${f.key}-${i}`}
                className="map__country"
                d={f.path}
                fill={fills.get(id) ?? theme.unclaimed}
                stroke={f.soft ? "none" : theme.stroke}
                strokeWidth={strokeWidth}
                onMouseMove={(e) => track(e, id, f.name)}
                onMouseLeave={() => setHover(null)}
                onClick={() => pick(id)}
                style={{ cursor: "pointer" }}
              />
            );
          })}

          {regionPaths.length > 0 && (
            <>
              <defs>
                {regionPaths.map((r) => (
                  <clipPath id={`clip-${r.id}`} key={r.id}>
                    {r.hosts.map((iso) => {
                      const paths = hostPaths.get(numericOf(iso)) ?? [];
                      return paths.map((d, i) => <path key={`${iso}-${i}`} d={d} />);
                    })}
                  </clipPath>
                ))}
              </defs>
              {regionPaths.map((r) => {
                const c = countries[r.owner];
                if (!c) return null;
                return (
                  <path
                    key={r.id}
                    className="map__country"
                    d={r.d}
                    clipPath={`url(#clip-${r.id})`}
                    fill={fills.get(r.owner) ?? c.mapColor}
                    stroke={theme.stroke}
                    strokeWidth={strokeWidth}
                    onMouseMove={(e) => track(e, r.owner, r.name)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => pick(r.owner)}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
            </>
          )}

          <defs>
            {fronts.map((f) => <clipPath id={`front-${f.key}`} key={f.key}>{f.hosts.map((d, i) => <path key={i} d={d} />)}</clipPath>)}
          </defs>
          {fronts.map((f) => {
            const place = `${f.holderName} holds ${(f.share * 100).toFixed(1)}% of ${countries[f.territory]?.name ?? f.territory}`;
            return (
              <g key={f.key} clipPath={`url(#front-${f.key})`}>
                {(layer === "political" || layer === "war") && (
                  <path
                    d={f.area}
                    fill={countries[f.holder]?.mapColor ?? "#27272a"}
                    fillOpacity={0.86}
                    onMouseMove={(e) => track(e, f.territory, place)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => pick(countries[f.holder] ? f.holder : f.territory)}
                    style={{ cursor: "pointer" }}
                  />
                )}
                <path d={f.line} fill="none" stroke={f.ended ? "var(--ink-muted)" : "#ef4444"} strokeWidth={f.ended ? 1.2 : 1.8} strokeDasharray={f.ended ? "4 3" : undefined} vectorEffect="non-scaling-stroke" style={{ pointerEvents: "none" }} />
              </g>
            );
          })}

          {draft.length > 1 && <path d={`M${draft.map((p) => p.join(",")).join("L")}Z`} fill="#f59e0b" fillOpacity={0.35} stroke="#f59e0b" strokeWidth={2} vectorEffect="non-scaling-stroke" style={{ pointerEvents: "none" }} />}

          {/* Outlines for the player's country and the selection, every polygon they own. */}
          {drawn.map((f, i) => {
            const id = ownerOf(f);
            if (id !== selected && id !== player) return null;
            return <path key={`hl-${f.key}-${i}`} d={f.path} fill="none" stroke={id === selected ? "var(--ink)" : "var(--accent-2)"} strokeWidth={id === selected ? 1.5 : 1.1} vectorEffect="non-scaling-stroke" style={{ pointerEvents: "none" }} />;
          })}

          {!historical && regionPaths.filter((r) => r.owner === selected || r.owner === player).map((r) => (
            <path key={`hl-${r.id}`} d={r.d} clipPath={`url(#clip-${r.id})`} fill="none" stroke={r.owner === selected ? "var(--ink)" : "var(--accent-2)"} strokeWidth={r.owner === selected ? 1.5 : 1.1} vectorEffect="non-scaling-stroke" style={{ pointerEvents: "none" }} />
          ))}

          {placedLabels.map((l) => (
            <text key={l.id} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="central" fontSize={l.font / transform.k} className="map__label" style={{ pointerEvents: "none" }} stroke={theme.ocean} strokeWidth={2.4 / transform.k} paintOrder="stroke">
              {l.name}
            </text>
          ))}
        </g>
      </svg>

      {failed && <div className="map-overlay card" style={{ top: 12, bottom: "auto" }}>The map geometry could not be loaded. Reload the page.</div>}

      <div className="map-overlay">
        <MapLegend scale={scale} layer={layer} />
        {fronts.length > 0 && <div className="map-legend row" style={{ gap: 6, marginTop: 4 }}><span style={{ width: 16, height: 2, background: "#ef4444", display: "inline-block" }} /><span className="dim">Frontline</span></div>}
      </div>

      {drawingFor && (
        <div className="draw-banner card">
          <span className="grow">Draw around the land you want from {countries[drawingFor]?.name}. Zoom first with + and &minus;.</span>
          <button className="btn btn--sm" onPointerDown={(e) => e.stopPropagation()} onClick={() => useStore.getState().set({ peaceDrawing: null })}>Cancel</button>
        </div>
      )}

      <div className="map-controls" onPointerDown={(e) => e.stopPropagation()}>
        <button className="btn btn--sm" onClick={() => applyZoom(1.5, size.w / 2, size.h / 2)} title="Zoom in">+</button>
        <button className="btn btn--sm" onClick={() => applyZoom(1 / 1.5, size.w / 2, size.h / 2)} title="Zoom out">&minus;</button>
        <button className="btn btn--sm" onClick={() => setTransform({ k: 1, x: 0, y: 0 })} title="Reset view">Reset</button>
      </div>

      {hover && hovered && (
        <div className="map-tooltip" style={{ left: Math.min(hover.x + 14, size.w - 230), top: Math.min(hover.y + 14, size.h - 90) }}>
          <div className="row" style={{ gap: 6 }}>
            <strong>{hovered.name}</strong>
            {atWar.has(hovered.id) && <span className="badge badge--war">war</span>}
          </div>
          {hover.place !== hovered.name && <div className="dim" style={{ fontSize: 11 }}>{hover.place}{hovered.overlord ? ` · under ${countries[hovered.overlord]?.name ?? hovered.overlord}` : ""}</div>}
          <div className="dim mono" style={{ fontSize: 11, marginTop: 2 }}>GDP growth {(hovered.economy.gdpGrowth * 100).toFixed(1)}% · inflation {(hovered.economy.monetary.inflation * 100).toFixed(1)}%</div>
        </div>
      )}
    </div>
  );
}

/** Occupied land as lon/lat outlines, for peace deals to hand over. */
const frontRings = new Map<string, [number, number][]>();
export function frontRing(warId: string, frontIndex: number): [number, number][] | undefined {
  return frontRings.get(`${warId}:${frontIndex}`);
}

/** How much of a country's land a hand-drawn outline covers, 0..1. */
function ringShare(raw: RawFeature[], control: Record<string, string>, territory: string, outline: [number, number][], gen: GeoPath): number {
  sampler ??= document.createElement("canvas").getContext("2d");
  if (!sampler) return 0;
  const drawn = new Path2D(`M${outline.map((p) => p.join(",")).join("L")}Z`);
  let inside = 0;
  let total = 0;
  for (const f of raw) {
    if (control[featureKey(f)] !== territory) continue;
    const poly = largestPolygon(f, gen);
    if (!poly) continue;
    const shape = { type: "Polygon", coordinates: poly } as never;
    const land = new Path2D(gen(shape) ?? "");
    const [[x0, y0], [x1, y1]] = gen.bounds(shape);
    const step = Math.max((x1 - x0) / 60, (y1 - y0) / 60, 0.05);
    for (let x = x0; x <= x1; x += step) {
      for (let y = y0; y <= y1; y += step) {
        if (!sampler.isPointInPath(land, x, y)) continue;
        total++;
        if (sampler.isPointInPath(drawn, x, y)) inside++;
      }
    }
  }
  return total ? inside / total : 0;
}

interface FrontGeometry {
  hosts: string[];
  origin: [number, number];
  u: [number, number];
  v: [number, number];
  /** Sampled positions of the land along the axis, sorted, so a share maps to a distance. */
  depths: number[];
  half: number;
}

/** Every polygon of a feature, so a name can be centred on the land as a whole. */
function polygonsOf(f: RawFeature): number[][][][] {
  const g = f.geometry as { type?: string; coordinates?: unknown } | undefined;
  if (g?.type === "Polygon") return [g.coordinates as number[][][]];
  if (g?.type === "MultiPolygon") return g.coordinates as number[][][][];
  return [];
}

function largestPolygon(f: RawFeature, gen: GeoPath): number[][][] | null {
  const g = f.geometry as { type?: string; coordinates?: unknown } | undefined;
  if (g?.type === "Polygon") return g.coordinates as number[][][];
  if (g?.type !== "MultiPolygon") return null;
  let best: number[][][] | null = null;
  let area = -1;
  for (const c of g.coordinates as number[][][][]) {
    const a = gen.area({ type: "Polygon", coordinates: c } as never);
    if (a > area) {
      area = a;
      best = c;
    }
  }
  return best;
}

let sampler: CanvasRenderingContext2D | null = null;

function buildFrontGeometry(raw: RawFeature[], control: Record<string, string>, territory: string, holder: string, axis: Front["axis"], projection: GeoProjection, gen: GeoPath): FrontGeometry | null {
  const own = (id: string) => raw.filter((f) => control[featureKey(f)] === id).map((f) => largestPolygon(f, gen)).filter(Boolean) as number[][][][];
  const polys = own(territory);
  if (!polys.length) return null;
  const items = polys.map((coordinates) => {
    const o = { type: "Polygon", coordinates } as never;
    return { d: gen(o) ?? "", c: gen.centroid(o) as [number, number], a: gen.area(o), b: gen.bounds(o) };
  });
  const main = items.reduce((m, x) => (x.a > m.a ? x : m));
  // Stay on the contiguous mainland: skip far-off possessions.
  const b0 = main.b;
  const reach = Math.max(b0[1][0] - b0[0][0], b0[1][1] - b0[0][1]) * 1.6 + 30;
  const hosts = items.filter((x) => Math.hypot(x.c[0] - main.c[0], x.c[1] - main.c[1]) < reach);

  let origin: [number, number];
  let target: [number, number];
  const fromTo = axis ? [projection([axis[0], axis[1]]), projection([axis[2], axis[3]])] : null;
  if (fromTo?.[0] && fromTo[1]) {
    origin = fromTo[0];
    target = fromTo[1];
  } else {
    const theirs = own(holder).map((coordinates) => gen.centroid({ type: "Polygon", coordinates } as never) as [number, number]);
    target = main.c;
    if (theirs.length) origin = theirs.reduce((m, x) => (Math.hypot(x[0] - target[0], x[1] - target[1]) < Math.hypot(m[0] - target[0], m[1] - target[1]) ? x : m));
    else origin = [target[0] - 50, target[1] - 25];
  }
  const dx = target[0] - origin[0];
  const dy = target[1] - origin[1];
  const len = Math.hypot(dx, dy) || 1;
  const u: [number, number] = [dx / len, dy / len];
  const v: [number, number] = [-u[1], u[0]];

  sampler ??= document.createElement("canvas").getContext("2d");
  if (!sampler) return null;
  const depths: number[] = [];
  let half = 0;
  for (const h of hosts) {
    const p = new Path2D(h.d);
    const [[x0, y0], [x1, y1]] = h.b;
    const step = Math.max((x1 - x0) / 44, (y1 - y0) / 44, 0.05);
    for (let x = x0; x <= x1; x += step) {
      for (let y = y0; y <= y1; y += step) {
        if (!sampler.isPointInPath(p, x, y)) continue;
        depths.push((x - origin[0]) * u[0] + (y - origin[1]) * u[1]);
        half = Math.max(half, Math.abs((x - origin[0]) * v[0] + (y - origin[1]) * v[1]));
      }
    }
  }
  if (depths.length < 3) return null;
  depths.sort((a, b) => a - b);
  return { hosts: hosts.map((h) => h.d), origin, u, v, depths, half: half + 4 };
}

/** The held ground, and the line in front of it, for a given share of the land. */
function frontShape(g: FrontGeometry, share: number, seedText: string): { area: string; line: string; points: [number, number][] } {
  let seed = 0;
  for (let i = 0; i < seedText.length; i++) seed = (seed * 31 + seedText.charCodeAt(i)) % 1000;
  const n = g.depths.length;
  const depth = g.depths[Math.min(n - 1, Math.floor(clampNum(share, 0, 1) * n))];
  const spread = g.depths[n - 1] - g.depths[0];
  const pts: [number, number][] = [];
  const steps = 30;
  for (let i = 0; i <= steps; i++) {
    const s = -g.half + (i / steps) * 2 * g.half;
    const phase = s / Math.max(1, g.half);
    const jag = spread * 0.035 * (Math.sin(phase * 4.3 + seed) + 0.6 * Math.sin(phase * 11.7 + seed * 2) + 0.3 * Math.sin(phase * 23 + seed * 3));
    const t = depth + jag;
    pts.push([g.origin[0] + g.u[0] * t + g.v[0] * s, g.origin[1] + g.u[1] * t + g.v[1] * s]);
  }
  const line = `M${pts.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join("L")}`;
  const back = g.depths[0] - spread * 0.1 - 6;
  const end = pts[pts.length - 1];
  const start = pts[0];
  const corner = (p: [number, number]) => [p[0] + g.u[0] * (back - depth), p[1] + g.u[1] * (back - depth)].map((x) => x.toFixed(2)).join(",");
  const toPoint = (p: [number, number]): [number, number] => [p[0] + g.u[0] * (back - depth), p[1] + g.u[1] * (back - depth)];
  return { line, area: `${line}L${corner(end)}L${corner(start)}Z`, points: [...pts, toPoint(end), toPoint(start)] };
}

function clampNum(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function numericOf(iso: string): string {
  return COUNTRY_BY_ISO3[iso]?.numeric ?? iso;
}

function MapLegend({ scale, layer }: { scale: ReturnType<typeof makeScale>; layer: string }) {
  if (layer === "political") return null;
  if (scale.kind === "categorical" && scale.categories?.length) {
    return (
      <div className="map-legend">
        <div className="row row--wrap" style={{ gap: 8 }}>
          {scale.categories.slice(0, 9).map((c) => (
            <span key={c.id} className="row" style={{ gap: 4 }}>
              <span style={{ width: 9, height: 9, background: c.color, borderRadius: 2 }} />
              <span className="dim">{c.label}</span>
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (!scale.legend.length) return null;
  return (
    <div className="map-legend">
      <div className="map-legend__scale">
        <span className="mono dim">{scale.legend[0].value}</span>
        <div className="map-legend__ramp" style={{ background: `linear-gradient(90deg, ${scale.legend.map((s) => s.color).join(", ")})` }} />
        <span className="mono dim">{scale.legend[scale.legend.length - 1].value}</span>
      </div>
    </div>
  );
}
