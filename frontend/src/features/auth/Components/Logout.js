import { Navigate } from 'react-router-dom';
import useUserLogout from '../../../hooks/auth/useUserLogout';
import Animation from '../../common/Animation';

const Logout = () => {
    const { isLoading } = useUserLogout();

    if (isLoading) {
        return <Animation />
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
        return <Navigate to='/' replace={true} />
    }

    return (
        <div className='w-100 vh-100 d-flex justify-content-center align-items-center'>
            <h1 className='h1' style={{ fontFamily: "cursive" }}>Logout Successful!</h1>
        </div>
    )
}

export default Logout