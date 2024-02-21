const express = require('express');

const plantsModel = require('../model/plants');
const router = express.Router();

router.get('/plants', async (req, res) => {
    try {
        const result = await plantsModel.find();

        const info = {
            status: true,
            message: "Data of all products",
            result
        }
        res.status(200).send(info);
    } catch (error) {
        const info = {
            status: false,
            message: error.message
        }
        console.log(error);
        res.status(400).send(info);
    }
});
router.get('/plant/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const result = await plantsModel.findOne({ _id }).populate("nursery"); // only select the particular products that we needs in frontend 

        await result.increaseVisit();

        const info = {
            status: true,
            message: "Data of Product",
            result
        }
        res.status(200).send(info);

    } catch (error) {
        const info = {
            status: false,
            message: error.message
        }
        console.log(error);
        res.status(400).send(info);
    }
});

router.get('/plantsByCategory/:id', async (req, res) => {
    try {
        const category = req.params.id;
        const result = await plantsModel.find({ category });

        const info = {
            status: true,
            message: `Data For ${category}`,
            result
        }

        res.status(200).send(info);

    } catch (error) {
        const info = {
            status: false,
            message: error.message
        }
        console.log(error);
        res.status(404).send(info);
    }
});

module.exports = router;