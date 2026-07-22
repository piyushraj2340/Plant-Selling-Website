import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Rating } from 'react-simple-star-rating';
import handelShareProduct from '../../../utils/handelShareProduct';
import { message, Modal, Tag } from 'antd';

const ProductInfo = () => {
    const product = useSelector(state => state.products.product);
    const coupons = useSelector(state => state.products.productCoupons) || [];
    const [isCouponModalVisible, setIsCouponModalVisible] = useState(false);

    const data = {
        title: product ? "Share " + product.plantName + " Plants" : "Share Your Plants",
        text: product ? product.description : "Share this Plants to your Friends and Families",
        url: window.location.href
    }

    return (
        <div className="col-lg-5 ps-4 mt-3">
            <div className="row">
                <div className='d-flex justify-content-between align-items-center'>
                    <h3 className='h3 mb-0'>{product.plantName}</h3>
                    <button className='btn btn-light' onClick={() => { handelShareProduct(data, message) }}><i className='fas fa-share'></i> Share</button>
                </div>
                <small style={{ position: "relative", top: "5px", left: "3px" }}><Link to={`/nursery/store/view/${product.nursery._id}`} className='small link-secondary'><i className="fas fa-store"></i> {product.nursery.nurseryName}</Link></small>
                <div className="card-text">
                    <Rating initialValue={product.ratings || 0} readonly={true} size={20} allowFraction={true} />
                    <small className='ps-2 pe-2' style={{ position: "relative", top: "4px" }}>
                        <Link to={'/rating-link'}>{product.numOfReviews || 0} ratings</Link>
                    </small>
                    <span style={{ position: "relative", top: "3px" }}>|</span>
                    <small className='ps-2 pe-2' style={{ position: "relative", top: "4px" }}>
                        <Link to={'/rating-link'}>0 answered questions</Link>
                    </small>
                </div>
                <div className="text-muted" style={{ fontSize: "14px", margin: "0" }}>
                    Price : <small className='text-decoration-line-through'>₹ {product.price}</small>
                </div>
                <div className="card-text h3">
                    <span className="text-success">-{product.discount}%</span> <sup>₹</sup>{Math.round(product.price - product.discount / 100 * product.price)}
                </div>
                <div className="text-muted" style={{ fontSize: "14px", margin: "0" }}>Category</div>
                <div className="card-text mb-2">{product.category ? (product.category.name || "N/A") : "N/A"}</div>

                {coupons.length > 0 && (

                        <div className="">
                            <div>
                                <div className="text-success fw-bold" style={{ fontSize: "14px" }}>
                                    <i className="fas fa-tags me-1"></i> Available Offers
                                </div>
                                <div style={{ fontSize: "13px" }}>
                                    {coupons[0].isApplicable
                                        ? <span className="text-dark"><b>{coupons[0].code}</b>: {coupons[0].description}</span>
                                        : <span className="text-muted">{coupons[0].code}: {coupons[0].reason}</span>}
                                </div>
                            </div>
                            {coupons.length > 1 && (
                                <button className="btn btn-link text-success p-0" style={{ fontSize: "13px" }} onClick={() => setIsCouponModalVisible(true)}>
                                    See all
                                </button>
                            )}
                        </div>
                
                )}
            </div>

            <Modal
                title="Available Offers"
                open={isCouponModalVisible}
                onCancel={() => setIsCouponModalVisible(false)}
                footer={null}
                styles={{ body: { maxHeight: '60vh', overflowY: 'auto' } }}
            >
                {coupons.map((coupon, idx) => (
                    <div key={idx} className={`card mb-3 ${coupon.isApplicable ? 'border-success' : 'border-secondary'}`}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className={`fw-bold ${coupon.isApplicable ? 'text-success' : 'text-secondary'}`}>
                                    {coupon.code}
                                </span>
                                {coupon.isApplicable
                                    ? <Tag color="green">Eligible</Tag>
                                    : <Tag color="default">Not Eligible</Tag>}
                            </div>
                            <div className="text-dark mb-1" style={{ fontSize: "14px" }}>{coupon.description}</div>
                            {!coupon.isApplicable && (
                                <div className="text-muted" style={{ fontSize: "12px" }}>
                                    <i className="fas fa-info-circle me-1"></i>
                                    {coupon.reason}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </Modal>
        </div>
    )
}

export default ProductInfo