import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserInjured, faUserMd, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import api from '../../../core/api/config';
import { storage } from '../../../utils/storage';
import { useAuthModal } from '../AuthModalContext';
import '../../../components/styles/Login.css';
import '../../../components/styles/AuthModal.css';

const emptyForm = {
  email: '', password: '', confirmPassword: '',
  firstName: '', lastName: '', sex: '', dateOfBirth: '', mobileNumber: '', specialty: '',
};

const AuthModal = () => {
  const navigate = useNavigate();
  const { open, role: initialRole, mode: initialMode, redirect, closeAuth } = useAuthModal();

  const [role, setRole] = useState('patient');   // 'patient' | 'doctor'
  const [mode, setMode] = useState('login');      // 'login' | 'signup'
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Sync internal state when opened
  useEffect(() => {
    if (open) {
      setRole(initialRole || 'patient');
      setMode(initialMode || 'login');
      setForm(emptyForm);
      setError('');
      setInfo('');
      setShowPassword(false);
    }
  }, [open, initialRole, initialMode]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  if (!open) return null;

  const onChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const switchRole = (r) => { setRole(r); setError(''); setInfo(''); setForm(emptyForm); };
  const switchMode = (m) => { setMode(m); setError(''); setInfo(''); setForm(emptyForm); setShowPassword(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');

    try {
      setLoading(true);
      if (mode === 'login') {
        if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
        if (role === 'patient') {
          const res = await api.post('/patients/plogin', { email: form.email, password: form.password });
          if (res.data.token) {
            storage.setItem('patientToken', res.data.token);
            storage.setItem('patientEmail', form.email);
            closeAuth();
            navigate(redirect || '/patient');
          }
        } else {
          const res = await api.post('/doctors/dlogin', { email: form.email, password: form.password });
          if (res.data.token) {
            storage.setItem('doctorToken', res.data.token);
            storage.setItem('doctorEmail', form.email);
            closeAuth();
            navigate('/doctor-account');
          }
        }
      } else {
        // signup
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }

        if (role === 'patient') {
          const { firstName, lastName, email, sex, dateOfBirth, mobileNumber, password } = form;
          if (!firstName || !lastName || !email || !sex || !dateOfBirth || !mobileNumber) { setError('All fields are required'); return; }
          await api.post('/patients/register', {
            name: `${firstName} ${lastName}`, email, password, sex, dateOfBirth, mobileNumber,
          });
        } else {
          const { firstName, lastName, email, mobileNumber, specialty, password } = form;
          if (!firstName || !lastName || !email || !mobileNumber || !specialty) { setError('All fields are required'); return; }
          await api.post('/doctors/dregister', { firstName, lastName, email, mobileNumber, specialty, password });
        }
        // Success → switch to login
        setMode('login');
        setForm({ ...emptyForm, email: form.email });
        setInfo('Account created successfully. Please sign in.');
      }
    } catch (err) {
      setError(err.response?.data?.message || (mode === 'login' ? 'Login failed' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'login'
    ? `${role === 'patient' ? 'Patient' : 'Doctor'} Sign In`
    : `${role === 'patient' ? 'Patient' : 'Doctor'} Registration`;

  return (
    <div className="auth-modal__overlay" onMouseDown={closeAuth}>
      <div className="auth-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="auth-modal__close" onClick={closeAuth} aria-label="Close">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Role selector */}
        <div className="auth-modal__roles">
          <button
            className={`auth-role ${role === 'patient' ? 'active' : ''}`}
            onClick={() => switchRole('patient')}
            type="button"
          >
            <FontAwesomeIcon icon={faUserInjured} />
            <span>Patient</span>
          </button>
          <button
            className={`auth-role ${role === 'doctor' ? 'active' : ''}`}
            onClick={() => switchRole('doctor')}
            type="button"
          >
            <FontAwesomeIcon icon={faUserMd} />
            <span>Doctor</span>
          </button>
        </div>

        <h2 className="auth-modal__title">{title}</h2>

        {/* Mode tabs */}
        <div className="auth-modal__tabs">
          <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => switchMode('login')} type="button">Sign In</button>
          <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => switchMode('signup')} type="button">Sign Up</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form auth-modal__form">
          {mode === 'signup' && (
            <div className="input-row">
              <div className="input-group">
                <label>First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={onChange} placeholder="John" required />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={onChange} placeholder="Doe" required />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={onChange} placeholder="you@email.com" required />
          </div>

          {mode === 'signup' && role === 'patient' && (
            <div className="input-row">
              <div className="input-group">
                <label>Gender</label>
                <select name="sex" value={form.sex} onChange={onChange} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label>Date of Birth</label>
                <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={onChange} required />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="input-row">
              <div className="input-group">
                <label>Mobile Number</label>
                <input type="tel" name="mobileNumber" value={form.mobileNumber} onChange={onChange} placeholder="+880 1XXX-XXXXXX" required />
              </div>
              {role === 'doctor' && (
                <div className="input-group">
                  <label>Specialty</label>
                  <input type="text" name="specialty" value={form.specialty} onChange={onChange} placeholder="Cardiology" required />
                </div>
              )}
            </div>
          )}

          <div className="input-group">
            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder={mode === 'signup' ? 'Minimum 6 characters' : 'Enter password'}
                required
              />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="input-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={onChange} placeholder="Re-enter password" required />
            </div>
          )}

          {error && <div className="error-msg">{error}</div>}
          {info && <div className="info-msg">{info}</div>}

          <button type="submit" className={`login-btn ${role === 'patient' ? 'patient-btn' : 'doctor-btn'}`} disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="login-footer auth-modal__footer">
          {mode === 'login' ? (
            <p>Don't have an account?{' '}
              <button type="button" className="auth-link" onClick={() => switchMode('signup')}>Sign up</button>
            </p>
          ) : (
            <p>Already have an account?{' '}
              <button type="button" className="auth-link" onClick={() => switchMode('login')}>Sign in</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
