const { MessageFlags } = require('discord.js');
const { T, Container, Thumb } = require('../utils/componentsv2');
const db = require('../database/db');
const config = require('../config.json');
const E = require('../config/emojis');

function isValueAuthorized(message) {
  if (message.member.permissions.has('Administrator')) return true;
  const rolId = db.get(`degerYetkilisiRol.${message.guild.id}`);
  if (rolId && message.member.roles.cache.has(rolId)) return true;
  return message.member.roles.cache.some(r => r.name === 'Değer Yetkilisi');
}

function getUserData(userId) {
  let user = db.get(`users.${userId}`);
  if (!user) {
    user = {
      value: config.defaultValue,
      valueHistory: [],
      valueCount: 0,
      goals: 0,
      assists: 0,
      balance: 0,
      bankBalance: 0,
      bankHistory: [],
      skills: { genel: 50, hiz: 50, sut: 50, pas: 50, defans: 50, kaleci: 50 },
      squad: null,
      position: null,
      country: null,
      name: null,
      trainings: [],
      matchStats: { mac: 0, gol: 0, asist: 0, sarikart: 0, kirmizikart: 0 }
    };
    db.set(`users.${userId}`, user);
  }
  return db.get(`users.${userId}`);
}

function getBaseName(member) {
  const nick = member.displayName;
  return nick.replace(/\s*\|\s*\d+(\.\d+)?M[€]?\s*$/, '').trim();
}

async function getGuildMember(guild, userId) {
  return guild.members.cache.get(userId) || await guild.members.fetch(userId).catch(() => null);
}

function parseAmount(input) {
  if (!input || typeof input !== 'string') return NaN;
  let str = input.replace(/[€e®\s]/gi, '').trim().toLowerCase();
  if (str.endsWith('k')) {
    const n = parseFloat(str.slice(0, -1));
    return isNaN(n) ? NaN : n * 0.001;
  }
  if (str.endsWith('m')) {
    const n = parseFloat(str.slice(0, -1));
    return isNaN(n) ? NaN : n;
  }
  return parseFloat(str);
}

function formatValue(val) {
  if (val < 1) return `${Math.round(val * 1000)}K`;
  const s = val % 1 === 0 ? val.toString() : val.toFixed(1).replace(/\.0$/, '');
  return `${s}M`;
}

async function updateNickname(member, newVal) {
  const base = getBaseName(member);
  const suffix = ` | ${formatValue(newVal)}€`;
  let newNick = `${base}${suffix}`;
  if (newNick.length > 32) {
    const truncatedBase = base.slice(0, Math.max(0, 32 - suffix.length));
    newNick = `${truncatedBase}${suffix}`.slice(0, 32);
  }
  if (member.nickname === newNick) return;
  await member.setNickname(newNick).catch(() => {});
}

async function sendDegerNotification(message, user, oldVal, newVal, amount, type, reason) {
  const kanalId = db.get(`degerKanal.${message.guild.id}`);
  if (!kanalId) return;
  const channel = message.guild.channels.cache.get(kanalId);
  if (!channel) return;
  const member = await getGuildMember(message.guild, user.id);
  const userName = member ? getBaseName(member) : user.username;
  const isim = type === 'dver' ? 'Değer Verildi' : 'Değer Düşürüldü';
  const islem = type === 'dver' ? `+${amount}M` : `-${amount}M`;
  channel.send({
    components: [Container([
      Thumb(user.displayAvatarURL({ size: 256 })),
      T(`**${member ? member.displayName : user.username}**\n\n${E.CL_yesiltik} **${isim}**\n\n**Hedef** ${user} (\`${user.id}\`)\n**Kullanıcı Adı** ${userName}\n**İşlem** ${islem}\n\n━━━━━━━━━━━━━━━━━━━━━━\n**Değişim** ${formatValue(oldVal)}€ → ${formatValue(newVal)}€\n**Sebep** ${reason || 'Belirtilmedi'}\n━━━━━━━━━━━━━━━━━━━━━━\n**Kontrol** Genel / GENEL\n**Yetkili** ${message.author} (\`${message.author.id}\`)\n\n-# Infermus League`)
    ])],
    flags: 32768
  });
  channel.send(`${user} değer güncellendi: **${formatValue(oldVal)}€** → **${formatValue(newVal)}€** (**${islem}**)`).then(m => setTimeout(() => m.delete().catch(() => {}), 10000));
}

module.exports = {
  dver: {
    async execute(message, args) {
      if (!isValueAuthorized(message)) {
        return message.reply('Bu komutu kullanma yetkiniz yok! (Değer Yetkilisi rolü veya Admin gerekli)');
      }
      const user = message.mentions.users.first();
      if (!user || !args[1]) {
        return message.reply('Kullanım: .dver @kullanıcı (sayı) (sebep)');
      }
      const amount = parseAmount(args[1]);
      if (isNaN(amount) || amount <= 0) return message.reply('Geçerli bir sayı girin!');
      const reason = args.slice(2).join(' ') || null;

      getUserData(user.id);
      const oldVal = db.get(`users.${user.id}.value`, config.defaultValue);
      const newVal = db.add(`users.${user.id}.value`, amount);
      db.push(`users.${user.id}.valueHistory`, { type: 'dver', amount, oldVal, newVal, date: new Date().toISOString(), moderator: message.author.id });
      db.add(`users.${user.id}.valueCount`, 1);

      const member = await getGuildMember(message.guild, user.id);
      if (member) await updateNickname(member, newVal);

      message.channel.send({
        components: [Container([T(`**${member ? member.displayName : user.username}**\n\n${E.CL_yesiltik} **Değer Yükseltildi**\n\n${user} kullanıcısının değeri **${formatValue(oldVal)}** → **${formatValue(newVal)}** olarak güncellendi.\n\n**Yetkili:** ${message.author}\n\n-# Infermus League`)])],
        flags: 32768
      });
      await sendDegerNotification(message, user, oldVal, newVal, amount, 'dver', reason);
    }
  },

  dal: {
    async execute(message, args) {
      if (!isValueAuthorized(message)) {
        return message.reply('Yetkiniz yok! (Değer Yetkilisi veya Admin)');
      }
      const user = message.mentions.users.first();
      if (!user || !args[1]) {
        return message.reply('Kullanım: .dal @kullanıcı (sayı) (sebep)');
      }
      const amount = parseAmount(args[1]);
      if (isNaN(amount) || amount <= 0) return message.reply('Geçerli bir sayı girin!');
      const reason = args.slice(2).join(' ') || null;

      getUserData(user.id);
      const oldVal = db.get(`users.${user.id}.value`, config.defaultValue);
      const newVal = db.subtract(`users.${user.id}.value`, amount);
      db.push(`users.${user.id}.valueHistory`, { type: 'dal', amount, oldVal, newVal, date: new Date().toISOString(), moderator: message.author.id });

      const member = await getGuildMember(message.guild, user.id);
      if (member) await updateNickname(member, newVal);

      message.channel.send({
        components: [Container([T(`**${member ? member.displayName : user.username}**\n\n${E.CL_yesiltik} **Değer Düşürüldü**\n\n${user} kullanıcısının değeri **${formatValue(oldVal)}** → **${formatValue(newVal)}** olarak güncellendi.\n\n**Yetkili:** ${message.author}\n\n-# Infermus League`)])],
        flags: 32768
      });
      await sendDegerNotification(message, user, oldVal, newVal, amount, 'dal', reason);
    }
  },

  dr: {
    execute(message) {
      const rolMention = db.get(`degerYetkilisiRol.${message.guild.id}`);
      const rol = rolMention ? message.guild.roles.cache.get(rolMention) : null;
      message.channel.send({
        components: [Container([T(`${E.CL_pano} **Değer Rehberi**\n\nFutbolcu değer sistemi rehberi.\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_kiliclar} .dver @kullanıcı (sayı) (sebep)\n${E.CL_sag_ok} Oyuncunun değerini yükseltir.\n\n${E.CL_kiliclar} .dal @kullanıcı (sayı) (sebep)\n${E.CL_sag_ok} Oyuncunun değerini düşürür.\n\n${E.CL_kiliclar} .dsil @kullanıcı\n${E.CL_sag_ok} Oyuncunun değerini siler (sıfırlar).\n\n${E.CL_kiliclar} .değersayı (@kullanıcı)\n${E.CL_sag_ok} Değer sayaçlarını gösterir.\n\n${E.CL_kiliclar} .degersifirla @kullanıcı\n${E.CL_sag_ok} Oyuncunun değer verilerini sıfırlar.\n\n${E.CL_kiliclar} .degergecmisi (@kullanıcı)\n${E.CL_sag_ok} Değer geçmişini gösterir.\n\n${E.CL_kiliclar} .dsayıekle @kullanıcı (sayı)\n${E.CL_sag_ok} Değer sayımına ekleme yapar.\n\n${E.CL_kiliclar} .dsayısil @kullanıcı (sayı)\n${E.CL_sag_ok} Değer sayısından silme yapar.\n\n${E.CL_kiliclar} .değerbildirme-kanalı #kanal\n${E.CL_sag_ok} Değer bildirim kanalını ayarlar (Admin).\n\n${E.CL_kiliclar} .değeryetkilisi @rol\n${E.CL_sag_ok} Değer yetkilisi rolünü ayarlar (Admin).\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n**Başlangıç Değeri :**\n${E.CL_sag_ok} Tüm oyuncular **${config.defaultValue}M** değer ile başlar.\n\n**Yetkili Rol :**\n${E.CL_sag_ok} ${rol ? `${rol}` : 'Ayarlanmamış \`.değeryetkilisi @rol\`'}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  dsil: {
    execute(message) {
      if (!isValueAuthorized(message)) {
        return message.reply('Yetkiniz yok! (Değer Yetkilisi veya Admin)');
      }
      const user = message.mentions.users.first();
      if (!user) return message.reply('Kullanım: .dsil @kullanıcı');

      getUserData(user.id);
      const oldVal = db.get(`users.${user.id}.value`, config.defaultValue);
      db.set(`users.${user.id}.value`, 0);
      db.push(`users.${user.id}.valueHistory`, { type: 'dsil', amount: oldVal, oldVal, newVal: 0, date: new Date().toISOString(), moderator: message.author.id });

      const member = message.guild.members.cache.get(user.id);
      if (member) {
        const base = getBaseName(member);
        member.setNickname(base.substring(0, 32)).catch(() => {});
      }

      message.channel.send({
        components: [Container([T(`${E.CL_uyari} **Değer Silindi**\n\n${user} kullanıcısının değeri sıfırlandı. (Eski: **${formatValue(oldVal)}**)\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  değersayı: {
    execute(message) {
      const target = message.mentions.users.first() || message.author;
      getUserData(target.id);
      const count = db.get(`users.${target.id}.valueCount`, 0);
      const val = db.get(`users.${target.id}.value`, config.defaultValue);

      message.channel.send({
        components: [Container([T(`${E.CL_pano} **${target.username} - Değer Sayacı**\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n**Mevcut Değer :**\n${E.CL_electro_money} ${formatValue(val)}\n\n**Değer İşlem Sayısı :**\n${E.CL_dongu} ${count}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  degersifirla: {
    execute(message) {
      if (!isValueAuthorized(message)) {
        return message.reply('Yetkiniz yok! (Değer Yetkilisi veya Admin)');
      }
      const user = message.mentions.users.first();
      if (!user) return message.reply('Kullanım: .degersifirla @kullanıcı');

      getUserData(user.id);
      db.set(`users.${user.id}.value`, config.defaultValue);
      db.set(`users.${user.id}.valueCount`, 0);
      db.set(`users.${user.id}.valueHistory`, []);

      const member = message.guild.members.cache.get(user.id);
      if (member) updateNickname(member, config.defaultValue);

      message.channel.send({
        components: [Container([T(`${E.CL_dongu} **Değer Sıfırlandı**\n\n${user} kullanıcısının tüm değer verileri sıfırlandı.\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  degergecmisi: {
    execute(message) {
      const target = message.mentions.users.first() || message.author;
      getUserData(target.id);
      const history = db.get(`users.${target.id}.valueHistory`, []);

      if (history.length === 0) {
        return message.reply(`${target.username} için değer geçmişi bulunmuyor.`);
      }

      const recent = history.slice(-10).reverse();
      const desc = recent.map((h, i) => `**#${i + 1}** ${h.type.toUpperCase()} | ${h.amount}M | ${h.oldVal}M → ${h.newVal}M`).join('\n');

      message.channel.send({
        components: [Container([T(`${E.CL_pano} **${target.username} - Değer Geçmişi (Son 10)**\n\n${desc}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\nToplam **${history.length}** işlem\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  dsayıekle: {
    execute(message, args) {
      if (!isValueAuthorized(message)) {
        return message.reply('Yetkiniz yok! (Değer Yetkilisi veya Admin)');
      }
      const user = message.mentions.users.first();
      if (!user || !args[1]) return message.reply('Kullanım: .dsayıekle @kullanıcı (sayı)');

      const amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) return message.reply('Geçerli bir sayı girin!');

      getUserData(user.id);
      const newCount = db.add(`users.${user.id}.valueCount`, amount);

      message.channel.send({
        components: [Container([T(`${E.CL_sag_ok} **Değer Sayımı Güncellendi**\n\n${user}: Değer sayımı **${newCount}** olarak güncellendi. (+${amount})\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  deup: {
    async execute(message, args) {
      return module.exports.dal.execute(message, args);
    }
  },
  up: {
    async execute(message, args) {
      return module.exports.dver.execute(message, args);
    }
  },
  dup: {
    async execute(message, args) {
      return module.exports.dver.execute(message, args);
    }
  },
  dsayısil: {
    execute(message, args) {
      if (!isValueAuthorized(message)) {
        return message.reply('Yetkiniz yok! (Değer Yetkilisi veya Admin)');
      }
      const user = message.mentions.users.first();
      if (!user || !args[1]) return message.reply('Kullanım: .dsayısil @kullanıcı (sayı)');

      const amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) return message.reply('Geçerli bir sayı girin!');

      getUserData(user.id);
      const newCount = db.subtract(`users.${user.id}.valueCount`, amount);

      message.channel.send({
        components: [Container([T(`${E.CL_carpi} **Değer Sayımı Güncellendi**\n\n${user}: Değer sayımı **${newCount}** olarak güncellendi. (-${amount})\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  değerlist: {
    execute(message) {
      const users = db.getAllUsers();
      const sorted = Object.entries(users)
        .filter(([, u]) => (u.value || 0) > 0)
        .sort((a, b) => (b[1].value || 0) - (a[1].value || 0))
        .slice(0, 10);

      if (sorted.length === 0) return message.reply('Değer kaydı bulunmuyor.');

      const desc = sorted.map(([id, u], i) => {
        const tag = message.client.users.cache.get(id)?.tag || 'Bilinmeyen';
        const squad = u.squad ? ` (${u.squad})` : '';
        const m = i === 0 ? E.CL_kupa : i === 1 ? E.CL_bilet : i === 2 ? E.CL_kraltac : E.CL_yildiz;
        return `${m} **${i + 1}.** ${tag}${squad} — ${E.CL_electro_money} ${formatValue(u.value)}`;
      }).join('\n');

      message.channel.send({
        components: [Container([T(`**${E.CL_kupa} Değer Liderlik Tablosu**\n\n${desc}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },

  'değerbildirme-kanalı': {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const channel = message.mentions.channels.first();
      if (!channel) return message.reply('Kullanım: .değerbildirme-kanalı #kanal');
      db.set(`degerKanal.${message.guild.id}`, channel.id);
      message.channel.send(`✅ Değer bildirim kanalı ${channel} olarak ayarlandı.`);
    }
  },

  değeryetkilisi: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const role = message.mentions.roles.first();
      if (!role) return message.reply('Kullanım: .değeryetkilisi @rol');
      db.set(`degerYetkilisiRol.${message.guild.id}`, role.id);
      message.channel.send(`✅ Değer yetkilisi rolü ${role} olarak ayarlandı.`);
    }
  },
};
