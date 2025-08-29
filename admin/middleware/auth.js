const isAuthenticated = (req, res, next) => {
  // Kiểm tra xem user đã đăng nhập chưa
  if (req.session && req.session.user) {
    // Nếu đã đăng nhập, cho phép tiếp tục
    return next();
  }
  
  // Nếu chưa đăng nhập, chuyển hướng về trang login
  return res.redirect('/login');
};

module.exports = {
    isAuthenticated
};
