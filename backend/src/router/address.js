const router = require('express').Router();

const addressModel = require('../model/address');

const auth = require('../middleware/auth');
const user = require('../model/user');
const { default: mongoose } = require('mongoose');
router.use(auth);

router.route('/address')
    .post(async (req, res) => {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            if (req.user.toString() === req.body.user) {

                if (req.body.setAsDefault) {
                    await addressModel.updateMany({ user: req.user, setAsDefault: true }, {
                        $set: {
                            setAsDefault: false
                        }
                    }, { session })
                }

                const newAddress = new addressModel(req.body);
                await newAddress.save({ session });
                await session.commitTransaction();

                const info = {
                    status: true,
                    message: "New Address Added Successfully",
                    result: newAddress
                }

                res.status(200).send(info);
            } else {
                await session.abortTransaction();
                const info = {
                    status: false,
                    message: "Authentication Failed"
                }
                res.status(401).send(info);
            }
        } catch (error) {
            await session.abortTransaction();
            const info = {
                status: false,
                message: error.message
            }
            console.log(error);
            res.status(500).send(info);
        } finally {
            await session.endSession();
        }
    }).get(async (req, res) => {
        try {
            if (req.user) {
                const result = await addressModel.find({ user: req.user });

                if (result.length > 0) {
                    // sort the address such that the default address comes at zero index 
                    result.sort((a, b) => {
                        if (a.setAsDefault === true) return -1;
                        if (b.setAsDefault === true) return 1;
                    })

                    const info = {
                        status: true,
                        message: "List of address",
                        result
                    }
                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Empty Address List"
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


router.route('/address/:id')
    .get(async (req, res) => {
        try {
            if (req.user) {
                const _id = req.params.id;
                const result = await addressModel.findOne({ _id });

                if (result) {
                    const info = {
                        status: true,
                        message: "Address with id retrieved successfully",
                        result
                    }
                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Address not found"
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
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            if (req.user) {
                const _id = req.params.id;

                if (req.body.setAsDefault === true) {
                    await addressModel.updateMany({ user: req.user, setAsDefault: true }, {
                        $set: {
                            setAsDefault: false
                        }
                    }, { session });
                }

                const result = await addressModel.findByIdAndUpdate(_id, req.body, {
                    new: true,
                    session
                });

                if (result) {
                    await session.commitTransaction();

                    const info = {
                        status: true,
                        message: "Address Edited successfully",
                        result
                    }
                    res.status(200).send(info);
                } else {
                    await session.abortTransaction();

                    const info = {
                        status: false,
                        message: "Address not found"
                    }
                    res.status(404).send(info);
                }
            } else {
                await session.abortTransaction();

                const info = {
                    status: false,
                    message: "Authentication Failed"
                }
                res.status(401).send(info);
            }
        } catch (error) {
            await session.abortTransaction();

            const info = {
                status: false,
                message: error.message
            }
            console.log(error);
            res.status(500).send(info);
        } finally {
            await session.endSession();
        }
    }).delete(async (req, res) => {
        try {
            if (req.user) {
                const _id = req.params.id;

                const result = await addressModel.findByIdAndDelete(_id);

                if (result) {
                    const info = {
                        status: true,
                        message: "Address Deleted successfully",
                        result
                    }
                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Address not found"
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

router.get('/default/address', auth, async (req, res) => {
    try {
        if (req.user) {
            const result = await addressModel.findOne({ user: req.user, setAsDefault: true});

            if (result) {
                const info = {
                    status: true,
                    message: "Address with id retrieved successfully",
                    result
                }
                res.status(200).send(info);
            } else {

                const result = await addressModel.find({ user: req.user });

                if (result.length > 0) {
                    const info = {
                        status: true,
                        message: "Address with id retrieved successfully",
                        result: result[0]
                    }
                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Address not found"
                    }
                    res.status(404).send(info);
                }
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
})

module.exports = router;
