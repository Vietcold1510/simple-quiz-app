const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Lấy secret key từ file .env
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// 1. Middleware xác thực User (verifyUser)
exports.verifyUser = async (req, res, next) => {
  let token;

  // Kiểm tra header Authorization có dạng "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Lấy token ra
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Tìm user trong DB và gán vào req.user (bỏ qua password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Không tìm thấy User.' });
      }

      next(); // Hợp lệ -> đi tiếp
    } catch (error) {
      console.error('Lỗi xác thực token:', error.message);
      return res
        .status(401)
        .json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
  } else {
    return res
      .status(401)
      .json({ message: 'Bạn chưa đăng nhập (Thiếu Token).' });
  }
};

// 2. Middleware xác thực Admin (verifyAdmin)
exports.verifyAdmin = (req, res, next) => {
  // Hàm này chạy sau verifyUser nên req.user đã có dữ liệu
  if (req.user && req.user.admin) {
    next(); // Là Admin -> đi tiếp
  } else {
    // Không phải Admin -> Chặn lại (403 Forbidden)
    res.status(403).json({
      message: 'You are not authorized to perform this operation!',
    });
  }
};
