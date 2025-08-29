const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { title } = require('process');

// SQL queries cho bảng projects
const SQL = {
  getAllProjects: 'SELECT * FROM projects ORDER BY created_at DESC',
  createProject: 'INSERT INTO projects (name, description, stack_name, github_url, image_url, chplay_link, appstore_link) VALUES (?, ?, ?, ?, ?, ?, ?)',
  getProjectById: 'SELECT * FROM projects WHERE id = ?',
  updateProject: 'UPDATE projects SET name = ?, description = ?, image_url = ?, github_url = ?, stack_name = ?, appstore_link = ?, chplay_link = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
  deleteProject: 'DELETE FROM projects WHERE id = ?',
  checkProjectExistsCreate: 'SELECT * FROM projects WHERE name = ?',
  checkProjectExistsEdit: 'SELECT * FROM projects WHERE name = ? AND id != ?'
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
      name, 
      description, 
      image_url, 
      github_url, 
      stack_name, 
      appstore_link,
      chplay_link,
    } = req.body;

    console.log(name, description, image_url, github_url, stack_name, appstore_link, chplay_link);
    // Validation
    if (!name || name.trim() === '') {
      return res.render('projects/create', { 
        name: 'Thêm mới Project', 
        error: 'Tên project không được để trống', 
        layout: 'layout' 
      });
    }

    // Kiểm tra title đã tồn tại chưa
    const existing = await req.db.query(SQL.checkProjectExistsCreate, [name]);
    if (existing.length > 0) {
      return res.render('projects/create', { 
        title: 'Thêm mới Project', 
        error: 'Tên project đã tồn tại', 
        layout: 'layout' 
      });
    }

    // Handle file upload
    let savedImageUrl = image_url;
    if (req.files && req.files.image_url) {
      const file = req.files.image_url;
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const uploadDir = path.join(__dirname, '../public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, fileName);
      await file.mv(filePath);
      savedImageUrl = `/public/uploads/${fileName}`;
    }

    // Tạo project mới
    const result = await req.db.query(SQL.createProject, [
      name, description, stack_name, github_url, savedImageUrl || '', chplay_link, appstore_link
    ]);

    console.log(result);

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
      layout: 'layout',
      id: id
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
    const id = req.params.id;
    const projects = await req.db.query(SQL.getProjectById, [id]);

    const { 
      name, 
      description, 
      image_url, 
      github_url, 
      stack_name, 
      appstore_link,
      chplay_link,
    } = req.body;

    // Validation
    if (!name || name.trim() === '') {
      return res.render('projects/edit', { 
        title: 'Sửa Project', 
        error: 'Tên project không được để trống', 
        layout: 'layout',
        id: id
      });
    }

    // Kiểm tra title đã tồn tại chưa (trừ project hiện tại)
    const existing = await req.db.query(SQL.checkProjectExistsEdit, [name, id]);
    if (existing.length > 0) {
      return res.render('projects/edit', { 
        title: 'Sửa Project', 
        project: { id, name, description, image_url, github_url, stack_name, appstore_link, chplay_link },
        error: 'Tên project đã tồn tại', 
        layout: 'layout' ,
        id: id
      });
    }

    // Determine image url: keep old if no new upload
    let savedImageUrl = image_url;
    
    if (req.files && req.files.image_url) {
      const file = req.files.image_url;
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const uploadDir = path.join(__dirname, '../public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, fileName);
      await file.mv(filePath);
      savedImageUrl = `/public/uploads/${fileName}`;

      // Xoá file cũ nếu có
      if (projects[0] && projects[0].image_url && projects[0].image_url !== savedImageUrl) {
        const oldPath = path.join(__dirname, '../public', projects[0].image_url);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    } else {
      const existingProject = projects[0];
      savedImageUrl = savedImageUrl || (existingProject ? existingProject.image_url : '');
    }

    // Cập nhật project
    const result = await req.db.query(SQL.updateProject, [
     name, description, savedImageUrl, github_url, stack_name, appstore_link, chplay_link, id
    ]);

    req.session = req.session || {};
    req.session.success = 'Cập nhật project thành công!';
    res.redirect('/admin/projects');
  } catch (error) {
    console.error('Error updating project:', error);
    res.render('projects/edit', { 
      title: 'Sửa Project', 
      project: req.body,
      error: 'Có lỗi xảy ra khi cập nhật project', 
      layout: 'layout',
      id: id
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

// POST /admin/upload-image - upload ảnh cho CKEditor
router.post('/upload-image', async (req, res) => {
  try {
    // Kiểm tra xem có file được upload không
    if (!req.files || !req.files.upload) {
      return res.status(400).json({ 
        error: 'Không có file nào được upload' 
      });
    }

    const file = req.files.upload;
    
    // Kiểm tra loại file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: 'Chỉ cho phép upload file hình ảnh (JPEG, PNG, GIF, WebP)' 
      });
    }

    // Tạo tên file unique
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    
    // Đường dẫn lưu file (tạo thư mục uploads nếu chưa có)
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, fileName);
    
    // Lưu file
    await file.mv(filePath);
    
    // Trả về URL cho CKEditor
    const imageUrl = `/public/uploads/${fileName}`;
    
    res.json({
      uploaded: 1,
      fileName: fileName,
      url: imageUrl
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      uploaded: 0,
      error: { message: 'Có lỗi xảy ra khi upload ảnh' }
    });
  }
});

module.exports = router;
