import type { Company, Country, MarketMood, PolicyArea, World } from "../shared/types";
import { SECTORS } from "../data/economy";
import { pushEvent, recomputeGlobals } from "./bootstrap";
import { Rng, approach, bell, clamp, clamp01, weightedMean } from "./rng";

/**
 * Real-time continuous macro step.
 *
 * Called once per tick with the real elapsed seconds. Every rate in here is an
 * ANNUAL rate; they are converted to per-second by `ann()` so that a tick of any
 * length produces the same trajectory. That is what makes the simulation
 * frame-rate independent and lets a dev slow the world to 0.1x and have it stay
 * coherent.
 */
const SECONDS_PER_YEAR = 365 * 86400;

/** Which policy lever most directly drives each sector. */
const SECTOR_POLICY: Record<string, PolicyArea> = {
  agriculture: "agriculture",
  mining: "economy",
  manufacturing: "economy",
  energy: "energy",
  utilities: "energy",
  construction: "economy",
  transport: "transport",
  retail: "economy",
  finance: "economy",
  "real-estate": "housing",
  telecom: "technology",
  technology: "technology",
  healthcare: "health",
  education: "education",
  defence: "defence",
  tourism: "economy",
  media: "technology",
};

const sectorToPolicy = (id: string): PolicyArea => SECTOR_POLICY[id] ?? "economy";

/** Convert an annual rate to a per-second rate for dt seconds. */
const ann = (annualRate: number, dt: number): number => Math.pow(1 + annualRate, dt / SECONDS_PER_YEAR);

export interface StepResult {
  events: number;
}

// ===========================================================================
// Economy
// ===========================================================================

export function stepEconomy(world: World, rnd: Rng, dt: number): void {
  const P = world.params;
  const global = world.markets;

  // Global cycle drives the business cycle. A single global output gap is
  // cheaper than simulating demand at every bilateral pair, and it produces the
  // synchronisation that makes a world recession feel like one.
  const cycleGap = (global.riskAppetite - 50) / 50;

  for (const c of Object.values(world.countries)) {
    if (c.annexedBy) continue;
    stepCountryEconomy(world, c, rnd, dt, P, cycleGap, global);
  }

  // --- Central banks ------------------------------------------------------
  for (const c of Object.values(world.countries)) {
    if (c.annexedBy) continue;
    const e = c.economy;
    // Taylor-rule-lite: react to the inflation gap and the output gap.
    const inflationGap = e.monetary.inflation - P.inflationTarget;
    const target = P.inflationTarget + inflationGap * 1.8 + (c.executive.approval < 30 ? -0.01 : 0);
    const newRate = approach(e.monetary.policyRate, target, P.policyRateSmoothing * dt);
    e.monetary.policyRate = clamp(newRate, -0.05, 0.4);

    // Exchange rate follows interest differentials with a slow-moving parity.
    const real = e.monetary.policyRate - e.monetary.inflation;
    e.monetary.currencyConfidence = approach(e.monetary.currencyConfidence, clamp(50 + real * 900 - e.monetary.inflation * 400, 0, 100), dt / (SECONDS_PER_YEAR * 0.25));
    e.monetary.exchangeRateVsUsd = clamp(e.monetary.exchangeRateVsUsd * ann(real * 0.35, dt), 0.0001, 1e6);
    e.monetary.moneySupply = clamp(e.monetary.moneySupply * ann((e.monetary.policyRate - e.monetary.inflation) * 0.4, dt), 0.05, 40);
  }
}

function stepCountryEconomy(world: World, c: Country, rnd: Rng, dt: number, P: World['params'], cycleGap: number, global: World['markets']): void {
  const e = c.economy;

  // --- Sectors -------------------------------------------------------------
  const total = c.economy.sectors.reduce((a, s) => a + s.share, 0) || 1;
  for (const s of e.sectors) {
    const prof = SECTORS[s.id];
    // A sector's growth is its baseline, nudged by the global cycle according to
    // how cyclical it is, and up or down by policy levers the government holds.
    const lever = c.policies[sectorToPolicy(s.id)] ?? 0;
    const cyclical = cycleGap * prof.cyclicality * 0.5;
    const policyEffect = lever * 0.00004;
    const shock = rnd.normal() * prof.cyclicality * 0.02 * Math.sqrt(dt / 86400);
    s.growth = clamp(s.growth + (prof.growth * 0.00002) + shock, prof.growth * 0.25, prof.growth * 2.2);
    s.productivity = clamp(s.productivity + (s.growth * 6 + lever * 0.004) * (dt / SECONDS_PER_YEAR), 5, 200);
    s.stateOwnership = approach(s.stateOwnership, s.stateSubsidy > 0.05 ? s.stateSubsidy : 0.001, dt / (SECONDS_PER_YEAR * 2));
    void total;
    void cyclical;
    void policyEffect;
  }

  // --- Aggregate growth ---------------------------------------------------
  // Output-weighted sector growth, then country-level drags.
  const sectorGrowth = weightedMean(e.sectors.map((s) => s.growth), e.sectors.map((s) => s.share));
  const capitalGrowth = weightedMean(e.sectors.map((s) => SECTORS[s.id].capitalIntensity), e.sectors.map((s) => s.share));
  const labourShare = weightedMean(e.sectors.map((s) => SECTORS[s.id].labourIntensity), e.sectors.map((s) => s.share));

  const corruptionPenalty = -e.corruption * P.corruptionDrag * 0.09;
  const inequalityPenalty = -e.inequality * P.inequalityDrag * 0.06;
  const techBonus = (e.rd / Math.max(1, e.gdp)) * 0.4;
  const sanctionPenalty = sanctionLoad(world, c) * P.sanctionBite * 0.12;
  const warPenalty = warLoad(world, c);
  const cyclePenalty = cycleGap * 0.05;
  const balanceDrag = -e.fiscal.budgetBalanceRatio * P.fiscalMultiplier * 0.02;

  let targetGrowth =
    sectorGrowth +
    corruptionPenalty +
    inequalityPenalty +
    techBonus +
    sanctionPenalty +
    warPenalty +
    cyclePenalty +
    balanceDrag;

  // Potential growth: how fast this economy *could* grow given its capital and
  // labour. The output gap is the distance between actual and potential, and it
  // is what drives unemployment.
  const potential = sectorGrowth * 0.7 + e.productivity * 0.0004;
  const gap = e.gdpGrowth - potential;

  e.gdpGrowth = approach(e.gdpGrowth, targetGrowth * P.growthBias, P.growthSmoothing * (dt / SECONDS_PER_YEAR) * 12 + P.growthSmoothing * 0.02);
  e.gdpGrowth = clamp(e.gdpGrowth, -0.55, 0.5);
  e.gdp = Math.max(1e6, e.gdp * ann(e.gdpGrowth, dt));
  e.nominalGrowth = (1 + e.gdpGrowth) * (1 + e.monetary.inflation) - 1;
  e.gdpPerCapita = e.gdp / e.population;
  e.productivity = clamp(e.productivity + (e.gdpGrowth - (e.population > 0 ? 0.006 : 0)) * 22 * (dt / SECONDS_PER_YEAR), 5, 100);

  // --- Population ----------------------------------------------------------
  const fertility = clamp01(0.026 - e.gdpPerCapita / 4e6) * 0.9 + 0.004;
  const popGrowth = fertility - e.labour.unemployment * 0.012 - e.monetary.inflation * 0.02 - 0.006;
  e.population = Math.max(1000, e.population * ann(clamp(popGrowth, -0.05, 0.06), dt));

  // --- Okun's law ----------------------------------------------------------
  // A negative output gap pushes unemployment up. This is the single most
  // visible channel between macro and politics in the whole simulation.
  const du = -gap * P.okunSensitivity;
  const wagePressure = P.wagePush * (e.gdpGrowth - e.labour.unemployment + 0.03);
  e.labour.unemployment = clamp01(e.labour.unemployment + du * (dt / SECONDS_PER_YEAR) * 12 - du * du * 0.12 * 0.5);
  if (e.labour.unemployment > 0.5) e.labour.unemployment = 0.5;

  // --- Phillips curve ------------------------------------------------------
  const slack = clamp01((0.05 - e.labour.unemployment) / 0.05);
  const targetInflation = P.inflationTarget + slack * 0.07 + wagePressure * 0.5;
  e.monetary.inflation = approach(e.monetary.inflation, clamp(targetInflation, -0.2, 0.9), 0.05 * (dt / SECONDS_PER_YEAR) * 12 + 0.0002);

  // --- Wages ---------------------------------------------------------------
  const targetWage = e.gdpPerCapita * 0.74 * (1 - e.inequality * 0.2);
  e.labour.medianWage = Math.max(100, approach(e.labour.medianWage, targetWage, 0.02 * (dt / SECONDS_PER_YEAR) * 12 + 0.0001));
  e.labour.wageGrowth = clamp(e.labour.medianWage / Math.max(1, e.gdpPerCapita * 0.74) - 1, -0.4, 0.4);
  e.labour.unionisation = clamp01(e.labour.unionisation + (c.policies.labour * 0.00002) * (dt / SECONDS_PER_YEAR) * 12);
  e.labour.strikeRisk = clamp01(bell(e.labour.unemployment, 0.06, 900) * 0.6 * e.labour.unionisation * 2.4 + (1 - e.labour.satisfaction) * 0.2);
  e.labour.satisfaction = approach(
    e.labour.satisfaction,
    clamp01(0.6 - e.labour.unemployment * 1.4 + e.gdpGrowth * 2.2 - e.monetary.inflation * 1.1 + c.executive.approval * 0.0016),
    0.02 * (dt / SECONDS_PER_YEAR) * 12 + 0.00008,
  );

  // --- Fiscal --------------------------------------------------------------
  const f = e.fiscal;
  const taxBurden = clamp(0.16 + (1 - e.labour.unemployment) * 0.22 + e.inequality * 0.12, 0.08, 0.5);
  f.taxIncome = e.gdp * taxBurden * 0.62;
  f.corporateTax = e.gdp * taxBurden * 0.2;
  f.vat = e.gdp * taxBurden * 0.28;
  f.tariffs = e.trade.imports * e.trade.tariffRate;
  f.resourceRent = e.gdp * weightedMean(e.sectors.filter((x) => x.id === "mining" || x.id === "energy").map((x) => x.share), e.sectors.map(() => 1)) * (0.2 + global.commodityPrices.oil / 100);
  f.revenue = f.taxIncome + f.corporateTax + f.vat + f.tariffs + f.resourceRent;

  // Spending follows policy levers. A government that wants defence pays for it,
  // and a government that raises taxes can afford more of it.
  //
  // `stance` is the intended ratio of discretionary spending to revenue. It is
  // driven by the economic and defence policy levers against the tax lever, and
  // hard-clamped so a single extreme policy setting cannot invert the fiscal
  // identity into a permanent, compounding deficit.
  const stance = clamp(
    1 + (c.policies.economy + c.policies.welfare + c.policies.defence - c.policies.tax * 1.2 + c.policies.education + c.policies.health) / 1100,
    0.55,
    1.45,
  );
  const spendBudget = f.revenue * stance;
  f.military = spendBudget * clamp(0.05 + (c.policies.defence + 100) / 300 * 0.28, 0.02, 0.45);
  f.welfare = spendBudget * clamp(0.08 + (c.policies.welfare + 100) / 260 * 0.34, 0.04, 0.5);
  f.infrastructure = spendBudget * clamp(0.04 + (c.policies.economy + 100) / 420 * 0.2, 0.02, 0.3);
  f.education = spendBudget * clamp(0.03 + (c.policies.education + 100) / 500 * 0.16, 0.015, 0.24);
  f.healthcare = spendBudget * clamp(0.03 + (c.policies.health + 100) / 500 * 0.16, 0.015, 0.26);
  f.administration = spendBudget * clamp(0.04 + e.corruption * 0.12, 0.03, 0.22);

  // Debt service: the risk-free rate plus a spread that widens with leverage.
  // The spread coefficient is deliberately small. Real-world risk premia move by
  // a few percentage points across the whole debt range; an aggressive coefficient
  // here makes interest dominate the budget and every state spirals to default.
  const riskPremium = Math.min(f.debtToGdp, 3) * P.debtInterestRisk * 0.35 + (1 - f.creditRating) * 0.05;
  f.debtService = Math.min(f.debt * (P.debtInterestBase + riskPremium + e.monetary.policyRate * 0.35), f.revenue * 1.15);

  const discretionary = f.military + f.welfare + f.infrastructure + f.education + f.healthcare + f.administration;
  f.expenditure = discretionary + f.debtService;
  f.budgetBalanceRatio = clamp((f.revenue - f.expenditure) / Math.max(1, e.gdp), -0.35, 0.3);

  // Deficits are financed. Deficits raise debt, surpluses pay it down.
  // Note there is deliberately no interest capitalisation here: interest is
  // already inside `expenditure` via `debtService`, so compounding it again
  // would double-count and drive every state into a debt spiral.
  const deficit = f.expenditure - f.revenue;
  const growthInDebt = Math.max(0, deficit) * (dt / SECONDS_PER_YEAR);
  const paydown = Math.max(0, -deficit) * 0.35 * (dt / SECONDS_PER_YEAR);
  // Hard ceiling at 40x GDP. Past that point the state is a credit event, not
  // a country, and the number stops carrying information.
  f.debt = Math.min(Math.max(0, f.debt + growthInDebt - paydown), e.gdp * 40);
  f.debtToGdp = f.debt / Math.max(1, e.gdp);
  f.treasury = clamp(f.treasury + f.budgetBalanceRatio * e.gdp * (dt / SECONDS_PER_YEAR), -e.gdp * 0.4, e.gdp * 1.5);

  // Credit rating is a function of leverage, deficit, inflation and reserves.
  const ratingScore = clamp(
    100 - f.debtToGdp * 44 - Math.max(0, f.budgetBalanceRatio) * 130 - Math.max(0, e.monetary.inflation - 0.06) * 220 + clamp(e.reserves / Math.max(1, e.gdp), 0, 1) * 18,
    2,
    99,
  );
  f.creditRating = approach(f.creditRating, ratingScore / 100, 0.01 * (dt / SECONDS_PER_YEAR) * 12 + 0.00004);
  e.debtRatingScore = ratingScore;

  if (f.debtToGdp > P.bankruptcyThreshold && rnd.chance(0.0004 * P.eventRate * (dt / 86400))) {
    pushEvent(world, {
      kind: "economic",
      severity: "catastrophic",
      country: c.id,
      title: `${c.name} sovereign debt crisis`,
      body: `Debt has reached ${(f.debtToGdp * 100).toFixed(0)}% of GDP. The markets have stopped rolling the paper.`,
      tags: ["crisis", "debt"],
    });
    f.creditRating = 0.02;
    e.monetary.inflation += 0.08;
    c.unrestRisk = Math.min(0.5, c.unrestRisk + 0.08);
  }

  // --- Corruption and inequality drift ------------------------------------
  e.corruption = clamp01(e.corruption + P.corruptionRate * (0.5 + c.policies.justice / 200) * (1 + e.gdp / 4e12) - (c.policies.justice + 100) * 0.000012 * (dt / SECONDS_PER_YEAR) * 12);
  e.inequality = clamp01(e.inequality + (e.gdpGrowth < 0 ? 0.000006 : -0.000003) * (1 - (c.policies.welfare + 100) / 500) * 12 * (dt / SECONDS_PER_YEAR));

  // --- Trade ---------------------------------------------------------------
  const t = e.trade;
  t.tariffRate = clamp01((c.policies.economy * 0.00004) + 0.06);
  const openness = clamp01(t.tradeOpenness / 100 * (1 - t.tariffRate * 1.6));
  const partnerGdp = Object.keys(t.flows).reduce((a, k) => a + (world.countries[k]?.economy.gdp ?? 0), 0);
  const worldGdp = Math.max(1, world.globals.globalGdp);
  const partnerShare = clamp01(partnerGdp / worldGdp) * 0.4 + 0.2;
  t.exports = e.gdp * openness * partnerShare * (1 + cycleGap * P.tradeElasticity * 0.12);
  t.imports = e.gdp * openness * partnerShare * (1 + cycleGap * P.tradeElasticity * 0.12 + 0.02);
  t.tradeBalance = t.exports - t.imports;
  t.tradeOpenness = clamp(t.tradeOpenness + (0.6 - t.tradeOpenness) * 0.02 * (dt / SECONDS_PER_YEAR) * 12, 4, 96);

  // --- Net foreign assets and reserves ------------------------------------
  e.netForeignAssets += (t.tradeBalance - f.debtService) * (dt / SECONDS_PER_YEAR) * 0.85;
  e.reserves = clamp(e.reserves + t.tradeBalance * (dt / SECONDS_PER_YEAR) * 0.3 - f.debtService * 0.1 * (dt / SECONDS_PER_YEAR), 0, e.gdp * 3);
  e.rd = e.gdp * clamp(0.001 + (c.policies.education + 100) * 0.00009 + (c.policies.technology + 100) * 0.00005, 0.0004, 0.09);

  // --- Corporate sector feedback ------------------------------------------
  const corpShare = e.sectors.find((s) => s.id === "finance")?.share ?? 0.05;
  const leverage = clamp01(corpShare * 3.4) * (1 - f.creditRating * 0.5);
  void leverage;
  void capitalGrowth;
  void labourShare;
}

// ===========================================================================
// Companies and markets
// ===========================================================================

export function stepMarkets(world: World, rnd: Rng, dt: number): void {
  const P = world.params;

  // --- Commodities ---------------------------------------------------------
  // Prices are mean-reverting around a base with a demand term, so a war can
  // spike them and they will decay rather than running away.
  const globalGrowth = world.globals.globalGdp > 0 ? avgGrowth(world) : 0;
  for (const [k, base] of Object.entries(world.markets.commodityPrices)) {
    const cur = base;
    const warPressure = clamp(world.globals.worldConflictIndex / 100, 0, 1) * (k === "oil" || k === "gold" || k === "wheat" ? 0.6 : 0.15);
    const demand = 1 + globalGrowth * 3;
    const target = cur * (demand + warPressure) * 0.5 + cur * 0.5;
    const next = approach(cur, target, 0.02 * (dt / SECONDS_PER_YEAR) * 12 + 0.00004) * (1 + rnd.normal() * 0.004 * Math.sqrt(dt / 86400));
    world.markets.commodityPrices[k as keyof typeof world.markets.commodityPrices] = Math.max(0.01, next);
  }

  // --- Companies -----------------------------------------------------------
  for (const co of Object.values(world.companies)) {
    if (co.banned || co.insolvent) continue;
    stepCompany(world, co, rnd, dt);
  }

  // --- Exchanges -----------------------------------------------------------
  for (const ex of world.markets.exchanges) {
    let cap = 0;
    let weighted = 0;
    for (const id of ex.listings) {
      const co = world.companies[id];
      if (!co || co.insolvent) continue;
      cap += co.valuation;
      weighted += co.valuation * (co.sharePrice / Math.max(0.01, co.sharePriceYearAgo) - 1);
    }
    ex.marketCap = cap;
    const breadthReturn = cap > 0 ? weighted / cap : 0;

    const beta = P.marketBeta;
    const macro = avgGrowth(world) * beta;
    const noise = rnd.normal() * P.marketVolatility * 0.004 * Math.sqrt(dt / 86400);
    const drift = macro * 0.1 + breadthReturn * 0.55 + noise;

    ex.index = Math.max(12, ex.index * ann(drift, dt));
    ex.volatility = clamp(ex.volatility + (P.marketVolatility * 10 - ex.volatility) * 0.004 * (dt / SECONDS_PER_YEAR) * 12, 2, 90);
    ex.breadth = clamp(100 * clamp01(0.5 + breadthReturn * 4), 2, 100);
  }

  // --- Sentiment, crashes --------------------------------------------------
  const credit = weightedMean(Object.values(world.countries).filter((c) => !c.overlord && !c.annexedBy).map((c) => c.economy.fiscal.creditRating), Object.values(world.countries).map((c) => c.economy.gdp));
  const targetRisk = clamp(20 + credit * 45 + avgGrowth(world) * 600 - world.globals.worldConflictIndex * 0.22, 0, 100);
  world.markets.riskAppetite = approach(world.markets.riskAppetite, targetRisk, 0.02 * (dt / SECONDS_PER_YEAR) * 12 + 0.00006);
  world.markets.creditSpreads = approach(world.markets.creditSpreads, clamp(0.004 + (1 - credit) * 0.09 + Math.max(0, -avgGrowth(world)) * 0.4, 0.002, 0.9), 0.03 * (dt / SECONDS_PER_YEAR) * 12 + 0.0001);
  world.markets.sentiment = moodFor(world.markets.riskAppetite);

  if (rnd.chance(P.crashProbability * P.eventRate * (dt / 86400))) {
    const worst = Object.values(world.countries)
      .filter((c) => !c.overlord && !c.annexedBy && c.economy.fiscal.creditRating < 0.55)
      .sort((a, b) => a.economy.gdp - b.economy.gdp)[0];
    world.markets.lastCrashAt = world.t;
    world.markets.riskAppetite = Math.max(2, world.markets.riskAppetite * 0.55);
    for (const ex of world.markets.exchanges) ex.index *= rnd.float(0.55, 0.82);
    pushEvent(world, {
      kind: "economic",
      severity: "catastrophic",
      country: worst?.id,
      title: "Global market crash",
      body: `Equities have fallen sharply across every exchange${worst ? `, with ${worst.name}'s credit the weakest link` : ""}. Risk appetite has collapsed.`,
      tags: ["crisis", "markets"],
    });
  }
}

function stepCompany(world: World, co: Company, rnd: Rng, dt: number): void {
  const country = world.countries[co.country];
  const hostCycle = country ? country.economy.gdpGrowth : 0.02;
  const prof = SECTORS[co.sector];
  const sanction = country ? sanctionLoad(world, country) : 0;

  // Revenue follows the host economy, adjusted for the sector's beta.
  const revenueGrowth = hostCycle * (0.5 + prof.cyclicality) + prof.growth * 0.4 - sanction * 0.3 + rnd.normal() * 0.05 * Math.sqrt(dt / 86400);
  co.revenue = Math.max(1e3, co.revenue * ann(revenueGrowth, dt));

  // Costs, margins, and the labour share of them.
  const wagePressure = (country?.economy.labour.wageGrowth ?? 0.02) * (1 + prof.labourIntensity);
  const costGrowth = wagePressure + prof.capitalIntensity * (country?.economy.monetary.inflation ?? 0.02) + 0.01;
  co.costs = Math.max(1e3, co.costs * ann(costGrowth, dt));
  co.profit = co.revenue - co.costs;
  co.employees = Math.max(1, Math.round(co.employees * ann(clamp(revenueGrowth - costGrowth * 0.5, -0.1, 0.1) * 0.5, dt)));

  // R&D compounds into productivity, which shows up as margin, not as magic.
  co.rd = co.revenue * clamp(0.004 + co.researchLevel * 0.06, 0.001, 0.14);
  co.researchLevel = clamp01(co.researchLevel + (co.rd / Math.max(1, co.revenue) - 0.02) * 0.4 * (dt / SECONDS_PER_YEAR) * 12);
  const researchEdge = (co.researchLevel - 0.2) * 0.22;
  co.costs *= 1 - approach(0, Math.max(-0.02, researchEdge * 0.3), 0.01 * (dt / SECONDS_PER_YEAR) * 12 + 0.00002);

  co.brandValue = clamp(co.brandValue * ann(0.02 + revenueGrowth * 0.4, dt), 0, co.revenue * 4);
  co.lobbyingPower = clamp(co.lobbyingPower + (Math.log10(Math.max(10, co.revenue)) - Math.log10(Math.max(10, co.valuation)) * 0.5) * 0.6 * (dt / SECONDS_PER_YEAR) * 12 - 0.2 * (dt / SECONDS_PER_YEAR) * 12, 0, 100);
  co.debt = Math.max(0, co.debt * ann(0.03 + revenueGrowth * 0.2, dt) - Math.max(0, co.profit) * 0.25 * (dt / SECONDS_PER_YEAR));

  // Valuation and share price.
  const multiple = clamp((co.brandValue * 1.4 + co.profit * 9 + co.revenue * 0.8) / Math.max(1, co.revenue), 0.2, 22);
  co.valuation = Math.max(1e5, co.revenue * multiple);
  const previous = co.sharePrice;
  co.sharePrice = Math.max(0.05, co.sharePrice * ann(revenueGrowth * 0.6 + researchEdge * 0.4 + rnd.normal() * 0.06 * Math.sqrt(dt / 86400), dt));
  co.sharePriceYearAgo = co.sharePriceYearAgo || previous;

  if (country?.economy.fiscal.creditRating < 0.3) {
    co.dailyVolume = co.dailyVolume * 0.98;
  }

  // Insolvency is real: assets are sold, staff laid off, the listing delisted.
  if (co.profit < 0 && co.debt > co.revenue * 3.4 && rnd.chance(0.002 * P_eventRate(world))) {
    co.insolvent = true;
    co.listed = false;
    if (country) {
      pushEvent(world, {
        kind: "corporate",
        severity: "major",
        country: co.country,
        title: `${co.name} insolvent`,
        body: `${co.name} has defaulted on its obligations. Trading in its shares has been suspended and ${co.employees.toLocaleString()} jobs are at risk.`,
        tags: ["corporate", "insolvency"],
      });
    }
  }
}

function P_eventRate(world: World): number {
  return world.params.eventRate;
}

function moodFor(risk: number): MarketMood {
  if (risk < 18) return "crash";
  if (risk < 36) return "bearish";
  if (risk < 62) return "neutral";
  if (risk < 82) return "bullish";
  return "euphoric";
}

function avgGrowth(world: World): number {
  let num = 0;
  let den = 0;
  for (const c of Object.values(world.countries)) {
    if (c.overlord || c.annexedBy) continue;
    num += c.economy.gdpGrowth * c.economy.gdp;
    den += c.economy.gdp;
  }
  return den > 0 ? num / den : 0.02;
}

export function avgCountryGrowth(world: World): number {
  return avgGrowth(world);
}

export function sanctionLoad(world: World, c: Country): number {
  let load = 0;
  for (const id of c.sanctions) {
    const s = world.sanctions[id];
    if (s) load += s.scope / 100;
  }
  return clamp(load, 0, 4);
}

export function warLoad(world: World, c: Country): number {
  let load = 0;
  for (const id of c.wars) {
    const w = world.wars[id];
    if (!w || w.endedAt) continue;
    load += 0.035 * (1 - (w.exhaustion[c.id] ?? 0) / 100);
    for (const f of w.fronts) {
      if (f.belligerents.includes(c.id)) load += 0.012 * Math.abs(f.control) / 100;
    }
  }
  return -clamp(load, 0, 0.3);
}

export { recomputeGlobals, SECONDS_PER_YEAR };