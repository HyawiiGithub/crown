import type { CompanySeed } from "../shared/types";

/**
 * Corporations seeded into each scenario.
 *
 * `revenue` is annual, in credits. Valuation is derived from it in the bootstrap,
 * so you only author the number you actually know. Earlier scenarios have far
 * fewer listed companies, which is correct: in 1900 there was no listed equity at
 * scale outside a handful of London houses, and in 1930 the Dow was twenty names.
 */
const C = (
  name: string,
  country: string,
  sector: CompanySeed["sector"],
  revenue: number,
  employees: number,
  opts: Partial<CompanySeed> = {},
): CompanySeed => ({ name, country: country as CompanySeed["country"], sector, revenue, employees, listed: true, ...opts });

// ===========================================================================
// 2026 -- the listed large-cap universe
// ===========================================================================

export const COMPANIES_2026: CompanySeed[] = [
  // ---- Technology ----
  C("Apple Inc.", "USA", "technology", 4.0e12, 164000, { foundedYear: 1976, brandValue: 3.0e12, rd: 3.2e11, exchange: "nyse" }),
  C("Microsoft Corporation", "USA", "technology", 2.8e12, 228000, { foundedYear: 1975, brandValue: 2.6e12, rd: 2.4e11, exchange: "nasdaq" }),
  C("NVIDIA Corporation", "USA", "technology", 1.4e12, 36000, { foundedYear: 1993, brandValue: 2.4e12, rd: 1.1e11, exchange: "nasdaq" }),
  C("Alphabet Inc.", "USA", "technology", 1.1e12, 190000, { foundedYear: 1998, brandValue: 1.7e12, rd: 1.4e11, exchange: "nasdaq" }),
  C("Amazon.com, Inc.", "USA", "retail", 1.1e12, 1550000, { foundedYear: 1994, brandValue: 1.1e12, rd: 9.4e10, exchange: "nasdaq" }),
  C("Meta Platforms, Inc.", "USA", "media", 6.2e11, 72000, { foundedYear: 2004, brandValue: 9.0e11, rd: 5.4e10, exchange: "nasdaq" }),
  C("Broadcom Inc.", "USA", "technology", 5.5e11, 37000, { foundedYear: 1961, brandValue: 8.0e11, rd: 5.0e10, exchange: "nasdaq" }),
  C("Tesla, Inc.", "USA", "manufacturing", 3.4e11, 125000, { foundedYear: 2003, brandValue: 6.0e11, rd: 3.6e10, exchange: "nasdaq" }),
  C("Palantir Technologies", "USA", "technology", 9.0e10, 4200, { foundedYear: 2003, brandValue: 2.4e11, rd: 6.0e9, exchange: "nasdaq" }),
  C("TSMC", "TWN", "technology", 1.0e12, 83000, { foundedYear: 1987, brandValue: 1.2e12, rd: 6.0e10, exchange: "twse" }),
  C("Samsung Electronics", "KOR", "technology", 5.0e11, 270000, { foundedYear: 1969, brandValue: 4.0e11, rd: 7.0e10, exchange: "krx" }),
  C("SK Hynix", "KOR", "technology", 1.8e11, 33000, { foundedYear: 1983, brandValue: 1.6e11, rd: 2.2e10, exchange: "krx" }),
  C("ASML Holding", "NLD", "technology", 3.4e11, 44000, { foundedYear: 1984, brandValue: 3.6e11, rd: 4.4e10, exchange: "euronext" }),
  C("Alibaba Group", "CHN", "retail", 8.0e11, 204000, { foundedYear: 1999, brandValue: 6.0e11, rd: 4.0e10, exchange: "hkg" }),
  C("Tencent Holdings", "CHN", "technology", 6.6e11, 105000, { foundedYear: 1998, brandValue: 6.4e11, rd: 4.6e10, exchange: "hkg" }),
  C("Huawei Technologies", "CHN", "technology", 4.4e11, 208000, { foundedYear: 1987, brandValue: 4.4e11, rd: 6.0e10, listed: false, stateOwnership: 0.0 }),
  C("Sony Group", "JPN", "technology", 9.0e10, 115000, { foundedYear: 1946, brandValue: 1.0e11, rd: 1.4e10, exchange: "nikkei" }),
  C("SoftBank Group", "JPN", "technology", 4.2e10, 5000, { foundedYear: 1981, brandValue: 6.0e10, rd: 1.0e9, exchange: "nikkei" }),
  C("SAP SE", "DEU", "technology", 3.4e11, 110000, { foundedYear: 1972, brandValue: 2.6e11, rd: 4.4e10, exchange: "dax" }),
  C("Siemens AG", "DEU", "manufacturing", 2.0e11, 300000, { foundedYear: 1847, brandValue: 1.1e11, rd: 1.4e10, exchange: "dax" }),
  C("Infosys", "IND", "technology", 1.9e10, 323000, { foundedYear: 1981, brandValue: 4.0e10, rd: 1.0e9, exchange: "nse" }),
  C("Reliance Industries", "IND", "technology", 2.4e11, 340000, { foundedYear: 1966, brandValue: 2.4e11, rd: 5.0e9, exchange: "nse" }),
  C("ZTE Corporation", "CHN", "technology", 1.8e10, 72000, { foundedYear: 1985, brandValue: 2.0e10, rd: 3.0e9, exchange: "sse" }),

  // ---- Finance ----
  C("JPMorgan Chase & Co.", "USA", "finance", 1.5e12, 310000, { foundedYear: 1799, brandValue: 8.0e11, exchange: "nyse" }),
  C("Bank of America", "USA", "finance", 9.6e11, 216000, { foundedYear: 1904, brandValue: 3.6e11, exchange: "nyse" }),
  C("Goldman Sachs Group", "USA", "finance", 5.0e11, 47000, { foundedYear: 1869, brandValue: 3.2e11, exchange: "nyse" }),
  C("HSBC Holdings", "GBR", "finance", 5.4e11, 220000, { foundedYear: 1865, brandValue: 2.4e11, exchange: "lse" }),
  C("Barclays PLC", "GBR", "finance", 2.8e11, 95000, { foundedYear: 1690, brandValue: 9.0e10, exchange: "lse" }),
  C("Deutsche Bank AG", "DEU", "finance", 1.3e11, 90000, { foundedYear: 1870, brandValue: 3.0e10, exchange: "dax" }),
  C("BNP Paribas", "FRA", "finance", 1.5e11, 95000, { foundedYear: 1848, brandValue: 4.0e10, exchange: "euronext" }),
  C("Mitsubishi UFJ", "JPN", "finance", 8.0e10, 80000, { foundedYear: 2001, brandValue: 4.0e10, exchange: "nikkei" }),
  C("ICICI Bank", "IND", "finance", 2.0e10, 130000, { foundedYear: 1994, brandValue: 3.4e10, exchange: "nse" }),
  C("Saudi Arabian National Bank", "SAU", "finance", 1.1e10, 50000, { foundedYear: 2000, brandValue: 2.4e10, exchange: "tadawul" }),
  C("Emirates NBD", "ARE", "finance", 2.2e10, 31000, { foundedYear: 2007, brandValue: 4.0e10, exchange: "idx" }),

  // ---- Energy ----
  C("Saudi Aramco", "SAU", "energy", 5.2e11, 75000, { foundedYear: 1933, brandValue: 1.8e12, stateOwnership: 0.76, exchange: "tadawul" }),
  C("Petrobras", "BRA", "energy", 2.6e11, 62000, { foundedYear: 1953, brandValue: 8.0e10, stateOwnership: 0.55, exchange: "b3" }),
  C("Exxon Mobil", "USA", "mining", 3.4e11, 62000, { foundedYear: 1999, brandValue: 4.4e11, exchange: "nyse" }),
  C("Chevron", "USA", "mining", 1.9e11, 45600, { foundedYear: 1879, brandValue: 3.0e11, exchange: "nyse" }),
  C("Shell plc", "GBR", "mining", 2.1e11, 96000, { foundedYear: 1907, brandValue: 2.2e11, exchange: "lse" }),
  C("TotalEnergies SE", "FRA", "mining", 1.6e11, 110000, { foundedYear: 1924, brandValue: 1.6e11, exchange: "euronext" }),
  C("Gazprom", "RUS", "energy", 1.4e11, 470000, { foundedYear: 1988, brandValue: 8.0e10, stateOwnership: 0.5, exchange: "moex" }),
  C("Rosneft", "RUS", "mining", 9.0e10, 62000, { foundedYear: 1993, brandValue: 4.0e10, stateOwnership: 0.62, exchange: "moex" }),
  C("Saudi Aramco Trading", "SAU", "mining", 1.2e11, 4000, { foundedYear: 2006, listed: false, stateOwnership: 1 }),
  C("ONGC", "IND", "energy", 4.4e10, 48000, { foundedYear: 1956, brandValue: 3.0e10, stateOwnership: 0.61, exchange: "nse" }),

  // ---- Manufacturing / autos / defence ----
  C("Toyota Motor", "JPN", "manufacturing", 3.2e11, 380000, { foundedYear: 1937, brandValue: 2.6e11, exchange: "nikkei" }),
  C("Volkswagen", "DEU", "manufacturing", 2.8e11, 350000, { foundedYear: 1937, brandValue: 9.0e10, exchange: "dax" }),
  C("Mercedes-Benz Group", "DEU", "manufacturing", 1.5e11, 175000, { foundedYear: 1926, brandValue: 8.0e10, exchange: "dax" }),
  C("Boeing", "USA", "manufacturing", 8.0e10, 170000, { foundedYear: 1916, brandValue: 1.1e11, exchange: "nyse" }),
  C("Airbus", "FRA", "manufacturing", 6.0e10, 130000, { foundedYear: 1970, brandValue: 8.0e10, listed: false, stateOwnership: 0.3 }),
  C("Lockheed Martin", "USA", "defence", 7.0e10, 160000, { foundedYear: 1995, brandValue: 6.0e10, stateOwnership: 0, exchange: "nyse" }),
  C("Raytheon Technologies", "USA", "defence", 4.4e10, 95000, { foundedYear: 1920, brandValue: 4.0e10, exchange: "nyse" }),
  C("Rolls-Royce Holdings", "GBR", "defence", 2.0e10, 42000, { foundedYear: 1904, brandValue: 2.0e10, exchange: "lse" }),
  C("Samsung Heavy Industries", "KOR", "defence", 1.6e10, 30000, { foundedYear: 1952, brandValue: 1.0e10, exchange: "krx" }),
  C("BAE Systems", "GBR", "defence", 2.6e10, 86000, { foundedYear: 1999, brandValue: 2.0e10, stateOwnership: 0.23, exchange: "lse" }),
  C("Samsung C&T", "KOR", "construction", 2.4e10, 40000, { foundedYear: 1952, exchange: "krx" }),

  // ---- Healthcare / pharma ----
  C("Johnson & Johnson", "USA", "healthcare", 8.8e10, 138000, { foundedYear: 1886, brandValue: 1.1e11, exchange: "nyse" }),
  C("UnitedHealth Group", "USA", "healthcare", 4.0e11, 400000, { foundedYear: 1977, brandValue: 3.0e11, exchange: "nyse" }),
  C("Pfizer", "USA", "healthcare", 5.0e10, 88000, { foundedYear: 1849, brandValue: 1.4e11, exchange: "nyse" }),
  C("Roche", "CHE", "healthcare", 6.0e10, 94000, { foundedYear: 1896, brandValue: 1.4e11, exchange: "euronext" }),
  C("Novartis", "CHE", "healthcare", 5.0e10, 76000, { foundedYear: 1996, brandValue: 1.0e11, exchange: "euronext" }),
  C("Novo Nordisk", "DNK", "healthcare", 3.0e10, 23000, { foundedYear: 1923, brandValue: 1.4e11, exchange: "euronext" }),
  C("Merck & Co.", "USA", "healthcare", 6.0e10, 68000, { foundedYear: 1891, brandValue: 1.0e11, exchange: "nyse" }),
  C("AstraZeneca", "GBR", "healthcare", 5.0e10, 92000, { foundedYear: 1998, brandValue: 1.0e11, exchange: "lse" }),

  // ---- Telecom ----
  C("China Mobile", "CHN", "telecom", 1.1e12, 450000, { foundedYear: 2000, brandValue: 1.4e12, stateOwnership: 0.82, exchange: "sse" }),
  C("AT&T", "USA", "telecom", 1.7e11, 160000, { foundedYear: 1985, brandValue: 1.4e11, exchange: "nyse" }),
  C("Verizon", "USA", "telecom", 1.3e11, 105000, { foundedYear: 1983, brandValue: 1.2e11, exchange: "nyse" }),
  C("Deutsche Telekom", "DEU", "telecom", 8.0e10, 200000, { foundedYear: 1995, brandValue: 7.0e10, stateOwnership: 0.32, exchange: "dax" }),
  C("Orange S.A.", "FRA", "telecom", 4.4e10, 71000, { foundedYear: 1988, brandValue: 2.4e10, stateOwnership: 0.34, exchange: "euronext" }),
  C("SoftBank Telecom", "JPN", "telecom", 1.0e11, 65000, { foundedYear: 2006, exchange: "nikkei" }),
  C("Singtel", "SGP", "telecom", 1.8e10, 23000, { foundedYear: 1994, brandValue: 2.4e10, stateOwnership: 0.24, exchange: "sgx" }),

  // ---- Consumer / retail / autos elsewhere ----
  C("Walmart", "USA", "retail", 6.4e11, 2100000, { foundedYear: 1962, brandValue: 4.4e11, exchange: "nyse" }),
  C("Costco", "USA", "retail", 2.4e11, 333000, { foundedYear: 1983, brandValue: 2.4e11, exchange: "nasdaq" }),
  C("Nestle", "CHE", "retail", 9.4e10, 270000, { foundedYear: 1866, brandValue: 2.0e11, exchange: "euronext" }),
  C("Unilever", "GBR", "retail", 5.2e10, 190000, { foundedYear: 1929, brandValue: 1.2e11, exchange: "lse" }),
  C("Procter & Gamble", "USA", "retail", 8.0e10, 108000, { foundedYear: 1837, brandValue: 2.0e11, exchange: "nyse" }),
  C("Toyota Tsusho", "JPN", "retail", 4.0e10, 50000, { foundedYear: 1948, exchange: "nikkei" }),
  C("Tata Sons", "IND", "manufacturing", 2.0e11, 480000, { foundedYear: 1868, brandValue: 1.4e11, stateOwnership: 0.66, listed: false }),

  // ---- Real estate / utilities / banks of the Gulf and LatAm ----
  C("Emaar Properties", "ARE", "real-estate", 6.0e9, 12000, { foundedYear: 1997, brandValue: 1.0e10, stateOwnership: 0.85, exchange: "idx" }),
  C("Saudi Real Estate", "SAU", "real-estate", 2.0e9, 4000, { foundedYear: 1973, stateOwnership: 0.4, listed: false }),
  C("América Móvil", "MEX", "telecom", 4.0e10, 180000, { foundedYear: 2000, brandValue: 2.0e10, exchange: "bmv" }),
  C("Pemex", "MEX", "energy", 6.0e10, 78000, { foundedYear: 1938, brandValue: 4.0e10, stateOwnership: 0.83, listed: false }),
  C("Femsa", "MEX", "retail", 5.0e10, 260000, { foundedYear: 1890, brandValue: 2.0e10, exchange: "bmv" }),
  C("Ecopetrol", "COL", "energy", 1.2e10, 6000, { foundedYear: 1948, stateOwnership: 0.73, exchange: "idx" }),
  C("Anglo American", "GBR", "mining", 2.4e10, 90000, { foundedYear: 1911, brandValue: 1.4e10, exchange: "lse" }),
  C("BHP", "AUS", "mining", 4.4e10, 58000, { foundedYear: 1885, brandValue: 1.0e11, exchange: "asx" }),
  C("Rio Tinto", "AUS", "mining", 3.4e10, 54000, { foundedYear: 1873, brandValue: 4.0e10, exchange: "asx" }),
  C("Glencore", "CHE", "mining", 1.8e11, 80000, { foundedYear: 1974, brandValue: 1.0e10, exchange: "euronext" }),
  C("FirstRand", "ZAF", "finance", 1.0e10, 33000, { foundedYear: 1998, exchange: "jse" }),
  C("Naspers", "ZAF", "technology", 5.0e9, 5500, { foundedYear: 1915, brandValue: 4.0e10, exchange: "jse" }),
  C("PDVSA", "VEN", "energy", 1.0e10, 90000, { foundedYear: 1976, stateOwnership: 1, listed: false }),
  C("Saudi Aramco Downstream", "SAU", "real-estate", 8.0e9, 2000, { foundedYear: 2013, listed: false, stateOwnership: 1 }),
  C("Gazprombank", "RUS", "finance", 1.0e10, 240000, { foundedYear: 1990, stateOwnership: 0.5, listed: false }),
  C("PDVSA refining", "VEN", "mining", 4.0e9, 12000, { foundedYear: 1976, stateOwnership: 1, listed: false }),
  C("Petronas", "MYS", "energy", 5.0e10, 47000, { foundedYear: 1974, brandValue: 4.0e10, stateOwnership: 1, exchange: "idx" }),
  C("Yodogawa Steel", "JPN", "manufacturing", 1.6e10, 38000, { foundedYear: 1798, exchange: "nikkei" }),
  C("Bank of China", "CHN", "finance", 8.0e10, 180000, { foundedYear: 1912, stateOwnership: 0.5, exchange: "hkg" }),
  C("ICBC", "CHN", "finance", 6.0e10, 420000, { foundedYear: 1984, stateOwnership: 0.7, exchange: "sse" }),
];

// ===========================================================================
// 2010 -- pre-smartphone-peak, financial crisis aftermath
// ===========================================================================

export const COMPANIES_2010: CompanySeed[] = [
  C("Exxon Mobil", "USA", "mining", 3.6e11, 62000, { foundedYear: 1999, brandValue: 2.4e11, exchange: "nyse" }),
  C("Saudi Aramco", "SAU", "energy", 5.4e11, 80000, { foundedYear: 1933, brandValue: 8.0e11, stateOwnership: 0.8, exchange: "tadawul" }),
  C("Royal Dutch Shell", "GBR", "mining", 2.3e11, 96000, { foundedYear: 1907, brandValue: 1.4e11, exchange: "lse" }),
  C("Petrobras", "BRA", "mining", 2.4e11, 57000, { foundedYear: 1953, stateOwnership: 0.5, exchange: "b3" }),
  C("Walmart", "USA", "retail", 4.2e11, 2100000, { foundedYear: 1962, brandValue: 2.0e11, exchange: "nyse" }),
  C("Toyota", "JPN", "manufacturing", 1.9e11, 316000, { foundedYear: 1937, brandValue: 1.2e11, exchange: "nikkei" }),
  C("Chevron", "USA", "mining", 1.8e11, 40000, { foundedYear: 1879, brandValue: 1.4e11, exchange: "nyse" }),
  C("Volkswagen", "DEU", "manufacturing", 2.2e11, 300000, { foundedYear: 1937, brandValue: 4.0e10, exchange: "dax" }),
  C("Pfizer", "USA", "healthcare", 4.4e10, 88000, { foundedYear: 1849, brandValue: 5.0e10, exchange: "nyse" }),
  C("Johnson & Johnson", "USA", "healthcare", 7.2e10, 124000, { foundedYear: 1886, brandValue: 8.0e10, exchange: "nyse" }),
  C("Nokia", "FIN", "telecom", 4.0e10, 130000, { foundedYear: 1865, brandValue: 2.0e10, exchange: "euronext" }),
  C("Ericsson", "SWE", "telecom", 2.0e10, 80000, { foundedYear: 1876, brandValue: 1.4e10, exchange: "idx" }),
  C("Microsoft", "USA", "technology", 6.2e10, 94000, { foundedYear: 1975, brandValue: 1.6e11, exchange: "nasdaq" }),
  C("Apple", "USA", "technology", 1.6e11, 73000, { foundedYear: 1976, brandValue: 1.4e11, exchange: "nasdaq" }),
  C("Google", "USA", "technology", 2.9e10, 24000, { foundedYear: 1998, brandValue: 1.0e11, exchange: "nasdaq" }),
  C("Cisco", "USA", "technology", 4.0e10, 75000, { foundedYear: 1984, brandValue: 8.0e10, exchange: "nasdaq" }),
  C("Intel", "USA", "technology", 5.3e10, 72000, { foundedYear: 1968, brandValue: 8.0e10, exchange: "nasdaq" }),
  C("TSMC", "TWN", "technology", 2.7e10, 39000, { foundedYear: 1987, brandValue: 2.0e10, exchange: "twse" }),
  C("Samsung Electronics", "KOR", "technology", 1.4e11, 212000, { foundedYear: 1969, brandValue: 4.0e10, exchange: "krx" }),
  C("Sony", "JPN", "technology", 7.0e10, 103000, { foundedYear: 1946, brandValue: 4.0e10, exchange: "nikkei" }),
  C("Toyota Tsusho", "JPN", "retail", 4.0e10, 50000, { foundedYear: 1948, exchange: "nikkei" }),
  C("Petronas", "MYS", "energy", 6.0e10, 47000, { foundedYear: 1974, stateOwnership: 1, exchange: "idx" }),
  C("Saudi Al-Qahtani Group", "SAU", "mining", 8.0e10, 50000, { foundedYear: 2000, listed: false, stateOwnership: 0.8 }),
  C("Saudi Aramco Shipping", "SAU", "transport", 4.0e10, 12000, { foundedYear: 2002, listed: false, stateOwnership: 1 }),
  C("Saudi Aramco Aviation", "SAU", "transport", 2.0e10, 6000, { foundedYear: 2008, listed: false, stateOwnership: 1 }),
  C("Petrobras Distribuidora", "BRA", "retail", 4.0e10, 60000, { foundedYear: 1997, stateOwnership: 0.6, listed: false }),
  C("Banco do Brasil", "BRA", "finance", 6.0e10, 250000, { foundedYear: 1808, stateOwnership: 0.6, exchange: "b3" }),
  C("América Móvil", "MEX", "telecom", 2.4e10, 175000, { foundedYear: 2000, exchange: "bmv" }),
  C("Pemex refining", "MEX", "energy", 4.0e10, 30000, { foundedYear: 1965, stateOwnership: 1, listed: false }),
  C("Infosys", "IND", "technology", 6.0e9, 130000, { foundedYear: 1981, exchange: "nse" }),
  C("Tata Motors", "IND", "manufacturing", 1.4e10, 250000, { foundedYear: 1945, stateOwnership: 0.34, exchange: "nse" }),
  C("Reliance Industries", "IND", "manufacturing", 4.0e10, 130000, { foundedYear: 1966, stateOwnership: 0.5, exchange: "nse" }),
  C("Gazprom", "RUS", "energy", 1.3e11, 400000, { foundedYear: 1988, stateOwnership: 0.5, exchange: "moex" }),
  C("BP", "GBR", "mining", 3.0e11, 80000, { foundedYear: 1909, brandValue: 1.0e11, exchange: "lse" }),
  C("Siemens", "DEU", "manufacturing", 8.0e10, 300000, { foundedYear: 1847, exchange: "dax" }),
  C("Airbus", "FRA", "manufacturing", 3.0e10, 100000, { foundedYear: 1970, stateOwnership: 0.3, listed: false }),
  C("Sony Pictures", "JPN", "media", 8.0e9, 33000, { foundedYear: 1989, exchange: "nikkei" }),
];

// ===========================================================================
// 1990 -- pre-internet, just off the end of the Cold War
// ===========================================================================

export const COMPANIES_1990: CompanySeed[] = [
  C("Exxon Corporation", "USA", "mining", 1.6e11, 75000, { foundedYear: 1870, brandValue: 6.0e10, exchange: "nyse" }),
  C("Saudi Aramco", "SAU", "energy", 1.0e11, 70000, { foundedYear: 1933, stateOwnership: 1, listed: false }),
  C("Royal Dutch Shell", "GBR", "mining", 1.4e11, 85000, { foundedYear: 1907, brandValue: 6.0e10, exchange: "lse" }),
  C("IBM", "USA", "technology", 6.0e10, 350000, { foundedYear: 1911, brandValue: 5.0e10, exchange: "nyse" }),
  C("General Motors", "USA", "manufacturing", 1.3e11, 300000, { foundedYear: 1908, brandValue: 2.0e10, exchange: "nyse" }),
  C("Toyota", "JPN", "manufacturing", 6.0e10, 200000, { foundedYear: 1937, exchange: "nikkei" }),
  C("Sony", "JPN", "technology", 3.0e10, 80000, { foundedYear: 1946, exchange: "nikkei" }),
  C("Mitsubishi Corporation", "JPN", "retail", 2.0e10, 60000, { foundedYear: 1954, exchange: "nikkei" }),
  C("British Petroleum", "GBR", "mining", 1.6e11, 70000, { foundedYear: 1909, exchange: "lse" }),
  C("Shell UK", "GBR", "mining", 3.0e10, 60000, { foundedYear: 1907, exchange: "lse" }),
  C("Unilever", "GBR", "retail", 2.4e10, 130000, { foundedYear: 1929, exchange: "lse" }),
  C("Nestle", "CHE", "retail", 2.4e10, 130000, { foundedYear: 1866, brandValue: 4.0e10, exchange: "euronext" }),
  C("Volkswagen", "DEU", "manufacturing", 5.0e10, 250000, { foundedYear: 1937, exchange: "dax" }),
  C("Siemens", "DEU", "manufacturing", 3.0e10, 300000, { foundedYear: 1847, exchange: "dax" }),
  C("Daimler-Benz", "DEU", "manufacturing", 4.0e10, 180000, { foundedYear: 1926, exchange: "dax" }),
  C("Total", "FRA", "mining", 3.0e10, 70000, { foundedYear: 1924, exchange: "euronext" }),
  C("ELF Aquitaine", "FRA", "mining", 3.0e10, 80000, { foundedYear: 1949, exchange: "euronext" }),
  C("Petrobras", "BRA", "mining", 1.4e11, 50000, { foundedYear: 1953, stateOwnership: 1, listed: false }),
  C("Tata Group", "IND", "manufacturing", 4.0e9, 200000, { foundedYear: 1868, stateOwnership: 0.5, listed: false }),
  C("Reliance Industries", "IND", "manufacturing", 1.4e10, 60000, { foundedYear: 1966, stateOwnership: 0.4, exchange: "nse" }),
  C("Gazprom", "USS", "energy", 8.0e10, 300000, { foundedYear: 1988, stateOwnership: 1, listed: false }),
  C("BP", "GBR", "mining", 6.0e10, 70000, { foundedYear: 1909, exchange: "lse" }),
  C("Pfizer", "USA", "healthcare", 1.0e10, 40000, { foundedYear: 1849, exchange: "nyse" }),
  C("Johnson & Johnson", "USA", "healthcare", 1.4e10, 40000, { foundedYear: 1886, exchange: "nyse" }),
  C("Sears", "USA", "retail", 2.4e10, 400000, { foundedYear: 1892, exchange: "nyse" }),
  C("Samsung", "KOR", "technology", 3.0e10, 58000, { foundedYear: 1969, exchange: "krx" }),
  C("Matsushita", "JPN", "manufacturing", 1.0e10, 120000, { foundedYear: 1918, exchange: "nikkei" }),
  C("Thyssen", "DEU", "manufacturing", 2.4e10, 180000, { foundedYear: 1900, exchange: "dax" }),
  C("British Steel", "GBR", "manufacturing", 8.0e9, 70000, { foundedYear: 1928, exchange: "lse" }),
];

// ===========================================================================
// 1950 -- reconstruction begins
// ===========================================================================

export const COMPANIES_1950: CompanySeed[] = [
  C("Standard Oil of New Jersey", "USA", "mining", 2.0e10, 50000, { foundedYear: 1882, brandValue: 2.0e10, exchange: "nyse" }),
  C("Gulf Oil", "USA", "mining", 1.4e10, 40000, { foundedYear: 1901, exchange: "nyse" }),
  C("British Petroleum", "GBR", "mining", 1.4e10, 40000, { foundedYear: 1909, exchange: "lse" }),
  C("Anglo-Persian Oil", "GBR", "mining", 1.4e10, 35000, { foundedYear: 1909, exchange: "lse" }),
  C("Royal Dutch Shell", "GBR", "mining", 1.0e10, 45000, { foundedYear: 1907, exchange: "lse" }),
  C("Saudi Aramco", "SAU", "energy", 4.0e9, 12000, { foundedYear: 1933, stateOwnership: 1, listed: false }),
  C("Socony-Vacuum", "USA", "mining", 8.0e9, 35000, { foundedYear: 1870, exchange: "nyse" }),
  C("General Motors", "USA", "manufacturing", 7.0e10, 340000, { foundedYear: 1908, exchange: "nyse" }),
  C("Ford Motor", "USA", "manufacturing", 5.0e10, 180000, { foundedYear: 1903, exchange: "nyse" }),
  C("General Electric", "USA", "manufacturing", 2.0e10, 340000, { foundedYear: 1892, exchange: "nyse" }),
  C("DuPont", "USA", "manufacturing", 9.0e9, 73000, { foundedYear: 1802, exchange: "nyse" }),
  C("Unilever", "GBR", "retail", 1.0e10, 200000, { foundedYear: 1929, exchange: "lse" }),
  C("Imperial Chemical Industries", "GBR", "manufacturing", 9.0e9, 150000, { foundedYear: 1926, exchange: "lse" }),
  C("Anglo Steel", "GBR", "manufacturing", 4.0e9, 120000, { foundedYear: 1928, exchange: "lse" }),
  C("Siemens", "DEU", "manufacturing", 4.0e9, 220000, { foundedYear: 1847, exchange: "dax" }),
  C("AEG", "DEU", "manufacturing", 3.0e9, 170000, { foundedYear: 1883, exchange: "dax" }),
  C("Volkswagen", "DEU", "manufacturing", 4.0e9, 23000, { foundedYear: 1937, listed: false, stateOwnership: 0.6 }),
  C("Toyota", "JPN", "manufacturing", 3.0e9, 20000, { foundedYear: 1937, exchange: "nikkei" }),
  C("Hitachi", "JPN", "manufacturing", 3.0e9, 140000, { foundedYear: 1910, exchange: "nikkei" }),
  C("Nissan Motor", "JPN", "manufacturing", 2.0e9, 30000, { foundedYear: 1933, exchange: "nikkei" }),
  C("Samsung", "KOR", "manufacturing", 4.0e8, 12000, { foundedYear: 1938, stateOwnership: 0.4, exchange: "krx" }),
  C("Petrobras", "BRA", "mining", 4.0e9, 20000, { foundedYear: 1953, stateOwnership: 1, listed: false }),
  C("Tata Steel", "IND", "manufacturing", 1.0e9, 80000, { foundedYear: 1912, stateOwnership: 0.4, listed: false }),
  C("Bata", "CZE", "retail", 6.0e8, 60000, { foundedYear: 1894, listed: false }),
  C("Boeing", "USA", "manufacturing", 4.0e8, 15000, { foundedYear: 1916, listed: false }),
  C("Hindustan Aeronautics", "IND", "defence", 2.0e8, 30000, { foundedYear: 1940, stateOwnership: 1, listed: false }),
  C("Yuzhuralmash", "USS", "manufacturing", 4.0e9, 90000, { foundedYear: 1936, stateOwnership: 1, listed: false }),
];

// ===========================================================================
// 1930 -- listed equity is twenty Dow names and a thin London market
// ===========================================================================

export const COMPANIES_1930: CompanySeed[] = [
  C("General Motors", "USA", "manufacturing", 1.0e9, 49000, { foundedYear: 1908, exchange: "nyse" }),
  C("Standard Oil of New Jersey", "USA", "mining", 8.0e8, 25000, { foundedYear: 1882, exchange: "nyse" }),
  C("Atchison, Topeka and Santa Fe", "USA", "transport", 3.0e8, 38000, { foundedYear: 1859, exchange: "nyse" }),
  C("American Telephone and Telegraph", "USA", "telecom", 3.0e8, 200000, { foundedYear: 1885, exchange: "nyse" }),
  C("DuPont", "USA", "manufacturing", 2.0e8, 40000, { foundedYear: 1802, exchange: "nyse" }),
  C("Sears Roebuck", "USA", "retail", 3.0e8, 60000, { foundedYear: 1892, exchange: "nyse" }),
  C("Pennsylvania Railroad", "USA", "transport", 3.0e8, 180000, { foundedYear: 1846, exchange: "nyse" }),
  C("New York Central Railroad", "USA", "transport", 3.0e8, 140000, { foundedYear: 1853, exchange: "nyse" }),
  C("International Harvester", "USA", "manufacturing", 2.0e8, 80000, { foundedYear: 1902, exchange: "nyse" }),
  C("Radio Corporation of America", "USA", "telecom", 1.0e8, 12000, { foundedYear: 1919, exchange: "nyse" }),
  C("Anglo-Persian Oil", "GBR", "mining", 1.0e8, 20000, { foundedYear: 1909, exchange: "lse" }),
  C("Shell-Mex & BP", "GBR", "mining", 1.0e8, 25000, { foundedYear: 1912, exchange: "lse" }),
  C("Imperial Chemical Industries", "GBR", "manufacturing", 1.4e8, 50000, { foundedYear: 1926, exchange: "lse" }),
  C("Unilever", "GBR", "retail", 1.4e8, 90000, { foundedYear: 1929, exchange: "lse" }),
  C("Courtaulds", "GBR", "manufacturing", 6.0e7, 45000, { foundedYear: 1816, exchange: "lse" }),
  C("British Dyestuffs Corporation", "GBR", "manufacturing", 4.0e7, 25000, { foundedYear: 1919, exchange: "lse" }),
  C("AEG", "DEU", "manufacturing", 1.2e8, 120000, { foundedYear: 1883, listed: false, stateOwnership: 0.4 }),
  C("Siemens", "DEU", "manufacturing", 1.4e8, 200000, { foundedYear: 1847, exchange: "lse" }),
  C("Thyssen", "DEU", "manufacturing", 1.0e8, 150000, { foundedYear: 1900, listed: false }),
  C("Heinkel", "DEU", "manufacturing", 3.0e7, 12000, { foundedYear: 1911, listed: false, stateOwnership: 0.2 }),
  C("Fiat", "ITA", "manufacturing", 1.0e8, 70000, { foundedYear: 1899, listed: false, stateOwnership: 0.4 }),
  C("Toyota", "JPN", "manufacturing", 2.0e7, 8000, { foundedYear: 1937, listed: false, stateOwnership: 0.3 }),
  C("Mitsubishi", "JPN", "mining", 1.0e8, 70000, { foundedYear: 1870, exchange: "nikkei" }),
  C("Yugoslav Railways", "YUG", "transport", 3.0e7, 60000, { foundedYear: 1852, listed: false, stateOwnership: 1 }),
  C("Gapon Textiles", "USS", "manufacturing", 4.0e7, 30000, { foundedYear: 1843, listed: false, stateOwnership: 1 }),
];

/** Minimal scattered equity markets in 1900: canals, mills, banks. */
export const COMPANIES_1900: CompanySeed[] = [
  C("Bank of England", "GBR", "finance", 1.2e7, 3000, { foundedYear: 1694, listed: false, stateOwnership: 1 }),
  C("Barings Bank", "GBR", "finance", 8.0e6, 1200, { foundedYear: 1762, listed: false }),
  C("Rothschild & Sons", "GBR", "finance", 6.0e6, 900, { foundedYear: 1798, listed: false }),
  C("Lloyd's of London", "GBR", "finance", 5.0e6, 2000, { foundedYear: 1688, listed: false }),
  C("Grand Trunk Railway of Canada", "CAN", "transport", 1.0e7, 9000, { foundedYear: 1853, listed: false }),
  C("Pennsylvania Railroad", "USA", "transport", 2.4e7, 72000, { foundedYear: 1846, listed: false }),
  C("Cleveland, Cincinnati, Chicago and St. Louis Railway", "USA", "transport", 1.4e7, 48000, { foundedYear: 1889, listed: false }),
  C("American Bell Telephone", "USA", "telecom", 6.0e6, 15000, { foundedYear: 1877, listed: false }),
  C("Westinghouse Electric", "USA", "manufacturing", 8.0e6, 22000, { foundedYear: 1886, listed: false }),
  C("Lombard Trust", "USA", "finance", 4.0e6, 800, { foundedYear: 1894, listed: false }),
  C("Deutsche Bank", "DEU", "finance", 8.0e6, 3000, { foundedYear: 1870, listed: false }),
  C("Banque de France", "FRA", "finance", 6.0e6, 2500, { foundedYear: 1800, listed: false, stateOwnership: 1 }),
  C("Suez Canal Company", "EGY", "transport", 9.0e6, 9000, { foundedYear: 1858, listed: false, stateOwnership: 0.53 }),
  C("Standard Oil", "USA", "mining", 2.4e7, 12000, { foundedYear: 1870, listed: false }),
  C("Pennsylvania Coal", "USA", "mining", 1.0e7, 20000, { foundedYear: 1863, listed: false }),
  C("Carnegie Steel", "USA", "manufacturing", 1.6e7, 30000, { foundedYear: 1892, listed: false }),
  C("Mitsubishi Shipbuilding", "JPN", "manufacturing", 6.0e6, 30000, { foundedYear: 1857, listed: false, stateOwnership: 0.35 }),
  C("Compagnie de Suez", "FRA", "mining", 8.0e6, 4000, { foundedYear: 1858, listed: false }),
  C("Manchester Ship Canal Company", "GBR", "transport", 4.0e6, 5000, { foundedYear: 1887, listed: false }),
  C("Chemin de fer du Nord", "FRA", "transport", 6.0e6, 25000, { foundedYear: 1845, listed: false }),
  C("Tata Iron and Steel", "IND", "manufacturing", 4.0e6, 24000, { foundedYear: 1907, listed: false }),
];

export const COMPANIES_BY_YEAR: Record<number, CompanySeed[]> = {
  1900: COMPANIES_1900,
  1930: COMPANIES_1930,
  1950: COMPANIES_1950,
  1990: COMPANIES_1990,
  2010: COMPANIES_2010,
  2026: COMPANIES_2026,
};

export function companiesForYear(year: number): CompanySeed[] {
  if (COMPANIES_BY_YEAR[year]) return COMPANIES_BY_YEAR[year];
  const keys = Object.keys(COMPANIES_BY_YEAR).map(Number).sort((a, b) => a - b);
  const nearest = keys.filter((k) => k <= year).pop();
  return nearest ? COMPANIES_BY_YEAR[nearest] : COMPANIES_2026;
}