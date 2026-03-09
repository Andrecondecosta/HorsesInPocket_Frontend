import React from 'react';
import './DashboardActions.css';

const DashboardActions = () => {
  return (
    <div className="dashboard-actions">
      <button className="filter-button">Filtrar</button>
      <button className="export-button">Exportar</button>
    </div>
  );
};

export default DashboardActions;
