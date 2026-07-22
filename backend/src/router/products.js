const express = require('express');

const { getAllPlants, getPlantById, getPlantsByCategory, searchProducts, addReview, getReviews, getProductCoupons } = require('../controllers/productsController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/plants', getAllPlants);

router.get('/plant/:id', getPlantById);
router.get('/plant/:id/coupons', getProductCoupons);

router.post('/plant/:id/reviews', auth, addReview);
router.get('/plant/:id/reviews', getReviews);

router.get('/plantsByCategory/:id', getPlantsByCategory);

router.get("/search/plants", searchProducts);

module.exports = router;