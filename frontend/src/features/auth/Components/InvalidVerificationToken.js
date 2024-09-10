import React from 'react'

const InvalidVerificationToken = () => {
    document.title = "Invalid Account Verification Token"
    return (
        <div className='container container-invalid-token d-flex justify-content-center py-2 px-2 mb-4 mb-md-5'>
            <div className='shadow border rounded px-2 py-2 p-md-5'>
                <div className="container container-invalid-token">
                    <h1 className="invalid-token-heading">Oops!</h1>
                    <p className="invalid-token-message">It looks like the token you used is invalid or has expired. Please try again or request a new verification email.</p>
                </div>
            </div>
        </div>
    )
}

export default InvalidVerificationToken