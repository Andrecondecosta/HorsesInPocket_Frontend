import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import SharedHorse from './SharedHorse';
import { jsonResponse } from '../testUtils';

// Mostra para onde o SharedHorse navegou (caminho, query e mensagem no state)
const LocationProbe = () => {
  const location = useLocation();
  return (
    <>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="search">{location.search}</div>
      <div data-testid="state-message">{location.state?.message || ''}</div>
    </>
  );
};

const renderSharedLink = (url = '/horses/shared/abc123?horseImage=http%3A%2F%2Fimg&horseName=Bolt') =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/horses/shared/:token" element={<SharedHorse />} />
        <Route path="*" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>
  );

const waitForPath = (pathname) =>
  waitFor(() => expect(screen.getByTestId('pathname')).toHaveTextContent(pathname));

describe('SharedHorse — utilizador com sessão', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'jwt-de-teste');
  });

  test('200: adiciona o cavalo e vai para /received sem mensagem de erro', async () => {
    global.fetch = vi.fn(() => jsonResponse(200, { message: 'ok' }));
    renderSharedLink();

    await waitForPath('/received');
    expect(screen.getByTestId('state-message')).toHaveTextContent('');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/horses/shared/abc123'),
      expect.objectContaining({ headers: { Authorization: 'Bearer jwt-de-teste' } })
    );
  });

  test.each([
    [403, 'This sharing link has already been used or expired.'],
    [404, 'This sharing link is invalid.'],
    [500, 'Error processing the sharing link. Please try again.'],
  ])('%i: vai para /received com a mensagem certa', async (status, message) => {
    global.fetch = vi.fn(() => jsonResponse(status, { error: 'qualquer' }));
    renderSharedLink();

    await waitForPath('/received');
    expect(screen.getByTestId('state-message')).toHaveTextContent(message);
  });
});

describe('SharedHorse — utilizador sem sessão', () => {
  test('401 (link existente): segue para /welcome sem mensagem de erro', async () => {
    global.fetch = vi.fn(() => jsonResponse(401, { error: 'login' }));
    renderSharedLink();

    await waitForPath('/welcome');
    const params = new URLSearchParams(screen.getByTestId('search').textContent);
    expect(params.get('token')).toBe('abc123');
    expect(params.get('message')).toBeNull();
  });

  test('404 (link inexistente): segue para /welcome com mensagem de link inválido', async () => {
    global.fetch = vi.fn(() => jsonResponse(404, { error: 'not found' }));
    renderSharedLink();

    await waitForPath('/welcome');
    const params = new URLSearchParams(screen.getByTestId('search').textContent);
    expect(params.get('message')).toBe('This sharing link is invalid.');
    expect(params.get('horseName')).toBe('Bolt');
  });
});
