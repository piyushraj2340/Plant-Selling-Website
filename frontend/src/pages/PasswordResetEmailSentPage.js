import React, { useEffect } from 'react'
import { message } from 'antd';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const PasswordResetEmailSentPage = () => {
    document.title = "Password Reset Email Sent";

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
        return null; // Return nothing if there's no email, navigate will handle redirection
    }
    return (

        <div className='container password-reset-email-sent-container d-flex justify-content-center py-2 px-2 mb-4 mb-md-5'>
            <div className='shadow border rounded px-2 py-2 p-md-5'>
                <div className="password-reset-email-sent-box">
                    <h1 className="password-reset-email-sent-title">Password Reset Email Sent</h1>
                    <p className="password-reset-email-sent-message">
                        We have sent a password reset link to your <span className="highlight">{email}</span> email address. Please check your inbox and follow the instructions to reset your password.
                    </p>
                    <p className='text-danger'><strong>Note:</strong> The verification link is valid for only 15 minutes.</p>
                </div>
            </div>
        </div >

    )
}

export default PasswordResetEmailSentPage