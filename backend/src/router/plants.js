const express = require('express');
const { uploadImages, deleteFolder, deleteResourcesByPrefix } = require('../cloudinary/uploadImages');

const plantsModel = require('../model/plants');
const auth = require('../middleware/auth');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.use(auth);

router.route('/plants')
    .post(async (req, res) => {
        try {
            if (req.user.toString() === req.body.user && req.role.includes('seller')) {
                if (req.nursery.toString() === req.body.nursery) {
                    const images = [req.files.image_0, req.files.image_1, req.files.image_2];

                    const plant = new plantsModel(req.body);

                    const resultImage = await uploadImages(images, {
                        folder: `PlantSeller/user/${req.user}/nursery/${req.nursery}/plants/${plant._id}`,
                        width: 550,
                        height: 650,
                        crop: "fit"
                    });

                    plant.images = resultImage.map((elem) => {
                        return {
                            public_id: elem.public_id,
                            url: elem.secure_url
                        }
                    });

                    plant.imageList = resultImage.map((elem) => {
                        return {
                            public_id: elem.public_id,
                            url: elem.url
                        }
                    });

                    await plant.save();

                    const info = {
                        status: true,
                        message: "New plant added successfully.",
                    }
                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Authentication failed.",
                    }

                    res.status(401).send(info);
                }
            } else {
                const info = {
                    status: false,
                    message: "Authentication failed.",
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
    .get(async (req, res) => {
        try {
            if (req.user && req.role.includes('seller')) {

                const result = await plantsModel.find({ user: req.user, nursery: req.nursery });

                if (result.length > 0) {
                    const info = {
                        status: true,
                        message: "Plants Found successfully.",
                        result
                    }

                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "No Plant found."
                    }

                    res.status(404).send(info);
                }
            } else {
                const info = {
                    status: false,
                    message: "Authentication failed.",
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


router.route("/plants/:id").get(async (req, res) => {
    try {
        if (req.user && req.role.includes('seller')) {

            const _id = req.params.id;

            const result = await plantsModel.findOne({ user: req.user, nursery: req.nursery, _id });

            if (result) {
                const info = {
                    status: true,
                    message: "Plant Found successfully.",
                    result
                }

                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "No Plant found."
                }

                res.status(404).send(info);
            }
        } else {
            const info = {
                status: false,
                message: "Authentication failed.",
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
        if (req.user && req.role.includes('seller')) {
            const _id = req.params.id;
            const result = await plantsModel.findOneAndUpdate({ user: req.user, nursery: req.nursery, _id }, req.body, {
                new: true
            });

            if (result) {
                const info = {
                    status: true,
                    message: "Plant updated successfully.",
                    result
                }

                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "No Plant found."
                }

                res.status(404).send(info);
            }
        } else {
            const info = {
                status: false,
                message: "Authentication failed.",
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
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        if (req.user && req.role.includes('seller')) {
            const _id = req.params.id;
            const result = await plantsModel.findOneAndDelete({ user: req.user, nursery: req.nursery, _id }, { session });

            if (result) {
                await deleteResourcesByPrefix(`PlantSeller/user/${req.user}/nursery/${req.nursery}/plants/${_id}`, {
                    type: 'upload',
                    resource_type: 'image',
                    invalidate: true
                });

                await deleteFolder(`PlantSeller/user/${req.user}/nursery/${req.nursery}/plants/${_id}`);

                await session.commitTransaction();

                const info = {
                    status: true,
                    message: "Plant deleted successfully.",
                }

                res.status(200).send(info);

            } else {
                await session.abortTransaction();

                const info = {
                    status: false,
                    message: "No Plant found."
                }

                res.status(404).send(info);
            }
        } else {
            const info = {
                status: false,
                message: "Authentication failed.",
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
})

module.exports = router;