import type { Character, Party, World, WorldDirective } from "../shared/types";
import { getScenario } from "../data/scenarios";
import { buildWorld, pushEvent, recomputeGlobals } from "./bootstrap";
import { addDirective, addRule, fastForward, setSpeed, type SimEngine } from "./engine";
import { getNum, setNum } from "./paths";
import { executeCustomScript } from "./rules";
import { annex, declareWar, imposeSanction, liftSanction, signTreaty } from "./step-world";
import { clamp, type Rng } from "./rng";

/**
 * Developer console operations, shared by the singleplayer runtime and the
 * multiplayer Durable Object.
 */

export interface DevOpResult {
  ok: boolean;
  message: string;
  data?: unknown;
  /** Set when the operation built a brand new world. */
  replaced?: World;
}

export async function runDevOp(w: World, engine: SimEngine, rng: Rng, body: { op: string; [k: string]: unknown }, actor: { id: string; username: string }): Promise<DevOpResult> {
      switch (body.op) {
        // ---- time control ----
        case "speed":
          return setSpeed(w, Number(body.speed ?? 1), body.paused === undefined ? undefined : Boolean(body.paused));
        case "pause":
          return setSpeed(w, w.speed, true);
        case "resume":
          return setSpeed(w, w.speed || 1, false);
        case "fast-forward": {
          const days = Number(body.days ?? 30);
          return fastForward(w, engine, days * 86400);
        }

        // ---- parameters ----
        case "set-param": {
          const key = String(body.key ?? "");
          if (!(key in w.params)) return { ok: false, message: `Unknown parameter "${key}"` };
          const before = getNum(w.params, key);
          if (!setNum(w.params, key, Number(body.value))) return { ok: false, message: `Could not set ${key}` };
          pushEvent(w, { kind: "system", severity: "notice", title: `Parameter ${key} changed`, body: `${before} -> ${body.value} by ${actor.username}`, byUserId: actor.id, tags: ["dev", "params"] });
          return { ok: true, message: `${key} = ${body.value}` };
        }
        case "reset-params": {
          const s = getScenario(w.scenarioId);
          w.params = { ...s.params };
          pushEvent(w, { kind: "system", severity: "notice", title: "Parameters reset", body: `Restored scenario defaults by ${actor.username}`, byUserId: actor.id, tags: ["dev"] });
          return { ok: true, message: "Parameters reset to scenario defaults" };
        }

        // ---- direct stat edits ----
        case "set-stat": {
          const scope = String(body.scope ?? "country");
          const id = String(body.id ?? "");
          const path = String(body.path ?? "");
          const target =
            scope === "country" ? w.countries[id] ?? w.customCountries[id]
            : scope === "company" ? w.companies[id]
            : scope === "global" ? w
            : w.markets;
          if (!target) return { ok: false, message: `No ${scope} "${id}"` };
          const before = getNum(target, path);
          if (!Number.isFinite(before)) return { ok: false, message: `Path "${path}" does not resolve to a number` };
          if (!setNum(target, path, Number(body.value))) return { ok: false, message: "Write refused" };
          pushEvent(w, { kind: "system", severity: "major", country: scope === "country" ? id : undefined, title: `${actor.username} edited ${id}`, body: `${path}: ${before} -> ${body.value}`, byUserId: actor.id, tags: ["dev", "stat"] });
          return { ok: true, message: `${id}.${path} = ${body.value}`, data: { before, after: Number(body.value) } };
        }
        case "inspect": {
          const scope = String(body.scope ?? "country");
          const id = String(body.id ?? "");
          const target =
            scope === "company" ? w.companies[id]
            : scope === "global" ? w
            : scope === "market" ? w.markets
            : w.countries[id] ?? w.customCountries[id];
          if (!target) return { ok: false, message: `No ${scope} "${id}"` };
          return { ok: true, message: "ok", data: target };
        }

        // ---- money ----
        case "grant": {
          const c = w.countries[String(body.id ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          const amount = Number(body.amount ?? 0);
          const where = String(body.where ?? "treasury");
          if (where === "treasury") c.economy.fiscal.treasury += amount;
          else if (where === "gdp") {
            c.economy.gdp += amount;
            c.economy.gdpPerCapita = c.economy.gdp / c.economy.population;
          } else if (where === "reserves") c.economy.reserves += amount;
          else if (where === "debt") c.economy.fiscal.debt += amount;
          else c.economy.fiscal.treasury += amount;
          pushEvent(w, { kind: "economic", severity: "major", country: c.id, title: `${actor.username} adjusted ${c.name}'s books`, body: `${where} ${amount >= 0 ? "+" : ""}${amount.toLocaleString()} credits.`, byUserId: actor.id, tags: ["dev", "money"] });
          return { ok: true, message: `${amount >= 0 ? "+" : ""}${amount.toLocaleString()} credits to ${c.name} (${where})` };
        }
        case "mint": {
          const c = w.countries[String(body.id ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          c.economy.fiscal.treasury += Math.abs(Number(body.amount ?? 0));
          c.economy.monetary.moneySupply = clamp(c.economy.monetary.moneySupply + 0.02, 0.05, 40);
          return { ok: true, message: `Minted ${Number(body.amount ?? 0).toLocaleString()} credits in ${c.name}` };
        }

        // ---- entity lifecycle ----
        case "delete-company": {
          const co = w.companies[String(body.id ?? "")];
          if (!co) return { ok: false, message: "No such company" };
          delete w.companies[co.id];
          for (const ex of w.markets.exchanges) ex.listings = ex.listings.filter((x) => x !== co.id);
          pushEvent(w, { kind: "corporate", severity: "major", country: co.country, title: `${co.name} dissolved`, body: `Removed by ${actor.username}. ${co.employees.toLocaleString()} jobs affected.`, byUserId: actor.id, tags: ["dev", "company"] });
          return { ok: true, message: `${co.name} dissolved` };
        }
        case "ban-company": {
          const co = w.companies[String(body.id ?? "")];
          if (!co) return { ok: false, message: "No such company" };
          co.banned = Boolean(body.banned ?? true);
          co.bannedReason = String(body.reason ?? "Banned by staff");
          if (co.banned) {
            co.listed = false;
            for (const ex of w.markets.exchanges) ex.listings = ex.listings.filter((x) => x !== co.id);
          }
          pushEvent(w, { kind: "corporate", severity: "major", country: co.country, title: `${co.name} ${co.banned ? "banned" : "reinstated"}`, body: co.bannedReason, byUserId: actor.id, tags: ["dev", "company"] });
          return { ok: true, message: co.banned ? `${co.name} banned` : `${co.name} reinstated` };
        }
        case "delete-character": {
          const ch = w.characters[String(body.id ?? "")];
          if (!ch) return { ok: false, message: "No such character" };
          ch.removedAt = w.t;
          const c = w.countries[ch.country];
          if (c) {
            if (c.executive.headOfStateId === ch.id) c.executive.headOfStateId = undefined;
            if (c.executive.headOfGovernmentId === ch.id) c.executive.headOfGovernmentId = undefined;
            if (c?.legislature) for (const list of Object.values(c.legislature.membership)) {
              const i = list.indexOf(ch.id);
              if (i >= 0) list.splice(i, 1);
            }
            for (const p of c.parties) if (p.leaderId === ch.id) p.leaderId = undefined;
          }
          pushEvent(w, { kind: "political", severity: "major", country: ch.country, title: `${ch.name} removed from office`, body: `Removed by ${actor.username}. ${body.reason ?? ""}`, byUserId: actor.id, tags: ["dev", "character"] });
          return { ok: true, message: `${ch.name} removed` };
        }
        case "ban-character": {
          const ch = w.characters[String(body.id ?? "")];
          if (!ch) return { ok: false, message: "No such character" };
          ch.banned = Boolean(body.banned ?? true);
          if (ch.banned) ch.removedAt = w.t;
          else ch.removedAt = undefined;
          return { ok: true, message: ch.banned ? `${ch.name} banned` : `${ch.name} unbanned` };
        }
        case "create-character": {
          const c = w.countries[String(body.country ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          const id = `ch-${c.id}-dev-${Math.round(w.t)}`;
          const ch: Character = {
            id,
            name: String(body.name ?? "New Figure"),
            country: c.id,
            role: (body.role as Character["role"]) ?? "minister",
            partyId: body.partyId ? String(body.partyId) : undefined,
            stats: {
              competence: Number(body.competence ?? 50),
              charisma: Number(body.charisma ?? 50),
              integrity: Number(body.integrity ?? 50),
              ambition: Number(body.ambition ?? 50),
              ideology: Number(body.ideology ?? c.ideology),
              popularity: Number(body.popularity ?? 50),
              experience: Number(body.experience ?? 50),
              militancy: Number(body.militancy ?? 0),
            },
            createdAt: w.t,
          };
          w.characters[id] = ch;
          if (body.asHeadOfGovernment) c.executive.headOfGovernmentId = id;
          if (body.asHeadOfState) c.executive.headOfStateId = id;
          if (body.asMinister) {
            const m = c.executive.ministers.find((x) => x.id === String(body.area ?? "economy"));
            if (m) m.characterId = id;
          }
          return { ok: true, message: `${ch.name} created`, data: { id } };
        }
        case "ban-party": {
          const p = w.parties[String(body.id ?? "")];
          if (!p) return { ok: false, message: "No such party" };
          p.banned = Boolean(body.banned ?? true);
          if (p.banned) {
            p.status = "outside";
            c_government(w, p.country, p.id, false);
          }
          return { ok: true, message: p.banned ? `${p.name} banned` : `${p.name} unbanned` };
        }
        case "remove-leader": {
          const c = w.countries[String(body.id ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          if (body.which === "head-of-state") c.executive.headOfStateId = undefined;
          else if (body.which === "head-of-government") c.executive.headOfGovernmentId = undefined;
          else {
            const m = c.executive.ministers.find((x) => x.id === String(body.area ?? ""));
            if (m) m.characterId = undefined;
          }
          return { ok: true, message: `${body.which ?? "leader"} removed` };
        }
        case "remove-country": {
          const c = w.countries[String(body.id ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          c.annexedBy = String(body.by ?? "INT");
          c.banned = Boolean(body.banned ?? true);
          c.dependencies = {};
          recomputeGlobals(w);
          pushEvent(w, { kind: "political", severity: "catastrophic", country: c.id, title: `${c.name} ceases to exist`, body: `Abolished by ${actor.username}. ${body.reason ?? ""}`, byUserId: actor.id, tags: ["dev", "country"] });
          return { ok: true, message: `${c.name} abolished` };
        }
        case "restore-country": {
          const c = w.countries[String(body.id ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          c.annexedBy = undefined;
          c.banned = false;
          recomputeGlobals(w);
          return { ok: true, message: `${c.name} restored` };
        }

        // ---- world events ----
        case "declare-war": {
          const war = declareWar(w, String(body.attacker ?? ""), String(body.defender ?? ""), String(body.cause ?? "Dev intervention"), actor.id);
          return war ? { ok: true, message: war.name } : { ok: false, message: "Could not declare war" };
        }
        case "end-war": {
          const war = w.wars[String(body.id ?? "")];
          if (!war) return { ok: false, message: "No such war" };
          war.endedAt = w.t;
          war.outcome = "white-peace";
          for (const b of Object.keys(war.belligerents)) {
            const c = w.countries[b];
            if (c) c.wars = c.wars.filter((x) => x !== war.id);
          }
          pushEvent(w, { kind: "military", severity: "major", title: `${war.name} ended by order`, body: `${actor.username} imposed a ceasefire.`, byUserId: actor.id, tags: ["dev", "war"] });
          return { ok: true, message: `${war.name} ended` };
        }
        case "annex": {
          annex(w, String(body.annexer ?? ""), String(body.target ?? ""), String(body.cause ?? "Dev intervention"), actor.id);
          return { ok: true, message: "Annexed" };
        }
        case "treaty": {
          const t = signTreaty(w, (body.kind as never) ?? "alliance", (body.parties as string[]) ?? [], (body.terms as string[]) ?? [], rng, Number(body.tradeBonus ?? 0), actor.id);
          return t ? { ok: true, message: t.name } : { ok: false, message: "Treaty could not be signed" };
        }
        case "sanction": {
          const s = imposeSanction(w, String(body.by ?? ""), String(body.on ?? ""), (body.kind as never) ?? "financial", rng, actor.id);
          return s ? { ok: true, message: "Sanctions imposed" } : { ok: false, message: "Could not impose sanctions" };
        }
        case "lift-sanction":
          liftSanction(w, String(body.id ?? ""), actor.id);
          return { ok: true, message: "Sanctions lifted" };
        case "force-election": {
          const c = w.countries[String(body.country ?? "")];
          if (!c?.legislature) return { ok: false, message: "No legislature" };
          const chamber = c.legislature.chambers.find((x) => x.id === body.chamberId) ?? c.legislature.chambers[0];
          if (!chamber || chamber.election === "none") return { ok: false, message: "This country does not hold elections" };
          for (const e of c.elections) if (e.status !== "complete") e.status = "complete";
          c.elections.push({
            id: `elec-${c.id}-forced-${Math.round(w.t)}`,
            country: c.id,
            chamberId: chamber.id,
            kind: chamber.election,
            scheduledAt: w.t,
            endsAt: w.t + 20 * 86400,
            status: "campaign",
            votes: {},
            turnout: {},
            districtCount: 60,
            districtPopulations: Array.from({ length: 60 }, () => 1 / 60),
            projection: {},
            enthusiasm: 70,
            districtNames: Array.from({ length: 60 }, (_, i) => `Extraordinary Constituency ${i + 1}`),
          });
          pushEvent(w, { kind: "political", severity: "major", country: c.id, title: `${c.name} calls an extraordinary election`, body: `Called by ${actor.username}.`, byUserId: actor.id, tags: ["dev", "election"] });
          return { ok: true, message: "Election forced" };
        }
        case "raise-referendum": {
          const c = w.countries[String(body.country ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          c.referendums.push({
            id: `ref-${c.id}-dev-${Math.round(w.t)}`,
            country: c.id,
            question: String(body.question ?? "Shall the current government continue?"),
            calledBy: actor.id,
            at: w.t,
            closesAt: w.t + 30 * 86400,
            options: [{ id: "yes", label: "Yes", yes: 0 }, { id: "no", label: "No", yes: 0 }],
            status: "open",
            turnout: 0.6,
          });
          return { ok: true, message: "Referendum called" };
        }
        case "form-party": {
          const c = w.countries[String(body.country ?? "")];
          if (!c) return { ok: false, message: "No such country" };
          const id = `${c.id}-party-dev-${Math.round(w.t)}`;
          const p: Party = {
            id,
            country: c.id,
            name: String(body.name ?? "New Movement"),
            abbreviation: String(body.abbreviation ?? "NM"),
            ideology: Number(body.ideology ?? 0),
            cohesion: 70,
            popularity: Number(body.popularity ?? 12),
            color: String(body.color ?? "#8e44ad"),
            seats: {},
            treasury: 1e8,
            memberCount: 1000,
            status: "outside",
            platform: Object.fromEntries(["economy", "tax", "welfare", "health", "education", "environment", "defence", "immigration", "foreign-policy", "justice", "technology", "housing", "energy", "transport", "agriculture", "labour"].map((k) => [k, Number(body.ideology ?? 0)])) as never,
            founded: w.t,
          };
          c.parties.push(p);
          w.parties[id] = p;
          pushEvent(w, { kind: "political", severity: "major", country: c.id, title: `${p.name} founded in ${c.name}`, body: `A new party with ${p.ideology < 0 ? "left" : "right"} leanings. Created by ${actor.username}.`, byUserId: actor.id, tags: ["dev", "party"] });
          return { ok: true, message: `${p.name} founded`, data: { id } };
        }
        case "delete-party": {
          const p = w.parties[String(body.id ?? "")];
          if (!p) return { ok: false, message: "No such party" };
          const c = w.countries[p.country];
          if (c) c.parties = c.parties.filter((x) => x.id !== p.id);
          delete w.parties[p.id];
          return { ok: true, message: `${p.name} dissolved` };
        }

        // ---- directives and rules ----
        case "add-directive": {
          const d = addDirective(w, body.directive as Omit<WorldDirective, "id" | "createdAt">);
          return { ok: true, message: "Directive added", data: d };
        }
        case "remove-directive": {
          const before = w.directives.length;
          w.directives = w.directives.filter((d) => d.id !== String(body.id ?? ""));
          return { ok: true, message: before === w.directives.length ? "No such directive" : "Directive removed" };
        }
        case "toggle-directive": {
          const d = w.directives.find((x) => x.id === String(body.id ?? ""));
          if (!d) return { ok: false, message: "No such directive" };
          d.enabled = Boolean(body.enabled);
          return { ok: true, message: `Directive ${d.enabled ? "enabled" : "disabled"}` };
        }
        case "add-rule": {
          const r = addRule(w, body.rule as never);
          pushEvent(w, { kind: "system", severity: "notice", title: `Rule installed: ${r.name}`, body: `Authored by ${actor.username}.`, byUserId: actor.id, tags: ["dev", "rule"] });
          return { ok: true, message: `Rule "${r.name}" installed`, data: r };
        }
        case "remove-rule": {
          const before = w.directives.length;
          w.directives = w.directives.filter((d) => !(d.kind === "custom-rule" && d.rule.id === String(body.id ?? "")));
          return { ok: true, message: before === w.directives.length ? "No such rule" : "Rule removed" };
        }
        case "toggle-rule": {
          const d = w.directives.find((x): x is Extract<WorldDirective, { kind: "custom-rule" }> => x.kind === "custom-rule" && x.rule.id === String(body.id ?? ""));
          if (!d) return { ok: false, message: "No such rule" };
          d.rule.enabled = Boolean(body.enabled);
          d.enabled = d.rule.enabled;
          return { ok: true, message: `Rule ${d.rule.enabled ? "enabled" : "disabled"}` };
        }
        case "console": {
          const out = executeCustomScript(w, String(body.code ?? ""));
          pushEvent(w, { kind: "system", severity: "info", title: "Console command", body: String(body.code ?? ""), byUserId: actor.id, tags: ["dev", "console"] });
          return { ok: true, message: out ?? "No output", data: { result: out } };
        }

        // ---- scenario editing ----
        case "patch-scenario": {
          const path = String(body.path ?? "");
          const patch = body.patch as Record<string, unknown> | undefined;
          if (!path || !patch) return { ok: false, message: "Need a path and a patch object" };
          const before = getNum(w.scenarioOverrides as unknown, path);
          deepAssign(w.scenarioOverrides as unknown, path, patch);
          pushEvent(w, { kind: "system", severity: "major", title: `Scenario data edited`, body: `${path} patched by ${actor.username}.`, byUserId: actor.id, tags: ["dev", "scenario"] });
          return { ok: true, message: `Patched ${path}`, data: { before } };
        }
        case "reset-world": {
          const scenario = getScenario(w.scenarioId);
          const fresh = buildWorld(scenario, w.name, w.id, Date.now(), w.playerCountry);
          fresh.paused = w.paused;
          recomputeGlobals(fresh);
          pushEvent(fresh, { kind: "system", severity: "major", title: "World reset", body: `Rebuilt from the ${scenario.name} scenario by ${actor.username}.`, byUserId: actor.id, tags: ["dev", "reset"] });
          return { ok: true, message: "World rebuilt from scenario", replaced: fresh };
        }

        // ---- global data ----
        case "set-market": {
          const path = String(body.path ?? "");
          const before = getNum(w.markets, path);
          if (!setNum(w.markets, path, Number(body.value))) return { ok: false, message: "Write refused" };
          return { ok: true, message: `${path}: ${before} -> ${body.value}` };
        }
        default:
          return { ok: false, message: `Unknown op "${body.op}"` };
      }
}

function c_government(w: World, country: string, partyId: string, member: boolean): void {
  const c = w.countries[country];
  if (!c) return;
  if (member) {
    if (!c.executive.coalition.includes(partyId)) c.executive.coalition.push(partyId);
  } else {
    c.executive.coalition = c.executive.coalition.filter((x) => x !== partyId);
  }
}

function deepAssign(target: unknown, path: string, value: unknown): void {
  const parts = path.split(".");
  let cur = target as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== "object" || cur[parts[i]] === null) cur[parts[i]] = {};
    cur = cur[parts[i]] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}
