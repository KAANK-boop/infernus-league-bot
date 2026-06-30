const { MessageFlags, ComponentType } = require('discord.js');
const { T, Container, Thumb } = require('../utils/componentsv2');
const E = require('../config/emojis');

const EIGHTBALL = [
  'Evet.', 'Hayır.', 'Kesinlikle.', 'Asla.', 'Belki.', 'Kesinlikle evet!', 'Pek sanmam.',
  'Şüpheli.', 'Olabilir.', 'Daha sonra sor.', 'Şansın yüksek.', 'Şansın düşük.',
  'Bence evet.', 'Bence hayır.', 'Tabii ki!', 'Hiç sanmıyorum.', 'Kesinlikle hayır.',
  'Evet, emin ol.', 'Gözlerinle göreceksin.', 'Bunu düşünme bile.',
];

const SJOKES = [
  'Bir adam doktora gitmiş, doktor "Ne şikayetiniz var?" diye sormuş. Adam "Kimse beni ciddiye almıyor doktor bey." demiş. Doktor "Şaka mı yapıyorsunuz?" demiş.',
  'Temel\'e sormuşlar: "En çok neyi seversin?" Temel: "Para." demiş. "Peki ondan sonra?" diye sormuşlar. Temel: "Daha çok para." demiş.',
  'Öğretmen sormuş: "Çocuklar, dünyanın şekli nasıldır?" Ayşe parmak kaldırmış: "Yuvarlak öğretmenim!" "Aferin Ayşe, nerden bildin?" "Babam her akşam dünyayı başıma yuvarlıyor da ondan."',
  'Bir gün bekçi sormuş: "Ne iş yaparsın?" Adam: "Devlet memuruyum." demiş. Bekçi: "Geç bakem." demiş.',
  'Adamın biri kayınvalidesiyle çölde yürüyormuş. Birden bir aslan görmüşler. Adam "Kaç!" demiş. Kayınvalide "Kaçamayız, aslan daha hızlı." demiş. Adam "Aslandan hızlı olmama gerek yok, senden hızlı olmam yeterli." demiş.',
  'İki psikiyatrist karşılaşmış. Biri "Merhaba, nasılsın?" diye sormuş. Diğeri "Bilmiyorum ki, sen söyle?" demiş.',
  'Temel gemiyle seyahat ediyormuş. Birden gemi batmaya başlamış. Temel "İmdat! İmdat!" diye bağırmış. Bir denizci "Niye bağırıyorsun, cankurtaran simidi var." demiş. Temel "Simit can kurtarır mı be!" demiş.',
  'Adam evlenmiş. İlk gece eşi "Hayatım, bak evlenirken bana bir sürü söz verdin." demiş. Adam "Hepsini inkar ediyorum." demiş. "Ama şahitler var!" demiş eşi. Adam "Onlar da yalancı şahit!" demiş.',
];

const ADVICE = [
  'Her zaman kendine güven, başkalarının ne düşündüğü umrunda olmasın.',
  'Bugün yarına erteleme, her şeyi zamanında yap.',
  'Bol su iç, sağlığına dikkat et.',
  'Kendine hedefler koy ve onlara ulaşmak için çalış.',
  'İyi arkadaşlıklar en büyük zenginliktir.',
  'Hata yapmaktan korkma, hatalar seni büyütür.',
  'Her gün en az bir kere gülümsemeye çalış.',
  'Küçük şeylerden mutlu olmayı öğren.',
  'İnsanlara karşı nazik ve anlayışlı ol.',
  'Zor zamanlar geçicidir, sabret.',
  'Kitap okumayı ihmal etme.',
  'Müzik dinlemek ruhun gıdasıdır.',
  'Spor yap, vücuduna iyi bak.',
  'Ailene ve sevdiklerine vakit ayır.',
  'Hayır demeyi öğren, kendini tüketme.',
];

const EMOJIS = ['😀', '😂', '🥰', '😎', '🤔', '😴', '🥳', '😱', '🤗', '😇', '🤩', '😜', '🤪', '😈', '👻', '🎃', '👽', '🤖', '🎉', '🎊', '🎁', '🏆', '⭐', '💎', '🔥', '🌈', '⚡', '🍕', '🍔', '🌮', '🍩', '☕', '🎵', '🎶', '🎮', '🎲', '🎯', '♟️'];

module.exports = {
  '8ball': {
    execute(message, args) {
      const q = args.join(' ');
      if (!q) return message.reply('❓ Bana bir soru sor! Örn: `.8ball Yarın yağmur yağacak mı?`');
      const cevap = EIGHTBALL[Math.floor(Math.random() * EIGHTBALL.length)];
      message.channel.send({
        components: [Container([T(`**🎱 Sihirli 8 Top**\n\n**Soru:** ${q}\n\n**Cevap:** ${cevap}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },
  'sihirli-top': {
    execute(message, args) { module.exports['8ball'].execute(message, args); }
  },
  tkm: {
    execute(message, args) {
      const choices = ['taş', 'kağıt', 'makas'];
      const userChoice = args[0]?.toLowerCase();
      if (!choices.includes(userChoice)) return message.reply('Kullanım: `.tkm (taş/kağıt/makas)`');
      const botChoice = choices[Math.floor(Math.random() * 3)];
      let result;
      if (userChoice === botChoice) result = '🤝 Berabere!';
      else if (
        (userChoice === 'taş' && botChoice === 'makas') ||
        (userChoice === 'kağıt' && botChoice === 'taş') ||
        (userChoice === 'makas' && botChoice === 'kağıt')
      ) result = '🎉 Kazandın!';
      else result = '😞 Kaybettin!';
      message.channel.send({
        components: [Container([T(`**✊🖐️✌️ Taş - Kağıt - Makas**\n\nSen: **${userChoice}**\nBot: **${botChoice}**\n\n**${result}**\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },
  'taş-kağıt-makas': {
    execute(message, args) { module.exports.tkm.execute(message, args); }
  },
  şaka: {
    execute(message) {
      const fıkra = SJOKES[Math.floor(Math.random() * SJOKES.length)];
      message.channel.send({
        components: [Container([T(`**😂 Fıkra**\n\n${fıkra}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },
  fıkra: {
    execute(message, args) { module.exports.şaka.execute(message, args); }
  },
  tavsiye: {
    execute(message) {
      const t = ADVICE[Math.floor(Math.random() * ADVICE.length)];
      message.channel.send({
        components: [Container([T(`**💡 Tavsiye**\n\n${t}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },
  kedi: {
    async execute(message) {
      try {
        const res = await fetch('https://api.thecatapi.com/v1/images/search');
        const data = await res.json();
        message.channel.send({
          components: [{ type: ComponentType.Container, components: [T(`**🐱 Kedi**\n\n-# Infermus League`)], media: [{ url: data[0].url }] }],
          flags: 32768
        });
      } catch { message.reply('🐱 Kedi getirilemedi.'); }
    }
  },
  köpek: {
    async execute(message) {
      try {
        const res = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await res.json();
        message.channel.send({
          components: [{ type: ComponentType.Container, components: [T(`**🐶 Köpek**\n\n-# Infermus League`)], media: [{ url: data.message }] }],
          flags: 32768
        });
      } catch { message.reply('🐶 Köpek getirilemedi.'); }
    }
  },
  tilki: {
    async execute(message) {
      try {
        const res = await fetch('https://randomfox.ca/floof/');
        const data = await res.json();
        message.channel.send({
          components: [{ type: ComponentType.Container, components: [T(`**🦊 Tilki**\n\n-# Infermus League`)], media: [{ url: data.image }] }],
          flags: 32768
        });
      } catch { message.reply('🦊 Tilki getirilemedi.'); }
    }
  },
  emoji: {
    execute(message) {
      const em = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      message.channel.send(`Rastgele emojin: ${em}`);
    }
  },
  'rs': {
    execute(message, args) {
      const min = parseInt(args[0]) || 1;
      const max = parseInt(args[1]) || 100;
      if (min >= max) return message.reply('Geçerli aralık girin!');
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      message.channel.send(`🎲 Rastgele sayı: **${num}** (${min}-${max})`);
    }
  },
  'rastgele-sayı': {
    execute(message, args) { module.exports.rs.execute(message, args); }
  },

  'yazı-tura': {
    execute(message) {
      const sonuc = Math.random() < 0.5 ? 'Yazi' : 'Tura';
      message.channel.send({
        components: [Container([T(`${E.CL_dongu} **${sonuc}**\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  zar: {
    execute(message, args) {
      const max = Math.min(parseInt(args[0]) || 6, 100);
      const num = Math.floor(Math.random() * max) + 1;
      message.channel.send({
        components: [Container([T(`${E.CL_dongu} **${num}** (1-${max})\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  'aşk-testi': {
    execute(message) {
      const users = message.mentions.users.first(2);
      if (users.length < 2) return message.reply('Kullanim: `.ask-testi @kisi1 @kisi2`');
      const yuzde = Math.floor(Math.random() * 101);
      message.channel.send({
        components: [Container([T(`**${E.CL_kirmizikalp} Ask Testi**\n\n${E.CL_sag_ok} ${users.first()} ${yuzde >= 50 ? E.CL_kirmizikalp : E.CL_carpi} ${users.last()}\n\n**${yuzde}%** uyum\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  karakter: {
    execute(message) {
      const user = message.mentions.users.first() || message.author;
      const kisilikler = [
        'Lider', 'Dinleyici', 'Savasci', 'Barisci', 'Komik', 'Ciddi',
        'Yaratici', 'Analitik', 'Maceraperest', 'Sakin', 'Hirsli', 'Fedakar'
      ];
      const k = kisilikler[Math.floor(Math.random() * kisilikler.length)];
      message.channel.send({
        components: [Container([T(`**${E.CL_yildiz} Karakter Analizi**\n\n${user} karakteri: **${k}**\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  espri: {
    execute(message) {
      const espriler = [
        'Bir gun Temel karisina sormus: "Hayatim, beni sever misin?" Karisi: "Tabii ki severim." Temel: "O zaman neden beni sikayet ettin?" Karisi: "Seni degil, senin tembelligini sikayet ettim."',
        'Hoca bir gun sormus: "Cocuklar, size bir bilmece: Hic konusmayan sey nedir?" Talebe parmak kaldirmis: "Hocam, ben." "Aferin oglum, peki neden?" "Cunku konusursam yalan soylerim."',
        'Adam hastaneye gitmis. Doktor: "Gecmis olsun, neyiniz var?" Adam: "Hicbir seyim yok doktor." Doktor: "O zaman neden geldiniz?" Adam: "Canim sikiliyordu da."',
        'Iki arkadas konusuyormus. Biri demis: "Ben karimdan cok sıkıldım." Oteki: "Niye?" "Her gun ayni seyleri soyluyor: Hadi is bul, hadi is bul!"',
        'Temel`e sormuslar: "En buyuk hayalin nedir?" Temel: "Bir gun cok zengin olup, her seyi satin almak." "Peki sonra?" "Sonra da fakir olup, her seyi geri satmak."',
      ];
      message.channel.send({
        components: [Container([T(`**😂 Espri**\n\n${espriler[Math.floor(Math.random() * espriler.length)]}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  söz: {
    execute(message) {
      const sozler = [
        'Hayatta en hakiki mursit ilimdir. — Mustafa Kemal Ataturk',
        'Bir ulus sanattan ve sanatcidan yoksunsa tam bir hayata sahip olamaz. — Mustafa Kemal Ataturk',
        'Ne mutlu Turkum diyene! — Mustafa Kemal Ataturk',
        'Yurtta sulh, cihanda sulh. — Mustafa Kemal Ataturk',
        'Egemenlik kayitsiz sartsiz milletindir. — Mustafa Kemal Ataturk',
        'Ben sporcunun zeki, cevik ve ayni zamanda ahlaklisini severim. — Mustafa Kemal Ataturk',
        'Zafer, zafer benimdir diyebilenindir. — Mustafa Kemal Ataturk',
        'Hayat kisa, kuslar ucuyor. — Cemal Sureya',
        'Istanbul\'u dinliyorum, gozlerim kapali. — Orhan Veli Kanik',
        'Bir gun her sey guzel olacak, degil mi? — Can Yucel',
        'Guzel gunler gorecegiz cocuklar, gunesli gunler. — Nazim Hikmet',
        'En kotu gunlerin bile bir sonu vardır. Unutma, geceden sonra gun dogar.',
        'Insanlara karsi zafer kazanmak hicbir sey degildir. Onemli olan kendi kendine karsi zafer kazanabilmektir.',
        'Karanliga kufretmektense bir mum yakmak daha iyidir.',
        'Bir seyin imkansiz oldugunu soyleyenler, baskalarinin basarilarina bakip hicbir sey yapmayanlardir.',
        'Basari, basarisizliktan korkmamaktir. Her basarisizlik basariya giden yolda bir adimdir.',
      ];
      message.channel.send({
        components: [Container([T(`**📜 Soz**\n\n${sozler[Math.floor(Math.random() * sozler.length)]}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  kısmet: {
    execute(message) {
      const kismetler = [
        'Bugun sansli bir gun gecireceksin!',
        'Kariyerinde onemli bir adim atmak uzere oldugunu hissediyorum.',
        'Yakinda guzel bir haber alacaksin, gozlerin yolda olsun.',
        'Kalbinin sesini dinle, dogru yoldasin.',
        'Birisi seni dusunuyor, belki de cok yakin zamanda mesaj atar.',
        'Beklenmedik bir yerden para gelecek, sakina sasirma.',
        'Bugun yeni biriyle tanisabilirsin, gozlerin acik olsun.',
        'Gecmiste yasadigin uzuntuler yakinda son bulacak.',
        'Onumuzdeki gunlerde bir yolculuk seni bekliyor.',
        'Hayalini kurdugun sey gercek olmaya cok yakin!',
        'Kendine guven, icindeki gucun farkina var.',
        'Bugun bir surpriz seni bekliyor olabilir.',
        'Sabret, en guzel seyler zamaniyla gelir.',
        'Bir karar vermen gerekiyor, kalbine guven.',
        'Seni dusunen birileri var, yalniz degilsin.',
        'Yeni baslangiclar icin harika bir gun!',
        'Eski bir dostunla yeniden baglanti kurabilirsin.',
      ];
      message.channel.send({
        components: [Container([T(`**🔮 Kismet**\n\n${kismetler[Math.floor(Math.random() * kismetler.length)]}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },
  ilham: {
    execute(message) {
      const sozler = [
        'Hayallerini gerçekleştirmek için asla pes etme.',
        'Başarı, cesaretin eseridir.',
        'Her yeni gün yeni bir fırsattır.',
        'Kendine inan, her şey mümkün.',
        'Bugün yaptığın en iyi şey, dün seni endişelendiren şeyi yapmaktır.',
        'Düşmek ayıp değil, düştüğün yerde kalmak ayıp.',
        'Başarının sırrı, asla vazgeçmemektir.',
        'En karanlık geceden sonra en güzel gündoğumu gelir.',
        'Mutluluk, sahip olduklarını takdir etmektir.',
        'Yapabileceğini düşünüyorsan, haklısın. Yapamayacağını düşünüyorsan, yine haklısın.',
        'İyi bir dost, bin gölgeden iyidir.',
        'Hayat, bisiklete binmek gibidir. Dengeyi sağlamak için hareket etmelisin.',
        'Cesaret, korkunun yokluğu değil, onun üstesinden gelmektir.',
        'Ne ekersen onu biçersin.',
        'Kendine yapılmasını istemediğini başkasına yapma.',
      ];
      message.channel.send({
        components: [Container([T(`**${E.CL_kupa} Ilham Verici Soz**\n\n*"${sozler[Math.floor(Math.random() * sozler.length)]}"*\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },
  şifre: {
    execute(message, args) {
      const uzunluk = Math.min(parseInt(args[0]) || 12, 50);
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*';
      let sifre = '';
      for (let i = 0; i < uzunluk; i++) sifre += chars[Math.floor(Math.random() * chars.length)];
      message.author.send(`🔐 Olusturulan sifre: \`${sifre}\``).catch(() =>
        message.reply(`DM kapali oldugu icin buraya yaziyorum: \`${sifre}\`\n(Lutfen DM'ni ac, guvenlik icin)`)
      );
      if (message.channel.type !== 1) message.react('✅').catch(() => {});
    }
  },
  renk: {
    execute(message) {
      const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      message.channel.send({
        components: [Container([T(`**${E.CL_pano} Renk: ${hex}**\n\n\`\`\`\nHex: ${hex}\nRGB: ${parseInt(hex.slice(1,3), 16)}, ${parseInt(hex.slice(3,5), 16)}, ${parseInt(hex.slice(5,7), 16)}\n\`\`\`\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  burç: {
    execute(message, args) {
      const burclar = ['Koc', 'Boga', 'Ikizler', 'Yengec', 'Aslan', 'Basak', 'Terazi', 'Akrep', 'Yay', 'Oglak', 'Kova', 'Balik'];
      const burc = args[0]?.toLowerCase();
      if (!burc || !burclar.some(b => b.toLowerCase().startsWith(burc)))
        return message.reply(`Kullanim: \`.burc ${burclar.map(b => b.toLowerCase()).join('/')}\``);
      const b = burclar.find(b => b.toLowerCase().startsWith(burc));
      const yorumlar = {
        koc: 'Enerjin yuksek, yeni baslangiclar icin harika bir gun! Kariyerinde firsatlar seni bekliyor.',
        boga: 'Sabirli ol, emeklerinin karsiligini alacaksin. Parasal konularda dikkatli kararlar vermelisin.',
        ikizler: 'Iletisim guclu yonun. Bugun yeni insanlarla tanisabilir, keyifli sohbetler edebilirsin.',
        yengec: 'Duygusal anlar yasayabilirsin. Ailene vakit ayir, sevdiklerinle bir arada olmak sana iyi gelecek.',
        aslan: 'Kendine guveninle herkesi etkiliyorsun. Bugun gozler uzerinde, en iyi performansini goster.',
        basak: 'Detaylara takilma, biraz rahatla. Her seyi kontrol etmek zorunda degilsin, akisa birak.',
        terazi: 'Iliskiler on planda. Sevdiginle kaliteli zaman gecirmek sana iyi gelecek. Dengeli kararlar al.',
        akrep: 'Tutkulu ve karizmadasin. Icgudulerine guven, dogru yoldasin. Kayip bir esyani bulabilirsin.',
        yay: 'Macera seni cagiriyor! Yeni yerler kesfetmek, yeni seyler denemek icin harika bir zaman.',
        oglak: 'Disiplinli calismanin karsiligini aliyorsun. Hedeflerine bir adim daha yaklastin, devam et.',
        kova: 'Yaratici fikirlerinle fark yaratiyorsun. Sosyal cevrende ilgi odağı olacaksin.',
        balik: 'Hayal gucun sinirsiz. Sanatsal yeteneklerin ortaya cikabilir. Icgudulerine kulak ver.',
      };
      message.channel.send({
        components: [Container([T(`**${E.CL_yildiz} ${b} Burcu Yorumu**\n\n${yorumlar[b.toLowerCase()]}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  kahve: {
    execute(message) {
      const fallar = [
        'Kahve telven cok net gorunuyor! Kismetin acik, yakinda guzel bir haber alacaksin.',
        'FinCan icinde bir kalp goruyorum... Yakinda birinden guzel bir mesaj alabilirsin.',
        'FinCandaki sekiller yolculuga isaret ediyor. Kisa bir seyahat seni bekliyor olabilir.',
        'Göz şekilleri goruyorum... Etrafinda olup bitenlere daha dikkatli bakmalisin.',
        'Para sIkkesine benzer bir sekil var. Finansal anlamda hareketli bir donem seni bekliyor.',
        'Falinda bir yol gorunuyor. Alman gereken onemli bir karar var.',
        'Etrafinda sana iyi niyetli olmayan birisi var, dikkatli ol.',
        'Yeni bir baslangic yapmak icin harika bir zaman. Cesaretli ol!',
        'Uzun zamandir gormedigin birini gorebilirsin.',
        'Hayallerinin pesinden gitmek icin hicbir engel yok. Falinda basari var!',
        'Cevrendeki insanlara karsi daha anlayisli olman gereken bir donemdesin.',
        'Kendine zaman ayir, yalniz kalmaya ihtiyacin var.',
        'Beklenmedik bir yerden para gelecek.',
        'Ask hayatin hareketli gorunuyor. Kalbini ac, guzel seyler olacak.',
        'Falinda bir kus goruyorum... Ozgurluk seni cagiriyor!',
      ];
      message.channel.send({
        components: [Container([
          Thumb('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/hot-beverage_2615.png'),
          T(`**${E.CL_kupa} Kahve Fali**\n\n${fallar[Math.floor(Math.random() * fallar.length)]}\n\n-# Infermus League`)
        ])],
        flags: 32768
      });
    }
  },

  'sansli-sayi': {
    execute(message) {
      const sayi = Math.floor(Math.random() * 100) + 1;
      const anlamlar = [
        'Bugun sansin acik!', 'Buyuk bir firsat yakalayabilirsin.', 'Onemli bir karar vermelisin.',
        'Sevdiklerine vakit ayir.', 'Parasal anlamda hareketli bir gun.', 'Yeni bir baslangic yap!',
        'Gecmisi geride birak.', 'Hayallerine bir adim daha yaklas.', 'Sabret, kazancakasin.',
        'Cesaretinle herkesi etkileyeceksin.',
      ];
      message.channel.send({
        components: [Container([T(`**${E.CL_yildiz} Sansli Sayin**\n\n**Sansli Sayin:** ${sayi}\n\n**Mesaj:** ${anlamlar[Math.floor(Math.random() * anlamlar.length)]}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  piyango: {
    execute(message) {
      const numbers = [];
      while (numbers.length < 6) {
        const n = Math.floor(Math.random() * 49) + 1;
        if (!numbers.includes(n)) numbers.push(n);
      }
      numbers.sort((a, b) => a - b);
      const buyukIkramiye = (Math.floor(Math.random() * 50) + 1) * 100000;
      message.channel.send({
        components: [Container([T(`**${E.CL_hediye} Piyango**\n\n${message.author} sana ozel piyango biletin hazir!\n\n**Numaralar:** ${numbers.join(' - ')}\n**Buyuk Ikramiye:** ${buyukIkramiye.toLocaleString()} coin\n\n*Sanal piyangodur, gerceklik icermez*\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  dans: {
    execute(message) {
      const danslar = ['💃', '🕺', '👯', '💃🕺', '🕺💃', '💃💃', '🕺🕺', '👯‍♂️', '👯‍♀️'];
      const adimlar = [
        'Hadi bakalim, kaldir kollarini!',
        'Sola bir adim, saga bir adim!',
        'Don don don!',
        'Eller havaya!',
        'Tut elimi oynatalim!',
        'Yan yan, zipla zipla!',
      ];
      message.channel.send({
        components: [Container([T(`**${danslar[Math.floor(Math.random() * danslar.length)]} Dans Zamani!**\n\n${adimlar[Math.floor(Math.random() * adimlar.length)]}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  panda: {
    async execute(message) {
      try {
        const res = await fetch('https://some-random-api.com/animal/panda');
        const data = await res.json();
        message.channel.send({
          components: [{ type: ComponentType.Container, components: [T(`**🐼 Panda**\n\n-# Infermus League`)], media: [{ url: data.image }] }],
          flags: 32768
        });
      } catch { message.reply('🐼 Panda getirilemedi.'); }
    }
  },

  kus: {
    async execute(message) {
      try {
        const res = await fetch('https://some-random-api.com/animal/bird');
        const data = await res.json();
        message.channel.send({
          components: [{ type: ComponentType.Container, components: [T(`**🐦 Kus**\n\n-# Infermus League`)], media: [{ url: data.image }] }],
          flags: 32768
        });
      } catch { message.reply('🐦 Kus getirilemedi.'); }
    }
  },

  ters: {
    execute(message, args) {
      const text = args.join(' ');
      if (!text) return message.reply('Kullanim: `.ters <yazi>`');
      const ters = text.split('').reverse().join('');
      message.channel.send(`🔁 ${ters}`);
    }
  },

  şifrele: {
    execute(message, args) {
      const text = args.join(' ');
      if (!text) return message.reply('Kullanim: `.sifrele <yazi>`');
      const encoded = Buffer.from(text, 'utf-8').toString('base64');
      message.channel.send(`🔐 Sifrelenmis: \`${encoded}\``);
    }
  },

  'coz': {
    execute(message, args) {
      const text = args.join(' ');
      if (!text) return message.reply('Kullanim: `.coz <sifrelenmis>`');
      try {
        const decoded = Buffer.from(text, 'base64').toString('utf-8');
        message.channel.send(`🔓 Cozulmus: \`${decoded}\``);
      } catch { message.reply('Gecersiz sifre!'); }
    }
  },

  binary: {
    execute(message, args) {
      const text = args.join(' ');
      if (!text) return message.reply('Kullanim: `.binary <yazi>`');
      const binary = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      message.channel.send(`🔢 Binary:\n\`${binary}\``);
    }
  },

  'emoji-yazi': {
    execute(message, args) {
      const text = args.join(' ').toLowerCase();
      if (!text) return message.reply('Kullanim: `.emoji-yazi <yazi>`');
      const map = {
        a: '🇦', b: '🇧', c: '🇨', d: '🇩', e: '🇪', f: '🇫', g: '🇬', h: '🇭',
        i: '🇮', j: '🇯', k: '🇰', l: '🇱', m: '🇲', n: '🇳', o: '🇴', p: '🇵',
        q: '🇶', r: '🇷', s: '🇸', t: '🇹', u: '🇺', v: '🇻', w: '🇼', x: '🇽',
        y: '🇾', z: '🇿', ' ': '  ', '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
        '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
      };
      const result = text.split('').map(c => map[c] || c).join(' ');
      message.channel.send(result);
    }
  },

  kutlama: {
    execute(message, args) {
      const hedef = args.join(' ') || 'herkes';
      const mesajlar = [
        `🎉 Herkes ${hedef} icin bir kutlama yapsin! 🎊`,
        `🥳 ${hedef} harika birine benziyor! Tebrikler!`,
        `🎈 ${hedef} icin balonlar, pastalar, hediyeler! 🎁`,
        `⭐ ${hedef} adına coskuyla kutluyoruz! 🎆`,
        `🎇 ${hedef} icin havai fisekleri atesliyoruz! 🎆`,
        `👏 ${hedef}'i tebrik etmek icin herkes ellerini kaldirsin!`,
      ];
      message.channel.send(mesajlar[Math.floor(Math.random() * mesajlar.length)]);
    }
  },

  zeka: {
    execute(message) {
      const sorular = [
        { q: 'Beni ters cevirince buyuyen, duz cevirince kuculen sey nedir?', a: 'sayi 6 (9 olur)' },
        { q: 'Hangi ayda 28 gun vardir?', a: 'Tum aylarda' },
        { q: 'Havaya atinca beyaz, yere dusunce siyah olan sey nedir?', a: 'Kara tahta' },
        { q: 'Hic hareket etmeyen ama her yere giden sey nedir?', a: 'Yol' },
        { q: 'Dolu iken hafif, bos iken agir olan sey nedir?', a: 'Balon' },
        { q: 'Hangi seyi almak icin asla geri vermen gerekir?', a: 'Fotograf' },
      ];
      const s = sorular[Math.floor(Math.random() * sorular.length)];
      message.channel.send({
        components: [Container([T(`**🧠 Zeka Sorusu**\n\n**Soru:** ${s.q}\n\n||**Cevap:** ${s.a}||\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  }
};
