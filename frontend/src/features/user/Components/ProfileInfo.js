import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userProfileUpdateAsync } from "../userSlice";
import useUserData from "../../../hooks/useUserData";

const ProfileInfo = () => {
    const {userData:user} = useUserData();
    const dispatch = useDispatch();

    // State to toggle edit mode and store form data
    const [isEditing, setIsEditing] = useState(false);

    const initFormData = {
        _id: user?._id || "",
        name: user?.name || "",
        age: user?.age || "",
        gender: user?.gender || "",
        phone: user?.phone || "",
    };

    const [formData, setFormData] = useState(initFormData);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Save and Cancel handlers
    const handleSave = () => {
        // Add save logic here (e.g., API call to update user data)
        dispatch(userProfileUpdateAsync(formData));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(initFormData); // Reset form data to original user data
        setIsEditing(false);
    };

    return (
        <div className="col-md-12">
            <div className="card mb-2 mb-md-0">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <p className="m-1">
                        <span className="text-primary font-italic me-1 h6">User Profile Information</span>
                    </p>
                    <i
                        className="fas fa-edit text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => setIsEditing(true)}
                    ></i>
                </div>
                <div className="card-body">
                    {/* Full Name */}
                    <div className="row mb-3">
                        <div className="col-sm-3">
                            <p className="mb-0">Full Name</p>
                        </div>
                        <div className="col-sm-9">
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name || ""}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p className="text-muted mb-0">{user.name || "N/A"}</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="row mb-3">
                        <div className="col-sm-3">
                            <p className="mb-0">Email</p>
                        </div>
                        <div className="col-sm-9">
                            {isEditing ? (
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={user.email || ""}
                                    disabled
                                    readOnly
                                />
                            ) : (
                                <p className="text-muted mb-0">{user.email || "N/A"}</p>
                            )}
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="row mb-3">
                        <div className="col-sm-3">
                            <p className="mb-0">Mobile</p>
                        </div>
                        <div className="col-sm-9">
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    value={formData.phone || ""}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p className="text-muted mb-0">{user.phone || "N/A"}</p>
                            )}
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="row mb-3">
                        <div className="col-sm-3">
                            <p className="mb-0">Gender</p>
                        </div>
                        <div className="col-sm-9">
                            {isEditing ? (
                                <select
                                    className="form-control"
                                    name="gender"
                                    value={formData.gender || ""}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            ) : (
                                <p className="text-muted mb-0">{user.gender || "N/A"}</p>
                            )}
                        </div>
                    </div>

                    {/* Age */}
                    <div className="row mb-3">
                        <div className="col-sm-3">
                            <p className="mb-0">Age</p>
                        </div>
                        <div className="col-sm-9">
                            {isEditing ? (
                                <input
                                    type="number"
                                    className="form-control"
                                    name="age"
                                    value={formData.age || ""}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p className="text-muted mb-0">{user.age || "N/A"}</p>
                            )}
                        </div>
                    </div>

                    {/* Country */}
                    <div className="row mb-3">
                        <div className="col-sm-3">
                            <p className="mb-0">Country</p>
                        </div>
                        <div className="col-sm-9">
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="form-control"
                                    name="country"
                                    value={formData.country || "India"}
                                    disabled
                                    readOnly
                                />
                            ) : (
                                <p className="text-muted mb-0">India</p>
                            )}
                        </div>
                    </div>
                </div>
                {isEditing && (
                    <div className="card-footer d-flex justify-content-end">
                        <button className="btn btn-secondary me-2" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleSave}>
                            Save
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileInfo;
