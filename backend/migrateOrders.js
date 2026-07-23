require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

async function migrate() {
    try {
        await mongoose.connect(process.env.DB_LINK, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB.");

        const db = mongoose.connection.db;

        // 1. Get all orders
        const orders = await db.collection('orders').find({}).toArray();
        console.log(`Found ${orders.length} total orders.`);

        let migratedCount = 0;

        for (const order of orders) {
            // Check if vendorOrders is missing or empty
            if (!order.vendorOrders || order.vendorOrders.length === 0) {
                console.log(`Migrating Order ${order._id}...`);
                
                // Get all orderItems for this order (using the old 'order' field)
                const items = await db.collection('orderitems').find({ order: order._id }).toArray();
                
                if (items.length === 0) {
                    console.log(`No items found for order ${order._id}, skipping.`);
                    continue;
                }

                // Group items by nursery
                const itemsByNursery = {};
                for (const item of items) {
                    const nurseryId = item.nursery.toString();
                    if (!itemsByNursery[nurseryId]) {
                        itemsByNursery[nurseryId] = [];
                    }
                    itemsByNursery[nurseryId].push(item);
                }

                const vendorOrderIds = [];

                // Create a VendorOrder for each nursery
                for (const [nurseryId, nurseryItems] of Object.entries(itemsByNursery)) {
                    // Calculate pricing for this vendor order
                    let subTotal = 0;
                    nurseryItems.forEach(item => {
                        const discountPrice = item.price - (item.price * item.discount / 100);
                        subTotal += discountPrice * item.quantity;
                    });
                    
                    // Simple allocation for existing ones:
                    const vendorOrder = {
                        _id: new mongoose.Types.ObjectId(),
                        order: order._id,
                        nursery: new mongoose.Types.ObjectId(nurseryId),
                        orderItems: nurseryItems.map(item => item._id),
                        orderStatus: order.orderStatus || { status: 'Processing', message: 'Order is processing', statusAt: order.orderAt },
                        pricing: {
                            subTotal: subTotal,
                            shippingFee: 0,
                            nurseryDiscount: 0,
                            netAmountOwed: subTotal
                        },
                        settlement: {
                            isSettled: false
                        },
                        createdAt: order.orderAt || new Date(),
                        updatedAt: new Date(),
                        __v: 0
                    };

                    await db.collection('vendororders').insertOne(vendorOrder);
                    vendorOrderIds.push(vendorOrder._id);

                    // Update the orderItems to point to this vendorOrder
                    for (const item of nurseryItems) {
                        await db.collection('orderitems').updateOne(
                            { _id: item._id },
                            { $set: { vendorOrder: vendorOrder._id } }
                        );
                    }
                }

                // Update the original order with vendorOrders references
                await db.collection('orders').updateOne(
                    { _id: order._id },
                    { 
                        $set: { 
                            vendorOrders: vendorOrderIds,
                            overallStatus: order.orderStatus?.state === 'delivered' ? 'Delivered' : 'Processing'
                        } 
                    }
                );

                migratedCount++;
            }
        }

        console.log(`Successfully migrated ${migratedCount} orders.`);
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
