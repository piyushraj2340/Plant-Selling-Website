const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('node:dns');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Load env vars
dotenv.config({ path: './.env' });

const ordersModel = require('./src/model/checkoutModel/orders');
const OrderItem = require('./src/model/checkoutModel/orderItem');
const cartModel = require('./src/model/checkoutModel/cart');

const connectDB = async () => {
    try {
        const DB = `mongodb+srv://${process.env.COLLECTION_NAME}:${process.env.COLLECTION_PASSWORD}@${process.env.COLLECTION_NAME}.cbqsaya.mongodb.net/?retryWrites=true&w=majority`;
        const connectionInstance = await mongoose.connect(DB);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
}

const migrateData = async () => {
    try {
        await connectDB();
        
        console.log("Starting Migration...");

        // 1. Migrate Orders
        // Use lean to bypass schema validation for reading legacy data
        const orders = await ordersModel.find().lean();
        let migratedOrders = 0;
        let createdOrderItems = 0;

        for (const order of orders) {
            // Check if orderItems has legacy embedded objects (they will not be valid ObjectIds)
            if (order.orderItems && order.orderItems.length > 0 && order.orderItems[0].plant) {
                const newOrderItemIds = [];
                
                for (const legacyItem of order.orderItems) {
                    const newItem = new OrderItem({
                        order: order._id,
                        plant: legacyItem.plant,
                        nursery: legacyItem.nursery,
                        nurseryName: legacyItem.nurseryName,
                        plantName: legacyItem.plantName,
                        images: legacyItem.images,
                        price: legacyItem.price,
                        discount: legacyItem.discount,
                        quantity: legacyItem.quantity
                    });
                    await newItem.save();
                    newOrderItemIds.push(newItem._id);
                    createdOrderItems++;
                }

                // Update the order via updateOne to bypass schema strictness during migration
                await ordersModel.updateOne(
                    { _id: order._id },
                    { $set: { orderItems: newOrderItemIds } }
                );
                migratedOrders++;
            }
        }

        console.log(`Order Migration Complete: Migrated ${migratedOrders} legacy orders, created ${createdOrderItems} OrderItem documents.`);
        
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrateData();
