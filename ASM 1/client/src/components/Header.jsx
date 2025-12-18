import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout, reset } from '../redux/slices/authSlice';
import { clearCurrentQuiz } from '../redux/slices/quizSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    dispatch(clearCurrentQuiz());
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4 px-4 shadow-sm">
      <Container fluid>
        {/* Logo: Nếu là Admin bấm vào sẽ về trang Admin, User về Dashboard */}
        <Navbar.Brand as={Link} to={user?.admin ? "/admin" : "/dashboard"} className="fw-bold fs-3">
          {user?.admin ? 'Admin Panel' : 'Quiz App'}
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto fs-5">
            
            {/* --- THAY ĐỔI Ở ĐÂY: Chỉ hiện "Home" nếu KHÔNG PHẢI là Admin --- */}
            {!user?.admin && (
                <Nav.Link as={Link} to="/dashboard">Home</Nav.Link>
            )}
            
            {/* Link chỉ hiện cho Admin */}
            {user?.admin && (
                <>
                    {/* (Tùy chọn) Thêm link về trang chủ Admin */}
                    <Nav.Link as={Link} to="/admin/questions">Manage Questions</Nav.Link>
                </>
            )}

            <Nav.Link onClick={onLogout} className="text-danger fw-bold">Logout</Nav.Link>
          </Nav>
          
          <Navbar.Text className="fs-5">
            Welcome, <span className="fw-bold text-primary">{user && user.username}</span>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;