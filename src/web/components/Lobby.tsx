import { useEffect, useMemo, useRef, useState } from "react";
import type { TickerEntry } from "../../shared/types";
import { api, call, can, previewScenario, useStore, type PolityPreview } from "../store";
import { WorldLobby } from "./WorldLobby";
import { applyTheme, themeFromScenario } from "../theme";
import { ago, credits, GOVERNMENT_LABELS, simDate } from "../format";
import { Chip, Empty } from "./primitives";

export function TickerList({ ticker, onPick }: { ticker: TickerEntry[]; onPick: (iso: string) => void }) {
  if (!ticker.length) return <Empty>The wire is quiet. Events appear here as the world moves.</Empty>;
  return (
    <div className="ticker">
      {ticker.map((t, i) => (
        <div key={`${t.t}-${i}`} className="ticker__item" onClick={() => t.country && onPick(t.country)} style={{ cursor: t.country ? "pointer" : undefined }}>
          <span className="dim mono" style={{ fontSize: 10 }}>{t.kind.slice(0, 4).toUpperCase()} </span>{t.text}
        </div>
      ))}
    </div>
  );
}

type OpenWorld = { id: string; name: string; scenario_id: string; members: number; max_players?: number; updated_at: number; owner_id?: string | null; is_public?: number; starts_at?: number | null; lobby?: number };

export function Lobby() {
  const s = useStore();
  const [setup, setSetup] = useState<string | null>(null);
  const [entering, setEntering] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [worlds, setWorlds] = useState<OpenWorld[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void fetch("/api/worlds")
      .then((r) => r.json())
      .then((j: { worlds?: OpenWorld[] }) => setWorlds(j.worlds ?? []))
      .catch(() => setWorlds([]));
  }, []);

  useEffect(() => {
    void s.refreshSaves();
    applyTheme(themeFromScenario(s.bootstrap.scenarios[s.bootstrap.scenarios.length - 1].theme, "2026"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const importFile = async (f: File) => {
    const payload = await f.text();
    const r = await call<{ ok: boolean; message?: string; world: Parameters<typeof s.startGame>[0] }>({ kind: "import", payload });
    if (!r.ok) s.toast(r.message ?? "Could not read that file", "err");
    else {
      await call({ kind: "save", slot: "imported" });
      await s.refreshSaves();
      s.toast("Save imported. Load it from Continue.");
      await call({ kind: "leave" });
    }
  };

  if (entering) return <WorldLobby id={entering} onBack={() => setEntering(null)} />;

  return (
    <div className="lobby">
      <header style={{ padding: "34px 34px 0", maxWidth: 1500, margin: "0 auto", width: "100%" }}>
        <div className="row" style={{ gap: 16, flexWrap: "wrap" }}>
          <div className="grow">
            <h1 style={{ fontSize: 34, letterSpacing: ".24em", textTransform: "uppercase" }}>CROWN</h1>
            <div className="dim" style={{ marginTop: 4 }}>Choose a year and a country. The world waits until you start the clock.</div>
          </div>
          <span className="dim mono" style={{ fontSize: 12 }} title="Total time played across every world on this browser">
            ⏱ {(() => { try { const t = Number(localStorage.getItem("crown.playtime.total") ?? 0) || 0; return `${Math.floor(t / 3600)}h ${Math.floor((t % 3600) / 60)}m`; } catch { return "0h 0m"; } })()}
          </span>
          <span className="dim" style={{ fontSize: 12 }}>{s.user?.username}</span>
          <button className="btn btn--sm" onClick={() => fileRef.current?.click()}>Import save</button>
          <input ref={fileRef} type="file" accept=".json,application/json" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) void importFile(f); e.target.value = ""; }} />
        </div>
      </header>

      {s.saves.length > 0 && (
        <section style={{ maxWidth: 1500, margin: "0 auto", padding: "22px 34px 0", width: "100%" }}>
          <h3 style={{ marginBottom: 10 }}>Continue</h3>
          <div className="save-grid">
            {s.saves.slice(0, 8).map((w) => (
              <article key={w.id} className="card save-card">
                <div className="grow" style={{ cursor: "pointer", minWidth: 0 }} onClick={() => void s.loadGame(w.id).catch((e: Error) => s.toast(e.message, "err"))}>
                  <strong className="truncate" style={{ display: "block" }}>{w.countryName ?? "Spectator"}</strong>
                  <div className="dim truncate" style={{ fontSize: 11 }}>{w.name}</div>
                  <div className="dim mono" style={{ fontSize: 11 }}>{simDate(w.startDate, w.t)} · saved {ago(w.updatedAt)}</div>
                </div>
                <button className="btn btn--sm" title="Delete this save" onClick={() => { if (confirm(`Delete the save "${w.name}"?`)) void call({ kind: "delete-save", saveId: w.id }).then(() => s.refreshSaves()); }}>Delete</button>
              </article>
            ))}
          </div>
        </section>
      )}

      {worlds.length > 0 && (
        <section style={{ maxWidth: 1500, margin: "0 auto", padding: "22px 34px 0", width: "100%" }}>
          <div className="row" style={{ marginBottom: 10 }}>
            <h3 className="grow">Open worlds</h3>
            {can(s.user, "world.create") && <button className="btn btn--sm btn--primary" onClick={() => setCreating(true)}>Host a new world</button>}
          </div>
          <div className="save-grid">
            {worlds.map((w) => (
              <article key={w.id} className="card save-card">
                <div className="grow" style={{ minWidth: 0 }}>
                  <strong className="truncate" style={{ display: "block" }}>{w.name}</strong>
                  <div className="dim mono truncate" style={{ fontSize: 11 }}>{w.scenario_id} · {w.members}/{w.max_players ?? 8} {w.members === 1 ? "player" : "players"}{w.starts_at ? "" : " · in lobby"}</div>
                </div>
                <button className="btn btn--sm btn--primary" onClick={() => setEntering(w.id)}>Open lobby</button>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="lobby__grid">
        {s.bootstrap.scenarios.map((sc) => {
          const th = themeFromScenario(sc.theme, sc.id);
          return (
            <article
              key={sc.id}
              className="scenario-card"
              style={{ background: `linear-gradient(150deg, ${th.tokens["--bg-raised"]} 0%, ${th.tokens["--bg"]} 62%, ${th.ocean} 100%)`, borderColor: th.tokens["--rule"], color: th.tokens["--ink"], fontFamily: th.fontBody }}
              onClick={() => setSetup(sc.id)}
            >
              <div>
                <div className="scenario-card__year" style={{ color: th.tokens["--accent-2"] }}>{sc.year}</div>
                <div className="scenario-card__name" style={{ fontFamily: th.fontDisplay, color: th.tokens["--ink"] }}>{sc.name}</div>
                <div className="scenario-card__tagline" style={{ color: th.tokens["--ink-muted"] }}>{sc.tagline}</div>
                <div className="scenario-card__tags">{sc.tags.slice(0, 3).map((t) => <span key={t} className="tag" style={{ color: th.tokens["--ink-muted"] }}>{t}</span>)}</div>
              </div>
            </article>
          );
        })}
      </div>

      {setup && <NewGame scenarioId={setup} onClose={() => setSetup(null)} />}
      {creating && <NewWorld onClose={() => setCreating(false)} onCreated={(id) => { setCreating(false); setEntering(id); }} />}
    </div>
  );
}

function NewGame({ scenarioId, onClose }: { scenarioId: string; onClose: () => void }) {
  const s = useStore();
  const scenario = s.bootstrap.scenarios.find((x) => x.id === scenarioId)!;
  const [polities, setPolities] = useState<PolityPreview[] | null>(null);
  const [q, setQ] = useState("");
  const [pick, setPick] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showDependencies, setShowDependencies] = useState(false);

  useEffect(() => {
    let alive = true;
    void previewScenario(scenarioId).then((p) => alive && setPolities(p));
    return () => {
      alive = false;
    };
  }, [scenarioId]);

  const rows = useMemo(() => {
    const list = (polities ?? []).filter((p) => (showDependencies || !p.overlord) && (!q || p.name.toLowerCase().includes(q.toLowerCase()) || p.leader.toLowerCase().includes(q.toLowerCase())));
    return list.sort((a, b) => b.gdp - a.gdp);
  }, [polities, q, showDependencies]);

  const chosen = polities?.find((p) => p.id === pick);

  const begin = async () => {
    if (!chosen) return;
    setBusy(true);
    try {
      await s.startGame(scenarioId, chosen.id, `${chosen.name} ${scenario.year}`);
    } catch (e) {
      s.toast(e instanceof Error ? e.message : "Could not start the game", "err");
      setBusy(false);
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="card modal__body" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={`New game, ${scenario.name}`}>
        <div className="row"><h3 className="grow" style={{ fontSize: 20 }}>{scenario.year}: {scenario.name}</h3><button className="btn btn--sm" onClick={onClose}>Close</button></div>
        <p className="dim" style={{ fontSize: 13, margin: "6px 0 14px" }}>{scenario.description}</p>
        <div className="row" style={{ gap: 8, marginBottom: 8 }}>
          <input className="input grow" placeholder="Search for a country or leader" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
          <label className="row dim" style={{ gap: 4, fontSize: 12, whiteSpace: "nowrap" }}><input type="checkbox" checked={showDependencies} onChange={(e) => setShowDependencies(e.target.checked)} /> Include colonies</label>
        </div>
        <div className="polity-list">
          {!polities && <Empty>Building the world of {scenario.year}...</Empty>}
          {rows.map((p) => (
            <div key={p.id} className={`polity-row ${pick === p.id ? "active" : ""}`} onClick={() => setPick(p.id)} onDoubleClick={() => { setPick(p.id); }}>
              <div className="grow" style={{ minWidth: 0 }}>
                <strong className="truncate" style={{ display: "block", fontSize: 13 }}>{p.name}</strong>
                <span className="dim truncate" style={{ display: "block", fontSize: 11 }}>{p.leaderTitle}: {p.leader}</span>
              </div>
              {p.wars > 0 && <Chip tone="var(--negative)">War</Chip>}
              {p.overlord && <Chip>Dependency</Chip>}
              <span className="dim" style={{ fontSize: 11, width: 150, textAlign: "right" }} >{GOVERNMENT_LABELS[p.government] ?? p.government}</span>
              <span className="mono" style={{ fontSize: 12, width: 62, textAlign: "right" }}>${credits(p.gdp)}</span>
            </div>
          ))}
        </div>
        <div className="row" style={{ gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
          {chosen && <span className="dim grow" style={{ fontSize: 12 }}>You will lead {chosen.name} from {simDate(scenario.startDate, 0)}.</span>}
          <button className="btn btn--primary" disabled={!chosen || busy} onClick={() => void begin()}>{busy ? "Building the world..." : "Begin"}</button>
        </div>
      </div>
    </div>
  );
}

/** The host's setup form: pick a scenario, a name and how many members may join. */
function NewWorld({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const s = useStore();
  const [scenarioId, setScenarioId] = useState(s.bootstrap.scenarios[s.bootstrap.scenarios.length - 1].id);
  const [name, setName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ ok: boolean; id: string }>("/api/worlds", {
        method: "POST",
        body: JSON.stringify({ scenarioId, name: name.trim() || undefined, maxPlayers }),
      });
      onCreated(r.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create that world");
      setBusy(false);
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="card modal__body" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Host a new world" style={{ maxWidth: 460 }}>
        <div className="row"><h3 className="grow" style={{ fontSize: 20 }}>Host a world</h3><button className="btn btn--sm" onClick={onClose}>Close</button></div>
        <p className="dim" style={{ fontSize: 13, margin: "6px 0 14px" }}>The world is created with its clock held. Invite players, let them pick a nation, then start the countdown.</p>
        <label className="dim" style={{ fontSize: 12 }}>Scenario</label>
        <select className="input" value={scenarioId} onChange={(e) => setScenarioId(e.target.value)}>
          {s.bootstrap.scenarios.map((sc) => (
            <option key={sc.id} value={sc.id}>{sc.year}: {sc.name}</option>
          ))}
        </select>
        <label className="dim" style={{ fontSize: 12, marginTop: 10, display: "block" }}>Name</label>
        <input className="input" placeholder="Leave blank for a dated name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
        <label className="dim" style={{ fontSize: 12, marginTop: 10, display: "block" }}>Members allowed</label>
        <input className="input" type="number" min={2} max={64} value={maxPlayers} onChange={(e) => setMaxPlayers(Math.max(2, Math.min(64, Number(e.target.value) || 8)))} />
        {error && <p style={{ color: "var(--negative)", fontSize: 12, marginTop: 10 }}>{error}</p>}
        <div className="row" style={{ justifyContent: "flex-end", marginTop: 14 }}>
          <button className="btn btn--primary" disabled={busy} onClick={() => void create()}>{busy ? "Creating..." : "Create lobby"}</button>
        </div>
      </div>
    </div>
  );
}
