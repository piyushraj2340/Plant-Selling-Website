import React from 'react'
import { Link } from 'react-router-dom';
import AnimationSVG from './AnimationSVG';


const Headers = () => {

    const headerImg = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/header-images";

    return (
        <div className="home-header bg-light text-dark p-md-2 p-lg-4">
            <div className="d-flex flex-column flex-md-row-reverse flex-lg-row">
                <div className="col-12 col-md-6 col-lg-6 d-flex justify-content-center p-1">
                    <img src={headerImg} alt="nursery garden" className='img-fluid rounded header-image' />
                </div>
                <div className="col-12 col-md-6 col-lg-6 p-1 p-xl-5 d-flex justify-content-center align-items-center">
                    <div className='header-intro-text'>
                        <p className='d-flex align-items-center greeting-text'><i className='fas fa-minus'></i> Welcome back! </p>
                        <h1 className='h1 text-success d-flex me-5'>Plant Seller <AnimationSVG /></h1>
                        <p className='highlight-desc'>Welcome to Plant Seller: Where Green Dreams Come True!</p>
                        <p>Explore our lush collection of plants to elevate your living space. From vibrant succulents to elegant ferns, find the perfect green companions to breathe life into your home.</p>
                        <p className='highlight-desc'>Let's grow together!</p>
                        <Link to="/products" className='btn btn-success d-flex'>Go To Products <span className="material-symbols-outlined">arrow_right_alt</span></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Headers;