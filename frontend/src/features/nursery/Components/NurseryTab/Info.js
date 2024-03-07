import React from 'react'
import { useSelector } from 'react-redux'

const Info = () => {
    const nursery = useSelector(state => state.nursery.nursery);
    
    return (
        <div className="p-2 p-md-3">
            <div className="row">
                <div className="col-sm-3">
                    <p className="mb-0">Full Name</p>
                </div>
                <div className="col-sm-9">
                    <p className="text-muted mb-0">{nursery.nurseryOwnerName}</p>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-sm-3">
                    <p className="mb-0">Nursery Name</p>
                </div>
                <div className="col-sm-9">
                    <p className="text-muted mb-0">{nursery.nurseryName}</p>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-sm-3">
                    <p className="mb-0">Email</p>
                </div>
                <div className="col-sm-9">
                    <p className="text-muted mb-0">{nursery.nurseryEmail}</p>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-sm-3">
                    <p className="mb-0">Mobile</p>
                </div>
                <div className="col-sm-9">
                    <p className="text-muted mb-0">{nursery.nurseryPhone}</p>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-sm-3">
                    <p className="mb-0">Address</p>
                </div>
                <div className="col-sm-9">
                    <p className="text-muted mb-0">{nursery.address}</p>
                </div>
            </div>
        </div>
    )
}

export default Info