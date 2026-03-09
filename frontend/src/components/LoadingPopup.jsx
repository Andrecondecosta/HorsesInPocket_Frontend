import React from 'react';
import './LoadingPopup.css'; // Add custom styles here

const LoadingPopup = ({ message }) => {
  return (
    <div className="loading-popup">
      <div className="loading-popup-content">
        <div className="spinner"></div> {/* You can use an animated spinner */}
        <p>{message || 'Please wait...'}</p>
      </div>
    </div>
  );
};

export default LoadingPopup;
