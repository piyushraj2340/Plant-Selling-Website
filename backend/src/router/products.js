const express = require('express');

const { getAllPlants, getPlantById, getPlantsByCategory } = require('../controllers/productsController');
const router = express.Router();

router.get('/plants', getAllPlants);

router.get('/plant/:id', getPlantById);

router.get('/plantsByCategory/:id', getPlantsByCategory);

module.exports = router;