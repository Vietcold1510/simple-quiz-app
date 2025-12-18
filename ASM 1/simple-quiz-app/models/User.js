const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// SỬA LỖI TẠI ĐÂY:
// Bỏ tham số 'next' trong function async
userSchema.pre('save', async function () {
  // Chỉ hash khi password bị thay đổi hoặc lần đầu tạo
  if (!this.isModified('password')) {
    return; // Tự động thoát ra, không cần gọi next()
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // Async function tự động trả về Promise khi xong, nên không cần gọi next()
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
