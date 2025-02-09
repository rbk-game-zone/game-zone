import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleResetPassword = async (e: any) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'Passwords do not match.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (newPassword.length < 8) { // Password length check (basic validation)
      Swal.fire({
        title: 'Error!',
        text: 'Password must be at least 8 characters long.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      setIsLoading(true); // Start loading state
      const apiUrl = import.meta.env.VITE_API_URL ; // Use environment variable
      const response = await axios.post(
        `${apiUrl}/api/user/reset-password`,
        { token, newPassword }
      );

      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Your password has been reset successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error resetting password:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to reset password.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center reset-password-card">
        <div className="col-md-6">
          <div className="card shadow-lg p-4 mt-5">
            <h1 className="text-center mb-4">Reset Password</h1>
            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">New Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isLoading} // Disable button while loading
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
