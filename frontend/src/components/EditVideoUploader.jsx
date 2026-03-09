import React, { useState } from 'react';

const EditVideoUploader = ({ videos, setVideos, setDeletedVideos }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleVideoChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 3;

    // Limit the number of videos
    if (files.length + videos.length > maxFiles) {
      setError(`You can upload a maximum of ${maxFiles} videos.`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('User not authenticated. Please log in again.');
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
            throw new Error('Error uploading the video for compression.');
          }

          const blob = await response.blob();
          const compactedVideo = new File([blob], file.name, { type: 'video/mp4' });

          return {
            id: `${file.name}-${Date.now()}`, // Unique identifier
            file: compactedVideo,
            url: URL.createObjectURL(compactedVideo),
          };
        })
      );

      setVideos((prevVideos) => [...prevVideos, ...processedVideos]);
    } catch (err) {
      setError(err.message || 'Error processing the videos.');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeVideo = (idToRemove) => {
    const videoToRemove = videos.find((video) => video.id === idToRemove || video === idToRemove);

    if (videoToRemove) {
      if (typeof videoToRemove === 'string' || videoToRemove.url?.startsWith('http')) {
        // Add existing videos to the deleted list
        setDeletedVideos((prev) => [...prev, videoToRemove]);
      }

      // Update the video list by removing the selected video
      setVideos((prevVideos) => prevVideos.filter((video) => video.id !== idToRemove && video !== idToRemove));
    }
  };

  return (
    <div className="upload-block">
      <h2>Videos</h2>
      <p>Maximum of 3 videos</p>
      <button
        className="upload-button"
        onClick={() => document.getElementById('edit-videoUpload').click()}
      >
        Choose Videos
      </button>
      <input
        type="file"
        id="edit-videoUpload"
        multiple
        accept="video/*"
        onChange={handleVideoChange}
        style={{ display: 'none' }}
      />
      <div className="video-upload-list">
        {videos.map((video, index) => (
          <div key={video.id || index} className="video-upload-item">
            <video width="100" controls>
              <source
                src={video.url || video} // Displays either an existing or processed video
                type="video/mp4"
              />
              Your browser does not support video playback.
            </video>
            <button
              type="button"
              onClick={() => removeVideo(video.id || video)} // Pass the id or reference of the video
              className="remove-video-button"
            >
              X
            </button>
          </div>
        ))}
      </div>
      {isProcessing && <p>Processing videos...</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default EditVideoUploader;
