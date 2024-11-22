import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import './ProfileHorse.css';
import GenealogyTree from '../components/GenealogyTree';

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
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${id}`, {
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
        setSelectedImage(0);
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
      const response = await fetch(`https://horsesinpocket-backend-2.onrender.com/api/v1/horses/${id}`, {
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

  const heightInHH = (horse.height_cm / 0.1016).toFixed(1);

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
          {/* Galeria de imagens */}
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

          {/* Lightbox */}
          {isOpen && (
            <Lightbox
              open={isOpen}
              close={() => setIsOpen(false)}
              slides={horse.images.map((image) => ({ src: image }))}
              currentIndex={selectedImage}
              onIndexChange={(index) => setSelectedImage(index)}
            />
          )}
          <div className="profile-details">
            <div className="info-and-videos">
              {/* Informações do cavalo */}
              <div className="profile-info-card">
                <h2 className="info-card-title">Informações do Cavalo</h2>
                <div className="profile-info-content">
                  <p><strong>Nome:</strong> {horse.name}</p>
                  <p><strong>Idade:</strong> {horse.age} anos</p>
                  <p><strong>Altura:</strong> {horse.height_cm} m ({heightInHH} hh)</p>
                  <p><strong>Gênero:</strong> {horse.gender}</p>
                  <p><strong>Cor:</strong> {horse.color}</p>
                  <p><strong>Nível de Treinamento:</strong> {horse.training_level}</p>
                  <p><strong>Piroplasmose:</strong> {horse.piroplasmosis ? 'Sim' : 'Não'}</p>
                  <p><strong>Descrição:</strong> {horse.description}</p>
                </div>
              </div>
                {/* Vídeos do cavalo */}
                <div className="profile-videos">
                  {horse.videos && horse.videos.length > 0 ? (
                    horse.videos.map((video, index) => (
                      <div key={index} className="video-container">
                        <video controls>
                        <source src={video} type="video/mp4" /> {/* Use `video` diretamente, pois é o URL */}
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                      </div>
                    ))
                  ) : (
                    <p>Sem vídeos disponíveis.</p>
                  )}
                </div>
            </div>
          </div>
          <GenealogyTree horse={horse} />
        </div>
      )}
    </div>
  );
};

export default ProfileHorse;
