const mongoose = require('mongoose');
const dns = require('node:dns');

// Force IPv4 first to bypass Node.js IPv6 DNS resolution issues with MongoDB Atlas +srv
dns.setDefaultResultOrder('ipv4first');

// Bypass local ISP DNS issues by using Google's public DNS in development
if (process.env.NODE_ENV !== "production") {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

mongoose.set("strictQuery", false);

// console.log(process.env.COLLECTION_NAME);
const DB = `mongodb+srv://${process.env.COLLECTION_NAME}:${process.env.COLLECTION_PASSWORD}@${process.env.COLLECTION_NAME}.cbqsaya.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(DB, {
    useNewUrlParser: true,

}).then(() => {
    console.log("connection successful!...");
}).catch((err) => {
    console.log(`connection failed!.... ${err}`);
});
