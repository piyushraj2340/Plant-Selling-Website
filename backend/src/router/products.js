const express = require('express');

const plantsModel = require('../model/plants');
const nurseryModel = require('../model/nursery');

const router = express.Router();

router.post('/plants', async (req, res) => {
    try {
        const result = await plantsModel.find();

        const info = {
            status: true,
            message: "Data of all products!...",
            result
        }
        res.status(200).send(info);
    } catch (err) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }
        console.log(err);
        res.status(400).send(info);
    }
});
router.post('/plant/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const data = await plantsModel.findOne({ _id });

        await data.increaseVisit();

        const nursery = await nurseryModel.findOne({ _id: data.nursery }).select({ nurseryName: 1 });

        const info = {
            status: true,
            message: "Data of Product",
            result: {
                data,
                nurseryName: nursery.nurseryName
            },
        }
        res.status(200).send(info);

    } catch (err) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }
        console.log(err);
        res.status(400).send(info);
    }
});

router.post('/plantsByCategory/:id', async (req, res) => {
    try {
        const category = req.params.id;
        const result = await plantsModel.find({ category });

        const info = {
            status: true,
            message: `Data For ${category}`,
            result
        }

        res.status(200).send(info);

    } catch (err) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }
        console.log(err);
        res.status(404).send(info);
    }
});

module.exports = router;