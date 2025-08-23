const db = require('./db');
const runMigration = require('../migration/run_migration');

// Kiểm tra kết nối DB và chạy migrations
async function initializeDatabase() {
    try {
      await db.ping();
      console.log('Kết nối database thành công.');
      
      // Chạy migrations tự động
      await runMigration();
      
    } catch (err) {
      console.error('Không thể kết nối database:', err);
      process.exit(1);
    }
  }
  
module.exports = initializeDatabase;