import React from "react";
import "./WelcomePopup.css";

const WelcomePopup = ({ onClose }) => {
  return (
    <div className="welcome">
      <div className="popup-overlay">
        <div className="popup-container">
          <h2>🎉 Welcome to HorseHub! 🐴</h2>
          <p>
            You have earned <strong>3 months free</strong> of the <strong>Ultimate</strong> plan!
          </p>
          <ul className="popup-features">
            <li>✅ Unlimited Horses</li>
            <li>✅ Unlimited Shares</li>
            <li>✅ Full access to all features</li>
          </ul>
          <p>
            Take advantage of this opportunity and explore all the exclusive features.
          </p>

          <div className="popup-actions">
            <button className="explore-btn" onClick={onClose}>
              Explore Now 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
