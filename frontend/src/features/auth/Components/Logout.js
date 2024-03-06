import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userLogoutAsync } from '../authSlice';

const Logout = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userLogoutAsync());
        setTimeout(() => {
            navigate("/");
        }, 500)
    }, []);

    return (
        <div className='w-100 vh-100 d-flex justify-content-center align-items-center'>
            <h1 className='h1' style={{ fontFamily: "cursive" }}>Logout Successful!</h1>
        </div>
    )
}

export default Logout