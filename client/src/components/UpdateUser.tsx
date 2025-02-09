import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    sexe: string;
}

interface UpdateUserProps {
    user: User;
    onUpdate: (updatedUser: User) => void;
}

const UpdateUser: React.FC<UpdateUserProps> = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState<User>(user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.put(
                `http://localhost:8000/api/user/users/${user.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            onUpdate(response.data.user);
        } catch (error) {
            console.error('Error updating user:', error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm" style={{ backgroundColor: 'rgba(28, 28, 28, 0.5)', color: 'white' }}>
            <div className="mb-3">
                <label htmlFor="username" className="form-label" style={{ color: 'white' }}>
                    Username:
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={(e) => handleChange(e)}
                    style={{ backgroundColor: 'rgba(28, 28, 28, 0.5)', color: 'white' }}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label" style={{ color: 'white' }}>
                    Email:
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => handleChange(e)}
                    style={{ backgroundColor: 'rgba(28, 28, 28, 0.5)', color: 'white' }}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="role" className="form-label" style={{ color: 'white' }}>
                    Role:
                </label>
                <select
                    id="role"
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={(e) => handleChange(e)}
                    style={{ backgroundColor: 'rgba(28, 28, 28, 0.5)', color: 'white' }}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="sexe" className="form-label" style={{ color: 'white' }}>
                    Sexe:
                </label>
                <select
                    id="sexe"
                    name="sexe"
                    className="form-select"
                    value={formData.sexe}
                    onChange={(e) => handleChange(e)}
                    style={{ backgroundColor: 'rgba(28, 28, 28, 0.5)', color: 'white' }}
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: 'rgba(28, 28, 28, 0.5)', color: 'white' }}>
                Update User
            </button>
        </form>
    );
};

export default UpdateUser;
