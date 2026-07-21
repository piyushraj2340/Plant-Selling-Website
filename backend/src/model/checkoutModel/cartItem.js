const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    cart: {
        type: mongoose.Schema.ObjectId,
        ref: "cart",
        required: [true, "Cart Id is required."]
    },
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
        required: [true, "Cart quantity is required."],
        validate(quantity) {
            if (quantity < 1) throw new Error("Cart should not be less than 1.");
        }
    },
    addedAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

const cartItemModel = mongoose.model("cartItem", cartItemSchema);

module.exports = cartItemModel;
