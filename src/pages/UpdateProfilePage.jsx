import React, { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingPopup from '../components/LoadingPopup';
import './ProfilePage.css';
import './UpdateProfilePage.css';

const UpdateProfilePage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birthdate: '',
    gender: '',
    phone_number: '',
    country: '',
  });
  const [avatar, setAvatar] = useState('');
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [countryList, setCountryList] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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
        const avatarUrl =
          data.gender === 'male'
            ? 'https://res.cloudinary.com/dcvtrregd/image/upload/v1736802678/user_1_vl6pae.png'
            : 'https://res.cloudinary.com/dcvtrregd/image/upload/v1736802680/user_yp8nup.png';
        setAvatar(data.avatar || avatarUrl);
      } catch (error) {
        setError('Error loading user profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setError('Token not found');
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/countries`);
        if (!response.ok) throw new Error('Error loading countries');

        const data = await response.json();
        setCountryList(data); // ✅ Agora garantimos que os países sejam carregados
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []); // ✅ Executa apenas uma vez ao montar o componente

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user: formData }), // Ensure the use of "user"
      });

      if (!response.ok) {
        throw new Error('Error updating profile');
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (error) {
      setError('Error updating profile');
    }
  };

  if (isLoading) return <LoadingPopup message="Loading ..." />;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      <div className="update-profile-page-container">
        <h1 className="page-title">Edit Profile</h1>
        <div className="profile-breadcrumb-container">
          <div className="breadcrumbs">
            <a href="/dashboard">Dashboard</a> / <a href="/profile">Settings</a> / <span>Edit Profile</span>
          </div>
          {/* Save Button connected to the form */}
          <div className="profile-edit-actions">
            <button
              type="submit"
              className="profile-save-button"
              form="update-profile-form" // Connect the button to the form
            >
              <FaSave /> Save
            </button>
          </div>
        </div>
        <div className="update-profile-details-container">
          {/* Profile Image */}
          <div className="profile-image">
            <img src={avatar} alt="Profile Picture" />
          </div>

          {/* Edit Form */}
          <form
            id="update-profile-form" // Form identifier
            onSubmit={handleSubmit}
            className="inline-edit-profile"
          >
            <div className="profile-details">
              <p>
                <strong>First Name:</strong>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="inline-input"
                />
              </p>
              <p>
                <strong>Last Name:</strong>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="inline-input"
                />
              </p>
              <p>
                <strong>Date of Birth:</strong>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  className="inline-input"
                />
              </p>
              <p>
                <strong>Gender:</strong>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="inline-input"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </p>
              <p>
                <strong>Phone Number:</strong>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="inline-input"
                />
              </p>
              <p>
              <strong>Country:</strong>
                <select name="country" value={formData.country} onChange={handleInputChange} className="inline-input">
                  <option value="">Select a country</option>
                  {countryList.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </p>
            </div>
          </form>
        </div>
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </Layout>
  );
};

export default UpdateProfilePage;
