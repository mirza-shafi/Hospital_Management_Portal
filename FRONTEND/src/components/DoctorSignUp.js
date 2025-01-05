import React from 'react';
import './styles/DoctorSignUp.css';

const DoctorSignUp = () => {
  return (
    <div className="doctor-signup-container">
      <h1>Doctor Registration</h1>
      <form className="doctor-signup-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" placeholder="Enter your full name" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email" />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="text" id="phone" placeholder="Enter your phone number" />
        </div>
        <div className="form-group">
          <label htmlFor="specialization">Specialization</label>
          <input type="text" id="specialization" placeholder="Enter your specialization" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Create a password" />
        </div>
        <button type="submit" className="signup-button">Register</button>
      </form>
    </div>
  );
};

export default DoctorSignUp;
