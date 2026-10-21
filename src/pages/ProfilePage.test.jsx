import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import { jsonResponse } from '../testUtils';

const USER = {
  first_name: 'André',
  last_name: 'Costa',
  email: 'andre@horsehub.test',
  birthdate: '1990-01-31',
  gender: 'male',
  phone_number: '910000001',
  country: 'Portugal',
  created_at: '2025-03-10T10:00:00Z',
};

const mockApi = ({ deleteStatus = 200 } = {}) => {
  global.fetch = vi.fn((url, options = {}) => {
    if (url.endsWith('/delete_account')) return jsonResponse(deleteStatus, deleteStatus === 200 ? {} : { error: 'Server error' });
    if (url.endsWith('/profile')) return jsonResponse(200, USER);
    return jsonResponse(200, {});
  });
};

const renderPage = (setIsLoggedIn = vi.fn()) =>
  render(
    <MemoryRouter initialEntries={['/profile']}>
      <Routes>
        <Route path="/profile" element={<ProfilePage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/login" element={<p>Login page</p>} />
      </Routes>
    </MemoryRouter>
  );

describe('ProfilePage (novo design)', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'jwt-de-teste');
  });

  test('mostra nome, email e dados pessoais, sem nada sobre planos', async () => {
    mockApi();
    renderPage();

    expect(await screen.findByText('andre@horsehub.test')).toBeInTheDocument();
    const main = within(screen.getByRole('main'));
    expect(main.getByText('André Costa')).toBeInTheDocument();
    expect(main.getByText('31/01/1990')).toBeInTheDocument();
    expect(main.getByText('Male')).toBeInTheDocument();
    expect(main.getByText('Portugal')).toBeInTheDocument();
    expect(main.queryByText(/plan|subscription|upgrade/i)).not.toBeInTheDocument();
    expect(main.getByRole('link', { name: 'Edit profile' })).toHaveAttribute('href', '/update-profile');
  });

  test('eliminar a conta só fica ativo depois de escrever DELETE, e termina no login', async () => {
    mockApi();
    const setIsLoggedIn = vi.fn();
    renderPage(setIsLoggedIn);
    await screen.findByText('andre@horsehub.test');

    fireEvent.click(screen.getByTestId('delete-account-btn'));
    const confirm = await screen.findByTestId('delete-confirm-yes');
    expect(confirm).toBeDisabled();

    fireEvent.change(screen.getByTestId('delete-confirm-input'), { target: { value: 'DELETE' } });
    expect(confirm).toBeEnabled();
    fireEvent.click(confirm);

    expect(await screen.findByText('Login page')).toBeInTheDocument();
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(setIsLoggedIn).toHaveBeenCalledWith(false);
  });

  test('se o backend falhar ao eliminar, mostra o erro e mantém a sessão', async () => {
    mockApi({ deleteStatus: 500 });
    renderPage();
    await screen.findByText('andre@horsehub.test');

    fireEvent.click(screen.getByTestId('delete-account-btn'));
    fireEvent.change(await screen.findByTestId('delete-confirm-input'), { target: { value: 'DELETE' } });
    fireEvent.click(screen.getByTestId('delete-confirm-yes'));

    expect(await screen.findByText('Server error')).toBeInTheDocument();
    expect(localStorage.getItem('authToken')).toBe('jwt-de-teste');
  });

  test('Logout a partir da página termina a sessão', async () => {
    mockApi();
    renderPage();
    await screen.findByText('andre@horsehub.test');

    fireEvent.click(within(screen.getByRole('navigation', { name: 'Account' })).getByRole('button', { name: 'Logout' }));
    await waitFor(() => expect(screen.getByText('Login page')).toBeInTheDocument());
    expect(localStorage.getItem('authToken')).toBeNull();
  });
});
