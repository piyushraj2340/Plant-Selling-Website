const { kv } = require('@vercel/kv'); // Import the appropriate Redis client library

async function getData(userId, orderToken, key) {
    try {
        const result = await kv.json.get(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:${orderToken}:${key}`);

        if (!result) {
            const error = new Error(`Data from redis not found: key - ${key}`);
            error.statusCode = 403;
            throw error;
        }

        return result;

    } catch (error) {
        // Pass error to error handling middleware
        console.log(error);
    }
}

async function setData(userId, token, key, data, expire) {
    try {
        await kv.json.set(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:${token}:${key}`, "$", JSON.stringify(data));
        await kv.expire(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:${token}:${key}`, expire);
    } catch (error) {
        // Pass error to error handling middleware
        console.log(error);
    }

}

async function deleteData(userId, token, key) {
    try {
        await kv.json. del(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:${token}:${key}`);
    } catch (error) {
        // Pass error to error handling middleware
        console.log(error);
    }
}


module.exports = { getData, deleteData, setData };