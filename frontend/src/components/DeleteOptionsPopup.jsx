import React from 'react';
import './DeleteOptionsPopup.css';

const DeleteOptionsPopup = ({ onClose, onDeleteForSelfAndSubsequent, onDeleteForSubsequentOnly }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Choose Deletion Option</h3>
        <button
          className="delete-option-button"
          onClick={() => {
            onClose();
            onDeleteForSelfAndSubsequent();
          }}
        >
          Delete for me and subsequent users
        </button>
        <button
          className="delete-option-button"
          onClick={() => {
            onClose();
            onDeleteForSubsequentOnly();
          }}
        >
          Delete for subsequent users only
        </button>
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteOptionsPopup;
