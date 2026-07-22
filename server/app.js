/**
 * Terrain API — auth + personalized progress (production-minded).
 */
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const JWT_SECRET = process.env.TERRAIN_JWT_SECRET || 'terrain-dev-secret-change-me';
const TOKEN_DAYS = Number(process.env.TERRAIN_TOKEN_DAYS || 30);
const IS_PROD = process.env.NODE_ENV === 'production' || !!process.env.NETLIFY;
const PUBLIC_ORIGIN = (process.env.TERRAIN_PUBLIC_ORIGIN || '').replace(/\/$/, '');
const BCRYPT_ROUNDS = 12;

/* Simple in-memory rate limit (per instance) */
const rateBuckets = new Map();
function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  let bucket = rateBuckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    rateBuckets.set(key, bucket);
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

function clientKey(req, suffix) {
  const ip = req.headers['x-forwarded-for']
    ? String(req.headers['x-forwarded-for']).split(',')[0].trim()
    : req.ip || 'local';
  return ip + ':' + suffix;
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: TOKEN_DAYS + 'd' }
  );
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Sign in required.' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = db.findUserById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Session expired. Please sign in again.' });
    req.user = user;
    req.tokenPayload = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim()) &&
    String(email).length <= 254;
}

function validateName(name) {
  const n = String(name || '').trim();
  return n.length >= 2 && n.length <= 80;
}

/** Udemy-like password policy: 8+ chars, letter + number */
function validatePassword(password) {
  const p = String(password || '');
  if (p.length < 8) return 'Password must be at least 8 characters.';
  if (p.length > 128) return 'Password is too long.';
  if (!/[A-Za-z]/.test(p)) return 'Password must include at least one letter.';
  if (!/[0-9]/.test(p)) return 'Password must include at least one number.';
  return null;
}

function dummyHash() {
  /* Valid bcrypt hash so compare timing stays similar when email is unknown */
  return '$2b$12$hlGLduS6oxj145QFSOQ0HODlTKcJ6hdcpp7w.KXQ0eQ5pAVXXGDHi';
}

function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'terrain-api', version: '2' });
  });

  app.post('/api/auth/signup', async (req, res) => {
    try {
      if (!rateLimit(clientKey(req, 'signup'), 8, 15 * 60 * 1000)) {
        return res.status(429).json({ error: 'Too many attempts. Please try again in a few minutes.' });
      }

      const name = String(req.body.name || '').trim();
      const email = String(req.body.email || '').trim().toLowerCase();
      const password = String(req.body.password || '');

      if (!validateName(name)) {
        return res.status(400).json({ error: 'Please enter your full name (2–80 characters).' });
      }
      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }
      const pwErr = validatePassword(password);
      if (pwErr) return res.status(400).json({ error: pwErr });
      if (db.findUserByEmail(email)) {
        return res.status(409).json({ error: 'An account with that email already exists. Try signing in.' });
      }

      const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const now = new Date().toISOString();
      const user = db.createUser({
        id: uuidv4(),
        email,
        name,
        passwordHash,
        createdAt: now
      });
      db.updateUser(user.id, { last_login_at: now });

      const token = signToken(user);
      res.status(201).json({
        token,
        expiresInDays: TOKEN_DAYS,
        user: db.publicUser(db.findUserById(user.id)),
        progress: db.getProgress(user.id)
      });
    } catch (err) {
      console.error('signup', err);
      res.status(500).json({ error: 'Could not create account. Try again.' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      if (!rateLimit(clientKey(req, 'login'), 20, 15 * 60 * 1000)) {
        return res.status(429).json({ error: 'Too many sign-in attempts. Please wait and try again.' });
      }

      const email = String(req.body.email || '').trim().toLowerCase();
      const password = String(req.body.password || '');
      const user = db.findUserByEmail(email);

      const hash = user ? user.password_hash : dummyHash();
      const ok = await bcrypt.compare(password, hash);
      if (!user || !ok) {
        return res.status(401).json({ error: 'Email or password is incorrect.' });
      }

      const now = new Date().toISOString();
      db.updateUser(user.id, { last_login_at: now });

      res.json({
        token: signToken(user),
        expiresInDays: TOKEN_DAYS,
        user: db.publicUser(db.findUserById(user.id)),
        progress: db.getProgress(user.id)
      });
    } catch (err) {
      console.error('login', err);
      res.status(500).json({ error: 'Could not sign in. Try again.' });
    }
  });

  app.get('/api/auth/me', authMiddleware, (req, res) => {
    res.json({
      user: db.publicUser(req.user),
      progress: db.getProgress(req.user.id),
      session: {
        expiresInDays: TOKEN_DAYS,
        issuedAt: req.tokenPayload && req.tokenPayload.iat
          ? new Date(req.tokenPayload.iat * 1000).toISOString()
          : null,
        expiresAt: req.tokenPayload && req.tokenPayload.exp
          ? new Date(req.tokenPayload.exp * 1000).toISOString()
          : null
      }
    });
  });

  /* Forgot password — always generic response (no email enumeration) */
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      if (!rateLimit(clientKey(req, 'forgot'), 6, 15 * 60 * 1000)) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
      }

      const email = String(req.body.email || '').trim().toLowerCase();
      const generic = {
        ok: true,
        message: 'If an account exists for that email, you will receive reset instructions shortly.'
      };

      if (!validateEmail(email)) return res.json(generic);

      const user = db.findUserByEmail(email);
      if (!user) return res.json(generic);

      const raw = db.createResetToken(user.id, 60);
      const origin = PUBLIC_ORIGIN || (req.headers.origin || '').replace(/\/$/, '') || '';
      const resetPath = '/reset-password.html?token=' + encodeURIComponent(raw);
      const resetUrl = origin ? origin + resetPath : resetPath;

      console.log('[terrain] password reset for', email, '→', resetUrl);

      /* Without an email provider, surface the link only outside production */
      if (!IS_PROD) {
        return res.json({ ...generic, devResetUrl: resetUrl });
      }
      return res.json(generic);
    } catch (err) {
      console.error('forgot-password', err);
      res.status(500).json({ error: 'Could not process that request. Try again.' });
    }
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      if (!rateLimit(clientKey(req, 'reset'), 10, 15 * 60 * 1000)) {
        return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
      }

      const token = String(req.body.token || '');
      const password = String(req.body.password || '');
      const pwErr = validatePassword(password);
      if (pwErr) return res.status(400).json({ error: pwErr });

      const userId = db.consumeResetToken(token);
      if (!userId) {
        return res.status(400).json({ error: 'This reset link is invalid or has expired. Request a new one.' });
      }

      const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      db.updateUser(userId, { password_hash: passwordHash });
      res.json({ ok: true, message: 'Password updated. You can sign in with your new password.' });
    } catch (err) {
      console.error('reset-password', err);
      res.status(500).json({ error: 'Could not reset password. Try again.' });
    }
  });

  app.patch('/api/auth/profile', authMiddleware, async (req, res) => {
    try {
      const name = String(req.body.name || '').trim();
      if (!validateName(name)) {
        return res.status(400).json({ error: 'Please enter your full name (2–80 characters).' });
      }
      const user = db.updateUser(req.user.id, { name });
      res.json({ user: db.publicUser(user) });
    } catch (err) {
      console.error('profile', err);
      res.status(500).json({ error: 'Could not update profile.' });
    }
  });

  app.post('/api/auth/change-password', authMiddleware, async (req, res) => {
    try {
      if (!rateLimit(clientKey(req, 'changepw') + req.user.id, 8, 15 * 60 * 1000)) {
        return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
      }

      const currentPassword = String(req.body.currentPassword || '');
      const newPassword = String(req.body.newPassword || '');
      const ok = await bcrypt.compare(currentPassword, req.user.password_hash);
      if (!ok) return res.status(401).json({ error: 'Current password is incorrect.' });

      const pwErr = validatePassword(newPassword);
      if (pwErr) return res.status(400).json({ error: pwErr });
      if (currentPassword === newPassword) {
        return res.status(400).json({ error: 'New password must be different from your current password.' });
      }

      const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
      db.updateUser(req.user.id, { password_hash: passwordHash });
      res.json({
        ok: true,
        message: 'Password updated.',
        token: signToken(db.findUserById(req.user.id)),
        expiresInDays: TOKEN_DAYS,
        user: db.publicUser(db.findUserById(req.user.id))
      });
    } catch (err) {
      console.error('change-password', err);
      res.status(500).json({ error: 'Could not change password.' });
    }
  });

  app.delete('/api/auth/account', authMiddleware, async (req, res) => {
    try {
      const password = String(req.body.password || '');
      const ok = await bcrypt.compare(password, req.user.password_hash);
      if (!ok) return res.status(401).json({ error: 'Password is incorrect.' });
      db.deleteUser(req.user.id);
      res.json({ ok: true, message: 'Your account has been deleted.' });
    } catch (err) {
      console.error('delete-account', err);
      res.status(500).json({ error: 'Could not delete account.' });
    }
  });

  app.get('/api/progress', authMiddleware, (req, res) => {
    res.json({ progress: db.getProgress(req.user.id) });
  });

  app.put('/api/progress', authMiddleware, (req, res) => {
    const body = req.body || {};
    const current = db.getProgress(req.user.id);
    const next = {
      projects: body.projects && typeof body.projects === 'object' ? body.projects : current.projects,
      skills: body.skills && typeof body.skills === 'object' ? body.skills : current.skills,
      faculty: body.faculty && typeof body.faculty === 'object' ? body.faculty : current.faculty
    };
    res.json({ progress: db.saveProgress(req.user.id, next) });
  });

  app.patch('/api/progress/:kind/:id', authMiddleware, (req, res) => {
    const kind = req.params.kind;
    const id = decodeURIComponent(req.params.id || '');
    if (!['projects', 'skills', 'faculty'].includes(kind)) {
      return res.status(400).json({ error: 'Invalid progress type.' });
    }
    if (!id || id.length > 200) return res.status(400).json({ error: 'Missing item id.' });

    const status = String(req.body.status || '').trim();
    const allowed = {
      projects: ['not_started', 'in_progress', 'done'],
      skills: ['not_started', 'in_progress', 'done'],
      faculty: ['copied', 'drafted', 'contacted']
    };
    if (!allowed[kind].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const label = String(req.body.label || '').trim().slice(0, 200);
    const progress = db.getProgress(req.user.id);
    const prev = progress[kind][id] || {};
    progress[kind][id] = {
      ...prev,
      status,
      label: label || prev.label || id,
      updatedAt: new Date().toISOString()
    };
    if (req.body.meta && typeof req.body.meta === 'object') {
      progress[kind][id].meta = Object.assign({}, prev.meta || {}, req.body.meta);
    }

    res.json({ progress: db.saveProgress(req.user.id, progress) });
  });

  app.delete('/api/progress/:kind/:id', authMiddleware, (req, res) => {
    const kind = req.params.kind;
    const id = decodeURIComponent(req.params.id || '');
    if (!['projects', 'skills', 'faculty'].includes(kind)) {
      return res.status(400).json({ error: 'Invalid progress type.' });
    }
    const progress = db.getProgress(req.user.id);
    delete progress[kind][id];
    res.json({ progress: db.saveProgress(req.user.id, progress) });
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  });

  return app;
}

module.exports = { createApp, JWT_SECRET };
