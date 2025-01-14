import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import './LoginPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Ícones para mostrar/ocultar password

const LoginPage = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    if (localStorage.getItem('authToken')) {
      setIsLoggedIn(true);
      const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
      navigate(redirectUrl);

    }
  };

  return (
    <div className="login-page">
      {/* Lado esquerdo com a imagem */}
      <div className="login-image"></div>

      {/* Lado direito com o formulário */}
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
          <img src="https://res.cloudinary.com/dcvtrregd/image/upload/v1736812812/HorsesInPocket/HorsesInPocket/FullLogo_Transparent_2_pm6gp2.png" alt="HorsesInPocket Logo" className="login-logo-image" />
          </div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <FaEyeSlash onClick={() => setShowPassword(false)} className="password-icon" />
            ) : (
              <FaEye onClick={() => setShowPassword(true)} className="password-icon" />
            )}
          </div>
          <button type="submit" disabled={loading}>
            Iniciar Sessão
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p className="register-message">
          Esqueceu-se da palavra-passe? <Link to="/forgot/password">Recupere aqui</Link>.
        </p>
        <p className="register-message">
          Não tem uma conta? <Link to="/register">Registe-se</Link>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
