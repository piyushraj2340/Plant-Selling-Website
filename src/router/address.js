const router = require('express').Router();

const addressModel = require('../model/address');

const auth = require('../middleware/auth');
router.use(auth);

router.route('/set')
    .post(async (req, res) => {
        try {
            if (req._id) {
                if(req.body.setAsDefault??0) {
                    const data = await addressModel.findOneAndUpdate({ userId: req._id, "address.setAsDefault": true }, {
                        $set: {
                            "address.$.setAsDefault": false
                        }
                    })
                    if(data) await data.save();
                }

                const result = await addressModel.findOne({ userId: req._id });

                if (result) {
                    result.address.push(req.body);
                    await result.save();

                    const info = {
                        status: true,
                        message: "Address Added Successfully!",
                        result
                    }

                    res.status(201).send(info);
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
                    message: "Authentication Failed!..."
                }
                res.status(401).send(info);
            }
        } catch (error) {
            const info = {
                status: false,
                message: "Something Went Wrong!..."
            }
            console.log(error);
            res.status(500).send(info);
        }
    })
    .patch(async (req, res) => {
        try {
            if (req._id) {

                if(req.body.setAsDefault??0) {
                    const data = await addressModel.findOneAndUpdate({ userId: req._id, "address.setAsDefault": true }, {
                        $set: {
                            "address.$.setAsDefault": false
                        }
                    })
                    if(data) await data.save();
                }

                const result = await addressModel.findOneAndUpdate({ userId: req._id, "address._id": req.body._id }, {
                    $set: {
                        "address.$.name": req.body.name,
                        "address.$.phone": req.body.phone,
                        "address.$.pinCode": req.body.pinCode,
                        "address.$.address": req.body.address,
                        "address.$.landmark": req.body.landmark,
                        "address.$.city": req.body.city,
                        "address.$.state": req.body.state,
                        "address.$.setAsDefault": req.body.setAsDefault,
                    }
                },
                    { returnOriginal: false }
                );

                if (result) {
                    const info = {
                        status: true,
                        message: "Address Updated Successfully!...",
                        result
                    }
                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Address that you want to update is not found!..."
                    }
                    res.status(405).send(info);
                }

            } else {
                const info = {
                    status: false,
                    message: "Authentication Failed!..."
                }
                res.status(401).send(info);
            }
        } catch (error) {
            const info = {
                status: false,
                message: "Something Went Wrong!..."
            }
            console.log(error);
            res.status(500).send(info);
        }
    })
    .delete(async (req, res) => {
        try {
            if (req._id) {
                const result = await addressModel.findOneAndUpdate({ userId: req._id }, {
                    $pull: {
                        "address": {
                            "_id": req.body._id
                        }
                    }
                },
                    { returnOriginal: false }
                )

                if (result) {
                    const info = {
                        status: true,
                        message: "Address Deleted Successfully!...",
                        result
                    }
                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Address that you want to delete is not found!..."
                    }
                    res.status(405).send(info);
                }
            } else {
                const info = {
                    status: false,
                    message: "Authentication Failed!..."
                }
                res.status(401).send(info);
            }
        } catch (error) {
            const info = {
                status: false,
                message: "Something Went Wrong!..."
            }
            console.log(error);
            res.status(500).send(info);
        }
    });

router.post('/set/default', async (req, res) => {
    try {
        if(req._id) {
            const data = await addressModel.findOneAndUpdate({ userId: req._id, "address.setAsDefault": true }, {
                $set: {
                    "address.$.setAsDefault": false
                }
            })

            if(data) await data.save();

            const result = await addressModel.findOneAndUpdate({ userId: req._id, "address._id": req.body._id }, {
                $set: {
                    "address.$.setAsDefault": true,
                }
            },
                { returnOriginal: false }
            );

            if (result) {
                const info = {
                    status: true,
                    message: "Address Updated Successfully!...",
                    result
                }
                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Address that you want to update is not found!..."
                }
                res.status(405).send(info);
            }
        } else {
            const info = {
                status: false,
                message: "Authentication Failed!..."
            }
            res.status(401).send(info);
        }
    } catch (error) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }
        console.log(error);
        res.status(500).send(info);
    }
})

router.post('/get',async (req, res) => {
    try {
        if (req._id) {
            const result = await addressModel.findOne({ userId: req._id });

            if (result) {
                // sort the address such that the default address comes at zero index 
                result.address.sort((a,b) => {
                    if(a.setAsDefault === true) return -1;
                    if(b.setAsDefault === true) return 1;
                })

                const info = {
                    status: true,
                    message: "Address Retrieved Successfully!",
                    result
                }
                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Address List is Empty or You are not Authenticated!..."
                }
                res.status(401).send(info);
            }
        } else {
            const info = {
                status: false,
                message: "Authentication Failed!..."
            }
            res.status(401).send(info);
        }
    } catch (error) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }
        console.log(error);
        res.status(500).send(info);
    }
});

router.post('/getById/:id',async (req, res) => {
    try {
        if (req._id) {
            const addressId = req.params.id;
            const result = await addressModel.findOne({ userId: req._id, "address._id": addressId });

            result.address = result.address.id(addressId);

            if (result) {
                const info = {
                    status: true,
                    message: "Address with id Retrieved Successfully!",
                    result
                }
                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Address List is Empty or You are not Authenticated!..."
                }
                res.status(401).send(info);
            }
        } else {
            const info = {
                status: false,
                message: "Authentication Failed!..."
            }
            res.status(401).send(info);
        }
    } catch (error) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }
        console.error(error);
        res.status(500).send(info);
    }
});

router.post('/get/default', async (req, res) => {
    try {
        if (req._id) {
            const result = await addressModel.findOne({ userId: req._id, "address.setAsDefault": true});
            

            if (result) {
                const info = {
                    status: true,
                    message: "Address Retrieved Successfully!",
                    result
                }
                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Address List is Empty or You are not Authenticated!..."
                }
                res.status(401).send(info);
            }
        } else {
            const info = {
                status: false,
                message: "Authentication Failed!..."
            }
            res.status(401).send(info);
        }
    } catch (error) {
        const info = {
            status: false,
            message: "Something Went Wrong!..."
        }
        console.log(error);
        res.status(500).send(info);
    }
})

module.exports = router;
