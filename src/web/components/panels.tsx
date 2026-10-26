import { useMemo, useState } from "react";
import type { Bill, Company, Country, MarketState, War } from "../../shared/types";
import { SECTORS } from "../../data/economy";
import { credits, money, pct, pct0, people, signedPct, GOVERNMENT_LABELS, SECTOR_ORDER, deltaClass } from "../format";
import { Bar, Chip, DataTable, Empty, Panel, Stat, Tabs } from "./primitives";

// ===========================================================================
// Country panel: the economy, the state, the military, the legislature.
// ===========================================================================

export function CountryPanel({ country, warCount, onAct, bills }: { country: Country | null; warCount: number; onAct?: (op: Record<string, unknown>) => void; bills?: Record<string, Bill> }) {
  const [tab, setTab] = useState("economy");
  const c = country;
  if (!c) return <Empty>Select a country on the map</Empty>;

  return (
    <>
      <header className="pad" style={{ borderBottom: "1px solid var(--rule)" }}>
        <div className="row">
          <span style={{ fontSize: 22 }}>{c.flagEmoji}</span>
          <div className="grow">
            <h2 style={{ fontSize: 19 }}>{c.name}</h2>
            <div className="dim" style={{ fontSize: 11 }}>
              {c.formalName && c.formalName !== c.name ? `${c.formalName} · ` : ""}
              {GOVERNMENT_LABELS[c.government] ?? c.government}
            </div>
          </div>
          {warCount > 0 && <Chip tone="var(--negative)">War</Chip>}
          {c.annexedBy && <Chip tone="var(--negative)">Abolished</Chip>}
          {c.overlord && !c.annexedBy && <Chip tone="var(--ink-muted)">Possession</Chip>}
          {c.banned && <Chip tone="var(--negative)">Banned</Chip>}
        </div>
      </header>

      <Tabs
        tabs={[
          { id: "economy", label: "Economy" },
          { id: "state", label: "State", badge: c.parties.length },
          { id: "chamber", label: "Legislature", badge: c.legislature?.activeBills.length },
          { id: "military", label: "Military" },
          { id: "trade", label: "Trade" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="scroll pad">
        {tab === "economy" && <Economy c={c} onAct={onAct} />}
        {tab === "state" && <State c={c} />}
        {tab === "chamber" && <Chamber c={c} onAct={onAct} bills={bills ?? {}} />}
        {tab === "military" && <Military c={c} />}
        {tab === "trade" && <Trade c={c} />}
      </div>
    </>
  );
}

function Economy({ c, onAct }: { c: Country; onAct?: (op: Record<string, unknown>) => void }) {
  const e = c.economy;
  const spending = e.fiscal.military + e.fiscal.welfare + e.fiscal.infrastructure + e.fiscal.education + e.fiscal.healthcare + e.fiscal.administration;
  return (
    <div className="stack">
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Output</div>
        <Stat label="GDP" value={credits(e.gdp)} />
        <Stat label="Per capita" value={money(e.gdpPerCapita, 0)} />
        <Stat label="Growth" value={signedPct(e.gdpGrowth)} tone={e.gdpGrowth >= 0 ? "pos" : "neg"} />
        <Stat label="Population" value={people(e.population)} />
        <Stat label="Productivity" value={e.productivity.toFixed(1)} />
      </div>

      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Prices and labour</div>
        <Stat label="Inflation" value={signedPct(e.monetary.inflation)} tone={e.monetary.inflation > 0.04 ? "neg" : ""} />
        <Stat label="Policy rate" value={pct(e.monetary.policyRate, 2)} />
        <Stat label="Unemployment" value={pct(e.labour.unemployment)} tone={e.labour.unemployment > 0.08 ? "neg" : "pos"} />
        <Stat label="Strike risk" value={pct0(e.labour.strikeRisk)} />
        <Stat label="Unionisation" value={pct0(e.labour.unionisation)} />
        <Stat label="Median wage" value={money(e.labour.medianWage, 0)} />
        <Stat label="Satisfaction" value={pct0(e.labour.satisfaction)} />
        <Stat label="Exchange rate" value={money(e.monetary.exchangeRateVsUsd, 3)} />
      </div>

      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Public finances</div>
        <Stat label="Revenue" value={credits(e.fiscal.revenue)} />
        <Stat label="Expenditure" value={credits(e.fiscal.expenditure)} />
        <Stat label="Balance" value={signedPct(e.fiscal.budgetBalanceRatio)} tone={e.fiscal.budgetBalanceRatio >= 0 ? "pos" : "neg"} />
        <Stat label="Debt" value={credits(e.fiscal.debt)} />
        <Stat label="Debt / GDP" value={pct0(e.fiscal.debtToGdp)} tone={e.fiscal.debtToGdp > 1 ? "neg" : ""} />
        <Stat label="Debt service" value={credits(e.fiscal.debtService)} />
        <Stat label="Credit rating" value={pct0(e.fiscal.creditRating)} />
        <Stat label="Treasury" value={credits(e.fiscal.treasury)} />
        <Stat label="Reserves" value={credits(e.reserves)} />
        <div className="stack" style={{ marginTop: 8 }}>
          {[
            ["Military", e.fiscal.military],
            ["Welfare", e.fiscal.welfare],
            ["Infrastructure", e.fiscal.infrastructure],
            ["Education", e.fiscal.education],
            ["Health", e.fiscal.healthcare],
            ["Administration", e.fiscal.administration],
            ["Debt service", e.fiscal.debtService],
          ].map(([label, v]) => (
            <div key={String(label)}>
              <div className="row" style={{ justifyContent: "space-between", fontSize: 11 }}>
                <span className="dim">{label}</span>
                <span className="mono">{pct0(Number(v) / (spending || 1))}</span>
              </div>
              <Bar value={Number(v)} max={spending || 1} />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
          <span className="eyebrow">Sectors</span>
          <span className="dim mono" style={{ fontSize: 11 }}>R&amp;D {pct(e.rd / Math.max(1, e.gdp), 2)}</span>
        </div>
        <div className="stack">
          {[...e.sectors].sort((a, b) => b.share - a.share).map((s) => {
            const prof = SECTORS[s.id];
            return (
              <div key={s.id} title={prof?.blurb}>
                <div className="row" style={{ justifyContent: "space-between", fontSize: 11.5 }}>
                  <span className="truncate">{prof?.label ?? s.id}</span>
                  <span className="row" style={{ gap: 8 }}>
                    <span className={deltaClass(s.growth)}>{signedPct(s.growth)}</span>
                    <span className="mono dim">{pct0(s.share)}</span>
                  </span>
                </div>
                <Bar value={s.share} max={Math.max(...e.sectors.map((x) => x.share))} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Structural</div>
        <Stat label="Corruption" value={pct0(e.corruption)} tone={e.corruption > 0.5 ? "neg" : ""} />
        <Stat label="Inequality" value={pct0(e.inequality)} tone={e.inequality > 0.5 ? "neg" : ""} />
        <Stat label="Net foreign assets" value={credits(e.netForeignAssets)} />
        {onAct && (
          <div className="row row--wrap" style={{ marginTop: 8, gap: 6 }}>
            <button className="btn btn--sm" onClick={() => onAct({ type: "set-policy", country: c.id, area: "economy", value: Math.min(100, c.policies.economy + 20) })}>Invest &minus;</button>
            <button className="btn btn--sm" onClick={() => onAct({ type: "set-policy", country: c.id, area: "economy", value: Math.min(100, c.policies.economy + 20) })}>Invest +</button>
            <button className="btn btn--sm" onClick={() => onAct({ type: "set-policy", country: c.id, area: "tax", value: Math.max(-100, c.policies.tax - 15) })}>Cut tax</button>
            <button className="btn btn--sm" onClick={() => onAct({ type: "set-policy", country: c.id, area: "tax", value: Math.min(100, c.policies.tax + 15) })}>Raise tax</button>
          </div>
        )}
      </div>
    </div>
  );
}

function State({ c }: { c: Country }) {
  const hos = c.executive.headOfStateId;
  const hog = c.executive.headOfGovernmentId;
  return (
    <div className="stack">
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Government</div>
        <Stat label={c.headOfStateTitle} value={hos ?? "vacant"} />
        <Stat label={c.headOfGovernmentTitle} value={hog ?? "vacant"} />
        <Stat label="Approval" value={pct0(c.executive.approval)} tone={c.executive.approval > 50 ? "pos" : "neg"} />
        <Stat label="Confidence" value={pct0(c.executive.confidence)} />
        <Stat label="Coalition" value={`${c.executive.coalition.length} part${c.executive.coalition.length === 1 ? "y" : "ies"}`} />
        <Stat label="Emergency powers" value={c.executive.emergencyPowers ? "In force" : "Not invoked"} tone={c.executive.emergencyPowers ? "neg" : ""} />
      </div>

      <Panel title={`Parties (${c.parties.length})`} defaultOpen>
        <DataTable
          rows={c.parties}
          rowKey={(p) => p.id}
          empty="No parties registered"
          columns={[
            {
              id: "name",
              label: "Party",
              render: (p) => (
                <span className="row" style={{ gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: "inline-block" }} />
                  <span className="truncate">{p.abbreviation}</span>
                  {p.status !== "outside" && <Chip tone={p.status === "government" ? "var(--positive)" : "var(--ink-muted)"}>{p.status === "ruling" ? "Ruling" : p.status}</Chip>}
                </span>
              ),
            },
            {
              id: "seats",
              label: "Seats",
              right: true,
              render: (p) => {
                const ch = c.legislature?.chambers[0]?.id ?? "chamber-1";
                return <span className="mono">{p.seats[ch] ?? 0}</span>;
              },
              sort: (a, b) => (b.seats[c.legislature?.chambers[0]?.id ?? "chamber-1"] ?? 0) - (a.seats[c.legislature?.chambers[0]?.id ?? "chamber-1"] ?? 0),
            },
            { id: "ideo", label: "Ideology", right: true, render: (p) => <span className="mono dim">{p.ideology > 0 ? "+" : ""}{p.ideology}</span>, sort: (a, b) => b.ideology - a.ideology },
            { id: "coh", label: "Cohesion", right: true, render: (p) => <span className="mono">{pct0(p.cohesion / 100)}</span>, sort: (a, b) => b.cohesion - a.cohesion },
            { id: "pop", label: "Polls", right: true, render: (p) => <span className="mono">{pct0(p.popularity / 100)}</span>, sort: (a, b) => b.popularity - a.popularity },
            { id: "cash", label: "Funds", right: true, render: (p) => <span className="mono dim">{credits(p.treasury)}</span>, sort: (a, b) => b.treasury - a.treasury },
          ]}
        />
      </Panel>

      <Panel title={`Ministers (${c.executive.ministers.filter((m) => m.characterId).length}/${c.executive.ministers.length})`}>
        <div className="stack">
          {c.executive.ministers.map((m) => (
            <div key={m.id} className="row" style={{ fontSize: 12 }}>
              <span className="dim grow truncate">{m.title}</span>
              <span className="mono">{m.characterId ?? "vacant"}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title={`Unrest (${c.unrest.length})`}>
        {c.unrest.length ? (
          <div className="stack">
            {c.unrest.map((u) => (
              <div key={u.id} className="row" style={{ fontSize: 12 }}>
                <span className="grow">{u.kind.replace(/-/g, " ")}</span>
                <span className="mono">{Math.round(u.intensity)}</span>
              </div>
            ))}
            <Stat label="Risk" value={pct0(c.unrestRisk)} tone={c.unrestRisk > 0.06 ? "neg" : ""} />
          </div>
        ) : (
          <div className="dim" style={{ fontSize: 12 }}>Orderly.</div>
        )}
      </Panel>
    </div>
  );
}

function Chamber({ c, onAct, bills }: { c: Country; onAct?: (op: Record<string, unknown>) => void; bills: Record<string, Bill> }) {
  const lg = c.legislature;
  if (!lg) return <Empty>{c.name} has no legislature.</Empty>;
  return (
    <div className="stack">
      {lg.chambers.map((ch) => {
        const total = Object.values(c.parties).reduce((a, p) => a + (p.seats[ch.id] ?? 0), 0) || 1;
        return (
          <Panel key={ch.id} title={`${ch.name} · ${ch.seats} seats`}>
            <div className="row dim" style={{ fontSize: 11, marginBottom: 6 }}>
              {ch.kind} &middot; {ch.election.replace(/-/g, " ")} &middot; {ch.termDays}d term
              {ch.moneyBills ? " · money bills" : ""}
              {ch.confirmsAppointments ? " · confirms appointments" : ""}
            </div>
            <DataTable
              rows={c.parties.filter((p) => (p.seats[ch.id] ?? 0) > 0)}
              rowKey={(p) => p.id}
              empty="No seats"
              maxHeight={220}
              columns={[
                { id: "p", label: "Party", render: (p) => <span className="truncate">{p.name}</span> },
                { id: "s", label: "Seats", right: true, render: (p) => <span className="mono">{p.seats[ch.id]}</span>, sort: (a, b) => (b.seats[ch.id] ?? 0) - (a.seats[ch.id] ?? 0) },
                { id: "h", label: "Share", right: true, render: (p) => <span className="mono dim">{pct0((p.seats[ch.id] ?? 0) / total)}</span> },
              ]}
            />
          </Panel>
        );
      })}

      <Panel title={`Committees (${lg.committees.length})`} defaultOpen={false}>
        <div className="stack">
          {lg.committees.map((cm) => (
            <div key={cm.id} className="row" style={{ fontSize: 12 }}>
              <span className="grow truncate">{cm.name}</span>
              <span className="dim mono">{cm.jurisdiction.join(", ")}</span>
              <span className="mono" style={{ width: 40, textAlign: "right" }}>{Math.round(cm.power)}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title={`Bills (${lg.activeBills.length})`}>
        {lg.activeBills.length ? (
          <div className="stack">
            {lg.activeBills.slice(-12).map((id) => {
              const b = bills[id];
              if (!b) return null;
              return (
                <div key={id} className="card">
                  <div className="row">
                    <span className="grow truncate" style={{ fontSize: 12.5 }}>{b.title}</span>
                    <Chip>{b.status.replace(/-/g, " ")}</Chip>
                  </div>
                  <div className="dim" style={{ fontSize: 11, marginTop: 3 }}>{b.summary}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="dim" style={{ fontSize: 12 }}>No bills before the house.</div>
        )}
        {onAct && (
          <div className="row row--wrap" style={{ marginTop: 10, gap: 6 }}>
            <button
              className="btn btn--sm"
              onClick={() => {
                const title = prompt("Bill title") ?? "Budget Measures";
                const cost = Number(prompt("Annual cost (credits)", "0") ?? 0);
                const area = prompt("Policy area (economy, defence, health, welfare, education, tax, technology)", "economy") ?? "economy";
                const effect = Number(prompt("Growth effect per year, e.g. 0.01", "0.01") ?? 0.01);
                onAct({
                  type: "introduce-bill",
                  country: c.id,
                  title,
                  summary: `${area} package costing ${credits(cost)} a year.`,
                  body: "",
                  category: cost > 0 ? "money" : "ordinary",
                  sponsorId: c.executive.headOfGovernmentId ?? "",
                  sponsorPartyId: c.executive.coalition[0] ?? "",
                  cost,
                  effects: { sectorGrowth: { [sectorForPolicy(area)]: effect } },
                });
              }}
            >
              Draft a bill
            </button>
            <button className="btn btn--sm" onClick={() => onAct({ type: "raise-referendum", country: c.id, question: prompt("Referendum question?", "Shall the current government continue in office?") })}>Call referendum</button>
          </div>
        )}
      </Panel>

      <Panel title="Elections" defaultOpen={false}>
        {c.elections.filter((e) => e.status !== "complete").length ? (
          <div className="stack">
            {c.elections.filter((e) => e.status !== "complete").map((e) => (
              <div key={e.id} className="card">
                <div className="row"><span className="grow">{lg.chambers.find((ch) => ch.id === e.chamberId)?.name}</span><Chip>{e.status}</Chip></div>
                <Stat label="Counted" value={`${Object.keys(e.votes).length}/${e.districtCount}`} />
                <Stat label="Enthusiasm" value={pct0(e.enthusiasm / 100)} />
                <div className="stack" style={{ marginTop: 6 }}>
                  {Object.entries(e.projection).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([pid, n]) => (
                    <div key={pid}>
                      <div className="row" style={{ justifyContent: "space-between", fontSize: 11 }}>
                        <span className="truncate">{c.parties.find((p) => p.id === pid)?.abbreviation ?? pid}</span>
                        <span className="mono">{Math.round(n)}</span>
                      </div>
                      <Bar value={n} max={lg.chambers.find((ch) => ch.id === e.chamberId)?.seats ?? 1} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dim" style={{ fontSize: 12 }}>No election in progress.</div>
        )}
      </Panel>
    </div>
  );
}

function sectorForPolicy(area: string): string {
  return { economy: "manufacturing", defence: "defence", health: "healthcare", welfare: "healthcare", education: "education", tax: "finance", technology: "technology", energy: "energy", transport: "transport", agriculture: "agriculture", housing: "real-estate", environment: "agriculture", labour: "manufacturing", justice: "finance", immigration: "retail", "foreign-policy": "defence" }[area] ?? "manufacturing";
}

function Military({ c }: { c: Country }) {
  const m = c.military;
  const burden = m.burden;
  return (
    <div className="stack">
      <div className="card">
        <Stat label="Active duty" value={people(m.activeDuty)} />
        <Stat label="Reserves" value={people(m.reserves)} />
        <Stat label="Annual spend" value={credits(m.spend)} />
        <Stat label="Burden (share of GDP)" value={pct(burden)} tone={burden > 0.04 ? "neg" : ""} />
        <Stat label="Readiness" value={pct0(m.readiness)} tone={m.readiness > 60 ? "pos" : "neg"} />
        <Stat label="Morale" value={pct0(m.morale)} />
        <Stat label="Doctrine" value={m.doctrine < -20 ? "Defensive" : m.doctrine > 30 ? "Offensive" : "Balanced"} />
        <Stat label="Conscription" value={m.conscription ? "In force" : "Abolished"} />
        {c.nukes > 0 && <Stat label="Nuclear warheads" value={people(c.nukes)} tone="neg" />}
      </div>
      <Panel title="Branches">
        <DataTable
          rows={Object.entries(m.branches).map(([k, v]) => ({ k, ...v }))}
          rowKey={(r) => r.k}
          columns={[
            { id: "b", label: "Branch", render: (r) => r.k.replace(/-/g, " ") },
            { id: "a", label: "Active", right: true, render: (r) => <span className="mono">{people(r.active)}</span> },
            { id: "q", label: "Quality", right: true, render: (r) => <span className="mono">{Math.round(r.quality)}</span>, sort: (a, b) => b.quality - a.quality },
          ]}
        />
      </Panel>
    </div>
  );
}

function Trade({ c }: { c: Country }) {
  const t = c.economy.trade;
  const partners = Object.entries(t.flows).sort((a, b) => b[1] - a[1]).slice(0, 18);
  return (
    <div className="stack">
      <div className="card">
        <Stat label="Exports" value={credits(t.exports)} />
        <Stat label="Imports" value={credits(t.imports)} />
        <Stat label="Balance" value={signedPct((t.tradeBalance / Math.max(1, c.economy.gdp)), 2)} tone={t.tradeBalance >= 0 ? "pos" : "neg"} />
        <Stat label="Openness" value={pct0(t.tradeOpenness / 100)} />
        <Stat label="Tariff" value={pct(t.tariffRate)} />
      </div>
      <Panel title="Largest partners">
        <DataTable
          rows={partners}
          rowKey={([iso]) => iso}
          empty="No recorded trade"
          maxHeight={340}
          columns={[
            { id: "p", label: "Partner", render: ([iso]) => iso },
            { id: "v", label: "Volume", right: true, render: ([, v]) => <span className="mono">{credits(v)}</span>, sort: (a, b) => b[1] - a[1] },
          ]}
        />
      </Panel>
    </div>
  );
}

// ===========================================================================
// Markets panel
// ===========================================================================

export function MarketPanel({ markets, companies, onTrade }: { markets: MarketState | null; companies: Record<string, Company>; onTrade?: (companyId: string, side: "buy" | "sell", shares: number) => void }) {
  const [sort, setSort] = useState<"cap" | "ret" | "rev">("cap");
  if (!markets) return <Empty>Loading markets</Empty>;
  const listed = Object.values(companies).filter((c) => c.listed && !c.insolvent && !c.banned);
  const sorted = [...listed].sort((a, b) =>
    sort === "cap" ? b.valuation - a.valuation : sort === "rev" ? b.revenue - a.revenue : ret(b) - ret(a),
  );

  return (
    <div className="scroll pad">
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Global</div>
        <Stat label="Sentiment" value={markets.sentiment} tone={markets.sentiment === "euphoric" ? "pos" : markets.sentiment === "crash" ? "neg" : ""} />
        <Stat label="Risk appetite" value={pct0(markets.riskAppetite / 100)} />
        <Stat label="Credit spreads" value={pct(markets.creditSpreads, 2)} tone={markets.creditSpreads > 0.06 ? "neg" : ""} />
      </div>

      <Panel title="Exchanges" defaultOpen>
        <DataTable
          rows={markets.exchanges}
          rowKey={(e) => e.id}
          maxHeight={260}
          columns={[
            { id: "n", label: "Exchange", render: (e) => <span className="truncate">{e.name}</span> },
            { id: "i", label: "Index", right: true, render: (e) => <span className="mono">{e.index.toFixed(0)}</span>, sort: (a, b) => b.index - a.index },
            { id: "r", label: "1y", right: true, render: (e) => <span className={deltaClass(e.index / e.indexYearAgo - 1)}>{signedPct(e.index / e.indexYearAgo - 1, 0)}</span>, sort: (a, b) => b.index / b.indexYearAgo - a.index / a.indexYearAgo },
          ]}
        />
      </Panel>

      <Panel title="Commodities" defaultOpen>
        <div className="stack">
          {Object.entries(markets.commodityPrices).map(([k, v]) => (
            <div key={k} className="row" style={{ justifyContent: "space-between", fontSize: 12 }}>
              <span className="dim">{k.replace(/-/g, " ")}</span>
              <span className="mono">{money(v, v < 10 ? 2 : 0)}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title={`Listed companies (${listed.length})`} defaultOpen>
        <div className="row" style={{ marginBottom: 6, gap: 6 }}>
          {(["cap", "rev", "ret"] as const).map((s) => (
            <button key={s} className={`btn btn--sm ${sort === s ? "btn--active" : ""}`} onClick={() => setSort(s)}>
              {s === "cap" ? "Market cap" : s === "rev" ? "Revenue" : "Return"}
            </button>
          ))}
        </div>
        <DataTable
          rows={sorted.slice(0, 120)}
          rowKey={(c) => c.id}
          empty="Nothing listed"
          maxHeight={520}
          columns={[
            { id: "n", label: "Company", render: (c) => <span className="row" style={{ gap: 5 }}><span className="truncate">{c.name}</span>{c.stateOwnership > 0.5 && <Chip tone="var(--ink-muted)">SOE</Chip>}</span> },
            { id: "c", label: "Country", render: (c) => <span className="dim">{c.country}</span> },
            { id: "cap", label: "Cap", right: true, render: (c) => <span className="mono">{credits(c.valuation)}</span>, sort: (a, b) => b.valuation - a.valuation },
            { id: "r", label: "Return", right: true, render: (c) => <span className={deltaClass(ret(c))}>{signedPct(ret(c), 0)}</span>, sort: (a, b) => ret(b) - ret(a) },
            ...(onTrade
              ? [{
                  id: "t",
                  label: "",
                  right: true,
                  render: (c: Company) => (
                    <span className="row" style={{ gap: 4 }}>
                      <button className="btn btn--sm" onClick={(e) => { e.stopPropagation(); const n = Number(prompt("Shares", "1000")); if (n > 0) onTrade(c.id, "buy", n); }}>Buy</button>
                      <button className="btn btn--sm" onClick={(e) => { e.stopPropagation(); const n = Number(prompt("Shares", "1000")); if (n > 0) onTrade(c.id, "sell", n); }}>Sell</button>
                    </span>
                  ),
                }]
              : []),
          ]}
        />
      </Panel>
    </div>
  );
}

const ret = (c: Company) => c.sharePrice / Math.max(0.01, c.sharePriceYearAgo) - 1;

// ===========================================================================
// Wars panel
// ===========================================================================

export function WarPanel({ wars, countries, onDeclare }: { wars: War[]; countries: Record<string, Country>; onDeclare?: () => void }) {
  const active = wars.filter((w) => !w.endedAt);
  const ended = wars.filter((w) => w.endedAt);
  return (
    <div className="scroll pad">
      <div className="row" style={{ marginBottom: 10 }}>
        <Chip tone={active.length ? "var(--negative)" : "var(--positive)"}>{active.length} active</Chip>
        <Chip>{ended.length} concluded</Chip>
        {onDeclare && <button className="btn btn--sm btn--danger" style={{ marginLeft: "auto" }} onClick={onDeclare}>Declare war</button>}
      </div>

      {!wars.length && <Empty>No conflicts on Earth.</Empty>}

      {active.map((w) => {
        const sides = Object.keys(w.belligerents);
        const total = sides.reduce((a, s) => a + Math.abs(frontBalance(w, s)), 0) || 1;
        return (
          <div key={w.id} className="card" style={{ marginBottom: 10 }}>
            <div className="row">
              <strong className="grow">{w.name}</strong>
              <Chip tone="var(--negative)">{w.phase.replace(/-/g, " ")}</Chip>
            </div>
            <div className="dim" style={{ fontSize: 11.5, margin: "4px 0 8px" }}>{w.cause}</div>
            <div className="stack">
              {sides.map((s) => {
                const bal = frontBalance(w, s);
                return (
                  <div key={s}>
                    <div className="row" style={{ justifyContent: "space-between", fontSize: 11.5 }}>
                      <span className="truncate">{countries[s]?.name ?? s}</span>
                      <span className="mono dim">exhaustion {Math.round(w.exhaustion[s] ?? 0)}</span>
                    </div>
                    <Bar value={Math.abs(bal)} max={total} tone={bal > 0 ? "var(--positive)" : "var(--negative)"} />
                  </div>
                );
              })}
            </div>
            <div className="dim" style={{ fontSize: 11, marginTop: 8 }}>
              {w.fronts.map((f) => `${f.name} (${f.terrain}, control ${Math.round(f.control)})`).join(" · ")}
            </div>
            <Stat label="Casualties" value={Object.values(w.casualties).reduce((a, b) => a + b, 0).toLocaleString()} />
            <Stat label="Public support" value={Object.values(w.publicSupport).map((v) => `${Math.round(v)}`).join(" / ")} />
            {w.warGoal && <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>War goal: {w.warGoal}</div>}
          </div>
        );
      })}
    </div>
  );
}

function frontBalance(w: War, side: string): number {
  let v = 0;
  for (const f of w.fronts) {
    const i = f.belligerents.indexOf(side);
    if (i === 0) v += f.control;
    else if (i === 1) v -= f.control;
  }
  return v;
}

// ===========================================================================
// Rankings
// ===========================================================================

export function RankingPanel({ countries, metric, onPick }: { countries: Record<string, Country>; metric: string; onPick: (iso3: string) => void }) {
  const rows = useMemo(() => Object.values(countries).filter((c) => !c.annexedBy), [countries]);
  const val = (c: Country): number => {
    switch (metric) {
      case "gdp": return c.economy.gdp;
      case "gdpPc": return c.economy.gdpPerCapita;
      case "growth": return c.economy.gdpGrowth;
      case "inflation": return c.economy.monetary.inflation;
      case "unemployment": return c.economy.labour.unemployment;
      case "debt": return c.economy.fiscal.debtToGdp;
      case "approval": return c.executive.approval;
      case "military": return c.military.activeDuty;
      case "unrest": return c.unrestRisk;
      default: return c.economy.gdp;
    }
  };
  const sorted = [...rows].sort((a, b) => val(b) - val(a));
  const fmt = (v: number) =>
    metric === "gdp" || metric === "gdpPc" || metric === "military" ? credits(v)
    : metric === "approval" ? String(Math.round(v))
    : pct(v, 2);

  return (
    <div className="scroll pad">
      <div className="row row--wrap" style={{ marginBottom: 10, gap: 4 }}>
        {["gdp", "gdpPc", "growth", "inflation", "unemployment", "debt", "approval", "military", "unrest"].map((m) => (
          <button key={m} className={`btn btn--sm ${metric === m ? "btn--active" : ""}`} onClick={() => onPick(m)} style={{ display: "none" }} />
        ))}
      </div>
      <DataTable<Country>
        rows={sorted.slice(0, 100)}
        rowKey={(c) => c.id}
        onRow={(c) => onPick(c.id)}
        maxHeight={620}
        columns={[
          { id: "n", label: "Country", render: (c) => <span className="row" style={{ gap: 6 }}><span>{c.flagEmoji}</span><span className="truncate">{c.name}</span>{c.overlord && <span className="dim" style={{ fontSize: 10 }}>· dependency</span>}</span> },
          { id: "v", label: metric.toUpperCase(), right: true, render: (c) => <span className="mono">{fmt(val(c))}</span>, sort: (a, b) => val(b) - val(a) },
        ]}
      />
    </div>
  );
}

export { SECTOR_ORDER };