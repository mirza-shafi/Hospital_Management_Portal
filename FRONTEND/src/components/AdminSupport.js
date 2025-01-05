import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/AdminSupport.css'; 

const AdminSupport = () => {
  const [requests, setRequests] = useState([]);
  const [solution, setSolution] = useState('');
  const [currentRequest, setCurrentRequest] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 4;

  const navigate = useNavigate(); 

  useEffect(() => {
    
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login'); 
      return;
    }

    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/support/requests', {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
    
    fetchRequests();
  }, [navigate]);

  const handleRespond = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      await axios.post(`/api/support/respond/${currentRequest._id}`, { solution }, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      setSolution('');
      setSuccessMessage('Response submitted successfully!');
      setErrorMessage('');
      setCurrentRequest(null);

      const updatedRequests = requests.map((req) =>
        req._id === currentRequest._id ? { ...req, solution, status: 'Resolved' } : req
      );
      setRequests(updatedRequests);

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error responding to request:', error);
      setErrorMessage('Failed to submit response. Please try again.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-support-container">
      <div className="box admin-support-box">
        <h1 className="title has-text-centered">Admin Support Panel</h1>

        {successMessage && <div className="notification is-success">{successMessage}</div>}
        {errorMessage && <div className="notification is-danger">{errorMessage}</div>}

        <div className="columns is-multiline">
          {currentRequests.map((request) => (
            <div key={request._id} className="column is-half">
              <div className={`card ${request.status === 'Resolved' ? 'is-resolved' : ''}`}>
                <header className="card-header">
                  <p className="card-header-title">{request.name}</p>
                  <p className="card-header-title is-small has-text-right">{request.email}</p>
                </header>
                <div className="card-content">
                  <div className="content">
                    <p>{request.message}</p>
                    {request.solution && (
                      <>
                        <hr />
                        <p><strong>Solution:</strong> {request.solution}</p>
                      </>
                    )}
                  </div>
                </div>
                {!request.solution && (
                  <footer className="card-footer">
                    <button
                      className="button is-info is-fullwidth"
                      onClick={() => setCurrentRequest(request)}
                    >
                      Respond
                    </button>
                  </footer>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pagination-container">
          {[...Array(Math.ceil(requests.length / requestsPerPage)).keys()].map(number => (
            <button
              key={number + 1}
              className={`pagination-button ${currentPage === number + 1 ? 'is-active' : ''}`}
              onClick={() => paginate(number + 1)}
            >
              {number + 1}
            </button>
          ))}
        </div>

        {currentRequest && (
          <div className="response-form">
            <form onSubmit={handleRespond}>
              <div className="field">
                <label className="label">Response to {currentRequest.name}</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button className="button is-primary">Submit Response</button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupport;
