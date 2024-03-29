import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { addressListDataFetchAsync } from '../../address/addressSlice';

const ProfileAddress = () => {
    const addressList = useSelector(state => state.address.addressList);
    const dispatch = useDispatch();
    
    const [address, setAddress] = useState(null);

    useEffect(() => {
        !addressList.length && dispatch(addressListDataFetchAsync());
        
        if(addressList.length) {
            setAddress(addressList[0]);
        }

    }, [addressList])

    return (
        <div className="col-md-12">
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
                            <Link to={'/address/new'} className='btn btn-light'><i className="fas fa-plus"></i> Add Address</Link>
                        </p>
                        <p className="mt-3 d-flex justify-content-center">
                            <Link to={'/address'} className='btn btn-light'><i className="fas fa-angle-double-right"></i> View More</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileAddress