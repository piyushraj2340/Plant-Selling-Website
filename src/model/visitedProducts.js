const mongoose = require('mongoose');

const visitedProductSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: [true, "userId is required"],
        immutable: true
    },
    plant: {
        type: mongoose.Schema.ObjectId,
        ref: "plant",
        required: [true, "PlantId is required"],
        unique: [true, "Plant Id is already in the database"],
        immutable: true
    },
    count: {
        type: Number,
        required: [true, "Count is required."],
        defaultValue: 0
    },
    lastVisitedAt: {
        type: Date,
        required: [true, "Last visited at is required."],
        default: new Date.now,
        expires: 60 * 60 * 24 * 7
    }
});


const visitedProduct = new mongoose.model('visitedProduct', visitedProductSchema);

module.exports = visitedProduct;