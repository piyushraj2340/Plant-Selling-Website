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
        immutable: true
    },
    quantity: {
        type: Number,
        default: 1,
        require: [true, "Cart quantity is required."],
        validate(quantity) {
            if(quantity < 1) throw new Error("Cart should not be less than 1.");
        }
    },
    pricing: {
        priceWithoutDiscount: {
            type: Number,
            required: [true, "priceWithoutDiscount is required."],
            validate(price) {
                if(price < 0) throw new Error("Price must be greater than zero.");
            }
        },
        priceAfterDiscount: {
            type: Number,
            required: [true, "priceAfterDiscount is required."],
            validate(price) {
                if(price < 0) throw new Error("Price must be greater than zero.");
            }
        },
        discount: {
            type: Number,
            required: [true, "discount is required."],
            validate(price) {
                if(price < 0) throw new Error("Price must be greater than zero.");
            }
        },
        discountPrice: {
            type: Number,
            required: [true, "discountPrice is required."],
            validate(price) {
                if(price < 0) throw new Error("Price must be greater than zero.");
            }
        },
    },
    addedAt: {
        type: Date,
        required: [true, "Cart Added at is required."],
        default: Date.now
    }
});

const cart = new mongoose.model('cart', cartSchema);

module.exports = cart;