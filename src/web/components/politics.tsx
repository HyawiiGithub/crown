import { useMemo, useState } from "react";
import type { Character, Country, Election, ElectionOffice, User } from "../../shared/types";
import { credits, pct0 } from "../format";
import { Bar, Chip, Empty, Panel, Stat } from "./primitives";

const DIRECT_EXECUTIVE = new Set(["presidential-republic", "federal-republic", "semi-presidential-republic"]);
const DAY = 86400;

const OFFICE_LABEL: Record<ElectionOffice, string> = {
  chamber: "Chamber",
  "head-of-state": "Head of state",
  "head-of-government": "Head of government",
  "party-leader": "Party leadership",
};

const CAMPAIGNS = [
  { id: "rally", label: "Rally", cost: 60_000 },
  { id: "ads", label: "Ads", cost: 180_000 },
  { id: "ground", label: "Ground game", cost: 45_000 },
  { id: "debate", label: "Debate", cost: 0 },
] as const;

export function PoliticsPanel({
  country,
  user,
  characters,
  simTime,
  onAct,
}: {
  country: Country | null;
  user: User;
  characters: Record<string, Character>;
  simTime: number;
  onAct?: (op: Record<string, unknown>) => void;
}) {
  const [name, setName] = useState(user.globalName || user.username);
  const [partyId, setPartyId] = useState("");
  const [foundName, setFoundName] = useState("");
  const [foundAbbr, setFoundAbbr] = useState("");
  const [showFound, setShowFound] = useState(false);

  const player = useMemo(() => Object.values(characters).find((c) => c.userId === user.id && !c.removedAt), [characters, user.id]);
  const c = country;
  const inCountry = Boolean(player && c && player.country === c.id);
  const party = inCountry && player?.partyId ? c?.parties.find((p) => p.id === player.partyId) : undefined;
  const activeElections = useMemo(
    () => (c?.elections ?? []).filter((e) => e.status !== "complete").sort((a, b) => (a.office ?? "chamber").localeCompare(b.office ?? "chamber")),
    [c],
  );

  if (!c) return <Empty>Select a country on the map.</Empty>;

  return (
    <div className="scroll" style={{ padding: 10, display: "flex", flexDirection: "column", gap: 10 }}>
      <Panel title="Your career" defaultOpen>
        {!player && (
          <div>
            <div className="dim" style={{ fontSize: 12, marginBottom: 10 }}>
              Enter politics in {c.name}. You start with 2M credits and can contest any open office.
            </div>
            <label className="field">
              <span>Politician name</span>
              <input className="input" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="field">
              <span>Party</span>
              <select className="select" value={partyId} onChange={(e) => setPartyId(e.target.value)}>
                <option value="">Independent</option>
                {c.parties.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.abbreviation})</option>)}
              </select>
            </label>
            <button className="btn btn--primary" disabled={name.trim().length < 2} onClick={() => onAct?.({ type: "create-politician", name, country: c.id, partyId: partyId || undefined })}>
              Start political career
            </button>
          </div>
        )}

        {player && !inCountry && (
          <div className="dim" style={{ fontSize: 12 }}>
            Your politician is based in {player.country}. CROWN allows one career per world.
          </div>
        )}

        {inCountry && player && (
          <div>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{player.name}</div>
                <div className="dim" style={{ fontSize: 11 }}>{party ? `${party.name} (${party.abbreviation})` : "Independent"}</div>
              </div>
              <Chip tone={party?.color}>{player.office ? player.office.replace(/-/g, " ") : "citizen"}</Chip>
            </div>
            <Stat label="Campaign funds" value={credits(player.funds ?? 0)} />
            <Stat label="Influence" value={`${Math.round(player.influence ?? 0)} / 100`} />
            <Stat label="Popularity" value={pct0((player.stats.popularity ?? 0) / 100)} />
            <div style={{ marginTop: 8 }}><Bar value={player.influence ?? 0} max={100} /></div>
            <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {c.parties.filter((p) => p.id !== player.partyId).slice(0, 5).map((p) => (
                <button key={p.id} className="btn btn--sm" onClick={() => onAct?.({ type: "join-party", partyId: p.id })}>
                  Join {p.abbreviation}
                </button>
              ))}
              <button className="btn btn--sm" onClick={() => setShowFound((v) => !v)}>{showFound ? "Cancel" : "Found party"}</button>
            </div>
            {showFound && (
              <div style={{ marginTop: 10 }}>
                <div className="dim" style={{ fontSize: 11, marginBottom: 6 }}>Costs 400,000 credits from your campaign funds.</div>
                <label className="field">
                  <span>Party name</span>
                  <input className="input" value={foundName} maxLength={48} onChange={(e) => setFoundName(e.target.value)} />
                </label>
                <label className="field">
                  <span>Abbreviation</span>
                  <input className="input" value={foundAbbr} maxLength={6} onChange={(e) => setFoundAbbr(e.target.value.toUpperCase())} />
                </label>
                <button className="btn btn--primary" disabled={foundName.trim().length < 3} onClick={() => onAct?.({ type: "found-party", name: foundName, abbreviation: foundAbbr })}>
                  Register party
                </button>
              </div>
            )}
          </div>
        )}
      </Panel>

      {inCountry && player && (
        <Panel title="Run for office" defaultOpen>
          <div className="dim" style={{ fontSize: 11, marginBottom: 8 }}>
            Contests run on simulation time. Campaigning moves your support before the count.
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {c.legislature?.chambers.map((chamber) => (
              <button key={chamber.id} className="btn btn--sm" onClick={() => onAct?.({ type: "run-for-office", country: c.id, office: "chamber", chamberId: chamber.id })}>
                {chamber.name}
              </button>
            ))}
            {DIRECT_EXECUTIVE.has(c.government) && (
              <button className="btn btn--sm" onClick={() => onAct?.({ type: "run-for-office", country: c.id, office: "head-of-state" })}>
                {c.headOfStateTitle}
              </button>
            )}
            {player.partyId && (
              <button className="btn btn--sm" onClick={() => onAct?.({ type: "run-for-office", country: c.id, office: "party-leader", partyId: player.partyId })}>
                Party leadership
              </button>
            )}
          </div>
        </Panel>
      )}

      <Panel title={`Live races in ${c.name}`} defaultOpen>
        {!activeElections.length && <Empty>No election is open yet.</Empty>}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {activeElections.map((el) => (
            <RaceCard
              key={el.id}
              el={el}
              c={c}
              user={user}
              player={inCountry ? player : undefined}
              simTime={simTime}
              onAct={onAct}
            />
          ))}
        </div>
      </Panel>

      {inCountry && player?.office === "head-of-government" && (
        <Panel title="Appointments" defaultOpen={false}>
          <div className="dim" style={{ fontSize: 11, marginBottom: 8 }}>
            You are the {c.headOfGovernmentTitle}. Ministers are drawn from the parties in the coalition.
          </div>
          {c.executive.ministers.slice(0, 8).map((m) => (
            <div key={m.id} className="row" style={{ justifyContent: "space-between", padding: "3px 0", fontSize: 12 }}>
              <span className="dim">{m.title}</span>
              <span>{m.characterId ? characters[m.characterId]?.name ?? "Vacant" : "Vacant"}</span>
            </div>
          ))}
        </Panel>
      )}
    </div>
  );
}

function RaceCard({
  el,
  c,
  user,
  player,
  simTime,
  onAct,
}: {
  el: Election;
  c: Country;
  user: User;
  player?: Character;
  simTime: number;
  onAct?: (op: Record<string, unknown>) => void;
}) {
  const office = (el.office ?? "chamber") as ElectionOffice;
  const candidates = [...(el.candidates ?? [])].sort((a, b) => b.support - a.support);
  const mine = candidates.find((x) => x.userId === user.id);
  const days = Math.max(0, Math.ceil((el.endsAt - simTime) / DAY));
  const chamberName = c.legislature?.chambers.find((ch) => ch.id === el.chamberId)?.name;
  const party = el.partyId ? c.parties.find((p) => p.id === el.partyId) : undefined;
  const title = office === "chamber"
    ? chamberName ?? "Chamber"
    : office === "party-leader"
      ? `${party?.name ?? "Party"} leadership`
      : office === "head-of-state"
        ? c.headOfStateTitle
        : c.headOfGovernmentTitle;

  const enter = () => {
    if (office === "chamber") onAct?.({ type: "run-for-office", country: c.id, office, chamberId: el.chamberId });
    else if (office === "party-leader") onAct?.({ type: "run-for-office", country: c.id, office, partyId: el.partyId });
    else onAct?.({ type: "run-for-office", country: c.id, office });
  };

  return (
    <div className="card" style={{ borderColor: mine ? "var(--accent-2)" : undefined }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 4 }}>
        <strong style={{ fontSize: 12.5 }}>{title}</strong>
        <span className="dim mono" style={{ fontSize: 11 }}>{days}d left</span>
      </div>
      {el.result?.length ? (
        <div className="dim" style={{ fontSize: 11, marginBottom: 6 }}>Counted: {el.result[0]?.name} led with {el.result[0]?.support}%.</div>
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {candidates.slice(0, 8).map((cand) => {
          const p = cand.partyId ? c.parties.find((x) => x.id === cand.partyId) : undefined;
          return (
            <div key={cand.id}>
              <div className="row" style={{ justifyContent: "space-between", fontSize: 11 }}>
                <span className={cand.userId === user.id ? "" : "dim"}>
                  {cand.userId === user.id ? "You" : cand.name}
                  {p ? ` · ${p.abbreviation}` : ""}
                </span>
                <span className="mono">{cand.support.toFixed(1)}%</span>
              </div>
              <Bar value={cand.support} max={100} tone={p?.color} />
            </div>
          );
        })}
        {!candidates.length && <div className="dim" style={{ fontSize: 11 }}>No candidates have declared yet.</div>}
      </div>

      {!mine && player && (
        <button className="btn btn--sm btn--primary" style={{ marginTop: 8 }} onClick={enter}>Enter this race</button>
      )}

      {mine && (
        <div style={{ marginTop: 8 }}>
          <div className="dim" style={{ fontSize: 10.5, marginBottom: 4 }}>Campaign — 3 day cooldown</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {CAMPAIGNS.map((k) => (
              <button
                key={k.id}
                className="btn btn--sm"
                onClick={() => onAct?.({ type: "campaign", electionId: el.id, kind: k.id })}
                title={k.cost ? `${credits(k.cost)} credits` : "Free, but risky"}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
