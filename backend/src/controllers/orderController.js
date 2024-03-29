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

        const info = {
            status: true,
            message: "Successfully created your order.",
            result
        };

        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};


exports.getOrderHistory = async (req, res, next) => {
    try {
        const result = await ordersModel.find({ user: req.user }).select('-payment.paymentId -delivery').sort({ _id: -1 });

        if (!result) {
            const error = new Error("Order not found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Your Order History.",
            result
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
            `${process.env.REDIS_VERCEL_KV_DB}:${req.user}:cartOrProducts`,
            `${process.env.REDIS_VERCEL_KV_DB}:${req.user}:shipping`,
            `${process.env.REDIS_VERCEL_KV_DB}:${req.user}:pricing`,
            `${process.env.REDIS_VERCEL_KV_DB}:${req.user}:payment`
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


// exports.confirmOrderPayment = async (req, res, next) => {
//     const session = await mongoose.startSession();
//     try {
//         session.startTransaction();

//         const { paymentId, status } = req.body;

//         if (!paymentId || !status || status !== 'succeeded') {
//             const error = new Error("You Are not allowed to access this route.");
//             error.statusCode = 403;
//             throw error;
//         }

//         const result = await ordersModel.findOneAndUpdate({ "payment.paymentId": paymentId, user: req.user }, {
//             $set: {
//                 "payment.status": status,
//                 "payment.message": "Payment Succeeded"
//             }
//         }, {
//             new: true,
//             session
//         }).select('-payment.paymentId -delivery');


//         if (!result) {
//             const error = new Error("Order not Found.");
//             error.statusCode = 404;
//             throw error;
//         }


//         //* CLEANUP_TASK:: REMOVE ALL THE MATCHING THE CART DATA FROM THE DB
//         result.orderItems.forEach(async (items) => {
//             const deleteCartInfo = await cartModel.findOneAndDelete({ plant: items.plant, user: req.user }, { session });

//             if (!deleteCartInfo) {
//                 const error = new Error("cart not Found.");
//                 error.statusCode = 404;
//                 throw error;
//             }
//         });

//         //* CLEANUP_TASK:: REMOVE THE DATA FROM THE REDIS_DB OF THE ORDER_SESSION_DATA :: CART_INFORMATION
//         await kv.json.del(`${process.env.REDIS_VERCEL_KV_DB}:${req.user}:cartOrProducts`);

//         //* CLEANUP_TASK:: REMOVE THE DATA FROM THE REDIS_DB OF THE ORDER_SESSION_DATA :: SHIPPING_INFORMATION
//         await kv.json.del(`${process.env.REDIS_VERCEL_KV_DB}:${req.user}:shipping`);

//         //* CLEANUP_TASK:: REMOVE THE DATA FROM THE REDIS_DB OF THE ORDER_SESSION_DATA :: PRICING_INFORMATION
//         await kv.json.del(`${process.env.REDIS_VERCEL_KV_DB}:${req.user}:pricing`);

//         //* CLEANUP_TASK:: REMOVE THE DATA FROM THE REDIS_DB OF THE ORDER_SESSION_DATA :: PAYMENT_INFORMATION
//         await kv.json.del(`${process.env.REDIS_VERCEL_KV_DB}:${req.user}:payment`);

//         //* CLEANUP_TASK:: REMOVE THE ORDER_SESSION
//         //? remove the order auth session
//         res.clearCookie('orderSession', {
//             sameSite: 'none',
//             secure: true
//         });

//         await session.commitTransaction();
//         const info = {
//             status: true,
//             message: "Payment Succeeded",
//             result
//         };
//         res.status(200).send(info);
//     } catch (error) {
//         await session.abortTransaction();
//         next(error);
//     } finally {
//         await session.endSession();
//     }
// };
