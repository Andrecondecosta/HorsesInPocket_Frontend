import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SharedHorse = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedHorse = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_SERVER_URL}/horses/shared/${token}`,
          {
            headers: {
              'Authorization': `Bearer ${authToken || ''}`,
            },
          }
        );

        if (response.status === 401) {
          navigate(`/login?redirect=/horses/shared/${token}`);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao carregar cavalo partilhado');
        }

        const horseData = await response.json();
        setHorse(horseData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSharedHorse();
  }, [token, authToken, navigate]);

  if (error) return <p>{error}</p>;
  return <p>A processar o link...</p>;
};

export default SharedHorse;
