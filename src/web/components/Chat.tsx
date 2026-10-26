import { useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage, TickerEntry } from "../../shared/types";
import { useStore, sendChat } from "../store";
import { applyTheme, themeFromScenario } from "../theme";
import { ago } from "../format";

// ===========================================================================
// Wire (ticker)
// ===========================================================================

export function TickerList({ ticker, onPick }: { ticker: TickerEntry[]; onPick: (iso: string) => void }) {
  if (!ticker.length) {
    return <div className="dim" style={{ padding: 20, textAlign: "center", fontSize: 12 }}>The wire is quiet. Events appear here as the world moves.</div>;
  }
  return (
    <div className="ticker">
      {ticker.map((t, i) => (
        <div
          key={`${t.t}-${i}`}
          className="ticker__item"
          onClick={() => t.country && onPick(t.country)}
          style={{ cursor: t.country ? "pointer" : undefined }}
        >
          <span style={{ opacity: 0.6 }}>{t.kind.slice(0, 4).toUpperCase()}</span> {t.text}
        </div>
      ))}
    </div>
  );
}

// ===========================================================================
// Chat
// ===========================================================================

export function Chat() {
  const chat = useStore((s) => s.chat);
  const user = useStore((s) => s.user);
  const muted = user?.mutedUntil && user.mutedUntil > Date.now();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.length]);

  return (
    <div className="chat" style={{ height: "100%" }}>
      <div className="chat__log">
        {chat.length === 0 && <div className="dim" style={{ fontSize: 12, textAlign: "center", padding: 20 }}>No messages yet.</div>}
        {chat.map((m) => (
          <div key={m.id} className="chat__msg">
            <b>{m.username}</b>
            <span className="dim"> {m.text}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form
        className="chat__form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim() || muted) return;
          sendChat(text.trim());
          setText("");
        }}
      >
        <input
          className="input grow"
          placeholder={muted ? "You are muted" : "Message the world"}
          value={text}
          disabled={Boolean(muted)}
          onChange={(e) => setText(e.target.value)}
          maxLength={400}
        />
        <button className="btn btn--sm" disabled={Boolean(muted)}>Send</button>
      </form>
    </div>
  );
}

export type { ChatMessage };

// ===========================================================================
// Lobby
// ===========================================================================

export function Lobby() {
  const s = useStore();
  const [creating, setCreating] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void s.loadWorlds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const byScenario = useMemo(() => {
    const m = new Map<string, number>();
    for (const w of s.worlds) m.set(w.scenario_id, (m.get(w.scenario_id) ?? 0) + 1);
    return m;
  }, [s.worlds]);

  const create = async (scenarioId: string) => {
    setBusy(true);
    try {
      const res = await fetch("/api/worlds", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scenarioId, name: name.trim() || undefined }),
        credentials: "same-origin",
      });
      const body = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !body.id) {
        s.toast(body.error ?? "Could not create the world", "err");
        return;
      }
      await s.enterWorld(body.id);
    } finally {
      setBusy(false);
      setCreating(null);
    }
  };

  return (
    <div className="lobby">
      <header style={{ padding: "34px 34px 0", maxWidth: 1500, margin: "0 auto", width: "100%" }}>
        <div className="row" style={{ gap: 16, flexWrap: "wrap" }}>
          <div className="grow">
            <h1 style={{ fontSize: 34, letterSpacing: ".24em", textTransform: "uppercase" }}>CROWN</h1>
            <div className="dim" style={{ marginTop: 4 }}>
              Choose a year. The world starts running the moment you open it.
            </div>
          </div>
          {s.user?.avatar && <img src={s.user.avatar} alt="" width={44} height={44} style={{ borderRadius: "50%" }} />}
        </div>
      </header>

      <div className="lobby__grid">
        {(s.bootstrap?.scenarios ?? []).map((sc) => {
          const th = themeFromScenario(sc.theme, sc.id);
          const live = byScenario.get(sc.id) ?? 0;
          return (
            <article
              key={sc.id}
              className="scenario-card"
              style={{
                background: `linear-gradient(150deg, ${th.tokens["--bg-raised"]} 0%, ${th.tokens["--bg"]} 62%, ${th.ocean} 100%)`,
                borderColor: th.tokens["--rule"],
                color: th.tokens["--ink"],
                fontFamily: th.fontBody,
              }}
              onMouseEnter={() => applyTheme(th)}
              onMouseLeave={() => applyTheme(themeFromScenario(s.bootstrap!.scenarios[0].theme, s.bootstrap!.scenarios[0].id))}
              onClick={() => setCreating(sc.id)}
            >
              <div>
                <div className="scenario-card__year" style={{ color: th.tokens["--accent-2"] }}>{sc.year}</div>
                <div className="scenario-card__name" style={{ fontFamily: th.fontDisplay, color: th.tokens["--ink"] }}>{sc.name}</div>
                <div className="scenario-card__tagline" style={{ color: th.tokens["--ink-muted"] }}>{sc.tagline}</div>
                <div className="scenario-card__tags">
                  {sc.tags.slice(0, 3).map((t) => <span key={t} className="tag" style={{ color: th.tokens["--ink-muted"] }}>{t}</span>)}
                  {live > 0 && <span className="tag" style={{ color: th.tokens["--positive"] }}>{live} live</span>}
                </div>
              </div>
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 14 }}>{1 / sc.daysPerSecond > 1 ? `1 day per ${(1 / sc.daysPerSecond).toFixed(0)}s` : `${(sc.daysPerSecond * 24).toFixed(0)} days per second`}</div>
            </article>
          );
        })}
      </div>

      {creating && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", display: "grid", placeItems: "center", zIndex: 150 }} onClick={() => setCreating(null)}>
          <div className="card" style={{ width: 420, padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, marginBottom: 4 }}>New world</h3>
            <div className="dim" style={{ fontSize: 12, marginBottom: 14 }}>
              {s.bootstrap?.scenarios.find((x) => x.id === creating)?.description}
            </div>
            <label className="field">
              <span>World name (optional)</span>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="The Long Peace" autoFocus />
            </label>
            <div className="row" style={{ gap: 8, justifyContent: "flex-end" }}>
              <button className="btn" onClick={() => setCreating(null)}>Cancel</button>
              <button className="btn btn--primary" disabled={busy} onClick={() => void create(creating)}>
                {busy ? "Creating..." : "Create and enter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {s.worlds.length > 0 && (
        <div style={{ maxWidth: 1500, margin: "0 auto", padding: "8px 34px 60px", width: "100%" }}>
          <h3 style={{ marginBottom: 10 }}>Live worlds</h3>
          <div className="lobby__grid" style={{ padding: 0 }}>
            {s.worlds.map((w) => (
              <article key={w.id} className="card" style={{ cursor: "pointer" }} onClick={() => void s.enterWorld(w.id)}>
                <div className="row">
                  <strong className="grow truncate">{w.name}</strong>
                  <span className="dim mono" style={{ fontSize: 11 }}>{w.scenario_id}</span>
                </div>
                <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>
                  {w.members} player{w.members === 1 ? "" : "s"} &middot; updated {ago(w.updated_at)}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}