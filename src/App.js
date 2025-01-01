import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importação corrigida
import Content from './components/Content';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Busca o token no localStorage
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decodifica o token
        if (decoded.exp * 1000 > Date.now()) { // Verifica se o token ainda é válido
          setIsLoggedIn(true); // Atualiza o estado para logado
        } else {
          localStorage.removeItem('authToken'); // Remove o token expirado
        }
      } catch (error) {
        console.error('Invalid token', error); // Loga erro em caso de token inválido
        localStorage.removeItem('authToken'); // Remove token inválido
      }
    }
  }, []); // Executa uma única vez na montagem do componente

  return (
    <Router>
      <AppLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
}

function AppLayout({ isLoggedIn, setIsLoggedIn }) {
  return (
    <div className="app-container">
      <Content setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
}

export default App;
