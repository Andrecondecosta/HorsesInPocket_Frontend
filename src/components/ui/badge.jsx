import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1 w-fit whitespace-nowrap shrink-0 overflow-hidden rounded-full border px-2.5 py-0.5 text-xs font-semibold [&>svg]:size-3 [&>svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-white',
        outline: 'border-border bg-card text-foreground',
        // Estados positivos: "Shared · 2", "Negative"
        soft: 'border-transparent bg-primary-soft text-primary-soft-foreground',
        // Numeração de catálogo sobre fotografias: "No. 01"
        overlay: 'border-transparent bg-foreground/70 text-background tracking-[0.12em] uppercase',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
