const mongoose = require('mongoose');

const validator = require('validator');

const nurserySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    nurseryName: {
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: [true, "This email is already in used."],
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("Invalid Email");
            }
        }
    },
    phone: {
        type: String,
        required: true,
        unique: [true, "This phone is already in used."],
        validate(value) {
            if (value.toString().length != 10) {
                throw new Error("Invalid Phone!...");
            }
        }
    },
    address: {
        type: String,
        required: true,
    },
    pinCode: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    }
});

const nursery = new mongoose.model('nursery', nurserySchema);

module.exports = nursery;