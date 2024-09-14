const router = require('express').Router();

const auth = require('../middleware/auth');

const { signUp, checkUser, logout, signIn, resetUserPassword } = require('../controllers/authController');

router.post('/resetPassword', resetUserPassword);

router.post('/sign-up', signUp);

router.post('/sign-in', signIn);


//* Auth Middleware
//? Protected Routes After auth middleware
router.use(auth);

router.get('/logout', logout);
router.get('/checkUser', checkUser);


module.exports = router;