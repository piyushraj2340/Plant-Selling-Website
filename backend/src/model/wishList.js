const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema({
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
        unique: [true, "Plant is already in your wish List"],
        immutable: true
    },
});

const wishList = new mongoose.model('wishList', wishListSchema);

module.exports = wishList;