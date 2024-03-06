import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { userSignupAsync } from '../authSlice';


function Signup() {
    const dispatch = useDispatch();

    const [userFormData, setUserFormData] = useState({
        name: "",
        phone: "",
        email: "",
        gender: "",
        age: "",
        password: "",
        confirmPassword: "",
    });

    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;

        setUserFormData({ ...userFormData, [name]: value });
    }

    const handleUserSignUp = async (e) => {
        e.preventDefault();

        if (userFormData.name === "" || userFormData.email === "" || userFormData.phone === "" || userFormData.age === "" || userFormData.gender === "" || userFormData.password === "" || userFormData.confirmPassword === "") {
            message.error("Please provide all details.");
            return;
        }

        if (userFormData.password !== userFormData.confirmPassword) {
            message.error("password & confirm password doesn't match.");
            return;
        }

        dispatch(userSignupAsync(userFormData));
    }

    return (
        <div className='d-flex justify-content-center py-2 px-2 mb-4 mb-md-5'>
            <div className='col-12 col-md-8 col-lg-6 col-xl-4 shadow border rounded px-2 py-2 p-md-5'>
                <div className="d-flex flex-column flex-md-row justify-content-center">
                    <div className='col-12 col-md-6 text-center p-0 mb-2 mb-md-0 me-md-2 bg-secondary rounded'>
                        <Link to={"/login"} className='btn text-light w-100'>Login</Link>
                    </div>
                    <div className='col-12 col-md-6 text-center p-0 ms-md-2 bg-primary rounded'>
                        <Link to={"/signup"} className='btn text-light w-100'>Signup</Link>
                    </div>
                </div>
                <div className="row p-3">
                    <p className="text-center m-0 ">Connect With Social Account: </p>
                </div>
                <div className="row p-3">
                    <p className="text-center login-social-link m-0">
                        <i className="fab fa-facebook-f ms-4 cursor-pointer"></i>
                        <i className="fab fa-google ms-4"></i>
                        <i className="fab fa-twitter ms-4"></i>
                        <i className="fab fa-github ms-4"></i>
                    </p>
                </div>
                <div className="row">
                    <p className="text-center">Or:</p>
                </div>
                <form onSubmit={handleUserSignUp}>
                    <div className="d-flex justify-content-center">
                        <div className="col-12">
                            <input type="text" className='form-control mb-3' onChange={handleInputs} name="name" id="name" placeholder='Enter Name' />
                            <input type="email" className='form-control mb-3' onChange={handleInputs} name="email" id="email" placeholder='Enter Email' />
                            <input type="tel" className='form-control mb-3' onChange={handleInputs} name="phone" id="phone" placeholder='Enter Phone' />
                            <input type="number" className='form-control mb-3' onChange={handleInputs} name="age" id="age" placeholder='Enter Age' />
                            <div className="row mb-3">
                                <div className="row ms-1 mt-1">
                                    <label className="m-1 radio-label-container text-muted" htmlFor="gender-male">Male
                                        <input type="radio" onChange={handleInputs} className="m-2" id="gender-male" name="gender" value="male" />
                                        <span className="check-mark-span"></span>
                                    </label>
                                </div>
                                <div className="row ms-1 mt-1">
                                    <label className="m-1 radio-label-container text-muted" htmlFor="gender-female">Female
                                        <input type="radio" onChange={handleInputs} className="m-2" id="gender-female" name="gender" value="female" />
                                        <span className="check-mark-span"></span>
                                    </label>
                                </div>
                                <div className="row ms-1 mt-1">
                                    <label className="m-1 radio-label-container text-muted">Other
                                        <input type="radio" onChange={handleInputs} className="m-2" id="gender-other" name="gender" value="other" />
                                        <span className="check-mark-span"></span>
                                    </label>
                                </div>
                            </div>
                            <input type="password" className='form-control mb-3' onChange={handleInputs} name="password" id="password" placeholder='Enter Password' value={userFormData.password} />
                            <input type="password" className='form-control mb-3' onChange={handleInputs} name="confirmPassword" id="confirmPassword" placeholder='Enter Confirm Password' value={userFormData.confirmPassword} />

                        </div>
                    </div>
                    <div className="row justify-content-center mt-2">
                        <div className="col-12">
                            <button className='btn btn-primary w-100' type="submit">Sign Up</button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default Signup