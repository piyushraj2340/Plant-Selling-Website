const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { getUserProfile, updateUserProfile, deleteUserProfile } = require('../controllers/userController');
router.use(auth);

router.route('/profile')
    .get(getUserProfile)
    .patch(updateUserProfile)
    .delete(deleteUserProfile);

module.exports = router;