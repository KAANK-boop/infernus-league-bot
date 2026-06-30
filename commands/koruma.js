const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageFlags } = require('discord.js');
const db = require('../database/db');
const { getConfig } = require('../engine/guard');
const E = require('../config/emojis');
const { T, Sep, Container } = require('../utils/componentsv2');

const CATEGORIES = [
  { key: 'sohbet', label: 'Sohbet Korumaları', emoji: E.CL_sohbet },
  { key: 'sunucu', label: 'Sunucu Korumaları', emoji: E.CL_discord_kalkan },
  { key: 'yetki', label: 'Yetki Limitleri', emoji: E.CL_ayarlar },
];

const FEATURES = [
  { key: 'caps', label: 'Caps Lock', emoji: E.CL_capslock, cat: 'sohbet' },
  { key: 'link', label: 'Link Engel', emoji: E.CL_link, cat: 'sohbet' },
  { key: 'kufur', label: 'Küfür Filtresi', emoji: E.CL_kufur, cat: 'sohbet' },
  { key: 'reklam', label: 'Reklam Engel', emoji: E.CL_duyuru, cat: 'sohbet' },
  { key: 'flood', label: 'Flood Koruma', emoji: E.CL_dongu, cat: 'sohbet' },
  { key: 'mention', label: 'Etiket Spam', emoji: E.CL_hedef, cat: 'sohbet' },
  { key: 'resim', label: 'Resim Engel', emoji: E.CL_banned, cat: 'sohbet' },
  { key: 'antiBot', label: 'Bot Koruması', emoji: E.CL_futbolbotu, cat: 'sunucu' },
  { key: 'antiWebhook', label: 'Webhook Koruması', emoji: E.CL_link, cat: 'sunucu' },
  { key: 'antiNuke', label: 'Anti-Nuke', emoji: E.CL_kalkan, cat: 'sunucu' },
  { key: 'antiKanal', label: 'Kanal Koruması', emoji: E.CL_kilit, cat: 'yetki' },
  { key: 'antiRol', label: 'Rol Koruması', emoji: E.CL_yildiz, cat: 'yetki' },
  { key: 'antiBan', label: 'Ban Koruması', emoji: E.CL_carpi, cat: 'yetki' },
];

const guildPage = new Map();

function getStatus(cfg, key) {
  const val = cfg[key];
  if (val === true || val === false) return val;
  if (typeof val === 'object' && val !== null) return !!val.enabled;
  return false;
}

function s(cfg, key) { return getStatus(cfg, key) ? '🟢' : '🔴'; }

function buildPanel(guildId, client) {
  const cfg = getConfig(guildId);
  const page = guildPage.get(guildId) || 'main';

  let lines;
  let select;
  let cat = null;
  if (page !== 'main') cat = CATEGORIES.find(c => c.key === page);

  if (page === 'main') {
    lines = [
      `${E.Korunuyor} Sunucu koruma sistemini aşağıdan yönetebilirsiniz.`,
      ''
    ];
    for (const c of CATEGORIES) {
      const feats = FEATURES.filter(f => f.cat === c.key);
      const active = feats.filter(f => getStatus(cfg, f.key)).length;
      lines.push(`${E.CL_karisik} ${c.emoji} ${c.label} ${E.CL_karisik}`);
      for (const f of feats) {
        lines.push(`${s(cfg, f.key)} ${f.emoji} **${f.label}**`);
      }
      lines.push(`> **${active}/${feats.length} aktif**`);
      lines.push('');
    }
    lines.push(`━━`);
    lines.push(`${E.CL_pano} **Log:** ${cfg.logKanal ? `<#${cfg.logKanal}>` : `${E.CL_carpi} Ayarlanmamış`}`);
    lines.push(`${E.CL_yildiz} **Whitelist:** ${cfg.whitelist?.length || 0} kullanıcı/rol`);
    lines.push(`━━`);

    select = new StringSelectMenuBuilder()
      .setCustomId('guard_main')
      .setPlaceholder(`${E.CL_sag_ok} İşlem seçin...`)
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel('Tümünü Aç').setEmoji('✅').setDescription('Bütün koruma özelliklerini aktif et').setValue('all_on'),
        new StringSelectMenuOptionBuilder().setLabel('Tümünü Kapat').setEmoji('❌').setDescription('Bütün koruma özelliklerini devre dışı bırak').setValue('all_off'),
        ...CATEGORIES.map(c => {
          const feats = FEATURES.filter(f => f.cat === c.key);
          const active = feats.filter(f => getStatus(cfg, f.key)).length;
          return new StringSelectMenuOptionBuilder().setLabel(c.label).setEmoji(c.emoji).setDescription(`${active}/${feats.length} aktif — Detayları gör`).setValue(`cat_${c.key}`);
        })
      );
  } else {
    const feats = FEATURES.filter(f => f.cat === page);
    const active = feats.filter(f => getStatus(cfg, f.key)).length;

    lines = [
      `${E.CL_karisik} ${cat.emoji} ${cat.label} ${E.CL_karisik}`,
      `> **${active}/${feats.length} aktif** — Aşağıdan tek tek açıp kapatabilirsin`,
      ''
    ];
    for (const f of feats) {
      lines.push(`${getStatus(cfg, f.key) ? E.CL_yesiltik : E.CL_carpi} ${f.emoji} **${f.label}**`);
    }
    lines.push('');
    lines.push(`━━`);
    lines.push(`${E.CL_pano} **Log:** ${cfg.logKanal ? `<#${cfg.logKanal}>` : `${E.CL_carpi} Ayarlanmamış`}`);
    lines.push(`${E.CL_yildiz} **Whitelist:** ${cfg.whitelist?.length || 0} kullanıcı/rol`);
    lines.push(`━━`);

    select = new StringSelectMenuBuilder()
      .setCustomId('guard_cat')
      .setPlaceholder(`${E.CL_sag_ok} ${cat.label} işlemi seçin...`)
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel('Ana Sayfa').setEmoji(E.CL_sol_ok).setDescription('Ana menüye dön').setValue('back'),
        new StringSelectMenuOptionBuilder().setLabel('Tümünü Aç').setEmoji('✅').setDescription(`Tüm ${cat.label} özelliklerini aktif et`).setValue(`${page}_all_on`),
        new StringSelectMenuOptionBuilder().setLabel('Tümünü Kapat').setEmoji('❌').setDescription(`Tüm ${cat.label} özelliklerini devre dışı bırak`).setValue(`${page}_all_off`),
        ...feats.map(f => new StringSelectMenuOptionBuilder().setLabel(`${getStatus(cfg, f.key) ? '🟢' : '🔴'} ${f.label}`).setEmoji(f.emoji).setDescription(getStatus(cfg, f.key) ? 'Aktif — Kapat' : 'Deaktif — Aç').setValue(f.key))
      );
  }

  const embed = new EmbedBuilder()
    .setColor(0x2B2D31)
    .setTitle(`${E.Korunuyor} Infermus League — ${page === 'main' ? 'Sunucu Koruma' : cat.label}`)
    .setDescription(lines.join('\n'))
    .setFooter({ text: 'Infermus League', iconURL: client.user.displayAvatarURL() })
    .setTimestamp();
  return { flags: MessageFlags.IsComponentsV2, components: [Container([T(lines.join('\n')), new ActionRowBuilder().addComponents(select).toJSON()])] };
}

function toggleAll(guildId, state) {
  const cfg = getConfig(guildId);
  for (const f of FEATURES) {
    const val = cfg[f.key];
    if (typeof val === 'object') val.enabled = state;
    else cfg[f.key] = state;
  }
  db.set(`guard.${guildId}`, cfg);
  return cfg;
}

function setAllByCat(guildId, cat, state) {
  const cfg = getConfig(guildId);
  for (const f of FEATURES.filter(x => x.cat === cat)) {
    const val = cfg[f.key];
    if (typeof val === 'object') val.enabled = state;
    else cfg[f.key] = state;
  }
  db.set(`guard.${guildId}`, cfg);
  return cfg;
}

function toggle(guildId, key) {
  const cfg = getConfig(guildId);
  const val = cfg[key];
  if (typeof val === 'object') val.enabled = !val.enabled;
  else cfg[key] = !val;
  db.set(`guard.${guildId}`, cfg);
  return cfg;
}

module.exports = {
  'koruma-log': {
    async execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Bu komut için **Yönetici** yetkisi gerekli.');
      const ch = message.mentions.channels.first();
      if (!ch) return message.reply('Lütfen bir kanal etiketle. Örnek: `.koruma-log #log-kanalı`');
      const cfg = getConfig(message.guild.id);
      cfg.logKanal = ch.id;
      db.set(`guard.${message.guild.id}`, cfg);
      message.reply(`${E.CL_yesiltik} Log kanalı ${ch} olarak ayarlandı.`);
    },
  },
  koruma: {
    async execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Bu komut için **Yönetici** yetkisi gerekli.');
      guildPage.set(message.guild.id, 'main');
      try {
        const panel = buildPanel(message.guild.id, message.client);
        await message.channel.send(panel);
      } catch (e) {
        console.error('koruma error:', e);
        message.channel.send(`${E.CL_carpi} Hata: ${e.message}`);
      }
    },
  },
  'koruma-whitelist': {
    async execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Bu komut için **Yönetici** yetkisi gerekli.');
      const cfg = getConfig(message.guild.id);
      if (!args[0]) {
        const list = (cfg.whitelist || []).map(id => {
          const m = message.guild.members.cache.get(id);
          const r = message.guild.roles.cache.get(id);
          return m ? `${E.CL_futbolbotu} ${m.user.tag} (üye)` : r ? `${E.CL_kalkan} @${r.name} (rol)` : `\`${id}\``;
        }).join('\n') || 'Henüz eklenmiş yok.';
        message.channel.send({
          flags: MessageFlags.IsComponentsV2,
          components: [
            Container([
              T(`${E.CL_kupa} **Koruma Whitelist**`),
              Sep(),
              T(`${E.CL_yonetim} **Muaf Tutulanlar**\n━━━━━━━━━━━━━━━━━━━━━━\n${list}\n━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_sag_ok} \`.koruma-whitelist @üye/@rol\` ekler\n${E.CL_carpi} \`.koruma-whitelist sil @üye/@rol\` çıkarır`),
            ]),
          ],
        });
        return;
      }
      if (args[0] === 'sil') {
        const target = message.mentions.users.first() || message.mentions.roles.first();
        if (!target) return message.reply('Lütfen bir üye veya rol etiketle.');
        cfg.whitelist = (cfg.whitelist || []).filter(id => id !== target.id);
        db.set(`guard.${message.guild.id}`, cfg);
        return message.reply(`${E.CL_yesiltik} ${target} whitelist'ten çıkarıldı.`);
      }
      const target = message.mentions.users.first() || message.mentions.roles.first();
      if (!target) return message.reply('Lütfen bir üye veya rol etiketle.');
      if (!cfg.whitelist) cfg.whitelist = [];
      if (cfg.whitelist.includes(target.id)) return message.reply('Zaten whitelist\'te.');
      cfg.whitelist.push(target.id);
      db.set(`guard.${message.guild.id}`, cfg);
      message.reply(`${E.CL_yesiltik} ${target} whitelist'e eklendi. Anti-nuke korumalarından muaf.`);
    },
  },
  handleGuardInteraction: {
    async execute(interaction) {
      try {
        if (interaction.isButton()) {
          await interaction.reply({ content: `${E.CL_uyari} Koruma paneli güncellendi! Lütfen **\`.koruma\`** yazarak yeni paneli açın.`, ephemeral: true });
          return;
        }
        if (!interaction.isStringSelectMenu()) return;
        await interaction.deferUpdate();
        const gid = interaction.guild.id;
        const val = interaction.values[0];

        if (interaction.customId === 'guard_main') {
          if (val === 'all_on') { toggleAll(gid, true); guildPage.set(gid, 'main'); }
          else if (val === 'all_off') { toggleAll(gid, false); guildPage.set(gid, 'main'); }
          else if (val.startsWith('cat_')) { guildPage.set(gid, val.replace('cat_', '')); }
          await interaction.editReply(buildPanel(gid, interaction.client));
          return;
        }

        if (interaction.customId === 'guard_cat') {
          if (val === 'back') { guildPage.set(gid, 'main'); }
          else if (val.endsWith('_all_on')) { const cat = val.replace('_all_on', ''); setAllByCat(gid, cat, true); }
          else if (val.endsWith('_all_off')) { const cat = val.replace('_all_off', ''); setAllByCat(gid, cat, false); }
          else { toggle(gid, val); }
          await interaction.editReply(buildPanel(gid, interaction.client));
          return;
        }
      } catch (e) {
        console.error('[Guard Interaction Error]', e);
        try { await interaction.followUp({ content: `${E.CL_carpi} Hata: ${e.message}`, ephemeral: true }); } catch {}
      }
    },
  },
};
