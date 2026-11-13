import { useCallback, useEffect, useMemo, useState } from "react";
import { api, joinMultiplayer, previewScenario, useStore, type PolityPreview } from "../store";
import { credits, GOVERNMENT_LABELS } from "../format";
import { Empty } from "./primitives";

type LobbyMember = { userId: string; username: string; country: string | null; joinedAt: number };

type LobbyWorld = {
  id: string;
  name: string;
  scenarioId: string;
  ownerId: string | null;
  maxPlayers: number;
  isPublic: boolean;
  startsAt: number | null;
  lobby: boolean;
  createdAt: number;
  members: LobbyMember[];
};

type LobbyPayload = { world: LobbyWorld; you: { id: string; country: string | null; host: boolean } };

const COUNTDOWNS = [30, 60, 120, 300];

function clock(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

/**
 * The lobby for a hosted world: who has joined, which nation each of them holds,
 * and the host's start countdown.
 *
 * The world's clock does not move while the lobby is open or the countdown is
 * running, so choosing a nation is not a race against the simulation. When the
 * countdown reaches zero everybody drops in together.
 */
export function WorldLobby({ id, onBack }: { id: string; onBack: () => void }) {
  const s = useStore();
  const [world, setWorld] = useState<LobbyWorld | null>(null);
  const [you, setYou] = useState<LobbyPayload["you"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [polities, setPolities] = useState<PolityPreview[] | null>(null);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [countdown, setCountdown] = useState(60);
  // Read the clock at render time and let this tick force the render: a stale
  // snapshot of Date.now() makes the countdown freeze when the tab is throttled.
  const [, setTick] = useState(0);
  const now = Date.now();
  

  const load = useCallback(async () => {
    try {
      const r = await api<LobbyPayload>(`/api/worlds/${encodeURIComponent(id)}/lobby`);
      // Only re-render when the lobby actually changed: a poll that rebuilds the
      // nation list every few seconds can swallow a click mid-press.
      setWorld((prev) => (prev && JSON.stringify(prev) === JSON.stringify(r.world) ? prev : r.world));
      setYou((prev) => (prev && JSON.stringify(prev) === JSON.stringify(r.you) ? prev : r.you));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open that lobby");
    }
  }, [id]);

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 4000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 500);
    return () => clearInterval(t);
  }, []);

  const scenarioId = world?.scenarioId;
  useEffect(() => {
    if (!scenarioId || polities) return;
    let alive = true;
    void previewScenario(scenarioId)
      .then((p) => alive && setPolities(p))
      .catch(() => alive && setPolities([]));
    return () => {
      alive = false;
    };
  }, [scenarioId, polities]);

  const nameOf = useCallback((iso: string) => polities?.find((p) => p.id === iso)?.name ?? iso, [polities]);

  const holders = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of world?.members ?? []) if (m.country) map.set(m.country, m.username);
    return map;
  }, [world?.members]);

  const me = world?.members.find((m) => m.userId === s.user?.id);
  const host = Boolean(you?.host);
  const hostName = world?.members.find((m) => m.userId === world.ownerId)?.username;
  const remaining = world?.startsAt ? Math.max(0, Math.ceil((world.startsAt - now) / 1000)) : null;
  const live = Boolean(world?.startsAt && world.startsAt <= now);

  // The countdown is the host's, but everybody enters on the same tick. The
  // attempt repeats until the world is adopted, so a dropped socket is not a
  // dead end.
  useEffect(() => {
    if (!world || !live || s.worldId) return;
    const attempt = () => {
      setBusy(true);
      void joinMultiplayer(world.id).finally(() => setBusy(false));
    };
    attempt();
    const t = setInterval(attempt, 6000);
    return () => clearInterval(t);
  }, [world?.id, live, s.worldId]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = (polities ?? []).filter((p) => !needle || p.name.toLowerCase().includes(needle) || p.leader.toLowerCase().includes(needle));
    return [...list].sort((a, b) => b.gdp - a.gdp);
  }, [polities, q]);

  const claim = async (iso: string) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/worlds/${encodeURIComponent(id)}/join`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ country: iso }),
      });
      if (!res.ok) {
        const why = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(why.error ?? "That nation could not be claimed");
      }
      await load();
      s.toast(`You will lead ${nameOf(iso)}`);
    } catch (e) {
      s.toast(e instanceof Error ? e.message : "That nation could not be claimed", "err");
    } finally {
      setBusy(false);
    }
  };

  const start = async (seconds: number) => {
    setBusy(true);
    try {
      const r = await api<{ ok: boolean; startsAt: number }>(`/api/worlds/${encodeURIComponent(id)}/start`, {
        method: "POST",
        body: JSON.stringify({ countdownSeconds: seconds }),
      });
      setWorld((w) => (w ? { ...w, startsAt: r.startsAt } : w));
      s.toast(seconds ? `Starting in ${clock(seconds)}` : "Starting now");
    } catch (e) {
      s.toast(e instanceof Error ? e.message : "Could not start that world", "err");
    } finally {
      setBusy(false);
    }
  };

  if (error && !world) {
    return (
      <div className="world-lobby">
        <div className="row" style={{ marginBottom: 12 }}>
          <button className="btn btn--sm" onClick={onBack}>← Back</button>
        </div>
        <Empty>{error}</Empty>
      </div>
    );
  }

  return (
    <div className="world-lobby">
      <div className="world-lobby__bar">
        <button className="btn btn--sm" onClick={onBack}>← Back</button>
        <div className="grow" style={{ minWidth: 0 }}>
          <h2 style={{ fontSize: 26 }}>{world?.name ?? "Opening the lobby"}</h2>
          <div className="dim mono" style={{ fontSize: 11 }}>
            {world ? `${world.scenarioId} · ${world.members.length}/${world.maxPlayers} members · ${world.isPublic ? "anyone can join" : "invite only"}` : ""}
          </div>
        </div>
        {remaining !== null ? (
          <div style={{ textAlign: "right" }}>
            <div className="dim" style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase" }}>{live ? "Entering the world" : "Starts in"}</div>
            <div className="world-lobby__clock">{live ? "0:00" : clock(remaining)}</div>
          </div>
        ) : (
          <div className="dim" style={{ fontSize: 12, textAlign: "right", maxWidth: 260 }}>
            {host ? "Pick a countdown, then start the world." : `Waiting for ${hostName ?? "the host"} to start the clock.`}
          </div>
        )}
      </div>

      {host && (
        <div className="row" style={{ gap: 8, alignItems: "center", marginTop: 14, flexWrap: "wrap" }}>
          <select className="input" style={{ width: 170 }} value={countdown} onChange={(e) => setCountdown(Number(e.target.value))} aria-label="Start countdown">
            {COUNTDOWNS.map((c) => (
              <option key={c} value={c}>{clock(c)} countdown</option>
            ))}
          </select>
          <button className="btn btn--primary" disabled={busy} onClick={() => void start(countdown)}>Start the world</button>
          {remaining !== null && !live && <button className="btn" disabled={busy} onClick={() => void start(0)}>Start now</button>}
        </div>
      )}

      <div className="world-lobby__grid">
        <section className="card world-lobby__panel">
          <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
            <h3 className="grow">Nations</h3>
            {me?.country && <span className="dim" style={{ fontSize: 12 }}>You hold {nameOf(me.country)}</span>}
          </div>
          <input className="input" placeholder="Search for a nation or a leader" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="polity-list">
            {!polities && <Empty>Building the world of {world?.scenarioId}...</Empty>}
            {rows.map((p) => {
              const holder = holders.get(p.id);
              const mine = Boolean(holder && holder === s.user?.username);
              return (
                <div
                  key={p.id}
                  className={`polity-row ${holder && !mine ? "world-lobby__row--taken" : ""} ${me?.country === p.id ? "active" : ""}`}
                  onClick={() => {
                    if (!holder && !busy) void claim(p.id);
                  }}
                  title={holder ? `${holder} holds ${p.name}` : `Take ${p.name}`}
                >
                  <div className="grow" style={{ minWidth: 0 }}>
                    <strong className="truncate" style={{ display: "block", fontSize: 13 }}>{p.name}</strong>
                    <span className="dim truncate" style={{ display: "block", fontSize: 11 }}>{p.leaderTitle}: {p.leader}</span>
                  </div>
                  {holder ? <span className="mono" style={{ fontSize: 11 }}>{mine ? "you" : holder}</span> : <span className="dim" style={{ fontSize: 11 }}>open</span>}
                  <span className="dim" style={{ fontSize: 11, width: 130, textAlign: "right" }}>{GOVERNMENT_LABELS[p.government] ?? p.government}</span>
                  <span className="mono" style={{ fontSize: 12, width: 62, textAlign: "right" }}>${credits(p.gdp)}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card world-lobby__panel">
          <h3>Members</h3>
          <div className="polity-list">
            {(world?.members ?? []).map((m) => (
              <div key={m.userId} className="world-lobby__row">
                <span className="grow truncate">{m.username}{m.userId === s.user?.id ? " (you)" : ""}{m.userId === world?.ownerId ? " · host" : ""}</span>
                <span className="dim mono" style={{ fontSize: 11 }}>{m.country ? nameOf(m.country) : "choosing"}</span>
              </div>
            ))}
            {world && world.members.length < world.maxPlayers && (
              <div className="world-lobby__row dim" style={{ fontSize: 12 }}>{world.maxPlayers - world.members.length} seats left</div>
            )}
          </div>
          <p className="dim" style={{ fontSize: 12, margin: 0 }}>
            {remaining === null
              ? "The clock is held while the lobby is open, so nobody starts governing before you do."
              : live
                ? "Everybody drops in together."
                : "The clock runs down, then everybody drops in together."}
          </p>
          {busy && <div className="dim" style={{ fontSize: 12 }}>Working…</div>}
        </section>
      </div>
    </div>
  );
}
