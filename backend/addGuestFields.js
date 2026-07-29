const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            if (!content.includes('isGuestData: {') && !content.includes('isGuestData: { type: Boolean')) {
                // Find the schema definition
                const match = content.match(/new mongoose\.Schema\(\s*\{/);
                if (match) {
                    const insertIdx = match.index + match[0].length;
                    content = content.slice(0, insertIdx) + 
                        `\n    isGuestData: { type: Boolean, default: false },\n    isSeedData: { type: Boolean, default: false },` + 
                        content.slice(insertIdx);
                    fs.writeFileSync(fullPath, content, 'utf-8');
                    console.log(`Added guest fields to ${file}`);
                }
            } else if (!content.includes('isSeedData: {')) {
                 const match = content.match(/isGuestData: \{[\s\S]*?\},/);
                 if (match) {
                    const insertIdx = match.index + match[0].length;
                    content = content.slice(0, insertIdx) + 
                        `\n    isSeedData: { type: Boolean, default: false },` + 
                        content.slice(insertIdx);
                    fs.writeFileSync(fullPath, content, 'utf-8');
                    console.log(`Added isSeedData field to ${file}`);
                 }
            }
        }
    }
}

processDir(path.join(__dirname, 'src', 'model'));
console.log('Finished updating models.');
