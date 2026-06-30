const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

let data = {};

function load() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {
    data = {};
  }
}

function save() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

load();

module.exports = {
  get(key, def = null) {
    const keys = key.split('.');
    let current = data;
    for (const k of keys) {
      if (current === undefined || current === null) return def;
      current = current[k];
    }
    return current !== undefined && current !== null ? current : def;
  },

  set(key, value) {
    const keys = key.split('.');
    let current = data;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]] || typeof current[keys[i]] !== 'object') current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    save();
  },

  delete(key) {
    const keys = key.split('.');
    let current = data;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) return;
      current = current[keys[i]];
    }
    delete current[keys[keys.length - 1]];
    save();
  },

  push(key, value) {
    const arr = this.get(key, []);
    arr.push(value);
    this.set(key, arr);
  },

  getAll(prefix = '') {
    if (!prefix) return data;
    const keys = prefix.split('.');
    let current = data;
    for (const k of keys) {
      if (!current) return {};
      current = current[k];
    }
    return current || {};
  },

  exists(key) {
    return this.get(key) !== null;
  },

  add(key, amount) {
    const val = this.get(key, 0);
    this.set(key, val + amount);
    return val + amount;
  },

  subtract(key, amount) {
    const val = this.get(key, 0);
    this.set(key, Math.max(0, val - amount));
    return Math.max(0, val - amount);
  },

  getAllUsers() {
    return data.users || {};
  }
};
