import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import formatTimestamp from '../../../utils/formatTimestamp';
import { getLastOrderAsync } from '../../order/orderSlice';

const ProfileOrder = () => {
    const lastOrder = useSelector(state => state.order.orderHistory)[0];

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getLastOrderAsync());
    }, [])

    return (
        <div className="col-md-12">
            <div className="card mb-4 mb-md-0">
                <div className="card-header">
                    <p className="m-1"><span className="text-primary font-italic me-1 h6">Manage Your Order</span></p>
                </div>

                {
                    lastOrder &&

                    <>
                        <div className='px-2 px-4 mt-4'>
                            <h4 className='h4'>Last Order: </h4>
                        </div>
                        <div className="d-flex flex-column flex-md-row align-items-start justify-content-between align-items-md-center px-2 px-md-4 py-4 mb-2 border-bottom">

                            <div>
                                <p className="text-muted mb-2"> Order ID <span className="fw-bold text-body">{lastOrder._id}</span></p>
                                <p className="text-muted mb-0"> Place On <span className="fw-bold text-body">{formatTimestamp(lastOrder.orderAt)}</span> </p>
                            </div>
                            <div className='mt-2 mt-md-0'>
                                <h6 className="mb-0"> <Link to={`/orders/details/${lastOrder._id}`}>View Details </Link> </h6>
                            </div>
                        </div>

                    </>

                }

                {
                    lastOrder ?
                        lastOrder.orderItems.map(items => {

                            return (
                                <div key={items._id} className="card-body px-2 px-md-4">
                                    <div className='mb-4 pb-4 border-bottom'>
                                        <div className="d-flex flex-row">
                                            <div className="flex-fill">
                                                <h5 className="bold"><Link to={`/product/${items.plant}`} className='link-dark link-underline-hover'>{items.plantName}</Link></h5>
                                                <p className="text-muted"> Qt: {items.quantity} {items.quantity > 1 ? "items" : "item"}</p>
                                                <h4 className="mb-3"> ₹ {(items.price - items.discount / 100 * items.price).toFixed(2)} <span className="small text-muted"> via ({lastOrder.payment.paymentMethods}) </span></h4>
                                                <p className="text-muted">Tracking Status on: <span className="text-body">{formatTimestamp(items.orderStatus.statusAt)}</span></p>
                                            </div>
                                            <div className='mb-4 rounded overflow-hidden' style={{ width: "200px" }}>
                                                <img className="align-self-center img-fluid" src={items.images.url} width="250" alt="product" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        :

                        <div className="card-body">
                            <p className="text-center mt-4" style={{ fontFamily: "cursive" }}><i className="fas fa-eye-slash"></i> No Order Found</p>
                        </div>

                }
                <div className="card-footer">
                    <p className="mt-3 d-flex justify-content-center">
                        <Link to="/orders/history" className='btn btn-light'><i className="fas fa-angle-double-right"></i> View More</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ProfileOrder