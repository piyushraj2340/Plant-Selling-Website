const engine = require('./engine');
const Coupon = require('../../model/nurseryModel/coupon');

/**
 * Builds the cart context by determining which items in the cart the coupon actually applies to.
 */
const buildCartContext = (coupon, cart) => {
    let applicableTotal = 0;
    
    // For now, we assume cart object has total value and items array
    // E.g., cart = { total: 1000, items: [{ product: { _id, category }, price, quantity }] }

    if (!cart || !cart.items || cart.items.length === 0) {
        return { applicableTotal: 0 };
    }

    if (coupon.applicability.type === 'All') {
        applicableTotal = cart.total;
    } 
    else if (coupon.applicability.type === 'Categories') {
        const allowedCategories = coupon.applicability.categories.map(c => c.toLowerCase());
        cart.items.forEach(item => {
            // Assuming item.product has a category property
            if (item.product && item.product.category && allowedCategories.includes(item.product.category.toLowerCase())) {
                applicableTotal += item.price * item.quantity;
            }
        });
    } 
    else if (coupon.applicability.type === 'Products') {
        const allowedProductIds = coupon.applicability.products.map(p => p.toString());
        cart.items.forEach(item => {
            if (item.product && allowedProductIds.includes(item.product._id.toString())) {
                applicableTotal += item.price * item.quantity;
            }
        });
    }

    return { applicableTotal };
};

const PromotionService = {
    /**
     * Applies a coupon code to a cart and returns the calculated discount.
     * @param {string} couponCode - The text code the user entered
     * @param {Object} cart - The cart object containing total and items
     * @param {Object} user - The user object applying the coupon
     */
    applyCoupon: async (couponCode, cart, user) => {
        try {
            // 1. Fetch Coupon
            const coupon = await Coupon.findOne({ 
                code: couponCode.toUpperCase(), 
                status: 'Active' 
            });
            
            if (!coupon) {
                return { success: false, message: "Invalid or inactive coupon code." };
            }

            // 2. Build Applicable Cart Context
            const cartContext = buildCartContext(coupon, cart);

            if (cartContext.applicableTotal <= 0) {
                return { success: false, message: "This coupon is not applicable to any items in your cart." };
            }

            // 3. Evaluate Rule Eligibility (Fail-Fast)
            const ruleResult = await engine.evaluateRules(coupon, cartContext, user);
            if (!ruleResult.passed) {
                return { success: false, message: ruleResult.reason };
            }
            
            // 4. Calculate Discount
            const discountAmount = engine.calculateDiscount(coupon, cartContext);
            
            // 5. Return final payload to the controller
            return {
                success: true,
                couponId: coupon._id,
                discountAmount,
                freeDelivery: coupon.rules.freeDelivery,
                newTotal: Math.max(cart.total - discountAmount, 0)
            };
        } catch (error) {
            console.error("Promotion Engine Error:", error);
            return { success: false, message: "An error occurred while evaluating the coupon." };
        }
    }
};

module.exports = PromotionService;
