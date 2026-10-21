import React, { useEffect, useState } from 'react';
import { Check, Link2, Loader2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
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
  // Se quem recebe pode voltar a partilhar (escolha de quem partilha, desligada por defeito)
  const [allowReshare, setAllowReshare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

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
        body: JSON.stringify({ expires_at: null, can_reshare: allowReshare }),
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

            {/* O link é criado com esta escolha: depois de gerado já não muda */}
            <label htmlFor="share-allow-reshare" className="flex items-start gap-3 rounded-[12px] border p-3">
              <input
                id="share-allow-reshare"
                type="checkbox"
                checked={allowReshare}
                onChange={(e) => setAllowReshare(e.target.checked)}
                disabled={!!shareLink}
                className="mt-0.5 size-4 shrink-0 accent-primary"
              />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">Allow them to share this horse</span>
                <span className="text-xs text-muted-foreground">
                  You won't see who they share it with. If you remove their access, everyone they shared it with loses it too.
                </span>
              </span>
            </label>

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

            {/* Erros de partilha aparecem dentro da janela, sem esconder os botões */}
            {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}

            {/* O link copiado pode ser enviado por qualquer app (Mensagens, email, ...);
                a partilha por email no servidor foi retirada porque nunca funcionou */}
            <div className="flex justify-end border-t pt-4">
              <Button variant="ghost" onClick={onClose}>
                {shareLink ? 'Done' : 'Cancel'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareHorse;
