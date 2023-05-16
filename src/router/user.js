const express = require('express');

const bcryptjs = require('bcryptjs');

const user = require('../model/user');

const router = express.Router();



router.route('/sign-up')
    .post(async (req, res) => {
        try {
            const newUser = new user(req.body);

            console.log(newUser);

            const token = await newUser.generateAuthToken();

            const result = await newUser.save();

            res.cookie('auth', token, {
                expires: new Date(Date.now() + 500000),
                httpOnly: true
            });

            const info = {
                status: true,
                message: "User Registration Successful!...",
                result
            }

            res.status(201).send(info);

        } catch (err) {
            const info = {
                status : false,
                message: "Something Went Wrong!..."
            }
            res.status(404).send(info);
            console.log(err);
        }
    });

router.route('/sign-in').post(async (req, res) => {
    try {
        // request the data from body and initialize into the variable 
        const {email,password} = req.body;

        // search for the result from the database using email 
        const result = await user.findOne({email});

        console.log(result);

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
                status : true,
                message: "You Have Login Successful!...",
                result
            }

            res.status(201).send(info);
            console.log(info);
            
            // after successfully login redirect to profile 
            // res.status(200).redirect("/profile");
        }
        else {
            const info = {
                status: false,
                message: "Login Input Incorrect!..."
            }

            res.status(401).send(info);
            console.log(info);
        }
    } catch (err) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }

        res.status(400).send(info);
        console.log(err);
    }
})

module.exports = router;