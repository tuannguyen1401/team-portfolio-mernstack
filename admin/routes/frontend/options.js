const express = require('express');
const router = express.Router();

// SQL query để lấy tất cả options
const SQL = {
  getAllOptions: 'SELECT * FROM options',
};

// API: GET /api/options - trả về danh sách options cho frontend ReactJS
router.get('/', async (req, res) => {
  try {
    const options = await req.db.query(SQL.getAllOptions);
    res.json({ success: true, data: options });
  } catch (error) {
    console.error('Error fetching options for API:', error);
    res.status(500).json({ success: false, message: 'Không thể lấy dữ liệu options' });
  }
});

module.exports = router;
