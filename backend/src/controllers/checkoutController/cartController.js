const Cart = require('../../model/checkoutModel/cart');
const CartItem = require('../../model/checkoutModel/cartItem');
const Plant = require('../../model/nurseryModel/plants');
const Coupon = require('../../model/nurseryModel/coupon');
const PromotionService = require('../../utils/promotionEngine');

// --- Helper: Recalculate Cart Totals ---
const recalculateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate({
        path: 'cartItems',
        populate: { path: 'plant' }
    });

    if (!cart) {
        cart = new Cart({ user: userId });
        await cart.save();
        return cart;
    }

    let totalPriceWithoutDiscount = 0;
    let totalDiscount = 0;
    let finalPrice = 0;
    const itemsContext = [];
    const priceWarnings = [];
    
    for (const item of cart.cartItems) {
        if (!item.plant) continue; // Skip if plant deleted

        const price = item.plant.price * item.quantity;
        const discountAmt = (item.plant.discount / 100) * price;
        const priceAfterDiscount = price - discountAmt;

        totalPriceWithoutDiscount += price;
        totalDiscount += discountAmt;
        finalPrice += priceAfterDiscount;
        
        // Evaluate price warnings
        const currentPricePerItem = item.plant.price - (item.plant.discount / 100) * item.plant.price;
        if (item.addedAtPrice > 0 && currentPricePerItem !== item.addedAtPrice) {
            const diff = currentPricePerItem - item.addedAtPrice;
            if (diff > 0) {
                priceWarnings.push({ type: 'increase', message: `The price of ${item.plant.plantName} has increased by ₹${diff.toFixed(2)} since you added it.` });
            } else {
                priceWarnings.push({ type: 'decrease', message: `The price of ${item.plant.plantName} has decreased by ₹${Math.abs(diff).toFixed(2)} since you added it!` });
            }
        }

        itemsContext.push({
            product: {
                _id: item.plant._id,
                category: item.plant.category
            },
            price: (item.plant.price - (item.plant.discount / 100) * item.plant.price),
            quantity: item.quantity
        });
    }

    let deliveryFee = finalPrice < 500 ? 90 : 0;
    
    let couponDiscountAmount = 0;
    // Evaluate Coupon if applied
    if (cart.couponApplied && cart.cartItems.length > 0) {
        const cartContext = {
            total: finalPrice,
            items: itemsContext
        };
        
        // Assume PromotionService applies the coupon correctly
        const promoResult = await PromotionService.applyCoupon(cart.couponApplied.code || cart.couponApplied, cartContext, { _id: userId });
        if (promoResult.success) {
            totalDiscount += promoResult.discountAmount;
            couponDiscountAmount = promoResult.discountAmount;
            finalPrice = promoResult.newTotal;
            if (promoResult.freeDelivery) {
                deliveryFee = 0;
            }
        } else {
            // Coupon invalid now, remove it
            cart.couponApplied = null;
        }
    }

    finalPrice += deliveryFee;

    // Apply strict 2-decimal rounding to prevent floating point inaccuracies
    totalPriceWithoutDiscount = Math.round(totalPriceWithoutDiscount * 100) / 100;
    totalDiscount = Math.round(totalDiscount * 100) / 100;
    finalPrice = Math.round(finalPrice * 100) / 100;

    cart.pricing = {
        totalPriceWithoutDiscount,
        totalDiscount,
        deliveryFee,
        finalPrice,
        couponDiscountAmount: Math.round(couponDiscountAmount * 100) / 100
    };
    
    cart.priceWarnings = priceWarnings;

    await cart.save();
    return cart;
};

// --- Controllers ---

const getFullyPopulatedCart = async (userId) => {
    return await Cart.findOne({ user: userId })
        .populate({
            path: 'cartItems',
            populate: [
                { path: 'plant', select: '_id plantName price discount stock images category' },
                { path: 'nursery', select: '_id nurseryName' }
            ]
        })
        .populate('couponApplied');
};

exports.addToCart = async (req, res, next) => {
    try {
        const { plant, nursery, quantity = 1 } = req.body;
        const userId = req.user._id;

        // 1. Get or Create Cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId });
            await cart.save();
        }

        // 2. Lookup Plant to get current price for addedAtPrice snapshot
        const plantDoc = await Plant.findById(plant);
        if (!plantDoc) throw new Error("Plant not found");
        const currentDiscountedPrice = plantDoc.price - (plantDoc.discount / 100) * plantDoc.price;

        // 3. Upsert Cart Item
        let cartItem = await CartItem.findOne({ cart: cart._id, plant });

        if (cartItem) {
            cartItem.quantity += parseInt(quantity);
            await cartItem.save();
        } else {
            cartItem = new CartItem({
                cart: cart._id,
                user: userId,
                plant,
                nursery,
                quantity: parseInt(quantity),
                addedAtPrice: currentDiscountedPrice
            });
            await cartItem.save();
            
            // Add reference to cart
            cart.cartItems.push(cartItem._id);
            await cart.save();
        }

        // 4. Recalculate
        await recalculateCart(userId);
        const fullCart = await getFullyPopulatedCart(userId);

        res.status(200).json({
            status: true,
            message: "Product added to cart",
            result: fullCart ? fullCart.cartItems : [],
            cart: fullCart
        });
    } catch (error) {
        next(error);
    }
};

exports.getCartItems = async (req, res, next) => {
    try {
        // Ensure fresh calculation
        await recalculateCart(req.user._id);
        const fullCart = await getFullyPopulatedCart(req.user._id);

        res.status(200).json({
            status: true,
            message: "Cart retrieved successfully",
            result: fullCart ? fullCart.cartItems : [],
            cart: fullCart
        });
    } catch (error) {
        next(error);
    }
};

exports.getCartItemById = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const result = await CartItem.findOne({ _id }).populate(["plant", "nursery"]);

        if (!result) {
            const error = new Error("No Results Found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ status: true, message: "Cart item retrieved", result });
    } catch (error) {
        next(error);
    }
};

exports.updateCartItemById = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const cartItem = await CartItem.findById(req.params.id);

        if (!cartItem) {
            const error = new Error("No Results Found");
            error.statusCode = 404;
            throw error;
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        // Recalculate parent cart
        await recalculateCart(req.user._id);
        const fullCart = await getFullyPopulatedCart(req.user._id);

        res.status(200).json({ 
            status: true, 
            message: "Cart Updated successfully", 
            result: fullCart ? fullCart.cartItems : [],
            cart: fullCart
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCartItemById = async (req, res, next) => {
    try {
        const cartItem = await CartItem.findById(req.params.id);

        if (!cartItem) {
            const error = new Error("No Results Found");
            error.statusCode = 404;
            throw error;
        }

        await CartItem.findByIdAndDelete(req.params.id);

        // Remove from parent cart array
        await Cart.updateOne(
            { _id: cartItem.cart },
            { $pull: { cartItems: cartItem._id } }
        );

        // Recalculate parent cart
        await recalculateCart(req.user._id);
        const fullCart = await getFullyPopulatedCart(req.user._id);

        res.status(200).json({ 
            status: true, 
            message: "Item removed from cart",
            result: fullCart ? fullCart.cartItems : [],
            cart: fullCart
        });
    } catch (error) {
        next(error);
    }
};

exports.isPlantAddedToCart = async (req, res, next) => {
    try {
        const plantId = req.params.plantId;
        const result = await CartItem.findOne({ user: req.user._id, plant: plantId });

        if (!result) {
            const error = new Error("No Results Found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ status: true, message: "Product is in the cart.", result });
    } catch (error) {
        next(error);
    }
};

exports.applyCoupon = async (req, res, next) => {
    try {
        const { couponCode } = req.body;


        if (!couponCode) {
            const error = new Error("Coupon code is required");
            error.statusCode = 400;
            throw error;
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate({
            path: 'cartItems',
            populate: { path: 'plant' }
        });

        if (!cart || cart.cartItems.length === 0) {
            const error = new Error("Your cart is empty");
            error.statusCode = 400;
            throw error;
        }

        // Check if coupon exists
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), status: 'Active' });
        if (!coupon) {
            return res.status(400).json({ status: false, message: "Invalid or inactive coupon code." });
        }

        // Apply it temporarily to calculate
        cart.couponApplied = coupon._id;
        await cart.save();
        
        const updatedCart = await recalculateCart(req.user._id);
        
        // If it got removed during recalculate, it means it wasn't applicable
        if (!updatedCart.couponApplied) {
            return res.status(400).json({ status: false, message: "Coupon is not applicable to these items." });
        }

        const fullCart = await getFullyPopulatedCart(req.user._id);

        return res.status(200).json({
            status: true,
            message: "Coupon applied successfully!",
            cart: fullCart
        });
    } catch (error) {
        next(error);
    }
};

exports.getApplicableCoupons = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate({
            path: 'cartItems',
            populate: { path: 'plant' }
        });

        if (!cart || cart.cartItems.length === 0) {
            return res.status(200).json({ status: true, coupons: [] });
        }

        let total = 0;
        const items = cart.cartItems.map(item => {
            const priceAfterDiscount = item.plant.price - (item.plant.discount / 100) * item.plant.price;
            total += priceAfterDiscount * item.quantity;
            return {
                product: { _id: item.plant._id, category: item.plant.category },
                price: priceAfterDiscount,
                quantity: item.quantity
            };
        });

        const cartContext = { total, items };
        const result = await PromotionService.getApplicableCoupons(cartContext, req.user);

        if (!result.success) {
            return res.status(400).json({ status: false, message: result.message });
        }

        res.status(200).json({ status: true, message: "Coupons retrieved", coupons: result.coupons });
    } catch (error) {
        next(error);
    }
};