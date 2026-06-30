const { MessageFlags } = require('discord.js');
const { T, Container } = require('../utils/componentsv2');
const E = require('../config/emojis');

module.exports = {
  dm: {
    async execute(message, args) {
      if (!message.member.permissions.has('Administrator')) {
        return message.reply(`${E.CL_carpi} Bu komut için **Administrator** yetkisine sahip olmalısınız!`);
      }
      if (!args[0] || !args[1]) {
        return message.reply(`${E.plus} Kullanım: .dm @kullanıcıveyarol mesaj`);
      }
      const target = message.mentions.users.first() || message.mentions.roles.first();
      if (!target) {
        return message.reply(`${E.CL_carpi} Geçerli bir kullanıcı veya rol etiketleyin.`);
      }
      const mesaj = args.slice(1).join(' ');
      if (mesaj.length > 2000) return message.reply(`${E.CL_carpi} Mesaj çok uzun! (max 2000 karakter)`);

      const container = Container([T([
        `**Infermus League — Mesaj**`,
        '',
        mesaj,
        '',
        `-# Gönderen: ${message.author.tag}`,
      ].join('\n'))]);

      if (target instanceof require('discord.js').Role) {
        const members = target.members.filter(m => !m.user.bot);
        if (members.size === 0) return message.reply(`${E.CL_carpi} Bu rolde hiç üye yok.`);
        let giden = 0, basarisiz = 0;
        for (const [, member] of members) {
          try { await member.send({ flags: MessageFlags.IsComponentsV2, components: [container] }); giden++; }
          catch { basarisiz++; }
        }
        message.reply(`${E.CL_kabul_edildi} **${target.name}** rolündeki **${giden}** kişiye mesaj gönderildi.${basarisiz ? ` (${basarisiz} kişiye gönderilemedi)` : ''}`);
      } else {
        try {
          await target.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
          message.reply(`${E.CL_kabul_edildi} **${target.tag}** kullanıcısına mesaj gönderildi.`);
        } catch {
          message.reply(`${E.CL_carpi} **${target.tag}** kullanıcısına DM gönderilemedi. Kullanıcı özel mesajlara kapalı.`);
        }
      }
    }
  }
};
