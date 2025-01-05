import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/AddMedicine.css';
import { Helmet } from 'react-helmet';

const AddMedicine = () => {
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [dosageForm, setDosageForm] = useState('');
  const [strength, setStrength] = useState('');
  const [price, setPrice] = useState('');
  const [strip, setStrip] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageFileName(file ? file.name : '');
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();

    if (!name || !genericName || !dosageForm || !strength || !price || !strip || !manufacturer) {
      setError('Please fill in all required fields.');
      setSuccess('');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('genericName', genericName);
    formData.append('dosageForm', dosageForm);
    formData.append('strength', strength);
    formData.append('price', price);
    formData.append('strip', strip);
    formData.append('manufacturer', manufacturer);
    formData.append('description', description);
    if (image) formData.append('image', image);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin-login');
        return;
      }

      await axios.post('/api/medicines/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setName('');
      setGenericName('');
      setDosageForm('');
      setStrength('');
      setPrice('');
      setStrip('');
      setManufacturer('');
      setDescription('');
      setImage(null);
      setImageFileName('');
      setSuccess('Medicine added to the list successfully!');
      setError('');
    } catch (err) {
      setError('Failed to add medicine to the list.');
      setSuccess('');
    }
  };

  return (
    <div className="add-medicine-container">
      <Helmet>
        <title>Manage Medicine Page</title>
      </Helmet>
      <h1 className="add-medicine-title">Manage New Medicine</h1>
      <form onSubmit={handleAddMedicine} className="add-medicine-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Generic Name</label>
            <input
              type="text"
              placeholder="Generic Name"
              value={genericName}
              onChange={(e) => setGenericName(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Dosage Form</label>
            <input
              type="text"
              placeholder="Dosage Form"
              value={dosageForm}
              onChange={(e) => setDosageForm(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Strength</label>
            <input
              type="text"
              placeholder="Strength"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Price (BDT)</label>
            <input
              type="number"
              placeholder="Price (BDT)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Strip</label>
            <input
              type="number"
              placeholder="Strip"
              value={strip}
              onChange={(e) => setStrip(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Manufacturer</label>
            <input
              type="text"
              placeholder="Manufacturer"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            ></textarea>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="form-file-input"
            />
            {imageFileName && <div className="file-name">{imageFileName}</div>}
          </div>
        </div>
        <button type="submit" className="form-button">Add Medicine</button>
      </form>
      {error && <div className="toast toast-error">{error}</div>}
      {success && <div className="toast toast-success">{success}</div>}
    </div>
  );
};

export default AddMedicine;
