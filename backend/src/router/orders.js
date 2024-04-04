const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { createOrder, getOrderHistory, getOrderById, confirmOrderPayment, getLastOrder } = require('../controllers/orderController');

router.use(auth);

router.route('/orders')
    .post(createOrder)
    .get(getOrderHistory)
    .patch(confirmOrderPayment); //? This route is only accessible when payments are confirmed 

router.route('/orders/:id')
    .get(getOrderById);

router.route('/last/order')
    .get(getLastOrder);


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
