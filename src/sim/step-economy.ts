import type { Company, Country, MarketMood, SectorId, SectorState, World } from "../shared/types";
import { SECTORS } from "../data/economy";
import { indexCompanies } from "./firms";
import { incomeShares, pushEvent, recomputeGlobals, taxCollected } from "./bootstrap";

import { Rng, approach, clamp, clamp01 } from "./rng";

/**
 * The economy, stepped once per simulated week.
 *
 * MACRO. A small structural model of the kind central banks run:
 *   supply   potential = A * K^0.35 * L^0.65, with TFP from catch-up, institutions,
 *            education, science and infrastructure, and capital from real investment
 *   demand   an IS curve: the output gap chases fiscal, monetary, credit, confidence,
 *            external and commodity impulses
 *   prices   an expectations-augmented Phillips curve with import pass-through and
 *            commodity shocks; expectations are anchored by central bank credibility
 *   labour   Okun's law around a NAIRU set by labour-market institutions
 *   money    a Taylor rule, or a peg, gold parity or currency union
 *   fiscal   revenue by tax base with compliance falling at high rates, spending by
 *            department, automatic stabilisers, a debt stock repriced as it rolls over
 *   external real exchange rate, trade balance, current account, reserves, NFA
 *   finance  a credit cycle with non-performing loans and banking crises
 *
 * MICRO. Below that sit real markets:
 *   sectors    17 per country, each with capacity, demand from income elasticities and
 *              government budgets, a clearing price, employment, wages, margins
 *   households three income classes each paying their own price basket, so food and
 *              energy inflation hits the poor hardest and shows up in approval
 *   firms      revenue from their sector's market, wages, interest, tax, earnings, and
 *              a share price set from earnings, rates and risk appetite
 *   commodities global supply and demand, disrupted by wars and embargoes
 *
 * The accounts always satisfy Y = C + I + G + X - M.
 */

export const SECONDS_PER_YEAR = 365 * 86400;
const WEEK_YEARS = 7 / 365;

/** Income elasticity of demand: why agriculture shrinks as countries get richer. */
const INCOME_ELASTICITY: Record<SectorId, number> = {
  agriculture: 0.45, mining: 0.8, manufacturing: 0.95, energy: 0.9, utilities: 0.9, construction: 1.1, transport: 1.05, retail: 1, finance: 1.3, "real-estate": 1.05, telecom: 1.35, technology: 1.7, healthcare: 1.35, education: 1.15, defence: 0.6, tourism: 1.4, media: 1.1,
};

const PRICE_ELASTICITY: Record<SectorId, number> = {
  agriculture: 0.3, mining: 0.4, manufacturing: 1, energy: 0.3, utilities: 0.2, construction: 0.8, transport: 0.7, retail: 1, finance: 0.6, "real-estate": 0.5, telecom: 0.6, technology: 1.2, healthcare: 0.2, education: 0.3, defence: 0.1, tourism: 1.4, media: 0.8,
};

/** Consumer baskets per income class, so price shocks are felt unequally. */
const BASKET: Record<"working" | "middle" | "wealthy", Partial<Record<SectorId, number>>> = {
  working: { agriculture: 0.3, energy: 0.1, utilities: 0.06, "real-estate": 0.2, retail: 0.15, transport: 0.08, healthcare: 0.05, manufacturing: 0.06 },
  middle: { agriculture: 0.14, energy: 0.07, utilities: 0.04, "real-estate": 0.24, retail: 0.17, transport: 0.08, healthcare: 0.08, manufacturing: 0.08, education: 0.04, technology: 0.03, tourism: 0.03 },
  wealthy: { agriculture: 0.07, energy: 0.04, utilities: 0.02, "real-estate": 0.28, retail: 0.14, transport: 0.05, healthcare: 0.08, manufacturing: 0.06, education: 0.05, technology: 0.06, finance: 0.08, tourism: 0.07 },
};

/** Government budget lines that buy directly from a sector. */
const BUDGET_DEMAND: Partial<Record<SectorId, "defence" | "health" | "education" | "infrastructure">> = {
  defence: "defence", healthcare: "health", education: "education", construction: "infrastructure",
};

export function stepEconomy(world: World, rnd: Rng): void {
  stepCommodities(world, rnd);
  const us = world.countries.USA;
  const anchorRate = us?.economy.monetary.policyRate ?? 0.03;
  const anchorInflation = us?.economy.monetary.inflation ?? 0.02;
  const union = world.countries.DEU?.economy.monetary.policyRate ?? 0.02;

  // Build the company index once: firms founded in play feed their sector output.
  const byCountry = indexCompanies(world);
  const valueAdded: Record<string, number> = {};
  const sectorOutput: Record<string, Map<SectorId, number>> = {};
  for (const [id, list] of byCountry) {
    let va = 0;
    const bySector = new Map<SectorId, number>();
    for (const co of list) {
      if (co.insolvent || co.founded < 0) continue;
      va += co.revenue * 0.35;
      bySector.set(co.sector, (bySector.get(co.sector) ?? 0) + co.revenue);
    }
    valueAdded[id] = va;
    sectorOutput[id] = bySector;
  }
  for (const c of Object.values(world.countries)) {
    if (c.annexedBy) continue;
    stepMacro(world, c, rnd, anchorRate, anchorInflation, union, valueAdded[c.id] ?? 0);
    stepSectors(world, c, sectorOutput[c.id]);
    stepHouseholds(c);
  }
  stepCompanies(world, rnd);
  stepExchanges(world, rnd);
  stepRisk(world, rnd);
  recomputeGlobals(world);
}

// ===========================================================================
// Macro
// ===========================================================================

function stepMacro(world: World, c: Country, rnd: Rng, anchorRate: number, anchorInflation: number, unionRate: number, firmValueAdded = 0): void {
  const e = c.economy;
  const m = e.macro;
  const f = e.fiscal;
  const P = world.params;
  const dt = WEEK_YEARS;
  const cb = e.centralBank;
  const tax = e.tax;
  const budget = e.budget;
  const lastNominal = e.gdp;

  // ---- 1. Supply ----------------------------------------------------------
  const frontier = frontierPc(world);
  const relIncome = clamp(e.gdpPerCapita / Math.max(1, frontier), 0.003, 1.4);
  const institutions = clamp01(1 - e.corruption);
  const base = m.baseBudget;
  const lever = (cur: number, ref: number, weight: number, cap: number) => clamp(weight * (cur / Math.max(1e-4, ref) - 1), -cap, cap);
  const tfpFromPolicy = lever(budget.education, base.education, 0.006, 0.01) + lever(budget.science, base.science, 0.006, 0.012) + lever(budget.infrastructure, base.infrastructure, 0.005, 0.008) +
    (c.tech?.industry ?? 0) * 0.004;
  // Conditional convergence: poor countries catch up only if institutions let them.
  const catchUp = clamp(-Math.log(relIncome) * 0.006 * institutions * institutions * 1.4, 0, 0.035);
  const avgRegulation = e.sectors.reduce((a, s) => a + s.regulation * s.share, 0);
  const stateDrag = e.sectors.reduce((a, s) => a + s.stateOwnership * s.share, 0) * 0.004;
  const warDamage = warLoad(world, c);
  const sanctions = sanctionLoad(world, c) * P.sanctionBite * 0.025;
  const eraFrontier = frontierGrowth(world);
  m.tfpGrowth = eraFrontier * 0.65 + catchUp + tfpFromPolicy - e.corruption * P.corruptionDrag * 0.02 - e.inequality * P.inequalityDrag * 0.012 - (avgRegulation - 0.3) * 0.01 - stateDrag - sanctions - warDamage * 0.5;

  const pop = e.population;
  const avgLabourTax = tax.income + tax.payroll;
  const participationTarget = clamp(0.42 + relIncome * 0.12 + (world.startDate.year >= 1990 ? 0.04 : 0) - Math.max(0, avgLabourTax - 0.3) * 0.12 + e.labour.satisfaction * 0.02, 0.32, 0.72);
  e.labour.participation = approach(e.labour.participation, participationTarget, 0.1 * dt);
  const popGrowth = clamp(m.popGrowth - warDamage * 0.15 + (c.policies.immigration ?? 0) * 0.00005, -0.05, 0.05);
  e.population = Math.max(1000, pop * Math.exp(popGrowth * dt));

  const realInvestment = e.accounts.investment / Math.max(1e-6, m.priceLevel);
  const capitalGrowth = realInvestment / Math.max(1, m.capital) - 0.05;
  m.capital = Math.max(1, m.capital * Math.exp(clamp(capitalGrowth, -0.15, 0.2) * dt));
  m.potentialGrowth = clamp(m.tfpGrowth + 0.35 * capitalGrowth + 0.65 * popGrowth, -0.2, 0.15) * P.growthBias;
  m.potential *= Math.exp(m.potentialGrowth * dt);

  // ---- 2. Interest rates --------------------------------------------------
  m.neutralRate = clamp(0.4 * Math.max(0, m.potentialGrowth) + 0.008, 0.002, 0.05);
  const infl = e.monetary.inflation;
  const taylor = m.neutralRate + cb.target + 1.5 * (infl - cb.target) + 0.35 * m.outputGap;
  let rateTarget: number;
  switch (cb.regime) {
    case "union":
      rateTarget = c.id === "DEU" ? taylor : unionRate;
      break;
    case "peg":
      rateTarget = c.id === "USA" ? taylor : anchorRate + Math.max(0, 0.02 - e.reserves / Math.max(1, e.accounts.imports) * 0.05) + e.corruption * 0.02;
      break;
    case "gold":
      // Defend the parity: rates follow reserves, not the domestic economy.
      rateTarget = 0.02 + Math.max(0, 0.05 - e.reserves / Math.max(1, e.gdp)) * 0.2 + e.corruption * 0.02;
      break;
    case "command":
      rateTarget = c.id === world.playerCountry ? e.monetary.centralBankRate : taylor;
      break;
    default:
      rateTarget = cb.independent || c.id !== world.playerCountry ? taylor - (cb.independent ? 0 : 0.005) : e.monetary.centralBankRate;
  }
  if (c.id === world.playerCountry && !cb.independent && cb.regime !== "union") rateTarget = e.monetary.centralBankRate;
  rateTarget = clamp(rateTarget, -0.01, 40);
  const speed = P.policyRateSmoothing * 18 * dt + (Math.abs(rateTarget - e.monetary.policyRate) > 0.1 ? 0.1 : 0);
  e.monetary.policyRate = approach(e.monetary.policyRate, rateTarget, speed);
  if (cb.independent || cb.regime !== "float") e.monetary.centralBankRate = e.monetary.policyRate;

  const nextNominalEstimate = Math.max(1, (m.realGdp * m.priceLevel) / e.monetary.exchangeRateVsUsd);
  const debtRatio = f.debt / nextNominalEstimate;
  const deficitRatio = -f.budgetBalanceRatio;
  const reserveBonus = RESERVE_DISCOUNT[c.id] ?? 0;
  m.riskPremium = clamp(
    Math.max(0, debtRatio - 0.6) * 0.0055 * (1 + debtRatio) * (1 - clamp01(reserveBonus * 40)) * (1.4 - clamp01(relIncome)) +
      Math.max(0, deficitRatio - 0.03) * 0.25 +
      Math.max(0, infl - 0.08) * 0.35 +
      e.corruption * 0.035 +
      world.markets.creditSpreads * 0.2 +
      sanctionLoad(world, c) * 0.01 +
      (m.defaulted ? 0.08 : 0) -
      reserveBonus,
    -0.01,
    0.9,
  );
  m.bondYield = clamp(Math.max(0, 0.5 * e.monetary.policyRate + 0.5 * (m.neutralRate + m.expectedInflation)) + 0.008 + m.riskPremium - cb.qe * 0.01, 0, 40);
  m.debtCost = approach(m.debtCost, m.bondYield, dt / 6);
  f.creditRating = clamp(0.95 - m.riskPremium * 7, 0.02, 0.99);
  e.debtRatingScore = f.creditRating * 100;
  world.markets.creditSpreads = world.markets.creditSpreads || 0.01;

  // ---- 3. Demand ----------------------------------------------------------
  const realRate = e.monetary.policyRate - m.expectedInflation;
  const longReal = m.bondYield - m.expectedInflation;
  const monetary = -0.45 * (0.5 * (realRate - m.neutralRate) + 0.5 * (longReal - m.neutralRate - 0.012));
  const fiscalImpulse = (P.fiscalMultiplier * 0.45) * (deficitRatio - m.deficitAnchor);
  m.deficitAnchor = approach(m.deficitAnchor, deficitRatio, 0.3 * dt);

  const creditImpulse = clamp((m.credit / Math.max(0.05, creditTrend(world, c)) - 1) * 0.04, -0.03, 0.03);
  const stress = Math.max(0, m.npl - 0.08) * -0.25;
  const confidence = ((m.consumerConfidence - 50) / 50) * 0.008 + ((m.businessConfidence - 50) / 50) * 0.008;
  const riskCycle = ((world.markets.riskAppetite - 50) / 50) * 0.008;
  const externalDemand = tradePartnersGap(world, c) * clamp(m.openness * 0.45, 0, 0.6);
  const exportDrag = -m.realExchange * clamp(m.openness * 0.18, 0, 0.3);
  const oilRatio = world.markets.commodityPrices.oil / Math.max(1e-6, world.commodityMarkets.oil?.trend ?? 1);
  const resourceShare = sectorShare(e.sectors, "mining") + sectorShare(e.sectors, "energy") * 0.5;
  const termsOfTrade = (oilRatio - 1) * (resourceShare - 0.06) * 0.15;
  const warFooting = warDamage > 0 ? Math.min(0.03, budget.defence * 0.1) : 0;
  const tradePolicy = -Math.max(0, tax.tariff - 0.08) * clamp(m.openness, 0, 1) * 0.08;

  m.shock *= Math.exp(-m.shockDecay * dt);
  const gapTarget = clamp(monetary + fiscalImpulse + creditImpulse + stress + confidence + riskCycle + externalDemand + exportDrag + termsOfTrade + warFooting + tradePolicy + m.shock - warDamage * 0.8 - sanctions * 1.2, -0.45, 0.15);
  const volatility = (world.params.marketVolatility * 0.0035 + Math.min(0.006, e.corruption * 0.004)) * Math.sqrt(dt);
  m.outputGap = clamp(m.outputGap + 3.2 * (gapTarget - m.outputGap) * dt + rnd.normal() * volatility * 2.6, -0.55, 0.2);
  m.realGdp = Math.max(1, m.potential * (1 + m.outputGap));

  // ---- 4. Prices ----------------------------------------------------------
  const kappa = P.phillipsSensitivity;
  const printing = cb.printing * Math.max(0, deficitRatio) * 7;
  const creditMoney = clamp((m.credit / Math.max(0.05, creditTrend(world, c)) - 1) * 0.02, -0.01, 0.04);
  const fxPassThrough = clamp((m.lastDepreciation ?? 0) - m.expectedInflation * 0.5, -0.5, 20) * clamp(m.openness * 0.3, 0.03, 0.4);
  const oilPush = clamp(oilRatio - 1, -0.6, 2) * 0.012;
  const foodPush = clamp((world.markets.commodityPrices.wheat / Math.max(1e-6, world.commodityMarkets.wheat?.trend ?? 1)) - 1, -0.6, 2) * 0.008;
  const tariffPush = Math.max(0, tax.tariff - 0.05) * clamp(m.openness, 0, 1) * 0.04;
  const warPrices = warDamage > 0 ? Math.min(0.02, warDamage * 0.4) : 0;
  const piStar = m.expectedInflation + kappa * m.outputGap + fxPassThrough + oilPush + foodPush + tariffPush + printing + creditMoney + warPrices;
  e.monetary.inflation = clamp(e.monetary.inflation + 3.5 * (piStar - e.monetary.inflation) * dt + rnd.normal() * 0.012 * Math.sqrt(dt) * (1 + Math.abs(infl) * 3), -0.2, 30);
  // A fixed exchange rate imports the anchor country's prices; a free float has to earn it.
  const fixed = cb.regime === "peg" || cb.regime === "gold" || cb.regime === "union";
  const anchorTarget = cb.regime === "gold" ? 0 : fixed ? anchorInflation : cb.target;
  const trust = fixed ? Math.max(cb.credibility, 0.85) : cb.credibility;
  const anchored = trust * anchorTarget + (1 - trust) * e.monetary.inflation;
  m.expectedInflation = approach(m.expectedInflation, anchored, 1.1 * dt);
  const credibilityTarget = clamp((cb.independent ? 0.85 : 0.45) + (cb.regime === "gold" || cb.regime === "union" ? 0.1 : 0) - Math.abs(e.monetary.inflation - cb.target) * 2.5 - cb.printing * 0.9 - e.corruption * 0.15, 0.01, 0.97);
  cb.credibility = approach(cb.credibility, credibilityTarget, 0.5 * dt);
  m.priceLevel *= Math.exp(clamp(e.monetary.inflation, -0.5, 80) * dt);
  e.monetary.currencyConfidence = approach(e.monetary.currencyConfidence, clamp(70 + m.realExchange * -10 - Math.max(0, infl - 0.05) * 80 - m.riskPremium * 150, 1, 99), 0.5 * dt);
  e.monetary.moneySupply *= Math.exp(clamp(e.monetary.inflation + m.potentialGrowth + printing, -0.3, 40) * dt);

  // ---- 5. Output, labour, wages -------------------------------------------
  // All reported money is in US dollars at market exchange rates.
  const nominal = Math.max(1, (m.realGdp * m.priceLevel) / e.monetary.exchangeRateVsUsd);
  e.gdp = nominal + firmValueAdded;
  e.gdpPerCapita = nominal / Math.max(1, e.population);
  e.productivity = clamp(e.productivity + m.tfpGrowth * 30 * dt, 1, 100);

  m.realHistory.push(m.realGdp);
  m.priceHistory.push(m.priceLevel);
  if (m.realHistory.length > 53) m.realHistory.shift();
  if (m.priceHistory.length > 53) m.priceHistory.shift();
  const hist = m.realHistory;
  if (hist.length >= 53) {
    e.gdpGrowth = clamp(hist[hist.length - 1] / hist[0] - 1, -0.7, 0.6);
  } else {
    // Until a full year of data exists, blend the opening figure with the run rate.
    const runRate = hist.length > 8 ? Math.pow(hist[hist.length - 1] / hist[0], 52 / (hist.length - 1)) - 1 : e.gdpGrowth;
    e.gdpGrowth = clamp(approach(e.gdpGrowth, runRate, 0.03), -0.7, 0.6);
  }
  e.nominalGrowth = ((1 + e.gdpGrowth) * (1 + e.monetary.inflation)) / Math.exp(clamp(m.lastDepreciation ?? 0, -0.5, 10)) - 1;

  const unions = e.labour.unionisation;
  const generosity = budget.welfare / Math.max(0.005, base.welfare);
  const nairuTarget = clamp(baseNairu(world, c) + Math.max(0, m.minimumWage - 0.55) * 0.12 + Math.max(0, unions - 0.4) * 0.02 + Math.max(0, generosity - 1) * 0.008 + avgRegulation * 0.01 - lever(budget.education, base.education, 0.004, 0.01), 0.012, 0.3);
  m.nairu = approach(m.nairu, nairuTarget, 0.08 * dt);
  const uTarget = clamp(m.nairu - P.okunSensitivity * m.outputGap, 0.005, 0.6);
  e.labour.unemployment = clamp(e.labour.unemployment + 2.2 * (uTarget - e.labour.unemployment) * dt, 0.005, 0.6);
  const wagePhillips = m.expectedInflation + Math.max(-0.02, m.tfpGrowth) + 0.35 * (m.nairu - e.labour.unemployment) + P.wagePush * 0.02 * unions;
  const wageGrowth = clamp(approach(e.labour.wageGrowth, wagePhillips, 1.2 * dt), -0.3, 60);
  e.labour.wageGrowth = wageGrowth;
  e.labour.medianWage = Math.max(1, e.labour.medianWage * Math.exp(wageGrowth * dt));
  // Median wages cannot drift away from output forever.
  e.labour.medianWage = approach(e.labour.medianWage, e.gdpPerCapita * 0.74 * (1 - (e.inequality - 0.35) * 0.3), 0.4 * dt);
  e.labour.unionisation = clamp01(e.labour.unionisation + (c.policies.labour ?? 0) * 0.00002 * dt * 52);

  // ---- 6. Fiscal accounts --------------------------------------------------
  const potentialNominal = (m.potential * m.priceLevel) / e.monetary.exchangeRateVsUsd;
  const accountsC = e.accounts.consumption * (nominal / Math.max(1, lastNominal));
  const resourceOutput = e.sectors.find((s) => s.id === "mining")?.output ?? 0;
  const collected = taxCollected(tax, nominal, accountsC, e.accounts.imports, resourceOutput, e.corruption);
  f.taxIncome = collected.income + collected.payroll;
  f.corporateTax = collected.corporate;
  f.vat = collected.vat;
  f.tariffs = collected.tariff;
  f.resourceRent = collected.royalty;
  f.revenue = f.taxIncome + f.corporateTax + f.vat + f.tariffs + f.resourceRent;

  const benefits = Math.max(0, e.labour.unemployment - m.nairu) * nominal * 0.25 * clamp(budget.welfare / Math.max(0.01, 0.1), 0.05, 1.3);
  f.military = budget.defence * potentialNominal;
  f.welfare = budget.welfare * potentialNominal + benefits;
  f.healthcare = budget.health * potentialNominal;
  f.education = budget.education * potentialNominal;
  f.infrastructure = budget.infrastructure * potentialNominal;
  f.administration = budget.administration * potentialNominal;
  const science = budget.science * potentialNominal;
  const subsidies = budget.subsidies * potentialNominal + e.sectors.reduce((a, s) => a + s.stateSubsidy * s.output, 0);
  const warBill = c.wars.length ? Math.min(0.2, 0.02 * c.wars.length) * potentialNominal : 0;
  // Interest is charged at a capped rate. A broken state can be quoted an
  // impossible yield, but the stock itself never compounds faster than this,
  // which is what used to send debt-to-GDP into the quadrillions.
  const serviceRate = Math.min(Math.max(0, m.debtCost), 0.18);
  f.debtService = f.debt * serviceRate;
  const spending = f.military + f.welfare + f.healthcare + f.education + f.infrastructure + f.administration + science + subsidies + warBill;
  f.expenditure = spending + f.debtService;
  const balance = f.revenue - f.expenditure;
  f.budgetBalanceRatio = clamp(balance / nominal, -0.8, 0.6);

  const monetised = balance < 0 ? -balance * cb.printing : 0;
  f.debt = Math.max(0, f.debt + (-balance - monetised) * dt);
  f.debtToGdp = f.debt / nominal;
  f.treasury = approach(f.treasury, nominal * 0.02, 0.2 * dt) + balance * 0.01 * dt;
  e.rd = science + nominal * 0.004 + e.sectors.reduce((a, s) => a + s.output * SECTORS[s.id].techIntensity * 0.01, 0);

  const crisisLine = 2.2 + (RESERVE_DISCOUNT[c.id] ?? 0) * 300;
  if (!m.defaulted && (f.debtToGdp > crisisLine || (m.bondYield > 0.35 && f.debtService > f.revenue * 0.5))) {
    sovereignCrisis(world, c, rnd);
  }
  // Serial restructuring. A default only reopens the market once the paper is
  // back inside the line; while the ratio is still absurd, creditors take
  // further haircuts rather than the stock compounding forever.
  if (m.defaulted && f.debtToGdp > crisisLine * 1.6) {
    e.fiscal.debt *= 0.5;
    f.debtToGdp = f.debt / nominal;
  }
  if (m.defaulted && f.debtToGdp < crisisLine && m.riskPremium < 0.12 && rnd.chance(dt * 1.2)) m.defaulted = false;

  // ---- 7. External accounts -----------------------------------------------
  const barriers = c.tradeBarriers ? Object.values(c.tradeBarriers).reduce((a, b) => a + b, 0) : 0;
  const warOpen = warDamage > 0 ? 0.8 : 1;
  const openness = clamp(m.openness * (1 - Math.max(0, tax.tariff - 0.05) * 0.7) * (1 - Math.min(0.5, barriers * 0.04)) * (1 - Math.min(0.6, sanctionLoad(world, c) * 0.3)) * warOpen, 0.01, 2.5);
  const nx = clamp(m.structuralTradeBalance - m.realExchange * openness * 0.5 - m.outputGap * openness * 0.5 + (oilRatio - 1) * (resourceShare - 0.06) * 0.25, -openness * 0.8, openness * 0.8);
  e.accounts.exports = (nominal * (openness + nx)) / 2;
  e.accounts.imports = (nominal * (openness - nx)) / 2;
  const trade = e.trade;
  trade.exports = e.accounts.exports;
  trade.imports = e.accounts.imports;
  trade.tradeBalance = trade.exports - trade.imports;
  trade.tradeOpenness = openness * 100;
  trade.tariffRate = tax.tariff;
  const scale = (trade.exports + trade.imports) / Math.max(1, Object.values(trade.flows).reduce((a, b) => a + b, 0));
  for (const k of Object.keys(trade.flows)) trade.flows[k] *= scale;

  const income = e.netForeignAssets * 0.02;
  m.currentAccount = trade.tradeBalance + income;
  e.netForeignAssets += m.currentAccount * dt;

  const inflationGap = e.monetary.inflation - anchorInflation;
  const carry = (e.monetary.policyRate - e.monetary.inflation) - (anchorRate - anchorInflation);
  let depreciation = 0;
  if (cb.regime === "float" || cb.regime === "command") {
    depreciation = c.id === "USA" ? 0 : clamp(inflationGap - clamp(carry * 0.35, -0.08, 0.08) - (m.currentAccount / nominal) * 0.25 + m.riskPremium * 0.2 + m.realExchange * 0.6 + rnd.normal() * 0.35, -0.6, 40);
    e.monetary.exchangeRateVsUsd = clamp(e.monetary.exchangeRateVsUsd * Math.exp(depreciation * dt), 1e-9, 1e18);
    // Debt is issued in local currency, so a weaker currency shrinks its dollar value.
    f.debt *= Math.exp(-depreciation * dt);
    e.reserves = clamp(e.reserves + m.currentAccount * 0.08 * dt, 0, nominal * 3);
  } else if (cb.regime === "union") {
    const de = world.countries.DEU;
    if (de) e.monetary.exchangeRateVsUsd = de.economy.monetary.exchangeRateVsUsd;
    e.reserves = clamp(e.reserves + m.currentAccount * 0.02 * dt, 0, nominal * 3);
  } else {
    // Fixed rates: reserves take the strain until the peg breaks.
    e.reserves = Math.max(0, e.reserves + m.currentAccount * dt * 0.85 + (carry - m.riskPremium) * nominal * 0.1 * dt);
    if (e.reserves < e.accounts.imports * 0.08 && rnd.chance(dt * 4)) {
      const cut = rnd.float(0.15, 0.4);
      e.monetary.exchangeRateVsUsd *= 1 + cut;
      f.debt /= 1 + cut;
      depreciation = cut / dt;
      e.reserves = e.accounts.imports * 0.3;
      if (world.startDate.year >= 1950 || c.id === world.playerCountry) {
        pushEvent(world, { kind: "economic", severity: "major", country: c.id, title: `${c.name} devalues its currency`, body: `Reserves ran out defending the ${cb.regime === "gold" ? "gold parity" : "peg"}. The currency falls ${(cut * 100).toFixed(0)}%.`, tags: ["crisis", "currency"] });
      }
      if (cb.regime === "gold") cb.regime = "float";
    }
  }
  m.lastDepreciation = depreciation;
  // Redenominate once the numbers get silly: new money, same prices in real terms.
  if (e.monetary.exchangeRateVsUsd > 1e6 || m.priceLevel > 1e6) {
    const zeros = Math.max(e.monetary.exchangeRateVsUsd, m.priceLevel, 1);
    e.monetary.exchangeRateVsUsd /= zeros;
    m.priceLevel /= zeros;
    m.priceHistory = m.priceHistory.map((v) => v / zeros);
    for (const h of e.households) h.costOfLiving /= zeros;
    if (c.id === world.playerCountry || e.gdp / Math.max(1, world.globals.globalGdp) > 0.003) {
      pushEvent(world, { kind: "economic", severity: "notice", country: c.id, title: `${c.name} introduces a new currency`, body: "Zeros are knocked off the old money. Nothing real has changed.", tags: ["currency"] });
    }
  }
  m.realExchange = clamp((m.realExchange + (inflationGap - depreciation) * dt) * (1 - 0.12 * dt), -1.2, 1.2);

  // ---- 8. Credit and asset prices -----------------------------------------
  const creditGrowth = 0.015 + (e.gdpGrowth) * 0.8 - 1.4 * (realRate - m.neutralRate) + ((world.markets.riskAppetite - 50) / 50) * 0.03 + (m.credit < creditTrend(world, c) ? 0.015 : -0.015);
  m.credit = clamp(m.credit * Math.exp(clamp(creditGrowth - e.nominalGrowth * 0.5, -0.3, 0.3) * dt), 0.02, 4);
  const nplTarget = clamp(0.025 + Math.max(0, -m.outputGap) * 0.6 + Math.max(0, m.credit / creditTrend(world, c) - 1.15) * 0.1 + Math.max(0, realRate - 0.05) * 0.2, 0.01, 0.5);
  m.npl = approach(m.npl, nplTarget, 0.9 * dt);
  if (m.npl > 0.13 && rnd.chance(dt * 0.9 * world.params.eventRate)) bankingCrisis(world, c);
  m.housePrice = clamp(m.housePrice * Math.exp(clamp(e.monetary.inflation + m.outputGap * 0.6 - (realRate - m.neutralRate) * 1.8 + (m.housePrice > 170 ? -0.03 : 0), -0.25, 3) * dt), 10, 1e7);

  m.consumerConfidence = approach(m.consumerConfidence, clamp(52 + m.outputGap * 320 - (e.labour.unemployment - m.nairu) * 380 - Math.max(0, e.monetary.inflation - 0.04) * 130 - warDamage * 180, 2, 98), 1.4 * dt);
  m.businessConfidence = approach(m.businessConfidence, clamp(52 + m.outputGap * 340 - (m.bondYield - 0.04) * 90 - Math.max(0, tax.corporate - 0.3) * 80 + ((world.markets.riskAppetite - 50) / 50) * 15 - warDamage * 120, 2, 98), 1.4 * dt);

  // ---- 9. National accounts identity --------------------------------------
  const G = f.military + f.healthcare + f.education + f.infrastructure + f.administration + science;
  const opportunity = 0.14 + clamp(relIncome, 0, 1) * 0.06 + Math.max(0, m.potentialGrowth) * 1.2;
  const invRate = clamp(opportunity + 0.5 * m.outputGap - 0.55 * (longReal - m.neutralRate) + ((m.businessConfidence - 50) / 50) * 0.03 - Math.max(0, tax.corporate - 0.25) * 0.1 + e.sectors.reduce((a, s) => a + s.stateOwnership * s.share, 0) * 0.06, 0.03, 0.48);
  const I0 = nominal * invRate;
  const X = e.accounts.exports;
  const M = e.accounts.imports;
  const C0 = nominal - I0 - G - X + M;
  const floorC = nominal * 0.28;
  const C = Math.max(floorC, C0);
  e.accounts.consumption = C;
  e.accounts.investment = Math.max(nominal * 0.015, I0 - (C - C0));
  e.accounts.government = nominal - e.accounts.consumption - e.accounts.investment - X + M;

  // ---- 10. Slow structural drift -------------------------------------------
  const justice = c.policies.justice ?? 0;
  e.corruption = clamp01(e.corruption + (P.corruptionRate * 2 - (justice + 40) * 0.00005 - budget.administration * 0.01) * dt);
  const inequalityTarget = clamp(0.42 - budget.welfare * 0.6 - tax.income * 0.12 - e.labour.unionisation * 0.06 - m.minimumWage * 0.03 + e.corruption * 0.1 + (world.startDate.year < 1950 ? 0.08 : 0), 0.18, 0.75);
  e.inequality = approach(e.inequality, inequalityTarget, 0.06 * dt);
}

const RESERVE_DISCOUNT: Record<string, number> = { USA: 0.012, DEU: 0.006, CHE: 0.008, JPN: 0.008, GBR: 0.003, FRA: 0.002, NLD: 0.003, CHN: 0.003 };

function baseNairu(world: World, c: Country): number {
  const y = world.startDate.year;
  const rich = Math.min(1, c.economy.gdpPerCapita / Math.max(1, frontierPc(world)));
  return clamp((y < 1950 ? 0.035 : y < 1990 ? 0.035 : 0.045) + (1 - rich) * 0.035 + c.economy.corruption * 0.02, 0.015, 0.2);
}

function frontierGrowth(world: World): number {
  const y = world.startDate.year;
  const elapsed = world.t / SECONDS_PER_YEAR;
  const cur = y + elapsed;
  return cur < 1920 ? 0.012 : cur < 1945 ? 0.014 : cur < 1975 ? 0.026 : cur < 2005 ? 0.018 : 0.014;
}

let frontierCache: { v: number; at: number } = { v: 1, at: -1 };
function frontierPc(world: World): number {
  if (frontierCache.at === world.dayCount && frontierCache.v > 1) return frontierCache.v;
  let best = 0;
  for (const c of Object.values(world.countries)) {
    // Only large economies set the frontier: oil sheikhdoms and tax havens do not.
    if (c.annexedBy || c.economy.population < 2e7) continue;
    if (c.economy.gdpPerCapita > best) best = c.economy.gdpPerCapita;
  }
  frontierCache = { v: best || 1, at: world.dayCount };
  return frontierCache.v;
}

function creditTrend(world: World, c: Country): number {
  const y = world.startDate.year;
  const base = y < 1950 ? 0.55 : y < 1990 ? 0.45 : y < 2010 ? 0.75 : 0.95;
  return base * clamp(0.4 + c.economy.gdpPerCapita / Math.max(1, frontierPc(world)), 0.3, 1.7);
}

function sectorShare(sectors: SectorState[], id: SectorId): number {
  return sectors.find((s) => s.id === id)?.share ?? 0;
}

function tradePartnersGap(world: World, c: Country): number {
  const flows = c.economy.trade.flows;
  let weighted = 0;
  let total = 0;
  for (const [id, v] of Object.entries(flows)) {
    const p = world.countries[id];
    if (!p || p.annexedBy) continue;
    const barrier = c.tradeBarriers?.[id] ?? 0;
    weighted += p.economy.macro.outputGap * v * (1 - clamp01(barrier));
    total += v;
  }
  return total > 0 ? weighted / total : 0;
}

function sovereignCrisis(world: World, c: Country, rnd: Rng): void {
  const e = c.economy;
  const m = e.macro;
  m.defaulted = true;
  const haircut = rnd.float(0.25, 0.55);
  e.fiscal.debt *= 1 - haircut;
  m.shock -= 0.07;
  m.shockDecay = 0.8;
  m.npl += 0.05;
  e.monetary.exchangeRateVsUsd *= 1.3;
  m.expectedInflation += 0.04;
  e.fiscal.debt /= 1.3;
  c.executive.approval = clamp(c.executive.approval - 14, 0, 100);
  c.cohesion = clamp(c.cohesion - 8, 0, 100);
  pushEvent(world, { kind: "economic", severity: "catastrophic", country: c.id, title: `${c.name} defaults on its sovereign debt`, body: `Markets stopped rolling the paper. Creditors take a ${(haircut * 100).toFixed(0)}% haircut and the economy is thrown into recession.`, tags: ["crisis", "debt"] });
}

function bankingCrisis(world: World, c: Country): void {
  const e = c.economy;
  const m = e.macro;
  m.shock -= 0.045;
  m.shockDecay = 0.7;
  m.credit *= 0.86;
  m.npl *= 0.7;
  e.fiscal.debt += e.gdp * 0.04;
  world.markets.riskAppetite = clamp(world.markets.riskAppetite - (e.gdp / Math.max(1, world.globals.globalGdp)) * 60, 2, 100);
  pushEvent(world, { kind: "economic", severity: "major", country: c.id, title: `Banking crisis in ${c.name}`, body: `Bad loans hit ${(m.npl * 143).toFixed(0)}% of lending. The state recapitalises the banks at a cost of ${(4).toFixed(0)}% of GDP.`, tags: ["crisis", "banks"] });
}

// ===========================================================================
// Sector markets
// ===========================================================================

function stepSectors(world: World, c: Country, firmOutput?: Map<import("../shared/types").SectorId, number>): void {
  const e = c.economy;
  const m = e.macro;
  const dt = WEEK_YEARS;
  const growth = (m.realHistory.length >= 2 ? Math.log(m.realHistory[m.realHistory.length - 1] / m.realHistory[m.realHistory.length - 2]) / dt : 0);
  const popG = m.popGrowth;
  const avgPrice = e.sectors.reduce((a, s) => a + s.price * s.share, 0) || 1;
  const pcGrowth = growth - popG;
  const potential = m.potentialGrowth;
  const oil = world.markets.commodityPrices.oil / Math.max(1e-6, world.commodityMarkets.oil?.trend ?? 1);
  const wheat = world.markets.commodityPrices.wheat / Math.max(1e-6, world.commodityMarkets.wheat?.trend ?? 1);
  const metals = world.markets.commodityPrices.copper / Math.max(1e-6, world.commodityMarkets.copper?.trend ?? 1);

  let totalOutput = 0;
  for (const s of e.sectors) {
    const prof = SECTORS[s.id];
    // Demand.
    const relPrice = s.price / avgPrice;
    let demandGrowth = popG + INCOME_ELASTICITY[s.id] * pcGrowth;
    const budgetLine = BUDGET_DEMAND[s.id];
    if (budgetLine) demandGrowth += clamp((e.budget[budgetLine] / Math.max(1e-4, m.baseBudget[budgetLine]) - 1) * 0.25, -0.15, 0.25);
    if (s.id === "defence" && c.wars.length) demandGrowth += 0.05;
    if (s.id === "tourism") demandGrowth += (m.shock < -0.03 ? -0.4 : 0) + (c.wars.length ? -0.15 : 0);
    if (s.id === "construction" || s.id === "real-estate") demandGrowth += -(m.bondYield - m.expectedInflation - m.neutralRate - 0.012) * 1.2;
    if (s.id === "finance") demandGrowth += (m.credit / Math.max(0.05, creditTrend(world, c)) - 1) * 0.1;
    const demand = s.quantity * Math.exp((demandGrowth * dt) - PRICE_ELASTICITY[s.id] * Math.log(Math.max(0.05, relPrice)) * 0.04 * dt);

    // Supply: sector TFP plus capital chasing profitable markets.
    const tfp = (prof.growth * 0.4 + m.tfpGrowth * 0.4) * (0.5 + prof.techIntensity * 0.9) + (s.stateSubsidy * 0.05) - (s.regulation - 0.3) * 0.012 - s.stateOwnership * 0.004;
    const investmentPull = clamp((s.margin - prof.margin) * 0.8 + (s.quantity / Math.max(1, s.capacity) - 0.95) * 0.5, -0.05, 0.08);
    s.capacity = Math.max(1, s.capacity * Math.exp((potential * 0.8 + tfp * 0.35 + investmentPull) * dt));

    // Market clearing: output is limited by the short side, the price takes the rest.
    const q = Math.min(demand, s.capacity * 1.06);
    const excess = Math.log(Math.max(1e-6, demand) / Math.max(1e-6, s.capacity));
    const inputs = (s.id === "agriculture" ? (wheat - 1) * 0.15 : 0) + (s.id === "mining" ? (metals - 1) * 0.15 : 0) + (s.id === "energy" || s.id === "utilities" ? (oil - 1) * 0.2 : (oil - 1) * prof.commodityExposure * 0.03);
    const markupPolicy = s.concentration * 0.004 - s.stateSubsidy * 0.2;
    const dp = clamp(0.4 * excess + inputs + markupPolicy + (e.labour.wageGrowth - e.monetary.inflation - tfp) * prof.labourIntensity * 0.05 + e.monetary.inflation, -0.4, 60);
    s.price = clamp(s.price * Math.exp((dp - e.monetary.inflation) * dt), 0.02, 50);

    const growthRate = Math.log(Math.max(1e-6, q) / Math.max(1e-6, s.quantity)) / dt;
    s.growth = approach(s.growth, clamp(growthRate, -0.6, 0.6), 0.08);
    s.quantity = Math.max(1, q);
    s.output = s.quantity * s.price * m.priceLevel;
    totalOutput += s.output + (firmOutput?.get(s.id) ?? 0);

    // Margins: market power and scarcity, less regulation, wages and tax.
    const marginTarget = clamp(prof.margin * (0.7 + s.concentration * 0.7) + excess * 0.15 - (s.regulation - 0.3) * 0.05 - Math.max(0, m.minimumWage - 0.5) * prof.labourIntensity * 0.04 + s.stateSubsidy * 0.3, -0.25, 0.65);
    s.margin = approach(s.margin, marginTarget, 0.8 * dt);
  }

  // Shares and employment. Workers follow output and productivity, and the total
  // matches the labour force the macro model says is in work.
  const employed = e.population * e.labour.participation * (1 - e.labour.unemployment);
  let jobWeight = 0;
  for (const s of e.sectors) {
    s.share = (s.output + (firmOutput?.get(s.id) ?? 0)) / Math.max(1, totalOutput);
    jobWeight += s.share * SECTORS[s.id].labourIntensity * (s.id === "agriculture" ? 2 : 1);
  }
  for (const s of e.sectors) {
    s.employment = Math.round((employed * s.share * SECTORS[s.id].labourIntensity * (s.id === "agriculture" ? 2 : 1)) / Math.max(1e-6, jobWeight));
    s.output = s.share * e.gdp;
    s.productivity = s.employment > 0 ? s.output / s.employment : 0;
    s.wage = s.employment > 0 ? (s.output * clamp(1 - s.margin - 0.15, 0.2, 0.85)) / s.employment : 0;
    if (m.minimumWage > 0) s.wage = Math.max(s.wage, e.labour.medianWage * m.minimumWage);
  }
}

// ===========================================================================
// Households
// ===========================================================================

function stepHouseholds(c: Country): void {
  const e = c.economy;
  const m = e.macro;
  const dt = WEEK_YEARS;
  const shares = incomeShares(e.inequality);
  const disposableBase = e.gdp * (1 - e.tax.income * 0.8 - e.tax.payroll) * 0.72;
  const transfers = e.fiscal.welfare;
  const priceOf = (id: SectorId) => (e.sectors.find((s) => s.id === id)?.price ?? 1) * m.priceLevel;

  let satSum = 0;
  for (const h of e.households) {
    const basket = BASKET[h.id];
    let weight = 0;
    let cost = 0;
    for (const [id, w] of Object.entries(basket)) {
      cost += priceOf(id as SectorId) * (w as number);
      weight += w as number;
    }
    const nextCost = cost / Math.max(1e-6, weight);
    const transferShare = h.id === "working" ? 0.65 : h.id === "middle" ? 0.3 : 0.05;
    const pretaxLabourLoss = h.id === "working" ? e.labour.unemployment * 0.5 : h.id === "middle" ? e.labour.unemployment * 0.2 : 0;
    const income = ((disposableBase * shares[h.id] * (1 - pretaxLabourLoss) + transfers * transferShare) / Math.max(1, e.population * h.popShare));
    const prevReal = h.realIncome;
    h.incomeShare = shares[h.id];
    h.income = income;
    h.costOfLiving = nextCost;
    h.realIncome = (income * e.monetary.exchangeRateVsUsd) / Math.max(1e-6, nextCost);
    h.savingsRate = clamp((h.id === "working" ? 0.02 : h.id === "middle" ? 0.1 : 0.3) + (m.bondYield - 0.04) * 0.3 - (m.consumerConfidence - 50) * 0.001, -0.05, 0.6);
    const realGrowth = Math.log(Math.max(1e-6, h.realIncome) / Math.max(1e-6, prevReal)) / dt;
    const costOfLivingPain = Math.max(0, e.monetary.inflation - 0.03) * (h.id === "working" ? 1.5 : h.id === "middle" ? 1 : 0.4);
    const target = clamp(0.58 + clamp(realGrowth, -0.6, 0.6) * 0.45 - e.labour.unemployment * (h.id === "working" ? 1.3 : 0.7) - costOfLivingPain + (h.id === "working" ? e.budget.welfare * 0.5 : 0) - Math.max(0, e.tax.vat - 0.15) * (h.id === "working" ? 0.4 : 0.15), 0.03, 0.97);
    h.satisfaction = approach(h.satisfaction, target, 1.3 * dt);
    satSum += h.satisfaction * h.popShare;
  }
  e.labour.satisfaction = satSum;
  e.labour.strikeRisk = clamp01((1 - satSum) * 0.3 * (0.4 + e.labour.unionisation) + Math.max(0, e.monetary.inflation - e.labour.wageGrowth) * 0.6);
}

// ===========================================================================
// Commodities
// ===========================================================================

const COMMODITY_INTENSITY: Record<string, { sector: SectorId; beta: number; gamma: number }> = {
  oil: { sector: "energy", beta: 0.55, gamma: 0.12 }, "natural-gas": { sector: "energy", beta: 0.6, gamma: 0.12 }, coal: { sector: "energy", beta: 0.3, gamma: 0.1 }, uranium: { sector: "energy", beta: 0.3, gamma: 0.06 },
  copper: { sector: "manufacturing", beta: 0.9, gamma: 0.1 }, "iron-ore": { sector: "construction", beta: 0.9, gamma: 0.12 }, aluminium: { sector: "manufacturing", beta: 0.8, gamma: 0.1 }, lithium: { sector: "technology", beta: 1.4, gamma: 0.2 },
  wheat: { sector: "agriculture", beta: 0.25, gamma: 0.25 }, coffee: { sector: "agriculture", beta: 0.35, gamma: 0.2 }, gold: { sector: "finance", beta: -0.2, gamma: 0.02 }, silver: { sector: "manufacturing", beta: 0.3, gamma: 0.04 },
};

function stepCommodities(world: World, rnd: Rng): void {
  const dt = WEEK_YEARS;
  let weighted = 0;
  let total = 0;
  let disruption = 0;
  for (const c of Object.values(world.countries)) {
    if (c.annexedBy) continue;
    weighted += clamp(c.economy.gdpGrowth, -0.2, 0.2) * c.economy.gdp;
    total += c.economy.gdp;
    const share = c.economy.sectors.find((s) => s.id === "mining")?.output ?? 0;
    if (c.wars.length || c.sanctions.length) disruption += share;
  }
  const worldGrowth = total > 0 ? weighted / total : 0.02;
  const disruptionShare = total > 0 ? clamp((disruption / total) * 4, 0, 0.3) : 0;
  const worldInflation = clamp(world.globals.globalInflation, -0.05, 0.12);

  for (const [k, price] of Object.entries(world.markets.commodityPrices)) {
    const mk = world.commodityMarkets[k] ?? (world.commodityMarkets[k] = { supply: 1, demand: 1, trend: price, inventory: 0.25 });
    const prof = COMMODITY_INTENSITY[k] ?? { beta: 0.5, gamma: 0.1 };
    mk.trend *= Math.exp(clamp(worldInflation, -0.1, 0.2) * dt);
    const rel = price / Math.max(1e-9, mk.trend);
    mk.demand *= Math.exp((worldGrowth * prof.beta - prof.gamma * Math.log(Math.max(0.05, rel))) * dt);
    mk.supply *= Math.exp((worldGrowth * prof.beta + 0.12 * Math.log(Math.max(0.05, rel)) + 0.15 * (mk.demand / Math.max(0.01, mk.supply) - 1) - disruptionShare * 0.2 * (k === "oil" || k === "natural-gas" ? 1 : 0.3)) * dt);
    mk.inventory = clamp(mk.inventory + (mk.supply - mk.demand) * dt, 0.03, 1);
    const tightness = Math.log(Math.max(0.05, mk.demand) / Math.max(0.05, mk.supply)) + (0.25 - mk.inventory) * 0.4;
    const safeHaven = k === "gold" ? ((50 - world.markets.riskAppetite) / 50) * 0.08 : 0;
    const drift = clamp(worldInflation + tightness * 0.9 + (mk.trend / Math.max(1e-9, price) - 1) * 0.35 + safeHaven, -1, 1.2);
    const vol = (k === "gold" ? 0.12 : 0.26) * Math.sqrt(dt);
    world.markets.commodityPrices[k as keyof typeof world.markets.commodityPrices] = Math.max(price * 0.2, price * Math.exp(drift * dt + rnd.normal() * vol));
  }
}

// ===========================================================================
// Companies and markets
// ===========================================================================

function stepCompanies(world: World, rnd: Rng): void {
  const dt = WEEK_YEARS;
  for (const co of Object.values(world.companies)) {
    if (co.insolvent) continue;
    const c = world.countries[co.country];
    if (!c) continue;
    const e = c.economy;
    const s = e.sectors.find((x) => x.id === co.sector);
    if (!s) continue;
    const prof = SECTORS[co.sector];

    // Revenue tracks the home market and, for big firms, the world economy.
    const homeGrowth = e.nominalGrowth * 0.5 + s.growth * 0.6;
    const globalness = clamp(Math.log10(Math.max(1e7, co.revenue)) / 12, 0, 0.7);
    const worldGrowth = (world.globals.globalInflation + 0.025) * globalness;
    const research = (co.researchLevel - prof.techIntensity * 0.7) * 0.05;
    const sanctioned = sanctionLoad(world, c) * prof.sanctionExposure * 0.08;
    const revenueGrowth = homeGrowth * (1 - globalness) + worldGrowth + research - sanctioned + rnd.normal() * 0.09 * Math.sqrt(dt) / dt * 0.05;
    co.revenue = Math.max(1e4, co.revenue * Math.exp(clamp(revenueGrowth, -1, 2) * dt));
    co.marketShare = clamp(co.revenue / Math.max(1, s.output), 0, 1);

    // Operating profit from the sector's margin plus firm quality.
    const operatingMargin = clamp(s.margin + (co.researchLevel - 0.3) * 0.05 + (co.brandValue / Math.max(1, co.valuation)) * 0.01, -0.3, 0.6);
    co.profit = co.revenue * operatingMargin;
    co.costs = co.revenue - co.profit;
    const interest = co.debt * (e.macro.bondYield + world.markets.creditSpreads);
    const net = (co.profit - interest) * (1 - (co.profit - interest > 0 ? e.tax.corporate : 0));
    co.netIncome = net;

    // Payout, retained earnings, debt, research, hiring.
    co.debt = Math.max(0, co.debt + (-net * (net < 0 ? 1 : 0.2) + co.revenue * 0.02) * dt);
    co.rd = co.revenue * clamp(prof.techIntensity * 0.1 + co.researchLevel * 0.02, 0.001, 0.2);
    co.researchLevel = clamp01(co.researchLevel + (co.rd / Math.max(1, co.revenue) - 0.03) * 0.5 * dt);
    const productivityGrowth = clamp(e.macro.tfpGrowth + prof.techIntensity * 0.02, -0.05, 0.1);
    co.employees = Math.max(1, co.employees * Math.exp(clamp(revenueGrowth - e.monetary.inflation - productivityGrowth, -0.4, 0.4) * dt));

    // Valuation: earnings over the discount rate, tempered by revenue.
    const erp = 0.03 + (50 - world.markets.riskAppetite) * 0.0009;
    const discount = Math.max(0.025, e.macro.bondYield + erp - Math.max(0, e.monetary.inflation) * 0.5);
    const growthPremium = clamp(prof.techIntensity * 0.025 + revenueGrowth * 0.04, -0.01, 0.03);
    co.pe = clamp(1 / Math.max(0.015, discount - growthPremium), 3, 60);
    const fair = Math.max(co.revenue * 0.12, Math.max(net, co.revenue * 0.01) * co.pe);
    const noise = rnd.normal() * world.params.marketVolatility * 0.12 * Math.sqrt(dt);
    co.valuation = Math.max(1e5, co.valuation * Math.exp(0.7 * Math.log(fair / Math.max(1, co.valuation)) * dt + noise));
    co.sharePrice = Math.max(0.01, co.valuation / Math.max(1, co.shares ?? 1));
    co.tier = co.valuation > 1e12 ? "mega-cap" : co.valuation > 2e11 ? "large" : co.valuation > 2e10 ? "mid-cap" : "small";
    co.dailyVolume = Math.round((co.valuation / Math.max(0.01, co.sharePrice)) * 0.003);

    if (net < 0 && co.debt > co.revenue * 2.8 && co.stateOwnership < 0.5 && rnd.chance(dt * 1.2)) {
      const jobs = Math.round(co.employees);
      co.insolvent = true;
      co.listed = false;
      for (const ex of world.markets.exchanges) ex.listings = ex.listings.filter((x) => x !== co.id);
      e.macro.npl = clamp(e.macro.npl + (co.debt / Math.max(1, e.gdp)) * 0.5, 0, 0.6);
      pushEvent(world, { kind: "corporate", severity: "major", country: co.country, title: `${co.name} goes bankrupt`, body: `Debts of ${(co.debt / 1e9).toFixed(1)}B could not be serviced. ${jobs.toLocaleString("en-US")} jobs are at risk.`, tags: ["corporate", "insolvency"] });
    }
  }
}

function stepExchanges(world: World, rnd: Rng): void {
  const dt = WEEK_YEARS;
  for (const ex of world.markets.exchanges) {
    let cap = 0;
    for (const id of ex.listings) {
      const co = world.companies[id];
      if (co && !co.insolvent) cap += co.valuation;
    }
    const home = world.countries[ex.country];
    const nominal = home?.economy.nominalGrowth ?? 0.03;
    const yieldGap = (home?.economy.macro.bondYield ?? 0.04) - (home?.economy.macro.neutralRate ?? 0.01) - Math.max(0, home?.economy.macro.expectedInflation ?? 0.02);
    const previous = ex.marketCap || cap;
    const capReturn = cap > 0 && previous > 0 ? Math.log(cap / previous) : (nominal - yieldGap * 0.3) * dt;
    ex.marketCap = cap;
    const risk = ((world.markets.riskAppetite - 50) / 50) * 0.04 * dt;
    ex.index = Math.max(5, ex.index * Math.exp(clamp(capReturn, -0.35, 0.35) + risk + rnd.normal() * world.params.marketVolatility * 0.012 * Math.sqrt(dt)));
    ex.volatility = approach(ex.volatility, clamp(16 + (50 - world.markets.riskAppetite) * 0.5 + world.params.marketVolatility * 4, 5, 90), 2 * dt);
    let up = 0;
    let n = 0;
    for (const id of ex.listings) {
      const co = world.companies[id];
      if (!co) continue;
      n++;
      if (co.sharePrice >= co.sharePriceYearAgo) up++;
    }
    ex.breadth = n ? (up / n) * 100 : 50;
  }
}

function stepRisk(world: World, rnd: Rng): void {
  const dt = WEEK_YEARS;
  const P = world.params;
  let growthNum = 0;
  let gapNum = 0;
  let total = 0;
  let creditNum = 0;
  for (const c of Object.values(world.countries)) {
    if (c.annexedBy) continue;
    growthNum += c.economy.gdpGrowth * c.economy.gdp;
    gapNum += c.economy.macro.outputGap * c.economy.gdp;
    creditNum += c.economy.fiscal.creditRating * c.economy.gdp;
    total += c.economy.gdp;
  }
  const growth = total > 0 ? growthNum / total : 0.02;
  const gap = total > 0 ? gapNum / total : 0;
  const credit = total > 0 ? creditNum / total : 0.7;
  const target = clamp(35 + credit * 22 + gap * 260 + growth * 200 - world.globals.worldConflictIndex * 0.1, 3, 95);
  world.markets.riskAppetite = approach(world.markets.riskAppetite, target, 1.3 * dt) + rnd.normal() * 2 * Math.sqrt(dt);
  world.markets.riskAppetite = clamp(world.markets.riskAppetite, 1, 99);
  world.markets.creditSpreads = approach(world.markets.creditSpreads, clamp(0.006 + (1 - credit) * 0.05 + Math.max(0, -gap) * 0.25 + (50 - world.markets.riskAppetite) * 0.0003, 0.002, 0.3), 2 * dt);
  world.markets.sentiment = moodFor(world.markets.riskAppetite);

  // Crashes are rare, global, and hurt in proportion to how stretched things were.
  if (rnd.chance(Math.min(0.0015, P.crashProbability * P.eventRate))) {
    const bite = rnd.float(0.72, 0.9);
    world.markets.lastCrashAt = world.t;
    world.markets.riskAppetite = Math.max(3, world.markets.riskAppetite * 0.55);
    for (const ex of world.markets.exchanges) ex.index *= bite;
    for (const co of Object.values(world.companies)) co.valuation *= bite;
    for (const c of Object.values(world.countries)) {
      const exposure = clamp(c.economy.macro.credit * 0.5, 0.1, 1) * clamp(c.economy.macro.openness, 0.2, 1);
      c.economy.macro.shock -= (1 - bite) * 0.12 * exposure;
    }
    pushEvent(world, { kind: "economic", severity: "catastrophic", title: "Global market crash", body: `Equities fall about ${((1 - bite) * 100).toFixed(0)}% across every exchange. Risk appetite has collapsed.`, tags: ["crisis", "markets"] });
  }
}

/** Once a simulated year: reset 1-year baselines and let AI governments adjust. */
export function stepAnnualEconomy(world: World): void {
  for (const ex of world.markets.exchanges) ex.indexYearAgo = ex.index;
  for (const co of Object.values(world.companies)) co.sharePriceYearAgo = co.sharePrice;
  for (const c of Object.values(world.countries)) {
    if (c.annexedBy || c.id === world.playerCountry) continue;
    stepAiFiscal(c, world.startDate.year + world.t / SECONDS_PER_YEAR);
    if (c.economy.monetary.inflation > 0.4) stabilisationPlan(world, c);
  }
}

/**
 * The way real hyperinflations end: a credible regime change, not a slow grind.
 * Printing stops, the budget is cut, expectations reset, and output pays for it.
 */
export function stabilisationPlan(world: World, c: Country): void {
  const e = c.economy;
  const m = e.macro;
  const cb = e.centralBank;
  cb.printing = 0;
  cb.credibility = Math.max(cb.credibility, 0.7);
  m.expectedInflation = Math.max(cb.target, Math.min(m.expectedInflation * 0.15, 0.25));
  e.monetary.inflation = Math.max(m.expectedInflation, e.monetary.inflation * 0.25);
  e.monetary.policyRate = Math.min(e.monetary.policyRate, m.expectedInflation + 0.1);
  e.monetary.centralBankRate = e.monetary.policyRate;
  m.lastDepreciation = 0;
  m.shock -= 0.03;
  m.shockDecay = 1;
  for (const k of ["subsidies", "administration", "defence"] as const) e.budget[k] *= 0.92;
  pushEvent(world, { kind: "economic", severity: "major", country: c.id, title: `${c.name} launches a stabilisation plan`, body: "A new monetary framework and budget cuts aim to break inflation. A short recession is the price.", tags: ["monetary"] });
}

/** AI finance ministries: consolidate when debt runs away, stimulate in a slump, drift with ideology. */
function stepAiFiscal(c: Country, year: number): void {
  const e = c.economy;
  const m = e.macro;
  const deficit = -e.fiscal.budgetBalanceRatio;
  const b = e.budget;
  const t = e.tax;
  // Balanced budgets were the norm until Keynes; deficits became routine after the war.
  const tolerated = year < 1945 ? 0.005 : year < 1970 ? 0.015 : 0.03;
  const pressure = clamp((deficit - tolerated) * 1.6 + (e.fiscal.debtToGdp > 0.9 ? 0.05 : 0) + (m.riskPremium > 0.05 ? 0.1 : 0), -0.08, 0.25);
  const stimulus = m.outputGap < -0.03 ? 0.04 : 0;
  const adjust = pressure - stimulus;
  if (Math.abs(adjust) > 0.004) {
    const left = c.ideology < -10;
    const cut = 1 - clamp(adjust * (left ? 0.4 : 0.8), -0.08, 0.1);
    b.defence *= cut; b.administration *= cut; b.subsidies *= cut; b.infrastructure *= cut; b.welfare *= 1 - clamp(adjust * (left ? 0.15 : 0.5), -0.05, 0.06);
    const raise = 1 + clamp(adjust * (left ? 0.9 : 0.4), -0.05, 0.08);
    t.income = clamp(t.income * raise, 0, 0.6); t.vat = clamp(t.vat * raise, 0, 0.27); t.corporate = clamp(t.corporate * raise, 0, 0.5);
  }
  if (c.wars.length) b.defence = Math.min(0.2, b.defence * 1.08);
  if (e.monetary.inflation > 0.25 && e.centralBank.printing > 0) e.centralBank.printing *= 0.6;
}

function moodFor(risk: number): MarketMood {
  if (risk < 18) return "crash";
  if (risk < 36) return "bearish";
  if (risk < 62) return "neutral";
  if (risk < 82) return "bullish";
  return "euphoric";
}

export function avgCountryGrowth(world: World): number {
  let num = 0;
  let den = 0;
  for (const c of Object.values(world.countries)) {
    if (c.annexedBy) continue;
    num += c.economy.gdpGrowth * c.economy.gdp;
    den += c.economy.gdp;
  }
  return den > 0 ? num / den : 0.02;
}

export function sanctionLoad(world: World, c: Country): number {
  let load = 0;
  for (const id of c.sanctions) {
    const s = world.sanctions[id];
    if (s) load += (s.scope / 100) * (1 - s.evasion * 0.6);
  }
  return clamp(load, 0, 4);
}

/** Share of output lost to war this year, as a positive number. */
export function warLoad(world: World, c: Country): number {
  let load = 0;
  for (const id of c.wars) {
    const w = world.wars[id];
    if (!w || w.endedAt) continue;
    const direct = Object.prototype.hasOwnProperty.call(w.belligerents, c.id);
    load += (direct ? 0.03 : 0.006) * (1 + (w.exhaustion[c.id] ?? 0) / 100);
    for (const f of w.fronts) {
      const i = f.belligerents.indexOf(c.id);
      if (i < 0) continue;
      const losing = i === 0 ? -f.control : f.control;
      load += 0.0012 * Math.max(0, losing + 20) * 0.1;
    }
    // Occupation does not take output or people away from the country that lost
    // the ground: the line on the map is a military fact, not a transfer. Only a
    // signed peace deal moves land, population and GDP.
  }
  return clamp(load, 0, 0.3);
}

export { recomputeGlobals };
export type { Company };
