const User = require('../model/userModel/user');
const Nursery = require('../model/nurseryModel/nursery');
const Plant = require('../model/nurseryModel/plants');
const Order = require('../model/checkoutModel/orders');

const adminController = {
    // Get Dashboard Stats
    getStats: async (req, res, next) => {
        try {
            const filter = req.query.filter || 'Monthly'; // Weekly, Monthly, Yearly

            const totalUsers = await User.countDocuments();
            const totalNurseries = await Nursery.countDocuments();
            const totalPlants = await Plant.countDocuments();
            const totalOrders = await Order.countDocuments();
            
            const revenueAgg = await Order.aggregate([
                { $match: { "payment.status": { $ne: 'Failed' } } },
                { $group: { _id: null, totalRevenue: { $sum: '$pricing.totalPrice' } } }
            ]);
            const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

            // Doughnut Graph data: Order item status
            const doughnutAgg = await Order.aggregate([
                { $unwind: "$orderItems" },
                { $group: { _id: "$orderItems.orderStatus.status", count: { $sum: 1 } } }
            ]);

            // Format doughnut graph data
            let doughnutData = { labels: [], data: [] };
            doughnutAgg.forEach(item => {
                doughnutData.labels.push(item._id || 'Pending');
                doughnutData.data.push(item.count);
            });
            if (doughnutData.labels.length === 0) {
                doughnutData = { labels: ['Pending', 'Completed'], data: [0, 0] };
            }

            // Bar Graph data: Revenue grouped by date based on filter
            let groupStage = { $month: "$orderAt" };
            if (filter === 'Weekly') groupStage = { $isoWeek: "$orderAt" };
            if (filter === 'Yearly') groupStage = { $year: "$orderAt" };

            const barAgg = await Order.aggregate([
                { $match: { "payment.status": { $ne: 'Failed' } } },
                { 
                    $group: { 
                        _id: groupStage, 
                        revenue: { $sum: '$pricing.totalPrice' } 
                    } 
                },
                { $sort: { _id: 1 } } // Sort by time ascending
            ]);

            // Format bar graph data
            let barData = { labels: [], data: [] };
            barAgg.forEach(item => {
                let label = item._id;
                if (filter === 'Monthly') {
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    label = monthNames[item._id - 1] || item._id;
                } else if (filter === 'Weekly') {
                    label = `Week ${item._id}`;
                } else if (filter === 'Yearly') {
                    label = `${item._id}`;
                }
                barData.labels.push(label);
                barData.data.push(item.revenue);
            });

            res.status(200).json({
                success: true,
                stats: {
                    totalUsers,
                    totalNurseries,
                    totalPlants,
                    totalOrders,
                    totalRevenue,
                    barData,
                    doughnutData
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

    // Get all plants with aggregations for dashboard
    getPlants: async (req, res, next) => {
        try {
            const { year, search, filter } = req.query;
            const targetYear = year ? parseInt(year) : new Date().getFullYear();

            // 1. Line Chart Data: Monthly Published Products
            const lineChartAggregation = await Plant.aggregate([
                {
                    $match: {
                        postedAt: {
                            $gte: new Date(`${targetYear}-01-01`),
                            $lte: new Date(`${targetYear}-12-31`)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$postedAt" },
                        count: { $sum: 1 }
                    }
                }
            ]);

            const lineData = new Array(12).fill(0);
            lineChartAggregation.forEach(item => {
                lineData[item._id - 1] = item.count;
            });

            // 2. Polar Area Chart Data: Status of Products
            const statusAggregation = await Plant.aggregate([
                {
                    $group: {
                        _id: { $ifNull: ["$status", "Draft"] }, // Handle missing status as Draft
                        count: { $sum: 1 }
                    }
                }
            ]);

            const polarData = { Published: 0, Draft: 0, "On Hold": 0 };
            statusAggregation.forEach(item => {
                if (item._id === 'Published') polarData.Published = item.count;
                if (item._id === 'Draft') polarData.Draft = item.count;
                if (item._id === 'On Hold') polarData["On Hold"] = item.count;
            });

            // 3. Table Data: Search and Filter
            let query = {};
            
            if (search) {
                const keywords = search.trim().split(/\s+/);
                query.$or = [
                    { plantName: { $regex: keywords.join('|'), $options: 'i' } },
                    { category: { $regex: keywords.join('|'), $options: 'i' } }
                ];
            }

            if (filter && filter !== 'All') {
                // If filter is specific (e.g. by status, but UI mockup didn't specify exactly what it filters, assuming time-based or category)
                // For now we just support search.
            }

            const plants = await Plant.find(query)
                .populate('nursery', 'nurseryName')
                .sort({ postedAt: -1 })
                .limit(50); // Pagination can be added later

            res.status(200).json({ 
                success: true, 
                stats: {
                    lineChart: lineData,
                    polarChart: [polarData.Published, polarData.Draft, polarData["On Hold"]]
                },
                plants 
            });
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
