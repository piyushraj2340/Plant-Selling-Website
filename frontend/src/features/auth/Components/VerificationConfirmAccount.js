
const VerificationConfirmAccount = ({token, userAccountVerification}) => {
    document.title = "Confirm Your Account";

    return (
        <div className='container confirmation-container confirmation-plant-theme confirmation d-flex justify-content-center py-2 px-2 mb-4 mb-md-5'>
            <div className='shadow border rounded px-2 py-2 p-md-5'>
                <div className="container confirmation-container confirmation-plant-theme confirmation">
                    <h1>Hello, <span className="highlight">User</span>!</h1>
                    <p>Please confirm your account by clicking the button below:</p>
                    <div className="text-center mt-4">
                        <button onClick={() => userAccountVerification({ token, isUserVerified: true })} className="btn btn-confirm">Confirm Account</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerificationConfirmAccount