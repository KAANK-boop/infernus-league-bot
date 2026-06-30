const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
try { require('dotenv').config(); } catch {}
const config = require('./config.json');
const E = require('./config/emojis');
const { T, Sep, Container, Section, Thumb } = require('./utils/componentsv2');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildInvites,
  ]
});

const inviteCache = new Map();
const kayitMesajCache = require('./utils/kayitCache');

client.commands = new Collection();
const channelMsgCount = new Map();

const commandModules = [
  require('./commands/value'),
  require('./commands/economy'),
  require('./commands/squad'),
  require('./commands/match'),
  require('./commands/training'),
  require('./commands/stats'),
  require('./commands/speaker'),
  require('./commands/kap'),
  require('./commands/ara'),
  require('./commands/roll'),
  require('./commands/yardim'),
  require('./commands/general'),
  require('./commands/moderation'),
  require('./commands/management'),
  require('./commands/roles'),
  require('./commands/utility'),
  require('./commands/kayit'),
  require('./commands/kayitsizdm'),
  require('./commands/games'),
  require('./commands/degerrehberi'),
  require('./commands/giveaway'),
  require('./commands/rpg'),
  require('./commands/kaccm'),
  require('./commands/koruma'),
  require('./commands/random'),
  require('./commands/rolata'),
  require('./commands/kapkanal'),
  require('./commands/dm'),
  require('./commands/emojiid'),
  require('./commands/kadro'),
  require('./commands/tournament'),
  require('./commands/premium'),
  require('./commands/extra'),
  require('./commands/minimarket'),
  require('./commands/public'),
  require('./commands/ucakbileti'),
  require('./commands/futbol'),
  require('./commands/muzik'),
  require('./commands/useful'),
  require('./commands/afk'),
];

for (const mod of commandModules) {
  for (const [name, cmd] of Object.entries(mod)) {
    if (typeof cmd === 'function') continue;
    if (!cmd?.execute) continue;
    client.commands.set(name, cmd);
  }
}

const { sendTrivia } = require('./commands/extra');

const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot aktif!');
});
const PORT = process.env.PORT || 3000;
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} kullanımda, keep-alive sunucusu atlandı.`);
  } else {
    console.error('HTTP sunucu hatası:', err.message);
  }
});
server.listen(PORT, () => {
  console.log(`Keep-alive sunucusu port ${PORT} üzerinde çalışıyor.`);
});

setInterval(() => {
  const https = require('https');
  const railwayUrl = process.env.RAILWAY_PUBLIC_DOMAIN;
  if (railwayUrl) {
    https.get(`https://${railwayUrl}`, (res) => {
      console.log('Keep-alive ping başarılı:', res.statusCode);
    }).on('error', (err) => {
      console.error('Keep-alive ping hatası:', err.message);
    });
  }
}, 5 * 60 * 1000);

client.on('clientReady', () => {
  console.log(`${client.user.tag} olarak giriş yapıldı! ${client.guilds.cache.size} sunucuda, ${client.commands.size} komut yüklü.`);
  client.user.setPresence({
    activities: [{ name: '.yardım | Infermus League', type: 1, url: 'https://www.twitch.tv/infernusleague' }],
    status: 'online'
  });
});

client.on('interactionCreate', async (interaction) => {
  try {
  if (!interaction.isButton() && !interaction.isModalSubmit() && !interaction.isStringSelectMenu()) return;

  // EV/ARAC handlers — en üstte yakala
  if (interaction.customId.startsWith('ev_buy_') || interaction.customId.startsWith('ev_catalog_page_') || interaction.customId.startsWith('arac_buy_') || interaction.customId.startsWith('arac_catalog_page_') || interaction.customId.startsWith('ev_info_page_') || interaction.customId.startsWith('arac_info_page_') || interaction.customId.startsWith('evsat_') || interaction.customId.startsWith('aracsat_') || interaction.customId === 'ev_iptal' || interaction.customId === 'arac_iptal') {
    const utility = require('./commands/utility');
    const db = require('./database/db');
    if (interaction.customId.startsWith('ev_buy_')) {
      const houseId = parseInt(interaction.customId.replace('ev_buy_', ''));
      const secim = utility.evTypes[houseId];
      if (!secim) return interaction.reply({ content: 'Gecersiz secenek.', ephemeral: true });
      const userId = interaction.user.id;
      const userData = db.get(`users.${userId}`) || {};
      const balance = userData.balance || 0;
      const member = interaction.guild.members.cache.get(userId);
      const oyuncuAdi = userData.name || member?.displayName || interaction.user.username;
      const mevcut = db.get(`evler.${interaction.guild.id}.${userId}`, []);
      if (mevcut.length > 0) return interaction.reply({ content: 'Zaten bir evin bulunuyor!', ephemeral: true });
      if (balance < secim.fiyat) return interaction.reply({ content: `Yetersiz bakiye! **${secim.fiyat.toLocaleString()} coin** gerekiyor, bakiyen: **${balance.toLocaleString()} coin**`, ephemeral: true });
      userData.balance = balance - secim.fiyat;
      db.set(`users.${userId}`, userData);
      const liste = db.get(`evler.${interaction.guild.id}.${userId}`, []);
      liste.push({ isim: secim.ad, fiyat: secim.fiyat, tarih: new Date().toISOString() });
      db.set(`evler.${interaction.guild.id}.${userId}`, liste);
      const kayitConfig = db.get(`kayit.${interaction.guild.id}`);
      const kayitsizRolId = kayitConfig?.kayitsizRol;
      const permOverwrites = [{ id: interaction.guild.roles.everyone, allow: ['ViewChannel'] }, { id: userId, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] }, { id: interaction.client.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] }];
      if (kayitsizRolId) permOverwrites.push({ id: kayitsizRolId, deny: ['ViewChannel'] });
      const kategori = interaction.guild.channels.cache.find(c => c.type === 4 && (c.name.toLowerCase().includes('evler') || c.name.includes('EVLER')));
      try {
        const kanal = await interaction.guild.channels.create({ name: `${secim.emoji}・${oyuncuAdi}-${secim.ad}`, parent: kategori?.id, permissionOverwrites: permOverwrites });
        await interaction.reply({ content: `${secim.emoji} **${secim.ad}** satin alindi! Ozel kanalin: ${kanal}`, ephemeral: true });
      } catch { await interaction.reply({ content: `${secim.emoji} **${secim.ad}** satin alindi! Kanal olusturulamadi ama kaydedildi.`, ephemeral: true }); }
      return;
    }
    if (interaction.customId.startsWith('ev_catalog_page_')) {
      const embed = utility.buildEvCatalogEmbed(parseInt(interaction.customId.replace('ev_catalog_page_', '')), interaction.user);
      const rows = utility.buildEvCatalogRow(parseInt(interaction.customId.replace('ev_catalog_page_', '')));
      await interaction.deferUpdate();
      await interaction.message.edit({ embeds: [embed], components: rows });
      return;
    }
    if (interaction.customId.startsWith('ev_info_page_')) {
      const embed = utility.buildEvCatalogEmbed(parseInt(interaction.customId.replace('ev_info_page_', '')), interaction.user);
      const rows = utility.buildEvInfoRow(parseInt(interaction.customId.replace('ev_info_page_', '')));
      await interaction.deferUpdate();
      await interaction.message.edit({ embeds: [embed], components: rows });
      return;
    }
    if (interaction.customId.startsWith('arac_buy_')) {
      const vehicleId = parseInt(interaction.customId.replace('arac_buy_', ''));
      const vehicle = utility.allVehicles[vehicleId];
      if (!vehicle) return interaction.reply({ content: 'Gecersiz arac.', ephemeral: true });
      const userId = interaction.user.id;
      const userData = db.get(`users.${userId}`) || {};
      const balance = userData.balance || 0;
      const member = interaction.guild.members.cache.get(userId);
      const oyuncuAdi = userData.name || member?.displayName || interaction.user.username;
      const mevcut = db.get(`araclar.${interaction.guild.id}.${userId}`, []);
      if (mevcut.length >= 3) return interaction.reply({ content: 'En fazla **3 arac** sahibi olabilirsin!', ephemeral: true });
      if (balance < vehicle.fiyat) return interaction.reply({ content: `Yetersiz bakiye! **${vehicle.fiyat.toLocaleString()} coin** gerekiyor, bakiyen: **${balance.toLocaleString()} coin**`, ephemeral: true });
      userData.balance = balance - vehicle.fiyat;
      db.set(`users.${userId}`, userData);
      const liste = db.get(`araclar.${interaction.guild.id}.${userId}`, []);
      liste.push({ tip: vehicle.type, model: vehicle.model, fiyat: vehicle.fiyat, tarih: new Date().toISOString() });
      db.set(`araclar.${interaction.guild.id}.${userId}`, liste);
      const kayitConfig = db.get(`kayit.${interaction.guild.id}`);
      const kayitsizRolId = kayitConfig?.kayitsizRol;
      const permOverwrites = [{ id: interaction.guild.roles.everyone, allow: ['ViewChannel'] }, { id: userId, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] }, { id: interaction.client.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] }];
      if (kayitsizRolId) permOverwrites.push({ id: kayitsizRolId, deny: ['ViewChannel'] });
      const kategori = interaction.guild.channels.cache.find(c => c.type === 4 && (c.name.toLowerCase().includes('araba') || c.name.toLowerCase().includes('arac') || c.name === 'ARABA'));
      try {
        const kanal = await interaction.guild.channels.create({ name: `${vehicle.emoji}・${oyuncuAdi}-${vehicle.model.replace(/ /g, '-')}`, parent: kategori?.id, permissionOverwrites: permOverwrites });
        await interaction.reply({ content: `${vehicle.emoji} **${vehicle.model}** satin alindi! Ozel kanalin: ${kanal}`, ephemeral: true });
      } catch { await interaction.reply({ content: `${vehicle.emoji} **${vehicle.model}** satin alindi! Kanal olusturulamadi ama kaydedildi.`, ephemeral: true }); }
      return;
    }
    if (interaction.customId.startsWith('arac_catalog_page_')) {
      const embed = utility.buildVehicleCatalogEmbed(parseInt(interaction.customId.replace('arac_catalog_page_', '')), interaction.user);
      const rows = utility.buildVehicleCatalogRow(parseInt(interaction.customId.replace('arac_catalog_page_', '')));
      await interaction.deferUpdate();
      await interaction.message.edit({ embeds: [embed], components: rows });
      return;
    }
    if (interaction.customId.startsWith('arac_info_page_')) {
      const embed = utility.buildVehicleCatalogEmbed(parseInt(interaction.customId.replace('arac_info_page_', '')), interaction.user);
      const rows = utility.buildVehicleInfoRow(parseInt(interaction.customId.replace('arac_info_page_', '')));
      await interaction.deferUpdate();
      await interaction.message.edit({ embeds: [embed], components: rows });
      return;
    }
    if (interaction.customId.startsWith('evsat_')) {
      const userId = interaction.user.id;
      const userData = db.get(`users.${userId}`) || {};
      const parts = interaction.customId.split('_');
      const ownerId = parts[1];
      const idx = parseInt(parts[2]);
      if (ownerId !== userId) return interaction.reply({ content: 'Bu sana ait bir islem degil!', ephemeral: true });
      const evler = db.get(`evler.${interaction.guild.id}.${userId}`, []);
      if (!evler[idx]) return interaction.reply({ content: 'Mulk bulunamadi.', ephemeral: true });
      const satilan = evler.splice(idx, 1)[0];
      db.set(`evler.${interaction.guild.id}.${userId}`, evler);
      userData.balance = (userData.balance || 0) + Math.floor(satilan.fiyat / 2);
      db.set(`users.${userId}`, userData);
      const member = interaction.guild.members.cache.get(userId);
      const oyuncuAdi = userData.name || member?.displayName || interaction.user.username;
      const emoji = '🏠';
      const kanal = interaction.guild.channels.cache.find(c => c.name.includes(oyuncuAdi) && c.name.includes('🏠'));
      if (kanal) await kanal.delete().catch(() => {});
      await interaction.reply({ content: `${satilan.isim} satildi! **${Math.floor(satilan.fiyat / 2).toLocaleString()} coin** kazandin.`, ephemeral: true });
      return;
    }
    if (interaction.customId.startsWith('aracsat_')) {
      const userId = interaction.user.id;
      const userData = db.get(`users.${userId}`) || {};
      const parts = interaction.customId.split('_');
      const ownerId = parts[1];
      const idx = parseInt(parts[2]);
      if (ownerId !== userId) return interaction.reply({ content: 'Bu sana ait bir islem degil!', ephemeral: true });
      const araclar = db.get(`araclar.${interaction.guild.id}.${userId}`, []);
      if (!araclar[idx]) return interaction.reply({ content: 'Arac bulunamadi.', ephemeral: true });
      const satilan = araclar.splice(idx, 1)[0];
      db.set(`araclar.${interaction.guild.id}.${userId}`, araclar);
      userData.balance = (userData.balance || 0) + Math.floor(satilan.fiyat / 2);
      db.set(`users.${userId}`, userData);
      const member = interaction.guild.members.cache.get(userId);
      const oyuncuAdi = userData.name || member?.displayName || interaction.user.username;
      const emoji = '🚗';
      const kanal = interaction.guild.channels.cache.find(c => c.name.includes(oyuncuAdi) && c.name.includes(satilan.model.replace(/ /g, '-')) || c.name.includes(satilan.model));
      if (kanal) await kanal.delete().catch(() => {});
      await interaction.reply({ content: `${emoji} **${satilan.model}** satildi! **${Math.floor(satilan.fiyat / 2).toLocaleString()} coin** kazandin.`, ephemeral: true });
      return;
    }
    if (interaction.customId === 'ev_iptal' || interaction.customId === 'arac_iptal') {
      await interaction.deferUpdate();
      await interaction.message.delete().catch(() => {});
      return;
    }
  }

  const db = require('./database/db');

  if (interaction.isButton()) {
    if (interaction.customId === 'spiker_basvuru') {
      const modal = { title: 'Spiker Başvurusu', custom_id: 'spiker_modal', components: [{ type: 1, components: [{ type: 4, custom_id: 'spiker_neden', label: 'Neden spiker olmak istiyorsunuz?', style: 2, required: true, min_length: 10, max_length: 500 }] }] };
      await interaction.showModal(modal);
      return;
    }

    if (interaction.customId === 'yetkili_basvuru') {
      const modal = {
        title: 'Yetkili Başvurusu',
        custom_id: 'yetkili_modal',
        components: [
          { type: 1, components: [{ type: 4, custom_id: 'yetkili_ad', label: 'Adınız?', style: 1, required: true, min_length: 2, max_length: 50 }] },
          { type: 1, components: [{ type: 4, custom_id: 'yetkili_yas', label: 'Yaşınız?', style: 1, required: true, min_length: 1, max_length: 3 }] },
          { type: 1, components: [{ type: 4, custom_id: 'yetkili_yer', label: 'Nerede Yaşıyorsunuz?', style: 1, required: true, min_length: 3, max_length: 100 }] },
          { type: 1, components: [{ type: 4, custom_id: 'yetkili_mikrofon', label: 'Mikrofon Açabiliyor musunuz?', style: 2, required: true, min_length: 3, max_length: 200 }] },
          { type: 1, components: [{ type: 4, custom_id: 'yetkili_neden', label: 'Neden Başvurmak İstiyorsunuz?', style: 2, required: true, min_length: 10, max_length: 500 }] }
        ]
      };
      await interaction.showModal(modal);
      return;
    }

    if (interaction.customId === 'admin_dogrula') {
      if (!interaction.member.permissions.has('Administrator')) return interaction.reply({ content: 'Yetkiniz yok!', ephemeral: true });
      await interaction.reply({ content: '✅ Admin doğrulaması başarılı!', ephemeral: true });
      return;
    }

    if (interaction.customId === 'ticket_olustur') {
      const existing = interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.username.toLowerCase()}` && c.type === 0);
      if (existing) return interaction.reply({ content: `Zaten açık bir ticket'ın var: ${existing}`, ephemeral: true });
      const ticketChannel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username.toLowerCase()}`,
        type: 0,
        permissionOverwrites: [
          { id: interaction.guild.roles.everyone, deny: ['ViewChannel'] },
          { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles', 'EmbedLinks'] },
          { id: interaction.client.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
        ]
      });
      const ticketId = Math.random().toString(36).slice(2, 8).toUpperCase();
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('🎫 Yeni Ticket Oluşturuldu')
        .setDescription([
          `Merhaba ${interaction.user},`,
          '',
          `Ticket ID: **#${ticketId}**`,
          `Oluşturulma: <t:${Math.floor(Date.now() / 1000)}:F>`,
          '',
          '━━━━━━━━━━━━━━━━━━━━',
          '**📝 Lütfen aşağıdaki bilgileri belirtin:**',
          '• Talebinizin konusu nedir?',
          '• Detaylı açıklama yapın.',
          '• Varsa ekran görüntüsü ekleyin.',
          '',
          '**⏰ Bilgilendirme:**',
          '• Yetkililer en kısa sürede yanıtlayacaktır.',
          '• Ticketınızı kapatmak için aşağıdaki butonu kullanın.',
          '• Gereksiz mesaj yazmayın, sıranızı bekleyin.',
          '',
          '━━━━━━━━━━━━━━━━━━━━',
          '📢 Yetkililere seslenmek için @ yetkili rolünü etiketleyin.'
        ].join('\n'))
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('ticket_kapat').setLabel('Ticket Kapat').setStyle(ButtonStyle.Danger).setEmoji('🔒')
      );
      const ticketRolId = db.get(`ticketRol.${interaction.guild.id}`);
      const rolMention = ticketRolId ? `<@&${ticketRolId}>` : '';
      await ticketChannel.send({ content: `${interaction.user} ${rolMention}`, embeds: [embed], components: [row] });
      const logEmbed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('🎫 Ticket Açıldı')
        .setDescription(`**Kullanıcı:** ${interaction.user.tag} (${interaction.user})\n**Kanal:** ${ticketChannel}\n**ID:** #${ticketId}`)
        .setTimestamp();
      const logChannel = interaction.guild.channels.cache.find(c => c.name.includes('ticket-log'));
      if (logChannel) logChannel.send({ embeds: [logEmbed] }).catch(() => {});
      await interaction.reply({ content: `✅ Ticket oluşturuldu: ${ticketChannel}`, ephemeral: true });
      return;
    }

    if (interaction.customId === 'itiraf_gonder') {
      const modal = {
        title: 'İtiraf Gönder',
        custom_id: 'itiraf_modal',
        components: [{ type: 1, components: [{ type: 4, custom_id: 'itiraf_icerik', label: 'İtirafınız', style: 2, required: true, min_length: 5, max_length: 1000 }] }]
      };
      await interaction.showModal(modal);
      return;
    }

    if (interaction.customId === 'ticket_kapat') {
      if (!interaction.member.permissions.has('Administrator')) return interaction.reply({ content: 'Sadece yetkililer ticket kapatabilir.', ephemeral: true });
      await interaction.reply({ content: '🔒 Ticket 5 saniye sonra kapatılıyor...' });
      setTimeout(async () => {
        const channel = interaction.channel;
        const messages = await channel.messages.fetch({ limit: 100 }).catch(() => []);
        const msgCount = messages.size;
        const logEmbed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle('🔒 Ticket Kapatıldı')
          .setDescription([
            `**Kanal:** ${channel.name}`,
            `**Kapatan:** ${interaction.user.tag}`,
            `**Toplam Mesaj:** ${msgCount}`,
            `**Kapanış Tarihi:** <t:${Math.floor(Date.now() / 1000)}:F>`,
          ].join('\n'))
          .setTimestamp();
        const logChannel = interaction.guild.channels.cache.find(c => c.name.includes('ticket-log'));
        if (logChannel) logChannel.send({ embeds: [logEmbed] }).catch(() => {});
        await channel.delete().catch(() => {});
      }, 5000);
      return;
    }

    if (interaction.customId.startsWith('kayit_gecmisi_')) {
      const memberId = interaction.customId.replace('kayit_gecmisi_', '');
      const gecmis = db.get(`kayitGecmisi.${interaction.guild.id}.${memberId}`);
      if (!gecmis) {
        return interaction.reply({ content: 'Bu üyenin kayıt geçmişi bulunamadı.', ephemeral: true });
      }
      const kayitEden = await interaction.client.users.fetch(gecmis.kayitEden).catch(() => null);
      return interaction.reply({ flags: MessageFlags.IsComponentsV2, ephemeral: true, components: [Container([T(`${E.CL_pano} **Kayit Gecmisi**\n\n${E.CL_sag_ok} **Isim:** ${gecmis.name || 'Belirtilmemis'}\n${E.CL_sag_ok} **Rol:** ${gecmis.role || 'Belirtilmemis'}\n${E.CL_sag_ok} **Kaydeden:** ${kayitEden ? kayitEden.tag : 'Bilinmiyor'}\n${E.CL_sag_ok} **Tarih:** <t:${Math.floor(new Date(gecmis.timestamp).getTime() / 1000)}:F>\n\nInfermus League`)])] });
    }

    if (interaction.customId.startsWith('k_uye_') || interaction.customId.startsWith('k_futbolcu_') || interaction.customId.startsWith('k_teknik_') || interaction.customId.startsWith('k_baskan_')) {
      if (!interaction.member.permissions.has('ManageRoles')) return interaction.reply({ content: 'Yetkiniz yok!', ephemeral: true });
      const parts = interaction.customId.split('_');
      const kategori = parts[1];
      const memberId = parts.slice(2).join('_');
      const hedef = interaction.guild.members.cache.get(memberId);
      if (!hedef) return interaction.reply({ content: 'Uye bulunamadi.', ephemeral: true });
      if (hedef.roles.cache.has(interaction.guild.roles.cache.get(db.get(`kayit.${interaction.guild.id}`)?.kayitliRol)?.id)) return interaction.reply({ content: 'Bu uye zaten kayitli.', ephemeral: true });

      const config = db.get(`kayit.${interaction.guild.id}`);
      if (!config) return interaction.reply({ content: 'Kayit sistemi kurulmamis.', ephemeral: true });
      const kayitliRol = interaction.guild.roles.cache.get(config.kayitliRol);
      if (!kayitliRol) return interaction.reply({ content: 'Kayitli rolu bulunamadi.', ephemeral: true });

      await interaction.deferReply({ ephemeral: true });

      try {
        const kayitsizRol = interaction.guild.roles.cache.get(config.kayitsizRol);
        if (kayitsizRol && hedef.roles.cache.has(kayitsizRol.id)) await hedef.roles.remove(kayitsizRol);
        await hedef.roles.add(kayitliRol);

        if (kategori !== 'uye') {
          const roller = db.get(`roller.${interaction.guild.id}`, {});
          const rolMap = { futbolcu: roller.futbolcu, teknik: roller.teknik, baskan: roller.baskan };
          const rolId = rolMap[kategori];
          if (rolId) {
            const ekRol = interaction.guild.roles.cache.get(rolId);
            if (ekRol) await hedef.roles.add(ekRol);
          }
        }
      } catch (e) {
        return interaction.editReply({ content: 'Rol islemi basarisiz: ' + e.message });
      }

      const kategoriAdi = ({ uye: 'Uye', futbolcu: 'Futbolcu', teknik: 'Teknik Direktor', baskan: 'Baskan' })[kategori] || kategori;
      db.set(`kayitGecmisi.${interaction.guild.id}.${hedef.id}`, { name: hedef.displayName || 'Isimsiz', role: kategoriAdi, kayitEden: interaction.user.id, timestamp: new Date().toISOString() });
      db.add(`kayitSayac.${interaction.guild.id}.${interaction.user.id}`, 1);

      const hosAyar = db.get(`hosgeldin.${interaction.guild.id}`);
      let hgId = hosAyar?.kanal || config.hosgeldinKanal;
      if (hgId) {
        const hgK = interaction.guild.channels.cache.get(hgId);
        if (hgK) {
          const hgContent = [
            `${E.CL_hedef} Kullanici: ${hedef.user.tag}`,
            `${E.CL_sag_ok} Rol: ${kategoriAdi}`,
            `${E.CL_kupa} Kaydeden: ${interaction.user.username}`,
            `${E.CL_yildiz} Sunucu Uye: ${interaction.guild.memberCount}`,
          ].join('\n');
          hgK.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
            Section([T(`${E.CL_hediye} **Hos Geldin!**\n\n${hgContent}\n\nInfermus League`)], Thumb(hedef.user.displayAvatarURL({ size: 256 }))),
          ])] });
        }
      }

      await interaction.editReply({ content: `${E.CL_yesiltik} **${hedef.user.tag}** basariyla **${kategoriAdi}** olarak kaydedildi.` });

      const kayitKanal = interaction.guild.channels.cache.get(config.kayitKanal);
      if (kayitKanal) {
        const msgId = kayitMesajCache.get(hedef.id);
        if (msgId) {
          const joinMsg = await kayitKanal.messages.fetch(msgId).catch(() => null);
          if (joinMsg) {
            await joinMsg.edit({ flags: MessageFlags.IsComponentsV2, components: [Container([Section([T(`${E.CL_yesiltik} **Kayit Tamamlandi**\n\n${E.CL_insan} ${hedef.user.tag} — <@${hedef.id}>\n${E.CL_rol} **Rol:** ${kategoriAdi}\n${E.CL_kupa} **Kaydeden:** ${interaction.user.username}\n\nInfermus League`)], Thumb(hedef.user.displayAvatarURL({ size: 256 })))])] }).catch(() => {});
          }
          kayitMesajCache.delete(hedef.id);
        }
      }
      return;
    }

    if (interaction.customId.startsWith('scooter_')) {
      const action = interaction.customId.replace('scooter_', '');
      if (action === 'koruma') {
        const korumaMod = require('./commands/koruma');
        await interaction.deferUpdate();
        const korumaCmd = korumaMod.koruma;
        if (korumaCmd) await korumaCmd.execute(interaction.message, [], interaction.client);
        return;
      }
      if (action === 'duyuru') {
        await interaction.reply({ content: '📢 Duyuru yapmak için: `.mesaj #kanal mesajınız`', ephemeral: true });
        return;
      }
      if (action === 'lock') {
        await interaction.deferUpdate();
        const channel = interaction.channel;
        const isLocked = channel.permissionOverwrites.cache.get(interaction.guild.roles.everyone.id)?.deny.has('SendMessages');
        if (isLocked) {
          await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
          await interaction.followUp({ content: '🔓 Kanal kilidi açıldı.', ephemeral: true });
        } else {
          await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
          await interaction.followUp({ content: '🔒 Kanal kilitlendi.', ephemeral: true });
        }
        return;
      }
      if (action === 'sil') {
        await interaction.reply({ content: '🗑️ Mesaj temizlemek için: `.sil 10` (sayı 1-100 arası)', ephemeral: true });
        return;
      }
      return;
    }

    // Kap offer accept/reject — must be before generic kap_ handler
    if (interaction.customId.startsWith('kap_accept_') || interaction.customId.startsWith('kap_reject_')) {
      const fmtVal = v => v < 1 ? `${Math.round(v * 1000)}K` : `${v % 1 === 0 ? v : v.toFixed(1).replace(/\.0$/, '')}M`;
      const isAccept = interaction.customId.startsWith('kap_accept_');
      const oid = interaction.customId.replace('kap_accept_', '').replace('kap_reject_', '');
      const db = require('./database/db');
      const offer = db.get(`kap_offers.${oid}`);
      if (!offer) return interaction.reply({ content: '❌ Bu teklif artık geçerli değil.', ephemeral: true });
      if (offer.status !== 'pending') return interaction.reply({ content: '❌ Bu teklife zaten yanıt verilmiş.', ephemeral: true });
      if (interaction.user.id !== offer.targetId) return interaction.reply({ content: '❌ Bu teklif size ait değil.', ephemeral: true });

      if (isAccept) {
        offer.status = 'accepted';
        db.set(`kap_offers.${oid}`, offer);
        let budget;
        if (offer.buyerBudgetRole) {
          budget = db.get(`budgets.${offer.buyerBudgetRole}.tf`, 0);
        } else {
          const allTeams = db.get('teams', {});
          const match = Object.entries(allTeams).find(([name]) => name.toLowerCase() === offer.buyerTeam.toLowerCase());
          budget = match ? (match[1]?.budget || 0) : 0;
        }
        if (budget < offer.ucret) {
          offer.status = 'failed';
          db.set(`kap_offers.${oid}`, offer);
          await interaction.update({ content: '❌ Teklif kabul edildi ancak takım bütçesi yetersiz! Transfer iptal.', embeds: [], components: [] });
          const guild = interaction.client.guilds.cache.get(offer.guildId);
          if (guild) {
            const logChannel = guild.channels.cache.find(c => c.name.includes('kap-log') || c.name.includes('transfer'));
            if (logChannel) logChannel.send({ content: `❌ **${offer.buyerTeam}** bütçesi yetersiz, **${offer.targetName}** transferi iptal!` }).catch(() => {});
          }
          return;
        }
        db.add(budgetKey, -offer.ucret);
        await interaction.update({
          content: `✅ **Teklifi kabul ettin!** ${offer.buyerTeam} takımına transfer oldun. **${offer.targetName}** için **${fmtVal(offer.ucret)}€** bonservis ücreti ${offer.buyerTeam} bütçesinden düşüldü.`,
          embeds: [],
          components: []
        });
        const guild = interaction.client.guilds.cache.get(offer.guildId);
        if (guild) {
          // Assign team role to player
          if (offer.buyerBudgetRole) {
            const member = guild.members.cache.get(offer.targetId) || await guild.members.fetch(offer.targetId).catch(() => null);
            if (member) member.roles.add(offer.buyerBudgetRole).catch(() => {});
          }
          // Notify buyer via DM
          const buyerMember = guild.members.cache.get(offer.buyerId) || await guild.members.fetch(offer.buyerId).catch(() => null);
          if (buyerMember) {
            buyerMember.send({ content: `✅ **${offer.targetName}** transfer teklifini kabul etti! **${fmtVal(offer.ucret)}€** bütçeden düşüldü.` }).catch(() => {});
          }
          // Send kap form to kapKanal
          const kapKanalId = db.get(`kapKanal.${guild.id}`);
          if (kapKanalId) {
            const kapKanal = guild.channels.cache.get(kapKanalId);
            if (kapKanal) {
              const targetMember = guild.members.cache.get(offer.targetId);
              const targetMention = targetMember ? targetMember.toString() : offer.targetName;
              const buyerRole = offer.buyerBudgetRole ? guild.roles.cache.get(offer.buyerBudgetRole) : null;
              const buyerRoleName = buyerRole ? buyerRole.name : offer.buyerTeam;
              const formEmbed = new EmbedBuilder()
                .setColor(0x2B2D31)
                .setTitle(`📋 Infermus League KAP FORMU (26/27)`)
                .setDescription([
                  `**Futbolcu İsmi:** ${targetMention}`,
                  `**Eski Takımı:** ${db.get(`users.${offer.targetId}.squad`) || '⬜'}`,
                  `**Yeni Takımı:** ${buyerRole || buyerRoleName}`,
                  `**Transfer Durumu:** ✅ Gerçekleşti`,
                  `**Maaş:** ${offer.maas || '⬜'}`,
                  `**Sözleşme Süresi:** ${offer.kontrat || '⬜'}`,
                  `**Transfer Ücreti:** ${fmtVal(offer.ucret)}€`,
                  `**Ek Madde:** ${offer.detay || '⬜'}`,
                  `**Görüşme Yapılan Yetkili:** ${offer.buyerTag}`,
                  `**Transfermarkt Linki:** ${db.get(`users.${offer.targetId}.transfermarkt`) || '⬜'}`,
                ].join('\n'))
                .setFooter({ text: 'Infermus League Kap Sistemi', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();
              kapKanal.send({ embeds: [formEmbed] }).catch(() => {});
            }
          }
          // Log channel notification
          const logChannel = guild.channels.cache.find(c => c.name.includes('kap-log') || c.name.includes('transfer'));
          if (logChannel) {
            logChannel.send({ content: `✅ **TRANSFER GERÇEKLEŞTİ!** ${offer.targetName} → **${offer.buyerTeam}** | Bonservis: ${fmtVal(offer.ucret)}€ | Yetkili: ${offer.buyerTag}` }).catch(() => {});
          }
        }
      } else {
        offer.status = 'rejected';
        db.set(`kap_offers.${oid}`, offer);
        await interaction.update({ content: '❌ Teklifi reddettin.', embeds: [], components: [] });
        const guild = interaction.client.guilds.cache.get(offer.guildId);
        if (guild) {
          // Notify buyer that offer was rejected
          const buyerMember = guild.members.cache.get(offer.buyerId) || await guild.members.fetch(offer.buyerId).catch(() => null);
          if (buyerMember) {
            buyerMember.send({ content: `❌ **${offer.targetName}** transfer teklifini reddetti.` }).catch(() => {});
          }
          const logChannel = guild.channels.cache.find(c => c.name.includes('kap-log') || c.name.includes('transfer'));
          if (logChannel) logChannel.send({ content: `❌ **${offer.targetName}**, ${offer.buyerTeam} takımının teklifini reddetti.` }).catch(() => {});
        }
      }
      return;
    }

    if (interaction.customId.startsWith('kap_')) {
      const db = require('./database/db');
      const roller = db.get(`roller.${interaction.guild.id}`, {});
      const baskanRol = roller.baskan;
      const teknikRol = roller.teknik;
      const futbolcuRol = roller.futbolcu;
      const uyeRolleri = interaction.member.roles.cache;

      if (interaction.customId === 'kap_transfer' || interaction.customId === 'kap_kiralik') {
        const hasBaskan = baskanRol && uyeRolleri.has(baskanRol);
        const hasTeknik = teknikRol && uyeRolleri.has(teknikRol);
        if (!hasBaskan && !hasTeknik && !interaction.member.permissions.has('Administrator')) {
          return interaction.reply({ content: '❌ Bu işlem için Başkan veya Teknik Direktör rolüne sahip olmalısınız!', ephemeral: true });
        }
        const modal = {
          title: interaction.customId === 'kap_transfer' ? 'Transfer İşlemi' : 'Kiralık İşlemi',
          custom_id: interaction.customId + '_modal',
          components: [
            { type: 1, components: [{ type: 4, custom_id: 'kap_oyuncu', label: 'Oyuncu ID / Nick', style: 1, required: true, min_length: 1, max_length: 50 }] },
            { type: 1, components: [{ type: 4, custom_id: 'kap_kulup', label: 'Kulüp Adı', style: 1, required: true, min_length: 1, max_length: 100 }] },
            { type: 1, components: [{ type: 4, custom_id: 'kap_maas_kontrat', label: 'Maaş / Sözleşme Süresi (örn. 500k / 2)', style: 1, required: false, max_length: 50 }] },
            { type: 1, components: [{ type: 4, custom_id: 'kap_bonservis', label: 'Bonservis Ücreti (örn. 5M, 10k)', style: 1, required: true, max_length: 20 }] },
            { type: 1, components: [{ type: 4, custom_id: 'kap_detay', label: 'Detay / Ek Madde / TM URL', style: 2, required: false, max_length: 500 }] },
          ]
        };
        await interaction.showModal(modal);
        return;
      }

      if (interaction.customId === 'kap_fesih') {
        const hasFutbolcu = futbolcuRol && uyeRolleri.has(futbolcuRol);
        if (!hasFutbolcu && !interaction.member.permissions.has('Administrator')) {
          return interaction.reply({ content: '❌ Bu işlem için Futbolcu rolüne sahip olmalısınız!', ephemeral: true });
        }
        const modal = {
          title: 'Fesih İşlemi',
          custom_id: 'kap_fesih_modal',
          components: [
            { type: 1, components: [{ type: 4, custom_id: 'kap_oyuncu', label: 'Oyuncu ID / Nick', style: 1, required: true, min_length: 1, max_length: 50 }] },
            { type: 1, components: [{ type: 4, custom_id: 'kap_sebep', label: 'Fesih Sebebi', style: 2, required: true, min_length: 1, max_length: 500 }] },
          ]
        };
        await interaction.showModal(modal);
        return;
      }
    }

    if (interaction.customId === 'yardim_kapat') {
      await interaction.deferUpdate();
      const { Container, T } = require('./utils/componentsv2');
      await interaction.message.edit({ components: [Container([T('❌ Menü kapatıldı.')])] });
      return;
    }

    if (interaction.customId.startsWith('yardim_page_')) {
      await interaction.deferUpdate();
      const parts = interaction.customId.split('_');
      const idx = parseInt(parts[2]);
      const page = parseInt(parts[3]);
      const yardimMod = require('./commands/yardim');
      const msg = yardimMod.buildCategoryComponents(idx, page, interaction.user);
      if (msg) await interaction.message.edit(msg);
      return;
    }

    if (interaction.customId === 'yardim_ana') {
      await interaction.deferUpdate();
      const yardimMod = require('./commands/yardim');
      const msg = yardimMod.buildMainComponents(interaction.guild.name, interaction.user);
      await interaction.message.edit(msg);
      return;
    }

    if (interaction.customId.startsWith('emojiid_')) {
      await interaction.deferUpdate();
      if (interaction.customId === 'emojiid_kapat') {
        await interaction.message.edit({ content: '❌ Kapatıldı.', embeds: [], components: [] });
        return;
      }
      if (interaction.customId.startsWith('emojiid_page_')) {
        const page = parseInt(interaction.customId.split('_')[2]);
        const mod = require('./commands/emojiid');
        const emojis = [...interaction.guild.emojis.cache.values()];
        const totalPages = Math.ceil(emojis.length / 10);
        const embed = mod.buildEmbed(emojis, page, totalPages, interaction.guild.name);
        const rows = mod.buildRows(page, totalPages);
        await interaction.message.edit({ embeds: [embed], components: rows });
      }
      return;
    }

    if (interaction.customId.startsWith('rpg_') || interaction.customId.startsWith('nav_') || interaction.customId.startsWith('act_')) {
      const rpgMod = require('./commands/rpg');
      await rpgMod.handleInteraction(interaction);
      return;
    }


  }

  if (interaction.customId?.startsWith('guard_')) {
    const korumaMod = require('./commands/koruma');
    await korumaMod.handleGuardInteraction.execute(interaction);
    return;
  }

  if (interaction.isStringSelectMenu() && interaction.customId === 'yardim_select') {
    await interaction.deferUpdate();
    const value = interaction.values[0];
    if (value.startsWith('yardim_kat_')) {
      const idx = parseInt(value.replace('yardim_kat_', ''));
      const yardimMod = require('./commands/yardim');
      const msg = yardimMod.buildCategoryComponents(idx, 0, interaction.user);
      if (msg) await interaction.message.edit(msg);
    }
    return;
  }

  if (interaction.isStringSelectMenu() && interaction.customId === 'yardim_sistem') {
    await interaction.deferUpdate();
    const value = interaction.values[0];
    const yardimMod = require('./commands/yardim');
    let msg;
    if (value.startsWith('yardim_sis_')) {
      const idx = parseInt(value.replace('yardim_sis_', ''));
      msg = yardimMod.buildSistemComponents(idx);
    } else {
      msg = yardimMod.buildSistemComponents();
    }
    if (msg) await interaction.message.edit(msg);
    return;
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'yetkili_modal') {
      const ad = interaction.fields.getTextInputValue('yetkili_ad');
      const yas = interaction.fields.getTextInputValue('yetkili_yas');
      const yer = interaction.fields.getTextInputValue('yetkili_yer');
      const mikrofon = interaction.fields.getTextInputValue('yetkili_mikrofon');
      const neden = interaction.fields.getTextInputValue('yetkili_neden');
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('📢 Yeni Yetkili Başvurusu')
        .addFields(
          { name: '👤 Kullanıcı', value: `${interaction.user.tag} (${interaction.user})`, inline: false },
          { name: '🆔 ID', value: interaction.user.id, inline: true },
          { name: '📛 Ad', value: ad, inline: true },
          { name: '🎂 Yaş', value: yas, inline: true },
          { name: '📍 Yer', value: yer, inline: false },
          { name: '🎙️ Mikrofon', value: mikrofon, inline: false },
          { name: '📝 Neden', value: neden, inline: false }
        )
        .setTimestamp();
      await interaction.reply({ content: '✅ Başvurunuz alındı! Yetkililer en kısa sürede değerlendirecektir.', ephemeral: true });
      const basvuruKanal = interaction.client.channels.cache.get(config.yetkiliBasvuruKanal || config.basvuruKanal);
      if (basvuruKanal) basvuruKanal.send({ embeds: [embed] }).catch(() => {});
      return;
    }

    if (interaction.customId === 'itiraf_modal') {
      const icerik = interaction.fields.getTextInputValue('itiraf_icerik');
      const embed = new EmbedBuilder()
        .setColor(0x9B59B6)
        .setTitle('🙏 Anonim İtiraf')
        .setDescription(icerik)
        .setTimestamp();
      await interaction.reply({ content: '✅ İtirafınız gönderildi!', ephemeral: true });
      const channel = interaction.guild.channels.cache.find(c => c.name.includes('itiraf'));
      if (channel) channel.send({ embeds: [embed] });
      else interaction.channel.send({ embeds: [embed] });
      return;
    }

    if (interaction.customId === 'spiker_modal') {
      const neden = interaction.fields.getTextInputValue('spiker_neden');
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('🎙️ Yeni Spiker Başvurusu')
        .addFields(
          { name: '👤 Kullanıcı', value: `${interaction.user.tag} (${interaction.user})`, inline: true },
          { name: '🆔 ID', value: interaction.user.id, inline: true },
          { name: '📝 Neden', value: neden, inline: false }
        )
        .setTimestamp();
      await interaction.reply({ content: '✅ Başvurunuz alındı! Yetkililer en kısa sürede değerlendirecektir.', ephemeral: true });
      const basvuruKanal = interaction.client.channels.cache.get(config.basvuruKanal);
      if (basvuruKanal) basvuruKanal.send({ embeds: [embed] }).catch(() => {});
      return;
    }

    if (interaction.customId === 'kap_transfer_modal' || interaction.customId === 'kap_kiralik_modal' || interaction.customId === 'kap_fesih_modal') {
      const tur = interaction.customId === 'kap_transfer_modal' ? 'Transfer' : interaction.customId === 'kap_kiralik_modal' ? 'Kiralık' : 'Fesih';
      const oyuncuInput = interaction.fields.getTextInputValue('kap_oyuncu');
      const ekstra = interaction.fields.getTextInputValue(interaction.customId === 'kap_fesih_modal' ? 'kap_sebep' : 'kap_detay');
      const kulup = interaction.customId !== 'kap_fesih_modal' ? interaction.fields.getTextInputValue('kap_kulup') : '-';
      const bonservisInput = interaction.customId !== 'kap_fesih_modal' ? interaction.fields.getTextInputValue('kap_bonservis') : '';
      const maasKontratRaw = interaction.customId !== 'kap_fesih_modal' ? interaction.fields.getTextInputValue('kap_maas_kontrat') : '';
      let maas = '-', kontrat = '-';
      if (maasKontratRaw) {
        const parts = maasKontratRaw.split('/').map(s => s.trim());
        if (parts.length >= 2) { maas = parts[0] || '-'; kontrat = parts[1] || '-'; }
        else if (parts.length === 1) maas = parts[0];
      }

      let hedefUye = null;
      const mentionMatch = oyuncuInput.match(/^<@!?(\d+)>$/);
      if (mentionMatch) {
        hedefUye = interaction.guild.members.cache.get(mentionMatch[1]) || await interaction.guild.members.fetch(mentionMatch[1]).catch(() => null);
      } else if (/^\d+$/.test(oyuncuInput)) {
        hedefUye = interaction.guild.members.cache.get(oyuncuInput) || await interaction.guild.members.fetch(oyuncuInput).catch(() => null);
      } else {
        hedefUye = interaction.guild.members.cache.find(m => m.displayName.toLowerCase() === oyuncuInput.toLowerCase() || m.user.username.toLowerCase() === oyuncuInput.toLowerCase());
      }
      const rpAdi = hedefUye ? (db.get(`users.${hedefUye.id}.name`) || hedefUye.displayName) : oyuncuInput;
      // Auto-create user data if not exists (so DM offer flow works)
      let hedefData = hedefUye ? db.get(`users.${hedefUye.id}`) : null;
      if (hedefUye && !hedefData) {
        hedefData = {
          value: 1, valueHistory: [], valueCount: 0,
          goals: 0, assists: 0,
          balance: 0, bankBalance: 0, bankHistory: [],
          skills: { genel: 50, hiz: 50, sut: 50, pas: 50, defans: 50, kaleci: 50 },
          squad: null, position: null, country: null, name: hedefUye.displayName,
          trainings: [], matchStats: { mac: 0, gol: 0, asist: 0, sarikart: 0, kirmizikart: 0 }
        };
        db.set(`users.${hedefUye.id}`, hedefData);
      }

      let tmLink = '';
      if (hedefUye) {
        const link = db.get(`users.${hedefUye.id}.transfermarkt`);
        if (link) tmLink = `\n🌐 **Transfermarkt:** ${link}`;
      }

      // Store Transfermarkt URL if provided in detay field
      if (hedefUye && ekstra && ekstra !== '-') {
        const tmMatch = ekstra.match(/https?:\/\/(?:www\.)?transfermarkt\.[a-z]+\/[\S]+/i);
        if (tmMatch) {
          db.set(`users.${hedefUye.id}.transfermarkt`, tmMatch[0]);
          if (!tmLink) tmLink = `\n🌐 **Transfermarkt:** ${tmMatch[0]}`;
        }
      }

      const fmtVal = v => v < 1 ? `${Math.round(v * 1000)}K` : `${v % 1 === 0 ? v : v.toFixed(1).replace(/\.0$/, '')}M`;
      let ucret = 0;
      if (tur !== 'Fesih' && kulup !== '-') {
        const bMatch = bonservisInput.match(/(\d+(?:[.,]\d+)?)\s*([MmKk])?/);
        if (bMatch) {
          ucret = parseFloat(bMatch[1].replace(',', '.'));
          const suffix = (bMatch[2] || '').toLowerCase();
          if (suffix === 'm') {}
          else if (suffix === 'k') ucret = ucret * 0.001;
          else if (ucret > 999) ucret = ucret * 0.001;
        }
      }

      // If target player exists in RP db and this is a transfer/kiralik, send DM offer
      if (hedefData && tur !== 'Fesih' && kulup !== '-') {
        // Check user's role-based budget first, then fall back to team name budget (case-insensitive)
        let buyingBudget = 0;
        let budgetLabel = kulup;
        let budgetRoleId = null;
        let hasBudget = false;
        const allBudgets = db.get('budgets', {});
        for (const [rid, b] of Object.entries(allBudgets)) {
          if (interaction.member.roles.cache.has(rid)) {
            buyingBudget = b.tf;
            budgetRoleId = rid;
            hasBudget = true;
            const role = interaction.guild.roles.cache.get(rid);
            if (role) budgetLabel = role.name;
            break;
          }
        }
        if (!hasBudget) {
          const allTeams = db.get('teams', {});
          const match = Object.entries(allTeams).find(([name]) => name.toLowerCase() === kulup.toLowerCase());
          if (match && match[1] && match[1].budget > 0) {
            buyingBudget = match[1].budget;
            budgetLabel = match[0];
            hasBudget = true;
          }
        }
        if (hasBudget && buyingBudget < ucret) {
          return interaction.reply({ content: `❌ **${budgetLabel}** takımının bütçesi yetersiz! (Bütçe: ${fmtVal(buyingBudget)}€, Ücret: ${fmtVal(ucret)}€)`, ephemeral: true });
        }

        const counter = db.add('kap_counter', 1);
        const oid = counter;
        const offer = {
          id: oid,
          tur,
          buyerId: interaction.user.id,
          buyerTag: interaction.user.tag,
          buyerTeam: kulup,
          buyerBudgetRole: budgetRoleId,
          targetId: hedefUye.id,
          targetTag: hedefUye.user.tag,
          targetName: rpAdi,
          ucret,
          maas,
          kontrat,
          detay: ekstra,
          status: 'pending',
          createdAt: new Date().toISOString(),
          guildId: interaction.guild.id,
          channelId: interaction.channel.id,
        };
        db.set(`kap_offers.${oid}`, offer);

        const dmEmbed = new EmbedBuilder()
          .setColor(0x2B2D31)
          .setAuthor({ name: 'Infermus League — Transfer Teklifi', iconURL: interaction.client.user.displayAvatarURL() })
          .setDescription([
            `📧 **Yeni Transfer Teklifi!**`,
            '',
            `━━━━━━━━━━━━━━━━━━━━━━`,
            '',
            `**Oyuncu:** ${hedefData.name || hedefUye.displayName}`,
            `**Teklif Eden:** ${interaction.user.tag} (${interaction.user})`,
            `**Talip Olan Takım:** ${kulup}`,
            `**Bonservis:** ${fmtVal(ucret)}€`,
            `**Maaş:** ${maas}`,
            `**Sözleşme Süresi:** ${kontrat}`,
            `**Detay:** ${ekstra}`,
            '',
            `━━━━━━━━━━━━━━━━━━━━━━`,
            '',
            `Teklifi kabul etmek için aşağıdaki butonları kullan.`,
          ].join('\n'))
          .setFooter({ text: 'Infermus League Kap Sistemi', iconURL: interaction.client.user.displayAvatarURL() })
          .setTimestamp();

        const btnRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`kap_accept_${oid}`).setLabel('Kabul Et').setStyle(ButtonStyle.Success).setEmoji('✅'),
          new ButtonBuilder().setCustomId(`kap_reject_${oid}`).setLabel('Reddet').setStyle(ButtonStyle.Danger).setEmoji('❌'),
        );

        try {
          await hedefUye.send({ embeds: [dmEmbed], components: [btnRow] });
          await interaction.reply({ content: `✅ Teklif **${hedefUye.user.tag}** adlı oyuncuya gönderildi. Oyuncunun yanıtı bekleniyor...`, ephemeral: true });

          const logEmbed = new EmbedBuilder()
            .setColor(0x2B2D31)
            .setTitle(`📋 ${tur} Teklifi — Beklemede`)
            .addFields(
              { name: '👤 Yetkili', value: `${interaction.user.tag} (${interaction.user})`, inline: false },
              { name: '🎯 Oyuncu', value: `${rpAdi}${tmLink}`, inline: true },
              { name: '🏟️ Talip Takım', value: kulup, inline: true },
              { name: '💰 Ücret', value: fmtVal(ucret), inline: true },
              { name: '💵 Maaş', value: maas, inline: true },
              { name: '📄 Sözleşme', value: kontrat, inline: true },
              { name: '📝 Detay', value: ekstra, inline: false },
              { name: '🔖 Durum', value: '⏳ Oyuncu yanıtı bekleniyor...', inline: false }
            )
            .setTimestamp();
          const logChannel = interaction.guild.channels.cache.find(c => c.name.includes('kap-log') || c.name.includes('transfer'));
          if (logChannel) logChannel.send({ embeds: [logEmbed] }).catch(() => {});
        } catch {
          await interaction.reply({ content: `❌ **${hedefUye.user.tag}** kullanıcısına DM gönderilemedi. Kullanıcı özel mesajlara kapalı.`, ephemeral: true });
          db.delete(`kap_offers.${oid}`);
        }
        return;
      }

      // Legacy flow — player not in RP or fesih
      const embed = new EmbedBuilder()
        .setColor(interaction.customId === 'kap_fesih_modal' ? 0xFF0000 : 0x00FF00)
        .setTitle(`📋 ${tur} İşlemi`)
        .addFields(
          { name: '👤 Kullanıcı', value: `${interaction.user.tag} (${interaction.user})`, inline: false },
          { name: '🎯 Oyuncu', value: `${rpAdi}${tmLink}`, inline: true },
          { name: '🏟️ Kulüp', value: kulup, inline: true },
          { name: '📝 Detay', value: ekstra, inline: false }
        )
        .setTimestamp();
      await interaction.reply({ content: `✅ ${tur} başvurunuz alındı!`, ephemeral: true });
      const logChannel = interaction.guild.channels.cache.find(c => c.name.includes('kap-log') || c.name.includes('transfer'));
      if (logChannel) logChannel.send({ embeds: [embed] }).catch(() => {});
      else interaction.channel.send({ embeds: [embed] }).catch(() => {});

      const kapKanalId = db.get(`kapKanal.${interaction.guild.id}`);
      if (kapKanalId) {
        const kapKanal = interaction.guild.channels.cache.get(kapKanalId);
        if (kapKanal) {
          const formMsg = [
            `**Infermus League KAP FORMU**`,
            `**İşlem Türü:** ${tur}`,
            `**Yetkili:** ${interaction.user.tag}`,
            ``,
            `**Oyuncu Adı:** ${rpAdi}${tmLink ? `\n**Transfermarkt:** ${db.get(`users.${hedefUye.id}.transfermarkt`)}` : ''}`,
            `**Ödenen Bonservis:** ⬜`,
            `**Oyuncu Maaşı:** ⬜`,
            `**Eski Takımı:** ⬜`,
            `**Yeni Takımı:** ${tur !== 'Fesih' ? kulup : '⬜'}`,
            `**Sözleşme Süresi:** ⬜`,
            `**Ek Madde:** ${ekstra !== '-' ? ekstra : '⬜'}`,
          ].join('\n');
          kapKanal.send(formMsg).catch(() => {});
        }
      }
      return;
    }
  }
  } catch (e) {
    console.error('interactionCreate hatasi:', e);
    try {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: `❌ Hata: ${e.message}`, ephemeral: true }).catch(() => {});
      }
    } catch {}
  }
});

client.on('messageDelete', async (message) => {
  if (!message.content || message.author?.bot) return;
  const db = require('./database/db');
  const guildSnipe = db.get(`snipe.${message.guild?.id}`, {});
  guildSnipe[message.channel.id] = {
    content: message.content,
    author: message.author.tag,
    authorId: message.author.id,
    avatar: message.author.displayAvatarURL(),
    deletedAt: Date.now()
  };
  db.set(`snipe.${message.guild?.id}`, guildSnipe);
});

client.once('ready', async () => {
  console.log(`[INVITE] Bot ready, caching invites for ${client.guilds.cache.size} guilds...`);
  for (const [id, guild] of client.guilds.cache) {
    try {
      const invites = await guild.invites.fetch();
      inviteCache.set(id, new Map(invites.map(i => [i.code, { code: i.code, uses: i.uses, inviterId: i.inviter?.id }])));
    } catch { inviteCache.set(id, new Map()); }
  }
  console.log('[INVITE] Invite cache ready.');
});

client.on('inviteCreate', async (invite) => {
  const guildInvites = inviteCache.get(invite.guild.id) || new Map();
  guildInvites.set(invite.code, { code: invite.code, uses: invite.uses, inviterId: invite.inviter?.id });
  inviteCache.set(invite.guild.id, guildInvites);
});

client.on('inviteDelete', async (invite) => {
  const guildInvites = inviteCache.get(invite.guild.id);
  if (guildInvites) guildInvites.delete(invite.code);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.guild) {
    try {
      const guard = require('./engine/guard');
      const guardResult = guard.checkAll(message);
      if (guardResult) {
        if (guardResult.delete && message.deletable) message.delete().catch(() => {});
        if (guardResult.type === 'kufur') {
          const E2 = require('./config/emojis');
          message.channel.send({ embeds: [new EmbedBuilder()
            .setColor(0x2B2D31)
            .setDescription(`${E2.CL_uyari} ${message.author}, kufur ettigin icin mesajin silindi!`)
            .setFooter({ text: 'Infermus League' })
            .setTimestamp()
          ]}).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
        }
        const cfg = guard.getConfig(message.guild.id);
        if (cfg.logKanal) {
          const logCh = message.guild.channels.cache.get(cfg.logKanal);
          if (logCh) logCh.send({
            embeds: [new EmbedBuilder()
              .setColor(0x2B2D31)
              .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
              .setTitle(`${require('./config/emojis').Korunuyor} Koruma Tarafından Engellendi`)
              .setDescription(`**${message.author}** adlı kullanıcı **${guardResult.reason}** sebebiyle uyarıldı.`)
              .addFields(
                { name: 'Engellenen İçerik', value: `\`\`\`${message.content.slice(0, 950) || '(boş)'}\`\`\``, inline: false },
                { name: 'Kanal', value: `${message.channel}`, inline: true },
                { name: 'Kullanıcı ID', value: `\`${message.author.id}\``, inline: true },
              )
              .setFooter({ text: 'Infermus League' })
              .setTimestamp()],
          }).catch(() => {});
        }
        return;
      }
    } catch (e) {
      console.error('[Guard] messageCreate guard hatası:', e.message);
    }
  }

  const kisitliKanallar = ['1514936712034254859', '1496832269611044958'];
  if (kisitliKanallar.includes(message.channel.id)) {
    const prefix = config.prefix;
    if (!message.content.startsWith(prefix) || !['araçal', 'evaç'].includes(message.content.slice(prefix.length).trim().split(/ +/)[0].toLowerCase())) {
      if (message.deletable) message.delete().catch(() => {});
      return;
    }
  }

  // Trivia reply check
  if (message.reference) {
    try {
      const refMsg = await message.fetchReference();
      if (refMsg.author.id === client.user.id) {
        const trv = require('./database/db').get(`trivia.${refMsg.id}`);
        if (trv && !trv.cevaplandi) {
          const db2 = require('./database/db');
          const raw = message.content.trim();
          let dogruMu = false;

          // check by number
          const num = parseInt(raw);
          if (num >= 1 && num <= 4) {
            dogruMu = (num - 1) === trv.idx;
          }
          // check by text
          else if (trv.secenekler && trv.dogruCevap) {
            const eslesen = trv.secenekler.findIndex(o => o.toLowerCase() === raw.toLowerCase());
            if (eslesen !== -1) {
              dogruMu = eslesen === trv.idx;
            } else {
              // text doesn't match any option — ignore
              return;
            }
          } else {
            return;
          }

          trv.cevaplandi = true;
          db2.set(`trivia.${refMsg.id}`, trv);
          if (dogruMu) {
            const userId = message.author.id;
            const userData = db2.get(`users.${userId}`, {});
            userData.balance = (userData.balance || 0) + trv.odul;
            db2.set(`users.${userId}`, userData);
            message.react('✅').catch(() => {});
            message.reply(`${E.CL_yesiltik} Dogru cevap! **${trv.odul.toLocaleString()} coin** kazandin!`).catch(() => {});
            const newDesc = refMsg.embeds[0]?.description?.replace(/\nCevap icin.*/, `\n${E.CL_yesiltik} **${message.author.tag}** dogru bildi!`);
            if (newDesc) refMsg.edit({ embeds: [EmbedBuilder.from(refMsg.embeds[0]).setDescription(newDesc)] }).catch(() => {});
          } else {
            message.react('❌').catch(() => {});
            message.reply(`${E.CL_carpi} Yanlis cevap! Dogru cevap: **${trv.dogruCevap || 'bilinmiyor'}**`).catch(() => {});
          }
        }
      }
    } catch {}
  }

  // Auto-trigger every 100 messages (skip restricted channels)
  if (!kisitliKanallar.includes(message.channel.id)) {
    const count = (channelMsgCount.get(message.channel.id) || 0) + 1;
    channelMsgCount.set(message.channel.id, count);
    if (count % 100 === 0) {
      const hazirlik = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setDescription('100 mesaj tamamlandı soru hazırlanıyor...')
        .setFooter({ text: 'Infermus League' })
        .setTimestamp();
      message.channel.send({ embeds: [hazirlik] }).then(() => {
        setTimeout(() => sendTrivia(message.channel, message.author), 1500);
      });
    }
  }

  // AFK detection
  const afkDb = require('./database/db');
  const afkData = afkDb.get('afk', {});
  const authorId = message.author.id;

  // Remove AFK when user sends a normal message (not a command)
  if (afkData[authorId] && !message.content.startsWith(config.prefix)) {
    afkDb.delete(`afk.${authorId}`);
    message.reply({ flags: 32768, components: [require('./utils/componentsv2').Container([require('./utils/componentsv2').T(`${E.CL_yesiltik} AFK modundan çıktın!`)])] }).catch(() => {});
  }

  // Notify when someone mentions an AFK user
  if (message.mentions.users.size > 0) {
    for (const [userId] of message.mentions.users) {
      if (userId !== authorId && afkData[userId]) {
        const reason = afkData[userId].reason || 'Belirtilmedi';
        message.reply({ flags: 32768, components: [require('./utils/componentsv2').Container([require('./utils/componentsv2').T(`${E.CL_uyari} **${message.mentions.users.get(userId).username}** AFK: **${reason}**`)])] }).catch(() => {});
      }
    }
  }

  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const antremanKanal = require('./database/db').get('settings.antremanKanal');
  if (antremanKanal && message.channel.id === antremanKanal && commandName !== 'antrenman') return;

  const command = client.commands.get(commandName);
  if (!command) {
    const customCmds = require('./database/db').get(`ozelKomut.${message.guild?.id}`, {});
    if (customCmds[commandName]) {
      message.channel.send({ content: customCmds[commandName] });
      return;
    }
    message.channel.send(`Komut bulunamadı: \`${commandName}\``);
    return;
  }

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(`Hata (${commandName}):`, error);
    message.channel.send(`❌ Hata: ${error.message}`);
  }
});

client.on('channelCreate', async (channel) => {
  const { handleChannelCreate } = require('./engine/guard');
  const { EmbedBuilder } = require('discord.js');
  await handleChannelCreate(channel);
});

client.on('channelDelete', async (channel) => {
  const { handleChannelDelete } = require('./engine/guard');
  await handleChannelDelete(channel);
});

client.on('roleCreate', async (role) => {
  const { handleRoleCreate } = require('./engine/guard');
  await handleRoleCreate(role);
});

client.on('roleDelete', async (role) => {
  const { handleRoleDelete } = require('./engine/guard');
  await handleRoleDelete(role);
});

client.on('guildBanAdd', async (ban) => {
  const { handleGuildBanAdd } = require('./engine/guard');
  await handleGuildBanAdd(ban);
});

client.on('guildMemberRemove', async (member) => {
  const { handleGuildMemberRemove } = require('./engine/guard');
  await handleGuildMemberRemove(member);

  if (!member.user?.bot) {
    const db2 = require('./database/db');

    try {
      const guild = member.guild || await client.guilds.fetch(member.guildId);
      const oldInvites = inviteCache.get(guild.id) || new Map();
      const newInvites = await guild.invites.fetch();
      let inviterId = null;
      for (const [code, invite] of newInvites) {
        const old = oldInvites.get(code);
        if (old && invite.uses > old.uses) {
          inviterId = invite.inviter?.id || old.inviterId;
          break;
        }
      }
      inviteCache.set(guild.id, new Map(newInvites.map(i => [i.code, { code: i.code, uses: i.uses, inviterId: i.inviter?.id }])));
      if (inviterId) {
        const invData = db2.get(`davetler.${guild.id}.${inviterId}`, { total: 0, gercek: 0, sahte: 0, ayrilan: 0 });
        invData.gercek = Math.max(0, invData.gercek - 1);
        invData.ayrilan += 1;
        db2.set(`davetler.${guild.id}.${inviterId}`, invData);
      }
    } catch {}

    const sayac2 = db2.get(`sayaç.${member.guild.id}`);
    if (sayac2 && sayac2.kanal) {
      const sayacCh = member.guild.channels.cache.get(sayac2.kanal);
      if (sayacCh) sayacCh.setName(sayac2.isim.replace('{sayı}', member.guild.memberCount)).catch(() => {});
    }
  }
});

client.on('guildUpdate', async (oldGuild, newGuild) => {
  const { handleGuildUpdate } = require('./engine/guard');
  await handleGuildUpdate(oldGuild, newGuild);
});

client.on('guildMemberAdd', async (member) => {
  if (!member.user?.bot) {
    const db2 = require('./database/db');

    try {
      const oldInvites = inviteCache.get(member.guild.id) || new Map();
      const newInvites = await member.guild.invites.fetch();
      let inviterId = null;
      for (const [code, invite] of newInvites) {
        const old = oldInvites.get(code);
        if (old && invite.uses > old.uses) {
          inviterId = invite.inviter?.id || old.inviterId;
          break;
        }
      }
      inviteCache.set(member.guild.id, new Map(newInvites.map(i => [i.code, { code: i.code, uses: i.uses, inviterId: i.inviter?.id }])));
      if (inviterId) {
        const invData = db2.get(`davetler.${member.guild.id}.${inviterId}`, { total: 0, gercek: 0, sahte: 0, ayrilan: 0 });
        invData.total += 1;
        invData.gercek += 1;
        db2.set(`davetler.${member.guild.id}.${inviterId}`, invData);
      }
    } catch {}

    const kayitConfig = db2.get(`kayit.${member.guild.id}`);
    if (kayitConfig && kayitConfig.kayitKanal) {
      const channel = member.guild.channels.cache.get(kayitConfig.kayitKanal);
      if (channel) {
        if (kayitConfig.kayitsizRol) {
          const rol = member.guild.roles.cache.get(kayitConfig.kayitsizRol);
          if (rol) member.roles.add(rol).catch(() => {});
        }
        const now = Date.now();
        const hesapMs = now - member.user.createdTimestamp;
        const hesapGun = Math.floor(hesapMs / 86400000);
        const hesapYil = Math.floor(hesapGun / 365);
        const hesapAy = Math.floor((hesapGun % 365) / 30);
        const hesapKalanGun = hesapGun % 30;
        let hesapStr = '';
        if (hesapYil > 0) hesapStr += `${hesapYil} yıl `;
        if (hesapAy > 0) hesapStr += `${hesapAy} ay `;
        hesapStr += `${hesapKalanGun} gün`;
        const guvenlik = hesapGun > 365 ? '✅ Güvenilir' : hesapGun > 30 ? '⚠️ Normal' : '🚨 Yeni hesap';
        const renk = hesapGun > 365 ? 0x00FF00 : hesapGun > 30 ? 0xFFA500 : 0xFF0000;
        const banner = member.guild.bannerURL({ size: 1024 });
        const row1 = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`kayit_gecmisi_${member.id}`).setLabel('Kayit Gecmisi').setStyle(ButtonStyle.Secondary),
        );
        const rowQuick = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`k_uye_${member.id}`).setLabel('Uye').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId(`k_futbolcu_${member.id}`).setLabel('Futbolcu').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId(`k_teknik_${member.id}`).setLabel('Teknik Direktor').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId(`k_baskan_${member.id}`).setLabel('Baskan').setStyle(ButtonStyle.Danger),
        );
        const yetkiliRol = member.guild.roles.cache.get(kayitConfig.kayitYetkilisi);
        if (yetkiliRol) channel.send({ content: `${yetkiliRol}` }).catch(() => {});
        try {
          const guvenlikEmoji = hesapGun > 365 ? E.CL_onaylandi : hesapGun > 30 ? E.CL_info : E.CL_uyari_2;
          const guvenlikText = hesapGun > 365 ? 'Güvenilir' : hesapGun > 30 ? 'Normal' : 'Yeni hesap';
          const katilmaStr = `<t:${Math.floor(member.joinedTimestamp / 1000)}:F> (<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)`;
          const olusumStr = `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)`;
          await channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [Container([
              Section([
                T(`${E.CL_pano} **Yeni Uye - Kayit Sistemi**\n${E.CL_insan} ${member.user.tag} — <@${member.user.id}>`),
              ], Thumb(member.user.displayAvatarURL({ size: 256 }))),
              Sep(),
              T(`${E.CL_insan} **Kullanici:** ${member.user} (\`${member.user.id}\`)\n${E.CL_kupa_2} **Sunucu Sırası:** #${member.guild.memberCount}\n${E.CL_kayit_emoji} **Toplam Uye:** ${member.guild.memberCount}`),
              Sep(),
              T(`${guvenlikEmoji} **Guvenlik:** ${guvenlikText}\n${E.CL_yas} **Hesap Yasi:** ${hesapStr}\n${E.CL_global} **Hesap Olusum:** ${olusumStr}\n${E.CL_sabitleme} **Katilma:** ${katilmaStr}`),
              Sep(),
              T(`**Bot mu?:** ${member.user.bot ? 'Evet 🤖' : 'Hayir 👤'}\n${E.CL_sohbet_baloncuk} **Kullanici Adi:** ${member.user.username}\n${E.CL_dosyalar} **ID:** \`${member.user.id}\``),
              Sep(),
              rowQuick.toJSON(),
              Sep(),
              row1.toJSON(),
            ])],
          }).then(msg => kayitMesajCache.set(member.id, msg.id));
        } catch (e) {
          require('fs').appendFileSync('kayit_error.log', `${new Date().toISOString()}: ${e.message}\n${e.stack}\n`);
        }
      }
    }

    const otoRolId = db2.get(`otorol.${member.guild.id}`);
    if (otoRolId && !member.user.bot) {
      const otoRol = member.guild.roles.cache.get(otoRolId);
      if (otoRol) member.roles.add(otoRol).catch(() => {});
    }

    const sayac = db2.get(`sayaç.${member.guild.id}`);
    if (sayac && sayac.kanal) {
      const sayacCh = member.guild.channels.cache.get(sayac.kanal);
      if (sayacCh) sayacCh.setName(sayac.isim.replace('{sayı}', member.guild.memberCount)).catch(() => {});
    }

    return;
  }
  const { handleBotAdd } = require('./engine/guard');
  await handleBotAdd(member);
});

process.on('uncaughtException', e => console.error('UNCAUGHT:', e));
process.on('unhandledRejection', e => console.error('UNHANDLED:', e));

const api = require('./server');
client.once('ready', () => { api.setBot(client); });
api.startServer();

client.login(process.env.TOKEN);
