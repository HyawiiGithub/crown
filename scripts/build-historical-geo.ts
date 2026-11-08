/**
 * Builds the scenario basemaps used by the 1900, 1914 and 1930 maps.
 *
 * Source: the public "historical-basemaps" GeoJSON collection
 * (https://github.com/aourednik/historical-basemaps). The script keeps only the
 * geometry and attaches two small gameplay fields to every polygon:
 *
 *   p  the polity that owns it on day one (a scenario id such as GBR or RAJ)
 *   h  a modern land key, so later annexations and peace deals can recolour it
 *
 * Run with: npx tsx scripts/build-historical-geo.ts
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { geoArea, geoCentroid } from "d3-geo";
import { HISTORY } from "../src/data/history";
import { feature } from "topojson-client";
import { COUNTRY_BY_ISO3, COUNTRY_BY_NUMERIC, TERRITORY_OWNER } from "../src/data/countries";

const OUT = join(process.cwd(), "public", "geo");
const CACHE = join(process.cwd(), ".cache", "historical-basemaps");
const SOURCE = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";
const YEARS = [1900, 1914, 1930] as const;

type Year = (typeof YEARS)[number];
type Feature = {
  properties: Record<string, unknown>;
  geometry: { type: string; coordinates: unknown } | null;
};

/** Exact name mappings. Names are lowercased and stripped of punctuation first. */
const ALIASES: Record<Year, Record<string, string>> = {
  1900: {
    // British Empire and its dependencies
    "united kingdom of great britain and ireland": "GBR",
    "united kingdom": "GBR",
    "british raj": "RAJ",
    india: "RAJ",
    "princely states": "RAJ",
    ceylon: "CEY",
    canada: "CAN",
    "new south wales uk": "AUC",
    "victoria uk": "AUC",
    "queensland uk": "AUC",
    "south australia uk": "AUC",
    "western australia uk": "AUC",
    "northern territory uk": "AUC",
    "māori": "NZL",
    maori: "NZL",
    "new zealand": "NZL",
    "cape colony": "CPC",
    natal: "CPC",
    basutoland: "CPC",
    swaziland: "CPC",
    "griqualand west": "CPC",
    ngwato: "CPC",
    bechuanaland: "CPC",
    zululand: "CPC",
    transvaal: "SAR",
    "south african republic": "SAR",
    "orange free state": "OFS",
    egypt: "EGP",
    "anglo egyptian sudan": "SUD",
    sudan: "SUD",
    "british east africa": "BEA",
    buganda: "BEA",
    bunyoro: "BEA",
    uganda: "BEA",
    "british somaliland": "BSO",
    somaliland: "BSO",
    nigeria: "NIG",
    "sokoto caliphate": "NIG",
    "kanem bornu": "NIG",
    ibadan: "NIG",
    oyo: "NIG",
    benin: "NIG",
    calabar: "NIG",
    opobo: "NIG",
    "borgu states": "NIG",
    "gold coast": "BWF",
    asante: "BWF",
    accra: "BWF",
    "ato trading confederacy": "BWF",
    "sierra leone": "BWF",
    gambia: "BWF",
    malaya: "BMA",
    brunei: "BMA",
    "hong kong": "BPO",
    fiji: "BPO",
    tonga: "BPO",
    niue: "BPO",
    "papua new guinea": "GNG",
    // France
    france: "FRA",
    algeria: "ALG",
    tunisia: "ALG",
    senegal: "AOF",
    "ivory coast": "AOF",
    dahomey: "AOF",
    "french guinea": "AOF",
    "french sudan": "AOF",
    "french west africa": "AOF",
    gabon: "AEF",
    "french congo": "AEF",
    "french equatorial africa": "AEF",
    madagascar: "MDG",
    imerina: "MDG",
    "french indochina": "IDC",
    "french guiana": "FRA",
    guadeloupe: "FRA",
    martinique: "FRA",
    "saint barthelemy": "FRA",
    "saint martin": "FRA",
    "wallis and futuna islands": "FRA",
    comoros: "MDG",
    // Germany
    germany: "DEU",
    "german empire": "DEU",
    "german east africa": "GEA",
    "german south west africa": "GWA",
    kamerun: "GWA",
    cameroon: "GWA",
    togo: "GWA",
    togoLAND: "GWA",
    "german new guinea": "GNG",
    samoa: "GNG",
    // Russia
    "russian empire": "RUS",
    "grand duchy of finland": "RUS",
    "central asian khanates": "RUS",
    // Austria-Hungary
    "austria hungary": "AUT",
    "bosnia herzegovina": "AUT",
    // Ottoman Empire
    "ottoman empire": "OTT",
    arabia: "OTT",
    qatar: "OTT",
    "trucial oman": "BPO",
    oman: "OMN",
    yemen: "YEM",
    // Italy / Spain / Portugal / Belgium / Netherlands
    italy: "ITA",
    "kingdom of italy": "ITA",
    eritrea: "EIS",
    "italian somaliland": "EIS",
    libya: "EIS",
    spain: "ESP",
    "spanish guinea": "SGU",
    "rio de oro": "SGU",
    "spanish sahara": "SGU",
    "spanish morocco": "SMA",
    portugal: "PRT",
    angola: "PAF",
    "portuguese east africa": "PAF",
    mozambique: "PAF",
    "portuguese guinea": "PAF",
    belgium: "BEL",
    congo: "COD",
    "congo free state": "COD",
    netherlands: "NLD",
    "netherlands indies": "DEI",
    "dutch east indies": "DEI",
    "dutch guiana": "DEI",
    suriname: "DEI",
    "netherlands antilles": "NLD",
    // Scandinavia
    denmark: "DNK",
    iceland: "DNK",
    greenland: "DNK",
    "sweden norway": "SWE",
    sweden: "SWE",
    norway: "SWE",
    // Others
    switzerland: "CHE",
    luxembourg: "LUX",
    liechtenstein: "LIE",
    monaco: "MCO",
    "san marino": "SMR",
    romania: "ROU",
    bulgaria: "BGR",
    serbia: "SRB",
    montenegro: "MNE",
    greece: "GRC",
    "united states of america": "USA",
    "united states": "USA",
    "united states virgin islands": "DNK",
    "american samoa": "USA",
    hawaii: "USA",
    "kingdom of hawaii": "USA",
    philippines: "UOT",
    "puerto rico": "UOT",
    cuba: "CUB",
    // "Kuba" is the Kuba kingdom in the Kasai basin, not Cuba. Mapping it to CUB
    // painted a Congo polygon in Cuban colours and left Cuba itself blank.
    kuba: "COD",
    lagos: "NIG",
    cotonou: "AOF",
    "futa jalon": "AOF",
    haiti: "HTI",
    "dominican republic": "DOM",
    mexico: "MEX",
    guatemala: "GTM",
    "el salvador": "SLV",
    honduras: "HND",
    nicaragua: "NIC",
    "costa rica": "CRI",
    colombia: "COL",
    venezuela: "VEN",
    ecuador: "ECU",
    peru: "PER",
    bolivia: "BOL",
    chile: "CHL",
    argentina: "ARG",
    uruguay: "URY",
    paraguay: "PRY",
    "kingdom of brazil": "BRA",
    brazil: "BRA",
    "british guiana": "BWI",
    guyana: "BWI",
    "imperial japan": "JPN",
    japan: "JPN",
    korea: "KOR",
    "manchu empire": "CHN",
    china: "CHN",
    "rattanakosin kingdom": "THA",
    siam: "THA",
    persia: "IRN",
    iran: "IRN",
    afghanistan: "AFG",
    nepal: "NPL",
    bhutan: "BTN",
    "muscat and oman": "OMN",
    ethiopia: "ETH",
    abyssinia: "ETH",
    "harer egypt": "ETH",
    morocco: "MAR",
    liberia: "LBR",
    "rapa nui": "CHL",
    "dominion of newfoundland": "CAN",
    newfoundland: "CAN",
    "british honduras": "BWI",
    belize: "BWI",
  },
  1914: {
    "united kingdom of great britain and ireland": "GBR",
    "united kingdom": "GBR",
    "british raj": "RAJ",
    india: "RAJ",
    ceylon: "CEY",
    canada: "CAN",
    "dominion of newfoundland": "CAN",
    newfoundland: "CAN",
    australia: "AUS",
    "new zealand": "NZL",
    "union of south africa": "ZAF",
    "south africa": "ZAF",
    botswana: "ZAF",
    lesotho: "ZAF",
    basutoland: "ZAF",
    swaziland: "ZAF",
    egypt: "EGP",
    "anglo egyptian sudan": "SUD",
    sudan: "SUD",
    "british east africa": "BEA",
    kenya: "BEA",
    uganda: "BEA",
    "british somaliland": "BSO",
    "british protectorate": "BSO",
    nigeria: "NIG",
    "gold coast": "BWF",
    ghana: "BWF",
    "sierra leone": "BWF",
    "gambia the": "BWF",
    gambia: "BWF",
    rhodesia: "RHO",
    malaya: "BMA",
    brunei: "BMA",
    "hong kong": "BPO",
    fiji: "BPO",
    tonga: "BPO",
    niue: "BPO",
    "papua new guinea": "GNG",
    "british guiana": "BWI",
    guyana: "BWI",
    "british honduras": "BWI",
    belize: "BWI",
    france: "FRA",
    algeria: "ALG",
    tunisia: "ALG",
    morocco: "MAR",
    "french morocco": "MAR",
    "french west africa": "AOF",
    "french equatorial africa": "AEF",
    "madagascar france": "MDG",
    madagascar: "MDG",
    "french indochina": "IDC",
    "french guiana": "FRA",
    guadeloupe: "FRA",
    martinique: "FRA",
    "saint barthelemy": "FRA",
    "saint martin": "FRA",
    "wallis and futuna islands": "FRA",
    "german empire": "DEU",
    germany: "DEU",
    "german e africa tanganyika": "GEA",
    "german east africa": "GEA",
    "german south west africa": "GWA",
    "south west africa": "GWA",
    kamerun: "GWA",
    cameroon: "GWA",
    togoLAND: "GWA",
    togo: "GWA",
    "german new guinea": "GNG",
    samoa: "GNG",
    "russian empire": "RUS",
    russia: "RUS",
    armenia: "RUS",
    azerbaijan: "RUS",
    georgia: "RUS",
    "grand duchy of finland": "RUS",
    finland: "RUS",
    "austro hungarian empire": "AUT",
    "austria hungary": "AUT",
    "bosnia herzegovina": "AUT",
    "ottoman empire": "OTT",
    "arabia nejd": "SAU",
    qatar: "OTT",
    kuwait: "OTT",
    "trucial oman": "BPO",
    oman: "OMN",
    "muscat and oman": "OMN",
    yemen: "YEM",
    "kingdom of italy": "ITA",
    italy: "ITA",
    eritrea: "ICO",
    "italian somaliland": "ICO",
    libya: "ICO",
    spain: "ESP",
    "spanish morocco": "SMA",
    "spanish sahara": "SGU",
    "rio de oro": "SGU",
    "equatorial guinea": "SGU",
    portugal: "PRT",
    angola: "PAF",
    mozambique: "PAF",
    "portuguese guinea": "PAF",
    belgium: "BEL",
    "belgian congo": "COD",
    congo: "COD",
    netherlands: "NLD",
    "netherlands indies": "DEI",
    "dutch east indies": "DEI",
    suriname: "DEI",
    "dutch guiana": "DEI",
    "netherlands antilles": "NLD",
    denmark: "DNK",
    iceland: "DNK",
    greenland: "DNK",
    sweden: "SWE",
    norway: "NOR",
    switzerland: "CHE",
    luxembourg: "LUX",
    liechtenstein: "LIE",
    monaco: "MCO",
    "san marino": "SMR",
    romania: "ROU",
    bulgaria: "BGR",
    serbia: "SRB",
    montenegro: "MNE",
    albania: "ALB",
    greece: "GRC",
    "united states": "USA",
    "united states of america": "USA",
    "united states virgin islands": "DNK",
    "american samoa": "USA",
    philippines: "UOT",
    "puerto rico": "UOT",
    panama: "PAN",
    cuba: "CUB",
    haiti: "HTI",
    "dominican republic": "DOM",
    mexico: "MEX",
    guatemala: "GTM",
    "el salvador": "SLV",
    honduras: "HND",
    nicaragua: "NIC",
    "costa rica": "CRI",
    colombia: "COL",
    venezuela: "VEN",
    ecuador: "ECU",
    peru: "PER",
    bolivia: "BOL",
    chile: "CHL",
    argentina: "ARG",
    uruguay: "URY",
    paraguay: "PRY",
    brazil: "BRA",
    "empire of japan": "JPN",
    japan: "JPN",
    korea: "JPN",
    "manchu empire": "CHN",
    china: "CHN",
    mongolia: "MNG",
    tibet: "TIB",
    xinjiang: "CHN",
    "sakhalin ru": "RUS",
    "rattanakosin kingdom": "THA",
    siam: "THA",
    persia: "IRN",
    iran: "IRN",
    afghanistan: "AFG",
    nepal: "NPL",
    bhutan: "BTN",
    ethiopia: "ETH",
    abyssinia: "ETH",
    liberia: "LBR",
    "rapa nui": "CHL",
    "dodecanese islands": "ITA",
  },
  1930: {
    "united kingdom of great britain and ireland": "GBR",
    "united kingdom": "GBR",
    "irish free state": "IRL",
    ireland: "IRL",
    "british raj": "RAJ",
    india: "RAJ",
    ceylon: "CEY",
    canada: "CAN",
    "dominion of newfoundland": "CAN",
    newfoundland: "CAN",
    australia: "AUS",
    "new zealand": "NZL",
    "union of south africa": "ZAF",
    "south africa": "ZAF",
    botswana: "ZAF",
    lesotho: "ZAF",
    basutoland: "ZAF",
    swaziland: "ZAF",
    "mandatory palestine gb": "PLM",
    "palestine and transjordan": "PLM",
    "mesopotamia gb": "IRQ",
    iraq: "IRQ",
    sudan: "SUD",
    "anglo egyptian sudan": "SUD",
    kenya: "BEA",
    uganda: "BEA",
    "tanzania united republic of": "BEA",
    tanganyika: "BEA",
    "british somaliland": "BSO",
    nigeria: "NIG",
    ghana: "BWF",
    "gold coast": "BWF",
    "sierra leone": "BWF",
    "gambia the": "BWF",
    gambia: "BWF",
    zambia: "RHO",
    zimbabwe: "RHO",
    malawi: "RHO",
    "northern rhodesia": "RHO",
    "southern rhodesia": "RHO",
    nyasaland: "RHO",
    malaysia: "BMA",
    malaya: "BMA",
    brunei: "BMA",
    "hong kong": "BPO",
    fiji: "BPO",
    tonga: "BPO",
    niue: "BPO",
    "papua new guinea": "AUS",
    "british guiana": "BWI",
    guyana: "BWI",
    "british honduras": "BWI",
    belize: "BWI",
    egypt: "EGY",
    france: "FRA",
    algeria: "ALG",
    tunisia: "ALG",
    morocco: "MAR",
    "french morocco": "MAR",
    "syria france": "LEV",
    syria: "LEV",
    lebanon: "LEV",
    "french cameroons": "AEF",
    "french equatorial africa": "AEF",
    "french west africa": "AOF",
    "french somaliland": "MDG",
    "madagascar france": "MDG",
    madagascar: "MDG",
    "french indo china": "IDC",
    "french indochina": "IDC",
    annam: "IDC",
    "cochin china": "IDC",
    "french guiana": "FRA",
    guadeloupe: "FRA",
    martinique: "FRA",
    "saint barthelemy": "FRA",
    "saint martin": "FRA",
    "wallis and futuna islands": "FRA",
    germany: "DEU",
    "east prussia": "DEU",
    danzig: "DEU",
    austria: "AUT",
    hungary: "HUN",
    czechoslovakia: "CSK",
    yugoslavia: "YUG",
    poland: "POL",
    "white russia": "USS",
    "far eastern ssr": "USS",
    ussr: "USS",
    "soviet union": "USS",
    estonia: "EST",
    latvia: "LVA",
    lithuania: "LTU",
    finland: "FIN",
    romania: "ROU",
    bulgaria: "BGR",
    albania: "ALB",
    greece: "GRC",
    "republic of turkey": "TUR",
    turkey: "TUR",
    "kingdom of italy": "ITA",
    italy: "ITA",
    "libya it": "ICO",
    libya: "ICO",
    eritrea: "ICO",
    "italian somaliland": "ICO",
    "dodecanese islands": "ITA",
    spain: "ESP",
    "spanish sahara": "SGU",
    "rio de oro": "SGU",
    "equatorial guinea": "SGU",
    "spanish morocco": "SMA",
    portugal: "PRT",
    angola: "PAF",
    mozambique: "PAF",
    "portuguese guinea": "PAF",
    "guinea bissau": "PAF",
    belgium: "BEL",
    "zaire belgium": "COD",
    "belgian congo": "COD",
    congo: "COD",
    "rwanda belgium": "COD",
    rwanda: "COD",
    burundi: "COD",
    netherlands: "NLD",
    "dutch east indies": "DEI",
    "netherlands indies": "DEI",
    suriname: "DEI",
    "dutch guiana": "DEI",
    "netherlands antilles": "NLD",
    denmark: "DNK",
    iceland: "ISL",
    greenland: "DNK",
    sweden: "SWE",
    norway: "NOR",
    switzerland: "CHE",
    luxembourg: "LUX",
    liechtenstein: "LIE",
    monaco: "MCO",
    "san marino": "SMR",
    "united states": "USA",
    "united states of america": "USA",
    philippines: "UOT",
    "puerto rico": "UOT",
    "united states virgin islands": "USA",
    "american samoa": "USA",
    cuba: "CUB",
    haiti: "HTI",
    "dominican republic": "DOM",
    mexico: "MEX",
    guatemala: "GTM",
    "el salvador": "SLV",
    honduras: "HND",
    nicaragua: "NIC",
    "costa rica": "CRI",
    colombia: "COL",
    venezuela: "VEN",
    ecuador: "ECU",
    peru: "PER",
    bolivia: "BOL",
    chile: "CHL",
    argentina: "ARG",
    uruguay: "URY",
    paraguay: "PRY",
    brazil: "BRA",
    "empire of japan": "JPN",
    japan: "JPN",
    korea: "JPN",
    taiwan: "JPN",
    "chinese warlords": "CHN",
    china: "CHN",
    manchuria: "CHN",
    xinjiang: "CHN",
    tibet: "TIB",
    mongolia: "MNG",
    "rattanakosin kingdom": "THA",
    siam: "THA",
    iran: "IRN",
    persia: "IRN",
    afghanistan: "AFG",
    nepal: "NPL",
    panama: "PAN",
    bhutan: "BTN",
    "muscat and oman": "OMN",
    oman: "OMN",
    qatar: "QAT",
    yemen: "YEM",
    hejaz: "SAU",
    hail: "SAU",
    "emirate of bin shalan": "SAU",
    ethiopia: "ETH",
    abyssinia: "ETH",
    liberia: "LBR",
    "rapa nui": "CHL",
    "dodecanese islands": "ITA",
  },
};

/** Some features sit far from the polity's core; pin the dynamic control key. */
const HOST_OVERRIDES: Record<Year, Record<string, string>> = {
  1900: {
    "british protectorate": "SML",
    "papua new guinea": "AUS",
    "united states virgin islands": "DNK",
    "harer egypt": "ETH",
  },
  1914: {
    "british protectorate": "SML",
    "papua new guinea": "AUS",
    "united states virgin islands": "DNK",
  },
  1930: {
    "papua new guinea": "AUS",
  },
};

type Box = [number, number, number, number];

function bboxOf(geometry: Feature["geometry"]): Box {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const visit = (coords: unknown): void => {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      const [x, y] = coords as [number, number];
      if (x < x0) x0 = x;
      if (y < y0) y0 = y;
      if (x > x1) x1 = x;
      if (y > y1) y1 = y;
      return;
    }
    for (const c of coords) visit(c);
  };
  visit(geometry?.coordinates);
  return Number.isFinite(x0) ? [x0, y0, x1, y1] : [0, 0, 0, 0];
}

function pointInRing(pt: [number, number], ring: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Even-odd test in lon/lat, so it does not depend on ring winding. */
function pointInGeometry(geometry: Feature["geometry"], pt: [number, number]): boolean {
  const g = geometry as { type?: string; coordinates?: unknown } | null;
  if (!g || !g.coordinates) return false;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? (g.coordinates as unknown[]) : [];
  for (const poly of polys) {
    const rings = poly as [number, number][][];
    if (!rings.length || !pointInRing(pt, rings[0])) continue;
    if (!rings.slice(1).some((hole) => pointInRing(pt, hole))) return true;
  }
  return false;
}

function norm(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function haversine(a: [number, number], b: [number, number]): number {
  const toRad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * toRad;
  const dLon = (b[0] - a[0]) * toRad;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * toRad) * Math.cos(b[1] * toRad) * Math.sin(dLon / 2) ** 2;
  return 2 * Math.asin(Math.min(1, Math.sqrt(x)));
}

function numericOf(iso: string): string {
  return COUNTRY_BY_ISO3[iso]?.numeric ?? iso;
}

function centroid(feature: Feature): [number, number] {
  const c = geoCentroid(feature as never) as [number, number];
  return [Number.isFinite(c[0]) ? c[0] : 0, Number.isFinite(c[1]) ? c[1] : 0];
}

function area(feature: Feature): number {
  const a = geoArea(feature as never);
  return Number.isFinite(a) ? a : 0;
}

function roundCoords(coords: unknown): unknown {
  if (typeof coords === "number") return Math.round(coords * 10000) / 10000;
  if (Array.isArray(coords)) return coords.map(roundCoords);
  return coords;
}

async function loadRaw(year: Year): Promise<{ features: Feature[] }> {
  if (!existsSync(CACHE)) mkdirSync(CACHE, { recursive: true });
  const file = join(CACHE, `world_${year}.geojson`);
  if (!existsSync(file)) {
    const res = await fetch(`${SOURCE}/world_${year}.geojson`);
    if (!res.ok) throw new Error(`Could not download ${year}: ${res.status}`);
    writeFileSync(file, await res.text());
  }
  return JSON.parse(readFileSync(file, "utf8")) as { features: Feature[] };
}

async function build(year: Year): Promise<void> {
  const scenario = HISTORY[year];
  if (!scenario) throw new Error(`No scenario for ${year}`);

  const landToPolity = new Map<string, string>();
  const polityLands = new Map<string, string[]>();
  for (const p of scenario.polities) {
    polityLands.set(p.id, p.lands);
    for (const land of p.lands) landToPolity.set(land, p.id);
  }
  const known = new Set(scenario.polities.map((p) => p.id));

  const modernRaw = JSON.parse(readFileSync(join(process.cwd(), "public", "geo", "countries-50m.json"), "utf8"));
  const modernFeatures = (feature(modernRaw, modernRaw.objects.countries as never) as unknown as { features: Feature[] }).features;
  const modernBoxes = new Map<Feature, Box>(modernFeatures.map((m) => [m, bboxOf(m.geometry)]));
  // The land a shape actually sits on. Nearest-capital guessing keyed the Ottoman
  // Empire and the Union of South Africa to neighbours, which then looked unowned.
  const landAt = (pt: [number, number]): string => {
    for (const m of modernFeatures) {
      const box = modernBoxes.get(m);
      if (!m.geometry || !box) continue;
      if (pt[0] < box[0] || pt[0] > box[2] || pt[1] < box[1] || pt[1] > box[3]) continue;
      if (!pointInGeometry(m.geometry, pt)) continue;
      const numeric = String((m as unknown as { id?: unknown }).id ?? "").padStart(3, "0");
      return COUNTRY_BY_NUMERIC[numeric]?.iso3 ?? "";
    }
    return "";
  };
  // Shapes span parts that sit far apart, and a part's centre can be offshore, so
  // take the first part whose bounding centre is actually on land.
  const landOf = (f: Feature): string => {
    const centre = landAt(centroid(f));
    if (centre) return centre;
    const g = f.geometry as { type?: string; coordinates?: unknown } | null;
    const parts = !g?.coordinates ? [] : g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? (g.coordinates as unknown[]) : [];
    for (const part of parts) {
      const box = bboxOf({ type: g!.type, coordinates: part } as Feature["geometry"]);
      if (!Number.isFinite(box[0])) continue;
      const hit = landAt([(box[0] + box[2]) / 2, (box[1] + box[3]) / 2]);
      if (hit) return hit;
    }
    return "";
  };
  const raw = await loadRaw(year);
  const out: { type: "FeatureCollection"; features: unknown[] } = { type: "FeatureCollection", features: [] };
  const used = new Map<string, number>();
  const unmapped: string[] = [];

  for (const f of raw.features) {
    const rawName = String(f.properties?.NAME ?? f.properties?.name ?? "").trim();
    if (!rawName || !f.geometry) continue;
    const key = norm(rawName);
    const fixed = ALIASES[year][key];
    const centre = centroid(f);
    let polity = fixed && known.has(fixed) ? fixed : "";
    if (!polity) {
      // Fall back to the modern land under the feature's centre.
      let best = "";
      let bestD = Infinity;
      for (const c of Object.values(COUNTRY_BY_ISO3)) {
        const d = haversine(centre, [c.lon, c.lat]);
        if (d < bestD) {
          bestD = d;
          best = c.iso3;
        }
      }
      polity = landToPolity.get(best) ?? "";
      if (!polity) unmapped.push(rawName);
    }
    if (polity) used.set(polity, (used.get(polity) ?? 0) + 1);

    // The host key is a modern land controlled by the polity on day one. After
    // an annexation or a peace deal the map asks `control` for this key.
    let host = HOST_OVERRIDES[year][key] || landOf(f);
    // Never key a shape to land its own polity does not hold, or a big polygon
    // ends up painted in a neighbour's colour.
    if (host && polity && landToPolity.get(host) !== polity) host = "";
    if (!host && polity) {
      const lands = (polityLands.get(polity) ?? []).filter((l) => COUNTRY_BY_ISO3[l]);
      if (lands.length) {
        let best = lands[0];
        let bestD = Infinity;
        for (const land of lands) {
          const c = COUNTRY_BY_ISO3[land];
          const d = haversine(centre, [c.lon, c.lat]);
          if (d < bestD) {
            bestD = d;
            best = land;
          }
        }
        host = best;
      }
    }
    if (!host) {
      let best = "";
      let bestD = Infinity;
      for (const c of Object.values(COUNTRY_BY_ISO3)) {
        const d = haversine(centre, [c.lon, c.lat]);
        if (d < bestD) {
          bestD = d;
          best = c.iso3;
        }
      }
      host = best;
    }

    out.features.push({
      type: "Feature",
      properties: { n: rawName, p: polity, h: numericOf(host) },
      geometry: { type: f.geometry.type, coordinates: roundCoords(f.geometry.coordinates) },
    });
  }

  const outlined: string[] = [];

  // The source leaves whole regions blank. In 1900 it draws tribal polities across
  // the Congo basin but nothing at all for Nigeria, Sudan, Kenya, Tanganyika, the
  // Rhodesias or Bechuanaland, so those lands had no shape and Africa read as
  // modern states with historical borders running through each other.
  //
  // Where a modern land has no historical shape over its centre, today's outline is
  // the right shape anyway: the colonial borders of 1900-1930 are very largely the
  // ones still on the map. Anything the source drew inside such a land is dropped
  // first, so the two never draw competing borders through each other.
  const shapes = out.features as { type?: string; properties: { n: string; p: string; h: string }; geometry: Feature["geometry"] }[];
  // What a shape draws for, which is the polity the alias table gave it. Reading it
  // back from the host land split one empire into a fill per modern country, so the
  // Ottomans came out as Turkey, Syria, Iraq and Palestine with borders between them.
  const ownerKey = (s: (typeof shapes)[number]) => s.properties.p || landToPolity.get(COUNTRY_BY_NUMERIC[s.properties.h]?.iso3 ?? "") || "";
  const fillFor = new Map<string, (typeof shapes)[number]>();
  const fillCentres = new Map<string, [number, number]>();
  for (let pass = 0; pass < 2; pass += 1) {
    for (const m of modernFeatures) {
      if (!m.geometry) continue;
      const numeric = String((m as unknown as { id?: unknown }).id ?? "").padStart(3, "0");
      if (fillFor.has(numeric)) continue;
      const record = COUNTRY_BY_NUMERIC[numeric];
      const polity = record ? landToPolity.get(record.iso3) ?? "" : "";
      if (!polity) continue;
      const pt = centroid(m);
      // A land only a couple of degrees across is a dot at map scale. Giving it an
      // outline turns the seas and Europe into a field of small circles, so those
      // are left to the base layer, which paints them without a border.
      const box = bboxOf(m.geometry);
      if (Math.max(box[2] - box[0], box[3] - box[1]) < 0.8) continue;
      // Already drawn by the land's own polity? Then leave the historical shape be.
      if (shapes.some((s) => ownerKey(s) === polity && pointInGeometry(s.geometry, pt))) continue;
      fillFor.set(numeric, {
        type: "Feature",
        properties: { n: record.name, p: polity, h: numeric },
        geometry: { type: m.geometry.type, coordinates: roundCoords(m.geometry.coordinates) },
      });
      fillCentres.set(numeric, pt);
    }
    const added = [...fillFor.values()].filter((f) => !shapes.includes(f));
    if (!added.length) break;
    // A land drawn by the wrong polity leaves that shape overlapping the new one.
    for (let i = shapes.length - 1; i >= 0; i -= 1) {
      const shape = shapes[i];
      const own = ownerKey(shape);
      const centre = centroid(shape as Feature);
      // Drop a shape the new outline has replaced, and one that reaches over land
      // belonging to another polity: French West Africa spanned Chad and Gambia.
      const sBox = bboxOf(shape.geometry);
      const stale = added.some((f) => {
        const at = fillCentres.get(f.properties.h);
        if (!at) return false;
        const fBox = bboxOf(f.geometry);
        // Only a shape that fits inside the new land is a leftover of it. An empire
        // whose centre happens to fall in a filled land is not: the Ottomans' centre
        // sits in Egypt, and dropping them there replaced the whole empire with one
        // outline per modern country.
        const fits = sBox[2] - sBox[0] <= (fBox[2] - fBox[0]) * 1.05 && sBox[3] - sBox[1] <= (fBox[3] - fBox[1]) * 1.05;
        if (!fits) return false;
        return pointInGeometry(f.geometry, centre) || (f.properties.p !== own && pointInGeometry(shape.geometry, at));
      });
      if (stale) shapes.splice(i, 1);
    }
  }
  const fills = [...fillFor.values()];
  for (const f of fills) {
    shapes.push(f);
    used.set(f.properties.p, (used.get(f.properties.p) ?? 0) + 1);
  }
  const fillLabels = fills.map((f) => `${f.properties.p}: ${f.properties.n}`);

  // The source gives Bulgaria the whole of Thrace up to the Bosphorus and draws the
  // Ottomans only in Asia. Modern Turkey still holds the European shore, so paint that
  // in as Ottoman Thrace: it sits on top of Bulgaria's over-reach and the capital stays.
  if (year !== 1930 && known.has("OTT") && COUNTRY_BY_ISO3["TUR"]) {
    const clipToBox = (pts: number[][], box: [number, number, number, number]): number[][] => {
      const inside = [
        (p: number[]) => p[0] >= box[0], (p: number[]) => p[0] <= box[2],
        (p: number[]) => p[1] >= box[1], (p: number[]) => p[1] <= box[3],
      ];
      const cut = (a: number[], b: number[], which: number): number[] => {
        const value = which === 0 ? box[0] : which === 1 ? box[2] : which === 2 ? box[1] : box[3];
        const idx = which < 2 ? 0 : 1;
        const d = b[idx] - a[idx];
        const t = Math.abs(d) < 1e-12 ? 0 : (value - a[idx]) / d;
        return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
      };
      let ring = pts;
      for (let which = 0; which < 4; which += 1) {
        const outRing: number[][] = [];
        for (let i = 0; i < ring.length; i += 1) {
          const cur = ring[i];
          const prev = ring[(i + ring.length - 1) % ring.length];
          const ci = inside[which](cur);
          const pi = inside[which](prev);
          if (ci) {
            if (!pi) outRing.push(cut(prev, cur, which));
            outRing.push(cur);
          } else if (pi) outRing.push(cut(prev, cur, which));
        }
        ring = outRing;
        if (ring.length < 3) return [];
      }
      return ring;
    };
    const thrace: number[][][][] = [];
    for (const m of modernFeatures) {
      if (String((m.properties as Record<string, unknown> | undefined)?.name ?? "") !== "Turkey") continue;
      const g = m.geometry as { type?: string; coordinates?: unknown } | null;
      const polys = !g?.coordinates ? [] : g.type === "Polygon" ? [g.coordinates] : (g.coordinates as unknown[]);
      for (const part of polys) {
        const ring = (part as number[][][])[0] ?? [];
        const clipped = clipToBox(ring, [25.6, 39.8, 29.3, 42.3]);
        if (clipped.length >= 3) thrace.push([clipped]);
      }
    }
    if (thrace.length) {
      out.features.push({ type: "Feature", properties: { n: "Ottoman Empire", p: "OTT", h: COUNTRY_BY_ISO3["TUR"].numeric }, geometry: { type: "MultiPolygon", coordinates: thrace } });
      used.set("OTT", (used.get("OTT") ?? 0) + 1);
    }
  }
  // Largest features first keeps labels sensible and drawing order stable.
  out.features.sort((a, b) => area(b as Feature) - area(a as Feature));

  writeFileSync(join(OUT, `historical-${year}.json`), JSON.stringify(out));
  const missing = [...known].filter((id) => !used.has(id));
  console.log(`${year}: ${out.features.length} polygons -> historical-${year}.json`);
  if (unmapped.length) console.log(`  unmapped (${unmapped.length}): ${[...new Set(unmapped)].sort().join(", ")}`);
  if (fillLabels.length) console.log(`  filled from modern outlines (${fillLabels.length}): ${fillLabels.sort().join(", ")}`);
  if (outlined.length) console.log(`  outlined polities with no polygon (${outlined.length}): ${outlined.sort().join(", ")}`);
  if (missing.length) console.log(`  polities with no polygon (${missing.length}): ${missing.sort().join(", ")}`);
}

for (const year of YEARS) await build(year);
