const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: [true, "userId is required."],
        immutable: true
    },
    nursery: {
        type: mongoose.Schema.ObjectId,
        ref: "nursery",
        required: [true, "Nursery Id is required."],
        immutable: true
    },
    plant: {
        type: mongoose.Schema.ObjectId,
        ref: "plant",
        required: [true, "PlantId is required."],
        unique: [true, "Plant is already in your cart."],
        immutable: true
    },
    quantity: {
        type: Number,
        default: 1,
        require: [true, "Cart quantity is required."],
    },
    addedAtPrice: {
        type: Number,
        required: [true, "Cart Added at Price is required."],
    },
    addedAt: {
        type: Date,
        required: [true, "Cart Added at is required."],
        default: Date.now
    }
});

const cart = new mongoose.model('cart', cartSchema);

module.exports = cart;