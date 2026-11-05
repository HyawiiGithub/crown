import { REGIONS_1914 } from "./regions";
import { table, type HistoricalScenario } from "./types";

/** 28 June 1914. GDP is nominal, in billions of US dollars of the day. */
export const SCENARIO_1914: HistoricalScenario = { year: 1914, regions: REGIONS_1914, polities: table(`
GBR|United Kingdom|CM|-15|entente|46|12.5|King:George V|Prime Minister:H. H. Asquith|GBR IRL||Liberal Party
RAJ|British Raj|DEP|-10|entente|315|6.9|Viceroy:Lord Hardinge|-|IND PAK BGD MMR|GBR:colony
CAN|Dominion of Canada|CM|5|entente|7.9|2.5|Governor General:Duke of Connaught|Prime Minister:Robert Borden||GBR:dominion|Conservative Party
AUS|Commonwealth of Australia|CM|-10|entente|4.9|1.6|Governor-General:Ronald Munro Ferguson|Prime Minister:Joseph Cook||GBR:dominion|Commonwealth Liberal Party
NZL|Dominion of New Zealand|CM|5|entente|1.1|0.45|Governor:Earl of Liverpool|Prime Minister:William Massey||GBR:dominion|Reform Party
ZAF|Union of South Africa|CM|10|entente|6|0.9|Governor-General:Viscount Gladstone|Prime Minister:Louis Botha|ZAF LSO SWZ BWA|GBR:dominion|South African Party
EGP|Khedivate of Egypt|PROT|-5|entente|12.5|0.75|Khedive:Abbas II|Consul-General:Lord Kitchener|EGY|GBR:protectorate
SUD|Anglo-Egyptian Sudan|DEP|0|entente|3|0.07|Governor-General:Reginald Wingate|-|SDN SSD|GBR:colony
BEA|British East Africa|DEP|0|entente|6|0.06|Governor:Henry Belfield|-|KEN UGA|GBR:protectorate
RHO|Rhodesia and Nyasaland|DEP|0|entente|3|0.05|Administrator:William Milton|-|ZWE ZMB MWI|GBR:colony
NIG|Colony and Protectorate of Nigeria|DEP|0|entente|17|0.18|Governor-General:Frederick Lugard|-|NGA|GBR:colony
BWF|British West Africa|DEP|0|entente|3.6|0.07|Governor:Hugh Clifford|-|GHA SLE GMB|GBR:colony
BSO|British Somaliland|DEP|0|entente|0.3|0.002|Commissioner:Horace Byatt|-|SML|GBR:protectorate
ADN|Aden Protectorate|DEP|0|entente|0.5|0.01|Political Resident:James Bell|-|-|GBR:protectorate
BMA|British Malaya|DEP|0|entente|2.8|0.2|High Commissioner:Arthur Young|-|MYS SGP BRN|GBR:colony
CEY|Ceylon|DEP|0|entente|4.2|0.16|Governor:Robert Chalmers|-|LKA|GBR:colony
BWI|British West Indies|DEP|0|entente|2.2|0.11|Governor:William Manning|-|JAM TTO BHS BRB GUY BLZ ATG DMA GRD KNA LCA VCT|GBR:colony
BPO|British Pacific and Mediterranean|DEP|0|entente|1.2|0.05|High Commissioner:Bickham Sweet-Escott|-|FJI SLB TON KIR NRU CYP MLT MUS SYC MDV PNG HKG KWT BHR ARE|GBR:colony
FRA|France|PR|-20|entente|39.8|10|President:Raymond Poincare|President of the Council:Rene Viviani|||Radical Party
ALG|French Algeria and Tunisia|DEP|-5|entente|7.4|0.65|Governor-General:Charles Lutaud|-|DZA TUN|FRA:colony
MAR|French Morocco|PROT|10|entente|4.5|0.1|Sultan:Yusef|Resident-General:Hubert Lyautey||FRA:protectorate
AOF|French West Africa|DEP|0|entente|12|0.12|Governor-General:William Ponty|-|SEN MLI GIN CIV BEN BFA NER MRT|FRA:colony
AEF|French Equatorial Africa|DEP|0|entente|3.5|0.03|Governor-General:Martial Merlin|-|COG GAB CAF TCD|FRA:colony
MDG|French Madagascar|DEP|0|entente|3.2|0.05|Governor-General:Albert Picquie|-|MDG COM DJI VUT|FRA:colony
IDC|French Indochina|DEP|0|entente|18|0.45|Governor-General:Joost van Vollenhoven|-|VNM LAO KHM|FRA:colony
DEU|German Empire|CM|15|central-powers|67.8|14.5|Kaiser:Wilhelm II|Chancellor:Theobald von Bethmann Hollweg|||Conservative and Centre Coalition
GEA|German East Africa|DEP|0|central-powers|7.6|0.05|Governor:Heinrich Schnee|-|TZA RWA BDI|DEU:colony
GWA|German West Africa|DEP|0|central-powers|4.7|0.04|Governor:Karl Ebermaier|-|CMR TGO NAM|DEU:colony
GNG|German New Guinea and Samoa|DEP|0|central-powers|0.6|0.008|Governor:Albert Hahl|-|WSM FSM PLW MHL|DEU:colony
RUS|Russian Empire|AM|35|entente|175|11|Tsar:Nicholas II|Chairman of Ministers:Ivan Goremykin|RUS UKR BLR MDA EST LVA LTU POL FIN KAZ UZB TKM KGZ TJK ARM AZE GEO
AUT|Austria-Hungary|CM|25|central-powers|52.8|6.2|Emperor:Franz Joseph I|Foreign Minister:Leopold Berchtold|AUT HUN CZE SVK SVN HRV BIH
OTT|Ottoman Empire|CM|25|none|21|1.5|Sultan:Mehmed V|Grand Vizier:Said Halim Pasha|TUR SYR LBN ISR PSE JOR IRQ QAT||Committee of Union and Progress
ITA|Kingdom of Italy|CM|5|central-powers|36|4.1|King:Victor Emmanuel III|Prime Minister:Antonio Salandra|ITA VAT||Historical Right
ICO|Italian Africa|DEP|0|central-powers|2.2|0.03|Governor:Giuseppe Salvago Raggi|-|LBY ERI SOM|ITA:colony
ESP|Spain|CM|15|none|20.4|2|King:Alfonso XIII|Prime Minister:Eduardo Dato|ESP AND||Conservative Party
SMA|Spanish Morocco|PROT|0|none|0.7|0.01|High Commissioner:Jose Marina Vega|-|-|ESP:protectorate
SGU|Spanish Guinea|DEP|0|none|0.2|0.004|Governor:Angel Barrera|-|GNQ ESH|ESP:colony
PRT|Portugal|PR|-20|none|5.9|0.45|President:Manuel de Arriaga|Prime Minister:Bernardino Machado|||Democratic Party
PAF|Portuguese Africa|DEP|0|none|8|0.08|Governor-General:Norton de Matos|-|AGO MOZ GNB CPV STP TLS|PRT:colony
BEL|Belgium|CM|5|entente|7.6|2.3|King:Albert I|Prime Minister:Charles de Broqueville|||Catholic Party
COD|Belgian Congo|DEP|0|entente|10|0.07|Governor-General:Felix Fuchs|-||BEL:colony
NLD|Netherlands|CM|-15|none|6.2|1.1|Queen:Wilhelmina|Prime Minister:Pieter Cort van der Linden
DEI|Dutch East Indies|DEP|0|none|47|1.2|Governor-General:Alexander Idenburg|-|IDN SUR|NLD:colony
DNK|Denmark|CM|-10|none|2.8|0.65|King:Christian X|Council President:Carl Theodor Zahle|DNK ISL||Radical Left
SWE|Sweden|CM|10|none|5.6|0.95|King:Gustaf V|Prime Minister:Hjalmar Hammarskjold
NOR|Norway|CM|-15|none|2.4|0.45|King:Haakon VII|Prime Minister:Gunnar Knudsen|||Liberal Party
CHE|Switzerland|FR|0|none|3.9|1.1|President of the Confederation:Arthur Hoffmann
LUX|Luxembourg|CM|0|none|0.26|0.08|Grand Duchess:Marie-Adelaide|Prime Minister:Paul Eyschen
LIE|Liechtenstein|CM|5|none|0.01|0.001|Prince:Johann II
MCO|Monaco|CM|10|none|0.02|0.005|Prince:Albert I
SMR|San Marino|PR|0|none|0.01|0.001|Captain Regent:Captains Regent
ROU|Romania|CM|0|none|7.8|0.75|King:Carol I|Prime Minister:Ion I. C. Bratianu|||National Liberal Party
BGR|Tsardom of Bulgaria|CM|10|none|4.8|0.35|Tsar:Ferdinand I|Prime Minister:Vasil Radoslavov
SRB|Serbia|CM|10|entente|4.4|0.24|King:Peter I|Prime Minister:Nikola Pasic|SRB XKX MKD||People's Radical Party
MNE|Montenegro|CM|15|entente|0.4|0.012|King:Nicholas I|Prime Minister:Janko Vukotic
ALB|Principality of Albania|CM|10|none|0.8|0.02|Prince:Wilhelm of Wied|Prime Minister:Turhan Pasha Permeti
GRC|Greece|CM|-5|none|4.8|0.4|King:Constantine I|Prime Minister:Eleftherios Venizelos|||Liberal Party
USA|United States|PRES|-15|none|99|36.4|President:Woodrow Wilson|-|USA PAN||Democratic Party
UOT|US Overseas Possessions|DEP|0|none|10|0.5|Governor-General:Francis Burton Harrison|-|PHL PRI|USA:colony
CUB|Cuba|PRES|10|none|2.4|0.32|President:Mario Garcia Menocal
JPN|Empire of Japan|CM|20|none|52|2.5|Emperor:Taisho|Prime Minister:Okuma Shigenobu|JPN TWN KOR PRK||Rikken Doshikai
CHN|Republic of China|PRES|15|none|430|7.4|President:Yuan Shikai|Secretary of State:Xu Shichang|CHN||Beiyang Government
MNG|Bogd Khanate of Mongolia|TH|25|none|0.7|0.01|Bogd Khan:Jebtsundamba Khutuktu|Prime Minister:Sain Noyon Khan
TIB|Tibet|TH|30|none|2|0.01|Dalai Lama:Thubten Gyatso|Chief Minister:Paljor Dorje Shatra|-
THA|Siam|AM|10|none|8.7|0.2|King:Vajiravudh
IRN|Persia|CM|20|none|11|0.2|Shah:Ahmad Shah Qajar|Prime Minister:Hassan Mostowfi
AFG|Emirate of Afghanistan|AM|30|none|5.5|0.05|Emir:Habibullah Khan
NPL|Nepal|AM|25|none|5.5|0.05|King:Tribhuvan|Prime Minister:Chandra Shumsher Rana
BTN|Kingdom of Bhutan|AM|15|none|0.2|0.001|King:Ugyen Wangchuck
SAU|Nejd and Hasa|AM|40|none|2.2|0.012|Emir:Abdulaziz Ibn Saud
OMN|Muscat and Oman|AM|25|none|0.5|0.006|Sultan:Faisal bin Turki
YEM|Ottoman Yemen|DEP|25|none|2.5|0.012|Imam:Yahya Muhammad Hamid ed-Din|-||OTT:colony
ETH|Ethiopian Empire|AM|25|none|11.5|0.1|Emperor:Iyasu V
LBR|Liberia|PRES|5|none|1.2|0.005|President:Daniel E. Howard|-|||True Whig Party
MEX|Mexico|PRES|25|none|15|0.8|President:Victoriano Huerta
GTM|Guatemala|PRES|25|none|1.9|0.05|President:Manuel Estrada Cabrera
SLV|El Salvador|PRES|15|none|1.1|0.04|President:Carlos Melendez
HND|Honduras|PRES|10|none|0.6|0.015|President:Francisco Bertrand
NIC|Nicaragua|PRES|15|none|0.6|0.02|President:Adolfo Diaz
CRI|Costa Rica|PRES|5|none|0.4|0.03|President:Ricardo Jimenez Oreamuno
COL|Colombia|PRES|15|none|5.5|0.3|President:Carlos Eugenio Restrepo|-|||Republican Union
VEN|Venezuela|PRES|25|none|2.8|0.12|President:Juan Vicente Gomez
ECU|Ecuador|PRES|-15|none|1.5|0.06|President:Leonidas Plaza
PER|Peru|PRES|15|none|4.5|0.2|President:Oscar R. Benavides
BOL|Bolivia|PRES|-5|none|2|0.08|President:Ismael Montes
CHL|Chile|PRES|5|none|3.6|0.65|President:Ramon Barros Luco
ARG|Argentina|PRES|5|none|7.9|3|President:Victorino de la Plaza
URY|Uruguay|PRES|-20|none|1.3|0.35|President:Jose Batlle y Ordonez|-|||Colorado Party
PRY|Paraguay|PRES|15|none|0.6|0.03|President:Eduardo Schaerer
BRA|Brazil|FR|5|none|25|1.7|President:Hermes da Fonseca
DOM|Dominican Republic|PRES|5|none|0.7|0.02|President:Jose Bordas Valdez
HTI|Haiti|PRES|15|none|1.8|0.05|President:Oreste Zamor
`) };
