import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NewHorses from './NewHorses';
import EditHorse from './EditHorse';
import { jsonResponse } from '../testUtils';

// Resposta da compressão: devolve um blob como o backend
const blobResponse = () => Promise.resolve({ ok: true, status: 200, blob: () => Promise.resolve(new Blob(['x'], { type: 'image/jpeg' })) });

const formEntries = (call) => Array.from(call[1].body.entries());
const valuesOf = (entries, key) => entries.filter(([k]) => k === key).map(([, v]) => v);

beforeEach(() => {
  localStorage.setItem('authToken', 'jwt-de-teste');
  global.URL.createObjectURL = vi.fn(() => 'blob:preview');
  global.URL.revokeObjectURL = vi.fn();
  window.scrollTo = vi.fn();
});

describe('NewHorses (novo design)', () => {
  const renderNew = () =>
    render(
      <MemoryRouter initialEntries={['/newhorse']}>
        <Routes>
          <Route path="/newhorse" element={<NewHorses />} />
          <Route path="/myhorses" element={<p>My horses page</p>} />
        </Routes>
      </MemoryRouter>
    );

  const fillDetails = () => {
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'zéfiro do Monte' } });
    fireEvent.change(screen.getByLabelText('Year of birth'), { target: { value: '2015' } });
    fireEvent.change(screen.getByLabelText('Gender'), { target: { value: 'Stallion' } });
    fireEvent.change(screen.getByLabelText('Color'), { target: { value: 'Gray' } });
    fireEvent.change(screen.getByLabelText(/^Breed ·/), { target: { value: 'Puro Sangue Lusitano' } });
    fireEvent.change(screen.getByLabelText('Training level'), { target: { value: 'Grand Prix' } });
  };

  test('criar sem preencher leva ao passo 1 com os erros dos campos obrigatórios', async () => {
    global.fetch = vi.fn(() => jsonResponse(200, {}));
    renderNew();

    fireEvent.click(screen.getByRole('button', { name: /Pedigree/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Create horse' }));

    expect(await screen.findByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Year of birth is required.')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
    expect(global.fetch.mock.calls.some(([, opts]) => opts?.method === 'POST')).toBe(false);
  });

  test('com os dados certos mas sem fotos, leva ao passo das fotos', async () => {
    global.fetch = vi.fn(() => jsonResponse(200, {}));
    renderNew();
    fillDetails();

    fireEvent.click(screen.getByRole('button', { name: /Pedigree/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Create horse' }));

    expect(await screen.findByText('At least one photo is required.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Photos' })).toBeInTheDocument();
  });

  test('cria o cavalo com os mesmos campos de antes, raça escrita à mão e pedigree', async () => {
    global.fetch = vi.fn((url) => (url.includes('/images_compress/') ? blobResponse() : jsonResponse(201, {})));
    renderNew();
    fillDetails();

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    const file = new File(['img'], 'zefiro.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByTestId('add-photos-input'), { target: { files: [file] } });
    expect(await screen.findAllByTestId('photo-item')).toHaveLength(1);
    expect(screen.getByText('Cover')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.change(screen.getByLabelText('Sire name'), { target: { value: 'Rubi' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create horse' }));

    expect(await screen.findByText('My horses page')).toBeInTheDocument();
    const create = global.fetch.mock.calls.find(([url, opts]) => url.endsWith('/horses') && opts?.method === 'POST');
    const entries = formEntries(create);
    expect(valuesOf(entries, 'horse[name]')).toEqual(['Zéfiro do Monte']);
    expect(valuesOf(entries, 'horse[age]')).toEqual(['2015']);
    expect(valuesOf(entries, 'horse[breed]')).toEqual(['Puro Sangue Lusitano']);
    expect(valuesOf(entries, 'horse[images][]')).toHaveLength(1);
    expect(valuesOf(entries, 'horse[ancestors_attributes][][relation_type]')).toHaveLength(6);
    expect(valuesOf(entries, 'horse[ancestors_attributes][][name]')[0]).toBe('Rubi');
  });

  test('se o backend falhar, mostra o erro e fica na página', async () => {
    global.fetch = vi.fn((url) => (url.includes('/images_compress/') ? blobResponse() : jsonResponse(500, {})));
    renderNew();
    fillDetails();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.change(screen.getByTestId('add-photos-input'), { target: { files: [new File(['i'], 'a.jpg', { type: 'image/jpeg' })] } });
    await screen.findByTestId('photo-item');
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create horse' }));

    expect(await screen.findByText(/could not be saved/)).toBeInTheDocument();
  });
});

describe('EditHorse (novo design)', () => {
  const HORSE = {
    id: 7,
    name: 'Aurora',
    age: 2018,
    height_cm: 1.62,
    description: null,
    gender: 'Mare',
    color: 'Bay',
    training_level: 'Medium',
    piroplasmosis: false,
    breed: 'Lusitano',
    breeder: 'Coudelaria X',
    images: ['https://cdn.test/a.jpg', 'https://cdn.test/b.jpg'],
    videos: ['https://cdn.test/v.mp4'],
    ancestors: [{ id: 91, relation_type: 'father', name: 'Rubi', breed: 'Lusitano', breeder: '' }],
  };

  const renderEdit = (entry = '/horses/7/edit') =>
    render(
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="/horses/:id/edit" element={<EditHorse />} />
          <Route path="/horses/:id" element={<p>Horse page</p>} />
        </Routes>
      </MemoryRouter>
    );

  test('carrega o cavalo e grava a partir de qualquer passo, com as fotos apagadas e o pedigree com id', async () => {
    global.fetch = vi.fn((url, opts = {}) => (opts.method === 'PUT' ? jsonResponse(200, HORSE) : jsonResponse(200, HORSE)));
    renderEdit();

    expect(await screen.findByLabelText('Name')).toHaveValue('Aurora');
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Aurora II' } });

    fireEvent.click(screen.getByRole('button', { name: /Photos & videos/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove photo 2' }));
    expect(screen.getAllByTestId('photo-item')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(await screen.findByText('Horse page')).toBeInTheDocument();

    const put = global.fetch.mock.calls.find(([, opts]) => opts?.method === 'PUT');
    const entries = formEntries(put);
    expect(valuesOf(entries, 'horse[name]')).toEqual(['Aurora II']);
    expect(valuesOf(entries, 'horse[description]')).toEqual(['']);
    expect(valuesOf(entries, 'existing_images[]')).toEqual(['https://cdn.test/a.jpg']);
    expect(valuesOf(entries, 'deleted_images[]')).toEqual(['https://cdn.test/b.jpg']);
    expect(valuesOf(entries, 'existing_videos[]')).toEqual(['https://cdn.test/v.mp4']);
    expect(valuesOf(entries, 'horse[ancestors_attributes][][id]')).toEqual(['91']);
  });

  test('?step=pedigree abre diretamente no pedigree', async () => {
    global.fetch = vi.fn(() => jsonResponse(200, HORSE));
    renderEdit('/horses/7/edit?step=pedigree');

    expect(await screen.findByLabelText('Sire name')).toHaveValue('Rubi');
    expect(within(screen.getByRole('navigation', { name: 'Form steps' })).getByRole('button', { current: 'step' })).toHaveTextContent('Pedigree');
  });

  test('não grava sem nome', async () => {
    global.fetch = vi.fn(() => jsonResponse(200, HORSE));
    renderEdit();
    fireEvent.change(await screen.findByLabelText('Name'), { target: { value: '  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByText('Name is required.')).toBeInTheDocument();
    await waitFor(() => expect(global.fetch.mock.calls.some(([, opts]) => opts?.method === 'PUT')).toBe(false));
  });
});
