import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../store/authSlice';
import { AppDispatch } from '../store/store';
import Swal from 'sweetalert2';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userData = await dispatch(loginUser({ email, username, password })).unwrap();
            localStorage.setItem('user', JSON.stringify(userData)); // Store user data in local storage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log(user.role);

            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Login failed.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <div className="login-container container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card login-card shadow">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Login</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="emailOrUsername" className="form-label">
                                        Email or Username:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="emailOrUsername"
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
                                    <label htmlFor="password" className="form-label">
                                        Password:
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    Login
                                </button>
                            </form>
                            <p className="text-center mt-3">
                                <Link to="/forgot-password" className="text-decoration-none">
                                    Forgot Password?
                                </Link>
                            </p>
                            <p className="text-center mt-2">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-decoration-none">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
