import { useEffect, useMemo, useRef, useState } from "react";
import type { Capability, Company, Country, CustomRule, User, WorldDirective } from "../../shared/types";
import { DEFAULT_PARAMS } from "../../data/scenarios";
import { devOp, can } from "../store";
import { credits, money, pct, pct0, people, signedPct } from "../format";
import { Chip, DataTable, Slider } from "./primitives";

/**
 * The Developer Menu.
 *
 * Every section maps onto a capability, and the section itself is hidden if the
 * capability is missing, so nobody sees a button that the API will refuse.
 * The whole panel talks to one endpoint (`POST /api/worlds/:id/dev`) which
 * dispatches into the Durable Object; nothing here touches simulation state
 * directly.
 */

type Section =
  | "console" | "world" | "economy" | "money" | "politics" | "companies"
  | "characters" | "diplomacy" | "military" | "params" | "rules" | "directives"
  | "entities" | "moderation" | "audit";

interface Props {
  worldId: string;
  user: User;
  countries: Record<string, Country>;
  companies: Record<string, Company>;
  directives: WorldDirective[];
  params: Record<string, number>;
  simTime: number;
  paused: boolean;
  speed: number;
  onClose: () => void;
  toast: (t: string, k?: "ok" | "err") => void;
}

const SECTIONS: { id: Section; label: string; cap: Capability | null }[] = [
  { id: "console", label: "Console", cap: "dev.console" },
  { id: "world", label: "World control", cap: "dev.directives" },
  { id: "params", label: "Parameters", cap: "dev.worldedit" },
  { id: "economy", label: "Economy editor", cap: "economy.set-stat" },
  { id: "money", label: "Money & treasuries", cap: "economy.grant" },
  { id: "politics", label: "Politics", cap: "politics.override" },
  { id: "companies", label: "Companies", cap: "company.manage" },
  { id: "characters", label: "Characters & leaders", cap: "character.create" },
  { id: "diplomacy", label: "Diplomacy & war", cap: "diplomacy.war" },
  { id: "military", label: "Military", cap: "military.command" },
  { id: "entities", label: "Remove entities", cap: "dev.worldedit" },
  { id: "rules", label: "Rule engine", cap: "rules.manage" },
  { id: "directives", label: "Directives", cap: "dev.directives" },
  { id: "moderation", label: "Moderation", cap: "moderation.kick" },
  { id: "audit", label: "Capabilities", cap: null },
];

export function DevMenu(props: Props) {
  const allowed = SECTIONS.filter((s) => !s.cap || can(props.user, s.cap));
  const [section, setSection] = useState<Section>("console");
  const [busy, setBusy] = useState(false);

  const run = async (op: Record<string, unknown>) => {
    setBusy(true);
    try {
      const r = await devOp(props.worldId, op);
      props.toast(r.message, r.ok ? "ok" : "err");
      return r;
    } catch (e) {
      props.toast(e instanceof Error ? e.message : "Command failed", "err");
      return { ok: false, message: String(e) };
    } finally {
      setBusy(false);
    }
  };

  if (!allowed.some((s) => s.id === section)) setSection(allowed[0]?.id ?? "audit");

  return (
    <div className="dev">
      <nav className="dev__nav">
        <div className="eyebrow" style={{ padding: "8px 16px 4px" }}>Developer</div>
        {allowed.map((s) => (
          <div key={s.id} className={`dev__nav-item ${section === s.id ? "active" : ""}`} onClick={() => setSection(s.id)}>
            {s.label}
          </div>
        ))}
        <div style={{ padding: 14 }}>
          <button className="btn btn--sm" style={{ width: "100%" }} onClick={props.onClose}>Close &mdash; Esc</button>
        </div>
      </nav>

      <main className="dev__main">
        <div className="row" style={{ marginBottom: 14 }}>
          <h2 className="dev__section-title grow">{allowed.find((s) => s.id === section)?.label}</h2>
          <Chip tone={busy ? "var(--accent-2)" : "var(--ink-muted)"}>{busy ? "busy" : "idle"}</Chip>
          <Chip tone={props.paused ? "var(--negative)" : "var(--positive)"}>{props.paused ? "paused" : "running"}</Chip>
          <span className="dim mono">t={Math.round(props.simTime)}</span>
        </div>

        {section === "console" && <Console run={run} />}
        {section === "world" && <WorldControl run={run} {...props} />}
        {section === "params" && <Params run={run} {...props} />}
        {section === "economy" && <EconomyEditor run={run} countries={props.countries} />}
        {section === "money" && <Money run={run} countries={props.countries} />}
        {section === "politics" && <Politics run={run} countries={props.countries} />}
        {section === "companies" && <Companies run={run} companies={props.companies} countries={props.countries} />}
        {section === "characters" && <Characters run={run} countries={props.countries} />}
        {section === "diplomacy" && <Diplomacy run={run} countries={props.countries} />}
        {section === "military" && <Military run={run} countries={props.countries} />}
        {section === "entities" && <Entities run={run} countries={props.countries} />}
        {section === "rules" && <Rules run={run} directives={props.directives} />}
        {section === "directives" && <Directives run={run} directives={props.directives} />}
        {section === "moderation" && <Moderation run={run} countries={props.countries} />}
        {section === "audit" && <Capabilities user={props.user} />}
      </main>
    </div>
  );
}

// ===========================================================================
// Console
// ===========================================================================

function Console({ run }: { run: (op: Record<string, unknown>) => Promise<{ ok: boolean; message: string }> }) {
  const [lines, setLines] = useState<{ text: string; kind: "in" | "ok" | "err" }[]>([
    { text: "CROWN developer console. Commands run against the live world.", kind: "ok" },
    { text: "", kind: "ok" },
    { text: "  world.gdp *= 2                     multiply any numeric path on the world", kind: "in" },
    { text: "  country(USA).economy.gdp = 5e13   edit a country", kind: "in" },
    { text: "  gdp(CHN) = 8e13                  shorthand for the economy", kind: "in" },
    { text: "  war(IND,PAK)                     declare a war", kind: "in" },
    { text: "  annex(RUS,UKR,reason)            annex a country", kind: "in" },
    { text: "  grant(USA, 1e12)                 add to a treasury", kind: "in" },
    { text: "  approval(FRA) += 20              move a stat", kind: "in" },
    { text: "  unrest(NGA) += 0.1               raise unrest risk", kind: "in" },
    { text: "  create-country(NLD2,Netherlands) spawn a new polity", kind: "in" },
    { text: "  remove-country(UKR,INT)          abolish a country", kind: "in" },
    { text: "", kind: "ok" },
    { text: "One command per line. Statements separated by ';' run in order.", kind: "ok" },
  ]);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const submit = async () => {
    const code = input.trim();
    if (!code) return;
    setLines((l) => [...l, { text: `> ${code}`, kind: "in" }]);
    setHist((h) => [code, ...h].slice(0, 60));
    setHi(-1);
    setInput("");
    const r = await run({ op: "console", code });
    setLines((l) => [...l, { text: r.message || "(no output)", kind: r.ok ? "ok" : "err" }]);
  };

  return (
    <div>
      <div className="dev__console" onClick={() => document.getElementById("devcmd")?.focus()}>
        {lines.map((l, i) => (
          <span key={i} className={`dev__console-line ${l.kind === "in" ? "dev__console-in" : l.kind === "err" ? "dev__console-err" : l.kind === "ok" ? "dev__console-ok" : ""}`}>{l.text}{"\n"}</span>
        ))}
        <div ref={endRef} />
      </div>
      <div className="row" style={{ marginTop: 8 }}>
        <span className="dev__console-in mono">&gt;</span>
        <input
          id="devcmd"
          className="input mono"
          style={{ flex: 1 }}
          value={input}
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void submit();
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const n = Math.min(hist.length - 1, hi + 1);
              if (n >= 0) {
                setHi(n);
                setInput(hist[n]);
              }
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              const n = hi - 1;
              setHi(n);
              setInput(n >= 0 ? hist[n] : "");
            }
          }}
          placeholder="country(USA).economy.gdp = 5e13"
        />
        <button className="btn btn--primary" onClick={() => void submit()}>Run</button>
      </div>
    </div>
  );
}

// ===========================================================================
// World control
// ===========================================================================

function WorldControl({ run, countries, simTime, paused, speed }: Props & { run: (op: Record<string, unknown>) => Promise<unknown> }) {
  const [days, setDays] = useState(30);
  const stats = useMemo(() => {
    const list = Object.values(countries);
    return {
      countries: list.length,
      independents: list.filter((c) => !c.overlord && !c.annexedBy).length,
      annexed: list.filter((c) => c.annexedBy).length,
      colonies: list.filter((c) => c.overlord).length,
      banned: list.filter((c) => c.banned).length,
    };
  }, [countries]);

  return (
    <div className="stack">
      <div className="dev__grid">
        <section className="card">
          <div className="eyebrow" style={{ marginBottom: 8 }}>Time</div>
          <div className="row row--wrap" style={{ gap: 6 }}>
            <button className="btn btn--sm" onClick={() => void run({ op: "resume", speed: speed || 1 })}>Resume</button>
            <button className="btn btn--sm" onClick={() => void run({ op: "pause" })}>Pause</button>
            {[0.25, 1, 2, 5, 10, 20].map((s) => (
              <button key={s} className={`btn btn--sm ${Math.abs(speed - s) < 0.01 ? "btn--active" : ""}`} onClick={() => void run({ op: "speed", speed: s })}>{s}x</button>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <Slider label="Fast-forward days" value={days} min={1} max={365} step={1} onChange={setDays} />
            <button className="btn btn--sm" style={{ width: "100%" }} onClick={() => void run({ op: "fast-forward", days })}>
              Advance {days} in-game days
            </button>
          </div>
        </section>

        <section className="card">
          <div className="eyebrow" style={{ marginBottom: 8 }}>World composition</div>
          <div className="dev__statline"><span className="kv__k">Polities</span><span className="mono">{stats.countries}</span></div>
          <div className="dev__statline"><span className="kv__k">Sovereign</span><span className="mono">{stats.independents}</span></div>
          <div className="dev__statline"><span className="kv__k">Possessions</span><span className="mono">{stats.colonies}</span></div>
          <div className="dev__statline"><span className="kv__k">Abolished</span><span className="mono">{stats.annexed}</span></div>
          <div className="dev__statline"><span className="kv__k">Banned</span><span className="mono">{stats.banned}</span></div>
          <div className="dev__statline"><span className="kv__k">Sim time</span><span className="mono">{(simTime / 86400).toFixed(1)}d</span></div>
          <div className="dev__statline"><span className="kv__k">State</span><span className="mono">{paused ? "PAUSED" : "RUNNING"}</span></div>
        </section>

        <section className="card">
          <div className="eyebrow" style={{ marginBottom: 8 }}>Danger</div>
          <button className="btn btn--sm btn--danger" style={{ width: "100%" }} onClick={() => {
            if (confirm("Rebuild the entire world from the scenario? All player progress is lost.")) void run({ op: "reset-world" });
          }}>Reset world to scenario</button>
          <button className="btn btn--sm" style={{ width: "100%", marginTop: 6 }} onClick={() => void run({ op: "reset-params" })}>Reset parameters</button>
        </section>
      </div>
    </div>
  );
}

// ===========================================================================
// Parameters
// ===========================================================================

const PARAM_META: Record<string, { label: string; group: string; min: number; max: number; step: number; hint: string }> = {
  tickMs: { label: "Tick interval", group: "Core", min: 200, max: 10000, step: 100, hint: "ms between simulation steps" },
  growthSmoothing: { label: "Growth smoothing", group: "Core", min: 0.01, max: 0.5, step: 0.01, hint: "convergence speed of growth toward target" },
  growthBias: { label: "Global growth bias", group: "Core", min: -1, max: 2, step: 0.05, hint: "master multiplier on all growth" },
  eventRate: { label: "Event density", group: "Core", min: 0, max: 5, step: 0.1, hint: "frequency of wars, crises and unrest" },
  seed: { label: "RNG seed", group: "Core", min: 1, max: 2147483647, step: 1, hint: "reshuffles every random draw" },
  okunSensitivity: { label: "Okun sensitivity", group: "Economy", min: 0, max: 2, step: 0.05, hint: "unemployment response to output gap" },
  phillipsSensitivity: { label: "Phillips sensitivity", group: "Economy", min: 0, max: 2, step: 0.05, hint: "inflation response to labour slack" },
  inflationTarget: { label: "Inflation target", group: "Economy", min: -0.05, max: 0.2, step: 0.005, hint: "central bank target" },
  wagePush: { label: "Wage push", group: "Economy", min: 0, max: 2, step: 0.05, hint: "how aggressively wages chase prices" },
  fiscalMultiplier: { label: "Fiscal multiplier", group: "Economy", min: 0, max: 4, step: 0.1, hint: "output response to budget balance" },
  corruptionDrag: { label: "Corruption drag", group: "Economy", min: 0, max: 2, step: 0.05, hint: "growth cost of corruption" },
  inequalityDrag: { label: "Inequality drag", group: "Economy", min: 0, max: 2, step: 0.05, hint: "consumption cost of inequality" },
  tradeElasticity: { label: "Trade elasticity", group: "Economy", min: 0, max: 5, step: 0.1, hint: "trade response to the global cycle" },
  corporateWeight: { label: "Corporate weight", group: "Economy", min: 0, max: 1, step: 0.05, hint: "corporate share of GDP" },
  sanctionBite: { label: "Sanction bite", group: "Economy", min: 0, max: 3, step: 0.05, hint: "damage sanctions do" },
  debtInterestBase: { label: "Base interest rate", group: "Finance", min: 0, max: 0.2, step: 0.001, hint: "risk-free rate on debt" },
  debtInterestRisk: { label: "Risk premium", group: "Finance", min: 0, max: 0.5, step: 0.005, hint: "how fast borrowing costs rise with debt" },
  bankruptcyThreshold: { label: "Default threshold", group: "Finance", min: 0.5, max: 3, step: 0.05, hint: "debt/GDP at which a crisis can fire" },
  marketBeta: { label: "Market beta", group: "Finance", min: 0, max: 80, step: 1, hint: "equity response to growth" },
  marketVolatility: { label: "Market volatility", group: "Finance", min: 0, max: 8, step: 0.1, hint: "random share price swing" },
  crashProbability: { label: "Crash probability", group: "Finance", min: 0, max: 0.05, step: 0.0005, hint: "chance of a crash per in-game day" },
  policyRateSmoothing: { label: "Rate smoothing", group: "Finance", min: 0.01, max: 1, step: 0.01, hint: "central bank reaction speed" },
  whipStrength: { label: "Whip strength", group: "Politics", min: 0, max: 1, step: 0.02, hint: "party voting discipline" },
  electionChaos: { label: "Election chaos", group: "Politics", min: 0, max: 1, step: 0.05, hint: "recounts and redistribution" },
  corruptionRate: { label: "Corruption accrual", group: "Politics", min: 0, max: 0.001, step: 0.00002, hint: "growth of corruption with state size" },
  warDamage: { label: "War damage", group: "Military", min: 0, max: 0.01, step: 0.00005, hint: "attrition per front per tick" },
  crisisProbability: { label: "Crisis probability", group: "Events", min: 0, max: 0.05, step: 0.0005, hint: "baseline systemic crisis rate" },
};

function Params({ run, params }: { run: (op: Record<string, unknown>) => Promise<unknown>; params: Record<string, number>; worldId: string }) {
  const [local, setLocal] = useState<Record<string, number>>(params);
  useEffect(() => setLocal(params), [params]);
  const groups = [...new Set(Object.values(PARAM_META).map((m) => m.group))];

  const commit = (key: string, v: number) => {
    setLocal((l) => ({ ...l, [key]: v }));
    void run({ op: "set-param", key, value: v });
  };

  return (
    <div className="stack">
      <div className="dim" style={{ fontSize: 12 }}>
        Every value here is live. Changes apply on the next tick to the whole world.
        Reset restores the scenario defaults.
      </div>
      {groups.map((g) => (
        <section key={g} className="card">
          <div className="eyebrow" style={{ marginBottom: 10 }}>{g}</div>
          <div className="dev__grid">
            {Object.entries(PARAM_META).filter(([, m]) => m.group === g).map(([key, m]) => (
              <div key={key} title={m.hint}>
                <div className="row" style={{ justifyContent: "space-between", fontSize: 11.5 }}>
                  <span>{m.label}</span>
                  <span className="mono">{local[key] ?? (DEFAULT_PARAMS as unknown as Record<string, number>)[key]}</span>
                </div>
                <input
                  type="range"
                  min={m.min}
                  max={m.max}
                  step={m.step}
                  value={local[key] ?? (DEFAULT_PARAMS as unknown as Record<string, number>)[key]}
                  onChange={(e) => setLocal((l) => ({ ...l, [key]: Number(e.target.value) }))}
                  onMouseUp={(e) => commit(key, Number((e.target as HTMLInputElement).value))}
                  onTouchEnd={(e) => commit(key, Number((e.target as HTMLInputElement).value))}
                />
                <div className="dim" style={{ fontSize: 10.5 }}>{m.hint}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// ===========================================================================
// Economy editor
// ===========================================================================

const ECON_PATHS = [
  ["economy.gdp", "GDP"],
  ["economy.gdpPerCapita", "GDP per capita"],
  ["economy.population", "Population"],
  ["economy.gdpGrowth", "Growth rate"],
  ["economy.monetary.inflation", "Inflation"],
  ["economy.monetary.policyRate", "Policy rate"],
  ["economy.monetary.exchangeRateVsUsd", "Exchange rate"],
  ["economy.labour.unemployment", "Unemployment"],
  ["economy.labour.medianWage", "Median wage"],
  ["economy.fiscal.debt", "Sovereign debt"],
  ["economy.fiscal.debtToGdp", "Debt / GDP"],
  ["economy.fiscal.treasury", "Treasury"],
  ["economy.fiscal.revenue", "Revenue"],
  ["economy.fiscal.expenditure", "Expenditure"],
  ["economy.reserves", "Reserves"],
  ["economy.netForeignAssets", "Net foreign assets"],
  ["economy.corruption", "Corruption"],
  ["economy.inequality", "Inequality"],
  ["economy.rd", "R&D spending"],
  ["economy.trade.tradeOpenness", "Trade openness"],
  ["economy.trade.tariffRate", "Tariff rate"],
  ["economy.unrestRisk", "Unrest risk"],
] as const;

function EconomyEditor({ run, countries }: { run: (op: Record<string, unknown>) => Promise<unknown>; countries: Record<string, Country> }) {
  const [iso, setIso] = useState("USA");
  const c = countries[iso];
  const list = useMemo(() => Object.values(countries).filter((x) => !x.annexedBy).sort((a, b) => b.economy.gdp - a.economy.gdp), [countries]);
  const [path, setPath] = useState<string>("economy.gdp");
  const [value, setValue] = useState<string>("");

  return (
    <div className="stack">
      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Target</div>
        <div className="row" style={{ gap: 8 }}>
          <input className="input" list="countries" value={iso} onChange={(e) => setIso(e.target.value.toUpperCase())} style={{ width: 120 }} />
          <datalist id="countries">
            {list.slice(0, 250).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </datalist>
          <select className="select grow" value={iso} onChange={(e) => setIso(e.target.value)}>
            {list.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
          <button className="btn btn--sm" onClick={() => { const n = Number(prompt(`New value for ${path}`, "0")); if (Number.isFinite(n)) void run({ op: "set-stat", scope: "country", id: iso, path, value: n }); }}>
            Apply path
          </button>
        </div>
        {c && (
          <div className="dev__grid" style={{ marginTop: 12 }}>
            {ECON_PATHS.map(([p, label]) => (
              <div key={p}>
                <div className="row" style={{ justifyContent: "space-between", fontSize: 11 }}>
                  <span>{label}</span>
                  <span className="mono">{readPath(c, p)}</span>
                </div>
                <div className="row" style={{ gap: 4 }}>
                  <input
                    className="input mono"
                    style={{ padding: "2px 5px", fontSize: 11 }}
                    defaultValue={readPath(c, p)}
                    key={`${iso}-${p}`}
                    onBlur={(e) => {
                      const n = Number(e.target.value);
                      if (Number.isFinite(n) && n !== readPath(c, p)) void run({ op: "set-stat", scope: "country", id: iso, path: p, value: n });
                    }}
                  />
                  <button className="btn btn--sm" onClick={() => { const n = Number(prompt(`Set ${label}`, String(readPath(c, p)))); if (Number.isFinite(n)) void run({ op: "set-stat", scope: "country", id: iso, path: p, value: n }); }}>Set</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Arbitrary path</div>
        <div className="row" style={{ gap: 6 }}>
          <input className="input mono grow" placeholder="economy.fiscal.debtToGdp" value={path} onChange={(e) => setPath(e.target.value)} />
          <input className="input mono" style={{ width: 160 }} placeholder="value" value={value} onChange={(e) => setValue(e.target.value)} />
          <button className="btn btn--sm btn--primary" onClick={() => void run({ op: "set-stat", scope: "country", id: iso, path, value: Number(value) })}>Write</button>
        </div>
        <div className="dim" style={{ fontSize: 11, marginTop: 6 }}>
          Any numeric path in the country object resolves here. Nested objects like sectors and military branches work too,
          e.g. <code>military.branches.army.quality</code>.
        </div>
      </section>
    </div>
  );
}

function readPath(c: Country, path: string): number {
  let cur: unknown = c;
  for (const k of path.split(".")) {
    if (cur === null || typeof cur !== "object") return NaN;
    cur = (cur as Record<string, unknown>)[k];
  }
  return typeof cur === "number" ? cur : NaN;
}

// ===========================================================================
// Money
// ===========================================================================

function Money({ run, countries }: { run: (op: Record<string, unknown>) => Promise<unknown>; countries: Record<string, Country> }) {
  const list = useMemo(() => Object.values(countries).filter((c) => !c.annexedBy).sort((a, b) => b.economy.gdp - a.economy.gdp), [countries]);
  const [iso, setIso] = useState("USA");
  const [amount, setAmount] = useState("1e12");
  const [where, setWhere] = useState("treasury");
  const c = countries[iso];

  return (
    <div className="stack">
      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Adjust a national balance sheet</div>
        <div className="dev__grid">
          <label className="field"><span>Country</span>
            <select className="select" value={iso} onChange={(e) => setIso(e.target.value)}>
              {list.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </label>
          <label className="field"><span>Amount (accepts 1e12)</span><input className="input mono" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
          <label className="field"><span>Target</span>
            <select className="select" value={where} onChange={(e) => setWhere(e.target.value)}>
              <option value="treasury">Treasury</option>
              <option value="reserves">Foreign reserves</option>
              <option value="gdp">GDP</option>
              <option value="debt">Sovereign debt</option>
            </select>
          </label>
          <div className="field" style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
            <button className="btn btn--primary grow" onClick={() => void run({ op: "grant", id: iso, amount: Number(amount), where })}>Apply</button>
            <button className="btn" onClick={() => void run({ op: "mint", id: iso, amount: Number(amount) })}>Mint</button>
          </div>
        </div>
        {c && (
          <div className="dev__grid" style={{ marginTop: 12 }}>
            <div className="dev__statline"><span className="kv__k">GDP</span><span className="mono">{credits(c.economy.gdp)}</span></div>
            <div className="dev__statline"><span className="kv__k">Treasury</span><span className="mono">{credits(c.economy.fiscal.treasury)}</span></div>
            <div className="dev__statline"><span className="kv__k">Debt</span><span className="mono">{credits(c.economy.fiscal.debt)}</span></div>
            <div className="dev__statline"><span className="kv__k">Debt / GDP</span><span className="mono">{pct0(c.economy.fiscal.debtToGdp)}</span></div>
            <div className="dev__statline"><span className="kv__k">Reserves</span><span className="mono">{credits(c.economy.reserves)}</span></div>
            <div className="dev__statline"><span className="kv__k">Balance</span><span className="mono">{signedPct(c.economy.fiscal.budgetBalanceRatio)}</span></div>
          </div>
        )}
      </section>
      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Bulk operations</div>
        <div className="row row--wrap" style={{ gap: 6 }}>
          <button className="btn btn--sm" onClick={() => { const f = Number(prompt("Halve everyone's GDP. Factor (0-1)", "0.5")); if (Number.isFinite(f)) void run({ op: "console", code: `for(ISO) country(${'"'}"") ` }); }}>Global contraction</button>
          <span className="dim" style={{ fontSize: 11 }}>Use the console for scripted operations across every country.</span>
        </div>
      </section>
    </div>
  );
}

// ===========================================================================
// Politics
// ===========================================================================

function Politics({ run, countries }: { run: (op: Record<string, unknown>) => Promise<unknown>; countries: Record<string, Country> }) {
  const list = useMemo(() => Object.values(countries).filter((c) => !c.annexedBy && c.legislature).sort((a, b) => b.economy.gdp - a.economy.gdp), [countries]);
  const [iso, setIso] = useState("USA");
  const c = countries[iso];
  const [party, setParty] = useState({ name: "", abbreviation: "", ideology: "0", country: iso });
  const [question, setQuestion] = useState("Shall the current government continue in office?");

  useEffect(() => setParty((p) => ({ ...p, country: iso })), [iso]);

  return (
    <div className="stack">
      <section className="card">
        <div className="row" style={{ marginBottom: 8 }}>
          <span className="eyebrow grow">Country</span>
          <select className="select" style={{ width: 240 }} value={iso} onChange={(e) => setIso(e.target.value)}>
            {list.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        </div>
        <div className="row row--wrap" style={{ gap: 6 }}>
          <button className="btn btn--sm" onClick={() => void run({ op: "force-election", country: iso })}>Force election</button>
          <button className="btn btn--sm" onClick={() => void run({ op: "raise-referendum", country: iso, question })}>Call referendum</button>
          <button className="btn btn--sm btn--danger" onClick={() => void run({ op: "remove-leader", id: iso, which: "head-of-government" })}>Remove PM</button>
          <button className="btn btn--sm btn--danger" onClick={() => void run({ op: "remove-leader", id: iso, which: "head-of-state" })}>Remove head of state</button>
        </div>
        <label className="field" style={{ marginTop: 10 }}>
          <span>Referendum question</span>
          <input className="input" value={question} onChange={(e) => setQuestion(e.target.value)} />
        </label>
        {c && (
          <div className="dev__grid" style={{ marginTop: 8 }}>
            <div className="dev__statline"><span className="kv__k">Approval</span><span className="mono">{pct0(c.executive.approval)}</span></div>
            <div className="dev__statline"><span className="kv__k">Confidence</span><span className="mono">{pct0(c.executive.confidence)}</span></div>
            <div className="dev__statline"><span className="kv__k">Coalition</span><span className="mono">{c.executive.coalition.length}</span></div>
            <div className="dev__statline"><span className="kv__k">Parties</span><span className="mono">{c.parties.length}</span></div>
            <div className="dev__statline"><span className="kv__k">Active bills</span><span className="mono">{c.legislature?.activeBills.length ?? 0}</span></div>
            <div className="dev__statline"><span className="kv__k">Unrest risk</span><span className="mono">{pct0(c.unrestRisk)}</span></div>
          </div>
        )}
      </section>

      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Found a party</div>
        <div className="dev__grid">
          <label className="field"><span>Name</span><input className="input" value={party.name} onChange={(e) => setParty({ ...party, name: e.target.value })} placeholder="National Renewal Front" /></label>
          <label className="field"><span>Abbreviation</span><input className="input" value={party.abbreviation} onChange={(e) => setParty({ ...party, abbreviation: e.target.value })} placeholder="NRF" /></label>
          <label className="field"><span>Ideology (-100 left, +100 right)</span><input className="input mono" value={party.ideology} onChange={(e) => setParty({ ...party, ideology: e.target.value })} /></label>
        </div>
        <button className="btn btn--sm" onClick={() => void run({ op: "form-party", ...party, ideology: Number(party.ideology), popularity: 8, color: "#8e44ad" })}>
          Register party
        </button>
      </section>

      {c && c.parties.length > 0 && (
        <section className="card">
          <div className="eyebrow" style={{ marginBottom: 8 }}>Parties in {c.name}</div>
          <DataTable
            rows={c.parties}
            rowKey={(p) => p.id}
            maxHeight={280}
            columns={[
              { id: "n", label: "Party", render: (p) => p.name },
              { id: "s", label: "Status", render: (p) => <Chip tone={p.status === "government" ? "var(--positive)" : undefined}>{p.status}</Chip> },
              { id: "b", label: "Ban", right: true, render: (p) => <button className="btn btn--sm btn--danger" onClick={() => void run({ op: "ban-party", id: p.id, banned: !p.banned, reason: "Developer action" })}>{p.banned ? "Unban" : "Ban"}</button> },
              { id: "d", label: "Delete", right: true, render: (p) => <button className="btn btn--sm btn--danger" onClick={() => { if (confirm(`Dissolve ${p.name}?`)) void run({ op: "delete-party", id: p.id }); }}>Delete</button> },
            ]}
          />
        </section>
      )}
    </div>
  );
}

// ===========================================================================
// Companies
// ===========================================================================

function Companies({ run, companies, countries }: { run: (op: Record<string, unknown>) => Promise<unknown>; companies: Record<string, Company>; countries: Record<string, Country> }) {
  const list = useMemo(() => Object.values(companies).sort((a, b) => b.valuation - a.valuation), [companies]);
  const [q, setQ] = useState("");
  const filtered = list.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.country.toLowerCase().includes(q.toLowerCase()));
  const [found, setFound] = useState({ name: "", country: "USA", sector: "manufacturing", revenue: "1e9", employees: "500" });

  return (
    <div className="stack">
      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Found a corporation</div>
        <div className="dev__grid">
          <label className="field"><span>Name</span><input className="input" value={found.name} onChange={(e) => setFound({ ...found, name: e.target.value })} placeholder="Meridian Industrial" /></label>
          <label className="field"><span>Country</span>
            <select className="select" value={found.country} onChange={(e) => setFound({ ...found, country: e.target.value })}>
              {Object.values(countries).filter((c) => !c.annexedBy).slice(0, 250).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="field"><span>Sector</span>
            <select className="select" value={found.sector} onChange={(e) => setFound({ ...found, sector: e.target.value })}>
              {["manufacturing", "technology", "finance", "energy", "mining", "healthcare", "retail", "agriculture", "defence", "telecom", "real-estate", "transport", "education", "media", "tourism", "construction", "utilities"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="field"><span>Revenue (credits/yr)</span><input className="input mono" value={found.revenue} onChange={(e) => setFound({ ...found, revenue: e.target.value })} /></label>
          <label className="field"><span>Employees</span><input className="input mono" value={found.employees} onChange={(e) => setFound({ ...found, employees: e.target.value })} /></label>
        </div>
        <button className="btn btn--sm btn--primary" onClick={() => void run({ op: "console", code: `create-country(${""}) ` }).then(() => undefined)} style={{ display: "none" }} />
        <button className="btn btn--sm btn--primary" disabled={!found.name} onClick={() => void run({ op: "found-company", name: found.name, country: found.country, sector: found.sector, revenue: Number(found.revenue), employees: Number(found.employees), listed: true })}>Incorporate</button>
      </section>

      <section className="card">
        <div className="row" style={{ marginBottom: 8 }}>
          <span className="eyebrow grow">Corporate registry ({filtered.length}/{list.length})</span>
          <input className="input" style={{ width: 200 }} placeholder="Filter" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <DataTable
          rows={filtered.slice(0, 300)}
          rowKey={(c) => c.id}
          maxHeight={520}
          columns={[
            { id: "n", label: "Company", render: (c) => <span className="row" style={{ gap: 5 }}><span className="truncate">{c.name}</span>{c.banned && <Chip tone="var(--negative)">banned</Chip>}{c.insolvent && <Chip tone="var(--negative)">insolvent</Chip>}</span> },
            { id: "c", label: "HQ", render: (c) => <span className="dim">{countries[c.country]?.name ?? c.country}</span> },
            { id: "v", label: "Cap", right: true, render: (c) => <span className="mono">{credits(c.valuation)}</span>, sort: (a, b) => b.valuation - a.valuation },
            { id: "r", label: "Revenue", right: true, render: (c) => <span className="mono dim">{credits(c.revenue)}</span>, sort: (a, b) => b.revenue - a.revenue },
            { id: "e", label: "Staff", right: true, render: (c) => <span className="mono dim">{people(c.employees)}</span>, sort: (a, b) => b.employees - a.employees },
            { id: "b", label: "Ban", right: true, render: (c) => <button className="btn btn--sm btn--danger" onClick={() => void run({ op: "ban-company", id: c.id, banned: !c.banned, reason: "Developer action" })}>{c.banned ? "Unban" : "Ban"}</button> },
            { id: "d", label: "Delete", right: true, render: (c) => <button className="btn btn--sm btn--danger" onClick={() => { if (confirm(`Dissolve ${c.name}? This is permanent.`)) void run({ op: "delete-company", id: c.id }); }}>Delete</button> },
          ]}
        />
      </section>
    </div>
  );
}

// ===========================================================================
// Characters
// ===========================================================================

function Characters({ run, countries }: { run: (op: Record<string, unknown>) => Promise<unknown>; countries: Record<string, Country> }) {
  const list = useMemo(() => Object.values(countries).filter((c) => !c.annexedBy).sort((a, b) => b.economy.gdp - a.economy.gdp), [countries]);
  const [iso, setIso] = useState("USA");
  const c = countries[iso];
  const [form, setForm] = useState({ name: "", role: "minister", competence: "50", charisma: "50", integrity: "50", ambition: "50", ideology: "0", popularity: "50", experience: "50", militancy: "0" });

  const leaders = [
    { label: c?.headOfStateTitle ?? "Head of state", id: c?.executive.headOfStateId },
    { label: c?.headOfGovernmentTitle ?? "Head of government", id: c?.executive.headOfGovernmentId },
  ].filter((x) => x.id);

  return (
    <div className="stack">
      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Current office holders</div>
        {leaders.length ? leaders.map((l) => (
          <div key={l.id!} className="row" style={{ justifyContent: "space-between", padding: "3px 0" }}>
            <span className="dim">{l.label}</span>
            <span className="row" style={{ gap: 8 }}>
              <span className="mono" style={{ fontSize: 11 }}>{l.id}</span>
              <button className="btn btn--sm btn--danger" onClick={() => void run({ op: "ban-character", id: l.id, banned: true })}>Ban</button>
              <button className="btn btn--sm btn--danger" onClick={() => { if (confirm("Remove this character permanently?")) void run({ op: "delete-character", id: l.id }); }}>Delete</button>
            </span>
          </div>
        )) : <div className="dim">No office holders recorded.</div>}
      </section>

      <section className="card">
        <div className="row" style={{ marginBottom: 8 }}>
          <span className="eyebrow grow">Create a character</span>
          <select className="select" style={{ width: 220 }} value={iso} onChange={(e) => setIso(e.target.value)}>
            {list.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        </div>
        <div className="dev__grid">
          <label className="field"><span>Name</span><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Alexandra Reinholt" /></label>
          <label className="field"><span>Role</span>
            <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {["head-of-state", "head-of-government", "minister", "legislator", "judge", "party-leader", "general", "admiral", "central-banker", "business-leader", "board-member", "shareholder", "journalist", "activist"].map((r) => <option key={r} value={r}>{r.replace(/-/g, " ")}</option>)}
            </select>
          </label>
          {(["competence", "charisma", "integrity", "ambition", "ideology", "popularity", "experience", "militancy"] as const).map((k) => (
            <label key={k} className="field"><span>{k}</span>
              <input className="input mono" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
            </label>
          ))}
        </div>
        <div className="row row--wrap" style={{ gap: 6, marginTop: 8 }}>
          <button className="btn btn--sm btn--primary" onClick={() => void run({ op: "create-character", country: iso, ...form, ideology: Number(form.ideology), competence: Number(form.competence), charisma: Number(form.charisma), integrity: Number(form.integrity), ambition: Number(form.ambition), popularity: Number(form.popularity), experience: Number(form.experience), militancy: Number(form.militancy) })}>Create</button>
          <button className="btn btn--sm" onClick={() => void run({ op: "create-character", country: iso, ...form, asHeadOfGovernment: true, competence: Number(form.competence), charisma: Number(form.charisma), integrity: Number(form.integrity), ambition: Number(form.ambition), ideology: Number(form.ideology), popularity: Number(form.popularity), experience: Number(form.experience), militancy: Number(form.militancy) })}>Create as PM</button>
          <button className="btn btn--sm" onClick={() => void run({ op: "create-character", country: iso, ...form, asHeadOfState: true, competence: Number(form.competence), charisma: Number(form.charisma), integrity: Number(form.integrity), ambition: Number(form.ambition), ideology: Number(form.ideology), popularity: Number(form.popularity), experience: Number(form.experience), militancy: Number(form.militancy) })}>Create as monarch/president</button>
          <button className="btn btn--sm" onClick={() => void run({ op: "create-character", country: iso, ...form, asMinister: true, area: "economy", competence: Number(form.competence), charisma: Number(form.charisma), integrity: Number(form.integrity), ambition: Number(form.ambition), ideology: Number(form.ideology), popularity: Number(form.popularity), experience: Number(form.experience), militancy: Number(form.militancy) })}>Create as finance minister</button>
        </div>
      </section>
    </div>
  );
}

// ===========================================================================
// Diplomacy & war
// ===========================================================================

function Diplomacy({ run, countries }: { run: (op: Record<string, unknown>) => Promise<unknown>; countries: Record<string, Country> }) {
  const list = useMemo(() => Object.values(countries).filter((c) => !c.annexedBy).sort((a, b) => b.economy.gdp - a.economy.gdp), [countries]);
  const [a, setA] = useState("USA");
  const [b, setB] = useState("RUS");
  const [cause, setCause] = useState("Developer intervention");
  const [sanctionKind, setSanctionKind] = useState("financial");

  return (
    <div className="stack">
      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Declare war</div>
        <div className="row row--wrap" style={{ gap: 8 }}>
          <select className="select" style={{ width: 200 }} value={a} onChange={(e) => setA(e.target.value)}>{list.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
          <span className="dim">attacks</span>
          <select className="select" style={{ width: 200 }} value={b} onChange={(e) => setB(e.target.value)}>{list.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
        </div>
        <label className="field" style={{ marginTop: 10 }}><span>Casus belli</span><input className="input" value={cause} onChange={(e) => setCause(e.target.value)} /></label>
        <div className="row" style={{ gap: 6 }}>
          <button className="btn btn--danger" onClick={() => void run({ op: "declare-war", attacker: a, defender: b, cause })}>Declare war</button>
          <button className="btn" onClick={() => { if (confirm(`Annex ${countries[b]?.name} into ${countries[a]?.name}?`)) void run({ op: "annex", annexer: a, target: b, cause }); }}>Annex instead</button>
        </div>
      </section>

      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Sanctions</div>
        <div className="row row--wrap" style={{ gap: 8 }}>
          <select className="select" style={{ width: 200 }} value={a} onChange={(e) => setA(e.target.value)}>{list.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
          <span className="dim">sanctions on</span>
          <select className="select" style={{ width: 200 }} value={b} onChange={(e) => setB(e.target.value)}>{list.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
          <select className="select" style={{ width: 180 }} value={sanctionKind} onChange={(e) => setSanctionKind(e.target.value)}>
            {["embargo", "financial", "technology", "travel", "asset-freeze", "oil"].map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <button className="btn" onClick={() => void run({ op: "sanction", by: a, on: b, kind: sanctionKind })}>Impose</button>
        </div>
      </section>

      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Treaty</div>
        <div className="row row--wrap" style={{ gap: 8 }}>
          <select className="select" style={{ width: 200 }} value={a} onChange={(e) => setA(e.target.value)}>{list.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
          <select className="select" style={{ width: 200 }} value={b} onChange={(e) => setB(e.target.value)}>{list.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
          <select className="select" style={{ width: 180 }} id="treaty-kind" defaultValue="alliance">
            {["alliance", "non-aggression", "trade", "customs-union", "defensive-pact", "access", "lend-lease", "peace"].map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <button className="btn" onClick={() => {
            const kind = (document.getElementById("treaty-kind") as HTMLSelectElement).value;
            void run({ op: "treaty", kind, parties: [a, b], terms: ["Signed by arrangement of the parties"] });
          }}>Sign</button>
        </div>
      </section>

      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Relations: {countries[a]?.name} &rarr; {countries[b]?.name}</div>
        <div className="dev__grid">
          {list.slice(0, 12).map((x) => (
            <div key={x.id} className="dev__statline">
              <span className="kv__k truncate">{x.name}</span>
              <span className="mono">{Math.round(countries[a]?.relations[x.id] ?? 0)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Military({ run, countries }: { run: (op: Record<string, unknown>) => Promise<unknown>; countries: Record<string, Country> }) {
  const list = useMemo(() => Object.values(countries).filter((c) => !c.annexedBy).sort((a, b) => b.military.activeDuty - a.military.activeDuty), [countries]);
  const [iso, setIso] = useState("USA");
  const c = countries[iso];
  const MIL = [
    ["military.activeDuty", "Active duty"],
    ["military.reserves", "Reserves"],
    ["military.spend", "Annual spend"],
    ["military.readiness", "Readiness"],
    ["military.morale", "Morale"],
    ["military.doctrine", "Doctrine"],
    ["military.burden", "Burden"],
    ["military.branches.army.active", "Army personnel"],
    ["military.branches.army.quality", "Army quality"],
    ["military.branches.navy.active", "Navy personnel"],
    ["military.branches.air-force.active", "Air force personnel"],
    ["military.branches.nuclear.active", "Warheads"],
  ] as const;

  return (
    <div className="stack">
      <section className="card">
        <div className="row" style={{ marginBottom: 8 }}>
          <span className="eyebrow grow">Force</span>
          <select className="select" style={{ width: 240 }} value={iso} onChange={(e) => setIso(e.target.value)}>{list.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
        </div>
        {c && (
          <div className="dev__grid">
            {MIL.map(([p, label]) => (
              <div key={p}>
                <div className="row" style={{ justifyContent: "space-between", fontSize: 11 }}>
                  <span>{label}</span>
                  <span className="mono">{readPath(c, p).toFixed(0)}</span>
                </div>
                <div className="row" style={{ gap: 4 }}>
                  <input className="input mono" style={{ padding: "2px 5px", fontSize: 11 }} key={`${iso}-${p}`} defaultValue={readPath(c, p)} onBlur={(e) => { const n = Number(e.target.value); if (Number.isFinite(n) && n !== readPath(c, p)) void run({ op: "set-stat", scope: "country", id: iso, path: p, value: n }); }} />
                  <button className="btn btn--sm" onClick={() => { const n = Number(prompt(`Set ${label}`, String(readPath(c, p)))); if (Number.isFinite(n)) void run({ op: "set-stat", scope: "country", id: iso, path: p, value: n }); }}>Set</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Entities({ run, countries }: { run: (op: Record<string, unknown>) => Promise<unknown>; countries: Record<string, Country> }) {
  const list = useMemo(() => Object.values(countries), [countries]);
  const [q, setQ] = useState("");
  const filtered = list.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.id.toLowerCase().includes(q.toLowerCase()));
  const [reason, setReason] = useState("Abolished by developer");
  return (
    <div className="stack">
      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Remove or restore countries</div>
        <label className="field"><span>Reason recorded in the event log</span><input className="input" value={reason} onChange={(e) => setReason(e.target.value)} /></label>
        <input className="input" placeholder="Filter countries" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 8 }} />
        <DataTable
          rows={filtered}
          rowKey={(c) => c.id}
          maxHeight={460}
          columns={[
            { id: "n", label: "Country", render: (c) => <span className="row" style={{ gap: 5 }}><span>{c.flagEmoji}</span><span className="truncate">{c.name}</span>{c.annexedBy && <Chip tone="var(--negative)">abolished</Chip>}{c.overlord && <Chip>possession</Chip>}</span> },
            { id: "g", label: "GDP", right: true, render: (c) => <span className="mono dim">{credits(c.economy.gdp)}</span>, sort: (a, b) => b.economy.gdp - a.economy.gdp },
            {
              id: "r",
              label: "",
              right: true,
              render: (c) => c.annexedBy
                ? <button className="btn btn--sm" onClick={() => void run({ op: "restore-country", id: c.id })}>Restore</button>
                : <button className="btn btn--sm btn--danger" onClick={() => { if (confirm(`Abolish ${c.name}? This dissolves its legislature, parties and companies.`)) void run({ op: "remove-country", id: c.id, by: "INT", reason }); }}>Abolish</button>,
            },
          ]}
        />
      </section>
    </div>
  );
}

// ===========================================================================
// Rules + directives
// ===========================================================================

type PresetRule = { label: string; rule: Omit<CustomRule, "id" | "fired" | "log" | "createdAt" | "createdBy"> & { id?: string } };

const PRESET_RULES: PresetRule[] = [
  {
    label: "Debt brake: any state above 150% debt/GDP stops borrowing",
    rule: {
      id: "", name: "Debt brake", enabled: true, priority: 10, maxFires: -1, cooldownMs: 60_000,
      trigger: { type: "interval", intervalSeconds: 3600, conditions: [{ id: "c1", scope: "any-country", path: "economy.fiscal.debtToGdp", op: ">", value: 1.5 }] },
      actions: [{ id: "a1", type: "set", scope: "country", path: "economy.fiscal.expenditure", value: 0 }],
    },
  },
  {
    label: "Sovereign write-off above 200% debt/GDP",
    rule: {
      id: "", name: "Sovereign write-off", enabled: true, priority: 5, maxFires: -1, cooldownMs: 300_000,
      trigger: { type: "interval", intervalSeconds: 3600, conditions: [{ id: "c1", scope: "any-country", path: "economy.fiscal.debtToGdp", op: ">", value: 2 }] },
      actions: [{ id: "a1", type: "set", scope: "country", path: "economy.fiscal.debt", value: 0 }],
    },
  },
  {
    label: "Martial law when inflation exceeds 50%",
    rule: {
      id: "", name: "Martial law on hyperinflation", enabled: true, priority: 20, maxFires: -1, cooldownMs: 600_000,
      trigger: { type: "interval", intervalSeconds: 1800, conditions: [{ id: "c1", scope: "any-country", path: "economy.monetary.inflation", op: ">", value: 0.5 }] },
      actions: [
        { id: "a1", type: "set", scope: "country", path: "executive.emergencyPowers", value: 1 },
        { id: "a2", type: "log", message: "Emergency powers invoked: hyperinflation threshold breached" },
      ],
    },
  },
  {
    label: "Emergency rate cuts when unemployment passes 12%",
    rule: {
      id: "", name: "Emergency rate cuts", enabled: true, priority: 15, maxFires: -1, cooldownMs: 120_000,
      trigger: { type: "interval", intervalSeconds: 900, conditions: [{ id: "c1", scope: "any-country", path: "economy.labour.unemployment", op: ">", value: 0.12 }] },
      actions: [{ id: "a1", type: "set", scope: "country", path: "economy.monetary.policyRate", value: 0.005 }],
    },
  },
];

function Rules({ run, directives }: { run: (op: Record<string, unknown>) => Promise<unknown>; directives: WorldDirective[] }) {
  const rules = directives.filter((d) => d.kind === "custom-rule");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  return (
    <div className="stack">
      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Preset rules</div>
        <div className="stack">
          {PRESET_RULES.map((p) => (
            <div key={p.label} className="row" style={{ borderBottom: "1px solid var(--rule)", padding: "6px 0" }}>
              <span className="grow" style={{ fontSize: 12 }}>{p.label}</span>
              <button className="btn btn--sm" onClick={() => void run({ op: "add-rule", rule: { ...p.rule, name: p.rule.name, createdBy: "developer" } })}>Install</button>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Author a rule</div>
        <div className="dev__grid">
          <label className="field"><span>Name</span><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rule name" /></label>
          <label className="field"><span>Interval (seconds)</span><input className="input mono" defaultValue="3600" id="rule-interval" /></label>
        </div>
        <label className="field">
          <span>Trigger condition &mdash; a path, an operator and a value. One rule per line, use <code>;</code> for AND.</span>
          <input className="input mono" placeholder="economy.gdpGrowth &lt; -0.05" id="rule-condition" />
        </label>
        <label className="field">
          <span>Actions &mdash; console commands executed when the condition holds.</span>
          <textarea className="textarea" rows={4} value={code} onChange={(e) => setCode(e.target.value)} placeholder="grant(USA, 1e11)&#10;log(Released emergency funds)" />
        </label>
        <button className="btn btn--sm btn--primary" onClick={() => {
          const cond = (document.getElementById("rule-condition") as HTMLInputElement).value.trim();
          const interval = Number((document.getElementById("rule-interval") as HTMLInputElement).value || 3600);
          if (!cond) return;
          const m = cond.match(/^([A-Za-z0-9_.]+)\s*(>=|<=|>|<|==|!=)\s*(.+)$/);
          if (!m) return;
          const op = m[2];
          void run({
            op: "add-rule",
            rule: {
              id: "", name: name || "Custom rule", enabled: true, priority: 0, maxFires: -1, cooldownMs: 60_000,
              trigger: { type: "interval", intervalSeconds: interval, conditions: [{ id: "c1", scope: "any-country", path: m[1], op: op as never, value: Number(m[3]) }] },
              actions: code.split("\n").filter(Boolean).map((line, i) => ({ id: `a${i}`, type: "custom-script" as const, expression: line.trim() })),
              createdBy: "developer",
            },
          });
        }}>Install rule</button>
      </section>

      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Installed rules ({rules.length})</div>
        <DataTable
          rows={rules.map((d) => d as Extract<WorldDirective, { kind: "custom-rule" }>)}
          rowKey={(d) => d.rule.id}
          empty="No rules installed"
          maxHeight={300}
          columns={[
            { id: "n", label: "Rule", render: (d) => <span className="truncate">{d.rule.name}</span> },
            { id: "c", label: "Condition", render: (d) => <span className="mono dim truncate">{d.rule.trigger.conditions.map((c) => `${c.path} ${c.op} ${c.value}`).join("; ") || "always"}</span> },
            { id: "f", label: "Fired", right: true, render: (d) => <span className="mono">{d.rule.fired}</span> },
            { id: "e", label: "Enabled", right: true, render: (d) => <button className="btn btn--sm" onClick={() => void run({ op: "toggle-rule", id: d.rule.id, enabled: !d.rule.enabled })}>{d.rule.enabled ? "On" : "Off"}</button> },
            { id: "x", label: "", right: true, render: (d) => <button className="btn btn--sm btn--danger" onClick={() => void run({ op: "remove-rule", id: d.rule.id })}>Remove</button> },
          ]}
        />
        {rules.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>Recent activity</div>
            <div className="dev__console" style={{ minHeight: 100 }}>
              {rules.flatMap((d) => (d as Extract<WorldDirective, { kind: "custom-rule" }>).rule.log.slice(0, 4)).slice(0, 12).map((l, i) => (
                <span key={i} className="dev__console-line">{l.message}{"\n"}</span>
              ))}
              {!rules.some((d) => (d as Extract<WorldDirective, { kind: "custom-rule" }>).rule.log.length) && <span className="dev__console-line dim">No rules have fired yet.</span>}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Directives({ run, directives }: { run: (op: Record<string, unknown>) => Promise<unknown>; directives: WorldDirective[] }) {
  const [scope, setScope] = useState<"country" | "company" | "global">("country");
  const [target, setTarget] = useState("USA");
  const [path, setPath] = useState("economy.gdp");
  const [value, setValue] = useState("5e13");
  const [blend, setBlend] = useState(1);
  const [note, setNote] = useState("");

  const other = directives.filter((d) => d.kind !== "custom-rule");

  return (
    <div className="stack">
      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>New directive</div>
        <div className="dim" style={{ fontSize: 11.5, marginBottom: 10 }}>
          A directive is re-applied on every tick, after the simulation step. A blend of 1 pins the value exactly;
          anything lower eases toward it. This is how you keep a value forced permanently.
        </div>
        <div className="dev__grid">
          <label className="field"><span>Scope</span>
            <select className="select" value={scope} onChange={(e) => setScope(e.target.value as never)}>
              <option value="country">Country</option>
              <option value="company">Company</option>
              <option value="global">World</option>
            </select>
          </label>
          <label className="field"><span>Target</span><input className="input mono" value={target} onChange={(e) => setTarget(e.target.value)} /></label>
          <label className="field"><span>Path</span><input className="input mono" value={path} onChange={(e) => setPath(e.target.value)} /></label>
          <label className="field"><span>Value</span><input className="input mono" value={value} onChange={(e) => setValue(e.target.value)} /></label>
          <label className="field"><span>Blend (1 = hard pin)</span><input className="input mono" value={blend} onChange={(e) => setBlend(Number(e.target.value))} /></label>
          <label className="field"><span>Note</span><input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why this exists" /></label>
        </div>
        <button className="btn btn--sm btn--primary" onClick={() => {
          void run({
            op: "add-directive",
            directive: { kind: "set-stat", target: scope, targetId: target, path, value: Number(value), blend, enabled: true, note: note || `${path} pinned` },
          });
        }}>Install directive</button>
      </section>

      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Active directives ({other.length})</div>
        <DataTable
          rows={other}
          rowKey={(d) => d.id}
          empty="No directives"
          maxHeight={360}
          columns={[
            { id: "k", label: "Kind", render: (d) => d.kind.replace(/-/g, " ") },
            { id: "t", label: "Target", render: (d) => ("targetId" in d ? d.targetId : "-") },
            { id: "p", label: "Path", render: (d) => <span className="mono dim">{"path" in d ? d.path : "-"}</span> },
            { id: "v", label: "Value", right: true, render: (d) => "value" in d ? <span className="mono">{d.value}</span> : <span className="dim">frozen</span> },
            { id: "n", label: "Note", render: (d) => <span className="dim truncate">{d.note}</span> },
            { id: "e", label: "On", right: true, render: (d) => <button className="btn btn--sm" onClick={() => void run({ op: "toggle-directive", id: d.id, enabled: !d.enabled })}>{d.enabled ? "On" : "Off"}</button> },
            { id: "x", label: "", right: true, render: (d) => <button className="btn btn--sm btn--danger" onClick={() => void run({ op: "remove-directive", id: d.id })}>Remove</button> },
          ]}
        />
      </section>
    </div>
  );
}

function Moderation({ run, countries }: { run: (op: Record<string, unknown>) => Promise<unknown>; countries: Record<string, Country> }) {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [reason, setReason] = useState("");
  return (
    <div className="stack">
      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Kick a player from this world</div>
        <div className="dev__grid">
          <label className="field"><span>User id</span><input className="input mono" value={userId} onChange={(e) => setUserId(e.target.value)} /></label>
          <label className="field"><span>Username</span><input className="input" value={username} onChange={(e) => setUsername(e.target.value)} /></label>
          <label className="field"><span>Reason</span><input className="input" value={reason} onChange={(e) => setReason(e.target.value)} /></label>
        </div>
        <button className="btn btn--danger" onClick={() => void run({ op: "kick", userId, username, reason })}>Kick now</button>
        <div className="dim" style={{ fontSize: 11, marginTop: 8 }}>
          Bans, mutes and permanent account sanctions are issued from the staff API and apply across every world.
        </div>
      </section>
      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>World at a glance</div>
        <div className="dev__grid">
          {Object.values(countries).filter((c) => c.wars.length > 0).map((c) => (
            <div key={c.id} className="row" style={{ justifyContent: "space-between" }}>
              <span className="truncate">{c.name}</span>
              <span className="mono neg">{c.wars.length} war{c.wars.length === 1 ? "" : "s"}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Capabilities({ user }: { user: User }) {
  const groups = [...new Set(Object.keys(user.capabilities).length ? [] : [])];
  void groups;
  return (
    <div className="stack">
      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Your account</div>
        <div className="dev__statline"><span className="kv__k">Username</span><span className="mono">{user.username}</span></div>
        <div className="dev__statline"><span className="kv__k">Role</span><span className="mono">{user.staffRole}</span></div>
        <div className="dev__statline"><span className="kv__k">Capabilities</span><span className="mono">{user.capabilities.length}</span></div>
      </section>
      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Granted capabilities</div>
        <div className="dev__grid">
          {user.capabilities.map((c) => <Chip key={c}>{c}</Chip>)}
        </div>
      </section>
      <section className="card">
        <div className="eyebrow" style={{ marginBottom: 8 }}>What each one unlocks</div>
        <div className="stack">
          {user.capabilities.map((c) => (
            <div key={c} className="row" style={{ justifyContent: "space-between", fontSize: 11.5, borderBottom: "1px solid var(--rule)", padding: "3px 0" }}>
              <span className="mono">{c}</span>
              <span className="dim truncate" style={{ marginLeft: 12 }}>{(window as never as { __capLabels?: Record<string, string> }).__capLabels?.[c] ?? ""}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export { money, pct, pct0 };