const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, MessageFlags } = require('discord.js');
const E = require('../config/emojis');
const { T, Sep, Container } = require('../utils/componentsv2');

const desc = {
  yardım: 'Yardım menüsünü açar', yardim: 'Yardım menüsünü açar',
  ping: 'Bot gecikmesini ölçer', timecheck: 'Gecikme sürelerini gösterir',
  afk: 'AFK moduna geçer', avatar: 'Profil avatarını büyük gösterir',
  banner: 'Profil bannerını gösterir',   kaçcm: 'Rastgele CM ölçer (0-65)', dcprofil: 'Discord profil bilgilerini gösterir',
  profil: 'Detaylı profil bilgisi verir', mc: 'Sunucu üye sayılarını gösterir',
  davetler: 'Davet istatistiklerini gösterir', hesapla: 'Matematiksel işlem yapar',
  ai: 'Yapay zekaya soru sorar', ataturk: 'Atatürk bilgi embedi gösterir',
  lanyardapi: 'Lanyard ile Discord durum sorgular', ship: 'Aşk yüzdesi hesaplar',
  timer: 'Hatırlatıcı kurar', not: 'Not oluşturur', notlar: 'Notları listeler',
  kap: 'Transfer/Kiralık/Fesih yönetim paneli', ara: 'Oyuncu ara (isim/takım/ülke/mevki)', 'takımrolleri': 'Takım rollerini ekle/sil/liste (Admin)',
  baskanrolata: 'Başkan rolünü ayarlar (Admin)', teknikrolata: 'Teknik Direktör rolünü ayarlar (Admin)', ftrolata: 'Futbolcu rolünü ayarlar (Admin)',
  mülklerim: 'Mülklerinizi listeler', sm: 'Sohbet mesai bilgileri',
  dmmesaj: 'Kullanıcıya DM gönderir', mesaj: 'Kanala mesaj yazar',
  konuştur: 'Webhook ile kullanıcı adına yazar', yaz: 'Bot olarak mesaj yazar',
  yazembed: 'Bot olarak embed yazar', v2yaz: 'Bileşensiz mesaj yazar',
  roll: 'Rastgele sonuç üretir',
  ban: 'Kullanıcıyı yasaklar', banbilgi: 'Ban listesini gösterir',
  unban: 'Kullanıcının banını kaldırır', kick: 'Kullanıcıyı sunucudan atar',
  mute: 'Kullanıcıyı susturur', unmute: 'Susturmayı kaldırır',
  mutebilgi: 'Susturulma bilgisini gösterir', muteaffi: 'Tüm susturmaları kaldırır',
  jail: 'Kullanıcıyı jaile atar', unjail: 'Kullanıcıyı jailden çıkarır',
  lock: 'Kanalı kilitler', unlock: 'Kanal kilidini açar',
  slowmode: 'Yavaş mod süresi ayarlar', sil: 'Belirtilen sayıda mesaj siler (1-100)', nuke: 'Kanalı temizleyip sıfırlar',
  delete: 'Kanalı tamamen siler', uyarı: 'Kullanıcıya uyarı ekler',
  uyarılar: 'Kullanıcının uyarılarını listeler', uyarıgerial: 'Uyarıyı geri alır',
  ticketolustur: 'Ticket paneli oluşturur', itiraftextadmin: 'İtiraf paneli oluşturur',
  logkur: 'Log kanalı kurar', sohbetizni: 'Kanal sohbet iznini ayarlar',
  sistemiac: 'İstatistik sistemini açar/kapatır',
  'kayıt-oluştur': 'Kayıt sistemini kurar (5 adım)', k: 'Kullanıcıyı kaydeder',
  publicolustur: 'Public sunucu kurulumu yapar (kanalları siler + oluşturur)',
  rollerisil: 'Tüm rolleri siler (Admin)',
  kayıtsız: 'Kullanıcıyı kayıtsıza atar', kayıtsil: 'Kullanıcının kayıt verisini siler',
  kayıtsayı: 'Kayıt sayısını gösterir', 'kayıtsayı-top': 'En çok kayıt yapan 10 kişiyi gösterir', kayıtsayıekle: 'Kayıt sayısına ekleme yapar',
  kayıtsayısil: 'Kayıt sayısından silme yapar', kayıtsayısıfırla: 'Tüm kayıt sayılarını sıfırlar',
  kayıtpluskur: 'Kayıt Plus sistemini kurar', kayıtpluskapat: 'Kayıt Plus sistemini kapatır',
  adminbeklet: 'Admin doğrulama bekletmesi', wlekle: 'Kullanıcıyı whiteliste ekler',
  wlsil: 'Kullanıcıyı whitelistent çıkarır', wlliste: 'Whitelist listesini gösterir',
  adminpanel: 'Admin doğrulama paneli oluşturur', prefix: 'Bot prefixini değiştirir',
  karaliste: 'Kullanıcıyı karalisteye ekler', unkaraliste: 'Kullanıcıyı karalisteden çıkarır',
  koruma: 'Sunucu korumasını açar/kapatır', botkoruma: 'Bot giriş korumasını açar/kapatır',
  görevli: 'Görevli paneli oluşturur', yetkilialımbaslat: 'Yetkili alım paneli oluşturur',
  spikeralimbaslat: 'Spiker alım paneli oluşturur', spikergir: 'Spiker başvuru bilgisi gösterir',
  yetkiliguncelle: 'Yetkili rollerini günceller', yetkilikadro: 'Yetkili kadrosunu listeler', yetkiliroller: 'Yetkili sayılacak rolleri ayarlar',
  rolver: 'Kullanıcıya rol verir', rolal: 'Kullanıcıdan rol alır',
  toplurolver: 'Birden çok kişiye rol verir', toplurolal: 'Birden çok kişiden rol alır',
  herkeserolver: 'Herkese rol verir/alır', roliismi: 'Rol adını değiştirir',
  rolemojiekle: 'Role emoji atar', rolemojisil: 'Rol emojisini siler',
  sürelirolver: 'Geçici rol verir', sürelirolliste: 'Aktif süreli rolleri listeler',
  sürelirolkaldır: 'Süreli rol kaydını siler', avukatlist: 'Avukat listesini gösterir',
  avukattext: 'Avukat ekleme/çıkarma yapar', isim: 'Kullanıcı adını değiştirir',
  adminevtext: 'Ev sistemi bilgi mesajı', adminarabatext: 'Araç sistemi bilgi mesajı',
  evaç: 'Ev açma paneli açar', evsat: 'Evini satar', araçal: 'Araç satın alma panelini açar', araçsat: 'Aracını satar', araçlarım: 'Araçlarını listeler',
  electropremium: 'Electro Premium yönetimi',
  dyc: 'Test komutu',   çekiliş: 'Çekiliş başlatır (örn: .çekiliş 10d 100M€ 2)',
  ticketrolata: 'Ticket yetkili rolünü ayarlar',
  rpg: 'İnteraktif RPG menüsü (buton destekli)', 'rpg-başlat': 'RPG karakteri oluşturur', 'rpg-profil': 'RPG karakter profilini gösterir', 'rpg-savaş': 'Zindan savaşı başlatır', 'rpg-iyileş': 'RPG canını yeniler',
  scooter: 'Hızlı yönetim paneli',
  '8ball': 'Sihirli 8 top sorularını cevaplar', 'sihirli-top': 'Sihirli 8 top sorularını cevaplar',
  tkm: 'Taş-kağıt-makas oyunu oynar', 'taş-kağıt-makas': 'Taş-kağıt-makas oyunu oynar',
  şaka: 'Rastgele fıkra gösterir', fıkra: 'Rastgele fıkra gösterir',
  tavsiye: 'Rastgele hayat tavsiyesi verir',
  kedi: 'Rastgele kedi fotoğrafı gösterir',
  köpek: 'Rastgele köpek fotoğrafı gösterir',
  tilki: 'Rastgele tilki fotoğrafı gösterir',
  emoji: 'Rastgele emoji gönderir',
  rs: 'Rastgele sayı üretir', 'rastgele-sayı': 'Rastgele sayı üretir',
  'yazı-tura': 'Yazi tura atar', zar: 'Zar atar (1-6)',
  'aşk-testi': 'Iki kisi arasindaki ask yuzdesini olcer',
  karakter: 'Karakter analizi yapar',
  espri: 'Rastgele espri gosterir',
  söz: 'Rastgele anlamli soz gosterir',
  kısmet: 'Kismet bakar (gelecek tahmini)',
  ilham: 'Rastgele ilham verici söz gösterir',
  şifre: 'Rastgele şifre oluşturur',
  renk: 'Rastgele renk gösterir',
  çeviri: 'Metni ingilizceye/türkçeye çevirir',
  sunucu: 'Sunucu bilgilerini gösterir',
  hoşgeldinayarla: 'Hoşgeldin mesajı kanalını ayarlar (Admin)',
  hoşgeldinsıfırla: 'Hoşgeldin mesajını kaldırır (Admin)',
  blackjack: 'Blackjack oyunu oynar (bahisli)', bj: 'Blackjack kısayolu',
  'yüksek-düşük': 'Yüksek-düşük kart oyunu oynar (bahisli)',
  up: 'Değer yükseltir', dver: 'Değer yükseltir', dup: 'Değer yükseltir',
  deup: 'Değer düşürür', dal: 'Değer düşürür',
  dr: 'Değer rehberini gösterir', dsil: 'Kullanıcının değerini sıfırlar',
  değersayı: 'Değer ve sayısını gösterir', degersifirla: 'Tüm değer verilerini sıfırlar',
  degergecmisi: 'Son 10 değer işlemini gösterir', dsayıekle: 'Değer sayısına ekleme yapar',
  dsayısil: 'Değer sayısından silme yapar', 'değerbildirme-kanalı': 'Değer bildirim kanalını ayarlar',
  değeryetkilisi: 'Değer yetkilisi rolünü ayarlar',
  msgir: 'Maç sonucu giriş paneli', macbaslat: 'Yeni maç başlatır',
  macbitir: 'Maçı bitirir', matchend: 'Maçı bitirir',
  macgol: 'Aktif maça gol ekler', takımbilgi: 'Takım bilgilerini gösterir',
  topver: 'Top/frikik/santra bilgisi', oyuncudegis: 'İki oyuncuyu değiştirir',
  kadro: 'Kadro dizilişini ve 11 oyuncuyu gösterir', kadrogir: 'Kullanıcıyı takıma ekler',
  çal: 'Bir şarkı çalar (YouTube)', skip: 'Çalan şarkıyı geçer', durdur: 'Müziği durdurur',
  sıra: 'Şarkı sırasını gösterir', ses: 'Ses seviyesini ayarlar (1-100)',
  şarkı: 'Şu an çalan şarkıyı gösterir', karıştır: 'Sırayı karıştırır',
  döngü: 'Otomatik oynatmayı açar/kapatır',
  kadrom: 'Kullanıcının profilini gösterir', kadrosil: 'Kullanıcıyı takımdan çıkarır',
  yedekekle: 'Kullanıcıyı yedeğe ekler', ilk11: 'İlk 11\'i gösterir',
  antrenman: 'Antrenman yapar (5/5 tamamlama, +200K€ ödül)', özelantrenman: 'Özel antrenman yapar (5/5, özel rol gerekli)', 'antrenman-kanali': 'Antrenman kanalını ayarlar (Admin)',
  'değerrehberi': 'Değer kazanma rehberini gösterir', golekle: 'Gol ekler',
  golsil: 'Gol siler', asistekle: 'Asist ekler', asistsil: 'Asist siler',
  kadrolist: 'Takım kadrosunu listeler',
  turnuva: 'Aktif turnuva bilgilerini gösterir', 'turnuva-başlat': 'Turnuva başlatır (Admin)',
  'turnuva-ekip-ekle': 'Turnuvaya takım ekler (Admin)', 'turnuva-ekip-çıkar': 'Turnuvadan takım çıkarır (Admin)',
  'turnuva-fikstür': 'Fikstür oluşturur (Admin)', 'turnuva-bitir': 'Turnuvayı sonlandırır (Admin)',
  fikstür: 'Fikstür tablosunu gösterir', 'puan-durumu': 'Puan durumunu gösterir',
  'maç-sonucu': 'Maç sonucu girer (Admin)',
  golkrallığı: 'Gol krallığı sıralaması', asistkrallığı: 'Asist krallığı sıralaması',
  futbolcu: 'Oyuncu ara ve detay gör', piyasa: 'Piyasadaki tüm oyuncuları listele',
  'takım': 'Futbol takımını görüntüle', puan: 'Bakiye ve istatistiklerini gör',
  transfer: 'Oyuncu satın al', sat: 'Oyuncunu sat',
  'maç': 'AI veya bir kullanıcıya karşı maç yap', lig: 'Lig tablosunu gör',
  değerlist: 'Değer liderlik tablosu',
  stat: 'Genel istatistikleri gösterir', u: 'Genel istatistikleri gösterir',
  em: 'Bakiye görüntüler', empay: 'Para gönderir',
  emtop: 'Zengin sıralamasını gösterir', emhistory: 'Para işlem geçmişini gösterir',
  embank: 'Banka bakiyesini gösterir', emyatir: 'Bankaya para yatırır',
  emcek: 'Bankadan para çeker', emadd: 'Admin para ekler',
  emremove: 'Admin para siler', emreset: 'Kullanıcı bakiyesini sıfırlar',
  emserverreset: 'Sunucu ekonomisini sıfırlar', emrolata: 'Ekonomik yetkili rolü ekler',
  emrolsil: 'Ekonomik yetkili rolü siler',
  bilkazanyetkili: 'Bilgi komutu yetkilisini ayarlar (Admin)',
  takmaadsıfırla: 'Herkesin takma adını sıfırlar (Admin)',
  emojisil: 'Sunucudaki tüm emojileri siler (Admin)',
  yt: 'Yazı tura oyunu (coinflip)', yazıtura: 'Yazı tura oyunu', 'yazı-tura': 'Yazı tura oyunu',
  zar: 'Zar atma oyunu (1-6)', slot: 'Slot makinesi oyunu',
  penaltı: 'Penaltı atışı oyunu', snipe: 'Son silinen mesajı gösterir',
  snipeall: 'Son 5 silinen mesajı listeler', snipetoggle: 'Snipe özelliğini açar/kapatır',
  öp: 'Birini öpersin', tokat: 'Birine tokat atarsın',
  sarıl: 'Birine sarılırsın', tekme: 'Birine tekme atarsın',
  oksşa: 'Birini okşarsın', yumruk: 'Birine yumruk atarsın',
  kucakla: 'Birini kucaklarsın', dürt: 'Birini dürtersin',
  ısır: 'Birini ısırırsın', gıdıkla: 'Birini gıdıklarsın',
  besle: 'Birini beslersin', dans: 'Dans edersin',
  gülümse: 'Gülümsersin', 'el-salla': 'El sallarsın',
  selam: 'Selam verirsin', gozkırp: 'Göz kırparsın',
  'göz-kırp': 'Göz kırparsın', bak: 'Birine bakarsın',
  ağla: 'Ağlarsın', utan: 'Utanırsın',
  sevin: 'Sevinirsin', kafa: 'Elele tutuşursun',
   cuddle: 'Kucaklama (GIF)',
  burç: 'Burç yorumu gösterir',
  kahve: 'Kahve falına baktırırsın',
  'şanslı-sayı': 'Şanslı sayını gösterir',
  piyango: 'Sanal piyango bileti alırsın',
  panda: 'Rastgele panda fotoğrafı gösterir',
  kuş: 'Rastgele kuş fotoğrafı gösterir',
  ters: 'Yazıyı ters çevirir',
  şifrele: 'Metni şifreler (base64)',
  coz: 'Şifrelenmiş metni çözer',
  binary: 'Metni binary koduna çevirir',
  'emoji-yazı': 'Metni emoji harflere çevirir',
  kutlama: 'Özel gün kutlaması yapar',
  zeka: 'Zeka sorusu sorar',
  'komut-ekle': 'Özel komut ekler (Admin)', 'komut-sil': 'Özel komut siler (Admin)', 'komut-liste': 'Özel komutları listeler',
  'sayaç-kur': 'Ses kanalına üye sayacı kurar (Admin)', 'sayaç-sıfırla': 'Sayaçı kaldırır (Admin)',
  'otorol': 'Yeni üyelere otomatik rol verir (Admin)', 'otorol-sıfırla': 'Oto-rolü kaldırır (Admin)',
  yoklama: 'Sesli kanallardaki üyeleri listeler',
  'rol-bilgi': 'Rol hakkında detaylı bilgi gösterir',
  'yedek-al': 'Sunucu yedeği alır (Admin)', 'yedek-yükle': 'Yedeği geri yükler (Admin)',
  reklam: 'Reklam mesajı ayarlar/gönderir (Admin)',
  'kullanıcı-bilgi': 'Kullanıcı bilgisi gösterir',
  'sunucu-bilgi': 'Sunucu bilgisi gösterir',
  'küfür-engel': 'Küfür engeli açar/kapatır (Admin)',
  'reklam-engel': 'Reklam engeli açar/kapatır (Admin)',
  'mod-log': 'Mod-log kanalı ayarlar (Admin)',
  'rol-ver': 'Kullanıcıya rol verir (Admin)',   'rol-al': 'Kullanıcıdan rol alır (Admin)',
  'kanal-sil': 'Kanalı siler (Admin)',
  koruma: 'Koruma panelini açar (Admin)',
  'koruma-log': 'Koruma log kanalı ayarlar (Admin)',
  'koruma-whitelist': 'Koruma whitelistini yönetir (Admin)',
};

const sistemKategoriler = [
  { emoji: E.CL_gri_kitap, name: 'Kayıt Sistemleri',
    cmds: 'kayıt-oluştur, kayıtpluskur, kayıtpluskapat, adminbeklet, wlekle, wlsil, wlliste, adminpanel, hoşgeldinayarla, hoşgeldinsıfırla' },
  { emoji: E.CL_kirmizikitap, name: 'Koruma & Guard',
    cmds: 'koruma, botkoruma, logkur, küfür-engel, reklam-engel, mod-log, koruma-log, koruma-whitelist, sohbetizni, sistemiac' },
  { emoji: E.CL_yesilkitap, name: 'Sunucu Yönetimi',
    cmds: 'sayaç-kur, sayaç-sıfırla, otorol, otorol-sıfırla, yoklama, publicolustur, rollerisil, emojisil, takmaadsıfırla, kanal-sil' },
  { emoji: E.CL_sarikitap, name: 'Ticket & Başvuru',
    cmds: 'ticketolustur, ticketrolata, görevli, yetkilialımbaslat, spikeralimbaslat, spikergir, itiraftextadmin' },
  { emoji: E.CL_siyahkitap, name: 'Özel Komutlar',
    cmds: 'komut-ekle, komut-sil, komut-liste, yedek-al, yedek-yükle, reklam, prefix, scooter' },
  { emoji: E.CL_pembe_kitap, name: 'Rol & Yetki',
    cmds: 'rol-ver, rol-al, antrenman-kanali, bilkazanyetkili, değerbildirme-kanalı, değeryetkilisi, emrolata, emrolsil, kullanıcı-bilgi, sunucu-bilgi, rol-bilgi' },
  { emoji: E.CL_mavikitap, name: 'Ekonomi & Premium',
    cmds: 'electropremium, karaliste, unkaraliste, emserverreset, çekiliş, dyc' },
];

const categories = [
  { emoji: E.CL_gri_kitap, name: 'Genel', color: 0x5865F2,
    cmds: 'yardım, yardim, kaçcm, ping, timecheck, afk, avatar, banner, dcprofil, profil, mc, davetler, hesapla, ai, ataturk, lanyardapi, ship, timer, not, notlar, kap, ara, mülklerim, sm, roll, dmmesaj, mesaj, konuştur, yaz, yazembed, v2yaz, 8ball, sihirli-top, şaka, fıkra, tavsiye, kedi, köpek, tilki, emoji, rs, rastgele-sayı, yazı-tura, zar, aşk-testi, karakter, espri, söz, kısmet, çeviri, sunucu' },
  { emoji: E.CL_kirmizikitap, name: 'Moderasyon', color: 0xED4245,
    cmds: 'ban, banbilgi, unban, kick, mute, unmute, mutebilgi, muteaffi, jail, unjail, lock, unlock, slowmode, sil, nuke, kanal-sil, uyarı, uyarılar, uyarıgerial' },
  { emoji: E.CL_siyahkitap, name: 'Yetkili & Yönetim', color: 0x9B59B6,
    cmds: 'k, kayıtsız, kayıtsil, kayıtsayı, kayıtsayı-top, kayıtsayıekle, kayıtsayısil, kayıtsayısıfırla, baskanrolata, teknikrolata, ftrolata, yetkilialımbaslat, spikeralimbaslat, spikergir, yetkiliguncelle, yetkilikadro, yetkiliroller' },
  { emoji: E.CL_yesilkitap, name: 'Rol & Ayarlar', color: 0xFEE75C,
    cmds: 'rolver, rolal, toplurolver, toplurolal, herkeserolver, roliismi, rolemojiekle, rolemojisil, sürelirolver, sürelirolliste, sürelirolkaldır, avukatlist, avukattext, isim, adminevtext, adminarabatext, evaç, evsat, araçal, araçsat, araçlarım, dyc, takımrolleri' },
  { emoji: E.CL_sarikitap, name: 'Futbol', color: 0x57F287,
    cmds: 'msgir, macbaslat, macbitir, matchend, macgol, takımbilgi, topver, oyuncudegis, kadro, kadrolist, kadrogir, kadrom, kadrosil, yedekekle, ilk11, antrenman, özelantrenman, golekle, golsil, asistekle, asistsil, stat, u, turnuva, turnuva-başlat, turnuva-ekip-ekle, turnuva-ekip-çıkar, turnuva-fikstür, turnuva-bitir, fikstür, puan-durumu, maç-sonucu, golkrallığı, asistkrallığı, futbolcu, piyasa, takım, puan, transfer, sat, maç, lig' },
  { emoji: E.CL_pembe_kitap, name: 'İstatistik & Değer', color: 0x00BFFF,
    cmds: 'up, dver, dup, deup, dal, dr, dsil, değersayı, degersifirla, degergecmisi, dsayıekle, dsayısil, değerrehberi, değerlist, snipe, snipeall, snipetoggle, tkm, taş-kağıt-makas' },
  { emoji: E.CL_gri_kitap, name: 'Ekonomi', color: 0xF1C40F,
    cmds: 'em, empay, emtop, emhistory, embank, emyatir, emcek, emadd, emremove, emreset, emserverreset, yt, yazıtura, zar, slot, penaltı, blackjack, bj, yüksek-düşük' },
  { emoji: E.CL_kirmizikitap, name: 'Eğlence', color: 0xE91E63,
    cmds: 'ilham, şifre, renk, öp, tokat, sarıl, tekme, oksşa, yumruk, kucakla, dürt, ısır, gıdıkla, besle, dans, gülümse, el-salla, selam, gozkırp, bak, ağla, utan, sevin, kafa, cuddle, burç, kahve, şanslı-sayı, piyango, panda, kuş, ters, şifrele, coz, binary, emoji-yazı, kutlama, zeka' },
  { emoji: E.CL_yesilkitap, name: 'RPG', color: 0x9B59B6,
    cmds: 'rpg, rpg-başlat, rpg-profil, rpg-savaş, rpg-iyileş' },
  { emoji: E.CL_siyahkitap, name: 'Kullanışlı', color: 0x2ECC71,
    cmds: 'çekiliş, electropremium, dyc' },
];

const totalCmds = categories.reduce((a, c) => a + c.cmds.split(',').length, 0) + sistemKategoriler.reduce((a, c) => a + c.cmds.split(',').length, 0);

function buildMainComponents(guildName, author) {
  const catLines = categories.map(c => `> ${c.emoji} ${c.name} (${c.cmds.split(',').length})`);
  const lines = [
    `**Sunucu:** ${guildName} | **Prefix:** \`.\``,
    '',
    `${E.CL_hediye} __**Kategoriler**__`,
    catLines.join('\n'),
    `-# Toplam: ${totalCmds} komut | Kullanan: ${author?.username || 'Kategorilerden birini seç'}`,
  ];
  const closeBtn = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('yardim_kapat').setLabel('Menüyü Kapat').setEmoji(E.CL_carpi).setStyle(ButtonStyle.Secondary),
  );
  return {
    components: [
      Container([
        T(lines.join('\n')),
        Sep(),
        kategoriRow.toJSON(),
        Sep(),
        sistemRow.toJSON(),
        Sep(),
        closeBtn.toJSON(),
      ]),
    ],
  };
}

const kategoriMenu = new StringSelectMenuBuilder()
  .setCustomId('yardim_select')
  .setPlaceholder('📂 Kategori seç...')
  .addOptions(categories.map((cat, i) => ({
    label: cat.name,
    value: `yardim_kat_${i}`,
    description: `${cat.cmds.split(',').length} komut`,
    emoji: cat.emoji,
  })));

const sistemMenu = new StringSelectMenuBuilder()
  .setCustomId('yardim_sistem')
  .setPlaceholder('⚙️ Sistem kategorisi seç...')
  .addOptions(sistemKategoriler.map((sk, i) => ({
    label: sk.name,
    value: `yardim_sis_${i}`,
    description: `${sk.cmds.split(',').length} komut`,
    emoji: sk.emoji,
  })));

const kategoriRow = new ActionRowBuilder().addComponents(kategoriMenu);
const sistemRow = new ActionRowBuilder().addComponents(sistemMenu);

const mainRows = [
  kategoriRow,
  sistemRow,
  new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('yardim_kapat').setLabel('Menüyü Kapat').setEmoji(E.CL_carpi).setStyle(ButtonStyle.Secondary),
  ),
];

const PAGE_SIZE = 10;

function buildCategoryComponents(index, page = 0, author) {
  const cat = categories[index];
  if (!cat) return null;
  const allCmds = cat.cmds.split(',').map(c => c.trim());
  const totalPages = Math.ceil(allCmds.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const pageCmds = allCmds.slice(start, start + PAGE_SIZE);
  const cmdList = pageCmds.map(c => {
    const d = desc[c] || 'Açıklama yok';
    return `\`${c}\` ${d}`;
  }).join('\n');
  const navRow = new ActionRowBuilder();
  if (page > 0) navRow.addComponents(new ButtonBuilder().setCustomId(`yardim_page_${index}_${page - 1}`).setLabel('◀ Önceki').setStyle(ButtonStyle.Secondary));
  if (page < totalPages - 1) navRow.addComponents(new ButtonBuilder().setCustomId(`yardim_page_${index}_${page + 1}`).setLabel('Sonraki ▶').setStyle(ButtonStyle.Secondary));
  const closeRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('yardim_ana').setLabel('Ana Menü').setEmoji(E.CL_sol_ok).setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('yardim_kapat').setLabel('Kapat').setEmoji(E.CL_carpi).setStyle(ButtonStyle.Secondary),
  );
  const containerItems = [
    T(`${cat.emoji} __**${cat.name}**__ — ${cat.cmds.split(',').length} komut`),
    Sep(),
    T(cmdList),
    Sep(),
    kategoriRow.toJSON(),
    Sep(),
    sistemRow.toJSON(),
    Sep(),
    navRow.components.length > 0 ? navRow.toJSON() : null,
    closeRow.toJSON(),
  ].filter(Boolean);
  return { components: [Container(containerItems)] };
}

function buildSistemComponents(index = -1) {
  const closeRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('yardim_ana').setLabel('Ana Menü').setEmoji(E.CL_sol_ok).setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('yardim_kapat').setLabel('Kapat').setEmoji(E.CL_carpi).setStyle(ButtonStyle.Secondary),
  );
  if (index >= 0 && index < sistemKategoriler.length) {
    const sk = sistemKategoriler[index];
    const allCmds = sk.cmds.split(',').map(c => c.trim());
    const cmdList = allCmds.map(c => {
      const d = desc[c] || 'Açıklama yok';
      return `\`${c}\` ${d}`;
    }).join('\n');
    return {
      components: [
        Container([
          T(`${sk.emoji} __**${sk.name}**__ — ${allCmds.length} komut`),
          Sep(),
          T(cmdList),
          Sep(),
          kategoriRow.toJSON(),
          Sep(),
          sistemRow.toJSON(),
          Sep(),
          closeRow.toJSON(),
        ]),
      ],
    };
  }
  const allCmds = [];
  sistemKategoriler.forEach(sk => {
    sk.cmds.split(',').map(c => c.trim()).forEach(c => { if (!allCmds.includes(c)) allCmds.push(c); });
  });
  const overview = sistemKategoriler.map(sk => `> ${sk.emoji} **${sk.name}** (${sk.cmds.split(',').length})`).join('\n');
  return {
    components: [
      Container([
        T(`⚙️ __**Sistemler**__ — ${allCmds.length} komut`),
        Sep(),
        T(overview),
        Sep(),
        T(`Kategorilerden birini seçerek sistem komutlarını görüntüleyin.`),
        Sep(),
        kategoriRow.toJSON(),
        Sep(),
        sistemRow.toJSON(),
        Sep(),
        closeRow.toJSON(),
      ]),
    ],
  };
}

module.exports = {
  yardım: { execute: async (message) => {
    await message.channel.send({ flags: MessageFlags.IsComponentsV2, ...buildMainComponents(message.guild.name, message.author) });
  }},
  yardim: { execute: async (message) => {
    await message.channel.send({ flags: MessageFlags.IsComponentsV2, ...buildMainComponents(message.guild.name, message.author) });
  }},
  categories, buildMainComponents, buildCategoryComponents, buildSistemComponents,
};
