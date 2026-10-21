import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, Mail, ShieldCheck, Smartphone } from 'lucide-react';

import PublicPage from '../components/PublicPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const SUPPORT_EMAIL = 'horsehub2025@gmail.com';

// Monta o mailto com os campos codificados (um "&" ou "#" na mensagem já não a corta)
export const supportMailto = ({ name, email, message }) =>
  `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Support Request from ${name}`)}` +
  `&body=${encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`)}`;

const Field = ({ id, label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[13px] font-medium">{label}</label>
    {children}
  </div>
);

const InfoRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
      <Icon className="size-4" aria-hidden="true" />
    </span>
    <div className="flex min-w-0 flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="truncate text-sm font-medium">{children}</span>
    </div>
  </div>
);

const SupportPage = ({ setIsLoggedIn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  // Não há envio pelo servidor: abre a app de email com a mensagem preenchida
  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = supportMailto({ name, email, message });
    setSent(true);
  };

  return (
    <PublicPage setIsLoggedIn={setIsLoggedIn}>
      <div className="mx-auto flex max-w-4xl flex-col gap-6 md:gap-8">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-leather">Help</span>
          <h1 className="font-serif text-[44px] font-bold leading-none md:text-[56px]">Support</h1>
          <p className="text-sm text-muted-foreground">
            We're here to help. Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start md:gap-8">
          <div className="flex flex-col divide-y divide-[#ece7dd] overflow-hidden rounded-[14px] border bg-card">
            <InfoRow icon={Mail} label="Email">
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a>
            </InfoRow>
            <Link to="/privacy-policy" className="flex items-center hover:bg-accent/60">
              <div className="flex-1">
                <InfoRow icon={ShieldCheck} label="Privacy">Privacy policy</InfoRow>
              </div>
              <ChevronRight className="mr-4 size-4 text-muted-foreground/70" aria-hidden="true" />
            </Link>
            <InfoRow icon={Smartphone} label="App version">HorseHub v1.0</InfoRow>
          </div>

          <section aria-labelledby="support-form-title" className="flex flex-col gap-4 rounded-[14px] border bg-card p-4 md:p-6">
            <h2 id="support-form-title" className="font-serif text-[28px] font-bold leading-tight">Send a message</h2>
            {sent ? (
              <div role="status" className="flex flex-col gap-3">
                <p className="flex items-start gap-2 rounded-[12px] bg-primary-soft p-3 text-sm font-medium text-primary-soft-foreground">
                  <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  Your email app has been opened with your message pre-filled. Send it from there.
                </p>
                <Button variant="ghost" className="self-start" onClick={() => setSent(false)}>
                  Write another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Field id="support-name" label="Name">
                  <Input id="support-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
                </Field>
                <Field id="support-email" label="Email">
                  <Input
                    id="support-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="none"
                    required
                  />
                </Field>
                <Field id="support-message" label="Message">
                  <Textarea
                    id="support-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or question…"
                    rows={6}
                    required
                  />
                </Field>
                <Button type="submit" size="lg" className="self-end max-sm:w-full">
                  <Mail />
                  Send message
                </Button>
              </form>
            )}
          </section>
        </div>
      </div>
    </PublicPage>
  );
};

export default SupportPage;
