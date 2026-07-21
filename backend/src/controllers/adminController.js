const User = require('../model/userModel/user');
const Nursery = require('../model/nurseryModel/nursery');
const Plant = require('../model/nurseryModel/plants');
const Order = require('../model/checkoutModel/orders');
const Contact = require('../model/contact');
const { replyToContactMessageEmail } = require('./smtp/emailController');

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
                { $lookup: { from: "orderitems", localField: "orderItems", foreignField: "_id", as: "populatedOrderItem" } },
                { $unwind: "$populatedOrderItem" },
                { $group: { _id: "$populatedOrderItem.orderStatus.status", count: { $sum: 1 } } }
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

    // Delete a single user
    deleteUser: async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                const error = new Error("User not found");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ status: true, message: "User deleted successfully", id });
        } catch (error) {
            next(error);
        }
    },

    // Bulk delete users
    bulkDeleteUsers: async (req, res, next) => {
        try {
            const { ids } = req.body;
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                const error = new Error("No user IDs provided");
                error.statusCode = 400;
                throw error;
            }

            const result = await User.deleteMany({ _id: { $in: ids } });
            res.status(200).json({ status: true, message: `${result.deletedCount} users deleted successfully`, ids });
        } catch (error) {
            next(error);
        }
    },

    // Update user role
    updateUserRole: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!role || !Array.isArray(role)) {
                const error = new Error("Valid role array is required");
                error.statusCode = 400;
                throw error;
            }

            const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password -tokens');
            if (!user) {
                const error = new Error("User not found");
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({ status: true, message: "User role updated successfully", user });
        } catch (error) {
            next(error);
        }
    },

    // Update user password
    updateUserPassword: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { password } = req.body;

            if (!password || password.length < 6) {
                const error = new Error("Password must be at least 6 characters long");
                error.statusCode = 400;
                throw error;
            }

            const bcryptjs = require('bcryptjs');
            const hashPassword = await bcryptjs.hash(password, 10);

            const user = await User.findByIdAndUpdate(id, { password: hashPassword }, { new: true }).select('-password -tokens');
            if (!user) {
                const error = new Error("User not found");
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({ status: true, message: "User password updated successfully", user });
        } catch (error) {
            next(error);
        }
    },

    // Toggle block user
    toggleBlockUser: async (req, res, next) => {
        try {
            const { id } = req.params;

            const user = await User.findById(id);
            if (!user) {
                const error = new Error("User not found");
                error.statusCode = 404;
                throw error;
            }

            user.isBlocked = !user.isBlocked;
            await user.save();

            const updatedUser = await User.findById(id).select('-password -tokens');
            res.status(200).json({ status: true, message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user: updatedUser });
        } catch (error) {
            next(error);
        }
    },

    // Toggle verify user
    toggleVerifyUser: async (req, res, next) => {
        try {
            const { id } = req.params;

            const user = await User.findById(id);
            if (!user) {
                const error = new Error("User not found");
                error.statusCode = 404;
                throw error;
            }

            user.isUserVerified = !user.isUserVerified;
            await user.save();

            const updatedUser = await User.findById(id).select('-password -tokens');
            res.status(200).json({ status: true, message: `User has been ${user.isUserVerified ? 'verified' : 'unverified'} successfully`, user: updatedUser });
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
                { $lookup: { from: "orderitems", localField: "orderItems", foreignField: "_id", as: "populatedOrderItem" } },
                { $unwind: "$populatedOrderItem" },
                { $lookup: { from: "plants", localField: "populatedOrderItem.plant", foreignField: "_id", as: "plantDetails" } },
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

            const orders = await Order.find(query)
                .populate('user')
                .populate({
                    path: 'orderItems',
                    populate: [
                        { path: 'nursery' },
                        { path: 'plant' } // Need plant populated to show stock or correct images if needed
                    ]
                })
                .sort({ orderAt: -1 });
            
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

            const tokens = await targetUser.generateImpersonationToken();
            
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
            const reviews = await Review.find().populate('user', 'name email avatar').populate('plant', 'plantName category images price discount').sort({ _id: -1 });
            
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

    // Bulk update review status
    bulkUpdateReviewStatus: async (req, res, next) => {
        try {
            const Review = require('../model/nurseryModel/review');
            const Plant = require('../model/nurseryModel/plants');
            const { ids, status } = req.body;

            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                const error = new Error("Review IDs are required");
                error.statusCode = 400;
                throw error;
            }

            if (!['Approved', 'Rejected'].includes(status)) {
                const error = new Error("Invalid status");
                error.statusCode = 400;
                throw error;
            }

            await Review.updateMany({ _id: { $in: ids } }, { status });

            // Recalculate average ratings for all plants whose reviews were approved
            if (status === 'Approved') {
                const reviews = await Review.find({ _id: { $in: ids } });
                const plantIds = [...new Set(reviews.map(r => r.plant.toString()))];

                for (const plantId of plantIds) {
                    const allApproved = await Review.find({ plant: plantId, status: 'Approved' });
                    const numOfReviews = allApproved.length;
                    const ratings = numOfReviews > 0 ? (allApproved.reduce((acc, curr) => acc + curr.rating, 0) / numOfReviews) : 0;
                    await Plant.findByIdAndUpdate(plantId, { ratings, numOfReviews });
                }
            }

            res.status(200).json({ status: true, message: `Bulk updated ${ids.length} reviews to ${status} successfully` });
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
    },

    // Update individual order item status
    updateOrderItemStatus: async (req, res, next) => {
        try {
            const { orderId, itemId } = req.params;
            const { status, message } = req.body;

            const order = await Order.findOneAndUpdate(
                { _id: orderId, "orderItems._id": itemId },
                {
                    $set: {
                        "orderItems.$.orderStatus.status": status,
                        "orderItems.$.orderStatus.message": message || `${status} status updated`,
                        "orderItems.$.orderStatus.statusAt": new Date()
                    }
                },
                { new: true }
            );

            if (!order) {
                const error = new Error("Order item not found");
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({ status: true, message: `Order status updated to ${status} successfully`, order });
        } catch (error) {
            next(error);
        }
    },

    // Bulk update order items status
    bulkUpdateOrderItemStatus: async (req, res, next) => {
        try {
            const { keys, status, message } = req.body;
            if (!keys || !Array.isArray(keys) || keys.length === 0) {
                const error = new Error("Keys are required");
                error.statusCode = 400;
                throw error;
            }

            const bulkOps = keys.map(key => {
                const [orderId, itemId] = key.split('-');
                return {
                    updateOne: {
                        filter: { _id: orderId, "orderItems._id": itemId },
                        update: {
                            $set: {
                                "orderItems.$.orderStatus.status": status,
                                "orderItems.$.orderStatus.message": message || `${status} status updated`,
                                "orderItems.$.orderStatus.statusAt": new Date()
                            }
                        }
                    }
                };
            });

            await Order.bulkWrite(bulkOps);

            res.status(200).json({ status: true, message: `Bulk updated ${keys.length} orders to ${status} successfully` });
        } catch (error) {
            next(error);
        }
    },

    // Get Income Stats
    getIncome: async (req, res, next) => {
        try {
            const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
            const search = req.query.search || '';
            const filter = req.query.filter || 'All';

            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year, 11, 31, 23, 59, 59);

            // 1. Line/Bar Chart Data: Revenue per month for the given year
            const revenueByMonth = await Order.aggregate([
                { 
                    $match: { 
                        orderAt: { $gte: startOfYear, $lte: endOfYear },
                        "payment.status": { $ne: 'Failed' }
                    } 
                },
                { 
                    $group: { 
                        _id: { $month: "$orderAt" }, 
                        revenue: { $sum: "$pricing.totalPrice" } 
                    } 
                }
            ]);

            const monthlyRevenue = Array(12).fill(0);
            revenueByMonth.forEach(item => {
                monthlyRevenue[item._id - 1] = item.revenue;
            });

            // 2. Pie Chart Data: Revenue by plant category
            const categoryRevenueAgg = await Order.aggregate([
                { 
                    $match: { 
                        orderAt: { $gte: startOfYear, $lte: endOfYear },
                        "payment.status": { $ne: 'Failed' }
                    } 
                },
                { $unwind: "$orderItems" },
                { $lookup: { from: "orderitems", localField: "orderItems", foreignField: "_id", as: "populatedOrderItem" } },
                { $unwind: "$populatedOrderItem" },
                { $lookup: { from: "plants", localField: "populatedOrderItem.plant", foreignField: "_id", as: "plantDetails" } },
                { $unwind: "$plantDetails" },
                { 
                    $group: { 
                        _id: "$plantDetails.category", 
                        revenue: { $sum: { $multiply: ["$populatedOrderItem.quantity", "$populatedOrderItem.price"] } } 
                    } 
                }
            ]);

            const pieLabels = [];
            const pieData = [];
            categoryRevenueAgg.forEach(item => {
                pieLabels.push(item._id || 'Uncategorized');
                pieData.push(item.revenue);
            });

            // 3. Table Data: Orders (Successful/Processing)
            const query = {
                "payment.status": { $ne: 'Failed' }
            };

            if (search) {
                query._id = search;
            }

            const orders = await Order.find(query)
                .populate('user')
                .populate({
                    path: 'orderItems',
                    populate: [
                        { path: 'nursery' },
                        { path: 'plant' }
                    ]
                })
                .sort({ orderAt: -1 });

            res.status(200).json({
                status: true,
                message: "Income stats fetched successfully",
                stats: {
                    barChart: monthlyRevenue,
                    pieChart: { labels: pieLabels, data: pieData }
                },
                orders
            });
        } catch (error) {
            next(error);
        }
    },

    // Create a new Coupon
    createCoupon: async (req, res, next) => {
        try {
            const Coupon = require('../model/nurseryModel/coupon');
            const data = req.body;

            // Map frontend data to the schema structure
            const couponData = {
                code: data.couponName,
                description: data.description,
                discount: {
                    type: data.discount ? 'Percentage' : 'Flat',
                    value: data.discount ? parseFloat(data.discount) : parseFloat(data.maxDiscountInCost),
                    maxDiscountAmount: data.discount && data.maxDiscountInCost ? parseFloat(data.maxDiscountInCost) : null
                },
                applicability: {
                    type: data.categories === 'all' ? 'All' : (data.categories === 'categories' ? 'Categories' : 'Products'),
                    categories: data.categories === 'categories' ? (Array.isArray(data.subCategories) ? data.subCategories : [data.subCategories]) : [],
                    products: data.categories === 'individual' ? (Array.isArray(data.subCategories) ? data.subCategories : [data.subCategories]) : []
                },
                rules: {
                    minOrderAmount: data.minAmount ? parseFloat(data.minAmount) : 0,
                    validUntil: data.redeemBefore ? new Date(data.redeemBefore) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
                    freeDelivery: data.freeDelivery || false,
                    singleUsePerUser: data.singleCouponPerUser || false,
                    isNewUserOnly: data.newUser || false
                },
                usage: {
                    maxUsageCount: data.numberOfCoupon && data.numberOfCoupon !== 'Infinity' ? parseInt(data.numberOfCoupon) : null,
                    currentUsageCount: 0
                },
                createdBy: req.user._id // Assuming req.user is set by auth middleware
            };

            const newCoupon = new Coupon(couponData);
            await newCoupon.save();

            res.status(201).json({ status: true, message: "Coupon created successfully", coupon: newCoupon });
        } catch (error) {
            next(error);
        }
    },

    // Get all coupons for Admin Dashboard
    getCoupons: async (req, res, next) => {
        try {
            const Coupon = require('../model/nurseryModel/coupon');
            const coupons = await Coupon.find().populate('createdBy', 'name').sort({ createdAt: -1 });

            res.status(200).json({ status: true, message: "Coupons fetched successfully", coupons });
        } catch (error) {
            next(error);
        }
    },

    updateCoupon: async (req, res, next) => {
        try {
            const Coupon = require('../model/nurseryModel/coupon');
            const { id } = req.params;
            const data = req.body;

            const updateData = {
                code: data.couponName,
                description: data.description,
                discount: {
                    type: data.discount ? 'Percentage' : 'Flat',
                    value: data.discount ? parseFloat(data.discount) : parseFloat(data.maxDiscountInCost),
                    maxDiscountAmount: data.discount && data.maxDiscountInCost ? parseFloat(data.maxDiscountInCost) : null
                },
                applicability: {
                    type: data.categories === 'all' ? 'All' : (data.categories === 'categories' ? 'Categories' : 'Products'),
                    categories: data.categories === 'categories' ? (Array.isArray(data.subCategories) ? data.subCategories : [data.subCategories]) : [],
                    products: data.categories === 'individual' ? (Array.isArray(data.subCategories) ? data.subCategories : [data.subCategories]) : []
                },
                rules: {
                    minOrderAmount: data.minAmount ? parseFloat(data.minAmount) : 0,
                    validUntil: data.redeemBefore ? new Date(data.redeemBefore) : undefined,
                    freeDelivery: data.freeDelivery || false,
                    singleUsePerUser: data.singleCouponPerUser || false,
                    isNewUserOnly: data.newUser || false
                },
                usage: {
                    maxUsageCount: data.numberOfCoupon && data.numberOfCoupon !== 'Infinity' ? parseInt(data.numberOfCoupon) : null,
                }
            };
            
            // Remove undefined validUntil if it was not passed
            if (!updateData.rules.validUntil) delete updateData.rules.validUntil;

            const coupon = await Coupon.findByIdAndUpdate(id, { $set: updateData }, { new: true });

            if (!coupon) {
                const error = new Error("Coupon not found");
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({ status: true, message: "Coupon updated successfully", coupon });
        } catch (error) {
            next(error);
        }
    },

    deleteCoupon: async (req, res, next) => {
        try {
            const Coupon = require('../model/nurseryModel/coupon');
            const { id } = req.params;

            const coupon = await Coupon.findByIdAndDelete(id);

            if (!coupon) {
                const error = new Error("Coupon not found");
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({ status: true, message: "Coupon deleted successfully", id });
        } catch (error) {
            next(error);
        }
    },

    updateCouponStatus: async (req, res, next) => {
        try {
            const Coupon = require('../model/nurseryModel/coupon');
            const { id } = req.params;
            const { status } = req.body;

            if (!['Active', 'Expired', 'Disabled'].includes(status)) {
                const error = new Error("Invalid status");
                error.statusCode = 400;
                throw error;
            }

            const coupon = await Coupon.findByIdAndUpdate(id, { status }, { new: true });

            if (!coupon) {
                const error = new Error("Coupon not found");
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({ status: true, message: "Coupon status updated successfully", coupon });
        } catch (error) {
            next(error);
        }
    },

    // Get all contact messages
    getAllContactMessages: async (req, res, next) => {
        try {
            const contacts = await Contact.find().sort({ createdAt: -1 });
            res.status(200).json({ status: true, contacts });
        } catch (error) {
            next(error);
        }
    },

    // Reply to a specific contact message
    replyToContactMessage: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { replyMessage } = req.body;

            if (!replyMessage) {
                const error = new Error("Reply message is required");
                error.statusCode = 400;
                throw error;
            }

            const contact = await Contact.findById(id);
            if (!contact) {
                const error = new Error("Contact message not found");
                error.statusCode = 404;
                throw error;
            }

            // Send email
            const isEmailSent = await replyToContactMessageEmail(contact.email, contact.name, replyMessage);

            if (!isEmailSent) {
                const error = new Error("Failed to send reply email");
                error.statusCode = 500;
                throw error;
            }

            contact.isReplied = true;
            await contact.save();

            res.status(200).json({ status: true, message: "Reply sent successfully", contact });
        } catch (error) {
            next(error);
        }
    },

    // Delete a specific contact message (hard-delete)
    deleteContactMessage: async (req, res, next) => {
        try {
            const { id } = req.params;

            const contact = await Contact.findByIdAndDelete(id);
            if (!contact) {
                const error = new Error("Contact message not found");
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({ status: true, message: "Contact message deleted successfully", id });
        } catch (error) {
            next(error);
        }
    }
};
module.exports = adminController;
