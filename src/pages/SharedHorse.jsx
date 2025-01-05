import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SharedHorse = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleSharedLink = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Redireciona para login com o token do link
        navigate(`/login?redirect=/horses/shared/${token}`);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_SERVER_URL}/horses/shared/${token}`,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao processar o link');
        }

        // Redireciona para página de recebidos após sucesso
        navigate('/received');
      } catch (err) {
        setError(err.message);
      }
    };

    handleSharedLink();
  }, [token, navigate]);

  if (error) return <p>{error}</p>;
  return <p>A processar o link...</p>;
};

export default SharedHorse;
