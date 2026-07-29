require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('node:dns');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const DB = `mongodb+srv://${process.env.COLLECTION_NAME}:${process.env.COLLECTION_PASSWORD}@${process.env.COLLECTION_NAME}.cbqsaya.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(DB, {
    useNewUrlParser: true,
}).then(async () => {
    console.log("connection successful!...");
    try {
        const Coupon = require('./src/model/nurseryModel/coupon');
        const result = await Coupon.updateMany(
            { isGuestData: { $ne: true }, isSeedData: { $ne: true } },
            { $set: { isGuestData: true } }
        );
        console.log("Updated coupons:", result);
    } catch (e) {
        console.log("Error updating coupons:", e);
    }
    process.exit(0);
}).catch((err) => {
    console.log(`connection failed!.... ${err}`);
});
