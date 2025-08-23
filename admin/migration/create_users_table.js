const db = require('../config/db');

const createUsersTableSQL = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

async function createTable() {
  try {
    await db.query(createUsersTableSQL);
    console.log('✓ Bảng users đã được tạo thành công.');
  } catch (err) {
    console.error('✗ Lỗi khi tạo bảng users:', err);
    throw err; // Để function cha biết có lỗi
  }
}

module.exports = { createTable };