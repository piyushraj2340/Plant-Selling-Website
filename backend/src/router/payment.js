const router = require('express').Router();

const auth = require('../middleware/auth');
const orderAuth = require('../middleware/orderAuth');
const { createOrderSession, getOrderSession, addShippingInfo, getShippingInfo, confirmOrder, processPayment, getStripePublicKey } = require('../controllers/paymentController');

router.use(auth);

// checkout routes
router.post("/", createOrderSession);

// authentication order session
router.use(orderAuth);

router.get("/", getOrderSession);


// checkout -> shipping routes
router.route('/shipping')
    .post(addShippingInfo)
    .get(getShippingInfo);

// checkout -> confirm routes
router.get('/confirm', confirmOrder);


// checkout -> payments routes
router.post('/payments', processPayment);

router.get('/stripe/public/key', getStripePublicKey);

module.exports = router;