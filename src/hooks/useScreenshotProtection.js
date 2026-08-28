// hooks/useScreenshotProtection.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Número total de tentativas (1 original + 2 repetições) e pausa entre elas
const MAX_REPORT_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useScreenshotProtection = (options) => {
  const { horseId, duration = 8000 } = options || {};
  const [screenshotTaken, setScreenshotTaken] = useState(false);
  const [reportFailed, setReportFailed] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!horseId) return;

    // Faz UMA tentativa de reportar o screenshot; lança exceção se falhar
    // (erro de rede ou resposta HTTP não-ok), em vez de engolir o erro.
    const notifyBackend = async () => {
      console.log("Sending screenshot report for horse_id:", horseId);
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/screenshots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ horse_id: horseId })
      });

      if (!response.ok) {
        throw new Error(`Screenshot report failed with status ${response.status}`);
      }

      console.log("Screenshot reported to backend successfully");
    };

    // Repete notifyBackend até MAX_REPORT_ATTEMPTS vezes, com pausa entre tentativas.
    // Devolve true só quando o report for confirmado com sucesso.
    const notifyBackendWithRetry = async () => {
      for (let attempt = 1; attempt <= MAX_REPORT_ATTEMPTS; attempt++) {
        try {
          await notifyBackend();
          return true;
        } catch (error) {
          console.error(`Error reporting screenshot (tentativa ${attempt}/${MAX_REPORT_ATTEMPTS}):`, error);
          if (attempt < MAX_REPORT_ATTEMPTS) {
            await sleep(RETRY_DELAY_MS);
          }
        }
      }
      return false;
    };

   window.__onCapEvent = async (eventName) => {
  if (eventName === 'screenshotTaken') {
    console.warn('Screenshot detected!');
    setScreenshotTaken(true);
    setReportFailed(false);

    const reported = await notifyBackendWithRetry();

    if (reported) {
      navigate('/received', { state: { refresh: true } });
    } else {
      // Todas as tentativas falharam: não navegar como se tivesse corrido bem.
      // Mantém o estado de falha visível e avisa o utilizador diretamente.
      setReportFailed(true);
      alert('Não foi possível reportar o screenshot ao servidor. Verifica a tua ligação à internet e tenta novamente.');
    }

    setTimeout(() => {
      setScreenshotTaken(false);
    }, duration);
  }
};

    return () => {
      window.__onCapEvent = null;
    };
  }, [horseId, duration, token, navigate]);

  return { screenshotTaken, reportFailed };
};
