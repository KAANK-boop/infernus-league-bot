const { MessageFlags } = require('discord.js');
const db = require('../database/db');
const E = require('../config/emojis');
const { T, Sep, Container, v2Edit } = require('../utils/componentsv2');

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

function getTeamEmoji(teamName) {
  const t = LEAGUE_TEAMS.find(x => x.name.toLowerCase() === teamName.toLowerCase());
  return t ? t.emoji : '⚽';
}

function isAdmin(m) { return m.member.permissions.has('Administrator'); }

function getT(guildId) {
  return db.get(`turnuva.${guildId}`, { aktif: false, isim: null, takimlar: [], fikstur: [], puan: {}, macSayaci: 0 });
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateFixtures(takimlar) {
  let teams = shuffle(takimlar);
  const n = teams.length;
  if (n < 2) return [];
  if (n % 2 !== 0) teams.push('BAY');
  const nt = teams.length;
  const nr = nt - 1;
  const mpr = nt / 2;
  const home = [];
  for (let r = 0; r < nr; r++) {
    const rm = [];
    for (let m = 0; m < mpr; m++) {
      const h = teams[m];
      const a = teams[nt - 1 - m];
      if (h !== 'BAY' && a !== 'BAY') rm.push({ ev: h, dep: a });
    }
    home.push(rm);
    const last = teams.pop();
    teams.splice(1, 0, last);
  }
  const away = home.map(round => round.map(m => ({ ev: m.dep, dep: m.ev })));
  let all = shuffle([...home, ...away]);
  if (all.length > 36) all = all.slice(0, 36);
  return all;
}

function format(message, lines, noContainer) {
  const comps = lines.map(l => typeof l === 'string' ? T(l) : l);
  return {
    flags: MessageFlags.IsComponentsV2,
    components: noContainer ? comps : [Container(comps)]
  };
}

async function sendResultToChannel(message, mac, evS, depS, evP, depP) {
  const kanalId = db.get(`macSonucuKanal.${message.guild.id}`);
  if (!kanalId) return;
  const ch = message.guild.channels.cache.get(kanalId);
  if (!ch) return;
  const evEmoji = getTeamEmoji(mac.ev);
  const depEmoji = getTeamEmoji(mac.dep);
  ch.send(format(message, [
    `${E.CL_futbolbotu} Maç Sonucu`,
    Sep(),
    `${evEmoji} **${mac.ev}** ${evS} - ${depS} **${mac.dep}** ${depEmoji}`,
    Sep(),
    `${evEmoji} **${mac.ev}:** ${evP.puan}P (${evP.g}G ${evP.b}B ${evP.m}M)`,
    `${depEmoji} **${mac.dep}:** ${depP.puan}P (${depP.g}G ${depP.b}B ${depP.m}M)`,
  ]));
  const evRol = message.guild.roles.cache.find(r => r.name.toLowerCase() === mac.ev.toLowerCase());
  const depRol = message.guild.roles.cache.find(r => r.name.toLowerCase() === mac.dep.toLowerCase());
  const mentions = [evRol, depRol].filter(Boolean).map(r => `<@&${r.id}>`).join(' ');
  if (mentions) ch.send(mentions).catch(() => {});
}

module.exports = {
  'turnuva-başlat': {
    execute(message, args) {
      if (!isAdmin(message)) return message.channel.send(format(message, ['Admin yetkisi gerekli.']));
      const guildId = message.guild.id;
      if (getT(guildId).aktif) return message.channel.send(format(message, ['Zaten aktif bir turnuva var! Önce `.turnuva-bitir` ile bitirin.']));

      const isim = args.join(' ') || 'Infermus League';
      db.set(`turnuva.${guildId}`, { aktif: true, isim, takimlar: [], fikstur: [], puan: {}, macSayaci: 0 });

      const takimAdlari = LEAGUE_TEAMS.map(t => t.name);
      db.set(`turnuva.${guildId}.takimlar`, takimAdlari);

      const rounds = generateFixtures(takimAdlari);
      let mc = 0;
      const fikstur = [];
      const puan = {};
      for (const ad of takimAdlari) puan[ad] = { puan: 0, goller: 0, yenilen: 0, mac: 0, g: 0, b: 0, m: 0, averaj: 0 };

      rounds.forEach((round, ri) => {
        round.forEach(m => {
          mc++;
          fikstur.push({ id: `m${mc}`, hafta: ri + 1, ev: m.ev, dep: m.dep, ev_skor: null, dep_skor: null, oynandi: false });
        });
      });

      db.set(`turnuva.${guildId}.fikstur`, fikstur);
      db.set(`turnuva.${guildId}.puan`, puan);
      db.set(`turnuva.${guildId}.macSayaci`, mc);

      const ilkHafta = fikstur.filter(m => m.hafta === 1);
      const macDesc = ilkHafta.map(m =>
        `${getTeamEmoji(m.ev)} **${m.ev}** vs **${m.dep}** ${getTeamEmoji(m.dep)}`
      ).join('\n');

      message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [
          T(`<@&1499768593766678668>`),
          Container([
            T(`${E.CL_kupa} **${isim} Başladı!**`),
            Sep(),
            T(`**1. Hafta fikstürü**`),
            Sep(),
            T(macDesc),
            Sep(),
            T(`${E.CL_yesiltik} **${takimAdlari.length}** takım — **${rounds.length}** hafta\n.fikstür [hafta_no] — Maçları görüntüle\n.puan-durumu — Puan tablosu`),
          ]),
        ]
      });
    }
  },

  'turnuva-ekip-ekle': {
    execute(message, args) {
      if (!isAdmin(message)) return message.channel.send(format(message, ['Admin yetkisi gerekli.']));
      const guildId = message.guild.id;
      const t = getT(guildId);
      if (!t.aktif) return message.channel.send(format(message, ['Aktif bir turnuva yok.']));
      if (t.fikstur.length > 0) return message.channel.send(format(message, ['Fikstür oluşturulduktan sonra takım eklenemez.']));
      if (!args.length) return message.channel.send(format(message, ['Kullanım: `.turnuva-ekip-ekle [takım_adı]`']));
      const ad = args.join(' ');
      if (t.takimlar.includes(ad)) return message.channel.send(format(message, ['Bu takım zaten eklendi.']));

      db.push(`turnuva.${guildId}.takimlar`, ad);
      message.channel.send(format(message, [`${E.CL_yesiltik} **${ad}** turnuvaya eklendi. (${t.takimlar.length + 1} takım)`]));
    }
  },

  'turnuva-ekip-çıkar': {
    execute(message, args) {
      if (!isAdmin(message)) return message.channel.send(format(message, ['Admin yetkisi gerekli.']));
      const guildId = message.guild.id;
      const t = getT(guildId);
      if (!t.aktif) return message.channel.send(format(message, ['Aktif bir turnuva yok.']));
      if (t.fikstur.length > 0) return message.channel.send(format(message, ['Fikstür oluşturulduktan sonra takım çıkarılamaz.']));
      if (!args.length) return message.channel.send(format(message, ['Kullanım: `.turnuva-ekip-çıkar [takım_adı]`']));
      const ad = args.join(' ');
      if (!t.takimlar.includes(ad)) return message.channel.send(format(message, ['Bu takım turnuvada bulunmuyor.']));

      db.set(`turnuva.${guildId}.takimlar`, t.takimlar.filter(x => x !== ad));
      message.channel.send(format(message, [`${E.CL_carpi} **${ad}** turnuvadan çıkarıldı.`]));
    }
  },

  'turnuva-fikstür': {
    execute(message) {
      if (!isAdmin(message)) return message.channel.send(format(message, ['Admin yetkisi gerekli.']));
      const guildId = message.guild.id;
      const t = getT(guildId);
      if (!t.aktif) return message.channel.send(format(message, ['Aktif bir turnuva yok.']));
      if (t.takimlar.length < 2) return message.channel.send(format(message, ['En az 2 takım gerekli.']));
      if (t.fikstur.length > 0) return message.channel.send(format(message, ['Fikstür zaten oluşturulmuş.']));

      const rounds = generateFixtures(t.takimlar);
      let mc = 0;
      const fikstur = [];
      const puan = {};
      for (const ad of t.takimlar) puan[ad] = { puan: 0, goller: 0, yenilen: 0, mac: 0, g: 0, b: 0, m: 0, averaj: 0 };

      rounds.forEach((round, ri) => {
        round.forEach(m => {
          mc++;
          fikstur.push({ id: `m${mc}`, hafta: ri + 1, ev: m.ev, dep: m.dep, ev_skor: null, dep_skor: null, oynandi: false });
        });
      });

      db.set(`turnuva.${guildId}.fikstur`, fikstur);
      db.set(`turnuva.${guildId}.puan`, puan);
      db.set(`turnuva.${guildId}.macSayaci`, mc);

      message.channel.send(format(message, [
        `${E.CL_pano} Fikstür Oluşturuldu`,
        Sep(),
        `${E.CL_yesiltik} **${t.isim}**`,
        Sep(),
        `${E.CL_kupa} **${t.takimlar.length}** takım — **${rounds.length}** hafta — **${fikstur.length}** maç`,
        `(Takımlar en fazla 2 kez karşılaşır, max 36 hafta)`,
        Sep(),
        `.fikstür [hafta_no] — Maçları görüntüle`,
        `.puan-durumu — Puan durumunu gör`,
      ]));
    }
  },

  'turnuva-bitir': {
    execute(message) {
      if (!isAdmin(message)) return message.channel.send(format(message, ['Admin yetkisi gerekli.']));
      const guildId = message.guild.id;
      const t = getT(guildId);
      if (!t.aktif) return message.channel.send(format(message, ['Aktif bir turnuva yok.']));

      db.set(`turnuva.${guildId}`, { aktif: false, isim: null, takimlar: [], fikstur: [], puan: {}, macSayaci: 0 });
      message.channel.send(format(message, [`${E.CL_kupa} **${t.isim}** turnuvası sonlandırıldı.`]));
    }
  },

  turnuva: {
    execute(message) {
      const guildId = message.guild.id;
      const t = getT(guildId);
      if (!t.aktif) return message.channel.send(format(message, ['Şu anda aktif bir turnuva bulunmuyor.']));

      const oynanan = t.fikstur.filter(m => m.oynandi).length;
      message.channel.send(format(message, [
        `${E.CL_kupa} **${t.isim}**`,
        Sep(),
        `${E.CL_yesiltik} **Takım:** ${t.takimlar.length}`,
        `${E.CL_futbolbotu} **Maçlar:** ${oynanan}/${t.fikstur.length} oynandı`,
        Sep(),
        `.fikstür [hafta] — Maç programı`,
        `.puan-durumu — Puan tablosu`,
        `.golkrallığı — Gol krallığı`,
        `.asistkrallığı — Asist krallığı`,
      ]));
    }
  },

  fikstür: {
    execute(message, args) {
      const guildId = message.guild.id;
      const t = getT(guildId);
      if (!t.aktif || t.fikstur.length === 0) return message.channel.send(format(message, ['Aktif turnuva veya kayıt bulunmuyor.']));

      const maxH = Math.max(...t.fikstur.map(m => m.hafta));
      const hafta = args[0] ? parseInt(args[0]) : null;
      if (hafta && (hafta < 1 || hafta > maxH)) return message.channel.send(format(message, [`Geçerli hafta: 1-${maxH}`]));

      if (hafta) {
        const maclar = t.fikstur.filter(m => m.hafta === hafta);
        const desc = maclar.map(m => {
          const evEmoji = getTeamEmoji(m.ev);
          const depEmoji = getTeamEmoji(m.dep);
          if (m.oynandi) {
            const evKazandi = m.ev_skor > m.dep_skor ? E.CL_kupa : E.CL_sag_ok;
            const depKazandi = m.dep_skor > m.ev_skor ? E.CL_kupa : E.CL_sag_ok;
            return `${evEmoji} ${evKazandi} **${m.ev}** **${m.ev_skor}** - **${m.dep_skor}** **${m.dep}** ${depEmoji} ${depKazandi}`;
          }
          return `${evEmoji} **${m.ev}** vs **${m.dep}** ${depEmoji}`;
        }).join('\n');

        message.channel.send(format(message, [
          `${E.CL_pano} **${t.isim} — ${hafta}. Hafta**`,
          Sep(),
          desc,
          Sep(),
        ]));
      } else {
        const lines = [];
        for (let i = 1; i <= maxH; i++) {
          const maclar = t.fikstur.filter(m => m.hafta === i);
          const oyn = maclar.filter(m => m.oynandi).length;
          lines.push(`${E.CL_kupa} **${i}. Hafta** — ${oyn}/${maclar.length} maç`);
        }

        message.channel.send(format(message, [
          `**${t.isim} — Kayıt**`,
          Sep(),
          ...lines,
          Sep(),
          `.fikstür [hafta_no] detay için`,
        ]));
      }
    }
  },

  'puan-durumu': {
    execute(message) {
      const guildId = message.guild.id;
      const t = getT(guildId);
      if (!t.aktif || !Object.keys(t.puan).length) return message.channel.send(format(message, ['Aktif turnuva veya puan durumu bulunmuyor.']));

      const sorted = Object.entries(t.puan).sort((a, b) => {
        if (b[1].puan !== a[1].puan) return b[1].puan - a[1].puan;
        return (b[1].goller - b[1].yenilen) - (a[1].goller - a[1].yenilen);
      });

      const lines = sorted.map(([isim, p], i) => {
        const m = i === 0 ? E.CL_kupa : i === 1 ? E.CL_bilet : i === 2 ? E.CL_kraltac : E.CL_yildiz;
        const avg = p.goller - p.yenilen;
        return `${m} **${i + 1}.** ${isim} | **${p.puan}P** | ${p.g}G ${p.b}B ${p.m}M | ${p.goller}:${p.yenilen} (${avg > 0 ? '+' : ''}${avg})`;
      });

      message.channel.send(format(message, [
        `${E.CL_pano} **${t.isim} — Puan Durumu**`,
        Sep(),
        `# | Takım | P | G-B-M | A:Y`,
        Sep(),
        ...lines,
      ]));
    }
  },

  'maç-sonucu': {
    async execute(message, args) {
      if (!isAdmin(message)) return message.channel.send(format(message, ['Admin yetkisi gerekli.']));
      const guildId = message.guild.id;
      const t = getT(guildId);
      if (!t.aktif || !t.fikstur.length) return message.channel.send(format(message, ['Aktif turnuva veya kayıt yok.']));
      if (args.length < 3) return message.channel.send(format(message, ['Kullanım: `.maç-sonucu [maçID] [ev_skor] [dep_skor]`']));

      const macId = args[0];
      const evS = parseInt(args[1]);
      const depS = parseInt(args[2]);
      if (isNaN(evS) || isNaN(depS)) return message.channel.send(format(message, ['Geçerli skor girin.']));

      const idx = t.fikstur.findIndex(m => m.id === macId);
      if (idx === -1) return message.channel.send(format(message, ['Maç bulunamadı.']));
      if (t.fikstur[idx].oynandi) return message.channel.send(format(message, ['Bu maç zaten oynandı.']));

      const mac = t.fikstur[idx];
      db.set(`turnuva.${guildId}.fikstur.${idx}.ev_skor`, evS);
      db.set(`turnuva.${guildId}.fikstur.${idx}.dep_skor`, depS);
      db.set(`turnuva.${guildId}.fikstur.${idx}.oynandi`, true);

      const evP = db.get(`turnuva.${guildId}.puan.${mac.ev}`, { puan: 0, goller: 0, yenilen: 0, mac: 0, g: 0, b: 0, m: 0 });
      const depP = db.get(`turnuva.${guildId}.puan.${mac.dep}`, { puan: 0, goller: 0, yenilen: 0, mac: 0, g: 0, b: 0, m: 0 });

      evP.mac++; depP.mac++;
      evP.goller += evS; evP.yenilen += depS;
      depP.goller += depS; depP.yenilen += evS;

      if (evS > depS) { evP.puan += 3; evP.g++; depP.m++; }
      else if (depS > evS) { depP.puan += 3; depP.g++; evP.m++; }
      else { evP.puan += 1; depP.puan += 1; evP.b++; depP.b++; }

      db.set(`turnuva.${guildId}.puan.${mac.ev}`, evP);
      db.set(`turnuva.${guildId}.puan.${mac.dep}`, depP);

      message.channel.send(format(message, [
        `${E.CL_futbolbotu} Maç Sonucu`,
        Sep(),
        `${E.CL_yesiltik} **${mac.ev}** ${evS} - ${depS} **${mac.dep}**`,
        Sep(),
        `**${mac.ev}:** ${evP.puan}P (${evP.g}G ${evP.b}B ${evP.m}M)`,
        `**${mac.dep}:** ${depP.puan}P (${depP.g}G ${depP.b}B ${depP.m}M)`,
      ]));
      sendResultToChannel(message, mac, evS, depS, evP, depP);
    }
  },

  golekle: {
    execute(message) {
      if (!isAdmin(message)) return message.channel.send(format(message, ['Admin yetkisi gerekli.']));
      const user = message.mentions.users.first();
      if (!user) return message.channel.send(format(message, ['Kullanım: `.golekle @kullanici`']));

      db.add(`users.${user.id}.goals`, 1);
      db.add(`users.${user.id}.matchStats.gol`, 1);
      const total = db.get(`users.${user.id}.goals`, 0);

      message.channel.send(format(message, [`${E.CL_yesiltik} ${user} ⚽ **+1 gol** (Toplam: ${total})`]));
    }
  },

  asistekle: {
    execute(message) {
      if (!isAdmin(message)) return message.channel.send(format(message, ['Admin yetkisi gerekli.']));
      const user = message.mentions.users.first();
      if (!user) return message.channel.send(format(message, ['Kullanım: `.asistekle @kullanici`']));

      db.add(`users.${user.id}.assists`, 1);
      db.add(`users.${user.id}.matchStats.asist`, 1);
      const total = db.get(`users.${user.id}.assists`, 0);

      message.channel.send(format(message, [`${E.CL_yesiltik} ${user} 🅰️ **+1 asist** (Toplam: ${total})`]));
    }
  },

  golkrallığı: {
    execute(message) {
      const users = db.getAllUsers();
      const sorted = Object.entries(users)
        .filter(([, u]) => (u.goals || 0) > 0)
        .sort((a, b) => (b[1].goals || 0) - (a[1].goals || 0))
        .slice(0, 10);

      if (!sorted.length) return message.channel.send(format(message, ['Henüz gol kaydı bulunmuyor.']));

      const desc = sorted.map(([id, u], i) => {
        const tag = message.client.users.cache.get(id)?.tag || 'Bilinmeyen';
        const m = i === 0 ? E.CL_kupa : i === 1 ? E.CL_bilet : i === 2 ? E.CL_kraltac : E.CL_yildiz;
        return `${m} **${i + 1}.** ${tag} — ⚽ ${u.goals} gol`;
      }).join('\n');

      message.channel.send(format(message, [
        `${E.CL_kupa} Gol Krallığı`,
        Sep(),
        desc,
      ]));
    }
  },

  asistkrallığı: {
    execute(message) {
      const users = db.getAllUsers();
      const sorted = Object.entries(users)
        .filter(([, u]) => (u.assists || 0) > 0)
        .sort((a, b) => (b[1].assists || 0) - (a[1].assists || 0))
        .slice(0, 10);

      if (!sorted.length) return message.channel.send(format(message, ['Henüz asist kaydı bulunmuyor.']));

      const desc = sorted.map(([id, u], i) => {
        const tag = message.client.users.cache.get(id)?.tag || 'Bilinmeyen';
        const m = i === 0 ? E.CL_kupa : i === 1 ? E.CL_bilet : i === 2 ? E.CL_kraltac : E.CL_yildiz;
        return `${m} **${i + 1}.** ${tag} — 🅰️ ${u.assists} asist`;
      }).join('\n');

      message.channel.send(format(message, [
        `${E.CL_kupa} Asist Krallığı`,
        Sep(),
        desc,
      ]));
    }
  }
};
