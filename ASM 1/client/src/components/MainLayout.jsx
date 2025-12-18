import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <div>
      {/* 1. Header luôn hiển thị ở đây */}
      <Header />

      {/* 2. Nội dung của các trang con (Dashboard, Quiz...) sẽ được render vào chỗ này */}
      <div className="container-fluid">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;