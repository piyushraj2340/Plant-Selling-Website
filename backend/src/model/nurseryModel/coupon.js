const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    // 1. Core Identifiers
    code: { 
        type: String, 
        required: [true, 'Coupon code is required'], 
        unique: true, 
        uppercase: true, 
        trim: true,
        index: true // Indexed for blazing fast O(1) lookups during checkout
    },
    description: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Active', 'Expired', 'Disabled'], 
        default: 'Active' 
    },

    // 2. Discount Configuration (Discount Engine Data)
    discount: {
        type: { 
            type: String, 
            enum: ['Percentage', 'Flat'], 
            required: true 
        },
        value: { 
            type: Number, 
            required: true, 
            min: 0 
        },
        maxDiscountAmount: { 
            type: Number, 
            default: null // e.g., "10% off up to ₹50"
        }
    },

    // 3. Applicability Rules (What can this be applied to?)
    applicability: {
        type: { 
            type: String, 
            enum: ['All', 'Categories', 'Products'], 
            default: 'All' 
        },
        categories: [{ type: String }], // e.g., ["indoor", "outdoor"]
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plant' }] // Specific plant IDs
    },

    // 4. Validation Rules (Rule Engine Triggers)
    rules: {
        minOrderAmount: { type: Number, default: 0 },
        validUntil: { type: Date, required: true },
        freeDelivery: { type: Boolean, default: false },
        singleUsePerUser: { type: Boolean, default: false },
        isNewUserOnly: { type: Boolean, default: false }
    },

    // 5. Usage & Reservation Tracking
    usage: {
        maxUsageCount: { type: Number, default: null }, // Null means Infinity
        currentUsageCount: { type: Number, default: 0 },
        usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }] // To enforce singleUsePerUser
    },
    
    // Metadata
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, { 
    timestamps: true 
});

// Compound Indexing for optimal admin dashboard queries and automated expiration jobs
couponSchema.index({ status: 1, "rules.validUntil": 1 });

module.exports = mongoose.model('Coupon', couponSchema);
