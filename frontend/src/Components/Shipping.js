import React, { useEffect, useState } from 'react'
import handelDataFetch from '../Controller/handelDataFetch';
import Animation from './Shared/Animation';
import { Link, useNavigate } from 'react-router-dom';
import { Steps } from 'antd';



const Shipping = () => {
    const [showAnimation, setShowAnimation] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [addressList, setAddressList] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const navigate = useNavigate();

    const handelChangeActiveStep = (step) => {
        if(step > activeStep) return;
        
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
            console.log(error);
        }
    }

    const handelChangeAddress = (_id) => {
        const address = addressList.find((address) => address._id === _id);
        const addressString = JSON.stringify(address);
        localStorage.setItem("shippingAddress", addressString);
        setSelectedAddress(address);
    }

    useEffect(() => {
        handelGetListOfAddress();
        const selectedAddressJSON = localStorage.getItem("shippingAddress")
        if(!selectedAddressJSON) {
            navigate("/");
        }
        setSelectedAddress(JSON.parse(selectedAddressJSON));
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
                        <Link to="/address/add" className="btn btn-success btn-lg w-100">Add New Address</Link>
                    </div>
                    <h3 className="h3 p-2 p-md-3">List of all the address.</h3>
                    {
                        addressList &&

                        addressList.map((address) => {
                            return (
                                <div key={address._id} onClick={() => handelChangeAddress(address._id)} className={`p-2 p-md-3 border rounded w-100 m-0 mb-2 border-secondary address-list ${address._id === selectedAddress._id && ' active-address'}`}>
                                    <p className='mb-1 h6'>{address.name}</p>
                                    <p className='mb-1'>{address.address}</p>
                                    <p className='mb-1'>{address.city} {address.state} {address.pinCode}</p>
                                    <p className='m-0'>Mobile No: {address.phone}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>



            {
                showAnimation && <Animation />
            }

        </section>
    )
}

export default Shipping