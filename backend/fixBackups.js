const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'scripts', 'plant-seller-guest-data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

let totalFixed = 0;

for (const file of files) {
    const filePath = path.join(dataDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    try {
        const data = JSON.parse(content);
        let modified = false;
        
        if (Array.isArray(data)) {
            data.forEach(item => {
                if (!item.isGuestData || !item.isSeedData) {
                    item.isGuestData = true;
                    item.isSeedData = true;
                    modified = true;
                    totalFixed++;
                }
            });
            
            if (modified) {
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
                console.log(`Updated ${file} with isGuestData and isSeedData.`);
            } else {
                console.log(`${file} is already correct.`);
            }
        }
    } catch (e) {
        console.error(`Error parsing ${file}:`, e.message);
    }
}

console.log(`Finished fixing backup files. Fixed ${totalFixed} records.`);
