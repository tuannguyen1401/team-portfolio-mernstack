const db = require('../config/db');

const createOptionsTableSQL = `
CREATE TABLE IF NOT EXISTS options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  value TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

async function createTable() {
  try {
    await db.query(createOptionsTableSQL);
    console.log('✓ Bảng options đã được tạo thành công.');
  } catch (err) {
    console.error('✗ Lỗi khi tạo bảng options:', err);
    throw err; 
  }
  }
  
module.exports = { createTable };