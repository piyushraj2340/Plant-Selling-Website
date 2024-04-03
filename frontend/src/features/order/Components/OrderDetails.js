import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import formatTimestamp from '../../../utils/formatTimestamp'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetailsByIdAsync } from '../orderSlice'

const OrderDetails = () => {

    const orderDetails = useSelector((order) => order.order.orderDetails);

    console.log("orderDetails" + orderDetails);

    const dispatch = useDispatch();

    const noPlantsImage = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/no-data-found";

    const { id } = useParams();


    const handelGetOrderDetails = () => {
        dispatch(getOrderDetailsByIdAsync(id));
    }

    useEffect(() => {
        handelGetOrderDetails();
    }, []);

    return (
        <section className="bg-section">
            <div className="container p-2 p-md-3 p-lg-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/profile" className='link-underline-hover'>Profile</Link></li>
                        <li className="breadcrumb-item"><Link to="/orders/history" className='link-underline-hover'>Your Orders</Link></li>
                        <li className="breadcrumb-item " aria-current="page">Order Details</li>
                    </ol>
                </nav>
                <div className="row border-bottom my-2 pb-2">
                    {
                        orderDetails ?

                            <>
                                <div className="d-flex flex-column p-2 justify-content-between py-2 mb-2">
                                    <h3 className='h3 px-2'>Order Details</h3>
                                    <div className="d-flex flex-column flex-md-row flex-wrap justify-content-between">
                                        <div className="d-flex flex-column flex-md-row ms-2">
                                            <p className='me-2'>Ordered On: <span>{orderDetails.orderAt}</span></p>
                                            <p className='mx-1 d-none d-md-block'> | </p>
                                            <p className='ms-md-2'>Order Id: <span>{orderDetails._id}</span></p>
                                        </div>
                                        <div className='ms-2'>
                                            <Link to='#' className='btn btn-secondary'>Payment Invoice</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column flex-sm-row justify-content-between border mb-2 py-2 px-2 px-md-4 rounded">
                                    <div className="py-2">
                                        <div className='d-flex flex-column'>
                                            <h5 className='h5 ms-2'>Shipping Info</h5>
                                            {
                                                orderDetails.shippingInfo &&

                                                <div className="px-2">
                                                    <p className='mb-1 h6'>{orderDetails.shippingInfo.name}</p>
                                                    <p className='mb-1'>{orderDetails.shippingInfo.address}</p>
                                                    <p className='mb-1'>{orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.state}, {orderDetails.shippingInfo.pinCode}.</p>
                                                    <p className='m-0'>Mobile No: {orderDetails.shippingInfo.phone}</p>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="paymentInfo">
                                        <h5 className='h5 ms-2'>Payment</h5>
                                        <div className="px-2">
                                            {
                                                orderDetails.payment &&

                                                <p className='mb-1'>{orderDetails.payment.paymentMethods} ({orderDetails.payment.message})</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="pricing">
                                        <h5 className='h5 ms-2'>Summary</h5>
                                        {
                                            orderDetails.pricing &&

                                            <div className="px-2">
                                                <p className="text-muted mb-1 d-flex justify-content-between">
                                                    <small className='me-3 me-md-5'>Subtotal : </small>
                                                    <span>₹{orderDetails.pricing.totalPriceWithoutDiscount}</span>
                                                </p>
                                                <p className="text-muted mb-1 d-flex justify-content-between">
                                                    <small className='me-3 me-md-5'>Discount : </small>
                                                    <span>- ₹{orderDetails.pricing.discountPrice}</span>
                                                </p>
                                                <p className="text-muted mb-1 d-flex justify-content-between">
                                                    <small className='me-3 me-md-5'>Delivery : </small>
                                                    <span>₹{orderDetails.pricing.deliveryPrice}</span>
                                                </p>
                                                <p className="text-muted mb-1 d-flex justify-content-between">
                                                    <small className='me-3 me-md-5'>Total : </small>
                                                    <span>₹<b>{orderDetails.pricing.totalPrice}</b></span>
                                                </p>
                                            </div>
                                        }
                                    </div>
                                </div>


                                <div className="card mb-2 p-0">
                                    <div className="card-header p-2 p-md-3">
                                        <span>{orderDetails.orderItems && orderDetails.orderItems.length} Shipping</span>
                                    </div>
                                    <div className="card-body p-3 p-md-4 mb-3">
                                        {
                                            orderDetails.orderItems &&

                                            orderDetails.orderItems.map((orderItems) => {
                                                return (
                                                    <div className='mb-4 pb-4 border-bottom d-flex flex-column flex-md-row justify-content-between'>
                                                        <div className="d-flex flex-column flex-sm-row ">
                                                            <div className='mb-4 rounded overflow-hidden me-2' style={{ width: "200px" }}>
                                                                <img className="align-self-center img-fluid" src={orderItems.images.url} width="250" alt="product" />
                                                            </div>
                                                            <div className="flex-fill ms-2 p-2">
                                                                <h5 className="bold"><Link to={`/product/${orderItems.plant}`} className='link-dark link-underline-hover'>{orderItems.plantName}</Link></h5>
                                                                <p className="text-muted m-0"> Qt: {orderItems.quantity} {orderItems.quantity > 1 ? "items" : "item"}</p>
                                                                <div className="text-muted" style={{ fontSize: "14px", margin: "0" }}>
                                                                    Price : <small className='text-decoration-line-through'>₹ {orderItems.price}</small>
                                                                </div>
                                                                <div className="card-text h3">
                                                                    <span className="text-success">-{orderItems.discount}%</span>
                                                                </div>
                                                                <h4 className="mb-3"> ₹ {(orderItems.price - orderItems.discount / 100 * orderItems.price).toFixed(2)}</h4>
                                                            </div>
                                                        </div>
                                                        <div className='p-2 p-md-3 d-flex flex-column'>
                                                            <Link to="#" className='btn btn-warning mb-2'><i className="fas fa-comment-dots"></i> Write a review</Link>
                                                            <Link to="#" className='btn btn-info mb-2'><i className='fa fa-refresh'></i> Buy it again</Link>
                                                            <Link to="#" className='btn btn-primary'><i className='fas fa-shipping-fast'></i> Track order</Link>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>
                                </div>
                            </>


                            :

                            <div className="container bg-white pb-3">
                                <div className="row">
                                    <div className="d-flex justify-content-center">
                                        <img src={noPlantsImage} style={{ maxHeight: "60vh" }} alt="no plants data found" className='img-fluid' />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="d-flex d-flex flex-column align-items-center">
                                        <h3 className="h3" style={{ fontFamily: "cursive" }}>No Order Details Found!</h3>
                                        <Link to="/orders/history" className='btn btn-primary'><i className="fas fa-arrow-left"></i> Back To Orders History</Link>
                                    </div>
                                </div>
                            </div>

                    }
                </div>
            </div>
        </section>
    )
}

export default OrderDetails