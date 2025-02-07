import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { updateUser } from '../store/authSlice';
import './profile.css';
import { RootState } from '../store/store';
const Profile = () => {
const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const user = storedUser || useSelector((state: RootState ) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    sexe: user?.sexe || '',
    role: user?.role || '',
    address: user?.address || '',
    firstname: user?.first_name || '',
    lastname: user?.last_name || '',
    age: user?.age || '',
    avatar: user?.avatar || ''  // Add avatar field
  });
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const storedAvatar = localStorage.getItem('avatar'); // Fetch stored avatar
  
    if (storedUser) {
      setProfileData((prevData) => ({
        ...prevData,
        username: storedUser.username || '',
        email: storedUser.email || '',
        sexe: storedUser.sexe || '',
        role: storedUser.role || '',
        address: storedUser.address || '',
        firstname: storedUser.first_name || '',
        lastname: storedUser.last_name || '',
        age: storedUser.age || '',
      }));
  
      setAvatarPreview(storedAvatar || ''); // Ensure preview stays correct
    }
  }, []);  // ✅ Empty dependency array prevents infinite loop
  
  
  
  
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');  // Avatar preview state

  // Array of available avatar icons (can be URLs or local paths to images)
  const availableAvatars = [
    'https://th.bing.com/th/id/OIP.BZDN5jtCETHvCmYtgEV8eAHaHa?w=184&h=184&c=7&r=0&o=5&dpr=1.3&pid=1.7', // Replace with actual URLs or paths to icons
    'https://cdn-icons-png.flaticon.com/128/528/528111.png',
    'avatar3.png',
    'avatar4.png',
    'avatar5.png',
    'avatar6.png',
  ];

  // Handle avatar selection
  const handleAvatarSelect = (avatar: string) => {
    setAvatarPreview(avatar); // Update preview
    localStorage.setItem('avatar', avatar); // ✅ Store avatar separately in localStorage
  };
  
  
  
  
  

  // Handle profile update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/api/user/users/${user.id}`,
        profileData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch(updateUser(updatedUser));

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been successfully updated.',
      });
      setEditMode(false);
    } catch (error: any) {
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
              {/* Display Avatar */}
              <div className="avatar-container">
                <img
                  src={avatarPreview || 'default-avatar.png'}  // Show preview or default image
                  alt="Avatar"
                  className="avatar-img"
                />
              </div>
              <div className="profile-name">{user?.username}</div>
            </div>

            <div className="profile-details">
              {editMode ? (
                <>
                  {/* Avatar selection grid */}
                  <div className="profile-field">
                    <label>Choose Avatar:</label>
                    <div className="avatar-selection">
                      {availableAvatars.map((avatarr, index) => (
                        <div
                          key={index}
                          className="avatar-option"
                          onClick={() => handleAvatarSelect(avatarr)}
                        >
                         <img
  src={avatarr}  // ✅ Each avatar shows its own unique image
  alt="Avatar"
  className={`avatar-img ${avatarPreview === avatarr ? 'selected-avatar' : ''}`}
/>

                        </div>
                      ))}
                    </div>
                  </div>
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
                    <label>Email:</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
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
