import React, { useEffect } from 'react'
import Signup from '../features/auth/Components/Signup';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { userProfileAsync } from '../features/user/userSlice';
import { resetState } from '../features/auth/authSlice'
import useUserData from '../hooks/useUserData';
import Animation from '../features/common/Animation';
import useUserSignup from '../hooks/auth/useUserSignup';

const SignupPage = () => {
    document.title = "Signup";

    const {userData:user, isLoading, isError, errorData} = useUserData();
    
    const location = useLocation();

    const {isUserVerificationNeeded, email} = useUserSignup();

    if(isUserVerificationNeeded) {
        let navigate = <Navigate to={`/account/verificationEmail?email=${email}`} replace={true}/>;
        return navigate;

    }

    if (user) {
        const queryParams = new URLSearchParams(location.search);
        const redirect = queryParams.get('redirect');
        return <Navigate to={`/${redirect?redirect:'profile'}` } replace={true}/>;
    }

    if ((user === null && !isError && !errorData) || isLoading) {
        return <Animation />;
    }

    return (
        <Signup />
    )
}

export default SignupPage