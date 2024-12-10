// routes/contact.js
const express = require('express');
const subscriberEmail = require('../model/subscriberEmail');
const { emailSubscriber } = require('../controllers/smtp/emailController');
const router = express.Router();

// Route to handle contact form submissions
router.post('/subscriber-email', async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new Error("Email Id is required");
        }

        // Save the subscription into the database 
        const subscription = new subscriberEmail({ email });
        await subscription.save();

        const isEmailSent = await emailSubscriber(email);

        if (!isEmailSent) {

            const error = new Error("Failed to send email verification");
            error.statusCode = 500;
            throw error;
        }

        res.status(201).json({ message: "Thank you for subscribing to our newsletter!" });

    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});

module.exports = router;
