import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import './styles/SuccessNotification.css';

const SuccessNotification = ({ show, message = 'Patient created successfully!', patientName = '', onClose, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="success-notification-overlay">
      <div className="success-notification-popup">
        {/* Close Button */}
        <button 
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
          className="close-btn"
          aria-label="Close notification"
        >
          <FaTimes />
        </button>

        {/* Icon */}
        <div className="notification-icon">
          <FaCheckCircle />
        </div>

        {/* Content */}
        <div className="notification-content">
          <h3 className="notification-title">Success!</h3>
          <p className="notification-message">{message}</p>
          {patientName && (
            <p className="patient-name">
              Patient: <strong>{patientName}</strong>
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="notification-progress" style={{ animation: `progress ${duration}ms linear forwards` }}></div>
      </div>
    </div>
  );
};

export default SuccessNotification;
