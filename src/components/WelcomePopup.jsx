import React from "react";
import "./WelcomePopup.css";

const WelcomePopup = ({ onClose }) => {
  return (
    <div className="welcome">
      <div className="popup-overlay">
        <div className="popup-container">
          <h2>🎉 Bem-vindo ao HorseHub! 🐴</h2>
          <p>Você ganhou <strong>3 meses grátis</strong> do plano <strong>Ultimate</strong>!</p>
          <ul className="popup-features">
            <li>✅ Cavalos Ilimitados</li>
            <li>✅ Partilhas Ilimitadas</li>
            <li>✅ Acesso total a todos os recursos</li>
          </ul>
          <p>
            Aproveite essa oportunidade e explore todos os recursos exclusivos.
          </p>

          <div className="popup-actions">
            <button className="explore-btn" onClick={onClose}>
              Explorar Agora 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
