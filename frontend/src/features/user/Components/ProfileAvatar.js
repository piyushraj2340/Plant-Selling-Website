import React from 'react';
import FullScreenImageView from '../../common/FullScreenImageView';
import useUserData from '../../../hooks/useUserData';

const ProfileAvatar = () => {
    const {userData:user, avatarImageUpload} = useUserData();

    // Handle image upload
    const handleImageUpload = (e) => {
        e.preventDefault();

        const data = new FormData();

        data.append("type", e.target.name);
        data.append(e.target.name, e.target.files[0]);
        data.append("user", user._id);

        avatarImageUpload(data);
    };

    return (
        <div className="card mb-2">
            <div className="card-body text-center">
                {/* Avatar Image */}
                <div className="position-relative d-inline-block rounded-circle avatar mx-1 mx-sm-2 mx-md-3 bg-secondary border border-dark p-1 border-4 rounded-circle" style={{ width: "140px", height: "140px"}}>
                    <img
                        src={user?.avatar?.url || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"}
                        alt="avatar"
                        className="rounded-circle img-fluid w-100 h-100"
                        style={{ width: "150px", cursor: "pointer" }}
                        data-toggle="modal"
                        data-target="#profile-img-full-size"
                    />
                    {/* Upload Button */}
                    <div className="btn-upload-avatar position-absolute translate-middle" style={{ top: "80%", left: "90%" }}>
                        <label
                            htmlFor="avatar"
                            className="btn btn-sm btn-primary rounded-circle"
                            data-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Upload Profile Image"
                        >
                            <i className="fas fa-camera"></i>
                        </label>
                        <input
                            type="file"
                            id="avatar"
                            accept="image/png, image/jpeg"
                            name='avatar'
                            onChange={handleImageUpload}
                            hidden
                        />
                    </div>
                </div>
                {/* User Details */}
                <h5 className="my-3">{user.name}</h5>
                <p className="text-muted mb-1">{user.email}</p>
            </div>
            {/* Fullscreen View */}
            <FullScreenImageView img={user?.avatar?.url || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"} id="profile-img-full-size" />
        </div>
    );
};

export default ProfileAvatar;
