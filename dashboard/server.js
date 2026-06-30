const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
const db = require('../database/db');

const PORT = process.env.DASHBOARD_PORT || 4001;
const BOT_API = process.env.BOT_API || 'http://localhost:3005';
const SESSIONS = new Map();

function json(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise(r => {
    let b = '';
    req.on('data', c => b += c);
    req.on('end', () => { try { r(JSON.parse(b)); } catch { r({}); } });
  });
}

function tokenHash(pw) {
  return crypto.createHash('sha256').update(pw + 'electro_salt_2026').digest('hex');
}

function checkAuth(req) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const session = SESSIONS.get(token);
  if (session && session.expires > Date.now()) return session;
  return null;
}

function requireAuth(req, res) {
  const session = checkAuth(req);
  if (!session) { json(res, 401, { error: 'Unauthorized' }); return null; }
  return session;
}

function botFetch(method, path, body) {
  return new Promise((resolve) => {
    const u = new URL(BOT_API + path);
    const opts = {
      hostname: u.hostname, port: u.port, path: u.pathname + u.search,
      method, timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    };
    const req = http.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function getDefSettings() {
  return {
    kufur: { enabled: false }, link: { enabled: false }, reklam: { enabled: false },
    caps: { enabled: false, minLen: 10, ratio: 0.7 }, flood: { enabled: false, limit: 4, time: 5000 },
    mention: { enabled: false, max: 5 }, resim: { enabled: false },
    antiNuke: { enabled: false, maxAction: 3, timeWindow: 10000 }, antiKanal: { enabled: false },
    antiRol: { enabled: false }, antiBan: { enabled: false }, antiBot: { enabled: false },
    antiWebhook: { enabled: false }, logKanal: null, whitelist: [],
  };
}

function getGuardConfig(guildId) {
  const stored = db.get(`guard.${guildId}`);
  const def = getDefSettings();
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
  if (stored.whitelist) merged.whitelist = stored.whitelist;
  return merged;
}

function extractGuildIds() {
  const ids = new Set();
  const guard = db.get('guard', {});
  Object.keys(guard).forEach(id => ids.add(id));
  ['kayitGecmisi', 'roller', 'davetler', 'hosgeldin', 'kayit'].forEach(k => {
    const o = db.get(k, {});
    Object.keys(o).forEach(id => ids.add(id));
  });
  return [...ids];
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  if (pathname.startsWith('/public/')) {
    const filePath = path.join(__dirname, 'public', pathname.slice(7));
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      const mime = { '.css':'text/css','.js':'application/javascript','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2' }[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      res.end(fs.readFileSync(filePath));
      return;
    }
    return json(res, 404, { error: 'File not found' });
  }

  if (['/', '/panel', '/login'].includes(pathname)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    const htmlPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(htmlPath)) {
      res.end(fs.readFileSync(htmlPath, 'utf8'));
    } else {
      res.end('<h1>Panel not found</h1>');
    }
    return;
  }

  // --- AUTH ---
  if (pathname === '/api/login' && req.method === 'POST') {
    const body = await readBody(req);
    const storedHash = db.get('admin.password', tokenHash('admin'));
    if (tokenHash(body.password || '') !== storedHash)
      return json(res, 401, { error: 'Yanlış şifre' });
    const token = crypto.randomBytes(32).toString('hex');
    SESSIONS.set(token, { user: 'admin', expires: Date.now() + 86400000, role: 'admin' });
    json(res, 200, { token, user: 'admin' });
    return;
  }

  if (pathname === '/api/check-auth' && req.method === 'GET') {
    const session = requireAuth(req, res);
    if (!session) return;
    json(res, 200, { authenticated: true, user: session.user, role: session.role });
    return;
  }

  if (pathname === '/api/logout' && req.method === 'POST') {
    const auth = req.headers['authorization'];
    if (auth && auth.startsWith('Bearer ')) SESSIONS.delete(auth.slice(7));
    json(res, 200, { ok: true });
    return;
  }

  if (pathname === '/api/change-password' && req.method === 'POST') {
    const session = requireAuth(req, res);
    if (!session) return;
    const body = await readBody(req);
    const storedHash = db.get('admin.password', tokenHash('admin'));
    if (tokenHash(body.oldPassword || '') !== storedHash)
      return json(res, 400, { error: 'Eski şifre yanlış' });
    if (!body.newPassword || body.newPassword.length < 4)
      return json(res, 400, { error: 'Yeni şifre en az 4 karakter olmalı' });
    db.set('admin.password', tokenHash(body.newPassword));
    json(res, 200, { ok: true, message: 'Şifre değiştirildi' });
    return;
  }

  // --- STATUS & STATS ---
  if (pathname === '/api/status' && req.method === 'GET') {
    const users = db.getAllUsers();
    json(res, 200, {
      status: 'online', ping: 0,
      guildCount: extractGuildIds().length,
      userCount: Object.keys(users).length,
      registeredCount: Object.keys(db.get('kayitGecmisi.1496832264028553341', {})).length,
      uptime: process.uptime(),
      botPid: process.pid,
    });
    return;
  }

  if (pathname === '/api/users' && req.method === 'GET') {
    const session = requireAuth(req, res);
    if (!session) return;
    const users = db.getAllUsers();
    const antreman = db.get('antreman', {});
    const antremanLimit = db.get('antremanLimit', {});
    const kayitGecmisi = db.get('kayitGecmisi.1496832264028553341', {});
    const list = Object.entries(users).map(([id, u]) => ({
      id, name: u.name || 'İsimsiz',
      value: u.value || 0, goals: u.goals || 0, assists: u.assists || 0,
      balance: (u.balance || 0) + (u.bankBalance || 0),
      trainingCount: antreman[id] || 0,
      trainingLimit: antremanLimit[id] || 10,
      registered: !!kayitGecmisi[id],
      skills: u.skills || {},
      matchStats: u.matchStats || {},
      squad: u.squad || '',
    }));
    json(res, 200, { users: list });
    return;
  }

  if (pathname.startsWith('/api/user/') && req.method === 'GET') {
    const session = requireAuth(req, res);
    if (!session) return;
    const uid = pathname.slice(10);
    const u = db.get(`users.${uid}`);
    if (!u) return json(res, 404, { error: 'User not found' });
    json(res, 200, {
      id: uid, name: u.name || 'İsimsiz',
      value: u.value || 0, goals: u.goals || 0, assists: u.assists || 0,
      balance: (u.balance || 0) + (u.bankBalance || 0),
      trainingCount: db.get(`antreman.${uid}`, 0),
      trainingLimit: db.get(`antremanLimit.${uid}`, 10),
      skills: u.skills || {}, matchStats: u.matchStats || {},
      valueHistory: u.valueHistory || [],
      bankHistory: u.bankHistory || [],
      trainings: u.trainings || [],
      squad: u.squad || '',
      registered: !!db.get(`kayitGecmisi.1496832264028553341.${uid}`),
    });
    return;
  }

  if (pathname === '/api/registrations' && req.method === 'GET') {
    const kg = db.get('kayitGecmisi.1496832264028553341', {});
    const users = db.getAllUsers();
    const list = Object.entries(kg).map(([uid, info]) => ({
      userId: uid, userName: users[uid]?.name || 'İsimsiz',
      role: info.role || 'Bilinmiyor',
      date: info.date || info.timestamp || null,
      registeredBy: info.registeredBy || null,
    })).sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1; if (!b.date) return -1;
      return new Date(b.date) - new Date(a.date);
    });
    json(res, 200, { registrations: list });
    return;
  }

  if (pathname === '/api/training' && req.method === 'GET') {
    const antreman = db.get('antreman', {});
    const antremanLimit = db.get('antremanLimit', {});
    const users = db.getAllUsers();
    const list = Object.entries(antreman).map(([uid, count]) => ({
      userId: uid, userName: users[uid]?.name || 'İsimsiz',
      count, limit: antremanLimit[uid] || 10,
    })).sort((a, b) => (b.count / b.limit) - (a.count / a.limit));
    json(res, 200, { training: list });
    return;
  }

  if (pathname === '/api/guilds' && req.method === 'GET') {
    const guildIds = extractGuildIds();
    const list = guildIds.map(id => ({
      id, name: 'Sunucu #' + id.slice(0, 6),
      memberCount: Object.keys(db.get(`kayitGecmisi.${id}`, {})).length,
    }));
    json(res, 200, { guilds: list });
    return;
  }

  if (pathname === '/api/settings' && req.method === 'GET') {
    const session = requireAuth(req, res);
    if (!session) return;
    const guildId = parsed.query.guildId;
    if (!guildId) return json(res, 400, { error: 'guildId required' });
    json(res, 200, { guildId, settings: getGuardConfig(guildId) });
    return;
  }

  if (pathname === '/api/settings' && req.method === 'POST') {
    const session = requireAuth(req, res);
    if (!session) return;
    const body = await readBody(req);
    const { guildId, key, value } = body;
    if (!guildId || !key) return json(res, 400, { error: 'guildId and key required' });
    let config = db.get(`guard.${guildId}`) || {};
    config[key] = value;
    db.set(`guard.${guildId}`, config);
    json(res, 200, { ok: true });
    return;
  }

  if (pathname === '/api/stats' && req.method === 'GET') {
    const users = db.getAllUsers();
    const vals = Object.values(users);
    json(res, 200, {
      totalUsers: vals.length,
      totalValue: vals.reduce((s, u) => s + (u.value || 0), 0),
      totalGoals: vals.reduce((s, u) => s + (u.goals || 0), 0),
      totalAssists: vals.reduce((s, u) => s + (u.assists || 0), 0),
      totalBalance: vals.reduce((s, u) => s + (u.balance || 0) + (u.bankBalance || 0), 0),
      registeredCount: Object.keys(db.get('kayitGecmisi.1496832264028553341', {})).length,
      trainingUsers: Object.keys(db.get('antreman', {})).length,
    });
    return;
  }

  if (pathname === '/api/guards' && req.method === 'GET') {
    const guard = db.get('guard', {});
    const guildIds = Object.keys(guard);
    const list = guildIds.map(id => ({ id, settings: getGuardConfig(id) }));
    json(res, 200, { guards: list });
    return;
  }

  // --- PROXY TO BOT API ---
  if (pathname === '/api/proxy/send-message' && req.method === 'POST') {
    const session = requireAuth(req, res);
    if (!session) return;
    const body = await readBody(req);
    const r = await botFetch('POST', '/api/send-message', body);
    if (!r) return json(res, 503, { error: 'Bot not running or unreachable', hint: 'Start the bot first' });
    json(res, 200, r);
    return;
  }

  if (pathname === '/api/proxy/send-channel-message' && req.method === 'POST') {
    const session = requireAuth(req, res);
    if (!session) return;
    const body = await readBody(req);
    const r = await botFetch('POST', '/api/send-channel-message', body);
    if (!r) return json(res, 503, { error: 'Bot not running or unreachable', hint: 'Start the bot first' });
    json(res, 200, r);
    return;
  }

  if (pathname === '/api/proxy/guilds' && req.method === 'GET') {
    const r = await botFetch('GET', '/guilds');
    if (!r) return json(res, 503, { error: 'Bot not running', guilds: [] });
    json(res, 200, r);
    return;
  }

  if (pathname === '/api/proxy/guild-members' && req.method === 'GET') {
    const guildId = parsed.query.guildId;
    if (!guildId) return json(res, 400, { error: 'guildId required' });
    const r = await botFetch('GET', `/api/guild-members?guildId=${guildId}`);
    if (!r) return json(res, 503, { error: 'Bot not running' });
    json(res, 200, r);
    return;
  }

  if (pathname === '/api/proxy/guild-channels' && req.method === 'GET') {
    const guildId = parsed.query.guildId;
    if (!guildId) return json(res, 400, { error: 'guildId required' });
    const r = await botFetch('GET', `/api/guild-channels?guildId=${guildId}`);
    if (!r) return json(res, 503, { error: 'Bot not running' });
    json(res, 200, r);
    return;
  }

  json(res, 404, { error: 'Not found' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Electro Panel] http://localhost:${PORT}/panel`);
});
