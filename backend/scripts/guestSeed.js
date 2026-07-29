const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { ObjectId } = mongoose.Types;

function convertExtendedJson(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(convertExtendedJson);
    }
    if (obj.$oid) {
        return new ObjectId(obj.$oid);
    }
    if (obj.$date) {
        return new Date(obj.$date);
    }
    // Specific check for Mongoose $numberDecimal if present in backups
    if (obj.$numberDecimal) {
        return mongoose.Types.Decimal128.fromString(obj.$numberDecimal);
    }
    const newObj = {};
    for (const key in obj) {
        newObj[key] = convertExtendedJson(obj[key]);
    }
    return newObj;
}

async function cleanUpNonSeedGuestData() {
    console.log("Cleaning up non-seed guest data (hard delete)...");
    
    // We will find all collections that have documents where isGuestData is true and isSeedData is false/missing.
    const collections = await mongoose.connection.db.collections();
    
    for (let collection of collections) {
        try {
            // Delete anything created by a guest user that isn't seed data
            const result = await collection.deleteMany({
                isGuestData: true,
                isSeedData: { $ne: true }
            });
            if (result.deletedCount > 0) {
                console.log(`Deleted ${result.deletedCount} non-seed guest documents from ${collection.collectionName}`);
            }
        } catch (err) {
            console.log(`Could not clean up collection ${collection.collectionName}: ${err.message}`);
        }
    }
}

async function restoreSeedData() {
    const dataDir = path.join(__dirname, 'plant-seller-guest-data');
    if (!fs.existsSync(dataDir)) {
        console.error(`Backup data directory not found at ${dataDir}`);
        return;
    }

    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
        // Filename format: <db>.<collection>.json (e.g. admin.categories.json)
        // Or if it's just <collection>.json, we handle that too.
        const parts = file.split('.');
        const collectionName = parts.length > 2 ? parts[1] : parts[0]; 
        
        console.log(`Restoring collection: ${collectionName} from ${file}...`);
        
        try {
            const fileContent = fs.readFileSync(path.join(dataDir, file), 'utf-8');
            const jsonData = JSON.parse(fileContent);
            
            const documents = convertExtendedJson(jsonData);
            
            if (!Array.isArray(documents) || documents.length === 0) {
                console.log(`No documents found in ${file}. Skipping.`);
                continue;
            }

            const collection = mongoose.connection.db.collection(collectionName);
            
            // Prepare bulk operations: ReplaceOne with upsert:true guarantees 100% exact match
            const bulkOps = documents.map(doc => ({
                replaceOne: {
                    filter: { _id: doc._id },
                    replacement: doc,
                    upsert: true
                }
            }));
            
            const result = await collection.bulkWrite(bulkOps);
            console.log(`Restored ${collectionName}: ${result.upsertedCount} inserted, ${result.modifiedCount} modified.`);
        } catch (error) {
            console.error(`Failed to restore collection ${collectionName} from ${file}:`, error.message);
        }
    }
}

async function seedGuestData() {
    console.log("Starting Guest Data Wipe & Re-seed Process...");
    try {
        await cleanUpNonSeedGuestData();
        await restoreSeedData();
        console.log("Guest Data Wiped & Re-seeded Successfully!");
    } catch (error) {
        console.error("Critical Error during Guest Data Wipe & Re-seed:", error);
    }
}

module.exports = seedGuestData;
