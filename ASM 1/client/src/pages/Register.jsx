import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, reset } from '../redux/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    isAdmin: false, // Tùy chọn: cho phép tạo admin để test (thực tế nên ẩn)
  });
  const { username, password, confirmPassword, isAdmin } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, isSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    // Nếu đăng ký thành công -> Chuyển sang trang Login
    if (isSuccess) {
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      dispatch(reset()); // Reset trạng thái success để tránh loop
      navigate('/login');
    }

    // Reset lỗi khi component unmount
    return () => {
      dispatch(reset());
    };
  }, [isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    const userData = {
      username,
      password,
      admin: isAdmin, // Gửi kèm cờ admin (dựa trên Backend Assignment 3)
    };

    dispatch(registerUser(userData));
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '400px' }} className="p-4 shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={username}
                placeholder="Enter username"
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm password"
                onChange={onChange}
                required
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Register'}
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            <a href="/login">Already have an account? Login</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;