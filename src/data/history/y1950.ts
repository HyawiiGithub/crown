import { REGIONS_1950 } from "./regions";
import { table, type HistoricalScenario } from "./types";

/** 1 January 1950. GDP is nominal, in billions of US dollars of the day. */
export const SCENARIO_1950: HistoricalScenario = { year: 1950, regions: REGIONS_1950, polities: table(`
USA|United States|PRES|-5|allies|152|299|President:Harry S. Truman|-|USA PRI||Democratic Party
USP|Trust Territory of the Pacific Islands|DEP|0|allies|0.05|0.01|High Commissioner:Elbert Thomas|-|FSM MHL PLW|USA:territory
USS|Soviet Union|OP|-85|soviet-bloc|180|126|Chairman of the Presidium:Nikolay Shvernik|Premier:Joseph Stalin|RUS UKR BLR MDA EST LVA LTU KAZ UZB TKM KGZ TJK ARM AZE GEO||Communist Party of the Soviet Union
GBR|United Kingdom|CM|-30|allies|50.6|46|King:George VI|Prime Minister:Clement Attlee|GBR||Labour Party
FRA|France|PR|5|allies|41.8|29|President:Vincent Auriol|President of the Council:Georges Bidault|||Popular Republican Movement
DEU|West Germany|PR|15|allies|50|23|Federal President:Theodor Heuss|Chancellor:Konrad Adenauer|||Christian Democratic Union
DDR|East Germany|OP|-80|soviet-bloc|18.4|8|President:Wilhelm Pieck|Prime Minister:Otto Grotewohl|-||Socialist Unity Party
CHN|People's Republic of China|OP|-80|soviet-bloc|552|30|Chairman of the Central People's Government:Mao Zedong|Premier:Zhou Enlai|||Communist Party of China
TWN|Republic of China (Taiwan)|OP|35|allies|7.6|1|Acting President:Li Zongren|Premier:Yan Xishan|||Kuomintang
TIB|Tibet|TH|30|none|1.3|0.03|Dalai Lama:Tenzin Gyatso (Regent Taktra)|Chief Minister:Surkhang Wangchen Gelek|-
IND|India|PR|-25|non-aligned|359|28|Governor-General:C. Rajagopalachari|Prime Minister:Jawaharlal Nehru|||Indian National Congress
PAK|Pakistan|CM|10|allies|75|4.3|Governor-General:Khawaja Nazimuddin|Prime Minister:Liaquat Ali Khan|PAK BGD||Muslim League
LKA|Ceylon|CM|10|allies|7.6|1.1|Governor-General:Lord Soulbury|Prime Minister:D. S. Senanayake|||United National Party
MMR|Union of Burma|PR|-25|non-aligned|19|0.7|President:Sao Shwe Thaik|Prime Minister:U Nu
JPN|Japan (Allied Occupation)|CM|15|allies|83|11|Emperor:Hirohito|Prime Minister:Shigeru Yoshida||USA:occupation|Liberal Party
KOR|South Korea|PRES|25|allies|20.2|1.7|President:Syngman Rhee
PRK|North Korea|OP|-85|soviet-bloc|9.5|0.7|Chairman of the Presidium:Kim Tu-bong|Premier:Kim Il Sung|||Workers' Party of Korea
MNG|Mongolian People's Republic|OP|-80|soviet-bloc|0.8|0.08|Chairman of the Presidium:Gonchigiin Bumtsend|Prime Minister:Khorloogiin Choibalsan
THA|Thailand|CM|35|allies|20|1.5|King:Bhumibol Adulyadej (Regency)|Prime Minister:Plaek Phibunsongkhram
PHL|Philippines|PRES|10|allies|20|3.6|President:Elpidio Quirino|-|||Liberal Party
IDN|Republic of Indonesia|PRES|-15|non-aligned|77|7|President:Sukarno|Prime Minister:Mohammad Hatta
DNG|Netherlands New Guinea|DEP|0|allies|0.7|0.01|Governor:Stephan Louis Jacob van Waardenburg|-|-|NLD:colony
IDC|French Indochina|DEP|0|allies|27|1.8|High Commissioner:Leon Pignon|Chief of State of Vietnam:Bao Dai|VNM LAO KHM|FRA:colony
DRV|Democratic Republic of Vietnam|OP|-75|soviet-bloc|13|0.4|President:Ho Chi Minh|-|-||Communist Party of Vietnam
BMA|British Malaya|DEP|0|allies|6.2|1.5|High Commissioner:Henry Gurney|-|MYS SGP BRN|GBR:colony
HKG|British Hong Kong|DEP|5|allies|2|0.3|Governor:Alexander Grantham|-||GBR:colony
ISR|Israel|PR|-25|none|1.3|1|President:Chaim Weizmann|Prime Minister:David Ben-Gurion|||Mapai
JOR|Hashemite Kingdom of Jordan|CM|15|allies|1.2|0.06|King:Abdullah I|Prime Minister:Said al-Mufti|JOR PSE
LBN|Lebanon|PR|5|none|1.4|0.3|President:Bechara El Khoury|Prime Minister:Riad Al Solh
SYR|Syria|PR|0|none|3.5|0.5|President:Hashim al-Atassi|Prime Minister:Khalid al-Azm
IRQ|Kingdom of Iraq|CM|15|allies|5.3|0.5|King:Faisal II (Regent Abd al-Ilah)|Prime Minister:Ali Jawdat al-Aiyubi
SAU|Saudi Arabia|AM|45|allies|3.2|0.5|King:Abdulaziz Ibn Saud
YEM|Mutawakkilite Yemen|AM|35|none|3.5|0.06|King:Ahmad bin Yahya
ADN|Aden Protectorate|DEP|0|allies|0.7|0.04|Governor:Reginald Champion|-|-|GBR:protectorate
OMN|Muscat and Oman|AM|25|none|0.5|0.02|Sultan:Said bin Taimur
GPT|British Gulf Protectorates|DEP|15|allies|0.25|0.1|Political Resident:Rupert Hay|-|KWT BHR QAT ARE|GBR:protectorate
IRN|Imperial State of Iran|CM|15|allies|17|1.5|Shah:Mohammad Reza Pahlavi|Prime Minister:Ali Mansur
TUR|Turkey|PR|15|allies|20.9|3.6|President:Ismet Inonu|Prime Minister:Semsettin Gunaltay|||Republican People's Party
AFG|Kingdom of Afghanistan|AM|30|non-aligned|8.2|0.4|King:Mohammed Zahir Shah|Prime Minister:Shah Mahmud Khan
NPL|Nepal|AM|25|non-aligned|8.3|0.2|King:Tribhuvan|Prime Minister:Mohan Shumsher Rana
BTN|Kingdom of Bhutan|AM|15|none|0.2|0.005|King:Jigme Wangchuck
EGY|Kingdom of Egypt|CM|5|allies|20.5|3|King:Farouk|Prime Minister:Hussein Sirri Pasha
SUD|Anglo-Egyptian Sudan|DEP|0|allies|9|0.6|Governor-General:Robert Howe|-|SDN SSD|GBR:colony
BAF|British Africa|DEP|0|allies|62|3.8|Secretary of State for the Colonies:Arthur Creech Jones|-|NGA GHA SLE GMB KEN UGA TZA ZMB MWI ZWE LSO SWZ BWA SML|GBR:colony
BWI|British West Indies|DEP|0|allies|3.1|0.8|Governor:Hugh Foot|-|JAM TTO BHS BRB GUY BLZ ATG DMA GRD KNA LCA VCT|GBR:colony
BPO|British Pacific and Mediterranean|DEP|0|allies|1.8|0.3|Governor:Brian Freeston|-|FJI SLB TON KIR CYP MUS SYC MDV|GBR:colony
UKA|British-administered Libya and Eritrea|OCC|0|allies|1.8|0.06|Chief Administrator:Travers Blackley|-|LBY ERI SOM|GBR:occupation
ALG|French North Africa|DEP|0|allies|13|3|Governor-General:Marcel-Edmond Naegelen|-|DZA TUN|FRA:colony
MAR|French Morocco|PROT|0|allies|8.9|1.8|Sultan:Mohammed V|Resident-General:Alphonse Juin|MAR|FRA:protectorate
AOF|French West Africa|DEP|0|allies|18|1.3|High Commissioner:Paul Bechard|-|SEN MLI GIN CIV BEN BFA NER MRT TGO|FRA:colony
AEF|French Equatorial Africa|DEP|0|allies|8.5|0.4|High Commissioner:Bernard Cornut-Gentille|-|COG GAB CAF TCD CMR|FRA:colony
MDG|French Madagascar|DEP|0|allies|4.5|0.4|High Commissioner:Pierre de Chevigne|-|MDG COM DJI VUT|FRA:colony
ITA|Italy|PR|15|allies|46.6|15|President:Luigi Einaudi|Prime Minister:Alcide De Gasperi|ITA||Christian Democracy
ESP|Francoist Spain|MJ|65|none|28|5.5|Caudillo:Francisco Franco|-|ESP AND||FET y de las JONS
SMA|Spanish Morocco|PROT|0|none|1|0.05|High Commissioner:Rafael Garcia Valino|-|-|ESP:protectorate
SGU|Spanish Africa|DEP|0|none|0.25|0.02|Governor:Juan Maria Bonelli|-|GNQ ESH|ESP:colony
PRT|Portugal|OP|55|allies|8.4|2.3|President:Oscar Carmona|Prime Minister:Antonio de Oliveira Salazar|||National Union
PAF|Portuguese Africa|DEP|0|allies|11|0.7|Minister of Colonies:Teofilo Duarte|-|AGO MOZ GNB CPV STP TLS|PRT:colony
BEL|Belgium|CM|15|allies|8.6|6.5|Prince Regent:Charles|Prime Minister:Gaston Eyskens|||Christian Social Party
COD|Belgian Congo|DEP|0|allies|14|0.8|Governor-General:Eugene Jungers|-|COD RWA BDI|BEL:colony
NLD|Netherlands|CM|-10|allies|10|8.5|Queen:Juliana|Prime Minister:Willem Drees|||Labour Party
SUR|Suriname|DEP|0|allies|0.2|0.05|Governor:Willem Huender|-||NLD:colony
LUX|Luxembourg|CM|10|allies|0.3|0.3|Grand Duchess:Charlotte|Prime Minister:Pierre Dupong
DNK|Denmark|CM|-25|allies|4.3|3.2|King:Frederik IX|Prime Minister:Hans Hedtoft|||Social Democrats
ISL|Iceland|PR|15|allies|0.14|0.1|President:Sveinn Bjornsson|Prime Minister:Olafur Thors|||Independence Party
NOR|Norway|CM|-30|allies|3.3|3|King:Haakon VII|Prime Minister:Einar Gerhardsen|||Labour Party
SWE|Sweden|CM|-30|none|7|7.5|King:Gustaf V|Prime Minister:Tage Erlander|||Social Democrats
FIN|Finland|SP|-10|none|4|2.8|President:Juho Kusti Paasikivi|Prime Minister:Karl-August Fagerholm|||Social Democratic Party
IRL|Ireland|PR|5|none|3|1.4|President:Sean T. O'Kelly|Taoiseach:John A. Costello|||Fine Gael
CHE|Switzerland|FR|5|none|4.7|5.6|President of the Confederation:Max Petitpierre
AUT|Austria (Allied Occupation)|PR|10|none|6.9|2.8|Federal President:Karl Renner|Chancellor:Leopold Figl||USA:occupation|Austrian People's Party
POL|Polish People's Republic|OP|-75|comecon|25|11|President:Boleslaw Bierut|Prime Minister:Jozef Cyrankiewicz|||Polish United Workers' Party
CSK|Czechoslovakia|OP|-75|comecon|12.4|8.5|President:Klement Gottwald|Prime Minister:Antonin Zapotocky|CZE SVK||Communist Party of Czechoslovakia
HUN|Hungarian People's Republic|OP|-80|comecon|9.3|3.8|Chairman of the Presidium:Sandor Ronai|Prime Minister:Istvan Dobi|||Hungarian Working People's Party
ROU|Romanian People's Republic|OP|-75|comecon|16.3|3.5|Chairman of the Presidium:Constantin Ion Parhon|Prime Minister:Petru Groza|||Romanian Workers' Party
BGR|People's Republic of Bulgaria|OP|-80|comecon|7.2|1.5|Chairman of the Presidium:Mincho Neychev|Prime Minister:Vasil Kolarov|||Bulgarian Communist Party
ALB|People's Republic of Albania|OP|-85|comecon|1.2|0.1|Chairman of the Presidium:Omer Nishani|Prime Minister:Enver Hoxha|||Party of Labour of Albania
YUG|Federal People's Republic of Yugoslavia|OP|-65|non-aligned|16.3|3.2|Chairman of the Presidency:Ivan Ribar|Prime Minister:Josip Broz Tito|SRB HRV SVN BIH MNE MKD XKX||League of Communists of Yugoslavia
GRC|Greece|CM|25|allies|7.6|2.1|King:Paul|Prime Minister:Alexandros Diomidis
VAT|Vatican City|TH|25|none|0.001|0.001|Pope:Pius XII
LIE|Liechtenstein|CM|5|none|0.014|0.005|Prince:Franz Joseph II
MCO|Monaco|CM|10|none|0.02|0.01|Prince:Rainier III
SMR|San Marino|PR|-60|none|0.013|0.005|Captain Regent:Captains Regent
MLT|Crown Colony of Malta|DEP|0|allies|0.3|0.05|Governor:Gerald Creasy|-||GBR:colony
ZAF|Union of South Africa|CM|45|allies|12.5|4.5|Governor-General:Gideon Brand van Zyl|Prime Minister:D. F. Malan|ZAF NAM||National Party
ETH|Ethiopian Empire|AM|20|allies|19|0.9|Emperor:Haile Selassie|Prime Minister:Makonnen Endelkachew
LBR|Liberia|PRES|10|allies|0.9|0.05|President:William Tubman|-|||True Whig Party
CAN|Canada|CM|-5|allies|13.7|18|Governor General:Viscount Alexander of Tunis|Prime Minister:Louis St. Laurent|||Liberal Party
AUS|Australia|CM|15|allies|8.2|10|Governor-General:William McKell|Prime Minister:Robert Menzies|AUS PNG NRU||Liberal Party
NZL|New Zealand|CM|15|allies|1.9|2|Governor-General:Bernard Freyberg|Prime Minister:Sidney Holland|NZL WSM||National Party
MEX|Mexico|PRES|-5|allies|28|5.5|President:Miguel Aleman Valdes|-|||Institutional Revolutionary Party
GTM|Guatemala|PRES|-20|none|3|0.6|President:Juan Jose Arevalo
SLV|El Salvador|MJ|15|none|1.9|0.3|President:Oscar Osorio
HND|Honduras|PRES|15|none|1.5|0.25|President:Juan Manuel Galvez
NIC|Nicaragua|PRES|40|allies|1.1|0.2|President:Victor Manuel Roman y Reyes
CRI|Costa Rica|PRES|5|allies|0.9|0.2|President:Otilio Ulate Blanco
PAN|Panama|PRES|10|allies|0.8|0.3|President:Arnulfo Arias
CUB|Cuba|PRES|5|allies|5.9|2|President:Carlos Prio Socarras
DOM|Dominican Republic|PRES|55|allies|2.4|0.3|President:Rafael Trujillo
HTI|Haiti|PRES|5|allies|3.2|0.25|President:Dumarsais Estime
COL|Colombia|PRES|30|allies|12|3.2|President:Mariano Ospina Perez|-|||Conservative Party
VEN|Venezuela|MJ|30|allies|5|3.5|Head of the Junta:Carlos Delgado Chalbaud
ECU|Ecuador|PRES|5|allies|3.4|0.5|President:Galo Plaza Lasso
PER|Peru|MJ|35|allies|7.6|1.3|President:Manuel A. Odria
BOL|Bolivia|PRES|15|allies|2.8|0.4|President:Mamerto Urriolagoitia
CHL|Chile|PRES|-5|allies|6.1|2.5|President:Gabriel Gonzalez Videla|-|||Radical Party
ARG|Argentina|PRES|15|non-aligned|17|12|President:Juan Peron|-|||Peronist Party
URY|Uruguay|PRES|-10|allies|2.2|1.2|President:Luis Batlle Berres|-|||Colorado Party
PRY|Paraguay|PRES|35|allies|1.4|0.15|President:Federico Chavez
BRA|Brazil|FR|5|allies|54|15|President:Eurico Gaspar Dutra
`) };
