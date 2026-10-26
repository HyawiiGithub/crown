import type {
  Bloc,
  Continent,
  GovernmentType,
  Ideology,
  Iso3,
  IsoNumeric,
  Region,
} from "../shared/types";

/**
 * The 2026 baseline world: 197 sovereign states.
 *
 * Every scenario in `src/data/scenarios` is a *patch* on top of this table, so a
 * country added here is immediately available in all eight scenarios.
 *
 * Historical polities (German Empire, Kingdom of Italy, the USSR, ...) are NOT
 * listed here. They are defined in `src/data/historical.ts` as *control claims*
 * over this geometry set, which is how the map renders 1900 and 1930 without
 * needing a separate 1900 shapefile. See `POLITY_CLAIMS`.
 *
 * Column layout (deliberately terse -- there are 197 of these):
 *   0 isoNumeric  1 iso3  2 iso2  3 name  4 demonym  5 continent  6 region
 *   7 government  8 population (millions)  9 gdpPerCapita (credits, 2026)
 *   10 ideology (-100 far-left .. +100 far-right)  11 bloc
 *
 * `gdpPerCapita` is in credits where 1 credit == 1 USD at the 2026 rate.
 * Scenarios that need pounds, francs or roubles revalue via the scenario's
 * exchange table, so the engine never has to care.
 */
export type CountryRow = readonly [
  IsoNumeric,
  Iso3,
  string,
  string,
  string,
  Continent,
  Region,
  GovernmentType,
  number,
  number,
  number,
  Bloc,
];

export const COUNTRY_ROWS: readonly CountryRow[] = [
  // ---- Africa -------------------------------------------------------------
  ["004", "DZA", "DZ", "Algeria", "Algerian", "Africa", "africa", "semi-presidential-republic", 47, 5600, -20, "non-aligned"],
  ["024", "AGO", "AO", "Angola", "Angolan", "Africa", "africa", "presidential-republic", 39, 2700, -44, "non-aligned"],
  ["204", "BEN", "BJ", "Benin", "Beninese", "Africa", "africa", "presidential-republic", 14, 1500, -18, "non-aligned"],
  ["064", "BWA", "BW", "Botswana", "Botswanan", "Africa", "africa", "presidential-republic", 2.7, 8300, -22, "au"],
  ["854", "BFA", "BF", "Burkina Faso", "Burkinabe", "Africa", "africa", "military-junta", 24, 1000, -10, "non-aligned"],
  ["108", "BDI", "BI", "Burundi", "Burundian", "Africa", "africa", "presidential-republic", 14, 260, -30, "au"],
  ["140", "CAF", "CF", "Central African Republic", "Central African", "Africa", "africa", "presidential-republic", 5.7, 500, -12, "au"],
  ["148", "TCD", "TD", "Chad", "Chadian", "Africa", "africa", "presidential-republic", 19, 730, -8, "non-aligned"],
  ["174", "COM", "KM", "Comoros", "Comoran", "Africa", "africa", "presidential-republic", 0.9, 1700, -24, "non-aligned"],
  ["178", "COG", "CG", "Congo", "Congolese", "Africa", "africa", "presidential-republic", 6, 2900, -14, "non-aligned"],
  ["180", "COD", "CD", "DR Congo", "Congolese", "Africa", "africa", "semi-presidential-republic", 109, 700, -6, "au"],
  ["384", "CIV", "CI", "Côte d'Ivoire", "Ivorian", "Africa", "africa", "presidential-republic", 32, 2700, -26, "au"],
  ["262", "DJI", "DJ", "Djibouti", "Djiboutian", "Africa", "africa", "presidential-republic", 1.2, 4000, -10, "au"],
  ["818", "EGY", "EG", "Egypt", "Egyptian", "Africa", "africa", "semi-presidential-republic", 118, 4500, -34, "oic"],
  ["226", "GNQ", "GQ", "Equatorial Guinea", "Equatoguinean", "Africa", "africa", "presidential-republic", 1.9, 6100, -50, "non-aligned"],
  ["232", "ERI", "ER", "Eritrea", "Eritrean", "Africa", "africa", "one-party-state", 3.8, 900, -60, "non-aligned"],
  ["748", "SWZ", "SZ", "Eswatini", "Swazi", "Africa", "africa", "absolute-monarchy", 1.3, 4200, -46, "au"],
  ["231", "ETH", "ET", "Ethiopia", "Ethiopian", "Africa", "africa", "federal-republic", 132, 1400, -18, "non-aligned"],
  ["266", "GAB", "GA", "Gabon", "Gabonese", "Africa", "africa", "presidential-republic", 2.6, 8600, -22, "non-aligned"],
  ["270", "GMB", "GM", "Gambia", "Gambian", "Africa", "africa", "presidential-republic", 2.8, 900, -16, "au"],
  ["288", "GHA", "GH", "Ghana", "Ghanaian", "Africa", "africa", "presidential-republic", 34, 2700, -30, "au"],
  ["324", "GIN", "GN", "Guinea", "Guinean", "Africa", "africa", "presidential-republic", 15, 1700, -14, "non-aligned"],
  ["624", "GNB", "GW", "Guinea-Bissau", "Bissau-Guinean", "Africa", "africa", "semi-presidential-republic", 2.3, 1000, -16, "au"],
  ["404", "KEN", "KE", "Kenya", "Kenyan", "Africa", "africa", "presidential-republic", 57, 2300, -26, "au"],
  ["296", "KIR", "KI", "Kiribati", "I-Kiribati", "Oceania", "oceania", "parliamentary-republic", 0.14, 2100, -20, "au"],
  ["426", "LSO", "LS", "Lesotho", "Basotho", "Africa", "africa", "parliamentary-republic", 2.4, 1100, -24, "au"],
  ["430", "LBR", "LR", "Liberia", "Liberian", "Africa", "africa", "presidential-republic", 5.6, 900, -14, "au"],
  ["434", "LBY", "LY", "Libya", "Libyan", "Africa", "africa", "military-junta", 7.5, 7300, -30, "non-aligned"],
  ["450", "MDG", "MG", "Madagascar", "Malagasy", "Africa", "africa", "semi-presidential-republic", 32, 550, -26, "au"],
  ["454", "MWI", "MW", "Malawi", "Malawian", "Africa", "africa", "presidential-republic", 21, 480, -34, "au"],
  ["466", "MLI", "ML", "Mali", "Malian", "Africa", "africa", "military-junta", 24, 900, -8, "non-aligned"],
  ["478", "MRT", "MR", "Mauritania", "Mauritanian", "Africa", "africa", "presidential-republic", 5.2, 2700, -40, "non-aligned"],
  ["480", "MUS", "MU", "Mauritius", "Mauritian", "Africa", "africa", "parliamentary-republic", 1.3, 13000, -16, "au"],
  ["504", "MAR", "MA", "Morocco", "Moroccan", "Africa", "africa", "absolute-monarchy", 38, 3900, -40, "oic"],
  ["508", "MOZ", "MZ", "Mozambique", "Mozambican", "Africa", "africa", "presidential-republic", 35, 700, -44, "non-aligned"],
  ["516", "NAM", "NA", "Namibia", "Namibian", "Africa", "africa", "presidential-republic", 3.1, 4900, -34, "au"],
  ["562", "NER", "NE", "Niger", "Nigerien", "Africa", "africa", "military-junta", 27, 700, -6, "non-aligned"],
  ["566", "NGA", "NG", "Nigeria", "Nigerian", "Africa", "africa", "federal-republic", 232, 1900, -20, "au"],
  ["646", "RWA", "RW", "Rwanda", "Rwandan", "Africa", "africa", "presidential-republic", 14, 1100, -24, "au"],
  ["686", "SEN", "SN", "Senegal", "Senegalese", "Africa", "africa", "semi-presidential-republic", 19, 1900, -32, "au"],
  ["694", "SLE", "SL", "Sierra Leone", "Sierra Leonean", "Africa", "africa", "presidential-republic", 8.8, 800, -30, "au"],
  ["706", "SOM", "SO", "Somalia", "Somali", "Africa", "africa", "federal-republic", 19, 700, -20, "non-aligned"],
  ["710", "ZAF", "ZA", "South Africa", "South African", "Africa", "africa", "parliamentary-republic", 64, 6800, -36, "brics"],
  ["728", "SSD", "SS", "South Sudan", "South Sudanese", "Africa", "africa", "presidential-republic", 12, 900, -30, "au"],
  ["729", "SDN", "SD", "Sudan", "Sudanese", "Africa", "africa", "military-junta", 50, 900, -56, "non-aligned"],
  ["834", "TZA", "TZ", "Tanzania", "Tanzanian", "Africa", "africa", "presidential-republic", 68, 1300, -34, "au"],
  ["768", "TGO", "TG", "Togo", "Togolese", "Africa", "africa", "presidential-republic", 9.5, 1100, -18, "au"],
  ["788", "TUN", "TN", "Tunisia", "Tunisian", "Africa", "africa", "semi-presidential-republic", 12, 4000, -32, "non-aligned"],
  ["800", "UGA", "UG", "Uganda", "Ugandan", "Africa", "africa", "presidential-republic", 50, 1100, -30, "au"],
  ["894", "ZMB", "ZM", "Zambia", "Zambian", "Africa", "africa", "presidential-republic", 21, 1600, -26, "au"],
  ["716", "ZWE", "ZW", "Zimbabwe", "Zimbabwean", "Africa", "africa", "presidential-republic", 17, 2200, -24, "non-aligned"],

  // ---- Americas -----------------------------------------------------------
  ["028", "ATG", "AG", "Antigua and Barbuda", "Antiguan", "North America", "americas", "parliamentary-republic", 0.1, 24000, -12, "non-aligned"],
  ["032", "ARG", "AR", "Argentina", "Argentine", "South America", "americas", "presidential-republic", 46, 13700, -56, "mercosur"],
  ["052", "BRB", "BB", "Barbados", "Barbadian", "North America", "americas", "parliamentary-republic", 0.28, 23000, -20, "non-aligned"],
  ["084", "BLZ", "BZ", "Belize", "Belizean", "North America", "americas", "parliamentary-republic", 0.42, 7200, -18, "non-aligned"],
  ["076", "BRA", "BR", "Brazil", "Brazilian", "South America", "americas", "presidential-republic", 213, 10300, -34, "brics"],
  ["068", "BOL", "BO", "Bolivia", "Bolivian", "South America", "americas", "presidential-republic", 12, 4200, -52, "non-aligned"],
  ["212", "DMA", "DM", "Dominica", "Dominican", "North America", "americas", "parliamentary-republic", 0.07, 13000, -20, "non-aligned"],
  ["214", "DOM", "DO", "Dominican Republic", "Dominican", "North America", "americas", "presidential-republic", 11, 10500, -30, "non-aligned"],
  ["218", "ECU", "EC", "Ecuador", "Ecuadorian", "South America", "americas", "presidential-republic", 18, 6700, -34, "non-aligned"],
  ["222", "SLV", "SV", "El Salvador", "Salvadoran", "North America", "americas", "presidential-republic", 6.4, 5500, 12, "non-aligned"],
  ["242", "FJI", "FJ", "Fiji", "Fijian", "Oceania", "oceania", "parliamentary-republic", 1, 6200, -18, "non-aligned"],
  ["320", "GTM", "GT", "Guatemala", "Guatemalan", "North America", "americas", "semi-presidential-republic", 18, 5900, -22, "non-aligned"],
  ["328", "GUY", "GY", "Guyana", "Guyanese", "South America", "americas", "presidential-republic", 0.83, 25000, -24, "non-aligned"],
  ["332", "HTI", "HT", "Haiti", "Haitian", "North America", "americas", "semi-presidential-republic", 11.8, 1700, -40, "non-aligned"],
  ["340", "HND", "HN", "Honduras", "Honduran", "North America", "americas", "presidential-republic", 10.8, 3200, -28, "non-aligned"],
  ["388", "JAM", "JM", "Jamaica", "Jamaican", "North America", "americas", "parliamentary-republic", 2.8, 6800, -24, "non-aligned"],
  ["484", "MEX", "MX", "Mexico", "Mexican", "North America", "americas", "federal-republic", 131, 14100, -16, "usmca"],
  ["558", "NIC", "NI", "Nicaragua", "Nicaraguan", "North America", "americas", "presidential-republic", 7, 2700, -48, "non-aligned"],
  ["591", "PAN", "PA", "Panama", "Panamanian", "North America", "americas", "presidential-republic", 4.6, 19000, -26, "non-aligned"],
  ["600", "PRY", "PY", "Paraguay", "Paraguayan", "South America", "americas", "presidential-republic", 7.4, 6300, -30, "mercosur"],
  ["604", "PER", "PE", "Peru", "Peruvian", "South America", "americas", "presidential-republic", 34, 8200, -36, "non-aligned"],
  ["630", "PRI", "PR", "Puerto Rico", "Puerto Rican", "North America", "americas", "dependency", 3.2, 37000, -20, "usmca"],
  ["780", "TTO", "TT", "Trinidad and Tobago", "Trinidadian", "North America", "americas", "parliamentary-republic", 1.5, 20000, -22, "non-aligned"],
  ["858", "URY", "UY", "Uruguay", "Uruguayan", "South America", "americas", "presidential-republic", 3.4, 21000, -40, "mercosur"],
  ["862", "VEN", "VE", "Venezuela", "Venezuelan", "South America", "americas", "federal-republic", 28, 3600, -60, "non-aligned"],
  ["124", "CAN", "CA", "Canada", "Canadian", "North America", "americas", "federal-republic", 41, 54000, -28, "usmca"],
  ["840", "USA", "US", "United States", "American", "North America", "americas", "federal-republic", 342, 86000, -18, "nato"],

  // ---- Asia ---------------------------------------------------------------
  ["051", "ARM", "AM", "Armenia", "Armenian", "Asia", "asia", "parliamentary-republic", 3, 8500, -14, "sco"],
  ["031", "AZE", "AZ", "Azerbaijan", "Azerbaijani", "Asia", "asia", "presidential-republic", 10, 8500, -20, "sco"],
  ["050", "BGD", "BD", "Bangladesh", "Bangladeshi", "Asia", "asia", "parliamentary-republic", 174, 2700, -52, "non-aligned"],
  ["048", "BHR", "BH", "Bahrain", "Bahraini", "Asia", "middle-east", "absolute-monarchy", 1.6, 30200, -46, "gulf-cooperation-council"],
  ["064", "BTN", "BT", "Bhutan", "Bhutanese", "Asia", "asia", "absolute-monarchy", 0.8, 3900, -30, "non-aligned"],
  ["096", "BRN", "BN", "Brunei", "Bruneian", "Asia", "asia", "absolute-monarchy", 0.46, 32000, -50, "asean"],
  ["116", "KHM", "KH", "Cambodia", "Cambodian", "Asia", "asia", "constitutional-monarchy", 17, 1700, -44, "asean"],
  ["152", "CHL", "CL", "Chile", "Chilean", "South America", "americas", "presidential-republic", 20, 17600, -32, "mercosur"],
  ["156", "CHN", "CN", "China", "Chinese", "Asia", "asia", "one-party-state", 1408, 13600, -64, "brics"],
  ["170", "COL", "CO", "Colombia", "Colombian", "South America", "americas", "presidential-republic", 53, 7700, -34, "non-aligned"],
  ["144", "LKA", "LK", "Sri Lanka", "Sri Lankan", "Asia", "asia", "semi-presidential-republic", 23, 4700, -36, "non-aligned"],
  ["360", "IDN", "ID", "Indonesia", "Indonesian", "Asia", "asia", "presidential-republic", 285, 5200, -30, "asean"],
  ["364", "IRN", "IR", "Iran", "Iranian", "Asia", "middle-east", "theocracy", 92, 4500, -74, "oic"],
  ["368", "IRQ", "IQ", "Iraq", "Iraqi", "Asia", "middle-east", "parliamentary-republic", 46, 6000, -50, "oic"],
  ["376", "ISR", "IL", "Israel", "Israeli", "Asia", "middle-east", "parliamentary-republic", 9.8, 55000, -20, "nato"],
  ["392", "JPN", "JP", "Japan", "Japanese", "Asia", "asia", "constitutional-monarchy", 123, 34000, -16, "nato"],
  ["368", "JOR", "JO", "Jordan", "Jordanian", "Asia", "middle-east", "absolute-monarchy", 11.5, 4600, -40, "oic"],
  ["398", "KAZ", "KZ", "Kazakhstan", "Kazakh", "Asia", "asia", "semi-presidential-republic", 20, 13200, -30, "sco"],
  ["414", "KWT", "KW", "Kuwait", "Kuwaiti", "Asia", "middle-east", "absolute-monarchy", 4.9, 44000, -46, "gulf-cooperation-council"],
  ["417", "KGZ", "KG", "Kyrgyzstan", "Kyrgyz", "Asia", "asia", "parliamentary-republic", 7.2, 2000, -16, "sco"],
  ["422", "LBN", "LB", "Lebanon", "Lebanese", "Asia", "middle-east", "parliamentary-republic", 5.6, 4000, -34, "oic"],
  ["446", "MAC", "MO", "Macao", "Macanese", "Asia", "asia", "dependency", 0.7, 62000, -30, "none"],
  ["458", "MYS", "MY", "Malaysia", "Malaysian", "Asia", "asia", "constitutional-monarchy", 35, 12900, -34, "asean"],
  ["496", "MNG", "MN", "Mongolia", "Mongolian", "Asia", "asia", "semi-presidential-republic", 3.5, 5300, -10, "non-aligned"],
  ["104", "MMR", "MM", "Myanmar", "Burmese", "Asia", "asia", "military-junta", 55, 1400, -66, "asean"],
  ["512", "OMN", "OM", "Oman", "Omani", "Asia", "middle-east", "absolute-monarchy", 5.3, 21000, -44, "gulf-cooperation-council"],
  ["586", "PAK", "PK", "Pakistan", "Pakistani", "Asia", "asia", "federal-republic", 251, 1700, -54, "oic"],
  ["591", "PSE", "PS", "Palestine", "Palestinian", "Asia", "middle-east", "semi-presidential-republic", 5.5, 3700, -60, "non-aligned"],
  ["598", "PNG", "PG", "Papua New Guinea", "Papua New Guinean", "Oceania", "oceania", "parliamentary-republic", 10.5, 3200, -26, "non-aligned"],
  ["344", "HKG", "HK", "Hong Kong", "Hongkonger", "Asia", "asia", "dependency", 7.5, 54000, -34, "none"],
  ["634", "QAT", "QA", "Qatar", "Qatari", "Asia", "middle-east", "absolute-monarchy", 3.1, 52000, -48, "gulf-cooperation-council"],
  ["642", "ROU", "RO", "Romania", "Romanian", "Europe", "europe", "semi-presidential-republic", 19, 19000, -28, "european-union"],
  ["643", "RUS", "RU", "Russia", "Russian", "Europe", "europe", "federal-republic", 144, 14500, -62, "brics"],
  ["682", "SAU", "SA", "Saudi Arabia", "Saudi", "Asia", "middle-east", "absolute-monarchy", 34, 32100, -54, "gulf-cooperation-council"],
  ["702", "SGP", "SG", "Singapore", "Singaporean", "Asia", "asia", "one-party-state", 6, 89000, -18, "asean"],
  ["760", "SYR", "SY", "Syria", "Syrian", "Asia", "middle-east", "presidential-republic", 23, 900, -60, "non-aligned"],
  ["158", "TWN", "TW", "Taiwan", "Taiwanese", "Asia", "asia", "semi-presidential-republic", 23, 38000, -26, "non-aligned"],
  ["762", "TJK", "TJ", "Tajikistan", "Tajik", "Asia", "asia", "presidential-republic", 10.5, 1300, -58, "sco"],
  ["764", "THA", "TH", "Thailand", "Thai", "Asia", "asia", "constitutional-monarchy", 72, 8300, -40, "asean"],
  ["626", "TLS", "TL", "Timor-Leste", "Timorese", "Asia", "asia", "semi-presidential-republic", 1.4, 1600, -24, "non-aligned"],
  ["792", "TUR", "TR", "Türkiye", "Turkish", "Asia", "middle-east", "presidential-republic", 86, 15700, -44, "nato"],
  ["795", "TKM", "TM", "Turkmenistan", "Turkmen", "Asia", "asia", "presidential-republic", 7.5, 9000, -62, "non-aligned"],
  ["860", "UZB", "UZ", "Uzbekistan", "Uzbek", "Asia", "asia", "presidential-republic", 37, 2600, -56, "sco"],
  ["784", "ARE", "AE", "United Arab Emirates", "Emirati", "Asia", "middle-east", "absolute-monarchy", 11, 49000, -48, "gulf-cooperation-council"],
  ["704", "VNM", "VN", "Vietnam", "Vietnamese", "Asia", "asia", "one-party-state", 101, 4600, -62, "asean"],
  ["887", "YEM", "YE", "Yemen", "Yemeni", "Asia", "middle-east", "presidential-republic", 40, 900, -56, "oic"],

  // ---- Europe -------------------------------------------------------------
  ["008", "ALB", "AL", "Albania", "Albanian", "Europe", "europe", "parliamentary-republic", 2.7, 8100, -14, "european-echelon"],
  ["040", "AUT", "AT", "Austria", "Austrian", "Europe", "europe", "parliamentary-republic", 9.1, 57000, -24, "european-union"],
  ["112", "BLR", "BY", "Belarus", "Belarusian", "Europe", "europe", "presidential-republic", 9.1, 8500, -50, "csto"],
  ["056", "BEL", "BE", "Belgium", "Belgian", "Europe", "europe", "federal-republic", 11.8, 54000, -26, "european-union"],
  ["070", "BIH", "BA", "Bosnia and Herzegovina", "Bosbian", "Europe", "europe", "federal-republic", 3.2, 8600, -24, "european-echelon"],
  ["100", "BGR", "BG", "Bulgaria", "Bulgarian", "Europe", "europe", "parliamentary-republic", 6.4, 18000, -32, "european-union"],
  ["203", "CZE", "CZ", "Czechia", "Czech", "Europe", "europe", "parliamentary-republic", 10.9, 32000, -24, "european-union"],
  ["208", "DNK", "DK", "Denmark", "Danish", "Europe", "europe", "constitutional-monarchy", 6, 71000, -20, "european-union"],
  ["233", "EST", "EE", "Estonia", "Estonian", "Europe", "europe", "parliamentary-republic", 1.4, 33000, -22, "european-union"],
  ["246", "FIN", "FI", "Finland", "Finnish", "Europe", "europe", "parliamentary-republic", 5.6, 56000, -26, "european-union"],
  ["250", "FRA", "FR", "France", "French", "Europe", "europe", "semi-presidential-republic", 68, 46000, -30, "european-union"],
  ["276", "DEU", "DE", "Germany", "German", "Europe", "europe", "parliamentary-republic", 84, 56000, -28, "european-union"],
  ["300", "GRC", "GR", "Greece", "Greek", "Europe", "europe", "parliamentary-republic", 10, 23000, -38, "european-union"],
  ["348", "HUN", "HU", "Hungary", "Hungarian", "Europe", "europe", "parliamentary-republic", 9.6, 22000, -34, "european-union"],
  ["352", "ISL", "IS", "Iceland", "Icelandic", "Europe", "europe", "parliamentary-republic", 0.4, 84000, -22, "nato"],
  ["372", "IRL", "IE", "Ireland", "Irish", "Europe", "europe", "parliamentary-republic", 5.4, 106000, -22, "european-union"],
  ["380", "ITA", "IT", "Italy", "Italian", "Europe", "europe", "parliamentary-republic", 59, 41000, -26, "european-union"],
  ["428", "LVA", "LV", "Latvia", "Latvian", "Europe", "europe", "parliamentary-republic", 1.8, 24000, -22, "european-union"],
  ["440", "LTU", "LT", "Lithuania", "Lithuanian", "Europe", "europe", "parliamentary-republic", 2.8, 32000, -20, "european-union"],
  ["442", "LUX", "LU", "Luxembourg", "Luxembourgish", "Europe", "europe", "constitutional-monarchy", 0.68, 132000, -20, "european-union"],
  ["499", "MNE", "ME", "Montenegro", "Montenegrin", "Europe", "europe", "parliamentary-republic", 0.62, 12200, -20, "european-echelon"],
  ["498", "MDA", "MD", "Moldova", "Moldovan", "Europe", "europe", "parliamentary-republic", 2.4, 7400, -28, "european-echelon"],
  ["524", "NPL", "NP", "Nepal", "Nepali", "Asia", "asia", "parliamentary-republic", 31, 1500, -42, "non-aligned"],
  ["528", "NLD", "NL", "Netherlands", "Dutch", "Europe", "europe", "constitutional-monarchy", 18, 64000, -22, "european-union"],
  ["578", "NOR", "NO", "Norway", "Norwegian", "Europe", "europe", "constitutional-monarchy", 5.6, 92000, -16, "nato"],
  ["616", "POL", "PL", "Poland", "Polish", "Europe", "europe", "parliamentary-republic", 36, 23000, -32, "european-union"],
  ["620", "PRT", "PT", "Portugal", "Portuguese", "Europe", "europe", "semi-presidential-republic", 10.4, 28000, -34, "european-union"],
  ["703", "SVK", "SK", "Slovakia", "Slovak", "Europe", "europe", "parliamentary-republic", 5.4, 26000, -24, "european-union"],
  ["688", "SRB", "RS", "Serbia", "Serbian", "Europe", "europe", "semi-presidential-republic", 6.6, 10500, -18, "non-aligned"],
  ["705", "SVN", "SI", "Slovenia", "Slovenian", "Europe", "europe", "parliamentary-republic", 2.1, 34000, -22, "european-union"],
  ["724", "ESP", "ES", "Spain", "Spanish", "Europe", "europe", "constitutional-monarchy", 49, 34000, -32, "european-union"],
  ["752", "SWE", "SE", "Sweden", "Swedish", "Europe", "europe", "constitutional-monarchy", 10.6, 61000, -18, "european-union"],
  ["756", "CHE", "CH", "Switzerland", "Swiss", "Europe", "europe", "confederation", 9, 106000, -14, "none"],
  ["804", "UKR", "UA", "Ukraine", "Ukrainian", "Europe", "europe", "semi-presidential-republic", 38, 5400, -50, "european-echelon"],
  ["826", "GBR", "GB", "United Kingdom", "British", "Europe", "europe", "constitutional-monarchy", 69, 53000, -26, "nato"],
  ["336", "VAT", "VA", "Vatican City", "Vatican", "Europe", "europe", "absolute-monarchy", 0.001, 21000, -80, "none"],

  // ---- Oceania ------------------------------------------------------------
  ["036", "AUS", "AU", "Australia", "Australian", "Oceania", "oceania", "federal-republic", 27, 65000, -26, "none"],
  ["554", "NZL", "NZ", "New Zealand", "New Zealand", "Oceania", "oceania", "parliamentary-republic", 5.3, 49000, -24, "none"],
  ["090", "SLB", "SB", "Solomon Islands", "Solomon Islander", "Oceania", "oceania", "parliamentary-republic", 0.75, 2700, -22, "non-aligned"],
  ["548", "VUT", "VU", "Vanuatu", "Ni-Vanuatu", "Oceania", "oceania", "parliamentary-republic", 0.34, 3400, -20, "non-aligned"],
  ["540", "NCL", "NC", "New Caledonia", "New Caledonian", "Oceania", "oceania", "dependency", 0.29, 39000, -20, "none"],
  ["882", "WSM", "WS", "Samoa", "Samoan", "Oceania", "oceania", "parliamentary-republic", 0.22, 4400, -20, "non-aligned"],
  ["776", "TON", "TO", "Tonga", "Tongan", "Oceania", "oceania", "constitutional-monarchy", 0.11, 4900, -18, "non-aligned"],
  ["583", "FSM", "FM", "Micronesia", "Micronesian", "Oceania", "oceania", "parliamentary-republic", 0.11, 3900, -22, "non-aligned"],
  ["585", "PLW", "PW", "Palau", "Palauan", "Oceania", "oceania", "presidential-republic", 0.018, 16000, -20, "none"],
];

export const COUNTRY_BY_ISO3: Record<string, CountryRow> = Object.fromEntries(
  COUNTRY_ROWS.filter((r) => r[8] > 0).map((r) => [r[1], r]),
);

export const COUNTRY_BY_NUMERIC: Record<string, CountryRow> = Object.fromEntries(
  COUNTRY_ROWS.filter((r) => r[8] > 0 && /^\d{3}$/.test(r[0])).map((r) => [r[0], r]),
);

export const ALL_ISO3: Iso3[] = COUNTRY_ROWS.filter((r) => r[8] > 0).map((r) => r[1] as Iso3);

export function countryRow(iso3: Iso3): CountryRow {
  const r = COUNTRY_BY_ISO3[iso3];
  if (!r) throw new Error(`Unknown country ${iso3}`);
  return r;
}

export function countryName(iso3: Iso3): string {
  return COUNTRY_BY_ISO3[iso3]?.[3] ?? iso3;
}

/** Deterministic, pleasant map colour so every polity reads as distinct. */
export function colourForCountry(iso3: Iso3): string {
  let h = 2166136261;
  for (let i = 0; i < iso3.length; i++) {
    h ^= iso3.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const hue = Math.abs(h) % 360;
  const sat = 26 + (Math.abs(h >> 8) % 16);
  const light = 44 + (Math.abs(h >> 16) % 14);
  return `hsl(${hue} ${sat}% ${light}%)`;
}

export const GOVERNMENT_TITLES: Record<GovernmentType, { hos: string; hog: string }> = {
  "absolute-monarchy": { hos: "Monarch", hog: "Prime Minister" },
  "constitutional-monarchy": { hos: "King", hog: "Prime Minister" },
  "parliamentary-republic": { hos: "President", hog: "Prime Minister" },
  "semi-presidential-republic": { hos: "President", hog: "Prime Minister" },
  "presidential-republic": { hos: "President", hog: "President" },
  "one-party-state": { hos: "General Secretary", hog: "Premier" },
  "military-junta": { hos: "Chairman", hog: "Prime Minister" },
  "monarchy-absolute-colonial": { hos: "Colonial Governor", hog: "Resident" },
  "federal-republic": { hos: "President", hog: "Prime Minister" },
  theocracy: { hos: "Supreme Leader", hog: "Prime Minister" },
  confederation: { hos: "President", hog: "President" },
  protectorate: { hos: "Resident", hog: "Chief Commissioner" },
  "mandate-colony": { hos: "High Commissioner", hog: "Administrator" },
  dependency: { hos: "Governor", hog: "Premier" },
  "occupied-territory": { hos: "Occupation Authority", hog: "Military Governor" },
  "breakaway-state": { hos: "President", hog: "Prime Minister" },
};

export function ideologyLabel(v: number): Ideology {
  if (v < -60) return "far-left";
  if (v < -25) return "left";
  if (v < -8) return "centre-left";
  if (v <= 8) return "centrist";
  if (v <= 25) return "centre-right";
  if (v <= 60) return "right";
  return "far-right";
}

export const REGION_LABELS: Record<Region, string> = {
  africa: "Africa",
  americas: "Americas",
  asia: "Asia",
  europe: "Europe",
  "middle-east": "Middle East",
  oceania: "Oceania",
};
