import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import './CardSection.css';

const CardSection = () => {
  return (
    <div className="card-section">
      {/* Card My Horses */}
      <Link to="/myhorses" className="card-link">
        <div className="card">
          <h3 className="card-title">My Horses</h3>
          <div className="card-action">
            <span>View More</span>
            <ArrowRightCircleIcon className="arrow-icon" />
          </div>
        </div>
      </Link>

      {/* Card Received Horses */}
      <Link to="/received" className="card-link">
        <div className="card">
          <h3 className="card-title">Received Horses</h3>
          <div className="card-action">
            <span>View More</span>
            <ArrowRightCircleIcon className="arrow-icon" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardSection;
