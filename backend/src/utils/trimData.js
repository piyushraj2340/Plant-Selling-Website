// utils/trimData.js

function trimData(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
  
    // Recursively iterate over object properties
    for (let key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
  
      // Trim string properties
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      }
      
      // If it's an array, apply trimming to each element
      if (Array.isArray(obj[key])) {
        obj[key] = obj[key].map(item => trimData(item));
      }
      
      // If it's an object, recursively apply trimming
      if (typeof obj[key] === 'object') {
        obj[key] = trimData(obj[key]);
      }
    }
  
    return obj;
  }
  
  module.exports = trimData;
  