const express = require('express');

const plantsModel = require('../model/plants');

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
        const result = await plantsModel.findOne({ _id });

        await result.increaseVisit();

        const info = {
            status: true,
            message: "Data of Product",
            result
        }
        console.log(info);
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