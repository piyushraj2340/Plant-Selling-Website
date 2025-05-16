import { Breadcrumb, message } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userProfileChangePasswordAsync, userProfileChangeTwoFactorAuthenticationStatusAsync, userProfileDeleteAsync } from "../userSlice";
import useUserData from "../../../hooks/useUserData";

const ProfileSettings = () => {
    const { userData:user, deleteUserData: handleDeleteAccount, changeUserPassword, enableDisableTwoFactorStatus} = useUserData();
    const dispatch = useDispatch();

    // State for managing password change
    const [previousPassword, setPreviousPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // State for two-factor authentication
    const [isTwoFactorAuthEnabled, setIsTwoFactorAuthEnabled] = useState(user.isTwoFactorAuthEnabled);

    // State for delete confirmation
    const [isDeleting, setIsDeleting] = useState(false);

    // Handlers for each action
    const handlePasswordChange = () => {
        if (password !== confirmPassword) {
            message.error("Passwords do not match!");
            return;
        }
        const data = {
            previousPassword, password, confirmPassword
        }
        changeUserPassword(data);
        setPreviousPassword("");
        setPassword("");
        setConfirmPassword("");
    };


    const toggleTwoFactorAuthentication = () => {
        enableDisableTwoFactorStatus({isTwoFactorAuthEnabled: !isTwoFactorAuthEnabled});
        setIsTwoFactorAuthEnabled(!isTwoFactorAuthEnabled);
    };



    const items = [
        {
            path: './',
            title: 'Home',
        },
        {
            path: '../profile',
            title: 'Profile'
        },
        {
            title: 'Settings'
        },
    ];


    function itemRender(currentRoute, params, items, paths) {
        const isLast = currentRoute?.path === items[items.length - 1]?.path;

        return isLast ? (
            <span>{currentRoute.title}</span>
        ) : (
            <Link to={`/${paths.join("/")}`}>{currentRoute.title}</Link>
        );
    }

    return (
        <div className="col-md-12">
            <div className='py-2 ms-2'>
                <Breadcrumb itemRender={itemRender} items={items} />
            </div>

            <div className="card mb-3">
                <div className="card-header">
                    <p className="m-1">
                        <span className="text-primary font-italic me-1 h6">Settings</span>
                    </p>
                </div>
                <div className="card-body">
                    {/* Change Password Section */}
                    <div className="mb-4">
                        <h6>Change Password</h6>
                        <div className="row mb-3">
                            <div className="col-sm-3">
                                <p className="mb-0">Current Password</p>
                            </div>
                            <div className="col-sm-9">
                                <input
                                    type="password"
                                    className="form-control"
                                    value={previousPassword}
                                    onChange={(e) => setPreviousPassword(e.target.value)}
                                    placeholder="Enter current password"
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-3">
                                <p className="mb-0">New Password</p>
                            </div>
                            <div className="col-sm-9">
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-3">
                                <p className="mb-0">Confirm Password</p>
                            </div>
                            <div className="col-sm-9">
                                <input
                                    type="password"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                        <div className="text-end">
                            <button className="btn btn-primary" onClick={handlePasswordChange}>
                                Save Password
                            </button>
                        </div>
                    </div>

                    <hr />

                    {/* Two-Factor Authentication Section */}
                    <div className="mb-4">
                        <h6>Two-Factor Authentication</h6>
                        <div className="d-flex align-items-center">
                            <p className="mb-0 me-3">
                                {isTwoFactorAuthEnabled ? "Enabled" : "Disabled"}
                            </p>
                            <button
                                className={`btn ${isTwoFactorAuthEnabled ? "btn-danger" : "btn-success"}`}
                                onClick={toggleTwoFactorAuthentication}
                            >
                                {isTwoFactorAuthEnabled ? "Disable" : "Enable"}
                            </button>
                        </div>
                    </div>

                    <hr />

                    {/* Delete Account Section */}
                    <div>
                        <h6>Delete Account</h6>
                        {!isDeleting ? (
                            <button
                                className="btn btn-danger"
                                onClick={() => setIsDeleting(true)}
                            >
                                Delete Account
                            </button>
                        ) : (
                            <div>
                                <p className="text-danger">
                                    Are you sure you want to proceed with deleting your account? This action cannot be undone.
                                </p>
                                <p className="text-danger">
                                    The following data associated with your account will be permanently removed:
                                </p>
                                <ul className="text-danger">
                                    <li>Your profile information</li>
                                    <li>Order history</li>
                                    <li>Items in your cart</li>
                                    <li>Nursery details</li>
                                    <li>All plants associated with your Nursery</li>
                                    <li>Saved addresses</li>
                                </ul>

                                <div className="d-flex">
                                    <button
                                        className="btn btn-secondary me-2"
                                        onClick={() => setIsDeleting(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleDeleteAccount}
                                    >
                                        Confirm Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
