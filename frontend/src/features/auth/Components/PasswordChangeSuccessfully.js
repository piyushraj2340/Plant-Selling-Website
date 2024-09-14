import React from 'react'

const PasswordChangeSuccessfully = () => {
  document.title = "Password Changed Success"

  return (
    <div className='container password-reset-success-container d-flex justify-content-center py-2 px-2 mb-4 mb-md-5'>
      <div className='shadow border rounded px-2 py-2 p-md-5'>
        <div className="password-reset-success-box">
          <h1 className="password-reset-success-title">Password Successfully Reset</h1>
          <p className="password-reset-success-message">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <a href="/login" className="btn password-reset-success-btn">Log In</a>
        </div>
      </div>
</div >

  )
}

export default PasswordChangeSuccessfully