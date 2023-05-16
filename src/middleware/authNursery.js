// jsonwebtoken to generate secret
const jwt = require('jsonwebtoken');

// import the model for user 
const nurseryModel = require("../model/nursery");


const auth = async (req, res, next) => {
    try {
        // request to the browser for the cookies 
        const token = req.cookies.auth;

        // verify the jwt token and return the document id 
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

        // find the right user from the database 
        const nursery = await nurseryModel.findOne({ userId: verifyUser._id });

        // verify the user and call the next() method to validate the authentication
        if (nursery) {
            req.token = token;
            req.nursery = nursery;
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