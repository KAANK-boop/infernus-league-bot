const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../database/db');
const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

function e(message, desc, renk = 0x2B2D31) {
  return { flags: MessageFlags.IsComponentsV2, components: [Container([T(desc)])] };
}

module.exports = {

  'komut-ekle': {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const name = args.shift()?.toLowerCase();
      if (!name || !args.length) return message.reply(e(message, `${E.CL_carpi} Kullanım: \`.komut-ekle <komutadı> <yanıt>\``));
      const customCmds = db.get(`ozelKomut.${message.guild.id}`, {});
      customCmds[name] = args.join(' ');
      db.set(`ozelKomut.${message.guild.id}`, customCmds);
      message.channel.send(e(message, `${E.CL_yesiltik} **+${name}** komutu eklendi.`));
    }
  },
  'komut-sil': {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const name = args[0]?.toLowerCase();
      if (!name) return message.reply(e(message, `${E.CL_carpi} Kullanım: \`.komut-sil <komutadı>\``));
      const customCmds = db.get(`ozelKomut.${message.guild.id}`, {});
      if (!customCmds[name]) return message.reply(e(message, `${E.CL_carpi} Bu komut bulunamadı.`));
      delete customCmds[name];
      db.set(`ozelKomut.${message.guild.id}`, customCmds);
      message.channel.send(e(message, `${E.CL_carpi} **-${name}** komutu silindi.`));
    }
  },
  'komut-liste': {
    execute(message) {
      const customCmds = db.get(`ozelKomut.${message.guild.id}`, {});
      const names = Object.keys(customCmds);
      if (!names.length) return message.channel.send(e(message, `${E.CL_carpi} Henüz özel komut eklenmemiş.`));
      message.channel.send(e(message, `${E.CL_pano} **Özel Komutlar (${names.length})**\n${names.map(n => `\`${n}\``).join(', ')}`));
    }
  },

  'sayaç-kur': {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0] || '');
      if (!channel || channel.type !== 2) return message.reply(e(message, `${E.CL_carpi} Geçerli bir ses kanalı etiketle!`));
      const nameTemplate = args.slice(1).join(' ') || '👥 Üye: {sayı}';
      if (!nameTemplate.includes('{sayı}')) return message.reply(e(message, `${E.CL_carpi} İsim şablonunda \`{sayı}\` kullanmalısın! Örn: \`👥 Üye: {sayı}\``));
      db.set(`sayaç.${message.guild.id}`, { kanal: channel.id, isim: nameTemplate });
      channel.setName(nameTemplate.replace('{sayı}', message.guild.memberCount)).catch(() => {});
      message.channel.send(e(message, `${E.CL_yesiltik} Sayaç kanalı ${channel} olarak ayarlandı.`));
    }
  },
  'sayaç-sıfırla': {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      db.delete(`sayaç.${message.guild.id}`);
      message.channel.send(e(message, `${E.CL_carpi} Sayaç kaldırıldı.`));
    }
  },

  'otorol': {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const role = message.mentions.roles.first();
      if (!role) return message.reply(e(message, `${E.CL_carpi} Kullanım: \`.otorol @rol\``));
      db.set(`otorol.${message.guild.id}`, role.id);
      message.channel.send(e(message, `${E.CL_yesiltik} Oto-rol ${role} olarak ayarlandı. Yeni katılanlara otomatik verilecek.`));
    }
  },
  'otorol-sıfırla': {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      db.delete(`otorol.${message.guild.id}`);
      message.channel.send(e(message, `${E.CL_carpi} Oto-rol kaldırıldı.`));
    }
  },

  yoklama: {
    execute(message) {
      const voiceChannels = message.guild.channels.cache.filter(c => c.type === 2 && c.members.size > 0);
      if (!voiceChannels.size) return message.channel.send(e(message, `${E.CL_carpi} Sesli kanallarda kimse yok.`));
      const lines = voiceChannels.map(ch => {
        const members = ch.members.map(m => `  ${E.CL_ses} ${m.displayName}`).join('\n');
        return `**${ch.name}** (${ch.members.size} kişi)\n${members}`;
      });
      message.channel.send(e(message, `🎤 **Sesli Yoklama**\n\n${lines.join('\n\n')}`));
    }
  },

  'rol-bilgi': {
    execute(message, args) {
      const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0] || '');
      if (!role) return message.reply(e(message, `${E.CL_carpi} Bir rol etiketle veya ID gir.`));
      const members = role.members.filter(m => !m.user.bot);
      const memberList = members.map(m => m.displayName).slice(0, 20).join(', ') || 'Yok';
      const hex = role.hexColor.toUpperCase();
      message.channel.send(e(message, [
        `${E.CL_pano} **${role.name}** Rol Bilgisi`,
        `🆔 ID: \`${role.id}\``,
        `🎨 Renk: ${hex === '#000000' ? 'Yok' : hex}`,
        `👥 Üye: ${role.members.size} (botlar hariç: ${members.size})`,
        `📌 Pozisyon: ${role.position}`,
        `🔒 Ayrı göster: ${role.hoist ? 'Evet' : 'Hayır'}`,
        `🤖 Bot rolü: ${role.managed ? 'Evet' : 'Hayır'}`,
        `📅 Oluşturulma: <t:${Math.floor(role.createdTimestamp / 1000)}:R>`,
        `👤 Üyeler: ${memberList}`,
      ].join('\n')));
    }
  },

  'yedek-al': {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const channels = message.guild.channels.cache.filter(c => c.type !== 4).map(c => ({
        name: c.name, type: c.type, position: c.position,
        parent: c.parent?.name || null,
        topic: c.topic || null, nsfw: c.nsfw || false, slowmode: c.rateLimitPerUser || 0,
      }));
      const roles = message.guild.roles.cache.filter(r => !r.managed && r.name !== '@everyone').map(r => ({
        name: r.name, color: r.hexColor, hoist: r.hoist,
        mentionable: r.mentionable, permissions: r.permissions.toArray(),
      }));
      const yedekId = Date.now().toString(36);
      db.set(`yedek.${message.guild.id}.${yedekId}`, { ad: message.guild.name, tarih: new Date().toISOString(), kanallar: channels, roller: roles });
      message.channel.send(e(message, `${E.CL_yesiltik} Yedek alındı! ID: \`${yedekId}\` — \`.yedek-yükle ${yedekId}\` ile geri yükleyebilirsin.`));
    }
  },
  'yedek-yükle': {
    async execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const id = args[0];
      if (!id) return message.reply(e(message, `${E.CL_carpi} Kullanım: \`.yedek-yükle <yedekID>\``));
      const yedek = db.get(`yedek.${message.guild.id}.${id}`);
      if (!yedek) return message.reply(e(message, `${E.CL_carpi} Bu ID'ye ait yedek bulunamadı.`));
      const msg = await message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_uyari} Yedek yükleniyor... Kanallar silinip yeniden oluşturulacak. Onaylıyor musun?`), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`yedek_onay_${message.author.id}`).setLabel('Evet, yükle').setStyle(ButtonStyle.Danger)).toJSON()])] });
      try {
        const i = await msg.awaitMessageComponent({ filter: j => j.customId === `yedek_onay_${message.author.id}`, time: 15000 });
        await i.deferUpdate();
        await msg.edit(e(message, `${E.CL_dongu} Yedek yükleniyor...`));
        const kanallar = message.guild.channels.cache.filter(c => c.type !== 4);
        for (const c of kanallar.values()) await c.delete().catch(() => {});
        for (const r of yedek.roller) {
          try { await message.guild.roles.create({ name: r.name, color: r.color, hoist: r.hoist, mentionable: r.mentionable, permissions: r.permissions }); } catch {}
        }
        for (const c of yedek.kanallar) {
          try {
            const parent = c.parent ? message.guild.channels.cache.find(ch => ch.type === 4 && ch.name === c.parent) : null;
            await message.guild.channels.create({ name: c.name, type: c.type, parent: parent?.id, topic: c.topic, nsfw: c.nsfw, rateLimitPerUser: c.slowmode, position: c.position });
          } catch {}
        }
        await msg.edit(e(message, `${E.CL_yesiltik} Yedek başarıyla yüklendi! (**${yedek.kanallar.length}** kanal, **${yedek.roller.length}** rol)`));
      } catch {
        await msg.edit(e(message, `❌ Zaman aşımı. İşlem iptal.`));
      }
    }
  },

  reklam: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const sub = args[0]?.toLowerCase();
      if (sub === 'kanal') {
        const ch = message.mentions.channels.first();
        if (!ch) return message.reply(e(message, `${E.CL_carpi} Kullanım: \`.reklam kanal #kanal\``));
        db.set(`reklam.${message.guild.id}.kanal`, ch.id);
        return message.channel.send(e(message, `${E.CL_yesiltik} Reklam kanalı ${ch} olarak ayarlandı.`));
      }
      if (sub === 'mesaj') {
        const mesaj = args.slice(1).join(' ');
        if (!mesaj) return message.reply(e(message, `${E.CL_carpi} Kullanım: \`.reklam mesaj <metin>\``));
        db.set(`reklam.${message.guild.id}.mesaj`, mesaj);
        return message.channel.send(e(message, `${E.CL_yesiltik} Reklam mesajı kaydedildi.`));
      }
      if (sub === 'gönder' || sub === 'gonder') {
        const kanalId = db.get(`reklam.${message.guild.id}.kanal`);
        const mesaj = db.get(`reklam.${message.guild.id}.mesaj`);
        if (!kanalId || !mesaj) return message.reply(e(message, `${E.CL_carpi} Önce \`.reklam kanal\` ve \`.reklam mesaj\` ile ayarla.`));
        const ch = message.guild.channels.cache.get(kanalId);
        if (!ch) return message.reply(e(message, `${E.CL_carpi} Reklam kanalı bulunamadı.`));
        ch.send({ content: mesaj, components: [] });
        return message.channel.send(e(message, `${E.CL_yesiltik} Reklam gönderildi!`));
      }
      const kanal = db.get(`reklam.${message.guild.id}.kanal`);
      const mesaj = db.get(`reklam.${message.guild.id}.mesaj`);
      message.channel.send(e(message, [
        `${E.CL_pano} **Reklam Ayarları**`,
        `📢 Kanal: ${kanal ? `<#${kanal}>` : 'Ayarlanmamış'} (\`.reklam kanal\`)`,
        `📝 Mesaj: ${mesaj ? 'Ayarlanmış' : 'Ayarlanmamış'} (\`.reklam mesaj\`)`,
        `🚀 Gönder: \`.reklam gönder\``,
      ].join('\n')));
    }
  },
};
