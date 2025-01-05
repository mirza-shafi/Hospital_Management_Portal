import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.min.css';
import './styles/BloodAvailability.css';
import { Helmet } from 'react-helmet';
import axios from 'axios';

const BloodAvailability = () => {
  const [bloodGroups, setBloodGroups] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBloodAvailability = async () => {
      try {
        const response = await axios.get('/api/bloodavailability');
        setBloodGroups(response.data);
      } catch (error) {
        setError('Failed to load blood availability data.');
      }
    };

    fetchBloodAvailability();
  }, []);

  return (
    <section className="blood-availability-page">
      <div className="blood-availability-box-container">
          <Helmet>
             <title>Blood Availability Page</title>
            </Helmet>
        <h1 className="blood-availability-title">Blood Group Availability</h1>
        {error && <div className="notification is-danger blood-availability-notification">{error}</div>}
        <div className="blood-availability-table-container">
          <table className="table is-fullwidth blood-availability-table">
            <thead>
              <tr>
                <th>Blood Group</th>
                <th>Total Bags Available</th>
              </tr>
            </thead>
            <tbody>
              {bloodGroups.map(group => (
                <tr key={group.bloodGroup} className="blood-availability-row">
                  <td>{group.bloodGroup}</td>
                  <td>{group.count} bags available</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default BloodAvailability;
