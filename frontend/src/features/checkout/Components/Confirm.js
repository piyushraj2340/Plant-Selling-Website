import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Steps, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getConfirmOrderDataAsync, getSelectedShippingAsync, getValidateCheckoutAsync } from '../checkoutSlice';



const Confirm = () => {
    const isSessionError = useSelector(state => state.checkout.isSessionError);
    const selectedAddress = useSelector(state => state.checkout.shipping);
    const pricing = useSelector(state => state.checkout.pricing);
    const checkoutCart = useSelector(state => state.checkout.carts);
    
    const dispatch = useDispatch();

    const activeStep = 1;

    const navigate = useNavigate();

    const handelValidateOrder = async () => {
        dispatch(getValidateCheckoutAsync());
        if(isSessionError) {
            message.error(isSessionError.message);
            navigate("/");
        }
    }

    useEffect(() => {
        handelValidateOrder();
    }, [isSessionError])

    useEffect(() => {
        !checkoutCart.length && dispatch(getConfirmOrderDataAsync());
    }, [checkoutCart])
    

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

    const handelCheckout = () => {
        handelValidateOrder();
        navigate('/checkout/payment');
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

            <div className='container bg-section py-4 p-0 p-sm-auto' style={{ minHeight: "100%" }}>
                <div className='py-2 py-md-4 border-bottom px-2 px-sm-4'>
                    <Steps items={stepsOptions} current={activeStep} onChange={handelChangeActiveStep} />
                </div>
                <div className='d-flex flex-column flex-lg-row justify-content-lg-around w-100 mt-4 border py-4'>
                    <div className='d-flex flex-column col-lg-6 '>
                        <div className='d-flex flex-column mb-4'>
                            <h3 className='h3 ms-2 ms-sm-4'>Shipping Info</h3>
                            {
                                selectedAddress &&
                                <div className="px-2 px-sm-5 rounded w-100 m-0 mb-2 border-secondary">
                                    <p className='mb-1 h6'>{selectedAddress.name}</p>
                                    <p className='mb-1'>{selectedAddress.address}</p>
                                    <p className='mb-1'>{selectedAddress.city} {selectedAddress.state} {selectedAddress.pinCode}</p>
                                    <p className='m-0'>Mobile No: {selectedAddress.phone}</p>
                                </div>
                            }

                        </div>
                        <div className='d-flex flex-column s-cart-items'>
                            <h3 className='h3 ms-2 ms-sm-4'>Cart Info</h3>
                            {
                                checkoutCart &&
                                checkoutCart.map((cart) => {
                                    return (
                                        <div key={cart.plant._id} className="item px-2 px-sm-5 py-2">
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
                                                            <p className='mb-1'><small><Link to={`/nursery/store/view/${cart.nursery._id}`} className='small link-secondary link-underline-hover'><i className="fas fa-store"></i> {cart.nursery.nurseryName}</Link></small></p>
                                                            <p className="text-muted small mb-1" style={{ fontSize: "14px", margin: "0" }}>
                                                                Price: <small className='text-decoration-line-through'>₹ {cart.plant.price}</small>
                                                            </p>
                                                            <p className="card-text h5 mb-1">
                                                                <span className="text-success">-{cart.plant.discount}%</span> ₹{Number(cart.plant.price - cart.plant.discount / 100 * cart.plant.price).toFixed(2)}
                                                            </p>

                                                        </div>
                                                        <div className='mb-1 d-flex small'>
                                                            <p className="mb-1 d-none-md">Quantity: {cart.quantity}</p>
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
                        <h3 className='h3 ms-2 ms-sm-4'>Summary</h3>
                        <div className="d-flex flex-column px-2 px-sm-5 py-2">
                            <p className="text-muted border-bottom pb-3">
                                <i className='fas fa-info-circle'></i>
                                {
                                    Math.round(pricing && pricing.actualPriceAfterDiscount) > 500 ?
                                        <span className="m-0">
                                            <small className='small'> Eligible for FREE Delivery. <Link>Detail</Link></small>
                                        </span>
                                        :
                                        <span className="m-0">
                                            <small className='small'> Add items of </small><small>₹</small><b>{pricing && (500 - pricing.actualPriceAfterDiscount).toFixed(2)}</b><small> to get the for FREE Delivery <Link>Detail</Link></small>
                                        </span>
                                }

                            </p>
                            <div className="row border-bottom pb-2">
                                <p className="text-muted d-flex justify-content-between">
                                    <small>Subtotal : </small>
                                    <span>₹<b>{pricing && pricing.totalPriceWithoutDiscount}</b></span>
                                </p>
                                <p className="text-muted d-flex justify-content-between">
                                    <small>Discount : </small>
                                    <span>- ₹<b>{pricing && pricing.discountPrice}</b></span>
                                </p>
                                <p className="text-muted d-flex justify-content-between">
                                    <small>Delivery : </small>
                                    <span>₹<b>{pricing && pricing.deliveryPrice}</b></span>
                                </p>
                                <p className="text-muted d-flex justify-content-between">
                                    <small>Total : </small>
                                    <span>₹<b>{pricing && pricing.totalPrice}</b></span>
                                </p>

                            </div>
                            <div className="d-flex flex-row-reverse p-3">
                                <p className="h5">Total: <sup>₹</sup>{pricing && pricing.totalPrice}</p>
                            </div>
                            <div className="row m-0">
                                <button onClick={handelCheckout} className="btn btn-success">Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Confirm