import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import './ProfileHorse.css';

const ProfileHorse = () => {
  const { id } = useParams();
  const [horse, setHorse] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

        if (!response.ok) {
          throw new Error('Failed to fetch horse');
        }

        const data = await response.json();
        setHorse(data);
        setSelectedImage(0); // Define o índice da primeira imagem como padrão
      } catch (error) {
        setError('Erro ao carregar perfil do cavalo');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchHorse();
    } else {
      setError('Token não encontrado');
      setIsLoading(false);
    }
  }, [id, token]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/horses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete horse');
      }

      navigate('/myhorses');
    } catch (error) {
      setError('Erro ao deletar cavalo');
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{horse.name}</h1>
        <div className="profile-actions">
          <FaEdit className="profile-icon" onClick={() => navigate(`/horses/${id}/edit`)} />
          <FaTrash className="profile-icon" onClick={handleDelete} />
        </div>
      </div>
      {horse && (
        <div className="profile-details">
          {/* Imagem principal e miniaturas */}
          <div className="profile-image-gallery">
            <div className="profile-main-image" onClick={() => setIsOpen(true)}>
              <img
                src={horse.images[selectedImage]}
                alt={`${horse.name} - principal`}
                className="fixed-main-image"
              />
            </div>
            <div className="profile-thumbnail-row">
              {horse.images.slice(0, 5).map((image, index) => (
                <div key={index} className="profile-thumbnail">
                  <img
                    src={image}
                    alt={`${horse.name} ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    className={selectedImage === index ? 'active-thumbnail' : ''}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Lightbox de visualização em tela cheia */}
          {isOpen && (
            <Lightbox
              open={isOpen}
              close={() => setIsOpen(false)}
              slides={horse.images.map((image) => ({ src: image }))}
              currentIndex={selectedImage}
              onIndexChange={(index) => setSelectedImage(index)}
            />
          )}

          {/* Informações do cavalo */}
          <div className="profile-info">
            <p><strong>Nome:</strong> {horse.name}</p>
            <p><strong>Idade:</strong> {horse.age}</p>
            <p><strong>Descrição:</strong> {horse.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHorse;
