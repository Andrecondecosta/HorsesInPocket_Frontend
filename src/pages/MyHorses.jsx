import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyHorses.css';
import Layout from '../components/Layout';

const MyHorses = ({ setIsLoggedIn }) => {
  const [horses, setHorses] = useState([]);
  console.log('API URL:', process.env.REACT_APP_API_SERVER_URL);
  const token = localStorage.getItem('authToken');

 useEffect(() => {
    const fetchHorses = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar dados');
        }

        const data = await response.json();
        setHorses(data);
      } catch (err) {
        console.error('Erro ao carregar cavalos:', err);
      }
    };

    fetchHorses();
  }, [token]);

  return (
    <Layout setIsLoggedIn={setIsLoggedIn}>
    <div className="my-horses-container">
      <div className="header">
        <h1 className="title">Meus Cavalos</h1>
        <Link to="/newhorse">
          <button className="create-button">+</button>
        </Link>
      </div>
      <div className="horses-grid">
        {Array.isArray(horses) && horses.map((horse) => (
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
    </Layout>
  );
};

export default MyHorses;
