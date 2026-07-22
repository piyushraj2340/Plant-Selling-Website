module.exports = {
    calculate: (coupon, cartContext) => {
        let rawDiscount = cartContext.applicableTotal * (coupon.discount.value / 100);
        
        // Apply the maximum cap if it exists (e.g., 50% off UP TO ₹100)
        if (coupon.discount.maxDiscountAmount && coupon.discount.maxDiscountAmount > 0) {
            rawDiscount = Math.min(rawDiscount, coupon.discount.maxDiscountAmount);
        }
        
        return rawDiscount;
    }
};
