const mongoose = require('mongoose');

const validator = require('validator');

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    address: [{
        name: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true,
            validate(value) {
                if (value.toString().length != 10) {
                    throw new Error("Invalid Phone!...");
                }
            }
        },
        pinCode: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        landmark: {
            type: String,
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        setAsDefault: {
            type: Boolean,
            default: false
        }
    }]
});

const address = new mongoose.model('address', addressSchema);

module.exports = address;