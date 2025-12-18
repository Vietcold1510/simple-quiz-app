const express = require('express');
const router = express.Router();

const quizController = require('../controllers/quizController');
const questionController = require('../controllers/questionController');
// THÊM MỚI: Import middleware xác thực
const { verifyUser, verifyAdmin } = require('../authenticate');
// Middleware log request (Giữ nguyên từ code cũ của bạn)
router.use((req, res, next) => {
  console.log('Request đang đi vào Router:', req.method, req.url);
  next();
});

// ==========================================
// PHẦN 1: ROUTES CHO CÂU HỎI (QUESTION)
// (Đặt lên trước để tránh xung đột với /:quizId)
// ==========================================

// 1. Lấy tất cả câu hỏi
// GET /quizzes/questions
router.get('/questions', questionController.getAllQuestions);

// 2. Lấy 1 câu hỏi theo ID
// GET /quizzes/question/:id
router.get('/question/:id', questionController.getQuestionById);

// 3. Sửa câu hỏi
// PUT /quizzes/question/:id
// Yêu cầu Task 4: Phải đăng nhập để kiểm tra xem có phải tác giả không
router.put('/question/:id', verifyUser, questionController.updateQuestion);

// 4. Xóa câu hỏi
// DELETE /quizzes/question/:id
// Yêu cầu Task 4: Phải đăng nhập để kiểm tra tác giả
router.delete('/question/:id', verifyUser, questionController.deleteQuestion);

// ==========================================
// PHẦN 2: ROUTES CHO QUIZ
// ==========================================

// 5. Route đặc biệt: Populate câu hỏi chứa "capital"
// GET /quizzes/:quizId/populate
router.get('/:quizId/populate', quizController.getQuizPopulateCapital);

// 6. Lấy tất cả & Tạo mới Quiz
router
  .route('/')
  .get(quizController.getAllQuizzes) // Task 2: Ai cũng được xem (GET) [cite: 11]
  .post(verifyUser, verifyAdmin, quizController.createQuiz); // Task 2: Chỉ Admin mới được tạo (POST) [cite: 12]

// 7. Xử lý Quiz theo ID (Lấy, Sửa, Xóa)
router
  .route('/:quizId')
  .get(quizController.getQuizById) // Task 2: Ai cũng được xem (GET)
  .put(verifyUser, verifyAdmin, quizController.updateQuiz) // Task 2: Chỉ Admin mới được sửa (PUT) [cite: 49]
  .delete(verifyUser, verifyAdmin, quizController.deleteQuiz); // Task 2: Chỉ Admin mới được xóa (DELETE) [cite: 49]

// ==========================================
// PHẦN 3: ROUTES TẠO CÂU HỎI (LỒNG TRONG QUIZ)
// ==========================================

// 8. Tạo 1 câu hỏi cho Quiz
// POST /quizzes/:quizId/question
// Cần verifyUser để lấy ID người dùng gán vào trường 'author'
router.post('/:quizId/question', verifyUser, questionController.createQuestion);

// 9. Tạo nhiều câu hỏi cho Quiz
// POST /quizzes/:quizId/questions
router.post(
  '/:quizId/questions',
  verifyUser,
  questionController.createManyQuestions
);

module.exports = router;
