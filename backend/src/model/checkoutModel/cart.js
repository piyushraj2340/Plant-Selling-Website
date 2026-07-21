const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: [true, "userId is required."],
        unique: true, // One cart per user
        immutable: true
    },
    cartItems: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "cartItem"
        }
    ],
    couponApplied: {
        type: mongoose.Schema.ObjectId,
        ref: "Coupon",
        default: null
    },
    pricing: {
        totalPriceWithoutDiscount: { type: Number, default: 0 },
        totalDiscount: { type: Number, default: 0 },
        deliveryFee: { type: Number, default: 0 },
        finalPrice: { type: Number, default: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const cart = new mongoose.model('cart', cartSchema);

module.exports = cart;