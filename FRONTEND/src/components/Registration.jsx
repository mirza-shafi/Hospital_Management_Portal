import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Registration.css';
import logo from '../assets/logo.png';

const Registration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        sex: '',
        dateOfBirth: '',
        mobileNumber: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear errors when user starts typing
        setError('');
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            setError('');
            
            const registrationData = {
                ...formData,
                email: formData.email.toLowerCase(),
                dateOfBirth: new Date(formData.dateOfBirth).toISOString()
            };
            delete registrationData.confirmPassword;
            
            const response = await api.post('/patients/register', registrationData);
            
            if (response.data.success) {
                setSuccess('Registration successful! Redirecting to login...');
                localStorage.setItem('token', response.data.token);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-header">
                <img src={logo} alt="HealingWave Logo" className="registration-logo" />
                <h2>Patient Account Registration</h2>
                <p>Join our healthcare community</p>
            </div>

            {error && <div className="error-message">
                <i className="fas fa-exclamation-circle"></i> {error}
            </div>}
            
            {success && <div className="success-message">
                <i className="fas fa-check-circle"></i> {success}
            </div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                    />
                    <i className="fas fa-user"></i>
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                    <i className="fas fa-envelope"></i>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                    />
                    <i className="fas fa-lock"></i>
                </div>

                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                    />
                    <i className="fas fa-lock"></i>
                </div>

                <div className="form-group">
                    <label>Gender</label>
                    <select 
                        name="sex" 
                        value={formData.sex} 
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <i className="fas fa-venus-mars"></i>
                </div>

                <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                    <i className="fas fa-calendar"></i>
                </div>

                <div className="form-group">
                    <label>Mobile Number</label>
                    <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="Enter your mobile number"
                        pattern="[0-9]{11}"
                        title="Please enter a valid 11-digit mobile number"
                        required
                    />
                    <i className="fas fa-phone"></i>
                </div>

                <button 
                    type="submit" 
                    className="register-button"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <i className="fas fa-spinner fa-spin"></i> Registering...
                        </>
                    ) : 'Register'}
                </button>
            </form>

            <div className="form-footer">
                Already have an account? <Link to="/login">Login here</Link>
            </div>
        </div>
    );
};

export default Registration; 