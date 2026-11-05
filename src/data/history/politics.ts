/**
 * Named political detail for the major powers at each scenario's start.
 *
 * Parties: "Name:ABBR:ideology:colour:seats" separated by |, ruling parties
 * prefixed with *. Seats are the lower house at the scenario date. Countries not
 * listed here get a governing bloc named after their real ruling party plus an
 * opposition bloc, rather than invented party names.
 *
 * Cabinet: finance, foreign, defence, central bank. Anyone not named is shown as
 * an unnamed official, again rather than inventing a person in the real cabinet.
 */

export interface PartySeed { name: string; abbr: string; ideology: number; colour: string; seats: number; ruling: boolean; }
export interface PoliticsDetail { chamber?: string; seats?: number; termYears?: number; nextElectionYear?: number; parties: PartySeed[]; cabinet?: { economy?: string; foreign?: string; defence?: string; centralBank?: string } }

function parties(raw: string): PartySeed[] {
  return raw.split("|").map((x) => {
    const ruling = x.startsWith("*");
    const [name, abbr, ideology, colour, seats] = (ruling ? x.slice(1) : x).split(":");
    return { name, abbr, ideology: Number(ideology), colour, seats: Number(seats), ruling };
  });
}

function D(chamber: string, termYears: number, nextElectionYear: number, p: string, cabinet?: string): PoliticsDetail {
  const c = cabinet?.split(";") ?? [];
  const ps = parties(p);
  return {
    chamber,
    termYears,
    nextElectionYear,
    seats: ps.reduce((a, x) => a + x.seats, 0),
    parties: ps,
    cabinet: cabinet ? { economy: c[0] || undefined, foreign: c[1] || undefined, defence: c[2] || undefined, centralBank: c[3] || undefined } : undefined,
  };
}

const R = "#c0392b", B = "#2563eb", DB = "#1e3a8a", G = "#16a34a", Y = "#eab308", O = "#ea580c", P = "#7c3aed", K = "#334155", DR = "#7f1d1d", T = "#0d9488";

export const POLITICS: Record<number, Record<string, PoliticsDetail>> = {
  1900: {
    GBR: D("House of Commons", 7, 1900, `*Conservative and Liberal Unionists:CON:25:${B}:402|Liberal Party:LIB:-10:${Y}:186|Irish Parliamentary Party:IPP:-5:${G}:82`, "Michael Hicks Beach;Marquess of Salisbury;Marquess of Lansdowne;Hugh Colin Smith"),
    FRA: D("Chamber of Deputies", 4, 1902, `*Republican Defence Bloc:BLOC:-15:${P}:350|Progressive Republicans:PROG:15:${B}:150|Conservative Right:DROITE:45:${K}:81`, "Joseph Caillaux;Theophile Delcasse;Gaston de Galliffet;Georges Pallain"),
    DEU: D("Reichstag", 5, 1903, `*Centre Party:Z:20:${K}:102|*German Conservative Party:DKP:45:${DB}:56|*National Liberal Party:NLP:15:${Y}:46|Social Democratic Party:SPD:-45:${R}:56|Free-minded Parties:FVP:-5:${O}:37|Regional and Minor Parties:OTH:10:${T}:100`, "Johannes von Miquel;Bernhard von Bulow;Heinrich von Gossler;Richard Koch"),
    USA: D("House of Representatives", 2, 1900, `*Republican Party:GOP:15:${R}:185|Democratic Party:DEM:-5:${B}:163|Populists and Silver Parties:POP:-25:${G}:9`, "Lyman J. Gage;John Hay;Elihu Root"),
    JPN: D("House of Representatives", 4, 1902, `Kenseito (Constitutional Party):KSTO:5:${B}:188|*Imperial Party and Independents:TEIK:30:${R}:112`, "Matsukata Masayoshi;Aoki Shuzo;Katsura Taro;Yamamoto Tatsuo"),
    ITA: D("Chamber of Deputies", 5, 1900, `*Historical Right:DS:20:${B}:319|Historical Left:SS:-5:${R}:109|Exedra (Radicals, Republicans, Socialists):EX:-35:${O}:80`, "Paolo Carcano;Emilio Visconti Venosta;Giuseppe Mirri"),
    AUT: D("Imperial Council", 6, 1901, `*Polish and Conservative Clubs:KONS:25:${K}:170|German Parties:DEU:15:${B}:120|Czech Parties:CZE:0:${R}:70|Social Democrats:SDAP:-40:${DR}:15`),
    RUS: { parties: [], cabinet: { economy: "Sergei Witte", foreign: "Mikhail Muravyov", defence: "Aleksey Kuropatkin", centralBank: "Eduard Pleske" } },
  },
  1914: {
    GBR: D("House of Commons", 5, 1915, `*Liberal Party:LIB:-15:${Y}:272|Conservative and Unionist Party:CON:25:${B}:271|Irish Parliamentary Party:IPP:-5:${G}:84|Labour Party:LAB:-35:${R}:42`, "David Lloyd George;Edward Grey;H. H. Asquith;Walter Cunliffe"),
    FRA: D("Chamber of Deputies", 4, 1918, `*Radical Party and Allies:RAD:-15:${P}:260|French Section of the Workers' International:SFIO:-45:${R}:103|Democratic Republicans:ARD:10:${B}:100|Conservatives:FED:40:${K}:139`, "Joseph Noulens;Rene Viviani;Adolphe Messimy;Georges Pallain"),
    DEU: D("Reichstag", 5, 1917, `Social Democratic Party:SPD:-40:${R}:110|*Centre Party:Z:20:${K}:91|*National Liberal Party:NLP:15:${Y}:45|Progressive People's Party:FVP:-5:${O}:42|*German Conservative Party:DKP:45:${DB}:43|Regional and Minor Parties:OTH:10:${T}:66`, "Clemens von Delbruck;Gottlieb von Jagow;Erich von Falkenhayn;Rudolf Havenstein"),
    USA: D("House of Representatives", 2, 1914, `*Democratic Party:DEM:-15:${B}:291|Republican Party:GOP:15:${R}:134|Progressive Party:PROG:-5:${G}:10`, "William Gibbs McAdoo;William Jennings Bryan;Lindley Garrison;Charles Hamlin"),
    RUS: D("State Duma", 5, 1917, `*Octobrists and Rightists:OCT:40:${DB}:220|Constitutional Democrats:KD:-5:${G}:107|Progressists:PROG:5:${Y}:48|Trudoviks and Social Democrats:TRUD:-50:${R}:24|National Groups:NAT:10:${T}:43`, "Pyotr Bark;Sergey Sazonov;Vladimir Sukhomlinov;Ivan Shipov"),
    AUT: { parties: [], cabinet: { economy: "Leon Bilinski", foreign: "Leopold Berchtold", defence: "Alexander von Krobatin", centralBank: "Alexander Popovics" } },
    ITA: D("Chamber of Deputies", 5, 1919, `*Liberals and Radicals:LIB:5:${B}:340|Italian Socialist Party:PSI:-45:${R}:52|Radical Party:RAD:-15:${O}:62|Catholics and Conservatives:CAT:25:${K}:54`, "Luigi Rava;Antonino di San Giuliano;Domenico Grandi;Bonaldo Stringher"),
    JPN: D("House of Representatives", 4, 1915, `Rikken Seiyukai:SY:15:${R}:188|*Rikken Doshikai:DS:5:${B}:93|Others:OTH:15:${K}:100`, "Wakatsuki Reijiro;Kato Takaaki;Oka Ichinosuke"),
    SRB: { parties: [], cabinet: { foreign: "Nikola Pasic", defence: "Dusan Stefanovic" } },
  },
  1930: {
    GBR: D("House of Commons", 5, 1934, `*Labour Party:LAB:-30:${R}:287|Conservative Party:CON:25:${B}:260|Liberal Party:LIB:0:${Y}:59`, "Philip Snowden;Arthur Henderson;Tom Shaw;Montagu Norman"),
    FRA: D("Chamber of Deputies", 4, 1932, `*Democratic Republican Alliance:ARD:15:${B}:180|Republican Federation:FR:35:${DB}:102|Radical Party:RAD:-10:${P}:125|French Section of the Workers' International:SFIO:-40:${R}:100|Communist Party:PCF:-85:${DR}:14`, "Paul Reynaud;Aristide Briand;Andre Maginot;Emile Moreau"),
    DEU: D("Reichstag", 4, 1932, `*Social Democratic Party:SPD:-30:${R}:153|German National People's Party:DNVP:50:${DB}:73|Centre Party:Z:10:${K}:61|Communist Party:KPD:-85:${DR}:54|German People's Party:DVP:20:${Y}:45|German Democratic Party:DDP:-5:${O}:25|Bavarian People's Party:BVP:25:${T}:16|National Socialist Party:NSDAP:90:#52525b:12`, "Rudolf Hilferding;Julius Curtius;Wilhelm Groener;Hjalmar Schacht"),
    USA: D("House of Representatives", 2, 1930, `*Republican Party:GOP:15:${R}:270|Democratic Party:DEM:0:${B}:164|Farmer-Labor Party:FLP:-30:${G}:1`, "Andrew Mellon;Henry L. Stimson;Patrick J. Hurley;Roy A. Young"),
    USS: D("Supreme Soviet", 4, 1934, `*All-Union Communist Party:VKP:-85:${R}:1000`, "Grigory Sokolnikov;Maxim Litvinov;Kliment Voroshilov;Georgy Pyatakov"),
    ITA: { parties: [{ name: "National Fascist Party", abbr: "PNF", ideology: 80, colour: "#111827", seats: 400, ruling: true }], cabinet: { economy: "Antonio Mosconi", foreign: "Dino Grandi", defence: "Pietro Gazzera", centralBank: "Bonaldo Stringher" } },
    JPN: D("House of Representatives", 4, 1932, `*Rikken Minseito:MS:5:${B}:273|Rikken Seiyukai:SY:15:${R}:174|Proletarian Parties and Others:OTH:-25:${G}:19`, "Inoue Junnosuke;Shidehara Kijuro;Ugaki Kazushige;Hijikata Hisakira"),
    ESP: { parties: [], cabinet: { economy: "Manuel Arguelles;", foreign: "Duke of Alba", defence: "Damaso Berenguer" } },
    CHN: { parties: [{ name: "Kuomintang", abbr: "KMT", ideology: 25, colour: B, seats: 80, ruling: true }, { name: "Communist Party of China", abbr: "CPC", ideology: -85, colour: R, seats: 20, ruling: false }], cabinet: { economy: "T. V. Soong", foreign: "Wang Zhengting", defence: "He Yingqin" } },
  },
  1950: {
    USA: D("House of Representatives", 2, 1950, `*Democratic Party:DEM:-10:${B}:263|Republican Party:GOP:15:${R}:171|American Labor Party:ALP:-50:${G}:1`, "John W. Snyder;Dean Acheson;Louis A. Johnson;Thomas B. McCabe"),
    GBR: D("House of Commons", 5, 1950, `*Labour Party:LAB:-30:${R}:393|Conservative Party:CON:20:${B}:197|Liberal Party:LIB:0:${Y}:12|Others:OTH:0:${K}:38`, "Stafford Cripps;Ernest Bevin;Emanuel Shinwell;Lord Catto"),
    FRA: D("National Assembly", 5, 1951, `French Communist Party:PCF:-80:${DR}:182|*Popular Republican Movement:MRP:5:${B}:158|*French Section of the Workers' International:SFIO:-30:${R}:102|*Radical Party:RAD:0:${P}:70|Independents and Peasants:CNI:30:${K}:106`, "Maurice Petsche;Robert Schuman;Rene Pleven;Wilfrid Baumgartner"),
    DEU: D("Bundestag", 4, 1953, `*Christian Democratic Union/CSU:CDU:15:${K}:139|Social Democratic Party:SPD:-25:${R}:131|*Free Democratic Party:FDP:15:${Y}:52|Others:OTH:15:${T}:80`, "Fritz Schaffer;Konrad Adenauer;;Wilhelm Vocke"),
    ITA: D("Chamber of Deputies", 5, 1953, `*Christian Democracy:DC:10:${B}:305|Popular Democratic Front:FDP:-60:${R}:183|Socialist Unity:US:-20:${O}:33|Others:OTH:15:${K}:53`, "Giuseppe Pella;Carlo Sforza;Randolfo Pacciardi;Donato Menichella"),
    USS: D("Supreme Soviet", 4, 1950, `*Communist Party of the Soviet Union:CPSU:-85:${R}:1316`, "Arseny Zverev;Andrey Vyshinsky;Aleksandr Vasilevsky;Vasily Popov"),
    CHN: D("Chinese People's Political Consultative Conference", 5, 1954, `*Communist Party of China:CPC:-80:${R}:662`, "Bo Yibo;Zhou Enlai;Zhu De;Nan Hanchen"),
    JPN: D("House of Representatives", 4, 1953, `*Democratic Liberal Party:DLP:20:${B}:264|Democratic Party:DP:10:${Y}:69|Socialist Party:JSP:-35:${R}:48|Communist Party:JCP:-80:${DR}:35|Others:OTH:5:${K}:50`, "Hayato Ikeda;Shigeru Yoshida;;Hisato Ichimada"),
    IND: { chamber: "Constituent Assembly", seats: 313, termYears: 5, nextElectionYear: 1951, parties: [{ name: "Indian National Congress", abbr: "INC", ideology: -20, colour: B, seats: 290, ruling: true }, { name: "Others", abbr: "OTH", ideology: 10, colour: K, seats: 23, ruling: false }], cabinet: { economy: "John Mathai", foreign: "Jawaharlal Nehru", defence: "Baldev Singh", centralBank: "C. D. Deshmukh" } },
    ARG: { parties: [{ name: "Peronist Party", abbr: "PP", ideology: 15, colour: B, seats: 112, ruling: true }, { name: "Radical Civic Union", abbr: "UCR", ideology: 0, colour: R, seats: 46, ruling: false }] },
  },
  1990: {
    USA: D("House of Representatives", 2, 1990, `*Republican Party:GOP:25:${R}:175|Democratic Party:DEM:-10:${B}:260`, "Nicholas F. Brady;James Baker;Dick Cheney;Alan Greenspan"),
    USS: D("Congress of People's Deputies", 5, 1994, `*Communist Party of the Soviet Union:CPSU:-55:${R}:1957|Reformers and Independents:IND:0:${B}:293`, "Valentin Pavlov;Eduard Shevardnadze;Dmitry Yazov;Viktor Gerashchenko"),
    GBR: D("House of Commons", 5, 1992, `*Conservative Party:CON:35:${B}:376|Labour Party:LAB:-20:${R}:229|Liberal Democrats:LD:-5:${Y}:22|Others:OTH:0:${K}:23`, "John Major;Douglas Hurd;Tom King;Robin Leigh-Pemberton"),
    FRA: D("National Assembly", 5, 1993, `*Socialist Party:PS:-25:${R}:275|Rally for the Republic:RPR:25:${DB}:130|Union for French Democracy:UDF:15:${B}:130|French Communist Party:PCF:-75:${DR}:27|Others:OTH:0:${K}:15`, "Pierre Beregovoy;Roland Dumas;Jean-Pierre Chevenement;Jacques de Larosiere"),
    DEU: D("Bundestag", 4, 1990, `*CDU/CSU:CDU:15:${K}:223|Social Democratic Party:SPD:-20:${R}:186|*Free Democratic Party:FDP:15:${Y}:46|The Greens:GRU:-25:${G}:42`, "Theo Waigel;Hans-Dietrich Genscher;Gerhard Stoltenberg;Karl Otto Pohl"),
    ITA: D("Chamber of Deputies", 5, 1992, `*Christian Democracy:DC:10:${B}:234|Communist Party:PCI:-50:${DR}:177|*Socialist Party:PSI:-15:${R}:94|Others:OTH:5:${K}:125`, "Guido Carli;Gianni De Michelis;Mino Martinazzoli;Carlo Azeglio Ciampi"),
    JPN: D("House of Representatives", 4, 1993, `*Liberal Democratic Party:LDP:20:${G}:275|Japan Socialist Party:JSP:-30:${R}:136|Komeito:KMT:0:${Y}:45|Others:OTH:0:${K}:56`, "Ryutaro Hashimoto;Taro Nakayama;Yozo Ishikawa;Yasushi Mieno"),
    CHN: D("National People's Congress", 5, 1993, `*Communist Party of China:CPC:-50:${R}:2970`, "Wang Bingqian;Qian Qichen;Qin Jiwei;Li Guixian"),
    IND: D("Lok Sabha", 5, 1994, `Indian National Congress:INC:-10:${B}:197|*Janata Dal:JD:-10:${G}:143|Bharatiya Janata Party:BJP:40:${O}:85|Communist Party of India (Marxist):CPM:-65:${R}:33|Others:OTH:0:${K}:85`, "Madhu Dandavate;Inder Kumar Gujral;V. P. Singh;R. N. Malhotra"),
    IRQ: { parties: [{ name: "Arab Socialist Ba'ath Party", abbr: "BAATH", ideology: -20, colour: R, seats: 250, ruling: true }], cabinet: { foreign: "Tariq Aziz", defence: "Abdul Jabbar Shanshal" } },
  },
  2010: {
    USA: D("House of Representatives", 2, 2010, `*Democratic Party:DEM:-15:${B}:257|Republican Party:GOP:25:${R}:178`, "Timothy Geithner;Hillary Clinton;Robert Gates;Ben Bernanke"),
    GBR: D("House of Commons", 5, 2010, `*Labour Party:LAB:-15:${R}:345|Conservative Party:CON:20:${B}:193|Liberal Democrats:LD:-5:${Y}:63|Others:OTH:0:${K}:49`, "Alistair Darling;David Miliband;Bob Ainsworth;Mervyn King"),
    FRA: D("National Assembly", 5, 2012, `*Union for a Popular Movement:UMP:20:${DB}:313|Socialist Party:PS:-20:${R}:186|New Centre and Allies:NC:10:${B}:40|Others:OTH:-20:${K}:38`, "Christine Lagarde;Bernard Kouchner;Herve Morin;Christian Noyer"),
    DEU: D("Bundestag", 4, 2013, `*CDU/CSU:CDU:12:${K}:239|Social Democratic Party:SPD:-15:${R}:146|*Free Democratic Party:FDP:20:${Y}:93|The Left:LINKE:-50:${DR}:76|Greens:GRU:-20:${G}:68`, "Wolfgang Schauble;Guido Westerwelle;Karl-Theodor zu Guttenberg;Axel Weber"),
    ITA: D("Chamber of Deputies", 5, 2013, `*The People of Freedom:PdL:25:${B}:276|Democratic Party:PD:-15:${R}:217|*Northern League:LN:45:${G}:60|Others:OTH:0:${K}:77`, "Giulio Tremonti;Franco Frattini;Ignazio La Russa;Mario Draghi"),
    ESP: D("Congress of Deputies", 4, 2012, `*Spanish Socialist Workers' Party:PSOE:-15:${R}:169|People's Party:PP:20:${B}:154|Others:OTH:0:${K}:27`, "Elena Salgado;Miguel Angel Moratinos;Carme Chacon;Miguel Angel Fernandez Ordonez"),
    GRC: D("Hellenic Parliament", 4, 2013, `*PASOK:PASOK:-10:${G}:160|New Democracy:ND:20:${B}:91|Communist Party of Greece:KKE:-80:${R}:21|Others:OTH:0:${K}:28`, "George Papaconstantinou;George Papandreou;Evangelos Venizelos;George Provopoulos"),
    RUS: D("State Duma", 5, 2011, `*United Russia:ER:25:${B}:315|Communist Party:KPRF:-60:${R}:57|Liberal Democratic Party:LDPR:40:${Y}:40|A Just Russia:SR:-20:${O}:38`, "Alexei Kudrin;Sergey Lavrov;Anatoliy Serdyukov;Sergey Ignatyev"),
    CHN: D("National People's Congress", 5, 2013, `*Communist Party of China:CPC:-35:${R}:2987`, "Xie Xuren;Yang Jiechi;Liang Guanglie;Zhou Xiaochuan"),
    JPN: D("House of Representatives", 4, 2013, `*Democratic Party of Japan:DPJ:-5:${B}:308|Liberal Democratic Party:LDP:20:${G}:119|Komeito:KMT:5:${Y}:21|Others:OTH:0:${K}:32`, "Naoto Kan;Katsuya Okada;Toshimi Kitazawa;Masaaki Shirakawa"),
    IND: D("Lok Sabha", 5, 2014, `*Indian National Congress:INC:-15:${B}:206|Bharatiya Janata Party:BJP:30:${O}:116|Others:OTH:0:${K}:221`, "Pranab Mukherjee;S. M. Krishna;A. K. Antony;Duvvuri Subbarao"),
    BRA: D("Chamber of Deputies", 4, 2010, `*Workers' Party:PT:-25:${R}:79|Brazilian Democratic Movement:PMDB:5:${G}:90|Brazilian Social Democracy Party:PSDB:10:${B}:59|Others:OTH:0:${K}:285`, "Guido Mantega;Celso Amorim;Nelson Jobim;Henrique Meirelles"),
  },
  2020: {
    USA: D("House of Representatives", 2, 2020, `*Republican Party:GOP:30:${R}:197|Democratic Party:DEM:-15:${B}:233|Independent and Vacant:IND:0:${K}:5`, "Steven Mnuchin;Mike Pompeo;Mark Esper;Jerome Powell"),
    GBR: D("House of Commons", 5, 2024, `*Conservative Party:CON:20:${B}:365|Labour Party:LAB:-25:${R}:202|Scottish National Party:SNP:-15:${Y}:48|Others:OTH:0:${K}:35`, "Rishi Sunak;Dominic Raab;Ben Wallace;Andrew Bailey"),
    FRA: D("National Assembly", 5, 2022, `*La Republique En Marche:LREM:5:${Y}:301|The Republicans:LR:25:${B}:104|*MoDem:MODEM:5:${O}:46|Socialist Party:PS:-20:${R}:28|Others:OTH:0:${K}:98`, "Bruno Le Maire;Jean-Yves Le Drian;Florence Parly;Francois Villeroy de Galhau"),
    DEU: D("Bundestag", 4, 2021, `*CDU/CSU:CDU:10:${K}:246|*Social Democratic Party:SPD:-15:${R}:152|Alternative for Germany:AfD:65:#38bdf8:89|Free Democratic Party:FDP:20:${Y}:80|The Left:LINKE:-50:${DR}:69|Greens:GRU:-15:${G}:67`, "Olaf Scholz;Heiko Maas;Annegret Kramp-Karrenbauer;Jens Weidmann"),
    ITA: D("Chamber of Deputies", 5, 2023, `*Five Star Movement:M5S:0:${Y}:216|Lega:LEGA:50:${G}:125|*Democratic Party:PD:-15:${R}:111|Forza Italia:FI:20:${B}:96|Others:OTH:0:${K}:82`, "Roberto Gualtieri;Luigi Di Maio;Lorenzo Guerini;Ignazio Visco"),
    ESP: D("Congress of Deputies", 4, 2023, `*Spanish Socialist Workers' Party:PSOE:-18:${R}:120|People's Party:PP:20:${B}:89|Vox:VOX:60:${G}:52|*Unidas Podemos:UP:-45:${P}:35|Others:OTH:0:${K}:54`, "Maria Jesus Montero;Arancha Gonzalez Laya;Margarita Robles;Pablo Hernandez de Cos"),
    RUS: D("State Duma", 5, 2021, `*United Russia:ER:30:${B}:341|Communist Party:KPRF:-60:${R}:43|Liberal Democratic Party:LDPR:40:${Y}:39|A Just Russia:SR:-20:${O}:23`, "Anton Siluanov;Sergey Lavrov;Sergey Shoigu;Elvira Nabiullina"),
    CHN: D("National People's Congress", 5, 2023, `*Communist Party of China:CPC:-45:${R}:2980`, "Liu Kun;Wang Yi;Wei Fenghe;Yi Gang"),
    JPN: D("House of Representatives", 4, 2021, `*Liberal Democratic Party:LDP:25:${G}:285|Constitutional Democratic Party:CDP:-15:${B}:119|*Komeito:KMT:5:${Y}:29|Others:OTH:0:${K}:32`, "Taro Aso;Toshimitsu Motegi;Taro Kono;Haruhiko Kuroda"),
    IND: D("Lok Sabha", 5, 2024, `*Bharatiya Janata Party:BJP:35:${O}:303|Indian National Congress:INC:-15:${B}:52|Others:OTH:0:${K}:188`, "Nirmala Sitharaman;S. Jaishankar;Rajnath Singh;Shaktikanta Das"),
    BRA: D("Chamber of Deputies", 4, 2022, `*Social Liberal Party:PSL:50:${G}:53|Workers' Party:PT:-30:${R}:54|Others:OTH:5:${K}:406`, "Paulo Guedes;Ernesto Araujo;Fernando Azevedo;Roberto Campos Neto"),
    AUS: D("House of Representatives", 3, 2022, `*Liberal-National Coalition:LNP:18:${B}:77|Australian Labor Party:ALP:-15:${R}:68|Others:OTH:0:${K}:6`, "Josh Frydenberg;Marise Payne;Linda Reynolds;Philip Lowe"),
    CAN: D("House of Commons", 4, 2023, `*Liberal Party:LPC:-10:${R}:157|Conservative Party:CPC:20:${B}:121|Bloc Quebecois:BQ:-5:${T}:32|New Democratic Party:NDP:-30:${O}:24|Others:OTH:0:${K}:4`, "Bill Morneau;Francois-Philippe Champagne;Harjit Sajjan;Stephen Poloz"),
  },
  2026: {
    USA: D("House of Representatives", 2, 2026, `*Republican Party:GOP:30:${R}:220|Democratic Party:DEM:-15:${B}:215`, "Scott Bessent;Marco Rubio;Pete Hegseth;Jerome Powell"),
    GBR: D("House of Commons", 5, 2029, `*Labour Party:LAB:-12:${R}:402|Conservative Party:CON:22:${B}:121|Liberal Democrats:LD:-5:${Y}:72|Reform UK:REF:55:${T}:5|Others:OTH:0:${K}:50`, "Rachel Reeves;Yvette Cooper;John Healey;Andrew Bailey"),
    FRA: D("National Assembly", 5, 2027, `National Rally:RN:60:${DB}:123|*Ensemble:ENS:5:${Y}:165|*The Republicans:LR:25:${B}:47|France Unbowed:LFI:-55:${R}:71|Socialist Party:PS:-20:${O}:66|Others:OTH:0:${K}:105`, "Roland Lescure;Jean-Noel Barrot;Catherine Vautrin;Francois Villeroy de Galhau"),
    DEU: D("Bundestag", 4, 2029, `*CDU/CSU:CDU:15:${K}:208|Alternative for Germany:AfD:65:#38bdf8:152|*Social Democratic Party:SPD:-15:${R}:120|Greens:GRU:-15:${G}:85|The Left:LINKE:-50:${DR}:64|Others:OTH:0:${T}:1`, "Lars Klingbeil;Johann Wadephul;Boris Pistorius;Joachim Nagel"),
    ITA: D("Chamber of Deputies", 5, 2027, `*Brothers of Italy:FdI:40:${DB}:118|Democratic Party:PD:-15:${R}:69|*Lega:LEGA:50:${G}:66|Five Star Movement:M5S:-5:${Y}:52|*Forza Italia:FI:15:${B}:45|Others:OTH:0:${K}:50`, "Giancarlo Giorgetti;Antonio Tajani;Guido Crosetto;Fabio Panetta"),
    ESP: D("Congress of Deputies", 4, 2027, `People's Party:PP:20:${B}:137|*Spanish Socialist Workers' Party:PSOE:-18:${R}:121|Vox:VOX:60:${G}:33|*Sumar:SMR:-40:${P}:31|Others:OTH:0:${K}:28`, "Carlos Cuerpo;Jose Manuel Albares;Margarita Robles;Jose Luis Escriva"),
    RUS: D("State Duma", 5, 2026, `*United Russia:ER:35:${B}:324|Communist Party:KPRF:-60:${R}:57|A Just Russia:SR:-20:${O}:27|LDPR:LDPR:45:${Y}:21|New People:NP:15:${T}:15|Others:OTH:0:${K}:6`, "Anton Siluanov;Sergey Lavrov;Andrey Belousov;Elvira Nabiullina"),
    UKR: D("Verkhovna Rada", 5, 2027, `*Servant of the People:SN:5:${G}:229|Others:OTH:5:${K}:171`, "Serhii Marchenko;Andrii Sybiha;Denys Shmyhal;Andrii Pyshnyi"),
    CHN: D("National People's Congress", 5, 2028, `*Communist Party of China:CPC:-45:${R}:2977`, "Lan Fo'an;Wang Yi;Dong Jun;Pan Gongsheng"),
    JPN: D("House of Representatives", 4, 2028, `*Liberal Democratic Party:LDP:30:${G}:196|Constitutional Democratic Party:CDP:-15:${B}:148|*Japan Innovation Party:JIP:25:${O}:35|Democratic Party for the People:DPP:5:${Y}:27|Komeito:KMT:5:${P}:24|Others:OTH:0:${K}:35`, "Satsuki Katayama;Toshimitsu Motegi;Shinjiro Koizumi;Kazuo Ueda"),
    KOR: D("National Assembly", 4, 2028, `*Democratic Party:DPK:-10:${B}:166|People Power Party:PPP:25:${R}:107|Others:OTH:0:${K}:27`, "Koo Yun-cheol;Cho Hyun;Ahn Gyu-back;Rhee Chang-yong"),
    IND: D("Lok Sabha", 5, 2029, `*Bharatiya Janata Party:BJP:35:${O}:240|Indian National Congress:INC:-15:${B}:99|Samajwadi Party:SP:-20:${R}:37|Trinamool Congress:TMC:-15:${G}:29|*Telugu Desam and Allies:NDA:15:${Y}:53|Others:OTH:0:${K}:85`, "Nirmala Sitharaman;S. Jaishankar;Rajnath Singh;Sanjay Malhotra"),
    BRA: D("Chamber of Deputies", 4, 2026, `Liberal Party:PL:45:${G}:99|*Workers' Party Federation:PT:-30:${R}:80|Union Brazil:UB:15:${B}:59|Others:OTH:0:${K}:275`, "Fernando Haddad;Mauro Vieira;Jose Mucio;Gabriel Galipolo"),
    CAN: D("House of Commons", 4, 2029, `*Liberal Party:LPC:-5:${R}:169|Conservative Party:CPC:20:${B}:144|Bloc Quebecois:BQ:-5:${T}:22|New Democratic Party:NDP:-30:${O}:7|Green Party:GPC:-20:${G}:1`, "Francois-Philippe Champagne;Anita Anand;David McGuinty;Tiff Macklem"),
    AUS: D("House of Representatives", 3, 2028, `*Australian Labor Party:ALP:-12:${R}:94|Liberal-National Coalition:LNP:18:${B}:43|Others:OTH:0:${K}:13`, "Jim Chalmers;Penny Wong;Richard Marles;Michele Bullock"),
    ISR: D("Knesset", 4, 2026, `*Likud:LIK:40:${B}:32|Yesh Atid:YA:0:${Y}:24|*Shas:SHAS:45:${K}:11|*Religious Zionism:RZP:70:${O}:14|National Unity:NU:10:${T}:8|Others:OTH:0:${G}:31`, "Bezalel Smotrich;Gideon Sa'ar;Israel Katz;Amir Yaron"),
    ARG: D("Chamber of Deputies", 4, 2027, `*La Libertad Avanza:LLA:50:${P}:107|Union for the Homeland:UxP:-25:${B}:96|Others:OTH:5:${K}:54`, "Luis Caputo;Pablo Quirno;Luis Petri;Santiago Bausili"),
    MEX: D("Chamber of Deputies", 3, 2027, `*Morena:MOR:-20:${DR}:253|*Labor and Green Allies:PT:-15:${G}:113|National Action Party:PAN:20:${B}:71|Institutional Revolutionary Party:PRI:5:${R}:37|Others:OTH:0:${K}:26`, "Edgar Amador Zamora;Juan Ramon de la Fuente;Ricardo Trevilla;Victoria Rodriguez Ceja"),
    TUR: D("Grand National Assembly", 5, 2028, `*Justice and Development Party:AKP:35:${O}:272|Republican People's Party:CHP:-10:${R}:138|*Nationalist Movement Party:MHP:60:${K}:47|Others:OTH:5:${T}:143`, "Mehmet Simsek;Hakan Fidan;Yasar Guler;Fatih Karahan"),
    SAU: { parties: [], cabinet: { economy: "Mohammed Al-Jadaan", foreign: "Faisal bin Farhan", defence: "Khalid bin Salman", centralBank: "Ayman Al-Sayari" } },
    IRN: { parties: [], cabinet: { foreign: "Abbas Araghchi", defence: "Aziz Nasirzadeh" } },
  },
};
