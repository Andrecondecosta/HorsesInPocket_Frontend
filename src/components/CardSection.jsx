import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import './CardSection.css';

const CardSection = () => {
  return (
    <div className="card-section">
      {/* Card Meus Cavalos */}
      <Link to="/myhorses" className="card-link">
        <div className="card">
          <h3 className="card-title">Meus Cavalos</h3>
          <div className="card-action">
            <span>Ver Mais</span>
            <ArrowRightCircleIcon className="arrow-icon" />
          </div>
        </div>
      </Link>

      {/* Card Cavalos Recebidos */}
      <Link to="/received" className="card-link">
        <div className="card">
          <h3 className="card-title">Cavalos Recebidos</h3>
          <div className="card-action">
            <span>Ver Mais</span>
            <ArrowRightCircleIcon className="arrow-icon" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardSection;
