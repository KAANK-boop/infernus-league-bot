const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { T, Sep, Container, Thumb, Section } = require('../utils/componentsv2');
const db = require('../database/db');
const E = require('../config/emojis');

function w(embed, ...btns) {
  embed.components.push(...btns.flat().map(b => b.toJSON()));
  return [embed];
}

const WEAPONS = [
  { id: 'kılıç_tahta', name: '🗡️ Tahta Kılıç', atkBonus: 3, cost: 50, desc: '+3 Saldırı' },
  { id: 'kılıç_demir', name: '⚔️ Demir Kılıç', atkBonus: 6, cost: 150, desc: '+6 Saldırı' },
  { id: 'kılıç_çelik', name: '⚔️ Çelik Kılıç', atkBonus: 10, cost: 400, desc: '+10 Saldırı' },
  { id: 'yay', name: '🏹 Uzun Yay', atkBonus: 8, cost: 300, desc: '+8 Saldırı' },
  { id: 'asa', name: '🔮 Büyü Asası', atkBonus: 12, cost: 500, desc: '+12 Saldırı' },
  { id: 'kılıç_efsane', name: '⚔️ Efsanevi Kılıç', atkBonus: 20, cost: 2000, desc: '+20 Saldırı (Çok Nadir!)' },
];

const ARMORS = [
  { id: 'zırh_deri', name: '🦺 Deri Zırh', defBonus: 2, cost: 40, desc: '+2 Savunma' },
  { id: 'zırh_zincir', name: '⛓️ Zincir Zırh', defBonus: 5, cost: 120, desc: '+5 Savunma' },
  { id: 'zırh_şövalye', name: '🛡️ Şövalye Zırhı', defBonus: 8, cost: 350, desc: '+8 Savunma' },
  { id: 'zırh_ejderha', name: '🐉 Ejderha Zırhı', defBonus: 15, cost: 1500, desc: '+15 Savunma (Efsanevi!)' },
];

const PETS = [
  { id: 'kedi', name: '😺 Kedi', bonus: 'gold', val: 1.15, desc: '+%15 Altın', cost: 80 },
  { id: 'baykuş', name: '🦉 Baykuş', bonus: 'def', val: 3, desc: '+3 Savunma', cost: 200 },
  { id: 'kurt', name: '🐺 Kurt', bonus: 'atk', val: 4, desc: '+4 Saldırı', cost: 300 },
  { id: 'tavşan', name: '🐇 Tavşan', bonus: 'hp', val: 25, desc: '+25 Maksimum Can', cost: 150 },
  { id: 'ejderha', name: '🐉 Ejderha Yavrusu', bonus: 'all', val: 5, desc: '+5 Tüm Statlar & +%20 XP', cost: 2000 },
];

const POWERS = [
  { id: 'güç', name: '💪 Güç', type: 'passive', floorReq: 5, desc: '+5 Saldırı' },
  { id: 'dayanıklılık', name: '❤️ Dayanıklılık', type: 'passive', floorReq: 15, desc: '+20 Maksimum Can' },
  { id: 'savunma', name: '🧱 Savunma', type: 'passive', floorReq: 30, desc: '+3 Savunma' },
  { id: 'öfke', name: '🔥 Öfke', type: 'active', floorReq: 50, cooldown: 4, desc: '3 saldırı boyunca 2x hasar', atkMult: 2, turns: 3 },
  { id: 'kalkan', name: '🛡️ Kalkan', type: 'active', floorReq: 75, cooldown: 4, desc: '1 saldırıyı blokla', shieldTurns: 1 },
  { id: 'yüksekgüç', name: '⚡ Yüksek Güç', type: 'passive', floorReq: 100, desc: '+10 Saldırı' },
  { id: 'şifa', name: '💚 Şifa', type: 'active', floorReq: 150, cooldown: 5, desc: '%40 can yenile', healPct: 0.4 },
  { id: 'can', name: '💖 Can Havuzu', type: 'passive', floorReq: 200, desc: '+50 Maksimum Can' },
  { id: 'ejderha', name: '🐉 Ejderha Nefesi', type: 'active', floorReq: 300, cooldown: 7, desc: '3x hasar vur', directMult: 3 },
  { id: 'kutsalsavunma', name: '✨ Kutsal Savunma', type: 'passive', floorReq: 500, desc: '+10 Savunma' },
  { id: 'savaşçı', name: '⚔️ Savaş Çığlığı', type: 'active', floorReq: 750, cooldown: 6, desc: '5 saldırı boyunca +%50 hasar', atkMult: 1.5, turns: 5 },
  { id: 'kadim', name: '🌌 Kadim Güç', type: 'passive', floorReq: 999, desc: '+30 Saldırı, +15 Savunma, +100 Can' },
];

const LOCATIONS = {
  koy: { name: '🏘️ Köy', emoji: '🏘️', color: 0x2ECC71 },
  zindan: { name: '🏰 Zindan', emoji: '🏰', color: 0xE74C3C },
};

const FLOOR_MONSTER_NAMES = [
  { min: 1, max: 10, pool: ['👾 Slime', '🐀 Fare', '🦇 Yarasa', '🍄 Mantar', '🕷️ Örümcek'] },
  { min: 11, max: 30, pool: ['🐺 Kurt', '💀 İskelet', '👺 Goblin', '🐗 Domuz', '🧟 Zombi'] },
  { min: 31, max: 50, pool: ['🦴 Dev İskelet', '🪦 Mumya', '👻 Hayalet', '🦅 Griffon', '🧱 Taş Devi'] },
  { min: 51, max: 100, pool: ['👹 Ork', '🐉 Ejderha', '🧙 Kara Büyücü', '🐍 Dev Yılan', '🔥 Ateş Ruhu'] },
  { min: 101, max: 200, pool: ['🔥 Ateş Şeytanı', '❄️ Buz Devi', '⚡ Yıldırım Canavarı', '🌪️ Fırtına', '👑 İblis Askeri'] },
  { min: 201, max: 500, pool: ['👑 İblis Lordu', '🐲 Kral Ejderha', '💀 Ölüm Şövalyesi', '🌑 Karanlık Lord', '☠️ Kıyamet Askeri'] },
  { min: 501, max: 999, pool: ['☠️ Kıyamet Canavarı', '👁️ Kadim Varlık', '🌀 Yok Edici', '⭐ Efsanevi Canavar', '🌌 Kaos Tanrısı'] },
];

const ACHIEVEMENTS = [
  { id: 'floor_10', name: '🥉 Zindan Çaylağı', desc: '10. kata ulaş' },
  { id: 'floor_50', name: '🥈 Zindan Savaşçısı', desc: '50. kata ulaş' },
  { id: 'floor_100', name: '🥇 Zindan Fatihi', desc: '100. kata ulaş' },
  { id: 'floor_500', name: '💎 Zindan Efsanesi', desc: '500. kata ulaş' },
  { id: 'floor_999', name: '👑 Zindan Tanrısı', desc: '999. kata ulaş' },
  { id: 'level_5', name: '🥉 Çaylak', desc: 'Seviye 5 ol' },
  { id: 'level_10', name: '🥈 Savaşçı', desc: 'Seviye 10 ol' },
  { id: 'level_20', name: '🥇 Şampiyon', desc: 'Seviye 20 ol' },
  { id: 'win_10', name: '🏅 Galip', desc: '10 savaş kazan' },
  { id: 'win_50', name: '🏅 Fatih', desc: '50 savaş kazan' },
  { id: 'win_200', name: '🏅 Efsane', desc: '200 savaş kazan' },
  { id: 'gold_1000', name: '💎 Zengin', desc: '1000 altın biriktir' },
  { id: 'gold_5000', name: '💎 Milyoner', desc: '5000 altın biriktir' },
  { id: 'gold_10000', name: '💎 Kral', desc: '10000 altın biriktir' },
];

const BATTLES = new Map();
const BATTLE_TIMEOUT = 5 * 60 * 1000;

function getChar(userId) {
  let char = db.get(`rpg.${userId}`, null);
  if (!char) return null;
  if (!char.location) char.location = 'koy';
  if (!char.weapon) char.weapon = null;
  if (!char.armor) char.armor = null;
  if (!char.pet) char.pet = null;
  if (char.floor === undefined || char.floor === null) char.floor = 0;
  if (char.highestFloor === undefined || char.highestFloor === null) char.highestFloor = 0;
  if (!char.stats) char.stats = { won: 0, lost: 0, goldEarned: 0, goldSpent: 0, monstersKilled: 0, floorsCleared: 0 };
  if (!char.achievements) char.achievements = [];
  if (!char.powers) char.powers = [];
  checkPowers(char);
  return char;
}

function getAtk(char) {
  let base = char.atk;
  if (char.weapon) { const w = WEAPONS.find(x => x.id === char.weapon); if (w) base += w.atkBonus; }
  if (char.pet) { const p = PETS.find(x => x.id === char.pet); if (p && (p.bonus === 'atk' || p.bonus === 'all')) base += p.val; }
  base += getPowerAtkBonus(char);
  return base;
}

function getDef(char) {
  let base = char.def;
  if (char.armor) { const a = ARMORS.find(x => x.id === char.armor); if (a) base += a.defBonus; }
  if (char.pet) { const p = PETS.find(x => x.id === char.pet); if (p && (p.bonus === 'def' || p.bonus === 'all')) base += p.val; }
  base += getPowerDefBonus(char);
  return base;
}

function getMaxHp(char) {
  let base = char.maxHp;
  if (char.pet) { const p = PETS.find(x => x.id === char.pet); if (p && p.bonus === 'hp') base += p.val; }
  base += getPowerHpBonus(char);
  return base;
}

function getGoldBonus(char) {
  if (char.pet) { const p = PETS.find(x => x.id === char.pet); if (p && p.bonus === 'gold') return p.val; }
  return 1;
}

function getXpBonus(char) {
  if (char.pet) { const p = PETS.find(x => x.id === char.pet); if (p && p.bonus === 'all') return 1.2; }
  return 1;
}

function saveChar(userId, char) {
  db.set(`rpg.${userId}`, char);
}

function xpForLevel(level) { return level * 80; }

function bar(cur, max, size = 10) {
  const f = Math.round((cur / max) * size);
  return '🟩'.repeat(Math.min(f, size)) + '⬜'.repeat(Math.max(0, size - Math.min(f, size)));
}

function div(t) {
  const L = '━'.repeat(28);
  if (!t) return L;
  const s = ` ${t} `;
  const l = Math.max(0, Math.floor((28 - s.length) / 2));
  const r = Math.max(0, 28 - l - s.length);
  return '━'.repeat(l) + s + '━'.repeat(r);
}

function createChar(userId) {
  const char = {
    level: 1, xp: 0, maxHp: 100, hp: 100, atk: 10, def: 5,
    gold: 50, potions: 3, location: 'koy',
    weapon: null, armor: null, pet: null,
    floor: 0, highestFloor: 0,
    stats: { won: 0, lost: 0, goldEarned: 0, goldSpent: 0, monstersKilled: 0, floorsCleared: 0 },
    achievements: [],
    powers: [],
  };
  saveChar(userId, char);
  return char;
}

function getFloorMonster(floor) {
  const hp = 25 + Math.floor(floor * 8) + Math.floor(floor * floor * 0.005);
  const atk = 5 + Math.floor(floor * 1.5) + Math.floor(floor * 0.3);
  const def = 2 + Math.floor(floor * 1.2);
  const xp = 10 + Math.floor(floor * 5);
  const gold = 5 + Math.floor(floor * 3);
  const group = FLOOR_MONSTER_NAMES.find(g => floor >= g.min && floor <= g.max) || FLOOR_MONSTER_NAMES[FLOOR_MONSTER_NAMES.length - 1];
  const name = group.pool[Math.floor(Math.random() * group.pool.length)];
  return { name, hp, atk, def, xp, gold, floor };
}

function checkAchs(char) {
  const checks = {
    floor_10: c => c.highestFloor >= 10,
    floor_50: c => c.highestFloor >= 50,
    floor_100: c => c.highestFloor >= 100,
    floor_500: c => c.highestFloor >= 500,
    floor_999: c => c.highestFloor >= 999,
    level_5: c => c.level >= 5,
    level_10: c => c.level >= 10,
    level_20: c => c.level >= 20,
    win_10: c => (c.stats?.won || 0) >= 10,
    win_50: c => (c.stats?.won || 0) >= 50,
    win_200: c => (c.stats?.won || 0) >= 200,
    gold_1000: c => c.gold >= 1000,
    gold_5000: c => c.gold >= 5000,
    gold_10000: c => c.gold >= 10000,
  };
  const earned = char.achievements || [];
  for (const [id, check] of Object.entries(checks)) {
    if (!earned.includes(id) && check(char)) earned.push(id);
  }
  char.achievements = earned;
}

function checkPowers(char) {
  const floor = char.highestFloor || 0;
  for (const p of POWERS) {
    if (p.floorReq <= floor && !char.powers.includes(p.id)) {
      char.powers.push(p.id);
    }
  }
}

function getPowerAtkBonus(char) {
  let bonus = 0;
  if (char.powers?.includes('güç')) bonus += 5;
  if (char.powers?.includes('yüksekgüç')) bonus += 10;
  if (char.powers?.includes('kadim')) bonus += 30;
  return bonus;
}

function getPowerDefBonus(char) {
  let bonus = 0;
  if (char.powers?.includes('savunma')) bonus += 3;
  if (char.powers?.includes('kutsalsavunma')) bonus += 10;
  if (char.powers?.includes('kadim')) bonus += 15;
  return bonus;
}

function getPowerHpBonus(char) {
  let bonus = 0;
  if (char.powers?.includes('dayanıklılık')) bonus += 20;
  if (char.powers?.includes('can')) bonus += 50;
  if (char.powers?.includes('kadim')) bonus += 100;
  return bonus;
}

function initBattle(char, userId, monster) {
  if (!char || char.hp <= 0) return null;
  const powers = char.powers || [];
  const activePowers = POWERS.filter(p => powers.includes(p.id) && p.type === 'active');
  const cooldowns = {};
  for (const p of activePowers) cooldowns[p.id] = 0;
  const battle = {
    monster: { ...monster },
    mHp: monster.hp,
    pHp: char.hp,
    pMaxHp: getMaxHp(char),
    pAtk: getAtk(char),
    pDef: getDef(char),
    pPotions: char.potions,
    turnLog: [],
    lastAction: Date.now(),
    potionsUsed: 0,
    powers,
    activePowers,
    cooldowns,
    activeEffects: [],
    shieldTurns: 0,
  };
  BATTLES.set(userId, battle);
  return battle;
}

function processPower(userId, powerId) {
  const battle = BATTLES.get(userId);
  if (!battle) return { error: 'Savaş bulunamadı.' };
  if (Date.now() - battle.lastAction > BATTLE_TIMEOUT) { BATTLES.delete(userId); return { error: 'Savaş zaman aşımına uğradı.' }; }
  const power = POWERS.find(p => p.id === powerId);
  if (!power) return { error: 'Güç bulunamadı!' };
  if ((battle.cooldowns[powerId] || 0) > 0) return { error: `Güç beklemede! (${battle.cooldowns[powerId]} tur)` };
  const logs = [];
  if (power.atkMult) {
    battle.activeEffects.push({ type: 'atkMult', val: power.atkMult, turnsLeft: power.turns });
    logs.push(`🔥 **${power.name}** — Hasar çarpanın **${power.atkMult}x**! (${power.turns} saldırı)`);
  }
  if (power.shieldTurns) {
    battle.shieldTurns += power.shieldTurns;
    logs.push(`🛡️ **${power.name}** — ${power.shieldTurns} saldırı bloklanacak!`);
  }
  if (power.healPct) {
    const heal = Math.floor(battle.pMaxHp * power.healPct);
    battle.pHp = Math.min(battle.pMaxHp, battle.pHp + heal);
    logs.push(`💚 **${power.name}** — **+${heal}** can yeniledin!`);
  }
  if (power.directMult) {
    const dmg = Math.max(1, Math.floor(battle.pAtk * power.directMult) - battle.monster.def + Math.floor(Math.random() * 10));
    battle.mHp -= dmg;
    if (battle.mHp <= 0) {
      battle.mHp = 0;
      logs.push(`🐉 **${power.name}** — **${dmg}** hasar → **YENİLDİ!** 🎁`);
      battle.turnLog.push(...logs);
      return { won: true, battle };
    }
    logs.push(`🐉 **${power.name}** — **${dmg}** hasar! Canavar ❤️${battle.mHp}`);
  }
  battle.cooldowns[powerId] = (power.cooldown || 0);
  if (!power.directMult) {
    const mDmg = Math.max(1, battle.monster.atk + Math.floor(Math.random() * 8) - battle.pDef);
    if (battle.shieldTurns > 0) {
      logs.push(`🛡️ Kalkan saldırıyı blokladı!`);
      battle.shieldTurns--;
    } else {
      battle.pHp -= mDmg;
      if (battle.pHp <= 0) {
        battle.pHp = 0;
        logs.push(`${battle.monster.name} **${mDmg}** → **ÖLDÜN!** 💀`);
        battle.turnLog.push(...logs);
        return { lost: true, battle };
      }
      logs.push(`${battle.monster.name} **${mDmg}** hasar → ❤️${battle.pHp}`);
    }
  }
  battle.turnLog.push(...logs);
  if (battle.turnLog.length > 10) battle.turnLog = battle.turnLog.slice(-10);
  battle.lastAction = Date.now();
  return { ongoing: true, battle };
}

function processAttack(userId) {
  const battle = BATTLES.get(userId);
  if (!battle) return { error: 'Savaş bulunamadı.' };
  if (Date.now() - battle.lastAction > BATTLE_TIMEOUT) { BATTLES.delete(userId); return { error: 'Savaş zaman aşımına uğradı.' }; }
  const logs = [];
  let pDmg = Math.max(1, battle.pAtk + Math.floor(Math.random() * 10) - battle.monster.def);
  const atkMultEffect = battle.activeEffects.find(e => e.type === 'atkMult');
  if (atkMultEffect) {
    pDmg = Math.floor(pDmg * atkMultEffect.val);
  }
  battle.mHp -= pDmg;
  if (battle.mHp <= 0) {
    battle.mHp = 0;
    logs.push(`⚔️ **${pDmg}** hasar → **YENİLDİ!** 🎁`);
    battle.turnLog.push(...logs);
    return { won: true, battle };
  }
  logs.push(`⚔️ **${pDmg}** hasar → ❤️${battle.mHp}`);
  const mDmg = Math.max(1, battle.monster.atk + Math.floor(Math.random() * 8) - battle.pDef);
  if (battle.shieldTurns > 0) {
    logs.push(`🛡️ Kalkan saldırıyı blokladı!`);
    battle.shieldTurns--;
  } else {
    battle.pHp -= mDmg;
    if (battle.pHp <= 0) {
      battle.pHp = 0;
      logs.push(`${battle.monster.name} **${mDmg}** → **ÖLDÜN!** 💀`);
      battle.turnLog.push(...logs);
      return { lost: true, battle };
    }
    logs.push(`${battle.monster.name} **${mDmg}** hasar → ❤️${battle.pHp}`);
  }
  for (const id in battle.cooldowns) {
    if (battle.cooldowns[id] > 0) battle.cooldowns[id]--;
  }
  for (let i = battle.activeEffects.length - 1; i >= 0; i--) {
    battle.activeEffects[i].turnsLeft--;
    if (battle.activeEffects[i].turnsLeft <= 0) {
      logs.push(`${battle.activeEffects[i].type === 'atkMult' ? '🔥 Güç etkisi sona erdi!' : ''}`);
      battle.activeEffects.splice(i, 1);
    }
  }
  battle.turnLog.push(...logs);
  if (battle.turnLog.length > 10) battle.turnLog = battle.turnLog.slice(-10);
  battle.lastAction = Date.now();
  return { ongoing: true, battle };
}

function processPotion(userId) {
  const battle = BATTLES.get(userId);
  if (!battle) return { error: 'Savaş bulunamadı.' };
  if (Date.now() - battle.lastAction > BATTLE_TIMEOUT) { BATTLES.delete(userId); return { error: 'Savaş zaman aşımına uğradı.' }; }
  if (battle.pPotions <= 0) return { error: 'İksirin yok!' };
  const logs = [];
  const heal = Math.floor(battle.pMaxHp * 0.4);
  battle.pHp = Math.min(battle.pMaxHp, battle.pHp + heal);
  battle.pPotions--;
  battle.potionsUsed++;
  logs.push(`🧪 **+${heal}** can → ❤️${battle.pHp}`);
  const mDmg = Math.max(1, battle.monster.atk + Math.floor(Math.random() * 8) - battle.pDef);
  if (battle.shieldTurns > 0) {
    logs.push(`🛡️ Kalkan saldırıyı blokladı!`);
    battle.shieldTurns--;
  } else {
    battle.pHp -= mDmg;
    if (battle.pHp <= 0) {
      battle.pHp = 0;
      logs.push(`${battle.monster.name} **${mDmg}** → **ÖLDÜN!** 💀`);
      battle.turnLog.push(...logs);
      return { lost: true, battle };
    }
    logs.push(`${battle.monster.name} **${mDmg}** hasar → ❤️${battle.pHp}`);
  }
  for (const id in battle.cooldowns) { if (battle.cooldowns[id] > 0) battle.cooldowns[id]--; }
  for (let i = battle.activeEffects.length - 1; i >= 0; i--) {
    battle.activeEffects[i].turnsLeft--;
    if (battle.activeEffects[i].turnsLeft <= 0) battle.activeEffects.splice(i, 1);
  }
  battle.turnLog.push(...logs);
  if (battle.turnLog.length > 10) battle.turnLog = battle.turnLog.slice(-10);
  battle.lastAction = Date.now();
  return { ongoing: true, battle };
}

function processEscape(userId) {
  const battle = BATTLES.get(userId);
  if (!battle) return { error: 'Savaş bulunamadı.' };
  battle.turnLog.push('💨 Kaçtın!');
  return { escaped: true, battle };
}

function processAuto(userId) {
  const battle = BATTLES.get(userId);
  if (!battle) return { error: 'Savaş bulunamadı.' };
  if (Date.now() - battle.lastAction > BATTLE_TIMEOUT) { BATTLES.delete(userId); return { error: 'Savaş zaman aşımına uğradı.' }; }
  battle.turnLog = [];
  const logs = [];
  let result = null;
  let turnCount = 0;
  while (!result && turnCount < 200) {
    turnCount++;
    const pDmg = Math.max(1, battle.pAtk + Math.floor(Math.random() * 10) - battle.monster.def);
    battle.mHp -= pDmg;
    if (battle.mHp <= 0) { battle.mHp = 0; logs.push(`⚔️ **${pDmg}** → **YENİLDİ!** 🎁`); result = { won: true }; break; }
    if (logs.length < 8 || turnCount % 5 === 0) logs.push(`⚔️ **${pDmg}** → ❤️${battle.mHp}`);
    const mDmg = Math.max(1, battle.monster.atk + Math.floor(Math.random() * 8) - battle.pDef);
    battle.pHp -= mDmg;
    if (battle.pHp <= 0) {
      battle.pHp = 0;
      if (logs.length >= 8) logs.splice(6, logs.length - 6, `... ${turnCount - 6} tur ...`);
      logs.push(`${battle.monster.name} **${mDmg}** → **ÖLDÜN!** 💀`);
      result = { lost: true }; break;
    }
    if (logs.length < 8 || turnCount % 5 === 0) logs.push(`↩️ **${mDmg}** → ❤️${battle.pHp}`);
  }
  if (logs.length > 12) logs.splice(8, logs.length - 10, `... ${turnCount - 10} tur ...`);
  battle.turnLog = logs;
  return result;
}

function finishBattle(userId, result) {
  const battle = BATTLES.get(userId);
  if (!battle) return null;
  const char = getChar(userId);
  if (!char) return null;

  if (result.won) {
    const xpBonus = getXpBonus(char);
    const goldBonus = getGoldBonus(char);
    const xpGain = Math.floor((battle.monster.xp + Math.floor(Math.random() * 10)) * xpBonus);
    const goldGain = Math.floor((battle.monster.gold + Math.floor(Math.random() * 10)) * goldBonus);
    char.xp += xpGain;
    char.gold += goldGain;
    char.hp = battle.pHp;
    char.potions -= battle.potionsUsed;
    if (char.potions < 0) char.potions = 0;
    char.stats.won = (char.stats.won || 0) + 1;
    char.stats.monstersKilled = (char.stats.monstersKilled || 0) + 1;
    char.stats.goldEarned = (char.stats.goldEarned || 0) + goldGain;
    char.stats.floorsCleared = (char.stats.floorsCleared || 0) + 1;
    char.floor = (char.floor || 0) + 1;
    if (char.floor > char.highestFloor) char.highestFloor = char.floor;
    let leveledUp = false;
    while (char.xp >= xpForLevel(char.level)) {
      char.xp -= xpForLevel(char.level);
      char.level++;
      char.maxHp += 15;
      char.hp += 15;
      char.atk += 2;
      char.def += 1;
      leveledUp = true;
    }
    if (char.hp > getMaxHp(char)) char.hp = getMaxHp(char);
    checkAchs(char);
    checkPowers(char);
    saveChar(userId, char);
    BATTLES.delete(userId);
    return { type: 'win', xpGain, goldGain, leveledUp, char, battle };
  }

  if (result.lost) {
    char.hp = 0;
    char.potions -= battle.potionsUsed;
    if (char.potions < 0) char.potions = 0;
    char.stats.lost = (char.stats.lost || 0) + 1;
    const lostGold = Math.floor(char.gold * 0.15);
    char.gold = Math.max(0, char.gold - lostGold);
    char.location = 'koy';
    char.floor = 0;
    saveChar(userId, char);
    BATTLES.delete(userId);
    return { type: 'lose', char, battle, lostGold };
  }

  if (result.escaped) {
    char.potions -= battle.potionsUsed;
    if (char.potions < 0) char.potions = 0;
    char.hp = battle.pHp;
    char.location = 'koy';
    char.floor = 0;
    saveChar(userId, char);
    BATTLES.delete(userId);
    return { type: 'escape', char, battle };
  }

  return null;
}

function createKoyEmbed(char, user, client) {
  const effMaxHp = getMaxHp(char);
  const atk = getAtk(char);
  const def = getDef(char);
  const petName = char.pet ? PETS.find(p => p.id === char.pet)?.name || '' : '';
  const wName = char.weapon ? WEAPONS.find(w => w.id === char.weapon)?.name || '' : '';
  const aName = char.armor ? ARMORS.find(a => a.id === char.armor)?.name || '' : '';
  const ach = char.achievements?.length || 0;
  const text = [
    `　Macera sonrası dinlenme ve alışveriş yeri.`,
    '',
    `　❤️ ${bar(char.hp, effMaxHp)}　\`${char.hp}/${effMaxHp}\``,
    `　✨ ${bar(char.xp, xpForLevel(char.level))}　\`${char.xp}/${xpForLevel(char.level)}\``,
    `　⚔️ \`${atk}\`　🛡️ \`${def}\`　💰 \`${char.gold}\`　🧪 \`${char.potions}\``,
    ...(wName ? [`　🗡️ \`${wName}\``] : []),
    ...(aName ? [`　🛡️ \`${aName}\``] : []),
    ...(petName ? [`　🐾 \`${petName}\``] : []),
    ...(char.highestFloor > 0 ? [`　🏰 \`En yüksek kat: ${char.highestFloor}\``] : []),
    ...((char.powers?.length || 0) > 0 ? [`　🔮 \`${char.powers.length} Güç\``] : []),
    '',
    `**${div('🎯 AKTİVİTELER')}**`,
    '',
    '　`🏠 Dinlen(30💰)`　`🏥 Şifahane(ücretsiz)`',
    '　`🧪 İksir Al(20💰)`　`🏰 Zindana Gir`',
    '　`⚔️ Silah`　`🛡️ Zırh`　`🐾 Evcil`',
    '',
    `**${div()}**`,
    '`📊 Profil`　`🏆 Başarımlar`　`❌ Kapat`',
    '',
    '-# Infermus League',
  ].join('\n');
  return Container([T(text)]);
}

function createDungeonEmbed(char, user, monster, client) {
  const effMaxHp = getMaxHp(char);
  const atk = getAtk(char);
  const def = getDef(char);
  const text = [
    `　Zindanın **${char.floor}. katında** bir canavar görüyorsun!`,
    '',
    `**${div('👹 CANAVAR')}**`,
    `　${monster.name}`,
    `　❤️ \`${monster.hp}\`　⚔️ \`${monster.atk}\`　🛡️ \`${monster.def}\``,
    `　💰 \`+${monster.gold}~ Altın\`　✨ \`+${monster.xp}~ XP\``,
    '',
    `**${div('📊 KARAKTERİN')}**`,
    `　❤️ ${bar(char.hp, effMaxHp)}　\`${char.hp}/${effMaxHp}\``,
    `　⚔️ \`${atk}\`　🛡️ \`${def}\`　🧪 \`${char.potions}\``,
    '',
    `**${div()}**`,
    '`⚔️ Savaş`　`🏘️ Köye Dön`',
    '',
    '-# Infermus League',
  ].join('\n');
  return Container([T(text)]);
}

function createProfileEmbed(char, user, client) {
  const effMaxHp = getMaxHp(char);
  const atk = getAtk(char);
  const def = getDef(char);
  const wName = char.weapon ? WEAPONS.find(w => w.id === char.weapon)?.name || '' : '';
  const aName = char.armor ? ARMORS.find(a => a.id === char.armor)?.name || '' : '';
  const pet = char.pet ? PETS.find(x => x.id === char.pet) : null;
  const s = char.stats || {};
  const achCount = char.achievements?.length || 0;
  const totalAch = ACHIEVEMENTS.length;
  const text = [
    `**${div('👤 MACERACI  Lv.' + char.level)}**`,
    '',
    `　❤️ ${bar(char.hp, effMaxHp)}　\`${char.hp}/${effMaxHp}\``,
    `　✨ ${bar(char.xp, xpForLevel(char.level))}　\`${char.xp}/${xpForLevel(char.level)}\``,
    '',
    `　⚔️ \`${atk}\`　🛡️ \`${def}\`　💰 \`${char.gold}\`　🧪 \`${char.potions}\``,
    ...(wName ? [`　🗡️ \`${wName}\``] : []),
    ...(aName ? [`　🛡️ \`${aName}\``] : []),
    ...(pet ? [`　🐾 \`${pet.name} — ${pet.desc}\``] : []),
    '',
    `**${div('🏆 BAŞARIMLAR')}**`,
    `　\`${achCount}/${totalAch} başarım kazanıldı\``,
    ...ACHIEVEMENTS.filter(a => char.achievements?.includes(a.id)).slice(0, 5).map(a => `　✅ \`${a.name}\``),
    ...(achCount > 5 ? [`　... ve ${achCount - 5} daha`] : []),
    '',
    `**${div('📊 İSTATİSTİKLER')}**`,
    `　⚔️ \`${s.won || 0} Galibiyet / ${s.lost || 0} Mağlubiyet\``,
    `　💀 \`${s.monstersKilled || 0} Canavar\`　🏰 \`${s.floorsCleared || 0} Kat\``,
    `　💰 \`+${s.goldEarned || 0} Kazanıldı / -${s.goldSpent || 0} Harcandı\``,
    ...((char.powers?.length || 0) > 0 ? [`   🔮 \`${char.powers.length} Güç\``] : []),
    '',
    `**${div()}**`,
    '`🗺️ Köy`　`🔮 Güçler`　`🏆 Başarımlar`　`❌ Kapat`',
    '',
    '-# Infermus League',
  ].join('\n');
  return Container([Section([T(text)], Thumb(user.displayAvatarURL()))]);
}

function createAchievementsEmbed(char, user, client) {
  const achCount = char.achievements?.length || 0;
  const totalAch = ACHIEVEMENTS.length;
  const text = ACHIEVEMENTS.map(a => {
    const done = char.achievements?.includes(a.id);
    return `${done ? E.CL_yesiltik : E.CL_carpi} \`${a.name}\` — ${a.desc}`;
  }).join('\n') + '\n\n-# Infermus League';
  return Container([T(text)]);
}

function createPowersEmbed(char, user, client) {
  const powers = char.powers || [];
  const passives = POWERS.filter(p => p.type === 'passive');
  const actives = POWERS.filter(p => p.type === 'active');
  const owned = id => powers.includes(id) ? E.CL_yesiltik : E.CL_kilit;
  const pass = passives.map(p => `${owned(p.id)} \`${p.name}\` — ${p.desc} (Kat ${p.floorReq})`).join('\n');
  const act = actives.map(p => `${owned(p.id)} \`${p.name}\` — ${p.desc} (Kat ${p.floorReq})`).join('\n');
  const nextPower = POWERS.filter(p => !powers.includes(p.id)).sort((a, b) => a.floorReq - b.floorReq)[0];
  const text = [
    `**${div('💪 PASİF GÜÇLER')}**`,
    '',
    pass || '　Henüz pasif gücün yok.',
    '',
    `**${div('🔥 AKTİF GÜÇLER')}**`,
    '',
    act || '　Henüz aktif gücün yok.',
    ...(nextPower ? ['', `🔜 Sıradaki güç: **${nextPower.name}** (Kat ${nextPower.floorReq})`] : ['', '🌟 **Tüm güçleri topladın!**']),
    '',
    `**${div()}**`,
    '`🗺️ Köy`　`📊 Profil`',
    '',
    '-# Infermus League',
  ].join('\n');
  return Container([T(text)]);
}

function createShopEmbed(char, category, client) {
  const colorMap = { weapons: 0xE74C3C, armors: 0x3498DB, pets: 0x2ECC71 };
  const titleMap = { weapons: '⚔️ SİLAH DÜKKANI', armors: '🛡️ ZIRH DÜKKANI', pets: '🐾 EVCİL HAYVAN DÜKKANI' };
  let items, desc;
  if (category === 'weapons') {
    items = WEAPONS;
    desc = items.map(w => {
      const owned = char.weapon === w.id;
      return `${owned ? E.CL_yesiltik : '　'} \`${w.name.split(' ').slice(1).join(' ')}\`　\`${w.desc}\`　💰\`${w.cost}\``;
    }).join('\n');
  } else if (category === 'armors') {
    items = ARMORS;
    desc = items.map(a => {
      const owned = char.armor === a.id;
      return `${owned ? E.CL_yesiltik : '　'} \`${a.name.split(' ').slice(1).join(' ')}\`　\`${a.desc}\`　💰\`${a.cost}\``;
    }).join('\n');
  } else {
    items = PETS;
    desc = items.map(p => {
      const owned = char.pet === p.id;
      return `${owned ? E.CL_yesiltik : '　'} \`${p.name}\`　\`${p.desc}\`　💰\`${p.cost}\``;
    }).join('\n');
  }
  const text = [
    `　💰 \`Bakiyen: ${char.gold} Altın\``,
    '',
    desc,
    '',
    `**${div('📂 KATEGORİLER')}**`,
    '`⚔️ Silahlar`　`🛡️ Zırhlar`　`🐾 Evciller`',
    '',
    `**${div()}**`,
    '`🗺️ Köy`',
    '',
    '-# Infermus League',
  ].join('\n');
  return Container([T(text)]);
}

function createBattleEmbed(battle, client) {
  const logs = battle.turnLog.slice(-5);
  const effLines = [];
  if (battle.activeEffects?.length > 0) {
    for (const e of battle.activeEffects) {
      if (e.type === 'atkMult') effLines.push(`🔥 \`${e.val}x Hasar (${e.turnsLeft} saldırı)\``);
    }
  }
  if (battle.shieldTurns > 0) effLines.push(`🛡️ \`Kalkan (${battle.shieldTurns} saldırı)\``);
  const activeRow = battle.activePowers?.filter(p => (battle.cooldowns[p.id] || 0) > 0).length > 0
    ? `\n**${div('🔮 GÜÇLER')}**\n` + battle.activePowers.filter(p => (battle.cooldowns[p.id] || 0) > 0).map(p => `　⏳ \`${p.name} (${battle.cooldowns[p.id]} tur)\``).join('\n')
    : '';
  const text = [
    `　❤️ ${bar(battle.mHp, battle.monster.hp)}　\`${battle.mHp}/${battle.monster.hp}\``,
    '',
    `　${'═'.repeat(20)} **VS** ${'═'.repeat(20)}`,
    '',
    `　**Maceraçı**`,
    `　❤️ ${bar(battle.pHp, battle.pMaxHp)}　\`${battle.pHp}/${battle.pMaxHp}\``,
    ...(effLines.length ? ['', ...effLines] : []),
    '',
    ...(logs.length ? [`**${div('📜 GÜNLÜK')}**`, '', ...logs.map(l => `　• \`${l}\``), ''] : ['']),
    ...(activeRow ? [activeRow, ''] : ['']),
    `**${div('⚔️ HAMLE')}**`,
    '`⚔️ Saldır`　`🧪 İksir`　`💨 Kaç`　`⏭️ Auto`',
    '',
    '-# Infermus League',
  ].join('\n');
  return Container([T(text)]);
}

function createWinEmbed(battle, char, xpGain, goldGain, leveledUp, floor, client) {
  const text = [
    `　${battle.monster.name}`,
    `　❤️ \`0/${battle.monster.hp}\``,
    '',
    `　${'═'.repeat(20)} **VS** ${'═'.repeat(20)}`,
    '',
    `　**Maceraçı**`,
    `　❤️ ${bar(battle.pHp, battle.pMaxHp)}　\`${battle.pHp}/${battle.pMaxHp}\``,
    '',
    `**${div('📜 GÜNLÜK')}**`,
    ...battle.turnLog.slice(-5).map(l => `　• \`${l}\``),
    '',
    `**${div('🎁 ÖDÜL')}**`,
    `　✨ \`+${xpGain} XP\`　💰 \`+${goldGain} Altın\``,
    ...(leveledUp ? [``, `　⬆️ **Seviye ATLADIN!** \`Lv.${char.level}\``] : []),
    '',
    `**${div()}**`,
    '`⏭️ Sonraki Kat`　`🏘️ Köye Dön`',
    '',
    '-# Infermus League',
  ].join('\n');
  return Container([T(text)]);
}

function createLoseEmbed(battle, char, lostGold, client) {
  const text = [
    `　${battle.monster.name}`,
    `　❤️ ${bar(battle.mHp, battle.monster.hp)}　\`${battle.mHp}/${battle.monster.hp}\``,
    '',
    `　${'═'.repeat(20)} **VS** ${'═'.repeat(20)}`,
    '',
    `　**Maceraçı**`,
    `　❤️ \`0/${battle.pMaxHp}\``,
    '',
    `**${div('📜 GÜNLÜK')}**`,
    ...battle.turnLog.slice(-5).map(l => `　• \`${l}\``),
    '',
    `**${div()}**`,
    `　💀 Canavar tarafından yenildin!`,
    ...(lostGold > 0 ? [`　💰 **${lostGold}** altın kaybettin.`] : []),
    '',
    '`🏥 Köye Dön`',
    '',
    '-# Infermus League',
  ].join('\n');
  return Container([T(text)]);
}

function createResultEmbed(char, user, title, desc, color, client) {
  const text = `**${title}**\n\n${desc}\n\n**${div()}**\n\`🗺️ Köy\`　\`📊 Profil\`　\`❌ Kapat\`\n\n-# Infermus League`;
  return Container([Section([T(text)], Thumb(user.displayAvatarURL()))]);
}

function getKoyButtons() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('rpg_dinlen').setLabel('🏠 Dinlen (30💰)').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('rpg_sifahane').setLabel('🏥 Şifahane').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('rpg_iksir_al').setLabel('🧪 İksir Al (20💰)').setStyle(ButtonStyle.Primary),
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('rpg_shop_weapons').setLabel('⚔️ Silah').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('rpg_shop_armors').setLabel('🛡️ Zırh').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('rpg_shop_pets').setLabel('🐾 Evcil').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('rpg_zindana_gir').setLabel('🏰 Zindana Gir').setStyle(ButtonStyle.Danger),
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('rpg_profil').setLabel('📊 Profil').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('rpg_powers').setLabel('🔮 Güçler').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('rpg_achievements').setLabel('🏆 Başarımlar').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('rpg_kapat').setLabel('❌ Kapat').setStyle(ButtonStyle.Danger),
    ),
  ];
}

function getDungeonButtons() {
  return [new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('rpg_zindan_savas').setLabel('⚔️ Savaş').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('rpg_koye_don').setLabel('🏘️ Köye Dön').setStyle(ButtonStyle.Secondary),
  )];
}

function getPostBattleButtons() {
  return [new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('rpg_sonraki_kat').setLabel('⏭️ Sonraki Kat').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('rpg_koye_don').setLabel('🏘️ Köye Dön').setStyle(ButtonStyle.Success),
  )];
}

function getShopButtons(category) {
  let items, buyPrefix;
  if (category === 'weapons') { items = WEAPONS; buyPrefix = 'buy_w_'; }
  else if (category === 'armors') { items = ARMORS; buyPrefix = 'buy_a_'; }
  else { items = PETS; buyPrefix = 'buy_p_'; }
  const rows = [];
  const btns = items.map(item =>
    new ButtonBuilder()
      .setCustomId(`rpg_${buyPrefix}${item.id}`)
      .setLabel(`${item.name.split(' ').slice(1).join(' ')} (${item.cost}💰)`)
      .setStyle(ButtonStyle.Success)
  );
  for (let i = 0; i < btns.length; i += 2) {
    rows.push(new ActionRowBuilder().addComponents(...btns.slice(i, i + 2)));
  }
  rows.push(new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('rpg_shop_weapons').setLabel('⚔️ Silahlar').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('rpg_shop_armors').setLabel('🛡️ Zırhlar').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('rpg_shop_pets').setLabel('🐾 Evciller').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('rpg_menu').setLabel('🗺️ Köy').setStyle(ButtonStyle.Secondary),
  ));
  return rows;
}

function getBattleButtons(battle) {
  const noPotion = !battle || battle.pPotions <= 0;
  const rows = [new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('rpg_saldir').setLabel('Saldır').setEmoji(E.CL_kiliclar).setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('rpg_iksir').setLabel(`İksir(${battle ? battle.pPotions : 0})`).setEmoji(E.CL_beyaz_iksir).setStyle(ButtonStyle.Success).setDisabled(noPotion),
    new ButtonBuilder().setCustomId('rpg_kac').setLabel('Kaç').setEmoji('💨').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('rpg_oto').setLabel('Auto').setEmoji('⏭️').setStyle(ButtonStyle.Primary)
  )];
  if (battle && battle.activePowers && battle.activePowers.length > 0) {
    const actives = battle.activePowers.filter(p => (battle.cooldowns[p.id] || 0) <= 0);
    const onCooldown = battle.activePowers.filter(p => (battle.cooldowns[p.id] || 0) > 0);
    const powerBtns = [];
    for (const p of actives) {
      powerBtns.push(new ButtonBuilder().setCustomId(`rpg_power_${p.id}`).setLabel(p.name.split(' ').slice(1).join(' ')).setStyle(ButtonStyle.Primary));
    }
    for (const p of onCooldown) {
      powerBtns.push(new ButtonBuilder().setCustomId(`rpg_power_${p.id}`).setLabel(`${p.name.split(' ').slice(1).join(' ')} (${battle.cooldowns[p.id]})`).setStyle(ButtonStyle.Secondary).setDisabled(true));
    }
    if (powerBtns.length > 0) {
      rows.push(new ActionRowBuilder().addComponents(powerBtns.slice(0, 5)));
    }
  }
  return rows;
}

function getBackButtons() {
  return [new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('rpg_menu').setLabel('🗺️ Köy').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('rpg_kapat').setLabel('❌ Kapat').setStyle(ButtonStyle.Secondary)
  )];
}

function getLoseButtons() {
  return [new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('rpg_menu').setLabel('🏥 Köye Dön').setStyle(ButtonStyle.Success),
  )];
}

async function cmdRpg(message) {
  let char = getChar(message.author.id);
  if (!char) {
    char = createChar(message.author.id);
  }
  message.channel.send({ flags: 32768, components: w(createKoyEmbed(char, message.author, message.client), ...getKoyButtons()) });
}

async function cmdBaslat(message, args) {
  let char = getChar(message.author.id);
  if (char) return message.reply('Zaten bir karakterin var! `.rpg` ile köye git.');
  char = createChar(message.author.id);
  message.channel.send({ flags: 32768, components: w(createKoyEmbed(char, message.author, message.client), ...getKoyButtons()) });
}

async function cmdProfil(message) {
  const char = getChar(message.author.id);
  if (!char) return message.reply('Henüz bir karakterin yok! `.rpg` ile başlat.');
  message.channel.send({ flags: 32768, components: w(createProfileEmbed(char, message.author, message.client), ...getBackButtons()) });
}

async function cmdSavas(message) {
  const char = getChar(message.author.id);
  if (!char) return message.reply('Henüz bir karakterin yok!');
  if (char.location !== 'zindan' || char.floor <= 0) return message.reply('Zindanda değilsin! `.rpg` ile köye git, oradan zindana gir.');
  if (char.hp <= 0) return message.reply('💀 Canavar tarafından yenildin!');
  if (BATTLES.has(message.author.id)) return message.reply('Zaten bir savaştasın!');
  const monster = getFloorMonster(char.floor);
  const battle = initBattle(char, message.author.id, monster);
  if (!battle) return message.reply('Savaş başlatılamadı.');
  message.channel.send({ flags: 32768, components: w(createBattleEmbed(battle, message.client), ...getBattleButtons(battle)) });
}

async function cmdIyiles(message) {
  const char = getChar(message.author.id);
  if (!char) return message.reply('Henüz bir karakterin yok!');
  if (char.hp >= getMaxHp(char)) return message.reply('Canın zaten full!');
  if (char.potions > 0) {
    const heal = Math.floor(getMaxHp(char) * 0.4);
    char.hp = Math.min(getMaxHp(char), char.hp + heal);
    char.potions--;
    saveChar(message.author.id, char);
    return message.reply(`🧪 **+${heal}** can yeniledin! (❤️ ${char.hp}/${getMaxHp(char)}) İksir: ${char.potions}`);
  }
  if (char.gold >= 30) {
    const heal = Math.floor(getMaxHp(char) * 0.3);
    char.hp = Math.min(getMaxHp(char), char.hp + heal);
    char.gold -= 30;
    saveChar(message.author.id, char);
    return message.reply(`💰 **30** altın karşılığında **+${heal}** can yeniledin! (❤️ ${char.hp}/${getMaxHp(char)})`);
  }
  message.reply('Ne iksirin ne de 30 altının var!');
}

async function handleInteraction(interaction) {
  try {
  const { customId } = interaction;
  const uid = interaction.user.id;

  if (customId === 'rpg_kapat') {
    await interaction.deferUpdate();
    return interaction.message.edit({ content: '❌ Kapatıldı.', components: [] });
  }

  if (customId === 'rpg_menu') {
    await interaction.deferUpdate();
    const char = getChar(uid);
    if (!char) return interaction.message.edit({ components: w(createResultEmbed(createChar(uid), interaction.user, '🏘️ Köy', 'Karakterin oluşturuldu! Hoş geldin maceracı!', 0x2B2D31, interaction.client), ...getKoyButtons()) });
    char.location = 'koy';
    saveChar(uid, char);
    return interaction.message.edit({ components: w(createKoyEmbed(char, interaction.user, interaction.client), ...getKoyButtons()) });
  }

  if (customId === 'rpg_profil') {
    await interaction.deferUpdate();
    const char = getChar(uid);
    if (!char) return interaction.message.edit({ components: w(createResultEmbed(createChar(uid), interaction.user, '📊 Profil', 'Önce bir karakter oluşturmalısın!', 0x2B2D31, interaction.client), ...getKoyButtons()) });
    return interaction.message.edit({ components: w(createProfileEmbed(char, interaction.user, interaction.client), ...getBackButtons()) });
  }

  if (customId === 'rpg_achievements') {
    await interaction.deferUpdate();
    const char = getChar(uid);
    if (!char) return interaction.message.edit({ components: w(createResultEmbed(createChar(uid), interaction.user, '🏆 Başarımlar', 'Önce bir karakter oluşturmalısın!', 0x2B2D31, interaction.client), ...getKoyButtons()) });
    return interaction.message.edit({ components: w(createAchievementsEmbed(char, interaction.user, interaction.client), ...getBackButtons()) });
  }

  if (customId === 'rpg_powers') {
    await interaction.deferUpdate();
    const char = getChar(uid);
    if (!char) return interaction.message.edit({ components: w(createResultEmbed(createChar(uid), interaction.user, '🔮 Güçler', 'Önce bir karakter oluşturmalısın!', 0x2B2D31, interaction.client), ...getKoyButtons()) });
    return interaction.message.edit({ components: w(createPowersEmbed(char, interaction.user, interaction.client), ...getBackButtons()) });
  }

  if (customId.startsWith('rpg_power_')) {
    await interaction.deferUpdate();
    const powerId = customId.replace('rpg_power_', '');
    if (!BATTLES.has(uid)) { await interaction.followUp({ content: 'Savaşın yok!', ephemeral: true }); return; }
    const result = processPower(uid, powerId);
    if (result.error) { await interaction.followUp({ content: result.error, ephemeral: true }); return; }
    if (result.won || result.lost) {
      const fin = finishBattle(uid, result);
      if (!fin) return;
      if (fin.type === 'win') {
        const embed = createWinEmbed(fin.battle, fin.char, fin.xpGain, fin.goldGain, fin.leveledUp, fin.char.floor, interaction.client);
        return interaction.message.edit({ components: w(embed, ...getPostBattleButtons()) });
      }
      if (fin.type === 'lose') {
        const embed = createLoseEmbed(fin.battle, fin.char, fin.lostGold || 0, interaction.client);
        return interaction.message.edit({ components: w(embed, ...getLoseButtons()) });
      }
    }
    return interaction.message.edit({ components: w(createBattleEmbed(result.battle, interaction.client), ...getBattleButtons(result.battle)) });
  }

  if (customId === 'rpg_zindana_gir') {
    await interaction.deferUpdate();
    const char = getChar(uid);
    if (!char) return interaction.message.edit({ components: w(createResultEmbed(createChar(uid), interaction.user, '🏘️ Köy', 'Önce karakter oluştur!', 0x2B2D31, interaction.client), ...getKoyButtons()) });
    if (char.hp <= 0) { await interaction.followUp({ content: '💀 Ölüsün! Önce şifahaneye git.', ephemeral: true }); return; }
    char.location = 'zindan';
    char.floor = (char.highestFloor || 0) + 1;
    saveChar(uid, char);
    const monster = getFloorMonster(char.floor);
    return interaction.message.edit({ components: w(createDungeonEmbed(char, interaction.user, monster, interaction.client), ...getDungeonButtons()) });
  }

  if (customId === 'rpg_koye_don') {
    await interaction.deferUpdate();
    const char = getChar(uid);
    if (!char) return interaction.message.edit({ components: w(createResultEmbed(createChar(uid), interaction.user, '🏘️ Köy', 'Önce karakter oluştur!', 0x2B2D31, interaction.client), ...getKoyButtons()) });
    char.location = 'koy';
    char.floor = 0;
    saveChar(uid, char);
    return interaction.message.edit({ components: w(createKoyEmbed(char, interaction.user, interaction.client), ...getKoyButtons()) });
  }

  if (customId === 'rpg_sonraki_kat') {
    await interaction.deferUpdate();
    const char = getChar(uid);
    if (!char) return interaction.message.edit({ components: w(createResultEmbed(createChar(uid), interaction.user, '🏘️ Köy', 'Önce karakter oluştur!', 0x2B2D31, interaction.client), ...getKoyButtons()) });
    if (char.hp <= 0) { await interaction.followUp({ content: '💀 Çok zayıfsın! Köye dönüp iyileş.', ephemeral: true }); return; }
    char.location = 'zindan';
    saveChar(uid, char);
    const monster = getFloorMonster(char.floor);
    return interaction.message.edit({ components: w(createDungeonEmbed(char, interaction.user, monster, interaction.client), ...getDungeonButtons()) });
  }

  if (customId === 'rpg_zindan_savas') {
    await interaction.deferUpdate();
    const char = getChar(uid);
    if (!char) return interaction.message.edit({ components: w(createResultEmbed(createChar(uid), interaction.user, '🏘️ Köy', 'Önce karakter oluştur!', 0x2B2D31, interaction.client), ...getKoyButtons()) });
    if (char.hp <= 0) { await interaction.followUp({ content: '💀 Ölüsün! Köye dön.', ephemeral: true }); return; }
    if (BATTLES.has(uid)) { await interaction.followUp({ content: 'Zaten savaştasın!', ephemeral: true }); return; }
    const monster = getFloorMonster(char.floor);
    const battle = initBattle(char, uid, monster);
    if (!battle) return;
    return interaction.message.edit({ components: w(createBattleEmbed(battle, interaction.client), ...getBattleButtons(battle)) });
  }

  // VILLAGE ACTIONS
  if (customId === 'rpg_dinlen') {
    await interaction.deferUpdate();
    const char = getChar(uid);
    if (!char) return;
    if (char.gold < 30) { await interaction.followUp({ content: '30 altın gerekli!', ephemeral: true }); return; }
    if (char.hp >= getMaxHp(char)) { await interaction.followUp({ content: 'Canın full!', ephemeral: true }); return; }
    char.gold -= 30;
    const h = getMaxHp(char) - char.hp;
    char.hp = getMaxHp(char);
    char.stats.goldSpent = (char.stats.goldSpent || 0) + 30;
    saveChar(uid, char);
    const embed = createResultEmbed(char, interaction.user, '🏠 Dinlenme', `🏠 Şömine başında dinlendin! **❤️ +${h}** can yeniledin.\n❤️ **FULL**\n💰 Kalan: **${char.gold}** Altın`, 0x2B2D31, interaction.client);
    return interaction.message.edit({ components: w(embed, ...getBackButtons()) });
  }

  if (customId === 'rpg_sifahane') {
    await interaction.deferUpdate();
    const char = getChar(uid);
    if (!char) return;
    if (char.hp >= getMaxHp(char)) { await interaction.followUp({ content: 'Canın full!', ephemeral: true }); return; }
    if (char.hp > Math.floor(getMaxHp(char) * 0.5)) { await interaction.followUp({ content: 'Canın %50 üstünde. Dinlenme butonunu kullan.', ephemeral: true }); return; }
    const heal = Math.floor(getMaxHp(char) * 0.6);
    char.hp = Math.min(getMaxHp(char), char.hp + heal);
    saveChar(uid, char);
    const embed = createResultEmbed(char, interaction.user, '🏥 Şifahane', `🏥 Rahibe yaralarını sardı! **❤️ +${heal}** can yeniledin.\n❤️ ${char.hp}/${getMaxHp(char)}`, 0x2B2D31, interaction.client);
    return interaction.message.edit({ components: w(embed, ...getBackButtons()) });
  }

  if (customId === 'rpg_iksir_al') {
    await interaction.deferUpdate();
    const char = getChar(uid);
    if (!char) return;
    if (char.gold < 20) { await interaction.followUp({ content: '20 altın gerekli!', ephemeral: true }); return; }
    char.gold -= 20;
    char.potions++;
    char.stats.goldSpent = (char.stats.goldSpent || 0) + 20;
    saveChar(uid, char);
    const embed = createResultEmbed(char, interaction.user, '🧪 İksir Satın Al', `🧪 **1 iksir** aldın! (Toplam: ${char.potions})\n💰 **${char.gold}** altın kaldı.`, 0x2B2D31, interaction.client);
    return interaction.message.edit({ components: w(embed, ...getBackButtons()) });
  }

  // SHOP
  if (customId.startsWith('rpg_shop_')) {
    await interaction.deferUpdate();
    const char = getChar(uid);
    if (!char) return;
    const cat = customId.replace('rpg_shop_', '');
    return interaction.message.edit({ components: w(createShopEmbed(char, cat, interaction.client), ...getShopButtons(cat)) });
  }

  if (customId.startsWith('rpg_buy_')) {
    await interaction.deferUpdate();
    const char = getChar(uid);
    if (!char) return;
    const parts = customId.replace('rpg_buy_', '').split('_');
    const type = parts[0];
    const itemId = parts.slice(1).join('_');
    let item, cost, field;
    if (type === 'w') { item = WEAPONS.find(x => x.id === itemId); cost = item?.cost; field = 'weapon'; }
    else if (type === 'a') { item = ARMORS.find(x => x.id === itemId); cost = item?.cost; field = 'armor'; }
    else { item = PETS.find(x => x.id === itemId); cost = item?.cost; field = 'pet'; }
    if (!item) { await interaction.followUp({ content: 'Ürün bulunamadı!', ephemeral: true }); return; }
    if (char[field] === itemId) { await interaction.followUp({ content: 'Zaten buna sahipsin!', ephemeral: true }); return; }
    if (char.gold < cost) { await interaction.followUp({ content: `Yeterli altının yok! **${cost}** altın gerekli.`, ephemeral: true }); return; }
    char.gold -= cost;
    char.stats.goldSpent = (char.stats.goldSpent || 0) + cost;
    char[field] = itemId;
    saveChar(uid, char);
    await interaction.followUp({ content: `✅ **${item.name}** satın aldın! Kalan altın: **${char.gold}**`, ephemeral: true });
    const cat = type === 'w' ? 'weapons' : type === 'a' ? 'armors' : 'pets';
    return interaction.message.edit({ components: w(createShopEmbed(char, cat, interaction.client), ...getShopButtons(cat)) });
  }

  // BATTLE ACTIONS
  if (['rpg_saldir', 'rpg_iksir', 'rpg_kac', 'rpg_oto'].includes(customId)) {
    await interaction.deferUpdate();
    if (!BATTLES.has(uid)) { await interaction.followUp({ content: 'Savaşın yok!', ephemeral: true }); return; }
    let result;
    if (customId === 'rpg_saldir') result = processAttack(uid);
    else if (customId === 'rpg_iksir') result = processPotion(uid);
    else if (customId === 'rpg_kac') result = processEscape(uid);
    else result = processAuto(uid);
    if (result.error) {
      BATTLES.delete(uid);
      await interaction.followUp({ content: result.error, ephemeral: true });
      return interaction.message.edit({ components: [] });
    }
    if (result.ongoing) {
      return interaction.message.edit({ components: w(createBattleEmbed(result.battle, interaction.client), ...getBattleButtons(result.battle)) });
    }
    const fin = finishBattle(uid, result);
    if (!fin) { await interaction.followUp({ content: 'Savaş sonuçlandırılamadı.', ephemeral: true }); return; }
    if (fin.type === 'win') {
      const embed = createWinEmbed(fin.battle, fin.char, fin.xpGain, fin.goldGain, fin.leveledUp, fin.char.floor, interaction.client);
      return interaction.message.edit({ components: w(embed, ...getPostBattleButtons()) });
    }
    if (fin.type === 'lose') {
      const embed = createLoseEmbed(fin.battle, fin.char, fin.lostGold || 0, interaction.client);
      return interaction.message.edit({ components: w(embed, ...getLoseButtons()) });
    }
    if (fin.type === 'escape') {
      const text = [
        `　${fin.battle.monster.name}`,
        `　❤️ ${bar(fin.battle.mHp, fin.battle.monster.hp)}　\`${fin.battle.mHp}/${fin.battle.monster.hp}\``,
        '',
        `　${'═'.repeat(20)} **VS** ${'═'.repeat(20)}`,
        '',
        `　**Maceraçı**`,
        `　❤️ ${bar(fin.battle.pHp, fin.battle.pMaxHp)}　\`${fin.battle.pHp}/${fin.battle.pMaxHp}\``,
        '',
        `　💨 Savaştan kaçtın! Can kaybın yok.`,
        '',
        `**${div()}**`,
        '`🗺️ Köy`　`📊 Profil`',
        '',
        '-# Infermus League',
      ].join('\n');
      return interaction.message.edit({ components: w(Container([T(text)]), ...getBackButtons()) });
    }
  }
  } catch (e) {
    console.error('RPG handleInteraction hatası:', e);
    try {
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferUpdate();
      }
      await interaction.editReply({ content: `❌ Hata: ${e.message}`, components: [] });
    } catch {}
  }
}

module.exports = {
  'rpg': { execute: cmdRpg },
  'rpg-başlat': { execute: cmdBaslat },
  'rpg-profil': { execute: cmdProfil },
  'rpg-savaş': { execute: cmdSavas },
  'rpg-iyileş': { execute: cmdIyiles },
  handleInteraction
};
