// jsonwebtoken to generate secret
const jwt = require('jsonwebtoken');

// import the model for user 
const plantsModel = require("../model/plants");


const auth = async (req, res, next) => {
    try {
        // request to the browser for the cookies 
        const token = req.cookies.auth;

        // verify the jwt token and return the document id 
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

        // find the right user from the database 
        const plants = await plantsModel.findOne({ userId: verifyUser._id });

        // verify the user and call the next() method to validate the authentication
        if (plants) {
            req.token = token;
            req.plants = plants;
            next();

        } else {
            next();
            console.log(token);
        }
    } catch (err) {
        next();
        console.log(err);
    }

}



module.exports = auth;