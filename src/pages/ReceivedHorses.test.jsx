import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ReceivedHorses from './ReceivedHorses';
import { jsonResponse } from '../testUtils';

const HORSES = [
  { id: 1, name: 'Zéfiro', breed: 'Lusitano', gender: 'Stallion', age: 2015, images: [], sender_name: 'Ana Silva', status: 'active', created_at: '2025-01-10T10:00:00Z' },
  { id: 2, name: 'Aurora', breed: 'Lusitano', gender: 'Mare', age: 2018, images: [], sender_name: 'Desconhecido', status: 'pending_approval', created_at: '2025-03-05T10:00:00Z' },
  { id: 3, name: 'Bolt', images: [], sender_name: 'Rui', status: 'revoked', created_at: '2025-06-20T10:00:00Z' },
];

const mockApi = (horses = HORSES) => {
  global.fetch = vi.fn((url) => {
    if (url.endsWith('/received')) return jsonResponse(200, horses);
    return jsonResponse(200, {});
  });
};

const renderPage = (entry = '/received') =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/received" element={<ReceivedHorses />} />
      </Routes>
    </MemoryRouter>
  );

describe('ReceivedHorses (novo design)', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'jwt-de-teste');
  });

  test('lista os cavalos recebidos (sem os revogados), com quem os enviou e acesso só de leitura', async () => {
    mockApi();
    renderPage();

    const zefiro = within(await screen.findByTestId('received-card-1'));
    expect(zefiro.getByText('From Ana Silva')).toBeInTheDocument();
    expect(zefiro.getByRole('link')).toHaveAttribute('href', '/horses/1?readonly=true');

    expect(screen.queryByTestId('received-card-3')).not.toBeInTheDocument();
    expect(screen.getByText(/2 horses · read-only access/)).toBeInTheDocument();
  });

  test('acesso em pausa por screenshot: não abre e mostra o aviso; remetente desconhecido em inglês', async () => {
    mockApi();
    renderPage();

    const aurora = within(await screen.findByTestId('received-card-2'));
    expect(aurora.queryByRole('link')).not.toBeInTheDocument();
    expect(aurora.getByText(/Screenshot detected/)).toBeInTheDocument();
    expect(aurora.getByText('Unknown sender')).toBeInTheDocument();
  });

  test('mostra a mensagem vinda do link de partilha e permite fechá-la', async () => {
    mockApi();
    render(
      <MemoryRouter initialEntries={[{ pathname: '/received', state: { message: 'This sharing link has already been used or expired.', type: 'error' } }]}>
        <Routes>
          <Route path="/received" element={<ReceivedHorses />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('This sharing link has already been used or expired.');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss message' }));
    await waitFor(() => expect(screen.queryByText(/already been used/)).not.toBeInTheDocument());
  });

  test('sem cavalos recebidos mostra o estado vazio', async () => {
    mockApi([]);
    renderPage();
    expect(await screen.findByText('No received horses yet')).toBeInTheDocument();
  });

  test('a pesquisa também procura pelo nome de quem enviou', async () => {
    mockApi();
    renderPage();
    await screen.findByTestId('received-card-1');

    fireEvent.change(screen.getByLabelText('Search received horses'), { target: { value: 'ana' } });
    expect(screen.getAllByTestId(/^received-card-/).map((c) => c.getAttribute('data-testid'))).toEqual(['received-card-1']);
  });
});
