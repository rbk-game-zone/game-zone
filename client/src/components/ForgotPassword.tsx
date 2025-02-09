import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // Dynamically use the VITE_API_URL from .env
  const API_URL = import.meta.env.VITE_API_URL;

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/api/user/forgot-password`, // Use dynamic API URL here
        { email }
      );

      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Password reset link has been sent to your email.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to send password reset email.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg forgot-password-card">
        <h2 className="text-center mb-3">Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
