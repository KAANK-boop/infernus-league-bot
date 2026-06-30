const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { T, Container } = require('../utils/componentsv2');
const E = require('../config/emojis');

module.exports = {
  spikeralimbaslat: {
    async execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');

      const container = Container([T([
        `🎙️ **Infermus League — Spiker Alım Merkezi**`,
        `${E.CL_bilet} Spiker olmak için **başvuru** yapabilirsin.`,
        '',
        `━━━━━━━━━━━━━━━━━━━━━━`,
        '',
        `**Spiker Nedir?**`,
        `${E.CL_sag_ok} Spikerler maç anlatımı ve duyurular için`,
        `sesli yayın yapan yetkili kişilerdir.`,
        '',
        `**Başvuru Şartları :**`,
        `${E.CL_yesiltik} **Aktif** sesli iletişim`,
        `${E.CL_yesiltik} **Diksiyon** ve anlatım yeteneği`,
        `${E.CL_yesiltik} **Takım çalışmasına** yatkınlık`,
        `${E.CL_yesiltik} En az **2 aylık** üye olmak`,
        '',
        `━━━━━━━━━━━━━━━━━━━━━━`,
        '',
        `${E.CL_sag_ok} Başvurmak için **butona tıkla**, form açılacak.`,
        '',
        `-# Infermus League`,
      ].join('\n'))]);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('spiker_basvuru')
          .setLabel('Başvur')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🎙️')
      );

      container.components.push(row.toJSON());
      await message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
    }
  },

  spikergir: {
    async execute(message) {
      const container = Container([T([
        `🎙️ **Spiker Başvurusu**`,
        '',
        `Spiker olmak için \`.spikeralimbaslat\` ile açılan panelden başvuru yapabilirsin.`,
        '',
        `Veya bir yetkiliye başvurunu iletebilirsin.`,
        '',
        `-# Infermus League`,
      ].join('\n'))]);
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
    }
  }
};
