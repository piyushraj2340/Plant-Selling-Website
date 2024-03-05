export const handelCalculatePricing = (quantity, product) => {
    if (!product) return;

    const totalPriceWithoutDiscount = (product.price * quantity).toFixed(2);
    const actualPriceAfterDiscount = (totalPriceWithoutDiscount - (totalPriceWithoutDiscount * product.discount / 100)).toFixed(2);
    const discountPrice = (totalPriceWithoutDiscount - actualPriceAfterDiscount).toFixed(2);
    const deliveryPrice = (actualPriceAfterDiscount) < 500 ? 90.00 : 0; 

    const pricing = {
        totalPriceWithoutDiscount,
        actualPriceAfterDiscount,
        discountPrice,
        deliveryPrice, //TODO:  calculate the delivery price dynamic
        totalPrice: (Number(actualPriceAfterDiscount) + Number(deliveryPrice)).toFixed(2)
    }

    return pricing;
}