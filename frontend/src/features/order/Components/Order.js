import { Steps } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getOrderHistoryAsync } from '../orderSlice';

const Order = () => {
    const [activeTabs, setActiveTabs] = useState('order');
    const orderHistory = useSelector(state => state.order.orderHistory);

    const dispatch = useDispatch();

    const noPlantsImage = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/no-data-found"

    useEffect(() => {
        dispatch(getOrderHistoryAsync());
    }, [])

    //move to utils

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);

        // Format time in 12-hour format with minutes and AM/PM indication
        const time = date.toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });

        // Format date
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-IN', options);

        return `${time}, ${formattedDate}`;
    }

    return (
        <section className="bg-section">
            <div className="container p-2 p-md-3 p-lg-4">
                <div className="row border-bottom my-2 pb-2">
                    <div className="d-flex flex-column flex-md-row p-2 justify-content-between py-2">
                        <h2 className='h2 px-2'>Your Orders</h2>
                        <div className="d-flex">
                            <div className="input-group position-relative">
                                <input type="search" name="order-search" className='form-control border-none p-2' style={{ boxShadow: "none" }} id="order-search" placeholder='Search your Order' />
                                <button className='btn btn-info'><span className="fas fa-search"></span> Search</button>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex border-bottom mb-2">
                        <div style={{ transform: "translateY(1px)" }}>
                            <button className={`p-2 ${activeTabs === 'order' ? 'border-bottom border-0 border-bottom-3 border-warning' : "border-0"}`} onClick={() => setActiveTabs('order')}>
                                Orders
                            </button>
                        </div>
                        <div style={{ transform: "translateY(1px)" }} >
                            <button className={`p-2 ${activeTabs === 'buy-again' ? 'border-bottom border-0 border-bottom-3 border-warning' : "border-0"}`} onClick={() => setActiveTabs('buy-again')}>
                                Buy Again
                            </button>
                        </div>
                        <div style={{ transform: "translateY(1px)" }} >
                            <button className={`p-2 ${activeTabs === 'cancelled-orders' ? 'border-bottom border-0 border-bottom-3 border-warning' : "border-0"}`} onClick={() => setActiveTabs('cancelled-orders')}>
                                Cancelled Orders
                            </button>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <p className='p-2 m-0'>Total Order: <b>{orderHistory.length}</b></p>
                        <select name="filter-order" id="filter-order" className='p-1'>
                            <option value="last 3 months">Last 3 months</option>
                            <option value="last 6 months">Last 6 months</option>
                            <option value="2024">2024</option>
                        </select>
                    </div>
                </div>
                <div className="row d-flex justify-content-center align-items-center">
                    {orderHistory.length ?
                        orderHistory.map(order => {
                            return (
                                <div className="card mb-2 p-0" key={order._id}>
                                    <div className="card-header p-2 p-md-3">
                                        <div className="d-flex flex-column flex-md-row align-items-start justify-content-between align-items-md-center">
                                            <div>
                                                <p className="text-muted mb-2"> Order ID <span className="fw-bold text-body">{order._id}</span></p>
                                                <p className="text-muted mb-0"> Place On <span className="fw-bold text-body">{formatTimestamp(order.orderAt)}</span> </p>
                                            </div>
                                            <div className='mt-2 mt-md-0'>
                                                <h6 className="mb-0"> <Link to="#">View Details </Link> </h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body p-3 p-md-4 mb-3">
                                        {
                                            order.orderItems.map(items => {

                                                const stepsOptions = [
                                                    {
                                                        title: order.payment.status === 'pending' ? "Order Pending" : "Order Placed",
                                                        icon: <span className='fas fa-clipboard-list'></span>,
                                                        description: <span className='text-muted'>{formatTimestamp(order.orderAt)} <br /> <i className="fw-bold">{order.payment.status === 'pending' && order.payment.message}</i></span>
                                                    },
                                                    {
                                                        title: 'Order Shipped',
                                                        icon: <span className='	fas fa-shipping-fast'></span>,
                                                        description: items.orderStatus.state === "shipped" && <span className='text-muted'>{formatTimestamp(items.orderStatus.statusAt)} <br /> {items.orderStatus.message}</span>
                                                    },
                                                    {
                                                        title: 'Order Delivered',
                                                        icon: <span className='fas fa-home'></span>,
                                                        description: items.orderStatus.state === "delivered" && <span className='text-muted'>{formatTimestamp(items.orderStatus.statusAt)} <br /> {items.orderStatus.message}</span>
                                                    },
                                                ]

                                                let activeStep = 0;

                                                if(items.orderStatus.status === 'delivered') {
                                                    activeStep = 2;
                                                } else if(items.orderStatus.status === 'shipped') {
                                                    activeStep = 1;
                                                } else {
                                                    activeStep = 0;
                                                }

                                                return (
                                                    <div key={items._id} className='mb-4 pb-4 border-bottom'>
                                                        <div className="d-flex flex-row">
                                                            <div className="flex-fill">
                                                                <h5 className="bold"><Link to={`/product/${items.plant}`} className='link-dark link-underline-hover'>{items.plantName}</Link></h5>
                                                                <p className="text-muted"> Qt: {items.quantity} {items.quantity > 1 ? "items" : "item"}</p>
                                                                <h4 className="mb-3"> ₹ {(items.price - items.discount / 100 * items.price).toFixed(2)} <span className="small text-muted"> via ({order.payment.paymentMethods}) </span></h4>
                                                                <p className="text-muted">Tracking Status on: <span className="text-body">{formatTimestamp(items.orderStatus.statusAt)}</span></p>
                                                            </div>
                                                            <div className='mb-4 rounded overflow-hidden' style={{ width: "200px" }}>
                                                                <img className="align-self-center img-fluid" src={items.images.url} width="250" alt="product" />
                                                            </div>
                                                        </div>
                                                        <Steps items={stepsOptions} current={activeStep} labelPlacement='vertical' />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="card-footer p-4">
                                        <div className="d-flex justify-content-between">
                                            <h5 className="fw-normal mb-0"><Link to={"#"}>Cancel</Link></h5>
                                            <h5 className="fw-normal mb-0"><Link to={"#"}>Pre-pay</Link></h5>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        : 
                        <div className="container bg-white pb-3">
                            <div className="row">
                                <div className="d-flex justify-content-center">
                                    <img src={noPlantsImage} style={{ maxHeight: "60vh" }} alt="no plants data found" className='img-fluid' />
                                </div>
                            </div>
                            <div className="row">
                                <div className="d-flex d-flex flex-column align-items-center">
                                    <h3 className="h3" style={{ fontFamily: "cursive" }}>No Order Found!</h3>
                                    <Link to="/products" className='btn btn-primary'><i className="fas fa-arrow-left"></i> Back To Products</Link>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </section>
    )
}

export default Order