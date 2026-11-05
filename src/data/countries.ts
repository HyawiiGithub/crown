import type { Bloc, Continent, GovernmentType, Ideology, Iso3, IsoNumeric, Region } from "../shared/types";

/**
 * The modern country table. Every land polygon in /geo/countries-50m.json joins
 * to exactly one row here through its ISO 3166-1 numeric code, and historical
 * scenarios describe who controlled each of these modern territories at the
 * time (see src/data/history).
 *
 * Population (millions) and nominal GDP (billions of current US dollars) are
 * rounded public estimates for 1990, 2010, 2020 and 2026, in that order. They are
 * starting conditions for a game, not a statistical source.
 *
 * Row: numeric|iso3|iso2|name|continent|government|lat|lon|ideology|bloc|pop|gdp
 */
const RAW = `
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
`;

export interface CountryRecord {
  numeric: IsoNumeric;
  iso3: Iso3;
  iso2: string;
  name: string;
  continent: Continent;
  region: Region;
  government: GovernmentType;
  lat: number;
  lon: number;
  ideology: number;
  bloc: Bloc;
  /** Millions, for 1990, 2010, 2020, 2026. */
  pop: [number, number, number, number];
  /** Billions of current USD, for 1990, 2010, 2020, 2026. */
  gdp: [number, number, number, number];
}

const CONTINENT: Record<string, { continent: Continent; region: Region }> = {
  AF: { continent: "Africa", region: "africa" },
  AS: { continent: "Asia", region: "asia" },
  ME: { continent: "Asia", region: "middle-east" },
  EU: { continent: "Europe", region: "europe" },
  NA: { continent: "North America", region: "americas" },
  SA: { continent: "South America", region: "americas" },
  OC: { continent: "Oceania", region: "oceania" },
};

export const COUNTRIES: CountryRecord[] = RAW.trim().split("\n").map((line) => {
  const f = line.split("|");
  const geo = CONTINENT[f[4]];
  return {
    numeric: f[0],
    iso3: f[1],
    iso2: f[2],
    name: f[3],
    continent: geo.continent,
    region: geo.region,
    government: f[5] as GovernmentType,
    lat: Number(f[6]),
    lon: Number(f[7]),
    ideology: Number(f[8]),
    bloc: f[9] as Bloc,
    pop: f[10].split(",").map(Number) as CountryRecord["pop"],
    gdp: f[11].split(",").map(Number) as CountryRecord["gdp"],
  };
});

export const COUNTRY_BY_ISO3: Record<string, CountryRecord> = Object.fromEntries(COUNTRIES.map((c) => [c.iso3, c]));
export const COUNTRY_BY_NUMERIC: Record<string, CountryRecord> = Object.fromEntries(COUNTRIES.map((c) => [c.numeric, c]));
export const ALL_ISO3: Iso3[] = COUNTRIES.map((c) => c.iso3);

/** Natural Earth features with no numeric code, and the land key a scenario can claim them by. */
export const NAMED_FEATURES: Record<string, string> = { Kosovo: "XKX", "N. Cyprus": "CYN", Somaliland: "SML", "W. Sahara": "ESH" };

/** Population (millions) and GDP ($B 1990, 2010, 2020, 2026) for lands that are not full table rows. */
export const EXTRA_LANDS: Record<string, { name: string; lat: number; lon: number; pop: [number, number, number, number]; gdp: [number, number, number, number] }> = {
  XKX: { name: "Kosovo", lat: 42.6, lon: 21, pop: [1.9, 1.8, 1.8, 1.7], gdp: [1.5, 5.8, 7.7, 11.5] },
  SML: { name: "Somaliland", lat: 9.8, lon: 45.5, pop: [1.5, 3, 4, 4.5], gdp: [0.3, 0.8, 1.5, 2] },
  ESH: { name: "Western Sahara", lat: 24.5, lon: -13, pop: [0.2, 0.5, 0.6, 0.6], gdp: [0.1, 0.5, 0.9, 1] },
};

/**
 * Map features with no independent row: overseas territories and the three
 * unrecognised polygons that Natural Earth ships without an ISO code. Each one
 * is painted as part of the modern state listed here, unless a scenario says
 * otherwise through its `territories`.
 */
export const TERRITORY_OWNER: Record<string, string> = {
  // Natural Earth features without a numeric code, keyed by feature name.
  "Siachen Glacier": "IND", "Indian Ocean Ter.": "AUS", XKX: "SRB", CYN: "CYP", SML: "SOM", ESH: "MAR",
  // Overseas territories, by ISO numeric.
  "304": "DNK", "234": "DNK", "016": "USA", "316": "USA", "580": "USA", "850": "USA",
  "060": "GBR", "092": "GBR", "136": "GBR", "238": "GBR", "239": "GBR", "086": "GBR", "654": "GBR", "612": "GBR", "660": "GBR", "796": "GBR", "500": "GBR", "831": "GBR", "832": "GBR", "833": "GBR",
  "184": "NZL", "570": "NZL", "574": "AUS", "334": "AUS",
  "533": "NLD", "531": "NLD", "534": "NLD",
  "258": "FRA", "260": "FRA", "540": "FRA", "652": "FRA", "663": "FRA", "666": "FRA", "876": "FRA",
  "248": "FIN", "446": "CHN",
};

/** Polygons left as blank ground in every scenario. */
export const UNCLAIMED_FEATURES = new Set(["010"]);

export function isoName(iso3: Iso3): string {
  return COUNTRY_BY_ISO3[iso3]?.name ?? iso3;
}

/** A stable, muted fallback colour, so a polity with no authored colour is stable between sessions. */
export function colourForCountry(iso3: Iso3): string {
  let h = 0;
  for (let i = 0; i < iso3.length; i++) h = (h * 31 + iso3.charCodeAt(i)) | 0;
  const hue = Math.abs(h) % 360;
  const sat = 26 + (Math.abs(h >> 8) % 16);
  const light = 44 + (Math.abs(h >> 16) % 14);
  return `hsl(${hue} ${sat}% ${light}%)`;
}

export const GOVERNMENT_TITLES: Record<GovernmentType, { hos: string; hog: string }> = {
  "absolute-monarchy": { hos: "Monarch", hog: "Chief Minister" },
  "constitutional-monarchy": { hos: "Monarch", hog: "Prime Minister" },
  "parliamentary-republic": { hos: "President", hog: "Prime Minister" },
  "semi-presidential-republic": { hos: "President", hog: "Prime Minister" },
  "presidential-republic": { hos: "President", hog: "President" },
  "one-party-state": { hos: "Party Leader", hog: "Premier" },
  "military-junta": { hos: "Head of the Junta", hog: "Prime Minister" },
  "monarchy-absolute-colonial": { hos: "Colonial Governor", hog: "Resident" },
  "federal-republic": { hos: "President", hog: "President" },
  theocracy: { hos: "Supreme Leader", hog: "President" },
  confederation: { hos: "President", hog: "President" },
  protectorate: { hos: "Resident-General", hog: "Native Ruler" },
  "mandate-colony": { hos: "High Commissioner", hog: "Administrator" },
  dependency: { hos: "Governor", hog: "Chief Secretary" },
  "occupied-territory": { hos: "Occupation Authority", hog: "Military Governor" },
  "breakaway-state": { hos: "President", hog: "Prime Minister" },
};

export function ideologyLabel(v: number): Ideology {
  if (v < -60) return "far-left";
  if (v < -25) return "left";
  if (v < -8) return "centre-left";
  if (v <= 8) return "centrist";
  if (v <= 25) return "centre-right";
  if (v <= 60) return "right";
  return "far-right";
}

export const REGION_LABELS: Record<Region, string> = {
  africa: "Africa",
  americas: "Americas",
  asia: "Asia",
  europe: "Europe",
  "middle-east": "Middle East",
  oceania: "Oceania",
};
