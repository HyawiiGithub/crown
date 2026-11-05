import type { CompanySeed, SectorId } from "../shared/types";

/**
 * Real corporations by scenario. Revenue is annual, in billions of USD of the
 * period; employees are in thousands. Figures are rounded public estimates.
 * Row: Name|country polity|sector|revenue $B|employees k|exchange (blank = unlisted)|state share|founded
 */
const S: Record<string, SectorId> = {
  T: "technology", F: "finance", E: "energy", M: "manufacturing", R: "retail", H: "healthcare", N: "mining", K: "transport", D: "defence", C: "telecom", A: "media", B: "construction", G: "agriculture", U: "utilities",
};

function rows(raw: string): CompanySeed[] {
  return raw.trim().split("\n").filter((l) => l.trim()).map((l) => {
    const f = l.split("|").map((x) => x.trim());
    return {
      name: f[0],
      country: f[1] as CompanySeed["country"],
      sector: S[f[2]],
      revenue: Number(f[3]) * 1e9,
      employees: Math.round(Number(f[4]) * 1000),
      listed: Boolean(f[5]),
      exchange: f[5] || undefined,
      stateOwnership: f[6] ? Number(f[6]) : 0,
      foundedYear: f[7] ? Number(f[7]) : undefined,
    };
  });
}

const C1900 = rows(`
Standard Oil|USA|E|0.14|60|nyse||1870
Carnegie Steel|USA|M|0.1|20|||1892
American Sugar Refining|USA|G|0.09|6|nyse||1891
Pennsylvania Railroad|USA|K|0.14|110|nyse||1846
New York Central Railroad|USA|K|0.1|75|nyse||1853
Western Union|USA|C|0.03|25|nyse||1851
J.P. Morgan & Co.|USA|F|0.02|1|||1871
London and North Western Railway|GBR|K|0.07|70|lse||1846
P&O Steam Navigation|GBR|K|0.02|15|lse||1837
Imperial Tobacco|GBR|M|0.05|12|lse||1901
Vickers Sons and Maxim|GBR|D|0.02|12|lse||1828
HSBC|GBR|F|0.01|2|lse||1865
Krupp|DEU|D|0.05|45|||1811
Siemens & Halske|DEU|M|0.03|14|dax||1847
AEG|DEU|M|0.03|17|dax||1883
Deutsche Bank|DEU|F|0.02|3|dax||1870
BASF|DEU|M|0.02|7|dax||1865
Credit Lyonnais|FRA|F|0.03|5|euronext||1863
Schneider-Creusot|FRA|D|0.03|12|euronext||1836
Nobel Brothers Petroleum|RUS|E|0.03|12|||1879
Mitsubishi|JPN|K|0.02|15|||1870
Mitsui|JPN|F|0.02|10|||1876
`);

const C1914 = rows(`
U.S. Steel|USA|M|0.56|180|nyse||1901
Standard Oil of New Jersey|USA|E|0.28|35|nyse||1882
Ford Motor Company|USA|M|0.12|14|||1903
General Electric|USA|M|0.09|35|nyse||1892
Pennsylvania Railroad|USA|K|0.3|200|nyse||1846
AT&T|USA|C|0.23|130|nyse||1885
International Harvester|USA|M|0.15|40|nyse||1902
J.P. Morgan & Co.|USA|F|0.04|1|||1871
Royal Dutch Shell|GBR|E|0.12|30|lse||1907
Vickers|GBR|D|0.04|25|lse||1828
Imperial Tobacco|GBR|M|0.08|20|lse||1901
Lloyds Bank|GBR|F|0.03|8|lse||1765
Krupp|DEU|D|0.14|82|||1811
Siemens|DEU|M|0.08|80|dax||1847
AEG|DEU|M|0.06|66|dax||1883
BASF|DEU|M|0.05|11|dax||1865
Deutsche Bank|DEU|F|0.04|6|dax||1870
Schneider-Creusot|FRA|D|0.06|20|euronext||1836
Renault|FRA|M|0.02|6|||1899
Skoda Works|AUT|D|0.03|10|||1859
Putilov Works|RUS|D|0.02|13|||1868
Mitsubishi|JPN|K|0.04|30|||1870
Anglo-Persian Oil|IRN|E|0.01|3|lse|0.51|1909
`);

const C1930 = rows(`
General Motors|USA|M|1.5|190|nyse||1908
U.S. Steel|USA|M|1.1|220|nyse||1901
Ford Motor Company|USA|M|1.1|120|||1903
Standard Oil of New Jersey|USA|E|1.5|65|nyse||1882
AT&T|USA|C|1.1|390|nyse||1885
General Electric|USA|M|0.38|78|nyse||1892
Woolworth|USA|R|0.3|50|nyse||1879
Chase National Bank|USA|F|0.2|8|nyse||1877
Radio Corporation of America|USA|A|0.14|12|nyse||1919
Royal Dutch Shell|GBR|E|0.8|110|lse||1907
Imperial Chemical Industries|GBR|M|0.2|50|lse||1926
Unilever|GBR|G|0.4|80|lse||1929
Anglo-Persian Oil|GBR|E|0.25|40|lse|0.51|1909
IG Farben|DEU|M|0.33|110|dax||1925
Siemens|DEU|M|0.2|130|dax||1847
Vereinigte Stahlwerke|DEU|M|0.3|150|dax||1926
Krupp|DEU|D|0.12|60|||1811
Citroen|FRA|M|0.1|30|euronext||1919
Renault|FRA|M|0.1|35|||1899
Fiat|ITA|M|0.08|37|||1899
Mitsubishi|JPN|K|0.3|70|||1870
Mitsui|JPN|F|0.3|60|||1876
Philips|NLD|M|0.05|20|euronext||1891
Volkswagen Precursor Opel|DEU|M|0.05|12|||1862
`);

const C1950 = rows(`
General Motors|USA|M|7.5|500|nyse||1908
Standard Oil of New Jersey|USA|E|3.2|120|nyse||1882
U.S. Steel|USA|M|3|290|nyse||1901
Ford Motor Company|USA|M|3.7|160|||1903
General Electric|USA|M|2.2|190|nyse||1892
AT&T|USA|C|3.3|600|nyse||1885
DuPont|USA|M|1.5|87|nyse||1802
Boeing|USA|D|0.3|30|nyse||1916
Bank of America|USA|F|0.3|20|nyse||1904
Royal Dutch Shell|GBR|E|2.8|180|lse||1907
Anglo-Iranian Oil|GBR|E|1.1|80|lse|0.51|1909
Imperial Chemical Industries|GBR|M|0.7|110|lse||1926
Unilever|GBR|G|1.7|250|lse||1929
British Railways|GBR|K|1|600|||1948
Renault|FRA|M|0.25|50||1|1899
Fiat|ITA|M|0.3|70|||1899
Siemens|DEU|M|0.3|120|dax||1847
Volkswagen|DEU|M|0.1|15||0.6|1937
Toyota|JPN|M|0.03|7|||1937
Mitsubishi Heavy Industries|JPN|M|0.1|25|nikkei||1884
Gazprom Precursor Glavneftegaz|USS|E|2|200||1|1943
Uralmash|USS|M|1|60||1|1933
Saudi Aramco|SAU|E|0.5|20|||1933
`);

const C1990 = rows(`
General Motors|USA|M|125|760|nyse||1908
Ford Motor Company|USA|M|97|370|nyse||1903
Exxon|USA|E|105|104|nyse||1882
IBM|USA|T|69|374|nyse||1911
General Electric|USA|M|58|298|nyse||1892
Mobil|USA|E|58|67|nyse||1882
Philip Morris|USA|G|51|168|nyse||1847
AT&T|USA|C|37|274|nyse||1885
Citicorp|USA|F|38|95|nyse||1812
Walmart|USA|R|33|328|nyse||1962
Microsoft|USA|T|1.2|5.6|nasdaq||1975
Boeing|USA|D|28|160|nyse||1916
Royal Dutch Shell|GBR|E|107|137|lse||1907
BP|GBR|E|59|118|lse||1909
Unilever|GBR|G|40|304|lse||1929
Daimler-Benz|DEU|M|55|376|dax||1926
Volkswagen|DEU|M|43|268|dax|0.2|1937
Siemens|DEU|M|39|373|dax||1847
Deutsche Bank|DEU|F|25|68|dax||1870
Toyota|JPN|M|60|96|nikkei||1937
Hitachi|JPN|T|50|290|nikkei||1910
Matsushita Electric|JPN|T|44|198|nikkei||1918
Nippon Telegraph and Telephone|JPN|C|43|266|nikkei|0.65|1952
Elf Aquitaine|FRA|E|32|90|euronext|0.56|1976
Fiat|ITA|M|47|304|||1899
Samsung|KOR|T|36|180|krx||1938
Saudi Aramco|SAU|E|40|43||1|1933
Sinopec Precursor|CHN|E|15|500||1|1983
`);

const C2010 = rows(`
Walmart|USA|R|408|2100|nyse||1962
ExxonMobil|USA|E|285|103|nyse||1882
Chevron|USA|E|164|62|nyse||1879
General Electric|USA|M|157|304|nyse||1892
Bank of America|USA|F|150|284|nyse||1904
JPMorgan Chase|USA|F|116|222|nyse||1799
Apple|USA|T|43|35|nasdaq||1976
Microsoft|USA|T|58|89|nasdaq||1975
Google|USA|T|24|20|nasdaq||1998
IBM|USA|T|95|400|nyse||1911
General Motors|USA|M|105|217|||1908
Boeing|USA|D|68|157|nyse||1916
Pfizer|USA|H|50|116|nyse||1849
Royal Dutch Shell|GBR|E|285|101|lse||1907
BP|GBR|E|246|80|lse||1909
HSBC|GBR|F|104|303|lse||1865
Volkswagen|DEU|M|146|369|dax|0.2|1937
Siemens|DEU|M|104|405|dax||1847
Deutsche Bank|DEU|F|55|82|dax||1870
Total|FRA|E|156|97|euronext||1924
BNP Paribas|FRA|F|130|190|euronext||1848
Toyota|JPN|M|204|320|nikkei||1937
Sony|JPN|T|78|168|nikkei||1946
Samsung Electronics|KOR|T|119|190|krx||1969
Sinopec|CHN|E|188|640|sse|0.75|2000
PetroChina|CHN|E|157|540|sse|0.86|1999
State Grid|CHN|U|184|1500||1|2002
ICBC|CHN|F|71|390|sse|0.7|1984
Gazprom|RUS|E|94|393|moex|0.5|1989
Petrobras|BRA|E|92|77|b3|0.5|1953
Saudi Aramco|SAU|E|200|55||1|1933
Reliance Industries|IND|E|44|25|nse||1966
Tata Motors|IND|M|20|50|nse||1945
Nestle|CHE|G|108|278|||1866
BHP Billiton|AUS|N|53|40|asx||1885
`);

const C2020 = rows(`
Walmart|USA|R|524|2200|nyse||1962
Amazon|USA|R|281|840|nasdaq||1994
Apple|USA|T|260|137|nasdaq||1976
ExxonMobil|USA|E|265|75|nyse||1882
Microsoft|USA|T|126|144|nasdaq||1975
Alphabet|USA|T|162|119|nasdaq||1998
Facebook|USA|A|71|45|nasdaq||2004
JPMorgan Chase|USA|F|142|257|nyse||1799
UnitedHealth Group|USA|H|242|325|nyse||1977
Johnson & Johnson|USA|H|82|132|nyse||1886
Pfizer|USA|H|52|88|nyse||1849
Boeing|USA|D|77|161|nyse||1916
Tesla|USA|M|25|48|nasdaq||2003
NVIDIA|USA|T|11|13|nasdaq||1993
Royal Dutch Shell|GBR|E|352|83|lse||1907
HSBC|GBR|F|71|235|lse||1865
AstraZeneca|GBR|H|24|70|lse||1999
Volkswagen|DEU|M|282|671|dax|0.2|1937
Siemens|DEU|M|97|385|dax||1847
SAP|DEU|T|31|100|dax||1972
Total|FRA|E|176|107|euronext||1924
LVMH|FRA|R|60|163|euronext||1987
Toyota|JPN|M|275|370|nikkei||1937
Sony|JPN|T|76|114|nikkei||1946
Samsung Electronics|KOR|T|197|287|krx||1969
TSMC|TWN|T|35|51|twse||1987
Alibaba|CHN|R|72|117|hkg||1999
Tencent|CHN|T|54|63|hkg||1998
Huawei|CHN|T|123|194|||1987
State Grid|CHN|U|387|907||1|2002
Sinopec|CHN|E|407|582|sse|0.68|2000
ICBC|CHN|F|177|445|sse|0.7|1984
Gazprom|RUS|E|118|473|moex|0.5|1989
Saudi Aramco|SAU|E|330|76|tadawul|0.98|1933
Reliance Industries|IND|E|86|195|nse||1966
Petrobras|BRA|E|76|57|b3|0.5|1953
Nestle|CHE|G|94|291|||1866
BHP|AUS|N|44|40|asx||1885
`);

const C2026 = rows(`
Walmart|USA|R|690|2100|nasdaq||1962
Amazon|USA|R|700|1550|nasdaq||1994
Apple|USA|T|420|164|nasdaq||1976
Microsoft|USA|T|300|228|nasdaq||1975
Alphabet|USA|T|390|185|nasdaq||1998
NVIDIA|USA|T|200|36|nasdaq||1993
Meta Platforms|USA|A|190|76|nasdaq||2004
Broadcom|USA|T|65|37|nasdaq||1961
Tesla|USA|M|95|125|nasdaq||2003
Oracle|USA|T|60|160|nyse||1977
ExxonMobil|USA|E|340|61|nyse||1882
Chevron|USA|E|195|45|nyse||1879
JPMorgan Chase|USA|F|280|317|nyse||1799
Bank of America|USA|F|190|213|nyse||1904
Goldman Sachs|USA|F|125|46|nyse||1869
Berkshire Hathaway|USA|F|370|392|nyse||1839
UnitedHealth Group|USA|H|440|400|nyse||1977
Eli Lilly|USA|H|60|47|nyse||1876
Johnson & Johnson|USA|H|92|138|nyse||1886
Boeing|USA|D|85|170|nyse||1916
Lockheed Martin|USA|D|73|121|nyse||1995
Palantir|USA|T|4|4|nasdaq||2003
Shell|GBR|E|285|96|lse||1907
HSBC|GBR|F|135|211|lse||1865
AstraZeneca|GBR|H|58|94|lse||1999
BAE Systems|GBR|D|37|107|lse||1999
Volkswagen|DEU|M|350|680|dax|0.2|1937
Siemens|DEU|M|85|312|dax||1847
SAP|DEU|T|40|110|dax||1972
Rheinmetall|DEU|D|12|33|dax||1889
TotalEnergies|FRA|E|200|102|euronext||1924
LVMH|FRA|R|90|213|euronext||1987
Airbus|FRA|D|78|157|euronext|0.26|1970
BNP Paribas|FRA|F|140|178|euronext||1848
ASML|NLD|T|33|44|euronext||1984
Novo Nordisk|DNK|H|45|78|||1923
Nestle|CHE|G|100|277|||1866
Roche|CHE|H|68|103|||1896
Toyota|JPN|M|320|383|nikkei||1937
Sony|JPN|T|85|113|nikkei||1946
Mitsubishi UFJ|JPN|F|90|150|nikkei||2005
SoftBank|JPN|T|45|65|nikkei||1981
Samsung Electronics|KOR|T|225|262|krx||1969
SK Hynix|KOR|T|50|33|krx||1983
Hyundai Motor|KOR|M|125|120|krx||1967
TSMC|TWN|T|110|83|twse||1987
Foxconn|TWN|T|215|800|twse||1974
State Grid|CHN|U|550|1300||1|2002
Sinopec|CHN|E|430|510|sse|0.69|2000
ICBC|CHN|F|220|420|sse|0.7|1984
Tencent|CHN|T|90|110|hkg||1998
Alibaba|CHN|R|140|120|hkg||1999
BYD|CHN|M|105|900|hkg||1995
CATL|CHN|M|55|130|hkg||2011
Huawei|CHN|T|120|208|||1987
Reliance Industries|IND|E|120|340|nse||1966
Tata Consultancy Services|IND|T|30|600|nse||1968
HDFC Bank|IND|F|50|210|nse||1994
Gazprom|RUS|E|120|500|moex|0.5|1989
Rosneft|RUS|E|110|330|moex|0.4|1993
Saudi Aramco|SAU|E|440|75|tadawul|0.82|1933
Petrobras|BRA|E|92|42|b3|0.5|1953
Vale|BRA|N|38|65|b3||1942
BHP|AUS|N|55|45|asx||1885
Commonwealth Bank|AUS|F|30|50|asx||1911
Shopify|CAN|T|10|8|tsx||2006
Royal Bank of Canada|CAN|F|42|95|tsx||1864
America Movil|MEX|C|46|175|bmv||2000
DBS Group|SGP|F|16|41|sgx||1968
`);

const BY_YEAR: Record<number, CompanySeed[]> = { 1900: C1900, 1914: C1914, 1930: C1930, 1950: C1950, 1990: C1990, 2010: C2010, 2020: C2020, 2026: C2026 };

export function companiesForYear(year: number): CompanySeed[] {
  return BY_YEAR[year] ?? C2026;
}
