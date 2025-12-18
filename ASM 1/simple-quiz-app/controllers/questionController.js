const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

// 1. Thêm 1 câu hỏi vào Quiz
exports.createQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Lấy ID user từ token (đã qua middleware verifyUser)
    const userId = req.user._id;

    // Kiểm tra Quiz cha
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Tạo Question mới
    const newQuestion = new Question({
      ...req.body,
      quiz: quizId, // Gán Quiz cha
      author: userId, // ASM3: Gán tác giả
    });

    await newQuestion.save();

    // Cập nhật ngược lại vào Quiz
    quiz.questions.push(newQuestion._id);
    await quiz.save();

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 2. Thêm NHIỀU câu hỏi cùng lúc
exports.createManyQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;
    const questionsData = req.body;
    const userId = req.user._id; // Lấy ID user

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Map thêm quizId và author vào từng câu hỏi
    const questionsWithInfo = questionsData.map((q) => ({
      ...q,
      quiz: quizId,
      author: userId,
    }));

    // Lưu mảng câu hỏi
    const createdQuestions = await Question.insertMany(questionsWithInfo);

    // Cập nhật lại Quiz
    const questionIds = createdQuestions.map((q) => q._id);
    quiz.questions.push(...questionIds);
    await quiz.save();

    res.status(201).json(createdQuestions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. Lấy danh sách TẤT CẢ câu hỏi (GET /questions)
// Không cần auth, ai cũng xem được
exports.getAllQuestions = async (req, res) => {
  try {
    // Populate thêm thông tin tác giả (username) để hiển thị cho đẹp (Tuỳ chọn)
    const questions = await Question.find().populate('author', 'username');
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Lấy chi tiết 1 câu hỏi theo ID (GET /question/:id)
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id).populate('author', 'username');

    if (!question) {
      return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Cập nhật nội dung câu hỏi (PUT /question/:id)
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Bước 1: Tìm câu hỏi
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: 'Không tìm thấy câu hỏi để sửa' });
    }

    // --- SỬA LỖI TẠI ĐÂY (Kiểm tra dữ liệu cũ) ---
    // Nếu câu hỏi không có field author (do tạo từ trước), báo lỗi yêu cầu xóa đi làm lại
    if (!question.author) {
      return res.status(400).json({
        message:
          'Lỗi: Câu hỏi này là dữ liệu cũ (không có Author). Vui lòng xóa câu hỏi này và tạo mới.',
      });
    }

    // Bước 2: Kiểm tra quyền sở hữu
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message:
          'KHÔNG CÓ QUYỀN! Bạn chỉ có thể sửa câu hỏi do chính mình tạo ra.',
      });
    }

    // Bước 3: Thực hiện update
    const updatedQuestion = await Question.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: 'Cập nhật câu hỏi thành công!',
      question: updatedQuestion,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 6. Xóa câu hỏi (DELETE /question/:id)
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Bước 1: Tìm câu hỏi
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: 'Không tìm thấy câu hỏi để xóa' });
    }

    // --- SỬA LỖI TẠI ĐÂY (Cho phép xóa nếu là dữ liệu cũ hoặc check author) ---
    if (question.author) {
      // Nếu có tác giả, thì phải check xem có đúng người không
      if (question.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message:
            'KHÔNG CÓ QUYỀN! Bạn chỉ có thể xóa câu hỏi do chính mình tạo ra.',
        });
      }
    } else {
      // (Tùy chọn) Nếu câu hỏi cũ không có author:
      // Cách A: Cho phép xóa luôn để dọn dẹp DB (Code chạy tiếp xuống dưới)
      // Cách B: Chặn lại giống update (return lỗi)
      console.log('Đang xóa câu hỏi cũ không có author...');
    }

    // Bước 3: Lấy ID Quiz cha để cập nhật
    const quizId = question.quiz;

    // Bước 4: Xóa câu hỏi
    await Question.findByIdAndDelete(id);

    // Bước 5: Cập nhật lại Quiz cha
    if (quizId) {
      await Quiz.findByIdAndUpdate(quizId, {
        $pull: { questions: id },
      });
    }

    res.status(200).json({
      message: 'Đã xóa câu hỏi thành công!',
      deletedId: id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
