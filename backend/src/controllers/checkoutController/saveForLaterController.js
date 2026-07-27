const Cart = require('../../model/checkoutModel/cart');
const CartItem = require('../../model/checkoutModel/cartItem');
const saveForLaterModel = require('../../model/saveForLater');
const Plant = require('../../model/nurseryModel/plants');

exports.addToSaveForLater = async (req, res, next) => {
    try {
        const { cartId } = req.body; // This is actually the CartItem ID
        const userId = req.user._id;

        const cartItem = await CartItem.findOne({ _id: cartId, user: userId }).populate('plant');
        
        if (!cartItem) {
            return res.status(404).json({ status: false, message: "Cart item not found or you don't have permission." });
        }

        // Check if already in save for later
        const existingSavedItem = await saveForLaterModel.findOne({ user: userId, plant: cartItem.plant._id });
        
        if (existingSavedItem) {
            // If it's already saved, just remove it from the cart so there are no duplicates.
            await CartItem.findByIdAndDelete(cartId);
            await Cart.updateOne({ _id: cartItem.cart }, { $pull: { cartItems: cartItem._id } });
            
            await existingSavedItem.populate({
                path: 'plant',
                select: 'plantName images price discount nursery'
            });

            return res.status(200).json({
                status: true,
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
        await CartItem.findByIdAndDelete(cartId);
        await Cart.updateOne({ _id: cartItem.cart }, { $pull: { cartItems: cartItem._id } });

        res.status(201).json({
            status: true,
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
            status: true,
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
            status: true,
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

        // 1. Get or Create Cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId });
            await cart.save();
        }

        // 2. Fetch the plant to get its nursery
        let nurseryId = req.body.nursery || (savedItem.plant && savedItem.plant.nursery);
        if (!nurseryId) {
             const plantDoc = await Plant.findById(savedItem.plant._id);
             if (plantDoc) nurseryId = plantDoc.nursery;
        }

        // 3. Upsert Cart Item
        let cartItem = await CartItem.findOne({ cart: cart._id, plant: savedItem.plant._id });
        
        if (cartItem) {
            cartItem.quantity += 1;
            await cartItem.save();
        } else {
            cartItem = new CartItem({
                cart: cart._id,
                user: userId,
                nursery: nurseryId,
                plant: savedItem.plant._id,
                quantity: 1,
                addedAtPrice: savedItem.plant.price
            });
            await cartItem.save();
            cart.cartItems.push(cartItem._id);
            await cart.save();
        }

        // Remove from Save For Later
        await saveForLaterModel.findByIdAndDelete(id);

        res.status(200).json({
            status: true,
            message: "Item moved to cart.",
            data: cartItem
        });
    } catch (err) {
        next(err);
    }
};
