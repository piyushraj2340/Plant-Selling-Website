// jsonwebtoken to generate secret
const jwt = require('jsonwebtoken');

// import the model for user 
const userModel = require('../model/user');
const nurseryModel = require('../model/nursery');


const auth = async (req, res, next) => {
    try {
        //? request to the browser for the cookies 
        const token = req.cookies.auth;

        //! if the token is null
        if (!token) {
            const error = new Error("Authentication failed");
            error.statusCode = 401;
            throw error;
        };

        //? verify the jwt token and return the document id 
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

        //? find the right user from the database 
        const user = await userModel.findOne({ _id: verifyUser._id }).select({ _id: 1, role: 1 });

        //! if user not found
        if (!user) {
            const error = new Error("Authentication failed");
            error.statusCode = 401;
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