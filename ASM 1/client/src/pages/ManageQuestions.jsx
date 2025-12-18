import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Card, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createQuestion, deleteQuestion } from '../redux/slices/quizSlice';

const ManageQuestions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentQuiz } = useSelector((state) => state.quiz);

    // State cho Form thêm câu hỏi
    const [text, setText] = useState('');
    const [options, setOptions] = useState(['', '', '', '']); // 4 đáp án
    const [correctIndex, setCorrectIndex] = useState(0);

    useEffect(() => {
        if (!currentQuiz) navigate('/admin');
    }, [currentQuiz, navigate]);

    // Xử lý thay đổi nội dung đáp án
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleAddQuestion = (e) => {
        e.preventDefault();
        const questionData = {
            text,
            options,
            correctAnswerIndex: parseInt(correctIndex),
            keywords: [] // Bỏ trống hoặc thêm nếu muốn
        };

        // Gọi API tạo câu hỏi
        dispatch(createQuestion({ quizId: currentQuiz._id, questionData }));

        // Reset form
        setText('');
        setOptions(['', '', '', '']);
        setCorrectIndex(0);
    };

    const handleDelete = (id) => {
        if (window.confirm("Xóa câu hỏi này?")) {
            dispatch(deleteQuestion(id));
        }
    };

    if (!currentQuiz) return null;

    return (
        <Container className="mt-4">
            <Button variant="secondary" className="mb-3" onClick={() => navigate('/admin')}>
                &larr; Back to Dashboard
            </Button>
            
            <h2 className="mb-4">Manage Questions: <span className="text-primary">{currentQuiz.title}</span></h2>

            {/* FORM THÊM CÂU HỎI */}
            <Card className="mb-5 shadow-sm">
                <Card.Header className="bg-primary text-white">Add New Question</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleAddQuestion}>
                        <Form.Group className="mb-3">
                            <Form.Label>Question Text</Form.Label>
                            <Form.Control 
                                required
                                type="text" 
                                value={text} 
                                onChange={(e) => setText(e.target.value)} 
                                placeholder="E.g., What is the capital of France?"
                            />
                        </Form.Group>

                        <Row>
                            {options.map((opt, idx) => (
                                <Col md={6} key={idx} className="mb-2">
                                    <Form.Group>
                                        <Form.Label>Option {idx + 1}</Form.Label>
                                        <Form.Control 
                                            required
                                            type="text" 
                                            value={opt} 
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>

                        <Form.Group className="mt-3 mb-3">
                            <Form.Label>Correct Answer (Option 1-4)</Form.Label>
                            <Form.Select 
                                value={correctIndex} 
                                onChange={(e) => setCorrectIndex(e.target.value)}
                            >
                                <option value={0}>Option 1</option>
                                <option value={1}>Option 2</option>
                                <option value={2}>Option 3</option>
                                <option value={3}>Option 4</option>
                            </Form.Select>
                        </Form.Group>

                        <Button type="submit" variant="primary" className="w-100">Add Question</Button>
                    </Form>
                </Card.Body>
            </Card>

            {/* DANH SÁCH CÂU HỎI HIỆN CÓ */}
            <h4>Existing Questions</h4>
            <ListGroup>
                {currentQuiz.questions && currentQuiz.questions.map((q, idx) => (
                    <ListGroup.Item key={q._id} className="d-flex justify-content-between align-items-start p-3">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold mb-1">
                                {idx + 1}. {q.text}
                            </div>
                            <small className="text-muted">
                                Options: {q.options.join(', ')} <br/>
                                Correct Answer: <Badge bg="success">{q.options[q.correctAnswerIndex]}</Badge>
                            </small>
                        </div>
                        <div>
                            {/* Nút Delete màu đỏ như hình 104 */}
                            <Button variant="danger" size="sm" onClick={() => handleDelete(q._id)}>
                                Delete
                            </Button>
                        </div>
                    </ListGroup.Item>
                ))}
                {(!currentQuiz.questions || currentQuiz.questions.length === 0) && (
                    <p className="text-muted">No questions yet.</p>
                )}
            </ListGroup>
        </Container>
    );
};

export default ManageQuestions;