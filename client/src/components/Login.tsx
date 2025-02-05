import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../store/authSlice';
import { AppDispatch } from '../store/store';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(loginUser({ email, username, password })).unwrap();
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log(user.role);
            
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card login-card shadow-lg p-4">
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email or Username:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={email || username}
                            onChange={(e) => {
                                if (e.target.value.includes('@')) {
                                    setEmail(e.target.value);
                                    setUsername('');
                                } else {
                                    setUsername(e.target.value);
                                    setEmail('');
                                }
                            }}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
                <p className="mt-3 text-center">
                    Don't have an account? <a href="/signup" className="text-primary">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
