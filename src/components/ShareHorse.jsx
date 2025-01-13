import React, { useEffect, useState } from 'react';
import { FaWhatsapp, FaLink } from 'react-icons/fa';
import './ShareHorse.css';

const ShareHorse = ({ horseId, onClose }) => {
  const [shareLink, setShareLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(null);

  const token = localStorage.getItem('authToken');
  const API_URL = process.env.REACT_APP_API_SERVER_URL;

  // Gerar o link de partilha
  useEffect(() => {
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

    generateShareLink();
  }, [horseId, API_URL, token]);

  // Função para partilhar por email
  const shareByEmail = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, insira um email válido.');
      return;
    }

    setEmailSuccess(null);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/horses/${horseId}/share_via_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao partilhar por email');
      }

      setEmailSuccess(`Cavalo partilhado com sucesso com ${email}`);
      setEmail('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* Fundo cinza escuro */}
      <div className="modal-overlay"></div>

      {/* Modal de partilha */}
      <div className="share-modal">
        {isLoading ? (
          <p>A gerar o link de partilha...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <div className="share-header">
              <h2>Partilhar Cavalo</h2>
              <div className="share-options">
                <button
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    alert('Link copiado!');
                  }}
                  aria-label="Copiar link para partilha"
                >
                  <FaLink /> Copiar Link
                </button>
                <button
                  className="whatsapp-button"
                  onClick={() =>
                    window.open(`https://wa.me/?text=${encodeURIComponent(shareLink)}`, '_blank')
                  }
                  aria-label="Partilhar no WhatsApp"
                >
                  <FaWhatsapp /> WhatsApp
                </button>
              </div>
            </div>

            <input
              type="email"
              placeholder="Introduza o email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Campo para introduzir email"
            />
            <div className="email-close-button">
              {emailSuccess && <p className="success-message">{emailSuccess}</p>}
              <button className="closee-button" onClick={onClose} aria-label="Fechar modal">
                Cancelar
              </button>
              <button className="email-button" onClick={shareByEmail} aria-label="Partilhar por email">
                Partilhar
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ShareHorse;
