const express = require('express');

const auth = require('../../middleware/auth');

const { addNewPlant, uploadDescriptionImage, getAllPlantsOfNursery, getPlantById, updatePlantById, deletePlantById, removePlantImage } = require('../../controllers/nurseryController/plantsController');

const router = express.Router();

const { guestProtection } = require('../../middleware/guestProtection');

router.use(auth, guestProtection);

router.route('/plants')
    .post(addNewPlant)
    .get(getAllPlantsOfNursery);

router.route('/plants/:id/description-image')
    .post(uploadDescriptionImage);

router.route("/plants/:id")
    .get(getPlantById)
    .patch(updatePlantById)
    .delete(deletePlantById);

router.route("/plants/:id/image")
    .patch(removePlantImage);

module.exports = router;

