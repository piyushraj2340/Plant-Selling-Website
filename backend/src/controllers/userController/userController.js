const { default: mongoose } = require('mongoose');
const { deleteResourcesByPrefix, deleteFolder, uploadImage } = require('../../utils/uploadImages');
const bcryptjs = require('bcryptjs');

const userModel = require('../../model/userModel/user');
const nurseryStoreTabs = require('../../model/nurseryModel/nurseryStoreTabs');
const nurseryStoreTemplates = require('../../model/nurseryModel/nurseryStoreTemplates');
const nurseryStoreBlocks = require('../../model/nurseryModel/nurseryStoreBlocks');
const plantModel = require('../../model/nurseryModel/plants');
const nurseryModel = require('../../model/nurseryModel/nursery');
const addressModel = require('../../model/userModel/address');
const cartModel = require('../../model/checkoutModel/cart');
const { getData, deleteData } = require('../../utils/redisVercelKv');
const orderModel = require('../../model/checkoutModel/orders');
const nurseryStoreContact = require('../../model/nurseryModel/nurseryStoreContact');


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

        const { _id, name, phone, gender, age } = req.body;

        if (_id.toString() !== req.user.toString()) {
            const error = new Error("Authentication Failed");
            error.statusCode = 403;
            throw error;
        }

        const updates = {};
        if (name !== null && name !== undefined) updates.name = name;
        if (phone !== null && phone !== undefined) updates.phone = phone;
        if (gender !== null && gender !== undefined) updates.gender = gender;
        if (age !== null && age !== undefined) updates.age = age;

        const result = await userModel.findOneAndUpdate({ _id: req.user }, {
            $set: updates
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
            throw error;
        }

        //? Delete the information related to the user....
        await addressModel.deleteMany({ user: req.user }, { session });
        await cartModel.deleteMany({ user: req.user }, { session });
        await orderModel.deleteMany({ user: req.user }, { session });
        await nurseryStoreContact.deleteMany({ user: req.user }, { session });

        if (req.nursery) {
            await nurseryModel.findOneAndDelete({ _id: req.nursery, user: req.user }, { session });
            await nurseryStoreTabs.deleteMany({ user: req.user, nursery: req.nursery }, { session });
            await nurseryStoreTemplates.deleteMany({ user: req.user, nursery: req.nursery }, { session });
            await nurseryStoreBlocks.deleteMany({ user: req.user, nursery: req.nursery }, { session });
            await nurseryStoreContact.deleteMany({ nursery: req.nursery }, { session });
            await plantModel.deleteMany({ user: req.user, nursery: req.nursery }, { session });

            //TODO: delete the implementations of deleting the order data, review, save for latter, wishList and all if needed.


            await deleteResourcesByPrefix(`PlantSeller/user/${req.user}`, {
                type: 'upload',
                resource_type: 'image',
                invalidate: true
            })

            await deleteFolder(`PlantSeller/user/${req.user}`);
        }

        //? Remove the cookie based authentication and implemented the Bearer authentication in the headers 
        // res.clearCookie('auth', {
        //     sameSite: 'none',
        //     secure: true
        // });

        // res.clearCookie('orderSession', {
        //     sameSite: 'none',
        //     secure: true
        // });

        const info = {
            status: true,
            message: "User profile deleted successfully",
        };

        await session.commitTransaction();
        res.status(200).send(info);
    } catch (error) {
        await session.abortTransaction();
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
        if (!user) {
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
        if (!user) {
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

        if (!password || !confirmPassword) {
            const error = new Error("Password Parameter Missing");
            error.statusCode = 405;
            throw error;
        }

        if (password !== confirmPassword) {
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

exports.uploadProfileImage = async (req, res, next) => {
    try {

        if (!req.files) {
            const error = new Error("Invalid Images to upload.");
            error.statusCode = 400;
            throw error;
        }

        let image;
        if (req.body.type === "avatar") {
            image = req.files.avatar;
        } else {
            const error = new Error("Invalid File Upload.");
            error.statusCode = 400;
            throw error;
        }

        const upload = await uploadImage(image, {
            folder: `PlantSeller/user/${req.user}/profile`,
            tags: req.body.type,
        });

        const { public_id, secure_url } = upload;

        image = {
            public_id,
            url: secure_url
        }

        const result = await userModel.findOneAndUpdate({ _id: req.user }, {
            $set: {
                avatar: image
            },
            $push: {
                avatarList: image
            }
        }, {
            new: true
        });

        if (!result) {
            const error = new Error("Failed to update image.");
            error.statusCode = 400;
            throw error;
        }

        const info = {
            status: true,
            message: "Image updated successfully.",
            result
        };

        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};

exports.ChangePassword = async (req, res, next) => {
    try {
        const userId = req.user;

        //! User ID does not exist
        if (!userId) {
            const error = new Error("Unauthorized access");
            error.statusCode = 403;
            throw error;
        }
        //* Fetch user from the database
        const user = await userModel.findById(userId);

        //! If user does not exist
        if (!user) {
            const error = new Error("Invalid User");
            error.statusCode = 401;
            throw error;
        }

                //* Extracting passwords from the request body
        let { previousPassword, password } = req.body;

        //* Verify the previous password matches
        const isMatch = await bcryptjs.compare(previousPassword, user.password); // Assuming `comparePassword` is defined in your user schema
        if (!isMatch) {
            const error = new Error("Previous password is incorrect");
            error.statusCode = 403;
            throw error;
        }

        //* Update user's password
        user.password = password;
        await user.save();

        //* Respond to the client
        const info = {
            status: true,
            message: "Password updated successfully",
        };

        res.status(200).send(info);
    } catch (error) {
        next(error); //! Pass the error to the error handling middleware
    }
};

exports.EnableDisableTwoFactorAuthentication = async (req, res, next) => {
    try {
        //* Getting user from the request object (assuming authentication middleware adds user info to `req.user`)
        const userId = req.user;

        //! User ID does not exist
        if (!userId) {
            const error = new Error("Unauthorized access");
            error.statusCode = 403;
            throw error;
        }

        const { isTwoFactorAuthEnabled } = req.body;

        if (isTwoFactorAuthEnabled === undefined || isTwoFactorAuthEnabled === null) {
            const error = new Error("Two Factor Authentication Parameter is required");
            error.statusCode = 400;
            throw error;
        }

        //* Fetch user from the database
        const user = await userModel.findOneAndUpdate({ _id: userId }, {
            $set: {
                isTwoFactorAuthEnabled
            }
        }, {
            new: true
        }).select({ password: 0, tokens: 0, __v: 0 });

        //! If user does not exist
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }


        //* Respond to the client
        const info = {
            status: true,
            message: "Two Factor Authentication status updated successfully",
            result: user
        };

        res.status(200).send(info);
    } catch (error) {
        next(error); //! Pass the error to the error handling middleware
    }
}