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
    message: {
        type: String,
        required: true
    },
    isMessageViewed: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('nurseryStoreContact', nurseryStoreContactSchema);