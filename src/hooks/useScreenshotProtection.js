import { useEffect, useState } from 'react';

export const useScreenshotProtection = (duration = 8000) => {
  const [screenshotTaken, setScreenshotTaken] = useState(false);

  useEffect(() => {
    window.__onCapEvent = (eventName) => {
      if (eventName === 'screenshotTaken') {
        console.warn('📸 Screenshot detectado!');
        setScreenshotTaken(true);

        // Opcional: volta ao normal após alguns segundos
        setTimeout(() => {
          setScreenshotTaken(false);
        }, duration);
      }
    };

    return () => {
      window.__onCapEvent = null;
    };
  }, [duration]);

  return { screenshotTaken };
};
