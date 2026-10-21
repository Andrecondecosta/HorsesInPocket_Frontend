import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, ChevronLeft, ImagePlus, Loader2, Video, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LINES } from './PedigreeTree';

export const BREEDS = [
  'Akhal-Teke', 'American Cream Draft', 'American Paint Horse', 'American Quarter Horse',
  'American Saddlebred', 'Andalusian', 'Appaloosa', 'Arabian', 'Ardennes', 'Azteca',
  'Bashkir Curly', 'Belgian Draft', 'Brumby', 'Budyonny', 'Canadian Horse', 'Caspian',
  'Cleveland Bay', 'Clydesdale', 'Criollo', 'Dutch Warmblood', 'Exmoor Pony', 'Fell Pony',
  'Friesian', 'Gypsy Vanner', 'Hackney Horse', 'Haflinger', 'Hanoverian', 'Highland Pony',
  'Holsteiner', 'Icelandic Horse', 'Irish Draught', 'Knabstrupper', 'Lipizzaner', 'Lusitano',
  'Marwari', 'Miniature Horse', 'Missouri Fox Trotter', 'Morgan', 'Mustang', 'Nokota Horse',
  'Oldenburg', 'Paso Fino', 'Percheron', 'Peruvian Paso', 'Pinto', 'Pony of the Americas',
  "Przewalski's Horse", 'Quarter Horse', 'Rocky Mountain Horse', 'Shetland Pony', 'Shire',
  'Suffolk Punch', 'Tennessee Walking Horse', 'Thoroughbred', 'Trakehner', 'Welsh Pony',
  'Westphalian', 'Zangersheide', 'Other',
];

const GENDERS = ['Gelding', 'Mare', 'Stallion'];
const COLORS = ['Bay', 'Chestnut', 'Black', 'Gray', 'Roan', 'Palomino', 'Isabella'];

export const MAX_IMAGES = 5;
export const MAX_VIDEOS = 3;
const MAX_IMAGE_SIZE = 50 * 1024 * 1024;

export const EMPTY_HORSE = {
  name: '',
  age: '',
  height_cm: 1.5,
  description: '',
  gender: '',
  color: '',
  training_level: '',
  piroplasmosis: false,
  breed: '',
  breeder: '',
};

export const EMPTY_ANCESTORS = {
  father: {},
  mother: {},
  paternal_grandfather: {},
  paternal_grandmother: {},
  maternal_grandfather: {},
  maternal_grandmother: {},
};

export const STEPS = [
  { id: 'details', label: 'Details' },
  { id: 'media', label: 'Photos & videos', short: 'Media' },
  { id: 'pedigree', label: 'Pedigree' },
];

// Validação do novo cavalo. Devolve os erros por campo e o passo do primeiro erro.
export const validateNewHorse = (horse, images) => {
  const errors = {};
  if (!horse.name.trim()) errors.name = 'Name is required.';
  if (!horse.age || horse.age <= 0) errors.age = 'Year of birth is required.';
  if (!horse.gender) errors.gender = 'Gender is required.';
  if (!horse.color) errors.color = 'Color is required.';
  if (!horse.training_level.trim()) errors.training_level = 'Training level is required.';
  if (images.length === 0) errors.images = 'At least one photo is required.';

  const detailsHaveErrors = Object.keys(errors).some((key) => key !== 'images');
  const step = detailsHaveErrors ? 0 : errors.images ? 1 : null;
  return { errors, step };
};

// Envia o ficheiro ao backend para compressão e devolve o ficheiro comprimido
const compressFile = async (kind, file) => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('User not authenticated. Please log in again.');

  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/${kind}s_compress/compress`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error(`Error sending ${kind} for compression.`);

  const blob = await response.blob();
  return new File([blob], file.name, { type: kind === 'video' ? 'video/mp4' : file.type });
};

// Primeira letra em maiúscula, sem mexer no resto (nomes próprios, siglas)
const capitalizeFirst = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const yearOptions = (selected) => {
  const current = new Date().getFullYear();
  const years = Array.from({ length: 41 }, (_, i) => current - i);
  const year = Number(selected);
  if (year && !years.includes(year)) years.push(year);
  return years.sort((a, b) => b - a);
};

const Field = ({ id, label, error, optional, className, children }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <label htmlFor={id} className="text-[13px] font-medium">
      {label}
      {optional && <span className="font-normal text-muted-foreground"> · optional</span>}
    </label>
    {children}
    {error && <p id={`${id}-error`} className="text-[12.5px] font-medium text-destructive">{error}</p>}
  </div>
);

const errorProps = (id, error) =>
  error ? { 'aria-invalid': true, 'aria-describedby': `${id}-error` } : {};

// <select> nativo (melhor no telemóvel) com o aspeto do Input
const NativeSelect = ({ id, error, className, children, ...props }) => (
  <div className="relative">
    <select
      id={id}
      {...errorProps(id, error)}
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

const SectionTitle = ({ title, children }) => (
  <div className="flex flex-col gap-0.5">
    <h2 className="font-serif text-[28px] font-bold leading-tight">{title}</h2>
    {children && <p className="text-sm text-muted-foreground">{children}</p>}
  </div>
);

/* ---------- Passo 1: dados do cavalo ---------- */

const DetailsStep = ({ horse, setHorse, errors, capitalize }) => {
  const set = (name, value) => setHorse((prev) => ({ ...prev, [name]: value }));
  const onText = (e) => set(e.target.name, capitalize ? capitalizeFirst(e.target.value) : e.target.value);
  const onPlain = (e) => set(e.target.name, e.target.value);
  // Cavalos antigos podem não ter altura: o slider mostra 1.5 m mas nada muda até ser mexido
  const height = horse.height_cm;

  return (
    <div className="flex flex-col gap-5">
      <SectionTitle title="Details">Identification and basic information.</SectionTitle>
      <div className="grid gap-4 rounded-[14px] border bg-card p-4 md:grid-cols-2 md:gap-5 md:p-6">
        <Field id="horse-name" label="Name" error={errors.name} className="md:col-span-2">
          <Input id="horse-name" name="name" value={horse.name} onChange={onText} autoComplete="off" {...errorProps('horse-name', errors.name)} />
        </Field>

        <Field id="horse-age" label="Year of birth" error={errors.age}>
          <NativeSelect id="horse-age" name="age" value={horse.age || ''} error={errors.age} onChange={(e) => set('age', e.target.value ? Number(e.target.value) : '')}>
            <option value="">Select year</option>
            {yearOptions(horse.age).map((year) => <option key={year} value={year}>{year}</option>)}
          </NativeSelect>
        </Field>

        <Field id="horse-gender" label="Gender" error={errors.gender}>
          <NativeSelect id="horse-gender" name="gender" value={horse.gender || ''} error={errors.gender} onChange={onPlain}>
            <option value="">Select gender</option>
            {GENDERS.map((gender) => <option key={gender} value={gender}>{gender}</option>)}
          </NativeSelect>
        </Field>

        <Field id="horse-color" label="Color" error={errors.color}>
          <NativeSelect id="horse-color" name="color" value={horse.color || ''} error={errors.color} onChange={onPlain}>
            <option value="">Select color</option>
            {COLORS.map((color) => <option key={color} value={color}>{color}</option>)}
          </NativeSelect>
        </Field>

        <Field id="horse-breed" label="Breed" optional>
          {/* Sugestões da lista, mas aceita qualquer raça escrita */}
          <Input id="horse-breed" name="breed" list="horse-breeds" value={horse.breed || ''} onChange={onPlain} placeholder="Type or select a breed" autoComplete="off" />
          <datalist id="horse-breeds">
            {BREEDS.map((breed) => <option key={breed} value={breed} />)}
          </datalist>
        </Field>

        <Field id="horse-breeder" label="Breeder" optional>
          <Input id="horse-breeder" name="breeder" value={horse.breeder || ''} onChange={onPlain} autoComplete="off" />
        </Field>

        <Field id="horse-training" label="Training level" error={errors.training_level}>
          <Input id="horse-training" name="training_level" value={horse.training_level || ''} onChange={onText} autoComplete="off" {...errorProps('horse-training', errors.training_level)} />
        </Field>

        <Field id="horse-height" label="Height">
          <div className="flex h-10 items-center gap-3">
            <input
              id="horse-height"
              type="range"
              min="0.5"
              max="2.5"
              step="0.01"
              value={height ?? 1.5}
              onChange={(e) => set('height_cm', parseFloat(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer accent-primary"
            />
            <span className="w-28 shrink-0 text-right text-sm font-medium lining-nums tabular-nums">
              {height ? (
                <>
                  {height} m <span className="text-muted-foreground">· {(height / 0.1016).toFixed(1)} hh</span>
                </>
              ) : (
                <span className="text-muted-foreground">Not set</span>
              )}
            </span>
          </div>
        </Field>

        <label htmlFor="horse-piroplasmosis" className="flex items-center justify-between gap-4 rounded-md border border-input px-3 py-2.5 md:self-end">
          <span className="text-[13px] font-medium">Piroplasmosis</span>
          <input
            id="horse-piroplasmosis"
            type="checkbox"
            role="switch"
            name="piroplasmosis"
            checked={!!horse.piroplasmosis}
            onChange={(e) => set('piroplasmosis', e.target.checked)}
            className="relative h-6 w-10 shrink-0 cursor-pointer appearance-none rounded-full bg-[#d9d2c3] transition-colors before:absolute before:top-0.5 before:left-0.5 before:size-5 before:rounded-full before:bg-white before:shadow before:transition-transform checked:bg-primary checked:before:translate-x-4 focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none"
          />
        </label>

        <Field id="horse-description" label="Description" optional className="md:col-span-2">
          <Textarea id="horse-description" name="description" rows={5} value={horse.description || ''} onChange={onText} placeholder="Temperament, achievements, notes…" />
        </Field>
      </div>
    </div>
  );
};

/* ---------- Passo 2: fotografias e vídeos ---------- */

// Pré-visualização de um ficheiro local (liberta o URL ao sair)
const useObjectUrl = (file) => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!(file instanceof Blob)) return undefined;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return url;
};

const PhotoThumb = ({ image, index, onRemove }) => {
  const localUrl = useObjectUrl(typeof image === 'string' ? null : image);
  const src = typeof image === 'string' ? image : localUrl;
  return (
    <li className="relative aspect-square overflow-hidden rounded-[10px] bg-secondary" data-testid="photo-item">
      {src && <img src={src} alt={`Photo ${index + 1}`} className="size-full object-cover" />}
      {index === 0 && (
        <span className="absolute bottom-1.5 left-1.5 rounded-full bg-foreground/70 px-2 py-0.5 text-[10.5px] font-semibold text-background">
          Cover
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove photo ${index + 1}`}
        className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-foreground/60 text-background backdrop-blur hover:bg-foreground/80"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </li>
  );
};

const VideoThumb = ({ video, index, onRemove }) => (
  <li className="relative aspect-video overflow-hidden rounded-[10px] bg-foreground" data-testid="video-item">
    <video
      src={typeof video === 'string' ? video : video.url}
      className="size-full object-cover"
      controls
      controlsList="nodownload"
      playsInline
      preload="metadata"
    />
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove video ${index + 1}`}
      className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/80"
    >
      <X className="size-4" aria-hidden="true" />
    </button>
  </li>
);

// Botão tracejado para acrescentar ficheiros (abre o seletor do sistema)
const AddTile = ({ id, icon: Icon, label, accept, processing, onFiles, invalid, className }) => {
  const inputRef = useRef(null);
  return (
    <li className={className}>
      <button
        type="button"
        id={id}
        onClick={() => inputRef.current?.click()}
        disabled={processing}
        aria-invalid={invalid || undefined}
        className="flex size-full flex-col items-center justify-center gap-1 rounded-[10px] border-[1.5px] border-dashed border-[#c9c0ae] text-[12.5px] font-semibold text-primary hover:bg-primary-soft/60 disabled:opacity-60 aria-invalid:border-destructive aria-invalid:text-destructive focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none"
      >
        {processing ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Icon className="size-5" aria-hidden="true" />}
        {processing ? 'Processing…' : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        data-testid={`${id}-input`}
        onChange={(e) => {
          onFiles(Array.from(e.target.files || []));
          e.target.value = '';
        }}
      />
    </li>
  );
};

const MediaStep = ({ images, setImages, videos, setVideos, onExistingRemoved, errors }) => {
  const [processing, setProcessing] = useState({ image: false, video: false });
  const [mediaErrors, setMediaErrors] = useState({ image: null, video: null });

  const addFiles = async (kind, files) => {
    if (files.length === 0) return;
    const current = kind === 'image' ? images : videos;
    const max = kind === 'image' ? MAX_IMAGES : MAX_VIDEOS;
    const fail = (message) => setMediaErrors((prev) => ({ ...prev, [kind]: message }));

    if (files.length + current.length > max) return fail(`You can upload a maximum of ${max} ${kind}s.`);
    if (kind === 'image' && files.some((file) => file.size > MAX_IMAGE_SIZE)) {
      return fail('Each photo must be no larger than 50 MB.');
    }

    setProcessing((prev) => ({ ...prev, [kind]: true }));
    fail(null);
    try {
      const compressed = await Promise.all(files.map((file) => compressFile(kind, file)));
      if (kind === 'image') {
        setImages((prev) => [...prev, ...compressed]);
      } else {
        setVideos((prev) => [
          ...prev,
          ...compressed.map((file) => ({ id: `${file.name}-${Date.now()}`, file, url: URL.createObjectURL(file) })),
        ]);
      }
    } catch (error) {
      fail(error.message || `Error processing ${kind}s.`);
    } finally {
      setProcessing((prev) => ({ ...prev, [kind]: false }));
    }
  };

  // Ficheiros já guardados no servidor (URL) são marcados para apagar ao gravar
  const remove = (kind, index) => {
    const list = kind === 'image' ? images : videos;
    const item = list[index];
    if (typeof item === 'string') onExistingRemoved?.(kind, item);
    if (item?.url?.startsWith('blob:')) URL.revokeObjectURL(item.url);
    (kind === 'image' ? setImages : setVideos)((prev) => prev.filter((_, i) => i !== index));
  };

  const photoError = mediaErrors.image || errors.images;

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="photos-title" className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h2 id="photos-title" className="font-serif text-[28px] font-bold leading-tight">Photos</h2>
            <p className="text-sm text-muted-foreground">Up to {MAX_IMAGES}. The first one is the cover.</p>
          </div>
          <span className="text-sm text-muted-foreground lining-nums tabular-nums">{images.length}/{MAX_IMAGES}</span>
        </div>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {images.map((image, index) => (
            <PhotoThumb key={typeof image === 'string' ? image : `${image.name}-${index}`} image={image} index={index} onRemove={() => remove('image', index)} />
          ))}
          {images.length < MAX_IMAGES && (
            <AddTile
              id="add-photos"
              icon={ImagePlus}
              label="Add photos"
              accept="image/*"
              processing={processing.image}
              invalid={!!photoError}
              onFiles={(files) => addFiles('image', files)}
              className="aspect-square"
            />
          )}
        </ul>
        {photoError && <p role="alert" className="text-[12.5px] font-medium text-destructive">{photoError}</p>}
      </section>

      <section aria-labelledby="videos-title" className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h2 id="videos-title" className="font-serif text-[28px] font-bold leading-tight">Videos</h2>
            <p className="text-sm text-muted-foreground">Optional, up to {MAX_VIDEOS}.</p>
          </div>
          <span className="text-sm text-muted-foreground lining-nums tabular-nums">{videos.length}/{MAX_VIDEOS}</span>
        </div>
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {videos.map((video, index) => (
            <VideoThumb key={typeof video === 'string' ? video : video.id} video={video} index={index} onRemove={() => remove('video', index)} />
          ))}
          {videos.length < MAX_VIDEOS && (
            <AddTile
              id="add-videos"
              icon={Video}
              label="Add videos"
              accept="video/*"
              processing={processing.video}
              onFiles={(files) => addFiles('video', files)}
              className="aspect-video"
            />
          )}
        </ul>
        {mediaErrors.video && <p role="alert" className="text-[12.5px] font-medium text-destructive">{mediaErrors.video}</p>}
      </section>
    </div>
  );
};

/* ---------- Passo 3: pedigree ---------- */

const AncestorFields = ({ relation, label, dotClassName, ancestor = {}, onChange }) => (
  <fieldset className="flex flex-col gap-3 rounded-[14px] border bg-card p-4" data-testid={`ancestor-${relation}`}>
    <legend className="sr-only">{label}</legend>
    <span aria-hidden="true" className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
      {dotClassName && <span className={cn('size-[7px] rounded-full', dotClassName)} />}
      {label}
    </span>
    <Input aria-label={`${label} name`} placeholder="Name" value={ancestor.name || ''} onChange={(e) => onChange(relation, 'name', e.target.value)} autoComplete="off" />
    <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
      <Input aria-label={`${label} breed`} placeholder="Breed" list="horse-breeds" value={ancestor.breed || ''} onChange={(e) => onChange(relation, 'breed', e.target.value)} autoComplete="off" />
      <Input aria-label={`${label} breeder`} placeholder="Breeder" value={ancestor.breeder || ''} onChange={(e) => onChange(relation, 'breeder', e.target.value)} autoComplete="off" />
    </div>
  </fieldset>
);

const PedigreeStep = ({ ancestors, setAncestors }) => {
  const update = (relation, field, value) =>
    setAncestors((prev) => ({ ...prev, [relation]: { ...prev[relation], [field]: value } }));

  return (
    <div className="flex flex-col gap-5">
      <SectionTitle title="Pedigree">Parents and grandparents. Fill in what you know.</SectionTitle>
      {/* Lista de raças partilhada com o passo 1 (quando este não está montado) */}
      <datalist id="horse-breeds">
        {BREEDS.map((breed) => <option key={breed} value={breed} />)}
      </datalist>
      {LINES.map((line) => (
        <section key={line.key} aria-label={`${line.parent.label} line`} className="flex flex-col gap-2">
          <h3 className={cn('pl-1 text-[11px] font-semibold uppercase tracking-[0.12em]', line.parent.text)}>
            {line.parent.label} line
          </h3>
          <div className="grid gap-2 md:grid-cols-3 md:gap-3">
            <AncestorFields
              relation={line.parent.relation}
              label={line.parent.label}
              dotClassName={line.parent.dot}
              ancestor={ancestors[line.parent.relation]}
              onChange={update}
            />
            {line.grandparents.map(({ relation, label }) => (
              <AncestorFields key={relation} relation={relation} label={label} ancestor={ancestors[relation]} onChange={update} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

/* ---------- Formulário completo ---------- */

/**
 * Formulário do cavalo em três passos, usado em "Add horse" e "Edit horse".
 * O estado e a gravação vivem na página; aqui fica só o aspeto e a navegação entre passos.
 * - saveFromAnyStep: no editar, "Save changes" está sempre disponível;
 *   no criar, só no último passo (Enter nos passos anteriores avança).
 */
const HorseForm = ({
  eyebrow,
  title,
  backTo,
  backLabel,
  horse,
  setHorse,
  ancestors,
  setAncestors,
  images,
  setImages,
  videos,
  setVideos,
  onExistingRemoved,
  errors = {},
  focusErrorsKey = 0,
  step,
  setStep,
  onSubmit,
  submitLabel,
  isSubmitting,
  submitError,
  saveFromAnyStep = false,
  capitalize = false,
}) => {
  const formRef = useRef(null);
  const isLast = step === STEPS.length - 1;

  // Depois de uma validação falhada, leva o foco ao primeiro campo com erro
  useEffect(() => {
    if (!focusErrorsKey) return;
    const invalid = formRef.current?.querySelector('[aria-invalid="true"]');
    invalid?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    invalid?.focus();
  }, [focusErrorsKey]);

  const goTo = (next) => {
    setStep(next);
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!saveFromAnyStep && !isLast) return goTo(step + 1);
    onSubmit();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="mx-auto flex w-full max-w-3xl flex-col gap-6" data-testid="horse-form">
      <div className="flex flex-col gap-3">
        <Link to={backTo} className="flex items-center gap-1 self-start text-sm font-medium text-primary">
          <ChevronLeft className="size-4" aria-hidden="true" />
          {backLabel}
        </Link>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-leather">{eyebrow}</span>
          <h1 className="font-serif text-[44px] font-bold leading-none md:text-[56px]">{title}</h1>
        </div>
      </div>

      <nav aria-label="Form steps">
        <ol className="grid grid-cols-3 gap-2">
          {STEPS.map((item, index) => {
            const current = index === step;
            const done = index < step;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-current={current ? 'step' : undefined}
                  disabled={isSubmitting}
                  className={cn(
                    'flex w-full flex-col gap-2 text-left text-[12.5px] font-medium text-muted-foreground md:text-sm',
                    current && 'text-foreground'
                  )}
                >
                  <span className={cn('h-1 w-full rounded-full bg-secondary', (current || done) && 'bg-primary')} />
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold lining-nums',
                        current && 'border-primary bg-primary text-primary-foreground',
                        done && 'border-primary text-primary'
                      )}
                    >
                      {done ? <Check className="size-3" aria-hidden="true" /> : index + 1}
                    </span>
                    <span className="sm:hidden">{item.short || item.label}</span>
                    <span className="max-sm:hidden">{item.label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {step === 0 && <DetailsStep horse={horse} setHorse={setHorse} errors={errors} capitalize={capitalize} />}
      {step === 1 && (
        <MediaStep
          images={images}
          setImages={setImages}
          videos={videos}
          setVideos={setVideos}
          onExistingRemoved={onExistingRemoved}
          errors={errors}
        />
      )}
      {step === 2 && <PedigreeStep ancestors={ancestors} setAncestors={setAncestors} />}

      {submitError && (
        <p role="alert" className="rounded-[14px] bg-[#f6e3e1] p-4 text-sm font-medium text-destructive">{submitError}</p>
      )}

      <div className="flex items-center justify-between gap-3 border-t pt-5">
        {step > 0 ? (
          <Button type="button" variant="ghost" size="lg" onClick={() => goTo(step - 1)} disabled={isSubmitting}>
            <ChevronLeft />Back
          </Button>
        ) : (
          <Button asChild variant="ghost" size="lg">
            <Link to={backTo}>Cancel</Link>
          </Button>
        )}
        <div className="flex items-center gap-2">
          {!isLast && (
            <Button
              type={saveFromAnyStep ? 'button' : 'submit'}
              variant={saveFromAnyStep ? 'outline' : 'default'}
              size="lg"
              onClick={saveFromAnyStep ? () => goTo(step + 1) : undefined}
              disabled={isSubmitting}
            >
              Next
            </Button>
          )}
          {(isLast || saveFromAnyStep) && (
            <Button type="submit" size="lg" disabled={isSubmitting} data-testid="horse-form-submit">
              {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
              {isSubmitting ? 'Saving…' : submitLabel}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default HorseForm;
