const { MessageFlags, ComponentType } = require('discord.js');
const { T, Container } = require('../utils/componentsv2');
const db = require('../database/db');
const E = require('../config/emojis');

const GIF_API = 'https://purrbot.site/api/img/sfw';
const GIF_FALLBACKS = {
  kick: 'https://nekos.best/api/v2/kick/001.gif',
  punch: 'https://nekos.best/api/v2/punch/001.gif',
  wave: 'https://nekos.best/api/v2/wave/001.gif',
  wink: 'https://nekos.best/api/v2/wink/001.gif',
  stare: 'https://nekos.best/api/v2/stare/001.gif',
  happy: 'https://nekos.best/api/v2/happy/001.gif',
  handhold: 'https://nekos.best/api/v2/handhold/001.gif',
};

async function getGif(action) {
  if (GIF_FALLBACKS[action]) return GIF_FALLBACKS[action];
  try {
    const res = await fetch(`${GIF_API}/${action}/gif`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    return data.link || `https://nekos.best/api/v2/${action}/001.gif`;
  } catch {
    return `https://nekos.best/api/v2/${action}/001.gif`;
  }
}

function getBal(uid) { return db.get(`users.${uid}.balance`, 0); }
function addBal(uid, a) { return db.add(`users.${uid}.balance`, a); }
function subBal(uid, a) { return db.subtract(`users.${uid}.balance`, a); }

module.exports = {
  yt: {
    execute(message, args) {
      if (!args[0] || !args[1]) return message.reply('Kullanım: `.yt <miktar> <yazı/tura>`');
      const amount = parseInt(args[0]);
      if (isNaN(amount) || amount <= 0) return message.reply('Geçerli bir miktar girin!');
      const choice = args[1].toLowerCase();
      if (choice !== 'yazı' && choice !== 'tura') return message.reply('Yazı mı tura mı? `.yt 100 yazı`');
      const bal = getBal(message.author.id);
      if (bal < amount) return message.reply('Yetersiz bakiye!');
      const result = Math.random() < 0.5 ? 'yazı' : 'tura';
      const kazandi = choice === result;
      subBal(message.author.id, amount);
      let desc;
      if (kazandi) {
        addBal(message.author.id, amount * 2);
        desc = `${E.CL_hediye} **${result.toUpperCase()}!** Kazandın! **+${amount * 2}** coin`;
      } else {
        desc = `${E.CL_carpi} **${result.toUpperCase()}!** Kaybettin. **-${amount}** coin`;
      }
      message.channel.send({
        components: [Container([T(`**${message.author.username} • ${kazandi ? 'Kazandı' : 'Kaybetti'}**\n\n${desc}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },
  yazıtura: {
    execute(message, args) { module.exports.yt.execute(message, args); }
  },
  zar: {
    execute(message, args) {
      if (!args[0] || !args[1]) return message.reply('Kullanım: `.zar <miktar> <1-6>`');
      const amount = parseInt(args[0]);
      if (isNaN(amount) || amount <= 0) return message.reply('Geçerli bir miktar girin!');
      const guess = parseInt(args[1]);
      if (isNaN(guess) || guess < 1 || guess > 6) return message.reply('1-6 arası bir sayı seç!');
      const bal = getBal(message.author.id);
      if (bal < amount) return message.reply('Yetersiz bakiye!');
      const rolled = Math.floor(Math.random() * 6) + 1;
      subBal(message.author.id, amount);
      let desc;
      if (rolled === guess) {
        addBal(message.author.id, amount * 6);
        desc = `${E.CL_yesiltik} **${rolled}** geldi! Bildin! **+${amount * 6}** coin`;
      } else if (rolled % 2 === guess % 2) {
        addBal(message.author.id, amount);
        desc = `${E.CL_kupa} **${rolled}** geldi. ${rolled % 2 === 0 ? 'Çift' : 'Tek'} bildin! **+${amount}** coin (zarar yok)`;
      } else {
        desc = `${E.CL_carpi} **${rolled}** geldi. Bilemedin. **-${amount}** coin`;
      }
      message.channel.send({
        components: [Container([T(`**${message.author.username} • Zar**\n\n${desc}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },
  slot: {
    execute(message, args) {
      const amount = parseInt(args[0]);
      if (!amount || isNaN(amount) || amount <= 0) return message.reply('Kullanım: `.slot <miktar>`');
      const bal = getBal(message.author.id);
      if (bal < amount) return message.reply('Yetersiz bakiye!');
      subBal(message.author.id, amount);
      const symbols = [E.CL_futbolbotu, E.CL_kalkan, E.CL_kupa, E.CL_yildiz, E.CL_hedef, E.CL_kirmizi_ates, E.CL_crystal, E.CL_kirmizitop];
      const s1 = symbols[Math.floor(Math.random() * symbols.length)];
      const s2 = symbols[Math.floor(Math.random() * symbols.length)];
      const s3 = symbols[Math.floor(Math.random() * symbols.length)];
      let multi = 0;
      if (s1 === s2 && s2 === s3) {
        multi = s1 === E.CL_crystal ? 10 : s1 === E.CL_kupa ? 7 : s1 === E.CL_yildiz ? 5 : 4;
      } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        multi = 1.5;
      }
      const kazanc = Math.floor(amount * multi);
      if (multi > 0) addBal(message.author.id, kazanc);
      message.channel.send({
        components: [Container([T(`**Slot**\n\n┌─────────────┐\n  ${s1} ─ ${s2} ─ ${s3}  \n└─────────────┘\n\n${multi > 0 ? `${E.CL_hediye} **+${kazanc}** coin (${multi}x)` : `${E.CL_carpi} Kaybettin **-${amount}** coin`}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },
  penaltı: {
    execute(message, args) {
      const amount = parseInt(args[0]);
      if (!amount || isNaN(amount) || amount <= 0) return message.reply('Kullanım: `.penaltı <miktar>`');
      const bal = getBal(message.author.id);
      if (bal < amount) return message.reply('Yetersiz bakiye!');
      subBal(message.author.id, amount);
      const scored = Math.random() < 0.6;
      const kazanc = scored ? Math.floor(amount * 1.7) : 0;
      if (scored) addBal(message.author.id, kazanc);
      const yon = ['sol', 'sağ', 'orta'][Math.floor(Math.random() * 3)];
      message.channel.send({
        components: [Container([T(`**${message.author.username} • ${E.CL_futbolbotu} Penaltı**\n\n${scored ? `Kaleci **${yon}**a atladı! ${E.CL_futbolbotu} Gol! **+${kazanc}** coin (1.7x)` : `Kaleci **${yon}**a atladı! ${E.CL_carpi} Kurtardı! **-${amount}** coin`}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },
  'yazı-tura': {
    execute(message, args) { module.exports.yt.execute(message, args); }
  },

  öp: { async execute(message) { await gifAction(message, 'kiss', 'öpücük', true); } },
  tokat: { async execute(message) { await gifAction(message, 'slap', 'tokat attı!', true); } },
  sarıl: { async execute(message) { await gifAction(message, 'hug', 'sarıldı'); } },
  tekme: { async execute(message) { await gifAction(message, 'kick', 'tekme attı!', true); } },
  oksşa: { async execute(message) { await gifAction(message, 'pat', 'okşadı'); } },
  yumruk: { async execute(message) { await gifAction(message, 'punch', 'yumruk attı!', true); } },
  kucakla: { async execute(message) { await gifAction(message, 'cuddle', 'kucakladı'); } },
  cuddle: { execute(msg) { module.exports.kucakla.execute(msg); } },
  dürt: { async execute(message) { await gifAction(message, 'poke', 'dürttü'); } },
  ısır: { async execute(message) { await gifAction(message, 'bite', 'ısırdı!', true); } },
  gıdıkla: { async execute(message) { await gifAction(message, 'tickle', 'gıdıkladı'); } },
  besle: { async execute(message) { await gifAction(message, 'feed', 'besledi'); } },
  dans: { async execute(message) { await gifAction(message, 'dance', 'dans ediyor!', false, false); } },
  gülümse: { async execute(message) { await gifAction(message, 'smile', 'gülümsüyor', false, false); } },
  'el-salla': { async execute(message) { await gifAction(message, 'wave', 'el salladı'); } },
  selam: { execute(msg) { module.exports['el-salla'].execute(msg); } },
  gozkırp: { async execute(message) { await gifAction(message, 'wink', 'göz kırptı'); } },
  'göz-kırp': { execute(msg) { module.exports.gozkırp.execute(msg); } },
  bak: { async execute(message) { await gifAction(message, 'stare', 'bakıyor'); } },
  ağla: { async execute(message) { await gifAction(message, 'cry', 'ağlıyor', false, false); } },
  utan: { async execute(message) { await gifAction(message, 'blush', 'utandı', false, false); } },
  sevin: { async execute(message) { await gifAction(message, 'happy', 'çok sevinçli!', false, false); } },
  kafa: { async execute(message) { await gifAction(message, 'handhold', 'elele tutuştu'); } },
  blackjack: {
    execute(message, args) {
      const bet = parseInt(args[0]);
      if (!bet || bet <= 0) return message.reply('Kullanım: `.blackjack (miktar)`');
      const bal = getBal(message.author.id);
      if (bal < bet) return message.reply('Yetersiz bakiye!');

      const draw = () => Math.min(Math.floor(Math.random() * 13) + 1, 10);
      const player = [draw(), draw()];
      const dealer = [draw(), draw()];
      const sum = cards => cards.reduce((a, c) => a + c, 0);
      let pSum = sum(player);
      let dSum = sum(dealer);

      while (dSum < 17) { dealer.push(draw()); dSum = sum(dealer); }

      subBal(message.author.id, bet);
      let result, multi;
      if (pSum > 21) { result = 'Patladın!'; multi = 0; }
      else if (dSum > 21) { result = 'Krupiye patladı!'; multi = 2; }
      else if (pSum > dSum) { result = 'Kazandın!'; multi = 2; }
      else if (pSum === dSum) { result = 'Berabere!'; multi = 1; }
      else { result = 'Kaybettin!'; multi = 0; }

      if (multi > 0) addBal(message.author.id, Math.floor(bet * multi));

      message.channel.send({
        components: [Container([T(`**Blackjack**\n\n**Sen:** ${player.join(' + ')} = **${pSum}**\n**Krupiye:** ${dealer.join(' + ')} = **${dSum}**\n\n**${result}**\n${multi > 0 ? `${E.CL_hediye} **+${Math.floor(bet * multi)}** coin` : `${E.CL_carpi} **-${bet}** coin`}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },
  bj: {
    execute(message, args) { module.exports.blackjack.execute(message, args); }
  },
  'yüksek-düşük': {
    execute(message, args) {
      const bet = parseInt(args[0]);
      const guess = args[1]?.toLowerCase();
      if (!bet || bet <= 0 || !['yüksek', 'düşük'].includes(guess)) return message.reply('Kullanım: `.yüksek-düşük (miktar) (yüksek/düşük)`');
      const bal = getBal(message.author.id);
      if (bal < bet) return message.reply('Yetersiz bakiye!');

      const first = Math.floor(Math.random() * 13) + 1;
      const second = Math.floor(Math.random() * 13) + 1;
      const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

      subBal(message.author.id, bet);
      let won;
      if (first === second) won = false;
      else if (guess === 'yüksek') won = second > first;
      else won = second < first;

      if (won) addBal(message.author.id, Math.floor(bet * 1.9));

      message.channel.send({
        components: [Container([T(`**Yüksek - Düşük**\n\nKart: **${cards[first - 1]}**\nSonraki kart: **${cards[second - 1]}**\nTahmin: **${guess}**\n\n${won ? `${E.CL_hediye} **Kazandın!**` : `${E.CL_carpi} **Kaybettin!**`}\n${won ? `${E.CL_electro_money} **+${Math.floor(bet * 1.9)}** coin` : `${E.CL_carpi} **-${bet}** coin`}\n\n-# Infermus League`)])],
        flags: 32768
      });
    }
  },
};

async function gifAction(message, action, text, needsTarget, selfBlock = true) {
  const user = message.mentions.users.first();
  if (needsTarget && !user) return message.reply('Bir kullanıcı etiketle!');
  if (selfBlock !== false && user && user.id === message.author.id) return message.reply('Kendine bunu yapamazsın!');

  const gif = await getGif(action);
  const desc = user
    ? `${message.author} → ${user} **${text}**`
    : `${message.author} **${text}**`;

  message.channel.send({
    components: [{ type: ComponentType.Container, components: [T(`${desc}\n\n-# Infermus League`)], media: [{ url: gif }] }],
    flags: 32768
  });
}
