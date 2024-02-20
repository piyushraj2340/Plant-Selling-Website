const mongoose = require('mongoose');

const validator = require('validator');

const nurserySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: [true, "User Id is required."],
        unique: [true, "You are already Plant Seller."],
        immutable: true
    },
    nurseryOwnerName: {
        type: String,
        required: [true, "Owner Name is required."],
        minlength: 3,
    },
    nurseryName: {
        type: String,
        required: [true, "Nursery Name is required."],
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
    cover: {
        public_id: {
            type: String,
            default: ""
        },
        url: {
            type: String,
            default: ""
        }
    },
    coverList: [{
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    }],
    nurseryEmail: {
        type: String,
        required: [true, "Nursery Email is required."],
        unique: [true, "This email is already in used."],
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("Invalid Email.");
            }
        }
    },
    nurseryPhone: {
        type: String,
        required: [true, "Nursery Phone is required."],
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
    }
});

const nursery = new mongoose.model('nursery', nurserySchema);

module.exports = nursery;