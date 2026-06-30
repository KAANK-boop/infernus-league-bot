const db = require('../database/db');
const { MessageFlags } = require('discord.js');
const { T, Container } = require('../utils/componentsv2');
const E = require('../config/emojis');

module.exports = {
  kayıtsızdm: {
    async execute(message, args) {
      if (!message.member.permissions.has('Administrator')) {
        return message.reply(`${E.CL_carpi} Bu komut için **Administrator** yetkisine sahip olmalısınız!`);
      }
      const config = db.get(`kayit.${message.guild.id}`);
      if (!config || !config.kayitsizRol) {
        return message.reply(`${E.CL_carpi} Kayıt sistemi kurulmamış veya kayıtsız rolü ayarlanmamış.`);
      }
      const role = message.guild.roles.cache.get(config.kayitsizRol);
      if (!role) return message.reply(`${E.CL_carpi} Kayıtsız rolü bulunamadı.`);

      await message.guild.members.fetch();
      const members = role.members.filter(m => !m.user.bot);
      if (members.size === 0) return message.reply(`${E.CL_carpi} Kayıtsız üye bulunamadı.`);

      const kayitKanal = '<#1496832265832108053>';
      const container = Container([T([
        `**${message.guild.name}**`,
        '',
        `${E.CL_pano} **Infermus League — Kayıt Bildirimi**`,
        '',
        `Uzun süredir kayıtsız olduğunuzu fark ettik.`,
        `Sunucunun tüm özelliklerinden yararlanabilmek için kayıt olmanız gerekmektedir.`,
        `Kayıt işleminizi **${kayitKanal}** kanalında gerçekleştirebilirsiniz.`,
        `Kayıt olduktan sonra transfer, maç, antrenman ve turnuva gibi birçok aktiviteye katılabilirsiniz.`,
        `Kayıt için tek yapmanız gereken yetkililere isminizi söylemektir.`,
        `${E.CL_yildiz} Infermus League ailesine katılmak için sizi bekliyoruz!`,
        '',
        `-# Infermus League`,
      ].join('\n'))]);

      const delay = ms => new Promise(r => setTimeout(r, ms));
      let giden = 0, basarisiz = 0;
      const hatalar = [];
      for (const [, member] of members) {
        try {
          await member.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
          giden++;
        } catch (e) {
          basarisiz++;
          hatalar.push(`${member.user.tag}: ${e.message}`);
        }
        await delay(3000);
      }
      let cevap = `${E.CL_yesiltik} **${giden}** kayıtsız üyeye DM gönderildi.${basarisiz ? ` (${basarisiz} kişiye gönderilemedi)` : ''}`;
      if (hatalar.length > 0) {
        console.log('KayitsizDM hatalari:', hatalar.join(' | '));
      }
      message.reply(cevap);
    }
  }
};
