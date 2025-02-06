import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { updateUser } from '../store/authSlice';
import ChangePassword from './ChangePassword';

const Profile = () => {
  console.log("Retrieving user data:", localStorage.getItem('user'));
  const user = JSON.parse(localStorage.getItem('user') || 'null') || useSelector((state) => state.auth.user);
  console.log("Parsed user data:", user);
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [users, setUser] = useState(user);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    sexe: user?.sexe || '',
    role: user?.role || '',
    address: user?.address || '',
    firstname: user?.first_name || '',
    lastname: user?.last_name || '',
    age: user?.age || ''
  });

  // Debug logging
  console.log('User data in Profile:', user);
  console.log('CreatedAt value:', user?.createdAt);

  // Use useEffect to handle navigation
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/login');
  //   }
  // }, [isAuthenticated, navigate]);

  // if (!isAuthenticated) {
  //   return null; // Return null if not authenticated
  // }

  // Format the date
  const formatDate = (dateString:string) => {
    console.log('Formatting date string:', dateString);
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
console.log(formatDate,"formatDate");
  const handleChangePassword = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/user/forgot-password`,
        { email: user.email }
      );

      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Password reset link has been sent to your email.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }
    } catch (error :any) {
      console.error('Error sending password reset email:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to send password reset email.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleUpdate = async (e:any) => {
    e.preventDefault();
    try {
      console.log('Updating profile with data:', profileData);
      const response = await axios.put(
        `http://localhost:8000/api/user/users/${user.id}`,
        profileData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch(updateUser(updatedUser));

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been successfully updated.',
      });
      setEditMode(false);
    } catch (error:any) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || 'Failed to update profile.',
      });
    }
  };

  return (
    <div>
      <div className="profile-container">
        <h1 className="profile-title">Profile Dashboard</h1>  
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-header">
              <h2 className="profile-name">{user?.firstname} {user?.lastname}</h2>
              <p className="profile-role">{user?.role}</p>
              <p className="profile-email">{user?.email}</p>
              <p className="profile-sexe">{user?.sexe}</p>
              <p className="profile-address">{user?.address}</p>
            </div>
            
            <div className="profile-details">
              {editMode ? (
                <>
                  <div className="profile-field">
                    <label>First Name:</label>
                    <input
                      type="text"
                      value={profileData.firstname}
                      onChange={(e) => setProfileData({...profileData, firstname: e.target.value})}
                    />
                  </div>
                  <div className="profile-field">
                    <label>Last Name:</label>
                    <input
                      type="text"
                      value={profileData.lastname}
                      onChange={(e) => setProfileData({...profileData, lastname: e.target.value})}
                    />
                  </div>
                  <div className="profile-field">
                    <label>Username:</label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                    />
                  </div>
                  <div className="profile-field">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  {/* Role update input removed from user's own profile */}
                </>
              ) : (
                <>
                  <div className="detail-item">
                    <span className="detail-label">First Name</span>
                    <span className="detail-value">{user?.first_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Name</span>
                    <span className="detail-value">{user?.last_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{user?.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Role</span>
                    <span className="detail-value">{user?.role}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Sexe</span>
                    <span className="detail-value">{user?.sexe}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="profile-actions">
            {editMode ? (
              <>
                <button className="profile-button save-button" onClick={handleUpdate}>
                  Save Changes
                </button>
                <button className="profile-button cancel-button" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="profile-button edit-button" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            )}
            <button 
              className="profile-button change-password-button" 
              onClick={() => navigate('/change-password')}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;