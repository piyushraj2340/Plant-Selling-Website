import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useUserLogin from '../../../hooks/auth/useUserLogin';
import { useDispatch, useSelector } from 'react-redux';
import { resetState, guestLoginAsync } from '../authSlice';
// import { setCart } from '../../cart/cartSlice'; // TODO: IMPLEMENTATION: CART FUNCTIONALITY


function Login() {
    const { isLoading, isError, errorData, userLogin } = useUserLogin();

    const dispatch = useDispatch();

    const [userFormData, setUserFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isError || errorData) {
            setUserFormData({ ...userFormData, password: "" })
        }

        return () => dispatch(resetState());
    }, [userLogin, errorData, isError]);

    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;

        setUserFormData({ ...userFormData, [name]: value });
    }

    const handleUserLogin = async (e) => {
        e.preventDefault();
        if (userFormData.email === "" || userFormData.password === "") { //* VALIDATE: if one of the empty fields.
            message.error("Please enter your credentials.")
            return;
        }
        userLogin(userFormData);
    }

    const { isLoading: guestLoading } = useSelector(state => state.auth);

    const handleGuestLogin = (role) => {
        Modal.confirm({
            title: 'Welcome to the Guest Tour!',
            icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
            content: (
                <div>
                    <p>Guest Accounts are temporary demonstration accounts.</p>
                    <p><strong>Note:</strong> Any data you create (orders, plants, cart items) will be automatically cleaned up every 24 hours.</p>
                    <p>Upon logging in, you will receive a guided tour of the application!</p>
                </div>
            ),
            okText: 'Confirm & Login',
            cancelText: 'Cancel',
            onOk() {
                dispatch(guestLoginAsync({ role }));
            },
        });
    }

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="row bg-white shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '900px', width: '100%' }}>
                {/* Image Section */}
                <div className="col-md-6 d-none d-md-block p-0" style={{ background: 'linear-gradient(135deg, #43a047, #1b5e20)' }}>
                    <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white p-5 text-center">
                        <i className="material-symbols-outlined display-1 mb-3">eco</i>
                        <h2 className="fw-bold mb-3">Welcome Back!</h2>
                        <p className="lead">Sign in to continue exploring our vast collection of beautiful plants for your home and garden.</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="col-md-6 p-4 p-md-5">
                    <div className="text-center mb-4">
                        <h3 className="fw-bold text-success">Plant Seller</h3>
                        <p className="text-muted">Sign in to your account</p>
                    </div>

                    <div className="d-flex mb-4 gap-2">
                        <Link to={"/login"} className="btn btn-success flex-grow-1 fw-bold rounded-pill shadow-sm">Login</Link>
                        <Link to={"/signup"} className="btn btn-outline-success flex-grow-1 fw-bold rounded-pill shadow-sm">Signup</Link>
                    </div>

                    <form onSubmit={handleUserLogin}>
                        <div className="form-floating mb-3">
                            <input type="email" className="form-control rounded-4 bg-light border-0" id="email" name="email" placeholder="Enter Email" onChange={handleInputs} />
                            <label htmlFor="email" className="text-muted">Email address</label>
                        </div>
                        <div className="position-relative mb-3">
                            <div className="form-floating">
                                <input type={showPassword ? "text" : "password"} className="form-control rounded-4 bg-light border-0 pe-5" id="password" name="password" placeholder="Enter Password" onChange={handleInputs} value={userFormData.password} />
                                <label htmlFor="password" className="text-muted">Password</label>
                            </div>
                            <span
                                className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ zIndex: 10, cursor: 'pointer' }}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-4 px-1">
                            <Link to={"/forgot-password"} className="text-success small fw-bold text-decoration-none">Forgot Password?</Link>
                        </div>

                        <button disabled={isLoading} className="btn btn-success w-100 py-3 rounded-pill fw-bold shadow-sm mb-4" type="submit">
                            {
                                isLoading ?
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Verifying...
                                    </>
                                    :
                                    <span>Sign In</span>
                            }
                        </button>
                    </form>

                    <div className="position-relative mb-4">
                        <hr className="text-muted" />
                        <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">OR TRY GUEST TOUR</span>
                    </div>

                    <div className="d-flex flex-column gap-2">
                        <button onClick={() => handleGuestLogin('user')} disabled={guestLoading || isLoading} className="btn btn-outline-secondary rounded-pill w-100 fw-bold">
                            Login as Guest User
                        </button>
                        <button onClick={() => handleGuestLogin('seller')} disabled={guestLoading || isLoading} className="btn btn-outline-success rounded-pill w-100 fw-bold">
                            Login as Guest Nursery
                        </button>
                        <button onClick={() => handleGuestLogin('admin')} disabled={guestLoading || isLoading} className="btn btn-outline-danger rounded-pill w-100 fw-bold">
                            Login as Guest Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login