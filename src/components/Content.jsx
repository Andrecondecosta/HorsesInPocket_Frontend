import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import UpdateProfilePage from '../pages/UpdateProfilePage';
import ProtectedRoute from './ProtectedRoute';

function Content({ setIsLoggedIn }) { // Recebe setIsLoggedIn como prop
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        <Route path="update-profile" element={<ProtectedRoute element={<UpdateProfilePage />} />} />
        <Route path="/" element={
          <div>
            <h1>Bem-vindo ao sistema de autenticação!</h1>
            <p>Use o menu acima para acessar as páginas de Login, Registro ou Dashboard.</p>
          </div>
        } />
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </div>
  );
}

export default Content;
