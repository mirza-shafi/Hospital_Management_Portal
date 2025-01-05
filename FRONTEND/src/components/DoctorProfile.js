import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './styles/DoctorProfile.css';
import { Helmet } from 'react-helmet';

const DoctorProfile = ({ email, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bloodGroup: '',
    age: '',
    degrees: '',
    institute: '',
    specialty: '',
    department: '',
    availability: '',
    profilePicture: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const res = await axios.get(`/api/doctors/ddetails/email/${email}`);
        setFormData(res.data);
        setImagePreview(res.data.profilePicture);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch doctor details.');
      }
    };

    fetchDoctorDetails();
  }, [email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePictureFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!profilePictureFile) {
      setError('Please select a file to upload.');
      return;
    }

    const pictureData = new FormData();
    pictureData.append('profilePicture', profilePictureFile);

    try {
      const uploadRes = await axios.post(`/api/doctors/upload-profile-pic/${formData._id}`, pictureData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const pictureUrl = uploadRes.data.profilePicture;
      setFormData({ ...formData, profilePicture: pictureUrl });
      setImagePreview(pictureUrl);
      setMessage('Profile picture uploaded successfully!');
      setError('');
    } catch (error) {
      setError('Failed to upload profile picture.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put('/api/doctors/dupdate', { email, ...formData });
      setMessage(res.data.message);
      setError('');
    } catch (error) {
      setMessage('');
      setError(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="modal is-active">
       <Helmet>
        <title>Doctor Profile Page</title>
      </Helmet>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Update Your Profile</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <form className="doctor-profile-form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Profile Picture</label>
              <div className="current-profile-picture">
                <img
                  src={imagePreview || '/path/to/default/profile/pic.jpg'}
                  alt="Current Profile"
                  className="profile-picture"
                />
                <button
                  type="button"
                  className="button is-info choose-photo-button"
                  onClick={() => fileInputRef.current.click()}
                >
                  Choose Photo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden-file-input"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="button is-primary upload-button"
                  onClick={handleUpload}
                >
                  Upload Photo
                </button>
              </div>
            </div>

            {/* Other form fields */}
            <div className="field">
              <label className="label">First Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Last Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Blood Group</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="bloodGroup"
                  placeholder="Blood Group"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Age</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Degrees</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="degrees"
                  placeholder="Degrees"
                  value={formData.degrees}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Institute</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="institute"
                  placeholder="Institute"
                  value={formData.institute}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Specialty</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="specialty"
                  placeholder="Specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Department</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Availability</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="availability"
                  placeholder="Availability"
                  value={formData.availability}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button className="button is-primary" type="submit">Update</button>
          </form>
          {message && <p className="notification is-success">{message}</p>}
          {error && <p className="notification is-danger">{error}</p>}
        </section>
      </div>
    </div>
  );
};

export default DoctorProfile;
