const { EmbedBuilder } = require('discord.js');
const E = require('../config/emojis');
const db = require('../database/db');

const KUFUR_LIST = [
  'amk', 'aq', 'orospu', 'orosbu', 'oruspu', 'orusbu',
  'piç', 'pıç', 'sik', 's1k', 'sikiyim', 'sikeyim', 'sikm', 'sikik',
  'yarrak', 'yaraq', 'amcık', 'amcik', 'göt', 'got', 'ibne', 'ibine',
  'pezevenk', 'puşt', 'pust', 'kahbe', 'kahpe',
  'orospuçocuğu', 'orospucocugu', 'oruspuçocuğu', 'oruspucocugu',
  'oruspuevladi', 'orospuevladi',
  'ananı', 'babanı', 'sikerim', 's1kerim', 'siktir', 's1ktir', 'siktirgit',
  'amına', 'amina', 'amuna', 'amkoyim', 'mk', 'salak',
  'embesil', 'andavallı', 'ezik',
];

const REKLAM_PATTERNS = [
  /discord\.gg\//i, /discord\.com\/invite\//i, /davet\.gg\//i,
  /\.gg\//i,
];

function getConfig(guildId) {
  const def = {
    flood: { enabled: false, limit: 4, time: 5000 },
    kufur: { enabled: false },
    link: { enabled: false },
    reklam: { enabled: false },
    caps: { enabled: false, minLen: 10, ratio: 0.7 },
    mention: { enabled: false, max: 5 },
    resim: { enabled: false },
    antiNuke: { enabled: false, maxAction: 3, timeWindow: 10000 },
    antiKanal: { enabled: false },
    antiRol: { enabled: false },
    antiBan: { enabled: false },
    antiBot: { enabled: false },
    antiWebhook: { enabled: false },
    logKanal: null,
    whitelist: [],
  };
  const stored = db.get(`guard.${guildId}`);
  if (!stored || typeof stored !== 'object') return def;
  const merged = { ...def };
  for (const key of Object.keys(def)) {
    if (stored[key] === undefined || stored[key] === null) continue;
    if (typeof stored[key] === 'object' && typeof def[key] === 'object' && def[key] !== null && stored[key] !== null) {
      merged[key] = { ...def[key], ...stored[key] };
    } else {
      merged[key] = stored[key];
    }
  }
  if (stored.logKanal) merged.logKanal = stored.logKanal;
  if (stored.whitelist) merged.whitelist = stored.whitelist;
  return merged;
}

const floodMap = new Map();
const actionLog = new Map();

function checkFlood(guildId, userId) {
  const key = `${guildId}:${userId}`;
  const now = Date.now();
  if (!floodMap.has(key)) {
    floodMap.set(key, [now]);
    return false;
  }
  const times = floodMap.get(key);
  const cfg = getConfig(guildId).flood;
  const recent = times.filter(t => now - t < cfg.time);
  recent.push(now);
  floodMap.set(key, recent.slice(-10));
  return recent.length > cfg.limit;
}

function hasLink(text) {
  return /https?:\/\//i.test(text) || /\b[a-z0-9.-]+\.[a-z]{2,}\b/i.test(text);
}

function hasReklam(text) {
  return REKLAM_PATTERNS.some(p => p.test(text));
}

function capsRatio(text) {
  const letters = text.replace(/[^a-zA-ZÇçĞğİiÖöŞşÜü]/g, '');
  if (letters.length === 0) return 0;
  return letters.split('').filter(c => c === c.toUpperCase() && c !== c.toLowerCase()).length / letters.length;
}

function hasKufur(text) {
  const words = text.toLowerCase().split(/[^a-zçğıiöşü0-9]+/).filter(Boolean);
  if (words.some(w => KUFUR_LIST.includes(w))) return true;
  const norm = text.toLowerCase().replace(/[ö]/g, 'o').replace(/[ü]/g, 'u').replace(/[şı]/g, 'i').replace(/[ç]/g, 'c').replace(/[ğ]/g, 'g');
  const normWords = norm.split(/[^a-z0-9]+/).filter(Boolean);
  return normWords.some(w => KUFUR_LIST.includes(w));
}

function isEnabled(cfg, key) {
  const v = cfg?.[key];
  if (v === true || v === false) return v;
  return !!(v?.enabled);
}

function checkAll(message) {
  try {
    const cfg = getConfig(message.guild.id);
    if (!cfg) return null;
    if (message.member?.permissions?.has?.('Administrator')) return null;
    if (message.member?.permissions?.has?.('ManageMessages')) return null;

    if (isEnabled(cfg, 'flood') && checkFlood(message.guild.id, message.author.id))
      return { type: 'flood', reason: 'Flood tespit edildi.', delete: true };
    if (isEnabled(cfg, 'kufur') && hasKufur(message.content))
      return { type: 'kufur', reason: 'Küfür/yasaklı kelime tespit edildi.', delete: true };
    if (isEnabled(cfg, 'reklam') && hasReklam(message.content))
      return { type: 'reklam', reason: 'Reklam tespit edildi.', delete: true };
    if (isEnabled(cfg, 'link') && hasLink(message.content))
      return { type: 'link', reason: 'Link göndermek yasak.', delete: true };
    if (isEnabled(cfg, 'caps') && message.content.length >= (cfg.caps?.minLen ?? 10) && capsRatio(message.content) > (cfg.caps?.ratio ?? 0.7))
      return { type: 'caps', reason: 'Çok fazla büyük harf kullanımı.', delete: false };
    if (isEnabled(cfg, 'mention') && message.mentions?.users?.size > (cfg.mention?.max ?? 5))
      return { type: 'mention', reason: 'Çok fazla etiketleme.', delete: true };
    if (isEnabled(cfg, 'resim') && message.attachments?.size > 0)
      return { type: 'resim', reason: 'Resim göndermek yasak.', delete: true };
    return null;
  } catch (e) {
    console.error('[Guard] checkAll hatası:', e.message);
    return null;
  }
}

function isWhitelisted(guildId, member) {
  if (!member) return false;
  if (member.permissions?.has?.('Administrator')) return true;
  const cfg = getConfig(guildId);
  return cfg.whitelist.includes(member.id) || member.roles?.cache?.some(r => cfg.whitelist.includes(r.id));
}

function sendLog(guild, embed) {
  const cfg = getConfig(guild.id);
  if (!cfg.logKanal) return;
  const ch = guild.channels.cache.get(cfg.logKanal);
  if (ch) ch.send({ embeds: [embed] }).catch(() => {});
}

async function handleChannelCreate(channel) {
  if (!channel.guild) return;
  const cfg = getConfig(channel.guild.id);
  if (!cfg.antiNuke?.enabled && !cfg.antiKanal?.enabled) return;
  const audit = await channel.guild.fetchAuditLogs({ limit: 1, type: 10 }).catch(() => null);
  if (!audit) return;
  const entry = audit.entries.first();
  if (!entry) return;
  if (isWhitelisted(channel.guild.id, entry.executor)) return;

  const embed = new EmbedBuilder()
    .setColor(0xFF0000)
    .setAuthor({ name: entry.executor?.tag || 'Bilinmiyor', iconURL: entry.executor?.displayAvatarURL() })
    .setTitle(`${E.CL_carpi} Kanal Oluşturma Engellendi`)
    .setDescription([
      `**Kanal:** ${channel.name} (${channel.id})`,
      `**Tür:** ${channel.type === 0 ? 'Metin' : channel.type === 2 ? 'Ses' : 'Diğer'}`,
      `**Yetkili:** ${entry.executor?.tag || 'Bilinmiyor'} (<@${entry.executor?.id || '?'}>)`,
    ].join('\n'))
    .setTimestamp();
  sendLog(channel.guild, embed);
  await channel.delete().catch(() => {});
}

async function handleChannelDelete(channel) {
  if (!channel.guild) return;
  const cfg = getConfig(channel.guild.id);
  if (!cfg.antiNuke?.enabled && !cfg.antiKanal?.enabled) return;
  const audit = await channel.guild.fetchAuditLogs({ limit: 1, type: 12 }).catch(() => null);
  if (!audit) return;
  const entry = audit.entries.first();
  if (!entry) return;
  if (isWhitelisted(channel.guild.id, entry.executor)) return;

  const embed = new EmbedBuilder()
    .setColor(0xFF0000)
    .setAuthor({ name: entry.executor?.tag || 'Bilinmiyor', iconURL: entry.executor?.displayAvatarURL() })
    .setTitle(`${E.CL_carpi} Kanal Silme Tespit Edildi`)
    .setDescription([
      `**Silinen Kanal:** ${channel.name} (${channel.id})`,
      `**Tür:** ${channel.type === 0 ? 'Metin' : channel.type === 2 ? 'Ses' : 'Diğer'}`,
      `**Yetkili:** ${entry.executor?.tag || 'Bilinmiyor'} (<@${entry.executor?.id || '?'}>)`,
    ].join('\n'))
    .setTimestamp();
  sendLog(channel.guild, embed);
}

async function handleRoleCreate(role) {
  if (!role.guild) return;
  const cfg = getConfig(role.guild.id);
  if (!cfg.antiNuke?.enabled && !cfg.antiRol?.enabled) return;
  const audit = await role.guild.fetchAuditLogs({ limit: 1, type: 30 }).catch(() => null);
  if (!audit) return;
  const entry = audit.entries.first();
  if (!entry) return;
  if (isWhitelisted(role.guild.id, entry.executor)) return;

  const embed = new EmbedBuilder()
    .setColor(0xFF0000)
    .setAuthor({ name: entry.executor?.tag || 'Bilinmiyor', iconURL: entry.executor?.displayAvatarURL() })
    .setTitle(`${E.CL_carpi} Rol Oluşturma Engellendi`)
    .setDescription([
      `**Rol:** ${role.name} (${role.id})`,
      `**Yetkili:** ${entry.executor?.tag || 'Bilinmiyor'} (<@${entry.executor?.id || '?'}>)`,
    ].join('\n'))
    .setTimestamp();
  sendLog(role.guild, embed);
  await role.delete().catch(() => {});
}

async function handleRoleDelete(role) {
  if (!role.guild) return;
  const cfg = getConfig(role.guild.id);
  if (!cfg.antiNuke?.enabled && !cfg.antiRol?.enabled) return;
  const audit = await role.guild.fetchAuditLogs({ limit: 1, type: 32 }).catch(() => null);
  if (!audit) return;
  const entry = audit.entries.first();
  if (!entry) return;
  if (isWhitelisted(role.guild.id, entry.executor)) return;

  const embed = new EmbedBuilder()
    .setColor(0xFF0000)
    .setAuthor({ name: entry.executor?.tag || 'Bilinmiyor', iconURL: entry.executor?.displayAvatarURL() })
    .setTitle(`${E.CL_carpi} Rol Silme Tespit Edildi`)
    .setDescription([
      `**Silinen Rol:** ${role.name} (${role.id})`,
      `**Yetkili:** ${entry.executor?.tag || 'Bilinmiyor'} (<@${entry.executor?.id || '?'}>)`,
    ].join('\n'))
    .setTimestamp();
  sendLog(role.guild, embed);
}

async function handleGuildBanAdd(ban) {
  if (!ban.guild) return;
  const cfg = getConfig(ban.guild.id);
  if (!cfg.antiNuke?.enabled && !cfg.antiBan?.enabled) return;
  const audit = await ban.guild.fetchAuditLogs({ limit: 1, type: 22 }).catch(() => null);
  if (!audit) return;
  const entry = audit.entries.first();
  if (!entry) return;
  if (isWhitelisted(ban.guild.id, entry.executor)) return;

  const embed = new EmbedBuilder()
    .setColor(0xFF0000)
    .setAuthor({ name: entry.executor?.tag || 'Bilinmiyor', iconURL: entry.executor?.displayAvatarURL() })
    .setTitle(`${E.CL_carpi} Yasaklama Tespit Edildi`)
    .setDescription([
      `**Yasaklanan:** ${ban.user?.tag || 'Bilinmiyor'} (${ban.user?.id || '?'})`,
      `**Yetkili:** ${entry.executor?.tag || 'Bilinmiyor'} (<@${entry.executor?.id || '?'}>)`,
    ].join('\n'))
    .setTimestamp();
  sendLog(ban.guild, embed);

  if (cfg.antiBan?.enabled) {
    await ban.guild.members.unban(ban.user.id).catch(() => {});
  }
}

async function handleGuildMemberRemove(member) {
  if (!member.guild) return;
  const cfg = getConfig(member.guild.id);
  if (!cfg.antiNuke?.enabled) return;
  const audit = await member.guild.fetchAuditLogs({ limit: 1, type: 20 }).catch(() => null);
  if (!audit) return;
  const entry = audit.entries.first();
  if (!entry || entry.target?.id !== member.id) return;
  if (isWhitelisted(member.guild.id, entry.executor)) return;

  const embed = new EmbedBuilder()
    .setColor(0xFFA500)
    .setAuthor({ name: entry.executor?.tag || 'Bilinmiyor', iconURL: entry.executor?.displayAvatarURL() })
    .setTitle(`${E.CL_uyari} Üye Atıldı (Kick)`)
    .setDescription([
      `**Atılan:** ${member.user?.tag || 'Bilinmiyor'} (${member.id})`,
      `**Yetkili:** ${entry.executor?.tag || 'Bilinmiyor'} (<@${entry.executor?.id || '?'}>)`,
      `**Sebep:** ${entry.reason || 'Belirtilmemiş'}`,
    ].join('\n'))
    .setTimestamp();
  sendLog(member.guild, embed);
}

async function handleGuildUpdate(oldGuild, newGuild) {
  const cfg = getConfig(newGuild.id);
  if (!cfg.antiNuke?.enabled) return;
  const audit = await newGuild.fetchAuditLogs({ limit: 1, type: 1 }).catch(() => null);
  if (!audit) return;
  const entry = audit.entries.first();
  if (!entry) return;
  if (isWhitelisted(newGuild.id, entry.executor)) return;

  let changes = [];
  if (oldGuild.name !== newGuild.name) changes.push(`**Sunucu Adı:** ${oldGuild.name} → ${newGuild.name}`);
  if (oldGuild.icon !== newGuild.icon) changes.push('**Sunucu İkonu:** Değiştirildi');
  if (changes.length === 0) return;

  const embed = new EmbedBuilder()
    .setColor(0xFFA500)
    .setAuthor({ name: entry.executor?.tag || 'Bilinmiyor', iconURL: entry.executor?.displayAvatarURL() })
    .setTitle(`${E.CL_uyari} Sunucu Ayarları Değiştirildi`)
    .setDescription([
      changes.join('\n'),
      '',
      `**Yetkili:** ${entry.executor?.tag || 'Bilinmiyor'} (<@${entry.executor?.id || '?'}>)`,
    ].join('\n'))
    .setTimestamp();
  sendLog(newGuild, embed);
}

async function handleWebhookCreate(webhook) {
  if (!webhook.guild) return;
  const cfg = getConfig(webhook.guild.id);
  if (!cfg.antiNuke?.enabled && !cfg.antiWebhook?.enabled) return;
  const audit = await webhook.guild.fetchAuditLogs({ limit: 1, type: 50 }).catch(() => null);
  if (!audit) return;
  const entry = audit.entries.first();
  if (!entry) return;
  if (isWhitelisted(webhook.guild.id, entry.executor)) return;

  const embed = new EmbedBuilder()
    .setColor(0xFF0000)
    .setAuthor({ name: entry.executor?.tag || 'Bilinmiyor', iconURL: entry.executor?.displayAvatarURL() })
    .setTitle(`${E.CL_carpi} Webhook Oluşturma Tespit Edildi`)
    .setDescription([
      `**Webhook:** ${webhook.name || 'İsimsiz'}`,
      `**Yetkili:** ${entry.executor?.tag || 'Bilinmiyor'} (<@${entry.executor?.id || '?'}>)`,
    ].join('\n'))
    .setTimestamp();
  sendLog(webhook.guild, embed);

  if (cfg.antiWebhook?.enabled) {
    await webhook.delete().catch(() => {});
  }
}

async function handleBotAdd(member) {
  if (!member.user?.bot) return;
  const cfg = getConfig(member.guild.id);
  if (!cfg.antiNuke?.enabled && !cfg.antiBot?.enabled) return;
  const audit = await member.guild.fetchAuditLogs({ limit: 1, type: 28 }).catch(() => null);
  if (!audit) return;
  const entry = audit.entries.first();
  if (!entry) return;
  if (isWhitelisted(member.guild.id, entry.executor)) return;

  const embed = new EmbedBuilder()
    .setColor(0xFF0000)
    .setAuthor({ name: entry.executor?.tag || 'Bilinmiyor', iconURL: entry.executor?.displayAvatarURL() })
    .setTitle(`${E.CL_carpi} Bot Eklendi — Engellendi`)
    .setDescription([
      `**Bot:** ${member.user?.tag || 'Bilinmiyor'} (${member.id})`,
      `**Ekleyen:** ${entry.executor?.tag || 'Bilinmiyor'} (<@${entry.executor?.id || '?'}>)`,
    ].join('\n'))
    .setTimestamp();
  sendLog(member.guild, embed);

  if (cfg.antiBot?.enabled) {
    try { await member.kick('Bot koruması: yetkisiz bot eklemesi'); } catch {}
  }
}

module.exports = {
  checkAll, getConfig, hasKufur, hasLink, hasReklam, KUFUR_LIST, isWhitelisted, sendLog,
  handleChannelCreate, handleChannelDelete, handleRoleCreate, handleRoleDelete,
  handleGuildBanAdd, handleGuildMemberRemove, handleGuildUpdate,
  handleWebhookCreate, handleBotAdd,
};
