import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Rating } from 'react-simple-star-rating';

const ProductInfo = () => {
    const product = useSelector(state => state.products.product);

    return (
        <div className="col-lg-5 ps-4 mt-3">
            <div className="row">
                <h3 className='h3 mb-0'>{product.plantName}</h3>
                <small style={{ position: "relative", top: "5px", left: "3px" }}><Link to={`/nursery/store/view/${product.nursery._id}`} className='small link-secondary'><i className="fas fa-store"></i> {product.nursery.nurseryName}</Link></small>
                <p className="card-text">
                    <Rating initialValue={3 + Math.random() * 2} readonly={true} size={20} allowFraction={true} />
                    <small className='ps-2 pe-2' style={{ position: "relative", top: "4px" }}>
                        <Link to={'/rating-link'}>{Math.floor(Math.random() * 200)} ratings</Link>
                    </small>
                    <span style={{ position: "relative", top: "3px" }}>|</span>
                    <small className='ps-2 pe-2' style={{ position: "relative", top: "4px" }}>
                        <Link to={'/rating-link'}>{Math.floor(Math.random() * 200)} answered questions</Link>
                    </small>
                </p>
                <p className="text-muted" style={{ fontSize: "14px", margin: "0" }}>
                    Price : <small className='text-decoration-line-through'>₹ {product.price}</small>
                </p>
                <p className="card-text h3">
                    <span className="text-success">-{product.discount}%</span> <sup>₹</sup>{Math.round(product.price - product.discount / 100 * product.price)}
                </p>
                <p className="text-muted" style={{ fontSize: "14px", margin: "0" }}>Category</p>
                <p className="card-text">{product.category}</p>
                <p className="text-muted" style={{ fontSize: "14px", margin: "0" }}>Description</p>
                <p className="card-text">{product.description}</p>
            </div>
        </div>
    )
}

export default ProductInfo