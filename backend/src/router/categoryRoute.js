const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/adminMiddleware');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes
router.post('/', auth, categoryController.createCategory);

// Admin routes
router.put('/:id', auth, isAdmin, categoryController.updateCategory);
router.delete('/:id', auth, isAdmin, categoryController.deleteCategory);

module.exports = router;
