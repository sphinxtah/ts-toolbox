'use strict';

const mysql = require('mysql2/promise');
const argon2 = require('argon2');

(async () => {
  const db = await mysql.createConnection({
    host: '192.168.13.88',
    user: 'techservices',
    password: 'Abcd1234!@#$',
    database: 'toolbox'
  });

  const username = 'techservices';
  const password = 'Abcd1234!@#$';

  const hash = await argon2.hash(password, { type: argon2.argon2id });

  await db.execute(
    `INSERT INTO users (username, password_hash)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [username, hash]
  );

  console.log('User created/updated:', username);
  await db.end();
})();
