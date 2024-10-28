import React, { useState } from 'react';
import './NewHorses.css';

function NewHorses() {
  const [newHorse, setNewHorse] = useState({
    name: '',
    birthDate: '',
    description: ''
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewHorse((prevHorse) => ({
      ...prevHorse,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('horse[name]', newHorse.name);
    formData.append('horse[birthDate]', newHorse.birthDate);
    formData.append('horse[description]', newHorse.description);
    if (image) {
      formData.append('horse[image]', image);
    }

    const response = await fetch('http://localhost:3000/api/v1/horses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Cavalo criado com sucesso:', data);
      setNewHorse({ name: '', birthDate: '', description: '' });
      setImage(null);
    } else {
      console.error('Erro ao criar cavalo:', response.statusText);
    }
  };

  return (
    <div className="new-horse-container">
      <h1 className="new-horse-title">Criar Novo Cavalo</h1>
      <form className="new-horse-form" onSubmit={handleSubmit}>
        <label className="new-input-label">Nome</label>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={newHorse.name}
          onChange={handleChange}
          required
        />

        <label className="new-input-label">Data de Nascimento</label>
        <input
          type="date"
          name="birthDate"
          placeholder="Data de Nascimento"
          value={newHorse.birthDate}
          onChange={handleChange}
          required
        />

        <label className="new-input-label">Descrição</label>
        <textarea
          name="description"
          placeholder="Descrição"
          value={newHorse.description}
          onChange={handleChange}
          required
        />

        <label className="new-input-label">Imagem</label>
        <input type="file" onChange={handleImageChange} />

        <button type="submit" className="new-horse-submit-button">Criar Cavalo</button>
      </form>
    </div>
  );
}

export default NewHorses;
