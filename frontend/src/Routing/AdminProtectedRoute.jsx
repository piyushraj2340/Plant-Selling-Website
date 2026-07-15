import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message, Spin } from 'antd';

const AdminProtectedRoute = ({ children }) => {
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (!user) {
            message.error("You are not logged in!");
            navigate('/login');
        } else if (!user.role || !user.role.includes('admin')) {
            message.error("Access denied. Admin privileges required.");
            navigate('/home');
        } else {
            setIsVerified(true);
        }
    }, [user, navigate]);

    if (!isVerified) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return children;
};

export default AdminProtectedRoute;
