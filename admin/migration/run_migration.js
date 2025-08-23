const createUsersTable = require('./create_users_table');
const createOptionsTable = require('./create_options_table');
const createProjectTable = require('./create_project_table');

async function runMigration() {
    try {
      await createUsersTable.createTable();
      await createOptionsTable.createTable();
      await createProjectTable.createTable();
      console.log('✅ Tất cả migrations đã hoàn thành!');
    } catch (error) {
      console.error('❌ Có lỗi trong quá trình migration:', error);
      throw error;
    }
  }
module.exports = runMigration;