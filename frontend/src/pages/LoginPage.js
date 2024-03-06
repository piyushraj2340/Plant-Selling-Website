import React, { useEffect } from 'react'
import Login from '../features/auth/Components/Login';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userProfileAsync } from '../features/user/userSlice';


const LoginPage = () => {
    document.title = "Login";

    const user = useSelector(state => state.user.user);
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
        handleGetUserData();
    }, [dispatch, user]);

    return (
        <Login />
    )
}

export default LoginPage