import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PedigreeTree from './PedigreeTree';

const ANCESTORS = [
  { relation_type: 'father', name: 'Alvor', breed: 'Lusitano', breeder: 'Coudelaria A' },
  { relation_type: 'mother', name: 'Ribeira', breed: 'Lusitano' },
  { relation_type: 'paternal_grandfather', name: 'Navarro', breed: 'Lusitano' },
  { relation_type: 'paternal_grandmother', name: 'Duquesa' },
  { relation_type: 'maternal_grandfather', name: 'Fidalgo' },
  // a avó materna não está registada
];

const renderTree = (props) =>
  render(
    <MemoryRouter>
      <PedigreeTree ancestors={ANCESTORS} {...props} />
    </MemoryRouter>
  );

describe('PedigreeTree', () => {
  test('mostra pais e avós com os nomes certos em cada posição', () => {
    renderTree();
    expect(screen.getByText('Sire')).toBeInTheDocument();
    expect(screen.getByText('Dam')).toBeInTheDocument();
    for (const name of ['Alvor', 'Ribeira', 'Navarro', 'Duquesa', 'Fidalgo']) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    expect(screen.getByText('Coudelaria A')).toBeInTheDocument();
  });

  test('antepassado em falta aparece como "Not recorded", com "Add" só para quem pode editar', () => {
    const { unmount } = renderTree({ editHref: '/horses/1/edit' });
    const missing = screen.getByText("Dam's dam").parentElement;
    expect(within(missing).getByText('Not recorded')).toBeInTheDocument();
    expect(within(missing).getByRole('link', { name: 'Add' })).toHaveAttribute('href', '/horses/1/edit');
    expect(screen.getByRole('link', { name: 'Edit pedigree' })).toBeInTheDocument();
    unmount();

    renderTree();
    expect(within(screen.getByText("Dam's dam").parentElement).queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Edit pedigree' })).not.toBeInTheDocument();
  });

  test('sem nenhum antepassado mostra o estado vazio', () => {
    render(
      <MemoryRouter>
        <PedigreeTree ancestors={[]} editHref="/horses/1/edit" />
      </MemoryRouter>
    );
    expect(screen.getByText('No pedigree recorded yet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Add pedigree' })).toBeInTheDocument();
  });
});
