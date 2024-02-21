const mongoose = require('mongoose');

const plantsSchema = new mongoose.Schema({
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
    plantName: {
        type: String,
        required: [true, "Plant Name is required."]
    },
    price: {
        type: Number,
        required: [true, "Price is required."],
        validator(value) {
            if (value < 0) {
                throw new Error("Price should not be negative");
            }
        }
    },
    discount: {
        type: Number,
        required: [true, "Discount is required."],
        validator(value) {
            if (value < 0 && value > 100) {
                throw new Error("Discount must be greater then 0 and smaller then 100");
            }
        }
    },
    stock: {
        type: Number,
        required: [true, "Stock is required."],
        validator(value) {
            if (value < 0) {
                throw new Error("Stock should not be negative")
            }
        }
    },
    category: {
        type: String,
        required: [true, "Category is required."]
    },
    description: {
        type: String,
        required: [true, "Description is required."]
    },
    images: [
        {
            public_id: {
                type: String,
                required: [true, "Image public id is required."]
            },
            url: {
                type: String,
                required: [true, "Image public url is required."]
            },
        }
    ],
    imagesList: [
        {
            public_id: {
                type: String,
                required: [true, "Image public id is required."]
            },
            url: {
                type: String,
                required: [true, "Image public url is required."]
            },
        }
    ],
    noOfVisit: {
        type: Number,
        required: [true, "Number of visit is required."],
        validator(value) {
            if (value < 0) {
                throw new Error("noOfVisit should not be negative")
            }
        },
        default: 0
    },
    postedAt: {
        type: Date,
        default: Date.now,
        required: [true, "Plant added at is required."]
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