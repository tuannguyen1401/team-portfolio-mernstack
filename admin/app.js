require('dotenv').config();
const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const db = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();

// Kiểm tra kết nối DB trước khi vào web
db.ping()
  .then(() => {
    console.log('Kết nối database thành công.');
  })
  .catch((err) => {
    console.error('Không thể kết nối database:', err);
    process.exit(1);
  });

// Settings
const PORT = process.env.PORT || 4000;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', false);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
  secret: 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Attach pool to request (optional convenience)
app.use((req, _res, next) => {
  req.db = db;
  next();
});

// Routes
app.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  res.render('dashboard', { title: 'Admin Dashboard', layout: 'layout' });
});

app.use('/', authRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Not Found', layout: 'layout' });
});

// Start
app.listen(PORT, () => {
  console.log(`Admin server listening on http://localhost:${PORT}`);
});

