import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoNaturalEarth1, geoGraticule10, geoPath, type GeoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { Country, MapRegion, War } from "../../shared/types";
import { COUNTRY_BY_ISO3 } from "../../data/countries";
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
}

const WORLD_URL = "/geo/countries-50m.json";
let rawCache: RawFeature[] | null = null;

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

  // ---- geometry, one projection for everything ----------------------------
  const projection = useMemo(() => geoNaturalEarth1().fitExtent([[6, 6], [size.w - 6, size.h - 6]], { type: "Sphere" } as never), [size.w, size.h]);
  const pathGen = useMemo<GeoPath>(() => geoPath(projection), [projection]);

  const drawn = useMemo<Drawn[]>(() => {
    if (!raw) return [];
    const out: Drawn[] = [];
    for (const f of raw) {
      const key = featureKey(f);
      if (key === "010") continue;
      const d = pathGen(f as never);
      if (!d) continue;
      out.push({ key, numeric: key, name: String(f.properties?.name ?? key), path: d, centroid: pathGen.centroid(f as never) as [number, number], area: pathGen.area(f as never) });
    }
    return out;
  }, [raw, pathGen]);

  const graticule = useMemo(() => pathGen(geoGraticule10()) ?? "", [pathGen]);
  const sphere = useMemo(() => pathGen({ type: "Sphere" } as never) ?? "", [pathGen]);

  const regionPaths = useMemo(
    () =>
      regions.map((r) => {
        const pts = r.ring.map((p) => projection(p)).filter(Boolean) as [number, number][];
        return { ...r, d: `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L")}Z`, cx: pts.reduce((a, p) => a + p[0], 0) / pts.length, cy: pts.reduce((a, p) => a + p[1], 0) / pts.length };
      }),
    [regions, projection],
  );

  // The hosts of a region are modern ISO3 codes; find their polygons to clip against.
  const hostPaths = useMemo(() => {
    const byIso = new Map<string, string>();
    for (const c of drawn) byIso.set(c.key, c.path);
    return byIso;
  }, [drawn]);

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

  // ---- labels: the biggest polygon of each major polity -------------------
  const labels = useMemo(() => {
    const best = new Map<string, { x: number; y: number; area: number; total: number }>();
    for (const f of drawn) {
      const id = control[f.key];
      if (!id) continue;
      const cur = best.get(id);
      if (!cur) best.set(id, { x: f.centroid[0], y: f.centroid[1], area: f.area, total: f.area });
      else {
        cur.total += f.area;
        if (f.area > cur.area) {
          cur.x = f.centroid[0];
          cur.y = f.centroid[1];
          cur.area = f.area;
        }
      }
    }
    return [...best.entries()].sort((a, b) => b[1].total - a[1].total).slice(0, 70).map(([id, v]) => ({ id, ...v }));
  }, [drawn, control]);

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

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || e.buttons === 0) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.current.moved = true;
    if (drag.current.moved) setTransform((t) => ({ ...t, x: drag.current!.tx + dx, y: drag.current!.ty + dy }));
  };
  const endDrag = () => {
    window.setTimeout(() => {
      drag.current = null;
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
          {drawn.map((f, i) => {
            const id = control[f.key];
            const c = id ? countries[id] : undefined;
            if (!id || !c) return <path key={`${f.key}-${i}`} d={f.path} fill={theme.unclaimed} stroke={theme.stroke} strokeWidth={strokeWidth} opacity={0.5} />;
            return (
              <path
                key={`${f.key}-${i}`}
                className="map__country"
                d={f.path}
                fill={fills.get(id) ?? theme.unclaimed}
                stroke={theme.stroke}
                strokeWidth={strokeWidth}
                onMouseMove={(e) => track(e, id, f.name)}
                onMouseLeave={() => setHover(null)}
                onClick={() => pick(id)}
                style={{ cursor: "pointer" }}
              />
            );
          })}

          <defs>
            {regionPaths.map((r) => (
              <clipPath id={`clip-${r.id}`} key={r.id}>
                {r.hosts.map((iso) => {
                  const d = hostPaths.get(numericOf(iso));
                  return d ? <path key={iso} d={d} /> : null;
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

          {/* Outlines for the player's country and the selection, every polygon they own. */}
          {drawn.map((f, i) => {
            const id = control[f.key];
            if (id !== selected && id !== player) return null;
            return <path key={`hl-${f.key}-${i}`} d={f.path} fill="none" stroke={id === selected ? "var(--ink)" : "var(--accent-2)"} strokeWidth={id === selected ? 1.5 : 1.1} vectorEffect="non-scaling-stroke" style={{ pointerEvents: "none" }} />;
          })}

          {regionPaths.filter((r) => r.owner === selected || r.owner === player).map((r) => (
            <path key={`hl-${r.id}`} d={r.d} clipPath={`url(#clip-${r.id})`} fill="none" stroke={r.owner === selected ? "var(--ink)" : "var(--accent-2)"} strokeWidth={r.owner === selected ? 1.5 : 1.1} vectorEffect="non-scaling-stroke" style={{ pointerEvents: "none" }} />
          ))}

          {labels.map((l) => {
            const c = countries[l.id];
            if (!c) return null;
            // Only draw a name once the territory is big enough on screen to hold it.
            const screenWidth = Math.sqrt(l.area) * transform.k;
            const fontPx = clampNum((screenWidth / Math.max(5, c.name.length)) * 1.7, 0, 13);
            if (fontPx < 7.5) return null;
            return (
              <text key={l.id} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle" fontSize={fontPx / transform.k} className="map__label" style={{ pointerEvents: "none" }} stroke={theme.ocean} strokeWidth={2.4 / transform.k} paintOrder="stroke">
                {c.name}
              </text>
            );
          })}
        </g>
      </svg>

      {failed && <div className="map-overlay card" style={{ top: 12, bottom: "auto" }}>The map geometry could not be loaded. Reload the page.</div>}

      <div className="map-overlay">
        <MapLegend scale={scale} layer={layer} />
      </div>

      <div className="map-controls">
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
