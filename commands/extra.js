const { MessageFlags } = require('discord.js');
const db = require('../database/db');
const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

const trivia = require('../config/trivia.json');
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sendTrivia(channel, author) {
  const q = trivia[Math.floor(Math.random() * trivia.length)];
  const shuffled = shuffle(q.opts);
  const dogruIdx = shuffled.indexOf(q.a);
  const desc = [
    `**${q.q}**`,
    '',
    ...shuffled.map((o, i) => `${E.CL_sag_ok} **${i + 1}.** ${o}`),
    '',
    `Cevap icin bota **yanit ver** (1-4 yada cevabi yaz).`,
  ].join('\n');
  channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
    T(`${E.CL_kupa} **Bilgi Sorusu!**\n\n${desc}\n\n-# Infermus League`),
  ])] }).then(async msg => {
    const zorluk = q.zor;
    const odul = zorluk === 1 ? 3000 : zorluk === 2 ? 6000 : 10000;
    db.set(`trivia.${msg.id}`, { idx: dogruIdx, odul, dogruCevap: q.a, secenekler: shuffled });
    setTimeout(() => {
      const data = db.get(`trivia.${msg.id}`);
      if (data && !data.cevaplandi) {
        const updatedDesc = [
          `**${q.q}**`,
          '',
          ...shuffled.map((o, i) => `${E.CL_sag_ok} **${i + 1}.** ${o}`),
          '',
          `${E.CL_uyari} Sure doldu! Dogru cevap: **${q.a}**`,
        ].join('\n');
        msg.edit({ components: [Container([
          T(`${E.CL_kupa} **Bilgi Sorusu!**\n\n${updatedDesc}\n\n-# Infermus League`),
        ])] });
        db.delete(`trivia.${msg.id}`);
      }
    }, 30000);
  });
}

module.exports = { trivia, sendTrivia,
  şans: {
    execute(message, args) {
      const amount = parseInt(args[0]);
      if (!amount || amount < 1) return message.reply('Kullanim: `.sans <miktar>`');
      const userId = message.author.id;
      const userData = db.get(`users.${userId}`, {});
      const balance = userData.balance || 0;
      if (amount > balance) return message.reply(`Yetersiz bakiye! Bakiyen: \`${balance.toLocaleString()} coin\``);
      const won = Math.random() < 0.5;
      if (won) {
        userData.balance = balance + amount;
        db.set(`users.${userId}`, userData);
        message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
          T(`${E.CL_yesiltik} **${amount.toLocaleString()} coin** kazandin! Yeni bakiye: \`${(balance + amount).toLocaleString()} coin\`\n\n-# Infermus League`),
        ])] });
      } else {
        userData.balance = balance - amount;
        db.set(`users.${userId}`, userData);
        message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
          T(`${E.CL_carpi} **${amount.toLocaleString()} coin** kaybettin! Yeni bakiye: \`${(balance - amount).toLocaleString()} coin\`\n\n-# Infermus League`),
        ])] });
      }
    }
  },
  bilkazanyetkili: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(`${E.CL_carpi} Yetkiniz yok!`);
      const role = message.mentions.roles.first();
      if (!role) return message.reply('Kullanım: .bilkazanyetkili @rol');
      db.set(`bilgiYetkilisiRol.${message.guild.id}`, role.id);
      message.channel.send(`${E.CL_yesiltik} Bilgi yetkilisi rolü ${role} olarak ayarlandı.`);
    }
  },
  bilgi: {
    execute(message) {
      const yetkiliRol = db.get(`bilgiYetkilisiRol.${message.guild.id}`);
      if (yetkiliRol) {
        if (!message.member.roles.cache.has(yetkiliRol)) {
          return message.reply('Bu komutu kullanmaya yetkiniz yok!');
        }
      }
      sendTrivia(message.channel, message.author);
    }
  },
  döviz: {
    execute(message) {
      const rates = [
        { birim: 'Electro Coin', kur: '1 ELC', emoji: E.CL_electro_money },
        { birim: 'Euro', kur: '0.25 ELC', emoji: '💶' },
        { birim: 'Dolar', kur: '0.22 ELC', emoji: '💵' },
        { birim: 'Sterlin', kur: '0.28 ELC', emoji: '💷' },
        { birim: 'Altin (Gram)', kur: '15 ELC', emoji: '🥇' },
        { birim: 'Bitcoin', kur: '12,500 ELC', emoji: '₿' },
      ];
      const desc = rates.map(r => `${r.emoji} **${r.birim}** — ${r.kur}`).join('\n');
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`${E.CL_electro_money} **Electro Doviz Kurlari**\n\n${desc}\n\n-# Infermus League • Guncel kurlar`),
      ])] });
    }
  },
  hava: {
    execute(message, args) {
      const sehir = args.join(' ') || 'Istanbul';
      const durumlar = ['☀️ Acik', '⛅ Parcali Bulutlu', '☁️ Kapali', '🌧️ Yagmurlu', '⛈️ Firtina', '🌨️ Kar Yagisli', '🌫️ Sisli'];
      const sicaklik = Math.floor(Math.random() * 35) + 5;
      const durum = durumlar[Math.floor(Math.random() * durumlar.length)];
      const nem = Math.floor(Math.random() * 40) + 40;
      const ruzgar = Math.floor(Math.random() * 30) + 5;
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`🌍 **${sehir}**\n\n**${durum}**\n\n${E.CL_pano} **Sicaklik:** ${sicaklik}°C\n${E.CL_pano} **Nem:** %${nem}\n${E.CL_pano} **Ruzgar:** ${ruzgar} km/s\n\n> Mac gunu icin hava durumu tahmini.\n\n-# Infermus League • Hava Durumu`),
      ])] });
    }
  },
  anket: {
    execute(message, args) {
      const soru = args.join(' ');
      if (!soru) return message.reply('Kullanim: `.anket <soru>`');
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`${E.CL_pano} **Anket**\n\n${soru}\n\n-# Infermus League • ${message.author.tag}`),
      ])] }).then(msg => {
        msg.react('✅').catch(() => {});
        msg.react('❌').catch(() => {});
      });
      message.delete().catch(() => {});
    }
  },
  öneri: {
    execute(message, args) {
      const text = args.join(' ');
      if (!text) return message.reply('Kullanim: `.oneri <mesaj>`');
      const container = Container([
        T(`${E.CL_hediye} **Yeni Oneri**\n\n${text}\n\n**Kullanici:** ${message.author.tag} (${message.author.id})\n**Kanal:** ${message.channel.name}\n\n-# Infermus League`),
      ]);
      const logKanal = db.get('settings.oneriKanal');
      if (logKanal) {
        const ch = message.guild.channels.cache.get(logKanal);
        if (ch) ch.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
      }
      message.reply('Onerin alindi! Tesekkurler.');
    }
  },
  çeviri: {
    async execute(message, args) {
      const text = args.join(' ');
      if (!text) return message.reply('Kullanim: `.ceviri (metin)` — ingilizceye cevirir.');
      try {
        const hedef = text.length > 10 ? 'en' : 'tr';
        const kaynak = hedef === 'en' ? 'auto' : 'en';
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${kaynak}|${hedef}`, { signal: AbortSignal.timeout(8000) });
        const data = await res.json();
        if (!data.responseData?.translatedText) return message.reply('Ceviri yapilamadi.');
        message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
          T(`${E.CL_pano} **Ceviri**\n\n**Orijinal:** ${text}\n\n**Ceviri:** ${data.responseData.translatedText}\n\n-# MyMemory API`),
        ])] });
      } catch {
        message.reply('Ceviri API\'sine ulasilamadi. Daha sonra tekrar deneyin.');
      }
    }
  }
};
