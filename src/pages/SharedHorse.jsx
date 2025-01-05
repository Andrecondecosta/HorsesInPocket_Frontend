import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SharedHorse = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [horse, setHorse] = useState(null);

  useEffect(() => {
    const fetchSharedHorse = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Redireciona para login com o token do link
        navigate(`/login?redirect=/horses/shared/${token}`);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/shared/${token}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao carregar cavalo partilhado');
        }

        const data = await response.json();
        setHorse(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSharedHorse();
  }, [navigate, token]);

  if (error) return <p>{error}</p>;
  if (!horse) return <p>Carregando...</p>;

  return (
    <div>
      <h1>{horse.name}</h1>
      <p>{horse.description}</p>
      <p>Altura: {horse.height_cm}m</p>
      {/* Outros detalhes do cavalo */}
    </div>
  );
};

export default SharedHorse;
