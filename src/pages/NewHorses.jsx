import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewHorses.css';

const NewHorses = () => {
  const [newHorse, setNewHorse] = useState({
    name: '',
    age: '',
    height_cm: 1.5, // Default value in meters
    description: '',
    gender: '',
    color: '',
    training_level: '',
    piroplasmosis: false,
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewHorse((prevHorse) => ({
      ...prevHorse,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleColorChange = (e) => {
    setNewHorse((prevHorse) => ({
      ...prevHorse,
      color: e.target.value,
    }));
  };

  const handleHeightChange = (e) => {
    const valueInMeters = parseFloat(e.target.value); // Mantém o valor em metros
    setNewHorse((prevHorse) => ({
      ...prevHorse,
      height_cm: valueInMeters,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB

    // Arquivos excedendo o tamanho permitido
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError('Cada imagem deve ter no máximo 10MB.');
      return;
    }

    // Checar se já existem arquivos no estado `images`
    const newFiles = files.filter(file =>
      !images.some(existingFile =>
        existingFile.name === file.name && existingFile.size === file.size
      )
    );

    // Verificar o limite de quantidade de arquivos (5)
    if (images.length + newFiles.length > 5) {
      setError('Você pode fazer upload de no máximo 5 imagens.');
    } else {
      // Atualizar o estado com novos arquivos únicos
      setImages(prevImages => [...prevImages, ...newFiles]);
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
    Object.keys(newHorse).forEach((key) => {
      formData.append(`horse[${key}]`, newHorse[key]);
    });
    images.forEach((image) => {
      formData.append('horse[images][]', image);
    });

    const response = await fetch('http://localhost:3000/api/v1/horses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      navigate('/myhorses');
    } else {
      console.error('Erro ao criar cavalo:', response.statusText);
    }
  };

  const heightInHH = (newHorse.height_cm / 0.1016).toFixed(1);

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

        {/* Altura com slider para metros e conversão para hh */}
        <label className="new-input-label">Altura</label>
        <div className="height-slider-container">
          <div className="height-values">
            <span>{newHorse.height_cm} m</span>
            <span>({heightInHH} hh)</span>
          </div>
          <input
            type="range"
            name="height_m"
            min="0.5"
            max="2.5"
            step="0.01"
            value={newHorse.height_cm}
            onChange={handleHeightChange}
            className="slider"
          />
        </div>


        <label className="new-input-label">Gênero</label>
        <select name="gender" value={newHorse.gender} onChange={handleChange} required>
          <option value="">Selecione</option>
          <option value="gelding">Castrado</option>
          <option value="mare">Égua</option>
          <option value="stallion">Garanhão</option>
        </select>

        <label className="new-input-label">Cor</label>
        <div className="color-options">
          {['Baio', 'Castanho', 'Alazão', 'Preto', 'Tordilho', 'Ruão', 'Palomino', 'Isabel', 'Ruço'].map((colorOption) => (
            <label key={colorOption} className={`color-option ${newHorse.color === colorOption ? 'selected' : ''}`}>
              <input
                type="radio"
                name="color"
                value={colorOption}
                checked={newHorse.color === colorOption}
                onChange={handleColorChange}
              />
              {colorOption}
            </label>
          ))}
        </div>

        <label className="new-input-label">Nível de Treinamento</label>
        <input
          type="text"
          name="training_level"
          placeholder="Ex: Preliminar, Grand Prix, 1.45m"
          value={newHorse.training_level}
          onChange={handleChange}
        />

        <label className="new-input-label-piro">
          Piroplasmose
          <input
            type="checkbox"
            name="piroplasmosis"
            checked={newHorse.piroplasmosis}
            onChange={handleChange}
          />
        </label>

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
