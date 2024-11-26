const mongoose = require('mongoose');

const nurseryStoreTabSchema = new mongoose.Schema({
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
        required: [true, "Tab Name is required."],
        unique: [true, "Tab Name is unique"]
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

const nurseryStoresTab = new mongoose.model('nurseryStoreTab', nurseryStoreTabSchema);

module.exports = nurseryStoresTab;