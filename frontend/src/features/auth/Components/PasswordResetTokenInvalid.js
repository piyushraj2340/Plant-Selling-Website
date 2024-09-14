import React from "react";


const PasswordResetTokenInvalid = () => {
    return (
        <div className='reset-password-invalid-container d-flex justify-content-center py-2 px-2 mb-4 mb-md-5'>
            <div className='shadow border rounded px-2 py-2 p-md-5'>
                <div className="reset-password-invalid-box">
                    <h1 className="reset-password-invalid-title text-danger">Reset Password Link Invalid</h1>
                    <p className="reset-password-invalid-message text-danger">
                        The password reset token has expired or is invalid. Please request a new password reset.
                    </p>
                    <a href="/forgot-password" className="btn w-100 btn-success reset-password-invalid-btn">Request New Link</a>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetTokenInvalid;
