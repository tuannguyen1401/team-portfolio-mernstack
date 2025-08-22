const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { title: 'Admin Login', layout: false });
  });
  
  // POST /login
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    if (username && password) {
      try {
        const rows = await req.db.query(
          'SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1',
          [username, password]
        );
  
        if (rows.length > 0) {
          req.session.user = rows[0].id;
          return res.redirect('/');
        } else {
          return res.render('login', { title: 'Admin Login', error: 'Tên đăng nhập hoặc mật khẩu không đúng', layout: false });
        }
      } catch (err) {
        console.error('Lỗi khi kiểm tra đăng nhập:', err);
        return res.render('login', { title: 'Admin Login', error: 'Lỗi hệ thống', layout: false });
      }
    } else {
      return res.render('login', { title: 'Admin Login', error: 'Thông tin không hợp lệ', layout: false });
    }
  });
  
  // POST /logout
  router.get('/logout', (req, res) => {
    if (req.session.user) {
      req.session.destroy(() => {
        res.redirect('/login');
      });
    } else {
      res.redirect('/login');
    }
  });

module.exports = router;
