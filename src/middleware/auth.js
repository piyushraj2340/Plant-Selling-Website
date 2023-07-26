// jsonwebtoken to generate secret
const jwt = require('jsonwebtoken');

// import the model for user 
const userModel = require('../model/user');


const auth = async (req, res, next) => {
    try {
        // request to the browser for the cookies 
        const token = req.cookies.auth;

        // verify the jwt token and return the document id 
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

        // find the right user from the database 
        const user = await userModel.findOne({ _id: verifyUser._id }).select({ _id: 1 });

        // verify the user and call the next() method to validate the authentication
        if (user) {
            req.token = token;
            req._id = user._id;
            next();
        }

    } catch (err) {
        const info = {
            status: false,
            message: "Something Went Wrong!...",
        }
        console.log(err);
        res.status(400).send(info);
    }

}



module.exports = auth;