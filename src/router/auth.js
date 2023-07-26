const express = require('express');
const bcryptjs = require('bcryptjs');

const router = express.Router();

const auth = require('../middleware/auth');
const userModel = require('../model/user');

router.post('/sign-up', async (req, res) => {
    try {
        const newUser = new userModel(req.body);

        const token = await newUser.generateAuthToken();
        const result = await newUser.save();

        res.cookie('auth', token, {
            expires: new Date(Date.now() + 500000),
            httpOnly: true
        });

        const info = {
            status: true,
            message: "User Registration Successful!...",
        }

        res.status(201).send(info);

    } catch (err) {
        const info = {
            status: false,
            message: "Some Input might be invalid!..."
        }
        console.log(err);
        res.status(500).send(info);
    }
});

router.post('/sign-in', async (req, res) => {
    try {
        // request the data from body and initialize into the variable 
        const { email, password } = req.body;

        // search for the result from the database using email 
        const result = await userModel.findOne({ email });

        // compare the hash password bcryptjs.compare(textPass,hashPass) method
        const isPassMatch = await bcryptjs.compare(password, result.password);

        // if we get the user 
        if (isPassMatch) {
            // generate the jwt token 
            const token = await result.generateAuthToken();

            // adding cookie into the database 
            res.cookie('auth', token, {
                expires: new Date(Date.now() + 50000000),
                httpOnly: true
            });

            const info = {
                status: true,
                message: "Login Successful!...",
            }

            res.status(200).send(info);
        }
        else {
            const info = {
                status: false,
                message: "Login Failed!..."
            }

            res.status(401).send(info);
        }
    } catch (err) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }

        console.log(err);
        res.status(500).send(info);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        if (req._id) {

            const _id = req._id;
            const result = await userModel.findOne({ _id });

            if (result) {
                const info = {
                    status: true,
                    message: "Authentication Successfully!..",
                }

                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Authentication failed!...",
                }

                res.status(401).send(info);
            }
        } else {
            const info = {
                status: false,
                message: "Authentication failed!...",
            }

            res.status(401).send(info);
        }
    } catch (err) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }
        console.log(err);
        res.status(500).send(info);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        if (req._id) {

            const result = await userModel.findOne({_id: req._id});

            result.tokens = result.tokens.filter((elem) => {
                return elem.token!== req.token;
            })

            await result.save();

            res.clearCookie('auth');
            const info = {
                status: true,
                message: "Logout Successfully!...",
            }
            res.status(200).send(info);
        } else {
            const info = {
                status: false,
                message: "Authentication failed!...",
            }

            res.status(401).send(info);
        }
    }
    catch (error) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }
        console.log(error);
        res.status(500).send(info);
    }
});


module.exports = router;