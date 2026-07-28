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
        // 1. SOFT-DELETE PHASE
        console.log("Cleaning up guest activity (Soft-Delete)...");

        // Find existing guest users
        const guestEmails = [GUEST_USER_EMAIL, GUEST_NURSERY_EMAIL, GUEST_ADMIN_EMAIL];
        const existingGuests = await User.find({ email: { $in: guestEmails } });
        const guestIds = existingGuests.map(g => g._id);

        if (guestIds.length > 0) {
            // Soft delete user-created data
            await Address.updateMany({ user: { $in: guestIds }, isSeedData: { $ne: true } }, { $set: { isDeleted: true } });
            await Cart.updateMany({ user: { $in: guestIds } }, { $set: { isDeleted: true } });
            await Order.updateMany({ user: { $in: guestIds }, isSeedData: { $ne: true } }, { $set: { isDeleted: true } });
            
            // Restore any seed data that users may have deleted
            await Address.updateMany({ user: { $in: guestIds }, isSeedData: true }, { $set: { isDeleted: false } });
            await Order.updateMany({ user: { $in: guestIds }, isSeedData: true }, { $set: { isDeleted: false } });
        }

        const existingGuestNurseries = await Nursery.find({ nurseryEmail: GUEST_NURSERY_EMAIL });
        const guestNurseryIds = existingGuestNurseries.map(n => n._id);

        if (guestNurseryIds.length > 0) {
            // Soft delete user-created data
            await Plant.updateMany({ nursery: { $in: guestNurseryIds }, isSeedData: { $ne: true } }, { $set: { isDeleted: true } });
            await NurseryStoreBlocks.deleteMany({ nursery: { $in: guestNurseryIds } }); // Optional cleanup
            await NurseryStoreTemplates.deleteMany({ nursery: { $in: guestNurseryIds } }); // Optional cleanup
            await Order.updateMany({ "orderItems.nursery": { $in: guestNurseryIds }, isSeedData: { $ne: true } }, { $set: { isDeleted: true } });
            
            // Restore any seed data that sellers may have deleted
            await Plant.updateMany({ nursery: { $in: guestNurseryIds }, isSeedData: true }, { $set: { isDeleted: false } });
            await Order.updateMany({ "orderItems.nursery": { $in: guestNurseryIds }, isSeedData: true }, { $set: { isDeleted: false } });
        }

        // Remove the skipped logic as we now want to upsert (enforce reset) every time
        console.log("Upserting Seed data to ensure clean state...");

        // 2. SEED PHASE - USERS
        const hashedPassword = await bcrypt.hash(GUEST_PASSWORD, 12);

        // Guest Admin
        const adminUser = await User.findOneAndUpdate(
            { email: GUEST_ADMIN_EMAIL },
            {
                name: "Guest Admin",
                phone: "9999999991",
                gender: "Other",
                age: 30,
                password: hashedPassword,
                role: ["user", "admin"],
                isUserVerified: true,
                isGuestData: true
            },
            { upsert: true, new: true }
        );

        // Guest User
        const standardUser = await User.findOneAndUpdate(
            { email: GUEST_USER_EMAIL },
            {
                name: "Guest User",
                phone: "9999999992",
                gender: "Male",
                age: 25,
                password: hashedPassword,
                role: ["user"],
                isUserVerified: true,
                isGuestData: true
            },
            { upsert: true, new: true }
        );

        // Guest Seller
        const sellerUser = await User.findOneAndUpdate(
            { email: GUEST_NURSERY_EMAIL },
            {
                name: "Guest Seller",
                phone: "9999999993",
                gender: "Female",
                age: 28,
                password: hashedPassword,
                role: ["user", "seller"],
                isUserVerified: true,
                isGuestData: true
            },
            { upsert: true, new: true }
        );

        // Guest Address
        const guestAddress = await Address.findOneAndUpdate(
            { user: standardUser._id, isGuestData: true },
            {
                name: "Guest User Home",
                phone: "9999999992",
                pinCode: 110001,
                address: "123 Demo Street, Suite 4B",
                city: "New Delhi",
                state: "Delhi",
                isGuestData: true,
                isDeleted: false
            },
            { upsert: true, new: true }
        );

        // 3. SEED PHASE - NURSERY
        const guestNursery = await Nursery.findOneAndUpdate(
            { nurseryEmail: GUEST_NURSERY_EMAIL },
            {
                user: sellerUser._id,
                nurseryOwnerName: "Guest Seller",
                nurseryName: "Evergreen Botanicals (Demo)",
                nurseryPhone: "9999999993",
                address: "456 Greenhouse Lane",
                city: "Pune",
                state: "Maharashtra",
                pinCode: 411001,
                isGuestData: true,
                avatar: { url: "https://res.cloudinary.com/dcd6y2awx/image/upload/v1785239935/PlantSeller/UI%20Images/nursary_avatar_ey00ge.png" },
                cover: { url: "https://res.cloudinary.com/dcd6y2awx/image/upload/v1785239933/PlantSeller/UI%20Images/4-1_cover_image_wyqt7a.png" }
            },
            { upsert: true, new: true }
        );

        // 4. SEED PHASE - CATEGORIES & PLANTS
        const indoorCategory = await Category.findOneAndUpdate(
            { _id: "650a2b4f9d8c7e6a5b4c3c01" },
            {
                name: "Guest Indoor Plants",
                slug: "guest-indoor-plants",
                description: "Beautiful indoor plants for your home.",
                createdBy: adminUser._id,
                status: "Active",
                isGuestData: true,
                isSeedData: true,
                isDeleted: false
            },
            { upsert: true, new: true }
        );

        const aquaticCategory = await Category.findOneAndUpdate(
            { _id: "650a2b4f9d8c7e6a5b4c3c02" },
            {
                name: "Guest Aquatic Plants",
                slug: "guest-aquatic-plants",
                description: "Beautiful aquatic plants for your home.",
                createdBy: adminUser._id,
                status: "Active",
                isGuestData: true,
                isSeedData: true,
                isDeleted: false
            },
            { upsert: true, new: true }
        );

        const medicinalCategory = await Category.findOneAndUpdate(
            { _id: "650a2b4f9d8c7e6a5b4c3c03" },
            {
                name: "Guest Medicinal Plants",
                slug: "guest-medicinal-plants",
                description: "Beautiful medicinal plants for your home.",
                createdBy: adminUser._id,
                status: "Active",
                isGuestData: true,
                isSeedData: true,
                isDeleted: false
            },
            { upsert: true, new: true }
        );

        const plantsData = [
            {
                _id: "650a2b4f9d8c7e6a5b4c3d21",
                plantName: "Monstera Deliciosa",
                description: "<p><strong>Monstera Deliciosa</strong>, commonly known as the Swiss Cheese Plant, is a popular tropical houseplant admired for its large, glossy green leaves with distinctive natural splits and holes. Native to the rainforests of Central America, it brings a lush, exotic look to homes and offices.</p><p>This low-maintenance plant thrives in bright, indirect sunlight and prefers well-draining soil with moderate watering. Its air-purifying qualities and rapid growth make it an excellent choice for both beginner and experienced plant enthusiasts.</p><h2>Key Features</h2><ul><li>Large, split, heart-shaped green leaves</li><li>Easy to grow and maintain</li><li>Prefers bright, indirect light</li><li>Helps improve indoor air quality</li><li>Perfect for homes, offices, and indoor spaces</li></ul><p>With proper care, Monstera Deliciosa can grow into a stunning statement plant, adding natural beauty and a tropical atmosphere to any interior space.</p>",
                price: 499,
                discount: 10,
                stock: 25,
                category: indoorCategory._id,
                nursery: guestNursery._id,
                user: sellerUser._id,
                isGuestData: true,
                isSeedData: true,
                images: [
                    { public_id: "demo_md_1", url: "https://res.cloudinary.com/dcd6y2awx/image/upload/v1785240309/PlantSeller/UI%20Images/guest-data/Monstera_Deliciosa_2_x7pen1.avif" },
                    { public_id: "demo_md_2", url: "https://res.cloudinary.com/dcd6y2awx/image/upload/v1785240308/PlantSeller/UI%20Images/guest-data/Monstera_Deliciosa_iii8mh.avif" }
                ],
                status: "Published"
            },
            {
                _id: "650a2b4f9d8c7e6a5b4c3d22",
                plantName: "Lotus (Nelumbo nucifera)",
                description: "<p><strong>Lotus (Nelumbo nucifera)</strong> is a beautiful aquatic flowering plant revered for its elegant blooms and deep cultural significance. Native to Asia, it grows in ponds, lakes, and other calm freshwater bodies, producing large fragrant flowers in shades of pink, white, and occasionally yellow.</p><p>The lotus thrives in full sunlight and nutrient-rich soil submerged beneath water. Its broad, circular leaves float gracefully on the water's surface, while its flowers rise above the water, symbolizing purity, resilience, and spiritual enlightenment.</p><h2>Key Features</h2><ul><li>Large, fragrant pink or white flowers</li><li>Thrives in ponds and freshwater gardens</li><li>Requires full sunlight for optimal blooming</li><li>Symbolizes purity, peace, and spiritual growth</li><li>Ideal for water gardens and ornamental landscapes</li></ul><p>With proper care, Lotus (Nelumbo nucifera) produces stunning seasonal blooms that enhance the beauty of any aquatic garden while attracting pollinators such as bees and butterflies.</p>",
                price: 299,
                discount: 5,
                stock: 50,
                category: aquaticCategory._id,
                nursery: guestNursery._id,
                user: sellerUser._id,
                isGuestData: true,
                isSeedData: true,
                images: [
                    { public_id: "demo_lnn_1", url: "https://res.cloudinary.com/dcd6y2awx/image/upload/v1785241578/PlantSeller/UI%20Images/guest-data/Lotus_01_fujsay.avif" },
                    { public_id: "demo_lnn_2", url: "https://res.cloudinary.com/dcd6y2awx/image/upload/v1785241581/PlantSeller/UI%20Images/guest-data/Lotus_02_tpsaxn.avif" }
                ],
                status: "Published"
            },
            {
                _id: "650a2b4f9d8c7e6a5b4c3d23",
                plantName: "Fiddle Leaf Fig",
                description: "<p><strong>Fiddle Leaf Fig</strong> is a popular indoor ornamental plant known for its large, glossy, violin-shaped leaves and striking architectural appearance. Native to the tropical rainforests of West Africa, it is a favorite choice for homes, offices, and modern interior spaces.</p><p>This elegant plant thrives in bright, indirect sunlight and prefers well-draining soil with moderate watering. With proper care and consistent conditions, the Fiddle Leaf Fig can grow into a stunning focal point, adding height, greenery, and sophistication to any room.</p><h2>Key Features</h2><ul><li>Large, glossy, fiddle-shaped green leaves</li><li>Ideal for bright indoor spaces</li><li>Easy to maintain with proper care</li><li>Enhances interior décor with a bold tropical look</li><li>Perfect for homes, offices, and commercial interiors</li></ul><p>The Fiddle Leaf Fig is an excellent choice for plant enthusiasts seeking a stylish, long-lasting houseplant that brings natural beauty and a refreshing ambiance to indoor environments.</p>",
                price: 899,
                discount: 15,
                stock: 10,
                category: indoorCategory._id,
                nursery: guestNursery._id,
                user: sellerUser._id,
                isGuestData: true,
                isSeedData: true,
                images: [
                    { public_id: "demo_flf_1", url: "https://res.cloudinary.com/dcd6y2awx/image/upload/v1785241001/PlantSeller/UI%20Images/guest-data/Fiddle_Leaf_Fig_01_zvoavp.avif" },
                    { public_id: "demo_flf_2", url: "https://res.cloudinary.com/dcd6y2awx/image/upload/v1785241002/PlantSeller/UI%20Images/guest-data/Fiddle_Leaf_Fig_02_ovs6ni.avif" },
                    { public_id: "demo_flf_3", url: "https://res.cloudinary.com/dcd6y2awx/image/upload/v1785241004/PlantSeller/UI%20Images/guest-data/Fiddle_Leaf_Fig_03_fxqjxs.avif" }
                ],
                status: "Published"
            },
            {
                _id: "650a2b4f9d8c7e6a5b4c3d24",
                plantName: "Peace Lily",
                description: "<p><strong>Peace Lily</strong> is a graceful indoor plant cherished for its lush dark green foliage and elegant white blooms. Native to the tropical regions of the Americas and Southeast Asia, it is one of the most popular houseplants due to its beauty, low maintenance, and air-purifying properties.</p><p>This hardy plant thrives in bright, indirect light but can also tolerate low-light conditions. It prefers consistently moist, well-draining soil and rewards proper care with stunning white flowers that bloom throughout the year.</p><h2>Key Features</h2><ul><li>Elegant white flowers and glossy green leaves</li><li>Excellent air-purifying indoor plant</li><li>Thrives in low to bright indirect light</li><li>Easy to care for and beginner-friendly</li><li>Perfect for homes, offices, and indoor spaces</li></ul><p>With minimal care, the Peace Lily adds natural beauty, freshness, and a calming atmosphere to any indoor environment while helping improve indoor air quality.</p>",
                price: 349,
                discount: 0,
                stock: 30,
                category: indoorCategory._id,
                nursery: guestNursery._id,
                user: sellerUser._id,
                isGuestData: true,
                isSeedData: true,
                images: [
                    { public_id: "demo_pl_1", url: "https://res.cloudinary.com/dcd6y2awx/image/upload/v1785241226/PlantSeller/UI%20Images/guest-data/Peace_Lily_01_vfzgdt.avif" },
                    { public_id: "demo_pl_2", url: "https://res.cloudinary.com/dcd6y2awx/image/upload/v1785241229/PlantSeller/UI%20Images/guest-data/Peace_Lily_02_uk460h.avif" }
                ],
                status: "Published"
            },
            {
                _id: "650a2b4f9d8c7e6a5b4c3d25",
                plantName: "Aloe Vera",
                description: "<p><strong>Aloe Vera</strong> is a popular succulent plant known for its thick, fleshy green leaves filled with a soothing gel commonly used in skincare and wellness products. Native to the Arabian Peninsula, it is widely grown as an indoor and outdoor plant for its medicinal, ornamental, and easy-care qualities.</p><p>This low-maintenance plant thrives in bright, indirect sunlight and prefers dry, well-draining soil with minimal watering. Its drought-resistant nature makes Aloe Vera an excellent choice for beginners and plant enthusiasts looking for a hardy and attractive succulent.</p><h2>Key Features</h2><ul><li>Thick, pointed leaves containing soothing gel</li><li>Requires minimal watering and care</li><li>Thrives in bright light and dry conditions</li><li>Popular for skincare and wellness uses</li><li>Ideal for homes, offices, and indoor gardens</li></ul><p>With proper care, Aloe Vera grows into a healthy, attractive plant that adds greenery to any space while providing natural benefits and a refreshing touch to indoor environments.</p>",
                price: 199,
                discount: 0,
                stock: 100,
                category: medicinalCategory._id,
                nursery: guestNursery._id,
                user: sellerUser._id,
                isGuestData: true,
                isSeedData: true,
                images: [
                    { public_id: "demo_av_1", url: "https://res.cloudinary.com/dcd6y2awx/image/upload/v1785241376/PlantSeller/UI%20Images/guest-data/Aloe_Vera_02_nz1dhl.avif" },
                    { public_id: "demo_av_2", url: "https://res.cloudinary.com/dcd6y2awx/image/upload/v1785241373/PlantSeller/UI%20Images/guest-data/Aloe_Vera_01_vrv64t.avif" }
                ],
                status: "Published"
            }
        ];

        for (const p of plantsData) {
            await Plant.findOneAndUpdate(
                { _id: p._id },
                { ...p, isDeleted: false },
                { upsert: true, new: true }
            );
        }

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
