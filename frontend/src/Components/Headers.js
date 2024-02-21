import React from 'react'
import headerImg from '../Asset/plantsImage/cartoon-woman-taking-care-plants.jpg'

const Headers = () => {
    return (
        <div className="p-5 bg-light text-dark">
            <div className="row d-flex justify-content-around">
                <div className="col-md-5 p-2">
                    <img src={headerImg} width="100%" height="340px" alt="nursery garden" className='img-fluid rounded' />
                </div>
                <div className="col-md-7">
                    <div className='text-center mb-5'>
                        <h1 className='display-3 p-4 h1'>Welcome to Plant Seller.</h1>
                        <p className='blockquote'>Go to the products section or scroll down to see the collection of plants.</p>
                    </div>
                    <div className='d-flex flex-column align-items-center justify-content-center'>
                        <p className='h6'>Subscribe to our Newsletter! and Stay updated.</p>
                        <div className='col-6'>
                            <div className="form-floating">
                                <input type="text" className="form-control" id="email" placeholder="Enter email" name="email" />
                                <label htmlFor="email" >Email</label>
                            </div>
                            <div className="ms-2 small mt-1">
                                <p className="small"><i className="fas fa-info-circle"></i> Enter Your Email to subscribe us.</p>
                            </div>
                        </div>
                        <div className="col-6">
                            <button className='btn btn-primary w-100'>Subscribe</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Headers;