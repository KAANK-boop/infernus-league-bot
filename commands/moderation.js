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
  ban: {
    async execute(message, args) {
      if (!message.member.permissions.has('BanMembers')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Bu komutu kullanma yetkiniz bulunmuyor.`);
      const user = message.mentions.users.first();
      if (!user) return sendEmbed(message, 0xED4245, null, `Kullanım: \`.ban @kullanıcı (sebep)\``);
      const member = message.guild.members.cache.get(user.id);
      if (user.id === message.client.user.id) return sendEmbed(message, 0xED4245, null, 'Botu yasaklayamazsın!');
      if (user.id === message.guild.ownerId) return sendEmbed(message, 0xED4245, null, 'Sunucu sahibini yasaklayamazsın!');
      if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0 && message.guild.ownerId !== message.author.id)
        return sendEmbed(message, 0xED4245, null, 'Kendinle aynı veya daha yüksek yetkideki birini yasaklayamazsın!');
      const reason = args.slice(1).join(' ') || 'Sebep belirtilmedi';
      try {
        await message.guild.members.ban(user, { reason });
        sendEmbed(message, 0xED4245, `${E.CL_carpi} Banlandı`, `${user} **${reason}** sebebiyle yasaklandı.`);
      } catch { sendEmbed(message, 0xED4245, null, 'Kullanıcı yasaklanamadı.'); }
    }
  },
  banbilgi: {
    async execute(message) {
      if (!message.member.permissions.has('BanMembers')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const bans = await message.guild.bans.fetch();
      if (!bans.size) return sendEmbed(message, 0x2B2D31, `${E.CL_pano} Ban Listesi`, 'Banlanan kullanıcı yok.');
      const list = bans.map(b => `**${b.user.tag}** — ${b.reason || 'Sebep yok'}`).join('\n');
      message.channel.send({ components: [Container([T(`**${E.CL_pano} Ban Listesi (${bans.size})**\n\n${list}\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  unban: {
    async execute(message, args) {
      if (!message.member.permissions.has('BanMembers')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      if (!args[0]) return sendEmbed(message, 0xED4245, null, 'Kullanım: `.unban <kullanıcı_id>`');
      try {
        await message.guild.members.unban(args[0]);
        sendEmbed(message, 0x57F287, `${E.CL_yesiltik} Ban Kaldırıldı`, `${args[0]} ID'li kullanıcının banı kaldırıldı.`);
      } catch { sendEmbed(message, 0xED4245, null, 'Ban kaldırılamadı. ID kontrol edin.'); }
    }
  },
  kick: {
    async execute(message, args) {
      if (!message.member.permissions.has('KickMembers')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const member = message.mentions.members.first();
      if (!member) return sendEmbed(message, 0xED4245, null, 'Kullanım: `.kick @kullanıcı (sebep)`');
      if (member.id === message.client.user.id) return sendEmbed(message, 0xED4245, null, 'Botu atamazsın!');
      if (member.id === message.guild.ownerId) return sendEmbed(message, 0xED4245, null, 'Sunucu sahibini atamazsın!');
      if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0 && message.guild.ownerId !== message.author.id)
        return sendEmbed(message, 0xED4245, null, 'Kendinle aynı veya daha yüksek yetkideki birini atamazsın!');
      const reason = args.slice(1).join(' ') || 'Sebep belirtilmedi';
      try {
        await member.kick(reason);
        sendEmbed(message, 0xED4245, `${E.CL_carpi} Atıldı`, `${member.user} **${reason}** sebebiyle atıldı.`);
      } catch { sendEmbed(message, 0xED4245, null, 'Kullanıcı atılamadı.'); }
    }
  },
  mute: {
    async execute(message, args) {
      if (!message.member.permissions.has('ModerateMembers')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const member = message.mentions.members.first();
      if (!member) return sendEmbed(message, 0xED4245, null, 'Kullanım: `.mute @kullanıcı (süre_dk) (sebep)`');
      const time = parseInt(args[1]) || 10;
      const reason = args.slice(2).join(' ') || 'Sebep belirtilmedi';
      try {
        await member.timeout(time * 60 * 1000, reason);
        sendEmbed(message, 0xFEE75C, `${E.CL_ses} Susturuldu`, `${member.user} **${time}** dakika susturuldu.\n**Sebep:** ${reason}`);
      } catch { sendEmbed(message, 0xED4245, null, 'Kullanıcı susturulamadı.'); }
    }
  },
  unmute: {
    async execute(message) {
      if (!message.member.permissions.has('ModerateMembers')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const member = message.mentions.members.first();
      if (!member) return sendEmbed(message, 0xED4245, null, 'Kullanım: `.unmute @kullanıcı`');
      try {
        await member.timeout(null);
        sendEmbed(message, 0x57F287, `${E.CL_yesiltik} Susturma Kaldırıldı`, `${member.user} susturması kaldırıldı.`);
      } catch { sendEmbed(message, 0xED4245, null, 'Susturma kaldırılamadı.'); }
    }
  },
  mutebilgi: {
    async execute(message) {
      const member = message.mentions.members.first();
      if (!member) return sendEmbed(message, 0x2B2D31, null, 'Kullanım: `.mutebilgi @kullanıcı`');
      if (!member.isCommunicationDisabled()) return sendEmbed(message, 0x2B2D31, null, `${member.user} susturulmuş değil.`);
      const time = member.communicationDisabledUntil;
      sendEmbed(message, 0x2B2D31, `${E.CL_ses} Mute Bilgisi`, `${member.user} susturması <t:${Math.floor(time.getTime() / 1000)}:R> bitiyor.`);
    }
  },
  muteaffi: {
    async execute(message) {
      if (!message.member.permissions.has('ModerateMembers')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const members = await message.guild.members.fetch();
      let count = 0;
      for (const [, m] of members) {
        if (m.isCommunicationDisabled()) { await m.timeout(null); count++; }
      }
      sendEmbed(message, 0x57F287, `${E.CL_yesiltik} Mute Affı`, `Toplu mute affı uygulandı. **${count}** kullanıcının susturması kaldırıldı.`);
    }
  },
  jail: {
    async execute(message, args) {
      if (!message.member.permissions.has('ModerateMembers')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const member = message.mentions.members.first();
      if (!member) return sendEmbed(message, 0xED4245, null, 'Kullanım: `.jail @kullanıcı (sebep)`');
      let jailRolId = db.get(`jailRol.${message.guild.id}`);
      if (!jailRolId) {
        const jailRol = message.guild.roles.cache.find(r => r.name.toLowerCase().includes('jail') || r.name.toLowerCase().includes('cezalı'));
        if (!jailRol) return sendEmbed(message, 0xED4245, null, 'Jail/Ceza rolü bulunamadı. Önce bir rol oluşturun.');
        jailRolId = jailRol.id;
        db.set(`jailRol.${message.guild.id}`, jailRolId);
      }
      const jailRol = message.guild.roles.cache.get(jailRolId);
      if (!jailRol) return sendEmbed(message, 0xED4245, null, 'Jail rolü sunucuda bulunamadı.');
      const reason = args.slice(1).join(' ') || 'Sebep belirtilmedi';
      const savedRoles = member.roles.cache.filter(r => r.id !== message.guild.id).map(r => r.id);
      db.set(`jailData.${message.guild.id}.${member.id}`, { roles: savedRoles, reason, date: new Date().toISOString() });
      try {
        await member.roles.set([jailRol]);
        sendEmbed(message, 0xED4245, `${E.CL_kilit} Jail`, `${member.user} jail'e atıldı.\n**Sebep:** ${reason}`);
      } catch { sendEmbed(message, 0xED4245, null, 'Jail işlemi başarısız.'); }
    }
  },
  unjail: {
    async execute(message) {
      if (!message.member.permissions.has('ModerateMembers')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const member = message.mentions.members.first();
      if (!member) return sendEmbed(message, 0xED4245, null, 'Kullanım: `.unjail @kullanıcı`');
      const jailData = db.get(`jailData.${message.guild.id}.${member.id}`);
      if (!jailData) return sendEmbed(message, 0x2B2D31, null, `${member.user} jail'de değil.`);
      try {
        if (jailData.roles && jailData.roles.length > 0) await member.roles.set(jailData.roles);
        else { const jr = db.get(`jailRol.${message.guild.id}`); if (jr) await member.roles.remove(jr); }
        db.delete(`jailData.${message.guild.id}.${member.id}`);
        sendEmbed(message, 0x57F287, `${E.CL_yesiltik} Jail Kaldırıldı`, `${member.user} jail'den çıkarıldı.`);
      } catch { sendEmbed(message, 0xED4245, null, 'Jail kaldırılamadı.'); }
    }
  },
  lock: {
    async execute(message) {
      if (!message.member.permissions.has('ManageChannels')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
      sendEmbed(message, 0xED4245, `${E.CL_kilit} Kanal Kilitlendi`, 'Bu kanal kilitlendi.');
    }
  },
  unlock: {
    async execute(message) {
      if (!message.member.permissions.has('ManageChannels')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: null });
      sendEmbed(message, 0x57F287, `${E.CL_yesiltik} Kanal Açıldı`, 'Bu kanalın kilidi kaldırıldı.');
    }
  },
  slowmode: {
    async execute(message, args) {
      if (!message.member.permissions.has('ManageChannels')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const time = parseInt(args[0]);
      if (isNaN(time) || time < 0 || time > 21600) return sendEmbed(message, 0xED4245, null, 'Geçerli süre girin (0-21600 saniye)');
      await message.channel.setRateLimitPerUser(time);
      sendEmbed(message, 0x2B2D31, `${E.CL_dongu} Yavaş Mod`, `Yavaş mod **${time}** saniye olarak ayarlandı.`);
    }
  },
  nuke: {
    async execute(message) {
      if (!message.member.permissions.has('ManageChannels')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const channel = message.channel;
      const newChannel = await channel.clone();
      await channel.delete();
      newChannel.send({ components: [Container([T(`${E.CL_yesiltik} Kanal yenilendi.\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  'kanal-sil': {
    async execute(message) {
      if (!message.member.permissions.has('ManageChannels')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      await message.channel.send({ components: [Container([T('Kanal siliniyor...\n\n-# Infermus League')])], flags: MessageFlags.IsComponentsV2 });
      await message.channel.delete();
    }
  },
  sil: {
    async execute(message, args) {
      if (!message.member.permissions.has('ManageMessages')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const amount = parseInt(args[0]);
      if (isNaN(amount) || amount < 1 || amount > 100) return sendEmbed(message, 0xED4245, null, 'Kullanım: `.sil 1-100`');
      const msgs = await message.channel.messages.fetch({ limit: Math.min(amount + 1, 100) });
      await message.channel.bulkDelete(msgs, true);
      const r = await message.channel.send({ components: [Container([T(`${E.CL_carpi} ${msgs.size - 1} mesaj silindi.\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
      setTimeout(() => r.delete().catch(() => {}), 3000);
    }
  },
  uyarı: {
    async execute(message, args) {
      if (!message.member.permissions.has('ModerateMembers')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const user = message.mentions.users.first();
      if (!user) return sendEmbed(message, 0xED4245, null, 'Kullanım: `.uyarı @kullanıcı (sebep)`');
      const reason = args.slice(1).join(' ') || 'Sebep belirtilmedi';
      db.push(`uyarilar.${message.guild.id}.${user.id}`, { id: Date.now().toString(), yetkili: message.author.id, sebep: reason, tarih: new Date().toISOString() });
      const count = db.get(`uyarilar.${message.guild.id}.${user.id}`, []).length;
      message.channel.send({ components: [Container([T(`**${E.CL_uyari} Uyarı**\n\n${user} uyarıldı.\n**Sebep:** ${reason}\n**Toplam Uyarı:** ${count}\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  uyarılar: {
    execute(message) {
      const user = message.mentions.users.first() || message.author;
      const uyarilar = db.get(`uyarilar.${message.guild.id}.${user.id}`, []);
      if (!uyarilar.length) return sendEmbed(message, 0x2B2D31, null, `${user} kullanıcısının uyarısı bulunmuyor.`);
      const desc = uyarilar.map((w, i) => `**#${i + 1}** | ${w.sebep} | <@${w.yetkili}> | <t:${Math.floor(new Date(w.tarih).getTime() / 1000)}:R>`).join('\n');
      message.channel.send({ components: [Container([T(`**${E.CL_pano} ${user.username} - Uyarılar (${uyarilar.length})**\n\n${desc}\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  uyarıgerial: {
    execute(message, args) {
      if (!message.member.permissions.has('ModerateMembers')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const user = message.mentions.users.first();
      if (!user) return sendEmbed(message, 0xED4245, null, 'Kullanım: `.uyarıgerial @kullanıcı (opsiyonel: uyarı_no)`');
      let uyarilar = db.get(`uyarilar.${message.guild.id}.${user.id}`, []);
      if (!uyarilar.length) return sendEmbed(message, 0x2B2D31, null, `${user} kullanıcısının uyarısı bulunmuyor.`);
      const no = args[1] ? parseInt(args[1]) - 1 : uyarilar.length - 1;
      if (isNaN(no) || no < 0 || no >= uyarilar.length) return sendEmbed(message, 0xED4245, null, `Geçersiz uyarı no. (1-${uyarilar.length})`);
      uyarilar.splice(no, 1);
      db.set(`uyarilar.${message.guild.id}.${user.id}`, uyarilar);
      sendEmbed(message, 0x57F287, `${E.CL_dongu} Uyarı Geri Alındı`, `${user}: **#${no + 1}** numaralı uyarı geri alındı. Kalan: **${uyarilar.length}**`);
    }
  },
  'kullanıcı-bilgi': {
    execute(message, args) {
      const user = message.mentions.users.first() || message.author;
      const member = message.guild.members.cache.get(user.id);
      const roles = member?.roles.cache.filter(r => r.name !== '@everyone').sort((a, b) => b.position - a.position).map(r => `<@&${r.id}>`).join(' ') || 'Yok';
      message.channel.send({ components: [Container([T(`**${E.CL_pano} ${user.username} — Kullanıcı Bilgisi**\n\n🆔 ID: \`${user.id}\`\n👤 Tag: ${user.tag}\n📅 Hesap: <t:${Math.floor(user.createdTimestamp / 1000)}:R>\n📥 Katılma: ${member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Bilinmiyor'}\n🤖 Bot: ${user.bot ? 'Evet' : 'Hayır'}\n🎭 Roller (${member?.roles.cache.filter(r => r.name !== '@everyone').size || 0}): ${roles}\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  'sunucu-bilgi': {
    execute(message) {
      const g = message.guild;
      const channels = g.channels.cache;
      message.channel.send({ components: [Container([T(`**${E.CL_pano} ${g.name} — Sunucu Bilgisi**\n\n🆔 ID: \`${g.id}\`\n👑 Sahip: <@${g.ownerId}>\n👥 Üye: ${g.memberCount} (üye: ${g.members.cache.filter(m => !m.user.bot).size}, bot: ${g.members.cache.filter(m => m.user.bot).size})\n📁 Kanal: ${channels.filter(c => c.type === 0).size} yazı / ${channels.filter(c => c.type === 2).size} ses\n🎭 Rol: ${g.roles.cache.filter(r => r.name !== '@everyone').size}\n📅 Oluşum: <t:${Math.floor(g.createdTimestamp / 1000)}:R>\n🚀 Seviye: ${g.premiumTier} (${g.premiumSubscriptionCount} boost)\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  'küfür-engel': {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const durum = args[0]?.toLowerCase();
      if (durum === 'aç' || durum === 'ac') { db.set(`kufurEngel.${message.guild.id}`, true); return sendEmbed(message, 0x57F287, `${E.CL_yesiltik} Küfür Engel`, 'Küfür engel **açıldı**.'); }
      if (durum === 'kapat') { db.delete(`kufurEngel.${message.guild.id}`); return sendEmbed(message, 0xED4245, `${E.CL_carpi} Küfür Engel`, 'Küfür engel **kapatıldı**.'); }
      const aktif = !!db.get(`kufurEngel.${message.guild.id}`);
      sendEmbed(message, 0x2B2D31, `${E.CL_kalkan} Küfür Engel`, `Durum: ${aktif ? `${E.CL_yesiltik} Açık` : `${E.CL_carpi} Kapalı`}\nKullanım: \`.küfür-engel aç/kapat\``);
    }
  },
  'reklam-engel': {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const durum = args[0]?.toLowerCase();
      if (durum === 'aç' || durum === 'ac') { db.set(`reklamEngel.${message.guild.id}`, true); return sendEmbed(message, 0x57F287, `${E.CL_yesiltik} Reklam Engel`, 'Reklam engel **açıldı**.'); }
      if (durum === 'kapat') { db.delete(`reklamEngel.${message.guild.id}`); return sendEmbed(message, 0xED4245, `${E.CL_carpi} Reklam Engel`, 'Reklam engel **kapatıldı**.'); }
      const aktif = !!db.get(`reklamEngel.${message.guild.id}`);
      sendEmbed(message, 0x2B2D31, `${E.CL_kalkan} Reklam Engel`, `Durum: ${aktif ? `${E.CL_yesiltik} Açık` : `${E.CL_carpi} Kapalı`}\nKullanım: \`.reklam-engel aç/kapat\``);
    }
  },
  'mod-log': {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const channel = message.mentions.channels.first();
      if (!channel) {
        const mevcut = db.get(`modLog.${message.guild.id}`);
        return sendEmbed(message, 0x2B2D31, `${E.CL_pano} Mod-Log`, `Mod-log kanalı: ${mevcut ? `<#${mevcut}>` : `${E.CL_carpi} Ayarlanmamış`}\nAyarlamak: \`.mod-log #kanal\``);
      }
      db.set(`modLog.${message.guild.id}`, channel.id);
      sendEmbed(message, 0x57F287, `${E.CL_yesiltik} Mod-Log`, `Mod-log kanalı ${channel} olarak ayarlandı.`);
    }
  },
  'rol-ver': {
    async execute(message, args) {
      if (!message.member.permissions.has('ManageRoles')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const member = message.mentions.members.first();
      const role = message.mentions.roles.first();
      if (!member || !role) return sendEmbed(message, 0xED4245, null, 'Kullanım: `.rol-ver @kullanıcı @rol`');
      try { await member.roles.add(role); sendEmbed(message, 0x57F287, `${E.CL_yesiltik} Rol Verildi`, `${member} kullanıcısına **${role.name}** rolü verildi.`); }
      catch { sendEmbed(message, 0xED4245, null, 'Rol verilemedi.'); }
    }
  },
  'rol-al': {
    async execute(message, args) {
      if (!message.member.permissions.has('ManageRoles')) return sendEmbed(message, 0xED4245, null, `${E.CL_uyari} Yetkiniz yok!`);
      const member = message.mentions.members.first();
      const role = message.mentions.roles.first();
      if (!member || !role) return sendEmbed(message, 0xED4245, null, 'Kullanım: `.rol-al @kullanıcı @rol`');
      try { await member.roles.remove(role); sendEmbed(message, 0x57F287, `${E.CL_yesiltik} Rol Alındı`, `${member} kullanıcısından **${role.name}** rolü alındı.`); }
      catch { sendEmbed(message, 0xED4245, null, 'Rol alınamadı.'); }
    }
  },
};
