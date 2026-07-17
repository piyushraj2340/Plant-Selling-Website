const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/adminMiddleware');
const adminController = require('../../controllers/adminController');

// All admin routes must be protected by auth and isAdmin middleware
router.use(auth, isAdmin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.get('/plants', adminController.getPlants);
router.get('/orders', adminController.getOrders);

router.post('/impersonate', adminController.impersonateUser);

router.get('/reviews', adminController.getAllReviews);
router.patch('/reviews/bulk-status', adminController.bulkUpdateReviewStatus);
router.patch('/reviews/:id/status', adminController.updateReviewStatus);
router.patch('/plants/bulk-status', adminController.bulkUpdatePlantStatus);
router.patch('/plants/:id/status', adminController.updatePlantStatus);

router.patch('/orders/bulk-status', adminController.bulkUpdateOrderItemStatus);
router.patch('/orders/:orderId/items/:itemId/status', adminController.updateOrderItemStatus);

router.get('/income', adminController.getIncome);

module.exports = router;
