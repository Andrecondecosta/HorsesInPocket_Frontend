import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  // Ensure parameters are correctly decoded
  const rawHorseImage = searchParams.get('horseImage') || "";
  const horseImage = rawHorseImage ? decodeURIComponent(rawHorseImage) : "";

  const rawHorseName = searchParams.get('horseName') || "Your Horse";
  const horseName = decodeURIComponent(rawHorseName);

  console.log("Image received on welcome page:", horseImage);
  console.log("Name received on welcome page:", horseName);
  const errorMessage = searchParams.get('message');

  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      console.log("Showing error on Welcome Page:", decodeURIComponent(errorMessage));
      setAlertMessage(decodeURIComponent(errorMessage));
    }
  }, [errorMessage]);


  const handleRedirect = (path) => {
    navigate(`${path}?token=${token}`);
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h2>Welcome to <span>HorseHub</span>!</h2>

        {/* Show error message if it exists */}
        {alertMessage && <div className="alert-box error">{alertMessage}</div>}

        <p className="welcome-message">
          You have received a shared horse.
        </p>

        {/* Check if image is valid before displaying */}
        {horseImage && horseImage.startsWith("http") ? (
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
            to view the horse's details.
          </p>

          <p className="welcome-text">
            🔹 First time with us?{' '}
            <span className="link-text" onClick={() => handleRedirect('/register')}>
              Click here
            </span>{' '}
            to create your account and discover everything our website has to offer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
