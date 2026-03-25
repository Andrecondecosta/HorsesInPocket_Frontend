import React from 'react';
import './LoadingPopup.css';

const LoadingPopup = ({ message }) => {
  return (
    <div className="loading-popup">
      <div className="loading-popup-content">
        <div className="spinner"></div>
        <p>{message || 'Loading...'}</p>
      </div>
    </div>
  );
};

export default LoadingPopup;
