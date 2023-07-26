const express = require('express');

const ordersModel = require('../model/orders');

const router = express.Router();


router.post('/add', async (req, res) => {
        try {
            const placeOrder = new ordersModel(req.body);

            const result = await placeOrder.save();

            const info = {
                status: true,
                message: "Order Placed Successfully!...",
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

router.post('/get', async (req, res) => {
        try {
            const result = await ordersModel.find();

            console.log(result);

            const info = {
                status: true,
                message: "Data For the Orders!...",
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
router.post('/get/:id', async (req, res) => {
        try {
            const _id = req.params.id;
            const result = await ordersModel.findOne({_id});

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