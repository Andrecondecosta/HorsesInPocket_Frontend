import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import UpdateProfilePage from './pages/UpdateProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import Logout from './components/Logout';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');  // Verifique a chave 'authToken'
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/register">Registrar</Link></li>
          <li><Link to="/profile">Perfil</Link></li>
          {isLoggedIn ? (
            <li><Logout setIsLoggedIn={setIsLoggedIn} /></li> // Use o componente Logout
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </nav>

      <div>
        {isLoggedIn ? <p>Você está logado</p> : <p>Você não está logado</p>}
      </div>

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
    </Router>
  );
}

export default App;
