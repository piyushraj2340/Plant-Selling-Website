const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');

const { kv } = require('@vercel/kv');

const auth = require('../middleware/auth');
const orderAuth = require('../middleware/orderAuth');

router.use(auth);

// checkout routes
router.post("/", async (req, res) => {
    try {
        const userId = req.user;
        const { cartOrProducts, shippingInfo, pricing } = req.body;
        
        const resultCartOrProducts = await kv.json.set(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:cartOrProducts`, "$", JSON.stringify(cartOrProducts));
        const expireCartOrProducts = await kv.expire(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:cartOrProducts`, 1800);

        const resultShippingInfo = await kv.json.set(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:shipping`, "$", JSON.stringify(shippingInfo));
        const expireShippingInfo = await kv.expire(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:shipping`, 1800);

        const resultPricing = await kv.json.set(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:pricing`, "$", JSON.stringify(pricing));
        const expirePricing = await kv.expire(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:pricing`, 1800);

        
        if (!resultCartOrProducts || !expireCartOrProducts || !resultShippingInfo || !expireShippingInfo || !resultPricing || !expirePricing) { throw new Error("Unable to create session!.") }

        const token = jwt.sign({ userId: userId.toString() }, process.env.SECRET_KEY, { expiresIn: "30m" });

        res.cookie('orderSession', token, {
            expires: new Date(Date.now() + 1000 * 60 * 2),
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })

        const info = {
            status: true,
            message: "Successfully added the cart or product info.",
        }

        res.status(200).send(info);

    } catch (error) {
        const info = {
            status: false,
            message: error.message
        }
        console.log(error);
        res.status(500).send(info);
    }
})

// authentication order session
router.use(orderAuth);

router.get("/", async (req, res) => {
    try {
        const userId = req.orderUser;

        const result = await kv.json.get(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:cartOrProducts`);

        if (result) {
            const info = {
                status: true,
                message: "Order Session is active!.",
                result
            }
            res.status(200).send(info);
        } else {
            const info = {
                status: false,
                message: "Order Session is expired!. Please try again."
            }
            res.status(401).send(info);
        }
    } catch (error) {
        const info = {
            status: false,
            message: error.message
        }
        console.log(error);
        res.status(500).send(info);
    }
})


// checkout -> shipping routes
router.route('/shipping').post(async (req, res) => {
    try {
        const userId = req.orderUser;
        const shipping = req.body;
        
        const result = await kv.json.set(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:shipping`, "$", JSON.stringify(shipping));
        const expire = await kv.expire(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:shipping`, 1800);

        const info = {
            status: true,
            message: "Successfully added the Shipping info.",
            result: {
                result,
                expire
            }
        }

        res.status(200).send(info);

    } catch (error) {
        const info = {
            status: false,
            message: error.message
        }
        console.log(error);
        res.status(500).send(info);
    }
}).get(async (req, res) => {
    try {
        const userId = req.orderUser;

        const result = await kv.json.get(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:shipping`);

        if (result) {
            const info = {
                status: true,
                message: "Order Session is active!.",
                result
            }
            res.status(200).send(info);
        } else {
            const info = {
                status: false,
                message: "Order Session is expired!. Please try again."
            }
            res.status(401).send(info);
        }
    } catch (error) {
        const info = {
            status: false,
            message: error.message
        }
        console.log(error);
        res.status(500).send(info);
    }
})

// checkout -> confirm routes
router.get('/confirm', async (req, res) => {
    try {
        const userId = req.orderUser;

        const cartOrProductInfo = await kv.json.get(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:cartOrProducts`);
        const shippingInfo = await kv.json.get(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:shipping`);
        const pricing = await kv.json.get(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:pricing`);

        if (!cartOrProductInfo || !shippingInfo || !pricing) throw new Error("Invalid Order Session.");

        const info = {
            status: true,
            message: "Order Session is active!.",
            result: {
                address: shippingInfo,
                cartOrProducts: cartOrProductInfo,
                pricing
            }
        }

        res.status(200).send(info);

    } catch (error) {
        const info = {
            status: false,
            message: error.message
        }
        console.log(error);
        res.status(500).send(info);
    }
})


// checkout -> payments routes
router.post('/payments', async (req, res) => {
    try {
        const userId = req.orderUser

        const shippingInfo = await kv.json.get(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:shipping`);
        const pricing = await kv.json.get(`${process.env.REDIS_VERCEL_KV_DB}:${userId}:pricing`);

        if (!shippingInfo || !pricing) throw new Error("Invalid Order Session.");


        const myPayment = await stripe.paymentIntents.create({
            description: 'Plant Selling website',
            shipping: {
                name: shippingInfo.name,
                address: {
                    line1: shippingInfo.address,
                    postal_code: shippingInfo.pinCode,
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    country: "India", // seating the default country.
                },
            },
            amount: pricing.totalPrice * 100,
            currency: "inr",
            metadata: {
                company: "PlantSeller",
                user: shippingInfo.user,
            }
        });


        if (myPayment) {
            const info = {
                status: true,
                message: "Payment intents created.",
                result: {
                    client_secret: myPayment.client_secret,
                    amount: pricing.totalPrice * 100
                }
            }

            res.status(200).send(info);
        } else {
            const info = {
                status: false,
                message: "Payment not completed.",
            }

            res.status(400).send(info);
        }
    } catch (error) {
        const info = {
            status: false,
            message: error.message
        }
        console.log(error);
        res.status(500).send(info);
    }
});

router.get('/stripe/public/key', async (req, res) => {
    try {
        if (req.orderUser) {
            const info = {
                status: true,
                message: "Sending the stripe public key.",
                result: {
                    stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY
                }
            }

            res.status(200).send(info);
        } else {
            const info = {
                status: false,
                message: "Authentication Failed"
            }
            res.status(401).send(info);
        }
    } catch (error) {
        const info = {
            status: false,
            message: error.message
        }
        console.log(error);
        res.status(500).send(info);
    }
});

module.exports = router;