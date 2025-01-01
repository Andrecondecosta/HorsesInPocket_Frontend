import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import GenealogyForm from '../components/GenealogyForm';
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
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedVideos, setDeletedVideos] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]); // Lista de URLs de vídeos existentes


  useEffect(() => {
    const fetchHorse = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar cavalo');
        }

        const horseData = await response.json(); // Renomeie para `horseData` para evitar confusão
        setHorse(horseData);

        setExistingVideos(horseData.videos || []);

        // Atualiza imagens e vídeos, se forem arrays
        if (Array.isArray(horseData.images)) {
          setImages(horseData.images);
        }

        if (Array.isArray(horseData.videos)) {
          setVideos(horseData.videos);
        }

        // Atualiza ancestrais
        const loadedAncestors = {};
        horseData.ancestors?.forEach((ancestor) => {
          loadedAncestors[ancestor.relation_type] = ancestor;
        });
        setAncestors(loadedAncestors);

      } catch (error) {
        console.error('Erro ao carregar cavalo:', error);
        setError('Erro ao carregar cavalo');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHorse();
  }, [id]);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 3)); // Limita o máximo a 3
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1)); // Limita o mínimo a 1
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
      // Adiciona o URL da imagem a ser excluída
      setDeletedImages((prev) => [...prev, imageToRemove]);
      console.log('Imagem a ser excluída:', imageToRemove);
    }
    // Remove a imagem da lista exibida
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const removeVideo = (indexToRemove) => {
    const videoToRemove = videos[indexToRemove];
    if (typeof videoToRemove === 'string') {
      // Adiciona o URL do vídeo a ser excluído
      setDeletedVideos((prev) => [...prev, videoToRemove]);
      console.log('Vídeo a ser excluído:', videoToRemove);
    }
    // Remove o vídeo da lista exibida
    setVideos((prevVideos) => prevVideos.filter((_, index) => index !== indexToRemove));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const combinedVideos = [...existingVideos, ...newVideos];


    if (combinedVideos.length > 3) {
      alert("Você pode adicionar no máximo 3 vídeos.");
      return;
    }

    const formData = new FormData();

    // Adicionar dados do cavalo
    formData.append('horse[name]', horse.name);
    formData.append('horse[age]', horse.age);
    formData.append('horse[height_cm]', horse.height_cm);
    formData.append('horse[description]', horse.description);
    formData.append('horse[gender]', horse.gender);
    formData.append('horse[color]', horse.color);
    formData.append('horse[training_level]', horse.training_level);
    formData.append('horse[piroplasmosis]', horse.piroplasmosis);

    // URLs de arquivos existentes (para preservação)
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

    // Novos arquivos para upload
    newImages.forEach((image) => formData.append('horse[images][]', image));
    newVideos.forEach((video) => formData.append('horse[videos][]', video));

    // Arquivos para exclusão
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
        alert('Cavalo atualizado com sucesso!');
        navigate(`/horses/${id}`);
      } else {
        console.error('Erro ao atualizar cavalo:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  };


  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

return (
  <Layout setIsLoggedIn={setIsLoggedIn}>
    <div className="edit-horse-container">
      <h1 className="edit-page-title">Editar Cavalo</h1>
      <div className="edit-breadcrumbs">
        <a href="/dashboard">Dashboard /</a>
        <a href="/myhorses">Meus Cavalos /</a>
        <span>Editar Cavalo</span>
      </div>

      <div className="edit-steps-navigation">
        <div className="edit-steps-line"></div>
        <div className="edit-step">
          <div className={`edit-step-circle ${currentStep === 1 ? 'active' : ''}`}>1</div>
          <span className="edit-step-title">Informação Específica</span>
        </div>
        <div className="edit-step">
          <div className={`edit-step-circle ${currentStep === 2 ? 'active' : ''}`}>2</div>
          <span className="edit-step-title">Imagens e Vídeos</span>
        </div>
        <div className="edit-steps-line-2"></div>
        <div className="edit-step">
          <div className={`edit-step-circle ${currentStep === 3 ? 'active' : ''}`}>3</div>
          <span className="edit-step-title">Genealogia</span>
        </div>
      </div>

        {currentStep === 1 && (
        <form className="edit-horse-form">
          <>
            <input
              type="text"
              name="name"
              className="edit-input"
              placeholder="Nome"
              value={horse.name}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="age"
              className="edit-input"
              placeholder="Idade"
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
              <option value="">Gênero</option>
              <option value="gelding">Castrado</option>
              <option value="mare">Égua</option>
              <option value="stallion">Garanhão</option>
            </select>
            <select
              name="color"
              className="edit-select"
              value={horse.color}
              onChange={handleChange}
            >
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
            <input
              type="text"
              name="training_level"
              className="edit-input"
              placeholder="Nível de Treinamento"
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
              <div className="edit-height-slider-label">Altura</div>
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
              placeholder="Descrição do cavalo"
              value={horse.description}
              onChange={handleChange}
            />
          </>
          </form>
        )}

        {currentStep === 2 && (
          <div className="edit-upload-container">
            <div className="edit-upload-block">
              <h2>Imagem</h2>
              <p>Máximo de 5 imagens, até 10 MB cada.</p>
              <button
                className="edit-upload-button"
                onClick={() => document.getElementById('edit-imageUpload').click()}
              >
                Escolher Imagem
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
            </div>

            <div className="edit-upload-block">
              <h2>Vídeo</h2>
              <p>Máximo de 3 vídeos, até 50 MB cada.</p>
              <button
                className="edit-upload-button"
                onClick={() => document.getElementById('edit-videoUpload').click()}
              >
                Escolher Vídeo
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

export default EditHorse;
