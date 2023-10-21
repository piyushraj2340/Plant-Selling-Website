const express = require('express');
const cloudinary = require('../cloudinary/cloudinary');
const {uploadImages} = require('../cloudinary/uploadImages');

const nurseryModel = require('../model/nursery');
const plantsModel = require('../model/plants');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.route('/set')
// need to test
    .post(async (req, res) => {
        try {
            if (req._id == req.body.userId) {
                const { _id } = await nurseryModel.findOne({ userId: req._id, _id: req.body.nurseryId }).select({ _id: 1 });

                if (_id) {
                    const images = [req.files.image_0, req.files.image_1, req.files.image_2];

                    let data = req.body;
                    const plant = new plantsModel(data);

                    const resultImage = await uploadImages(images, {
                        folder: `PlantSeller/user/${req._id}/nursery/${_id}/plants/${plant._id}`,
                        width: 550,
                        height: 650,
                        crop: "fit"
                    });

                    plant.images = resultImage.map((elem) => {
                        const image = {
                            public_id: elem.public_id,
                            url: elem.url
                        }
                        return image;
                    });

                    await plant.save();

                    const info = {
                        status: true,
                        message: "New Plant Added to Products!...",
                    }
                    res.status(201).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Not Allowed To Add New Plant!...",
                    }

                    res.status(401).send(info);
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
    })
    .patch(async (req, res) => {
        try {
            res.send("working");
        } catch (error) {
            res.send("not working");
        }
    })
    .delete(async (req, res) => {
        try {
            res.send("working");
        } catch (error) {
            res.send("not working");
        }
    });

module.exports = router;