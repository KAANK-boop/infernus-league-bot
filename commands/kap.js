const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

module.exports = {
  kap: {
    async execute(message) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('kap_transfer').setLabel('Transfer').setStyle(ButtonStyle.Primary).setEmoji(E.CL_transfer),
        new ButtonBuilder().setCustomId('kap_kiralik').setLabel('Kiralık').setStyle(ButtonStyle.Success).setEmoji(E.CL_hediye),
        new ButtonBuilder().setCustomId('kap_fesih').setLabel('Fesih').setStyle(ButtonStyle.Danger).setEmoji(E.sozlesme),
      );

      const text = [
        `${E.CL_yonetim} **Infermus League Kap Yönetim Merkezi**`,
        `${E.CL_kraltac} Profesyonel **Transfer**, **Kiralık**, **Fesih** işlemlerini`,
        `buradan yönetebilirsiniz.`,
        '',
        `━━━━━━━━━━━━━━━━━━━━━━`,
        '',
        `**İşlem Menüsü :**`,
        `${E.CL_transfer} **Transfer** — Bonservis ve detay bildirimi.`,
        `${E.CL_hediye} **Kiralık** — Kiralık oyuncu işlemleri.`,
        `${E.sozlesme} **Fesih** — Sözleşme fesih süreçleri.`,
        '',
        `━━━━━━━━━━━━━━━━━━━━━━`,
        '',
        `Bir butona bastığınızda **işlem formu** açılacaktır.`,
        '',
        `━━━━━━━━━━━━━━━━━━━━━━`,
        '',
        `${E.CL_uyari} **Not :**`,
        `Formda bir alanı boş geçeceksen \`X\` yaz.`,
        `Oyuncu Alanına **ID / Nick** girebilirsin.`,
        '',
        '-# Infermus League',
      ].join('\n');

      await message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(text)]), row.toJSON()] });
    }
  }
};
