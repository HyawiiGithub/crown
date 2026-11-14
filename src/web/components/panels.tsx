import { useEffect, useMemo, useState } from "react";
import type { BudgetPlan, Character, Company, Country, MarketState, SectorId, Sanction, TaxPolicy, Treaty, War } from "../../shared/types";
import { SECTORS, COMMODITY_LABELS } from "../../data/economy";
import { COUNTRY_BY_ISO3 } from "../../data/countries";
import { frontOccupation, occupiedShare, peaceAccepted, peaceCost, peaceStanding } from "../../sim/occupation";
import { frontRing } from "./Map";
import { act, can, useStore } from "../store";
import { credits, money, pct, pct0, people, signedPct, GOVERNMENT_LABELS, deltaClass, simDate, YEAR } from "../format";
import { Bar, Chip, DataTable, Empty, Panel, Spark, Stat, Tabs } from "./primitives";

// ===========================================================================
// Flags: real flags for modern states, a colour chip for historical polities,
// because today's flag on the 1900 German Empire would simply be wrong.
// ===========================================================================

export function Flag({ c, size = 18 }: { c: Pick<Country, "id" | "mapColor" | "name">; size?: number }) {
  const iso2 = COUNTRY_BY_ISO3[c.id]?.iso2;
  if (iso2) {
    return <img src={`https://flagcdn.com/w40/${iso2.toLowerCase()}.png`} alt="" width={size * 1.4} height={size} style={{ objectFit: "cover", borderRadius: 2, flex: "none" }} onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />;
  }
  return <span aria-hidden style={{ width: size * 1.4, height: size, background: c.mapColor, borderRadius: 2, flex: "none", display: "inline-block", border: "1px solid var(--rule)" }} />;
}

const BILL_SETTLED = new Set(["enacted", "rejected", "expired"]);

/** The floor of every legislature you can see, updating as the vote comes in. */
export function VoteTray() {
  const bills = useStore((s) => s.bills);
  const countries = useStore((s) => s.countries);
  const [hidden, setHidden] = useState<Record<string, true>>({});
  const [open, setOpen] = useState(() => typeof window === "undefined" || window.innerWidth > 1080);
  const live = useMemo(() => Object.values(bills).filter((b) => !BILL_SETTLED.has(b.status) && !hidden[b.id]), [bills, hidden]);
  if (!live.length) return null;
  return (
    <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 20, display: "grid", gap: 8, justifyItems: "end", maxWidth: "min(360px, 92vw)" }}>
      <button className="btn btn--sm" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? "Hide votes" : "On the floor"} <span className="badge">{live.length}</span>
      </button>
      {open && (
        <div className="card" style={{ display: "grid", gap: 10, width: "min(330px, 92vw)", maxHeight: "42vh", overflow: "auto" }}>
          {live.slice(0, 5).map((b) => {
            const t = Object.values(b.tallies)[0];
            const total = t ? t.aye + t.nay + t.abstain + t.absent : 0;
            return (
              <div key={b.id} style={{ display: "grid", gap: 4 }}>
                <div className="row" style={{ gap: 6 }}>
                  <strong className="grow truncate" style={{ fontSize: 12 }}>{b.title}</strong>
                  <button className="btn btn--sm" title="Dismiss" onClick={() => setHidden((h) => ({ ...h, [b.id]: true }))}>&times;</button>
                </div>
                <div className="dim" style={{ fontSize: 11 }}>{countries[b.country]?.name ?? b.country} · {b.status}</div>
                <Bar value={total ? t.aye / total : 0} />
                <div className="mono dim" style={{ fontSize: 11 }}>{t ? `${t.aye} aye · ${t.nay} nay · ${t.abstain} abstain` : "awaiting a division"}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
function charName(characters: Record<string, Character>, id?: string): string {
  return id && characters[id] ? characters[id].name : "Unnamed official";
}

const TAX_FIELDS: { key: keyof TaxPolicy; label: string; hint: string; max: number }[] = [
  { key: "income", label: "Income tax", hint: "Falls on wages. High rates shrink the labour force and invite evasion.", max: 0.7 },
  { key: "payroll", label: "Payroll tax", hint: "Paid on every job. Funds welfare; discourages hiring.", max: 0.4 },
  { key: "corporate", label: "Corporate tax", hint: "Comes out of firm profits. Lower investment and share prices if high.", max: 0.6 },
  { key: "vat", label: "VAT / excise", hint: "A tax on consumption. Hits working households hardest.", max: 0.3 },
  { key: "tariff", label: "Tariffs", hint: "Raises money and protects industry, at the cost of trade and higher prices.", max: 0.8 },
  { key: "royalty", label: "Resource royalty", hint: "A share of mining and extraction output.", max: 0.9 },
];

const BUDGET_FIELDS: { key: keyof BudgetPlan; label: string; hint: string }[] = [
  { key: "defence", label: "Defence", hint: "Buys armies. Also demand for the defence industry." },
  { key: "welfare", label: "Welfare", hint: "Pensions and transfers. Lifts the working class, cuts inequality, raises the NAIRU slightly." },
  { key: "health", label: "Health", hint: "Hospitals and care. Demand for the healthcare sector." },
  { key: "education", label: "Education", hint: "Raises long-run productivity and lowers the NAIRU, slowly." },
  { key: "infrastructure", label: "Infrastructure", hint: "Roads, grids, ports. Lifts potential growth." },
  { key: "science", label: "Science", hint: "Public research. The strongest long-run growth lever." },
  { key: "administration", label: "Administration", hint: "The civil service. Helps against corruption." },
  { key: "subsidies", label: "Industry subsidies", hint: "General support for business." },
];

// ===========================================================================
// Country panel
// ===========================================================================

export function CountryPanel({ country }: { country: Country | null }) {
  const player = useStore((s) => s.playerCountry);
  const [tab, setTab] = useState("overview");
  const c = country;
  if (!c) return <Empty>Select a country on the map</Empty>;
  const mine = c.id === player;
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "charts", label: "Charts" },
    { id: "budget", label: "Budget" },
    { id: "bank", label: "Money" },
    { id: "sectors", label: "Sectors" },
    { id: "people", label: "People" },
    { id: "firms", label: "Firms" },
    { id: "trade", label: "Trade" },
    { id: "politics", label: "Politics" },
    { id: "world", label: "Foreign" },
    { id: "military", label: "Military" },
  ];
  return (
    <>
      <header className="pad" style={{ borderBottom: "1px solid var(--rule)" }}>
        <div className="row">
          <Flag c={c} size={22} />
          <div className="grow" style={{ minWidth: 0 }}>
            <h2 style={{ fontSize: 18 }} className="truncate">{c.name}</h2>
            <div className="dim" style={{ fontSize: 11 }}>{GOVERNMENT_LABELS[c.government] ?? c.government}{c.overlord ? " · protectorate" : ""}</div>
          </div>
          {mine && <Chip tone="var(--accent-2)">You</Chip>}
          {c.wars.length > 0 && <Chip tone="var(--negative)">At war</Chip>}
          {c.annexedBy && <Chip tone="var(--negative)">Abolished</Chip>}
        </div>
      </header>
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <div className="scroll pad grow" style={{ minHeight: 0 }}>
        {tab === "overview" && <Overview c={c} mine={mine} />}
        {tab === "charts" && <Charts c={c} />}
        {tab === "budget" && <Budget c={c} mine={mine} />}
        {tab === "bank" && <Bank c={c} mine={mine} />}
        {tab === "sectors" && <Sectors c={c} mine={mine} />}
        {tab === "people" && <People c={c} mine={mine} />}
        {tab === "firms" && <Firms c={c} mine={mine} />}
        {tab === "trade" && <Trade c={c} mine={mine} />}
        {tab === "politics" && <Politics c={c} mine={mine} />}
        {tab === "world" && <Foreign c={c} mine={mine} />}
        {tab === "military" && <Military c={c} mine={mine} />}
      </div>
    </>
  );
}

function Overview({ c, mine }: { c: Country; mine: boolean }) {
  const characters = useStore((s) => s.characters);
  const wars = useStore((s) => s.wars);
  const countries = useStore((s) => s.countries);
  const start = useStore((s) => s.scenario?.startDate);
  const e = c.economy;
  const m = e.macro;
  const a = e.accounts;
  const alerts: string[] = [];
  if (e.monetary.inflation > 0.1) alerts.push(`Inflation is ${pct(e.monetary.inflation)}.`);
  if (e.labour.unemployment > 0.1) alerts.push(`Unemployment is ${pct(e.labour.unemployment)}.`);
  if (m.riskPremium > 0.05) alerts.push(`Bond markets charge a ${pct(m.riskPremium)} risk premium.`);
  if (m.defaulted) alerts.push("The state is in default.");
  const occupied = occupiedShare(c, wars, countries);
  if (occupied >= 0.005) alerts.push(`${(occupied * 100).toFixed(1)}% of the country is under enemy control.`);
  if (m.npl > 0.1) alerts.push(`Bad loans have reached ${pct0(m.npl)} of lending.`);
  if (c.executive.approval < 30) alerts.push(`Approval is down to ${pct0(c.executive.approval / 100)}.`);
  const hist = e.history;
  return (
    <div className="stack">
      <div className="card">
        <Stat label={c.executive.headOfStateTitle} value={<span className="ink-text">{charName(characters, c.executive.headOfStateId)}</span>} />
        {c.executive.headOfGovernmentId && c.executive.headOfGovernmentId !== c.executive.headOfStateId && <Stat label={c.executive.headOfGovernmentTitle} value={<span className="ink-text">{charName(characters, c.executive.headOfGovernmentId)}</span>} />}
        <Stat label="Approval" value={pct0(c.executive.approval / 100)} tone={c.executive.approval >= 45 ? "pos" : "neg"} />
        {c.nextElectionAt !== undefined && start && <Stat label="Next election" value={simDate(start, c.nextElectionAt).slice(0, 7)} />}
      </div>
      {alerts.length > 0 && (
        <div className="card" style={{ borderColor: "var(--negative)" }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Warnings</div>
          {alerts.map((x) => <div key={x} style={{ fontSize: 12 }}>{x}</div>)}
        </div>
      )}
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Headline</div>
        <Stat label="GDP" value={`$${credits(e.gdp)}`} />
        <Stat label="GDP per person" value={`$${money(e.gdpPerCapita, 0)}`} />
        <Stat label="Real growth" value={signedPct(e.gdpGrowth, 1)} tone={e.gdpGrowth >= 0 ? "pos" : "neg"} />
        <Stat label="Inflation" value={signedPct(e.monetary.inflation, 1)} tone={e.monetary.inflation > 0.05 ? "neg" : ""} />
        <Stat label="Unemployment" value={pct(e.labour.unemployment)} tone={e.labour.unemployment > 0.08 ? "neg" : ""} />
        <Stat label="Output gap" value={signedPct(m.outputGap, 1)} hint="How far GDP is above or below what the economy can sustain." />
        <Stat label="Population" value={people(e.population)} />
        <Stat label="Debt / GDP" value={pct0(e.fiscal.debtToGdp)} tone={e.fiscal.debtToGdp > 1 ? "neg" : ""} />
        <Stat label="Budget balance" value={signedPct(e.fiscal.budgetBalanceRatio, 1)} tone={e.fiscal.budgetBalanceRatio >= -0.03 ? "" : "neg"} />
      </div>
      {hist.length > 2 ? (
        <div className="spark-grid">
          <Spark title="GDP" values={hist.map((h) => h.gdp)} format={(v) => `$${credits(v)}`} />
          <Spark title="Real growth" values={hist.map((h) => h.gdpGrowth)} format={(v) => signedPct(v, 1)} zero />
          <Spark title="Inflation" values={hist.map((h) => h.inflation)} format={(v) => signedPct(v, 1)} zero />
          <Spark title="Unemployment" values={hist.map((h) => h.unemployment)} format={(v) => pct(v)} />
          <Spark title="Debt / GDP" values={hist.map((h) => h.debtToGdp)} format={(v) => pct0(v)} />
        </div>
      ) : (
        <div className="dim" style={{ fontSize: 11 }}>{mine ? "Charts appear after the first simulated month." : "History builds as the game runs."}</div>
      )}
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>National accounts (Y = C + I + G + X - M)</div>
        {([["Consumption", a.consumption], ["Investment", a.investment], ["Government", a.government], ["Exports", a.exports]] as [string, number][]).map(([label, v]) => (
          <div key={label}>
            <div className="row" style={{ justifyContent: "space-between", fontSize: 11.5 }}><span className="dim">{label}</span><span className="mono">${credits(v)} · {pct0(v / e.gdp)}</span></div>
            <Bar value={v} max={e.gdp} />
          </div>
        ))}
        <div className="row" style={{ justifyContent: "space-between", fontSize: 11.5, marginTop: 4 }}><span className="dim">Imports (subtracted)</span><span className="mono">-${credits(a.imports)} · {pct0(a.imports / e.gdp)}</span></div>
        <Stat label="Potential growth" value={signedPct(m.potentialGrowth, 1)} hint="The growth the supply side can sustain: capital, workers and productivity." />
        <Stat label="Productivity growth (TFP)" value={signedPct(m.tfpGrowth, 1)} />
        <Stat label="Capital stock" value={`$${credits(m.capital * m.priceLevel / e.monetary.exchangeRateVsUsd)}`} />
        <Stat label="Consumer confidence" value={m.consumerConfidence.toFixed(0)} />
        <Stat label="Business confidence" value={m.businessConfidence.toFixed(0)} />
      </div>
      <div className="row" style={{ gap: 6 }}>
        <span className="dim" style={{ fontSize: 11 }}>Corruption {pct0(e.corruption)} · Inequality (Gini) {e.inequality.toFixed(2)} · Cohesion {c.cohesion.toFixed(0)}</span>
      </div>
      {!mine && <ChangeCountry c={c} />}
    </div>
  );
}

type HistoryPoint = Country["economy"]["history"][number];

const CHART_GROUPS: { title: string; charts: { title: string; get: (h: HistoryPoint) => number | undefined; format: (v: number) => string; zero?: boolean }[] }[] = [
  { title: "Output", charts: [
    { title: "GDP", get: (h) => h.gdp, format: (v) => `$${credits(v)}` },
    { title: "GDP per person", get: (h) => h.gdpPerCapita, format: (v) => `$${money(v, 0)}` },
    { title: "Real growth", get: (h) => h.gdpGrowth, format: (v) => signedPct(v, 1), zero: true },
    { title: "Population", get: (h) => h.population, format: (v) => credits(v) },
  ] },
  { title: "Prices and money", charts: [
    { title: "Inflation", get: (h) => h.inflation, format: (v) => signedPct(v, 1), zero: true },
    { title: "Policy rate", get: (h) => h.policyRate, format: (v) => pct(v, 2), zero: true },
    { title: "Bond yield", get: (h) => h.bondYield, format: (v) => pct(v, 2) },
    { title: "Currency per USD (start = 1)", get: (h) => h.exchangeRate, format: (v) => money(v, 3) },
  ] },
  { title: "Public finances", charts: [
    { title: "Debt / GDP", get: (h) => h.debtToGdp, format: (v) => pct0(v) },
    { title: "Budget balance / GDP", get: (h) => h.budgetBalance, format: (v) => signedPct(v, 1), zero: true },
    { title: "Military spending", get: (h) => h.militarySpend, format: (v) => `$${credits(v)}` },
  ] },
  { title: "People and politics", charts: [
    { title: "Unemployment", get: (h) => h.unemployment, format: (v) => pct(v) },
    { title: "Median wage", get: (h) => h.medianWage, format: (v) => `$${money(v, 0)}` },
    { title: "Government approval", get: (h) => h.approval, format: (v) => `${v.toFixed(0)}%` },
  ] },
  { title: "Trade and markets", charts: [
    { title: "Trade balance / GDP", get: (h) => h.tradeBalance, format: (v) => signedPct(v, 1), zero: true },
    { title: "Stock index", get: (h) => (h.stockIndex > 0 ? h.stockIndex : undefined), format: (v) => v.toFixed(0) },
  ] },
];

function Charts({ c }: { c: Country }) {
  const start = useStore((s) => s.scenario?.startDate);
  const [months, setMonths] = useState(0);
  const all = c.economy.history;
  const hist = months ? all.slice(-months) : all;
  if (all.length < 2) return <Empty>Charts build up as the game runs. Start the clock and they fill in within a month or two.</Empty>;
  return (
    <div className="stack">
      <div className="row" style={{ gap: 4 }}>
        {([[12, "1y"], [60, "5y"], [120, "10y"], [0, "All"]] as [number, string][]).map(([n, label]) => <button key={label} className={`btn btn--sm ${months === n ? "btn--active" : ""}`} onClick={() => setMonths(n)}>{label}</button>)}
      </div>
      {CHART_GROUPS.map((g) => {
        const charts = g.charts.map((chart) => ({ chart, rows: hist.filter((h) => Number.isFinite(chart.get(h))) })).filter((x) => x.rows.length > 1);
        if (!charts.length) return null;
        return (
          <section key={g.title}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>{g.title}</div>
            <div className="spark-grid">
              {charts.map(({ chart, rows }) => <Spark key={chart.title} title={chart.title} zero={chart.zero} format={chart.format} values={rows.map((h) => chart.get(h) as number)} labels={start ? rows.map((h) => simDate(start, h.t).slice(0, 7)) : undefined} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ChangeCountry({ c }: { c: Country }) {
  const player = useStore.getState().playerCountry;
  return (
    <>
      {c.id !== player && (
        <div className="row row--wrap" style={{ gap: 4, marginTop: 8, alignItems: "center" }}>
          <span className="mono dim" style={{ fontSize: 10.5, letterSpacing: ".08em" }}>SEND AID</span>
          {[0.005, 0.02, 0.05].map((s) => (
            <button key={s} className="btn btn--sm" title={`Grant ${(s * 100).toFixed(1)}% of your GDP, borrowed`} onClick={() => void act({ type: "send-aid", target: c.id, share: s })}>
              {(s * 100).toFixed(1)}% GDP
            </button>
          ))}
        </div>
      )}
      <button className="btn btn--sm" onClick={() => { if (confirm(`Stop governing your current country and take over ${c.name}?`)) void act({ type: "choose-country", country: c.id }); }}>Govern {c.name} instead</button>
    </>
  );
}

function RateSlider({ label, value, max, step = 0.001, hint, disabled, onChange }: { label: string; value: number; max: number; step?: number; hint?: string; disabled?: boolean; onChange: (v: number) => void }) {
  return (
    <label className="slider" title={hint}>
      <span className="row" style={{ justifyContent: "space-between", fontSize: 12 }}>
        <span>{label}</span>
        <span className="mono">{(value * 100).toFixed(1)}%</span>
      </span>
      <input type="range" min={0} max={max} step={step} value={value} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function Budget({ c, mine }: { c: Country; mine: boolean }) {
  const e = c.economy;
  const f = e.fiscal;
  const [tax, setTax] = useState<Partial<TaxPolicy>>({});
  const [budget, setBudget] = useState<Partial<BudgetPlan>>({});
  const bills = useStore((s) => s.bills);
  const pending = Object.values(bills).filter((b) => b.country === c.id && (b.status === "introduced" || b.status === "in-committee"));
  const dirty = Object.keys(tax).length + Object.keys(budget).length > 0;

  const curTax = { ...e.tax, ...tax };
  const curBudget = { ...e.budget, ...budget };
  // A first-round estimate only; the real answer comes out of the simulation.
  const revenueDelta = (Object.keys(tax) as (keyof TaxPolicy)[]).reduce((a, k) => {
    const base = k === "income" || k === "payroll" ? e.gdp * 0.44 : k === "corporate" ? e.gdp * 0.21 : k === "vat" ? e.accounts.consumption * 0.8 : k === "tariff" ? e.accounts.imports * 0.85 : (e.sectors.find((s) => s.id === "mining")?.output ?? 0);
    return a + ((tax[k] ?? 0) - e.tax[k]) * base;
  }, 0);
  const spendDelta = (Object.keys(budget) as (keyof BudgetPlan)[]).reduce((a, k) => a + ((budget[k] ?? 0) - e.budget[k]) * e.gdp, 0);
  const projected = f.budgetBalanceRatio + (revenueDelta - spendDelta) / e.gdp;
  const spending = f.expenditure || 1;
  const decree = mine && !c.legislature;

  return (
    <div className="stack">
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Public finances</div>
        <Stat label="Revenue" value={`$${credits(f.revenue)} · ${pct0(f.revenue / e.gdp)}`} />
        <Stat label="Spending" value={`$${credits(f.expenditure)} · ${pct0(f.expenditure / e.gdp)}`} />
        <Stat label="Balance" value={`${signedPct(f.budgetBalanceRatio, 1)} of GDP`} tone={f.budgetBalanceRatio >= -0.03 ? "pos" : "neg"} />
        <Stat label="Debt" value={`$${credits(f.debt)} · ${pct0(f.debtToGdp)}`} />
        <Stat label="Interest bill" value={`$${credits(f.debtService)} · ${pct0(f.debtService / Math.max(1, f.revenue))} of revenue`} />
        <Stat label="10-year bond yield" value={pct(e.macro.bondYield, 2)} />
        <Stat label="Credit rating" value={ratingLabel(f.creditRating)} tone={f.creditRating > 0.6 ? "pos" : "neg"} />
      </div>
      <Panel title="Revenue by source">
        {([["Income and payroll", f.taxIncome], ["Corporate", f.corporateTax], ["VAT / excise", f.vat], ["Tariffs", f.tariffs], ["Resources", f.resourceRent]] as [string, number][]).map(([l, v]) => (
          <div key={l}><div className="row" style={{ justifyContent: "space-between", fontSize: 11.5 }}><span className="dim">{l}</span><span className="mono">${credits(v)}</span></div><Bar value={v} max={f.revenue || 1} /></div>
        ))}
      </Panel>
      <Panel title={mine ? "Tax rates" : "Tax rates"}>
        {TAX_FIELDS.map((x) => <RateSlider key={x.key} label={x.label} hint={x.hint} value={curTax[x.key]} max={x.max} disabled={!mine} onChange={(v) => setTax({ ...tax, [x.key]: v })} />)}
      </Panel>
      <Panel title="Spending, % of GDP">
        {BUDGET_FIELDS.map((x) => <RateSlider key={x.key} label={x.label} hint={x.hint} value={curBudget[x.key]} max={Math.max(0.05, e.macro.baseBudget[x.key] * 4, 0.15)} step={0.0005} disabled={!mine} onChange={(v) => setBudget({ ...budget, [x.key]: v })} />)}
        <div className="dim" style={{ fontSize: 11, marginTop: 6 }}>Interest of ${credits(f.debtService)} is paid on top and cannot be cut, short of a default.</div>
        <div style={{ fontSize: 11, marginTop: 2 }}><span className="dim">Share of total spending: </span><span className="mono">defence {pct0(f.military / spending)}, welfare {pct0(f.welfare / spending)}, health {pct0(f.healthcare / spending)}, education {pct0(f.education / spending)}</span></div>
      </Panel>
      {mine && (
        <div className="card sticky-actions">
          <Stat label="Estimated balance after changes" value={`${signedPct(projected, 1)} of GDP`} tone={projected >= -0.03 ? "pos" : "neg"} />
          <div className="row" style={{ gap: 6, marginTop: 6 }}>
            <button className="btn btn--primary grow" disabled={!dirty} onClick={() => void act({ type: "apply-policy", tax: Object.keys(tax).length ? tax : undefined, budget: Object.keys(budget).length ? budget : undefined }).then((r) => { if (r.ok) { setTax({}); setBudget({}); } })}>
              {decree || !c.legislature ? "Decree the budget" : "Send to parliament"}
            </button>
            <button className="btn" disabled={!dirty} onClick={() => { setTax({}); setBudget({}); }}>Reset</button>
          </div>
          {pending.length > 0 && <div className="dim" style={{ fontSize: 11, marginTop: 6 }}>{pending.length} bill{pending.length > 1 ? "s" : ""} before parliament. See Politics.</div>}
        </div>
      )}
      {mine && (e.macro.riskPremium > 0.05 || f.debtToGdp > 1.5) && (
        <Panel title="Debt crisis options">
          <div className="row row--wrap" style={{ gap: 6 }}>
            <button className="btn btn--sm" onClick={() => void act({ type: "imf-bailout" })}>Ask the IMF for a programme</button>
            <button className="btn btn--sm btn--danger" onClick={() => { if (confirm("Default on the national debt? Lenders will not forget.")) void act({ type: "default", haircut: 0.4 }); }}>Default on the debt</button>
          </div>
        </Panel>
      )}
    </div>
  );
}

function ratingLabel(r: number): string {
  if (r > 0.9) return "AAA";
  if (r > 0.82) return "AA";
  if (r > 0.72) return "A";
  if (r > 0.6) return "BBB";
  if (r > 0.45) return "BB";
  if (r > 0.3) return "B";
  if (r > 0.15) return "CCC";
  return "D";
}

const REGIME_LABELS: Record<string, string> = { float: "Floating currency", peg: "Currency peg", gold: "Gold standard", union: "Currency union", command: "Command economy" };

function Bank({ c, mine }: { c: Country; mine: boolean }) {
  const e = c.economy;
  const cb = e.centralBank;
  const m = e.macro;
  const [rate, setRate] = useState<number | null>(null);
  const controls = mine && !cb.independent && cb.regime !== "union";
  const shownRate = rate ?? e.monetary.centralBankRate;
  return (
    <div className="stack">
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Monetary conditions</div>
        <Stat label="Policy rate" value={pct(e.monetary.policyRate, 2)} />
        <Stat label="Bond yield" value={pct(m.bondYield, 2)} />
        <Stat label="Neutral real rate" value={pct(m.neutralRate, 2)} hint="The real rate that neither stimulates nor slows the economy." />
        <Stat label="Inflation" value={signedPct(e.monetary.inflation, 1)} />
        <Stat label="Expected inflation" value={signedPct(m.expectedInflation, 1)} />
        <Stat label="Inflation target" value={pct(cb.target, 1)} />
        <Stat label="Credibility" value={pct0(cb.credibility)} hint="How firmly expectations are tied to the target. Printing money destroys it." />
      </div>
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Currency</div>
        <Stat label="Regime" value={REGIME_LABELS[cb.regime]} />
        <Stat label="Currency" value={cb.currency} />
        <Stat label="Against the dollar since start" value={signedPct(1 / e.monetary.exchangeRateVsUsd - 1, 0)} tone={e.monetary.exchangeRateVsUsd > 1.02 ? "neg" : ""} />
        <Stat label="Real exchange rate" value={signedPct(m.realExchange, 0)} hint="Positive means overvalued, which hurts exporters." />
        <Stat label="FX reserves" value={`$${credits(e.reserves)} · ${(e.reserves / Math.max(1, e.accounts.imports / 12)).toFixed(1)} months of imports`} />
        <Stat label="Current account" value={`${signedPct(m.currentAccount / e.gdp, 1)} of GDP`} />
        <Stat label="Net foreign assets" value={`$${credits(e.netForeignAssets)}`} />
      </div>
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Banks</div>
        <Stat label="Bank credit / GDP" value={pct0(m.credit)} />
        <Stat label="Bad loans" value={pct(m.npl)} tone={m.npl > 0.08 ? "neg" : ""} />
        <Stat label="House prices" value={m.housePrice.toFixed(0)} hint="Index, 100 at the start." />
      </div>
      {mine && (
        <Panel title="Orders to the central bank">
          {cb.regime === "union" && <div className="dim" style={{ fontSize: 12 }}>Your rates are set by the currency union.</div>}
          {cb.independent && cb.regime !== "union" && <div className="dim" style={{ fontSize: 12, marginBottom: 6 }}>The governor runs rates independently using a Taylor rule. That anchors expectations, but you cannot order a rate cut.</div>}
          {controls && (
            <>
              <RateSlider label="Policy rate target" value={shownRate} max={Math.max(0.3, shownRate * 1.5)} step={0.0025} onChange={setRate} />
              <button className="btn btn--sm btn--primary" disabled={rate === null} onClick={() => void act({ type: "set-rate", value: rate }).then(() => setRate(null))}>Set rate</button>
            </>
          )}
          {cb.regime !== "union" && <RateSlider label="Inflation target" value={cb.target} max={0.1} step={0.0025} onChange={(v) => void act({ type: "set-target", value: v })} />}
          {controls && <RateSlider label="Deficit financed by printing money" hint="Painless at first. Then inflation, then a currency crisis." value={cb.printing} max={1} step={0.05} onChange={(v) => void act({ type: "set-printing", value: v })} />}
          {cb.regime !== "union" && <RateSlider label="Quantitative easing (holdings / GDP)" value={cb.qe} max={1} step={0.01} onChange={(v) => void act({ type: "set-qe", value: v })} />}
          <div className="row row--wrap" style={{ gap: 6, marginTop: 8 }}>
            {e.monetary.inflation > 0.15 && <button className="btn btn--sm btn--danger" title="Stop printing, cut the budget and reset expectations. Costs a short recession." onClick={() => void act({ type: "stabilisation-plan" })}>Launch a stabilisation plan</button>}
            {cb.regime !== "union" && (["float", "peg", "gold"] as const).filter((r) => r !== cb.regime).map((r) => <button key={r} className="btn btn--sm" onClick={() => void act({ type: "set-regime", value: r })}>Move to {REGIME_LABELS[r].toLowerCase()}</button>)}
            {cb.regime !== "union" && <button className="btn btn--sm" onClick={() => void act({ type: "set-independence", value: !cb.independent })}>{cb.independent ? "End independence" : "Grant independence"}</button>}
          </div>
        </Panel>
      )}
    </div>
  );
}

function Sectors({ c, mine }: { c: Country; mine: boolean }) {
  const e = c.economy;
  const [open, setOpen] = useState<SectorId | null>(null);
  const rows = [...e.sectors].sort((a, b) => b.share - a.share);
  const selected = open ? e.sectors.find((s) => s.id === open) : undefined;
  return (
    <div className="stack">
      <DataTable
        rows={rows}
        rowKey={(s) => s.id}
        onRow={(s) => setOpen(open === s.id ? null : s.id)}
        columns={[
          { id: "n", label: "Sector", render: (s) => <span className="truncate">{SECTORS[s.id].label}</span> },
          { id: "share", label: "Share", right: true, render: (s) => <span className="mono">{pct0(s.share)}</span> },
          { id: "g", label: "Growth", right: true, render: (s) => <span className={`mono ${deltaClass(s.growth)}`}>{signedPct(s.growth, 1)}</span> },
          { id: "p", label: "Price", right: true, render: (s) => <span className="mono dim">{s.price.toFixed(2)}</span> },
        ]}
      />
      {selected && (
        <div className="card">
          <div className="row"><strong className="grow">{SECTORS[selected.id].label}</strong><button className="btn btn--sm" onClick={() => setOpen(null)}>Close</button></div>
          <div className="dim" style={{ fontSize: 11, margin: "4px 0 8px" }}>{SECTORS[selected.id].blurb}</div>
          <Stat label="Output" value={`$${credits(selected.output)}`} />
          <Stat label="Jobs" value={people(selected.employment)} />
          <Stat label="Average wage" value={`$${money(selected.wage, 0)}`} />
          <Stat label="Output per worker" value={`$${money(selected.productivity, 0)}`} />
          <Stat label="Operating margin" value={pct(selected.margin)} />
          <Stat label="Capacity in use" value={pct0(selected.quantity / Math.max(1, selected.capacity))} />
          <Stat label="Market concentration" value={pct0(selected.concentration)} />
          <Stat label="State owned" value={pct0(selected.stateOwnership)} />
          <Stat label="Subsidy" value={pct0(selected.stateSubsidy)} />
          <Stat label="Regulation" value={pct0(selected.regulation)} />
          {mine && (
            <div className="row row--wrap" style={{ gap: 4, marginTop: 8 }}>
              <button className="btn btn--sm" onClick={() => void act({ type: "set-sector", id: selected.id, subsidy: Math.min(0.5, selected.stateSubsidy + 0.05) })}>Subsidy +5%</button>
              <button className="btn btn--sm" disabled={selected.stateSubsidy <= 0} onClick={() => void act({ type: "set-sector", id: selected.id, subsidy: Math.max(0, selected.stateSubsidy - 0.05) })}>Subsidy -5%</button>
              <button className="btn btn--sm" onClick={() => void act({ type: "set-sector", id: selected.id, regulation: Math.max(0, selected.regulation - 0.1) })}>Deregulate</button>
              <button className="btn btn--sm" onClick={() => void act({ type: "set-sector", id: selected.id, regulation: Math.min(1, selected.regulation + 0.1) })}>Regulate</button>
              <button className="btn btn--sm" onClick={() => void act({ type: "set-sector", id: selected.id, stateOwnership: Math.min(1, selected.stateOwnership + 0.2) })}>More state ownership</button>
              <button className="btn btn--sm" onClick={() => void act({ type: "set-sector", id: selected.id, stateOwnership: Math.max(0, selected.stateOwnership - 0.2) })}>Privatise 20%</button>
            </div>
          )}
        </div>
      )}
      <div className="dim" style={{ fontSize: 11 }}>Select a sector for its market{mine ? " and your policy levers" : ""}. Prices are relative to the start, adjusted for general inflation.</div>
    </div>
  );
}

function People({ c, mine }: { c: Country; mine: boolean }) {
  const e = c.economy;
  const l = e.labour;
  const [mw, setMw] = useState<number | null>(null);
  return (
    <div className="stack">
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Labour market</div>
        <Stat label="Unemployment" value={pct(l.unemployment)} />
        <Stat label="Natural rate (NAIRU)" value={pct(e.macro.nairu)} hint="Unemployment that does not push wages up or down." />
        <Stat label="Participation" value={pct0(l.participation)} />
        <Stat label="Median wage" value={`$${money(l.medianWage, 0)}`} />
        <Stat label="Wage growth" value={signedPct(l.wageGrowth, 1)} />
        <Stat label="Union membership" value={pct0(l.unionisation)} />
        <Stat label="Strike risk" value={pct0(l.strikeRisk)} tone={l.strikeRisk > 0.25 ? "neg" : ""} />
        {mine ? (
          <>
            <RateSlider label="Minimum wage (% of median)" value={mw ?? e.macro.minimumWage} max={1} step={0.01} hint="Lifts the lowest pay. Past about 55% of the median it starts costing jobs." onChange={setMw} />
            <button className="btn btn--sm btn--primary" disabled={mw === null} onClick={() => void act({ type: "apply-policy", minimumWage: mw }).then(() => setMw(null))}>{c.legislature ? "Send to parliament" : "Decree"}</button>
          </>
        ) : (
          <Stat label="Minimum wage" value={`${pct0(e.macro.minimumWage)} of median`} />
        )}
      </div>
      {e.households.map((h) => (
        <div className="card" key={h.id}>
          <div className="row"><strong className="grow">{h.label}</strong><span className="dim mono" style={{ fontSize: 11 }}>{pct0(h.popShare)} of people</span></div>
          <Stat label="Share of income" value={pct0(h.incomeShare)} />
          <Stat label="Disposable income, per person" value={`$${money(h.income, 0)}`} />
          <Stat label="Cost of living" value={h.costOfLiving.toFixed(2)} hint="This group's own basket; 1.00 at the start." />
          <Stat label="Savings rate" value={pct0(h.savingsRate)} />
          <div className="row" style={{ justifyContent: "space-between", fontSize: 11.5, marginTop: 4 }}><span className="dim">Satisfaction</span><span className="mono">{pct0(h.satisfaction)}</span></div>
          <Bar value={h.satisfaction} max={1} tone={h.satisfaction >= 0.5 ? "var(--positive)" : "var(--negative)"} />
        </div>
      ))}
    </div>
  );
}

function Firms({ c, mine }: { c: Country; mine: boolean }) {
  const companies = useStore((s) => s.companies);
  const rows = Object.values(companies).filter((x) => x.country === c.id).sort((a, b) => b.valuation - a.valuation);
  const [open, setOpen] = useState<string | null>(null);
  const selected = open ? companies[open] : undefined;
  const cost = Math.max(1e6, c.economy.gdp * 0.02);
  if (!rows.length && !mine) return <Empty>No major corporations are based here in this era.</Empty>;
  return (
    <div className="stack">
      {mine && (
        <div className="card" style={{ display: "grid", gap: 6 }}>
          <strong style={{ fontSize: 12 }}>State investment</strong>
          <div className="dim" style={{ fontSize: 11 }}>The treasury pays ${credits(cost)} to recapitalise a firm you pick and takes a larger stake. New firms come from the population, not the budget.</div>
          <div className="row row--wrap" style={{ gap: 4 }}>
            <button className="btn btn--sm" onClick={() => void act({ type: "nationalise-all" })}>Nationalise all</button>
            <button className="btn btn--sm" onClick={() => void act({ type: "privatise-all" })}>Privatise all</button>
          </div>
        </div>
      )}
      {rows.length ? (
        <DataTable<Company>
          rows={rows}
          rowKey={(x) => x.id}
          onRow={(x) => setOpen(open === x.id ? null : x.id)}
          columns={[
            { id: "n", label: "Company", render: (x) => <span className="truncate">{x.name}{x.insolvent ? " (bankrupt)" : ""}</span> },
            { id: "s", label: "Sector", render: (x) => <span className="dim truncate">{SECTORS[x.sector]?.label ?? x.sector}</span> },
            { id: "o", label: "State", right: true, render: (x) => <span className="mono">{Math.round(x.stateOwnership * 100)}%</span> },
            { id: "v", label: "Value", right: true, render: (x) => <span className="mono">${credits(x.valuation)}</span> },
          ]}
        />
      ) : (
        <Empty>No firms here yet. Sponsor one, or wait for the population to start its own.</Empty>
      )}
      {selected && <CompanyCard co={selected} mine={mine} />}
    </div>
  );
}
function CompanyCard({ co, mine }: { co: Company; mine: boolean }) {
  return (
    <div className="card">
      <div className="row"><strong className="grow truncate">{co.name}</strong><Chip>{SECTORS[co.sector].label}</Chip></div>
      <Stat label="Revenue" value={`$${credits(co.revenue)}`} />
      <Stat label="Operating profit" value={`$${credits(co.profit)}`} tone={co.profit >= 0 ? "" : "neg"} />
      <Stat label="Net income" value={`$${credits(co.netIncome ?? 0)}`} tone={(co.netIncome ?? 0) >= 0 ? "" : "neg"} />
      <Stat label="Debt" value={`$${credits(co.debt)}`} />
      <Stat label="Employees" value={people(co.employees)} />
      <Stat label="Market value" value={`$${credits(co.valuation)}`} />
      {co.listed && <Stat label="Share price" value={money(co.sharePrice, 2)} />}
      <Stat label="P/E" value={(co.pe ?? 0).toFixed(1)} />
      <div style={{ marginTop: 10 }}>
        <div className="mono dim" style={{ fontSize: 10.5, letterSpacing: ".08em" }}>HISTORY</div>
        <div className="spark-grid">
          <Spark title="Share price" values={co.priceHistory ?? []} format={(v) => money(v, 2)} />
          <Spark title="Revenue" values={co.revenueHistory ?? []} format={(v) => credits(v)} />
          <Spark title="Market value" values={co.valuationHistory ?? []} format={(v) => credits(v)} />
        </div>
      </div>
      <Stat label="1-year return" value={signedPct(co.sharePrice / Math.max(0.01, co.sharePriceYearAgo) - 1, 0)} />
      <Stat label="Share of home market" value={pct0(co.marketShare ?? 0)} />
      <Stat label="State owned" value={pct0(co.stateOwnership)} />
      {mine && (
        <div className="row row--wrap" style={{ gap: 4, marginTop: 8 }}>
          {co.stateOwnership < 0.99 && <button className="btn btn--sm btn--danger" onClick={() => void act({ type: "nationalise", company: co.id })}>Nationalise</button>}
          {co.stateOwnership > 0.01 && <button className="btn btn--sm" onClick={() => void act({ type: "privatise", company: co.id })}>Privatise</button>}
          <button className="btn btn--sm" onClick={() => void act({ type: "bail-out", company: co.id })}>Bail out</button>
          <button className="btn btn--sm" title="Inject 2% of GDP as fresh capital; the state takes a larger stake" onClick={() => void act({ type: "sponsor-firm", company: co.id })}>Fund</button>
        </div>
      )}
    </div>
  );
}

function Trade({ c, mine }: { c: Country; mine: boolean }) {
  const countries = useStore((s) => s.countries);
  const t = c.economy.trade;
  const partners = Object.entries(t.flows).filter(([id]) => countries[id] && !countries[id].annexedBy).sort((a, b) => b[1] - a[1]);
  const barriers = c.tradeBarriers ?? {};
  return (
    <div className="stack">
      <div className="card">
        <Stat label="Exports" value={`$${credits(t.exports)} · ${pct0(t.exports / c.economy.gdp)}`} />
        <Stat label="Imports" value={`$${credits(t.imports)} · ${pct0(t.imports / c.economy.gdp)}`} />
        <Stat label="Balance" value={`${signedPct(t.tradeBalance / c.economy.gdp, 1)} of GDP`} tone={t.tradeBalance >= 0 ? "pos" : "neg"} />
        <Stat label="Average tariff" value={pct(t.tariffRate)} />
      </div>
      <Panel title="Largest partners">
        <DataTable
          rows={partners}
          rowKey={([id]) => id}
          columns={[
            { id: "p", label: "Partner", render: ([id]) => <span className="truncate">{countries[id]?.name ?? id}</span> },
            { id: "v", label: "Volume", right: true, render: ([id, v]) => <span className="mono">${credits(v)}{barriers[id] ? <span className="neg"> · {pct0(barriers[id])}</span> : null}</span> },
            ...(mine ? [{
              id: "a", label: "", right: true, render: ([id]: [string, number]) => (
                <span className="row" style={{ gap: 3, justifyContent: "flex-end" }}>
                  <button className="btn btn--sm" title="Raise a 25% barrier" onClick={() => void act({ type: "trade-barrier", partner: id, value: Math.min(1, (barriers[id] ?? 0) + 0.25) })}>+</button>
                  <button className="btn btn--sm" title="Remove barriers" disabled={!barriers[id]} onClick={() => void act({ type: "trade-barrier", partner: id, value: 0 })}>Free</button>
                  <button className="btn btn--sm btn--danger" title="Full embargo" onClick={() => void act({ type: "trade-barrier", partner: id, value: 1 })}>Ban</button>
                </span>
              ),
            }] : []),
          ]}
        />
      </Panel>
    </div>
  );
}

function governmentLabel(g: string): string {
  const names: Record<string, string> = {
    "absolute-monarchy": "Absolute monarchy",
    "constitutional-monarchy": "Constitutional monarchy",
    "parliamentary-republic": "Parliamentary republic",
    "semi-presidential-republic": "Semi-presidential republic",
    "presidential-republic": "Presidential republic",
    "federal-republic": "Federal republic",
    confederation: "Confederation",
    "one-party-state": "One-party state",
    "military-junta": "Military junta",
    theocracy: "Theocracy",
    "monarchy-absolute-colonial": "Colonial administration",
  };
  return names[g] ?? g.replace(/-/g, " ").replace(/^./, (s) => s.toUpperCase());
}

function regimeLabel(c: Country): string {
  if (c.overlord) return `Dependency of ${c.overlord}`;
  const g = c.government as string;
  if (["parliamentary-republic", "semi-presidential-republic", "presidential-republic", "federal-republic", "confederation", "constitutional-monarchy"].includes(g)) return "Constitutional government";
  if (["one-party-state", "military-junta", "theocracy"].includes(g)) return "Authoritarian rule";
  return "Personal rule";
}

function ideologyLabel(v: number): string {
  if (v < -55) return "Hard left";
  if (v < -20) return "Left";
  if (v <= 20) return "Centre";
  if (v <= 55) return "Right";
  return "Hard right";
}

/** Mood, grievances and unrest, with the levers a government actually has. */
function InternalSituation({ c, mine }: { c: Country; mine: boolean }) {
  const e = c.economy;
  const active = c.unrest.filter((u) => !u.endedAt).sort((a, b) => b.intensity - a.intensity);
  const share = (v: number) => Math.max(0, Math.min(1, v));
  const prices = share(e.monetary.inflation / 0.2);
  const jobs = share((e.labour.unemployment - e.macro.nairu) / 0.1);
  const wages = share(-e.labour.wageGrowth / 0.05);
  const squeeze = Math.round(((prices + jobs + wages) / 3) * 100);
  return (
    <div className="stack">
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Internal situation</div>
        <Stat label="Public mood" value={pct0(c.executive.approval / 100)} tone={c.executive.approval >= 45 ? "pos" : "neg"} />
        <Stat label="Legitimacy" value={pct0(c.executive.confidence / 100)} tone={c.executive.confidence < 40 ? "neg" : ""} />
        <Stat label="National cohesion" value={pct0(c.cohesion / 100)} tone={c.cohesion < 40 ? "neg" : ""} hint="Low cohesion is where separatism starts." />
        <Stat label="Unrest risk" value={pct0(c.unrestRisk)} tone={c.unrestRisk > 0.3 ? "neg" : ""} />
        <Stat label="Strike risk" value={pct0(e.labour.strikeRisk)} tone={e.labour.strikeRisk > 0.25 ? "neg" : ""} />
        <Stat label="Cost-of-living squeeze" value={pct0(squeeze / 100)} tone={squeeze > 45 ? "neg" : ""} hint="Prices, jobs and falling real wages, averaged." />
        {mine && (
          <div className="row row--wrap" style={{ gap: 4, marginTop: 8 }}>
            <button className="btn btn--sm btn--primary" title="Meet the demands with more welfare spending. Goes through parliament where there is one." onClick={() => void act({ type: "apply-policy", budget: { welfare: Math.min(0.2, e.budget.welfare + 0.01) } })}>Concede to the protests</button>
            <button className="btn btn--sm btn--danger" title="Police and troops. Clears the streets and costs legitimacy." onClick={() => void act({ type: "emergency-powers", value: true })}>Crack down</button>
          </div>
        )}
      </div>
      <Panel title="Grievances">
        {[
          { key: "prices", label: "Prices", value: prices, note: `${(e.monetary.inflation * 100).toFixed(1)}% inflation` },
          { key: "jobs", label: "Jobs", value: jobs, note: `${(e.labour.unemployment * 100).toFixed(1)}% unemployed` },
          { key: "wages", label: "Real wages", value: wages, note: `${(e.labour.wageGrowth * 100).toFixed(1)}% wage growth` },
        ].map((g) => (
          <div key={g.key} style={{ marginBottom: 6 }}>
            <div className="row" style={{ justifyContent: "space-between", fontSize: 11.5 }}>
              <span className="dim">{g.label}</span>
              <span className="mono dim">{g.note}</span>
            </div>
            <Bar value={g.value} max={1} tone={g.value > 0.5 ? "var(--negative)" : "var(--positive)"} />
          </div>
        ))}
      </Panel>
      <Panel title={`Unrest (${active.length})`}>
        {active.length === 0 && <div className="dim" style={{ fontSize: 12 }}>Nothing organised on the streets right now. Mood is the thing to watch.</div>}
        {active.map((u) => (
          <div key={u.id} className="row" style={{ fontSize: 12, padding: "3px 0" }}>
            <span className="grow" style={{ textTransform: "capitalize" }}>{u.kind.replace(/-/g, " ")}</span>
            {u.region && <span className="dim truncate" style={{ maxWidth: 90 }}>{u.region}</span>}
            {u.fatalities > 0 && <span className="dim mono">{u.fatalities} dead</span>}
            <span className="mono">{Math.round(u.intensity)}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

/**
 * The house itself: who sits in it, what is before it, and every division it has
 * held. A vote that is over does not disappear here — it takes its place in the
 * record with the numbers attached.
 */
function LegislationLedger({ c }: { c: Country }) {
  const bills = useStore((s) => s.bills);
  const chamber = c.legislature?.chambers[0];
  const all = Object.values(bills).filter((b) => b.country === c.id).sort((a, b) => b.introducedAt - a.introducedAt);
  const pending = all.filter((b) => b.status === "introduced" || b.status === "in-committee");
  const decided = all.filter((b) => b.status === "enacted" || b.status === "rejected" || b.status === "expired");
  const seatTotal = chamber ? c.parties.reduce((a, p) => a + (p.seats[chamber.id] ?? 0), 0) : 0;
  return (
    <Panel title={chamber ? `${chamber.name} · ${seatTotal} seats` : "Legislation"}>
      {chamber && (
        <div className="seatbar" role="img" aria-label="Seats by party" style={{ marginBottom: 8 }}>
          {c.parties
            .filter((p) => (p.seats[chamber.id] ?? 0) > 0)
            .sort((a, b) => a.ideology - b.ideology)
            .map((p) => (
              <span key={p.id} title={`${p.name}: ${p.seats[chamber.id]}`} style={{ flex: p.seats[chamber.id] ?? 0, background: p.color }} />
            ))}
        </div>
      )}
      <div className="eyebrow">Before the house</div>
      {!pending.length && <div className="dim" style={{ fontSize: 12 }}>Nothing tabled.</div>}
      {pending.map((b) => (
        <div key={b.id} className="card" style={{ marginBottom: 6 }}>
          <div className="row">
            <strong className="grow truncate" style={{ fontSize: 12 }}>{b.title}</strong>
            <Chip>{b.status === "in-committee" ? "in committee" : "tabled"}</Chip>
          </div>
          <div className="dim" style={{ fontSize: 11 }}>{b.summary}</div>
        </div>
      ))}
      <div className="eyebrow" style={{ marginTop: 8 }}>Divisions</div>
      {!decided.length && <div className="dim" style={{ fontSize: 12 }}>No divisions held yet.</div>}
      {decided.slice(0, 10).map((b) => {
        const tally = b.tallies[b.chamberId];
        const aye = tally?.aye ?? 0;
        const nay = tally?.nay ?? 0;
        return (
          <div key={b.id} className="card" style={{ marginBottom: 6 }}>
            <div className="row">
              <strong className="grow truncate" style={{ fontSize: 12 }}>{b.title}</strong>
              <Chip tone={b.status === "enacted" ? "var(--positive)" : "var(--negative)"}>
                {b.status === "enacted" ? "passed" : b.status === "rejected" ? "defeated" : "lapsed"}
              </Chip>
            </div>
            {tally && (
              <div className="mono dim" style={{ fontSize: 11 }}>
                {aye} aye · {nay} no · {tally.abstain} abstained
              </div>
            )}
            {tally && (
              <div style={{ display: "flex", height: 4, marginTop: 3, background: "var(--line)" }}>
                <span style={{ flex: Math.max(0.001, aye), background: "var(--positive)" }} />
                <span style={{ flex: Math.max(0.001, nay), background: "var(--negative)" }} />
              </div>
            )}
          </div>
        );
      })}
    </Panel>
  );
}
function Politics({ c, mine }: { c: Country; mine: boolean }) {
  const characters = useStore((s) => s.characters);
  const start = useStore((s) => s.scenario?.startDate);
  const ex = c.executive;
  const chamber = c.legislature?.chambers[0];
  const total = chamber ? c.parties.reduce((a, p) => a + (p.seats[chamber.id] ?? 0), 0) || 1 : 1;
  const govSeats = chamber ? c.parties.filter((p) => ex.coalition.includes(p.id)).reduce((a, p) => a + (p.seats[chamber.id] ?? 0), 0) : 0;
  const banker = Object.values(characters).find((x) => x.country === c.id && x.role === "central-banker");
  const opposition = chamber
    ? [...c.parties].filter((p) => !ex.coalition.includes(p.id)).sort((a, b) => (b.seats[chamber.id] ?? 0) - (a.seats[chamber.id] ?? 0))[0]
    : undefined;
  const openReferendums = (c.referendums ?? []).filter((r) => r.status === "scheduled" || r.status === "open").length;
  return (
    <div className="stack">
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Political system</div>
        <Stat label="System" value={<span className="ink-text">{governmentLabel(c.government as string)}</span>} />
        <Stat label="Regime" value={regimeLabel(c)} />
        <Stat label="Ideology" value={`${ideologyLabel(c.ideology)} (${c.ideology > 0 ? "+" : ""}${c.ideology.toFixed(0)})`} />
        <Stat label={ex.headOfStateTitle} value={<span className="ink-text">{charName(characters, ex.headOfStateId)}</span>} />
        {ex.headOfGovernmentId && ex.headOfGovernmentId !== ex.headOfStateId && <Stat label={ex.headOfGovernmentTitle} value={<span className="ink-text">{charName(characters, ex.headOfGovernmentId)}</span>} />}
        <Stat label="Approval" value={pct0(ex.approval / 100)} tone={ex.approval >= 45 ? "pos" : "neg"} />
        <Stat label="Legitimacy" value={pct0(ex.confidence / 100)} />
        {chamber && <Stat label="Coalition" value={`${govSeats} of ${total} seats`} tone={govSeats > total / 2 ? "pos" : "neg"} />}
        {chamber && opposition && <Stat label="Largest opposition" value={<span className="truncate">{opposition.name} · {opposition.seats[chamber.id] ?? 0}</span>} />}
        {c.courts.length > 0 && <Stat label="Judiciary" value={`${c.courts[0].name}${c.courts[0].docket.length ? ` · ${c.courts[0].docket.length} cases` : ""}`} />}
        {openReferendums > 0 && <Stat label="Referendums" value={`${openReferendums} pending`} />}
        {c.rulingPartyName && <Stat label="Ruling party" value={<span className="ink-text">{c.rulingPartyName}</span>} />}
        {c.nextElectionAt !== undefined && start && <Stat label="Next election" value={simDate(start, c.nextElectionAt)} />}
        {ex.emergencyPowers && <Stat label="State of emergency" value="In force" tone="neg" />}
        {mine && (
          <div className="row row--wrap" style={{ gap: 4, marginTop: 8 }}>
            {c.nextElectionAt !== undefined && <button className="btn btn--sm" onClick={() => void act({ type: "call-election" })}>Call an election</button>}
            {c.legislature && <button className="btn btn--sm btn--danger" onClick={() => void act({ type: "emergency-powers", value: !ex.emergencyPowers })}>{ex.emergencyPowers ? "End state of emergency" : "Rule by emergency decree"}</button>}
          </div>
        )}
      </div>

      {chamber && (
        <Panel title={`${chamber.name} · ${chamber.seats} seats`}>
          <div className="seatbar" role="img" aria-label="Seats by party">
            {c.parties.filter((p) => (p.seats[chamber.id] ?? 0) > 0).sort((a, b) => a.ideology - b.ideology).map((p) => <span key={p.id} title={`${p.name}: ${p.seats[chamber.id]}`} style={{ flex: p.seats[chamber.id] ?? 0, background: p.color }} />)}
          </div>
          <Stat label="Government majority" value={`${govSeats} of ${total}`} tone={govSeats > total / 2 ? "pos" : "neg"} />
          <DataTable
            rows={[...c.parties].sort((a, b) => (b.seats[chamber.id] ?? 0) - (a.seats[chamber.id] ?? 0))}
            rowKey={(p) => p.id}
            columns={[
              { id: "n", label: "Party", render: (p) => <span className="row" style={{ gap: 5 }}><span style={{ width: 8, height: 8, background: p.color, borderRadius: 2, flex: "none" }} /><span className="truncate" title={p.name}>{p.name}</span>{ex.coalition.includes(p.id) && <Chip tone="var(--positive)">Gov</Chip>}</span> },
              { id: "s", label: "Seats", right: true, render: (p) => <span className="mono">{p.seats[chamber.id] ?? 0}</span> },
              { id: "v", label: "Polling", right: true, render: (p) => <span className="mono dim">{p.popularity.toFixed(0)}%</span> },
            ]}
          />
        </Panel>
      )}
      {!chamber && <div className="dim" style={{ fontSize: 12 }}>{c.overlord ? "Run from the colonial power." : "No elected legislature. The ruler governs by decree."}</div>}

      <Panel title="Cabinet">
        {ex.ministers.filter((m) => m.characterId || mine).map((m) => (
          <div className="row" key={m.id} style={{ fontSize: 12, padding: "2px 0" }}>
            <span className="dim grow truncate">{m.title}</span>
            <span className="truncate" style={{ maxWidth: 170 }}>{charName(characters, m.characterId)}</span>
            {mine && <button className="btn btn--sm" onClick={() => { const name = prompt(`Who should be ${m.title}?`); if (name) void act({ type: "appoint", area: m.id, name }); }}>Appoint</button>}
          </div>
        ))}
        {banker && <div className="row" style={{ fontSize: 12, padding: "2px 0" }}><span className="dim grow">Central Bank Governor</span><span>{banker.name}</span></div>}
        {!mine && ex.ministers.every((m) => !m.characterId) && !banker && <div className="dim" style={{ fontSize: 12 }}>No cabinet ministers on record for this government.</div>}
      </Panel>

      <LegislationLedger c={c} />

      <InternalSituation c={c} mine={mine} />
    </div>
  );
}

/** The straits and canals the world's freight is forced through. */
function Chokepoints({ c }: { c: Country }) {
  const points = useStore((s) => s.chokepoints);
  const countries = useStore((s) => s.countries);
  if (!points.length) return null;
  const ordered = [...points].sort((a, b) => b.share - a.share);
  return (
    <Panel title="Trade chokepoints">
      {ordered.map((p) => {
        const owner = countries[p.owner];
        const tone = p.status === "closed" ? "var(--negative)" : p.status === "threatened" ? "var(--warning)" : "var(--positive)";
        return (
          <div key={p.id} className="card" style={{ marginBottom: 6 }}>
            <div className="row">
              <strong className="grow truncate" style={{ fontSize: 12 }}>{p.name}</strong>
              <Chip tone={tone}>{p.status}</Chip>
            </div>
            <div className="dim" style={{ fontSize: 11 }}>
              {p.water} · {Math.round(p.share * 100)}% of world trade · {p.note}
            </div>
            <div className="mono dim" style={{ fontSize: 11 }}>Held by {owner?.name ?? "no state"}</div>
            {p.owner === c.id && (
              <div className="row row--wrap" style={{ gap: 4, marginTop: 4 }}>
                {p.status === "open" && (
                  <button className="btn btn--sm" onClick={() => void act({ type: "threaten-chokepoint", id: p.id })}>
                    Threaten to close
                  </button>
                )}
                {p.status !== "closed" && (
                  <button
                    className="btn btn--sm btn--danger"
                    onClick={() => {
                      if (confirm(`Close the ${p.name}? The world prices it the same day.`)) void act({ type: "close-chokepoint", id: p.id });
                    }}
                  >
                    Close it
                  </button>
                )}
                {p.status !== "open" && (
                  <button className="btn btn--sm" onClick={() => void act({ type: "reopen-chokepoint", id: p.id })}>
                    Reopen
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </Panel>
  );
}
function Foreign({ c, mine }: { c: Country; mine: boolean }) {
  const countries = useStore((s) => s.countries);
  const wars = useStore((s) => s.wars);
  const treaties = useStore((s) => s.treaties);
  const sanctions = useStore((s) => s.sanctions);
  const player = useStore((s) => s.playerCountry);
  const myTreaties = treaties.filter((t: Treaty) => t.parties.includes(c.id));
  const myWars = wars.filter((w) => !w.endedAt && c.wars.includes(w.id));
  const onMe = sanctions.filter((s: Sanction) => s.on === c.id);
  const byMe = sanctions.filter((s: Sanction) => s.imposedBy.includes(c.id));
  const rel = c.relations ?? {};
  const ranked = Object.entries(rel).filter(([id]) => countries[id] && !countries[id].annexedBy).sort((a, b) => b[1] - a[1]);
  const mineCountry = player ? countries[player] : undefined;
  const dealingWithOther = !mine && mineCountry && !c.annexedBy;
  const relationToMe = mineCountry ? c.relations?.[mineCountry.id] : undefined;

  return (
    <div className="stack">
      {dealingWithOther && (
        <div className="card">
          <div className="eyebrow" style={{ marginBottom: 6 }}>{mineCountry.name} and {c.name}</div>
          <Stat label="Their view of you" value={relationToMe === undefined ? "--" : relationToMe.toFixed(0)} tone={(relationToMe ?? 0) >= 0 ? "pos" : "neg"} />
          <div className="row row--wrap" style={{ gap: 4, marginTop: 6 }}>
            <button className="btn btn--sm" onClick={() => void act({ type: "diplomatic-mission", partner: c.id })}>Send a mission</button>
            <button className="btn btn--sm" onClick={() => void act({ type: "offer-treaty", partner: c.id, kind: "trade" })}>Trade deal</button>
            <button className="btn btn--sm" onClick={() => void act({ type: "offer-treaty", partner: c.id, kind: "non-aggression" })}>Non-aggression</button>
            <button className="btn btn--sm" onClick={() => void act({ type: "offer-treaty", partner: c.id, kind: "alliance" })}>Alliance</button>
            <button className="btn btn--sm" onClick={() => void act({ type: "sanction", target: c.id, kind: "financial" })}>Sanction</button>
            <button className="btn btn--sm btn--danger" onClick={() => { if (confirm(`Declare war on ${c.name}?`)) void act({ type: "declare-war", target: c.id, cause: `${mineCountry.name} presses its claims against ${c.name}.` }); }}>Declare war</button>
          </div>
        </div>
      )}
      {mine && <div className="dim" style={{ fontSize: 11 }}>Select another country on the map and open this tab to deal with it.</div>}

      <Chokepoints c={c} />
      <Panel title={`Wars (${myWars.length})`}>
        {!myWars.length && <div className="dim" style={{ fontSize: 12 }}>At peace.</div>}
        {myWars.map((w) => (
          <div key={w.id} className="card" style={{ marginBottom: 6 }}>
            <strong style={{ fontSize: 12 }}>{w.name}</strong>
            <div className="dim" style={{ fontSize: 11 }}>{w.cause}</div>
            <Stat label="Exhaustion" value={Math.round(w.exhaustion[c.id] ?? 0)} />
            {w.fronts.map((f) => { const label = occupationLabel(w, f, countries); return label ? <div key={f.id} className="mono" style={{ fontSize: 11 }}>{label}</div> : null; })}
            {mine && w.belligerents[c.id] && <StanceButtons war={w} player={c.id} />}
            {mine && w.belligerents[c.id] && <button className="btn btn--sm btn--primary" style={{ marginTop: 4 }} onClick={() => useStore.getState().set({ peaceWar: w.id, peaceDrawn: null })}>Peace deal</button>}
          </div>
        ))}
      </Panel>
      <Panel title={`Treaties (${myTreaties.length})`}>
        {!myTreaties.length && <div className="dim" style={{ fontSize: 12 }}>No treaties in force.</div>}
        {myTreaties.map((t) => (
          <div key={t.id} className="row" style={{ fontSize: 12, padding: "2px 0" }}>
            <span className="grow truncate" title={t.terms.join(" ")}>{t.name}</span>
            {mine && <button className="btn btn--sm" onClick={() => void act({ type: "leave-treaty", id: t.id })}>Leave</button>}
          </div>
        ))}
      </Panel>
      {(onMe.length > 0 || byMe.length > 0) && (
        <Panel title="Sanctions">
          {onMe.map((s) => <div key={s.id} style={{ fontSize: 12 }}>From {s.imposedBy.map((b) => countries[b]?.name ?? b).join(", ")}: {s.kind}, {s.scope}% coverage</div>)}
          {byMe.map((s) => (
            <div key={s.id} className="row" style={{ fontSize: 12 }}>
              <span className="grow">On {countries[s.on]?.name ?? s.on}: {s.kind}</span>
              {mine && <button className="btn btn--sm" onClick={() => void act({ type: "lift-sanction", id: s.id })}>Lift</button>}
            </div>
          ))}
        </Panel>
      )}
      {ranked.length > 0 && (
        <Panel title="Relations" defaultOpen={false}>
          <div className="eyebrow">Closest</div>
          {ranked.slice(0, 8).map(([id, v]) => <div key={id} className="row" style={{ justifyContent: "space-between", fontSize: 12 }}><span className="truncate">{countries[id].name}</span><span className="mono pos">{v.toFixed(0)}</span></div>)}
          <div className="eyebrow" style={{ marginTop: 6 }}>Most hostile</div>
          {ranked.slice(-8).reverse().map(([id, v]) => <div key={id} className="row" style={{ justifyContent: "space-between", fontSize: 12 }}><span className="truncate">{countries[id].name}</span><span className="mono neg">{v.toFixed(0)}</span></div>)}
        </Panel>
      )}
    </div>
  );
}

function Military({ c, mine }: { c: Country; mine: boolean }) {
  const countries = useStore((s) => s.countries);
  const opsPick = useStore((s) => s.opsPick);
  const stored = useStore((s) => s.opsTarget);
  const landing = useStore((s) => s.opsLanding);
  const opsTarget = stored && stored !== c.id && countries[stored] && !countries[stored].annexedBy ? stored : "";
  const pick = opsTarget || (Object.values(countries).find((x) => x.id !== c.id && !x.annexedBy)?.id ?? "");
  const m = c.military;
  return (
    <div className="stack">
      <div className="card" style={{ display: "grid", gap: 6 }}>
        <strong style={{ fontSize: 12 }}>Operations</strong>
        <select className="input" value={pick} onChange={(e) => useStore.getState().set({ opsTarget: e.target.value })}>
          {Object.values(countries).filter((x) => x.id !== c.id && !x.annexedBy).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
        <button
          className={opsPick ? "btn btn--sm btn--primary" : "btn btn--sm"}
          onClick={() => useStore.getState().set({ opsPick: opsPick ? null : "target" })}
        >{opsPick ? "Click a country… (Esc)" : "Pick target on map"}</button>
        <input className="input" value={landing} onChange={(e) => useStore.getState().set({ opsLanding: e.target.value })} placeholder="Landing site, e.g. Normandy" />
        <div className="row row--wrap" style={{ gap: 4 }}>
          <button className="btn btn--sm btn--primary" onClick={() => void act({ type: "naval-invasion", target: pick, place: landing })}>Naval invasion</button>
          <button className="btn btn--sm" onClick={() => void act({ type: "special-op", target: pick, op: "sabotage" })}>Sabotage</button>
          <button className="btn btn--sm" onClick={() => void act({ type: "special-op", target: pick, op: "decapitation" })}>Decapitation</button>
          <button className="btn btn--sm" onClick={() => void act({ type: "special-op", target: pick, op: "interdiction" })}>Interdiction</button>
          <button className="btn btn--sm" onClick={() => void act({ type: "special-op", target: pick, op: "recon" })}>Recon</button>
        </div>
        <div className="dim" style={{ fontSize: 11 }}>A landing needs a war and a navy; covert work is deniable until it is not.</div>
      </div>
      <div className="card">
        <div className="row"><strong className="grow">Research</strong><span className="dim mono">{Math.round(c.tech?.points ?? 0)} pts</span></div>
              {mine && (
        <div className="card" style={{ display: "grid", gap: 4 }}>
          <strong style={{ fontSize: 12 }}>Army composition</strong>
          <div className="mono dim" style={{ fontSize: 11 }}>
            infantry {Math.round(((c.military.divisions?.infantry ?? 0.6)) * 100)}% · armour {Math.round(((c.military.divisions?.armour ?? 0.2)) * 100)}% · artillery {Math.round(((c.military.divisions?.artillery ?? 0.2)) * 100)}%
          </div>
          <div className="row row--wrap" style={{ gap: 4 }}>
            <button className="btn btn--sm" onClick={() => void act({ type: "set-divisions", infantry: 0.7, armour: 0.15, artillery: 0.15 })}>Infantry army</button>
            <button className="btn btn--sm" onClick={() => void act({ type: "set-divisions", infantry: 0.4, armour: 0.4, artillery: 0.2 })}>Armoured army</button>
            <button className="btn btn--sm" onClick={() => void act({ type: "set-divisions", infantry: 0.35, armour: 0.2, artillery: 0.45 })}>Artillery army</button>
            <button className="btn btn--sm" onClick={() => void act({ type: "set-divisions", infantry: 0.6, armour: 0.2, artillery: 0.2 })}>Balanced</button>
          </div>
        </div>
      )}
{(["army", "logistics", "industry", "navy"] as const).map((f) => (
          <div key={f} className="row" style={{ fontSize: 12, padding: "2px 0" }}>
            <span className="grow" style={{ textTransform: "capitalize" }}>{f}</span>
            <span className="mono">{c.tech?.[f] ?? 0}</span>
            {mine && <button className={`btn btn--sm ${c.tech?.focus === f ? "btn--active" : ""}`} onClick={() => void act({ type: "set-research", focus: f })}>Focus</button>}
          </div>
        ))}
        <div className="dim" style={{ fontSize: 11 }}>The science budget buys levels; equipment and productivity follow.</div>
      </div>
      <div className="card">
        <Stat label="Active duty" value={people(m.activeDuty)} />
        <Stat label="Reserves" value={people(m.reserves)} />
        <Stat label="Annual budget" value={`$${credits(c.economy.fiscal.military)}`} />
        <Stat label="Share of GDP" value={pct(c.economy.fiscal.military / c.economy.gdp)} />
        <Stat label="Readiness" value={pct0(m.readiness / 100)} tone={m.readiness > 60 ? "pos" : "neg"} />
        <Stat label="Morale" value={pct0(m.morale / 100)} />
        <Stat label="Conscription" value={m.conscription ? "In force" : "None"} />
        {c.nukes > 0 && <Stat label="Nuclear warheads" value={people(c.nukes)} />}
      </div>
      {mine && (
        <div className="row row--wrap" style={{ gap: 4 }}>
          <button className="btn btn--sm" disabled={m.reserves <= 0} onClick={() => void act({ type: "military", mobilise: 0.25 })}>Mobilise 25% of reserves</button>
          <button className="btn btn--sm" onClick={() => void act({ type: "military", conscription: !m.conscription })}>{m.conscription ? "End conscription" : "Introduce conscription"}</button>
        </div>
      )}
      <DataTable
        rows={Object.entries(m.branches).filter(([, v]) => v.active > 0).map(([k, v]) => ({ k, ...v }))}
        rowKey={(r) => r.k}
        columns={[
          { id: "b", label: "Branch", render: (r) => r.k.replace(/-/g, " ") },
          { id: "a", label: "Strength", right: true, render: (r) => <span className="mono">{people(r.active)}</span> },
          { id: "q", label: "Quality", right: true, render: (r) => <span className="mono">{Math.round(r.quality)}</span> },
        ]}
      />
    </div>
  );
}

// ===========================================================================
// Markets
// ===========================================================================

const ret = (c: Company) => c.sharePrice / Math.max(0.01, c.sharePriceYearAgo) - 1;

export function MarketPanel({ markets, companies }: { markets: MarketState | null; companies: Record<string, Company> }) {
  const [sort, setSort] = useState<"cap" | "ret" | "rev">("cap");
  const countries = useStore((s) => s.countries);
  const player = useStore((s) => s.playerCountry);
  const [open, setOpen] = useState<string | null>(null);
  if (!markets) return <Empty>Loading markets</Empty>;
  const all = Object.values(companies).filter((c) => !c.insolvent && !c.banned);
  const sorted = [...all].sort((a, b) => (sort === "cap" ? b.valuation - a.valuation : sort === "rev" ? b.revenue - a.revenue : ret(b) - ret(a)));
  const selected = open ? companies[open] : undefined;
  return (
    <div className="scroll pad grow" style={{ minHeight: 0 }}>
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Global conditions</div>
        <Stat label="Sentiment" value={markets.sentiment} tone={markets.sentiment === "euphoric" || markets.sentiment === "bullish" ? "pos" : markets.sentiment === "crash" || markets.sentiment === "bearish" ? "neg" : ""} />
        <Stat label="Risk appetite" value={pct0(markets.riskAppetite / 100)} />
        <Stat label="Credit spreads" value={pct(markets.creditSpreads, 2)} tone={markets.creditSpreads > 0.05 ? "neg" : ""} />
      </div>
      <Panel title="Commodities">
        <div className="stack">
          {Object.entries(markets.commodityPrices).map(([k, v]) => (
            <div key={k} className="row" style={{ justifyContent: "space-between", fontSize: 12 }}>
              <span className="dim">{COMMODITY_LABELS[k as keyof typeof COMMODITY_LABELS] ?? k}</span>
              <span className="mono">${money(v, v < 10 ? 2 : 0)}</span>
            </div>
          ))}
        </div>
      </Panel>
      {markets.exchanges.length > 0 && (
        <Panel title="Exchanges">
          <DataTable
            rows={markets.exchanges}
            rowKey={(e) => e.id}
            columns={[
              { id: "n", label: "Exchange", render: (e) => <span className="truncate" title={e.name}>{e.name}</span> },
              { id: "i", label: "Index", right: true, render: (e) => <span className="mono">{e.index.toFixed(0)}</span> },
              { id: "r", label: "1y", right: true, render: (e) => <span className={`mono ${deltaClass(e.index / e.indexYearAgo - 1)}`}>{signedPct(e.index / e.indexYearAgo - 1, 0)}</span> },
            ]}
          />
        </Panel>
      )}
      <Panel title={`Corporations (${all.length})`}>
        <div className="row" style={{ marginBottom: 6, gap: 6 }}>
          {(["cap", "rev", "ret"] as const).map((s) => <button key={s} className={`btn btn--sm ${sort === s ? "btn--active" : ""}`} onClick={() => setSort(s)}>{s === "cap" ? "Market value" : s === "rev" ? "Revenue" : "1y return"}</button>)}
        </div>
        <DataTable<Company>
          rows={sorted.slice(0, 120)}
          rowKey={(c) => c.id}
          onRow={(c) => setOpen(open === c.id ? null : c.id)}
          columns={[
            { id: "n", label: "Company", render: (c) => <span className="truncate" title={c.name}>{c.name}</span> },
            { id: "c", label: "Home", render: (c) => <span className="dim truncate">{countries[c.country]?.name ?? c.country}</span> },
            { id: "cap", label: "Value", right: true, render: (c) => <span className="mono">${credits(c.valuation)}</span> },
            { id: "r", label: "1y", right: true, render: (c) => <span className={`mono ${deltaClass(ret(c))}`}>{signedPct(ret(c), 0)}</span> },
          ]}
        />
        {selected && <div style={{ marginTop: 8 }}><CompanyCard co={selected} mine={selected.country === player} /></div>}
      </Panel>
    </div>
  );
}

// ===========================================================================
// Wars
// ===========================================================================

function occupationLabel(w: War, f: War["fronts"][number], countries: Record<string, Country>): string {
  const o = frontOccupation(w, f, countries);
  return o && o.share >= 0.005 ? `${o.holderName} holds ${(o.share * 100).toFixed(1)}% of ${countries[o.territory].name}` : "";
}

/** Negotiate an end to a war: take land, give land, and settle the bill. */
export function PeaceDeal() {
  const warId = useStore((s) => s.peaceWar);
  const drawing = useStore((s) => s.peaceDrawing);
  const drawn = useStore((s) => s.peaceDrawn);
  const wars = useStore((s) => s.wars);
  const countries = useStore((s) => s.countries);
  const player = useStore((s) => s.playerCountry);
  const set = useStore((s) => s.set);
  const [enemyChoice, setEnemy] = useState<string | null>(null);
  const [annexOccupied, setAnnexOccupied] = useState(false);
  const [annexWhole, setAnnexWhole] = useState(false);
  const [cede, setCede] = useState(false);
  const [reparations, setReparations] = useState(0);
  const [puppet, setPuppet] = useState(false);
  const war = wars.find((w) => w.id === warId);
  if (!war || !player || war.endedAt || !war.belligerents[player] || drawing) return null;

  const facing = Object.keys(war.belligerents).filter((b) => b !== player && war.fronts.some((f) => f.belligerents.includes(b) && f.belligerents.includes(player)));
  const enemies = facing.length ? facing : Object.keys(war.belligerents).filter((b) => b !== player && !(war.belligerents[player] ?? []).includes(b) && !(war.belligerents[b] ?? []).includes(player));
  const enemy = enemyChoice && enemies.includes(enemyChoice) ? enemyChoice : enemies[0];
  if (!enemy) return null;
  const foe = countries[enemy];
  const foeName = foe?.name ?? war.rebels?.[enemy]?.name ?? enemy;
  const standing = peaceStanding(war, player, enemy, countries);
  const usableDrawn = drawn && drawn.territory === enemy ? drawn : null;
  const terms = { annexOccupied: annexOccupied && standing.mine > 0, annexWhole: annexWhole && standing.mine >= 0.8, cede: cede && standing.theirs > 0, drawnShare: usableDrawn?.share ?? 0, reparations };
  const accepted = peaceAccepted(terms, standing);
  const cost = peaceCost(terms, standing);
  const close = () => set({ peaceWar: null, peaceDrawn: null });

  const propose = async () => {
    const r = await act({
      type: "propose-peace", war: war.id, enemy, annexOccupied: terms.annexOccupied, annexWhole: terms.annexWhole, cede: terms.cede, reparations, puppet,
      occupiedRing: standing.mineFront >= 0 ? frontRing(war.id, standing.mineFront) : undefined,
      cededRing: standing.theirsFront >= 0 ? frontRing(war.id, standing.theirsFront) : undefined,
      drawn: usableDrawn ? { ring: usableDrawn.ring, share: usableDrawn.share } : undefined,
    });
    if (r.ok) close();
  };

  return (
    <div className="modal" onClick={close}>
      <div className="card modal__body peace" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={`Peace deal, ${war.name}`}>
        <div className="row"><h3 className="grow" style={{ fontSize: 18 }}>Peace deal: {war.name}</h3><button className="btn btn--sm" onClick={close}>Close</button></div>
        {enemies.length > 1 && (
          <label className="field"><span>Negotiating with</span>
            <select className="select" value={enemy} onChange={(e) => { setEnemy(e.target.value); set({ peaceDrawn: null }); }}>
              {enemies.map((b) => <option key={b} value={b}>{countries[b]?.name ?? war.rebels?.[b]?.name ?? b}</option>)}
            </select>
          </label>
        )}
        <div className="scroll grow" style={{ minHeight: 0 }}>
          <Stat label={`You hold of ${foeName}`} value={`${(standing.mine * 100).toFixed(1)}%`} />
          <Stat label={`${foeName} holds of you`} value={`${(standing.theirs * 100).toFixed(1)}%`} tone={standing.theirs > 0 ? "neg" : ""} />
          <Stat label="Your exhaustion / theirs" value={`${Math.round(war.exhaustion[player] ?? 0)} / ${Math.round(war.exhaustion[enemy] ?? 0)}`} />

          <div className="eyebrow" style={{ margin: "12px 0 6px" }}>Land</div>
          {foe && <label className="check"><input type="checkbox" disabled={standing.mine <= 0} checked={terms.annexOccupied} onChange={(e) => setAnnexOccupied(e.target.checked)} /> Annex occupied territories ({(standing.mine * 100).toFixed(1)}%)</label>}
          {foe && <label className="check"><input type="checkbox" disabled={standing.mine < 0.8} checked={terms.annexWhole} onChange={(e) => setAnnexWhole(e.target.checked)} /> Annex all of {foeName}{standing.mine < 0.8 ? " (needs 80% held)" : ""}</label>}
          {foe && (terms.annexOccupied || terms.annexWhole || terms.drawnShare > 0) && (
            <label className="check"><input type="checkbox" checked={puppet} onChange={(e) => setPuppet(e.target.checked)} /> Set up a puppet state from this land</label>
          )}
          {foe && puppet && (terms.annexOccupied || terms.annexWhole || terms.drawnShare > 0) && (
            <div className="dim" style={{ fontSize: 11, paddingLeft: 20 }}>
              {terms.annexWhole ? `${foeName} stays on the map under your protection.` : `The land you take becomes ${foeName} Protectorate, ruled from your capital in all but name.`}
            </div>
          )}
          {foe && (
            <div className="row row--wrap" style={{ gap: 6, margin: "6px 0" }}>
              <button className="btn btn--sm" onClick={() => set({ peaceDrawing: enemy })}>{usableDrawn ? "Redraw land" : "Draw land on the map"}</button>
              {usableDrawn && <span className="mono" style={{ fontSize: 12 }}>{(usableDrawn.share * 100).toFixed(1)}% of {foeName}</span>}
              {usableDrawn && <button className="btn btn--sm" onClick={() => set({ peaceDrawn: null })}>Remove</button>}
            </div>
          )}
          {foe && standing.theirs > 0 && <label className="check"><input type="checkbox" checked={terms.cede} onChange={(e) => setCede(e.target.checked)} /> Give up the land they hold ({(standing.theirs * 100).toFixed(1)}%)</label>}

          <div className="eyebrow" style={{ margin: "12px 0 6px" }}>Reparations</div>
          {foe ? (
            <label className="slider">
              <span className="row" style={{ justifyContent: "space-between", fontSize: 12 }}>
                <span>{reparations > 0 ? `${foeName} pays you` : reparations < 0 ? `You pay ${foeName}` : "None"}</span>
                <span className="mono">{reparations ? `$${credits(foe.economy.gdp * Math.abs(reparations))} · ${pct0(Math.abs(reparations))} of their GDP` : ""}</span>
              </span>
              <input type="range" min={-0.3} max={0.3} step={0.01} value={reparations} onChange={(e) => setReparations(Number(e.target.value))} />
            </label>
          ) : <div className="dim" style={{ fontSize: 12 }}>An insurgency has no treasury to pay from.</div>}
        </div>
        <div className="peace__verdict" style={{ borderColor: accepted ? "var(--positive)" : "var(--negative)" }}>
          <strong className={accepted ? "pos" : "neg"}>{accepted ? `${foeName} would accept` : `${foeName} would refuse`}</strong>
          <span className="dim mono" style={{ fontSize: 11 }}>You ask {cost.toFixed(0)} · your position supports {standing.leverage.toFixed(0)}</span>
          <div className="dim" style={{ fontSize: 11 }}>Any land not named here goes back to its owner.</div>
        </div>
        <button className="btn btn--primary" style={{ justifyContent: "center", padding: "9px 12px", marginTop: 8, flex: "none" }} disabled={!accepted} onClick={() => void propose()}>Sign peace</button>
      </div>
    </div>
  );
}

function StanceButtons({ war, player }: { war: War; player: string }) {
  const current = war.stance?.[player] ?? "balanced";
  return (
    <div className="row" style={{ gap: 4, marginTop: 6 }}>
      {(["offensive", "balanced", "defensive"] as const).map((s) => (
        <button key={s} className={`btn btn--sm ${current === s ? "btn--active" : ""}`} onClick={() => void act({ type: "set-stance", war: war.id, stance: s })}>{s === "offensive" ? "Attack" : s === "balanced" ? "Hold" : "Dig in"}</button>
      ))}
    </div>
  );
}

export function WarPanel({ wars, countries, onPick }: { wars: War[]; countries: Record<string, Country>; onPick: (id: string) => void }) {
  const active = wars.filter((w) => !w.endedAt);
  const ended = wars.filter((w) => w.endedAt);
  const name = (w: War, id: string) => countries[id]?.name ?? w.rebels?.[id]?.name ?? id;
  const player = useStore((s) => s.playerCountry);
  return (
    <div className="scroll pad grow" style={{ minHeight: 0 }}>
      <div className="row" style={{ marginBottom: 10 }}>
        <Chip tone={active.length ? "var(--negative)" : "var(--positive)"}>{active.length} active</Chip>
        <Chip>{ended.length} concluded</Chip>
      </div>
      {!wars.length && <Empty>The world is at peace.</Empty>}
      {active.map((w) => (
        <div key={w.id} className="card" style={{ marginBottom: 10 }}>
          <strong>{w.name}</strong>
          <div className="dim" style={{ fontSize: 11.5, margin: "4px 0 8px" }}>{w.cause}</div>
          {w.aims && w.aims.length > 0 && (
            <div style={{ display: "grid", gap: 2, marginBottom: 8 }}>
              <span className="mono dim" style={{ fontSize: 10.5, letterSpacing: ".08em" }}>WAR AIMS</span>
              {w.aims.map((aim, i) => (
                <span key={i} className="dim" style={{ fontSize: 11 }}>{name(w, aim.holder)}: {aim.label}</span>
              ))}
            </div>
          )}
          {Object.keys(w.belligerents).map((s) => (
            <div key={s} className="row" style={{ justifyContent: "space-between", fontSize: 11.5, cursor: countries[s] ? "pointer" : undefined }} onClick={() => countries[s] && onPick(s)}>
              <span className="truncate">{name(w, s)}</span>
              <span className="mono dim">exhausted {Math.round(w.exhaustion[s] ?? 0)}%</span>
            </div>
          ))}
          {w.fronts.map((f) => (
            <div key={f.id} style={{ marginTop: 6 }}>
              <div className="row" style={{ justifyContent: "space-between", fontSize: 11 }}><span className="dim truncate">{f.name} · {f.terrain}</span><span className="mono">{occupationLabel(w, f, countries)}</span></div>
              <div className="front" title={`${name(w, f.belligerents[0])} on the left`}>
                <span style={{ width: `${(f.control + 100) / 2}%`, background: countries[f.belligerents[0]]?.mapColor ?? "var(--accent-2)" }} />
                <span style={{ flex: 1, background: countries[f.belligerents[1]]?.mapColor ?? "var(--ink-muted)" }} />
              </div>
            </div>
          ))}
          <Stat label="Casualties" value={Math.round(Object.values(w.casualties).reduce((a, b) => a + b, 0)).toLocaleString("en-US")} />
          {player && w.belligerents[player] && <StanceButtons war={w} player={player} />}
          {player && w.belligerents[player] && <button className="btn btn--sm btn--primary" style={{ marginTop: 6 }} onClick={() => useStore.getState().set({ peaceWar: w.id, peaceDrawn: null })}>Peace deal</button>}
        </div>
      ))}
      {ended.length > 0 && (
        <Panel title="Concluded" defaultOpen={false}>
          {ended.map((w) => <div key={w.id} style={{ fontSize: 12 }}>{w.name}{w.outcome ? `: ${w.outcome.replace(/-/g, " ")}` : ""}</div>)}
        </Panel>
      )}
    </div>
  );
}

// ===========================================================================
// Rankings
// ===========================================================================

const METRICS: { id: string; label: string; get: (c: Country) => number; fmt: (v: number) => string }[] = [
  { id: "gdp", label: "GDP", get: (c) => c.economy.gdp, fmt: (v) => `$${credits(v)}` },
  { id: "gdpPc", label: "Per person", get: (c) => c.economy.gdpPerCapita, fmt: (v) => `$${money(v, 0)}` },
  { id: "growth", label: "Growth", get: (c) => c.economy.gdpGrowth, fmt: (v) => signedPct(v, 1) },
  { id: "inflation", label: "Inflation", get: (c) => c.economy.monetary.inflation, fmt: (v) => signedPct(v, 1) },
  { id: "unemployment", label: "Jobless", get: (c) => c.economy.labour.unemployment, fmt: (v) => pct(v) },
  { id: "debt", label: "Debt", get: (c) => c.economy.fiscal.debtToGdp, fmt: (v) => pct0(v) },
  { id: "approval", label: "Approval", get: (c) => c.executive.approval, fmt: (v) => `${v.toFixed(0)}%` },
  { id: "military", label: "Military", get: (c) => c.military.activeDuty, fmt: (v) => people(v) },
];

export function RankingPanel({ countries, onPick }: { countries: Record<string, Country>; onPick: (id: string) => void }) {
  const [metric, setMetric] = useState("gdp");
  const m = METRICS.find((x) => x.id === metric) ?? METRICS[0];
  const rows = useMemo(() => Object.values(countries).filter((c) => !c.annexedBy).sort((a, b) => m.get(b) - m.get(a)).slice(0, 100), [countries, m]);
  return (
    <div className="scroll pad grow" style={{ minHeight: 0 }}>
      <div className="row row--wrap" style={{ marginBottom: 10, gap: 4 }}>
        {METRICS.map((x) => <button key={x.id} className={`btn btn--sm ${metric === x.id ? "btn--active" : ""}`} onClick={() => setMetric(x.id)}>{x.label}</button>)}
      </div>
      <DataTable<Country>
        rows={rows}
        rowKey={(c) => c.id}
        onRow={(c) => onPick(c.id)}
        columns={[
          { id: "n", label: "Country", render: (c) => <span className="row" style={{ gap: 6 }}><Flag c={c} size={11} /><span className="truncate">{c.name}</span></span> },
          { id: "v", label: m.label, right: true, render: (c) => <span className="mono">{m.fmt(m.get(c))}</span> },
        ]}
      />
    </div>
  );
}

export { can, YEAR };

/** A state coming apart: pressure, armed revolt, republics leaving. */
export function CrisisBanner({ c, mine }: { c: Country; mine: boolean }) {
  const crisis = c.crisis;
  if (!crisis) return null;
  const tone = crisis.tension > 0.6 ? "var(--negative)" : "#d08b2c";
  return (
    <div className="card" style={{ borderColor: tone, display: "grid", gap: 8, marginBottom: 8 }}>
      <div className="row">
        <strong className="grow">State crisis</strong>
        <Chip>{crisis.stage}</Chip>
      </div>
      <Bar value={crisis.tension} tone={tone} />
      <div className="dim" style={{ fontSize: 11 }}>
        {Math.round(crisis.tension * 100)}% towards dissolution
        {crisis.lost.length ? ` · ${crisis.lost.length} land${crisis.lost.length === 1 ? "" : "s"} lost` : ""}
      </div>
      {mine && (
        <div className="row row--wrap" style={{ gap: 4 }}>
          <button className="btn btn--sm" onClick={() => void act({ type: "crisis-response", measure: "reform" })}>Reform</button>
          <button className="btn btn--sm" onClick={() => void act({ type: "crisis-response", measure: "subsidies" })}>Subsidise</button>
          <button className="btn btn--sm btn--danger" onClick={() => void act({ type: "crisis-response", measure: "crackdown" })}>Crack down</button>
          <button className="btn btn--sm" onClick={() => void act({ type: "crisis-response", measure: "concede" })}>Let a republic go</button>
        </div>
      )}
    </div>
  );
}

/** Major and catastrophic events, as cards that stay until dismissed. */
export function EventPopup() {
  const events = useStore((s) => s.events);
  const [dismissed, setDismissed] = useState<Record<string, true>>({});
  const queue = events
    .filter((e) => (e.severity === "catastrophic" || e.severity === "major") && !dismissed[e.id])
    .slice(-8)
    .reverse()
    // One card per story: a collapsing state fires the same headline repeatedly.
    .filter((e, i, all) => all.findIndex((x) => x.title === e.title) === i)
    .slice(0, 2);
  if (!queue.length) return null;
  return (
    <div style={{ position: "fixed", top: 64, right: 16, zIndex: 25, display: "grid", gap: 8, width: "min(400px, 92vw)" }}>
      {queue.map((e) => (
        <div key={e.id} className="card" style={{ borderColor: e.severity === "catastrophic" ? "var(--negative)" : "#d08b2c", display: "grid", gap: 4 }}>
          <div className="row" style={{ gap: 6 }}>
            <Chip>{e.severity}</Chip>
            <strong className="grow truncate" style={{ fontSize: 12 }}>{e.title}</strong>
            <button className="btn btn--sm" onClick={() => setDismissed((d) => ({ ...d, [e.id]: true }))}>&times;</button>
          </div>
          <div className="dim" style={{ fontSize: 12 }}>{e.body}</div>
        </div>
      ))}
    </div>
  );
}
/** The front page: events as a newspaper instead of cards over the budget. */
export function NewspaperButton() {
  const events = useStore((s) => s.events);
  const countries = useStore((s) => s.countries);
  const start = useStore((s) => s.scenario?.startDate);
  const [open, setOpen] = useState(false);
  const stories = useMemo(() => [...events].reverse(), [events]);
  if (!stories.length) return null;
  const lead = stories[0];
  const urgent = stories.filter((e) => e.severity === "catastrophic").length;
  return (
    <>
      <button className="btn btn--sm" onClick={() => setOpen(true)} title="Open the newspaper">
        Newspaper{urgent ? ` · ${urgent}` : ""}
      </button>
      {open && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="card" style={{ width: "min(860px, 94vw)", maxHeight: "86vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ borderBottom: "2px solid var(--rule)", paddingBottom: 8, marginBottom: 12 }}>
              <div className="row">
                <strong style={{ fontSize: 22, letterSpacing: 1 }}>THE CROWN GAZETTE</strong>
                <span className="grow" />
                <button className="btn btn--sm" onClick={() => setOpen(false)}>Close</button>
              </div>
              <div className="dim" style={{ fontSize: 11 }}>{start ? simDate(start, lead.t) : ""} · {stories.length} stories</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.2 }}>{lead.title}</div>
              <div className="dim" style={{ fontSize: 11 }}>{lead.country ? countries[lead.country]?.name ?? lead.country : "World"} · {lead.kind}</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{lead.body}</div>
            </div>
            <div style={{ columnCount: 2, columnGap: 20 }}>
              {stories.slice(1).map((e) => (
                <div key={e.id} style={{ breakInside: "avoid", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{e.title}</div>
                  <div className="dim" style={{ fontSize: 11 }}>{start ? simDate(start, e.t) : ""} · {e.country ? countries[e.country]?.name ?? e.country : "World"}</div>
                  <div style={{ fontSize: 12 }}>{e.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
/** Room chat for a live multiplayer world. */
export function ChatBox() {
  const worldId = useStore((s) => s.worldId);
  const user = useStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<{ user: string; text: string; at: number }[]>([]);
  useEffect(() => {
    if (!worldId || !open) return;
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch(`/api/worlds/${encodeURIComponent(worldId)}/chat`);
        const j = (await r.json()) as { messages?: { user: string; text: string; at: number }[] };
        if (alive) setMsgs(j.messages ?? []);
      } catch {
        if (alive) setMsgs([]);
      }
    };
    void load();
    const id = window.setInterval(load, 6000);
    return () => { alive = false; window.clearInterval(id); };
  }, [worldId, open]);
  if (!worldId || !user) return null;
  return (
    <div style={{ position: "fixed", left: 16, bottom: 56, zIndex: 20, width: "min(300px, 86vw)" }}>
      <button className="btn btn--sm" aria-expanded={open} onClick={() => setOpen((v) => !v)}>Chat</button>
      {open && (
        <div className="card" style={{ display: "grid", gap: 6, marginTop: 6, maxHeight: "34vh" }}>
          <div style={{ overflow: "auto", display: "grid", gap: 4, maxHeight: "24vh" }}>
            {msgs.length === 0 && <div className="dim" style={{ fontSize: 11 }}>No messages yet.</div>}
            {msgs.map((m, i) => (
              <div key={i} style={{ fontSize: 12 }}><strong>{m.user}</strong> <span className="dim">{m.text}</span></div>
            ))}
          </div>
          <form
            className="row"
            style={{ gap: 4 }}
            onSubmit={(e) => {
              e.preventDefault();
              const body = text.trim();
              if (!body) return;
              setText("");
              void fetch(`/api/worlds/${encodeURIComponent(worldId)}/chat`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: body }) });
            }}
          >
            <input className="input grow" value={text} onChange={(e) => setText(e.target.value)} placeholder="Message" />
            <button className="btn btn--sm" type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}