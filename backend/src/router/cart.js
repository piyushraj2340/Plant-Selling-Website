const express = require("express");

const cartModel = require('../model/cart');

const router = express.Router();

const auth = require('../middleware/auth');

router.use(auth);

router.route('/carts')
    .post(async (req, res) => {
        try {
            if (req.user) {

                const cart = req.body;
                cart.user = req.user; // update this after making the center data storage of user using redux

                const newCart = new cartModel(cart)
                const result = await newCart.save().then(t => t.populate(["plant", "nursery"])).then(t => t);

                const info = {
                    status: true,
                    message: "New Plant added to cart",
                    result
                }

                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Authentication Failed"
                }
                res.status(401).send(info);
            }
        } catch (error) {
            const info = {
                status: false,
                message: error.message
            }
            console.log(error);
            res.status(500).send(info);
        }
    }).get(async (req, res) => {
        try {
            if (req.user) {
                const result = await cartModel.find({ user: req.user }).populate('plant').populate('nursery');

                if (result.length > 0) {
                    const info = {
                        status: true,
                        message: "List of cart items.",
                        result
                    }

                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Empty Cart List"
                    }
                    res.status(404).send(info);
                }

            } else {
                const info = {
                    status: false,
                    message: "Authentication Failed"
                }
                res.status(401).send(info);
            }
        } catch (error) {
            const info = {
                status: false,
                message: error.message
            }
            console.log(error);
            res.status(500).send(info);
        }
    });

router.route('/carts/:id')
    .get(async (req, res) => {
        try {
            if (req.user) {
                const _id = req.params.id;
                const result = await cartModel.findOne({ _id }).populate('plant').populate('nursery');

                if (result) {
                    const info = {
                        status: true,
                        message: "Cart with id retrieved successfully",
                        result
                    }
                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "cart not found"
                    }
                    res.status(404).send(info);
                }
            } else {
                const info = {
                    status: false,
                    message: "Authentication Failed"
                }
                res.status(401).send(info);
            }
        } catch (error) {
            const info = {
                status: false,
                message: error.message
            }
            console.log(error);
            res.status(500).send(info);
        }
    }).patch(async (req, res) => {
        try {
            if (req.user) {
                const _id = req.params.id;

                const result = await cartModel.findByIdAndUpdate(_id, req.body, {
                    new: true
                }).populate('plant').populate('nursery');

                if (result) {
                    const info = {
                        status: true,
                        message: "Cart Edited successfully",
                        result
                    }
                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Cart not found"
                    }
                    res.status(404).send(info);
                }
            } else {
                const info = {
                    status: false,
                    message: "Authentication Failed"
                }
                res.status(401).send(info);
            }
        } catch (error) {
            const info = {
                status: false,
                message: error.message
            }
            console.log(error);
            res.status(500).send(info);
        }
    }).delete(async (req, res) => {
        try {
            if (req.user) {
                const _id = req.params.id;

                const result = await cartModel.findByIdAndDelete(_id);

                if (result) {
                    const info = {
                        status: true,
                        message: "Cart Deleted successfully",
                        result
                    }
                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Cart not found"
                    }
                    res.status(404).send(info);
                }
            } else {
                const info = {
                    status: false,
                    message: "Authentication Failed"
                }
                res.status(401).send(info);
            }
        } catch (error) {
            const info = {
                status: false,
                message: error.message
            }
            console.log(error);
            res.status(500).send(info);
        }
    });

router.get('/isPlantsAddedToCart/:plantId', auth, async (req, res) => {
    try {
        if (req.user) {
            const plant = req.params.plantId;

            const result = await cartModel.findOne({ user: req.user, plant });

            if (result) {
                const info = {
                    status: true,
                    message: "Product is in the cart.",
                    result
                }
                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Product is not added in the cart."
                }
                res.status(404).send(info);
            }
        } else {
            const info = {
                status: false,
                message: "Authentication Failed."
            }
            res.status(401).send(info);
        }
    } catch (error) {
        const info = {
            status: false,
            message: error.message
        }
        console.log(error);
        res.status(500).send(info);
    }
})

module.exports = router;