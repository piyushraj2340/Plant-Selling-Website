module.exports = {
    name: 'Time Rule',
    evaluate: async (coupon, cartContext, user) => {
        const now = new Date();
        
        if (coupon.rules.validUntil && new Date(coupon.rules.validUntil) < now) {
            return {
                passed: false,
                reason: 'This coupon has expired.'
            };
        }

        return { passed: true };
    }
};
