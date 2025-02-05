import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e:any) => {
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

    try {
      const response = await axios.post(
        `http://localhost:8000/api/user/reset-password`,
        { token, newPassword }
      );

      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Your password has been reset successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        navigate('/login');
      }
    } catch (error:any) {
      console.error('Error resetting password:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to reset password.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleResetPassword}>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword; 