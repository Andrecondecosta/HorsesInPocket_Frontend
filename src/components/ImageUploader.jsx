import React, { useState } from 'react';

const ImageUploader = ({ images, setImages }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 5;

    if (files.length + images.length > maxFiles) {
      setError(`Você pode enviar no máximo ${maxFiles} imagens.`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      const processedImages = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(
            `${process.env.REACT_APP_API_SERVER_URL}/images_compress/compress`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error('Erro ao enviar a imagem para compactação.');
          }

          const blob = await response.blob();
          const compactedImage = new File([blob], file.name, { type: file.type });
          return compactedImage;
        })
      );

      setImages((prevImages) => [...prevImages, ...processedImages]);
    } catch (err) {
      setError(err.message || 'Erro ao processar as imagens.');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="upload-block">
      <h2>Imagens</h2>
      <p>Máximo de 5 imagens, até 10MB cada.</p>
      <button
        className="upload-button"
        onClick={() => document.getElementById('imageUpload').click()}
      >
        Escolher Imagens
      </button>
      <input
        type="file"
        id="imageUpload"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
      <div className="image-upload-list">
        {images.map((image, index) => (
          <div key={index} className="image-upload-item">
            <img
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
              width="100"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="remove-image-button"
            >
              X
            </button>
          </div>
        ))}
      </div>
      {isProcessing && <p>Processando imagens...</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ImageUploader;
