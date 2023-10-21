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
        required: true,
        validator(value) {
            if(value < 0) {
                throw new Error("Price should not be negative!...");
            }
        }
    },
    discount: {
        type: Number,
        required: true,
        validator(value) {
            if(value < 0 && value > 100) {
                throw new Error("Discount must be greater then 0 and smaller then 100!...");
            }
        }
    },
    stock: {
        type: Number,
        required: true,
        validator(value) {
            if(value < 0) {
                throw new Error("Stock should not be negative!...")
            }
        }
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            public_id:{
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    reviews: [{
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            required: true
        },
        rating: {
            type: Number,
            required: true,
            // add validator
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
        validator(value) {
            if(value < 0) {
                throw new Error("noOfVisit should not be negative!...")
            }
        },
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