const router = require('express').Router();
const bcryptjs = require('bcryptjs');

const auth = require('../middleware/auth');
const userModel = require('../model/user');


router.post('/sign-up', async (req, res) => {
    try {
        const newUser = new userModel(req.body);

        const token = await newUser.generateAuthToken();
        await newUser.save();

        res.cookie('auth', token, {
            expires: new Date(Date.now() + 500000),
            httpOnly: true
        });

        const info = {
            status: true,
            message: "User Registration Successful",
        }

        res.status(201).send(info);

    } catch (err) {
        const info = {
            status: false,
            message: err.message
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

        if (result) {
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
                    message: "Login Successful",
                }

                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Login Failed"
                }

                res.status(401).send(info);
            }
        }
        else {
            const info = {
                status: false,
                message: "Login Failed"
            }

            res.status(401).send(info);
        }
    } catch (error) {
        const info = {
            status: false,
            message: error.message
        }

        console.log(error);
        res.status(500).send(info);
    }
});

router.get('/', auth, async (req, res) => {
    try {
        if (req.user) {
            const result = await userModel.findOne({ _id: req.user });
            if (result) {
                const info = {
                    status: true,
                    message: "Authentication Successfully.",
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
    } catch (error) {
        const info = {
            status: false,
            message: error.message
        }
        console.log(error);
        res.status(500).send(info);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        if (req.user) {

            const result = await userModel.findByIdAndUpdate({ _id: req.user }, {
                $pull: {
                    tokens: {
                        token: req.token
                    }
                }
            });

            if(result) {
                res.clearCookie('auth');
                const info = {
                    status: true,
                    message: "Logout Successfully.",
                }
                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Logout failed.",
                }
                res.status(400).send(info);
            }
            
        } else {
            const info = {
                status: false,
                message: "Authentication failed",
            }

            res.status(401).send(info);
        }
    }
    catch (error) {
        const info = {
            status: false,
            message: error.message
        }
        console.log(error);
        res.status(500).send(info);
    }
});


module.exports = router;