const router = require('express').Router();

const auth = require('../middleware/auth');

const { signUp, checkUser, logout, signIn, resetUserPassword, refreshToken } = require('../controllers/authController');

router.post('/resetPassword', resetUserPassword);

router.post('/sign-up', signUp);

router.post('/sign-in', signIn);

router.post('/refresh-token', refreshToken);

//* Auth Middleware
//? Protected Routes After auth middleware
router.use(auth);

router.get('/logout', logout);
router.get('/checkUser', checkUser);


module.exports = router;