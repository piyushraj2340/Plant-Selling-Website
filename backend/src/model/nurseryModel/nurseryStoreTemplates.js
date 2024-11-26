const mongoose = require('mongoose');

const nurseryStoreTemplateSchema = new mongoose.Schema({
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
    nurseryStoreTabs: { //* This Field is Use to Find the Template with the Tabs id... 
        type: mongoose.Schema.ObjectId,
        ref: "nurseryStoreTab",
        required: [true, "Nursery Store Tab Id is required."],
        immutable: true
    },
    index: {
        type: Number,
        required: [true, "Order of Tabs is required."],
    },
    templateName: {
        type: String,
        required: [true, "Template Name is required."]
    }
});

const nurseryStoresTemplate = new mongoose.model('nurseryStoresTemplate', nurseryStoreTemplateSchema);

module.exports = nurseryStoresTemplate;