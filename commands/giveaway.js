const db = require('../database/db');
const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

module.exports = {
  çekiliş: {
    async execute(message, args) {
      if (!message.member.permissions.has('Administrator') && !message.member.permissions.has('ManageMessages')) {
        return message.reply('❌ Bu komutu kullanmak için mesajları yönetme yetkin olmalı!');
      }
      const parts = args.join(' ').match(/^(\d+)\s*([dsgh])\s+(.+?)(?:\s+(\d+))?$/);
      if (!parts) return message.reply('Kullanım: `.çekiliş <süre><d/s/g/h> <ödül> <kazanan>`\nÖrnek: \`.çekiliş 10d 100M€ Değer 2\`\n\`d\`=dakika \`s\`=saat \`g\`=gün \`h\`=hafta');
      const amount = parseInt(parts[1]);
      const unit = parts[2];
      const prize = parts[3].trim();
      const winnerCount = parseInt(parts[4]) || 1;
      const multipliers = { d: 1, s: 60, g: 1440, h: 10080 };
      const duration = amount * multipliers[unit];
      const unitNames = { d: 'dakika', s: 'saat', g: 'gün', h: 'hafta' };
      if (duration < 1) return message.reply('Süre en az 1 dakika olmalı!');
      if (winnerCount < 1 || winnerCount > 10) return message.reply('Kazanan sayısı 1-10 arası olmalı!');
      const displayTime = `${amount} ${unitNames[unit]}`;

      const endTime = Date.now() + duration * 60 * 1000;
      const reactionEmoji = '🎁';

      const msg = await message.channel.send({
        flags: 32768,
        components: [Container([
          T(`${E.CL_hediye} **ÇEKİLİŞ** ${E.CL_hediye}\n\n━━━━━━━━━━━━━━━━━━━━\n**${E.CL_hediye} ÖDÜL**\n**${prize}**\n\n**${E.CL_kupa} KAZANAN SAYISI:** \`${winnerCount}\`\n\n**⏰ ${displayTime.toUpperCase()}**\nBitiş: <t:${Math.floor(endTime / 1000)}:R>\n━━━━━━━━━━━━━━━━━━━━\n**${E.CL_hedef} Nasıl Katılırım?**\nBu mesaja **${reactionEmoji}** tepkisi bırakarak katıl!\n\n-# Infermus League`)
        ])]
      });

      await msg.react(reactionEmoji);

      let currentEntrants = [message.author.id];
      db.set(`cekiliş.${msg.id}`, {
        channelId: message.channel.id,
        prize,
        endTime,
        hostId: message.author.id,
        winnerCount,
        entrants: currentEntrants,
        ended: false
      });

      const filter = (reaction, user) => reaction.emoji.name === reactionEmoji && !user.bot && reaction.message.id === msg.id;
      const collector = msg.createReactionCollector({ filter, time: duration * 60 * 1000 });

      collector.on('collect', (reaction, user) => {
        const data = db.get(`cekiliş.${msg.id}`);
        if (!data || data.ended) return;
        if (currentEntrants.includes(user.id)) return;
        currentEntrants.push(user.id);
        data.entrants = currentEntrants;
        db.set(`cekiliş.${msg.id}`, data);
        const lines = msg.components[0].components[0].content.split('\n');
        lines.splice(lines.length - 2, 0, `**👥 Katılımcı:** \`${currentEntrants.length}\``);
        msg.edit({ components: [Container([T(lines.join('\n'))])] }).catch(() => {});
      });

      let ended = false;
      collector.on('end', () => {
        if (ended) return;
        ended = true;
        const data = db.get(`cekiliş.${msg.id}`);
        if (!data || data.ended) return;
        data.ended = true;
        db.set(`cekiliş.${msg.id}`, data);

        if (currentEntrants.length < winnerCount) {
          return msg.edit({ components: [Container([
            T(`❌ **ÇEKİLİŞ İPTAL**\n\nYeterli katılımcı olmadığı için çekiliş iptal edildi.\n\n-# Infermus League`)
          ])] }).catch(() => {});
        }

        const shuffled = [...currentEntrants].sort(() => Math.random() - 0.5);
        const winners = shuffled.slice(0, winnerCount).map(id => message.client.users.cache.get(id) || id);
        const wList = winners.map((w, i) => `**${i + 1}.** ${w}`).join('\n');

        msg.edit({ components: [Container([
          T(`${E.CL_kupa} **ÇEKİLİŞ SONUÇLANDI!** ${E.CL_kupa}\n\n━━━━━━━━━━━━━━━━━━━━\n**${E.CL_hediye} ÖDÜL**\n**${prize}**\n\n**${E.CL_kupa} KAZANANLAR (${winners.length})**\n${wList}\n\n**👥 Katılımcı Sayısı:** \`${currentEntrants.length}\`\n━━━━━━━━━━━━━━━━━━━━\n\n-# Infermus League`)
        ])] }).catch(() => {});
        msg.reactions.removeAll().catch(() => {});
        message.channel.send({ flags: 32768, content: `${E.CL_hediye} **Tebrikler ${winners.join(', ')}!** \`${prize}\` kazandınız! ${E.CL_hediye}` }).catch(() => {});
      });
    }
  }
};
