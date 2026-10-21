import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const LOGO_URL = '/horsehub-wordmark.png';
const PHOTO_URL =
  'https://images.unsplash.com/photo-1550785330-003a9afa3bd9?q=80&w=1600&auto=format&fit=crop';

/**
 * Moldura dos ecrãs de entrada (login, registo, password, boas-vindas do link partilhado).
 * Computador: fotografia à esquerda, formulário à direita. Telemóvel: só o formulário.
 */
const AuthLayout = ({ eyebrow, title, description, children, footer, wide = false }) => (
  <div className="hh-ui min-h-dvh bg-background md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
    <aside className="relative hidden overflow-hidden bg-[#2e4327] md:sticky md:top-0 md:block md:h-dvh" aria-hidden="true">
      <img src={PHOTO_URL} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      <p className="absolute right-10 bottom-10 left-10 max-w-md font-serif text-[40px] font-bold leading-[1.05] text-white lg:text-5xl">
        Your horses, privately in your pocket.
      </p>
    </aside>

    <main className="flex min-h-dvh flex-col px-4 pt-[max(env(safe-area-inset-top),1.5rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)] md:px-10">
      <Link to="/login" aria-label="HorseHub" className="self-start">
        <img src={LOGO_URL} alt="HorseHub" className="h-9 w-auto mix-blend-multiply" />
      </Link>

      <div className={cn('mx-auto flex w-full flex-1 flex-col justify-center gap-6 py-10', wide ? 'max-w-lg' : 'max-w-sm')}>
        <div className="flex flex-col gap-1.5">
          {eyebrow && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-leather">{eyebrow}</span>
          )}
          <h1 className="font-serif text-[40px] font-bold leading-none md:text-5xl">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {children}
        {footer && <div className="flex flex-col gap-1.5 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>

      <nav aria-label="Legal" className="flex justify-center gap-4 text-xs text-muted-foreground">
        <Link to="/privacy-policy" className="hover:text-foreground">Privacy policy</Link>
        <Link to="/support" className="hover:text-foreground">Support</Link>
      </nav>
    </main>
  </div>
);

export const AuthField = ({ id, label, children, className, aside }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <div className="flex items-center justify-between gap-2">
      <label htmlFor={id} className="text-[13px] font-medium">{label}</label>
      {aside}
    </div>
    {children}
  </div>
);

// Campo de password com botão para mostrar/esconder
export const PasswordInput = React.forwardRef(function PasswordInput({ className, ...props }, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input ref={ref} type={visible ? 'text' : 'password'} className={cn('pr-11', className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
      >
        {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
      </button>
    </div>
  );
});

export const FormMessage = ({ type = 'error', children }) =>
  children ? (
    <p
      role={type === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-[12px] p-3 text-sm font-medium',
        type === 'error' ? 'bg-[#f6e3e1] text-destructive' : 'bg-primary-soft text-primary-soft-foreground'
      )}
    >
      {children}
    </p>
  ) : null;

export const TextLink = ({ className, ...props }) => (
  <Link className={cn('font-semibold text-primary hover:underline', className)} {...props} />
);

export default AuthLayout;
