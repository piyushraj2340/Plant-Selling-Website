const mongoose = require('mongoose');
const validator = require('validator');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: [true, "User Id is required."],
        immutable: true
    },
    orderItems: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "orderItem"
        }
    ],
    orderStatus: {
        status: {
            type: String,
            default: "Processing"
        },
        message: {
            type: String,
            default: "Order is processing."
        },
        statusAt: {
            type: Date,
            default: Date.now
        }
    },
    shippingInfo: {
        name: {
            type: String,
            required: [true, "Person Name in address is required"]
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            validate(phone) {
                if (!validator.isMobilePhone(phone, 'en-IN')) {
                    throw new Error("Invalid Phone");
                }
            }
        },
        pinCode: {
            type: String,
            required: [true, "Pin Code is required"],
            validate(pinCode) {
                if (!validator.isPostalCode(pinCode, 'IN')) {
                    throw new Error("Invalid Pin Code");
                }
            }
        },
        address: {
            type: String,
            required: [true, "Address Filed is required"]
        },
        landmark: {
            type: String,
        },
        city: {
            type: String,
            required: [true, "City is required"]
        },
        state: {
            type: String,
            required: [true, "State is required"]
        },
    },
    pricing: {
        totalPriceWithoutDiscount: {
            type: Number,
            required: [true, "totalPriceWithoutDiscount is required."],
        },
        totalDiscount: {
            type: Number,
            required: [true, "totalDiscount is required."],
        },
        deliveryFee: {
            type: Number,
            required: [true, "deliveryFee is required."],
        },
        finalPrice: {
            type: Number,
            required: [true, "finalPrice is required."]
        },
    },
    orderAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    payment: {
        paymentId: {
            type: String,
            required: true,
            unique: true
        },
        status: {
            type: String,
            required: true,
            default: "pending"
        },
        message: {
            type: String,
            default: "Waiting for payment confirmation!"
        },
        paymentMethods: {
            type: String,
            required: true,
        }
    },
    delivery: {
        delivery: {
            type: mongoose.Schema.ObjectId,
            ref: "delivery",
        },
        deliveryPersonName: String,
        deliveredAt: Date,
    },
});

const orders = new mongoose.model('orders', orderSchema);

module.exports = orders;