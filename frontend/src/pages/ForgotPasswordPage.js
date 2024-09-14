import React, { useRef, useState } from 'react'
import { validateEmail } from '../utils/validations';
import { message } from 'antd';
import handelDataFetch from '../utils/handelDataFetch';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {

    document.title = 'Forgot Password';  // Setting the page title to "Forgot Password" for SEO purposes.

    const [email, setEmail] = useState(null);
    const [isBtnDisabled, setIsButtonDisabled] = useState(false);

    const inputRef = useRef(null);
    const navigate = useNavigate();

    const handelSubmitPasswordResetEmail = async (e) => {
        try {
            e.preventDefault();
            setIsButtonDisabled(true);

            if (!validateEmail(email) || !email) {
                message.error("Invalid Email");
                inputRef.current.focus();
                setIsButtonDisabled(false);
                return;
            }

            const { data } = await handelDataFetch('/api/v2/auth/resetPassword', 'POST', { email });

            if (data && data.status) {
                navigate(`/account/PasswordResetEmail?email=${email}`);
            }

            setIsButtonDisabled(false);
        } catch (error) {
            message.error(error.message);
        }
    }

    return (
        <div className='d-flex justify-content-center py-2 px-2 mb-4 mb-md-5'>
            <div className='col-12 col-md-8 col-lg-6 col-xl-4 shadow border rounded px-2 py-2 p-md-5'>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="text-center">
                            <h3><i className="fa fa-lock fa-4x"></i></h3>
                            <h2 className="text-center">Forgot Password?</h2>
                            <p>You can reset your password here.</p>
                            <div className="panel-body">

                                <form className="form">
                                    <fieldset>
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text rounded-0" id="basic-addon1"><i className='fas fa-envelope py-1 '></i></span>
                                            </div>
                                            <input ref={inputRef} type="email" className="form-control" placeholder="Enter Email" name='email' onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                        <div className={`form-group ${isBtnDisabled ? 'input-disabled' : ''}`}>
                                            <input className='btn btn-primary btn-block w-100' value="Send My Password" type="submit" disabled={isBtnDisabled} onClick={handelSubmitPasswordResetEmail} />
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage