// jsonwebtoken to generate secret
const jwt = require('jsonwebtoken');
const auth = require('./auth');



const orderAuth = async (req, res, next) => {
    try {
        //? request to the browser for the cookies 
        //? Remove the cookie based authentication and implemented the Bearer authentication in the headers 
        // const token = req.cookies.orderSession;

        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ') || !authHeader.split(' ')[2] || authHeader.split(' ')[2] !== 'orderToken') {
            const error = new Error("Authentication failed");
            error.statusCode = 403;
            throw error;
        }

        const token = authHeader.split(' ')[3];

        //! if the token is null
        if (!token) {
            const error = new Error("Invalid order session token");
            error.statusCode = 403;
            throw error;
        };

        //? verify the jwt token and return the document to identify the uniqueness 
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        //! if user not found
        if (!verifyToken) {
            const error = new Error("Authentication failed");
            error.statusCode = 403;
            throw error;
        }

        //? verify the user and call the next() method to validate the authentication

        //? checking for the same user 
        //? supposes user logged in and go to checkout session and goes logout
        //? while logged out I have removed both the cookie: user authentication and the order session 
        //? For the token based authentications also remove all the tokens form the local storage...
        //? but any how the cookie of the order session not removed and new user logged then the same session will be active and this will create a issue>..

        //! checking for right user to access the order session
        if (req.user.toString() !== verifyToken.userId.toString()) {
            const error = new Error("Invalid order session for user");
            error.statusCode = 403;
            throw error;
        }

        req.orderUser = verifyToken.userId;
        req.orderToken = token;

        next();

    } catch (error) {
        next(error)
    }

}



module.exports = orderAuth;