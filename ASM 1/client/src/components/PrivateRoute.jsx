import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ adminOnly = false }) => {
  const { user } = useSelector((state) => state.auth);

  // 1. Nếu chưa đăng nhập -> Đá về trang Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu trang yêu cầu Admin mà user không phải Admin -> Đá về Dashboard thường
  if (adminOnly && !user.admin) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Nếu thỏa mãn điều kiện -> Cho phép hiển thị nội dung bên trong (Outlet)
  return <Outlet />;
};

export default PrivateRoute;