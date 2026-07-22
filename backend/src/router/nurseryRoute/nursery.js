// const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');

const { createNurseryProfile, getNurseryDetail, updateNurseryDetail, deleteNurseryDetail, uploadNurseryImage, deleteNurseryImage, updateNurseryImages, getNurseryImages } = require('../../controllers/nurseryController/nurseryController');
const { getOrders, getOrdersBarChart, getOrdersPieChart, updateOrderStatus, bulkUpdateOrderStatus } = require('../../controllers/nurseryController/nurseryOrderController');

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


// Order Routes
router.route('/order')
    .get(getOrders);

router.route('/order/barchart')
    .get(getOrdersBarChart);

router.route('/order/piechart')
    .get(getOrdersPieChart);

router.route('/order/status/bulk')
    .patch(bulkUpdateOrderStatus);

router.route('/order/status/:id')
    .patch(updateOrderStatus);

module.exports = router;