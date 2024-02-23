const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const auth = require('../middleware/auth');

router.use(auth);

router.route('/payments').post(async (req, res) => {
    try {
        if (req.user) {
            const myPayment = await stripe.paymentIntents.create({
                description: 'Software development services',
                shipping: {
                    name: req.body.address.name,
                    address: {
                        line1: req.body.address.address,
                        postal_code: req.body.address.pinCode,
                        city: req.body.address.city,
                        state: req.body.address.state,
                        country: "India", // seating the default country.
                    },
                },
                amount: req.body.amount * 100,
                currency: "inr",
                metadata: {
                    company: "PlantSeller",
                    user: req.body.user.userId,
                    email: req.body.user.email,
                    products: [
                        {
                            product: req.body.product.productId,
                            productName: req.body.product.productName,
                            seller: req.body.seller.sellerId,
                            sellerName: req.body.seller.sellerName,
                        }
                    ]
                }
            });


            if (myPayment) {
                const info = {
                    status: true,
                    message: "Payment intents created.",
                    result: {
                        client_secret: myPayment.client_secret,
                        amount: req.body.amount * 100
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

router.get('/stripe/public/key', async (req, res) => {
    try {
        if (req.user) {
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
})

module.exports = router;