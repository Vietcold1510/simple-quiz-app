const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Nội dung câu hỏi là bắt buộc'],
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    keywords: {
      type: [String],
      default: [],
    },
    correctAnswerIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3, // Giả sử tối đa 4 đáp án (0-3)
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    // THAY ĐỔI CHO ASM3: Thêm trường tác giả (Author) (Task 1)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Tham chiếu đến model User
      required: true,
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
