module.exports = {
    name: 'Minimum Amount Rule',
    evaluate: async (coupon, cartContext, user) => {
        if (coupon.rules.minOrderAmount > 0) {
            if (cartContext.applicableTotal < coupon.rules.minOrderAmount) {
                return { 
                    passed: false, 
                    reason: `This coupon requires a minimum applicable order amount of ₹${coupon.rules.minOrderAmount}.` 
                };
            }
        }
        return { passed: true };
    }
};
