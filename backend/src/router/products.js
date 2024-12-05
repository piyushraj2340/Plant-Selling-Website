const express = require('express');

const { getAllPlants, getPlantById, getPlantsByCategory, searchProducts } = require('../controllers/productsController');
const router = express.Router();

router.get('/plants', getAllPlants);

router.get('/plant/:id', getPlantById);

router.get('/plantsByCategory/:id', getPlantsByCategory);

router.get("/search/plants", searchProducts);

module.exports = router;