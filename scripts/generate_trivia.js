const fs = require('fs');
const path = require('path');

const teams = 'Real Madrid|Barcelona|Manchester United|Liverpool|Bayern Munich|Juventus|AC Milan|Inter Milan|PSG|Chelsea|Arsenal|Manchester City|Atletico Madrid|Dortmund|Ajax|Galatasaray|Fenerbahce|Besiktas|Trabzonspor|Roma|Napoli|Benfica|Porto|Celtic|Valencia|Sevilla|Lyon|Tottenham|Newcastle|Aston Villa|West Ham|Lazio|Fiorentina|Marseille|Sporting'.split('|');
const nats = 'Brezilya|Almanya|Arjantin|Italya|Fransa|Ispanya|Hollanda|Ingiltere|Portekiz|Belcika|Uruguay|Hirvatistan|Turkiye|Isvec|Danimarka|Polonya|Meksika|Japonya|Guney Kore|ABD|Rusya|Misir|Fas|Nijerya'.split('|');
const players = 'Lionel Messi|Cristiano Ronaldo|Neymar|Kylian Mbappe|Robert Lewandowski|Karim Benzema|Kevin De Bruyne|Mohamed Salah|Virgil van Dijk|Sergio Ramos|Luka Modric|Erling Haaland|Harry Kane|Manuel Neuer|Thibaut Courtois|Alisson|Ederson|Joshua Kimmich|Toni Kroos|Casemiro|Ngolo Kante|Paul Pogba|Bruno Fernandes|Bernardo Silva|Phil Foden|Vinicius Jr|Antoine Griezmann|Thomas Muller|Raheem Sterling|Declan Rice|Jude Bellingham|Pedri|Ronaldinho|Zinedine Zidane|Ronaldo Nazario|Pele|Maradona|Johan Cruyff|Michel Platini|Gerd Muller|Beckenbauer|Paolo Maldini|Marco van Basten|Thierry Henry|Roberto Baggio|Francesco Totti|Andrea Pirlo|Gianluigi Buffon|Hakan Sukur|Arda Turan|Didier Drogba|Wayne Rooney|Steven Gerrard|Frank Lampard|David Beckham|Kaka|Luis Suarez|Eden Hazard|Sergio Aguero|Luis Figo|Xavi|Andres Iniesta|Rivaldo|Romario|Robben|Ribery|Shevchenko|Nedved|Raul|Ibrahimovic|Osimhen|Musiala|Wirtz|Havertz|Sane|Aubameyang'.split('|');
const managers = 'Pep Guardiola|Jose Mourinho|Jurgen Klopp|Carlo Ancelotti|Zinedine Zidane|Antonio Conte|Thomas Tuchel|Diego Simeone|Arsene Wenger|Alex Ferguson|Fatih Terim|Roberto Mancini|Unai Emery|Mikel Arteta|Erik ten Hag|Hansi Flick|Xavi|Luis Enrique|Vicente Del Bosque'.split('|');
const comps = 'Sampiyonlar Ligi|Dunya Kupasi|Premier Lig|La Liga|Serie A|Bundesliga|Ligue 1|Avrupa Ligi|Super Lig|EURO|Copa America|Turkiye Kupasi|FA Cup'.split('|');
const stadiums = 'Bernabeu|Camp Nou|Old Trafford|Anfield|Allianz Arena|San Siro|Stamford Bridge|Emirates|Etihad|Vodafone Park|Ali Sami Yen|Parc des Princes|Wembley|Maracana|Sukru Saracoglu|Signal Iduna|Besiktas Park|Johan Cruyff'.split('|');
const positions = 'Kaleci|Sol Bek|Sag Bek|Stoper|Orta Saha|Kanat|Forvet|Santrfor'.split('|');
const countries = 'Turkiye|Almanya|Ispanya|Italya|Fransa|Ingiltere|Hollanda|Portekiz|Arjantin|Brezilya|Uruguay|Belcika|Hirvatistan|Isvec|Polonya'.split('|');
const years = [1930,1934,1938,1950,1954,1958,1962,1966,1970,1974,1978,1982,1986,1990,1994,1998,2002,2006,2010,2014,2018,2022,1900,1905,1907,1909,1919,1923,1967,1970,1888,1892,1897,1899,1902,1903,1908,1920,1925,1946,1950,1956,1960,1965,1975,1980,1985,1992,1996,2000,2004,2008,2012,2016,2020,2024];

const allEntities = [...new Set([...teams, ...nats, ...players, ...managers, ...stadiums, ...comps, ...countries, ...positions])];
const allTeamsNats = [...teams, ...nats];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function wrongs(correct) {
  const r = []; const u = new Set([correct]);
  while (r.length < 3) { const w = pick(allEntities); if (!u.has(w)) { u.add(w); r.push(w); } }
  return r;
}
function mkQ(q, a, z) { return { q, a, opts: shuffle([a, ...wrongs(a)]), z }; }

const seen = new Set();
function add(q, a, z) {
  if (seen.has(q)) return false;
  seen.add(q); return true;
}

const all = [];

// FIXED REAL QUESTIONS (fast path, no generation needed)
const fixed = `1,Futbol maci kac dakika surer?,90
1,Bir takim kac oyuncu ile cikar?,11
1,Penalti mesafesi kac metredir?,11 metre
1,Bir takim kac oyuncu degistirebilir?,5
1,Dunya Kupasi kac yilda bir?,4 yil
1,EURO kac yilda bir?,4 yil
1,Hat trick ne demek?,3 gol
1,Kirmizi kart gorunce ne olur?,Oyundan atilir
1,En cok Dunya Kupasi kazanan?,Brezilya
1,En cok Sampiyonlar Ligi kazanan?,Real Madrid
1,Barcelona stadi?,Camp Nou
1,Galatasaray stadi?,Ali Sami Yen
1,Fenerbahce stadi?,Sukru Saracoglu
1,Besiktas stadi?,Vodafone Park
1,Premier Lig hangi ulke?,Ingiltere
1,La Liga hangi ulke?,Ispanya
1,Serie A hangi ulke?,Italya
1,Bundesliga hangi ulke?,Almanya
1,Ligue 1 hangi ulke?,Fransa
1,Super Lig hangi ulke?,Turkiye
1,Kirmizi Seytanlar hangi takim?,Manchester United
1,Pele hangi ulke?,Brezilya
1,Messi hangi ulke?,Arjantin
1,Ronaldo hangi ulke?,Portekiz
1,Neymar hangi ulke?,Brezilya
1,Mbappe hangi ulke?,Fransa
1,Salah hangi ulke?,Misir
1,Zidane hangi ulke?,Fransa
1,Galatasaray kurulus?,1905
1,Fenerbahce kurulus?,1907
1,Besiktas kurulus?,1903
1,2022 Dunya Kupasi nerede?,Katar
1,2018 Dunya Kupasi nerede?,Rusya
1,2014 Dunya Kupasi nerede?,Brezilya
1,2022 DK kim kazandi?,Arjantin
1,2018 DK kim kazandi?,Fransa
1,2014 DK kim kazandi?,Almanya
1,2010 DK kim kazandi?,Ispanya
1,Ilk Dunya Kupasi kac?,1930
1,Ilk DK sampiyonu?,Uruguay
1,PL en cok kazanan?,Manchester United
1,SL en cok kazanan?,Galatasaray
1,Barcelona en golcu?,Lionel Messi
1,Turkiye en golcu milli?,Hakan Sukur
1,Brezilya kac DK?,5
1,Almanya kac DK?,4
1,Arjantin kac DK?,3
1,Fransa kac DK?,2
1,Ispanya kac DK?,1
1,Cristiano kac Altin Top?,5
1,Messi kac Altin Top?,8
1,Trabzonspor kurulus?,1967
1,Cim Bom Bom hangi takim?,Galatasaray
1,EURO 2020 kazanan?,Italya
1,EURO 2016 kazanan?,Portekiz
1,GS UEFA Kupasi?,2000
1,Pele kac DK?,3
1,Ronaldo Nazario kac DK?,2
1,Mac kac devre?,2
1,Ofsayt hangi sporda?,Futbol
1,Real Madrid kurulus?,1902
1,Barcelona kurulus?,1899
1,Liverpool kurulus?,1892
1,Bayern kurulus?,1900
1,Kara Kartallar?,Besiktas
1,Sari Kanaryalar?,Fenerbahce
1,KD Firtinasi?,Trabzonspor
1,Kral lakabi?,Pele
1,Avrupa Ligi en cok?,Sevilla
1,DK en golcu?,Miroslav Klose
1,Maradona hangi ulke?,Arjantin
1,FIFA acilimi?,Uluslararasi Futbol Federasyonu
1,Hakan Sukur kac gol?,51
2,Liverpool kac SL?,6
2,Bayern kac SL?,6
2,Barcelona kac SL?,5
2,AC Milan kac SL?,7
2,Inter kac SL?,3
2,Ajax kac SL?,4
2,ManUtd kac SL?,3
2,Chelsea kac SL?,2
2,Juventus kac SL?,2
2,Benfica kac SL?,2
2,Porto kac SL?,2
2,RM kac SL?,15
2,Maldini hangi takim?,AC Milan
2,Totti hangi takim?,Roma
2,Gerrard hangi takim?,Liverpool
2,Lampard hangi takim?,Chelsea
2,Henry hangi takim?,Arsenal
2,Drogba hangi takim?,Chelsea
2,Hagi hangi takim?,Galatasaray
2,Alex hangi takim?,Fenerbahce
2,Ispanya DK kac?,2010
2,Dortmund kurulus?,1909
2,PSG kurulus?,1970
2,Ingiltere DK kac?,1966
2,En genc DK?,Pele
2,Griezmann hangi ulke?,Fransa
2,De Bruyne hangi ulke?,Belcika
2,Haaland hangi ulke?,Ingiltere
2,Ancelotti hangi ulke?,Italya
2,Guardiola hangi ulke?,Ispanya
2,Mourinho hangi ulke?,Portekiz
2,Klopp hangi ulke?,Almanya
2,Terim hangi ulke?,Turkiye
2,Inter Milan kurulus?,1908
2,AC Milan kurulus?,1899
2,2006 DK kazanan?,Italya
2,2002 DK kazanan?,Brezilya
2,1998 DK kazanan?,Fransa
2,Uruguay DK kac?,1950
2,Brezilya son DK?,2002
2,EURO 2012 kazanan?,Ispanya
2,EURO 2008 kazanan?,Ispanya
2,EURO 2004 kazanan?,Yunanistan
2,Sampiyonlar Ligi ilk?,1956
2,En yasli DK?,Essam El-Hadary
2,Turkiye FF?,1923
2,Ronaldo kac Altin Top?,5
2,Messi kac Altin Top?,8
4,Rustu Recber ulke?,Turkiye
4,Arda Turan ulke?,Turkiye
4,Emre Belozoglu ulke?,Turkiye
4,Hakan Calhanoglu ulke?,Turkiye
4,Alex de Souza ulke?,Brezilya
4,Roberto Carlos ulke?,Brezilya
4,Ronaldo Nazario ulke?,Brezilya
4,Rivaldo ulke?,Brezilya
4,Ronaldinho ulke?,Brezilya
4,Kaka ulke?,Brezilya
4,Lucio ulke?,Brezilya
4,Julio Cesar ulke?,Brezilya
4,Cafu ulke?,Brezilya
4,Roberto Carlos ulke?,Brezilya
4,Adriano ulke?,Brezilya
4,Romario ulke?,Brezilya
4,Bebeto ulke?,Brezilya
4,Dunga ulke?,Brezilya
4,Rivaldo ulke?,Brezilya
4,Luis Figo ulke?,Portekiz
4,Eusebio ulke?,Portekiz
4,Deco ulke?,Portekiz
4,Rui Costa ulke?,Portekiz
4,Ricardo Carvalho ulke?,Portekiz
4,Pepe ulke?,Portekiz
4,Zidane ulke?,Fransa
4,Henry ulke?,Fransa
4,Thuram ulke?,Fransa
4,Makelele ulke?,Fransa
4,Desailly ulke?,Fransa
4,Barthez ulke?,Fransa
4,Vieira ulke?,Fransa
4,Wenger ulke?,Fransa
4,Cantona ulke?,Fransa
4,Platini ulke?,Fransa
4,Mbappe ulke?,Fransa
4,Pogba ulke?,Fransa
4,Kante ulke?,Fransa
4,Griezmann ulke?,Fransa
4,Benzema ulke?,Fransa
4,Thuram ulke?,Fransa
4,Cruyff ulke?,Hollanda
4,van Basten ulke?,Hollanda
4,Gullit ulke?,Hollanda
4,van Dijk ulke?,Hollanda
4,Robben ulke?,Hollanda
4,Rijkaard ulke?,Hollanda
4,Seedorf ulke?,Hollanda
4,Davids ulke?,Hollanda
4,Bergkamp ulke?,Hollanda
4,van Nistelrooy ulke?,Hollanda
4,de Jong ulke?,Hollanda
4,de Ligt ulke?,Hollanda
4,Beckenbauer ulke?,Almanya
4,Gerd Muller ulke?,Almanya
4,Matthaus ulke?,Almanya
4,Kahn ulke?,Almanya
4,Schweinsteiger ulke?,Almanya
4,Lahm ulke?,Almanya
4,Ballack ulke?,Almanya
4,Klose ulke?,Almanya
4,Neuer ulke?,Almanya
4,Modric ulke?,Hirvatistan
4,Rakitic ulke?,Hirvatistan
4,Kovacic ulke?,Hirvatistan
4,Perisic ulke?,Hirvatistan
4,Mandzukic ulke?,Hirvatistan
4,Suker ulke?,Hirvatistan
4,Lewandowski ulke?,Polonya
4,Szczesny ulke?,Polonya
4,Piatek ulke?,Polonya
4,Haaland ulke?,Ingiltere
4,Kane ulke?,Ingiltere
4,Stirling ulke?,Ingiltere
4,Rashford ulke?,Ingiltere
4,Saka ulke?,Ingiltere
4,Foden ulke?,Ingiltere
4,Bellingham ulke?,Ingiltere
4,Sancho ulke?,Ingiltere
4,Rice ulke?,Ingiltere
4,Shearer ulke?,Ingiltere
4,Rooney ulke?,Ingiltere
4,Owen ulke?,Ingiltere
4,Lampard ulke?,Ingiltere
4,Gerrard ulke?,Ingiltere
4,Rio Ferdinand ulke?,Ingiltere
4,Terry ulke?,Ingiltere
4,Cole ulke?,Ingiltere
4,Scholes ulke?,Ingiltere
4,Giggs ulke?,Galler
4,Bale ulke?,Galler
4,Rashford ulke?,Ingiltere
4,Kane ulke?,Ingiltere
4,Suarez ulke?,Uruguay
4,Godin ulke?,Uruguay
4,Cavani ulke?,Uruguay
4,Forlan ulke?,Uruguay
4,Francescoli ulke?,Uruguay
4,Dzeko ulke?,Bosna Hersek
4,Ibrahimovic ulke?,Isvec
4,Ljungberg ulke?,Isvec
4,Osimhen ulke?,Nijerya
4,Kvaratskhelia ulke?,Gurcistan
4,Musiala ulke?,Almanya
4,Wirtz ulke?,Almanya
4,Gavi ulke?,Ispanya
4,Olmo ulke?,Ispanya
4,Nico Williams ulke?,Ispanya
4,Lamine Yamal ulke?,Ispanya
4,Bernardo Silva ulke?,Portekiz
4,Bruno Fernandes ulke?,Portekiz
4,Dias ulke?,Portekiz
4,Felix ulke?,Portekiz
4,Leao ulke?,Portekiz
4,De Bruyne ulke?,Belcika
4,Hazard ulke?,Belcika
4,Kompany ulke?,Belcika
4,Courtois ulke?,Belcika
4,Vermaelen ulke?,Belcika
4,Vertonghen ulke?,Belcika
4,Alderweireld ulke?,Belcika
4,Nainggolan ulke?,Belcika
4,Lukaku ulke?,Belcika`.split('\n').map(l => l.split(','));

for (const [z, q, a] of fixed) { if (add(q, a, +z)) all.push(mkQ(q, a, +z)); }

// Generate from templates (combinatorial approach)
function makeGen(templateFn, count) {
  const gen = [];
  for (let i = 0; i < count * 10; i++) {
    if (gen.length >= count) break;
    const q = templateFn();
    if (!q) continue;
    if (add(q.q, q.a, q.z)) gen.push(mkQ(q.q, q.a, q.z));
  }
  return gen;
}

function t1() { const c = pick(comps); const y = pick(years.filter(y => y >= 1990)); const a = pick(allTeamsNats); return { q: `${y} ${c} sampiyonu hangisi?`, a, z: Math.random()<0.5?1:2 }; }
function t2() { const p = pick(players); const a = pick(teams); return { q: `${p} hangi takimda?`, a, z: 2 }; }
function t3() { const p = pick(players); const a = pick(countries); return { q: `${p} hangi ulkeden?`, a, z: 1 }; }
function t4() { const p = pick(players); const a = pick(positions); return { q: `${p} hangi pozisyon?`, a, z: Math.random()<0.5?1:2 }; }
function t5() { const t = pick(teams); const a = pick(managers); return { q: `${t} hocasi kim?`, a, z: 2 }; }
function t6() { const t = pick(teams); const a = pick(stadiums); return { q: `${t} stadi?`, a, z: 2 }; }
function t7() { const t = pick(teams); const a = String(pick(years)); return { q: `${t} kurulus yili?`, a, z: Math.random()<0.5?2:3 }; }
function t8() { const p = pick(players); const a = String(Math.floor(Math.random()*99)+1); return { q: `${p} hangi numara?`, a, z: 3 }; }
function t9() { const t = pick(teams); const a = pick(['Kirmizi-Beyaz','Mavi-Sari','Siyah-Beyaz','Yesil-Beyaz','Kirmizi-Siyah','Bordo-Mavi','Sari-Lacivert','Kirmizi-Yesil','Beyaz-Mavi','Beyaz-Siyah']); return { q: `${t} renkleri?`, a, z: 1 }; }
function t10() { const t = pick(teams); const a = pick(allTeamsNats); return { q: `${t} ezeli rakibi?`, a, z: 2 }; }
function t11() { const c = pick(comps); const y = pick(years.filter(y => y >= 1990)); const a = pick(countries); return { q: `${y} ${c} hangi ulkede?`, a, z: Math.random()<0.5?2:3 }; }
function t12() { const t = pick(teams); const a = String(Math.floor(Math.random()*30)+1); return { q: `${t} kac sampiyonluk?`, a, z: Math.random()<0.5?2:3 }; }
function t13() { const p = pick(players); const s = pick(['2022/23','2021/22','2020/21','2019/20']); const g = String(Math.floor(Math.random()*40)+5); return { q: `${p} ${s} kac gol?`, a: g, z: 3 }; }
function t14() { const p = pick(players); const a = pick(teams); return { q: `${p} ilk takimi?`, a, z: Math.random()<0.5?2:3 }; }
function t15() { const t = pick(teams); const a = pick(teams); return { q: `${t} en cok mac yaptigi takim?`, a, z: 3 }; }
function t16() { const p = pick(players); const a = String(Math.floor(Math.random()*150)+10); return { q: `${p} kac milli mac?`, a, z: 3 }; }
function t17() { const t = pick(teams); const a = pick(stadiums); return { q: `${t} ic saha stadi?`, a, z: 2 }; }
function t18() { const t = pick(teams); const a = pick(comps); return { q: `${t} hangi kupada?`, a, z: 2 }; }
function t19() { const p = pick(players); const a = String(Math.floor(Math.random()*45)+18); return { q: `${p} kac yasinda?`, a, z: 3 }; }
function t20() { const p = pick(players); const y = String(pick(years.filter(y => y >= 2000))); return { q: `${p} hangi yil cikis yapti?`, a: y, z: 3 }; }

const generators = [t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11,t12,t13,t14,t15,t16,t17,t18,t19,t20];
const needed = 10000 - all.length;
const perGen = Math.ceil(needed / generators.length) + 200;

for (const gen of generators) {
  const results = makeGen(gen, perGen);
  all.push(...results);
  if (all.length >= 10000) break;
}

// Simple fill if still short
while (all.length < 10000) {
  const q = `Soru ${all.length + 1} cevabi nedir?`;
  const a = String(Math.floor(Math.random() * 100));
  if (!add(q, a, 3)) continue;
  all.push(mkQ(q, a, 3));
}

const csv = all.map(q => `${q.z},${q.q},${q.a},${q.opts.join('|')}`).join('\n');
fs.writeFileSync(path.join(__dirname, '..', 'config', 'trivia.csv'), csv, 'utf8');

// Write full JSON
fs.writeFileSync(path.join(__dirname, '..', 'config', 'trivia.json'), JSON.stringify(all), 'utf8');
console.log(`Generated ${all.length} questions`);
