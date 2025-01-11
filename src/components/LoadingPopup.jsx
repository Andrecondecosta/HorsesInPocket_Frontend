import React from 'react';
import './LoadingPopup.css'; // Adicione estilos personalizados aqui

const LoadingPopup = ({ message }) => {
  return (
    <div className="loading-popup">
      <div className="loading-popup-content">
        <div className="spinner"></div> {/* Pode usar um spinner animado */}
        <p>{message || 'Aguarde...'}</p>
      </div>
    </div>
  );
};

export default LoadingPopup;
