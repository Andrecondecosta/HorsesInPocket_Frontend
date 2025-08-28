// hooks/useScreenshotProtection.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useScreenshotProtection = (options) => {
  const { horseId, duration = 8000 } = options || {};
  const [screenshotTaken, setScreenshotTaken] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!horseId) return;

    const notifyBackend = async () => {
      try {
        console.log("📡 A enviar screenshot com horse_id:", horseId);
        await fetch(`${process.env.REACT_APP_API_SERVER_URL}/screenshots`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ horse_id: horseId })
        });
        console.log("✅ Screenshot reportado ao backend com sucesso");
      } catch (error) {
        console.error("❌ Erro ao reportar screenshot:", error);
      }
    };

    window.__onCapEvent = (eventName) => {
      if (eventName === 'screenshotTaken') {
        console.warn('📸 Screenshot detectado!');
        setScreenshotTaken(true);

        notifyBackend();
        navigate("/received", { state: { refresh: true }});

        setTimeout(() => {
          setScreenshotTaken(false);
        }, duration);
      }
    };

    return () => {
      window.__onCapEvent = null;
    };
  }, [horseId, duration, token, navigate]);

  return { screenshotTaken };
};
