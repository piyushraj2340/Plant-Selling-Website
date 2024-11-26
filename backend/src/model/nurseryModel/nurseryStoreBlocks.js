const mongoose = require('mongoose');

const nurseryStoreBlockSchema = new mongoose.Schema({
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
    nurseryStoreTabs: { 
        type: mongoose.Schema.ObjectId,
        ref: "nurseryStoreTab",
        required: [true, "Nursery Store Tab Id is required."],
        immutable: true
    },
    nurseryStoreTemplates: { 
        type: mongoose.Schema.ObjectId,
        ref: "nurseryStoresTemplate",
        required: [true, "Nursery Store Template Id is required."],
        immutable: true
    },
    index: {
        type: Number,
        required: [true, "Index is required."],
    },
    image: {
        public_id: {
            type: String,
            required: [true, "Image public id is required."]
        },
        url: {
            type: String,
            required: [true, "Image public url is required."]
        },
    },
    isProduct: {
        type: Boolean,
        default: false
    },
    url: {
        type: String,
        required: [true, "Url is required."],
    },
    title: {
        type: String,
        required: [true, "Title is required."],
    }
});

const nurseryStoresBlock = new mongoose.model('nurseryStoresBlock', nurseryStoreBlockSchema);

module.exports = nurseryStoresBlock;