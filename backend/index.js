require('dotenv').config();
require('./src/db/db');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');


const port = process.env.port || 8000;
const app = express();

// express middleware 
app.use(cookieParser());
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true
    }
));

app.use(fileUpload({
    useTempFiles: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



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

// route middleware

// secured routes 
app.use('/api/v2/auth', authRoute);
app.use('/api/v2/user', user, address);
app.use("/api/v2/nursery", nurseryRoute, nurseryStoreRoute, plantsRoute);
app.use("/api/v2/checkout", orderRoute, cart, payment);

// public routes
app.use("/api/v2/products", products);



// if (process.env.NODE_ENV == 'production') {
//     app.use(express.static(path.resolve(__dirname, 'client', 'build')));
//     app.get('/', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//     })
// } else {
//     app.use(express.static(path.resolve(__dirname, 'client', 'build')));
// }

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// })


app.get('*', (req, res) => {
    res.status(200).send("Welcome to Plant Selling Website." + "<br />" + "Frontend App: " + `<a href="${process.env.FRONTEND_URL}" target="_blank">${process.env.FRONTEND_URL}</a>`);
});

app.listen(port, () => {
    console.log("listening to port 8000");
})
