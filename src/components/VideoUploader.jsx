import React, { useState } from 'react';

const VideoUploader = ({ videos, setVideos }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleVideoChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 3;

    if (files.length + videos.length > maxFiles) {
      setError(`Você pode enviar no máximo ${maxFiles} vídeos.`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      const processedVideos = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(
            `${process.env.REACT_APP_API_SERVER_URL}/videos_compress/compress`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error('Erro ao enviar o vídeo para compactação.');
          }

          const blob = await response.blob();
          const compactedVideo = new File([blob], file.name, { type: 'video/mp4' });
          return compactedVideo;
        })
      );

      setVideos((prevVideos) => [...prevVideos, ...processedVideos]);
    } catch (err) {
      setError(err.message || 'Erro ao processar os vídeos.');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeVideo = (indexToRemove) => {
    setVideos((prevVideos) => prevVideos.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="upload-block">
      <h2>Vídeo</h2>
      <p>Máximo de 3 vídeos, até 50MB cada.</p>
      <button
        className="upload-button"
        onClick={() => document.getElementById('videoUpload').click()}
      >
        Escolher Vídeos
      </button>
      <input
        type="file"
        id="videoUpload"
        multiple
        accept="video/*"
        onChange={handleVideoChange}
        style={{ display: 'none' }}
      />
      <div className="video-upload-list">
        {videos.map((video, index) => (
          <div key={index} className="video-upload-item">
            <video width="100" controls>
              <source src={URL.createObjectURL(video)} type="video/mp4" />
              Seu navegador não suporta a reprodução de vídeo.
            </video>
            <button
              type="button"
              onClick={() => removeVideo(index)}
              className="remove-video-button"
            >
              X
            </button>
          </div>
        ))}
      </div>
      {isProcessing && <p>Processando vídeos...</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default VideoUploader;
