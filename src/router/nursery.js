const express = require('express');

const nurseryModel = require('../model/nursery');
const plantsModel = require('../model/plants');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/add', async (req, res) => {
    try {
        const addNursery = new nurseryModel(req.body);
        await addNursery.save();

        const info = {
            status: true,
            message: "Nursery Listed Successfully!...",
        }

        res.status(201).send(info);

    } catch (err) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }
        console.log(err);
        res.status(400).send(info);
    }
});

router.post('/isNurseryListed', async (req, res) => {
    try {
        if (req._id) {
            const userId = req._id;
            const result = await nurseryModel.findOne({ userId }).select({ userId: 1 });

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
});


router.route('/profile')
    .post(async (req, res) => {
        try {
            if (req._id) {
                const result = await nurseryModel.findOne({ userId: req._id });

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
                        message: "Authentication failed",
                    }

                    res.status(401).send(info);
                }
            } else {
                const info = {
                    status: false,
                    message: "Authentication failed",
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
    });;


router.route('/plant')
    .post(async (req, res) => {
        try {
            if (req._id) {
                const result = await nurseryModel.findOne({ userId: req._id }).select({ _id: 1 });
                if (result) {
                    const plant = new plantsModel(req.body);
                    const result = await plant.save();

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