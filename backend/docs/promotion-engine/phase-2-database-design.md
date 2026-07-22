# Enterprise Promotion Engine - Phase 2: Database Design & Rules Structure

## 1. Schema Design (`backend/src/model/nurseryModel/coupon.js`)
We will create a highly normalized Mongoose schema. To ensure fast lookups and maintain high data integrity, we structure the rules into distinct objects within the document.

```javascript
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
        categories: [{ type: String }], // e.g., ["Indoor", "Outdoor"]
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
        usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // To enforce singleUsePerUser
    },
    
    // Metadata
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { 
    timestamps: true 
});

// Compound Indexing for optimal admin dashboard queries and automated expiration jobs
couponSchema.index({ status: 1, "rules.validUntil": 1 });

module.exports = mongoose.model('Coupon', couponSchema);
```

## 2. Why This Database Design is Enterprise-Grade

### A. Separation of Concerns inside the Document
Notice how we grouped fields into `discount`, `applicability`, `rules`, and `usage`. 
- When the **Rule Engine** evaluates the coupon, it strictly parses the `rules` and `applicability` objects.
- When the **Discount Engine** takes over, it exclusively maps to the `discount` object.
- This closely mirrors our application's `promotionEngine` folder structure.

### B. Indexing Strategy for Extreme Scale
- **`code` is uniquely indexed.** When thousands of users type in a promo code during a festival sale, MongoDB finds the document in `O(1)` time without performing a full collection scan.
- **Compound index on `status` and `validUntil`.** This allows your background cron-jobs to instantly locate and deactivate expired coupons without impacting database performance.

### C. Defensive Defaulting
- If `maxUsageCount` is `null`, the coupon is infinite. This prevents the need to set arbitrary large numbers (like `999999999`) which can cause unexpected threshold bugs later.

## 3. Dynamic Rule Computation

We deliberately avoid storing a `isNewUser` boolean directly on the `User` model, as it can easily drift out of sync if an order is cancelled or refunded. 
Instead, if a coupon has `rules.isNewUserOnly: true`, our Rule Engine will dynamically query the **Order collection**:
```javascript
const orderCount = await Order.countDocuments({ user: userId, "payment.status": "successful" });
if (orderCount > 0) return { passed: false, reason: "Coupon valid for new users only." };
```
This approach guarantees 100% accuracy in real-time.

---
*Please review this Phase 2 document. Does this schema fully capture all the static fields you defined in your `Coupon.jsx` component? If approved, we will proceed to Phase 3 (Implementing the Rule Engine Pipeline).*
