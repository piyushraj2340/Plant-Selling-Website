// jsonwebtoken to generate secret
const jwt = require('jsonwebtoken');

// import the model for user 
const userModel = require('../model/userModel/user');
const nurseryModel = require('../model/nurseryModel/nursery');


const auth = async (req, res, next) => {
    try {
        //? request to the browser for the cookies 
        //? Remove the cookie based authentication and implemented the Bearer authentication in the headers 
        // const token = req.cookies.auth;

        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error("Authentication failed");
            error.statusCode = 403;
            throw error;
        }

        const token = authHeader.split(' ')[1];

        //! if the token is null
        if (token === null || token === undefined || token === "" || token === "null" || token === "undefined" || token === "") {
            const error = new Error("Authentication failed");
            error.statusCode = 403;
            throw error;
        };

        //? verify the jwt token and return the document id 
        const verifyUser = jwt.verify(token, process.env.ACCESS_SECRET_KEY);

        if(!verifyUser) {
            const error = new Error("Authentication failed!");
            error.statusCode = 403;
            throw error;
        }

        //? find the right user from the database 
        const user = await userModel.findOne({ _id: verifyUser._id }).select({ _id: 1, role: 1, isUserVerified: 1 });

        //! if user not found
        if (!user) {
            const error = new Error("Authentication failed");
            error.statusCode = 403;
            throw error;
        }

        //! if user is not verified
        if (!user.isUserVerified) {
            const error = new Error("Your Account is not verified please login and verify your account");
            error.statusCode = 403;
            throw error;
        }

        req.token = token;
        req.user = user._id;
        req.role = user.role;

        if (req.role.includes("seller")) {
            const nursery = await nurseryModel.findOne({ user: user._id }).select({ _id: 1 });
            req.nursery = nursery._id;
        }

        next();

    } catch (error) {
        next(error); //! Pass the error to the error handling middleware
    }

}



module.exports = auth;