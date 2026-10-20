import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareHorse from './ShareHorse';
import { jsonResponse } from '../testUtils';

const HORSE = { id: 7, name: 'Bolt', images: ['http://img/bolt.jpg'] };

// Responde aos pedidos do modal conforme o URL e o método
const mockApi = ({ horseStatus = 200 } = {}) => {
  global.fetch = vi.fn((url, options = {}) => {
    if (url.endsWith('/share_via_link')) {
      return jsonResponse(201, { link: 'https://app/horses/shared/tok123' });
    }
    if (url.endsWith('/horses/7') && (options.method || 'GET') === 'GET') {
      return jsonResponse(horseStatus, HORSE);
    }
    return jsonResponse(200, {});
  });
};

const shareLinkCalls = () =>
  global.fetch.mock.calls.filter(([url]) => url.endsWith('/share_via_link'));

describe('ShareHorse', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'jwt-de-teste');
  });

  test('abrir o modal não gera link (não gasta quota)', async () => {
    mockApi();
    render(<ShareHorse horseId={7} onClose={vi.fn()} />);

    expect(await screen.findByRole('button', { name: /generate link/i })).toBeInTheDocument();
    expect(shareLinkCalls()).toHaveLength(0);
    expect(screen.queryByRole('button', { name: /copy link/i })).not.toBeInTheDocument();
  });

  test('o link só é gerado ao clicar em "Generate Link", uma única vez', async () => {
    mockApi();
    render(<ShareHorse horseId={7} onClose={vi.fn()} />);

    userEvent.click(await screen.findByRole('button', { name: /generate link/i }));

    expect(await screen.findByRole('button', { name: /copy link/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /whatsapp/i })).toBeInTheDocument();
    expect(shareLinkCalls()).toHaveLength(1);
  });

  test('email inválido mostra erro sem esconder os botões, e Cancel fecha o modal', async () => {
    mockApi();
    const onClose = vi.fn();
    render(<ShareHorse horseId={7} onClose={onClose} />);

    userEvent.type(await screen.findByPlaceholderText('Enter email'), 'abc');
    userEvent.click(screen.getByRole('button', { name: 'Share' }));

    expect(await screen.findByText('Enter a valid email.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate link/i })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('falha ao carregar o cavalo mostra o erro e um botão Close', async () => {
    mockApi({ horseStatus: 500 });
    const onClose = vi.fn();
    render(<ShareHorse horseId={7} onClose={onClose} />);

    expect(await screen.findByText('Error loading horse data.')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
