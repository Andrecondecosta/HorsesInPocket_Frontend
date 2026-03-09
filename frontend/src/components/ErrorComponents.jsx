import React from 'react';

export const ErrorMessage = ({ message, onRetry, style = {} }) => {
  if (!message) return null;

  return (
    <div style={{
      padding: '1rem',
      marginBottom: '1rem',
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      borderRadius: '0.5rem',
      color: '#c33',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...style
    }}>
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#c33',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '2rem',
      color: '#666'
    }}>
      <div style={{
        display: 'inline-block',
        width: '2rem',
        height: '2rem',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #47663B',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ marginTop: '1rem' }}>{message}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
