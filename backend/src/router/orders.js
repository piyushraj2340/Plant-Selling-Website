const express = require('express');
const ordersModel = require('../model/orders');
const router = express.Router();

const auth = require('../middleware/auth');

router.use(auth);

router.route('/orders')
    .post(async (req, res) => {
        try {
            if (req.user) {
                const newOrder = new ordersModel(req.body)
                const result = await newOrder.save();
    
                if(result) {
                    const info = {
                        status: true,
                        message: "Successfully created your order.",
                        result
                    }
                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Failed to create your new order."
                    }
                    res.status(400).send(info);
                }
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
    }).get(async (req, res) => {
        try {
            if (req.user) {
                const result = await ordersModel.find({user: req.user});

                if(result) {
                    const info = {
                        status: true,
                        message: "Your Order History.",
                        result
                    }
                    res.status(200).send(info);
                } else {
                    const info = {
                        status: false,
                        message: "Order not found."
                    }
                    res.status(404).send(info);
                }

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

router.route('/orders/:id').get(async (req, res) => {
    try {
        const _id = req.params.id;
        if (req.user) {
            const result = await ordersModel.findOne({_id, user: req.user});

            if(result) {
                const info = {
                    status: true,
                    message: "Your Order Details.",
                    result
                }
                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Order not found."
                }
                res.status(404).send(info);
            }

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
}).patch(async (req, res) => {
    try {
        const _id = req.par
        if (req.user) {
            const result = await ordersModel.findOneAndUpdate({_id, user: req.user}, req.body, {
                new: true
            });

            if(result) {
                const info = {
                    status: true,
                    message: "Successfully Updated Your order.",
                    result
                }
                res.status(200).send(info);
            } else {
                const info = {
                    status: false,
                    message: "Order not Found."
                }
                res.status(404).send(info);
            }

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



// const statuses = [
//     { status: "Pending", message: "The order has been received but has not yet been processed." },
//     { status: "Processing", message: "The order is being prepared for shipment or service delivery." },
//     { status: "On Hold", message: "There's a temporary hold on the order, often due to pending payment or other issues." },
//     { status: "Awaiting Payment", message: "The order is pending payment confirmation." },
//     { status: "Backordered", message: "Some items in the order are out of stock, and the customer has agreed to wait for them to be restocked." },
//     { status: "Shipped", message: "The order has been shipped or delivered." },
//     { status: "Partially Shipped", message: "Only part of the order has been shipped, often due to items being on backorder." },
//     { status: "Cancelled", message: "The order has been cancelled, either by the customer or the seller." },
//     { status: "Refunded", message: "The payment for the order has been refunded to the customer." },
//     { status: "Returned", message: "The order has been returned by the customer." },
//     { status: "Completed", message: "The order has been successfully processed, shipped, and received by the customer." },
//     { status: "Pending Review", message: "The order is under review, often for fraud prevention or other verification purposes." },
//     { status: "Processing Error", message: "There was an error during the processing of the order that requires investigation or resolution." },
//     { status: "On Hold - Customer Requested", message: "The customer has requested to put the order on hold for a specific reason." },
//     { status: "Awaiting Fulfillment", message: "The order is ready to be processed but is awaiting action to be fulfilled." },
//     { status: "Scheduled", message: "The order is scheduled for delivery or fulfillment at a later date or time." },
//     { status: "Completed - Pending Feedback", message: "The order has been successfully delivered, but the customer feedback is pending." },
//     { status: "Lost in Transit", message: "The order has been lost during shipment and requires investigation or resolution." },
//     { status: "Delayed", message: "The order is experiencing delays beyond the expected delivery time." },
//     { status: "Custom Status", message: "An optional status that can be customized to fit specific needs or workflows." }
// ];

// console.log(statuses);
