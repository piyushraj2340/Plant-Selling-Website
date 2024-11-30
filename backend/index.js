require('dotenv').config();
require('./src/config/database/db');

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
    tempFileDir: '/tmp',  // Optional, specify a temp file directory (platform dependent)
    limits: { fileSize: 50 * 1024 * 1024 }  // 50MB limit for file uploads

}));

app.use(express.json({ limit: '50mb' }));  // Increase the JSON body size limit to 50MB
app.use(express.urlencoded({ limit: '50mb', extended: true }));  // Increase URL-encoded body size limit



// route 
const authRoute = require("./src/router/auth");
const nurseryRoute = require("./src/router/nurseryRoute/nursery");
const nurseryStoreRoute = require("./src/router/nurseryRoute/nurseryStore");
const plantsRoute = require("./src/router/nurseryRoute/plants");
const products = require("./src/router/products");
const orderRoute = require("./src/router/checkoutRoute/orders");
const user = require("./src/router/userRoute/user");
const cart = require("./src/router/checkoutRoute/cart");
const address = require("./src/router/userRoute/address");
const payment = require("./src/router/checkoutRoute/payment");
const contactUs = require("./src/router/contact");

// route middleware

// secured routes 
app.use('/api/v2/auth', authRoute);
app.use('/api/v2/user', user, cart, orderRoute, address);
app.use("/api/v2/nursery", nurseryRoute, nurseryStoreRoute, plantsRoute);
app.use("/api/v2/checkout", payment);

// public routes
app.use("/api/v2/products", products);
app.use("/api/v2", contactUs);

// Error handling middleware
const errorHandlerMiddleware = require('./src/middleware/errorMiddleware');

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

app.use(errorHandlerMiddleware);

app.listen(port, () => {
    console.log("listening to port 8000");
})
