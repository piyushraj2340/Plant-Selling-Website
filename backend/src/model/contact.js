// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['General Inquiry', 'Order Support', 'Technical Issue', 'Partnership', 'Other'],
        default: 'General Inquiry'
    },
    message: {
        type: String,
        required: true
    },
    isReplied: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Contact', contactSchema);
