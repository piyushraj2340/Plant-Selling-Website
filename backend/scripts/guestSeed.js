const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../src/model/userModel/user');
const Address = require('../src/model/userModel/address');
const Nursery = require('../src/model/nurseryModel/nursery');
const Plant = require('../src/model/nurseryModel/plants');
const Category = require('../src/model/category');
const Order = require('../src/model/checkoutModel/orders');
const Cart = require('../src/model/checkoutModel/cart');
const NurseryStoreBlocks = require('../src/model/nurseryModel/nurseryStoreBlocks');
const NurseryStoreTemplates = require('../src/model/nurseryModel/nurseryStoreTemplates');
const Contact = require('../src/model/contact');
const crypto = require('crypto');

const GUEST_USER_EMAIL = process.env.GUEST_USER_EMAIL || 'guest-user@plantseller.com';
const GUEST_NURSERY_EMAIL = process.env.GUEST_NURSERY_EMAIL || 'guest-seller@plantseller.com';
const GUEST_ADMIN_EMAIL = process.env.GUEST_ADMIN_EMAIL || 'guest-admin@plantseller.com';
const GUEST_PASSWORD = process.env.GUEST_PASSWORD || 'Guest@1234';

async function seedGuestData() {
    console.log("Starting Guest Data Wipe & Re-seed Process...");

    try {
        // 1. WIPE PHASE
        console.log("Wiping existing guest data...");
        
        // Find existing guest users
        const guestEmails = [GUEST_USER_EMAIL, GUEST_NURSERY_EMAIL, GUEST_ADMIN_EMAIL];
        const existingGuests = await User.find({ email: { $in: guestEmails } });
        const guestIds = existingGuests.map(g => g._id);

        if (guestIds.length > 0) {
            await Address.deleteMany({ user: { $in: guestIds } });
            await Cart.deleteMany({ user: { $in: guestIds } });
            await Order.deleteMany({ user: { $in: guestIds } });
        }
        
        const existingGuestNurseries = await Nursery.find({ nurseryEmail: GUEST_NURSERY_EMAIL });
        const guestNurseryIds = existingGuestNurseries.map(n => n._id);

        if (guestNurseryIds.length > 0) {
            await Plant.deleteMany({ nursery: { $in: guestNurseryIds } });
            await NurseryStoreBlocks.deleteMany({ nursery: { $in: guestNurseryIds } });
            await NurseryStoreTemplates.deleteMany({ nursery: { $in: guestNurseryIds } });
            await Order.deleteMany({ "orderItems.nursery": { $in: guestNurseryIds } }); // Wipe orders for this nursery
        }

        // Delete all data manually tagged as isGuestData: true
        await Category.deleteMany({ isGuestData: true });
        await Plant.deleteMany({ isGuestData: true });
        await Order.deleteMany({ isGuestData: true });
        await Nursery.deleteMany({ isGuestData: true });
        await User.deleteMany({ isGuestData: true });
        await User.deleteMany({ email: { $in: guestEmails } }); // Ensure exact wipe

        console.log("Wipe completed. Starting Seed phase...");

        // 2. SEED PHASE - USERS
        const hashedPassword = await bcrypt.hash(GUEST_PASSWORD, 12);

        // Guest Admin
        const adminUser = new User({
            name: "Guest Admin",
            email: GUEST_ADMIN_EMAIL,
            phone: "9999999991",
            gender: "Other",
            age: 30,
            password: hashedPassword,
            role: ["user", "admin"],
            isUserVerified: true,
            isGuestData: true
        });
        await adminUser.save();

        // Guest User
        const standardUser = new User({
            name: "Guest User",
            email: GUEST_USER_EMAIL,
            phone: "9999999992",
            gender: "Male",
            age: 25,
            password: hashedPassword,
            role: ["user"],
            isUserVerified: true,
            isGuestData: true
        });
        await standardUser.save();

        // Guest Seller
        const sellerUser = new User({
            name: "Guest Seller",
            email: GUEST_NURSERY_EMAIL,
            phone: "9999999993",
            gender: "Female",
            age: 28,
            password: hashedPassword,
            role: ["user", "seller"],
            isUserVerified: true,
            isGuestData: true
        });
        await sellerUser.save();

        // Guest Address
        const guestAddress = new Address({
            user: standardUser._id,
            name: "Guest User Home",
            phone: "9999999992",
            pinCode: 110001,
            address: "123 Demo Street, Suite 4B",
            city: "New Delhi",
            state: "Delhi",
            isGuestData: true
        });
        await guestAddress.save();

        // 3. SEED PHASE - NURSERY
        const guestNursery = new Nursery({
            user: sellerUser._id,
            nurseryOwnerName: "Guest Seller",
            nurseryName: "Evergreen Botanicals (Demo)",
            nurseryEmail: GUEST_NURSERY_EMAIL,
            nurseryPhone: "9999999993",
            address: "456 Greenhouse Lane",
            city: "Pune",
            state: "Maharashtra",
            pinCode: 411001,
            isGuestData: true,
            avatar: { url: "https://images.unsplash.com/photo-1585320806297-9794b3e4ce88?q=80&w=150&auto=format&fit=crop" },
            cover: { url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1200&auto=format&fit=crop" }
        });
        await guestNursery.save();

        // 4. SEED PHASE - CATEGORIES & PLANTS
        const indoorCategory = new Category({
            name: "Guest Indoor Plants",
            slug: "guest-indoor-plants",
            description: "Beautiful indoor plants for your home.",
            createdBy: adminUser._id,
            status: "Active",
            isGuestData: true
        });
        await indoorCategory.save();

        const plantsData = [
            {
                plantName: "Monstera Deliciosa",
                description: "<h4>The Swiss Cheese Plant</h4><p>A classic, easy-to-grow houseplant known for its natural leaf holes.</p>",
                price: 499,
                discount: 10,
                stock: 25,
                category: indoorCategory._id,
                nursery: guestNursery._id,
                user: sellerUser._id,
                isGuestData: true,
                images: [{ public_id: "demo_m1", url: "https://images.unsplash.com/photo-1614594975525-e45190c55d40?q=80&w=400&auto=format&fit=crop" }],
                status: "Published"
            },
            {
                plantName: "Snake Plant (Sansevieria)",
                description: "<h4>Perfect for Beginners</h4><p>Extremely resilient and great for air purification.</p>",
                price: 299,
                discount: 5,
                stock: 50,
                category: indoorCategory._id,
                nursery: guestNursery._id,
                user: sellerUser._id,
                isGuestData: true,
                images: [{ public_id: "demo_m2", url: "https://images.unsplash.com/photo-1593482892290-f54927ae1b7e?q=80&w=400&auto=format&fit=crop" }],
                status: "Published"
            },
            {
                plantName: "Fiddle Leaf Fig",
                description: "<h4>Trendy & Elegant</h4><p>Features broad, beautifully textured leaves.</p>",
                price: 899,
                discount: 15,
                stock: 10,
                category: indoorCategory._id,
                nursery: guestNursery._id,
                user: sellerUser._id,
                isGuestData: true,
                images: [{ public_id: "demo_m3", url: "https://images.unsplash.com/photo-1597055964864-1596541f5358?q=80&w=400&auto=format&fit=crop" }],
                status: "Published"
            },
            {
                plantName: "Peace Lily",
                description: "<h4>Beautiful White Blooms</h4><p>A gorgeous plant that thrives in low light.</p>",
                price: 349,
                discount: 0,
                stock: 30,
                category: indoorCategory._id,
                nursery: guestNursery._id,
                user: sellerUser._id,
                isGuestData: true,
                images: [{ public_id: "demo_m4", url: "https://images.unsplash.com/photo-1598886364375-7b1897d2870c?q=80&w=400&auto=format&fit=crop" }],
                status: "Published"
            },
            {
                plantName: "Aloe Vera",
                description: "<h4>Healing & Hardy</h4><p>A medicinal succulent that requires very little water.</p>",
                price: 199,
                discount: 0,
                stock: 100,
                category: indoorCategory._id,
                nursery: guestNursery._id,
                user: sellerUser._id,
                isGuestData: true,
                images: [{ public_id: "demo_m5", url: "https://images.unsplash.com/photo-1596547609652-9fc5d8d4285b?q=80&w=400&auto=format&fit=crop" }],
                status: "Published"
            }
        ];

        const insertedPlants = await Plant.insertMany(plantsData);

        // 5. SEED PHASE - STORE BLOCKS (Templates)
        const block = new NurseryStoreBlocks({
            nursery: guestNursery._id,
            blockName: "Hero Banner",
            blockType: "header",
            content: "Welcome to Evergreen Botanicals!",
            images: [{ url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1200&auto=format&fit=crop" }],
            isGuestData: true
        });
        await block.save();

        // 6. SEED PHASE - ORDERS
        const sampleOrder = new Order({
            user: standardUser._id,
            orderItems: [
                {
                    plant: insertedPlants[0]._id,
                    plantName: insertedPlants[0].plantName,
                    nursery: guestNursery._id,
                    nurseryName: guestNursery.nurseryName,
                    quantity: 2,
                    price: 499,
                    discount: 10,
                    images: { url: insertedPlants[0].imagesList[0].url },
                    orderStatus: { status: "Approved" }
                },
                {
                    plant: insertedPlants[1]._id,
                    plantName: insertedPlants[1].plantName,
                    nursery: guestNursery._id,
                    nurseryName: guestNursery.nurseryName,
                    quantity: 1,
                    price: 299,
                    discount: 5,
                    images: { url: insertedPlants[1].imagesList[0].url },
                    orderStatus: { status: "Processing" }
                }
            ],
            shippingInfo: {
                name: "Guest User Home",
                phone: "9999999992",
                pinCode: 110001,
                address: "123 Demo Street",
                city: "New Delhi",
                state: "Delhi",
            },
            pricing: {
                totalPriceWithoutDiscount: 1297,
                totalDiscount: 64.85,
                deliveryFee: 50,
                finalPrice: 1282.15
            },
            payment: {
                paymentId: "pi_demo_" + crypto.randomBytes(8).toString('hex'),
                status: "succeeded",
                message: "Paid via Guest Demo",
                paymentMethods: "card"
            },
            isGuestData: true
        });
        await sampleOrder.save();

        console.log("✅ Guest Data Seed Completed Successfully!");

    } catch (error) {
        console.error("❌ Error seeding guest data:", error);
    }
}

if (require.main === module) {
    require('dotenv').config({ path: __dirname + '/../.env' });
    require('../src/config/database/db'); // connect to DB
    
    seedGuestData().then(() => {
        console.log("Exiting seed script...");
        process.exit(0);
    }).catch(err => {
        console.error("Seed script Error:", err);
        process.exit(1);
    });
}

module.exports = seedGuestData;
