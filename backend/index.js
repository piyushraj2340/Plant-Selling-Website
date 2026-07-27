require('dotenv').config();
require('./src/config/database/db');

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cron = require('node-cron');
const seedGuestData = require('./scripts/guestSeed');


const port = process.env.port || 8000;
const app = express();

// express middleware 
app.use(cookieParser());
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
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
const saveForLater = require("./src/router/checkoutRoute/saveForLater");
const address = require("./src/router/userRoute/address");
const payment = require("./src/router/checkoutRoute/payment");
const contactUs = require("./src/router/contact");
const nurseryPublicStore = require('./src/router/nurseryRoute/nurseryPublicStore');
const subscriberEmail = require("./src/router/subscriberEmail");
const adminRoute = require("./src/router/adminRoute/adminRouter");

// secured routes 
app.use('/api/v2/auth', authRoute);
app.use('/api/v2/user', user, cart, orderRoute, address, saveForLater);
app.use("/api/v2/nursery", nurseryRoute, nurseryStoreRoute, plantsRoute);
app.use("/api/v2/checkout", payment);
app.use("/api/v2/admin", adminRoute);

// public routes
const categoryRoute = require("./src/router/categoryRoute");
app.use("/api/v2/categories", categoryRoute);
app.use("/api/v2/products", products);
app.use("/api/v2", contactUs);
app.use("/api/v2/public/nursery", nurseryPublicStore);
app.use("/api/v2", subscriberEmail);

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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true
  }
});

app.set('socketio', io); // Attach io to app so it can be accessed in controllers

io.on('connection', (socket) => {
    console.log('A user connected to socket:', socket.id);
    
    socket.on('join_chat', (chatId) => {
        socket.join(chatId);
        console.log(`Socket ${socket.id} joined chat: ${chatId}`);
    });

    socket.on('send_message', (data) => {
        // data should contain { chatId, message, sender }
        // Broadcast to others in the room
        socket.to(data.chatId).emit('receive_message', data);
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(port, () => {
    console.log("listening to port " + port);
});

// Run Guest Data Seed at 12:00 AM (Midnight) Every Day
cron.schedule('0 0 * * *', () => {
    console.log("Running scheduled nightly guest data reset at midnight...");
    seedGuestData();
});


