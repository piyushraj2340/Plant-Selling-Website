import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import { userLogin } from '../../../actions/userAction';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/v2/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
            } else {
                message.error(data.message || "Failed to fetch users");
            }
        } catch (err) {
            console.error(err);
            message.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleImpersonate = async (userId) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/v2/admin/impersonate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ targetUserId: userId })
            });
            const data = await res.json();
            if (data.success) {
                message.success(data.message);
                dispatch(userLogin(data.user, data.accessToken, data.refreshToken));
                window.location.href = '/home'; // Redirect to user home after impersonating
            } else {
                message.error(data.message || "Failed to impersonate");
            }
        } catch (error) {
            console.error(error);
            message.error("Failed to impersonate");
        }
    };

    return (
        <div className="container-fluid p-2 p-md-4 bg-white rounded border">
            <h4 className="mb-4 fw-bold">Platform Users</h4>
            {loading ? <p>Loading...</p> : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Roles</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role.join(', ')}</td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-primary" 
                                            onClick={() => handleImpersonate(u._id)}
                                            disabled={u.role.includes('admin')}
                                        >
                                            Impersonate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Users;
