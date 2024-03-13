import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const logoImg = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/plant_seller_bg_none";

    return (
        <footer className="text-light bg-dark p-4 p-md-5 footer-container">
            <div className="container">
                <section className="footer-content-desc-links">
                    <div className="text-md-start">
                        <div className="d-flex flex-column flex-md-row mt-3 mt-md-0">
                            <div className="mb-2 d-flex flex-column flex-sm-row align-items-sm-start flex-md-column col-md-4 col-lg-6 me-md-3">
                                <h6 className="pe-sm-4 mt-sm-3 mt-md-0">
                                    <Link className="navbar-brand" to="/"><img src={logoImg} alt="plant seller logo" className='logo-img' /></Link>
                                </h6>
                                <div className='d-flex flex-column justify-content-start'>
                                    <p className='highlight-desc'>Let's grow together!</p>
                                    <p className='desc'>
                                        Explore our lush collection of plants to elevate your living space. From vibrant succulents to elegant ferns, find the perfect green companions to breathe life into your home.
                                    </p>

                                </div>
                            </div>
                            <div className="d-flex flex-wrap justify-content-between align-items-start col-md-8 col-lg-6">
                                <div className="d-flex flex-column align-items-start pe-3">
                                    <h6 className="text-uppercase fw-bold mb-4">
                                        Plants
                                    </h6>
                                    <p>
                                        <Link to="#" className="text-reset">Flowering</Link>
                                    </p>
                                    <p>
                                        <Link to="#" className="text-reset">Medicinal</Link>
                                    </p>
                                    <p>
                                        <Link to="#" className="text-reset">Ornamental</Link>
                                    </p>
                                    <p>
                                        <Link to="#" className="text-reset">Indoor</Link>
                                    </p>
                                </div>
                                <div className="d-flex flex-column align-items-start pe-3">
                                    <h6 className="text-uppercase fw-bold mb-4">
                                        Useful links
                                    </h6>
                                    <p>
                                        <Link to="#" className="text-reset">Nursery</Link>
                                    </p>
                                    <p>
                                        <Link to="#" className="text-reset">Settings</Link>
                                    </p>
                                    <p>
                                        <Link to="#" className="text-reset">Orders</Link>
                                    </p>
                                    <p>
                                        <Link to="#" className="text-reset">Help</Link>
                                    </p>
                                </div>
                                <div className="d-flex flex-column align-items-start pe-3">

                                    <h6 className="text-uppercase fw-bold mb-4">Contact Us</h6>
                                    <p><i className="far fa-address-card me-3 text-secondary"></i> Mohali, Punjab, India.</p>
                                    <p>
                                        <Link to="mailto:piyushraj2340@gmail.com" className='text-light'>
                                            <i className="fas fa-envelope me-3 text-secondary"></i>
                                            piyushraj2340@gmail.com
                                        </Link>
                                    </p>
                                    <p>
                                        <Link to="tel:+917463980230" className='text-light'>
                                            <i className="fas fa-phone me-3 text-secondary"></i>
                                            +917463980230
                                        </Link>

                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="">
                    <form>
                        <div className="d-flex flex-column">
                            <div className="mt-3">
                                <p className='m-0'>Subscribe to our newsletter</p>
                            </div>
                            <div className="mb-2">
                                <input type="email" id="sub-email" className="form-control" placeholder='Email address' />
                            </div>
                            <div className="mb-2">
                                <button type="submit" className="btn btn-success mb-4">Subscribe</button>
                            </div>
                        </div>
                    </form>
                </section>

                <section className="d-flex flex-column justify-content-center justify-content-lg-between">
                    <div className="mb-2">
                        <span>connected with us on social networks:</span>
                    </div>
                    <div>
                        <Link to="https://www.facebook.com/Piyushraj2340/" className="me-4 link-secondary">
                            <i className="fab fa-facebook-f"></i>
                        </Link>
                        <Link to="https://twitter.com/piyushraj2340" className="me-4 link-secondary">
                            <i className="fab fa-twitter"></i>
                        </Link>
                        <Link to="https://www.instagram.com/piyushraj2340/" className="me-4 link-secondary">
                            <i className="fab fa-instagram"></i>
                        </Link>
                        <Link to="https://www.linkedin.com/in/piyushraj2340/" className="me-4 link-secondary">
                            <i className="fab fa-linkedin"></i>
                        </Link>
                        <Link to="https://github.com/piyushraj2340" className="me-4 link-secondary">
                            <i className="fab fa-github"></i>
                        </Link>
                    </div>
                </section>
                <div className="text-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.025)" }}>
                    © 2021 Copyright:
                    <Link className="text-reset fw-bold" to="/"> https://plantseller.vercel.app</Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer