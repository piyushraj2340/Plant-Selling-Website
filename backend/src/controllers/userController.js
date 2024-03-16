const { default: mongoose } = require('mongoose');
const userModel = require('../model/user');
const { deleteResourcesByPrefix, deleteFolder } = require('../utils/uploadImages');
const nurseryStores = require('../model/nurseryStore');
const plantModel = require('../model/plants');
const nurseryModel = require('../model/nursery');
const addressModel = require('../model/address');
const cartModel = require('../model/cart');

exports.getUserProfile = async (req, res, next) => {
    try {
        const result = await userModel.findOne({ _id: req.user }).select({ password: 0, tokens: 0, __v: 0 });

        //! If the user does not exist
        if (!result) {
            const error = new Error("Authentication Failed");
            error.statusCode = 401;
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
