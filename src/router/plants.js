const express = require('express');

const plantsModel = require('../model/plants');

const router = express.Router();


router.route('/add')
    .post(async (req, res) => {
        try {
            const addPlants = new plantsModel(req.body);

            const result = await addPlants.save();

            const info = {
                status: true,
                message: "New Plants Added Successfully!...",
                result
            }

            res.status(201).send(info);

        } catch (err) {
            const info = {
                status: false,
                message: "Something Went Wrong!..."
            }
            res.status(404).send(info);
            console.log(err);
        }
    });

router.route('/get')
    .post(async (req, res) => {
        try {
            const result = await plantsModel.find();

            console.log(result);

            const info = {
                status: true,
                message: "Data For the plants!...",
                result
            }

            res.status(201).send(info);

        } catch (err) {
            const info = {
                status: false,
                message: "Something Went Wrong!..."
            }
            res.status(404).send(info);
            console.log(err);
        }
    });
router.route('/get/:id')
    .post(async (req, res) => {
        try {
            const _id = req.params.id;
            const result = await plantsModel.findOne({ _id });

            const info = {
                status: true,
                message: "Data For the plants!...",
                result
            }

            res.status(201).send(info);

        } catch (err) {
            const info = {
                status: false,
                message: "Something Went Wrong!..."
            }
            res.status(404).send(info);
            console.log(err);
        }
    });

router.route('/getByCategory/:id')
    .post(async (req, res) => {
        try {
            const category = req.params.id;
            const result = await plantsModel.find({ category });

            const info = {
                status: true,
                message: "Data For the plants!...",
                result
            }

            res.status(201).send(info);

        } catch (err) {
            const info = {
                status: false,
                message: "Something Went Wrong!..."
            }
            res.status(404).send(info);
            console.log(err);
        }
    });

module.exports = router;