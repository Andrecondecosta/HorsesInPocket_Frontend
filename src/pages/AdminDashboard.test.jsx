import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ProfilePage from './ProfilePage';
import { jsonResponse } from '../testUtils';

const ME = { id: 1, first_name: 'André', last_name: 'Costa', email: 'andre@horsehub.test', admin: true };
const USERS = [
  ME,
  { id: 2, first_name: 'Ana', last_name: 'Silva', email: 'ana@horsehub.test', country: 'Portugal', created_at: '2026-02-01T10:00:00Z' },
  { id: 3, first_name: 'Rui', last_name: 'Gomes', email: 'rui@horsehub.test', country: 'Spain', created_at: '2026-05-01T10:00:00Z' },
];
const HORSES = [
  { id: 10, name: 'Zéfiro', user_id: 2, age: 2015, created_at: '2026-03-01T10:00:00Z' },
  { id: 11, name: 'Aurora', user_id: 3, age: 2018, created_at: '2026-06-01T10:00:00Z' },
];
const LOGS = [{ id: 5, action: 'shared_via_link', horse_name: 'Zéfiro', recipient: 'Rui', created_at: '2026-10-01T10:00:00Z' }];

const mockApi = ({ status = 200, deleteStatus = 200 } = {}) => {
  global.fetch = vi.fn((url, opts = {}) => {
    if (opts.method === 'DELETE') return jsonResponse(deleteStatus, {});
    if (url.endsWith('/profile')) return jsonResponse(200, ME);
    if (url.includes('/admin/') && status !== 200) return jsonResponse(status, { error: 'Acesso negado' });
    if (url.endsWith('/admin/statistics')) return jsonResponse(200, { total_users: 3, total_horses: 2, total_logs: 1 });
    if (url.endsWith('/admin/users')) return jsonResponse(200, USERS);
    if (url.endsWith('/admin/horses')) return jsonResponse(200, HORSES);
    if (url.endsWith('/admin/logs')) return jsonResponse(200, LOGS);
    return jsonResponse(200, {});
  });
};

const renderAdmin = () =>
  render(
    <MemoryRouter initialEntries={['/admin/dashboard']}>
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => localStorage.setItem('authToken', 'jwt-de-teste'));

describe('AdminDashboard (novo design)', () => {
  test('mostra os números e a lista de utilizadores, sem botão para apagar a própria conta', async () => {
    mockApi();
    renderAdmin();

    expect(await screen.findAllByText('ana@horsehub.test')).not.toHaveLength(0);
    expect(screen.getByRole('button', { name: /Users\s*3/ })).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(screen.queryAllByRole('button', { name: 'Delete André Costa' })).toHaveLength(0));
    expect(screen.getAllByRole('button', { name: 'Delete Ana Silva' }).length).toBeGreaterThan(0);
  });

  test('cavalos mostram o dono; a atividade usa os campos reais do log', async () => {
    mockApi();
    renderAdmin();
    await screen.findAllByText('ana@horsehub.test');

    fireEvent.click(screen.getByRole('button', { name: /Horses\s*2/ }));
    expect(within(screen.getByTestId('horses-row-10')).getByText('Ana Silva')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Activity\s*1/ }));
    expect(screen.getByText('Shared via link')).toBeInTheDocument();
  });

  test('apagar utilizador pede confirmação num diálogo e retira-o da lista', async () => {
    mockApi();
    renderAdmin();
    await screen.findAllByText('ana@horsehub.test');

    fireEvent.click(screen.getAllByRole('button', { name: 'Delete Ana Silva' })[0]);
    const dialog = await screen.findByTestId('admin-delete-user-modal');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete user' }));

    await waitFor(() => expect(screen.queryByTestId('users-row-2')).not.toBeInTheDocument());
    expect(global.fetch.mock.calls.some(([url, o]) => url.endsWith('/admin/users/2') && o?.method === 'DELETE')).toBe(true);
  });

  test('sem permissão (403) mostra o aviso', async () => {
    mockApi({ status: 403 });
    renderAdmin();
    expect(await screen.findByText('You do not have access to the control panel.')).toBeInTheDocument();
  });

  test('ordena pelos cabeçalhos da tabela', async () => {
    mockApi();
    renderAdmin();
    await screen.findAllByText('ana@horsehub.test');
    fireEvent.click(screen.getByRole('button', { name: 'Name' }));
    const ids = screen.getAllByTestId(/^users-row-/).map((row) => row.getAttribute('data-testid'));
    expect(ids).toEqual(['users-row-2', 'users-row-1', 'users-row-3']);
  });
});

describe('Link para o Admin no Profile', () => {
  const renderProfile = (user) => {
    global.fetch = vi.fn(() => jsonResponse(200, user));
    return render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('aparece só para administradores', async () => {
    const { unmount } = renderProfile(ME);
    expect(await screen.findByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin/dashboard');
    unmount();

    renderProfile({ ...ME, admin: false });
    await screen.findByText('andre@horsehub.test');
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  });
});
