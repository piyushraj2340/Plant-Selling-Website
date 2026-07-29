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
        const modelsToUpdate = [
            './src/model/nurseryModel/review',
            './src/model/nurseryModel/plants',
            './src/model/nurseryModel/nursery',
            './src/model/category',
            './src/model/checkoutModel/orders',
            './src/model/checkoutModel/cart',
            './src/model/contact'
        ];

        for (const modelPath of modelsToUpdate) {
            try {
                const Model = require(modelPath);
                // We don't update seed data to keep it protected
                const result = await Model.updateMany(
                    { isGuestData: { $ne: true }, isSeedData: { $ne: true } },
                    { $set: { isGuestData: true } }
                );
                console.log(`Updated ${modelPath}:`, result);
            } catch (err) {
                console.log(`Skipping ${modelPath} or error:`, err.message);
            }
        }

    } catch (e) {
        console.log("Error updating guest data:", e);
    }
    process.exit(0);
}).catch((err) => {
    console.log(`connection failed!.... ${err}`);
});
