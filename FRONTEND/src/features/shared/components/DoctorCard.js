import React, { useState } from 'react';
import '../../../components/styles/Doctors.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faStethoscope, faGraduationCap, faClock, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

const API_ORIGIN = process.env.REACT_APP_API_URL || 'http://localhost:1002';

// Resolve a usable image URL from the stored profilePicture value.
const resolveImage = (doctor) => {
  const pic = doctor.profilePicture;
  if (!pic) return null;
  if (pic.startsWith('http')) return pic;
  return `${API_ORIGIN}${pic}`;
};

const DoctorCard = ({ doctor, onBook }) => {
  const [imgError, setImgError] = useState(false);
  const img = resolveImage(doctor);
  const fullName = `Dr. ${doctor.firstName} ${doctor.lastName}`;

  return (
    <div className="doctor-card">
      <div className="doctor-card__media">
        {img && !imgError ? (
          <img src={img} alt={fullName} onError={() => setImgError(true)} />
        ) : (
          <div className="doctor-card__placeholder">
            <FontAwesomeIcon icon={faUserMd} />
          </div>
        )}
        {doctor.department && <span className="doctor-card__dept">{doctor.department}</span>}
      </div>

      <div className="doctor-card__body">
        <h3 className="doctor-card__name">{fullName}</h3>
        {doctor.specialty && (
          <p className="doctor-card__specialty">
            <FontAwesomeIcon icon={faStethoscope} /> {doctor.specialty}
          </p>
        )}
        {doctor.degrees && (
          <p className="doctor-card__meta">
            <FontAwesomeIcon icon={faGraduationCap} /> {doctor.degrees}
          </p>
        )}
        {doctor.availability && (
          <p className="doctor-card__meta">
            <FontAwesomeIcon icon={faClock} /> {doctor.availability}
          </p>
        )}

        <button className="doctor-card__book" onClick={() => onBook(doctor)}>
          <FontAwesomeIcon icon={faCalendarCheck} /> Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
