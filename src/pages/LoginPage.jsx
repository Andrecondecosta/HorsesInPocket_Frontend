import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import './LoginPage.css'; // Importa o arquivo CSS

const LoginPage = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);

    if (localStorage.getItem('authToken')) {  // Verifique a chave 'authToken'
      setIsLoggedIn(true);
      navigate('/dashboard'); // Redireciona para o dashboard após o login
    }
  };

  return (
    <div className="login-container">
      <img src="https://res.cloudinary.com/dcvtrregd/image/upload/v1732230611/HorsesInPocket/Captura_de_ecr%C3%A3_2024-11-21_230152-removebg-preview_gcggjp.png" alt="HorsesInPocket Logo" className="login-logo" />
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <p className="register-message">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;
