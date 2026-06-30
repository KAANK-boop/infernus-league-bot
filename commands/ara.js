const { MessageFlags } = require('discord.js');
const db = require('../database/db');
const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

function getRecordStatus(member, guildId) {
  if (!member) return '*(kayıtsız)*';
  const db = require('../database/db');
  const config = db.get(`kayit.${guildId || member.guild?.id}`);
  const kayitliRol = config?.kayitliRol;
  const kayitsizRol = config?.kayitsizRol;
  if (kayitliRol && member.roles.cache.has(kayitliRol)) return '';
  if (kayitsizRol && member.roles.cache.has(kayitsizRol)) return '*(kayıtsız)*';
  return '*(kayıtsız)*';
}

module.exports = {
  'takımrolleri': {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('❌ Bu komutu sadece yöneticiler kullanabilir!');
      const sub = args[0]?.toLowerCase();
      const roles = message.mentions.roles;
      let takimRolleri = db.get('settings.takimRolleri', []);

      if (sub === 'ekle') {
        if (roles.size === 0) return message.reply('Kullanım: `.takımrolleri ekle @rol1 @rol2 ...`');
        const added = [];
        roles.forEach(r => {
          if (!takimRolleri.includes(r.id)) {
            takimRolleri.push(r.id);
            added.push(r.name);
          }
        });
        if (added.length === 0) return message.reply('Tüm bu roller zaten takım rollerinde.');
        db.set('settings.takimRolleri', takimRolleri);
        return message.reply(`✅ **${added.join(', ')}** takım rollerine eklendi.`);
      }

      if (sub === 'sil') {
        if (roles.size === 0) return message.reply('Kullanım: `.takımrolleri sil @rol1 @rol2 ...`');
        const removed = [];
        roles.forEach(r => {
          if (takimRolleri.includes(r.id)) {
            takimRolleri = takimRolleri.filter(id => id !== r.id);
            removed.push(r.name);
          }
        });
        if (removed.length === 0) return message.reply('Bu roller takım rollerinde bulunamadı.');
        db.set('settings.takimRolleri', takimRolleri);
        return message.reply(`🗑️ **${removed.join(', ')}** takım rollerinden çıkarıldı.`);
      }

      if (sub === 'liste' || !sub) {
        if (takimRolleri.length === 0) return message.reply('Henüz hiç takım rolü eklenmemiş. `.takımrolleri ekle @rol1 @rol2 ...`');
        const list = takimRolleri.map((id, i) => {
          const r = message.guild.roles.cache.get(id);
          return `**${i + 1}.** ${r ? `${r} (${r.name})` : '❌ Silinmiş rol'}`;
        }).join('\n');
        return message.reply(`**📋 Takım Rolleri (${takimRolleri.length}):**\n${list}`);
      }

      message.reply('Kullanım: `.takımrolleri ekle/sil/liste @rol1 @rol2 ...`');
    }
  },
  ara: {
    async execute(message, args) {
      const query = args.join(' ').toLowerCase();
      if (!query) return message.reply('Kullanım: .ara (isim/takım/mevki)');

      const users = db.getAllUsers();
      const seen = new Set();
      let guildMemberIds = null;

      if (message.guild) {
        const lastFetch = db.get(`_cache.membersFetch.${message.guild.id}`, 0);
        if (Date.now() - lastFetch > 30000) {
          await message.guild.members.fetch().catch(() => {});
          db.set(`_cache.membersFetch.${message.guild.id}`, Date.now());
        }
        guildMemberIds = new Set(message.guild.members.cache.keys());
      }

      const dbResults = Object.entries(users).filter(([id, u]) => {
        if (guildMemberIds && !guildMemberIds.has(id)) return false;
        const name = (u.name || '').toLowerCase();
        const squad = (u.squad || '').toLowerCase();
        const pos = (u.position || '').toLowerCase();
        const country = (u.country || '').toLowerCase();
        const match = name.includes(query) || squad.includes(query) || pos.includes(query) || country.includes(query);
        if (match) seen.add(id);
        return match;
      });

      const guildResults = [];
      if (message.guild) {
        for (const [id, member] of message.guild.members.cache) {
          if (seen.has(id)) continue;
          const display = (member.displayName || '').toLowerCase();
          const nick = (member.nickname || '').toLowerCase();
          const username = (member.user.username || '').toLowerCase();
          const globalName = (member.user.globalName || '').toLowerCase();
          if (display.includes(query) || nick.includes(query) || username.includes(query) || globalName.includes(query)) {
            guildResults.push({ id, member, inDb: !!users[id] });
            seen.add(id);
          }
        }
      }

      if (seen.size > 0) {
        const lines = [];
        dbResults.slice(0, 15).forEach(([id, u], i) => {
          const member = message.guild?.members.cache.get(id);
          const name = u.name || member?.displayName || message.client.users.cache.get(id)?.username || '??';
          const status = getRecordStatus(member, message.guild?.id);
          const statusPart = status ? ` | ${status}` : '';
          lines.push(`${E.CL_sag_ok} **${i + 1}.** ${name} | ${u.position || '?'} | ${u.country || '?'} | ${u.value || 1}M€${statusPart}`);
        });
        guildResults.forEach(({ id, member, inDb }, i) => {
          const status = getRecordStatus(member, message.guild?.id);
          const statusPart = status ? ` | ${status}` : '';
          const u = users[id];
          if (u) {
            const name = u.name || member.displayName;
            lines.push(`${E.CL_sag_ok} **${dbResults.length + i + 1}.** ${name} | ${u.position || '?'} | ${u.country || '?'} | ${u.value || 1}M€${statusPart}`);
          } else {
            lines.push(`${E.CL_sag_ok} **${dbResults.length + i + 1}.** ${member.displayName}${statusPart}`);
          }
        });
        return message.channel.send({
          flags: MessageFlags.IsComponentsV2,
          components: [Container([T(`**🔍 Arama Sonuçları: "${query}"**\n\n${lines.join('\n')}\n-# Infermus League`)])]
        });
      }

      return message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`**${E.CL_carpi} Arama Sonucu**\n\n"**${query}**" için öyle bir futbolcu bulunamadı.\n-# Infermus League`)])]
      });
    }
  }
};
