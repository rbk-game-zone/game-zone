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
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    age: user?.age || '',
    avatar: user?.avatar || '' 
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || ''); 

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const storedAvatar = localStorage.getItem('avatar');
    if (storedUser) {
      setProfileData((prevData) => ({
        ...prevData,
        username: storedUser.username || '',
        email: storedUser.email || '',
        sexe: storedUser.sexe || '',
        role: storedUser.role || '',
        address: storedUser.address || '',
        first_name: storedUser.first_name || '',
        last_name: storedUser.last_name || '',
        age: storedUser.age || '',
      }));
      setAvatarPreview(storedAvatar || '');
    }
  }, []); 

  const availableAvatars = [
    'https://th.bing.com/th/id/OIP.BZDN5jtCETHvCmYtgEV8eAHaHa?w=184&h=184&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    'https://cdn-icons-png.flaticon.com/128/528/528111.png',
    'https://cdn-icons-png.flaticon.com/128/705/705890.png',
    'https://cdn-icons-png.flaticon.com/128/1985/1985782.png',
    'https://cdn-icons-png.flaticon.com/128/2277/2277366.png',
    'https://cdn-icons-png.flaticon.com/128/705/705788.png',
  ];

  const handleAvatarSelect = (avatar: string) => {
    setAvatarPreview(avatar);
    setProfileData((prevData) => ({ ...prevData, avatar }));
    localStorage.setItem('avatar', avatar);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.put(
        `${apiUrl}/api/user/users/${user.id}`,
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
                  {availableAvatars.map((avatar, index) => (
                    <div
                      key={index}
                      className={`avatar-option cursor-pointer ${avatarPreview === avatar ? 'border-primary' : ''}`}
                      onClick={() => handleAvatarSelect(avatar)}
                    >
                      <img
                        src={avatar} 
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
                  value={profileData.first_name}
                  onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Last Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.last_name}
                  onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
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

              <div className="mb-3">
                <label className="form-label">Age:</label>
                <input
                  type="number"
                  className="form-control"
                  value={profileData.age}
                  onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address:</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-3"><strong>First Name:</strong> {user?.first_name}</div>
              <div className="mb-3"><strong>Last Name:</strong> {user?.last_name}</div>
              <div className="mb-3"><strong>Email:</strong> {user?.email}</div>
              <div className="mb-3"><strong>Age:</strong> {user?.age}</div>
              <div className="mb-3"><strong>Address:</strong> {user?.address}</div>
              <div className="mb-3"><strong>Role:</strong> {user?.role}</div>
              <div className="mb-3"><strong>Sexe:</strong> {user?.sexe}</div>
            </>
          )}
        </div>

        <div className="card-footer d-flex justify-content-between">
          {editMode ? (
            <>
              <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
              <button className="btn text-white btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit Profile</button>
          )}
          <button className="btn text-white btn-info" onClick={() => navigate('/change-password')} style={{backgroundColor:'rgba(255, 0, 0, 0.4)'}}>Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
