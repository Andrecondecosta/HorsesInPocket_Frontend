import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MyHorses from './MyHorses';
import { jsonResponse } from '../testUtils';

const HORSES = [
  { id: 1, name: 'Zéfiro', breed: 'Lusitano', gender: 'Stallion', age: 2015, color: 'Bay', images: ['http://img/zefiro.jpg'], created_at: '2025-01-10T10:00:00Z' },
  { id: 2, name: 'Aurora', breed: 'Lusitano', gender: 'Mare', age: 2018, color: 'Grey', images: [], created_at: '2025-03-05T10:00:00Z' },
  { id: 3, name: 'Bolt', breed: 'Sela Francês', gender: 'Gelding', age: 2016, color: 'Chestnut', images: [], created_at: '2025-06-20T10:00:00Z' },
];

// Responde aos pedidos da página conforme o URL
const mockApi = ({ horses = HORSES, status = { used_horses: 3, max_horses: 10 } } = {}) => {
  global.fetch = vi.fn((url) => {
    if (url.endsWith('/horses')) return jsonResponse(200, horses);
    if (url.endsWith('/user_status')) return jsonResponse(200, status);
    if (url.endsWith('/profile')) return jsonResponse(200, { first_name: 'André', last_name: 'Costa' });
    return jsonResponse(200, {});
  });
};

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/myhorses']}>
      <Routes>
        <Route path="/myhorses" element={<MyHorses />} />
        <Route path="/newhorse" element={<p>New horse page</p>} />
      </Routes>
    </MemoryRouter>
  );

describe('MyHorses (novo design)', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'jwt-de-teste');
  });

  test('lista os cavalos do mais recente para o mais antigo, com número de catálogo pela ordem de criação', async () => {
    mockApi();
    renderPage();

    const cards = await screen.findAllByTestId(/^horse-card-/);
    expect(cards.map((card) => card.getAttribute('data-testid'))).toEqual(['horse-card-3', 'horse-card-2', 'horse-card-1']);

    const zefiro = within(screen.getByTestId('horse-card-1'));
    expect(zefiro.getAllByText('No. 01')).not.toHaveLength(0);
    expect(zefiro.getByText('Lusitano · Stallion · 2015')).toBeInTheDocument();
    expect(zefiro.getByRole('link')).toHaveAttribute('href', '/horses/1');
    expect(screen.getByText('3 horses')).toBeInTheDocument();
  });

  test('a pesquisa filtra por nome, raça ou cor', async () => {
    mockApi();
    renderPage();
    await screen.findAllByTestId(/^horse-card-/);

    fireEvent.change(screen.getByLabelText('Search horses'), { target: { value: 'sela' } });
    expect(screen.getAllByTestId(/^horse-card-/).map((c) => c.getAttribute('data-testid'))).toEqual(['horse-card-3']);

    fireEvent.change(screen.getByLabelText('Search horses'), { target: { value: 'grey' } });
    expect(screen.getAllByTestId(/^horse-card-/).map((c) => c.getAttribute('data-testid'))).toEqual(['horse-card-2']);

    fireEvent.change(screen.getByLabelText('Search horses'), { target: { value: 'xyz' } });
    expect(screen.queryAllByTestId(/^horse-card-/)).toHaveLength(0);
    expect(screen.getByText(/No horses match/)).toBeInTheDocument();
  });

  test('sem cavalos mostra o estado vazio', async () => {
    mockApi({ horses: [] });
    renderPage();
    expect(await screen.findByText('No horses yet')).toBeInTheDocument();
  });

  test('abaixo do limite, "Add horse" abre o formulário de novo cavalo', async () => {
    mockApi();
    renderPage();
    await screen.findAllByTestId(/^horse-card-/);

    fireEvent.click(screen.getByTestId('create-horse-btn'));
    expect(await screen.findByText('New horse page')).toBeInTheDocument();
  });

  test('no limite do plano mostra a janela de limite com "View my plan" (web)', async () => {
    mockApi({ status: { used_horses: 3, max_horses: 3 } });
    renderPage();
    await screen.findAllByTestId(/^horse-card-/);
    // espera que o estado do plano chegue antes de clicar
    await vi.waitFor(() => expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/user_status'), expect.anything()));

    fireEvent.click(screen.getByTestId('create-horse-btn'));

    const dialog = await screen.findByTestId('horse-limit-popup');
    expect(within(dialog).getByText('Horse limit reached')).toBeInTheDocument();
    expect(within(dialog).getByTestId('limit-popup-upgrade-btn')).toBeInTheDocument();
  });
});
