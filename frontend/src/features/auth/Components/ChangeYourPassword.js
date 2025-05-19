import  { useState } from "react";
import { validatePassword } from "../../../utils/validations";


const ChangeYourPassword = ({ token, validatePasswordReset }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationMessage, setValidationMessage] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);



    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        if (validatePassword(newPassword)) {
            setValidationMessage("");
            setIsPasswordValid(true);
        } else {
            setValidationMessage("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            setIsPasswordValid(false);
        }

        if (confirmPassword && newPassword !== confirmPassword) {
            setIsPasswordMatch(false);
        } else {
            setIsPasswordMatch(true);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const confirmPwd = e.target.value;
        setConfirmPassword(confirmPwd);

        if (password !== confirmPwd) {
            setIsPasswordMatch(false);
        } else {
            setIsPasswordMatch(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isPasswordValid && isPasswordMatch) {
           validatePasswordReset({ token, data: { password, confirmPassword } });
        }
    };

    return (
        <div className='container reset-password-container d-flex justify-content-center py-2 px-2 mb-4 mb-md-5'>
            <div className='shadow border rounded px-2 py-2 p-md-5'>
                <div className="reset-password-container mt-5">
                    <form onSubmit={handleSubmit}>
                        <h2 className="reset-password-title">Change Your Password</h2>
                        <div className="mb-3">
                            <label htmlFor="password" className="reset-password-label">Enter Password</label>
                            <input
                                type="password"
                                className={`form-control ${isPasswordValid ? "is-valid" : "is-invalid"} reset-password-input`}
                                id="password"
                                name="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                            {!isPasswordValid && <div className="invalid-feedback reset-password-error">{validationMessage}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="reset-password-label">Enter Confirm Password</label>
                            <input
                                type="password"
                                className={`form-control ${isPasswordMatch ? "" : "is-invalid"} reset-password-input`}
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Enter Confirm Password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                            />
                            {!isPasswordMatch && <div className="invalid-feedback reset-password-error">Passwords do not match.</div>}
                        </div>
                        <button type="submit" className="btn border reset-password-btn w-100" disabled={!isPasswordValid || !isPasswordMatch}>
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChangeYourPassword