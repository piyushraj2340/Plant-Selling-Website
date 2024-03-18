const cartModel = require('../model/cart');

exports.addToCart = async (req, res, next) => {
    try {
        const newCart = new cartModel(req.body);
        const result = await newCart.save().then(t => t.populate(["plant", "nursery"])).then(t => t);

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