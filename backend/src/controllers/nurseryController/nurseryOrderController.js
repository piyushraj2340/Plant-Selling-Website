const mongoose = require('mongoose');
const VendorOrder = require('../../model/checkoutModel/vendorOrder');
const { getQueryOptions } = require('../../utils/queryHelper');
const { syncOverallOrderStatus } = require('../../utils/orderStatusSync');

exports.getOrders = async (req, res, next) => {
    try {
        const { search, timeFilter, status, tag } = req.query;
        const { page, limit, skip, search: parsedSearch, sort } = getQueryOptions(req);
        
        // Ensure request comes from a valid nursery
        if (!req.nursery) {
            const error = new Error("Not authorized as a nursery.");
            error.statusCode = 403;
            throw error;
        }

        let query = { nursery: req.nursery };
        const searchQueryStr = parsedSearch || search;
        
        if (searchQueryStr) {
            const OrderItem = require('../../model/checkoutModel/orderItem');
            const searchRegex = new RegExp(searchQueryStr.trim(), 'i');
            
            // Find matching OrderItems for this nursery
            const matchedItems = await OrderItem.find({ 
                plantName: searchRegex,
                nursery: req.nursery 
            });
            
            const vendorOrderIdsFromItems = matchedItems.map(item => item.vendorOrder);
            
            const validIds = [...vendorOrderIdsFromItems];
            if (mongoose.Types.ObjectId.isValid(searchQueryStr.trim())) {
                validIds.push(searchQueryStr.trim());
            }
            
            if (validIds.length > 0) {
                query._id = { $in: validIds };
            } else {
                query._id = null; // force no match
            }
        }
        
        if (timeFilter) {
            const now = new Date();
            if (timeFilter === 'Monthly') {
                query.createdAt = { $gte: new Date(now.setDate(now.getDate() - 30)) };
            } else if (timeFilter === 'Quarterly') {
                query.createdAt = { $gte: new Date(now.setDate(now.getDate() - 90)) };
            } else if (timeFilter === 'Yearly') {
                query.createdAt = { $gte: new Date(now.setDate(now.getDate() - 365)) };
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

        const total = await VendorOrder.countDocuments(query);
        const orders = await VendorOrder.find(query)
            .populate({
                path: 'order',
                populate: { path: 'user', select: 'name email phone avatar' }
            })
            .populate({
                path: 'orderItems',
                populate: { path: 'plant' }
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
};

exports.getOrdersBarChart = async (req, res, next) => {
    try {
        if (!req.nursery) {
            const error = new Error("Not authorized as a nursery.");
            error.statusCode = 403;
            throw error;
        }

        const { year } = req.query;
        const targetYear = parseInt(year) || new Date().getFullYear();

        const startOfYear = new Date(`${targetYear}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${targetYear}-12-31T23:59:59.999Z`);
        
        const ordersByMonth = await VendorOrder.aggregate([
            { $match: { nursery: req.nursery, createdAt: { $gte: startOfYear, $lte: endOfYear } } },
            { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } }
        ]);

        const barData = new Array(12).fill(0);
        ordersByMonth.forEach(item => {
            if (item._id >= 1 && item._id <= 12) {
                barData[item._id - 1] = item.count;
            }
        });

        res.status(200).json({ status: true, barData });
    } catch (error) {
        next(error);
    }
};

exports.getOrdersPieChart = async (req, res, next) => {
    try {
        if (!req.nursery) {
            const error = new Error("Not authorized as a nursery.");
            error.statusCode = 403;
            throw error;
        }

        const { year } = req.query;
        const matchStage = { nursery: req.nursery };
        if (year) {
            const targetYear = parseInt(year);
            matchStage.createdAt = {
                $gte: new Date(`${targetYear}-01-01T00:00:00.000Z`),
                $lte: new Date(`${targetYear}-12-31T23:59:59.999Z`)
            };
        }

        const pipeline = [
            { $match: matchStage },
            { $unwind: "$orderItems" },
            { $lookup: { from: "orderitems", localField: "orderItems", foreignField: "_id", as: "populatedOrderItem" } },
            { $unwind: "$populatedOrderItem" },
            { $lookup: { from: "plants", localField: "populatedOrderItem.plant", foreignField: "_id", as: "plantDetails" } },
            { $unwind: { path: "$plantDetails", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: "categories", localField: "plantDetails.category", foreignField: "_id", as: "categoryDetails" } },
            { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
            { $group: { _id: "$categoryDetails.name", count: { $sum: 1 } } }
        ];

        const categoryAgg = await VendorOrder.aggregate(pipeline);

        const pieLabels = [];
        const pieData = [];
        categoryAgg.forEach(item => {
            const cat = item._id ? String(item._id).toUpperCase() : 'OTHER';
            pieLabels.push(cat);
            pieData.push(item.count);
        });

        res.status(200).json({ status: true, pieLabels, pieData });
    } catch (error) {
        next(error);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        if (!req.nursery) {
            const error = new Error("Not authorized as a nursery.");
            error.statusCode = 403;
            throw error;
        }

        const { id } = req.params;
        const { status, message } = req.body;

        if (!status) {
            const error = new Error("Status is required");
            error.statusCode = 400;
            throw error;
        }

        const vendorOrder = await VendorOrder.findOneAndUpdate(
            { _id: id, nursery: req.nursery },
            {
                $set: {
                    "orderStatus.status": status,
                    "orderStatus.message": message || `${status} status updated`,
                    "orderStatus.statusAt": new Date()
                }
            },
            { new: true }
        );

        if (!vendorOrder) {
            const error = new Error("VendorOrder not found");
            error.statusCode = 404;
            throw error;
        }

        // Trigger sync for overall order status
        if (vendorOrder.order) {
            // Trigger in background, don't await blocking the response
            syncOverallOrderStatus(vendorOrder.order).catch(err => console.error("Sync error:", err));
        }

        res.status(200).json({ status: true, message: `Order status updated to ${status} successfully` });
    } catch (error) {
        next(error);
    }
};

exports.bulkUpdateOrderStatus = async (req, res, next) => {
    try {
        if (!req.nursery) {
            const error = new Error("Not authorized as a nursery.");
            error.statusCode = 403;
            throw error;
        }

        const { ids, status, message } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0 || !status) {
            const error = new Error("Invalid payload");
            error.statusCode = 400;
            throw error;
        }

        const result = await VendorOrder.updateMany(
            { _id: { $in: ids }, nursery: req.nursery },
            {
                $set: {
                    "orderStatus.status": status,
                    "orderStatus.message": message || `${status} status updated`,
                    "orderStatus.statusAt": new Date()
                }
            }
        );
        
        // Find modified vendor orders to trigger sync for their parents
        const updatedVendorOrders = await VendorOrder.find({ _id: { $in: ids } }).select('order');
        const parentOrderIds = [...new Set(updatedVendorOrders.map(vo => vo.order.toString()))];
        
        parentOrderIds.forEach(orderId => {
            syncOverallOrderStatus(orderId).catch(err => console.error("Sync error:", err));
        });

        res.status(200).json({ status: true, message: `Bulk updated ${result.modifiedCount} orders to ${status} successfully` });
    } catch (error) {
        next(error);
    }
};
