import type { TreatySeed, WarSeed } from "../shared/types";

/**
 * Conflicts actually under way, and treaties actually in force, on each
 * scenario's start date. Ids are the polity ids used by that scenario's table.
 *
 * `control` on a front runs -100..100 from the first belligerent's point of view.
 */
const W = (name: string, cause: string, a: string[], b: string[], front: string, terrain: string, control: number, exA: number, exB: number, goal: string): WarSeed => ({
  name,
  startedAt: 0,
  phase: "war",
  cause,
  belligerents: Object.fromEntries([[a[0], a.slice(1)], [b[0], b.slice(1)]]),
  fronts: [{ name: front, belligerents: [a[0], b[0]], control, terrain: terrain as WarSeed["fronts"][number]["terrain"] }],
  exhaustion: { [a[0]]: exA, [b[0]]: exB },
  casualties: {},
  warGoal: goal,
});

export const WARS_BY_YEAR: Record<number, WarSeed[]> = {
  1900: [
    W("Second Boer War", "The franchise of the uitlanders in the Transvaal and British claims over the goldfields.", ["GBR", "CPC", "CAN", "AUC", "NZL"], ["SAR", "OFS"], "Natal and the Veld", "plains", -10, 15, 25, "Annex the Boer republics."),
    W("Philippine-American War", "The United States refused to recognise Philippine independence after the war with Spain.", ["USA", "UOT"], ["PHL_REB"], "Luzon", "forest", 35, 8, 40, "Suppress the First Philippine Republic."),
    W("Thousand Days' War", "Liberal revolt against the Conservative government of Colombia.", ["COL"], ["COL_REB"], "Santander", "mountain", 20, 30, 40, "Hold the Conservative regime together."),
  ],
  1914: [
    W("Mexican Revolution", "Constitutionalists and peasant armies rose after Huerta seized power in 1913.", ["MEX"], ["MEX_REB"], "Northern Mexico", "desert", -45, 55, 30, "Keep Huerta in power."),
  ],
  1930: [
    W("Central Plains War", "Regional warlords revolted against Chiang Kai-shek's disbandment of their armies.", ["CHN"], ["CHN_REB"], "Henan", "plains", 10, 25, 30, "Finish the unification of China under Nanjing."),
    W("Pacification of Libya", "Senussi resistance led by Omar Mukhtar against Italian rule.", ["ITA", "ICO"], ["LBY_REB"], "Cyrenaica", "desert", 40, 10, 45, "End resistance in Cyrenaica."),
  ],
  1950: [
    W("First Indochina War", "The Viet Minh are fighting to end French rule over Indochina.", ["FRA", "IDC"], ["DRV"], "Tonkin", "forest", -5, 30, 25, "Hold Indochina for the French Union."),
    W("Malayan Emergency", "Communist insurgency against British rule in Malaya.", ["GBR", "BMA"], ["MLY_REB"], "Malayan Jungle", "forest", 15, 6, 30, "Destroy the Malayan National Liberation Army."),
  ],
  1990: [
    W("Gulf Crisis", "Iraq invaded and annexed Kuwait on 2 August. A US-led coalition is massing in Saudi Arabia.", ["IRQ"], ["USA", "GBR", "FRA", "SAU", "EGY"], "Kuwait", "desert", 80, 40, 3, "Force Iraq out of Kuwait, or hold what has been taken."),
    W("Afghan Civil War", "The mujahideen continue to fight the Soviet-backed government after the Soviet withdrawal.", ["AFG"], ["AFG_REB"], "Afghan Highlands", "mountain", 10, 60, 50, "Survive without Soviet troops."),
    W("Liberian Civil War", "Charles Taylor's rebels and factions are fighting for Monrovia.", ["LBR"], ["LBR_REB"], "Monrovia", "urban", -30, 60, 40, "Control Monrovia."),
    W("Ethiopian Civil War", "Eritrean and Tigrayan fronts are closing in on the Derg.", ["ETH"], ["ETH_REB"], "Tigray and Eritrea", "mountain", -40, 70, 40, "Preserve the Derg regime."),
  ],
  2010: [
    W("War in Afghanistan", "NATO forces are fighting the Taliban insurgency, with a troop surge under way.", ["USA", "GBR", "CAN", "DEU", "AFG"], ["AFG_REB"], "Helmand and Kandahar", "mountain", 20, 28, 40, "Stabilise the Afghan government."),
    W("Iraq Insurgency", "US forces are drawing down while sectarian insurgents remain active.", ["USA", "IRQ"], ["IRQ_REB"], "Baghdad", "urban", 50, 45, 55, "Hand security to Iraqi forces."),
    W("War in Somalia", "Al-Shabaab controls much of the south against the Transitional Federal Government.", ["SOM", "ETH", "UGA"], ["SOM_REB"], "Mogadishu", "urban", -20, 55, 30, "Hold Mogadishu."),
  ],
  2020: [
    W("Syrian Civil War", "Assad's government, backed by Russia and Iran, is fighting the last rebel holdouts in Idlib.", ["SYR", "RUS", "IRN"], ["SYR_REB", "TUR"], "Idlib", "urban", 65, 70, 60, "Reconquer Syria."),
    W("Yemeni Civil War", "The Saudi-led coalition is fighting the Houthis, who hold Sanaa.", ["SAU", "YEM", "ARE"], ["YEM_REB"], "Marib", "desert", -25, 55, 45, "Restore the recognised government."),
    W("War in Afghanistan", "Peace talks with the Taliban have begun under the February Doha agreement.", ["USA", "AFG"], ["AFG_REB"], "Afghan Provinces", "mountain", -10, 65, 45, "Withdraw without collapse."),
    W("Libyan Civil War", "Haftar's forces are besieging Tripoli.", ["LBY", "TUR"], ["LBY_REB"], "Tripoli", "urban", 5, 45, 40, "Hold Tripoli."),
  ],
  2026: [
    W("Russo-Ukrainian War", "Russia launched a full-scale invasion of Ukraine in February 2022.", ["RUS"], ["UKR"], "Donbas and Zaporizhzhia", "plains", 22, 58, 62, "Force a settlement on the current line, or restore Ukraine's borders."),
    W("Sudanese Civil War", "The Sudanese Armed Forces and Rapid Support Forces have fought since April 2023.", ["SDN"], ["SDN_REB"], "Darfur and Kordofan", "desert", -10, 70, 65, "Defeat the Rapid Support Forces."),
    W("Myanmar Civil War", "Resistance forces and ethnic armies are fighting the junta.", ["MMR"], ["MMR_REB"], "Shan and Sagaing", "forest", -15, 60, 50, "Keep the junta in power."),
  ],
};

const T = (name: string, kind: TreatySeed["kind"], parties: string, terms: string): TreatySeed => ({ name, kind, parties: parties.split(" "), terms: [terms] });

export const TREATIES_BY_YEAR: Record<number, TreatySeed[]> = {
  1900: [
    T("Triple Alliance", "defensive-pact", "DEU AUT ITA", "Mutual defence against France and Russia."),
    T("Franco-Russian Alliance", "alliance", "FRA RUS", "Mutual defence against the Triple Alliance."),
  ],
  1914: [
    T("Triple Alliance", "defensive-pact", "DEU AUT ITA", "Mutual defence; renewed in 1912."),
    T("Triple Entente", "entente", "GBR FRA RUS", "Understanding between Britain, France and Russia."),
    T("Anglo-Japanese Alliance", "alliance", "GBR JPN", "Mutual aid in East Asia."),
    T("Treaty of London", "access", "GBR FRA DEU BEL", "Guarantee of Belgian neutrality."),
    T("Serbian-Russian Understanding", "entente", "SRB RUS", "Russian patronage of Serbia."),
  ],
  1930: [
    T("Locarno Treaties", "non-aggression", "DEU FRA BEL GBR ITA", "Guarantee of the Rhine frontier."),
    T("Little Entente", "defensive-pact", "CSK ROU YUG", "Mutual defence against Hungarian revisionism."),
    T("Franco-Polish Alliance", "alliance", "FRA POL", "Mutual defence."),
  ],
  1950: [
    T("North Atlantic Treaty", "defensive-pact", "USA CAN GBR FRA ITA BEL NLD LUX DNK NOR ISL PRT", "An attack on one is an attack on all."),
    T("Sino-Soviet Friendship Negotiations", "alliance", "USS CHN", "Mao is in Moscow negotiating the treaty of alliance."),
    T("Comecon", "customs-union", "USS POL CSK HUN ROU BGR ALB", "Socialist economic coordination."),
  ],
  1990: [
    T("North Atlantic Treaty", "defensive-pact", "USA CAN GBR FRA DEU ITA BEL NLD LUX DNK NOR ISL PRT ESP GRC TUR", "An attack on one is an attack on all."),
    T("Warsaw Pact", "defensive-pact", "USS POL CSK HUN ROU BGR", "Fading fast; it dissolves next year."),
    T("European Communities", "customs-union", "BEL DNK FRA DEU GRC IRL ITA LUX NLD PRT ESP GBR", "Single market programme."),
    T("US-Japan Security Treaty", "alliance", "USA JPN", "Mutual cooperation and security."),
  ],
  2010: [
    T("North Atlantic Treaty", "defensive-pact", "USA CAN GBR FRA DEU ITA BEL NLD LUX DNK NOR ISL PRT ESP GRC TUR POL CZE HUN BGR EST LVA LTU ROU SVK SVN ALB HRV", "Collective defence."),
    T("European Union", "customs-union", "BEL DNK FRA DEU GRC IRL ITA LUX NLD PRT ESP GBR AUT FIN SWE CYP CZE EST HUN LVA LTU MLT POL SVK SVN BGR ROU", "Single market."),
    T("NAFTA", "trade", "USA CAN MEX", "North American free trade."),
    T("US-Japan Security Treaty", "alliance", "USA JPN", "Mutual cooperation and security."),
    T("US-ROK Mutual Defense Treaty", "alliance", "USA KOR", "Mutual defence."),
  ],
  2020: [
    T("North Atlantic Treaty", "defensive-pact", "USA CAN GBR FRA DEU ITA BEL NLD LUX DNK NOR ISL PRT ESP GRC TUR POL CZE HUN BGR EST LVA LTU ROU SVK SVN ALB HRV MNE", "Collective defence."),
    T("European Union", "customs-union", "BEL DNK FRA DEU GRC IRL ITA LUX NLD PRT ESP AUT FIN SWE CYP CZE EST HUN LVA LTU MLT POL SVK SVN BGR ROU HRV", "Single market."),
    T("USMCA", "trade", "USA CAN MEX", "North American trade; enters into force in July."),
    T("US-Japan Security Treaty", "alliance", "USA JPN", "Mutual cooperation and security."),
    T("US-ROK Mutual Defense Treaty", "alliance", "USA KOR", "Mutual defence."),
  ],
  2026: [
    T("North Atlantic Treaty", "defensive-pact", "USA CAN GBR FRA DEU ITA BEL NLD LUX DNK NOR ISL PRT ESP GRC TUR POL CZE HUN BGR EST LVA LTU ROU SVK SVN ALB HRV MNE MKD FIN SWE", "Collective defence."),
    T("European Union", "customs-union", "BEL DNK FRA DEU GRC IRL ITA LUX NLD PRT ESP AUT FIN SWE CYP CZE EST HUN LVA LTU MLT POL SVK SVN BGR ROU HRV", "Single market."),
    T("USMCA", "trade", "USA CAN MEX", "North American trade."),
    T("CSTO", "defensive-pact", "RUS BLR KAZ KGZ TJK ARM", "Collective security."),
    T("US-Japan Security Treaty", "alliance", "USA JPN", "Mutual cooperation and security."),
    T("US-ROK Mutual Defense Treaty", "alliance", "USA KOR", "Mutual defence."),
    T("AUKUS", "alliance", "USA GBR AUS", "Trilateral security pact."),
    T("Russia-North Korea Strategic Partnership", "alliance", "RUS PRK", "Mutual assistance treaty signed in 2024."),
  ],
};
