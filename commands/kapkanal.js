const db = require('../database/db');
const E = require('../config/emojis');

module.exports = {
  kapkanal: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) {
        return message.reply('❌ Bu komut için **Administrator** yetkisine sahip olmalısınız!');
      }
      if (!args[0]) {
        const mevcut = db.get(`kapKanal.${message.guild.id}`);
        if (mevcut) {
          const kanal = message.guild.channels.cache.get(mevcut);
          return message.reply(`${E.CL_duyuru} Kap kanalı: ${kanal || 'bulunamadı'}`);
        }
        return message.reply(`${E.plus} Kullanım: ".kapkanal #kanal" veya ".kapkanal sil"`);
      }
      if (args[0] === 'sil') {
        db.delete(`kapKanal.${message.guild.id}`);
        return message.reply(`${E.CL_kabul_edildi} Kap kanalı kaldırıldı.`);
      }
      const channel = message.mentions.channels.first();
      if (!channel) return message.reply(`${E.CL_carpi} Lütfen geçerli bir kanal etiketleyin. ".kapkanal #kanal"`);
      db.set(`kapKanal.${message.guild.id}`, channel.id);
      message.reply(`${E.CL_kabul_edildi} Kap bildirim kanalı ${channel} olarak ayarlandı.`);
    }
  }
};
