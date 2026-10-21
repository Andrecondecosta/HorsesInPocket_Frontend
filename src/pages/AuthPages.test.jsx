import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import WelcomePage from './WelcomePage';
import { jsonResponse } from '../testUtils';

const renderAt = (entry, routes) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        {routes}
        <Route path="/dashboard" element={<p>Dashboard page</p>} />
        <Route path="/received" element={<p>Received page</p>} />
        <Route path="/login" element={<p>Login page</p>} />
      </Routes>
    </MemoryRouter>
  );

const bodyOf = (url) => JSON.parse(global.fetch.mock.calls.find(([u]) => u.endsWith(url))[1].body);

beforeEach(() => {
  localStorage.clear();
});

describe('LoginPage (novo design)', () => {
  test('entra com o token de partilha e segue para o redirect', async () => {
    global.fetch = vi.fn(() => jsonResponse(200, { token: 'jwt' }));
    const setIsLoggedIn = vi.fn();
    renderAt('/entrar?token=share-1&redirect=/received', <Route path="/entrar" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ana@horsehub.test' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'segredo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByText('Received page')).toBeInTheDocument();
    expect(bodyOf('/login')).toEqual({ email: 'ana@horsehub.test', password: 'segredo', shared_token: 'share-1' });
    expect(setIsLoggedIn).toHaveBeenCalledWith(true);
  });

  test('credenciais erradas mostram o erro no formulário', async () => {
    global.fetch = vi.fn(() => jsonResponse(401, { error: 'Invalid username or password' }));
    renderAt('/entrar', <Route path="/entrar" element={<LoginPage setIsLoggedIn={vi.fn()} />} />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'x@horsehub.test' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid username or password');
  });

  test('mostrar/esconder a password; o link de registo mantém o token de partilha', () => {
    renderAt('/entrar?token=share-1', <Route path="/entrar" element={<LoginPage setIsLoggedIn={vi.fn()} />} />);
    const password = screen.getByLabelText('Password');
    expect(password).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(password).toHaveAttribute('type', 'text');
    expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/register?token=share-1');
  });
});

describe('RegisterPage (novo design)', () => {
  const fill = () => {
    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Silva' } });
    fireEvent.change(screen.getByLabelText('Gender'), { target: { value: 'female' } });
    fireEvent.change(screen.getByLabelText('Date of birth'), { target: { value: '1992-05-04' } });
    fireEvent.change(screen.getByLabelText('Country'), { target: { value: 'Portugal' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ana@horsehub.test' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'segredo123' } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'segredo123' } });
  };

  const mockApi = () => {
    global.fetch = vi.fn((url) =>
      url.endsWith('/countries') ? jsonResponse(200, [{ code: 'PT', name: 'Portugal' }]) : jsonResponse(201, { token: 'jwt-novo' })
    );
  };

  test('sem aceitar a política mostra o erro (sem alert) e não envia', async () => {
    mockApi();
    renderAt('/registo', <Route path="/registo" element={<RegisterPage />} />);
    await screen.findByRole('option', { name: 'Portugal' });
    fill();
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('You must accept the Privacy Policy');
    expect(global.fetch.mock.calls.some(([url]) => url.endsWith('/signup'))).toBe(false);
  });

  test('regista com os mesmos campos e o token de partilha, e entra no dashboard', async () => {
    mockApi();
    renderAt('/registo?token=share-9', <Route path="/registo" element={<RegisterPage />} />);
    await screen.findByRole('option', { name: 'Portugal' });
    fill();
    fireEvent.click(screen.getByLabelText(/I accept the/));
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Dashboard page')).toBeInTheDocument();
    expect(bodyOf('/signup')).toEqual({
      user: {
        first_name: 'Ana',
        last_name: 'Silva',
        email: 'ana@horsehub.test',
        password: 'segredo123',
        password_confirmation: 'segredo123',
        birthdate: '1992-05-04',
        phone_number: '',
        country: 'Portugal',
        gender: 'female',
      },
      shared_token: 'share-9',
    });
    expect(localStorage.getItem('hasSeenPopup')).toBe('newUser');
  });
});

describe('Password (novo design)', () => {
  test('recuperar: envia o email e mostra a confirmação', async () => {
    global.fetch = vi.fn(() => jsonResponse(200, {}));
    renderAt('/forgot', <Route path="/forgot" element={<ForgotPassword />} />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ana@horsehub.test' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send recovery email' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Recovery email sent');
    expect(bodyOf('/password/forgot')).toEqual({ email: 'ana@horsehub.test' });
  });

  test('repor: passwords diferentes não chegam ao servidor', async () => {
    global.fetch = vi.fn(() => jsonResponse(200, {}));
    renderAt('/reset/password/tok-1', <Route path="/reset/password/:token" element={<ResetPassword />} />);

    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'aaa111' } });
    fireEvent.change(screen.getByLabelText('Confirm new password'), { target: { value: 'bbb222' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reset password' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Passwords do not match.');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('repor: envia o token do email e a password nova', async () => {
    global.fetch = vi.fn(() => jsonResponse(200, {}));
    renderAt('/reset/password/tok-1', <Route path="/reset/password/:token" element={<ResetPassword />} />);

    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'nova123' } });
    fireEvent.change(screen.getByLabelText('Confirm new password'), { target: { value: 'nova123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reset password' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Password reset successfully!');
    expect(bodyOf('/password/reset')).toEqual({ token: 'tok-1', password: 'nova123' });
  });
});

describe('WelcomePage (novo design)', () => {
  test('mostra o cavalo e a mensagem, e os botões levam o token', () => {
    renderAt(
      '/welcome?token=share-5&horseName=Z%C3%A9firo&message=Link%20expired',
      <Route path="/welcome" element={<WelcomePage />} />
    );

    expect(screen.getByText('Zéfiro')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Link expired');
    expect(screen.getByRole('link', { name: 'Log in to view' })).toHaveAttribute('href', '/login?token=share-5');
    expect(screen.getByRole('link', { name: 'Create a free account' })).toHaveAttribute('href', '/register?token=share-5');
  });

  test('sem token, os botões não levam "token=null"', () => {
    renderAt('/welcome', <Route path="/welcome" element={<WelcomePage />} />);
    expect(screen.getByRole('link', { name: 'Log in to view' })).toHaveAttribute('href', '/login');
  });
});
