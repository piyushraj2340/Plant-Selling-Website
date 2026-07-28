const router = require('express').Router();

const auth = require('../middleware/auth');

const { signUp, checkUser, logout, signIn, guestLogin, resetUserPassword, refreshToken, validateOtp, validateOtpToken, resendOtp } = require('../controllers/authController');
const validateSignup = require('../controllers/userController/Validations/validateSignup');

router.post('/resetPassword', resetUserPassword);

router.post('/sign-up',validateSignup, signUp);

router.post('/sign-in', signIn);

router.post('/guest-login', guestLogin);

const seedGuestData = require('../../scripts/guestSeed');
router.get('/seed-guest-data', async (req, res) => {
    try {
        await seedGuestData();
        res.status(200).json({ status: true, message: "Guest data seeded successfully via API" });
    } catch (error) {
        res.status(500).json({ status: false, message: "Seeding failed", error: error.message });
    }
});

router.post('/refresh-token', refreshToken);

router.route('/validateOtp/:token')
    .get(validateOtpToken)
    .post(validateOtp);

router.route('/resendOtp/:token')
    .post(resendOtp);

//* Auth Middleware
//? Protected Routes After auth middleware
router.use(auth);

router.get('/logout', logout);
router.get('/checkUser', checkUser);


module.exports = router;