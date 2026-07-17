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
                status: true,
                message: "Admin Stats Fetched Successfully",
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
            res.status(200).json({ status: true, message: "Users fetched successfully", users });
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
                status: true,
                message: "Admin Plants Fetched Successfully",
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
            const { year, search, filter } = req.query;
            const targetYear = parseInt(year) || new Date().getFullYear();

            // 1. Line/Bar Chart Data: Orders per month for the given year
            const startOfYear = new Date(`${targetYear}-01-01T00:00:00.000Z`);
            const endOfYear = new Date(`${targetYear}-12-31T23:59:59.999Z`);
            
            const ordersByMonth = await Order.aggregate([
                { $match: { orderAt: { $gte: startOfYear, $lte: endOfYear } } },
                { $group: { _id: { $month: "$orderAt" }, count: { $sum: 1 } } }
            ]);

            const barData = new Array(12).fill(0);
            ordersByMonth.forEach(item => {
                if (item._id >= 1 && item._id <= 12) {
                    barData[item._id - 1] = item.count;
                }
            });

            // 2. Pie Chart Data: Orders by plant category
            const categoryAgg = await Order.aggregate([
                { $unwind: "$orderItems" },
                { $lookup: { from: "plants", localField: "orderItems.plant", foreignField: "_id", as: "plantDetails" } },
                { $unwind: { path: "$plantDetails", preserveNullAndEmptyArrays: true } },
                { $group: { _id: "$plantDetails.category", count: { $sum: 1 } } }
            ]);

            const pieLabels = [];
            const pieData = [];
            categoryAgg.forEach(item => {
                const cat = item._id ? item._id.toUpperCase() : 'OTHER';
                pieLabels.push(cat);
                pieData.push(item.count);
            });

            // 3. Table Data: Orders filtering
            // For simplicity, we just filter all orders and populate user, and then let frontend search order items
            let query = {};
            if (search) {
                query = { _id: search }; // Very basic search by Order ID for now, as searching populated fields is complex in Mongoose without aggregates.
                // Could expand this to use aggregation for deep searching if necessary.
                try {
                    query = { _id: search.trim() };
                } catch (e) {
                    query = {}; // Invalid ObjectId
                }
            }

            const orders = await Order.find(query).populate('user').populate('orderItems.nursery').sort({ orderAt: -1 });
            
            res.status(200).json({ 
                status: true, 
                message: "Orders fetched successfully", 
                stats: {
                    barChart: barData,
                    pieChart: { labels: pieLabels, data: pieData }
                },
                orders 
            });
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
                status: true,
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
    },

    // Get all reviews
    getAllReviews: async (req, res, next) => {
        try {
            const Review = require('../model/nurseryModel/review');
            const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
            
            // Build matching query based on search and filter if needed
            // For now, fetch all as we're doing basic stats
            const reviews = await Review.find().populate('user', 'name email avatar').populate('plant', 'plantName category images').sort({ _id: -1 });
            
            // Stats calculation
            const starCounts = [0, 0, 0, 0, 0];
            const monthRatings = Array(12).fill(0);
            const monthCounts = Array(12).fill(0);

            reviews.forEach(review => {
                // Pie Chart: Count by star rating
                const rating = Math.floor(review.rating);
                if (rating >= 1 && rating <= 5) {
                    starCounts[rating - 1]++;
                }

                // Line Chart: Average rating per month for the selected year
                const reviewDate = review.createdAt ? new Date(review.createdAt) : new Date(); // Fallback if no createdAt
                if (reviewDate.getFullYear() === year) {
                    const month = reviewDate.getMonth();
                    monthRatings[month] += review.rating;
                    monthCounts[month]++;
                }
            });

            // Calculate monthly averages
            const lineData = monthRatings.map((total, index) => {
                return monthCounts[index] > 0 ? parseFloat((total / monthCounts[index]).toFixed(1)) : 0;
            });

            res.status(200).json({ 
                status: true, 
                message: "Reviews fetched successfully", 
                stats: {
                    lineChart: lineData,
                    pieChart: {
                        labels: ['1 Star Rating', '2 Star Rating', '3 Star Rating', '4 Star Rating', '5 Star Rating'],
                        data: starCounts
                    }
                },
                reviews 
            });
        } catch (error) {
            next(error);
        }
    },

    // Update review status
    updateReviewStatus: async (req, res, next) => {
        try {
            const Review = require('../model/nurseryModel/review');
            const Plant = require('../model/nurseryModel/plants');
            const { status } = req.body;
            const reviewId = req.params.id;

            if (!['Approved', 'Rejected'].includes(status)) {
                const error = new Error("Invalid status");
                error.statusCode = 400;
                throw error;
            }

            const review = await Review.findByIdAndUpdate(reviewId, { status }, { new: true });
            
            if (!review) {
                const error = new Error("Review not found");
                error.statusCode = 404;
                throw error;
            }

            // Recalculate average rating for the plant if it was approved
            if (status === 'Approved') {
                const allApproved = await Review.find({ plant: review.plant, status: 'Approved' });
                const numOfReviews = allApproved.length;
                const ratings = numOfReviews > 0 ? (allApproved.reduce((acc, curr) => acc + curr.rating, 0) / numOfReviews) : 0;
                
                await Plant.findByIdAndUpdate(review.plant, { ratings, numOfReviews });
            }

            res.status(200).json({ status: true, message: `Review ${status.toLowerCase()} successfully`, review });
        } catch (error) {
            next(error);
        }
    },

    // Update plant status
    updatePlantStatus: async (req, res, next) => {
        try {
            const Plant = require('../model/nurseryModel/plants');
            const { status } = req.body;
            const plantId = req.params.id;

            if (!['Published', 'Draft', 'On Hold'].includes(status)) {
                const error = new Error("Invalid status");
                error.statusCode = 400;
                throw error;
            }

            const plant = await Plant.findByIdAndUpdate(plantId, { status }, { new: true });

            if (!plant) {
                const error = new Error("Plant not found");
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({ status: true, message: `Product status updated to ${status} successfully`, plant });
        } catch (error) {
            next(error);
        }
    },

    // Bulk update plant status
    bulkUpdatePlantStatus: async (req, res, next) => {
        try {
            const Plant = require('../model/nurseryModel/plants');
            const { ids, status } = req.body;

            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                const error = new Error("Product IDs are required");
                error.statusCode = 400;
                throw error;
            }

            if (!['Published', 'Draft', 'On Hold'].includes(status)) {
                const error = new Error("Invalid status");
                error.statusCode = 400;
                throw error;
            }

            await Plant.updateMany({ _id: { $in: ids } }, { status });

            res.status(200).json({ status: true, message: `Bulk updated ${ids.length} products to ${status} successfully` });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = adminController;
