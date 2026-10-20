import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';
import { Badge } from './badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
import { cn } from '@/lib/utils';

describe('cn', () => {
  test('resolve conflitos de classes do Tailwind (a última ganha)', () => {
    expect(cn('px-2 text-sm', false && 'hidden', 'px-4')).toBe('text-sm px-4');
  });
});

describe('Button', () => {
  test('usa a cor principal por defeito e aceita variantes e tamanhos', () => {
    render(
      <>
        <Button>Share</Button>
        <Button variant="outline" size="xl">Edit</Button>
      </>
    );
    expect(screen.getByRole('button', { name: 'Share' })).toHaveClass('bg-primary', 'h-9');
    expect(screen.getByRole('button', { name: 'Edit' })).toHaveClass('border-input', 'h-12');
  });

  test('com asChild aplica o estilo ao elemento filho (ex.: um link)', () => {
    render(
      <Button asChild>
        <a href="/horses">My Horses</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: 'My Horses' });
    expect(link).toHaveAttribute('href', '/horses');
    expect(link).toHaveClass('bg-primary');
  });
});

describe('Badge', () => {
  test('variante soft para estados positivos', () => {
    render(<Badge variant="soft">Shared · 2</Badge>);
    expect(screen.getByText('Shared · 2')).toHaveClass('bg-primary-soft');
  });
});

describe('Tabs', () => {
  test('mostra o conteúdo do separador escolhido', () => {
    render(
      <Tabs defaultValue="mine">
        <TabsList>
          <TabsTrigger value="mine">Mine</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
        </TabsList>
        <TabsContent value="mine">Os meus cavalos</TabsContent>
        <TabsContent value="received">Cavalos recebidos</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Os meus cavalos')).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Mine' })).toHaveAttribute('data-state', 'active');

    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Received' }), { button: 0 });

    expect(screen.getByRole('tab', { name: 'Received' })).toHaveAttribute('data-state', 'active');
    expect(screen.getByText('Cavalos recebidos')).toBeVisible();
  });
});
