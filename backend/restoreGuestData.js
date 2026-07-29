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
        const User = require('./src/model/userModel/user');
        
        const GUEST_EMAILS = [
            'guest-user@plantseller.com',
            'guest-seller@plantseller.com',
            'guest-admin@plantseller.com'
        ];

        // Find all guest user IDs
        const guestUsers = await User.find({
            $or: [
                { email: { $in: GUEST_EMAILS } },
                { isGuestData: true }
            ]
        }).select('_id');
        
        const guestUserIds = guestUsers.map(u => u._id);
        console.log(`Found ${guestUserIds.length} guest users`);

        const modelsWithUser = [
            { path: './src/model/nurseryModel/review', field: 'user' },
            { path: './src/model/nurseryModel/plants', field: 'user' },
            { path: './src/model/nurseryModel/nursery', field: 'user' },
            { path: './src/model/category', field: 'createdBy' },
            { path: './src/model/nurseryModel/coupon', field: 'createdBy' },
            { path: './src/model/checkoutModel/orders', field: 'user' },
            { path: './src/model/checkoutModel/cart', field: 'user' }
        ];

        for (const { path, field } of modelsWithUser) {
            try {
                const Model = require(path);
                
                // Set isGuestData: false for everything created by a NON-GUEST user
                const result = await Model.updateMany(
                    { [field]: { $nin: guestUserIds }, isSeedData: { $ne: true } },
                    { $set: { isGuestData: false } }
                );
                console.log(`Restored ${path}:`, result);
            } catch (err) {
                console.log(`Error on ${path}:`, err.message);
            }
        }

        // Handle Contact model separately (it uses email, not user ID)
        try {
            const Contact = require('./src/model/contact');
            const result = await Contact.updateMany(
                { email: { $nin: GUEST_EMAILS }, isSeedData: { $ne: true } },
                { $set: { isGuestData: false } }
            );
            console.log(`Restored ./src/model/contact:`, result);
        } catch (err) {
            console.log("Error on contact:", err.message);
        }

    } catch (e) {
        console.log("Error restoring guest data:", e);
    }
    process.exit(0);
}).catch((err) => {
    console.log(`connection failed!.... ${err}`);
});
