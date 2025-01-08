import React from 'react';
import { Link } from 'react-router-dom';

import './HomePage.css';

const HomePage = () => {
  return (
      <div className="homepage-container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">Bem-vindo ao Horses in Pocket</h1>
          <p className="hero-description">
            Gerencie, conecte-se e compartilhe informações sobre cavalos de forma simples e eficiente.
            O Horses in Pocket oferece uma solução completa para criadores e amantes de cavalos.
          </p>
          <Link to="/login" className="hero-button">
            Começar Agora
          </Link>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2 className="section-title">O que oferecemos</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Gestão Completa</h3>
              <p>
                Organize os perfis dos seus cavalos com detalhes como imagens, vídeos e genealogias, tudo em um só lugar.
              </p>
            </div>
            <div className="feature-card">
              <h3>Compartilhamento Simplificado</h3>
              <p>
                Compartilhe informações de forma rápida e segura via e-mail ou links exclusivos.
              </p>
            </div>
            <div className="feature-card">
              <h3>Controle Total e Segurança</h3>
              <p>
                Monitore todas as ações realizadas, garantindo que você tenha controle sobre os seus dados.
              </p>
            </div>
            <div className="feature-card">
              <h3>Acesso em Qualquer Dispositivo</h3>
              <p>
                Navegue facilmente de qualquer lugar, seja no computador, tablet ou smartphone.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="cta-section">
          <h2>Junte-se a nós agora!</h2>
          <p>
            Descubra como o Horses in Pocket pode transformar a maneira como você gerencia, compartilha
            e se conecta com cavalos. Seja você um criador experiente ou um apaixonado, nós temos a solução ideal para você.
          </p>
          <Link to="/register" className="cta-button">
            Criar Conta
          </Link>
        </div>
      </div>

  );
};

export default HomePage;
