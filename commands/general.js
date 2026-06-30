const { MessageFlags } = require('discord.js');
const { T, Container, Thumb, Section } = require('../utils/componentsv2');
const db = require('../database/db');
const E = require('../config/emojis');

function sendEmbed(message, color, title, desc) {
  const lines = [];
  if (title) lines.push(`**${title}**\n\n`);
  lines.push(desc);
  lines.push('\n\n-# Infermus League');
  message.channel.send({ components: [Container([T(lines.join(''))])], flags: MessageFlags.IsComponentsV2 });
}

module.exports = {
  ping: {
    execute(message) {
      const ping = Date.now() - message.createdTimestamp;
      message.channel.send(`🏓 Pong! \`${ping}ms\``);
    }
  },
  timecheck: {
    async execute(message) {
      const msg = await message.channel.send('Ölçülüyor...');
      const apiPing = Math.round(message.client.ws.ping);
      const mesajPing = msg.createdTimestamp - message.createdTimestamp;
      msg.edit({ components: [Container([T(`**⏱ Zaman Kontrolü**\n\n**İşlem Süresi** — ${mesajPing}ms\n**API Gecikme** — ${apiPing}ms\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  afk: {
    execute(message, args) {
      const reason = args.join(' ') || 'Belirtilmedi';
      message.channel.send({ components: [Container([T(`**🌙 AFK**\n\n${message.author} AFK moduna geçti.\n**Sebep:** ${reason}\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  avatar: {
    execute(message) {
      const user = message.mentions.users.first() || message.author;
      message.channel.send({ components: [Container([T(`**${user.username} - Avatar**\n\n${user.displayAvatarURL({ dynamic: true, size: 1024 })}\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  banner: {
    async execute(message) {
      const user = message.mentions.users.first() || message.author;
      const fetched = await message.client.users.fetch(user.id, { force: true });
      const banner = fetched.bannerURL({ dynamic: true, size: 1024 });
      if (!banner) return message.reply(`${user.username} kullanıcısının bannerı bulunmuyor.`);
      message.channel.send({ components: [Container([T(`**${user.username} - Banner**\n\n${banner}\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  dcprofil: {
    async execute(message) {
      const user = message.mentions.users.first() || message.author;
      const member = message.guild?.members.cache.get(user.id);
      const lines = [
        `**Kullanıcı ID** — ${user.id}`,
        `**Hesap Oluşturma** — <t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
        `**Bot mu?** — ${user.bot ? 'Evet' : 'Hayır'}`,
      ];
      if (member) {
        lines.push('');
        lines.push(`**Sunucu Katılma** — <t:${Math.floor(member.joinedTimestamp / 1000)}:R>`);
        lines.push(`**En Yüksek Rol** — ${member.roles.highest.name}`);
      }
      await message.channel.send({ components: [Container([Section([T(`**${user.tag} - Discord Profili**\n\n${lines.join('\n')}\n\n-# Infermus League`)], Thumb(user.displayAvatarURL({ dynamic: true })))])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  profil: {
    async execute(message) {
      const user = message.mentions.users.first() || message.author;
      const member = message.guild?.members.cache.get(user.id);
      await message.channel.send({ components: [Container([Section([T(`**${user.username} - Detaylı Profil**\n\n**👤 Kullanıcı** — ${user.tag}\n**🆔 ID** — ${user.id}\n**📅 Katılma** — ${member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Bilinmiyor'}`)], Thumb(user.displayAvatarURL({ dynamic: true })))])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  mc: {
    async execute(message) {
      if (!message.guild) return message.reply('Bu komut sadece sunucuda kullanılabilir.');
      const total = message.guild.memberCount;
      await message.channel.send({ components: [Container([Section([T(`**${message.guild.name} - Üye Sayıları**\n\n${E.CL_insan} **Toplam Üye** — ${total}\n\n-# Infermus League`)], Thumb(message.guild.iconURL({ size: 256 })))])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  davetler: {
    async execute(message) {
      const user = message.mentions.users.first() || message.author;
      const invites = db.get(`davetler.${message.guild.id}.${user.id}`, { total: 0, gercek: 0, sahte: 0, ayrilan: 0 });
      const all = db.get(`davetler.${message.guild.id}`, {});
      const entries = Object.entries(all).filter(([k]) => k !== 'sira').sort((a, b) => (b[1].gercek || 0) - (a[1].gercek || 0));
      const sira = entries.findIndex(([id]) => id === user.id) + 1;
      await message.channel.send({ components: [Container([Section([T(`**${E.CL_hediye} ${user.username} - Davet Bilgileri**\n\n**${E.CL_hediye} Toplam Davet** — ${invites.total}\n**${E.CL_yesiltik} Gercek** — ${invites.gercek}\n**${E.CL_carpi} Ayrilan** — ${invites.ayrilan}\n**${E.CL_kupa} Sunucu Sirasi** — #${sira || '—'}\n\n-# Infermus League`)], Thumb(user.displayAvatarURL()))])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  hesapla: {
    execute(message, args) {
      if (!args.length) return message.reply({ components: [Container([T(`${E.CL_uyari} Kullanım: \`.hesapla 2+2\`\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
      const expr = args.join(' ');
      try {
        const result = Function('"use strict"; return (' + expr + ')')();
        if (isNaN(result)) return message.reply({ components: [Container([T(`${E.CL_uyari} Geçersiz işlem!\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
        sendEmbed(message, 0x2B2D31, '📊 Hesaplama', `**${expr}** = **${result}**`);
      } catch { message.reply({ components: [Container([T(`${E.CL_uyari} Geçersiz işlem!\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 }); }
    }
  },
  ataturk: {
    execute(message) {
      message.channel.send({ components: [Container([T(`**🇹🇷 Mustafa Kemal Atatürk**\n\n"Beni görmek demek mutlaka yüzümü görmek demek değildir. Benim fikirlerimi, benim duygularımı anlıyorsanız ve hissediyorsanız bu yeterlidir."\n\n**1881 - 1938**\n\nhttps://upload.wikimedia.org/wikipedia/commons/a/a8/Ataturk.jpg\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  lanyardapi: {
    async execute(message, args) {
      const userId = args[0] || message.author.id;
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const data = await res.json();
        if (!data.success) return message.reply('Kullanıcı bulunamadı veya Lanyard aktif değil.');
        const d = data.data;
        message.channel.send({ components: [Container([T(`**Lanyard API - Presence Bilgisi**\n\n**Durum:** ${d.discord_status}\n**Aktiflik:** ${d.active_on_discord ? 'Evet' : 'Hayır'}\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
      } catch { message.reply('API hatası veya geçersiz ID.'); }
    }
  },
  ship: {
    async execute(message, args) {
      const members = message.guild?.members.cache.filter(m => !m.user.bot && m.id !== message.author.id).map(m => m.user);
      let user1, user2;
      const mentions = message.mentions.users;

      if (mentions.size === 0) {
        if (!members || members.length < 1) return message.reply({ components: [Container([T(`${E.CL_uyari} Sunucuda yeterli kullanici yok.\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
        user1 = message.author;
        user2 = members[Math.floor(Math.random() * members.length)];
      } else if (mentions.size === 1) {
        user1 = message.author;
        user2 = mentions.first();
      } else {
        const arr = [...mentions.values()];
        user1 = arr[0];
        user2 = arr[1];
      }

      if (user1.id === user2.id) return message.reply({ components: [Container([T(`${E.CL_uyari} Ayni kullaniciyi shipleyemezsin!\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });

      const random = Math.floor(Math.random() * 101);
      let createCanvas, loadImage;
      try { ({ createCanvas, loadImage } = require('@napi-rs/canvas')); } catch { return message.reply('Canvas kütüphanesi yüklü değil.'); }
      const canvas = createCanvas(800, 450);
      const ctx = canvas.getContext('2d');

      const bg = ctx.createRadialGradient(400, 225, 50, 400, 225, 450);
      bg.addColorStop(0, '#4a0000');
      bg.addColorStop(0.5, '#1a0000');
      bg.addColorStop(1, '#0a0000');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 800, 450);

      const vignette = ctx.createRadialGradient(400, 225, 100, 400, 225, 450);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, 800, 450);

      ctx.strokeStyle = 'rgba(255,150,150,0.12)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(8, 8, 784, 434);

      ctx.strokeStyle = 'rgba(255,150,150,0.06)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(12, 12, 776, 426);

      ctx.fillStyle = 'rgba(255,255,255,0.015)';
      for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 800, Math.random() * 450, Math.random() * 1.5 + 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 0.04;
      for (let i = 0; i < 12; i++) {
        const r = 80 + Math.random() * 150;
        const cx = Math.random() * 800;
        const cy = Math.random() * 450;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, '#ff6666');
        g.addColorStop(1, 'rgba(255,100,100,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      let heartColor, heartLabel;
      if (random <= 10) { heartColor = '#555555'; heartLabel = 'Kirik Kalp'; }
      else if (random <= 25) { heartColor = '#FFD700'; heartLabel = 'Hoslanma'; }
      else if (random <= 40) { heartColor = '#FF8C00'; heartLabel = 'Arkadas'; }
      else if (random <= 55) { heartColor = '#AAAAAA'; heartLabel = 'Bilemedim'; }
      else if (random <= 70) { heartColor = '#FF69B4'; heartLabel = 'Guzel'; }
      else if (random <= 85) { heartColor = '#FF2040'; heartLabel = 'Ask'; }
      else if (random <= 95) { heartColor = '#FF1493'; heartLabel = 'Tutku'; }
      else { heartColor = '#EE88FF'; heartLabel = 'Masum Ask'; }

      function drawHeart(cx, cy, s, color) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.35);
        ctx.bezierCurveTo(0, s * -0.3, -s * 0.65, s * -0.35, -s * 0.5, s * 0.15);
        ctx.bezierCurveTo(-s * 0.35, s * 0.55, 0, s * 0.7, 0, s * 0.7);
        ctx.bezierCurveTo(0, s * 0.7, s * 0.35, s * 0.55, s * 0.5, s * 0.15);
        ctx.bezierCurveTo(s * 0.65, s * -0.35, 0, s * -0.3, 0, s * 0.35);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      function drawYinYang(cx, cy, r) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -r * 0.5, r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, r * 0.5, r * 0.5, Math.PI, 0);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -r * 0.5, r * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, r * 0.5, r * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      const heartAlpha = 0.18;
      const heartSize = 14;
      for (let i = 0; i < 10; i++) {
        const t = i / 9;
        const y = 35 + t * 380;
        drawHeart(28, y, heartSize, `rgba(255,100,100,${heartAlpha})`);
        drawHeart(772, y, heartSize, `rgba(255,100,100,${heartAlpha})`);
      }
      for (let i = 0; i < 5; i++) {
        const t = i / 4;
        const y = 55 + t * 340;
        drawHeart(12, y, 10, `rgba(255,80,80,${heartAlpha * 0.7})`);
        drawHeart(788, y, 10, `rgba(255,80,80,${heartAlpha * 0.7})`);
      }
      for (let i = 0; i < 14; i++) {
        const t = i / 13;
        const x = 30 + t * 740;
        drawHeart(x, 16, 11, `rgba(255,100,100,${heartAlpha * 0.8})`);
        drawHeart(x, 434, 11, `rgba(255,100,100,${heartAlpha * 0.8})`);
      }
      for (let i = 0; i < 4; i++) {
        const t = i / 3;
        const x = 100 + t * 600;
        drawHeart(x, 5, 8, `rgba(255,80,80,${heartAlpha * 0.5})`);
        drawHeart(x, 445, 8, `rgba(255,80,80,${heartAlpha * 0.5})`);
      }

      const avSize = 220;
      const avY = 70;
      const leftX = Math.round((800 / 2 - 30) / 2 - avSize / 2);
      const rightX = 800 - leftX - avSize;

      ctx.fillStyle = 'rgba(255,150,150,0.04)';
      ctx.font = '11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('✦', leftX + avSize / 2, avY - 8);
      ctx.fillText('✦', rightX + avSize / 2, avY - 8);

      try {
        const av1 = await loadImage(user1.displayAvatarURL({ extension: 'png', size: 256 }));
        ctx.save();
        ctx.shadowColor = heartColor;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = heartColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(leftX, avY, avSize, avSize);
        ctx.shadowBlur = 0;
        ctx.drawImage(av1, leftX, avY, avSize, avSize);
        ctx.strokeStyle = `rgba(255,255,255,0.06)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(leftX + 4, avY + 4, avSize - 8, avSize - 8);
        ctx.restore();

        const av2 = await loadImage(user2.displayAvatarURL({ extension: 'png', size: 256 }));
        ctx.save();
        ctx.shadowColor = heartColor;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = heartColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(rightX, avY, avSize, avSize);
        ctx.shadowBlur = 0;
        ctx.drawImage(av2, rightX, avY, avSize, avSize);
        ctx.strokeStyle = `rgba(255,255,255,0.06)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(rightX + 4, avY + 4, avSize - 8, avSize - 8);
        ctx.restore();
      } catch {}

      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 17px Arial';
      ctx.fillText(user1.username.substring(0, 14), leftX + avSize / 2, avY + avSize + 28);
      ctx.fillText(user2.username.substring(0, 14), rightX + avSize / 2, avY + avSize + 28);
      ctx.shadowBlur = 0;

      ctx.strokeStyle = 'rgba(255,150,150,0.06)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(leftX + 10, avY + avSize + 38);
      ctx.lineTo(leftX + avSize - 10, avY + avSize + 38);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(rightX + 10, avY + avSize + 38);
      ctx.lineTo(rightX + avSize - 10, avY + avSize + 38);
      ctx.stroke();

      const barX = 386, barW = 28, barY = 85, barH = 230;
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 6);
      ctx.fill();

      const fillH = Math.max(2, Math.round(((barH - 2) * random) / 100));
      const g2 = ctx.createLinearGradient(barX, barY + barH, barX, barY);
      g2.addColorStop(0, heartColor);
      g2.addColorStop(1, '#FFFFFF');
      ctx.shadowColor = heartColor;
      ctx.shadowBlur = 10;
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.roundRect(barX + 1, barY + barH - fillH - 1, barW - 2, fillH, 4);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.font = '9px Arial';
      ctx.fillText('0%', 400, barY + barH + 16);
      ctx.fillText('50%', 400, barY + barH / 2 + 3);
      ctx.fillText('100%', 400, barY - 5);

      ctx.fillStyle = `rgba(255,100,100,0.04)`;
      ctx.font = '8px Arial';
      ctx.fillText('✦', 400, barY - 10);
      ctx.fillText('✦', 400, barY + barH + 24);

      drawYinYang(400, 55, 20);

      ctx.shadowColor = heartColor;
      ctx.shadowBlur = 25;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px Arial';
      ctx.fillText(`${random}%`, 400, 403);
      ctx.shadowBlur = 0;

      ctx.fillStyle = `rgba(255,255,255,0.03)`;
      ctx.font = 'bold 38px Arial';
      ctx.fillText(`${random}%`, 401, 405);

      ctx.fillStyle = heartColor;
      ctx.font = 'bold 17px Arial';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 4;
      ctx.fillText(heartLabel, 400, 428);
      ctx.shadowBlur = 0;

      ctx.strokeStyle = 'rgba(255,150,150,0.04)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(340, 437);
      ctx.lineTo(460, 437);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.font = '9px Arial';
      ctx.fillText('Infermus League', 400, 444);

      const buf = canvas.toBuffer('image/png');
      message.channel.send({ files: [{ attachment: buf, name: 'ship.png' }] });
    }
  },
  snipe: {
    execute(message) {
      const snipeData = db.get(`snipe.${message.guild?.id}.${message.channel.id}`);
      if (!snipeData || !snipeData.content) {
        return sendEmbed(message, 0x2B2D31, '👀 Snipe', 'Bu kanalda silinen mesaj bulunmuyor.');
      }
      message.channel.send({ components: [Container([T(`${snipeData.author}\n\n${snipeData.content}\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  snipeall: {
    execute(message) {
      const snipes = db.get(`snipe.${message.guild?.id}`, []);
      if (!snipes.length) return message.reply('Silinen mesaj bulunmuyor.');
      message.channel.send({ components: [Container([T(`**🗑️ Son Silinen Mesajlar**\n\n${snipes.slice(-5).reverse().map((s, i) => `**${i + 1}.** ${s.author} — \`${s.content.slice(0, 100)}\``).join('\n')}\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  snipetoggle: {
    execute(message) {
      const current = db.get(`snipetoggle.${message.guild?.id}.${message.channel.id}`, true);
      db.set(`snipetoggle.${message.guild?.id}.${message.channel.id}`, !current);
      sendEmbed(message, 0x2B2D31, '🔁 Snipe Ayarı', `${message.author}: Snipe **${!current ? 'açıldı' : 'kapatıldı'}**.`);
    }
  },
  sunucu: {
    async execute(message) {
      const g = message.guild;
      await g?.members.fetch();
      const channels = g?.channels.cache;
      const roles = g?.roles.cache;
      const online = g?.members.cache.filter(m => m.presence?.status === 'online' || m.presence?.status === 'idle' || m.presence?.status === 'dnd').size || 0;
      const fieldsText = [
        `**${E.CL_hedef} ID:** \`${g?.id}\``,
        `**${E.CL_kupa} Sahip:** <@${g?.ownerId}>`,
        `**${E.CL_kalkan} Olusturulma:** <t:${Math.floor(g?.createdTimestamp / 1000)}:D>`,
        `**👥 Uyeler:** Toplam: **${g?.memberCount}** | Cevrimici: **${online}**`,
        `**📁 Kanallar:** Text: **${channels?.filter(c => c.type === 0).size}** | Ses: **${channels?.filter(c => c.type === 2).size}**`,
        `**🎭 Roller:** **${roles?.filter(r => r.name !== '@everyone').size}** rol`,
        `**🚀 Boost:** Seviye **${g?.premiumTier}** (${g?.premiumSubscriptionCount || 0} boost)`,
        `**🌍 Bolge:** ${g?.preferredLocale || 'Belirtilmemis'}`,
      ].join('\n');
      message.channel.send({ components: [Container([Section([T(`**${E.CL_pano} ${g?.name}**\n\n${fieldsText}\n\n-# Infermus League`)], Thumb(g?.iconURL()))])], flags: MessageFlags.IsComponentsV2 });
    }
  }
};
