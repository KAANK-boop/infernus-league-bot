const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PANEL_PORT || 4000;
const BOT_DIR = path.resolve(__dirname, '..');
const DB_FILE = path.join(BOT_DIR, 'database', 'data.json');
const LOG_FILE = path.join(BOT_DIR, 'panel', 'bot.log');

let db = {};
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } else db = {};
  } catch { db = {}; }
}
function dbGet(key, def = null) {
  const keys = key.split('.');
  let cur = db;
  for (const k of keys) { if (cur == null) return def; cur = cur[k]; }
  return cur != null ? cur : def;
}
function dbSet(key, value) {
  const keys = key.split('.');
  let cur = db;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!cur[keys[i]] || typeof cur[keys[i]] !== 'object') cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}
function getAllUsers() { return db.users || {}; }

loadDb();
fs.watchFile(DB_FILE, () => loadDb());

let botLogs = [];
const BOT_START = Date.now();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'electro-panel-secret-2026',
  resave: false,
  saveUninitialized: false,
}));

const AUTHPASS = process.env.PANEL_PASSWORD || 'admin123';

function requireAuth(req, res, next) {
  if (req.session.authed) return next();
  res.redirect('/login');
}

function addLog(msg) {
  const line = `[${new Date().toLocaleTimeString()}] ${msg}`;
  botLogs.unshift(line);
  if (botLogs.length > 200) botLogs.length = 200;
  fs.appendFile(LOG_FILE, line + '\n', () => {});
}

function extractGuildIds() {
  const ids = new Set();
  ['kayitGecmisi','guard','roller','davetler','snipe','araclar','evler','kayitSayac','settings'].forEach(k => {
    if (db[k]) Object.keys(db[k]).forEach(id => ids.add(id));
  });
  if (db._cache?.membersFetch) Object.keys(db._cache.membersFetch).forEach(id => ids.add(id));
  return [...ids];
}

function getGuildData(guildId) {
  const users = getAllUsers();
  const uList = Object.keys(users).map(id => users[id]);
  const membersInGuild = uList.length;
  const kayitlar = dbGet('kayitGecmisi.' + guildId, []);
  const kayitSayisi = Array.isArray(kayitlar) ? kayitlar.length : 0;
  const roller = dbGet('roller.' + guildId, {});
  const rolSayisi = Object.keys(roller).length;
  return { memberCount: membersInGuild, kayitSayisi, rolSayisi };
}

function resolveUserMap() {
  const users = getAllUsers();
  const map = {};
  Object.keys(users).forEach(id => { map[id] = users[id].name || users[id].username || null; });
  return map;
}

function userName(id, map) {
  if (!map) map = resolveUserMap();
  return map[id] || null;
}

// === ROUTES ===

app.get('/', (req, res) => {
  res.render('index', {
    status: 'offline', ping: 0, guilds: 0, members: 0,
    commands: 0, botUsername: 'Infermus League', botAvatar: '',
    guildList: [], uptime: 0,
  });
});

app.get('/komutlar', (req, res) => {
  const categories = [
    { name: 'Futbol', icon: '⚽', cmds: ['.kadro', '.kadrom', '.kadrosil', '.ilk11ayarla', '.ara', '.puan', '.maç'] },
    { name: 'Ekonomi', icon: '💰', cmds: ['.embakiye', '.empay', '.emadd', '.emremove', '.emyatir', '.emcek'] },
    { name: 'Araç & Ev', icon: '🏠', cmds: ['.araçal', '.araçsat', '.araçlarım', '.evaç', '.evsat', '.evlerim'] },
    { name: 'Eğlence', icon: '🎮', cmds: ['.ship', '.yazı-tura', '.zar', '.aşk-testi', '.karakter', '.espri', '.burç', '.kahve'] },
    { name: 'Yetkili', icon: '🛡️', cmds: ['.kayit', '.sil', '.herkeserolver', '.takmaadsıfırla', '.oylama', '.duyuru'] },
    { name: 'Kullanıcı', icon: '👤', cmds: ['.yardım', '.sunucu', '.davetler', '.bilgi', '.döviz', '.hava', '.çeviri'] },
    { name: 'Premium', icon: '⭐', cmds: ['.electro-premium', '.reklampaketleri', '.reklambilgi'] },
  ];
  res.render('commands', { categories });
});

app.get('/login', (req, res) => {
  if (req.session.authed) return res.redirect('/panel');
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  if (req.body.password === AUTHPASS) {
    req.session.authed = true;
    res.redirect('/panel');
  } else {
    res.render('login', { error: 'Hatalı şifre!' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/panel', requireAuth, (req, res) => {
  const guildIds = extractGuildIds();
  const users = getAllUsers();
  const guildList = guildIds.map(id => {
    const gd = getGuildData(id);
    return { id, name: 'Sunucu #' + id.slice(0, 5), memberCount: gd.memberCount, icon: null };
  });
  res.render('panel', {
    status: 'offline', ping: 0, guilds: guildIds.length,
    members: Object.keys(users).length,
    uptime: '—', commands: 0, logs: botLogs.slice(0, 50),
    botUsername: 'Infermus League', botAvatar: '',
    guildList,
    page: req.query.page || 'dashboard',
  });
});

// === API ENDPOINTS (direct DB reads) ===

app.get('/api/status', requireAuth, (req, res) => {
  res.json({
    status: 'offline', ping: 0, guilds: extractGuildIds().length, members: 0,
    uptime: 0, commands: 0, logs: botLogs.slice(0, 50),
  });
});

app.get('/api/admin/users', requireAuth, (req, res) => {
  const users = getAllUsers();
  const list = Object.keys(users).map(id => {
    const u = users[id];
    return {
      id, name: u.name || u.username || null,
      balance: u.balance || 0, bankBalance: u.bankBalance || 0,
      value: u.value || 0, goals: u.goals || 0, assists: u.assists || 0,
      position: u.position || null, squad: u.squad || null, country: u.country || null,
      role: u.role || null,
    };
  });
  res.json({ users: list, total: list.length });
});

app.get('/api/admin/user', requireAuth, (req, res) => {
  const u = dbGet('users.' + req.query.userId);
  if (!u) return res.json({ error: 'Kullanıcı bulunamadı' });
  const bl = dbGet('blacklist', []);
  res.json({
    user: {
      id: req.query.userId, name: u.name || u.username || null,
      balance: u.balance || 0, bankBalance: u.bankBalance || 0,
      value: u.value || 0, goals: u.goals || 0, assists: u.assists || 0,
      position: u.position || null, squad: u.squad || null, country: u.country || null,
      role: u.role || null,
    },
    blacklisted: bl.includes(req.query.userId),
    warns: dbGet('warns.' + req.query.userId, []),
  });
});

app.get('/api/settings', requireAuth, (req, res) => {
  const gid = req.query.guildId;
  if (!gid) return res.json({ error: 'guildId gerekli' });
  res.json({ settings: dbGet('guard.' + gid, {}) });
});

app.post('/api/settings', requireAuth, (req, res) => {
  const { guildId, key, value } = req.body;
  if (!guildId || !key) return res.json({ error: 'Eksik parametre' });
  const guard = dbGet('guard.' + guildId, {});
  guard[key] = value;
  dbSet('guard.' + guildId, guard);
  res.json({ ok: true });
});

app.post('/api/admin/user-update', requireAuth, (req, res) => {
  const { userId, key, value } = req.body;
  if (!userId || !key) return res.json({ error: 'Eksik parametre' });
  dbSet('users.' + userId + '.' + key, value);
  res.json({ ok: true });
});

app.get('/api/admin/blacklist', requireAuth, (req, res) => {
  res.json({ blacklist: dbGet('blacklist', []) });
});

app.post('/api/admin/blacklist', requireAuth, (req, res) => {
  const { userId, action } = req.body;
  let bl = dbGet('blacklist', []);
  if (action === 'add') { if (!bl.includes(userId)) bl.push(userId); }
  else { bl = bl.filter(id => id !== userId); }
  dbSet('blacklist', bl);
  res.json({ ok: true });
});

app.get('/api/admin/warns', requireAuth, (req, res) => {
  res.json({ warns: dbGet('warns.' + req.query.userId, []) });
});

app.post('/api/admin/warn', requireAuth, (req, res) => {
  const { userId, reason } = req.body;
  const warns = dbGet('warns.' + userId, []);
  warns.push({ reason, date: new Date().toISOString(), author: 'Panel' });
  dbSet('warns.' + userId, warns);
  res.json({ ok: true });
});

app.get('/api/admin/invites', requireAuth, (req, res) => {
  const invs = dbGet('invites.' + req.query.guildId, {});
  const map = resolveUserMap();
  const list = Object.keys(invs).map(id => ({ name: userName(id, map) || id, count: invs[id] }));
  list.sort((a, b) => b.count - a.count);
  res.json({ invites: list });
});

app.get('/api/admin/guild-config', requireAuth, (req, res) => {
  const gid = req.query.guildId;
  res.json({ config: {
    roller: dbGet('roller.' + gid, {}),
    degerKanal: dbGet('degerKanal.' + gid, ''),
    macSonucuKanal: dbGet('macSonucuKanal.' + gid, ''),
    kayitSayac: dbGet('kayitSayac.' + gid, 0),
  }});
});

app.post('/api/admin/guild-config', requireAuth, (req, res) => {
  const { guildId, key, value } = req.body;
  dbSet(key + '.' + guildId, value);
  res.json({ ok: true });
});

app.get('/api/admin/guild-detail', requireAuth, (req, res) => {
  const gid = req.query.guildId;
  const gd = getGuildData(gid);
  const roller = dbGet('roller.' + gid, {});
  const guard = dbGet('guard.' + gid, {});
  res.json({
    id: gid, name: 'Sunucu #' + gid.slice(0, 5), icon: null,
    memberCount: gd.memberCount, humanCount: gd.memberCount, botCount: 0,
    ownerId: '—', channels: [], roles: Object.keys(roller).map(k => ({
      name: k, id: roller[k], color: 0x666666, memberCount: 0,
    })),
    guardSettings: Object.keys(guard).length,
  });
});

app.get('/api/admin/stats', requireAuth, (req, res) => {
  const users = getAllUsers();
  const uList = Object.keys(users).map(id => users[id]);
  const totalUsers = uList.length;
  const totalBalance = uList.reduce((s, u) => s + (u.balance || 0), 0);
  const totalBank = uList.reduce((s, u) => s + (u.bankBalance || 0), 0);
  const totalValue = uList.reduce((s, u) => s + (u.value || 0), 0);
  const totalWarns = Object.keys(db.warns || {}).reduce((s, k) => s + (db.warns[k]?.length || 0), 0);
  const guards = db.guard || {};
  const guardGuilds = Object.keys(guards).filter(k => guards[k] && Object.values(guards[k]).some(v => v?.enabled)).length;
  const matches = dbGet('matches', []);
  const uptime = Math.floor((Date.now() - BOT_START) / 1000);
  res.json({
    totalUsers, totalBalance, totalBank, totalValue, guardGuilds, totalWarns,
    guildCount: extractGuildIds().length, memberCount: totalUsers,
    commands: 0, totalMatches: matches.length, uptime,
  });
});

app.get('/api/admin/players', requireAuth, (req, res) => {
  const users = getAllUsers();
  const search = (req.query.search || '').toLowerCase();
  const sort = req.query.sort || 'value';
  const order = req.query.order || 'desc';
  let list = Object.keys(users).map(id => {
    const u = users[id];
    return {
      id, name: u.name || u.username || null,
      value: u.value || 0, goals: u.goals || 0, assists: u.assists || 0,
      balance: u.balance || 0, position: u.position || null, squad: u.squad || null,
      role: u.role || null, skills: u.skills || {},
    };
  });
  if (search) list = list.filter(p => (p.name||'').toLowerCase().includes(search) || p.id.includes(search));
  list.sort((a, b) => {
    const mul = order === 'desc' ? -1 : 1;
    const va = a[sort] || 0, vb = b[sort] || 0;
    if (sort === 'name') return mul * ((a.name||'').localeCompare(b.name||''));
    return mul * (va - vb);
  });
  res.json({ players: list, total: list.length });
});

app.get('/api/admin/matches', requireAuth, (req, res) => {
  const ms = dbGet('matches', []);
  const map = resolveUserMap();
  const list = ms.map(m => ({
    id: m.id, name: m.name, status: m.status || 'devam',
    skor: m.skor || (m.goals?.length + ' - 0'),
    goals: (m.goals||[]).map(g => ({ ...g, userName: userName(g.player, map) || g.player })),
    startTime: m.startTime, endTime: m.endTime,
    channelId: m.channelId,
  }));
  res.json({ matches: list });
});

app.get('/api/admin/vehicles', requireAuth, (req, res) => {
  const vehs = dbGet('vehicles.' + req.query.guildId, []);
  const map = resolveUserMap();
  const list = vehs.map(v => ({ ...v, userName: userName(v.userId, map) || v.userId }));
  res.json({ vehicles: list });
});

app.get('/api/admin/houses', requireAuth, (req, res) => {
  const hous = dbGet('houses.' + req.query.guildId, []);
  const map = resolveUserMap();
  const list = hous.map(h => ({ ...h, userName: userName(h.userId, map) || h.userId }));
  res.json({ houses: list });
});

app.get('/api/admin/tournaments', requireAuth, (req, res) => {
  const ts = dbGet('tournaments', []);
  const list = (Array.isArray(ts) ? ts : Object.values(ts)).map(t => ({
    name: t.name || t.isim || 'İsimsiz',
    aktif: t.aktif || t.active || false,
    teamCount: t.teams?.length || t.takimSayisi || 0,
    fixtureCount: t.fixtures?.length || t.macSayisi || 0,
    playedMatches: t.playedMatches || t.oynananMac || 0,
  }));
  res.json({ tournaments: list });
});

app.get('/api/admin/rpg', requireAuth, (req, res) => {
  const users = getAllUsers();
  const map = resolveUserMap();
  const list = Object.keys(users).map(id => {
    const u = users[id];
    const rpg = u.rpg || u.character || {};
    return {
      userId: id, userName: userName(id, map),
      level: rpg.level || rpg.seviye || 0,
      xp: rpg.xp || 0, hp: rpg.hp || 100, maxHp: rpg.maxHp || 100,
      atk: rpg.atk || rpg.saldiri || 0,
      def: rpg.def || rpg.savunma || 0,
      gold: rpg.gold || rpg.altin || 0,
      potions: rpg.potions || rpg.iksir || 0,
      location: rpg.location || rpg.konum || null,
      weapon: rpg.weapon || rpg.silah || null,
      pet: rpg.pet || null,
      highestFloor: rpg.highestFloor || rpg.enYuksekKat || 0,
    };
  }).filter(c => c.level > 0);
  list.sort((a, b) => b.level - a.level);
  res.json({ characters: list });
});

app.get('/api/admin/training', requireAuth, (req, res) => {
  const users = getAllUsers();
  const map = resolveUserMap();
  const list = Object.keys(users).map(id => {
    const u = users[id];
    return { userId: id, userName: userName(id, map), count: u.training || u.antrenman || 0 };
  }).filter(t => t.count > 0);
  list.sort((a, b) => b.count - a.count);
  res.json({ training: list });
});

app.get('/api/admin/giveaways', requireAuth, (req, res) => {
  const gs = dbGet('cekiliş', {});
  const map = resolveUserMap();
  const list = Object.keys(gs).map(id => {
    const g = gs[id];
    return {
      id, prize: g.prize || g.odul || '?',
      ended: g.ended || false,
      entrantCount: g.entrants?.length || g.katilimciSayisi || 0,
      winnerCount: g.winnerCount || g.kazananSayisi || 1,
      hostName: userName(g.hostId, map) || g.hostId,
      endTime: g.endTime || null,
    };
  });
  res.json({ giveaways: list });
});

app.get('/api/admin/trivia', requireAuth, (req, res) => {
  const ts = dbGet('trivia', []);
  const list = (Array.isArray(ts) ? ts : []).map((t, i) => ({
    idx: i + 1, odul: t.odul || t.prize || 0,
    cevaplandi: t.cevaplandi || t.answered || false,
    dogruCevap: t.dogruCevap || t.correctAnswer || null,
  }));
  res.json({ trivia: list });
});

app.get('/api/admin/snipe', requireAuth, (req, res) => {
  const sn = dbGet('snipe.' + req.query.guildId, []);
  const list = (Array.isArray(sn) ? sn : []).reverse().slice(0, 50).map(s => ({
    channelId: s.channelId || s.kanal || '?',
    author: s.author || s.yazar || 'Bilinmiyor',
    content: s.content || s.icerik || '',
    deletedAt: s.deletedAt || s.silinmeTarihi || null,
  }));
  res.json({ snipe: list });
});

app.get('/api/admin/registration-history', requireAuth, (req, res) => {
  const hist = dbGet('kayitGecmisi.' + req.query.guildId, []);
  const map = resolveUserMap();
  const list = (Array.isArray(hist) ? hist : []).map(h => ({
    userName: userName(h.userId || h.kullanici, map) || h.userId,
    registeredName: h.name || h.isim || null,
    role: h.role || h.rol || null,
    kayitEdenName: userName(h.kayitEden || h.author, map) || h.kayitEden,
    timestamp: h.timestamp || h.tarih || null,
  }));
  res.json({ history: list });
});

app.get('/api/admin/backup', requireAuth, (req, res) => {
  loadDb();
  res.json(db);
});

app.get('/api/admin/top-users', requireAuth, (req, res) => {
  const users = getAllUsers();
  const type = req.query.type || 'balance';
  const limit = parseInt(req.query.limit) || 10;
  const map = resolveUserMap();
  const keys = Object.keys(users);
  keys.sort((a, b) => {
    const va = users[a][type] || 0, vb = users[b][type] || 0;
    return vb - va;
  });
  const list = keys.slice(0, limit).map(id => ({
    id, name: userName(id, map), value: users[id][type] || 0,
    role: users[id].role || null,
  }));
  res.json({ type, users: list });
});

app.post('/api/admin/guild-leave', requireAuth, (req, res) => {
  res.json({ error: 'Bot kapalı, sunucudan çıkılamaz.' });
});

app.post('/api/bot/start', requireAuth, (req, res) => res.json({ error: 'Bot devre dışı.' }));
app.post('/api/bot/stop', requireAuth, (req, res) => res.json({ ok: true }));
app.post('/api/bot/restart', requireAuth, (req, res) => res.json({ error: 'Bot devre dışı.' }));

app.listen(PORT, '0.0.0.0', () => {
  addLog('Panel başlatıldı (bağımsız mod)');
});
