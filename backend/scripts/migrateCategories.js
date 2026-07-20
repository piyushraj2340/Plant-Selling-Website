require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
if (process.env.NODE_ENV !== "production") {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
}
const Plant = require('../src/model/nurseryModel/plants');
const Category = require('../src/model/category');
require('../src/model/userModel/user');

const migrate = async () => {
    try {
        const DB = `mongodb+srv://${process.env.COLLECTION_NAME}:${process.env.COLLECTION_PASSWORD}@${process.env.COLLECTION_NAME}.cbqsaya.mongodb.net/?retryWrites=true&w=majority`;
        await mongoose.connect(DB, { useNewUrlParser: true });
        console.log('Connected to DB');

        const plants = await Plant.find({});
        const uniqueCategories = [...new Set(plants.map(p => p.category).filter(c => typeof c === 'string' || !mongoose.Types.ObjectId.isValid(c)))];

        console.log('Unique categories to migrate:', uniqueCategories);

        // Create categories
        const categoryMap = {};
        for (const catName of uniqueCategories) {
            if (mongoose.Types.ObjectId.isValid(catName)) continue;
            
            const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            
            let cat = await Category.findOne({ slug });
            if (!cat) {
                cat = new Category({
                    name: catName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    slug,
                    status: 'Active',
                    createdBy: null // Or an admin ID, but for migration null is fine if schema allows, wait we set required: true
                });
                // We need to disable validation for createdBy or set a dummy user ID
                const dummyUser = await mongoose.model('user').findOne({ role: 'admin' });
                if (dummyUser) cat.createdBy = dummyUser._id;
                else cat.createdBy = new mongoose.Types.ObjectId();
                
                await cat.save();
                console.log('Created category:', cat.name);
            }
            categoryMap[catName] = cat._id;
        }

        // Update plants
        let updatedCount = 0;
        for (const plant of plants) {
            if (categoryMap[plant.category]) {
                plant.category = categoryMap[plant.category];
                await plant.save({ validateBeforeSave: false });
                updatedCount++;
            }
        }
        console.log('Successfully migrated ' + updatedCount + ' plants.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
