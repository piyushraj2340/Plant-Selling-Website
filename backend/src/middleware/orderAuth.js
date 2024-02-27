// jsonwebtoken to generate secret
const jwt = require('jsonwebtoken');



const orderAuth = async (req, res, next) => {
    try {

        const token = req.cookies.orderSession;

        if (!token) throw new Error("Invalid Order Session.");


        // verify the jwt token and return the document to identify the uniqueness 
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        // verify the user and call the next() method to validate the authentication
        if (verifyToken) {

            // checking for the same user 
            // supposes user logged in and go to checkout session and goes logout
            // while logged out I have removed both the cookie: user authentication and the order session 
            // but any how the cookie of the order session not removed and new user logged then the same session will be active and this will create a issue>..

            if (req.user.toString() !== verifyToken.userId.toString()) throw new Error("Invalid Order Session");

            req.orderUser = req.user;

            next();
        } else {
            throw new Error("Order Session Timed out.");
        }

    } catch (error) {
        const info = {
            status: false,
            message: error.message || "Authentication failed",
        }
        console.log(error);
        res.status(401).send(info);
    }

}



module.exports = orderAuth;