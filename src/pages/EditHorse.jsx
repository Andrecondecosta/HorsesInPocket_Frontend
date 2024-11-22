import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditHorse.css';
import GenealogyForm from '../components/GenealogyForm';

const EditHorse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const [horse, setHorse] = useState({
    name: '',
    age: '',
    height_cm: 1.5,
    description: '',
    gender: '',
    color: '',
    training_level: '',
    piroplasmosis: false,
    images: [],
    videos: [],
  });
  const [ancestors, setAncestors] = useState({
    father: {},
    mother: {},
    paternal_grandfather: {},
    paternal_grandmother: {},
    maternal_grandfather: {},
    maternal_grandmother: {},
  });
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [deletedVideos, setDeletedVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHorse = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/horses/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setHorse(data);
          const loadedAncestors = {};
          data.ancestors.forEach((ancestor) => {
            loadedAncestors[ancestor.relation_type] = ancestor;
          });
          setAncestors(loadedAncestors);
        } else {
          throw new Error('Erro ao carregar cavalo.');
        }
      } catch (error) {
        console.error(error);
        setError('Erro ao carregar cavalo.');
      }
    };

    fetchHorse();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHorse((prevHorse) => ({
      ...prevHorse,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleColorChange = (e) => {
    setHorse((prevHorse) => ({
      ...prevHorse,
      color: e.target.value,
    }));
  };

  const handleHeightChange = (e) => {
    const valueInMeters = parseFloat(e.target.value);
    setHorse((prevHorse) => ({
      ...prevHorse,
      height_cm: valueInMeters,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB

    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError('Cada imagem deve ter no máximo 10MB.');
      return;
    }

    const newFiles = files.filter(file =>
      !newImages.some(existingFile =>
        existingFile.name === file.name && existingFile.size === file.size
      )
    );

    if (newImages.length + newFiles.length > 5) {
      setError('Você pode fazer upload de no máximo 5 imagens.');
    } else {
      setNewImages((prevImages) => [...prevImages, ...newFiles]);
      setError(null);
    }
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 50 * 1024 * 1024; // 50MB por vídeo

    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError('Cada vídeo deve ter no máximo 50MB.');
      return;
    }

    const newVideos = files.filter(file =>
      !newVideos.some(existingFile =>
        existingFile.name === file.name && existingFile.size === file.size
      )
    );

    if (newVideos.length + newVideos.length > 3) {
      setError('Você pode fazer upload de no máximo 3 vídeos.');
    } else {
      setNewVideos((prevVideos) => [...prevVideos, ...newVideos]);
      setError(null);
    }
  };

  const removeImage = (indexToRemove) => {
    setNewImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const removeVideo = (indexToRemove) => {
    setNewVideos((prevVideos) => prevVideos.filter((_, index) => index !== indexToRemove));
  };

  const handleDeleteExistingImage = (imageUrl) => {
    setHorse((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageUrl),
    }));
    setDeletedImages((prev) => [...prev, imageUrl]);
  };

  const handleDeleteExistingVideo = (videoUrl) => {
    setHorse((prev) => ({
      ...prev,
      videos: prev.videos.filter((vid) => vid !== videoUrl),
    }));
    setDeletedVideos((prev) => [...prev, videoUrl]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('horse[name]', horse.name);
    formData.append('horse[age]', horse.age);
    formData.append('horse[height_cm]', horse.height_cm);
    formData.append('horse[description]', horse.description);
    formData.append('horse[gender]', horse.gender);
    formData.append('horse[color]', horse.color);
    formData.append('horse[training_level]', horse.training_level);
    formData.append('horse[piroplasmosis]', horse.piroplasmosis);

    Object.keys(ancestors).forEach((relation) => {
      const ancestor = ancestors[relation];
      formData.append(`horse[ancestors_attributes][][relation_type]`, relation);
      formData.append(`horse[ancestors_attributes][][name]`, ancestor.name || '');
      formData.append(`horse[ancestors_attributes][][breeder]`, ancestor.breeder || '');
      formData.append(`horse[ancestors_attributes][][breed]`, ancestor.breed || '');
    });

    newImages.forEach((image) => {
      formData.append('horse[images][]', image);
    });

    newVideos.forEach((video) => {
      formData.append('horse[videos][]', video);
    });

    deletedImages.forEach((imageUrl) => {
      formData.append('deleted_images[]', imageUrl);
    });

    deletedVideos.forEach((videoUrl) => {
      formData.append('deleted_videos[]', videoUrl);
    });

    try {
      const response = await fetch(`http://localhost:3000/api/v1/horses/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate(`/horses/${id}`);
      } else {
        throw new Error('Erro ao atualizar cavalo.');
      }
    } catch (error) {
      console.error(error);
      setError('Erro ao atualizar cavalo.');
    }
  };

  // Remover a definição da variável heightInHH se não for necessária
  // const heightInHH = (horse.height_cm / 0.1016).toFixed(1);

  return (
    <div className="edit-horse-container">
      <h1 className="edit-horse-title">Editar Cavalo</h1>
      <form className="edit-horse-form" onSubmit={handleSubmit}>
        <label className="edit-input-label">Nome</label>
        <input
          type="text"
          name="name"
          value={horse.name}
          onChange={handleChange}
          required
        />

        <label className="edit-input-label">Idade</label>
        <input
          type="number"
          name="age"
          value={horse.age}
          onChange={handleChange}
          required
        />

        {/* Altura */}
        <label className="edit-input-label">Altura (m)</label>
        <input
          type="number"
          name="height_cm"
          step="0.01"
          value={horse.height_cm}
          onChange={handleHeightChange}
          required
        />

        <label className="edit-input-label">Descrição</label>
        <textarea
          name="description"
          value={horse.description}
          onChange={handleChange}
          required
        />

        <label className="edit-input-label">Gênero</label>
        <select name="gender" value={horse.gender} onChange={handleChange} required>
          <option value="">Selecione</option>
          <option value="gelding">Castrado</option>
          <option value="mare">Égua</option>
          <option value="stallion">Garanhão</option>
        </select>

        <label className="edit-input-label">Cor</label>
        <div className="color-options">
          {['Baio', 'Castanho', 'Alazão', 'Preto', 'Tordilho', 'Ruão', 'Palomino', 'Isabel', 'Ruço'].map((colorOption) => (
            <label key={colorOption} className={`color-option ${horse.color === colorOption ? 'selected' : ''}`}>
              <input
                type="radio"
                name="color"
                value={colorOption}
                checked={horse.color === colorOption}
                onChange={handleColorChange}
              />
              {colorOption}
            </label>
          ))}
        </div>

        <label className="edit-input-label">Nível de Treinamento</label>
        <input
          type="text"
          name="training_level"
          placeholder="Ex: Preliminar, Grand Prix, 1.45m"
          value={horse.training_level}
          onChange={handleChange}
        />

        <label className="edit-input-label-piro">
          Piroplasmose
          <input
            type="checkbox"
            name="piroplasmosis"
            checked={horse.piroplasmosis}
            onChange={handleChange}
          />
        </label>

        <label className="edit-input-label">Imagens (até 5, máximo 10MB cada)</label>
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
          {horse.images.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={image} alt={`Imagem ${index}`} />
              <button
                type="button"
                onClick={() => handleDeleteExistingImage(image)}
              >
                ✕
              </button>
            </div>
          ))}
          {newImages.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={URL.createObjectURL(image)} alt="Nova imagem" />
              <button
                type="button"
                onClick={() => removeImage(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <label className="edit-input-label">Vídeos (até 3, máximo 50MB cada)</label>
        <input
          type="file"
          accept="video/mp4,video/x-m4v,video/*"
          multiple
          onChange={handleVideoChange}
        />
        {horse.videos.map((video, index) => (
          <div key={index} className="video-preview">
            <video controls width="200">
              <source src={video} type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
            <button
              type="button"
              onClick={() => handleDeleteExistingVideo(video)}
            >
              ✕
            </button>
          </div>
        ))}
        {newVideos.map((video, index) => (
          <div key={index} className="video-preview">
            <video controls width="200">
              <source src={URL.createObjectURL(video)} type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
            <button
              type="button"
              onClick={() => removeVideo(index)}
            >
              ✕
            </button>
          </div>
        ))}

        {/* Genealogia */}
        <GenealogyForm ancestors={ancestors} setAncestors={setAncestors} />

        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="edit-horse-submit-button">
          Atualizar Cavalo
        </button>
      </form>
    </div>
  );
};

export default EditHorse;
