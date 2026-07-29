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
        await mongoose.connection.collection('nurserystoretabs').dropIndex('tabName_1');
        console.log("Dropped index successfully");
    } catch (e) {
        console.log("Index already dropped or not found", e);
    }
    process.exit(0);
}).catch((err) => {
    console.log(`connection failed!.... ${err}`);
});
