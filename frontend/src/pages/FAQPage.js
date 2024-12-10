import React from 'react';
import { Collapse, Typography } from 'antd';

const { Panel } = Collapse;
const { Title } = Typography;

const FAQPage = () => {
    // Define your FAQs data
    const faqs = [
        {
            question: '1. What is Plant Seller?',
            answer: "Plant Seller is an online platform designed to help you discover and purchase plants for your home or garden. We offer a variety of plants from nurseries around the country, with features to help users, nurseries, and admins manage their plant collections, orders, and profiles.",
        },
        {
            question: "2. How can I create an account on Plant Seller?",
            answer: (
                <>
                    <p>To create an account on Plant Seller:</p>
                    <ol>
                        <li>Click on the Sign Up button on the homepage.</li>
                        <li>Provide your email, create a password, and enter any other required details.</li>
                        <li>After registering, you will be able to log in and access your profile, cart, and orders.</li>
                    </ol>
                </>
            )
        },
        {
            question: '3. How do I log in to my account?',
            answer: (
                <>
                    <p>To log in:</p>
                    <ol>
                        <li>Click on the Login button on the homepage.</li>
                        <li>Enter your registered email address and password.</li>
                        <li>Click Submit to access your dashboard.</li>
                    </ol>
                </>
            )
        },
        {
            question: '4. What can I do with my user account?',
            answer: (
                <>
                    <p>With your user account, you can:</p>
                    <ul>
                        <li>Browse and search for plants from various nurseries.</li>
                        <li>Add plants to your cart and place orders.</li>
                        <li>View your past orders and update your personal details.</li>
                        <li>Manage your shipping address and profile.</li>
                    </ul>
                </>
            )
        },
        {
            question: '5. How do I buy plants?',
            answer: (
                <>
                    <p>To buy plants:</p>
                    <ol>
                        <li>Browse through the plant categories or search for specific plants.</li>
                        <li>Once you find a plant you'd like to buy, click on it for more details.</li>
                        <li>Click on the Add to Cart button to add the plant to your shopping cart.</li>
                        <li>Proceed to Checkout, fill in your delivery details, and choose a payment method.</li>
                        <li>Confirm your order to complete the purchase.</li>
                    </ol>
                </>
            )
        },
        {
            question: '6. What are the payment options?',
            answer: (
                <>
                    <p>We offer several payment options for a seamless shopping experience:</p>
                    <ul>
                        <li>Credit/Debit Cards</li>
                        <li>Net Banking</li>
                        <li>UPI (Unified Payments Interface)</li>
                        <li>Cash on Delivery (COD) for select regions</li>
                    </ul>
                </>
            )
        },
        {
            question: '7. Can I track my order?',
            answer: "Yes! After placing an order, you will receive an email with the tracking details of your order. You can track the status of your order through the My Orders section in your user account."
        },
        {
            question: '8. How can I edit or update my profile?',
            answer: (
                <>
                    <p>To update your profile:</p>
                    <ol>
                        <li>Log in to your account.</li>
                        <li>Go to your Profile page.</li>
                        <li>Click on the Edit Profile button and make the necessary changes (e.g., update your name, email, password, or shipping address).</li>
                        <li>Save the changes by clicking Update.</li>
                    </ol>
                </>
            )
        },
        {
            question: '9. How do I create and manage a nursery store?',
            answer: (
                <>
                    <p>To create a nursery store:</p>
                    <ol>
                        <li>Sign up as a nursery owner (Nursery Registration).</li>
                        <li>After logging in, go to your Nursery Dashboard.</li>
                        <li>Here you can add plants, manage your nursery profile, and customize the appearance of your nursery store.</li>
                        <li>You can also track orders and manage your inventory.</li>
                    </ol>
                </>
            )
        },
        {
            question: '10. Can I edit or remove plants from my nursery?',
            answer: (
                <>
                    <p>Yes, as a nursery owner:</p>
                    <ol>
                        <li>Go to your Nursery Dashboard.</li>
                        <li>Select the Manage Plants section.</li>
                        <li>Here you can Edit or Delete existing plants, including updating plant details, prices, and availability.</li>
                    </ol>
                </>
            )
        },
        {
            question: '11. How do I manage my plant inventory as a nursery?',
            answer: (
                <>
                    <p>To manage your plant inventory:</p>
                    <ol>
                        <li>Log in to your Nursery Dashboard.</li>
                        <li>Go to the Inventory Management section.</li>
                        <li>From there, you can add new plants, edit existing ones, update prices, and manage stock levels.</li>
                    </ol>
                </>
            )
        },
        {
            question: '12. How can I contact customer support?',
            answer: (
                <>
                    <p>If you have any questions or need assistance:</p>
                    <ol>
                        <li>Visit the <a href="/contact-us">Contact Us</a> page on the website.</li>
                        <li>You can send us a message through the contact form or email us directly at <a href="mailto:piyushraj2340@gmail.com">piyushraj2340@gmail.com</a>.</li>
                    </ol>
                </>
            )
        },
        {
            question: '13. How can I become an admin on Plant Seller?',
            answer: (
                <>
                    <p>Admins are usually invited by the platform owner. If you're interested in becoming an admin, please contact us at <a href="mailto:piyushraj2340@gmail.com">piyushraj2340@gmail.com   </a>.</p>
                    <p>As an admin, you will have access to manage all aspects of the platform, including:</p>
                    <ul>
                        <li>User accounts</li>
                        <li>Nurseries and plant listings</li>
                        <li>Orders and payments</li>
                    </ul>
                </>
            )
        },
        {
            question: '14. How do I manage users and nurseries as an admin?',
            answer: (
                <>
                    <p>As an admin:</p>
                    <ol>
                        <li>Log in to your Admin Dashboard.</li>
                        <li>Under User Management, you can view, edit, or delete user accounts.</li>
                        <li>In Nursery Management, you can approve, reject, or edit nursery profiles and their listed plants.</li>
                    </ol>
                </>
            )
        },
        {
            question: '15. Can I delete my account?',
            answer: (
                <>
                    <p>Yes, you can delete your account at any time. To do so:</p>
                    <ol>
                        <li>Go to your Account Settings page.</li>
                        <li>Click on <strong>Delete Account</strong>.</li>
                        <li>Confirm your decision and follow the prompts.</li>
                    </ol>
                </>
            )
        },
        {
            question: '16. How do I manage my orders as a user?',
            answer: (
                <>
                    <p>To manage your orders:</p>
                    <ol>
                        <li>Log in to your user account.</li>
                        <li>Go to the My Orders section.</li>
                        <li>Here, you can view past orders, track their status, and initiate returns if applicable.</li>
                    </ol>
                </>
            )
        },
        {
            question: '17. Is there a mobile app available for Plant Seller?',
            answer: "Currently, Plant Seller is a web-based platform and does not have a dedicated mobile app. However, the website is fully responsive and optimized for use on mobile devices."
        },
        {
            question: '18. Can I subscribe to newsletters from Plant Seller?',
            answer: "Yes, you can subscribe to our newsletter to receive updates on new plants, offers, and more. Simply enter your email in the Subscribe section on the homepage to stay connected."
        },
        {
            question: '19. Is my personal information safe on Plant Seller?',
            answer: "Yes, we take privacy and security seriously. Your personal information is stored securely using industry-standard encryption, and we do not share it with third parties without your consent. For more details, please refer to our Privacy Policy."
        },
        {
            question: '20. How can I unsubscribe from the newsletter?',
            answer: "If you wish to unsubscribe from our newsletter, click the Unsubscribe link at the bottom of any of our emails or visit the Manage Subscriptions section in your account settings."
        }
    ];

    return (
        <section className="bg-light py-5">
            <div className="container py-4 px-3 rounded bg-white">
                <Title level={2}>Frequently Asked Questions (FAQ)</Title>

                <Collapse defaultActiveKey={['1']} accordion>
                    {faqs.map((faq, index) => (
                        <Panel header={faq.question} key={index + 1}>
                            <p>{faq.answer}</p>
                        </Panel>
                    ))}
                </Collapse>
            </div>
        </section>
    );
};

export default FAQPage;
