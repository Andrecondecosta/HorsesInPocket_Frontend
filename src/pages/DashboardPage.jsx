import React from 'react';
import './DashboardPage.css';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div className='Dashboard'>
      <h1>HorsesInPocket</h1>
      <p>Bem-vindo ao <Link to="/login" className="highlight-link">HorsesInPocket!</Link></p>
    </div>
  );
};

export default DashboardPage;
