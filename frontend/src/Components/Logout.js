import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import Animation from './Shared/Animation';
import handelDataFetch from '../Controller/handelDataFetch';

function Logout() {
    document.title = "Logout";
    const navigate = useNavigate();

    const { setLoginLogout, setCartLength } = useContext(UserContext);

    
    const [showAnimation, setShowAnimation] = useState(false);

    const handleLogout = async () => {
        try {
            const result = await handelDataFetch({ path: "/api/v2/auth/logout", method: "POST" }, setShowAnimation);

            if (result.status) {
                setCartLength({ type: "CART", length: null });
                setLoginLogout({ type: "USER", payload: false });
            } 
            
        } catch (error) {
            console.log(error);
        } finally {
            navigate("/");
        }
    }

    useEffect(() => {
        handleLogout();
    })

    return (
        <>
            <div className='w-100 vh-100 d-flex justify-content-center align-items-center'>
                <h1 className='h1' style={{ fontFamily: "cursive" }}>Logout Successful!....</h1>
            </div>

            {
                showAnimation && <Animation />
            }
        </>
    )
}

export default Logout