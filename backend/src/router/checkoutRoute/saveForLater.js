const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { addToSaveForLater, getSaveForLaterItems, deleteSaveForLaterItem, moveToCart } = require('../../controllers/checkoutController/saveForLaterController');

router.use(auth);

router.route('/saveForLater')
    .post(addToSaveForLater)
    .get(getSaveForLaterItems);

router.route('/saveForLater/:id')
    .delete(deleteSaveForLaterItem);

router.route('/saveForLater/moveToCart/:id')
    .post(moveToCart);

module.exports = router;
