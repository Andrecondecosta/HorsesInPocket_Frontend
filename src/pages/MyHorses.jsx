import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyHorses.css';

const MyHorses = () => {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true); // Adicionado para feedback de carregamento
  const [error, setError] = useState(null); // Adicionado para tratar erros

  console.log('API URL:', process.env.REACT_APP_API_SERVER_URL);

  useEffect(() => {
    const fetchHorses = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }

        const data = await response.json();
        setHorses(data);
      } catch (err) {
        console.error('Erro ao carregar cavalos:', err);
        setError('Não foi possível carregar os cavalos. Tente novamente mais tarde.');
      } finally {
        setLoading(false); // Finaliza o carregamento, independentemente do resultado
      }
    };

    fetchHorses();
  }, []);

  if (loading) {
    return <div className="my-horses-container">Carregando...</div>;
  }

  if (error) {
    return <div className="my-horses-container">{error}</div>;
  }

  if (horses.length === 0) {
    return <div className="my-horses-container">Nenhum cavalo encontrado.</div>;
  }

  return (
    <div className="my-horses-container">
      <div className="header">
        <h1 className="title">Meus Cavalos</h1>
        <Link to="/newhorse">
          <button className="create-button">+</button>
        </Link>
      </div>
      <div className="horses-grid">
        {horses.map((horse) => (
          <Link to={`/horses/${horse.id}`} key={horse.id} className="horse-link">
            <div className="horse-card">
              {horse.images && horse.images.length > 0 && (
                <img src={horse.images[0]} alt={horse.name} className="horse-image" />
              )}
              <div className="horse-info">
                <h3 className="horse-name">{horse.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyHorses;
