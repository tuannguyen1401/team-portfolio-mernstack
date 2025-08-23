const express = require('express');
const router = express.Router();

// SQL queries cho bảng projects
const SQL = {
  getAllProjects: 'SELECT * FROM projects ORDER BY created_at DESC',
  createProject: 'INSERT INTO projects (title, description, image_url, project_url, github_url, technologies, category, featured, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
  getProjectById: 'SELECT * FROM projects WHERE id = ?',
  updateProject: 'UPDATE projects SET title = ?, description = ?, image_url = ?, project_url = ?, github_url = ?, technologies = ?, category = ?, featured = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
  deleteProject: 'DELETE FROM projects WHERE id = ?',
  checkProjectExists: 'SELECT * FROM projects WHERE title = ? AND id != ?'
};

// GET /admin/projects - hiển thị danh sách projects
router.get('/', async (req, res) => {
  try {
    const projects = await req.db.query(SQL.getAllProjects);
    res.render('projects/list', { 
      title: 'Danh sách Projects', 
      items: projects, 
      layout: 'layout' 
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.render('projects/list', { 
      title: 'Danh sách Projects', 
      items: [], 
      error: 'Không thể tải dữ liệu', 
      layout: 'layout' 
    });
  }
});

// GET /admin/projects/create - form tạo mới project
router.get('/create', async (req, res) => {
  res.render('projects/create', { 
    title: 'Thêm mới Project', 
    layout: 'layout' 
  });
});

// POST /admin/projects/create - tạo mới project
router.post('/create', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      image_url, 
      project_url, 
      github_url, 
      technologies, 
      category, 
      featured, 
      order_index 
    } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.render('projects/create', { 
        title: 'Thêm mới Project', 
        error: 'Tên project không được để trống', 
        layout: 'layout' 
      });
    }

    // Kiểm tra title đã tồn tại chưa
    const existing = await req.db.query(SQL.checkProjectExists, [title, 0]);
    if (existing.length > 0) {
      return res.render('projects/create', { 
        title: 'Thêm mới Project', 
        error: 'Tên project đã tồn tại', 
        layout: 'layout' 
      });
    }

    // Tạo project mới
    const result = await req.db.query(SQL.createProject, [
      title,
      description || '',
      image_url || '',
      project_url || '',
      github_url || '',
      technologies || '',
      category || 'web',
      featured === 'on' ? 1 : 0,
      order_index || 0
    ]);

    res.redirect('/admin/projects');
  } catch (error) {
    console.error('Error creating project:', error);
    res.render('projects/create', { 
      title: 'Thêm mới Project', 
      error: 'Có lỗi xảy ra khi tạo project', 
      layout: 'layout' 
    });
  }
});

// GET /admin/projects/edit/:id - form sửa project
router.get('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const projects = await req.db.query(SQL.getProjectById, [id]);
    const project = projects[0];
    
    if (!project) {
      return res.status(404).render('404', { 
        title: 'Không tìm thấy', 
        layout: 'layout' 
      });
    }
    
    res.render('projects/edit', { 
      title: 'Sửa Project', 
      project: project, 
      layout: 'layout' 
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).render('error', { 
      title: 'Lỗi', 
      error: 'Không thể tải dữ liệu', 
      layout: 'layout' 
    });
  }
});

// POST /admin/projects/edit/:id - cập nhật project
router.post('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      image_url, 
      project_url, 
      github_url, 
      technologies, 
      category, 
      featured, 
      order_index 
    } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.render('projects/edit', { 
        title: 'Sửa Project', 
        project: { id, title, description, image_url, project_url, github_url, technologies, category, featured, order_index },
        error: 'Tên project không được để trống', 
        layout: 'layout' 
      });
    }

    // Kiểm tra title đã tồn tại chưa (trừ project hiện tại)
    const existing = await req.db.query(SQL.checkProjectExists, [title, id]);
    if (existing.length > 0) {
      return res.render('projects/edit', { 
        title: 'Sửa Project', 
        project: { id, title, description, image_url, project_url, github_url, technologies, category, featured, order_index },
        error: 'Tên project đã tồn tại', 
        layout: 'layout' 
      });
    }

    // Cập nhật project
    const result = await req.db.query(SQL.updateProject, [
      title,
      description || '',
      image_url || '',
      project_url || '',
      github_url || '',
      technologies || '',
      category || 'web',
      featured === 'on' ? 1 : 0,
      order_index || 0,
      id
    ]);

    res.redirect('/admin/projects');
  } catch (error) {
    console.error('Error updating project:', error);
    res.render('projects/edit', { 
      title: 'Sửa Project', 
      project: req.body,
      error: 'Có lỗi xảy ra khi cập nhật project', 
      layout: 'layout' 
    });
  }
});

// GET /admin/projects/delete/:id - xóa project
router.get('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting project with ID:', id);

    if (isNaN(id)) {
      return res.json({ success: false, message: 'ID không hợp lệ' });
    }

    const result = await req.db.query(SQL.deleteProject, [id]);
    res.json({ success: result.affectedRows > 0 });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.json({ success: false, message: 'Có lỗi xảy ra khi xóa' });
  }
});

module.exports = router;
