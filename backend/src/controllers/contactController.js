// controllers/contactController.js
const Contact = require('../model/contact');
const { getInTouch } = require('./smtp/emailController');

// Controller to save contact form data to the database
const GetInTouch = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        // Validate the input data
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // // Save the data to the database
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        const isEmailSent = await getInTouch(email, name, message);

        if (!isEmailSent) {

            const error = new Error("Failed to send email verification");
            error.statusCode = 500;
            throw error;
        }

        res.status(201).json({ message: 'Contact message saved successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { GetInTouch };
