// import the express module 
const express = require('express');

// calling the Router functionality to create the router 
const router = express.Router();

// importing the middleware authentication 
const auth = require('../middleware/auth');
const authNursery = require('../middleware/authNursery');
const authPlants = require('../middleware/authPlants');



router.post('/profile', auth,  async (req, res) => {
    try {
        if(req.user) {
            const info = {
                status: true,
                message: "Showing profile data",
                result: req.user
            }
    
            res.status(201).send(info);
        } else {
            const info = {
                status: false,
                message: "Authentication failed",
            }
    
            res.status(201).send(info);
        }
    } catch (err) {
        const info = {
            status : false,
            message: "Something Went Wrong!..."
        }
        res.status(404).send(info);
        console.log(err);
    }
});

router.post('/nursery-profile', authNursery,  async (req, res) => {
    try {
        if(req.nursery) {
            const info = {
                status: true,
                message: "Showing profile data",
                result: req.nursery
            }
            res.status(201).send(info);
        } else {
            const info = {
                status: false,
                message: "Authentication failed",
            }
    
            res.status(201).send(info);
        }
    } catch (err) {
        const info = {
            status : false,
            message: "Something Went Wrong!..."
        }
        res.status(404).send(info);
        console.log(err);
    }
});

router.post('/plants-profile', authPlants,  async (req, res) => {
    try {
        if(req.plants) {
            const info = {
                status: true,
                message: "Showing profile data",
                result: req.plants
            }
            res.status(201).send(info);
        } else {
            const info = {
                status: false,
                message: "Authentication failed",
            }
    
            res.status(201).send(info);
        }
    } catch (err) {
        const info = {
            status : false,
            message: "Something Went Wrong!..."
        }
        res.status(404).send(info);
        console.log(err);
    }
});

router.post('/auth', auth , async (req, res) => {
    try {
        if(req.user) {
            const info = {
                status: true,
                message: "Authentication Successfully!..",
            }
    
            res.status(201).send(info);
        } else {
            const info = {
                status: false,
                message: "Authentication failed!...",
            }
    
            res.status(201).send(info);
        }
    } catch (err) {
        const info = {
            status : false,
            message: "Something Went Wrong!..."
        }
        res.status(404).send(info);
        console.log(err);
    }
});

router.post('/logout', (req, res) => {
    try {
        res.clearCookie('auth');
        const info = {
            status: true,
            message: "Logout Successfully!...",
        }

        res.status(200).send(info);
    }
    catch (error) {
        const info = {
            status : false,
            message: "Something Went Wrong!..."
        }
        res.status(404).send(info);
        console.log(err);
    }
});

module.exports = router;