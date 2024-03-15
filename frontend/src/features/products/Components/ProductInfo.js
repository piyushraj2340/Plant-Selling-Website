import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Rating } from 'react-simple-star-rating';
import handelShareProduct from '../../../utils/handelShareProduct';
import { message } from 'antd';

const ProductInfo = () => {
    const product = useSelector(state => state.products.product);

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
                    <button className='btn btn-light' onClick={() => {handelShareProduct(data, message)}}><i className='fas fa-share'></i> Share</button>
                </div>
                <small style={{ position: "relative", top: "5px", left: "3px" }}><Link to={`/nursery/store/view/${product.nursery._id}`} className='small link-secondary'><i className="fas fa-store"></i> {product.nursery.nurseryName}</Link></small>
                <div className="card-text">
                    <Rating initialValue={3 + Math.random() * 2} readonly={true} size={20} allowFraction={true} />
                    <small className='ps-2 pe-2' style={{ position: "relative", top: "4px" }}>
                        <Link to={'/rating-link'}>{Math.floor(Math.random() * 200)} ratings</Link>
                    </small>
                    <span style={{ position: "relative", top: "3px" }}>|</span>
                    <small className='ps-2 pe-2' style={{ position: "relative", top: "4px" }}>
                        <Link to={'/rating-link'}>{Math.floor(Math.random() * 200)} answered questions</Link>
                    </small>
                </div>
                <div className="text-muted" style={{ fontSize: "14px", margin: "0" }}>
                    Price : <small className='text-decoration-line-through'>₹ {product.price}</small>
                </div>
                <div className="card-text h3">
                    <span className="text-success">-{product.discount}%</span> <sup>₹</sup>{Math.round(product.price - product.discount / 100 * product.price)}
                </div>
                <div className="text-muted" style={{ fontSize: "14px", margin: "0" }}>Category</div>
                <div className="card-text">{product.category}</div>
                <div className="text-muted" style={{ fontSize: "14px", margin: "0" }}>Description</div>
                <div className="card-text">{product.description}</div>
            </div>
        </div>
    )
}

export default ProductInfo