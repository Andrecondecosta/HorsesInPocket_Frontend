import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  // 🔥 Decodifica os parâmetros da URL corretamente
  const horseImage = searchParams.get('horseImage') ? decodeURIComponent(searchParams.get('horseImage')) : "";
  const horseName = searchParams.get('horseName') ? decodeURIComponent(searchParams.get('horseName')) : "Seu Cavalo";

  console.log("🐴 Dados recebidos - Imagem:", horseImage, "Nome:", horseName);

  const handleRedirect = (path) => {
    navigate(`${path}?token=${token}`);
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h2>🐴 Bem-vindo ao <span>HorsesInPocket</span>!</h2>
        <p className="welcome-message">Você recebeu um cavalo compartilhado! Para acessá-lo, crie uma conta ou faça login.</p>

        {/* Exibe a imagem do cavalo se houver uma URL válida */}
        {horseImage ? (
          <div className="horse-image-container">
            <img src={horseImage} alt={horseName} className="horse-image" />
          </div>
        ) : (
          <p className="no-image">📷 Imagem não disponível</p>
        )}

        <h3 className="horse-name">{horseName}</h3>

        <div className="button-group">
          <button className="login-button" onClick={() => handleRedirect('/login')}>🔑 Fazer Login</button>
          <button className="register-button" onClick={() => handleRedirect('/register')}>📝 Criar Conta</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
