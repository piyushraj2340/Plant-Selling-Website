const plantsModel = require('../model/nurseryModel/plants');
const Review = require('../model/nurseryModel/review');
const Order = require('../model/checkoutModel/orders');

exports.getAllPlants = async (req, res, next) => {
    try {
        const result = await plantsModel.find({ 
            status: 'Published'
        }).populate({
            path: "nursery",
            select: "nurseryName _id"  // Select only the fields you need
        }).select("-user"); // Populate nursery details

        const info = {
            status: true,
            message: "Data of all products",
            result
        };
        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};

exports.getPlantById = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const result = await plantsModel.findOne({ 
            _id, 
            status: 'Published'
        }).populate({
            path: "nursery",
            select: "nurseryName _id"  // Select only the fields you need
        }).select("-user"); // Populate nursery details

        if (!result) {
            const error = new Error("Product not found or not published");
            error.statusCode = 404;
            throw error;
        }

        // Assuming there's a method increaseVisit() defined in the plant model
        await result.increaseVisit();

        const info = {
            status: true,
            message: "Data of Product",
            result
        };
        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};

exports.getPlantsByCategory = async (req, res, next) => {
    try {
        const category = req.params.id;

        if(!category) {
            const error = new Error("Category is required");
            error.statusCode = 400;
            throw error;
        }

        // Construct a MongoDB query to match keywords in various fields
        const query = {
            $and: [
                { status: 'Published' }
            ]
        };

        // Handle multiple categories if provided
        if (category && category.toLowerCase() !== 'all') {
            const categoryList = category.split(',').map(cat => cat.trim());
            query.$and.push({ category: { $in: categoryList.map(cat => new RegExp(cat, 'i')) } });
        }

        const result = await plantsModel.find(query).populate({
            path: "nursery",
            select: "nurseryName _id"  // Select only the fields you need
        }).select("-user"); // Populate nursery details
 
        const info = {
            status: true,
            message: `Data For ${category}`,
            result
        };
 
        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};
 
exports.searchProducts = async (req, res, next) => {
    try {
        const { search, category } = req.query;
 
        if (!search) {
            const error = new Error('Search query is required');
            error.statusCode = 400;
            throw error;
        }
 
        // Split the search string into keywords
        const keywords = search.trim().split(/\s+/);
 
        // Construct a MongoDB query to match keywords in various fields
        const query = {
            $and: [
                { status: 'Published' },
                {
                    $or: [
                        { plantName: { $regex: keywords.join('|'), $options: 'i' } }, // Match any keyword in title
                        { description: { $regex: keywords.join('|'), $options: 'i' } }, // Match in description
                        { category: { $regex: keywords.join('|'), $options: 'i' } }, // Match in category
                        { price: { $in: keywords.map(k => !isNaN(k) ? parseFloat(k) : null).filter(k => k !== null) } }, // Match numeric keywords with price
                    ]
                }
            ]
        };
 
        // Handle multiple categories if provided
        if (category && category.toLowerCase() !== 'all') {
            const categoryList = category.split(',').map(cat => cat.trim());
            query.$and.push({ category: { $in: categoryList.map(cat => new RegExp(cat, 'i')) } });
        }

        // Execute the query and fetch matching products
        const products = await plantsModel.find(query).populate({
            path: "nursery",
            select: "nurseryName _id"  // Select only the fields you need
        }).select("-user"); // Populate nursery details;

        // Create a response object
        const info = {
            status: true,
            message: products.length ? "Search results found" : "No matching results found",
            result: products,
        };

        // Send the response
        res.status(200).json(info);

    } catch (error) {
        next(error);
    }
};

exports.addReview = async (req, res, next) => {
    try {
        const plantId = req.params.id;
        const userId = req.user;
        const { rating, reviewText } = req.body;

        const plant = await plantsModel.findById(plantId);
        if (!plant) {
            const error = new Error("Plant not found");
            error.statusCode = 404;
            throw error;
        }

        // Check if user has bought this plant
        const order = await Order.findOne({ user: userId, "orderItems.plant": plantId });
        const isBuyer = !!order;

        const newReview = new Review({
            user: userId,
            nursery: plant.nursery,
            plant: plantId,
            rating,
            review: reviewText,
            isBuyer
        });

        await newReview.save();

        res.status(201).json({ status: true, message: "Review submitted successfully and is pending approval." });
    } catch (error) {
        next(error);
    }
};

exports.getReviews = async (req, res, next) => {
    try {
        const plantId = req.params.id;
        const reviews = await Review.find({ plant: plantId, status: 'Approved' }).populate('user', 'name avatar');
        res.status(200).json({ status: true, message: "Reviews fetched", result: reviews });
    } catch (error) {
        next(error);
    }
};