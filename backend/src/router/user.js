const express = require('express');
const router = express.Router();

const userModel = require('../model/user');

const auth = require('../middleware/auth');
router.use(auth);

router.route("/profile")
    .get(async (req, res) => {
        try {
            const result = await userModel.findOne({ _id: req.user }).select({ password: 0, tokens: 0, __v: 0 });

            if (result) {
                const info = {
                    status: true,
                    message: "User Data",
                    result
                }

                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Authentication Failed"
                }
                res.status(401).send(info);
            }

        } catch (error) {
            const info = {
                status: false,
                message: error.message
            }
            console.log(error);
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