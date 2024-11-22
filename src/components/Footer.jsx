import React from 'react';
import './Footer.css'; // Importa o arquivo CSS para o Footer

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="/about">Sobre</a>
          <a href="/contact">Contato</a>
          <a href="/privacy">Privacidade</a>
        </div>
        <p>&copy; {new Date().getFullYear()} HorsesInPocket. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
