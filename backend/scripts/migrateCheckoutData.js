require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

// Import models
const Cart = require('../src/model/checkoutModel/cart');
const CartItem = require('../src/model/checkoutModel/cartItem');
const Order = require('../src/model/checkoutModel/orders');
const OrderItem = require('../src/model/checkoutModel/orderItem');
const Plant = require('../src/model/nurseryModel/plants');

const runMigration = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.DB_LINK || 'mongodb://127.0.0.1:27017/plant-selling');
        console.log("Connected successfully.\n");

        console.log("--- STARTING CART MIGRATION ---");
        // 1. Fetch all legacy carts from the raw collection
        const legacyCarts = await mongoose.connection.db.collection('carts').find({}).toArray();
        console.log(`Found ${legacyCarts.length} legacy cart items.`);

        // 2. Group legacy carts by user
        const cartsByUser = {};
        for (const item of legacyCarts) {
            // Ignore if it's already a new format Cart (has cartItems array)
            if (item.cartItems) continue;
            
            const userId = item.user.toString();
            if (!cartsByUser[userId]) {
                cartsByUser[userId] = [];
            }
            cartsByUser[userId].push(item);
        }

        // 3. Clear legacy carts collection completely to make way for new Cart parent documents
        await mongoose.connection.db.collection('carts').deleteMany({});
        await mongoose.connection.db.collection('cartitems').deleteMany({});

        // 4. Create new Cart and CartItems
        for (const [userId, items] of Object.entries(cartsByUser)) {
            // Calculate dynamic total
            let totalPriceWithoutDiscount = 0;
            let totalDiscount = 0;
            let finalPrice = 0;
            
            const newCartItems = [];

            for (const item of items) {
                // Fetch plant to get current price (since static pricing is removed)
                const plant = await Plant.findById(item.plant);
                const quantity = item.quantity || 1;

                if (plant) {
                    const price = plant.price * quantity;
                    const discountAmt = (plant.discount / 100) * price;
                    
                    totalPriceWithoutDiscount += price;
                    totalDiscount += discountAmt;
                    finalPrice += (price - discountAmt);
                }

                newCartItems.push({
                    user: new mongoose.Types.ObjectId(userId),
                    plant: item.plant,
                    nursery: item.nursery,
                    quantity: quantity,
                    addedAt: item.addedAt || new Date()
                });
            }

            const newCart = new Cart({
                user: new mongoose.Types.ObjectId(userId),
                pricing: {
                    totalPriceWithoutDiscount,
                    totalDiscount,
                    deliveryFee: 0,
                    finalPrice
                },
                cartItems: [] // Will populate this with IDs
            });

            await newCart.save();

            // Save Cart Items
            for (const cItem of newCartItems) {
                const newItem = new CartItem({
                    ...cItem,
                    cart: newCart._id
                });
                await newItem.save();
                newCart.cartItems.push(newItem._id);
            }

            await newCart.save();
            console.log(`Migrated cart for user ${userId} with ${newCartItems.length} items.`);
        }
        console.log("--- CART MIGRATION COMPLETE ---\n");


        console.log("--- STARTING ORDER MIGRATION ---");
        // Clear order items first to avoid duplicates on re-runs
        await mongoose.connection.db.collection('orderitems').deleteMany({});

        const orders = await mongoose.connection.db.collection('orders').find({}).toArray();
        console.log(`Found ${orders.length} orders.`);

        for (const order of orders) {
            // Check if already migrated (orderItems is an array of ObjectIds)
            if (order.orderItems && order.orderItems.length > 0 && typeof order.orderItems[0] !== 'object') {
                continue; 
            }

            const newOrderItemIds = [];
            let topLevelStatus = "Processing";

            if (order.orderItems && order.orderItems.length > 0) {
                for (const item of order.orderItems) {
                    // Extract item status if it exists, use the most recent one for top level
                    if (item.orderStatus && item.orderStatus.status) {
                        topLevelStatus = item.orderStatus.status;
                    }

                    const newOrderItem = new OrderItem({
                        order: order._id,
                        plant: item.plant,
                        nursery: item.nursery,
                        nurseryName: item.nurseryName,
                        plantName: item.plantName,
                        images: item.images,
                        price: item.price,
                        discount: item.discount,
                        quantity: item.quantity
                    });

                    await newOrderItem.save();
                    newOrderItemIds.push(newOrderItem._id);
                }
            }

            // Update the order document
            await mongoose.connection.db.collection('orders').updateOne(
                { _id: order._id },
                {
                    $set: {
                        orderItems: newOrderItemIds,
                        orderStatus: {
                            status: topLevelStatus,
                            message: "Status carried over from migration",
                            statusAt: new Date()
                        }
                    }
                }
            );

            console.log(`Migrated order ${order._id} with ${newOrderItemIds.length} items.`);
        }

        console.log("--- ORDER MIGRATION COMPLETE ---");

        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

runMigration();
