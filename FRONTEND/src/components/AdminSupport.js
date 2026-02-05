import React, { useState, useEffect } from 'react';
import api from '../api/config';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './styles/AdminSupport.css'; 
import './styles/SupportForm.css'; // Reusing back link styles

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
        const response = await api.get('/support/requests', {
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
      await api.post(`/support/respond/${currentRequest._id}`, { solution }, {
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
      <Helmet>
        <title>Admin Support Panel - HealingWave</title>
      </Helmet>

      <div className="back-link-container">
        <Link to="/" className="support-back-home">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
      </div>

      <div className="admin-support-box dark:bg-zinc-900 dark:border-zinc-800">
        <h1 className="title dark:text-gray-100">Admin Support Panel</h1>

        {successMessage && <div className="notification is-success">{successMessage}</div>}
        {errorMessage && <div className="notification is-danger">{errorMessage}</div>}

        <div className="columns is-multiline">
          {currentRequests.map((request) => (
            <div key={request._id} className="column is-half">
              <div className={`card dark:bg-zinc-800 dark:border-zinc-700 ${request.status === 'Resolved' ? 'is-resolved dark:bg-emerald-900/10' : ''}`}>
                <header className="card-header dark:border-zinc-700">
                  <p className="card-header-title dark:text-gray-100">
                    <i className="fas fa-user-circle" style={{ marginRight: '10px', color: '#667eea' }}></i>
                    {request.name}
                  </p>
                  <p className="card-header-email dark:text-gray-400">{request.email}</p>
                </header>
                <div className="card-content">
                  <div className="content dark:text-gray-300">
                    <p><strong className="dark:text-gray-100"><i className="fas fa-comment-alt" style={{ marginRight: '8px' }}></i> Message:</strong><br/>{request.message}</p>
                    {request.solution && (
                      <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '10px' }} className="dark:bg-indigo-900/20">
                        <p><strong className="dark:text-gray-100"><i className="fas fa-check-circle" style={{ marginRight: '8px', color: '#10b981' }}></i> Solution:</strong><br/>{request.solution}</p>
                      </div>
                    )}
                  </div>
                </div>
                {!request.solution && (
                  <footer className="card-footer dark:border-zinc-700">
                    <button
                      className="support-form-button"
                      onClick={() => setCurrentRequest(request)}
                      style={{ margin: 0, padding: '10px' }}
                    >
                      <i className="fas fa-reply" style={{ marginRight: '8px' }}></i>
                      Respond
                    </button>
                  </footer>
                )}
              </div>
            </div>
          ))}
        </div>

        {requests.length > requestsPerPage && (
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
        )}

        {currentRequest && (
          <div className="response-form dark:bg-zinc-800 dark:border-zinc-700">
            <h3 className="title is-4 dark:text-gray-100" style={{ marginBottom: '20px' }}>
              Responding to {currentRequest.name}
            </h3>
            <form onSubmit={handleRespond}>
              <div className="field">
                <div className="control">
                  <textarea
                    className="textarea dark:bg-zinc-900 dark:border-zinc-700 dark:text-gray-200 dark:placeholder-gray-500"
                    placeholder="Provide a solution or response..."
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="field" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button className="support-form-button dark:bg-indigo-600 dark:text-white" style={{ flex: 1, margin: 0 }}>
                  Submit Response
                </button>
                <button 
                  type="button" 
                  className="support-form-button dark:bg-zinc-700 dark:text-gray-300" 
                  style={{ flex: 1, margin: 0, background: '#718096' }}
                  onClick={() => setCurrentRequest(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupport;
