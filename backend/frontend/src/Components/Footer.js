import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../Asset/img/plant_seller.png';


const Footer = () => {
    return (
        <footer className="text-center text-lg-start bg-white text-muted">
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
                <div className="me-5 d-none d-lg-block">
                    <span>Get connected with us on social networks:</span>
                </div>
                <div>
                    <Link to="" className="me-4 link-secondary">
                        <i className="fab fa-facebook-f"></i>
                    </Link>
                    <Link to="" className="me-4 link-secondary">
                        <i className="fab fa-twitter"></i>
                    </Link>
                    <Link to="" className="me-4 link-secondary">
                        <i className="fab fa-google"></i>
                    </Link>
                    <Link to="" className="me-4 link-secondary">
                        <i className="fab fa-instagram"></i>
                    </Link>
                    <Link to="" className="me-4 link-secondary">
                        <i className="fab fa-linkedin"></i>
                    </Link>
                    <Link to="" className="me-4 link-secondary">
                        <i className="fab fa-github"></i>
                    </Link>
                </div>
            </section>
            <section className="mt-4">
                <form action="">
                    <div className="row d-flex justify-content-center">
                        <div className="col-auto">
                            <p className="pt-2">
                                <strong>Sign up for our newsletter</strong>
                            </p>
                        </div>
                        <div className="col-md-5 col-12">
                            <div className="form-outline form-white mb-4">
                                <input type="email" id="sub-email" className="form-control" placeholder='Email address' />
                            </div>
                        </div>
                        <div className="col-auto">
                            <button type="submit" className="btn btn-outline-dark mb-4">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </form>
            </section>
            <section className="">
                <div className="container text-center text-md-start mt-5">
                    <div className="row mt-3">
                        <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                <Link className="navbar-brand" to="/"><img src={logoImg} alt="plant seller logo" className='logo-img' /></Link>
                            </h6>
                            <p>
                                Here you can use rows and columns to organize your footer content. Lorem ipsum
                                dolor sit amet, consectetur adipisicing elit.
                            </p>
                        </div>
                        <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
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
                        <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
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
                        <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">

                            <h6 className="text-uppercase fw-bold mb-4">Contact Us</h6>
                            <p><i className="fas fa-home me-3 text-secondary"></i> New York, NY 10012, US</p>
                            <p>
                                <i className="fas fa-envelope me-3 text-secondary"></i>
                                info@example.com
                            </p>
                            <p><i className="fas fa-phone me-3 text-secondary"></i> + 01 234 567 88</p>
                            <p><i className="fas fa-print me-3 text-secondary"></i> + 01 234 567 89</p>
                        </div>
                    </div>
                </div>
            </section>
            <div className="text-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.025)" }}>
                © 2021 Copyright:
                <Link className="text-reset fw-bold" to="#"> plantsellingwebsite.com</Link>
            </div>
        </footer>
    )
}

export default Footer