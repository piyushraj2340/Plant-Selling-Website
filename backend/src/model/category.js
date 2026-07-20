const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: [true, 'Category slug is required'],
        unique: true,
        lowercase: true,
        index: true
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    status: {
        type: String,
        enum: ['Active', 'Disabled'],
        default: 'Active'
    }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
