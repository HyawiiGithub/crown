import { REGIONS_1900 } from "./regions";
import { table, type HistoricalScenario } from "./types";

/** 1 January 1900. GDP is nominal, in billions of US dollars of the day. */
export const SCENARIO_1900: HistoricalScenario = { year: 1900, regions: REGIONS_1900, polities: table(`
GBR|United Kingdom|CM|-5|british-empire|41|9.8|Queen:Victoria|Prime Minister:Marquess of Salisbury|GBR IRL||Conservative and Unionist Party
RAJ|British Raj|DEP|-10|british-empire|287|5.2|Viceroy:Lord Curzon|-|IND PAK BGD MMR|GBR:colony
CAN|Dominion of Canada|CM|-5|british-empire|5.3|1.1|Governor General:Earl of Minto|Prime Minister:Wilfrid Laurier||GBR:dominion|Liberal Party
AUC|Australian Colonies|DEP|-5|british-empire|3.8|0.95|Governor:Earl Beauchamp|-|AUS|GBR:colony
NZL|Colony of New Zealand|DEP|-15|british-empire|0.8|0.2|Governor:Earl of Ranfurly|Premier:Richard Seddon||GBR:colony|Liberal Party
CPC|Cape Colony and Natal|DEP|5|british-empire|2.1|0.25|High Commissioner:Alfred Milner|-|ZAF LSO SWZ BWA|GBR:colony
EGP|Khedivate of Egypt|PROT|-5|british-empire|10|0.45|Khedive:Abbas II|Consul-General:Earl of Cromer|EGY|GBR:protectorate
SUD|Anglo-Egyptian Sudan|DEP|0|british-empire|2.2|0.05|Governor-General:Reginald Wingate|-|SDN SSD|GBR:colony
BEA|British East Africa|DEP|0|british-empire|5|0.04|Commissioner:Charles Eliot|-|KEN UGA|GBR:protectorate
RHO|Rhodesia and Nyasaland|DEP|0|british-empire|2.5|0.03|Administrator:William Milton|-|ZWE ZMB MWI|GBR:colony
NIG|Nigeria Protectorates|DEP|0|british-empire|16|0.1|High Commissioner:Frederick Lugard|-|NGA|GBR:protectorate
BWF|British West Africa|DEP|0|british-empire|3.4|0.04|Governor:Frederic Hodgson|-|GHA SLE GMB|GBR:colony
BSO|British Somaliland|DEP|0|british-empire|0.3|0.002|Consul-General:James Hayes Sadler|-|SML|GBR:protectorate
ADN|Aden Protectorate|DEP|0|british-empire|0.5|0.008|Political Resident:Ormsby Creagh|-|-|GBR:protectorate
BMA|British Malaya|DEP|0|british-empire|2|0.09|High Commissioner:Charles Mitchell|-|MYS SGP BRN|GBR:colony
CEY|Ceylon|DEP|0|british-empire|3.6|0.09|Governor:West Ridgeway|-|LKA|GBR:colony
BWI|British West Indies|DEP|0|british-empire|2|0.08|Governor:Augustus Hemming|-|JAM TTO BHS BRB GUY BLZ ATG DMA GRD KNA LCA VCT|GBR:colony
BPO|British Pacific and Mediterranean|DEP|0|british-empire|1|0.03|High Commissioner:George O'Brien|-|FJI SLB TON KIR NRU CYP MLT MUS SYC MDV PNG HKG KWT BHR ARE|GBR:colony
FRA|France|PR|-10|entente|40.7|6.9|President:Emile Loubet|President of the Council:Pierre Waldeck-Rousseau|||Republican Defence
ALG|French Algeria and Tunisia|DEP|-5|entente|6.1|0.35|Governor-General:Charles Jonnart|-|DZA TUN|FRA:colony
AOF|French West Africa|DEP|0|entente|10.5|0.08|Governor-General:Noel Ballay|-|SEN MLI GIN CIV BEN BFA NER MRT|FRA:colony
AEF|French Congo|DEP|0|entente|3.2|0.02|Commissioner-General:Albert Grodet|-|COG GAB CAF TCD|FRA:colony
MDG|French Madagascar|DEP|0|entente|2.8|0.03|Governor-General:Joseph Gallieni|-|MDG COM DJI VUT|FRA:colony
IDC|French Indochina|DEP|0|entente|16|0.28|Governor-General:Paul Doumer|-|VNM LAO KHM|FRA:colony
DEU|German Empire|CM|-5|central-powers|56|7.9|Kaiser:Wilhelm II|Chancellor:Chlodwig zu Hohenlohe-Schillingsfurst|||Conservative-Centre Bloc
GEA|German East Africa|DEP|0|central-powers|7|0.03|Governor:Eduard von Liebert|-|TZA RWA BDI|DEU:colony
GWA|German West Africa|DEP|0|central-powers|4.2|0.02|Governor:Jesko von Puttkamer|-|CMR TGO NAM|DEU:colony
GNG|German New Guinea and Samoa|DEP|0|central-powers|0.6|0.005|Governor:Rudolf von Bennigsen|-|WSM FSM PLW MHL|DEU:colony
RUS|Russian Empire|AM|30|entente|132|6.6|Tsar:Nicholas II|Finance Minister:Sergei Witte|RUS UKR BLR MDA EST LVA LTU POL FIN KAZ UZB TKM KGZ TJK ARM AZE GEO
AUT|Austria-Hungary|CM|25|central-powers|45.5|3.8|Emperor:Franz Joseph I|Minister-President:Ernest von Koerber|AUT HUN CZE SVK SVN HRV BIH
OTT|Ottoman Empire|AM|35|none|24|1.1|Sultan:Abdul Hamid II|Grand Vizier:Halil Rifat Pasha|TUR SYR LBN ISR PSE JOR IRQ ALB MKD XKX LBY QAT
ITA|Kingdom of Italy|CM|10|central-powers|33.5|2.7|King:Umberto I|Prime Minister:Luigi Pelloux|ITA VAT||Historical Right
EIS|Italian East Africa|DEP|0|central-powers|0.8|0.005|Governor:Ferdinando Martini|-|ERI SOM|ITA:colony
ESP|Spain|CM|15|none|18.6|1.2|King:Alfonso XIII (Regent Maria Christina)|Prime Minister:Francisco Silvela|ESP AND||Conservative Party
SGU|Spanish Africa|DEP|0|none|0.2|0.003|Governor:Jose Ibarra|-|GNQ ESH|ESP:colony
PRT|Portugal|CM|5|none|5.4|0.35|King:Carlos I|Prime Minister:Jose Luciano de Castro|||Progressive Party
PAF|Portuguese Africa|DEP|0|none|7|0.04|Governor-General:Alvaro Ferreira|-|AGO MOZ GNB CPV STP TLS|PRT:colony
BEL|Belgium|CM|5|none|6.7|1.1|King:Leopold II|Prime Minister:Paul de Smet de Naeyer|||Catholic Party
COD|Congo Free State|DEP|15|none|11|0.03|Sovereign:Leopold II|Vice Governor-General:Theophile Wahis||BEL:colony
NLD|Netherlands|CM|-5|none|5.1|0.85|Queen:Wilhelmina|Prime Minister:Nicolaas Pierson|||Liberal Union
DEI|Dutch East Indies|DEP|0|none|38|0.75|Governor-General:Willem Rooseboom|-|IDN SUR|NLD:colony
DNK|Denmark|CM|5|none|2.4|0.42|King:Christian IX|Council President:Hugo Egmont Horring|DNK ISL||Hojre
SWE|Sweden-Norway|CM|5|none|7.3|0.95|King:Oscar II|Prime Minister:Erik Gustaf Bostrom|SWE NOR
CHE|Switzerland|FR|0|none|3.3|0.75|President of the Confederation:Walter Hauser
LUX|Luxembourg|CM|0|none|0.24|0.05|Grand Duke:Adolphe|Prime Minister:Paul Eyschen
LIE|Liechtenstein|CM|5|none|0.01|0.001|Prince:Johann II|Governor:Carl von In der Maur
MCO|Monaco|CM|10|none|0.015|0.004|Prince:Albert I
SMR|San Marino|PR|0|none|0.01|0.001|Captain Regent:Captains Regent
ROU|Romania|CM|5|none|6|0.42|King:Carol I|Prime Minister:Gheorghe Cantacuzino|||Conservative Party
BGR|Principality of Bulgaria|CM|5|none|3.7|0.2|Prince:Ferdinand I|Prime Minister:Todor Ivanchov
SRB|Serbia|CM|10|none|2.5|0.13|King:Alexander I Obrenovic|Prime Minister:Vladan Dordevic
MNE|Montenegro|AM|15|none|0.25|0.008|Prince:Nicholas I|Prime Minister:Bozo Petrovic
GRC|Greece|CM|5|none|2.4|0.17|King:George I|Prime Minister:Georgios Theotokis|||Modernist Party
USA|United States|PRES|15|none|76|20.7|President:William McKinley|-|USA||Republican Party
UOT|US Overseas Possessions|DEP|0|none|8.6|0.2|Military Governor:Elwell Otis|-|PHL PRI|USA:colony
CUB|Cuba (US Military Government)|OCC|0|none|1.6|0.11|Military Governor:Leonard Wood|-||USA:occupation
JPN|Empire of Japan|CM|25|none|44|1.25|Emperor:Meiji|Prime Minister:Yamagata Aritomo|JPN TWN||Oligarchic Cabinet
KOR|Korean Empire|AM|20|none|9|0.15|Emperor:Gojong|Chief State Councillor:Yun Yong-seon|KOR PRK
CHN|Qing China|AM|25|none|400|6.9|Emperor:Guangxu (Empress Dowager Cixi)|Viceroy of Zhili:Yuan Shikai|CHN MNG
THA|Siam|AM|10|none|7.3|0.13|King:Chulalongkorn
IRN|Persia|AM|25|none|9.9|0.15|Shah:Mozaffar ad-Din Shah|Grand Vizier:Amin al-Soltan
AFG|Emirate of Afghanistan|AM|30|none|5|0.04|Emir:Abdur Rahman Khan
NPL|Nepal|AM|25|none|5|0.04|King:Prithvi Bir Bikram Shah|Prime Minister:Bir Shumsher Rana
BTN|Bhutan|AM|15|none|0.2|0.001|Druk Desi:Yeshe Ngodub
SAU|Emirate of Jabal Shammar|AM|35|none|2|0.01|Emir:Abdulaziz bin Mutaib
OMN|Muscat and Oman|AM|25|none|0.5|0.005|Sultan:Faisal bin Turki
YEM|Ottoman Yemen|DEP|25|none|2.2|0.01|Governor:Husayn Hilmi Pasha|-||OTT:colony
ETH|Ethiopian Empire|AM|25|none|11|0.08|Emperor:Menelik II
MAR|Sultanate of Morocco|AM|30|none|4.8|0.06|Sultan:Abdelaziz|Grand Vizier:Ba Ahmed
LBR|Liberia|PRES|5|none|1|0.003|President:William D. Coleman|-|||True Whig Party
SAR|South African Republic|PRES|25|none|1.1|0.08|State President:Paul Kruger|-|-
OFS|Orange Free State|PRES|20|none|0.2|0.012|State President:Martinus Steyn|-|-
MEX|Mexico|PRES|20|none|13.6|0.55|President:Porfirio Diaz
GTM|Guatemala|PRES|25|none|1.4|0.03|President:Manuel Estrada Cabrera
SLV|El Salvador|PRES|15|none|0.8|0.02|President:Tomas Regalado
HND|Honduras|PRES|10|none|0.5|0.01|President:Terencio Sierra
NIC|Nicaragua|PRES|-10|none|0.5|0.012|President:Jose Santos Zelaya
CRI|Costa Rica|PRES|5|none|0.3|0.015|President:Rafael Yglesias Castro
COL|Colombia|PRES|25|none|4.1|0.17|President:Manuel Antonio Sanclemente|-|COL PAN||Conservative Party
VEN|Venezuela|PRES|20|none|2.5|0.09|President:Cipriano Castro
ECU|Ecuador|PRES|-15|none|1.4|0.04|President:Eloy Alfaro
PER|Peru|PRES|15|none|3.8|0.1|President:Eduardo Lopez de Romana
BOL|Bolivia|PRES|-5|none|1.7|0.05|President:Jose Manuel Pando
CHL|Chile|PRES|10|none|3|0.3|President:Federico Errazuriz Echaurren
ARG|Argentina|PRES|10|none|4.7|1.1|President:Julio Argentino Roca|-|||National Autonomist Party
URY|Uruguay|PRES|0|none|0.9|0.18|President:Juan Lindolfo Cuestas
PRY|Paraguay|PRES|15|none|0.5|0.02|President:Emilio Aceval
BRA|Brazil|FR|5|none|17.4|0.75|President:Manuel Ferraz de Campos Sales
DOM|Dominican Republic|PRES|5|none|0.6|0.01|President:Juan Isidro Jimenes
HTI|Haiti|PRES|15|none|1.3|0.03|President:Tiresias Simon Sam
`) };
