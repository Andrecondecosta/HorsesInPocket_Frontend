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
import SubscriptionPlans from '../components/SubscriptionPlans';
import SavePaymentMethod from '../components/SavePaymentMethod';
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isOwner, setIsOwner] = useState(false);
  const [userStatus, setUserStatus] = useState(null);
  const [showLimitPopup, setShowLimitPopup] = useState(false);



  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const fetchUserStatus = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/user_status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao carregar status do usuário");

      const data = await response.json();
      setUserStatus(data);
      console.log("✅ userStatus carregado:", data);
    } catch (error) {
      console.error("❌ Erro ao buscar status do usuário:", error);
    }
  };

  useEffect(() => {
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
        setIsOwner(data.is_owner);
        setSelectedImage(0);
      } catch (error) {
        setError('Failed to load horse profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchHorse();
      fetchUserStatus();
    } else {
      setError('Token not found');
      setIsLoading(false);
    }
  }, [id, location.search, token]);


  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
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

  const handleDelete = async (deleteType) => {
    try {
      const endpoint =
        deleteType === "destroy"
          ? `/horses/${id}`
          : `/horses/${id}/delete_shares`;

      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setDeleteMessage(
          deleteType === "destroy"
            ? "Horse deleted for everyone!"
            : "Subsequent shares removed successfully!"
        );
        setTimeout(() => {
          setDeleteMessage("");
          setShowDeleteModal(false);
          if (deleteType === "destroy") navigate("/myhorses");
        }, 5000);
      } else {
        throw new Error("Error performing operation");
      }
    } catch (error) {
      console.error("Error:", error);
      setDeleteMessage("Error performing operation. Please try again.");
    }
  };

  if (isLoading) return <LoadingPopup message="Loading..." />;
  if (error) return <p>{error}</p>;

  const heightInHH = (horse.height_cm / 0.1016).toFixed(1);

  const handleShareClick = () => {
    if (!userStatus) {
      console.error("❌ userStatus ainda não carregado!");
      return;
    }

    if (userStatus.used_shares >= userStatus.max_shares) {
      console.warn("🚨 Limite de partilhas atingido! Exibindo popup.");
      setShowLimitPopup(true);
    } else {
      setShowShareModal(true);
    }
  };

  return (
    <Layout setIsLoggedIn={setIsLoggedIn}>
      <div className="profile-container">
        {/* Header with title and buttons */}
        <div className="profile-header">
          {/* Breadcrumbs */}
          <div className="breadcrumbs">
            <a href="/dashboard">Dashboard</a> / <a href="/myhorses">My Horses</a> /{" "}
            <span>Horse Information</span>
          </div>

          {/* Buttons for Desktop */}
          <div className="profile-actions desktop-only">
            {isOwner && (
              <button className="edit-button" onClick={() => navigate(`/horses/${id}/edit`)}>
                <FaEdit /> Edit
              </button>
            )}
            <button className="delete-button" onClick={() => setShowDeleteModal(true)}>
              <FaTrash /> Delete
            </button>
            <button className="share-button" onClick={handleShareClick}>
              <FaShareAlt /> Share
            </button>
          </div>

          {/* Three-dot menu for Mobile */}
          <div className="mobile-menu mobile-only" ref={menuRef}>
            {isOwner && (
              <button className="edit-button" onClick={() => navigate(`/horses/${id}/edit`)}>
                <FaEdit />
              </button>
            )}
            <button className="delete-button" onClick={() => setShowDeleteModal(true)}>
              <FaTrash />
            </button>
            <button className="share-button" onClick={handleShareClick}>
              <FaShareAlt />
            </button>
          </div>
        </div>

        <div className="horse-info-section">
          <h2 className="section-title">Specific Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <strong>Horse Name</strong>
              <p>{horse.name}</p>
            </div>
            <div className="info-item">
              <strong>Year of Birth</strong>
              <p>{horse.age}</p>
            </div>
            <div className="info-item">
              <strong>Gender</strong>
              <p>{horse.gender}</p>
            </div>
            <div className="info-item">
              <strong>Color</strong>
              <p>{horse.color}</p>
            </div>
            <div className="info-item">
              <strong>Height</strong>
              <p>{horse.height_cm} m ({heightInHH} hh)</p>
            </div>
            <div className="info-item">
              <strong>Piroplasmosis</strong>
              <p>{horse.piroplasmosis ? 'Yes' : 'No'}</p>
            </div>
            <div className="info-item">
              <strong>Breed</strong>
              <p>{horse.breed || "Not specified"}</p>
            </div>
            <div className="info-item">
              <strong>Breeder</strong>
              <p>{horse.breeder || "Not specified"}</p>
            </div>
            <div className="info-item">
              <strong>Training Level</strong>
              <p>{horse.training_level}</p>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <strong>Description</strong>
            <p>{horse.description}</p>
          </div>
        </div>


        {/* Images and Videos */}
        <div className="profile-gallery">
          <h2 className="section-title">Images and Videos</h2>
          <ProfileMedia images={horse.images} videos={horse.videos} />
        </div>

        {/* Genealogy */}
        <div className="genealogy-section">
          <h2 className="section-title-geno">Genealogy</h2>
          {hasAncestorsData(horse.ancestors) ? (
            <GenealogyTree horse={horse} />
          ) : (
            <p className="no-genealogy">No genealogy information available.</p>
          )}
        </div>

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Delete Horse</h3>
              <div className="delete-options">
                {!deleteMessage ? (
                  <>
                    <button
                      className="delete-option-button"
                      onClick={() => handleDelete("destroy")}
                    >
                      <FaTrash /> <p>Delete for Everyone</p>
                    </button>
                    <button
                      className="delete-option-button"
                      onClick={() => handleDelete("delete_shares")}
                    >
                      <FaTrash /> <p>Delete for Shared</p>
                    </button>
                    <button
                      className="modal-close"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <p className="delete-message">{deleteMessage}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <ShareHorse
            horseId={id}
            onClose={() => setShowShareModal(false)}
          />
        )}

         {/* Popup de Limite de Shares */}
         {showLimitPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <h3>🚨 Sharing Limit Reached!</h3>
                <p>You have reached the sharing limit of your plan. To continue sharing, please upgrade.</p>

                <div className="popup-buttons">
                  <button className="popup-btn secondary" onClick={() => setShowLimitPopup(false)}>OK</button>
                  <button className="popup-btn primary" onClick={() => navigate('/profile')}>
                    View My Plan
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Lightbox for image preview */}
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
