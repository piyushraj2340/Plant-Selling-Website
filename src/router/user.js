const express = require('express');

const router = express.Router();
const userModel = require('../model/user');
const auth = require('../middleware/auth');

router.use(auth);

router.route("/profile")
    .post(async (req, res) => {
        try {
            if (req._id) {
                const result = await userModel.findOne({ _id: req._id });

                if (result) {
                    const info = {
                        status: true,
                        message: "Showing Profile Data!...",
                        result
                    }

                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Authentication Failed!..."
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