import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import { jsonResponse } from '../testUtils';

const LOGS = [
  // formato real do backend: "AAAA-MM-DD HH:MM", com espaço (o Safari não o lê sem conversão)
  { id: 2, action: 'shared_via_link', horse_name: 'Zéfiro', recipient: 'Pending - Will be assigned when used', created_at: '2026-10-20 21:05' },
  { id: 1, action: 'approved_share', horse_name: 'Zéfiro', recipient: 'Recetor Teste', created_at: '2026-10-20 21:07' },
];

const mockApi = ({ status = { used_horses: 0, used_shares: 3, max_shares: 6 }, alerts = [] } = {}) => {
  global.fetch = vi.fn((url, options = {}) => {
    if (url.endsWith('/profile')) return jsonResponse(200, { first_name: 'André', last_name: 'Costa' });
    if (url.endsWith('/user_status')) return jsonResponse(200, status);
    if (url.endsWith('/horses')) return jsonResponse(200, [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    if (url.endsWith('/received')) return jsonResponse(200, [{ id: 9, status: 'active' }, { id: 8, status: 'revoked' }]);
    if (url.endsWith('/screenshot_alerts')) return jsonResponse(200, { screenshot_alerts: alerts });
    if (url.endsWith('/logs')) return jsonResponse(200, LOGS);
    if (options.method === 'POST') return jsonResponse(200, {});
    return jsonResponse(200, {});
  });
};

const renderDashboard = () =>
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </MemoryRouter>
  );

describe('Dashboard (novo design)', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'jwt-de-teste');
    window.scrollTo = vi.fn();
  });

  test('saudação com o nome e números do portefólio (cavalos reais, não o contador do plano; recebidos revogados não contam)', async () => {
    mockApi();
    renderDashboard();

    expect(await screen.findByRole('heading', { name: /, André$/ })).toBeInTheDocument();

    const main = within(screen.getByRole('main'));
    const horses = main.getByRole('link', { name: /^Horses/ });
    expect(horses).toHaveAttribute('href', '/myhorses');
    await waitFor(() => expect(horses).toHaveTextContent('4'));

    const received = main.getByRole('link', { name: /^Received/ });
    expect(received).toHaveAttribute('href', '/received');
    await waitFor(() => expect(received).toHaveTextContent('1'));

    expect(main.queryByText(/plan/i)).not.toBeInTheDocument();
  });

  test('atividade recente com datas legíveis a partir do formato do backend', async () => {
    mockApi();
    renderDashboard();

    const activity = within(await screen.findByRole('region', { name: 'Recent activity' }));
    expect(await activity.findByText('· Shared via link')).toBeInTheDocument();
    expect(activity.getByText('Waiting to be opened')).toBeInTheDocument();
    expect(activity.getByText('Recetor Teste')).toBeInTheDocument();
    expect(activity.getAllByText(/20\/10\/2026/, { selector: 'time' })).toHaveLength(4); // 2 entradas × (telemóvel + computador)
    expect(activity.queryByText(/Invalid Date/)).not.toBeInTheDocument();
  });

  test('alertas de screenshot: aprovar retira o alerta da lista', async () => {
    mockApi({ alerts: [{ horse_id: 26, horse_name: 'Zéfiro', alerts: [{ user_horse_id: 77 }] }] });
    renderDashboard();

    expect(await screen.findByTestId('screenshot-alerts-section')).toHaveTextContent('1 pending');
    fireEvent.click(screen.getByTestId('sa-approve-btn-77'));

    await waitFor(() => expect(screen.queryByTestId('screenshot-alerts-section')).not.toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/user_horses/77/approve_screenshot'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('novo utilizador vê a janela de boas-vindas uma única vez', async () => {
    mockApi();
    localStorage.setItem('hasSeenPopup', 'newUser');
    renderDashboard();

    expect(await screen.findByText('Welcome to HorseHub')).toBeInTheDocument();
    expect(localStorage.getItem('hasSeenPopup')).toBe('true');
    expect(screen.getByText('HorseHub is free to use.')).toBeInTheDocument();
    expect(screen.queryByText(/months free|Ultimate/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    await waitFor(() => expect(screen.queryByText('Welcome to HorseHub')).not.toBeInTheDocument());
  });
});
