const { MessageFlags } = require('discord.js');
const db = require('../database/db');
const E = require('../config/emojis');
const { T, Container } = require('../utils/componentsv2');

const POS_KEYWORDS = [
  ['GK', ['gk', 'kaleci', 'goalkeeper', 'kal']],
  ['LB', ['sol bek', 'slb', 'lb', 'left back']],
  ['RB', ['sağ bek', 'sag bek', 'sagb', 'sğb', 'rb', 'right back']],
  ['CB', ['stoper', 'stp', 'defans', 'cb', 'center back', 'stp']],
  ['CDM', ['cdm', 'defansif orta']],
  ['CAM', ['cam', 'on libero', '10 numara']],
  ['CM', ['cm', 'orta saha', 'oos', 'merkez', 'center mid']],
  ['LW', ['sol aç', 'sol açık', 'solaç', 'sol kanat', 'sla', 'lw', 'left wing', 'left forward']],
  ['RW', ['sağ aç', 'sağ açık', 'sağaç', 'sag ac', 'sagac', 'sağ kanat', 'sag kanat', 'sğk', 'sagk', 'rw', 'right wing', 'right forward']],
  ['ST', ['forvet', 'santrafor', 'st', 'cf', 'striker', 'center forward']],
];

function catPos(pos) {
  if (!pos) return 'OTH';
  const p = pos.toLowerCase().trim();
  for (const [cat, keywords] of POS_KEYWORDS) {
    for (const kw of keywords) {
      if (p === kw || p.includes(kw)) return cat;
    }
  }
  return 'OTH';
}

function detectFormation(def, mid, fwd) {
  const d = def.length;
  const m = mid.length;
  const f = fwd.length;
  if (d === 4 && m === 5 && f === 1) return '4-5-1';
  if (d === 4 && m === 3 && f === 3) return '4-3-3';
  if (d === 4 && m === 4 && f === 2) return '4-4-2';
  if (d === 4 && m === 2 && f === 4) return '4-2-4';
  if (d === 3 && m === 5 && f === 2) return '3-5-2';
  if (d === 3 && m === 4 && f === 3) return '3-4-3';
  if (d === 5 && m === 3 && f === 2) return '5-3-2';
  if (d === 5 && m === 4 && f === 1) return '5-4-1';
  return `${d}-${m}-${f}`;
}

function getName(id, msg) {
  const m = msg.guild.members.cache.get(id);
  if (m) return m.user.username;
  return msg.client.users.cache.get(id)?.username || '???';
}

module.exports = {
  kadro: {
    execute(message, args) {
      const users = db.getAllUsers();
      let teamName = args.join(' ');
      if (!teamName) {
        teamName = db.get(`users.${message.author.id}.squad`);
        if (!teamName) return message.reply('Bir takım adı belirtin veya bir takıma kayıtlı olun.\nKullanım: `.kadro [takım_adı]`');
      }

      const allSquad = Object.entries(users)
        .filter(([, u]) => u.squad?.toLowerCase() === teamName.toLowerCase() && u.position && u.position !== 'Yedek');

      if (allSquad.length === 0) return message.reply(`**${teamName}** için ilk 11 bulunamadı.`);

      const gk = allSquad.filter(([, u]) => catPos(u.position) === 'GK');
      const def = allSquad.filter(([, u]) => ['CB', 'LB', 'RB'].includes(catPos(u.position)));
      const mid = allSquad.filter(([, u]) => ['CDM', 'CM', 'CAM'].includes(catPos(u.position)));
      const fwd = allSquad.filter(([, u]) => ['LW', 'RW', 'ST'].includes(catPos(u.position)));

      const selected = [...gk.slice(0, 1), ...def, ...mid, ...fwd].slice(0, 11);
      const s_gk = selected.filter(([, u]) => catPos(u.position) === 'GK');
      const s_def = selected.filter(([, u]) => ['CB', 'LB', 'RB'].includes(catPos(u.position)));
      const s_mid = selected.filter(([, u]) => ['CDM', 'CM', 'CAM'].includes(catPos(u.position)));
      const s_fwd = selected.filter(([, u]) => ['LW', 'RW', 'ST'].includes(catPos(u.position)));
      const s_rest = selected.filter(([, u]) => catPos(u.position) === 'OTH');
      const formation = detectFormation(s_def, s_mid, s_fwd);

      let desc = [
        `${E.CL_kupa} **Forwards**`,
        s_fwd.length ? s_fwd.map(([id, u]) => `\`${getName(id, message)}\` **${u.position}** ${E.CL_electro_money}${u.value || 1}M`).join('\n') : '—',
        '',
        `${E.CL_pano} **Midfielders**`,
        s_mid.length ? s_mid.map(([id, u]) => `\`${getName(id, message)}\` **${u.position}** ${E.CL_electro_money}${u.value || 1}M`).join('\n') : '—',
        '',
        `${E.CL_kalkan} **Defenders**`,
        s_def.length ? s_def.map(([id, u]) => `\`${getName(id, message)}\` **${u.position}** ${E.CL_electro_money}${u.value || 1}M`).join('\n') : '—',
        '',
        `${E.CL_hedef} **Goalkeeper**`,
        s_gk.length ? s_gk.map(([id, u]) => `\`${getName(id, message)}\` **${u.position}** ${E.CL_electro_money}${u.value || 1}M`).join('\n') : '—',
        '',
        selected.length < allSquad.length ? `*+${allSquad.length - selected.length} oyuncu yedek*` : '',
        '',
        `━━━━━━━━━━━━━━━━━━━━━━\n${E.CL_futbolbotu} **Kadro:** ${selected.map(([id, u]) => `\`${getName(id, message)}\` (${u.position})`).join(', ')}`,
      ].join('\n');

      if (s_rest.length > 0) {
        desc += `\n**${E.CL_uyari} Diğer Pozisyonlar:** ${s_rest.map(([id, u]) => `\`${getName(id, message)}\` ${u.position}`).join(', ')}`;
      }

      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`**${E.CL_futbolbotu} ${teamName} — İlk 11 (${formation})**\n\n${desc}\n-# Infermus League`)])]
      });
    }
  }
};
