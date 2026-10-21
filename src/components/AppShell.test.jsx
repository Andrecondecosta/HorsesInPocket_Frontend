import React from 'react';
import { cleanup, render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AppShell from './AppShell';
import { jsonResponse } from '../testUtils';

const renderShell = (setIsLoggedIn = vi.fn()) =>
  render(
    <MemoryRouter initialEntries={['/myhorses']}>
      <Routes>
        <Route path="/myhorses" element={<AppShell setIsLoggedIn={setIsLoggedIn}><p>Conteúdo</p></AppShell>} />
        <Route path="/login" element={<p>Login page</p>} />
      </Routes>
    </MemoryRouter>
  );

describe('AppShell', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'jwt-de-teste');
    global.fetch = vi.fn(() => jsonResponse(200, { first_name: 'André', last_name: 'Costa' }));
  });

  test('barra de separadores com as 4 secções e a página atual marcada', () => {
    renderShell();
    const nav = within(screen.getByRole('navigation', { name: 'Main' }));

    expect(nav.getAllByRole('link').map((link) => link.getAttribute('href')))
      .toEqual(['/dashboard', '/myhorses', '/received', '/profile']);
    expect(nav.getByRole('link', { name: 'Horses' })).toHaveAttribute('aria-current', 'page');
  });

  test('mostra o nome e as iniciais do utilizador no menu da conta', async () => {
    renderShell();
    expect(await screen.findByText('Hello, André')).toBeInTheDocument();
    expect(screen.getByText('AC')).toBeInTheDocument();
  });

  test('Logout apaga a sessão e volta ao login', async () => {
    const setIsLoggedIn = vi.fn();
    renderShell(setIsLoggedIn);

    const trigger = screen.getByRole('button', { name: 'Account menu' });
    fireEvent.keyDown(trigger, { key: 'Enter' });
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Logout' }));

    expect(await screen.findByText('Login page')).toBeInTheDocument();
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(setIsLoggedIn).toHaveBeenCalledWith(false);
  });

  test('marca o body enquanto a barra inferior existe (para o aviso de instalação subir)', () => {
    const { unmount } = renderShell();
    expect(document.body).toHaveClass('hh-has-tabbar');
    unmount();
    expect(document.body).not.toHaveClass('hh-has-tabbar');
  });
});

describe('AppShell — separador ativo no perfil de um cavalo', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() => jsonResponse(200, {}));
  });

  const activeTabAt = (url) => {
    render(
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/horses/:id" element={<AppShell><p>Perfil</p></AppShell>} />
          <Route path="*" element={<AppShell><p>Outro ecrã</p></AppShell>} />
        </Routes>
      </MemoryRouter>
    );
    return within(screen.getByRole('navigation', { name: 'Main' }))
      .getAllByRole('link')
      .find((link) => link.getAttribute('aria-current') === 'page')
      ?.textContent;
  };

  test('cavalo próprio → "Horses"', () => {
    expect(activeTabAt('/horses/1')).toBe('Horses');
  });

  test('cavalo recebido (readonly) → "Received"', () => {
    expect(activeTabAt('/horses/1?readonly=true')).toBe('Received');
  });

  test('formulários ficam no separador de onde se chega: novo cavalo → "Horses", editar perfil → "Profile"', () => {
    expect(activeTabAt('/newhorse')).toBe('Horses');
    cleanup();
    expect(activeTabAt('/update-profile')).toBe('Profile');
  });
});
