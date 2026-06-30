const { MessageFlags } = require('discord.js');
const db = require('../database/db');
const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const TAKIM_EMOJIS = ['🔴', '🔵', '🟢', '🟡', '🟠', '🟣', '⚫', '⚪'];
const SONUC_MESAJLARI = [
  `${E.CL_kupa} **Muhteşem bir maç!**`,
  `${E.CL_simsek} **Nefes kesen mücadele!**`,
  `${E.CL_hedef} **Harika bir karşılaşma!**`,
  `${E.CL_yildiz} **Unutulmaz bir maç!**`,
  `${E.CL_boss} **Kıran kırana bir maç!**`,
];

module.exports = {
  msgir: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');

      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`**Maç Sonucu Giriş Paneli**\n━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_futbolbotu} **Komutlar:**\n${'`'}.macbaslat [takım1] vs [takım2]${'`'}\n${'`'}.macgol @oyuncu (dk)${'`'}\n${'`'}.macbitir [skor1]-[skor2]${'`'}\n\n-# Infermus League`),
      ])] });
    }
  },

  macbaslat: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');

      const matchName = args.join(' ') || 'İsimsiz Maç';
      const matchId = Date.now().toString();

      db.set(`matches.${matchId}`, {
        name: matchName,
        status: 'devam',
        goals: [],
        startTime: new Date().toISOString(),
        channelId: message.channel.id
      });

      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`**⚽ Maç Başladı!**\n━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_sag_ok} **Maç:** ${matchName}\n${E.CL_kraltac} **Maç ID:** \`${matchId}\`\n\n-# Infermus League`),
      ])] });
    }
  },

  macbitir: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');

      const matches = db.get('matches', {});
      const active = Object.entries(matches).find(([id, m]) => m.status === 'devam' && m.channelId === message.channel.id);

      if (!active) return message.reply('Bu kanalda aktif maç bulunmuyor!');

      const [matchId, matchData] = active;
      const skor = args.join(' ') || '0-0';

      db.set(`matches.${matchId}.status`, 'bitti');
      db.set(`matches.${matchId}.endTime`, new Date().toISOString());
      db.set(`matches.${matchId}.skor`, skor);

      const golSayisi = matchData.goals.length;
      const golList = matchData.goals.map((g, i) => `**${i + 1}.** ${g.dk}.dk - ${g.player}`).join('\n') || 'Gol kaydedilmedi.';

      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`**⏹ Maç Bitti!**\n━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_yesiltik} **Maç:** ${matchData.name}\n${E.CL_kupa} **Skor:** ${skor}\n${E.CL_kiliclar} **Goller:**\n${golList}\n${E.CL_futbolbotu} **Toplam Gol:** ${golSayisi}\n\n-# Infermus League`),
      ])] });
    }
  },

  matchend: {
    execute(message, args) {
      module.exports.macbitir.execute(message, args);
    }
  },

  macgol: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');

      const matches = db.get('matches', {});
      const active = Object.entries(matches).find(([id, m]) => m.status === 'devam' && m.channelId === message.channel.id);

      if (!active) return message.reply('Bu kanalda aktif maç bulunmuyor!');

      const [matchId, matchData] = active;
      const user = message.mentions.users.first();
      const minute = args[1] || '?';

      if (!user) return message.reply('Kullanım: .macgol @oyuncu (dk)');

      const tag = user.tag;
      db.push(`matches.${matchId}.goals`, { player: tag, dk: minute, userId: user.id });

      db.add(`users.${user.id}.matchStats.gol`, 1);
      db.add(`users.${user.id}.goals`, 1);

      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`**⚽ Gol!**\n━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_futbolbotu} **Oyuncu:** ${user}\n${E.CL_sag_ok} **Dakika:** ${minute}\n\n-# Infermus League`),
      ])] });
    }
  },

  takımbilgi: {
    execute(message, args) {
      module.exports.takımbilgileri.execute(message, args);
    }
  },
  takımbilgileri: {
    execute(message, args) {
      const teamName = args.join(' ') || 'Genel';
      const users = db.getAllUsers();
      const members = Object.entries(users).filter(([id, u]) => u.squad === teamName);

      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`**🏟️ ${teamName} - Takım Bilgileri**\n━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_kraltac} **Oyuncu Sayısı:** ${members.length}\n${E.CL_electro_money} **Toplam Değer:** ${members.reduce((s, [id, u]) => s + (u.value || 0), 0)}M\n\n-# Infermus League`),
      ])] });
    }
  },

  topver: {
    execute(message, args) {
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`**⚽ Top/Frikik/Santra Bilgisi**\n━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_dongu} **Vuruş:** ${args.join(' ') || 'Belirtilmedi'}\n${E.CL_yesiltik} **Durum:** Hazır\n\n-# Infermus League`),
      ])] });
    }
  },
  'maçlive': {
    async execute(message, args) {
      const text = args.join(' ');
      const parts = text.split(/\s+vs\s+/i);
      if (parts.length < 2) return message.reply('Kullanım: `.maçlive Takım1 vs Takım2`');
      const t1 = parts[0].trim();
      const t2 = parts[1].trim();
      if (!t1 || !t2) return message.reply('Geçerli iki takım adı girin.');

      const e1 = TAKIM_EMOJIS[Math.floor(Math.random() * TAKIM_EMOJIS.length)];
      const e2 = TAKIM_EMOJIS[Math.floor(Math.random() * TAKIM_EMOJIS.length)];
      let skor1 = 0, skor2 = 0;
      let events = [`${e1} **${t1}** vs ${e2} **${t2}** — Maç başladı! ⏱️ 0'`];
      const msg = await message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`⚽ **Maç Live**\n\n${events[0]}\n\n-# Infermus League`),
      ])] });

      const dkEvents = [];
      for (let dk = 1; dk <= 90; dk += Math.floor(Math.random() * 8) + 3) {
        if (dk > 90) break;
        const r = Math.random();
        if (r < 0.08) {
          const scorer = Math.random() < 0.5 ? t1 : t2;
          if (scorer === t1) skor1++; else skor2++;
          dkEvents.push({ dk, text: `⚽ **${scorer}** — **GOOOOL!** (${dk}') [${skor1}-${skor2}]` });
        } else if (r < 0.12) {
          const kart = Math.random() < 0.5 ? t1 : t2;
          dkEvents.push({ dk, text: `🟨 **${kart}** — Sarı kart (${dk}')` });
        } else if (r < 0.14 && dk > 60) {
          dkEvents.push({ dk, text: `🔄 **${Math.random() < 0.5 ? t1 : t2}** — Oyuncu değişikliği (${dk}')` });
        } else if (r < 0.16 && dk > 75) {
          dkEvents.push({ dk, text: `🟥 **${Math.random() < 0.5 ? t1 : t2}** — KIRMIZI KART! (${dk}')` });
        }
      }

      for (const ev of dkEvents) {
        await sleep(1500 + Math.random() * 2000);
        events.push(ev.text);
        const desc = events.join('\n') + `\n━━━━━━━━━━━\n${e1} **${t1}** ${skor1} - ${skor2} ${e2}**${t2}**`;
        await msg.edit({ components: [Container([
          T(`⚽ **Maç Live**\n\n${desc}\n\n-# Infermus League`),
        ])] });
      }

      await sleep(2000);
      const sonuc = skor1 > skor2 ? `${e1} **${t1}** kazandı!` : skor2 > skor1 ? `${e2} **${t2}** kazandı!` : 'Beraberlik!';
      const finalDesc = events.join('\n') + `\n━━━━━━━━━━━\n${e1} **${t1}** ${skor1} - ${skor2} ${e2}**${t2}**\n\n🏁 **MAÇ SONU** — ${sonuc}\n${SONUC_MESAJLARI[Math.floor(Math.random() * SONUC_MESAJLARI.length)]}`;
      await msg.edit({ components: [Container([
        T(`⚽ **Maç Live — Bitti**\n\n${finalDesc}\n\n-# Infermus League`),
      ])] });
    }
  }
};
