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
        console.log(formData);
        
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
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input type="text" name="username" value={formData.username} onChange={(e) => handleChange(e)} />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={(e) => handleChange(e)} />
            </label>
            <label>
                Role:
                <select name="role" value={formData.role} onChange={(e) => handleChange(e)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </label>
            <label>
                Sexe:
                <select name="sexe" value={formData.sexe} onChange={(e) => handleChange(e)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </label>
            <button type="submit">Update User</button>
        </form>
    );
};

export default UpdateUser;