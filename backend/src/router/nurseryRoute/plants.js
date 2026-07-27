const express = require('express');

const auth = require('../../middleware/auth');

const { addNewPlant, getAllPlantsOfNursery, getPlantById, updatePlantById, deletePlantById, uploadDescriptionImage } = require('../../controllers/nurseryController/plantsController');

const router = express.Router();

router.use(auth);

router.route('/plants')
    .post(addNewPlant)
    .get(getAllPlantsOfNursery);

router.route('/plants/:id/description-image')
    .post(uploadDescriptionImage);


router.route("/plants/:id")
    .get(getPlantById)
    .patch(updatePlantById)
    .delete(deletePlantById);

module.exports = router;