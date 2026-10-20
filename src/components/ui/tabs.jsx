import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

function Tabs({ className, ...props }) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col gap-3', className)} {...props} />;
}

// Estilo "segmented control" do iOS: fundo neutro, separador ativo em branco
function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'inline-flex h-9 w-full items-center justify-center rounded-[9px] bg-secondary p-[2px] text-foreground/75',
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-full flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[7px] px-2 text-[13px] font-medium transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-card data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-[0_1px_3px_rgba(31,36,32,0.12)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn('flex-1 outline-none', className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
