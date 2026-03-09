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
          throw new Error('Error loading horse data.');
        }

        const data = await response.json();

        // ✅ Ensure that images are loaded correctly
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
          throw new Error('Error generating share link.');
        }

        const data = await response.json();

        // 🔗 Creating the URL with the horse image and name
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

  // 🔹 Share by email
  const shareByEmail = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email.');
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
        throw new Error(errorData.error || 'Error sharing via email.');
      }

      setEmailSuccess(`Horse successfully shared with ${email}`);
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
          <p>Generating share link...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <div className="share-header">
              <h2>Share Horse</h2>
              <div className="share-options">
                <button
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    alert('Link copied!');
                  }}
                >
                  <FaLink /> Copy Link
                </button>
                <button
                  className="whatsapp-button"
                  onClick={() =>
                    window.open(
                      `https://wa.me/?text=*${horse?.name}* has been shared with you!%0A🔗 ${encodeURIComponent(
                        shareLink
                      )}`,
                      '_blank'
                    )
                  }
                >
                  <FaWhatsapp /> WhatsApp
                </button>
              </div>
            </div>

            {/* 🔹 Field to send via email */}
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="email-close-button">
              {emailSuccess && <p className="success-message">{emailSuccess}</p>}
              <button className="close-button" onClick={onClose}>
                Cancel
              </button>
              <button className="email-button" onClick={shareByEmail}>
                Share
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ShareHorse;
