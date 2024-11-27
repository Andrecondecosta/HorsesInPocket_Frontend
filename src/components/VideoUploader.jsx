import React from 'react';

const VideoUploader = ({ videos, setVideos, setError }) => {
  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 50 * 1024 * 1024; // 50MB por vídeo

    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError('Cada vídeo deve ter no máximo 50MB.');
      return;
    }

    const newVideos = files.filter(
      (file) =>
        !videos.some(
          (existingFile) =>
            existingFile.name === file.name && existingFile.size === file.size
        )
    );

    if (videos.length + newVideos.length > 3) {
      setError('Você pode fazer upload de no máximo 3 vídeos.');
    } else {
      setVideos((prevVideos) => [...prevVideos, ...newVideos]);
      setError(null);
    }
  };

  const removeVideo = (indexToRemove) => {
    setVideos((prevVideos) => prevVideos.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <label className="new-input-label">Vídeos (até 3, máximo 50MB cada)</label>
      <input
        type="file"
        accept="video/mp4,video/x-m4v,video/*"
        multiple
        onChange={handleVideoChange}
      />
      <div className="video-preview-container">
        {videos.map((video, index) => (
          <div key={index} className="video-preview">
            <p>{video.name}</p>
            <button
              className="remove-video-button"
              onClick={() => removeVideo(index)}
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoUploader;
