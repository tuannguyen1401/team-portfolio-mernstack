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
  if (pool) return pool;

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
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    namedPlaceholders: true,
  });

  const close = async () => {
    if (!pool) return;
    try {
      await pool.end();
    } catch (e) {
      // ignore
    } finally {
      pool = undefined;
    }
  };

  process.once('SIGINT', close);
  process.once('SIGTERM', close);

  return pool;
}

async function ping() {
  try {
    const p = getPool();
    const conn = await p.getConnection();
    try {
      await conn.ping();
      return true;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Database ping failed:', error.message);
    
    // Reset pool nếu có lỗi connection
    if (error.message.includes('closed state') || 
        error.code === 'PROTOCOL_CONNECTION_LOST' ||
        error.code === 'ECONNRESET') {
      console.log('Resetting database pool due to connection error...');
      pool = null;
    }
    
    return false;
  }
}

// Simple query helper: returns all rows with retry mechanism
async function query(sql, params = []) {
  // Validate input parameters
  if (!sql || typeof sql !== 'string') {
    throw new Error(`Invalid SQL query: ${sql}`);
  }
  
  if (!Array.isArray(params)) {
    throw new Error(`Invalid params: ${params}`);
  }
  
  let retries = 3;
  
  while (retries > 0) {
    try {
      const p = getPool();
      const [rows] = await p.execute(sql, params);
      return rows;
    } catch (error) {      
      // Nếu connection bị đóng, reset pool và thử lại
      if (error.message.includes('closed state') || 
          error.code === 'PROTOCOL_CONNECTION_LOST' ||
          error.code === 'ECONNRESET') {
        
        console.log('Connection lost, resetting pool...');
        pool = null; // Reset pool để tạo connection mới
        
        retries--;
        if (retries > 0) {
          console.log(`Retrying in 1 second... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 1 giây
          continue;
        }
      }
      
      throw error; // Nếu không phải connection error hoặc hết retry
    }
  }
  
  throw new Error('Database connection failed after all retries');
}

module.exports = { getPool, ping, query };


