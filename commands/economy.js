const { EmbedBuilder, MessageFlags } = require('discord.js');
const db = require('../database/db');
const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

function e(desc) {
  return { flags: MessageFlags.IsComponentsV2, components: [Container([T(desc)])] };
}

function parseAmount(str) {
  if (!str || typeof str !== 'string') return NaN;
  const s = str.toLowerCase().replace(/,/g, '').trim();
  if (/^[\d.]+[b]$/.test(s)) return Math.floor(parseFloat(s) * 1e9);
  if (/^[\d.]+[m]$/.test(s)) return Math.floor(parseFloat(s) * 1e6);
  if (/^[\d.]+[k]$/.test(s)) return Math.floor(parseFloat(s) * 1e3);
  if (/^[\d.]+e\d+$/.test(s)) return Math.floor(parseFloat(s));
  return parseInt(s);
}

function getUserData(userId) {
  let user = db.get(`users.${userId}`);
  if (!user) {
    user = {
      value: 1, valueHistory: [], valueCount: 0,
      goals: 0, assists: 0,
      balance: 0, bankBalance: 0, bankHistory: [],
      skills: { genel: 50, hiz: 50, sut: 50, pas: 50, defans: 50, kaleci: 50 },
      squad: null, position: null, country: null, name: null,
      trainings: [], matchStats: { mac: 0, gol: 0, asist: 0, sarikart: 0, kirmizikart: 0 }
    };
    db.set(`users.${userId}`, user);
  }
  return db.get(`users.${userId}`);
}

module.exports = {
  sm: {
    execute(message) {
      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('Sohbet Mesai Bilgileri')
        .setFooter({ text: 'Infermus League', iconURL: message.client.user.displayAvatarURL() })
        .setDescription(`**Aktif Kullanıcı Sayısı**\n${Object.keys(db.getAllUsers()).length}\n━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_dongu} Sohbet mesai/aktiflik bilgileri gösteriliyor.`)
        .setTimestamp()
        ;
      message.channel.send({ embeds: [embed] });
    }
  },

  em: {
    execute(message) {
      const target = message.mentions.users.first() || message.author;
      getUserData(target.id);
      const balance = db.get(`users.${target.id}.balance`, 0);

      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle(`${target.username} - Bakiye`)
        .setFooter({ text: 'Infermus League', iconURL: message.client.user.displayAvatarURL() })
        .setDescription(`${E.CL_electro_money} **${balance}** coin`)
        .setTimestamp()
        ;
      message.channel.send({ embeds: [embed] });
    }
  },

  empay: {
    execute(message, args) {
      const user = message.mentions.users.first();
      if (!user || !args[1]) return message.reply(e(`${E.CL_uyari} Kullanım: .empay @kullanıcı (miktar)`));
      if (user.id === message.author.id) return message.reply(e(`${E.CL_carpi} Kendinize para gönderemezsiniz!`));

      const amount = parseAmount(args[1]);
      if (isNaN(amount) || amount <= 0) return message.reply(e(`${E.CL_uyari} Geçerli bir miktar girin! (orn: 100, 1k, 2m, 5e6)`));
      getUserData(message.author.id);
      getUserData(user.id);
      const senderBalance = db.get(`users.${message.author.id}.balance`, 0);

      if (senderBalance < amount) return message.reply(e(`${E.CL_carpi} Yetersiz bakiye!`));

      db.subtract(`users.${message.author.id}.balance`, amount);
      db.add(`users.${user.id}.balance`, amount);
      db.push(`users.${message.author.id}.bankHistory`, { type: 'gönderim', amount, to: user.id, date: new Date().toISOString() });
      db.push(`users.${user.id}.bankHistory`, { type: 'alma', amount, from: message.author.id, date: new Date().toISOString() });

      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('Para Gönderildi')
        .setFooter({ text: 'Infermus League', iconURL: message.client.user.displayAvatarURL() })
        .setDescription(`${E.CL_sag_ok} ${message.author} → ${user}: **${amount}** coin gönderildi.`)
        .setTimestamp()
        ;
      message.channel.send({ embeds: [embed] });
    }
  },

  emtop: {
    execute(message) {
      const users = db.getAllUsers();
      const sorted = Object.entries(users)
        .map(([id, data]) => ({ id, balance: data.balance || 0 }))
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 10);

      let desc = sorted.map((u, i) => {
        const tag = message.client.users.cache.get(u.id)?.tag || 'Bilinmeyen';
        return `**${i + 1}.** ${tag} — ${u.balance} coin`;
      }).join('\n') || 'Veri bulunmuyor.';

      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('Para Sıralaması (Top 10)')
        .setFooter({ text: 'Infermus League', iconURL: message.client.user.displayAvatarURL() })
        .setDescription(`${E.CL_kupa} ${desc}`)
        .setTimestamp()
        ;
      message.channel.send({ embeds: [embed] });
    }
  },

  emhistory: {
    execute(message) {
      const target = message.mentions.users.first() || message.author;
      getUserData(target.id);
      const history = db.get(`users.${target.id}.bankHistory`, []);

      if (history.length === 0) return message.reply(e(`${E.CL_uyari} İşlem geçmişi bulunmuyor.`));

      const recent = history.slice(-10).reverse();
      const desc = recent.map((h, i) => `**#${i + 1}** ${h.type.toUpperCase()} | ${h.amount} coin`).join('\n');

      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle(`${target.username} - Para Geçmişi (Son 10)`)
        .setFooter({ text: 'Infermus League', iconURL: message.client.user.displayAvatarURL() })
        .setDescription(`${E.CL_dongu} ${desc}`)
        .setTimestamp()
        ;
      message.channel.send({ embeds: [embed] });
    }
  },

  embank: {
    execute(message) {
      const target = message.mentions.users.first() || message.author;
      getUserData(target.id);
      const bank = db.get(`users.${target.id}.bankBalance`, 0);

      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle(`${target.username} - Banka Bakiyesi`)
        .setFooter({ text: 'Infermus League', iconURL: message.client.user.displayAvatarURL() })
        .setDescription(`${E.CL_electro_money} **${bank}** coin`)
        .setTimestamp()
        ;
      message.channel.send({ embeds: [embed] });
    }
  },

  emyatir: {
    execute(message, args) {
      const amount = parseAmount(args[0]);
      if (isNaN(amount) || amount <= 0) return message.reply(e(`${E.CL_uyari} Kullanım: .emyatir (miktar) — orn: 100, 1k, 2m, 5e6`));

      getUserData(message.author.id);
      const balance = db.get(`users.${message.author.id}.balance`, 0);
      if (balance < amount) return message.reply(e(`${E.CL_carpi} Yetersiz bakiye!`));

      db.subtract(`users.${message.author.id}.balance`, amount);
      db.add(`users.${message.author.id}.bankBalance`, amount);
      db.push(`users.${message.author.id}.bankHistory`, { type: 'yatırma', amount, date: new Date().toISOString() });

      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setFooter({ text: 'Infermus League', iconURL: message.client.user.displayAvatarURL() })
        .setDescription(`${E.CL_electro_money} **${amount}** coin bankaya yatırıldı.`)
        .setTimestamp()
        ;
      message.channel.send({ embeds: [embed] });
    }
  },

  emcek: {
    execute(message, args) {
      const amount = parseAmount(args[0]);
      if (isNaN(amount) || amount <= 0) return message.reply(e(`${E.CL_uyari} Kullanım: .emcek (miktar) — orn: 100, 1k, 2m, 5e6`));

      getUserData(message.author.id);
      const bank = db.get(`users.${message.author.id}.bankBalance`, 0);
      if (bank < amount) return message.reply(e(`${E.CL_carpi} Bankada yeterli bakiye yok!`));

      db.subtract(`users.${message.author.id}.bankBalance`, amount);
      db.add(`users.${message.author.id}.balance`, amount);
      db.push(`users.${message.author.id}.bankHistory`, { type: 'çekme', amount, date: new Date().toISOString() });

      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setFooter({ text: 'Infermus League', iconURL: message.client.user.displayAvatarURL() })
        .setDescription(`${E.CL_electro_money} **${amount}** coin bankadan çekildi.`)
        .setTimestamp()
        ;
      message.channel.send({ embeds: [embed] });
    }
  },

  emadd: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(`${E.CL_carpi} Yetkiniz yok!`));

      const user = message.mentions.users.first();
      if (!user || !args[1]) return message.reply(e(`${E.CL_uyari} Kullanım: .emadd @kullanıcı (miktar)`));

      const amount = parseAmount(args[1]);
      if (isNaN(amount) || amount <= 0) return message.reply(e(`${E.CL_uyari} Geçerli bir miktar girin! (orn: 100, 1k, 2m, 5e6)`));

      getUserData(user.id);
      db.add(`users.${user.id}.balance`, amount);
      db.push(`users.${user.id}.bankHistory`, { type: 'admin-ekleme', amount, moderator: message.author.id, date: new Date().toISOString() });

      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setFooter({ text: 'Infermus League', iconURL: message.client.user.displayAvatarURL() })
        .setDescription(`${E.CL_yesiltik} ${user}: **${amount}** coin eklendi.`)
        .setTimestamp()
        ;
      message.channel.send({ embeds: [embed] });
    }
  },

  emremove: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(`${E.CL_carpi} Yetkiniz yok!`));

      const user = message.mentions.users.first();
      if (!user || !args[1]) return message.reply(e(`${E.CL_uyari} Kullanım: .emremove @kullanıcı (miktar)`));

      const amount = parseAmount(args[1]);
      if (isNaN(amount) || amount <= 0) return message.reply(e(`${E.CL_uyari} Geçerli bir miktar girin! (orn: 100, 1k, 2m, 5e6)`));

      getUserData(user.id);
      db.subtract(`users.${user.id}.balance`, amount);
      db.push(`users.${user.id}.bankHistory`, { type: 'admin-silme', amount, moderator: message.author.id, date: new Date().toISOString() });

      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setFooter({ text: 'Infermus League', iconURL: message.client.user.displayAvatarURL() })
        .setDescription(`${E.CL_carpi} ${user}: **${amount}** coin silindi.`)
        .setTimestamp()
        ;
      message.channel.send({ embeds: [embed] });
    }
  },

  emreset: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(`${E.CL_carpi} Yetkiniz yok!`));

      const user = message.mentions.users.first();
      if (!user) return message.reply(e(`${E.CL_uyari} Kullanım: .emreset @kullanıcı`));

      getUserData(user.id);
      db.set(`users.${user.id}.balance`, 0);
      db.set(`users.${user.id}.bankBalance`, 0);

      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setFooter({ text: 'Infermus League', iconURL: message.client.user.displayAvatarURL() })
        .setDescription(`${E.CL_uyari} ${user}: Bakiyesi sıfırlandı.`)
        .setTimestamp()
        ;
      message.channel.send({ embeds: [embed] });
    }
  },

  emserverreset: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(`${E.CL_carpi} Yetkiniz yok!`));

      const users = db.getAllUsers();
      for (const id of Object.keys(users)) {
        db.set(`users.${id}.balance`, 0);
        db.set(`users.${id}.bankBalance`, 0);
        db.set(`users.${id}.bankHistory`, []);
      }

      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('Sunucu Ekonomi Sıfırlandı')
        .setFooter({ text: 'Infermus League', iconURL: message.client.user.displayAvatarURL() })
        .setDescription(`${E.CL_uyari} Tüm kullanıcıların bakiye ve banka verileri sıfırlandı.`)
        .setTimestamp()
        ;
      message.channel.send({ embeds: [embed] });
    }
  }
};
