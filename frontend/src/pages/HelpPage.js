import React from 'react'
import { Link } from 'react-router-dom'

const HelpPage = () => {
    return (
        <section className="bg-light py-5">
            <div className="container py-4 px-3 rounded bg-white">
                <header className="mb-5">
                    <h1 className="display-4 text-center">Help - Plant Seller</h1>
                    <p className="lead text-center">
                        Your go-to guide for navigating Plant Seller. Find answers to common
                        questions and get help with your account, orders, and more!
                    </p>
                </header>

                {/* Getting Started Section */}
                <section id="getting-started" className="section-title">
                    <h2>Getting Started</h2>
                    <p>
                        <strong>What is Plant Seller?</strong>
                        <br />
                        Plant Seller is your go-to online store for buying a wide range of
                        plants, from trendy succulents to vibrant indoor trees. Whether you're
                        a first-time plant owner or a seasoned gardening enthusiast, we have
                        something for you!
                    </p>

                    <p>
                        <strong>How to Create an Account?</strong>
                        <br />
                        1. Click on the "Sign Up" button at the top right corner of the
                        homepage.
                        <br />
                        2. Fill out the required information such as your name, email
                        address, and password.
                        <br />
                        3. After registration, you will receive a confirmation email. Follow
                        the link to verify your account.
                        <br />
                        4. Once verified, log in and start exploring our plant collection!
                    </p>
                </section>

                {/* Account Management Section */}
                <section id="account-management" className="section-title">
                    <h2>Account Management</h2>
                    <p>
                        <strong>How to Edit My Profile?</strong>
                        <br />
                        Update your profile details by visiting your profile page. Here you
                        can change your name, email, and password.
                    </p>
                    <p>
                        <strong>How to Add and Edit My Address?</strong>
                        <br />
                        To add or update your shipping address, visit the "Address" section
                        in your account settings.
                    </p>
                    <p>
                        <strong>Forgot My Password – How to Reset It?</strong>
                        <br />
                        If you forgot your password, click the "Forgot Password?" link on
                        the login page and follow the instructions to reset it.
                    </p>
                </section>

                {/* Shopping and Orders Section */}
                <section id="shopping-orders" className="section-title">
                    <h2>Shopping and Orders</h2>
                    <p>
                        <strong>How to Browse Plants?</strong>
                        <br />
                        Use the search bar and filters to explore our plant categories. You
                        can sort by plant type, price, and more.
                    </p>
                    <p>
                        <strong>How to Add Plants to My Cart?</strong>
                        <br />
                        Simply click the "Add to Cart" button on the plant page. You can view
                        your cart at any time by clicking the shopping cart icon.
                    </p>
                    <p>
                        <strong>How to Checkout and Make Payment?</strong>
                        <br />
                        After adding your plants to the cart, proceed to checkout where you
                        can choose your shipping address and payment method.
                    </p>
                    <p>
                        <strong>How to Track My Order?</strong>
                        <br />
                        Go to the "Order History" section in your profile to track the status
                        of your orders.
                    </p>
                    <p>
                        <strong>Can I Cancel or Modify My Order?</strong>
                        <br />
                        Orders can be canceled or modified only within a specific window.
                        Please refer to the Return and Refund Policy for more details.
                    </p>
                </section>

                {/* For Nursery Owners Section */}
                <section id="nursery-owners" className="section-title">
                    <h2>For Nursery Owners</h2>
                    <p>
                        <strong>How to Create a Nursery Profile?</strong>
                        <br />
                        Visit the "Become a Nursery Partner" page and follow the steps to
                        register your nursery.
                    </p>
                    <p>
                        <strong>How to Add and Edit Plants in My Nursery Store?</strong>
                        <br />
                        Once your nursery is set up, you can add plants through your nursery
                        dashboard. Edit details like plant name, price, and description.
                    </p>
                    <p>
                        <strong>How to Customize My Nursery Store?</strong>
                        <br />
                        Customize your nursery’s branding and display by visiting the "Store
                        Settings" section in your dashboard.
                    </p>
                </section>

                {/* Troubleshooting & FAQs Section */}
                <section id="faq" className="section-title">
                    <h2>Troubleshooting & FAQs</h2>
                    <Link to="/faq" className="btn btn-primary">
                        Visit Our FAQ Page
                    </Link>
                    <p>
                        <strong>Order Confirmation Issues?</strong>
                        <br />
                        Check your email and spam folder, or contact support if the issue
                        persists.
                    </p>
                </section>

                {/* Bug Report Section */}
                <section id="bug-report" className="section-title">
                    <h2>Bug Report</h2>
                    <p>
                        If you encounter any bugs or issues, please report them on our{" "}
                        <a
                            href="https://github.com/piyushraj2340/Plant-Selling-Website/issues"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub Issues Page
                        </a>
                        .
                    </p>
                </section>

                {/* Contribute Section */}
                <section id="contribute" className="section-title">
                    <h2>Contribute</h2>
                    <p>
                        We welcome contributions! To get involved, check out our{" "}
                        <a
                            href="https://github.com/piyushraj2340/Plant-Selling-Website"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub Repository
                        </a>{" "}
                        and follow the instructions to make your first pull request.
                    </p>
                </section>

                {/* Contact Us Section */}
                <section id="contact-us" className="section-title">
                    <h2>Contact Us</h2>
                    <p>
                        If you need further assistance, please visit our{" "}
                        <Link to="/contact-us">Contact Us</Link> page or reach out to us
                        directly:
                    </p>
                    <p>
                        <strong>Email:</strong>{" "}
                        <Link to="mailto:piyushraj2340@gmail.com">piyushraj2340@gmail.com</Link>
                    </p>
                    <p>

                        <strong>Phone:</strong>
                        <Link to="tel:+917463980230"> +91 7463980230</Link>
                    </p>
                    <p>
                        <strong>Address:</strong> Aurangabad, Bihar, India.
                    </p>
                </section>

                <div className="social-icons">
                    <p>Social Links</p>
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
            </div>
        </section>
    )
}

export default HelpPage