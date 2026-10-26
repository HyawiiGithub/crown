import type {
  Character,
  Country,
  Election,
  ElectionCandidate,
  ElectionOffice,
  Party,
  PolicyArea,
  PoliticalOffice,
  World,
} from "../shared/types";
import { pushEvent } from "./bootstrap";
import { Rng, approach, clamp, clamp01 } from "./rng";

/**
 * Player politics.
 *
 * The engine already schedules and resolves party-level elections. This layer
 * adds the part a game needs: a human character who can join a party, register
 * for any available office, campaign on the live clock, and actually take the
 * seat or the office when the votes are counted.
 */

const DAY = 86_400;
const CAMPAIGN_COOLDOWN = 3 * DAY;
const CAMPAIGN_COST: Record<CampaignKind, number> = {
  rally: 60_000,
  ads: 180_000,
  ground: 45_000,
  debate: 0,
};
const PARTY_FOUNDING_COST = 400_000;
const STARTING_FUNDS = 2_000_000;

export type CampaignKind = "rally" | "ads" | "ground" | "debate";

export function findPlayerCharacter(world: World, userId: string): Character | undefined {
  return Object.values(world.characters).find((c) => c.userId === userId && !c.removedAt);
}

export function characterForUserInCountry(world: World, userId: string, country: string): Character | undefined {
  const ch = findPlayerCharacter(world, userId);
  return ch && ch.country === country ? ch : undefined;
}

function canHoldElections(c: Country): boolean {
  return Boolean(c.legislature);
}

function hasDirectExecutive(c: Country): boolean {
  return c.government === "presidential-republic" || c.government === "federal-republic" || c.government === "semi-presidential-republic";
}

function defaultChamber(c: Country) {
  return c.legislature?.chambers.find((ch) => ch.moneyBills) ?? c.legislature?.chambers[0];
}

function newCandidateId(characterId: string, electionId: string): string {
  return `cand-${electionId}-${characterId}`.slice(0, 120);
}

function candidateBase(party: Party | undefined, ch: Character): number {
  const popularity = party?.popularity ?? 8;
  const charisma = clamp((ch.stats.charisma + 100) / 200, 0, 1);
  return clamp(10 + popularity * 0.42 + charisma * 14, 3, 62);
}

export function ensureCandidates(world: World, c: Country, el: Election): void {
  if (!el.candidates) el.candidates = [];
  if (el.candidates.length) return;
  if (el.office === "party-leader") {
    const party = world.parties[el.partyId ?? ""];
    const leader = party?.leaderId ? world.characters[party.leaderId] : undefined;
    if (leader) {
      el.candidates.push({
        id: newCandidateId(leader.id, el.id),
        characterId: leader.id,
        userId: leader.userId,
        name: leader.name,
        partyId: party?.id,
        support: clamp(38 + leader.stats.charisma / 8 + leader.stats.competence / 10, 20, 72),
        funds: 0,
        momentum: 10,
        registeredAt: el.scheduledAt,
        isPlayer: Boolean(leader.userId),
      });
    }
    return;
  }

  if (el.office === "head-of-state") {
    const incumbent = world.characters[c.executive.headOfStateId ?? ""];
    if (incumbent) {
      el.candidates.push({
        id: newCandidateId(incumbent.id, el.id),
        characterId: incumbent.id,
        userId: incumbent.userId,
        name: incumbent.name,
        partyId: incumbent.partyId,
        support: clamp(c.executive.approval, 5, 80),
        funds: 0,
        momentum: 12,
        registeredAt: el.scheduledAt,
        isPlayer: Boolean(incumbent.userId),
      });
    }
    for (const party of c.parties) {
      const leader = party.leaderId ? world.characters[party.leaderId] : undefined;
      if (!leader || leader.id === incumbent?.id) continue;
      el.candidates.push({
        id: newCandidateId(leader.id, el.id),
        characterId: leader.id,
        userId: leader.userId,
        name: leader.name,
        partyId: party.id,
        support: clamp(6 + party.popularity * 0.58 + (leader.stats.charisma + 100) / 40, 2, 58),
        funds: 0,
        momentum: 8,
        registeredAt: el.scheduledAt,
        isPlayer: Boolean(leader.userId),
      });
    }
    return;
  }

  // Chamber contest: one candidate per party leader, plus the party label.
  for (const party of c.parties) {
    const leader = party.leaderId ? world.characters[party.leaderId] : undefined;
    el.candidates.push({
      id: newCandidateId(leader?.id ?? party.id, el.id),
      characterId: leader?.id,
      userId: leader?.userId,
      name: leader?.name ?? `${party.name} candidate`,
      partyId: party.id,
      support: clamp(8 + party.popularity * 0.7, 3, 70),
      funds: 0,
      momentum: 6,
      registeredAt: el.scheduledAt,
      isPlayer: Boolean(leader?.userId),
    });
  }
  void c;
}

function openElection(world: World, c: Country, office: ElectionOffice, chamberId?: string, partyId?: string): Election {
  const chamber = office === "chamber" ? c.legislature?.chambers.find((ch) => ch.id === chamberId) ?? defaultChamber(c) : undefined;
  const id = `elec-${c.id}-${office}-${Math.round(world.t)}-${Math.round(Math.random() * 1e5)}`;
  const districtCount = clamp(Math.round(Math.log10(Math.max(10, c.economy.population)) * 34), 6, 180);
  const populationWeights: number[] = [];
  for (let i = 0; i < districtCount; i++) populationWeights.push(1 / districtCount);
  const el: Election = {
    id,
    country: c.id,
    chamberId: chamber?.id ?? "executive",
    kind: chamber?.election ?? "indirect",
    office,
    partyId,
    scheduledAt: world.t,
    endsAt: world.t + (office === "party-leader" ? 25 : 45) * DAY,
    status: "campaign",
    votes: {},
    turnout: {},
    districtCount: office === "chamber" ? districtCount : 1,
    districtPopulations: office === "chamber" ? populationWeights : [1],
    projection: {},
    enthusiasm: clamp(35 + c.executive.approval * 0.35 + (c.economy.gdpGrowth || 0) * 500, 10, 98),
    districtNames: office === "chamber" ? Array.from({ length: districtCount }, (_, i) => `${c.name} District ${i + 1}`) : [c.name],
    candidates: [],
  };
  c.elections.push(el);
  ensureCandidates(world, c, el);
  return el;
}

// ===========================================================================
// Politician lifecycle
// ===========================================================================

export interface CreatePoliticianInput {
  userId: string;
  username: string;
  name: string;
  country: string;
  partyId?: string;
}

export function createPolitician(world: World, input: CreatePoliticianInput): { ok: boolean; message: string; character?: Character } {
  const c = world.countries[input.country];
  if (!c) return { ok: false, message: "No such country" };
  if (c.annexedBy) return { ok: false, message: `${c.name} no longer exists` };
  if (findPlayerCharacter(world, input.userId)) return { ok: false, message: "You already have a politician in this world" };

  const party = input.partyId ? c.parties.find((p) => p.id === input.partyId) : undefined;
  if (input.partyId && !party) return { ok: false, message: "That party is not registered here" };
  const name = input.name.replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 40);
  if (name.length < 2) return { ok: false, message: "Give your politician a name" };

  const ideology = party?.ideology ?? c.ideology;
  const id = `pc-${c.id}-${crypto.randomUUID().slice(0, 8)}`;
  const char: Character = {
    id,
    name,
    country: c.id,
    role: "activist",
    partyId: party?.id,
    stats: {
      competence: 45,
      charisma: 42 + Math.round(Math.random() * 20),
      integrity: 55,
      ambition: 70,
      ideology: Math.round(ideology),
      popularity: 32,
      experience: 8,
      militancy: 0,
    },
    userId: input.userId,
    office: party ? "party-member" : "citizen",
    funds: STARTING_FUNDS,
    influence: party ? 12 : 0,
    createdAt: world.t,
  };
  world.characters[id] = char;
  if (party) party.memberCount += 1;

  pushEvent(world, {
    kind: "political",
    severity: "notice",
    country: c.id,
    title: `${name} enters politics in ${c.name}`,
    body: party ? `${name} joins ${party.name} and is eligible to stand for office.` : `${name} registers as an independent.`,
    actors: [id],
    byUserId: input.userId,
    tags: ["player", "politician"],
  });
  return { ok: true, message: party ? `You joined ${party.name}. Your career starts now.` : "You registered as an independent.", character: char };
}

export function joinParty(world: World, userId: string, partyId: string): { ok: boolean; message: string } {
  const ch = findPlayerCharacter(world, userId);
  if (!ch) return { ok: false, message: "Create your politician first" };
  const c = world.countries[ch.country];
  const party = c?.parties.find((p) => p.id === partyId);
  if (!party) return { ok: false, message: "That party is not registered here" };
  if (ch.partyId === party.id) return { ok: false, message: "You are already a member" };
  const old = ch.partyId ? world.parties[ch.partyId] : undefined;
  if (old) old.memberCount = Math.max(0, old.memberCount - 1);
  ch.partyId = party.id;
  ch.office = ch.office === "citizen" ? "party-member" : ch.office;
  ch.influence = Math.max(ch.influence ?? 0, 10);
  party.memberCount += 1;
  for (const el of c.elections) {
    if (el.status === "complete") continue;
    for (const cand of el.candidates ?? []) {
      if (cand.userId === userId) cand.partyId = party.id;
    }
  }
  pushEvent(world, {
    kind: "political",
    severity: "info",
    country: c.id,
    title: `${ch.name} joins ${party.name}`,
    body: `A new member joins the ${party.name} ranks.`,
    actors: [ch.id],
    byUserId: userId,
    tags: ["player", "party"],
  });
  return { ok: true, message: `You joined ${party.name}` };
}

export function foundParty(world: World, userId: string, rawName: string, rawAbbr: string): { ok: boolean; message: string } {
  const ch = findPlayerCharacter(world, userId);
  if (!ch) return { ok: false, message: "Create your politician first" };
  const c = world.countries[ch.country];
  if (!c) return { ok: false, message: "No such country" };
  if (ch.office === "party-leader") return { ok: false, message: "You already lead a party" };
  if ((ch.funds ?? 0) < PARTY_FOUNDING_COST) return { ok: false, message: "Founding a party costs 400,000 credits" };
  const name = rawName.replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 48);
  const abbr = rawAbbr.replace(/[^A-Za-z0-9]/g, "").slice(0, 6).toUpperCase() || name.slice(0, 3).toUpperCase();
  if (name.length < 3) return { ok: false, message: "Give the party a name" };
  if (c.parties.some((p) => p.name.toLowerCase() === name.toLowerCase() || p.abbreviation === abbr)) {
    return { ok: false, message: "A party with that name or abbreviation already exists" };
  }

  const old = ch.partyId ? world.parties[ch.partyId] : undefined;
  if (old) old.memberCount = Math.max(0, old.memberCount - 1);
  ch.funds = (ch.funds ?? 0) - PARTY_FOUNDING_COST;

  const ideology = ch.stats.ideology;
  const template = c.parties[0]?.platform;
  const platform = Object.fromEntries(
    Object.keys(template ?? c.policies).map((key) => [key, clamp(ideology + (Math.random() * 20 - 10), -100, 100)]),
  ) as Record<PolicyArea, number>;

  const palette = ["#c9a227", "#7c3aed", "#0ea5e9", "#16a34a", "#dc2626", "#f59e0b", "#14b8a6", "#ec4899"];
  const party: Party = {
    id: `party-${c.id}-${crypto.randomUUID().slice(0, 6)}`,
    country: c.id,
    name,
    abbreviation: abbr,
    ideology,
    cohesion: 72,
    popularity: 4,
    color: palette[Math.floor(Math.random() * palette.length)],
    leaderId: ch.id,
    seats: Object.fromEntries((c.legislature?.chambers ?? []).map((chamber) => [chamber.id, 0])),
    treasury: 200_000,
    memberCount: 1,
    status: "outside",
    platform,
    founded: world.t,
  };
  c.parties.push(party);
  world.parties[party.id] = party;
  ch.partyId = party.id;
  ch.office = "party-leader";
  ch.role = "party-leader";
  ch.influence = 100;

  pushEvent(world, {
    kind: "political",
    severity: "major",
    country: c.id,
    title: `${name} founded in ${c.name}`,
    body: `${ch.name} launches ${name} (${abbr}) and will contest the next election.`,
    actors: [ch.id],
    byUserId: userId,
    tags: ["player", "party"],
  });
  return { ok: true, message: `${name} is registered. You are its leader.` };
}

// ===========================================================================
// Running for office
// ===========================================================================

export interface RunForOfficeInput {
  userId: string;
  userIdName?: string;
  country: string;
  office: ElectionOffice;
  chamberId?: string;
  partyId?: string;
}

export function runForOffice(world: World, input: RunForOfficeInput): { ok: boolean; message: string; electionId?: string } {
  const ch = characterForUserInCountry(world, input.userId, input.country);
  if (!ch) return { ok: false, message: "Create your politician in this country first" };
  const c = world.countries[input.country];
  if (!c || c.annexedBy) return { ok: false, message: "That country is not available" };

  if (input.office === "head-of-state" && !hasDirectExecutive(c)) {
    return { ok: false, message: `${c.headOfStateTitle} is not directly elected in ${c.name}. Run for the chamber or your party instead.` };
  }
  if (input.office === "head-of-government" && hasDirectExecutive(c)) {
    return { ok: false, message: `The ${c.headOfGovernmentTitle} is chosen through the chamber and party leadership here.` };
  }

  let el: Election | undefined;
  if (input.office === "chamber") {
    const chamber = input.chamberId
      ? c.legislature?.chambers.find((x) => x.id === input.chamberId)
      : defaultChamber(c);
    if (!chamber) return { ok: false, message: "This country has no chamber to contest" };
    if (!canHoldElections(c)) return { ok: false, message: "Elections are suspended here" };
    el = c.elections.find((e) => (e.office ?? "chamber") === "chamber" && e.chamberId === chamber.id && e.status !== "complete");
    if (!el) el = openElection(world, c, "chamber", chamber.id);
  } else if (input.office === "head-of-state") {
    el = c.elections.find((e) => e.office === "head-of-state" && e.status !== "complete");
    if (!el) el = openElection(world, c, "head-of-state");
  } else if (input.office === "head-of-government") {
    const party = ch.partyId ? world.parties[ch.partyId] : undefined;
    if (!party) return { ok: false, message: "Join a party before seeking the government" };
    el = c.elections.find((e) => e.office === "party-leader" && e.partyId === party.id && e.status !== "complete");
    if (!el) el = openElection(world, c, "party-leader", undefined, party.id);
  } else if (input.office === "party-leader") {
    const party = input.partyId ? world.parties[input.partyId] : ch.partyId ? world.parties[ch.partyId] : undefined;
    if (!party) return { ok: false, message: "Join a party before running for its leadership" };
    if (party.country !== c.id) return { ok: false, message: "That party is in another country" };
    if (party.leaderId === ch.id) return { ok: false, message: "You already lead this party" };
    el = c.elections.find((e) => e.office === "party-leader" && e.partyId === party.id && e.status !== "complete");
    if (!el) el = openElection(world, c, "party-leader", undefined, party.id);
    ch.partyId = party.id;
  } else {
    return { ok: false, message: "Unknown office" };
  }

  ensureCandidates(world, c, el);
  const candidates = el.candidates ?? (el.candidates = []);
  if (candidates.some((x) => x.userId === input.userId)) {
    return { ok: false, message: "You are already a candidate in this race" };
  }
  const existing = candidates.find((x) => x.characterId === ch.id);
  if (existing) return { ok: false, message: "You are already on the ballot" };

  const party = ch.partyId ? world.parties[ch.partyId] : undefined;
  const support = input.office === "head-of-state"
    ? clamp(6 + (party?.popularity ?? 4) * 0.5 + clamp((ch.stats.charisma + 100) / 40, 0, 5), 2, 55)
    : candidateBase(party, ch);
  const candidate: ElectionCandidate = {
    id: newCandidateId(ch.id, el.id),
    characterId: ch.id,
    userId: ch.userId,
    name: ch.name,
    partyId: party?.id,
    support: Math.round(support * 10) / 10,
    funds: ch.funds ?? 0,
    momentum: 4,
    registeredAt: world.t,
    isPlayer: true,
  };
  candidates.push(candidate);
  ch.office = input.office === "party-leader" ? "party-member" : ch.office;
  ch.influence = clamp((ch.influence ?? 0) + 6, 0, 100);

  pushEvent(world, {
    kind: "political",
    severity: "notice",
    country: c.id,
    title: `${ch.name} enters the race for ${officeLabel(c, el, party)}`,
    body: `${ch.name}${party ? ` (${party.abbreviation})` : ""} registers as a candidate.`,
    actors: [ch.id],
    byUserId: input.userId,
    tags: ["player", "election", "candidate"],
  });
  return { ok: true, message: `You are on the ballot for ${officeLabel(c, el, party)}`, electionId: el.id };
}

function officeLabel(c: Country, el: Election, party?: Party): string {
  if (el.office === "head-of-state") return c.headOfStateTitle;
  if (el.office === "head-of-government") return c.headOfGovernmentTitle;
  if (el.office === "party-leader") return `${party?.name ?? "party"} leadership`;
  return c.legislature?.chambers.find((ch) => ch.id === el.chamberId)?.name ?? "the chamber";
}

export function campaign(world: World, userId: string, electionId: string, kind: CampaignKind): { ok: boolean; message: string; delta?: number } {
  const ch = findPlayerCharacter(world, userId);
  if (!ch) return { ok: false, message: "Create your politician first" };
  const c = world.countries[ch.country];
  const el = c?.elections.find((e) => e.id === electionId);
  if (!c || !el || el.status === "complete") return { ok: false, message: "That race has closed" };
  const candidate = el.candidates?.find((x) => x.userId === userId);
  if (!candidate) return { ok: false, message: "You are not a candidate in that race" };
  if (candidate.lastCampaignAt !== undefined && world.t - candidate.lastCampaignAt < CAMPAIGN_COOLDOWN) {
    const days = Math.ceil((CAMPAIGN_COOLDOWN - (world.t - candidate.lastCampaignAt)) / DAY);
    return { ok: false, message: `Your campaign needs ${days} more day${days === 1 ? "" : "s"} before the next push` };
  }
  const cost = CAMPAIGN_COST[kind];
  if ((ch.funds ?? 0) < cost) return { ok: false, message: `You need ${Math.round(cost / 100).toLocaleString()} more credits for this` };
  ch.funds = (ch.funds ?? 0) - cost;
  candidate.funds = ch.funds;
  candidate.lastCampaignAt = world.t;

  const charisma = clamp01((ch.stats.charisma + 100) / 200);
  const competence = clamp01((ch.stats.competence + 100) / 200);
  const party = ch.partyId ? world.parties[ch.partyId] : undefined;
  const partyPull = (party?.popularity ?? 5) / 100;
  const noise = Math.random() * 3 - 1;
  let gain = 0;
  let momentum = 8;

  if (kind === "rally") {
    gain = 1.6 + charisma * 4.2 + partyPull * 2 + noise;
    momentum = 14;
    el.enthusiasm = clamp(el.enthusiasm + 1.6, 5, 98);
  } else if (kind === "ads") {
    gain = 2.2 + charisma * 3.2 + competence * 1.6 + noise;
    momentum = 10;
  } else if (kind === "ground") {
    gain = 1.2 + competence * 4.4 + partyPull * 3 + noise;
    momentum = 11;
    el.enthusiasm = clamp(el.enthusiasm + 0.9, 5, 98);
  } else {
    gain = 0.5 + charisma * 5 + competence * 3 + (Math.random() < 0.45 ? 4.5 : -3.2);
    momentum = 18;
  }

  const headroom = clamp01(1 - candidate.support / 92);
  const applied = clamp(gain * headroom, -6, 8);
  candidate.support = clamp(candidate.support + applied, 0, 92);
  candidate.momentum = clamp(candidate.momentum + momentum, 0, 100);
  ch.stats.popularity = clamp(ch.stats.popularity + applied * 0.55, 0, 100);
  ch.influence = clamp((ch.influence ?? 0) + 1.5, 0, 100);
  if (party) party.popularity = clamp(party.popularity + applied * 0.055, 0.5, 97);

  const label: Record<CampaignKind, string> = {
    rally: "holds a rally",
    ads: "launches a broadcast campaign",
    ground: "puts organisers on the doors",
    debate: "takes the debate stage",
  };
  pushEvent(world, {
    kind: "political",
    severity: "info",
    country: c.id,
    title: `${ch.name} ${label[kind]} in ${c.name}`,
    body: `Support is now ${candidate.support.toFixed(1)}% in the ${officeLabel(c, el, party)} race.`,
    actors: [ch.id],
    byUserId: userId,
    tags: ["player", "campaign", kind],
  });
  return { ok: true, message: `${label[kind][0].toUpperCase()}${label[kind].slice(1)}. Support ${candidate.support.toFixed(1)}%.`, delta: applied };
}

export function appointMinister(world: World, userId: string, country: string, area: PolicyArea, characterId: string): { ok: boolean; message: string } {
  const c = world.countries[country];
  if (!c) return { ok: false, message: "No such country" };
  const leader = c.executive.headOfGovernmentId ? world.characters[c.executive.headOfGovernmentId] : undefined;
  if (!leader || leader.userId !== userId) return { ok: false, message: `Only the ${c.headOfGovernmentTitle} can appoint ministers` };
  const target = world.characters[characterId];
  if (!target || target.country !== country) return { ok: false, message: "That person is not available in this country" };
  const post = c.executive.ministers.find((m) => m.id === area);
  if (!post) return { ok: false, message: "No such ministry" };
  if (post.characterId) {
    const old = world.characters[post.characterId];
    if (old && old.id !== target.id) {
      old.role = "legislator";
      old.office = old.chamberId ? "legislator" : "citizen";
    }
  }
  post.characterId = target.id;
  post.partyId = target.partyId;
  target.role = "minister";
  target.office = "minister";
  pushEvent(world, {
    kind: "political",
    severity: "notice",
    country,
    title: `${target.name} appointed ${post.title}`,
    body: `The ${c.headOfGovernmentTitle} reshuffles the cabinet.`,
    actors: [leader.id, target.id],
    byUserId: userId,
    tags: ["appointment", "cabinet"],
  });
  return { ok: true, message: `${target.name} is now ${post.title}` };
}

// ===========================================================================
// Resolution (called from step-politics)
// ===========================================================================

export function stepPlayerPolitics(world: World, rnd: Rng): void {
  for (const c of Object.values(world.countries)) {
    if (!c.elections.length) continue;
    for (const el of c.elections) {
      if (el.status === "complete") continue;
      ensureCandidates(world, c, el);
      if (el.office === "chamber" || !el.office) continue;

      for (const cand of el.candidates ?? []) {
        if (cand.isPlayer) {
          cand.momentum = approach(cand.momentum, 0, 0.004 * Math.max(1, el.districtCount));
        } else if (Math.random() < 0.02) {
          cand.support = clamp(cand.support + rnd.float(-0.15, 0.35), 0, 85);
        }
      }

      if (world.t >= el.endsAt) {
        if (el.office === "head-of-state") resolveExecutive(world, c, el, rnd);
        else if (el.office === "party-leader") resolvePartyLeadership(world, c, el, rnd);
      }
    }
  }
}

function sortedCandidates(world: World, el: Election, rnd: Rng): ElectionCandidate[] {
  return [...(el.candidates ?? [])]
    .map((cand) => {
      const party = cand.partyId ? world.parties[cand.partyId] : undefined;
      const ch = cand.characterId ? world.characters[cand.characterId] : undefined;
      const charisma = ch ? (ch.stats.charisma + 100) / 200 : 0.5;
      const score = cand.support + (party?.popularity ?? 0) * 0.12 + charisma * 4 + cand.momentum * 0.12 + rnd.normal() * 2.4;
      return { cand, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.cand);
}

function resolveExecutive(world: World, c: Country, el: Election, rnd: Rng): void {
  const ordered = sortedCandidates(world, el, rnd);
  const winner = ordered[0];
  el.status = "complete";
  el.result = ordered.map((x) => ({ characterId: x.characterId, name: x.name, partyId: x.partyId, support: Math.round(x.support * 10) / 10 }));
  if (!winner?.characterId) {
    pushEvent(world, { kind: "political", severity: "notice", country: c.id, title: `${c.name}: no executive winner`, body: "The contest produced no valid winner.", tags: ["election"] });
    return;
  }
  const ch = world.characters[winner.characterId];
  if (!ch) return;
  const oldId = c.executive.headOfStateId;
  const old = oldId ? world.characters[oldId] : undefined;
  if (old && old.id !== ch.id) {
    old.role = "legislator";
    old.office = old.chamberId ? "legislator" : "citizen";
  }
  c.executive.headOfStateId = ch.id;
  ch.role = "head-of-state";
  ch.office = "head-of-state";
  ch.partyId = winner.partyId ?? ch.partyId;
  el.winnerId = ch.id;
  if (hasDirectExecutive(c)) {
    c.executive.headOfGovernmentId = ch.id;
    ch.office = "head-of-government";
  }
  c.executive.approval = clamp(c.executive.approval + (winner.isPlayer ? 4 : 0), 0, 100);
  pushEvent(world, {
    kind: "political",
    severity: "major",
    country: c.id,
    title: `${ch.name} wins the ${c.headOfStateTitle} of ${c.name}`,
    body: `${ch.name}${winner.partyId ? ` (${world.parties[winner.partyId]?.abbreviation ?? winner.partyId})` : ""} takes office with ${winner.support.toFixed(1)}% support.`,
    actors: [ch.id],
    byUserId: ch.userId,
    tags: ["election", "player", "executive"],
  });
}

function resolvePartyLeadership(world: World, c: Country, el: Election, rnd: Rng): void {
  const party = el.partyId ? world.parties[el.partyId] : undefined;
  if (!party) {
    el.status = "complete";
    return;
  }
  const ordered = sortedCandidates(world, el, rnd);
  const winner = ordered[0];
  el.status = "complete";
  el.result = ordered.map((x) => ({ characterId: x.characterId, name: x.name, partyId: x.partyId, support: Math.round(x.support * 10) / 10 }));
  if (!winner?.characterId) return;
  const ch = world.characters[winner.characterId];
  if (!ch) return;
  const oldId = party.leaderId;
  const old = oldId ? world.characters[oldId] : undefined;
  if (old && old.id !== ch.id && old.office === "party-leader") {
    old.office = old.chamberId ? "legislator" : "citizen";
    old.role = old.chamberId ? "legislator" : "activist";
  }
  party.leaderId = ch.id;
  party.memberCount = Math.max(party.memberCount, 1);
  ch.partyId = party.id;
  ch.role = "party-leader";
  ch.office = "party-leader";
  ch.influence = 100;
  el.winnerId = ch.id;

  // If this is the largest governing party, its leader forms the government.
  const lower = c.legislature?.chambers.find((x) => x.moneyBills) ?? c.legislature?.chambers[0];
  if (lower) {
    const govSeats = c.parties
      .filter((p) => c.executive.coalition.includes(p.id))
      .reduce((a, p) => a + (p.seats[lower.id] ?? 0), 0);
    const largestGov = [...c.parties]
      .filter((p) => c.executive.coalition.includes(p.id))
      .sort((a, b) => (b.seats[lower.id] ?? 0) - (a.seats[lower.id] ?? 0))[0];
    const total = Object.values(c.parties).reduce((a, p) => a + (p.seats[lower.id] ?? 0), 0);
    if (largestGov?.id === party.id && govSeats >= total / 2) {
      const previous = c.executive.headOfGovernmentId ? world.characters[c.executive.headOfGovernmentId] : undefined;
      if (previous && previous.id !== ch.id && previous.office === "head-of-government") {
        previous.office = previous.chamberId ? "legislator" : "citizen";
        previous.role = previous.chamberId ? "legislator" : "activist";
      }
      c.executive.headOfGovernmentId = ch.id;
      ch.office = "head-of-government";
      ch.role = "head-of-government";
    }
  }

  pushEvent(world, {
    kind: "political",
    severity: "major",
    country: c.id,
    title: `${ch.name} elected leader of ${party.name}`,
    body: `${ch.name} wins the leadership with ${winner.support.toFixed(1)}% of the party vote.`,
    actors: [ch.id],
    byUserId: ch.userId,
    tags: ["election", "party", "player"],
  });
}

function seatInChamber(
  world: World,
  c: Country,
  ch: Character,
  chamberId: string,
  partyId: string | undefined,
  cand: ElectionCandidate,
  chamberName: string,
): void {
  ch.chamberId = chamberId;
  ch.districtId = ch.districtId ?? `${c.id}-${chamberId}-${cand.id.slice(-4)}`;
  if (partyId) ch.partyId = partyId;
  const topOffice = ch.office === "head-of-state" || ch.office === "head-of-government" || ch.office === "party-leader" || ch.office === "minister";
  if (!topOffice) ch.office = "legislator";
  if (ch.role !== "head-of-state" && ch.role !== "head-of-government" && ch.role !== "party-leader" && ch.role !== "minister") {
    ch.role = "legislator";
  }
  const members = c.legislature?.membership[chamberId] ?? [];
  if (c.legislature && !members.includes(ch.id)) {
    c.legislature.membership[chamberId] = [ch.id, ...members];
  }
  if (cand.isPlayer) {
    pushEvent(world, {
      kind: "political",
      severity: "major",
      country: c.id,
      title: `${ch.name} elected to the ${chamberName}`,
      body: `${ch.name} wins a seat${partyId ? ` for ${world.parties[partyId]?.name ?? partyId}` : " as an independent"} with ${cand.support.toFixed(1)}% support.`,
      actors: [ch.id],
      byUserId: ch.userId,
      tags: ["election", "player", "seat"],
    });
  }
}

/**
 * Apply candidate strength to a chamber result and seat the humans.
 * Called by finaliseElection after the party seat counts are settled.
 */
export function applyCandidateResults(world: World, c: Country, el: Election, chamberId: string, rnd: Rng): void {
  const chamber = c.legislature?.chambers.find((x) => x.id === chamberId);
  if (!chamber) return;
  ensureCandidates(world, c, el);
  const ordered = sortedCandidates(world, el, rnd);
  el.result = ordered.map((x) => ({ characterId: x.characterId, name: x.name, partyId: x.partyId, support: Math.round(x.support * 10) / 10 }));

  for (const cand of ordered) {
    if (!cand.characterId) continue;
    const ch = world.characters[cand.characterId];
    if (!ch) continue;
    const party = cand.partyId ? world.parties[cand.partyId] : undefined;
    const threshold = cand.isPlayer ? 9 : 12;
    if (cand.support < threshold) continue;

    if (party && (party.seats[chamberId] ?? 0) > 0) {
      seatInChamber(world, c, ch, chamberId, party.id, cand, chamber.name);
    } else if (!party && cand.isPlayer && cand.support >= 16) {
      // An independent who campaigns hard enough takes a seat from the largest
      // party's allocation rather than being locked out of the chamber.
      const donor = [...c.parties].sort((a, b) => (b.seats[chamberId] ?? 0) - (a.seats[chamberId] ?? 0))[0];
      if (donor && (donor.seats[chamberId] ?? 0) > 0) {
        donor.seats[chamberId] = (donor.seats[chamberId] ?? 0) - 1;
        seatInChamber(world, c, ch, chamberId, undefined, cand, chamber.name);
      }
    }
  }

  // The leader of the largest governing party becomes head of government.
  const government = c.executive.coalition
    .map((pid) => world.parties[pid])
    .filter((p): p is Party => Boolean(p))
    .sort((a, b) => (b.seats[chamberId] ?? 0) - (a.seats[chamberId] ?? 0));
  const leader = government[0]?.leaderId ? world.characters[government[0].leaderId] : undefined;
  if (leader && leader.country === c.id) {
    const previous = c.executive.headOfGovernmentId ? world.characters[c.executive.headOfGovernmentId] : undefined;
    if (previous && previous.id !== leader.id && previous.office === "head-of-government") {
      previous.office = previous.chamberId ? "legislator" : "citizen";
      previous.role = previous.chamberId ? "legislator" : "activist";
    }
    c.executive.headOfGovernmentId = leader.id;
    leader.office = "head-of-government";
    leader.role = "head-of-government";
    if (leader.userId) {
      pushEvent(world, {
        kind: "political",
        severity: "major",
        country: c.id,
        title: `${leader.name} becomes ${c.headOfGovernmentTitle} of ${c.name}`,
        body: `${government[0].name} leads the new government.`,
        actors: [leader.id],
        byUserId: leader.userId,
        tags: ["election", "player", "government"],
      });
    }
  }
}

export function officeForCharacter(ch: Character): PoliticalOffice {
  return ch.office ?? (ch.role === "head-of-state" ? "head-of-state" : ch.role === "head-of-government" ? "head-of-government" : ch.role === "legislator" ? "legislator" : ch.role === "minister" ? "minister" : "citizen");
}
