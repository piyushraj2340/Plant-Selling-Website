const client = require('./redisClient');

async function getData(userId, token, key) {
    try {
        const fullKey = `${process.env.REDIS_VERCEL_KV_DB || 'development'}:${userId}:${token}:${key}`;
        const result = await client.get(fullKey);

        if (!result) {
            const error = new Error(`Data from redis not found: key - ${key}`);
            error.statusCode = 403;
            throw error;
        }

        return JSON.parse(result);
    } catch (error) {
        // Pass error to error handling middleware
        console.log(error);
        if (error.statusCode) throw error;
    }
}

async function setData(userId, token, key, data, expire) {
    try {
        const fullKey = `${process.env.REDIS_VERCEL_KV_DB || 'development'}:${userId}:${token}:${key}`;
        await client.set(fullKey, JSON.stringify(data), { EX: expire });
    } catch (error) {
        // Pass error to error handling middleware
        console.log(error);
    }
}

async function deleteData(userId, token, key) {
    try {
        const fullKey = `${process.env.REDIS_VERCEL_KV_DB || 'development'}:${userId}:${token}:${key}`;
        await client.del(fullKey);
    } catch (error) {
        // Pass error to error handling middleware
        console.log(error);
    }
}

async function deleteMultipleData(keysArray) {
    try {
        if (keysArray.length > 0) {
            await client.del(keysArray);
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = { getData, setData, deleteData, deleteMultipleData };
