const { MessageFlags } = require('discord.js');
const { T, Container } = require('../utils/componentsv2');
const E = require('../config/emojis');

module.exports = {
  minimarket: {
    async execute(message) {
      const container = Container([T([
        `**${E.CL_electro_money} Electro Mini Market**`,
        '',
        `${E.CL_kupa} **Kulüp & Stadyum**`,
        `> ${E.CL_kupa} Stadyum İsmi Değiştirme → 40₺ / 4M 💰`,
        `> ${E.CL_bilet} Maç Yayın Hakkı (1 Ay) → 25₺ / 2.5M 💰`,
        `> ${E.CL_kalkan} Sakatlık Sigortası (1 Ay) → 30₺ / 3M 💰`,
        `> ${E.CL_transfer} Scout Hakkı (Oyuncu Keşif) → 20₺ / 2M 💰`,
        '',
        `${E.CL_electro_money} **Coin Paketleri**`,
        `> 1.000.000 Coin → 3₺ / 300K 💰`,
        `> 10.000.000 Coin → 25₺ / 2.5M 💰`,
        `> 100.000.000 Coin → 50₺ / 5M 💰`,
        `> 1.000.000.000 Coin → 150₺ / 15M 💰`,
        '',
        `${E.CL_kraltac} **Rol Paketleri**`,
        `> ${E.CL_kraltac} <@&1498353593936384040> → 150₺ / 15M 💰`,
        `> ${E.CL_yildiz} <@&1498352100344860752> → 120₺ / 12M 💰`,
        `> ${E.CL_kupa} <@&1498346359592587304> → 80₺ / 8M 💰`,
        `> ${E.CL_hediye} Özel İsimli & Renkli Rol → 200₺ / 20M 💰`,
        '',
        `${E.CL_futbolbotu} **Futbolcu Geliştirme**`,
        `> ${E.CL_kupa} +10 Hız Paketi → 30₺ / 3M 💰`,
        `> ${E.CL_kupa} +10 Şut Paketi → 30₺ / 3M 💰`,
        `> ${E.CL_kupa} +10 Pas Paketi → 30₺ / 3M 💰`,
        `> ${E.CL_kupa} +10 Defans Paketi → 30₺ / 3M 💰`,
        `> ${E.CL_kupa} +10 Kaleci Paketi → 30₺ / 3M 💰`,
        `> ${E.CL_kupa} +10 Genel Paket → 40₺ / 4M 💰`,
        `> ${E.sozlesme} Özel Yetenek Paketi → 75₺ / 7.5M 💰`,
        '',
        `${E.CL_transfer} **Transfer & Diğer**`,
        `> ${E.CL_futbolbotu} Hayali Futbolcu Alımı → 65₺ / 6.5M 💰`,
        `> <@&1515013503151509704> Çekiliş Şans Arttırıcı (2x) → 5₺ / 500K 💰`,
        `> <@&1515013614933901362> Çekiliş Şans Arttırıcı (5x) → 20₺ / 2M 💰`,
        `> ${E.CL_transfer} Futbolcu İsim Değiştirme → 35₺ / 3.5M 💰`,
        `> ${E.CL_transfer} Futbolcu Mevki Değiştirme → 40₺ / 4M 💰`,
        `> ${E.sozlesme} Hesap Aktarma Hakkı → 150₺ (OwO ile alınamaz)`,
        '',
        '━━━━━━━━━━━━━━━━━━━━━━',
        '**Ödeme Yöntemleri**',
        `🏦 IBAN • 🛒 İtem Satış • 💰 OwO • 💳 Papara`,
        '',
        `${E.CL_ticket} Satın almak için <#1496832266985406499> kanalından ticket açın.`,
        '',
        `-# Infermus League • Mini Market`,
      ].join('\n'))]);
      await message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
    }
  },
};
