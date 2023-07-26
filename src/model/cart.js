const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    cartList: [{
        plantsId: {
            type: mongoose.Schema.ObjectId,
            ref: "plant",
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            require: true
        },
        addedAtPrice: {
            type: Number,
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now,
            required: true
        }
    }],
    saveForLater: [{
        plantsId: {
            type: mongoose.Schema.ObjectId,
            ref: "plant",
            required: true
        },
        addedAtPrice: {
            type: Number,
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now,
            required: true
        }
    }],
    visitedProduct: [{
        plantsId: {
            type: mongoose.Schema.ObjectId,
            ref: "plant",
            required: true
        },
        count: {
            type: Number,
            required: true
        }
    }]
});

const cart = new mongoose.model('cart', cartSchema);

module.exports = cart;