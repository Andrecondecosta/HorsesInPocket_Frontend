import React, { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import GenealogyForm from '../components/GenealogyForm';
import LoadingPopup from '../components/LoadingPopup';
import EditImageUploader from '../components/EditImageUploader';
import EditVideoUploader from '../components/EditVideoUploader';
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
    breed: '',
    breeder: '',
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedVideos, setDeletedVideos] = useState([]);
  const [newImages] = useState([]);
  const [newVideos] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [breedInput, setBreedInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const breeds = [
    'Akhal-Teke',
    'American Cream Draft',
    'American Paint Horse',
    'American Quarter Horse',
    'American Saddlebred',
    'Andalusian',
    'Appaloosa',
    'Arabian',
    'Ardennes',
    'Azteca',
    'Bashkir Curly',
    'Belgian Draft',
    'Brumby',
    'Budyonny',
    'Canadian Horse',
    'Caspian',
    'Cleveland Bay',
    'Clydesdale',
    'Criollo',
    'Dutch Warmblood',
    'Exmoor Pony',
    'Fell Pony',
    'Friesian',
    'Gypsy Vanner',
    'Hackney Horse',
    'Haflinger',
    'Hanoverian',
    'Highland Pony',
    'Holsteiner',
    'Icelandic Horse',
    'Irish Draught',
    'Knabstrupper',
    'Lipizzaner',
    'Lusitano',
    'Marwari',
    'Miniature Horse',
    'Missouri Fox Trotter',
    'Morgan',
    'Mustang',
    'Nokota Horse',
    'Oldenburg',
    'Paso Fino',
    'Percheron',
    'Peruvian Paso',
    'Pinto',
    'Pony of the Americas',
    'Przewalski’s Horse',
    'Quarter Horse',
    'Rocky Mountain Horse',
    'Shetland Pony',
    'Shire',
    'Suffolk Punch',
    'Tennessee Walking Horse',
    'Thoroughbred',
    'Trakehner',
    'Welsh Pony',
    'Westphalian',
    'Zangersheide',
    'Other'
  ];


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
      }
    };

    fetchHorse();
  }, [id]);

  const handleBreedInputChange = (e) => {
    const inputValue = e.target.value;
    setBreedInput(inputValue);

    if (inputValue.trim() === "") {
      setShowDropdown(false);
      setFilteredOptions([]);
      return;
    }

    const filtered = breeds.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setShowDropdown(filtered.length > 0);
  };

  const handleOptionClick = (option) => {
    setBreedInput(option);
    setHorse((prevHorse) => ({
      ...prevHorse,
      breed: option,
    }));
    setFilteredOptions([]);
  };


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
    formData.append('horse[breed]', horse.breed);
    formData.append('horse[breeder]', horse.breeder);

    images.forEach((image) => {
      if (typeof image === 'string') {
        formData.append('existing_images[]', image);
      }
    });

    images.forEach((image) => {
      if (typeof image !== 'string') {
        formData.append('horse[images][]', image); // Novos arquivos
      }
    });

    videos.forEach((video) => {
      if (typeof video === 'string') {
        formData.append('existing_videos[]', video); // URLs existentes
      } else {
        formData.append('horse[videos][]', video.file); // Novos arquivos
      }
    });

    newImages.forEach((image) => formData.append('horse[images][]', image));
    newVideos.forEach((video) => formData.append('horse[videos][]', video));

    deletedImages.forEach((imageUrl) => formData.append('deleted_images[]', imageUrl));
    deletedVideos.forEach((videoUrl) => formData.append('deleted_videos[]', videoUrl)); // Inclui os vídeos removidos

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
                <option value="Gelding">Gelding</option>
                <option value="Mare">Mare</option>
                <option value="Stallion">Stallion</option>
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
              <div className="form-group">
            <input
              type="text"
              value={breedInput}
              onChange={handleBreedInputChange}
              placeholder="Type or select a breed"
              className="autocomplete-input"
            />
            {showDropdown && (
              <ul className="autocomplete-dropdown">
                {filteredOptions.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className="autocomplete-option"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
              <input
                type="text"
                name="breeder"
                className="edit-input"
                placeholder="Breeder"
                value={horse.breeder}
                onChange={handleChange}
                required
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
            <EditImageUploader images={images} setImages={setImages} setDeletedImages={setDeletedImages} />


            <EditVideoUploader videos={videos} setVideos={setVideos} setDeletedVideos={setDeletedVideos}/>
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
