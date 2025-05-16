import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AlertPopOver from '../../../common/AlertPopOver';
import { Link } from 'react-router-dom';
import useUserData from '../../../../hooks/useUserData';

const NurseryStoreContactUs = ({ nurseryPublicStore }) => {
    document.title = nurseryPublicStore.nurseryName + " - Contact Us";

    const {userData:user} = useUserData();

    // State to manage form data
    const [formData, setFormData] = useState({
        nursery: nurseryPublicStore._id,
        user: user ? user : null,
        name: '',
        email: '',
        message: '',
    });

    // State to manage validation errors
    const [errors, setErrors] = useState({});

    // State to manage response or loading status
    const [status, setStatus] = useState('');

    // Handle form field changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        setErrors({ ...errors, [id]: '' }); // Clear error for the field on change
    };

    // Validate fields
    const validateFields = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Enter a valid email address.';
        }
        if (!formData.message.trim()) newErrors.message = 'Message is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Focus the first empty field
    const focusFirstErrorField = () => {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
            const fieldElement = document.getElementById(firstErrorField);
            fieldElement?.focus();
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!user) return;

        if (!validateFields()) {
            focusFirstErrorField();
            return;
        }

        setStatus('Sending...'); // Optional loading status

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL_BACKEND}/api/v2/public/nursery/store/view/${nurseryPublicStore._id}/contactUs`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            );

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
        <section className="bg-section py-sm-3 contact-us">
            <div className="container p-0 overflow-hidden rounded-corner">
                <div className="row g-0 full-height px-0 px-md-5" style={{ minHeight: '70vh' }}>
                    {/* Left Section: Contact Information */}
                    <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-start bg-dark text-white p-5">
                        <h4 className="mb-4">Contact Information</h4>
                        <div className="mb-3">
                            <a className="text-light" href={`mailto:${nurseryPublicStore.nurseryEmail}`}>
                                <i className="fas fa-envelope me-2"></i>
                                <span>Email: {nurseryPublicStore.nurseryEmail}</span>
                            </a>
                        </div>
                        <div className="mb-3">
                            <a className="text-light" href={`tel:+91${nurseryPublicStore.nurseryPhone}`}>
                                <i className="fas fa-phone me-2"></i>
                                <span>Phone: +91{nurseryPublicStore.nurseryPhone}</span>
                            </a>
                        </div>
                        <div>
                            <i className="fas fa-map-marker-alt me-2"></i>
                            <span>Address: {nurseryPublicStore.address}</span>
                        </div>
                    </div>

                    {/* Right Section: Contact Form */}
                    <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center bg-light p-5">
                        <h4 className="mb-4">Get in Touch</h4>
                        <form className="w-100" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
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
                                {errors.name && <small className="text-danger">{errors.name}</small>}
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
                                {errors.email && <small className="text-danger">{errors.email}</small>}
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
                                {errors.message && <small className="text-danger">{errors.message}</small>}
                            </div>
                            {user ? (
                                <button type="submit" className="btn btn-primary w-100">
                                    Send
                                </button>
                            ) : (
                                <AlertPopOver
                                    loginAlertUI={
                                        <div>
                                            <Link
                                                to={`/login/?redirect=/nursery/store/view/${nurseryPublicStore._id}/?activeTab=contactUs`}
                                                className="btn btn-sm btn-warning"
                                            >
                                                Login
                                            </Link>
                                        </div>
                                    }
                                    title="Sign in to send message"
                                    content={
                                        <button className="btn btn-primary w-100">
                                            Send
                                        </button>
                                    }
                                />
                            )}
                        </form>
                        {status && <p className="mt-3 text-center">{status}</p>}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NurseryStoreContactUs;
