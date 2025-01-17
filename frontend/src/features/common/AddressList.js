import { calc } from 'antd/es/theme/internal';
import React from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addressDeleteAsync, setDefaultAddressAsync } from '../address/addressSlice';

function AddressList({ addressList, handelSelectedAddress, setViewAddressList, viewAddressList, redirect }) {

    const noPlantsImage = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/no-data-found";

    const dispatch = useDispatch();

    function handelUseAddressAsDefault(id) {
        dispatch(setDefaultAddressAsync(id));
        handelSelectedAddress(id);
    }

    return (
        <div className="address-list-container-open p-2 p-md-4 position-fixed d-flex justify-content-center align-items-center">
            <div className='container-address-list col-12 col-sm-8 col-md-6 col-lg-4 bg-light rounded overflow-auto' style={{ height: "calc(100vh - 100px)" }}>
                <div className="p-3 d-flex justify-content-between bg-dark">
                    <p className="m-2 h5 text-light">
                        <span>Choose Your Address</span>
                    </p>
                    <p className="m-2 h5 text-light close-window" onClick={() => setViewAddressList(!viewAddressList)}>
                        <i className="fas fa-times"></i>
                    </p>
                </div>
                <div className="p-3 address-list">
                    <p>Select a delivery location to see product availability and delivery options</p>

                    {
                        addressList &&

                        <div className="container">
                            <div className="d-flex">
                                <Link to={`/address/new${redirect}`} className='btn btn-success btn-lg w-100'><i className="fas fa-plus"></i> New Address</Link>
                            </div>
                        </div>


                    }

                    {
                        addressList &&

                        addressList.map((elem, index) => {
                            return (
                                <div className='border shadow rounded mx-3 my-4'>
                                    <div key={index} onClick={() => handelSelectedAddress(elem._id)} className='mx-3 p-3  rounded select-address'>
                                        {
                                            elem.setAsDefault &&
                                            <span className="text-primary small">Default Address</span>
                                        }
                                        <p className='m-0 h6'>{elem.name}</p>
                                        <p className='m-0'>{elem.address}</p>
                                        <p className='m-0'>{elem.city} {elem.state} {elem.pinCode}</p>
                                        <p className='m-0'>Mobile No: {elem.phone}</p>

                                    </div>
                                    <div className='d-flex m-3 px-3 mt-0 justify-content-between'>
                                        <Link to={`/address/update/${elem._id}${redirect}`} className='btn btn-sm btn-secondary me-3'><i className="fas fa-edit"></i> Update</Link>
                                        {
                                            !elem.setAsDefault &&
                                            <button className='btn btn-sm btn-primary me-3' onClick={() => handelUseAddressAsDefault(elem._id)}><i className="fas fa-thumbtack" style={{ fontSize: "14px" }}></i> Use as Default</button>
                                        }

                                        <button className='btn btn-sm btn-danger me-3' onClick={() => dispatch(addressDeleteAsync(elem._id))}><i className="fas fa-trash"></i> Delete</button>
                                    </div>
                                </div>
                            )
                        })
                    }

                    {
                        !addressList.length &&

                        <div className="container">
                            <div className="row">
                                <div className="d-flex justify-content-center">
                                    <img src={noPlantsImage} style={{ maxHeight: "60vh" }} alt="no plants data found" className='img-fluid' />
                                </div>
                            </div>
                            <div className="row">
                                <div className="d-flex d-flex flex-column align-items-center">
                                    <h3 className="h3" style={{ fontFamily: "cursive" }}>No Address Found!</h3>
                                    <Link to={`/address/new${redirect}`} className='btn btn-primary'><i className="fas fa-plus"></i> New Address</Link>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default AddressList