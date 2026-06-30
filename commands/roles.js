const { MessageFlags } = require('discord.js');
const { T, Container } = require('../utils/componentsv2');
const db = require('../database/db');
const E = require('../config/emojis');

function sendEmbed(message, color, title, desc) {
  const lines = [];
  if (title) lines.push(`**${title}**\n\n`);
  lines.push(desc);
  lines.push('\n\n-# Infermus League');
  message.channel.send({ components: [Container([T(lines.join(''))])], flags: MessageFlags.IsComponentsV2 });
}

module.exports = {
  rolver: {
    async execute(message, args) {
      if (!message.member.permissions.has('ManageRoles')) return sendEmbed(message, 0x2B2D31, null, `${E.CL_uyari} Yetkiniz yok!`);
      const member = message.mentions.members.first();
      const role = message.mentions.roles.first() || message.guild?.roles.cache.find(r => r.name === args[1]);
      if (!member || !role) return sendEmbed(message, 0x2B2D31, null, `Kullanım: \`.rolver @kullanıcı @rol\``);
      try {
        await member.roles.add(role);
        sendEmbed(message, 0x2B2D31, '✅ Rol Verildi', `${member.user} → **${role.name}**`);
      } catch { sendEmbed(message, 0x2B2D31, null, 'Rol verilemedi.'); }
    }
  },
  rolal: {
    async execute(message, args) {
      if (!message.member.permissions.has('ManageRoles')) return sendEmbed(message, 0x2B2D31, null, `${E.CL_uyari} Yetkiniz yok!`);
      const member = message.mentions.members.first();
      const role = message.mentions.roles.first() || message.guild?.roles.cache.find(r => r.name === args[1]);
      if (!member || !role) return sendEmbed(message, 0x2B2D31, null, `Kullanım: \`.rolal @kullanıcı @rol\``);
      try {
        await member.roles.remove(role);
        sendEmbed(message, 0x2B2D31, '🗑️ Rol Alındı', `${member.user} → **${role.name}** alındı.`);
      } catch { sendEmbed(message, 0x2B2D31, null, 'Rol alınamadı.'); }
    }
  },
  toplurolver: {
    async execute(message, args) {
      if (!message.member.permissions.has('ManageRoles')) return sendEmbed(message, 0x2B2D31, null, `${E.CL_uyari} Yetkiniz yok!`);
      const role = message.mentions.roles.first();
      const members = message.mentions.members;
      if (!role || members.size === 0) return sendEmbed(message, 0x2B2D31, null, `Kullanım: \`.toplurolver @rol @k1 @k2 ...\``);
      let count = 0;
      for (const [, m] of members) {
        try { await m.roles.add(role); count++; } catch {}
      }
      sendEmbed(message, 0x2B2D31, '✅ Toplu Rol', `**${count}** kullanıcıya **${role.name}** rolü verildi.`);
    }
  },
  toplurolal: {
    async execute(message, args) {
      if (!message.member.permissions.has('ManageRoles')) return sendEmbed(message, 0x2B2D31, null, `${E.CL_uyari} Yetkiniz yok!`);
      const role = message.mentions.roles.first();
      const members = message.mentions.members;
      if (!role || members.size === 0) return sendEmbed(message, 0x2B2D31, null, `Kullanım: \`.toplurolal @rol @k1 @k2 ...\``);
      let count = 0;
      for (const [, m] of members) {
        try { await m.roles.remove(role); count++; } catch {}
      }
      sendEmbed(message, 0x2B2D31, '🗑️ Toplu Rol Alma', `**${count}** kullanıcıdan **${role.name}** rolü alındı.`);
    }
  },
  herkeserolver: {
    async execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return sendEmbed(message, 0x2B2D31, null, `${E.CL_uyari} Yetkiniz yok!`);
      const role = message.mentions.roles.first() || message.guild?.roles.cache.find(r => r.name === args[0]);
      if (!role) return sendEmbed(message, 0x2B2D31, null, `Kullanım: \`.herkeserolver @rol\``);
      const action = args.includes('al') ? 'al' : 'ver';
      const msg = await message.channel.send('⏳ İşlem yapılıyor...');
      try {
        await message.guild?.members.fetch();
        const members = [...message.guild.members.cache.values()].filter(m => !m.user.bot);
        const fn = action === 'ver' ? m => m.roles.add(role) : m => m.roles.remove(role);
        const results = await Promise.allSettled(members.map(m => fn(m)));
        const done = results.filter(r => r.status === 'fulfilled').length;
        await msg.edit(`✅ **${done}/${members.length}** kullanıcıya **${role.name}** rolü ${action === 'ver' ? 'verildi' : 'alındı'}.`);
      } catch (e) {
        msg.edit(`❌ Hata: ${e.message}`);
      }
    }
  },
  rolemojiekle: {
    async execute(message, args) {
      if (!message.member.permissions.has('ManageRoles')) return message.reply('Yetkiniz yok!');
      const role = message.mentions.roles.first();
      const emoji = args[1];
      if (!role || !emoji) return message.reply('Kullanım: `.rolemojiekle @rol (emoji)`');
      db.set(`rolemoji.${message.guild.id}.${role.id}`, emoji);
      message.channel.send(`${role} rolüne **${emoji}** emojisi eklendi.`);
    }
  },
  rolemojisil: {
    execute(message, args) {
      if (!message.member.permissions.has('ManageRoles')) return message.reply('Yetkiniz yok!');
      const role = message.mentions.roles.first();
      if (!role) return message.reply('Kullanım: `.rolemojisil @rol`');
      db.delete(`rolemoji.${message.guild.id}.${role.id}`);
      message.channel.send(`${role} rolünün emojisi silindi.`);
    }
  },
  roliismi: {
    execute(message, args) {
      if (!message.member.permissions.has('ManageRoles')) return message.reply('Yetkiniz yok!');
      const role = message.mentions.roles.first();
      if (!role || !args[1]) return message.reply('Kullanım: .rolismi @rol (yeni_isim)');
      const newName = args.slice(1).join(' ');
      role.setName(newName).then(() => {
        message.channel.send(`Rol adı **${newName}** olarak değiştirildi.`);
      }).catch(() => message.reply('Rol adı değiştirilemedi.'));
    }
  },
  roliismi: {
    execute(message, args) {
      module.exports.roliismi.execute(message, args);
    }
  },
  isim: {
    async execute(message, args) {
      if (!message.member.permissions.has('ManageNicknames')) return message.reply('Yetkiniz yok!');
      const member = message.mentions.members.first();
      if (!member) return message.reply('Kullanım: .isim @kullanıcı (yeni_isim)');
      const newName = args.slice(1).join(' ');
      try {
        await member.setNickname(newName);
        message.channel.send(`${member.user} ismi **${newName}** olarak değiştirildi.`);
      } catch { message.reply('İsim değiştirilemedi.'); }
    }
  },
  sürelirolver: {
    async execute(message, args) {
      if (!message.member.permissions.has('ManageRoles')) return message.reply('Yetkiniz yok!');
      const member = message.mentions.members.first();
      const role = message.mentions.roles.first();
      if (!member || !role || !args[2]) return message.reply('Kullanım: `.sürelirolver @kullanıcı @rol (süre_dakika)`');
      const sure = parseInt(args[2]);
      if (isNaN(sure) || sure <= 0) return message.reply('Geçerli süre girin (dakika).');
      try {
        await member.roles.add(role);
        const bitis = Date.now() + sure * 60000;
        const kayit = { userId: member.id, roleId: role.id, bitis, guildId: message.guild.id };
        db.push(`sureliRoller.${message.guild.id}`, kayit);
        setTimeout(async () => {
          try {
            const m = await message.guild.members.fetch(member.id);
            if (m) await m.roles.remove(role);
          } catch {}
          let list = db.get(`sureliRoller.${message.guild.id}`, []);
          list = list.filter(r => !(r.userId === member.id && r.roleId === role.id));
          db.set(`sureliRoller.${message.guild.id}`, list);
        }, sure * 60000);
        message.channel.send(`${member} → **${role.name}** | **${sure}** dakika süreli rol verildi.`);
      } catch { message.reply('Rol verilemedi.'); }
    }
  },
  sürelirolliste: {
    execute(message) {
      const list = db.get(`sureliRoller.${message.guild.id}`, []);
      if (list.length === 0) return message.channel.send('Aktif süreli rol bulunmuyor.');
      const desc = list.map((r, i) => `**${i + 1}.** <@${r.userId}> → <@&${r.roleId}> | Bitiş: <t:${Math.floor(r.bitis / 1000)}:R>`).join('\n');
      message.channel.send({ components: [Container([T(`**⏰ Süreli Roller**\n\n${desc}\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  sürelirolkaldır: {
    async execute(message, args) {
      if (!message.member.permissions.has('ManageRoles')) return message.reply('Yetkiniz yok!');
      const member = message.mentions.members.first();
      const role = message.mentions.roles.first();
      if (!member || !role) return message.reply('Kullanım: `.sürelirolkaldır @kullanıcı @rol`');
      let list = db.get(`sureliRoller.${message.guild.id}`, []);
      list = list.filter(r => !(r.userId === member.id && r.roleId === role.id));
      db.set(`sureliRoller.${message.guild.id}`, list);
      try { await member.roles.remove(role); } catch {}
      message.channel.send(`${member} → **${role.name}** süreli rol kaydı kaldırıldı.`);
    }
  },
  emrolata: {
    execute(message, args) {
      module.exports.lmrolata.execute(message, args);
    }
  },
  emrolsil: {
    execute(message, args) {
      module.exports.lmrolsil.execute(message, args);
    }
  },
  lmrolata: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const role = message.mentions.roles.first();
      if (!role) return message.reply('Kullanım: .emrolata @rol');
      let roller = db.get(`ekonomiRoller.${message.guild.id}`, []);
      if (roller.includes(role.id)) return message.reply('Bu rol zaten ekonomik yetkili rolü.');
      roller.push(role.id);
      db.set(`ekonomiRoller.${message.guild.id}`, roller);
      message.channel.send(`**${role.name}** ekonomik yetkili rolü olarak eklendi.`);
    }
  },
  lmrolsil: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const role = message.mentions.roles.first();
      if (!role) return message.reply('Kullanım: .emrolsil @rol');
      let roller = db.get(`ekonomiRoller.${message.guild.id}`, []);
      if (!roller.includes(role.id)) return message.reply('Bu rol ekonomik yetkili rolü değil.');
      roller = roller.filter(id => id !== role.id);
      db.set(`ekonomiRoller.${message.guild.id}`, roller);
      message.channel.send(`**${role.name}** ekonomik yetkili rolü olarak silindi.`);
    }
  },
  avukatlist: {
    execute(message) {
      const avukatlar = db.get(`avukatlar.${message.guild.id}`, []);
      if (avukatlar.length === 0) return message.channel.send('Kayıtlı avukat bulunmuyor.');
      const desc = avukatlar.map((id, i) => `**${i + 1}.** <@${id}>`).join('\n');
      message.channel.send({ components: [Container([T(`**👨‍⚖️ Avukat Listesi**\n\n${desc}\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  avukattext: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const user = message.mentions.users.first();
      if (!user) return message.reply('Kullanım: .avukattext @kullanıcı (opsiyonel:sil)');
      if (args.includes('sil')) {
        let avukatlar = db.get(`avukatlar.${message.guild.id}`, []);
        avukatlar = avukatlar.filter(id => id !== user.id);
        db.set(`avukatlar.${message.guild.id}`, avukatlar);
        return message.channel.send(`${user} avukat listesinden çıkarıldı.`);
      }
      let avukatlar = db.get(`avukatlar.${message.guild.id}`, []);
      if (!avukatlar.includes(user.id)) {
        avukatlar.push(user.id);
        db.set(`avukatlar.${message.guild.id}`, avukatlar);
      }
      message.channel.send({ components: [Container([T(`**👨‍⚖️ Avukat Başvuru Paneli**\n\n${user} artık avukat olarak kaydedildi.\n\nAvukat listesi: \`.avukatlist\`\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  takmaadsıfırla: {
    async execute(message) {
      if (!message.member.permissions.has('Administrator') && !message.member.permissions.has('ManageNicknames')) {
        return message.reply('Bu komut için **İsimleri Yönet** yetkisine sahip olmalısın!');
      }
      const msg = await message.channel.send('⏳ İsimler sıfırlanıyor...');
      try {
        await message.guild.members.fetch();
        const members = [...message.guild.members.cache.values()];
        let updated = 0;
        let failed = 0;
        const results = await Promise.allSettled(members.map(m =>
          m.setNickname(null).catch(() => {})
        ));
        updated = results.filter(r => r.status === 'fulfilled').length;
        failed = results.filter(r => r.status === 'rejected').length;
        await msg.edit(`✅ **${updated}** kullanıcının ismi sıfırlandı, **${failed}** basarisiz.`);
      } catch (e) {
        msg.edit(`❌ Hata: ${e.message}`);
      }
    }
  }
};
