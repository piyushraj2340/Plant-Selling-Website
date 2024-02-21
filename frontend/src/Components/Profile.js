import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';

import FullScreenImageView from './Shared/FullScreenImageView';
import Animation from './Shared/Animation';
import handelDataFetch from '../Controller/handelDataFetch';

function Profile() {
    document.title = "Profile"

    const [user, setUser] = useState({
        _id: "",
        name: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        role: []
    });

    const [address, setAddress] = useState(null);

    const [showAnimation, setShowAnimation] = useState(false);

    const [isNurseryRegister, setIsNurseryRegister] = useState(false);

    const navigate = useNavigate();

    const handelProfileData = async () => {
        try {
            const result = await handelDataFetch({ path: "/api/v2/user/profile", method: "GET" }, setShowAnimation);

            if (result.status) {
                setUser(result.result);
                if(result.result.role.includes("seller")) {
                    setIsNurseryRegister(true);
                }
            } else {
                throw new Error("Authentication Failed");
            }
        } catch (error) {
            console.log(error);
            navigate('/login');
        }
    }

    const handelGetDefaultAddress = async () => {
        try {
            const result = await handelDataFetch({path: "/api/v2/user/default/address", method: "GET"}, setShowAnimation);

            if (result.status) {
                setAddress(result.result);
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handelProfileData();
        handelGetDefaultAddress();
    }, []);

    return (

        <>
            <section className='bg-section'>
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card mb-4">
                                <div className="card-body text-center">
                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar"
                                        className="rounded-circle img-fluid" style={{ width: "150px" }} data-toggle="modal" data-target="#profile-img-full-size" />
                                    <h5 className="my-3">{user.name}</h5>
                                    <p className="text-muted mb-1">User Id</p>
                                    {/* <p className="text-muted mb-4">Bay Area, San Francisco, CA</p> */}
                                    {/* <div className="d-flex justify-content-center mb-2">
                                        <button type="button" className="btn btn-primary">Follow</button>
                                        <button type="button" className="btn btn-outline-primary ms-1">Message</button>
                                    </div> */}
                                </div>
                                <FullScreenImageView img="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" id="profile-img-full-size" />
                            </div>
                            <div className="card mb-4 mb-lg-0">
                                <div className="card-body p-0">
                                    <ul className="list-group list-group-flush rounded-3">
                                        <Link to={"/orders-history"}>
                                            <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                <i className="fas fa-history fa-lg text-warning"></i>
                                                <p className="mb-0">Orders History</p>
                                            </li>
                                        </Link>
                                        <Link to={"/track-orders"}>
                                            <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                <i className="fas fa-truck fa-lg text-warning"></i>
                                                <p className="mb-0">Track Your Orders</p>
                                            </li>
                                        </Link>
                                        <Link to={"/address"}>
                                            <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                <i className="fas fa-address-card fa-lg text-warning"></i>
                                                <p className="mb-0">Manage Your Address</p>
                                            </li>
                                        </Link>
                                        <Link to={isNurseryRegister ? "/nursery" : "/nursery/add"}>
                                            <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                <i className="fas fa-tree fa-lg text-warning"></i>
                                                <p className="mb-0">{isNurseryRegister ? "Manage Your Nursery" : "Add Your Nursery"}</p>
                                            </li>
                                        </Link>
                                        <Link to={"/settings"}>
                                            <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                <i className="fa fa-gear fa-lg text-warning"></i>
                                                <p className="mb-0">Settings</p>
                                            </li>
                                        </Link>
                                        <Link to={"/logout"}>
                                            <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                <i className="fa fa-sign-out text-warning"></i>
                                                <p className="mb-0">Logout</p>
                                            </li>
                                        </Link>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Full Name</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{user.name}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Email</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{user.email}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Mobile</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{user.phone}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Gender</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{user.gender}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Age</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{user.age}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Country</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">India</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card mb-4 mb-md-0">
                                        <div className="card-header">
                                            <p className="m-1"><span className="text-primary font-italic me-1 h6">Manage Your Order</span></p>
                                        </div>
                                        <div className="card-body">
                                            <p className="text-center mt-4" style={{ fontFamily: "cursive" }}><i className="fas fa-eye-slash"></i> No Order Found</p>
                                        </div>
                                        <div className="card-footer">
                                            <p className="mt-3 d-flex justify-content-center">
                                                <button className='btn btn-light'><i className="fas fa-angle-double-right"></i> View More</button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card mb-4 mb-md-0">
                                        <div className="card-header">
                                            <p className="m-1"><span className="text-primary font-italic me-1 h6">Manage Your Address</span></p>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="d-flex justify-content-between">
                                                    <span className='text-primary small'>{address !== null ? address.setAsDefault ? "Default Address" : "" : ""}</span>
                                                    <Link to={address ? `/address/update/${address._id}` : "#"}> {address ? <i className="fas fa-edit"></i> : ""}</Link>
                                                </div>
                                            </div>
                                            <div className="row">
                                                {address ?
                                                    <div className='m-0'>
                                                        <p className='m-0 h5'>{address.name}</p>
                                                        <p className='m-0'>{address.address}</p>
                                                        <p className='m-0'>{address.city} {address.state} {address.pinCode}</p>
                                                        <p className='m-0'>Mobile No: {address.phone}</p>
                                                    </div>
                                                    :
                                                    <p className="text-center mt-4" style={{ fontFamily: "cursive" }}><i className="fas fa-address-card"></i> No Address Found</p>
                                                }
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <div className="d-flex justify-content-around">
                                                <p className="mt-3 d-flex justify-content-center">
                                                    <Link to={'/address/add'} className='btn btn-light'><i className="fas fa-plus"></i> Add Address</Link>
                                                </p>
                                                <p className="mt-3 d-flex justify-content-center">
                                                    <Link to={'/address'} className='btn btn-light'><i className="fas fa-angle-double-right"></i> View More</Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {showAnimation && <Animation />}
        </>

    )
}

export default Profile