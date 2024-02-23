import React, { useEffect, useState } from 'react'
import handelDataFetch from '../Controller/handelDataFetch';
import Animation from './Shared/Animation';
import { Link, useNavigate } from 'react-router-dom';
import { Steps } from 'antd';



const Confirm = () => {
    const [showAnimation, setShowAnimation] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [checkoutCart, setCheckoutCart] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [deliveryPrice, setDeliveryPrice] = useState(90);

    const navigate = useNavigate();

    useEffect(() => {
        const selectedAddressJSON = localStorage.getItem("shippingAddress")
        const checkoutCartJSON = localStorage.getItem("checkoutCart");
        if (!selectedAddressJSON || !checkoutCartJSON) {
            navigate("/");
        }
        setSelectedAddress(JSON.parse(selectedAddressJSON));
        setCheckoutCart(JSON.parse(checkoutCartJSON));
    }, [])

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
        <section className='position-fixed w-100 h-100 top-0 section-checkout p-1 overflow-y-auto'>

            <div className='container bg-section py-4' style={{minHeight: "100%"}}>
                <div className='py-2 py-md-4 border-bottom px-2 px-md-4'>
                    <Steps items={stepsOptions} current={activeStep} onChange={handelChangeActiveStep} />
                </div>
                <div className='d-flex flex-column flex-lg-row justify-content-lg-around align-items-lg-center w-100 mt-4 border rounded'>
                    <div className='d-flex flex-column col-lg-6 '>
                        <div className='d-flex flex-column mb-4'>
                            <h3 className='h3 ms-2 ms-md-4'>Shipping Info</h3>
                            {
                                selectedAddress &&
                                <div className="px-4 px-md-5 rounded w-100 m-0 mb-2 border-secondary">
                                    <p className='mb-1 h6'>{selectedAddress.name}</p>
                                    <p className='mb-1'>{selectedAddress.address}</p>
                                    <p className='mb-1'>{selectedAddress.city} {selectedAddress.state} {selectedAddress.pinCode}</p>
                                    <p className='m-0'>Mobile No: {selectedAddress.phone}</p>
                                </div>
                            }

                        </div>
                        <div className='d-flex flex-column s-cart-items'>
                            <h3 className='h3 ms-2 ms-md-4'>Cart Info</h3>
                            {
                                checkoutCart &&
                                checkoutCart.map((cart) => {
                                    return (
                                        <div key={cart._id} className="item px-4 px-md-5 py-2">
                                            <div className="d-flex">
                                                <div className="item-img me-2 me-md-3">
                                                    <div className="img border">
                                                        <img src={cart.plant.images[0].url} alt="flowering plant" />
                                                    </div>
                                                </div>
                                                <div className="item-content ms-2 ms-md-3">
                                                    <div className="d-flex flex-column">
                                                        <div className='mb-1'>
                                                            <div className='mb-1'>
                                                                <Link to={`/product/${cart.plant._id}`} className='link-dark link-underline-hover'><h3 className='h5 mb-0'>{cart.plant.plantName}</h3></Link>
                                                            </div>
                                                            <p className='mb-1'><small><Link to={`/nursery/store/view/${cart.plant.nursery}`} className='small link-secondary link-underline-hover'><i className="fas fa-store"></i> {cart.plant.nurseryName}</Link></small></p>
                                                            <p className="text-muted small mb-1" style={{ fontSize: "14px", margin: "0" }}>
                                                                Price: <small className='text-decoration-line-through'>₹ {cart.plant.price}</small>
                                                            </p>
                                                            <p className="card-text h5 mb-1">
                                                                <span className="text-success">-{cart.plant.discount}%</span> ₹{((cart.plant.price - cart.plant.discount / 100 * cart.plant.price) * cart.quantity).toFixed(2)}
                                                            </p>

                                                        </div>
                                                        <div className='mb-1 d-flex small'>
                                                            <p className="mb-1 d-none-md h6">Quantity: {cart.quantity}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <div className='d-flex flex-column s-cart-items'>
                        <h3 className='h3 ms-2 ms-md-4'>Summary</h3>
                        <div className="d-flex flex-column px-md-5 py-2">
                            <p className="text-muted border-bottom pb-3">
                                <i className='fas fa-info-circle'></i>
                                {
                                    Math.round(totalPrice) > 500 ?
                                        <span className="m-0">
                                            <small className='small'> Eligible for FREE Delivery. <Link>Detail</Link></small>
                                        </span>
                                        :
                                        <span className="m-0">
                                            <small className='small'> Add items of </small><small>₹</small><b>{(500 - totalPrice).toFixed(2)}</b><small> to get the for FREE Delivery <Link>Detail</Link></small>
                                        </span>
                                }

                            </p>
                            <div className="row border-bottom pb-2">
                                <p className="text-muted d-flex justify-content-between">
                                    <small>Subtotal : </small>
                                    <span>₹<b>{totalPrice}</b></span>
                                </p>
                                <p className="text-muted d-flex justify-content-between">
                                    <small>Delivery : </small>
                                    {totalPrice < 500 ?
                                        <span>₹<b>{deliveryPrice.toFixed(2)}</b></span> // need to be dynamic here
                                        :
                                        <span>₹<b>0</b></span> // need to be dynamic here
                                    }
                                </p>
                            </div>
                            <div className="d-flex flex-row-reverse p-3">
                                <p className="h5">Total: <sup>₹</sup>{totalPrice < 500 && totalPrice > 0 ? totalPrice + deliveryPrice : totalPrice}</p>
                            </div>
                            <div className="row m-0">
                                <button className="btn btn-success">Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                showAnimation && <Animation />
            }

        </section>
    )
}

export default Confirm