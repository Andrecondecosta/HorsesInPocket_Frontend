import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SupportPage, { supportMailto } from './SupportPage';
import PrivacyPolicy from './PrivacyPolicy';
import { jsonResponse } from '../testUtils';

// JWT sem assinatura, só com "exp" (o frontend não valida a assinatura)
const fakeJwt = (exp) => `x.${btoa(JSON.stringify({ exp }))}.y`;

const renderAt = (entry) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/support" element={<SupportPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn(() => jsonResponse(200, {}));
});

describe('Páginas públicas (novo design)', () => {
  test('sem sessão: cabeçalho simples com "Log in", sem barra de separadores', () => {
    renderAt('/privacy-policy');
    expect(screen.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('navigation', { name: 'Main' })).not.toBeInTheDocument();
  });

  test('com sessão válida: usa a moldura da app', () => {
    localStorage.setItem('authToken', fakeJwt(Math.floor(Date.now() / 1000) + 3600));
    renderAt('/support');
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });

  test('com sessão expirada: fica como página pública e não apaga o token', () => {
    const expired = fakeJwt(Math.floor(Date.now() / 1000) - 60);
    localStorage.setItem('authToken', expired);
    renderAt('/support');
    expect(screen.getByRole('link', { name: 'Log in' })).toBeInTheDocument();
    expect(localStorage.getItem('authToken')).toBe(expired);
  });

  test('a política mantém o texto e o contacto', () => {
    renderAt('/privacy-policy');
    expect(screen.getByRole('heading', { name: '7. Your Rights (GDPR)' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'horsehub2025@gmail.com' })).toHaveLength(2);
  });
});

describe('SupportPage', () => {
  test('o mailto codifica a mensagem (um "&" ou "#" já não a corta)', () => {
    const url = supportMailto({ name: 'Ana & Rui', email: 'ana@horsehub.test', message: 'Cavalo #3 não abre' });
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('subject')).toBe('Support Request from Ana & Rui');
    expect(params.get('body')).toBe('Cavalo #3 não abre\n\nFrom: Ana & Rui (ana@horsehub.test)');
  });

  test('enviar abre o email e mostra a confirmação', () => {
    const original = window.location;
    delete window.location;
    window.location = { href: '' };
    try {
      renderAt('/support');
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ana' } });
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ana@horsehub.test' } });
      fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Olá' } });
      fireEvent.click(screen.getByRole('button', { name: 'Send message' }));

      expect(window.location.href).toMatch(/^mailto:horsehub2025@gmail\.com\?subject=/);
      expect(screen.getByRole('status')).toHaveTextContent('Your email app has been opened');
    } finally {
      window.location = original;
    }
  });
});
