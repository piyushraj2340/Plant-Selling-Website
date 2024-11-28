import React, { useState } from 'react';

const ContactUs = () => {
    document.title = "Contact Us";

    // State to manage form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    // State to manage response or loading status
    const [status, setStatus] = useState('');

    // Handle form field changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...'); // Optional loading status

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/contact-us`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('Message sent successfully!');
                setFormData({ name: '', email: '', message: '' }); // Reset the form
            } else {
                const errorData = await response.json();
                setStatus(`Error: ${errorData.message || 'Failed to send message'}`);
            }
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <section className='bg-section py-sm-3 contact-us'>
            <div className="container p-0 overflow-hidden rounded-corner">
                <div className="row g-0 full-height px-0 px-md-5" style={{ minHeight: "70vh" }}>
                    {/* Left Section: Contact Information */}
                    <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-start bg-dark text-white p-5">
                        <h4 className="mb-4">Contact Information</h4>
                        <div className="mb-3">
                            <a className='text-light' href='mailto:piyushraj2340@gmail.com'>
                                <i className="fas fa-envelope me-2"></i>
                                <span>Email: piyushraj2340@gmail.com</span>
                            </a>
                        </div>
                        <div className="mb-3">
                            <a className='text-light' href='tel:+917463980230'>
                                <i className="fas fa-phone me-2"></i>
                                <span>Phone: +917463980230</span>
                            </a>
                        </div>
                        <div>
                            <i className="fas fa-map-marker-alt me-2"></i>
                            <span>Address: Aurangabad, Bihar, India.</span>
                        </div>
                    </div>

                    {/* Right Section: Contact Form */}
                    <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center bg-light p-5">
                        <h4 className="mb-4">Get in Touch</h4>
                        <form className="w-100" style={{ maxWidth: "500px" }} onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="message" className="form-label">
                                    Message
                                </label>
                                <textarea
                                    className="form-control"
                                    id="message"
                                    rows="4"
                                    placeholder="Your Message"
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                Send
                            </button>
                        </form>
                        {status && <p className="mt-3 text-center">{status}</p>}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;