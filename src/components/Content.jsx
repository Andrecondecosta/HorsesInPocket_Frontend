import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// Regras globais do CSS antigo (antes nos CSS do login/registo). Tem de ser o primeiro CSS
// a carregar, como esses ficheiros eram, para o resto do CSS antigo continuar a sobrepor-se.
import '../legacy-globals.css';
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
import SharedHorse from '../pages/SharedHorse';
import AdminDashboard from '../pages/AdminDashboard';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import WelcomePage from '../pages/WelcomePage';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import SupportPage from '../pages/SupportPage';
import './Content.css';

function Content({ setIsLoggedIn }) {
  const isAuthenticated = localStorage.getItem('authToken');
  return (
    <div className='content-container'>
      <Routes>
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/forgot/password" element={<ForgotPassword />} />
        <Route path="/reset/password/:token" element={<ResetPassword />} />
        {/* A antiga página de apresentação foi retirada; links antigos vão para o login */}
        <Route path="/home-page" element={<Navigate to="/login" replace />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/support" element={<SupportPage setIsLoggedIn={setIsLoggedIn} />} />

        {/* Protected Routes */}
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage setIsLoggedIn={setIsLoggedIn}/>} />} />
        <Route path="/update-profile" element={<ProtectedRoute element={<UpdateProfilePage setIsLoggedIn={setIsLoggedIn}/>} />} />
        <Route path="/myhorses" element={<ProtectedRoute element={<MyHorses setIsLoggedIn={setIsLoggedIn}/>} />} />
        <Route path="/newhorse" element={<ProtectedRoute element={<NewHorses setIsLoggedIn={setIsLoggedIn}/>} />} />
        <Route path="/horses/:id" element={<ProtectedRoute element={<ProfileHorse setIsLoggedIn={setIsLoggedIn}/>} />} />
        <Route path="/horses/:id/edit" element={<ProtectedRoute element={<EditHorse setIsLoggedIn={setIsLoggedIn}/>} />} />
        <Route path="/received" element={<ProtectedRoute element={<ReceivedHorses setIsLoggedIn={setIsLoggedIn}/>} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage setIsLoggedIn={setIsLoggedIn}/>} />} />
        <Route path="/horses/shared/:token" element={<SharedHorse />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />

        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </div>
  );
}

export default Content;
