const express = require('express');
const router = express.Router();


// SQL queries
const SQL = {
  getAllOptions: 'SELECT * FROM options',
  createOption: 'INSERT INTO options (name, value) VALUES (?, ?)',
  checkOptionExists: 'SELECT * FROM options WHERE name = ?',
  deleteOption: 'DELETE FROM options WHERE id = ?',
  getOptionById: 'SELECT * FROM options WHERE id = ?'
};

// GET /admin/options - hiển thị danh sách options
router.get('/', async (req, res) => {
  try {
    const options = await req.db.query(SQL.getAllOptions);
    res.render('options/list', { title: 'Danh sách Options', items: options, layout: 'layout' });
  } catch (error) {
    console.error('Error fetching options:', error);
    res.render('options/list', { title: 'Danh sách Options', items: [], error: 'Không thể tải dữ liệu', layout: 'layout' });
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting option with ID:', id);

    if (isNaN(id)) {
      return res.json({ success: false, message: 'ID không hợp lệ' });
    }

    const result = await req.db.query(SQL.deleteOption, [id]);
    res.json({ success: result.affectedRows > 0 });
  } catch (error) {
    console.error('Error deleting option:', error);
    res.json({ success: false, message: 'Có lỗi xảy ra khi xóa' });
  }
});

router.get('/create', async (req, res) => {
  res.render('options/create', { title: 'Thêm mới Option', layout: 'layout' });
});

router.post('/create', async (req, res) => {
  try {
    const { name, value } = req.body;
    if (!name || name.trim() === '') {
      return res.render('options/create', { title: 'Thêm mới Option', error: 'Tên option không được để trống', layout: 'layout' });
    }

    // Kiểm tra name đã tồn tại trong DB chưa
    const existing = await req.db.query(SQL.checkOptionExists, [name]);

    if (existing.length > 0) {
      return res.render('options/create', { title: 'Thêm mới Option', error: 'Tên option đã tồn tại', layout: 'layout' });
    }

    const result = await req.db.query(SQL.createOption, [name, value]);
    res.redirect('/admin/options');
  } catch (error) {
    console.error('Error creating option:', error);
    res.render('options/create', { title: 'Thêm mới Option', error: 'Có lỗi xảy ra khi tạo option', layout: 'layout' });
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
    const { id }  = req.params;
    const options = await req.db.query(SQL.getOptionById, [id]);
    const option  = options[0];
    
    if (!option) {
      return res.status(404).render('404', { title: 'Không tìm thấy', layout: 'layout' });
    }
    
    res.render('options/update', { title: 'Cập nhật Option', option: option, layout: 'layout' });
  } catch (error) {
    console.error('Error fetching option:', error);
    res.status(500).render('error', { title: 'Lỗi', error: 'Không thể tải dữ liệu', layout: 'layout' });
  }
});

module.exports = router;
