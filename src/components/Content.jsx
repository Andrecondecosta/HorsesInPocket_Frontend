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
import ReceivedHorses from '../pages/ReceivedHorses';
import './Content.css';

function Content({ setIsLoggedIn }) {
  return (
    <div className='content-container'>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rotas protegidas */}
        <Route path="/" element={<ProtectedRoute element={<DashboardPage />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        <Route path="/update-profile" element={<ProtectedRoute element={<UpdateProfilePage />} />} />
        <Route path="/myhorses" element={<ProtectedRoute element={<MyHorses />} />} />
        <Route path="/newhorse" element={<ProtectedRoute element={<NewHorses />} />} />
        <Route path="/horses/:id" element={<ProtectedRoute element={<ProfileHorse />} />} />
        <Route path="/horses/:id/edit" element={<ProtectedRoute element={<EditHorse />} />} />
        <Route path="/received" element={<ProtectedRoute element={<ReceivedHorses />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />

        {/* Rota de fallback */}
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </div>
  );
}

export default Content;
