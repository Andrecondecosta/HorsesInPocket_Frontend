import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

// <select> nativo (no telemóvel abre a roda do sistema) com o aspeto do Input.
// forwardRef para o foco chegar ao <select> (ex.: primeiro campo com erro).
const NativeSelect = React.forwardRef(function NativeSelect({ className, children, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        data-slot="native-select"
        className={cn(
          'h-10 w-full appearance-none rounded-md border border-input bg-card pr-9 pl-3 text-base text-foreground shadow-xs outline-none md:text-sm',
          'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30',
          'aria-invalid:border-destructive',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
    </div>
  );
});

export { NativeSelect };
