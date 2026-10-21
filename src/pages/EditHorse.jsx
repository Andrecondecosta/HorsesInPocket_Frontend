import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

import AppShell from '../components/AppShell';
import HorseForm, { EMPTY_ANCESTORS, EMPTY_HORSE, STEPS } from '../components/HorseForm';

// "?step=pedigree" abre diretamente no passo pedido (ex.: "Add" no pedigree do cavalo)
const initialStep = (param) => Math.max(0, STEPS.findIndex((step) => step.id === param));

const EditHorse = ({ setIsLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(() => initialStep(searchParams.get('step')));
  const [horse, setHorse] = useState(EMPTY_HORSE);
  const [savedName, setSavedName] = useState('');
  const [ancestors, setAncestors] = useState(EMPTY_ANCESTORS);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedVideos, setDeletedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [focusErrorsKey, setFocusErrorsKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchHorse = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load horse data');
        }

        const horseData = await response.json();
        setHorse(horseData);
        setSavedName(horseData.name || '');
        setImages(Array.isArray(horseData.images) ? horseData.images : []);
        setVideos(Array.isArray(horseData.videos) ? horseData.videos : []);

        const loadedAncestors = { ...EMPTY_ANCESTORS };
        horseData.ancestors?.forEach((ancestor) => {
          loadedAncestors[ancestor.relation_type] = ancestor;
        });
        setAncestors(loadedAncestors);
      } catch (error) {
        console.error('Error loading horse data:', error);
        setLoadError('Unable to load this horse. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHorse();
  }, [id]);

  // Ficheiros já guardados que o utilizador retirou: o backend apaga-os ao gravar
  const handleExistingRemoved = (kind, url) => {
    (kind === 'image' ? setDeletedImages : setDeletedVideos)((prev) => [...prev, url]);
  };

  const handleSubmit = async () => {
    if (!horse.name?.trim()) {
      setFieldErrors({ name: 'Name is required.' });
      setStep(0);
      setFocusErrorsKey((key) => key + 1);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();

    // "?? ''" para os campos vazios não seguirem como o texto "null"
    formData.append('horse[name]', horse.name);
    formData.append('horse[age]', horse.age ?? '');
    formData.append('horse[height_cm]', horse.height_cm ?? '');
    formData.append('horse[description]', horse.description ?? '');
    formData.append('horse[gender]', horse.gender ?? '');
    formData.append('horse[color]', horse.color ?? '');
    formData.append('horse[training_level]', horse.training_level ?? '');
    formData.append('horse[piroplasmosis]', !!horse.piroplasmosis);
    formData.append('horse[breed]', horse.breed ?? '');
    formData.append('horse[breeder]', horse.breeder ?? '');

    // Ancestors — inclui id para atualizar existente, ou cria novo
    Object.entries(ancestors).forEach(([relation, ancestor]) => {
      if (!ancestor) return;
      if (!ancestor.id && !ancestor.name && !ancestor.breed && !ancestor.breeder) return;
      if (ancestor.id) {
        formData.append('horse[ancestors_attributes][][id]', ancestor.id);
      }
      formData.append('horse[ancestors_attributes][][relation_type]', relation);
      formData.append('horse[ancestors_attributes][][name]', ancestor.name || '');
      formData.append('horse[ancestors_attributes][][breeder]', ancestor.breeder || '');
      formData.append('horse[ancestors_attributes][][breed]', ancestor.breed || '');
    });

    images.forEach((image) => {
      if (typeof image === 'string') {
        formData.append('existing_images[]', image);
      }
    });

    images.forEach((image) => {
      if (typeof image !== 'string') {
        formData.append('horse[images][]', image);
      }
    });

    videos.forEach((video) => {
      if (typeof video === 'string') {
        formData.append('existing_videos[]', video);
      } else {
        formData.append('horse[videos][]', video.file);
      }
    });

    deletedImages.forEach((imageUrl) => formData.append('deleted_images[]', imageUrl));
    deletedVideos.forEach((videoUrl) => formData.append('deleted_videos[]', videoUrl));

    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate(`/horses/${id}`);
      } else {
        console.error('Error updating horse:', response.statusText);
        setSubmitError('Your changes could not be saved. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setSubmitError('Your changes could not be saved. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell setIsLoggedIn={setIsLoggedIn}>
      {isLoading ? (
        <div aria-label="Loading horse" className="mx-auto flex w-full max-w-3xl animate-pulse flex-col gap-4">
          <div className="h-4 w-24 rounded bg-secondary" />
          <div className="h-12 w-2/3 rounded bg-secondary" />
          <div className="h-80 rounded-[14px] bg-secondary" />
        </div>
      ) : loadError ? (
        <p role="alert" className="mx-auto max-w-3xl rounded-[14px] bg-leather-soft p-4 text-sm">{loadError}</p>
      ) : (
        <HorseForm
          eyebrow="Edit horse"
          title={savedName || 'Unnamed horse'}
          backTo={`/horses/${id}`}
          backLabel="Back to horse"
          horse={horse}
          setHorse={setHorse}
          ancestors={ancestors}
          setAncestors={setAncestors}
          images={images}
          setImages={setImages}
          videos={videos}
          setVideos={setVideos}
          onExistingRemoved={handleExistingRemoved}
          errors={fieldErrors}
          focusErrorsKey={focusErrorsKey}
          step={step}
          setStep={setStep}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
          isSubmitting={isSubmitting}
          submitError={submitError}
          saveFromAnyStep
        />
      )}
    </AppShell>
  );
};

export default EditHorse;
