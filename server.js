'use strict';

const express = require('express');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2/promise');
const argon2 = require('argon2');
const path = require('path');

const app = express();

const DB = {
  host: '192.168.13.88',
  user: 'techservices',
  password: 'Abcd1234!@#$',
  database: 'toolbox',
};

const COOKIE_NAME = 'toolbox_sid';
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 12; // 12 hours

let pool;

async function initDb() {
  pool = await mysql.createPool({
    host: DB.host,
    user: DB.user,
    password: DB.password,
    database: DB.database,
    waitForConnections: true,
    connectionLimit: 10,
  });
}

function newSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

async function saveSession(id, user) {
  const expires = new Date(Date.now() + COOKIE_MAX_AGE);
  await pool.execute(
    `REPLACE INTO sessions (session_id, expires_at, data)
     VALUES (?, ?, JSON_OBJECT('user', ?))`,
    [id, expires, JSON.stringify(user)]
  );
}

async function loadSession(id) {
  const [rows] = await pool.execute(
    `SELECT data FROM sessions WHERE session_id = ? AND expires_at > NOW()`,
    [id]
  );
  return rows.length ? JSON.parse(rows[0].data).user : null;
}

async function deleteSession(id) {
  await pool.execute(`DELETE FROM sessions WHERE session_id = ?`, [id]);
}

async function requireAuth(req, res, next) {
  const sid = req.cookies[COOKIE_NAME];
  if (!sid) return res.redirect('/login.html');

  const user = await loadSession(sid);
  if (!user) return res.redirect('/login.html');

  req.user = user;
  next();
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// LOGIN PAGE
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// LOGIN API
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await pool.execute(
    `SELECT id, username, password_hash FROM users WHERE username = ?`,
    [username]
  );

  if (!rows.length) return res.status(401).send('Invalid login');

  const valid = await argon2.verify(rows[0].password_hash, password);
  if (!valid) return res.status(401).send('Invalid login');

  const sid = newSessionId();
  await saveSession(sid, { id: rows[0].id, username: rows[0].username });

  res.cookie(COOKIE_NAME, sid, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
  });

  res.redirect('/');
});

// LOGOUT
app.post('/api/logout', async (req, res) => {
  const sid = req.cookies[COOKIE_NAME];
  if (sid) await deleteSession(sid);
  res.clearCookie(COOKIE_NAME);
  res.redirect('/login.html');
});

// PROTECTED CONTENT
app.use(requireAuth);
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
  await initDb();
  app.listen(3000, '127.0.0.1', () => {
    console.log('Toolbox auth running on http://127.0.0.1:3000');
  });
})();
