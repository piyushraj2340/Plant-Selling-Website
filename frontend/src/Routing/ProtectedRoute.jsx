import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Animation from '../features/common/Animation';
import useUserData from '../hooks/useUserData';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const { userData, IsUserDataFetchedError } = useUserData();

    if (IsUserDataFetchedError) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace={true}/>;
    }

    if (userData === null) {
        return <Animation />;
    }

    return userData
        ? children
        : <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace={true} />;
};

export default ProtectedRoute;
