const mongoose = require('mongoose');

const validator = require('validator');

const deliverySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: [true, "User Id is required."],
        unique: [true, "You are already Plant Seller."],
        immutable: true
    },
    deliveryName: {
        type: String,
        required: [true, "Delivery Name is required."],
        minlength: 3,
    },
    avatar: {
        public_id: {
            type: String,
            default: ""
        },
        url: {
            type: String,
            default: ""
        }
    },
    avatarList: [{
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    }],
    deliveryEmail: {
        type: String,
        required: [true, "Delivery Email is required."],
        unique: [true, "This email is already in used."],
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("Invalid Email.");
            }
        }
    },
    deliveryPhone: {
        type: String,
        required: [true, "Delivery Phone is required."],
        unique: [true, "This phone is already in used."],
        validate(phone) {
            if (!validator.isMobilePhone(phone, 'en-IN')) {
                throw new Error("Invalid Phone.");
            }
        }
    },
    address: {
        type: String,
        required: [true, "Address is required."],
    },
    pinCode: {
        type: Number,
        required: [true, "Pin Code is required."],
    },
    city: {
        type: String,
        required: [true, "City is required."],
    },
    state: {
        type: String,
        required: [true, "State is required."],
    },
    workingLocation: {
        pinCode: [
            {
                type: Number,
                required: [true, "Working pinCode is required."],
            }
        ]
    }
});

const delivery = new mongoose.model('delivery', deliverySchema);

module.exports = delivery;