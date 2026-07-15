const User = require('../model/userModel/user');
const Nursery = require('../model/nurseryModel/nursery');
const Plant = require('../model/nurseryModel/plants');
const Order = require('../model/checkoutModel/orders');

const adminController = {
    // Get Dashboard Stats
    getStats: async (req, res, next) => {
        try {
            const totalUsers = await User.countDocuments();
            const totalNurseries = await Nursery.countDocuments();
            const totalPlants = await Plant.countDocuments();
            const totalOrders = await Order.countDocuments();
            
            // Assuming revenue calculation requires aggregating over orders
            const revenueAgg = await Order.aggregate([
                { $match: { orderStatus: { $ne: 'Cancelled' } } },
                { $group: { _id: null, totalRevenue: { $sum: '$pricing.totalPrice' } } }
            ]);
            const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

            res.status(200).json({
                success: true,
                stats: {
                    totalUsers,
                    totalNurseries,
                    totalPlants,
                    totalOrders,
                    totalRevenue
                }
            });
        } catch (error) {
            next(error);
        }
    },

    // Get all users
    getUsers: async (req, res, next) => {
        try {
            const users = await User.find().select('-password -tokens');
            res.status(200).json({ success: true, users });
        } catch (error) {
            next(error);
        }
    },

    // Get all plants
    getPlants: async (req, res, next) => {
        try {
            const plants = await Plant.find().populate('nursery');
            res.status(200).json({ success: true, plants });
        } catch (error) {
            next(error);
        }
    },

    // Get all orders
    getOrders: async (req, res, next) => {
        try {
            const orders = await Order.find().populate('user').populate('nursery');
            res.status(200).json({ success: true, orders });
        } catch (error) {
            next(error);
        }
    },

    // Impersonate User
    impersonateUser: async (req, res, next) => {
        try {
            const { targetUserId } = req.body;
            if (!targetUserId) {
                const error = new Error("Target user ID is required");
                error.statusCode = 400;
                throw error;
            }

            const targetUser = await User.findById(targetUserId);
            if (!targetUser) {
                const error = new Error("Target user not found");
                error.statusCode = 404;
                throw error;
            }

            const tokens = await targetUser.generateAuthToken();
            
            res.status(200).json({
                success: true,
                message: `Impersonating ${targetUser.email}`,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    _id: targetUser._id,
                    name: targetUser.name,
                    email: targetUser.email,
                    role: targetUser.role
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = adminController;
