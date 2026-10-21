import React from 'react';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// O HorseHub é gratuito: a janela apresenta a app, sem referências a planos ou pagamentos
const FEATURES = [
  'Keep your horses, photos and pedigree in one place',
  'Share a horse privately with a one-time link',
  'Get alerted if someone takes a screenshot',
];

const WelcomePopup = ({ onClose }) => (
  <Dialog open onOpenChange={(open) => !open && onClose()}>
    <DialogContent showCloseButton={false}>
      <DialogHeader>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-leather">Welcome</span>
        <DialogTitle className="text-3xl">Welcome to HorseHub</DialogTitle>
        <DialogDescription>Your private portfolio for the horses you own and share.</DialogDescription>
      </DialogHeader>

      <ul className="flex flex-col gap-2">
        {FEATURES.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-sm">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-soft-foreground">
              <Check className="size-3.5" aria-hidden="true" />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted-foreground">HorseHub is free to use.</p>

      <DialogFooter>
        <Button size="lg" onClick={onClose}>Get started</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default WelcomePopup;
