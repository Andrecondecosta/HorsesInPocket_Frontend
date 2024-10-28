import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import './Menu.css'; // Certifique-se de que o arquivo CSS está sendo importado

function Menu({ isLoggedIn, setIsLoggedIn }) {
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  return (
    <nav className="Menu">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/register">Registrar</Link></li>
        <li><Link to="/profile">Perfil</Link></li>
        <li><Link to="/myhorses">Meus Cavalos</Link></li>
        {isLoggedIn ? (
          <li><Logout setIsLoggedIn={setIsLoggedIn} /></li>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Menu;
