import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
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
            // Check user role and navigate accordingly
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log(user.role);
            
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email or Username:</label>
                    <input
                        type="text"
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
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>
                <Link to="/forgot-password">Forgot Password?</Link>
            </p>
        </div>
    );
};

export default Login;
