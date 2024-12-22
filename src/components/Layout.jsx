import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css';

const Layout = ({ setIsLoggedIn, children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false); // Atualiza o estado global
    navigate('/login'); // Redireciona para login
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
          setUserName(`${data.first_name} ${data.last_name}`);
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
        <Link to="/" className="logo-link">HorsesInPocket</Link>
        <div className="user-info" ref={menuRef}>
          <span className="user-text" onClick={() => setMenuOpen(!menuOpen)}>
            Olá, {userName} ⚙️
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
