const { createClient } = require('redis');

// Initialize the Redis Client
const client = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis connected Successfully!'));
client.on('ready', () => console.log('Redis Client Ready'));

// Connect to the server
const connectRedis = async () => {
    try {
        if (!client.isOpen) {
            await client.connect();
        }
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
    }
}

connectRedis();

module.exports = client;
