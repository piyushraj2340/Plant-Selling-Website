// models/Contact.js
const mongoose = require('mongoose');
const validator = require('validator');

const subscriberEmail = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("Invalid Email");
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('subscriber_email', subscriberEmail);
