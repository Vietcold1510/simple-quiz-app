import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Button, Table, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes, createQuiz, deleteQuiz, selectQuiz } from '../redux/slices/quizSlice';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
const { quizzes, error } = useSelector((state) => state.quiz);
console.log("Dữ liệu quizzes trong Redux:", quizzes);
console.log("Lỗi (nếu có):", error); // <--- Xem dòng này báo gì?
    const [showModal, setShowModal] = useState(false);
    const [newQuizTitle, setNewQuizTitle] = useState('');
    const [newQuizDesc, setNewQuizDesc] = useState('');

    useEffect(() => {
        if (!user || !user.admin) {
            navigate('/login');
        } else {
            dispatch(fetchQuizzes());
        }
    }, [user, navigate, dispatch]);

    const handleCreateQuiz = () => {
        dispatch(createQuiz({ title: newQuizTitle, description: newQuizDesc }));
        setShowModal(false);
        setNewQuizTitle('');
        setNewQuizDesc('');
    };

    const handleDeleteQuiz = (id) => {
        if(window.confirm("Bạn có chắc chắn muốn xóa bài thi này không?")) {
            dispatch(deleteQuiz(id));
        }
    };

    const handleManageQuestions = (quiz) => {
        dispatch(selectQuiz(quiz)); // Lưu quiz đang chọn
        navigate('/admin/questions'); // Chuyển sang trang quản lý câu hỏi
    };

    return (
        <>
            
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Manage Quizzes</h2>
                    <Button variant="success" onClick={() => setShowModal(true)}>+ New Quiz</Button>
                </div>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map((quiz) => (
                            <tr key={quiz._id}>
                                <td>{quiz.title}</td>
                                <td>{quiz.description}</td>
                                <td>
                                    <Button 
                                        variant="primary" 
                                        size="sm" 
                                        className="me-2"
                                        onClick={() => handleManageQuestions(quiz)}
                                    >
                                        Manage Questions
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        size="sm"
                                        onClick={() => handleDeleteQuiz(quiz._id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Modal tạo Quiz mới */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton><Modal.Title>Create New Quiz</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={newQuizTitle} 
                                    onChange={(e) => setNewQuizTitle(e.target.value)} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={newQuizDesc} 
                                    onChange={(e) => setNewQuizDesc(e.target.value)} 
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleCreateQuiz}>Create</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default AdminDashboard;