const router = require('express').Router();
const bcryptjs = require('bcryptjs');

const auth = require('../middleware/auth');
const userModel = require('../model/user');


router.post('/sign-up', async (req, res) => {
    try {
        const newUser = new userModel(req.body);

        const token = await newUser.generateAuthToken();
        await newUser.save();

        const userInfo = { ...newUser._doc };
        delete userInfo.password;
        delete userInfo.tokens;
        delete userInfo.__v;

        res.cookie('auth', token, {
            expires: new Date(Date.now() + 50000000),
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        const info = {
            status: true,
            message: "User Registration Successful",
            result: userInfo
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

                const userInfo = { ...result._doc };
                delete userInfo.password;
                delete userInfo.tokens;
                delete userInfo.__v;

                // adding cookie into the database 
                res.cookie('auth', token, {
                    expires: new Date(Date.now() + 50000000),
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                });

                const info = {
                    status: true,
                    message: "Login Successful",
                    result: userInfo
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

router.use(auth);

router.get('/logout', async (req, res) => {
    try {
        if (req.user) {

            const result = await userModel.findByIdAndUpdate({ _id: req.user }, {
                $pull: {
                    tokens: {
                        token: req.token
                    }
                }
            });

            if (result) {
                res.clearCookie('auth', {
                    sameSite: 'none',
                    secure: true
                });
                res.clearCookie('orderSession', {
                    sameSite: 'none',
                    secure: true
                });
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

router.get('/checkUser', async (req, res) => {
    try {
        const result = await userModel.findOne({ _id: req.user });

        if (result) {
            const info = {
                status: true,
                message: "User Check Passed.",
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
        res.status(500).send(info);
    }
});





module.exports = router;