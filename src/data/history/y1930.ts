import { REGIONS_1930 } from "./regions";
import { table, type HistoricalScenario } from "./types";

/** 1 March 1930. GDP is nominal, in billions of US dollars of the day. */
export const SCENARIO_1930: HistoricalScenario = { year: 1930, regions: REGIONS_1930, polities: table(`
GBR|United Kingdom|CM|-20|none|46|19.5|King:George V|Prime Minister:Ramsay MacDonald|GBR||Labour Party
IRL|Irish Free State|CM|5|none|2.9|0.75|Governor-General:James McNeill|President of the Executive Council:W. T. Cosgrave||GBR:dominion|Cumann na nGaedheal
RAJ|British Raj|DEP|-10|none|338|9.5|Viceroy:Lord Irwin|-|IND PAK BGD MMR|GBR:colony
CAN|Dominion of Canada|CM|-8|none|10.2|5.8|Governor General:Viscount Willingdon|Prime Minister:William Lyon Mackenzie King||GBR:dominion|Liberal Party
AUS|Commonwealth of Australia|CM|-20|none|6.5|3.4|Governor-General:Lord Stonehaven|Prime Minister:James Scullin|AUS PNG NRU|GBR:dominion|Australian Labor Party
NZL|Dominion of New Zealand|CM|-5|none|1.5|0.7|Governor-General:Charles Fergusson|Prime Minister:Joseph Ward|NZL WSM|GBR:dominion|United Party
ZAF|Union of South Africa|CM|20|none|8.1|1.5|Governor-General:Earl of Athlone|Prime Minister:J. B. M. Hertzog|ZAF NAM|GBR:dominion|National Party
EGY|Kingdom of Egypt|CM|-5|none|14.5|1.1|King:Fuad I|Prime Minister:Mustafa el-Nahas|||Wafd Party
IRQ|Kingdom of Iraq (British Mandate)|CM|5|none|3|0.09|King:Faisal I|Prime Minister:Nuri al-Said||GBR:mandate
PLM|Mandate for Palestine and Transjordan|MAND|0|none|1.3|0.08|High Commissioner:John Chancellor|Emir of Transjordan:Abdullah I|ISR PSE JOR|GBR:mandate
SUD|Anglo-Egyptian Sudan|DEP|0|none|5.5|0.12|Governor-General:John Maffey|-|SDN SSD|GBR:colony
BEA|British East Africa|DEP|0|none|13|0.18|Governor:Edward Grigg|-|KEN UGA TZA|GBR:colony
RHO|Rhodesia and Nyasaland|DEP|0|none|3.5|0.12|Governor:Cecil Rodwell|-|ZWE ZMB MWI LSO SWZ BWA|GBR:colony
NIG|Colony and Protectorate of Nigeria|DEP|0|none|20|0.32|Governor:Graeme Thomson|-|NGA|GBR:colony
BWF|British West Africa|DEP|0|none|5|0.14|Governor:Alexander Ransford Slater|-|GHA SLE GMB|GBR:colony
BSO|British Somaliland|DEP|0|none|0.35|0.003|Governor:Harold Kittermaster|-|SML|GBR:protectorate
ADN|Aden Protectorate|DEP|0|none|0.6|0.015|Chief Commissioner:Stewart Symes|-|-|GBR:protectorate
BMA|British Malaya|DEP|0|none|4.4|0.55|High Commissioner:Cecil Clementi|-|MYS SGP BRN|GBR:colony
CEY|Ceylon|DEP|0|none|5.3|0.35|Governor:Herbert Stanley|-|LKA|GBR:colony
BWI|British West Indies|DEP|0|none|2.6|0.2|Governor:Reginald Stubbs|-|JAM TTO BHS BRB GUY BLZ ATG DMA GRD KNA LCA VCT|GBR:colony
BPO|British Pacific and Mediterranean|DEP|0|none|2|0.1|High Commissioner:Murchison Fletcher|-|FJI SLB TON KIR CYP MLT MUS SYC MDV HKG KWT BHR ARE|GBR:colony
FRA|France|PR|5|none|41.6|20|President:Gaston Doumergue|President of the Council:Andre Tardieu|||Democratic Republican Alliance
ALG|French North Africa|DEP|0|none|8.5|1|Governor-General:Pierre Bordes|-|DZA TUN|FRA:colony
MAR|French Morocco|PROT|10|none|5.3|0.25|Sultan:Mohammed V|Resident-General:Lucien Saint|MAR|FRA:protectorate
LEV|French Mandate of Syria and Lebanon|MAND|0|none|3.2|0.14|High Commissioner:Henri Ponsot|-|SYR LBN|FRA:mandate
AOF|French West Africa|DEP|0|none|15|0.3|Governor-General:Jules Brevie|-|SEN MLI GIN CIV BEN BFA NER MRT TGO|FRA:colony
AEF|French Equatorial Africa|DEP|0|none|5.5|0.07|Governor-General:Raphael Antonetti|-|COG GAB CAF TCD CMR|FRA:colony
MDG|French Madagascar|DEP|0|none|3.8|0.1|Governor-General:Leon Cayla|-|MDG COM DJI VUT|FRA:colony
IDC|French Indochina|DEP|0|none|21|1|Governor-General:Pierre Pasquier|-|VNM LAO KHM|FRA:colony
DEU|Weimar Republic|SP|-5|none|64.3|25|Reich President:Paul von Hindenburg|Chancellor:Hermann Muller|||Social Democratic Party
USS|Soviet Union|OP|-85|soviet-bloc|157|18|General Secretary:Joseph Stalin|Premier:Alexei Rykov|RUS UKR BLR KAZ UZB TKM KGZ TJK ARM AZE GEO||All-Union Communist Party (Bolsheviks)
ITA|Kingdom of Italy|CM|75|none|41|9|King:Victor Emmanuel III|Prime Minister:Benito Mussolini|ITA||National Fascist Party
ICO|Italian Africa|DEP|0|none|3|0.08|Governor:Pietro Badoglio|-|LBY ERI SOM|ITA:colony
VAT|Vatican City|TH|25|none|0.001|0.001|Pope:Pius XI
ESP|Spain|CM|35|none|23.6|3.8|King:Alfonso XIII|Prime Minister:Damaso Berenguer|ESP AND
SMA|Spanish Morocco|PROT|0|none|0.8|0.02|High Commissioner:Jose Sanjurjo|-|-|ESP:protectorate
SGU|Spanish Africa|DEP|0|none|0.2|0.006|Governor:Miguel Nunez|-|GNQ ESH|ESP:colony
PRT|Portugal|MJ|45|none|6.8|0.65|President:Oscar Carmona|Prime Minister:Domingos Oliveira
PAF|Portuguese Africa|DEP|0|none|9.5|0.2|Minister of Colonies:Antonio de Oliveira Salazar|-|AGO MOZ GNB CPV STP TLS|PRT:colony
BEL|Belgium|CM|10|none|8.1|3.1|King:Albert I|Prime Minister:Henri Jaspar|||Catholic Party
COD|Belgian Congo|DEP|0|none|12|0.3|Governor-General:Auguste Tilkens|-|COD RWA BDI|BEL:colony
NLD|Netherlands|CM|15|none|7.9|3.1|Queen:Wilhelmina|Prime Minister:Charles Ruijs de Beerenbrouck|||Roman Catholic State Party
DEI|Dutch East Indies|DEP|0|none|61|2.8|Governor-General:Andries de Graeff|-|IDN SUR|NLD:colony
DNK|Denmark|CM|-25|none|3.5|1.8|King:Christian X|Prime Minister:Thorvald Stauning|||Social Democrats
ISL|Kingdom of Iceland|CM|5|none|0.11|0.03|King:Christian X|Prime Minister:Tryggvi Thorhallsson|||Progressive Party
SWE|Sweden|CM|10|none|6.1|3.2|King:Gustaf V|Prime Minister:Arvid Lindman|||General Electoral League
NOR|Norway|CM|-10|none|2.8|1.15|King:Haakon VII|Prime Minister:Johan Ludwig Mowinckel|||Liberal Party
FIN|Finland|SP|10|none|3.4|0.65|President:Lauri Kristian Relander|Prime Minister:Kyosti Kallio|||Agrarian League
EST|Estonia|PR|5|none|1.1|0.15|State Elder:Otto Strandman|-|||Labour Party
LVA|Latvia|PR|5|none|1.9|0.28|President:Alberts Kviesis|Prime Minister:Hugo Celmins
LTU|Lithuania|OP|35|none|2.3|0.2|President:Antanas Smetona|Prime Minister:Juozas Tubelis|||Lithuanian Nationalist Union
POL|Second Polish Republic|SP|25|none|31.5|2.9|President:Ignacy Moscicki|Prime Minister:Walery Slawek|POL||Sanation
CSK|Czechoslovakia|PR|5|none|14.7|3.8|President:Tomas Masaryk|Prime Minister:Frantisek Udrzal|CZE SVK||Republican Party of Farmers
AUT|Austria|PR|15|none|6.7|1.5|Federal President:Wilhelm Miklas|Chancellor:Johann Schober|||Christian Social Party
HUN|Kingdom of Hungary|CM|40|none|8.7|1.25|Regent:Miklos Horthy|Prime Minister:Istvan Bethlen|||Unity Party
ROU|Kingdom of Romania|CM|5|none|18|1.9|King:Michael I (Regency)|Prime Minister:Iuliu Maniu|ROU MDA||National Peasants' Party
BGR|Tsardom of Bulgaria|CM|25|none|5.7|0.4|Tsar:Boris III|Prime Minister:Andrey Lyapchev
YUG|Kingdom of Yugoslavia|AM|35|none|13.9|1.2|King:Alexander I|Prime Minister:Petar Zivkovic|SRB HRV SVN BIH MNE MKD XKX
ALB|Kingdom of Albania|AM|30|none|1|0.03|King:Zog I|Prime Minister:Kostaq Kotta
GRC|Second Hellenic Republic|PR|-5|none|6.4|0.7|President:Alexandros Zaimis|Prime Minister:Eleftherios Venizelos|||Liberal Party
TUR|Republic of Turkey|OP|15|none|14.4|0.75|President:Mustafa Kemal Ataturk|Prime Minister:Ismet Inonu|||Republican People's Party
CHE|Switzerland|FR|5|none|4|2.4|President of the Confederation:Jean-Marie Musy
LUX|Luxembourg|CM|5|none|0.3|0.1|Grand Duchess:Charlotte|Prime Minister:Joseph Bech
LIE|Liechtenstein|CM|5|none|0.01|0.002|Prince:Franz I
MCO|Monaco|CM|10|none|0.025|0.008|Prince:Louis II
SMR|San Marino|PR|40|none|0.013|0.002|Captain Regent:Captains Regent
USA|United States|PRES|15|none|123|92|President:Herbert Hoover|-|USA PAN||Republican Party
UOT|US Overseas Possessions|DEP|0|none|15|2.1|Governor-General:Dwight F. Davis|-|PHL PRI|USA:colony
JPN|Empire of Japan|CM|25|none|64.5|8.9|Emperor:Hirohito|Prime Minister:Hamaguchi Osachi|||Rikken Minseito
JCO|Japanese Korea and Taiwan|DEP|0|none|25|1.4|Governor-General:Saito Makoto|-|KOR PRK TWN FSM PLW MHL|JPN:colony
CHN|Republic of China|OP|25|none|489|12|Chairman of the National Government:Chiang Kai-shek|Premier:Tan Yankai|CHN||Kuomintang
MNG|Mongolian People's Republic|OP|-70|soviet-bloc|0.7|0.02|Chairman:Khorloogiin Choibalsan|Prime Minister:Tserendorjiin Choijilsuren
TIB|Tibet|TH|30|none|2|0.015|Dalai Lama:Thubten Gyatso|Chief Minister:Yabshi Langdun|-
THA|Siam|AM|10|none|12|0.35|King:Prajadhipok
IRN|Imperial State of Persia|AM|25|none|13|0.3|Shah:Reza Shah Pahlavi|Prime Minister:Mehdi Qoli Hedayat
AFG|Kingdom of Afghanistan|AM|35|none|6.5|0.08|King:Mohammed Nadir Shah|Prime Minister:Mohammad Hashim Khan
NPL|Nepal|AM|25|none|5.5|0.07|King:Tribhuvan|Prime Minister:Bhim Shumsher Rana
BTN|Kingdom of Bhutan|AM|15|none|0.25|0.002|King:Jigme Wangchuck
SAU|Kingdom of Hejaz and Nejd|AM|45|none|3|0.03|King:Abdulaziz Ibn Saud
YEM|Mutawakkilite Yemen|AM|35|none|3|0.02|Imam:Yahya Muhammad Hamid ed-Din
OMN|Muscat and Oman|AM|25|none|0.5|0.008|Sultan:Taimur bin Feisal
QAT|Qatar|AM|25|none|0.03|0.001|Emir:Abdullah bin Jassim|-||GBR:protectorate
ETH|Ethiopian Empire|AM|25|none|12|0.12|Empress:Zewditu|Regent:Ras Tafari Makonnen
LBR|Liberia|PRES|5|none|1.5|0.01|President:Charles D. B. King|-|||True Whig Party
MEX|Mexico|PRES|-20|none|16.6|1.6|President:Pascual Ortiz Rubio|-|||National Revolutionary Party
GTM|Guatemala|PRES|15|none|1.8|0.08|President:Lazaro Chacon Gonzalez
SLV|El Salvador|PRES|10|none|1.4|0.06|President:Pio Romero Bosque
HND|Honduras|PRES|5|none|0.9|0.05|President:Vicente Mejia Colindres
NIC|Nicaragua|PRES|10|none|0.7|0.04|President:Jose Maria Moncada
CRI|Costa Rica|PRES|5|none|0.5|0.05|President:Cleto Gonzalez Viquez
CUB|Cuba|PRES|30|none|3.8|0.55|President:Gerardo Machado
DOM|Dominican Republic|PRES|5|none|1.3|0.08|President:Horacio Vasquez
HTI|Haiti (US Occupation)|PRES|10|none|2.4|0.08|President:Louis Borno
COL|Colombia|PRES|20|none|7.4|0.75|President:Miguel Abadia Mendez|-|||Conservative Party
VEN|Venezuela|PRES|35|none|3.3|0.45|President:Juan Bautista Perez
ECU|Ecuador|PRES|5|none|2|0.12|President:Isidro Ayora
PER|Peru|PRES|30|none|6|0.45|President:Augusto B. Leguia
BOL|Bolivia|PRES|15|none|2.7|0.18|President:Hernando Siles Reyes
CHL|Chile|PRES|35|none|4.4|1.05|President:Carlos Ibanez del Campo
ARG|Argentina|PRES|-10|none|11.9|3.6|President:Hipolito Yrigoyen|-|||Radical Civic Union
URY|Uruguay|PRES|-15|none|1.9|0.65|President:Juan Campisteguy|-|||Colorado Party
PRY|Paraguay|PRES|10|none|0.9|0.05|President:Jose Patricio Guggiari
BRA|Brazil|FR|15|none|35|2.9|President:Washington Luis
`) };
