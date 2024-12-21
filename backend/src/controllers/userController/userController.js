const { default: mongoose } = require('mongoose');
const { deleteResourcesByPrefix, deleteFolder } = require('../../utils/uploadImages');

const userModel = require('../../model/userModel/user');
const nurseryStores = require('../../model/nurseryModel/nurseryStoreTabs');
const plantModel = require('../../model/nurseryModel/plants');
const nurseryModel = require('../../model/nurseryModel/nursery');
const addressModel = require('../../model/userModel/address');
const cartModel = require('../../model/checkoutModel/cart');
const { getData, deleteData } = require('../../utils/redisVercelKv');

exports.getUserProfile = async (req, res, next) => {
    try {
        const result = await userModel.findOne({ _id: req.user }).select({ password: 0, tokens: 0, __v: 0 });

        //! If the user does not exist
        if (!result) {
            const error = new Error("Authentication Failed");
            error.statusCode = 403;
            throw error;
        }

        const info = {
            status: true,
            message: "User Data",
            result
        }

        res.status(200).send(info);

    } catch (error) {
        next(error); //! Pass the error to the error handling middleware
    }
};

exports.updateUserProfile = async (req, res, next) => {
    try {

        //* role can't be changed directly 
        if (req.body.role) {
            const error = new Error("You are not allowed to update role fields.");
            error.statusCode = 403;
            throw error;
        }

        const result = await userModel.findOneAndUpdate({ _id: req.user }, {
            $set: req.body
        }, {
            new: true
        }).select({ password: 0, tokens: 0, __v: 0 });

        if (!result) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "User profile updated successfully",
            result
        }

        res.status(200).send(info);

    } catch (error) {
        next(error); //! Pass the error to the error handling middleware
    }
};

exports.deleteUserProfile = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const userId = req.user;

        const deletedUser = await userModel.findOneAndDelete({ _id: userId }, { session });

        if (!deletedUser) {
            const error = new Error("User not found");
            error.statusCode = 404;
            await session.abortTransaction();
            throw error;
        }

        if (req.nursery) {
            await nurseryModel.findOneAndDelete({ _id: req.nursery, user: req.user }, { session });
            await nurseryStores.deleteMany({ user: req.user, nursery: req.nursery }, { session });
            await plantModel.deleteMany({ user: req.user, nursery: req.nursery }, { session });
            await addressModel.deleteMany({ user: req.user }, { session });
            await cartModel.deleteMany({ user: req.user }, { session });

            //TODO: delete the implementations of deleting the order data, review, save for latter, wishList and all if needed.


            await deleteResourcesByPrefix(`PlantSeller/user/${req.user}`, {
                type: 'upload',
                resource_type: 'image',
                invalidate: true
            })

            await deleteFolder(`PlantSeller/user/${req.user}`);
        }

        res.clearCookie('auth', {
            sameSite: 'none',
            secure: true
        });

        res.clearCookie('orderSession', {
            sameSite: 'none',
            secure: true
        });

        const info = {
            status: true,
            message: "User profile deleted successfully",
        };

        await session.commitTransaction();
        res.status(200).send(info);
    } catch (error) {
        next(error); //! Pass the error to the error handling middleware
    } finally {
        await session.endSession();
    }
};


exports.validateVerificationToken = async (req, res, next) => {
    const { token } = req.params;

    try {
        //! Token does not exist
        if (!token) {
            const error = new Error("Invalid Token Parameters");
            error.statusCode = 404;
            throw error;
        }

        //^ Get data form the redis database
        const userData = await getData('root', token, 'verifyUser');

        //! User does not exist in the redis db or the user token got expired after few minutes 
        if (!userData) {
            const error = new Error("Token Expired or does not exist");
            error.statusCode = 404;
            throw error;
        }

        const user = await userModel.findById(userData.userId);

        //! User does not exist in the actual database
        if(!user) {
            const error = new Error("Token Expired or does not exist");
            error.statusCode = 405;
            throw error;
        }


        const info = {
            status: true,
            message: "Token is valid",
        }

        res.status(200).send(info);


    } catch (error) {
        next(error); //! Pass the error to the error handling middleware
    }
}


exports.validatePasswordRestToken = async (req, res, next) => {
    const { token } = req.params;

    try {
        //! Token does not exist
        if (!token) {
            const error = new Error("Invalid Token Parameters");
            error.statusCode = 404;
            throw error;
        }

        //^ Get data form the redis database
        const userData = await getData('root', token, 'resetPassword');

        //! User does not exist in the redis db or the user token got expired after few minutes 
        if (!userData) {
            const error = new Error("Token Expired or does not exist");
            error.statusCode = 404;
            throw error;
        }

        const user = await userModel.findById(userData.userId);
        
        //! User does not exist in the actual database
        if(!user) {
            const error = new Error("Token Expired or does not exist");
            error.statusCode = 400;
            throw error;
        }

        const info = {
            status: true,
            message: "Token is valid",
        }

        res.status(200).send(info);

    } catch (error) {
        next(error); //! Pass the error to the error handling middleware
    }
}



exports.ResetPassword = async (req, res, next) => {
    const { token } = req.params;
    try {

        //! Token does not exist
        if (!token) {
            const error = new Error("Invalid Token Parameters");
            error.statusCode = 404;
            throw error;
        }

        //^ Get data form the redis database
        const userData = await getData('root', token, 'resetPassword'); 

        //! User does not exist in the redis db or the user token got expired after few minutes 
        if (!userData) {
            const error = new Error("Token Expired or does not exist");
            error.statusCode = 404;
            throw error;
        }

        //* Getting Data from the form body
        const { password, confirmPassword } = req.body;

        if(!password || !confirmPassword) {
            const error = new Error("Password Parameter Missing");
            error.statusCode = 405;
            throw error;
        }

        if(password !== confirmPassword) {
            const error = new Error("Password and Confirm Password does not match");
            error.statusCode = 405;
            throw error;
        }

        //^ Checking if the user exists in the mongodb database
        const user = await userModel.findById(userData.userId);

        //! If User does not exist 
        if (!user || userData.userId !== user.id) {

            //* Deleting the token from the redis database
            await deleteData('root', token, 'resetPassword');

            const error = new Error("You are not verified, you may need to re-try");
            error.statusCode = 403;
            throw error;
        }

        //* Updating the user's verification status
        user.password = password;
        await user.save();

        //* Deleting the token from the redis database
        await deleteData('root', token, 'resetPassword');

        const info = {
            status: true,
            message: "Password Changed successfully",
        }

        res.status(200).send(info);
    } catch (error) {
        next(error); //! Pass the error to the error handling middleware
    }
}

exports.verifyUser = async (req, res, next) => {
    const { token } = req.params;
    try {

        //! Token does not exist
        if (!token) {
            const error = new Error("Invalid Token Parameters");
            error.statusCode = 404;
            throw error;
        }

        //^ Get data form the redis database
        const userData = await getData('root', token, 'verifyUser');

        //! User does not exist in the redis db or the user token got expired after few minutes 
        if (!userData) {
            const error = new Error("Token Expired or does not exist");
            error.statusCode = 404;
            throw error;
        }

        //* Getting Data from the form body
        const { isUserVerified } = req.body;


        //^ Checking if the user exists in the mongodb database
        const user = await userModel.findById(userData.userId);

        //! If User does not exist 
        if (!user || !isUserVerified || userData.userId !== user.id) {

            //* Deleting the token from the redis database
            await deleteData('root', token, 'verifyUser');

            const error = new Error("You are not verified, you may need to re-try");
            error.statusCode = 403;
            throw error;
        }

        //* Updating the user's verification status
        user.isUserVerified = true;
        await user.save();

        //* Deleting the token from the redis database
        await deleteData('root', token, 'verifyUser');

        const info = {
            status: true,
            message: "User Verification completed!",
        }

        res.status(200).send(info);
    } catch (error) {
        next(error); //! Pass the error to the error handling middleware
    }
}