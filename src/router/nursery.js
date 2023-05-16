const express = require('express');

const nursery = require('../model/nursery');

const router = express.Router();


router.route('/add')
    .post(async (req, res) => {
        try {
            const addNursery = new nursery(req.body);

            const result = await addNursery.save();

            const info = {
                status: true,
                message: "Nursery Listed added Successfully!...",
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
            const {userId} = req.body;

            const result = await nursery.findOne({userId});

            console.log(result);

            const info = {
                status: true,
                message: "Data For the Nursery!...",
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