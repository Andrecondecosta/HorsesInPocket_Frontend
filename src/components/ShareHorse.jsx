import React, { useEffect, useState } from 'react';
import { Check, Link2, Loader2, Mail } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// No telemóvel a janela vira um painel que sobe do fundo; no computador fica centrada
const SHEET_ON_MOBILE =
  'max-sm:top-auto max-sm:bottom-0 max-sm:max-w-full max-sm:translate-y-0 max-sm:rounded-b-none max-sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))]';

const ShareHorse = ({ horseId, onClose }) => {
  const [shareLink, setShareLink] = useState('');
  const [horse, setHorse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(null);

  const token = localStorage.getItem('authToken');
  const API_URL = process.env.REACT_APP_API_SERVER_URL;

  useEffect(() => {
    const fetchHorseData = async () => {
      try {
        const response = await fetch(`${API_URL}/horses/${horseId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error loading horse data.');
        }

        const data = await response.json();

        const horseImageUrl = data.images?.length > 0 ? data.images[0] : '';
        setHorse({ ...data, imageUrl: horseImageUrl });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHorseData();
  }, [horseId, API_URL, token]);

  // Gera o link só a pedido do utilizador: no backend, cada chamada a
  // share_via_link consome uma partilha do plano (used_shares).
  const generateShareLink = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/horses/${horseId}/share_via_link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ expires_at: null }),
      });

      if (!response.ok) {
        throw new Error('Error generating share link.');
      }

      const data = await response.json();

      const horseImage = encodeURIComponent(horse.imageUrl || '');
      const horseName = encodeURIComponent(horse.name || '');
      const fullShareLink = `${data.link}?horseImage=${horseImage}&horseName=${horseName}`;

      setShareLink(fullShareLink);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Confirmação no próprio botão, em vez de um alert() que bloqueia a página
  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 🔹 Share by email
  const shareByEmail = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email.');
      return;
    }

    setEmailSuccess(null);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/horses/${horseId}/share_via_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error sharing via email.');
      }

      setEmailSuccess(`Horse successfully shared with ${email}`);
      setEmail('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className={SHEET_ON_MOBILE}>
        {isLoading ? (
          <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Loading…
          </p>
        ) : !horse ? (
          // Sem dados do cavalo não há nada para partilhar: mostra o erro e permite fechar
          <>
            <DialogTitle className="sr-only">Share horse</DialogTitle>
            <p role="alert" className="rounded-lg bg-leather-soft p-3 text-sm">{error}</p>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-leather">
                Share privately
              </span>
              <DialogTitle>{horse.name}</DialogTitle>
              <DialogDescription>
                The link works once: the first person to open it gets read-only access.
              </DialogDescription>
            </DialogHeader>

            {/* Copiar/WhatsApp só aparecem depois de gerado o link, para que
                o clique continue a ser um gesto direto do utilizador
                (clipboard e window.open são bloqueados após um await no iOS) */}
            {!shareLink ? (
              <Button size="xl" onClick={generateShareLink} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="animate-spin" /> : <Link2 />}
                {isGenerating ? 'Generating...' : 'Generate Link'}
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button size="xl" onClick={copyLink}>
                  {copied ? <Check /> : <Link2 />}
                  {copied ? 'Copied' : 'Copy Link'}
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://wa.me/?text=*${horse?.name}* has been shared with you!%0A🔗 ${encodeURIComponent(
                        shareLink
                      )}`,
                      '_blank'
                    )
                  }
                >
                  <FaWhatsapp />
                  WhatsApp
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-2 border-t pt-4">
              <label htmlFor="share-email" className="flex items-center gap-1.5 text-sm font-medium">
                <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                Or send it by email
              </label>
              <Input
                id="share-email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailSuccess && <p className="text-sm font-medium text-primary">{emailSuccess}</p>}
              {/* Erros de partilha aparecem dentro da janela, sem esconder os botões */}
              {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={shareByEmail}>
                Share
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareHorse;
