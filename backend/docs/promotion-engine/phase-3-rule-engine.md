# Enterprise Promotion Engine - Phase 3: Rule & Discount Engine Pipeline

## 1. Directory Structure (`backend/src/utils/promotionEngine/`)
To achieve true modularity, we will build the Promotion Engine entirely within a dedicated directory. This isolates complex logic from your controllers, ensuring your Express app remains clean.

```text
utils/
└── promotionEngine/
    ├── index.js              # The main PromotionService facade
    ├── engine.js             # Orchestrator that loops through rules and discounts
    ├── rules/
    │   ├── index.js          # Exports an array of all active rules
    │   ├── minAmount.rule.js # Checks if applicable subtotal >= minOrderAmount
    │   ├── usageLimit.rule.js# Checks max usage constraints
    │   ├── newUser.rule.js   # Checks order history
    │   └── time.rule.js      # Checks if the coupon is expired
    └── discounts/
        ├── index.js          # Strategy factory
        ├── flat.strategy.js  # Math for flat discount
        └── percent.strategy.js# Math for percentage discount with max caps
```

## 2. The Rule Engine (Fail-Fast Pattern)
The core principle of a highly performant Rule Engine is **Fail-Fast**. If a coupon requires a minimum cart value of ₹500, and the cart is ₹300, we must instantly reject the coupon without querying the database for "New User" checks.

### Example: A Single Modular Rule (`rules/minAmount.rule.js`)
Every rule is a simple, pure JavaScript object exposing an `evaluate` function that returns `{ passed: boolean, reason: string }`.

```javascript
module.exports = {
    name: 'Minimum Amount Rule',
    evaluate: async (coupon, cartContext, user) => {
        if (coupon.rules.minOrderAmount > 0) {
            // Evaluates based on the applicable portion of the cart
            if (cartContext.applicableTotal < coupon.rules.minOrderAmount) {
                return { 
                    passed: false, 
                    reason: `This coupon requires a minimum applicable order amount of ₹${coupon.rules.minOrderAmount}.` 
                };
            }
        }
        return { passed: true };
    }
}
```

### The Orchestrator (`engine.js`)
The engine dynamically loops over all registered rules sequentially.

```javascript
const rules = require('./rules');

const evaluateRules = async (coupon, cartContext, user) => {
    for (const rule of rules) {
        const result = await rule.evaluate(coupon, cartContext, user);
        if (!result.passed) {
            return result; // Instantly fails and returns the exact reason
        }
    }
    return { passed: true };
};
```
**Enterprise Extensibility:** If marketing requests a new "Birthday Coupon" rule next year, you simply drop a `birthday.rule.js` file into the `rules/` folder. You do NOT have to rewrite the controller or any existing logic.

## 3. The Discount Engine (Strategy Pattern)
Once all rules pass, we calculate the financial discount. We use the **Strategy Pattern** to completely separate the math from the rules.

```javascript
// discounts/percent.strategy.js
module.exports = {
    calculate: (coupon, cartContext) => {
        let rawDiscount = cartContext.applicableTotal * (coupon.discount.value / 100);
        
        // Apply the maximum cap if it exists (e.g., 50% off UP TO ₹100)
        if (coupon.discount.maxDiscountAmount) {
            rawDiscount = Math.min(rawDiscount, coupon.discount.maxDiscountAmount);
        }
        
        return rawDiscount;
    }
}
```

## 4. The Reusable `PromotionService` Facade (`index.js`)
This is the single, clean interface that your Express Controllers will call. Controllers do not need to know about the engine, the rules, or the strategies.

```javascript
const engine = require('./engine');
const Coupon = require('../../model/nurseryModel/coupon');

const PromotionService = {
    /**
     * Applies a coupon code to a cart and returns the calculated discount.
     */
    applyCoupon: async (couponCode, cart, user) => {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), status: 'Active' });
        
        if (!coupon) return { success: false, message: "Invalid or inactive coupon code." };
        
        // 1. Evaluate Eligibility
        const ruleResult = await engine.evaluateRules(coupon, cart, user);
        if (!ruleResult.passed) {
            return { success: false, message: ruleResult.reason };
        }
        
        // 2. Calculate Discount
        const discountAmount = engine.calculateDiscount(coupon, cart);
        
        // 3. Return final payload to the controller
        return {
            success: true,
            couponId: coupon._id,
            discountAmount,
            freeDelivery: coupon.rules.freeDelivery,
            newTotal: Math.max(cart.total - discountAmount, 0)
        };
    }
};

module.exports = PromotionService;
```

---
*Please review Phase 3. If you approve of this modular, fail-fast implementation strategy, we will proceed to Phase 4 (Actually coding these files into your backend!).*
