const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('node:dns');
const User = require('../src/model/userModel/user');

// Force IPv4 first to bypass Node.js IPv6 DNS resolution issues
dns.setDefaultResultOrder('ipv4first');

// Bypass local ISP DNS issues by using Google's public DNS in development
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

// Load env vars
dotenv.config();

const createAdmin = async () => {
    try {
        const mongoURI = `mongodb+srv://${process.env.COLLECTION_NAME}:${process.env.COLLECTION_PASSWORD}@cluster0.x5x3wnd.mongodb.net/plant-selling-website?retryWrites=true&w=majority`;
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected...');

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error('Please define ADMIN_EMAIL and ADMIN_PASSWORD in your .env file.');
            process.exit(1);
        }

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            if (!existingAdmin.role.includes('admin')) {
                existingAdmin.role.push('admin');
                await existingAdmin.save();
                console.log('Admin role added to existing user.');
            } else {
                console.log('Admin user already exists.');
            }
            process.exit(0);
        }

        const adminUser = new User({
            name: 'System Admin',
            email: adminEmail,
            phone: '9999999999', // Placeholder phone
            password: adminPassword,
            gender: 'Male',
            age: 30,
            role: ['user', 'admin'],
            isUserVerified: true
        });

        await adminUser.save();
        console.log('Admin user created successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
