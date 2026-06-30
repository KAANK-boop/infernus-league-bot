const { ChannelType } = require('discord.js');
const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

const EXCLUDED_GUILD = '1496832264028553341';

const yapı = [
  {
    name: 'Ses',
    type: 'category',
    channels: [
      { name: 'WEXCAN', type: ChannelType.GuildVoice },
      { name: 'RİAVO', type: ChannelType.GuildVoice },
      { name: 'KİNGDOM', type: ChannelType.GuildVoice },
      { name: 'OM3GLE TROLL', type: ChannelType.GuildVoice },
      { name: 'Aşk Bahçesi', type: ChannelType.GuildVoice },
      { name: 'Almanya Cumhuriyeti', type: ChannelType.GuildVoice },
      { name: 'Babalar Resitali', type: ChannelType.GuildVoice },
      { name: 'Silivri', type: ChannelType.GuildVoice },
      { name: 'Kabe', type: ChannelType.GuildVoice },
      { name: 'Umre', type: ChannelType.GuildVoice },
      { name: 'Gazze', type: ChannelType.GuildVoice },
      { name: 'Cennetlik Tam Liste', type: ChannelType.GuildVoice },
      { name: 'Susmasına', type: ChannelType.GuildVoice },
      { name: 'CS', type: ChannelType.GuildVoice },
      { name: '2 Kişilik Masa', type: ChannelType.GuildVoice },
      { name: 'VALO', type: ChannelType.GuildVoice },
      { name: '3 Kişilik Masa', type: ChannelType.GuildVoice },
      { name: 'Çok Özledim', type: ChannelType.GuildVoice },
    ]
  },
  {
    name: '0%',
    type: 'category',
    channels: [
      { name: 'Wexp DARK (Kullanici)', type: ChannelType.GuildVoice },
      { name: 'Yalnızlık Senfonisi', type: ChannelType.GuildVoice },
      { name: 'r3alg1d (Kullanıcı)', type: ChannelType.GuildVoice },
      { name: 'Tek Kişilik Dev Kadro', type: ChannelType.GuildVoice },
      { name: 'dipsizkeder (Kullanıcı)', type: ChannelType.GuildVoice },
      { name: 'Tanrının Yalnız Adamı', type: ChannelType.GuildVoice },
      { name: 'Yalnızlığın Zirvesi', type: ChannelType.GuildVoice },
      { name: 'Kimsem YOk', type: ChannelType.GuildVoice },
      { name: 'Ses Kasıyom', type: ChannelType.GuildVoice },
      { name: 'Sleep', type: ChannelType.GuildVoice },
      { name: 'Teyit', type: ChannelType.GuildVoice },
    ]
  },
  {
    name: 'haydutlar',
    type: 'category',
    channels: [
      { name: 'Bilgilendirme', type: ChannelType.GuildText },
      { name: 'haydutlar-click', type: ChannelType.GuildText },
      { name: 'rol-bilgi-ses-süreleri', type: ChannelType.GuildText },
      { name: 'duyuru', type: ChannelType.GuildText },
      { name: 'rules', type: ChannelType.GuildText },
      { name: 'darksiber-x', type: ChannelType.GuildText },
      { name: 'sohbet-haydutlar', type: ChannelType.GuildText },
      { name: 'bot-komut', type: ChannelType.GuildText },
      { name: 'g4zin0', type: ChannelType.GuildText },
      { name: '15x-bilgilendirme', type: ChannelType.GuildText },
      { name: '15-s-s-rol', type: ChannelType.GuildText },
    ]
  },
  {
    name: 'GENEL',
    type: 'category',
    channels: [
      { name: 'sohbet', type: ChannelType.GuildText },
      { name: 'bot-komut', type: ChannelType.GuildText },
      { name: 'duyuru', type: ChannelType.GuildText },
      { name: 'rules', type: ChannelType.GuildText },
      { name: 'görüntülü-sohbet', type: ChannelType.GuildVoice },
      { name: 'sesel', type: ChannelType.GuildVoice },
      { name: 'müzik', type: ChannelType.GuildVoice },
      { name: 'özel-oda-1', type: ChannelType.GuildVoice },
      { name: 'özel-oda-2', type: ChannelType.GuildVoice },
    ]
  },
  {
    name: 'PUBG',
    type: 'category',
    channels: [
      { name: 'pubg-sohbet', type: ChannelType.GuildText },
      { name: 'takım-bul', type: ChannelType.GuildText },
      { name: 'pubg-1', type: ChannelType.GuildVoice },
      { name: 'pubg-2', type: ChannelType.GuildVoice },
      { name: 'pubg-3', type: ChannelType.GuildVoice },
    ]
  },
  {
    name: 'VALORANT',
    type: 'category',
    channels: [
      { name: 'valo-sohbet', type: ChannelType.GuildText },
      { name: 'valo-takım', type: ChannelType.GuildText },
      { name: 'valo-1', type: ChannelType.GuildVoice },
      { name: 'valo-2', type: ChannelType.GuildVoice },
    ]
  },
  {
    name: 'CS2',
    type: 'category',
    channels: [
      { name: 'cs-sohbet', type: ChannelType.GuildText },
      { name: 'cs-takım', type: ChannelType.GuildText },
      { name: 'cs-1', type: ChannelType.GuildVoice },
      { name: 'cs-2', type: ChannelType.GuildVoice },
    ]
  },
];

function embedReply(msg, desc) {
  return { components: [Container([T(`${desc}\n\n-# Infermus League`)])] };
}

module.exports = {
  publicolustur: {
    async execute(message) {
      try {
        if (message.guild.id === EXCLUDED_GUILD) return message.reply(embedReply(message, `${E.CL_carpi} Bu komut bu sunucuda kullanılamaz!`));
        if (!message.member.permissions.has('Administrator')) return message.reply(embedReply(message, `${E.CL_carpi} Bu komut için **Yönetici** yetkisine sahip olmalısın!`));
        const msg = await message.channel.send({ ...embedReply(message, `${E.CL_dongu} Kanallar siliniyor...`), flags: 32768 });
        await Promise.all([...message.guild.channels.cache.values()].map(ch => ch.delete().catch(() => {})));
        await msg.edit(embedReply(message, `${E.CL_dongu} Kategoriler ve kanallar oluşturuluyor...`));
        for (const kat of yapı) {
          const category = await message.guild.channels.create({ name: kat.name, type: ChannelType.GuildCategory });
          await Promise.all(kat.channels.map(ch =>
            message.guild.channels.create({ name: ch.name, type: ch.type, parent: category.id }).catch(() => {})
          ));
        }
        await msg.edit(embedReply(message, `${E.CL_yesiltik} Sunucu başarıyla oluşturuldu!`));
      } catch (e) {
        message.channel.send({ ...embedReply(message, `${E.CL_carpi} Hata: ${e.message}`), flags: 32768 });
      }
    }
  },

  tümkanallarısil: {
    async execute(message) {
      try {
        if (message.guild.id === EXCLUDED_GUILD) return message.reply(embedReply(message, `${E.CL_carpi} Bu komut bu sunucuda kullanılamaz!`));
        if (!message.member.permissions.has('Administrator')) return message.reply(embedReply(message, `${E.CL_carpi} Bu komut için **Yönetici** yetkisine sahip olmalısın!`));
        const msg = await message.channel.send({ ...embedReply(message, `${E.CL_dongu} Tüm kanallar siliniyor...`), flags: 32768 });
        await Promise.all([...message.guild.channels.cache.values()].map(ch => ch.delete().catch(() => {})));
        if (msg.editable) await msg.edit(embedReply(message, `${E.CL_yesiltik} Tüm kanallar silindi!`));
      } catch (e) {
        message.channel.send({ ...embedReply(message, `${E.CL_carpi} Hata: ${e.message}`), flags: 32768 });
      }
    }
  },

  publicrol: {
    async execute(message) {
      try {
        if (message.guild.id === EXCLUDED_GUILD) return message.reply(embedReply(message, `${E.CL_carpi} Bu komut bu sunucuda kullanılamaz!`));
        if (!message.member.permissions.has('Administrator')) return message.reply(embedReply(message, `${E.CL_carpi} Bu komut için **Yönetici** yetkisine sahip olmalısın!`));
        const rolList = ['THE BARBAR','ZIRVE UYE','EFSANE UYE','DESTANSI UYE','PLATINUM UYE','GOLD UYE','VIP UYE','ELIT UYE','OZEL UYE','ONAYLI UYE','TAGLI UYE','GUCLU UYE','SEVIYE 8','SEVIYE 7','SEVIYE 6','SEVIYE 5','SEVIYE 4','SEVIYE 3','SEVIYE 2','SEVIYE 1'];
        const msg = await message.channel.send({ ...embedReply(message, `${E.CL_dongu} Roller siliniyor...`), flags: 32768 });
        let roles = [...message.guild.roles.cache.values()].filter(r => r.name !== '@everyone');
        const results = await Promise.allSettled(roles.map(r => r.delete()));
        const deleted = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        await msg.edit(embedReply(message, `${E.CL_dongu} **${deleted}** rol silindi, **${failed}** başarısız. Yeni roller oluşturuluyor...`));
        const created = [];
        for (const name of rolList) {
          try { await message.guild.roles.create({ name, color: 0x2B2D31 }); created.push(name); } catch {}
        }
        await msg.edit(embedReply(message, `${E.CL_yesiltik} **${deleted}** rol silindi, **${created.length}** yeni rol oluşturuldu!`));
      } catch (e) {
        message.channel.send({ ...embedReply(message, `${E.CL_carpi} Hata: ${e.message}`), flags: 32768 });
      }
    }
  },

  rollerisil: {
    async execute(message) {
      try {
        if (message.guild.id === EXCLUDED_GUILD) return message.reply(embedReply(message, `${E.CL_carpi} Bu komut bu sunucuda kullanılamaz!`));
        if (!message.member.permissions.has('Administrator')) return message.reply(embedReply(message, `${E.CL_carpi} Bu komut için **Yönetici** yetkisine sahip olmalısın!`));
        const msg = await message.channel.send({ ...embedReply(message, `${E.CL_dongu} Roller siliniyor...`), flags: 32768 });
        let roles = [...message.guild.roles.cache.values()].filter(r => r.name !== '@everyone');
        const results = await Promise.allSettled(roles.map(r => r.delete()));
        const deleted = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        const yeniRoller = ['THE BARBAR','ZIRVE UYE','EFSANE UYE','DESTANSI UYE','PLATINUM UYE','GOLD UYE','VIP UYE','ELIT UYE','OZEL UYE','ONAYLI UYE','TAGLI UYE','GUCLU UYE','SEVIYE 8','SEVIYE 7','SEVIYE 6','SEVIYE 5','SEVIYE 4','SEVIYE 3','SEVIYE 2','SEVIYE 1'];
        await msg.edit(embedReply(message, `${E.CL_dongu} **${deleted}** rol silindi, **${failed}** başarısız. Yeni roller oluşturuluyor...`));
        const created = [];
        for (const name of yeniRoller) {
          try { await message.guild.roles.create({ name, color: 0x2B2D31 }); created.push(name); } catch {}
        }
        await msg.edit(embedReply(message, `${E.CL_yesiltik} **${deleted}** rol silindi, **${failed}** başarısız. **${created.length}** yeni rol oluşturuldu!`));
      } catch (e) {
        message.channel.send({ ...embedReply(message, `${E.CL_carpi} Hata: ${e.message}`), flags: 32768 });
      }
    }
  },

  emojisil: {
    async execute(message) {
      try {
        if (message.guild.id === EXCLUDED_GUILD) return message.reply(embedReply(message, `${E.CL_carpi} Bu komut bu sunucuda kullanılamaz!`));
        if (!message.member.permissions.has('Administrator')) return message.reply(embedReply(message, `${E.CL_carpi} Bu komut için **Yönetici** yetkisine sahip olmalısın!`));
        const msg = await message.channel.send({ ...embedReply(message, `${E.CL_dongu} Emojiler siliniyor...`), flags: 32768 });
        const emojis = [...message.guild.emojis.cache.values()];
        const results = await Promise.allSettled(emojis.map(e => e.delete()));
        const deleted = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        await msg.edit(embedReply(message, `${E.CL_yesiltik} **${deleted}** emoji silindi, **${failed}** başarısız.`));
      } catch (e) {
        message.channel.send({ ...embedReply(message, `${E.CL_carpi} Hata: ${e.message}`), flags: 32768 });
      }
    }
  }
};
