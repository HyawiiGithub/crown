var Ci=Object.defineProperty;var Ni=(e,a,n)=>a in e?Ci(e,a,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[a]=n;var ia=(e,a,n)=>Ni(e,typeof a!="symbol"?a+"":a,n);const Ei={tickMs:2e3,growthSmoothing:.08,growthBias:1,okunSensitivity:.42,phillipsSensitivity:.35,inflationTarget:.02,policyRateSmoothing:.15,wagePush:.45,fiscalMultiplier:1.4,debtInterestBase:.018,debtInterestRisk:.06,bankruptcyThreshold:1.15,marketBeta:22,marketVolatility:.9,crashProbability:7e-4,tradeElasticity:1.6,warDamage:42e-5,crisisProbability:.0026,electionChaos:.1,corruptionDrag:.24,inequalityDrag:.18,sanctionBite:.55,corporateWeight:.42,whipStrength:.86,corruptionRate:16e-5,researchSpeed:1,firmFormation:.03,eventRate:1,seed:20260101},Gi=e=>({...Ei,...e}),Sn="Georgia,'Iowan Old Style','Palatino Linotype',Palatino,'Book Antiqua',serif",Pn="'Times New Roman',Times,'Liberation Serif',serif",Rn="Futura,'Avenir Next','Century Gothic','URW Gothic','Trebuchet MS',sans-serif",oa="'Helvetica Neue',Helvetica,Arial,'Liberation Sans',sans-serif",Bi="'Arial Narrow','Roboto Condensed','Liberation Sans Narrow','Helvetica Neue',Arial,sans-serif",Be="'SF Mono','JetBrains Mono',Menlo,Consolas,'Liberation Mono',monospace",_e="'Inter','Segoe UI',system-ui,'Helvetica Neue',Arial,sans-serif",De=e=>Gi(e),Jn=[{id:"1900",year:1900,name:"The Age of Empires",tagline:"Victoria reigns. The sun never sets, and every capital is a ledger.",description:"New Year's Day 1900. European empires hold most of the planet and Britain alone administers a quarter of humanity. The gold standard ties the world's money together, Boer commandos are besieging British garrisons in South Africa, and the Boxers are gathering in northern China. Every empire on this map believes it will last.",epoch:0,startDate:{year:1900,month:1,day:1},daysPerSecond:1,theme:{tokens:{"--bg":"#f3ede0","--bg-raised":"#fbf7ee","--bg-sunken":"#e7dfcd","--ink":"#1c1815","--ink-muted":"#5f564a","--rule":"#c9bda4","--accent":"#8a1c1c","--accent-2":"#9a7b28","--positive":"#2f5d3a","--negative":"#8a1c1c","--shadow":"0 1px 0 #c9bda4, 0 2px 6px rgba(60,45,20,.10)"},fontDisplay:Sn,fontBody:Sn,fontMono:Be,ocean:"#e5e0d2",unclaimed:"#ddd5c2",stroke:"#a99b7f",texture:"vellum",masthead:"THE CROWN LEDGER"},params:De({seed:19000101,growthSmoothing:.1,marketVolatility:1.5,crashProbability:.0022,debtInterestBase:.03,inflationTarget:.005,eventRate:.7,whipStrength:.9,corporateWeight:.22,corruptionRate:26e-5}),overrides:{global:{commodityPrices:{gold:18.6,oil:.9,wheat:.42,copper:3.2,coal:.5,"iron-ore":.22},riskAppetite:52}},tags:["imperial","pre-suffrage","gold-standard","gunboat-diplomacy"]},{id:"1914",year:1914,name:"The War to End All Wars",tagline:"The Archduke is dead. It is June, and nobody in the counting houses believes a war is coming.",description:"28 June 1914. Archduke Franz Ferdinand has just been shot in Sarajevo. In a month Austria-Hungary will declare war on Serbia, and the alliance system will pull in Russia, Germany, France and Britain within days, unless you stop it. The gold standard and the longest era of globalisation yet are about to end.",epoch:0,startDate:{year:1914,month:6,day:28},daysPerSecond:1,theme:{tokens:{"--bg":"#d9cfb8","--bg-raised":"#ece4d2","--bg-sunken":"#c3b79c","--ink":"#241f18","--ink-muted":"#6b5f4b","--rule":"#9d9078","--accent":"#8d3b1f","--accent-2":"#4a5548","--positive":"#4a6b48","--negative":"#8d3b1f","--shadow":"0 2px 0 rgba(60,45,25,.18)"},fontDisplay:Bi,fontBody:Pn,fontMono:Be,ocean:"#cdc4ac",unclaimed:"#c8bfa6",stroke:"#8c7f66",texture:"newsprint",masthead:"THE WAR EDITION"},params:De({seed:19140628,growthSmoothing:.05,marketVolatility:3.4,crashProbability:.0012,debtInterestBase:.045,inflationTarget:.015,warDamage:85e-5,eventRate:1.3,fiscalMultiplier:1.9,debtInterestRisk:.12,bankruptcyThreshold:.9}),overrides:{global:{commodityPrices:{gold:18.6,oil:.9,wheat:.42,copper:3.2},riskAppetite:34}},tags:["total-war","empire","mobilisation","gold-standard"]},{id:"1930",year:1930,name:"The Interwar Years",tagline:"Wall Street crashed four months ago. Nobody yet knows how far this goes.",description:"March 1930. Wall Street crashed in October and most governments think the slump will be short. Germany's Grand Coalition is about to fall, Stalin is collectivising the Soviet countryside, and the gold standard forces countries to tighten into the downturn. The League of Nations still exists, and its mandates cover the Middle East.",epoch:0,startDate:{year:1930,month:3,day:1},daysPerSecond:1,theme:{tokens:{"--bg":"#14181c","--bg-raised":"#1d2329","--bg-sunken":"#0d1013","--ink":"#f0e6d2","--ink-muted":"#9aa3ab","--rule":"#3a444d","--accent":"#d4af5c","--accent-2":"#4fb3a8","--positive":"#4fb3a8","--negative":"#e0654f","--shadow":"0 0 0 1px rgba(212,175,92,.28)"},fontDisplay:Rn,fontBody:Pn,fontMono:Be,ocean:"#101418",unclaimed:"#232a31",stroke:"#4b5862",texture:"blueprint",masthead:"CROWN QUARTERLY"},params:De({seed:19300301,growthSmoothing:.06,marketVolatility:2.6,crashProbability:.001,debtInterestBase:.055,inflationTarget:0,debtInterestRisk:.11,bankruptcyThreshold:.95,warDamage:7e-4,eventRate:1.2}),overrides:{global:{commodityPrices:{gold:20.7,oil:.27,wheat:.44,copper:1.4,coal:.15},riskAppetite:28}},tags:["great-depression","mass-suffrage","mandates","art-deco"]},{id:"1950",year:1950,name:"The Early Cold War",tagline:"Germany exists twice, China has just gone red, and the Soviets have the bomb.",description:"New Year's Day 1950. NATO is nine months old, Marshall Plan money is rebuilding Western Europe, Mao has just taken China, and the Soviet Union tested its first bomb in August. Britain still rations food and still rules much of Africa. Korea will explode in June, and the great post-war boom is about to begin.",epoch:0,startDate:{year:1950,month:1,day:1},daysPerSecond:1,theme:{tokens:{"--bg":"#e6e8e4","--bg-raised":"#f4f5f2","--bg-sunken":"#d3d6d1","--ink":"#20262b","--ink-muted":"#5d666d","--rule":"#a8b0aa","--accent":"#9b2c22","--accent-2":"#2c4b6f","--positive":"#3d6b46","--negative":"#9b2c22","--shadow":"0 1px 2px rgba(20,30,40,.10)"},fontDisplay:oa,fontBody:oa,fontMono:Be,ocean:"#d8dcd8",unclaimed:"#dfe2de",stroke:"#9aa29c",texture:"paper",masthead:"CROWN BUREAU"},params:De({seed:19500101,growthSmoothing:.09,marketVolatility:1.3,crashProbability:.0018,debtInterestBase:.035,inflationTarget:.015,corporateWeight:.3,eventRate:1.3,fiscalMultiplier:1.6,corruptionRate:2e-4}),overrides:{global:{commodityPrices:{gold:35,oil:2.9,wheat:1.2,copper:4.1,coal:3.4},riskAppetite:41}},tags:["cold-war","reconstruction","decolonisation","nato"]},{id:"1990",year:1990,name:"The Unipolar Moment",tagline:"Saddam has taken Kuwait. Germany reunifies next month. The Soviet Union is coming apart.",description:"2 September 1990. Iraq occupied Kuwait a month ago and a US-led coalition is massing in Saudi Arabia. Germany reunifies on 3 October. The Soviet Union still exists but its republics are declaring sovereignty one by one. Japan's bubble has just burst, and inflation is high across the West.",epoch:0,startDate:{year:1990,month:9,day:2},daysPerSecond:1,theme:{tokens:{"--bg":"#0b1220","--bg-raised":"#141e30","--bg-sunken":"#070d18","--ink":"#e8f0ff","--ink-muted":"#8ba0bf","--rule":"#24344d","--accent":"#39c5d8","--accent-2":"#7b6bff","--positive":"#3ddc97","--negative":"#ff6b6b","--shadow":"0 0 24px rgba(57,197,216,.14)"},fontDisplay:Rn,fontBody:_e,fontMono:Be,ocean:"#080f1c",unclaimed:"#16202f",stroke:"#2b3f5c",texture:"scan",masthead:"CROWN NETWORK"},params:De({seed:19900902,growthSmoothing:.1,marketVolatility:1.1,crashProbability:.0012,debtInterestBase:.065,inflationTarget:.03,eventRate:1.1,corporateWeight:.6,tradeElasticity:1.9}),overrides:{global:{commodityPrices:{gold:380,oil:24,wheat:4.6,copper:2.7},riskAppetite:66}},tags:["end-of-cold-war","gulf-crisis","reunification","globalisation"]},{id:"2010",year:2010,name:"After the Crash",tagline:"The banks have been bailed out. Now the markets are looking at the governments.",description:"New Year's Day 2010, fifteen months after Lehman Brothers. Unemployment is near 10% across the West, rates are at the floor, and China is leading the recovery with a giant stimulus. Greece has just admitted its deficit is far larger than reported, and the euro zone has no plan for what happens next.",epoch:0,startDate:{year:2010,month:1,day:1},daysPerSecond:1,theme:{tokens:{"--bg":"#f7f8fa","--bg-raised":"#ffffff","--bg-sunken":"#eceef2","--ink":"#151a21","--ink-muted":"#606b78","--rule":"#dfe3ea","--accent":"#2563eb","--accent-2":"#e11d48","--positive":"#0f9d58","--negative":"#e11d48","--shadow":"0 1px 3px rgba(20,30,50,.08)"},fontDisplay:oa,fontBody:_e,fontMono:Be,ocean:"#eef2f7",unclaimed:"#e6eaf0",stroke:"#c9d2de",texture:"paper",masthead:"CROWN TERMINAL"},params:De({seed:20100101,growthSmoothing:.11,marketVolatility:1.25,crashProbability:.0026,debtInterestBase:.028,inflationTarget:.02,eventRate:1.2,corruptionDrag:.26}),overrides:{global:{commodityPrices:{gold:1420,oil:79,wheat:12,copper:83},riskAppetite:44}},tags:["great-recession","euro-crisis","sovereign-debt","china-rising"]},{id:"2020",year:2020,name:"The Pandemic",tagline:"Every projection says the same thing. None of them are believed.",description:"11 March 2020. The WHO has just declared a pandemic. Markets are in free fall, travel is stopping, and within weeks a third of humanity will be locked down. Global GDP is heading for its worst fall since the 1930s. Central banks and treasuries are about to respond on a wartime scale.",epoch:0,startDate:{year:2020,month:3,day:11},daysPerSecond:1,theme:{tokens:{"--bg":"#071018","--bg-raised":"#0d1a24","--bg-sunken":"#040a10","--ink":"#dff1f7","--ink-muted":"#6e8b9b","--rule":"#17303f","--accent":"#2dd4bf","--accent-2":"#f472b6","--positive":"#34d399","--negative":"#fb7185","--shadow":"0 0 20px rgba(45,212,191,.10)"},fontDisplay:_e,fontBody:_e,fontMono:Be,ocean:"#050d15",unclaimed:"#0c1c26",stroke:"#1b3a4b",texture:"scan",masthead:"CROWN CRISIS DESK"},params:De({seed:20200311,growthSmoothing:.04,marketVolatility:3.2,crashProbability:.0012,debtInterestBase:.008,inflationTarget:.005,fiscalMultiplier:2.1,eventRate:1.2,crisisProbability:.003,corporateWeight:.55}),overrides:{global:{commodityPrices:{gold:1900,oil:24,wheat:8,copper:62},riskAppetite:12}},tags:["covid","lockdown","unprecedented-stimulus","supply-shock"]},{id:"2026",year:2026,name:"Present Day",tagline:"Trade blocs, sovereign debt, and a war nobody wants to fund.",description:"New Year's Day 2026. Tariffs are back, the war in Ukraine grinds on, US-China technology rivalry has hardened, European defence budgets are climbing, debt is high almost everywhere, and an AI boom is carrying the stock market. You start from here. Nothing after this point is written down.",epoch:0,startDate:{year:2026,month:1,day:1},daysPerSecond:1,theme:{tokens:{"--bg":"#09090b","--bg-raised":"#131318","--bg-sunken":"#050507","--ink":"#ededf0","--ink-muted":"#8b8b96","--rule":"#232329","--accent":"#f5f5f5","--accent-2":"#a78bfa","--positive":"#4ade80","--negative":"#f87171","--shadow":"0 0 0 1px #232329"},fontDisplay:oa,fontBody:_e,fontMono:Be,ocean:"#060608",unclaimed:"#15151a",stroke:"#2a2a32",texture:"paper",masthead:"CROWN"},params:De({seed:20260101}),overrides:{global:{commodityPrices:{gold:4300,oil:62,wheat:210,copper:11e3,silver:70},riskAppetite:58}},tags:["great-power","sanctions","ai","debt"]}],Di=Object.fromEntries(Jn.map(e=>[e.id,e]));function ua(e){const a=Di[e];if(!a)throw new Error(`Unknown scenario "${e}". Known: ${Jn.map(n=>n.id).join(", ")}`);return a}const ba=["agriculture","mining","manufacturing","energy","utilities","construction","transport","retail","finance","real-estate","telecom","technology","healthcare","education","defence","tourism","media"],ki=`
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
`,Ti={AF:{continent:"Africa",region:"africa"},AS:{continent:"Asia",region:"asia"},ME:{continent:"Asia",region:"middle-east"},EU:{continent:"Europe",region:"europe"},NA:{continent:"North America",region:"americas"},SA:{continent:"South America",region:"americas"},OC:{continent:"Oceania",region:"oceania"}},pa=ki.trim().split(`
`).map(e=>{const a=e.split("|"),n=Ti[a[4]];return{numeric:a[0],iso3:a[1],iso2:a[2],name:a[3],continent:n.continent,region:n.region,government:a[5],lat:Number(a[6]),lon:Number(a[7]),ideology:Number(a[8]),bloc:a[9],pop:a[10].split(",").map(Number),gdp:a[11].split(",").map(Number)}}),Se=Object.fromEntries(pa.map(e=>[e.iso3,e]));Object.fromEntries(pa.map(e=>[e.numeric,e]));pa.map(e=>e.iso3);const Ii={Kosovo:"XKX","N. Cyprus":"CYN",Somaliland:"SML","W. Sahara":"ESH"},Wn={XKX:{name:"Kosovo",lat:42.6,lon:21,pop:[1.9,1.8,1.8,1.7],gdp:[1.5,5.8,7.7,11.5]},SML:{name:"Somaliland",lat:9.8,lon:45.5,pop:[1.5,3,4,4.5],gdp:[.3,.8,1.5,2]},ESH:{name:"Western Sahara",lat:24.5,lon:-13,pop:[.2,.5,.6,.6],gdp:[.1,.5,.9,1]}},Ma={"Siachen Glacier":"IND","Indian Ocean Ter.":"AUS",XKX:"SRB",CYN:"CYP",SML:"SOM",ESH:"MAR",304:"DNK",234:"DNK","016":"USA",316:"USA",580:"USA",850:"USA","060":"GBR","092":"GBR",136:"GBR",238:"GBR",239:"GBR","086":"GBR",654:"GBR",612:"GBR",660:"GBR",796:"GBR",500:"GBR",831:"GBR",832:"GBR",833:"GBR",184:"NZL",570:"NZL",574:"AUS",334:"AUS",533:"NLD",531:"NLD",534:"NLD",258:"FRA",260:"FRA",540:"FRA",652:"FRA",663:"FRA",666:"FRA",876:"FRA",248:"FIN",446:"CHN"};function Ui(e){let a=0;for(let i=0;i<e.length;i++)a=a*31+e.charCodeAt(i)|0;const n=Math.abs(a)%360,t=26+Math.abs(a>>8)%16,r=44+Math.abs(a>>16)%14;return`hsl(${n} ${t}% ${r}%)`}const bn={"absolute-monarchy":{hos:"Monarch",hog:"Chief Minister"},"constitutional-monarchy":{hos:"Monarch",hog:"Prime Minister"},"parliamentary-republic":{hos:"President",hog:"Prime Minister"},"semi-presidential-republic":{hos:"President",hog:"Prime Minister"},"presidential-republic":{hos:"President",hog:"President"},"one-party-state":{hos:"Party Leader",hog:"Premier"},"military-junta":{hos:"Head of the Junta",hog:"Prime Minister"},"monarchy-absolute-colonial":{hos:"Colonial Governor",hog:"Resident"},"federal-republic":{hos:"President",hog:"President"},theocracy:{hos:"Supreme Leader",hog:"President"},confederation:{hos:"President",hog:"President"},protectorate:{hos:"Resident-General",hog:"Native Ruler"},"mandate-colony":{hos:"High Commissioner",hog:"Administrator"},dependency:{hos:"Governor",hog:"Chief Secretary"},"occupied-territory":{hos:"Occupation Authority",hog:"Military Governor"},"breakaway-state":{hos:"President",hog:"Prime Minister"}},Ae={agriculture:{id:"agriculture",label:"Agriculture & Fishing",blurb:"Crops, livestock and fisheries. Low productivity, high weather risk, politically explosive when it fails.",growth:.011,capitalIntensity:.25,labourIntensity:2.4,cyclicality:.08,commodityExposure:.45,techIntensity:.05,sanctionExposure:.05,margin:.09},mining:{id:"mining",label:"Mining & Extraction",blurb:"Iron, copper, coal, oil and gas extraction. Enormous rents, enormous environmental cost, rents attract war.",growth:.014,capitalIntensity:.7,labourIntensity:.4,cyclicality:.35,commodityExposure:.95,techIntensity:.12,sanctionExposure:.2,margin:.31},manufacturing:{id:"manufacturing",label:"Manufacturing",blurb:"Factories, assembly and heavy industry. The classic industrial ladder: labour arbitrage then automation.",growth:.026,capitalIntensity:.55,labourIntensity:1.1,cyclicality:.62,commodityExposure:.3,techIntensity:.35,sanctionExposure:.35,margin:.12},energy:{id:"energy",label:"Energy & Utilities",blurb:"Power generation, grids, refining. Natural monopoly, regulated returns, huge capex.",growth:.017,capitalIntensity:.85,labourIntensity:.5,cyclicality:.3,commodityExposure:.8,techIntensity:.2,sanctionExposure:.3,margin:.18},utilities:{id:"utilities",label:"Water & Gas Utilities",blurb:"Essential services with regulated tariffs.",growth:.021,capitalIntensity:.6,labourIntensity:.7,cyclicality:.1,commodityExposure:.2,techIntensity:.1,sanctionExposure:.05,margin:.22},construction:{id:"construction",label:"Construction & Real Estate",blurb:"Buildings, infrastructure, housing. Boom-and-bust on a seven to ten year cycle.",growth:.031,capitalIntensity:.5,labourIntensity:1.3,cyclicality:.9,commodityExposure:.25,techIntensity:.08,sanctionExposure:.05,margin:.11},transport:{id:"transport",label:"Transport & Logistics",blurb:"Rail, road, shipping, aviation. Strategic, and chokepoints are how you strangle an economy.",growth:.028,capitalIntensity:.75,labourIntensity:.8,cyclicality:.7,commodityExposure:.35,techIntensity:.15,sanctionExposure:.25,margin:.14},retail:{id:"retail",label:"Retail & Consumer",blurb:"Shops, e-commerce, consumer goods. Where consumer confidence becomes or destroys GDP.",growth:.029,capitalIntensity:.2,labourIntensity:1.9,cyclicality:.55,commodityExposure:.2,techIntensity:.12,sanctionExposure:.05,margin:.1},finance:{id:"finance",label:"Finance & Insurance",blurb:"Banks, insurers, asset managers. Leverage turns this sector into the fastest way to crash an economy.",growth:.033,capitalIntensity:.4,labourIntensity:.9,cyclicality:.85,commodityExposure:.1,techIntensity:.4,sanctionExposure:.4,margin:.26},"real-estate":{id:"real-estate",label:"Real Estate",blurb:"Property markets. Self-reinforcing until it is not.",growth:.03,capitalIntensity:.65,labourIntensity:.6,cyclicality:.88,commodityExposure:.15,techIntensity:.1,sanctionExposure:.05,margin:.19},telecom:{id:"telecom",label:"Telecommunications",blurb:"Networks and carriers. Winner-take-most, and a sovereignty issue.",growth:.038,capitalIntensity:.7,labourIntensity:.5,cyclicality:.25,commodityExposure:.05,techIntensity:.7,sanctionExposure:.35,margin:.24},technology:{id:"technology",label:"Technology & Software",blurb:"Semiconductors, software, platforms. The productivity engine, and the export-control battlefield.",growth:.072,capitalIntensity:.45,labourIntensity:.35,cyclicality:.6,commodityExposure:.1,techIntensity:.95,sanctionExposure:.85,margin:.29},healthcare:{id:"healthcare",label:"Healthcare & Pharma",blurb:"Hospitals, medicine, biotech. Politically defended spending, reliable growth.",growth:.043,capitalIntensity:.5,labourIntensity:1.1,cyclicality:.15,commodityExposure:.15,techIntensity:.65,sanctionExposure:.25,margin:.21},education:{id:"education",label:"Education & Research",blurb:"Schools, universities, public research. The multiplier that shows up thirty years late.",growth:.036,capitalIntensity:.35,labourIntensity:1.4,cyclicality:.08,commodityExposure:.05,techIntensity:.85,sanctionExposure:.05,margin:.15},defence:{id:"defence",label:"Defence Industry",blurb:"Arms, munitions, aerospace. Political economy: a private sector fed entirely by the state.",growth:.024,capitalIntensity:.6,labourIntensity:.7,cyclicality:.15,commodityExposure:.3,techIntensity:.55,sanctionExposure:.1,margin:.16},tourism:{id:"tourism",label:"Tourism & Hospitality",blurb:"Hotels, airlines, leisure. Collapses instantly in a pandemic or a war, rebounds just as fast.",growth:.035,capitalIntensity:.35,labourIntensity:1.7,cyclicality:.75,commodityExposure:.2,techIntensity:.08,sanctionExposure:.3,margin:.14},media:{id:"media",label:"Media & Publishing",blurb:"Broadcast, press, streaming. Soft power, and a lever for whoever owns the narrative.",growth:.03,capitalIntensity:.3,labourIntensity:.9,cyclicality:.45,commodityExposure:.05,techIntensity:.5,sanctionExposure:.2,margin:.18}},Mn={agrarian:{id:"agrarian",label:"Agrarian",mix:{agriculture:.52,mining:.07,manufacturing:.11,construction:.06,transport:.04,retail:.09,education:.03,healthcare:.02,defence:.02,energy:.02,utilities:.02},productivity:.28,rd:.0012,corruption:.42,unionisation:.16,openness:.18,stateOwnership:.16,unemployment:.07},resource:{id:"resource",label:"Resource State",mix:{mining:.46,energy:.14,agriculture:.08,manufacturing:.07,construction:.05,transport:.05,retail:.06,utilities:.03,defence:.03,healthcare:.02,education:.01},productivity:.42,rd:.0018,corruption:.48,unionisation:.2,openness:.32,stateOwnership:.52,unemployment:.09},industrial:{id:"industrial",label:"Industrial",mix:{manufacturing:.31,mining:.09,agriculture:.06,energy:.08,utilities:.05,construction:.09,transport:.1,retail:.09,finance:.06,technology:.04,healthcare:.02,education:.01},productivity:.56,rd:.008,corruption:.3,unionisation:.5,openness:.48,stateOwnership:.24,unemployment:.06},mixed:{id:"mixed",label:"Mixed Economy",mix:{manufacturing:.18,agriculture:.08,mining:.06,energy:.07,utilities:.05,construction:.11,transport:.1,retail:.13,finance:.11,"real-estate":.05,telecom:.02,technology:.02,healthcare:.01,education:.01},productivity:.62,rd:.012,corruption:.24,unionisation:.36,openness:.55,stateOwnership:.2,unemployment:.05},service:{id:"service",label:"Advanced Services",mix:{finance:.19,retail:.13,technology:.13,healthcare:.11,education:.08,"real-estate":.1,tourism:.06,telecom:.05,media:.04,manufacturing:.05,energy:.03,utilities:.03},productivity:.82,rd:.028,corruption:.16,unionisation:.3,openness:.62,stateOwnership:.13,unemployment:.045},postindustrial:{id:"postindustrial",label:"Post-Industrial",mix:{finance:.22,technology:.17,healthcare:.13,"real-estate":.11,education:.09,retail:.09,telecom:.06,media:.05,tourism:.04,manufacturing:.04},productivity:.95,rd:.042,corruption:.13,unionisation:.26,openness:.68,stateOwnership:.11,unemployment:.04},planned:{id:"planned",label:"Centrally Planned",mix:{manufacturing:.4,mining:.13,agriculture:.14,energy:.12,construction:.09,transport:.07,utilities:.03,defence:.02},productivity:.48,rd:.014,corruption:.22,unionisation:.72,openness:.12,stateOwnership:.86,unemployment:.05},command:{id:"command",label:"Command Economy",mix:{manufacturing:.34,mining:.11,agriculture:.2,energy:.1,construction:.1,transport:.06,defence:.06,utilities:.03},productivity:.36,rd:.009,corruption:.55,unionisation:.8,openness:.07,stateOwnership:.94,unemployment:.06},oilstate:{id:"oilstate",label:"Oil State",mix:{mining:.38,energy:.2,construction:.11,transport:.06,utilities:.05,manufacturing:.05,retail:.06,healthcare:.04,education:.03,agriculture:.02},productivity:.5,rd:.004,corruption:.44,unionisation:.26,openness:.34,stateOwnership:.6,unemployment:.06},taxhaven:{id:"taxhaven",label:"Financial Centre",mix:{finance:.34,"real-estate":.16,retail:.09,tourism:.12,technology:.08,telecom:.06,media:.04,healthcare:.03,education:.02,manufacturing:.03,utilities:.03},productivity:.9,rd:.008,corruption:.18,unionisation:.12,openness:.94,stateOwnership:.05,unemployment:.035},autarkic:{id:"autarkic",label:"Autarkic",mix:{agriculture:.34,manufacturing:.24,mining:.1,energy:.1,utilities:.05,construction:.08,transport:.05,defence:.04},productivity:.33,rd:.003,corruption:.46,unionisation:.34,openness:.06,stateOwnership:.78,unemployment:.05},sanctuary:{id:"sanctuary",label:"Tax Haven / Microstate",mix:{finance:.3,tourism:.2,retail:.14,"real-estate":.12,transport:.08,utilities:.05,technology:.05,healthcare:.03,education:.02,media:.01},productivity:.72,rd:.006,corruption:.2,unionisation:.18,openness:.88,stateOwnership:.08,unemployment:.04}},Li={oil:78,gold:2450,wheat:240,copper:9500,"natural-gas":3.4,coffee:4200,"iron-ore":108,coal:132,aluminium:2600,lithium:13500,uranium:92,silver:31},Oi=[{id:"nyse",name:"New York Stock Exchange",country:"USA",currency:"USD"},{id:"nasdaq",name:"NASDAQ",country:"USA",currency:"USD"},{id:"lse",name:"London Stock Exchange",country:"GBR",currency:"GBP"},{id:"euronext",name:"Euronext",country:"FRA",currency:"EUR"},{id:"dax",name:"Deutsche Börse",country:"DEU",currency:"EUR"},{id:"nikkei",name:"Nikkei 225",country:"JPN",currency:"JPY"},{id:"sse",name:"Shanghai Stock Exchange",country:"CHN",currency:"CNY"},{id:"twse",name:"Taiwan Stock Exchange",country:"TWN",currency:"TWD"},{id:"hkg",name:"Hong Kong Stock Exchange",country:"HKG",currency:"HKD"},{id:"krx",name:"Korea Exchange",country:"KOR",currency:"KRW"},{id:"nse",name:"National Stock Exchange of India",country:"IND",currency:"INR"},{id:"b3",name:"B3 / Brasil Bolsa Balcão",country:"BRA",currency:"BRL"},{id:"tsx",name:"Toronto Stock Exchange",country:"CAN",currency:"CAD"},{id:"asx",name:"Australian Securities Exchange",country:"AUS",currency:"AUD"},{id:"jse",name:"Johannesburg Stock Exchange",country:"ZAF",currency:"ZAR"},{id:"bmv",name:"Bolsa Mexicana de Valores",country:"MEX",currency:"MXN"},{id:"sgx",name:"Singapore Exchange",country:"SGP",currency:"SGD"},{id:"tadawul",name:"Tadawul",country:"SAU",currency:"SAR"},{id:"moex",name:"Moscow Exchange",country:"RUS",currency:"RUB"},{id:"idx",name:"Indonesia Stock Exchange",country:"IDN",currency:"IDR"},{id:"set",name:"Stock Exchange of Thailand",country:"THA",currency:"THB"}],xi={T:"technology",F:"finance",E:"energy",M:"manufacturing",R:"retail",H:"healthcare",N:"mining",K:"transport",D:"defence",C:"telecom",A:"media",B:"construction",G:"agriculture",U:"utilities"};function Te(e){return e.trim().split(`
`).filter(a=>a.trim()).map(a=>{const n=a.split("|").map(t=>t.trim());return{name:n[0],country:n[1],sector:xi[n[2]],revenue:Number(n[3])*1e9,employees:Math.round(Number(n[4])*1e3),listed:!!n[5],exchange:n[5]||void 0,stateOwnership:n[6]?Number(n[6]):0,foundedYear:n[7]?Number(n[7]):void 0}})}const Hi=Te(`
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
`),Fi=Te(`
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
`),Ki=Te(`
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
`),$i=Te(`
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
`),Ji=Te(`
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
`),Wi=Te(`
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
`),Vi=Te(`
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
`),Vn=Te(`
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
`),wi={1900:Hi,1914:Fi,1930:Ki,1950:$i,1990:Ji,2010:Wi,2020:Vi,2026:Vn};function ji(e){return wi[e]??Vn}const ee=(e,a,n,t,r,i,s,o,c,l)=>({name:e,startedAt:0,phase:"war",cause:a,belligerents:Object.fromEntries([[n[0],n.slice(1)],[t[0],t.slice(1)]]),fronts:[{name:r,belligerents:[n[0],t[0]],control:s,terrain:i}],exhaustion:{[n[0]]:o,[t[0]]:c},casualties:{},warGoal:l}),Yi={"Russo-Ukrainian War":{axis:[39,45,25,51.5]},"Sudanese Civil War":{axis:[22,13,36,18]},"Myanmar Civil War":{axis:[101,23,95,17]},"Syrian Civil War":{axis:[36,37,40,33]},"Yemeni Civil War":{axis:[43.5,16.5,50,14]},"War in Afghanistan":{axis:[69,30,67,37]},"Libyan Civil War":{axis:[22,30,11,32]},"War in Somalia":{axis:[42,0,47,8]},"Iraq Insurgency":{axis:[41,35,46,31]},"Afghan Civil War":{axis:[71,36,64,32]},"Ethiopian Civil War":{axis:[39,16,39,7]},"Liberian Civil War":{axis:[-8,7.5,-11,6]},"Gulf Crisis":{theatre:"none"},"Second Boer War":{theatre:"CPC",axis:[30,-26,19,-33]},"Philippine-American War":{theatre:"UOT"},"Mexican Revolution":{axis:[-108,30,-96,17]},"Thousand Days' War":{axis:[-72,7,-77,3]},"Central Plains War":{axis:[112,37,118,30]},"Pacification of Libya":{theatre:"ICO",axis:[24,31,12,30]},"First Indochina War":{theatre:"IDC",axis:[105,23,107,11]},"Malayan Emergency":{theatre:"BMA",axis:[102,6,104,1.5]}},Zi={1900:[ee("Second Boer War","The franchise of the uitlanders in the Transvaal and British claims over the goldfields.",["GBR","CPC","CAN","AUC","NZL"],["SAR","OFS"],"Natal and the Veld","plains",-10,15,25,"Annex the Boer republics."),ee("Philippine-American War","The United States refused to recognise Philippine independence after the war with Spain.",["USA","UOT"],["PHL_REB"],"Luzon","forest",35,8,40,"Suppress the First Philippine Republic."),ee("Thousand Days' War","Liberal revolt against the Conservative government of Colombia.",["COL"],["COL_REB"],"Santander","mountain",20,30,40,"Hold the Conservative regime together.")],1914:[ee("Mexican Revolution","Constitutionalists and peasant armies rose after Huerta seized power in 1913.",["MEX"],["MEX_REB"],"Northern Mexico","desert",-45,55,30,"Keep Huerta in power.")],1930:[ee("Central Plains War","Regional warlords revolted against Chiang Kai-shek's disbandment of their armies.",["CHN"],["CHN_REB"],"Henan","plains",10,25,30,"Finish the unification of China under Nanjing."),ee("Pacification of Libya","Senussi resistance led by Omar Mukhtar against Italian rule.",["ITA","ICO"],["LBY_REB"],"Cyrenaica","desert",40,10,45,"End resistance in Cyrenaica.")],1950:[ee("First Indochina War","The Viet Minh are fighting to end French rule over Indochina.",["FRA","IDC"],["DRV"],"Tonkin","forest",-5,30,25,"Hold Indochina for the French Union."),ee("Malayan Emergency","Communist insurgency against British rule in Malaya.",["GBR","BMA"],["MLY_REB"],"Malayan Jungle","forest",15,6,30,"Destroy the Malayan National Liberation Army.")],1990:[ee("Gulf Crisis","Iraq invaded and annexed Kuwait on 2 August. A US-led coalition is massing in Saudi Arabia.",["IRQ"],["USA","GBR","FRA","SAU","EGY"],"Kuwait","desert",80,40,3,"Force Iraq out of Kuwait, or hold what has been taken."),ee("Afghan Civil War","The mujahideen continue to fight the Soviet-backed government after the Soviet withdrawal.",["AFG"],["AFG_REB"],"Afghan Highlands","mountain",10,60,50,"Survive without Soviet troops."),ee("Liberian Civil War","Charles Taylor's rebels and factions are fighting for Monrovia.",["LBR"],["LBR_REB"],"Monrovia","urban",-30,60,40,"Control Monrovia."),ee("Ethiopian Civil War","Eritrean and Tigrayan fronts are closing in on the Derg.",["ETH"],["ETH_REB"],"Tigray and Eritrea","mountain",-40,70,40,"Preserve the Derg regime.")],2010:[ee("War in Afghanistan","NATO forces are fighting the Taliban insurgency, with a troop surge under way.",["USA","GBR","CAN","DEU","AFG"],["AFG_REB"],"Helmand and Kandahar","mountain",20,28,40,"Stabilise the Afghan government."),ee("Iraq Insurgency","US forces are drawing down while sectarian insurgents remain active.",["USA","IRQ"],["IRQ_REB"],"Baghdad","urban",50,45,55,"Hand security to Iraqi forces."),ee("War in Somalia","Al-Shabaab controls much of the south against the Transitional Federal Government.",["SOM","ETH","UGA"],["SOM_REB"],"Mogadishu","urban",-20,55,30,"Hold Mogadishu.")],2020:[ee("Syrian Civil War","Assad's government, backed by Russia and Iran, is fighting the last rebel holdouts in Idlib.",["SYR","RUS","IRN"],["SYR_REB","TUR"],"Idlib","urban",65,70,60,"Reconquer Syria."),ee("Yemeni Civil War","The Saudi-led coalition is fighting the Houthis, who hold Sanaa.",["SAU","YEM","ARE"],["YEM_REB"],"Marib","desert",30,55,45,"Restore the recognised government."),ee("War in Afghanistan","Peace talks with the Taliban have begun under the February Doha agreement.",["USA","AFG"],["AFG_REB"],"Afghan Provinces","mountain",-10,65,45,"Withdraw without collapse."),ee("Libyan Civil War","Haftar's forces are besieging Tripoli.",["LBY","TUR"],["LBY_REB"],"Tripoli","urban",5,45,40,"Hold Tripoli.")],2026:[ee("Russo-Ukrainian War","Russia launched a full-scale invasion of Ukraine in February 2022.",["RUS"],["UKR"],"Donbas and Zaporizhzhia","plains",19.5,58,62,"Force a settlement on the current line, or restore Ukraine's borders."),ee("Sudanese Civil War","The Sudanese Armed Forces and Rapid Support Forces have fought since April 2023.",["SDN"],["SDN_REB"],"Darfur and Kordofan","desert",10,70,65,"Defeat the Rapid Support Forces."),ee("Myanmar Civil War","Resistance forces and ethnic armies are fighting the junta.",["MMR"],["MMR_REB"],"Shan and Sagaing","forest",-15,60,50,"Keep the junta in power.")]},H=(e,a,n,t)=>({name:e,kind:a,parties:n.split(" "),terms:[t]}),zi={1900:[H("Triple Alliance","defensive-pact","DEU AUT ITA","Mutual defence against France and Russia."),H("Franco-Russian Alliance","alliance","FRA RUS","Mutual defence against the Triple Alliance.")],1914:[H("Triple Alliance","defensive-pact","DEU AUT ITA","Mutual defence; renewed in 1912."),H("Triple Entente","entente","GBR FRA RUS","Understanding between Britain, France and Russia."),H("Anglo-Japanese Alliance","alliance","GBR JPN","Mutual aid in East Asia."),H("Treaty of London","access","GBR FRA DEU BEL","Guarantee of Belgian neutrality."),H("Serbian-Russian Understanding","entente","SRB RUS","Russian patronage of Serbia.")],1930:[H("Locarno Treaties","non-aggression","DEU FRA BEL GBR ITA","Guarantee of the Rhine frontier."),H("Little Entente","defensive-pact","CSK ROU YUG","Mutual defence against Hungarian revisionism."),H("Franco-Polish Alliance","alliance","FRA POL","Mutual defence.")],1950:[H("North Atlantic Treaty","defensive-pact","USA CAN GBR FRA ITA BEL NLD LUX DNK NOR ISL PRT","An attack on one is an attack on all."),H("Sino-Soviet Friendship Negotiations","alliance","USS CHN","Mao is in Moscow negotiating the treaty of alliance."),H("Comecon","customs-union","USS POL CSK HUN ROU BGR ALB","Socialist economic coordination.")],1990:[H("North Atlantic Treaty","defensive-pact","USA CAN GBR FRA DEU ITA BEL NLD LUX DNK NOR ISL PRT ESP GRC TUR","An attack on one is an attack on all."),H("Warsaw Pact","defensive-pact","USS POL CSK HUN ROU BGR","Fading fast; it dissolves next year."),H("European Communities","customs-union","BEL DNK FRA DEU GRC IRL ITA LUX NLD PRT ESP GBR","Single market programme."),H("US-Japan Security Treaty","alliance","USA JPN","Mutual cooperation and security.")],2010:[H("North Atlantic Treaty","defensive-pact","USA CAN GBR FRA DEU ITA BEL NLD LUX DNK NOR ISL PRT ESP GRC TUR POL CZE HUN BGR EST LVA LTU ROU SVK SVN ALB HRV","Collective defence."),H("European Union","customs-union","BEL DNK FRA DEU GRC IRL ITA LUX NLD PRT ESP GBR AUT FIN SWE CYP CZE EST HUN LVA LTU MLT POL SVK SVN BGR ROU","Single market."),H("NAFTA","trade","USA CAN MEX","North American free trade."),H("US-Japan Security Treaty","alliance","USA JPN","Mutual cooperation and security."),H("US-ROK Mutual Defense Treaty","alliance","USA KOR","Mutual defence.")],2020:[H("North Atlantic Treaty","defensive-pact","USA CAN GBR FRA DEU ITA BEL NLD LUX DNK NOR ISL PRT ESP GRC TUR POL CZE HUN BGR EST LVA LTU ROU SVK SVN ALB HRV MNE","Collective defence."),H("European Union","customs-union","BEL DNK FRA DEU GRC IRL ITA LUX NLD PRT ESP AUT FIN SWE CYP CZE EST HUN LVA LTU MLT POL SVK SVN BGR ROU HRV","Single market."),H("USMCA","trade","USA CAN MEX","North American trade; enters into force in July."),H("US-Japan Security Treaty","alliance","USA JPN","Mutual cooperation and security."),H("US-ROK Mutual Defense Treaty","alliance","USA KOR","Mutual defence.")],2026:[H("North Atlantic Treaty","defensive-pact","USA CAN GBR FRA DEU ITA BEL NLD LUX DNK NOR ISL PRT ESP GRC TUR POL CZE HUN BGR EST LVA LTU ROU SVK SVN ALB HRV MNE MKD FIN SWE","Collective defence."),H("European Union","customs-union","BEL DNK FRA DEU GRC IRL ITA LUX NLD PRT ESP AUT FIN SWE CYP CZE EST HUN LVA LTU MLT POL SVK SVN BGR ROU HRV","Single market."),H("USMCA","trade","USA CAN MEX","North American trade."),H("CSTO","defensive-pact","RUS BLR KAZ KGZ TJK ARM","Collective security."),H("US-Japan Security Treaty","alliance","USA JPN","Mutual cooperation and security."),H("US-ROK Mutual Defense Treaty","alliance","USA KOR","Mutual defence."),H("AUKUS","alliance","USA GBR AUS","Trilateral security pact."),H("Russia-North Korea Strategic Partnership","alliance","RUS PRK","Mutual assistance treaty signed in 2024.")]},T=(e,a,n,t,r)=>({id:e,name:a,owner:n,hosts:t,ring:r}),wn=[[13.8,55.1],[19,55.1],[22.9,55.3],[23,54.2],[21.9,53.5],[20,53.15],[19.2,52.95],[18.7,52.55],[18,52.15],[18.1,51.2],[19.1,50.35],[18.3,49.9],[14.5,50.7]],jn=[[19.3,54.3],[22.9,54.3],[22.9,55.5],[19.3,55.5]],Yn=[[20.8,55],[22.4,55],[22.4,56],[20.8,56]],Zn=[[19.1,49.1],[19.1,50.05],[21,50.4],[22.7,50.45],[24.1,50.8],[26.1,50],[26.4,48.6],[24.9,48.2],[22.8,49],[20.5,49.35]],Ka=[[24.9,48.25],[26.7,48.3],[26.5,47.5],[25,47.4]],$a=[[22.1,49.1],[24.9,48.25],[24.2,47.8],[22,48]],zn=[[22.8,48],[24.9,47.8],[25.3,47.2],[26.1,46.6],[26.4,45.7],[25.5,45.35],[24,45.35],[22.7,45],[22.4,44.55],[21.2,44.6],[20,45.9],[21,47.3]],qn=[[18.7,46.3],[20.9,46.3],[21.6,45.2],[20.4,44.85],[19,44.9]],Xn=[[10.3,47.2],[12.6,47.2],[12,45.9],[10.5,45.65]],Ja=[[13.2,46.5],[14.1,46.4],[14,45.3],[13.2,45.6]],_n=[[5.85,49.6],[8.3,49.1],[7.65,47.5],[6.8,47.5],[6.95,48.35],[5.85,48.85]],Qn=[[8.3,55.55],[9.8,55.55],[10.1,54.8],[8.3,54.8]],et=[[34.4,29.6],[39,29.2],[40.2,25],[41.6,20.5],[42.6,17],[39,17.5],[34.8,26]],qi=[[46.3,29.2],[50.5,28.5],[51.5,24.3],[47.8,22.8],[46,25.5]],ya=[[43.2,13.2],[45.5,13.7],[46.6,15],[48.9,17],[52,19.1],[53.4,16.4],[49,12.8],[44,12]],Xi=[[25.6,-22],[31.5,-22.2],[32.2,-25.5],[31,-27.4],[29,-27.4],[26,-27.3],[24.9,-25.6]],_i=[[24.2,-28.4],[26,-27.3],[29,-27.4],[29.5,-29],[27.1,-30.7],[24.5,-30.1]],at=[[141,-1.5],[156,-1.5],[156,-7],[148.5,-8.1],[141,-5.7]],Wa=[[-6.2,36.1],[-1.9,35.5],[-2.5,34.7],[-6.2,34.85]],nt=[[140.5,45.5],[144.8,45.5],[144.8,50],[140.5,50]],Va=[[78.4,34.2],[85,36],[92,36.1],[98.2,33.2],[99.2,29],[97.4,27.7],[89,27.2],[81,30]],Qi=[[19.3,39.65],[21.4,39.85],[22.8,39.95],[24.2,40.1],[27.2,41.5],[26.1,42],[20.5,41.6]],eo=[[19.2,54.45],[19.8,55.5],[22.9,55.5],[22.9,54.35],[22,53.5],[20,53.15],[19.3,53.45]],ao=[[13.8,54.5],[16.7,54.9],[17,53.9],[16,53],[16.9,51.9],[18,51.2],[18.6,50.2],[17,50.2],[14.6,50.9],[14.4,52.5]],no=[[23.2,54.3],[25.2,55.2],[26.9,55.4],[27.8,53.9],[27.4,52.6],[27.4,51.5],[26.8,50.4],[26.3,48.5],[24.9,48.2],[22.6,49.1],[23.6,51.5],[23.6,52.6]],to=[[27.7,60.4],[29.7,60.05],[31,60.9],[31.7,62.9],[30,62.9]],io=[[28.4,70],[31.6,70],[31,69],[28.4,68.8]],oo=[[28.2,46.6],[30.5,46.1],[29.8,45.1],[28.2,45.3]],tt=[[10.85,54.05],[11,53.65],[10.6,53.35],[11.3,53.05],[10.75,52.8],[10.95,52.1],[10.55,51.85],[10.2,51.4],[10,50.9],[10.1,50.6],[11,50.35],[12.1,50.3],[12.4,50.15],[15.2,50.8],[14.9,52],[14.3,53],[14.4,54.1],[13.6,54.9],[12,54.6]],ro=[[101.9,23.6],[108.4,21.9],[107.6,17.1],[106.4,17.1],[104.5,18.8]],so=[[130.8,0],[141,-2.4],[141,-9.3],[137.6,-9],[132.8,-4.5]],co=[T("prussian-partition","Prussian Partition","DEU",["POL"],wn),T("east-prussia-k","East Prussia","DEU",["RUS"],jn),T("memelland","Memelland","DEU",["LTU"],Yn),T("galicia","Galicia","AUT",["POL","UKR"],Zn),T("bukovina","Bukovina","AUT",["UKR","ROU"],Ka),T("carpathian-ruthenia","Carpathian Ruthenia","AUT",["UKR"],$a),T("transylvania","Transylvania","AUT",["ROU"],zn),T("vojvodina","Vojvodina","AUT",["SRB"],qn),T("trentino","Trentino","AUT",["ITA"],Xn),T("trieste","Austrian Littoral","AUT",["ITA","SVN"],Ja),T("alsace-lorraine","Alsace-Lorraine","DEU",["FRA"],_n),T("north-schleswig","North Schleswig","DEU",["DNK"],Qn),T("ottoman-rumelia","Ottoman Rumelia","OTT",["GRC"],Qi),T("hejaz","Hejaz","OTT",["SAU"],et),T("al-hasa","Al-Hasa","OTT",["SAU"],qi),T("aden","Aden Protectorate","ADN",["YEM"],ya),T("transvaal","South African Republic","SAR",["ZAF"],Xi),T("orange-free-state","Orange Free State","OFS",["ZAF"],_i),T("german-new-guinea","German New Guinea","GNG",["PNG"],at)],lo=[T("prussian-partition","Prussian Partition","DEU",["POL"],wn),T("east-prussia-k","East Prussia","DEU",["RUS"],jn),T("memelland","Memelland","DEU",["LTU"],Yn),T("galicia","Galicia","AUT",["POL","UKR"],Zn),T("bukovina","Bukovina","AUT",["UKR","ROU"],Ka),T("carpathian-ruthenia","Carpathian Ruthenia","AUT",["UKR"],$a),T("transylvania","Transylvania","AUT",["ROU"],zn),T("vojvodina","Vojvodina","AUT",["SRB"],qn),T("trentino","Trentino","AUT",["ITA"],Xn),T("trieste","Austrian Littoral","AUT",["ITA","SVN"],Ja),T("alsace-lorraine","Alsace-Lorraine","DEU",["FRA"],_n),T("north-schleswig","North Schleswig","DEU",["DNK"],Qn),T("hejaz","Hejaz","OTT",["SAU"],et),T("aden","Aden Protectorate","ADN",["YEM"],ya),T("german-new-guinea","German New Guinea","GNG",["PNG"],at),T("spanish-morocco","Spanish Morocco","SMA",["MAR"],Wa),T("karafuto","Karafuto","JPN",["RUS"],nt),T("tibet","Tibet","TIB",["CHN"],Va)],uo=[T("east-prussia","East Prussia","DEU",["POL","RUS"],eo),T("silesia-pomerania","Silesia and Pomerania","DEU",["POL"],ao),T("kresy","Eastern Poland","POL",["BLR","UKR","LTU"],no),T("carpathian-ruthenia","Carpathian Ruthenia","CSK",["UKR"],$a),T("north-bukovina","Northern Bukovina","ROU",["UKR"],Ka),T("budjak","Budjak","ROU",["UKR"],oo),T("istria","Julian March","ITA",["SVN","HRV"],Ja),T("karelia","Finnish Karelia","FIN",["RUS"],to),T("petsamo","Petsamo","FIN",["RUS"],io),T("aden","Aden Protectorate","ADN",["YEM"],ya),T("spanish-morocco","Spanish Morocco","SMA",["MAR"],Wa),T("karafuto","Karafuto","JPN",["RUS"],nt),T("tibet","Tibet","TIB",["CHN"],Va)],mo=[T("east-germany","German Democratic Republic","DDR",["DEU"],tt),T("north-vietnam","Democratic Republic of Vietnam","DRV",["VNM"],ro),T("dutch-new-guinea","Netherlands New Guinea","DNG",["IDN"],so),T("aden","Aden Protectorate","ADN",["YEM"],ya),T("spanish-morocco","Spanish Morocco","SMA",["MAR"],Wa),T("tibet","Tibet","TIB",["CHN"],Va)],ho=[T("east-germany","German Democratic Republic","DDR",["DEU"],tt)],po={AM:"absolute-monarchy",CM:"constitutional-monarchy",PR:"parliamentary-republic",SP:"semi-presidential-republic",PRES:"presidential-republic",OP:"one-party-state",MJ:"military-junta",FR:"federal-republic",TH:"theocracy",CONF:"confederation",PROT:"protectorate",MAND:"mandate-colony",DEP:"dependency",OCC:"occupied-territory",BRK:"breakaway-state"};function vn(e){const a=e.indexOf(":");return a<0?{name:e}:{title:e.slice(0,a),name:e.slice(a+1)}}function ta(e){return e.trim().split(`
`).filter(a=>a.trim()&&!a.startsWith("#")).map(a=>{const n=a.split("|").map(o=>o.trim()),t=vn(n[7]??""),r=n[8]&&n[8]!=="-"?vn(n[8]):void 0,[i,s]=(n[10]??"").split(":");return{id:n[0],name:n[1],government:po[n[2]]??"dependency",ideology:Number(n[3]||0),bloc:n[4]||"none",popM:n[5]?Number(n[5]):void 0,gdpB:n[6]?Number(n[6]):void 0,hosTitle:t.title,hos:t.name,hogTitle:r==null?void 0:r.title,hog:r==null?void 0:r.name,lands:n[9]?n[9]==="-"?[]:n[9].split(/\s+/):[n[0]],overlord:i||void 0,status:s||void 0,rulingParty:n[11]||void 0}})}const yo={year:1900,regions:co,polities:ta(`
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
`)},go={year:1914,regions:lo,polities:ta(`
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
PAN|Panama|PRES|10|none|0.4|0.04|President:Belisario Porras|-|||Liberal Party
`)},fo={year:1930,regions:uo,polities:ta(`
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
PAN|Panama|PRES|10|none|0.5|0.09|President:Florencio H. Arosemena|-|||Liberal Party
`)},Ao={year:1950,regions:mo,polities:ta(`
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
`)},So={AM:"absolute-monarchy",CM:"constitutional-monarchy",PR:"parliamentary-republic",SP:"semi-presidential-republic",PRES:"presidential-republic",OP:"one-party-state",MJ:"military-junta",FR:"federal-republic",TH:"theocracy"},it="BEL DNK FRA DEU GRC IRL ITA LUX NLD PRT ESP GBR".split(" "),ot=[...it,..."AUT FIN SWE CYP CZE EST HUN LVA LTU MLT POL SVK SVN BGR ROU".split(" ")],Po=[...ot.filter(e=>e!=="GBR"),"HRV"],rt="USA CAN GBR FRA DEU ITA BEL NLD LUX DNK NOR ISL PRT ESP GRC TUR".split(" "),st=[...rt,..."POL CZE HUN BGR EST LVA LTU ROU SVK SVN ALB HRV".split(" ")],Ro=[...st,..."MNE MKD FIN SWE".split(" ")],bo="BRA RUS IND CHN".split(" "),Mo="BRA RUS IND CHN ZAF EGY ETH IRN ARE IDN".split(" "),vo="USS POL CSK HUN ROU BGR".split(" "),Cn="SAU ARE QAT KWT BHR OMN".split(" "),Co="IDN MYS PHL SGP THA BRN VNM LAO MMR KHM".split(" "),No="ARG BRA PRY URY".split(" ");function Eo(e,a){var i;if(e===1990)return vo.includes(a)?"warsaw-pact":it.includes(a)?"european-union":rt.includes(a)?"nato":Cn.includes(a)?"gulf-cooperation-council":["AUS","NZL","JPN","KOR","ISR","THA","PHL"].includes(a)?"allies":"non-aligned";const n=e>=2026?Po:ot,t=e>=2026?Ro:st,r=e>=2026?Mo:bo;return n.includes(a)?"european-union":r.includes(a)?"brics":t.includes(a)?"nato":Cn.includes(a)?"gulf-cooperation-council":Co.includes(a)?"asean":No.includes(a)?"mercosur":["CAN","MEX"].includes(a)?"usmca":["BLR","KAZ","KGZ","TJK","ARM"].includes(a)?"csto":((i=Se[a])==null?void 0:i.bloc)??"non-aligned"}const Go={DEU:"Chancellor",AUT:"Chancellor",IRL:"Taoiseach",SAU:"Crown Prince and Prime Minister",CHN:"Premier",USS:"Premier",PRK:"Premier",VNM:"Prime Minister",BGD:"Chief Adviser"},Bo={DEU:"Federal President",AUT:"Federal President",CHE:"President of the Confederation",CHN:"President",VNM:"General Secretary",LAO:"President",CUB:"President",SMR:"Captains Regent",AND:"Co-Princes",BIH:"Chair of the Presidency",YEM:"Chairman of the Presidential Council",PSE:"President"},Do=["Governor-General","Governor General","King","Queen","Emperor","Sultan","Emir","Prince","Grand Duke","Pope"];function ko(e,a){for(const n of Do)if(a.startsWith(`${n} `))return{title:n==="Governor General"?"Governor-General":n,name:a.slice(n.length+1)};return{title:Bo[e],name:a}}function ga(e,a,n=[]){return[...a.trim().split(`
`).filter(r=>r.trim()).map(r=>{const i=r.split("|").map(l=>l.trim()),s=Se[i[0]],o=i[4]?So[i[4]]:(s==null?void 0:s.government)??"presidential-republic",c=ko(i[0],i[1]??"");return{id:i[0],name:(s==null?void 0:s.name)??i[0],government:o,ideology:i[5]?Number(i[5]):(s==null?void 0:s.ideology)??0,bloc:Eo(e,i[0]),hos:c.name,hosTitle:c.title??(o==="one-party-state"?"General Secretary":void 0),hog:i[2]||void 0,hogTitle:Go[i[0]],lands:[i[0]],rulingParty:i[3]||void 0}}),...n]}const ct={year:1990,regions:ho,polities:ga(1990,`
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
`,[...ta(`
USS|Soviet Union|PRES|-50|warsaw-pact|||President:Mikhail Gorbachev|Premier:Nikolai Ryzhkov|RUS UKR BLR MDA EST LVA LTU KAZ UZB TKM KGZ TJK ARM AZE GEO|||Communist Party of the Soviet Union
YUG|Yugoslavia|OP|-35|non-aligned|||President of the Presidency:Borisav Jovic|Prime Minister:Ante Markovic|SRB HRV SVN BIH MNE MKD XKX||League of Communists of Yugoslavia
CSK|Czechoslovakia|PR|5|warsaw-pact|||President:Vaclav Havel|Prime Minister:Marian Calfa|CZE SVK||Civic Forum
DDR|East Germany|PR|-5|warsaw-pact|16.1|152|President of the Volkskammer:Sabine Bergmann-Pohl|Prime Minister:Lothar de Maiziere|-||Christian Democratic Union
GBH|British Hong Kong|DEP|5|allies|5.7|77|Governor:David Wilson|-|HKG|GBR:colony
PSO|Occupied Palestinian Territories|OCC|0|none|2|2|Occupying Power:Yitzhak Shamir|-|PSE|ISR:occupation
`)]).filter(e=>e.id!=="HKG")};for(const e of ct.polities)e.id==="KWT"&&(e.overlord="IRQ",e.status="occupation");const To={year:2010,regions:[],polities:ga(2010,`
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
`).filter(e=>e.id!=="HKG"&&e.id!=="PRI")},Io={year:2020,regions:[],polities:ga(2020,`
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
`)},Uo={year:2026,regions:[],polities:ga(2026,`
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
`)};function Lo(e){return e.split("|").map(a=>{const n=a.startsWith("*"),[t,r,i,s,o]=(n?a.slice(1):a).split(":");return{name:t,abbr:r,ideology:Number(i),colour:s,seats:Number(o),ruling:n}})}function v(e,a,n,t,r){const i=(r==null?void 0:r.split(";"))??[],s=Lo(t);return{chamber:e,termYears:a,nextElectionYear:n,seats:s.reduce((o,c)=>o+c.seats,0),parties:s,cabinet:r?{economy:i[0]||void 0,foreign:i[1]||void 0,defence:i[2]||void 0,centralBank:i[3]||void 0}:void 0}}const E="#c0392b",D="#2563eb",Ee="#1e3a8a",W="#16a34a",j="#eab308",ne="#ea580c",ke="#7c3aed",I="#334155",ge="#7f1d1d",pe="#0d9488",lt={1900:{GBR:v("House of Commons",7,1900,`*Conservative and Liberal Unionists:CON:25:${D}:402|Liberal Party:LIB:-10:${j}:186|Irish Parliamentary Party:IPP:-5:${W}:82`,"Michael Hicks Beach;Marquess of Salisbury;Marquess of Lansdowne;Hugh Colin Smith"),FRA:v("Chamber of Deputies",4,1902,`*Republican Defence Bloc:BLOC:-15:${ke}:350|Progressive Republicans:PROG:15:${D}:150|Conservative Right:DROITE:45:${I}:81`,"Joseph Caillaux;Theophile Delcasse;Gaston de Galliffet;Georges Pallain"),DEU:v("Reichstag",5,1903,`*Centre Party:Z:20:${I}:102|*German Conservative Party:DKP:45:${Ee}:56|*National Liberal Party:NLP:15:${j}:46|Social Democratic Party:SPD:-45:${E}:56|Free-minded Parties:FVP:-5:${ne}:37|Regional and Minor Parties:OTH:10:${pe}:100`,"Johannes von Miquel;Bernhard von Bulow;Heinrich von Gossler;Richard Koch"),USA:v("House of Representatives",2,1900,`*Republican Party:GOP:15:${E}:185|Democratic Party:DEM:-5:${D}:163|Populists and Silver Parties:POP:-25:${W}:9`,"Lyman J. Gage;John Hay;Elihu Root"),JPN:v("House of Representatives",4,1902,`Kenseito (Constitutional Party):KSTO:5:${D}:188|*Imperial Party and Independents:TEIK:30:${E}:112`,"Matsukata Masayoshi;Aoki Shuzo;Katsura Taro;Yamamoto Tatsuo"),ITA:v("Chamber of Deputies",5,1900,`*Historical Right:DS:20:${D}:319|Historical Left:SS:-5:${E}:109|Exedra (Radicals, Republicans, Socialists):EX:-35:${ne}:80`,"Paolo Carcano;Emilio Visconti Venosta;Giuseppe Mirri"),AUT:v("Imperial Council",6,1901,`*Polish and Conservative Clubs:KONS:25:${I}:170|German Parties:DEU:15:${D}:120|Czech Parties:CZE:0:${E}:70|Social Democrats:SDAP:-40:${ge}:15`),RUS:{parties:[],cabinet:{economy:"Sergei Witte",foreign:"Mikhail Muravyov",defence:"Aleksey Kuropatkin",centralBank:"Eduard Pleske"}}},1914:{GBR:v("House of Commons",5,1915,`*Liberal Party:LIB:-15:${j}:272|Conservative and Unionist Party:CON:25:${D}:271|Irish Parliamentary Party:IPP:-5:${W}:84|Labour Party:LAB:-35:${E}:42`,"David Lloyd George;Edward Grey;H. H. Asquith;Walter Cunliffe"),FRA:v("Chamber of Deputies",4,1918,`*Radical Party and Allies:RAD:-15:${ke}:260|French Section of the Workers' International:SFIO:-45:${E}:103|Democratic Republicans:ARD:10:${D}:100|Conservatives:FED:40:${I}:139`,"Joseph Noulens;Rene Viviani;Adolphe Messimy;Georges Pallain"),DEU:v("Reichstag",5,1917,`Social Democratic Party:SPD:-40:${E}:110|*Centre Party:Z:20:${I}:91|*National Liberal Party:NLP:15:${j}:45|Progressive People's Party:FVP:-5:${ne}:42|*German Conservative Party:DKP:45:${Ee}:43|Regional and Minor Parties:OTH:10:${pe}:66`,"Clemens von Delbruck;Gottlieb von Jagow;Erich von Falkenhayn;Rudolf Havenstein"),USA:v("House of Representatives",2,1914,`*Democratic Party:DEM:-15:${D}:291|Republican Party:GOP:15:${E}:134|Progressive Party:PROG:-5:${W}:10`,"William Gibbs McAdoo;William Jennings Bryan;Lindley Garrison;Charles Hamlin"),RUS:v("State Duma",5,1917,`*Octobrists and Rightists:OCT:40:${Ee}:220|Constitutional Democrats:KD:-5:${W}:107|Progressists:PROG:5:${j}:48|Trudoviks and Social Democrats:TRUD:-50:${E}:24|National Groups:NAT:10:${pe}:43`,"Pyotr Bark;Sergey Sazonov;Vladimir Sukhomlinov;Ivan Shipov"),AUT:{parties:[],cabinet:{economy:"Leon Bilinski",foreign:"Leopold Berchtold",defence:"Alexander von Krobatin",centralBank:"Alexander Popovics"}},ITA:v("Chamber of Deputies",5,1919,`*Liberals and Radicals:LIB:5:${D}:340|Italian Socialist Party:PSI:-45:${E}:52|Radical Party:RAD:-15:${ne}:62|Catholics and Conservatives:CAT:25:${I}:54`,"Luigi Rava;Antonino di San Giuliano;Domenico Grandi;Bonaldo Stringher"),JPN:v("House of Representatives",4,1915,`Rikken Seiyukai:SY:15:${E}:188|*Rikken Doshikai:DS:5:${D}:93|Others:OTH:15:${I}:100`,"Wakatsuki Reijiro;Kato Takaaki;Oka Ichinosuke"),SRB:{parties:[],cabinet:{foreign:"Nikola Pasic",defence:"Dusan Stefanovic"}}},1930:{GBR:v("House of Commons",5,1934,`*Labour Party:LAB:-30:${E}:287|Conservative Party:CON:25:${D}:260|Liberal Party:LIB:0:${j}:59`,"Philip Snowden;Arthur Henderson;Tom Shaw;Montagu Norman"),FRA:v("Chamber of Deputies",4,1932,`*Democratic Republican Alliance:ARD:15:${D}:180|Republican Federation:FR:35:${Ee}:102|Radical Party:RAD:-10:${ke}:125|French Section of the Workers' International:SFIO:-40:${E}:100|Communist Party:PCF:-85:${ge}:14`,"Paul Reynaud;Aristide Briand;Andre Maginot;Emile Moreau"),DEU:v("Reichstag",4,1932,`*Social Democratic Party:SPD:-30:${E}:153|German National People's Party:DNVP:50:${Ee}:73|Centre Party:Z:10:${I}:61|Communist Party:KPD:-85:${ge}:54|German People's Party:DVP:20:${j}:45|German Democratic Party:DDP:-5:${ne}:25|Bavarian People's Party:BVP:25:${pe}:16|National Socialist Party:NSDAP:90:#52525b:12`,"Rudolf Hilferding;Julius Curtius;Wilhelm Groener;Hjalmar Schacht"),USA:v("House of Representatives",2,1930,`*Republican Party:GOP:15:${E}:270|Democratic Party:DEM:0:${D}:164|Farmer-Labor Party:FLP:-30:${W}:1`,"Andrew Mellon;Henry L. Stimson;Patrick J. Hurley;Roy A. Young"),USS:v("Supreme Soviet",4,1934,`*All-Union Communist Party:VKP:-85:${E}:1000`,"Grigory Sokolnikov;Maxim Litvinov;Kliment Voroshilov;Georgy Pyatakov"),ITA:{parties:[{name:"National Fascist Party",abbr:"PNF",ideology:80,colour:"#111827",seats:400,ruling:!0}],cabinet:{economy:"Antonio Mosconi",foreign:"Dino Grandi",defence:"Pietro Gazzera",centralBank:"Bonaldo Stringher"}},JPN:v("House of Representatives",4,1932,`*Rikken Minseito:MS:5:${D}:273|Rikken Seiyukai:SY:15:${E}:174|Proletarian Parties and Others:OTH:-25:${W}:19`,"Inoue Junnosuke;Shidehara Kijuro;Ugaki Kazushige;Hijikata Hisakira"),ESP:{parties:[],cabinet:{economy:"Manuel Arguelles;",foreign:"Duke of Alba",defence:"Damaso Berenguer"}},CHN:{parties:[{name:"Kuomintang",abbr:"KMT",ideology:25,colour:D,seats:80,ruling:!0},{name:"Communist Party of China",abbr:"CPC",ideology:-85,colour:E,seats:20,ruling:!1}],cabinet:{economy:"T. V. Soong",foreign:"Wang Zhengting",defence:"He Yingqin"}}},1950:{USA:v("House of Representatives",2,1950,`*Democratic Party:DEM:-10:${D}:263|Republican Party:GOP:15:${E}:171|American Labor Party:ALP:-50:${W}:1`,"John W. Snyder;Dean Acheson;Louis A. Johnson;Thomas B. McCabe"),GBR:v("House of Commons",5,1950,`*Labour Party:LAB:-30:${E}:393|Conservative Party:CON:20:${D}:197|Liberal Party:LIB:0:${j}:12|Others:OTH:0:${I}:38`,"Stafford Cripps;Ernest Bevin;Emanuel Shinwell;Lord Catto"),FRA:v("National Assembly",5,1951,`French Communist Party:PCF:-80:${ge}:182|*Popular Republican Movement:MRP:5:${D}:158|*French Section of the Workers' International:SFIO:-30:${E}:102|*Radical Party:RAD:0:${ke}:70|Independents and Peasants:CNI:30:${I}:106`,"Maurice Petsche;Robert Schuman;Rene Pleven;Wilfrid Baumgartner"),DEU:v("Bundestag",4,1953,`*Christian Democratic Union/CSU:CDU:15:${I}:139|Social Democratic Party:SPD:-25:${E}:131|*Free Democratic Party:FDP:15:${j}:52|Others:OTH:15:${pe}:80`,"Fritz Schaffer;Konrad Adenauer;;Wilhelm Vocke"),ITA:v("Chamber of Deputies",5,1953,`*Christian Democracy:DC:10:${D}:305|Popular Democratic Front:FDP:-60:${E}:183|Socialist Unity:US:-20:${ne}:33|Others:OTH:15:${I}:53`,"Giuseppe Pella;Carlo Sforza;Randolfo Pacciardi;Donato Menichella"),USS:v("Supreme Soviet",4,1950,`*Communist Party of the Soviet Union:CPSU:-85:${E}:1316`,"Arseny Zverev;Andrey Vyshinsky;Aleksandr Vasilevsky;Vasily Popov"),CHN:v("Chinese People's Political Consultative Conference",5,1954,`*Communist Party of China:CPC:-80:${E}:662`,"Bo Yibo;Zhou Enlai;Zhu De;Nan Hanchen"),JPN:v("House of Representatives",4,1953,`*Democratic Liberal Party:DLP:20:${D}:264|Democratic Party:DP:10:${j}:69|Socialist Party:JSP:-35:${E}:48|Communist Party:JCP:-80:${ge}:35|Others:OTH:5:${I}:50`,"Hayato Ikeda;Shigeru Yoshida;;Hisato Ichimada"),IND:{chamber:"Constituent Assembly",seats:313,termYears:5,nextElectionYear:1951,parties:[{name:"Indian National Congress",abbr:"INC",ideology:-20,colour:D,seats:290,ruling:!0},{name:"Others",abbr:"OTH",ideology:10,colour:I,seats:23,ruling:!1}],cabinet:{economy:"John Mathai",foreign:"Jawaharlal Nehru",defence:"Baldev Singh",centralBank:"C. D. Deshmukh"}},ARG:{parties:[{name:"Peronist Party",abbr:"PP",ideology:15,colour:D,seats:112,ruling:!0},{name:"Radical Civic Union",abbr:"UCR",ideology:0,colour:E,seats:46,ruling:!1}]}},1990:{USA:v("House of Representatives",2,1990,`*Republican Party:GOP:25:${E}:175|Democratic Party:DEM:-10:${D}:260`,"Nicholas F. Brady;James Baker;Dick Cheney;Alan Greenspan"),USS:v("Congress of People's Deputies",5,1994,`*Communist Party of the Soviet Union:CPSU:-55:${E}:1957|Reformers and Independents:IND:0:${D}:293`,"Valentin Pavlov;Eduard Shevardnadze;Dmitry Yazov;Viktor Gerashchenko"),GBR:v("House of Commons",5,1992,`*Conservative Party:CON:35:${D}:376|Labour Party:LAB:-20:${E}:229|Liberal Democrats:LD:-5:${j}:22|Others:OTH:0:${I}:23`,"John Major;Douglas Hurd;Tom King;Robin Leigh-Pemberton"),FRA:v("National Assembly",5,1993,`*Socialist Party:PS:-25:${E}:275|Rally for the Republic:RPR:25:${Ee}:130|Union for French Democracy:UDF:15:${D}:130|French Communist Party:PCF:-75:${ge}:27|Others:OTH:0:${I}:15`,"Pierre Beregovoy;Roland Dumas;Jean-Pierre Chevenement;Jacques de Larosiere"),DEU:v("Bundestag",4,1990,`*CDU/CSU:CDU:15:${I}:223|Social Democratic Party:SPD:-20:${E}:186|*Free Democratic Party:FDP:15:${j}:46|The Greens:GRU:-25:${W}:42`,"Theo Waigel;Hans-Dietrich Genscher;Gerhard Stoltenberg;Karl Otto Pohl"),ITA:v("Chamber of Deputies",5,1992,`*Christian Democracy:DC:10:${D}:234|Communist Party:PCI:-50:${ge}:177|*Socialist Party:PSI:-15:${E}:94|Others:OTH:5:${I}:125`,"Guido Carli;Gianni De Michelis;Mino Martinazzoli;Carlo Azeglio Ciampi"),JPN:v("House of Representatives",4,1993,`*Liberal Democratic Party:LDP:20:${W}:275|Japan Socialist Party:JSP:-30:${E}:136|Komeito:KMT:0:${j}:45|Others:OTH:0:${I}:56`,"Ryutaro Hashimoto;Taro Nakayama;Yozo Ishikawa;Yasushi Mieno"),CHN:v("National People's Congress",5,1993,`*Communist Party of China:CPC:-50:${E}:2970`,"Wang Bingqian;Qian Qichen;Qin Jiwei;Li Guixian"),IND:v("Lok Sabha",5,1994,`Indian National Congress:INC:-10:${D}:197|*Janata Dal:JD:-10:${W}:143|Bharatiya Janata Party:BJP:40:${ne}:85|Communist Party of India (Marxist):CPM:-65:${E}:33|Others:OTH:0:${I}:85`,"Madhu Dandavate;Inder Kumar Gujral;V. P. Singh;R. N. Malhotra"),IRQ:{parties:[{name:"Arab Socialist Ba'ath Party",abbr:"BAATH",ideology:-20,colour:E,seats:250,ruling:!0}],cabinet:{foreign:"Tariq Aziz",defence:"Abdul Jabbar Shanshal"}}},2010:{USA:v("House of Representatives",2,2010,`*Democratic Party:DEM:-15:${D}:257|Republican Party:GOP:25:${E}:178`,"Timothy Geithner;Hillary Clinton;Robert Gates;Ben Bernanke"),GBR:v("House of Commons",5,2010,`*Labour Party:LAB:-15:${E}:345|Conservative Party:CON:20:${D}:193|Liberal Democrats:LD:-5:${j}:63|Others:OTH:0:${I}:49`,"Alistair Darling;David Miliband;Bob Ainsworth;Mervyn King"),FRA:v("National Assembly",5,2012,`*Union for a Popular Movement:UMP:20:${Ee}:313|Socialist Party:PS:-20:${E}:186|New Centre and Allies:NC:10:${D}:40|Others:OTH:-20:${I}:38`,"Christine Lagarde;Bernard Kouchner;Herve Morin;Christian Noyer"),DEU:v("Bundestag",4,2013,`*CDU/CSU:CDU:12:${I}:239|Social Democratic Party:SPD:-15:${E}:146|*Free Democratic Party:FDP:20:${j}:93|The Left:LINKE:-50:${ge}:76|Greens:GRU:-20:${W}:68`,"Wolfgang Schauble;Guido Westerwelle;Karl-Theodor zu Guttenberg;Axel Weber"),ITA:v("Chamber of Deputies",5,2013,`*The People of Freedom:PdL:25:${D}:276|Democratic Party:PD:-15:${E}:217|*Northern League:LN:45:${W}:60|Others:OTH:0:${I}:77`,"Giulio Tremonti;Franco Frattini;Ignazio La Russa;Mario Draghi"),ESP:v("Congress of Deputies",4,2012,`*Spanish Socialist Workers' Party:PSOE:-15:${E}:169|People's Party:PP:20:${D}:154|Others:OTH:0:${I}:27`,"Elena Salgado;Miguel Angel Moratinos;Carme Chacon;Miguel Angel Fernandez Ordonez"),GRC:v("Hellenic Parliament",4,2013,`*PASOK:PASOK:-10:${W}:160|New Democracy:ND:20:${D}:91|Communist Party of Greece:KKE:-80:${E}:21|Others:OTH:0:${I}:28`,"George Papaconstantinou;George Papandreou;Evangelos Venizelos;George Provopoulos"),RUS:v("State Duma",5,2011,`*United Russia:ER:25:${D}:315|Communist Party:KPRF:-60:${E}:57|Liberal Democratic Party:LDPR:40:${j}:40|A Just Russia:SR:-20:${ne}:38`,"Alexei Kudrin;Sergey Lavrov;Anatoliy Serdyukov;Sergey Ignatyev"),CHN:v("National People's Congress",5,2013,`*Communist Party of China:CPC:-35:${E}:2987`,"Xie Xuren;Yang Jiechi;Liang Guanglie;Zhou Xiaochuan"),JPN:v("House of Representatives",4,2013,`*Democratic Party of Japan:DPJ:-5:${D}:308|Liberal Democratic Party:LDP:20:${W}:119|Komeito:KMT:5:${j}:21|Others:OTH:0:${I}:32`,"Naoto Kan;Katsuya Okada;Toshimi Kitazawa;Masaaki Shirakawa"),IND:v("Lok Sabha",5,2014,`*Indian National Congress:INC:-15:${D}:206|Bharatiya Janata Party:BJP:30:${ne}:116|Others:OTH:0:${I}:221`,"Pranab Mukherjee;S. M. Krishna;A. K. Antony;Duvvuri Subbarao"),BRA:v("Chamber of Deputies",4,2010,`*Workers' Party:PT:-25:${E}:79|Brazilian Democratic Movement:PMDB:5:${W}:90|Brazilian Social Democracy Party:PSDB:10:${D}:59|Others:OTH:0:${I}:285`,"Guido Mantega;Celso Amorim;Nelson Jobim;Henrique Meirelles")},2020:{USA:v("House of Representatives",2,2020,`*Republican Party:GOP:30:${E}:197|Democratic Party:DEM:-15:${D}:233|Independent and Vacant:IND:0:${I}:5`,"Steven Mnuchin;Mike Pompeo;Mark Esper;Jerome Powell"),GBR:v("House of Commons",5,2024,`*Conservative Party:CON:20:${D}:365|Labour Party:LAB:-25:${E}:202|Scottish National Party:SNP:-15:${j}:48|Others:OTH:0:${I}:35`,"Rishi Sunak;Dominic Raab;Ben Wallace;Andrew Bailey"),FRA:v("National Assembly",5,2022,`*La Republique En Marche:LREM:5:${j}:301|The Republicans:LR:25:${D}:104|*MoDem:MODEM:5:${ne}:46|Socialist Party:PS:-20:${E}:28|Others:OTH:0:${I}:98`,"Bruno Le Maire;Jean-Yves Le Drian;Florence Parly;Francois Villeroy de Galhau"),DEU:v("Bundestag",4,2021,`*CDU/CSU:CDU:10:${I}:246|*Social Democratic Party:SPD:-15:${E}:152|Alternative for Germany:AfD:65:#38bdf8:89|Free Democratic Party:FDP:20:${j}:80|The Left:LINKE:-50:${ge}:69|Greens:GRU:-15:${W}:67`,"Olaf Scholz;Heiko Maas;Annegret Kramp-Karrenbauer;Jens Weidmann"),ITA:v("Chamber of Deputies",5,2023,`*Five Star Movement:M5S:0:${j}:216|Lega:LEGA:50:${W}:125|*Democratic Party:PD:-15:${E}:111|Forza Italia:FI:20:${D}:96|Others:OTH:0:${I}:82`,"Roberto Gualtieri;Luigi Di Maio;Lorenzo Guerini;Ignazio Visco"),ESP:v("Congress of Deputies",4,2023,`*Spanish Socialist Workers' Party:PSOE:-18:${E}:120|People's Party:PP:20:${D}:89|Vox:VOX:60:${W}:52|*Unidas Podemos:UP:-45:${ke}:35|Others:OTH:0:${I}:54`,"Maria Jesus Montero;Arancha Gonzalez Laya;Margarita Robles;Pablo Hernandez de Cos"),RUS:v("State Duma",5,2021,`*United Russia:ER:30:${D}:341|Communist Party:KPRF:-60:${E}:43|Liberal Democratic Party:LDPR:40:${j}:39|A Just Russia:SR:-20:${ne}:23`,"Anton Siluanov;Sergey Lavrov;Sergey Shoigu;Elvira Nabiullina"),CHN:v("National People's Congress",5,2023,`*Communist Party of China:CPC:-45:${E}:2980`,"Liu Kun;Wang Yi;Wei Fenghe;Yi Gang"),JPN:v("House of Representatives",4,2021,`*Liberal Democratic Party:LDP:25:${W}:285|Constitutional Democratic Party:CDP:-15:${D}:119|*Komeito:KMT:5:${j}:29|Others:OTH:0:${I}:32`,"Taro Aso;Toshimitsu Motegi;Taro Kono;Haruhiko Kuroda"),IND:v("Lok Sabha",5,2024,`*Bharatiya Janata Party:BJP:35:${ne}:303|Indian National Congress:INC:-15:${D}:52|Others:OTH:0:${I}:188`,"Nirmala Sitharaman;S. Jaishankar;Rajnath Singh;Shaktikanta Das"),BRA:v("Chamber of Deputies",4,2022,`*Social Liberal Party:PSL:50:${W}:53|Workers' Party:PT:-30:${E}:54|Others:OTH:5:${I}:406`,"Paulo Guedes;Ernesto Araujo;Fernando Azevedo;Roberto Campos Neto"),AUS:v("House of Representatives",3,2022,`*Liberal-National Coalition:LNP:18:${D}:77|Australian Labor Party:ALP:-15:${E}:68|Others:OTH:0:${I}:6`,"Josh Frydenberg;Marise Payne;Linda Reynolds;Philip Lowe"),CAN:v("House of Commons",4,2023,`*Liberal Party:LPC:-10:${E}:157|Conservative Party:CPC:20:${D}:121|Bloc Quebecois:BQ:-5:${pe}:32|New Democratic Party:NDP:-30:${ne}:24|Others:OTH:0:${I}:4`,"Bill Morneau;Francois-Philippe Champagne;Harjit Sajjan;Stephen Poloz")},2026:{USA:v("House of Representatives",2,2026,`*Republican Party:GOP:30:${E}:220|Democratic Party:DEM:-15:${D}:215`,"Scott Bessent;Marco Rubio;Pete Hegseth;Jerome Powell"),GBR:v("House of Commons",5,2029,`*Labour Party:LAB:-12:${E}:402|Conservative Party:CON:22:${D}:121|Liberal Democrats:LD:-5:${j}:72|Reform UK:REF:55:${pe}:5|Others:OTH:0:${I}:50`,"Rachel Reeves;Yvette Cooper;John Healey;Andrew Bailey"),FRA:v("National Assembly",5,2027,`National Rally:RN:60:${Ee}:123|*Ensemble:ENS:5:${j}:165|*The Republicans:LR:25:${D}:47|France Unbowed:LFI:-55:${E}:71|Socialist Party:PS:-20:${ne}:66|Others:OTH:0:${I}:105`,"Roland Lescure;Jean-Noel Barrot;Catherine Vautrin;Francois Villeroy de Galhau"),DEU:v("Bundestag",4,2029,`*CDU/CSU:CDU:15:${I}:208|Alternative for Germany:AfD:65:#38bdf8:152|*Social Democratic Party:SPD:-15:${E}:120|Greens:GRU:-15:${W}:85|The Left:LINKE:-50:${ge}:64|Others:OTH:0:${pe}:1`,"Lars Klingbeil;Johann Wadephul;Boris Pistorius;Joachim Nagel"),ITA:v("Chamber of Deputies",5,2027,`*Brothers of Italy:FdI:40:${Ee}:118|Democratic Party:PD:-15:${E}:69|*Lega:LEGA:50:${W}:66|Five Star Movement:M5S:-5:${j}:52|*Forza Italia:FI:15:${D}:45|Others:OTH:0:${I}:50`,"Giancarlo Giorgetti;Antonio Tajani;Guido Crosetto;Fabio Panetta"),ESP:v("Congress of Deputies",4,2027,`People's Party:PP:20:${D}:137|*Spanish Socialist Workers' Party:PSOE:-18:${E}:121|Vox:VOX:60:${W}:33|*Sumar:SMR:-40:${ke}:31|Others:OTH:0:${I}:28`,"Carlos Cuerpo;Jose Manuel Albares;Margarita Robles;Jose Luis Escriva"),RUS:v("State Duma",5,2026,`*United Russia:ER:35:${D}:324|Communist Party:KPRF:-60:${E}:57|A Just Russia:SR:-20:${ne}:27|LDPR:LDPR:45:${j}:21|New People:NP:15:${pe}:15|Others:OTH:0:${I}:6`,"Anton Siluanov;Sergey Lavrov;Andrey Belousov;Elvira Nabiullina"),UKR:v("Verkhovna Rada",5,2027,`*Servant of the People:SN:5:${W}:229|Others:OTH:5:${I}:171`,"Serhii Marchenko;Andrii Sybiha;Denys Shmyhal;Andrii Pyshnyi"),CHN:v("National People's Congress",5,2028,`*Communist Party of China:CPC:-45:${E}:2977`,"Lan Fo'an;Wang Yi;Dong Jun;Pan Gongsheng"),JPN:v("House of Representatives",4,2028,`*Liberal Democratic Party:LDP:30:${W}:196|Constitutional Democratic Party:CDP:-15:${D}:148|*Japan Innovation Party:JIP:25:${ne}:35|Democratic Party for the People:DPP:5:${j}:27|Komeito:KMT:5:${ke}:24|Others:OTH:0:${I}:35`,"Satsuki Katayama;Toshimitsu Motegi;Shinjiro Koizumi;Kazuo Ueda"),KOR:v("National Assembly",4,2028,`*Democratic Party:DPK:-10:${D}:166|People Power Party:PPP:25:${E}:107|Others:OTH:0:${I}:27`,"Koo Yun-cheol;Cho Hyun;Ahn Gyu-back;Rhee Chang-yong"),IND:v("Lok Sabha",5,2029,`*Bharatiya Janata Party:BJP:35:${ne}:240|Indian National Congress:INC:-15:${D}:99|Samajwadi Party:SP:-20:${E}:37|Trinamool Congress:TMC:-15:${W}:29|*Telugu Desam and Allies:NDA:15:${j}:53|Others:OTH:0:${I}:85`,"Nirmala Sitharaman;S. Jaishankar;Rajnath Singh;Sanjay Malhotra"),BRA:v("Chamber of Deputies",4,2026,`Liberal Party:PL:45:${W}:99|*Workers' Party Federation:PT:-30:${E}:80|Union Brazil:UB:15:${D}:59|Others:OTH:0:${I}:275`,"Fernando Haddad;Mauro Vieira;Jose Mucio;Gabriel Galipolo"),CAN:v("House of Commons",4,2029,`*Liberal Party:LPC:-5:${E}:169|Conservative Party:CPC:20:${D}:144|Bloc Quebecois:BQ:-5:${pe}:22|New Democratic Party:NDP:-30:${ne}:7|Green Party:GPC:-20:${W}:1`,"Francois-Philippe Champagne;Anita Anand;David McGuinty;Tiff Macklem"),AUS:v("House of Representatives",3,2028,`*Australian Labor Party:ALP:-12:${E}:94|Liberal-National Coalition:LNP:18:${D}:43|Others:OTH:0:${I}:13`,"Jim Chalmers;Penny Wong;Richard Marles;Michele Bullock"),ISR:v("Knesset",4,2026,`*Likud:LIK:40:${D}:32|Yesh Atid:YA:0:${j}:24|*Shas:SHAS:45:${I}:11|*Religious Zionism:RZP:70:${ne}:14|National Unity:NU:10:${pe}:8|Others:OTH:0:${W}:31`,"Bezalel Smotrich;Gideon Sa'ar;Israel Katz;Amir Yaron"),ARG:v("Chamber of Deputies",4,2027,`*La Libertad Avanza:LLA:50:${ke}:107|Union for the Homeland:UxP:-25:${D}:96|Others:OTH:5:${I}:54`,"Luis Caputo;Pablo Quirno;Luis Petri;Santiago Bausili"),MEX:v("Chamber of Deputies",3,2027,`*Morena:MOR:-20:${ge}:253|*Labor and Green Allies:PT:-15:${W}:113|National Action Party:PAN:20:${D}:71|Institutional Revolutionary Party:PRI:5:${E}:37|Others:OTH:0:${I}:26`,"Edgar Amador Zamora;Juan Ramon de la Fuente;Ricardo Trevilla;Victoria Rodriguez Ceja"),TUR:v("Grand National Assembly",5,2028,`*Justice and Development Party:AKP:35:${ne}:272|Republican People's Party:CHP:-10:${E}:138|*Nationalist Movement Party:MHP:60:${I}:47|Others:OTH:5:${pe}:143`,"Mehmet Simsek;Hakan Fidan;Yasar Guler;Fatih Karahan"),SAU:{parties:[],cabinet:{economy:"Mohammed Al-Jadaan",foreign:"Faisal bin Farhan",defence:"Khalid bin Salman",centralBank:"Ayman Al-Sayari"}},IRN:{parties:[],cabinet:{foreign:"Abbas Araghchi",defence:"Aziz Nasirzadeh"}}}},Oo={1900:yo,1914:go,1930:fo,1950:Ao,1990:ct,2010:To,2020:Io,2026:Uo},va={agriculture:2.6,mining:1.3,manufacturing:1.3,technology:.01,telecom:.05,media:.1,tourism:.05,healthcare:.2,finance:.35,education:.25,"real-estate":.6,retail:1.1,energy:.25,utilities:.3},ma={1900:{frontierPc:270,frontierGrowth:.014,revenueShare:.09,debt:.45,rate:.035,inflation:.012,unemployment:.05,openness:.35,regime:"gold",target:0,credit:.5,split:{defence:.34,welfare:.05,health:.02,education:.1,infrastructure:.15,science:.005,administration:.3,subsidies:.035},sectorWeights:va,popGrowth:{rich:.011,poor:.008}},1914:{frontierPc:370,frontierGrowth:.015,revenueShare:.1,debt:.4,rate:.04,inflation:.015,unemployment:.05,openness:.38,regime:"gold",target:0,credit:.55,split:{defence:.42,welfare:.07,health:.02,education:.1,infrastructure:.12,science:.005,administration:.24,subsidies:.035},sectorWeights:{...va,agriculture:2.2,technology:.02,telecom:.08},popGrowth:{rich:.01,poor:.009}},1930:{frontierPc:750,frontierGrowth:.016,revenueShare:.14,debt:.7,rate:.045,inflation:-.03,unemployment:.09,openness:.3,regime:"gold",target:0,credit:.65,split:{defence:.2,welfare:.15,health:.04,education:.13,infrastructure:.16,science:.01,administration:.24,subsidies:.06},sectorWeights:{...va,agriculture:1.8,technology:.05,telecom:.2,media:.3,energy:.5,utilities:.5,finance:.6,healthcare:.35},popGrowth:{rich:.007,poor:.012}},1950:{frontierPc:2e3,frontierGrowth:.024,revenueShare:.22,debt:.7,rate:.02,inflation:.03,unemployment:.045,openness:.22,regime:"float",target:.02,credit:.4,split:{defence:.26,welfare:.2,health:.07,education:.12,infrastructure:.13,science:.02,administration:.14,subsidies:.06},sectorWeights:{agriculture:1.5,manufacturing:1.4,mining:1.1,technology:.1,telecom:.4,media:.5,tourism:.25,healthcare:.5,finance:.7,education:.6,energy:.8},popGrowth:{rich:.012,poor:.019}},1990:{frontierPc:24e3,frontierGrowth:.02,revenueShare:.3,debt:.45,rate:.075,inflation:.055,unemployment:.065,openness:.4,regime:"float",target:.03,credit:.75,split:{defence:.12,welfare:.34,health:.13,education:.13,infrastructure:.09,science:.025,administration:.12,subsidies:.045},sectorWeights:{manufacturing:1.3,technology:.4,telecom:.7,media:.8,healthcare:.8},popGrowth:{rich:.006,poor:.024}},2010:{frontierPc:48e3,frontierGrowth:.016,revenueShare:.32,debt:.55,rate:.015,inflation:.022,unemployment:.085,openness:.55,regime:"float",target:.02,credit:.9,split:{defence:.08,welfare:.37,health:.17,education:.13,infrastructure:.08,science:.03,administration:.11,subsidies:.04},sectorWeights:{technology:.8},popGrowth:{rich:.004,poor:.022}},2020:{frontierPc:64e3,frontierGrowth:.015,revenueShare:.33,debt:.65,rate:.01,inflation:.02,unemployment:.05,openness:.5,regime:"float",target:.02,credit:1,split:{defence:.07,welfare:.37,health:.19,education:.12,infrastructure:.08,science:.03,administration:.11,subsidies:.03},sectorWeights:{},popGrowth:{rich:.003,poor:.02}},2026:{frontierPc:9e4,frontierGrowth:.017,revenueShare:.33,debt:.7,rate:.04,inflation:.03,unemployment:.05,openness:.5,regime:"float",target:.02,credit:1,split:{defence:.085,welfare:.36,health:.19,education:.12,infrastructure:.08,science:.03,administration:.105,subsidies:.03},sectorWeights:{technology:1.15},popGrowth:{rich:.003,poor:.018}}},xo={1900:{USA:[.1,.05,.03,.05,.03],GBR:[.47,.04,.03,.025,.02],FRA:[.9,.03,.02,.04,.02],DEU:[.35,.05,.03,.02,.03],RUS:[.55,.055,.03,.05,.03],JPN:[.25,.08,.05,.04,.02],ITA:[1,.05,.01,.05,.02],AUT:[.65,.045,.02,.04,.025],OTT:[.9,.08,.02,.05,.01],CHN:[.1,.1,.02,.1,.005]},1914:{USA:[.03,.05,.01,.08,.01],GBR:[.27,.03,.01,.03,.01],FRA:[.65,.035,.02,.03,.02],DEU:[.5,.04,.02,.03,.02],RUS:[.47,.06,.03,.05,.035],AUT:[.6,.05,.02,.04,.02],ITA:[.75,.055,.02,.06,.015],JPN:[.6,.07,.02,.04,.02],OTT:[.8,.08,.03,.06,.005]},1930:{USA:[.17,.035,-.03,.087,-.05],GBR:[1.7,.035,-.04,.11,-.01],FRA:[1,.035,0,.03,.01],DEU:[.25,.05,-.04,.15,-.02],USS:[.1,.06,.1,.03,.07],JPN:[.45,.055,-.1,.05,-.01],ITA:[.9,.055,-.04,.08,-.01],CAN:[.5,.045,-.03,.09,-.04],ARG:[.3,.06,-.03,.08,-.04],AUS:[.65,.055,-.05,.14,-.05],CHN:[.1,.1,.02,.1,.01]},1950:{USA:[.94,.0175,.01,.052,.087],GBR:[2,.02,.03,.015,.035],FRA:[.3,.025,.1,.02,.07],DEU:[.2,.04,-.06,.08,.1],JPN:[.15,.05,.2,.02,.1],ITA:[.3,.04,0,.09,.07],USS:[.15,.04,-.05,.01,.1],CHN:[.05,.06,.3,.1,.1],IND:[.3,.03,.03,.05,.02],CAN:[.8,.02,.03,.035,.05],ARG:[.35,.06,.25,.03,0],BRA:[.2,.08,.1,.05,.06]},1990:{USA:[.55,.08,.054,.056,.019],GBR:[.27,.14,.095,.069,.007],FRA:[.35,.095,.034,.09,.029],DEU:[.4,.08,.027,.06,.05],ITA:[.95,.12,.065,.1,.02],ESP:[.43,.145,.067,.16,.038],JPN:[.63,.06,.03,.021,.049],CAN:[.72,.125,.048,.081,.002],USS:[.2,.05,.05,.01,-.02],CHN:[.1,.09,.03,.025,.039],IND:[.75,.1,.09,.06,.055],BRA:[.4,1.5,15,.045,-.04],ARG:[.6,1,13,.07,-.02],MEX:[.45,.35,.27,.03,.05],KOR:[.15,.1,.086,.025,.09],SAU:[.4,.08,.02,.05,.08],IRQ:[1.2,.1,.5,.1,-.5]},2010:{USA:[.95,.0025,.016,.098,.027],GBR:[.75,.005,.033,.079,.019],FRA:[.85,.01,.015,.093,.019],DEU:[.82,.01,.011,.07,.042],ITA:[1.19,.01,.015,.084,.017],ESP:[.6,.01,.018,.2,0],GRC:[1.47,.01,.047,.13,-.055],PRT:[1,.01,.014,.11,.017],IRL:[.85,.01,-.016,.14,.018],JPN:[2.07,.001,-.007,.051,.041],CAN:[.85,.0075,.018,.081,.031],CHN:[.33,.0531,.033,.041,.106],IND:[.67,.05,.1,.08,.085],RUS:[.11,.0775,.069,.074,.045],BRA:[.63,.0875,.05,.08,.075],MEX:[.42,.045,.042,.053,.05],KOR:[.3,.02,.03,.037,.068],AUS:[.2,.0375,.028,.052,.024],TUR:[.4,.065,.086,.11,.084],ZAF:[.35,.07,.043,.25,.03],SAU:[.08,.02,.038,.055,.05],IDN:[.25,.065,.051,.07,.062]},2020:{USA:[1.08,.0025,.012,.08,-.028],GBR:[.85,.001,.009,.046,-.1],FRA:[.98,0,.005,.08,-.08],DEU:[.6,0,.004,.038,-.04],ITA:[1.34,0,.001,.092,-.09],ESP:[.95,0,0,.155,-.11],JPN:[2.36,-.001,0,.028,-.042],CAN:[.88,.0075,.007,.095,-.05],CHN:[.57,.0385,.03,.052,.022],IND:[.74,.0515,.06,.08,-.06],RUS:[.14,.06,.03,.058,-.027],BRA:[.76,.0375,.033,.135,-.033],MEX:[.45,.065,.034,.044,-.082],KOR:[.42,.0125,.005,.039,-.007],AUS:[.45,.005,.009,.065,-.002],TUR:[.33,.1075,.12,.13,.019],ZAF:[.62,.0525,.033,.29,-.06],SAU:[.23,.0175,.034,.075,-.04],ARG:[.9,.38,.42,.115,-.1],IDN:[.3,.045,.02,.06,-.02]},2026:{USA:[1.24,.0375,.029,.044,.02],GBR:[1.03,.0375,.034,.05,.013],FRA:[1.15,.02,.01,.077,.008],DEU:[.65,.02,.022,.038,.009],ITA:[1.37,.02,.012,.06,.007],ESP:[1.01,.02,.028,.104,.021],JPN:[2.35,.0075,.025,.026,.008],CAN:[1.1,.0225,.022,.066,.012],CHN:[.68,.03,0,.051,.046],IND:[.82,.0525,.02,.05,.065],RUS:[.2,.16,.06,.022,.008],UKR:[1.05,.155,.08,.12,.02],BRA:[.92,.15,.045,.054,.018],MEX:[.55,.07,.037,.027,.012],KOR:[.53,.025,.021,.028,.018],AUS:[.5,.036,.03,.043,.021],TUR:[.25,.38,.31,.085,.034],ZAF:[.78,.0675,.035,.32,.015],SAU:[.32,.045,.021,.035,.044],ARG:[.8,.29,.31,.07,.04],IDN:[.41,.0475,.025,.048,.05],ISR:[.7,.0425,.025,.03,.033],IRN:[.35,.23,.45,.09,0],VEN:[1.5,.6,2,.08,.04]}},Ho={1900:{DEU:{active:600},RUS:{active:1100},FRA:{active:620},GBR:{active:430},AUT:{active:360},ITA:{active:260},USA:{active:125},JPN:{active:150},OTT:{active:200}},1914:{DEU:{active:880},RUS:{active:1350},FRA:{active:910},GBR:{active:390},AUT:{active:450},ITA:{active:300},USA:{active:100},JPN:{active:300},OTT:{active:210},SRB:{active:200}},1930:{USS:{active:560},FRA:{active:500},GBR:{active:340},ITA:{active:300},JPN:{active:270},POL:{active:270},USA:{active:250},DEU:{active:100},CHN:{active:2e3}},1950:{USA:{active:1460,nukes:299},USS:{active:4300,nukes:5},CHN:{active:5e3},GBR:{active:680},FRA:{active:590},TWN:{active:500},PRK:{active:135},KOR:{active:98}},1990:{USS:{active:3400,nukes:37e3},USA:{active:2050,nukes:21400},CHN:{active:3030,nukes:230},IND:{active:1260},IRQ:{active:1e3},PRK:{active:1100},KOR:{active:750},GBR:{active:300,nukes:350},FRA:{active:550,nukes:500},DEU:{active:470},ISR:{active:140,nukes:60},ZAF:{active:70,nukes:6},TUR:{active:650},IRN:{active:500},VNM:{active:1e3},SYR:{active:400},SAU:{active:150}},2010:{CHN:{active:2285,nukes:240},USA:{active:1560,nukes:9400},IND:{active:1325,nukes:80},RUS:{active:1030,nukes:12e3},PRK:{active:1100},KOR:{active:655},PAK:{active:620,nukes:80},IRN:{active:520},TUR:{active:510},GBR:{active:190,nukes:225},FRA:{active:240,nukes:300},ISR:{active:180,nukes:80},DEU:{active:250}},2020:{CHN:{active:2035,nukes:320},IND:{active:1450,nukes:150},USA:{active:1390,nukes:5800},RUS:{active:900,nukes:6375},PRK:{active:1280,nukes:30},PAK:{active:650,nukes:160},KOR:{active:600},IRN:{active:610},TUR:{active:355},GBR:{active:150,nukes:215},FRA:{active:200,nukes:290},ISR:{active:170,nukes:90},DEU:{active:180}},2026:{CHN:{active:2035,nukes:600},IND:{active:1475,nukes:180},USA:{active:1320,nukes:5177},RUS:{active:1500,nukes:5459},UKR:{active:900},PRK:{active:1320,nukes:50},PAK:{active:660,nukes:170},IRN:{active:610},KOR:{active:500},TUR:{active:355},GBR:{active:140,nukes:225},FRA:{active:200,nukes:290},ISR:{active:170,nukes:90},DEU:{active:180}}},Fo={USA:-.03,GBR:-.02,CHN:.03,DEU:.05,JPN:.01,KOR:.04,TWN:.1,NLD:.07,CHE:.08,NOR:.1,SAU:.1,ARE:.12,RUS:.06,SGP:.15,QAT:.2,KWT:.2,IRL:.1,IND:-.03,TUR:-.03,BRA:0,AUS:.01,CAN:-.01};class $e{constructor(a){ia(this,"s");this.s=a>>>0||2654435769}next(){let a=this.s;return a^=a<<13,a>>>=0,a^=a>>17,a^=a<<5,a>>>=0,this.s=a,a/4294967296}float(a,n){return a+this.next()*(n-a)}int(a,n){return Math.floor(this.float(a,n+1))}chance(a){return this.next()<a}normal(){let a=0;for(let n=0;n<12;n++)a+=this.next();return a-6}pick(a){return a[Math.floor(this.next()*a.length)]}weighted(a,n){let t=0;for(const i of a)t+=Math.max(0,n(i));if(t<=0)return this.pick(a);let r=this.next()*t;for(const i of a)if(r-=Math.max(0,n(i)),r<=0)return i;return a[a.length-1]}shuffle(a){for(let n=a.length-1;n>0;n--){const t=Math.floor(this.next()*(n+1));[a[n],a[t]]=[a[t],a[n]]}return a}fork(a){let n=2166136261^this.s;for(let t=0;t<a.length;t++)n^=a.charCodeAt(t),n=Math.imul(n,16777619);return new $e(n>>>0)}get state(){return this.s}set state(a){this.s=a>>>0}}const m=(e,a,n)=>e<a?a:e>n?n:e,z=e=>m(e,0,1),V=(e,a,n)=>e+(a-e)*z(n),Ta=["economy","tax","welfare","health","education","environment","defence","immigration","foreign-policy","justice","technology","housing","energy","transport","agriculture","labour"],Ko={economy:"Finance Minister",tax:"Minister for Taxation",welfare:"Minister for Social Welfare",health:"Minister of Health",education:"Minister of Education",environment:"Minister of the Environment",defence:"Minister of Defence",immigration:"Minister for Immigration","foreign-policy":"Foreign Minister",justice:"Minister of Justice",technology:"Minister for Technology",housing:"Minister for Housing",energy:"Minister of Energy",transport:"Minister of Transport",agriculture:"Minister of Agriculture",labour:"Minister of Labour"},$o=["constitutional-monarchy","parliamentary-republic","semi-presidential-republic","presidential-republic","federal-republic"],Jo=["absolute-monarchy","one-party-state","military-junta","theocracy","occupied-territory","monarchy-absolute-colonial","dependency","protectorate","mandate-colony"];function He(e){return $o.includes(e)}function Ia(e){return Jo.includes(e)}const Wo={1950:{USA:.01,GBR:-.03},1990:{USA:.04,ITA:.11,JPN:-.02,DEU:.02,FRA:.02,GBR:0,USS:.06},2010:{USA:.11,GBR:.1,JPN:.08,FRA:.07,GRC:.15,ESP:.1,IRL:.14,PRT:.1,ITA:.05,DEU:.04,CHN:.02,IND:.08,RUS:.04,BRA:.03},2020:{USA:.06,GBR:.03,JPN:.03,FRA:.03,ITA:.02,DEU:-.01,CHN:.05,IND:.07},2026:{USA:.06,GBR:.045,JPN:.025,FRA:.055,ITA:.03,DEU:.025,CHN:.07,IND:.08,BRA:.08,RUS:.03,UKR:.2}},Vo={1900:1900,1914:1916,1930:1932,1950:1952,1990:1992,2010:2012,2020:2020,2026:2028},wo={USA:"USD",GBR:"GBP",FRA:"FRF",DEU:"DEM",JPN:"JPY",CHN:"CNY",RUS:"RUB",USS:"SUR",IND:"INR",BRA:"BRL",CAN:"CAD",AUS:"AUD",MEX:"MXN",KOR:"KRW",ITA:"ITL",ESP:"ESP",ARG:"ARS",CHE:"CHF",ZAF:"ZAR",TUR:"TRY",SAU:"SAR",IDN:"IDR",SWE:"SEK",NOR:"NOK",DNK:"DKK",NLD:"NLG",OTT:"TRL",AUT:"ATK"},Ua=new Set("AUT BEL CYP FIN FRA DEU GRC IRL ITA LUX MLT NLD PRT SVK SVN ESP".split(" ")),Nn=new Set([...Ua,"EST","LVA","LTU","HRV"]),jo=new Set("USA GBR DEU JPN CHE CAN AUS NZL SWE NOR DNK KOR CHL ISR MEX BRA IND ZAF POL CZE HUN".split(" ")),ut=new Set("SAU ARE KWT QAT BHR OMN IRQ IRN".split(" ")),Yo=new Set("RUS NGA DZA AGO VEN KAZ AZE NOR GAB TKM MNG BOL CHL PER ZMB ZWE LBY GNQ COG TTO BRN".split(" "));function Zo(e){const a=new Map;for(const i of e)for(const s of i.lands)a.set(s,i.id);const n={ERI:"ETH",SSD:"SDN",HKG:"CHN",PRI:"USA",PAN:"COL",TLS:"IDN",XKX:"SRB"},t=(i,s=0)=>{const o=a.get(i);if(o)return o;if(s>3)return;const c=n[i]??Ma[i];return c?t(c,s+1):void 0},r={};for(const i of pa){const s=t(i.iso3);s&&(r[i.numeric]=s)}for(const i of Object.keys(Ma))if(/^\d{3}$/.test(i)){const s=t(Ma[i]);s&&(r[i]=s)}for(const[i,s]of Object.entries(Ii)){const o=t(s);o&&(r[i]=o)}return r["Siachen Glacier"]=t("IND")??"",r["Indian Ocean Ter."]=t("AUS")??"",r[732]=t("ESH")??"",r}const zo={1990:0,2010:1,2020:2,2026:3};function qo(e,a){var t;return((t={1900:{africa:.2,americas:.22,asia:.28,europe:.6,"middle-east":.18,oceania:.25},1914:{africa:.23,americas:.28,asia:.31,europe:.66,"middle-east":.2,oceania:.3},1930:{africa:.26,americas:.34,asia:.36,europe:.72,"middle-east":.22,oceania:.36},1950:{africa:.36,americas:.47,asia:.46,europe:.78,"middle-east":.32,oceania:.5}}[e])==null?void 0:t[a])??1}function Xo(e,a){const n=zo[a],t=Se[e],r=Wn[e];if(n!==void 0)return t?{pop:t.pop[n],gdp:t.gdp[n]}:r?{pop:r.pop[n],gdp:r.gdp[n]}:{pop:0,gdp:0};const i=((t==null?void 0:t.pop[0])??(r==null?void 0:r.pop[0])??0)*qo(a,(t==null?void 0:t.region)??"europe"),s=ma[a].frontierPc*.12;return{pop:i,gdp:i*s/1e3}}function _o(e,a){let n=e.popM,t=e.gdpB;if(n===void 0||t===void 0){let r=0,i=0;for(const s of e.lands){const o=Xo(s,a);r+=o.pop,i+=o.gdp}n??(n=r),t??(t=i)}return{pop:Math.max(.001,n),gdp:Math.max(5e-4,t)}}function Qo(e,a){for(const t of e.lands){const r=Se[t]??Wn[t];if(r)return{lat:r.lat,lon:r.lon}}const n=a.regions.find(t=>t.owner===e.id);if(n){const t=n.ring.reduce((i,s)=>i+s[0],0)/n.ring.length;return{lat:n.ring.reduce((i,s)=>i+s[1],0)/n.ring.length,lon:t}}return{lat:0,lon:0}}function er(e,a,n,t){return t>=1950&&ut.has(e)?"oilstate":t>=1950&&Yo.has(e)?"resource":["LUX","SGP","HKG","IRL","CYP","PAN","MUS"].includes(e)&&t>=1990?"taxhaven":["MCO","SMR","VAT","LIE","AND","BRB"].includes(e)?"sanctuary":n==="one-party-state"&&a<.35&&t>=1930?t>=1990?"command":"planned":n==="one-party-state"?"planned":a>.72?t<1950||t<1990?"industrial":"postindustrial":a>.45?t<1950?"industrial":"service":a>.18?(t<1950,"mixed"):a>.08?t<1950?"agrarian":"industrial":"agrarian"}const ar={agriculture:.05,mining:.45,manufacturing:.3,energy:.55,utilities:.7,construction:.12,transport:.35,retail:.2,finance:.45,"real-estate":.08,telecom:.75,technology:.6,healthcare:.3,education:.1,defence:.7,tourism:.1,media:.4};function nr(e,a,n,t,r){const i={};for(const l of ba){const p=e.mix[l]??.004;i[l]=p*(a.sectorWeights[l]??1)*r.float(.9,1.1)}const s=Object.values(i).reduce((l,p)=>l+p,0),o={};let c=0;for(const l of ba){const p=i[l]/s;o[l]=p*Ae[l].labourIntensity,c+=o[l]}return ba.map(l=>{const p=i[l]/s,h=n*p,y=Math.round(t*o[l]/c),f=Ae[l];return{id:l,share:p,growth:f.growth*.6,productivity:y>0?h/y:0,employment:y,stateSubsidy:0,stateOwnership:l==="utilities"||l==="education"?Math.max(e.stateOwnership,.4):e.stateOwnership,output:h,quantity:h,capacity:h*1.02,price:1,wage:y>0?h*.58/y:0,margin:f.margin,concentration:ar[l],regulation:.3}})}const tr={working:"Working households",middle:"Middle class",wealthy:"Wealthy households"};function mt(e){const a=m(.3-(e-.35)*.55,.06,.38),n=m(.28+(e-.35)*.95,.15,.72);return{working:a,middle:Math.max(.1,1-a-n),wealthy:n}}function ir(e,a){const n=mt(e),t={working:.5,middle:.4,wealthy:.1},r={working:.02,middle:.1,wealthy:.3};return["working","middle","wealthy"].map(i=>{const s=a*.7*n[i]/t[i];return{id:i,label:tr[i],popShare:t[i],incomeShare:n[i],income:s,realIncome:s,costOfLiving:1,savingsRate:r[i],satisfaction:.55}})}function dt(e,a,n,t,r,i){const s=a*.55,o=a*.28,c=l=>m(1-i*.5-Math.max(0,l-.45)*.7,.2,1);return{income:e.income*s*.8*c(e.income),payroll:e.payroll*s*c(e.payroll),corporate:e.corporate*o*.75*c(e.corporate),vat:e.vat*n*.8*c(e.vat),tariff:e.tariff*t*.85,royalty:e.royalty*r}}function or(e,a,n,t,r,i,s){var x,J;const o=r*1e6,c=i*1e9,l=c/o,p=m(l/t.frontierPc,.005,1.6),h=(x=xo[n])==null?void 0:x[e],y=Mn[er(e,p,a.government,n)]??Mn.mixed,f=!!a.overlord,P=m(.42+p*.12+(n>=1990?.04:0),.38,.62),A=h?h[3]:m(t.unemployment*(p<.2?1.2:1)*s.float(.8,1.2),.015,.25),b=o*P*(1-A),N=nr(y,t,c,b,s),R=m((1-Math.min(1,p))*.55+s.float(-.08,.08)+(f?.1:0),.04,.85),u=m(.32+(1-Math.min(1,p))*.14+(n<1950?.1:0)+(a.government==="one-party-state"?-.06:0)+s.float(-.04,.04),.22,.72),d=m(t.revenueShare*(.55+.75*Math.sqrt(Math.min(1,p)))*(f?.55:1)*(y.stateOwnership>.6?1.25:1),.03,.55),g=h?h[0]:m(t.debt*(.5+.8*Math.min(1,p))*s.float(.7,1.3)*(f?.4:1),.02,2),S=h?h[2]:t.inflation+s.float(-.008,.012)+(p<.2&&n>=1950?.03:0),B=h?h[1]:Math.max(0,t.rate+(p<.25?.03:0)+s.float(-.005,.005)),M=h?h[4]:t.frontierGrowth+(1-Math.min(1,p))*.012+s.float(-.01,.01),L=m(t.openness*(y.openness/.5)*(r>200?.6:r<5?1.5:1)*s.float(.9,1.1),.04,1.6),k=n>=1950?Fo[e]??(p<.2?-.03:0):0,$=c*(L+k)/2,Y=c*(L-k)/2,Q=g*c*(B*.4+t.rate*.6+(p<.25?.015:0)),Z=f?0:((J=Wo[n])==null?void 0:J[e])??(n>=2010?.03:n>=1950?.015:.005),ce=Math.max(c*.025,d*c-Q+c*Z),oe={...t.split};(a.government==="one-party-state"||a.government==="military-junta")&&(oe.defence*=1.6,oe.welfare*=.8),f&&(oe.defence*=.5,oe.administration*=1.5);const de=Object.values(oe).reduce((te,se)=>te+se,0),q=Object.fromEntries(Object.entries(oe).map(([te,se])=>[te,se/de*ce/c])),O=c*(q.defence+q.health+q.education+q.infrastructure+q.science+q.administration),U=c*m(.14+p*.06+M*1.2+(a.government==="one-party-state"?.08:0),.06,.42),F=Math.max(c*.3,c-U-O-$+Y),w=n<1930?{income:.02,corporate:.02,vat:.07,payroll:0,tariff:.2,royalty:.1}:n<1990?{income:n<1950?.06:.16,corporate:n<1950?.1:.32,vat:.07,payroll:n<1950?.01:.05,tariff:.15,royalty:.15}:{income:.2,corporate:.24,vat:.14,payroll:.11,tariff:n===1990?.08:.04,royalty:.2},he=N.filter(te=>te.id==="mining").reduce((te,se)=>te+se.output,0),ue=dt(w,c,F,Y,he,R),Ge=Object.values(ue).reduce((te,se)=>te+se,0),ie=m(d*c/Math.max(1,Ge),.15,2.4),Ie={income:m(w.income*ie,0,.7),corporate:m(w.corporate*ie,0,.6),vat:m(w.vat*ie,0,.3),payroll:m(w.payroll*ie,0,.35),tariff:m(w.tariff*(ie*.5+.5),0,.6),royalty:m(w.royalty*ie,0,.7)},be=n<1950?n===1930&&["USS"].includes(e)?"command":"gold":n>=2010&&(n>=2026?Nn:Ua).has(e)?"union":y.stateOwnership>.75?"command":ut.has(e)||["HKG","PAN","ECU","SLV","BHS","BRB"].includes(e)||n===1950&&e!=="USA"?"peg":"float",Ue=B*.4+t.rate*.6+(p<.25?.015:0);return{gdp:c,gdpPerCapita:l,gdpGrowth:M,nominalGrowth:(1+M)*(1+S)-1,population:o,productivity:m(p*80,4,100),debtRatingScore:m(80-g*22-R*40,3,99),fiscal:{revenue:d*c,taxIncome:ue.income*ie,corporateTax:ue.corporate*ie,vat:ue.vat*ie,tariffs:ue.tariff*ie,resourceRent:ue.royalty*ie,expenditure:ce+Q,military:q.defence*c,welfare:q.welfare*c,infrastructure:q.infrastructure*c,education:q.education*c,healthcare:q.health*c,administration:q.administration*c,debtService:Q,debt:g*c,debtToGdp:g,creditRating:m(.82-g*.2-R*.5,.05,.98),budgetBalanceRatio:(d*c-ce-Q)/c,treasury:c*.02},monetary:{policyRate:B,moneySupply:1,inflation:S,reserveRatio:.08,centralBankRate:B,exchangeRateVsUsd:1,currencyConfidence:m(70-S*200-R*25,5,95)},labour:{unemployment:A,participation:P,unionisation:m(y.unionisation*(n<1930?.3:n<1990?1.1:.7),.02,.9),medianWage:l*.74,wageGrowth:M+S,strikeRisk:.05,satisfaction:.55},trade:{exports:$,imports:Y,tradeBalance:$-Y,exportPartners:[],importPartners:[],tradeOpenness:L*100,tariffRate:Ie.tariff,flows:{}},sectors:N,history:[],corruption:R,inequality:u,netForeignAssets:c*(k*4+s.float(-.1,.1)),reserves:c*m(.04+Math.abs(k)*(k>0?3:0)+s.float(0,.04),.01,.6),rd:c*q.science*2,macro:{potential:c*(1-m(M<0?M:0,-.1,0)),realGdp:c,priceLevel:1,outputGap:m(M<0?M:0,-.1,0),capital:c*m(1.6+p,1.2,3.2),tfpGrowth:0,potentialGrowth:0,expectedInflation:m(S,-.03,1),nairu:m(A-(M<0?.015:0),.015,.28),consumerConfidence:50,businessConfidence:50,neutralRate:.01,bondYield:Math.max(B,t.rate)+.01,riskPremium:.01,debtCost:Ue,credit:t.credit*m(.4+p,.3,1.7),npl:.03,housePrice:100,currentAccount:$-Y,realExchange:0,openness:L,structuralTradeBalance:k,deficitAnchor:(ce+Q-d*c)/c,shock:0,shockDecay:1,minimumWage:n<1950?0:m(.3+s.float(0,.2),0,.6),popGrowth:t.popGrowth.poor+(t.popGrowth.rich-t.popGrowth.poor)*Math.min(1,p),baseBudget:{...q},realHistory:[],priceHistory:[]},tax:Ie,budget:q,centralBank:{independent:n>=1990?jo.has(e)||n>=2010&&(n>=2026?Nn:Ua).has(e):["USA","GBR","DEU","CHE"].includes(e)&&n>=1914,regime:be,target:t.target,credibility:m(.85-R*.8-Math.max(0,S-.1),.05,.95),qe:n===2020?.15:n===2026?.2:n===2010?.1:0,printing:0,currency:be==="union"?"EUR":wo[e]??"LCU"},accounts:{consumption:F,investment:U,government:O,exports:$,imports:Y},households:ir(u,l)}}function rr(e,a,n,t,r,i,s){var y;const o=(y=Ho[n])==null?void 0:y[e],c=o!=null&&o.active?o.active*1e3:Math.round(t*1e6*(a==="one-party-state"||a==="military-junta"?.008:.0045)),l=(o==null?void 0:o.nukes)??0,p=()=>m(s.float(30,80),5,100),h=f=>({active:Math.round(c*f),quality:p()});return{activeDuty:c,reserves:Math.round(c*s.float(.8,2.5)),spend:r*i,readiness:m(s.float(45,85),10,100),doctrine:s.float(-30,30),nuclearArsenal:l,branches:{army:h(.68),navy:h(.14),"air-force":h(n<1930?0:.14),marines:h(.02),space:h(n<1990?0:.003),cyber:h(n<2010?0:.005),nuclear:{active:l,quality:l?m(s.float(60,95),10,100):0}},morale:s.float(50,85),veterans:Math.round(c*s.float(.2,.9)),conscription:n<1990?!0:s.chance(.35),burden:i}}function sr(e,a,n,t){const r=!!e.overlord,i=(n==null?void 0:n.seats)??m(Math.round(40+Math.sqrt(a)*28),30,650);if(!(!t&&!(n!=null&&n.chamber))&&!(r&&!(n!=null&&n.chamber)&&e.status!=="dominion"))return{id:"chamber-1",name:(n==null?void 0:n.chamber)??(e.government==="one-party-state"?"People's Assembly":"National Parliament"),kind:"lower",seats:i,districtSeats:i,prSeats:0,districtThreshold:0,moneyBills:!0,vetoOverride:!1,termDays:Math.round(((n==null?void 0:n.termYears)??4)*365),election:t?"fptp":"none",confirmsAppointments:!1}}function cr(e,a){const n=/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/.exec(e);return n?`hsl(${n[1]} ${Math.max(14,Number(n[2])-10)}% ${m(Number(n[3])+a,18,82)}%)`:e}const lr={1900:{GBR:"hsl(345 58% 54%)",FRA:"hsl(216 52% 48%)",DEU:"hsl(28 14% 44%)",RUS:"hsl(128 30% 38%)",AUT:"hsl(44 58% 56%)",OTT:"hsl(168 30% 36%)",ITA:"hsl(96 30% 44%)",ESP:"hsl(33 62% 50%)",PRT:"hsl(148 42% 36%)",NLD:"hsl(24 78% 52%)",BEL:"hsl(50 52% 44%)",USA:"hsl(212 48% 54%)",JPN:"hsl(352 56% 56%)",CHN:"hsl(42 68% 56%)",KOR:"hsl(222 24% 50%)",THA:"hsl(18 58% 46%)",IRN:"hsl(46 38% 46%)",AFG:"hsl(96 22% 40%)",ETH:"hsl(122 38% 34%)",MAR:"hsl(6 48% 44%)",SAR:"hsl(22 48% 40%)",OFS:"hsl(34 52% 54%)",MEX:"hsl(126 34% 38%)",BRA:"hsl(146 44% 40%)",ARG:"hsl(202 56% 58%)",CHL:"hsl(352 40% 48%)",PER:"hsl(348 36% 46%)",GRC:"hsl(196 44% 48%)",ROU:"hsl(36 44% 46%)",BGR:"hsl(88 26% 40%)",SRB:"hsl(348 44% 42%)",SWE:"hsl(206 40% 50%)",DNK:"hsl(354 42% 48%)",CHE:"hsl(0 40% 46%)",NPL:"hsl(355 46% 50%)",BTN:"hsl(28 38% 48%)"},1914:{GBR:"hsl(345 58% 54%)",FRA:"hsl(216 52% 48%)",DEU:"hsl(28 14% 44%)",RUS:"hsl(128 30% 38%)",AUT:"hsl(44 58% 56%)",OTT:"hsl(168 30% 36%)",ITA:"hsl(96 30% 44%)",ESP:"hsl(33 62% 50%)",PRT:"hsl(148 42% 36%)",NLD:"hsl(24 78% 52%)",BEL:"hsl(50 52% 44%)",USA:"hsl(212 48% 54%)",JPN:"hsl(352 56% 56%)",CHN:"hsl(42 64% 54%)",THA:"hsl(18 58% 46%)",IRN:"hsl(46 38% 46%)",AFG:"hsl(96 22% 40%)",ETH:"hsl(122 38% 34%)",MAR:"hsl(6 48% 44%)",SAU:"hsl(150 40% 34%)",NOR:"hsl(206 46% 54%)",SWE:"hsl(206 34% 50%)",DNK:"hsl(354 42% 48%)",CHE:"hsl(0 40% 46%)",TIB:"hsl(30 42% 54%)",MNG:"hsl(50 42% 46%)",SRB:"hsl(348 44% 42%)",ROU:"hsl(36 44% 46%)",BGR:"hsl(88 26% 40%)",GRC:"hsl(196 44% 48%)",ALB:"hsl(8 40% 40%)",MEX:"hsl(126 34% 38%)",BRA:"hsl(146 44% 40%)",ARG:"hsl(202 56% 58%)",CHL:"hsl(352 40% 48%)",NPL:"hsl(355 46% 50%)"},1930:{GBR:"hsl(345 56% 56%)",FRA:"hsl(216 50% 50%)",DEU:"hsl(28 10% 46%)",USS:"hsl(0 60% 40%)",ITA:"hsl(96 26% 44%)",AUT:"hsl(44 52% 52%)",HUN:"hsl(34 44% 46%)",CSK:"hsl(238 32% 46%)",POL:"hsl(345 42% 46%)",YUG:"hsl(202 28% 44%)",TUR:"hsl(354 44% 46%)",ESP:"hsl(33 58% 48%)",PRT:"hsl(148 40% 34%)",NLD:"hsl(24 74% 50%)",BEL:"hsl(50 50% 44%)",USA:"hsl(212 46% 54%)",JPN:"hsl(352 56% 56%)",CHN:"hsl(46 58% 52%)",SAU:"hsl(150 42% 34%)",IRN:"hsl(42 40% 46%)",AFG:"hsl(96 22% 40%)",ETH:"hsl(122 38% 34%)",EGY:"hsl(50 48% 54%)",IRQ:"hsl(45 52% 46%)",LEV:"hsl(210 40% 46%)",PLM:"hsl(190 34% 48%)",FIN:"hsl(206 40% 52%)",NOR:"hsl(206 34% 50%)",SWE:"hsl(206 30% 48%)",DNK:"hsl(354 42% 48%)",IRL:"hsl(140 44% 42%)",TIB:"hsl(30 42% 54%)",MNG:"hsl(50 42% 46%)",ROU:"hsl(36 44% 46%)",BGR:"hsl(88 26% 40%)",GRC:"hsl(196 44% 48%)",MEX:"hsl(126 34% 38%)",BRA:"hsl(146 44% 40%)",ARG:"hsl(202 56% 58%)",CHL:"hsl(352 40% 48%)"}};function ur(e,a){var n;return((n=lr[a])==null?void 0:n[e])??mr[e]}const mr={GBR:"hsl(350 62% 52%)",FRA:"hsl(218 58% 48%)",DEU:"hsl(30 18% 42%)",DDR:"hsl(4 48% 40%)",RUS:"hsl(135 32% 40%)",USS:"hsl(0 72% 42%)",AUT:"hsl(42 50% 50%)",OTT:"hsl(165 36% 34%)",ITA:"hsl(95 34% 42%)",USA:"hsl(208 54% 52%)",JPN:"hsl(355 54% 60%)",CHN:"hsl(358 72% 50%)",ESP:"hsl(28 66% 46%)",PRT:"hsl(150 44% 36%)",NLD:"hsl(24 80% 52%)",BEL:"hsl(52 56% 42%)",YUG:"hsl(204 30% 46%)",CSK:"hsl(250 30% 50%)",POL:"hsl(340 42% 62%)"};function dr(e,a,n,t,r){var f;const i=(f=lt[t])==null?void 0:f[e.id],s=P=>Object.fromEntries(Ta.map(A=>[A,m(P+r.normal()*12,-100,100)])),o=(P,A,C,b,N,R,u)=>({id:`${e.id}-party-${P}`,country:e.id,name:A,abbreviation:C,ideology:b,cohesion:r.float(55,92),popularity:30,color:N,seats:n?{[n.id]:R}:{},treasury:0,memberCount:0,status:u?a?"government":"ruling":"outside",platform:s(b),founded:0});if(i!=null&&i.parties.length){const P=(n==null?void 0:n.seats)??i.parties.reduce((b,N)=>b+N.seats,0),A=i.parties.reduce((b,N)=>b+N.seats,0)||1;return i.parties.map((b,N)=>{const R=o(N,b.name,b.abbr,b.ideology,b.colour,Math.round(b.seats/A*P),b.ruling);return R.popularity=b.seats/A*100,R})}const c=e.rulingParty;if(!a){const P=c??(e.government==="absolute-monarchy"?"Royal Court":e.government==="military-junta"?"Armed Forces":e.government==="theocracy"?"Clerical Establishment":e.overlord?"Colonial Administration":"Ruling Establishment"),A=o(0,P,En(P),e.ideology,"#7f1d1d",(n==null?void 0:n.seats)??0,!0);return A.popularity=60,[A]}const l=(n==null?void 0:n.seats)??100,p=Math.round(l*r.float(.5,.64)),h=o(0,c??"Governing Bloc",En(c??"Governing Bloc"),e.ideology,"#2563eb",p,!0),y=o(1,"Opposition Bloc","OPP",m(e.ideology+(e.ideology>=0?-28:28),-100,100),"#c0392b",l-p,!1);return h.popularity=p/l*100,y.popularity=100-h.popularity,[h,y]}function En(e){const a=e.replace(/[^A-Za-z\s]/g,"").split(/\s+/).filter(n=>n.length>2||/^[A-Z]+$/.test(n));return a.length?a.length===1?a[0].slice(0,4).toUpperCase():a.slice(0,4).map(n=>n[0].toUpperCase()).join(""):"GOV"}function hr(e,a,n=0){return{competence:Math.round(m(e.normal()*20+25+n,-100,100)),charisma:Math.round(m(e.normal()*24+15+n,-100,100)),integrity:Math.round(m(e.normal()*28,-100,100)),ambition:Math.round(m(e.normal()*24+30,-100,100)),ideology:Math.round(m(a+e.normal()*8,-100,100)),popularity:Math.round(m(e.normal()*18+48,0,100)),experience:Math.round(m(e.normal()*18+62,0,100)),militancy:Math.round(m(e.normal()*24,-100,100))}}function ht(e,a,n){const t=e.startDate.year,r={id:a,name:n,government:"parliamentary-republic",ideology:0,bloc:"none",popM:10,gdpB:10*ma[t].frontierPc*.4/1e3,hos:"Interim President",hog:"Interim Prime Minister",lands:[]},i=[],s={year:t,startDate:e.startDate};return{country:pt(r,s,ma[t],new $e(e.seed^a.length),i,e),characters:i}}function pt(e,a,n,t,r,i){var O;const s=a.year,{pop:o,gdp:c}=_o(e,s),l=or(e.id,e,s,n,o,c,t),p=He(e.government)&&!e.overlord,h=e.status==="dominion"&&He(e.government),y=(O=lt[s])==null?void 0:O[e.id],f=sr(e,o,y,p||h),P=dr(e,p||h,f,s,t),A=P.find(U=>U.status!=="outside")??P[0],C=bn[e.government]??bn["parliamentary-republic"],b=(U,F,w,he=12)=>{const ue={id:`ch-${e.id}-${r.length}`,name:F,country:e.id,role:U,partyId:w,stats:hr(t,e.ideology,he),historical:!0,createdAt:0};return r.push(ue),ue},N=b("head-of-state",e.hos||"Vacant",A==null?void 0:A.id,18),R=!e.hog&&(e.government==="presidential-republic"||e.government==="federal-republic"||e.government==="confederation"),u=e.hog?b("head-of-government",e.hog,A==null?void 0:A.id,16):R?N:void 0;A&&(A.leaderId=(u??N).id);const d=Ta.map(U=>({id:U,title:Ko[U],partyId:A==null?void 0:A.id,characterId:void 0})),g=y==null?void 0:y.cabinet,S=(U,F)=>{if(!F)return;const w=d.find(he=>he.id===U);w&&(w.characterId=b("minister",F,A==null?void 0:A.id,10).id)};S("economy",g==null?void 0:g.economy),S("foreign-policy",g==null?void 0:g.foreign),S("defence",g==null?void 0:g.defence),g!=null&&g.centralBank&&b("central-banker",g.centralBank,void 0,18);const B=f?{chambers:[f],membership:{[f.id]:[]},committees:[],session:1,activeBills:[]}:void 0,M=rr(e.id,e.government,s,o,c*1e9,l.budget.defence,t),L=Qo(e,i),k=Se[e.id],$=ur(e.id,a.year)??Ui(e.id),Y=((y==null?void 0:y.termYears)??4)*365,Q=y==null?void 0:y.nextElectionYear,Z=Date.UTC(a.startDate.year,a.startDate.month-1,a.startDate.day),ce=p||h?Q&&Date.UTC(Q,10,5)>Z?(Date.UTC(Q,10,5)-Z)/1e3:t.float(.15,1)*Y*86400:void 0,oe=R&&(p||h),de=e.id==="USA"?Vo[s]:void 0,q=oe?de?(Date.UTC(de,10,5)-Z)/1e3:t.float(.2,1)*1825*86400:void 0;return{id:e.id,iso2:(k==null?void 0:k.iso2)??"",isoNumeric:(k==null?void 0:k.numeric)??"",name:e.name,demonym:e.name,continent:(k==null?void 0:k.continent)??"Europe",region:(k==null?void 0:k.region)??pr(e.lands),mapColor:$,government:e.government,headOfStateTitle:e.hosTitle??C.hos,headOfGovernmentTitle:e.hogTitle??C.hog,legislature:B,executive:{headOfStateId:N.id,headOfStateTitle:e.hosTitle??C.hos,headOfGovernmentId:u==null?void 0:u.id,headOfGovernmentTitle:e.hogTitle??C.hog,ministers:d,coalition:P.filter(U=>U.status!=="outside").map(U=>U.id),approval:m(t.float(38,62),5,95),confidence:60,emergencyPowers:!1},parties:P,courts:[],referendums:[],elections:[],military:M,economy:l,relations:{},alliances:[],wars:[],dependencies:{},overlord:e.overlord,ideology:e.ideology,bloc:e.bloc,cohesion:t.float(50,90),unrestRisk:.02,unrest:[],flagEmoji:"",nukes:M.nuclearArsenal??0,sanctions:[],policies:Object.fromEntries(Ta.map(U=>[U,m(e.ideology+t.normal()*10,-100,100)])),lands:e.lands,lat:L.lat,lon:L.lon,nextElectionAt:ce,electionTermDays:Y,nextPresidentialAt:q,tradeBarriers:{},rulingPartyName:e.rulingParty}}function pr(e){for(const a of e)if(Se[a])return Se[a].region;return"europe"}const Gn={PHL_REB:"First Philippine Republic",COL_REB:"Liberal Rebels",MEX_REB:"Constitutionalists",CHN_REB:"Anti-Chiang Coalition",LBY_REB:"Senussi Resistance",MLY_REB:"Malayan National Liberation Army",AFG_REB:"Afghan Insurgents",LBR_REB:"National Patriotic Front",ETH_REB:"Eritrean and Tigrayan Fronts",IRQ_REB:"Iraqi Insurgents",SOM_REB:"Al-Shabaab",SYR_REB:"Syrian Opposition",YEM_REB:"Houthi Movement",SDN_REB:"Rapid Support Forces",MMR_REB:"Resistance Forces"},Ca={1930:e=>["USA","DEU","CAN","AUS","ARG","BRA","POL","AUT","CSK","CHL"].includes(e)?{shock:-.14,decay:.3}:e==="USS"?null:{shock:-.05,decay:.35},2010:e=>["GRC","ESP","PRT","IRL","ITA"].includes(e)?{shock:-.03,decay:.6}:null,2020:()=>({shock:-.1,decay:1.6})};function La(e,a,n,t,r){var f,P,A,C,b,N;const i=new $e(e.params.seed),s=e.year,o=ma[s],c=Oo[s];if(!c||!o)throw new Error(`No historical data for ${s}`);const l={id:n,name:a,scenarioId:e.id,seed:e.params.seed,t:0,epoch:e.epoch,startDate:e.startDate,daysPerSecond:e.daysPerSecond,paused:!0,speed:1,params:{...e.params},countries:{},parties:{},characters:{},companies:{},exchanges:{},markets:{exchanges:[],sentiment:"neutral",riskAppetite:((f=e.overrides.global)==null?void 0:f.riskAppetite)??50,creditSpreads:s<=1930?.02:.012,commodityPrices:{...Li,...(P=e.overrides.global)==null?void 0:P.commodityPrices}},wars:{},treaties:{},sanctions:{},bills:{},events:[],ticker:[],globals:{globalGdp:0,globalPopulation:0,globalInflation:0,worldHappiness:55,worldConflictIndex:0,coldWarIndex:0},directives:[],scenarioOverrides:JSON.parse(JSON.stringify(e.overrides)),customCountries:{},createdAt:t,updatedAt:t,version:1,playerCountry:r,control:Zo(c.polities),regions:c.regions.map(R=>({...R})),commodityMarkets:{},dayCount:0},p=[];for(const R of c.polities){const u=pt(R,e,o,i,p,l),d=(A=Ca[s])==null?void 0:A.call(Ca,R.id);d&&(u.economy.macro.shock=d.shock,u.economy.macro.shockDecay=d.decay),l.countries[u.id]=u;for(const g of u.parties)l.parties[g.id]=g}for(const R of p)l.characters[R.id]=R;for(const R of c.polities){if(!R.overlord)continue;const u=l.countries[R.overlord],d=l.countries[R.id];if(!u||!d)continue;u.dependencies[R.id]=R.status??"colony";const g=R.status==="dominion"?8:R.status==="occupation"?-8:14;d.mapColor=cr(u.mapColor,g),R.status!=="dominion"&&R.status!=="occupation"&&(d.bloc=u.bloc)}yr(l,i),gr(l,i);const h={nyse:["USA"],nasdaq:["USA"],lse:["GBR"],euronext:["FRA","NLD"],dax:["DEU"],nikkei:["JPN"],sse:["CHN"],twse:["TWN"],hkg:["HKG","CHN"],krx:["KOR"],nse:["IND","RAJ"],b3:["BRA"],tsx:["CAN"],asx:["AUS","AUC"],jse:["ZAF","CPC"],bmv:["MEX"],sgx:["SGP"],tadawul:["SAU"],moex:["RUS","USS"],idx:["IDN"],set:["THA"]},y={nyse:1817,nasdaq:1971,lse:1801,euronext:1826,dax:1885,nikkei:1878,sse:1990,twse:1961,hkg:1891,krx:1956,nse:1875,b3:1890,tsx:1861,asx:1871,jse:1887,bmv:1894,sgx:1973,tadawul:2007,moex:1995,idx:1977,set:1975};for(const R of Oi){if((y[R.id]??0)>s)continue;const u=(h[R.id]??[R.country]).find(g=>l.countries[g]);if(!u)continue;const d={id:R.id,name:R.name,country:u,index:1e3,indexYearAgo:1e3,listings:[],volatility:m(i.float(10,28),2,80),breadth:50,marketCap:0,currency:R.currency};l.exchanges[d.id]=d,l.markets.exchanges.push(d)}for(const R of ji(s)){if(!l.countries[R.country])continue;const u=yt(R,l,i,e);l.companies[u.id]=u,u.listed&&u.exchangeId&&l.exchanges[u.exchangeId]?(l.exchanges[u.exchangeId].listings.push(u.id),l.exchanges[u.exchangeId].marketCap+=u.valuation):u.listed&&!u.exchangeId&&(u.listed=!1)}for(const[R,u]of Object.entries(l.markets.commodityPrices))l.commodityMarkets[R]={supply:1,demand:1,trend:u,inventory:.25};for(const R of Zi[s]??[]){const u={},d={};for(const[S,B]of Object.entries(R.belligerents)){const M=B.filter(L=>l.countries[L]);if(Gn[S]){const L=l.countries[S.split("_")[0]];u[S]={id:S,name:S==="LBY_REB"&&s>=2e3?"Libyan National Army":Gn[S],strength:Math.round(((L==null?void 0:L.military.activeDuty)??3e4)*i.float(.25,.7))},d[S]=M}else l.countries[S]&&(d[S]=M)}if(Object.keys(d).length<2)continue;const g={id:`war-${Oa(R.name)}`,name:R.name,startedAt:R.startedAt,phase:R.phase,belligerents:d,cause:R.cause,fronts:R.fronts.map((S,B)=>({...S,...Yi[R.name],id:`front-${B}`,contestedOutput:0,openedAt:0,attritionRate:4e-4})),exhaustion:{...R.exhaustion},casualties:{...R.casualties},materiel:{},warGoal:R.warGoal??"",publicSupport:Object.fromEntries(Object.keys(d).map(S=>[S,i.float(40,70)])),rebels:u};l.wars[g.id]=g;for(const[S,B]of Object.entries(d)){(C=l.countries[S])==null||C.wars.push(g.id);for(const M of B)(b=l.countries[M])!=null&&b.wars.includes(g.id)||(N=l.countries[M])==null||N.wars.push(g.id)}}for(const R of zi[s]??[]){const u=R.parties.filter(S=>l.countries[S]);if(u.length<2)continue;const d={id:`treaty-${Oa(R.name)}`,name:R.name,kind:R.kind,parties:u,signedAt:-86400,terms:R.terms,tradeBonus:R.tradeBonus??0,favourability:Object.fromEntries(u.map(S=>[S,i.float(20,60)])),active:!0};l.treaties[d.id]=d;const g=R.kind==="alliance"||R.kind==="defensive-pact"||R.kind==="entente";for(const S of u)for(const B of u){if(S===B)continue;const M=l.countries[S];M.relations[B]=m((M.relations[B]??0)+(g?42:14),-100,100),g&&!M.alliances.includes(B)&&M.alliances.push(B)}}return je(l),G(l,{kind:"system",severity:"notice",title:`${e.name}: ${e.startDate.year}`,body:`${Object.keys(l.countries).length} polities and ${Object.keys(l.companies).length} corporations.`,tags:["system"]}),l}function yr(e,a){const n=Object.keys(e.countries);for(const t of n){const r=e.countries[t];for(const i of n){if(t===i)continue;const s=e.countries[i];let o=0;r.bloc===s.bloc&&r.bloc!=="none"&&r.bloc!=="non-aligned"?o+=28:r.bloc!=="none"&&s.bloc!=="none"&&r.bloc!=="non-aligned"&&s.bloc!=="non-aligned"&&(o-=12),r.region===s.region&&(o+=6),(r.overlord===i||s.overlord===t||r.overlord&&r.overlord===s.overlord)&&(o+=30),Math.hypot((r.lat??0)-(s.lat??0),(r.lon??0)-(s.lon??0))<12&&(o-=6),o-=Math.abs(r.ideology-s.ideology)/100*26,r.relations[i]=Math.round(m(o+a.normal()*8,-100,100))}}}function gr(e,a){const n=Object.keys(e.countries);for(const t of n){const r=e.countries[t],i=[];for(const p of n){if(t===p)continue;const h=e.countries[p],y=Math.max(4,Math.hypot((r.lat??0)-(h.lat??0),(r.lon??0)-(h.lon??0))),f=r.overlord===p||h.overlord===t?12:r.overlord&&r.overlord===h.overlord?4:1,P=.5+((r.relations[p]??0)+100)/200;i.push({id:p,v:h.economy.gdp*f*P*a.float(.8,1.2)/y**1.5})}i.sort((p,h)=>h.v-p.v);const s=i.slice(0,12),o=s.reduce((p,h)=>p+h.v,0)||1,c=r.economy.trade,l=c.exports+c.imports;for(const p of s)c.flows[p.id]=p.v/o*l;c.exportPartners=s.map(p=>p.id),c.importPartners=s.map(p=>p.id)}}function yt(e,a,n,t){var A,C;const r=Ae[e.sector],i=a.countries[e.country],s=r.margin*n.float(.7,1.3),o=e.revenue*n.float(.1,.6),c=o*(i.economy.macro.bondYield+.01),l=(e.revenue*s-c)*(1-i.economy.tax.corporate),p=m(1/Math.max(.03,i.economy.macro.bondYield+.035)+r.techIntensity*18,6,45),h=Math.max(e.revenue*.15,l*p),y=((A=i.economy.sectors.find(b=>b.id===e.sector))==null?void 0:A.output)??e.revenue,f=e.listed?e.exchange&&a.exchanges[e.exchange]?e.exchange:(C=Object.values(a.exchanges).find(b=>b.country===e.country))==null?void 0:C.id:void 0,P=m(h/1e7,4,400);return{id:`co-${Oa(e.name)}`,name:e.name,country:e.country,sector:e.sector,tier:h>1e12?"mega-cap":h>2e11?"large":h>2e10?"mid-cap":"small",valuation:h,revenue:e.revenue,costs:e.revenue*(1-s),profit:e.revenue*s,employees:e.employees,debt:o,stateOwnership:e.stateOwnership??0,brandValue:h*.15,sharePrice:P,sharePriceYearAgo:P,board:[],shareholders:[],ownershipFloat:1-(e.stateOwnership??0),listed:!!f,exchangeId:f,founded:((e.foundedYear??t.year-10)-t.year)*365*86400,researchLevel:m(r.techIntensity*n.float(.5,1),0,1),unionisation:n.float(.05,.5),rd:e.revenue*r.techIntensity*.08,environmentalScore:n.float(-40,60),lobbyingPower:m((Math.log10(Math.max(10,h))-7)*16,0,100),dailyVolume:0,shares:h/P,netIncome:l,marketShare:m(e.revenue/Math.max(1,y),0,1),pe:p,playerShares:0}}function Oa(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}function je(e){let a=0,n=0,t=0,r=0,i=0;for(const c of Object.values(e.countries))c.annexedBy||(a+=c.economy.gdp,n+=c.economy.population,t+=m(c.economy.monetary.inflation,-.5,1)*c.economy.gdp,r+=(c.economy.labour.satisfaction*100*.5+c.executive.approval*.5)*c.economy.gdp);for(const c of Object.values(e.wars))c.endedAt||(i+=Object.keys(c.belligerents).length);e.globals.globalGdp=a,e.globals.globalPopulation=n,e.globals.globalInflation=a>0?t/a:0,e.globals.worldHappiness=a>0?r/a:0,e.globals.worldConflictIndex=z(i/30)*100;const s=e.countries.USA,o=e.countries.USS??e.countries.RUS??e.countries.CHN;s&&o&&(e.globals.coldWarIndex=m(50-(s.relations[o.id]??0),0,100))}function G(e,a){const n={id:`ev-${e.dayCount}-${e.events.length}-${Math.round(e.t)}`,t:e.t,at:Date.now(),country:a.country,kind:a.kind,severity:a.severity,title:a.title,body:a.body,actors:a.actors??(a.country?[a.country]:[]),byUserId:a.byUserId,tags:a.tags??[]};return e.events.push(n),e.events.length>600&&e.events.splice(0,e.events.length-600),e.ticker.unshift({t:e.t,text:a.title,kind:a.kind,country:a.country}),e.ticker.length>120&&(e.ticker.length=120),n}const gt={manufacturing:[{input:"mining",ratio:.3},{input:"agriculture",ratio:.15},{input:"energy",ratio:.1}],construction:[{input:"mining",ratio:.3},{input:"manufacturing",ratio:.15}],energy:[{input:"mining",ratio:.5}],utilities:[{input:"energy",ratio:.3},{input:"manufacturing",ratio:.05}],transport:[{input:"energy",ratio:.25},{input:"manufacturing",ratio:.1}],retail:[{input:"manufacturing",ratio:.4},{input:"agriculture",ratio:.2},{input:"transport",ratio:.05}],technology:[{input:"manufacturing",ratio:.25}],healthcare:[{input:"manufacturing",ratio:.1}],media:[{input:"manufacturing",ratio:.05}],defence:[{input:"mining",ratio:.2},{input:"manufacturing",ratio:.2}],telecom:[{input:"manufacturing",ratio:.15}],tourism:[{input:"transport",ratio:.1}]},Bn={early:["Bessemer","Whitworth","Arkwright","Lowell","Hanseatic","Lombard","Corn Exchange","Tredegar","Soho","Cromford","Ravensworth","Boulton"],victorian:["North Western","Imperial","Consolidated","Midland","Clyde","Victoria","Union","Lancashire","Elswick","Barrow","Glasgow","Tyneside","Severn"],interwar:["Vulcan","Atlas","Reichs","Societe Generale","United","Meridian","Continental","Krupp","Skoda","Fiat","Renault","Vickers","Brown Boveri"],postwar:["National","Federated","General","Associated","Central","Continental"],modern:["Atlas","Meridian","Crescent","Northfield","Vanguard","Kestrel","Pioneer","Highland","Riverton","Bastion"]},Dn={mining:"Collieries",manufacturing:"Ironworks",retail:"Traders",transport:"Shipping",finance:"Bank",energy:"Power",utilities:"Gas & Water",construction:"Builders",agriculture:"Estates",technology:"Electric",media:"Press",defence:"Armaments",healthcare:"Chemicals",tourism:"Hotels",telecom:"Telegraph","real-estate":"Properties",education:"Institute"};function fr(e){return e<1860?"early":e<1914?"victorian":e<1945?"interwar":e<1980?"postwar":"modern"}function ft(e){const a=new Map;for(const n of Object.values(e.companies)){const t=a.get(n.country);t?t.push(n):a.set(n.country,[n])}return a}function Ar(e,a,n,t,r={}){const i=e.countries[a];if(!i||!Ae[n])return null;const s=Bn[fr(e.startDate.year)]??Bn.modern,o=r.name??`${s[Math.floor(t.float(0,s.length))%s.length]} ${Dn[n]??Ae[n].label}`,c=new Set(Object.values(e.companies).map(y=>y.name)),l=["& Sons","Brothers","Holdings","& Co","Partners","Trust","Werke","et Cie","of London","of Vienna","Consolidated","Union"];let p=o;if(c.has(p)){const y=l.find(f=>!c.has(`${o} ${f}`));if(y)p=`${o} ${y}`;else for(let f=0;f<24;f+=1){const P=`${s[Math.floor(t.float(0,s.length))%s.length]} ${Dn[n]??Ae[n].label}`;if(!c.has(P)){p=P;break}}}const h=yt({name:p,country:i.id,sector:n,revenue:r.revenue??Math.max(1e6,i.economy.gdp*8e-4),employees:Math.max(50,Math.round(i.economy.population*200)),stateOwnership:r.stateShare??0,listed:!1,foundedYear:e.startDate.year},e,t,{year:e.startDate.year});return h.founded=e.t,e.companies[h.id]=h,h}function Sr(e,a){var r;const n=z(e.params.firmFormation??.03),t=ft(e);for(const i of Object.values(e.countries)){if(i.annexedBy||i.overlord||(((r=t.get(i.id))==null?void 0:r.length)??0)>=30)continue;const o=i.economy.labour.unemployment,c=z(.45+i.economy.gdpGrowth*6-Math.max(0,o-.06)*3);if(!a.chance(n*c*(e.params.eventRate??1)))continue;const l=i.economy.sectors.filter(h=>h.id!=="defence"&&h.capacity>h.output);if(!l.length)continue;const p=a.weighted(l,h=>Math.max(.05,h.capacity-h.output));Ar(e,i.id,p.id,a)}}const ye=365*86400,Je=7/365,Pr={agriculture:.45,mining:.8,manufacturing:.95,energy:.9,utilities:.9,construction:1.1,transport:1.05,retail:1,finance:1.3,"real-estate":1.05,telecom:1.35,technology:1.7,healthcare:1.35,education:1.15,defence:.6,tourism:1.4,media:1.1},Rr={agriculture:.3,mining:.4,manufacturing:1,energy:.3,utilities:.2,construction:.8,transport:.7,retail:1,finance:.6,"real-estate":.5,telecom:.6,technology:1.2,healthcare:.2,education:.3,defence:.1,tourism:1.4,media:.8},br={working:{agriculture:.3,energy:.1,utilities:.06,"real-estate":.2,retail:.15,transport:.08,healthcare:.05,manufacturing:.06},middle:{agriculture:.14,energy:.07,utilities:.04,"real-estate":.24,retail:.17,transport:.08,healthcare:.08,manufacturing:.08,education:.04,technology:.03,tourism:.03},wealthy:{agriculture:.07,energy:.04,utilities:.02,"real-estate":.28,retail:.14,transport:.05,healthcare:.08,manufacturing:.06,education:.05,technology:.06,finance:.08,tourism:.07}},Mr={defence:"defence",healthcare:"health",education:"education",construction:"infrastructure"};function vr(e,a){var p;Ur(e,a);const n=e.countries.USA,t=(n==null?void 0:n.economy.monetary.policyRate)??.03,r=(n==null?void 0:n.economy.monetary.inflation)??.02,i=((p=e.countries.DEU)==null?void 0:p.economy.monetary.policyRate)??.02,s=ft(e),o={},c={},l={};for(const[h,y]of s){let f=0;const P=new Map,A=new Map;for(const C of y)if(!(C.insolvent||C.founded<0)){f+=C.revenue*.35,P.set(C.sector,(P.get(C.sector)??0)+C.revenue);for(const b of gt[C.sector]??[])A.set(b.input,(A.get(b.input)??0)+C.revenue*b.ratio)}o[h]=f,c[h]=P,l[h]=A}for(const h of Object.values(e.countries))h.annexedBy||(Cr(e,h,a,t,r,i,o[h.id]??0),kr(e,h,c[h.id],l[h.id]),Tr(h));Lr(e,a),Or(e,a),xr(e,a),je(e)}function Cr(e,a,n,t,r,i,s=0){var pn,yn,gn,fn;const o=a.economy,c=o.macro,l=o.fiscal,p=e.params,h=Je,y=o.centralBank,f=o.tax,P=o.budget,A=o.gdp,C=wa(e),b=m(o.gdpPerCapita/Math.max(1,C),.003,1.4),N=z(1-o.corruption),R=c.baseBudget,u=(K,X,vi,An)=>m(vi*(K/Math.max(1e-4,X)-1),-An,An),d=u(P.education,R.education,.014,.02)+u(P.science,R.science,.014,.022)+u(P.infrastructure,R.infrastructure,.012,.016)+(((pn=a.tech)==null?void 0:pn.industry)??0)*.004,g=m(-Math.log(b)*.006*N*N*1.4,0,.035),S=o.sectors.reduce((K,X)=>K+X.regulation*X.share,0),B=o.sectors.reduce((K,X)=>K+X.stateOwnership*X.share,0)*.004,M=$r(e,a),L=sa(e,a)*p.sanctionBite*.025,k=Er(e);c.tfpGrowth=k*.65+g+d-o.corruption*p.corruptionDrag*.02-o.inequality*p.inequalityDrag*.012-(S-.3)*.01-B-L-M*.5;const $=o.population,Y=f.income+f.payroll,Q=m(.42+b*.12+(e.startDate.year>=1990?.04:0)-Math.max(0,Y-.3)*.12+o.labour.satisfaction*.02,.32,.72);o.labour.participation=V(o.labour.participation,Q,.1*h);const Z=m(.034-b*.03-o.labour.participation*.02,.001,.05),ce=m(.026-P.health*.22-N*.004+M*.4,.004,.05);c.popGrowth=V(c.popGrowth,m(Z-ce,-.03,.045),.15*h);const oe=m(c.popGrowth-M*.15+(a.policies.immigration??0)*5e-5,-.05,.05);o.population=Math.max(1e3,$*Math.exp(oe*h));const q=o.accounts.investment/Math.max(1e-6,c.priceLevel)/Math.max(1,c.capital)-.06;c.capital=Math.max(1,c.capital*Math.exp(m(q,-.15,.08)*h));const O=.015+Math.max(0,1-b)*.045;c.potentialGrowth=m(c.tfpGrowth+.35*q+.65*oe,-.15,Math.min(.06,O))*p.growthBias,c.potential*=Math.exp(c.potentialGrowth*h),c.neutralRate=m(.4*Math.max(0,c.potentialGrowth)+.008,.002,.05);const U=o.monetary.inflation,F=c.neutralRate+y.target+1.5*(U-y.target)+.35*c.outputGap;let w;switch(y.regime){case"union":w=a.id==="DEU"?F:i;break;case"peg":w=a.id==="USA"?F:t+Math.max(0,.02-o.reserves/Math.max(1,o.accounts.imports)*.05)+o.corruption*.02;break;case"gold":w=.02+Math.max(0,.05-o.reserves/Math.max(1,o.gdp))*.2+o.corruption*.02;break;case"command":w=a.id===e.playerCountry?o.monetary.centralBankRate:F;break;default:w=y.independent||a.id!==e.playerCountry?F-(y.independent?0:.005):o.monetary.centralBankRate}a.id===e.playerCountry&&!y.independent&&y.regime!=="union"&&(w=o.monetary.centralBankRate),w=m(w,-.01,40);const he=p.policyRateSmoothing*18*h+(Math.abs(w-o.monetary.policyRate)>.1?.1:0);o.monetary.policyRate=V(o.monetary.policyRate,w,he),(y.independent||y.regime!=="float")&&(o.monetary.centralBankRate=o.monetary.policyRate);const ue=Math.max(1,c.realGdp*c.priceLevel/o.monetary.exchangeRateVsUsd),Ge=l.debt/ue,ie=-l.budgetBalanceRatio,Ie=kn[a.id]??0;c.riskPremium=m(Math.max(0,Ge-.6)*.0055*(1+Ge)*(1-z(Ie*40))*(1.4-z(b))+Math.max(0,ie-.03)*.25+Math.max(0,U-.08)*.35+o.corruption*.035+e.markets.creditSpreads*.2+sa(e,a)*.01+(c.defaulted?.08:0)-Ie,-.01,.9),c.bondYield=m(Math.max(0,.5*o.monetary.policyRate+.5*(c.neutralRate+c.expectedInflation))+.008+c.riskPremium-y.qe*.01,0,40),c.debtCost=V(c.debtCost,c.bondYield,h/6),l.creditRating=m(.95-c.riskPremium*7,.02,.99),o.debtRatingScore=l.creditRating*100,e.markets.creditSpreads=e.markets.creditSpreads||.01;const be=o.monetary.policyRate-c.expectedInflation,Ue=c.bondYield-c.expectedInflation,x=-.45*(.5*(be-c.neutralRate)+.5*(Ue-c.neutralRate-.012)),J=p.fiscalMultiplier*.45*(ie-c.deficitAnchor);c.deficitAnchor=V(c.deficitAnchor,ie,.3*h);const te=m((c.credit/Math.max(.05,aa(e,a))-1)*.04,-.03,.03),se=Math.max(0,c.npl-.08)*-.25,Le=(c.consumerConfidence-50)/50*.008+(c.businessConfidence-50)/50*.008,Me=(e.markets.riskAppetite-50)/50*.008,ve=Gr(e,a)*m(c.openness*.45,0,.6),xt=-c.realExchange*m(c.openness*.18,0,.3),Sa=e.markets.commodityPrices.oil/Math.max(1e-6,((yn=e.commodityMarkets.oil)==null?void 0:yn.trend)??1),Qa=Tn(o.sectors,"mining")+Tn(o.sectors,"energy")*.5,Ht=(Sa-1)*(Qa-.06)*.15,Ft=M>0?Math.min(.03,P.defence*.1):0,Kt=-Math.max(0,f.tariff-.08)*m(c.openness,0,1)*.08;c.shock*=Math.exp(-c.shockDecay*h);const $t=m(x+J+te+se+Le+Me+ve+xt+Ht+Ft+Kt+c.shock-M*.8-L*1.2,-.45,.15),Jt=(e.params.marketVolatility*.0035+Math.min(.006,o.corruption*.004))*Math.sqrt(h);c.outputGap=m(c.outputGap+3.2*($t-c.outputGap)*h+n.normal()*Jt*2.6,-.55,.2),c.realGdp=Math.max(1,c.potential*(1+c.outputGap));const Wt=p.phillipsSensitivity,en=y.printing*Math.max(0,ie)*7,Vt=m((c.credit/Math.max(.05,aa(e,a))-1)*.02,-.01,.04),wt=m((c.lastDepreciation??0)-c.expectedInflation*.5,-.5,20)*m(c.openness*.3,.03,.4),jt=m(Sa-1,-.6,2)*.012,Yt=m(e.markets.commodityPrices.wheat/Math.max(1e-6,((gn=e.commodityMarkets.wheat)==null?void 0:gn.trend)??1)-1,-.6,2)*.008,Zt=Math.max(0,f.tariff-.05)*m(c.openness,0,1)*.04,zt=M>0?Math.min(.02,M*.4):0,qt=c.expectedInflation+Wt*c.outputGap+wt+jt+Yt+Zt+en+Vt+zt;o.monetary.inflation=m(o.monetary.inflation+3.5*(qt-o.monetary.inflation)*h+n.normal()*.012*Math.sqrt(h)*(1+Math.abs(U)*3),-.2,30);const an=y.regime==="peg"||y.regime==="gold"||y.regime==="union",Xt=y.regime==="gold"?0:an?r:y.target,nn=an?Math.max(y.credibility,.85):y.credibility,_t=nn*Xt+(1-nn)*o.monetary.inflation;c.expectedInflation=V(c.expectedInflation,_t,1.1*h);const Qt=m((y.independent?.85:.45)+(y.regime==="gold"||y.regime==="union"?.1:0)-Math.abs(o.monetary.inflation-y.target)*2.5-y.printing*.9-o.corruption*.15,.01,.97);y.credibility=V(y.credibility,Qt,.5*h),c.priceLevel*=Math.exp(m(o.monetary.inflation,-.5,80)*h),o.monetary.currencyConfidence=V(o.monetary.currencyConfidence,m(70+c.realExchange*-10-Math.max(0,U-.05)*80-c.riskPremium*150,1,99),.5*h),o.monetary.moneySupply*=Math.exp(m(o.monetary.inflation+c.potentialGrowth+en,-.3,40)*h);const ae=Math.max(1,c.realGdp*c.priceLevel/o.monetary.exchangeRateVsUsd);o.gdp=ae+s,o.gdpPerCapita=ae/Math.max(1,o.population),o.productivity=m(o.productivity+c.tfpGrowth*30*h,1,100),c.realHistory.push(c.realGdp),c.priceHistory.push(c.priceLevel),c.realHistory.length>53&&c.realHistory.shift(),c.priceHistory.length>53&&c.priceHistory.shift();const Ce=c.realHistory;if(Ce.length>=53)o.gdpGrowth=m(Ce[Ce.length-1]/Ce[0]-1,-.7,.6);else{const K=Ce.length>8?Math.pow(Ce[Ce.length-1]/Ce[0],52/(Ce.length-1))-1:o.gdpGrowth;o.gdpGrowth=m(V(o.gdpGrowth,K,.03),-.7,.6)}o.nominalGrowth=(1+o.gdpGrowth)*(1+o.monetary.inflation)/Math.exp(m(c.lastDepreciation??0,-.5,10))-1;const tn=o.labour.unionisation,ei=P.welfare/Math.max(.005,R.welfare),ai=m(Nr(e,a)+Math.max(0,c.minimumWage-.55)*.12+Math.max(0,tn-.4)*.02+Math.max(0,ei-1)*.008+S*.01-u(P.education,R.education,.004,.01),.012,.3);c.nairu=V(c.nairu,ai,.08*h);const ni=m(c.nairu-p.okunSensitivity*c.outputGap,.005,.6);o.labour.unemployment=m(o.labour.unemployment+2.2*(ni-o.labour.unemployment)*h,.005,.6);const ti=c.expectedInflation+Math.max(-.02,c.tfpGrowth)+.35*(c.nairu-o.labour.unemployment)+p.wagePush*.02*tn,on=m(V(o.labour.wageGrowth,ti,1.2*h),-.3,60);o.labour.wageGrowth=on,o.labour.medianWage=Math.max(1,o.labour.medianWage*Math.exp(on*h)),o.labour.medianWage=V(o.labour.medianWage,o.gdpPerCapita*.74*(1-(o.inequality-.35)*.3),.4*h),o.labour.unionisation=z(o.labour.unionisation+(a.policies.labour??0)*2e-5*h*52);const Ne=c.potential*c.priceLevel/o.monetary.exchangeRateVsUsd,ii=o.accounts.consumption*(ae/Math.max(1,A)),oi=((fn=o.sectors.find(K=>K.id==="mining"))==null?void 0:fn.output)??0,We=dt(f,ae,ii,o.accounts.imports,oi,o.corruption);l.taxIncome=We.income+We.payroll,l.corporateTax=We.corporate,l.vat=We.vat,l.tariffs=We.tariff,l.resourceRent=We.royalty,l.revenue=l.taxIncome+l.corporateTax+l.vat+l.tariffs+l.resourceRent;const ri=Math.max(0,o.labour.unemployment-c.nairu)*ae*.25*m(P.welfare/Math.max(.01,.1),.05,1.3);l.military=P.defence*Ne,l.welfare=P.welfare*Ne+ri,l.healthcare=P.health*Ne,l.education=P.education*Ne,l.infrastructure=P.infrastructure*Ne,l.administration=P.administration*Ne;const Pa=P.science*Ne,si=P.subsidies*Ne+o.sectors.reduce((K,X)=>K+X.stateSubsidy*X.output,0),ci=a.wars.length?Math.min(.2,.02*a.wars.length)*Ne:0,li=Math.min(Math.max(0,c.debtCost),.18);l.debtService=l.debt*li;const ui=l.military+l.welfare+l.healthcare+l.education+l.infrastructure+l.administration+Pa+si+ci;l.expenditure=ui+l.debtService;const Xe=l.revenue-l.expenditure;l.budgetBalanceRatio=m(Xe/ae,-.8,.6);const mi=Xe<0?-Xe*y.printing:0;l.debt=Math.max(0,l.debt+(-Xe-mi)*h),l.debtToGdp=l.debt/ae,l.treasury=V(l.treasury,ae*.02,.2*h)+Xe*.01*h,o.rd=Pa+ae*.004+o.sectors.reduce((K,X)=>K+X.output*Ae[X.id].techIntensity*.01,0);const Ra=2.2+(kn[a.id]??0)*300;!c.defaulted&&(l.debtToGdp>Ra||c.bondYield>.35&&l.debtService>l.revenue*.5)&&Br(e,a,n),c.defaulted&&l.debtToGdp>Ra*1.6&&(o.fiscal.debt*=.5,l.debtToGdp=l.debt/ae),c.defaulted&&l.debtToGdp<Ra&&c.riskPremium<.12&&n.chance(h*1.2)&&(c.defaulted=!1);const di=a.tradeBarriers?Object.values(a.tradeBarriers).reduce((K,X)=>K+X,0):0,hi=M>0?.8:1,Oe=m(c.openness*(1-Math.max(0,f.tariff-.05)*.7)*(1-Math.min(.5,di*.04))*(1-Math.min(.6,sa(e,a)*.3))*hi,.01,2.5),rn=m(c.structuralTradeBalance-c.realExchange*Oe*.5-c.outputGap*Oe*.5+(Sa-1)*(Qa-.06)*.25,-Oe*.8,Oe*.8);o.accounts.exports=ae*(Oe+rn)/2,o.accounts.imports=ae*(Oe-rn)/2;const me=o.trade;me.exports=o.accounts.exports,me.imports=o.accounts.imports,me.tradeBalance=me.exports-me.imports,me.tradeOpenness=Oe*100,me.tariffRate=f.tariff;const pi=(me.exports+me.imports)/Math.max(1,Object.values(me.flows).reduce((K,X)=>K+X,0));for(const K of Object.keys(me.flows))me.flows[K]*=pi;const yi=o.netForeignAssets*.02;c.currentAccount=me.tradeBalance+yi,o.netForeignAssets+=c.currentAccount*h;const sn=o.monetary.inflation-r,cn=o.monetary.policyRate-o.monetary.inflation-(t-r);let Ve=0;if(y.regime==="float"||y.regime==="command")Ve=a.id==="USA"?0:m(sn-m(cn*.35,-.08,.08)-c.currentAccount/ae*.25+c.riskPremium*.2+c.realExchange*.6+n.normal()*.35,-.6,40),o.monetary.exchangeRateVsUsd=m(o.monetary.exchangeRateVsUsd*Math.exp(Ve*h),1e-9,1e18),l.debt*=Math.exp(-Ve*h),o.reserves=m(o.reserves+c.currentAccount*.08*h,0,ae*3);else if(y.regime==="union"){const K=e.countries.DEU;K&&(o.monetary.exchangeRateVsUsd=K.economy.monetary.exchangeRateVsUsd),o.reserves=m(o.reserves+c.currentAccount*.02*h,0,ae*3)}else if(o.reserves=Math.max(0,o.reserves+c.currentAccount*h*.85+(cn-c.riskPremium)*ae*.1*h),o.reserves<o.accounts.imports*.08&&n.chance(h*4)){const K=n.float(.15,.4);o.monetary.exchangeRateVsUsd*=1+K,l.debt/=1+K,Ve=K/h,o.reserves=o.accounts.imports*.3,(e.startDate.year>=1950||a.id===e.playerCountry)&&G(e,{kind:"economic",severity:"major",country:a.id,title:`${a.name} devalues its currency`,body:`Reserves ran out defending the ${y.regime==="gold"?"gold parity":"peg"}. The currency falls ${(K*100).toFixed(0)}%.`,tags:["crisis","currency"]}),y.regime==="gold"&&(y.regime="float")}if(c.lastDepreciation=Ve,o.monetary.exchangeRateVsUsd>1e6||c.priceLevel>1e6){const K=Math.max(o.monetary.exchangeRateVsUsd,c.priceLevel,1);o.monetary.exchangeRateVsUsd/=K,c.priceLevel/=K,c.priceHistory=c.priceHistory.map(X=>X/K);for(const X of o.households)X.costOfLiving/=K;(a.id===e.playerCountry||o.gdp/Math.max(1,e.globals.globalGdp)>.003)&&G(e,{kind:"economic",severity:"notice",country:a.id,title:`${a.name} introduces a new currency`,body:"Zeros are knocked off the old money. Nothing real has changed.",tags:["currency"]})}c.realExchange=m((c.realExchange+(sn-Ve)*h)*(1-.12*h),-1.2,1.2);const gi=.015+o.gdpGrowth*.8-1.4*(be-c.neutralRate)+(e.markets.riskAppetite-50)/50*.03+(c.credit<aa(e,a)?.015:-.015);c.credit=m(c.credit*Math.exp(m(gi-o.nominalGrowth*.5,-.3,.3)*h),.02,4);const fi=m(.025+Math.max(0,-c.outputGap)*.6+Math.max(0,c.credit/aa(e,a)-1.15)*.1+Math.max(0,be-.05)*.2,.01,.5);c.npl=V(c.npl,fi,.9*h),c.npl>.13&&n.chance(h*.9*e.params.eventRate)&&Dr(e,a),c.housePrice=m(c.housePrice*Math.exp(m(o.monetary.inflation+c.outputGap*.6-(be-c.neutralRate)*1.8+(c.housePrice>170?-.03:0),-.25,3)*h),10,1e7),c.consumerConfidence=V(c.consumerConfidence,m(52+c.outputGap*320-(o.labour.unemployment-c.nairu)*380-Math.max(0,o.monetary.inflation-.04)*130-M*180,2,98),1.4*h),c.businessConfidence=V(c.businessConfidence,m(52+c.outputGap*340-(c.bondYield-.04)*90-Math.max(0,f.corporate-.3)*80+(e.markets.riskAppetite-50)/50*15-M*120,2,98),1.4*h);const Ai=l.military+l.healthcare+l.education+l.infrastructure+l.administration+Pa,Si=.14+m(b,0,1)*.06+Math.max(0,c.potentialGrowth)*1.2,Pi=m(Si+.5*c.outputGap-.55*(Ue-c.neutralRate)+(c.businessConfidence-50)/50*.03-Math.max(0,f.corporate-.25)*.1+o.sectors.reduce((K,X)=>K+X.stateOwnership*X.share,0)*.06,.03,.48),ln=ae*Pi,un=o.accounts.exports,mn=o.accounts.imports,dn=ae-ln-Ai-un+mn,Ri=ae*.28,hn=Math.max(Ri,dn);o.accounts.consumption=hn,o.accounts.investment=Math.max(ae*.015,ln-(hn-dn)),o.accounts.government=ae-o.accounts.consumption-o.accounts.investment-un+mn;const bi=a.policies.justice??0;o.corruption=z(o.corruption+(p.corruptionRate*2-(bi+40)*5e-5-P.administration*.01)*h);const Mi=m(.42-P.welfare*.6-f.income*.12-o.labour.unionisation*.06-c.minimumWage*.03+o.corruption*.1+(e.startDate.year<1950?.08:0),.18,.75);o.inequality=V(o.inequality,Mi,.06*h)}const kn={USA:.012,DEU:.006,CHE:.008,JPN:.008,GBR:.003,FRA:.002,NLD:.003,CHN:.003};function Nr(e,a){const n=e.startDate.year,t=Math.min(1,a.economy.gdpPerCapita/Math.max(1,wa(e)));return m((n<1950||n<1990?.035:.045)+(1-t)*.035+a.economy.corruption*.02,.015,.2)}function Er(e){const a=e.startDate.year,n=e.t/ye,t=a+n;return t<1920?.012:t<1945?.014:t<1975?.026:t<2005?.018:.014}let Qe={v:1,at:-1};function wa(e){if(Qe.at===e.dayCount&&Qe.v>1)return Qe.v;let a=0;for(const n of Object.values(e.countries))n.annexedBy||n.economy.population<2e7||n.economy.gdpPerCapita>a&&(a=n.economy.gdpPerCapita);return Qe={v:a||1,at:e.dayCount},Qe.v}function aa(e,a){const n=e.startDate.year;return(n<1950?.55:n<1990?.45:n<2010?.75:.95)*m(.4+a.economy.gdpPerCapita/Math.max(1,wa(e)),.3,1.7)}function Tn(e,a){var n;return((n=e.find(t=>t.id===a))==null?void 0:n.share)??0}function Gr(e,a){var i;const n=a.economy.trade.flows;let t=0,r=0;for(const[s,o]of Object.entries(n)){const c=e.countries[s];if(!c||c.annexedBy)continue;const l=((i=a.tradeBarriers)==null?void 0:i[s])??0;t+=c.economy.macro.outputGap*o*(1-z(l)),r+=o}return r>0?t/r:0}function Br(e,a,n){const t=a.economy,r=t.macro;r.defaulted=!0;const i=n.float(.25,.55);t.fiscal.debt*=1-i,r.shock-=.07,r.shockDecay=.8,r.npl+=.05,t.monetary.exchangeRateVsUsd*=1.3,r.expectedInflation+=.04,t.fiscal.debt/=1.3,a.executive.approval=m(a.executive.approval-14,0,100),a.cohesion=m(a.cohesion-8,0,100),G(e,{kind:"economic",severity:"catastrophic",country:a.id,title:`${a.name} defaults on its sovereign debt`,body:`Markets stopped rolling the paper. Creditors take a ${(i*100).toFixed(0)}% haircut and the economy is thrown into recession.`,tags:["crisis","debt"]})}function Dr(e,a){const n=a.economy,t=n.macro;t.shock-=.045,t.shockDecay=.7,t.credit*=.86,t.npl*=.7,n.fiscal.debt+=n.gdp*.04,e.markets.riskAppetite=m(e.markets.riskAppetite-n.gdp/Math.max(1,e.globals.globalGdp)*60,2,100),G(e,{kind:"economic",severity:"major",country:a.id,title:`Banking crisis in ${a.name}`,body:`Bad loans hit ${(t.npl*143).toFixed(0)}% of lending. The state recapitalises the banks at a cost of ${4 .toFixed(0)}% of GDP.`,tags:["crisis","banks"]})}function kr(e,a,n,t){var N,R,u;const r=a.economy,i=r.macro,s=Je,o=i.realHistory.length>=2?Math.log(i.realHistory[i.realHistory.length-1]/i.realHistory[i.realHistory.length-2])/s:0,c=i.popGrowth,l=r.sectors.reduce((d,g)=>d+g.price*g.share,0)||1,p=o-c,h=i.potentialGrowth,y=e.markets.commodityPrices.oil/Math.max(1e-6,((N=e.commodityMarkets.oil)==null?void 0:N.trend)??1),f=e.markets.commodityPrices.wheat/Math.max(1e-6,((R=e.commodityMarkets.wheat)==null?void 0:R.trend)??1),P=e.markets.commodityPrices.copper/Math.max(1e-6,((u=e.commodityMarkets.copper)==null?void 0:u.trend)??1);let A=0;for(const d of r.sectors){const g=Ae[d.id],S=d.price/l;let B=c+Pr[d.id]*p;const M=Mr[d.id];M&&(B+=m((r.budget[M]/Math.max(1e-4,i.baseBudget[M])-1)*.25,-.15,.25)),d.id==="defence"&&a.wars.length&&(B+=.05),d.id==="tourism"&&(B+=(i.shock<-.03?-.4:0)+(a.wars.length?-.15:0)),(d.id==="construction"||d.id==="real-estate")&&(B+=-(i.bondYield-i.expectedInflation-i.neutralRate-.012)*1.2),d.id==="finance"&&(B+=(i.credit/Math.max(.05,aa(e,a))-1)*.1);const L=m(((t==null?void 0:t.get(d.id))??0)/Math.max(1,d.output),0,.6),k=d.quantity*Math.exp(B*s-Rr[d.id]*Math.log(Math.max(.05,S))*.04*s)*(1+L),$=(g.growth*.4+i.tfpGrowth*.4)*(.5+g.techIntensity*.9)+d.stateSubsidy*.05-(d.regulation-.3)*.012-d.stateOwnership*.004,Y=m((d.margin-g.margin)*.8+(d.quantity/Math.max(1,d.capacity)-.95)*.5,-.05,.08);d.capacity=Math.max(1,d.capacity*Math.exp((h*.8+$*.35+Y)*s));const Q=Math.min(k,d.capacity*1.06),Z=Math.log(Math.max(1e-6,k)/Math.max(1e-6,d.capacity)),ce=(d.id==="agriculture"?(f-1)*.15:0)+(d.id==="mining"?(P-1)*.15:0)+(d.id==="energy"||d.id==="utilities"?(y-1)*.2:(y-1)*g.commodityExposure*.03),oe=d.concentration*.004-d.stateSubsidy*.2,de=m(.4*Z+ce+oe+(r.labour.wageGrowth-r.monetary.inflation-$)*g.labourIntensity*.05+r.monetary.inflation,-.4,60);d.price=m(d.price*Math.exp((de-r.monetary.inflation)*s),.02,50);const q=Math.log(Math.max(1e-6,Q)/Math.max(1e-6,d.quantity))/s;d.growth=V(d.growth,m(q,-.6,.6),.08),d.quantity=Math.max(1,Q),d.output=d.quantity*d.price*i.priceLevel,A+=d.output+((n==null?void 0:n.get(d.id))??0);const O=m(g.margin*(.7+d.concentration*.7)+Z*.15-(d.regulation-.3)*.05-Math.max(0,i.minimumWage-.5)*g.labourIntensity*.04+d.stateSubsidy*.3,-.25,.65);d.margin=V(d.margin,O,.8*s)}const C=r.population*r.labour.participation*(1-r.labour.unemployment);let b=0;for(const d of r.sectors)d.share=(d.output+((n==null?void 0:n.get(d.id))??0))/Math.max(1,A),b+=d.share*Ae[d.id].labourIntensity*(d.id==="agriculture"?2:1);for(const d of r.sectors)d.employment=Math.round(C*d.share*Ae[d.id].labourIntensity*(d.id==="agriculture"?2:1)/Math.max(1e-6,b)),d.output=d.share*r.gdp,d.productivity=d.employment>0?d.output/d.employment:0,d.wage=d.employment>0?d.output*m(1-d.margin-.15,.2,.85)/d.employment:0,i.minimumWage>0&&(d.wage=Math.max(d.wage,r.labour.medianWage*i.minimumWage))}function Tr(e){const a=e.economy,n=a.macro,t=Je,r=mt(a.inequality),i=a.gdp*(1-a.tax.income*.8-a.tax.payroll)*.72,s=a.fiscal.welfare,o=l=>{var p;return(((p=a.sectors.find(h=>h.id===l))==null?void 0:p.price)??1)*n.priceLevel};let c=0;for(const l of a.households){const p=br[l.id];let h=0,y=0;for(const[d,g]of Object.entries(p))y+=o(d)*g,h+=g;const f=y/Math.max(1e-6,h),P=l.id==="working"?.65:l.id==="middle"?.3:.05,A=l.id==="working"?a.labour.unemployment*.5:l.id==="middle"?a.labour.unemployment*.2:0,C=(i*r[l.id]*(1-A)+s*P)/Math.max(1,a.population*l.popShare),b=l.realIncome;l.incomeShare=r[l.id],l.income=C,l.costOfLiving=f,l.realIncome=C*a.monetary.exchangeRateVsUsd/Math.max(1e-6,f),l.savingsRate=m((l.id==="working"?.02:l.id==="middle"?.1:.3)+(n.bondYield-.04)*.3-(n.consumerConfidence-50)*.001,-.05,.6);const N=Math.log(Math.max(1e-6,l.realIncome)/Math.max(1e-6,b))/t,R=Math.max(0,a.monetary.inflation-.03)*(l.id==="working"?1.5:l.id==="middle"?1:.4),u=m(.58+m(N,-.6,.6)*.45-a.labour.unemployment*(l.id==="working"?1.3:.7)-R+(l.id==="working"?a.budget.welfare*.5:0)-Math.max(0,a.tax.vat-.15)*(l.id==="working"?.4:.15),.03,.97);l.satisfaction=V(l.satisfaction,u,1.3*t),c+=l.satisfaction*l.popShare}a.labour.satisfaction=c,a.labour.strikeRisk=z((1-c)*.3*(.4+a.labour.unionisation)+Math.max(0,a.monetary.inflation-a.labour.wageGrowth)*.6)}const Ir={oil:{sector:"energy",beta:.55,gamma:.12},"natural-gas":{sector:"energy",beta:.6,gamma:.12},coal:{sector:"energy",beta:.3,gamma:.1},uranium:{sector:"energy",beta:.3,gamma:.06},copper:{sector:"manufacturing",beta:.9,gamma:.1},"iron-ore":{sector:"construction",beta:.9,gamma:.12},aluminium:{sector:"manufacturing",beta:.8,gamma:.1},lithium:{sector:"technology",beta:1.4,gamma:.2},wheat:{sector:"agriculture",beta:.25,gamma:.25},coffee:{sector:"agriculture",beta:.35,gamma:.2},gold:{sector:"finance",beta:-.2,gamma:.02},silver:{sector:"manufacturing",beta:.3,gamma:.04}};function Ur(e,a){var l;const n=Je;let t=0,r=0,i=0;for(const p of Object.values(e.countries)){if(p.annexedBy)continue;t+=m(p.economy.gdpGrowth,-.2,.2)*p.economy.gdp,r+=p.economy.gdp;const h=((l=p.economy.sectors.find(y=>y.id==="mining"))==null?void 0:l.output)??0;(p.wars.length||p.sanctions.length)&&(i+=h)}const s=r>0?t/r:.02,o=r>0?m(i/r*4,0,.3):0,c=m(e.globals.globalInflation,-.05,.12);for(const[p,h]of Object.entries(e.markets.commodityPrices)){const y=e.commodityMarkets[p]??(e.commodityMarkets[p]={supply:1,demand:1,trend:h,inventory:.25}),f=Ir[p]??{beta:.5,gamma:.1};y.trend*=Math.exp(m(c,-.1,.2)*n);const P=h/Math.max(1e-9,y.trend);y.demand*=Math.exp((s*f.beta-f.gamma*Math.log(Math.max(.05,P)))*n),y.supply*=Math.exp((s*f.beta+.12*Math.log(Math.max(.05,P))+.15*(y.demand/Math.max(.01,y.supply)-1)-o*.2*(p==="oil"||p==="natural-gas"?1:.3))*n),y.inventory=m(y.inventory+(y.supply-y.demand)*n,.03,1);const A=Math.log(Math.max(.05,y.demand)/Math.max(.05,y.supply))+(.25-y.inventory)*.4,C=p==="gold"?(50-e.markets.riskAppetite)/50*.08:0,b=m(c+A*.9+(y.trend/Math.max(1e-9,h)-1)*.35+C,-1,1.2),N=(p==="gold"?.12:.26)*Math.sqrt(n);e.markets.commodityPrices[p]=Math.max(h*.2,h*Math.exp(b*n+a.normal()*N))}}function Lr(e,a){const n=Je;for(const t of Object.values(e.companies)){if(t.insolvent)continue;const r=e.countries[t.country];if(!r)continue;const i=r.economy,s=i.sectors.find(B=>B.id===t.sector);if(!s)continue;const o=Ae[t.sector],c=i.nominalGrowth*.5+s.growth*.6,l=m(Math.log10(Math.max(1e7,t.revenue))/12,0,.7),p=(e.globals.globalInflation+.025)*l,h=(t.researchLevel-o.techIntensity*.7)*.05,y=sa(e,r)*o.sanctionExposure*.08;let f=0;for(const B of gt[t.sector]??[]){const M=i.sectors.find(k=>k.id===B.input);if(!M)continue;const L=m((M.quantity/Math.max(1,M.capacity)-.95)/.05,0,1);f+=L*B.ratio}const P=c*(1-l)+p+h-y-f*1.5+a.normal()*.09*Math.sqrt(n)/n*.05;t.revenue=Math.max(1e4,t.revenue*Math.exp(m(P,-1,2)*n)),t.marketShare=m(t.revenue/Math.max(1,s.output),0,1);const A=m(s.margin+(t.researchLevel-.3)*.05+t.brandValue/Math.max(1,t.valuation)*.01,-.3,.6);t.profit=t.revenue*A,t.costs=t.revenue-t.profit;const C=t.debt*(i.macro.bondYield+e.markets.creditSpreads),b=(t.profit-C)*(1-(t.profit-C>0?i.tax.corporate:0));t.netIncome=b,t.debt=Math.max(0,t.debt+(-b*(b<0?1:.2)+t.revenue*.02)*n),t.rd=t.revenue*m(o.techIntensity*.1+t.researchLevel*.02,.001,.2),t.researchLevel=z(t.researchLevel+(t.rd/Math.max(1,t.revenue)-.03)*.5*n);const N=m(i.macro.tfpGrowth+o.techIntensity*.02,-.05,.1);t.employees=Math.max(1,t.employees*Math.exp(m(P-i.monetary.inflation-N,-.4,.4)*n));const R=.03+(50-e.markets.riskAppetite)*9e-4,u=Math.max(.025,i.macro.bondYield+R-Math.max(0,i.monetary.inflation)*.5),d=m(o.techIntensity*.025+P*.04,-.01,.03);t.pe=m(1/Math.max(.015,u-d),3,30);const g=Math.min(t.revenue*10,Math.max(t.revenue*.12,Math.max(b,t.revenue*.01)*t.pe)),S=a.normal()*e.params.marketVolatility*.12*Math.sqrt(n);if(t.valuation=Math.max(1e5,t.valuation*Math.exp(.7*Math.log(g/Math.max(1,t.valuation))*n+S)),t.sharePrice=Math.max(.01,t.valuation/Math.max(1,t.shares??1)),t.tier=t.valuation>1e12?"mega-cap":t.valuation>2e11?"large":t.valuation>2e10?"mid-cap":"small",t.dailyVolume=Math.round(t.valuation/Math.max(.01,t.sharePrice)*.003),b<-t.revenue*.02&&t.debt>t.revenue*4.5&&t.stateOwnership<.5&&a.chance(n*.25)){const B=Math.round(t.employees);t.insolvent=!0,t.listed=!1;for(const M of e.markets.exchanges)M.listings=M.listings.filter(L=>L!==t.id);i.macro.npl=m(i.macro.npl+t.debt/Math.max(1,i.gdp)*.5,0,.6),G(e,{kind:"corporate",severity:"major",country:t.country,title:`${t.name} goes bankrupt`,body:`Debts of ${(t.debt/1e9).toFixed(1)}B could not be serviced. ${B.toLocaleString("en-US")} jobs are at risk.`,tags:["corporate","insolvency"]})}}}function Or(e,a){const n=Je;for(const t of e.markets.exchanges){let r=0;for(const f of t.listings){const P=e.companies[f];P&&!P.insolvent&&(r+=P.valuation)}const i=e.countries[t.country],s=(i==null?void 0:i.economy.nominalGrowth)??.03,o=((i==null?void 0:i.economy.macro.bondYield)??.04)-((i==null?void 0:i.economy.macro.neutralRate)??.01)-Math.max(0,(i==null?void 0:i.economy.macro.expectedInflation)??.02),c=t.marketCap||r,l=r>0&&c>0?Math.log(r/c):(s-o*.3)*n;t.marketCap=r;const p=(e.markets.riskAppetite-50)/50*.04*n;t.index=Math.max(5,t.index*Math.exp(m(l,-.35,.35)+p+a.normal()*e.params.marketVolatility*.012*Math.sqrt(n))),t.volatility=V(t.volatility,m(16+(50-e.markets.riskAppetite)*.5+e.params.marketVolatility*4,5,90),2*n);let h=0,y=0;for(const f of t.listings){const P=e.companies[f];P&&(y++,P.sharePrice>=P.sharePriceYearAgo&&h++)}t.breadth=y?h/y*100:50}}function xr(e,a){const n=Je,t=e.params;let r=0,i=0,s=0,o=0;for(const y of Object.values(e.countries))y.annexedBy||(r+=y.economy.gdpGrowth*y.economy.gdp,i+=y.economy.macro.outputGap*y.economy.gdp,o+=y.economy.fiscal.creditRating*y.economy.gdp,s+=y.economy.gdp);const c=s>0?r/s:.02,l=s>0?i/s:0,p=s>0?o/s:.7,h=m(35+p*22+l*260+c*200-e.globals.worldConflictIndex*.1,3,95);if(e.markets.riskAppetite=V(e.markets.riskAppetite,h,1.3*n)+a.normal()*2*Math.sqrt(n),e.markets.riskAppetite=m(e.markets.riskAppetite,1,99),e.markets.creditSpreads=V(e.markets.creditSpreads,m(.006+(1-p)*.05+Math.max(0,-l)*.25+(50-e.markets.riskAppetite)*3e-4,.002,.3),2*n),e.markets.sentiment=Kr(e.markets.riskAppetite),a.chance(Math.min(.0015,t.crashProbability*t.eventRate))){const y=a.float(.72,.9);e.markets.lastCrashAt=e.t,e.markets.riskAppetite=Math.max(3,e.markets.riskAppetite*.55);for(const f of e.markets.exchanges)f.index*=y;for(const f of Object.values(e.companies))f.valuation*=y;for(const f of Object.values(e.countries)){const P=m(f.economy.macro.credit*.5,.1,1)*m(f.economy.macro.openness,.2,1);f.economy.macro.shock-=(1-y)*.12*P}G(e,{kind:"economic",severity:"catastrophic",title:"Global market crash",body:`Equities fall about ${((1-y)*100).toFixed(0)}% across every exchange. Risk appetite has collapsed.`,tags:["crisis","markets"]})}}function Hr(e){for(const a of e.markets.exchanges)a.indexYearAgo=a.index;for(const a of Object.values(e.companies)){a.sharePriceYearAgo=a.sharePrice;const n=(t,r)=>[...t??[],r].slice(-40);a.priceHistory=n(a.priceHistory,a.sharePrice),a.revenueHistory=n(a.revenueHistory,a.revenue),a.valuationHistory=n(a.valuationHistory,a.valuation)}for(const a of Object.values(e.countries))a.annexedBy||a.id===e.playerCountry||(Fr(a,e.startDate.year+e.t/ye),a.economy.monetary.inflation>.4&&At(e,a))}function At(e,a){const n=a.economy,t=n.macro,r=n.centralBank;r.printing=0,r.credibility=Math.max(r.credibility,.7),t.expectedInflation=Math.max(r.target,Math.min(t.expectedInflation*.15,.25)),n.monetary.inflation=Math.max(t.expectedInflation,n.monetary.inflation*.25),n.monetary.policyRate=Math.min(n.monetary.policyRate,t.expectedInflation+.1),n.monetary.centralBankRate=n.monetary.policyRate,t.lastDepreciation=0,t.shock-=.03,t.shockDecay=1;for(const i of["subsidies","administration","defence"])n.budget[i]*=.92;G(e,{kind:"economic",severity:"major",country:a.id,title:`${a.name} launches a stabilisation plan`,body:"A new monetary framework and budget cuts aim to break inflation. A short recession is the price.",tags:["monetary"]})}function Fr(e,a){const n=e.economy,t=n.macro,r=-n.fiscal.budgetBalanceRatio,i=n.budget,s=n.tax,o=a<1945?.005:a<1970?.015:.03,c=m((r-o)*1.6+(n.fiscal.debtToGdp>.9?.05:0)+(t.riskPremium>.05?.1:0),-.08,.25),l=t.outputGap<-.03?.04:0,p=c-l;if(Math.abs(p)>.004){const h=e.ideology<-10,y=1-m(p*(h?.4:.8),-.08,.1);i.defence*=y,i.administration*=y,i.subsidies*=y,i.infrastructure*=y,i.welfare*=1-m(p*(h?.15:.5),-.05,.06);const f=1+m(p*(h?.9:.4),-.05,.08);s.income=m(s.income*f,0,.6),s.vat=m(s.vat*f,0,.27),s.corporate=m(s.corporate*f,0,.5)}e.wars.length&&(i.defence=Math.min(.2,i.defence*1.08)),n.monetary.inflation>.25&&n.centralBank.printing>0&&(n.centralBank.printing*=.6)}function Kr(e){return e<18?"crash":e<36?"bearish":e<62?"neutral":e<82?"bullish":"euphoric"}function sa(e,a){let n=0;for(const t of a.sanctions){const r=e.sanctions[t];r&&(n+=r.scope/100*(1-r.evasion*.6))}return m(n,0,4)}function $r(e,a){let n=0;for(const t of a.wars){const r=e.wars[t];if(!r||r.endedAt)continue;const i=Object.prototype.hasOwnProperty.call(r.belligerents,a.id);n+=(i?.03:.006)*(1+(r.exhaustion[a.id]??0)/100);for(const s of r.fronts){const o=s.belligerents.indexOf(a.id);if(o<0)continue;const c=o===0?-s.control:s.control;n+=.0012*Math.max(0,c+20)*.1}}return m(n,0,.3)}const ja=7*86400,In={europe:{first:"Anna Marco Elena Jan Sofia Lukas Clara Pierre Ingrid Tomas Maria Henrik Lucia Pavel Claire Stefan".split(" "),last:"Novak Keller Moreau Rossi Lindqvist Kowalski Berg Dubois Weber Costa Hansen Fischer Laurent Marin Vogel Popescu".split(" ")},americas:{first:"Maria Carlos John Ana Luis Sarah Diego Laura Miguel James Camila Robert Elena Daniel Isabel Andres".split(" "),last:"Silva Garcia Johnson Rodriguez Martinez Santos Walker Herrera Campbell Torres Morales Clarke Vargas Reyes Mendes Ortega".split(" ")},asia:{first:"Wei Mei Hiro Yuki Arjun Priya Min Linh Budi Siti Ravi Ananya Jun Hana Tuan Dewi".split(" "),last:"Chen Tanaka Sharma Nguyen Kim Wang Singh Sato Lee Rao Liu Park Suzuki Tran Patel Lin".split(" ")},"middle-east":{first:"Omar Layla Hassan Fatima Yusuf Amira Karim Noor Tariq Zainab Samir Dalia Ali Rania Faisal Mona".split(" "),last:"Haddad Rahman Al-Sayed Khalil Nasser Aziz Farah Mansour Saleh Darwish Hamdan Karimi Yilmaz Demir Rashid Amin".split(" ")},africa:{first:"Amina Kwame Fatou Emeka Zanele Moussa Aisha Thabo Grace Ibrahim Wanjiru Samuel Nia Abdou Thandi Joseph".split(" "),last:"Okafor Diallo Mensah Ndlovu Kamau Traore Osei Abebe Sow Banda Keita Mwangi Toure Nkosi Adeyemi Moyo".split(" ")},oceania:{first:"Jack Olivia Tama Mere Liam Grace Sione Emma Noah Ana Ethan Lani Finn Ruby Kai Tui".split(" "),last:"Smith Taylor Tui Wilson Brown Fonua Walker Ngata Campbell Tamati Young Thompson Vaka Reid Clark Hale".split(" ")}};function Jr(e,a){const n=In[e.region]??In.europe;return`${a.pick(n.first)} ${a.pick(n.last)}`}function St(e,a,n,t){const r=`ch-${a.id}-gen-${e.dayCount}-${Math.round(t.next()*1e6)}`,i=a.parties.find(o=>o.id===n),s={id:r,name:Jr(a,t),country:a.id,role:"head-of-government",partyId:n,stats:{competence:Math.round(t.normal()*20+22),charisma:Math.round(t.normal()*22+18),integrity:Math.round(t.normal()*28),ambition:Math.round(t.normal()*22+30),ideology:Math.round(m(((i==null?void 0:i.ideology)??a.ideology)+t.normal()*8,-100,100)),popularity:Math.round(m(t.normal()*16+52,0,100)),experience:Math.round(m(t.normal()*18+55,0,100)),militancy:Math.round(t.normal()*22)},createdAt:e.t};return e.characters[r]=s,s}function Wr(e,a,n,t){const r=e.countries[a];if(!(r!=null&&r.legislature))return null;const i=`bill-${r.id}-${e.dayCount}-${Object.keys(e.bills).length}`,s={...n,id:i,country:a,status:"introduced",votes:[],tallies:{},introducedAt:e.t,expiresAt:e.t+45*86400};return r.legislature.activeBills.push(i),e.bills[i]=s,G(e,{kind:"political",severity:"info",country:a,title:`${r.name}: ${s.title} introduced`,body:s.summary,byUserId:t,tags:["legislation"]}),s}function Vr(e,a,n,t,r){const i=wr(a.policy),s=1-Math.min(1,Math.abs(n-i)/110),o=(a.publicOpinion-50)/200;return t?m(.72+r/100*a.whipStrength*.26+(s-.5)*.3+o,.2,1):m(.05+s*.3+o-r/100*.1+(e.executive.approval-50)/400,0,.75)}function wr(e){var n,t,r,i,s;if(!e)return 0;let a=0;return((n=e.tax)==null?void 0:n.income)!==void 0&&(a+=0),e.minimumWage!==void 0&&(a-=15),((t=e.budget)==null?void 0:t.welfare)!==void 0&&(a-=10),((r=e.budget)==null?void 0:r.defence)!==void 0&&(a+=12),((i=e.sector)==null?void 0:i.regulation)!==void 0&&(a-=8),((s=e.sector)==null?void 0:s.stateOwnership)!==void 0&&(a-=20),m(a,-60,60)}function jr(e,a){for(const t of Object.keys(e.bills)){const r=e.bills[t];if(r.status==="enacted"||r.status==="rejected"||r.status==="expired")continue;const i=e.countries[r.country];if(!(i!=null&&i.legislature)){r.status="expired";continue}const s=(e.t-r.introducedAt)/86400;if(s<21){r.status=s<7?"introduced":"in-committee";continue}const o=i.legislature.chambers.find(h=>h.id===r.chamberId)??i.legislature.chambers[0];let c=0,l=0,p=0;for(const h of i.parties){const y=h.seats[o.id]??0;if(!y)continue;const f=z(Vr(i,r,h.ideology,i.executive.coalition.includes(h.id),h.cohesion)+a.normal()*.05),P=Math.round(y*f),A=Math.round((y-P)*.08);c+=P,p+=A,l+=y-P-A}r.tallies[o.id]={aye:c,nay:l,abstain:p,absent:0},i.legislature.activeBills=i.legislature.activeBills.filter(h=>h!==r.id),c>l?(r.status="enacted",r.enactedAt=e.t,r.policy&&Pt(i,r.policy),i.executive.approval=m(i.executive.approval+(r.publicOpinion-50)*.08,0,100),G(e,{kind:"legal",severity:"notice",country:i.id,title:`${i.name}: ${r.title} passes ${c}-${l}`,body:r.summary,tags:["legislation","enacted"]})):(r.status="rejected",i.executive.confidence=m(i.executive.confidence-6,0,100),G(e,{kind:"political",severity:"major",country:i.id,title:`${i.name}: ${r.title} defeated ${c}-${l}`,body:`The ${o.name} rejects the government's package.`,tags:["legislation"]}))}const n=Object.values(e.bills).filter(t=>t.status==="enacted"||t.status==="rejected"||t.status==="expired");if(n.length>120){n.sort((t,r)=>t.introducedAt-r.introducedAt);for(const t of n.slice(0,n.length-120))delete e.bills[t.id]}}function Pt(e,a){const n=e.economy;if(a.tax&&Object.assign(n.tax,a.tax),a.budget&&Object.assign(n.budget,a.budget),a.minimumWage!==void 0&&(n.macro.minimumWage=m(a.minimumWage,0,1)),a.centralBankIndependent!==void 0&&(n.centralBank.independent=a.centralBankIndependent),a.sector){const t=n.sectors.find(r=>r.id===a.sector.id);t&&(a.sector.subsidy!==void 0&&(t.stateSubsidy=m(a.sector.subsidy,0,.5)),a.sector.regulation!==void 0&&(t.regulation=z(a.sector.regulation)),a.sector.stateOwnership!==void 0&&(t.stateOwnership=z(a.sector.stateOwnership)))}}function Yr(e){return!Ia(e.government)&&!!e.legislature&&!e.executive.emergencyPowers}function Zr(e,a){const n=e.economy,t=n.macro,r=ja/ye,i=m(46+(n.labour.satisfaction-.55)*70+t.outputGap*120-Math.max(0,n.labour.unemployment-t.nairu)*110-Math.max(0,n.monetary.inflation-.04)*70+m(n.gdpGrowth,-.1,.1)*80-n.corruption*8-(e.wars.length?4:0)-(t.defaulted?12:0),2,96),s=He(e.government)?i:m(i*.5+34,12,95);e.executive.approval=m(V(e.executive.approval,s,1.6*r)+a.normal()*.45,0,100);const o=60-e.unrest.length*6+(e.executive.approval-50)*.5;e.executive.confidence=V(e.executive.confidence,m(o,3,97),1.2*r),e.cohesion=V(e.cohesion,m(70-n.inequality*40+(e.executive.approval-50)*.3,8,98),.2*r)}function zr(e,a){var p;const n=ja/ye,t=(p=e.legislature)==null?void 0:p.chambers[0],r=e.parties.filter(h=>e.executive.coalition.includes(h.id)),i=e.parties.filter(h=>!e.executive.coalition.includes(h.id));if(!r.length||!i.length||!He(e.government))return;const s=t&&e.parties.reduce((h,y)=>h+(y.seats[t.id]??0),0)||1,o=r.reduce((h,y)=>h+(t?y.seats[t.id]??0:1),0)/(t?s:r.length),c=m(e.executive.approval*.85+9,8,74);for(const h of r){const y=t?(h.seats[t.id]??0)/s/Math.max(.05,o):1/r.length;h.popularity=V(h.popularity,c*y,2*n)+a.normal()*.2}const l=i.reduce((h,y)=>h+(t?y.seats[t.id]??0:1),0)||1;for(const h of i){const y=t?(h.seats[t.id]??0)/l:1/i.length,f=100-c;h.popularity=V(h.popularity,Math.max(.5,f*Math.max(.03,y)),2*n)+a.normal()*.2}for(const h of e.parties)h.popularity=m(h.popularity,.2,90)}function qr(e,a,n){var d;const t=(d=a.legislature)==null?void 0:d.chambers[0];if(a.nextElectionAt=e.t+(a.electionTermDays??1460)*86400,!t)return;const r=e.params.electionChaos,i=a.parties.map(g=>({p:g,vote:Math.max(.1,g.popularity*Math.exp(n.normal()*(.1+r*.6)))})),s=i.reduce((g,S)=>g+S.vote,0);for(const g of i)g.vote=g.vote/s*100;const o=t.election==="fptp",c=i.map(g=>({...g,weight:o?Math.pow(g.vote,1.25):g.vote})),l=c.reduce((g,S)=>g+S.weight,0);let p=0;const h=c.map(g=>{const S=Math.floor(g.weight/l*t.seats);return p+=S,{p:g.p,n:S,vote:g.vote,rem:g.weight/l*t.seats-S}});h.sort((g,S)=>S.rem-g.rem);for(let g=0;p<t.seats;g++,p++)h[g%h.length].n++;for(const g of h)g.p.seats[t.id]=g.n,g.p.popularity=g.vote;const y=[...h].sort((g,S)=>S.n-g.n),f=y[0],P=[f.p.id];let A=f.n;const C=y.slice(1).sort((g,S)=>Math.abs(g.p.ideology-f.p.ideology)-Math.abs(S.p.ideology-f.p.ideology));for(const g of C){if(A>t.seats/2)break;P.push(g.p.id),A+=g.n}const b=y.filter(g=>g.n>0).slice(0,5).map(g=>`${g.p.abbreviation} ${g.n}`).join(", "),N=Rt(e,a);if(a.nextPresidentialAt!==void 0){N&&G(e,{kind:"political",severity:"notice",country:a.id,title:`${a.name}: legislative elections`,body:`The ${t.name} is now ${b}.`,tags:["election"]});return}const R=a.executive.coalition.includes(f.p.id),u=a.executive.coalition[0];a.executive.coalition=P;for(const g of a.parties)g.status=P.includes(g.id)?"government":"outside";if(u!==f.p.id){const g=bt(e,a,f.p.id,n);N&&G(e,{kind:"political",severity:"major",country:a.id,title:`${a.name}: ${g.name} wins power for ${f.p.name}`,body:`The ${t.name} is now ${b}.`,tags:["election"]})}else N&&G(e,{kind:"political",severity:"major",country:a.id,title:`${a.name}: ${f.p.name} ${R?"holds on":"wins"} at the election`,body:`The ${t.name} is now ${b}.`,tags:["election"]})}function Rt(e,a){return a.id===e.playerCountry||a.economy.gdp/Math.max(1,e.globals.globalGdp)>.006}function bt(e,a,n,t){const r=a.parties.find(c=>c.id===n),i=r!=null&&r.leaderId?e.characters[r.leaderId]:void 0,s=i&&!i.removedAt?i:St(e,a,n,t);r&&(r.leaderId=s.id);const o=a.nextPresidentialAt!==void 0||a.executive.headOfGovernmentId===a.executive.headOfStateId;return a.executive.headOfGovernmentId=s.id,o&&(a.executive.headOfStateId=s.id),a.ideology=m(V(a.ideology,(r==null?void 0:r.ideology)??a.ideology,.6),-100,100),a.executive.approval=m(52+t.normal()*4,0,100),s}function Xr(e,a,n){a.nextPresidentialAt=e.t+4*365*86400;const t=a.parties.find(l=>a.executive.coalition.includes(l.id)),r=[...a.parties].filter(l=>!a.executive.coalition.includes(l.id)).sort((l,p)=>p.popularity-l.popularity)[0];if(!t||!r)return;const i=m(a.executive.approval*.8+11+n.normal()*(2+e.params.electionChaos*15),15,85),s=a.executive.headOfStateId?e.characters[a.executive.headOfStateId]:void 0,o=Rt(e,a);if(i>=50){o&&G(e,{kind:"political",severity:"major",country:a.id,title:`${a.name}: ${(s==null?void 0:s.name)??"the president"} is re-elected`,body:`${t.name} holds the presidency with ${i.toFixed(1)}% of the vote.`,tags:["election"]});return}a.executive.coalition=[r.id];for(const l of a.parties)l.status=l.id===r.id?"government":"outside";r.leaderId=void 0;const c=bt(e,a,r.id,n);o&&G(e,{kind:"political",severity:"major",country:a.id,title:`${a.name}: ${c.name} wins the presidency`,body:`${r.name} defeats ${(s==null?void 0:s.name)??"the incumbent"}, taking ${(100-i).toFixed(1)}% of the vote.`,tags:["election"]})}function _r(e,a,n){const t=a.economy,r=ja/ye,i=z((55-a.executive.approval)/55)*.5+t.labour.unemployment*1.2+Math.min(1,Math.max(0,t.monetary.inflation-.1))*.7+t.labour.strikeRisk*.5+(1-a.cohesion/100)*.25;a.unrestRisk=z(.005+i*.1);for(const s of a.unrest)s.intensity=m(s.intensity+(i-.45)*40*r+n.normal()*2,0,100),s.intensity<5&&(s.endedAt=e.t),n.chance(s.intensity*.002)&&(s.fatalities+=Math.round(n.float(1,s.intensity)));if(a.unrest=a.unrest.filter(s=>!s.endedAt||e.t-s.endedAt<60*86400),n.chance(a.unrestRisk*r*2.2*e.params.eventRate)&&a.unrest.filter(s=>!s.endedAt).length<3){const o=i>.75?n.weighted(["riot","strike","rebellion","coup"],p=>p==="coup"?He(a.government)?.2:1.2:p==="rebellion"?1:2.5):n.weighted(["protest","strike","riot"],p=>p==="protest"?4:2);a.unrest.push({id:`unrest-${a.id}-${e.dayCount}`,kind:o,intensity:n.float(15,55),startedAt:e.t,fatalities:0});const c={protest:"mass protests",riot:"rioting",strike:"a general strike",rebellion:"armed rebellion",coup:"an attempted coup"};(t.gdp/Math.max(1,e.globals.globalGdp)>.003||a.id===e.playerCountry||o==="coup"||o==="rebellion")&&G(e,{kind:"social",severity:o==="coup"||o==="rebellion"?"catastrophic":"major",country:a.id,title:`${a.name}: ${c[o]}`,body:es(o,a),tags:["unrest",o]}),t.macro.shock-=o==="coup"||o==="rebellion"?.02:.004,o==="coup"&&n.chance(.35+(50-a.executive.approval)*.008)&&Qr(e,a,n)}}function Qr(e,a,n){const t=St(e,a,void 0,n);t.role="head-of-state";const r=a.executive.headOfStateId?e.characters[a.executive.headOfStateId]:void 0;r&&(r.removedAt=e.t),a.nextPresidentialAt=void 0,a.executive.headOfStateId=t.id,a.executive.headOfGovernmentId=t.id,a.executive.headOfStateTitle="Head of the Junta",a.headOfStateTitle="Head of the Junta",a.government="military-junta",a.executive.coalition=[],a.executive.approval=m(a.executive.approval+10,0,100),a.nextElectionAt=void 0,G(e,{kind:"political",severity:"catastrophic",country:a.id,title:`Coup in ${a.name}`,body:`General ${t.name} has seized power${r?` from ${r.name}`:""}. Parliament is suspended.`,tags:["unrest","coup"]})}function es(e,a){const n=a.economy;switch(e){case"strike":return`Unions walk out with wages lagging prices and unemployment at ${(n.labour.unemployment*100).toFixed(1)}%.`;case"riot":return`Anger at inflation of ${(n.monetary.inflation*100).toFixed(1)}% has turned violent in the cities.`;case"coup":return"Units of the armed forces have moved against the government.";case"rebellion":return"Armed groups have taken control of outlying districts.";default:return`Crowds are out against a government with ${a.executive.approval.toFixed(0)}% approval.`}}function as(e,a){jr(e,a);for(const n of Object.values(e.countries))n.annexedBy||(Zr(n,a),!n.overlord&&(zr(n,a),n.nextElectionAt!==void 0&&e.t>=n.nextElectionAt&&He(n.government)&&qr(e,n,a),n.nextPresidentialAt!==void 0&&e.t>=n.nextPresidentialAt&&He(n.government)&&Xr(e,n,a),_r(e,n,a)))}const Un=["#9b4a4a","#3f6f8f","#7d5a9c","#4f7a4a","#a9762f","#5c6470"];function ns(e){var s;const a=e.economy.fiscal.debt/Math.max(1,e.economy.gdp),n=e.economy.monetary.inflation,t=e.economy.labour.unemployment,r=e.unrest.filter(o=>!o.endedAt).length,i=Math.min(.12,Math.max(0,(((s=e.lands)==null?void 0:s.length)??1)-4)*.018);return z((1-m(e.cohesion,0,100)/100)*.42+Math.max(0,a-.55)*.35+Math.max(0,n-.12)*.9+Math.max(0,t-.12)*.5+Math.max(0,-e.economy.gdpGrowth-.02)*4+r*.06+i)}function ts(e,a){var n;for(const t of Object.values(e.countries)){if(t.annexedBy||t.overlord||(((n=t.lands)==null?void 0:n.length)??0)<3)continue;const r=ns(t);if(!t.crisis&&r<.6)continue;const i=t.crisis??(t.crisis={stage:"pressure",tension:0,since:e.t,lost:[],measures:[],lastEventAt:0});if(i.tension=z(i.tension+(r-.5)*.07+a.normal()*.003),i.tension<.03){delete t.crisis;continue}is(e,t,i)}}function is(e,a,n){var r;const t=n.tension;if(t>=.2&&n.stage==="pressure"&&(n.stage="unrest",ra(e,a,n,"major",`${a.name}: reform pressure`,"Students and workers are on the streets in the capital. The government calls for calm and promises a commission."),xa(a,e,"protest",30)),t>=.45&&n.stage==="unrest"&&(n.stage="armed",ra(e,a,n,"catastrophic",`${a.name}: armed rebellion`,"Armed groups have taken control of outlying districts. Garrisons are defecting in the provinces."),xa(a,e,"rebellion",62),a.unrestRisk=z(a.unrestRisk+.12)),t>=.72&&n.stage==="armed"){n.stage="secession";const i=Mt(a);i&&Ha(e,a,i)&&ra(e,a,n,"catastrophic",`${a.name}: a republic declares independence`,`The government of ${((r=Se[i])==null?void 0:r.name)??i} has declared independence and its militias control the territory.`)}if(t>=.95&&n.stage==="secession"){n.stage="dissolved";for(const i of[...a.lands??[]].slice(1))Ha(e,a,i);ra(e,a,n,"catastrophic",`${a.name} dissolves`,"The union is dissolved. What remains of the central government controls the capital region and little else.")}}function ra(e,a,n,t,r,i){n.lastEventAt=e.t,G(e,{kind:"political",severity:t,country:a.id,title:r,body:i,tags:["collapse","crisis"]})}function xa(e,a,n,t){e.unrest.filter(r=>!r.endedAt).length>=4||e.unrest.push({id:`unrest-${e.id}-collapse-${a.dayCount}-${e.unrest.length}`,kind:n,intensity:t,startedAt:a.t,fatalities:0})}function Mt(e){const a=e.lands??[];for(let n=a.length-1;n>0;n-=1)if(Se[a[n]])return a[n]}function os(e){let a=0;for(let n=0;n<e.length;n+=1)a=a*31+e.charCodeAt(n)|0;return a}function Ha(e,a,n){var c;const t=Se[n],r=a.lands??[];if(!t||r.length<=1||!r.includes(n))return!1;let i=n;for(let l=2;e.countries[i];l+=1)i=`${n}${l}`;const s=1/r.length,o=JSON.parse(JSON.stringify(a));return o.id=i,o.name=t.name,o.formalName=void 0,o.iso2=t.iso2,o.isoNumeric=t.numeric,o.mapColor=Un[Math.abs(os(i))%Un.length],o.lands=[n],o.overlord=void 0,o.annexedBy=void 0,o.occupiedBy=void 0,o.dependencies={},o.alliances=[],o.wars=[],o.crisis=void 0,o.unrest=[],o.unrestRisk=.06,o.cohesion=62,o.executive.approval=58,o.economy.gdp=a.economy.gdp*s,o.economy.population=Math.max(.5,a.economy.population*s),o.economy.gdpPerCapita=o.economy.gdp/o.economy.population,o.economy.fiscal.debt=a.economy.fiscal.debt*s*.5,o.military.activeDuty=Math.max(1e3,a.military.activeDuty*s),e.countries[i]=o,e.customCountries[i]=o,e.control[t.numeric]=i,a.lands=r.filter(l=>l!==n),a.economy.gdp=Math.max(1,a.economy.gdp-o.economy.gdp),a.economy.population=Math.max(.5,a.economy.population-o.economy.population),a.economy.gdpPerCapita=a.economy.gdp/a.economy.population,(c=a.crisis)==null||c.lost.push(n),!0}function rs(e,a,n){var s;const t=a.crisis;if(!t)return{ok:!1,message:"There is no crisis to answer."};const r=Math.max(1,a.economy.gdp);let i="";if(n==="reform")t.tension=z(t.tension-.16),a.cohesion=m(a.cohesion+7,0,100),a.executive.approval=m(a.executive.approval-8,0,100),i="Reform programme announced: the union loosens and the street quietens.";else if(n==="crackdown")a.economy.fiscal.debt+=r*.004,t.tension=z(t.tension-.22),a.cohesion=m(a.cohesion-4,0,100),a.executive.approval=m(a.executive.approval-7,0,100),xa(a,e,"riot",40),i="Security forces clear the streets. It works, for now.";else if(n==="subsidies")a.economy.fiscal.debt+=r*.01,t.tension=z(t.tension-.13),a.executive.approval=m(a.executive.approval+5,0,100),a.cohesion=m(a.cohesion+3,0,100),i="Emergency subsidies paid out of borrowed money.";else if(n==="concede"){const o=Mt(a);if(!o||!Ha(e,a,o))return{ok:!1,message:"There is nothing left to concede."};t.tension=z(t.tension-.4),i=`${((s=Se[o])==null?void 0:s.name)??o} is allowed to leave. The rest holds.`}else return{ok:!1,message:"Unknown measure."};return t.measures.push(n),G(e,{kind:"political",severity:"notice",country:a.id,title:`${a.name}: the government answers`,body:i,tags:["collapse","crisis"]}),t.tension<.05&&(G(e,{kind:"political",severity:"major",country:a.id,title:`${a.name}: the crisis passes`,body:"The pressure has come off. The union survives, for now.",tags:["collapse","crisis"]}),delete a.crisis),{ok:!0,message:i}}function vt(e){return e.tech??(e.tech={army:0,logistics:0,industry:0,navy:0,points:0,focus:"industry"})}function Ln(e){return 40*(e+1)}function ss(e){const a=e.params.researchSpeed??1;for(const n of Object.values(e.countries)){if(n.annexedBy||n.overlord)continue;const t=vt(n),r=Math.max(0,n.economy.budget.science);t.points+=r*100*a;const i=t[t.focus];t.points>=Ln(i)&&(t.points-=Ln(i),t[t.focus]=m(i+1,0,12))}}function cs(e){const a=e.tech;return a?1+a.army*.1+a.logistics*.05+a.industry*.015:1}const On=e=>e.military.branches.navy.active*(e.military.branches.navy.quality/100);function ls(e){for(const a of Object.values(e.wars))for(const n of a.fronts){if(!n.overseas)continue;const[t,r]=n.belligerents,i=e.countries[t],s=e.countries[r];if(!i||!s)continue;const o=On(i),c=On(s),l=o/Math.max(1,o+c);n.control=m(n.control+(l-.5)*.8,-50,50)}}function us(e){for(const a of Object.values(e.countries)){if(a.annexedBy)continue;const n=Math.max(1,a.economy.population),t=a.economy.gdp/n,r=a.military.spend||a.economy.fiscal.military;if(!(r>0))continue;const i=a.wars.some(A=>{const C=e.wars[A];return C&&!C.endedAt}),s=i?a.military.conscription?.06:.035:a.military.conscription?.02:.009,o=n*s,c=r/Math.max(1,t*.85),l=Math.max(1,a.military.activeDuty),p=i?o:Math.min(o,l*1.6),h=m(Math.min(c,p),500,o),y=h>l?i?.0025:4e-4:.001,f=m(l+(h-l)*y,500,o),P=f/l;a.military.activeDuty=f;for(const A of Object.values(a.military.branches))A.active>0&&(A.active=Math.max(0,Math.round(A.active*P)));a.military.reserves=Math.max(a.military.reserves,Math.round(f*(a.military.conscription?.6:.3)))}}function ze(e,a,n){var y,f;if(a.theatre==="none")return null;const[t,r]=a.belligerents,i=(y=e.rebels)==null?void 0:y[t],s=(f=e.rebels)==null?void 0:f[r];if(i||s){const P=i??s,A=i?r:t,C=i?-a.control:a.control,b=P.id.split("_")[0],N=a.theatre??(n[b]?b:A);return n[N]?{holder:P.id,holderName:P.name,territory:N,share:(100-C)/200}:null}const o=a.control>=0?t:r,c=a.control>=0?r:t,l=a.theatre??c,p=n[l],h=n[o];return!p||!h||l===o||p.overlord===o||(e.belligerents[o]??[]).includes(l)?null:{holder:o,holderName:h.name,territory:l,share:Math.abs(a.control)/100}}function ms(e,a,n,t){let r=0,i=-1,s=0,o=-1;e.fronts.forEach((h,y)=>{const f=ze(e,h,t);if(!f)return;const P=t[f.territory];f.holder===a&&(f.territory===n||(P==null?void 0:P.overlord)===n)&&f.share>r&&(r=f.share,i=y),f.holder===n&&(f.territory===a||(P==null?void 0:P.overlord)===a)&&f.share>s&&(s=f.share,o=y)});const c=e.exhaustion[a]??0,l=e.exhaustion[n]??0,p=r*110-s*110+(l-c)*.6+(l>75?15:0)-(c>75?15:0);return{mine:r,mineFront:i,theirs:s,theirsFront:o,leverage:p}}function Ct(e,a,n){if(!(a!=null&&a.length))return 0;let t=0;for(const r of a)r.holder===n&&(r.kind==="reparations"&&(e.reparations??0)<-.001&&(t+=Math.min(30,Math.abs(e.reparations??0)*220)),r.kind==="land"&&(e.annexWhole||e.annexOccupied||(e.drawnShare??0)>.001||e.cede)&&(t+=26),r.kind==="vassal"&&e.annexWhole&&(t+=18));return t}function Nt(e,a){let n=0;return e.annexWhole?n+=100:(e.annexOccupied&&(n+=a.mine*100),e.drawnShare&&(n+=e.drawnShare*100)),e.cede&&(n-=a.theirs*100),n+=(e.reparations??0)*200,n}function ds(e,a,n,t){const r=t?Ct(e,n,t):0;return Nt(e,a)-r<=a.leverage+3}const hs=`
AFG:CHN,IRN,PAK,TJK,TKM,UZB
AGO:COD,COG,NAM,ZMB
ALB:GRC,MKD,MNE,XKX
AND:ESP,FRA
ARE:OMN,SAU
ARG:BOL,BRA,CHL,PRY,URY
ARM:AZE,GEO,IRN,TUR
AUT:CHE,CZE,DEU,HUN,ITA,LIE,SVK,SVN
AZE:ARM,GEO,IRN,RUS,TUR
BDI:COD,RWA,TZA
BEL:DEU,FRA,LUX,NLD
BEN:BFA,NER,NGA,TGO
BFA:BEN,CIV,GHA,MLI,NER,TGO
BGD:IND,MMR
BGR:GRC,MKD,ROU,SRB,TUR
BIH:HRV,MNE,SRB
BLR:LTU,LVA,POL,RUS,UKR
BLZ:GTM,MEX
BOL:ARG,BRA,CHL,PER,PRY
BRA:ARG,BOL,COL,FRA,GUY,PER,PRY,SUR,URY,VEN
BRN:MYS
BTN:CHN,IND
BWA:NAM,ZAF,ZWE
CAF:CMR,COD,COG,SDN,SSD,TCD
CAN:USA
CHE:AUT,DEU,FRA,ITA,LIE
CHL:ARG,BOL,PER
CHN:AFG,BTN,HKG,IND,KAZ,KGZ,LAO,MMR,MNG,NPL,PAK,PRK,RUS,TJK,VNM
CIV:BFA,GHA,GIN,LBR,MLI
CMR:CAF,COG,GAB,GNQ,NGA,TCD
COD:AGO,BDI,CAF,COG,RWA,SSD,TZA,UGA,ZMB
COG:AGO,CAF,CMR,COD,GAB
COL:BRA,ECU,PAN,PER,VEN
CRI:NIC,PAN
CYN:CYP
CYP:CYN
CZE:AUT,DEU,POL,SVK
DEU:AUT,BEL,CHE,CZE,DNK,FRA,LUX,NLD,POL
DJI:ERI,ETH,SML
DNK:DEU
DOM:HTI
DZA:LBY,MAR,MLI,MRT,NER,TUN
ECU:COL,PER
EGY:ISR,LBY,PSE,SDN
ERI:DJI,ETH,SDN
ESP:AND,FRA,PRT
EST:LVA,RUS
ETH:DJI,ERI,KEN,SDN,SML,SOM,SSD
FIN:NOR,RUS,SWE
FRA:AND,BEL,BRA,CHE,DEU,ESP,ITA,LUX,MCO,SUR
GAB:CMR,COG,GNQ
GBR:IRL
GEO:ARM,AZE,RUS,TUR
GHA:BFA,CIV,TGO
GIN:CIV,GNB,LBR,MLI,SEN,SLE
GMB:SEN
GNB:GIN,SEN
GNQ:CMR,GAB
GRC:ALB,BGR,MKD,TUR
GTM:BLZ,HND,MEX,SLV
GUY:BRA,SUR,VEN
HKG:CHN
HND:GTM,NIC,SLV
HRV:BIH,HUN,MNE,SRB,SVN
HTI:DOM
HUN:AUT,HRV,ROU,SRB,SVK,SVN,UKR
IDN:MYS,PNG,TLS
IND:BGD,BTN,CHN,MMR,NPL,PAK
IRL:GBR
IRN:AFG,ARM,AZE,IRQ,PAK,TKM,TUR
IRQ:IRN,JOR,KWT,SAU,SYR,TUR
ISR:EGY,JOR,LBN,PSE,SYR
ITA:AUT,CHE,FRA,SMR,SVN,VAT
JOR:IRQ,ISR,PSE,SAU,SYR
KAZ:CHN,KGZ,RUS,TKM,UZB
KEN:ETH,SOM,SSD,TZA,UGA
KGZ:CHN,KAZ,TJK,UZB
KHM:LAO,THA,VNM
KOR:PRK
KWT:IRQ,SAU
LAO:CHN,KHM,MMR,THA,VNM
LBN:ISR,SYR
LBR:CIV,GIN,SLE
LBY:DZA,EGY,NER,SDN,TCD,TUN
LIE:AUT,CHE
LSO:ZAF
LTU:BLR,LVA,POL,RUS
LUX:BEL,DEU,FRA
LVA:BLR,EST,LTU,RUS
MAR:DZA
MCO:FRA
MDA:ROU,UKR
MEX:BLZ,GTM,USA
MKD:ALB,BGR,GRC,SRB,XKX
MLI:BFA,CIV,DZA,GIN,MRT,NER,SEN
MMR:BGD,CHN,IND,LAO,THA
MNE:ALB,BIH,HRV,SRB,XKX
MNG:CHN,RUS
MOZ:MWI,SWZ,TZA,ZAF,ZMB,ZWE
MRT:DZA,MLI,SEN
MWI:MOZ,TZA,ZMB
MYS:BRN,IDN,THA
NAM:AGO,BWA,ZAF,ZMB
NER:BEN,BFA,DZA,LBY,MLI,NGA,TCD
NGA:BEN,CMR,NER,TCD
NIC:CRI,HND
NLD:BEL,DEU
NOR:FIN,RUS,SWE
NPL:CHN,IND
OMN:ARE,SAU,YEM
PAK:AFG,CHN,IND,IRN
PAN:COL,CRI
PER:BOL,BRA,CHL,COL,ECU
PNG:IDN
POL:BLR,CZE,DEU,LTU,RUS,SVK,UKR
PRK:CHN,KOR,RUS
PRT:ESP
PRY:ARG,BOL,BRA
PSE:EGY,ISR,JOR
QAT:SAU
ROU:BGR,HUN,MDA,SRB,UKR
RUS:AZE,BLR,CHN,EST,FIN,GEO,KAZ,LTU,LVA,MNG,NOR,POL,PRK,UKR
RWA:BDI,COD,TZA,UGA
SAU:ARE,IRQ,JOR,KWT,OMN,QAT,YEM
SDN:CAF,EGY,ERI,ETH,LBY,SSD,TCD
SEN:GIN,GMB,GNB,MLI,MRT
SLE:GIN,LBR
SLV:GTM,HND
SML:DJI,ETH,SOM
SMR:ITA
SOM:ETH,KEN,SML
SRB:BGR,BIH,HRV,HUN,MKD,MNE,ROU,XKX
SSD:CAF,COD,ETH,KEN,SDN,UGA
SUR:BRA,FRA,GUY
SVK:AUT,CZE,HUN,POL,UKR
SVN:AUT,HRV,HUN,ITA
SWE:FIN,NOR
SWZ:MOZ,ZAF
SYR:IRQ,ISR,JOR,LBN,TUR
TCD:CAF,CMR,LBY,NER,NGA,SDN
TGO:BEN,BFA,GHA
THA:KHM,LAO,MMR,MYS
TJK:AFG,CHN,KGZ,UZB
TKM:AFG,IRN,KAZ,UZB
TLS:IDN
TUN:DZA,LBY
TUR:ARM,AZE,BGR,GEO,GRC,IRN,IRQ,SYR
TZA:BDI,COD,KEN,MOZ,MWI,RWA,UGA,ZMB
UGA:COD,KEN,RWA,SSD,TZA
UKR:BLR,HUN,MDA,POL,ROU,RUS,SVK
URY:ARG,BRA
USA:CAN,MEX
UZB:AFG,KAZ,KGZ,TJK,TKM
VAT:ITA
VEN:BRA,COL,GUY
VNM:CHN,KHM,LAO
XKX:ALB,MKD,MNE,SRB
YEM:OMN,SAU
ZAF:BWA,LSO,MOZ,NAM,SWZ,ZWE
ZMB:AGO,COD,MOZ,MWI,NAM,TZA,ZWE
ZWE:BWA,MOZ,ZAF,ZMB
`,ps=Object.fromEntries(hs.trim().split(`
`).map(e=>{const[a,n]=e.split(":");return[a,new Set(n.split(","))]})),ys={DEU:"plains",FRA:"plains",POL:"plains",RUS:"forest",UKR:"plains",BLR:"forest",GBR:"plains",ESP:"mountain",ITA:"mountain",CHE:"mountain",AUT:"mountain",NOR:"forest",SWE:"forest",FIN:"forest",CAN:"forest",USA:"plains",MEX:"desert",BRA:"forest",ARG:"plains",CHL:"mountain",PER:"mountain",COL:"forest",CHN:"plains",JPN:"mountain",IND:"plains",PAK:"desert",IRN:"desert",IRQ:"desert",SAU:"desert",EGY:"desert",LBY:"desert",DZA:"desert",MAR:"desert",TUR:"mountain",GRC:"mountain",BGR:"plains",ROU:"plains",HUN:"plains",CZE:"plains",NLD:"plains",BEL:"plains",DNK:"plains",ETH:"mountain",KEN:"plains",NGA:"forest",ZAF:"plains",AUS:"desert",IDN:"forest",VNM:"forest",THA:"forest",KOR:"mountain",PRK:"mountain"};function gs(e){const a=ys[e.id];if(a)return a;const n=Math.abs(e.lat??30);return n>55?"forest":n<24?"desert":"plains"}function fs(e,a,n){const t=Object.keys(e.countries).filter(i=>!e.countries[i].overlord&&!e.countries[i].annexedBy),r=new Set;for(const i of Object.values(e.wars))if(!i.endedAt)for(const s of Object.keys(i.belligerents))for(const o of Object.keys(i.belligerents))o!==s&&r.add(`${o}|${s}`);for(const i of t){const s=e.countries[i],o=[...s.economy.trade.exportPartners,...s.alliances].slice(0,24).map(c=>({b:c}));for(const{b:c}of o){if(c===i||!e.countries[c])continue;const l=e.countries[c];let p=0;s.alliances.includes(c)&&(p+=.5),r.has(`${i}|${c}`)&&(p-=4),s.bloc===l.bloc&&(p+=.4),s.bloc!==l.bloc&&s.bloc!=="none"&&l.bloc!=="none"&&(p-=.15);const h=s.economy.trade.flows[c]??0;h>0&&(p+=m(h/Math.max(1,s.economy.trade.exports)*2.2,0,1.4)),l.sanctions.some(f=>{var P;return(P=e.sanctions[f])==null?void 0:P.imposedBy.includes(i)})&&(p-=2.4),p-=Math.abs(s.ideology-l.ideology)/100*.16;const y=l.economy.gdp/Math.max(1,s.economy.gdp);y>60&&(p-=.3),y<.02&&(p+=.2),p+=a.normal()*.08,s.relations[c]=m((s.relations[c]??0)+p*(n/ye)*3,-100,100)}if(!s.overlord&&i!==e.playerCountry&&a.chance(5e-7*e.params.eventRate*(n/86400)*60)){const c=Object.entries(s.relations).filter(([l])=>!s.alliances.includes(l)&&l!==e.playerCountry).sort((l,p)=>l[1]-p[1])[0];c&&c[1]<-55&&fa(e,i,c[0],"financial",a)}if(i!==e.playerCountry&&!s.alliances.length&&a.chance(5e-7*e.params.eventRate*(n/86400)*60)){const c=Object.entries(s.relations).sort((l,p)=>p[1]-l[1])[0];c&&c[1]>70&&Ya(e,"alliance",[i,c[0]],["Mutual defence"],a,s.economy.gdp*.002)}}for(const i of Object.values(e.treaties))if(i.active){i.expiresAt&&e.t>i.expiresAt&&(i.active=!1,G(e,{kind:"diplomatic",severity:"notice",title:`${i.name} has lapsed`,body:"The treaty reached the end of its term without renewal.",actors:i.parties,tags:["treaty"]}));for(const s of i.parties){const o=e.countries[s];if(!o)continue;const c=i.parties.filter(p=>p!==s),l=c.length?c.reduce((p,h)=>p+(o.relations[h]??0),0)/c.length:0;i.favourability[s]=V(i.favourability[s]??0,m(l,-100,100),.01*(n/ye)*12+4e-5),(i.kind==="alliance"||i.kind==="defensive-pact")&&(i.favourability[s]??0)<-60&&a.chance(2e-4*(n/86400))&&Cs(e,i,s)}}for(const i of Object.values(e.sanctions)){if(e.t>i.until){Za(e,i.id);continue}i.evasion=z(i.evasion+8e-4*(n/ye)*12+1e-5)}}function As(e,a,n){var t,r;for(const i of Object.values(e.wars)){if(i.endedAt)continue;const s=e.params,o={};for(const A of i.fronts)for(const C of A.belligerents)o[C]=(o[C]??0)+1;const c=n/86400;for(const A of Object.keys(i.belligerents)){const C=(t=e.countries[A])==null?void 0:t.military;C&&(C.morale=m(C.morale+(C.morale<70?.015:0)*c,0,100),C.readiness=m(C.readiness+(C.readiness<70?.015:0)*c,0,100))}const l={};for(const A of Object.keys(i.belligerents)){const C=e.countries[A],b=i.belligerents[A]??[],N=(r=i.rebels)==null?void 0:r[A];if(N){l[A]=N.strength+b.reduce((L,k)=>{var $;return L+((($=e.countries[k])==null?void 0:$.military.activeDuty)??0)*.2},0);continue}if(!C)continue;const R=b.reduce((L,k)=>{var $,Y;return L+((($=e.countries[k])==null?void 0:$.military.activeDuty)??0)*(((Y=e.countries[k])==null?void 0:Y.military.readiness)??0)/100},0),u=C.economy.fiscal.military/Math.max(1,C.military.activeDuty),d=e.globals.globalGdp/Math.max(1,e.globals.globalPopulation),g=m(Math.pow(u/Math.max(1e-6,d*4),.25),.55,1.8)*cs(C),S=C.military.divisions??{armour:.2,artillery:.2},B=1+(S.armour-.2)*.4+(S.artillery-.2)*.2,M=C.military.activeDuty*(.4+Math.max(15,C.military.readiness)/100)*(Math.max(15,C.military.morale)/100)*g*B;l[A]=M+R*.3}for(const A of i.fronts){const C=x=>{var J;return((J=e.countries[x])==null?void 0:J.military.divisions)??{infantry:.6,armour:.2,artillery:.2}},b=(x,J)=>{const te=x.armour*(J.infantry+.5*J.artillery)-J.armour*(x.infantry+.5*x.artillery),se=x.artillery*(J.armour+.5*J.infantry)-J.artillery*(x.armour+.5*x.infantry),Le=x.infantry*(J.artillery+.5*J.armour)-J.infantry*(x.artillery+.5*x.armour),Me=A.terrain==="urban"||A.terrain==="forest"||A.terrain==="mountain";return m(1+(Me?.4:.6)*te+.45*se+(Me?.6:.4)*Le,.7,1.3)},N=C(A.belligerents[0]),R=C(A.belligerents[1]),u=[(l[A.belligerents[0]]??0)*b(N,R),(l[A.belligerents[1]]??0)*b(R,N)];if(u.reduce((x,J)=>x+J,0)<=0){A.control=V(A.control,0,.01);continue}const g=u[0]??0,S=u[1]??0,M={mountain:2.1,urban:1.5,"urban-core":1.4,forest:1.3,coastal:1.05,plains:.85,desert:.95}[A.terrain]??1;let L=g/Math.max(1,S*M);if(A.overseas){const x=da(e.countries[A.belligerents[0]])/da(e.countries[A.belligerents[1]]);L*=m(Math.pow(x,.5),.25,3)}const k=x=>{var te,se;const J=e.countries[x];return J?J.military.activeDuty+J.military.reserves*.1:((se=(te=i.rebels)==null?void 0:te[x])==null?void 0:se.strength)??0},[$,Y]=A.belligerents,Q=Math.min(k($)/Math.max(1,o[$]??1),k(Y)/Math.max(1,o[Y]??1)),Z=Math.abs(Math.log2(Math.max(1e-6,L))),ce=m(.7+Z*.1,.5,1.3),oe=A.belligerents.some(x=>{var J;return((J=i.stance)==null?void 0:J[x])==="offensive"}),de=s.warDamage*ce*c*.6*(oe?1.5:1),q=g,O=S*M,U=Math.max(1,q+O);A.belligerents.forEach((x,J)=>{const te=k(x);if(te<=0)return;const se=(J===0?O:q)/U,Le=Q*de*2*se,Me=Le/te;i.casualties[x]=(i.casualties[x]??0)+Le;const ve=e.countries[x];ve&&(ve.military.morale=m(ve.military.morale-Me*120,0,100),ve.military.readiness=m(ve.military.readiness-Me*90,0,100),ve.military.activeDuty=Math.max(100,ve.military.activeDuty-Le*.6)),i.exhaustion[x]=m((i.exhaustion[x]??0)+Me*80,0,100),i.publicSupport[x]=m((i.publicSupport[x]??50)-Me*120,0,100)});const F=x=>{var J;return((J=i.stance)==null?void 0:J[x])??"balanced"},w=L>=1?A.belligerents[0]:A.belligerents[1],he=L>=1?A.belligerents[1]:A.belligerents[0],ue=(F(w)==="offensive"?1.8:F(w)==="defensive"?.25:1)*(F(he)==="defensive"?.5:F(he)==="offensive"?1.3:1),Ge=Math.log(Math.max(.001,L))*.5,ie=Math.sign(Ge)*(Math.abs(Ge)+Math.max(0,Math.abs(Ge)-1)**2),Ie=m(ie,-8,8)*ue*(n/(ye*20)),be=a.normal()*.05*Math.sqrt(n/86400);A.control=m(A.control+Ie*100+be,A.overseas?0:-100,100),Ss(e,i,A);const Ue=e.countries[A.belligerents[1]];if(Ue){const x=Math.min(1,Math.abs(A.control)/100);A.contestedOutput=Ue.economy.gdp*x*.22}}const p=Object.keys(o),h=p.length?p.reduce((A,C)=>A+(i.exhaustion[C]??0),0)/p.length:0,y=i.fronts.filter(A=>Math.abs(A.control)>85);i.phase=Ps(i,h,y.length);const f=p.some(A=>A!==e.playerCountry&&(i.exhaustion[A]??0)>=100);!!!(e.playerCountry&&i.belligerents[e.playerCountry])&&(h>82||f||i.fronts.every(A=>Math.abs(A.control)>96))&&vs(e,i)}for(const[i,s]of Object.entries(e.wars)){const o=s.endedAt&&s.fronts.some(c=>{var l;return(((l=ze(s,c,e.countries))==null?void 0:l.share)??0)>.02});s.endedAt&&!o&&e.t-s.endedAt>ye*3&&delete e.wars[i]}}function Ss(e,a,n){const t=ze(a,n,e.countries);if(!t)return;const r=Math.floor(t.share*100/5);if(n.lastBucket===void 0){n.lastBucket=r;return}if(r===n.lastBucket)return;const i=r>n.lastBucket;n.lastBucket=r;const s=e.countries[t.territory];G(e,{kind:"military",severity:"notice",country:t.territory,title:`${t.holderName} ${i?"advances":"falls back"}: now holds ${r*5}% of ${s.name}`,body:`The line moves on the ${n.name} front.`,tags:["war","front"]})}function Ps(e,a,n){return n>=e.fronts.length?"negotiations":a>72?"stalemate":a>45?"attrition":e.fronts.length>2?"protracted":"war"}function Et(e,a,n){const t=i=>{var s;return[...((s=e.countries[i])==null?void 0:s.lands)??[],...e.regions.filter(o=>o.owner===i).flatMap(o=>o.hosts)]},r=new Set(t(n));for(const i of t(a)){if(r.has(i))return!0;for(const s of ps[i]??[])if(r.has(s))return!0}return!1}function da(e){const a=e==null?void 0:e.military.branches.navy;return a?Math.max(100,a.active*(a.quality/100)*(Math.max(15,e.military.readiness)/100)):100}function Rs(e,a,n,t){const r=e.countries[a];if(!r)return null;let i=n+"P";for(let c=2;e.countries[i]||e.customCountries[i];c+=1)i=n+"P"+c;const s=ht(e,i,t),o=s.country;Gt(o,r),e.countries[i]=o,e.customCountries[i]=o;for(const c of s.characters)e.characters[c.id]=c;for(const c of o.parties)e.parties[c.id]=c;return o}function bs(e,a,n){const t=e.countries[a],r=e.countries[n];return!t||!r||r.annexedBy||r.overlord?null:(Gt(r,t),r)}function Gt(e,a){e.overlord=a.id,e.mapColor=a.mapColor,e.bloc=a.bloc,a.dependencies[e.id]="protectorate"}function Na(e,a,n,t,r,i){const s=e.countries[a],o=e.countries[n];if(!s||!o||t<=0||r.length<3)return;const c=m(t,0,.98),l=s.economy.gdp*c,p=s.economy.population*c,h=1-c,y=1+l/Math.max(1,o.economy.gdp),f=(P,A)=>{const C=P.economy,b=C.macro;b.potential*=A,b.realGdp*=A,b.capital*=A,b.realHistory=b.realHistory.map(N=>N*A),C.gdp*=A;for(const N of C.sectors)N.quantity*=A,N.capacity*=A,N.output*=A};f(s,h),f(o,y),s.economy.population=Math.max(1e3,s.economy.population-p),o.economy.population+=p,s.economy.gdpPerCapita=s.economy.gdp/s.economy.population,o.economy.gdpPerCapita=o.economy.gdp/o.economy.population,e.regions.push({id:`ceded-${a}-${n}-${e.dayCount}-${e.regions.length}`,name:i,owner:n,hosts:s.lands??[a],ring:r})}function le(e,a,n,t){var p;const r=e.wars[a],i=e.countries[n];if(!r||!i||r.endedAt||r.belligerents[n]||n===e.playerCountry)return;r.belligerents[n]=[],r.exhaustion[n]=2,r.publicSupport[n]=62,i.wars.includes(a)||i.wars.push(a);const s=Object.keys(r.belligerents).filter(h=>h!==n&&h!==t&&!Ms(e,h,t));for(const h of s)i.relations[h]=m((i.relations[h]??0)-50,-100,100),e.countries[h]&&(e.countries[h].relations[n]=m((e.countries[h].relations[n]??0)-50,-100,100));const o=h=>{const y=e.countries[h];return y?Math.hypot((i.lat??0)-(y.lat??0),(i.lon??0)-(y.lon??0)):1/0},c=[...s].sort((h,y)=>o(h)-o(y))[0],l=s.find(h=>Et(e,n,h));if(l||c&&o(c)<=30){const h=l??c;r.fronts.push({id:`${a}-f${r.fronts.length}`,name:`${i.name} Front`,belligerents:[n,h],control:0,contestedOutput:0,openedAt:e.t,terrain:l?"plains":"coastal",attritionRate:4e-4,overseas:!l})}else r.belligerents[t]&&!r.belligerents[t].includes(n)&&r.belligerents[t].push(n);G(e,{kind:"military",severity:"catastrophic",country:n,title:`${i.name} enters the ${r.name}`,body:`${i.name} joins the fighting alongside ${((p=e.countries[t])==null?void 0:p.name)??t}.`,actors:[n,t],tags:["war"]})}function Ms(e,a,n){var t;return!!((t=e.countries[a])!=null&&t.alliances.includes(n))}function xe(e,a,n,t,r){var p,h;const i=e.countries[a],s=e.countries[n];if(!i||!s||a===n||i.wars.some(y=>{var f;return(f=e.wars[y])==null?void 0:f.belligerents[n]}))return null;const o=`war-${Object.keys(e.wars).length}-${Math.round(e.t)}`,c=!Et(e,a,n),l={id:o,name:`${i.name} - ${s.name} War`,startedAt:e.t,phase:"mobilised",belligerents:{[a]:[],[n]:[]},cause:t,fronts:[c?{id:`${o}-f0`,name:`${i.name} landings in ${s.name}`,belligerents:[a,n],control:da(i)>=da(s)*.5?1:0,contestedOutput:0,openedAt:e.t,terrain:"coastal",attritionRate:4e-4,overseas:!0,theatre:n,axis:s.lon!==void 0&&s.lat!==void 0?[s.lon-3,s.lat,s.lon+3,s.lat]:void 0}:{id:`${o}-f0`,name:`${i.name} - ${s.name} Front`,belligerents:[a,n],control:0,contestedOutput:0,openedAt:e.t,terrain:gs(s),attritionRate:4e-4}],exhaustion:{[a]:4,[n]:4},casualties:{},materiel:{},warGoal:t,aims:[{holder:a,kind:"land",label:`Annex ${((p=s.lands)==null?void 0:p[0])??s.name}`,target:((h=s.lands)==null?void 0:h[0])??s.id},{holder:a,kind:"reparations",label:`Indemnity from ${s.name}`},{holder:n,kind:"reparations",label:`Reparations from ${i.name}`}],publicSupport:{[a]:62,[n]:70}};e.wars[o]=l,i.wars.push(o),s.wars.push(o),i.relations[n]=m((i.relations[n]??0)-70,-100,100),s.relations[a]=m((s.relations[a]??0)-70,-100,100);for(const y of Object.values(e.treaties))if(!(!y.active||y.kind!=="alliance"&&y.kind!=="defensive-pact")&&!(!y.parties.includes(n)||y.parties.includes(a)))for(const f of y.parties)f===n||f===e.playerCountry||!e.countries[f]||l.belligerents[f]||le(e,o,f,n);return G(e,{kind:"military",severity:"catastrophic",country:a,title:`${i.name} declares war on ${s.name}`,body:t,actors:[a,n],byUserId:r,tags:["war"]}),l}function vs(e,a,n){var f,P,A,C;const t=Object.keys(a.belligerents),r={};for(const b of t){const N=a.fronts.reduce((R,u)=>R+(u.belligerents[0]===b?u.control:-u.control),0)/Math.max(1,a.fronts.length);r[b]=N-(a.exhaustion[b]??0)/2}const i=Object.entries(r).sort((b,N)=>N[1]-b[1]),s=(f=i[0])==null?void 0:f[0],o=(P=i[i.length-1])==null?void 0:P[0];if(!s||!o)return;const c=r[s]-r[o];a.endedAt=e.t,a.outcome=c>45?"victory":c<-10?"defeat":"white-peace",a.victor=c>45?s:void 0;const l=e.countries[s],p=e.countries[o],h=[];if(Math.max(0,...a.fronts.map(b=>{const N=ze(a,b,e.countries);return N&&N.territory===o&&N.holder===s?N.share:0}))>=.8&&l&&p&&p.id!==e.playerCountry)qe(e,s,o,"Territorial concession at the end of the war"),h.push(`${p==null?void 0:p.name} is annexed in its entirety`);else if(l&&p){const b=p.economy.gdp*m(.02+c/900,.01,.24);p.economy.fiscal.debt+=b,l.economy.reserves+=b*.4,h.push(`${p.name} pays ${(b/1e9).toFixed(1)}bn in reparations`)}for(const b of t){const N=e.countries[b];N&&(N.wars=N.wars.filter(R=>R!==a.id),N.relations[s]=m((N.relations[s]??0)+18,-100,100),N.military.morale=m(N.military.morale+12,0,100),N.economy.monetary.inflation=m(N.economy.monetary.inflation+(N.unrestRisk??0)*.02,-.2,.9),N.unrestRisk>.05&&N.unrest.push({id:`unrest-${N.id}-postwar-${e.events.length}`,kind:"rebellion",intensity:m((N.unrestRisk-.05)*200,10,80),startedAt:e.t,fatalities:0}))}G(e,{kind:"military",severity:"major",title:`${a.name} ends`,body:`${a.outcome==="victory"?`Decisive victory for ${((A=e.countries[s])==null?void 0:A.name)??s}.`:a.outcome==="white-peace"?"A white peace. Everyone retreats to where they started.":`${((C=e.countries[o])==null?void 0:C.name)??o} capitulates.`} ${h.join(". ")}.`,actors:t,tags:["war","peace"]})}function qe(e,a,n,t,r){const i=e.countries[a],s=e.countries[n];if(!i||!s||i.id===s.id||s.annexedBy)return;const o=s.economy.gdp/Math.max(1,i.economy.gdp);i.economy.gdp+=s.economy.gdp,i.economy.population+=s.economy.population,i.economy.fiscal.debt+=s.economy.fiscal.debt,i.economy.reserves+=s.economy.reserves,i.economy.gdpPerCapita=i.economy.gdp/i.economy.population,i.economy.macro.potential*=1+o,i.economy.macro.realGdp*=1+o,i.economy.macro.capital*=1+o,i.economy.macro.realHistory=i.economy.macro.realHistory.map(c=>c*(1+o));for(const c of i.economy.sectors)c.quantity*=1+o,c.capacity*=1+o;for(const c of Object.keys(e.control))e.control[c]===n&&(e.control[c]=a);for(const c of e.regions)c.owner===n&&(c.owner=a);i.military.activeDuty+=s.military.activeDuty,i.military.spend+=s.military.spend;for(const[c,l]of Object.entries(s.economy.trade.flows))i.economy.trade.flows[c]=(i.economy.trade.flows[c]??0)+l;for(const c of Object.values(e.companies))if(c.country===n){c.country=a;const l=e.exchanges[c.exchangeId??""];l&&(l.listings=l.listings.filter(p=>p!==c.id),l.listings.push(c.id))}for(const c of Object.values(e.characters))c.country===n&&(c.removedAt=e.t);for(const c of s.parties)c.status="outside",delete e.parties[c.id];for(const c of s.wars){const l=e.wars[c];l&&!l.endedAt&&Object.keys(l.belligerents).filter(p=>p!==n).length<2&&(l.endedAt=e.t)}s.wars=[],s.annexedBy=a,G(e,{kind:"political",severity:"catastrophic",country:a,title:`${i.name} annexes ${s.name}`,body:t,actors:[a,n],byUserId:r,tags:["annexation"]})}function Ya(e,a,n,t,r,i=0,s){const o=n.filter(p=>e.countries[p]&&!e.countries[p].annexedBy);if(o.length<2)return null;const c=`treaty-${Object.keys(e.treaties).length}-${Math.round(e.t)}`,l={id:c,name:`${Ns(a)}: ${o.map(p=>e.countries[p].name).join(" / ")}`,kind:a,parties:o,signedAt:e.t,terms:t,tradeBonus:i||(a==="trade"||a==="customs-union"?1e10:0),favourability:Object.fromEntries(o.map(p=>[p,r.float(10,60)])),active:!0};if(e.treaties[c]=l,a==="alliance"||a==="defensive-pact"||a==="entente")for(const p of o)for(const h of o){if(p===h)continue;const y=e.countries[p];y.relations[h]=m((y.relations[h]??0)+34,-100,100),y.alliances.includes(h)||y.alliances.push(h)}if(a==="trade"||a==="customs-union")for(const p of o){const h=e.countries[p];for(const y of o)p!==y&&(h.economy.trade.flows[y]=(h.economy.trade.flows[y]??0)+i/o.length,h.economy.trade.tradeOpenness=m(h.economy.trade.tradeOpenness+4,0,96))}return G(e,{kind:"diplomatic",severity:"major",title:`${l.name} signed`,body:t.join(". "),actors:o,byUserId:s,tags:["treaty"]}),l}function Cs(e,a,n,t){var i;a.parties=a.parties.filter(s=>s!==n),a.parties.length<2&&(a.active=!1);const r=e.countries[n];if(r)for(const s of a.parties)r.relations[s]=m((r.relations[s]??0)-30,-100,100),r.alliances=r.alliances.filter(o=>o!==s);G(e,{kind:"diplomatic",severity:"major",title:`${((i=e.countries[n])==null?void 0:i.name)??n} withdraws from ${a.name}`,body:"The agreement is torn up.",actors:[n,...a.parties],byUserId:t,tags:["treaty"]})}function Ns(e){return{alliance:"Alliance","non-aggression":"Non-aggression Pact",trade:"Trade Agreement",entente:"Entente",peace:"Peace Treaty","defensive-pact":"Defensive Pact",access:"Access Agreement","customs-union":"Customs Union","lend-lease":"Lend-Lease Agreement"}[e]}function fa(e,a,n,t,r,i){const s=e.countries[a],o=e.countries[n];if(!s||!o)return null;const c=o.sanctions.find(P=>{var A;return(A=e.sanctions[P])==null?void 0:A.imposedBy.includes(a)});if(c)return e.sanctions[c];const l=`sanction-${Object.keys(e.sanctions).length}-${Math.round(e.t)}`,p=Math.sqrt(s.economy.gdp/Math.max(1,o.economy.gdp)),h=m(Math.round(24+p*22+r.float(-8,14)),8,92),y=(t==="embargo"||t==="technology"||t==="oil"?1.5:1)*h,f={id:l,imposedBy:[a],on:n,at:e.t,kind:t,scope:h,duration:ye*r.float(.6,3),until:e.t+ye*r.float(.6,3),costToTarget:o.economy.gdp*y*.004,costToImposer:s.economy.gdp*y*6e-4,evasion:r.float(.05,.45)};return f.until=e.t+f.duration,e.sanctions[l]=f,o.sanctions.push(l),s.relations[n]=m((s.relations[n]??0)-45,-100,100),G(e,{kind:"diplomatic",severity:"major",country:n,title:`${s.name} imposes ${t} sanctions on ${o.name}`,body:`Coverage ${h}%. Estimated annual cost to the target: ${(f.costToTarget/1e9).toFixed(1)}bn.`,actors:[a,n],byUserId:i,tags:["sanctions"]}),f}function Za(e,a,n){const t=e.sanctions[a];if(!t)return;const r=e.countries[t.on];if(r){r.sanctions=r.sanctions.filter(i=>i!==a);for(const i of t.imposedBy){const s=e.countries[i];s&&(s.relations[t.on]=m((s.relations[t.on]??0)+22,-100,100))}G(e,{kind:"diplomatic",severity:"notice",country:t.on,title:`Sanctions on ${r.name} lifted`,body:"The measures have been withdrawn.",byUserId:n,tags:["sanctions"]})}delete e.sanctions[a]}const Es={1914:[{day:30,actors:["AUT","SRB"],run:e=>{xe(e,"AUT","SRB","The Austro-Hungarian ultimatum after the assassination at Sarajevo is rejected.")}},{day:34,actors:["DEU","RUS"],run:e=>{if(!ea(e,"AUT","SRB"))return;const a=xe(e,"DEU","RUS","Russia mobilises in support of Serbia, and Germany answers.");a&&(le(e,a.id,"AUT","DEU"),le(e,a.id,"SRB","RUS"))}},{day:36,actors:["DEU","FRA"],run:e=>{const a=ea(e,"DEU","RUS");a&&le(e,a,"FRA","RUS")}},{day:37,actors:["GBR","DEU"],run:e=>{const a=ea(e,"DEU","RUS");a&&(le(e,a,"BEL","RUS"),le(e,a,"GBR","RUS"),le(e,a,"CAN","RUS"),le(e,a,"AUS","RUS"),le(e,a,"NZL","RUS"),le(e,a,"ZAF","RUS"),le(e,a,"RAJ","RUS"))}},{day:124,actors:["OTT"],run:e=>{const a=ea(e,"DEU","RUS");a&&le(e,a,"OTT","DEU")}}],1950:[{day:175,actors:["PRK","KOR"],run:e=>{const a=xe(e,"PRK","KOR","North Korean forces cross the 38th parallel to reunify the peninsula.");a&&le(e,a.id,"USA","KOR")}},{day:280,actors:["CHN"],run:e=>{const a=ea(e,"PRK","KOR");a&&le(e,a,"CHN","PRK")}}],1990:[{day:31,actors:["DEU","DDR"],run:e=>{qe(e,"DEU","DDR","German reunification: the five eastern states accede to the Federal Republic.")}},{day:136,actors:["USA","IRQ"],run:e=>{G(e,{kind:"military",severity:"catastrophic",country:"IRQ",title:"Operation Desert Storm begins",body:"UN Resolution 678 has expired. The coalition air campaign against Iraq opens.",actors:["USA","IRQ"],tags:["war"]});const a=e.wars["war-gulf-crisis"];a&&(a.fronts[0].control=Math.min(a.fronts[0].control,30))}}],2010:[{day:123,actors:["GRC"],run:e=>{const a=e.countries.GRC;a&&(a.economy.macro.shock-=.05,G(e,{kind:"economic",severity:"major",country:"GRC",title:"Greece accepts a 110 billion euro bailout",body:"The euro zone and the IMF step in as Greek yields become unpayable. Deep austerity is the price.",tags:["crisis","debt"]}))}}],2020:[{day:20,actors:[],run:e=>{G(e,{kind:"economic",severity:"major",title:"Lockdowns spread across the world economy",body:"A third of humanity is under some form of lockdown. Central banks and treasuries respond at wartime scale.",tags:["crisis","pandemic"]})}}]},xn=new WeakMap;function ea(e,a,n){var t;return(t=Object.values(e.wars).find(r=>!r.endedAt&&r.belligerents[a]&&r.belligerents[n]))==null?void 0:t.id}function Gs(e){const a=Es[e.scenarioId];if(!a)return;let n=xn.get(e);n||(n=new Set,xn.set(e,n)),a.forEach((t,r)=>{if(t.day!==e.dayCount)return;const i=`${e.scenarioId}-${r}`;n.has(i)||(n.add(i),!(e.playerCountry&&t.actors.includes(e.playerCountry))&&t.run(e))})}const Pe=Symbol("missing");function Bt(e,a){if(!a)return Pe;let n=e;for(const t of a.split(".")){if(n==null||typeof n!="object")return Pe;const r=n;if(!(t in r))return Pe;n=r[t]}return n??Pe}function Bs(e,a,n){const t=a.split("."),r=Bt(e,a);if(r===Pe)return Pe;let i=e;for(let s=0;s<t.length-1;s++)if(i=i[t[s]],i==null||typeof i!="object")return Pe;return i[t[t.length-1]]=n,r}function re(e,a){const n=Bt(e,a);if(n===Pe||n===void 0||n===null)return NaN;if(typeof n=="number")return n;if(typeof n=="boolean")return n?1:0;if(typeof n=="string"){const t=Number(n);return Number.isFinite(t)?t:NaN}return NaN}function Re(e,a,n){return Number.isFinite(n)?Bs(e,a,n)!==Pe:!1}function Ds(e,a,n){const t=re(e,a);if(!Number.isFinite(t))return NaN;const r=t+n;return Number.isFinite(r)?(Re(e,a,r),r):t}function ks(e,a,n){for(const t of e.directives)if(t.enabled)switch(t.kind){case"set-stat":{const r=ha(e,t.target,t.targetId);if(!r)continue;const i=re(r.obj,t.path);if(!Number.isFinite(i))continue;t.blend>=1?Re(r.obj,t.path,t.value):Re(r.obj,t.path,i+(t.value-i)*m(t.blend*(a/86400)*24,0,1));break}case"freeze":{const r=ha(e,t.target,t.targetId);if(!r)continue;const i=re(r.obj,t.path);Number.isFinite(i)&&t.frozenValue!==void 0&&Re(r.obj,t.path,t.frozenValue);break}case"trigger":{Os(e,t.when)&&(!t.lastFiredAt||e.t-t.lastFiredAt>600)&&(za(e,t.then),t.lastFiredAt=e.t);break}case"custom-rule":{Ts(e,t.rule,a,n);break}}}function ha(e,a,n){switch(a){case"country":{const t=e.countries[n]??e.customCountries[n];return t?{obj:t}:null}case"company":return e.companies[n]?{obj:e.companies[n]}:null;case"market":return{obj:e.markets};case"global":return{obj:e};default:return null}}function Ts(e,a,n,t){if(!a.enabled||a.maxFires>=0&&a.fired>=a.maxFires||a.lastFiredAt&&e.t-a.lastFiredAt<a.cooldownMs/1e3)return;const r=e.t,i=a.trigger;let s=!0;switch(i.type){case"always":s=!0;break;case"interval":s=!a.lastFiredAt||r-a.lastFiredAt>=(i.intervalSeconds??3600);break;case"random":s=t.chance(i.probability??.1);break;case"threshold":s=i.conditions.every(l=>Hn(e,l));break;case"on-event":s=i.conditions.every(l=>Hn(e,l));break}if(!s)return;const o=[];for(const l of a.actions){const p=Is(e,l);p&&o.push(p)}a.fired++,a.lastFiredAt=r;const c=o.join("; ")||"no visible effect";a.log.unshift({t:r,message:c}),a.log.length>50&&(a.log.length=50),G(e,{kind:"system",severity:"info",title:`Rule fired: ${a.name}`,body:c,tags:["rule",a.id]})}function Hn(e,a){const n=[];if(a.scope==="country"&&a.target){const t=e.countries[a.target]??e.customCountries[a.target];t&&n.push({obj:t,id:t.id})}else if(a.scope==="any-country")for(const t of Object.values(e.countries))n.push({obj:t,id:t.id});else if(a.scope==="company"&&a.target){const t=e.companies[a.target];t&&n.push({obj:t,id:t.id})}else a.scope==="global"?n.push({obj:e,id:"world"}):a.scope==="war"&&a.target&&e.wars[a.target]&&n.push({obj:e.wars[a.target],id:a.target});if(!n.length)return!1;switch(a.aggregate){case"all":return n.every(t=>Ea(t.obj,a));case"count":return n.filter(t=>Ea(t.obj,a)).length>=Number(a.value);case"avg":{const t=n.map(r=>re(r.obj,a.path)).filter(Number.isFinite);return t.length?Dt(t.reduce((r,i)=>r+i,0)/t.length,a):!1}case"any":default:return n.some(t=>Ea(t.obj,a))}}function Ea(e,a){if(a.op==="exists")return Number.isFinite(re(e,a.path))||re(e,a.path)===0;const n=re(e,a.path);return Number.isFinite(n)?Dt(n,a):!1}function Dt(e,a){switch(a.op){case"<":return e<Number(a.value);case"<=":return e<=Number(a.value);case">":return e>Number(a.value);case">=":return e>=Number(a.value);case"==":return e===Number(a.value);case"!=":return e!==Number(a.value);case"between":return Array.isArray(a.value)&&e>=a.value[0]&&e<=a.value[1];case"contains":return String(re({},"")).includes(String(a.value));default:return!1}}function Is(e,a){switch(a.type){case"set":{const n=ha(e,a.scope,a.target??"");return n?Re(n.obj,a.path,a.value)?`set ${a.path} = ${a.value}`:`path ${a.path} not found`:`no target ${a.target}`}case"multiply":{const n=ha(e,a.scope,a.target??""),t=n?re(n.obj,a.path):NaN;return!n||!Number.isFinite(t)?`path ${a.path} not found`:(Ds(n.obj,a.path,t*(a.value-1)),`multiplied ${a.path} by ${a.value}`)}case"spawn-war":{const n=xe(e,a.attacker,a.defender,a.name??"Rule-triggered conflict","rules");return n?`declared ${n.name}`:"war could not be declared"}case"end-war":{const n=e.wars[a.warId];if(!n)return`no war ${a.warId}`;n.endedAt=e.t,n.outcome="white-peace";for(const t of Object.keys(n.belligerents)){const r=e.countries[t];r&&(r.wars=r.wars.filter(i=>i!==a.warId))}return`ended ${n.name}`}case"annex":return qe(e,a.annexer,a.target,"Rule-triggered annexation","rules"),`annexed ${a.target} into ${a.annexer}`;case"grant-money":{const n=e.countries[a.target];return n?(n.economy.fiscal.treasury+=a.amount,`granted ${(a.amount/1e9).toFixed(1)}bn to ${n.name}`):`no country ${a.target}`}case"ban-entity":{if(a.entityType==="company"){const n=e.companies[a.entityId];n&&(n.banned=!0,n.bannedReason=a.reason,n.listed=!1)}else if(a.entityType==="character"){const n=e.characters[a.entityId];n&&(n.banned=!0,n.removedAt=e.t)}else if(a.entityType==="party"){const n=e.parties[a.entityId];n&&(n.banned=!0)}else{const n=e.countries[a.entityId];n&&(n.banned=!0)}return`banned ${a.entityType} ${a.entityId}: ${a.reason}`}case"unban-entity":{if(a.entityType==="company"){const n=e.companies[a.entityId];n&&(n.banned=!1,n.bannedReason=void 0)}else if(a.entityType==="character"){const n=e.characters[a.entityId];n&&(n.banned=!1,n.removedAt=void 0)}else if(a.entityType==="party"){const n=e.parties[a.entityId];n&&(n.banned=!1)}else{const n=e.countries[a.entityId];n&&(n.banned=!1)}return`unbanned ${a.entityId}`}case"kill-character":{const n=e.characters[a.characterId];if(!n)return`no character ${a.characterId}`;n.removedAt=e.t;const t=e.countries[n.country];return t&&(G(e,{kind:"political",severity:"major",country:n.country,title:`${n.name} has died`,body:a.cause,tags:["death"]}),(t.executive.headOfGovernmentId===n.id||t.executive.headOfStateId===n.id)&&(t.executive.approval=m(t.executive.approval-25,0,100),t.executive.confidence=m(t.executive.confidence-30,0,100),e.characters[n.id].country&&t.legislature)),`${n.name} died (${a.cause})`}case"fire-minister":{const n=e.countries[a.country];if(!n)return`no country ${a.country}`;const t=n.executive.ministers.find(r=>r.id===a.area);return t?(t.characterId=void 0,t.partyId=void 0,n.executive.approval=m(n.executive.approval-6,0,100),`fired the ${a.area} minister of ${n.name}`):`${n.name} has no ${a.area} ministry`}case"force-election":{const n=e.countries[a.country];if(!(n!=null&&n.legislature))return`${a.country} has no legislature`;const t=n.legislature.chambers.find(i=>i.id===a.chamberId)??n.legislature.chambers[0];if(!t||t.election==="none")return`${n.name} has no elections`;n.elections.forEach(i=>{i.status!=="complete"&&(i.status="complete")});const r=60;return n.elections.push({id:`elec-${n.id}-forced-${Math.round(e.t)}`,country:n.id,chamberId:t.id,kind:t.election,scheduledAt:e.t,endsAt:e.t+20*86400,status:"campaign",votes:{},turnout:{},districtCount:r,districtPopulations:Array.from({length:r},()=>1/r),projection:{},enthusiasm:70,districtNames:Array.from({length:r},(i,s)=>`Extraordinary Constituency ${s+1}`)}),`forced an election in ${n.name}`}case"raise-referendum":{const n=e.countries[a.country];return n?(n.referendums.push({id:`ref-${n.id}-${Math.round(e.t)}`,country:n.id,question:a.question,calledBy:n.executive.headOfGovernmentId??"",at:e.t,closesAt:e.t+45*86400,options:[{id:"yes",label:"Yes",yes:0},{id:"no",label:"No",yes:0}],status:"open",turnout:.6}),`called a referendum in ${n.name}: ${a.question}`):`no country ${a.country}`}case"impose-sanction":return fa(e,a.by,a.on,a.kind,new $e(e.seed^Math.round(e.t)),"rules")?`sanctions imposed on ${a.on}`:"sanctions failed";case"log":return a.message;case"custom-script":return za(e,a.expression)??null;default:return null}}function za(e,a){const n=[];for(const t of a.split(/[\n;]+/)){const r=t.trim();if(!r||r.startsWith("#")||r.startsWith("//"))continue;const i=Us(e,r);i&&n.push(i)}return n.length?n.join("; "):null}function Us(e,a){const n=a.match(/^([A-Za-z0-9_.\-[\]]+)\s*(\+=|-=|\*=|\/=|=)\s*(.+)$/);if(n){const[,r,i,s]=n,o=Number(s.trim());if(!Number.isFinite(o))return`bad value in "${a}"`;const c=Ls(e,r);if(!c)return`no target for "${r}"`;const l=Number.isFinite(re(c.obj,c.path))?re(c.obj,c.path):0;let p=l;return i==="="?p=o:i==="+="?p=l+o:i==="-="?p=l-o:i==="*="?p=l*o:i==="/="&&(p=o===0?l:l/o),Re(c.obj,c.path,p)?`${r} -> ${p}`:`cannot set ${r}`}const t=a.match(/^([a-zA-Z]+)\((.*)\)$/);if(t){const[,r,i]=t,s=i.split(",").map(o=>o.trim().replace(/^["']|["']$/g,""));switch(r){case"gdp":{const o=e.countries[s[0]];return o&&Re(o,"economy.gdp",Number(s[1]))?`${o.name} GDP set to ${s[1]}`:null}case"unrest":{const o=e.countries[s[0]];return o?(o.unrestRisk=m(o.unrestRisk+Number(s[1]??.1),0,1),`${o.name} unrest ${o.unrestRisk.toFixed(2)}`):null}case"crisis":{const o=e.countries[s[0]];if(!o)return null;const c=m(Number(s[1]??.5),0,1);return o.crisis={stage:"pressure",tension:c,since:e.t,lost:[],measures:[],lastEventAt:0},`${o.name} crisis at ${c}`}case"approval":{const o=e.countries[s[0]];return o?(o.executive.approval=m(o.executive.approval+Number(s[1]??0),0,100),`${o.name} approval ${o.executive.approval.toFixed(0)}`):null}case"war":return xe(e,s[0],s[1],"Console order","console")?`war declared ${s[0]} vs ${s[1]}`:null;case"annex":return qe(e,s[0],s[1],"Console order","console"),`annexed ${s[1]} -> ${s[0]}`;case"grant":{const o=e.countries[s[0]];return o?(o.economy.fiscal.treasury+=Number(s[1]??0),`granted ${s[1]} to ${o.name}`):null}case"create-country":{const o=s[0];if(!o)return null;if(!e.customCountries[o]){const{country:c,characters:l}=ht(e,o,s[1]??o);for(const p of l)e.characters[p.id]=p;e.customCountries[o]=c,e.countries[o]=c;for(const p of c.parties)e.parties[p.id]=p}return`created ${o}`}case"remove-country":{const o=e.countries[s[0]];return o?(o.annexedBy=s[1]??o.overlord??"INT",o.dependencies={},`${s[0]} abolished`):null}default:return null}}return null}function Ls(e,a){const n=a.match(/^(?:country|company|global)\(([A-Za-z0-9_]+)\)\.(.+)$/);if(n){const[,t,r]=n;if(t==="global")return{obj:e,path:r};const i=e.countries[t]??e.customCountries[t];if(i)return{obj:i,path:r};const s=e.companies[t];return s?{obj:s,path:r}:null}return{obj:e,path:a}}function Os(e,a){const n=a.trim();if(!n)return!1;const t=n.match(/^([a-zA-Z0-9_]+)\s*(>=|<=|>|<|==)\s*(.+)$/);if(!t)return!1;const[,r,i,s]=t,o=Number(s);if(!Number.isFinite(o))return!1;const c=e.countries[r]??e.customCountries[r],l=c?re(c,"economy.gdp"):r==="warCount"?Object.keys(e.wars).length:re(e.globals,"worldConflictIndex");switch(i){case">":return l>o;case"<":return l<o;case">=":return l>=o;case"<=":return l<=o;case"==":return l===o;default:return!1}}const we=86400,xs=30;class Hs{constructor(a,n){ia(this,"rng");ia(this,"carry",0);this.world=a,this.rng=new $e(a.seed),n!==void 0&&(this.rng.state=n),a.dayCount===void 0&&(a.dayCount=Math.floor(a.t/we)),a.t===0&&Object.values(a.countries).every(t=>!t.economy.history.length)&&Fn(a)}get rngState(){return this.rng.state}set rngState(a){this.rng.state=a}tick(a){const n=this.world,t=n.events.length;if(!n.paused&&a>0){const r=m(a,0,2);this.carry+=r*n.daysPerSecond*n.speed;const i=Math.floor(this.carry);i>0&&(this.carry-=i,this.advanceDays(i))}return{dt:a,events:n.events.slice(t),version:n.version}}advanceDays(a){const n=this.world;for(let t=0;t<a;t++)n.t+=we,n.dayCount++,As(n,this.rng,we),Gs(n),n.dayCount%7===0&&(vr(n,this.rng),as(n,this.rng),ts(n,this.rng),Sr(n,this.rng),ss(n),ls(n),us(n),fs(n,this.rng,7*we),ks(n,7*we,this.rng),je(n)),n.dayCount%xs===0&&Fn(n),n.dayCount%365===0&&Hr(n);n.updatedAt=Date.now(),n.version++}}function Fn(e){for(const a of Object.values(e.countries)){if(a.annexedBy)continue;const n=a.economy,t=e.markets.exchanges.find(r=>r.country===a.id);n.history.push({t:e.t,gdp:n.gdp,gdpGrowth:n.gdpGrowth,inflation:n.monetary.inflation,unemployment:n.labour.unemployment,debtToGdp:n.fiscal.debtToGdp,stockIndex:(t==null?void 0:t.index)??0,gdpPerCapita:n.gdpPerCapita,population:n.population,policyRate:n.monetary.policyRate,bondYield:n.macro.bondYield,budgetBalance:n.fiscal.budgetBalanceRatio,tradeBalance:n.trade.tradeBalance/Math.max(1,n.gdp),exchangeRate:n.monetary.exchangeRateVsUsd,medianWage:n.labour.medianWage,approval:a.executive.approval,militarySpend:n.fiscal.military}),n.history.length>480&&n.history.splice(0,n.history.length-480)}}function kt(e,a){const n={...a,id:a.id??`dir-${e.directives.length}-${Math.round(e.t)}`,createdAt:Date.now()};return e.directives.push(n),n}function Fs(e,a){const n=e.directives.filter(r=>r.kind==="custom-rule").length,t={...a,id:a.id??`rule-${n}-${Math.round(e.t)}`,fired:0,log:[],createdAt:Date.now()};return kt(e,{kind:"custom-rule",rule:t,enabled:!0,note:t.name,createdBy:a.createdBy}),t}function ca(e,a,n){return e.speed=m(a,0,60),n!==void 0&&(e.paused=n),G(e,{kind:"system",severity:"info",title:e.paused?"World paused":"World resumed",body:`Speed set to ${e.speed}x.`,tags:["system"]}),{ok:!0,message:`Speed ${e.speed}x, ${e.paused?"paused":"running"}`}}function Ks(e,a,n){const t=m(Math.ceil(n/we),1,7300);return a.advanceDays(t),{ok:!0,message:`Advanced ${t} in-game days`}}const Kn={income:.8,corporate:.7,vat:.35,payroll:.4,tariff:1,royalty:.9},$n=["defence","welfare","health","education","infrastructure","science","administration","subsidies"];function $s(e,a){const n=[];let t=50;if(a.tax)for(const[i,s]of Object.entries(a.tax)){const o=e.economy.tax[i],c=s;n.push(`${i} tax ${(o*100).toFixed(1)}% to ${(c*100).toFixed(1)}%`),t-=(c-o)*160}if(a.budget)for(const[i,s]of Object.entries(a.budget)){const o=e.economy.budget[i],c=s;n.push(`${i} ${(o*100).toFixed(1)}% to ${(c*100).toFixed(1)}% of GDP`),(i==="welfare"||i==="health"||i==="education")&&(t+=(c-o)*220)}if(a.minimumWage!==void 0&&(n.push(`minimum wage to ${(a.minimumWage*100).toFixed(0)}% of the median`),t+=(a.minimumWage-e.economy.macro.minimumWage)*30),a.sector){const i=[a.sector.subsidy!==void 0?`subsidy ${(a.sector.subsidy*100).toFixed(0)}%`:"",a.sector.regulation!==void 0?`regulation ${(a.sector.regulation*100).toFixed(0)}`:"",a.sector.stateOwnership!==void 0?`state share ${(a.sector.stateOwnership*100).toFixed(0)}%`:""].filter(Boolean);n.push(`${a.sector.id}: ${i.join(", ")}`)}return a.centralBankIndependent!==void 0&&n.push(a.centralBankIndependent?"central bank independence":"government control of the central bank"),{title:a.tax&&a.budget?"Budget and Finance Bill":a.tax?"Finance Bill":a.budget?"Appropriations Bill":a.minimumWage!==void 0?"Minimum Wage Bill":a.sector?`${Js(a.sector.id)} Sector Bill`:"Central Bank Bill",summary:n.join("; "),opinion:m(t,5,95)}}function Js(e){return e.charAt(0).toUpperCase()+e.slice(1)}function Ga(e,a,n){var r;const t=$s(a,n);if(!t.summary)return{ok:!1,message:"Nothing has changed."};if(Yr(a)){const i=a.legislature.chambers[0],s=a.executive.coalition[0]??((r=a.parties[0])==null?void 0:r.id)??"";return Object.values(e.bills).filter(l=>l.country===a.id&&(l.status==="introduced"||l.status==="in-committee")).length>=6?{ok:!1,message:"Parliament already has six government bills to get through."}:Wr(e,a.id,{title:t.title,summary:t.summary,body:"",category:n.tax||n.budget?"money":"ordinary",sponsorId:a.executive.headOfGovernmentId??"",sponsorPartyId:s,chamberId:i.id,passageChambers:[i.id],effects:{},cost:0,whipStrength:e.params.whipStrength,publicOpinion:t.opinion,policy:n})?{ok:!0,message:`${t.title} sent to the ${i.name}. The vote is in three weeks.`}:{ok:!1,message:"The bill could not be introduced."}}return Pt(a,n),a.executive.approval=m(a.executive.approval+(t.opinion-50)*.04,0,100),G(e,{kind:"legal",severity:"notice",country:a.id,title:`${a.name}: ${t.title.replace("Bill","Decree")}`,body:t.summary,tags:["decree"]}),{ok:!0,message:`Decreed: ${t.summary}`}}function Ws(e,a,n,t,r){var l,p,h,y,f,P,A,C,b,N,R;const i=String(t.type??"");if(i==="set-speed"){const u=ca(e,Number(t.speed??e.speed),t.paused===void 0?void 0:!!t.paused);return e.events.pop(),e.ticker.shift(),u}if(i==="advance")return a.advanceDays(m(Math.round(Number(t.days??30)),1,3650)),{ok:!0,message:`Advanced ${t.days} days.`};if(i==="choose-country"){const u=e.countries[String(t.country??"")];return!u||u.annexedBy?{ok:!1,message:"That state does not exist."}:(e.playerCountry=u.id,{ok:!0,message:`You now govern ${u.name}.`})}const s=e.playerCountry,o=s?e.countries[s]:void 0;if(!o)return{ok:!1,message:"Choose a country to govern first."};if(o.annexedBy)return{ok:!1,message:`${o.name} no longer exists.`};const c=o.economy;switch(i){case"apply-policy":{const u={};if(t.tax){u.tax={};for(const[d,g]of Object.entries(t.tax)){const S=d;Kn[S]!==void 0&&(u.tax[S]=m(Number(g),0,Kn[S]))}}if(t.budget){u.budget={};for(const[d,g]of Object.entries(t.budget)){const S=d;$n.includes(S)&&(u.budget[S]=m(Number(g),0,.5))}}return t.minimumWage!==void 0&&(u.minimumWage=m(Number(t.minimumWage),0,1)),Ga(e,o,u)}case"set-sector":return Ga(e,o,{sector:{id:String(t.id),subsidy:Ba(t.subsidy),regulation:Ba(t.regulation),stateOwnership:Ba(t.stateOwnership)}});case"set-rate":return c.centralBank.independent?{ok:!1,message:"The central bank is independent. It sets rates itself."}:c.centralBank.regime==="union"?{ok:!1,message:"Rates are set by the currency union."}:(c.monetary.centralBankRate=m(Number(t.value),-.01,5),{ok:!0,message:`Policy rate target set to ${(c.monetary.centralBankRate*100).toFixed(2)}%.`});case"set-independence":return Ga(e,o,{centralBankIndependent:!!t.value});case"set-printing":return c.centralBank.regime==="union"?{ok:!1,message:"A currency union member cannot print money."}:c.centralBank.independent?{ok:!1,message:"An independent central bank refuses to finance the deficit."}:(c.centralBank.printing=z(Number(t.value)),{ok:!0,message:c.centralBank.printing>0?`${(c.centralBank.printing*100).toFixed(0)}% of the deficit will be financed by printing money.`:"The printing presses stop."});case"set-target":return c.centralBank.target=m(Number(t.value),0,.2),{ok:!0,message:`Inflation target is now ${(c.centralBank.target*100).toFixed(1)}%.`};case"set-qe":return c.centralBank.regime==="union"?{ok:!1,message:"Asset purchases are run by the currency union."}:(c.centralBank.qe=m(Number(t.value),0,1),{ok:!0,message:`Central bank holdings set to ${(c.centralBank.qe*100).toFixed(0)}% of GDP.`});case"set-research":{const u=String(t.focus??"");return u!=="army"&&u!=="logistics"&&u!=="industry"&&u!=="navy"?{ok:!1,message:"Unknown field."}:(vt(o).focus=u,{ok:!0,message:`Research redirected to ${u}.`})}case"sponsor-firm":{const u=e.companies[String(t.company??"")];if(!u)return{ok:!1,message:"Pick an existing firm to fund — new ones come from the population."};if(u.country!==o.id)return{ok:!1,message:"That firm is not yours to fund."};if(u.insolvent)return{ok:!1,message:"That firm is already bankrupt."};const d=Math.max(1e6,c.gdp*.02);c.reserves>=d?c.reserves-=d:c.fiscal.debt+=d,u.debt=Math.max(0,u.debt-d*.7),u.valuation=Math.max(1e5,u.valuation*1.04),u.sharePrice=Math.max(.01,u.valuation/Math.max(1,u.shares??1));const g=Math.min(.02,d/Math.max(1,u.valuation))*10;return u.stateOwnership=m(u.stateOwnership+g,0,.95),o.executive.approval=m(o.executive.approval-1,0,100),G(e,{kind:"economic",severity:"notice",country:o.id,title:`${o.name} recapitalises ${u.name}`,body:`The treasury injects ${(d/1e9).toFixed(2)}B, taking its stake to ${(u.stateOwnership*100).toFixed(0)}%.`,tags:["firms","sponsorship"]}),{ok:!0,message:`${u.name} funded; the state now holds ${(u.stateOwnership*100).toFixed(0)}%.`}}case"crisis-response":{const u=rs(e,o,String(t.measure??""));return u.ok?{ok:!0,message:u.message}:{ok:!1,message:u.message}}case"set-regime":{const u=String(t.value);return u!=="float"&&u!=="peg"&&u!=="gold"?{ok:!1,message:"Unknown monetary regime."}:c.centralBank.regime==="union"?{ok:!1,message:"You would have to leave the currency union first."}:(c.centralBank.regime=u,u==="gold"&&(c.centralBank.target=0),G(e,{kind:"economic",severity:"major",country:o.id,title:`${o.name} moves to ${u==="float"?"a floating currency":u==="gold"?"the gold standard":"a currency peg"}`,body:"The monetary regime has changed.",tags:["monetary"]}),{ok:!0,message:"Monetary regime changed."})}case"stabilisation-plan":return c.monetary.inflation<.15?{ok:!1,message:"Inflation is not high enough to need this."}:(At(e,o),o.executive.approval=m(o.executive.approval-3,0,100),{ok:!0,message:"Stabilisation plan announced. Expect a short recession."});case"trade-barrier":{const u=e.countries[String(t.partner)];if(!u)return{ok:!1,message:"No such partner."};const d=z(Number(t.value));return o.tradeBarriers??(o.tradeBarriers={}),d<=0?delete o.tradeBarriers[u.id]:o.tradeBarriers[u.id]=d,o.relations[u.id]=m((o.relations[u.id]??0)-d*25,-100,100),u.relations[o.id]=m((u.relations[o.id]??0)-d*30,-100,100),u.tradeBarriers??(u.tradeBarriers={}),d>=.2&&u.id!==o.id&&(u.relations[o.id]??0)<10&&(u.tradeBarriers[o.id]=d*.6),(d>=1||d>=.25)&&G(e,{kind:"diplomatic",severity:"major",country:o.id,title:d>=1?`${o.name} embargoes ${u.name}`:`${o.name} raises tariffs on ${u.name}`,body:`An extra ${(d*100).toFixed(0)}% barrier on bilateral trade.`,actors:[o.id,u.id],tags:["trade"]}),{ok:!0,message:d>0?`${(d*100).toFixed(0)}% barrier on ${u.name}.`:`Trade with ${u.name} normalised.`}}case"sanction":return fa(e,o.id,String(t.target),String(t.kind??"financial"),n)?{ok:!0,message:"Sanctions imposed."}:{ok:!1,message:"Sanctions could not be imposed."};case"lift-sanction":{const u=e.sanctions[String(t.id)];return u!=null&&u.imposedBy.includes(o.id)?(Za(e,u.id),{ok:!0,message:"Sanctions lifted."}):{ok:!1,message:"Those are not your sanctions."}}case"declare-war":{const u=String(t.target);if(o.overlord&&o.dependencies)return{ok:!1,message:`${o.name} cannot declare war without its overlord.`};if(o.alliances.includes(u)){const g=Object.values(e.treaties).find(S=>S.active&&S.parties.includes(o.id)&&S.parties.includes(u));return{ok:!1,message:`${((l=e.countries[u])==null?void 0:l.name)??u} is your treaty ally${g?` under ${g.name}`:""}. Leave that treaty first, in the Foreign tab.`}}const d=xe(e,o.id,u,String(t.cause??"A territorial dispute."));return d?(o.executive.approval=m(o.executive.approval+(Ia(o.government)?2:-4),0,100),{ok:!0,message:d.name}):{ok:!1,message:"War could not be declared."}}case"send-aid":{const u=e.countries[String(t.target??"")];if(!u||u.id===o.id||u.annexedBy)return{ok:!1,message:"Choose a country to aid."};const d=m(Number(t.share??.01),5e-4,.05),g=o.economy.gdp*d;return o.economy.fiscal.debt+g>o.economy.gdp*3?{ok:!1,message:"You cannot borrow for that much aid."}:(o.economy.fiscal.debt+=g,u.economy.fiscal.debt=Math.max(0,u.economy.fiscal.debt-g),u.executive.approval=m(u.executive.approval+d*500,0,100),o.relations[u.id]=m((o.relations[u.id]??0)+5+d*300,-100,100),u.relations[o.id]=m((u.relations[o.id]??0)+8+d*400,-100,100),G(e,{kind:"diplomatic",severity:"notice",country:o.id,title:`${o.name} sends aid to ${u.name}`,body:`A grant of ${(d*100).toFixed(1)}% of national income.`,actors:[o.id,u.id],tags:["aid"]}),{ok:!0,message:`Aid sent to ${u.name}: ${(d*100).toFixed(1)}% of GDP. Relations improved.`})}case"set-divisions":{const u=m(Number(t.infantry??.6),0,1),d=m(Number(t.armour??.2),0,1),g=m(Number(t.artillery??.2),0,1),S=u+d+g;if(S<.5)return{ok:!1,message:"An army needs at least some of one arm."};o.military.divisions={infantry:u/S,armour:d/S,artillery:g/S};const B=Math.max(1e5,c.gdp*.002);return c.fiscal.debt+=B,{ok:!0,message:`Army reorganised: ${Math.round(d/S*100)}% armour, ${Math.round(g/S*100)}% artillery.`}}case"naval-invasion":{const u=String(t.target??""),d=e.countries[u];if(!d||d.id===o.id)return{ok:!1,message:"Pick another country to land in."};const g=Object.values(e.wars).find(Y=>Y.belligerents[o.id]&&Y.belligerents[d.id]);if(!g)return{ok:!1,message:`${d.name} is not at war with you. Declare war first.`};const S=o.military.branches.navy.active*(o.military.branches.navy.quality/100),B=d.military.branches.navy.active*(d.military.branches.navy.quality/100),M=S/Math.max(1,S+B),L=m(.2+M*.9+(((p=o.tech)==null?void 0:p.logistics)??0)*.015+(((h=o.tech)==null?void 0:h.navy)??0)*.03,.05,.95),k=String(t.place??"").slice(0,40)||d.name,$=Math.max(1e6,c.gdp*.008);return c.fiscal.debt+=$,o.military.branches.navy.active=Math.max(1,o.military.branches.navy.active*.95),n.chance(L)?(g.fronts.push({id:`${g.id}-landing-${g.fronts.length}`,name:`Landing at ${k}`,belligerents:[o.id,d.id],control:m(2+M*8,0,20),contestedOutput:0,openedAt:e.t,terrain:"coastal",attritionRate:6e-4,overseas:!0,theatre:d.id,axis:d.lon!==void 0&&d.lat!==void 0?[d.lon-2,d.lat,d.lon+2,d.lat]:void 0}),o.military.readiness=m(o.military.readiness+3,0,100),G(e,{kind:"military",severity:"catastrophic",country:o.id,title:`${o.name} lands at ${k}`,body:`A beachhead is open on the coast of ${d.name}. Cost so far ${($/1e9).toFixed(2)}B.`,tags:["war","invasion"]}),{ok:!0,message:`Beachhead established at ${k}.`}):(o.military.activeDuty=Math.max(1e3,o.military.activeDuty*.97),o.military.morale=m(o.military.morale-6,0,100),G(e,{kind:"military",severity:"major",country:o.id,title:`${o.name}: landing at ${k} repulsed`,body:`The convoy was turned back short of the beaches; ${($/1e9).toFixed(2)}B and a division are gone.`,tags:["war","invasion"]}),{ok:!1,message:`The landing at ${k} was repulsed.`})}case"special-op":{const u=String(t.target??""),d=e.countries[u],g=String(t.op??"sabotage");if(!d||d.id===o.id)return{ok:!1,message:"Pick another country."};const S=Math.max(1e5,c.gdp*.0015);c.fiscal.debt+=S;const B=m(.32+(((y=o.tech)==null?void 0:y.army)??0)*.03+(o.military.morale-50)*.004-d.cohesion*.002-(d.counterIntel??0)*.02,.05,.9),M=n.chance(B);if(d.relations[o.id]=m((d.relations[o.id]??0)-12,-100,100),d.counterIntel=Math.min(20,(d.counterIntel??0)+1.5),!M)return o.executive.approval=m(o.executive.approval-3,0,100),G(e,{kind:"military",severity:"notice",country:o.id,title:`${o.name}: operation in ${d.name} blown`,body:`The team was rolled up. ${d.name} protests and the cost (${(S/1e9).toFixed(2)}B) is sunk.`,tags:["covert"]}),{ok:!1,message:"The operation failed and was exposed."};if(g==="sabotage"){for(const L of d.economy.sectors)L.capacity*=.96;d.economy.macro.businessConfidence=m(d.economy.macro.businessConfidence-4,0,100)}else g==="decapitation"?(d.executive.approval=m(d.executive.approval-12,0,100),d.cohesion=m(d.cohesion-5,0,100)):g==="interdiction"?(d.military.readiness=m(d.military.readiness-10,0,100),d.military.morale=m(d.military.morale-6,0,100)):(o.military.readiness=m(o.military.readiness+6,0,100),o.military.morale=m(o.military.morale+4,0,100));return G(e,{kind:"military",severity:"major",country:o.id,title:`${o.name}: ${g} in ${d.name}`,body:`The operation succeeded. ${d.name} blames saboteurs.`,tags:["covert"]}),{ok:!0,message:`${g} in ${d.name} succeeded.`}}case"set-stance":{const u=e.wars[String(t.war)],d=String(t.stance);return!u||u.endedAt||!u.belligerents[o.id]?{ok:!1,message:"You are not fighting that war."}:d!=="offensive"&&d!=="balanced"&&d!=="defensive"?{ok:!1,message:"Unknown orders."}:(u.stance={...u.stance,[o.id]:d},{ok:!0,message:d==="offensive"?"Offensive ordered. Casualties will rise.":d==="defensive"?"Your forces dig in.":"Normal operations."})}case"propose-peace":{const u=e.wars[String(t.war)],d=String(t.enemy??"");if(!u||u.endedAt||!u.belligerents[o.id])return{ok:!1,message:"You are not fighting that war."};if(!u.belligerents[d]||d===o.id)return{ok:!1,message:"That side is not in this war."};const g=e.countries[d],S=ms(u,o.id,d,e.countries),B=t.drawn,M={annexOccupied:!!t.annexOccupied&&S.mine>0,annexWhole:!!t.annexWhole&&S.mine>=.8,cede:!!t.cede&&S.theirs>0,drawnShare:B?m(Number(B.share),0,1):0,reparations:m(Number(t.reparations??0),-.3,.3)};if(t.annexWhole&&!M.annexWhole)return{ok:!1,message:"You need to hold at least 80% of a country to annex all of it."};const L=Ct(M,u.aims,d);if(!ds(M,S,u.aims,d))return{ok:!1,message:`${(g==null?void 0:g.name)??((P=(f=u.rebels)==null?void 0:f[d])==null?void 0:P.name)??"The enemy"} refuses. These terms ask for ${(Nt(M,S)-L).toFixed(0)} and your position only supports ${S.leverage.toFixed(0)}.`};const k=[],$=!!(M.annexWhole||M.annexOccupied&&S.mine>0&&Array.isArray(t.occupiedRing)||(M.drawnShare??0)>0&&(((A=B==null?void 0:B.ring)==null?void 0:A.length)??0)>=3),Y=!!t.puppet&&!!g&&$,Q=String(t.puppetName??"").trim()||`${(g==null?void 0:g.name)??d} Protectorate`;let Z=null;Y&&g&&!M.annexWhole&&(Z=Rs(e,o.id,d,Q));const ce=(Z==null?void 0:Z.id)??o.id;if(Z&&k.push(`${Z.name} is set up under your protection`),g&&M.annexWhole&&Y){const O=bs(e,o.id,d);k.push(O?`${g.name} becomes your puppet`:`${g.name} stays independent`)}else if(g&&M.annexWhole)qe(e,o.id,d,`${g.name} is annexed under the peace terms.`),k.push(`${g.name} is annexed`);else if(g){const O=S.mineFront>=0?u.fronts[S.mineFront]:void 0,U=O?ze(u,O,e.countries):null,F=t.occupiedRing;M.annexOccupied&&U&&F&&F.length>=3&&(Na(e,U.territory,ce,U.share,F,Z?`Granted to ${Z.name}`:`Annexed from ${((C=e.countries[U.territory])==null?void 0:C.name)??U.territory}`),k.push(Z?`${Z.name} receives ${(U.share*100).toFixed(1)}% of ${(b=e.countries[U.territory])==null?void 0:b.name}`:`you annex ${(U.share*100).toFixed(1)}% of ${(N=e.countries[U.territory])==null?void 0:N.name}`)),B&&M.drawnShare&&(Na(e,d,ce,M.drawnShare,B.ring,Z?`Granted to ${Z.name}`:`Annexed from ${g.name}`),k.push(Z?`${Z.name} receives the land you marked`:`you take the land you marked, ${(M.drawnShare*100).toFixed(1)}% of ${g.name}`))}if(g&&M.cede){const O=u.fronts[S.theirsFront],U=O?ze(u,O,e.countries):null,F=t.cededRing;U&&F&&F.length>=3&&(Na(e,U.territory,d,U.share,F,`Ceded by ${o.name}`),k.push(`you cede ${(U.share*100).toFixed(1)}% of ${(R=e.countries[U.territory])==null?void 0:R.name}`))}if(g&&M.reparations){const O=g.economy.gdp*Math.abs(M.reparations),U=M.reparations>0?g:o,F=M.reparations>0?o:g;U.economy.fiscal.debt+=O,F.economy.fiscal.debt=Math.max(0,F.economy.fiscal.debt-O),k.push(`${U.name} pays ${(O/1e9).toFixed(1)}B in reparations`)}const oe=[o.id,...u.belligerents[o.id]??[]];for(const O of u.fronts)O.belligerents.includes(o.id)&&O.belligerents.includes(d)&&(O.theatre="none");const de=Object.keys(u.belligerents).filter(O=>O!==o.id&&O!==d);if(de.length&&(delete u.belligerents[o.id],u.fronts=u.fronts.filter(O=>!O.belligerents.includes(o.id))),!de.length||!u.fronts.length){u.endedAt=Math.max(1,e.t),u.outcome=M.annexOccupied||M.annexWhole||M.drawnShare?"victory":M.cede?"defeat":"white-peace";for(const O of Object.keys(u.belligerents)){const U=e.countries[O];U&&(U.wars=U.wars.filter(F=>F!==u.id));for(const F of u.belligerents[O]??[]){const w=e.countries[F];w&&(w.wars=w.wars.filter(he=>he!==u.id))}}}for(const O of oe){const U=e.countries[O];U&&(U.wars=U.wars.filter(F=>F!==u.id))}const q=k.length?k.join("; "):"a return to the old borders";return G(e,{kind:"military",severity:"major",country:o.id,title:`Peace ends the ${u.name}`,body:`Terms: ${q}.`,actors:[o.id,d],tags:["war","peace"]}),{ok:!0,message:`Peace signed: ${q}.`}}case"seek-peace":{const u=e.wars[String(t.war)];if(!u||u.endedAt||!u.belligerents[o.id])return{ok:!1,message:"You are not fighting that war."};const d=u.exhaustion[o.id]??0,g=Object.keys(u.belligerents).filter(k=>k!==o.id),S=g.reduce((k,$)=>k+(u.exhaustion[$]??0),0)/Math.max(1,g.length),B=u.fronts.find(k=>k.belligerents.includes(o.id)),M=B?B.belligerents[0]===o.id?B.control:-B.control:0;if(S+Math.max(0,M)*.3<28&&!t.force)return{ok:!1,message:"The enemy still believes it can win. They refuse to talk yet."};const L=M<-25?c.gdp*m((-M-25)*.002,.01,.2):0;L>0&&(c.fiscal.debt+=L),u.endedAt=Math.max(1,e.t),u.outcome="white-peace";for(const k of Object.keys(u.belligerents)){const $=e.countries[k];$&&($.wars=$.wars.filter(Y=>Y!==u.id));for(const Y of u.belligerents[k]??[]){const Q=e.countries[Y];Q&&(Q.wars=Q.wars.filter(Z=>Z!==u.id))}}return G(e,{kind:"military",severity:"major",country:o.id,title:`Peace ends the ${u.name}`,body:L>0?`${o.name} accepts terms and pays ${(L/1e9).toFixed(1)}B in reparations.`:"A negotiated peace on the current lines.",actors:Object.keys(u.belligerents),tags:["war","peace"]}),{ok:!0,message:"Peace signed."+(d>70?" Your army was close to breaking.":"")}}case"offer-treaty":{const u=e.countries[String(t.partner)],d=String(t.kind??"trade");if(!u)return{ok:!1,message:"No such state."};const g=u.relations[o.id]??0,S={alliance:45,"defensive-pact":40,trade:-5,"customs-union":25,"non-aggression":-25};if(g<(S[d]??20))return{ok:!1,message:`${u.name} declines. Relations of ${g.toFixed(0)} are too low; they want ${S[d]??20}.`};const B=Ya(e,d,[o.id,u.id],[`Signed by ${o.name} and ${u.name}.`],n,Math.min(c.gdp,u.economy.gdp)*.01);return B?{ok:!0,message:`${B.name} signed.`}:{ok:!1,message:"The treaty failed."}}case"leave-treaty":{const u=e.treaties[String(t.id)];if(!(u!=null&&u.parties.includes(o.id)))return{ok:!1,message:"You are not party to that treaty."};u.parties=u.parties.filter(d=>d!==o.id),u.parties.length<2&&(u.active=!1),o.alliances=o.alliances.filter(d=>!u.parties.includes(d));for(const d of u.parties){o.relations[d]=m((o.relations[d]??0)-25,-100,100);const g=e.countries[d];g&&(g.relations[o.id]=m((g.relations[o.id]??0)-25,-100,100),g.alliances=g.alliances.filter(S=>S!==o.id))}return G(e,{kind:"diplomatic",severity:"major",country:o.id,title:`${o.name} leaves ${u.name}`,body:"The treaty partners are not pleased.",tags:["treaty"]}),{ok:!0,message:`Left ${u.name}.`}}case"diplomatic-mission":{const u=e.countries[String(t.partner)];if(!u)return{ok:!1,message:"No such state."};const d=c.gdp*2e-4;c.fiscal.debt+=d;const g=n.float(3,9);return u.relations[o.id]=m((u.relations[o.id]??0)+g,-100,100),o.relations[u.id]=m((o.relations[u.id]??0)+g,-100,100),{ok:!0,message:`Relations with ${u.name} improve by ${g.toFixed(0)}.`}}case"imf-bailout":{if(e.startDate.year<1950)return{ok:!1,message:"There is no IMF in this era. Try the London bankers."};if(c.macro.riskPremium<.05&&!c.macro.defaulted)return{ok:!1,message:"Your borrowing costs are not bad enough to qualify."};const u=c.gdp*.1;c.reserves+=u,c.macro.riskPremium*=.6,c.macro.debtCost*=.85,c.macro.bailout=!0,c.macro.defaulted=!1;for(const d of $n)c.budget[d]*=d==="defence"?.85:.92;return c.tax.vat=m(c.tax.vat*1.1,0,.3),c.centralBank.printing=0,o.executive.approval=m(o.executive.approval-9,0,100),G(e,{kind:"economic",severity:"major",country:o.id,title:`${o.name} accepts an IMF programme`,body:`A ${(u/1e9).toFixed(0)}B loan comes with spending cuts and a VAT rise.`,tags:["debt"]}),{ok:!0,message:"IMF programme agreed. Austerity follows."}}case"default":{if(c.macro.defaulted)return{ok:!1,message:"You are already in default."};const u=m(Number(t.haircut??.4),.1,.8);return c.fiscal.debt*=1-u,c.macro.defaulted=!0,c.macro.shock-=.06,c.macro.shockDecay=.8,o.executive.approval=m(o.executive.approval-8,0,100),G(e,{kind:"economic",severity:"catastrophic",country:o.id,title:`${o.name} repudiates its debts`,body:`Bondholders lose ${(u*100).toFixed(0)}%. International lending dries up.`,tags:["crisis","debt"]}),{ok:!0,message:"You have defaulted."}}case"nationalise-all":case"privatise-all":{const u=i==="nationalise-all";let d=0,g=0;for(const S of Object.values(e.companies))if(!(S.country!==o.id||S.insolvent)&&!(u?S.stateOwnership>=.99:S.stateOwnership<=.01)){if(u){g+=S.valuation*(1-S.stateOwnership)*.6,S.stateOwnership=1,S.listed=!1;for(const B of e.markets.exchanges)B.listings=B.listings.filter(M=>M!==S.id)}else{g-=S.valuation*S.stateOwnership,S.stateOwnership=0;const B=e.markets.exchanges.find(M=>M.country===o.id);B&&(S.exchangeId=B.id,S.listed=!0,B.listings.includes(S.id)||B.listings.push(S.id))}d+=1}return d?(o.economy.fiscal.debt=Math.max(0,o.economy.fiscal.debt+g),o.economy.macro.businessConfidence=m(o.economy.macro.businessConfidence+(u?-4:4),0,100),G(e,{kind:"corporate",severity:"major",country:o.id,title:`${o.name} ${u?"nationalises":"privatises"} ${d} firms`,body:u?`Compensation of ${(g/1e9).toFixed(1)}B is added to the debt.`:`The sales raise ${(-g/1e9).toFixed(1)}B to pay down debt.`,tags:["corporate"]}),{ok:!0,message:`${d} firms ${u?"nationalised":"privatised"}.`}):{ok:!1,message:"There is nothing to change ownership of."}}case"nationalise":case"privatise":{const u=e.companies[String(t.company)];return!u||u.country!==o.id?{ok:!1,message:"That company is outside your jurisdiction."}:Vs(e,o,u,i==="nationalise")}case"bail-out":{const u=e.companies[String(t.company)];if(!u||u.country!==o.id)return{ok:!1,message:"That company is outside your jurisdiction."};const d=Math.max(u.debt*.7,u.revenue*.1);return c.fiscal.debt+=d,u.debt-=Math.min(u.debt,d),u.insolvent=!1,u.stateOwnership=z(u.stateOwnership+.2),G(e,{kind:"corporate",severity:"major",country:o.id,title:`${o.name} bails out ${u.name}`,body:`The state takes on ${(d/1e9).toFixed(1)}B and a 20% stake.`,tags:["corporate"]}),{ok:!0,message:`${u.name} rescued for ${(d/1e9).toFixed(1)}B.`}}case"set-policy-lever":{const u=String(t.area);return u in o.policies?(o.policies[u]=m(Number(t.value),-100,100),{ok:!0,message:`${u} stance updated.`}):{ok:!1,message:"Unknown policy."}}case"appoint":{const u=String(t.area),d=o.executive.ministers.find(B=>B.id===u),g=String(t.name??"").trim().slice(0,60);if(!d||!g)return{ok:!1,message:"Choose a post and a name."};const S={id:`ch-${o.id}-apt-${e.dayCount}-${u}`,name:g,country:o.id,role:"minister",partyId:o.executive.coalition[0],stats:{competence:Math.round(n.normal()*22+20),charisma:Math.round(n.normal()*22),integrity:Math.round(n.normal()*25),ambition:30,ideology:o.ideology,popularity:50,experience:45,militancy:0},createdAt:e.t};return e.characters[S.id]=S,d.characterId=S.id,{ok:!0,message:`${g} is the new ${d.title}.`,data:{competence:S.stats.competence}}}case"emergency-powers":{if(Ia(o.government))return{ok:!1,message:"You already rule by decree."};const u=!!t.value;return o.executive.emergencyPowers=u,o.executive.approval=m(o.executive.approval-(u?12:-4),0,100),o.cohesion=m(o.cohesion-(u?8:0),0,100),G(e,{kind:"political",severity:"major",country:o.id,title:u?`${o.name}: state of emergency declared`:`${o.name}: state of emergency lifted`,body:u?"Parliament is bypassed. The government rules by decree.":"Normal government resumes.",tags:["emergency"]}),{ok:!0,message:u?"You now rule by emergency decree.":"Emergency powers ended."}}case"call-election":return o.nextElectionAt===void 0?{ok:!1,message:"There are no elections here."}:(o.nextElectionAt=e.t+45*86400,G(e,{kind:"political",severity:"major",country:o.id,title:`${o.name}: snap election called`,body:"Voters go to the polls in six weeks.",tags:["election"]}),{ok:!0,message:"Snap election in six weeks."});case"military":{const u=o.military;if(t.mobilise!==void 0){const d=Math.round(u.reserves*z(Number(t.mobilise)));return u.reserves-=d,u.activeDuty+=d,c.macro.nairu=m(c.macro.nairu-.002,.01,.3),{ok:!0,message:`${d.toLocaleString("en-US")} reservists called up.`}}if(t.conscription!==void 0){const d=!!t.conscription;return d===u.conscription?{ok:!1,message:d?"Conscription is already in force.":"There is no conscription to end."}:(u.conscription=d,u.reserves=Math.round(d?u.reserves*1.5:u.reserves/1.5),{ok:!0,message:d?"Conscription introduced.":"Conscription abolished."})}return{ok:!1,message:"No military order given."}}default:return{ok:!1,message:`Unknown command "${i}".`}}}function Vs(e,a,n,t){if(t){if(n.stateOwnership>=.99)return{ok:!1,message:`${n.name} is already state owned.`};const s=n.valuation*(1-n.stateOwnership)*.6;a.economy.fiscal.debt+=s,n.stateOwnership=1,n.listed=!1;for(const o of e.markets.exchanges)o.listings=o.listings.filter(c=>c!==n.id);return e.markets.riskAppetite=m(e.markets.riskAppetite-n.valuation/Math.max(1,e.globals.globalGdp)*30,1,99),a.economy.macro.businessConfidence=m(a.economy.macro.businessConfidence-6,0,100),G(e,{kind:"corporate",severity:"major",country:a.id,title:`${a.name} nationalises ${n.name}`,body:`Owners are compensated ${(s/1e9).toFixed(1)}B. Investors take note.`,tags:["corporate"]}),{ok:!0,message:`${n.name} nationalised for ${(s/1e9).toFixed(1)}B.`}}if(n.stateOwnership<=.01)return{ok:!1,message:`${n.name} is not state owned.`};const r=n.valuation*n.stateOwnership;a.economy.fiscal.debt=Math.max(0,a.economy.fiscal.debt-r),n.stateOwnership=0;const i=e.markets.exchanges.find(s=>s.country===a.id);return i&&(n.exchangeId=i.id,n.listed=!0,i.listings.includes(n.id)||i.listings.push(n.id)),G(e,{kind:"corporate",severity:"major",country:a.id,title:`${a.name} privatises ${n.name}`,body:`The sale raises ${(r/1e9).toFixed(1)}B to pay down debt.`,tags:["corporate"]}),{ok:!0,message:`${n.name} sold for ${(r/1e9).toFixed(1)}B.`}}function Ba(e){return e==null?void 0:Number(e)}async function ws(e,a,n,t,r){switch(t.op){case"speed":return ca(e,Number(t.speed??1),t.paused===void 0?void 0:!!t.paused);case"pause":return ca(e,e.speed,!0);case"resume":return ca(e,e.speed||1,!1);case"fast-forward":{const i=Number(t.days??30);return Ks(e,a,i*86400)}case"set-param":{const i=String(t.key??"");if(!(i in e.params))return{ok:!1,message:`Unknown parameter "${i}"`};const s=re(e.params,i);return Re(e.params,i,Number(t.value))?(G(e,{kind:"system",severity:"notice",title:`Parameter ${i} changed`,body:`${s} -> ${t.value} by ${r.username}`,byUserId:r.id,tags:["dev","params"]}),{ok:!0,message:`${i} = ${t.value}`}):{ok:!1,message:`Could not set ${i}`}}case"reset-params":{const i=ua(e.scenarioId);return e.params={...i.params},G(e,{kind:"system",severity:"notice",title:"Parameters reset",body:`Restored scenario defaults by ${r.username}`,byUserId:r.id,tags:["dev"]}),{ok:!0,message:"Parameters reset to scenario defaults"}}case"set-stat":{const i=String(t.scope??"country"),s=String(t.id??""),o=String(t.path??""),c=i==="country"?e.countries[s]??e.customCountries[s]:i==="company"?e.companies[s]:i==="global"?e:e.markets;if(!c)return{ok:!1,message:`No ${i} "${s}"`};const l=re(c,o);return Number.isFinite(l)?Re(c,o,Number(t.value))?(G(e,{kind:"system",severity:"major",country:i==="country"?s:void 0,title:`${r.username} edited ${s}`,body:`${o}: ${l} -> ${t.value}`,byUserId:r.id,tags:["dev","stat"]}),{ok:!0,message:`${s}.${o} = ${t.value}`,data:{before:l,after:Number(t.value)}}):{ok:!1,message:"Write refused"}:{ok:!1,message:`Path "${o}" does not resolve to a number`}}case"inspect":{const i=String(t.scope??"country"),s=String(t.id??""),o=i==="company"?e.companies[s]:i==="global"?e:i==="market"?e.markets:e.countries[s]??e.customCountries[s];return o?{ok:!0,message:"ok",data:o}:{ok:!1,message:`No ${i} "${s}"`}}case"grant":{const i=e.countries[String(t.id??"")];if(!i)return{ok:!1,message:"No such country"};const s=Number(t.amount??0),o=String(t.where??"treasury");return o==="treasury"?i.economy.fiscal.treasury+=s:o==="gdp"?(i.economy.gdp+=s,i.economy.gdpPerCapita=i.economy.gdp/i.economy.population):o==="reserves"?i.economy.reserves+=s:o==="debt"?i.economy.fiscal.debt+=s:i.economy.fiscal.treasury+=s,G(e,{kind:"economic",severity:"major",country:i.id,title:`${r.username} adjusted ${i.name}'s books`,body:`${o} ${s>=0?"+":""}${s.toLocaleString()} credits.`,byUserId:r.id,tags:["dev","money"]}),{ok:!0,message:`${s>=0?"+":""}${s.toLocaleString()} credits to ${i.name} (${o})`}}case"mint":{const i=e.countries[String(t.id??"")];return i?(i.economy.fiscal.treasury+=Math.abs(Number(t.amount??0)),i.economy.monetary.moneySupply=m(i.economy.monetary.moneySupply+.02,.05,40),{ok:!0,message:`Minted ${Number(t.amount??0).toLocaleString()} credits in ${i.name}`}):{ok:!1,message:"No such country"}}case"delete-company":{const i=e.companies[String(t.id??"")];if(!i)return{ok:!1,message:"No such company"};delete e.companies[i.id];for(const s of e.markets.exchanges)s.listings=s.listings.filter(o=>o!==i.id);return G(e,{kind:"corporate",severity:"major",country:i.country,title:`${i.name} dissolved`,body:`Removed by ${r.username}. ${i.employees.toLocaleString()} jobs affected.`,byUserId:r.id,tags:["dev","company"]}),{ok:!0,message:`${i.name} dissolved`}}case"ban-company":{const i=e.companies[String(t.id??"")];if(!i)return{ok:!1,message:"No such company"};if(i.banned=!!(t.banned??!0),i.bannedReason=String(t.reason??"Banned by staff"),i.banned){i.listed=!1;for(const s of e.markets.exchanges)s.listings=s.listings.filter(o=>o!==i.id)}return G(e,{kind:"corporate",severity:"major",country:i.country,title:`${i.name} ${i.banned?"banned":"reinstated"}`,body:i.bannedReason,byUserId:r.id,tags:["dev","company"]}),{ok:!0,message:i.banned?`${i.name} banned`:`${i.name} reinstated`}}case"delete-character":{const i=e.characters[String(t.id??"")];if(!i)return{ok:!1,message:"No such character"};i.removedAt=e.t;const s=e.countries[i.country];if(s){if(s.executive.headOfStateId===i.id&&(s.executive.headOfStateId=void 0),s.executive.headOfGovernmentId===i.id&&(s.executive.headOfGovernmentId=void 0),s!=null&&s.legislature)for(const o of Object.values(s.legislature.membership)){const c=o.indexOf(i.id);c>=0&&o.splice(c,1)}for(const o of s.parties)o.leaderId===i.id&&(o.leaderId=void 0)}return G(e,{kind:"political",severity:"major",country:i.country,title:`${i.name} removed from office`,body:`Removed by ${r.username}. ${t.reason??""}`,byUserId:r.id,tags:["dev","character"]}),{ok:!0,message:`${i.name} removed`}}case"ban-character":{const i=e.characters[String(t.id??"")];return i?(i.banned=!!(t.banned??!0),i.banned?i.removedAt=e.t:i.removedAt=void 0,{ok:!0,message:i.banned?`${i.name} banned`:`${i.name} unbanned`}):{ok:!1,message:"No such character"}}case"create-character":{const i=e.countries[String(t.country??"")];if(!i)return{ok:!1,message:"No such country"};const s=`ch-${i.id}-dev-${Math.round(e.t)}`,o={id:s,name:String(t.name??"New Figure"),country:i.id,role:t.role??"minister",partyId:t.partyId?String(t.partyId):void 0,stats:{competence:Number(t.competence??50),charisma:Number(t.charisma??50),integrity:Number(t.integrity??50),ambition:Number(t.ambition??50),ideology:Number(t.ideology??i.ideology),popularity:Number(t.popularity??50),experience:Number(t.experience??50),militancy:Number(t.militancy??0)},createdAt:e.t};if(e.characters[s]=o,t.asHeadOfGovernment&&(i.executive.headOfGovernmentId=s),t.asHeadOfState&&(i.executive.headOfStateId=s),t.asMinister){const c=i.executive.ministers.find(l=>l.id===String(t.area??"economy"));c&&(c.characterId=s)}return{ok:!0,message:`${o.name} created`,data:{id:s}}}case"ban-party":{const i=e.parties[String(t.id??"")];return i?(i.banned=!!(t.banned??!0),i.banned&&(i.status="outside",js(e,i.country,i.id)),{ok:!0,message:i.banned?`${i.name} banned`:`${i.name} unbanned`}):{ok:!1,message:"No such party"}}case"remove-leader":{const i=e.countries[String(t.id??"")];if(!i)return{ok:!1,message:"No such country"};if(t.which==="head-of-state")i.executive.headOfStateId=void 0;else if(t.which==="head-of-government")i.executive.headOfGovernmentId=void 0;else{const s=i.executive.ministers.find(o=>o.id===String(t.area??""));s&&(s.characterId=void 0)}return{ok:!0,message:`${t.which??"leader"} removed`}}case"remove-country":{const i=e.countries[String(t.id??"")];return i?(i.annexedBy=String(t.by??"INT"),i.banned=!!(t.banned??!0),i.dependencies={},je(e),G(e,{kind:"political",severity:"catastrophic",country:i.id,title:`${i.name} ceases to exist`,body:`Abolished by ${r.username}. ${t.reason??""}`,byUserId:r.id,tags:["dev","country"]}),{ok:!0,message:`${i.name} abolished`}):{ok:!1,message:"No such country"}}case"restore-country":{const i=e.countries[String(t.id??"")];return i?(i.annexedBy=void 0,i.banned=!1,je(e),{ok:!0,message:`${i.name} restored`}):{ok:!1,message:"No such country"}}case"declare-war":{const i=xe(e,String(t.attacker??""),String(t.defender??""),String(t.cause??"Dev intervention"),r.id);return i?{ok:!0,message:i.name}:{ok:!1,message:"Could not declare war"}}case"end-war":{const i=e.wars[String(t.id??"")];if(!i)return{ok:!1,message:"No such war"};i.endedAt=e.t,i.outcome="white-peace";for(const s of Object.keys(i.belligerents)){const o=e.countries[s];o&&(o.wars=o.wars.filter(c=>c!==i.id))}return G(e,{kind:"military",severity:"major",title:`${i.name} ended by order`,body:`${r.username} imposed a ceasefire.`,byUserId:r.id,tags:["dev","war"]}),{ok:!0,message:`${i.name} ended`}}case"annex":return qe(e,String(t.annexer??""),String(t.target??""),String(t.cause??"Dev intervention"),r.id),{ok:!0,message:"Annexed"};case"treaty":{const i=Ya(e,t.kind??"alliance",t.parties??[],t.terms??[],n,Number(t.tradeBonus??0),r.id);return i?{ok:!0,message:i.name}:{ok:!1,message:"Treaty could not be signed"}}case"sanction":return fa(e,String(t.by??""),String(t.on??""),t.kind??"financial",n,r.id)?{ok:!0,message:"Sanctions imposed"}:{ok:!1,message:"Could not impose sanctions"};case"lift-sanction":return Za(e,String(t.id??""),r.id),{ok:!0,message:"Sanctions lifted"};case"force-election":{const i=e.countries[String(t.country??"")];if(!(i!=null&&i.legislature))return{ok:!1,message:"No legislature"};const s=i.legislature.chambers.find(o=>o.id===t.chamberId)??i.legislature.chambers[0];if(!s||s.election==="none")return{ok:!1,message:"This country does not hold elections"};for(const o of i.elections)o.status!=="complete"&&(o.status="complete");return i.elections.push({id:`elec-${i.id}-forced-${Math.round(e.t)}`,country:i.id,chamberId:s.id,kind:s.election,scheduledAt:e.t,endsAt:e.t+20*86400,status:"campaign",votes:{},turnout:{},districtCount:60,districtPopulations:Array.from({length:60},()=>1/60),projection:{},enthusiasm:70,districtNames:Array.from({length:60},(o,c)=>`Extraordinary Constituency ${c+1}`)}),G(e,{kind:"political",severity:"major",country:i.id,title:`${i.name} calls an extraordinary election`,body:`Called by ${r.username}.`,byUserId:r.id,tags:["dev","election"]}),{ok:!0,message:"Election forced"}}case"raise-referendum":{const i=e.countries[String(t.country??"")];return i?(i.referendums.push({id:`ref-${i.id}-dev-${Math.round(e.t)}`,country:i.id,question:String(t.question??"Shall the current government continue?"),calledBy:r.id,at:e.t,closesAt:e.t+30*86400,options:[{id:"yes",label:"Yes",yes:0},{id:"no",label:"No",yes:0}],status:"open",turnout:.6}),{ok:!0,message:"Referendum called"}):{ok:!1,message:"No such country"}}case"form-party":{const i=e.countries[String(t.country??"")];if(!i)return{ok:!1,message:"No such country"};const s=`${i.id}-party-dev-${Math.round(e.t)}`,o={id:s,country:i.id,name:String(t.name??"New Movement"),abbreviation:String(t.abbreviation??"NM"),ideology:Number(t.ideology??0),cohesion:70,popularity:Number(t.popularity??12),color:String(t.color??"#8e44ad"),seats:{},treasury:1e8,memberCount:1e3,status:"outside",platform:Object.fromEntries(["economy","tax","welfare","health","education","environment","defence","immigration","foreign-policy","justice","technology","housing","energy","transport","agriculture","labour"].map(c=>[c,Number(t.ideology??0)])),founded:e.t};return i.parties.push(o),e.parties[s]=o,G(e,{kind:"political",severity:"major",country:i.id,title:`${o.name} founded in ${i.name}`,body:`A new party with ${o.ideology<0?"left":"right"} leanings. Created by ${r.username}.`,byUserId:r.id,tags:["dev","party"]}),{ok:!0,message:`${o.name} founded`,data:{id:s}}}case"delete-party":{const i=e.parties[String(t.id??"")];if(!i)return{ok:!1,message:"No such party"};const s=e.countries[i.country];return s&&(s.parties=s.parties.filter(o=>o.id!==i.id)),delete e.parties[i.id],{ok:!0,message:`${i.name} dissolved`}}case"add-directive":return{ok:!0,message:"Directive added",data:kt(e,t.directive)};case"remove-directive":{const i=e.directives.length;return e.directives=e.directives.filter(s=>s.id!==String(t.id??"")),{ok:!0,message:i===e.directives.length?"No such directive":"Directive removed"}}case"toggle-directive":{const i=e.directives.find(s=>s.id===String(t.id??""));return i?(i.enabled=!!t.enabled,{ok:!0,message:`Directive ${i.enabled?"enabled":"disabled"}`}):{ok:!1,message:"No such directive"}}case"add-rule":{const i=Fs(e,t.rule);return G(e,{kind:"system",severity:"notice",title:`Rule installed: ${i.name}`,body:`Authored by ${r.username}.`,byUserId:r.id,tags:["dev","rule"]}),{ok:!0,message:`Rule "${i.name}" installed`,data:i}}case"remove-rule":{const i=e.directives.length;return e.directives=e.directives.filter(s=>!(s.kind==="custom-rule"&&s.rule.id===String(t.id??""))),{ok:!0,message:i===e.directives.length?"No such rule":"Rule removed"}}case"toggle-rule":{const i=e.directives.find(s=>s.kind==="custom-rule"&&s.rule.id===String(t.id??""));return i?(i.rule.enabled=!!t.enabled,i.enabled=i.rule.enabled,{ok:!0,message:`Rule ${i.rule.enabled?"enabled":"disabled"}`}):{ok:!1,message:"No such rule"}}case"console":{const i=za(e,String(t.code??""));return G(e,{kind:"system",severity:"info",title:"Console command",body:String(t.code??""),byUserId:r.id,tags:["dev","console"]}),{ok:!0,message:i??"No output",data:{result:i}}}case"patch-scenario":{const i=String(t.path??""),s=t.patch;if(!i||!s)return{ok:!1,message:"Need a path and a patch object"};const o=re(e.scenarioOverrides,i);return Ys(e.scenarioOverrides,i,s),G(e,{kind:"system",severity:"major",title:"Scenario data edited",body:`${i} patched by ${r.username}.`,byUserId:r.id,tags:["dev","scenario"]}),{ok:!0,message:`Patched ${i}`,data:{before:o}}}case"reset-world":{const i=ua(e.scenarioId),s=La(i,e.name,e.id,Date.now(),e.playerCountry);return s.paused=e.paused,je(s),G(s,{kind:"system",severity:"major",title:"World reset",body:`Rebuilt from the ${i.name} scenario by ${r.username}.`,byUserId:r.id,tags:["dev","reset"]}),{ok:!0,message:"World rebuilt from scenario",replaced:s}}case"set-market":{const i=String(t.path??""),s=re(e.markets,i);return Re(e.markets,i,Number(t.value))?{ok:!0,message:`${i}: ${s} -> ${t.value}`}:{ok:!1,message:"Write refused"}}default:return{ok:!1,message:`Unknown op "${t.op}"`}}}function js(e,a,n,t){const r=e.countries[a];r&&(r.executive.coalition=r.executive.coalition.filter(i=>i!==n))}function Ys(e,a,n){const t=a.split(".");let r=e;for(let i=0;i<t.length-1;i++)(typeof r[t[i]]!="object"||r[t[i]]===null)&&(r[t[i]]={}),r=r[t[i]];r[t[t.length-1]]=n}const Ye=self;let _=null,fe=null,na=null,qa=null,Tt=-1,It=0,Da=0,ka=0,Xa=!1,Ze=null;const Zs=300,zs=6e4;function qs(e,a){const n=e.economy;return{...e,relations:a?e.relations:void 0,economy:{...n,history:a?n.history:[],macro:{...n.macro,realHistory:[],priceHistory:[]}}}}function Xs(e){return e}function _s(){const e=_,a=Object.values(e.wars);return{type:"patch",countries:Object.values(e.countries).map(n=>qs(n,n.id===qa||n.id===e.playerCountry)),companies:Object.values(e.companies).map(Xs),wars:a,treaties:Object.values(e.treaties).filter(n=>n.active),sanctions:Object.values(e.sanctions),bills:Object.values(e.bills).slice(-60),characters:e.characters,markets:e.markets,ticker:e.ticker.slice(0,60),events:e.events.slice(-40),control:e.control,regions:e.regions,t:e.t,version:e.version,paused:e.paused,speed:e.speed,globals:e.globals,playerCountry:e.playerCountry,directives:e.directives,params:e.params}}function Ut(){_&&(Ye.postMessage(_s()),Tt=_.version,It=performance.now(),Xa=!1)}function Qs(){Ze&&clearInterval(Ze),Da=performance.now(),ka=performance.now(),Ze=setInterval(()=>{if(!_||!fe)return;const e=performance.now(),a=(e-Da)/1e3;Da=e;try{fe.tick(a)}catch(n){_.paused=!0,Ye.postMessage({type:"error",message:n instanceof Error?n.message:String(n)})}(_.version!==Tt||Xa)&&e-It>=Zs&&Ut(),!_.paused&&e-ka>=zs&&(ka=e,Fa("autosave").then(n=>Ye.postMessage({type:"saved",meta:n,auto:!0})))},40)}function la(e,a){_=e,fe=new Hs(e,a),na=new $e((a??e.seed)^1540483477),qa=e.playerCountry??null,Qs()}const ec="crown-singleplayer",Fe="saves",Ke="meta";function Aa(){return new Promise((e,a)=>{const n=indexedDB.open(ec,1);n.onupgradeneeded=()=>{n.result.createObjectStore(Fe),n.result.createObjectStore(Ke)},n.onsuccess=()=>e(n.result),n.onerror=()=>a(n.error)})}function Lt(e){return new Promise((a,n)=>{e.oncomplete=()=>a(),e.onerror=()=>n(e.error),e.onabort=()=>n(e.error)})}function Ot(e){return new Promise((a,n)=>{e.onsuccess=()=>a(e.result),e.onerror=()=>n(e.error)})}let _a="local";async function Fa(e){var o;const a=_,n=`${_a}:${a.id}:${e}`,t={id:n,name:e==="autosave"?`${a.name} (autosave)`:a.name,scenarioId:a.scenarioId,country:a.playerCountry,countryName:a.playerCountry?(o=a.countries[a.playerCountry])==null?void 0:o.name:void 0,t:a.t,startDate:a.startDate,updatedAt:Date.now()},r=JSON.stringify({world:a,rng:fe.rngState}),i=await Aa(),s=i.transaction([Fe,Ke],"readwrite");return s.objectStore(Fe).put(r,n),s.objectStore(Ke).put(t,n),await Lt(s),i.close(),t}async function ac(){const e=await Aa(),a=await Ot(e.transaction(Ke).objectStore(Ke).getAll());return e.close(),a.filter(n=>n.id.startsWith(`${_a}:`)).sort((n,t)=>t.updatedAt-n.updatedAt)}async function nc(e){const a=await Aa(),n=await Ot(a.transaction(Fe).objectStore(Fe).get(e));if(a.close(),!n)return!1;const t=JSON.parse(n);return t.world.paused=!0,la(t.world,t.rng),!0}async function tc(e){const a=await Aa(),n=a.transaction([Fe,Ke],"readwrite");n.objectStore(Fe).delete(e),n.objectStore(Ke).delete(e),await Lt(n),a.close()}Ye.onmessage=async e=>{var t;const a=e.data,n=r=>Ye.postMessage({type:"reply",id:a.id,result:r});try{switch(a.kind){case"scope":return _a=String(a.scope??"local"),n({ok:!0});case"new-game":{const r=ua(String(a.scenarioId)),i=`${r.id}-${Date.now().toString(36)}`,s=La(r,String(a.name||`${r.name}`),i,Date.now(),a.country?String(a.country):void 0);return la(s),n({ok:!0,world:s})}case"preview":{const r=ua(String(a.scenarioId)),i=La(r,"preview","preview",Date.now()),s=Object.values(i.countries).map(o=>{var c;return{id:o.id,name:o.name,government:o.government,overlord:o.overlord,gdp:o.economy.gdp,population:o.economy.population,leader:((c=i.characters[o.executive.headOfGovernmentId??o.executive.headOfStateId??""])==null?void 0:c.name)??"",leaderTitle:o.executive.headOfGovernmentId?o.executive.headOfGovernmentTitle:o.executive.headOfStateTitle,region:o.region,wars:o.wars.length,debt:o.economy.fiscal.debtToGdp,growth:o.economy.gdpGrowth}});return n({ok:!0,polities:s})}case"load":{const r=await nc(String(a.saveId));return n(r?{ok:!0,world:_}:{ok:!1,message:"That save could not be found."})}case"list-saves":return n({ok:!0,saves:await ac()});case"delete-save":return await tc(String(a.saveId)),n({ok:!0});case"save":{if(!_)return n({ok:!1,message:"No game running."});const r=await Fa(String(a.slot??"manual"));return n({ok:!0,meta:r,message:"Game saved in this browser."})}case"export":return n(!_||!fe?{ok:!1,message:"No game running."}:{ok:!0,payload:JSON.stringify({world:_,rng:fe.rngState})});case"import":{const r=JSON.parse(String(a.payload));return(t=r==null?void 0:r.world)!=null&&t.countries?(r.world.paused=!0,la(r.world,r.rng),n({ok:!0,world:_})):n({ok:!1,message:"That is not a CROWN save file."})}case"leave":return _&&await Fa("autosave"),Ze&&clearInterval(Ze),Ze=null,_=null,fe=null,n({ok:!0});case"focus":return qa=a.country?String(a.country):null,Xa=!0,n({ok:!0});case"command":{if(!_||!fe||!na)return n({ok:!1,message:"No game running."});const r=Ws(_,fe,na,a.body);return _.version++,Ut(),n(r)}case"dev":{if(!_||!fe||!na)return n({ok:!1,message:"No game running."});const r=await ws(_,fe,na,a.body,{id:"local",username:String(a.username??"developer")});r.replaced&&la(r.replaced),_.version++,Ye.postMessage({type:"snapshot",world:_});const{replaced:i,...s}=r;return n(s)}default:return n({ok:!1,message:`Unknown message ${a.kind}`})}}catch(r){return n({ok:!1,message:r instanceof Error?r.message:String(r)})}};
//# sourceMappingURL=sim.worker-aoCLFf9A.js.map
