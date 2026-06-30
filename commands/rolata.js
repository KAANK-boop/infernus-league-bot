const { MessageFlags } = require('discord.js');
const { T, Container } = require('../utils/componentsv2');
const db = require('../database/db');
const E = require('../config/emojis');

module.exports = {
  baskanrolata: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const rol = message.mentions.roles.first();
      if (!rol) return message.reply('Kullanım: .baskanrolata @rol');
      db.set(`roller.${message.guild.id}.baskan`, rol.id);
      const container = Container([T([
        `${E.CL_sag_ok} **Başkan** rolü başarıyla \`${rol.name}\` olarak ayarlandı.`,
        '',
        `-# Infermus League`,
      ].join('\n'))]);
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
    }
  },

  teknikrolata: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const rol = message.mentions.roles.first();
      if (!rol) return message.reply('Kullanım: .teknikrolata @rol');
      db.set(`roller.${message.guild.id}.teknik`, rol.id);
      const container = Container([T([
        `${E.CL_sag_ok} **Teknik Direktör** rolü başarıyla \`${rol.name}\` olarak ayarlandı.`,
        '',
        `-# Infermus League`,
      ].join('\n'))]);
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
    }
  },

  ftrolata: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const rol = message.mentions.roles.first();
      if (!rol) return message.reply('Kullanım: .ftrolata @rol');
      db.set(`roller.${message.guild.id}.futbolcu`, rol.id);
      const container = Container([T([
        `${E.CL_sag_ok} **Futbolcu** rolü başarıyla \`${rol.name}\` olarak ayarlandı.`,
        '',
        `-# Infermus League`,
      ].join('\n'))]);
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
    }
  }
};
