import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditHorse.css';

const EditHorse = () => {
  const { id } = useParams();
  const [horse, setHorse] = useState({
    name: '',
    age: '',
    description: '',
    images: []
  });
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [error, setError] = useState(null);
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
          throw new Error('Erro ao carregar perfil do cavalo');
        }
      } catch (error) {
        console.error(error);
        setError('Erro ao carregar perfil do cavalo');
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

  const handleDeleteNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('horse[name]', horse.name);
    formData.append('horse[age]', horse.age);
    formData.append('horse[description]', horse.description);

    // Adiciona novas imagens selecionadas
    newImages.forEach((image) => {
      formData.append('horse[images][]', image);
    });

    // Adiciona URLs das imagens a serem excluídas
    deletedImages.forEach((imageUrl) => {
      formData.append('deleted_images[]', imageUrl);
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
        setError('Erro ao atualizar cavalo');
        console.error('Erro ao atualizar cavalo:', response.statusText);
      }
    } catch (err) {
      setError('Erro ao atualizar cavalo');
      console.error(err);
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
          {/* Mostra imagens existentes com opção de excluir */}
          {horse.images.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={image} alt="Imagem do cavalo" />
              <button
                type="button"
                className="remove-image-button"
                onClick={() => handleDeleteExistingImage(image)}
              >
                ✕
              </button>
            </div>
          ))}
          {/* Mostra novas imagens selecionadas */}
          {newImages.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={URL.createObjectURL(image)} alt="Nova imagem" />
              <button
                type="button"
                className="remove-image-button"
                onClick={() => handleDeleteNewImage(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="edit-horse-submit-button">
          Atualizar Cavalo
        </button>
      </form>
    </div>
  );
};

export default EditHorse;
