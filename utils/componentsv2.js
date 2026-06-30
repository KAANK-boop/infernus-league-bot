const { MessageFlags, ComponentType } = require('discord.js');
const E = require('../config/emojis');

const ACCENT = 0x2B2D31;

const LEAGUE_TEAMS = [
  { name: 'Manchester City', emoji: '' },
  { name: 'Manchester United', emoji: '' },
  { name: 'Chelsea', emoji: '' },
  { name: 'Arsenal', emoji: '' },
  { name: 'Liverpool', emoji: '' },
  { name: 'Tottenham', emoji: '' },
  { name: 'Real Madrid', emoji: '' },
  { name: 'Barcelona', emoji: '' },
  { name: 'Atletico Madrid', emoji: '' },
  { name: 'AC Milan', emoji: '' },
  { name: 'Inter', emoji: '' },
  { name: 'Juventus', emoji: '' },
  { name: 'Napoli', emoji: '' },
  { name: 'Bayern Münih', emoji: '' },
  { name: 'Dortmund', emoji: '' },
  { name: 'PSG', emoji: '' },
  { name: 'Galatasaray', emoji: '' },
  { name: 'Fenerbahçe', emoji: '' },
  { name: 'Beşiktaş', emoji: '' },
  { name: 'Karabağ', emoji: '' },
];

const trMap = { 'ş':'s','Ş':'S','ç':'c','Ç':'C','ğ':'g','Ğ':'G','ı':'i','İ':'I','ö':'o','Ö':'O','ü':'u','Ü':'U' };
const trNorm = s => s.replace(/[şŞçÇğĞıİöÖüÜ]/g, c => trMap[c] || c);

function teamEmoji(name) {
  const nn = name.toLowerCase();
  let t = LEAGUE_TEAMS.find(x => x.name.toLowerCase() === nn);
  if (t) return t.emoji;
  t = LEAGUE_TEAMS.find(x => trNorm(x.name).toLowerCase() === trNorm(name).toLowerCase());
  if (t) return t.emoji;
  const n = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [k, v] of Object.entries(E)) {
    if (k.startsWith('CL_') && k.replace('CL_', '').toLowerCase() === n) return v;
  }
  return '';
}

function T(text) {
  return { type: ComponentType.TextDisplay, content: text };
}

function Sep() {
  return { type: ComponentType.Separator };
}

function Container(components, accentColor) {
  const c = { type: ComponentType.Container, components };
  if (accentColor !== undefined) c.accent_color = accentColor;
  return c;
}

function Section(components, accessory) {
  const s = { type: ComponentType.Section, components };
  if (accessory) s.accessory = accessory;
  return s;
}

function Thumb(url) {
  return { type: ComponentType.Thumbnail, media: { url } };
}

function v2Send(channel, options) {
  const payload = { flags: MessageFlags.IsComponentsV2 };
  if (options.components) payload.components = options.components;
  if (options.files) payload.files = options.files;
  if (options.content) payload.components = [T(options.content)];
  return channel.send(payload);
}

function v2Edit(msg, components) {
  return msg.edit({ components });
}

function v2Reply(interaction, options) {
  const payload = { flags: MessageFlags.IsComponentsV2, ephemeral: options.ephemeral || false };
  if (options.components) payload.components = options.components;
  if (options.files) payload.files = options.files;
  if (interaction.deferred || interaction.replied) return interaction.editReply(payload);
  return interaction.reply(payload);
}

module.exports = { T, Sep, Container, Section, Thumb, v2Send, v2Edit, v2Reply, ACCENT, teamEmoji };
