const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { T, Container } = require('../utils/componentsv2');
const db = require('../database/db');
const E = require('../config/emojis');

const allVehicles = [
  { type: 'Bisiklet', model: 'Dag Bisikleti', fiyat: 10000, emoji: '🚲', typeKey: 'bisiklet' },
  { type: 'Bisiklet', model: 'Yol Bisikleti', fiyat: 10000, emoji: '🚲', typeKey: 'bisiklet' },
  { type: 'Bisiklet', model: 'BMX', fiyat: 10000, emoji: '🚲', typeKey: 'bisiklet' },
  { type: 'Bisiklet', model: 'Sehir Bisikleti', fiyat: 10000, emoji: '🚲', typeKey: 'bisiklet' },
  { type: 'Bisiklet', model: 'Elektrikli Bisiklet', fiyat: 10000, emoji: '🚲', typeKey: 'bisiklet' },
  { type: 'Bisiklet', model: 'Katlanir Bisiklet', fiyat: 10000, emoji: '🚲', typeKey: 'bisiklet' },
  { type: 'Motosiklet', model: 'Yamaha R1', fiyat: 50000, emoji: '🏍️', typeKey: 'motosiklet' },
  { type: 'Motosiklet', model: 'Honda CBR1000RR', fiyat: 50000, emoji: '🏍️', typeKey: 'motosiklet' },
  { type: 'Motosiklet', model: 'Ducati Panigale V4', fiyat: 50000, emoji: '🏍️', typeKey: 'motosiklet' },
  { type: 'Motosiklet', model: 'Kawasaki Ninja H2', fiyat: 50000, emoji: '🏍️', typeKey: 'motosiklet' },
  { type: 'Motosiklet', model: 'Harley-Davidson Street Glide', fiyat: 50000, emoji: '🏍️', typeKey: 'motosiklet' },
  { type: 'Motosiklet', model: 'KTM 1290 Super Duke', fiyat: 50000, emoji: '🏍️', typeKey: 'motosiklet' },
  { type: 'Motosiklet', model: 'BMW S1000RR', fiyat: 50000, emoji: '🏍️', typeKey: 'motosiklet' },
  { type: 'Sedan', model: 'BMW M5', fiyat: 150000, emoji: '🚗', typeKey: 'sedan' },
  { type: 'Sedan', model: 'Mercedes E63 AMG', fiyat: 150000, emoji: '🚗', typeKey: 'sedan' },
  { type: 'Sedan', model: 'Audi RS7', fiyat: 150000, emoji: '🚗', typeKey: 'sedan' },
  { type: 'Sedan', model: 'Toyota Camry', fiyat: 150000, emoji: '🚗', typeKey: 'sedan' },
  { type: 'Sedan', model: 'Honda Accord', fiyat: 150000, emoji: '🚗', typeKey: 'sedan' },
  { type: 'Sedan', model: 'Volvo S90', fiyat: 150000, emoji: '🚗', typeKey: 'sedan' },
  { type: 'Sedan', model: 'Lexus ES', fiyat: 150000, emoji: '🚗', typeKey: 'sedan' },
  { type: 'Sedan', model: 'Hyundai Sonata', fiyat: 150000, emoji: '🚗', typeKey: 'sedan' },
  { type: 'Spor Araba', model: 'Ferrari SF90', fiyat: 500000, emoji: '🏎️', typeKey: 'spor' },
  { type: 'Spor Araba', model: 'Lamborghini Aventador', fiyat: 500000, emoji: '🏎️', typeKey: 'spor' },
  { type: 'Spor Araba', model: 'Porsche 911 Turbo', fiyat: 500000, emoji: '🏎️', typeKey: 'spor' },
  { type: 'Spor Araba', model: 'McLaren 720S', fiyat: 500000, emoji: '🏎️', typeKey: 'spor' },
  { type: 'Spor Araba', model: 'Bugatti Chiron', fiyat: 500000, emoji: '🏎️', typeKey: 'spor' },
  { type: 'Spor Araba', model: 'Aston Martin DBS', fiyat: 500000, emoji: '🏎️', typeKey: 'spor' },
  { type: 'Spor Araba', model: 'Maserati MC20', fiyat: 500000, emoji: '🏎️', typeKey: 'spor' },
  { type: 'Spor Araba', model: 'Koenigsegg Jesko', fiyat: 500000, emoji: '🏎️', typeKey: 'spor' },
  { type: 'Spor Araba', model: 'Pagani Huayra', fiyat: 500000, emoji: '🏎️', typeKey: 'spor' },
  { type: 'Ferrari', model: 'SF90 Stradale', fiyat: 750000, emoji: '🏎️', typeKey: 'ferrari' },
  { type: 'Ferrari', model: 'F8 Tributo', fiyat: 750000, emoji: '🏎️', typeKey: 'ferrari' },
  { type: 'Ferrari', model: '296 GTB', fiyat: 750000, emoji: '🏎️', typeKey: 'ferrari' },
  { type: 'Ferrari', model: 'Roma', fiyat: 750000, emoji: '🏎️', typeKey: 'ferrari' },
  { type: 'Ferrari', model: '812 Superfast', fiyat: 750000, emoji: '🏎️', typeKey: 'ferrari' },
  { type: 'Ferrari', model: 'LaFerrari', fiyat: 750000, emoji: '🏎️', typeKey: 'ferrari' },
  { type: 'Ferrari', model: 'F40', fiyat: 750000, emoji: '🏎️', typeKey: 'ferrari' },
  { type: 'Lamborghini', model: 'Aventador', fiyat: 800000, emoji: '🏎️', typeKey: 'lamborghini' },
  { type: 'Lamborghini', model: 'Huracan', fiyat: 800000, emoji: '🏎️', typeKey: 'lamborghini' },
  { type: 'Lamborghini', model: 'Urus', fiyat: 800000, emoji: '🏎️', typeKey: 'lamborghini' },
  { type: 'Lamborghini', model: 'Countach', fiyat: 800000, emoji: '🏎️', typeKey: 'lamborghini' },
  { type: 'Lamborghini', model: 'Sian', fiyat: 800000, emoji: '🏎️', typeKey: 'lamborghini' },
  { type: 'Lamborghini', model: 'Revuelto', fiyat: 800000, emoji: '🏎️', typeKey: 'lamborghini' },
  { type: 'Lamborghini', model: 'Murcielago', fiyat: 800000, emoji: '🏎️', typeKey: 'lamborghini' },
];

const VEHICLES_PER_PAGE = 5;
const TOTAL_VEHICLE_PAGES = Math.ceil(allVehicles.length / VEHICLES_PER_PAGE);

const evTypes = [
  { ad: 'Kucuk Ev', fiyat: 50000, emoji: '🏠', key: 'kucuk' },
  { ad: 'Daire', fiyat: 75000, emoji: '🏢', key: 'daire' },
  { ad: 'Orta Ev', fiyat: 100000, emoji: '🏡', key: 'orta' },
  { ad: 'Yazlik', fiyat: 150000, emoji: '🏖️', key: 'yazlik' },
  { ad: 'Dublex', fiyat: 175000, emoji: '🏠', key: 'dublex' },
  { ad: 'Ciftlik Evi', fiyat: 200000, emoji: '🌾', key: 'ciftlik' },
  { ad: 'Buyuk Ev', fiyat: 250000, emoji: '🏘️', key: 'buyuk' },
  { ad: 'Loft', fiyat: 350000, emoji: '🎨', key: 'loft' },
  { ad: 'Villa', fiyat: 500000, emoji: '🏰', key: 'villa' },
  { ad: 'Penthouse', fiyat: 750000, emoji: '🌆', key: 'penthouse' },
  { ad: 'Kosk', fiyat: 1000000, emoji: '🏛️', key: 'kosk' },
  { ad: 'Prestij Villa', fiyat: 2000000, emoji: '💎', key: 'prestij' },
  { ad: 'Yali', fiyat: 5000000, emoji: '⛵', key: 'yali' },
];

const EV_PER_PAGE = 5;
const TOTAL_EV_PAGES = Math.ceil(evTypes.length / EV_PER_PAGE);

function buildVehicleCatalogEmbed(page = 0, author) {
  const start = page * VEHICLES_PER_PAGE;
  const pageItems = allVehicles.slice(start, start + VEHICLES_PER_PAGE);
  const lines = pageItems.map((v, i) => `**${start + i + 1}.** ${v.emoji} **${v.model}** (${v.type}) — \`${v.fiyat.toLocaleString()} coin\``);
  const totalVehicles = allVehicles.length;
  const text = `**🚗 Araç Kataloğu**\n\nToplam **${totalVehicles}** araç — numarasını seçip satın al!\n\n${lines.join('\n')}\n\nSayfa ${page + 1}/${TOTAL_VEHICLE_PAGES} • **1-${totalVehicles}** arası numara ile satın al\n\n-# Infermus League`;
  return Container([T(text)]);
}

function buildVehicleCatalogRow(page = 0) {
  const start = page * VEHICLES_PER_PAGE;
  const pageItems = allVehicles.slice(start, start + VEHICLES_PER_PAGE);
  const buyRow = new ActionRowBuilder().addComponents(
    pageItems.map((v, i) => new ButtonBuilder().setCustomId(`arac_buy_${start + i}`).setLabel(`${start + i + 1}`).setStyle(ButtonStyle.Success))
  );
  const navRow = new ActionRowBuilder();
  if (page > 0) navRow.addComponents(new ButtonBuilder().setCustomId(`arac_catalog_page_${page - 1}`).setLabel('◀ Onceki').setStyle(ButtonStyle.Secondary));
  if (page < TOTAL_VEHICLE_PAGES - 1) navRow.addComponents(new ButtonBuilder().setCustomId(`arac_catalog_page_${page + 1}`).setLabel('Sonraki ▶').setStyle(ButtonStyle.Secondary));
  const rows = [buyRow.toJSON()];
  if (navRow.components.length > 0) rows.push(navRow.toJSON());
  return rows;
}

function buildEvCatalogEmbed(page = 0, author) {
  const start = page * EV_PER_PAGE;
  const pageItems = evTypes.slice(start, start + EV_PER_PAGE);
  const lines = pageItems.map((e, i) => `**${start + i + 1}.** ${e.emoji} **${e.ad}** — \`${e.fiyat.toLocaleString()} coin\``);
  const text = `**🏠 Ev Kataloğu**\n\nToplam **${evTypes.length}** ev\n\n${lines.join('\n')}\n\nSayfa ${page + 1}/${TOTAL_EV_PAGES}\n\n-# Infermus League`;
  return Container([T(text)]);
}

function buildEvCatalogRow(page = 0) {
  const start = page * EV_PER_PAGE;
  const pageItems = evTypes.slice(start, start + EV_PER_PAGE);
  const buyRow = new ActionRowBuilder().addComponents(
    pageItems.map((e, i) => new ButtonBuilder().setCustomId(`ev_buy_${start + i}`).setLabel(`${start + i + 1}`).setStyle(ButtonStyle.Success))
  );
  const navRow = new ActionRowBuilder();
  if (page > 0) navRow.addComponents(new ButtonBuilder().setCustomId(`ev_catalog_page_${page - 1}`).setLabel('◀ Onceki').setStyle(ButtonStyle.Secondary));
  if (page < TOTAL_EV_PAGES - 1) navRow.addComponents(new ButtonBuilder().setCustomId(`ev_catalog_page_${page + 1}`).setLabel('Sonraki ▶').setStyle(ButtonStyle.Secondary));
  const rows = [buyRow.toJSON()];
  if (navRow.components.length > 0) rows.push(navRow.toJSON());
  return rows;
}

function buildVehicleInfoRow(page = 0) {
  const navRow = new ActionRowBuilder();
  if (page > 0) navRow.addComponents(new ButtonBuilder().setCustomId(`arac_info_page_${page - 1}`).setLabel('◀ Onceki').setStyle(ButtonStyle.Secondary));
  if (page < TOTAL_VEHICLE_PAGES - 1) navRow.addComponents(new ButtonBuilder().setCustomId(`arac_info_page_${page + 1}`).setLabel('Sonraki ▶').setStyle(ButtonStyle.Secondary));
  return navRow.components.length > 0 ? [navRow.toJSON()] : [];
}

function buildEvInfoRow(page = 0) {
  const navRow = new ActionRowBuilder();
  if (page > 0) navRow.addComponents(new ButtonBuilder().setCustomId(`ev_info_page_${page - 1}`).setLabel('◀ Onceki').setStyle(ButtonStyle.Secondary));
  if (page < TOTAL_EV_PAGES - 1) navRow.addComponents(new ButtonBuilder().setCustomId(`ev_info_page_${page + 1}`).setLabel('Sonraki ▶').setStyle(ButtonStyle.Secondary));
  return navRow.components.length > 0 ? [navRow.toJSON()] : [];
}

module.exports = {
  adminevtext: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const container1 = buildEvCatalogEmbed(0, message.author);
      const rows1 = buildEvInfoRow(0);
      container1.components.push(...rows1);
      message.channel.send({ components: [container1], flags: MessageFlags.IsComponentsV2 });
    }
  },
  adminarabatext: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const container2 = buildVehicleCatalogEmbed(0, message.author);
      const rows2 = buildVehicleInfoRow(0);
      container2.components.push(...rows2);
      message.channel.send({ components: [container2], flags: MessageFlags.IsComponentsV2 });
    }
  },
  admindestektext: {
    execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      message.channel.send({ components: [Container([T(`**🎫 Destek Sistemi**\n\nDestek talebi oluşturmak için butona tıklayın.\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  evaç: {
    execute(message, args) {
      if (args.length > 0) {
        const num = parseInt(args[0]);
        if (isNaN(num) || num < 1 || num > evTypes.length) return message.reply(`Gecersiz numara! 1-${evTypes.length} arasi bir sayi girin.`);
        const ev = evTypes[num - 1];
        const userData = db.get(`users.${message.author.id}`) || {};
        const balance = typeof userData.balance === 'number' ? userData.balance : 0;
        const userEvler = db.get(`evler.${message.guild?.id}.${message.author.id}`, []);
        if (userEvler.length >= 1) return message.reply('Zaten bir mülkün bulunuyor!');
        if (balance < ev.fiyat) return message.reply(`Yetersiz bakiye! \`${ev.fiyat.toLocaleString()} coin\` gerekiyor, \`${balance.toLocaleString()} coin\` bakiyen var.`);
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`ev_buy_${num - 1}`).setLabel('Satın Al').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId('ev_iptal').setLabel('İptal').setStyle(ButtonStyle.Danger)
        );
        message.channel.send({ components: [Container([T(`Satın almak istediğin ev:\n\n${ev.emoji} **${ev.ad}** — \`${ev.fiyat.toLocaleString()} coin\`\n\n-# Infermus League`), row.toJSON()])], flags: MessageFlags.IsComponentsV2 });
        return;
      }
      const container3 = buildEvCatalogEmbed(0, message.author);
      const rows3 = buildEvCatalogRow(0);
      container3.components.push(...rows3);
      message.channel.send({ components: [container3], flags: MessageFlags.IsComponentsV2 });
    }
  },
  araçal: {
    execute(message, args) {
      if (args.length > 0) {
        const num = parseInt(args[0]);
        if (isNaN(num) || num < 1 || num > allVehicles.length) return message.reply(`Gecersiz numara! 1-${allVehicles.length} arasi bir sayi girin.`);
        const vehicle = allVehicles[num - 1];
        const userData = db.get(`users.${message.author.id}`) || {};
        const balance = typeof userData.balance === 'number' ? userData.balance : 0;
        const userAraclar = db.get(`araclar.${message.guild?.id}.${message.author.id}`, []);
        if (userAraclar.length >= 3) return message.reply('En fazla 3 araca sahip olabilirsin!');
        if (balance < vehicle.fiyat) return message.reply(`Yetersiz bakiye! \`${vehicle.fiyat.toLocaleString()} coin\` gerekiyor, \`${balance.toLocaleString()} coin\` bakiyen var.`);
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`arac_buy_${num - 1}`).setLabel('Satın Al').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId('arac_iptal').setLabel('İptal').setStyle(ButtonStyle.Danger)
        );
        message.channel.send({ components: [Container([T(`Satın almak istediğin araç:\n\n${vehicle.emoji} **${vehicle.model}** (${vehicle.type}) — \`${vehicle.fiyat.toLocaleString()} coin\`\n\n-# Infermus League`), row.toJSON()])], flags: MessageFlags.IsComponentsV2 });
        return;
      }
      const container4 = buildVehicleCatalogEmbed(0, message.author);
      const rows4 = buildVehicleCatalogRow(0);
      container4.components.push(...rows4);
      message.channel.send({ components: [container4], flags: MessageFlags.IsComponentsV2 });
    }
  },
  araçlarım: {
    execute(message) {
      const user = message.mentions.users.first() || message.author;
      const araclar = db.get(`araclar.${message.guild?.id}.${user.id}`, []);
      if (araclar.length === 0) return message.channel.send(`${user} kayıtlı araç bulunmuyor.`);
      const tipEmoji = { 'Bisiklet': '🚲', 'Motosiklet': '🏍️', 'Sedan': '🚗', 'Spor Araba': '🏎️', 'Ferrari': '🏎️', 'Lamborghini': '🏎️' };
      const desc = araclar.map((a, i) => `**${i + 1}.** ${tipEmoji[a.tip] || '🚗'} **${a.model}** (${a.tip}) — ${a.fiyat.toLocaleString()} coin`).join('\n');
      message.channel.send(`${user} araçları:\n${desc}`);
    }
  },
  mülklerim: {
    execute(message) {
      const user = message.mentions.users.first() || message.author;
      const evler = db.get(`evler.${message.guild?.id}.${user.id}`, []);
      if (evler.length === 0) return message.channel.send(`${user} kayıtlı mülk bulunmuyor.`);
      const desc = evler.map((e, i) => `**${i + 1}.** ${e.isim} - ${e.fiyat} coin`).join('\n');
      message.channel.send(`${user} mülkleri:\n${desc}`);
    }
  },
  evsat: {
    execute(message) {
      const evler = db.get(`evler.${message.guild?.id}.${message.author.id}`, []);
      if (evler.length === 0) return message.reply('Satacak mülkün bulunmuyor!');
      const row = new ActionRowBuilder().addComponents(
        evler.map((e, i) =>
          new ButtonBuilder().setCustomId(`evsat_${message.author.id}_${i}`).setLabel(`Sat: ${e.isim}`).setEmoji('🏠').setStyle(ButtonStyle.Danger)
        )
      );
      message.channel.send({ components: [Container([T(`${message.author} satmak istediğin mülkü seç:`), row.toJSON()])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  araçsat: {
    execute(message) {
      const araclar = db.get(`araclar.${message.guild?.id}.${message.author.id}`, []);
      if (araclar.length === 0) return message.reply('Satacak aracın bulunmuyor!');
      const row = new ActionRowBuilder().addComponents(
        araclar.map((a, i) =>
          new ButtonBuilder().setCustomId(`aracsat_${message.author.id}_${i}`).setLabel(`${a.model} (${a.tip})`).setEmoji('🚗').setStyle(ButtonStyle.Danger)
        )
      );
      message.channel.send({ components: [Container([T(`${message.author} satmak istediğin aracı seç:`), row.toJSON()])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  ticketolustur: {
    async execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const text = `**${E.CL_ticket} Destek Sistemi**\n\nMerhaba! **${message.guild.name}** sunucusunda destek almak için aşağıdaki butonu kullan.\n\n> ${E.CL_sag_ok} Ticket oluşturduktan sonra yetkililer en kısa sürede sana yardımcı olacak.\n\n━━━━━━━━━━━━━━━━━━━━━━\n**${E.CL_kilit} Kurallar**\n${E.CL_sag_ok} Gereksiz ticket açmayın\n${E.CL_sag_ok} Yetkililere saygılı olun\n${E.CL_sag_ok} Küfür/hakaret yasaktır\n${E.CL_sag_ok} Aynı konu için tek ticket açın\n${E.CL_sag_ok} Çözülmeden kapatmayın\n\n━━━━━━━━━━━━━━━━━━━━━━\n**${E.CL_yonetim} Kullanım Alanları**\n${E.CL_kalkan} Yetkili başvurusu & bilgi\n${E.CL_duyuru} Sunucu hakkında sorular\n${E.CL_carpi} Hata bildirimi\n${E.CL_electro_money} Değer/ekonomi talepleri\n${E.CL_pano} Diğer destek talepleri\n\n-# Infermus League`;
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('ticket_olustur').setLabel('Ticket Oluştur').setStyle(ButtonStyle.Primary).setEmoji(E.CL_ticket)
      );
      await message.channel.send({ components: [Container([T(text), row.toJSON()])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  itiraftextadmin: {
    async execute(message) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const text = `\`\`\`fix\nAnonim olarak itirafını paylaş\n\`\`\`\n\n${E.CL_pembe_kitap} Butona tıkla, itirafını yaz, anonim yayınlansın!\n\n> ${E.CL_uyari} İtiraflar **anonim** olarak paylaşılır.\n> ${E.CL_kirmizikalp} Kimliğin asla açıklanmaz.\n\n-# Infermus League`;
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('itiraf_gonder').setLabel('İtiraf Gönder').setStyle(ButtonStyle.Secondary).setEmoji('🙏')
      );
      await message.channel.send({ components: [Container([T(text), row.toJSON()])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  dmmesaj: {
    async execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const user = message.mentions.users.first();
      if (!user) return message.reply('Kullanım: .dmmesaj @kullanıcı (mesaj)');
      const text = args.slice(1).join(' ');
      if (!text) return message.reply('Mesaj girin!');
      try {
        await user.send(text);
        message.channel.send(`✅ ${user} adlı kullanıcıya DM gönderildi.`);
      } catch { message.reply('DM gönderilemedi. Kullanıcı DM\'leri kapalı olabilir.'); }
    }
  },
  mesaj: {
    async execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const channel = message.mentions.channels.first();
      if (!channel) return message.reply('Kullanım: .mesaj #kanal (mesaj)');
      const text = args.slice(1).join(' ');
      if (!text) return message.reply('Mesaj girin!');
      await channel.send(text);
      message.reply('Mesaj gönderildi.');
    }
  },
  konuştur: {
    async execute(message, args) {
      if (!message.member.permissions.has('ManageWebhooks')) return message.reply('Yetkiniz yok!');
      const text = args.join(' ');
      if (!text) return message.reply('Kullanım: .konuştur (mesaj)');
      try {
        const webhook = await message.channel.createWebhook({ name: message.member.displayName, avatar: message.author.displayAvatarURL() });
        await webhook.send(text);
        await webhook.delete();
        await message.delete().catch(() => {});
      } catch { message.reply('Webhook ile mesaj gönderilemedi.'); }
    }
  },
  yaz: {
    execute(message, args) {
      const text = args.join(' ');
      if (!text) return message.reply('Kullanım: .yaz (mesaj)');
      message.channel.send(text);
      message.delete().catch(() => {});
    }
  },
  yazembed: {
    execute(message, args) {
      const text = args.join(' ');
      if (!text) return message.reply('Kullanım: .yazembed (mesaj)');
      message.channel.send({ components: [Container([T(`${text}\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
      message.delete().catch(() => {});
    }
  },
  v2yaz: {
    execute(message, args) {
      const text = args.join(' ');
      if (!text) return message.reply('Kullanım: .v2yaz (mesaj)');
      message.channel.send({ content: text, components: [] });
      message.delete().catch(() => {});
    }
  },
  timer: {
    execute(message, args) {
      const time = parseInt(args[0]);
      if (isNaN(time) || time <= 0) return message.reply('Kullanım: .timer (saniye) (mesaj)');
      const text = args.slice(1).join(' ') || 'Zaman doldu!';
      message.channel.send(`⏱ **${time}** saniye sonra hatırlatacağım: ${text}`);
      setTimeout(() => {
        message.channel.send(`${message.author} ⏰ **${text}**`);
      }, time * 1000);
    }
  },
  not: {
    execute(message, args) {
      const text = args.join(' ');
      if (!text) return message.reply('Kullanım: .not (içerik)');
      const notlar = db.get(`notlar.${message.author.id}`, []);
      notlar.push({ id: Date.now(), icerik: text, tarih: new Date().toISOString() });
      db.set(`notlar.${message.author.id}`, notlar);
      message.channel.send(`📝 Not oluşturuldu: **${text}**`);
    }
  },
  notlar: {
    execute(message) {
      const notlar = db.get(`notlar.${message.author.id}`, []);
      if (notlar.length === 0) return message.channel.send('Hiç notun bulunmuyor. `.not (içerik)` ile not ekle.');
      const desc = notlar.map((n, i) => `**${i + 1}.** ${n.icerik} — <t:${Math.floor(new Date(n.tarih).getTime() / 1000)}:R>`).join('\n');
      message.channel.send({ components: [Container([T(`**📋 ${message.author.username} - Notlar**\n\n${desc}\n\n-# Infermus League`)])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  scooter: {
    execute(message) {
      const text = `\`\`\`fix\nYetkililer için hızlı aksiyon paneli\n\`\`\`\n\n${E.CL_beyaz_iksir} **Hızlı İşlemler** — tek tıkla aşağıdaki işlemleri yap\n${E.CL_kalkan} **Koruma** — koruma durumunu görüntüle\n${E.CL_duyuru} **Duyuru** — hızlı duyuru gönder\n${E.CL_kilit} **Kanal Kilitle** — kanalı anında kilitle/aç\n${E.sil} **Mesaj Temizle** — belirli sayıda mesaj sil\n\n> ⏳ Butonlara tıklayarak işlemleri gerçekleştirebilirsin.\n\n-# Infermus League`;
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('scooter_koruma').setLabel('Koruma').setEmoji('🛡️').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('scooter_duyuru').setLabel('Duyuru').setEmoji('📢').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('scooter_lock').setLabel('Kilit').setEmoji('🔒').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('scooter_sil').setLabel('Temizle').setEmoji('🗑️').setStyle(ButtonStyle.Secondary),
      );
      message.channel.send({ components: [Container([T(text), row.toJSON()])], flags: MessageFlags.IsComponentsV2 });
    }
  },
  dyc: {
    execute(message, args) {
      message.channel.send(`Test komutu çalıştırıldı. Argümanlar: ${args.join(' ') || 'yok'}`);
    }
  },
  electropremium: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      message.channel.send('Electro Premium yönetimi. Kullanım: `.electropremium @kullanıcı (süre_gün)`');
    }
  },
  ticketrolata: {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      const role = message.mentions.roles.first();
      if (!role) return message.reply('Kullanım: `.ticketrolata @ticketyetkilisirol`');
      const db = require('../database/db');
      db.set(`ticketRol.${message.guild.id}`, role.id);
      message.reply(`✅ Ticket rolü ${role} olarak ayarlandı. Ticket açılınca bu rol etiketlenecek.`);
    }
  },
  buildVehicleInfoRow, buildEvInfoRow, allVehicles, buildVehicleCatalogEmbed, buildVehicleCatalogRow, buildEvCatalogEmbed, buildEvCatalogRow, evTypes, VEHICLES_PER_PAGE, TOTAL_VEHICLE_PAGES, EV_PER_PAGE, TOTAL_EV_PAGES,
};
