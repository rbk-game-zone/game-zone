import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { updateUser } from '../store/authSlice';
import { RootState } from '../store/store';


const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const user = storedUser || useSelector((state: RootState) => state.auth.user);
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
    avatar: user?.avatar || '' // Add avatar field
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
  }, []); 

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');  // Avatar preview state

  const availableAvatars = [
    'https://th.bing.com/th/id/OIP.BZDN5jtCETHvCmYtgEV8eAHaHa?w=184&h=184&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    'https://cdn-icons-png.flaticon.com/128/528/528111.png',
    'avatar3.png',
    'avatar4.png',
    'avatar5.png',
    'avatar6.png',
  ];

  const handleAvatarSelect = (avatar: string) => {
    setAvatarPreview(avatar); // Update preview
    localStorage.setItem('avatar', avatar); // ✅ Store avatar separately in localStorage
  };

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
    <div className="container mt-5">
      <h1 className="text-center">Profile Dashboard</h1>
      <div className="card shadow-lg p-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="avatar-container">
            <img
              src={avatarPreview || 'default-avatar.png'} 
              alt="Avatar"
              className="avatar-img rounded-circle"
              width="100"
              height="100"
            />
          </div>
          <div className="profile-name">{user?.username}</div>
        </div>

        <div className="card-body">
          {editMode ? (
            <>
              <div className="mb-3">
                <label className="form-label">Choose Avatar:</label>
                <div className="d-flex gap-2">
                  {availableAvatars.map((avatarr, index) => (
                    <div
                      key={index}
                      className={`avatar-option cursor-pointer ${avatarPreview === avatarr ? 'border-primary' : ''}`}
                      onClick={() => handleAvatarSelect(avatarr)}
                    >
                      <img
                        src={avatarr} 
                        alt="Avatar"
                        className="avatar-img rounded-circle"
                        width="40"
                        height="40"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">First Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.firstname}
                  onChange={(e) => setProfileData({ ...profileData, firstname: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Last Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.lastname}
                  onChange={(e) => setProfileData({ ...profileData, lastname: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-3">
                <strong>First Name:</strong> {user?.first_name}
              </div>
              <div className="mb-3">
                <strong>Last Name:</strong> {user?.last_name}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {user?.email}
              </div>
              <div className="mb-3">
                <strong>Role:</strong> {user?.role}
              </div>
              <div className="mb-3">
                <strong>Sexe:</strong> {user?.sexe}
              </div>
            </>
          )}
        </div>

        <div className="card-footer d-flex justify-content-between">
          {editMode ? (
            <>
              <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
              <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <button className="btn btn-warning" onClick={() => setEditMode(true)}>Edit Profile</button>
          )}
          <button className="btn btn-info" onClick={() => navigate('/change-password')}>Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
