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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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
        <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="row bg-white shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '1000px', width: '100%' }}>
                
                {/* Form Section */}
                <div className="col-md-7 p-4 p-md-5 order-2 order-md-1">
                    <div className="text-center mb-4">
                        <h3 className="fw-bold text-success">Create an Account</h3>
                        <p className="text-muted">Join our community of plant lovers</p>
                    </div>

                    <div className="d-flex mb-4 gap-2">
                        <Link to={"/login"} className="btn btn-outline-success flex-grow-1 fw-bold rounded-pill shadow-sm">Login</Link>
                        <Link to={"/signup"} className="btn btn-success flex-grow-1 fw-bold rounded-pill shadow-sm">Signup</Link>
                    </div>

                    <form onSubmit={handleUserSignUp}>
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input type="text" className="form-control rounded-4 bg-light border-0" id="name" name="name" placeholder="Enter Name" onChange={handleInputs} />
                                    <label htmlFor="name" className="text-muted">Full Name</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input type="tel" className="form-control rounded-4 bg-light border-0" id="phone" name="phone" placeholder="Enter Phone" onChange={handleInputs} />
                                    <label htmlFor="phone" className="text-muted">Phone Number</label>
                                </div>
                            </div>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className={`form-control rounded-4 bg-light border-0 ${emailError ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                placeholder="Enter Email"
                                onChange={handleInputs}
                                value={userFormData.email}
                            />
                            <label htmlFor="email" className="text-muted">Email address</label>
                            {emailError && <div className="invalid-feedback ms-2">{emailError}</div>}
                        </div>

                        <div className="row g-3 mb-3 align-items-center">
                            <div className="col-md-4">
                                <div className="form-floating">
                                    <input type="number" className="form-control rounded-4 bg-light border-0" id="age" name="age" placeholder="Enter Age" onChange={handleInputs} />
                                    <label htmlFor="age" className="text-muted">Age</label>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="d-flex justify-content-around align-items-center bg-light rounded-4 p-3 h-100 border-0">
                                    <span className="text-muted me-2">Gender:</span>
                                    <div className="form-check form-check-inline m-0">
                                        <input className="form-check-input text-success" type="radio" onChange={handleInputs} name="gender" id="gender-male" value="male" />
                                        <label className="form-check-label text-muted" htmlFor="gender-male">Male</label>
                                    </div>
                                    <div className="form-check form-check-inline m-0">
                                        <input className="form-check-input text-success" type="radio" onChange={handleInputs} name="gender" id="gender-female" value="female" />
                                        <label className="form-check-label text-muted" htmlFor="gender-female">Female</label>
                                    </div>
                                    <div className="form-check form-check-inline m-0">
                                        <input className="form-check-input text-success" type="radio" onChange={handleInputs} name="gender" id="gender-other" value="other" />
                                        <label className="form-check-label text-muted" htmlFor="gender-other">Other</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="position-relative mb-3">
                            <div className="form-floating">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control rounded-4 bg-light border-0 pe-5 ${passwordError ? 'is-invalid' : ''}`}
                                    id="password"
                                    name="password"
                                    placeholder="Enter Password"
                                    onChange={handleInputs}
                                    value={userFormData.password}
                                />
                                <label htmlFor="password" className="text-muted">Password</label>
                            </div>
                            <span 
                                className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" 
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ zIndex: 10, cursor: 'pointer' }}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </span>
                            {passwordError && <div className="invalid-feedback d-block ms-2">{passwordError}</div>}
                        </div>

                        <div className="position-relative mb-4">
                            <div className="form-floating">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={`form-control rounded-4 bg-light border-0 pe-5 ${confirmPasswordError ? 'is-invalid' : ''}`}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    onChange={handleInputs}
                                    value={userFormData.confirmPassword}
                                />
                                <label htmlFor="confirmPassword" className="text-muted">Confirm Password</label>
                            </div>
                            <span 
                                className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{ zIndex: 10, cursor: 'pointer' }}
                            >
                                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </span>
                            {confirmPasswordError && <div className="invalid-feedback d-block ms-2">{confirmPasswordError}</div>}
                        </div>

                        <button disabled={isLoading} className="btn btn-success w-100 py-3 rounded-pill fw-bold shadow-sm" type="submit">
                            {
                                isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Registering...
                                    </>
                                ) : (
                                    <span>Create Account</span>
                                )
                            }
                        </button>
                    </form>
                </div>

                {/* Image Section */}
                <div className="col-md-5 d-none d-md-block p-0 order-1 order-md-2" style={{ background: 'linear-gradient(135deg, #1b5e20, #43a047)' }}>
                    <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white p-5 text-center">
                        <i className="material-symbols-outlined display-1 mb-3">yard</i>
                        <h2 className="fw-bold mb-3">Join Us Today</h2>
                        <p className="lead">Start your green journey! Create an account to shop, sell, and manage your plant collection all in one place.</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Signup