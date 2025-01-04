import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewHorses.css';
import Layout from '../components/Layout';
import GenealogyForm from '../components/GenealogyForm';

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
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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


  const handleColorChange = (e) => {
    setNewHorse((prevHorse) => ({
      ...prevHorse,
      color: e.target.value,
    }));
  };


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB

    // Arquivos excedendo o tamanho permitido
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError('Cada imagem deve ter no máximo 10MB.');
      return;
    }

    // Checar se já existem arquivos no estado `images`
    const newFiles = files.filter(file =>
      !images.some(existingFile =>
        existingFile.name === file.name && existingFile.size === file.size
      )
    );

    // Verificar o limite de quantidade de arquivos (5)
    if (images.length + newFiles.length > 5) {
      setError('Você pode fazer upload de no máximo 5 imagens.');
    } else {
      // Atualizar o estado com novos arquivos únicos
      setImages(prevImages => [...prevImages, ...newFiles]);
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
      !videos.some(existingFile =>
        existingFile.name === file.name && existingFile.size === file.size
      )
    );

    if (videos.length + newVideos.length > 3) {
      setError('Você pode fazer upload de no máximo 3 vídeos.');
    } else {
      setVideos(prevVideos => [...prevVideos, ...newVideos]);
      setError(null);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const heightInHH = (newHorse.height_cm / 0.1016).toFixed(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    console.log('Token:', token);
    console.log('Imagens para enviar:', images); // Log das imagens
    console.log('Vídeos para enviar:', videos); //
    const formData = new FormData();

    // Adiciona os dados básicos do cavalo
    formData.append('horse[name]', newHorse.name);
    formData.append('horse[age]', newHorse.age);
    formData.append('horse[height_cm]', newHorse.height_cm);
    formData.append('horse[description]', newHorse.description);
    formData.append('horse[gender]', newHorse.gender);
    formData.append('horse[color]', newHorse.color);
    formData.append('horse[training_level]', newHorse.training_level);
    formData.append('horse[piroplasmosis]', newHorse.piroplasmosis);

    // Adiciona ancestrais
    Object.keys(ancestors).forEach((relation) => {
      const ancestor = ancestors[relation];
      formData.append(`horse[ancestors_attributes][][relation_type]`, relation);
      formData.append(`horse[ancestors_attributes][][name]`, ancestor.name || '');
      formData.append(`horse[ancestors_attributes][][breeder]`, ancestor.breeder || '');
      formData.append(`horse[ancestors_attributes][][breed]`, ancestor.breed || '');
    });

    // Adiciona imagens e vídeos
    images.forEach((image) => formData.append('horse[images][]', image));
    videos.forEach((video) => formData.append('horse[videos][]', video));

    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Erro ao criar cavalo:', errorData || response.statusText);
        setError(
          errorData?.errors?.join(', ') || 'Erro desconhecido ao criar cavalo.'
        );
        return;
      }

      navigate('/myhorses');
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      setError('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
  };


  return (
    <Layout setIsLoggedIn={setIsLoggedIn}>
      <div className="new-horse-container">

      {/* Título */}
      <h1 className="page-title">Criar Cavalo</h1>

      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <a href="/dashboard">Dashboard /</a>
        <a href="/myhorses">Meus Cavalos /</a>
        <span>Criar Cavalo</span>
      </div>


        <div className="steps-navigation">
          <div className="steps-line"></div>

          <div className="step">
            <div className={`step-circle ${currentStep === 1 ? 'active' : ''}`}>1</div>
                <span className="step-title">
                  Informação Específica {currentStep === 1 && <span></span>}
                </span>
              </div>

              <div className="step">
                <div className={`step-circle ${currentStep === 2 ? 'active' : ''}`}>2</div>
                <span className="step-title">
                  Imagens e Vídeos {currentStep === 2 && <span></span>}
                </span>
              </div>
              <div className="steps-line-2"></div>

              <div className="step">
                <div className={`step-circle ${currentStep === 3 ? 'active' : ''}`}>3</div>
                <span className="step-title">
                  Genealogia {currentStep === 3 && <span></span>}
                </span>
              </div>
        </div>

          {/* Formulário passo 1 */}

        {currentStep === 1 && (
        <form className="new-horse-form">
          {/* Primeira linha com 4 campos */}
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={newHorse.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Idade"
            value={newHorse.age}
            onChange={handleChange}
            required
          />
          <select name="gender" value={newHorse.gender} onChange={handleChange} require>
            <option value="">Gênero</option>
            <option value="gelding">Castrado</option>
            <option value="mare">Égua</option>
            <option value="stallion">Garanhão</option>
          </select>
          <select name="color" value={newHorse.color} onChange={handleColorChange}>
            <option value="">Cor</option>
            <option value="Baio">Baio</option>
            <option value="Castanho">Castanho</option>
            <option value="Alazão">Alazão</option>
            <option value="Preto">Preto</option>
            <option value="Tordilho">Tordilho</option>
            <option value="Ruão">Ruão</option>
            <option value="Palomino">Palomino</option>
            <option value="Isabel">Isabel</option>
            <option value="Ruço">Ruço</option>
          </select>

            {/* Segunda linha: Slider de altura e Piroplasmose */}
              {/* Campo de texto */}
              <input
                type="text"
                name="training_level"
                placeholder="training_level"
                value={newHorse.training_level}
                onChange={handleChange}
              />

              {/* Checkbox com Label */}
              <div className="piroplasmosis-label">
                <label>Piroplasmosis</label>
                <input
                  type="checkbox"
                  name="piroplasmosis"
                  checked={newHorse.piroplasmosis}
                  onChange={handleChange}
                />
              </div>

              {/* Slider de Altura */}
              <div className="height-slider-container">
              <div className="height-slider-label">Altura</div>
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

            {/* Terceira linha: Descrição */}
            <textarea
              name="description"
              placeholder="Descrição do cavalo"
              value={newHorse.description}
              onChange={handleChange}
            />
        </form>

          )}

      {/* Passo 2 */}
      {currentStep === 2 && (
        <div className="upload-container">
          {/* Imagem */}
          <div className="upload-block">
            <h2>Imagem</h2>
            <p>Máximo de 5 imagens, até 10 MB cada.</p>
            <button
              className="upload-button"
              onClick={() => document.getElementById('imageUpload').click()}
            >
              Escolher Imagem
            </button>
            <input
              type="file"
              id="imageUpload"
              multiple
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {error && <p className="error-message">{error}</p>} {/* Exibe o erro */}
            {/* Mostrar Imagens Carregadas */}
            <div className="image-upload-list">
              {images.map((image, index) => (
                <div key={index} className="image-upload-item">
                  <span className="image-name">{image.name}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-upload-button"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Vídeo */}
          <div className="upload-block">
            <h2>Vídeo</h2>
            <p>Máximo de 3 vídeos, até 50 MB cada.</p>
            <button
              className="upload-button"
              onClick={() => document.getElementById('videoUpload').click()}
            >
              Escolher Vídeo
            </button>
            <input
              type="file"
              id="videoUpload"
              multiple
              accept="video/*"
              onChange={handleVideoChange}
              style={{ display: 'none' }}
            />
            {error && <p className="error-message">{error}</p>} {/* Exibe o erro */}
            {/* Mostrar Vídeos Carregados */}
            <div className="video-upload-list">
              {videos.map((video, index) => (
                <div key={index} className="video-upload-item">
                  <span className="video-name">{video.name}</span>
                  <button
                    type="button"
                    onClick={() => setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index))}
                    className="remove-video-button"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

        {/* Passo 3 */}
        {currentStep === 3 && (
          <div className="step-content">
            <GenealogyForm ancestors={ancestors} setAncestors={setAncestors} />
          </div>
        )}

        {/* Botões */}
        <div className="step-buttons">
          {currentStep > 1 && <button className="step-button" onClick={handlePreviousStep}>Voltar</button>}
          {currentStep < 3 && <button className="step-button" onClick={handleNextStep}>Próximo</button>}
          {currentStep === 3 && <button type="submit" onClick={handleSubmit} className="step-button">
          Criar Cavalo
          </button>}
        </div>
      </div>
    </Layout>
  );
};

export default NewHorses;
