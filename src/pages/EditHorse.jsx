import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import GenealogyForm from '../components/GenealogyForm';
import LoadingPopup from '../components/LoadingPopup';
import '../pages/EditHorse.css';

const EditHorse = ({ setIsLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [horse, setHorse] = useState({
    name: '',
    age: '',
    height_cm: 1.5,
    description: '',
    gender: '',
    color: '',
    training_level: '',
    piroplasmosis: false,
  });
  const [ancestors, setAncestors] = useState({
    father: {},
    mother: {},
    paternal_grandfather: {},
    paternal_grandmother: {},
    maternal_grandfather: {},
    maternal_grandmother: {},
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedVideos, setDeletedVideos] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);

  useEffect(() => {
    const fetchHorse = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load horse data');
        }

        const horseData = await response.json();
        setHorse(horseData);

        setExistingVideos(horseData.videos || []);

        if (Array.isArray(horseData.images)) {
          setImages(horseData.images);
        }

        if (Array.isArray(horseData.videos)) {
          setVideos(horseData.videos);
        }

        const loadedAncestors = {};
        horseData.ancestors?.forEach((ancestor) => {
          loadedAncestors[ancestor.relation_type] = ancestor;
        });
        setAncestors(loadedAncestors);

      } catch (error) {
        console.error('Error loading horse data:', error);
        setError('Failed to load horse data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHorse();
  }, [id]);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 3));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHorse((prevHorse) => ({
      ...prevHorse,
      [name]: type === 'checkbox' ? checked : value,
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
    setNewImages((prev) => [...prev, ...files]);
    setImages((prevImages) => [...prevImages, ...files.map(file => ({ name: file.name }))]);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setNewVideos((prev) => [...prev, ...files]);
    setVideos((prevVideos) => [...prevVideos, ...files.map(file => ({ name: file.name }))]);
  };

  const removeImage = (indexToRemove) => {
    const imageToRemove = images[indexToRemove];
    if (typeof imageToRemove === 'string') {
      setDeletedImages((prev) => [...prev, imageToRemove]);
    }
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const removeVideo = (indexToRemove) => {
    const videoToRemove = videos[indexToRemove];
    if (typeof videoToRemove === 'string') {
      setDeletedVideos((prev) => [...prev, videoToRemove]);
    }
    setVideos((prevVideos) => prevVideos.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const combinedVideos = [...existingVideos, ...newVideos];

    if (combinedVideos.length > 3) {
      alert("You can only add up to 3 videos.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    formData.append('horse[name]', horse.name);
    formData.append('horse[age]', horse.age);
    formData.append('horse[height_cm]', horse.height_cm);
    formData.append('horse[description]', horse.description);
    formData.append('horse[gender]', horse.gender);
    formData.append('horse[color]', horse.color);
    formData.append('horse[training_level]', horse.training_level);
    formData.append('horse[piroplasmosis]', horse.piroplasmosis);

    images.forEach((image) => {
      if (typeof image === 'string') {
        formData.append('existing_images[]', image);
      }
    });

    videos.forEach((video) => {
      if (typeof video === 'string') {
        formData.append('existing_videos[]', video);
      }
    });

    newImages.forEach((image) => formData.append('horse[images][]', image));
    newVideos.forEach((video) => formData.append('horse[videos][]', video));

    deletedImages.forEach((imageUrl) => formData.append('deleted_images[]', imageUrl));
    deletedVideos.forEach((videoUrl) => formData.append('deleted_videos[]', videoUrl));

    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedHorse = await response.json();
        setHorse(updatedHorse);
        setImages(updatedHorse.images);
        setVideos(updatedHorse.videos);
        navigate(`/horses/${id}`);
      } else {
        console.error('Error updating horse:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout setIsLoggedIn={setIsLoggedIn}>
      <div className="edit-horse-container">
        <h1 className="edit-page-title">Edit Horse</h1>
        <div className="edit-breadcrumbs">
          <a href="/dashboard">Dashboard /</a>
          <a href="/myhorses">My Horses /</a>
          <span>Edit Horse</span>
        </div>

        <div className="edit-steps-navigation">
          <div className="edit-steps-line"></div>
          <div className="edit-step">
            <div className={`edit-step-circle ${currentStep === 1 ? 'active' : ''}`}>1</div>
            <span className="edit-step-title">Specific Information</span>
          </div>
          <div className="edit-step">
            <div className={`edit-step-circle ${currentStep === 2 ? 'active' : ''}`}>2</div>
            <span className="edit-step-title2">Images and Videos</span>
          </div>
          <div className="edit-steps-line-2"></div>
          <div className="edit-step">
            <div className={`edit-step-circle ${currentStep === 3 ? 'active' : ''}`}>3</div>
            <span className="edit-step-title3">Genealogy</span>
          </div>
        </div>

        {currentStep === 1 && (
          <form className="edit-horse-form">
            <>
              <input
                type="text"
                name="name"
                className="edit-input"
                placeholder="Name"
                value={horse.name}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="age"
                className="edit-input"
                placeholder="Age"
                value={horse.age}
                onChange={handleChange}
                required
              />
              <select
                name="gender"
                className="edit-select"
                value={horse.gender}
                onChange={handleChange}
                required
              >
                <option value="">Gender</option>
                <option value="gelding">Gelding</option>
                <option value="mare">Mare</option>
                <option value="stallion">Stallion</option>
              </select>
              <select
                name="color"
                className="edit-select"
                value={horse.color}
                onChange={handleChange}
              >
                <option value="">Color</option>
                <option value="Bay">Bay</option>
                <option value="Chestnut">Chestnut</option>
                <option value="Black">Black</option>
                <option value="Gray">Gray</option>
                <option value="Roan">Roan</option>
                <option value="Palomino">Palomino</option>
                <option value="Isabella">Isabella</option>
              </select>
              <input
                type="text"
                name="training_level"
                className="edit-input"
                placeholder="Training Level"
                value={horse.training_level}
                onChange={handleChange}
              />
              <div className="edit-piroplasmosis-label">
                <label>Piroplasmosis</label>
                <input
                  type="checkbox"
                  name="piroplasmosis"
                  checked={horse.piroplasmosis}
                  onChange={handleChange}
                />
              </div>
              <div className="edit-height-slider-container">
                <div className="edit-height-slider-label">Height</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{`${horse.height_cm}m`}</span>
                  <span>{`(${(horse.height_cm / 0.1016).toFixed(1)}hh)`}</span>
                </div>
                <input
                  type="range"
                  name="height_cm"
                  className="edit-height-slider"
                  min="0.5"
                  max="2.5"
                  step="0.01"
                  value={horse.height_cm}
                  onChange={handleHeightChange}
                />
              </div>
              <textarea
                name="description"
                className="edit-textarea"
                placeholder="Horse Description"
                value={horse.description}
                onChange={handleChange}
              />
            </>
          </form>
        )}

        {currentStep === 2 && (
          <div className="edit-upload-container">
            <div className="edit-upload-block">
              <h2>Image</h2>
              <p>Maximum 5 images, up to 10 MB each.</p>
              <button
                className="edit-upload-button"
                onClick={() => document.getElementById('edit-imageUpload').click()}
              >
                Choose Image
              </button>
              <input
                type="file"
                id="edit-imageUpload"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              {error && <p className="edit-error-message">{error}</p>}
              <div className="edit-image-upload-list">
                {images.map((image, index) => (
                  <div key={index} className="edit-image-upload-item">
                    {typeof image === 'string' ? (
                      <a href={image} target="_blank" rel="noopener noreferrer" className="edit-image-url">
                        {`Image ${index + 1}`}
                      </a>
                    ) : (
                      <span className="edit-image-name">{`Image ${index + 1}`}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="edit-remove-upload-button"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="edit-upload-block">
              <h2>Video</h2>
              <p>Maximum 3 videos, up to 50 MB each.</p>
              <button
                className="edit-upload-button"
                onClick={() => document.getElementById('edit-videoUpload').click()}
              >
                Choose Video
              </button>
              <input
                type="file"
                id="edit-videoUpload"
                multiple
                accept="video/*"
                onChange={handleVideoChange}
                style={{ display: 'none' }}
              />
              {error && <p className="edit-error-message">{error}</p>}
              <div className="edit-video-upload-list">
                {videos.map((video, index) => (
                  <div key={index} className="edit-video-upload-item">
                    {typeof video === 'string' ? (
                      <a href={video} target="_blank" rel="noopener noreferrer" className="edit-video-url">
                        {`Video ${index + 1}`}
                      </a>
                    ) : (
                      <span className="edit-video-name">{`Video ${index + 1}`}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="edit-remove-video-button"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="edit-step-content">
            <GenealogyForm ancestors={ancestors} setAncestors={setAncestors} />
          </div>
        )}

        {/* Buttons */}
        <div className="step-buttons">
          {currentStep > 1 && <button className="step-button" onClick={handlePreviousStep}>Back</button>}
          {currentStep < 3 && <button className="step-button" onClick={handleNextStep}>Next</button>}
          {currentStep === 3 && (
            <button type="submit" onClick={handleSubmit} className="step-button">
              Update Horse
            </button>
          )}
        </div>
      </div>
      {isSubmitting && <LoadingPopup message="Saving the horse, please wait..." />}
    </Layout>
  );
};

export default EditHorse;
