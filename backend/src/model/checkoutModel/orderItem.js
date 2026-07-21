const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.ObjectId,
        ref: "order",
        required: [true, "Order Id is required."],
        immutable: true
    },
    plant: {
        type: mongoose.Schema.ObjectId,
        ref: "plant",
        required: [true, "Plant Id is required."],
        immutable: true
    },
    nursery: {
        type: mongoose.Schema.ObjectId,
        ref: "nursery",
        required: [true, "Nursery Id is required."],
        immutable: true
    },
    nurseryName: {
        type: String,
        required: [true, "Nursery Name is required."],
    },
    plantName: {
        type: String,
        required: [true, "Plant Name is required."]
    },
    images: {
        public_id: {
            type: String,
            required: [true, "Image public id is required."]
        },
        url: {
            type: String,
            required: [true, "Image public url is required."]
        },
    },
    price: {
        type: Number,
        required: [true, "Price is required."],
        validate(value) {
            if (value < 0) {
                throw new Error("Price should not be negative");
            }
        }
    },
    discount: {
        type: Number,
        required: [true, "Discount is required."],
        validate(value) {
            if (value < 0 && value > 100) {
                throw new Error("Discount must be greater then 0 and smaller then 100");
            }
        }
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required."],
    }
});

const orderItemModel = mongoose.model("orderItem", orderItemSchema);

module.exports = orderItemModel;
