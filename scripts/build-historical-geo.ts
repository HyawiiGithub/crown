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
    panama: "USA",
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
    let host = HOST_OVERRIDES[year][key] ?? "";
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

  // ---- Coverage: draw the lands the historical source leaves out -----------
  // The 1900 file has no Kamerun, Togo, German South-West Africa, Sudan, Eritrea
  // or Italian Somaliland, and no Cuba of its own. A missing polygon is a blank
  // hole on the map, so any modern land the source does not cover gets a
  // fallback outline owned by whoever holds that land in this scenario.
  const outlines = out.features
    .filter((f) => (f as Feature).geometry)
    .map((f) => ({ geometry: (f as Feature).geometry!, box: bboxOf((f as Feature).geometry!), p: String((f as Feature).properties?.p ?? "") }));
  const ownerOfLand = (land: string, depth = 0): string | undefined => {
    const direct = landToPolity.get(land);
    if (direct) return direct;
    if (depth > 3) return undefined;
    const next = TERRITORY_OWNER[land];
    return next ? ownerOfLand(next, depth + 1) : undefined;
  };
  const modernRaw = JSON.parse(readFileSync(join(process.cwd(), "public", "geo", "countries-50m.json"), "utf8"));
  const modernFeatures = (feature(modernRaw, modernRaw.objects.countries as never) as unknown as { features: Feature[] }).features;
  const filled: string[] = [];
  for (const m of modernFeatures) {
    const id = (m as unknown as { id?: string | number }).id;
    const numeric = id === undefined || id === null ? "" : String(id).padStart(3, "0");
    const iso3 = numeric ? COUNTRY_BY_NUMERIC[numeric]?.iso3 : undefined;
    if (!iso3 || !m.geometry) continue;
    const box = bboxOf(m.geometry);
    // Sample a grid inside the modern outline: a handful of points is enough to
    // tell a real gap from a coastline that simply differs by a few kilometres.
    const pts: [number, number][] = [];
    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        const pt: [number, number] = [box[0] + ((box[2] - box[0]) * (x + 0.5)) / 6, box[1] + ((box[3] - box[1]) * (y + 0.5)) / 6];
        if (pointInGeometry(m.geometry, pt)) pts.push(pt);
      }
    }
    if (!pts.length) continue;
    const owner = ownerOfLand(iso3);
    if (!owner || !known.has(owner)) continue;
    let covered = 0;
    let foreign = 0;
    for (const pt of pts) {
      const hits = outlines.filter((o) => pt[0] >= o.box[0] && pt[0] <= o.box[2] && pt[1] >= o.box[1] && pt[1] <= o.box[3] && pointInGeometry(o.geometry, pt));
      if (hits.length) covered++;
      if (hits.some((h) => h.p && h.p !== owner)) foreign++;
    }
    // Fill whenever the source leaves a visible hole, not only when it leaves most
    // of the land blank: a half-drawn colony still showed empty spaces. Europe is
    // exempt: there the source is dense, so a surviving hole means a border that
    // really moved (Alsace, Schleswig, East Prussia) and a modern outline would
    // paint today's frontier over it. Elsewhere a heavy foreign overlap still wins.
    if (COUNTRY_BY_ISO3[iso3]?.continent === "Europe") continue;
    if (covered / pts.length >= 0.9) continue;
    if (foreign / pts.length > 0.6) continue;
    out.features.push({
      type: "Feature",
      // The map keys ownership off `id` first, then the name. A fallback outline
      // without the id falls back to its name, misses `control`, and paints as
      // unclaimed, which is why these lands showed as blank cream.
      id: numeric,
      properties: { n: COUNTRY_BY_ISO3[iso3]?.name ?? iso3, p: owner, h: numeric },
      geometry: { type: m.geometry.type, coordinates: roundCoords(m.geometry.coordinates) },
    });
    filled.push(`${iso3}:${owner}`);
  }

  // A polity the source draws nowhere at all (Cuba in 1900, Aden, Muscat) would be
  // invisible, so give its lands a modern outline as well.
  const drawnPolities = new Set(out.features.map((f) => String((f as Feature).properties?.p ?? "")));
  for (const polity of scenario.polities) {
    if (drawnPolities.has(polity.id)) continue;
    for (const land of polity.lands) {
      const def = COUNTRY_BY_ISO3[land];
      if (!def) continue;
      const m = modernFeatures.find((x) => String((x as unknown as { id?: string | number }).id).padStart(3, "0") === def.numeric);
      if (!m?.geometry) continue;
      out.features.push({
        type: "Feature",
        id: def.numeric,
        properties: { n: def.name, p: polity.id, h: def.numeric },
        geometry: { type: m.geometry.type, coordinates: roundCoords(m.geometry.coordinates) },
      });
      filled.push(`${land}:${polity.id}`);
    }
  }

  // Largest features first keeps labels sensible and drawing order stable.
  out.features.sort((a, b) => area(b as Feature) - area(a as Feature));

  writeFileSync(join(OUT, `historical-${year}.json`), JSON.stringify(out));
  const missing = [...known].filter((id) => !used.has(id));
  console.log(`${year}: ${out.features.length} polygons -> historical-${year}.json`);
  if (unmapped.length) console.log(`  unmapped (${unmapped.length}): ${[...new Set(unmapped)].sort().join(", ")}`);
  if (filled.length) console.log(`  filled from modern outlines (${filled.length}): ${filled.sort().join(", ")}`);
  if (missing.length) console.log(`  polities with no polygon (${missing.length}): ${missing.sort().join(", ")}`);
}

for (const year of YEARS) await build(year);
