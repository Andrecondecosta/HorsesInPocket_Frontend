import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  // 🔥 Correctly decodes the parameters
  const horseImage = searchParams.get('horseImage')
    ? decodeURIComponent(searchParams.get('horseImage'))
    : "";
  const horseName = searchParams.get('horseName')
    ? decodeURIComponent(searchParams.get('horseName'))
    : "Your Horse";

  const handleRedirect = (path) => {
    navigate(`${path}?token=${token}`);
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h2>Welcome to <span>HorseHub</span>!</h2>

        <p className="welcome-message">
          You have received a shared horse.
        </p>

        {/* Display the horse image if a valid URL is available */}
        {horseImage ? (
          <div className="horse-image-container">
            <img src={horseImage} alt={horseName} className="horse-image" />
          </div>
        ) : (
          <p className="no-image">📷 Image not available</p>
        )}

        <h3 className="horse-name">{horseName}</h3>

        <div className="welcome-options">
          <p className="welcome-text">
            🔹 Already a part of HorseHub?{' '}
            <span className="link-text" onClick={() => handleRedirect('/login')}>
              Click here
            </span>{' '}
            View the horse's details .
          </p>

          <p className="welcome-text">
            🔹 First time whith us?{' '}
            <span className="link-text" onClick={() => handleRedirect('/register')}>
              Click here
            </span>{' '}
            to create your account and discover everything our website has ofter.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
