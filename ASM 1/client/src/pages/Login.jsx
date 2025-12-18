import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, reset } from '../redux/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const { username, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy state từ Redux
  const { user, isLoading, error, isSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    // Nếu có lỗi, reset sau khi component unmount hoặc user nhập lại
    if (error) {
      // Có thể đặt timeout để ẩn lỗi nếu muốn
    }

    // Nếu đã đăng nhập thành công hoặc đã có user -> Chuyển hướng
    if (isSuccess || user) {
        if(user.admin) {
             navigate('/admin'); // Trang dành cho Admin (Assignment yêu cầu phân quyền)
        } else {
             navigate('/dashboard'); // Trang dành cho User thường
        }
    }

    return () => {
        dispatch(reset());
    };
  }, [user, isSuccess, navigate, dispatch, error]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
        alert("Please enter all fields");
        return;
    }
    const userData = { username, password };
    dispatch(loginUser(userData)); // Gọi action login
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '400px' }} className="p-4 shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={username}
                placeholder="Enter username"
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={onChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            <a href="/register">Don't have an account? Register here</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;