import { message } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const logoImg = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/plant_seller_bg_none";

    const [email, setEmail] = useState("");

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the email is empty
        if (email.trim() === "") {
            message.error('Email address is required.');
            return;
        }

        // Optional: You can also check if the email format is valid using regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            message.error('Please enter a valid email address.');
            return;
        }

        // Show loading message
        message.info('Sending...');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/subscriber-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setEmail(""); // Clear the input field after success
                const responseData = await response.json();
                message.success(responseData.message || 'Subscribed successfully!');
            } else {
                const errorData = await response.json();
                console.error(errorData);
                message.error(errorData.message || 'Unable to add your email to the newsletter.');
            }
        } catch (error) {
            console.error(error);
            message.error(`Error: ${error.message}`);
        }
    };

    console.log("re-rendering footer....");
    

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
                                        <Link to="/products/?category=flowering-plants" className="text-reset">Flowering</Link>
                                    </p>
                                    <p>
                                        <Link to="/products/?category=medicinal-plants" className="text-reset">Medicinal</Link>
                                    </p>
                                    <p>
                                        <Link to="/products/?category=ornamental-plants" className="text-reset">Ornamental</Link>
                                    </p>
                                    <p>
                                        <Link to="/products/?category=indoor-plants" className="text-reset">Indoor</Link>
                                    </p>
                                </div>
                                <div className="d-flex flex-column align-items-start pe-3">
                                    <h6 className="text-uppercase fw-bold mb-4">
                                        Useful links
                                    </h6>
                                    <p>
                                        <Link to="/privacy-policy" className="text-reset">Privacy</Link>
                                    </p>
                                    <p>
                                        <Link to="/FAQ" className="text-reset">FAQ</Link>
                                    </p>
                                    <p>
                                        <Link to="/help" className="text-reset">Help</Link>
                                    </p>
                                    <p>
                                        <Link to="/contact-us" className="text-reset">Contact</Link>
                                    </p>
                                </div>
                                <div className="d-flex flex-column align-items-start pe-3">

                                    <h6 className="text-uppercase fw-bold mb-4">Contact Us</h6>
                                    <p><i className="far fa-address-card me-3 text-secondary"></i>Aurangabad, Bihar, India.</p>
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
                    <form onSubmit={handleSubmit}>
                        <div className='row g-0'>
                            <div className="mb-2 col-xs-12 col-sm-10 pe-1">
                                <input
                                    type="email"
                                    id="sub-email"
                                    className="form-control"
                                    placeholder="Email address"
                                    value={email} // Bind email input to state
                                    onChange={(e) => setEmail(e.target.value)} // Update email state on change
                                    required // Optional but can be used for front-end validation
                                />
                            </div>
                            <div className="mb-2 col-xs-12 col-sm-2">
                                <button type="submit" className="btn btn-success mb-4 w-100">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </form>
                </section>

                <section className="d-flex flex-column justify-content-center justify-content-lg-between mb-2">
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
                <div className="text-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.025)" }}>
                    <p className='text-left'>
                        <span>&copy; 2021-2024</span>
                        <Link className="text-reset fw-bold" to="/"> PlantSeller</Link>
                        <span> All rights reserved.</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default React.memo(Footer)