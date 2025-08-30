const express = require('express');
const router = express.Router();

// SQL query để lấy tất cả projects
const SQL = {
  getAllProjects: 'SELECT * FROM projects ORDER BY created_at DESC',
};

// API: GET /api/projects - trả về danh sách projects cho frontend ReactJS
router.get('/', async (req, res) => {
  try {
    const projects = await req.db.query(SQL.getAllProjects);

    projects.map(project => {
      const adminBaseUrl = process.env.ADMIN_IMAGE_URL;

      if (project.image_url) {
        const imagePath = project.image_url.startsWith('/public/') ? project.image_url : '/public/' + project.image_url;
        project.image_url = adminBaseUrl + imagePath;
      }
    });

    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects for API:', error);
    res.status(500).json({ success: false, message: 'Không thể lấy dữ liệu projects' });
  }
});

module.exports = router;
