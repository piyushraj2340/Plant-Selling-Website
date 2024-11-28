// routes/contact.js
const express = require('express');
const router = express.Router();
const { GetInTouch } = require('../controllers/contactController');

// Route to handle contact form submissions
router.post('/contact-us', GetInTouch);

module.exports = router;
