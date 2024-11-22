import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import UpdateProfilePage from '../pages/UpdateProfilePage';
import ProtectedRoute from './ProtectedRoute';
import MyHorses from '../pages/MyHorses';
import NewHorses from '../pages/NewHorses';
import ProfileHorse from '../pages/ProfileHorse';
import EditHorse from '../pages/EditHorse';
import './Content.css'; // Importa o arquivo CSS

function Content({ setIsLoggedIn }) { // Recebe setIsLoggedIn como prop
  return (
    <div className='content-container'>
      <Routes>
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        <Route path="/update-profile" element={<ProtectedRoute element={<UpdateProfilePage />} />} />
        <Route path="/myhorses" element={<ProtectedRoute element={<MyHorses />} />} />
        <Route path="/newhorse" element={<ProtectedRoute element={<NewHorses />} />} />
        <Route path="/horses/:id" element={<ProtectedRoute element={<ProfileHorse />} />} />
        <Route path="/horses/:id/edit" element={<ProtectedRoute element={<EditHorse />} />} />
        <Route path="/dashboard" element={
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
