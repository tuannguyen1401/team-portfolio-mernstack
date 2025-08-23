const db = require('../config/db');

const createProjectTableSQL = `
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  stack_name VARCHAR(255),
  github_url VARCHAR(255),
  demo_url VARCHAR(255),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

async function createTable() {
  try {
    await db.query(createProjectTableSQL);
    console.log('✓ Bảng projects đã được tạo thành công.');
  } catch (err) {
    console.error('✗ Lỗi khi tạo bảng projects:', err);
    throw err;
  }
}

module.exports = { createTable };
