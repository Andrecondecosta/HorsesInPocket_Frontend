import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SharedHorse = () => {
  const { token } = useParams(); // Capture the token from the URL
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSharedLink = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Redirect to login if not authenticated
        navigate(`/login?redirect=/horses/shared/${token}`);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_SERVER_URL}/horses/shared/${token}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to process the link.');
        }

        // Redirect to the "received" page on success
        navigate('/received');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    handleSharedLink();
  }, [token, navigate]);

  if (loading) return <p>Processing the link...</p>;
  if (error) return <p className="error-message">{error}</p>;
  return null;
};

export default SharedHorse;
