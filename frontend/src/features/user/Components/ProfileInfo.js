import React from 'react'
import { useSelector } from 'react-redux'

const ProfileInfo = () => {
    const user = useSelector(state => state.user.user);

    return (
        <div className="col-md-12">
            <div className="card mb-2 mb-md-0">
                <div className="card-header">
                    <p className="m-1"><span className="text-primary font-italic me-1 h6">User Profile Information</span></p>
                </div>
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
        </div>
    )
}

export default ProfileInfo