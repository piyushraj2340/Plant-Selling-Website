const mongoose = require('mongoose');
const validator = require('validator');

const plantsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    nurseryId: {
        type: mongoose.Schema.ObjectId,
        ref: "nursery",
        required: true
    },
    plantName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reviews: [{
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            required: true
        },
        rating: {
            type: Number,
            required: true,
        },
        review: {
            type: String,
        },
        upVote: {
            type: Number,
            default: 0
        }
    }],
    noOfVisit: {
        type: Number,
        required: true,
        default: 0
    },
    postedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

plantsSchema.methods.increaseVisit = async function () {
    try {
        this.noOfVisit++;
        await this.save();
    } catch (error) {
        console.log(error);
    }
}

const plant = new mongoose.model('plant', plantsSchema);

module.exports = plant;