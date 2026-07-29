const mongoose = require('mongoose');

const saveForLaterSchema = new mongoose.Schema({
    isGuestData: { type: Boolean, default: false },
    isSeedData: { type: Boolean, default: false },
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

// Add compound unique index so each user can save a specific plant only once
saveForLaterSchema.index({ user: 1, plant: 1 }, { unique: true });

const saveForLater = new mongoose.model('saveForLater', saveForLaterSchema);

module.exports = saveForLater;