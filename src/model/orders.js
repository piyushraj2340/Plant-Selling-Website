const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    nurseryId: {
        type: String,
        required: true,
    },
    plantsId: {
        type: String,
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
        type: String,
        require: true,
    },
    orderId: {
        type: String,
        require: true
    }
});

const orders = new mongoose.model('orders', orderSchema);

module.exports = orders;