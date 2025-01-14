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

  // Generate the share link
  useEffect(() => {
    const generateShareLink = async () => {
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
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate share link');
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

  // Function to share via email
  const shareByEmail = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
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
        throw new Error(errorData.error || 'Failed to share via email');
      }

      setEmailSuccess(`Horse successfully shared with ${email}`);
      setEmail('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* Dark gray background */}
      <div className="modal-overlay"></div>

      {/* Share modal */}
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
                  aria-label="Copy share link"
                >
                  <FaLink /> Copy Link
                </button>
                <button
                  className="whatsapp-button"
                  onClick={() =>
                    window.open(`https://wa.me/?text=${encodeURIComponent(shareLink)}`, '_blank')
                  }
                  aria-label="Share on WhatsApp"
                >
                  <FaWhatsapp /> WhatsApp
                </button>
              </div>
            </div>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email input field"
            />
            <div className="email-close-button">
              {emailSuccess && <p className="success-message">{emailSuccess}</p>}
              <button className="close-button" onClick={onClose} aria-label="Close modal">
                Cancel
              </button>
              <button className="email-button" onClick={shareByEmail} aria-label="Share via email">
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
