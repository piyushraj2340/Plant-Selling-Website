// const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const { createNurseryProfile, getNurseryDetail, updateNurseryDetail, deleteNurseryDetail, uploadNurseryImage, deleteNurseryImage, updateNurseryImages, getNurseryImages } = require('../controllers/nurseryController');

router.use(auth);

router.route('/profile')
    .post(createNurseryProfile)
    .get(getNurseryDetail)
    .patch(updateNurseryDetail)
    .delete(deleteNurseryDetail);

router.route('/profile/images')
    .post(uploadNurseryImage)
    .get(getNurseryImages) // todo:  need to work on 
    .patch(updateNurseryImages) // todo:  need to work on 
    .delete(deleteNurseryImage) // todo:  need to work on 


module.exports = router;