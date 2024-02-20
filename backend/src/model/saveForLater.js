const mongoose = require('mongoose');

const saveForLaterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: [true, "UserId is required"],
        immutable: true
    },
    plant: {
        type: mongoose.Schema.ObjectId,
        ref: "plant",
        required: [true, "PlantId is required"],
        unique: [true, "Plant is already in your save for later database"],
        immutable: true
    },
    addedAtPrice: {
        type: Number,
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const saveForLater = new mongoose.model('saveForLater', saveForLaterSchema);

module.exports = saveForLater;