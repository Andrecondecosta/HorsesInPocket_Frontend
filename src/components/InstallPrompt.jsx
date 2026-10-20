import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { IoShareOutline } from 'react-icons/io5';
import './InstallPrompt.css';

const DISMISSED_KEY = 'installPromptDismissed';

// iPadOS 13+ identifica-se como Mac, por isso também se verifica o ecrã tátil
const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// Já aberta a partir do atalho no ecrã principal (iOS usa navigator.standalone)
const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone === true;

const wasDismissed = () => {
  try {
    return localStorage.getItem(DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
};

/**
 * Aviso para instalar a versão web no ecrã principal.
 * - iPhone/iPad: o Safari não permite instalar por código, por isso mostra instruções.
 * - Android/Chrome: usa o evento beforeinstallprompt para mostrar um botão "Install".
 * Nunca aparece na app nativa (Capacitor), nem quando já está instalada ou foi fechado.
 */
const InstallPrompt = () => {
  const [mode, setMode] = useState(null); // null | 'ios' | 'android'
  const [installEvent, setInstallEvent] = useState(null);

  useEffect(() => {
    if (Capacitor.isNativePlatform() || isStandalone() || wasDismissed()) return;

    if (isIOS()) {
      setMode('ios');
      return;
    }

    const handleBeforeInstallPrompt = (event) => {
      // Impede o mini-banner automático do Chrome; o pedido passa a ser feito pelo botão
      event.preventDefault();
      setInstallEvent(event);
      setMode('android');
    };
    const handleInstalled = () => setMode(null);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, 'true');
    } catch {
      // Sem localStorage (ex.: navegação privada) o aviso só fecha nesta sessão
    }
    setMode(null);
  };

  const install = async () => {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice;
    // O evento só pode ser usado uma vez, aceite ou não
    setInstallEvent(null);
    setMode(null);
  };

  if (!mode) return null;

  return (
    <div className="install-prompt" role="dialog" aria-label="Install HorseHub">
      <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="" className="install-prompt-icon" />

      <div className="install-prompt-text">
        <strong>Install HorseHub</strong>
        {mode === 'ios' ? (
          <span>
            Tap <IoShareOutline className="install-prompt-share" aria-label="Share" /> and then{' '}
            <strong>“Add to Home Screen”</strong>.
          </span>
        ) : (
          <span>Add the app to your home screen for quick access.</span>
        )}
      </div>

      {mode === 'android' && (
        <button type="button" className="install-prompt-button" onClick={install}>
          Install
        </button>
      )}

      <button type="button" className="install-prompt-close" onClick={dismiss} aria-label="Close">
        ×
      </button>
    </div>
  );
};

export default InstallPrompt;
