import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { Capacitor } from '@capacitor/core';
import InstallPrompt from './InstallPrompt';

const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36';

const setUserAgent = (ua) => vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(ua);

// Simula o evento que o Chrome dispara quando a app pode ser instalada
const fireBeforeInstallPrompt = () => {
  const event = new Event('beforeinstallprompt');
  event.prompt = vi.fn();
  event.userChoice = Promise.resolve({ outcome: 'accepted' });
  act(() => {
    window.dispatchEvent(event);
  });
  return event;
};

describe('InstallPrompt', () => {
  afterEach(() => {
    delete window.navigator.standalone;
  });

  test('iPhone no Safari: mostra as instruções de "Add to Home Screen"', () => {
    setUserAgent(IPHONE_UA);
    render(<InstallPrompt />);

    expect(screen.getByText('Install HorseHub')).toBeInTheDocument();
    expect(screen.getByText(/Add to Home Screen/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Install' })).not.toBeInTheDocument();
  });

  test('fechar o aviso esconde-o e não volta a aparecer', () => {
    setUserAgent(IPHONE_UA);
    const { unmount } = render(<InstallPrompt />);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText('Install HorseHub')).not.toBeInTheDocument();

    unmount();
    render(<InstallPrompt />);
    expect(screen.queryByText('Install HorseHub')).not.toBeInTheDocument();
  });

  test('iPhone já aberto pelo atalho do ecrã principal: não mostra nada', () => {
    setUserAgent(IPHONE_UA);
    window.navigator.standalone = true;
    render(<InstallPrompt />);

    expect(screen.queryByText('Install HorseHub')).not.toBeInTheDocument();
  });

  test('app nativa (Capacitor): não mostra nada', () => {
    setUserAgent(IPHONE_UA);
    vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);
    render(<InstallPrompt />);

    expect(screen.queryByText('Install HorseHub')).not.toBeInTheDocument();
  });

  test('Android: só aparece com beforeinstallprompt e o botão Install abre o pedido do sistema', async () => {
    setUserAgent(ANDROID_UA);
    render(<InstallPrompt />);
    expect(screen.queryByText('Install HorseHub')).not.toBeInTheDocument();

    const event = fireBeforeInstallPrompt();
    fireEvent.click(screen.getByRole('button', { name: 'Install' }));

    expect(event.prompt).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByText('Install HorseHub')).not.toBeInTheDocument());
  });
});
