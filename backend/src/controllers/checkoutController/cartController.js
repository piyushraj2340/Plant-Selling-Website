const cartModel = require('../../model/checkoutModel/cart');

exports.addToCart = async (req, res, next) => {
    try {
        const { user, plant, quantity = 1 } = req.body;

        // Check if item already exists in user's cart
        let cartItem = await cartModel.findOne({ user, plant });

        if (cartItem) {
            // If exists, increment quantity
            cartItem.quantity += parseInt(quantity);
            await cartItem.save();
        } else {
            // Otherwise create new cart item
            cartItem = new cartModel(req.body);
            await cartItem.save();
        }

        // Populate required fields
        const result = await cartItem.populate(["plant", "nursery"]);

        const info = {
            status: true,
            message: "Product added to cart",
            result
        };

        res.status(200).send(info);

    } catch (error) {
        next(error); //! Pass the error to the global error middleware
    }
};


exports.getCartItems = async (req, res, next) => {
    try {
        const result = await cartModel.find({ user: req.user }).populate('nursery', '_id nurseryName').populate('plant', '_id plantName price discount stock images'); // todo: test this

        if (!result) {
            const error = new Error("No Results Found");
            error.statusCode = 404;
            throw error;
        }
        const info = {
            status: true,
            message: "List of cart items.",
            result
        };

        res.status(200).send(info);

    } catch (error) {
        next(error); //! Pass the error to the global error middleware
    }
};


exports.getCartItemById = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const result = await cartModel.findOne({ _id }).populate(["plant", "nursery"]); //todo: test this

        if (!result) {
            const error = new Error("No Results Found");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Cart with id retrieved successfully",
            result
        };
        res.status(200).send(info);

    } catch (error) {
        next(error); //! Pass the error to the global error middleware
    }
};

exports.updateCartItemById = async (req, res, next) => {
    try {
        const result = await cartModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('nursery', '_id nurseryName').populate('plant', '_id plantName price discount stock images');;

        if (!result) {
            const error = new Error("No Results Found");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Cart Edited successfully",
            result
        };
        res.status(200).send(info);

    } catch (error) {
        next(error); //! Pass the error to the global error middleware
    }
};

exports.deleteCartItemById = async (req, res, next) => {
    try {
        const result = await cartModel.findByIdAndDelete(req.params.id);

        if (!result) {
            const error = new Error("No Results Found");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Cart Deleted successfully",
            result
        };
        res.status(200).send(info);

    } catch (error) {
        next(error); //! Pass the error to the global error middleware
    }
};


exports.isPlantAddedToCart = async (req, res, next) => {
    try {
        const plantId = req.params.plantId;
        const result = await cartModel.findOne({ user: req.user, plant: plantId });

        if (!result) {
            const error = new Error("No Results Found");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Product is in the cart.",
            result
        };
        res.status(200).send(info);

    } catch (error) {
        next(error); //! Pass the error to the global error middleware
    }
};

exports.applyCoupon = async (req, res, next) => {
    try {
        const PromotionService = require('../../utils/promotionEngine');
        const { couponCode } = req.body;

        if (!couponCode) {
            const error = new Error("Coupon code is required");
            error.statusCode = 400;
            throw error;
        }

        // 1. Fetch user's cart items
        const cartItems = await cartModel.find({ user: req.user._id }).populate('plant', '_id category');

        if (!cartItems || cartItems.length === 0) {
            const error = new Error("Your cart is empty");
            error.statusCode = 400;
            throw error;
        }

        // 2. Transform the raw cart docs into the CartContext format expected by the engine
        let total = 0;
        const items = cartItems.map(item => {
            const itemTotal = item.pricing.priceAfterDiscount * item.quantity;
            total += itemTotal;
            
            return {
                product: {
                    _id: item.plant._id,
                    category: item.plant.category
                },
                price: item.pricing.priceAfterDiscount,
                quantity: item.quantity
            };
        });

        const cartContext = {
            total,
            items
        };

        // 3. Delegate to the reusable Promotion Engine
        const result = await PromotionService.applyCoupon(couponCode, cartContext, req.user);

        if (!result.success) {
            return res.status(400).json({
                status: false,
                message: result.message
            });
        }

        return res.status(200).json({
            status: true,
            message: "Coupon applied successfully!",
            data: {
                couponId: result.couponId,
                discountAmount: result.discountAmount,
                freeDelivery: result.freeDelivery,
                newTotal: result.newTotal
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.getApplicableCoupons = async (req, res, next) => {
    try {
        const PromotionService = require('../../utils/promotionEngine');
        
        // 1. Fetch user's cart items
        const cartItems = await cartModel.find({ user: req.user }).populate('plant', '_id category');

        if (!cartItems || cartItems.length === 0) {
            return res.status(200).json({ status: true, coupons: [] });
        }

        // 2. Transform the raw cart docs into the CartContext format
        let total = 0;
        const items = cartItems.map(item => {
            const itemTotal = item.pricing.priceAfterDiscount * item.quantity;
            total += itemTotal;
            
            return {
                product: {
                    _id: item.plant._id,
                    category: item.plant.category
                },
                price: item.pricing.priceAfterDiscount,
                quantity: item.quantity
            };
        });

        const cartContext = { total, items };

        // 3. Delegate to Promotion Engine
        const result = await PromotionService.getApplicableCoupons(cartContext, req.user);

        if (!result.success) {
            return res.status(400).json({ status: false, message: result.message });
        }

        return res.status(200).json({
            status: true,
            message: "Applicable coupons retrieved successfully",
            coupons: result.coupons
        });

    } catch (error) {
        next(error);
    }
};