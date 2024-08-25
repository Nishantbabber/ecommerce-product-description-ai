import React, { useEffect, useState } from 'react';
import '../../styles/userManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedRole, setUpdatedRole] = useState('user'); // Default role

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_API_URL}/api/admin/users`, {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });
                const data = await response.json();
                setUsers(Array.isArray(data.users) ? data.users : []);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            await fetch(`${process.env.BACKEND_API_URL}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setUpdatedUsername(user.username);
        setUpdatedRole(user.role);
    };

    const handleSaveChanges = async () => {
        try {
            await fetch(`${process.env.BACKEND_API_URL}/api/admin/users/${editingUser._id}`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: updatedUsername, role: updatedRole })
            });
            setUsers(users.map(user =>
                user._id === editingUser._id ? { ...user, username: updatedUsername, role: updatedRole } : user
            ));
            setEditingUser(null);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className="user-management">
            <h2>User Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>User Id</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(users) && users.map(user => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEditClick(user)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingUser && (
                <div className="modal">
                    <div className="modal-content">

                        <div className="edit-form">
                            <h3>Edit User</h3>
                            <label>
                                Username:
                                <input
                                    type="text"
                                    value={updatedUsername}
                                    onChange={(e) => setUpdatedUsername(e.target.value)}
                                />
                            </label>
                            <label>
                                Role:
                                <select
                                    value={updatedRole}
                                    onChange={(e) => setUpdatedRole(e.target.value)}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </label>
                            <button onClick={handleSaveChanges}>Save Changes</button>
                            <button onClick={() => setEditingUser(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
