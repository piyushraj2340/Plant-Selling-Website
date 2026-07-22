const express = require('express');

const { getAllPlants, getPlantById, getPlantsByCategory, searchProducts, addReview, getReviews } = require('../controllers/productsController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/plants', getAllPlants);

router.get('/plant/:id', getPlantById);

router.post('/plant/:id/reviews', auth, addReview);
router.get('/plant/:id/reviews', getReviews);

router.get('/plantsByCategory/:id', getPlantsByCategory);

router.get("/search/plants", searchProducts);

module.exports = router;