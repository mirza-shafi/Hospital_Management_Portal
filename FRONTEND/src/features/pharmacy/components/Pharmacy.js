import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowLeft, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import '../../../components/styles/Pharmacy.css';

const Pharmacy = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [selected, setSelected] = useState(null); // medicine for details modal

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('/api/medicines');
        setMedicines(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };
    fetchMedicines();
  }, []);

  // Categories derived from dosage form
  const categories = useMemo(() => {
    const set = new Set(medicines.map((m) => m.dosageForm).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [medicines]);

  const visible = useMemo(() => {
    let list = medicines.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.genericName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (category !== 'All') list = list.filter((m) => m.dosageForm === category);
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'name': list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return list;
  }, [medicines, searchTerm, category, sort]);

  return (
    <div className="pharmacy-page">
      <Helmet>
        <title>Pharmacy - HealingWave</title>
      </Helmet>

      {/* Title at the very top */}
      <div className="pharmacy-header">
        <h1>HealingWave Pharmacy</h1>
        <p>Your Trusted Partner in Health and Wellness</p>
      </div>

      <div className="pharmacy-subbar">
        <Link to="/" className="pharmacy-back">
          <FaArrowLeft /> Back to Home
        </Link>
        <span className="pharmacy-count">{visible.length} medicines</span>
      </div>

      {/* Modern toolbar: search + category + sort */}
      <div className="pharmacy-toolbar">
        <div className="pharmacy-search-bar">
          <FaSearch className="pharmacy-search-icon" />
          <input
            type="text"
            placeholder="Search by medicine or generic name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="pharmacy-sort">
          <label>Sort</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A → Z</option>
          </select>
        </div>
      </div>

      <div className="pharmacy-categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`pharmacy-chip ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* All medicines grid */}
      <div className="pharmacy-medicine-cards-container">
        {visible.map((medicine) => (
          <div key={medicine._id} className="pharmacy-medicine-card" onClick={() => setSelected(medicine)}>
            <div className="pharmacy-medicine-image">
              <img src={medicine.image} alt={medicine.name} />
              <span className="pharmacy-card-form">{medicine.dosageForm}</span>
            </div>
            <div className="pharmacy-medicine-details">
              <h4 className="pharmacy-medicine-name">
                {medicine.name}
                <span className="pharmacy-medicine-strength">{medicine.strength}</span>
              </h4>
              <p className="pharmacy-generic-name">{medicine.genericName}</p>
              <p className="pharmacy-manufacturer">{medicine.manufacturer}</p>

              <div className="pharmacy-card-footer">
                <p className="pharmacy-medicine-price">৳ {medicine.price}</p>
                <button
                  className="pharmacy-buy-btn"
                  onClick={(e) => { e.stopPropagation(); navigate('/buy-medicine'); }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="pharmacy-empty">No medicines match your search.</p>
      )}

      {/* Details modal */}
      {selected && (
        <div className="pharmacy-modal__overlay" onMouseDown={() => setSelected(null)}>
          <div className="pharmacy-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="pharmacy-modal__close" onClick={() => setSelected(null)} aria-label="Close">
              <FaTimes />
            </button>
            <div className="pharmacy-modal__body">
              <div className="pharmacy-modal__media">
                <img src={selected.image} alt={selected.name} />
              </div>
              <div className="pharmacy-modal__info">
                <span className="pharmacy-modal__tag">{selected.dosageForm}</span>
                <h2>{selected.name} <small>{selected.strength}</small></h2>
                <p className="pharmacy-modal__generic">{selected.genericName}</p>

                <ul className="pharmacy-modal__specs">
                  <li><span>Manufacturer</span><strong>{selected.manufacturer}</strong></li>
                  <li><span>Dosage Form</span><strong>{selected.dosageForm}</strong></li>
                  <li><span>Strength</span><strong>{selected.strength}</strong></li>
                  <li><span>In Stock</span><strong>{selected.strip} strips</strong></li>
                </ul>

                {selected.description && (
                  <p className="pharmacy-modal__desc">{selected.description}</p>
                )}

                <div className="pharmacy-modal__footer">
                  <span className="pharmacy-modal__price">৳ {selected.price}</span>
                  <button className="pharmacy-buy-btn lg" onClick={() => navigate('/buy-medicine')}>
                    <FaShoppingCart /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pharmacy;
