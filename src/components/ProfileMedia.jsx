import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./ProfileMedia.css";

const ProfileMedia = ({ images, videos }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);

  return (
    <div className="profile-media-container">
      {/* Image Carousel */}
      {images && images.length > 0 && (
        <div className="carousel-container">
          <h2>Images</h2>
          <img
            src={images[selectedImageIndex]}
            alt={`Image ${selectedImageIndex + 1}`}
            className="media-item"
            onClick={() => setIsImageLightboxOpen(true)} // Opens the Lightbox
          />
          <div className="pagination-dots">
            {images.map((_, index) => (
              <div
                key={index}
                className={`pagination-dot ${
                  selectedImageIndex === index ? "active" : ""
                }`}
                onClick={() => setSelectedImageIndex(index)}
              ></div>
            ))}
          </div>
          {isImageLightboxOpen && (
            <Lightbox
              open={isImageLightboxOpen}
              close={() => setIsImageLightboxOpen(false)}
              slides={images.map((image) => ({ src: image }))}
              currentIndex={selectedImageIndex}
              onIndexChange={(index) => setSelectedImageIndex(index)}
            />
          )}
        </div>
      )}

      {/* Video Carousel */}
      {videos && videos.length > 0 && (
        <div className="carousel-container">
          <h2>Videos</h2>
          <video
            controls
            className="media-item"
            src={videos[selectedVideoIndex]}
          />
          <div className="pagination-dots">
            {videos.map((_, index) => (
              <div
                key={index}
                className={`pagination-dot ${
                  selectedVideoIndex === index ? "active" : ""
                }`}
                onClick={() => setSelectedVideoIndex(index)}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMedia;
