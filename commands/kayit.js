const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageFlags } = require('discord.js');
const db = require('../database/db');
const E = require('../config/emojis');
const { T, Sep, Container, Thumb, Section } = require('../utils/componentsv2');
const kayitMesajCache = require('../utils/kayitCache');

module.exports = {
  'kayıt-oluştur': {
    async execute(message, args, client) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const guildId = message.guild.id;
      const filter = m => m.author.id === message.author.id;
      let config = {};

      const steps = [
        { ques: `${E.CL_pano} **Kurulum** — Adim **1/5**\n**Kayitli rol** ne olacak? Rolü etiketle (\`@Kayitli\`).\n*(Iptal: \`iptal\` yaz)*`, key: 'kayitliRol', type: 'role' },
        { ques: `${E.CL_pano} **Kurulum** — Adim **2/5**\n**Kayitsiz uye rolü** ne olacak? Rolü etiketle (\`@Kayitsiz\`).\n*(Iptal: \`iptal\` yaz)*`, key: 'kayitsizRol', type: 'role' },
        { ques: `${E.CL_pano} **Kurulum** — Adim **3/5**\n**Kayit yetkilisi** rolü ne olacak? Rolü etiketle (\`@Kayit Yetkilisi\`).\n*(Iptal: \`iptal\` yaz)*`, key: 'kayitYetkilisi', type: 'role' },
        { ques: `${E.CL_pano} **Kurulum** — Adim **4/5**\nÜyelerin kayit edilecegi bildirim kanali hangisi? **#kayit-kanali** etiketle.\n*(Iptal: \`iptal\` yaz)*`, key: 'kayitKanal', type: 'channel' },
        { ques: `${E.CL_pano} **Kurulum** — Adim **5/5**\nKayit olan kisiye **hos geldin** mesaji nereye atilsin? Kanali etiketle.\n*(Iptal: \`iptal\` yaz)*`, key: 'hosgeldinKanal', type: 'channel' },
      ];

      for (const step of steps) {
        await message.channel.send(step.ques);
        try {
          const collected = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
          const content = collected.first().content.trim();
          if (content.toLowerCase() === 'iptal') return message.channel.send(`${E.CL_carpi} Kurulum iptal edildi.`);

          if (step.type === 'role') {
            const role = collected.first().mentions.roles.first();
            if (!role) { await message.channel.send('Gecersiz rol, tekrar dene.'); return; }
            config[step.key] = role.id;
          } else if (step.type === 'channel') {
            const channel = collected.first().mentions.channels.first();
            if (!channel) { await message.channel.send('Gecersiz kanal, tekrar dene.'); return; }
            config[step.key] = channel.id;
          }
        } catch {
          return message.channel.send(`${E.CL_uyari} Zaman asimi. Kurulum iptal edildi.`);
        }
      }

      config.guildName = message.guild.name;
      db.set(`kayit.${guildId}`, config);

      const lines = [
        `${E.CL_sag_ok} Kayitli: <@&${config.kayitliRol}>`,
        `${E.CL_sag_ok} Kayitsiz: <@&${config.kayitsizRol}> *(oto verilir)*`,
        `${E.CL_sag_ok} Yetkili: <@&${config.kayitYetkilisi}>`,
        `${E.CL_sag_ok} Kayit kanali: <#${config.kayitKanal}>`,
        `${E.CL_sag_ok} Hos geldin kanali: <#${config.hosgeldinKanal}>`,
        '',
        `Komutlar: \`.yardim\` | Kayit: \`.k @uye Isim\``
      ].join('\n');
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_yesiltik} **Kayit sistemi kuruldu!**\n\n${lines}`)])] });
    }
  },

  k: {
    async execute(message, args, client) {
      if (!message.member.permissions.has('ManageRoles')) return message.reply('Yetkiniz yok!');
      const guildId = message.guild.id;
      const config = db.get(`kayit.${guildId}`);
      if (!config) return message.reply('Kayit sistemi kurulmamis. Once `.kayit-olustur` ile kurulum yapin.');

      const member = message.mentions.members.first();
      if (!member) return message.reply('Kullanim: `.k @uye Isim`');

      const kayitliRol = message.guild.roles.cache.get(config.kayitliRol);
      if (!kayitliRol) return message.reply('Kayitli rolü bulunamadi.');

      const name = args.slice(1).join(' ');

      const select = new StringSelectMenuBuilder()
        .setCustomId(`k_kategori_${member.id}`)
        .setPlaceholder('Kategori sec...')
        .addOptions(
          new StringSelectMenuOptionBuilder().setLabel('Uye').setValue('uye').setEmoji(E.CL_hedef).setDescription('Sadece kayitli uye'),
          new StringSelectMenuOptionBuilder().setLabel('Futbolcu').setValue('futbolcu').setEmoji(E.CL_futbolbotu).setDescription('Futbolcu rolu verilir'),
          new StringSelectMenuOptionBuilder().setLabel('Teknik Direktor').setValue('teknik').setEmoji(E.CL_pano).setDescription('Teknik direktor rolu verilir'),
          new StringSelectMenuOptionBuilder().setLabel('Baskan').setValue('baskan').setEmoji(E.CL_kraltac).setDescription('Baskan rolu verilir'),
        );

      const kategoriMsg = await message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`${E.CL_pano} **${member}** hangi kategoride kaydedilsin?`)]), new ActionRowBuilder().addComponents(select).toJSON()],
      });

      let selectedKategori;
      try {
        const interaction = await kategoriMsg.awaitMessageComponent({ filter: i => i.customId === `k_kategori_${member.id}`, time: 30000 });
        selectedKategori = interaction.values[0];
        await interaction.deferUpdate();
        await kategoriMsg.edit({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_dongu} Kayit yapiliyor...`)])] });
      } catch {
        await kategoriMsg.edit({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_uyari} Zaman asimi.`)])] });
        return;
      }

      try {
        const kayitsizRol = message.guild.roles.cache.get(config.kayitsizRol);
        if (kayitsizRol && member.roles.cache.has(kayitsizRol.id)) await member.roles.remove(kayitsizRol);
        await member.roles.add(kayitliRol);

        if (selectedKategori !== 'uye') {
          const roller = db.get(`roller.${guildId}`, {});
          const rolMap = { futbolcu: roller.futbolcu, teknik: roller.teknik, baskan: roller.baskan };
          const rolId = rolMap[selectedKategori];
          if (rolId) {
            const ekRol = message.guild.roles.cache.get(rolId);
            if (ekRol) await member.roles.add(ekRol);
          }
        }

        if (name) {
          await member.setNickname(name).catch(() => {});
          db.set(`users.${member.id}.name`, name);
        }
      } catch (e) {
        return message.reply('Rol/nick islemi basarisiz: ' + e.message);
      }

      db.add(`kayitSayac.${guildId}.${message.author.id}`, 1);

      const kategoriAdi = ({ uye: 'Uye', futbolcu: 'Futbolcu', teknik: 'Teknik Direktor', baskan: 'Baskan' })[selectedKategori] || selectedKategori;
      db.set(`kayitGecmisi.${guildId}.${member.id}`, {
        name: name || 'Isimsiz',
        role: kategoriAdi,
        kayitEden: message.author.id,
        timestamp: new Date().toISOString(),
      });

      await kategoriMsg.edit({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_yesiltik} **Kayit Basarili**\n${member} **${kategoriAdi}** olarak kaydedildi.`)])] });

      const hosAyar = db.get(`hosgeldin.${message.guild.id}`);
      let hgKanalId = hosAyar?.kanal;
      if (!hgKanalId) hgKanalId = config.hosgeldinKanal;
      if (hgKanalId) {
        const hgKanal = message.guild.channels.cache.get(hgKanalId);
        if (hgKanal) {
          const hgContent = [
            `${E.CL_hedef} Kullanici: ${member.user.username} (\`${member.user.tag}\`)`,
            `${E.CL_sag_ok} Rol: ${kategoriAdi}`,
            `${E.CL_pano} Kayit: ${name || 'Isim belirtilmemis'}`,
            `${E.CL_kupa} Kaydeden: ${message.author.username}`,
            `${E.CL_yildiz} Sunucu Uye: ${message.guild.memberCount}`,
          ].join('\n');
          hgKanal.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
            Section([T(`${E.CL_hediye} **Hos Geldin!**\n\n${hgContent}\n\nInfermus League`)], Thumb(member.user.displayAvatarURL({ size: 256 }))),
          ])] });
        }
      }

      const kayitConfig2 = db.get(`kayit.${message.guild.id}`);
      if (kayitConfig2 && kayitConfig2.kayitKanal) {
        const kayitKanal = message.guild.channels.cache.get(kayitConfig2.kayitKanal);
        if (kayitKanal) {
          const msgId = kayitMesajCache.get(member.id);
          if (msgId) {
            const joinMsg = await kayitKanal.messages.fetch(msgId).catch(() => null);
            if (joinMsg) {
              await joinMsg.edit({ flags: MessageFlags.IsComponentsV2, components: [Container([Section([T(`${E.CL_yesiltik} **Kayit Tamamlandi**\n\n${E.CL_insan} ${member.user.tag} — <@${member.user.id}>\n${E.CL_rol} **Rol:** ${kategoriAdi}\n${E.CL_kupa} **Kaydeden:** ${message.author.username}\n\nInfermus League`)], Thumb(member.user.displayAvatarURL({ size: 256 })))])] }).catch(() => {});
            }
            kayitMesajCache.delete(member.id);
          }
        }
      }
    }
  }
};
