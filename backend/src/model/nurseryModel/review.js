const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
    plant: {
        type: mongoose.Schema.ObjectId,
        ref: "plant",
        required: [true, "Plant Id is required."],
        immutable: true
    },
    rating: {
        type: Number,
        required: [true, "Rating is required."],
        validate(rating) {
            if (rating < 0 && rating > 5) {
                throw new Error("Rating must be greater then 0 and less then 5.")
            }
        }
    },
    review: {
        type: String,
    },
    upVote: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    isBuyer: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const review = new mongoose.model('review', reviewSchema);

module.exports = review;