const express = require('express');
const router = express.Router();

const nurseryModel = require('../model/nursery');
const plantModel = require('../model/plants');

const { uploadImage } = require('../cloudinary/uploadImages');

const auth = require('../middleware/auth');
router.use(auth);

router.route('/set')
    .post(async (req, res) => {
        try {
            if (req._id) {
                const addNursery = new nurseryModel(req.body);
                await addNursery.save();

                const info = {
                    status: true,
                    message: "Nursery Listed Successfully!...",
                }

                res.status(201).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Your Are Not Authenticated To Add Nursery!..."
                }
                res.status(401).send(info);
            }


        } catch (err) {
            const info = {
                status: false,
                message: "Something Went Wrong!..."
            }
            console.log(err);
            res.status(400).send(info);
        }
    })
    .patch(async (req, res) => {
        try {
            if (req._id) {
                const { nurseryName, nurseryEmail, nurseryPhone, address, pinCode, city, state } = req.body;

                const result = await nurseryModel.findOneAndUpdate({ _id: req.body.nurseryId, userId: req._id }, {
                    $set: {
                        nurseryName,
                        nurseryEmail,
                        nurseryPhone,
                        address,
                        pinCode,
                        city,
                        state
                    }
                },
                    { returnOriginal: false }
                );

                if (result) {
                    const info = {
                        status: true,
                        message: "Nursery Updated Successfully!...",
                        result
                    }
                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Nursery that you want to update is not found!..."
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
    //need to test
    .delete(async (req, res) => {
        try {
            if (req._id) {
                const result = await nurseryModel.findOneAndDelete({ _id: req.body.nurseryId, userId: req._id });
                const deletePlants = await plantModel.deleteMany({ nurseryId: req.body.nurseryId, userId: req._id });


                if (result && deletePlants) {
                    const info = {
                        status: true,
                        message: "Nursery Deleted Successfully!...",
                    }
                    res.status(204).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Nursery that you want to delete is not found!..."
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

router.post('/set/image', async (req, res) => {
    try {
        if (req._id) {
            if (req.files) {
                
                let image;
                if(req.body.type === "avatar") {
                    image = req.files.avatar;
                } else if(req.body.type === "cover") {
                    image = req.files.cover;
                } else {
                    throw new Error("Invalid File Upload!...");
                }

                const upload = await uploadImage(image, {
                    folder: `PlantSeller/user/${req._id}/nursery/${req.body.nurserId}/${req.body.type}`,
                });


                const { public_id, url } = upload;

                image = {
                    public_id,
                    url
                }

                const result = await nurseryModel.findOneAndUpdate({ _id: req.body.nurserId, userId: req._id }, {
                    $set: {
                        [req.body.type]: image
                    }
                },
                    { returnOriginal: false }
                );

                if (result) {
                    const info = {
                        status: true,
                        message: "Nursery Avatar Is Uploaded Successfully!...",
                        result
                    }

                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Nursery Avatar That You Want To Update Is Not Found!..."
                    }
                    res.status(405).send(info);
                }

            } else {
                const info = {
                    status: false,
                    message: "Files Not Found To Upload!..."
                }

                res.status(400).send(info);
            }
        } else {
            const info = {
                status: false,
                message: "Authentication Failed!...",
            }

            res.status(401).send(info);
        }
    } catch (error) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }
        console.log(error);
        res.status(400).send(info);
    }
}).delete(async (req, res) => {
    try {
        if (req._id) {
            const result = await nurseryModel.findOneAndUpdate({ _id: req.body.nurserId, userId: req._id }, {
                $set: {
                    avatar: null
                }
            },
                { returnOriginal: false }
            );

            if (result) {
                const info = {
                    status: true,
                    message: "Nursery Avatar Is Removed Successfully!..."
                }

                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Nursery Avatar That You Want To Remove Is Not Found!..."
                }
                res.status(405).send(info);
            }

        } else {
            const info = {
                status: false,
                message: "Authentication Failed!...",
            }

            res.status(401).send(info);
        }
    } catch (error) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }
        console.log(err);
        res.status(400).send(info);
    }
});




router.route('/get')
    .post(async (req, res) => {
        try {
            if (req._id) {

                const result = await nurseryModel.findOne({ userId: req._id, _id: req.body.nurseryId });

                if (result) {
                    const info = {
                        status: true,
                        message: "Showing Nursery Profile Data!...",
                        result
                    }
                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Nursery Data Not Found!...",
                    }

                    res.status(404).send(info);
                }
            } else {
                const info = {
                    status: false,
                    message: "Authentication Failed!...",
                }

                res.status(401).send(info);
            }
        } catch (err) {
            const info = {
                status: false,
                message: "Something Went Wrong!..."
            }
            console.log(err);
            res.status(400).send(info);
        }
    });

//public routes
// need to test
router.route('/getById/:id')
    .post(async (req, res) => {
        try {
            const _id = req.params.id;

            const result = await nurseryModel.findOne({ _id: id });

            if (result) {
                const info = {
                    status: true,
                    message: "Showing Public Nursery Profile Data!...",
                    result
                }
                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Nursery Data Not Found!...",
                }

                res.status(404).send(info);
            }

        } catch (err) {
            const info = {
                status: false,
                message: "Something Went Wrong!..."
            }
            console.log(err);
            res.status(400).send(info);
        }
    });

router.post('/get/isListed', async (req, res) => {
    try {
        if (req._id) {

            const result = await nurseryModel.findOne({ userId: req._id }).select({ userId: 1 });

            if (result) {
                const info = {
                    status: true,
                    message: "Nursery Registered!...",
                    result
                }

                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Nursery Not Registered!...",
                }

                res.status(404).send(info);
            }
        } else {
            const info = {
                status: false,
                message: "Authentication Failed!...",
            }

            res.status(401).send(info);
        }
    } catch (err) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }
        console.log(err);
        res.status(400).send(info);
    }
});


module.exports = router;