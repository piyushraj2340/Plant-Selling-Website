const express = require("express");

const cartModel = require('../model/cart');
const plantModel = require('../model/plants');
const nurseryModel = require('../model/nursery');

const router = express.Router();

const auth = require('../middleware/auth');

router.use(auth);

router.route('/set')
    .post(async (req, res) => {
        try {
            if (req._id) {
                const { plantId, quantity, addedAtPrice } = req.body;
                const result = await plantModel.findOne({ _id: plantId }).select({ _id: 1, userId: 1 });

                if (result && result.userId.toString() !== req._id.toString()) {
                    const cart = await cartModel.findOne({ userId: req._id, "cartList.plantId": { $not: { $eq: plantId } } });

                    if (cart) {
                        cart.cartList.push({ plantId, quantity, addedAtPrice });
                        await cart.save();

                        const info = {
                            status: true,
                            message: "Plant added to cart successfully!...",
                            cartLength: cart.cartList.length
                        }

                        res.status(201).send(info);
                    } else {
                        const info = {
                            status: false,
                            message: "Plant already added into the cart!...",
                        }
                        res.status(405).send(info);
                    }

                } else {
                    const info = {
                        status: false,
                        message: "You are not authorized to add this plant to cart!..."
                    }

                    res.status(405).send(info);
                }
            } else {
                const info = {
                    status: false,
                    message: "Authentication Failed!..."
                }
                res.status(401).send(info);
            }
        } catch (error) {
            const info = {
                status: false,
                message: "Something Went Wrong!..."
            }
            console.log(error);
            res.status(500).send(info);
        }
    })
    .patch(async (req, res) => {
        try {
            if (req._id) {
                const { plantId, quantity, addedAtPrice } = req.body;

                const plant = await plantModel.findOne({ _id: plantId }).select({ _id: 1, userId: 1 });

                if (plant && plant.userId.toString() !== req._id.toString()) {
                    const result = await cartModel.findOneAndUpdate({ userId: req._id, "cartList.plantId": plantId }, {
                        $set: {
                            "cartList.$.quantity": quantity,
                            "cartList.$.addedAtPrice": addedAtPrice,
                            "cartList.$.addedAt": Date.now()
                        }
                    },
                        { returnOriginal: false }
                    );

                    if (result) {
                        const info = {
                            status: true,
                            message: "Cart Updated Successfully!...",
                            cartLength: result.cartList.length
                        }
                        res.status(200).send(info);
                    } else {
                        const info = {
                            status: false,
                            message: "Plant not added into the cart!...",
                        }
                        res.status(405).send(info);
                    }


                } else {
                    const info = {
                        status: false,
                        message: "You are not authorized to update this cart!..."
                    }
                    res.status(405).send(info);
                }
            } else {
                const info = {
                    status: false,
                    message: "Authentication Failed!..."
                }
                res.status(401).send(info);
            }
        } catch (error) {
            const info = {
                status: false,
                message: "Something Went Wrong!..."
            }
            console.log(error);
            res.status(500).send(info);
        }
    })
    .delete(async (req, res) => {
        try {
            if (req._id) {
                const { plantId } = req.body;
                const plant = await plantModel.findOne({ _id: plantId }).select({ _id: 1, userId: 1 });

                if (plant && plant.userId.toString() !== req._id.toString()) {
                    const result = await cartModel.findOneAndUpdate({ userId: req._id, "cartList.plantId": plantId }, {
                        $pull: {
                            "cartList": {
                                "plantId": plantId
                            }
                        }
                    },
                        { returnOriginal: false }
                    );

                    if (result) {
                        const info = {
                            status: true,
                            message: "Cart Deleted Successfully!...",
                            cartLength: result.cartList.length
                        }

                        res.status(200).send(info)
                    } else {
                        const info = {
                            status: false,
                            message: "Plant not added into the Cart or Cart list is empty!...",
                        }

                        res.status(405).send(info)
                    }
                } else {
                    const info = {
                        status: false,
                        message: "You are not authorized to delete this cart!..."
                    }
                    res.status(405).send(info);
                }
            } else {
                const info = {
                    status: false,
                    message: "Authentication Failed!..."
                }
                res.status(401).send(info);
            }
        } catch (error) {
            const info = {
                status: false,
                message: "Something Went Wrong!..."
            }
            console.log(error);
            res.status(500).send(info);
        }
    });

router.post('/get', async (req, res) => {
    try {
        if (req._id) {
            const cart = await cartModel.findOne({ userId: req._id }).select({ cartList: 1 });

            if (cart) {
                if (cart.cartList.length > 0) {
                    const result = await Promise.all(
                        cart.cartList.map(async (elem) => {
                            const plant = await plantModel.findOne({ _id: elem.plantId }).select({ nurseryId: 1, plantName: 1, price: 1, discount: 1 });

                            const nursery = await nurseryModel.findOne({ _id: plant.nurseryId }).select({ nurseryName: 1 });

                            return ({
                                plantId: elem.plantId,
                                quantity: elem.quantity,
                                addedAtPrice: elem.addedAtPrice,
                                addedAt: elem.addedAt,
                                nurseryId: plant.nurseryId,
                                plantName: plant.plantName,
                                price: plant.price,
                                discount: plant.discount,
                                nurseryName: nursery.nurseryName,
                            })
                        })
                    );

                    const info = {
                        status: true,
                        message: "Cart Retrieved Successfully!...",
                        result,
                        cartLength: cart.cartList.length
                    }
                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Cart list is empty!...",
                    }
                    res.status(405).send(info);
                }
            } else {
                const info = {
                    status: false,
                    message: "Cart record not found!..."
                }
                res.status(405).send(info);
            }
        } else {
            const info = {
                status: false,
                message: "Authentication Failed!..."
            }
            res.status(401).send(info);
        }
    } catch (error) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }
        console.log(error);
        res.status(500).send(info);
    }
});

router.post('/isAddedToCart', async (req, res) => {
    try {
        if (req._id) {
            const { plantId } = req.body;
            const result = await cartModel.findOne({ userId: req._id, "cartList.plantId": plantId });

            if (result) {
                let data = result.cartList.find(elem => {
                    if (elem.plantId.toString() === plantId) {
                        return {
                            plantId: elem.plantId,
                            quantity: elem.quantity,
                            addedAtPrice: elem.addedAtPrice,
                            addedAt: elem.addedAt,
                        }
                    }
                });

                const info = {
                    status: true,
                    message: "Plant Already Added into the cart!...",
                    result: data,
                    cartLength: result.cartList.length
                }
                res.status(200).send(info);

            } else {
                const info = {
                    status: false,
                    message: "Plant Not Added into the cart!...",
                }
                res.status(200).send(info);
            }

        } else {
            const info = {
                status: false,
                message: "Authentication Failed!..."
            }
            res.status(401).send(info);
        }
    } catch (error) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }
        console.log(error);
        res.status(500).send(info);
    }
})

module.exports = router;