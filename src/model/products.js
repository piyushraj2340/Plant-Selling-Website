const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productSeller: {
        type: String,
        required: true
    },
    productCategory: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    noOfRatings: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        images: [
            {
                type: String,
                required: true
            }
        ]
    },
})

const product = new mongoose.model('product', productSchema);

module.exports = product;