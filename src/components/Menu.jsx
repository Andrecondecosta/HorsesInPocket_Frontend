import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logout from './Logout';
import './Menu.css'; // Certifique-se de que o arquivo CSS está sendo importado

function Menu({ isLoggedIn, setIsLoggedIn }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem('authToken');
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  useEffect(() => {
    // Fecha o menu quando a localização muda
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="Menu">
      <Link to="/" className="logo-link">
        <img src="https://res.cloudinary.com/dcvtrregd/image/upload/v1732231331/HorsesInPocket/Captura_de_ecr%C3%A3_2024-11-21_232118-removebg-preview_nfr7sv.png" alt="HorsesInPocket Logo" className="menu-logo" />
      </Link>
      <div className="menu-toggle" onClick={toggleMenu}>
        ☰
      </div>
      <ul className={isMenuOpen ? 'menu-open' : ''}>
        {isAuthenticated && (
          <>
            <li><Link to="/myhorses" onClick={handleLinkClick}>Meus Cavalos</Link></li>
            <li><Link to="/dashboard" onClick={handleLinkClick}>Dashboard</Link></li>
            <li><Link to="/profile" onClick={handleLinkClick}>Perfil</Link></li>
          </>
        )}
        {!isLoggedIn && <li><Link to="/register" onClick={handleLinkClick}>Registrar</Link></li>}
        {isLoggedIn ? (
          <li><Logout setIsLoggedIn={setIsLoggedIn} /></li>
        ) : (
          <li><Link to="/login" onClick={handleLinkClick}>Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Menu;
