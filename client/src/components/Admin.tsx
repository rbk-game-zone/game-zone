import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UpdateUser from "./UpdateUser";

const Admin: React.FC = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleUpdateUser = (updatedUser) => {
        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
        setEditingUser(null);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:8000/api/user/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <header className="mb-4">
                <div id='bochra'> <h1 className="text-center">Admin Dashboard</h1></div>
            </header>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>User Management</h2>
                        <Link to="/panel" className="btn btn-secondary">Add Game</Link>
                    </div>

                    {/* Search Input */}
                    <div className="mb-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by username, email, or role"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    <table className="table table-striped table-bordered" style={{ backgroundColor: 'rgba(28, 28, 28, 0.5)', color: 'white' }}>
                        <thead>
                            <tr>
                                <th style={{ backgroundColor: 'rgba(28, 28, 28, 0.5)', color: 'white' }}>Name</th>
                                <th style={{ backgroundColor: 'rgba(28, 28, 28, 0.5)', color: 'white' }}>Email</th>
                                <th style={{ backgroundColor: 'rgba(28, 28, 28, 0.5)', color: 'white' }}>Role</th>
                                <th style={{ backgroundColor: 'rgba(28, 28, 28, 0.5)', color: 'white' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        {editingUser === user ? (
                                            <>
                                                <UpdateUser user={user} onUpdate={handleUpdateUser} />
                                                <button className="btn btn-warning text-white btn-sm ms-2" onClick={handleCancelEdit} style={{backgroundColor:" rgba(204, 243, 99, 0.7)"}}>
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btn btn-primary btn-sm ms-2" onClick={() => handleEditUser(user)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-danger text-white btn-sm ms-2" onClick={() => handleDeleteUser(user.id)} style={{backgroundColor:'rgba(255, 0, 0, 0.4)'}}>
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin;
