import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css'; // Importa o arquivo CSS para estilizar o botão

const Logout = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="logout-button">Logout</button>
  );
};

export default Logout;
