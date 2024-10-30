import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyHorses.css'; // Importa o CSS externo

const MyHorses = () => {
  const [horses, setHorses] = useState([]); // Inicializa como um array vazio

  useEffect(() => {
    const fetchHorses = async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/v1/horses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data); // Adiciona um console log para verificar a resposta
      setHorses(data);
    };

    fetchHorses();
  }, []);

  return (
    <div className="horses-container">
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
  );
};

export default MyHorses;
