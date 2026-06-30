const db = require('../database/db');
const E = require('../config/emojis');
const { MessageFlags } = require('discord.js');
const { T, Container } = require('../utils/componentsv2');

module.exports = {
  afk: {
    execute: async (message, args) => {
      const userId = message.author.id;
      const reason = args.join(' ') || 'Belirtilmedi';

      db.set(`afk.${userId}`, { reason, timestamp: Date.now() });

      await message.reply({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`${E.CL_yesiltik} **AFK moduna geçtin!**\nSebep: **${reason}**\n\nBirine mesaj atana kadar AFK sayılacaksın.`)])]
      });
    },
  },
};
