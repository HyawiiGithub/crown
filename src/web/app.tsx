import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Company, User, WorldDirective } from "../shared/types";
import { WorldMap, type MapLayer } from "./components/Map";
import { CountryPanel, MarketPanel, RankingPanel, WarPanel } from "./components/panels";
import { PoliticsPanel } from "./components/politics";
import { DevMenu } from "./components/DevMenu";
import { Chat, TickerList, Lobby } from "./components/Chat";
import { applyTheme, themeFromScenario, type Theme } from "./theme";
import { useStore, playerAction, api, can, isDevUser } from "./store";
import { credits, pct, pct0, signedPct, simDate } from "./format";
import { Chip, DataTable, Tabs } from "./components/primitives";

const LAYERS: { id: MapLayer; label: string }[] = [
  { id: "political", label: "Political" },
  { id: "war", label: "War" },
  { id: "gdp", label: "GDP" },
  { id: "gdpPc", label: "GDP / capita" },
  { id: "growth", label: "Growth" },
  { id: "inflation", label: "Inflation" },
  { id: "unemployment", label: "Unemployment" },
  { id: "debt", label: "Debt" },
  { id: "approval", label: "Approval" },
  { id: "ideology", label: "Ideology" },
  { id: "bloc", label: "Bloc" },
  { id: "relations", label: "Relations" },
];

export function App() {
  const s = useStore();
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        await s.loadBootstrap();
      } finally {
        await s.refreshSelf();
        setBooted(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Global hotkeys.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "`" || e.key === "F9") {
        e.preventDefault();
        if (can(s.user, "dev.console")) s.set({ devOpen: !s.devOpen });
      }
      if (e.key === "Escape" && s.devOpen) s.set({ devOpen: false });
      if (e.key === "Escape" && s.worldId) s.leaveWorld();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.devOpen, s.worldId, s.user]);

  if (!booted) {
    return (
      <div className="gate">
        <div className="gate__card">
          <div className="gate__title">CROWN</div>
          <div className="dim">Loading the world</div>
        </div>
      </div>
    );
  }

  if (!s.user) return <LoginGate health={s.health} />;
  if (!s.worldId) return <Lobby />;

  return <WorldShell />;
}

// ===========================================================================
// Login
// ===========================================================================

function LoginGate({ health }: { health: { google: boolean; discord: boolean; password: boolean; env: string; portraits?: boolean } | null }) {
  const s = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(() => new URLSearchParams(location.search).get("error"));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const path = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login" ? { email, password } : { email, password, username };
      const out = await api<{ user: User }>(path, { method: "POST", body: JSON.stringify(body) });
      s.set({ user: out.user });
      s.toast(mode === "login" ? "Welcome back" : "Account created", "ok");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="gate">
      <div className="gate__card">
        <div className="gate__title">CROWN</div>
        <p className="dim" style={{ maxWidth: 420, margin: "0 auto 22px" }}>
          A real-time economic and political simulation of every country on earth.
          Take a party, contest any office, and run the economy while the world watches.
        </p>
        {error && <div className="card" style={{ marginBottom: 16, borderColor: "var(--negative)", color: "var(--negative)", textAlign: "left" }}>{error}</div>}

        <div className="tabs" style={{ justifyContent: "center", borderBottom: "none", marginBottom: 16 }}>
          <div className={`tab ${mode === "login" ? "active" : ""}`} onClick={() => { setMode("login"); setError(null); }}>Sign in</div>
          <div className={`tab ${mode === "register" ? "active" : ""}`} onClick={() => { setMode("register"); setError(null); }}>Create account</div>
        </div>

        <form onSubmit={submit} style={{ textAlign: "left" }}>
          <label className="field">
            <span>Email</span>
            <input className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          {mode === "register" && (
            <label className="field">
              <span>Display name</span>
              <input className="input" type="text" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} minLength={3} maxLength={32} required />
            </label>
          )}
          <label className="field">
            <span>Password</span>
            <input className="input" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} minLength={mode === "register" ? 10 : undefined} required />
          </label>
          <button className="btn btn--primary" type="submit" disabled={busy} style={{ width: "100%", justifyContent: "center", padding: "9px 12px" }}>
            {busy ? "Working..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        {(health?.google || health?.discord) && (
          <>
            <div className="dim" style={{ margin: "18px 0 12px", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase" }}>or</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {health?.google && <a className="btn" href="/api/auth/google?returnTo=/lobby">Continue with Google</a>}
              {health?.discord && (
                <a className="btn" href="/api/auth/discord?returnTo=/lobby">
                  <DiscordMark />
                  Discord
                </a>
              )}
            </div>
          </>
        )}

        <div className="dim" style={{ marginTop: 22, fontSize: 11 }}>
          Running in {health?.env ?? "development"}. Sessions are server-side; the cookie is HttpOnly.
        </div>
      </div>
    </div>
  );
}

function DiscordMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.32 4.37A19.8 19.8 0 0 0 15.43 3c-.24.42-.5.99-.69 1.44a18.3 18.3 0 0 0-5.48 0c-.19-.45-.46-1.02-.7-1.44a19.8 19.8 0 0 0-4.89 1.37C.56 9.2-.28 13.87.14 18.5A19.9 19.9 0 0 0 6.15 21.5c.49-.66.92-1.36 1.29-2.1-.71-.27-1.39-.6-2.03-.98.17-.13.34-.26.5-.4a14.2 14.2 0 0 0 12.18 0c.16.14.33.27.5.4-.64.38-1.32.71-2.03.98.37.74.8 1.44 1.29 2.1a19.86 19.86 0 0 0 6.01-3c.5-5.36-.82-10-3.54-14.13ZM8.02 15.85c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.2 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.2 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Z" />
    </svg>
  );
}

// ===========================================================================
// World shell
// ===========================================================================

function WorldShell() {
  const s = useStore();


  const theme: Theme = useMemo(
    () => (s.scenario ? themeFromScenario(s.scenario.theme, s.scenario.id) : (s.bootstrap ? themeFromScenario(s.bootstrap.scenarios[0].theme, s.bootstrap.scenarios[0].id) : null as unknown as Theme)),
    [s.scenario, s.bootstrap],
  );

  useEffect(() => {
    if (theme) applyTheme(theme);
  }, [theme]);

  const selected = s.selected ? s.countries[s.selected] : null;
  const wars = s.wars;
  const warCount = selected ? selected.wars.length : 0;

  const globals = s.globals;
  const params = useMemo(() => {
    // The client mirrors the live parameter block for the dev menu sliders.
    return (useStore.getState().fullWorld?.params ?? {}) as Record<string, number>;
  }, [s.fullWorld]);

  const directives: WorldDirective[] = s.fullWorld?.directives ?? [];

  const onAct = (op: Record<string, unknown>) => {
    void playerAction(s.worldId!, op).then((r) => s.toast(r.message, r.ok ? "ok" : "err"));
  };

  return (
    <div className="app">
      <header className="masthead">
        <span className="masthead__title">{s.scenario?.theme.masthead ?? "CROWN"}</span>
        <span className="masthead__year">{s.scenario?.year}</span>
        {globals && (
          <span className="row" style={{ gap: 14, fontSize: 11 }}>
            <span className="dim">World GDP <span className="mono">{credits(globals.globalGdp)}</span></span>
            <span className="dim">Growth <span className={`mono ${deltaTone(avgGrowth())}`}>{signedPct(avgGrowth())}</span></span>
            <span className="dim">Inflation <span className="mono">{pct(globals.globalInflation, 1)}</span></span>
            <span className="dim">Conflict <span className="mono">{Math.round(globals.worldConflictIndex)}</span></span>
            <span className="dim">{simDate({ year: s.scenario?.year ?? 2026, month: 1, day: 1 }, s.simTime)}</span>
          </span>
        )}
        <span className="masthead__spacer" />
        <select className="select" style={{ width: 170 }} value={s.layer} onChange={(e) => s.set({ layer: e.target.value })}>
          {LAYERS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
        <Chip tone={s.connection === "live" ? "var(--positive)" : s.connection === "error" ? "var(--negative)" : undefined}>{s.connection}</Chip>
        {s.paused && <Chip tone="var(--negative)">paused</Chip>}
        {can(s.user, "dev.console") && (
          <button className="btn btn--sm" onClick={() => s.set({ devOpen: true })} title="Developer menu (F9)">
            Developer
          </button>
        )}
        <button className="btn btn--sm" onClick={() => s.leaveWorld()}>Leave</button>
        <span className="row" style={{ gap: 6, fontSize: 11 }}>
          {s.user?.avatar && <img src={s.user.avatar} alt="" width={20} height={20} style={{ borderRadius: "50%" }} />}
          <span className="truncate" style={{ maxWidth: 110 }}>{s.user?.username}</span>
        </span>
      </header>

      <aside className="rail-left">
        <Tabs
          tabs={[
            { id: "ticker", label: "Wire" },
            { id: "rankings", label: "Rankings" },
            { id: "wars", label: "Wars", badge: wars.filter((w) => !w.endedAt).length },
            { id: "chat", label: "Chat", badge: s.online.length },
          ]}
          active={s.leftTab}
          onChange={(id) => s.set({ leftTab: id })}
        />
        <div className="grow scroll">
          {s.leftTab === "ticker" && <TickerList ticker={s.ticker} onPick={(iso) => s.set({ selected: iso })} />}
          {s.leftTab === "rankings" && <RankingPanel countries={s.countries} metric={s.layer === "political" ? "gdp" : s.layer} onPick={(iso) => s.set({ selected: iso })} />}
          {s.leftTab === "wars" && <WarPanel wars={wars} countries={s.countries} onDeclare={can(s.user, "diplomacy.war") ? () => { const a = prompt("Attacker ISO3 (e.g. USA)"); const b = prompt("Defender ISO3"); if (a && b) onAct({ type: "__dev_declare_war", attacker: a, defender: b }); } : undefined} />}
          {s.leftTab === "chat" && <Chat />}
        </div>
      </aside>

      <main className="stage">
        <WorldMap
          countries={s.countries}
          wars={wars}
          layer={s.layer as MapLayer}
          selected={s.selected ?? undefined}
          onSelect={(iso) => s.set({ selected: iso })}
          focus={s.selected ? { iso3: s.selected, relations: s.countries[s.selected]?.relations } : null}
          theme={theme}
        />
      </main>

      <aside className="rail-right">
        <Tabs
          tabs={[
            { id: "country", label: "Country" },
            { id: "markets", label: "Markets" },
            { id: "entities", label: "Corporations" },
          ]}
          active={s.rightTab}
          onChange={(id) => s.set({ rightTab: id })}
        />
        <div className="grow" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          {s.rightTab === "country" && <CountryPanel country={selected} warCount={warCount} onAct={onAct} bills={s.bills} />}
          {s.rightTab === "politics" && <PoliticsPanel country={selected} user={s.user!} characters={s.characters} simTime={s.simTime} onAct={onAct} />}
          {s.rightTab === "markets" && (
            <MarketPanel
              markets={s.markets}
              companies={s.companies}
              onTrade={can(s.user, "economy.trade") ? (companyId, side, shares) => onAct({ type: "trade", companyId, side, shares }) : undefined}
            />
          )}
          {s.rightTab === "entities" && <CorporationList companies={s.companies} onPick={(id) => s.set({ selected: s.companies[id]?.country })} />}
        </div>
      </aside>

      {s.devOpen && isDevUser(s.user) && s.worldId && (
        <DevMenu
          worldId={s.worldId}
          user={s.user!}
          countries={s.countries}
          companies={s.companies}
          directives={directives}
          params={params}
          simTime={s.simTime}
          paused={s.paused}
          speed={s.speed}
          onClose={() => s.set({ devOpen: false })}
          toast={s.toast}
        />
      )}

      {s.notice && (
        <div style={{ position: "fixed", bottom: 18, left: "50%", transform: "translateX(-50%)", zIndex: 200 }}>
          <div className="card" style={{ borderColor: s.notice!.kind === "err" ? "var(--negative)" : "var(--positive)", boxShadow: "0 8px 30px rgba(0,0,0,.5)" }}>
            {s.notice.text}
          </div>
        </div>
      )}
    </div>
  );

  function avgGrowth(): number {
    let num = 0;
    let den = 0;
    for (const c of Object.values(s.countries)) {
      if (c.annexedBy || c.overlord) continue;
      num += c.economy.gdpGrowth * c.economy.gdp;
      den += c.economy.gdp;
    }
    return den > 0 ? num / den : 0;
  }
}

function deltaTone(v: number): string {
  return v > 0.0005 ? "pos" : v < -0.0005 ? "neg" : "dim";
}

function CorporationList({ companies, onPick }: { companies: Record<string, Company>; onPick: (id: string) => void }) {
  const [q, setQ] = useState("");
  const rows = Object.values(companies).filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="scroll pad">
      <input className="input" placeholder="Search corporations" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 8 }} />
      <DataTable<Company>
        rows={rows.sort((a, b) => b.valuation - a.valuation).slice(0, 200)}
        rowKey={(c) => c.id}
        onRow={(c) => onPick(c.id)}
        maxHeight={560}
        columns={[
          { id: "n", label: "Company", render: (c) => <span className="truncate">{c.name}</span> },
          { id: "s", label: "Sector", render: (c) => <span className="dim">{c.sector}</span> },
          { id: "v", label: "Cap", right: true, render: (c) => <span className="mono">{credits(c.valuation)}</span> },
        ]}
      />
    </div>
  );
}

export { pct0 };