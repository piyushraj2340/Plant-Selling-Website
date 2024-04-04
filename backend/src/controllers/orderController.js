const mongoose = require('mongoose');
const ordersModel = require('../model/orders');
const cartModel = require('../model/cart');
const { kv } = require('@vercel/kv'); //? Import the appropriate Redis client library :: TO REMOVE THE KV: DATA AFTER PAYMENT SUCCEEDED

exports.createOrder = async (req, res, next) => {
    try {
        const newOrder = new ordersModel(req.body);
        const result = await newOrder.save();

        if (!result) {
            const error = new Error("Failed to create your new order.");
            error.statusCode = 400;
            throw error;
        }

        const total = await ordersModel.countDocuments({ user: req.user, orderAt: { $gte: Date.now() - (3 * 30 * 24 * 60 * 60 * 1000) } });

        const info = {
            status: true,
            message: "Successfully created your order.",
            result,
            total
        };

        res.status(200).send(info);
    } catch (error) {
        next(error);
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

        const total = await ordersModel.countDocuments({
            user: req.user, orderAt: { $gte: endDate }, $or: [
                { _id: mongoose.isValidObjectId(orderSearch) ? orderSearch : null }, //? Search by order ID
                { "orderItems.plantName": { $regex: new RegExp(orderSearch, 'i') } }, //? Search by plant name (case-insensitive)
                { "orderItems.nurseryName": { $regex: new RegExp(orderSearch, 'i') } }, //? Search by plant name (case-insensitive)
                { "orderItems.plant": mongoose.isValidObjectId(orderSearch) ? orderSearch : null }, //? Search by plant name (case-insensitive)
                { "orderItems.nursery": mongoose.isValidObjectId(orderSearch) ? orderSearch : null }, //? Search by plant name (case-insensitive)
                { "payment.paymentMethods": { $regex: new RegExp(orderSearch, 'i') } },
            ]
        });

        const result = await ordersModel.find({
            user: req.user, orderAt: { $gte: endDate }, $or: [
                { _id: mongoose.isValidObjectId(orderSearch) ? orderSearch : null }, //? Search by order ID
                { "orderItems.plantName": { $regex: new RegExp(orderSearch, 'i') } }, //? Search by plant name (case-insensitive)
                { "orderItems.nurseryName": { $regex: new RegExp(orderSearch, 'i') } }, //? Search by plant name (case-insensitive)
                { "orderItems.plant": mongoose.isValidObjectId(orderSearch) ? orderSearch : null }, //? Search by plant name (case-insensitive)
                { "orderItems.nursery": mongoose.isValidObjectId(orderSearch) ? orderSearch : null }, //? Search by plant name (case-insensitive)
                { "payment.paymentMethods": { $regex: new RegExp(orderSearch, 'i') } },
            ]
        }).limit(limit).skip(skipData).select('-payment.paymentId -delivery -shippingInfo -pricing').sort({ _id: -1 });

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

        const result = await ordersModel.findOne({ _id, user: req.user }).select('-payment.paymentId -delivery');

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

        //* CLEANUP_TASK:: REMOVE ALL THE MATCHING THE CART DATA FROM THE DB 
        const deleteCartPromises = result.orderItems.map(async (items) => {
            const deleteCartInfo = await cartModel.findOneAndDelete(
                { plant: items.plant, user: req.user },
                { session }
            );
            if (!deleteCartInfo) {
                throw new Error("Cart not found.");
            }
        });

        await Promise.all(deleteCartPromises);

        //* CLEANUP_TASK:: REMOVE THE DATA FROM THE REDIS_DB OF THE ORDER_SESSION_DATA
        const redisKeys = [
            `${process.env.REDIS_VERCEL_KV_DB}:${req.user}:${req.orderToken}:cartOrProducts`,
            `${process.env.REDIS_VERCEL_KV_DB}:${req.user}:${req.orderToken}:shipping`,
            `${process.env.REDIS_VERCEL_KV_DB}:${req.user}:${req.orderToken}:pricing`,
            `${process.env.REDIS_VERCEL_KV_DB}:${req.user}:${req.orderToken}:payment`
        ];

        const deleteRedisPromises = redisKeys.map(async (key) => {
            await kv.json.del(key);
        });

        await Promise.all(deleteRedisPromises);

        //* CLEANUP_TASK:: REMOVE THE ORDER_SESSION
        //? remove the order auth session
        res.clearCookie('orderSession', {
            sameSite: 'none',
            secure: true
        });

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
        const result = await ordersModel.find({ user: req.user }).sort({ _id: -1 }).limit(1).select('-payment.paymentId -delivery -shippingInfo -pricing');

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