const User = require('../model/userModel/user');
const Nursery = require('../model/nurseryModel/nursery');
const Plant = require('../model/nurseryModel/plants');
const Order = require('../model/checkoutModel/orders');
const Contact = require('../model/contact');
const { replyToContactMessageEmail } = require('./smtp/emailController');
const { getQueryOptions, buildSearchQuery } = require('../utils/queryHelper');

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
            const { page, limit, skip, search, sort } = getQueryOptions(req);
            const query = buildSearchQuery(search, ['name', 'email', 'phone']);

            if (req.query.role) {
                const roles = req.query.role.split(',').map(s => new RegExp(`^${s.trim()}$`, 'i'));
                query.role = { $in: roles };
            }

            if (req.query.status) {
                const statusVals = req.query.status.split(',').map(s => s.trim().toLowerCase());
                if (statusVals.includes('blocked')) {
                    query.isBlocked = true;
                }
                if (statusVals.includes('verified')) {
                    query.isUserVerified = true;
                }
                if (statusVals.includes('unverified')) {
                    query.isUserVerified = false;
                }
            }

            const total = await User.countDocuments(query);
            const users = await User.find(query)
                .select('-password -tokens')
                .sort(sort)
                .skip(skip)
                .limit(limit);

            res.status(200).json({ 
                status: true, 
                message: "Users fetched successfully", 
                users,
                total,
                page,
                limit
            });
        } catch (error) {
            next(error);
        }
    },

    // Get all nurseries
    getNurseries: async (req, res, next) => {
        try {
            const Nursery = require('../model/nurseryModel/nursery');
            const nurseries = await Nursery.find({}).select('nurseryName user');
            res.status(200).json({ status: true, nurseries });
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

    // Get all plants (Table Data only)
    getPlants: async (req, res, next) => {
        try {
            const { search, status, tag } = req.query;
            const { page, limit, skip, search: parsedSearch, sort } = getQueryOptions(req);
            
            let query = {};
            const searchQueryStr = parsedSearch || search;
            
            const Category = require('../model/category');
            
            if (searchQueryStr) {
                const keywords = searchQueryStr.trim().split(/\s+/);
                
                const matchingCategories = await Category.find({ categoryName: { $regex: keywords.join('|'), $options: 'i' } }).select('_id');
                const categoryIds = matchingCategories.map(c => c._id);
                
                query.$or = [
                    { plantName: { $regex: keywords.join('|'), $options: 'i' } }
                ];
                
                if (categoryIds.length > 0) {
                    query.$or.push({ category: { $in: categoryIds } });
                }
                
                // Allow exact ObjectId match too
                const mongoose = require('mongoose');
                if (mongoose.Types.ObjectId.isValid(searchQueryStr.trim())) {
                    query.$or.push({ _id: searchQueryStr.trim() });
                }
            }

            if (status) {
                const statuses = status.split(',').map(s => new RegExp(`^${s.trim()}$`, 'i'));
                query.status = { $in: statuses };
            }

            if (tag) {
                const tagsList = tag.split(',').map(s => new RegExp(`^${s.trim()}$`, 'i'));
                const matchingCategories = await Category.find({ categoryName: { $in: tagsList } }).select('_id');
                const categoryIds = matchingCategories.map(c => c._id);
                
                if (categoryIds.length > 0) {
                    query.category = { $in: categoryIds };
                } else {
                    query.category = null; // No matching categories, return none
                }
            }

            const total = await Plant.countDocuments(query);
            const plants = await Plant.find(query)
                .populate('nursery', 'nurseryName')
                .populate('category', 'categoryName') // ensure category is populated if it's an objectId
                .sort(sort)
                .skip(skip)
                .limit(limit);

            res.status(200).json({ 
                status: true,
                message: "Admin Plants Fetched Successfully",
                plants,
                total,
                page,
                limit
            });
        } catch (error) {
            next(error);
        }
    },

    getPlantsLineChart: async (req, res, next) => {
        try {
            const { year } = req.query;
            const targetYear = year ? parseInt(year) : new Date().getFullYear();

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

            res.status(200).json({ 
                status: true,
                lineData
            });
        } catch (error) {
            next(error);
        }
    },

    getPlantsPolarChart: async (req, res, next) => {
        try {
            const statusAggregation = await Plant.aggregate([
                {
                    $group: {
                        _id: { $ifNull: ["$status", "Draft"] },
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

            res.status(200).json({ 
                status: true,
                polarData: [polarData.Published, polarData.Draft, polarData["On Hold"]]
            });
        } catch (error) {
            next(error);
        }
    },

    // Get all orders (Table Data only)
    getOrders: async (req, res, next) => {
        try {
            const { search, timeFilter, status, tag } = req.query;
            const { page, limit, skip, search: parsedSearch, sort } = getQueryOptions(req);
            
            let query = {};
            const searchQueryStr = parsedSearch || search;
            
            if (searchQueryStr) {
                const mongoose = require('mongoose');
                const OrderItem = require('../model/checkoutModel/orderItem');
                const searchRegex = new RegExp(searchQueryStr.trim(), 'i');
                
                // 1. Find OrderItem matches (by plantName)
                const matchedItems = await OrderItem.find({ plantName: searchRegex }).select('order');
                const orderIdsFromItems = matchedItems.map(item => item.order);
                
                // 2. Check if the search string is a valid Order ID itself
                const validIds = [...orderIdsFromItems];
                if (mongoose.Types.ObjectId.isValid(searchQueryStr.trim())) {
                    validIds.push(searchQueryStr.trim());
                }
                
                if (validIds.length > 0) {
                    query = { _id: { $in: validIds } };
                } else {
                    query = { _id: null }; // Invalid ID and no plant match shouldn't match anything
                }
            }
            
            if (timeFilter) {
                const now = new Date();
                if (timeFilter === 'Monthly') {
                    query.orderAt = { $gte: new Date(now.setDate(now.getDate() - 30)) };
                } else if (timeFilter === 'Quarterly') {
                    query.orderAt = { $gte: new Date(now.setDate(now.getDate() - 90)) };
                } else if (timeFilter === 'Yearly') {
                    query.orderAt = { $gte: new Date(now.setDate(now.getDate() - 365)) };
                }
            }

            if (tag) {
                const tags = tag.split(',').map(t => new RegExp(`^${t.trim()}$`, 'i'));
                query['orderStatus.status'] = { $in: tags };
            }

            if (status) {
                const statuses = status.split(',').map(s => new RegExp(`^${s.trim()}$`, 'i'));
                query['orderStatus.message'] = { $in: statuses };
            }

            const total = await Order.countDocuments(query);
            const orders = await Order.find(query)
                .populate('user')
                .populate({
                    path: 'orderItems',
                    populate: [
                        { path: 'nursery' },
                        { path: 'plant' } 
                    ]
                })
                .sort(sort)
                .skip(skip)
                .limit(limit);
            
            res.status(200).json({ 
                status: true, 
                message: "Orders fetched successfully", 
                orders,
                total,
                page,
                limit
            });
        } catch (error) {
            next(error);
        }
    },

    getOrdersBarChart: async (req, res, next) => {
        try {
            const { year } = req.query;
            const targetYear = parseInt(year) || new Date().getFullYear();

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

            res.status(200).json({ 
                status: true, 
                barData 
            });
        } catch (error) {
            next(error);
        }
    },

    getOrdersPieChart: async (req, res, next) => {
        try {
            const { year } = req.query;
            const matchStage = {};
            if (year) {
                const targetYear = parseInt(year);
                matchStage.orderAt = {
                    $gte: new Date(`${targetYear}-01-01T00:00:00.000Z`),
                    $lte: new Date(`${targetYear}-12-31T23:59:59.999Z`)
                };
            }

            const pipeline = [];
            if (Object.keys(matchStage).length > 0) {
                pipeline.push({ $match: matchStage });
            }

            pipeline.push(
                { $unwind: "$orderItems" },
                { $lookup: { from: "orderitems", localField: "orderItems", foreignField: "_id", as: "populatedOrderItem" } },
                { $unwind: "$populatedOrderItem" },
                { $lookup: { from: "plants", localField: "populatedOrderItem.plant", foreignField: "_id", as: "plantDetails" } },
                { $unwind: { path: "$plantDetails", preserveNullAndEmptyArrays: true } },
                { $lookup: { from: "categories", localField: "plantDetails.category", foreignField: "_id", as: "categoryDetails" } },
                { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
                { $group: { _id: "$categoryDetails.name", count: { $sum: 1 } } }
            );

            const categoryAgg = await Order.aggregate(pipeline);

            const pieLabels = [];
            const pieData = [];
            categoryAgg.forEach(item => {
                const cat = item._id ? String(item._id).toUpperCase() : 'OTHER';
                pieLabels.push(cat);
                pieData.push(item.count);
            });

            res.status(200).json({ 
                status: true, 
                pieLabels,
                pieData 
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

    // Get all reviews (paginated for table)
    getAllReviews: async (req, res, next) => {
        try {
            const Review = require('../model/nurseryModel/review');
            const { page, limit, skip, search, sort } = getQueryOptions(req);
            let query = {};
            if (search) {
                // Search by review text
                query = { review: { $regex: search, $options: 'i' } };
            }
            
            // Add filtering support
            if (req.query.status) {
                const statuses = req.query.status.split(',').map(s => new RegExp(`^${s.trim()}$`, 'i'));
                query.status = { $in: statuses };
            }

            const total = await Review.countDocuments(query);
            const reviews = await Review.find(query)
                .populate('user', 'name email avatar')
                .populate({
                    path: 'plant',
                    select: 'plantName category images price discount',
                    populate: {
                        path: 'category',
                        select: 'name'
                    }
                })
                .sort(sort)
                .skip(skip)
                .limit(limit);

            res.status(200).json({ 
                status: true, 
                message: "Reviews fetched successfully", 
                reviews,
                total,
                page,
                limit
            });
        } catch (error) {
            next(error);
        }
    },

    // Get reviews line chart
    getReviewsLineChart: async (req, res, next) => {
        try {
            const Review = require('../model/nurseryModel/review');
            const { year } = req.query;
            const targetYear = year ? parseInt(year) : new Date().getFullYear();
            
            const reviews = await Review.find({});
            const monthRatings = new Array(12).fill(0);
            const monthCounts = new Array(12).fill(0);
            
            reviews.forEach(review => {
                const reviewDate = review.createdAt ? new Date(review.createdAt) : new Date();
                if (reviewDate.getFullYear() === targetYear) {
                    const month = reviewDate.getMonth();
                    monthRatings[month] += review.rating;
                    monthCounts[month]++;
                }
            });

            const lineData = monthRatings.map((total, index) => {
                return monthCounts[index] > 0 ? parseFloat((total / monthCounts[index]).toFixed(1)) : 0;
            });

            res.status(200).json({
                status: true,
                message: "Reviews line chart fetched",
                lineData
            });
        } catch (error) {
            next(error);
        }
    },

    // Get reviews pie chart
    getReviewsPieChart: async (req, res, next) => {
        try {
            const Review = require('../model/nurseryModel/review');
            const { year } = req.query;
            let query = {};
            
            if (year) {
                const targetYear = parseInt(year);
                const startDate = new Date(`${targetYear}-01-01T00:00:00.000Z`);
                const endDate = new Date(`${targetYear}-12-31T23:59:59.999Z`);
                query.createdAt = { $gte: startDate, $lte: endDate };
            }
            
            const reviews = await Review.find(query);
            const starCounts = [0, 0, 0, 0, 0];
            
            reviews.forEach(review => {
                if (review.rating >= 1 && review.rating <= 5) {
                    starCounts[review.rating - 1]++;
                }
            });

            res.status(200).json({
                status: true,
                message: "Reviews pie chart fetched",
                pieLabels: ['1 Star Rating', '2 Star Rating', '3 Star Rating', '4 Star Rating', '5 Star Rating'],
                pieData: starCounts
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

    // Update individual order status
    updateOrderItemStatus: async (req, res, next) => {
        try {
            const { orderId } = req.params;
            let { status, message } = req.body;
            
            if (status) {
                status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
            }

            const order = await Order.findOneAndUpdate(
                { _id: orderId },
                {
                    $set: {
                        "orderStatus.status": status,
                        "orderStatus.message": message || `${status} status updated`,
                        "orderStatus.statusAt": new Date()
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
            let { keys, status, message } = req.body;

            if (!keys || !Array.isArray(keys) || keys.length === 0) {
                const error = new Error("Order item keys are required");
                error.statusCode = 400;
                throw error;
            }
            
            if (status) {
                status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
            }

            if (!['Processing', 'Placed', 'Delivered', 'Rejected', 'Completed'].includes(status)) {
                const error = new Error("Invalid status");
                error.statusCode = 400;
                throw error;
            }

            const orderIds = [...new Set(keys.map(key => key.split('-')[0]))];

            await Order.updateMany(
                { _id: { $in: orderIds } },
                {
                    $set: {
                        "orderStatus.status": status,
                        "orderStatus.message": message || `${status} status updated`,
                        "orderStatus.statusAt": new Date()
                    }
                }
            );

            res.status(200).json({ status: true, message: `Bulk updated ${keys.length} orders to ${status} successfully` });
        } catch (error) {
            next(error);
        }
    },

    // Get Income Table Data
    getIncome: async (req, res, next) => {
        try {
            const { page, limit, skip, search, sort } = getQueryOptions(req);
            
            let query = {
                "payment.status": { $ne: 'Failed' }
            };

            const searchQueryStr = search || '';
            if (searchQueryStr) {
                // If search is a valid ObjectId, search by _id
                if (require('mongoose').Types.ObjectId.isValid(searchQueryStr.trim())) {
                    query._id = searchQueryStr.trim();
                } else {
                    query = { _id: null }; // Force no results if it's not a valid ID
                }
            }

            if (req.query.status) {
                const statuses = req.query.status.split(',').map(s => new RegExp(`^${s.trim()}$`, 'i'));
                query['orderStatus.status'] = { $in: statuses };
            }

            const total = await Order.countDocuments(query);
            const orders = await Order.find(query)
                .populate('user')
                .populate({
                    path: 'orderItems',
                    populate: [
                        { path: 'nursery' },
                        { path: 'plant' }
                    ]
                })
                .sort(sort)
                .skip(skip)
                .limit(limit);

            res.status(200).json({ 
                status: true, 
                orders,
                total,
                page,
                limit
            });
        } catch (error) {
            next(error);
        }
    },

    getIncomeBarChart: async (req, res, next) => {
        try {
            const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year, 11, 31, 23, 59, 59);

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

            res.status(200).json({ status: true, barData: monthlyRevenue });
        } catch (error) {
            next(error);
        }
    },

    getIncomePieChart: async (req, res, next) => {
        try {
            const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year, 11, 31, 23, 59, 59);

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
                { $lookup: { from: "categories", localField: "plantDetails.category", foreignField: "_id", as: "categoryDetails" } },
                { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
                { 
                    $group: { 
                        _id: "$categoryDetails.name", 
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

            res.status(200).json({ status: true, pieLabels, pieData });
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
            const { page, limit, skip, search, sort } = getQueryOptions(req);
            
            const query = buildSearchQuery(search, ['code', 'description']);
            
            if (req.query.status) {
                const statuses = req.query.status.split(',').map(s => new RegExp(`^${s.trim()}$`, 'i'));
                query.status = { $in: statuses };
            }
            
            const total = await Coupon.countDocuments(query);
            const coupons = await Coupon.find(query)
                .populate('createdBy', 'name')
                .sort(sort)
                .skip(skip)
                .limit(limit);

            res.status(200).json({ 
                status: true, 
                message: "Coupons fetched successfully", 
                coupons,
                total,
                page,
                limit
            });
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
            const { page, limit, skip, search, sort } = getQueryOptions(req);
            const query = buildSearchQuery(search, ['name', 'email', 'subject', 'message']);
            
            if (req.query.category) {
                const categories = req.query.category.split(',').map(s => new RegExp(`^${s.trim()}$`, 'i'));
                query.category = { $in: categories };
            }

            if (req.query.isReplied) {
                const isRepliedStrs = req.query.isReplied.split(',').map(s => s.trim().toLowerCase());
                const boolValues = [];
                if (isRepliedStrs.includes('true')) boolValues.push(true);
                if (isRepliedStrs.includes('false')) boolValues.push(false);
                
                if (boolValues.length > 0) {
                    query.isReplied = { $in: boolValues };
                }
            }

            const total = await Contact.countDocuments(query);
            const contacts = await Contact.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit);

            res.status(200).json({ 
                status: true, 
                contacts,
                total,
                page,
                limit
            });
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
    },

    // Admin Add Plant
    adminAddPlant: async (req, res, next) => {
        try {
            const Plant = require('../model/nurseryModel/plants');
            const Nursery = require('../model/nurseryModel/nursery');
            const { uploadImages } = require('../utils/uploadImages');
            const sanitizeHtml = require('sanitize-html');

            const { body, files } = req;
            
            if (body.description) {
                body.description = sanitizeHtml(body.description);
            }

            if (!body.nursery) {
                const error = new Error("Nursery ID is required");
                error.statusCode = 400;
                throw error;
            }

            const nurseryDoc = await Nursery.findById(body.nursery);
            if (!nurseryDoc) {
                const error = new Error("Nursery not found");
                error.statusCode = 404;
                throw error;
            }

            body.user = nurseryDoc.user; // Inherit the user from the nursery

            const images = [files?.image_0, files?.image_1, files?.image_2].filter(Boolean);
            
            const plant = new Plant(body);

            if (images.length > 0) {
                const resultImage = await uploadImages(images, {
                    folder: `PlantSeller/user/${body.user}/nursery/${body.nursery}/plants/${plant._id}`,
                    width: 550,
                    height: 650,
                    crop: "fit"
                });

                plant.images = resultImage.map((elem) => ({
                    public_id: elem.public_id,
                    url: elem.secure_url
                }));

                plant.imageList = resultImage.map((elem) => ({
                    public_id: elem.public_id,
                    url: elem.url
                }));
            }

            await plant.save();
            res.status(201).json({ status: true, message: "New plant added successfully by admin.", plant });
        } catch (error) {
            next(error);
        }
    },

    // Admin Update Plant
    adminUpdatePlant: async (req, res, next) => {
        try {
            const Plant = require('../model/nurseryModel/plants');
            const { uploadImages, deleteResourcesByPrefix } = require('../utils/uploadImages');
            const sanitizeHtml = require('sanitize-html');

            const plantId = req.params.id;
            const { body, files } = req;

            if (body.description) {
                body.description = sanitizeHtml(body.description);
            }

            const plant = await Plant.findById(plantId);
            if (!plant) {
                const error = new Error("Plant not found");
                error.statusCode = 404;
                throw error;
            }
            
            const newImages = [files?.image_0, files?.image_1, files?.image_2].filter(Boolean);

            if (newImages.length > 0) {
                if (plant.images && plant.images.length > 0) {
                    await deleteResourcesByPrefix(`PlantSeller/user/${plant.user}/nursery/${plant.nursery}/plants/${plant._id}`);
                }

                const resultImage = await uploadImages(newImages, {
                    folder: `PlantSeller/user/${plant.user}/nursery/${plant.nursery}/plants/${plant._id}`,
                    width: 550,
                    height: 650,
                    crop: "fit"
                });

                body.images = resultImage.map((elem) => ({
                    public_id: elem.public_id,
                    url: elem.secure_url
                }));

                body.imageList = resultImage.map((elem) => ({
                    public_id: elem.public_id,
                    url: elem.url
                }));
            }

            const updatedPlant = await Plant.findByIdAndUpdate(plantId, body, { new: true, runValidators: true });
            res.status(200).json({ status: true, message: "Plant updated successfully by admin.", plant: updatedPlant });
        } catch (error) {
            next(error);
        }
    }
};
module.exports = adminController;
