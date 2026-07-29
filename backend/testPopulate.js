require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('node:dns');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const VendorOrder = require('./src/model/checkoutModel/vendorOrder');
const OrderItem = require('./src/model/checkoutModel/orderItem');
const Order = require('./src/model/checkoutModel/orders');

async function testPopulate() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.COLLECTION_NAME}:${process.env.COLLECTION_PASSWORD}@${process.env.COLLECTION_NAME}.cbqsaya.mongodb.net/?retryWrites=true&w=majority`);
        const result = await VendorOrder.find({}).limit(1).populate({
            path: 'orderItems',
            populate: [
                { path: 'nursery' },
                { path: 'plant' }
            ]
        });
        console.log("Populate success! Result:", !!result);
    } catch (e) {
        console.error("Populate failed:", e.message);
    }
    process.exit(0);
}

testPopulate();
