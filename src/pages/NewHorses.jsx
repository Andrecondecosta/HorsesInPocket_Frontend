import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewHorses.css';
import Layout from '../components/Layout';
import GenealogyForm from '../components/GenealogyForm';
import LoadingPopup from '../components/LoadingPopup';
import YearPicker from '../components/YearPicker';
import VideoUploader from '../components/VideoUploader';
import ImageUploader from '../components/ImageUploader';

const NewHorses = ({ setIsLoggedIn }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [newHorse, setNewHorse] = useState({
    name: '',
    age: '',
    height_cm: 1.5,
    description: '',
    gender: '',
    color: '',
    training_level: '',
    piroplasmosis: false,
    breed: "",
    breeder: "",
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
  const [setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const nameRef = useRef(null);
  const ageRef = useRef(null);
  const genderRef = useRef(null);
  const colorRef = useRef(null);
  const trainingLevelRef = useRef(null);
  const imageRef = useRef(null);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [breedInput, setBreedInput] = useState(newHorse.breed || "");
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

  const handleBreedInputChange = (e) => {
    const inputValue = e.target.value;
    setBreedInput(inputValue);

    if (inputValue.trim() === "") {
      setShowDropdown(false); // Não exibe o dropdown se o input estiver vazio
      setFilteredOptions([]);
      return;
    }

    // Filtra as opções que contêm o texto digitado (case insensitive)
    const filtered = breeds.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setShowDropdown(filtered.length > 0);
  };

  const handleOptionClick = (option) => {
    setBreedInput(option); // Define o valor no input
    setNewHorse((prevHorse) => ({
      ...prevHorse,
      breed: option, // Atualiza o estado do cavalo
    }));
    setFilteredOptions([]); // Fecha o dropdown
  };



  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const capitalizeFirstLetter = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewHorse((prevHorse) => ({
      ...prevHorse,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleHeightChange = (e) => {
    const valueInMeters = parseFloat(e.target.value);
    setNewHorse((prevHorse) => ({
      ...prevHorse,
      height_cm: valueInMeters,
    }));
  };

  const handleCapitalizedChange = (e) => {
    const { name, value } = e.target;
    setNewHorse((prevHorse) => ({
      ...prevHorse,
      [name]: capitalizeFirstLetter(value),
    }));
  };

  const handleColorChange = (e) => {
    setNewHorse((prevHorse) => ({
      ...prevHorse,
      color: e.target.value,
    }));
  };


  const heightInHH = (newHorse.height_cm / 0.1016).toFixed(1);

  const validateFields = () => {
    const errors = {};
    let firstErrorField = null;
    let firstErrorStep = null;

    if (currentStep === 1 || !firstErrorStep) {
      if (!newHorse.name.trim()) {
        errors.name = "Name is required.";
        if (!firstErrorField) {
          firstErrorField = nameRef;
          firstErrorStep = 1;
        }
      }
      if (!newHorse.age || newHorse.age <= 0) {
        errors.age = "Age is required and must be greater than zero.";
        if (!firstErrorField) {
          firstErrorField = ageRef;
          firstErrorStep = 1;
        }
      }
      if (!newHorse.gender) {
        errors.gender = "Gender is required.";
        if (!firstErrorField) {
          firstErrorField = genderRef;
          firstErrorStep = 1;
        }
      }
      if (!newHorse.color) {
        errors.color = "Color is required.";
        if (!firstErrorField) {
          firstErrorField = colorRef;
          firstErrorStep = 1;
        }
      }
      if (!newHorse.training_level.trim()) {
        errors.training_level = "Training level is required.";
        if (!firstErrorField) {
          firstErrorField = trainingLevelRef;
          firstErrorStep = 1;
        }
      }
    }

    if (currentStep === 2 || !firstErrorStep) {
      if (images.length === 0) {
        errors.images = "At least one image is required.";
        if (!firstErrorField) {
          firstErrorField = imageRef;
          firstErrorStep = 2;
        }
      }
    }

    setFieldErrors(errors);

    if (firstErrorStep && firstErrorStep !== currentStep) {
      setCurrentStep(firstErrorStep);
    }

    if (firstErrorField && firstErrorField.current) {
      firstErrorField.current.scrollIntoView({ behavior: "smooth", block: "center" });
      firstErrorField.current.focus();
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();

      formData.append('horse[name]', newHorse.name);
      formData.append('horse[age]', newHorse.age);
      formData.append('horse[height_cm]', newHorse.height_cm);
      formData.append('horse[description]', newHorse.description);
      formData.append('horse[gender]', newHorse.gender);
      formData.append('horse[color]', newHorse.color);
      formData.append('horse[training_level]', newHorse.training_level);
      formData.append('horse[piroplasmosis]', newHorse.piroplasmosis);
      formData.append('horse[breed]', newHorse.breed);
      formData.append('horse[breeder]', newHorse.breeder);

      Object.keys(ancestors).forEach((relation) => {
        const ancestor = ancestors[relation];
        formData.append(`horse[ancestors_attributes][][relation_type]`, relation);
        formData.append(`horse[ancestors_attributes][][name]`, ancestor.name || '');
        formData.append(`horse[ancestors_attributes][][breeder]`, ancestor.breeder || '');
        formData.append(`horse[ancestors_attributes][][breed]`, ancestor.breed || '');
      });



      images.forEach((image) => {
        formData.append('horse[images][]', image);
      });

      videos.forEach((video) => {
        formData.append('horse[videos][]', video);
      });

      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate("/myhorses");
      } else {
        console.error("Error creating horse:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting horse:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Layout setIsLoggedIn={setIsLoggedIn}>
      <div className="new-horse-container">

        {/* Title */}
        <h1 className="page-title">Create Horse</h1>

        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <a href="/dashboard">Dashboard /</a>
          <a href="/myhorses">My Horses /</a>
          <span>Create Horse</span>
        </div>

        <div className="steps-navigation">
          <div className="steps-line"></div>

          <div className="step">
            <div className={`step-circle ${currentStep === 1 ? 'active' : ''}`}>1</div>
            <span className="step-title">
              Specific Information {currentStep === 1 && <span></span>}
            </span>
          </div>

          <div className="step">
            <div className={`step-circle ${currentStep === 2 ? 'active' : ''}`}>2</div>
            <span className="step-title">
              Images and Videos {currentStep === 2 && <span></span>}
            </span>
          </div>
          <div className="steps-line-2"></div>

          <div className="step">
            <div className={`step-circle ${currentStep === 3 ? 'active' : ''}`}>3</div>
            <span className="step-title3">
              Genealogy {currentStep === 3 && <span></span>}
            </span>
          </div>
        </div>

        {/* Step 1 Form */}
        {currentStep === 1 && (
          <form className="new-horse-form">
            {/* First row with 4 fields */}
            <div className="form-group">
              <input
                ref={nameRef}
                type="text"
                name="name"
                placeholder="Name"
                value={newHorse.name}
                onChange={handleCapitalizedChange}
                required
              />
              {fieldErrors.name && <p className="error-message">{fieldErrors.name}</p>}
            </div>
            <div className="form-group">
            <YearPicker
              selectedYear={newHorse.age} // Passa o ano selecionado como propriedade
              onChange={(year) => setNewHorse((prevHorse) => ({ ...prevHorse, age: year }))}
            />

              {fieldErrors.age && <p className="error-message">{fieldErrors.age}</p>}
            </div>
            <div className="form-group">
              <select
                ref={genderRef}
                name="gender"
                value={newHorse.gender}
                onChange={handleChange}
                required
              >
                <option value="">Gender</option>
                <option value="Gelding">Gelding</option>
                <option value="Mare">Mare</option>
                <option value="Stallion">Stallion</option>
              </select>
              {fieldErrors.gender && <p className="error-message">{fieldErrors.gender}</p>}
            </div>
            <div className="form-group">
              <select ref={colorRef} name="color" value={newHorse.color} onChange={handleColorChange}>
                <option value="">Color</option>
                <option value="Bay">Bay</option>
                <option value="Chestnut">Chestnut</option>
                <option value="Black">Black</option>
                <option value="Gray">Gray</option>
                <option value="Roan">Roan</option>
                <option value="Palomino">Palomino</option>
                <option value="Isabella">Isabella</option>
              </select>
              {fieldErrors.color && <p className="error-message">{fieldErrors.color}</p>}
            </div>

            {/* Breed and Breeder */}
            <div className="form-group">
              <input
                type="text"
                value={breedInput}
                onChange={handleBreedInputChange}
                placeholder="Type or select a breed"
                className="autocomplete-input"
              />

              {/* Dropdown com as sugestões */}
              {filteredOptions.length > 0 && (
                <ul className="autocomplete-dropdown">
                  {filteredOptions.map((option, index) => (
                    <li
                      key={index}
                      onClick={() => handleOptionClick(option)} // Seleciona a opção
                      className="autocomplete-option"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-group">
              <input type="text"
              name="breeder"
               placeholder="Breeder"
              value={newHorse.breeder}
              onChange={handleChange} />
            </div>

            {/* Second row: Height slider and Piroplasmosis */}
            <div className="form-group">
              <input
                ref={trainingLevelRef}
                type="text"
                name="training_level"
                placeholder="Training Level"
                value={newHorse.training_level}
                onChange={handleCapitalizedChange}
              />
              {fieldErrors.training_level && <p className="error-message">{fieldErrors.training_level}</p>}
            </div>

            <div className="piroplasmosis-label">
              <label>Piroplasmosis</label>
              <input
                type="checkbox"
                name="piroplasmosis"
                checked={newHorse.piroplasmosis}
                onChange={handleChange}
              />
            </div>

            {/* Height slider */}
            <div className="height-slider-container">
              <div className="height-slider-label">Height</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>{`${newHorse.height_cm}m`}</span>
                <span>{`(${heightInHH}hh)`}</span>
              </div>
              <input
                type="range"
                name="height_cm"
                min="0.5"
                max="2.5"
                step="0.01"
                value={newHorse.height_cm}
                onChange={handleHeightChange}
              />
            </div>

            <textarea
              name="description"
              placeholder="Horse Description"
              value={newHorse.description}
              onChange={handleCapitalizedChange}
            />
          </form>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="upload-container">
            {/* Image */}
            <ImageUploader  images={images} setImages={setImages} setError={setError} />
            {/* Video */}
              <VideoUploader videos={videos} setVideos={setVideos} setError={setError} />
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="step-content">
            <GenealogyForm ancestors={ancestors} setAncestors={setAncestors} />
            {Object.values(ancestors).some(
              (ancestor) => ancestor.name || ancestor.breeder || ancestor.breed
            ) && (
              <div className="genealogy-tree">
                <h2>Genealogy Tree</h2>
                <ul>
                  {Object.entries(ancestors).map(([relation, details]) => (
                    details.name || details.breeder || details.breed ? (
                      <li key={relation}>
                        <strong>{relation}</strong>: {details.name || 'N/A'}, {details.breeder || 'N/A'}, {details.breed || 'N/A'}
                      </li>
                    ) : null
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="step-buttons">
          {currentStep > 1 && <button className="step-button" onClick={handlePreviousStep}>Back</button>}
          {currentStep < 3 && <button className="step-button" onClick={handleNextStep}>Next</button>}
          {currentStep === 3 && <button type="submit" onClick={handleSubmit} className="step-button">
            Create Horse
          </button>}
        </div>
      </div>
      {isSubmitting && <LoadingPopup message="Saving the horse, please wait..." />}
    </Layout>
  );

};

export default NewHorses;
