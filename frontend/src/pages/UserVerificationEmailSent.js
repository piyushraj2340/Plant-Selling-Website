import React, { useEffect } from 'react'
import { message } from 'antd';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Animation from '../features/common/Animation';



const UserVerificationEmailSent = () => {
    document.title = "Account Verification";

    const navigate = useNavigate();
    const query = new URLSearchParams(useLocation().search);

    const email = query.get('email');

    useEffect(() => {
        if (!email) {
            message.error("Email Query Parameters are missing or invalid");
            navigate('/');
        }
    }, [email, navigate]);

    // Only render the content if the email is present
    if (!email) {
        return <Animation />; // Return nothing if there's no email, navigate will handle redirection
    }

    return (
        <div className='container verification-container verification-plant-theme verification d-flex justify-content-center py-2 px-2 mb-4 mb-md-5'>
            <div className='shadow border rounded px-2 py-2 p-md-5'>
                <div className="container verification-container verification-plant-theme verification">
                    <h1>Hello, <span className="highlight">User</span>!</h1>
                    <p>We’ve sent a verification email to <span className="highlight">{email}</span>. Please check your inbox and complete the verification process.</p>
                    <p><strong>Note:</strong> The verification link is valid for only 15 minutes.</p>
                </div>
            </div>
        </div>
    )
}

export default UserVerificationEmailSent