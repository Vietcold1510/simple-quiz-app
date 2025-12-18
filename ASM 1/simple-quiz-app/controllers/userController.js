const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// 1. Đăng ký
exports.registerUser = async (req, res) => {
  // Không cần tham số next ở đây
  const { username, password, admin } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Người dùng đã tồn tại' });
    }

    // Lỗi "next is not a function" trước đó xảy ra khi chạy dòng này (do gọi vào model)
    const user = await User.create({
      username,
      password,
      admin: admin || false,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        admin: user.admin,
        token: generateToken(user._id),
        message: 'Đăng ký thành công',
      });
    } else {
      res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }
  } catch (error) {
    // Trả về lỗi trực tiếp, không gọi next(error)
    res.status(500).json({ message: error.message });
  }
};

// 2. Đăng nhập (POST /users/login)
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        admin: user.admin,
        token: generateToken(user._id),
        message: 'Đăng nhập thành công',
      });
    } else {
      res
        .status(401)
        .json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Lấy tất cả user (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    // Tìm tất cả user
    // .select('-password'): Loại bỏ trường password khỏi kết quả trả về để bảo mật
    const users = await User.find({}).select('-password');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
