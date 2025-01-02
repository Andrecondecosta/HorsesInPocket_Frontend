import React from 'react';
import './HomePage.css';


const HomePage = () => {
  return (
    <div className="homepage">
      {/* Cabeçalho */}
      <header className="header">
        <div className="logo">LOGO</div>
        <nav className="nav">
          <a href="#about">Sobre</a>
          <a href="/register">Serviços</a>
          <a href="/login">Contato</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Bem-vindo ao Nosso Site</h1>
        <p>Explore nossos serviços e veja como podemos ajudar você.</p>
        <button className="cta-button">Saiba Mais</button>
      </section>

      {/* Seções de Destaque */}
      <section id="about" className="section">
        <h2>Sobre Nós</h2>
        <p>Oferecemos os melhores serviços para atender às suas necessidades.</p>
      </section>

      <section id="services" className="section">
        <h2>Nossos Serviços</h2>
        <div className="services">
          <div className="service-card">Serviço 1</div>
          <div className="service-card">Serviço 2</div>
          <div className="service-card">Serviço 3</div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="footer">
        <p>&copy; 2025 Nossa Empresa. Todos os direitos reservados.</p>
        <p>
          <a href="#privacy">Política de Privacidade</a> | <a href="#terms">Termos de Uso</a>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
