import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css';

const Layout = ({ setIsLoggedIn, children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userGender, setUserGender] = useState('female');
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const avatarUrl = userGender === 'male'
    ? 'https://res.cloudinary.com/dcvtrregd/image/upload/v1736802678/user_1_vl6pae.png'
    : 'https://res.cloudinary.com/dcvtrregd/image/upload/v1736802680/user_yp8nup.png';


  const handleLogout = () => {
    if (localStorage.getItem('authToken')) {
      localStorage.removeItem('authToken');
    }
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(`${data.first_name}`);
          setUserGender(data.gender);
        } else {
          setUserName('Usuário');
        }
      } catch (error) {
        setUserName('Usuário');
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="layout-container">
      <div className="navbar">
      <Link to="/dashboard" className="logo-link">
          <img src="https://res.cloudinary.com/dcvtrregd/image/upload/v1736812812/HorsesInPocket/HorsesInPocket/FullLogo_Transparent_2_pm6gp2.png" alt="HorsesInPocket Logo" className="logo-image" />
        </Link>
        <div className="user-info" ref={menuRef}>
          <span className="user-text" onClick={() => setMenuOpen(!menuOpen)}>
            <strong>Olá</strong>, {userName}
            <img src={avatarUrl} alt="User Avatar" className="user-avatar" />
          </span>
          {menuOpen && (
            <div className="dropdown-menu">
              <Link to="/profile">Perfil</Link>
              <a href='' onClick={handleLogout} className="logout-button">Sair</a>
            </div>
          )}
        </div>
      </div>
      <div className="content-wrapper">{children}</div>
    </div>
  );
};

export default Layout;
