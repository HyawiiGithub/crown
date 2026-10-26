import type { WarSeed } from "../shared/types";

/**
 * Wars already underway (or recently ended) when a scenario opens.
 *
 * `belligerents` maps each belligerent ISO3 to the ISO3s of its allies in this
 * war, which the engine uses to pull allies in and to compute coalition strength.
 * `exhaustion` is 0..100 per belligerent; 100 means the government cannot fight
 * another day and must seek terms.
 */
export const WARS_BY_YEAR: Record<number, WarSeed[]> = {
  // ---------------------------------------------------------------- 1900 ---
  1900: [
    {
      name: "Second Boer War",
      startedAt: 0,
      phase: "war",
      cause: "The uitlander vote in the Transvaal and the Jameson Raid.",
      belligerents: { GBR: [], SAF: [] },
      fronts: [{ name: "Transvaal", belligerents: ["GBR", "SAF"], control: 20, terrain: "plains" }, { name: "Orange Free State", belligerents: ["GBR", "SAF"], control: 10, terrain: "plains" }],
      exhaustion: { GBR: 12, SAF: 48 },
      casualties: { GBR: 14000, SAF: 12000 },
      warGoal: "Annex the Transvaal and the Orange Free State as Crown colonies.",
    },
    {
      name: "Philippine-American War",
      startedAt: 0,
      phase: "war",
      cause: "The United States refuses to recognise Philippine independence after the Spanish-American War.",
      belligerents: { USA: [], PHL: [] },
      fronts: [{ name: "Luzon", belligerents: ["USA", "PHL"], control: 35, terrain: "urban" }],
      exhaustion: { USA: 8, PHL: 42 },
      casualties: { USA: 4200, PHL: 28000 },
      warGoal: "Suppress the republic and impose American colonial administration.",
    },
    {
      name: "Maji Maji Rebellion",
      startedAt: 0,
      phase: "crisis",
      cause: "The imposition of the hinde tax on the Maji Maji ng'ombe cult movement.",
      belligerents: { DEU: [], TZA: [] },
      fronts: [{ name: "Ruvuma", belligerents: ["DEU", "TZA"], control: -30, terrain: "forest" }],
      exhaustion: { DEU: 6, TZA: 30 },
      casualties: { DEU: 500, TZA: 9000 },
      warGoal: "German rule over German East Africa.",
    },
  ],

  // ---------------------------------------------------------------- 1930 ---
  1930: [
    {
      name: "Chinese Civil War",
      startedAt: 0,
      phase: "war",
      cause: "The Kuomintang and the CCP contest the Republic of China after the Northern Expedition.",
      belligerents: { CHN: [], COM: [], USA: [], CHI: [] },
      fronts: [
        { name: "Jiangxi Soviet", belligerents: ["COM", "CHN"], control: 22, terrain: "mountain" },
        { name: "Central Plains", belligerents: ["CHN", "COM"], control: 45, terrain: "plains" },
        { name: "Shanghai", belligerents: ["CHI", "COM"], control: 70, terrain: "urban" },
      ],
      exhaustion: { CHN: 40, COM: 52, USA: 4, CHI: 2 },
      casualties: { CHN: 180000, COM: 120000 },
      warGoal: "Unify China under one government.",
    },
    {
      name: "Emigre Revolt in Dahomey",
      startedAt: 0,
      phase: "crisis",
      cause: "Conscription and taxation imposed on the Fon people of Dahomey.",
      belligerents: { FRA: [], DAH: [] },
      fronts: [{ name: "Abomey", belligerents: ["FRA", "DAH"], control: -25, terrain: "forest" }],
      exhaustion: { FRA: 8, DAH: 35 },
      casualties: { FRA: 2000, DAH: 6000 },
      warGoal: "End French rule in Dahomey.",
    },
  ],

  // ---------------------------------------------------------------- 1950 ---
  1950: [
    {
      name: "Korean War",
      startedAt: 0,
      phase: "attrition",
      cause: "North Korean forces cross the 38th parallel to unify the peninsula by force.",
      belligerents: { PRK: [], KOR: [], USA: [], CHN: [], USSR: [] },
      fronts: [
        { name: "Pusan Perimeter", belligerents: ["USA", "PRK"], control: 55, terrain: "mountain" },
        { name: "Chongchon", belligerents: ["PRK", "KOR"], control: 62, terrain: "plains" },
        { name: "Inchon", belligerents: ["USA", "KOR", "PRK"], control: -60, terrain: "coastal" },
        { name: "Naktong Bulge", belligerents: ["KOR", "PRK"], control: -35, terrain: "forest" },
      ],
      exhaustion: { PRK: 58, KOR: 44, USA: 22, CHN: 14, USSR: 4 },
      casualties: { PRK: 88000, KOR: 62000, USA: 36000, CHN: 60000, USSR: 1200 },
      warGoal: "Restore the Republic of Korea north of the 38th parallel.",
    },
    {
      name: "Indo-Pakistani War",
      startedAt: 0,
      phase: "war",
      cause: "An accession crisis in Kashmir and a tribal incursion across the Line of Control.",
      belligerents: { IND: [], PAK: [] },
      fronts: [{ name: "Kashmir", belligerents: ["IND", "PAK"], control: 25, terrain: "mountain" }],
      exhaustion: { IND: 26, PAK: 22 },
      casualties: { IND: 45000, PAK: 26000 },
      warGoal: "Annex Jammu and Kashmir.",
    },
  ],

  // ---------------------------------------------------------------- 1990 ---
  1990: [
    {
      name: "Gulf War",
      startedAt: 0,
      phase: "negotiations",
      cause: "Iraq invades Kuwait and the United States assembles a coalition under Article 51.",
      belligerents: { IRQ: [], KWT: [], USA: [], SAU: [], GBR: [], EGY: [], SYR: [], MAR: [] },
      fronts: [
        { name: "Kuwait", belligerents: ["USA", "SAU", "IRQ"], control: -88, terrain: "desert" },
        { name: "Southern Iraq", belligerents: ["USA", "IRQ"], control: 72, terrain: "desert" },
      ],
      exhaustion: { IRQ: 61, USA: 8, SAU: 12, KWT: 40, GBR: 4, EGY: 10, SYR: 6, MAR: 6 },
      casualties: { IRQ: 20000, USA: 300, SAU: 1000, KWT: 500 },
      warGoal: "Expel Iraq from Kuwait and destroy its nuclear programme.",
    },
    {
      name: "Yugoslav Wars",
      startedAt: 0,
      phase: "war",
      cause: "Slovenia and Croatia declare independence; Yugoslavia's People's Army intervenes.",
      belligerents: { YUG: [], HRV: [], SVN: [], BIH: [] },
      fronts: [
        { name: "Croatia", belligerents: ["HRV", "YUG"], control: 58, terrain: "plains" },
        { name: "Bosnia", belligerents: ["BIH", "YUG"], control: 5, terrain: "mountain" },
        { name: "Slovenia", belligerents: ["SVN", "YUG"], control: -80, terrain: "mountain" },
      ],
      exhaustion: { YUG: 34, HRV: 28, SVN: 18, BIH: 55 },
      casualties: { YUG: 12000, HRV: 8000, SVN: 300, BIH: 30000 },
      warGoal: "Preserve Yugoslavia as a single state.",
    },
  ],

  // ---------------------------------------------------------------- 2026 ---
  2026: [
    {
      name: "Sahel Insurgency",
      startedAt: 0,
      phase: "attrition",
      cause: "A two-decade insurgency across the Mali, Niger and Burkina Faso tri-border zone.",
      belligerents: { MLI: [], NER: [], BFA: [], TCD: [], FRA: [] },
      fronts: [
        { name: "Liptako", belligerents: ["MLI", "MLI2"], control: -25, terrain: "desert" },
        { name: "Lake Chad Basin", belligerents: ["NGA", "MLI2"], control: -12, terrain: "plains" },
      ],
      exhaustion: { MLI: 46, NER: 52, BFA: 44, TCD: 30, FRA: 36 },
      casualties: { MLI: 9000, NER: 4000, BFA: 6000, TCD: 2500, FRA: 1200 },
      warGoal: "Restore state control over the Sahel.",
    },
    {
      name: "Levant Front",
      startedAt: 0,
      phase: "war",
      cause: "Escalation following the collapse of the ceasefire in the Golan corridor.",
      belligerents: { ISR: [], SYR: [], IRN: [], LBN: [], YEM2: [] },
      fronts: [
        { name: "Golan Heights", belligerents: ["ISR", "SYR"], control: 12, terrain: "mountain" },
        { name: "Lebanon Border", belligerents: ["ISR", "LBN"], control: -30, terrain: "mountain" },
      ],
      exhaustion: { ISR: 22, SYR: 48, IRN: 30, LBN: 55, YEM2: 40 },
      casualties: { ISR: 900, SYR: 6000, IRN: 800, LBN: 4000, YEM2: 2000 },
      warGoal: "Drive Israeli forces back to the 1967 line.",
    },
  ],
};

/**
 * Treaties in force at the start of each era. These seed the diplomacy panel and
 * give the engine the trade bonuses and guarantee obligations it needs to run
 * an alliance system without any special-casing.
 */
export const TREATIES_BY_YEAR: Record<number, { name: string; kind: "alliance" | "non-aggression" | "trade" | "entente" | "peace" | "defensive-pact" | "access" | "customs-union" | "lend-lease"; parties: string[]; terms: string[]; tradeBonus?: number }[]> = {
  1900: [
    { name: "Triple Entente", kind: "entente", parties: ["GBR", "FRA", "RUS"], terms: ["Consultation before any continental war", "No separate peace"], tradeBonus: 4.2e9 },
    { name: "Triple Alliance", kind: "alliance", parties: ["DEU", "AUT", "ITA"], terms: ["Mutual defence", "No separate peace"] },
    { name: "Franco-Russian Alliance", kind: "defensive-pact", parties: ["FRA", "RUS"], terms: ["Mutual assistance against Germany"] },
    { name: "British-Japanese Alliance", kind: "alliance", parties: ["GBR", "JPN"], terms: ["Defence of British and Japanese possessions"], tradeBonus: 1.1e9 },
    { name: "Reinsurance Treaty", kind: "non-aggression", parties: ["DEU", "RUS"], terms: ["Neutrality if either is attacked by a third power"] },
    { name: "Treaty of Friendship, Britain and Portugal", kind: "access", parties: ["GBR", "PRT"], terms: ["Oldest active alliance in the world", "Preferential access to African ports"] },
    { name: "Pan-American Union", kind: "non-aggression", parties: ["USA", "BRA", "ARG", "COL", "MEX", "CHL", "VEN"], terms: ["Reciprocal arbitration of disputes"] },
  ],
  1930: [
    { name: "Kellogg-Briand Pact", kind: "non-aggression", parties: ["USA", "GBR", "FRA", "DEU", "USS", "JPN", "ITA"], terms: ["Renunciation of war as an instrument of national policy"] },
    { name: "Anglo-German Naval Agreement", kind: "non-aggression", parties: ["GBR", "DEU"], terms: ["Cruiser and battleship tonnage ratio fixed at 100,000 to 46,000"] },
    { name: "Non-Aggression Pact", kind: "non-aggression", parties: ["DEU", "USS"], terms: ["Neither party will attack the other", "Neutrality in a conflict with a third power"] },
    { name: "Concordat", kind: "non-aggression", parties: ["ITA", "VAT"], terms: ["The Vatican recognises the Kingdom of Italy", "Article 7 of the Lateran Treaty's antecedent"] },
  ],
  1950: [
    { name: "North Atlantic Treaty", kind: "defensive-pact", parties: ["USA", "GBR", "FRA", "DEU", "ITA", "CAN", "BEL", "DNK", "NLD", "LUX", "NOR", "PRT", "DNK2"], terms: ["Article 5 collective defence", "An armed attack on one is an attack on all"] },
    { name: "Treaty of Friendship, Co-operation and Mutual Assistance", kind: "alliance", parties: ["USS", "CHN"], terms: ["Joint defence against Japan and the United States", "Soviet advisory mission in China"] },
    { name: "European Coal and Steel Community", kind: "customs-union", parties: ["FRA", "DEU", "ITA", "BEL", "NLD", "LUX"], terms: ["Common market in coal and steel", "Six-member executive board"], tradeBonus: 6e9 },
    { name: "Soviet-Japanese Neutrality Pact", kind: "non-aggression", parties: ["USS", "JPN"], terms: ["Non-aggression if either is attacked by a third power", "Recognition of Soviet interests in Manchuria"], tradeBonus: 8e8 },
    { name: "Treaty of Peace with Japan", kind: "peace", parties: ["JPN", "USA", "GBR", "FRA"], terms: ["Renunciation of Japanese sovereignty over its colonies", "Allied occupation of Japan"] },
  ],
  1990: [
    { name: "Treaty on European Union", kind: "customs-union", parties: ["DEU", "FRA", "ITA", "GBR", "ESP", "POL", "NLD", "BEL", "GRC", "PRT", "DNK", "IRL", "AUT", "FIN", "SWE", "LUX"], terms: ["Single market", "Economic and monetary union"], tradeBonus: 2.4e12 },
    { name: "START I", kind: "defensive-pact", parties: ["USA", "USS"], terms: ["Reduction of strategic offensive arms to 6,000 warheads each", "On-site inspection"], },
    { name: "G7 Economic Partnership", kind: "trade", parties: ["USA", "GBR", "FRA", "DEU", "ITA", "JPN", "CAN"], terms: ["Trade liberalisation", "Coordination of macroeconomic policy"], tradeBonus: 1.1e12 },
    { name: "Treaty of Friendship and Cooperation", kind: "alliance", parties: ["USA", "JPN"], terms: ["Mutual security guarantee", "The United States forward-deploys forces in Japan"], tradeBonus: 3.2e11 },
  ],
  2026: [
    { name: "North Atlantic Treaty", kind: "defensive-pact", parties: ["USA", "GBR", "FRA", "DEU", "ITA", "CAN", "BEL", "DNK", "NLD", "LUX", "NOR", "PRT", "POL", "ESP", "SWE", "FIN", "ROU", "SVK", "SVN", "HRV", "TUR", "ISL", "ALB", "LVA", "LTU", "MNE", "MKD", "BIH", "MDA"], terms: ["Article 5 collective defence", "Spending commitments renewed to 2% of GDP"], tradeBonus: 4.6e12 },
    { name: "European Union", kind: "customs-union", parties: ["FRA", "DEU", "ITA", "ESP", "POL", "NLD", "BEL", "GRC", "PRT", "AUT", "SWE", "FIN", "ROU", "SVK", "SVN", "HRV", "CZE", "HUN", "DNK", "IRL", "LTU", "LVA", "EST", "CYP", "MLT"], terms: ["Single market", "Common external tariff", "Freedom of movement"], tradeBonus: 5.1e12 },
    { name: "BRICS Partnership", kind: "trade", parties: ["CHN", "RUS", "IND", "BRA", "ZAF", "EGY", "ARE", "IRN"], terms: ["Local currency settlement", "New Development Bank capitalisation"], tradeBonus: 1.9e12 },
    { name: "Sino-Russian Treaty of Friendship", kind: "alliance", parties: ["CHN", "RUS"], terms: ["No-NATO pledge", "Strategic partnership without a mutual defence clause"], tradeBonus: 2.4e11 },
    { name: "ASEAN Charter", kind: "non-aggression", parties: ["SGP", "MYS", "IDN", "THA", "PHL", "VNM", "KHM", "LAO", "MMR", "BRN"], terms: ["No use of force", "Consensus decision making"], tradeBonus: 8.6e11 },
    { name: "Gulf Cooperation Council Charter", kind: "customs-union", parties: ["SAU", "ARE", "QAT", "KWT", "BHR", "OMN"], terms: ["Common market", "Free movement of capital"], tradeBonus: 3.4e11 },
    { name: "Treaty of Friendship and Cooperation", kind: "alliance", parties: ["USA", "JPN", "KOR", "AUS", "PHL"], terms: ["Extended deterrence in East Asia"], tradeBonus: 6.2e11 },
    { name: "OPEC+ Production Agreement", kind: "trade", parties: ["SAU", "RUS", "IRQ", "IRN", "ARE", "KWT", "OMN", "QAT"], terms: ["Voluntary production cuts", "Compliance monitored monthly"], tradeBonus: 5.2e11 },
  ],
};