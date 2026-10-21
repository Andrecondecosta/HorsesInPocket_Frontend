import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Estes dois CSS antigos ficam importados só porque têm regras globais (.page-title, .breadcrumbs,
// .error-message, button, textarea) de que os ecrãs ainda no design antigo dependem.
// Saem quando esses ecrãs forem redesenhados.
import './NewHorses.css';
import '../components/VideoUploader.css';

import AppShell from '../components/AppShell';
import HorseForm, { EMPTY_ANCESTORS, EMPTY_HORSE, validateNewHorse } from '../components/HorseForm';

const NewHorses = ({ setIsLoggedIn }) => {
  const [step, setStep] = useState(0);
  const [newHorse, setNewHorse] = useState(EMPTY_HORSE);
  const [ancestors, setAncestors] = useState(EMPTY_ANCESTORS);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [focusErrorsKey, setFocusErrorsKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const { errors, step: errorStep } = validateNewHorse(newHorse, images);
    setFieldErrors(errors);
    if (errorStep !== null) {
      setStep(errorStep);
      setFocusErrorsKey((key) => key + 1);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();

      formData.append('horse[name]', newHorse.name);
      formData.append('horse[age]', newHorse.age);
      formData.append('horse[height_cm]', newHorse.height_cm);
      formData.append('horse[description]', newHorse.description);
      formData.append('horse[gender]', newHorse.gender);
      formData.append('horse[color]', newHorse.color);
      formData.append('horse[training_level]', newHorse.training_level);
      formData.append('horse[piroplasmosis]', newHorse.piroplasmosis);
      formData.append('horse[breed]', newHorse.breed);
      formData.append('horse[breeder]', newHorse.breeder);

      Object.keys(ancestors).forEach((relation) => {
        const ancestor = ancestors[relation];
        formData.append(`horse[ancestors_attributes][][relation_type]`, relation);
        formData.append(`horse[ancestors_attributes][][name]`, ancestor.name || '');
        formData.append(`horse[ancestors_attributes][][breeder]`, ancestor.breeder || '');
        formData.append(`horse[ancestors_attributes][][breed]`, ancestor.breed || '');
      });

      images.forEach((image) => {
        formData.append('horse[images][]', image);
      });

      videos.forEach((video) => {
        formData.append('horse[videos][]', video.file);
      });

      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate('/myhorses');
      } else {
        console.error('Error creating horse:', response.statusText);
        setSubmitError('The horse could not be saved. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting horse:', error);
      setSubmitError('The horse could not be saved. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell setIsLoggedIn={setIsLoggedIn}>
      <HorseForm
        eyebrow="Private portfolio"
        title="Add horse"
        backTo="/myhorses"
        backLabel="My Horses"
        horse={newHorse}
        setHorse={setNewHorse}
        ancestors={ancestors}
        setAncestors={setAncestors}
        images={images}
        setImages={setImages}
        videos={videos}
        setVideos={setVideos}
        errors={fieldErrors}
        focusErrorsKey={focusErrorsKey}
        step={step}
        setStep={setStep}
        onSubmit={handleSubmit}
        submitLabel="Create horse"
        isSubmitting={isSubmitting}
        submitError={submitError}
        capitalize
      />
    </AppShell>
  );
};

export default NewHorses;
