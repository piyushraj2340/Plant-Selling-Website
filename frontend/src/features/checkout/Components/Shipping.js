import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Steps, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addressListDataFetchAsync } from '../../address/addressSlice';
import { getSelectedShippingAsync, updateSelectedShippingAsync, getValidateCheckoutAsync } from '../checkoutSlice';



const Shipping = () => {

    const addressList = useSelector(state => state.address.addressList);
    const selectedAddress = useSelector(state => state.checkout.shipping);
    const isSessionError = useSelector(state => state.checkout.isSessionError);

    const dispatch = useDispatch();

    const noPlantsImage = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/no-data-found";

    const activeStep = 0;

    const navigate = useNavigate();

    const handelChangeActiveStep = (step) => {
        if (step > activeStep) return;

        switch (step) {
            case 0: navigate('/checkout/shipping');
                break;
            case 1: navigate('/checkout/confirm');
                break;
            case 2: navigate('/checkout/payment');
                break;
            default: navigate('/');
        }
    }

    const handelChangeAddress = async (_id) => {
        const address = addressList.find((address) => address._id === _id);

        const data = {
            address,
            navigate
        }

        dispatch(updateSelectedShippingAsync(data))
    }

    const handelGetSelectedAddress = async () => {
        dispatch(getSelectedShippingAsync());
    }

    useEffect(() => {
        dispatch(getValidateCheckoutAsync());
        if(isSessionError) {
            message.error(isSessionError.message);
            navigate("/");
        }
    }, [isSessionError]);

    useEffect(() => {
        !addressList.length && dispatch(addressListDataFetchAsync());
    }, [addressList]);

    useEffect(() =>{
        !selectedAddress && handelGetSelectedAddress();
    }, [selectedAddress]);

    const stepsOptions = [
        {
            title: 'Shipping Details',
            icon: <span className='fas fa-shipping-fast'></span>,
        },
        {
            title: 'Confirm Order',
            icon: <span className='	fas fa-check-square'></span>,
        },
        {
            title: 'Payment',
            icon: <span className='fas fa-university'></span>,
        }];

    return (
        <section className='position-fixed w-100 h-100 top-0 section-checkout p-1'>

            <div className='container bg-section h-100 py-4'>
                <div className='py-2 py-md-4 border-bottom px-2 px-md-4'>
                    <Steps items={stepsOptions} current={activeStep} onChange={handelChangeActiveStep} />
                </div>
                <div className="d-flex flex-column justify-content-start align-items-start">
                    <div className='p-2 p-md-3 w-100'>
                        <Link to={`/address/new/?redirect=/checkout/shipping`} className="btn btn-success btn-lg w-100">Add New Address</Link>
                    </div>
                    <h3 className="h3 p-2 p-md-3">List of all the address.</h3>
                    {
                        addressList &&

                        addressList.map((address) => {
                            return (
                                <div key={address._id} onClick={() => handelChangeAddress(address._id)} className={`p-2 p-md-3 border rounded w-100 m-0 mb-2 border-secondary address-list ${selectedAddress && address._id === selectedAddress._id && ' active-address'}`}>
                                    <p className='mb-1 h6'>{address.name}</p>
                                    <p className='mb-1'>{address.address}</p>
                                    <p className='mb-1'>{address.city} {address.state} {address.pinCode}</p>
                                    <p className='m-0'>Mobile No: {address.phone}</p>
                                </div>
                            )
                        })
                    }

                    {
                        !addressList.length &&
                        <div className="container">
                            <div className="row">
                                <div className="img d-flex justify-content-center">
                                    <img src={noPlantsImage} style={{ maxHeight: "60vh" }} alt="no plants data found" className='img-fluid rounded border mb-3' />
                                </div>
                            </div>
                            <div className="row">
                                <div className="d-flex d-flex flex-column align-items-center">
                                    <h3 className="h3" style={{ fontFamily: "cursive" }}>No Address Found</h3>
                                    <Link to={`/address/new/?redirect=/checkout/shipping`} className='btn btn-primary'><i className="fas fa-arrow-right"></i> Add New Address</Link>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

        </section>
    )
}

export default Shipping