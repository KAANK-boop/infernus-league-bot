const { MessageFlags } = require('discord.js');
const db = require('../database/db');
const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

function isAuth(message) {
  if (message.member.permissions.has('Administrator')) return true;
  const roller = db.get(`roller.${message.guild.id}`, {});
  if (roller.baskan && message.member.roles.cache.has(roller.baskan)) return true;
  if (roller.teknik && message.member.roles.cache.has(roller.teknik)) return true;
  return false;
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
  kadrolist: {
    execute(message, args) {
      const teamName = args.join(' ') || 'Genel';
      const users = db.getAllUsers();
      const squadMembers = Object.entries(users).filter(([id, u]) => u.squad?.toLowerCase() === teamName.toLowerCase());

      if (squadMembers.length === 0) return message.reply(`**${teamName}** takımında oyuncu bulunmuyor.`);

      const desc = squadMembers.map(([id, u], i) => {
        const tag = message.client.users.cache.get(id)?.tag || 'Bilinmeyen';
        const pos = u.position || 'Belirtilmemiş';
        return `${E.CL_futbolbotu} **${i + 1}.** ${tag} | ${pos} | ${u.value || 1}M`;
      }).join('\n');

      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`**${teamName} - Takım Kadrosu (${squadMembers.length})**\n\n${desc}\n-# Infermus League`)])]
      });
    }
  },

  kadrogir: {
    execute(message, args) {
      if (!isAuth(message)) return message.reply('Bu komut için Admin, Başkan veya Teknik Direktör yetkisi gerekli!');

      const user = message.mentions.users.first();
      if (!user) return message.reply('Kullanım: .kadrogir @kullanıcı (takım_adı)');

      const teamName = args.slice(1).join(' ');
      if (!teamName) return message.reply('Takım adı belirtin!');

      getUserData(user.id);
      db.set(`users.${user.id}.squad`, teamName);

      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`${E.CL_yesiltik} ${user} → **${teamName}** takımına eklendi.\n-# Infermus League`)])]
      });
    }
  },

  kadrosil: {
    execute(message, args) {
      if (!isAuth(message)) return message.reply('Bu komut için Admin, Başkan veya Teknik Direktör yetkisi gerekli!');

      const user = message.mentions.users.first();
      const teamName = args.slice(user ? 1 : 0).join(' ');

      if (user && teamName) {
        getUserData(user.id);
        db.set(`users.${user.id}.squad`, teamName);
        db.set(`users.${user.id}.position`, null);
        return message.channel.send({
          flags: MessageFlags.IsComponentsV2,
          components: [Container([T(`${E.CL_yesiltik} ${user} → **${teamName}** takımına transfer edildi.\n-# Infermus League`)])]
        });
      }

      if (user) {
        getUserData(user.id);
        db.set(`users.${user.id}.squad`, null);
        db.set(`users.${user.id}.position`, null);
        return message.channel.send({
          flags: MessageFlags.IsComponentsV2,
          components: [Container([T(`${E.CL_yesiltik} ${user} takımdan çıkarıldı.\n-# Infermus League`)])]
        });
      }

      if (teamName) {
        const users = db.getAllUsers();
        let count = 0;
        Object.entries(users).forEach(([id, u]) => {
          if (u.squad?.toLowerCase() === teamName.toLowerCase()) {
            db.set(`users.${id}.squad`, null);
            db.set(`users.${id}.position`, null);
            count++;
          }
        });
        return message.channel.send({
          flags: MessageFlags.IsComponentsV2,
          components: [Container([T(`${E.CL_yesiltik} **${teamName}** takımındaki **${count}** oyuncu silindi.\n-# Infermus League`)])]
        });
      }

      return message.reply('Kullanım:\n`.kadrosil @kullanıcı` — tek oyuncu sil\n`.kadrosil @kullanıcı YeniTakım` — transfer\n`.kadrosil TakımAdı` — tüm takımı sil');
    }
  },

  kadrom: {
    execute(message, args) {
      let teamName = args.join(' ');
      if (!teamName) {
        teamName = db.get(`users.${message.author.id}.squad`);
        if (!teamName) return message.reply('Bir takıma kayıtlı değilsin. Takım adı belirterek kullan: `.kadrom takım_adı`');
      }

      const users = db.getAllUsers();
      const squadMembers = Object.entries(users).filter(([id, u]) => u.squad?.toLowerCase() === teamName.toLowerCase());

      if (squadMembers.length === 0) return message.reply(`**${teamName}** takımında oyuncu bulunmuyor.`);

      const desc = squadMembers.map(([id, u], i) => {
        const tag = message.client.users.cache.get(id)?.tag || 'Bilinmeyen';
        const pos = u.position || 'Belirtilmemiş';
        return `${E.CL_futbolbotu} **${i + 1}.** ${tag} | ${pos} | ${u.value || 1}M`;
      }).join('\n');

      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`**${teamName} - Takım Kadrosu (${squadMembers.length})**\n\n${desc}\n-# Infermus League`)])]
      });
    }
  },

  yedekekle: {
    execute(message) {
      if (!isAuth(message)) return message.reply('Bu komut için Admin, Başkan veya Teknik Direktör yetkisi gerekli!');

      const user = message.mentions.users.first();
      if (!user) return message.reply('Kullanım: .yedekekle @kullanıcı');

      getUserData(user.id);
      db.set(`users.${user.id}.squad`, db.get(`users.${user.id}.squad`) || 'Yedek');
      db.set(`users.${user.id}.position`, 'Yedek');

      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`${E.CL_yesiltik} ${user} yedek oyuncu olarak eklendi.\n-# Infermus League`)])]
      });
    }
  },

  ilk11: {
    execute(message, args) {
      const teamName = args.join(' ') || 'Ana Takım';
      const users = db.getAllUsers();
      const first11 = Object.entries(users).filter(([id, u]) => u.squad === teamName && u.position && u.position !== 'Yedek').slice(0, 11);

      if (first11.length === 0) return message.reply(`**${teamName}** için ilk 11 bulunmuyor.`);

      const desc = first11.map(([id, u], i) => {
        const tag = message.client.users.cache.get(id)?.tag || 'Bilinmeyen';
        return `${E.CL_kraltac} **${i + 1}.** ${tag} | ${u.position} | ${u.value || 1}M`;
      }).join('\n');

      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`**${teamName} - İlk 11**\n\n${desc}\n-# Infermus League`)])]
      });
    }
  },

  ilk11ayarla: {
    execute(message, args) {
      if (!isAuth(message)) return message.reply('Bu komut için Admin, Başkan veya Teknik Direktör yetkisi gerekli!');

      const mentions = [...message.mentions.users.values()];
      if (mentions.length === 0) return message.reply('Kullanım: `.ilk11ayarla @kullanıcı (mevki)`\nÇoklu: `.ilk11ayarla @user1 Stoper @user2 Sol Bek`\nSadece etiket: `.ilk11ayarla @user1 @user2` (varsa mevkisini korur, yoksa Orta Saha atar)');

      const content = args.join(' ');
      const results = [];

      for (let i = 0; i < mentions.length; i++) {
        const user = mentions[i];
        const mentionStr = `<@${user.id}>`;
        const nextMention = i < mentions.length - 1 ? `<@${mentions[i + 1].id}>` : null;

        let startIdx = content.indexOf(mentionStr) + mentionStr.length;
        let endIdx = nextMention ? content.indexOf(nextMention) : content.length;
        let posText = content.slice(startIdx, endIdx).trim();

        const existing = db.get(`users.${user.id}.position`);
        const pos = posText || existing || 'Orta Saha';

        getUserData(user.id);
        db.set(`users.${user.id}.position`, pos);
        results.push(`${E.CL_yesiltik} ${user}: **${pos}**${!posText && existing ? ' (mevcut mevki korundu)' : posText ? '' : ' (varsayılan)'}`);
      }

      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`${results.join('\n')}\n-# Infermus League`)])]
      });
    }
  },

  ilk11duzenle: {
    execute(message, args) {
      if (!isAuth(message)) return message.reply('Bu komut için Admin, Başkan veya Teknik Direktör yetkisi gerekli!');

      const user = message.mentions.users.first();
      if (!user || !args[1]) return message.reply('Kullanım: .ilk11duzenle @kullanıcı (yeni_mevki)');

      const position = args.slice(1).join(' ');
      getUserData(user.id);
      db.set(`users.${user.id}.position`, position);

      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`${E.CL_dongu} ${user}: Mevkii **${position}** olarak düzenlendi.\n-# Infermus League`)])]
      });
    }
  },

  oyuncudegis: {
    execute(message) {
      if (!isAuth(message)) return message.reply('Bu komut için Admin, Başkan veya Teknik Direktör yetkisi gerekli!');

      const args2 = message.content.split(/ +/);
      const outUser = message.mentions.users.first();
      const inUser = message.mentions.users.at(1);

      if (!outUser || !inUser) return message.reply('Kullanım: .oyuncudegis @çıkan @giren');

      getUserData(outUser.id);
      getUserData(inUser.id);

      const outPos = db.get(`users.${outUser.id}.position`);
      db.set(`users.${inUser.id}.position`, outPos);
      db.set(`users.${outUser.id}.position`, 'Yedek');

      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`${E.CL_dongu} ${outUser} (Yedek) ↔ ${inUser} (${outPos})\n-# Infermus League`)])]
      });
    }
  },

  bütçe: {
    execute(message, args) {
      // Check if first arg is a role mention
      const roleMention = message.mentions.roles.first();
      if (roleMention) {
        if (!message.member.permissions.has('Administrator') && !isAuth(message)) {
          return message.reply('Yetkiniz yok! (Admin, Başkan veya Teknik Direktör)');
        }
        const roleId = roleMention.id;
        const parts = args.slice(1).join(' ').split(',').map(s => s.trim());
        if (parts.length === 3 || (parts.length === 1 && args.length >= 4)) {
          let tf, salary, limit;
          if (parts.length === 3) {
            tf = parts[0]; salary = parts[1]; limit = parts[2];
          } else {
            tf = args[1]; salary = args[2]; limit = args[3];
          }
          const parse = v => {
            let s = v.replace(/[€\s]/g, '').toLowerCase();
            let n = parseFloat(s);
            if (s.endsWith('k')) n = n * 0.001;
            if (isNaN(n)) return NaN;
            return n;
          };
          const tfN = parse(tf), salN = parse(salary), limN = parse(limit);
          if (isNaN(tfN) || isNaN(salN) || isNaN(limN)) return message.reply('Kullanım: `.bütçe @rol tfMaaş,maaşBütçe,limit` veya `.bütçe @rol tf maaş limit`');
          db.set(`budgets.${roleId}`, { tf: tfN, salary: salN, limit: limN });
          const fmt = v => v < 1 ? `${Math.round(v * 1000)}K` : `${v % 1 === 0 ? v : v.toFixed(1).replace(/\.0$/, '')}M`;
          return message.channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [Container([T(`${E.CL_electro_money} ${roleMention} bütçeleri ayarlandı:\n💰 TF: ${fmt(tfN)}€ | Maaş: ${fmt(salN)}€ | Limit: ${fmt(limN)}€\n-# Infermus League`)])]
          });
        }
        // View budget for a role
        const data = db.get(`budgets.${roleId}`);
        if (!data) return message.reply(`${roleMention} için bütçe ayarlanmamış. Kullanım: \`.bütçe @rol tf,maaş,limit\``);
        const fmt = v => v < 1 ? `${Math.round(v * 1000)}K` : `${v % 1 === 0 ? v : v.toFixed(1).replace(/\.0$/, '')}M`;
        return message.channel.send({
          flags: MessageFlags.IsComponentsV2,
          components: [Container([T(`${E.CL_pano} ${roleMention}\n💰 **TF Bütçesi:** ${fmt(data.tf)}€\n💳 **Maaş Bütçesi:** ${fmt(data.salary)}€\n🔝 **Limit:** ${fmt(data.limit)}€\n-# Infermus League`)])]
        });
      }

      // Original flow: team name based
      const teamName = args.slice(0, -1).join(' ') || args.join(' ');
      const amountStr = args[args.length - 1];

      const isAmount = /^\d+(\.\d+)?\s*[Mk]?[€]?$/i.test(amountStr);
      if (isAmount) {
        if (!message.member.permissions.has('Administrator') && !isAuth(message)) {
          return message.reply('Yetkiniz yok! (Admin, Başkan veya Teknik Direktör)');
        }
        const team = args.slice(0, -1).join(' ').trim();
        if (!team) return message.reply('Kullanım: `.bütçe TakımAdı (miktar)`');
        let raw = amountStr.replace(/[€\s]/g, '').toLowerCase();
        let amount = parseFloat(raw);
        if (raw.endsWith('k')) amount = parseFloat(raw) * 0.001;
        else if (raw.endsWith('m')) amount = parseFloat(raw);
        if (isNaN(amount) || amount < 0) return message.reply('Geçerli bir miktar girin.');
        db.set(`teams.${team}.budget`, amount);
        const display = amount < 1 ? `${Math.round(amount * 1000)}K` : `${amount % 1 === 0 ? amount : amount.toFixed(1).replace(/\.0$/, '')}M`;
        return message.channel.send({
          flags: MessageFlags.IsComponentsV2,
          components: [Container([T(`${E.CL_electro_money} **${team}** takım bütçesi **${display}€** olarak ayarlandı.\n-# Infermus League`)])]
        });
      }

      const team = args.join(' ').trim();
      if (!team) {
        const myTeam = db.get(`users.${message.author.id}.squad`);
        if (!myTeam) return message.reply('Kullanım: `.bütçe TakımAdı` veya `.bütçe TakımAdı (miktar)`');
        const budget = db.get(`teams.${myTeam}.budget`, 0);
        const total = Object.entries(db.getAllUsers()).filter(([, u]) => u.squad?.toLowerCase() === myTeam.toLowerCase()).reduce((s, [, u]) => s + (u.value || 0), 0);
        const fmt = v => v < 1 ? `${Math.round(v * 1000)}K` : `${v % 1 === 0 ? v : v.toFixed(1).replace(/\.0$/, '')}M`;
        return message.channel.send({
          flags: MessageFlags.IsComponentsV2,
          components: [Container([T(`${E.CL_pano} **${myTeam}**\n💰 **Bütçe:** ${fmt(budget)}€\n🏷️ **Toplam Değer:** ${fmt(total)}€\n-# Infermus League`)])]
        });
      }

      const budget = db.get(`teams.${team}.budget`, 0);
      const total = Object.entries(db.getAllUsers()).filter(([, u]) => u.squad?.toLowerCase() === team.toLowerCase()).reduce((s, [, u]) => s + (u.value || 0), 0);
      const fmt = v => v < 1 ? `${Math.round(v * 1000)}K` : `${v % 1 === 0 ? v : v.toFixed(1).replace(/\.0$/, '')}M`;
      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`${E.CL_pano} **${team}**\n💰 **Bütçe:** ${fmt(budget)}€\n🏷️ **Toplam Değer:** ${fmt(total)}€\n-# Infermus League`)])]
      });
    }
  },

  bütçeler: {
    execute(message) {
      const budgets = db.get('budgets', {});
      const entries = Object.entries(budgets);
      if (entries.length === 0) return message.reply('Hiç bütçe kaydı bulunmuyor.');
      const fmt = v => v < 1 ? `${Math.round(v * 1000)}K` : `${v % 1 === 0 ? v : v.toFixed(1).replace(/\.0$/, '')}M`;
      const desc = entries.map(([rid, b]) => {
        const role = message.guild.roles.cache.get(rid);
        const name = role ? role.name : rid;
        return `${role || `\`${rid}\``} — TF: ${fmt(b.tf)}€ | Maaş: ${fmt(b.salary)}€ | Limit: ${fmt(b.limit)}€`;
      }).join('\n');
      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`**${E.CL_pano} Takım Bütçeleri**\n\n${desc}\n-# Infermus League`)])]
      });
    }
  }
};
