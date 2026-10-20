import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProfileHorse from './ProfileHorse';
import { jsonResponse } from '../testUtils';

const horse = (isOwner) => ({
  id: 1,
  name: 'Bolt',
  is_owner: isOwner,
  height_cm: 1.6,
  images: [],
  videos: [],
  ancestors: [],
});

// Responde aos pedidos da página conforme o URL
const mockApi = (isOwner) => {
  global.fetch = vi.fn((url) => {
    if (url.endsWith('/horses/1')) return jsonResponse(200, horse(isOwner));
    if (url.endsWith('/user_status')) return jsonResponse(200, { used_shares: 0, max_shares: 5 });
    if (url.endsWith('/screenshots')) return jsonResponse(201, {});
    return jsonResponse(200, []);
  });
};

const renderProfile = () =>
  render(
    <MemoryRouter initialEntries={['/horses/1']}>
      <Routes>
        <Route path="/horses/:id" element={<ProfileHorse />} />
        <Route path="/received" element={<p>Received page</p>} />
      </Routes>
    </MemoryRouter>
  );

const screenshotReports = () =>
  global.fetch.mock.calls.filter(
    ([url, options]) => url.endsWith('/screenshots') && options?.method === 'POST'
  );

describe('ProfileHorse — proteção contra screenshots', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'jwt-de-teste');
    delete window.__onCapEvent;
  });

  test('o dono não fica com o listener de screenshots ativo', async () => {
    mockApi(true);
    renderProfile();

    expect(await screen.findByText('Bolt')).toBeInTheDocument();
    expect(window.__onCapEvent).toBeFalsy();
    expect(screenshotReports()).toHaveLength(0);
  });

  test('quem recebeu o cavalo é reportado e levado para /received', async () => {
    mockApi(false);
    renderProfile();

    expect(await screen.findByText('Bolt')).toBeInTheDocument();
    await waitFor(() => expect(typeof window.__onCapEvent).toBe('function'));

    await act(async () => {
      await window.__onCapEvent('screenshotTaken');
    });

    expect(screenshotReports()).toHaveLength(1);
    expect(await screen.findByText('Received page')).toBeInTheDocument();
  });
});
