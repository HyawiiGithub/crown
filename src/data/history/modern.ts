import type { Bloc, GovernmentType } from "../../shared/types";
import { COUNTRY_BY_ISO3 } from "../countries";
import { REGIONS_1990 } from "./regions";
import { table, type HistoricalScenario, type PolitySeed } from "./types";

const GOV: Record<string, GovernmentType> = {
  AM: "absolute-monarchy", CM: "constitutional-monarchy", PR: "parliamentary-republic", SP: "semi-presidential-republic",
  PRES: "presidential-republic", OP: "one-party-state", MJ: "military-junta", FR: "federal-republic", TH: "theocracy",
};

const EU_1990 = "BEL DNK FRA DEU GRC IRL ITA LUX NLD PRT ESP GBR".split(" ");
const EU_2010 = [...EU_1990, ..."AUT FIN SWE CYP CZE EST HUN LVA LTU MLT POL SVK SVN BGR ROU".split(" ")];
const EU_2026 = [...EU_2010.filter((x) => x !== "GBR"), "HRV"];
const NATO_1990 = "USA CAN GBR FRA DEU ITA BEL NLD LUX DNK NOR ISL PRT ESP GRC TUR".split(" ");
const NATO_2010 = [...NATO_1990, ..."POL CZE HUN BGR EST LVA LTU ROU SVK SVN ALB HRV".split(" ")];
const NATO_2026 = [...NATO_2010, ..."MNE MKD FIN SWE".split(" ")];
const BRICS_2010 = "BRA RUS IND CHN".split(" ");
const BRICS_2026 = "BRA RUS IND CHN ZAF EGY ETH IRN ARE IDN".split(" ");
const WARSAW_1990 = "USS POL CSK HUN ROU BGR".split(" ");
const GCC = "SAU ARE QAT KWT BHR OMN".split(" ");
const ASEAN = "IDN MYS PHL SGP THA BRN VNM LAO MMR KHM".split(" ");
const MERCOSUR = "ARG BRA PRY URY".split(" ");

function blocFor(year: number, iso: string): Bloc {
  if (year === 1990) {
    if (WARSAW_1990.includes(iso)) return "warsaw-pact";
    if (EU_1990.includes(iso)) return "european-union";
    if (NATO_1990.includes(iso)) return "nato";
    if (GCC.includes(iso)) return "gulf-cooperation-council";
    return ["AUS", "NZL", "JPN", "KOR", "ISR", "THA", "PHL"].includes(iso) ? "allies" : "non-aligned";
  }
  const eu = year >= 2026 ? EU_2026 : EU_2010;
  const nato = year >= 2026 ? NATO_2026 : NATO_2010;
  const brics = year >= 2026 ? BRICS_2026 : BRICS_2010;
  if (eu.includes(iso)) return "european-union";
  if (brics.includes(iso)) return "brics";
  if (nato.includes(iso)) return "nato";
  if (GCC.includes(iso)) return "gulf-cooperation-council";
  if (ASEAN.includes(iso)) return "asean";
  if (MERCOSUR.includes(iso)) return "mercosur";
  if (["CAN", "MEX"].includes(iso)) return "usmca";
  if (["BLR", "KAZ", "KGZ", "TJK", "ARM"].includes(iso)) return "csto";
  return COUNTRY_BY_ISO3[iso]?.bloc ?? "non-aligned";
}

/** ISO|Head of state|Head of government|Ruling party|Gov override|Ideology override */
const HOG_TITLES: Record<string, string> = { DEU: "Chancellor", AUT: "Chancellor", IRL: "Taoiseach", SAU: "Crown Prince and Prime Minister", CHN: "Premier", USS: "Premier", PRK: "Premier", VNM: "Prime Minister", BGD: "Chief Adviser" };
const HOS_TITLES: Record<string, string> = { DEU: "Federal President", AUT: "Federal President", CHE: "President of the Confederation", CHN: "President", VNM: "General Secretary", LAO: "President", CUB: "President", SMR: "Captains Regent", AND: "Co-Princes", BIH: "Chair of the Presidency", YEM: "Chairman of the Presidential Council", PSE: "President" };
const STYLES = ["Governor-General", "Governor General", "King", "Queen", "Emperor", "Sultan", "Emir", "Prince", "Grand Duke", "Pope"];

/** "Governor-General Mary Simon" becomes the title and the person. */
function splitStyle(iso: string, name: string): { title?: string; name: string } {
  for (const style of STYLES) {
    if (name.startsWith(`${style} `)) return { title: style === "Governor General" ? "Governor-General" : style, name: name.slice(style.length + 1) };
  }
  return { title: HOS_TITLES[iso], name };
}

function modern(year: number, raw: string, extras: PolitySeed[] = []): PolitySeed[] {
  const rows = raw.trim().split("\n").filter((l) => l.trim()).map((line): PolitySeed => {
    const f = line.split("|").map((x) => x.trim());
    const base = COUNTRY_BY_ISO3[f[0]];
    const government = f[4] ? GOV[f[4]] : base?.government ?? "presidential-republic";
    const hos = splitStyle(f[0], f[1] ?? "");
    return {
      id: f[0],
      name: base?.name ?? f[0],
      government,
      ideology: f[5] ? Number(f[5]) : base?.ideology ?? 0,
      bloc: blocFor(year, f[0]),
      hos: hos.name,
      hosTitle: hos.title ?? (government === "one-party-state" ? "General Secretary" : undefined),
      hog: f[2] || undefined,
      hogTitle: HOG_TITLES[f[0]],
      lands: [f[0]],
      rulingParty: f[3] || undefined,
    };
  });
  return [...rows, ...extras];
}

// ===========================================================================
// 2 September 1990: Iraq has just invaded Kuwait, Germany reunites in a month.
// ===========================================================================

export const SCENARIO_1990: HistoricalScenario = { year: 1990, regions: REGIONS_1990, polities: modern(1990, `
USA|George H. W. Bush||Republican Party||15
GBR|Queen Elizabeth II|Margaret Thatcher|Conservative Party||35
FRA|Francois Mitterrand|Michel Rocard|Socialist Party||-25
DEU|Richard von Weizsacker|Helmut Kohl|Christian Democratic Union||15
ITA|Francesco Cossiga|Giulio Andreotti|Christian Democracy||10
ESP|King Juan Carlos I|Felipe Gonzalez|Spanish Socialist Workers' Party||-20
PRT|Mario Soares|Anibal Cavaco Silva|Social Democratic Party
NLD|Queen Beatrix|Ruud Lubbers|Christian Democratic Appeal
BEL|King Baudouin|Wilfried Martens|Christian People's Party
LUX|Grand Duke Jean|Jacques Santer|Christian Social People's Party
IRL|Patrick Hillery|Charles Haughey|Fianna Fail
DNK|Queen Margrethe II|Poul Schluter|Conservative People's Party
SWE|King Carl XVI Gustaf|Ingvar Carlsson|Swedish Social Democratic Party||-25
NOR|King Olav V|Jan P. Syse|Conservative Party
FIN|Mauno Koivisto|Harri Holkeri|National Coalition Party
ISL|Vigdis Finnbogadottir|Steingrimur Hermannsson|Progressive Party
AUT|Kurt Waldheim|Franz Vranitzky|Social Democratic Party
CHE|Arnold Koller||Federal Council
GRC|Konstantinos Karamanlis|Konstantinos Mitsotakis|New Democracy
TUR|Turgut Ozal|Yildirim Akbulut|Motherland Party|PR|25
CYP|George Vasiliou||
MLT|Censu Tabone|Eddie Fenech Adami|Nationalist Party
POL|Wojciech Jaruzelski|Tadeusz Mazowiecki|Solidarity|SP|5
HUN|Arpad Goncz|Jozsef Antall|Hungarian Democratic Forum|PR|10
ROU|Ion Iliescu|Petre Roman|National Salvation Front|SP|-15
BGR|Zhelyu Zhelev|Andrey Lukanov|Bulgarian Socialist Party|PR|-20
ALB|Ramiz Alia|Adil Carcani|Party of Labour of Albania|OP|-85
JPN|Emperor Akihito|Toshiki Kaifu|Liberal Democratic Party
CHN|Yang Shangkun|Li Peng|Communist Party of China|OP|-55
TWN|Lee Teng-hui|Hau Pei-tsun|Kuomintang|PRES|20
HKG|Governor David Wilson||
KOR|Roh Tae-woo||Democratic Liberal Party|PRES|25
PRK|Kim Il Sung|Yon Hyong-muk|Workers' Party of Korea|OP|-85
MNG|Punsalmaagiin Ochirbat|Dashiin Byambasuren|Mongolian People's Revolutionary Party|OP|-60
IND|Ramaswamy Venkataraman|V. P. Singh|Janata Dal|PR|-10
PAK|Ghulam Ishaq Khan|Ghulam Mustafa Jatoi|Caretaker Government|PR|15
BGD|Hussain Muhammad Ershad||Jatiya Party|MJ|25
LKA|Ranasinghe Premadasa|Dingiri Banda Wijetunga|United National Party
NPL|King Birendra|Krishna Prasad Bhattarai|Nepali Congress|CM|0
BTN|King Jigme Singye Wangchuck||
MDV|Maumoon Abdul Gayoom||
AFG|Mohammad Najibullah|Fazal Haq Khaliqyar|Homeland Party|OP|-60
IRN|Ali Khamenei|Akbar Hashemi Rafsanjani||TH|40
IRQ|Saddam Hussein|Sa'dun Hammadi|Arab Socialist Ba'ath Party|OP|-20
KWT|Emir Jaber Al-Ahmad Al-Sabah (in exile)|Saad Al-Salim Al-Sabah||CM|25
SAU|King Fahd||
ARE|Zayed bin Sultan Al Nahyan|Rashid bin Saeed Al Maktoum|
QAT|Emir Khalifa bin Hamad Al Thani||
BHR|Emir Isa bin Salman Al Khalifa|Khalifa bin Salman Al Khalifa|
OMN|Sultan Qaboos bin Said||
YEM|Ali Abdullah Saleh|Haidar Abu Bakr al-Attas|General People's Congress
JOR|King Hussein|Mudar Badran|
LBN|Elias Hrawi|Selim Hoss|
SYR|Hafez al-Assad|Mahmoud Zuabi|Arab Socialist Ba'ath Party|OP|-25
ISR|Chaim Herzog|Yitzhak Shamir|Likud||30
EGY|Hosni Mubarak|Atef Sedki|National Democratic Party||10
LBY|Muammar Gaddafi|Abuzed Omar Dorda||OP|-30
TUN|Zine El Abidine Ben Ali|Hamed Karoui|Democratic Constitutional Rally
DZA|Chadli Bendjedid|Mouloud Hamrouche|National Liberation Front||-30
MAR|King Hassan II|Azzeddine Laraki|
MRT|Maaouya Ould Sid'Ahmed Taya||
MLI|Moussa Traore|Mamadou Dembele|Democratic Union of Malian People|OP|-10
NER|Ali Saibou|Aliou Mahamidou|National Movement for the Development Society|MJ|-5
TCD|Hissene Habre||National Union for Independence and Revolution|MJ|5
SDN|Omar al-Bashir||National Salvation Revolution|MJ|25
ETH|Mengistu Haile Mariam|Hailu Yimenu|Workers' Party of Ethiopia|OP|-70
DJI|Hassan Gouled Aptidon|Barkat Gourad Hamadou|People's Rally for Progress
SOM|Siad Barre|Muhammad Hawadle Madar|Somali Revolutionary Socialist Party|OP|-20
KEN|Daniel arap Moi||Kenya African National Union
UGA|Yoweri Museveni|Samson Kisekka|National Resistance Movement
TZA|Ali Hassan Mwinyi|Joseph Warioba|Chama Cha Mapinduzi|OP|-30
RWA|Juvenal Habyarimana||National Revolutionary Movement|OP|5
BDI|Pierre Buyoya|Adrien Sibomana|Union for National Progress|MJ|5
COD|Mobutu Sese Seko|Lunda Bululu|Popular Movement of the Revolution|OP|20
COG|Denis Sassou Nguesso|Pierre Moussa|Congolese Party of Labour|OP|-55
GAB|Omar Bongo|Casimir Oye-Mba|Gabonese Democratic Party
CMR|Paul Biya|Sadou Hayatou|Cameroon People's Democratic Movement
CAF|Andre Kolingba||Central African Democratic Rally|MJ|5
GNQ|Teodoro Obiang Nguema Mbasogo|Cristino Seriche Bioko|
STP|Manuel Pinto da Costa|Celestino Rocha da Costa|MLSTP|OP|-50
NGA|Ibrahim Babangida||Armed Forces Ruling Council|MJ|10
BEN|Mathieu Kerekou|Nicephore Soglo|
TGO|Gnassingbe Eyadema||Rally of the Togolese People|OP|15
GHA|Jerry Rawlings||Provisional National Defence Council|MJ|-20
CIV|Felix Houphouet-Boigny|Alassane Ouattara|Democratic Party of Ivory Coast
LBR|Amos Sawyer||Interim Government
SLE|Joseph Saidu Momoh||All People's Congress|OP|5
GIN|Lansana Conte||Military Committee for National Recovery|MJ|5
GNB|Joao Bernardo Vieira||PAIGC|OP|-40
SEN|Abdou Diouf|Habib Thiam|Socialist Party
GMB|Dawda Jawara||People's Progressive Party
CPV|Aristides Pereira|Pedro Pires|PAICV|OP|-40
BFA|Blaise Compaore||Popular Front|MJ|-5
AGO|Jose Eduardo dos Santos||MPLA|OP|-60
ZMB|Kenneth Kaunda|Malimba Masheke|United National Independence Party|OP|-20
ZWE|Robert Mugabe||ZANU-PF||-30
MWI|Hastings Banda||Malawi Congress Party|OP|20
MOZ|Joaquim Chissano|Mario da Graca Machungo|FRELIMO|OP|-55
MDG|Didier Ratsiraka|Victor Ramahatra|AREMA||-30
COM|Said Mohamed Djohar||
MUS|Veerasamy Ringadoo|Anerood Jugnauth|Militant Socialist Movement
SYC|France-Albert Rene||Seychelles People's Progressive Front|OP|-30
BWA|Quett Masire||Botswana Democratic Party
NAM|Sam Nujoma|Hage Geingob|SWAPO
ZAF|F. W. de Klerk||National Party||40
LSO|King Letsie III|Justin Lekhanya|
SWZ|King Mswati III|Obed Dlamini|
MMR|Saw Maung||State Law and Order Restoration Council|MJ|15
THA|King Bhumibol Adulyadej|Chatichai Choonhavan|Chart Thai Party
LAO|Kaysone Phomvihane|Kaysone Phomvihane|Lao People's Revolutionary Party
KHM|Hun Sen|Hun Sen|Kampuchean People's Revolutionary Party|OP|-55
VNM|Vo Chi Cong|Do Muoi|Communist Party of Vietnam|OP|-65
MYS|Sultan Azlan Shah|Mahathir Mohamad|United Malays National Organisation
SGP|Wee Kim Wee|Lee Kuan Yew|People's Action Party
BRN|Sultan Hassanal Bolkiah||
IDN|Suharto||Golkar|PRES|30
PHL|Corazon Aquino||Laban
AUS|Governor-General Bill Hayden|Bob Hawke|Australian Labor Party||-15
NZL|Governor-General Paul Reeves|Mike Moore|New Zealand Labour Party||-15
PNG|Governor-General Serei Eri|Rabbie Namaliu|Pangu Party
FJI|Ratu Penaia Ganilau|Kamisese Mara|
SLB|Governor-General George Lepping|Solomon Mamaloni|
VUT|Fred Timakata|Walter Lini|Vanua'aku Pati
WSM|Malietoa Tanumafili II|Tofilau Eti Alesana|
TON|King Taufa'ahau Tupou IV|Baron Vaea|
KIR|Ieremia Tabai||
FSM|John Haglelgam||
MHL|Amata Kabua||
NRU|Bernard Dowiyogo||
PLW|Ngiratkel Etpison||
CAN|Governor General Ray Hnatyshyn|Brian Mulroney|Progressive Conservative Party||15
MEX|Carlos Salinas de Gortari||Institutional Revolutionary Party||15
GTM|Vinicio Cerezo||Christian Democracy
BLZ|Governor-General Minita Gordon|George Cadle Price|People's United Party
SLV|Alfredo Cristiani||ARENA||40
HND|Rafael Leonardo Callejas||National Party
NIC|Violeta Chamorro||National Opposition Union||15
CRI|Rafael Angel Calderon Fournier||Social Christian Unity Party
PAN|Guillermo Endara||
CUB|Fidel Castro|Fidel Castro|Communist Party of Cuba
DOM|Joaquin Balaguer||Social Christian Reformist Party
HTI|Ertha Pascal-Trouillot||
JAM|Governor-General Howard Cooke|Michael Manley|People's National Party
TTO|Noor Hassanali|A. N. R. Robinson|National Alliance for Reconstruction
BHS|Governor-General Henry Milton Taylor|Lynden Pindling|Progressive Liberal Party
BRB|Governor-General Hugh Springer|Erskine Sandiford|Democratic Labour Party
ATG|Governor-General Wilfred Jacobs|Vere Bird|Antigua Labour Party
DMA|Clarence Seignoret|Eugenia Charles|Dominica Freedom Party
GRD|Governor-General Paul Scoon|Nicholas Brathwaite|National Democratic Congress
KNA|Governor-General Clement Arrindell|Kennedy Simmonds|People's Action Movement
LCA|Governor-General Stanislaus Anthony James|John Compton|United Workers Party
VCT|Governor-General David Jack|James Fitz-Allen Mitchell|New Democratic Party
COL|Cesar Gaviria||Colombian Liberal Party||5
VEN|Carlos Andres Perez||Democratic Action||-5
GUY|Desmond Hoyte|Hamilton Green|People's National Congress
SUR|Johan Kraag|Jules Wijdenbosch|
ECU|Rodrigo Borja Cevallos||Democratic Left
PER|Alberto Fujimori||Cambio 90||25
BOL|Jaime Paz Zamora||Revolutionary Left Movement
CHL|Patricio Aylwin||Christian Democratic Party
ARG|Carlos Menem||Justicialist Party
URY|Luis Alberto Lacalle||National Party
PRY|Andres Rodriguez||Colorado Party
BRA|Fernando Collor de Mello||National Reconstruction Party||15
VAT|Pope John Paul II||
AND|Co-Princes|Oscar Ribas Reig|
LIE|Prince Hans-Adam II|Hans Brunhart|
MCO|Prince Rainier III|Jean Ausseil|
SMR|Captains Regent||
`, [
  ...table(`
USS|Soviet Union|PRES|-50|warsaw-pact|||President:Mikhail Gorbachev|Premier:Nikolai Ryzhkov|RUS UKR BLR MDA EST LVA LTU KAZ UZB TKM KGZ TJK ARM AZE GEO|||Communist Party of the Soviet Union
YUG|Yugoslavia|OP|-35|non-aligned|||President of the Presidency:Borisav Jovic|Prime Minister:Ante Markovic|SRB HRV SVN BIH MNE MKD XKX||League of Communists of Yugoslavia
CSK|Czechoslovakia|PR|5|warsaw-pact|||President:Vaclav Havel|Prime Minister:Marian Calfa|CZE SVK||Civic Forum
DDR|East Germany|PR|-5|warsaw-pact|16.1|152|President of the Volkskammer:Sabine Bergmann-Pohl|Prime Minister:Lothar de Maiziere|-||Christian Democratic Union
GBH|British Hong Kong|DEP|5|allies|5.7|77|Governor:David Wilson|-|HKG|GBR:colony
PSO|Occupied Palestinian Territories|OCC|0|none|2|2|Occupying Power:Yitzhak Shamir|-|PSE|ISR:occupation
`),
]).filter((p) => p.id !== "HKG") };

// Iraq occupied Kuwait on 2 August 1990.
for (const p of SCENARIO_1990.polities) {
  if (p.id === "KWT") {
    p.overlord = "IRQ";
    p.status = "occupation";
  }
}

// ===========================================================================
// 1 January 2010: after the crash, Greek debt is about to detonate.
// ===========================================================================

export const SCENARIO_2010: HistoricalScenario = { year: 2010, regions: [], polities: modern(2010, `
USA|Barack Obama||Democratic Party||-10
CAN|Governor General Michaelle Jean|Stephen Harper|Conservative Party||15
MEX|Felipe Calderon||National Action Party||20
GBR|Queen Elizabeth II|Gordon Brown|Labour Party||-12
IRL|Mary McAleese|Brian Cowen|Fianna Fail
FRA|Nicolas Sarkozy|Francois Fillon|Union for a Popular Movement||18
DEU|Horst Kohler|Angela Merkel|Christian Democratic Union||12
ITA|Giorgio Napolitano|Silvio Berlusconi|The People of Freedom||25
ESP|King Juan Carlos I|Jose Luis Rodriguez Zapatero|Spanish Socialist Workers' Party||-15
PRT|Anibal Cavaco Silva|Jose Socrates|Socialist Party||-10
NLD|Queen Beatrix|Jan Peter Balkenende|Christian Democratic Appeal
BEL|King Albert II|Yves Leterme|Christian Democratic and Flemish
LUX|Grand Duke Henri|Jean-Claude Juncker|Christian Social People's Party
CHE|Doris Leuthard||Federal Council
AUT|Heinz Fischer|Werner Faymann|Social Democratic Party
DNK|Queen Margrethe II|Lars Lokke Rasmussen|Venstre
SWE|King Carl XVI Gustaf|Fredrik Reinfeldt|Moderate Party
NOR|King Harald V|Jens Stoltenberg|Labour Party
FIN|Tarja Halonen|Matti Vanhanen|Centre Party
ISL|Olafur Ragnar Grimsson|Johanna Sigurdardottir|Social Democratic Alliance
POL|Lech Kaczynski|Donald Tusk|Civic Platform
CZE|Vaclav Klaus|Jan Fischer|
SVK|Ivan Gasparovic|Robert Fico|Direction - Social Democracy
HUN|Laszlo Solyom|Gordon Bajnai|Hungarian Socialist Party
ROU|Traian Basescu|Emil Boc|Democratic Liberal Party
BGR|Georgi Parvanov|Boyko Borisov|GERB
GRC|Karolos Papoulias|George Papandreou|PASOK||-10
HRV|Stjepan Mesic|Jadranka Kosor|Croatian Democratic Union
SVN|Danilo Turk|Borut Pahor|Social Democrats
SRB|Boris Tadic|Mirko Cvetkovic|Democratic Party
BIH|Zeljko Komsic|Nikola Spiric|
MNE|Filip Vujanovic|Milo Dukanovic|Democratic Party of Socialists
MKD|Gjorge Ivanov|Nikola Gruevski|VMRO-DPMNE
ALB|Bamir Topi|Sali Berisha|Democratic Party
EST|Toomas Hendrik Ilves|Andrus Ansip|Reform Party
LVA|Valdis Zatlers|Valdis Dombrovskis|New Era Party
LTU|Dalia Grybauskaite|Andrius Kubilius|Homeland Union
BLR|Alexander Lukashenko|Sergei Sidorsky|
UKR|Viktor Yushchenko|Yulia Tymoshenko|Bloc Yulia Tymoshenko
MDA|Mihai Ghimpu|Vlad Filat|Alliance for European Integration
RUS|Dmitry Medvedev|Vladimir Putin|United Russia
TUR|Abdullah Gul|Recep Tayyip Erdogan|Justice and Development Party|PR|20
GEO|Mikheil Saakashvili|Nika Gilauri|United National Movement|SP
ARM|Serzh Sargsyan|Tigran Sargsyan|Republican Party
AZE|Ilham Aliyev|Artur Rasizade|New Azerbaijan Party
KAZ|Nursultan Nazarbayev|Karim Massimov|Nur Otan
UZB|Islam Karimov|Shavkat Mirziyoyev|
KGZ|Kurmanbek Bakiyev|Daniar Usenov|
TJK|Emomali Rahmon|Oqil Oqilov|
TKM|Gurbanguly Berdimuhamedow||
CHN|Hu Jintao|Wen Jiabao|Communist Party of China||-35
JPN|Emperor Akihito|Yukio Hatoyama|Democratic Party of Japan||-5
KOR|Lee Myung-bak|Chung Un-chan|Grand National Party
PRK|Kim Jong Il|Kim Yong-il|Workers' Party of Korea
TWN|Ma Ying-jeou|Wu Den-yih|Kuomintang
MNG|Tsakhiagiin Elbegdorj|Sükhbaatar Batbold|
IND|Pratibha Patil|Manmohan Singh|Indian National Congress||-15
PAK|Asif Ali Zardari|Yousaf Raza Gilani|Pakistan Peoples Party||-10
BGD|Zillur Rahman|Sheikh Hasina|Awami League
NPL|Ram Baran Yadav|Madhav Kumar Nepal|CPN (UML)
BTN|King Jigme Khesar Namgyel Wangchuck|Jigme Thinley|Druk Phuensum Tshogpa
LKA|Mahinda Rajapaksa|Ratnasiri Wickremanayake|Sri Lanka Freedom Party
MDV|Mohamed Nasheed||Maldivian Democratic Party
AFG|Hamid Karzai||Independent|PRES|10
IRN|Ali Khamenei|Mahmoud Ahmadinejad|
IRQ|Jalal Talabani|Nouri al-Maliki|State of Law Coalition
SYR|Bashar al-Assad|Muhammad Naji al-Otari|Arab Socialist Ba'ath Party|OP
LBN|Michel Suleiman|Saad Hariri|March 14 Alliance
ISR|Shimon Peres|Benjamin Netanyahu|Likud
PSE|Mahmoud Abbas|Salam Fayyad|Fatah
JOR|King Abdullah II|Samir Rifai|
SAU|King Abdullah||
ARE|Khalifa bin Zayed Al Nahyan|Mohammed bin Rashid Al Maktoum|
QAT|Emir Hamad bin Khalifa Al Thani|Hamad bin Jassim Al Thani|
KWT|Emir Sabah Al-Ahmad Al-Jaber Al-Sabah|Nasser Al-Sabah|
BHR|King Hamad bin Isa Al Khalifa|Khalifa bin Salman Al Khalifa|
OMN|Sultan Qaboos bin Said||
YEM|Ali Abdullah Saleh|Ali Muhammad Mujawar|General People's Congress
EGY|Hosni Mubarak|Ahmed Nazif|National Democratic Party
LBY|Muammar Gaddafi|Baghdadi Mahmudi||OP|-20
TUN|Zine El Abidine Ben Ali|Mohamed Ghannouchi|Democratic Constitutional Rally
DZA|Abdelaziz Bouteflika|Ahmed Ouyahia|National Liberation Front
MAR|King Mohammed VI|Abbas El Fassi|Istiqlal Party
MRT|Mohamed Ould Abdel Aziz|Moulaye Ould Mohamed Laghdaf|Union for the Republic
MLI|Amadou Toumani Toure|Modibo Sidibe||PRES
NER|Mamadou Tandja|Ali Badjo Gamatie||PRES
BFA|Blaise Compaore|Tertius Zongo|Congress for Democracy and Progress|PRES
TCD|Idriss Deby|Youssouf Saleh Abbas|Patriotic Salvation Movement
SDN|Omar al-Bashir||National Congress Party
ERI|Isaias Afwerki||People's Front for Democracy and Justice
ETH|Girma Wolde-Giorgis|Meles Zenawi|EPRDF|PR
DJI|Ismail Omar Guelleh|Dileita Mohamed Dileita|People's Rally for Progress
SOM|Sharif Sheikh Ahmed|Omar Sharmarke|Transitional Federal Government
KEN|Mwai Kibaki|Raila Odinga|Party of National Unity
UGA|Yoweri Museveni|Apolo Nsibambi|National Resistance Movement
TZA|Jakaya Kikwete|Mizengo Pinda|Chama Cha Mapinduzi
RWA|Paul Kagame|Bernard Makuza|Rwandan Patriotic Front
BDI|Pierre Nkurunziza||CNDD-FDD
COD|Joseph Kabila|Adolphe Muzito|People's Party for Reconstruction and Democracy
COG|Denis Sassou Nguesso||Congolese Party of Labour
GAB|Ali Bongo Ondimba|Paul Biyoghe Mba|Gabonese Democratic Party
CMR|Paul Biya|Philemon Yang|Cameroon People's Democratic Movement
CAF|Francois Bozize|Faustin-Archange Touadera|National Convergence Kwa Na Kwa
GNQ|Teodoro Obiang Nguema Mbasogo|Ignacio Milam Tang|Democratic Party of Equatorial Guinea
STP|Fradique de Menezes|Rafael Branco|
NGA|Umaru Yar'Adua||People's Democratic Party
BEN|Thomas Boni Yayi||
TGO|Faure Gnassingbe|Gilbert Houngbo|Union for the Republic
GHA|John Atta Mills||National Democratic Congress
CIV|Laurent Gbagbo|Guillaume Soro|Ivorian Popular Front
LBR|Ellen Johnson Sirleaf||Unity Party
SLE|Ernest Bai Koroma||All People's Congress
GIN|Sekouba Konate||National Council for Democracy and Development|MJ
GNB|Malam Bacai Sanha|Carlos Gomes Junior|PAIGC
SEN|Abdoulaye Wade|Souleymane Ndene Ndiaye|Senegalese Democratic Party
GMB|Yahya Jammeh||APRC
CPV|Pedro Pires|Jose Maria Neves|PAICV
AGO|Jose Eduardo dos Santos|Paulo Kassoma|MPLA
ZMB|Rupiah Banda||Movement for Multi-Party Democracy
ZWE|Robert Mugabe|Morgan Tsvangirai|ZANU-PF
MWI|Bingu wa Mutharika||Democratic Progressive Party
MOZ|Armando Guebuza|Aires Ali|FRELIMO
MDG|Andry Rajoelina|Camille Vital||
COM|Ahmed Abdallah Mohamed Sambi||
MUS|Anerood Jugnauth|Navin Ramgoolam|Labour Party
SYC|James Michel||
BWA|Ian Khama||Botswana Democratic Party
NAM|Hifikepunye Pohamba|Nahas Angula|SWAPO
ZAF|Jacob Zuma||African National Congress
LSO|King Letsie III|Pakalitha Mosisili|
SWZ|King Mswati III|Barnabas Dlamini|
MMR|Than Shwe|Thein Sein|State Peace and Development Council
THA|King Bhumibol Adulyadej|Abhisit Vejjajiva|Democrat Party
LAO|Choummaly Sayasone|Bouasone Bouphavanh|Lao People's Revolutionary Party
KHM|King Norodom Sihamoni|Hun Sen|Cambodian People's Party
VNM|Nguyen Minh Triet|Nguyen Tan Dung|Communist Party of Vietnam
MYS|Sultan Mizan Zainal Abidin|Najib Razak|United Malays National Organisation
SGP|S. R. Nathan|Lee Hsien Loong|People's Action Party
BRN|Sultan Hassanal Bolkiah||
IDN|Susilo Bambang Yudhoyono||Democratic Party
PHL|Gloria Macapagal Arroyo||Lakas-Kampi-CMD
TLS|Jose Ramos-Horta|Xanana Gusmao|
AUS|Governor-General Quentin Bryce|Kevin Rudd|Australian Labor Party
NZL|Governor-General Anand Satyanand|John Key|National Party
PNG|Governor-General Paulias Matane|Michael Somare|National Alliance Party
FJI|Epeli Nailatikau|Frank Bainimarama||MJ
SLB|Governor-General Frank Kabui|Derek Sikua|
VUT|Iolu Abil|Edward Natapei|
WSM|Tui Atua Tupua Tamasese Efi|Tuila'epa Sa'ilele Malielegaoi|
TON|King George Tupou V|Feleti Sevele|
KIR|Anote Tong||
FSM|Manny Mori||
MHL|Jurelang Zedkaia||
NRU|Marcus Stephen||
PLW|Johnson Toribiong||
GTM|Alvaro Colom||National Unity of Hope
BLZ|Governor-General Colville Young|Dean Barrow|United Democratic Party
SLV|Mauricio Funes||FMLN
HND|Roberto Micheletti||
NIC|Daniel Ortega||Sandinista National Liberation Front
CRI|Oscar Arias||National Liberation Party
PAN|Ricardo Martinelli||Democratic Change
CUB|Raul Castro|Raul Castro|Communist Party of Cuba
DOM|Leonel Fernandez||Dominican Liberation Party
HTI|Rene Preval|Jean-Max Bellerive|
JAM|Governor-General Patrick Allen|Bruce Golding|Jamaica Labour Party
TTO|George Maxwell Richards|Patrick Manning|People's National Movement
BHS|Governor-General Arthur Foulkes|Hubert Ingraham|Free National Movement
BRB|Governor-General Clifford Husbands|David Thompson|Democratic Labour Party
ATG|Governor-General Louise Lake-Tack|Baldwin Spencer|United Progressive Party
DMA|Nicholas Liverpool|Roosevelt Skerrit|Dominica Labour Party
GRD|Governor-General Carlyle Glean|Tillman Thomas|National Democratic Congress
KNA|Governor-General Cuthbert Sebastian|Denzil Douglas|Labour Party
LCA|Governor-General Pearlette Louisy|Stephenson King|United Workers Party
VCT|Governor-General Frederick Ballantyne|Ralph Gonsalves|Unity Labour Party
COL|Alvaro Uribe||Social Party of National Unity||30
VEN|Hugo Chavez||United Socialist Party of Venezuela
GUY|Bharrat Jagdeo|Sam Hinds|People's Progressive Party
SUR|Ronald Venetiaan||
ECU|Rafael Correa||PAIS Alliance||-30
PER|Alan Garcia|Javier Velasquez|Peruvian Aprista Party
BOL|Evo Morales||Movement for Socialism||-45
CHL|Michelle Bachelet||Socialist Party||-15
ARG|Cristina Fernandez de Kirchner||Front for Victory||-20
URY|Tabare Vazquez||Broad Front
PRY|Fernando Lugo||Patriotic Alliance for Change||-15
BRA|Luiz Inacio Lula da Silva||Workers' Party
CYP|Dimitris Christofias||AKEL||-30
MLT|George Abela|Lawrence Gonzi|Nationalist Party
VAT|Pope Benedict XVI||
AND|Co-Princes|Jaume Bartumeu|
LIE|Prince Hans-Adam II|Klaus Tschutscher|
MCO|Prince Albert II|Michel Roger|
SMR|Captains Regent||
XKX|Fatmir Sejdiu|Hashim Thaci|Democratic Party of Kosovo|PR
HKG|Chief Executive Donald Tsang||
PRI|Governor Luis Fortuno||
`).filter((p) => p.id !== "HKG" && p.id !== "PRI") };

// ===========================================================================
// 11 March 2020: the WHO has just declared a pandemic.
// ===========================================================================

export const SCENARIO_2020: HistoricalScenario = { year: 2020, regions: [], polities: modern(2020, `
USA|Donald Trump||Republican Party||25
CAN|Governor General Julie Payette|Justin Trudeau|Liberal Party||-10
MEX|Andres Manuel Lopez Obrador||Morena||-20
GBR|Queen Elizabeth II|Boris Johnson|Conservative Party||20
IRL|Michael D. Higgins|Leo Varadkar|Fine Gael
FRA|Emmanuel Macron|Edouard Philippe|La Republique En Marche||5
DEU|Frank-Walter Steinmeier|Angela Merkel|Christian Democratic Union
ITA|Sergio Mattarella|Giuseppe Conte|Five Star Movement||0
ESP|King Felipe VI|Pedro Sanchez|Spanish Socialist Workers' Party||-18
PRT|Marcelo Rebelo de Sousa|Antonio Costa|Socialist Party||-15
NLD|King Willem-Alexander|Mark Rutte|People's Party for Freedom and Democracy
BEL|King Philippe|Sophie Wilmes|Reformist Movement
LUX|Grand Duke Henri|Xavier Bettel|Democratic Party
CHE|Simonetta Sommaruga||Federal Council
AUT|Alexander Van der Bellen|Sebastian Kurz|Austrian People's Party
DNK|Queen Margrethe II|Mette Frederiksen|Social Democrats
SWE|King Carl XVI Gustaf|Stefan Lofven|Swedish Social Democratic Party
NOR|King Harald V|Erna Solberg|Conservative Party
FIN|Sauli Niinisto|Sanna Marin|Social Democratic Party
ISL|Gudni Johannesson|Katrin Jakobsdottir|Left-Green Movement
POL|Andrzej Duda|Mateusz Morawiecki|Law and Justice
CZE|Milos Zeman|Andrej Babis|ANO 2011
SVK|Zuzana Caputova|Peter Pellegrini|Direction - Social Democracy
HUN|Janos Ader|Viktor Orban|Fidesz
ROU|Klaus Iohannis|Ludovic Orban|National Liberal Party
BGR|Rumen Radev|Boyko Borisov|GERB
GRC|Katerina Sakellaropoulou|Kyriakos Mitsotakis|New Democracy
HRV|Zoran Milanovic|Andrej Plenkovic|Croatian Democratic Union
SVN|Borut Pahor|Marjan Sarec|List of Marjan Sarec
SRB|Aleksandar Vucic|Ana Brnabic|Serbian Progressive Party
BIH|Sefik Dzaferovic|Zoran Tegeltija|
MNE|Milo Dukanovic|Dusko Markovic|Democratic Party of Socialists
MKD|Stevo Pendarovski|Oliver Spasovski|
ALB|Ilir Meta|Edi Rama|Socialist Party
XKX|Hashim Thaci|Albin Kurti|Vetevendosje
EST|Kersti Kaljulaid|Juri Ratas|Centre Party
LVA|Egils Levits|Arturs Krisjanis Karins|New Unity
LTU|Gitanas Nauseda|Saulius Skvernelis|Lithuanian Farmers and Greens Union
BLR|Alexander Lukashenko|Sergei Rumas|
UKR|Volodymyr Zelenskyy|Denys Shmyhal|Servant of the People
MDA|Igor Dodon|Ion Chicu|Party of Socialists
RUS|Vladimir Putin|Mikhail Mishustin|United Russia
TUR|Recep Tayyip Erdogan||Justice and Development Party
GEO|Salome Zourabichvili|Giorgi Gakharia|Georgian Dream
ARM|Armen Sarkissian|Nikol Pashinyan|Civil Contract
AZE|Ilham Aliyev|Ali Asadov|New Azerbaijan Party
KAZ|Kassym-Jomart Tokayev|Askar Mamin|Nur Otan
UZB|Shavkat Mirziyoyev|Abdulla Aripov|
KGZ|Sooronbay Jeenbekov|Mukhammedkaly Abylgaziev|
TJK|Emomali Rahmon|Kokhir Rasulzoda|
TKM|Gurbanguly Berdimuhamedow||
CHN|Xi Jinping|Li Keqiang|Communist Party of China||-45
JPN|Emperor Naruhito|Shinzo Abe|Liberal Democratic Party||25
KOR|Moon Jae-in|Chung Sye-kyun|Democratic Party||-10
PRK|Kim Jong Un|Kim Jae-ryong|Workers' Party of Korea
TWN|Tsai Ing-wen|Su Tseng-chang|Democratic Progressive Party
MNG|Khaltmaagiin Battulga|Ukhnaagiin Khurelsukh|Mongolian People's Party
IND|Ram Nath Kovind|Narendra Modi|Bharatiya Janata Party
PAK|Arif Alvi|Imran Khan|Pakistan Tehreek-e-Insaf
BGD|Abdul Hamid|Sheikh Hasina|Awami League
NPL|Bidhya Devi Bhandari|KP Sharma Oli|Nepal Communist Party
BTN|King Jigme Khesar Namgyel Wangchuck|Lotay Tshering|
LKA|Gotabaya Rajapaksa|Mahinda Rajapaksa|Sri Lanka Podujana Peramuna
MDV|Ibrahim Mohamed Solih||Maldivian Democratic Party
AFG|Ashraf Ghani||Independent|PRES|10
IRN|Ali Khamenei|Hassan Rouhani|
IRQ|Barham Salih|Adil Abdul-Mahdi|
SYR|Bashar al-Assad|Imad Khamis|Arab Socialist Ba'ath Party|OP
LBN|Michel Aoun|Hassan Diab|
ISR|Reuven Rivlin|Benjamin Netanyahu|Likud
PSE|Mahmoud Abbas|Mohammad Shtayyeh|Fatah
JOR|King Abdullah II|Omar Razzaz|
SAU|King Salman||
ARE|Khalifa bin Zayed Al Nahyan|Mohammed bin Rashid Al Maktoum|
QAT|Emir Tamim bin Hamad Al Thani|Khalid bin Khalifa Al Thani|
KWT|Emir Sabah Al-Ahmad Al-Jaber Al-Sabah|Sabah Al-Khalid Al-Sabah|
BHR|King Hamad bin Isa Al Khalifa|Khalifa bin Salman Al Khalifa|
OMN|Sultan Haitham bin Tariq||
YEM|Abdrabbuh Mansur Hadi|Maeen Abdulmalik Saeed|
EGY|Abdel Fattah el-Sisi|Mostafa Madbouly|
LBY|Fayez al-Sarraj|Fayez al-Sarraj|Government of National Accord
TUN|Kais Saied|Elyes Fakhfakh|
DZA|Abdelmadjid Tebboune|Abdelaziz Djerad|
MAR|King Mohammed VI|Saadeddine Othmani|Justice and Development Party
MRT|Mohamed Ould Ghazouani|Ismail Ould Cheikh Sidiya|Union for the Republic
MLI|Ibrahim Boubacar Keita|Boubou Cisse|Rally for Mali|PRES
NER|Mahamadou Issoufou|Brigi Rafini|PNDS-Tarayya|PRES
BFA|Roch Marc Christian Kabore|Christophe Dabire|People's Movement for Progress|PRES
TCD|Idriss Deby||Patriotic Salvation Movement
SDN|Abdel Fattah al-Burhan|Abdalla Hamdok|Sovereignty Council
SSD|Salva Kiir||SPLM
ERI|Isaias Afwerki||People's Front for Democracy and Justice
ETH|Sahle-Work Zewde|Abiy Ahmed|Prosperity Party|PR
DJI|Ismail Omar Guelleh|Abdoulkader Kamil Mohamed|People's Rally for Progress
SOM|Mohamed Abdullahi Mohamed|Hassan Ali Khayre|
KEN|Uhuru Kenyatta||Jubilee Party
UGA|Yoweri Museveni|Ruhakana Rugunda|National Resistance Movement
TZA|John Magufuli|Kassim Majaliwa|Chama Cha Mapinduzi
RWA|Paul Kagame|Edouard Ngirente|Rwandan Patriotic Front
BDI|Pierre Nkurunziza||CNDD-FDD
COD|Felix Tshisekedi|Sylvestre Ilunga|
COG|Denis Sassou Nguesso|Clement Mouamba|Congolese Party of Labour
GAB|Ali Bongo Ondimba|Julien Nkoghe Bekale|Gabonese Democratic Party
CMR|Paul Biya|Joseph Ngute|Cameroon People's Democratic Movement
CAF|Faustin-Archange Touadera|Firmin Ngrebada|
GNQ|Teodoro Obiang Nguema Mbasogo|Francisco Pascual Obama Asue|Democratic Party of Equatorial Guinea
STP|Evaristo Carvalho|Jorge Bom Jesus|
NGA|Muhammadu Buhari||All Progressives Congress
BEN|Patrice Talon||
TGO|Faure Gnassingbe|Komi Selom Klassou|Union for the Republic
GHA|Nana Akufo-Addo||New Patriotic Party
CIV|Alassane Ouattara|Amadou Gon Coulibaly|Rally of Houphouetists
LBR|George Weah||Coalition for Democratic Change
SLE|Julius Maada Bio||Sierra Leone People's Party
GIN|Alpha Conde|Ibrahima Kassory Fofana|Rally of the Guinean People|PRES
GNB|Umaro Sissoco Embalo|Nuno Gomes Nabiam|
SEN|Macky Sall||Alliance for the Republic
GMB|Adama Barrow||
CPV|Jorge Carlos Fonseca|Ulisses Correia e Silva|
AGO|Joao Lourenco||MPLA
ZMB|Edgar Lungu||Patriotic Front
ZWE|Emmerson Mnangagwa||ZANU-PF
MWI|Peter Mutharika||Democratic Progressive Party
MOZ|Filipe Nyusi|Carlos Agostinho do Rosario|FRELIMO
MDG|Andry Rajoelina|Christian Ntsay|
COM|Azali Assoumani||
MUS|Prithvirajsing Roopun|Pravind Jugnauth|Militant Socialist Movement
SYC|Danny Faure||
BWA|Mokgweetsi Masisi||Botswana Democratic Party
NAM|Hage Geingob|Saara Kuugongelwa|SWAPO
ZAF|Cyril Ramaphosa||African National Congress
LSO|King Letsie III|Tom Thabane|
SWZ|King Mswati III|Ambrose Dlamini|
MMR|Win Myint|Aung San Suu Kyi|National League for Democracy|PR|0
THA|King Vajiralongkorn|Prayut Chan-o-cha|Palang Pracharath
LAO|Bounnhang Vorachith|Thongloun Sisoulith|Lao People's Revolutionary Party
KHM|King Norodom Sihamoni|Hun Sen|Cambodian People's Party
VNM|Nguyen Phu Trong|Nguyen Xuan Phuc|Communist Party of Vietnam
MYS|Sultan Abdullah|Muhyiddin Yassin|Perikatan Nasional
SGP|Halimah Yacob|Lee Hsien Loong|People's Action Party
BRN|Sultan Hassanal Bolkiah||
IDN|Joko Widodo||PDI-P
PHL|Rodrigo Duterte||PDP-Laban
TLS|Francisco Guterres|Taur Matan Ruak|
AUS|Governor-General David Hurley|Scott Morrison|Liberal Party||18
NZL|Governor-General Patsy Reddy|Jacinda Ardern|New Zealand Labour Party||-12
PNG|Governor-General Bob Dadae|James Marape|Pangu Party
FJI|Jioji Konrote|Frank Bainimarama|FijiFirst
SLB|Governor-General David Vunagi|Manasseh Sogavare|
VUT|Tallis Obed Moses|Charlot Salwai|
WSM|Tui Atua Tupua Tamasese Efi|Tuila'epa Sa'ilele Malielegaoi|
TON|King Tupou VI|Pohiva Tu'i'onetoa|
KIR|Taneti Maamau||
FSM|David Panuelo||
MHL|David Kabua||
NRU|Lionel Aingimea||
PLW|Tommy Remengesau||
GTM|Alejandro Giammattei||Vamos
BLZ|Governor-General Colville Young|Dean Barrow|United Democratic Party
SLV|Nayib Bukele||Nuevas Ideas
HND|Juan Orlando Hernandez||National Party
NIC|Daniel Ortega||Sandinista National Liberation Front
CRI|Carlos Alvarado Quesada||Citizens' Action Party
PAN|Laurentino Cortizo||Democratic Revolutionary Party
CUB|Miguel Diaz-Canel|Manuel Marrero Cruz|Communist Party of Cuba
DOM|Danilo Medina||Dominican Liberation Party
HTI|Jovenel Moise|Joseph Jouthe|
JAM|Governor-General Patrick Allen|Andrew Holness|Jamaica Labour Party
TTO|Paula-Mae Weekes|Keith Rowley|People's National Movement
BHS|Governor-General Cornelius A. Smith|Hubert Minnis|Free National Movement
BRB|Governor-General Sandra Mason|Mia Mottley|Barbados Labour Party
ATG|Governor-General Rodney Williams|Gaston Browne|Antigua Labour Party
DMA|Charles Savarin|Roosevelt Skerrit|Dominica Labour Party
GRD|Governor-General Cecile La Grenade|Keith Mitchell|New National Party
KNA|Governor-General Samuel Seaton|Timothy Harris|Team Unity
LCA|Governor-General Neville Cenac|Allen Chastanet|United Workers Party
VCT|Governor-General Susan Dougan|Ralph Gonsalves|Unity Labour Party
COL|Ivan Duque||Democratic Center||30
VEN|Nicolas Maduro||United Socialist Party of Venezuela
GUY|David Granger|Moses Nagamootoo|A Partnership for National Unity
SUR|Desi Bouterse||National Democratic Party
ECU|Lenin Moreno||PAIS Alliance||0
PER|Martin Vizcarra|Vicente Zeballos|
BOL|Jeanine Anez||
CHL|Sebastian Pinera||National Renewal||20
ARG|Alberto Fernandez||Frente de Todos||-20
URY|Luis Lacalle Pou||National Party||15
PRY|Mario Abdo Benitez||Colorado Party
BRA|Jair Bolsonaro||Alliance for Brazil||50
CYP|Nicos Anastasiades||Democratic Rally
MLT|George Vella|Robert Abela|Labour Party
VAT|Pope Francis||
AND|Co-Princes|Xavier Espot|
LIE|Prince Hans-Adam II|Adrian Hasler|
MCO|Prince Albert II|Serge Telle|
SMR|Captains Regent||
`) };

// ===========================================================================
// 1 January 2026: the present.
// ===========================================================================

export const SCENARIO_2026: HistoricalScenario = { year: 2026, regions: [], polities: modern(2026, `
USA|Donald Trump||Republican Party||30
CAN|Governor General Mary Simon|Mark Carney|Liberal Party
MEX|Claudia Sheinbaum||Morena||-20
GBR|King Charles III|Keir Starmer|Labour Party||-12
IRL|Catherine Connolly|Micheal Martin|Fianna Fail
FRA|Emmanuel Macron|Sebastien Lecornu|Renaissance
DEU|Frank-Walter Steinmeier|Friedrich Merz|Christian Democratic Union||15
ITA|Sergio Mattarella|Giorgia Meloni|Brothers of Italy||35
ESP|King Felipe VI|Pedro Sanchez|Spanish Socialist Workers' Party||-18
PRT|Marcelo Rebelo de Sousa|Luis Montenegro|Social Democratic Party
NLD|King Willem-Alexander|Dick Schoof|Caretaker Cabinet
BEL|King Philippe|Bart De Wever|N-VA
LUX|Grand Duke Guillaume|Luc Frieden|Christian Social People's Party
CHE|Guy Parmelin||Federal Council
AUT|Alexander Van der Bellen|Christian Stocker|Austrian People's Party
DNK|King Frederik X|Mette Frederiksen|Social Democrats
SWE|King Carl XVI Gustaf|Ulf Kristersson|Moderate Party
NOR|King Harald V|Jonas Gahr Store|Labour Party
FIN|Alexander Stubb|Petteri Orpo|National Coalition Party
ISL|Halla Tomasdottir|Kristrun Frostadottir|Social Democratic Alliance
POL|Karol Nawrocki|Donald Tusk|Civic Coalition
CZE|Petr Pavel|Andrej Babis|ANO 2011
SVK|Peter Pellegrini|Robert Fico|Direction - Social Democracy
HUN|Tamas Sulyok|Viktor Orban|Fidesz
ROU|Nicusor Dan|Ilie Bolojan|National Liberal Party
BGR|Rumen Radev|Rosen Zhelyazkov|GERB
GRC|Konstantinos Tasoulas|Kyriakos Mitsotakis|New Democracy
HRV|Zoran Milanovic|Andrej Plenkovic|Croatian Democratic Union
SVN|Natasa Pirc Musar|Robert Golob|Freedom Movement
SRB|Aleksandar Vucic|Duro Macut|Serbian Progressive Party
BIH|Zeljka Cvijanovic|Borjana Kristo|
MNE|Jakov Milatovic|Milojko Spajic|Europe Now!
MKD|Gordana Siljanovska-Davkova|Hristijan Mickoski|VMRO-DPMNE
ALB|Bajram Begaj|Edi Rama|Socialist Party
XKX|Vjosa Osmani|Albin Kurti|Vetevendosje
EST|Alar Karis|Kristen Michal|Reform Party
LVA|Edgars Rinkevics|Evika Silina|New Unity
LTU|Gitanas Nauseda|Inga Ruginiene|Social Democratic Party
BLR|Alexander Lukashenko|Alexander Turchin|
UKR|Volodymyr Zelenskyy|Yulia Svyrydenko|Servant of the People
MDA|Maia Sandu|Alexandru Munteanu|Party of Action and Solidarity
RUS|Vladimir Putin|Mikhail Mishustin|United Russia
TUR|Recep Tayyip Erdogan||Justice and Development Party
GEO|Mikheil Kavelashvili|Irakli Kobakhidze|Georgian Dream
ARM|Vahagn Khachaturyan|Nikol Pashinyan|Civil Contract
AZE|Ilham Aliyev|Ali Asadov|New Azerbaijan Party
KAZ|Kassym-Jomart Tokayev|Olzhas Bektenov|Amanat
UZB|Shavkat Mirziyoyev|Abdulla Aripov|
KGZ|Sadyr Japarov|Adylbek Kasymaliev|
TJK|Emomali Rahmon|Kokhir Rasulzoda|
TKM|Serdar Berdimuhamedow||
CHN|Xi Jinping|Li Qiang|Communist Party of China
JPN|Emperor Naruhito|Sanae Takaichi|Liberal Democratic Party||30
KOR|Lee Jae-myung|Kim Min-seok|Democratic Party||-10
PRK|Kim Jong Un|Pak Thae Song|Workers' Party of Korea
TWN|Lai Ching-te|Cho Jung-tai|Democratic Progressive Party
MNG|Ukhnaagiin Khurelsukh|Gombojavyn Zandanshatar|Mongolian People's Party
IND|Droupadi Murmu|Narendra Modi|Bharatiya Janata Party
PAK|Asif Ali Zardari|Shehbaz Sharif|Pakistan Muslim League (N)
BGD|Mohammed Shahabuddin|Muhammad Yunus|Interim Government
NPL|Ram Chandra Poudel|Sushila Karki|Interim Government
BTN|King Jigme Khesar Namgyel Wangchuck|Tshering Tobgay|People's Democratic Party
LKA|Anura Kumara Dissanayake|Harini Amarasuriya|National People's Power
MDV|Mohamed Muizzu||People's National Congress
AFG|Hibatullah Akhundzada|Hasan Akhund|Taliban
IRN|Ali Khamenei|Masoud Pezeshkian|
IRQ|Abdul Latif Rashid|Mohammed Shia al-Sudani|Coordination Framework
SYR|Ahmed al-Sharaa||Transitional Government
LBN|Joseph Aoun|Nawaf Salam|
ISR|Isaac Herzog|Benjamin Netanyahu|Likud
PSE|Mahmoud Abbas|Mohammad Mustafa|Fatah
JOR|King Abdullah II|Jafar Hassan|
SAU|King Salman|Mohammed bin Salman|
ARE|Mohamed bin Zayed Al Nahyan|Mohammed bin Rashid Al Maktoum|
QAT|Emir Tamim bin Hamad Al Thani|Mohammed bin Abdulrahman Al Thani|
KWT|Emir Mishal Al-Ahmad Al-Jaber Al-Sabah|Ahmad Al-Abdullah Al-Sabah|
BHR|King Hamad bin Isa Al Khalifa|Salman bin Hamad Al Khalifa|
OMN|Sultan Haitham bin Tariq||
YEM|Rashad al-Alimi|Salem bin Breik|Presidential Leadership Council
EGY|Abdel Fattah el-Sisi|Mostafa Madbouly|
LBY|Mohamed al-Menfi|Abdul Hamid Dbeibeh|Government of National Unity
TUN|Kais Saied|Sara Zaafarani|
DZA|Abdelmadjid Tebboune|Sifi Ghrieb|
MAR|King Mohammed VI|Aziz Akhannouch|National Rally of Independents
MRT|Mohamed Ould Ghazouani|Moctar Ould Djay|El Insaf
MLI|Assimi Goita|Abdoulaye Maiga|Junta
NER|Abdourahamane Tchiani|Ali Lamine Zeine|Junta
BFA|Ibrahim Traore|Rimtalba Ouedraogo|Junta
TCD|Mahamat Deby|Allamaye Halina|Patriotic Salvation Movement
SDN|Abdel Fattah al-Burhan|Kamil Idris|Sovereignty Council
SSD|Salva Kiir||SPLM
ERI|Isaias Afwerki||People's Front for Democracy and Justice
ETH|Taye Atske Selassie|Abiy Ahmed|Prosperity Party|PR
DJI|Ismail Omar Guelleh|Abdoulkader Kamil Mohamed|People's Rally for Progress
SOM|Hassan Sheikh Mohamud|Hamza Abdi Barre|
KEN|William Ruto||United Democratic Alliance
UGA|Yoweri Museveni|Robinah Nabbanja|National Resistance Movement
TZA|Samia Suluhu Hassan|Mwigulu Nchemba|Chama Cha Mapinduzi
RWA|Paul Kagame|Justin Nsengiyumva|Rwandan Patriotic Front
BDI|Evariste Ndayishimiye|Nestor Ntahontuye|CNDD-FDD
COD|Felix Tshisekedi|Judith Suminwa|Union for Democracy and Social Progress
COG|Denis Sassou Nguesso|Anatole Collinet Makosso|Congolese Party of Labour
GAB|Brice Oligui Nguema||Democratic Union of Builders
CMR|Paul Biya|Joseph Ngute|Cameroon People's Democratic Movement
CAF|Faustin-Archange Touadera|Felix Moloua|United Hearts Movement
GNQ|Teodoro Obiang Nguema Mbasogo|Manuel Osa Nsue Nsua|Democratic Party of Equatorial Guinea
STP|Carlos Vila Nova|Americo Ramos|
NGA|Bola Tinubu||All Progressives Congress
BEN|Patrice Talon||
TGO|Jean-Lucien Savi de Tove|Faure Gnassingbe|Union for the Republic
GHA|John Mahama||National Democratic Congress
CIV|Alassane Ouattara|Robert Beugre Mambe|Rally of Houphouetists
LBR|Joseph Boakai||Unity Party
SLE|Julius Maada Bio||Sierra Leone People's Party
GIN|Mamady Doumbouya|Bah Oury|Junta
GNB|Horta Inta-A Na Man||Junta|MJ
SEN|Bassirou Diomaye Faye|Ousmane Sonko|PASTEF
GMB|Adama Barrow||National People's Party
CPV|Jose Maria Neves|Ulisses Correia e Silva|Movement for Democracy
AGO|Joao Lourenco||MPLA
ZMB|Hakainde Hichilema||United Party for National Development
ZWE|Emmerson Mnangagwa||ZANU-PF
MWI|Peter Mutharika||Democratic Progressive Party
MOZ|Daniel Chapo|Benvinda Levy|FRELIMO
MDG|Michael Randrianirina|Herintsalama Rajaonarivelo|Junta|MJ
COM|Azali Assoumani||Convention for the Renewal of the Comoros
MUS|Dharam Gokhool|Navin Ramgoolam|Labour Party
SYC|Patrick Herminie||United Seychelles
BWA|Duma Boko||Umbrella for Democratic Change
NAM|Netumbo Nandi-Ndaitwah|Elijah Ngurare|SWAPO
ZAF|Cyril Ramaphosa||African National Congress
LSO|King Letsie III|Sam Matekane|Revolution for Prosperity
SWZ|King Mswati III|Russell Dlamini|
MMR|Min Aung Hlaing|Nyo Saw|State Security and Peace Commission
THA|King Vajiralongkorn|Anutin Charnvirakul|Bhumjaithai Party
LAO|Thongloun Sisoulith|Sonexay Siphandone|Lao People's Revolutionary Party
KHM|King Norodom Sihamoni|Hun Manet|Cambodian People's Party
VNM|To Lam|Pham Minh Chinh|Communist Party of Vietnam
MYS|Sultan Ibrahim Iskandar|Anwar Ibrahim|Pakatan Harapan
SGP|Tharman Shanmugaratnam|Lawrence Wong|People's Action Party
BRN|Sultan Hassanal Bolkiah||
IDN|Prabowo Subianto||Gerindra
PHL|Ferdinand Marcos Jr.||Partido Federal ng Pilipinas
TLS|Jose Ramos-Horta|Xanana Gusmao|CNRT
AUS|Governor-General Sam Mostyn|Anthony Albanese|Australian Labor Party||-12
NZL|Governor-General Cindy Kiro|Christopher Luxon|National Party
PNG|Governor-General Bob Dadae|James Marape|Pangu Party
FJI|Naiqama Lalabalavu|Sitiveni Rabuka|People's Alliance
SLB|Governor-General David Vunagi|Jeremiah Manele|
VUT|Nikenike Vurobaravu|Jotham Napat|
WSM|Tuimalealiifano Vaaletoa Sualauvi II|La'auli Leuatea Schmidt|FAST
TON|King Tupou VI|Lord Fakafanua|
KIR|Taneti Maamau||
FSM|Wesley Simina||
MHL|Hilda Heine||
NRU|David Adeang||
PLW|Surangel Whipps Jr.||
GTM|Bernardo Arevalo||Semilla
BLZ|Governor-General Froyla Tzalam|John Briceno|People's United Party
SLV|Nayib Bukele||Nuevas Ideas
HND|Xiomara Castro||Libre
NIC|Daniel Ortega||Sandinista National Liberation Front
CRI|Rodrigo Chaves||Social Democratic Progress Party
PAN|Jose Raul Mulino||Realizing Goals
CUB|Miguel Diaz-Canel|Manuel Marrero Cruz|Communist Party of Cuba
DOM|Luis Abinader||Modern Revolutionary Party
HTI|Transitional Presidential Council|Alix Didier Fils-Aime|
JAM|Governor-General Patrick Allen|Andrew Holness|Jamaica Labour Party
TTO|Christine Kangaloo|Kamla Persad-Bissessar|United National Congress
BHS|Governor-General Cynthia A. Pratt|Philip Davis|Progressive Liberal Party
BRB|Jeffrey Bostic|Mia Mottley|Barbados Labour Party
ATG|Governor-General Rodney Williams|Gaston Browne|Antigua and Barbuda Labour Party
DMA|Sylvanie Burton|Roosevelt Skerrit|Dominica Labour Party
GRD|Governor-General Cecile La Grenade|Dickon Mitchell|National Democratic Congress
KNA|Governor-General Marcella Liburd|Terrance Drew|Labour Party
LCA|Governor-General Errol Charles|Philip J. Pierre|Saint Lucia Labour Party
VCT|Governor-General Stanley John|Godwin Friday|New Democratic Party
COL|Gustavo Petro||Historic Pact||-35
VEN|Nicolas Maduro||United Socialist Party of Venezuela
GUY|Irfaan Ali|Mark Phillips|People's Progressive Party
SUR|Jennifer Geerlings-Simons||National Democratic Party
ECU|Daniel Noboa||National Democratic Action
PER|Jose Jeri|Ernesto Alvarez|
BOL|Rodrigo Paz||Christian Democratic Party||15
CHL|Gabriel Boric||Social Convergence||-25
ARG|Javier Milei||La Libertad Avanza||45
URY|Yamandu Orsi||Broad Front
PRY|Santiago Pena||Colorado Party
BRA|Luiz Inacio Lula da Silva||Workers' Party
CYP|Nikos Christodoulides||Independent
MLT|Myriam Spiteri Debono|Robert Abela|Labour Party
VAT|Pope Leo XIV||
AND|Co-Princes|Xavier Espot|
LIE|Prince Hans-Adam II|Brigitte Haas|
MCO|Prince Albert II|Christophe Mirmand|
SMR|Captains Regent||
`) };
