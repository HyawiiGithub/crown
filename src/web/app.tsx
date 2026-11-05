import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { User, WorldDirective } from "../shared/types";
import { WorldMap, type MapLayer } from "./components/Map";
import { CountryPanel, MarketPanel, RankingPanel, WarPanel } from "./components/panels";
import { DevMenu } from "./components/DevMenu";
import { TickerList, Lobby } from "./components/Lobby";
import { applyTheme, themeFromScenario, type Theme } from "./theme";
import { useStore, api, call, can, focusCountry, isDevUser } from "./store";
import { credits, pct, signedPct, simDate } from "./format";
import { Chip, Tabs } from "./components/primitives";

function setClock(change: { speed?: number; paused?: boolean }): void {
  void call({ kind: "command", body: { type: "set-speed", ...change } });
}

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

/** Shown on sign-in and the scenario screen, not during a game. */
function MultiplayerWarning() {
  const inGame = useStore((s) => Boolean(s.worldId));
  if (inGame) return null;
  return <div className="mp-warning" role="alert">Warning: Multiplayer Disabled</div>;
}

export function App() {
  return (
    <div className="root-column">
      <MultiplayerWarning />
      <div className="root-screen">
        <Screen />
      </div>
      <Notice />
    </div>
  );
}

function Notice() {
  const notice = useStore((s) => s.notice);
  if (!notice) return null;
  return (
    <div style={{ position: "fixed", bottom: 18, left: "50%", transform: "translateX(-50%)", zIndex: 400, maxWidth: 560 }}>
      <div className="card" style={{ borderColor: notice.kind === "err" ? "var(--negative)" : "var(--positive)", boxShadow: "0 8px 30px rgba(0,0,0,.5)" }}>{notice.text}</div>
    </div>
  );
}

function Screen() {
  const s = useStore();
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        await s.loadBootstrap();
      } catch {
        /* The login form still renders; it reports its own errors. */
      }
      try {
        await s.refreshSelf();
      } catch {
        /* Signed out, or the account service is unreachable. */
      }
      setBooted(true);
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
      if (e.key === " " && s.worldId) {
        e.preventDefault();
        setClock({ paused: !useStore.getState().paused });
      }
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
      await call({ kind: "scope", scope: out.user.id });
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
          An economic and political simulation of every country on earth, from 1900 to today.
          Take over any government, set its budget, and live with the consequences.
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

const SPEEDS: { value: number; label: string; title: string }[] = [
  { value: 1, label: "1", title: "1 day per second" },
  { value: 3, label: "3", title: "3 days per second" },
  { value: 7, label: "7", title: "1 week per second" },
  { value: 30, label: "30", title: "1 month per second" },
  { value: 90, label: "90", title: "1 quarter per second" },
];

function WorldShell() {
  const s = useStore();
  const scenario = s.scenario;
  const theme: Theme = useMemo(() => themeFromScenario((scenario ?? s.bootstrap.scenarios[0]).theme, (scenario ?? s.bootstrap.scenarios[0]).id), [scenario, s.bootstrap]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    focusCountry(s.selected);
  }, [s.selected]);

  const selected = s.selected ? s.countries[s.selected] : null;
  const player = s.playerCountry ? s.countries[s.playerCountry] : null;
  const shown = s.rightTab === "government" ? player : selected;
  const globals = s.globals;
  const directives: WorldDirective[] = s.directives;
  const growth = avgGrowth();

  const pick = (id: string) => s.set({ selected: id, rightTab: id === s.playerCountry ? "government" : "country" });
  // On phones only one of map, news and country is on screen at a time.
  const [mobileView, setMobileView] = useState<"map" | "news" | "country">("map");

  const saveNow = async () => {
    const r = await call<{ ok: boolean; message: string }>({ kind: "save", slot: "manual" });
    s.toast(r.message, r.ok ? "ok" : "err");
  };

  const exportSave = async () => {
    const r = await call<{ ok: boolean; message?: string; payload?: string }>({ kind: "export" });
    if (!r.payload) return s.toast(r.message ?? "Could not export", "err");
    const url = URL.createObjectURL(new Blob([r.payload], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `crown-${s.worldId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app" data-view={mobileView}>
      <header className="masthead">
        <span className="masthead__title">{scenario?.theme.masthead ?? "CROWN"}</span>
        <span className="masthead__date mono">{scenario ? simDate(scenario.startDate, s.simTime) : ""}</span>
        <span className="row time-controls" role="group" aria-label="Game speed">
          <button className={`btn btn--sm ${s.paused ? "btn--active" : ""}`} onClick={() => setClock({ paused: !s.paused })} title="Pause or resume (Space)">{s.paused ? "Play" : "Pause"}</button>
          {SPEEDS.map((x) => <button key={x.value} className={`btn btn--sm ${!s.paused && s.speed === x.value ? "btn--active" : ""}`} title={x.title} onClick={() => setClock({ speed: x.value, paused: false })}>{x.label}x</button>)}
        </span>
        {globals && (
          <span className="row masthead__stats">
            <span className="dim">World GDP <span className="mono ink-text">${credits(globals.globalGdp)}</span></span>
            <span className="dim">Growth <span className={`mono ${deltaTone(growth)}`}>{signedPct(growth, 1)}</span></span>
            <span className="dim">Inflation <span className="mono ink-text">{pct(globals.globalInflation, 1)}</span></span>
          </span>
        )}
        <span className="masthead__spacer" />
        <select className="select" style={{ width: 130 }} aria-label="Map layer" value={s.layer} onChange={(e) => s.set({ layer: e.target.value })}>
          {LAYERS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
        {s.paused && <Chip tone="var(--negative)">Paused</Chip>}
        <button className="btn btn--sm" onClick={() => void saveNow()}>Save</button>
        <button className="btn btn--sm" onClick={() => void exportSave()} title="Download this save as a file">Export</button>
        {can(s.user, "dev.console") && <button className="btn btn--sm" onClick={() => s.set({ devOpen: true })} title="Developer menu (F9)">Developer</button>}
        <button className="btn btn--sm" onClick={() => void s.leaveWorld()}>Menu</button>
      </header>

      <aside className="rail-left">
        <Tabs
          tabs={[
            { id: "ticker", label: "Wire" },
            { id: "rankings", label: "Rankings" },
            { id: "wars", label: "Wars", badge: s.wars.filter((w) => !w.endedAt).length },
          ]}
          active={s.leftTab}
          onChange={(id) => s.set({ leftTab: id })}
        />
        <div className="grow scroll" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          {s.leftTab === "ticker" && <TickerList ticker={s.ticker} onPick={pick} />}
          {s.leftTab === "rankings" && <RankingPanel countries={s.countries} onPick={pick} />}
          {s.leftTab === "wars" && <WarPanel wars={s.wars} countries={s.countries} onPick={pick} />}
        </div>
      </aside>

      <main className="stage">
        <WorldMap
          countries={s.countries}
          control={s.control}
          regions={s.regions}
          wars={s.wars}
          layer={s.layer as MapLayer}
          selected={s.selected ?? undefined}
          player={s.playerCountry ?? undefined}
          onSelect={pick}
          focus={s.selected ? { iso3: s.selected, relations: s.countries[s.selected]?.relations } : null}
          theme={theme}
        />
        {selected && (
          <button className="btn mobile-chip" onClick={() => setMobileView("country")}>{selected.name} details</button>
        )}
      </main>

      <aside className="rail-right">
        <Tabs
          tabs={[
            { id: "government", label: player ? player.name : "Government" },
            { id: "country", label: selected && selected.id !== s.playerCountry ? selected.name : "Selected" },
            { id: "markets", label: "Markets" },
          ]}
          active={s.rightTab}
          onChange={(id) => s.set({ rightTab: id })}
        />
        <div className="grow" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          {(s.rightTab === "government" || s.rightTab === "country") && <CountryPanel key={shown?.id ?? "none"} country={shown} />}
          {s.rightTab === "markets" && <MarketPanel markets={s.markets} companies={s.companies} />}
        </div>
      </aside>

      <nav className="mobile-nav" aria-label="Game views">
        {([["map", "Map"], ["news", "News"], ["country", "Country"]] as const).map(([id, label]) => (
          <button key={id} className={mobileView === id ? "active" : ""} onClick={() => setMobileView(id)}>{label}</button>
        ))}
      </nav>

      {s.devOpen && isDevUser(s.user) && s.worldId && (
        <DevMenu worldId={s.worldId} user={s.user!} countries={s.countries} companies={s.companies} directives={directives} params={s.params} simTime={s.simTime} paused={s.paused} speed={s.speed} onClose={() => s.set({ devOpen: false })} toast={s.toast} />
      )}
    </div>
  );

  function avgGrowth(): number {
    let num = 0;
    let den = 0;
    for (const c of Object.values(s.countries)) {
      if (c.annexedBy) continue;
      num += c.economy.gdpGrowth * c.economy.gdp;
      den += c.economy.gdp;
    }
    return den > 0 ? num / den : 0;
  }
}

function deltaTone(v: number): string {
  return v > 0.0005 ? "pos" : v < -0.0005 ? "neg" : "dim";
}
