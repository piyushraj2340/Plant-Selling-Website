const rules = require('./rules');
const discounts = require('./discounts');

module.exports = {
    /**
     * Loops through all rules sequentially and fails fast if any rule is violated.
     */
    evaluateRules: async (coupon, cartContext, user) => {
        for (const rule of rules) {
            const result = await rule.evaluate(coupon, cartContext, user);
            if (!result.passed) {
                return result; // Immediately return failure reason
            }
        }
        return { passed: true };
    },

    /**
     * Retrieves the correct discount strategy and calculates the exact amount to deduct.
     */
    calculateDiscount: (coupon, cartContext) => {
        const strategy = discounts.getStrategy(coupon.discount.type);
        return strategy.calculate(coupon, cartContext);
    }
};
