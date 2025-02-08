import React, { useEffect, useState } from 'react';
import { FaWhatsapp, FaLink } from 'react-icons/fa';
import './ShareHorse.css';

const ShareHorse = ({ horseId, onClose }) => {
  const [shareLink, setShareLink] = useState('');
  const [horse, setHorse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(null);


  const token = localStorage.getItem('authToken');
  const API_URL = process.env.REACT_APP_API_SERVER_URL;

  useEffect(() => {
    const fetchHorseData = async () => {
      try {
        const response = await fetch(`${API_URL}/horses/${horseId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar os dados do cavalo.');
        }

        const data = await response.json();

        // ✅ Garante que as imagens vêm corretamente
        const horseImageUrl = data.images?.length > 0 ? data.images[0] : '';

        setHorse({ ...data, imageUrl: horseImageUrl });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchHorseData();
  }, [horseId, API_URL, token]);

  useEffect(() => {
    const generateShareLink = async () => {
      if (!horse) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/horses/${horseId}/share_via_link`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ expires_at: null }),
        });

        if (!response.ok) {
          throw new Error('Erro ao gerar o link de compartilhamento.');
        }

        const data = await response.json();

        // 🔗 Criando a URL com a imagem e nome do cavalo
        const horseImage = encodeURIComponent(horse.imageUrl || '');
        const horseName = encodeURIComponent(horse.name || '');
        const fullShareLink = `${data.link}&horseImage=${horseImage}&horseName=${horseName}`;

        setShareLink(fullShareLink);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (horse) {
      generateShareLink();
    }
  }, [horse, horseId, API_URL, token]);

  // 🔹 Compartilhar por email
  const shareByEmail = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Digite um email válido.');
      return;
    }

    setEmailSuccess(null);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/horses/${horseId}/share_via_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao compartilhar via email.');
      }

      setEmailSuccess(`Cavalo compartilhado com sucesso com ${email}`);
      setEmail('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="modal-overlay"></div>

      <div className="share-modal">
        {isLoading ? (
          <p>Gerando link de compartilhamento...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <div className="share-header">
              <h2>Compartilhar Cavalo</h2>
              <div className="share-options">
                <button
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    alert('Link copiado!');
                  }}
                >
                  <FaLink /> Copiar Link
                </button>
                <button
                  className="whatsapp-button"
                  onClick={() =>
                    window.open(`https://wa.me/?text=*${horse?.name}* foi compartilhado com você!%0A🔗 ${encodeURIComponent(shareLink)}`, '_blank')
                  }
                >
                  <FaWhatsapp /> WhatsApp
                </button>
              </div>
            </div>

            {/* 🔹 Campo para enviar por email */}
            <input
              type="email"
              placeholder="Digite o email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="email-close-button">
              {emailSuccess && <p className="success-message">{emailSuccess}</p>}
              <button className="close-button" onClick={onClose}>Cancelar</button>
              <button className="email-button" onClick={shareByEmail}>Compartilhar</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ShareHorse;
