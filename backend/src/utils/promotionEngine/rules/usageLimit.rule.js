module.exports = {
    name: 'Usage Limit Rule',
    evaluate: async (coupon, cartContext, user) => {
        // Global limit check
        if (coupon.usage.maxUsageCount !== null && coupon.usage.currentUsageCount >= coupon.usage.maxUsageCount) {
            return {
                passed: false,
                reason: 'This coupon has reached its maximum usage limit.'
            };
        }

        // Per user check
        if (coupon.rules.singleUsePerUser && user) {
            // Check if the user's ID exists in the usedBy array
            if (coupon.usage.usedBy.some(id => id.toString() === user._id.toString())) {
                return {
                    passed: false,
                    reason: 'You have already used this coupon.'
                };
            }
        }

        return { passed: true };
    }
};
