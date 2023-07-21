const mongoose = require('mongoose');

const plantsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
    },
    nurseryId: {
        type: mongoose.Schema.ObjectId,
        ref: "nursery",
        required: true,
    },
    plantsName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
    },
    noOfRatings: {
        type: Number,
    },
});

const plant = new mongoose.model('plant', plantsSchema);

module.exports = plant;