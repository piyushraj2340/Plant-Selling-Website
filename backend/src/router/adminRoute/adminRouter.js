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
router.patch('/reviews/:id/status', adminController.updateReviewStatus);

module.exports = router;
