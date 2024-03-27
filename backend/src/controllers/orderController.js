const ordersModel = require('../model/orders');

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
        const result = await ordersModel.find({ user: req.user });

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

        const result = await ordersModel.findOne({ _id, user: req.user });

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


exports.updateOrder = async (req, res, next) => {
    try {
        const _id = req.params.id;

        const result = await ordersModel.findOneAndUpdate({ _id, user: req.user }, req.body, {
            new: true
        });

        if (!result) {
            const error = new Error("Order not Found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Successfully Updated Your order.",
            result
        };
        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};
