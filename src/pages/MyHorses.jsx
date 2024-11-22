import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyHorses.css';

const MyHorses = () => {
  const [horses, setHorses] = useState([]);

  useEffect(() => {
    const fetchHorses = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar cavalos');
        }

        const data = await response.json();
        setHorses(data);
      } catch (error) {
        console.error('Erro ao buscar cavalos:', error);
      }
    };

    fetchHorses();
  }, []);

  return (
    <div className="my-horses-container">
      <div className="header">
        <h1 className="title">Meus Cavalos</h1>
        <Link to="/newhorse">
          <button className="create-button">+</button>
        </Link>
      </div>
      <div className="horses-list">
        {horses.map((horse) => (
          <div key={horse.id} className="horse-item">
            <Link to={`/horses/${horse.id}`}>
              <h2>{horse.name}</h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHorses;
