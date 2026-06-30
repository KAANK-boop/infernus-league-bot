const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const E = require('../config/emojis');
const { T, Sep, Container } = require('../utils/componentsv2');

const pages = [
  {
    title: `${E.CL_electro_money} DEĞER KAZANMA SİSTEMİ`,
    header: 'Sunucumuza destek olarak değer kazanın!',
    items: [
      `${E.CL_crystal} **Hakkımda kısmına sunucu linki koymak**\n${E.CL_arrow_right} Discord profilinizin "Hakkımda" kısmına sunucu davet linkini ekleyin.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.4M€ Değer**`,
      `${E.CL_crystal} **Sunucu linkini duruma koymak**\n${E.CL_arrow_right} Discord durumunuza sunucumuzun linkini koyun.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.4M€ Değer**`,
      `${E.CL_crystal} **Guildimizi almak**\n${E.CL_arrow_right} Sunucu rozetimizi profilinizde taşıyın.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.5M€ Değer**`,
      `${E.CL_crystal} **Arkadaşınızı sunucuya davet etmek**\n${E.CL_arrow_right} Davet linkinizle gelen her arkadaşınız için.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.4M€ Değer**`,
    ]
  },
  {
    title: `${E.CL_electro_money} DEĞER KAZANMA SİSTEMİ`,
    header: 'Oyuncu & medya odaklı kazançlar!',
    items: [
      `${E.CL_crystal} **Profil fotoğrafına oyuncu koymak**\n${E.CL_arrow_right} Sahip olduğunuz oyuncunun fotoğrafını Discord profilinize koyun.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.4M€ Değer**`,
      `${E.CL_crystal} **Afişe (banner) oyuncu koymak**\n${E.CL_arrow_right} Discord bannerınıza sahip olduğunuz oyuncuyu koyun.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.3M€ Değer**`,
      `${E.CL_crystal} **Maçın adamı olmak (MOTM)**\n${E.CL_arrow_right} Maç sonunda en iyi oyuncu seçilerek maçın adamı olun.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.2M€ Değer**`,
      `${E.CL_crystal} **Antrenman tamamlamak**\n${E.CL_arrow_right} \`.antrenman\` komutu ile 10/10 antrenmanı tamamlayın.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.2M€ Değer**`,
    ]
  },
  {
    title: `${E.CL_electro_money} DEĞER KAZANMA SİSTEMİ`,
    header: 'Aktiflik & oyun odaklı kazançlar!',
    items: [
      `${E.CL_crystal} **Roll ant gol atmak**\n${E.CL_arrow_right} \`.roll\` komutu ile gol atma şansı yakalayın.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.2M€ Değer**`,
      `${E.CL_crystal} **Günlük 500 mesaj göndermek**\n${E.CL_arrow_right} Gün içinde sohbet kanallarında 500 mesaja ulaşın.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.3M€ Değer**`,
      `${E.CL_crystal} **100k OWO puanı**\n${E.CL_arrow_right} OWO botunda 100k puan ödeyin.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.3M€ Değer**`,
    ]
  },
  {
    title: `${E.CL_electro_money} DEĞER KAZANMA SİSTEMİ`,
    header: 'Boost & destek odaklı kazançlar!',
    items: [
      `${E.CL_crystal} **Sunucuya Boost basmak (1 Adet)**\n${E.CL_arrow_right} Nitro ile sunucumuza 1 adet boost basın.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **5M€ Değer**`,
      `${E.CL_crystal} **Sunucuya Boost basmak (2 Adet)**\n${E.CL_arrow_right} Nitro ile sunucumuza 2 adet boost basın.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **10M€ Değer**\nNot:En Fazla 4 Boost Değeri Alabilirsiniz`,
    ]
  },
  {
    title: `${E.CL_futbolbotu} MAÇ KISMI — GOL & ASİST`,
    header: 'Maç performansınıza göre değer kazanın!',
    items: [
      `${E.CL_futbolbotu} **Toplam 1 gol atmak**\n${E.CL_arrow_right} Maçlarda 1 gole ulaşın.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.2M€ Değer**`,
      `${E.CL_futbolbotu} **Toplam 1 asist yapmak**\n${E.CL_arrow_right} Maçlarda 1 asiste ulaşın.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.2M€ Değer**`,
      `${E.CL_futbolbotu} **Hat trick yapmak**\n${E.CL_arrow_right} Bir maçta 3 gol atarak hat trick yapın.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.4M€ Değer**`,
      `${E.CL_futbolbotu} **Sezon sonu Gol Kralı olmak**\n${E.CL_arrow_right} Sezonu en çok gol atan oyuncu olarak tamamlayın.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **4M€ Değer**`,
    ]
  },
  {
    title: `${E.CL_futbolbotu} MAÇ KISMI — POZİSYON ODAKLI`,
    header: 'Mevkinize göre ekstra kazançlar!',
    items: [
      `${E.CL_goal} **Kaleciler — Gol yememek**\n${E.CL_arrow_right} Maç boyunca gol yemeden tamamlayın (her maç için).\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.3M€ Değer**`,
      `${E.CL_kalkan} **Defans oyuncuları — Gol yememek**\n${E.CL_arrow_right} Takımınız maçı gol yemeden tamamlarsa (her maç için).\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **0.2M€ Değer**`,
      `${E.CL_futbolbotu} **Sezon sonu Asist Kralı olmak**\n${E.CL_arrow_right} Sezonu en çok asist yapan oyuncu olarak tamamlayın.\n${E.CL_arrow_tail} **Kazanç:** ${E.CL_electro_money} **4M€ Değer**`,
    ]
  },
];

const note = `━━━━━━━━━━━━━━━━━━━━━\n> 📌 Değerlerinizi \`.değersayı\` ile kontrol edebilirsiniz.`;

function buildPage(pageIndex, disabled = false) {
  const page = pages[pageIndex];
  const itemNumber = (pageIndex * 4) + 1;
  const text = [
    `**${page.title}**`,
    `> ${page.header}`,
    '',
    page.items.map((item, i) => `**${itemNumber + i}.** ${item}`).join('\n\n'),
    '',
    note,
  ].join('\n');
  const navRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('dr_prev').setEmoji(E.CL_sol_ok).setStyle(ButtonStyle.Secondary).setDisabled(disabled || pageIndex === 0),
    new ButtonBuilder().setCustomId('dr_home').setEmoji(E.CL_pano).setStyle(ButtonStyle.Secondary).setDisabled(disabled),
    new ButtonBuilder().setCustomId('dr_next').setEmoji(E.CL_sag_ok).setStyle(ButtonStyle.Secondary).setDisabled(disabled || pageIndex === pages.length - 1),
  );
  return { flags: MessageFlags.IsComponentsV2, components: [Container([T(text), Sep(), navRow.toJSON()])] };
}

module.exports = {
  'değerrehberi': {
    execute(message) {
      let currentPage = 0;
      let idleTimer = null;
      const msgPromise = message.channel.send(buildPage(0));

      function resetIdleTimer() {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          currentPage = 0;
          msgPromise.then(m => m.edit(buildPage(0)).catch(() => {}));
        }, 30000);
      }

      msgPromise.then(msg => {
        resetIdleTimer();
        const collector = msg.createMessageComponentCollector({ filter: i => i.customId.startsWith('dr_'), time: 0 });
        collector.on('collect', async (i) => {
          try {
            if (i.customId === 'dr_home') {
              currentPage = 0;
            } else if (i.customId === 'dr_next') {
              currentPage = Math.min(currentPage + 1, pages.length - 1);
            } else if (i.customId === 'dr_prev') {
              currentPage = Math.max(currentPage - 1, 0);
            }
            resetIdleTimer();
            await i.update(buildPage(currentPage));
          } catch {}
        });
      });
    }
  }
};
