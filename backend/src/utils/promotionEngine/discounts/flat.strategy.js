module.exports = {
    calculate: (coupon, cartContext) => {
        // Flat discount takes the exact value off the applicable total
        // It should never reduce the total below 0.
        let rawDiscount = coupon.discount.value;

        // Ensure we don't discount more than the applicable total itself
        if (rawDiscount > cartContext.applicableTotal) {
            rawDiscount = cartContext.applicableTotal;
        }

        return rawDiscount;
    }
};
