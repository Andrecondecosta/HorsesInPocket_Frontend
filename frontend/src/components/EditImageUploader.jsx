import React, { useState } from 'react';

const EditImageUploader = ({ images, setImages, setDeletedImages }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 5;
    const maxSize = 50 * 1024 * 1024; // 10MB per image

    // Check the maximum number of files
    if (files.length + images.length > maxFiles) {
      setError(`You can upload a maximum of ${maxFiles} images.`);
      return;
    }

    // Check the maximum file size
    if (files.some((file) => file.size > maxSize)) {
      setError(`Each image must be no larger than 10MB.`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('User not authenticated. Please log in again.');
      }

      const compressedImages = await Promise.all(
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
            throw new Error('Error uploading the image for compression.');
          }

          const blob = await response.blob();
          const compressedImage = new File([blob], file.name, { type: file.type });
          return compressedImage;
        })
      );

      setImages((prevImages) => [...prevImages, ...compressedImages]);
    } catch (err) {
      setError(err.message || 'Error processing the images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = (indexToRemove) => {
    const imageToRemove = images[indexToRemove];
    if (typeof imageToRemove === 'string') {
      // Add existing images to the deleted list
      setDeletedImages((prev) => [...prev, imageToRemove]);
    }
    // Remove the image from the current list
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="edit-upload-block">
      <h2>Images</h2>
      <p>Maximum of 5 images</p>
      <button
        className="edit-upload-button"
        onClick={() => document.getElementById('edit-imageUpload').click()}
      >
        Choose Images
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
              <img
                src={image}
                alt={`Existing ${index + 1}`}
                width="100"
              />
            ) : (
              <img
                src={URL.createObjectURL(image)}
                alt={`Uploaded ${index + 1}`}
                width="100"
              />
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
      {isProcessing && <p>Processing images...</p>}
    </div>
  );
};

export default EditImageUploader;
