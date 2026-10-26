import type { Bloc, GovernmentType, IsoNumeric } from "../shared/types";

/**
 * Historical polities and territorial control.
 *
 * We ship ONE offline shapefile (Natural Earth modern countries). Rendering 1900
 * with it means answering a different question than "which polygon is this":
 * "who controls this ground *in this year*". So each era declares a flat control
 * map -- ISO numeric -> controller polity id -- and the map shader paints every
 * polygon by its controller. That is how you get colonial empires, mandates,
 * occupied zones and partitioned nations without shipping a 1900 shapefile.
 */

export interface HistoricalPolity {
  id: string;
  name: string;
  formalName: string;
  government: GovernmentType;
  colour: string;
  ideology: number;
  bloc: Bloc;
  /** Millions. */
  population: number;
  /** Credits per capita at that era's prices. */
  gdpPerCapita: number;
  leader: string;
  leaderTitle: string;
  /** Modern ISO3 this polity hands control back to. */
  successor: string;
}

export type DependencyType = "colony" | "protectorate" | "mandate" | "dominion" | "occupation" | "territory";

export interface EraDefinition {
  era: string;
  polities: HistoricalPolity[];
  /** ISO numeric -> polity id. Anything absent is unclaimed (disputed land). */
  control: Record<IsoNumeric, string>;
  /** Polity id -> dependency id -> dependency type. */
  dependencies: Record<string, Record<string, DependencyType>>;
}

// ===========================================================================
// 1900 -- the high-water mark of European imperialism
// ===========================================================================

export const ERA_1900: EraDefinition = {
  era: "1900",
  polities: [
    { id: "GBR", name: "United Kingdom", formalName: "United Kingdom of Great Britain and Ireland", government: "constitutional-monarchy", colour: "hsl(352 64% 44%)", ideology: -12, bloc: "british-empire", population: 41, gdpPerCapita: 4900, leader: "Queen Victoria", leaderTitle: "Queen", successor: "GBR" },
    { id: "FRA", name: "France", formalName: "French Republic", government: "parliamentary-republic", colour: "hsl(222 58% 42%)", ideology: -22, bloc: "entente", population: 41, gdpPerCapita: 4400, leader: "Emile Loubet", leaderTitle: "President of the Republic", successor: "FRA" },
    { id: "DEU", name: "German Empire", formalName: "Deutsches Kaiserreich", government: "absolute-monarchy", colour: "hsl(36 44% 36%)", ideology: -6, bloc: "central-powers", population: 65, gdpPerCapita: 4300, leader: "Wilhelm II", leaderTitle: "Kaiser", successor: "DEU" },
    { id: "RUS", name: "Russian Empire", formalName: "Russian Empire", government: "absolute-monarchy", colour: "hsl(44 42% 38%)", ideology: -18, bloc: "entente", population: 132, gdpPerCapita: 1900, leader: "Nicholas II", leaderTitle: "Tsar", successor: "RUS" },
    { id: "USA", name: "United States", formalName: "United States of America", government: "presidential-republic", colour: "hsl(214 46% 40%)", ideology: -22, bloc: "entente", population: 76, gdpPerCapita: 5900, leader: "William McKinley", leaderTitle: "President", successor: "USA" },
    { id: "JPN", name: "Japan", formalName: "Empire of Japan", government: "absolute-monarchy", colour: "hsl(358 50% 40%)", ideology: -8, bloc: "allies", population: 46, gdpPerCapita: 2100, leader: "Emperor Meiji", leaderTitle: "Emperor", successor: "JPN" },
    { id: "ITA", name: "Kingdom of Italy", formalName: "Regno d'Italia", government: "constitutional-monarchy", colour: "hsl(88 30% 34%)", ideology: -32, bloc: "central-powers", population: 33, gdpPerCapita: 2600, leader: "Umberto I", leaderTitle: "King", successor: "ITA" },
    { id: "AUT", name: "Austria-Hungary", formalName: "Osterreichisch-Ungarische Monarchie", government: "absolute-monarchy", colour: "hsl(18 34% 42%)", ideology: -8, bloc: "central-powers", population: 51, gdpPerCapita: 2600, leader: "Franz Joseph I", leaderTitle: "Emperor", successor: "AUT" },
    { id: "CHN", name: "Qing China", formalName: "Qing Empire", government: "absolute-monarchy", colour: "hsl(6 42% 42%)", ideology: -30, bloc: "non-aligned", population: 400, gdpPerCapita: 900, leader: "Emperor Guangxu", leaderTitle: "Emperor", successor: "CHN" },
    { id: "OTT", name: "Ottoman Empire", formalName: "Ottoman Empire", government: "absolute-monarchy", colour: "hsl(158 30% 36%)", ideology: -16, bloc: "central-powers", population: 24, gdpPerCapita: 1100, leader: "Abdul Hamid II", leaderTitle: "Sultan", successor: "TUR" },
    { id: "PER", name: "Persia", formalName: "Sublime State of Persia", government: "absolute-monarchy", colour: "hsl(174 32% 38%)", ideology: -14, bloc: "none", population: 9.5, gdpPerCapita: 1000, leader: "Mozaffar ad-Din Shah", leaderTitle: "Shah", successor: "IRN" },
    { id: "THI", name: "Siam", formalName: "Rattanakosin Kingdom", government: "absolute-monarchy", colour: "hsl(46 48% 44%)", ideology: -30, bloc: "none", population: 9, gdpPerCapita: 1300, leader: "Chulalongkorn", leaderTitle: "King", successor: "THA" },
    { id: "BRA", name: "Brazil", formalName: "United States of Brazil", government: "federal-republic", colour: "hsl(124 34% 32%)", ideology: -8, bloc: "entente", population: 17, gdpPerCapita: 2100, leader: "Prudente de Morais", leaderTitle: "President", successor: "BRA" },
    { id: "ESP", name: "Spain", formalName: "Kingdom of Spain", government: "absolute-monarchy", colour: "hsl(42 54% 42%)", ideology: -30, bloc: "none", population: 8.5, gdpPerCapita: 2200, leader: "Alfonso XIII", leaderTitle: "King", successor: "ESP" },
    { id: "MEK", name: "Mexico", formalName: "Estados Unidos Mexicanos", government: "presidential-republic", colour: "hsl(120 26% 38%)", ideology: -34, bloc: "none", population: 13, gdpPerCapita: 1800, leader: "Porfirio Diaz", leaderTitle: "President", successor: "MEX" },
    { id: "SAF", name: "South African Republic", formalName: "Zuid-Afrikaansche Republiek", government: "parliamentary-republic", colour: "hsl(28 32% 40%)", ideology: 18, bloc: "none", population: 1.1, gdpPerCapita: 2400, leader: "Paul Kruger", leaderTitle: "President", successor: "ZAF" },
    { id: "ABY", name: "Abyssinia", formalName: "Ethiopian Empire", government: "absolute-monarchy", colour: "hsl(96 26% 40%)", ideology: -10, bloc: "none", population: 9, gdpPerCapita: 900, leader: "Menelik II", leaderTitle: "Negus", successor: "ETH" },
    { id: "AFG", name: "Afghanistan", formalName: "Emirate of Afghanistan", government: "absolute-monarchy", colour: "hsl(16 36% 44%)", ideology: -40, bloc: "none", population: 6, gdpPerCapita: 700, leader: "Abdur Rahman Khan", leaderTitle: "Emir", successor: "AFG" },
    { id: "SWE", name: "Sweden-Norway", formalName: "United Kingdoms of Sweden and Norway", government: "constitutional-monarchy", colour: "hsl(50 58% 44%)", ideology: -6, bloc: "none", population: 7.6, gdpPerCapita: 2800, leader: "Oscar II", leaderTitle: "King", successor: "SWE" },
    { id: "DNK", name: "Denmark", formalName: "Kingdom of Denmark", government: "constitutional-monarchy", colour: "hsl(4 46% 42%)", ideology: -8, bloc: "none", population: 2.5, gdpPerCapita: 3400, leader: "Christian IX", leaderTitle: "King", successor: "DNK" },
    { id: "NLD", name: "Netherlands", formalName: "Kingdom of the Netherlands", government: "constitutional-monarchy", colour: "hsl(32 56% 44%)", ideology: -14, bloc: "none", population: 5.6, gdpPerCapita: 3500, leader: "Wilhelmina", leaderTitle: "Queen", successor: "NLD" },
    { id: "PRY", name: "Paraguay", formalName: "Republic of Paraguay", government: "presidential-republic", colour: "hsl(4 40% 46%)", ideology: -20, bloc: "none", population: 0.6, gdpPerCapita: 1500, leader: "Juan Bautista Egusquiza", leaderTitle: "President", successor: "PRY" },
    { id: "ARG", name: "Argentina", formalName: "Argentine Nation", government: "presidential-republic", colour: "hsl(206 44% 46%)", ideology: -6, bloc: "entente", population: 3.8, gdpPerCapita: 2900, leader: "Julio Argentino Roca", leaderTitle: "President", successor: "ARG" },
    { id: "COL", name: "Colombia", formalName: "Republic of Colombia", government: "presidential-republic", colour: "hsl(48 60% 48%)", ideology: -26, bloc: "entente", population: 4, gdpPerCapita: 1800, leader: "Rafael Reyes", leaderTitle: "President", successor: "COL" },
    { id: "VEN", name: "Venezuela", formalName: "United States of Venezuela", government: "presidential-republic", colour: "hsl(206 50% 50%)", ideology: -24, bloc: "entente", population: 1, gdpPerCapita: 1900, leader: "Juan Vicente Gomez", leaderTitle: "President", successor: "VEN" },
    { id: "URY", name: "Uruguay", formalName: "Oriental Republic of Uruguay", government: "presidential-republic", colour: "hsl(196 40% 56%)", ideology: 8, bloc: "entente", population: 0.9, gdpPerCapita: 3000, leader: "Juan Campisteguy", leaderTitle: "President", successor: "URY" },
  ],
  control: {
    "826": "GBR", "356": "GBR", "458": "GBR", "404": "GBR", "296": "GBR", "548": "GBR", "090": "GBR", "540": "GBR", "036": "GBR", "702": "GBR", "086": "GBR", "626": "GBR", "882": "GBR",
    "124": "GBR", "484": "GBR", "250": "FRA", "266": "FRA", "270": "FRA", "324": "FRA", "624": "FRA", "204": "FRA", "108": "FRA", "818": "FRA", "148": "FRA",
    "276": "DEU", "050": "DEU",
    "643": "RUS", "398": "RUS", "417": "RUS", "860": "RUS", "795": "RUS", "762": "RUS", "496": "RUS", "616": "RUS", "246": "RUS", "233": "RUS", "428": "RUS", "804": "RUS", "208": "RUS", "578": "RUS", "203": "RUS", "703": "RUS",
    "840": "USA", "630": "USA", "084": "USA",
    "392": "JPN", "158": "JPN", "410": "JPN",
    "380": "ITA", "499": "ITA", "214": "ITA",
    "040": "AUT", "705": "AUT", "498": "AUT", "642": "AUT", "688": "AUT", "807": "AUT", "300": "AUT", "792": "AUT",
    "156": "CHN", "704": "CHN", "104": "CHN", "524": "CHN", "364": "CHN", "048": "CHN", "634": "CHN",
  "422": "OTT", "368": "OTT", "512": "OTT", "682": "OTT", "887": "OTT", "760": "OTT", "268": "OTT",
    "364y": "PER",  
    "764": "THI",
    "076": "BRA",
    "724": "ESP", "152": "ESP", "222": "ESP", "320": "ESP", "340": "ESP", "558": "ESP", "188": "ESP", "504": "ESP", "862": "ESP", "068": "ESP", "170": "ESP",

    "710": "SAF",
    "231": "ABY",
    "004": "AFG",
    "752": "SWE",
 "352": "DNK", "304": "DNK",
    "528": "NLD", "360": "NLD",
    "600": "PRY", "032": "ARG", "858": "URY",
  },
  dependencies: {
    GBR: { IND: "colony", CAN: "dominion", AUS: "dominion", NZL: "dominion", ZAF: "dominion", KEN: "protectorate", MMR: "colony", MYS: "protectorate" },
 // eslint-disable-line
    FRA: { VNM: "colony", TCD: "colony", MLI: "colony", VNM2: "colony", MAR: "protectorate" },
 // eslint-disable-line
    DEU: { TZA: "colony", CMR: "colony", NGA: "colony", NZL2: "protectorate" }, // eslint-disable-line
    JPN: { TWN: "colony", KOR: "colony" },
    ITA: { ERI: "colony", LBY: "colony", SDN: "colony", ALB: "colony" },
    CHN: { TIB: "colony", TWN2: "colony", MNG2: "colony" }, // eslint-disable-line
    ESP: { CUB: "colony", PHL: "colony", GTM: "colony", ECU: "colony", CHL: "colony" }, // eslint-disable-line
    USA: { CUB: "occupation", PRI: "colony", PHL: "occupation" }, // eslint-disable-line
    RUS: { TKM: "colony", AFG2: "protectorate" }, // eslint-disable-line
  }
};

// ===========================================================================
// 1930 -- interwar: mandates, the collapse of four empires
// ===========================================================================

export const ERA_1930: EraDefinition = {
  era: "1930",
  polities: [
    { id: "GBR", name: "United Kingdom", formalName: "United Kingdom of Great Britain and Ireland", government: "constitutional-monarchy", colour: "hsl(352 64% 44%)", ideology: -16, bloc: "entente", population: 45, gdpPerCapita: 5400, leader: "Ramsay MacDonald", leaderTitle: "Prime Minister", successor: "GBR" },
    { id: "FRA", name: "France", formalName: "French Republic", government: "parliamentary-republic", colour: "hsl(222 58% 42%)", ideology: 6, bloc: "entente", population: 41, gdpPerCapita: 5000, leader: "Gaston Doumergue", leaderTitle: "President of the Republic", successor: "FRA" },
    { id: "DEU", name: "Weimar Republic", formalName: "German Reich", government: "parliamentary-republic", colour: "hsl(40 40% 42%)", ideology: -18, bloc: "none", population: 65, gdpPerCapita: 5400, leader: "Paul von Hindenburg", leaderTitle: "Reichspräsident", successor: "DEU" },
    { id: "ITA", name: "Kingdom of Italy", formalName: "Regno d'Italia", government: "constitutional-monarchy", colour: "hsl(88 30% 34%)", ideology: -44, bloc: "none", population: 41, gdpPerCapita: 3000, leader: "Benito Mussolini", leaderTitle: "Prime Minister", successor: "ITA" },
    { id: "JPN", name: "Japan", formalName: "Empire of Japan", government: "constitutional-monarchy", colour: "hsl(358 50% 40%)", ideology: -18, bloc: "allies", population: 64, gdpPerCapita: 2700, leader: "Hirohito", leaderTitle: "Emperor", successor: "JPN" },
    { id: "CHN", name: "Republic of China", formalName: "Republic of China", government: "presidential-republic", colour: "hsl(6 42% 44%)", ideology: -20, bloc: "non-aligned", population: 480, gdpPerCapita: 1100, leader: "Chiang Kai-shek", leaderTitle: "Chairman of the National Government", successor: "CHN" },
    { id: "USS", name: "Soviet Union", formalName: "Union of Soviet Socialist Republics", government: "one-party-state", colour: "hsl(2 62% 48%)", ideology: -76, bloc: "soviet-bloc", population: 154, gdpPerCapita: 2100, leader: "Joseph Stalin", leaderTitle: "General Secretary", successor: "RUS" },
    { id: "USA", name: "United States", formalName: "United States of America", government: "presidential-republic", colour: "hsl(214 46% 40%)", ideology: -8, bloc: "entente", population: 123, gdpPerCapita: 7600, leader: "Herbert Hoover", leaderTitle: "President", successor: "USA" },
    { id: "ESP", name: "Second Spanish Republic", formalName: "Segunda República Española", government: "parliamentary-republic", colour: "hsl(42 54% 42%)", ideology: -34, bloc: "non-aligned", population: 24, gdpPerCapita: 2400, leader: "Niceto Alcala-Zamora", leaderTitle: "President of the Republic", successor: "ESP" },
    { id: "POL", name: "Second Polish Republic", formalName: "Rzeczpospolita Polska", government: "parliamentary-republic", colour: "hsl(348 42% 50%)", ideology: -24, bloc: "none", population: 35, gdpPerCapita: 2600, leader: "Ignacy Moscicki", leaderTitle: "President", successor: "POL" },
    { id: "CZE", name: "Czechoslovakia", formalName: "Czechoslovak Republic", government: "parliamentary-republic", colour: "hsl(200 30% 46%)", ideology: -20, bloc: "none", population: 14, gdpPerCapita: 3900, leader: "Masaryk", leaderTitle: "President", successor: "CZE" },
    { id: "TUR", name: "Republic of Turkey", formalName: "Türkiye Cumhuriyeti", government: "presidential-republic", colour: "hsl(354 44% 46%)", ideology: -8, bloc: "none", population: 13, gdpPerCapita: 1900, leader: "Mustafa Kemal Ataturk", leaderTitle: "President", successor: "TUR" },
    { id: "ETH", name: "Ethiopian Empire", formalName: "Ethiopian Empire", government: "absolute-monarchy", colour: "hsl(96 26% 40%)", ideology: -10, bloc: "non-aligned", population: 16, gdpPerCapita: 900, leader: "Haile Selassie", leaderTitle: "Emperor", successor: "ETH" },
    { id: "BRA", name: "Brazil", formalName: "United States of Brazil", government: "presidential-republic", colour: "hsl(124 34% 32%)", ideology: -10, bloc: "entente", population: 34, gdpPerCapita: 2400, leader: "Getulio Vargas", leaderTitle: "President", successor: "BRA" },
    { id: "IND", name: "British India", formalName: "British India", government: "dependency", colour: "hsl(30 44% 46%)", ideology: -18, bloc: "british-empire", population: 350, gdpPerCapita: 800, leader: "Lord Irwin", leaderTitle: "Viceroy", successor: "IND" },
    { id: "CAN", name: "Dominion of Canada", formalName: "Dominion of Canada", government: "constitutional-monarchy", colour: "hsl(0 60% 48%)", ideology: -10, bloc: "entente", population: 10, gdpPerCapita: 5200, leader: "R. B. Bennett", leaderTitle: "Prime Minister", successor: "CAN" },
    { id: "AUS", name: "Commonwealth of Australia", formalName: "Commonwealth of Australia", government: "constitutional-monarchy", colour: "hsl(226 50% 44%)", ideology: -8, bloc: "entente", population: 6.4, gdpPerCapita: 4600, leader: "James Scullin", leaderTitle: "Prime Minister", successor: "AUS" },
    { id: "NZL", name: "New Zealand", formalName: "Dominion of New Zealand", government: "parliamentary-republic", colour: "hsl(220 40% 54%)", ideology: -14, bloc: "entente", population: 1.3, gdpPerCapita: 4400, leader: "George Forbes", leaderTitle: "Prime Minister", successor: "NZL" },
    { id: "ZAF", name: "Union of South Africa", formalName: "Union of South Africa", government: "parliamentary-republic", colour: "hsl(140 34% 34%)", ideology: 6, bloc: "entente", population: 11, gdpPerCapita: 2600, leader: "J. B. M. Hertzog", leaderTitle: "Prime Minister", successor: "ZAF" },
    { id: "SAU", name: "Kingdom of Hejaz / Saudi Arabia", formalName: "Kingdom of Hejaz and Nejd", government: "absolute-monarchy", colour: "hsl(120 24% 38%)", ideology: -60, bloc: "none", population: 4, gdpPerCapita: 900, leader: "Ibn Saud", leaderTitle: "King", successor: "SAU" },
    { id: "IRN", name: "Iran", formalName: "Imperial State of Persia", government: "constitutional-monarchy", colour: "hsl(174 32% 40%)", ideology: -10, bloc: "none", population: 13, gdpPerCapita: 1200, leader: "Reza Shah", leaderTitle: "Shah", successor: "IRN" },
    { id: "AFG", name: "Afghanistan", formalName: "Kingdom of Afghanistan", government: "absolute-monarchy", colour: "hsl(16 36% 44%)", ideology: -30, bloc: "none", population: 8, gdpPerCapita: 900, leader: "Mohammad Nadir Shah", leaderTitle: "King", successor: "AFG" },
    { id: "COL", name: "Colombia", formalName: "Republic of Colombia", government: "presidential-republic", colour: "hsl(48 60% 48%)", ideology: -18, bloc: "entente", population: 8, gdpPerCapita: 1900, leader: "Miguel Abadia Mendez", leaderTitle: "President", successor: "COL" },
    { id: "MEX", name: "Mexico", formalName: "United States of Mexico", government: "presidential-republic", colour: "hsl(120 26% 38%)", ideology: -22, bloc: "entente", population: 15, gdpPerCapita: 2200, leader: "Lazaro Cardenas", leaderTitle: "President", successor: "MEX" },
  ],
  control: {
    "826": "GBR", "356": "GBR", "458": "GBR", "404": "GBR", "296": "GBR", "548": "GBR", "090": "GBR", "540": "GBR", "702": "GBR", "086": "GBR", "626": "GBR", "882": "GBR", "124": "CAN", "036": "AUS", "554": "NZL", "710": "ZAF",
    "250": "FRA", "266": "FRA", "270": "FRA", "324": "FRA", "624": "FRA", "204": "FRA", "108": "FRA", "148": "FRA", "818": "FRA", "512": "FRA", "434": "FRA", "352": "FRA", "304": "FRA",
    "276": "DEU", "050": "DEU",
    "380": "ITA", "499": "ITA", "214": "ITA", "232": "ITA", "368": "ITA", "729": "ITA",
    "392": "JPN", "158": "JPN", "410": "JPN", "156": "CHN", "704": "JPN", "104": "JPN", "496": "JPN",
    "643": "USS", "398": "USS", "417": "USS", "860": "USS", "795": "USS", "762": "USS", "268": "USS",
    "840": "USA", "630": "USA", "084": "USA", "340": "USA", "152": "USA",
    "724": "ESP", "188": "ESP", "504": "ESP", "222": "ESP", "320": "ESP", "558": "ESP",
    "616": "POL", "203": "CZE", "703": "CZE", "705": "POL",
    "792": "TUR", "300": "TUR", "807": "TUR",
    "231": "ETH", "000": "ITA",
    "076": "BRA", "170": "COL", "484": "MEX",
    "682": "SAU", "364": "IRN", "004": "AFG",
  },
  dependencies: {
    GBR: { IND: "colony", CAN: "dominion", AUS: "dominion", NZL: "dominion", ZAF: "dominion", KEN: "protectorate", MMR: "colony", IRQ: "mandate", PAL: "mandate", TCD: "mandate" }, // eslint-disable-line
    FRA: { VNM: "colony", CMR: "mandate", SYR: "mandate", LBN: "mandate", MAR: "protectorate", NGA: "mandate", TUN: "colony", DAH: "colony" }, // eslint-disable-line
    DEU: { TZA: "mandate", CMR2: "mandate", NAM: "mandate", TGO: "mandate", NGA2: "mandate" }, // eslint-disable-line
    JPN: { TWN: "colony", KOR: "colony", MNG: "protectorate", MYS: "protectorate", SDV: "mandate" }, // eslint-disable-line
    ITA: { LBY: "colony", ERI: "colony", ALB: "colony", SOM: "colony", TJK: "protectorate" }, // eslint-disable-line
    USS: { TKM: "colony", TBL: "protectorate", AFG2: "protectorate" }, // eslint-disable-line
    CHN: { TIB: "protectorate", XAN: "protectorate" }, // eslint-disable-line
    BEL: { COD: "colony" },
    PRT: { AGO: "colony", MOZ: "colony", GNB: "colony", TLS: "colony", MAC: "colony" }, // eslint-disable-line
    NLD: { IDN: "colony", NPL: "protectorate", GUM: "colony" }, // eslint-disable-line
  }
};

// ===========================================================================
// 1950 -- early Cold War, decolonisation in full swing
// ===========================================================================

export const ERA_1950: EraDefinition = {
  era: "1950",
  polities: [
    { id: "USA", name: "United States", formalName: "United States of America", government: "presidential-republic", colour: "hsl(214 46% 40%)", ideology: 4, bloc: "allies", population: 158, gdpPerCapita: 9000, leader: "Harry S. Truman", leaderTitle: "President", successor: "USA" },
    { id: "USS", name: "Soviet Union", formalName: "Union of Soviet Socialist Republics", government: "one-party-state", colour: "hsl(2 62% 48%)", ideology: -78, bloc: "warsaw-pact", population: 180, gdpPerCapita: 3900, leader: "Joseph Stalin", leaderTitle: "General Secretary", successor: "RUS" },
    { id: "GBR", name: "United Kingdom", formalName: "United Kingdom of Great Britain and Northern Ireland", government: "constitutional-monarchy", colour: "hsl(352 64% 44%)", ideology: -8, bloc: "allies", population: 50, gdpPerCapita: 6600, leader: "Clement Attlee", leaderTitle: "Prime Minister", successor: "GBR" },
    { id: "FRA", name: "France", formalName: "French Republic", government: "parliamentary-republic", colour: "hsl(222 58% 42%)", ideology: 2, bloc: "allies", population: 42, gdpPerCapita: 5600, leader: "Vincent Auriol", leaderTitle: "President of the Republic", successor: "FRA" },
    { id: "CHN", name: "People's Republic of China", formalName: "Zhonghua Renmin Gongheguo", government: "one-party-state", colour: "hsl(6 46% 46%)", ideology: -62, bloc: "soviet-bloc", population: 552, gdpPerCapita: 700, leader: "Mao Zedong", leaderTitle: "Chairman of the Central People's Government", successor: "CHN" },
    { id: "IND", name: "India", formalName: "Republic of India", government: "parliamentary-republic", colour: "hsl(30 52% 48%)", ideology: -20, bloc: "non-aligned", population: 389, gdpPerCapita: 1100, leader: "Jawaharlal Nehru", leaderTitle: "Prime Minister", successor: "IND" },
    { id: "DEU", name: "West Germany", formalName: "Bundesrepublik Deutschland", government: "parliamentary-republic", colour: "hsl(40 34% 44%)", ideology: -6, bloc: "allies", population: 51, gdpPerCapita: 5200, leader: "Theodor Heuss", leaderTitle: "Federal President", successor: "DEU" },
    { id: "EAS", name: "East Germany", formalName: "Deutsche Demokratische Republik", government: "one-party-state", colour: "hsl(36 44% 44%)", ideology: -70, bloc: "comecon", population: 17, gdpPerCapita: 4200, leader: "Otto Grotewohl", leaderTitle: "Prime Minister", successor: "DEU" },
    { id: "JPN", name: "Japan", formalName: "Japan", government: "constitutional-monarchy", colour: "hsl(358 50% 40%)", ideology: -14, bloc: "allies", population: 83, gdpPerCapita: 2200, leader: "Shigeru Yoshida", leaderTitle: "Prime Minister", successor: "JPN" },
    { id: "ITA", name: "Italy", formalName: "Repubblica Italiana", government: "parliamentary-republic", colour: "hsl(88 30% 34%)", ideology: -18, bloc: "allies", population: 47, gdpPerCapita: 3400, leader: "Alcide De Gasperi", leaderTitle: "Prime Minister", successor: "ITA" },
    { id: "PRK", name: "North Korea", formalName: "Korean People's Republic", government: "one-party-state", colour: "hsl(206 46% 44%)", ideology: -74, bloc: "comecon", population: 10, gdpPerCapita: 700, leader: "Kim Il Sung", leaderTitle: "Premier", successor: "PRK" },
    { id: "KOR", name: "South Korea", formalName: "Republic of Korea", government: "presidential-republic", colour: "hsl(214 40% 56%)", ideology: -10, bloc: "allies", population: 19, gdpPerCapita: 800, leader: "Syngman Rhee", leaderTitle: "President", successor: "KOR" },
    { id: "PRC", name: "People's Republic of China (mainland claim)", formalName: "PRC", government: "one-party-state", colour: "hsl(6 46% 46%)", ideology: -62, bloc: "soviet-bloc", population: 0, gdpPerCapita: 0, leader: "Mao Zedong", leaderTitle: "Chairman", successor: "CHN" },
    { id: "TWN", name: "Republic of China", formalName: "Republic of China (Taiwan)", government: "presidential-republic", colour: "hsl(214 40% 56%)", ideology: -18, bloc: "non-aligned", population: 8, gdpPerCapita: 1300, leader: "Chiang Kai-shek", leaderTitle: "President", successor: "TWN" },
    { id: "ESP", name: "Spain", formalName: "Estado Español", government: "absolute-monarchy", colour: "hsl(42 54% 42%)", ideology: -54, bloc: "none", population: 28, gdpPerCapita: 2200, leader: "Francisco Franco", leaderTitle: "Caudillo", successor: "ESP" },
    { id: "ISR", name: "Israel", formalName: "State of Israel", government: "parliamentary-republic", colour: "hsl(206 60% 56%)", ideology: 10, bloc: "none", population: 1.3, gdpPerCapita: 4600, leader: "David Ben-Gurion", leaderTitle: "Prime Minister", successor: "ISR" },
    { id: "SAU", name: "Saudi Arabia", formalName: "Kingdom of Saudi Arabia", government: "absolute-monarchy", colour: "hsl(120 24% 38%)", ideology: -60, bloc: "none", population: 4, gdpPerCapita: 6000, leader: "Ibn Saud", leaderTitle: "King", successor: "SAU" },
    { id: "EGY", name: "Egypt", formalName: "Kingdom of Egypt", government: "constitutional-monarchy", colour: "hsl(40 40% 44%)", ideology: -20, bloc: "allies", population: 21, gdpPerCapita: 1500, leader: "King Farouk", leaderTitle: "King", successor: "EGY" },
    { id: "NGA", name: "Nigeria", formalName: "Federal Republic of Nigeria", government: "federal-republic", colour: "hsl(104 30% 34%)", ideology: -14, bloc: "non-aligned", population: 38, gdpPerCapita: 900, leader: "Nnamdi Azikiwe", leaderTitle: "Governor-General", successor: "NGA" },
    { id: "PAK", name: "Pakistan", formalName: "Dominion of Pakistan", government: "parliamentary-republic", colour: "hsl(132 28% 34%)", ideology: -44, bloc: "non-aligned", population: 42, gdpPerCapita: 900, leader: "Khwaja Nazimuddin", leaderTitle: "Governor-General", successor: "PAK" },
    { id: "IDN", name: "Indonesia", formalName: "Republic of Indonesia", government: "parliamentary-republic", colour: "hsl(20 50% 46%)", ideology: -20, bloc: "non-aligned", population: 70, gdpPerCapita: 800, leader: "Sukarno", leaderTitle: "President", successor: "IDN" },
    { id: "VNM", name: "Democratic Republic of Vietnam", formalName: "Cộng hòa Dân chủ Việt Nam", government: "one-party-state", colour: "hsl(4 54% 48%)", ideology: -66, bloc: "soviet-bloc", population: 13, gdpPerCapita: 500, leader: "Ho Chi Minh", leaderTitle: "President", successor: "VNM" },
    { id: "BRA", name: "Brazil", formalName: "United States of Brazil", government: "presidential-republic", colour: "hsl(124 34% 32%)", ideology: -6, bloc: "allies", population: 54, gdpPerCapita: 2200, leader: "Getulio Vargas", leaderTitle: "President", successor: "BRA" },
    { id: "MEX", name: "Mexico", formalName: "United States of Mexico", government: "presidential-republic", colour: "hsl(120 26% 38%)", ideology: -14, bloc: "allies", population: 28, gdpPerCapita: 2600, leader: "Manuel Avila Camacho", leaderTitle: "President", successor: "MEX" },
    { id: "IRN", name: "Iran", formalName: "Imperial State of Iran", government: "constitutional-monarchy", colour: "hsl(174 32% 40%)", ideology: -6, bloc: "allies", population: 17, gdpPerCapita: 1700, leader: "Mohammad Reza Shah", leaderTitle: "Shah", successor: "IRN" },
    { id: "TUR", name: "Turkey", formalName: "Republic of Turkey", government: "presidential-republic", colour: "hsl(354 44% 46%)", ideology: -20, bloc: "allies", population: 21, gdpPerCapita: 2000, leader: "Ismet Inonu", leaderTitle: "President", successor: "TUR" },
  ],
  control: {
    "840": "USA", "630": "USA", "152": "USA", "032": "USA",
    "643": "USS", "398": "USS", "417": "USS", "860": "USS", "795": "USS", "762": "USS", "496": "USS", "268": "USS",
    "826": "GBR", "356": "GBR", "458": "GBR", "404": "GBR", "296": "GBR", "548": "GBR", "090": "GBR", "540": "GBR", "702": "GBR", "086": "GBR", "626": "GBR", "882": "GBR", "124": "GBR", "036": "GBR", "554": "GBR", "710": "GBR", "250": "FRA", "266": "FRA", "270": "FRA", "324": "FRA", "624": "FRA", "204": "FRA", "108": "FRA", "148": "FRA", "818": "FRA", "512": "FRA", "434": "FRA", "352": "FRA", "304": "FRA", "454": "FRA", "450": "FRA",
    "156": "CHN", "704": "CHN", "104": "CHN", "524": "CHN", "364": "CHN",
 "586": "IND", "050": "IND",
    "276": "DEU", "932": "EAS",
    "392": "JPN", "410": "KOR",
    "380": "ITA", "499": "ITA", "214": "ITA", "232": "ITA", "368": "ITA", "729": "ITA", "508": "ITA",
    "158": "TWN",
    "724": "ESP", "188": "ESP", "504": "ESP", "222": "ESP", "320": "ESP", "558": "ESP", "068": "ESP",
    "376": "ISR", "275": "ISR", "422": "ISR",
    "682": "SAU", "566": "NGA", "854": "NGA", "509": "NGA",
 "356y": "PAK",
    "360": "IDN",
    "076": "BRA", "484": "MEX", "792": "TUR",
  },
  dependencies: {
    USA: { PHL: "colony", PRT: "mandate", JPN: "occupation", DEU: "occupation", KOR: "occupation", TWN: "occupation" }, // eslint-disable-line
    GBR: { IND: "colony", NGA: "colony", KEN: "colony", ZAF: "colony", GHA: "colony", MMR: "colony", NPL: "colony", CYP: "colony", HKG: "colony", SGP: "colony", MLT: "colony", SUD: "colony", PAL: "mandate", ADEN: "colony" }, // eslint-disable-line
    FRA: { VNM: "colony", SYR: "colony", LBN: "colony", TUN: "colony", MOR: "colony", DJI: "colony", CAF: "colony", MLI: "colony", GAB: "colony", RWA: "mandate", CMR: "mandate" }, // eslint-disable-line
    DEU: { LIE: "protectorate" },
    BEI: { COD: "colony" },
    POR: { AGO: "colony", MOZ: "colony", ANG: "colony", GNB: "colony", TLS: "colony", MAC: "colony" }, // eslint-disable-line
    NLD: { IDN: "occupation", SUR: "colony" }
  }
};

// ===========================================================================
// 1990 -- the unipolar moment
// ===========================================================================

export const ERA_1990: EraDefinition = {
  era: "1990",
  polities: [
    { id: "USA", name: "United States", formalName: "United States of America", government: "presidential-republic", colour: "hsl(214 46% 40%)", ideology: 0, bloc: "nato", population: 250, gdpPerCapita: 24000, leader: "George H. W. Bush", leaderTitle: "President", successor: "USA" },
    { id: "USS", name: "Soviet Union", formalName: "Union of Soviet Socialist Republics", government: "one-party-state", colour: "hsl(2 62% 48%)", ideology: -70, bloc: "csto", population: 290, gdpPerCapita: 7600, leader: "Mikhail Gorbachev", leaderTitle: "General Secretary", successor: "RUS" },
    { id: "GBR", name: "United Kingdom", formalName: "United Kingdom of Great Britain and Northern Ireland", government: "constitutional-monarchy", colour: "hsl(352 64% 44%)", ideology: -18, bloc: "nato", population: 57, gdpPerCapita: 17000, leader: "Margaret Thatcher", leaderTitle: "Prime Minister", successor: "GBR" },
    { id: "FRA", name: "France", formalName: "French Republic", government: "semi-presidential-republic", colour: "hsl(222 58% 42%)", ideology: -8, bloc: "european-union", population: 58, gdpPerCapita: 18000, leader: "Francois Mitterrand", leaderTitle: "President of the Republic", successor: "FRA" },
    { id: "DEU", name: "Germany", formalName: "Bundesrepublik Deutschland", government: "parliamentary-republic", colour: "hsl(40 34% 44%)", ideology: -10, bloc: "european-union", population: 79, gdpPerCapita: 20000, leader: "Helmut Kohl", leaderTitle: "Chancellor", successor: "DEU" },
    { id: "JPN", name: "Japan", formalName: "Japan", government: "constitutional-monarchy", colour: "hsl(358 50% 40%)", ideology: -8, bloc: "nato", population: 124, gdpPerCapita: 24000, leader: "Sosuke Uno", leaderTitle: "Prime Minister", successor: "JPN" },
    { id: "CHN", name: "China", formalName: "People's Republic of China", government: "one-party-state", colour: "hsl(6 46% 46%)", ideology: -48, bloc: "non-aligned", population: 1135, gdpPerCapita: 1900, leader: "Jiang Zemin", leaderTitle: "General Secretary", successor: "CHN" },
    { id: "IND", name: "India", formalName: "Republic of India", government: "parliamentary-republic", colour: "hsl(30 52% 48%)", ideology: -30, bloc: "non-aligned", population: 873, gdpPerCapita: 1300, leader: "P. V. Narasimha Rao", leaderTitle: "Prime Minister", successor: "IND" },
    { id: "IRN", name: "Iran", formalName: "Islamic Republic of Iran", government: "theocracy", colour: "hsl(174 32% 40%)", ideology: -70, bloc: "oic", population: 56, gdpPerCapita: 6000, leader: "Ali Khamenei", leaderTitle: "Supreme Leader", successor: "IRN" },
    { id: "IRQ", name: "Iraq", formalName: "Republic of Iraq", government: "one-party-state", colour: "hsl(120 24% 36%)", ideology: -52, bloc: "non-aligned", population: 18, gdpPerCapita: 5500, leader: "Saddam Hussein", leaderTitle: "President", successor: "IRQ" },
    { id: "SAU", name: "Saudi Arabia", formalName: "Kingdom of Saudi Arabia", government: "absolute-monarchy", colour: "hsl(120 24% 38%)", ideology: -58, bloc: "gulf-cooperation-council", population: 16, gdpPerCapita: 11500, leader: "King Fahd", leaderTitle: "King", successor: "SAU" },
    { id: "ISR", name: "Israel", formalName: "State of Israel", government: "parliamentary-republic", colour: "hsl(206 60% 56%)", ideology: 18, bloc: "nato", population: 4.9, gdpPerCapita: 14000, leader: "Yitzhak Shamir", leaderTitle: "Prime Minister", successor: "ISR" },
    { id: "BRA", name: "Brazil", formalName: "Federative Republic of Brazil", government: "presidential-republic", colour: "hsl(124 34% 32%)", ideology: -20, bloc: "mercosur", population: 150, gdpPerCapita: 4700, leader: "Fernando Collor", leaderTitle: "President", successor: "BRA" },
    { id: "ZAF", name: "South Africa", formalName: "Republic of South Africa", government: "parliamentary-republic", colour: "hsl(140 34% 34%)", ideology: 8, bloc: "non-aligned", population: 37, gdpPerCapita: 4900, leader: "F. W. de Klerk", leaderTitle: "State President", successor: "ZAF" },
    { id: "PRK", name: "North Korea", formalName: "Democratic People's Republic of Korea", government: "one-party-state", colour: "hsl(206 46% 44%)", ideology: -74, bloc: "non-aligned", population: 23, gdpPerCapita: 2000, leader: "Kim Il Sung", leaderTitle: "General Secretary", successor: "PRK" },
    { id: "YUG", name: "Yugoslavia", formalName: "Socialist Federal Republic of Yugoslavia", government: "one-party-state", colour: "hsl(200 30% 46%)", ideology: -46, bloc: "non-aligned", population: 24, gdpPerCapita: 4600, leader: "Milan Kucan", leaderTitle: "President", successor: "SRB" },
    { id: "CUB", name: "Cuba", formalName: "Republic of Cuba", government: "one-party-state", colour: "hsl(2 52% 50%)", ideology: -60, bloc: "non-aligned", population: 11, gdpPerCapita: 2700, leader: "Fidel Castro", leaderTitle: "President of the Council of State", successor: "CUB" },
    { id: "ROU", name: "Romania", formalName: "Socialist Republic of Romania", government: "one-party-state", colour: "hsl(352 42% 46%)", ideology: -54, bloc: "comecon", population: 23, gdpPerCapita: 5200, leader: "Ion Iliescu", leaderTitle: "President", successor: "ROU" },
  ],
  control: {
    "840": "USA", "630": "USA", "158": "USA",
    "643": "USS", "398": "USS", "417": "USS", "860": "USS", "795": "USS", "762": "USS", "496": "USS", "268": "USS", "048": "USA",
    "826": "GBR", "356": "GBR", "458": "GBR", "404": "GBR", "296": "GBR", "548": "GBR", "090": "GBR", "540": "GBR", "702": "GBR", "086": "GBR", "626": "GBR", "882": "GBR", "124": "GBR", "036": "GBR", "554": "GBR", "710": "GBR", "250": "FRA", "266": "FRA", "270": "FRA", "324": "FRA", "624": "FRA", "204": "FRA", "108": "FRA", "148": "FRA", "434": "FRA", "512": "FRA", "180": "FRA",
    "276": "DEU", "352": "DEU", "304": "DEU",
    "392": "JPN",
    "156": "CHN", "704": "CHN", "104": "CHN", "524": "CHN",
 "050": "IND", "586": "IND",
    "364": "IRN", "368": "IRQ", "682": "SAU", "376": "ISR", "275": "ISR",
    "076": "BRA", "408": "PRK", "716": "ZAF",
    "688": "YUG", "807": "YUG", "499": "YUG", "703": "YUG", "705": "YUG", "642": "YUG", "348": "YUG", "203": "YUG",
    "192": "CUB",
  },
  dependencies: {
    GBR: { HKG: "colony", MAC: "colony", CYP: "colony", VGB: "colony", BMU: "colony", FRO: "colony", GIB: "colony" }, // eslint-disable-line
    FRA: { GUF: "colony", GLF: "colony", MTQ: "colony", REU: "colony", NCL: "colony" }, // eslint-disable-line
    USA: { PRI: "territory", VIR: "territory", ASM: "territory", GUM: "territory", MNP: "territory" }, // eslint-disable-line
    PRT: { MAC: "colony" },
    NLD: { CUW: "territory", ABW: "territory", SXM: "territory" },
    VUT: { SLB: "protectorate", VUT: "protectorate", TUV: "protectorate" }, // eslint-disable-line
  }
};

export const ERAS: Record<string, EraDefinition> = {
  "1900": ERA_1900,
  "1930": ERA_1930,
  "1950": ERA_1950,
  "1990": ERA_1990
};

export function eraFor(year: number): EraDefinition | undefined {
  if (year <= 1900) return ERA_1900;
  if (year < 1930) return ERA_1900;
  if (year < 1950) return ERA_1930;
  if (year < 1990) return ERA_1950;
  if (year < 2010) return ERA_1990;
  return undefined;
}
