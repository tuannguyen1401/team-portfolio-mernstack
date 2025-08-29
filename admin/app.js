require('dotenv').config();
const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const initializeDatabase = require('./config/db_migration');
const optionsRoutes = require('./routes/options');
const projectRoutes = require('./routes/project');
const api = require('./routes/frontend/api');
const { isAuthenticated } = require('./middleware/auth');
const app = express();

initializeDatabase();

// Settings
const PORT = process.env.PORT || 4000;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', false);

// CORS
app.use(cors());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
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

app.use('/', authRoutes);

app.get('dashboard', (req, res) => {
  res.render('dashboard', { title: 'Dashboard', layout: 'layout' });
})
// Routes

app.use('/admin/options', isAuthenticated, optionsRoutes);
app.use('/admin/projects', isAuthenticated, projectRoutes);

app.use('/api', api); 

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Not Found', layout: 'layout' });
});

// Start
app.listen(PORT, () => {
  console.log(`Admin server listening on http://localhost:${PORT}`);
});
