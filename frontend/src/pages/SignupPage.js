import React, { useEffect } from 'react'
import Signup from '../features/auth/Components/Signup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userProfileAsync } from '../features/user/userSlice';
import { resetState } from '../features/auth/authSlice'

const SignupPage = () => {
    document.title = "Signup";

    const user = useSelector(state => state.user.user);
    const {isUserVerificationNeeded, email} = useSelector(state => state.auth);

    console.log(email);
    

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleGetUserData = async () => {
        !user && dispatch(userProfileAsync());
        if (user) {
            const [redirect, to] = window.location.search && window.location.search.split("=");
            navigate(redirect === "?redirect" ? to : "/profile");
            return;
        }
    }

    useEffect(() => {
        if(isUserVerificationNeeded) {
            navigate(`/account/verificationEmail?email=${email}`);
            dispatch(resetState());
            return;
        }
    }, [dispatch, isUserVerificationNeeded])

    useEffect(() => {
        handleGetUserData();
    }, [dispatch, user]);

    return (
        <Signup />
    )
}

export default SignupPage