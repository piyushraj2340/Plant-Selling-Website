import React from 'react'
import { Link } from 'react-router-dom';
import headerImg from '../Asset/plantsImage/cartoon-woman-taking-care-plants.jpg'
import AnimationSVG from './Shared/AnimationSVG';


const Headers = () => {
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
                        <Link to="/products" className='btn btn-success d-flex'>Go To Products <span class="material-symbols-outlined">arrow_right_alt</span></Link>

                    </div>
                    {/* <div className='d-none d-lg-flex flex-column w-100'>
                        <p className='h6'>Subscribe to our Newsletter.</p>
                        <div className='col-12 col-md-6'>
                            <div className="form-floating">
                                <input type="text" className="form-control" id="email" placeholder="Enter email" name="email" />
                                <label htmlFor="email" >Email</label>
                            </div>
                            <div className="ms-2 small mt-1">
                                <p className="small"><i className="fas fa-info-circle"></i> Enter Your Email to subscribe us.</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <button className='btn btn-primary w-100'>Subscribe</button>
                        </div>
                    </div> */}
                </div>
                {/* <div className='d-flex d-md-none py-2 px-3 flex-column w-100'>
                    <p className='h6'>Subscribe to our Newsletter.</p>
                    <div className='col-12 col-md-6'>
                        <div className="form-floating">
                            <input type="text" className="form-control" id="email" placeholder="Enter email" name="email" />
                            <label htmlFor="email" >Email</label>
                        </div>
                        <div className="ms-2 small mt-1">
                            <p className="small"><i className="fas fa-info-circle"></i> Enter Your Email to subscribe us.</p>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <button className='btn btn-primary w-100'>Subscribe</button>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Headers;