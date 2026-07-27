const mongoose = require('mongoose');

const nurseryStoreContactSchema = new mongoose.Schema({
    nursery: {
        type: mongoose.Schema.ObjectId,
        ref: "nursery",
        required: [true, "Nursery Id is required."]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    },
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
        default: 'General Inquiry'
    },
    message: {
        type: String,
        required: true
    },
    replies: [{
        sender: {
            type: String,
            enum: ['User', 'Nursery'],
            required: true
        },
        message: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isMessageViewed: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: String,
        enum: ['open', 'resolved', 'closed'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('nurseryStoreContact', nurseryStoreContactSchema);