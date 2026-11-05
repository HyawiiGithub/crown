import type { RegionSeed } from "./types";

// Rough lon/lat outlines. Clipped to `hosts` at draw time, so outer edges can overshoot.
const R = (id: string, name: string, owner: string, hosts: string[], ring: [number, number][]): RegionSeed => ({ id, name, owner, hosts, ring });

const prussianPoland: [number, number][] = [[13.8, 55.1], [19, 55.1], [22.9, 55.3], [23, 54.2], [21.9, 53.5], [20, 53.15], [19.2, 52.95], [18.7, 52.55], [18, 52.15], [18.1, 51.2], [19.1, 50.35], [18.3, 49.9], [14.5, 50.7]];
const kaliningrad: [number, number][] = [[19.3, 54.3], [22.9, 54.3], [22.9, 55.5], [19.3, 55.5]];
const memel: [number, number][] = [[20.8, 55], [22.4, 55], [22.4, 56], [20.8, 56]];
const galicia: [number, number][] = [[19.1, 49.1], [19.1, 50.05], [21, 50.4], [22.7, 50.45], [24.1, 50.8], [26.1, 50], [26.4, 48.6], [24.9, 48.2], [22.8, 49], [20.5, 49.35]];
const bukovina: [number, number][] = [[24.9, 48.25], [26.7, 48.3], [26.5, 47.5], [25, 47.4]];
const transcarpathia: [number, number][] = [[22.1, 49.1], [24.9, 48.25], [24.2, 47.8], [22, 48]];
const transylvania: [number, number][] = [[22.8, 48], [24.9, 47.8], [25.3, 47.2], [26.1, 46.6], [26.4, 45.7], [25.5, 45.35], [24, 45.35], [22.7, 45], [22.4, 44.55], [21.2, 44.6], [20, 45.9], [21, 47.3]];
const vojvodina: [number, number][] = [[18.7, 46.3], [20.9, 46.3], [21.6, 45.2], [20.4, 44.85], [19, 44.9]];
const trentino: [number, number][] = [[10.3, 47.2], [12.6, 47.2], [12, 45.9], [10.5, 45.65]];
const trieste: [number, number][] = [[13.2, 46.5], [14.1, 46.4], [14, 45.3], [13.2, 45.6]];
const alsace: [number, number][] = [[5.85, 49.6], [8.3, 49.1], [7.65, 47.5], [6.8, 47.5], [6.95, 48.35], [5.85, 48.85]];
const schleswig: [number, number][] = [[8.3, 55.55], [9.8, 55.55], [10.1, 54.8], [8.3, 54.8]];
const hejaz: [number, number][] = [[34.4, 29.6], [39, 29.2], [40.2, 25], [41.6, 20.5], [42.6, 17], [39, 17.5], [34.8, 26]];
const hasa: [number, number][] = [[46.3, 29.2], [50.5, 28.5], [51.5, 24.3], [47.8, 22.8], [46, 25.5]];
const adenProtectorate: [number, number][] = [[43.2, 13.2], [45.5, 13.7], [46.6, 15], [48.9, 17], [52, 19.1], [53.4, 16.4], [49, 12.8], [44, 12]];
const transvaal: [number, number][] = [[25.6, -22], [31.5, -22.2], [32.2, -25.5], [31, -27.4], [29, -27.4], [26, -27.3], [24.9, -25.6]];
const orangeFree: [number, number][] = [[24.2, -28.4], [26, -27.3], [29, -27.4], [29.5, -29], [27.1, -30.7], [24.5, -30.1]];
const germanNewGuinea: [number, number][] = [[141, -1.5], [156, -1.5], [156, -7], [148.5, -8.1], [141, -5.7]];
const spanishMorocco: [number, number][] = [[-6.2, 36.1], [-1.9, 35.5], [-2.5, 34.7], [-6.2, 34.85]];
const southSakhalin: [number, number][] = [[140.5, 45.5], [144.8, 45.5], [144.8, 50], [140.5, 50]];
const tibet: [number, number][] = [[78.4, 34.2], [85, 36], [92, 36.1], [98.2, 33.2], [99.2, 29], [97.4, 27.7], [89, 27.2], [81, 30]];
const macedoniaThrace: [number, number][] = [[19.3, 39.65], [21.4, 39.85], [22.8, 39.95], [24.2, 40.1], [27.2, 41.5], [26.1, 42], [20.5, 41.6]];
const eastPrussia: [number, number][] = [[19.2, 54.45], [19.8, 55.5], [22.9, 55.5], [22.9, 54.35], [22, 53.5], [20, 53.15], [19.3, 53.45]];
const silesiaPomerania: [number, number][] = [[13.8, 54.5], [16.7, 54.9], [17, 53.9], [16, 53], [16.9, 51.9], [18, 51.2], [18.6, 50.2], [17, 50.2], [14.6, 50.9], [14.4, 52.5]];
const kresy: [number, number][] = [[23.2, 54.3], [25.2, 55.2], [26.9, 55.4], [27.8, 53.9], [27.4, 52.6], [27.4, 51.5], [26.8, 50.4], [26.3, 48.5], [24.9, 48.2], [22.6, 49.1], [23.6, 51.5], [23.6, 52.6]];
const karelia: [number, number][] = [[27.7, 60.4], [29.7, 60.05], [31, 60.9], [31.7, 62.9], [30, 62.9]];
const petsamo: [number, number][] = [[28.4, 70], [31.6, 70], [31, 69], [28.4, 68.8]];
const budjak: [number, number][] = [[28.2, 46.6], [30.5, 46.1], [29.8, 45.1], [28.2, 45.3]];
const gdr: [number, number][] = [[10.85, 54.05], [11, 53.65], [10.6, 53.35], [11.3, 53.05], [10.75, 52.8], [10.95, 52.1], [10.55, 51.85], [10.2, 51.4], [10, 50.9], [10.1, 50.6], [11, 50.35], [12.1, 50.3], [12.4, 50.15], [15.2, 50.8], [14.9, 52], [14.3, 53], [14.4, 54.1], [13.6, 54.9], [12, 54.6]];
const northVietnam: [number, number][] = [[101.9, 23.6], [108.4, 21.9], [107.6, 17.1], [106.4, 17.1], [104.5, 18.8]];
const dutchNewGuinea: [number, number][] = [[130.8, 0], [141, -2.4], [141, -9.3], [137.6, -9], [132.8, -4.5]];

export const REGIONS_1900: RegionSeed[] = [
  R("prussian-partition", "Prussian Partition", "DEU", ["POL"], prussianPoland), R("east-prussia-k", "East Prussia", "DEU", ["RUS"], kaliningrad), R("memelland", "Memelland", "DEU", ["LTU"], memel),
  R("galicia", "Galicia", "AUT", ["POL", "UKR"], galicia), R("bukovina", "Bukovina", "AUT", ["UKR", "ROU"], bukovina), R("carpathian-ruthenia", "Carpathian Ruthenia", "AUT", ["UKR"], transcarpathia),
  R("transylvania", "Transylvania", "AUT", ["ROU"], transylvania), R("vojvodina", "Vojvodina", "AUT", ["SRB"], vojvodina), R("trentino", "Trentino", "AUT", ["ITA"], trentino), R("trieste", "Austrian Littoral", "AUT", ["ITA", "SVN"], trieste),
  R("alsace-lorraine", "Alsace-Lorraine", "DEU", ["FRA"], alsace), R("north-schleswig", "North Schleswig", "DEU", ["DNK"], schleswig),
  R("ottoman-rumelia", "Ottoman Rumelia", "OTT", ["GRC"], macedoniaThrace), R("hejaz", "Hejaz", "OTT", ["SAU"], hejaz), R("al-hasa", "Al-Hasa", "OTT", ["SAU"], hasa), R("aden", "Aden Protectorate", "ADN", ["YEM"], adenProtectorate),
  R("transvaal", "South African Republic", "SAR", ["ZAF"], transvaal), R("orange-free-state", "Orange Free State", "OFS", ["ZAF"], orangeFree), R("german-new-guinea", "German New Guinea", "GNG", ["PNG"], germanNewGuinea),
];

export const REGIONS_1914: RegionSeed[] = [
  R("prussian-partition", "Prussian Partition", "DEU", ["POL"], prussianPoland), R("east-prussia-k", "East Prussia", "DEU", ["RUS"], kaliningrad), R("memelland", "Memelland", "DEU", ["LTU"], memel),
  R("galicia", "Galicia", "AUT", ["POL", "UKR"], galicia), R("bukovina", "Bukovina", "AUT", ["UKR", "ROU"], bukovina), R("carpathian-ruthenia", "Carpathian Ruthenia", "AUT", ["UKR"], transcarpathia),
  R("transylvania", "Transylvania", "AUT", ["ROU"], transylvania), R("vojvodina", "Vojvodina", "AUT", ["SRB"], vojvodina), R("trentino", "Trentino", "AUT", ["ITA"], trentino), R("trieste", "Austrian Littoral", "AUT", ["ITA", "SVN"], trieste),
  R("alsace-lorraine", "Alsace-Lorraine", "DEU", ["FRA"], alsace), R("north-schleswig", "North Schleswig", "DEU", ["DNK"], schleswig),
  R("hejaz", "Hejaz", "OTT", ["SAU"], hejaz), R("aden", "Aden Protectorate", "ADN", ["YEM"], adenProtectorate),
  R("german-new-guinea", "German New Guinea", "GNG", ["PNG"], germanNewGuinea), R("spanish-morocco", "Spanish Morocco", "SMA", ["MAR"], spanishMorocco), R("karafuto", "Karafuto", "JPN", ["RUS"], southSakhalin), R("tibet", "Tibet", "TIB", ["CHN"], tibet),
];

export const REGIONS_1930: RegionSeed[] = [
  R("east-prussia", "East Prussia", "DEU", ["POL", "RUS"], eastPrussia), R("silesia-pomerania", "Silesia and Pomerania", "DEU", ["POL"], silesiaPomerania),
  R("kresy", "Eastern Poland", "POL", ["BLR", "UKR", "LTU"], kresy), R("carpathian-ruthenia", "Carpathian Ruthenia", "CSK", ["UKR"], transcarpathia), R("north-bukovina", "Northern Bukovina", "ROU", ["UKR"], bukovina), R("budjak", "Budjak", "ROU", ["UKR"], budjak),
  R("istria", "Julian March", "ITA", ["SVN", "HRV"], trieste), R("karelia", "Finnish Karelia", "FIN", ["RUS"], karelia), R("petsamo", "Petsamo", "FIN", ["RUS"], petsamo),
  R("aden", "Aden Protectorate", "ADN", ["YEM"], adenProtectorate), R("spanish-morocco", "Spanish Morocco", "SMA", ["MAR"], spanishMorocco), R("karafuto", "Karafuto", "JPN", ["RUS"], southSakhalin), R("tibet", "Tibet", "TIB", ["CHN"], tibet),
];

export const REGIONS_1950: RegionSeed[] = [
  R("east-germany", "German Democratic Republic", "DDR", ["DEU"], gdr), R("north-vietnam", "Democratic Republic of Vietnam", "DRV", ["VNM"], northVietnam), R("dutch-new-guinea", "Netherlands New Guinea", "DNG", ["IDN"], dutchNewGuinea),
  R("aden", "Aden Protectorate", "ADN", ["YEM"], adenProtectorate), R("spanish-morocco", "Spanish Morocco", "SMA", ["MAR"], spanishMorocco), R("tibet", "Tibet", "TIB", ["CHN"], tibet),
];

export const REGIONS_1990: RegionSeed[] = [R("east-germany", "German Democratic Republic", "DDR", ["DEU"], gdr)];
