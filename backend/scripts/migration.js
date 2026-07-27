require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Because we modified the schema, we will use raw Mongoose collections for some parts to avoid schema validation errors during migration.
const migrateOrders = async () => {
    try {
        const DB = `mongodb+srv://${process.env.COLLECTION_NAME}:${process.env.COLLECTION_PASSWORD}@${process.env.COLLECTION_NAME}.cbqsaya.mongodb.net/?retryWrites=true&w=majority`;
        console.log("Connecting to Database...");
        await mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected.");

        const db = mongoose.connection.db;

        const ordersCollection = db.collection('orders');
        const orderItemsCollection = db.collection('orderitems');
        const vendorOrdersCollection = db.collection('vendororders');

        const allOrders = await ordersCollection.find({}).toArray();
        console.log(`Found ${allOrders.length} orders to migrate.`);

        for (const order of allOrders) {
            // Check if already migrated
            if (order.vendorOrders && order.vendorOrders.length > 0) {
                console.log(`Order ${order._id} already migrated, skipping.`);
                continue;
            }

            console.log(`Migrating Order ${order._id}...`);
            
            // The old orders had orderItems array or we can just fetch orderitems that point to this order
            const items = await orderItemsCollection.find({ order: order._id }).toArray();
            
            if (items.length === 0) {
                console.log(`  No items found for order ${order._id}, skipping.`);
                continue;
            }

            // Group items by nursery
            const itemsByNursery = {};
            items.forEach(item => {
                const nurseryId = item.nursery.toString();
                if (!itemsByNursery[nurseryId]) {
                    itemsByNursery[nurseryId] = [];
                }
                itemsByNursery[nurseryId].push(item);
            });

            const nurseryCount = Object.keys(itemsByNursery).length;
            const deliveryFeePerNursery = order.pricing && order.pricing.deliveryFee ? (order.pricing.deliveryFee / nurseryCount) : 0;
            
            const vendorOrderIds = [];
            
            // Determine overall status based on old status
            const legacyStatus = order.orderStatus ? order.orderStatus.status : 'Processing';
            const legacyMessage = order.orderStatus ? order.orderStatus.message : 'Order is processing.';
            const legacyStatusAt = order.orderStatus && order.orderStatus.statusAt ? order.orderStatus.statusAt : new Date();

            for (const [nurseryId, nurseryItems] of Object.entries(itemsByNursery)) {
                // Calculate subtotal for this vendor
                let subTotal = 0;
                const itemIds = [];
                for (const item of nurseryItems) {
                    const price = item.price || 0;
                    const discount = item.discount || 0;
                    const quantity = item.quantity || 1;
                    const itemPriceAfterDiscount = price - Math.round((price * discount) / 100);
                    subTotal += (itemPriceAfterDiscount * quantity);
                    itemIds.push(item._id);
                }

                const newVendorOrder = {
                    _id: new mongoose.Types.ObjectId(),
                    order: order._id,
                    nursery: new mongoose.Types.ObjectId(nurseryId),
                    orderItems: itemIds,
                    orderStatus: {
                        status: legacyStatus,
                        message: legacyMessage,
                        statusAt: legacyStatusAt
                    },
                    delivery: order.delivery || {},
                    pricing: {
                        subTotal: subTotal,
                        shippingFee: deliveryFeePerNursery,
                        nurseryDiscount: 0,
                        netAmountOwed: subTotal + deliveryFeePerNursery
                    },
                    settlement: {
                        isSettled: false
                    },
                    createdAt: order.orderAt || new Date(),
                    updatedAt: new Date()
                };

                await vendorOrdersCollection.insertOne(newVendorOrder);
                vendorOrderIds.push(newVendorOrder._id);

                // Update the order items to point to this new vendorOrder instead of order
                await orderItemsCollection.updateMany(
                    { _id: { $in: itemIds } },
                    { 
                        $set: { vendorOrder: newVendorOrder._id },
                        $unset: { order: "" } 
                    }
                );
            }

            // Update parent order
            await ordersCollection.updateOne(
                { _id: order._id },
                {
                    $set: { 
                        vendorOrders: vendorOrderIds,
                        overallStatus: legacyStatus
                    },
                    $unset: {
                        orderItems: "",
                        orderStatus: "",
                        delivery: ""
                    }
                }
            );

            console.log(`  Migrated Order ${order._id} successfully into ${vendorOrderIds.length} VendorOrder(s).`);
        }

        console.log("Migration completed successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
};

migrateOrders();
