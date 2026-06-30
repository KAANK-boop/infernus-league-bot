const { MessageFlags } = require('discord.js');
const db = require('../database/db');
const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

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
  golekle: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const user = message.mentions.users.first();
      if (!user || !args[1]) return message.reply('Kullanım: .golekle @kullanıcı (sayı)');
      const amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) return message.reply('Geçerli bir sayı girin!');
      getUserData(user.id);
      const newGoals = db.add(`users.${user.id}.goals`, amount);
      db.add(`users.${user.id}.matchStats.gol`, amount);
      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`${E.CL_futbolbotu} **Gol Ekle** ${E.CL_yesiltik}\n━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_kupa} ${user}: Gol sayısı **${newGoals}** (+${amount})\n-# Infermus League`)])]
      });
    }
  },

  golsil: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const user = message.mentions.users.first();
      if (!user || !args[1]) return message.reply('Kullanım: .golsil @kullanıcı (sayı)');
      const amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) return message.reply('Geçerli bir sayı girin!');
      getUserData(user.id);
      const newGoals = db.subtract(`users.${user.id}.goals`, amount);
      db.subtract(`users.${user.id}.matchStats.gol`, amount);
      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`${E.CL_futbolbotu} **Gol Sil** ${E.CL_carpi}\n━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_kupa} ${user}: Gol sayısı **${newGoals}** (-${amount})\n-# Infermus League`)])]
      });
    }
  },

  golsayi: {
    execute(message) {
      const target = message.mentions.users.first() || message.author;
      getUserData(target.id);
      const goals = db.get(`users.${target.id}.goals`, 0);
      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`${E.CL_futbolbotu} **${target.username}** ${E.CL_sag_ok} Gol Sayısı\n━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_kupa} **Gol:** ${goals}\n-# Infermus League`)])]
      });
    }
  },

  asistekle: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const user = message.mentions.users.first();
      if (!user || !args[1]) return message.reply('Kullanım: .asistekle @kullanıcı (sayı)');
      const amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) return message.reply('Geçerli bir sayı girin!');
      getUserData(user.id);
      const newAsists = db.add(`users.${user.id}.assists`, amount);
      db.add(`users.${user.id}.matchStats.asist`, amount);
      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`${E.CL_futbolbotu} **Asist Ekle** ${E.CL_yesiltik}\n━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_transfer} ${user}: Asist sayısı **${newAsists}** (+${amount})\n-# Infermus League`)])]
      });
    }
  },

  asistsil: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const user = message.mentions.users.first();
      if (!user || !args[1]) return message.reply('Kullanım: .asistsil @kullanıcı (sayı)');
      const amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) return message.reply('Geçerli bir sayı girin!');
      getUserData(user.id);
      const newAsists = db.subtract(`users.${user.id}.assists`, amount);
      db.subtract(`users.${user.id}.matchStats.asist`, amount);
      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`${E.CL_futbolbotu} **Asist Sil** ${E.CL_carpi}\n━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_transfer} ${user}: Asist sayısı **${newAsists}** (-${amount})\n-# Infermus League`)])]
      });
    }
  },

  asistsayi: {
    execute(message) {
      const target = message.mentions.users.first() || message.author;
      getUserData(target.id);
      const assists = db.get(`users.${target.id}.assists`, 0);
      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`${E.CL_futbolbotu} **${target.username}** ${E.CL_sag_ok} Asist Sayısı\n━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_transfer} **Asist:** ${assists}\n-# Infermus League`)])]
      });
    }
  },

  stat: {
    execute(message) {
      const target = message.mentions.users.first() || message.author;
      getUserData(target.id);
      const g = db.get(`users.${target.id}.goals`, 0);
      const a = db.get(`users.${target.id}.assists`, 0);
      const ms = db.get(`users.${target.id}.matchStats`, { mac: 0, gol: 0, asist: 0, sarikart: 0, kirmizikart: 0 });
      const val = db.get(`users.${target.id}.value`, 1);

      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`${E.CL_kraltac} **${target.username}** ${E.CL_sag_ok} Genel İstatistikler\n━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_futbolbotu} **Goller:** ${g} (Maç: ${ms.gol})\n${E.CL_dongu} **Asistler:** ${a} (Maç: ${ms.asist})\n${E.CL_electro_money} **Değer:** ${val}M\n${E.CL_uyari} **Sarı Kart:** ${ms.sarikart || 0}\n${E.CL_kiliclar} **Kırmızı Kart:** ${ms.kirmizikart || 0}\n${E.CL_hediye} **Maç Sayısı:** ${ms.mac || 0}\n-# Infermus League`)])]
      });
    }
  },

  u: {
    execute(message, args) {
      module.exports.stat.execute(message, args);
    }
  }
};
