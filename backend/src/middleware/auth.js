// jsonwebtoken to generate secret
const jwt = require('jsonwebtoken');

// import the model for user 
const userModel = require('../model/user');
const nurseryModel = require('../model/nursery');


const auth = async (req, res, next) => {
    try {
        // request to the browser for the cookies 
        const token = req.cookies.auth;

        if(!token) throw new Error("User must be logged in.");

        // verify the jwt token and return the document id 
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

        // find the right user from the database 
        const user = await userModel.findOne({ _id: verifyUser._id }).select({ _id: 1, role: 1 });

        // verify the user and call the next() method to validate the authentication
        if (user) {
            req.token = token;
            req.user = user._id;
            req.role = user.role;

            if (req.role.includes("seller")) {
                const nursery = await nurseryModel.findOne({ user: user._id }).select({ _id: 1 });
                req.nursery = nursery._id;
            }

            next();
        } else {
            throw new Error("Authentication failed");
        }

    } catch (err) {
        const info = {
            status: false,
            message: err.message || "Authentication failed",
        }
        console.log(err);
        res.status(401).send(info);
    }

}



module.exports = auth;