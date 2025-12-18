const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// 1. Lấy danh sách tất cả Quiz (Kèm Populate câu hỏi)
exports.getAllQuizzes = async (req, res) => {
  try {
    // .populate('questions'): Lệnh này bảo Mongoose "hãy lấy luôn nội dung chi tiết của các câu hỏi"
    const quizzes = await Quiz.find().populate('questions');
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Lấy chi tiết 1 Quiz theo ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ message: 'Không tìm thấy Quiz' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Tạo Quiz mới
exports.createQuiz = async (req, res) => {
  try {
    const { title, description } = req.body;

    const newQuiz = await Quiz.create({ title, description });

    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 4. Cập nhật Quiz
exports.updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Không tìm thấy Quiz để sửa' });
    }
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 5. Xóa Quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const id = req.params.quizId;
    console.log('params id:', id);

    const hasChildren = await Question.exists({ quiz: id });

    if (hasChildren) {
      // Nếu có con -> Lập tức báo lỗi và chặn lại
      return res.status(400).json({
        message:
          'KHÔNG ĐƯỢC XÓA! Quiz này vẫn còn câu hỏi bên trong. Vui lòng xóa các câu hỏi trước.',
      });
    }

    // --- BƯỚC 2: XÓA (CHỈ CHẠY KHI KHÔNG CÓ CON) ---
    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Không tìm thấy Quiz' });
    }

    console.log('Deleted Quiz:', deletedQuiz);
    res.status(200).json({ message: 'Xóa thành công (Quiz rỗng)' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Lấy Quiz và chỉ populate câu hỏi chứa từ "capital"
exports.getQuizPopulateCapital = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId).populate({
      path: 'questions',
      // match: Điều kiện lọc cho bảng con (Question)
      // $regex: Tìm kiếm gần đúng (như like trong SQL)
      // $options: 'i' nghĩa là không phân biệt hoa thường (Case-insensitive)
      match: { text: { $regex: 'capital', $options: 'i' } },
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Không tìm thấy Quiz' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
