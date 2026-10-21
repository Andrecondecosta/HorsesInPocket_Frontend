import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, EyeOff, MoreHorizontal, Pencil, Share2, Trash2 } from 'lucide-react';

import AppShell from '../components/AppShell';
import ShareHorse from '../components/ShareHorse';
import DeleteShares from '../components/Deleteshares';
import ScreenshotApprovals from '../components/ScreenshotApprovals';
import PedigreeTree from '../components/PedigreeTree';
import HorseGallery from '../components/HorseGallery';
import { useScreenshotProtection } from '../hooks/useScreenshotProtection';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Linha da lista "Identification"
const InfoRow = ({ label, children }) => (
  <div className="flex items-center justify-between gap-4 px-4 py-3">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="text-right font-medium">{children}</dd>
  </div>
);

const ProfileHorse = ({ setIsLoggedIn }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const [horse, setHorse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readonly, setReadonly] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [userStatus, setUserStatus] = useState(null);
  const [tab, setTab] = useState('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  // "Delete…" no menu só marca o pedido; a janela abre quando o menu acabar de fechar
  const deleteRequested = useRef(false);

  // Só protege cavalos recebidos: o dono pode tirar screenshots do próprio cavalo.
  // Enquanto o cavalo não carrega, horseId fica null e o hook não regista o listener.
  const { screenshotTaken } = useScreenshotProtection({ horseId: horse && !isOwner ? id : null });

  const fetchUserStatus = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/user_status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error loading user status');

      const data = await response.json();
      setUserStatus(data);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setReadonly(queryParams.get('readonly') === 'true');

    const fetchHorse = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch horse');
        }

        const data = await response.json();

        if (data.status === 'pending_approval') {
          alert("This horse is awaiting the creator's approval. You will be redirected to My Horses.");
          navigate('/myhorses');
          return;
        }

        setHorse(data);
        setIsOwner(data.is_owner);
      } catch (error) {
        setError('Failed to load horse profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchHorse();
      fetchUserStatus();
    } else {
      setError('Token not found');
      setIsLoading(false);
    }
  }, [id, location.search, token]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error performing operation');

      setDeleteMessage('Horse deleted for everyone.');
      setTimeout(() => {
        setDeleteMessage('');
        setShowDeleteModal(false);
        navigate('/myhorses');
      }, 2500);
    } catch (error) {
      console.error('Error:', error);
      setDeleteMessage('Error performing operation. Please try again.');
    }
  };

  const handleShareClick = () => {
    if (!userStatus) {
      console.error('userStatus not yet loaded!');
      return;
    }

    if (userStatus.used_shares >= userStatus.max_shares) {
      setShowLimitPopup(true);
    } else {
      setShowShareModal(true);
    }
  };

  const backHref = readonly ? '/received' : '/myhorses';
  const backLabel = readonly ? 'Received Horses' : 'My Horses';
  const editHref = isOwner && !readonly ? `/horses/${id}/edit?step=pedigree` : null;

  if (isLoading || error) {
    return (
      <AppShell setIsLoggedIn={setIsLoggedIn}>
        {error ? (
          <p role="alert" className="rounded-[14px] bg-leather-soft p-4 text-sm">{error}</p>
        ) : (
          <div aria-label="Loading horse" className="flex animate-pulse flex-col gap-4 md:grid md:grid-cols-2 md:gap-10">
            <div className="-mx-4 -mt-6 h-[330px] bg-secondary md:mx-0 md:mt-0 md:aspect-[4/3] md:h-auto md:rounded-2xl" />
            <div className="flex flex-col gap-3">
              <div className="h-12 w-2/3 rounded bg-secondary" />
              <div className="h-4 w-1/2 rounded bg-secondary" />
            </div>
          </div>
        )}
      </AppShell>
    );
  }

  const images = horse.images || [];
  const meta = [horse.breed, horse.gender, horse.age].filter(Boolean).join(' · ');
  const heightInHH = horse.height_cm ? (horse.height_cm / 0.1016).toFixed(1) : null;

  return (
    <AppShell setIsLoggedIn={setIsLoggedIn}>
      <div
        className={cn(
          'md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:items-start md:gap-10 lg:gap-14',
          screenshotTaken && 'pointer-events-none select-none blur-md'
        )}
      >
        {/* Fotografia de capa: a toda a largura no telemóvel, coluna esquerda no computador */}
        <div className="-mx-4 -mt-6 md:sticky md:top-24 md:mx-0 md:mt-0">
          <div className="relative h-[330px] overflow-hidden bg-[#e3ded3] md:aspect-[4/3] md:h-auto md:rounded-2xl">
            {images[0] ? (
              <img src={images[0]} alt={horse.name} className="size-full object-cover" />
            ) : (
              <span aria-hidden="true" className="flex size-full items-center justify-center font-serif text-8xl font-bold text-[#5c5f58]">
                {horse.name?.[0]?.toUpperCase()}
              </span>
            )}
            <Link
              to={backHref}
              aria-label={`Back to ${backLabel}`}
              className="absolute top-4 left-4 flex size-10 items-center justify-center rounded-full bg-background/80 backdrop-blur md:hidden"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </Link>
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setTab('gallery')}
                className="absolute right-4 bottom-3.5 rounded-full bg-foreground/70 px-2.5 py-1 text-[11.5px] font-semibold text-background"
              >
                {images.length} photos
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-5 md:pt-0">
          <Link to={backHref} className="hidden items-center gap-1 text-sm font-medium text-primary md:flex">
            <ChevronLeft className="size-4" aria-hidden="true" />
            {backLabel}
          </Link>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-leather">
              {isOwner ? 'Owned by you' : 'Shared with you'}
            </span>
            <h1 className="font-serif text-5xl font-bold leading-none md:text-6xl">{horse.name}</h1>
            {meta && <span className="text-sm text-muted-foreground">{meta}</span>}
          </div>

          {!readonly && (
            <div className="flex gap-2.5">
              <Button size="xl" className="flex-1" onClick={handleShareClick}>
                <Share2 />
                Share privately
              </Button>
              {isOwner && (
                <Button size="xl" variant="outline" onClick={() => navigate(`/horses/${id}/edit`)}>
                  <Pencil />
                  Edit
                </Button>
              )}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button size="xl" variant="outline" aria-label="More actions" className="w-12 px-0">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                {/* A janela de eliminação só abre depois de o menu fechar por completo:
                    se abrisse ao mesmo tempo, o fecho do menu fechava-a logo a seguir */}
                <DropdownMenuContent
                  align="end"
                  onCloseAutoFocus={(e) => {
                    if (!deleteRequested.current) return;
                    e.preventDefault();
                    deleteRequested.current = false;
                    setShowDeleteModal(true);
                  }}
                >
                  <DropdownMenuItem variant="destructive" onSelect={() => { deleteRequested.current = true; }}>
                    <Trash2 />
                    Delete…
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Pedidos de aprovação de screenshot — só para o dono do cavalo */}
          {isOwner && <ScreenshotApprovals horseId={id} />}

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="pedigree">Pedigree</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="flex flex-col gap-4">
              <section aria-labelledby="identification-title" className="flex flex-col gap-1.5">
                <h2 id="identification-title" className="pl-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Identification
                </h2>
                <dl className="divide-y divide-[#ece7dd] overflow-hidden rounded-[14px] border bg-card">
                  <InfoRow label="Color">{horse.color || 'Not specified'}</InfoRow>
                  <InfoRow label="Height">
                    {horse.height_cm ? `${horse.height_cm} m · ${heightInHH} hh` : 'Not specified'}
                  </InfoRow>
                  <InfoRow label="Breeder">{horse.breeder || 'Not specified'}</InfoRow>
                  <InfoRow label="Training level">{horse.training_level || 'Not specified'}</InfoRow>
                  <InfoRow label="Piroplasmosis">
                    <Badge variant={horse.piroplasmosis ? 'secondary' : 'soft'}>
                      {horse.piroplasmosis ? 'Yes' : 'No'}
                    </Badge>
                  </InfoRow>
                </dl>
              </section>

              {horse.description && (
                <section aria-labelledby="description-title" className="flex flex-col gap-1.5">
                  <h2 id="description-title" className="pl-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Description
                  </h2>
                  <p className="whitespace-pre-line rounded-[14px] border bg-card px-4 py-3 leading-relaxed">
                    {horse.description}
                  </p>
                </section>
              )}
            </TabsContent>

            <TabsContent value="gallery">
              <HorseGallery name={horse.name} images={images} videos={horse.videos || []} />
            </TabsContent>

            <TabsContent value="pedigree">
              <PedigreeTree ancestors={horse.ancestors || []} editHref={editHref} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {screenshotTaken && (
        <div role="alert" className="fixed inset-x-4 top-1/3 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-[14px] border bg-card p-4 shadow-lg">
          <EyeOff className="size-5 shrink-0 text-leather" aria-hidden="true" />
          <p className="text-sm font-medium">Screenshot detected. Data hidden for security.</p>
        </div>
      )}

      {showShareModal && <ShareHorse horseId={id} onClose={() => setShowShareModal(false)} />}

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {horse.name}?</DialogTitle>
            <DialogDescription>
              Remove access for some people, or delete the horse for everyone.
            </DialogDescription>
          </DialogHeader>

          {deleteMessage ? (
            <p role="status" className="rounded-lg bg-secondary p-3 text-sm font-medium">{deleteMessage}</p>
          ) : (
            <>
              <DeleteShares horseId={id} token={token} onDeleteSuccess={fetchUserStatus} />
              <div className="flex flex-col gap-2 border-t pt-4">
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 />
                  Delete for me and everyone
                </Button>
                <p className="text-xs text-muted-foreground">This cannot be undone.</p>
              </div>
            </>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Limite de partilhas da conta (definido pelo backend). O HorseHub é gratuito:
          sem referências a planos, upgrades ou pagamentos */}
      <Dialog open={showLimitPopup} onOpenChange={setShowLimitPopup}>
        <DialogContent data-testid="share-limit-popup">
          <DialogHeader>
            <DialogTitle>Sharing limit reached</DialogTitle>
            <DialogDescription>
              You have reached the maximum number of shares for your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button data-testid="share-limit-ok-btn" onClick={() => setShowLimitPopup(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default ProfileHorse;
