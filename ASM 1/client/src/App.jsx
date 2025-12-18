import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuizPage from './pages/QuizPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageQuestions from './pages/ManageQuestions';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* === GROUP 1: KHÔNG CÓ HEADER (Login/Register) === */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* === GROUP 2: CÓ HEADER (Dùng MainLayout) === */}
        <Route element={<MainLayout />}>
            
            {/* Lồng tiếp PrivateRoute để bảo vệ */}
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/quiz" element={<QuizPage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<PrivateRoute adminOnly={true} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/questions" element={<ManageQuestions />} />
            </Route>

        </Route>

        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </div>
  );
}

export default App;