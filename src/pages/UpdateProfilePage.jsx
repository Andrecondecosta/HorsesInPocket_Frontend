import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, Loader2 } from 'lucide-react';

import AppShell from '../components/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';

const Field = ({ id, label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[13px] font-medium">{label}</label>
    {children}
  </div>
);

const UpdateProfilePage = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birthdate: '',
    gender: '',
    phone_number: '',
    country: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [countryList, setCountryList] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error loading profile');
        }

        const data = await response.json();
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          birthdate: data.birthdate || '',
          gender: data.gender || '',
          phone_number: data.phone_number || '',
          country: data.country || '',
        });
      } catch (error) {
        setLoadError('Unable to load your profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setLoadError('Token not found');
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/countries`);
        if (!response.ok) throw new Error('Error loading countries');

        const data = await response.json();
        setCountryList(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user: formData }),
      });

      if (!response.ok) {
        throw new Error('Error updating profile');
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error) {
      setError('Your changes could not be saved. Please try again.');
      setIsSaving(false);
    }
  };

  // O país guardado pode não estar na lista (ou a lista pode não ter carregado): mantém-se como opção
  const countryNames = countryList.map((c) => c.name);
  const showSavedCountry = formData.country && !countryNames.includes(formData.country);

  return (
    <AppShell setIsLoggedIn={setIsLoggedIn}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Link to="/profile" className="flex items-center gap-1 self-start text-sm font-medium text-primary">
            <ChevronLeft className="size-4" aria-hidden="true" />
            Profile
          </Link>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-leather">Account</span>
            <h1 className="font-serif text-[44px] font-bold leading-none md:text-[56px]">Edit profile</h1>
          </div>
        </div>

        {isLoading ? (
          <div aria-label="Loading profile" className="h-96 animate-pulse rounded-[14px] bg-secondary" />
        ) : loadError ? (
          <p role="alert" className="rounded-[14px] bg-leather-soft p-4 text-sm">{loadError}</p>
        ) : (
          <form id="update-profile-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-4 rounded-[14px] border bg-card p-4 md:grid-cols-2 md:gap-5 md:p-6">
              <Field id="first_name" label="First name">
                <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleInputChange} autoComplete="given-name" />
              </Field>
              <Field id="last_name" label="Last name">
                <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleInputChange} autoComplete="family-name" />
              </Field>
              <Field id="birthdate" label="Date of birth">
                <Input id="birthdate" type="date" name="birthdate" value={formData.birthdate} onChange={handleInputChange} autoComplete="bday" />
              </Field>
              <Field id="gender" label="Gender">
                <NativeSelect id="gender" name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </NativeSelect>
              </Field>
              <Field id="phone_number" label="Phone">
                <Input id="phone_number" type="tel" name="phone_number" value={formData.phone_number} onChange={handleInputChange} autoComplete="tel" />
              </Field>
              <Field id="country" label="Country">
                <NativeSelect id="country" name="country" value={formData.country} onChange={handleInputChange}>
                  <option value="">Select a country</option>
                  {showSavedCountry && <option value={formData.country}>{formData.country}</option>}
                  {countryList.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
            </div>

            {success && (
              <p role="status" className="flex items-center gap-2 rounded-[14px] bg-primary-soft p-4 text-sm font-medium text-primary-soft-foreground">
                <Check className="size-4" aria-hidden="true" />
                {success}
              </p>
            )}
            {error && <p role="alert" className="rounded-[14px] bg-[#f6e3e1] p-4 text-sm font-medium text-destructive">{error}</p>}

            <div className="flex items-center justify-between gap-3 border-t pt-5">
              <Button asChild variant="ghost" size="lg">
                <Link to="/profile">Cancel</Link>
              </Button>
              <Button type="submit" size="lg" disabled={isSaving}>
                {isSaving && !success && <Loader2 className="animate-spin" aria-hidden="true" />}
                {success ? 'Saved' : isSaving ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
};

export default UpdateProfilePage;
