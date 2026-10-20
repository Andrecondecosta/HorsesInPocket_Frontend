import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Content from './Content';
import { jsonResponse } from '../testUtils';

// O lightbox é distribuído só como ESM, que o Jest do react-scripts não transforma
jest.mock('yet-another-react-lightbox', () => () => null);
jest.mock('yet-another-react-lightbox/styles.css', () => ({}), { virtual: true });

// JWT sem assinatura válida: chega para o jwtDecode do ProtectedRoute ler o "exp"
const fakeJwt = (exp) => {
  const encode = (obj) => btoa(JSON.stringify(obj)).replace(/=+$/, '');
  return `${encode({ alg: 'HS256' })}.${encode({ exp })}.assinatura`;
};

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Content setIsLoggedIn={() => {}} />
    </MemoryRouter>
  );

describe('Rota /dashboard', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => jsonResponse(200, []));
  });

  test('sem sessão, redireciona para o login', async () => {
    renderAt('/dashboard');

    expect(await screen.findByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Dashboard' })).not.toBeInTheDocument();
  });

  test('com token expirado, redireciona para o login e apaga o token', async () => {
    localStorage.setItem('authToken', fakeJwt(Math.floor(Date.now() / 1000) - 60));
    renderAt('/dashboard');

    expect(await screen.findByPlaceholderText('Password')).toBeInTheDocument();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  test('com token válido, mostra o dashboard', async () => {
    localStorage.setItem('authToken', fakeJwt(Math.floor(Date.now() / 1000) + 3600));
    renderAt('/dashboard');

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });
});
