const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageFlags } = require('discord.js');
const db = require('../database/db');
const { PLAYERS, POSITIONS, getPlayer, searchPlayer, calcTeamRating, simulateMatch } = require('../database/futbol_players');
const { getSquad, getRandomPlayer } = require('../database/team_squads');
const E = require('../config/emojis');
const { T, Sep, Container, teamEmoji } = require('../utils/componentsv2');

const teamPages = new Map();

module.exports = {
  futbolcu: {
    async execute(message, args) {
      const query = args.join(' ');
      if (!query) return message.reply({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_uyari} Kullanım: \`.futbolcu (isim)\`\n\n-# Infermus League`)])] });
      const results = searchPlayer(query);
      if (results.length === 0) return message.reply({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_carpi} Oyuncu bulunamadı.\n\n-# Infermus League`)])] });
      if (results.length > 1) {
        const rows = [];
        const chunks = [];
        for (let i = 0; i < results.length; i += 5) chunks.push(results.slice(i, i + 5));
        for (const chunk of chunks) {
          rows.push(new ActionRowBuilder().addComponents(
            chunk.map(p => new ButtonBuilder().setCustomId(`fp_${p.id}`).setLabel(p.name.split(' ')[0]).setStyle(ButtonStyle.Secondary))
          ));
        }
        return message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_futbolbotu} Birden fazla oyuncu bulundu, seç:`), ...rows.map(r => r.toJSON())])] });
      }
      const p = results[0];
      const pos = POSITIONS[p.pos];
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`${pos.emoji} **${p.name}**\n\n**Mevki:** ${pos.label} (${p.pos})\n**Rating:** ${E.CL_yildiz.repeat(Math.floor(p.rating / 20))} ${p.rating}\n**Değer:** ${E.CL_electro_money} ${p.price.toLocaleString()} coin\n**Kulüp:** ${p.club}\n**Yaş:** ${p.age}\n\n-# Infermus League`),
      ])] });
    },
  },
  piyasa: {
    execute(message) {
      const totalPages = Math.ceil(PLAYERS.length / 10);
      let page = 0;
      const build = (p) => {
        const start = p * 10;
        const items = PLAYERS.slice(start, start + 10);
        const nav = new ActionRowBuilder();
        if (p > 0) nav.addComponents(new ButtonBuilder().setCustomId('mp_on').setLabel('Önceki').setEmoji(E.CL_sol_ok).setStyle(ButtonStyle.Secondary));
        if (p < totalPages - 1) nav.addComponents(new ButtonBuilder().setCustomId('mp_next').setLabel('Sonraki').setEmoji(E.CL_sag_ok).setStyle(ButtonStyle.Secondary));
        const navRow = nav.components.length > 0 ? nav.toJSON() : null;
        return { flags: MessageFlags.IsComponentsV2, components: [Container([
          T(`${E.CL_pano} **Piyasa**\n\n${items.map(x => `**${x.id}.** ${POSITIONS[x.pos].emoji} **${x.name}** — ${x.pos} — ${E.CL_electro_money} ${x.price.toLocaleString()}`).join('\n')}\n\n-# Sayfa ${p + 1}/${totalPages} • Oyuncu ID'si ile \\.transfer 1 satın alabilirsiniz.`),
          ...(navRow ? [navRow] : []),
        ])] };
      };
      message.channel.send(build(0)).then(msg => {
        const filter = i => i.message.id === msg.id && i.user.id === message.author.id;
        const col = msg.createMessageComponentCollector({ filter, time: 60000 });
        col.on('collect', async (i) => {
          if (i.customId === 'mp_on') page = Math.max(0, page - 1);
          else page = Math.min(totalPages - 1, page + 1);
          await i.update(build(page));
        });
        col.on('end', () => msg.edit({ components: [] }).catch(() => {}));
      });
    },
  },
  takım: {
    execute(message) {
      const uid = message.author.id;
      const team = db.get(`teams.${uid}`, []);
      if (team.length === 0) return message.channel.send(`${E.CL_uyari} Henüz takımın yok! \`.transfer 1\` ile oyuncu satın al.`);
      const rating = calcTeamRating(team);
      const mevkiler = {};
      team.forEach(p => { if (!mevkiler[p.pos]) mevkiler[p.pos] = []; mevkiler[p.pos].push(p); });
      const lines = Object.entries(POSITIONS).map(([key, pos]) => {
        const players = mevkiler[key];
        if (!players) return `${pos.emoji} **${pos.label}** — ${E.CL_carpi} Boş`;
        return `${pos.emoji} **${pos.label}**\n${players.map(p => `┗ **${p.name}** ${E.CL_yildiz}${p.rating}`).join('\n')}`;
      });
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('tk_cik').setLabel('Oyuncu Çıkar').setStyle(ButtonStyle.Danger).setEmoji(E.CL_dongu),
      );
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`${E.CL_futbolbotu} **Takımın** ${E.CL_yildiz}${rating}\n${lines.join('\n')}\n\n**Değer:** ${E.CL_electro_money} ${team.reduce((s, p) => s + p.price, 0).toLocaleString()} coin`),
        row.toJSON()
      ])] }).then(msg => {
        const filter = i => i.message.id === msg.id && i.user.id === message.author.id;
        const col = msg.createMessageComponentCollector({ filter, time: 30000 });
        col.on('collect', async (i) => {
          const t = db.get(`teams.${uid}`, []);
          if (t.length === 0) return i.update({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_uyari} Takımın boş.`)])] });
          const sel = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('cik_oyuncu').setPlaceholder('Çıkarılacak oyuncu seç').addOptions(
              t.map(p => new StringSelectMenuOptionBuilder().setLabel(`${p.name} ${E.CL_yildiz}${p.rating}`).setEmoji(E.CL_futbolbotu).setValue(`${p.id}`))
            )
          );
          await i.update({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_pano} Çıkarmak istediğin oyuncuyu seç:`), sel.toJSON()])] });
        });
        col.on('end', () => msg.edit({ components: [] }).catch(() => {}));
      });
    },
  },
  puan: {
    execute(message) {
      const uid = message.author.id;
      const coin = db.get(`coins.${uid}`, 0);
      const team = db.get(`teams.${uid}`, []);
      const win = db.get(`stats.${uid}.win`, 0);
      const loss = db.get(`stats.${uid}.loss`, 0);
      const draw = db.get(`stats.${uid}.draw`, 0);
      const rating = calcTeamRating(team);
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`${message.author.username}\n\n${E.CL_electro_money} **Bakiye:** ${coin.toLocaleString()} coin\n${E.CL_futbolbotu} **Takım:** ${team.length}/11 oyuncu ${E.CL_yildiz}${rating}\n${E.CL_kupa} **Galibiyet:** ${win} | **Beraberlik:** ${draw} | **Mağlubiyet:** ${loss}\n\n-# Infermus League`),
      ])] });
    },
  },
  transfer: {
    async execute(message, args) {
      const uid = message.author.id;
      const id = parseInt(args[0]);
      if (isNaN(id) || !getPlayer(id)) return message.reply(`${E.CL_uyari} Geçersiz oyuncu ID. \`.piyasa\` ile listeyi gör.`);
      const p = getPlayer(id);
      const team = db.get(`teams.${uid}`, []);
      if (team.length >= 11) return message.reply(`${E.CL_carpi} Takımında zaten 11 oyuncu var!`);
      if (team.some(x => x.id === p.id)) return message.reply(`${E.CL_carpi} Bu oyuncu zaten takımında!`);
      const coin = db.get(`coins.${uid}`, 500000);
      if (coin < p.price) return message.reply(`${E.CL_uyari} Yetersiz bakiye! **${p.price.toLocaleString()}** coin gerekli, **${coin.toLocaleString()}** coin'in var.`);
      const btnRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`tf_al_${uid}_${id}`).setLabel('Satın Al').setStyle(ButtonStyle.Success).setEmoji(E.CL_yesiltik),
        new ButtonBuilder().setCustomId('tf_hayir').setLabel('İptal').setStyle(ButtonStyle.Secondary).setEmoji(E.CL_carpi)
      );
      const msg = await message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`${E.CL_futbolbotu} **${p.name}** — ${E.CL_electro_money} ${p.price.toLocaleString()} coin\nSatın almak istediğine emin misin?`),
        btnRow.toJSON()
      ])] });
      const filter = i => i.message.id === msg.id && i.user.id === message.author.id;
      const col = msg.createMessageComponentCollector({ filter, time: 30000, max: 1 });
      col.on('collect', async (i) => {
        if (i.customId === 'tf_hayir') return i.update({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_carpi} İptal edildi.`)])] });
        const t = db.get(`teams.${uid}`, []);
        if (t.length >= 11) return i.update({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_carpi} Takımın dolu!`)])] });
        const c = db.get(`coins.${uid}`, 500000);
        if (c < p.price) return i.update({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_uyari} Bakiye yetersiz!`)])] });
        db.subtract(`coins.${uid}`, p.price);
        t.push({ id: p.id, name: p.name, pos: p.pos, rating: p.rating, price: p.price, club: p.club });
        db.set(`teams.${uid}`, t);
        await i.update({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_yesiltik} **${p.name}** takımına katıldı! (${E.CL_electro_money} ${p.price.toLocaleString()} coin)`)])] });
      });
      col.on('end', () => msg.edit({ components: [] }).catch(() => {}));
    },
  },
  sat: {
    async execute(message, args) {
      const uid = message.author.id;
      const id = parseInt(args[0]);
      if (isNaN(id) || !getPlayer(id)) return message.reply(`${E.CL_uyari} Geçersiz oyuncu ID.`);
      const team = db.get(`teams.${uid}`, []);
      const idx = team.findIndex(p => p.id === id);
      if (idx === -1) return message.reply(`${E.CL_carpi} Bu oyuncu takımında yok.`);
      const p = team[idx];
      const fiyat = Math.floor(p.price * 0.7);
      const btnRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`st_al_${uid}_${id}`).setLabel('Sat').setStyle(ButtonStyle.Danger).setEmoji(E.CL_electro_money),
        new ButtonBuilder().setCustomId('tf_hayir').setLabel('İptal').setStyle(ButtonStyle.Secondary).setEmoji(E.CL_carpi)
      );
      const msg = await message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`${E.CL_futbolbotu} **${p.name}** satılsın mı? ${E.CL_electro_money} Kazanç: **${fiyat.toLocaleString()}** coin`),
        btnRow.toJSON()
      ])] });
      const filter = i => i.message.id === msg.id && i.user.id === message.author.id;
      const col = msg.createMessageComponentCollector({ filter, time: 30000, max: 1 });
      col.on('collect', async (i) => {
        if (i.customId === 'tf_hayir') return i.update({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_carpi} İptal edildi.`)])] });
        const t = db.get(`teams.${uid}`, []);
        const ix = t.findIndex(x => x.id === id);
        if (ix === -1) return i.update({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_carpi} Oyuncu bulunamadı.`)])] });
        t.splice(ix, 1);
        db.set(`teams.${uid}`, t);
        db.add(`coins.${uid}`, fiyat);
        await i.update({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_yesiltik} **${p.name}** satıldı! +${E.CL_electro_money} **${fiyat.toLocaleString()}** coin`)])] });
      });
      col.on('end', () => msg.edit({ components: [] }).catch(() => {}));
    },
  },
  maç: {
    async execute(message, args) {
      const uid = message.author.id;
      const team = db.get(`teams.${uid}`, []);
      if (team.length < 11) return message.reply(`${E.CL_uyari} Maça çıkmak için 11 oyuncu gerekli! (${team.length}/11)`);
      const rakib = args[0] ? message.mentions.users.first() : null;
      let oppTeam;
      if (rakib) {
        const t = db.get(`teams.${rakib.id}`, []);
        if (t.length < 11) return message.reply(`${E.CL_uyari} Rakibin takımı eksik!`);
        oppTeam = t;
      } else {
        const userRating = calcTeamRating(team);
        const aiRating = Math.max(55, userRating - 8);
        oppTeam = db.get(`teams.ai`, []);
        if (oppTeam.length < 11) {
          oppTeam = [
            { name: 'Yapay GK', rating: aiRating }, { name: 'Yapay CB', rating: aiRating }, { name: 'Yapay CB', rating: aiRating },
            { name: 'Yapay LB', rating: aiRating }, { name: 'Yapay RB', rating: aiRating }, { name: 'Yapay CDM', rating: aiRating },
            { name: 'Yapay CM', rating: aiRating }, { name: 'Yapay CM', rating: aiRating }, { name: 'Yapay LW', rating: aiRating },
            { name: 'Yapay RW', rating: aiRating }, { name: 'Yapay ST', rating: aiRating },
          ];
        }
      }
      const macBtnRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('mc_basla').setLabel('Maçı Başlat').setStyle(ButtonStyle.Primary).setEmoji(E.CL_futbolbotu),
        new ButtonBuilder().setCustomId('mc_iptal').setLabel('İptal').setStyle(ButtonStyle.Secondary).setEmoji(E.CL_carpi)
      );
      const msg = await message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [Container([
        T(`${E.CL_futbolbotu} **${message.author.username}** vs **${rakib ? rakib.username : 'AI'}**\nHazır mısın?`),
        macBtnRow.toJSON()
      ])] });
      const filter = i => i.message.id === msg.id && i.user.id === message.author.id;
      const col = msg.createMessageComponentCollector({ filter, time: 30000, max: 1 });
      col.on('collect', async (i) => {
        if (i.customId === 'mc_iptal') return i.update({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_carpi} Maç iptal edildi.`)])] });
        await i.deferUpdate();
        const t = db.get(`teams.${uid}`, []);
        const op = rakib ? db.get(`teams.${rakib.id}`, []) : oppTeam;
        if (t.length < 11 || op.length < 11) return i.editReply({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_uyari} Takımlardan biri eksik!`)])] });
        const result = simulateMatch(t, op);
        const r1 = calcTeamRating(t);
        const r2 = calcTeamRating(op);
        const kazanan = result.winner === 1 ? message.author : result.winner === 2 ? (rakib || 'AI') : null;
        const odul = result.winner === 1 ? Math.floor(5000 + r1 * 100) : 0;
        if (result.winner === 1) {
          db.add(`coins.${uid}`, odul);
          db.add(`stats.${uid}.win`, 1);
          if (rakib) db.add(`stats.${rakib.id}.loss`, 1);
        } else if (result.winner === 2) {
          db.add(`stats.${uid}.loss`, 1);
          if (rakib) db.add(`stats.${rakib.id}.win`, 1);
        } else {
          db.add(`stats.${uid}.draw`, 1);
          if (rakib) db.add(`stats.${rakib.id}.draw`, 1);
        }
        let text = `${E.CL_futbolbotu} **MAÇ SONUCU**\n━━━━━━━━━━━━━━━━\n**${message.author.username}** ${E.CL_yildiz}${r1} ${result.score1} - ${result.score2} ${E.CL_yildiz}${r2} **${rakib ? rakib.username : 'AI'}**\n━━━━━━━━━━━━━━━━\n`;
        if (kazanan) text += `${E.CL_kupa} **${kazanan === message.author ? message.author.username : kazanan.username || 'AI'}** kazandı!${result.winner === 1 ? `\n${E.CL_electro_money} **+${odul.toLocaleString()}** coin kazandın!` : ''}`;
        else text += `${E.CL_handshake} **Beraberlik!**`;
        await i.editReply({ flags: MessageFlags.IsComponentsV2, components: [Container([T(text)])] });
      });
    },
  },
  lig: {
    execute(message) {
      const teams = db.getAll(`teams`);
      const standings = Object.entries(teams)
        .filter(([, t]) => Array.isArray(t) && t.length >= 11)
        .map(([uid, t]) => {
          const s = db.get(`stats.${uid}`, { win: 0, draw: 0, loss: 0 });
          const p = s.win * 3 + s.draw;
          const coin = db.get(`coins.${uid}`, 0);
          const r = calcTeamRating(t);
          return { uid, puan: p, win: s.win, draw: s.draw, loss: s.loss, coin, rating: r };
        })
        .sort((a, b) => b.puan - a.puan || b.coin - a.coin);
      if (standings.length === 0) return message.channel.send('Henüz lig verisi yok.');
      const totalPages = Math.ceil(standings.length / 10);
      let page = 0;
      const build = (p) => {
        const start = p * 10;
        const items = standings.slice(start, start + 10);
        const lines = items.map((s, i) => `**${start + i + 1}.** <@${s.uid}> — ${E.CL_kupa} **${s.puan}** puan (${s.win}G ${s.draw}B ${s.loss}M) ${E.CL_yildiz}${s.rating} ${E.CL_electro_money}${s.coin.toLocaleString()}`);
        const nav = new ActionRowBuilder();
        if (p > 0) nav.addComponents(new ButtonBuilder().setCustomId('lg_on').setLabel('Önceki').setEmoji(E.CL_sol_ok).setStyle(ButtonStyle.Secondary));
        if (p < totalPages - 1) nav.addComponents(new ButtonBuilder().setCustomId('lg_next').setLabel('Sonraki').setEmoji(E.CL_sag_ok).setStyle(ButtonStyle.Secondary));
        const navRow = nav.components.length > 0 ? nav.toJSON() : null;
        return { flags: MessageFlags.IsComponentsV2, components: [Container([
          T(`${E.CL_kupa} **Lig Tablosu** (Sayfa ${p + 1}/${totalPages})\n${lines.join('\n')}`),
          ...(navRow ? [navRow] : []),
        ])] };
      };
      message.channel.send(build(0)).then(msg => {
        const filter = i => i.message.id === msg.id && i.user.id === message.author.id;
        const col = msg.createMessageComponentCollector({ filter, time: 30000 });
        col.on('collect', async (i) => {
          if (i.customId === 'lg_on') page = Math.max(0, page - 1);
          else page = Math.min(totalPages - 1, page + 1);
          await i.update(build(page));
        });
        col.on('end', () => msg.edit({ components: [] }).catch(() => {}));
      });
    },
  },
  'maç-sonuç-kanal': {
    execute(message, args) {
      if (!message.member.permissions.has('Administrator')) return message.reply('Yetkiniz yok!');
      if (!args[0]) {
        return message.reply(`${E.plus} Kullanım: ".maç-sonuç-kanal <tür> #kanal" veya ".maç-sonuç-kanal <tür> sil"`);
      }
      const tur = args[0].toLowerCase();
      if (args[1] === 'sil') {
        db.delete(`macSonucKanal.${message.guild.id}.${tur}`);
        return message.reply(`${E.CL_kabul_edildi} "${tur}" türü için maç sonuç kanalı kaldırıldı.`);
      }
      const channel = args[1] ? message.mentions.channels.first() : null;
      if (!channel) return message.reply(`${E.CL_carpi} Kullanım: ".maç-sonuç-kanal ${tur} #kanal"`);
      db.set(`macSonucKanal.${message.guild.id}.${tur}`, channel.id);
      message.reply(`${E.CL_kabul_edildi} "${tur}" türü için maç sonuç kanalı ${channel} olarak ayarlandı.`);
    }
  },
  maçsimüle: {
    async execute(message, args) {
      const tur = args[0]?.toLowerCase() || 'genel';
      const text = args.slice(1).join(' ');
      const parts = text.split(/\s+vs\s+/i);
      if (parts.length !== 2) return message.reply({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_uyari} Kullanım: \`.maçsimüle <tür> Takım1 vs Takım2\`\nÖrn: \`.maçsimüle lig Galatasaray vs Fenerbahçe\`\n\n-# Infermus League`)])], allowedMentions: { repliedUser: false } });

      const team1 = parts[0].trim();
      const team2 = parts[1].trim();

      const squad1 = getSquad(team1);
      const squad2 = getSquad(team2);
      const t1Emoji = teamEmoji(squad1?.name || team1);
      const t2Emoji = teamEmoji(squad2?.name || team2);

      const PLAYERS = require('../database/futbol_players').PLAYERS;
      function calcPower(squad) {
        if (!squad || !squad.starting) return 50;
        const ratings = squad.starting.map(p => {
          const found = PLAYERS.find(x => x.name.toLowerCase() === p.name.toLowerCase());
          return found ? found.rating : 75;
        });
        return Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length);
      }
      const power1 = calcPower(squad1);
      const power2 = calcPower(squad2);

      function pickPlayer(squad, takimNo, pos) {
        if (squad) return getRandomPlayer(squad, pos);
        const isimler = [
          'Alex', 'Marco', 'Luis', 'Carlos', 'Emre', 'Mehmet', 'Ali', 'Can', 'Burak', 'Cenk',
          'Arda', 'Mert', 'Serkan', 'Volkan', 'Hakan', 'Okan', 'Tuncay', 'Nihat', 'Yasin', 'Umut'
        ];
        return isimler[Math.floor(Math.random() * isimler.length)];
      }

      function pickScorer(squad, takimNo) {
        if (squad) {
          const pool = [...squad.starting, ...squad.subs].filter(p => p.pos !== 'GK');
          if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)].name;
          return getRandomPlayer(squad, null, false);
        }
        return pickPlayer(null, takimNo);
      }

      function pickAssister(squad, takimNo, scorer) {
        let assist;
        do {
          assist = pickScorer(squad, takimNo);
        } while (assist === scorer);
        return assist;
      }

      const maxGoals1 = Math.min(6, Math.max(1, Math.floor(Math.random() * 4) + Math.floor(power1 / 30)));
      const maxGoals2 = Math.min(6, Math.max(1, Math.floor(Math.random() * 4) + Math.floor(power2 / 30)));

      const events = [];
      let score1 = 0, score2 = 0;
      const usedMinutes = new Set();

      function addGoal(dk, takim) {
        if (takim === 1) score1++; else score2++;
        const squad = takim === 1 ? squad1 : squad2;
        const scorer = pickScorer(squad, takim);
        const assister = pickAssister(squad, takim, scorer);
        events.push({ dk, type: 'gol', takim, oyuncu: scorer, asist: assister, skor: `${score1}-${score2}` });
      }

      function addCard(dk, takim, renk) {
        const player = pickPlayer(takim === 1 ? squad1 : squad2, takim, null);
        events.push({ dk, type: renk === 'kirmizi' ? 'kirmizi_kart' : 'sari_kart', takim, oyuncu: player });
      }

      for (let i = 0; i < maxGoals1 * 2; i++) {
        let dk;
        do { dk = Math.floor(Math.random() * 85) + 1; } while (usedMinutes.has(dk));
        usedMinutes.add(dk);
        if (Math.random() < 0.15 + (power1 - power2) / 500 + Math.random() * 0.08) addGoal(dk, 1);
        else if (Math.random() < 0.05) addCard(dk, 1, 'sari');
      }

      for (let i = 0; i < maxGoals2 * 2; i++) {
        let dk;
        do { dk = Math.floor(Math.random() * 85) + 1; } while (usedMinutes.has(dk));
        usedMinutes.add(dk);
        if (Math.random() < 0.15 + (power2 - power1) / 500 + Math.random() * 0.08) addGoal(dk, 2);
        else if (Math.random() < 0.05) addCard(dk, 2, 'sari');
      }

      if (Math.random() < 0.15) {
        let dk;
        do { dk = Math.floor(Math.random() * 80) + 10; } while (usedMinutes.has(dk));
        usedMinutes.add(dk);
        addCard(dk, Math.random() < 0.5 ? 1 : 2, 'kirmizi');
      }

      const subOutPlayers = new Set();
      function addSub(dk, takim) {
        const key = p => `${takim}:${p}`;
        const squad = takim === 1 ? squad1 : squad2;
        if (squad && squad.subs && squad.subs.length > 0) {
          const availableOut = squad.starting.filter(p => !subOutPlayers.has(key(p.name)));
          const availableIn = squad.subs.filter(p => !subOutPlayers.has(key(p.name)));
          if (availableOut.length === 0 || availableIn.length === 0) return;
          const outPlayer = availableOut[Math.floor(Math.random() * availableOut.length)].name;
          const inPlayer = availableIn[Math.floor(Math.random() * availableIn.length)].name;
          subOutPlayers.add(key(outPlayer));
          events.push({ dk, type: 'degisiklik', takim, oyuncu: outPlayer, yeni: inPlayer });
        } else {
          const isimler = ['Alex', 'Marco', 'Luis', 'Carlos', 'Emre', 'Mehmet', 'Ali', 'Can', 'Burak', 'Cenk', 'Arda', 'Mert', 'Serkan', 'Volkan', 'Hakan', 'Okan', 'Tuncay', 'Nihat', 'Yasin', 'Umut'];
          const available = isimler.filter(p => !subOutPlayers.has(key(p)));
          if (available.length < 2) return;
          const outIdx = Math.floor(Math.random() * available.length);
          const outPlayer = available[outIdx];
          let inPlayer;
          do { inPlayer = available[Math.floor(Math.random() * available.length)]; } while (inPlayer === outPlayer);
          subOutPlayers.add(key(outPlayer));
          events.push({ dk, type: 'degisiklik', takim, oyuncu: outPlayer, yeni: inPlayer });
        }
      }

      for (let i = 0; i < 3; i++) {
        if (Math.random() < 0.4) {
          let dk;
          do { dk = Math.floor(Math.random() * 40) + 46; } while (usedMinutes.has(dk));
          usedMinutes.add(dk);
          addSub(dk, Math.random() < 0.7 ? 1 : 2);
        }
      }

      events.sort((a, b) => a.dk - b.dk);

      let currentScore1 = 0, currentScore2 = 0;
      const timeline = [];
      function buildMatchComponents() {
        return [
          T(`${E.CL_futbolbotu} **${t1Emoji} ${squad1?.name || team1} vs ${t2Emoji} ${squad2?.name || team2}**`),
          Sep(),
          T(`⚡ ${power1} — ${t1Emoji} ${squad1?.name || team1}\n⚡ ${power2} — ${t2Emoji} ${squad2?.name || team2}`),
          Sep(),
          T(`**${currentScore1} - ${currentScore2}**`),
          Sep(),
          T(timeline.join('\n') || '⏳ **Maç başlıyor...**'),
        ];
      }

      function wrapMatch(inner) {
        return [Container(inner)];
      }

      const msg = await message.channel.send({ flags: 32768, components: wrapMatch([
        T(`${E.CL_futbolbotu} **${t1Emoji} ${squad1?.name || team1} vs ${t2Emoji} ${squad2?.name || team2}**`),
        Sep(),
        T(`⚡ ${power1} — ${t1Emoji} ${squad1?.name || team1}\n⚡ ${power2} — ${t2Emoji} ${squad2?.name || team2}`),
        Sep(),
        T(`**0 - 0**`),
        Sep(),
        T(`⏳ **Maç başlıyor...**`),
      ]) });

      let lastMinute = 0;
      for (const ev of events) {
        await new Promise(r => setTimeout(r, 2000));

        if (lastMinute < 45 && ev.dk >= 45) {
          await msg.edit({ components: wrapMatch(buildMatchComponents()) });
          await new Promise(r => setTimeout(r, 2000));
        }

        if (ev.type === 'gol') {
          currentScore1 = ev.takim === 1 ? currentScore1 + 1 : currentScore1;
          currentScore2 = ev.takim === 2 ? currentScore2 + 1 : currentScore2;
          const golTakim = ev.takim === 1 ? (squad1?.name || team1) : (squad2?.name || team2);
          timeline.push(`${E.CL_gol} **${ev.dk}'** — **${ev.oyuncu}** (${golTakim})\n┗ ${E.CL_krampon} ${ev.asist} **${currentScore1}-${currentScore2}**`);
        } else if (ev.type === 'sari_kart') {
          const kartTakim = ev.takim === 1 ? (squad1?.name || team1) : (squad2?.name || team2);
          timeline.push(`${E.CL_sarikart} **${ev.dk}'** — ${ev.oyuncu} (${kartTakim})`);
        } else if (ev.type === 'kirmizi_kart') {
          const kartTakim = ev.takim === 1 ? (squad1?.name || team1) : (squad2?.name || team2);
          timeline.push(`${E.CL_kirmizikart} **${ev.dk}'** — ${ev.oyuncu} (${kartTakim})`);
        } else if (ev.type === 'degisiklik') {
          const degTakim = ev.takim === 1 ? (squad1?.name || team1) : (squad2?.name || team2);
          timeline.push(`🔄 **${ev.dk}'** — ${ev.oyuncu} ↔ ${ev.yeni} (${degTakim})`);
        }

        await msg.edit({ components: wrapMatch(buildMatchComponents()) });

        lastMinute = ev.dk;
      }

      if (lastMinute < 90) {
        await new Promise(r => setTimeout(r, 2000));
      }

      const kazanan = currentScore1 > currentScore2 ? `${t1Emoji} ${squad1?.name || team1}` : currentScore2 > currentScore1 ? `${t2Emoji} ${squad2?.name || team2}` : 'Beraberlik';
      const sonucEmoji = currentScore1 > currentScore2 ? E.CL_kupa : currentScore2 > currentScore1 ? E.CL_kupa : E.CL_handshake;

      await msg.edit({ components: wrapMatch([
        T(`${E.CL_futbolbotu} **MAÇ SONUCU**`),
        Sep(),
        T(`**${t1Emoji} ${squad1?.name || team1}** ${currentScore1} - ${currentScore2} **${t2Emoji} ${squad2?.name || team2}**`),
        Sep(),
        T(`${sonucEmoji} **${kazanan}**`),
        Sep(),
        T(timeline.join('\n')),
      ]) });

      const sonucKanalId = db.get(`macSonucKanal.${message.guild.id}.${tur}`);
      if (sonucKanalId) {
        const sonucKanal = message.guild.channels.cache.get(sonucKanalId);
        if (sonucKanal) {
          sonucKanal.send({ flags: 32768, components: wrapMatch([
            T(`${E.CL_futbolbotu} **MAÇ SONUCU**`),
            Sep(),
            T(`**${t1Emoji} ${squad1?.name || team1}** ${currentScore1} - ${currentScore2} **${t2Emoji} ${squad2?.name || team2}**`),
            Sep(),
            T(`${sonucEmoji} **${kazanan}**`),
            Sep(),
            T(timeline.join('\n')),
          ]) }).catch(() => {});
          const t1Ad = squad1?.name || team1;
          const t2Ad = squad2?.name || team2;
          const t1Rol = message.guild.roles.cache.find(r => r.name.toLowerCase() === t1Ad.toLowerCase());
          const t2Rol = message.guild.roles.cache.find(r => r.name.toLowerCase() === t2Ad.toLowerCase());
          const m = [t1Rol, t2Rol].filter(Boolean).map(r => `<@&${r.id}>`).join(' ');
          if (m) sonucKanal.send(m).catch(() => {});
        }
      }

      const resultKey = `maçSonuclari.${message.guild.id}.${tur}`;
      const results = db.get(resultKey, []);
      results.push({
        team1: squad1?.name || team1,
        team2: squad2?.name || team2,
        score1: currentScore1,
        score2: currentScore2,
        tarih: new Date().toISOString()
      });
      db.set(resultKey, results);
    },
  },
  'lig-tablosu': {
    async execute(message, args) {
      const tur = args[0]?.toLowerCase() || 'lig';
      const refresh = args.includes('--refresh');

      let results = [];

      if (!refresh) {
        results = db.get(`maçSonuclari.${message.guild.id}.${tur}`, []);
      }

      if (results.length === 0) {
        const sonucKanalId = db.get(`macSonucKanal.${message.guild.id}.${tur}`);
        if (sonucKanalId) {
          const kanal = message.guild.channels.cache.get(sonucKanalId);
          if (kanal) {
            try {
              const fetched = await kanal.messages.fetch({ limit: 100 });
              for (const msg of fetched.values()) {
                if (!msg.components) continue;
                for (const container of msg.components) {
                  if (container.type !== 17 || !container.components) continue;
                  const scoreComp = container.components[2];
                  if (!scoreComp || scoreComp.type !== 10 || !scoreComp.content) continue;
                  const m = scoreComp.content.match(/\*\*(.+?)\*\*\s*(\d+)\s*-\s*(\d+)\s*\*\*(.+?)\*\*/);
                  if (m) {
                    const team1 = m[1].replace(/<:[a-zA-Z0-9_]+:\d+> /g, '').trim();
                    const team2 = m[4].replace(/<:[a-zA-Z0-9_]+:\d+> /g, '').trim();
                    results.push({ team1, team2, score1: parseInt(m[2]), score2: parseInt(m[3]) });
                  }
                }
              }
              if (results.length > 0) {
                db.set(`maçSonuclari.${message.guild.id}.${tur}`, results);
              }
            } catch (e) {}
          }
        }
      }

      if (results.length === 0) return message.reply({ flags: MessageFlags.IsComponentsV2, components: [Container([T(`${E.CL_uyari} "${tur}" türü için maç sonucu bulunamadı.\n\n-# Infermus League`)])] });

      const teams = {};
      for (const r of results) {
        if (!teams[r.team1]) teams[r.team1] = { o: 0, g: 0, b: 0, m: 0, a: 0, y: 0, p: 0 };
        if (!teams[r.team2]) teams[r.team2] = { o: 0, g: 0, b: 0, m: 0, a: 0, y: 0, p: 0 };
        const t1 = teams[r.team1]; const t2 = teams[r.team2];
        t1.o++; t2.o++;
        t1.a += r.score1; t1.y += r.score2;
        t2.a += r.score2; t2.y += r.score1;
        if (r.score1 > r.score2) { t1.g++; t1.p += 3; t2.m++; }
        else if (r.score1 < r.score2) { t2.g++; t2.p += 3; t1.m++; }
        else { t1.b++; t1.p++; t2.b++; t2.p++; }
      }
      const sorted = Object.entries(teams).map(([name, s]) => ({ name, ...s, av: s.a - s.y }))
        .sort((a, b) => b.p - a.p || b.av - a.av || b.a - a.a);

      let createCanvas, loadImage;
      try { ({ createCanvas, loadImage } = require('@napi-rs/canvas')); } catch { return message.reply('Canvas kütüphanesi yüklü değil.'); }

      const FONT = '"Segoe UI", Arial, sans-serif';
      const SL_RED = '#E30A17';

      const trMap = { 'ş':'s','Ş':'S','ç':'c','Ç':'C','ğ':'g','Ğ':'G','ı':'i','İ':'I','ö':'o','Ö':'O','ü':'u','Ü':'U' };
      const trNorm = s => s.replace(/[şŞçÇğĞıİöÖüÜ]/g, c => trMap[c] || c);

      const teamInit = name => name.split(/[\s-]+/).map(w => w[0]).join('').toUpperCase().substring(0, 2);
      const teamClr = name => {
        const map = {
          'Galatasaray':'#C8102E','Fenerbahce':'#003399','Besiktas':'#000000','Trabzonspor':'#7B0032',
          'Basaksehir':'#EE4000','Goztepe':'#C8102E','Eyupspor':'#800020','Corumspor':'#8B0000',
          'Kasimpasa':'#2E8B57','Kocaelispor':'#003366','Erzurumspor':'#1B3A6B','Konyaspor':'#006633',
          'Gaziantepspor':'#DC143C','Amedspor':'#FF6600','Genclerbirligi':'#2F4F4F','Rizespor':'#003399'
        };
        const n = trNorm(name);
        if (map[n]) return map[n];
        const colors = ['#C8102E','#003399','#000000','#7B0032','#EE4000','#2E8B57','#DC143C','#FF6600'];
        return colors[name.split('').reduce((a,c) => a + c.charCodeAt(0), 0) % colors.length];
      };

      const emojiUrls = {};
      for (const t of sorted) {
        const str = teamEmoji(t.name);
        if (str) {
          const m = str.match(/<a?:[a-zA-Z0-9_]+:(\d+)>/);
          if (m) {
            try {
              const url = `https://cdn.discordapp.com/emojis/${m[1]}.png?size=64`;
              emojiUrls[t.name] = await loadImage(url);
            } catch {}
          }
        }
      }

      const rowH = 40, rowCount = sorted.length;
      const h = 130 + rowCount * rowH + 40;
      const w = 800;
      const canvas = createCanvas(w, h);
      const ctx = canvas.getContext('2d');

      const grad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, w*0.6);
      grad.addColorStop(0, '#2a0a0a');
      grad.addColorStop(0.4, '#1a0808');
      grad.addColorStop(1, '#0a0505');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalAlpha = 0.04;
      for (let i = 0; i < 12; i++) {
        ctx.font = `${15 + Math.random() * 30}px ${FONT}`;
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText('★', Math.random() * w, Math.random() * h);
      }
      ctx.restore();

      ctx.save();
      ctx.shadowColor = 'rgba(227,10,23,0.3)';
      ctx.shadowBlur = 40;
      ctx.fillStyle = SL_RED;
      ctx.beginPath();
      ctx.roundRect(25, 20, w - 50, 80, 10);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold 28px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.fillText(trNorm('SÜPER LİG'), w / 2, 56);

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = `11px ${FONT}`;
      ctx.fillText(`${tur.toUpperCase()} • ${results.length} Maç • ${sorted.length} Takım`, w / 2, 80);

      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(25, 20, w - 50, 80, 10);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.beginPath();
      ctx.roundRect(25, 115, w - 50, h - 145, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(227,10,23,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(25, 115, w - 50, h - 145, 10);
      ctx.stroke();

      const cx = { r: 50, l: 78, n: 120, o: 330, g: 370, b: 405, m: 440, a: 480, y: 520, av: 560, p: 620 };
      const tY = 130;

      ctx.fillStyle = SL_RED;
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      ctx.roundRect(cx.r - 5, tY - 16, cx.p + 40 - cx.r + 10, 22, 5);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.font = `bold 10px ${FONT}`;
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.textAlign = 'center';
      const chd = [[cx.r + 8,'#'],[cx.n + 95,'TAKIM'],[cx.o + 12,'O'],[cx.g + 12,'G'],[cx.b + 12,'B'],[cx.m + 12,'M'],[cx.a + 14,'A'],[cx.y + 14,'Y'],[cx.av + 16,'AV'],[cx.p + 14,'P']];
      for (const [xpos, txt] of chd) ctx.fillText(txt, xpos, tY - 3);

      for (let i = 0; i < rowCount; i++) {
        const t = sorted[i];
        const y = tY + i * rowH + 4;

        ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(227,10,23,0.03)';
        ctx.beginPath();
        ctx.roundRect(cx.r - 5, y - 3, cx.p + 40 - cx.r + 10, rowH - 3, 5);
        ctx.fill();

        if (i < 3) {
          ctx.save();
          ctx.shadowColor = ['rgba(255,215,0,0.15)','rgba(192,192,192,0.1)','rgba(205,127,50,0.1)'][i];
          ctx.shadowBlur = 12;
          ctx.fillStyle = ['rgba(255,215,0,0.06)','rgba(192,192,192,0.05)','rgba(205,127,50,0.05)'][i];
          ctx.beginPath();
          ctx.roundRect(cx.r - 5, y - 3, cx.p + 40 - cx.r + 10, rowH - 3, 5);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = ['rgba(255,215,0,0.25)','rgba(192,192,192,0.15)','rgba(205,127,50,0.15)'][i];
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(cx.r - 5, y - 3, cx.p + 40 - cx.r + 10, rowH - 3, 5);
          ctx.stroke();
          ctx.restore();
        }

        let rankStr, rankClr;
        if (i === 0) { rankStr = '🥇'; rankClr = '#FFD700'; }
        else if (i === 1) { rankStr = '🥈'; rankClr = '#C0C0C0'; }
        else if (i === 2) { rankStr = '🥉'; rankClr = '#CD7F32'; }
        else { rankStr = String(i + 1); rankClr = 'rgba(255,255,255,0.4)'; }

        ctx.textAlign = 'center';
        ctx.font = i < 3 ? `18px ${FONT}` : `bold 14px ${FONT}`;
        ctx.fillStyle = rankClr;
        ctx.fillText(rankStr, cx.r + 8, y + 17);

        const lSize = 28;
        const img = emojiUrls[t.name];
        if (img) {
          const iw = img.width, ih = img.height;
          const scale = Math.min(lSize / iw, lSize / ih);
          const dw = iw * scale, dh = ih * scale;
          const dx = cx.l + (lSize - dw) / 2, dy = y + (lSize - dh) / 2;
          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 6;
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.roundRect(cx.l - 2, y - 2, lSize + 4, lSize + 4, 4); ctx.fill();
          ctx.shadowBlur = 0;
          ctx.roundRect(cx.l, y, lSize, lSize, 3); ctx.clip();
          ctx.drawImage(img, dx, dy, dw, dh);
          ctx.restore();
          ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 0.5;
          ctx.roundRect(cx.l, y, lSize, lSize, 3); ctx.stroke();
        } else {
          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 6;
          ctx.beginPath(); ctx.arc(cx.l + lSize/2, y + lSize/2, lSize/2, 0, Math.PI * 2); ctx.closePath();
          ctx.fillStyle = teamClr(t.name); ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.font = `bold 12px ${FONT}`; ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(teamInit(trNorm(t.name)), cx.l + lSize/2, y + lSize/2);
          ctx.textBaseline = 'alphabetic';
          ctx.restore();
        }

        ctx.textAlign = 'left';
        ctx.font = `bold 14px ${FONT}`;
        ctx.fillStyle = '#FFFFFF';
        let label = trNorm(t.name);
        if (label.length > 16) label = label.substring(0, 15) + '…';
        ctx.fillText(label, cx.n, y + 17);

        ctx.textAlign = 'center';
        ctx.font = `12px ${FONT}`;
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.fillText(t.o, cx.o + 12, y + 17);
        ctx.fillText(t.g, cx.g + 12, y + 17);
        ctx.fillText(t.b, cx.b + 12, y + 17);
        ctx.fillText(t.m, cx.m + 12, y + 17);
        ctx.fillText(t.a, cx.a + 14, y + 17);
        ctx.fillText(t.y, cx.y + 14, y + 17);

        ctx.font = `bold 12px ${FONT}`;
        ctx.fillStyle = t.av > 0 ? '#66BB6A' : t.av < 0 ? '#EF5350' : 'rgba(255,255,255,0.4)';
        ctx.fillText(t.av > 0 ? '+' + t.av : String(t.av), cx.av + 16, y + 17);

        ctx.font = `bold 15px ${FONT}`;
        ctx.fillStyle = '#FFD700';
        ctx.fillText(t.p, cx.p + 14, y + 17);
      }

      ctx.font = `10px ${FONT}`;
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.textAlign = 'center';
      ctx.fillText('Infermus League 2025/26', w / 2, h - 12);

      const buf = canvas.toBuffer('image/png');
      return message.channel.send({ files: [{ attachment: buf, name: 'lig-tablosu.png' }] });
    },
  },
};
