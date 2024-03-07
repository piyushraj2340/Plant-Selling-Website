const express = require('express');
const router = express.Router();

const nurseryStore = require('../model/nurseryStore');
const { uploadImage, deleteResourcesByPrefix, deleteFolder } = require('../cloudinary/uploadImages');
const auth = require('../middleware/auth');


router.route('/store')
    .post(async (req, res) => {
        try {
            if (req.user.toString() === req.body.user && req.nursery.toString() === req.body.nursery) {

                const newNurseryStoreSection = new nurseryStore(req.body);
                await newNurseryStoreSection.save();

                if (newNurseryStoreSection) {
                    const info = {
                        status: true,
                        message: "New Section of Store is added successfully.",
                        result: newNurseryStoreSection
                    }

                    res.status(201).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Failed to add new section to store."
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
    }).get(async (req, res) => {
        try {
            if (req.user && req.nursery) {

                const result = await nurseryStore.find({ user: req.user, nursery: req.nursery });
                if (result) {
                    const info = {
                        status: true,
                        message: "List of all nursery store data",
                        result
                    }

                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Data Not Found."
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
    });

router.route('/store/:id')
    .get(async (req, res) => {
        try {
            if (req.user && req.nursery) {
                const _id = req.params.id;

                const result = await nurseryStore.findById(_id);

                if (result) {
                    const info = {
                        status: true,
                        message: "Fetched nursery Store section data.",
                        result
                    }

                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "No Data Found.",
                        result
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
            const _id = req.params.id;
            const { user, nursery, status, tabName, renders } = req.body;

            if (req.user.toString() === req.body.user && req.nursery.toString() === req.body.nursery) {
                const result = await nurseryStore.findOneAndUpdate({ _id, user: req.user, nursery: req.nursery }, {
                    $set: {
                        nursery,
                        status,
                        user,
                        status,
                        renders,
                        tabName
                    }
                }, {
                    new: true
                });

                if (result) {
                    const info = {
                        status: true,
                        message: "Nursery Store Section Data is updated.",
                        result
                    }

                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Data not found."
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
    }).delete(async (req, res) => {
        try {
            if (req.user && req.nursery) {
                const _id = req.params.id;
                const result = await nurseryStore.findOneAndDelete({ _id, nursery: req.nursery, user: req.user });

                if (result) {

                    await deleteResourcesByPrefix(`PlantSeller/user/${req.user}/nursery/${req.nursery}/store/${_id}`, {
                        type: 'upload',
                        resource_type: 'image',
                        invalidate: true
                    })

                    await deleteFolder(`PlantSeller/user/${req.user}/nursery/${req.nursery}/store/${_id}`);

                    const info = {
                        status: true,
                        message: "Deleted Nursery Store Section Data.",
                        result
                    }

                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "No Data Found.",
                        result
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
    });


router.post('/store/images/:id', auth, async (req, res) => {
    try {
        if (req.user && req.nursery) {
            if (req.files) {
                const _id = req.params.id;
                const image = req.files[_id];

                const { tabId, rendersId } = req.body;

                const upload = await uploadImage(image, {
                    folder: `PlantSeller/user/${req.user}/nursery/${req.nursery}/store/${tabId}/${rendersId}`,
                });

                const { public_id, secure_url } = upload;

                console.log(upload);

                const result = await nurseryStore.updateOne({ "renders.images._id": _id }, {
                    $set: {
                        "renders.$[outer].images.$[inner]": { public_id, url: secure_url },
                    }
                }, {
                    arrayFilters: [
                        { 'outer._id': rendersId },
                        { 'inner._id': _id }
                    ],
                });

                if (result) {
                    const info = {
                        status: true,
                        message: "Image updated successfully.",
                        result: {
                            tabId,
                            rendersId,
                            imageId: _id,
                            image: {
                                public_id,
                                url: secure_url
                            }
                        }
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
})


module.exports = router;