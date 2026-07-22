/**
 * Terrain auth + progress store (JSON file, portable).
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const storePath = process.env.TERRAIN_STORE_PATH || path.join(dataDir, 'store.json');

function emptyStore() {
  return { users: [], progress: {}, resetTokens: [] };
}

function readStore() {
  try {
    if (!fs.existsSync(storePath)) return emptyStore();
    const raw = fs.readFileSync(storePath, 'utf8');
    const data = JSON.parse(raw);
    return {
      users: Array.isArray(data.users) ? data.users : [],
      progress: data.progress && typeof data.progress === 'object' ? data.progress : {},
      resetTokens: Array.isArray(data.resetTokens) ? data.resetTokens : []
    };
  } catch (err) {
    console.error('store read', err);
    return emptyStore();
  }
}

function writeStore(store) {
  const tmp = storePath + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(store, null, 2));
  fs.renameSync(tmp, storePath);
}

function emptyProgress() {
  return { projects: {}, skills: {}, faculty: {} };
}

function normalizeProgress(p) {
  if (!p || typeof p !== 'object') return emptyProgress();
  return {
    projects: p.projects && typeof p.projects === 'object' ? p.projects : {},
    skills: p.skills && typeof p.skills === 'object' ? p.skills : {},
    faculty: p.faculty && typeof p.faculty === 'object' ? p.faculty : {},
    updatedAt: p.updatedAt || null
  };
}

function findUserByEmail(email) {
  const needle = String(email || '').trim().toLowerCase();
  return readStore().users.find((u) => u.email === needle) || null;
}

function findUserById(id) {
  return readStore().users.find((u) => u.id === id) || null;
}

function createUser({ id, email, name, passwordHash, createdAt }) {
  const store = readStore();
  if (store.users.some((u) => u.email === email.toLowerCase())) {
    const err = new Error('exists');
    err.code = 'EXISTS';
    throw err;
  }
  const user = {
    id,
    email: email.toLowerCase(),
    name,
    password_hash: passwordHash,
    created_at: createdAt,
    updated_at: createdAt,
    last_login_at: null
  };
  store.users.push(user);
  store.progress[id] = emptyProgress();
  store.progress[id].updatedAt = createdAt;
  writeStore(store);
  return user;
}

function updateUser(userId, patch) {
  const store = readStore();
  const idx = store.users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  const user = { ...store.users[idx], ...patch, updated_at: new Date().toISOString() };
  store.users[idx] = user;
  writeStore(store);
  return user;
}

function deleteUser(userId) {
  const store = readStore();
  store.users = store.users.filter((u) => u.id !== userId);
  delete store.progress[userId];
  store.resetTokens = store.resetTokens.filter((t) => t.userId !== userId);
  writeStore(store);
}

function getProgress(userId) {
  const store = readStore();
  return normalizeProgress(store.progress[userId]);
}

function saveProgress(userId, progress) {
  const store = readStore();
  const next = normalizeProgress(progress);
  next.updatedAt = new Date().toISOString();
  store.progress[userId] = next;
  writeStore(store);
  return next;
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

function createResetToken(userId, ttlMinutes = 60) {
  const store = readStore();
  const raw = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  store.resetTokens = store.resetTokens.filter((t) => t.expiresAt > now && t.userId !== userId);
  store.resetTokens.push({
    userId,
    tokenHash: hashToken(raw),
    expiresAt: now + ttlMinutes * 60 * 1000,
    createdAt: now
  });
  writeStore(store);
  return raw;
}

function consumeResetToken(rawToken) {
  const store = readStore();
  const now = Date.now();
  const hash = hashToken(rawToken);
  const idx = store.resetTokens.findIndex((t) => t.tokenHash === hash && t.expiresAt > now);
  if (idx === -1) return null;
  const entry = store.resetTokens[idx];
  store.resetTokens.splice(idx, 1);
  writeStore(store);
  return entry.userId;
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.created_at,
    updatedAt: user.updated_at || user.created_at,
    lastLoginAt: user.last_login_at || null
  };
}

module.exports = {
  emptyProgress,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  getProgress,
  saveProgress,
  createResetToken,
  consumeResetToken,
  publicUser
};
