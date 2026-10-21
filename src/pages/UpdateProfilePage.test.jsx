import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import UpdateProfilePage from './UpdateProfilePage';
import { jsonResponse } from '../testUtils';

const USER = {
  first_name: 'André',
  last_name: 'Costa',
  birthdate: '1990-01-31',
  gender: 'male',
  phone_number: '910000001',
  country: 'Portugal',
};

const COUNTRIES = [
  { code: 'PT', name: 'Portugal' },
  { code: 'ES', name: 'Spain' },
];

const mockApi = ({ updateStatus = 200 } = {}) => {
  global.fetch = vi.fn((url) => {
    if (url.endsWith('/update')) return jsonResponse(updateStatus, {});
    if (url.endsWith('/countries')) return jsonResponse(200, COUNTRIES);
    if (url.endsWith('/profile')) return jsonResponse(200, USER);
    return jsonResponse(200, {});
  });
};

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/update-profile']}>
      <Routes>
        <Route path="/update-profile" element={<UpdateProfilePage />} />
        <Route path="/profile" element={<p>Profile page</p>} />
      </Routes>
    </MemoryRouter>
  );

describe('UpdateProfilePage (novo design)', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'jwt-de-teste');
  });

  test('preenche o formulário com o perfil e grava com o mesmo pedido de antes', async () => {
    mockApi();
    renderPage();

    expect(await screen.findByLabelText('First name')).toHaveValue('André');
    expect(screen.getByLabelText('Date of birth')).toHaveValue('1990-01-31');
    expect(await screen.findByRole('option', { name: 'Spain' })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Country'), { target: { value: 'Spain' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByText('Profile updated successfully!')).toBeInTheDocument();
    const [, options] = global.fetch.mock.calls.find(([url]) => url.endsWith('/update'));
    expect(options.method).toBe('PUT');
    expect(JSON.parse(options.body)).toEqual({ user: { ...USER, country: 'Spain' } });
    expect(await screen.findByText('Profile page', {}, { timeout: 3000 })).toBeInTheDocument();
  });

  test('se gravar falhar, o erro aparece e o formulário continua lá', async () => {
    mockApi({ updateStatus: 422 });
    renderPage();

    fireEvent.click(await screen.findByRole('button', { name: 'Save changes' }));

    expect(await screen.findByText(/could not be saved/)).toBeInTheDocument();
    expect(screen.getByLabelText('First name')).toHaveValue('André');
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
  });
});
