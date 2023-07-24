const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
    },
    nurseryId: {
        type: mongoose.Schema.ObjectId,
        ref: "nursery",
        required: true,
    },
    plantsId: {
        type: mongoose.Schema.ObjectId,
        ref: "plant",
        required: true,
    },
    quantity: {
        type: Number,
        require: true
    },
    totalPrice: {
        type: Number,
        require: true
    },
    orderDateTime: {
        type: Date,
        default: Date.now,
        require: true,
    },
    orderId: {
        type: String,
        require: true
    }
});

const orders = new mongoose.model('orders', orderSchema);

module.exports = orders;