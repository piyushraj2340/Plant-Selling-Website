// const stripe = require('stripe')('sk_test_51Mh3nrSG2OBM7gGqYliQervsXmac5hUFnGL7QTvcMDGR660smHtvnX7ashBsvy21gC4Aq6hX4bPPwJ8fjwnj7SMJ00ksDhcser');
require('dotenv').config();
require('./src/db/db');


const express = require('express');
const app = express();
const fileUpload = require('express-fileUpload');

const cookieParser = require('cookie-parser');

const path = require('path');
const port = process.env.port || 8000;


const YOUR_DOMAIN = 'https://plant-selling-website-backend.vercel.app/';

app.use(fileUpload({
    useTempFiles: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
// const staticPath = path.join(__dirname, "../client");
// app.use(express.static(staticPath));


// route 
const authRoute = require("./src/router/auth");
const nurseryRoute = require("./src/router/nursery");
const nurseryStoreRoute = require("./src/router/nurseryStore");
const plantsRoute = require("./src/router/plants");
const products = require("./src/router/products");
const orderRoute = require("./src/router/orders");
const user = require("./src/router/user");
const cart = require("./src/router/cart");
const address = require("./src/router/address");
const payment = require("./src/router/payment");


app.use('/api/v2/auth', authRoute);
app.use('/api/v2/user', user);
app.use("/api/v2", nurseryRoute);
app.use("/api/v2", nurseryStoreRoute);
app.use("/api/v2", plantsRoute);
app.use("/orders", orderRoute);
app.use("/products", products);
app.use("/api/v2", cart);
app.use("/api/v2", address);
app.use("/api/v2", payment);

// app.post("/payments", async (req, res) => {
//     try {
//         const data = req.body;
//         // console.log(data);

//         const session = await stripe.checkout.sessions.create({
//             line_items: [
//                 {
//                     price_data: {
//                         currency: "INR",
//                         product_data: {
//                             name: data.plantsName,
//                         },
//                         unit_amount: (Math.round(data.price - data.discount / 100 * data.price)) * 100
//                     },
//                     quantity: data.quantity,
//                 }
//             ],
//             mode: 'payment',
//             success_url: `${YOUR_DOMAIN}/success`,
//             cancel_url: `${YOUR_DOMAIN}/cancel`,
//         });

//         const result = {
//             status: true,
//             message: "Transition in progress!...",
//             link: session.url
//         }

//         res.send(result);
//     } catch (error) {
//         const result = {
//             status: false,
//             message: "Something Went Wrong!...",
//         }

//         console.log(error);
//         res.send(result);
//     }
// })


// if (process.env.NODE_ENV == 'production') {
//     app.use(express.static(path.resolve(__dirname, 'client' , 'build')));
//     app.get('/', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client' , 'build', 'index.html'));
//     })
// } else {
//     app.use(express.static(path.resolve(__dirname, 'client' , 'build')));
// }

app.get('/', (req, res) => {
    res.send("Welcome to Plant Selling Website");
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
})


app.listen(port, () => {
    console.log("listening to port 8000");
})
