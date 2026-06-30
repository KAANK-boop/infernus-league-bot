const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../database/db');
const config = require('../config.json');
const fs = require('fs');
const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

function e(message, desc, renk = 0x2B2D31) {
  return { flags: MessageFlags.IsComponentsV2, components: [Container([T(desc)])] };
}

module.exports = {
  prefix: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      if (!args[0]) return message.reply(e(message, `${E.CL_carpi} Kullanım: .prefix (yeni_prefix)`));
      config.prefix = args[0];
      fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
      message.channel.send(e(message, `${E.CL_yesiltik} Prefix **${args[0]}** olarak değiştirildi.`));
    }
  },
  sunucular: {
    execute(message) {
      if (message.author.id !== message.client.user.id) return message.reply(e(message, `${E.CL_carpi} Bu komut sadece bot sahibi tarafından kullanılabilir.`));
      const guilds = message.client.guilds.cache;
      const desc = guilds.map(g => `**${g.name}** - ${g.memberCount} üye (${g.id})`).join('\n');
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`**${E.CL_kupa} Bot ${guilds.size} Sunucuda**\n\n${E.CL_sag_ok} **Sunucu Listesi**\n\n${desc || 'Sunucu bulunmuyor.'}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_sag_ok} Toplam **${guilds.size}** sunucu`)])] });
    }
  },
  çıkışyap: {
    async execute(message, args) {
      if (message.author.id !== message.client.user.id) return message.reply(e(message, `${E.CL_carpi} Bu komut sadece bot sahibi tarafından kullanılabilir.`));
      if (!args[0]) return message.reply(e(message, `${E.CL_carpi} Kullanım: .çıkışyap (sunucu_id)`));
      const guild = message.client.guilds.cache.get(args[0]);
      if (!guild) return message.reply(e(message, `${E.CL_carpi} Sunucu bulunamadı.`));
      await guild.leave();
      message.channel.send(e(message, `${E.CL_yesiltik} **${guild.name}** sunucusundan çıkıldı.`));
    }
  },
  karaliste: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const user = message.mentions.users.first();
      if (!user) return message.reply(e(message, `${E.CL_carpi} Kullanım: .karaliste @kullanıcı`));
      const list = db.get('blacklist', []);
      if (list.includes(user.id)) return message.reply(e(message, `${E.CL_carpi} ${user} zaten karalistede.`));
      list.push(user.id);
      db.set('blacklist', list);
      message.channel.send(e(message, `${E.CL_yesiltik} ${user} komut karalistesine eklendi.`));
    }
  },
  unkaraliste: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const user = message.mentions.users.first();
      if (!user) return message.reply(e(message, `${E.CL_carpi} Kullanım: .unkaraliste @kullanıcı`));
      let list = db.get('blacklist', []);
      if (!list.includes(user.id)) return message.reply(e(message, `${E.CL_carpi} ${user} karalistede değil.`));
      list = list.filter(id => id !== user.id);
      db.set('blacklist', list);
      message.channel.send(e(message, `${E.CL_yesiltik} ${user} komut karalistesinden çıkarıldı.`));
    }
  },
  koruma: {
    async execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_kalkan} **Koruma Paneli Taşındı**\n\n${E.CL_uyari} Koruma paneli **\`.koruma\`** komutuna taşındı.\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_sag_ok} Yeni ve gelişmiş panel için **\`.koruma\`** yazın.`)])] });
    }
  },
  botkoruma: {
    async execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_kalkan} **Bot Koruması Taşındı**\n\n${E.CL_uyari} Koruma paneli **\`.koruma\`** komutuna taşındı.\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_sag_ok} Yeni panelde tüm özellikler tek yerden yönetilir.`)])] });
    }
  },
  logkur: {
    async execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const filter = m => m.author.id === message.author.id;
      await message.channel.send(e(message, 'Log kanalını etiketleyin (örn: `#log-kanalı`).\n*(İptal: `iptal`)*'));
      try {
        const collected = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
        const content = collected.first().content.trim();
        if (content.toLowerCase() === 'iptal') return message.channel.send(e(message, 'İptal edildi.'));
        const channel = collected.first().mentions.channels.first() || message.guild.channels.cache.find(c => c.name === content.replace('#', ''));
        if (!channel) return message.channel.send(e(message, 'Geçersiz kanal.'));
        db.set(`log.${message.guild.id}`, { channelId: channel.id });
        message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_yesiltik} **Log Sistemi Kuruldu**\n\n${E.CL_sag_ok} **Log Kanalı**: ${channel}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_sag_ok} Log sistemi başarıyla kuruldu.`)])] });
      } catch { message.channel.send(e(message, '⏰ Zaman aşımı.')); }
    }
  },
  sistemiac: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const current = db.get(`istatistik.${message.guild.id}`, { active: false });
      current.active = !current.active;
      db.set(`istatistik.${message.guild.id}`, current);
      message.channel.send(e(message, `📊 İstatistik sistemi **${current.active ? 'açıldı' : 'kapatıldı'}**.`));
    }
  },
  sohbetizni: {
    async execute(message, args) {
      if (!message.member.permissions.has('ManageChannels')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      if (!args[0]) return message.reply(e(message, `${E.CL_carpi} Kullanım: .sohbetizni @rol/@üye (aç/kapat)`));
      const target = message.mentions.roles.first() || message.mentions.members.first();
      if (!target) return message.reply(e(message, `${E.CL_carpi} Rol veya üye etiketleyin.`));
      const action = args[1]?.toLowerCase();
      if (action === 'aç' || action === 'kapat') {
        const allow = action === 'aç';
        await message.channel.permissionOverwrites.edit(target.id, { SendMessages: allow });
        message.channel.send(e(message, `${target} için sohbet izni **${allow ? 'açıldı' : 'kapatıldı'}**.`));
      } else {
        const current = message.channel.permissionOverwrites.cache.get(target.id);
        const status = current ? current.deny.has('SendMessages') ? 'Kapalı' : 'Açık' : 'Açık';
        message.channel.send(e(message, `${target} için sohbet izni: **${status}**`));
      }
    }
  },
  kayıtsız: {
    async execute(message) {
      if (!message.member.permissions.has('ManageRoles')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const member = message.mentions.members.first();
      if (!member) return message.reply(e(message, `${E.CL_carpi} Kullanım: .kayıtsız @kullanıcı`));
      const config = db.get(`kayit.${message.guild.id}`);
      if (!config || !config.kayitsizRol) return message.reply(e(message, `${E.CL_carpi} Kayıtsız rolü ayarlanmamış. Önce \`.kayıt-oluştur\` yapın.`));
      const rol = message.guild.roles.cache.get(config.kayitsizRol);
      if (!rol) return message.reply(e(message, `${E.CL_carpi} Kayıtsız rolü bulunamadı.`));
      if (config.kayitliRol) {
        const kayitli = message.guild.roles.cache.get(config.kayitliRol);
        if (kayitli && member.roles.cache.has(kayitli.id)) await member.roles.remove(kayitli);
      }
      await member.roles.add(rol);
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_sag_ok} **Kayıtsız Atandı**\n\n${E.CL_uyari} ${member} kayıtsız rolüne atandı.\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_sag_ok} İşlem: **Kayıtsıza Atama**`)])] });
    }
  },
  kayıtsil: {
    execute(message) {
      if (!message.member.permissions.has('ManageRoles')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const user = message.mentions.users.first();
      if (!user) return message.reply(e(message, `${E.CL_carpi} Kullanım: .kayıtsil @kullanıcı`));
      const kayitlar = db.get(`kayitVeri.${message.guild.id}`, {});
      delete kayitlar[user.id];
      db.set(`kayitVeri.${message.guild.id}`, kayitlar);
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_carpi} **Kayıt Verisi Silindi**\n\n${E.CL_uyari} ${user} kayıt verisi silindi.\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_sag_ok} İşlem: **Veri Silme**`)])] });
    }
  },
  kayıtsayı: {
    execute(message) {
      const target = message.mentions.users.first() || message.author;
      const sayac = db.get(`kayitSayac.${message.guild.id}.${target.id}`, 0);
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_kupa} **${target.username} — Kayıt Sayısı**\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_sag_ok} Toplam: **${sayac}** kayıt`)])] });
    }
  },
  'kayıtsayı-top': {
    execute(message) {
      const guildId = message.guild.id;
      const allData = db.getAll(`kayitSayac.${guildId}`) || {};
      const sorted = Object.entries(allData).map(([id, count]) => ({ id, count })).sort((a, b) => b.count - a.count).slice(0, 10);
      if (sorted.length === 0) return message.reply(e(message, 'Henüz kayıt verisi bulunmuyor.'));
      const list = sorted.map((u, i) => { const user = message.client.users.cache.get(u.id); return `**${i + 1}.** ${user || 'Bilinmeyen#' + u.id} — 📋 **${u.count}** kayıt`; }).join('\n');
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_kupa} **En Çok Kayıt Yapanlar (Top 10)**\n\n${list}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_uyari} Sadece **.k** komutu ile yapılan kayıtlar sayılır`)])] });
    }
  },
  kayıtsayıekle: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const user = message.mentions.users.first();
      if (!user || !args[1]) return message.reply(e(message, `${E.CL_carpi} Kullanım: .kayıtsayıekle @kullanıcı (sayı)`));
      const amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) return message.reply(e(message, `${E.CL_carpi} Geçerli sayı girin!`));
      const newCount = db.add(`kayitSayac.${message.guild.id}.${user.id}`, amount);
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_yesiltik} **Kayıt Sayısı Güncellendi**\n\n${E.CL_sag_ok} Kullanıcı: ${user}\n${E.CL_sag_ok} Yeni Sayı: **${newCount}** (+${amount})\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_sag_ok} İşlem: **Sayı Ekleme**`)])] });
    }
  },
  kayıtsayısil: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const user = message.mentions.users.first();
      if (!user || !args[1]) return message.reply(e(message, `${E.CL_carpi} Kullanım: .kayıtsayısil @kullanıcı (sayı)`));
      const amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) return message.reply(e(message, `${E.CL_carpi} Geçerli sayı girin!`));
      const newCount = db.subtract(`kayitSayac.${message.guild.id}.${user.id}`, amount);
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_carpi} **Kayıt Sayısı Düşürüldü**\n\n${E.CL_sag_ok} Kullanıcı: ${user}\n${E.CL_sag_ok} Yeni Sayı: **${newCount}** (-${amount})\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_sag_ok} İşlem: **Sayı Silme**`)])] });
    }
  },
  kayıtsayısıfırla: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      db.delete(`kayitSayac.${message.guild.id}`);
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_uyari} **Kayıt Sayaçları Sıfırlandı**\n\n${E.CL_dongu} Tüm kayıt sayaçları sıfırlandı.\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_sag_ok} İşlem: **Sıfırlama**`)])] });
    }
  },
  kayıtpluskur: {
    async execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const filter = m => m.author.id === message.author.id;
      await message.channel.send(e(message, 'Kayıt Plus kurulumu: Otomatik isim formatını belirleyin (örn: `İsim | Mevki | 🇹🇷`).\n*(İptal: `iptal`)*'));
      try {
        const collected = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
        if (collected.first().content.toLowerCase() === 'iptal') return message.channel.send(e(message, 'İptal edildi.'));
        const format = collected.first().content;
        db.set(`kayitPlus.${message.guild.id}`, { active: true, format });
        message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_yesiltik} **Kayıt Plus Kuruldu**\n\n${E.CL_sag_ok} Format: **${format}**\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_sag_ok} Kayıt Plus sistemi aktif edildi.`)])] });
      } catch { message.channel.send(e(message, '⏰ Zaman aşımı.')); }
    }
  },
  kayıtpluskapat: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      db.delete(`kayitPlus.${message.guild.id}`);
      message.channel.send(e(message, `${E.CL_carpi} Kayıt Plus sistemi kapatıldı.`));
    }
  },
  adminbeklet: {
    async execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const member = message.mentions.members.first();
      if (!member) return message.reply(e(message, `${E.CL_carpi} Kullanım: .adminbeklet @kullanıcı`));
      const durum = db.get(`bekletme.${message.guild.id}.${member.id}`, false);
      db.set(`bekletme.${message.guild.id}.${member.id}`, !durum);
      message.channel.send(e(message, `${member}: Doğrulama bekletme **${!durum ? 'Aktif' : 'Devre Dışı'}**.`));
    }
  },
  wlekle: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const user = message.mentions.users.first();
      if (!user) return message.reply(e(message, `${E.CL_carpi} Kullanım: .wlekle @kullanıcı`));
      let wl = db.get(`whitelist.${message.guild.id}`, []);
      if (wl.includes(user.id)) return message.reply(e(message, `${E.CL_carpi} ${user} zaten whitelist'te.`));
      wl.push(user.id);
      db.set(`whitelist.${message.guild.id}`, wl);
      message.channel.send(e(message, `${E.CL_yesiltik} ${user} whitelist'e eklendi.`));
    }
  },
  wlsil: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const user = message.mentions.users.first();
      if (!user) return message.reply(e(message, `${E.CL_carpi} Kullanım: .wlsil @kullanıcı`));
      let wl = db.get(`whitelist.${message.guild.id}`, []);
      if (!wl.includes(user.id)) return message.reply(e(message, `${E.CL_carpi} ${user} whitelist'te değil.`));
      wl = wl.filter(id => id !== user.id);
      db.set(`whitelist.${message.guild.id}`, wl);
      message.channel.send(e(message, `${E.CL_yesiltik} ${user} whitelist'ten çıkarıldı.`));
    }
  },
  wlliste: {
    execute(message) {
      const wl = db.get(`whitelist.${message.guild.id}`, []);
      if (wl.length === 0) return message.channel.send(e(message, 'Whitelist boş.'));
      const desc = wl.map((id, i) => `**${i + 1}.** <@${id}>`).join('\n');
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_kalkan} **Whitelist Listesi**\n\n${desc}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_sag_ok} Toplam **${wl.length}** kullanıcı`)])] });
    }
  },
  adminpanel: {
    async execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T('```fix\nAdmin yetkilerini doğrulamak için butona tıkla\n```\n\n' + `${E.CL_kalkan} **Doğrulama** — admin olduğunu onayla\n${E.CL_sag_ok} Doğrulama sonrası tüm yetkiler aktif\n\n> ${E.CL_uyari} Sadece **Admin** yetkisine sahip olanlar doğrulayabilir.`), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('admin_dogrula').setLabel('Doğrula').setStyle(ButtonStyle.Danger).setEmoji('🔐')).toJSON()])] });
    }
  },
  görevli: {
    async execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T('```fix\nYetkili yönetim merkezi\n```\n\n' + `${E.CL_yonetim} **Yetkili Alım**\n┗ Yetkili alımını başlatmak için butona tıkla\n\n> ${E.CL_sag_ok} Başvurular otomatik olarak iletilir.`), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('yetkili_alim_panel').setLabel('Yetkili Alımı Başlat').setStyle(ButtonStyle.Primary).setEmoji(E.CL_duyuru)).toJSON()])] });
    }
  },
  yetkilialımbaslat: {
    async execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_kraltac} **Infermus League Yetkili Alim Merkezi**\n${E.CL_bilet} Yetkili olmak icin **basvuru** yapabilirsin.\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n**Basvuru Sartlari**\n\n${E.CL_kupa} **Genel Sartlar**\n${E.CL_yesiltik} Sunucu **etiketini** almis olmak (uye rolu)\n${E.CL_yesiltik} Gunluk en az **500 mesaj** atmis olmak\n${E.CL_yesiltik} Hakkinda bolumune sunucu **davet linkini** koymus olmak\n${E.CL_yesiltik} **Kurallara** uymak\n${E.CL_yesiltik} Topluluga **katki** saglamak\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_sag_ok} Basvurmak icin **butona tikla**, form acilacak.`), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('yetkili_basvuru').setLabel('Basvur').setStyle(ButtonStyle.Success).setEmoji(E.CL_yesiltik)).toJSON()])] });
    }
  },
  yetkiliguncelle: {
    async execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const rolConfig = db.get(`yetkiliRoller.${message.guild.id}`, {});
      if (Object.keys(rolConfig).length === 0) return message.reply(e(message, 'Yapılandırılmış yetkili rolü bulunmuyor.'));
      const members = await message.guild.members.fetch();
      let sayac = 0;
      for (const [, m] of members) {
        for (const [rolId, ozellik] of Object.entries(rolConfig)) {
          if (m.roles.cache.has(rolId) && ozellik.ekRol) {
            try { await m.roles.add(ozellik.ekRol); sayac++; } catch {}
          }
        }
      }
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_yesiltik} **Yetkili Rolleri Güncellendi**\n\n${E.CL_sag_ok} **${sayac}** işlem yapıldı.\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${E.CL_sag_ok} İşlem: **Rol Güncelleme**`)])] });
    }
  },
  yetkiliroller: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      if (!args.length) {
        const kayitli = db.get(`yetkiliRoller.${message.guild.id}`, []);
        if (!kayitli.length) return message.reply(e(message, `Henüz yetkili rolü ayarlanmamış. Kullanım: \`.yetkiliroller @rol1 @rol2 ...\``));
        const list = kayitli.map(id => { const r = message.guild.roles.cache.get(id); return r ? `${r} (${r.name})` : '❌ Silinmiş rol'; }).join('\n');
        return message.channel.send(e(message, `📋 **Ayarlı Yetkili Rolleri (${kayitli.length}):**\n${list}`));
      }
      const roller = message.mentions.roles;
      if (!roller.size) return message.reply(e(message, `Rol etiketlemelisin! Kullanım: \`.yetkiliroller @rol1 @rol2 ...\``));
      const ids = roller.map(r => r.id);
      db.set(`yetkiliRoller.${message.guild.id}`, ids);
      message.channel.send(e(message, `✅ **${roller.size}** yetkili rolü ayarlandı: ${roller.map(r => r.name).join(', ')}`));
    }
  },
  yetkilikadro: {
    async execute(message) {
      if (!message.guild) return;
      try { await message.guild.members.fetch(); } catch {}
      const configRoller = db.get(`yetkiliRoller.${message.guild.id}`, []);
      const yetkililer = message.guild.members.cache.filter(m => {
        if (m.user.bot) return false;
        if (m.permissions.has('Administrator')) return true;
        if (!configRoller.length) return m.permissions.has('ManageMessages') || m.permissions.has('ManageGuild') || m.permissions.has('ModerateMembers') || m.permissions.has('KickMembers') || m.permissions.has('BanMembers');
        return configRoller.some(rid => m.roles.cache.has(rid));
      }).sort((a, b) => b.roles.highest.position - a.roles.highest.position);
      if (!yetkililer.size) return message.reply(e(message, 'Yetkili bulunmuyor.'));
      const gruplar = {};
      yetkililer.forEach(m => {
        const rol = m.roles.highest.name;
        if (!gruplar[rol]) gruplar[rol] = [];
        gruplar[rol].push(m);
      });
      const lines = [];
      for (const [rol, uyeler] of Object.entries(gruplar)) {
        lines.push(`**${E.CL_yonetim} ${rol} (${uyeler.length})**`);
        uyeler.forEach(m => {
          const ekRoller = m.roles.cache.filter(r => r.name !== '@everyone' && r.name !== rol).sort((a, b) => b.position - a.position).first(3).map(r => r.name).join(', ');
          const katilma = m.joinedAt ? `<t:${Math.floor(m.joinedAt.getTime() / 1000)}:R>` : '?';
          lines.push(`${E.CL_sag_ok} **${m.user.username}** — ${katilma}${ekRoller ? ` | ${ekRoller}` : ''}`);
        });
        lines.push('');
      }
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`**${E.CL_yonetim} Yetkili Kadrosu — ${yetkililer.size} Kişi**\n\n${lines.join('\n')}`)])] });
    }
  },
  kalanlarıetiketle: {
    execute(message) {
      if (!message.member.permissions.has('MentionEveryone')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      try {
        const members = message.guild?.members.cache.filter(m => !m.user.bot && !m.permissions.has('Administrator'));
        if (!members || members.size === 0) return message.reply(e(message, 'Etiketlenecek üye bulunmuyor.'));
        const tags = members.map(m => m.toString()).slice(0, 30).join(' ');
        message.channel.send(e(message, tags || 'Çok fazla üye var, hepsi etiketlenemedi.'));
      } catch { message.reply(e(message, 'Etiketleme yapılamadı.')); }
    }
  },
  hoşgeldinayarla: {
    async execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      const channel = message.mentions.channels.first() || message.guild?.channels.cache.get(args[0]);
      if (!channel) return message.reply(e(message, `${E.CL_carpi} Kullanım: .hoşgeldinayarla #kanal`));
      db.set(`hosgeldin.${message.guild.id}`, { kanal: channel.id });
      message.channel.send(e(message, `✅ Hoşgeldin mesajı ${channel} kanalına ayarlandı.`));
    }
  },
  hoşgeldinsıfırla: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply(e(message, `${E.CL_carpi} Yetkiniz yok!`));
      db.delete(`hosgeldin.${message.guild.id}`);
      message.channel.send(e(message, `✅ Hoşgeldin mesajı kaldırıldı.`));
    }
  }
};
