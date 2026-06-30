const { MessageFlags } = require('discord.js');
const { T, Container } = require('../utils/componentsv2');
const E = require('../config/emojis');

module.exports = {
  roll: {
    execute(message, args) {
      if (!args.length) {
        const container = Container([T([
          `${E.CL_yonetim} **.roll Kullanımı**`,
          `━━━━━━━━━━━━━━━━━━━━━━`,
          `${E.CL_sag_ok} \`.roll secenek1, secenek2, ...\``,
          `${E.CL_sag_ok} \`.roll 10\` → 1-10 arası sayı`,
          `━━━━━━━━━━━━━━━━━━━━━━`,
          `${E.CL_hediye} **Örnek:** \`.roll gol, aut, direkt\``,
          '',
          `-# Infermus League`,
        ].join('\n'))]);
        return message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
      }

      if (args.length === 1 && /^\d+$/.test(args[0]) && parseInt(args[0]) > 0) {
        const max = parseInt(args[0]);
        const result = Math.floor(Math.random() * max) + 1;
        const container = Container([T([
          `${E.CL_dongu} **Sayısal Atış**`,
          `━━━━━━━━━━━━━━━━━━━━━━`,
          `${E.CL_sag_ok} **Sonuç** ${result}`,
          `━━━━━━━━━━━━━━━━━━━━━━`,
          `1 ile ${max} arası`,
          '',
          `-# Infermus League`,
        ].join('\n'))]);
        return message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
      }

      const items = [];
      for (const a of args) {
        for (const part of a.split(',')) {
          const trimmed = part.trim();
          if (trimmed) items.push(trimmed);
        }
      }

      const counts = {};
      for (const opt of items) {
        counts[opt] = (counts[opt] || 0) + 1;
      }

      const total = items.length;
      const unique = Object.keys(counts);
      const rand = Math.random() * total;
      let cumulative = 0;
      let winner = null;
      for (const opt of unique) {
        cumulative += counts[opt];
        if (rand < cumulative) { winner = opt; break; }
      }
      if (!winner) winner = unique[0];

      const container = Container([T([
        `${E.CL_kupa} **.roll — ${winner}**`,
        '',
        `${E.CL_yildiz} **Sonuç**`,
        `━━━━━━━━━━━━━━━━━━━━━━`,
        `**\`${winner}\`**`,
        '',
        `-# Infermus League`,
      ].join('\n'))]);
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
    }
  }
};
