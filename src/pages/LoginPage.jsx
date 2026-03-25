import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import LoadingPopup from '../components/LoadingPopup';
import './LoginPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sharedToken, setSharedToken] = useState(null);
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Captura o shared_token da URL via React Router
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setSharedToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
      shared_token: sharedToken,  // Envia o shared_token capturado
    };

    await login(email, password, sharedToken);

    if (localStorage.getItem('authToken')) {
      setIsLoggedIn(true);

      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="login-page">
      {/* Left side with the image */}
      <div className="login-image"></div>

      {/* Right side with the form */}
      <div className="login-container">
      {loading && <LoadingPopup message="Loading..." contained />}
        <div className="login-header">
          <div className="login-logo">
            <img
              src="https://res.cloudinary.com/dcvtrregd/image/upload/v1736812812/HorsesInPocket/HorsesInPocket/FullLogo_Transparent_2_pm6gp2.png"
              alt="HorsesInPocket Logo"
              className="login-logo-image"
            />
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
            Log In
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p className="register-message">
          Forgot your password? <Link to="/forgot/password">Recover it here</Link>.
        </p>
        <p className="register-message">
          Don't have an account? <Link to="/register">Sign Up</Link>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
