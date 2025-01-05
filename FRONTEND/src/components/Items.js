import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './styles/Items.css';
import 'bulma/css/bulma.min.css';
import { Helmet } from 'react-helmet';

const Items = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('Test');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
    } else {
      fetchItems();
    }
  }, [navigate]);

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/items');
      setItems(res.data);
    } catch (err) {
      setError('Failed to fetch items.');
    }
  };

  const handleAddItem = async () => {
    try {
      await axios.post('/api/items/add', { name, price, type });
      setName('');
      setPrice('');
      setType('Test');
      setError('');
      setSuccess('Item added to the list successfully!');
      fetchItems();
    } catch (err) {
      setError('Failed to add item.');
      setSuccess('');
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  
  const offset = currentPage * itemsPerPage;
  const currentItems = items.slice(offset, offset + itemsPerPage);

  return (
    <div className="items-container">
       <Helmet>
        <title>Manage Test & Services Page</title>
      </Helmet>
      <div className="items-wrapper box">
        <h1 className="title items-title">Tests and Services</h1>
        <div className="items-form">
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input items-input"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Price (BDT)</label>
            <div className="control">
              <input
                type="number"
                placeholder="Price (BDT)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input items-input"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Type</label>
            <div className="control">
              <div className="select items-select">
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Test">Test</option>
                  <option value="Service">Service</option>
                </select>
              </div>
            </div>
          </div>
          <button onClick={handleAddItem} className="button is-primary items-button">
            Add Item
          </button>
        </div>
        {error && <p className="has-text-danger items-error">{error}</p>}
        {success && <p className="has-text-success items-success">{success}</p>}
        <ul className="items-list">
          {currentItems.map((item) => (
            <li key={item._id} className="items-list-item">
              <div className="items-list-item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-price">{item.price} BDT</span>
                <span className="item-type">{item.type}</span>
              </div>
            </li>
          ))}
        </ul>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(items.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default Items;
