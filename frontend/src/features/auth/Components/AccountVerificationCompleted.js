import React from 'react'

const AccountVerificationCompleted = () => {
    return (

        <div className="container container-confirmation plant-theme d-flex justify-content-center py-2 px-2 mb-4 mb-md-5">
            <div className="shadow border rounded px-2 py-2 p-md-5">
                <div className="container container-confirmation plant-theme">
                    <h1 className="confirmation-heading">Your Account is Confirmed!</h1>
                    <p className="confirmation-message">You can now log in to your account and enjoy our services.</p>
                    <div className="text-center mt-4">
                        <a href="/login" className="btn btn-confirmation">Log In</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountVerificationCompleted