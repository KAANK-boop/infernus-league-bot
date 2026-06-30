const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

function getDistube(client) { return client.distube; }

function noDistube() { return '❌ Müzik sistemi aktif değil (distube yüklü değil).'; }

module.exports = {
  çal: { execute: async (message, args, client) => {
    const voice = message.member.voice.channel;
    if (!voice) return message.reply('❌ Önce bir ses kanalına gir!');
    if (!args.length) return message.reply('❌ Bir şarkı adı veya link yaz!');
    const distube = getDistube(client);
    if (!distube) return message.reply(noDistube());
    const query = args.join(' ');
    await message.reply(`🔍 **${query}** aranıyor...`);
    try {
      const ytPlugin = distube.plugins.find(p => p.type === 'extractor' && p.searchSong);
      if (!ytPlugin) return message.reply('❌ Müzik eklentisi bulunamadı.');
      const song = await ytPlugin.searchSong(query);
      if (!song) return message.reply('❌ Sonuç bulunamadı.');
      const ytDlpPlugin = distube.plugins.find(p => p.type === 'playable-extractor');
      if (ytDlpPlugin) song.plugin = ytDlpPlugin;
      message.channel.send({ flags: 32768, components: [Container([T(`✅ **${song.name}** bulundu, oynatılıyor...`)])] });
      await distube.play(voice, song, { textChannel: message.channel, member: message.member });
    } catch (e) {
      message.reply(`❌ Çalma hatası: ${(e?.message || e || 'bilinmeyen hata').slice(0, 300)}`);
    }
  }},
  skip: { execute: async (message, args, client) => {
    const distube = getDistube(client);
    if (!distube) return message.reply(noDistube());
    const queue = distube.getQueue(message);
    if (!queue) return message.reply('❌ Çalan şarkı yok.');
    await queue.skip();
    message.reply('⏭️ Şarkı geçildi.');
  }},
  durdur: { execute: async (message, args, client) => {
    const distube = getDistube(client);
    if (!distube) return message.reply(noDistube());
    const queue = distube.getQueue(message);
    if (!queue) return message.reply('❌ Çalan şarkı yok.');
    await queue.stop();
    message.reply('⏹️ Müzik durduruldu ve kanaldan çıkıldı.');
  }},
  sıra: { execute: async (message, args, client) => {
    const distube = getDistube(client);
    if (!distube) return message.reply(noDistube());
    const queue = distube.getQueue(message);
    if (!queue) return message.reply('❌ Sırada şarkı yok.');
    const songs = queue.songs.slice(0, 15).map((s, i) => `**${i + 1}.** ${s.name} — \`${s.formattedDuration}\``).join('\n');
    message.channel.send({ flags: 32768, components: [Container([T(`📜 **Şarkı Sırası**\n${songs}`)])] });
  }},
  ses: { execute: async (message, args, client) => {
    const distube = getDistube(client);
    if (!distube) return message.reply(noDistube());
    const queue = distube.getQueue(message);
    if (!queue) return message.reply('❌ Çalan şarkı yok.');
    const vol = parseInt(args[0]);
    if (isNaN(vol) || vol < 1 || vol > 100) return message.reply('❌ Ses seviyesi 1-100 arası olmalı.');
    queue.setVolume(vol);
    message.reply(`🔊 Ses seviyesi **%${vol}** olarak ayarlandı.`);
  }},
  şarkı: { execute: async (message, args, client) => {
    const distube = getDistube(client);
    if (!distube) return message.reply(noDistube());
    const queue = distube.getQueue(message);
    if (!queue) return message.reply('❌ Çalan şarkı yok.');
    const s = queue.songs[0];
    message.channel.send({ flags: 32768, components: [Container([T(`🎵 **Şu Anda Çalıyor**\n**${s.name}** — \`${s.formattedDuration}\`\n👤 İsteyen: ${s.user}\n🔊 Ses: ${queue.volume}%\n⏳ Süre: ${queue.formattedCurrentTime} / ${s.formattedDuration}`)])] });
  }},
  karıştır: { execute: async (message, args, client) => {
    const distube = getDistube(client);
    if (!distube) return message.reply(noDistube());
    const queue = distube.getQueue(message);
    if (!queue) return message.reply('❌ Çalan şarkı yok.');
    await queue.shuffle();
    message.reply('🔀 Sıra karıştırıldı!');
  }},
  döngü: { execute: async (message, args, client) => {
    const distube = getDistube(client);
    if (!distube) return message.reply(noDistube());
    const queue = distube.getQueue(message);
    if (!queue) return message.reply('❌ Çalan şarkı yok.');
    const mode = queue.toggleAutoplay();
    message.reply(mode ? '🔁 Otomatik oynatma açıldı.' : '➡️ Otomatik oynatma kapatıldı.');
  }},
};
