import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import handelDataFetch from '../utils/handelDataFetch';
import { Link, useNavigate } from 'react-router-dom';
import { Steps, message } from 'antd';
import noPlantsImage from '../Asset/img/noDataFound.jpg';



const Shipping = () => {
    document.title = "Shipping Information";

    const { setShowAnimation } = useContext(UserContext);

    const activeStep = 0;
    const [addressList, setAddressList] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

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

    const handelGetListOfAddress = async () => {
        try {
            const result = await handelDataFetch({ path: "/api/v2/user/address", method: "GET" }, setShowAnimation);

            if (result) {
                setAddressList(result.result);
            } else {
                navigate("/");
                throw new Error(result.message)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handelValidateOrder = async () => {
        try {
            const data = await handelDataFetch({ path: "/api/v2/checkout", method: "GET" }, setShowAnimation);
            if (!data.status) {
                message.error("Invalid Order Session!.")
                navigate("/");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handelChangeAddress = async (_id) => {
        try {
            const address = addressList.find((address) => address._id === _id);
            const response = await handelDataFetch({ path: "/api/v2/checkout/shipping", method: "POST", body: address }, setShowAnimation);

            if (response.status) {
                navigate('/checkout/confirm')
            } else {
                message.config({
                    top: 100,
                    maxCount: 3,
                    CSSProperties: {
                        backgroundColor: "#000",
                        color: "#fff"
                    }
                })

                message.error("Invalid Order Session.");
                navigate('/')
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handelGetSelectedAddress = async () => {
        try {
            const data = await handelDataFetch({ path: "/api/v2/checkout/shipping", method: "GET" }, setShowAnimation);

            if (data.status) {
                setSelectedAddress(data.result);
            }

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        handelGetListOfAddress();
        handelValidateOrder();
        handelGetSelectedAddress();
    }, [])

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
        },];

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
                        !addressList &&
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