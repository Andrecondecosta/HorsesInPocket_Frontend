import React from 'react';
import './DeleteOptionsPopup.css';

const DeleteOptionsPopup = ({ onClose, onDeleteForSelfAndSubsequent, onDeleteForSubsequentOnly }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Escolha a Opção de Eliminação</h3>
        <button
          className="delete-option-button"
          onClick={() => {
            onClose();
            onDeleteForSelfAndSubsequent();
          }}
        >
          Eliminar para mim e subsequentes
        </button>
        <button
          className="delete-option-button"
          onClick={() => {
            onClose();
            onDeleteForSubsequentOnly();
          }}
        >
          Eliminar para subsequentes
        </button>
        <button className="cancel-button" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default DeleteOptionsPopup;
