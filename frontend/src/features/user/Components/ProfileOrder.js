import React from 'react'

const ProfileOrder = () => {
    return (
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
    )
}

export default ProfileOrder