import React, { useState } from 'react';
import { FaWhatsapp, FaFacebook, FaTwitter, FaEnvelope, FaLink } from 'react-icons/fa';

const ShareHorse = ({ horseId, onClose }) => {
  const [shareLink, setShareLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('authToken');
  const API_URL = process.env.REACT_APP_API_SERVER_URL;

  const generateShareLink = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/horses/${horseId}/share_via_link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ expires_at: null }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar o link de partilha');
      }

      const data = await response.json();
      setShareLink(data.link);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const shareOptions = [
    { name: 'WhatsApp', icon: <FaWhatsapp />, url: `https://wa.me/?text=${encodeURIComponent(shareLink)}` },
    { name: 'Facebook', icon: <FaFacebook />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}` },
    { name: 'Twitter', icon: <FaTwitter />, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=Veja este cavalo incrível!` },
    { name: 'Email', icon: <FaEnvelope />, url: `mailto:?subject=Veja este cavalo incrível!&body=${encodeURIComponent(shareLink)}` },
  ];

  return (
    <div className="share-modal">
      <h2>Partilhar Cavalo</h2>

      {isLoading ? (
        <p>Gerando link de partilha...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : shareLink ? (
        <div className="share-options">
          <button onClick={() => navigator.clipboard.writeText(shareLink)}>
            <FaLink /> Copiar Link
          </button>
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => window.open(option.url, '_blank')}
              disabled={!shareLink}
            >
              {option.icon} Partilhar no {option.name}
            </button>
          ))}
        </div>
      ) : (
        <button onClick={generateShareLink}>Gerar Link</button>
      )}

      <button className="close-button" onClick={onClose}>
        Fechar
      </button>
    </div>
  );
};

export default ShareHorse;
