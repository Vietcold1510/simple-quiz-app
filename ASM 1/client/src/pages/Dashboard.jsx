import React, { useEffect } from 'react';
import { Container, Card, Button, Row, Col, Navbar, Nav, Spinner, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes, selectQuiz, clearCurrentQuiz } from '../redux/slices/quizSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Lấy thông tin User và danh sách Quiz từ Redux Store
  const { user } = useSelector((state) => state.auth);
  const { quizzes, isLoading, error } = useSelector((state) => state.quiz);

  // 2. Logic khi load trang
  useEffect(() => {
    // Nếu chưa đăng nhập -> Đá về Login
    if (!user) {
      navigate('/login');
    } else {
      // Nếu đã đăng nhập -> Gọi API lấy danh sách bài thi về
      dispatch(fetchQuizzes());
      // Xóa trạng thái bài thi cũ (nếu có) để tránh lỗi
      dispatch(clearCurrentQuiz());
    }
  }, [user, navigate, dispatch]);


  // 4. Xử lý khi bấm nút "Start Quiz"
  const handleStartQuiz = (quiz) => {
      dispatch(selectQuiz(quiz)); // Lưu bài thi được chọn vào Redux
      navigate('/quiz'); // Chuyển sang trang làm bài
  };

  return (
    <>
      {/* --- NỘI DUNG CHÍNH (DANH SÁCH QUIZ) --- */}
      <Container>
        <h2 className="mb-4 fw-bold">Available Quizzes</h2>

        {/* Hiển thị Loading nếu đang tải */}
        {isLoading && (
            <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading quizzes...</p>
            </div>
        )}

        {/* Hiển thị Lỗi nếu có */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Hiển thị lưới danh sách Quiz */}
        <Row xs={1} md={2} lg={3} className="g-4">
            {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                <Col key={quiz._id}>
                    <Card className="h-100 shadow-sm border-0 bg-light">
                    <Card.Body className="d-flex flex-column">
                        <Card.Title className="fw-bold text-primary">{quiz.title}</Card.Title>
                        <Card.Text className="text-muted">
                        {quiz.description ? quiz.description : "No description available."}
                        </Card.Text>
                        
                        <div className="mt-auto">
                            <Button 
                                variant="primary" 
                                className="w-100 fw-bold"
                                onClick={() => handleStartQuiz(quiz)}
                            >
                                Start Quiz
                            </Button>
                        </div>
                    </Card.Body>
                    </Card>
                </Col>
                ))
            ) : (
                !isLoading && <p className="text-muted fs-5">No quizzes found. Please ask Admin to add some.</p>
            )}
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;