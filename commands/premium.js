const { MessageFlags } = require('discord.js');
const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

const botPremiumPackages = [
  { name: 'Basic', price: '50₺', emoji: '⭐', features: ['Özel Basic Rolü', '2x Coin Kazancı (7 gün)', 'Özel Kanal Erişimi', 'Özel Komutlar'] },
  { name: 'Pro', price: '100₺', emoji: '💎', features: ['Özel Pro Rolü', '3x Coin Kazancı (30 gün)', 'Özel Kanal Erişimi', 'Özel Komutlar', 'Reklamsız Deneyim', 'Öncelikli Destek'] },
  { name: 'Elite', price: '200₺', emoji: '👑', features: ['Özel Elite Rolü', '5x Coin Kazancı (90 gün)', 'Özel Kanal Erişimi', 'Tüm Özel Komutlar', 'Reklamsız Deneyim', '7/24 Öncelikli Destek', 'Sunucuna Özel Etkinlik', 'Bot Geliştirme Söz Hakkı'] },
  { name: 'Full Sunucu', price: '500₺', emoji: '🌟', features: ['Özel Full Sunucu Rolü', 'Tüm Premium Özellikleri (Sınırsız)', 'Özel Kanal ve Kategori Erişimi', 'Tüm Özel Komutlar + Gelecek Komutlar', 'Sınırsız Coin Kazancı', 'Her Hafta Özel Etkinlik', 'Reklam Paketlerinde %50 İndirim', '7/24 Öncelikli Destek', 'Bot Geliştirme Söz Hakkı'] },
];

const reklamPackages = [
  { name: 'Ekonomik 1', price: '3M OWO', emoji: '📢', features: ['<#1496832266985406494> Kanalında **Here** İle Kalıcı Paylaşım'] },
  { name: 'Ekonomik 2', price: '3.5M OWO', emoji: '📣', features: ['<#1496832266985406494> Kanalında **Everyone** İle Kalıcı Paylaşım'] },
  { name: 'Ekonomik 3', price: '4.5M OWO', emoji: '🌟', features: ['<#1496832266985406494> Kanalında **Here** İle Kalıcı Paylaşım', '<#1496832267522412714> Kanalında **here** İle Paylaşım + Şartlı Çekiliş'] },
  { name: 'Ekonomik 4', price: '5.5M OWO ₺/Veya 200₺', emoji: '💫', features: ['<#1496832266985406494> Kanalında **Here** İle Kalıcı Paylaşım', '<#1496832267522412714> Kanalında **Everyone** İle Paylaşım + Çekiliş', 'Sponsorluk Kategorisinde Özel Kanal (1 Hafta)'] },
  { name: 'Mega', price: '6.5M OWO', emoji: '🔥', features: ['<#1496832266985406494> Kanalında **Here** İle Kalıcı Paylaşım', '<#1496832267522412714> Kanalında **Everyone** İle Paylaşım + Çekiliş', 'Reklam Kategorisinde Özel Kanal (1 Ay)'] },
  { name: 'Ultra', price: '7.5M OWO', emoji: '🚀', features: ['<#1496832266985406494> Kanalında **Everyone + Here** İle Kalıcı Paylaşım', '<#1496832267522412714> Kanalında **Everyone** İle Paylaşım + Çekiliş (1.5 Gün Katılım Şartlı)', 'Özel 1 Aylık Rol', 'Herkesin Görebileceği Yerde Özel Kanal'] },
];

function buildBotPremiumEmbed(author) {
  const desc = botPremiumPackages.map(p =>
    `${p.emoji} **${p.name} Paketi** — ${p.price}\n${p.features.map(f => `${E.CL_sag_ok} ${f}`).join('\n')}`
  ).join('\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n');
  const text = [
    `**${E.CL_hediye} Infermus League Premium**`,
    '',
    '```fix',
    'Bot premium paketleri ile ayrıcalıkları keşfet!',
    '```',
    '',
    desc,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━',
    `${E.CL_electro_money} Ödeme: 💳 Papara / 🏦 İban / 🛒 İtem Satış / 💰 OWO`,
    `${E.CL_ticket} Satın almak için <#1484184287774376118> kanalından ticket açın.`,
    '',
    '-# Infermus League',
  ].join('\n');
  return Container([T(text)]);
}

function buildReklamEmbed(author) {
  const desc = reklamPackages.map(p =>
    `${p.emoji} **${p.name}** — ${p.price}\n${p.features.map(f => `${E.CL_sag_ok} ${f}`).join('\n')}`
  ).join('\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n');
  const text = [
    `**${E.CL_duyuru} Reklam & Tanıtım Paketleri**`,
    '',
    '```fix',
    'Sunucunu büyütmek için doğru yerdesin!',
    '```',
    '',
    desc,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━',
    `${E.CL_ticket} Satın almak için <#1496832266985406499> kanalından ticket açın.`,
    '',
    `${E.CL_sag_ok} Ekstra **Here** Etiketi: 1M OWO`,
    `${E.CL_sag_ok} Ekstra **Everyone** Etiketi: 2M OWO`,
    '',
    '**Ödeme Yöntemleri:**',
    '💳 Papara',
    '🏦 İban',
    '🛒 İtem Satış',
    `💰 OWO`,
    '',
    '-# Infermus League',
  ].join('\n');
  return Container([T(text)]);
}

module.exports = {
  'electro-premium': {
    execute(message) {
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [buildBotPremiumEmbed(message.author)] });
    }
  },
  reklampaketleri: {
    execute(message) {
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [buildReklamEmbed(message.author)] });
    }
  },
  reklambilgi: {
    execute(message) {
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [buildReklamEmbed(message.author)] });
    }
  },
};
