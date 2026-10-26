import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoNaturalEarth1, geoGraticule10, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { Country, War } from "../../shared/types";
import { COUNTRY_BY_NUMERIC } from "../../data/countries";
import { makeScale, sampleRamp, type ScaleId, type Theme } from "../theme";

/**
 * The world map.
 *
 * Entirely offline: Natural Earth country geometry is vendored into
 * /geo/countries-50m.json at build time and joined to the simulation by ISO
 * 3166-1 numeric code. No tile server, no external request, no API key.
 *
 * Zoom and pan are implemented directly on the projection transform rather than
 * with a library, because a full map library would be several times the size of
 * this entire application and we only need two gestures.
 */

export type MapLayer = "political" | "gdp" | "gdpPc" | "growth" | "inflation" | "unemployment" | "debt" | "approval" | "ideology" | "bloc" | "war" | "relations";

interface MapProps {
  countries: Record<string, Country>;
  wars: War[];
  layer: MapLayer;
  selected?: string;
  onSelect?: (iso3: string) => void;
  focus?: { iso3: string; relations?: Record<string, number> } | null;
  theme: Theme;
  height?: number;
}

interface Geometry {
  id: string;
  name: string;
  path: string;
  centroid: [number, number];
  /** Simple point-in-polygon test used to decide which side of a front a capital is on. */
  contains?: (lon: number, lat: number) => boolean;
  rings: number[][][][];
}

const WORLD_URL = "/geo/countries-50m.json";

let cachedWorld: { features: Geometry[]; graticule: string } | null = null;

async function loadWorld(width: number, height: number): Promise<{ features: Geometry[]; graticule: string }> {
  if (cachedWorld) return cachedWorld;
  const res = await fetch(WORLD_URL);
  if (!res.ok) throw new Error(`Map geometry unavailable (${res.status})`);
  const topo = (await res.json()) as Topology;
  const collection = topo.objects.countries as unknown as Parameters<typeof feature>[1];
  const fc = feature(topo, collection) as unknown as { type: string; features: { id?: string | number; properties?: Record<string, unknown>; geometry?: { type?: string; coordinates?: unknown } }[] };
  const projection = geoNaturalEarth1().fitExtent([[6, 6], [width - 6, height - 6]], fc as never);
  const path = geoPath(projection);

  const features: Geometry[] = [];
  for (const f of fc.features) {
    const id = String(f.id ?? "").padStart(3, "0");
    const d = path(f as never);
    if (!d) continue;
    const centroid = path.centroid(f as never);
    features.push({
      id,
      name: (f.properties?.name as string) ?? id,
      path: d,
      centroid: centroid[0] > -180 ? [centroid[0], centroid[1]] : [0, 0],
      rings: geometryRings(f),
    });
  }

  const graticule = path(geoGraticule10()) ?? "";
  cachedWorld = { features, graticule };
  return cachedWorld;
}

/** Pull polygon rings out of a GeoJSON geometry for cheap containment tests. */
function geometryRings(f: { geometry?: { type?: string; coordinates?: unknown } }): number[][][][] {
  const g = f.geometry;
  if (!g) return [];
  if (g.type === "Polygon") return [g.coordinates as number[][][]];
  if (g.type === "MultiPolygon") return g.coordinates as number[][][][];
  return [];
}

export function WorldMap({ countries, wars, layer, selected, onSelect, focus, theme, height }: MapProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1000, h: height ?? 600 });
  const [world, setWorld] = useState<{ features: Geometry[]; graticule: string } | null>(cachedWorld);
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const [hover, setHover] = useState<{ x: number; y: number; iso3: string } | null>(null);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const pinch = useRef<Map<number, { x: number; y: number }>>(new Map());

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.max(320, r.width), h: height ?? Math.max(360, r.height) });
    });
    ro.observe(el);
    const r = el.getBoundingClientRect();
    setSize({ w: Math.max(320, r.width), h: height ?? Math.max(360, r.height) });
    return () => ro.disconnect();
  }, [height]);

  useEffect(() => {
    let alive = true;
    loadWorld(size.w, size.h)
      .then((w) => {
        if (alive) setWorld(w);
      })
      .catch(() => setWorld(null));
    return () => {
      alive = false;
    };
  }, [size.w, size.h]);

  // ---- joins -------------------------------------------------------------

  /** ISO numeric -> country id, for geometry we own. */
  const numericToIso = useMemo(() => {
    const m = new Map<string, string>();
    for (const [iso3, c] of Object.entries(countries)) m.set(c.isoNumeric, iso3);
    return m;
  }, [countries]);

  const atWar = useMemo(() => {
    const s = new Set<string>();
    for (const w of wars) {
      if (w.endedAt) continue;
      for (const b of Object.keys(w.belligerents)) s.add(b);
    }
    return s;
  }, [wars]);

  const scale = useMemo(() => {
    const rows = Object.values(countries)
      .filter((c) => !c.annexedBy && !c.overlord)
      .map((c) => ({
        gdp: c.economy.gdp,
        gdpPc: c.economy.gdpPerCapita,
        growth: c.economy.gdpGrowth,
        inflation: c.economy.monetary.inflation,
        unemployment: c.economy.labour.unemployment,
        debt: c.economy.fiscal.debtToGdp,
        approval: c.executive.approval,
        ideology: c.ideology,
        bloc: c.bloc,
      }));
    return makeScale(layer as ScaleId, rows);
  }, [countries, layer]);

  // ---- interaction -------------------------------------------------------

  const applyZoom = useCallback((factor: number, cx: number, cy: number) => {
    setTransform((t) => {
      const k = Math.max(1, Math.min(24, t.k * factor));
      const scaleUp = k / t.k;
      return { k, x: cx - (cx - t.x) * scaleUp, y: cy - (cy - t.y) * scaleUp };
    });
  }, []);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      applyZoom(e.deltaY < 0 ? 1.18 : 1 / 1.18, e.clientX - rect.left, e.clientY - rect.top);
    },
    [applyZoom],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    if (pinch.current.size > 0) {
      pinch.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      return;
    }
    drag.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (pinch.current.has(e.pointerId)) {
      pinch.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const pts = [...pinch.current.values()];
      if (pts.length === 2) {
        const rect = wrapRef.current?.getBoundingClientRect();
        if (!rect) return;
        const mid = { x: (pts[0].x + pts[1].x) / 2 - rect.left, y: (pts[0].y + pts[1].y) / 2 - rect.top };
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (dist > 0) applyZoom(dist / 120, mid.x, mid.y);
      }
      return;
    }
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    setTransform((t) => ({ ...t, x: drag.current!.tx + dx, y: drag.current!.ty + dy }));
  };

  const endPointer = (e: React.PointerEvent) => {
    drag.current = null;
    pinch.current.delete(e.pointerId);
    if (pinch.current.size === 0) pinch.current.clear();
  };

  const resetView = () => setTransform({ k: 1, x: 0, y: 0 });

  /** Fly to a country by zooming about its centroid. */
  const focusOn = useCallback(
    (iso3: string) => {
      if (!world) return;
      const iso = countries[iso3];
      if (!iso) return;
      const g = world.features.find((f) => f.id === iso.isoNumeric);
      if (!g) return;
      const k = 5;
      setTransform({ k, x: size.w / 2 - g.centroid[0] * k, y: size.h / 2 - g.centroid[1] * k });
    },
    [world, countries, size],
  );

  useEffect(() => {
    if (focus?.iso3) focusOn(focus.iso3);
  }, [focus?.iso3, focusOn]);

  const hovered = hover ? countries[hover.iso3] : undefined;

  // ---- render ------------------------------------------------------------

  const projectionForFocus = useMemo(() => (world ? geoNaturalEarth1().fitExtent([[6, 6], [size.w - 6, size.h - 6]], { type: "Sphere" } as never) : null), [world, size.w, size.h]);
  const pathGen = useMemo(() => (projectionForFocus ? geoPath(projectionForFocus) : null), [projectionForFocus]);

  const graticulePath = useMemo(() => {
    if (!pathGen) return "";
    return pathGen(geoGraticule10()) ?? "";
  }, [pathGen]);

  const fills = useMemo(() => {
    const m = new Map<string, string>();
    for (const [iso3, c] of Object.entries(countries)) {
      if (c.annexedBy) {
        m.set(iso3, theme.stroke);
        continue;
      }
      if (layer === "war") {
        m.set(iso3, atWar.has(iso3) ? "#b91c1c" : c.overlord ? shade(theme.unclaimed, -0.1) : theme.unclaimed);
        continue;
      }
      if (layer === "political") {
        m.set(iso3, c.mapColor);
        continue;
      }
      if (layer === "relations" && focus?.relations) {
        const rel = focus.relations[iso3];
        m.set(iso3, rel === undefined ? theme.unclaimed : sampleRamp("magma", (rel + 100) / 200));
        continue;
      }
      if (c.overlord) {
        m.set(iso3, shade(theme.unclaimed, -0.12));
        continue;
      }
      m.set(iso3, scale.fill({ gdp: c.economy.gdp, gdpPc: c.economy.gdpPerCapita, growth: c.economy.gdpGrowth, inflation: c.economy.monetary.inflation, unemployment: c.economy.labour.unemployment, debt: c.economy.fiscal.debtToGdp, approval: c.executive.approval, ideology: c.ideology, bloc: c.bloc }));
    }
    return m;
  }, [countries, layer, scale, theme, atWar, focus]);

  return (
    <div
      ref={wrapRef}
      style={{ position: "absolute", inset: 0, touchAction: "none" }}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onPointerLeave={() => {
        endPointer({ pointerId: -1 } as React.PointerEvent);
        setHover(null);
      }}
    >
      <svg className="map" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
        <rect className="map__sphere" width={size.w} height={size.h} />
        <path className="map__graticule" d={graticulePath} />
        <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
          {world?.features.map((f) => {
            const iso3 = numericToIso.get(f.id);
            const c = iso3 ? countries[iso3] : undefined;
            if (!iso3 || !c) {
              // Land we do not simulate: neutral, clearly not part of the world.
              return <path key={f.id} className="map__country" d={f.path} fill={theme.unclaimed} opacity={0.35} stroke="none" />;
            }
            const isSel = selected === iso3;
            const fill = fills.get(iso3) ?? theme.unclaimed;
            return (
              <path
                key={f.id}
                className="map__country"
                d={f.path}
                fill={fill}
                opacity={c.annexedBy ? 0.35 : c.overlord ? 0.75 : 1}
                stroke={isSel ? "var(--ink)" : undefined}
                strokeWidth={isSel ? 1.4 : undefined}
                onMouseMove={(e) => {
                  const rect = wrapRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top, iso3 });
                }}
                onMouseLeave={() => setHover(null)}
                onClick={() => onSelect?.(iso3)}
                style={{ cursor: "pointer" }}
              />
            );
          })}
        </g>
      </svg>

      <div className="map-overlay">
        <MapLegend scale={scale} theme={theme} />
      </div>

      <div className="map-controls">
        <button className="btn btn--sm" onClick={() => applyZoom(1.4, size.w / 2, size.h / 2)} title="Zoom in">+</button>
        <button className="btn btn--sm" onClick={() => applyZoom(1 / 1.4, size.w / 2, size.h / 2)} title="Zoom out">&minus;</button>
        <button className="btn btn--sm" onClick={resetView} title="Reset view">Reset</button>
        <span className="badge">{Math.round(transform.k * 100)}%</span>
      </div>

      {hover && hovered && (
        <div className="map-tooltip" style={{ left: hover.x + 14, top: hover.y + 14 }}>
          <div className="row" style={{ gap: 6 }}>
            <strong>{hovered.name}</strong>
            {atWar.has(hovered.id) && <span className="badge badge--war">war</span>}
          </div>
          <div className="dim mono" style={{ fontSize: 11, marginTop: 2 }}>
            {hovered.overlord ? `Possession of ${hovered.overlord}` : hovered.annexedBy ? "Abolished" : `${(hovered.economy.gdpGrowth * 100).toFixed(2)}% growth`}
          </div>
        </div>
      )}
    </div>
  );
}

function MapLegend({ scale, theme }: { scale: ReturnType<typeof makeScale>; theme: Theme }) {
  if (scale.kind === "categorical" && scale.categories?.length) {
    return (
      <div className="map-legend">
        <div className="eyebrow">Scale</div>
        <div className="row row--wrap" style={{ gap: 8, marginTop: 4 }}>
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
      <div className="eyebrow">Scale</div>
      <div className="map-legend__scale">
        <span className="mono dim">{scale.legend[0].value}</span>
        <div className="map-legend__ramp" style={{ background: `linear-gradient(90deg, ${scale.legend.map((s) => s.color).join(", ")})` }} />
        <span className="mono dim">{scale.legend[scale.legend.length - 1].value}</span>
      </div>
      {theme.texture === "vellum" && <div className="eyebrow" style={{ marginTop: 4 }}>Unclaimed land shown pale</div>}
    </div>
  );
}

function shade(hex: string, amt: number): string {
  if (!hex.startsWith("#")) return hex;
  const s = hex.slice(1);
  const f = (i: number) => {
    const v = parseInt(s.slice(i, i + 2), 16);
    return Math.max(0, Math.min(255, Math.round(v * (1 + amt))));
  };
  return `#${((1 << 24) | (f(0) << 16) | (f(2) << 8) | f(4)).toString(16).slice(1)}`;
}

export { COUNTRY_BY_NUMERIC };