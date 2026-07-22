const express = require("express");

const router = express.Router();

const auth = require('../../middleware/auth');
const { addToCart, getCartItems, getCartItemById, updateCartItemById, deleteCartItemById, isPlantAddedToCart } = require("../../controllers/checkoutController/cartController");

router.use(auth);

router.route('/carts')
    .post(addToCart)
    .get(getCartItems);

router.route('/carts/:id')
    .get(getCartItemById)
    .patch(updateCartItemById)
    .delete(deleteCartItemById);

router.route('/isPlantsAddedToCart/:plantId')
.get(isPlantAddedToCart);

const { applyCoupon, getApplicableCoupons } = require("../../controllers/checkoutController/cartController");
router.post('/coupons/apply', applyCoupon);
router.get('/coupons/applicable', getApplicableCoupons);

module.exports = router;