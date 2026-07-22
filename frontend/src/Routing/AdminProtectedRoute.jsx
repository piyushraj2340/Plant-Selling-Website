import { Navigate, useLocation } from 'react-router-dom';
import useUserData from '../hooks/useUserData';
import Animation from '../features/common/Animation';

const AdminProtectedRoute = ({ children }) => {
    const location = useLocation();
    const { userData, IsUserDataFetchedError } = useUserData();

    if (IsUserDataFetchedError) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace={true} />;
    }

    if (userData === null) {
        return <Animation />;
    }

    if (!userData.role.includes("admin")) {
        return <Navigate to="/profile" replace={true} />;
    }

    return children;
};

export default AdminProtectedRoute;
