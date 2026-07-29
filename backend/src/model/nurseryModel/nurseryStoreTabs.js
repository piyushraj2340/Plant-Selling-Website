const mongoose = require('mongoose');

const nurseryStoreTabSchema = new mongoose.Schema({
    isGuestData: { type: Boolean, default: false },
    isSeedData: { type: Boolean, default: false },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: [true, "User Id is required."],
        immutable: true
    },
    nursery: {
        type: mongoose.Schema.ObjectId,
        ref: "nursery",
        required: [true, "Nursery Id is required."],
        immutable: true
    },
    tabName: {
        type: String,
        required: [true, "Tab Name is required."]
    },
    status: {
        type: String,
        required: [true, "Status is required."],
        default: "draft"
    },
    index: {
        type: Number,
        required: [true, "Order of Tabs is required."],
    },
});

nurseryStoreTabSchema.index({ user: 1, nursery: 1, tabName: 1 }, { unique: true });

const nurseryStoresTab = new mongoose.model('nurseryStoreTab', nurseryStoreTabSchema);

module.exports = nurseryStoresTab;