const Order = require('../../../model/checkoutModel/orders');

module.exports = {
    name: 'New User Rule',
    evaluate: async (coupon, cartContext, user) => {
        if (coupon.rules.isNewUserOnly) {
            if (!user) {
                return { passed: false, reason: 'You must be logged in to apply this coupon.' };
            }

            // A user is considered "New" if they have no successful orders
            const orderCount = await Order.countDocuments({ 
                user: user._id, 
                "payment.status": { $ne: 'Failed' } 
            });

            if (orderCount > 0) {
                return { 
                    passed: false, 
                    reason: 'This coupon is strictly valid for new users only.' 
                };
            }
        }
        return { passed: true };
    }
};
