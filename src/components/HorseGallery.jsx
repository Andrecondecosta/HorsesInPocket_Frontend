import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

/**
 * Galeria do cavalo: fotografias em grelha (abrem em ecrã inteiro) e vídeos.
 * Os vídeos mantêm as proteções do componente antigo: sem download, sem
 * picture-in-picture e sem menu de contexto.
 */
const HorseGallery = ({ name, images = [], videos = [] }) => {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  if (images.length === 0 && videos.length === 0) {
    return (
      <p className="rounded-[14px] border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
        No photos or videos yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {images.length > 0 && (
        <section aria-label="Photos" className="flex flex-col gap-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Photos · {images.length}
          </h3>
          <ul className="grid grid-cols-3 gap-1.5 md:grid-cols-4 md:gap-2">
            {images.map((src, index) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Open photo ${index + 1} of ${name}`}
                  className="block aspect-square w-full overflow-hidden rounded-lg bg-[#e3ded3]"
                >
                  <img src={src} alt="" className="size-full object-cover transition-transform hover:scale-[1.03]" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {videos.length > 0 && (
        <section aria-label="Videos" className="flex flex-col gap-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Videos · {videos.length}
          </h3>
          <ul className="grid gap-3 md:grid-cols-2">
            {videos.map((src) => (
              <li key={src}>
                <video
                  controls
                  src={src}
                  className="aspect-video w-full rounded-lg bg-black"
                  controlsList="nodownload"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <Lightbox
        open={lightboxIndex >= 0}
        index={Math.max(lightboxIndex, 0)}
        close={() => setLightboxIndex(-1)}
        slides={images.map((src) => ({ src }))}
      />
    </div>
  );
};

export default HorseGallery;
