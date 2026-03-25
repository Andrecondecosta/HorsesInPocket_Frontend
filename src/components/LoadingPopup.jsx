import React from 'react';
import './LoadingPopup.css';

const LoadingPopup = ({ message, contained }) => {
  return (
    <div className={contained ? 'loading-popup loading-popup--contained' : 'loading-popup'}>
      <div className="loading-popup-content">
        <div className="spinner"></div>
        <p>{message || 'Loading...'}</p>
      </div>
    </div>
  );
};

export default LoadingPopup;
