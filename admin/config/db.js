require('dotenv').config();
const mysql = require('mysql2/promise');

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'portfolio_admin',
} = process.env;

/**
 * Create a singleton MySQL pool
 */
let pool;
function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: 'Z',
    });
  }
  return pool;
}

async function ping() {
  const p = getPool();
  const conn = await p.getConnection();
  try {
    await conn.ping();
    return true;
  } finally {
    conn.release();
  }
}

// Simple query helper: returns all rows
async function query(sql, params = []) {
  const p = getPool();
  const [rows] = await p.execute(sql, params);
  return rows;
}

module.exports = { getPool, ping, query };


