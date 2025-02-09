import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Dynamically use the VITE_API_URL from .env
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
      const response = await axios.post(
        `${API_URL}/api/user/change-password`, // Use dynamic API URL here
        { userId, currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Your password has been updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        navigate('/profile');
      }
    } catch (error:any) {
      console.error('Error changing password:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to change password.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-white text-center">
              <h3 id="changepassword">Change Password</h3>
            </div>
            <div className="card-body">
            <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label className="form-label">Current Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Change Password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
