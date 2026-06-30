const { MessageFlags } = require('discord.js');
const db = require('../database/db');
const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

const DFLT_LMT = 5;

function getLimit(uid) { return db.get(`antremanLimit.${uid}`, DFLT_LMT); }

module.exports = {
  antrenman: {
    async execute(message, args, client) {
      const antremanKanal = db.get('settings.antrenmanKanal');
      if (antremanKanal && message.channel.id !== antremanKanal) {
        return message.reply(`${E.CL_carpi} Bu komut sadece <#${antremanKanal}> kanalında kullanılabilir!`);
      }
      const uid = message.author.id;
      const lim = getLimit(uid);
      let count = db.get(`antreman.${uid}`, 0);
      if (count >= lim) {
        db.set(`antreman.${uid}`, 0);
        return message.channel.send({
          flags: MessageFlags.IsComponentsV2,
          components: [Container([T(`**${E.weight} Antrenman Sıfırlandı**\n\n${E.CL_yesiltik} Antrenmanın **${lim}/${lim}** oldu ve sıfırlandı!`)])]
        });
      }
      count += 1;
      db.set(`antreman.${uid}`, count);
      const bar = makeBar(count, lim);
      if (count === lim) {
        const cur = db.get(`users.${uid}.value`, 1);
        const bonus = 0.2;
        const nv = cur + bonus;
        const ab = nv - cur;
        db.set(`users.${uid}.value`, nv);
        const member = message.guild.members.cache.get(uid);
        if (member) {
          const base = member.displayName.replace(/\s*\|\s*\d+(\.\d+)?M[€]?\s*$/, '').trim();
          const sfx = nv < 1 ? `${Math.round(nv * 1000)}K€` : `${nv % 1 === 0 ? nv : nv.toFixed(1).replace(/\.0$/, '')}M€`;
          member.setNickname(`${base} | ${sfx}`).catch(() => {});
        }
        return message.channel.send({
          flags: MessageFlags.IsComponentsV2,
          components: [Container([T(`**${E.weight} Antrenman Tamamlandı!**\n\n**${count}/${lim}** ${bar}\n${E.CL_hediye} **Tebrikler!** ${count}/${lim} antrenmanı tamamladın! **${ab < 1 ? `${Math.round(ab * 1000)}K` : `${ab}M`}€** Değer kazandın!`)])]
        });
      }
      const msgs = [`${E.CL_yildiz} Özel antrenmana başladın, devam et!`, `${E.glowing_star} 2/${lim} — Güzel gidiyorsun!`, `${E.dizzy} 3/${lim} — Yarıdan fazla bitti!`, `${E.CL_sparkles} 4/${lim} — Son bir özel antrenman kaldı!`];
      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`**${E.weight} Antrenman — ${count}/${lim}**\n\n${bar}\n${msgs[Math.min(count - 1, msgs.length - 1)]}`)])]
      });
    }
  },
  'antrenman-kanali': {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(`${E.CL_carpi} Bu komutu sadece yöneticiler kullanabilir!`);
      const ch = message.mentions.channels.first();
      if (!ch) return message.reply(`Kullanım: .antrenman-kanalı #kanal`);
      db.set('settings.antrenmanKanal', ch.id);
      message.reply(`${E.CL_yesiltik} Antrenman kanalı ${ch} olarak ayarlandı.`);
    }
  },
  antrenmansayıekle: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(`${E.CL_carpi} Bu komutu sadece yöneticiler kullanabilir!`);
      const user = message.mentions.users.first();
      if (!user) return message.reply(`Kullanım: \`.antrenmansayıekle @kullanıcı [miktar]\``);
      const amount = parseInt(args[1]) || 1;
      if (amount <= 0) return message.reply(`${E.CL_carpi} Geçerli bir miktar girin!`);
      const cur = db.get(`antreman.${user.id}`, 0);
      const lim = getLimit(user.id);
      const yeni = Math.min(cur + amount, lim);
      db.set(`antreman.${user.id}`, yeni);
      const ek = yeni - cur;
      message.reply(`${E.CL_yesiltik} ${user.tag} kullanıcısına **+${ek}** antrenman sayısı eklendi. (**${cur} → ${yeni}/${lim}**)`);
    }
  },
  antrenmanlimit: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(`${E.CL_carpi} Bu komutu sadece yöneticiler kullanabilir!`);
      const user = message.mentions.users.first();
      if (!user || !args[1]) return message.reply(`Kullanım: \`.antrenmanlimit @kullanıcı <sayı>\``);
      const lim = parseInt(args[1]);
      if (isNaN(lim) || lim < 1) return message.reply(`${E.CL_carpi} Geçerli bir limit girin (en az 1)!`);
      db.set(`antremanLimit.${user.id}`, lim);
      const cur = db.get(`antreman.${user.id}`, 0);
      if (cur >= lim) db.set(`antreman.${user.id}`, lim);
      message.reply(`${E.CL_yesiltik} ${user.tag} için antrenman limiti **${lim}** olarak ayarlandı. (**${Math.min(cur, lim)}/${lim}**)`);
    }
  },
};

function makeBar(v, t) {
  const l = 10;
  const f = Math.round((v / t) * l);
  return '█'.repeat(Math.min(f, l)) + '░'.repeat(Math.max(l - f, 0));
}
