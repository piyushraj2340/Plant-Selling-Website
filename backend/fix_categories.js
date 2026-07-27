require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
if (process.env.NODE_ENV !== "production") {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
}
const Plant = require('./src/model/nurseryModel/plants');

const fixStringObjectIds = async () => {
    try {
        const DB = `mongodb+srv://${process.env.COLLECTION_NAME}:${process.env.COLLECTION_PASSWORD}@${process.env.COLLECTION_NAME}.cbqsaya.mongodb.net/?retryWrites=true&w=majority`;
        await mongoose.connect(DB, { useNewUrlParser: true });
        console.log('Connected to DB');

        const plants = await Plant.find({}).lean();
        let updatedCount = 0;
        for (const plant of plants) {
            if (typeof plant.category === 'string' && mongoose.Types.ObjectId.isValid(plant.category)) {
                await Plant.collection.updateOne(
                    { _id: plant._id },
                    { $set: { category: new mongoose.Types.ObjectId(plant.category) } }
                );
                updatedCount++;
            }
        }
        console.log('Successfully fixed ' + updatedCount + ' plants.');
        process.exit(0);
    } catch (error) {
        console.error('Fix failed:', error);
        process.exit(1);
    }
};

fixStringObjectIds();
