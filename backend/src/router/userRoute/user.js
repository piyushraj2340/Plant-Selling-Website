const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    verifyUser,
    validateVerificationToken,
    validatePasswordRestToken,
    ResetPassword, uploadProfileImage,
    ChangePassword,
    EnableDisableTwoFactorAuthentication
} = require('../../controllers/userController/userController');
const validatePasswordChange = require('../../controllers/userController/Validations/validatePasswordChange');

// public routes not required the auth middleware
router.route('/verification/:token').post(verifyUser);
router.route('/validateVerificationToken/:token').post(validateVerificationToken)
router.route('/validatePasswordResetToken/:token').post(validatePasswordRestToken)
router.route('/resetPassword/:token').post(ResetPassword)

router.use(auth);

router.route('/profile')
    .get(getUserProfile)
    .patch(updateUserProfile)
    .delete(deleteUserProfile);

router.route('/profile/changePassword')
    .post(validatePasswordChange,ChangePassword);

router.route('/profile/two-factor/update')
    .post(EnableDisableTwoFactorAuthentication);

router.route('/profile/images')
    .post(uploadProfileImage);


module.exports = router;