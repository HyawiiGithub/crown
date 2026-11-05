import { useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

// ===========================================================================
// Small shared components. Every panel in the app is built from these, which is
// what keeps eight very different eras looking coherent within one scenario.
// ===========================================================================

export function Panel({ title, right, children, defaultOpen = true }: { title: string; right?: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="panel">
      <header className="panel__head" onClick={() => setOpen((o) => !o)}>
        <span className={`panel__chev ${open ? "open" : ""}`}>▶</span>
        <span className="eyebrow grow">{title}</span>
        {right}
      </header>
      {open && <div className="panel__body">{children}</div>}
    </section>
  );
}

export function Stat({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: string; tone?: string }) {
  return (
    <div className="stat" title={hint}>
      <span className="stat__label">{label}</span>
      <span className={`stat__value ${tone ?? ""}`}>{value}</span>
    </div>
  );
}

export function Bar({ value, max = 1, tone }: { value: number; max?: number; tone?: string }) {
  const w = Math.max(0, Math.min(100, (value / (max || 1)) * 100));
  return (
    <div className="bar">
      <div className="bar__fill" style={{ width: `${w}%`, background: tone }} />
    </div>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string; badge?: number }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <div key={t.id} className={`tab ${active === t.id ? "active" : ""}`} onClick={() => onChange(t.id)}>
          {t.label}
          {t.badge !== undefined && t.badge > 0 && <span className="dim"> {t.badge}</span>}
        </div>
      ))}
    </div>
  );
}

export function DataTable<T>({
  rows,
  columns,
  onRow,
  rowKey,
  maxHeight,
  empty,
}: {
  rows: T[];
  columns: { id: string; label: string; right?: boolean; width?: string; render: (r: T) => ReactNode; sort?: (a: T, b: T) => number }[];
  onRow?: (r: T) => void;
  rowKey: (r: T) => string;
  maxHeight?: number;
  empty?: string;
}) {
  const [sort, setSort] = useState<{ id: string; dir: 1 | -1 } | null>(null);
  const sorted = sort && columns.find((c) => c.id === sort.id)?.sort ? [...rows].sort(columns.find((c) => c.id === sort.id)!.sort) : rows;
  return (
    <div className="scroll" style={{ maxHeight }}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.id}
                className={c.right ? "right" : ""}
                style={{ width: c.width, cursor: c.sort ? "pointer" : "default" }}
                onClick={() => c.sort && setSort((s) => (s?.id === c.id ? { id: c.id, dir: -1 } : { id: c.id, dir: 1 }))}
              >
                {c.label}
                {sort?.id === c.id && (sort.dir === 1 ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={rowKey(r)} onClick={onRow ? () => onRow(r) : undefined} style={{ cursor: onRow ? "pointer" : undefined }}>
              {columns.map((c) => (
                <td key={c.id} className={c.right ? "right" : ""}>{c.render(r)}</td>
              ))}
            </tr>
          ))}
          {!sorted.length && (
            <tr>
              <td colSpan={columns.length} className="dim" style={{ textAlign: "center", padding: 16 }}>{empty ?? "Nothing here"}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="dim" style={{ padding: "22px 12px", textAlign: "center", fontSize: 12 }}>{children}</div>;
}

export function Chip({ children, tone }: { children: ReactNode; tone?: string }) {
  return <span className="badge" style={tone ? { color: tone, borderColor: tone } : undefined}>{children}</span>;
}

export function Slider({ label, value, min, max, step, onChange, suffix }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <label className="field">
      <span className="row" style={{ justifyContent: "space-between" }}>
        <span>{label}</span>
        <span className="mono">{value}{suffix ?? ""}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
/**
 * A one-series trend line with its title above it and a hover readout. One colour,
 * no legend; the title names the series. `zero` draws a reference line at 0 when it
 * falls inside the range.
 */
export function Spark({ title, values, format, zero }: { title: string; values: number[]; format: (v: number) => string; zero?: boolean }) {
  const [hover, setHover] = useState<number | null>(null);
  const w = 160;
  const h = 44;
  const pad = 3;
  const lo = Math.min(...values, zero ? 0 : Infinity);
  const hi = Math.max(...values, zero ? 0 : -Infinity);
  const span = hi - lo || 1;
  const x = (i: number) => pad + (i / Math.max(1, values.length - 1)) * (w - pad * 2);
  const y = (v: number) => h - pad - ((v - lo) / span) * (h - pad * 2);
  const d = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  const onMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const f = (e.clientX - r.left) / r.width;
    setHover(Math.max(0, Math.min(values.length - 1, Math.round(f * (values.length - 1)))));
  };
  const shownIndex = hover ?? values.length - 1;
  return (
    <figure className="spark">
      <figcaption className="row" style={{ justifyContent: "space-between" }}>
        <span className="stat__label">{title}</span>
        <span className="mono" style={{ fontSize: 12 }}>{format(values[shownIndex])}</span>
      </figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" role="img" aria-label={`${title}, latest ${format(values[values.length - 1])}`} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        {zero && lo < 0 && hi > 0 && <line x1={0} x2={w} y1={y(0)} y2={y(0)} stroke="var(--rule)" strokeWidth={1} vectorEffect="non-scaling-stroke" />}
        <path d={d} fill="none" stroke="var(--accent-2)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={0} y2={h} stroke="var(--ink-muted)" strokeWidth={1} vectorEffect="non-scaling-stroke" />}
      </svg>
    </figure>
  );
}
