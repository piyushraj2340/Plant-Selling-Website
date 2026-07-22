const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/adminMiddleware');
const adminController = require('../../controllers/adminController');

// All admin routes must be protected by auth and isAdmin middleware
router.use(auth, isAdmin);

router.get('/stats', adminController.getStats);
// Users Endpoints
router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users/bulk-delete', adminController.bulkDeleteUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.patch('/users/:id/password', adminController.updateUserPassword);
router.patch('/users/:id/block', adminController.toggleBlockUser);
router.patch('/users/:id/verify', adminController.toggleVerifyUser);
router.get('/plants', adminController.getPlants);
router.post('/plants', adminController.adminAddPlant);
router.put('/plants/:id', adminController.adminUpdatePlant);
router.get('/plants/charts/line', adminController.getPlantsLineChart);
router.get('/plants/charts/polar', adminController.getPlantsPolarChart);
router.get('/nurseries', adminController.getNurseries);
router.get('/orders', adminController.getOrders);
router.get('/orders/charts/bar', adminController.getOrdersBarChart);
router.get('/orders/charts/pie', adminController.getOrdersPieChart);

router.post('/impersonate', adminController.impersonateUser);

router.get('/reviews', adminController.getAllReviews);
router.get('/reviews/charts/line', adminController.getReviewsLineChart);
router.get('/reviews/charts/pie', adminController.getReviewsPieChart);
router.patch('/reviews/bulk-status', adminController.bulkUpdateReviewStatus);
router.patch('/reviews/:id/status', adminController.updateReviewStatus);
router.patch('/plants/bulk-status', adminController.bulkUpdatePlantStatus);
router.patch('/plants/:id/status', adminController.updatePlantStatus);

router.patch('/orders/bulk-status', adminController.bulkUpdateOrderItemStatus);
router.patch('/orders/:id/status', adminController.updateOrderItemStatus);

router.get('/income', adminController.getIncome);
router.get('/income/charts/bar', adminController.getIncomeBarChart);
router.get('/income/charts/pie', adminController.getIncomePieChart);

// Coupons Endpoints
router.post('/coupons', adminController.createCoupon);
router.get('/coupons', adminController.getCoupons);
router.patch('/coupons/:id/status', adminController.updateCouponStatus);
router.put('/coupons/:id', adminController.updateCoupon);
router.delete('/coupons/:id', adminController.deleteCoupon);

// Contact Us Endpoints
router.get('/contact-us', adminController.getAllContactMessages);
router.post('/contact-us/:id/reply', adminController.replyToContactMessage);
router.delete('/contact-us/:id', adminController.deleteContactMessage);

module.exports = router;
