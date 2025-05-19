import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { resetState } from '../authSlice';
import useUserSignup from '../../../hooks/auth/useUserSignup';
import { validateEmail, validatePassword } from '../../../utils/validations';


function Signup() {
    const { isLoading, isError, errorData, userSignup } = useUserSignup();

    const [userFormData, setUserFormData] = useState({
        name: "",
        phone: "",
        email: "",
        gender: "",
        age: "",
        password: "",
        confirmPassword: "",
    });

    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");


    const dispatch = useDispatch();

    useEffect(() => {
        if (isError || errorData) {
            setUserFormData({ ...userFormData, password: "", confirmPassword: "" });
        }

        return () => dispatch(resetState());
    }, [userSignup, errorData, isError]);

    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;

        setUserFormData(prev => ({ ...prev, [name]: value }));

        if (name === "email") {
            if (!validateEmail(value)) {
                setEmailError("Please enter a valid email address.");
            } else {
                setEmailError("");
            }
        }

        if (name === "password") {
            if (!validatePassword(value)) {
                setPasswordError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            } else {
                setPasswordError("");
            }

            // Also check confirm match
            if (userFormData.confirmPassword && userFormData.confirmPassword !== value) {
                setConfirmPasswordError("Passwords do not match.");
            } else {
                setConfirmPasswordError("");
            }
        }

        if (name === "confirmPassword") {
            if (value !== userFormData.password) {
                setConfirmPasswordError("Passwords do not match.");
            } else {
                setConfirmPasswordError("");
            }
        }
    }

    const handleUserSignUp = async (e) => {
        e.preventDefault();

        const { name, email, phone, age, gender, password, confirmPassword } = userFormData;

        // Check for missing fields
        if (!name || !email || !phone || !age || !gender || !password || !confirmPassword) {
            message.error("Please provide all details.");
            return;
        }

        // Email format check
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address.");
            message.error("Invalid email address.");
            return;
        } else {
            setEmailError("");
        }

        // Password strength check
        if (!validatePassword(password)) {
            setPasswordError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            message.error("Password does not meet strength requirements.");
            return;
        } else {
            setPasswordError("");
        }

        // Password match check
        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            message.error("Passwords do not match.");
            return;
        } else {
            setConfirmPasswordError("");
        }

        // Proceed if all validations pass
        userSignup(userFormData);
    };


    return (
        <div className='d-flex justify-content-center py-2 px-2 mb-4 mb-md-5'>
            <div className='col-12 col-md-8 col-lg-6 col-xl-4 shadow border rounded px-2 py-2 p-md-5'>
                <div className="d-flex flex-column flex-md-row justify-content-center mb-3">
                    <div className='col-12 col-md-6 text-center p-0 mb-2 mb-md-0 me-md-2 bg-secondary rounded'>
                        <Link to={"/login"} className='btn text-light w-100'>Login</Link>
                    </div>
                    <div className='col-12 col-md-6 text-center p-0 ms-md-2 bg-primary rounded'>
                        <Link to={"/signup"} className='btn text-light w-100'>Signup</Link>
                    </div>
                </div>

                <div className="text-center mb-3">
                    <p className="m-0">Connect With Social Account:</p>
                    <div>
                        <i className="fab fa-facebook-f mx-2 cursor-pointer"></i>
                        <i className="fab fa-google mx-2"></i>
                        <i className="fab fa-twitter mx-2"></i>
                        <i className="fab fa-github mx-2"></i>
                    </div>
                </div>

                <div className="text-center mb-3"><p>Or:</p></div>

                <form onSubmit={handleUserSignUp}>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="name" name="name" placeholder="Enter Name" onChange={handleInputs} />
                        <label htmlFor="name">Enter Name</label>
                    </div>

                    <div className="form-floating mb-1">
                        <input
                            type="email"
                            className={`form-control ${emailError ? 'is-invalid' : ''}`}
                            id="email"
                            name="email"
                            placeholder="Enter Email"
                            onChange={handleInputs}
                            value={userFormData.email}
                        />
                        <label htmlFor="email">Enter Email</label>
                        {emailError && <div className="invalid-feedback d-block">{emailError}</div>}
                    </div>

                    <div className="form-floating mb-3">
                        <input type="tel" className="form-control" id="phone" name="phone" placeholder="Enter Phone" onChange={handleInputs} />
                        <label htmlFor="phone">Enter Phone</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="number" className="form-control" id="age" name="age" placeholder="Enter Age" onChange={handleInputs} />
                        <label htmlFor="age">Enter Age</label>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Gender</label>
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

                    <div className="form-floating mb-1">
                        <input
                            type="password"
                            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                            id="password"
                            name="password"
                            placeholder="Enter Password"
                            onChange={handleInputs}
                            value={userFormData.password}
                        />
                        <label htmlFor="password">Enter Password</label>
                        {passwordError && <div className="invalid-feedback d-block">{passwordError}</div>}
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            onChange={handleInputs}
                            value={userFormData.confirmPassword}
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        {confirmPasswordError && <div className="invalid-feedback d-block">{confirmPasswordError}</div>}
                    </div>

                    <button disabled={isLoading} className='btn btn-primary w-100' type="submit">
                        {
                            isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span className='ms-1'>Registering...</span>
                                </>
                            ) : (
                                <span>Sign Up</span>
                            )
                        }
                    </button>
                </form>
            </div>
        </div>

    )
}

export default Signup