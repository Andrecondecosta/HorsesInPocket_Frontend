import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaEdit, FaTrash, FaShareAlt } from 'react-icons/fa';
import Lightbox from "yet-another-react-lightbox";
import GenealogyTree from '../components/GenealogyTree';
import Layout from '../components/Layout';
import ProfileMedia from '../components/ProfileMedia';
import ShareHorse from '../components/ShareHorse';
import "yet-another-react-lightbox/styles.css";
import LoadingPopup from '../components/LoadingPopup';
import './ProfileHorse.css';

const ProfileHorse = ({ setIsLoggedIn }) => {
  const { id } = useParams();
  const location = useLocation();
  const [horse, setHorse] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readonly, setReadonly] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Adiciona o estado do menu
  const [isOwner, setIsOwner] = useState(false);


  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // Verifica se o parâmetro de consulta readonly está presente
    const queryParams = new URLSearchParams(location.search);
    setReadonly(queryParams.get('readonly') === 'true');

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
        setIsOwner(data.is_owner); // Define se o usuário é o dono
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
  }, [id, location.search, token]);

  const handleShare = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: shareEmail }),
      });

      if (!response.ok) {
        throw new Error('Erro ao compartilhar cavalo');
      }

      alert('Cavalo compartilhado com sucesso');
      setShareEmail('');
      setShowShareModal(false);
    } catch (error) {
      setError('Erro ao compartilhar cavalo');
    }
  };
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false); // Fecha o menu se clicar fora
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hasAncestorsData = (ancestors) => {
    return ancestors && ancestors.length > 0 && ancestors.some(
      (ancestor) =>
        ancestor.name?.trim() || ancestor.breeder?.trim() || ancestor.breed?.trim()
    );
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${id}`, {
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

  if (isLoading) return <LoadingPopup message="Carregando ..." />;
  if (error) return <p>{error}</p>;

  const heightInHH = (horse.height_cm / 0.1016).toFixed(1);

  return (
  <Layout setIsLoggedIn={setIsLoggedIn}>
    <div className="profile-container">
      {/* Cabeçalho com título e botões */}
      <div className="profile-header">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <a href="/dashboard">Dashboard</a> / <a href="/myhorses">Meus Cavalos</a> /{" "}
        <span>Informação do Cavalo</span>
      </div>

      {/* Botões para Desktop */}
      <div className="profile-actions desktop-only">
      {isOwner && (<button className="edit-button" onClick={() => navigate(`/horses/${id}/edit`)}>
          <FaEdit /> Editar
        </button> )}
        <button className="delete-button" onClick={handleDelete}>
          <FaTrash /> Eliminar
        </button>
        <button className="share-button" onClick={() => setShowShareModal(true)}>
          <FaShareAlt /> Partilhar
        </button>
      </div>

      {/* Menu de três pontos para Mobile */}
      <div className="mobile-menu mobile-only" ref={menuRef}>
      {isOwner && (<button className="edit-button" onClick={() => navigate(`/horses/${id}/edit`)}>
          <FaEdit />
        </button> )}
        <button className="delete-button" onClick={handleDelete}>
          <FaTrash />
        </button>
        <button className="share-button" onClick={() => setShowShareModal(true)}>
          <FaShareAlt />
        </button>
      </div>
    </div>


      <div className="horse-info-section">
      <h2 className="section-title">Informação Específica</h2>
      <div className="info-grid">
        <div className="info-item">
          <strong>Nome do Cavalo</strong>
          <p>{horse.name}</p>
        </div>
        <div className="info-item">
          <strong>Idade</strong>
          <p>{horse.age} anos</p>
        </div>
        <div className="info-item">
          <strong>Gênero</strong>
          <p>{horse.gender}</p>
        </div>
        <div className="info-item">
          <strong>Cor</strong>
          <p>{horse.color}</p>
        </div>
        <div className="info-item">
          <strong>Altura</strong>
          <p>{horse.height_cm} m ({heightInHH} hh)</p>
        </div>
        <div className="info-item">
          <strong>Piroplasmosis</strong>
          <p>{horse.piroplasmosis ? 'Sim' : 'Não'}</p>
        </div>
        <div className="info-item">
          <strong>Nível de Treinamento</strong>
          <p>{horse.training_level}</p>
        </div>
      </div>

      {/* Descrição */}
      <div className="description-section">
        <strong>Descrição</strong>
        <p>{horse.description}</p>
      </div>
    </div>


      {/* Imagens e Vídeos */}
      <div className="profile-gallery">
        <h2 className="section-title">Imagens e Vídeos</h2>
        <ProfileMedia images={horse.images} videos={horse.videos} />
      </div>

      {/* Genealogia */}
      <div className="genealogy-section">
        <h2 className="section-title-geno">Genealogia</h2>
      {hasAncestorsData(horse.ancestors) ? (
        <GenealogyTree horse={horse} />
      ) : (
        <p className="no-genealogy">Sem informações genealógicas disponíveis.</p>
      )}
      </div>

      {/* Modal de Compartilhar */}
      {showShareModal && (
        <ShareHorse
          horseId={id}
          onClose={() => setShowShareModal(false)}
        />
      )}
      {/* Lightbox para visualização de imagens */}
      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={horse.images.map((image) => ({ src: image }))}
          currentIndex={selectedImage}
          onIndexChange={(index) => setSelectedImage(index)}
        />
      )}
    </div>
  </Layout>
);

};

export default ProfileHorse;
