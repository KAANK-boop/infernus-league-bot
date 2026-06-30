const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

const PAGE_SIZE = 10;

module.exports = {
  emojiid: {
    async execute(message) {
      const coll = await message.guild.emojis.fetch();
      const emojis = [];
      coll.forEach(e => { if (e.name && e.id) emojis.push(e); });
      if (!emojis.length) return message.reply('Bu sunucuda özel emoji yok.');

      const totalPages = Math.ceil(emojis.length / PAGE_SIZE);

      const rows = buildRows(0, totalPages);
      const inner = buildContainer(emojis, 0, totalPages, message.guild.name);
      inner.components.push(...rows.map(r => r.toJSON()));
      await message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [inner] });
    }
  },
  buildEmbed, buildRows, buildContainer,
};

function buildEmbed(emojis, page, totalPages, guildName) {
  const start = page * PAGE_SIZE;
  const items = emojis.slice(start, start + PAGE_SIZE);

  const lines = items.map(e => {
    const format = e.animated ? `<a:${e.name}:${e.id}>` : `<:${e.name}:${e.id}>`;
    return `${format} \`${e.name}\` \`${e.id}\``;
  });

  return new EmbedBuilder()
    .setColor(0x2B2D31)
    .setAuthor({ name: `${guildName} — Emojiler (${emojis.length})` })
    .setDescription(lines.join('\n') || 'Emoji yok.')
    .setFooter({ text: `Sayfa ${page + 1}/${totalPages} • ${emojis.length} emoji` })
    .setTimestamp();
}

function buildContainer(emojis, page, totalPages, guildName) {
  const start = page * PAGE_SIZE;
  const items = emojis.slice(start, start + PAGE_SIZE);
  const lines = items.map(e => {
    const format = e.animated ? `<a:${e.name}:${e.id}>` : `<:${e.name}:${e.id}>`;
    return `${format} \`${e.name}\` \`${e.id}\``;
  });
  const text = [
    `**${guildName} — Emojiler (${emojis.length})**`,
    '',
    lines.join('\n') || 'Emoji yok.',
    '',
    `-# Sayfa ${page + 1}/${totalPages} • ${emojis.length} emoji`,
  ].join('\n');
  return Container([T(text)]);
}

function buildRows(page, totalPages) {
  const navRow = new ActionRowBuilder();
  if (page > 0) {
    navRow.addComponents(
      new ButtonBuilder().setCustomId(`emojiid_page_${page - 1}`).setLabel('◀ Önceki').setStyle(ButtonStyle.Secondary)
    );
  }
  if (page < totalPages - 1) {
    navRow.addComponents(
      new ButtonBuilder().setCustomId(`emojiid_page_${page + 1}`).setLabel('Sonraki ▶').setStyle(ButtonStyle.Secondary)
    );
  }
  const rows = [navRow];
  rows.push(new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('emojiid_kapat').setLabel('Kapat').setEmoji(E.CL_carpi).setStyle(ButtonStyle.Secondary),
  ));
  return rows;
}
