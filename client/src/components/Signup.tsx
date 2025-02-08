import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../store/authSlice';
import { AppDispatch } from '../store/store';

const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        age: '',
        address: '',
        sexe: ''
    });
    
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const validatePassword = (password: string) => {
        // Check the length, numbers, and special characters
        const hasNumber = /\d/;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
        const minLength = 8;

        if (password.length >= minLength && hasNumber.test(password) && hasSpecialChar.test(password)) {
            setPasswordStrength('Strong');
        } else if (password.length >= minLength && hasNumber.test(password)) {
            setPasswordStrength('Medium');
        } else if (password.length >= minLength) {
            setPasswordStrength('Weak');
        } else {
            setPasswordStrength('');
            setPasswordError('Password must be at least 8 characters long.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password.length < 8) {
            setPasswordError('Password must be at least 8 characters long.');
            return;
        }

        try {
            await dispatch(registerUser(formData)).unwrap();
            navigate('/login');
        } catch (error) {
            alert('Registration failed. Please try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'password') {
            validatePassword(value);  // Update password strength on each input change
        } else if (name === 'password' && value.length >= 8) {
            setPasswordError('');
        }
    };

    return (
        <div className="signup-container container mb-0">
            <div className="card signup-card shadow-lg p-4">
                <h2 className="text-center mb-4">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Username:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            {formData.password && (
                                <small className={`text-${passwordStrength === 'Strong' ? 'success' : passwordStrength === 'Medium' ? 'warning' : 'danger'}`}>
                                    {passwordStrength ? `Password Strength: ${passwordStrength}` : ''}
                                </small>
                            )}
                            {passwordError && (
                                <div className="text-danger mt-2">
                                    {passwordError}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">First Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Last Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Age:</label>
                            <input
                                type="number"
                                className="form-control"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Address:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Gender:</label>
                            <select
                                className="form-select"
                                name="sexe"
                                value={formData.sexe}
                                onChange={handleChange}
                                required
                            >
                                <option value="other">Other</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={formData.password.length < 8}>
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
