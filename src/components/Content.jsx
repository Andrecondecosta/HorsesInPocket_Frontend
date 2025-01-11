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
import HomePage from '../pages/HomePage';
import SharedHorse from '../pages/SharedHorse';
import AdminDashboard from '../pages/AdminDashboard';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import './Content.css';


function Content({ setIsLoggedIn }) {
  return (
    <div className='content-container'>
      <Routes>
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot/password" element={<ForgotPassword />} />
        <Route path="/reset/password/:token" element={<ResetPassword />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage setIsLoggedIn={setIsLoggedIn}/>} />} />
        <Route path="/update-profile" element={<ProtectedRoute element={<UpdateProfilePage setIsLoggedIn={setIsLoggedIn}/>} />} />
        <Route path="/myhorses" element={<ProtectedRoute element={<MyHorses setIsLoggedIn={setIsLoggedIn}/>} />} />
        <Route path="/newhorse" element={<ProtectedRoute element={<NewHorses setIsLoggedIn={setIsLoggedIn}/>} />} />
        <Route path="/horses/:id" element={<ProtectedRoute element={<ProfileHorse setIsLoggedIn={setIsLoggedIn}/>} />} />
        <Route path="/horses/:id/edit" element={<ProtectedRoute element={<EditHorse setIsLoggedIn={setIsLoggedIn}/>} />} />
        <Route path="/received" element={<ProtectedRoute element={<ReceivedHorses setIsLoggedIn={setIsLoggedIn}/>} />} />
        <Route path="/dashboard" element={<DashboardPage setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/horses/shared/:token" element={<SharedHorse />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </div>
  );
}

export default Content;
