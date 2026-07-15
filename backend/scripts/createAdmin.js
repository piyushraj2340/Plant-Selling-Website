const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/model/userModel/user');

// Load env vars
dotenv.config();

const createAdmin = async () => {
    try {
        const mongoURI = `mongodb+srv://${process.env.COLLECTION_NAME}:${process.env.COLLECTION_PASSWORD}@${process.env.COLLECTION_NAME}.cbqsaya.mongodb.net/?retryWrites=true&w=majority`;
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
