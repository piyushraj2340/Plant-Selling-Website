const cartModel = require('../../model/checkoutModel/cart');
const saveForLaterModel = require('../../model/saveForLater');

exports.addToSaveForLater = async (req, res, next) => {
    try {
        const { cartId } = req.body;
        const userId = req.user._id;

        const cartItem = await cartModel.findOne({ _id: cartId, user: userId }).populate('plant');
        
        if (!cartItem) {
            return res.status(404).json({ status: false, message: "Cart item not found or you don't have permission." });
        }

        // Check if already in save for later
        const existingSavedItem = await saveForLaterModel.findOne({ user: userId, plant: cartItem.plant._id });
        
        if (existingSavedItem) {
            // If it's already saved, just remove it from the cart so there are no duplicates.
            await cartModel.findByIdAndDelete(cartId);
            
            await existingSavedItem.populate({
                path: 'plant',
                select: 'plantName images price discount nursery'
            });

            return res.status(200).json({
                success: true,
                message: "Item was already saved for later. Removed from cart.",
                data: existingSavedItem
            });
        }

        // Create a new Save For Later item
        const savedItem = await saveForLaterModel.create({
            user: userId,
            plant: cartItem.plant._id,
            addedAtPrice: cartItem.plant.price
        });

        await savedItem.populate({
            path: 'plant',
            select: 'plantName images price discount nursery'
        });

        // Remove from cart
        await cartModel.findByIdAndDelete(cartId);

        res.status(201).json({
            success: true,
            message: "Item saved for later and removed from cart.",
            data: savedItem
        });
    } catch (err) {
        next(err);
    }
};

exports.getSaveForLaterItems = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const savedItems = await saveForLaterModel.find({ user: userId }).populate({
            path: 'plant',
            select: 'plantName images price discount nursery'
        }).sort({ addedAt: -1 });

        res.status(200).json({
            success: true,
            data: savedItems
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteSaveForLaterItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const savedItem = await saveForLaterModel.findOneAndDelete({ _id: id, user: userId });

        if (!savedItem) {
            return res.status(404).json({ status: false, message: "Saved item not found." });
        }

        res.status(200).json({
            success: true,
            message: "Item removed from saved list.",
            data: savedItem
        });
    } catch (err) {
        next(err);
    }
};

exports.moveToCart = async (req, res, next) => {
    try {
        const { id } = req.params; // SaveForLater ID
        const userId = req.user._id;

        const savedItem = await saveForLaterModel.findOne({ _id: id, user: userId }).populate('plant');

        if (!savedItem) {
            return res.status(404).json({ status: false, message: "Saved item not found." });
        }

        // Add to cart
        const cartItemData = {
            user: userId,
            plant: savedItem.plant._id,
            nursery: req.body.nursery || null, // Best if passed from frontend, otherwise cart might lack nursery. We'll try to fetch it if missing.
            quantity: 1,
        };

        // If nursery isn't provided, fetch the plant to find its nursery
        if (!cartItemData.nursery) {
            if (savedItem.plant && savedItem.plant.nursery) {
                cartItemData.nursery = savedItem.plant.nursery;
            } else {
                 const plantModel = require('../../model/nurseryModel/plants');
                 const plant = await plantModel.findById(savedItem.plant._id);
                 if (plant) {
                     cartItemData.nursery = plant.nursery;
                 }
            }
        }

        // Check if it already exists in cart
        let cartItem = await cartModel.findOne({ user: userId, plant: savedItem.plant._id });
        
        if (cartItem) {
            cartItem.quantity += 1;
            await cartItem.save();
        } else {
            cartItem = await cartModel.create(cartItemData);
        }

        // Remove from Save For Later
        await saveForLaterModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Item moved to cart.",
            data: cartItem
        });
    } catch (err) {
        next(err);
    }
};
