import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewHorses.css';

const NewHorses = () => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('stallion');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ name, breed, age, gender }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors || 'Falha ao adicionar cavalo');
      }

      navigate('/myhorses');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-horses-container">
      <h1>Adicionar Novo Cavalo</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Raça:
          <input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            required
          />
        </label>
        <label>
          Idade:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </label>
        <label>
          Gênero:
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="stallion">Garanhão</option>
            <option value="mare">Égua</option>
            <option value="gelding">Castrado</option>
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Adicionando...' : 'Adicionar Cavalo'}
        </button>
      </form>
    </div>
  );
};

export default NewHorses;
