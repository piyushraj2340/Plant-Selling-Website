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
                validator(value) {
                    if (value < 0) {
                        throw new Error("Price should not be negative");
                    }
                }
            },
            discount: {
                type: Number,
                required: [true, "Discount is required."],
                validator(value) {
                    if (value < 0 && value > 100) {
                        throw new Error("Discount must be greater then 0 and smaller then 100");
                    }
                }
            },
            quantity: {
                type: Number,
                required: [true, "Quantity is required."],
            },
        }
    ],
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
            required: [true, "totalPriceWithoutDiscount price is required."],
        },
        actualPriceAfterDiscount: {
            type: Number,
            required: [true, "totalPriceWithoutDiscount price is required."],
        },
        discountPrice: {
            type: Number,
            required: [true, "discountPrice price is required."],
        },
        deliveryPrice: {
            type: Number,
            required: [true, "Delivery price is required."],
        },
        totalPrice: {
            type: Number,
            required: [true, "Total Price is required."]
        },
    },
    orderStatus: {
        status: {
            type: String
        },
        message: {
            type: String
        }
    },
    orderAd: {
        type: Date,
        default: Date.now,
        required: true,
    },
    payment: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    delivery: {
        delivery: {
            type: mongoose.Schema.ObjectId,
            ref: "delivery",
            required: true,
        },
        deliveryPersonName: String,
        deliveredAt: Date,
    },
});

const orders = new mongoose.model('orders', orderSchema);

module.exports = orders;