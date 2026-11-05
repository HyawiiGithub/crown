var Xt=Object.defineProperty;var _t=(e,a,n)=>a in e?Xt(e,a,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[a]=n;var Qe=(e,a,n)=>_t(e,typeof a!="symbol"?a+"":a,n);const Qt={tickMs:2e3,growthSmoothing:.08,growthBias:1,okunSensitivity:.42,phillipsSensitivity:.35,inflationTarget:.02,policyRateSmoothing:.15,wagePush:.45,fiscalMultiplier:1.4,debtInterestBase:.018,debtInterestRisk:.06,bankruptcyThreshold:1.15,marketBeta:22,marketVolatility:.9,crashProbability:7e-4,tradeElasticity:1.6,warDamage:42e-5,crisisProbability:.0026,electionChaos:.1,corruptionDrag:.24,inequalityDrag:.18,sanctionBite:.55,corporateWeight:.42,whipStrength:.86,corruptionRate:16e-5,eventRate:1,seed:20260101},ei=e=>({...Qt,...e}),cn="'Iowan Old Style','Palatino Linotype',Palatino,'Book Antiqua',Georgia,serif",un="'Times New Roman',Times,'Liberation Serif',serif",mn="Futura,'Avenir Next','Century Gothic','URW Gothic','Trebuchet MS',sans-serif",ea="'Helvetica Neue',Helvetica,Arial,'Liberation Sans',sans-serif",ai="'Haettenschweiler','Arial Narrow','Arial Narrow Bold','Liberation Sans Narrow',Impact,sans-serif",Ae="'SF Mono','JetBrains Mono',Menlo,Consolas,'Liberation Mono',monospace",$e="'Inter','Segoe UI',system-ui,'Helvetica Neue',Arial,sans-serif",be=e=>ei(e),Nn=[{id:"1900",year:1900,name:"The Age of Empires",tagline:"Victoria reigns. The sun never sets, and every capital is a ledger.",description:"New Year's Day 1900. European empires hold most of the planet and Britain alone administers a quarter of humanity. The gold standard ties the world's money together, Boer commandos are besieging British garrisons in South Africa, and the Boxers are gathering in northern China. Every empire on this map believes it will last.",epoch:0,startDate:{year:1900,month:1,day:1},daysPerSecond:1,theme:{tokens:{"--bg":"#f3ede0","--bg-raised":"#fbf7ee","--bg-sunken":"#e7dfcd","--ink":"#1c1815","--ink-muted":"#5f564a","--rule":"#c9bda4","--accent":"#8a1c1c","--accent-2":"#9a7b28","--positive":"#2f5d3a","--negative":"#8a1c1c","--shadow":"0 1px 0 #c9bda4, 0 2px 6px rgba(60,45,20,.10)"},fontDisplay:cn,fontBody:cn,fontMono:Ae,ocean:"#e5e0d2",unclaimed:"#ddd5c2",stroke:"#a99b7f",texture:"vellum",masthead:"THE CROWN LEDGER"},params:be({seed:19000101,growthSmoothing:.1,marketVolatility:1.5,crashProbability:.0022,debtInterestBase:.03,inflationTarget:.005,eventRate:.7,whipStrength:.9,corporateWeight:.22,corruptionRate:26e-5}),overrides:{global:{commodityPrices:{gold:18.6,oil:.9,wheat:.42,copper:3.2,coal:.5,"iron-ore":.22},riskAppetite:52}},tags:["imperial","pre-suffrage","gold-standard","gunboat-diplomacy"]},{id:"1914",year:1914,name:"The War to End All Wars",tagline:"The Archduke is dead. It is June, and nobody in the counting houses believes a war is coming.",description:"28 June 1914. Archduke Franz Ferdinand has just been shot in Sarajevo. In a month Austria-Hungary will declare war on Serbia, and the alliance system will pull in Russia, Germany, France and Britain within days, unless you stop it. The gold standard and the longest era of globalisation yet are about to end.",epoch:0,startDate:{year:1914,month:6,day:28},daysPerSecond:1,theme:{tokens:{"--bg":"#d9cfb8","--bg-raised":"#ece4d2","--bg-sunken":"#c3b79c","--ink":"#241f18","--ink-muted":"#6b5f4b","--rule":"#9d9078","--accent":"#8d3b1f","--accent-2":"#4a5548","--positive":"#4a6b48","--negative":"#8d3b1f","--shadow":"0 2px 0 rgba(60,45,25,.18)"},fontDisplay:ai,fontBody:un,fontMono:Ae,ocean:"#cdc4ac",unclaimed:"#c8bfa6",stroke:"#8c7f66",texture:"newsprint",masthead:"THE WAR EDITION"},params:be({seed:19140628,growthSmoothing:.05,marketVolatility:3.4,crashProbability:.0012,debtInterestBase:.045,inflationTarget:.015,warDamage:85e-5,eventRate:1.3,fiscalMultiplier:1.9,debtInterestRisk:.12,bankruptcyThreshold:.9}),overrides:{global:{commodityPrices:{gold:18.6,oil:.9,wheat:.42,copper:3.2},riskAppetite:34}},tags:["total-war","empire","mobilisation","gold-standard"]},{id:"1930",year:1930,name:"The Interwar Years",tagline:"Wall Street crashed four months ago. Nobody yet knows how far this goes.",description:"March 1930. Wall Street crashed in October and most governments think the slump will be short. Germany's Grand Coalition is about to fall, Stalin is collectivising the Soviet countryside, and the gold standard forces countries to tighten into the downturn. The League of Nations still exists, and its mandates cover the Middle East.",epoch:0,startDate:{year:1930,month:3,day:1},daysPerSecond:1,theme:{tokens:{"--bg":"#14181c","--bg-raised":"#1d2329","--bg-sunken":"#0d1013","--ink":"#f0e6d2","--ink-muted":"#9aa3ab","--rule":"#3a444d","--accent":"#d4af5c","--accent-2":"#4fb3a8","--positive":"#4fb3a8","--negative":"#e0654f","--shadow":"0 0 0 1px rgba(212,175,92,.28)"},fontDisplay:mn,fontBody:un,fontMono:Ae,ocean:"#101418",unclaimed:"#232a31",stroke:"#4b5862",texture:"blueprint",masthead:"CROWN QUARTERLY"},params:be({seed:19300301,growthSmoothing:.06,marketVolatility:2.6,crashProbability:.001,debtInterestBase:.055,inflationTarget:0,debtInterestRisk:.11,bankruptcyThreshold:.95,warDamage:7e-4,eventRate:1.2}),overrides:{global:{commodityPrices:{gold:20.7,oil:.27,wheat:.44,copper:1.4,coal:.15},riskAppetite:28}},tags:["great-depression","mass-suffrage","mandates","art-deco"]},{id:"1950",year:1950,name:"The Early Cold War",tagline:"Germany exists twice, China has just gone red, and the Soviets have the bomb.",description:"New Year's Day 1950. NATO is nine months old, Marshall Plan money is rebuilding Western Europe, Mao has just taken China, and the Soviet Union tested its first bomb in August. Britain still rations food and still rules much of Africa. Korea will explode in June, and the great post-war boom is about to begin.",epoch:0,startDate:{year:1950,month:1,day:1},daysPerSecond:1,theme:{tokens:{"--bg":"#e6e8e4","--bg-raised":"#f4f5f2","--bg-sunken":"#d3d6d1","--ink":"#20262b","--ink-muted":"#5d666d","--rule":"#a8b0aa","--accent":"#9b2c22","--accent-2":"#2c4b6f","--positive":"#3d6b46","--negative":"#9b2c22","--shadow":"0 1px 2px rgba(20,30,40,.10)"},fontDisplay:ea,fontBody:ea,fontMono:Ae,ocean:"#d8dcd8",unclaimed:"#dfe2de",stroke:"#9aa29c",texture:"paper",masthead:"CROWN BUREAU"},params:be({seed:19500101,growthSmoothing:.09,marketVolatility:1.3,crashProbability:.0018,debtInterestBase:.035,inflationTarget:.015,corporateWeight:.3,eventRate:1.3,fiscalMultiplier:1.6,corruptionRate:2e-4}),overrides:{global:{commodityPrices:{gold:35,oil:2.9,wheat:1.2,copper:4.1,coal:3.4},riskAppetite:41}},tags:["cold-war","reconstruction","decolonisation","nato"]},{id:"1990",year:1990,name:"The Unipolar Moment",tagline:"Saddam has taken Kuwait. Germany reunifies next month. The Soviet Union is coming apart.",description:"2 September 1990. Iraq occupied Kuwait a month ago and a US-led coalition is massing in Saudi Arabia. Germany reunifies on 3 October. The Soviet Union still exists but its republics are declaring sovereignty one by one. Japan's bubble has just burst, and inflation is high across the West.",epoch:0,startDate:{year:1990,month:9,day:2},daysPerSecond:1,theme:{tokens:{"--bg":"#0b1220","--bg-raised":"#141e30","--bg-sunken":"#070d18","--ink":"#e8f0ff","--ink-muted":"#8ba0bf","--rule":"#24344d","--accent":"#39c5d8","--accent-2":"#7b6bff","--positive":"#3ddc97","--negative":"#ff6b6b","--shadow":"0 0 24px rgba(57,197,216,.14)"},fontDisplay:mn,fontBody:$e,fontMono:Ae,ocean:"#080f1c",unclaimed:"#16202f",stroke:"#2b3f5c",texture:"scan",masthead:"CROWN NETWORK"},params:be({seed:19900902,growthSmoothing:.1,marketVolatility:1.1,crashProbability:.0012,debtInterestBase:.065,inflationTarget:.03,eventRate:1.1,corporateWeight:.6,tradeElasticity:1.9}),overrides:{global:{commodityPrices:{gold:380,oil:24,wheat:4.6,copper:2.7},riskAppetite:66}},tags:["end-of-cold-war","gulf-crisis","reunification","globalisation"]},{id:"2010",year:2010,name:"After the Crash",tagline:"The banks have been bailed out. Now the markets are looking at the governments.",description:"New Year's Day 2010, fifteen months after Lehman Brothers. Unemployment is near 10% across the West, rates are at the floor, and China is leading the recovery with a giant stimulus. Greece has just admitted its deficit is far larger than reported, and the euro zone has no plan for what happens next.",epoch:0,startDate:{year:2010,month:1,day:1},daysPerSecond:1,theme:{tokens:{"--bg":"#f7f8fa","--bg-raised":"#ffffff","--bg-sunken":"#eceef2","--ink":"#151a21","--ink-muted":"#606b78","--rule":"#dfe3ea","--accent":"#2563eb","--accent-2":"#e11d48","--positive":"#0f9d58","--negative":"#e11d48","--shadow":"0 1px 3px rgba(20,30,50,.08)"},fontDisplay:ea,fontBody:$e,fontMono:Ae,ocean:"#eef2f7",unclaimed:"#e6eaf0",stroke:"#c9d2de",texture:"paper",masthead:"CROWN TERMINAL"},params:be({seed:20100101,growthSmoothing:.11,marketVolatility:1.25,crashProbability:.0026,debtInterestBase:.028,inflationTarget:.02,eventRate:1.2,corruptionDrag:.26}),overrides:{global:{commodityPrices:{gold:1420,oil:79,wheat:12,copper:83},riskAppetite:44}},tags:["great-recession","euro-crisis","sovereign-debt","china-rising"]},{id:"2020",year:2020,name:"The Pandemic",tagline:"Every projection says the same thing. None of them are believed.",description:"11 March 2020. The WHO has just declared a pandemic. Markets are in free fall, travel is stopping, and within weeks a third of humanity will be locked down. Global GDP is heading for its worst fall since the 1930s. Central banks and treasuries are about to respond on a wartime scale.",epoch:0,startDate:{year:2020,month:3,day:11},daysPerSecond:1,theme:{tokens:{"--bg":"#071018","--bg-raised":"#0d1a24","--bg-sunken":"#040a10","--ink":"#dff1f7","--ink-muted":"#6e8b9b","--rule":"#17303f","--accent":"#2dd4bf","--accent-2":"#f472b6","--positive":"#34d399","--negative":"#fb7185","--shadow":"0 0 20px rgba(45,212,191,.10)"},fontDisplay:$e,fontBody:$e,fontMono:Ae,ocean:"#050d15",unclaimed:"#0c1c26",stroke:"#1b3a4b",texture:"scan",masthead:"CROWN CRISIS DESK"},params:be({seed:20200311,growthSmoothing:.04,marketVolatility:3.2,crashProbability:.0012,debtInterestBase:.008,inflationTarget:.005,fiscalMultiplier:2.1,eventRate:1.2,crisisProbability:.003,corporateWeight:.55}),overrides:{global:{commodityPrices:{gold:1900,oil:24,wheat:8,copper:62},riskAppetite:12}},tags:["covid","lockdown","unprecedented-stimulus","supply-shock"]},{id:"2026",year:2026,name:"Present Day",tagline:"Trade blocs, sovereign debt, and a war nobody wants to fund.",description:"New Year's Day 2026. Tariffs are back, the war in Ukraine grinds on, US-China technology rivalry has hardened, European defence budgets are climbing, debt is high almost everywhere, and an AI boom is carrying the stock market. You start from here. Nothing after this point is written down.",epoch:0,startDate:{year:2026,month:1,day:1},daysPerSecond:1,theme:{tokens:{"--bg":"#09090b","--bg-raised":"#131318","--bg-sunken":"#050507","--ink":"#ededf0","--ink-muted":"#8b8b96","--rule":"#232329","--accent":"#f5f5f5","--accent-2":"#a78bfa","--positive":"#4ade80","--negative":"#f87171","--shadow":"0 0 0 1px #232329"},fontDisplay:ea,fontBody:$e,fontMono:Ae,ocean:"#060608",unclaimed:"#15151a",stroke:"#2a2a32",texture:"paper",masthead:"CROWN"},params:be({seed:20260101}),overrides:{global:{commodityPrices:{gold:4300,oil:62,wheat:210,copper:11e3,silver:70},riskAppetite:58}},tags:["great-power","sanctions","ai","debt"]}],ni=Object.fromEntries(Nn.map(e=>[e.id,e]));function ia(e){const a=ni[e];if(!a)throw new Error(`Unknown scenario "${e}". Known: ${Nn.map(n=>n.id).join(", ")}`);return a}const ga=["agriculture","mining","manufacturing","energy","utilities","construction","transport","retail","finance","real-estate","telecom","technology","healthcare","education","defence","tourism","media"],ti=`
004|AFG|AF|Afghanistan|AS|theocracy|34|66|-50|non-aligned|12,29,39,44|4,15,20,17
008|ALB|AL|Albania|EU|parliamentary-republic|41|20|-5|nato|3.3,2.9,2.8,2.7|2,12,15,27
012|DZA|DZ|Algeria|AF|semi-presidential-republic|28|3|-20|non-aligned|26,36,44,47|62,161,145,270
020|AND|AD|Andorra|EU|parliamentary-republic|42.5|1.5|5|none|0.05,0.08,0.08,0.08|1,3.4,2.9,4.3
024|AGO|AO|Angola|AF|presidential-republic|-12|18|-30|non-aligned|12,24,33,39|11,83,57,120
028|ATG|AG|Antigua and Barbuda|NA|constitutional-monarchy|17|-62|-5|latin-american|0.06,0.09,0.09,0.09|0.5,1.1,1.4,2.3
032|ARG|AR|Argentina|SA|presidential-republic|-35|-64|15|mercosur|33,41,45,46|141,424,386,660
051|ARM|AM|Armenia|AS|parliamentary-republic|40|45|-5|csto|3.5,2.9,3,3|2.3,9.3,12.6,27
036|AUS|AU|Australia|OC|constitutional-monarchy|-25|134|-6|none|17,22,26,28|311,1150,1330,1890
040|AUT|AT|Austria|EU|parliamentary-republic|48|14|8|european-union|7.7,8.4,8.9,9.2|166,392,435,560
031|AZE|AZ|Azerbaijan|AS|presidential-republic|40|48|20|non-aligned|7.2,9,10.1,10.3|9,52,43,78
044|BHS|BS|Bahamas|NA|constitutional-monarchy|24|-76|0|latin-american|0.26,0.36,0.39,0.4|3,10,10,16
048|BHR|BH|Bahrain|ME|absolute-monarchy|26|50|30|gulf-cooperation-council|0.5,1.2,1.5,1.6|4.2,26,35,50
050|BGD|BD|Bangladesh|AS|parliamentary-republic|24|90|-8|non-aligned|107,148,167,175|32,115,374,470
052|BRB|BB|Barbados|NA|parliamentary-republic|13|-60|-5|latin-american|0.26,0.28,0.28,0.28|1.7,4.5,4.7,7
112|BLR|BY|Belarus|EU|presidential-republic|53|28|-20|csto|10.2,9.5,9.4,9.1|17,57,61,80
056|BEL|BE|Belgium|EU|constitutional-monarchy|51|4|5|european-union|10,10.9,11.5,11.9|206,484,525,700
084|BLZ|BZ|Belize|NA|constitutional-monarchy|17|-89|0|latin-american|0.19,0.32,0.4,0.42|0.5,1.6,2.1,3.5
204|BEN|BJ|Benin|AF|presidential-republic|9|2|-5|au|5,9.4,12.6,14.5|2,10,16,23
064|BTN|BT|Bhutan|AS|constitutional-monarchy|27|90|0|non-aligned|0.55,0.7,0.77,0.8|0.3,1.6,2.3,3.2
068|BOL|BO|Bolivia|SA|presidential-republic|-17|-64|-20|non-aligned|7,10,11.9,12.6|5,20,37,50
070|BIH|BA|Bosnia and Herzegovina|EU|parliamentary-republic|44|18|0|none|4.5,3.7,3.3,3.1|9,17,20,31
072|BWA|BW|Botswana|AF|parliamentary-republic|-22|24|0|au|1.3,2,2.5,2.6|3.8,12.8,15,20
076|BRA|BR|Brazil|SA|presidential-republic|-10|-55|-12|brics|150,196,213,213|465,2209,1476,2300
096|BRN|BN|Brunei|AS|absolute-monarchy|4.5|114.7|30|asean|0.26,0.39,0.44,0.46|3.5,14,12,16
100|BGR|BG|Bulgaria|EU|parliamentary-republic|43|25|5|european-union|8.7,7.4,6.9,6.4|21,50,70,120
854|BFA|BF|Burkina Faso|AF|military-junta|12|-2|-20|non-aligned|8.8,15.6,21,24|3,10,18,24
108|BDI|BI|Burundi|AF|presidential-republic|-3.4|30|-20|au|5.4,8.7,12,14|1.1,2,2.6,3.4
116|KHM|KH|Cambodia|AS|constitutional-monarchy|13|105|5|asean|9,14,16.7,17.8|1.1,11,25,50
120|CMR|CM|Cameroon|AF|presidential-republic|6|12|5|au|12,20,26.5,29.5|15,27,40,56
124|CAN|CA|Canada|NA|constitutional-monarchy|57|-106|-8|nato|27.7,34,38,41|595,1617,1645,2280
132|CPV|CV|Cabo Verde|AF|semi-presidential-republic|16|-24|-5|au|0.3,0.5,0.55,0.53|0.4,1.7,1.7,3
140|CAF|CF|Central African Republic|AF|presidential-republic|7|21|-5|au|2.8,4.4,5,5.5|1.5,2,2.3,3
148|TCD|TD|Chad|AF|presidential-republic|15|19|5|non-aligned|6,12,16.4,19.5|1.7,10.7,11,20
152|CHL|CL|Chile|SA|presidential-republic|-33|-71|-8|none|13.2,17,19.3,19.8|33,218,254,350
156|CHN|CN|China|AS|one-party-state|35|104|-45|brics|1135,1338,1411,1408|361,6087,14688,20000
170|COL|CO|Colombia|SA|presidential-republic|4|-73|-15|none|33,45,50.9,53|47,287,270,420
174|COM|KM|Comoros|AF|presidential-republic|-12|44|5|au|0.4,0.65,0.8,0.87|0.4,0.9,1.2,1.6
178|COG|CG|Republic of the Congo|AF|presidential-republic|-1|15|-15|au|2.3,4.4,5.5,6.2|2.8,13,10.5,16
180|COD|CD|DR Congo|AF|semi-presidential-republic|-3|24|-5|au|34,64,90,110|9,21,48,80
188|CRI|CR|Costa Rica|NA|presidential-republic|10|-84|5|latin-american|3.1,4.6,5.1,5.2|7.4,37,62,100
191|HRV|HR|Croatia|EU|parliamentary-republic|45|16|8|european-union|4.8,4.4,4,3.9|25,60,58,100
192|CUB|CU|Cuba|NA|one-party-state|22|-80|-70|non-aligned|10.6,11.3,11.3,11|28,64,107,100
196|CYP|CY|Cyprus|EU|presidential-republic|35|33|0|european-union|0.77,1.1,1.2,1.3|5.6,25.6,25,40
203|CZE|CZ|Czechia|EU|parliamentary-republic|50|15|12|european-union|10.3,10.5,10.7,10.9|40,207,246,380
208|DNK|DK|Denmark|EU|constitutional-monarchy|56|10|-5|european-union|5.1,5.5,5.8,6|138,322,356,450
262|DJI|DJ|Djibouti|AF|presidential-republic|11.8|42.6|5|au|0.6,0.85,1,1.2|0.45,1.1,3.2,4.5
212|DMA|DM|Dominica|NA|parliamentary-republic|15.4|-61.3|-5|latin-american|0.07,0.07,0.07,0.07|0.2,0.5,0.5,0.7
214|DOM|DO|Dominican Republic|NA|presidential-republic|19|-70|5|latin-american|7.2,9.8,10.9,11.5|7,53,79,130
218|ECU|EC|Ecuador|SA|presidential-republic|-2|-78|12|non-aligned|10.2,15,17.6,18.4|15,70,100,130
818|EGY|EG|Egypt|ME|semi-presidential-republic|27|30|10|oic|57,83,107,118|43,219,383,350
222|SLV|SV|El Salvador|NA|presidential-republic|13.7|-89|25|latin-american|5.3,6.1,6.3,6.4|5,18,25,37
226|GNQ|GQ|Equatorial Guinea|AF|presidential-republic|1.6|10.5|20|au|0.4,0.95,1.6,1.9|0.1,12,10,13
232|ERI|ER|Eritrea|AF|one-party-state|15|39|-45|non-aligned|2.3,3.2,3.4,3.6|0.5,2.1,2.1,2.5
233|EST|EE|Estonia|EU|parliamentary-republic|59|26|12|european-union|1.57,1.33,1.33,1.37|6,19.5,31,47
748|SWZ|SZ|Eswatini|AF|absolute-monarchy|-26.5|31.5|30|au|0.85,1.1,1.16,1.24|1.1,4.4,3.9,5
231|ETH|ET|Ethiopia|AF|federal-republic|9|40|-5|brics|48,88,117,135|12,30,108,120
242|FJI|FJ|Fiji|OC|parliamentary-republic|-18|178|0|none|0.73,0.86,0.92,0.93|1.4,3.1,4.5,6
246|FIN|FI|Finland|EU|parliamentary-republic|64|26|5|european-union|5,5.4,5.5,5.6|141,249,272,320
250|FRA|FR|France|EU|semi-presidential-republic|47|2|0|european-union|58,65,67.5,68.5|1269,2647,2630,3300
266|GAB|GA|Gabon|AF|presidential-republic|-1|12|10|au|0.95,1.6,2.3,2.6|5.9,14,15,22
270|GMB|GM|Gambia|AF|presidential-republic|13.4|-15.5|0|au|0.9,1.8,2.5,2.8|0.3,1.5,1.8,2.7
268|GEO|GE|Georgia|AS|parliamentary-republic|42|43.5|10|none|4.8,3.8,3.7,3.7|7.7,12,16,35
276|DEU|DE|Germany|EU|parliamentary-republic|51|10|5|european-union|79,81,83,83.5|1772,3417,3890,5000
288|GHA|GH|Ghana|AF|presidential-republic|8|-1|-5|au|15,25,32,35|5.9,42,70,90
300|GRC|GR|Greece|EU|parliamentary-republic|39|22|10|european-union|10.2,11.1,10.7,10.4|98,300,189,285
308|GRD|GD|Grenada|NA|constitutional-monarchy|12.1|-61.7|0|latin-american|0.1,0.11,0.11,0.12|0.3,0.8,1,1.4
320|GTM|GT|Guatemala|NA|presidential-republic|15.5|-90|5|latin-american|9,14.6,16.9,18.4|7.6,41,78,120
324|GIN|GN|Guinea|AF|military-junta|10|-11|-5|au|6,10.2,13.2,14.8|2.7,6.9,14,27
624|GNB|GW|Guinea-Bissau|AF|semi-presidential-republic|12|-15|-5|au|1,1.6,2,2.2|0.3,0.85,1.4,2.3
328|GUY|GY|Guyana|SA|presidential-republic|5|-59|-5|latin-american|0.75,0.75,0.8,0.83|0.4,2.3,5.5,28
332|HTI|HT|Haiti|NA|semi-presidential-republic|19|-72|0|latin-american|7.1,9.8,11.3,11.9|3,12,15,27
340|HND|HN|Honduras|NA|presidential-republic|15|-86.5|-5|latin-american|4.9,8.3,9.9,10.8|3,16,24,38
344|HKG|HK|Hong Kong|AS|dependency|22.3|114.2|5|none|5.7,7,7.5,7.5|77,229,345,420
348|HUN|HU|Hungary|EU|parliamentary-republic|47|20|30|european-union|10.4,10,9.7,9.5|45,132,157,250
352|ISL|IS|Iceland|EU|parliamentary-republic|65|-18|0|nato|0.25,0.32,0.37,0.39|6.6,13.7,21.7,37
356|IND|IN|India|AS|parliamentary-republic|22|79|25|brics|873,1241,1396,1465|321,1675,2672,4200
360|IDN|ID|Indonesia|AS|presidential-republic|-2|118|5|asean|182,245,274,287|106,755,1059,1500
364|IRN|IR|Iran|ME|theocracy|32|53|40|brics|56,75,87,92|118,487,240,400
368|IRQ|IQ|Iraq|ME|parliamentary-republic|33|43|10|oic|18,30,42,47|48,138,184,270
372|IRL|IE|Ireland|EU|parliamentary-republic|53|-8|0|european-union|3.5,4.6,5,5.4|49,222,426,630
376|ISR|IL|Israel|ME|parliamentary-republic|31|35|25|none|4.7,7.6,9.2,10|59,234,413,610
380|ITA|IT|Italy|EU|parliamentary-republic|43|13|18|european-union|56.7,59.8,59.5,58.9|1181,2137,1907,2500
384|CIV|CI|Ivory Coast|AF|presidential-republic|7.5|-5.5|5|au|12,20.5,26.8,32|10.8,25,62,95
388|JAM|JM|Jamaica|NA|constitutional-monarchy|18|-77|5|latin-american|2.4,2.8,2.8,2.8|4.6,13,14,23
392|JPN|JP|Japan|AS|constitutional-monarchy|36|138|20|none|124,128,126,123|3185,5759,5048,4300
400|JOR|JO|Jordan|ME|constitutional-monarchy|31|36.5|10|oic|3.5,7.3,10.9,11.5|4.2,27,44,57
398|KAZ|KZ|Kazakhstan|AS|presidential-republic|48|68|5|csto|16.3,16.3,18.8,20.5|27,148,171,300
404|KEN|KE|Kenya|AF|presidential-republic|0|38|-5|au|23,42,52,57|8.6,45,100,135
296|KIR|KI|Kiribati|OC|presidential-republic|1.4|173|0|none|0.07,0.1,0.12,0.13|0.03,0.16,0.2,0.3
408|PRK|KP|North Korea|AS|one-party-state|40|127|-85|non-aligned|20,24.5,25.9,26.5|15,14,16,20
410|KOR|KR|South Korea|AS|presidential-republic|36.5|128|5|none|43,49.5,51.8,51.7|283,1144,1645,1900
414|KWT|KW|Kuwait|ME|constitutional-monarchy|29.3|47.6|25|gulf-cooperation-council|2,3,4.4,5|18,116,105,160
417|KGZ|KG|Kyrgyzstan|AS|presidential-republic|41.5|75|0|csto|4.4,5.4,6.6,7.2|2.7,4.8,7.8,18
418|LAO|LA|Laos|AS|one-party-state|18|105|-60|asean|4.2,6.3,7.3,7.8|0.9,7.1,19,16
428|LVA|LV|Latvia|EU|parliamentary-republic|57|25|12|european-union|2.66,2.1,1.9,1.85|12,24,35,46
422|LBN|LB|Lebanon|ME|parliamentary-republic|33.9|35.9|0|oic|2.7,4.9,5.7,5.8|2.8,38,25,25
426|LSO|LS|Lesotho|AF|constitutional-monarchy|-29.5|28.3|0|au|1.6,2,2.1,2.3|0.6,2.2,2,2.3
430|LBR|LR|Liberia|AF|presidential-republic|6.4|-9.4|5|au|2.1,3.9,5.1,5.7|0.4,1.3,3.5,5
434|LBY|LY|Libya|AF|presidential-republic|27|17|0|oic|4.4,6.2,6.9,7.5|28,75,29,50
438|LIE|LI|Liechtenstein|EU|constitutional-monarchy|47.1|9.5|15|none|0.03,0.036,0.039,0.04|1.4,5.1,6.1,7.5
440|LTU|LT|Lithuania|EU|parliamentary-republic|55.5|24|5|european-union|3.7,3.1,2.8,2.9|14,37,56,90
442|LUX|LU|Luxembourg|EU|constitutional-monarchy|49.8|6.1|5|european-union|0.38,0.51,0.63,0.68|13,54,74,95
450|MDG|MG|Madagascar|AF|semi-presidential-republic|-19|47|-5|au|11.6,21,27.7,32|3.1,9,13,18
454|MWI|MW|Malawi|AF|presidential-republic|-13.5|34|0|au|9.4,15,19.4,22|1.9,6.9,12,11
458|MYS|MY|Malaysia|AS|constitutional-monarchy|4|102|5|asean|18,28,33,35.5|44,255,337,470
462|MDV|MV|Maldives|AS|presidential-republic|3.2|73|5|none|0.22,0.37,0.5,0.53|0.3,2.6,3.7,7
466|MLI|ML|Mali|AF|military-junta|17|-4|-10|non-aligned|8.5,15,20,24.5|3.2,10.7,17.5,26
470|MLT|MT|Malta|EU|parliamentary-republic|35.9|14.4|-5|european-union|0.36,0.41,0.52,0.56|2.5,8.8,15,27
478|MRT|MR|Mauritania|AF|presidential-republic|20|-10|10|au|2,3.6,4.5,5.2|1.3,5.6,8,11
480|MUS|MU|Mauritius|AF|parliamentary-republic|-20.3|57.5|-5|au|1.06,1.25,1.27,1.26|2.8,10,11.4,16
484|MEX|MX|Mexico|NA|presidential-republic|23|-102|-12|usmca|81,112,126,131|263,1058,1120,1860
584|MHL|MH|Marshall Islands|OC|presidential-republic|7.1|171|0|none|0.05,0.05,0.04,0.04|0.08,0.17,0.24,0.28
583|FSM|FM|Micronesia|OC|presidential-republic|6.9|158|0|none|0.1,0.1,0.11,0.11|0.15,0.3,0.4,0.5
498|MDA|MD|Moldova|EU|parliamentary-republic|47|29|0|none|4.4,3.7,3.1,3|3.6,7,12,20
492|MCO|MC|Monaco|EU|constitutional-monarchy|43.7|7.4|20|none|0.03,0.035,0.039,0.039|2.5,5.4,6.8,10
496|MNG|MN|Mongolia|AS|semi-presidential-republic|47|105|0|none|2.2,2.7,3.3,3.5|2.6,7.2,13.3,25
499|MNE|ME|Montenegro|EU|parliamentary-republic|43|19|0|nato|0.6,0.62,0.62,0.62|1.3,4.1,4.8,9
504|MAR|MA|Morocco|AF|constitutional-monarchy|32|-6|15|oic|24.8,32,36.7,38.5|30,93,121,185
508|MOZ|MZ|Mozambique|AF|presidential-republic|-18|35|-20|au|13.4,23.7,31.2,35.6|2.5,10,14,23
104|MMR|MM|Myanmar|AS|military-junta|21|96|20|non-aligned|40,48,53.4,55|6,50,79,70
516|NAM|NA|Namibia|AF|presidential-republic|-22|17|-10|au|1.4,2.1,2.5,3|2.7,11,10.6,14
520|NRU|NR|Nauru|OC|parliamentary-republic|-0.5|166.9|0|none|0.009,0.01,0.012,0.012|0.03,0.05,0.13,0.17
524|NPL|NP|Nepal|AS|parliamentary-republic|28|84|-30|non-aligned|19,27,29.3,30|3.6,16,34,47
528|NLD|NL|Netherlands|EU|constitutional-monarchy|52|5|10|european-union|15,16.6,17.5,18|318,892,932,1250
554|NZL|NZ|New Zealand|OC|constitutional-monarchy|-41|174|8|none|3.4,4.4,5.1,5.3|45,146,213,270
558|NIC|NI|Nicaragua|NA|presidential-republic|13|-85|-55|non-aligned|4,5.8,6.7,7|1,8.8,12.6,20
562|NER|NE|Niger|AF|military-junta|17|8|-10|non-aligned|7.9,16.5,24,28|2.5,7,13.8,20
566|NGA|NG|Nigeria|AF|presidential-republic|9|8|5|au|95,160,208,237|55,363,432,290
807|MKD|MK|North Macedonia|EU|parliamentary-republic|41.6|21.7|5|nato|2,2.05,2.08,1.82|4.5,9.4,12.4,18
578|NOR|NO|Norway|EU|constitutional-monarchy|61|9|-8|nato|4.2,4.9,5.4,5.6|119,431,362,510
512|OMN|OM|Oman|ME|absolute-monarchy|21|57|25|gulf-cooperation-council|1.8,2.9,4.5,5.3|12,65,73,110
586|PAK|PK|Pakistan|AS|parliamentary-republic|30|70|15|sco|115,194,227,255|40,177,300,410
585|PLW|PW|Palau|OC|presidential-republic|7.5|134.6|0|none|0.015,0.018,0.018,0.018|0.08,0.17,0.26,0.32
275|PSE|PS|Palestine|ME|semi-presidential-republic|32|35.3|5|oic|2,3.8,4.8,5.4|2,10,16,15
591|PAN|PA|Panama|NA|presidential-republic|9|-80|10|latin-american|2.4,3.6,4.3,4.6|5.3,29,54,90
598|PNG|PG|Papua New Guinea|OC|constitutional-monarchy|-6|144|0|none|4.1,7.3,9.7,10.5|3.2,14,24,33
600|PRY|PY|Paraguay|SA|presidential-republic|-23|-58|25|mercosur|4.2,6.2,6.6,7|5.7,27,36,47
604|PER|PE|Peru|SA|presidential-republic|-10|-76|5|none|22,29,33,34.5|29,148,206,295
608|PHL|PH|Philippines|AS|presidential-republic|13|122|12|asean|62,94,110,116|44,208,362,500
616|POL|PL|Poland|EU|parliamentary-republic|52|19|15|european-union|38,38.3,37.9,37.3|66,480,600,950
620|PRT|PT|Portugal|EU|semi-presidential-republic|40|-8|5|european-union|10,10.6,10.3,10.6|79,238,229,320
630|PRI|PR|Puerto Rico|NA|dependency|18.2|-66.5|5|usmca|3.5,3.7,3.3,3.2|30,99,103,125
634|QAT|QA|Qatar|ME|absolute-monarchy|25|51|25|gulf-cooperation-council|0.47,1.8,2.8,3.1|7.4,125,144,225
642|ROU|RO|Romania|EU|semi-presidential-republic|46|25|5|european-union|23,20.3,19.3,19|38,170,251,420
643|RUS|RU|Russia|EU|semi-presidential-republic|61|90|30|brics|148,143,144,144|517,1525,1489,2200
646|RWA|RW|Rwanda|AF|presidential-republic|-2|30|-5|au|7.2,10.2,13.1,14.5|2.6,6.1,10.3,15
659|KNA|KN|Saint Kitts and Nevis|NA|constitutional-monarchy|17.3|-62.7|0|latin-american|0.04,0.05,0.05,0.05|0.16,0.7,0.9,1.1
662|LCA|LC|Saint Lucia|NA|constitutional-monarchy|13.9|-61|0|latin-american|0.14,0.17,0.18,0.18|0.4,1.4,1.6,2.6
670|VCT|VC|Saint Vincent and the Grenadines|NA|constitutional-monarchy|13.2|-61.2|0|latin-american|0.11,0.11,0.1,0.1|0.2,0.7,0.9,1.2
882|WSM|WS|Samoa|OC|parliamentary-republic|-13.8|-172|0|none|0.16,0.19,0.21,0.22|0.1,0.6,0.8,1
674|SMR|SM|San Marino|EU|parliamentary-republic|43.9|12.5|5|none|0.023,0.031,0.034,0.034|0.5,1.8,1.5,2.1
678|STP|ST|Sao Tome and Principe|AF|semi-presidential-republic|0.2|6.6|0|au|0.12,0.18,0.22,0.24|0.05,0.2,0.5,0.8
682|SAU|SA|Saudi Arabia|ME|absolute-monarchy|24|45|40|gulf-cooperation-council|16,27,35,36|117,528,734,1150
686|SEN|SN|Senegal|AF|presidential-republic|14.5|-14.5|-5|au|7.5,12.6,16.4,18.9|5.7,16,24.5,38
688|SRB|RS|Serbia|EU|parliamentary-republic|44|21|15|none|7.6,7.3,6.9,6.6|18,41,53,100
690|SYC|SC|Seychelles|AF|presidential-republic|-4.6|55.5|0|au|0.07,0.09,0.1,0.13|0.4,1,1.1,2.3
694|SLE|SL|Sierra Leone|AF|presidential-republic|8.5|-11.8|0|au|4.3,6.4,8.2,9|0.7,2.6,4.1,7.5
702|SGP|SG|Singapore|AS|parliamentary-republic|1.35|103.8|8|asean|3,5.1,5.7,6|38,240,345,560
703|SVK|SK|Slovakia|EU|parliamentary-republic|48.7|19.5|10|european-union|5.3,5.4,5.5,5.4|15,91,106,155
705|SVN|SI|Slovenia|EU|parliamentary-republic|46|15|0|european-union|2,2.05,2.1,2.1|13,48,53,80
090|SLB|SB|Solomon Islands|OC|constitutional-monarchy|-9|160|0|none|0.31,0.53,0.69,0.8|0.2,0.7,1.5,1.8
706|SOM|SO|Somalia|AF|federal-republic|5|46|10|oic|7.3,12,16.5,19.5|1,1.1,6.9,12
710|ZAF|ZA|South Africa|AF|parliamentary-republic|-29|24|-12|brics|37,51,59,64|112,375,338,430
728|SSD|SS|South Sudan|AF|presidential-republic|7|30|0|au|5.8,9.7,11,12|2,15,5,5
724|ESP|ES|Spain|EU|constitutional-monarchy|40|-4|-5|european-union|39,46.6,47.4,49|535,1423,1289,1800
144|LKA|LK|Sri Lanka|AS|semi-presidential-republic|7.5|81|-20|non-aligned|17,20.7,21.9,22|8,57,85,100
729|SDN|SD|Sudan|AF|military-junta|15|30|5|oic|20,34,44,50|13,65,27,40
740|SUR|SR|Suriname|SA|presidential-republic|4|-56|0|latin-american|0.4,0.53,0.6,0.64|0.4,4.4,2.9,5
752|SWE|SE|Sweden|EU|constitutional-monarchy|62|15|5|european-union|8.6,9.4,10.4,10.6|261,496,547,660
756|CHE|CH|Switzerland|EU|federal-republic|47|8|5|none|6.7,7.8,8.6,9|258,603,752,1000
760|SYR|SY|Syria|ME|presidential-republic|35|38|5|oic|12.4,21.4,20.8,24|12,60,20,25
158|TWN|TW|Taiwan|AS|semi-presidential-republic|24|121|-5|none|20,23.2,23.6,23.4|166,446,669,900
762|TJK|TJ|Tajikistan|AS|presidential-republic|39|71|5|csto|5.3,7.5,9.5,10.8|2.6,5.6,8.1,16
834|TZA|TZ|Tanzania|AF|presidential-republic|-6|35|-10|au|25,44,59.7,70|4.3,32,63,88
764|THA|TH|Thailand|AS|constitutional-monarchy|15|101|15|asean|56,67,70,71.5|85,341,500,560
626|TLS|TL|Timor-Leste|AS|semi-presidential-republic|-8.8|125.8|-5|none|0.75,1.1,1.3,1.4|0.2,0.9,1.9,2
768|TGO|TG|Togo|AF|presidential-republic|8.5|1|5|au|3.9,6.4,8.4,9.7|1.6,3.4,7.6,12
776|TON|TO|Tonga|OC|constitutional-monarchy|-21.2|-175.2|5|none|0.09,0.1,0.1,0.1|0.11,0.37,0.5,0.55
780|TTO|TT|Trinidad and Tobago|NA|parliamentary-republic|10.5|-61.3|0|latin-american|1.2,1.3,1.4,1.4|5,22,21,29
788|TUN|TN|Tunisia|AF|presidential-republic|34|9|5|oic|8.2,10.6,11.8,12.3|13,44,43,55
792|TUR|TR|Turkey|ME|presidential-republic|39|35|25|nato|54,73,84,87|207,777,720,1500
795|TKM|TM|Turkmenistan|AS|presidential-republic|39|59|20|non-aligned|3.7,5.1,6.2,7.5|3.2,22,45,85
800|UGA|UG|Uganda|AF|presidential-republic|1|32|5|au|17.5,32,45,51|4.3,20,38,60
804|UKR|UA|Ukraine|EU|semi-presidential-republic|49|32|5|none|52,45.9,44.1,37.5|81,136,157,205
784|ARE|AE|United Arab Emirates|ME|absolute-monarchy|24|54|25|gulf-cooperation-council|1.8,8.5,9.3,11.5|51,290,349,570
826|GBR|GB|United Kingdom|EU|constitutional-monarchy|54|-2|-5|nato|57.2,62.8,67,69.5|1093,2485,2700,3900
840|USA|US|United States|NA|presidential-republic|39|-98|15|nato|250,309,331,343|5963,15049,21354,31000
858|URY|UY|Uruguay|SA|presidential-republic|-33|-56|-10|mercosur|3.1,3.4,3.4,3.4|10,40,54,85
860|UZB|UZ|Uzbekistan|AS|presidential-republic|41|64|10|non-aligned|20.5,28.6,33.5,37|13,50,60,130
548|VUT|VU|Vanuatu|OC|parliamentary-republic|-16|167|0|none|0.15,0.24,0.31,0.34|0.15,0.68,0.9,1.2
336|VAT|VA|Vatican City|EU|theocracy|41.9|12.45|30|none|0.001,0.001,0.001,0.001|0.02,0.04,0.05,0.06
862|VEN|VE|Venezuela|SA|presidential-republic|7|-66|-60|non-aligned|19.8,28.4,28.5,28.5|48,393,110,110
704|VNM|VN|Vietnam|AS|one-party-state|16|107|-45|asean|68,88,97,102|6.5,116,347,500
887|YEM|YE|Yemen|ME|presidential-republic|15|47|15|oic|12,23,33,41|12,31,19,20
894|ZMB|ZM|Zambia|AF|presidential-republic|-13|28|-5|au|7.7,13.8,18.9,21.5|3.3,20,18,30
716|ZWE|ZW|Zimbabwe|AF|presidential-republic|-19|29|-20|au|10.1,12.8,15.7,17|8.8,12,21.5,45
`,ii={AF:{continent:"Africa",region:"africa"},AS:{continent:"Asia",region:"asia"},ME:{continent:"Asia",region:"middle-east"},EU:{continent:"Europe",region:"europe"},NA:{continent:"North America",region:"americas"},SA:{continent:"South America",region:"americas"},OC:{continent:"Oceania",region:"oceania"}},sa=ti.trim().split(`
`).map(e=>{const a=e.split("|"),n=ii[a[4]];return{numeric:a[0],iso3:a[1],iso2:a[2],name:a[3],continent:n.continent,region:n.region,government:a[5],lat:Number(a[6]),lon:Number(a[7]),ideology:Number(a[8]),bloc:a[9],pop:a[10].split(",").map(Number),gdp:a[11].split(",").map(Number)}}),Ge=Object.fromEntries(sa.map(e=>[e.iso3,e]));Object.fromEntries(sa.map(e=>[e.numeric,e]));sa.map(e=>e.iso3);const oi={Kosovo:"XKX","N. Cyprus":"CYN",Somaliland:"SML","W. Sahara":"ESH"},En={XKX:{name:"Kosovo",lat:42.6,lon:21,pop:[1.9,1.8,1.8,1.7],gdp:[1.5,5.8,7.7,11.5]},SML:{name:"Somaliland",lat:9.8,lon:45.5,pop:[1.5,3,4,4.5],gdp:[.3,.8,1.5,2]},ESH:{name:"Western Sahara",lat:24.5,lon:-13,pop:[.2,.5,.6,.6],gdp:[.1,.5,.9,1]}},fa={"Siachen Glacier":"IND","Indian Ocean Ter.":"AUS",XKX:"SRB",CYN:"CYP",SML:"SOM",ESH:"MAR",304:"DNK",234:"DNK","016":"USA",316:"USA",580:"USA",850:"USA","060":"GBR","092":"GBR",136:"GBR",238:"GBR",239:"GBR","086":"GBR",654:"GBR",612:"GBR",660:"GBR",796:"GBR",500:"GBR",831:"GBR",832:"GBR",833:"GBR",184:"NZL",570:"NZL",574:"AUS",334:"AUS",533:"NLD",531:"NLD",534:"NLD",258:"FRA",260:"FRA",540:"FRA",652:"FRA",663:"FRA",666:"FRA",876:"FRA",248:"FIN",446:"CHN"};function ri(e){let a=0;for(let t=0;t<e.length;t++)a=a*31+e.charCodeAt(t)|0;const n=Math.abs(a)%360,i=26+Math.abs(a>>8)%16,s=44+Math.abs(a>>16)%14;return`hsl(${n} ${i}% ${s}%)`}const dn={"absolute-monarchy":{hos:"Monarch",hog:"Chief Minister"},"constitutional-monarchy":{hos:"Monarch",hog:"Prime Minister"},"parliamentary-republic":{hos:"President",hog:"Prime Minister"},"semi-presidential-republic":{hos:"President",hog:"Prime Minister"},"presidential-republic":{hos:"President",hog:"President"},"one-party-state":{hos:"Party Leader",hog:"Premier"},"military-junta":{hos:"Head of the Junta",hog:"Prime Minister"},"monarchy-absolute-colonial":{hos:"Colonial Governor",hog:"Resident"},"federal-republic":{hos:"President",hog:"President"},theocracy:{hos:"Supreme Leader",hog:"President"},confederation:{hos:"President",hog:"President"},protectorate:{hos:"Resident-General",hog:"Native Ruler"},"mandate-colony":{hos:"High Commissioner",hog:"Administrator"},dependency:{hos:"Governor",hog:"Chief Secretary"},"occupied-territory":{hos:"Occupation Authority",hog:"Military Governor"},"breakaway-state":{hos:"President",hog:"Prime Minister"}},Me={agriculture:{id:"agriculture",label:"Agriculture & Fishing",blurb:"Crops, livestock and fisheries. Low productivity, high weather risk, politically explosive when it fails.",growth:.011,capitalIntensity:.25,labourIntensity:2.4,cyclicality:.08,commodityExposure:.45,techIntensity:.05,sanctionExposure:.05,margin:.09},mining:{id:"mining",label:"Mining & Extraction",blurb:"Iron, copper, coal, oil and gas extraction. Enormous rents, enormous environmental cost, rents attract war.",growth:.014,capitalIntensity:.7,labourIntensity:.4,cyclicality:.35,commodityExposure:.95,techIntensity:.12,sanctionExposure:.2,margin:.31},manufacturing:{id:"manufacturing",label:"Manufacturing",blurb:"Factories, assembly and heavy industry. The classic industrial ladder: labour arbitrage then automation.",growth:.026,capitalIntensity:.55,labourIntensity:1.1,cyclicality:.62,commodityExposure:.3,techIntensity:.35,sanctionExposure:.35,margin:.12},energy:{id:"energy",label:"Energy & Utilities",blurb:"Power generation, grids, refining. Natural monopoly, regulated returns, huge capex.",growth:.017,capitalIntensity:.85,labourIntensity:.5,cyclicality:.3,commodityExposure:.8,techIntensity:.2,sanctionExposure:.3,margin:.18},utilities:{id:"utilities",label:"Water & Gas Utilities",blurb:"Essential services with regulated tariffs.",growth:.021,capitalIntensity:.6,labourIntensity:.7,cyclicality:.1,commodityExposure:.2,techIntensity:.1,sanctionExposure:.05,margin:.22},construction:{id:"construction",label:"Construction & Real Estate",blurb:"Buildings, infrastructure, housing. Boom-and-bust on a seven to ten year cycle.",growth:.031,capitalIntensity:.5,labourIntensity:1.3,cyclicality:.9,commodityExposure:.25,techIntensity:.08,sanctionExposure:.05,margin:.11},transport:{id:"transport",label:"Transport & Logistics",blurb:"Rail, road, shipping, aviation. Strategic, and chokepoints are how you strangle an economy.",growth:.028,capitalIntensity:.75,labourIntensity:.8,cyclicality:.7,commodityExposure:.35,techIntensity:.15,sanctionExposure:.25,margin:.14},retail:{id:"retail",label:"Retail & Consumer",blurb:"Shops, e-commerce, consumer goods. Where consumer confidence becomes or destroys GDP.",growth:.029,capitalIntensity:.2,labourIntensity:1.9,cyclicality:.55,commodityExposure:.2,techIntensity:.12,sanctionExposure:.05,margin:.1},finance:{id:"finance",label:"Finance & Insurance",blurb:"Banks, insurers, asset managers. Leverage turns this sector into the fastest way to crash an economy.",growth:.033,capitalIntensity:.4,labourIntensity:.9,cyclicality:.85,commodityExposure:.1,techIntensity:.4,sanctionExposure:.4,margin:.26},"real-estate":{id:"real-estate",label:"Real Estate",blurb:"Property markets. Self-reinforcing until it is not.",growth:.03,capitalIntensity:.65,labourIntensity:.6,cyclicality:.88,commodityExposure:.15,techIntensity:.1,sanctionExposure:.05,margin:.19},telecom:{id:"telecom",label:"Telecommunications",blurb:"Networks and carriers. Winner-take-most, and a sovereignty issue.",growth:.038,capitalIntensity:.7,labourIntensity:.5,cyclicality:.25,commodityExposure:.05,techIntensity:.7,sanctionExposure:.35,margin:.24},technology:{id:"technology",label:"Technology & Software",blurb:"Semiconductors, software, platforms. The productivity engine, and the export-control battlefield.",growth:.072,capitalIntensity:.45,labourIntensity:.35,cyclicality:.6,commodityExposure:.1,techIntensity:.95,sanctionExposure:.85,margin:.29},healthcare:{id:"healthcare",label:"Healthcare & Pharma",blurb:"Hospitals, medicine, biotech. Politically defended spending, reliable growth.",growth:.043,capitalIntensity:.5,labourIntensity:1.1,cyclicality:.15,commodityExposure:.15,techIntensity:.65,sanctionExposure:.25,margin:.21},education:{id:"education",label:"Education & Research",blurb:"Schools, universities, public research. The multiplier that shows up thirty years late.",growth:.036,capitalIntensity:.35,labourIntensity:1.4,cyclicality:.08,commodityExposure:.05,techIntensity:.85,sanctionExposure:.05,margin:.15},defence:{id:"defence",label:"Defence Industry",blurb:"Arms, munitions, aerospace. Political economy: a private sector fed entirely by the state.",growth:.024,capitalIntensity:.6,labourIntensity:.7,cyclicality:.15,commodityExposure:.3,techIntensity:.55,sanctionExposure:.1,margin:.16},tourism:{id:"tourism",label:"Tourism & Hospitality",blurb:"Hotels, airlines, leisure. Collapses instantly in a pandemic or a war, rebounds just as fast.",growth:.035,capitalIntensity:.35,labourIntensity:1.7,cyclicality:.75,commodityExposure:.2,techIntensity:.08,sanctionExposure:.3,margin:.14},media:{id:"media",label:"Media & Publishing",blurb:"Broadcast, press, streaming. Soft power, and a lever for whoever owns the narrative.",growth:.03,capitalIntensity:.3,labourIntensity:.9,cyclicality:.45,commodityExposure:.05,techIntensity:.5,sanctionExposure:.2,margin:.18}},hn={agrarian:{id:"agrarian",label:"Agrarian",mix:{agriculture:.52,mining:.07,manufacturing:.11,construction:.06,transport:.04,retail:.09,education:.03,healthcare:.02,defence:.02,energy:.02,utilities:.02},productivity:.28,rd:.0012,corruption:.42,unionisation:.16,openness:.18,stateOwnership:.16,unemployment:.07},resource:{id:"resource",label:"Resource State",mix:{mining:.46,energy:.14,agriculture:.08,manufacturing:.07,construction:.05,transport:.05,retail:.06,utilities:.03,defence:.03,healthcare:.02,education:.01},productivity:.42,rd:.0018,corruption:.48,unionisation:.2,openness:.32,stateOwnership:.52,unemployment:.09},industrial:{id:"industrial",label:"Industrial",mix:{manufacturing:.31,mining:.09,agriculture:.06,energy:.08,utilities:.05,construction:.09,transport:.1,retail:.09,finance:.06,technology:.04,healthcare:.02,education:.01},productivity:.56,rd:.008,corruption:.3,unionisation:.5,openness:.48,stateOwnership:.24,unemployment:.06},mixed:{id:"mixed",label:"Mixed Economy",mix:{manufacturing:.18,agriculture:.08,mining:.06,energy:.07,utilities:.05,construction:.11,transport:.1,retail:.13,finance:.11,"real-estate":.05,telecom:.02,technology:.02,healthcare:.01,education:.01},productivity:.62,rd:.012,corruption:.24,unionisation:.36,openness:.55,stateOwnership:.2,unemployment:.05},service:{id:"service",label:"Advanced Services",mix:{finance:.19,retail:.13,technology:.13,healthcare:.11,education:.08,"real-estate":.1,tourism:.06,telecom:.05,media:.04,manufacturing:.05,energy:.03,utilities:.03},productivity:.82,rd:.028,corruption:.16,unionisation:.3,openness:.62,stateOwnership:.13,unemployment:.045},postindustrial:{id:"postindustrial",label:"Post-Industrial",mix:{finance:.22,technology:.17,healthcare:.13,"real-estate":.11,education:.09,retail:.09,telecom:.06,media:.05,tourism:.04,manufacturing:.04},productivity:.95,rd:.042,corruption:.13,unionisation:.26,openness:.68,stateOwnership:.11,unemployment:.04},planned:{id:"planned",label:"Centrally Planned",mix:{manufacturing:.4,mining:.13,agriculture:.14,energy:.12,construction:.09,transport:.07,utilities:.03,defence:.02},productivity:.48,rd:.014,corruption:.22,unionisation:.72,openness:.12,stateOwnership:.86,unemployment:.05},command:{id:"command",label:"Command Economy",mix:{manufacturing:.34,mining:.11,agriculture:.2,energy:.1,construction:.1,transport:.06,defence:.06,utilities:.03},productivity:.36,rd:.009,corruption:.55,unionisation:.8,openness:.07,stateOwnership:.94,unemployment:.06},oilstate:{id:"oilstate",label:"Oil State",mix:{mining:.38,energy:.2,construction:.11,transport:.06,utilities:.05,manufacturing:.05,retail:.06,healthcare:.04,education:.03,agriculture:.02},productivity:.5,rd:.004,corruption:.44,unionisation:.26,openness:.34,stateOwnership:.6,unemployment:.06},taxhaven:{id:"taxhaven",label:"Financial Centre",mix:{finance:.34,"real-estate":.16,retail:.09,tourism:.12,technology:.08,telecom:.06,media:.04,healthcare:.03,education:.02,manufacturing:.03,utilities:.03},productivity:.9,rd:.008,corruption:.18,unionisation:.12,openness:.94,stateOwnership:.05,unemployment:.035},autarkic:{id:"autarkic",label:"Autarkic",mix:{agriculture:.34,manufacturing:.24,mining:.1,energy:.1,utilities:.05,construction:.08,transport:.05,defence:.04},productivity:.33,rd:.003,corruption:.46,unionisation:.34,openness:.06,stateOwnership:.78,unemployment:.05},sanctuary:{id:"sanctuary",label:"Tax Haven / Microstate",mix:{finance:.3,tourism:.2,retail:.14,"real-estate":.12,transport:.08,utilities:.05,technology:.05,healthcare:.03,education:.02,media:.01},productivity:.72,rd:.006,corruption:.2,unionisation:.18,openness:.88,stateOwnership:.08,unemployment:.04}},si={oil:78,gold:2450,wheat:240,copper:9500,"natural-gas":3.4,coffee:4200,"iron-ore":108,coal:132,aluminium:2600,lithium:13500,uranium:92,silver:31},li=[{id:"nyse",name:"New York Stock Exchange",country:"USA",currency:"USD"},{id:"nasdaq",name:"NASDAQ",country:"USA",currency:"USD"},{id:"lse",name:"London Stock Exchange",country:"GBR",currency:"GBP"},{id:"euronext",name:"Euronext",country:"FRA",currency:"EUR"},{id:"dax",name:"Deutsche Börse",country:"DEU",currency:"EUR"},{id:"nikkei",name:"Nikkei 225",country:"JPN",currency:"JPY"},{id:"sse",name:"Shanghai Stock Exchange",country:"CHN",currency:"CNY"},{id:"twse",name:"Taiwan Stock Exchange",country:"TWN",currency:"TWD"},{id:"hkg",name:"Hong Kong Stock Exchange",country:"HKG",currency:"HKD"},{id:"krx",name:"Korea Exchange",country:"KOR",currency:"KRW"},{id:"nse",name:"National Stock Exchange of India",country:"IND",currency:"INR"},{id:"b3",name:"B3 / Brasil Bolsa Balcão",country:"BRA",currency:"BRL"},{id:"tsx",name:"Toronto Stock Exchange",country:"CAN",currency:"CAD"},{id:"asx",name:"Australian Securities Exchange",country:"AUS",currency:"AUD"},{id:"jse",name:"Johannesburg Stock Exchange",country:"ZAF",currency:"ZAR"},{id:"bmv",name:"Bolsa Mexicana de Valores",country:"MEX",currency:"MXN"},{id:"sgx",name:"Singapore Exchange",country:"SGP",currency:"SGD"},{id:"tadawul",name:"Tadawul",country:"SAU",currency:"SAR"},{id:"moex",name:"Moscow Exchange",country:"RUS",currency:"RUB"},{id:"idx",name:"Indonesia Stock Exchange",country:"IDN",currency:"IDR"},{id:"set",name:"Stock Exchange of Thailand",country:"THA",currency:"THB"}],ci={T:"technology",F:"finance",E:"energy",M:"manufacturing",R:"retail",H:"healthcare",N:"mining",K:"transport",D:"defence",C:"telecom",A:"media",B:"construction",G:"agriculture",U:"utilities"};function ve(e){return e.trim().split(`
`).filter(a=>a.trim()).map(a=>{const n=a.split("|").map(i=>i.trim());return{name:n[0],country:n[1],sector:ci[n[2]],revenue:Number(n[3])*1e9,employees:Math.round(Number(n[4])*1e3),listed:!!n[5],exchange:n[5]||void 0,stateOwnership:n[6]?Number(n[6]):0,foundedYear:n[7]?Number(n[7]):void 0}})}const ui=ve(`
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
`),mi=ve(`
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
`),di=ve(`
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
`),hi=ve(`
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
`),pi=ve(`
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
`),yi=ve(`
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
`),gi=ve(`
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
`),Gn=ve(`
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
`),fi={1900:ui,1914:mi,1930:di,1950:hi,1990:pi,2010:yi,2020:gi,2026:Gn};function Pi(e){return fi[e]??Gn}const V=(e,a,n,i,s,t,o,r,l,u)=>({name:e,startedAt:0,phase:"war",cause:a,belligerents:Object.fromEntries([[n[0],n.slice(1)],[i[0],i.slice(1)]]),fronts:[{name:s,belligerents:[n[0],i[0]],control:o,terrain:t}],exhaustion:{[n[0]]:r,[i[0]]:l},casualties:{},warGoal:u}),Si={"Russo-Ukrainian War":{axis:[39,45,25,51.5]},"Sudanese Civil War":{axis:[22,13,36,18]},"Myanmar Civil War":{axis:[101,23,95,17]},"Syrian Civil War":{axis:[36,37,40,33]},"Yemeni Civil War":{axis:[43.5,16.5,50,14]},"War in Afghanistan":{axis:[69,30,67,37]},"Libyan Civil War":{axis:[22,30,11,32]},"War in Somalia":{axis:[42,0,47,8]},"Iraq Insurgency":{axis:[41,35,46,31]},"Afghan Civil War":{axis:[71,36,64,32]},"Ethiopian Civil War":{axis:[39,16,39,7]},"Liberian Civil War":{axis:[-8,7.5,-11,6]},"Gulf Crisis":{theatre:"none"},"Second Boer War":{theatre:"CPC",axis:[30,-26,19,-33]},"Philippine-American War":{theatre:"UOT"},"Mexican Revolution":{axis:[-108,30,-96,17]},"Thousand Days' War":{axis:[-72,7,-77,3]},"Central Plains War":{axis:[112,37,118,30]},"Pacification of Libya":{theatre:"ICO",axis:[24,31,12,30]},"First Indochina War":{theatre:"IDC",axis:[105,23,107,11]},"Malayan Emergency":{theatre:"BMA",axis:[102,6,104,1.5]}},Ai={1900:[V("Second Boer War","The franchise of the uitlanders in the Transvaal and British claims over the goldfields.",["GBR","CPC","CAN","AUC","NZL"],["SAR","OFS"],"Natal and the Veld","plains",-10,15,25,"Annex the Boer republics."),V("Philippine-American War","The United States refused to recognise Philippine independence after the war with Spain.",["USA","UOT"],["PHL_REB"],"Luzon","forest",35,8,40,"Suppress the First Philippine Republic."),V("Thousand Days' War","Liberal revolt against the Conservative government of Colombia.",["COL"],["COL_REB"],"Santander","mountain",20,30,40,"Hold the Conservative regime together.")],1914:[V("Mexican Revolution","Constitutionalists and peasant armies rose after Huerta seized power in 1913.",["MEX"],["MEX_REB"],"Northern Mexico","desert",-45,55,30,"Keep Huerta in power.")],1930:[V("Central Plains War","Regional warlords revolted against Chiang Kai-shek's disbandment of their armies.",["CHN"],["CHN_REB"],"Henan","plains",10,25,30,"Finish the unification of China under Nanjing."),V("Pacification of Libya","Senussi resistance led by Omar Mukhtar against Italian rule.",["ITA","ICO"],["LBY_REB"],"Cyrenaica","desert",40,10,45,"End resistance in Cyrenaica.")],1950:[V("First Indochina War","The Viet Minh are fighting to end French rule over Indochina.",["FRA","IDC"],["DRV"],"Tonkin","forest",-5,30,25,"Hold Indochina for the French Union."),V("Malayan Emergency","Communist insurgency against British rule in Malaya.",["GBR","BMA"],["MLY_REB"],"Malayan Jungle","forest",15,6,30,"Destroy the Malayan National Liberation Army.")],1990:[V("Gulf Crisis","Iraq invaded and annexed Kuwait on 2 August. A US-led coalition is massing in Saudi Arabia.",["IRQ"],["USA","GBR","FRA","SAU","EGY"],"Kuwait","desert",80,40,3,"Force Iraq out of Kuwait, or hold what has been taken."),V("Afghan Civil War","The mujahideen continue to fight the Soviet-backed government after the Soviet withdrawal.",["AFG"],["AFG_REB"],"Afghan Highlands","mountain",10,60,50,"Survive without Soviet troops."),V("Liberian Civil War","Charles Taylor's rebels and factions are fighting for Monrovia.",["LBR"],["LBR_REB"],"Monrovia","urban",-30,60,40,"Control Monrovia."),V("Ethiopian Civil War","Eritrean and Tigrayan fronts are closing in on the Derg.",["ETH"],["ETH_REB"],"Tigray and Eritrea","mountain",-40,70,40,"Preserve the Derg regime.")],2010:[V("War in Afghanistan","NATO forces are fighting the Taliban insurgency, with a troop surge under way.",["USA","GBR","CAN","DEU","AFG"],["AFG_REB"],"Helmand and Kandahar","mountain",20,28,40,"Stabilise the Afghan government."),V("Iraq Insurgency","US forces are drawing down while sectarian insurgents remain active.",["USA","IRQ"],["IRQ_REB"],"Baghdad","urban",50,45,55,"Hand security to Iraqi forces."),V("War in Somalia","Al-Shabaab controls much of the south against the Transitional Federal Government.",["SOM","ETH","UGA"],["SOM_REB"],"Mogadishu","urban",-20,55,30,"Hold Mogadishu.")],2020:[V("Syrian Civil War","Assad's government, backed by Russia and Iran, is fighting the last rebel holdouts in Idlib.",["SYR","RUS","IRN"],["SYR_REB","TUR"],"Idlib","urban",65,70,60,"Reconquer Syria."),V("Yemeni Civil War","The Saudi-led coalition is fighting the Houthis, who hold Sanaa.",["SAU","YEM","ARE"],["YEM_REB"],"Marib","desert",30,55,45,"Restore the recognised government."),V("War in Afghanistan","Peace talks with the Taliban have begun under the February Doha agreement.",["USA","AFG"],["AFG_REB"],"Afghan Provinces","mountain",-10,65,45,"Withdraw without collapse."),V("Libyan Civil War","Haftar's forces are besieging Tripoli.",["LBY","TUR"],["LBY_REB"],"Tripoli","urban",5,45,40,"Hold Tripoli.")],2026:[V("Russo-Ukrainian War","Russia launched a full-scale invasion of Ukraine in February 2022.",["RUS"],["UKR"],"Donbas and Zaporizhzhia","plains",19.5,58,62,"Force a settlement on the current line, or restore Ukraine's borders."),V("Sudanese Civil War","The Sudanese Armed Forces and Rapid Support Forces have fought since April 2023.",["SDN"],["SDN_REB"],"Darfur and Kordofan","desert",10,70,65,"Defeat the Rapid Support Forces."),V("Myanmar Civil War","Resistance forces and ethnic armies are fighting the junta.",["MMR"],["MMR_REB"],"Shan and Sagaing","forest",-15,60,50,"Keep the junta in power.")]},I=(e,a,n,i)=>({name:e,kind:a,parties:n.split(" "),terms:[i]}),bi={1900:[I("Triple Alliance","defensive-pact","DEU AUT ITA","Mutual defence against France and Russia."),I("Franco-Russian Alliance","alliance","FRA RUS","Mutual defence against the Triple Alliance.")],1914:[I("Triple Alliance","defensive-pact","DEU AUT ITA","Mutual defence; renewed in 1912."),I("Triple Entente","entente","GBR FRA RUS","Understanding between Britain, France and Russia."),I("Anglo-Japanese Alliance","alliance","GBR JPN","Mutual aid in East Asia."),I("Treaty of London","access","GBR FRA DEU BEL","Guarantee of Belgian neutrality."),I("Serbian-Russian Understanding","entente","SRB RUS","Russian patronage of Serbia.")],1930:[I("Locarno Treaties","non-aggression","DEU FRA BEL GBR ITA","Guarantee of the Rhine frontier."),I("Little Entente","defensive-pact","CSK ROU YUG","Mutual defence against Hungarian revisionism."),I("Franco-Polish Alliance","alliance","FRA POL","Mutual defence.")],1950:[I("North Atlantic Treaty","defensive-pact","USA CAN GBR FRA ITA BEL NLD LUX DNK NOR ISL PRT","An attack on one is an attack on all."),I("Sino-Soviet Friendship Negotiations","alliance","USS CHN","Mao is in Moscow negotiating the treaty of alliance."),I("Comecon","customs-union","USS POL CSK HUN ROU BGR ALB","Socialist economic coordination.")],1990:[I("North Atlantic Treaty","defensive-pact","USA CAN GBR FRA DEU ITA BEL NLD LUX DNK NOR ISL PRT ESP GRC TUR","An attack on one is an attack on all."),I("Warsaw Pact","defensive-pact","USS POL CSK HUN ROU BGR","Fading fast; it dissolves next year."),I("European Communities","customs-union","BEL DNK FRA DEU GRC IRL ITA LUX NLD PRT ESP GBR","Single market programme."),I("US-Japan Security Treaty","alliance","USA JPN","Mutual cooperation and security.")],2010:[I("North Atlantic Treaty","defensive-pact","USA CAN GBR FRA DEU ITA BEL NLD LUX DNK NOR ISL PRT ESP GRC TUR POL CZE HUN BGR EST LVA LTU ROU SVK SVN ALB HRV","Collective defence."),I("European Union","customs-union","BEL DNK FRA DEU GRC IRL ITA LUX NLD PRT ESP GBR AUT FIN SWE CYP CZE EST HUN LVA LTU MLT POL SVK SVN BGR ROU","Single market."),I("NAFTA","trade","USA CAN MEX","North American free trade."),I("US-Japan Security Treaty","alliance","USA JPN","Mutual cooperation and security."),I("US-ROK Mutual Defense Treaty","alliance","USA KOR","Mutual defence.")],2020:[I("North Atlantic Treaty","defensive-pact","USA CAN GBR FRA DEU ITA BEL NLD LUX DNK NOR ISL PRT ESP GRC TUR POL CZE HUN BGR EST LVA LTU ROU SVK SVN ALB HRV MNE","Collective defence."),I("European Union","customs-union","BEL DNK FRA DEU GRC IRL ITA LUX NLD PRT ESP AUT FIN SWE CYP CZE EST HUN LVA LTU MLT POL SVK SVN BGR ROU HRV","Single market."),I("USMCA","trade","USA CAN MEX","North American trade; enters into force in July."),I("US-Japan Security Treaty","alliance","USA JPN","Mutual cooperation and security."),I("US-ROK Mutual Defense Treaty","alliance","USA KOR","Mutual defence.")],2026:[I("North Atlantic Treaty","defensive-pact","USA CAN GBR FRA DEU ITA BEL NLD LUX DNK NOR ISL PRT ESP GRC TUR POL CZE HUN BGR EST LVA LTU ROU SVK SVN ALB HRV MNE MKD FIN SWE","Collective defence."),I("European Union","customs-union","BEL DNK FRA DEU GRC IRL ITA LUX NLD PRT ESP AUT FIN SWE CYP CZE EST HUN LVA LTU MLT POL SVK SVN BGR ROU HRV","Single market."),I("USMCA","trade","USA CAN MEX","North American trade."),I("CSTO","defensive-pact","RUS BLR KAZ KGZ TJK ARM","Collective security."),I("US-Japan Security Treaty","alliance","USA JPN","Mutual cooperation and security."),I("US-ROK Mutual Defense Treaty","alliance","USA KOR","Mutual defence."),I("AUKUS","alliance","USA GBR AUS","Trilateral security pact."),I("Russia-North Korea Strategic Partnership","alliance","RUS PRK","Mutual assistance treaty signed in 2024.")]},E=(e,a,n,i,s)=>({id:e,name:a,owner:n,hosts:i,ring:s}),kn=[[13.8,55.1],[19,55.1],[22.9,55.3],[23,54.2],[21.9,53.5],[20,53.15],[19.2,52.95],[18.7,52.55],[18,52.15],[18.1,51.2],[19.1,50.35],[18.3,49.9],[14.5,50.7]],Dn=[[19.3,54.3],[22.9,54.3],[22.9,55.5],[19.3,55.5]],Bn=[[20.8,55],[22.4,55],[22.4,56],[20.8,56]],Tn=[[19.1,49.1],[19.1,50.05],[21,50.4],[22.7,50.45],[24.1,50.8],[26.1,50],[26.4,48.6],[24.9,48.2],[22.8,49],[20.5,49.35]],Ba=[[24.9,48.25],[26.7,48.3],[26.5,47.5],[25,47.4]],Ta=[[22.1,49.1],[24.9,48.25],[24.2,47.8],[22,48]],In=[[22.8,48],[24.9,47.8],[25.3,47.2],[26.1,46.6],[26.4,45.7],[25.5,45.35],[24,45.35],[22.7,45],[22.4,44.55],[21.2,44.6],[20,45.9],[21,47.3]],Un=[[18.7,46.3],[20.9,46.3],[21.6,45.2],[20.4,44.85],[19,44.9]],Ln=[[10.3,47.2],[12.6,47.2],[12,45.9],[10.5,45.65]],Ia=[[13.2,46.5],[14.1,46.4],[14,45.3],[13.2,45.6]],On=[[5.85,49.6],[8.3,49.1],[7.65,47.5],[6.8,47.5],[6.95,48.35],[5.85,48.85]],xn=[[8.3,55.55],[9.8,55.55],[10.1,54.8],[8.3,54.8]],Fn=[[34.4,29.6],[39,29.2],[40.2,25],[41.6,20.5],[42.6,17],[39,17.5],[34.8,26]],Ri=[[46.3,29.2],[50.5,28.5],[51.5,24.3],[47.8,22.8],[46,25.5]],la=[[43.2,13.2],[45.5,13.7],[46.6,15],[48.9,17],[52,19.1],[53.4,16.4],[49,12.8],[44,12]],Mi=[[25.6,-22],[31.5,-22.2],[32.2,-25.5],[31,-27.4],[29,-27.4],[26,-27.3],[24.9,-25.6]],vi=[[24.2,-28.4],[26,-27.3],[29,-27.4],[29.5,-29],[27.1,-30.7],[24.5,-30.1]],Hn=[[141,-1.5],[156,-1.5],[156,-7],[148.5,-8.1],[141,-5.7]],Ua=[[-6.2,36.1],[-1.9,35.5],[-2.5,34.7],[-6.2,34.85]],Kn=[[140.5,45.5],[144.8,45.5],[144.8,50],[140.5,50]],La=[[78.4,34.2],[85,36],[92,36.1],[98.2,33.2],[99.2,29],[97.4,27.7],[89,27.2],[81,30]],Ci=[[19.3,39.65],[21.4,39.85],[22.8,39.95],[24.2,40.1],[27.2,41.5],[26.1,42],[20.5,41.6]],Ni=[[19.2,54.45],[19.8,55.5],[22.9,55.5],[22.9,54.35],[22,53.5],[20,53.15],[19.3,53.45]],Ei=[[13.8,54.5],[16.7,54.9],[17,53.9],[16,53],[16.9,51.9],[18,51.2],[18.6,50.2],[17,50.2],[14.6,50.9],[14.4,52.5]],Gi=[[23.2,54.3],[25.2,55.2],[26.9,55.4],[27.8,53.9],[27.4,52.6],[27.4,51.5],[26.8,50.4],[26.3,48.5],[24.9,48.2],[22.6,49.1],[23.6,51.5],[23.6,52.6]],ki=[[27.7,60.4],[29.7,60.05],[31,60.9],[31.7,62.9],[30,62.9]],Di=[[28.4,70],[31.6,70],[31,69],[28.4,68.8]],Bi=[[28.2,46.6],[30.5,46.1],[29.8,45.1],[28.2,45.3]],$n=[[10.85,54.05],[11,53.65],[10.6,53.35],[11.3,53.05],[10.75,52.8],[10.95,52.1],[10.55,51.85],[10.2,51.4],[10,50.9],[10.1,50.6],[11,50.35],[12.1,50.3],[12.4,50.15],[15.2,50.8],[14.9,52],[14.3,53],[14.4,54.1],[13.6,54.9],[12,54.6]],Ti=[[101.9,23.6],[108.4,21.9],[107.6,17.1],[106.4,17.1],[104.5,18.8]],Ii=[[130.8,0],[141,-2.4],[141,-9.3],[137.6,-9],[132.8,-4.5]],Ui=[E("prussian-partition","Prussian Partition","DEU",["POL"],kn),E("east-prussia-k","East Prussia","DEU",["RUS"],Dn),E("memelland","Memelland","DEU",["LTU"],Bn),E("galicia","Galicia","AUT",["POL","UKR"],Tn),E("bukovina","Bukovina","AUT",["UKR","ROU"],Ba),E("carpathian-ruthenia","Carpathian Ruthenia","AUT",["UKR"],Ta),E("transylvania","Transylvania","AUT",["ROU"],In),E("vojvodina","Vojvodina","AUT",["SRB"],Un),E("trentino","Trentino","AUT",["ITA"],Ln),E("trieste","Austrian Littoral","AUT",["ITA","SVN"],Ia),E("alsace-lorraine","Alsace-Lorraine","DEU",["FRA"],On),E("north-schleswig","North Schleswig","DEU",["DNK"],xn),E("ottoman-rumelia","Ottoman Rumelia","OTT",["GRC"],Ci),E("hejaz","Hejaz","OTT",["SAU"],Fn),E("al-hasa","Al-Hasa","OTT",["SAU"],Ri),E("aden","Aden Protectorate","ADN",["YEM"],la),E("transvaal","South African Republic","SAR",["ZAF"],Mi),E("orange-free-state","Orange Free State","OFS",["ZAF"],vi),E("german-new-guinea","German New Guinea","GNG",["PNG"],Hn)],Li=[E("prussian-partition","Prussian Partition","DEU",["POL"],kn),E("east-prussia-k","East Prussia","DEU",["RUS"],Dn),E("memelland","Memelland","DEU",["LTU"],Bn),E("galicia","Galicia","AUT",["POL","UKR"],Tn),E("bukovina","Bukovina","AUT",["UKR","ROU"],Ba),E("carpathian-ruthenia","Carpathian Ruthenia","AUT",["UKR"],Ta),E("transylvania","Transylvania","AUT",["ROU"],In),E("vojvodina","Vojvodina","AUT",["SRB"],Un),E("trentino","Trentino","AUT",["ITA"],Ln),E("trieste","Austrian Littoral","AUT",["ITA","SVN"],Ia),E("alsace-lorraine","Alsace-Lorraine","DEU",["FRA"],On),E("north-schleswig","North Schleswig","DEU",["DNK"],xn),E("hejaz","Hejaz","OTT",["SAU"],Fn),E("aden","Aden Protectorate","ADN",["YEM"],la),E("german-new-guinea","German New Guinea","GNG",["PNG"],Hn),E("spanish-morocco","Spanish Morocco","SMA",["MAR"],Ua),E("karafuto","Karafuto","JPN",["RUS"],Kn),E("tibet","Tibet","TIB",["CHN"],La)],Oi=[E("east-prussia","East Prussia","DEU",["POL","RUS"],Ni),E("silesia-pomerania","Silesia and Pomerania","DEU",["POL"],Ei),E("kresy","Eastern Poland","POL",["BLR","UKR","LTU"],Gi),E("carpathian-ruthenia","Carpathian Ruthenia","CSK",["UKR"],Ta),E("north-bukovina","Northern Bukovina","ROU",["UKR"],Ba),E("budjak","Budjak","ROU",["UKR"],Bi),E("istria","Julian March","ITA",["SVN","HRV"],Ia),E("karelia","Finnish Karelia","FIN",["RUS"],ki),E("petsamo","Petsamo","FIN",["RUS"],Di),E("aden","Aden Protectorate","ADN",["YEM"],la),E("spanish-morocco","Spanish Morocco","SMA",["MAR"],Ua),E("karafuto","Karafuto","JPN",["RUS"],Kn),E("tibet","Tibet","TIB",["CHN"],La)],xi=[E("east-germany","German Democratic Republic","DDR",["DEU"],$n),E("north-vietnam","Democratic Republic of Vietnam","DRV",["VNM"],Ti),E("dutch-new-guinea","Netherlands New Guinea","DNG",["IDN"],Ii),E("aden","Aden Protectorate","ADN",["YEM"],la),E("spanish-morocco","Spanish Morocco","SMA",["MAR"],Ua),E("tibet","Tibet","TIB",["CHN"],La)],Fi=[E("east-germany","German Democratic Republic","DDR",["DEU"],$n)],Hi={AM:"absolute-monarchy",CM:"constitutional-monarchy",PR:"parliamentary-republic",SP:"semi-presidential-republic",PRES:"presidential-republic",OP:"one-party-state",MJ:"military-junta",FR:"federal-republic",TH:"theocracy",CONF:"confederation",PROT:"protectorate",MAND:"mandate-colony",DEP:"dependency",OCC:"occupied-territory",BRK:"breakaway-state"};function pn(e){const a=e.indexOf(":");return a<0?{name:e}:{title:e.slice(0,a),name:e.slice(a+1)}}function je(e){return e.trim().split(`
`).filter(a=>a.trim()&&!a.startsWith("#")).map(a=>{const n=a.split("|").map(r=>r.trim()),i=pn(n[7]??""),s=n[8]&&n[8]!=="-"?pn(n[8]):void 0,[t,o]=(n[10]??"").split(":");return{id:n[0],name:n[1],government:Hi[n[2]]??"dependency",ideology:Number(n[3]||0),bloc:n[4]||"none",popM:n[5]?Number(n[5]):void 0,gdpB:n[6]?Number(n[6]):void 0,hosTitle:i.title,hos:i.name,hogTitle:s==null?void 0:s.title,hog:s==null?void 0:s.name,lands:n[9]?n[9]==="-"?[]:n[9].split(/\s+/):[n[0]],overlord:t||void 0,status:o||void 0,rulingParty:n[11]||void 0}})}const Ki={year:1900,regions:Ui,polities:je(`
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
`)},$i={year:1914,regions:Li,polities:je(`
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
`)},Ji={year:1930,regions:Oi,polities:je(`
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
`)},Wi={year:1950,regions:xi,polities:je(`
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
`)},Vi={AM:"absolute-monarchy",CM:"constitutional-monarchy",PR:"parliamentary-republic",SP:"semi-presidential-republic",PRES:"presidential-republic",OP:"one-party-state",MJ:"military-junta",FR:"federal-republic",TH:"theocracy"},Jn="BEL DNK FRA DEU GRC IRL ITA LUX NLD PRT ESP GBR".split(" "),Wn=[...Jn,..."AUT FIN SWE CYP CZE EST HUN LVA LTU MLT POL SVK SVN BGR ROU".split(" ")],wi=[...Wn.filter(e=>e!=="GBR"),"HRV"],Vn="USA CAN GBR FRA DEU ITA BEL NLD LUX DNK NOR ISL PRT ESP GRC TUR".split(" "),wn=[...Vn,..."POL CZE HUN BGR EST LVA LTU ROU SVK SVN ALB HRV".split(" ")],ji=[...wn,..."MNE MKD FIN SWE".split(" ")],zi="BRA RUS IND CHN".split(" "),Yi="BRA RUS IND CHN ZAF EGY ETH IRN ARE IDN".split(" "),Zi="USS POL CSK HUN ROU BGR".split(" "),yn="SAU ARE QAT KWT BHR OMN".split(" "),qi="IDN MYS PHL SGP THA BRN VNM LAO MMR KHM".split(" "),Xi="ARG BRA PRY URY".split(" ");function _i(e,a){var t;if(e===1990)return Zi.includes(a)?"warsaw-pact":Jn.includes(a)?"european-union":Vn.includes(a)?"nato":yn.includes(a)?"gulf-cooperation-council":["AUS","NZL","JPN","KOR","ISR","THA","PHL"].includes(a)?"allies":"non-aligned";const n=e>=2026?wi:Wn,i=e>=2026?ji:wn,s=e>=2026?Yi:zi;return n.includes(a)?"european-union":s.includes(a)?"brics":i.includes(a)?"nato":yn.includes(a)?"gulf-cooperation-council":qi.includes(a)?"asean":Xi.includes(a)?"mercosur":["CAN","MEX"].includes(a)?"usmca":["BLR","KAZ","KGZ","TJK","ARM"].includes(a)?"csto":((t=Ge[a])==null?void 0:t.bloc)??"non-aligned"}const Qi={DEU:"Chancellor",AUT:"Chancellor",IRL:"Taoiseach",SAU:"Crown Prince and Prime Minister",CHN:"Premier",USS:"Premier",PRK:"Premier",VNM:"Prime Minister",BGD:"Chief Adviser"},eo={DEU:"Federal President",AUT:"Federal President",CHE:"President of the Confederation",CHN:"President",VNM:"General Secretary",LAO:"President",CUB:"President",SMR:"Captains Regent",AND:"Co-Princes",BIH:"Chair of the Presidency",YEM:"Chairman of the Presidential Council",PSE:"President"},ao=["Governor-General","Governor General","King","Queen","Emperor","Sultan","Emir","Prince","Grand Duke","Pope"];function no(e,a){for(const n of ao)if(a.startsWith(`${n} `))return{title:n==="Governor General"?"Governor-General":n,name:a.slice(n.length+1)};return{title:eo[e],name:a}}function ca(e,a,n=[]){return[...a.trim().split(`
`).filter(s=>s.trim()).map(s=>{const t=s.split("|").map(u=>u.trim()),o=Ge[t[0]],r=t[4]?Vi[t[4]]:(o==null?void 0:o.government)??"presidential-republic",l=no(t[0],t[1]??"");return{id:t[0],name:(o==null?void 0:o.name)??t[0],government:r,ideology:t[5]?Number(t[5]):(o==null?void 0:o.ideology)??0,bloc:_i(e,t[0]),hos:l.name,hosTitle:l.title??(r==="one-party-state"?"General Secretary":void 0),hog:t[2]||void 0,hogTitle:Qi[t[0]],lands:[t[0]],rulingParty:t[3]||void 0}}),...n]}const jn={year:1990,regions:Fi,polities:ca(1990,`
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
`,[...je(`
USS|Soviet Union|PRES|-50|warsaw-pact|||President:Mikhail Gorbachev|Premier:Nikolai Ryzhkov|RUS UKR BLR MDA EST LVA LTU KAZ UZB TKM KGZ TJK ARM AZE GEO|||Communist Party of the Soviet Union
YUG|Yugoslavia|OP|-35|non-aligned|||President of the Presidency:Borisav Jovic|Prime Minister:Ante Markovic|SRB HRV SVN BIH MNE MKD XKX||League of Communists of Yugoslavia
CSK|Czechoslovakia|PR|5|warsaw-pact|||President:Vaclav Havel|Prime Minister:Marian Calfa|CZE SVK||Civic Forum
DDR|East Germany|PR|-5|warsaw-pact|16.1|152|President of the Volkskammer:Sabine Bergmann-Pohl|Prime Minister:Lothar de Maiziere|-||Christian Democratic Union
GBH|British Hong Kong|DEP|5|allies|5.7|77|Governor:David Wilson|-|HKG|GBR:colony
PSO|Occupied Palestinian Territories|OCC|0|none|2|2|Occupying Power:Yitzhak Shamir|-|PSE|ISR:occupation
`)]).filter(e=>e.id!=="HKG")};for(const e of jn.polities)e.id==="KWT"&&(e.overlord="IRQ",e.status="occupation");const to={year:2010,regions:[],polities:ca(2010,`
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
`).filter(e=>e.id!=="HKG"&&e.id!=="PRI")},io={year:2020,regions:[],polities:ca(2020,`
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
`)},oo={year:2026,regions:[],polities:ca(2026,`
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
`)};function ro(e){return e.split("|").map(a=>{const n=a.startsWith("*"),[i,s,t,o,r]=(n?a.slice(1):a).split(":");return{name:i,abbr:s,ideology:Number(t),colour:o,seats:Number(r),ruling:n}})}function P(e,a,n,i,s){const t=(s==null?void 0:s.split(";"))??[],o=ro(i);return{chamber:e,termYears:a,nextElectionYear:n,seats:o.reduce((r,l)=>r+l.seats,0),parties:o,cabinet:s?{economy:t[0]||void 0,foreign:t[1]||void 0,defence:t[2]||void 0,centralBank:t[3]||void 0}:void 0}}const A="#c0392b",v="#2563eb",Pe="#1e3a8a",O="#16a34a",x="#eab308",j="#ea580c",Re="#7c3aed",G="#334155",ce="#7f1d1d",re="#0d9488",zn={1900:{GBR:P("House of Commons",7,1900,`*Conservative and Liberal Unionists:CON:25:${v}:402|Liberal Party:LIB:-10:${x}:186|Irish Parliamentary Party:IPP:-5:${O}:82`,"Michael Hicks Beach;Marquess of Salisbury;Marquess of Lansdowne;Hugh Colin Smith"),FRA:P("Chamber of Deputies",4,1902,`*Republican Defence Bloc:BLOC:-15:${Re}:350|Progressive Republicans:PROG:15:${v}:150|Conservative Right:DROITE:45:${G}:81`,"Joseph Caillaux;Theophile Delcasse;Gaston de Galliffet;Georges Pallain"),DEU:P("Reichstag",5,1903,`*Centre Party:Z:20:${G}:102|*German Conservative Party:DKP:45:${Pe}:56|*National Liberal Party:NLP:15:${x}:46|Social Democratic Party:SPD:-45:${A}:56|Free-minded Parties:FVP:-5:${j}:37|Regional and Minor Parties:OTH:10:${re}:100`,"Johannes von Miquel;Bernhard von Bulow;Heinrich von Gossler;Richard Koch"),USA:P("House of Representatives",2,1900,`*Republican Party:GOP:15:${A}:185|Democratic Party:DEM:-5:${v}:163|Populists and Silver Parties:POP:-25:${O}:9`,"Lyman J. Gage;John Hay;Elihu Root"),JPN:P("House of Representatives",4,1902,`Kenseito (Constitutional Party):KSTO:5:${v}:188|*Imperial Party and Independents:TEIK:30:${A}:112`,"Matsukata Masayoshi;Aoki Shuzo;Katsura Taro;Yamamoto Tatsuo"),ITA:P("Chamber of Deputies",5,1900,`*Historical Right:DS:20:${v}:319|Historical Left:SS:-5:${A}:109|Exedra (Radicals, Republicans, Socialists):EX:-35:${j}:80`,"Paolo Carcano;Emilio Visconti Venosta;Giuseppe Mirri"),AUT:P("Imperial Council",6,1901,`*Polish and Conservative Clubs:KONS:25:${G}:170|German Parties:DEU:15:${v}:120|Czech Parties:CZE:0:${A}:70|Social Democrats:SDAP:-40:${ce}:15`),RUS:{parties:[],cabinet:{economy:"Sergei Witte",foreign:"Mikhail Muravyov",defence:"Aleksey Kuropatkin",centralBank:"Eduard Pleske"}}},1914:{GBR:P("House of Commons",5,1915,`*Liberal Party:LIB:-15:${x}:272|Conservative and Unionist Party:CON:25:${v}:271|Irish Parliamentary Party:IPP:-5:${O}:84|Labour Party:LAB:-35:${A}:42`,"David Lloyd George;Edward Grey;H. H. Asquith;Walter Cunliffe"),FRA:P("Chamber of Deputies",4,1918,`*Radical Party and Allies:RAD:-15:${Re}:260|French Section of the Workers' International:SFIO:-45:${A}:103|Democratic Republicans:ARD:10:${v}:100|Conservatives:FED:40:${G}:139`,"Joseph Noulens;Rene Viviani;Adolphe Messimy;Georges Pallain"),DEU:P("Reichstag",5,1917,`Social Democratic Party:SPD:-40:${A}:110|*Centre Party:Z:20:${G}:91|*National Liberal Party:NLP:15:${x}:45|Progressive People's Party:FVP:-5:${j}:42|*German Conservative Party:DKP:45:${Pe}:43|Regional and Minor Parties:OTH:10:${re}:66`,"Clemens von Delbruck;Gottlieb von Jagow;Erich von Falkenhayn;Rudolf Havenstein"),USA:P("House of Representatives",2,1914,`*Democratic Party:DEM:-15:${v}:291|Republican Party:GOP:15:${A}:134|Progressive Party:PROG:-5:${O}:10`,"William Gibbs McAdoo;William Jennings Bryan;Lindley Garrison;Charles Hamlin"),RUS:P("State Duma",5,1917,`*Octobrists and Rightists:OCT:40:${Pe}:220|Constitutional Democrats:KD:-5:${O}:107|Progressists:PROG:5:${x}:48|Trudoviks and Social Democrats:TRUD:-50:${A}:24|National Groups:NAT:10:${re}:43`,"Pyotr Bark;Sergey Sazonov;Vladimir Sukhomlinov;Ivan Shipov"),AUT:{parties:[],cabinet:{economy:"Leon Bilinski",foreign:"Leopold Berchtold",defence:"Alexander von Krobatin",centralBank:"Alexander Popovics"}},ITA:P("Chamber of Deputies",5,1919,`*Liberals and Radicals:LIB:5:${v}:340|Italian Socialist Party:PSI:-45:${A}:52|Radical Party:RAD:-15:${j}:62|Catholics and Conservatives:CAT:25:${G}:54`,"Luigi Rava;Antonino di San Giuliano;Domenico Grandi;Bonaldo Stringher"),JPN:P("House of Representatives",4,1915,`Rikken Seiyukai:SY:15:${A}:188|*Rikken Doshikai:DS:5:${v}:93|Others:OTH:15:${G}:100`,"Wakatsuki Reijiro;Kato Takaaki;Oka Ichinosuke"),SRB:{parties:[],cabinet:{foreign:"Nikola Pasic",defence:"Dusan Stefanovic"}}},1930:{GBR:P("House of Commons",5,1934,`*Labour Party:LAB:-30:${A}:287|Conservative Party:CON:25:${v}:260|Liberal Party:LIB:0:${x}:59`,"Philip Snowden;Arthur Henderson;Tom Shaw;Montagu Norman"),FRA:P("Chamber of Deputies",4,1932,`*Democratic Republican Alliance:ARD:15:${v}:180|Republican Federation:FR:35:${Pe}:102|Radical Party:RAD:-10:${Re}:125|French Section of the Workers' International:SFIO:-40:${A}:100|Communist Party:PCF:-85:${ce}:14`,"Paul Reynaud;Aristide Briand;Andre Maginot;Emile Moreau"),DEU:P("Reichstag",4,1932,`*Social Democratic Party:SPD:-30:${A}:153|German National People's Party:DNVP:50:${Pe}:73|Centre Party:Z:10:${G}:61|Communist Party:KPD:-85:${ce}:54|German People's Party:DVP:20:${x}:45|German Democratic Party:DDP:-5:${j}:25|Bavarian People's Party:BVP:25:${re}:16|National Socialist Party:NSDAP:90:#52525b:12`,"Rudolf Hilferding;Julius Curtius;Wilhelm Groener;Hjalmar Schacht"),USA:P("House of Representatives",2,1930,`*Republican Party:GOP:15:${A}:270|Democratic Party:DEM:0:${v}:164|Farmer-Labor Party:FLP:-30:${O}:1`,"Andrew Mellon;Henry L. Stimson;Patrick J. Hurley;Roy A. Young"),USS:P("Supreme Soviet",4,1934,`*All-Union Communist Party:VKP:-85:${A}:1000`,"Grigory Sokolnikov;Maxim Litvinov;Kliment Voroshilov;Georgy Pyatakov"),ITA:{parties:[{name:"National Fascist Party",abbr:"PNF",ideology:80,colour:"#111827",seats:400,ruling:!0}],cabinet:{economy:"Antonio Mosconi",foreign:"Dino Grandi",defence:"Pietro Gazzera",centralBank:"Bonaldo Stringher"}},JPN:P("House of Representatives",4,1932,`*Rikken Minseito:MS:5:${v}:273|Rikken Seiyukai:SY:15:${A}:174|Proletarian Parties and Others:OTH:-25:${O}:19`,"Inoue Junnosuke;Shidehara Kijuro;Ugaki Kazushige;Hijikata Hisakira"),ESP:{parties:[],cabinet:{economy:"Manuel Arguelles;",foreign:"Duke of Alba",defence:"Damaso Berenguer"}},CHN:{parties:[{name:"Kuomintang",abbr:"KMT",ideology:25,colour:v,seats:80,ruling:!0},{name:"Communist Party of China",abbr:"CPC",ideology:-85,colour:A,seats:20,ruling:!1}],cabinet:{economy:"T. V. Soong",foreign:"Wang Zhengting",defence:"He Yingqin"}}},1950:{USA:P("House of Representatives",2,1950,`*Democratic Party:DEM:-10:${v}:263|Republican Party:GOP:15:${A}:171|American Labor Party:ALP:-50:${O}:1`,"John W. Snyder;Dean Acheson;Louis A. Johnson;Thomas B. McCabe"),GBR:P("House of Commons",5,1950,`*Labour Party:LAB:-30:${A}:393|Conservative Party:CON:20:${v}:197|Liberal Party:LIB:0:${x}:12|Others:OTH:0:${G}:38`,"Stafford Cripps;Ernest Bevin;Emanuel Shinwell;Lord Catto"),FRA:P("National Assembly",5,1951,`French Communist Party:PCF:-80:${ce}:182|*Popular Republican Movement:MRP:5:${v}:158|*French Section of the Workers' International:SFIO:-30:${A}:102|*Radical Party:RAD:0:${Re}:70|Independents and Peasants:CNI:30:${G}:106`,"Maurice Petsche;Robert Schuman;Rene Pleven;Wilfrid Baumgartner"),DEU:P("Bundestag",4,1953,`*Christian Democratic Union/CSU:CDU:15:${G}:139|Social Democratic Party:SPD:-25:${A}:131|*Free Democratic Party:FDP:15:${x}:52|Others:OTH:15:${re}:80`,"Fritz Schaffer;Konrad Adenauer;;Wilhelm Vocke"),ITA:P("Chamber of Deputies",5,1953,`*Christian Democracy:DC:10:${v}:305|Popular Democratic Front:FDP:-60:${A}:183|Socialist Unity:US:-20:${j}:33|Others:OTH:15:${G}:53`,"Giuseppe Pella;Carlo Sforza;Randolfo Pacciardi;Donato Menichella"),USS:P("Supreme Soviet",4,1950,`*Communist Party of the Soviet Union:CPSU:-85:${A}:1316`,"Arseny Zverev;Andrey Vyshinsky;Aleksandr Vasilevsky;Vasily Popov"),CHN:P("Chinese People's Political Consultative Conference",5,1954,`*Communist Party of China:CPC:-80:${A}:662`,"Bo Yibo;Zhou Enlai;Zhu De;Nan Hanchen"),JPN:P("House of Representatives",4,1953,`*Democratic Liberal Party:DLP:20:${v}:264|Democratic Party:DP:10:${x}:69|Socialist Party:JSP:-35:${A}:48|Communist Party:JCP:-80:${ce}:35|Others:OTH:5:${G}:50`,"Hayato Ikeda;Shigeru Yoshida;;Hisato Ichimada"),IND:{chamber:"Constituent Assembly",seats:313,termYears:5,nextElectionYear:1951,parties:[{name:"Indian National Congress",abbr:"INC",ideology:-20,colour:v,seats:290,ruling:!0},{name:"Others",abbr:"OTH",ideology:10,colour:G,seats:23,ruling:!1}],cabinet:{economy:"John Mathai",foreign:"Jawaharlal Nehru",defence:"Baldev Singh",centralBank:"C. D. Deshmukh"}},ARG:{parties:[{name:"Peronist Party",abbr:"PP",ideology:15,colour:v,seats:112,ruling:!0},{name:"Radical Civic Union",abbr:"UCR",ideology:0,colour:A,seats:46,ruling:!1}]}},1990:{USA:P("House of Representatives",2,1990,`*Republican Party:GOP:25:${A}:175|Democratic Party:DEM:-10:${v}:260`,"Nicholas F. Brady;James Baker;Dick Cheney;Alan Greenspan"),USS:P("Congress of People's Deputies",5,1994,`*Communist Party of the Soviet Union:CPSU:-55:${A}:1957|Reformers and Independents:IND:0:${v}:293`,"Valentin Pavlov;Eduard Shevardnadze;Dmitry Yazov;Viktor Gerashchenko"),GBR:P("House of Commons",5,1992,`*Conservative Party:CON:35:${v}:376|Labour Party:LAB:-20:${A}:229|Liberal Democrats:LD:-5:${x}:22|Others:OTH:0:${G}:23`,"John Major;Douglas Hurd;Tom King;Robin Leigh-Pemberton"),FRA:P("National Assembly",5,1993,`*Socialist Party:PS:-25:${A}:275|Rally for the Republic:RPR:25:${Pe}:130|Union for French Democracy:UDF:15:${v}:130|French Communist Party:PCF:-75:${ce}:27|Others:OTH:0:${G}:15`,"Pierre Beregovoy;Roland Dumas;Jean-Pierre Chevenement;Jacques de Larosiere"),DEU:P("Bundestag",4,1990,`*CDU/CSU:CDU:15:${G}:223|Social Democratic Party:SPD:-20:${A}:186|*Free Democratic Party:FDP:15:${x}:46|The Greens:GRU:-25:${O}:42`,"Theo Waigel;Hans-Dietrich Genscher;Gerhard Stoltenberg;Karl Otto Pohl"),ITA:P("Chamber of Deputies",5,1992,`*Christian Democracy:DC:10:${v}:234|Communist Party:PCI:-50:${ce}:177|*Socialist Party:PSI:-15:${A}:94|Others:OTH:5:${G}:125`,"Guido Carli;Gianni De Michelis;Mino Martinazzoli;Carlo Azeglio Ciampi"),JPN:P("House of Representatives",4,1993,`*Liberal Democratic Party:LDP:20:${O}:275|Japan Socialist Party:JSP:-30:${A}:136|Komeito:KMT:0:${x}:45|Others:OTH:0:${G}:56`,"Ryutaro Hashimoto;Taro Nakayama;Yozo Ishikawa;Yasushi Mieno"),CHN:P("National People's Congress",5,1993,`*Communist Party of China:CPC:-50:${A}:2970`,"Wang Bingqian;Qian Qichen;Qin Jiwei;Li Guixian"),IND:P("Lok Sabha",5,1994,`Indian National Congress:INC:-10:${v}:197|*Janata Dal:JD:-10:${O}:143|Bharatiya Janata Party:BJP:40:${j}:85|Communist Party of India (Marxist):CPM:-65:${A}:33|Others:OTH:0:${G}:85`,"Madhu Dandavate;Inder Kumar Gujral;V. P. Singh;R. N. Malhotra"),IRQ:{parties:[{name:"Arab Socialist Ba'ath Party",abbr:"BAATH",ideology:-20,colour:A,seats:250,ruling:!0}],cabinet:{foreign:"Tariq Aziz",defence:"Abdul Jabbar Shanshal"}}},2010:{USA:P("House of Representatives",2,2010,`*Democratic Party:DEM:-15:${v}:257|Republican Party:GOP:25:${A}:178`,"Timothy Geithner;Hillary Clinton;Robert Gates;Ben Bernanke"),GBR:P("House of Commons",5,2010,`*Labour Party:LAB:-15:${A}:345|Conservative Party:CON:20:${v}:193|Liberal Democrats:LD:-5:${x}:63|Others:OTH:0:${G}:49`,"Alistair Darling;David Miliband;Bob Ainsworth;Mervyn King"),FRA:P("National Assembly",5,2012,`*Union for a Popular Movement:UMP:20:${Pe}:313|Socialist Party:PS:-20:${A}:186|New Centre and Allies:NC:10:${v}:40|Others:OTH:-20:${G}:38`,"Christine Lagarde;Bernard Kouchner;Herve Morin;Christian Noyer"),DEU:P("Bundestag",4,2013,`*CDU/CSU:CDU:12:${G}:239|Social Democratic Party:SPD:-15:${A}:146|*Free Democratic Party:FDP:20:${x}:93|The Left:LINKE:-50:${ce}:76|Greens:GRU:-20:${O}:68`,"Wolfgang Schauble;Guido Westerwelle;Karl-Theodor zu Guttenberg;Axel Weber"),ITA:P("Chamber of Deputies",5,2013,`*The People of Freedom:PdL:25:${v}:276|Democratic Party:PD:-15:${A}:217|*Northern League:LN:45:${O}:60|Others:OTH:0:${G}:77`,"Giulio Tremonti;Franco Frattini;Ignazio La Russa;Mario Draghi"),ESP:P("Congress of Deputies",4,2012,`*Spanish Socialist Workers' Party:PSOE:-15:${A}:169|People's Party:PP:20:${v}:154|Others:OTH:0:${G}:27`,"Elena Salgado;Miguel Angel Moratinos;Carme Chacon;Miguel Angel Fernandez Ordonez"),GRC:P("Hellenic Parliament",4,2013,`*PASOK:PASOK:-10:${O}:160|New Democracy:ND:20:${v}:91|Communist Party of Greece:KKE:-80:${A}:21|Others:OTH:0:${G}:28`,"George Papaconstantinou;George Papandreou;Evangelos Venizelos;George Provopoulos"),RUS:P("State Duma",5,2011,`*United Russia:ER:25:${v}:315|Communist Party:KPRF:-60:${A}:57|Liberal Democratic Party:LDPR:40:${x}:40|A Just Russia:SR:-20:${j}:38`,"Alexei Kudrin;Sergey Lavrov;Anatoliy Serdyukov;Sergey Ignatyev"),CHN:P("National People's Congress",5,2013,`*Communist Party of China:CPC:-35:${A}:2987`,"Xie Xuren;Yang Jiechi;Liang Guanglie;Zhou Xiaochuan"),JPN:P("House of Representatives",4,2013,`*Democratic Party of Japan:DPJ:-5:${v}:308|Liberal Democratic Party:LDP:20:${O}:119|Komeito:KMT:5:${x}:21|Others:OTH:0:${G}:32`,"Naoto Kan;Katsuya Okada;Toshimi Kitazawa;Masaaki Shirakawa"),IND:P("Lok Sabha",5,2014,`*Indian National Congress:INC:-15:${v}:206|Bharatiya Janata Party:BJP:30:${j}:116|Others:OTH:0:${G}:221`,"Pranab Mukherjee;S. M. Krishna;A. K. Antony;Duvvuri Subbarao"),BRA:P("Chamber of Deputies",4,2010,`*Workers' Party:PT:-25:${A}:79|Brazilian Democratic Movement:PMDB:5:${O}:90|Brazilian Social Democracy Party:PSDB:10:${v}:59|Others:OTH:0:${G}:285`,"Guido Mantega;Celso Amorim;Nelson Jobim;Henrique Meirelles")},2020:{USA:P("House of Representatives",2,2020,`*Republican Party:GOP:30:${A}:197|Democratic Party:DEM:-15:${v}:233|Independent and Vacant:IND:0:${G}:5`,"Steven Mnuchin;Mike Pompeo;Mark Esper;Jerome Powell"),GBR:P("House of Commons",5,2024,`*Conservative Party:CON:20:${v}:365|Labour Party:LAB:-25:${A}:202|Scottish National Party:SNP:-15:${x}:48|Others:OTH:0:${G}:35`,"Rishi Sunak;Dominic Raab;Ben Wallace;Andrew Bailey"),FRA:P("National Assembly",5,2022,`*La Republique En Marche:LREM:5:${x}:301|The Republicans:LR:25:${v}:104|*MoDem:MODEM:5:${j}:46|Socialist Party:PS:-20:${A}:28|Others:OTH:0:${G}:98`,"Bruno Le Maire;Jean-Yves Le Drian;Florence Parly;Francois Villeroy de Galhau"),DEU:P("Bundestag",4,2021,`*CDU/CSU:CDU:10:${G}:246|*Social Democratic Party:SPD:-15:${A}:152|Alternative for Germany:AfD:65:#38bdf8:89|Free Democratic Party:FDP:20:${x}:80|The Left:LINKE:-50:${ce}:69|Greens:GRU:-15:${O}:67`,"Olaf Scholz;Heiko Maas;Annegret Kramp-Karrenbauer;Jens Weidmann"),ITA:P("Chamber of Deputies",5,2023,`*Five Star Movement:M5S:0:${x}:216|Lega:LEGA:50:${O}:125|*Democratic Party:PD:-15:${A}:111|Forza Italia:FI:20:${v}:96|Others:OTH:0:${G}:82`,"Roberto Gualtieri;Luigi Di Maio;Lorenzo Guerini;Ignazio Visco"),ESP:P("Congress of Deputies",4,2023,`*Spanish Socialist Workers' Party:PSOE:-18:${A}:120|People's Party:PP:20:${v}:89|Vox:VOX:60:${O}:52|*Unidas Podemos:UP:-45:${Re}:35|Others:OTH:0:${G}:54`,"Maria Jesus Montero;Arancha Gonzalez Laya;Margarita Robles;Pablo Hernandez de Cos"),RUS:P("State Duma",5,2021,`*United Russia:ER:30:${v}:341|Communist Party:KPRF:-60:${A}:43|Liberal Democratic Party:LDPR:40:${x}:39|A Just Russia:SR:-20:${j}:23`,"Anton Siluanov;Sergey Lavrov;Sergey Shoigu;Elvira Nabiullina"),CHN:P("National People's Congress",5,2023,`*Communist Party of China:CPC:-45:${A}:2980`,"Liu Kun;Wang Yi;Wei Fenghe;Yi Gang"),JPN:P("House of Representatives",4,2021,`*Liberal Democratic Party:LDP:25:${O}:285|Constitutional Democratic Party:CDP:-15:${v}:119|*Komeito:KMT:5:${x}:29|Others:OTH:0:${G}:32`,"Taro Aso;Toshimitsu Motegi;Taro Kono;Haruhiko Kuroda"),IND:P("Lok Sabha",5,2024,`*Bharatiya Janata Party:BJP:35:${j}:303|Indian National Congress:INC:-15:${v}:52|Others:OTH:0:${G}:188`,"Nirmala Sitharaman;S. Jaishankar;Rajnath Singh;Shaktikanta Das"),BRA:P("Chamber of Deputies",4,2022,`*Social Liberal Party:PSL:50:${O}:53|Workers' Party:PT:-30:${A}:54|Others:OTH:5:${G}:406`,"Paulo Guedes;Ernesto Araujo;Fernando Azevedo;Roberto Campos Neto"),AUS:P("House of Representatives",3,2022,`*Liberal-National Coalition:LNP:18:${v}:77|Australian Labor Party:ALP:-15:${A}:68|Others:OTH:0:${G}:6`,"Josh Frydenberg;Marise Payne;Linda Reynolds;Philip Lowe"),CAN:P("House of Commons",4,2023,`*Liberal Party:LPC:-10:${A}:157|Conservative Party:CPC:20:${v}:121|Bloc Quebecois:BQ:-5:${re}:32|New Democratic Party:NDP:-30:${j}:24|Others:OTH:0:${G}:4`,"Bill Morneau;Francois-Philippe Champagne;Harjit Sajjan;Stephen Poloz")},2026:{USA:P("House of Representatives",2,2026,`*Republican Party:GOP:30:${A}:220|Democratic Party:DEM:-15:${v}:215`,"Scott Bessent;Marco Rubio;Pete Hegseth;Jerome Powell"),GBR:P("House of Commons",5,2029,`*Labour Party:LAB:-12:${A}:402|Conservative Party:CON:22:${v}:121|Liberal Democrats:LD:-5:${x}:72|Reform UK:REF:55:${re}:5|Others:OTH:0:${G}:50`,"Rachel Reeves;Yvette Cooper;John Healey;Andrew Bailey"),FRA:P("National Assembly",5,2027,`National Rally:RN:60:${Pe}:123|*Ensemble:ENS:5:${x}:165|*The Republicans:LR:25:${v}:47|France Unbowed:LFI:-55:${A}:71|Socialist Party:PS:-20:${j}:66|Others:OTH:0:${G}:105`,"Roland Lescure;Jean-Noel Barrot;Catherine Vautrin;Francois Villeroy de Galhau"),DEU:P("Bundestag",4,2029,`*CDU/CSU:CDU:15:${G}:208|Alternative for Germany:AfD:65:#38bdf8:152|*Social Democratic Party:SPD:-15:${A}:120|Greens:GRU:-15:${O}:85|The Left:LINKE:-50:${ce}:64|Others:OTH:0:${re}:1`,"Lars Klingbeil;Johann Wadephul;Boris Pistorius;Joachim Nagel"),ITA:P("Chamber of Deputies",5,2027,`*Brothers of Italy:FdI:40:${Pe}:118|Democratic Party:PD:-15:${A}:69|*Lega:LEGA:50:${O}:66|Five Star Movement:M5S:-5:${x}:52|*Forza Italia:FI:15:${v}:45|Others:OTH:0:${G}:50`,"Giancarlo Giorgetti;Antonio Tajani;Guido Crosetto;Fabio Panetta"),ESP:P("Congress of Deputies",4,2027,`People's Party:PP:20:${v}:137|*Spanish Socialist Workers' Party:PSOE:-18:${A}:121|Vox:VOX:60:${O}:33|*Sumar:SMR:-40:${Re}:31|Others:OTH:0:${G}:28`,"Carlos Cuerpo;Jose Manuel Albares;Margarita Robles;Jose Luis Escriva"),RUS:P("State Duma",5,2026,`*United Russia:ER:35:${v}:324|Communist Party:KPRF:-60:${A}:57|A Just Russia:SR:-20:${j}:27|LDPR:LDPR:45:${x}:21|New People:NP:15:${re}:15|Others:OTH:0:${G}:6`,"Anton Siluanov;Sergey Lavrov;Andrey Belousov;Elvira Nabiullina"),UKR:P("Verkhovna Rada",5,2027,`*Servant of the People:SN:5:${O}:229|Others:OTH:5:${G}:171`,"Serhii Marchenko;Andrii Sybiha;Denys Shmyhal;Andrii Pyshnyi"),CHN:P("National People's Congress",5,2028,`*Communist Party of China:CPC:-45:${A}:2977`,"Lan Fo'an;Wang Yi;Dong Jun;Pan Gongsheng"),JPN:P("House of Representatives",4,2028,`*Liberal Democratic Party:LDP:30:${O}:196|Constitutional Democratic Party:CDP:-15:${v}:148|*Japan Innovation Party:JIP:25:${j}:35|Democratic Party for the People:DPP:5:${x}:27|Komeito:KMT:5:${Re}:24|Others:OTH:0:${G}:35`,"Satsuki Katayama;Toshimitsu Motegi;Shinjiro Koizumi;Kazuo Ueda"),KOR:P("National Assembly",4,2028,`*Democratic Party:DPK:-10:${v}:166|People Power Party:PPP:25:${A}:107|Others:OTH:0:${G}:27`,"Koo Yun-cheol;Cho Hyun;Ahn Gyu-back;Rhee Chang-yong"),IND:P("Lok Sabha",5,2029,`*Bharatiya Janata Party:BJP:35:${j}:240|Indian National Congress:INC:-15:${v}:99|Samajwadi Party:SP:-20:${A}:37|Trinamool Congress:TMC:-15:${O}:29|*Telugu Desam and Allies:NDA:15:${x}:53|Others:OTH:0:${G}:85`,"Nirmala Sitharaman;S. Jaishankar;Rajnath Singh;Sanjay Malhotra"),BRA:P("Chamber of Deputies",4,2026,`Liberal Party:PL:45:${O}:99|*Workers' Party Federation:PT:-30:${A}:80|Union Brazil:UB:15:${v}:59|Others:OTH:0:${G}:275`,"Fernando Haddad;Mauro Vieira;Jose Mucio;Gabriel Galipolo"),CAN:P("House of Commons",4,2029,`*Liberal Party:LPC:-5:${A}:169|Conservative Party:CPC:20:${v}:144|Bloc Quebecois:BQ:-5:${re}:22|New Democratic Party:NDP:-30:${j}:7|Green Party:GPC:-20:${O}:1`,"Francois-Philippe Champagne;Anita Anand;David McGuinty;Tiff Macklem"),AUS:P("House of Representatives",3,2028,`*Australian Labor Party:ALP:-12:${A}:94|Liberal-National Coalition:LNP:18:${v}:43|Others:OTH:0:${G}:13`,"Jim Chalmers;Penny Wong;Richard Marles;Michele Bullock"),ISR:P("Knesset",4,2026,`*Likud:LIK:40:${v}:32|Yesh Atid:YA:0:${x}:24|*Shas:SHAS:45:${G}:11|*Religious Zionism:RZP:70:${j}:14|National Unity:NU:10:${re}:8|Others:OTH:0:${O}:31`,"Bezalel Smotrich;Gideon Sa'ar;Israel Katz;Amir Yaron"),ARG:P("Chamber of Deputies",4,2027,`*La Libertad Avanza:LLA:50:${Re}:107|Union for the Homeland:UxP:-25:${v}:96|Others:OTH:5:${G}:54`,"Luis Caputo;Pablo Quirno;Luis Petri;Santiago Bausili"),MEX:P("Chamber of Deputies",3,2027,`*Morena:MOR:-20:${ce}:253|*Labor and Green Allies:PT:-15:${O}:113|National Action Party:PAN:20:${v}:71|Institutional Revolutionary Party:PRI:5:${A}:37|Others:OTH:0:${G}:26`,"Edgar Amador Zamora;Juan Ramon de la Fuente;Ricardo Trevilla;Victoria Rodriguez Ceja"),TUR:P("Grand National Assembly",5,2028,`*Justice and Development Party:AKP:35:${j}:272|Republican People's Party:CHP:-10:${A}:138|*Nationalist Movement Party:MHP:60:${G}:47|Others:OTH:5:${re}:143`,"Mehmet Simsek;Hakan Fidan;Yasar Guler;Fatih Karahan"),SAU:{parties:[],cabinet:{economy:"Mohammed Al-Jadaan",foreign:"Faisal bin Farhan",defence:"Khalid bin Salman",centralBank:"Ayman Al-Sayari"}},IRN:{parties:[],cabinet:{foreign:"Abbas Araghchi",defence:"Aziz Nasirzadeh"}}}},so={1900:Ki,1914:$i,1930:Ji,1950:Wi,1990:jn,2010:to,2020:io,2026:oo},Pa={agriculture:2.6,mining:1.3,manufacturing:1.3,technology:.01,telecom:.05,media:.1,tourism:.05,healthcare:.2,finance:.35,education:.25,"real-estate":.6,retail:1.1,energy:.25,utilities:.3},oa={1900:{frontierPc:270,frontierGrowth:.014,revenueShare:.09,debt:.45,rate:.035,inflation:.012,unemployment:.05,openness:.35,regime:"gold",target:0,credit:.5,split:{defence:.34,welfare:.05,health:.02,education:.1,infrastructure:.15,science:.005,administration:.3,subsidies:.035},sectorWeights:Pa,popGrowth:{rich:.011,poor:.008}},1914:{frontierPc:370,frontierGrowth:.015,revenueShare:.1,debt:.4,rate:.04,inflation:.015,unemployment:.05,openness:.38,regime:"gold",target:0,credit:.55,split:{defence:.42,welfare:.07,health:.02,education:.1,infrastructure:.12,science:.005,administration:.24,subsidies:.035},sectorWeights:{...Pa,agriculture:2.2,technology:.02,telecom:.08},popGrowth:{rich:.01,poor:.009}},1930:{frontierPc:750,frontierGrowth:.016,revenueShare:.14,debt:.7,rate:.045,inflation:-.03,unemployment:.09,openness:.3,regime:"gold",target:0,credit:.65,split:{defence:.2,welfare:.15,health:.04,education:.13,infrastructure:.16,science:.01,administration:.24,subsidies:.06},sectorWeights:{...Pa,agriculture:1.8,technology:.05,telecom:.2,media:.3,energy:.5,utilities:.5,finance:.6,healthcare:.35},popGrowth:{rich:.007,poor:.012}},1950:{frontierPc:2e3,frontierGrowth:.024,revenueShare:.22,debt:.7,rate:.02,inflation:.03,unemployment:.045,openness:.22,regime:"float",target:.02,credit:.4,split:{defence:.26,welfare:.2,health:.07,education:.12,infrastructure:.13,science:.02,administration:.14,subsidies:.06},sectorWeights:{agriculture:1.5,manufacturing:1.4,mining:1.1,technology:.1,telecom:.4,media:.5,tourism:.25,healthcare:.5,finance:.7,education:.6,energy:.8},popGrowth:{rich:.012,poor:.019}},1990:{frontierPc:24e3,frontierGrowth:.02,revenueShare:.3,debt:.45,rate:.075,inflation:.055,unemployment:.065,openness:.4,regime:"float",target:.03,credit:.75,split:{defence:.12,welfare:.34,health:.13,education:.13,infrastructure:.09,science:.025,administration:.12,subsidies:.045},sectorWeights:{manufacturing:1.3,technology:.4,telecom:.7,media:.8,healthcare:.8},popGrowth:{rich:.006,poor:.024}},2010:{frontierPc:48e3,frontierGrowth:.016,revenueShare:.32,debt:.55,rate:.015,inflation:.022,unemployment:.085,openness:.55,regime:"float",target:.02,credit:.9,split:{defence:.08,welfare:.37,health:.17,education:.13,infrastructure:.08,science:.03,administration:.11,subsidies:.04},sectorWeights:{technology:.8},popGrowth:{rich:.004,poor:.022}},2020:{frontierPc:64e3,frontierGrowth:.015,revenueShare:.33,debt:.65,rate:.01,inflation:.02,unemployment:.05,openness:.5,regime:"float",target:.02,credit:1,split:{defence:.07,welfare:.37,health:.19,education:.12,infrastructure:.08,science:.03,administration:.11,subsidies:.03},sectorWeights:{},popGrowth:{rich:.003,poor:.02}},2026:{frontierPc:9e4,frontierGrowth:.017,revenueShare:.33,debt:.7,rate:.04,inflation:.03,unemployment:.05,openness:.5,regime:"float",target:.02,credit:1,split:{defence:.085,welfare:.36,health:.19,education:.12,infrastructure:.08,science:.03,administration:.105,subsidies:.03},sectorWeights:{technology:1.15},popGrowth:{rich:.003,poor:.018}}},lo={1900:{USA:[.1,.05,.03,.05,.03],GBR:[.47,.04,.03,.025,.02],FRA:[.9,.03,.02,.04,.02],DEU:[.35,.05,.03,.02,.03],RUS:[.55,.055,.03,.05,.03],JPN:[.25,.08,.05,.04,.02],ITA:[1,.05,.01,.05,.02],AUT:[.65,.045,.02,.04,.025],OTT:[.9,.08,.02,.05,.01],CHN:[.1,.1,.02,.1,.005]},1914:{USA:[.03,.05,.01,.08,.01],GBR:[.27,.03,.01,.03,.01],FRA:[.65,.035,.02,.03,.02],DEU:[.5,.04,.02,.03,.02],RUS:[.47,.06,.03,.05,.035],AUT:[.6,.05,.02,.04,.02],ITA:[.75,.055,.02,.06,.015],JPN:[.6,.07,.02,.04,.02],OTT:[.8,.08,.03,.06,.005]},1930:{USA:[.17,.035,-.03,.087,-.05],GBR:[1.7,.035,-.04,.11,-.01],FRA:[1,.035,0,.03,.01],DEU:[.25,.05,-.04,.15,-.02],USS:[.1,.06,.1,.03,.07],JPN:[.45,.055,-.1,.05,-.01],ITA:[.9,.055,-.04,.08,-.01],CAN:[.5,.045,-.03,.09,-.04],ARG:[.3,.06,-.03,.08,-.04],AUS:[.65,.055,-.05,.14,-.05],CHN:[.1,.1,.02,.1,.01]},1950:{USA:[.94,.0175,.01,.052,.087],GBR:[2,.02,.03,.015,.035],FRA:[.3,.025,.1,.02,.07],DEU:[.2,.04,-.06,.08,.1],JPN:[.15,.05,.2,.02,.1],ITA:[.3,.04,0,.09,.07],USS:[.15,.04,-.05,.01,.1],CHN:[.05,.06,.3,.1,.1],IND:[.3,.03,.03,.05,.02],CAN:[.8,.02,.03,.035,.05],ARG:[.35,.06,.25,.03,0],BRA:[.2,.08,.1,.05,.06]},1990:{USA:[.55,.08,.054,.056,.019],GBR:[.27,.14,.095,.069,.007],FRA:[.35,.095,.034,.09,.029],DEU:[.4,.08,.027,.06,.05],ITA:[.95,.12,.065,.1,.02],ESP:[.43,.145,.067,.16,.038],JPN:[.63,.06,.03,.021,.049],CAN:[.72,.125,.048,.081,.002],USS:[.2,.05,.05,.01,-.02],CHN:[.1,.09,.03,.025,.039],IND:[.75,.1,.09,.06,.055],BRA:[.4,1.5,15,.045,-.04],ARG:[.6,1,13,.07,-.02],MEX:[.45,.35,.27,.03,.05],KOR:[.15,.1,.086,.025,.09],SAU:[.4,.08,.02,.05,.08],IRQ:[1.2,.1,.5,.1,-.5]},2010:{USA:[.95,.0025,.016,.098,.027],GBR:[.75,.005,.033,.079,.019],FRA:[.85,.01,.015,.093,.019],DEU:[.82,.01,.011,.07,.042],ITA:[1.19,.01,.015,.084,.017],ESP:[.6,.01,.018,.2,0],GRC:[1.47,.01,.047,.13,-.055],PRT:[1,.01,.014,.11,.017],IRL:[.85,.01,-.016,.14,.018],JPN:[2.07,.001,-.007,.051,.041],CAN:[.85,.0075,.018,.081,.031],CHN:[.33,.0531,.033,.041,.106],IND:[.67,.05,.1,.08,.085],RUS:[.11,.0775,.069,.074,.045],BRA:[.63,.0875,.05,.08,.075],MEX:[.42,.045,.042,.053,.05],KOR:[.3,.02,.03,.037,.068],AUS:[.2,.0375,.028,.052,.024],TUR:[.4,.065,.086,.11,.084],ZAF:[.35,.07,.043,.25,.03],SAU:[.08,.02,.038,.055,.05],IDN:[.25,.065,.051,.07,.062]},2020:{USA:[1.08,.0025,.012,.08,-.028],GBR:[.85,.001,.009,.046,-.1],FRA:[.98,0,.005,.08,-.08],DEU:[.6,0,.004,.038,-.04],ITA:[1.34,0,.001,.092,-.09],ESP:[.95,0,0,.155,-.11],JPN:[2.36,-.001,0,.028,-.042],CAN:[.88,.0075,.007,.095,-.05],CHN:[.57,.0385,.03,.052,.022],IND:[.74,.0515,.06,.08,-.06],RUS:[.14,.06,.03,.058,-.027],BRA:[.76,.0375,.033,.135,-.033],MEX:[.45,.065,.034,.044,-.082],KOR:[.42,.0125,.005,.039,-.007],AUS:[.45,.005,.009,.065,-.002],TUR:[.33,.1075,.12,.13,.019],ZAF:[.62,.0525,.033,.29,-.06],SAU:[.23,.0175,.034,.075,-.04],ARG:[.9,.38,.42,.115,-.1],IDN:[.3,.045,.02,.06,-.02]},2026:{USA:[1.24,.0375,.029,.044,.02],GBR:[1.03,.0375,.034,.05,.013],FRA:[1.15,.02,.01,.077,.008],DEU:[.65,.02,.022,.038,.009],ITA:[1.37,.02,.012,.06,.007],ESP:[1.01,.02,.028,.104,.021],JPN:[2.35,.0075,.025,.026,.008],CAN:[1.1,.0225,.022,.066,.012],CHN:[.68,.03,0,.051,.046],IND:[.82,.0525,.02,.05,.065],RUS:[.2,.16,.06,.022,.008],UKR:[1.05,.155,.08,.12,.02],BRA:[.92,.15,.045,.054,.018],MEX:[.55,.07,.037,.027,.012],KOR:[.53,.025,.021,.028,.018],AUS:[.5,.036,.03,.043,.021],TUR:[.25,.38,.31,.085,.034],ZAF:[.78,.0675,.035,.32,.015],SAU:[.32,.045,.021,.035,.044],ARG:[.8,.29,.31,.07,.04],IDN:[.41,.0475,.025,.048,.05],ISR:[.7,.0425,.025,.03,.033],IRN:[.35,.23,.45,.09,0],VEN:[1.5,.6,2,.08,.04]}},co={1900:{DEU:{active:600},RUS:{active:1100},FRA:{active:620},GBR:{active:430},AUT:{active:360},ITA:{active:260},USA:{active:125},JPN:{active:150},OTT:{active:200}},1914:{DEU:{active:880},RUS:{active:1350},FRA:{active:910},GBR:{active:390},AUT:{active:450},ITA:{active:300},USA:{active:100},JPN:{active:300},OTT:{active:210},SRB:{active:200}},1930:{USS:{active:560},FRA:{active:500},GBR:{active:340},ITA:{active:300},JPN:{active:270},POL:{active:270},USA:{active:250},DEU:{active:100},CHN:{active:2e3}},1950:{USA:{active:1460,nukes:299},USS:{active:4300,nukes:5},CHN:{active:5e3},GBR:{active:680},FRA:{active:590},TWN:{active:500},PRK:{active:135},KOR:{active:98}},1990:{USS:{active:3400,nukes:37e3},USA:{active:2050,nukes:21400},CHN:{active:3030,nukes:230},IND:{active:1260},IRQ:{active:1e3},PRK:{active:1100},KOR:{active:750},GBR:{active:300,nukes:350},FRA:{active:550,nukes:500},DEU:{active:470},ISR:{active:140,nukes:60},ZAF:{active:70,nukes:6},TUR:{active:650},IRN:{active:500},VNM:{active:1e3},SYR:{active:400},SAU:{active:150}},2010:{CHN:{active:2285,nukes:240},USA:{active:1560,nukes:9400},IND:{active:1325,nukes:80},RUS:{active:1030,nukes:12e3},PRK:{active:1100},KOR:{active:655},PAK:{active:620,nukes:80},IRN:{active:520},TUR:{active:510},GBR:{active:190,nukes:225},FRA:{active:240,nukes:300},ISR:{active:180,nukes:80},DEU:{active:250}},2020:{CHN:{active:2035,nukes:320},IND:{active:1450,nukes:150},USA:{active:1390,nukes:5800},RUS:{active:900,nukes:6375},PRK:{active:1280,nukes:30},PAK:{active:650,nukes:160},KOR:{active:600},IRN:{active:610},TUR:{active:355},GBR:{active:150,nukes:215},FRA:{active:200,nukes:290},ISR:{active:170,nukes:90},DEU:{active:180}},2026:{CHN:{active:2035,nukes:600},IND:{active:1475,nukes:180},USA:{active:1320,nukes:5177},RUS:{active:1500,nukes:5459},UKR:{active:900},PRK:{active:1320,nukes:50},PAK:{active:660,nukes:170},IRN:{active:610},KOR:{active:500},TUR:{active:355},GBR:{active:140,nukes:225},FRA:{active:200,nukes:290},ISR:{active:170,nukes:90},DEU:{active:180}}},uo={USA:-.03,GBR:-.02,CHN:.03,DEU:.05,JPN:.01,KOR:.04,TWN:.1,NLD:.07,CHE:.08,NOR:.1,SAU:.1,ARE:.12,RUS:.06,SGP:.15,QAT:.2,KWT:.2,IRL:.1,IND:-.03,TUR:-.03,BRA:0,AUS:.01,CAN:-.01};class Te{constructor(a){Qe(this,"s");this.s=a>>>0||2654435769}next(){let a=this.s;return a^=a<<13,a>>>=0,a^=a>>17,a^=a<<5,a>>>=0,this.s=a,a/4294967296}float(a,n){return a+this.next()*(n-a)}int(a,n){return Math.floor(this.float(a,n+1))}chance(a){return this.next()<a}normal(){let a=0;for(let n=0;n<12;n++)a+=this.next();return a-6}pick(a){return a[Math.floor(this.next()*a.length)]}weighted(a,n){let i=0;for(const t of a)i+=Math.max(0,n(t));if(i<=0)return this.pick(a);let s=this.next()*i;for(const t of a)if(s-=Math.max(0,n(t)),s<=0)return t;return a[a.length-1]}shuffle(a){for(let n=a.length-1;n>0;n--){const i=Math.floor(this.next()*(n+1));[a[n],a[i]]=[a[i],a[n]]}return a}fork(a){let n=2166136261^this.s;for(let i=0;i<a.length;i++)n^=a.charCodeAt(i),n=Math.imul(n,16777619);return new Te(n>>>0)}get state(){return this.s}set state(a){this.s=a>>>0}}const m=(e,a,n)=>e<a?a:e>n?n:e,z=e=>m(e,0,1),F=(e,a,n)=>e+(a-e)*z(n),Ca=["economy","tax","welfare","health","education","environment","defence","immigration","foreign-policy","justice","technology","housing","energy","transport","agriculture","labour"],mo={economy:"Finance Minister",tax:"Minister for Taxation",welfare:"Minister for Social Welfare",health:"Minister of Health",education:"Minister of Education",environment:"Minister of the Environment",defence:"Minister of Defence",immigration:"Minister for Immigration","foreign-policy":"Foreign Minister",justice:"Minister of Justice",technology:"Minister for Technology",housing:"Minister for Housing",energy:"Minister of Energy",transport:"Minister of Transport",agriculture:"Minister of Agriculture",labour:"Minister of Labour"},ho=["constitutional-monarchy","parliamentary-republic","semi-presidential-republic","presidential-republic","federal-republic"],po=["absolute-monarchy","one-party-state","military-junta","theocracy","occupied-territory","monarchy-absolute-colonial","dependency","protectorate","mandate-colony"];function ke(e){return ho.includes(e)}function Na(e){return po.includes(e)}const yo={1950:{USA:.01,GBR:-.03},1990:{USA:.04,ITA:.11,JPN:-.02,DEU:.02,FRA:.02,GBR:0,USS:.06},2010:{USA:.11,GBR:.1,JPN:.08,FRA:.07,GRC:.15,ESP:.1,IRL:.14,PRT:.1,ITA:.05,DEU:.04,CHN:.02,IND:.08,RUS:.04,BRA:.03},2020:{USA:.06,GBR:.03,JPN:.03,FRA:.03,ITA:.02,DEU:-.01,CHN:.05,IND:.07},2026:{USA:.06,GBR:.045,JPN:.025,FRA:.055,ITA:.03,DEU:.025,CHN:.07,IND:.08,BRA:.08,RUS:.03,UKR:.2}},go={1900:1900,1914:1916,1930:1932,1950:1952,1990:1992,2010:2012,2020:2020,2026:2028},fo={USA:"USD",GBR:"GBP",FRA:"FRF",DEU:"DEM",JPN:"JPY",CHN:"CNY",RUS:"RUB",USS:"SUR",IND:"INR",BRA:"BRL",CAN:"CAD",AUS:"AUD",MEX:"MXN",KOR:"KRW",ITA:"ITL",ESP:"ESP",ARG:"ARS",CHE:"CHF",ZAF:"ZAR",TUR:"TRY",SAU:"SAR",IDN:"IDR",SWE:"SEK",NOR:"NOK",DNK:"DKK",NLD:"NLG",OTT:"TRL",AUT:"ATK"},Ea=new Set("AUT BEL CYP FIN FRA DEU GRC IRL ITA LUX MLT NLD PRT SVK SVN ESP".split(" ")),gn=new Set([...Ea,"EST","LVA","LTU","HRV"]),Po=new Set("USA GBR DEU JPN CHE CAN AUS NZL SWE NOR DNK KOR CHL ISR MEX BRA IND ZAF POL CZE HUN".split(" ")),Yn=new Set("SAU ARE KWT QAT BHR OMN IRQ IRN".split(" ")),So=new Set("RUS NGA DZA AGO VEN KAZ AZE NOR GAB TKM MNG BOL CHL PER ZMB ZWE LBY GNQ COG TTO BRN".split(" "));function Ao(e){const a=new Map;for(const t of e)for(const o of t.lands)a.set(o,t.id);const n={ERI:"ETH",SSD:"SDN",HKG:"CHN",PRI:"USA",PAN:"COL",TLS:"IDN",XKX:"SRB"},i=(t,o=0)=>{const r=a.get(t);if(r)return r;if(o>3)return;const l=n[t]??fa[t];return l?i(l,o+1):void 0},s={};for(const t of sa){const o=i(t.iso3);o&&(s[t.numeric]=o)}for(const t of Object.keys(fa))if(/^\d{3}$/.test(t)){const o=i(fa[t]);o&&(s[t]=o)}for(const[t,o]of Object.entries(oi)){const r=i(o);r&&(s[t]=r)}return s["Siachen Glacier"]=i("IND")??"",s["Indian Ocean Ter."]=i("AUS")??"",s[732]=i("ESH")??"",s}const bo={1990:0,2010:1,2020:2,2026:3};function Ro(e,a){var i;return((i={1900:{africa:.2,americas:.22,asia:.28,europe:.6,"middle-east":.18,oceania:.25},1914:{africa:.23,americas:.28,asia:.31,europe:.66,"middle-east":.2,oceania:.3},1930:{africa:.26,americas:.34,asia:.36,europe:.72,"middle-east":.22,oceania:.36},1950:{africa:.36,americas:.47,asia:.46,europe:.78,"middle-east":.32,oceania:.5}}[e])==null?void 0:i[a])??1}function Mo(e,a){const n=bo[a],i=Ge[e],s=En[e];if(n!==void 0)return i?{pop:i.pop[n],gdp:i.gdp[n]}:s?{pop:s.pop[n],gdp:s.gdp[n]}:{pop:0,gdp:0};const t=((i==null?void 0:i.pop[0])??(s==null?void 0:s.pop[0])??0)*Ro(a,(i==null?void 0:i.region)??"europe"),o=oa[a].frontierPc*.12;return{pop:t,gdp:t*o/1e3}}function vo(e,a){let n=e.popM,i=e.gdpB;if(n===void 0||i===void 0){let s=0,t=0;for(const o of e.lands){const r=Mo(o,a);s+=r.pop,t+=r.gdp}n??(n=s),i??(i=t)}return{pop:Math.max(.001,n),gdp:Math.max(5e-4,i)}}function Co(e,a){for(const i of e.lands){const s=Ge[i]??En[i];if(s)return{lat:s.lat,lon:s.lon}}const n=a.regions.find(i=>i.owner===e.id);if(n){const i=n.ring.reduce((t,o)=>t+o[0],0)/n.ring.length;return{lat:n.ring.reduce((t,o)=>t+o[1],0)/n.ring.length,lon:i}}return{lat:0,lon:0}}function No(e,a,n,i){return i>=1950&&Yn.has(e)?"oilstate":i>=1950&&So.has(e)?"resource":["LUX","SGP","HKG","IRL","CYP","PAN","MUS"].includes(e)&&i>=1990?"taxhaven":["MCO","SMR","VAT","LIE","AND","BRB"].includes(e)?"sanctuary":n==="one-party-state"&&a<.35&&i>=1930?i>=1990?"command":"planned":n==="one-party-state"?"planned":a>.72?i<1950||i<1990?"industrial":"postindustrial":a>.45?i<1950?"industrial":"service":a>.18?(i<1950,"mixed"):a>.08?i<1950?"agrarian":"industrial":"agrarian"}const Eo={agriculture:.05,mining:.45,manufacturing:.3,energy:.55,utilities:.7,construction:.12,transport:.35,retail:.2,finance:.45,"real-estate":.08,telecom:.75,technology:.6,healthcare:.3,education:.1,defence:.7,tourism:.1,media:.4};function Go(e,a,n,i,s){const t={};for(const u of ga){const c=e.mix[u]??.004;t[u]=c*(a.sectorWeights[u]??1)*s.float(.9,1.1)}const o=Object.values(t).reduce((u,c)=>u+c,0),r={};let l=0;for(const u of ga){const c=t[u]/o;r[u]=c*Me[u].labourIntensity,l+=r[u]}return ga.map(u=>{const c=t[u]/o,d=n*c,p=Math.round(i*r[u]/l),y=Me[u];return{id:u,share:c,growth:y.growth*.6,productivity:p>0?d/p:0,employment:p,stateSubsidy:0,stateOwnership:u==="utilities"||u==="education"?Math.max(e.stateOwnership,.4):e.stateOwnership,output:d,quantity:d,capacity:d*1.02,price:1,wage:p>0?d*.58/p:0,margin:y.margin,concentration:Eo[u],regulation:.3}})}const ko={working:"Working households",middle:"Middle class",wealthy:"Wealthy households"};function Zn(e){const a=m(.3-(e-.35)*.55,.06,.38),n=m(.28+(e-.35)*.95,.15,.72);return{working:a,middle:Math.max(.1,1-a-n),wealthy:n}}function Do(e,a){const n=Zn(e),i={working:.5,middle:.4,wealthy:.1},s={working:.02,middle:.1,wealthy:.3};return["working","middle","wealthy"].map(t=>{const o=a*.7*n[t]/i[t];return{id:t,label:ko[t],popShare:i[t],incomeShare:n[t],income:o,realIncome:o,costOfLiving:1,savingsRate:s[t],satisfaction:.55}})}function qn(e,a,n,i,s,t){const o=a*.55,r=a*.28,l=u=>m(1-t*.5-Math.max(0,u-.45)*.7,.2,1);return{income:e.income*o*.8*l(e.income),payroll:e.payroll*o*l(e.payroll),corporate:e.corporate*r*.75*l(e.corporate),vat:e.vat*n*.8*l(e.vat),tariff:e.tariff*i*.85,royalty:e.royalty*s}}function Bo(e,a,n,i,s,t,o){var Xe,_e;const r=s*1e6,l=t*1e9,u=l/r,c=m(u/i.frontierPc,.005,1.6),d=(Xe=lo[n])==null?void 0:Xe[e],p=hn[No(e,c,a.government,n)]??hn.mixed,y=!!a.overlord,S=m(.42+c*.12+(n>=1990?.04:0),.38,.62),R=d?d[3]:m(i.unemployment*(c<.2?1.2:1)*o.float(.8,1.2),.015,.25),b=r*S*(1-R),M=Go(p,i,l,b,o),h=m((1-Math.min(1,c))*.55+o.float(-.08,.08)+(y?.1:0),.04,.85),f=m(.32+(1-Math.min(1,c))*.14+(n<1950?.1:0)+(a.government==="one-party-state"?-.06:0)+o.float(-.04,.04),.22,.72),k=m(i.revenueShare*(.55+.75*Math.sqrt(Math.min(1,c)))*(y?.55:1)*(p.stateOwnership>.6?1.25:1),.03,.55),g=d?d[0]:m(i.debt*(.5+.8*Math.min(1,c))*o.float(.7,1.3)*(y?.4:1),.02,2),N=d?d[2]:i.inflation+o.float(-.008,.012)+(c<.2&&n>=1950?.03:0),B=d?d[1]:Math.max(0,i.rate+(c<.25?.03:0)+o.float(-.005,.005)),T=d?d[4]:i.frontierGrowth+(1-Math.min(1,c))*.012+o.float(-.01,.01),Y=m(i.openness*(p.openness/.5)*(s>200?.6:s<5?1.5:1)*o.float(.9,1.1),.04,1.6),$=n>=1950?uo[e]??(c<.2?-.03:0):0,ee=l*(Y+$)/2,Q=l*(Y-$)/2,L=g*l*(B*.4+i.rate*.6+(c<.25?.015:0)),H=y?0:((_e=yo[n])==null?void 0:_e[e])??(n>=2010?.03:n>=1950?.015:.005),ae=Math.max(l*.025,k*l-L+l*H),q={...i.split};(a.government==="one-party-state"||a.government==="military-junta")&&(q.defence*=1.6,q.welfare*=.8),y&&(q.defence*=.5,q.administration*=1.5);const pe=Object.values(q).reduce((le,ye)=>le+ye,0),K=Object.fromEntries(Object.entries(q).map(([le,ye])=>[le,ye/pe*ae/l])),Ce=l*(K.defence+K.health+K.education+K.infrastructure+K.science+K.administration),Z=l*m(.14+c*.06+T*1.2+(a.government==="one-party-state"?.08:0),.06,.42),me=Math.max(l*.3,l-Z-Ce-ee+Q),X=n<1930?{income:.02,corporate:.02,vat:.07,payroll:0,tariff:.2,royalty:.1}:n<1990?{income:n<1950?.06:.16,corporate:n<1950?.1:.32,vat:.07,payroll:n<1950?.01:.05,tariff:.15,royalty:.15}:{income:.2,corporate:.24,vat:.14,payroll:.11,tariff:n===1990?.08:.04,royalty:.2},Se=M.filter(le=>le.id==="mining").reduce((le,ye)=>le+ye.output,0),ne=qn(X,l,me,Q,Se,h),Ye=Object.values(ne).reduce((le,ye)=>le+ye,0),ie=m(k*l/Math.max(1,Ye),.15,2.4),Ze={income:m(X.income*ie,0,.7),corporate:m(X.corporate*ie,0,.6),vat:m(X.vat*ie,0,.3),payroll:m(X.payroll*ie,0,.35),tariff:m(X.tariff*(ie*.5+.5),0,.6),royalty:m(X.royalty*ie,0,.7)},qe=n<1950?n===1930&&["USS"].includes(e)?"command":"gold":n>=2010&&(n>=2026?gn:Ea).has(e)?"union":p.stateOwnership>.75?"command":Yn.has(e)||["HKG","PAN","ECU","SLV","BHS","BRB"].includes(e)||n===1950&&e!=="USA"?"peg":"float",ha=B*.4+i.rate*.6+(c<.25?.015:0);return{gdp:l,gdpPerCapita:u,gdpGrowth:T,nominalGrowth:(1+T)*(1+N)-1,population:r,productivity:m(c*80,4,100),debtRatingScore:m(80-g*22-h*40,3,99),fiscal:{revenue:k*l,taxIncome:ne.income*ie,corporateTax:ne.corporate*ie,vat:ne.vat*ie,tariffs:ne.tariff*ie,resourceRent:ne.royalty*ie,expenditure:ae+L,military:K.defence*l,welfare:K.welfare*l,infrastructure:K.infrastructure*l,education:K.education*l,healthcare:K.health*l,administration:K.administration*l,debtService:L,debt:g*l,debtToGdp:g,creditRating:m(.82-g*.2-h*.5,.05,.98),budgetBalanceRatio:(k*l-ae-L)/l,treasury:l*.02},monetary:{policyRate:B,moneySupply:1,inflation:N,reserveRatio:.08,centralBankRate:B,exchangeRateVsUsd:1,currencyConfidence:m(70-N*200-h*25,5,95)},labour:{unemployment:R,participation:S,unionisation:m(p.unionisation*(n<1930?.3:n<1990?1.1:.7),.02,.9),medianWage:u*.74,wageGrowth:T+N,strikeRisk:.05,satisfaction:.55},trade:{exports:ee,imports:Q,tradeBalance:ee-Q,exportPartners:[],importPartners:[],tradeOpenness:Y*100,tariffRate:Ze.tariff,flows:{}},sectors:M,history:[],corruption:h,inequality:f,netForeignAssets:l*($*4+o.float(-.1,.1)),reserves:l*m(.04+Math.abs($)*($>0?3:0)+o.float(0,.04),.01,.6),rd:l*K.science*2,macro:{potential:l*(1-m(T<0?T:0,-.1,0)),realGdp:l,priceLevel:1,outputGap:m(T<0?T:0,-.1,0),capital:l*m(1.6+c,1.2,3.2),tfpGrowth:0,potentialGrowth:0,expectedInflation:m(N,-.03,1),nairu:m(R-(T<0?.015:0),.015,.28),consumerConfidence:50,businessConfidence:50,neutralRate:.01,bondYield:Math.max(B,i.rate)+.01,riskPremium:.01,debtCost:ha,credit:i.credit*m(.4+c,.3,1.7),npl:.03,housePrice:100,currentAccount:ee-Q,realExchange:0,openness:Y,structuralTradeBalance:$,deficitAnchor:(ae+L-k*l)/l,shock:0,shockDecay:1,minimumWage:n<1950?0:m(.3+o.float(0,.2),0,.6),popGrowth:i.popGrowth.poor+(i.popGrowth.rich-i.popGrowth.poor)*Math.min(1,c),baseBudget:{...K},realHistory:[],priceHistory:[]},tax:Ze,budget:K,centralBank:{independent:n>=1990?Po.has(e)||n>=2010&&(n>=2026?gn:Ea).has(e):["USA","GBR","DEU","CHE"].includes(e)&&n>=1914,regime:qe,target:i.target,credibility:m(.85-h*.8-Math.max(0,N-.1),.05,.95),qe:n===2020?.15:n===2026?.2:n===2010?.1:0,printing:0,currency:qe==="union"?"EUR":fo[e]??"LCU"},accounts:{consumption:me,investment:Z,government:Ce,exports:ee,imports:Q},households:Do(f,u)}}function To(e,a,n,i,s,t,o){var p;const r=(p=co[n])==null?void 0:p[e],l=r!=null&&r.active?r.active*1e3:Math.round(i*1e6*(a==="one-party-state"||a==="military-junta"?.008:.0045)),u=(r==null?void 0:r.nukes)??0,c=()=>m(o.float(30,80),5,100),d=y=>({active:Math.round(l*y),quality:c()});return{activeDuty:l,reserves:Math.round(l*o.float(.8,2.5)),spend:s*t,readiness:m(o.float(45,85),10,100),doctrine:o.float(-30,30),nuclearArsenal:u,branches:{army:d(.68),navy:d(.14),"air-force":d(n<1930?0:.14),marines:d(.02),space:d(n<1990?0:.003),cyber:d(n<2010?0:.005),nuclear:{active:u,quality:u?m(o.float(60,95),10,100):0}},morale:o.float(50,85),veterans:Math.round(l*o.float(.2,.9)),conscription:n<1990?!0:o.chance(.35),burden:t}}function Io(e,a,n,i){const s=!!e.overlord,t=(n==null?void 0:n.seats)??m(Math.round(40+Math.sqrt(a)*28),30,650);if(!(!i&&!(n!=null&&n.chamber))&&!(s&&!(n!=null&&n.chamber)&&e.status!=="dominion"))return{id:"chamber-1",name:(n==null?void 0:n.chamber)??(e.government==="one-party-state"?"People's Assembly":"National Parliament"),kind:"lower",seats:t,districtSeats:t,prSeats:0,districtThreshold:0,moneyBills:!0,vetoOverride:!1,termDays:Math.round(((n==null?void 0:n.termYears)??4)*365),election:i?"fptp":"none",confirmsAppointments:!1}}function Uo(e,a){const n=/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/.exec(e);return n?`hsl(${n[1]} ${Math.max(14,Number(n[2])-10)}% ${m(Number(n[3])+a,18,82)}%)`:e}const Lo={GBR:"hsl(350 62% 52%)",FRA:"hsl(218 58% 48%)",DEU:"hsl(30 18% 42%)",DDR:"hsl(4 48% 40%)",RUS:"hsl(135 32% 40%)",USS:"hsl(0 72% 42%)",AUT:"hsl(42 50% 50%)",OTT:"hsl(165 36% 34%)",ITA:"hsl(95 34% 42%)",USA:"hsl(208 54% 52%)",JPN:"hsl(355 54% 60%)",CHN:"hsl(358 72% 50%)",ESP:"hsl(28 66% 46%)",PRT:"hsl(150 44% 36%)",NLD:"hsl(24 80% 52%)",BEL:"hsl(52 56% 42%)",YUG:"hsl(204 30% 46%)",CSK:"hsl(250 30% 50%)",POL:"hsl(340 42% 62%)"};function Oo(e,a,n,i,s){var y;const t=(y=zn[i])==null?void 0:y[e.id],o=S=>Object.fromEntries(Ca.map(R=>[R,m(S+s.normal()*12,-100,100)])),r=(S,R,D,b,M,h,f)=>({id:`${e.id}-party-${S}`,country:e.id,name:R,abbreviation:D,ideology:b,cohesion:s.float(55,92),popularity:30,color:M,seats:n?{[n.id]:h}:{},treasury:0,memberCount:0,status:f?a?"government":"ruling":"outside",platform:o(b),founded:0});if(t!=null&&t.parties.length){const S=(n==null?void 0:n.seats)??t.parties.reduce((b,M)=>b+M.seats,0),R=t.parties.reduce((b,M)=>b+M.seats,0)||1;return t.parties.map((b,M)=>{const h=r(M,b.name,b.abbr,b.ideology,b.colour,Math.round(b.seats/R*S),b.ruling);return h.popularity=b.seats/R*100,h})}const l=e.rulingParty;if(!a){const S=l??(e.government==="absolute-monarchy"?"Royal Court":e.government==="military-junta"?"Armed Forces":e.government==="theocracy"?"Clerical Establishment":e.overlord?"Colonial Administration":"Ruling Establishment"),R=r(0,S,fn(S),e.ideology,"#7f1d1d",(n==null?void 0:n.seats)??0,!0);return R.popularity=60,[R]}const u=(n==null?void 0:n.seats)??100,c=Math.round(u*s.float(.5,.64)),d=r(0,l??"Governing Bloc",fn(l??"Governing Bloc"),e.ideology,"#2563eb",c,!0),p=r(1,"Opposition Bloc","OPP",m(e.ideology+(e.ideology>=0?-28:28),-100,100),"#c0392b",u-c,!1);return d.popularity=c/u*100,p.popularity=100-d.popularity,[d,p]}function fn(e){const a=e.replace(/[^A-Za-z\s]/g,"").split(/\s+/).filter(n=>n.length>2||/^[A-Z]+$/.test(n));return a.length?a.length===1?a[0].slice(0,4).toUpperCase():a.slice(0,4).map(n=>n[0].toUpperCase()).join(""):"GOV"}function xo(e,a,n=0){return{competence:Math.round(m(e.normal()*20+25+n,-100,100)),charisma:Math.round(m(e.normal()*24+15+n,-100,100)),integrity:Math.round(m(e.normal()*28,-100,100)),ambition:Math.round(m(e.normal()*24+30,-100,100)),ideology:Math.round(m(a+e.normal()*8,-100,100)),popularity:Math.round(m(e.normal()*18+48,0,100)),experience:Math.round(m(e.normal()*18+62,0,100)),militancy:Math.round(m(e.normal()*24,-100,100))}}function Fo(e,a,n){const i=e.startDate.year,s={id:a,name:n,government:"parliamentary-republic",ideology:0,bloc:"none",popM:10,gdpB:10*oa[i].frontierPc*.4/1e3,hos:"Interim President",hog:"Interim Prime Minister",lands:[]},t=[],o={year:i,startDate:e.startDate};return{country:Xn(s,o,oa[i],new Te(e.seed^a.length),t,e),characters:t}}function Xn(e,a,n,i,s,t){var Ce;const o=a.year,{pop:r,gdp:l}=vo(e,o),u=Bo(e.id,e,o,n,r,l,i),c=ke(e.government)&&!e.overlord,d=e.status==="dominion"&&ke(e.government),p=(Ce=zn[o])==null?void 0:Ce[e.id],y=Io(e,r,p,c||d),S=Oo(e,c||d,y,o,i),R=S.find(Z=>Z.status!=="outside")??S[0],D=dn[e.government]??dn["parliamentary-republic"],b=(Z,me,X,Se=12)=>{const ne={id:`ch-${e.id}-${s.length}`,name:me,country:e.id,role:Z,partyId:X,stats:xo(i,e.ideology,Se),historical:!0,createdAt:0};return s.push(ne),ne},M=b("head-of-state",e.hos||"Vacant",R==null?void 0:R.id,18),h=!e.hog&&(e.government==="presidential-republic"||e.government==="federal-republic"||e.government==="confederation"),f=e.hog?b("head-of-government",e.hog,R==null?void 0:R.id,16):h?M:void 0;R&&(R.leaderId=(f??M).id);const k=Ca.map(Z=>({id:Z,title:mo[Z],partyId:R==null?void 0:R.id,characterId:void 0})),g=p==null?void 0:p.cabinet,N=(Z,me)=>{if(!me)return;const X=k.find(Se=>Se.id===Z);X&&(X.characterId=b("minister",me,R==null?void 0:R.id,10).id)};N("economy",g==null?void 0:g.economy),N("foreign-policy",g==null?void 0:g.foreign),N("defence",g==null?void 0:g.defence),g!=null&&g.centralBank&&b("central-banker",g.centralBank,void 0,18);const B=y?{chambers:[y],membership:{[y.id]:[]},committees:[],session:1,activeBills:[]}:void 0,T=To(e.id,e.government,o,r,l*1e9,u.budget.defence,i),Y=Co(e,t),$=Ge[e.id],ee=Lo[e.id]??ri(e.id),Q=((p==null?void 0:p.termYears)??4)*365,L=p==null?void 0:p.nextElectionYear,H=Date.UTC(a.startDate.year,a.startDate.month-1,a.startDate.day),ae=c||d?L&&Date.UTC(L,10,5)>H?(Date.UTC(L,10,5)-H)/1e3:i.float(.15,1)*Q*86400:void 0,q=h&&(c||d),pe=e.id==="USA"?go[o]:void 0,K=q?pe?(Date.UTC(pe,10,5)-H)/1e3:i.float(.2,1)*1825*86400:void 0;return{id:e.id,iso2:($==null?void 0:$.iso2)??"",isoNumeric:($==null?void 0:$.numeric)??"",name:e.name,demonym:e.name,continent:($==null?void 0:$.continent)??"Europe",region:($==null?void 0:$.region)??Ho(e.lands),mapColor:ee,government:e.government,headOfStateTitle:e.hosTitle??D.hos,headOfGovernmentTitle:e.hogTitle??D.hog,legislature:B,executive:{headOfStateId:M.id,headOfStateTitle:e.hosTitle??D.hos,headOfGovernmentId:f==null?void 0:f.id,headOfGovernmentTitle:e.hogTitle??D.hog,ministers:k,coalition:S.filter(Z=>Z.status!=="outside").map(Z=>Z.id),approval:m(i.float(38,62),5,95),confidence:60,emergencyPowers:!1},parties:S,courts:[],referendums:[],elections:[],military:T,economy:u,relations:{},alliances:[],wars:[],dependencies:{},overlord:e.overlord,ideology:e.ideology,bloc:e.bloc,cohesion:i.float(50,90),unrestRisk:.02,unrest:[],flagEmoji:"",nukes:T.nuclearArsenal??0,sanctions:[],policies:Object.fromEntries(Ca.map(Z=>[Z,m(e.ideology+i.normal()*10,-100,100)])),lands:e.lands,lat:Y.lat,lon:Y.lon,nextElectionAt:ae,electionTermDays:Q,nextPresidentialAt:K,tradeBarriers:{},rulingPartyName:e.rulingParty}}function Ho(e){for(const a of e)if(Ge[a])return Ge[a].region;return"europe"}const Pn={PHL_REB:"First Philippine Republic",COL_REB:"Liberal Rebels",MEX_REB:"Constitutionalists",CHN_REB:"Anti-Chiang Coalition",LBY_REB:"Senussi Resistance",MLY_REB:"Malayan National Liberation Army",AFG_REB:"Afghan Insurgents",LBR_REB:"National Patriotic Front",ETH_REB:"Eritrean and Tigrayan Fronts",IRQ_REB:"Iraqi Insurgents",SOM_REB:"Al-Shabaab",SYR_REB:"Syrian Opposition",YEM_REB:"Houthi Movement",SDN_REB:"Rapid Support Forces",MMR_REB:"Resistance Forces"},Sa={1930:e=>["USA","DEU","CAN","AUS","ARG","BRA","POL","AUT","CSK","CHL"].includes(e)?{shock:-.14,decay:.3}:e==="USS"?null:{shock:-.05,decay:.35},2010:e=>["GRC","ESP","PRT","IRL","ITA"].includes(e)?{shock:-.03,decay:.6}:null,2020:()=>({shock:-.1,decay:1.6})};function Ga(e,a,n,i,s){var y,S,R,D,b,M;const t=new Te(e.params.seed),o=e.year,r=oa[o],l=so[o];if(!l||!r)throw new Error(`No historical data for ${o}`);const u={id:n,name:a,scenarioId:e.id,seed:e.params.seed,t:0,epoch:e.epoch,startDate:e.startDate,daysPerSecond:e.daysPerSecond,paused:!0,speed:1,params:{...e.params},countries:{},parties:{},characters:{},companies:{},exchanges:{},markets:{exchanges:[],sentiment:"neutral",riskAppetite:((y=e.overrides.global)==null?void 0:y.riskAppetite)??50,creditSpreads:o<=1930?.02:.012,commodityPrices:{...si,...(S=e.overrides.global)==null?void 0:S.commodityPrices}},wars:{},treaties:{},sanctions:{},bills:{},events:[],ticker:[],globals:{globalGdp:0,globalPopulation:0,globalInflation:0,worldHappiness:55,worldConflictIndex:0,coldWarIndex:0},directives:[],scenarioOverrides:JSON.parse(JSON.stringify(e.overrides)),customCountries:{},createdAt:i,updatedAt:i,version:1,playerCountry:s,control:Ao(l.polities),regions:l.regions.map(h=>({...h})),commodityMarkets:{},dayCount:0},c=[];for(const h of l.polities){const f=Xn(h,e,r,t,c,u),k=(R=Sa[o])==null?void 0:R.call(Sa,h.id);k&&(f.economy.macro.shock=k.shock,f.economy.macro.shockDecay=k.decay),u.countries[f.id]=f;for(const g of f.parties)u.parties[g.id]=g}for(const h of c)u.characters[h.id]=h;for(const h of l.polities){if(!h.overlord)continue;const f=u.countries[h.overlord],k=u.countries[h.id];if(!f||!k)continue;f.dependencies[h.id]=h.status??"colony";const g=h.status==="dominion"?8:h.status==="occupation"?-8:14;k.mapColor=Uo(f.mapColor,g),h.status!=="dominion"&&h.status!=="occupation"&&(k.bloc=f.bloc)}Ko(u,t),$o(u,t);const d={nyse:["USA"],nasdaq:["USA"],lse:["GBR"],euronext:["FRA","NLD"],dax:["DEU"],nikkei:["JPN"],sse:["CHN"],twse:["TWN"],hkg:["HKG","CHN"],krx:["KOR"],nse:["IND","RAJ"],b3:["BRA"],tsx:["CAN"],asx:["AUS","AUC"],jse:["ZAF","CPC"],bmv:["MEX"],sgx:["SGP"],tadawul:["SAU"],moex:["RUS","USS"],idx:["IDN"],set:["THA"]},p={nyse:1817,nasdaq:1971,lse:1801,euronext:1826,dax:1885,nikkei:1878,sse:1990,twse:1961,hkg:1891,krx:1956,nse:1875,b3:1890,tsx:1861,asx:1871,jse:1887,bmv:1894,sgx:1973,tadawul:2007,moex:1995,idx:1977,set:1975};for(const h of li){if((p[h.id]??0)>o)continue;const f=(d[h.id]??[h.country]).find(g=>u.countries[g]);if(!f)continue;const k={id:h.id,name:h.name,country:f,index:1e3,indexYearAgo:1e3,listings:[],volatility:m(t.float(10,28),2,80),breadth:50,marketCap:0,currency:h.currency};u.exchanges[k.id]=k,u.markets.exchanges.push(k)}for(const h of Pi(o)){if(!u.countries[h.country])continue;const f=Jo(h,u,t,e);u.companies[f.id]=f,f.listed&&f.exchangeId&&u.exchanges[f.exchangeId]?(u.exchanges[f.exchangeId].listings.push(f.id),u.exchanges[f.exchangeId].marketCap+=f.valuation):f.listed&&!f.exchangeId&&(f.listed=!1)}for(const[h,f]of Object.entries(u.markets.commodityPrices))u.commodityMarkets[h]={supply:1,demand:1,trend:f,inventory:.25};for(const h of Ai[o]??[]){const f={},k={};for(const[N,B]of Object.entries(h.belligerents)){const T=B.filter(Y=>u.countries[Y]);if(Pn[N]){const Y=u.countries[N.split("_")[0]];f[N]={id:N,name:N==="LBY_REB"&&o>=2e3?"Libyan National Army":Pn[N],strength:Math.round(((Y==null?void 0:Y.military.activeDuty)??3e4)*t.float(.25,.7))},k[N]=T}else u.countries[N]&&(k[N]=T)}if(Object.keys(k).length<2)continue;const g={id:`war-${ka(h.name)}`,name:h.name,startedAt:h.startedAt,phase:h.phase,belligerents:k,cause:h.cause,fronts:h.fronts.map((N,B)=>({...N,...Si[h.name],id:`front-${B}`,contestedOutput:0,openedAt:0,attritionRate:4e-4})),exhaustion:h.exhaustion??{},casualties:h.casualties??{},materiel:{},warGoal:h.warGoal??"",publicSupport:Object.fromEntries(Object.keys(k).map(N=>[N,t.float(40,70)])),rebels:f};u.wars[g.id]=g;for(const[N,B]of Object.entries(k)){(D=u.countries[N])==null||D.wars.push(g.id);for(const T of B)(b=u.countries[T])!=null&&b.wars.includes(g.id)||(M=u.countries[T])==null||M.wars.push(g.id)}}for(const h of bi[o]??[]){const f=h.parties.filter(N=>u.countries[N]);if(f.length<2)continue;const k={id:`treaty-${ka(h.name)}`,name:h.name,kind:h.kind,parties:f,signedAt:-86400,terms:h.terms,tradeBonus:h.tradeBonus??0,favourability:Object.fromEntries(f.map(N=>[N,t.float(20,60)])),active:!0};u.treaties[k.id]=k;const g=h.kind==="alliance"||h.kind==="defensive-pact"||h.kind==="entente";for(const N of f)for(const B of f){if(N===B)continue;const T=u.countries[N];T.relations[B]=m((T.relations[B]??0)+(g?42:14),-100,100),g&&!T.alliances.includes(B)&&T.alliances.push(B)}}return xe(u),C(u,{kind:"system",severity:"notice",title:`${e.name}: ${e.startDate.year}`,body:`${Object.keys(u.countries).length} polities and ${Object.keys(u.companies).length} corporations.`,tags:["system"]}),u}function Ko(e,a){const n=Object.keys(e.countries);for(const i of n){const s=e.countries[i];for(const t of n){if(i===t)continue;const o=e.countries[t];let r=0;s.bloc===o.bloc&&s.bloc!=="none"&&s.bloc!=="non-aligned"?r+=28:s.bloc!=="none"&&o.bloc!=="none"&&s.bloc!=="non-aligned"&&o.bloc!=="non-aligned"&&(r-=12),s.region===o.region&&(r+=6),(s.overlord===t||o.overlord===i||s.overlord&&s.overlord===o.overlord)&&(r+=30),Math.hypot((s.lat??0)-(o.lat??0),(s.lon??0)-(o.lon??0))<12&&(r-=6),r-=Math.abs(s.ideology-o.ideology)/100*26,s.relations[t]=Math.round(m(r+a.normal()*8,-100,100))}}}function $o(e,a){const n=Object.keys(e.countries);for(const i of n){const s=e.countries[i],t=[];for(const c of n){if(i===c)continue;const d=e.countries[c],p=Math.max(4,Math.hypot((s.lat??0)-(d.lat??0),(s.lon??0)-(d.lon??0))),y=s.overlord===c||d.overlord===i?12:s.overlord&&s.overlord===d.overlord?4:1,S=.5+((s.relations[c]??0)+100)/200;t.push({id:c,v:d.economy.gdp*y*S*a.float(.8,1.2)/p**1.5})}t.sort((c,d)=>d.v-c.v);const o=t.slice(0,12),r=o.reduce((c,d)=>c+d.v,0)||1,l=s.economy.trade,u=l.exports+l.imports;for(const c of o)l.flows[c.id]=c.v/r*u;l.exportPartners=o.map(c=>c.id),l.importPartners=o.map(c=>c.id)}}function Jo(e,a,n,i){var R,D;const s=Me[e.sector],t=a.countries[e.country],o=s.margin*n.float(.7,1.3),r=e.revenue*n.float(.1,.6),l=r*(t.economy.macro.bondYield+.01),u=(e.revenue*o-l)*(1-t.economy.tax.corporate),c=m(1/Math.max(.03,t.economy.macro.bondYield+.035)+s.techIntensity*18,6,45),d=Math.max(e.revenue*.15,u*c),p=((R=t.economy.sectors.find(b=>b.id===e.sector))==null?void 0:R.output)??e.revenue,y=e.listed?e.exchange&&a.exchanges[e.exchange]?e.exchange:(D=Object.values(a.exchanges).find(b=>b.country===e.country))==null?void 0:D.id:void 0,S=m(d/1e7,4,400);return{id:`co-${ka(e.name)}`,name:e.name,country:e.country,sector:e.sector,tier:d>1e12?"mega-cap":d>2e11?"large":d>2e10?"mid-cap":"small",valuation:d,revenue:e.revenue,costs:e.revenue*(1-o),profit:e.revenue*o,employees:e.employees,debt:r,stateOwnership:e.stateOwnership??0,brandValue:d*.15,sharePrice:S,sharePriceYearAgo:S,board:[],shareholders:[],ownershipFloat:1-(e.stateOwnership??0),listed:!!y,exchangeId:y,founded:((e.foundedYear??i.year-10)-i.year)*365*86400,researchLevel:m(s.techIntensity*n.float(.5,1),0,1),unionisation:n.float(.05,.5),rd:e.revenue*s.techIntensity*.08,environmentalScore:n.float(-40,60),lobbyingPower:m((Math.log10(Math.max(10,d))-7)*16,0,100),dailyVolume:0,shares:d/S,netIncome:u,marketShare:m(e.revenue/Math.max(1,p),0,1),pe:c,playerShares:0}}function ka(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}function xe(e){let a=0,n=0,i=0,s=0,t=0;for(const l of Object.values(e.countries))l.annexedBy||(a+=l.economy.gdp,n+=l.economy.population,i+=m(l.economy.monetary.inflation,-.5,1)*l.economy.gdp,s+=(l.economy.labour.satisfaction*100*.5+l.executive.approval*.5)*l.economy.gdp);for(const l of Object.values(e.wars))l.endedAt||(t+=Object.keys(l.belligerents).length);e.globals.globalGdp=a,e.globals.globalPopulation=n,e.globals.globalInflation=a>0?i/a:0,e.globals.worldHappiness=a>0?s/a:0,e.globals.worldConflictIndex=z(t/30)*100;const o=e.countries.USA,r=e.countries.USS??e.countries.RUS??e.countries.CHN;o&&r&&(e.globals.coldWarIndex=m(50-(o.relations[r.id]??0),0,100))}function C(e,a){const n={id:`ev-${e.dayCount}-${e.events.length}-${Math.round(e.t)}`,t:e.t,at:Date.now(),country:a.country,kind:a.kind,severity:a.severity,title:a.title,body:a.body,actors:a.actors??(a.country?[a.country]:[]),byUserId:a.byUserId,tags:a.tags??[]};return e.events.push(n),e.events.length>600&&e.events.splice(0,e.events.length-600),e.ticker.unshift({t:e.t,text:a.title,kind:a.kind,country:a.country}),e.ticker.length>120&&(e.ticker.length=120),n}function ua(e,a,n){var p,y;if(a.theatre==="none")return null;const[i,s]=a.belligerents,t=(p=e.rebels)==null?void 0:p[i],o=(y=e.rebels)==null?void 0:y[s];if(t||o){const S=t??o,R=t?s:i,D=t?-a.control:a.control,b=S.id.split("_")[0],M=a.theatre??(n[b]?b:R);return n[M]?{holder:S.id,holderName:S.name,territory:M,share:(100-D)/200}:null}const r=a.control>=0?i:s,l=a.control>=0?s:i,u=a.theatre??l,c=n[u],d=n[r];return!c||!d||u===r||c.overlord===r||(e.belligerents[r]??[]).includes(u)?null:{holder:r,holderName:d.name,territory:u,share:Math.abs(a.control)/100}}const se=365*86400,Ie=7/365,Wo={agriculture:.45,mining:.8,manufacturing:.95,energy:.9,utilities:.9,construction:1.1,transport:1.05,retail:1,finance:1.3,"real-estate":1.05,telecom:1.35,technology:1.7,healthcare:1.35,education:1.15,defence:.6,tourism:1.4,media:1.1},Vo={agriculture:.3,mining:.4,manufacturing:1,energy:.3,utilities:.2,construction:.8,transport:.7,retail:1,finance:.6,"real-estate":.5,telecom:.6,technology:1.2,healthcare:.2,education:.3,defence:.1,tourism:1.4,media:.8},wo={working:{agriculture:.3,energy:.1,utilities:.06,"real-estate":.2,retail:.15,transport:.08,healthcare:.05,manufacturing:.06},middle:{agriculture:.14,energy:.07,utilities:.04,"real-estate":.24,retail:.17,transport:.08,healthcare:.08,manufacturing:.08,education:.04,technology:.03,tourism:.03},wealthy:{agriculture:.07,energy:.04,utilities:.02,"real-estate":.28,retail:.14,transport:.05,healthcare:.08,manufacturing:.06,education:.05,technology:.06,finance:.08,tourism:.07}},jo={defence:"defence",healthcare:"health",education:"education",construction:"infrastructure"};function zo(e,a){var o;tr(e,a);const n=e.countries.USA,i=(n==null?void 0:n.economy.monetary.policyRate)??.03,s=(n==null?void 0:n.economy.monetary.inflation)??.02,t=((o=e.countries.DEU)==null?void 0:o.economy.monetary.policyRate)??.02;for(const r of Object.values(e.countries))r.annexedBy||(Yo(e,r,a,i,s,t),er(e,r),ar(r));ir(e,a),or(e,a),rr(e,a),xe(e)}function Yo(e,a,n,i,s,t){var on,rn,sn;const o=a.economy,r=o.macro,l=o.fiscal,u=e.params,c=Ie,d=o.centralBank,p=o.tax,y=o.budget,S=o.gdp,R=Oa(e),D=m(o.gdpPerCapita/Math.max(1,R),.003,1.4),b=z(1-o.corruption),M=r.baseBudget,h=(U,J,qt,ln)=>m(qt*(U/Math.max(1e-4,J)-1),-ln,ln),f=h(y.education,M.education,.006,.01)+h(y.science,M.science,.006,.012)+h(y.infrastructure,M.infrastructure,.005,.008),k=m(-Math.log(D)*.006*b*b*1.4,0,.035),g=o.sectors.reduce((U,J)=>U+J.regulation*J.share,0),N=o.sectors.reduce((U,J)=>U+J.stateOwnership*J.share,0)*.004,B=ur(e,a),T=aa(e,a)*u.sanctionBite*.025,Y=qo(e);r.tfpGrowth=Y*.65+k+f-o.corruption*u.corruptionDrag*.02-o.inequality*u.inequalityDrag*.012-(g-.3)*.01-N-T-B*.5;const $=o.population,ee=p.income+p.payroll,Q=m(.42+D*.12+(e.startDate.year>=1990?.04:0)-Math.max(0,ee-.3)*.12+o.labour.satisfaction*.02,.32,.72);o.labour.participation=F(o.labour.participation,Q,.1*c);const L=m(r.popGrowth-B*.15+(a.policies.immigration??0)*5e-5,-.05,.05);o.population=Math.max(1e3,$*Math.exp(L*c));const ae=o.accounts.investment/Math.max(1e-6,r.priceLevel)/Math.max(1,r.capital)-.05;r.capital=Math.max(1,r.capital*Math.exp(m(ae,-.15,.2)*c)),r.potentialGrowth=m(r.tfpGrowth+.35*ae+.65*L,-.2,.15)*u.growthBias,r.potential*=Math.exp(r.potentialGrowth*c),r.neutralRate=m(.4*Math.max(0,r.potentialGrowth)+.008,.002,.05);const q=o.monetary.inflation,pe=r.neutralRate+d.target+1.5*(q-d.target)+.35*r.outputGap;let K;switch(d.regime){case"union":K=a.id==="DEU"?pe:t;break;case"peg":K=a.id==="USA"?pe:i+Math.max(0,.02-o.reserves/Math.max(1,o.accounts.imports)*.05)+o.corruption*.02;break;case"gold":K=.02+Math.max(0,.05-o.reserves/Math.max(1,o.gdp))*.2+o.corruption*.02;break;case"command":K=a.id===e.playerCountry?o.monetary.centralBankRate:pe;break;default:K=d.independent||a.id!==e.playerCountry?pe-(d.independent?0:.005):o.monetary.centralBankRate}a.id===e.playerCountry&&!d.independent&&d.regime!=="union"&&(K=o.monetary.centralBankRate),K=m(K,-.01,40);const Ce=u.policyRateSmoothing*18*c+(Math.abs(K-o.monetary.policyRate)>.1?.1:0);o.monetary.policyRate=F(o.monetary.policyRate,K,Ce),(d.independent||d.regime!=="float")&&(o.monetary.centralBankRate=o.monetary.policyRate);const Z=Math.max(1,r.realGdp*r.priceLevel/o.monetary.exchangeRateVsUsd),me=l.debt/Z,X=-l.budgetBalanceRatio,Se=Sn[a.id]??0;r.riskPremium=m(Math.max(0,me-.6)*.0055*(1+me)*(1-z(Se*40))*(1.4-z(D))+Math.max(0,X-.03)*.25+Math.max(0,q-.08)*.35+o.corruption*.035+e.markets.creditSpreads*.2+aa(e,a)*.01+(r.defaulted?.08:0)-Se,-.01,.9),r.bondYield=m(Math.max(0,.5*o.monetary.policyRate+.5*(r.neutralRate+r.expectedInflation))+.008+r.riskPremium-d.qe*.01,0,40),r.debtCost=F(r.debtCost,r.bondYield,c/6),l.creditRating=m(.95-r.riskPremium*7,.02,.99),o.debtRatingScore=l.creditRating*100,e.markets.creditSpreads=e.markets.creditSpreads||.01;const ne=o.monetary.policyRate-r.expectedInflation,Ye=r.bondYield-r.expectedInflation,ie=-.45*(.5*(ne-r.neutralRate)+.5*(Ye-r.neutralRate-.012)),Ze=u.fiscalMultiplier*.45*(X-r.deficitAnchor);r.deficitAnchor=F(r.deficitAnchor,X,.3*c);const qe=m((r.credit/Math.max(.05,Ve(e,a))-1)*.04,-.03,.03),ha=Math.max(0,r.npl-.08)*-.25,Xe=(r.consumerConfidence-50)/50*.008+(r.businessConfidence-50)/50*.008,_e=(e.markets.riskAppetite-50)/50*.008,le=Xo(e,a)*m(r.openness*.45,0,.6),ye=-r.realExchange*m(r.openness*.18,0,.3),pa=e.markets.commodityPrices.oil/Math.max(1e-6,((on=e.commodityMarkets.oil)==null?void 0:on.trend)??1),Va=An(o.sectors,"mining")+An(o.sectors,"energy")*.5,mt=(pa-1)*(Va-.06)*.15,dt=B>0?Math.min(.03,y.defence*.1):0,ht=-Math.max(0,p.tariff-.08)*m(r.openness,0,1)*.08;r.shock*=Math.exp(-r.shockDecay*c);const pt=m(ie+Ze+qe+ha+Xe+_e+le+ye+mt+dt+ht+r.shock-B*.8-T*1.2,-.45,.15),yt=(e.params.marketVolatility*.0035+Math.min(.006,o.corruption*.004))*Math.sqrt(c);r.outputGap=m(r.outputGap+3.2*(pt-r.outputGap)*c+n.normal()*yt*2.6,-.55,.2),r.realGdp=Math.max(1,r.potential*(1+r.outputGap));const gt=u.phillipsSensitivity,wa=d.printing*Math.max(0,X)*7,ft=m((r.credit/Math.max(.05,Ve(e,a))-1)*.02,-.01,.04),Pt=m((r.lastDepreciation??0)-r.expectedInflation*.5,-.5,20)*m(r.openness*.3,.03,.4),St=m(pa-1,-.6,2)*.012,At=m(e.markets.commodityPrices.wheat/Math.max(1e-6,((rn=e.commodityMarkets.wheat)==null?void 0:rn.trend)??1)-1,-.6,2)*.008,bt=Math.max(0,p.tariff-.05)*m(r.openness,0,1)*.04,Rt=B>0?Math.min(.02,B*.4):0,Mt=r.expectedInflation+gt*r.outputGap+Pt+St+At+bt+wa+ft+Rt;o.monetary.inflation=m(o.monetary.inflation+3.5*(Mt-o.monetary.inflation)*c+n.normal()*.012*Math.sqrt(c)*(1+Math.abs(q)*3),-.2,30);const ja=d.regime==="peg"||d.regime==="gold"||d.regime==="union",vt=d.regime==="gold"?0:ja?s:d.target,za=ja?Math.max(d.credibility,.85):d.credibility,Ct=za*vt+(1-za)*o.monetary.inflation;r.expectedInflation=F(r.expectedInflation,Ct,1.1*c);const Nt=m((d.independent?.85:.45)+(d.regime==="gold"||d.regime==="union"?.1:0)-Math.abs(o.monetary.inflation-d.target)*2.5-d.printing*.9-o.corruption*.15,.01,.97);d.credibility=F(d.credibility,Nt,.5*c),r.priceLevel*=Math.exp(m(o.monetary.inflation,-.5,80)*c),o.monetary.currencyConfidence=F(o.monetary.currencyConfidence,m(70+r.realExchange*-10-Math.max(0,q-.05)*80-r.riskPremium*150,1,99),.5*c),o.monetary.moneySupply*=Math.exp(m(o.monetary.inflation+r.potentialGrowth+wa,-.3,40)*c);const w=Math.max(1,r.realGdp*r.priceLevel/o.monetary.exchangeRateVsUsd);o.gdp=w,o.gdpPerCapita=w/Math.max(1,o.population),o.productivity=m(o.productivity+r.tfpGrowth*30*c,1,100),r.realHistory.push(r.realGdp),r.priceHistory.push(r.priceLevel),r.realHistory.length>53&&r.realHistory.shift(),r.priceHistory.length>53&&r.priceHistory.shift();const ge=r.realHistory;if(ge.length>=53)o.gdpGrowth=m(ge[ge.length-1]/ge[0]-1,-.7,.6);else{const U=ge.length>8?Math.pow(ge[ge.length-1]/ge[0],52/(ge.length-1))-1:o.gdpGrowth;o.gdpGrowth=m(F(o.gdpGrowth,U,.03),-.7,.6)}o.nominalGrowth=(1+o.gdpGrowth)*(1+o.monetary.inflation)/Math.exp(m(r.lastDepreciation??0,-.5,10))-1;const Ya=o.labour.unionisation,Et=y.welfare/Math.max(.005,M.welfare),Gt=m(Zo(e,a)+Math.max(0,r.minimumWage-.55)*.12+Math.max(0,Ya-.4)*.02+Math.max(0,Et-1)*.008+g*.01-h(y.education,M.education,.004,.01),.012,.3);r.nairu=F(r.nairu,Gt,.08*c);const kt=m(r.nairu-u.okunSensitivity*r.outputGap,.005,.6);o.labour.unemployment=m(o.labour.unemployment+2.2*(kt-o.labour.unemployment)*c,.005,.6);const Dt=r.expectedInflation+Math.max(-.02,r.tfpGrowth)+.35*(r.nairu-o.labour.unemployment)+u.wagePush*.02*Ya,Za=m(F(o.labour.wageGrowth,Dt,1.2*c),-.3,60);o.labour.wageGrowth=Za,o.labour.medianWage=Math.max(1,o.labour.medianWage*Math.exp(Za*c)),o.labour.medianWage=F(o.labour.medianWage,o.gdpPerCapita*.74*(1-(o.inequality-.35)*.3),.4*c),o.labour.unionisation=z(o.labour.unionisation+(a.policies.labour??0)*2e-5*c*52);const fe=r.potential*r.priceLevel/o.monetary.exchangeRateVsUsd,Bt=o.accounts.consumption*(w/Math.max(1,S)),Tt=((sn=o.sectors.find(U=>U.id==="mining"))==null?void 0:sn.output)??0,Ue=qn(p,w,Bt,o.accounts.imports,Tt,o.corruption);l.taxIncome=Ue.income+Ue.payroll,l.corporateTax=Ue.corporate,l.vat=Ue.vat,l.tariffs=Ue.tariff,l.resourceRent=Ue.royalty,l.revenue=l.taxIncome+l.corporateTax+l.vat+l.tariffs+l.resourceRent;const It=Math.max(0,o.labour.unemployment-r.nairu)*w*.25*m(y.welfare/Math.max(.01,.1),.05,1.3);l.military=y.defence*fe,l.welfare=y.welfare*fe+It,l.healthcare=y.health*fe,l.education=y.education*fe,l.infrastructure=y.infrastructure*fe,l.administration=y.administration*fe;const ya=y.science*fe,Ut=y.subsidies*fe+o.sectors.reduce((U,J)=>U+J.stateSubsidy*J.output,0),Lt=a.wars.length?Math.min(.2,.02*a.wars.length)*fe:0;l.debtService=l.debt*r.debtCost;const Ot=l.military+l.welfare+l.healthcare+l.education+l.infrastructure+l.administration+ya+Ut+Lt;l.expenditure=Ot+l.debtService;const Ke=l.revenue-l.expenditure;l.budgetBalanceRatio=m(Ke/w,-.8,.6);const xt=Ke<0?-Ke*d.printing:0;l.debt=Math.max(0,l.debt+(-Ke-xt)*c),l.debtToGdp=l.debt/w,l.treasury=F(l.treasury,w*.02,.2*c)+Ke*.01*c,o.rd=ya+w*.004+o.sectors.reduce((U,J)=>U+J.output*Me[J.id].techIntensity*.01,0),!r.defaulted&&(l.debtToGdp>2.2+(Sn[a.id]??0)*300||r.bondYield>.35&&l.debtService>l.revenue*.5)&&_o(e,a,n),r.defaulted&&r.riskPremium<.08&&n.chance(c*.6)&&(r.defaulted=!1);const Ft=a.tradeBarriers?Object.values(a.tradeBarriers).reduce((U,J)=>U+J,0):0,Ht=B>0?.8:1,Ne=m(r.openness*(1-Math.max(0,p.tariff-.05)*.7)*(1-Math.min(.5,Ft*.04))*(1-Math.min(.6,aa(e,a)*.3))*Ht,.01,2.5),qa=m(r.structuralTradeBalance-r.realExchange*Ne*.5-r.outputGap*Ne*.5+(pa-1)*(Va-.06)*.25,-Ne*.8,Ne*.8);o.accounts.exports=w*(Ne+qa)/2,o.accounts.imports=w*(Ne-qa)/2;const oe=o.trade;oe.exports=o.accounts.exports,oe.imports=o.accounts.imports,oe.tradeBalance=oe.exports-oe.imports,oe.tradeOpenness=Ne*100,oe.tariffRate=p.tariff;const Kt=(oe.exports+oe.imports)/Math.max(1,Object.values(oe.flows).reduce((U,J)=>U+J,0));for(const U of Object.keys(oe.flows))oe.flows[U]*=Kt;const $t=o.netForeignAssets*.02;r.currentAccount=oe.tradeBalance+$t,o.netForeignAssets+=r.currentAccount*c;const Xa=o.monetary.inflation-s,_a=o.monetary.policyRate-o.monetary.inflation-(i-s);let Le=0;if(d.regime==="float"||d.regime==="command")Le=a.id==="USA"?0:m(Xa-m(_a*.35,-.08,.08)-r.currentAccount/w*.25+r.riskPremium*.2+r.realExchange*.6+n.normal()*.35,-.6,40),o.monetary.exchangeRateVsUsd=m(o.monetary.exchangeRateVsUsd*Math.exp(Le*c),1e-9,1e18),l.debt*=Math.exp(-Le*c),o.reserves=m(o.reserves+r.currentAccount*.08*c,0,w*3);else if(d.regime==="union"){const U=e.countries.DEU;U&&(o.monetary.exchangeRateVsUsd=U.economy.monetary.exchangeRateVsUsd),o.reserves=m(o.reserves+r.currentAccount*.02*c,0,w*3)}else if(o.reserves=Math.max(0,o.reserves+r.currentAccount*c*.85+(_a-r.riskPremium)*w*.1*c),o.reserves<o.accounts.imports*.08&&n.chance(c*4)){const U=n.float(.15,.4);o.monetary.exchangeRateVsUsd*=1+U,l.debt/=1+U,Le=U/c,o.reserves=o.accounts.imports*.3,(e.startDate.year>=1950||a.id===e.playerCountry)&&C(e,{kind:"economic",severity:"major",country:a.id,title:`${a.name} devalues its currency`,body:`Reserves ran out defending the ${d.regime==="gold"?"gold parity":"peg"}. The currency falls ${(U*100).toFixed(0)}%.`,tags:["crisis","currency"]}),d.regime==="gold"&&(d.regime="float")}if(r.lastDepreciation=Le,o.monetary.exchangeRateVsUsd>1e6||r.priceLevel>1e6){const U=Math.max(o.monetary.exchangeRateVsUsd,r.priceLevel,1);o.monetary.exchangeRateVsUsd/=U,r.priceLevel/=U,r.priceHistory=r.priceHistory.map(J=>J/U);for(const J of o.households)J.costOfLiving/=U;(a.id===e.playerCountry||o.gdp/Math.max(1,e.globals.globalGdp)>.003)&&C(e,{kind:"economic",severity:"notice",country:a.id,title:`${a.name} introduces a new currency`,body:"Zeros are knocked off the old money. Nothing real has changed.",tags:["currency"]})}r.realExchange=m((r.realExchange+(Xa-Le)*c)*(1-.12*c),-1.2,1.2);const Jt=.015+o.gdpGrowth*.8-1.4*(ne-r.neutralRate)+(e.markets.riskAppetite-50)/50*.03+(r.credit<Ve(e,a)?.015:-.015);r.credit=m(r.credit*Math.exp(m(Jt-o.nominalGrowth*.5,-.3,.3)*c),.02,4);const Wt=m(.025+Math.max(0,-r.outputGap)*.6+Math.max(0,r.credit/Ve(e,a)-1.15)*.1+Math.max(0,ne-.05)*.2,.01,.5);r.npl=F(r.npl,Wt,.9*c),r.npl>.13&&n.chance(c*.9*e.params.eventRate)&&Qo(e,a),r.housePrice=m(r.housePrice*Math.exp(m(o.monetary.inflation+r.outputGap*.6-(ne-r.neutralRate)*1.8+(r.housePrice>170?-.03:0),-.25,3)*c),10,1e7),r.consumerConfidence=F(r.consumerConfidence,m(52+r.outputGap*320-(o.labour.unemployment-r.nairu)*380-Math.max(0,o.monetary.inflation-.04)*130-B*180,2,98),1.4*c),r.businessConfidence=F(r.businessConfidence,m(52+r.outputGap*340-(r.bondYield-.04)*90-Math.max(0,p.corporate-.3)*80+(e.markets.riskAppetite-50)/50*15-B*120,2,98),1.4*c);const Vt=l.military+l.healthcare+l.education+l.infrastructure+l.administration+ya,wt=.14+m(D,0,1)*.06+Math.max(0,r.potentialGrowth)*1.2,jt=m(wt+.5*r.outputGap-.55*(Ye-r.neutralRate)+(r.businessConfidence-50)/50*.03-Math.max(0,p.corporate-.25)*.1+o.sectors.reduce((U,J)=>U+J.stateOwnership*J.share,0)*.06,.03,.48),Qa=w*jt,en=o.accounts.exports,an=o.accounts.imports,nn=w-Qa-Vt-en+an,zt=w*.28,tn=Math.max(zt,nn);o.accounts.consumption=tn,o.accounts.investment=Math.max(w*.015,Qa-(tn-nn)),o.accounts.government=w-o.accounts.consumption-o.accounts.investment-en+an;const Yt=a.policies.justice??0;o.corruption=z(o.corruption+(u.corruptionRate*2-(Yt+40)*5e-5-y.administration*.01)*c);const Zt=m(.42-y.welfare*.6-p.income*.12-o.labour.unionisation*.06-r.minimumWage*.03+o.corruption*.1+(e.startDate.year<1950?.08:0),.18,.75);o.inequality=F(o.inequality,Zt,.06*c)}const Sn={USA:.012,DEU:.006,CHE:.008,JPN:.008,GBR:.003,FRA:.002,NLD:.003,CHN:.003};function Zo(e,a){const n=e.startDate.year,i=Math.min(1,a.economy.gdpPerCapita/Math.max(1,Oa(e)));return m((n<1950||n<1990?.035:.045)+(1-i)*.035+a.economy.corruption*.02,.015,.2)}function qo(e){const a=e.startDate.year,n=e.t/se,i=a+n;return i<1920?.012:i<1945?.014:i<1975?.026:i<2005?.018:.014}let Je={v:1,at:-1};function Oa(e){if(Je.at===e.dayCount&&Je.v>1)return Je.v;let a=0;for(const n of Object.values(e.countries))n.annexedBy||n.economy.population<2e7||n.economy.gdpPerCapita>a&&(a=n.economy.gdpPerCapita);return Je={v:a||1,at:e.dayCount},Je.v}function Ve(e,a){const n=e.startDate.year;return(n<1950?.55:n<1990?.45:n<2010?.75:.95)*m(.4+a.economy.gdpPerCapita/Math.max(1,Oa(e)),.3,1.7)}function An(e,a){var n;return((n=e.find(i=>i.id===a))==null?void 0:n.share)??0}function Xo(e,a){var t;const n=a.economy.trade.flows;let i=0,s=0;for(const[o,r]of Object.entries(n)){const l=e.countries[o];if(!l||l.annexedBy)continue;const u=((t=a.tradeBarriers)==null?void 0:t[o])??0;i+=l.economy.macro.outputGap*r*(1-z(u)),s+=r}return s>0?i/s:0}function _o(e,a,n){const i=a.economy,s=i.macro;s.defaulted=!0;const t=n.float(.25,.55);i.fiscal.debt*=1-t,s.shock-=.07,s.shockDecay=.8,s.npl+=.05,i.monetary.exchangeRateVsUsd*=1.3,s.expectedInflation+=.04,i.fiscal.debt/=1.3,a.executive.approval=m(a.executive.approval-14,0,100),a.cohesion=m(a.cohesion-8,0,100),C(e,{kind:"economic",severity:"catastrophic",country:a.id,title:`${a.name} defaults on its sovereign debt`,body:`Markets stopped rolling the paper. Creditors take a ${(t*100).toFixed(0)}% haircut and the economy is thrown into recession.`,tags:["crisis","debt"]})}function Qo(e,a){const n=a.economy,i=n.macro;i.shock-=.045,i.shockDecay=.7,i.credit*=.86,i.npl*=.7,n.fiscal.debt+=n.gdp*.04,e.markets.riskAppetite=m(e.markets.riskAppetite-n.gdp/Math.max(1,e.globals.globalGdp)*60,2,100),C(e,{kind:"economic",severity:"major",country:a.id,title:`Banking crisis in ${a.name}`,body:`Bad loans hit ${(i.npl*143).toFixed(0)}% of lending. The state recapitalises the banks at a cost of ${4 .toFixed(0)}% of GDP.`,tags:["crisis","banks"]})}function er(e,a){var D,b,M;const n=a.economy,i=n.macro,s=Ie,t=i.realHistory.length>=2?Math.log(i.realHistory[i.realHistory.length-1]/i.realHistory[i.realHistory.length-2])/s:0,o=i.popGrowth,r=n.sectors.reduce((h,f)=>h+f.price*f.share,0)||1,l=t-o,u=i.potentialGrowth,c=e.markets.commodityPrices.oil/Math.max(1e-6,((D=e.commodityMarkets.oil)==null?void 0:D.trend)??1),d=e.markets.commodityPrices.wheat/Math.max(1e-6,((b=e.commodityMarkets.wheat)==null?void 0:b.trend)??1),p=e.markets.commodityPrices.copper/Math.max(1e-6,((M=e.commodityMarkets.copper)==null?void 0:M.trend)??1);let y=0;for(const h of n.sectors){const f=Me[h.id],k=h.price/r;let g=o+Wo[h.id]*l;const N=jo[h.id];N&&(g+=m((n.budget[N]/Math.max(1e-4,i.baseBudget[N])-1)*.25,-.15,.25)),h.id==="defence"&&a.wars.length&&(g+=.05),h.id==="tourism"&&(g+=(i.shock<-.03?-.4:0)+(a.wars.length?-.15:0)),(h.id==="construction"||h.id==="real-estate")&&(g+=-(i.bondYield-i.expectedInflation-i.neutralRate-.012)*1.2),h.id==="finance"&&(g+=(i.credit/Math.max(.05,Ve(e,a))-1)*.1);const B=h.quantity*Math.exp(g*s-Vo[h.id]*Math.log(Math.max(.05,k))*.04*s),T=(f.growth*.4+i.tfpGrowth*.4)*(.5+f.techIntensity*.9)+h.stateSubsidy*.05-(h.regulation-.3)*.012-h.stateOwnership*.004,Y=m((h.margin-f.margin)*.8+(h.quantity/Math.max(1,h.capacity)-.95)*.5,-.05,.08);h.capacity=Math.max(1,h.capacity*Math.exp((u*.8+T*.35+Y)*s));const $=Math.min(B,h.capacity*1.06),ee=Math.log(Math.max(1e-6,B)/Math.max(1e-6,h.capacity)),Q=(h.id==="agriculture"?(d-1)*.15:0)+(h.id==="mining"?(p-1)*.15:0)+(h.id==="energy"||h.id==="utilities"?(c-1)*.2:(c-1)*f.commodityExposure*.03),L=h.concentration*.004-h.stateSubsidy*.2,H=m(.4*ee+Q+L+(n.labour.wageGrowth-n.monetary.inflation-T)*f.labourIntensity*.05+n.monetary.inflation,-.4,60);h.price=m(h.price*Math.exp((H-n.monetary.inflation)*s),.02,50);const ae=Math.log(Math.max(1e-6,$)/Math.max(1e-6,h.quantity))/s;h.growth=F(h.growth,m(ae,-.6,.6),.08),h.quantity=Math.max(1,$),h.output=h.quantity*h.price*i.priceLevel,y+=h.output;const q=m(f.margin*(.7+h.concentration*.7)+ee*.15-(h.regulation-.3)*.05-Math.max(0,i.minimumWage-.5)*f.labourIntensity*.04+h.stateSubsidy*.3,-.25,.65);h.margin=F(h.margin,q,.8*s)}const S=n.population*n.labour.participation*(1-n.labour.unemployment);let R=0;for(const h of n.sectors)h.share=h.output/Math.max(1,y),R+=h.share*Me[h.id].labourIntensity*(h.id==="agriculture"?2:1);for(const h of n.sectors)h.employment=Math.round(S*h.share*Me[h.id].labourIntensity*(h.id==="agriculture"?2:1)/Math.max(1e-6,R)),h.output=h.share*n.gdp,h.productivity=h.employment>0?h.output/h.employment:0,h.wage=h.employment>0?h.output*m(1-h.margin-.15,.2,.85)/h.employment:0,i.minimumWage>0&&(h.wage=Math.max(h.wage,n.labour.medianWage*i.minimumWage))}function ar(e){const a=e.economy,n=a.macro,i=Ie,s=Zn(a.inequality),t=a.gdp*(1-a.tax.income*.8-a.tax.payroll)*.72,o=a.fiscal.welfare,r=u=>{var c;return(((c=a.sectors.find(d=>d.id===u))==null?void 0:c.price)??1)*n.priceLevel};let l=0;for(const u of a.households){const c=wo[u.id];let d=0,p=0;for(const[k,g]of Object.entries(c))p+=r(k)*g,d+=g;const y=p/Math.max(1e-6,d),S=u.id==="working"?.65:u.id==="middle"?.3:.05,R=u.id==="working"?a.labour.unemployment*.5:u.id==="middle"?a.labour.unemployment*.2:0,D=(t*s[u.id]*(1-R)+o*S)/Math.max(1,a.population*u.popShare),b=u.realIncome;u.incomeShare=s[u.id],u.income=D,u.costOfLiving=y,u.realIncome=D*a.monetary.exchangeRateVsUsd/Math.max(1e-6,y),u.savingsRate=m((u.id==="working"?.02:u.id==="middle"?.1:.3)+(n.bondYield-.04)*.3-(n.consumerConfidence-50)*.001,-.05,.6);const M=Math.log(Math.max(1e-6,u.realIncome)/Math.max(1e-6,b))/i,h=Math.max(0,a.monetary.inflation-.03)*(u.id==="working"?1.5:u.id==="middle"?1:.4),f=m(.58+m(M,-.6,.6)*.45-a.labour.unemployment*(u.id==="working"?1.3:.7)-h+(u.id==="working"?a.budget.welfare*.5:0)-Math.max(0,a.tax.vat-.15)*(u.id==="working"?.4:.15),.03,.97);u.satisfaction=F(u.satisfaction,f,1.3*i),l+=u.satisfaction*u.popShare}a.labour.satisfaction=l,a.labour.strikeRisk=z((1-l)*.3*(.4+a.labour.unionisation)+Math.max(0,a.monetary.inflation-a.labour.wageGrowth)*.6)}const nr={oil:{sector:"energy",beta:.55,gamma:.12},"natural-gas":{sector:"energy",beta:.6,gamma:.12},coal:{sector:"energy",beta:.3,gamma:.1},uranium:{sector:"energy",beta:.3,gamma:.06},copper:{sector:"manufacturing",beta:.9,gamma:.1},"iron-ore":{sector:"construction",beta:.9,gamma:.12},aluminium:{sector:"manufacturing",beta:.8,gamma:.1},lithium:{sector:"technology",beta:1.4,gamma:.2},wheat:{sector:"agriculture",beta:.25,gamma:.25},coffee:{sector:"agriculture",beta:.35,gamma:.2},gold:{sector:"finance",beta:-.2,gamma:.02},silver:{sector:"manufacturing",beta:.3,gamma:.04}};function tr(e,a){var u;const n=Ie;let i=0,s=0,t=0;for(const c of Object.values(e.countries)){if(c.annexedBy)continue;i+=m(c.economy.gdpGrowth,-.2,.2)*c.economy.gdp,s+=c.economy.gdp;const d=((u=c.economy.sectors.find(p=>p.id==="mining"))==null?void 0:u.output)??0;(c.wars.length||c.sanctions.length)&&(t+=d)}const o=s>0?i/s:.02,r=s>0?m(t/s*4,0,.3):0,l=m(e.globals.globalInflation,-.05,.12);for(const[c,d]of Object.entries(e.markets.commodityPrices)){const p=e.commodityMarkets[c]??(e.commodityMarkets[c]={supply:1,demand:1,trend:d,inventory:.25}),y=nr[c]??{beta:.5,gamma:.1};p.trend*=Math.exp(m(l,-.1,.2)*n);const S=d/Math.max(1e-9,p.trend);p.demand*=Math.exp((o*y.beta-y.gamma*Math.log(Math.max(.05,S)))*n),p.supply*=Math.exp((o*y.beta+.12*Math.log(Math.max(.05,S))+.15*(p.demand/Math.max(.01,p.supply)-1)-r*.2*(c==="oil"||c==="natural-gas"?1:.3))*n),p.inventory=m(p.inventory+(p.supply-p.demand)*n,.03,1);const R=Math.log(Math.max(.05,p.demand)/Math.max(.05,p.supply))+(.25-p.inventory)*.4,D=c==="gold"?(50-e.markets.riskAppetite)/50*.08:0,b=m(l+R*.9+(p.trend/Math.max(1e-9,d)-1)*.35+D,-1,1.2),M=(c==="gold"?.12:.26)*Math.sqrt(n);e.markets.commodityPrices[c]=Math.max(d*.2,d*Math.exp(b*n+a.normal()*M))}}function ir(e,a){const n=Ie;for(const i of Object.values(e.companies)){if(i.insolvent)continue;const s=e.countries[i.country];if(!s)continue;const t=s.economy,o=t.sectors.find(N=>N.id===i.sector);if(!o)continue;const r=Me[i.sector],l=t.nominalGrowth*.5+o.growth*.6,u=m(Math.log10(Math.max(1e7,i.revenue))/12,0,.7),c=(e.globals.globalInflation+.025)*u,d=(i.researchLevel-r.techIntensity*.7)*.05,p=aa(e,s)*r.sanctionExposure*.08,y=l*(1-u)+c+d-p+a.normal()*.09*Math.sqrt(n)/n*.05;i.revenue=Math.max(1e4,i.revenue*Math.exp(m(y,-1,2)*n)),i.marketShare=m(i.revenue/Math.max(1,o.output),0,1);const S=m(o.margin+(i.researchLevel-.3)*.05+i.brandValue/Math.max(1,i.valuation)*.01,-.3,.6);i.profit=i.revenue*S,i.costs=i.revenue-i.profit;const R=i.debt*(t.macro.bondYield+e.markets.creditSpreads),D=(i.profit-R)*(1-(i.profit-R>0?t.tax.corporate:0));i.netIncome=D,i.debt=Math.max(0,i.debt+(-D*(D<0?1:.2)+i.revenue*.02)*n),i.rd=i.revenue*m(r.techIntensity*.1+i.researchLevel*.02,.001,.2),i.researchLevel=z(i.researchLevel+(i.rd/Math.max(1,i.revenue)-.03)*.5*n);const b=m(t.macro.tfpGrowth+r.techIntensity*.02,-.05,.1);i.employees=Math.max(1,i.employees*Math.exp(m(y-t.monetary.inflation-b,-.4,.4)*n));const M=.03+(50-e.markets.riskAppetite)*9e-4,h=Math.max(.025,t.macro.bondYield+M-Math.max(0,t.monetary.inflation)*.5),f=m(r.techIntensity*.025+y*.04,-.01,.03);i.pe=m(1/Math.max(.015,h-f),3,60);const k=Math.max(i.revenue*.12,Math.max(D,i.revenue*.01)*i.pe),g=a.normal()*e.params.marketVolatility*.12*Math.sqrt(n);if(i.valuation=Math.max(1e5,i.valuation*Math.exp(.7*Math.log(k/Math.max(1,i.valuation))*n+g)),i.sharePrice=Math.max(.01,i.valuation/Math.max(1,i.shares??1)),i.tier=i.valuation>1e12?"mega-cap":i.valuation>2e11?"large":i.valuation>2e10?"mid-cap":"small",i.dailyVolume=Math.round(i.valuation/Math.max(.01,i.sharePrice)*.003),D<0&&i.debt>i.revenue*2.8&&i.stateOwnership<.5&&a.chance(n*1.2)){const N=Math.round(i.employees);i.insolvent=!0,i.listed=!1;for(const B of e.markets.exchanges)B.listings=B.listings.filter(T=>T!==i.id);t.macro.npl=m(t.macro.npl+i.debt/Math.max(1,t.gdp)*.5,0,.6),C(e,{kind:"corporate",severity:"major",country:i.country,title:`${i.name} goes bankrupt`,body:`Debts of ${(i.debt/1e9).toFixed(1)}B could not be serviced. ${N.toLocaleString("en-US")} jobs are at risk.`,tags:["corporate","insolvency"]})}}}function or(e,a){const n=Ie;for(const i of e.markets.exchanges){let s=0;for(const y of i.listings){const S=e.companies[y];S&&!S.insolvent&&(s+=S.valuation)}const t=e.countries[i.country],o=(t==null?void 0:t.economy.nominalGrowth)??.03,r=((t==null?void 0:t.economy.macro.bondYield)??.04)-((t==null?void 0:t.economy.macro.neutralRate)??.01)-Math.max(0,(t==null?void 0:t.economy.macro.expectedInflation)??.02),l=i.marketCap||s,u=s>0&&l>0?Math.log(s/l):(o-r*.3)*n;i.marketCap=s;const c=(e.markets.riskAppetite-50)/50*.04*n;i.index=Math.max(5,i.index*Math.exp(m(u,-.35,.35)+c+a.normal()*e.params.marketVolatility*.012*Math.sqrt(n))),i.volatility=F(i.volatility,m(16+(50-e.markets.riskAppetite)*.5+e.params.marketVolatility*4,5,90),2*n);let d=0,p=0;for(const y of i.listings){const S=e.companies[y];S&&(p++,S.sharePrice>=S.sharePriceYearAgo&&d++)}i.breadth=p?d/p*100:50}}function rr(e,a){const n=Ie,i=e.params;let s=0,t=0,o=0,r=0;for(const p of Object.values(e.countries))p.annexedBy||(s+=p.economy.gdpGrowth*p.economy.gdp,t+=p.economy.macro.outputGap*p.economy.gdp,r+=p.economy.fiscal.creditRating*p.economy.gdp,o+=p.economy.gdp);const l=o>0?s/o:.02,u=o>0?t/o:0,c=o>0?r/o:.7,d=m(35+c*22+u*260+l*200-e.globals.worldConflictIndex*.1,3,95);if(e.markets.riskAppetite=F(e.markets.riskAppetite,d,1.3*n)+a.normal()*2*Math.sqrt(n),e.markets.riskAppetite=m(e.markets.riskAppetite,1,99),e.markets.creditSpreads=F(e.markets.creditSpreads,m(.006+(1-c)*.05+Math.max(0,-u)*.25+(50-e.markets.riskAppetite)*3e-4,.002,.3),2*n),e.markets.sentiment=cr(e.markets.riskAppetite),a.chance(Math.min(.0015,i.crashProbability*i.eventRate))){const p=a.float(.72,.9);e.markets.lastCrashAt=e.t,e.markets.riskAppetite=Math.max(3,e.markets.riskAppetite*.55);for(const y of e.markets.exchanges)y.index*=p;for(const y of Object.values(e.companies))y.valuation*=p;for(const y of Object.values(e.countries)){const S=m(y.economy.macro.credit*.5,.1,1)*m(y.economy.macro.openness,.2,1);y.economy.macro.shock-=(1-p)*.12*S}C(e,{kind:"economic",severity:"catastrophic",title:"Global market crash",body:`Equities fall about ${((1-p)*100).toFixed(0)}% across every exchange. Risk appetite has collapsed.`,tags:["crisis","markets"]})}}function sr(e){for(const a of e.markets.exchanges)a.indexYearAgo=a.index;for(const a of Object.values(e.companies))a.sharePriceYearAgo=a.sharePrice;for(const a of Object.values(e.countries))a.annexedBy||a.id===e.playerCountry||(lr(a,e.startDate.year+e.t/se),a.economy.monetary.inflation>.4&&_n(e,a))}function _n(e,a){const n=a.economy,i=n.macro,s=n.centralBank;s.printing=0,s.credibility=Math.max(s.credibility,.7),i.expectedInflation=Math.max(s.target,Math.min(i.expectedInflation*.15,.25)),n.monetary.inflation=Math.max(i.expectedInflation,n.monetary.inflation*.25),n.monetary.policyRate=Math.min(n.monetary.policyRate,i.expectedInflation+.1),n.monetary.centralBankRate=n.monetary.policyRate,i.lastDepreciation=0,i.shock-=.03,i.shockDecay=1;for(const t of["subsidies","administration","defence"])n.budget[t]*=.92;C(e,{kind:"economic",severity:"major",country:a.id,title:`${a.name} launches a stabilisation plan`,body:"A new monetary framework and budget cuts aim to break inflation. A short recession is the price.",tags:["monetary"]})}function lr(e,a){const n=e.economy,i=n.macro,s=-n.fiscal.budgetBalanceRatio,t=n.budget,o=n.tax,r=a<1945?.005:a<1970?.015:.03,l=m((s-r)*1.6+(n.fiscal.debtToGdp>.9?.05:0)+(i.riskPremium>.05?.1:0),-.08,.25),u=i.outputGap<-.03?.04:0,c=l-u;if(Math.abs(c)>.004){const d=e.ideology<-10,p=1-m(c*(d?.4:.8),-.08,.1);t.defence*=p,t.administration*=p,t.subsidies*=p,t.infrastructure*=p,t.welfare*=1-m(c*(d?.15:.5),-.05,.06);const y=1+m(c*(d?.9:.4),-.05,.08);o.income=m(o.income*y,0,.6),o.vat=m(o.vat*y,0,.27),o.corporate=m(o.corporate*y,0,.5)}e.wars.length&&(t.defence=Math.min(.2,t.defence*1.08)),n.monetary.inflation>.25&&n.centralBank.printing>0&&(n.centralBank.printing*=.6)}function cr(e){return e<18?"crash":e<36?"bearish":e<62?"neutral":e<82?"bullish":"euphoric"}function aa(e,a){let n=0;for(const i of a.sanctions){const s=e.sanctions[i];s&&(n+=s.scope/100*(1-s.evasion*.6))}return m(n,0,4)}function ur(e,a){let n=0;for(const i of a.wars){const s=e.wars[i];if(!s||s.endedAt)continue;const t=Object.prototype.hasOwnProperty.call(s.belligerents,a.id);n+=(t?.03:.006)*(1+(s.exhaustion[a.id]??0)/100);for(const o of s.fronts){const r=o.belligerents.indexOf(a.id);if(r<0)continue;const l=r===0?-o.control:o.control;n+=.0012*Math.max(0,l+20)*.1}for(const o of s.fronts){const r=ua(s,o,e.countries);(r==null?void 0:r.territory)===a.id&&(n+=r.share*.12)}}return m(n,0,.3)}const xa=7*86400,bn={europe:{first:"Anna Marco Elena Jan Sofia Lukas Clara Pierre Ingrid Tomas Maria Henrik Lucia Pavel Claire Stefan".split(" "),last:"Novak Keller Moreau Rossi Lindqvist Kowalski Berg Dubois Weber Costa Hansen Fischer Laurent Marin Vogel Popescu".split(" ")},americas:{first:"Maria Carlos John Ana Luis Sarah Diego Laura Miguel James Camila Robert Elena Daniel Isabel Andres".split(" "),last:"Silva Garcia Johnson Rodriguez Martinez Santos Walker Herrera Campbell Torres Morales Clarke Vargas Reyes Mendes Ortega".split(" ")},asia:{first:"Wei Mei Hiro Yuki Arjun Priya Min Linh Budi Siti Ravi Ananya Jun Hana Tuan Dewi".split(" "),last:"Chen Tanaka Sharma Nguyen Kim Wang Singh Sato Lee Rao Liu Park Suzuki Tran Patel Lin".split(" ")},"middle-east":{first:"Omar Layla Hassan Fatima Yusuf Amira Karim Noor Tariq Zainab Samir Dalia Ali Rania Faisal Mona".split(" "),last:"Haddad Rahman Al-Sayed Khalil Nasser Aziz Farah Mansour Saleh Darwish Hamdan Karimi Yilmaz Demir Rashid Amin".split(" ")},africa:{first:"Amina Kwame Fatou Emeka Zanele Moussa Aisha Thabo Grace Ibrahim Wanjiru Samuel Nia Abdou Thandi Joseph".split(" "),last:"Okafor Diallo Mensah Ndlovu Kamau Traore Osei Abebe Sow Banda Keita Mwangi Toure Nkosi Adeyemi Moyo".split(" ")},oceania:{first:"Jack Olivia Tama Mere Liam Grace Sione Emma Noah Ana Ethan Lani Finn Ruby Kai Tui".split(" "),last:"Smith Taylor Tui Wilson Brown Fonua Walker Ngata Campbell Tamati Young Thompson Vaka Reid Clark Hale".split(" ")}};function mr(e,a){const n=bn[e.region]??bn.europe;return`${a.pick(n.first)} ${a.pick(n.last)}`}function Qn(e,a,n,i){const s=`ch-${a.id}-gen-${e.dayCount}-${Math.round(i.next()*1e6)}`,t=a.parties.find(r=>r.id===n),o={id:s,name:mr(a,i),country:a.id,role:"head-of-government",partyId:n,stats:{competence:Math.round(i.normal()*20+22),charisma:Math.round(i.normal()*22+18),integrity:Math.round(i.normal()*28),ambition:Math.round(i.normal()*22+30),ideology:Math.round(m(((t==null?void 0:t.ideology)??a.ideology)+i.normal()*8,-100,100)),popularity:Math.round(m(i.normal()*16+52,0,100)),experience:Math.round(m(i.normal()*18+55,0,100)),militancy:Math.round(i.normal()*22)},createdAt:e.t};return e.characters[s]=o,o}function dr(e,a,n,i){const s=e.countries[a];if(!(s!=null&&s.legislature))return null;const t=`bill-${s.id}-${e.dayCount}-${Object.keys(e.bills).length}`,o={...n,id:t,country:a,status:"introduced",votes:[],tallies:{},introducedAt:e.t,expiresAt:e.t+45*86400};return s.legislature.activeBills.push(t),e.bills[t]=o,C(e,{kind:"political",severity:"info",country:a,title:`${s.name}: ${o.title} introduced`,body:o.summary,byUserId:i,tags:["legislation"]}),o}function hr(e,a,n,i,s){const t=pr(a.policy),o=1-Math.min(1,Math.abs(n-t)/110),r=(a.publicOpinion-50)/200;return i?m(.72+s/100*a.whipStrength*.26+(o-.5)*.3+r,.2,1):m(.05+o*.3+r-s/100*.1+(e.executive.approval-50)/400,0,.75)}function pr(e){var n,i,s,t,o;if(!e)return 0;let a=0;return((n=e.tax)==null?void 0:n.income)!==void 0&&(a+=0),e.minimumWage!==void 0&&(a-=15),((i=e.budget)==null?void 0:i.welfare)!==void 0&&(a-=10),((s=e.budget)==null?void 0:s.defence)!==void 0&&(a+=12),((t=e.sector)==null?void 0:t.regulation)!==void 0&&(a-=8),((o=e.sector)==null?void 0:o.stateOwnership)!==void 0&&(a-=20),m(a,-60,60)}function yr(e,a){for(const i of Object.keys(e.bills)){const s=e.bills[i];if(s.status==="enacted"||s.status==="rejected"||s.status==="expired")continue;const t=e.countries[s.country];if(!(t!=null&&t.legislature)){s.status="expired";continue}const o=(e.t-s.introducedAt)/86400;if(o<21){s.status=o<7?"introduced":"in-committee";continue}const r=t.legislature.chambers.find(d=>d.id===s.chamberId)??t.legislature.chambers[0];let l=0,u=0,c=0;for(const d of t.parties){const p=d.seats[r.id]??0;if(!p)continue;const y=z(hr(t,s,d.ideology,t.executive.coalition.includes(d.id),d.cohesion)+a.normal()*.05),S=Math.round(p*y),R=Math.round((p-S)*.08);l+=S,c+=R,u+=p-S-R}s.tallies[r.id]={aye:l,nay:u,abstain:c,absent:0},t.legislature.activeBills=t.legislature.activeBills.filter(d=>d!==s.id),l>u?(s.status="enacted",s.enactedAt=e.t,s.policy&&et(t,s.policy),t.executive.approval=m(t.executive.approval+(s.publicOpinion-50)*.08,0,100),C(e,{kind:"legal",severity:"notice",country:t.id,title:`${t.name}: ${s.title} passes ${l}-${u}`,body:s.summary,tags:["legislation","enacted"]})):(s.status="rejected",t.executive.confidence=m(t.executive.confidence-6,0,100),C(e,{kind:"political",severity:"major",country:t.id,title:`${t.name}: ${s.title} defeated ${l}-${u}`,body:`The ${r.name} rejects the government's package.`,tags:["legislation"]}))}const n=Object.values(e.bills).filter(i=>i.status==="enacted"||i.status==="rejected"||i.status==="expired");if(n.length>120){n.sort((i,s)=>i.introducedAt-s.introducedAt);for(const i of n.slice(0,n.length-120))delete e.bills[i.id]}}function et(e,a){const n=e.economy;if(a.tax&&Object.assign(n.tax,a.tax),a.budget&&Object.assign(n.budget,a.budget),a.minimumWage!==void 0&&(n.macro.minimumWage=m(a.minimumWage,0,1)),a.centralBankIndependent!==void 0&&(n.centralBank.independent=a.centralBankIndependent),a.sector){const i=n.sectors.find(s=>s.id===a.sector.id);i&&(a.sector.subsidy!==void 0&&(i.stateSubsidy=m(a.sector.subsidy,0,.5)),a.sector.regulation!==void 0&&(i.regulation=z(a.sector.regulation)),a.sector.stateOwnership!==void 0&&(i.stateOwnership=z(a.sector.stateOwnership)))}}function gr(e){return!Na(e.government)&&!!e.legislature&&!e.executive.emergencyPowers}function fr(e,a){const n=e.economy,i=n.macro,s=xa/se,t=m(46+(n.labour.satisfaction-.55)*70+i.outputGap*120-Math.max(0,n.labour.unemployment-i.nairu)*110-Math.max(0,n.monetary.inflation-.04)*70+m(n.gdpGrowth,-.1,.1)*80-n.corruption*8-(e.wars.length?4:0)-(i.defaulted?12:0),2,96),o=ke(e.government)?t:m(t*.5+34,12,95);e.executive.approval=m(F(e.executive.approval,o,1.6*s)+a.normal()*.45,0,100);const r=60-e.unrest.length*6+(e.executive.approval-50)*.5;e.executive.confidence=F(e.executive.confidence,m(r,3,97),1.2*s),e.cohesion=F(e.cohesion,m(70-n.inequality*40+(e.executive.approval-50)*.3,8,98),.2*s)}function Pr(e,a){var c;const n=xa/se,i=(c=e.legislature)==null?void 0:c.chambers[0],s=e.parties.filter(d=>e.executive.coalition.includes(d.id)),t=e.parties.filter(d=>!e.executive.coalition.includes(d.id));if(!s.length||!t.length||!ke(e.government))return;const o=i&&e.parties.reduce((d,p)=>d+(p.seats[i.id]??0),0)||1,r=s.reduce((d,p)=>d+(i?p.seats[i.id]??0:1),0)/(i?o:s.length),l=m(e.executive.approval*.85+9,8,74);for(const d of s){const p=i?(d.seats[i.id]??0)/o/Math.max(.05,r):1/s.length;d.popularity=F(d.popularity,l*p,2*n)+a.normal()*.2}const u=t.reduce((d,p)=>d+(i?p.seats[i.id]??0:1),0)||1;for(const d of t){const p=i?(d.seats[i.id]??0)/u:1/t.length,y=100-l;d.popularity=F(d.popularity,Math.max(.5,y*Math.max(.03,p)),2*n)+a.normal()*.2}for(const d of e.parties)d.popularity=m(d.popularity,.2,90)}function Sr(e,a,n){var k;const i=(k=a.legislature)==null?void 0:k.chambers[0];if(a.nextElectionAt=e.t+(a.electionTermDays??1460)*86400,!i)return;const s=e.params.electionChaos,t=a.parties.map(g=>({p:g,vote:Math.max(.1,g.popularity*Math.exp(n.normal()*(.1+s*.6)))})),o=t.reduce((g,N)=>g+N.vote,0);for(const g of t)g.vote=g.vote/o*100;const r=i.election==="fptp",l=t.map(g=>({...g,weight:r?Math.pow(g.vote,1.25):g.vote})),u=l.reduce((g,N)=>g+N.weight,0);let c=0;const d=l.map(g=>{const N=Math.floor(g.weight/u*i.seats);return c+=N,{p:g.p,n:N,vote:g.vote,rem:g.weight/u*i.seats-N}});d.sort((g,N)=>N.rem-g.rem);for(let g=0;c<i.seats;g++,c++)d[g%d.length].n++;for(const g of d)g.p.seats[i.id]=g.n,g.p.popularity=g.vote;const p=[...d].sort((g,N)=>N.n-g.n),y=p[0],S=[y.p.id];let R=y.n;const D=p.slice(1).sort((g,N)=>Math.abs(g.p.ideology-y.p.ideology)-Math.abs(N.p.ideology-y.p.ideology));for(const g of D){if(R>i.seats/2)break;S.push(g.p.id),R+=g.n}const b=p.filter(g=>g.n>0).slice(0,5).map(g=>`${g.p.abbreviation} ${g.n}`).join(", "),M=at(e,a);if(a.nextPresidentialAt!==void 0){M&&C(e,{kind:"political",severity:"notice",country:a.id,title:`${a.name}: legislative elections`,body:`The ${i.name} is now ${b}.`,tags:["election"]});return}const h=a.executive.coalition.includes(y.p.id),f=a.executive.coalition[0];a.executive.coalition=S;for(const g of a.parties)g.status=S.includes(g.id)?"government":"outside";if(f!==y.p.id){const g=nt(e,a,y.p.id,n);M&&C(e,{kind:"political",severity:"major",country:a.id,title:`${a.name}: ${g.name} wins power for ${y.p.name}`,body:`The ${i.name} is now ${b}.`,tags:["election"]})}else M&&C(e,{kind:"political",severity:"major",country:a.id,title:`${a.name}: ${y.p.name} ${h?"holds on":"wins"} at the election`,body:`The ${i.name} is now ${b}.`,tags:["election"]})}function at(e,a){return a.id===e.playerCountry||a.economy.gdp/Math.max(1,e.globals.globalGdp)>.006}function nt(e,a,n,i){const s=a.parties.find(l=>l.id===n),t=s!=null&&s.leaderId?e.characters[s.leaderId]:void 0,o=t&&!t.removedAt?t:Qn(e,a,n,i);s&&(s.leaderId=o.id);const r=a.nextPresidentialAt!==void 0||a.executive.headOfGovernmentId===a.executive.headOfStateId;return a.executive.headOfGovernmentId=o.id,r&&(a.executive.headOfStateId=o.id),a.ideology=m(F(a.ideology,(s==null?void 0:s.ideology)??a.ideology,.6),-100,100),a.executive.approval=m(52+i.normal()*4,0,100),o}function Ar(e,a,n){a.nextPresidentialAt=e.t+4*365*86400;const i=a.parties.find(u=>a.executive.coalition.includes(u.id)),s=[...a.parties].filter(u=>!a.executive.coalition.includes(u.id)).sort((u,c)=>c.popularity-u.popularity)[0];if(!i||!s)return;const t=m(a.executive.approval*.8+11+n.normal()*(2+e.params.electionChaos*15),15,85),o=a.executive.headOfStateId?e.characters[a.executive.headOfStateId]:void 0,r=at(e,a);if(t>=50){r&&C(e,{kind:"political",severity:"major",country:a.id,title:`${a.name}: ${(o==null?void 0:o.name)??"the president"} is re-elected`,body:`${i.name} holds the presidency with ${t.toFixed(1)}% of the vote.`,tags:["election"]});return}a.executive.coalition=[s.id];for(const u of a.parties)u.status=u.id===s.id?"government":"outside";s.leaderId=void 0;const l=nt(e,a,s.id,n);r&&C(e,{kind:"political",severity:"major",country:a.id,title:`${a.name}: ${l.name} wins the presidency`,body:`${s.name} defeats ${(o==null?void 0:o.name)??"the incumbent"}, taking ${(100-t).toFixed(1)}% of the vote.`,tags:["election"]})}function br(e,a,n){const i=a.economy,s=xa/se,t=z((55-a.executive.approval)/55)*.5+i.labour.unemployment*1.2+Math.min(1,Math.max(0,i.monetary.inflation-.1))*.7+i.labour.strikeRisk*.5+(1-a.cohesion/100)*.25;a.unrestRisk=z(.005+t*.1);for(const o of a.unrest)o.intensity=m(o.intensity+(t-.45)*40*s+n.normal()*2,0,100),o.intensity<5&&(o.endedAt=e.t),n.chance(o.intensity*.002)&&(o.fatalities+=Math.round(n.float(1,o.intensity)));if(a.unrest=a.unrest.filter(o=>!o.endedAt||e.t-o.endedAt<60*86400),n.chance(a.unrestRisk*s*2.2*e.params.eventRate)&&a.unrest.filter(o=>!o.endedAt).length<3){const r=t>.75?n.weighted(["riot","strike","rebellion","coup"],c=>c==="coup"?ke(a.government)?.2:1.2:c==="rebellion"?1:2.5):n.weighted(["protest","strike","riot"],c=>c==="protest"?4:2);a.unrest.push({id:`unrest-${a.id}-${e.dayCount}`,kind:r,intensity:n.float(15,55),startedAt:e.t,fatalities:0});const l={protest:"mass protests",riot:"rioting",strike:"a general strike",rebellion:"armed rebellion",coup:"an attempted coup"};(i.gdp/Math.max(1,e.globals.globalGdp)>.003||a.id===e.playerCountry||r==="coup"||r==="rebellion")&&C(e,{kind:"social",severity:r==="coup"||r==="rebellion"?"catastrophic":"major",country:a.id,title:`${a.name}: ${l[r]}`,body:Mr(r,a),tags:["unrest",r]}),i.macro.shock-=r==="coup"||r==="rebellion"?.02:.004,r==="coup"&&n.chance(.35+(50-a.executive.approval)*.008)&&Rr(e,a,n)}}function Rr(e,a,n){const i=Qn(e,a,void 0,n);i.role="head-of-state";const s=a.executive.headOfStateId?e.characters[a.executive.headOfStateId]:void 0;s&&(s.removedAt=e.t),a.nextPresidentialAt=void 0,a.executive.headOfStateId=i.id,a.executive.headOfGovernmentId=i.id,a.executive.headOfStateTitle="Head of the Junta",a.headOfStateTitle="Head of the Junta",a.government="military-junta",a.executive.coalition=[],a.executive.approval=m(a.executive.approval+10,0,100),a.nextElectionAt=void 0,C(e,{kind:"political",severity:"catastrophic",country:a.id,title:`Coup in ${a.name}`,body:`General ${i.name} has seized power${s?` from ${s.name}`:""}. Parliament is suspended.`,tags:["unrest","coup"]})}function Mr(e,a){const n=a.economy;switch(e){case"strike":return`Unions walk out with wages lagging prices and unemployment at ${(n.labour.unemployment*100).toFixed(1)}%.`;case"riot":return`Anger at inflation of ${(n.monetary.inflation*100).toFixed(1)}% has turned violent in the cities.`;case"coup":return"Units of the armed forces have moved against the government.";case"rebellion":return"Armed groups have taken control of outlying districts.";default:return`Crowds are out against a government with ${a.executive.approval.toFixed(0)}% approval.`}}function vr(e,a){yr(e,a);for(const n of Object.values(e.countries))n.annexedBy||(fr(n,a),!n.overlord&&(Pr(n,a),n.nextElectionAt!==void 0&&e.t>=n.nextElectionAt&&ke(n.government)&&Sr(e,n,a),n.nextPresidentialAt!==void 0&&e.t>=n.nextPresidentialAt&&ke(n.government)&&Ar(e,n,a),br(e,n,a)))}function Cr(e,a,n){const i=Object.keys(e.countries).filter(t=>!e.countries[t].overlord&&!e.countries[t].annexedBy),s=new Set;for(const t of Object.values(e.wars))if(!t.endedAt)for(const o of Object.keys(t.belligerents))for(const r of Object.keys(t.belligerents))r!==o&&s.add(`${r}|${o}`);for(const t of i){const o=e.countries[t],r=[...o.economy.trade.exportPartners,...o.alliances].slice(0,24).map(l=>({b:l}));for(const{b:l}of r){if(l===t||!e.countries[l])continue;const u=e.countries[l];let c=0;o.alliances.includes(l)&&(c+=.5),s.has(`${t}|${l}`)&&(c-=4),o.bloc===u.bloc&&(c+=.4),o.bloc!==u.bloc&&o.bloc!=="none"&&u.bloc!=="none"&&(c-=.15);const d=o.economy.trade.flows[l]??0;d>0&&(c+=m(d/Math.max(1,o.economy.trade.exports)*2.2,0,1.4)),u.sanctions.some(y=>{var S;return(S=e.sanctions[y])==null?void 0:S.imposedBy.includes(t)})&&(c-=2.4),c-=Math.abs(o.ideology-u.ideology)/100*.16;const p=u.economy.gdp/Math.max(1,o.economy.gdp);p>60&&(c-=.3),p<.02&&(c+=.2),c+=a.normal()*.08,o.relations[l]=m((o.relations[l]??0)+c*(n/se)*3,-100,100)}if(!o.overlord&&t!==e.playerCountry&&a.chance(5e-7*e.params.eventRate*(n/86400)*60)){const l=Object.entries(o.relations).filter(([u])=>!o.alliances.includes(u)&&u!==e.playerCountry).sort((u,c)=>u[1]-c[1])[0];l&&l[1]<-55&&ma(e,t,l[0],"financial",a)}if(t!==e.playerCountry&&!o.alliances.length&&a.chance(5e-7*e.params.eventRate*(n/86400)*60)){const l=Object.entries(o.relations).sort((u,c)=>c[1]-u[1])[0];l&&l[1]>70&&Fa(e,"alliance",[t,l[0]],["Mutual defence"],a,o.economy.gdp*.002)}}for(const t of Object.values(e.treaties))if(t.active){t.expiresAt&&e.t>t.expiresAt&&(t.active=!1,C(e,{kind:"diplomatic",severity:"notice",title:`${t.name} has lapsed`,body:"The treaty reached the end of its term without renewal.",actors:t.parties,tags:["treaty"]}));for(const o of t.parties){const r=e.countries[o];if(!r)continue;const l=t.parties.filter(c=>c!==o),u=l.length?l.reduce((c,d)=>c+(r.relations[d]??0),0)/l.length:0;t.favourability[o]=F(t.favourability[o]??0,m(u,-100,100),.01*(n/se)*12+4e-5),(t.kind==="alliance"||t.kind==="defensive-pact")&&(t.favourability[o]??0)<-60&&a.chance(2e-4*(n/86400))&&Br(e,t,o)}}for(const t of Object.values(e.sanctions)){if(e.t>t.until){Ha(e,t.id);continue}t.evasion=z(t.evasion+8e-4*(n/se)*12+1e-5)}}function Nr(e,a,n){var i,s;for(const t of Object.values(e.wars)){if(t.endedAt)continue;const o=e.params,r={};for(const c of Object.keys(t.belligerents)){const d=e.countries[c],p=t.belligerents[c]??[],y=(i=t.rebels)==null?void 0:i[c];if(y){r[c]=y.strength+p.reduce((h,f)=>{var k;return h+(((k=e.countries[f])==null?void 0:k.military.activeDuty)??0)*.2},0);continue}if(!d)continue;const S=p.reduce((h,f)=>{var k,g;return h+(((k=e.countries[f])==null?void 0:k.military.activeDuty)??0)*(((g=e.countries[f])==null?void 0:g.military.readiness)??0)/100},0),R=d.economy.fiscal.military/Math.max(1,d.military.activeDuty),D=e.globals.globalGdp/Math.max(1,e.globals.globalPopulation),b=m(Math.pow(R/Math.max(1e-6,D*4),.25),.55,1.8),M=d.military.activeDuty*(.4+d.military.readiness/100)*(d.military.morale/100)*b;r[c]=M+S*.8}for(const c of t.fronts){const d=c.belligerents.map(L=>r[L]??0);if(d.reduce((L,H)=>L+H,0)<=0){c.control=F(c.control,0,.01);continue}const y=d[0]??0,S=d[1]??0,D={mountain:2.1,urban:1.5,"urban-core":1.4,forest:1.3,coastal:1.05,plains:.85,desert:.95}[c.terrain]??1,b=y/Math.max(1,S*D),M=m(Math.log2(b+1)/3,0,2),h=c.belligerents.some(L=>{var H;return((H=t.stance)==null?void 0:H[L])==="offensive"}),f=o.warDamage*M*(n/86400)*.6*(h?1.5:1);for(const L of c.belligerents){const H=e.countries[L],ae=(s=t.rebels)==null?void 0:s[L];if(!H&&!ae)continue;const q=H?H.military.activeDuty+H.military.reserves*.1:ae.strength;t.casualties[L]=(t.casualties[L]??0)+q*f,H&&(H.military.morale=m(H.military.morale-f*120,0,100),H.military.readiness=m(H.military.readiness-f*90,0,100),H.military.activeDuty=Math.max(100,H.military.activeDuty-q*f*.3)),t.exhaustion[L]=m((t.exhaustion[L]??0)+f*90,0,100),t.publicSupport[L]=m((t.publicSupport[L]??50)-f*120,0,100)}const k=L=>{var H;return((H=t.stance)==null?void 0:H[L])??"balanced"},g=b>=1?c.belligerents[0]:c.belligerents[1],N=b>=1?c.belligerents[1]:c.belligerents[0],B=(k(g)==="offensive"?1.8:k(g)==="defensive"?.25:1)*(k(N)==="defensive"?.5:k(N)==="offensive"?1.3:1),T=Math.log(Math.max(.001,b))*.5,Y=Math.sign(T)*(Math.abs(T)+Math.max(0,Math.abs(T)-1)**2),$=m(Y,-8,8)*B*(n/(se*20)),ee=a.normal()*.05*Math.sqrt(n/86400);c.control=m(c.control+$*100+ee,-100,100),Er(e,t,c);const Q=e.countries[c.belligerents[1]];if(Q){const L=Math.min(1,Math.abs(c.control)/100);c.contestedOutput=Q.economy.gdp*L*.22}}const l=Object.keys(t.belligerents).length?Object.keys(t.belligerents).reduce((c,d)=>c+(t.exhaustion[d]??0),0)/Object.keys(t.belligerents).length:0,u=t.fronts.filter(c=>Math.abs(c.control)>85);t.phase=Gr(t,l,u.length),(l>82||t.fronts.every(c=>Math.abs(c.control)>96))&&Dr(e,t)}for(const[t,o]of Object.entries(e.wars)){const r=o.endedAt&&o.fronts.some(l=>{var u;return(((u=ua(o,l,e.countries))==null?void 0:u.share)??0)>.02});o.endedAt&&!r&&e.t-o.endedAt>se*3&&delete e.wars[t]}}function Er(e,a,n){const i=ua(a,n,e.countries);if(!i)return;const s=Math.floor(i.share*100/5);if(n.lastBucket===void 0){n.lastBucket=s;return}if(s===n.lastBucket)return;const t=s>n.lastBucket;n.lastBucket=s;const o=e.countries[i.territory];C(e,{kind:"military",severity:"notice",country:i.territory,title:`${i.holderName} ${t?"advances":"falls back"}: now holds ${s*5}% of ${o.name}`,body:`The line moves on the ${n.name} front.`,tags:["war","front"]})}function Gr(e,a,n){return n>=e.fronts.length?"negotiations":a>72?"stalemate":a>45?"attrition":e.fronts.length>2?"protracted":"war"}function te(e,a,n,i){var r;const s=e.wars[a],t=e.countries[n];if(!s||!t||s.endedAt||s.belligerents[n]||n===e.playerCountry)return;s.belligerents[n]=[],s.exhaustion[n]=2,s.publicSupport[n]=62,t.wars.includes(a)||t.wars.push(a);const o=Object.keys(s.belligerents).filter(l=>l!==n&&l!==i&&!kr(e,l,i));for(const l of o)t.relations[l]=m((t.relations[l]??0)-50,-100,100),e.countries[l]&&(e.countries[l].relations[n]=m((e.countries[l].relations[n]??0)-50,-100,100));s.fronts.push({id:`${a}-f${s.fronts.length}`,name:`${t.name} Front`,belligerents:[n,o[0]??s.fronts[0].belligerents[1]],control:0,contestedOutput:0,openedAt:e.t,terrain:"plains",attritionRate:4e-4}),C(e,{kind:"military",severity:"catastrophic",country:n,title:`${t.name} enters the ${s.name}`,body:`${t.name} joins the fighting alongside ${((r=e.countries[i])==null?void 0:r.name)??i}.`,actors:[n,i],tags:["war"]})}function kr(e,a,n){var i;return!!((i=e.countries[a])!=null&&i.alliances.includes(n))}function Ee(e,a,n,i,s){const t=e.countries[a],o=e.countries[n];if(!t||!o||a===n||t.wars.some(u=>{var c;return(c=e.wars[u])==null?void 0:c.belligerents[n]}))return null;const r=`war-${Object.keys(e.wars).length}-${Math.round(e.t)}`,l={id:r,name:`${t.name} - ${o.name} War`,startedAt:e.t,phase:"mobilised",belligerents:{[a]:[],[n]:[]},cause:i,fronts:[{id:`${r}-f0`,name:`${t.name} - ${o.name} Front`,belligerents:[a,n],control:0,contestedOutput:0,openedAt:e.t,terrain:"plains",attritionRate:4e-4}],exhaustion:{[a]:4,[n]:4},casualties:{},materiel:{},warGoal:i,publicSupport:{[a]:62,[n]:70}};e.wars[r]=l,t.wars.push(r),o.wars.push(r),t.relations[n]=m((t.relations[n]??0)-70,-100,100),o.relations[a]=m((o.relations[a]??0)-70,-100,100);for(const u of Object.values(e.treaties))if(!(!u.active||u.kind!=="alliance"&&u.kind!=="defensive-pact")&&!(!u.parties.includes(n)||u.parties.includes(a)))for(const c of u.parties)c===n||c===e.playerCountry||!e.countries[c]||l.belligerents[c]||te(e,r,c,n);return C(e,{kind:"military",severity:"catastrophic",country:a,title:`${t.name} declares war on ${o.name}`,body:i,actors:[a,n],byUserId:s,tags:["war"]}),l}function Dr(e,a,n){var y,S,R,D;const i=Object.keys(a.belligerents),s={};for(const b of i){const M=a.fronts.reduce((h,f)=>h+(f.belligerents[0]===b?f.control:-f.control),0)/Math.max(1,a.fronts.length);s[b]=M-(a.exhaustion[b]??0)/2}const t=Object.entries(s).sort((b,M)=>M[1]-b[1]),o=(y=t[0])==null?void 0:y[0],r=(S=t[t.length-1])==null?void 0:S[0];if(!o||!r)return;const l=s[o]-s[r];a.endedAt=e.t,a.outcome=l>45?"victory":l<-10?"defeat":"white-peace",a.victor=l>45?o:void 0;const u=e.countries[o],c=e.countries[r],d=[];if(Math.max(0,...a.fronts.map(b=>{const M=ua(a,b,e.countries);return M&&M.territory===r&&M.holder===o?M.share:0}))>=.8&&u&&c&&c.id!==e.playerCountry)ze(e,o,r,"Territorial concession at the end of the war"),d.push(`${c==null?void 0:c.name} is annexed in its entirety`);else if(u&&c){const b=c.economy.gdp*m(.02+l/900,.01,.24);c.economy.fiscal.debt+=b,u.economy.reserves+=b*.4,d.push(`${c.name} pays ${(b/1e9).toFixed(1)}bn in reparations`)}for(const b of i){const M=e.countries[b];M&&(M.wars=M.wars.filter(h=>h!==a.id),M.relations[o]=m((M.relations[o]??0)+18,-100,100),M.military.morale=m(M.military.morale+12,0,100),M.economy.monetary.inflation=m(M.economy.monetary.inflation+(M.unrestRisk??0)*.02,-.2,.9),M.unrestRisk>.05&&M.unrest.push({id:`unrest-${M.id}-postwar-${e.events.length}`,kind:"rebellion",intensity:m((M.unrestRisk-.05)*200,10,80),startedAt:e.t,fatalities:0}))}C(e,{kind:"military",severity:"major",title:`${a.name} ends`,body:`${a.outcome==="victory"?`Decisive victory for ${((R=e.countries[o])==null?void 0:R.name)??o}.`:a.outcome==="white-peace"?"A white peace. Everyone retreats to where they started.":`${((D=e.countries[r])==null?void 0:D.name)??r} capitulates.`} ${d.join(". ")}.`,actors:i,tags:["war","peace"]})}function ze(e,a,n,i,s){const t=e.countries[a],o=e.countries[n];if(!t||!o||t.id===o.id||o.annexedBy)return;const r=o.economy.gdp/Math.max(1,t.economy.gdp);t.economy.gdp+=o.economy.gdp,t.economy.population+=o.economy.population,t.economy.fiscal.debt+=o.economy.fiscal.debt,t.economy.reserves+=o.economy.reserves,t.economy.gdpPerCapita=t.economy.gdp/t.economy.population,t.economy.macro.potential*=1+r,t.economy.macro.realGdp*=1+r,t.economy.macro.capital*=1+r,t.economy.macro.realHistory=t.economy.macro.realHistory.map(l=>l*(1+r));for(const l of t.economy.sectors)l.quantity*=1+r,l.capacity*=1+r;for(const l of Object.keys(e.control))e.control[l]===n&&(e.control[l]=a);for(const l of e.regions)l.owner===n&&(l.owner=a);t.military.activeDuty+=o.military.activeDuty,t.military.spend+=o.military.spend;for(const[l,u]of Object.entries(o.economy.trade.flows))t.economy.trade.flows[l]=(t.economy.trade.flows[l]??0)+u;for(const l of Object.values(e.companies))if(l.country===n){l.country=a;const u=e.exchanges[l.exchangeId??""];u&&(u.listings=u.listings.filter(c=>c!==l.id),u.listings.push(l.id))}for(const l of Object.values(e.characters))l.country===n&&(l.removedAt=e.t);for(const l of o.parties)l.status="outside",delete e.parties[l.id];for(const l of o.wars){const u=e.wars[l];u&&!u.endedAt&&Object.keys(u.belligerents).filter(c=>c!==n).length<2&&(u.endedAt=e.t)}o.wars=[],o.annexedBy=a,C(e,{kind:"political",severity:"catastrophic",country:a,title:`${t.name} annexes ${o.name}`,body:i,actors:[a,n],byUserId:s,tags:["annexation"]})}function Fa(e,a,n,i,s,t=0,o){const r=n.filter(c=>e.countries[c]&&!e.countries[c].annexedBy);if(r.length<2)return null;const l=`treaty-${Object.keys(e.treaties).length}-${Math.round(e.t)}`,u={id:l,name:`${Tr(a)}: ${r.map(c=>e.countries[c].name).join(" / ")}`,kind:a,parties:r,signedAt:e.t,terms:i,tradeBonus:t||(a==="trade"||a==="customs-union"?1e10:0),favourability:Object.fromEntries(r.map(c=>[c,s.float(10,60)])),active:!0};if(e.treaties[l]=u,a==="alliance"||a==="defensive-pact"||a==="entente")for(const c of r)for(const d of r){if(c===d)continue;const p=e.countries[c];p.relations[d]=m((p.relations[d]??0)+34,-100,100),p.alliances.includes(d)||p.alliances.push(d)}if(a==="trade"||a==="customs-union")for(const c of r){const d=e.countries[c];for(const p of r)c!==p&&(d.economy.trade.flows[p]=(d.economy.trade.flows[p]??0)+t/r.length,d.economy.trade.tradeOpenness=m(d.economy.trade.tradeOpenness+4,0,96))}return C(e,{kind:"diplomatic",severity:"major",title:`${u.name} signed`,body:i.join(". "),actors:r,byUserId:o,tags:["treaty"]}),u}function Br(e,a,n,i){var t;a.parties=a.parties.filter(o=>o!==n),a.parties.length<2&&(a.active=!1);const s=e.countries[n];if(s)for(const o of a.parties)s.relations[o]=m((s.relations[o]??0)-30,-100,100),s.alliances=s.alliances.filter(r=>r!==o);C(e,{kind:"diplomatic",severity:"major",title:`${((t=e.countries[n])==null?void 0:t.name)??n} withdraws from ${a.name}`,body:"The agreement is torn up.",actors:[n,...a.parties],byUserId:i,tags:["treaty"]})}function Tr(e){return{alliance:"Alliance","non-aggression":"Non-aggression Pact",trade:"Trade Agreement",entente:"Entente",peace:"Peace Treaty","defensive-pact":"Defensive Pact",access:"Access Agreement","customs-union":"Customs Union","lend-lease":"Lend-Lease Agreement"}[e]}function ma(e,a,n,i,s,t){const o=e.countries[a],r=e.countries[n];if(!o||!r)return null;const l=r.sanctions.find(S=>{var R;return(R=e.sanctions[S])==null?void 0:R.imposedBy.includes(a)});if(l)return e.sanctions[l];const u=`sanction-${Object.keys(e.sanctions).length}-${Math.round(e.t)}`,c=Math.sqrt(o.economy.gdp/Math.max(1,r.economy.gdp)),d=m(Math.round(24+c*22+s.float(-8,14)),8,92),p=(i==="embargo"||i==="technology"||i==="oil"?1.5:1)*d,y={id:u,imposedBy:[a],on:n,at:e.t,kind:i,scope:d,duration:se*s.float(.6,3),until:e.t+se*s.float(.6,3),costToTarget:r.economy.gdp*p*.004,costToImposer:o.economy.gdp*p*6e-4,evasion:s.float(.05,.45)};return y.until=e.t+y.duration,e.sanctions[u]=y,r.sanctions.push(u),o.relations[n]=m((o.relations[n]??0)-45,-100,100),C(e,{kind:"diplomatic",severity:"major",country:n,title:`${o.name} imposes ${i} sanctions on ${r.name}`,body:`Coverage ${d}%. Estimated annual cost to the target: ${(y.costToTarget/1e9).toFixed(1)}bn.`,actors:[a,n],byUserId:t,tags:["sanctions"]}),y}function Ha(e,a,n){const i=e.sanctions[a];if(!i)return;const s=e.countries[i.on];if(s){s.sanctions=s.sanctions.filter(t=>t!==a);for(const t of i.imposedBy){const o=e.countries[t];o&&(o.relations[i.on]=m((o.relations[i.on]??0)+22,-100,100))}C(e,{kind:"diplomatic",severity:"notice",country:i.on,title:`Sanctions on ${s.name} lifted`,body:"The measures have been withdrawn.",byUserId:n,tags:["sanctions"]})}delete e.sanctions[a]}const Ir={1914:[{day:30,actors:["AUT","SRB"],run:e=>{Ee(e,"AUT","SRB","The Austro-Hungarian ultimatum after the assassination at Sarajevo is rejected.")}},{day:34,actors:["DEU","RUS"],run:e=>{if(!We(e,"AUT","SRB"))return;const a=Ee(e,"DEU","RUS","Russia mobilises in support of Serbia, and Germany answers.");a&&(te(e,a.id,"AUT","DEU"),te(e,a.id,"SRB","RUS"))}},{day:36,actors:["DEU","FRA"],run:e=>{const a=We(e,"DEU","RUS");a&&te(e,a,"FRA","RUS")}},{day:37,actors:["GBR","DEU"],run:e=>{const a=We(e,"DEU","RUS");a&&(te(e,a,"BEL","RUS"),te(e,a,"GBR","RUS"),te(e,a,"CAN","RUS"),te(e,a,"AUS","RUS"),te(e,a,"NZL","RUS"),te(e,a,"ZAF","RUS"),te(e,a,"RAJ","RUS"))}},{day:124,actors:["OTT"],run:e=>{const a=We(e,"DEU","RUS");a&&te(e,a,"OTT","DEU")}}],1950:[{day:175,actors:["PRK","KOR"],run:e=>{const a=Ee(e,"PRK","KOR","North Korean forces cross the 38th parallel to reunify the peninsula.");a&&te(e,a.id,"USA","KOR")}},{day:280,actors:["CHN"],run:e=>{const a=We(e,"PRK","KOR");a&&te(e,a,"CHN","PRK")}}],1990:[{day:31,actors:["DEU","DDR"],run:e=>{ze(e,"DEU","DDR","German reunification: the five eastern states accede to the Federal Republic.")}},{day:136,actors:["USA","IRQ"],run:e=>{C(e,{kind:"military",severity:"catastrophic",country:"IRQ",title:"Operation Desert Storm begins",body:"UN Resolution 678 has expired. The coalition air campaign against Iraq opens.",actors:["USA","IRQ"],tags:["war"]});const a=e.wars["war-gulf-crisis"];a&&(a.fronts[0].control=Math.min(a.fronts[0].control,30))}}],2010:[{day:123,actors:["GRC"],run:e=>{const a=e.countries.GRC;a&&(a.economy.macro.shock-=.05,C(e,{kind:"economic",severity:"major",country:"GRC",title:"Greece accepts a 110 billion euro bailout",body:"The euro zone and the IMF step in as Greek yields become unpayable. Deep austerity is the price.",tags:["crisis","debt"]}))}}],2020:[{day:20,actors:[],run:e=>{C(e,{kind:"economic",severity:"major",title:"Lockdowns spread across the world economy",body:"A third of humanity is under some form of lockdown. Central banks and treasuries respond at wartime scale.",tags:["crisis","pandemic"]})}}]},Rn=new WeakMap;function We(e,a,n){var i;return(i=Object.values(e.wars).find(s=>!s.endedAt&&s.belligerents[a]&&s.belligerents[n]))==null?void 0:i.id}function Ur(e){const a=Ir[e.scenarioId];if(!a)return;let n=Rn.get(e);n||(n=new Set,Rn.set(e,n)),a.forEach((i,s)=>{if(i.day!==e.dayCount)return;const t=`${e.scenarioId}-${s}`;n.has(t)||(n.add(t),!(e.playerCountry&&i.actors.includes(e.playerCountry))&&i.run(e))})}const de=Symbol("missing");function tt(e,a){if(!a)return de;let n=e;for(const i of a.split(".")){if(n==null||typeof n!="object")return de;const s=n;if(!(i in s))return de;n=s[i]}return n??de}function Lr(e,a,n){const i=a.split("."),s=tt(e,a);if(s===de)return de;let t=e;for(let o=0;o<i.length-1;o++)if(t=t[i[o]],t==null||typeof t!="object")return de;return t[i[i.length-1]]=n,s}function _(e,a){const n=tt(e,a);if(n===de||n===void 0||n===null)return NaN;if(typeof n=="number")return n;if(typeof n=="boolean")return n?1:0;if(typeof n=="string"){const i=Number(n);return Number.isFinite(i)?i:NaN}return NaN}function he(e,a,n){return Number.isFinite(n)?Lr(e,a,n)!==de:!1}function Or(e,a,n){const i=_(e,a);if(!Number.isFinite(i))return NaN;const s=i+n;return Number.isFinite(s)?(he(e,a,s),s):i}function xr(e,a){for(const n of e.directives)if(n.enabled)switch(n.kind){case"set-stat":{const i=ra(e,n.target,n.targetId);if(!i)continue;const s=_(i.obj,n.path);if(!Number.isFinite(s))continue;n.blend>=1?he(i.obj,n.path,n.value):he(i.obj,n.path,s+(n.value-s)*m(n.blend*(a/86400)*24,0,1));break}case"freeze":{const i=ra(e,n.target,n.targetId);if(!i)continue;const s=_(i.obj,n.path);Number.isFinite(s)&&n.frozenValue!==void 0&&he(i.obj,n.path,n.frozenValue);break}case"trigger":{Jr(e,n.when)&&(!n.lastFiredAt||e.t-n.lastFiredAt>600)&&(Ka(e,n.then),n.lastFiredAt=e.t);break}case"custom-rule":{Fr(e,n.rule);break}}}function ra(e,a,n){switch(a){case"country":{const i=e.countries[n]??e.customCountries[n];return i?{obj:i}:null}case"company":return e.companies[n]?{obj:e.companies[n]}:null;case"market":return{obj:e.markets};case"global":return{obj:e};default:return null}}function Fr(e,a,n){if(!a.enabled||a.maxFires>=0&&a.fired>=a.maxFires||a.lastFiredAt&&e.t-a.lastFiredAt<a.cooldownMs/1e3)return;const i=e.t,s=a.trigger;let t=!0;switch(s.type){case"always":t=!0;break;case"interval":t=!a.lastFiredAt||i-a.lastFiredAt>=(s.intervalSeconds??3600);break;case"random":t=Math.random()<(s.probability??.1);break;case"threshold":t=s.conditions.every(l=>Mn(e,l));break;case"on-event":t=s.conditions.every(l=>Mn(e,l));break}if(!t)return;const o=[];for(const l of a.actions){const u=Hr(e,l);u&&o.push(u)}a.fired++,a.lastFiredAt=i;const r=o.join("; ")||"no visible effect";a.log.unshift({t:i,message:r}),a.log.length>50&&(a.log.length=50),C(e,{kind:"system",severity:"info",title:`Rule fired: ${a.name}`,body:r,tags:["rule",a.id]})}function Mn(e,a){const n=[];if(a.scope==="country"&&a.target){const i=e.countries[a.target]??e.customCountries[a.target];i&&n.push({obj:i,id:i.id})}else if(a.scope==="any-country")for(const i of Object.values(e.countries))n.push({obj:i,id:i.id});else if(a.scope==="company"&&a.target){const i=e.companies[a.target];i&&n.push({obj:i,id:i.id})}else a.scope==="global"?n.push({obj:e,id:"world"}):a.scope==="war"&&a.target&&e.wars[a.target]&&n.push({obj:e.wars[a.target],id:a.target});if(!n.length)return!1;switch(a.aggregate){case"all":return n.every(i=>Aa(i.obj,a));case"count":return n.filter(i=>Aa(i.obj,a)).length>=Number(a.value);case"avg":{const i=n.map(s=>_(s.obj,a.path)).filter(Number.isFinite);return i.length?it(i.reduce((s,t)=>s+t,0)/i.length,a):!1}case"any":default:return n.some(i=>Aa(i.obj,a))}}function Aa(e,a){if(a.op==="exists")return Number.isFinite(_(e,a.path))||_(e,a.path)===0;const n=_(e,a.path);return Number.isFinite(n)?it(n,a):!1}function it(e,a){switch(a.op){case"<":return e<Number(a.value);case"<=":return e<=Number(a.value);case">":return e>Number(a.value);case">=":return e>=Number(a.value);case"==":return e===Number(a.value);case"!=":return e!==Number(a.value);case"between":return Array.isArray(a.value)&&e>=a.value[0]&&e<=a.value[1];case"contains":return String(_({},"")).includes(String(a.value));default:return!1}}function Hr(e,a){switch(a.type){case"set":{const n=ra(e,a.scope,a.target??"");return n?he(n.obj,a.path,a.value)?`set ${a.path} = ${a.value}`:`path ${a.path} not found`:`no target ${a.target}`}case"multiply":{const n=ra(e,a.scope,a.target??""),i=n?_(n.obj,a.path):NaN;return!n||!Number.isFinite(i)?`path ${a.path} not found`:(Or(n.obj,a.path,i*(a.value-1)),`multiplied ${a.path} by ${a.value}`)}case"spawn-war":{const n=Ee(e,a.attacker,a.defender,a.name??"Rule-triggered conflict","rules");return n?`declared ${n.name}`:"war could not be declared"}case"end-war":{const n=e.wars[a.warId];if(!n)return`no war ${a.warId}`;n.endedAt=e.t,n.outcome="white-peace";for(const i of Object.keys(n.belligerents)){const s=e.countries[i];s&&(s.wars=s.wars.filter(t=>t!==a.warId))}return`ended ${n.name}`}case"annex":return ze(e,a.annexer,a.target,"Rule-triggered annexation","rules"),`annexed ${a.target} into ${a.annexer}`;case"grant-money":{const n=e.countries[a.target];return n?(n.economy.fiscal.treasury+=a.amount,`granted ${(a.amount/1e9).toFixed(1)}bn to ${n.name}`):`no country ${a.target}`}case"ban-entity":{if(a.entityType==="company"){const n=e.companies[a.entityId];n&&(n.banned=!0,n.bannedReason=a.reason,n.listed=!1)}else if(a.entityType==="character"){const n=e.characters[a.entityId];n&&(n.banned=!0,n.removedAt=e.t)}else if(a.entityType==="party"){const n=e.parties[a.entityId];n&&(n.banned=!0)}else{const n=e.countries[a.entityId];n&&(n.banned=!0)}return`banned ${a.entityType} ${a.entityId}: ${a.reason}`}case"unban-entity":{if(a.entityType==="company"){const n=e.companies[a.entityId];n&&(n.banned=!1,n.bannedReason=void 0)}else if(a.entityType==="character"){const n=e.characters[a.entityId];n&&(n.banned=!1,n.removedAt=void 0)}else if(a.entityType==="party"){const n=e.parties[a.entityId];n&&(n.banned=!1)}else{const n=e.countries[a.entityId];n&&(n.banned=!1)}return`unbanned ${a.entityId}`}case"kill-character":{const n=e.characters[a.characterId];if(!n)return`no character ${a.characterId}`;n.removedAt=e.t;const i=e.countries[n.country];return i&&(C(e,{kind:"political",severity:"major",country:n.country,title:`${n.name} has died`,body:a.cause,tags:["death"]}),(i.executive.headOfGovernmentId===n.id||i.executive.headOfStateId===n.id)&&(i.executive.approval=m(i.executive.approval-25,0,100),i.executive.confidence=m(i.executive.confidence-30,0,100),e.characters[n.id].country&&i.legislature)),`${n.name} died (${a.cause})`}case"fire-minister":{const n=e.countries[a.country];if(!n)return`no country ${a.country}`;const i=n.executive.ministers.find(s=>s.id===a.area);return i?(i.characterId=void 0,i.partyId=void 0,n.executive.approval=m(n.executive.approval-6,0,100),`fired the ${a.area} minister of ${n.name}`):`${n.name} has no ${a.area} ministry`}case"force-election":{const n=e.countries[a.country];if(!(n!=null&&n.legislature))return`${a.country} has no legislature`;const i=n.legislature.chambers.find(t=>t.id===a.chamberId)??n.legislature.chambers[0];if(!i||i.election==="none")return`${n.name} has no elections`;n.elections.forEach(t=>{t.status!=="complete"&&(t.status="complete")});const s=60;return n.elections.push({id:`elec-${n.id}-forced-${Math.round(e.t)}`,country:n.id,chamberId:i.id,kind:i.election,scheduledAt:e.t,endsAt:e.t+20*86400,status:"campaign",votes:{},turnout:{},districtCount:s,districtPopulations:Array.from({length:s},()=>1/s),projection:{},enthusiasm:70,districtNames:Array.from({length:s},(t,o)=>`Extraordinary Constituency ${o+1}`)}),`forced an election in ${n.name}`}case"raise-referendum":{const n=e.countries[a.country];return n?(n.referendums.push({id:`ref-${n.id}-${Math.round(e.t)}`,country:n.id,question:a.question,calledBy:n.executive.headOfGovernmentId??"",at:e.t,closesAt:e.t+45*86400,options:[{id:"yes",label:"Yes",yes:0},{id:"no",label:"No",yes:0}],status:"open",turnout:.6}),`called a referendum in ${n.name}: ${a.question}`):`no country ${a.country}`}case"impose-sanction":return ma(e,a.by,a.on,a.kind,new Te(e.seed^Math.round(e.t)),"rules")?`sanctions imposed on ${a.on}`:"sanctions failed";case"log":return a.message;case"custom-script":return Ka(e,a.expression)??null;default:return null}}function Ka(e,a){const n=[];for(const i of a.split(/[\n;]+/)){const s=i.trim();if(!s||s.startsWith("#")||s.startsWith("//"))continue;const t=Kr(e,s);t&&n.push(t)}return n.length?n.join("; "):null}function Kr(e,a){const n=a.match(/^([A-Za-z0-9_.\-[\]]+)\s*(\+=|-=|\*=|\/=|=)\s*(.+)$/);if(n){const[,s,t,o]=n,r=Number(o.trim());if(!Number.isFinite(r))return`bad value in "${a}"`;const l=$r(e,s);if(!l)return`no target for "${s}"`;const u=Number.isFinite(_(l.obj,l.path))?_(l.obj,l.path):0;let c=u;return t==="="?c=r:t==="+="?c=u+r:t==="-="?c=u-r:t==="*="?c=u*r:t==="/="&&(c=r===0?u:u/r),he(l.obj,l.path,c)?`${s} -> ${c}`:`cannot set ${s}`}const i=a.match(/^([a-zA-Z]+)\((.*)\)$/);if(i){const[,s,t]=i,o=t.split(",").map(r=>r.trim().replace(/^["']|["']$/g,""));switch(s){case"gdp":{const r=e.countries[o[0]];return r&&he(r,"economy.gdp",Number(o[1]))?`${r.name} GDP set to ${o[1]}`:null}case"unrest":{const r=e.countries[o[0]];return r?(r.unrestRisk=m(r.unrestRisk+Number(o[1]??.1),0,1),`${r.name} unrest ${r.unrestRisk.toFixed(2)}`):null}case"approval":{const r=e.countries[o[0]];return r?(r.executive.approval=m(r.executive.approval+Number(o[1]??0),0,100),`${r.name} approval ${r.executive.approval.toFixed(0)}`):null}case"war":return Ee(e,o[0],o[1],"Console order","console")?`war declared ${o[0]} vs ${o[1]}`:null;case"annex":return ze(e,o[0],o[1],"Console order","console"),`annexed ${o[1]} -> ${o[0]}`;case"grant":{const r=e.countries[o[0]];return r?(r.economy.fiscal.treasury+=Number(o[1]??0),`granted ${o[1]} to ${r.name}`):null}case"create-country":{const r=o[0];if(!r)return null;if(!e.customCountries[r]){const{country:l,characters:u}=Fo(e,r,o[1]??r);for(const c of u)e.characters[c.id]=c;e.customCountries[r]=l,e.countries[r]=l;for(const c of l.parties)e.parties[c.id]=c}return`created ${r}`}case"remove-country":{const r=e.countries[o[0]];return r?(r.annexedBy=o[1]??r.overlord??"INT",r.dependencies={},`${o[0]} abolished`):null}default:return null}}return null}function $r(e,a){const n=a.match(/^(?:country|company|global)\(([A-Za-z0-9_]+)\)\.(.+)$/);if(n){const[,i,s]=n;if(i==="global")return{obj:e,path:s};const t=e.countries[i]??e.customCountries[i];if(t)return{obj:t,path:s};const o=e.companies[i];return o?{obj:o,path:s}:null}return{obj:e,path:a}}function Jr(e,a){const n=a.trim();if(!n)return!1;const i=n.match(/^([a-zA-Z0-9_]+)\s*(>=|<=|>|<|==)\s*(.+)$/);if(!i)return!1;const[,s,t,o]=i,r=Number(o);if(!Number.isFinite(r))return!1;const l=e.countries[s]??e.customCountries[s],u=l?_(l,"economy.gdp"):s==="warCount"?Object.keys(e.wars).length:_(e.globals,"worldConflictIndex");switch(t){case">":return u>r;case"<":return u<r;case">=":return u>=r;case"<=":return u<=r;case"==":return u===r;default:return!1}}const Oe=86400,Wr=30;class Vr{constructor(a,n){Qe(this,"rng");Qe(this,"carry",0);this.world=a,this.rng=new Te(a.seed),n!==void 0&&(this.rng.state=n),a.dayCount===void 0&&(a.dayCount=Math.floor(a.t/Oe))}get rngState(){return this.rng.state}set rngState(a){this.rng.state=a}tick(a){const n=this.world,i=n.events.length;if(!n.paused&&a>0){const s=m(a,0,2);this.carry+=s*n.daysPerSecond*n.speed;const t=Math.floor(this.carry);t>0&&(this.carry-=t,this.advanceDays(t))}return{dt:a,events:n.events.slice(i),version:n.version}}advanceDays(a){const n=this.world;for(let i=0;i<a;i++)n.t+=Oe,n.dayCount++,Nr(n,this.rng,Oe),Ur(n),n.dayCount%7===0&&(zo(n,this.rng),vr(n,this.rng),Cr(n,this.rng,7*Oe),xr(n,7*Oe),xe(n)),n.dayCount%Wr===0&&wr(n),n.dayCount%365===0&&sr(n);n.updatedAt=Date.now(),n.version++}}function wr(e){for(const a of Object.values(e.countries)){if(a.annexedBy)continue;const n=a.economy,i=e.markets.exchanges.find(s=>s.country===a.id);n.history.push({t:e.t,gdp:n.gdp,gdpGrowth:n.gdpGrowth,inflation:n.monetary.inflation,unemployment:n.labour.unemployment,debtToGdp:n.fiscal.debtToGdp,stockIndex:(i==null?void 0:i.index)??0}),n.history.length>480&&n.history.splice(0,n.history.length-480)}}function ot(e,a){const n={...a,id:a.id??`dir-${e.directives.length}-${Math.round(e.t)}`,createdAt:Date.now()};return e.directives.push(n),n}function jr(e,a){const n=e.directives.filter(s=>s.kind==="custom-rule").length,i={...a,id:a.id??`rule-${n}-${Math.round(e.t)}`,fired:0,log:[],createdAt:Date.now()};return ot(e,{kind:"custom-rule",rule:i,enabled:!0,note:i.name,createdBy:a.createdBy}),i}function na(e,a,n){return e.speed=m(a,0,60),n!==void 0&&(e.paused=n),C(e,{kind:"system",severity:"info",title:e.paused?"World paused":"World resumed",body:`Speed set to ${e.speed}x.`,tags:["system"]}),{ok:!0,message:`Speed ${e.speed}x, ${e.paused?"paused":"running"}`}}function zr(e,a,n){const i=m(Math.ceil(n/Oe),1,7300);return a.advanceDays(i),{ok:!0,message:`Advanced ${i} in-game days`}}const vn={income:.8,corporate:.7,vat:.35,payroll:.4,tariff:1,royalty:.9},Cn=["defence","welfare","health","education","infrastructure","science","administration","subsidies"];function Yr(e,a){const n=[];let i=50;if(a.tax)for(const[t,o]of Object.entries(a.tax)){const r=e.economy.tax[t],l=o;n.push(`${t} tax ${(r*100).toFixed(1)}% to ${(l*100).toFixed(1)}%`),i-=(l-r)*160}if(a.budget)for(const[t,o]of Object.entries(a.budget)){const r=e.economy.budget[t],l=o;n.push(`${t} ${(r*100).toFixed(1)}% to ${(l*100).toFixed(1)}% of GDP`),(t==="welfare"||t==="health"||t==="education")&&(i+=(l-r)*220)}if(a.minimumWage!==void 0&&(n.push(`minimum wage to ${(a.minimumWage*100).toFixed(0)}% of the median`),i+=(a.minimumWage-e.economy.macro.minimumWage)*30),a.sector){const t=[a.sector.subsidy!==void 0?`subsidy ${(a.sector.subsidy*100).toFixed(0)}%`:"",a.sector.regulation!==void 0?`regulation ${(a.sector.regulation*100).toFixed(0)}`:"",a.sector.stateOwnership!==void 0?`state share ${(a.sector.stateOwnership*100).toFixed(0)}%`:""].filter(Boolean);n.push(`${a.sector.id}: ${t.join(", ")}`)}return a.centralBankIndependent!==void 0&&n.push(a.centralBankIndependent?"central bank independence":"government control of the central bank"),{title:a.tax&&a.budget?"Budget and Finance Bill":a.tax?"Finance Bill":a.budget?"Appropriations Bill":a.minimumWage!==void 0?"Minimum Wage Bill":a.sector?`${Zr(a.sector.id)} Sector Bill`:"Central Bank Bill",summary:n.join("; "),opinion:m(i,5,95)}}function Zr(e){return e.charAt(0).toUpperCase()+e.slice(1)}function ba(e,a,n){var s;const i=Yr(a,n);if(!i.summary)return{ok:!1,message:"Nothing has changed."};if(gr(a)){const t=a.legislature.chambers[0],o=a.executive.coalition[0]??((s=a.parties[0])==null?void 0:s.id)??"";return Object.values(e.bills).filter(u=>u.country===a.id&&(u.status==="introduced"||u.status==="in-committee")).length>=6?{ok:!1,message:"Parliament already has six government bills to get through."}:dr(e,a.id,{title:i.title,summary:i.summary,body:"",category:n.tax||n.budget?"money":"ordinary",sponsorId:a.executive.headOfGovernmentId??"",sponsorPartyId:o,chamberId:t.id,passageChambers:[t.id],effects:{},cost:0,whipStrength:e.params.whipStrength,publicOpinion:i.opinion,policy:n})?{ok:!0,message:`${i.title} sent to the ${t.name}. The vote is in three weeks.`}:{ok:!1,message:"The bill could not be introduced."}}return et(a,n),a.executive.approval=m(a.executive.approval+(i.opinion-50)*.04,0,100),C(e,{kind:"legal",severity:"notice",country:a.id,title:`${a.name}: ${i.title.replace("Bill","Decree")}`,body:i.summary,tags:["decree"]}),{ok:!0,message:`Decreed: ${i.summary}`}}function qr(e,a,n,i){const s=String(i.type??"");if(s==="set-speed"){const r=na(e,Number(i.speed??e.speed),i.paused===void 0?void 0:!!i.paused);return e.events.pop(),e.ticker.shift(),r}if(s==="advance")return a.advanceDays(m(Math.round(Number(i.days??30)),1,3650)),{ok:!0,message:`Advanced ${i.days} days.`};if(s==="choose-country"){const r=e.countries[String(i.country??"")];return!r||r.annexedBy?{ok:!1,message:"That state does not exist."}:(e.playerCountry=r.id,{ok:!0,message:`You now govern ${r.name}.`})}const t=e.playerCountry?e.countries[e.playerCountry]:void 0;if(!t)return{ok:!1,message:"Choose a country to govern first."};if(t.annexedBy)return{ok:!1,message:`${t.name} no longer exists.`};const o=t.economy;switch(s){case"apply-policy":{const r={};if(i.tax){r.tax={};for(const[l,u]of Object.entries(i.tax)){const c=l;vn[c]!==void 0&&(r.tax[c]=m(Number(u),0,vn[c]))}}if(i.budget){r.budget={};for(const[l,u]of Object.entries(i.budget)){const c=l;Cn.includes(c)&&(r.budget[c]=m(Number(u),0,.5))}}return i.minimumWage!==void 0&&(r.minimumWage=m(Number(i.minimumWage),0,1)),ba(e,t,r)}case"set-sector":return ba(e,t,{sector:{id:String(i.id),subsidy:Ra(i.subsidy),regulation:Ra(i.regulation),stateOwnership:Ra(i.stateOwnership)}});case"set-rate":return o.centralBank.independent?{ok:!1,message:"The central bank is independent. It sets rates itself."}:o.centralBank.regime==="union"?{ok:!1,message:"Rates are set by the currency union."}:(o.monetary.centralBankRate=m(Number(i.value),-.01,5),{ok:!0,message:`Policy rate target set to ${(o.monetary.centralBankRate*100).toFixed(2)}%.`});case"set-independence":return ba(e,t,{centralBankIndependent:!!i.value});case"set-printing":return o.centralBank.regime==="union"?{ok:!1,message:"A currency union member cannot print money."}:o.centralBank.independent?{ok:!1,message:"An independent central bank refuses to finance the deficit."}:(o.centralBank.printing=z(Number(i.value)),{ok:!0,message:o.centralBank.printing>0?`${(o.centralBank.printing*100).toFixed(0)}% of the deficit will be financed by printing money.`:"The printing presses stop."});case"set-target":return o.centralBank.target=m(Number(i.value),0,.2),{ok:!0,message:`Inflation target is now ${(o.centralBank.target*100).toFixed(1)}%.`};case"set-qe":return o.centralBank.regime==="union"?{ok:!1,message:"Asset purchases are run by the currency union."}:(o.centralBank.qe=m(Number(i.value),0,1),{ok:!0,message:`Central bank holdings set to ${(o.centralBank.qe*100).toFixed(0)}% of GDP.`});case"set-regime":{const r=String(i.value);return r!=="float"&&r!=="peg"&&r!=="gold"?{ok:!1,message:"Unknown monetary regime."}:o.centralBank.regime==="union"?{ok:!1,message:"You would have to leave the currency union first."}:(o.centralBank.regime=r,r==="gold"&&(o.centralBank.target=0),C(e,{kind:"economic",severity:"major",country:t.id,title:`${t.name} moves to ${r==="float"?"a floating currency":r==="gold"?"the gold standard":"a currency peg"}`,body:"The monetary regime has changed.",tags:["monetary"]}),{ok:!0,message:"Monetary regime changed."})}case"stabilisation-plan":return o.monetary.inflation<.15?{ok:!1,message:"Inflation is not high enough to need this."}:(_n(e,t),t.executive.approval=m(t.executive.approval-3,0,100),{ok:!0,message:"Stabilisation plan announced. Expect a short recession."});case"trade-barrier":{const r=e.countries[String(i.partner)];if(!r)return{ok:!1,message:"No such partner."};const l=z(Number(i.value));return t.tradeBarriers??(t.tradeBarriers={}),l<=0?delete t.tradeBarriers[r.id]:t.tradeBarriers[r.id]=l,t.relations[r.id]=m((t.relations[r.id]??0)-l*25,-100,100),r.relations[t.id]=m((r.relations[t.id]??0)-l*30,-100,100),r.tradeBarriers??(r.tradeBarriers={}),l>=.2&&r.id!==e.playerCountry&&(r.relations[t.id]??0)<10&&(r.tradeBarriers[t.id]=l*.6),(l>=1||l>=.25)&&C(e,{kind:"diplomatic",severity:"major",country:t.id,title:l>=1?`${t.name} embargoes ${r.name}`:`${t.name} raises tariffs on ${r.name}`,body:`An extra ${(l*100).toFixed(0)}% barrier on bilateral trade.`,actors:[t.id,r.id],tags:["trade"]}),{ok:!0,message:l>0?`${(l*100).toFixed(0)}% barrier on ${r.name}.`:`Trade with ${r.name} normalised.`}}case"sanction":return ma(e,t.id,String(i.target),String(i.kind??"financial"),n)?{ok:!0,message:"Sanctions imposed."}:{ok:!1,message:"Sanctions could not be imposed."};case"lift-sanction":{const r=e.sanctions[String(i.id)];return r!=null&&r.imposedBy.includes(t.id)?(Ha(e,r.id),{ok:!0,message:"Sanctions lifted."}):{ok:!1,message:"Those are not your sanctions."}}case"declare-war":{const r=String(i.target);if(t.overlord&&t.dependencies)return{ok:!1,message:`${t.name} cannot declare war without its overlord.`};if(t.alliances.includes(r))return{ok:!1,message:"You cannot attack a treaty ally. Leave the treaty first."};const l=Ee(e,t.id,r,String(i.cause??"A territorial dispute."));return l?(t.executive.approval=m(t.executive.approval+(Na(t.government)?2:-4),0,100),{ok:!0,message:l.name}):{ok:!1,message:"War could not be declared."}}case"set-stance":{const r=e.wars[String(i.war)],l=String(i.stance);return!r||r.endedAt||!r.belligerents[t.id]?{ok:!1,message:"You are not fighting that war."}:l!=="offensive"&&l!=="balanced"&&l!=="defensive"?{ok:!1,message:"Unknown orders."}:(r.stance={...r.stance,[t.id]:l},{ok:!0,message:l==="offensive"?"Offensive ordered. Casualties will rise.":l==="defensive"?"Your forces dig in.":"Normal operations."})}case"seek-peace":{const r=e.wars[String(i.war)];if(!r||r.endedAt||!r.belligerents[t.id])return{ok:!1,message:"You are not fighting that war."};const l=r.exhaustion[t.id]??0,u=Object.keys(r.belligerents).filter(S=>S!==t.id),c=u.reduce((S,R)=>S+(r.exhaustion[R]??0),0)/Math.max(1,u.length),d=r.fronts.find(S=>S.belligerents.includes(t.id)),p=d?d.belligerents[0]===t.id?d.control:-d.control:0;if(c+Math.max(0,p)*.3<28&&!i.force)return{ok:!1,message:"The enemy still believes it can win. They refuse to talk yet."};const y=p<-25?o.gdp*m((-p-25)*.002,.01,.2):0;y>0&&(o.fiscal.debt+=y),r.endedAt=e.t,r.outcome="white-peace";for(const S of Object.keys(r.belligerents)){const R=e.countries[S];R&&(R.wars=R.wars.filter(D=>D!==r.id));for(const D of r.belligerents[S]??[]){const b=e.countries[D];b&&(b.wars=b.wars.filter(M=>M!==r.id))}}return C(e,{kind:"military",severity:"major",country:t.id,title:`Peace ends the ${r.name}`,body:y>0?`${t.name} accepts terms and pays ${(y/1e9).toFixed(1)}B in reparations.`:"A negotiated peace on the current lines.",actors:Object.keys(r.belligerents),tags:["war","peace"]}),{ok:!0,message:"Peace signed."+(l>70?" Your army was close to breaking.":"")}}case"offer-treaty":{const r=e.countries[String(i.partner)],l=String(i.kind??"trade");if(!r)return{ok:!1,message:"No such state."};const u=r.relations[t.id]??0,c={alliance:45,"defensive-pact":40,trade:-5,"customs-union":25,"non-aggression":-25};if(u<(c[l]??20))return{ok:!1,message:`${r.name} declines. Relations of ${u.toFixed(0)} are too low; they want ${c[l]??20}.`};const d=Fa(e,l,[t.id,r.id],[`Signed by ${t.name} and ${r.name}.`],n,Math.min(o.gdp,r.economy.gdp)*.01);return d?{ok:!0,message:`${d.name} signed.`}:{ok:!1,message:"The treaty failed."}}case"leave-treaty":{const r=e.treaties[String(i.id)];if(!(r!=null&&r.parties.includes(t.id)))return{ok:!1,message:"You are not party to that treaty."};r.parties=r.parties.filter(l=>l!==t.id),r.parties.length<2&&(r.active=!1),t.alliances=t.alliances.filter(l=>!r.parties.includes(l));for(const l of r.parties){t.relations[l]=m((t.relations[l]??0)-25,-100,100);const u=e.countries[l];u&&(u.relations[t.id]=m((u.relations[t.id]??0)-25,-100,100),u.alliances=u.alliances.filter(c=>c!==t.id))}return C(e,{kind:"diplomatic",severity:"major",country:t.id,title:`${t.name} leaves ${r.name}`,body:"The treaty partners are not pleased.",tags:["treaty"]}),{ok:!0,message:`Left ${r.name}.`}}case"diplomatic-mission":{const r=e.countries[String(i.partner)];if(!r)return{ok:!1,message:"No such state."};const l=o.gdp*2e-4;o.fiscal.debt+=l;const u=n.float(3,9);return r.relations[t.id]=m((r.relations[t.id]??0)+u,-100,100),t.relations[r.id]=m((t.relations[r.id]??0)+u,-100,100),{ok:!0,message:`Relations with ${r.name} improve by ${u.toFixed(0)}.`}}case"imf-bailout":{if(e.startDate.year<1950)return{ok:!1,message:"There is no IMF in this era. Try the London bankers."};if(o.macro.riskPremium<.05&&!o.macro.defaulted)return{ok:!1,message:"Your borrowing costs are not bad enough to qualify."};const r=o.gdp*.1;o.reserves+=r,o.macro.riskPremium*=.6,o.macro.debtCost*=.85,o.macro.bailout=!0,o.macro.defaulted=!1;for(const l of Cn)o.budget[l]*=l==="defence"?.85:.92;return o.tax.vat=m(o.tax.vat*1.1,0,.3),o.centralBank.printing=0,t.executive.approval=m(t.executive.approval-9,0,100),C(e,{kind:"economic",severity:"major",country:t.id,title:`${t.name} accepts an IMF programme`,body:`A ${(r/1e9).toFixed(0)}B loan comes with spending cuts and a VAT rise.`,tags:["debt"]}),{ok:!0,message:"IMF programme agreed. Austerity follows."}}case"default":{if(o.macro.defaulted)return{ok:!1,message:"You are already in default."};const r=m(Number(i.haircut??.4),.1,.8);return o.fiscal.debt*=1-r,o.macro.defaulted=!0,o.macro.shock-=.06,o.macro.shockDecay=.8,t.executive.approval=m(t.executive.approval-8,0,100),C(e,{kind:"economic",severity:"catastrophic",country:t.id,title:`${t.name} repudiates its debts`,body:`Bondholders lose ${(r*100).toFixed(0)}%. International lending dries up.`,tags:["crisis","debt"]}),{ok:!0,message:"You have defaulted."}}case"nationalise":case"privatise":{const r=e.companies[String(i.company)];return!r||r.country!==t.id?{ok:!1,message:"That company is outside your jurisdiction."}:Xr(e,t,r,s==="nationalise")}case"bail-out":{const r=e.companies[String(i.company)];if(!r||r.country!==t.id)return{ok:!1,message:"That company is outside your jurisdiction."};const l=Math.max(r.debt*.7,r.revenue*.1);return o.fiscal.debt+=l,r.debt-=Math.min(r.debt,l),r.insolvent=!1,r.stateOwnership=z(r.stateOwnership+.2),C(e,{kind:"corporate",severity:"major",country:t.id,title:`${t.name} bails out ${r.name}`,body:`The state takes on ${(l/1e9).toFixed(1)}B and a 20% stake.`,tags:["corporate"]}),{ok:!0,message:`${r.name} rescued for ${(l/1e9).toFixed(1)}B.`}}case"set-policy-lever":{const r=String(i.area);return r in t.policies?(t.policies[r]=m(Number(i.value),-100,100),{ok:!0,message:`${r} stance updated.`}):{ok:!1,message:"Unknown policy."}}case"appoint":{const r=String(i.area),l=t.executive.ministers.find(d=>d.id===r),u=String(i.name??"").trim().slice(0,60);if(!l||!u)return{ok:!1,message:"Choose a post and a name."};const c={id:`ch-${t.id}-apt-${e.dayCount}-${r}`,name:u,country:t.id,role:"minister",partyId:t.executive.coalition[0],stats:{competence:Math.round(n.normal()*22+20),charisma:Math.round(n.normal()*22),integrity:Math.round(n.normal()*25),ambition:30,ideology:t.ideology,popularity:50,experience:45,militancy:0},createdAt:e.t};return e.characters[c.id]=c,l.characterId=c.id,{ok:!0,message:`${u} is the new ${l.title}.`,data:{competence:c.stats.competence}}}case"emergency-powers":{if(Na(t.government))return{ok:!1,message:"You already rule by decree."};const r=!!i.value;return t.executive.emergencyPowers=r,t.executive.approval=m(t.executive.approval-(r?12:-4),0,100),t.cohesion=m(t.cohesion-(r?8:0),0,100),C(e,{kind:"political",severity:"major",country:t.id,title:r?`${t.name}: state of emergency declared`:`${t.name}: state of emergency lifted`,body:r?"Parliament is bypassed. The government rules by decree.":"Normal government resumes.",tags:["emergency"]}),{ok:!0,message:r?"You now rule by emergency decree.":"Emergency powers ended."}}case"call-election":return t.nextElectionAt===void 0?{ok:!1,message:"There are no elections here."}:(t.nextElectionAt=e.t+45*86400,C(e,{kind:"political",severity:"major",country:t.id,title:`${t.name}: snap election called`,body:"Voters go to the polls in six weeks.",tags:["election"]}),{ok:!0,message:"Snap election in six weeks."});case"military":{const r=t.military;if(i.mobilise!==void 0){const l=Math.round(r.reserves*z(Number(i.mobilise)));return r.reserves-=l,r.activeDuty+=l,o.macro.nairu=m(o.macro.nairu-.002,.01,.3),{ok:!0,message:`${l.toLocaleString("en-US")} reservists called up.`}}return i.conscription!==void 0?(r.conscription=!!i.conscription,r.conscription&&(r.reserves=Math.round(r.reserves*1.5)),{ok:!0,message:r.conscription?"Conscription introduced.":"Conscription abolished."}):{ok:!1,message:"No military order given."}}default:return{ok:!1,message:`Unknown command "${s}".`}}}function Xr(e,a,n,i){if(i){if(n.stateOwnership>=.99)return{ok:!1,message:`${n.name} is already state owned.`};const o=n.valuation*(1-n.stateOwnership)*.6;a.economy.fiscal.debt+=o,n.stateOwnership=1,n.listed=!1;for(const r of e.markets.exchanges)r.listings=r.listings.filter(l=>l!==n.id);return e.markets.riskAppetite=m(e.markets.riskAppetite-n.valuation/Math.max(1,e.globals.globalGdp)*30,1,99),a.economy.macro.businessConfidence=m(a.economy.macro.businessConfidence-6,0,100),C(e,{kind:"corporate",severity:"major",country:a.id,title:`${a.name} nationalises ${n.name}`,body:`Owners are compensated ${(o/1e9).toFixed(1)}B. Investors take note.`,tags:["corporate"]}),{ok:!0,message:`${n.name} nationalised for ${(o/1e9).toFixed(1)}B.`}}if(n.stateOwnership<=.01)return{ok:!1,message:`${n.name} is not state owned.`};const s=n.valuation*n.stateOwnership;a.economy.fiscal.debt=Math.max(0,a.economy.fiscal.debt-s),n.stateOwnership=0;const t=e.markets.exchanges.find(o=>o.country===a.id);return t&&(n.exchangeId=t.id,n.listed=!0,t.listings.includes(n.id)||t.listings.push(n.id)),C(e,{kind:"corporate",severity:"major",country:a.id,title:`${a.name} privatises ${n.name}`,body:`The sale raises ${(s/1e9).toFixed(1)}B to pay down debt.`,tags:["corporate"]}),{ok:!0,message:`${n.name} sold for ${(s/1e9).toFixed(1)}B.`}}function Ra(e){return e==null?void 0:Number(e)}async function _r(e,a,n,i,s){switch(i.op){case"speed":return na(e,Number(i.speed??1),i.paused===void 0?void 0:!!i.paused);case"pause":return na(e,e.speed,!0);case"resume":return na(e,e.speed||1,!1);case"fast-forward":{const t=Number(i.days??30);return zr(e,a,t*86400)}case"set-param":{const t=String(i.key??"");if(!(t in e.params))return{ok:!1,message:`Unknown parameter "${t}"`};const o=_(e.params,t);return he(e.params,t,Number(i.value))?(C(e,{kind:"system",severity:"notice",title:`Parameter ${t} changed`,body:`${o} -> ${i.value} by ${s.username}`,byUserId:s.id,tags:["dev","params"]}),{ok:!0,message:`${t} = ${i.value}`}):{ok:!1,message:`Could not set ${t}`}}case"reset-params":{const t=ia(e.scenarioId);return e.params={...t.params},C(e,{kind:"system",severity:"notice",title:"Parameters reset",body:`Restored scenario defaults by ${s.username}`,byUserId:s.id,tags:["dev"]}),{ok:!0,message:"Parameters reset to scenario defaults"}}case"set-stat":{const t=String(i.scope??"country"),o=String(i.id??""),r=String(i.path??""),l=t==="country"?e.countries[o]??e.customCountries[o]:t==="company"?e.companies[o]:t==="global"?e:e.markets;if(!l)return{ok:!1,message:`No ${t} "${o}"`};const u=_(l,r);return Number.isFinite(u)?he(l,r,Number(i.value))?(C(e,{kind:"system",severity:"major",country:t==="country"?o:void 0,title:`${s.username} edited ${o}`,body:`${r}: ${u} -> ${i.value}`,byUserId:s.id,tags:["dev","stat"]}),{ok:!0,message:`${o}.${r} = ${i.value}`,data:{before:u,after:Number(i.value)}}):{ok:!1,message:"Write refused"}:{ok:!1,message:`Path "${r}" does not resolve to a number`}}case"inspect":{const t=String(i.scope??"country"),o=String(i.id??""),r=t==="company"?e.companies[o]:t==="global"?e:t==="market"?e.markets:e.countries[o]??e.customCountries[o];return r?{ok:!0,message:"ok",data:r}:{ok:!1,message:`No ${t} "${o}"`}}case"grant":{const t=e.countries[String(i.id??"")];if(!t)return{ok:!1,message:"No such country"};const o=Number(i.amount??0),r=String(i.where??"treasury");return r==="treasury"?t.economy.fiscal.treasury+=o:r==="gdp"?(t.economy.gdp+=o,t.economy.gdpPerCapita=t.economy.gdp/t.economy.population):r==="reserves"?t.economy.reserves+=o:r==="debt"?t.economy.fiscal.debt+=o:t.economy.fiscal.treasury+=o,C(e,{kind:"economic",severity:"major",country:t.id,title:`${s.username} adjusted ${t.name}'s books`,body:`${r} ${o>=0?"+":""}${o.toLocaleString()} credits.`,byUserId:s.id,tags:["dev","money"]}),{ok:!0,message:`${o>=0?"+":""}${o.toLocaleString()} credits to ${t.name} (${r})`}}case"mint":{const t=e.countries[String(i.id??"")];return t?(t.economy.fiscal.treasury+=Math.abs(Number(i.amount??0)),t.economy.monetary.moneySupply=m(t.economy.monetary.moneySupply+.02,.05,40),{ok:!0,message:`Minted ${Number(i.amount??0).toLocaleString()} credits in ${t.name}`}):{ok:!1,message:"No such country"}}case"delete-company":{const t=e.companies[String(i.id??"")];if(!t)return{ok:!1,message:"No such company"};delete e.companies[t.id];for(const o of e.markets.exchanges)o.listings=o.listings.filter(r=>r!==t.id);return C(e,{kind:"corporate",severity:"major",country:t.country,title:`${t.name} dissolved`,body:`Removed by ${s.username}. ${t.employees.toLocaleString()} jobs affected.`,byUserId:s.id,tags:["dev","company"]}),{ok:!0,message:`${t.name} dissolved`}}case"ban-company":{const t=e.companies[String(i.id??"")];if(!t)return{ok:!1,message:"No such company"};if(t.banned=!!(i.banned??!0),t.bannedReason=String(i.reason??"Banned by staff"),t.banned){t.listed=!1;for(const o of e.markets.exchanges)o.listings=o.listings.filter(r=>r!==t.id)}return C(e,{kind:"corporate",severity:"major",country:t.country,title:`${t.name} ${t.banned?"banned":"reinstated"}`,body:t.bannedReason,byUserId:s.id,tags:["dev","company"]}),{ok:!0,message:t.banned?`${t.name} banned`:`${t.name} reinstated`}}case"delete-character":{const t=e.characters[String(i.id??"")];if(!t)return{ok:!1,message:"No such character"};t.removedAt=e.t;const o=e.countries[t.country];if(o){if(o.executive.headOfStateId===t.id&&(o.executive.headOfStateId=void 0),o.executive.headOfGovernmentId===t.id&&(o.executive.headOfGovernmentId=void 0),o!=null&&o.legislature)for(const r of Object.values(o.legislature.membership)){const l=r.indexOf(t.id);l>=0&&r.splice(l,1)}for(const r of o.parties)r.leaderId===t.id&&(r.leaderId=void 0)}return C(e,{kind:"political",severity:"major",country:t.country,title:`${t.name} removed from office`,body:`Removed by ${s.username}. ${i.reason??""}`,byUserId:s.id,tags:["dev","character"]}),{ok:!0,message:`${t.name} removed`}}case"ban-character":{const t=e.characters[String(i.id??"")];return t?(t.banned=!!(i.banned??!0),t.banned?t.removedAt=e.t:t.removedAt=void 0,{ok:!0,message:t.banned?`${t.name} banned`:`${t.name} unbanned`}):{ok:!1,message:"No such character"}}case"create-character":{const t=e.countries[String(i.country??"")];if(!t)return{ok:!1,message:"No such country"};const o=`ch-${t.id}-dev-${Math.round(e.t)}`,r={id:o,name:String(i.name??"New Figure"),country:t.id,role:i.role??"minister",partyId:i.partyId?String(i.partyId):void 0,stats:{competence:Number(i.competence??50),charisma:Number(i.charisma??50),integrity:Number(i.integrity??50),ambition:Number(i.ambition??50),ideology:Number(i.ideology??t.ideology),popularity:Number(i.popularity??50),experience:Number(i.experience??50),militancy:Number(i.militancy??0)},createdAt:e.t};if(e.characters[o]=r,i.asHeadOfGovernment&&(t.executive.headOfGovernmentId=o),i.asHeadOfState&&(t.executive.headOfStateId=o),i.asMinister){const l=t.executive.ministers.find(u=>u.id===String(i.area??"economy"));l&&(l.characterId=o)}return{ok:!0,message:`${r.name} created`,data:{id:o}}}case"ban-party":{const t=e.parties[String(i.id??"")];return t?(t.banned=!!(i.banned??!0),t.banned&&(t.status="outside",Qr(e,t.country,t.id)),{ok:!0,message:t.banned?`${t.name} banned`:`${t.name} unbanned`}):{ok:!1,message:"No such party"}}case"remove-leader":{const t=e.countries[String(i.id??"")];if(!t)return{ok:!1,message:"No such country"};if(i.which==="head-of-state")t.executive.headOfStateId=void 0;else if(i.which==="head-of-government")t.executive.headOfGovernmentId=void 0;else{const o=t.executive.ministers.find(r=>r.id===String(i.area??""));o&&(o.characterId=void 0)}return{ok:!0,message:`${i.which??"leader"} removed`}}case"remove-country":{const t=e.countries[String(i.id??"")];return t?(t.annexedBy=String(i.by??"INT"),t.banned=!!(i.banned??!0),t.dependencies={},xe(e),C(e,{kind:"political",severity:"catastrophic",country:t.id,title:`${t.name} ceases to exist`,body:`Abolished by ${s.username}. ${i.reason??""}`,byUserId:s.id,tags:["dev","country"]}),{ok:!0,message:`${t.name} abolished`}):{ok:!1,message:"No such country"}}case"restore-country":{const t=e.countries[String(i.id??"")];return t?(t.annexedBy=void 0,t.banned=!1,xe(e),{ok:!0,message:`${t.name} restored`}):{ok:!1,message:"No such country"}}case"declare-war":{const t=Ee(e,String(i.attacker??""),String(i.defender??""),String(i.cause??"Dev intervention"),s.id);return t?{ok:!0,message:t.name}:{ok:!1,message:"Could not declare war"}}case"end-war":{const t=e.wars[String(i.id??"")];if(!t)return{ok:!1,message:"No such war"};t.endedAt=e.t,t.outcome="white-peace";for(const o of Object.keys(t.belligerents)){const r=e.countries[o];r&&(r.wars=r.wars.filter(l=>l!==t.id))}return C(e,{kind:"military",severity:"major",title:`${t.name} ended by order`,body:`${s.username} imposed a ceasefire.`,byUserId:s.id,tags:["dev","war"]}),{ok:!0,message:`${t.name} ended`}}case"annex":return ze(e,String(i.annexer??""),String(i.target??""),String(i.cause??"Dev intervention"),s.id),{ok:!0,message:"Annexed"};case"treaty":{const t=Fa(e,i.kind??"alliance",i.parties??[],i.terms??[],n,Number(i.tradeBonus??0),s.id);return t?{ok:!0,message:t.name}:{ok:!1,message:"Treaty could not be signed"}}case"sanction":return ma(e,String(i.by??""),String(i.on??""),i.kind??"financial",n,s.id)?{ok:!0,message:"Sanctions imposed"}:{ok:!1,message:"Could not impose sanctions"};case"lift-sanction":return Ha(e,String(i.id??""),s.id),{ok:!0,message:"Sanctions lifted"};case"force-election":{const t=e.countries[String(i.country??"")];if(!(t!=null&&t.legislature))return{ok:!1,message:"No legislature"};const o=t.legislature.chambers.find(r=>r.id===i.chamberId)??t.legislature.chambers[0];if(!o||o.election==="none")return{ok:!1,message:"This country does not hold elections"};for(const r of t.elections)r.status!=="complete"&&(r.status="complete");return t.elections.push({id:`elec-${t.id}-forced-${Math.round(e.t)}`,country:t.id,chamberId:o.id,kind:o.election,scheduledAt:e.t,endsAt:e.t+20*86400,status:"campaign",votes:{},turnout:{},districtCount:60,districtPopulations:Array.from({length:60},()=>1/60),projection:{},enthusiasm:70,districtNames:Array.from({length:60},(r,l)=>`Extraordinary Constituency ${l+1}`)}),C(e,{kind:"political",severity:"major",country:t.id,title:`${t.name} calls an extraordinary election`,body:`Called by ${s.username}.`,byUserId:s.id,tags:["dev","election"]}),{ok:!0,message:"Election forced"}}case"raise-referendum":{const t=e.countries[String(i.country??"")];return t?(t.referendums.push({id:`ref-${t.id}-dev-${Math.round(e.t)}`,country:t.id,question:String(i.question??"Shall the current government continue?"),calledBy:s.id,at:e.t,closesAt:e.t+30*86400,options:[{id:"yes",label:"Yes",yes:0},{id:"no",label:"No",yes:0}],status:"open",turnout:.6}),{ok:!0,message:"Referendum called"}):{ok:!1,message:"No such country"}}case"form-party":{const t=e.countries[String(i.country??"")];if(!t)return{ok:!1,message:"No such country"};const o=`${t.id}-party-dev-${Math.round(e.t)}`,r={id:o,country:t.id,name:String(i.name??"New Movement"),abbreviation:String(i.abbreviation??"NM"),ideology:Number(i.ideology??0),cohesion:70,popularity:Number(i.popularity??12),color:String(i.color??"#8e44ad"),seats:{},treasury:1e8,memberCount:1e3,status:"outside",platform:Object.fromEntries(["economy","tax","welfare","health","education","environment","defence","immigration","foreign-policy","justice","technology","housing","energy","transport","agriculture","labour"].map(l=>[l,Number(i.ideology??0)])),founded:e.t};return t.parties.push(r),e.parties[o]=r,C(e,{kind:"political",severity:"major",country:t.id,title:`${r.name} founded in ${t.name}`,body:`A new party with ${r.ideology<0?"left":"right"} leanings. Created by ${s.username}.`,byUserId:s.id,tags:["dev","party"]}),{ok:!0,message:`${r.name} founded`,data:{id:o}}}case"delete-party":{const t=e.parties[String(i.id??"")];if(!t)return{ok:!1,message:"No such party"};const o=e.countries[t.country];return o&&(o.parties=o.parties.filter(r=>r.id!==t.id)),delete e.parties[t.id],{ok:!0,message:`${t.name} dissolved`}}case"add-directive":return{ok:!0,message:"Directive added",data:ot(e,i.directive)};case"remove-directive":{const t=e.directives.length;return e.directives=e.directives.filter(o=>o.id!==String(i.id??"")),{ok:!0,message:t===e.directives.length?"No such directive":"Directive removed"}}case"toggle-directive":{const t=e.directives.find(o=>o.id===String(i.id??""));return t?(t.enabled=!!i.enabled,{ok:!0,message:`Directive ${t.enabled?"enabled":"disabled"}`}):{ok:!1,message:"No such directive"}}case"add-rule":{const t=jr(e,i.rule);return C(e,{kind:"system",severity:"notice",title:`Rule installed: ${t.name}`,body:`Authored by ${s.username}.`,byUserId:s.id,tags:["dev","rule"]}),{ok:!0,message:`Rule "${t.name}" installed`,data:t}}case"remove-rule":{const t=e.directives.length;return e.directives=e.directives.filter(o=>!(o.kind==="custom-rule"&&o.rule.id===String(i.id??""))),{ok:!0,message:t===e.directives.length?"No such rule":"Rule removed"}}case"toggle-rule":{const t=e.directives.find(o=>o.kind==="custom-rule"&&o.rule.id===String(i.id??""));return t?(t.rule.enabled=!!i.enabled,t.enabled=t.rule.enabled,{ok:!0,message:`Rule ${t.rule.enabled?"enabled":"disabled"}`}):{ok:!1,message:"No such rule"}}case"console":{const t=Ka(e,String(i.code??""));return C(e,{kind:"system",severity:"info",title:"Console command",body:String(i.code??""),byUserId:s.id,tags:["dev","console"]}),{ok:!0,message:t??"No output",data:{result:t}}}case"patch-scenario":{const t=String(i.path??""),o=i.patch;if(!t||!o)return{ok:!1,message:"Need a path and a patch object"};const r=_(e.scenarioOverrides,t);return es(e.scenarioOverrides,t,o),C(e,{kind:"system",severity:"major",title:"Scenario data edited",body:`${t} patched by ${s.username}.`,byUserId:s.id,tags:["dev","scenario"]}),{ok:!0,message:`Patched ${t}`,data:{before:r}}}case"reset-world":{const t=ia(e.scenarioId),o=Ga(t,e.name,e.id,Date.now(),e.playerCountry);return o.paused=e.paused,xe(o),C(o,{kind:"system",severity:"major",title:"World reset",body:`Rebuilt from the ${t.name} scenario by ${s.username}.`,byUserId:s.id,tags:["dev","reset"]}),{ok:!0,message:"World rebuilt from scenario",replaced:o}}case"set-market":{const t=String(i.path??""),o=_(e.markets,t);return he(e.markets,t,Number(i.value))?{ok:!0,message:`${t}: ${o} -> ${i.value}`}:{ok:!1,message:"Write refused"}}default:return{ok:!1,message:`Unknown op "${i.op}"`}}}function Qr(e,a,n,i){const s=e.countries[a];s&&(s.executive.coalition=s.executive.coalition.filter(t=>t!==n))}function es(e,a,n){const i=a.split(".");let s=e;for(let t=0;t<i.length-1;t++)(typeof s[i[t]]!="object"||s[i[t]]===null)&&(s[i[t]]={}),s=s[i[t]];s[i[i.length-1]]=n}const Fe=self;let W=null,ue=null,we=null,$a=null,rt=-1,st=0,Ma=0,va=0,Ja=!1,He=null;const as=300,ns=6e4;function ts(e,a){const n=e.economy;return{...e,relations:a?e.relations:void 0,economy:{...n,history:a?n.history:[],macro:{...n.macro,realHistory:[],priceHistory:[]}}}}function is(e){return e}function os(){const e=W,a=Object.values(e.wars);return{type:"patch",countries:Object.values(e.countries).map(n=>ts(n,n.id===$a||n.id===e.playerCountry)),companies:Object.values(e.companies).map(is),wars:a,treaties:Object.values(e.treaties).filter(n=>n.active),sanctions:Object.values(e.sanctions),bills:Object.values(e.bills).slice(-60),characters:e.characters,markets:e.markets,ticker:e.ticker.slice(0,60),events:e.events.slice(-40),control:e.control,regions:e.regions,t:e.t,version:e.version,paused:e.paused,speed:e.speed,globals:e.globals,playerCountry:e.playerCountry,directives:e.directives,params:e.params}}function lt(){W&&(Fe.postMessage(os()),rt=W.version,st=performance.now(),Ja=!1)}function rs(){He&&clearInterval(He),Ma=performance.now(),va=performance.now(),He=setInterval(()=>{if(!W||!ue)return;const e=performance.now(),a=(e-Ma)/1e3;Ma=e;try{ue.tick(a)}catch(n){W.paused=!0,Fe.postMessage({type:"error",message:n instanceof Error?n.message:String(n)})}(W.version!==rt||Ja)&&e-st>=as&&lt(),!W.paused&&e-va>=ns&&(va=e,Da("autosave").then(n=>Fe.postMessage({type:"saved",meta:n,auto:!0})))},40)}function ta(e,a){W=e,ue=new Vr(e,a),we=new Te((a??e.seed)^1540483477),$a=e.playerCountry??null,rs()}const ss="crown-singleplayer",De="saves",Be="meta";function da(){return new Promise((e,a)=>{const n=indexedDB.open(ss,1);n.onupgradeneeded=()=>{n.result.createObjectStore(De),n.result.createObjectStore(Be)},n.onsuccess=()=>e(n.result),n.onerror=()=>a(n.error)})}function ct(e){return new Promise((a,n)=>{e.oncomplete=()=>a(),e.onerror=()=>n(e.error),e.onabort=()=>n(e.error)})}function ut(e){return new Promise((a,n)=>{e.onsuccess=()=>a(e.result),e.onerror=()=>n(e.error)})}let Wa="local";async function Da(e){var r;const a=W,n=`${Wa}:${a.id}:${e}`,i={id:n,name:e==="autosave"?`${a.name} (autosave)`:a.name,scenarioId:a.scenarioId,country:a.playerCountry,countryName:a.playerCountry?(r=a.countries[a.playerCountry])==null?void 0:r.name:void 0,t:a.t,startDate:a.startDate,updatedAt:Date.now()},s=JSON.stringify({world:a,rng:ue.rngState}),t=await da(),o=t.transaction([De,Be],"readwrite");return o.objectStore(De).put(s,n),o.objectStore(Be).put(i,n),await ct(o),t.close(),i}async function ls(){const e=await da(),a=await ut(e.transaction(Be).objectStore(Be).getAll());return e.close(),a.filter(n=>n.id.startsWith(`${Wa}:`)).sort((n,i)=>i.updatedAt-n.updatedAt)}async function cs(e){const a=await da(),n=await ut(a.transaction(De).objectStore(De).get(e));if(a.close(),!n)return!1;const i=JSON.parse(n);return i.world.paused=!0,ta(i.world,i.rng),!0}async function us(e){const a=await da(),n=a.transaction([De,Be],"readwrite");n.objectStore(De).delete(e),n.objectStore(Be).delete(e),await ct(n),a.close()}Fe.onmessage=async e=>{var i;const a=e.data,n=s=>Fe.postMessage({type:"reply",id:a.id,result:s});try{switch(a.kind){case"scope":return Wa=String(a.scope??"local"),n({ok:!0});case"new-game":{const s=ia(String(a.scenarioId)),t=`${s.id}-${Date.now().toString(36)}`,o=Ga(s,String(a.name||`${s.name}`),t,Date.now(),a.country?String(a.country):void 0);return ta(o),n({ok:!0,world:o})}case"preview":{const s=ia(String(a.scenarioId)),t=Ga(s,"preview","preview",Date.now()),o=Object.values(t.countries).map(r=>{var l;return{id:r.id,name:r.name,government:r.government,overlord:r.overlord,gdp:r.economy.gdp,population:r.economy.population,leader:((l=t.characters[r.executive.headOfGovernmentId??r.executive.headOfStateId??""])==null?void 0:l.name)??"",leaderTitle:r.executive.headOfGovernmentId?r.executive.headOfGovernmentTitle:r.executive.headOfStateTitle,region:r.region,wars:r.wars.length,debt:r.economy.fiscal.debtToGdp,growth:r.economy.gdpGrowth}});return n({ok:!0,polities:o})}case"load":{const s=await cs(String(a.saveId));return n(s?{ok:!0,world:W}:{ok:!1,message:"That save could not be found."})}case"list-saves":return n({ok:!0,saves:await ls()});case"delete-save":return await us(String(a.saveId)),n({ok:!0});case"save":{if(!W)return n({ok:!1,message:"No game running."});const s=await Da(String(a.slot??"manual"));return n({ok:!0,meta:s,message:"Game saved in this browser."})}case"export":return n(!W||!ue?{ok:!1,message:"No game running."}:{ok:!0,payload:JSON.stringify({world:W,rng:ue.rngState})});case"import":{const s=JSON.parse(String(a.payload));return(i=s==null?void 0:s.world)!=null&&i.countries?(s.world.paused=!0,ta(s.world,s.rng),n({ok:!0,world:W})):n({ok:!1,message:"That is not a CROWN save file."})}case"leave":return W&&await Da("autosave"),He&&clearInterval(He),He=null,W=null,ue=null,n({ok:!0});case"focus":return $a=a.country?String(a.country):null,Ja=!0,n({ok:!0});case"command":{if(!W||!ue||!we)return n({ok:!1,message:"No game running."});const s=qr(W,ue,we,a.body);return W.version++,lt(),n(s)}case"dev":{if(!W||!ue||!we)return n({ok:!1,message:"No game running."});const s=await _r(W,ue,we,a.body,{id:"local",username:String(a.username??"developer")});s.replaced&&ta(s.replaced),W.version++,Fe.postMessage({type:"snapshot",world:W});const{replaced:t,...o}=s;return n(o)}default:return n({ok:!1,message:`Unknown message ${a.kind}`})}}catch(s){return n({ok:!1,message:s instanceof Error?s.message:String(s)})}};
//# sourceMappingURL=sim.worker-8_hpBpX_.js.map
