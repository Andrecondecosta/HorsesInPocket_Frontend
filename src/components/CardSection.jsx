import React from 'react';
import { Link } from 'react-router-dom';
import './CardSection.css';

const CardSection = () => {
  return (
    <div className="card-section">
      {/* Card Meus Cavalos */}
      <Link to="/myhorses" className="card-link">
        <div className="card">
          <img src="/icons/horses-icon.png" alt="Meus Cavalos" />
          <div className="card-content">
            <h3>Meus Cavalos</h3>
            <p>Ver Mais</p>
          </div>
        </div>
      </Link>

      {/* Card Cavalos Recebidos */}
      <Link to="/received" className="card-link">
        <div className="card">
          <img src="/icons/received-icon.png" alt="Cavalos Recebidos" />
          <div className="card-content">
            <h3>Cavalos Recebidos</h3>
            <p>Ver Mais</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardSection;
