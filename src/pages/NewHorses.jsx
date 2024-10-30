import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewHorses.css';

const NewHorses = () => {
  const [newHorse, setNewHorse] = useState({
    name: '',
    age: '',
    description: ''
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewHorse((prevHorse) => ({
      ...prevHorse,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (images.length + files.length > 5) {
      setError('Você pode fazer upload de no máximo 5 imagens.');
    } else if (oversizedFiles.length > 0) {
      setError('Cada imagem deve ter no máximo 10MB.');
    } else {
      setImages((prevImages) => [...prevImages, ...files]);
      setError(null);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('horse[name]', newHorse.name);
    formData.append('horse[age]', newHorse.age);
    formData.append('horse[description]', newHorse.description);

    images.forEach((image) => {
      formData.append('horse[images][]', image);
    });

    const response = await fetch('http://localhost:3000/api/v1/horses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      navigate('/myhorses');
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

        <label className="new-input-label">Idade</label>
        <input
          type="number"
          name="age"
          placeholder="Idade"
          value={newHorse.age}
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

        <label className="new-input-label">Imagens (até 5, máximo 10MB cada)</label>
        <div className="upload-button" onClick={() => document.getElementById('fileInput').click()}>
          Selecionar Imagens
        </div>
        <input
          type="file"
          id="fileInput"
          multiple
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        {error && <p className="error-message">{error}</p>}

        <div className="image-preview-container">
          {images.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
              <button className="remove-image-button" onClick={() => removeImage(index)}>X</button>
            </div>
          ))}
        </div>

        <button type="submit" className="new-horse-submit-button">Criar Cavalo</button>
      </form>
    </div>
  );
};

export default NewHorses;
