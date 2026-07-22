const mongoose = require('mongoose');
const ordersModel = require('../../model/checkoutModel/orders');
const cartModel = require('../../model/checkoutModel/cart');
const OrderItem = require('../../model/checkoutModel/orderItem');
const VendorOrder = require('../../model/checkoutModel/vendorOrder');
const { deleteMultipleData } = require('../../utils/redisService');
exports.createOrder = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { shippingInfo, payment } = req.body;
        
        // 1. Fetch user's cart fully populated
        const cart = await cartModel.findOne({ user: req.user._id }).populate({
            path: 'cartItems',
            populate: [
                { path: 'plant' },
                { path: 'nursery', select: 'nurseryName' }
            ]
        });

        if (!cart || cart.cartItems.length === 0) {
            throw new Error("Cart is empty");
        }

        // 2. Create base order
        const newOrder = new ordersModel({
            user: req.user._id,
            shippingInfo,
            payment,
            pricing: cart.pricing,
            overallStatus: "Processing"
        });
        await newOrder.save({ session });

        // 3. Group cart items by nursery
        const itemsByNursery = {};
        for (const item of cart.cartItems) {
            const nurseryId = item.nursery && item.nursery._id ? item.nursery._id.toString() : "UnknownNursery";
            if (!itemsByNursery[nurseryId]) {
                itemsByNursery[nurseryId] = {
                    nurseryData: item.nursery,
                    items: []
                };
            }
            itemsByNursery[nurseryId].items.push(item);
        }

        const nurseryCount = Object.keys(itemsByNursery).length;
        const deliveryFeePerNursery = cart.pricing && cart.pricing.deliveryFee ? (cart.pricing.deliveryFee / nurseryCount) : 0;
        
        const vendorOrderIds = [];

        for (const [nurseryId, nurseryGroup] of Object.entries(itemsByNursery)) {
            let subTotal = 0;
            
            // Calculate subtotal for this vendor
            for (const item of nurseryGroup.items) {
                const price = item.plant.price || 0;
                const discount = item.plant.discount || 0;
                const quantity = item.quantity || 1;
                const itemPriceAfterDiscount = price - Math.round((price * discount) / 100);
                subTotal += (itemPriceAfterDiscount * quantity);
            }

            const newVendorOrder = new VendorOrder({
                order: newOrder._id,
                nursery: nurseryId !== "UnknownNursery" ? nurseryId : null,
                pricing: {
                    subTotal: subTotal,
                    shippingFee: deliveryFeePerNursery,
                    nurseryDiscount: 0,
                    netAmountOwed: subTotal + deliveryFeePerNursery
                }
            });

            await newVendorOrder.save({ session });
            vendorOrderIds.push(newVendorOrder._id);

            const orderItemIds = [];
            for (const item of nurseryGroup.items) {
                const newItem = new OrderItem({
                    vendorOrder: newVendorOrder._id,
                    plant: item.plant._id,
                    nursery: item.nursery && item.nursery._id ? item.nursery._id : null,
                    nurseryName: item.nursery?.nurseryName || "Nursery",
                    plantName: item.plant.plantName,
                    images: item.plant.images[0],
                    price: item.plant.price,
                    discount: item.plant.discount,
                    quantity: item.quantity
                });
                await newItem.save({ session });
                orderItemIds.push(newItem._id);
            }

            newVendorOrder.orderItems = orderItemIds;
            await newVendorOrder.save({ session });
        }

        newOrder.vendorOrders = vendorOrderIds;
        const result = await newOrder.save({ session });
        await session.commitTransaction();

        const total = await ordersModel.countDocuments({ user: req.user, orderAt: { $gte: Date.now() - (3 * 30 * 24 * 60 * 60 * 1000) } });

        const info = {
            status: true,
            message: "Successfully created your order.",
            result,
            total
        };

        res.status(200).send(info);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        await session.endSession();
    }
};

//? GET /api/products?page=1&limit=10
exports.getOrderHistory = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const endDate = parseInt(req.query.endDate);
        const orderSearch = req.query.orderSearch && req.query.orderSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const skipData = (page - 1) * limit;

        let orderIdsFromSearch = [];
        if (orderSearch) {
            const OrderItem = require('../../model/checkoutModel/orderItem');
            const searchRegex = new RegExp(orderSearch, 'i');
            const matchedItems = await OrderItem.find({
                $or: [
                    { plantName: searchRegex },
                    { nurseryName: searchRegex }
                ]
            }).populate('vendorOrder');

            orderIdsFromSearch = matchedItems
                .filter(item => item.vendorOrder && item.vendorOrder.order)
                .map(item => item.vendorOrder.order.toString());
        }

        const queryObj = { user: req.user, orderAt: { $gte: endDate } };
        
        if (orderSearch) {
            const validIds = [...orderIdsFromSearch];
            if (mongoose.isValidObjectId(orderSearch)) {
                validIds.push(orderSearch);
            }
            queryObj.$or = [
                { _id: { $in: validIds } },
                { "payment.paymentMethods": { $regex: new RegExp(orderSearch, 'i') } }
            ];
        }

        const total = await ordersModel.countDocuments(queryObj);

        const result = await ordersModel.find(queryObj)
            .populate({
                path: 'vendorOrders',
                populate: {
                    path: 'orderItems'
                }
            })
            .limit(limit)
            .skip(skipData)
            .select('-payment.paymentId -shippingInfo -pricing')
            .sort({ _id: -1 });

        if (!result) {
            const error = new Error("Order not found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Your Order History.",
            result,
            total
        };

        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};


exports.getOrderById = async (req, res, next) => {
    try {
        const _id = req.params.id;

        const result = await ordersModel.findOne({ _id, user: req.user })
            .populate({
                path: 'vendorOrders',
                populate: {
                    path: 'orderItems'
                }
            })
            .select('-payment.paymentId');

        if (!result) {
            const error = new Error("Order not found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Your Order Details.",
            result
        };
        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};

//? This route is only accessible when payments are confirmed

exports.confirmOrderPayment = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { paymentId, status } = req.body;

        if (!paymentId || !status || status !== 'succeeded') {
            const error = new Error("You are not allowed to access this route.");
            error.statusCode = 403;
            throw error;
        }

        const result = await ordersModel.findOneAndUpdate(
            { "payment.paymentId": paymentId, user: req.user },
            {
                $set: {
                    "payment.status": status,
                    "payment.message": "Payment Succeeded"
                }
            },
            {
                new: true,
                session
            }
        ).select('-payment.paymentId -delivery');

        if (!result) {
            const error = new Error("Order not found.");
            error.statusCode = 404;
            throw error;
        }

        const CartItem = require('../../model/checkoutModel/cartItem');
        
        // Find existing cart for user
        const existingCart = await cartModel.findOne({ user: req.user });
        
        if (existingCart) {
            // Delete all CartItems linked to this cart
            await CartItem.deleteMany({ cart: existingCart._id }, { session });
            
            // Delete the cart itself
            await cartModel.findByIdAndDelete(existingCart._id, { session });
        }
        
        // Initialize fresh cart
        const freshCart = new cartModel({ user: req.user, cartItems: [] });
        await freshCart.save({ session });

        //* CLEANUP_TASK:: REMOVE THE DATA FROM THE REDIS_DB OF THE ORDER_SESSION_DATA
        const prefix = process.env.REDIS_VERCEL_KV_DB || 'development';
        const redisKeys = [
            `${prefix}:${req.user}:${req.orderToken}:cartOrProducts`,
            `${prefix}:${req.user}:${req.orderToken}:shipping`,
            `${prefix}:${req.user}:${req.orderToken}:pricing`,
            `${prefix}:${req.user}:${req.orderToken}:payment`
        ];

        await deleteMultipleData(redisKeys);

        //* CLEANUP_TASK:: REMOVE THE ORDER_SESSION
        //? remove the order auth session
        //? Remove the cookie based authentication and implemented the Bearer authentication in the headers 
        // res.clearCookie('orderSession', {
        //     sameSite: 'none',
        //     secure: true
        // });

        await session.commitTransaction();
        const info = {
            status: true,
            message: "Payment Succeeded",
            result
        };
        res.status(200).send(info);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        await session.endSession();
    }
};

exports.getLastOrder = async (req, res, next) => {
    try {
        const result = await ordersModel.find({ user: req.user })
            .sort({ _id: -1 })
            .populate({
                path: 'vendorOrders',
                populate: {
                    path: 'orderItems'
                }
            })
            .limit(1)
            .select('-payment.paymentId -shippingInfo -pricing');

        if (!result) {
            const error = new Error("Order not found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Your Last Order.",
            result
        };

        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
}