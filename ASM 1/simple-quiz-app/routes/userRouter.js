const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyUser, verifyAdmin } = require('../authenticate');
// Route Đăng ký và Đăng nhập
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Route Quản lý Users (Task 3: Chỉ Admin mới được GET /users)
// Phải chạy verifyUser trước để lấy thông tin user, sau đó mới kiểm tra Admin
router.get('/', verifyUser, verifyAdmin, userController.getAllUsers);

module.exports = router;
