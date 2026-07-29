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
    const newObj = {};
    for (const key in obj) {
        newObj[key] = convertExtendedJson(obj[key]);
    }
    return newObj;
}

const testData = [{
  "_id": {
    "$oid": "6a68a9324fb50f72fc0ccf52"
  },
  "name": "Guest Indoor Plants",
  "createdAt": {
    "$date": "2023-01-01T00:00:00.000Z"
  }
}];

const result = convertExtendedJson(testData);
console.log(result);
