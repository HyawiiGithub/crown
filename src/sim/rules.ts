import type { CustomRule, PolicyArea, RuleAction, RuleCondition, World, WorldDirective } from "../shared/types";
import { annex, declareWar, imposeSanction } from "./step-world";
import { buildCountry, pushEvent, slug } from "./bootstrap";
import { addNum, getNum, setNum } from "./paths";
import { Rng, clamp } from "./rng";

/**
 * Declarative custom rules and live directives.
 *
 * These are the two mechanisms the Developer Menu exposes that let you change how
 * a world behaves without changing code:
 *
 *   - a **directive** pins a value every tick ("USA GDP is 50e12, forever")
 *   - a **rule** is a trigger plus a set of conditions plus a list of actions,
 *     authored in the UI and stored on the world
 *
 * Both run AFTER the simulation step, so whatever they set survives to be
 * observed by clients on the same tick. That ordering is deliberate: a dev
 * pinning a value should never have it silently overwritten by the next macro
 * pass.
 */

// ===========================================================================
// Directives
// ===========================================================================

export function applyDirectives(world: World, dt: number): void {
  for (const d of world.directives) {
    if (!d.enabled) continue;
    switch (d.kind) {
      case "set-stat": {
        const target = resolveTarget(world, d.target, d.targetId);
        if (!target) continue;
        const cur = getNum(target.obj, d.path);
        if (!Number.isFinite(cur)) continue;
        if (d.blend >= 1) setNum(target.obj, d.path, d.value);
        else setNum(target.obj, d.path, cur + (d.value - cur) * clamp(d.blend * (dt / 86400) * 24, 0, 1));
        break;
      }
      case "freeze": {
        const target = resolveTarget(world, d.target, d.targetId);
        if (!target) continue;
        // Freezing means: reject any change the sim tried to make this tick.
        // We re-apply the last known value, captured at directive creation.
        const cur = getNum(target.obj, d.path);
        if (Number.isFinite(cur) && d.frozenValue !== undefined) setNum(target.obj, d.path, d.frozenValue);
        break;
      }
      case "trigger": {
        if (shouldTrigger(world, d.when)) {
          if (!d.lastFiredAt || world.t - d.lastFiredAt > 600) {
            executeCustomScript(world, d.then);
            d.lastFiredAt = world.t;
          }
        }
        break;
      }
      case "custom-rule": {
        evaluateRule(world, d.rule, dt);
        break;
      }
    }
  }
}

function resolveTarget(world: World, scope: string, id: string): { obj: unknown } | null {
  switch (scope) {
    case "country": {
      const c = world.countries[id] ?? world.customCountries[id];
      return c ? { obj: c } : null;
    }
    case "company":
      return world.companies[id] ? { obj: world.companies[id] } : null;
    case "market":
      return { obj: world.markets };
    case "global":
      return { obj: world };
    default:
      return null;
  }
}

// ===========================================================================
// Custom rules
// ===========================================================================

export function evaluateRule(world: World, rule: CustomRule, dt: number): void {
  if (!rule.enabled) return;
  if (rule.maxFires >= 0 && rule.fired >= rule.maxFires) return;
  if (rule.lastFiredAt && world.t - rule.lastFiredAt < rule.cooldownMs / 1000) return;

  const now = world.t;
  const t = rule.trigger;
  let due = true;
  switch (t.type) {
    case "always":
      due = true;
      break;
    case "interval":
      due = !rule.lastFiredAt || now - rule.lastFiredAt >= (t.intervalSeconds ?? 3600);
      break;
    case "random":
      due = Math.random() < (t.probability ?? 0.1);
      break;
    case "threshold":
      due = t.conditions.every((c) => evaluateCondition(world, c));
      break;
    case "on-event":
      due = t.conditions.every((c) => evaluateCondition(world, c));
      break;
  }
  if (!due) return;

  const messages: string[] = [];
  for (const action of rule.actions) {
    const msg = executeAction(world, action);
    if (msg) messages.push(msg);
  }
  rule.fired++;
  rule.lastFiredAt = now;
  const message = messages.join("; ") || "no visible effect";
  rule.log.unshift({ t: now, message });
  if (rule.log.length > 50) rule.log.length = 50;
  pushEvent(world, {
    kind: "system",
    severity: "info",
    title: `Rule fired: ${rule.name}`,
    body: message,
    tags: ["rule", rule.id],
  });
  void dt;
}

function evaluateCondition(world: World, c: RuleCondition): boolean {
  const targets: { obj: unknown; id: string }[] = [];
  if (c.scope === "country" && c.target) {
    const co = world.countries[c.target] ?? world.customCountries[c.target];
    if (co) targets.push({ obj: co, id: co.id });
  } else if (c.scope === "any-country") {
    for (const co of Object.values(world.countries)) targets.push({ obj: co, id: co.id });
  } else if (c.scope === "company" && c.target) {
    const co = world.companies[c.target];
    if (co) targets.push({ obj: co, id: co.id });
  } else if (c.scope === "global") {
    targets.push({ obj: world, id: "world" });
  } else if (c.scope === "war") {
    if (c.target && world.wars[c.target]) targets.push({ obj: world.wars[c.target], id: c.target });
  }
  if (!targets.length) return false;

  switch (c.aggregate) {
    case "all":
      return targets.every((t) => testOne(t.obj, c));
    case "count":
      return targets.filter((t) => testOne(t.obj, c)).length >= Number(c.value);
    case "avg": {
      const vals = targets.map((t) => getNum(t.obj, c.path)).filter(Number.isFinite);
      if (!vals.length) return false;
      return compare(vals.reduce((a, b) => a + b, 0) / vals.length, c);
    }
    case "any":
    default:
      return targets.some((t) => testOne(t.obj, c));
  }
}

function testOne(obj: unknown, c: RuleCondition): boolean {
  if (c.op === "exists") return Number.isFinite(getNum(obj, c.path)) || getNum(obj, c.path) === 0;
  const v = getNum(obj, c.path);
  if (!Number.isFinite(v)) return false;
  return compare(v, c);
}

function compare(v: number, c: RuleCondition): boolean {
  switch (c.op) {
    case "<": return v < Number(c.value);
    case "<=": return v <= Number(c.value);
    case ">": return v > Number(c.value);
    case ">=": return v >= Number(c.value);
    case "==": return v === Number(c.value);
    case "!=": return v !== Number(c.value);
    case "between":
      return Array.isArray(c.value) && v >= c.value[0] && v <= c.value[1];
    case "contains":
      return String(getNum({}, "")).includes(String(c.value));
    default: return false;
  }
}

function executeAction(world: World, a: RuleAction): string | null {
  switch (a.type) {
    case "set": {
      const t = resolveTarget(world, a.scope, a.target ?? "");
      return t ? (setNum(t.obj, a.path, a.value) ? `set ${a.path} = ${a.value}` : `path ${a.path} not found`) : `no target ${a.target}`;
    }
    case "multiply": {
      const t = resolveTarget(world, a.scope, a.target ?? "");
      const cur = t ? getNum(t.obj, a.path) : NaN;
      if (!t || !Number.isFinite(cur)) return `path ${a.path} not found`;
      addNum(t.obj, a.path, cur * (a.value - 1));
      return `multiplied ${a.path} by ${a.value}`;
    }
    case "spawn-war": {
      const w = declareWar(world, a.attacker, a.defender, a.name ?? "Rule-triggered conflict", "rules");
      return w ? `declared ${w.name}` : "war could not be declared";
    }
    case "end-war": {
      const w = world.wars[a.warId];
      if (!w) return `no war ${a.warId}`;
      w.endedAt = world.t;
      w.outcome = "white-peace";
      for (const b of Object.keys(w.belligerents)) {
        const c = world.countries[b];
        if (c) c.wars = c.wars.filter((x) => x !== a.warId);
      }
      return `ended ${w.name}`;
    }
    case "annex":
      annex(world, a.annexer, a.target, "Rule-triggered annexation", "rules");
      return `annexed ${a.target} into ${a.annexer}`;
    case "grant-money": {
      const c = world.countries[a.target];
      if (!c) return `no country ${a.target}`;
      c.economy.fiscal.treasury += a.amount;
      return `granted ${(a.amount / 1e9).toFixed(1)}bn to ${c.name}`;
    }
    case "ban-entity": {
      if (a.entityType === "company") {
        const co = world.companies[a.entityId];
        if (co) { co.banned = true; co.bannedReason = a.reason; co.listed = false; }
      } else if (a.entityType === "character") {
        const ch = world.characters[a.entityId];
        if (ch) { ch.banned = true; ch.removedAt = world.t; }
      } else if (a.entityType === "party") {
        const p = world.parties[a.entityId];
        if (p) p.banned = true;
      } else {
        const c = world.countries[a.entityId];
        if (c) c.banned = true;
      }
      return `banned ${a.entityType} ${a.entityId}: ${a.reason}`;
    }
    case "unban-entity": {
      if (a.entityType === "company") {
        const co = world.companies[a.entityId];
        if (co) { co.banned = false; co.bannedReason = undefined; }
      } else if (a.entityType === "character") {
        const ch = world.characters[a.entityId];
        if (ch) { ch.banned = false; ch.removedAt = undefined; }
      } else if (a.entityType === "party") {
        const p = world.parties[a.entityId];
        if (p) p.banned = false;
      } else {
        const c = world.countries[a.entityId];
        if (c) c.banned = false;
      }
      return `unbanned ${a.entityId}`;
    }
    case "kill-character": {
      const ch = world.characters[a.characterId];
      if (!ch) return `no character ${a.characterId}`;
      ch.removedAt = world.t;
      const c = world.countries[ch.country];
      if (c) {
        pushEvent(world, { kind: "political", severity: "major", country: ch.country, title: `${ch.name} has died`, body: a.cause, tags: ["death"] });
        // If it was the head of government, the government falls.
        if (c.executive.headOfGovernmentId === ch.id || c.executive.headOfStateId === ch.id) {
          c.executive.approval = clamp(c.executive.approval - 25, 0, 100);
          c.executive.confidence = clamp(c.executive.confidence - 30, 0, 100);
          if (world.characters[ch.id].country && c.legislature) {
            void world;
          }
        }
      }
      return `${ch.name} died (${a.cause})`;
    }
    case "fire-minister": {
      const c = world.countries[a.country];
      if (!c) return `no country ${a.country}`;
      const m = c.executive.ministers.find((x) => x.id === a.area);
      if (!m) return `${c.name} has no ${a.area} ministry`;
      m.characterId = undefined;
      m.partyId = undefined;
      c.executive.approval = clamp(c.executive.approval - 6, 0, 100);
      return `fired the ${a.area} minister of ${c.name}`;
    }
    case "force-election": {
      const c = world.countries[a.country];
      if (!c?.legislature) return `${a.country} has no legislature`;
      const chamber = c.legislature.chambers.find((x) => x.id === a.chamberId) ?? c.legislature.chambers[0];
      if (!chamber || chamber.election === "none") return `${c.name} has no elections`;
      c.elections.forEach((e) => { if (e.status !== "complete") e.status = "complete"; });
      const districtCount = 60;
      c.elections.push({
        id: `elec-${c.id}-forced-${Math.round(world.t)}`,
        country: c.id,
        chamberId: chamber.id,
        kind: chamber.election,
        scheduledAt: world.t,
        endsAt: world.t + 20 * 86400,
        status: "campaign",
        votes: {},
        turnout: {},
        districtCount,
        districtPopulations: Array.from({ length: districtCount }, () => 1 / districtCount),
        projection: {},
        enthusiasm: 70,
        districtNames: Array.from({ length: districtCount }, (_, i) => `Extraordinary Constituency ${i + 1}`),
      });
      return `forced an election in ${c.name}`;
    }
    case "raise-referendum": {
      const c = world.countries[a.country];
      if (!c) return `no country ${a.country}`;
      c.referendums.push({
        id: `ref-${c.id}-${Math.round(world.t)}`,
        country: c.id,
        question: a.question,
        calledBy: c.executive.headOfGovernmentId ?? "",
        at: world.t,
        closesAt: world.t + 45 * 86400,
        options: [
          { id: "yes", label: "Yes", yes: 0 },
          { id: "no", label: "No", yes: 0 },
        ],
        status: "open",
        turnout: 0.6,
      });
      return `called a referendum in ${c.name}: ${a.question}`;
    }
    case "impose-sanction": {
      const s = imposeSanction(world, a.by, a.on, a.kind, new Rng(world.seed ^ Math.round(world.t)), "rules");
      return s ? `sanctions imposed on ${a.on}` : "sanctions failed";
    }
    case "log":
      return a.message;
    case "custom-script": {
      const out = executeCustomScript(world, a.expression);
      return out ?? null;
    }
    default:
      return null;
  }
}

/**
 * The small expression language behind "custom-script" rule actions.
 *
 * Deliberately not a JS eval. It parses a flat sequence of assignments and
 * expressions over `world` and the sim's own paths, so a rule a developer
 * writes in a text box can never take the Durable Object down.
 *
 * Grammar:
 *   statement := assignment | call
 *   assignment := path ('=' | '+=' | '-=' | '*=') number
 *   call := name '(' arg (',' arg)* ')'
 *
 * Examples:
 *   economy.gdp *= 2
 *   gdp(USA) = 5e13
 *   unrest(IND) += 10
 *   war(IND,PAK)
 *   grant(USA, 1e12)
 */
export function executeCustomScript(world: World, src: string): string | null {
  const out: string[] = [];
  for (const rawLine of src.split(/[\n;]+/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith("//")) continue;
    const result = runLine(world, line);
    if (result) out.push(result);
  }
  return out.length ? out.join("; ") : null;
}

function runLine(world: World, line: string): string | null {
  const assign = line.match(/^([A-Za-z0-9_.\-[\]]+)\s*(\+=|-=|\*=|\/=|=)\s*(.+)$/);
  if (assign) {
    const [, path, op, rhsRaw] = assign;
    const rhs = Number(rhsRaw.trim());
    if (!Number.isFinite(rhs)) return `bad value in "${line}"`;
    const scope = resolveScope(world, path);
    if (!scope) return `no target for "${path}"`;
    const cur = Number.isFinite(getNum(scope.obj, scope.path)) ? getNum(scope.obj, scope.path) : 0;
    let next = cur;
    if (op === "=") next = rhs;
    else if (op === "+=") next = cur + rhs;
    else if (op === "-=") next = cur - rhs;
    else if (op === "*=") next = cur * rhs;
    else if (op === "/=") next = rhs === 0 ? cur : cur / rhs;
    if (!setNum(scope.obj, scope.path, next)) return `cannot set ${path}`;
    return `${path} -> ${next}`;
  }

  const call = line.match(/^([a-zA-Z]+)\((.*)\)$/);
  if (call) {
    const [, fn, argStr] = call;
    const args = argStr.split(",").map((s) => s.trim().replace(/^["']|["']$/g, ""));
    switch (fn) {
      case "gdp": {
        const c = world.countries[args[0]];
        if (!c) return null;
        return setNum(c, "economy.gdp", Number(args[1])) ? `${c.name} GDP set to ${args[1]}` : null;
      }
      case "unrest": {
        const c = world.countries[args[0]];
        if (!c) return null;
        c.unrestRisk = clamp(c.unrestRisk + Number(args[1] ?? 0.1), 0, 1);
        return `${c.name} unrest ${c.unrestRisk.toFixed(2)}`;
      }
      case "approval": {
        const c = world.countries[args[0]];
        if (!c) return null;
        c.executive.approval = clamp(c.executive.approval + Number(args[1] ?? 0), 0, 100);
        return `${c.name} approval ${c.executive.approval.toFixed(0)}`;
      }
      case "war":
        return declareWar(world, args[0], args[1], "Console order", "console") ? `war declared ${args[0]} vs ${args[1]}` : null;
      case "annex":
        annex(world, args[0], args[1], "Console order", "console");
        return `annexed ${args[1]} -> ${args[0]}`;
      case "grant": {
        const c = world.countries[args[0]];
        if (!c) return null;
        c.economy.fiscal.treasury += Number(args[1] ?? 0);
        return `granted ${args[1]} to ${c.name}`;
      }
      case "create-country": {
        const id = args[0];
        if (!id) return null;
        if (!world.customCountries[id]) {
          const c = buildCountry(id.toUpperCase().slice(0, 3), [id, id.toUpperCase().slice(0, 3), "XX", args[1] ?? id, args[1] ?? id, "Europe", "europe", "parliamentary-republic", 10, 20000, -10, "none"], new Rng(world.seed ^ id.length), { scen: { params: world.params } as never }, []);
          world.customCountries[id] = c;
          world.countries[id] = c;
          for (const p of c.parties) world.parties[p.id] = p;
        }
        return `created ${id}`;
      }
      case "remove-country": {
        const c = world.countries[args[0]];
        if (!c) return null;
        c.annexedBy = args[1] ?? c.overlord ?? "INT";
        c.dependencies = {};
        return `${args[0]} abolished`;
      }
      default:
        return null;
    }
  }
  return null;
}

/** `country(USA).economy.gdp` and bare `economy.gdp` both resolve. */
function resolveScope(world: World, path: string): { obj: unknown; path: string } | null {
  const m = path.match(/^(?:country|company|global)\(([A-Za-z0-9_]+)\)\.(.+)$/);
  if (m) {
    const [, id, rest] = m;
    if (id === "global") return { obj: world, path: rest };
    const c = world.countries[id] ?? world.customCountries[id];
    if (c) return { obj: c, path: rest };
    const co = world.companies[id];
    if (co) return { obj: co, path: rest };
    return null;
  }
  return { obj: world, path };
}

function shouldTrigger(world: World, when: string): boolean {
  const s = when.trim();
  if (!s) return false;
  const m = s.match(/^([a-zA-Z0-9_]+)\s*(>=|<=|>|<|==)\s*(.+)$/);
  if (!m) return false;
  const [, id, op, rhs] = m;
  const v = Number(rhs);
  if (!Number.isFinite(v)) return false;
  const c = world.countries[id] ?? world.customCountries[id];
  const cur = c ? getNum(c, "economy.gdp") : id === "warCount" ? Object.keys(world.wars).length : getNum(world.globals, "worldConflictIndex");
  switch (op) {
    case ">": return cur > v;
    case "<": return cur < v;
    case ">=": return cur >= v;
    case "<=": return cur <= v;
    case "==": return cur === v;
    default: return false;
  }
}

export { slug, getNum, setNum, addNum };
export type { WorldDirective, PolicyArea };