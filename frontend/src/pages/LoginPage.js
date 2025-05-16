import React, { useEffect } from 'react'
import Login from '../features/auth/Components/Login';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { resetState } from '../features/auth/authSlice'
import useUserData from '../hooks/useUserData';
import Animation from '../features/common/Animation';

const LoginPage = () => {
    document.title = "Login";
    const {userData:user, isLoading, isError, errorData} = useUserData();
    const location = useLocation();
    const {isUserVerificationNeeded, email, isUserTwoFactorAuthNeeded, twoFactorAuthNeededToken} = useSelector(state => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        return () => dispatch(resetState());
    },[dispatch, isUserVerificationNeeded, twoFactorAuthNeededToken, isUserTwoFactorAuthNeeded])

    if(isUserVerificationNeeded) {
        let navigate = <Navigate to={`/account/verificationEmail?email=${email}`} replace={true}/>;
        return navigate;

    }

    if(isUserTwoFactorAuthNeeded && twoFactorAuthNeededToken) {
        let navigate = <Navigate to={`/account/twoFactorAuthentication/${twoFactorAuthNeededToken}` } replace={true}/>;
        return navigate;
    }

    if (user) {
        const queryParams = new URLSearchParams(location.search);
        const redirect = queryParams.get('redirect');
          
        return <Navigate to={`${redirect?redirect:'profile'}` } replace={true}/>;
    }

    if ((user === null && !isError && !errorData) || isLoading) {
        return <Animation />;
    }

    return (
        <Login />
    )
}

export default LoginPage