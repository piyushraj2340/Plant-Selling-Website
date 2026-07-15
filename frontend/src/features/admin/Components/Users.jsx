import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import localStorageUtil from '../../../utils/localStorage';
import { adminUsersAsync, adminImpersonateAsync } from '../adminSlice';

const Users = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.user.token);
    const { users, isLoading } = useSelector((state) => state.admin);

    useEffect(() => {
        if (token) {
            dispatch(adminUsersAsync());
        }
    }, [dispatch, token]);

    const handleImpersonate = async (userId) => {
        const action = await dispatch(adminImpersonateAsync({ targetUserId: userId }));
        
        if (adminImpersonateAsync.fulfilled.match(action) && action.payload.success) {
            // Set the new tokens to local storage to become the user
            localStorageUtil.setData("accessToken", action.payload.accessToken);
            localStorageUtil.setData("refreshToken", action.payload.refreshToken);
            window.location.href = '/home'; // Redirect to user home after impersonating
        }
    };

    return (
        <div className="container-fluid p-2 p-md-4 bg-white rounded border">
            <h4 className="mb-4 fw-bold">Platform Users</h4>
            {isLoading ? <p>Loading...</p> : (
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
