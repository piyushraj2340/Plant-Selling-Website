// const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const nurseryModel = require('../model/nursery');
const userModel = require('../model/user');
const plantModel = require('../model/plants');

const { uploadImage, deleteFolder, deleteResourcesByPrefix } = require('../cloudinary/uploadImages');

const auth = require('../middleware/auth');
const { default: mongoose } = require('mongoose');
const nurseryStores = require('../model/nurseryStore');
router.use(auth);

router.route('/profile')
    .post(async (req, res) => {
        // creating the atomic unit process 
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            if (req.user.toString() === req.body.user && !req.role.includes('seller')) {
                const addNursery = new nurseryModel(req.body);
                const updateUserRole = await userModel.findByIdAndUpdate({ _id: req.user }, {
                    $push: {
                        role: "seller"
                    }
                }, {
                    new: true,
                    session
                });

                if (updateUserRole && updateUserRole.role.includes("seller")) {
                    await addNursery.save({ session });
                    await session.commitTransaction();

                    const info = {
                        status: true,
                        message: "Nursery Listed Successfully.",
                        result: addNursery
                    }

                    res.status(200).send(info);

                } else {

                    await session.abortTransaction();

                    const info = {
                        status: false,
                        message: "Nursery Listed Failure."
                    }

                    res.status(400).send(info);
                }

            } else {
                const info = {
                    status: false,
                    message: "Authentication Failed."
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
            if (req.user && req.role.includes('seller')) {
                const result = await nurseryModel.findOne({ user: req.user, _id: req.nursery });

                if (result) {
                    const info = {
                        status: true,
                        message: "Nursery detail retrieved.",
                        result
                    }

                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Nursery detail not found."
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
    }).patch(async (req, res) => {
        try {
            if (req.user && req.role.includes("seller")) {

                if (req.nursery) {
                    const result = await nurseryModel.findOneAndUpdate({ user: req.user, _id: req.nursery }, req.body, {
                        new: true
                    });

                    if (result) {
                        const info = {
                            status: true,
                            message: "Nursery detail Updated.",
                            result
                        }

                        res.status(200).send(info);
                    } else {
                        const info = {
                            status: false,
                            message: "Nursery detail not found."
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
    }).delete(async (req, res) => {

        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            if (req.user && req.role.includes("seller") && req.nursery) {
                const result = await nurseryModel.findOneAndDelete({ _id: req.nursery, user: req.user }, { session });

                if (result) {
                    const revokeUserRole = await userModel.findByIdAndUpdate({ _id: req.user }, {
                        $pull: {
                            role: 'seller'
                        }
                    }, {
                        new: true,
                        session
                    });

                    if (revokeUserRole && !revokeUserRole.role.includes("seller")) {
                        const deleteAllPlants = await plantModel.deleteMany({ user: req.user, nursery: req.nursery }, { session });

                        const deleteNurseryStore = await nurseryStores.deleteMany({user: req.user, nursery: req.nursery}, {session});

                        if (deleteAllPlants && deleteNurseryStore) {

                            await deleteResourcesByPrefix(`PlantSeller/user/${req.user}/nursery`, {
                                type: 'upload',
                                resource_type: 'image',
                                invalidate: true
                            })

                            await deleteFolder(`PlantSeller/user/${req.user}/nursery`);

                            await session.commitTransaction();

                            const info = {
                                status: true,
                                message: "Nursery deleted successfully.",
                            }

                            res.status(200).send(info);

                        } else {
                            await session.abortTransaction();

                            const info = {
                                status: false,
                                message: "Nursery deleted failed.",
                            }

                            res.status(400).send(info);
                        }

                    } else {
                        await session.abortTransaction();

                        const info = {
                            status: false,
                            message: "Nursery deleted failed.",
                        }

                        res.status(400).send(info);
                    }

                } else {
                    await session.abortTransaction();

                    const info = {
                        status: false,
                        message: "Nursery detail not found."
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
    });;

router.route('/profile/images').post(async (req, res) => {
    try {
        if (req.user) {

            if (req.files) {

                let image;
                if (req.body.type === "avatar") {
                    image = req.files.avatar;
                } else if (req.body.type === "cover") {
                    image = req.files.cover;
                } else {
                    throw new Error("Invalid File Upload.");
                }

                const upload = await uploadImage(image, {
                    folder: `PlantSeller/user/${req.user}/nursery/${req.nursery}/${req.body.type}`,
                    tags: req.body.type,
                });

                const { public_id, secure_url } = upload;


                image = {
                    public_id,
                    url: secure_url
                }

                const result = await nurseryModel.findOneAndUpdate({ user: req.user }, {
                    $set: {
                        [req.body.type]: image
                    },
                    $push: {
                        [req.body.type + "List"]: image
                    }
                }, {
                    new: true
                });

                if (result) {
                    const info = {
                        status: true,
                        message: "Image updated successfully.",
                        result
                    }

                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Failed to update image."
                    }

                    res.status(400).send(info);
                }
            } else {
                const info = {
                    status: false,
                    message: "Invalid Images to upload."
                }

                res.status(400).send(info);
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
}).get().patch().delete() // need to work on 


module.exports = router;