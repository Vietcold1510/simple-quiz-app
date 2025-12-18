import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { submitAnswer, restartQuiz, clearCurrentQuiz } from '../redux/slices/quizSlice';

const QuizPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Lấy state từ Redux
  const { currentQuiz, currentQuestionIndex, score, isFinished } = useSelector((state) => state.quiz);
  
  // State cục bộ để lưu đáp án người dùng chọn tạm thời (trước khi bấm Submit)
  const [selectedOption, setSelectedOption] = useState(null);

  // Nếu chưa chọn bài Quiz nào (F5 lại trang), quay về Dashboard
  useEffect(() => {
    if (!currentQuiz) {
      navigate('/dashboard');
    }
  }, [currentQuiz, navigate]);

  // Reset lựa chọn khi chuyển sang câu hỏi mới
  useEffect(() => {
    setSelectedOption(null);
  }, [currentQuestionIndex]);

  if (!currentQuiz) return null;

  // Xử lý nộp bài
  const handleSubmit = () => {
    if (selectedOption === null) {
        alert("Please select an answer!");
        return;
    }

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    
    // Gửi action lên Redux để tính điểm và chuyển câu
    dispatch(submitAnswer({
        selectedOptionIndex: parseInt(selectedOption),
        correctAnswerIndex: currentQuestion.correctAnswerIndex
    }));
  };

  // Xử lý quay về trang chủ
  const handleHome = () => {
      dispatch(clearCurrentQuiz());
      navigate('/dashboard');
  };

  // === GIAO DIỆN KẾT QUẢ (Như hình 103) ===
  if (isFinished) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="text-center">
          <h1 className="fw-bold mb-3">Quiz Completed</h1>
          <h3 className="mb-4">Your score: {score} / {currentQuiz.questions.length}</h3>
          <div className="d-flex gap-3 justify-content-center">
            <Button variant="primary" onClick={() => dispatch(restartQuiz())}>
                Restart Quiz
            </Button>
            <Button variant="outline-secondary" onClick={handleHome}>
                Back to Dashboard
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  // === GIAO DIỆN LÀM BÀI (Như hình 102) ===
  const question = currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;

  return (
    <Container className="mt-5">
      {/* Header nhỏ hiển thị tiến độ */}
      <div className="mb-4">
        <h4>Quiz: {currentQuiz.title}</h4>
        <ProgressBar now={progress} label={`${currentQuestionIndex + 1}/${currentQuiz.questions.length}`} />
      </div>

      <Card className="shadow-sm">
        <Card.Body className="p-5 text-center">
          <h2 className="mb-5">
             {question.text}
          </h2>

          <Form className="text-start d-inline-block">
            {question.options.map((option, index) => (
              <Form.Check 
                key={index}
                type="radio"
                id={`option-${index}`}
                name="quiz-options"
                label={option}
                className="mb-3 fs-5"
                value={index}
                checked={selectedOption === index.toString()} // So sánh string với string
                onChange={(e) => setSelectedOption(e.target.value)}
              />
            ))}
          </Form>

          <div className="mt-4">
            <Button variant="primary" size="lg" onClick={handleSubmit}>
              Submit Answer
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      <div className="text-center mt-3">
          <Button variant="link" onClick={handleHome} className="text-muted">
              Cancel Quiz
          </Button>
      </div>
    </Container>
  );
};

export default QuizPage;