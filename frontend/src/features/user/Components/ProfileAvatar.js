import React from 'react';
import { Link } from 'react-router-dom';
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
                        src={user?.avatar?.url || (user?.gender?.toLowerCase() === 'female' ? "https://res.cloudinary.com/dcd6y2awx/image/upload/v1785235103/PlantSeller/UI%20Images/female_avatar_eie1ky.png" : "https://res.cloudinary.com/dcd6y2awx/image/upload/v1785235099/PlantSeller/UI%20Images/avatar_lvizsr.png")}
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
                
                <div className="dropdown d-lg-none mt-3">
                    <button type='button' id='profileMoreMenu' className="btn btn-sm btn-light border-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Menu</button>
                    <div className="dropdown-menu text-start py-0 shadow-sm" aria-labelledby="profileMoreMenu">
                        <div className="p-2 border-bottom">
                            <Link to="/orders/history" className="d-flex align-items-center text-decoration-none text-dark"><i className="fas fa-truck text-warning me-2" style={{width: '20px', textAlign: 'center'}}></i> Track Your Orders</Link>
                        </div>
                        <div className="p-2 border-bottom">
                            <Link to="/address" className="d-flex align-items-center text-decoration-none text-dark"><i className="fas fa-address-card text-warning me-2" style={{width: '20px', textAlign: 'center'}}></i> Manage Your Address</Link>
                        </div>
                        <div className="p-2 border-bottom">
                            <Link to="/profile/messages" className="d-flex align-items-center text-decoration-none text-dark"><i className="fas fa-comments text-warning me-2" style={{width: '20px', textAlign: 'center'}}></i> My Messages</Link>
                        </div>
                        <div className="p-2 border-bottom">
                            <Link to={user.role.includes("seller") ? "/nursery" : "/nursery/create"} className="d-flex align-items-center text-decoration-none text-dark">
                                <i className="material-symbols-outlined text-warning me-2" style={{width: '20px', textAlign: 'center'}}>compost</i> {user.role.includes("seller") ? "Manage Your Nursery" : "Add Your Nursery"}
                            </Link>
                        </div>
                        {user.role.includes("admin") && (
                            <div className="p-2 border-bottom">
                                <Link to="/dashboard" className="d-flex align-items-center text-decoration-none text-dark"><i className="fas fa-chart-line text-warning me-2" style={{width: '20px', textAlign: 'center'}}></i> Admin Dashboard</Link>
                            </div>
                        )}
                        <div className="p-2 border-bottom">
                            <Link to="/profile/settings" className="d-flex align-items-center text-decoration-none text-dark"><i className="fa fa-gear text-warning me-2" style={{width: '20px', textAlign: 'center'}}></i> Settings</Link>
                        </div>
                        <div className="p-2">
                            <Link to="/logout" className="d-flex align-items-center text-decoration-none text-dark"><i className="fa fa-sign-out text-warning me-2" style={{width: '20px', textAlign: 'center'}}></i> Logout</Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* Fullscreen View */}
            <FullScreenImageView img={user?.avatar?.url || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"} id="profile-img-full-size" />
        </div>
    );
};

export default ProfileAvatar;
