import type { BudgetPlan, Character, Company, Country, PolicyArea, PolicyPatch, SectorId, TaxPolicy, Treaty, World } from "../shared/types";
import { pushEvent, rulesByDecree } from "./bootstrap";
import { SimEngine, setSpeed } from "./engine";
import { stabilisationPlan } from "./step-economy";
import { clamp, clamp01, type Rng } from "./rng";
import { applyPolicy, introduceBill, needsLegislature } from "./step-politics";
import { answerCrisis } from "./collapse";
import { foundCompany } from "./firms";
import { techOf } from "./tech";
import { SECTORS } from "../data/economy";
import { annex, createPuppetState, declareWar, imposeSanction, liftSanction, signTreaty, transferLand, vassalise } from "./step-world";
import { frontOccupation, peaceAccepted, peaceCost, peaceStanding, type PeaceTerms } from "./occupation";

/**
 * Everything the player can do. The sim is the single authority: the UI only
 * sends these commands, and every refusal explains itself.
 *
 * In a democracy, law goes through parliament as a bill and can be voted down.
 * Autocrats and colonial governors just decree it. Levers the executive really
 * holds (trade measures, war, diplomacy, central bank orders) apply at once.
 */

export interface CommandResult {
  ok: boolean;
  message: string;
  data?: unknown;
}

const TAX_LIMITS: Record<keyof TaxPolicy, number> = { income: 0.8, corporate: 0.7, vat: 0.35, payroll: 0.4, tariff: 1, royalty: 0.9 };
const BUDGET_KEYS: (keyof BudgetPlan)[] = ["defence", "welfare", "health", "education", "infrastructure", "science", "administration", "subsidies"];

function describePolicy(c: Country, p: PolicyPatch): { title: string; summary: string; opinion: number } {
  const parts: string[] = [];
  let opinion = 50;
  if (p.tax) {
    for (const [k, v] of Object.entries(p.tax)) {
      const cur = c.economy.tax[k as keyof TaxPolicy];
      const nv = v as number;
      parts.push(`${k} tax ${(cur * 100).toFixed(1)}% to ${(nv * 100).toFixed(1)}%`);
      opinion -= (nv - cur) * 160;
    }
  }
  if (p.budget) {
    for (const [k, v] of Object.entries(p.budget)) {
      const cur = c.economy.budget[k as keyof BudgetPlan];
      const nv = v as number;
      parts.push(`${k} ${(cur * 100).toFixed(1)}% to ${(nv * 100).toFixed(1)}% of GDP`);
      if (k === "welfare" || k === "health" || k === "education") opinion += (nv - cur) * 220;
    }
  }
  if (p.minimumWage !== undefined) {
    parts.push(`minimum wage to ${(p.minimumWage * 100).toFixed(0)}% of the median`);
    opinion += (p.minimumWage - c.economy.macro.minimumWage) * 30;
  }
  if (p.sector) {
    const bits = [p.sector.subsidy !== undefined ? `subsidy ${(p.sector.subsidy * 100).toFixed(0)}%` : "", p.sector.regulation !== undefined ? `regulation ${(p.sector.regulation * 100).toFixed(0)}` : "", p.sector.stateOwnership !== undefined ? `state share ${(p.sector.stateOwnership * 100).toFixed(0)}%` : ""].filter(Boolean);
    parts.push(`${p.sector.id}: ${bits.join(", ")}`);
  }
  if (p.centralBankIndependent !== undefined) parts.push(p.centralBankIndependent ? "central bank independence" : "government control of the central bank");
  const title = p.tax && p.budget ? "Budget and Finance Bill" : p.tax ? "Finance Bill" : p.budget ? "Appropriations Bill" : p.minimumWage !== undefined ? "Minimum Wage Bill" : p.sector ? `${capitalise(p.sector.id)} Sector Bill` : "Central Bank Bill";
  return { title, summary: parts.join("; "), opinion: clamp(opinion, 5, 95) };
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function enact(world: World, c: Country, patch: PolicyPatch): CommandResult {
  const d = describePolicy(c, patch);
  if (!d.summary) return { ok: false, message: "Nothing has changed." };
  if (needsLegislature(c)) {
    const chamber = c.legislature!.chambers[0];
    const hogParty = c.executive.coalition[0] ?? c.parties[0]?.id ?? "";
    const pending = Object.values(world.bills).filter((b) => b.country === c.id && (b.status === "introduced" || b.status === "in-committee")).length;
    if (pending >= 6) return { ok: false, message: "Parliament already has six government bills to get through." };
    const bill = introduceBill(world, c.id, {
      title: d.title, summary: d.summary, body: "", category: patch.tax || patch.budget ? "money" : "ordinary",
      sponsorId: c.executive.headOfGovernmentId ?? "", sponsorPartyId: hogParty, chamberId: chamber.id, passageChambers: [chamber.id],
      effects: {}, cost: 0, whipStrength: world.params.whipStrength, publicOpinion: d.opinion, policy: patch,
    });
    return bill ? { ok: true, message: `${d.title} sent to the ${chamber.name}. The vote is in three weeks.` } : { ok: false, message: "The bill could not be introduced." };
  }
  applyPolicy(c, patch);
  c.executive.approval = clamp(c.executive.approval + (d.opinion - 50) * 0.04, 0, 100);
  pushEvent(world, { kind: "legal", severity: "notice", country: c.id, title: `${c.name}: ${d.title.replace("Bill", "Decree")}`, body: d.summary, tags: ["decree"] });
  return { ok: true, message: `Decreed: ${d.summary}` };
}

export function runCommand(world: World, engine: SimEngine, rng: Rng, body: Record<string, unknown>): CommandResult {
  const type = String(body.type ?? "");
  if (type === "set-speed") {
    const out = setSpeed(world, Number(body.speed ?? world.speed), body.paused === undefined ? undefined : Boolean(body.paused));
    world.events.pop();
    world.ticker.shift();
    return out;
  }
  if (type === "advance") {
    engine.advanceDays(clamp(Math.round(Number(body.days ?? 30)), 1, 3650));
    return { ok: true, message: `Advanced ${body.days} days.` };
  }
  if (type === "choose-country") {
    const c = world.countries[String(body.country ?? "")];
    if (!c || c.annexedBy) return { ok: false, message: "That state does not exist." };
    world.playerCountry = c.id;
    return { ok: true, message: `You now govern ${c.name}.` };
  }

  const c = world.playerCountry ? world.countries[world.playerCountry] : undefined;
  if (!c) return { ok: false, message: "Choose a country to govern first." };
  if (c.annexedBy) return { ok: false, message: `${c.name} no longer exists.` };
  const e = c.economy;

  switch (type) {
    case "apply-policy": {
      const patch: PolicyPatch = {};
      if (body.tax) {
        patch.tax = {};
        for (const [k, v] of Object.entries(body.tax as Record<string, number>)) {
          const key = k as keyof TaxPolicy;
          if (TAX_LIMITS[key] === undefined) continue;
          patch.tax[key] = clamp(Number(v), 0, TAX_LIMITS[key]);
        }
      }
      if (body.budget) {
        patch.budget = {};
        for (const [k, v] of Object.entries(body.budget as Record<string, number>)) {
          const key = k as keyof BudgetPlan;
          if (!BUDGET_KEYS.includes(key)) continue;
          patch.budget[key] = clamp(Number(v), 0, 0.5);
        }
      }
      if (body.minimumWage !== undefined) patch.minimumWage = clamp(Number(body.minimumWage), 0, 1);
      return enact(world, c, patch);
    }
    case "set-sector":
      return enact(world, c, { sector: { id: String(body.id) as SectorId, subsidy: num(body.subsidy), regulation: num(body.regulation), stateOwnership: num(body.stateOwnership) } });
    case "set-rate": {
      if (e.centralBank.independent) return { ok: false, message: "The central bank is independent. It sets rates itself." };
      if (e.centralBank.regime === "union") return { ok: false, message: "Rates are set by the currency union." };
      e.monetary.centralBankRate = clamp(Number(body.value), -0.01, 5);
      return { ok: true, message: `Policy rate target set to ${(e.monetary.centralBankRate * 100).toFixed(2)}%.` };
    }
    case "set-independence":
      return enact(world, c, { centralBankIndependent: Boolean(body.value) });
    case "set-printing": {
      if (e.centralBank.regime === "union") return { ok: false, message: "A currency union member cannot print money." };
      if (e.centralBank.independent) return { ok: false, message: "An independent central bank refuses to finance the deficit." };
      e.centralBank.printing = clamp01(Number(body.value));
      return { ok: true, message: e.centralBank.printing > 0 ? `${(e.centralBank.printing * 100).toFixed(0)}% of the deficit will be financed by printing money.` : "The printing presses stop." };
    }
    case "set-target": {
      e.centralBank.target = clamp(Number(body.value), 0, 0.2);
      return { ok: true, message: `Inflation target is now ${(e.centralBank.target * 100).toFixed(1)}%.` };
    }
    case "set-qe": {
      if (e.centralBank.regime === "union") return { ok: false, message: "Asset purchases are run by the currency union." };
      e.centralBank.qe = clamp(Number(body.value), 0, 1);
      return { ok: true, message: `Central bank holdings set to ${(e.centralBank.qe * 100).toFixed(0)}% of GDP.` };
    }
    case "set-research": {
      const focus = String(body.focus ?? "");
      if (focus !== "army" && focus !== "logistics" && focus !== "industry" && focus !== "navy") return { ok: false, message: "Unknown field." };
      techOf(c).focus = focus;
      return { ok: true, message: `Research redirected to ${focus}.` };
    }
    case "sponsor-firm": {
      const sector = String(body.sector ?? "") as SectorId;
      if (!SECTORS[sector]) return { ok: false, message: "That is not an industry." };
      const cost = Math.max(1e6, e.gdp * 0.02);
      if (e.reserves >= cost) e.reserves -= cost;
      else e.fiscal.debt += cost;
      const co = foundCompany(world, c.id, sector, rng, { stateShare: 0.51, revenue: cost * 1.5 });
      if (!co) return { ok: false, message: "The firm could not be registered." };
      c.executive.approval = clamp(c.executive.approval - 2, 0, 100);
      pushEvent(world, { kind: "economic", severity: "notice", country: c.id, title: `${c.name} sponsors ${co.name}`, body: `The treasury puts ${(cost / 1e9).toFixed(2)}B into a new ${SECTORS[sector].label.toLowerCase()} firm and takes 51%.`, tags: ["firms", "sponsorship"] });
      return { ok: true, message: `${co.name} founded; the state holds 51%.` };
    }
    case "crisis-response": {
      const said = answerCrisis(world, c, String(body.measure ?? ""));
      return said.ok ? { ok: true, message: said.message } : { ok: false, message: said.message };
    }
    case "set-regime": {
      const regime = String(body.value);
      if (regime !== "float" && regime !== "peg" && regime !== "gold") return { ok: false, message: "Unknown monetary regime." };
      if (e.centralBank.regime === "union") return { ok: false, message: "You would have to leave the currency union first." };
      e.centralBank.regime = regime;
      if (regime === "gold") e.centralBank.target = 0;
      pushEvent(world, { kind: "economic", severity: "major", country: c.id, title: `${c.name} moves to ${regime === "float" ? "a floating currency" : regime === "gold" ? "the gold standard" : "a currency peg"}`, body: "The monetary regime has changed.", tags: ["monetary"] });
      return { ok: true, message: "Monetary regime changed." };
    }
    case "stabilisation-plan": {
      if (e.monetary.inflation < 0.15) return { ok: false, message: "Inflation is not high enough to need this." };
      stabilisationPlan(world, c);
      c.executive.approval = clamp(c.executive.approval - 3, 0, 100);
      return { ok: true, message: "Stabilisation plan announced. Expect a short recession." };
    }
    case "trade-barrier": {
      const p = world.countries[String(body.partner)];
      if (!p) return { ok: false, message: "No such partner." };
      const value = clamp01(Number(body.value));
      c.tradeBarriers ??= {};
      if (value <= 0) delete c.tradeBarriers[p.id];
      else c.tradeBarriers[p.id] = value;
      c.relations[p.id] = clamp((c.relations[p.id] ?? 0) - value * 25, -100, 100);
      p.relations[c.id] = clamp((p.relations[c.id] ?? 0) - value * 30, -100, 100);
      p.tradeBarriers ??= {};
      if (value >= 0.2 && p.id !== world.playerCountry && (p.relations[c.id] ?? 0) < 10) p.tradeBarriers[c.id] = value * 0.6;
      if (value >= 1 || value >= 0.25) pushEvent(world, { kind: "diplomatic", severity: "major", country: c.id, title: value >= 1 ? `${c.name} embargoes ${p.name}` : `${c.name} raises tariffs on ${p.name}`, body: `An extra ${(value * 100).toFixed(0)}% barrier on bilateral trade.`, actors: [c.id, p.id], tags: ["trade"] });
      return { ok: true, message: value > 0 ? `${(value * 100).toFixed(0)}% barrier on ${p.name}.` : `Trade with ${p.name} normalised.` };
    }
    case "sanction": {
      const s = imposeSanction(world, c.id, String(body.target), (String(body.kind ?? "financial")) as never, rng);
      return s ? { ok: true, message: "Sanctions imposed." } : { ok: false, message: "Sanctions could not be imposed." };
    }
    case "lift-sanction": {
      const s = world.sanctions[String(body.id)];
      if (!s?.imposedBy.includes(c.id)) return { ok: false, message: "Those are not your sanctions." };
      liftSanction(world, s.id);
      return { ok: true, message: "Sanctions lifted." };
    }
    case "declare-war": {
      const target = String(body.target);
      if (c.overlord && c.dependencies) return { ok: false, message: `${c.name} cannot declare war without its overlord.` };
      if (c.alliances.includes(target)) {
        const pact = Object.values(world.treaties).find((t) => t.active && t.parties.includes(c.id) && t.parties.includes(target));
        return { ok: false, message: `${world.countries[target]?.name ?? target} is your treaty ally${pact ? ` under ${pact.name}` : ""}. Leave that treaty first, in the Foreign tab.` };
      }
      const war = declareWar(world, c.id, target, String(body.cause ?? "A territorial dispute."));
      if (!war) return { ok: false, message: "War could not be declared." };
      c.executive.approval = clamp(c.executive.approval + (rulesByDecree(c.government) ? 2 : -4), 0, 100);
      return { ok: true, message: war.name };
    }
    case "set-divisions": {
      const infantry = clamp(Number(body.infantry ?? 0.6), 0, 1);
      const armour = clamp(Number(body.armour ?? 0.2), 0, 1);
      const artillery = clamp(Number(body.artillery ?? 0.2), 0, 1);
      const total = infantry + armour + artillery;
      if (total < 0.5) return { ok: false, message: "An army needs at least some of one arm." };
      c.military.divisions = { infantry: infantry / total, armour: armour / total, artillery: artillery / total };
      const cost = Math.max(1e5, e.gdp * 0.002);
      e.fiscal.debt += cost;
      return { ok: true, message: `Army reorganised: ${Math.round((armour / total) * 100)}% armour, ${Math.round((artillery / total) * 100)}% artillery.` };
    }
    case "naval-invasion": {
      const target = String(body.target ?? "");
      const d = world.countries[target];
      if (!d || d.id === c.id) return { ok: false, message: "Pick another country to land in." };
      const war = Object.values(world.wars).find((w) => w.belligerents[c.id] && w.belligerents[d.id]);
      if (!war) return { ok: false, message: `${d.name} is not at war with you. Declare war first.` };
      const mine = c.military.branches.navy.active * (c.military.branches.navy.quality / 100);
      const theirs = d.military.branches.navy.active * (d.military.branches.navy.quality / 100);
      const edge = mine / Math.max(1, mine + theirs);
      const odds = clamp(0.2 + edge * 0.9 + (c.tech?.logistics ?? 0) * 0.015 + (c.tech?.navy ?? 0) * 0.03, 0.05, 0.95);
      const place = String(body.place ?? "").slice(0, 40) || d.name;
      const cost = Math.max(1e6, e.gdp * 0.008);
      e.fiscal.debt += cost;
      c.military.branches.navy.active = Math.max(1, c.military.branches.navy.active * 0.95);
      if (!rng.chance(odds)) {
        c.military.activeDuty = Math.max(1000, c.military.activeDuty * 0.97);
        c.military.morale = clamp(c.military.morale - 6, 0, 100);
        pushEvent(world, { kind: "military", severity: "major", country: c.id, title: `${c.name}: landing at ${place} repulsed`, body: `The convoy was turned back short of the beaches; ${(cost / 1e9).toFixed(2)}B and a division are gone.`, tags: ["war", "invasion"] });
        return { ok: false, message: `The landing at ${place} was repulsed.` };
      }
      war.fronts.push({ id: `${war.id}-landing-${war.fronts.length}`, name: `Landing at ${place}`, belligerents: [c.id, d.id], control: clamp(2 + edge * 8, 0, 20), contestedOutput: 0, openedAt: world.t, terrain: "coastal", attritionRate: 0.0006, overseas: true, theatre: d.id, axis: d.lon !== undefined && d.lat !== undefined ? [d.lon - 2, d.lat, d.lon + 2, d.lat] : undefined });
      c.military.readiness = clamp(c.military.readiness + 3, 0, 100);
      pushEvent(world, { kind: "military", severity: "catastrophic", country: c.id, title: `${c.name} lands at ${place}`, body: `A beachhead is open on the coast of ${d.name}. Cost so far ${(cost / 1e9).toFixed(2)}B.`, tags: ["war", "invasion"] });
      return { ok: true, message: `Beachhead established at ${place}.` };
    }
    case "special-op": {
      const target = String(body.target ?? "");
      const d = world.countries[target];
      const kind = String(body.op ?? "sabotage");
      if (!d || d.id === c.id) return { ok: false, message: "Pick another country." };
      const cost = Math.max(1e5, e.gdp * 0.0015);
      e.fiscal.debt += cost;
      const odds = clamp(0.32 + (c.tech?.army ?? 0) * 0.03 + (c.military.morale - 50) * 0.004 - d.cohesion * 0.002 - (d.counterIntel ?? 0) * 0.02, 0.05, 0.9);
      const ok = rng.chance(odds);
      d.relations[c.id] = clamp((d.relations[c.id] ?? 0) - 12, -100, 100);
      d.counterIntel = Math.min(20, (d.counterIntel ?? 0) + 1.5);
      if (!ok) {
        c.executive.approval = clamp(c.executive.approval - 3, 0, 100);
        pushEvent(world, { kind: "military", severity: "notice", country: c.id, title: `${c.name}: operation in ${d.name} blown`, body: `The team was rolled up. ${d.name} protests and the cost (${(cost / 1e9).toFixed(2)}B) is sunk.`, tags: ["covert"] });
        return { ok: false, message: "The operation failed and was exposed." };
      }
      if (kind === "sabotage") { for (const sec of d.economy.sectors) sec.capacity *= 0.96; d.economy.macro.businessConfidence = clamp(d.economy.macro.businessConfidence - 4, 0, 100); }
      else if (kind === "decapitation") { d.executive.approval = clamp(d.executive.approval - 12, 0, 100); d.cohesion = clamp(d.cohesion - 5, 0, 100); }
      else if (kind === "interdiction") { d.military.readiness = clamp(d.military.readiness - 10, 0, 100); d.military.morale = clamp(d.military.morale - 6, 0, 100); }
      else { c.military.readiness = clamp(c.military.readiness + 6, 0, 100); c.military.morale = clamp(c.military.morale + 4, 0, 100); }
      pushEvent(world, { kind: "military", severity: "major", country: c.id, title: `${c.name}: ${kind} in ${d.name}`, body: `The operation succeeded. ${d.name} blames saboteurs.`, tags: ["covert"] });
      return { ok: true, message: `${kind} in ${d.name} succeeded.` };
    }
    case "set-stance": {
      const war = world.wars[String(body.war)];
      const stance = String(body.stance);
      if (!war || war.endedAt || !war.belligerents[c.id]) return { ok: false, message: "You are not fighting that war." };
      if (stance !== "offensive" && stance !== "balanced" && stance !== "defensive") return { ok: false, message: "Unknown orders." };
      war.stance = { ...war.stance, [c.id]: stance };
      return { ok: true, message: stance === "offensive" ? "Offensive ordered. Casualties will rise." : stance === "defensive" ? "Your forces dig in." : "Normal operations." };
    }
    case "propose-peace": {
      const war = world.wars[String(body.war)];
      const enemy = String(body.enemy ?? "");
      if (!war || war.endedAt || !war.belligerents[c.id]) return { ok: false, message: "You are not fighting that war." };
      if (!war.belligerents[enemy] || enemy === c.id) return { ok: false, message: "That side is not in this war." };
      const foe = world.countries[enemy];
      const standing = peaceStanding(war, c.id, enemy, world.countries);
      const drawn = body.drawn as { ring: [number, number][]; share: number } | undefined;
      const terms: PeaceTerms = {
        annexOccupied: Boolean(body.annexOccupied) && standing.mine > 0,
        annexWhole: Boolean(body.annexWhole) && standing.mine >= 0.8,
        cede: Boolean(body.cede) && standing.theirs > 0,
        drawnShare: drawn ? clamp(Number(drawn.share), 0, 1) : 0,
        reparations: clamp(Number(body.reparations ?? 0), -0.3, 0.3),
      };
      if (Boolean(body.annexWhole) && !terms.annexWhole) return { ok: false, message: "You need to hold at least 80% of a country to annex all of it." };
      if (!peaceAccepted(terms, standing)) {
        return { ok: false, message: `${foe?.name ?? war.rebels?.[enemy]?.name ?? "The enemy"} refuses. These terms ask for ${peaceCost(terms, standing).toFixed(0)} and your position only supports ${standing.leverage.toFixed(0)}.` };
      }

      const results: string[] = [];
      // A puppet keeps the beaten state on the map under the victor: land taken below
      // becomes a client of its own rather than a province of the winner.
      const takesLand = Boolean(terms.annexWhole || (terms.annexOccupied && standing.mine > 0 && Array.isArray(body.occupiedRing)) || ((terms.drawnShare ?? 0) > 0 && (drawn?.ring?.length ?? 0) >= 3));
      const wantsPuppet = Boolean(body.puppet) && Boolean(foe) && takesLand;
      const clientName = String(body.puppetName ?? "").trim() || `${foe?.name ?? enemy} Protectorate`;
      let carved: Country | null = null;
      if (wantsPuppet && foe && !terms.annexWhole) carved = createPuppetState(world, c.id, enemy, clientName);
      const to = carved?.id ?? c.id;
      if (carved) results.push(`${carved.name} is set up under your protection`);
      if (foe && terms.annexWhole && wantsPuppet) {
        const client = vassalise(world, c.id, enemy);
        results.push(client ? `${foe.name} becomes your puppet` : `${foe.name} stays independent`);
      } else if (foe && terms.annexWhole) {
        annex(world, c.id, enemy, `${foe.name} is annexed under the peace terms.`);
        results.push(`${foe.name} is annexed`);
      } else if (foe) {
        const front = standing.mineFront >= 0 ? war.fronts[standing.mineFront] : undefined;
        const held = front ? frontOccupation(war, front, world.countries) : null;
        const ring = body.occupiedRing as [number, number][] | undefined;
        if (terms.annexOccupied && held && ring && ring.length >= 3) {
          transferLand(world, held.territory, to, held.share, ring, carved ? `Granted to ${carved.name}` : `Annexed from ${world.countries[held.territory]?.name ?? held.territory}`);
          results.push(carved ? `${carved.name} receives ${(held.share * 100).toFixed(1)}% of ${world.countries[held.territory]?.name}` : `you annex ${(held.share * 100).toFixed(1)}% of ${world.countries[held.territory]?.name}`);
        }
        if (drawn && terms.drawnShare) {
          transferLand(world, enemy, to, terms.drawnShare, drawn.ring, carved ? `Granted to ${carved.name}` : `Annexed from ${foe.name}`);
          results.push(carved ? `${carved.name} receives the land you marked` : `you take the land you marked, ${(terms.drawnShare * 100).toFixed(1)}% of ${foe.name}`);
        }
      }
      if (foe && terms.cede) {
        const front = war.fronts[standing.theirsFront];
        const held = front ? frontOccupation(war, front, world.countries) : null;
        const ring = body.cededRing as [number, number][] | undefined;
        if (held && ring && ring.length >= 3) {
          transferLand(world, held.territory, enemy, held.share, ring, `Ceded by ${c.name}`);
          results.push(`you cede ${(held.share * 100).toFixed(1)}% of ${world.countries[held.territory]?.name}`);
        }
      }
      if (foe && terms.reparations) {
        const amount = foe.economy.gdp * Math.abs(terms.reparations);
        const payer = terms.reparations > 0 ? foe : c;
        const payee = terms.reparations > 0 ? c : foe;
        payer.economy.fiscal.debt += amount;
        payee.economy.fiscal.debt = Math.max(0, payee.economy.fiscal.debt - amount);
        results.push(`${payer.name} pays ${(amount / 1e9).toFixed(1)}B in reparations`);
      }

      // Everything not transferred goes back to its owner.
      const leaving = [c.id, ...(war.belligerents[c.id] ?? [])];
      for (const f of war.fronts) {
        if (f.belligerents.includes(c.id) && f.belligerents.includes(enemy)) f.theatre = "none";
      }
      const others = Object.keys(war.belligerents).filter((b) => b !== c.id && b !== enemy);
      if (others.length) {
        delete war.belligerents[c.id];
        war.fronts = war.fronts.filter((f) => !f.belligerents.includes(c.id));
      }
      if (!others.length || !war.fronts.length) {
        war.endedAt = Math.max(1, world.t); // 0 would read as "still running" on day one
        war.outcome = terms.annexOccupied || terms.annexWhole || terms.drawnShare ? "victory" : terms.cede ? "defeat" : "white-peace";
        for (const b of Object.keys(war.belligerents)) {
          const x = world.countries[b];
          if (x) x.wars = x.wars.filter((w) => w !== war.id);
          for (const a of war.belligerents[b] ?? []) {
            const y = world.countries[a];
            if (y) y.wars = y.wars.filter((w) => w !== war.id);
          }
        }
      }
      for (const id of leaving) {
        const x = world.countries[id];
        if (x) x.wars = x.wars.filter((w) => w !== war.id);
      }
      const summary = results.length ? results.join("; ") : "a return to the old borders";
      pushEvent(world, { kind: "military", severity: "major", country: c.id, title: `Peace ends the ${war.name}`, body: `Terms: ${summary}.`, actors: [c.id, enemy], tags: ["war", "peace"] });
      return { ok: true, message: `Peace signed: ${summary}.` };
    }
    case "seek-peace": {
      const war = world.wars[String(body.war)];
      if (!war || war.endedAt || !war.belligerents[c.id]) return { ok: false, message: "You are not fighting that war." };
      const mine = war.exhaustion[c.id] ?? 0;
      const others = Object.keys(war.belligerents).filter((b) => b !== c.id);
      const theirs = others.reduce((a, b) => a + (war.exhaustion[b] ?? 0), 0) / Math.max(1, others.length);
      const front = war.fronts.find((f) => f.belligerents.includes(c.id));
      const position = front ? (front.belligerents[0] === c.id ? front.control : -front.control) : 0;
      if (theirs + Math.max(0, position) * 0.3 < 28 && !body.force) return { ok: false, message: "The enemy still believes it can win. They refuse to talk yet." };
      const reparations = position < -25 ? e.gdp * clamp((-position - 25) * 0.002, 0.01, 0.2) : 0;
      if (reparations > 0) e.fiscal.debt += reparations;
      war.endedAt = Math.max(1, world.t); // 0 would read as "still running" on day one
      war.outcome = "white-peace";
      for (const b of Object.keys(war.belligerents)) {
        const x = world.countries[b];
        if (x) x.wars = x.wars.filter((w) => w !== war.id);
        for (const a of war.belligerents[b] ?? []) {
          const y = world.countries[a];
          if (y) y.wars = y.wars.filter((w) => w !== war.id);
        }
      }
      pushEvent(world, { kind: "military", severity: "major", country: c.id, title: `Peace ends the ${war.name}`, body: reparations > 0 ? `${c.name} accepts terms and pays ${(reparations / 1e9).toFixed(1)}B in reparations.` : "A negotiated peace on the current lines.", actors: Object.keys(war.belligerents), tags: ["war", "peace"] });
      return { ok: true, message: "Peace signed." + (mine > 70 ? " Your army was close to breaking." : "") };
    }
    case "offer-treaty": {
      const partner = world.countries[String(body.partner)];
      const kind = String(body.kind ?? "trade") as Treaty["kind"];
      if (!partner) return { ok: false, message: "No such state." };
      const rel = partner.relations[c.id] ?? 0;
      const need: Partial<Record<Treaty["kind"], number>> = { alliance: 45, "defensive-pact": 40, trade: -5, "customs-union": 25, "non-aggression": -25 };
      if (rel < (need[kind] ?? 20)) return { ok: false, message: `${partner.name} declines. Relations of ${rel.toFixed(0)} are too low; they want ${need[kind] ?? 20}.` };
      const t = signTreaty(world, kind, [c.id, partner.id], [`Signed by ${c.name} and ${partner.name}.`], rng, Math.min(e.gdp, partner.economy.gdp) * 0.01);
      return t ? { ok: true, message: `${t.name} signed.` } : { ok: false, message: "The treaty failed." };
    }
    case "leave-treaty": {
      const t = world.treaties[String(body.id)];
      if (!t?.parties.includes(c.id)) return { ok: false, message: "You are not party to that treaty." };
      t.parties = t.parties.filter((p) => p !== c.id);
      if (t.parties.length < 2) t.active = false;
      c.alliances = c.alliances.filter((a) => !t.parties.includes(a));
      for (const p of t.parties) {
        c.relations[p] = clamp((c.relations[p] ?? 0) - 25, -100, 100);
        const o = world.countries[p];
        if (o) {
          o.relations[c.id] = clamp((o.relations[c.id] ?? 0) - 25, -100, 100);
          o.alliances = o.alliances.filter((x) => x !== c.id);
        }
      }
      pushEvent(world, { kind: "diplomatic", severity: "major", country: c.id, title: `${c.name} leaves ${t.name}`, body: "The treaty partners are not pleased.", tags: ["treaty"] });
      return { ok: true, message: `Left ${t.name}.` };
    }
    case "diplomatic-mission": {
      const p = world.countries[String(body.partner)];
      if (!p) return { ok: false, message: "No such state." };
      const cost = e.gdp * 0.0002;
      e.fiscal.debt += cost;
      const boost = rng.float(3, 9);
      p.relations[c.id] = clamp((p.relations[c.id] ?? 0) + boost, -100, 100);
      c.relations[p.id] = clamp((c.relations[p.id] ?? 0) + boost, -100, 100);
      return { ok: true, message: `Relations with ${p.name} improve by ${boost.toFixed(0)}.` };
    }
    case "imf-bailout": {
      if (world.startDate.year < 1950) return { ok: false, message: "There is no IMF in this era. Try the London bankers." };
      if (e.macro.riskPremium < 0.05 && !e.macro.defaulted) return { ok: false, message: "Your borrowing costs are not bad enough to qualify." };
      const amount = e.gdp * 0.1;
      e.reserves += amount;
      e.macro.riskPremium *= 0.6;
      e.macro.debtCost *= 0.85;
      e.macro.bailout = true;
      e.macro.defaulted = false;
      for (const k of BUDGET_KEYS) e.budget[k] *= k === "defence" ? 0.85 : 0.92;
      e.tax.vat = clamp(e.tax.vat * 1.1, 0, 0.3);
      e.centralBank.printing = 0;
      c.executive.approval = clamp(c.executive.approval - 9, 0, 100);
      pushEvent(world, { kind: "economic", severity: "major", country: c.id, title: `${c.name} accepts an IMF programme`, body: `A ${(amount / 1e9).toFixed(0)}B loan comes with spending cuts and a VAT rise.`, tags: ["debt"] });
      return { ok: true, message: "IMF programme agreed. Austerity follows." };
    }
    case "default": {
      if (e.macro.defaulted) return { ok: false, message: "You are already in default." };
      const haircut = clamp(Number(body.haircut ?? 0.4), 0.1, 0.8);
      e.fiscal.debt *= 1 - haircut;
      e.macro.defaulted = true;
      e.macro.shock -= 0.06;
      e.macro.shockDecay = 0.8;
      c.executive.approval = clamp(c.executive.approval - 8, 0, 100);
      pushEvent(world, { kind: "economic", severity: "catastrophic", country: c.id, title: `${c.name} repudiates its debts`, body: `Bondholders lose ${(haircut * 100).toFixed(0)}%. International lending dries up.`, tags: ["crisis", "debt"] });
      return { ok: true, message: "You have defaulted." };
    }
    case "nationalise-all":
    case "privatise-all": {
      const taking = type === "nationalise-all";
      let count = 0;
      let money = 0;
      for (const co of Object.values(world.companies)) {
        if (co.country !== c.id || co.insolvent) continue;
        if (taking ? co.stateOwnership >= 0.99 : co.stateOwnership <= 0.01) continue;
        if (taking) {
          money += co.valuation * (1 - co.stateOwnership) * 0.6;
          co.stateOwnership = 1;
          co.listed = false;
          for (const ex of world.markets.exchanges) ex.listings = ex.listings.filter((x) => x !== co.id);
        } else {
          money -= co.valuation * co.stateOwnership;
          co.stateOwnership = 0;
          const ex = world.markets.exchanges.find((x) => x.country === c.id);
          if (ex) { co.exchangeId = ex.id; co.listed = true; if (!ex.listings.includes(co.id)) ex.listings.push(co.id); }
        }
        count += 1;
      }
      if (!count) return { ok: false, message: "There is nothing to change ownership of." };
      c.economy.fiscal.debt = Math.max(0, c.economy.fiscal.debt + money);
      c.economy.macro.businessConfidence = clamp(c.economy.macro.businessConfidence + (taking ? -4 : 4), 0, 100);
      pushEvent(world, { kind: "corporate", severity: "major", country: c.id, title: `${c.name} ${taking ? "nationalises" : "privatises"} ${count} firms`, body: taking ? `Compensation of ${(money / 1e9).toFixed(1)}B is added to the debt.` : `The sales raise ${(-money / 1e9).toFixed(1)}B to pay down debt.`, tags: ["corporate"] });
      return { ok: true, message: `${count} firms ${taking ? "nationalised" : "privatised"}.` };
    }
    case "nationalise":
    case "privatise": {
      const co = world.companies[String(body.company)];
      if (!co || co.country !== c.id) return { ok: false, message: "That company is outside your jurisdiction." };
      return ownership(world, c, co, type === "nationalise");
    }
    case "bail-out": {
      const co = world.companies[String(body.company)];
      if (!co || co.country !== c.id) return { ok: false, message: "That company is outside your jurisdiction." };
      const cost = Math.max(co.debt * 0.7, co.revenue * 0.1);
      e.fiscal.debt += cost;
      co.debt -= Math.min(co.debt, cost);
      co.insolvent = false;
      co.stateOwnership = clamp01(co.stateOwnership + 0.2);
      pushEvent(world, { kind: "corporate", severity: "major", country: c.id, title: `${c.name} bails out ${co.name}`, body: `The state takes on ${(cost / 1e9).toFixed(1)}B and a 20% stake.`, tags: ["corporate"] });
      return { ok: true, message: `${co.name} rescued for ${(cost / 1e9).toFixed(1)}B.` };
    }
    case "set-policy-lever": {
      const area = String(body.area) as PolicyArea;
      if (!(area in c.policies)) return { ok: false, message: "Unknown policy." };
      c.policies[area] = clamp(Number(body.value), -100, 100);
      return { ok: true, message: `${area} stance updated.` };
    }
    case "appoint": {
      const area = String(body.area) as PolicyArea;
      const m = c.executive.ministers.find((x) => x.id === area);
      const name = String(body.name ?? "").trim().slice(0, 60);
      if (!m || !name) return { ok: false, message: "Choose a post and a name." };
      const ch: Character = {
        id: `ch-${c.id}-apt-${world.dayCount}-${area}`, name, country: c.id, role: "minister", partyId: c.executive.coalition[0],
        stats: { competence: Math.round(rng.normal() * 22 + 20), charisma: Math.round(rng.normal() * 22), integrity: Math.round(rng.normal() * 25), ambition: 30, ideology: c.ideology, popularity: 50, experience: 45, militancy: 0 },
        createdAt: world.t,
      };
      world.characters[ch.id] = ch;
      m.characterId = ch.id;
      return { ok: true, message: `${name} is the new ${m.title}.`, data: { competence: ch.stats.competence } };
    }
    case "emergency-powers": {
      if (rulesByDecree(c.government)) return { ok: false, message: "You already rule by decree." };
      const on = Boolean(body.value);
      c.executive.emergencyPowers = on;
      c.executive.approval = clamp(c.executive.approval - (on ? 12 : -4), 0, 100);
      c.cohesion = clamp(c.cohesion - (on ? 8 : 0), 0, 100);
      pushEvent(world, { kind: "political", severity: "major", country: c.id, title: on ? `${c.name}: state of emergency declared` : `${c.name}: state of emergency lifted`, body: on ? "Parliament is bypassed. The government rules by decree." : "Normal government resumes.", tags: ["emergency"] });
      return { ok: true, message: on ? "You now rule by emergency decree." : "Emergency powers ended." };
    }
    case "call-election": {
      if (c.nextElectionAt === undefined) return { ok: false, message: "There are no elections here." };
      c.nextElectionAt = world.t + 45 * 86400;
      pushEvent(world, { kind: "political", severity: "major", country: c.id, title: `${c.name}: snap election called`, body: "Voters go to the polls in six weeks.", tags: ["election"] });
      return { ok: true, message: "Snap election in six weeks." };
    }
    case "military": {
      const m = c.military;
      if (body.mobilise !== undefined) {
        const move = Math.round(m.reserves * clamp01(Number(body.mobilise)));
        m.reserves -= move;
        m.activeDuty += move;
        e.macro.nairu = clamp(e.macro.nairu - 0.002, 0.01, 0.3);
        return { ok: true, message: `${move.toLocaleString("en-US")} reservists called up.` };
      }
      if (body.conscription !== undefined) {
        const on = Boolean(body.conscription);
        if (on === m.conscription) return { ok: false, message: on ? "Conscription is already in force." : "There is no conscription to end." };
        m.conscription = on;
        // Ending the draft sends the extra reservists home, so toggling gains nothing.
        m.reserves = Math.round(on ? m.reserves * 1.5 : m.reserves / 1.5);
        return { ok: true, message: on ? "Conscription introduced." : "Conscription abolished." };
      }
      return { ok: false, message: "No military order given." };
    }
    default:
      return { ok: false, message: `Unknown command "${type}".` };
  }
}

function ownership(world: World, c: Country, co: Company, nationalise: boolean): CommandResult {
  if (nationalise) {
    if (co.stateOwnership >= 0.99) return { ok: false, message: `${co.name} is already state owned.` };
    const compensation = co.valuation * (1 - co.stateOwnership) * 0.6;
    c.economy.fiscal.debt += compensation;
    co.stateOwnership = 1;
    co.listed = false;
    for (const ex of world.markets.exchanges) ex.listings = ex.listings.filter((x) => x !== co.id);
    world.markets.riskAppetite = clamp(world.markets.riskAppetite - (co.valuation / Math.max(1, world.globals.globalGdp)) * 30, 1, 99);
    c.economy.macro.businessConfidence = clamp(c.economy.macro.businessConfidence - 6, 0, 100);
    pushEvent(world, { kind: "corporate", severity: "major", country: c.id, title: `${c.name} nationalises ${co.name}`, body: `Owners are compensated ${(compensation / 1e9).toFixed(1)}B. Investors take note.`, tags: ["corporate"] });
    return { ok: true, message: `${co.name} nationalised for ${(compensation / 1e9).toFixed(1)}B.` };
  }
  if (co.stateOwnership <= 0.01) return { ok: false, message: `${co.name} is not state owned.` };
  const proceeds = co.valuation * co.stateOwnership;
  c.economy.fiscal.debt = Math.max(0, c.economy.fiscal.debt - proceeds);
  co.stateOwnership = 0;
  const ex = world.markets.exchanges.find((x) => x.country === c.id);
  if (ex) {
    co.exchangeId = ex.id;
    co.listed = true;
    if (!ex.listings.includes(co.id)) ex.listings.push(co.id);
  }
  pushEvent(world, { kind: "corporate", severity: "major", country: c.id, title: `${c.name} privatises ${co.name}`, body: `The sale raises ${(proceeds / 1e9).toFixed(1)}B to pay down debt.`, tags: ["corporate"] });
  return { ok: true, message: `${co.name} sold for ${(proceeds / 1e9).toFixed(1)}B.` };
}

function num(v: unknown): number | undefined {
  return v === undefined || v === null ? undefined : Number(v);
}
