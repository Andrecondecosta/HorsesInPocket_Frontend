import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditHorse.css';

const EditHorse = () => {
  const { id } = useParams();
  const [horse, setHorse] = useState({
    name: '',
    age: '',
    description: '',
    images: [], // URLs das imagens existentes
  });
  const [newImages, setNewImages] = useState([]); // Novas imagens selecionadas
  const [deletedImages, setDeletedImages] = useState([]); // Imagens a excluir
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchHorse = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/horses/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setHorse(data);
        } else {
          console.error('Erro ao carregar perfil do cavalo');
        }
      } catch (error) {
        console.error('Erro ao carregar perfil do cavalo:', error);
      }
    };

    fetchHorse();
  }, [id, token]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleDeleteExistingImage = (imageUrl) => {
    setHorse((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageUrl),
    }));
    setDeletedImages((prev) => [...prev, imageUrl]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('horse[name]', horse.name);
    formData.append('horse[age]', horse.age);
    formData.append('horse[description]', horse.description);

    newImages.forEach((image) => {
      formData.append('horse[images][]', image);
    });

    deletedImages.forEach((imageUrl) => {
      formData.append('deleted_images[]', imageUrl);
    });

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
      console.error('Erro ao atualizar cavalo:', response.statusText);
    }
  };

  return (
    <div className="edit-horse-container">
      <h1 className="edit-horse-title">Editar Cavalo</h1>
      <form className="edit-horse-form" onSubmit={handleSubmit}>
        <label className="edit-input-label">Nome</label>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={horse.name}
          onChange={(e) => setHorse({ ...horse, name: e.target.value })}
          required
        />

        <label className="edit-input-label">Idade</label>
        <input
          type="number"
          name="age"
          placeholder="Idade"
          value={horse.age}
          onChange={(e) => setHorse({ ...horse, age: e.target.value })}
          required
        />

        <label className="edit-input-label">Descrição</label>
        <textarea
          name="description"
          placeholder="Descrição"
          value={horse.description}
          onChange={(e) => setHorse({ ...horse, description: e.target.value })}
          required
        />

        <label className="edit-input-label">Imagens</label>
        <input type="file" multiple onChange={handleImageChange} />

        <div className="image-preview-container">
          {horse.images.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={image} alt="Imagem do cavalo" />
              <button type="button" onClick={() => handleDeleteExistingImage(image)}>✕</button>
            </div>
          ))}
          {newImages.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={URL.createObjectURL(image)} alt="Nova imagem" />
            </div>
          ))}
        </div>

        <button type="submit" className="edit-horse-submit-button">Atualizar Cavalo</button>
      </form>
    </div>
  );
};

export default EditHorse;
